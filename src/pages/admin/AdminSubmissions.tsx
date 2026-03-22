import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Search, Eye, Loader2, Mail, Calendar } from "lucide-react";

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

const typeLabels: Record<string, string> = {
  contact: "Contact Form",
  ai_recommendation: "AI Recommendation",
  flash_app: "Flash App Request",
  blueprint: "Blueprint Request",
};

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewItem, setViewItem] = useState<Submission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from("client_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setSubmissions(data as Submission[]);
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("client_submissions")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (!error) {
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
      );
      if (viewItem?.id === id) setViewItem({ ...viewItem, status: newStatus });
    }
  };

  const filtered = submissions.filter((s) => {
    const matchesSearch =
      !search ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.project_description?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    new: submissions.filter((s) => s.status === "new").length,
    contacted: submissions.filter((s) => s.status === "contacted").length,
    in_progress: submissions.filter((s) => s.status === "in_progress").length,
    converted: submissions.filter((s) => s.status === "converted").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Client Submissions & Leads
        </h1>
        <p className="text-muted-foreground mt-1">
          Contact info, project requests, and AI Recommendation results from potential clients.
        </p>
      </div>

      {/* Pipeline stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "New", value: statusCounts.new, color: "text-blue-400" },
          { label: "Contacted", value: statusCounts.contacted, color: "text-yellow-400" },
          { label: "In Progress", value: statusCounts.in_progress, color: "text-purple-400" },
          { label: "Converted", value: statusCounts.converted, color: "text-emerald-400" },
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
          <Input placeholder="Search by name, email, or description..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
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
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {submissions.length === 0 ? "No submissions yet." : "No submissions match your filters."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((sub) => (
            <Card key={sub.id} className="hover:border-primary/30 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{sub.name || sub.email}</h3>
                    <Badge variant="outline" className={statusColors[sub.status]}>{sub.status}</Badge>
                    <Badge variant="secondary" className="text-xs">{typeLabels[sub.submission_type]}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{sub.email}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(sub.created_at).toLocaleDateString()}</span>
                  </div>
                  {sub.project_description && (
                    <p className="text-sm text-muted-foreground mt-1 truncate max-w-lg">{sub.project_description}</p>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={() => setViewItem(sub)}>
                  <Eye className="h-4 w-4 mr-1" /> View
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewItem?.name || viewItem?.email}</DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Email:</span> <span className="text-foreground">{viewItem.email}</span></div>
                <div><span className="text-muted-foreground">Type:</span> <span className="text-foreground">{typeLabels[viewItem.submission_type]}</span></div>
                <div><span className="text-muted-foreground">Date:</span> <span className="text-foreground">{new Date(viewItem.created_at).toLocaleString()}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <Badge variant="outline" className={statusColors[viewItem.status]}>{viewItem.status}</Badge></div>
              </div>

              {viewItem.project_description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Project Description</p>
                  <p className="text-sm text-foreground bg-muted/50 rounded p-3">{viewItem.project_description}</p>
                </div>
              )}

              {Object.keys(viewItem.ai_recommendation || {}).length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">AI Recommendation Data</p>
                  <pre className="text-xs text-foreground bg-muted/50 rounded p-3 overflow-auto max-h-40">
                    {JSON.stringify(viewItem.ai_recommendation, null, 2)}
                  </pre>
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                {["new", "contacted", "in_progress", "converted", "archived"].map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={viewItem.status === s ? "default" : "outline"}
                    onClick={() => updateStatus(viewItem.id, s)}
                    className="text-xs capitalize"
                  >
                    {s.replace("_", " ")}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
