import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrainCircuit, Search, Eye, Loader2, Mail, Calendar } from "lucide-react";
import AIRecommendationDetailDialog from "@/components/admin/AIRecommendationDetailDialog";

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

export default function AdminAIRecommendations() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewItem, setViewItem] = useState<Submission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from("client_submissions")
      .select("*")
      .eq("submission_type", "ai_recommendation")
      .order("created_at", { ascending: false });

    if (!error && data) setSubmissions(data as Submission[]);
    setLoading(false);
  };

  const filtered = submissions.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.email.toLowerCase().includes(q) ||
      s.name?.toLowerCase().includes(q) ||
      s.project_description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-primary" />
          AI Recommendation Submissions
        </h1>
        <p className="text-muted-foreground mt-1">
          View all project requests generated through the AI Recommendation flow.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: submissions.length, color: "text-primary" },
          { label: "New", value: submissions.filter((s) => s.status === "new").length, color: "text-blue-400" },
          { label: "In Progress", value: submissions.filter((s) => s.status === "in_progress").length, color: "text-purple-400" },
          { label: "Converted", value: submissions.filter((s) => s.status === "converted").length, color: "text-emerald-400" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BrainCircuit className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {submissions.length === 0
                ? "No AI recommendation submissions yet."
                : "No submissions match your search."}
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
                    <Badge variant="outline" className={statusColors[sub.status]}>
                      {sub.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {sub.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(sub.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {sub.project_description && (
                    <p className="text-sm text-muted-foreground mt-1 truncate max-w-lg">
                      {sub.project_description}
                    </p>
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

      <AIRecommendationDetailDialog item={viewItem} onClose={() => setViewItem(null)} />
    </div>
  );
}
