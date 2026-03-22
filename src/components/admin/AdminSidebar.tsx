import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Lightbulb, ShieldAlert, Zap, Cpu, BrainCircuit } from "lucide-react";
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

const specificationSections = [
  {
    label: "FlashApps Generator Specs",
    item: { title: "View FlashApps Specs", url: "/admin/flash-apps", icon: Zap },
  },
  {
    label: "Generated Summaries & Reports Specs",
    item: { title: "View Summaries & Reports", url: "/admin/reports", icon: FileText },
  },
  {
    label: "Quantum Optimization Specs",
    item: { title: "View Quantum Specs", url: "/admin/quantum", icon: Cpu },
  },
  {
    label: "Idea → Action Plan Specs",
    item: { title: "View Idea → Action Plan", url: "/admin/idea-blueprint", icon: Lightbulb },
  },
  {
    label: "AI Recommendation",
    item: { title: "View AI Recommendations", url: "/admin/ai-recommendations", icon: BrainCircuit },
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
              <span className="text-sidebar-foreground">Control Panel</span>
            </>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
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
            <SidebarMenuButton onClick={() => navigate("/dashboard") }>
              <ArrowLeft className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Back to Dashboard</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
