-- 1) Drop the role check constraint on access_codes so manager codes are allowed
ALTER TABLE public.access_codes DROP CONSTRAINT IF EXISTS access_codes_role_check;

-- 2) Update handle_new_user: managers also start at pending_code (must enter access code)
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _role public.app_role;
BEGIN
  _role := COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'client');

  INSERT INTO public.profiles (id, full_name, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'pending_code'::public.client_status
  );

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role);

  IF _role = 'employee' THEN
    INSERT INTO public.employees (user_id) VALUES (NEW.id);
  END IF;

  RETURN NEW;
END;
$function$;

-- 3) Update validate_access_code to handle manager role
CREATE OR REPLACE FUNCTION public.validate_access_code(_code text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
  ELSIF _user_role = 'manager' THEN
    UPDATE public.profiles
      SET status = 'assigned', setup_completed = TRUE, updated_at = now()
      WHERE id = _user_id;
  END IF;

  RETURN TRUE;
END;
$function$;