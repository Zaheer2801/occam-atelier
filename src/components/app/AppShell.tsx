import { Outlet, useNavigate } from "react-router-dom";
import { Bell, LogOut, User as UserIcon } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ClientSidebar } from "./sidebars/ClientSidebar";
import { EmployeeSidebar } from "./sidebars/EmployeeSidebar";
import { ManagerSidebar } from "./sidebars/ManagerSidebar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useForceLightTheme } from "@/hooks/useTheme";
import { ROLE_HOME } from "@/lib/auth";

const ROLE_LABEL: Record<string, string> = {
  manager: "Manager",
  employee: "Employee",
  client: "Client",
};

export const AppShell = () => {
  useForceLightTheme();
  const { user, role, signOut } = useAuth();
  const nav = useNavigate();

  const initials = (user?.user_metadata?.full_name || user?.email || "?")
    .split(" ").map((s: string) => s[0]).slice(0, 2).join("").toUpperCase();

  const Sidebar =
    role === "manager" ? ManagerSidebar :
    role === "employee" ? EmployeeSidebar :
    ClientSidebar;

  const profilePath =
    role === "manager" ? "/app/manager/settings" :
    role === "employee" ? "/app/employee/profile" :
    "/app/client/profile";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-background/80 backdrop-blur-xl sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              {role && (
                <span className="hidden sm:inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-secondary text-secondary-foreground border border-foreground/10">
                  {ROLE_LABEL[role]} view
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="rounded-full"><Bell className="h-4 w-4" /></Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 px-2 gap-2 rounded-full">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground shadow-glow">{initials}</div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="text-sm font-medium truncate">{user?.user_metadata?.full_name || "Account"}</div>
                    <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => nav(role ? ROLE_HOME[role] : "/")}>
                    <UserIcon className="h-4 w-4 mr-2" /> My dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => nav(profilePath)}>
                    <UserIcon className="h-4 w-4 mr-2" /> {role === "manager" ? "Settings" : "Profile"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={async () => { await signOut(); nav("/"); }}>
                    <LogOut className="h-4 w-4 mr-2" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 p-6 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
