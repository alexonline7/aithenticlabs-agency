import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import {
  FileText,
  Rocket,
  MessageSquare,
  TrendingUp,
  Activity,
  Loader2,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ReportRow {
  id: string;
  project_name: string;
  report_type: string;
  created_at: string;
}

interface SubmissionRow {
  id: string;
  submission_type: string;
  status: string;
  created_at: string;
  project_description: string | null;
}

export default function DashboardOverview() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [reportsRes, submissionsRes] = await Promise.all([
        supabase
          .from("generated_reports")
          .select("id, project_name, report_type, created_at")
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("client_submissions")
          .select("id, submission_type, status, created_at, project_description")
          .order("created_at", { ascending: false })
          .limit(10),
      ]);
      setReports((reportsRes.data as ReportRow[]) ?? []);
      setSubmissions((submissionsRes.data as SubmissionRow[]) ?? []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const totalBriefs = reports.length;
  const totalSubmissions = submissions.length;
  const activeProjects = submissions.filter((s) => s.status === "new" || s.status === "in_progress").length;

  const recentActivity = [
    ...reports.map((r) => ({
      action: r.report_type === "ai-brief" ? "Brief generated" : r.report_type === "interview" ? "Blueprint interview" : "Report created",
      detail: r.project_name,
      time: r.created_at,
      status: "completed" as const,
    })),
    ...submissions.map((s) => ({
      action: "Project submitted",
      detail: s.project_description?.slice(0, 60) || "New submission",
      time: s.created_at,
      status: s.status === "new" ? "pending" as const : "completed" as const,
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 6);

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const stats = [
    { label: "Active Projects", value: String(activeProjects), icon: Rocket, color: "text-primary" },
    { label: "Briefs Generated", value: String(totalBriefs), icon: FileText, color: "text-secondary" },
    { label: "Submissions", value: String(totalSubmissions), icon: MessageSquare, color: "text-accent" },
    { label: "Tools Available", value: "2", icon: Sparkles, color: "text-primary" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-bricolage">
          Welcome back, <span className="gradient-text">{user?.email?.split("@")[0] ?? "User"}</span>
        </h1>
        <p className="text-muted-foreground mt-1">Here's your project overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="dark-slate-purple-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <s.icon className={`h-5 w-5 ${s.color}`} />
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
          <CardContent className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">
                No activity yet. Start by exploring our tools!
              </p>
            ) : (
              recentActivity.map((a, i) => (
                <div key={i} className="flex items-center justify-between glass-effect rounded-lg p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.action}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">{a.detail}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={a.status === "completed" ? "default" : "outline"}
                      className="text-xs"
                    >
                      {a.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{formatTime(a.time)}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="dark-slate-purple-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/dashboard/idea-to-blueprint">
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                <Lightbulb className="h-5 w-5 text-primary shrink-0" />
                <div className="text-left">
                  <p className="font-medium text-foreground">Idea → Blueprint</p>
                  <p className="text-xs text-muted-foreground">Chat with AI to explore your concept</p>
                </div>
              </Button>
            </Link>
            <Link to="/dashboard/flash-apps">
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                <Sparkles className="h-5 w-5 text-secondary shrink-0" />
                <div className="text-left">
                  <p className="font-medium text-foreground">Project Generator</p>
                  <p className="text-xs text-muted-foreground">Configure and generate a full project brief</p>
                </div>
              </Button>
            </Link>
            <Link to="/submit-project">
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                <Rocket className="h-5 w-5 text-accent shrink-0" />
                <div className="text-left">
                  <p className="font-medium text-foreground">Submit a Project</p>
                  <p className="text-xs text-muted-foreground">Send us your project details</p>
                </div>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
