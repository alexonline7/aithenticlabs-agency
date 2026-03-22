import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Search,
  Eye,
  Loader2,
  Mail,
  FileText,
  Calendar,
  Activity,
  UserCheck,
  Clock,
} from "lucide-react";

interface ClientProfile {
  email: string;
  totalReports: number;
  totalSubmissions: number;
  reportTypes: string[];
  submissionTypes: string[];
  latestActivity: string;
  firstSeen: string;
  projects: string[];
  statuses: string[];
}

interface ReportRow {
  user_email: string | null;
  project_name: string;
  report_type: string;
  created_at: string;
}

interface SubmissionRow {
  email: string;
  name: string | null;
  submission_type: string;
  status: string;
  project_description: string | null;
  created_at: string;
}

export default function AdminClients() {
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewClient, setViewClient] = useState<ClientProfile | null>(null);
  const [clientReports, setClientReports] = useState<ReportRow[]>([]);
  const [clientSubmissions, setClientSubmissions] = useState<SubmissionRow[]>([]);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const [reportsRes, submissionsRes] = await Promise.all([
      supabase.from("generated_reports").select("user_email, project_name, report_type, created_at").order("created_at", { ascending: false }),
      supabase.from("client_submissions").select("email, name, submission_type, status, project_description, created_at").order("created_at", { ascending: false }),
    ]);

    const reports = (reportsRes.data || []) as ReportRow[];
    const submissions = (submissionsRes.data || []) as SubmissionRow[];

    const map = new Map<string, ClientProfile>();

    reports.forEach((r) => {
      const email = r.user_email || "anonymous";
      if (!map.has(email)) {
        map.set(email, {
          email,
          totalReports: 0,
          totalSubmissions: 0,
          reportTypes: [],
          submissionTypes: [],
          latestActivity: r.created_at,
          firstSeen: r.created_at,
          projects: [],
          statuses: [],
        });
      }
      const c = map.get(email)!;
      c.totalReports++;
      if (!c.reportTypes.includes(r.report_type)) c.reportTypes.push(r.report_type);
      if (!c.projects.includes(r.project_name)) c.projects.push(r.project_name);
      if (r.created_at > c.latestActivity) c.latestActivity = r.created_at;
      if (r.created_at < c.firstSeen) c.firstSeen = r.created_at;
    });

    submissions.forEach((s) => {
      const email = s.email;
      if (!map.has(email)) {
        map.set(email, {
          email,
          totalReports: 0,
          totalSubmissions: 0,
          reportTypes: [],
          submissionTypes: [],
          latestActivity: s.created_at,
          firstSeen: s.created_at,
          projects: [],
          statuses: [],
        });
      }
      const c = map.get(email)!;
      c.totalSubmissions++;
      if (!c.submissionTypes.includes(s.submission_type)) c.submissionTypes.push(s.submission_type);
      if (!c.statuses.includes(s.status)) c.statuses.push(s.status);
      if (s.created_at > c.latestActivity) c.latestActivity = s.created_at;
      if (s.created_at < c.firstSeen) c.firstSeen = s.created_at;
    });

    const sorted = Array.from(map.values()).sort(
      (a, b) => new Date(b.latestActivity).getTime() - new Date(a.latestActivity).getTime()
    );

    setClients(sorted);
    setLoading(false);
  };

  const openClientDetail = async (client: ClientProfile) => {
    setViewClient(client);
    const [rRes, sRes] = await Promise.all([
      supabase.from("generated_reports").select("user_email, project_name, report_type, created_at").eq("user_email", client.email).order("created_at", { ascending: false }),
      supabase.from("client_submissions").select("email, name, submission_type, status, project_description, created_at").eq("email", client.email).order("created_at", { ascending: false }),
    ]);
    setClientReports((rRes.data || []) as ReportRow[]);
    setClientSubmissions((sRes.data || []) as SubmissionRow[]);
  };

  const filtered = clients.filter(
    (c) => !search || c.email.toLowerCase().includes(search.toLowerCase()) || c.projects.some((p) => p.toLowerCase().includes(search.toLowerCase()))
  );

  const typeLabel: Record<string, string> = {
    interview: "Interview",
    architecture: "Architecture",
    ux_blueprint: "UX Blueprint",
    consensus: "Consensus",
  };

  const statusColor: Record<string, string> = {
    new: "bg-blue-500/20 text-blue-400",
    contacted: "bg-yellow-500/20 text-yellow-400",
    in_progress: "bg-purple-500/20 text-purple-400",
    converted: "bg-emerald-500/20 text-emerald-400",
    archived: "bg-muted text-muted-foreground",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Users & Clients
        </h1>
        <p className="text-muted-foreground mt-1">
          All user and client activity aggregated from reports and submissions.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{clients.length}</p>
            <p className="text-xs text-muted-foreground">Total Clients</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">
              {clients.filter((c) => c.totalReports > 0).length}
            </p>
            <p className="text-xs text-muted-foreground">With Reports</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">
              {clients.filter((c) => c.totalSubmissions > 0).length}
            </p>
            <p className="text-xs text-muted-foreground">With Submissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {clients.reduce((sum, c) => sum + c.projects.length, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Total Projects</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by email or project name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Client List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {clients.length === 0 ? "No clients yet." : "No clients match your search."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((client) => (
            <Card key={client.email} className="hover:border-primary/30 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <h3 className="font-semibold text-foreground truncate">{client.email}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {client.totalReports} reports
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      {client.totalSubmissions} submissions
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Last: {new Date(client.latestActivity).toLocaleDateString()}
                    </span>
                    <span>{client.projects.length} project(s)</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => openClientDetail(client)}>
                  <Eye className="h-4 w-4 mr-1" /> View
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Client Detail Dialog */}
      <Dialog open={!!viewClient} onOpenChange={() => setViewClient(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              {viewClient?.email}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[65vh]">
            {viewClient && (
              <div className="space-y-4 p-1">
                {/* Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-lg font-bold text-foreground">{viewClient.totalReports}</p>
                    <p className="text-xs text-muted-foreground">Reports</p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-lg font-bold text-foreground">{viewClient.totalSubmissions}</p>
                    <p className="text-xs text-muted-foreground">Submissions</p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-lg font-bold text-foreground">{viewClient.projects.length}</p>
                    <p className="text-xs text-muted-foreground">Projects</p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs font-medium text-foreground">
                      {new Date(viewClient.firstSeen).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">First Seen</p>
                  </div>
                </div>

                {/* Projects */}
                {viewClient.projects.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Projects</p>
                    <div className="flex flex-wrap gap-2">
                      {viewClient.projects.map((p) => (
                        <Badge key={p} variant="secondary">{p}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                <Tabs defaultValue="reports">
                  <TabsList>
                    <TabsTrigger value="reports">Reports ({clientReports.length})</TabsTrigger>
                    <TabsTrigger value="submissions">Submissions ({clientSubmissions.length})</TabsTrigger>
                  </TabsList>
                  <TabsContent value="reports" className="space-y-2 mt-3">
                    {clientReports.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No reports.</p>
                    ) : (
                      clientReports.map((r, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-foreground">{r.project_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(r.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline">{typeLabel[r.report_type] || r.report_type}</Badge>
                        </div>
                      ))
                    )}
                  </TabsContent>
                  <TabsContent value="submissions" className="space-y-2 mt-3">
                    {clientSubmissions.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No submissions.</p>
                    ) : (
                      clientSubmissions.map((s, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                          <div className="flex-1 min-w-0 mr-3">
                            <p className="text-sm font-medium text-foreground">
                              {s.name || s.email}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {s.project_description || "No description"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(s.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={statusColor[s.status] || ""}>{s.status}</Badge>
                        </div>
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
