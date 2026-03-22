import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Zap,
  Gauge,
  Cpu,
  BarChart3,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

const metrics = [
  { label: "Core Web Vitals", score: 96, status: "excellent", icon: Gauge },
  { label: "AI Model Latency", score: 12, unit: "ms", status: "excellent", icon: Cpu },
  { label: "Bundle Optimization", score: 89, status: "good", icon: BarChart3 },
  { label: "Quantum Coherence", score: 94, status: "excellent", icon: Zap },
];

const optimizations = [
  
  { title: "AI Model Caching Layer", status: "active", improvement: "-67ms latency", severity: "success" },
  { title: "Code Splitting Optimization", status: "active", improvement: "-42% bundle size", severity: "success" },
  { title: "Prefetch Strategy", status: "review", improvement: "+18% navigation speed", severity: "warning" },
  { title: "WebSocket Connection Pool", status: "pending", improvement: "+25% throughput", severity: "info" },
];

export default function QuantumOptimization() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-bricolage flex items-center gap-2">
            <Zap className="h-8 w-8 text-primary" />
            Quantum Optimization
          </h1>
          <p className="text-muted-foreground mt-1">AI-powered performance analysis & optimization engine</p>
        </div>
        <Button className="accent-gradient text-primary-foreground gap-2">
          <RefreshCw className="h-4 w-4" /> Run Full Scan
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} className="dark-slate-purple-card">
            <CardContent className="pt-6">
              <m.icon className="h-6 w-6 text-primary mb-3" />
              <p className="text-3xl font-bold text-foreground">
                {m.score}{m.unit ?? "%"}
              </p>
              <p className="text-sm text-muted-foreground">{m.label}</p>
              <Badge variant="secondary" className="mt-2 text-xs capitalize">{m.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="dark-slate-purple-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-secondary" />
            Active Optimizations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {optimizations.map((opt, i) => (
            <div key={i} className="glass-effect rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {opt.severity === "success" ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : opt.severity === "warning" ? (
                  <AlertTriangle className="h-5 w-5 text-primary" />
                ) : (
                  <Zap className="h-5 w-5 text-secondary" />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">{opt.title}</p>
                  <p className="text-xs text-muted-foreground">{opt.improvement}</p>
                </div>
              </div>
              <Badge
                variant={opt.status === "active" ? "default" : opt.status === "review" ? "secondary" : "outline"}
                className="text-xs capitalize"
              >
                {opt.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="dark-slate-purple-card">
        <CardHeader>
          <CardTitle>Optimization Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { phase: "Initial Scan", progress: 100 },
            { phase: "Asset Optimization", progress: 100 },
            { phase: "Code Analysis", progress: 89 },
            { phase: "AI Model Tuning", progress: 72 },
            { phase: "Final Deployment", progress: 45 },
          ].map((p) => (
            <div key={p.phase} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{p.phase}</span>
                <span className="font-medium text-foreground">{p.progress}%</span>
              </div>
              <Progress value={p.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
