import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
// Separator available if needed
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Search, Eye, Loader2, Code, MonitorSmartphone, Clock, Layers, Server, Shield, Palette, Rocket, TestTube, FileCode, Globe, Users, DollarSign, Tag } from "lucide-react";
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

const markdownStyles = "max-w-none text-sm text-foreground space-y-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-foreground [&_h1]:mt-6 [&_h1]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-5 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-4 [&_h3]:mb-2 [&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-foreground [&_h4]:mt-3 [&_h4]:mb-1 [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ul]:text-muted-foreground [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 [&_ol]:text-muted-foreground [&_li]:text-muted-foreground [&_strong]:text-foreground [&_strong]:font-semibold [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:text-foreground [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold [&_th]:text-foreground [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:text-xs [&_td]:text-muted-foreground [&_hr]:border-border";

function MetadataField({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
      <Icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
        <div className="text-sm text-foreground">{value as React.ReactNode}</div>
      </div>
    </div>
  );
}

function estimateTimeline(meta: Record<string, unknown>): string {
  const features = Array.isArray(meta.features) ? meta.features : [];
  const tier = String(meta.tier || "");
  const platforms = Array.isArray(meta.platforms) ? meta.platforms : [];

  let hours = 16; // base MVP
  hours += features.length * 6;
  hours += platforms.length > 1 ? platforms.length * 8 : 0;
  if (meta.includeDesignSystem) hours += 12;
  if (meta.includeDeployGuide) hours += 8;
  if (meta.includeApiDocs) hours += 10;
  if (meta.includeTestSpecs) hours += 14;
  if (tier === "enterprise") hours += 24;
  else if (tier === "professional") hours += 12;

  const days = Math.ceil(hours / 8);
  if (days <= 2) return `${hours} hours (~${days} days) — Sprint delivery`;
  if (days <= 5) return `${hours} hours (~${days} days) — Standard delivery`;
  if (days <= 10) return `${hours} hours (~${days} days) — Full-cycle build`;
  return `${hours} hours (~${days} days) — Enterprise timeline`;
}

export default function AdminFlashApps() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewReport, setViewReport] = useState<Report | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("generated_reports")
        .select("*")
        .in("report_type", ["ai-brief", "flash-app"])
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
          <Zap className="h-6 w-6 text-primary" />
          FlashApps Generator — Admin View
        </h1>
        <p className="text-muted-foreground mt-1">
          All FlashApp briefs generated by clients. Each entry includes the Standard User version and the Professional Developer version.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">{reports.length}</p><p className="text-xs text-muted-foreground">Total FlashApp Briefs</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-cyan-400">{reports.filter(r => r.report_type === "ai-brief").length}</p><p className="text-xs text-muted-foreground">AI Briefs</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-pink-400">{reports.filter(r => r.report_type === "flash-app").length}</p><p className="text-xs text-muted-foreground">Flash Apps</p></CardContent></Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by project or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-12 text-center"><Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">No FlashApp briefs yet.</p></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((report) => (
            <Card key={report.id} className="hover:border-primary/30 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">{report.project_name}</h3>
                    <Badge variant="outline" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">{report.report_type === "ai-brief" ? "AI Brief" : "Flash App"}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{report.user_email || "Anonymous"}</span>
                    <span>{new Date(report.created_at).toLocaleDateString()}</span>
                    <span>{report.content.length.toLocaleString()} chars</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setViewReport(report)}><Eye className="h-4 w-4 mr-1" /> View</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!viewReport} onOpenChange={() => setViewReport(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {viewReport?.project_name}
              <span className="text-xs text-muted-foreground ml-auto font-normal">{viewReport && new Date(viewReport.created_at).toLocaleString()}</span>
            </DialogTitle>
          </DialogHeader>
          {viewReport && (
            <Tabs defaultValue="user-view">
              <TabsList className="mb-4">
                <TabsTrigger value="user-view" className="gap-1.5"><MonitorSmartphone className="h-3.5 w-3.5" />Standard User Version</TabsTrigger>
                <TabsTrigger value="system-view" className="gap-1.5"><Code className="h-3.5 w-3.5" />Professional Dev Version</TabsTrigger>
              </TabsList>

              {/* ── Standard User Version ── */}
              <TabsContent value="user-view">
                <ScrollArea className="max-h-[65vh]">
                  <div className={`${markdownStyles} p-4`}>
                    <ReactMarkdown>{typeof viewReport.metadata?.userVersion === "string" ? String(viewReport.metadata.userVersion) : viewReport.content}</ReactMarkdown>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* ── Professional Dev Version ── */}
              <TabsContent value="system-view">
                <ScrollArea className="max-h-[65vh]">
                  <div className="space-y-5 p-1">

                    {/* Project Overview Card */}
                    <Card className="border-primary/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2 text-primary">
                          <Rocket className="h-4 w-4" /> Project Overview & Estimated Timeline
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <MetadataField icon={FileCode} label="Report ID" value={<span className="font-mono text-xs break-all">{viewReport.id}</span>} />
                          <MetadataField icon={Users} label="Client" value={viewReport.user_email || "Anonymous"} />
                          <MetadataField icon={Tag} label="Report Type" value={<Badge variant="outline" className="text-xs">{viewReport.report_type}</Badge>} />
                          <MetadataField icon={Clock} label="Estimated Dev Timeline" value={
                            <span className="font-semibold text-primary">{estimateTimeline(viewReport.metadata)}</span>
                          } />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Technical Configuration Card */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Server className="h-4 w-4 text-primary" /> Technical Configuration
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <MetadataField icon={Tag} label="Category" value={String(viewReport.metadata?.category || "—")} />
                          <MetadataField icon={DollarSign} label="Pricing Tier" value={
                            <Badge variant="secondary" className="capitalize">{String(viewReport.metadata?.tier || "—")}</Badge>
                          } />
                          <MetadataField icon={Globe} label="Target Platforms" value={
                            Array.isArray(viewReport.metadata?.platforms) ? (
                              <div className="flex flex-wrap gap-1">
                                {(viewReport.metadata.platforms as string[]).map((p) => (
                                  <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
                                ))}
                              </div>
                            ) : "—"
                          } />
                          <MetadataField icon={Users} label="Target Audience" value={String(viewReport.metadata?.targetAudience || "General")} />
                          <MetadataField icon={DollarSign} label="Monetization" value={String(viewReport.metadata?.monetization || "Not specified")} />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tech Stack Card */}
                    {viewReport.metadata?.tech != null && typeof viewReport.metadata.tech === "object" && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Layers className="h-4 w-4 text-primary" /> Tech Stack Specification
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {Object.entries(viewReport.metadata.tech as Record<string, string>).map(([techKey, techVal]) => (
                              <div key={techKey} className="p-3 rounded-lg bg-muted/40 border border-border/50 text-center">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{techKey}</p>
                                <p className="text-sm font-semibold text-foreground">{techVal}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Features Card */}
                    {Array.isArray(viewReport.metadata?.features) && (viewReport.metadata.features as string[]).length > 0 && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Zap className="h-4 w-4 text-primary" /> Requested Feature Modules
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {(viewReport.metadata.features as string[]).map((f) => (
                              <Badge key={f} variant="secondary" className="text-xs py-1 px-2.5">{f}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Included Specification Extras */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" /> Specification Addons Requested
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { key: "includeDesignSystem", label: "Design System", icon: Palette },
                            { key: "includeDeployGuide", label: "Deploy Guide", icon: Rocket },
                            { key: "includeApiDocs", label: "API Docs", icon: FileCode },
                            { key: "includeTestSpecs", label: "Test Specs", icon: TestTube },
                          ].map(({ key, label, icon: AddonIcon }) => (
                            <div key={key} className={`p-3 rounded-lg border text-center ${viewReport.metadata?.[key] ? "bg-primary/10 border-primary/30" : "bg-muted/20 border-border/30 opacity-50"}`}>
                              <AddonIcon className={`h-4 w-4 mx-auto mb-1 ${viewReport.metadata?.[key] ? "text-primary" : "text-muted-foreground"}`} />
                              <p className="text-xs font-medium text-foreground">{label}</p>
                              <p className={`text-xs mt-0.5 ${viewReport.metadata?.[key] ? "text-primary" : "text-muted-foreground"}`}>
                                {viewReport.metadata?.[key] ? "Included" : "Not included"}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Full Technical Specification */}
                    <Card className="border-primary/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2 text-primary">
                          <Code className="h-4 w-4" /> Full Technical Specification
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className={markdownStyles}>
                          <ReactMarkdown>{typeof viewReport.metadata?.professionalVersion === "string" ? String(viewReport.metadata.professionalVersion) : viewReport.content}</ReactMarkdown>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Raw Metadata */}
                    <Card>
                      <CardContent className="pt-4">
                        <details>
                          <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground font-medium">Raw Metadata JSON</summary>
                          <pre className="mt-2 bg-muted/30 rounded-lg p-4 text-xs font-mono text-foreground overflow-x-auto whitespace-pre-wrap border border-border/50">
                            {JSON.stringify(viewReport.metadata, null, 2)}
                          </pre>
                        </details>
                      </CardContent>
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