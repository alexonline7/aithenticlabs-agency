import { Lightbulb, Cpu, Rocket } from "lucide-react";

const steps = [
  {
    icon: Lightbulb,
    step: "01",
    title: "Share Your Idea",
    desc: "Chat with our AI about your vision. It asks the right questions to understand your goals, audience, and requirements.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "Get Your Blueprint",
    desc: "In minutes, receive a complete technical blueprint: architecture, UX flow, tech stack, timeline, and cost estimate.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "We Build It",
    desc: "Our team brings your blueprint to life using AI-accelerated development. Simple MVPs ship in 24 hours.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold font-bricolage text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From idea to deployed app — simpler than you'd expect
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={s.step} className="relative text-center">
              {/* connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/40 to-transparent" />
              )}
              <div className="mx-auto w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-5 relative">
                <s.icon className="h-10 w-10 text-primary" />
                <span className="absolute -top-2 -right-2 text-xs font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                  {s.step}
                </span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
