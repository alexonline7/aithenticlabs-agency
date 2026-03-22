import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  Zap,
  FileText,
  Download,
  Clock,
  CheckCircle,
  ArrowRight,
  Rocket,
  Brain,
} from "lucide-react";

const previousGenerations = [
  { id: 1, title: "AI Fitness Coach Brief", niche: "Health & Fitness", pages: 22, time: "12s", date: "Jan 28, 2025" },
  { id: 2, title: "Smart Recipe Platform", niche: "Food & Cooking", pages: 18, time: "9s", date: "Jan 27, 2025" },
  { id: 3, title: "Pet Care Marketplace", niche: "Animals & Pets", pages: 26, time: "14s", date: "Jan 26, 2025" },
];

export default function FlashAppsGenerator() {
  const [appName, setAppName] = useState("");
  const [niche, setNiche] = useState("");
  const [description, setDescription] = useState("");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerate = () => {
    if (!appName.trim() || !niche.trim()) return;
    setGenerating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setGenerating(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-bricolage flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          FlashApps Generator
        </h1>
        <p className="text-muted-foreground mt-1">Generate complete project briefs in 8-15 seconds with quantum AI</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Avg Generation Time", value: "12s", icon: Clock },
          { label: "Briefs Generated", value: "47", icon: FileText },
          { label: "Success Rate", value: "100%", icon: CheckCircle },
        ].map((s) => (
          <Card key={s.label} className="dark-slate-purple-card">
            <CardContent className="pt-6 flex items-center gap-4">
              <s.icon className="h-6 w-6 text-primary shrink-0" />
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Generator */}
      <Card className="dark-slate-purple-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Generate New Brief
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">App Name</label>
              <Input
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="e.g., SmartFit Pro"
                className="bg-background border-input"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Niche / Industry</label>
              <Input
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g., Health & Fitness"
                className="bg-background border-input"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description (optional)</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your app idea, target audience, and key features..."
              className="bg-background border-input"
              rows={3}
            />
          </div>

          {generating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Brain className="h-4 w-4 animate-pulse text-primary" />
                  Quantum AI generating brief...
                </span>
                <span className="font-medium text-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={generating || !appName.trim() || !niche.trim()}
            className="accent-gradient text-primary-foreground gap-2"
          >
            {generating ? (
              <>Generating... <Zap className="h-4 w-4 animate-pulse" /></>
            ) : (
              <>Generate Brief <Rocket className="h-4 w-4" /></>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Previous Generations */}
      <Card className="dark-slate-purple-card">
        <CardHeader>
          <CardTitle>Previous Generations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {previousGenerations.map((gen) => (
            <div key={gen.id} className="glass-effect rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FileText className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="font-medium text-foreground">{gen.title}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span>{gen.niche}</span>
                    <span>{gen.pages} pages</span>
                    <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-primary" /> {gen.time}</span>
                    <span>{gen.date}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-3 w-3" /> PDF
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
