import { LayoutDashboard, Briefcase, BarChart3, Users, User } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/marketing/Logo";

const items = [
  { t: "Dashboard", url: "/app/employee/dashboard", icon: LayoutDashboard },
  { t: "Applications", url: "/app/employee/applications", icon: Briefcase },
  { t: "Clients", url: "/app/employee/clients", icon: Users },
  { t: "Analytics", url: "/app/employee/analytics", icon: BarChart3 },
  { t: "Profile", url: "/app/employee/profile", icon: User },
];

export const EmployeeSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border h-16 flex items-center px-4">
        {collapsed ? (
          <div className="h-9 w-9 rounded-2xl bg-primary flex items-center justify-center font-display font-bold text-primary-foreground text-base shadow-glow">O</div>
        ) : (
          <Logo />
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((it) => (
                <SidebarMenuItem key={it.t}>
                  <SidebarMenuButton asChild isActive={location.pathname === it.url}>
                    <NavLink to={it.url} end>
                      <it.icon className="h-4 w-4" />
                      {!collapsed && <span>{it.t}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
