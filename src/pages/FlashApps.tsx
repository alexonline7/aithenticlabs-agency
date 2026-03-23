import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Rocket, Brain, Code, Database, Cloud, GitBranch, ArrowRight, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

const phases = [
  {
    num: 1,
    title: "Foundation – Launch Platform & Flow",
    desc: "Build the infrastructure, flow, and business model",
    items: ["Minimalist AI-focused design", "AI Chat Assistant decision layer", "Payment & hosting flow", "Pricing: $149-$399"],
  },
  {
    num: 2,
    title: "Quantum AI Engine – Sub-15 Second Generation",
    desc: "Revolutionary quantum-speed app generation in 8-15 seconds",
    items: ["Quantum AI orchestration", "Multi-model ensemble (GPT-4o, Claude, Gemini)", "Instant deployment pipeline", "Real-time quality assurance"],
  },
  {
    num: 3,
    title: "Trend Creation & Market Innovation",
    desc: "Be the originator, not follower",
    items: ["Trend prediction agents", "Original app concepts monthly", "Market research automation", "Innovation showcase"],
  },
  {
    num: 4,
    title: "Automation & Scale",
    desc: "Full automation and client management",
    items: ["Admin dashboard", "Client management", "AI help desk", "Update automation"],
  },
];

const techStack = [
  { icon: Brain, title: "Chat Assistant", tech: "OpenAI + Gemini + Mistral", desc: "Dynamic conversation, niche recognition, project scoping" },
  { icon: GitBranch, title: "Agent Coordination", tech: "LangSmith + LangGraph", desc: "Turns user input into apps, runs QA and deployment" },
  { icon: Code, title: "Frontend/UI", tech: "Next.js + Tailwind", desc: "Fast, clean, responsive design" },
  { icon: Database, title: "Backend/Storage", tech: "Supabase / Firebase", desc: "Lightweight database with auth" },
  { icon: Zap, title: "AI Templates", tech: "You + OpenAI", desc: "Custom pre-built frameworks" },
  { icon: Cloud, title: "Hosting & Deployment", tech: "Cloud Platforms + GitHub", desc: "Easy client or agency hosting" },
];

const outcomes = [
  "Launch the world's first quantum AI web app agency",
  "Deliver full web apps in 8–15 seconds with quantum generation",
  "Serve niche pros with ultra-original apps at light speed",
  "Lead the quantum revolution, don't follow outdated methods",
  "Monetize with quantum speed: instant delivery, immediate value",
  "Harness quantum AI ensemble: GPT-4o + Claude + Gemini simultaneously",
];

export default function FlashApps() {
  return (
    <div className="min-h-screen luxury-gradient">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl animate-fade-in">
          <p className="text-electric-blue-500 font-medium mb-4 tracking-wide flex items-center justify-center gap-2">
            <Zap className="h-5 w-5" /> 8-15 Second Quantum Generation
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-bricolage mb-6">
            <span className="text-slate-100">Quantum</span>{" "}
            <span className="gradient-text">Generation</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-6">
            Revolutionary breakthrough! Get AI web apps for niche professionals generated in just 8–15 seconds. We don't just build fast—we've shattered the time barrier.
          </p>
          <p className="text-deep-gold-500 font-medium mb-8">
            ⚡ Choose your AI-powered Web App. Generated in 8–15 seconds with Quantum AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="h-12 px-8 text-lg bg-gradient-to-r from-deep-gold-500 to-electric-blue-500 text-charcoal-900 font-bold hover:opacity-90 shadow-lg">
              Start Building Now <Rocket className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="h-12 px-8 text-lg border-electric-blue-500/30 text-electric-blue-500 hover:bg-electric-blue-500/10">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold font-bricolage text-slate-100 mb-6">Our Vision</h2>
          <blockquote className="text-slate-300 text-lg italic glass-effect rounded-xl p-8 border-l-4 border-deep-gold-500">
            "Revolutionary quantum leap: Deliver trend-inspired AI web apps for niche professionals in just 8–15 seconds. We've shattered the time barrier with quantum AI technology. Users choose, quantum AI generates instantly, and the future is now."
          </blockquote>
        </div>
      </section>

      {/* Phases */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-bricolage text-slate-100 mb-4">Strategy in Logical Sequence</h2>
            <p className="text-slate-400">Our systematic approach to building the world's fastest AI web app agency</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {phases.map((p) => (
              <Card key={p.num} className="dark-slate-purple-card glass-effect hover:border-deep-gold-500/30 transition-all">
                <CardHeader>
                  <span className="text-deep-gold-500 text-sm font-bold">Phase {p.num}</span>
                  <CardTitle className="text-xl text-slate-100">{p.title}</CardTitle>
                  <p className="text-slate-400 text-sm">{p.desc}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {p.items.map((item) => (
                      <li key={item} className="text-slate-300 text-sm flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-electric-blue-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-bricolage text-slate-100 mb-4">Tech Stack & Collaboration</h2>
            <p className="text-slate-400">Powered by the world's best AI platforms working in perfect harmony</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((t) => (
              <Card key={t.title} className="dark-slate-purple-card glass-effect hover:border-deep-gold-500/30 transition-all">
                <CardContent className="pt-6">
                  <t.icon className="h-8 w-8 text-deep-gold-500 mb-3" />
                  <h3 className="text-lg font-bold text-slate-100 mb-1">{t.title}</h3>
                  <p className="text-electric-blue-400 text-sm font-medium mb-2">{t.tech}</p>
                  <p className="text-slate-400 text-sm">{t.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Expected Outcomes */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <p className="text-center text-deep-gold-500 font-medium mb-2">What You Will Achieve</p>
          <h2 className="text-3xl md:text-4xl font-bold font-bricolage text-slate-100 mb-10 text-center">Expected Outcomes</h2>
          <div className="space-y-4">
            {outcomes.map((o) => (
              <div key={o} className="flex items-start gap-3 glass-effect rounded-lg p-4">
                <CheckCircle className="h-5 w-5 text-electric-blue-500 mt-0.5 shrink-0" />
                <p className="text-slate-300">{o}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <p className="text-deep-gold-500 font-medium mb-3">Ready to Revolutionize?</p>
          <h2 className="text-3xl md:text-4xl font-bold font-bricolage text-slate-100 mb-4">Launch Your AI Web App Agency Today</h2>
          <p className="text-slate-400 mb-8">Join the quantum revolution of 8-15 second AI web app generation. Be the pioneer of impossible speed.</p>
          <Button className="h-14 px-10 text-lg bg-gradient-to-r from-deep-gold-500 to-electric-blue-500 text-charcoal-900 font-bold hover:opacity-90 shadow-xl">
            Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 px-4 text-center text-slate-500 text-sm">
        © 2024 AIThenticLabs. Crafting the future, one innovation at a time.
      </footer>
    </div>
  );
}
