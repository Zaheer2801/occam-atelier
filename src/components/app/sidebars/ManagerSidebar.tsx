import { LayoutDashboard, Users, UserCheck, Briefcase, BarChart3, Settings, Inbox } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/marketing/Logo";

const items = [
  { t: "Overview", url: "/app/manager/overview", icon: LayoutDashboard },
  { t: "Team", url: "/app/manager/team", icon: Users },
  { t: "Clients", url: "/app/manager/clients", icon: UserCheck },
  { t: "Pending", url: "/app/manager/clients/pending", icon: Inbox },
  { t: "Applications", url: "/app/manager/applications", icon: Briefcase },
  { t: "Analytics", url: "/app/manager/analytics", icon: BarChart3 },
  { t: "Settings", url: "/app/manager/settings", icon: Settings },
];

export const ManagerSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border h-16 flex items-center px-4">
        {collapsed ? (
          <div className="h-9 w-9 rounded-2xl bg-primary flex items-center justify-center font-display font-bold text-primary-foreground text-base shadow-glow">R</div>
        ) : (
          <Logo />
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manager</SidebarGroupLabel>
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
