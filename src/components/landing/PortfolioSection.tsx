import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PortfolioProject {
  id: string;
  title: string;
  description: string | null;
  tags: string[] | null;
  status: string;
  client_name: string | null;
}

export default function PortfolioSection() {
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("projects")
        .select("id, title, description, tags, status, client_name")
        .eq("status", "completed")
        .order("updated_at", { ascending: false })
        .limit(6);
      setPortfolio(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <section id="portfolio" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold font-bricolage text-foreground mb-4">
            Our Portfolio
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real projects we've delivered for real clients
          </p>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground py-12">Loading portfolio...</div>
        ) : portfolio.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-muted mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">Portfolio projects are being added.</p>
            <p className="text-muted-foreground/60 text-sm">Check back soon or reach out to discuss our past work.</p>
            <Link to="/submit-project" className="mt-4 inline-block">
              <Button variant="outline" className="border-primary/30 text-primary">
                Start Your Project <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((p) => (
              <Card key={p.id} className="dark-slate-purple-card glass-effect hover:border-primary/30 transition-all duration-300">
                <CardHeader>
                  {p.client_name && (
                    <span className="text-xs font-semibold text-primary mb-1">{p.client_name}</span>
                  )}
                  <CardTitle className="text-xl text-foreground">{p.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">{p.description || "Custom-built digital solution."}</p>
                  {p.tags && p.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <span key={t} className="text-xs px-2 py-1 rounded-full bg-secondary/20 text-secondary">{t}</span>
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
  );
}
