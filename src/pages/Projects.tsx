import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Eye, Play } from "lucide-react";

const projects = [
  {
    status: "Live",
    category: "Sales & CRM",
    title: "AI Sales Coach",
    desc: "Intelligent sales coaching platform with real-time guidance and performance analytics",
    features: ["AI-Powered Coaching", "Performance Analytics", "Real-time Guidance", "Team Management"],
    techs: ["React", "TypeScript", "AI Integration", "Modern UI"],
    id: "ai-sales-coach-fa-2025-002",
    completed: "2025-01-27",
    revolutionaryUrl: "/revolutionary/sales-coach/002",
  },
  {
    status: "Live",
    category: "Education",
    title: "AI Language Teacher",
    desc: "Personalized language learning platform with adaptive AI tutoring and progress tracking",
    features: ["Adaptive Learning", "AI Tutoring", "Progress Tracking", "Interactive Lessons"],
    techs: ["React", "TypeScript", "AI Learning", "Responsive Design"],
    id: "ai-language-teacher-fa-2025-001",
    completed: "2025-01-26",
    revolutionaryUrl: "/revolutionary/language-teacher/001",
  },
];

export default function Projects() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-primary/5">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Project Portfolio
              </h1>
              <p className="text-muted-foreground mt-2">Professional AI-powered applications delivered with excellence</p>
            </div>
            <Link to="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {projects.map((p) => (
            <Card key={p.id} className="dark-slate-purple-card group transition-all duration-300 hover:shadow-2xl border-2 border-border hover:border-primary/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Badge className="bg-primary/10 text-primary border-transparent">{p.status}</Badge>
                  <Badge variant="outline">{p.category}</Badge>
                </div>
                <h3 className="font-semibold tracking-tight text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {p.title}
                </h3>
                <p className="text-slate-300 text-base leading-relaxed">{p.desc}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 text-foreground">Key Features</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {p.features.map((f) => (
                      <Badge key={f} variant="outline" className="text-xs">{f}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-foreground">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {p.techs.map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    <p>Project ID: {p.id}</p>
                    <p>Completed: {p.completed}</p>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-primary hover:bg-primary/90">
                    <ExternalLink className="w-4 h-4 mr-2" /> View Live
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" /> Preview
                  </Button>
                </div>
                <div className="pt-2">
                  <Link to={p.revolutionaryUrl}>
                    <Button variant="secondary" className="w-full">
                      <Play className="w-4 h-4 mr-2" /> Revolutionary Experience
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 bg-card border rounded-lg px-8 py-4">
            <div>
              <div className="text-2xl font-bold text-primary">2</div>
              <div className="text-sm text-muted-foreground">Active Projects</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div>
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div>
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
