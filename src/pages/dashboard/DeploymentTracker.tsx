import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Rocket,
  Globe,
  GitBranch,
  Clock,
  CheckCircle,
  Loader2,
  AlertCircle,
  Play,
  RefreshCw,
} from "lucide-react";

const deployments = [
  {
    id: "dep-001",
    name: "AI Sales Coach v2.1",
    env: "Production",
    status: "live",
    progress: 100,
    branch: "main",
    time: "2 hours ago",
    url: "sales-coach.aithenticlabs.app",
  },
  {
    id: "dep-002",
    name: "Language Teacher Update",
    env: "Staging",
    status: "deploying",
    progress: 67,
    branch: "feature/adaptive-lessons",
    time: "15 min ago",
    url: "staging-teacher.aithenticlabs.app",
  },
  {
    id: "dep-003",
    name: "E-commerce Dashboard",
    env: "Development",
    status: "queued",
    progress: 0,
    branch: "dev/quantum-cart",
    time: "Queued",
    url: "dev-ecommerce.aithenticlabs.app",
  },
  {
    id: "dep-004",
    name: "Health Tracker MVP",
    env: "Production",
    status: "failed",
    progress: 45,
    branch: "release/v1.0",
    time: "1 day ago",
    url: "health.aithenticlabs.app",
  },
];

const statusConfig = {
  live: { icon: CheckCircle, color: "text-green-500", badge: "default" as const },
  deploying: { icon: Loader2, color: "text-secondary", badge: "secondary" as const },
  queued: { icon: Clock, color: "text-muted-foreground", badge: "outline" as const },
  failed: { icon: AlertCircle, color: "text-destructive", badge: "destructive" as const },
};

export default function DeploymentTracker() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-bricolage flex items-center gap-2">
            <Rocket className="h-8 w-8 text-primary" />
            Deployment Tracker
          </h1>
          <p className="text-muted-foreground mt-1">Track and manage quantum-speed deployments</p>
        </div>
        <Button className="accent-gradient text-primary-foreground gap-2">
          <Play className="h-4 w-4" /> New Deployment
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Deployments", value: "156" },
          { label: "Success Rate", value: "97.4%" },
          { label: "Avg Deploy Time", value: "12s" },
          { label: "Active Environments", value: "8" },
        ].map((s) => (
          <Card key={s.label} className="dark-slate-purple-card">
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {deployments.map((dep) => {
          const cfg = statusConfig[dep.status as keyof typeof statusConfig];
          const StatusIcon = cfg.icon;
          return (
            <Card key={dep.id} className="dark-slate-purple-card hover:border-primary/30 transition-all">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <StatusIcon className={`h-6 w-6 ${cfg.color} ${dep.status === "deploying" ? "animate-spin" : ""}`} />
                    <div>
                      <h3 className="font-semibold text-foreground">{dep.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> {dep.env}</span>
                        <span className="flex items-center gap-1"><GitBranch className="h-3 w-3" /> {dep.branch}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {dep.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={cfg.badge} className="capitalize">{dep.status}</Badge>
                    {dep.status === "failed" && (
                      <Button variant="outline" size="sm" className="gap-1">
                        <RefreshCw className="h-3 w-3" /> Retry
                      </Button>
                    )}
                  </div>
                </div>
                {dep.status === "deploying" && (
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Deploying...</span>
                      <span>{dep.progress}%</span>
                    </div>
                    <Progress value={dep.progress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
