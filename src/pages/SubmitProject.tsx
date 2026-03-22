import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Send, CheckCircle, ArrowLeft, Sparkles } from "lucide-react";

const PROJECT_TYPES = [
  { value: "web-app", label: "Web Application" },
  { value: "mobile-app", label: "Mobile Application" },
  { value: "ecommerce", label: "E-commerce Platform" },
  { value: "saas", label: "SaaS Product" },
  { value: "landing-page", label: "Landing Page / Website" },
  { value: "ai-tool", label: "AI-Powered Tool" },
  { value: "dashboard", label: "Dashboard / Analytics" },
  { value: "marketplace", label: "Marketplace / Platform" },
  { value: "automation", label: "Workflow Automation" },
  { value: "other", label: "Other" },
];

export default function SubmitProject() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    searchParams.get("type") ? searchParams.get("type")!.split(",") : []
  );
  const [description, setDescription] = useState(searchParams.get("desc") || "");
  const [budget, setBudget] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const prefilledTitle = searchParams.get("title");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !description.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id || null;

      const typeLabels = selectedTypes.map(v => PROJECT_TYPES.find(t => t.value === v)?.label || v).join(", ");
      const projectDescription = [
        prefilledTitle ? `Recommended App: ${prefilledTitle}` : "",
        `Type: ${typeLabels || "Not specified"}`,
        `Budget: ${budget || "Not specified"}`,
        "",
        description,
      ].filter(Boolean).join("\n");

      const { error: insertError } = await supabase.from("client_submissions").insert({
        email: email.trim(),
        name: name.trim() || null,
        project_description: projectDescription,
        submission_type: "project-request",
        user_id: userId,
        ai_recommendation: prefilledTitle ? { recommended_app: prefilledTitle } : {},
      });

      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err) {
      console.error("Submit error:", err);
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen luxury-gradient">
        <Navbar />
        <div className="pt-28 pb-20 px-4">
          <div className="container mx-auto max-w-lg text-center animate-fade-in">
            <div className="mx-auto w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold font-bricolage text-slate-100 mb-4">Project Submitted!</h1>
            <p className="text-slate-400 mb-8">
              Thank you, {name || "there"}! We've received your project request and will get back to you at <span className="text-deep-gold-500">{email}</span> within 24 hours.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/">
                <Button variant="outline" className="border-deep-gold-500/30 text-deep-gold-500">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back Home
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-deep-gold-500 to-electric-blue-500 text-charcoal-900 font-bold">
                  Explore Dashboard <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen luxury-gradient">
      <Navbar />
      <div className="pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-2xl animate-fade-in">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold font-bricolage text-slate-100 mb-3">
              Start Your Project
            </h1>
            <p className="text-slate-400">
              Tell us about your idea and we'll craft a tailored solution for your business
            </p>
          </div>

          {prefilledTitle && (
            <Card className="dark-slate-purple-card glass-effect border-deep-gold-500/30 mb-6">
              <CardContent className="pt-4 flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-deep-gold-500 shrink-0" />
                <p className="text-sm text-slate-300">
                  Pre-filled from AI Recommendation: <span className="text-deep-gold-500 font-semibold">{prefilledTitle}</span>
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="dark-slate-purple-card glass-effect">
            <CardHeader>
              <CardTitle className="text-xl text-slate-100">Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Your Name</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="bg-background border-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Email *</Label>
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="bg-background border-input"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Project Type <span className="text-xs text-muted-foreground">(select up to 2)</span></Label>
                  <Select
                    value=""
                    onValueChange={(val) => {
                      if (!selectedTypes.includes(val) && selectedTypes.length < 2) {
                        setSelectedTypes([...selectedTypes, val]);
                      }
                    }}
                  >
                    <SelectTrigger className="bg-background border-input">
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_TYPES.filter(t => !selectedTypes.includes(t.value)).map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedTypes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTypes.map((v) => {
                        const label = PROJECT_TYPES.find(t => t.value === v)?.label || v;
                        return (
                          <span
                            key={v}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-deep-gold-500/20 border border-deep-gold-500 text-deep-gold-500"
                          >
                            {label}
                            <button type="button" onClick={() => setSelectedTypes(selectedTypes.filter(s => s !== v))} className="ml-1 hover:text-foreground">×</button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Estimated Budget <span className="text-xs text-muted-foreground">(AI-accelerated pricing)</span></Label>
                  <Select value={budget} onValueChange={setBudget}>
                    <SelectTrigger className="bg-background border-input">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="500-1k">$500 – $1,000</SelectItem>
                      <SelectItem value="3k-5k">$3,000 – $5,000</SelectItem>
                      <SelectItem value="7k-10k">$7,000 – $10,000</SelectItem>
                      <SelectItem value="15k-20k">$15,000 – $20,000</SelectItem>
                      <SelectItem value="20k+">$20,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Project Description *</Label>
                  <Textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your project goals, target audience, key features, and timeline expectations..."
                    className="bg-background border-input min-h-[120px]"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-400">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={submitting || !email.trim() || !description.trim()}
                  className="w-full h-12 text-lg bg-gradient-to-r from-deep-gold-500 to-electric-blue-500 text-charcoal-900 font-bold hover:opacity-90"
                >
                  {submitting ? "Submitting..." : "Submit Project Request"}
                  <Send className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
