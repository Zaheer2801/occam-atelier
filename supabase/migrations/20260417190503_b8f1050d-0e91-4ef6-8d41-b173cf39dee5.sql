-- Enums
CREATE TYPE public.app_role AS ENUM ('manager', 'employee', 'client');
CREATE TYPE public.application_status AS ENUM ('applied', 'screening', 'interview', 'offer', 'rejected', 'withdrawn');

-- Updated_at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  company_name TEXT,
  setup_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- user_roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role security definer
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- employees
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  manager_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- job_applications
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  position TEXT NOT NULL,
  company TEXT NOT NULL,
  status public.application_status NOT NULL DEFAULT 'applied',
  applied_date DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_job_apps_client ON public.job_applications(client_id);
CREATE INDEX idx_job_apps_status ON public.job_applications(status);
CREATE TRIGGER trg_job_apps_updated BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- activity_logs
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_activity_user ON public.activity_logs(user_id, created_at DESC);

-- RLS profiles
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Managers view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'manager'));

-- RLS user_roles
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Managers view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'manager'));
CREATE POLICY "Managers manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'manager')) WITH CHECK (public.has_role(auth.uid(), 'manager'));

-- RLS employees
CREATE POLICY "Employees view own row" ON public.employees FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Managers view employees" ON public.employees FOR SELECT USING (public.has_role(auth.uid(), 'manager'));
CREATE POLICY "Managers manage employees" ON public.employees FOR ALL USING (public.has_role(auth.uid(), 'manager')) WITH CHECK (public.has_role(auth.uid(), 'manager'));

-- RLS job_applications
CREATE POLICY "Clients manage own applications" ON public.job_applications FOR ALL
  USING (auth.uid() = client_id) WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Employees view all applications" ON public.job_applications FOR SELECT
  USING (public.has_role(auth.uid(), 'employee') OR public.has_role(auth.uid(), 'manager'));
CREATE POLICY "Employees update applications" ON public.job_applications FOR UPDATE
  USING (public.has_role(auth.uid(), 'employee') OR public.has_role(auth.uid(), 'manager'));

-- RLS activity_logs
CREATE POLICY "Users view own activity" ON public.activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own activity" ON public.activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Managers view all activity" ON public.activity_logs FOR SELECT USING (public.has_role(auth.uid(), 'manager'));

-- Signup trigger: create profile + assign default role from metadata (default 'client')
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _role public.app_role;
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));

  _role := COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'client');
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role);

  IF _role = 'employee' THEN
    INSERT INTO public.employees (user_id) VALUES (NEW.id);
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

CREATE POLICY "Users view own resumes" ON storage.objects FOR SELECT
  USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users upload own resumes" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users update own resumes" ON storage.objects FOR UPDATE
  USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own resumes" ON storage.objects FOR DELETE
  USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Managers view all resumes" ON storage.objects FOR SELECT
  USING (bucket_id = 'resumes' AND public.has_role(auth.uid(), 'manager'));