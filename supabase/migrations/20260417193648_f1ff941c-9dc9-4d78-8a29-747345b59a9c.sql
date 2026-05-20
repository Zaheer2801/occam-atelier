-- 1. RPC: get_user_role (returns the highest-priority single role for redirect logic)
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS public.app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY CASE role
    WHEN 'manager' THEN 1
    WHEN 'employee' THEN 2
    WHEN 'client' THEN 3
  END
  LIMIT 1;
$$;

-- 2. Employee <-> Client assignments
CREATE TABLE public.employee_client_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL,
  client_id uuid NOT NULL,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true,
  UNIQUE (employee_id, client_id)
);

ALTER TABLE public.employee_client_assignments ENABLE ROW LEVEL SECURITY;

-- 3. Helper: is the employee currently assigned to the client?
CREATE OR REPLACE FUNCTION public.is_assigned_to_client(_employee_id uuid, _client_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.employee_client_assignments
    WHERE employee_id = _employee_id
      AND client_id = _client_id
      AND is_active = true
  );
$$;

-- 4. RLS for assignments
CREATE POLICY "Managers manage assignments"
  ON public.employee_client_assignments
  FOR ALL
  USING (public.has_role(auth.uid(), 'manager'))
  WITH CHECK (public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Employees view own assignments"
  ON public.employee_client_assignments
  FOR SELECT
  USING (auth.uid() = employee_id);

CREATE POLICY "Clients view own assignments"
  ON public.employee_client_assignments
  FOR SELECT
  USING (auth.uid() = client_id);

-- 5. Tighten job_applications: employees only see assigned clients' apps
DROP POLICY IF EXISTS "Employees view all applications" ON public.job_applications;
DROP POLICY IF EXISTS "Employees update applications" ON public.job_applications;

CREATE POLICY "Managers view all applications"
  ON public.job_applications
  FOR SELECT
  USING (public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Managers update all applications"
  ON public.job_applications
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Managers insert applications"
  ON public.job_applications
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Managers delete applications"
  ON public.job_applications
  FOR DELETE
  USING (public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Employees view assigned applications"
  ON public.job_applications
  FOR SELECT
  USING (
    public.has_role(auth.uid(), 'employee')
    AND public.is_assigned_to_client(auth.uid(), client_id)
  );

CREATE POLICY "Employees update assigned applications"
  ON public.job_applications
  FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'employee')
    AND public.is_assigned_to_client(auth.uid(), client_id)
  );

CREATE POLICY "Employees insert for assigned clients"
  ON public.job_applications
  FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'employee')
    AND public.is_assigned_to_client(auth.uid(), client_id)
  );

-- 6. Allow managers to view all profiles already exists; add employee view of assigned client profiles
CREATE POLICY "Employees view assigned client profiles"
  ON public.profiles
  FOR SELECT
  USING (
    public.has_role(auth.uid(), 'employee')
    AND public.is_assigned_to_client(auth.uid(), id)
  );