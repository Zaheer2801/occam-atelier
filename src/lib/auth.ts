import { supabase } from "@/integrations/supabase/client";

export type Role = "manager" | "employee" | "client";

export const ROLE_HOME: Record<Role, string> = {
  manager: "/app/manager/overview",
  employee: "/app/employee/dashboard",
  client: "/app/client/dashboard",
};

export async function getUserRole(userId: string): Promise<Role | null> {
  const { data, error } = await supabase.rpc("get_user_role", { _user_id: userId });
  if (error || !data) return null;
  return data as Role;
}
