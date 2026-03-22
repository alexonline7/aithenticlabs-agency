import { useNavigate } from "react-router-dom";
import {
  FileText,
  Users,
  UserCheck,
  KanbanSquare,
  BarChart3,
  ArrowLeft,
  ShieldAlert,
  Code,
  Zap,
  Cpu,
  Lightbulb,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const adminItems = [
  { title: "Blueprints & Reports", url: "/admin", icon: FileText },
  { title: "Tool Specifications", url: "/admin/tool-specs", icon: Code },
  { title: "Users & Clients", url: "/admin/clients", icon: UserCheck },
  { title: "Submissions & Leads", url: "/admin/submissions", icon: Users },
  { title: "Project Board", url: "/admin/projects", icon: KanbanSquare },
  { title: "Analytics & Metrics", url: "/admin/analytics", icon: BarChart3 },
];

const specificationSections = [
  {
    label: "FlashApps Specs",
    item: { title: "FlashApps Generator", url: "/admin/flash-apps", icon: Zap },
  },
  {
    label: "Summaries & Reports Specs",
    item: { title: "Generated Summaries & Reports", url: "/admin/reports", icon: FileText },
  },
  {
    label: "Quantum Specs",
    item: { title: "Quantum Optimization", url: "/admin/quantum", icon: Cpu },
  },
  {
    label: "Idea → Action Plan Specs",
    item: { title: "Idea → Action Plan", url: "/admin/idea-blueprint", icon: Lightbulb },
  },
];

export default function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 font-bold font-bricolage text-lg">
          <ShieldAlert className="h-6 w-6 text-primary shrink-0" />
          {!collapsed && (
            <>
              <span className="gradient-text">Admin</span>
              <span className="text-sidebar-foreground">Panel</span>
            </>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                      activeClassName="bg-sidebar-accent text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {specificationSections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={section.item.url}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                      activeClassName="bg-sidebar-accent text-primary font-medium"
                    >
                      <section.item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{section.item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Back to Dashboard</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
