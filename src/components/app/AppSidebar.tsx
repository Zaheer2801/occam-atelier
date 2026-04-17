import { LayoutDashboard, Briefcase, BarChart3, User, Users } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/marketing/Logo";
import { useAuth } from "@/hooks/useAuth";

const items = [
  { t: "Dashboard", url: "/app/dashboard", icon: LayoutDashboard },
  { t: "Applications", url: "/app/applications", icon: Briefcase },
  { t: "Analytics", url: "/app/analytics", icon: BarChart3 },
  { t: "Profile", url: "/app/profile", icon: User },
];

export const AppSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { roles } = useAuth();
  const location = useLocation();
  const isManager = roles.includes("manager");

  const all = isManager ? [...items, { t: "Team", url: "/app/team", icon: Users }] : items;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border h-16 flex items-center px-4">
        {collapsed ? (
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center font-display font-bold text-primary-foreground text-sm">A</div>
        ) : (
          <Logo />
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {all.map((it) => (
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
