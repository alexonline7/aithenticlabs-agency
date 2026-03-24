import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Smartphone, ShoppingCart, Cloud } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Web Applications",
    desc: "Custom web apps from landing pages to complex enterprise solutions.",
    tags: ["SaaS Platforms", "Business Portals", "Admin Dashboards"],
  },
  {
    icon: Smartphone,
    title: "Mobile Applications",
    desc: "Native iOS/Android, cross-platform, and progressive web apps.",
    tags: ["Native Apps", "Cross-Platform", "PWAs"],
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    desc: "Online stores, marketplaces, and subscription platforms.",
    tags: ["Stores", "Marketplaces", "B2B Portals"],
  },
  {
    icon: Cloud,
    title: "SaaS Platforms",
    desc: "Scalable software-as-a-service with enterprise-grade architecture.",
    tags: ["Analytics", "CRM Systems", "Project Management"],
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold font-bricolage text-foreground mb-4">
            What We Build
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From concept to deployment, tailored to your business needs
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <Card
              key={s.title}
              className="dark-slate-purple-card glass-effect group hover:border-primary/30 transition-all duration-300"
            >
              <CardHeader>
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 w-fit mb-3">
                  <s.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">{s.desc}</p>
                <div className="space-y-2">
                  {s.tags.map((t) => (
                    <div key={t} className="text-xs text-foreground/70 flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-primary" />
                      {t}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
