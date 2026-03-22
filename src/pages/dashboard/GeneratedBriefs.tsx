import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";
import {
  FileText,
  Eye,
  Search,
  Calendar,
  Tag,
  Zap,
  Brain,
  Loader2,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

interface Report {
  id: string;
  project_name: string;
  report_type: string;
  content: string;
  metadata: Json;
  created_at: string;
}

const REPORT_TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  "quantum-blueprint": { label: "Quantum Blueprint", icon: Zap, color: "text-primary" },
  "ai-brief": { label: "AI Brief", icon: Brain, color: "text-purple-400" },
  "flash-app": { label: "Flash App", icon: Sparkles, color: "text-amber-400" },
};

export default function GeneratedBriefs() {
  const [search, setSearch] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [viewingReport, setViewingReport] = useState<Report | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase
        .from("generated_reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setReports(data as Report[]);
      }
      setLoading(false);
    };
    fetchReports();
  }, []);

  const filtered = reports.filter(
    (r) =>
      r.project_name.toLowerCase().includes(search.toLowerCase()) ||
      r.report_type.toLowerCase().includes(search.toLowerCase())
  );

  const getConfig = (type: string) =>
    REPORT_TYPE_CONFIG[type] || { label: type, icon: FileText, color: "text-muted-foreground" };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const getMetadataFeatures = (metadata: Json): string[] => {
    if (metadata && typeof metadata === "object" && !Array.isArray(metadata)) {
      const m = metadata as Record<string, Json>;
      if (m.selectedFeatures && typeof m.selectedFeatures === "object" && !Array.isArray(m.selectedFeatures)) {
        const features = m.selectedFeatures as Record<string, Json>;
        return Object.values(features).flat().filter((v): v is string => typeof v === "string").slice(0, 4);
      }
    }
    return [];
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-bricolage flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          Generated Briefs
        </h1>
        <p className="text-muted-foreground mt-1">AI-generated project documentation & blueprints</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search briefs by name or type..."
          className="pl-10 bg-background border-input"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="dark-slate-purple-card">
          <CardContent className="pt-6 text-center py-12">
            <FileText className="h-12 w-12 text-primary/30 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {search ? "No briefs match your search." : "No briefs generated yet. Create one from Quantum Optimization or other tools."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((report) => {
            const config = getConfig(report.report_type);
            const Icon = config.icon;
            const features = getMetadataFeatures(report.metadata);
            const meta = report.metadata as Record<string, Json> | null;

            return (
              <Card key={report.id} className="dark-slate-purple-card hover:border-primary/30 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Badge variant="default" className="gap-1">
                      <Icon className="h-3 w-3" /> {config.label}
                    </Badge>
                    {meta?.projectType && typeof meta.projectType === "string" && (
                      <Badge variant="outline" className="gap-1">
                        <Tag className="h-3 w-3" /> {meta.projectType}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg mt-2">{report.project_name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {formatDate(report.created_at)}
                    </span>
                    <span>{Math.ceil(report.content.length / 500)} pages est.</span>
                  </div>
                  {features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {features.map((f) => (
                        <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                      ))}
                      {getMetadataFeatures(report.metadata).length > 4 && (
                        <Badge variant="secondary" className="text-xs">+more</Badge>
                      )}
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1"
                    onClick={() => setViewingReport(report)}
                  >
                    <Eye className="h-3 w-3" /> View Blueprint
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={!!viewingReport} onOpenChange={() => setViewingReport(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              {viewingReport?.project_name}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[65vh]">
            <div className="prose prose-invert max-w-none text-sm pr-4">
              <ReactMarkdown>{viewingReport?.content || ""}</ReactMarkdown>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
