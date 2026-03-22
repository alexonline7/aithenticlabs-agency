import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText, Search, Eye, Loader2, Filter, DollarSign, Clock, AlertTriangle,
  Users, Layers, Target, CheckCircle, Rocket, ArrowRight, Code, MonitorSmartphone,
} from "lucide-react";
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

interface ConsensusExtract {
  executiveSummary: string;
  scope: string;
  costEstimate: string;
  risks: string;
  techDecisions: string;
  roadmap: string;
  teamComposition: string;
  successCriteria: string;
  clientActions: string;
  nextSteps: string;
}

const typeLabels: Record<string, string> = {
  interview: "Discovery Interview",
  architecture: "Architecture Spec",
  ux_blueprint: "UX Blueprint",
  consensus: "Consensus Report",
  "quantum-blueprint": "Quantum Blueprint",
  "ai-brief": "AI Brief",
  "flash-app": "Flash App",
};

const typeBadgeColors: Record<string, string> = {
  interview: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  architecture: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  ux_blueprint: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  consensus: "bg-primary/20 text-primary border-primary/30",
  "quantum-blueprint": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "ai-brief": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "flash-app": "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

function extractConsensusSection(content: string, sectionName: string): string {
  // Match ## or ### headings containing the section name
  const patterns = [
    new RegExp(`##\\s*(?:🏗️\\s*|📋\\s*|💰\\s*|⚠️\\s*|👥\\s*|🔧\\s*|📅\\s*|📊\\s*|✅\\s*|🚀\\s*)?${sectionName}[\\s\\S]*?(?=\\n##\\s|$)`, "i"),
    new RegExp(`##\\s*${sectionName}[\\s\\S]*?(?=\\n##\\s|$)`, "i"),
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      // Remove the heading line itself
      return match[0].replace(/^##[^\n]*\n/, "").trim();
    }
  }
  return "";
}

function parseConsensusReport(content: string): ConsensusExtract {
  return {
    executiveSummary: extractConsensusSection(content, "Executive Summary"),
    scope: extractConsensusSection(content, "Project Scope"),
    costEstimate: extractConsensusSection(content, "Cost Estimate"),
    risks: extractConsensusSection(content, "Risk Assessment"),
    techDecisions: extractConsensusSection(content, "Technology Decisions"),
    roadmap: extractConsensusSection(content, "Implementation Roadmap"),
    teamComposition: extractConsensusSection(content, "Recommended Team"),
    successCriteria: extractConsensusSection(content, "Key Metrics"),
    clientActions: extractConsensusSection(content, "Client Action"),
    nextSteps: extractConsensusSection(content, "Next Steps"),
  };
}

function ConsensusDetailView({ report }: { report: Report }) {
  const extracted = parseConsensusReport(report.content);

  const sections = [
    { key: "executiveSummary", label: "Executive Summary", icon: FileText, color: "text-blue-400" },
    { key: "scope", label: "Scope & Deliverables", icon: Target, color: "text-emerald-400" },
    { key: "costEstimate", label: "Cost Estimate & Timeline", icon: DollarSign, color: "text-yellow-400" },
    { key: "techDecisions", label: "Technology Decisions", icon: Layers, color: "text-purple-400" },
    { key: "roadmap", label: "Implementation Roadmap", icon: Rocket, color: "text-primary" },
    { key: "teamComposition", label: "Team Composition", icon: Users, color: "text-cyan-400" },
    { key: "risks", label: "Risk Assessment", icon: AlertTriangle, color: "text-orange-400" },
    { key: "successCriteria", label: "Success Criteria", icon: CheckCircle, color: "text-green-400" },
    { key: "clientActions", label: "Client Action Items", icon: ArrowRight, color: "text-pink-400" },
    { key: "nextSteps", label: "Next Steps", icon: Clock, color: "text-indigo-400" },
  ] as const;

  const filledSections = sections.filter((s) => extracted[s.key]);

  return (
    <Tabs defaultValue={filledSections.length > 0 ? filledSections[0].key : "full"}>
      <TabsList className="flex flex-wrap gap-1 h-auto p-1">
        {filledSections.map((s) => (
          <TabsTrigger key={s.key} value={s.key} className="gap-1 text-xs">
            <s.icon className={`h-3 w-3 ${s.color}`} />
            {s.label}
          </TabsTrigger>
        ))}
        <TabsTrigger value="full" className="gap-1 text-xs">
          <FileText className="h-3 w-3" />
          Full Report
        </TabsTrigger>
      </TabsList>

      {filledSections.map((s) => (
        <TabsContent key={s.key} value={s.key} className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <s.icon className={`h-4 w-4 ${s.color}`} />
                {s.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{extracted[s.key]}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      ))}

      <TabsContent value="full" className="mt-4">
        <ScrollArea className="max-h-[60vh]">
          <div className="prose prose-invert prose-sm max-w-none p-4">
            <ReactMarkdown>{report.content}</ReactMarkdown>
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}

function QuickInfoCards({ report }: { report: Report }) {
  const content = report.content;

  // Extract cost range
  const costMatch = content.match(/\$[\d,]+(?:\s*[–-]\s*\$[\d,]+)?/);
  // Extract timeline
  const timelineMatch = content.match(/(\d+\s*[–-]\s*\d+\s*(?:days?|weeks?|sprints?))/i);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <Card>
        <CardContent className="p-3 text-center">
          <DollarSign className="h-5 w-5 mx-auto text-yellow-400 mb-1" />
          <p className="text-xs text-muted-foreground">Est. Cost</p>
          <p className="text-sm font-bold text-foreground">{costMatch?.[0] || "See report"}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3 text-center">
          <Clock className="h-5 w-5 mx-auto text-blue-400 mb-1" />
          <p className="text-xs text-muted-foreground">Timeline</p>
          <p className="text-sm font-bold text-foreground">{timelineMatch?.[1] || "See report"}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3 text-center">
          <Users className="h-5 w-5 mx-auto text-cyan-400 mb-1" />
          <p className="text-xs text-muted-foreground">Client</p>
          <p className="text-sm font-bold text-foreground truncate">{report.user_email?.split("@")[0] || "Anonymous"}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3 text-center">
          <FileText className="h-5 w-5 mx-auto text-primary mb-1" />
          <p className="text-xs text-muted-foreground">Report Size</p>
          <p className="text-sm font-bold text-foreground">{(content.length / 1000).toFixed(1)}k chars</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminBlueprints() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewReport, setViewReport] = useState<Report | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from("generated_reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setReports(data as Report[]);
    setLoading(false);
  };

  const filtered = reports.filter((r) => {
    const matchesSearch =
      !search ||
      r.project_name.toLowerCase().includes(search.toLowerCase()) ||
      r.user_email?.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || r.report_type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Group reports by project for the consensus-focused view
  const consensusReports = reports.filter((r) => r.report_type === "consensus");
  const projectGroups = new Map<string, Report[]>();
  reports.forEach((r) => {
    const key = `${r.project_name}__${r.user_email || "anon"}`;
    if (!projectGroups.has(key)) projectGroups.set(key, []);
    projectGroups.get(key)!.push(r);
  });

  const stats = {
    total: reports.length,
    interviews: reports.filter((r) => r.report_type === "interview").length,
    architectures: reports.filter((r) => r.report_type === "architecture").length,
    blueprints: reports.filter((r) => r.report_type === "ux_blueprint").length,
    consensus: reports.filter((r) => r.report_type === "consensus").length,
    quantum: reports.filter((r) => r.report_type === "quantum-blueprint").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Client Blueprints & Reports
        </h1>
        <p className="text-muted-foreground mt-1">
          View all generated reports. Consensus Reports contain the complete project specifications developers need.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total", value: stats.total, color: "text-foreground" },
          { label: "Interviews", value: stats.interviews, color: "text-blue-400" },
          { label: "Architecture", value: stats.architectures, color: "text-purple-400" },
          { label: "UX Blueprints", value: stats.blueprints, color: "text-emerald-400" },
          { label: "Consensus", value: stats.consensus, color: "text-primary" },
          { label: "Quantum", value: stats.quantum, color: "text-amber-400" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Consensus Reports — Developer Quick View */}
      {consensusReports.length > 0 && (
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Consensus Reports — Project Specifications for Development
            </CardTitle>
            <CardDescription>
              Each consensus report contains: Executive Summary, Scope & Deliverables, Cost Estimate, Risk Assessment, Team Composition, Technology Decisions, Implementation Roadmap, Success Criteria, Client Action Items, and Next Steps.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {consensusReports.slice(0, 5).map((report) => {
              const costMatch = report.content.match(/\$[\d,]+(?:\s*[–-]\s*\$[\d,]+)?/);
              const timelineMatch = report.content.match(/(\d+\s*[–-]\s*\d+\s*(?:days?|weeks?|sprints?))/i);
              // Find related reports for this project
              const key = `${report.project_name}__${report.user_email || "anon"}`;
              const relatedCount = (projectGroups.get(key)?.length || 1) - 1;

              return (
                <div key={report.id} className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground truncate">{report.project_name}</h4>
                      <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 text-xs">
                        Consensus
                      </Badge>
                      {relatedCount > 0 && (
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          +{relatedCount} related reports
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{report.user_email || "Anonymous"}</span>
                      <span>{new Date(report.created_at).toLocaleDateString()}</span>
                      {costMatch && <span className="text-yellow-400 font-medium">{costMatch[0]}</span>}
                      {timelineMatch && <span className="text-blue-400 font-medium">{timelineMatch[1]}</span>}
                    </div>
                  </div>
                  <Button variant="default" size="sm" onClick={() => setViewReport(report)}>
                    <Eye className="h-4 w-4 mr-1" /> Open Specs
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by project or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="interview">Interviews</SelectItem>
            <SelectItem value="architecture">Architecture</SelectItem>
            <SelectItem value="ux_blueprint">UX Blueprints</SelectItem>
            <SelectItem value="consensus">Consensus</SelectItem>
            <SelectItem value="quantum-blueprint">Quantum Blueprint</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {reports.length === 0
                ? "No reports generated yet. Reports will appear here as clients use the pipeline."
                : "No reports match your filters."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((report) => (
            <Card key={report.id} className={`hover:border-primary/30 transition-colors ${report.report_type === "consensus" ? "border-primary/20" : ""}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">{report.project_name}</h3>
                    <Badge variant="outline" className={typeBadgeColors[report.report_type]}>
                      {typeLabels[report.report_type] || report.report_type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{report.user_email || "Anonymous"}</span>
                    <span>{new Date(report.created_at).toLocaleDateString()}</span>
                    <span>{report.content.length.toLocaleString()} chars</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setViewReport(report)}>
                  <Eye className="h-4 w-4 mr-1" /> View
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Dialog — Dual View: User View + System View */}
      <Dialog open={!!viewReport} onOpenChange={() => setViewReport(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {viewReport?.project_name}
              {viewReport && (
                <Badge variant="outline" className={typeBadgeColors[viewReport.report_type]}>
                  {typeLabels[viewReport.report_type]}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground ml-auto font-normal">
                {viewReport && new Date(viewReport.created_at).toLocaleString()}
              </span>
            </DialogTitle>
          </DialogHeader>

          {viewReport && (
            <Tabs defaultValue="user-view">
              <TabsList className="mb-4">
                <TabsTrigger value="user-view" className="gap-1.5">
                  <MonitorSmartphone className="h-3.5 w-3.5" />
                  User View
                </TabsTrigger>
                <TabsTrigger value="system-view" className="gap-1.5">
                  <Code className="h-3.5 w-3.5" />
                  System View
                </TabsTrigger>
              </TabsList>

              {/* USER VIEW — Exactly as the client sees it */}
              <TabsContent value="user-view">
                <ScrollArea className="max-h-[65vh]">
                  <div className="prose prose-invert max-w-none text-sm p-4">
                    <ReactMarkdown>{viewReport.content}</ReactMarkdown>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* SYSTEM VIEW — Full metadata + structured data + raw content */}
              <TabsContent value="system-view">
                <ScrollArea className="max-h-[65vh]">
                  <div className="space-y-4 p-1">
                    {/* Quick Info Cards */}
                    <QuickInfoCards report={viewReport} />

                    {/* Report Metadata */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Report Metadata</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <p className="text-xs text-muted-foreground">Report ID</p>
                            <p className="font-mono text-xs text-foreground break-all">{viewReport.id}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">User Email</p>
                            <p className="text-foreground">{viewReport.user_email || "Anonymous"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Report Type</p>
                            <p className="text-foreground">{viewReport.report_type}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Content Length</p>
                            <p className="text-foreground">{viewReport.content.length.toLocaleString()} chars</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Full Metadata JSON */}
                    {viewReport.metadata && Object.keys(viewReport.metadata).length > 0 && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Full Metadata (JSON)</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {/* Structured cards for known fields */}
                          {(() => {
                            const meta = viewReport.metadata as Record<string, unknown>;
                            return (
                              <div className="space-y-3">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                  {!!meta.projectType && (
                                    <div className="bg-muted/30 rounded-lg p-3">
                                      <p className="text-xs text-muted-foreground mb-1">Project Type</p>
                                      <p className="text-sm font-semibold text-foreground">{String(meta.projectType)}</p>
                                    </div>
                                  )}
                                  {Array.isArray(meta.platforms) && (
                                    <div className="bg-muted/30 rounded-lg p-3">
                                      <p className="text-xs text-muted-foreground mb-1">Platforms</p>
                                      <div className="flex flex-wrap gap-1">
                                        {(meta.platforms as string[]).map((p: string) => (
                                          <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {!!meta.additionalNotes && (
                                    <div className="bg-muted/30 rounded-lg p-3">
                                      <p className="text-xs text-muted-foreground mb-1">Client Notes</p>
                                      <p className="text-sm text-foreground">{String(meta.additionalNotes)}</p>
                                    </div>
                                  )}
                                </div>
                                {!!meta.selectedFeatures && typeof meta.selectedFeatures === "object" && (
                                  <div className="bg-muted/30 rounded-lg p-3">
                                    <p className="text-xs text-muted-foreground mb-2">Selected Advanced Features</p>
                                    <div className="space-y-2">
                                      {Object.entries(meta.selectedFeatures as Record<string, string[]>).map(([category, features]) => (
                                        <div key={category}>
                                          <p className="text-xs font-medium text-primary mb-1">{category}</p>
                                          <div className="flex flex-wrap gap-1">
                                            {features.map((f: string) => (
                                              <Badge key={f} variant="outline" className="text-xs">{f}</Badge>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                <Separator />
                                <details className="group">
                                  <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                                    Raw JSON
                                  </summary>
                                  <pre className="mt-2 bg-muted/20 rounded-lg p-3 text-xs font-mono text-foreground overflow-x-auto whitespace-pre-wrap">
                                    {JSON.stringify(viewReport.metadata, null, 2)}
                                  </pre>
                                </details>
                              </div>
                            );
                          })()}
                        </CardContent>
                      </Card>
                    )}

                    {/* Consensus structured view if applicable */}
                    {viewReport.report_type === "consensus" && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Parsed Consensus Sections</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ConsensusDetailView report={viewReport} />
                        </CardContent>
                      </Card>
                    )}

                    {/* Full Raw Content */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Full Generated Content</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown>{viewReport.content}</ReactMarkdown>
                        </div>
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
