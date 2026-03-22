import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Search, Eye, Loader2, Filter } from "lucide-react";
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

const typeLabels: Record<string, string> = {
  interview: "Discovery Interview",
  architecture: "Architecture Spec",
  ux_blueprint: "UX Blueprint",
  consensus: "Consensus Report",
};

const typeBadgeColors: Record<string, string> = {
  interview: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  architecture: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  ux_blueprint: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  consensus: "bg-primary/20 text-primary border-primary/30",
};

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

  const stats = {
    total: reports.length,
    interviews: reports.filter((r) => r.report_type === "interview").length,
    architectures: reports.filter((r) => r.report_type === "architecture").length,
    blueprints: reports.filter((r) => r.report_type === "ux_blueprint").length,
    consensus: reports.filter((r) => r.report_type === "consensus").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Client Blueprints & Reports
        </h1>
        <p className="text-muted-foreground mt-1">
          View all generated Consensus Reports, Architecture specs, and UX Blueprints.
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
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

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
            <Card key={report.id} className="hover:border-primary/30 transition-colors">
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

      {/* View Dialog */}
      <Dialog open={!!viewReport} onOpenChange={() => setViewReport(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {viewReport?.project_name}
              {viewReport && (
                <Badge variant="outline" className={typeBadgeColors[viewReport.report_type]}>
                  {typeLabels[viewReport.report_type]}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[65vh]">
            <div className="prose prose-invert prose-sm max-w-none p-4">
              <ReactMarkdown>{viewReport?.content || ""}</ReactMarkdown>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
