import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Globe, Smartphone, ShoppingCart, Cloud, ArrowRight, Star, Zap, Quote, Briefcase, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const stats = [
  { value: "500+", label: "Projects Delivered" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "24/7", label: "Support Available" },
  { value: "8-15S", label: "Quantum Generation" },
];

const services = [
  {
    icon: Globe,
    title: "Web Applications",
    desc: "Custom web apps built with cutting-edge technology, from simple landing pages to complex enterprise solutions.",
    tags: ["SaaS Platforms", "E-commerce Sites", "Business Portals", "Admin Dashboards"],
  },
  {
    icon: Smartphone,
    title: "Mobile Applications",
    desc: "Native iOS and Android apps, cross-platform solutions, and progressive web apps for maximum reach.",
    tags: ["Native Apps", "Cross-Platform", "PWAs", "Mobile-First Design"],
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Solutions",
    desc: "Complete online stores, marketplaces, and subscription platforms that drive sales and growth.",
    tags: ["Online Stores", "Marketplaces", "B2B Portals", "Subscription Models"],
  },
  {
    icon: Cloud,
    title: "SaaS Platforms",
    desc: "Scalable software-as-a-service solutions with robust architectures and enterprise-grade security.",
    tags: ["Analytics Tools", "CRM Systems", "Project Management", "Industry Solutions"],
  },
];

const testimonials = [
  { quote: "AIThenticLabs delivered exactly what we needed. Their AI recommendation system helped us choose the perfect solution for our business.", name: "Sarah Johnson", role: "CEO, TechStartup Inc.", project: "SaaS Platform Development" },
  { quote: "The e-commerce platform they built for us increased our online sales by 300%. Outstanding technical expertise and project management.", name: "Michael Chen", role: "CTO, RetailCorp", project: "E-commerce Solution" },
  { quote: "From concept to launch in record time. The AI-powered recommendations were spot-on and saved us months of planning.", name: "Emily Rodriguez", role: "Founder, HealthTech Solutions", project: "Healthcare App Development" },
];

interface PortfolioProject {
  id: string;
  title: string;
  description: string | null;
  tags: string[] | null;
  status: string;
  client_name: string | null;
}

export default function Index() {
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      const { data } = await supabase
        .from("projects")
        .select("id, title, description, tags, status, client_name")
        .eq("status", "completed")
        .order("updated_at", { ascending: false })
        .limit(6);
      setPortfolio(data || []);
      setLoadingPortfolio(false);
    };
    fetchPortfolio();
  }, []);

  return (
    <div className="min-h-screen luxury-gradient">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl animate-fade-in">
          <p className="text-deep-gold-500 font-medium mb-4 tracking-wide">AI-Powered App Recommendations</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-bricolage mb-6">
            <span className="text-slate-100">Perfect Apps for</span>{" "}
            <span className="gradient-text">Your Business</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Let our AI analyze your business needs and recommend the ideal digital solution. From web apps to mobile platforms, we'll build exactly what you need to grow.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/submit-project">
              <Button className="h-12 px-8 text-lg bg-gradient-to-r from-deep-gold-500 to-electric-blue-500 text-charcoal-900 font-bold hover:opacity-90 shadow-lg">
                Start a Project <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/ai-recommendation">
              <Button variant="outline" className="h-12 px-8 text-lg border-deep-gold-500/30 text-deep-gold-500 hover:bg-deep-gold-500/10">
                Get AI Recommendation <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/flash-apps">
              <Button variant="outline" className="h-12 px-8 text-lg border-electric-blue-500/30 text-electric-blue-500 hover:bg-electric-blue-500/10">
                ⚡ FlashApps Generator
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="glass-effect rounded-xl p-4">
                <div className="text-2xl md:text-3xl font-bold gradient-text">{s.value}</div>
                <div className="text-slate-400 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-bricolage text-slate-100 mb-4">Our Premium Services</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">From concept to deployment, we deliver world-class digital solutions tailored to your business needs</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <Card key={s.title} className="dark-slate-purple-card glass-effect group hover:border-deep-gold-500/30 transition-all duration-300">
                <CardHeader>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-deep-gold-500/20 to-electric-blue-500/20 w-fit mb-3">
                    <s.icon className="h-6 w-6 text-deep-gold-500" />
                  </div>
                  <CardTitle className="text-xl text-slate-100">{s.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm mb-4">{s.desc}</p>
                  <div className="space-y-2">
                    {s.tags.map((t) => (
                      <div key={t} className="text-xs text-slate-300 flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-deep-gold-500" />
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

      {/* Portfolio — from database */}
      <section id="portfolio" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-bricolage text-slate-100 mb-4">Our Portfolio</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Real projects we've delivered for real clients</p>
          </div>

          {loadingPortfolio ? (
            <div className="text-center text-slate-400 py-12">Loading portfolio...</div>
          ) : portfolio.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-2">Portfolio projects are being added.</p>
              <p className="text-slate-500 text-sm">Check back soon or reach out to discuss our past work.</p>
              <Link to="/submit-project" className="mt-4 inline-block">
                <Button variant="outline" className="border-deep-gold-500/30 text-deep-gold-500">
                  Start Your Project <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.map((p) => (
                <Card key={p.id} className="dark-slate-purple-card glass-effect hover:border-deep-gold-500/30 transition-all duration-300">
                  <CardHeader>
                    {p.client_name && (
                      <span className="text-xs font-semibold text-deep-gold-500 mb-1">{p.client_name}</span>
                    )}
                    <CardTitle className="text-xl text-slate-100">{p.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400 text-sm mb-4">{p.description || "Custom-built digital solution."}</p>
                    {p.tags && p.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {p.tags.map((t) => (
                          <span key={t} className="text-xs px-2 py-1 rounded-full bg-secondary/20 text-electric-blue-400">{t}</span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-bricolage text-slate-100 mb-4">Client Success Stories</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">See what our clients say about working with AIThenticLabs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="dark-slate-purple-card glass-effect">
                <CardContent className="pt-6">
                  <Quote className="h-8 w-8 text-deep-gold-500/40 mb-4" />
                  <p className="text-slate-300 italic mb-6">"{t.quote}"</p>
                  <div>
                    <p className="text-slate-100 font-bold">{t.name}</p>
                    <p className="text-slate-400 text-sm">{t.role}</p>
                    <p className="text-deep-gold-500 text-xs mt-1">{t.project}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <p className="text-deep-gold-500 font-medium mb-3">Ready to Get Started?</p>
          <h2 className="text-3xl md:text-4xl font-bold font-bricolage text-slate-100 mb-4">Let's Build Something Great Together</h2>
          <p className="text-slate-400 mb-8">Submit your project idea and get a personalized plan — or let our AI recommend the perfect solution</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/submit-project">
              <Button className="h-14 px-10 text-lg bg-gradient-to-r from-deep-gold-500 to-electric-blue-500 text-charcoal-900 font-bold hover:opacity-90 shadow-xl">
                Submit Your Project <Send className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" className="h-14 px-10 text-lg border-deep-gold-500/30 text-deep-gold-500 hover:bg-deep-gold-500/10">
                Try AI Recommendation <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4 text-center text-slate-500 text-sm">
        © 2024 AIThenticLabs. Crafting the future, one innovation at a time.
      </footer>
    </div>
  );
}
