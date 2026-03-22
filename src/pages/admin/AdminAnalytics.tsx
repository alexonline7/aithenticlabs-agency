import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, FileText, Users, KanbanSquare, TrendingUp, Activity, Clock, Zap } from "lucide-react";
import { Loader2 } from "lucide-react";

interface AnalyticsData {
  totalReports: number;
  totalSubmissions: number;
  totalProjects: number;
  reportsByType: Record<string, number>;
  submissionsByStatus: Record<string, number>;
  projectsByStatus: Record<string, number>;
  conversionRate: number;
  recentReports: number;
  recentSubmissions: number;
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const [reportsRes, submissionsRes, projectsRes] = await Promise.all([
      supabase.from("generated_reports").select("report_type, created_at"),
      supabase.from("client_submissions").select("status, submission_type, created_at"),
      supabase.from("projects").select("status, created_at"),
    ]);

    const reports = (reportsRes.data || []) as { report_type: string; created_at: string }[];
    const submissions = (submissionsRes.data || []) as { status: string; submission_type: string; created_at: string }[];
    const projects = (projectsRes.data || []) as { status: string; created_at: string }[];

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const reportsByType: Record<string, number> = {};
    reports.forEach((r) => {
      reportsByType[r.report_type] = (reportsByType[r.report_type] || 0) + 1;
    });

    const submissionsByStatus: Record<string, number> = {};
    submissions.forEach((s) => {
      submissionsByStatus[s.status] = (submissionsByStatus[s.status] || 0) + 1;
    });

    const projectsByStatus: Record<string, number> = {};
    projects.forEach((p) => {
      projectsByStatus[p.status] = (projectsByStatus[p.status] || 0) + 1;
    });

    const converted = submissions.filter((s) => s.status === "converted").length;
    const conversionRate = submissions.length > 0 ? (converted / submissions.length) * 100 : 0;

    setData({
      totalReports: reports.length,
      totalSubmissions: submissions.length,
      totalProjects: projects.length,
      reportsByType,
      submissionsByStatus,
      projectsByStatus,
      conversionRate,
      recentReports: reports.filter((r) => new Date(r.created_at) > weekAgo).length,
      recentSubmissions: submissions.filter((s) => new Date(s.created_at) > weekAgo).length,
    });
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return null;

  const kpiCards = [
    { label: "Total Reports", value: data.totalReports, icon: FileText, color: "text-blue-400" },
    { label: "Total Leads", value: data.totalSubmissions, icon: Users, color: "text-purple-400" },
    { label: "Active Projects", value: data.totalProjects, icon: KanbanSquare, color: "text-emerald-400" },
    { label: "Conversion Rate", value: `${data.conversionRate.toFixed(1)}%`, icon: TrendingUp, color: "text-primary" },
  ];

  const reportTypeLabels: Record<string, string> = {
    interview: "Discovery Interviews",
    architecture: "Architecture Specs",
    ux_blueprint: "UX Blueprints",
    consensus: "Consensus Reports",
  };

  const statusLabels: Record<string, string> = {
    backlog: "Backlog",
    in_progress: "In Progress",
    review: "Review",
    deployed: "Deployed",
    archived: "Archived",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          Analytics & Metrics
        </h1>
        <p className="text-muted-foreground mt-1">
          Usage stats, conversion rates, and pipeline activity.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                <span className="text-xs text-muted-foreground">All time</span>
              </div>
              <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity this week */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">New Reports</span>
              <span className="text-sm font-medium text-foreground">{data.recentReports}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">New Submissions</span>
              <span className="text-sm font-medium text-foreground">{data.recentSubmissions}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Conversion Funnel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {["new", "contacted", "in_progress", "converted"].map((status) => {
              const count = data.submissionsByStatus[status] || 0;
              const pct = data.totalSubmissions > 0 ? (count / data.totalSubmissions) * 100 : 0;
              return (
                <div key={status} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground capitalize">{status.replace("_", " ")}</span>
                    <span className="text-foreground">{count}</span>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Reports by Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(reportTypeLabels).map(([key, label]) => {
              const count = data.reportsByType[key] || 0;
              const pct = data.totalReports > 0 ? (count / data.totalReports) * 100 : 0;
              return (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="text-foreground">{count}</span>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Projects by Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(statusLabels).map(([key, label]) => {
              const count = data.projectsByStatus[key] || 0;
              const pct = data.totalProjects > 0 ? (count / data.totalProjects) * 100 : 0;
              return (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="text-foreground">{count}</span>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
