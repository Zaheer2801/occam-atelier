INSERT INTO public.access_codes (code, role, max_uses, expires_at)
VALUES ('OCAS-EMP-001', 'employee', 10, now() + interval '90 days')
ON CONFLICT (code) DO NOTHING;