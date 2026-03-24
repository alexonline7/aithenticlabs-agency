import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "AIThenticLabs delivered exactly what we needed. Their AI recommendation system helped us choose the perfect solution for our business.",
    name: "Sarah Johnson",
    role: "CEO, TechStartup Inc.",
    project: "SaaS Platform Development",
  },
  {
    quote: "The e-commerce platform they built for us increased our online sales by 300%. Outstanding technical expertise and project management.",
    name: "Michael Chen",
    role: "CTO, RetailCorp",
    project: "E-commerce Solution",
  },
  {
    quote: "From concept to launch in record time. The AI-powered recommendations were spot-on and saved us months of planning.",
    name: "Emily Rodriguez",
    role: "Founder, HealthTech Solutions",
    project: "Healthcare App Development",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold font-bricolage text-foreground mb-4">
            Client Success Stories
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See what our clients say about working with AIThenticLabs
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card key={t.name} className="dark-slate-purple-card glass-effect">
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-primary/40 mb-4" />
                <p className="text-foreground/80 italic mb-6">"{t.quote}"</p>
                <div>
                  <p className="text-foreground font-bold">{t.name}</p>
                  <p className="text-muted-foreground text-sm">{t.role}</p>
                  <p className="text-primary text-xs mt-1">{t.project}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
