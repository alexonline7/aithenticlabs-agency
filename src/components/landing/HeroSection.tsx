import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lightbulb, Send, ArrowRight } from "lucide-react";

const stats = [
  { value: "24h", label: "MVP Delivery" },
  { value: "AI-First", label: "Architecture" },
  { value: "$500+", label: "Starting From" },
  { value: "100%", label: "Custom Built" },
];

export default function HeroSection() {
  return (
    <section className="pt-28 pb-20 px-4">
      <div className="container mx-auto text-center max-w-4xl animate-fade-in">
        <p className="text-primary font-medium mb-4 tracking-wide uppercase text-sm">
          AI-Powered Development Studio
        </p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-bricolage mb-6">
          <span className="text-foreground">Your Idea.</span>{" "}
          <span className="gradient-text">Built Fast.</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-12">
          Tell our AI your vision — get a complete technical blueprint in minutes.
          Then let us build it in days, not months.
        </p>

        {/* Two clear paths */}
        <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-16">
          <Link to="/idea-to-blueprint" className="group">
            <div className="glass-effect rounded-2xl p-6 hover:border-primary/40 transition-all duration-300 h-full flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/15 group-hover:bg-primary/25 transition-colors">
                <Lightbulb className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">I have an idea</h3>
              <p className="text-sm text-muted-foreground">
                Chat with our AI to explore your concept and get a full blueprint — free, no account needed
              </p>
              <span className="text-primary text-sm font-semibold flex items-center gap-1 mt-auto">
                Start exploring <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>

          <Link to="/submit-project" className="group">
            <div className="glass-effect rounded-2xl p-6 hover:border-secondary/40 transition-all duration-300 h-full flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-secondary/15 group-hover:bg-secondary/25 transition-colors">
                <Send className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">I'm ready to build</h3>
              <p className="text-sm text-muted-foreground">
                Submit your project details and get a personalized plan within 24 hours
              </p>
              <span className="text-secondary text-sm font-semibold flex items-center gap-1 mt-auto">
                Start a project <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="glass-effect rounded-xl p-4">
              <div className="text-2xl md:text-3xl font-bold gradient-text">{s.value}</div>
              <div className="text-muted-foreground text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
