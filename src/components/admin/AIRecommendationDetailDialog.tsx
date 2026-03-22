import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MonitorSmartphone,
  Code,
  Mail,
  Calendar,
  Clock,
  Target,
  DollarSign,
  Layers,
  Zap,
  BarChart3,
  Globe,
  Users,
  Rocket,
  BrainCircuit,
  FileCode,
  Sparkles,
} from "lucide-react";

interface Submission {
  id: string;
  email: string;
  name: string | null;
  project_description: string | null;
  submission_type: string;
  status: string;
  ai_recommendation: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

const statusColors: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  contacted: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  in_progress: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  converted: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  archived: "bg-muted text-muted-foreground border-border",
};

function MetadataField({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 py-1.5">
      <Icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="text-sm text-foreground">{value}</div>
      </div>
    </div>
  );
}

function parseDescription(desc: string | null) {
  if (!desc) return {};
  const result: Record<string, string> = {};
  
  // Try to extract structured fields like "Recommended App: X Type: Y Budget: Z"
  const appMatch = desc.match(/Recommended App:\s*(.+?)(?:\s+Type:|$)/i);
  const typeMatch = desc.match(/Type:\s*(.+?)(?:\s+Budget:|$)/i);
  const budgetMatch = desc.match(/Budget:\s*(.+?)(?:\s+[A-Z]|$)/i);
  
  if (appMatch) result.recommendedApp = appMatch[1].trim();
  if (typeMatch) result.appType = typeMatch[1].trim();
  if (budgetMatch) result.budget = budgetMatch[1].trim();
  
  // Extract the main description text (after budget or the full text)
  const descStart = desc.indexOf(budgetMatch?.[0] || typeMatch?.[0] || "");
  if (descStart > -1) {
    const afterMeta = desc.slice(descStart + (budgetMatch?.[0] || typeMatch?.[0] || "").length).trim();
    if (afterMeta) result.description = afterMeta;
  }
  
  if (!result.recommendedApp && !result.appType) {
    result.description = desc;
  }
  
  return result;
}

function extractTechs(rec: Record<string, unknown>): string[] {
  if (Array.isArray(rec.techs)) return rec.techs as string[];
  if (Array.isArray(rec.tech_stack)) return rec.tech_stack as string[];
  if (typeof rec.tech === "object" && rec.tech) {
    return Object.values(rec.tech as Record<string, string>);
  }
  return [];
}

interface Props {
  item: Submission | null;
  onClose: () => void;
}

export default function AIRecommendationDetailDialog({ item, onClose }: Props) {
  if (!item) return null;

  const rec = item.ai_recommendation || {};
  const parsed = parseDescription(item.project_description);
  const appName = (rec.recommended_app as string) || (rec.title as string) || parsed.recommendedApp || "Untitled App";
  const appType = parsed.appType || (rec.type as string) || (rec.app_type as string) || "—";
  const budget = parsed.budget || (rec.budget as string) || "—";
  const match = rec.match as number | undefined;
  const reason = (rec.reason as string) || parsed.description || item.project_description || "";
  const timeline = (rec.timeline as string) || (rec.estimated_timeline as string) || "TBD";
  const techs = extractTechs(rec);
  const industry = (rec.industry as string) || "—";

  return (
    <Dialog open={!!item} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden [&>button]:opacity-100 [&>button]:text-foreground [&>button]:bg-muted/80 [&>button]:border [&>button]:border-border [&>button]:rounded-full [&>button]:p-1 [&>button]:hover:bg-muted">
        <DialogHeader className="pr-8">
          <DialogTitle className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            {item.name || item.email}
            <span className="text-xs text-muted-foreground ml-auto font-normal">
              {new Date(item.created_at).toLocaleString()}
            </span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="user-view">
          <TabsList className="mb-4">
            <TabsTrigger value="user-view" className="gap-1.5">
              <MonitorSmartphone className="h-3.5 w-3.5" />Standard User Version
            </TabsTrigger>
            <TabsTrigger value="dev-view" className="gap-1.5">
              <Code className="h-3.5 w-3.5" />Professional Dev Version
            </TabsTrigger>
          </TabsList>

          {/* ── Standard User Version ── */}
          <TabsContent value="user-view">
            <ScrollArea className="h-[65vh]">
              <div className="space-y-5 p-1">
                {/* Client Info */}
                <Card>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="text-foreground">{item.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Submitted</p>
                          <p className="text-foreground">{new Date(item.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Status</p>
                          <Badge variant="outline" className={statusColors[item.status]}>{item.status}</Badge>
                        </div>
                      </div>
                      {item.name && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Name</p>
                            <p className="text-foreground">{item.name}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recommended App */}
                <Card className="border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-primary">
                      <Sparkles className="h-4 w-4" /> AI Recommended Application
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-foreground">{appName}</h3>
                      {match && <Badge className="bg-primary/20 text-primary border-primary/30">{match}% Match</Badge>}
                    </div>
                    {reason && (
                      <p className="text-sm text-muted-foreground leading-relaxed">{reason}</p>
                    )}
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      {appType !== "—" && (
                        <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" /> {appType}</span>
                      )}
                      {timeline !== "TBD" && (
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {timeline}</span>
                      )}
                      {budget !== "—" && (
                        <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> {budget}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Tech Stack */}
                {techs.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Layers className="h-4 w-4 text-primary" /> Recommended Tech Stack
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {techs.map((t) => (
                          <Badge key={t} variant="secondary" className="text-xs py-1 px-2.5">{t}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* ── Professional Dev Version ── */}
          <TabsContent value="dev-view">
            <ScrollArea className="h-[65vh]">
              <div className="space-y-5 p-1">

                {/* Project Overview & Timeline Card */}
                <Card className="border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-primary">
                      <Rocket className="h-4 w-4" /> Project Overview & Estimated Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <MetadataField icon={FileCode} label="Submission ID" value={<span className="font-mono text-xs break-all">{item.id}</span>} />
                      <MetadataField icon={Users} label="Client" value={item.name || item.email} />
                      <MetadataField icon={Mail} label="Contact" value={item.email} />
                      <MetadataField icon={Clock} label="Estimated Dev Timeline" value={
                        <span className="font-semibold text-primary">{timeline}</span>
                      } />
                      <MetadataField icon={Target} label="Pipeline Status" value={
                        <Badge variant="outline" className={statusColors[item.status]}>{item.status}</Badge>
                      } />
                      <MetadataField icon={Calendar} label="Submission Date" value={new Date(item.created_at).toLocaleString()} />
                    </div>
                  </CardContent>
                </Card>

                {/* Technical Configuration */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" /> Technical Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <MetadataField icon={BrainCircuit} label="Recommended App" value={
                        <span className="font-semibold">{appName}</span>
                      } />
                      <MetadataField icon={Globe} label="Application Type" value={appType} />
                      <MetadataField icon={DollarSign} label="Budget Range" value={
                        <Badge variant="secondary" className="capitalize">{budget}</Badge>
                      } />
                      <MetadataField icon={BarChart3} label="Match Score" value={
                        match ? (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full max-w-[120px]">
                              <div className="h-2 bg-primary rounded-full" style={{ width: `${match}%` }} />
                            </div>
                            <span className="font-semibold text-primary">{match}%</span>
                          </div>
                        ) : "—"
                      } />
                      <MetadataField icon={Target} label="Industry" value={industry} />
                      <MetadataField icon={Clock} label="Timeline Estimate" value={timeline} />
                    </div>
                  </CardContent>
                </Card>

                {/* Tech Stack Specification */}
                {techs.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Layers className="h-4 w-4 text-primary" /> Tech Stack Specification
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {techs.map((t, i) => (
                          <div key={i} className="p-3 rounded-lg bg-muted/40 border border-border/50 text-center">
                            <p className="text-sm font-semibold text-foreground">{t}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* AI Analysis */}
                {reason && (
                  <Card className="border-primary/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2 text-primary">
                        <BrainCircuit className="h-4 w-4" /> AI Analysis & Recommendation Rationale
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground leading-relaxed">{reason}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Project Description */}
                {item.project_description && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <FileCode className="h-4 w-4 text-primary" /> Full Project Description
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground bg-muted/30 rounded-lg p-4 leading-relaxed border border-border/50">
                        {item.project_description}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Raw Metadata */}
                {Object.keys(rec).length > 0 && (
                  <Card>
                    <CardContent className="pt-4">
                      <details>
                        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground font-medium">
                          Raw AI Recommendation JSON
                        </summary>
                        <pre className="mt-2 bg-muted/30 rounded-lg p-4 text-xs font-mono text-foreground overflow-x-auto whitespace-pre-wrap break-words border border-border/50">
                          {JSON.stringify(rec, null, 2)}
                        </pre>
                      </details>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
