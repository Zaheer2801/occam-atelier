import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getUserRole, Role, ROLE_HOME } from "@/lib/auth";

const DEV_KEY = "atelier:devRole";

const mockUser = (role: Role): User =>
  ({
    id: `dev-${role}`,
    aud: "authenticated",
    role: "authenticated",
    email: `dev.${role}@ocas.internal`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    app_metadata: {},
    user_metadata: {
      full_name: role === "manager" ? "Demo Manager" : role === "employee" ? "Demo Employee" : "Demo Client",
      role,
    },
    identities: [],
  } as unknown as User);

interface AuthCtx {
  user: User | null;
  session: Session | null;
  role: Role | null;
  loading: boolean;
  signOut: () => Promise<void>;
  enterDevMode: (role: Role) => void;
}

const Ctx = createContext<AuthCtx>({
  user: null, session: null, role: null, loading: true,
  signOut: async () => {},
  enterDevMode: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  const resolveRole = async (u: User): Promise<Role | null> => {
    const dbRole = await getUserRole(u.id);
    if (dbRole) return dbRole;
    const meta = u.user_metadata?.role as string | undefined;
    return meta && meta in ROLE_HOME ? (meta as Role) : null;
  };

  useEffect(() => {
    // Check localStorage dev bypass first
    const devRole = localStorage.getItem(DEV_KEY) as Role | null;

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s?.user) {
        setUser(s.user);
        localStorage.removeItem(DEV_KEY); // real auth supersedes dev mode
        setTimeout(async () => setRole(await resolveRole(s.user)), 0);
      } else if (!devRole) {
        setUser(null);
        setRole(null);
      }
    });

    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (s?.user) {
        setSession(s);
        setUser(s.user);
        setRole(await resolveRole(s.user));
      } else if (devRole) {
        // No real session — restore dev bypass from localStorage
        setUser(mockUser(devRole));
        setRole(devRole);
      }
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const enterDevMode = (devRole: Role) => {
    localStorage.setItem(DEV_KEY, devRole);
    setUser(mockUser(devRole));
    setRole(devRole);
  };

  const signOut = async () => {
    localStorage.removeItem(DEV_KEY);
    setUser(null);
    setRole(null);
    await supabase.auth.signOut();
  };

  return (
    <Ctx.Provider value={{ user, session, role, loading, signOut, enterDevMode }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => useContext(Ctx);
