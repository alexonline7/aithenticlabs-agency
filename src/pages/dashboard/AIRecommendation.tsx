import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Sparkles,
  Target,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Zap,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Recommendation {
  title: string;
  match: number;
  reason: string;
  techs: string[];
  timeline: string;
}

export default function AIRecommendation() {
  const [step, setStep] = useState(1);
  const [businessDesc, setBusinessDesc] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const handleAnalyze = async () => {
    if (!industry.trim() && !businessDesc.trim()) return;
    setStep(2);
    setLoading(true);
    setError("");

    try {
      const { data, error: fnError } = await supabase.functions.invoke("ai-recommend", {
        body: { industry, businessDesc },
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      setRecommendations(data.recommendations || []);
      setStep(3);
    } catch (err) {
      console.error("Recommendation error:", err);
      setError(err instanceof Error ? err.message : "Failed to get recommendations");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-bricolage flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          AI Recommendation Engine
        </h1>
        <p className="text-muted-foreground mt-1">Get personalized app recommendations powered by GPT-4</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                s <= step ? "accent-gradient text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {s < step ? <CheckCircle className="h-4 w-4" /> : s}
            </div>
            {s < 3 && <div className={`w-12 h-0.5 ${s < step ? "bg-primary" : "bg-muted"}`} />}
          </div>
        ))}
        <span className="text-sm text-muted-foreground ml-2">
          {step === 1 ? "Describe your business" : step === 2 ? "AI Analysis" : "Recommendations"}
        </span>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="pt-4 flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <Card className="dark-slate-purple-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Tell us about your project
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Industry / Niche</label>
              <Input
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g., Healthcare, E-commerce, Education..."
                className="bg-background border-input"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Business Description</label>
              <Textarea
                value={businessDesc}
                onChange={(e) => setBusinessDesc(e.target.value)}
                placeholder="Describe what your business does, your target audience, and what problems you're trying to solve..."
                className="bg-background border-input"
                rows={4}
              />
            </div>
            <Button onClick={handleAnalyze} className="accent-gradient text-primary-foreground gap-2">
              Analyze with AI <Sparkles className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="dark-slate-purple-card">
          <CardContent className="pt-6 text-center space-y-4">
            <Zap className="h-12 w-12 text-primary mx-auto animate-pulse" />
            <h3 className="text-xl font-bold text-foreground">GPT-4 Analyzing Your Business...</h3>
            <p className="text-muted-foreground">Processing your business profile through OpenAI's GPT-4</p>
            <Progress value={loading ? 65 : 100} className="h-2 max-w-xs mx-auto" />
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              AI Recommendations
            </h2>
            <Button variant="outline" size="sm" onClick={() => { setStep(1); setRecommendations([]); }}>
              Start Over
            </Button>
          </div>
          {recommendations.length === 0 ? (
            <Card className="dark-slate-purple-card">
              <CardContent className="pt-6 text-center text-muted-foreground">
                No recommendations generated. Please try again with more details.
              </CardContent>
            </Card>
          ) : (
            recommendations.map((rec, i) => (
              <Card key={i} className="dark-slate-purple-card hover:border-primary/30 transition-all">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-foreground">{rec.title}</h3>
                        <Badge className="accent-gradient text-primary-foreground">{rec.match}% Match</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.reason}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {rec.techs.map((t) => (
                          <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BarChart3 className="h-4 w-4" /> Est. timeline: {rec.timeline}
                      </div>
                    </div>
                    <Link to={`/submit-project?title=${encodeURIComponent(rec.title)}&desc=${encodeURIComponent(rec.reason)}`}>
                      <Button className="accent-gradient text-primary-foreground gap-2 shrink-0">
                        Get Started <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
