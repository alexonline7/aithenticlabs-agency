import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Zap,
  FileText,
  Rocket,
  MessageSquare,
  TrendingUp,
  Activity,
} from "lucide-react";

const stats = [
  { label: "Active Projects", value: "12", icon: Rocket, trend: "+3 this week", color: "text-primary" },
  { label: "Briefs Generated", value: "47", icon: FileText, trend: "+8 today", color: "text-secondary" },
  { label: "Support Tickets", value: "3", icon: MessageSquare, trend: "2 resolved", color: "text-deep-purple-500" },
  { label: "Quantum Score", value: "94%", icon: Zap, trend: "+2.1%", color: "text-primary" },
];

const recentActivity = [
  { action: "Brief generated", detail: "AI Sales Coach v2.1", time: "2 min ago", status: "completed" },
  { action: "Deployment started", detail: "Language Teacher update", time: "15 min ago", status: "in-progress" },
  { action: "Photo processed", detail: "Hero banner optimization", time: "1 hour ago", status: "completed" },
  { action: "Quantum scan", detail: "Performance audit complete", time: "3 hours ago", status: "completed" },
  { action: "Support reply", detail: "Ticket #1042 responded", time: "5 hours ago", status: "pending" },
];

export default function DashboardOverview() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-bricolage">
          Welcome back, <span className="gradient-text">{user?.email?.split("@")[0] ?? "User"}</span>
        </h1>
        <p className="text-muted-foreground mt-1">Here's your agency overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="dark-slate-purple-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <Badge variant="secondary" className="text-xs">{s.trend}</Badge>
              </div>
              <p className="text-3xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="dark-slate-purple-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center justify-between glass-effect rounded-lg p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{a.action}</p>
                  <p className="text-xs text-muted-foreground">{a.detail}</p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={a.status === "completed" ? "default" : a.status === "in-progress" ? "secondary" : "outline"}
                    className="text-xs"
                  >
                    {a.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{a.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="dark-slate-purple-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { label: "API Response Time", value: 92, unit: "ms avg" },
              { label: "Uptime", value: 99.9, unit: "%" },
              { label: "Quantum Generation Speed", value: 87, unit: "% optimal" },
              { label: "Client Satisfaction", value: 98, unit: "%" },
            ].map((m) => (
              <div key={m.label} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{m.label}</span>
                  <span className="font-medium text-foreground">{m.value}{m.unit === "%" || m.unit === "% optimal" ? m.unit : ` ${m.unit}`}</span>
                </div>
                <Progress value={m.value} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
