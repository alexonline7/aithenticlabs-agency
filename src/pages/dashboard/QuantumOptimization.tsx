import { useState, useCallback, useRef } from "react";
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
  Loader2,
} from "lucide-react";

/* ── types ─────────────────────────────────────────────── */
interface Metric {
  label: string;
  score: number;
  unit?: string;
  status: "excellent" | "good" | "fair" | "poor";
  icon: React.ElementType;
}

interface Optimization {
  title: string;
  status: "active" | "review" | "pending" | "completed";
  improvement: string;
  severity: "success" | "warning" | "info";
}

interface Phase {
  phase: string;
  progress: number;
}

/* ── helpers ───────────────────────────────────────────── */
function statusFromScore(score: number): Metric["status"] {
  if (score >= 90) return "excellent";
  if (score >= 75) return "good";
  if (score >= 50) return "fair";
  return "poor";
}

function randomBetween(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min));
}

const PHASES: string[] = [
  "Initial Scan",
  "Asset Optimization",
  "Code Analysis",
  "AI Model Tuning",
  "Final Report",
];

/* ── component ─────────────────────────────────────────── */
export default function QuantumOptimization() {
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const abortRef = useRef(false);

  const [metrics, setMetrics] = useState<Metric[]>([
    { label: "Core Web Vitals", score: 0, status: "poor", icon: Gauge },
    { label: "AI Model Latency", score: 0, unit: "ms", status: "poor", icon: Cpu },
    { label: "Bundle Optimization", score: 0, status: "poor", icon: BarChart3 },
    { label: "Quantum Coherence", score: 0, status: "poor", icon: Zap },
  ]);

  const [optimizations, setOptimizations] = useState<Optimization[]>([]);

  const [phases, setPhases] = useState<Phase[]>(
    PHASES.map((p) => ({ phase: p, progress: 0 }))
  );

  /* simulate progressive scan */
  const runScan = useCallback(async () => {
    setScanning(true);
    setScanComplete(false);
    abortRef.current = false;

    // Reset
    setOptimizations([]);
    setPhases(PHASES.map((p) => ({ phase: p, progress: 0 })));
    setMetrics((prev) => prev.map((m) => ({ ...m, score: 0, status: "poor" as const })));

    const delay = (ms: number) =>
      new Promise<void>((resolve) => {
        const t = setTimeout(resolve, ms);
        // allow cleanup if needed
        return () => clearTimeout(t);
      });

    /* Phase 1 – Initial Scan */
    for (let p = 0; p <= 100 && !abortRef.current; p += randomBetween(8, 20)) {
      const val = Math.min(p, 100);
      setPhases((prev) => prev.map((ph, i) => (i === 0 ? { ...ph, progress: val } : ph)));
      await delay(120);
    }
    setPhases((prev) => prev.map((ph, i) => (i === 0 ? { ...ph, progress: 100 } : ph)));

    // Populate first metric
    const coreVitals = randomBetween(85, 99);
    setMetrics((prev) =>
      prev.map((m) =>
        m.label === "Core Web Vitals" ? { ...m, score: coreVitals, status: statusFromScore(coreVitals) } : m
      )
    );

    /* Phase 2 – Asset Optimization */
    for (let p = 0; p <= 100 && !abortRef.current; p += randomBetween(10, 25)) {
      const val = Math.min(p, 100);
      setPhases((prev) => prev.map((ph, i) => (i === 1 ? { ...ph, progress: val } : ph)));
      await delay(100);
    }
    setPhases((prev) => prev.map((ph, i) => (i === 1 ? { ...ph, progress: 100 } : ph)));

    const latency = randomBetween(8, 25);
    setMetrics((prev) =>
      prev.map((m) =>
        m.label === "AI Model Latency" ? { ...m, score: latency, status: latency < 15 ? "excellent" : latency < 30 ? "good" : "fair" } : m
      )
    );

    // Add first optimizations
    setOptimizations((prev) => [
      ...prev,
      { title: "AI Model Caching Layer", status: "active", improvement: `-${randomBetween(40, 80)}ms latency`, severity: "success" },
    ]);

    /* Phase 3 – Code Analysis */
    for (let p = 0; p <= 100 && !abortRef.current; p += randomBetween(6, 18)) {
      const val = Math.min(p, 100);
      setPhases((prev) => prev.map((ph, i) => (i === 2 ? { ...ph, progress: val } : ph)));
      await delay(130);
    }
    setPhases((prev) => prev.map((ph, i) => (i === 2 ? { ...ph, progress: 100 } : ph)));

    const bundle = randomBetween(78, 95);
    setMetrics((prev) =>
      prev.map((m) =>
        m.label === "Bundle Optimization" ? { ...m, score: bundle, status: statusFromScore(bundle) } : m
      )
    );

    setOptimizations((prev) => [
      ...prev,
      { title: "Code Splitting Optimization", status: "active", improvement: `-${randomBetween(30, 50)}% bundle size`, severity: "success" },
      { title: "Prefetch Strategy", status: "review", improvement: `+${randomBetween(12, 25)}% navigation speed`, severity: "warning" },
    ]);

    /* Phase 4 – AI Model Tuning */
    for (let p = 0; p <= 100 && !abortRef.current; p += randomBetween(5, 15)) {
      const val = Math.min(p, 100);
      setPhases((prev) => prev.map((ph, i) => (i === 3 ? { ...ph, progress: val } : ph)));
      await delay(140);
    }
    setPhases((prev) => prev.map((ph, i) => (i === 3 ? { ...ph, progress: 100 } : ph)));

    const coherence = randomBetween(88, 99);
    setMetrics((prev) =>
      prev.map((m) =>
        m.label === "Quantum Coherence" ? { ...m, score: coherence, status: statusFromScore(coherence) } : m
      )
    );

    // Advance Prefetch Strategy → active
    setOptimizations((prev) =>
      prev.map((o) =>
        o.title === "Prefetch Strategy" ? { ...o, status: "active", severity: "success" } : o
      )
    );

    setOptimizations((prev) => [
      ...prev,
      { title: "WebSocket Connection Pool", status: "active", improvement: `+${randomBetween(15, 35)}% throughput`, severity: "info" },
    ]);

    /* Phase 5 – Final Report */
    for (let p = 0; p <= 100 && !abortRef.current; p += randomBetween(12, 30)) {
      const val = Math.min(p, 100);
      setPhases((prev) => prev.map((ph, i) => (i === 4 ? { ...ph, progress: val } : ph)));
      await delay(90);
    }
    setPhases((prev) => prev.map((ph, i) => (i === 4 ? { ...ph, progress: 100 } : ph)));

    // Mark all optimizations as completed
    setOptimizations((prev) =>
      prev.map((o) => ({ ...o, status: "completed" as const, severity: "success" as const }))
    );

    setScanning(false);
    setScanComplete(true);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-bricolage flex items-center gap-2">
            <Zap className="h-8 w-8 text-primary" />
            Quantum Optimization
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered performance analysis &amp; optimization engine
          </p>
        </div>
        <Button
          className="accent-gradient text-primary-foreground gap-2"
          disabled={scanning}
          onClick={runScan}
        >
          {scanning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {scanning ? "Scanning…" : "Run Full Scan"}
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} className="dark-slate-purple-card">
            <CardContent className="pt-6">
              <m.icon className="h-6 w-6 text-primary mb-3" />
              <p className="text-3xl font-bold text-foreground">
                {m.score}
                {m.unit ?? "%"}
              </p>
              <p className="text-sm text-muted-foreground">{m.label}</p>
              <Badge variant="secondary" className="mt-2 text-xs capitalize">
                {m.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Optimizations */}
      <Card className="dark-slate-purple-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-secondary" />
            Active Optimizations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {optimizations.length === 0 && !scanning && (
            <p className="text-sm text-muted-foreground text-center py-4">
              {scanComplete ? "No optimizations found." : "Run a full scan to discover optimizations."}
            </p>
          )}
          {scanning && optimizations.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4 flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Analyzing…
            </p>
          )}
          {optimizations.map((opt, i) => (
            <div
              key={i}
              className="glass-effect rounded-lg p-4 flex items-center justify-between animate-fade-in"
            >
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
                variant={
                  opt.status === "active"
                    ? "default"
                    : opt.status === "review"
                      ? "secondary"
                      : "outline"
                }
                className="text-xs capitalize"
              >
                {opt.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="dark-slate-purple-card">
        <CardHeader>
          <CardTitle>Optimization Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {phases.map((p) => (
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
