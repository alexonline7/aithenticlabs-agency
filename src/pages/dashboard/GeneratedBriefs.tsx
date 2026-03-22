import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, Download, Eye, Search, Plus, Calendar, Tag } from "lucide-react";

const briefs = [
  {
    id: "brief-001",
    title: "AI Sales Coach — Full Stack Brief",
    category: "Sales & CRM",
    status: "Completed",
    date: "2025-01-27",
    pages: 24,
    techs: ["React", "TypeScript", "AI Integration"],
  },
  {
    id: "brief-002",
    title: "AI Language Teacher — Learning Platform",
    category: "Education",
    status: "Completed",
    date: "2025-01-26",
    pages: 18,
    techs: ["React", "Adaptive AI", "Progress Tracking"],
  },
  {
    id: "brief-003",
    title: "Quantum E-commerce Dashboard",
    category: "E-commerce",
    status: "In Progress",
    date: "2025-01-28",
    pages: 12,
    techs: ["Next.js", "Stripe", "Real-time Analytics"],
  },
  {
    id: "brief-004",
    title: "Health & Wellness Tracker",
    category: "Healthcare",
    status: "Draft",
    date: "2025-01-29",
    pages: 8,
    techs: ["React Native", "HealthKit", "AI Insights"],
  },
];

export default function GeneratedBriefs() {
  const [search, setSearch] = useState("");
  const filtered = briefs.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-bricolage flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            Generated Briefs
          </h1>
          <p className="text-muted-foreground mt-1">AI-generated project documentation & briefs</p>
        </div>
        <Button className="accent-gradient text-primary-foreground gap-2">
          <Plus className="h-4 w-4" /> New Brief
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search briefs by title or category..."
          className="pl-10 bg-background border-input"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((brief) => (
          <Card key={brief.id} className="dark-slate-purple-card hover:border-primary/30 transition-all group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <Badge
                  variant={brief.status === "Completed" ? "default" : brief.status === "In Progress" ? "secondary" : "outline"}
                >
                  {brief.status}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Tag className="h-3 w-3" /> {brief.category}
                </Badge>
              </div>
              <CardTitle className="text-lg mt-2">{brief.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {brief.date}
                </span>
                <span>{brief.pages} pages</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {brief.techs.map((t) => (
                  <Badge key={t} variant="secondary" className="text-xs">
                    {t}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  <Eye className="h-3 w-3" /> Preview
                </Button>
                <Button size="sm" className="flex-1 gap-1 accent-gradient text-primary-foreground">
                  <Download className="h-3 w-3" /> Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
