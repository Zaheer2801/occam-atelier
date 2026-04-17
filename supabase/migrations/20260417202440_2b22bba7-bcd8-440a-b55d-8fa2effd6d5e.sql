-- 1. Client status enum
CREATE TYPE public.client_status AS ENUM (
  'pending_code',
  'onboarding',
  'resume_review',
  'roles_locked',
  'pending_assignment',
  'assigned',
  'inactive'
);

-- 2. Extend profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS contact_preference TEXT CHECK (contact_preference IN ('email','phone','both')),
  ADD COLUMN IF NOT EXISTS resume_url TEXT,
  ADD COLUMN IF NOT EXISTS parsed_resume JSONB,
  ADD COLUMN IF NOT EXISTS target_roles TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS suggested_roles TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS status public.client_status NOT NULL DEFAULT 'pending_code',
  ADD COLUMN IF NOT EXISTS assigned_employee_id UUID;

-- 3. access_codes table
CREATE TABLE IF NOT EXISTS public.access_codes (
  code TEXT PRIMARY KEY,
  role public.app_role NOT NULL CHECK (role IN ('client','employee')),
  max_uses INT NOT NULL DEFAULT 1,
  used_count INT NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Managers manage access codes"
ON public.access_codes
FOR ALL
USING (public.has_role(auth.uid(), 'manager'))
WITH CHECK (public.has_role(auth.uid(), 'manager'));

-- 4. validate_access_code RPC
CREATE OR REPLACE FUNCTION public.validate_access_code(_code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _row public.access_codes%ROWTYPE;
  _user_id UUID := auth.uid();
  _user_role public.app_role;
BEGIN
  IF _user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  SELECT * INTO _row FROM public.access_codes WHERE code = _code FOR UPDATE;
  IF NOT FOUND THEN RETURN FALSE; END IF;
  IF _row.expires_at IS NOT NULL AND _row.expires_at < now() THEN RETURN FALSE; END IF;
  IF _row.used_count >= _row.max_uses THEN RETURN FALSE; END IF;

  SELECT public.get_user_role(_user_id) INTO _user_role;
  IF _user_role IS DISTINCT FROM _row.role THEN RETURN FALSE; END IF;

  UPDATE public.access_codes SET used_count = used_count + 1 WHERE code = _code;

  IF _user_role = 'client' THEN
    UPDATE public.profiles
      SET status = 'onboarding', setup_completed = TRUE, updated_at = now()
      WHERE id = _user_id;
  ELSIF _user_role = 'employee' THEN
    UPDATE public.profiles
      SET status = 'pending_assignment', setup_completed = TRUE, updated_at = now()
      WHERE id = _user_id;
  END IF;

  RETURN TRUE;
END;
$$;

-- 5. Update handle_new_user to set initial status correctly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role public.app_role;
BEGIN
  _role := COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'client');

  INSERT INTO public.profiles (id, full_name, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE WHEN _role = 'manager' THEN 'assigned'::public.client_status ELSE 'pending_code'::public.client_status END
  );

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role);

  IF _role = 'employee' THEN
    INSERT INTO public.employees (user_id) VALUES (NEW.id);
  END IF;

  RETURN NEW;
END;
$$;

-- 6. Seed test access code
INSERT INTO public.access_codes (code, role, max_uses)
VALUES ('OCAS-CAN-123', 'client', 100)
ON CONFLICT (code) DO NOTHING;

-- 7. Storage policies for resumes bucket (already exists, ensure user-folder policies)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Users upload own resume') THEN
    CREATE POLICY "Users upload own resume"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Users read own resume') THEN
    CREATE POLICY "Users read own resume"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Users update own resume') THEN
    CREATE POLICY "Users update own resume"
      ON storage.objects FOR UPDATE
      USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Managers read all resumes') THEN
    CREATE POLICY "Managers read all resumes"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'resumes' AND public.has_role(auth.uid(), 'manager'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Employees read assigned client resumes') THEN
    CREATE POLICY "Employees read assigned client resumes"
      ON storage.objects FOR SELECT
      USING (
        bucket_id = 'resumes'
        AND public.has_role(auth.uid(), 'employee')
        AND public.is_assigned_to_client(auth.uid(), ((storage.foldername(name))[1])::uuid)
      );
  END IF;
END $$;