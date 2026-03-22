import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Image,
  Upload,
  Wand2,
  Download,
  Maximize2,
  Palette,
  Layers,
  Sparkles,
  RefreshCw,
} from "lucide-react";

const gallery = [
  { id: 1, title: "Hero Banner — Sales Coach", type: "AI Generated", resolution: "1920×1080", status: "Ready" },
  { id: 2, title: "App Icon — Language Teacher", type: "AI Enhanced", resolution: "1024×1024", status: "Ready" },
  { id: 3, title: "Dashboard Mockup", type: "AI Generated", resolution: "2560×1440", status: "Processing" },
  { id: 4, title: "OG Image — E-commerce", type: "AI Generated", resolution: "1200×630", status: "Ready" },
  { id: 5, title: "Team Avatar Set", type: "AI Enhanced", resolution: "512×512", status: "Ready" },
  { id: 6, title: "Landing Page Hero", type: "AI Generated", resolution: "1920×1080", status: "Queue" },
];

const tools = [
  { icon: Wand2, label: "AI Enhance", desc: "Upscale and enhance quality" },
  { icon: Palette, label: "Style Transfer", desc: "Apply brand colors automatically" },
  { icon: Layers, label: "Background Remove", desc: "Instant transparent backgrounds" },
  { icon: Maximize2, label: "Smart Resize", desc: "Resize for any platform" },
];

export default function PhotoStudio() {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-bricolage flex items-center gap-2">
          <Image className="h-8 w-8 text-primary" />
          Photo Studio
        </h1>
        <p className="text-muted-foreground mt-1">AI-powered image generation, editing, and optimization</p>
      </div>

      {/* AI Generation */}
      <Card className="dark-slate-purple-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Image Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate... e.g., 'A futuristic dashboard with holographic UI elements in dark purple and gold tones'"
            className="bg-background border-input"
            rows={3}
          />
          <div className="flex gap-3">
            <Button className="accent-gradient text-primary-foreground gap-2">
              <Sparkles className="h-4 w-4" /> Generate Image
            </Button>
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" /> Upload Image
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <Card key={tool.label} className="dark-slate-purple-card hover:border-primary/30 transition-all cursor-pointer group">
            <CardContent className="pt-6 text-center">
              <tool.icon className="h-8 w-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-foreground">{tool.label}</h3>
              <p className="text-xs text-muted-foreground mt-1">{tool.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gallery */}
      <Card className="dark-slate-purple-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Image Gallery</CardTitle>
            <Button variant="outline" size="sm" className="gap-1">
              <RefreshCw className="h-3 w-3" /> Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gallery.map((img) => (
              <div key={img.id} className="glass-effect rounded-lg overflow-hidden group">
                <div className="aspect-video bg-gradient-to-br from-card to-muted flex items-center justify-center">
                  <Image className="h-12 w-12 text-muted-foreground/30" />
                </div>
                <div className="p-3 space-y-2">
                  <h4 className="text-sm font-medium text-foreground truncate">{img.title}</h4>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">{img.type}</Badge>
                    <span className="text-xs text-muted-foreground">{img.resolution}</span>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button variant="outline" size="sm" className="flex-1 text-xs gap-1">
                      <Maximize2 className="h-3 w-3" /> View
                    </Button>
                    <Button size="sm" className="flex-1 text-xs gap-1 accent-gradient text-primary-foreground">
                      <Download className="h-3 w-3" /> Save
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
