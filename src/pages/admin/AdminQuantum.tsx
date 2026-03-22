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
import { Cpu, Search, Eye, Loader2, Code, MonitorSmartphone } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Report {
  id: string;
  user_email: string | null;
  project_name: string;
  report_type: string;
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export default function AdminQuantum() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewReport, setViewReport] = useState<Report | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("generated_reports")
        .select("*")
        .eq("report_type", "quantum-blueprint")
        .order("created_at", { ascending: false });
      if (!error && data) setReports(data as Report[]);
      setLoading(false);
    })();
  }, []);

  const filtered = reports.filter(
    (r) =>
      !search ||
      r.project_name.toLowerCase().includes(search.toLowerCase()) ||
      r.user_email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Cpu className="h-6 w-6 text-amber-400" />
          Quantum Optimization — Admin View
        </h1>
        <p className="text-muted-foreground mt-1">
          All Quantum blueprints with full metadata: project type, platforms, selected advanced features, and AI-generated specifications.
        </p>
      </div>

      <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-amber-400">{reports.length}</p><p className="text-xs text-muted-foreground">Total Quantum Blueprints</p></CardContent></Card>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by project or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-12 text-center"><Cpu className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">No Quantum blueprints yet.</p></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((report) => {
            const meta = report.metadata as Record<string, unknown>;
            return (
              <Card key={report.id} className="hover:border-amber-500/30 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{report.project_name}</h3>
                      <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">Quantum</Badge>
                      {!!meta.projectType && <Badge variant="secondary" className="text-xs">{String(meta.projectType)}</Badge>}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{report.user_email || "Anonymous"}</span>
                      <span>{new Date(report.created_at).toLocaleDateString()}</span>
                      {Array.isArray(meta.platforms) && <span>{(meta.platforms as string[]).join(", ")}</span>}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setViewReport(report)}><Eye className="h-4 w-4 mr-1" /> View</Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!viewReport} onOpenChange={() => setViewReport(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {viewReport?.project_name}
              <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30">Quantum Blueprint</Badge>
              <span className="text-xs text-muted-foreground ml-auto font-normal">{viewReport && new Date(viewReport.created_at).toLocaleString()}</span>
            </DialogTitle>
          </DialogHeader>
          {viewReport && (
            <Tabs defaultValue="user-view">
              <TabsList className="mb-4">
                <TabsTrigger value="user-view" className="gap-1.5"><MonitorSmartphone className="h-3.5 w-3.5" />User View</TabsTrigger>
                <TabsTrigger value="system-view" className="gap-1.5"><Code className="h-3.5 w-3.5" />System View</TabsTrigger>
              </TabsList>
              <TabsContent value="user-view">
                <ScrollArea className="max-h-[65vh]">
                  <div className="prose prose-invert max-w-none text-sm p-4"><ReactMarkdown>{viewReport.content}</ReactMarkdown></div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="system-view">
                <ScrollArea className="max-h-[65vh]">
                  <div className="space-y-4 p-1">
                    <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Report Metadata</CardTitle></CardHeader>
                      <CardContent className="text-sm">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div><p className="text-xs text-muted-foreground">Report ID</p><p className="font-mono text-xs text-foreground break-all">{viewReport.id}</p></div>
                          <div><p className="text-xs text-muted-foreground">User Email</p><p className="text-foreground">{viewReport.user_email || "Anonymous"}</p></div>
                          <div><p className="text-xs text-muted-foreground">Report Type</p><p className="text-foreground">{viewReport.report_type}</p></div>
                          <div><p className="text-xs text-muted-foreground">Content Length</p><p className="text-foreground">{viewReport.content.length.toLocaleString()} chars</p></div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quantum-specific metadata */}
                    {viewReport.metadata && (() => {
                      const meta = viewReport.metadata as Record<string, unknown>;
                      return (
                        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Quantum Configuration</CardTitle></CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {meta.projectType && (
                                <div className="bg-muted/30 rounded-lg p-3">
                                  <p className="text-xs text-muted-foreground mb-1">Project Type</p>
                                  <p className="text-sm font-semibold text-foreground">{String(meta.projectType)}</p>
                                </div>
                              )}
                              {Array.isArray(meta.platforms) && (
                                <div className="bg-muted/30 rounded-lg p-3">
                                  <p className="text-xs text-muted-foreground mb-1">Platforms</p>
                                  <div className="flex flex-wrap gap-1">{(meta.platforms as string[]).map((p) => <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>)}</div>
                                </div>
                              )}
                              {meta.additionalNotes && (
                                <div className="bg-muted/30 rounded-lg p-3">
                                  <p className="text-xs text-muted-foreground mb-1">Client Notes</p>
                                  <p className="text-sm text-foreground">{String(meta.additionalNotes)}</p>
                                </div>
                              )}
                            </div>
                            {meta.selectedFeatures && typeof meta.selectedFeatures === "object" && (
                              <div className="bg-muted/30 rounded-lg p-3">
                                <p className="text-xs text-muted-foreground mb-2">Selected Advanced Features</p>
                                <div className="space-y-2">
                                  {Object.entries(meta.selectedFeatures as Record<string, string[]>).map(([category, features]) => (
                                    <div key={category}>
                                      <p className="text-xs font-medium text-primary mb-1">{category}</p>
                                      <div className="flex flex-wrap gap-1">{features.map((f) => <Badge key={f} variant="outline" className="text-xs">{f}</Badge>)}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            <Separator />
                            <details><summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">Raw JSON</summary>
                              <pre className="mt-2 bg-muted/20 rounded-lg p-3 text-xs font-mono text-foreground overflow-x-auto whitespace-pre-wrap">{JSON.stringify(viewReport.metadata, null, 2)}</pre>
                            </details>
                          </CardContent>
                        </Card>
                      );
                    })()}

                    <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Full Generated Content</CardTitle></CardHeader>
                      <CardContent><div className="prose prose-invert prose-sm max-w-none"><ReactMarkdown>{viewReport.content}</ReactMarkdown></div></CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
