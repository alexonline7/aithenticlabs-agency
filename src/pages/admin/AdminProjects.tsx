import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { KanbanSquare, Plus, Loader2, GripVertical, Calendar, DollarSign, Clock } from "lucide-react";

interface Project {
  id: string;
  title: string;
  client_email: string | null;
  client_name: string | null;
  description: string | null;
  status: string;
  priority: string;
  assigned_to: string | null;
  estimated_cost: number | null;
  estimated_days: number | null;
  deadline: string | null;
  tags: string[];
  notes: string | null;
  created_at: string;
}

const statusColumns = ["backlog", "in_progress", "review", "deployed"];
const statusLabels: Record<string, string> = {
  backlog: "Backlog",
  in_progress: "In Progress",
  review: "Review",
  deployed: "Deployed",
  archived: "Archived",
};
const statusColors: Record<string, string> = {
  backlog: "bg-muted text-muted-foreground",
  in_progress: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  review: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  deployed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  archived: "bg-muted text-muted-foreground",
};
const priorityColors: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-blue-500/20 text-blue-400",
  high: "bg-orange-500/20 text-orange-400",
  urgent: "bg-red-500/20 text-red-400",
};

const emptyProject: Partial<Project> = {
  title: "",
  client_email: "",
  client_name: "",
  description: "",
  status: "backlog",
  priority: "medium",
  assigned_to: "",
  estimated_cost: null,
  estimated_days: null,
  deadline: null,
  notes: "",
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProject, setEditProject] = useState<Partial<Project>>(emptyProject);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setProjects(data as Project[]);
    setLoading(false);
  };

  const saveProject = async () => {
    setSaving(true);
    const payload = {
      title: editProject.title || "Untitled",
      client_email: editProject.client_email || null,
      client_name: editProject.client_name || null,
      description: editProject.description || null,
      status: editProject.status || "backlog",
      priority: editProject.priority || "medium",
      assigned_to: editProject.assigned_to || null,
      estimated_cost: editProject.estimated_cost || null,
      estimated_days: editProject.estimated_days || null,
      deadline: editProject.deadline || null,
      notes: editProject.notes || null,
    };

    if (editProject.id) {
      const { error } = await supabase
        .from("projects")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", editProject.id);
      if (!error) {
        setProjects((prev) => prev.map((p) => (p.id === editProject.id ? { ...p, ...payload } : p)));
      }
    } else {
      const { data, error } = await supabase.from("projects").insert(payload).select().single();
      if (!error && data) setProjects((prev) => [data as Project, ...prev]);
    }
    setSaving(false);
    setDialogOpen(false);
  };

  const moveProject = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("projects").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", id);
    if (!error) setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <KanbanSquare className="h-6 w-6 text-primary" />
            Project Management Board
          </h1>
          <p className="text-muted-foreground mt-1">Track active projects, assign team members, and manage deadlines.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "board" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("board")}
          >
            Board
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            List
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setEditProject(emptyProject);
              setDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1" /> New Project
          </Button>
        </div>
      </div>

      {viewMode === "board" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statusColumns.map((status) => {
            const items = projects.filter((p) => p.status === status);
            return (
              <div key={status} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">{statusLabels[status]}</h3>
                  <Badge variant="secondary" className="text-xs">{items.length}</Badge>
                </div>
                <div className="space-y-2 min-h-[100px] bg-muted/20 rounded-lg p-2">
                  {items.map((project) => (
                    <Card
                      key={project.id}
                      className="cursor-pointer hover:border-primary/30 transition-colors"
                      onClick={() => {
                        setEditProject(project);
                        setDialogOpen(true);
                      }}
                    >
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-medium text-foreground leading-tight">{project.title}</h4>
                          <Badge variant="outline" className={`text-[10px] ${priorityColors[project.priority]}`}>
                            {project.priority}
                          </Badge>
                        </div>
                        {project.client_name && (
                          <p className="text-xs text-muted-foreground">{project.client_name}</p>
                        )}
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          {project.estimated_days && (
                            <span className="flex items-center gap-0.5">
                              <Clock className="h-3 w-3" />{project.estimated_days}d
                            </span>
                          )}
                          {project.estimated_cost && (
                            <span className="flex items-center gap-0.5">
                              <DollarSign className="h-3 w-3" />${project.estimated_cost.toLocaleString()}
                            </span>
                          )}
                          {project.assigned_to && (
                            <span className="truncate max-w-[80px]">{project.assigned_to}</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="cursor-pointer hover:border-primary/30 transition-colors"
              onClick={() => {
                setEditProject(project);
                setDialogOpen(true);
              }}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{project.title}</h3>
                    <Badge variant="outline" className={statusColors[project.status]}>{statusLabels[project.status]}</Badge>
                    <Badge variant="outline" className={priorityColors[project.priority]}>{project.priority}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {project.client_name && <span>{project.client_name}</span>}
                    {project.assigned_to && <span>→ {project.assigned_to}</span>}
                    {project.deadline && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(project.deadline).toLocaleDateString()}</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit / Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editProject.id ? "Edit Project" : "New Project"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={editProject.title || ""} onChange={(e) => setEditProject({ ...editProject, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Client Name</Label>
                <Input value={editProject.client_name || ""} onChange={(e) => setEditProject({ ...editProject, client_name: e.target.value })} />
              </div>
              <div>
                <Label>Client Email</Label>
                <Input value={editProject.client_email || ""} onChange={(e) => setEditProject({ ...editProject, client_email: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea rows={3} value={editProject.description || ""} onChange={(e) => setEditProject({ ...editProject, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Status</Label>
                <Select value={editProject.status || "backlog"} onValueChange={(v) => setEditProject({ ...editProject, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select value={editProject.priority || "medium"} onValueChange={(v) => setEditProject({ ...editProject, priority: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Assigned To</Label>
                <Input value={editProject.assigned_to || ""} onChange={(e) => setEditProject({ ...editProject, assigned_to: e.target.value })} />
              </div>
              <div>
                <Label>Est. Cost ($)</Label>
                <Input type="number" value={editProject.estimated_cost ?? ""} onChange={(e) => setEditProject({ ...editProject, estimated_cost: e.target.value ? Number(e.target.value) : null })} />
              </div>
              <div>
                <Label>Est. Days</Label>
                <Input type="number" value={editProject.estimated_days ?? ""} onChange={(e) => setEditProject({ ...editProject, estimated_days: e.target.value ? Number(e.target.value) : null })} />
              </div>
            </div>
            <div>
              <Label>Deadline</Label>
              <Input type="date" value={editProject.deadline || ""} onChange={(e) => setEditProject({ ...editProject, deadline: e.target.value || null })} />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea rows={2} value={editProject.notes || ""} onChange={(e) => setEditProject({ ...editProject, notes: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={saveProject} disabled={saving || !editProject.title}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                {editProject.id ? "Save Changes" : "Create Project"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
