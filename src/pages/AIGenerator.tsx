import { Sparkles, Brain, Code, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AIGenerator() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface-secondary/20 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold gradient-text">
              Super-Advanced AI Web App Generator
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Harness the power of dual AI models to create professional web applications tailored to your business needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
            <Card className="dark-slate-purple-card p-4 bg-gradient-to-br from-card to-surface-secondary border-primary/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">OpenAI GPT-4</h3>
                  <p className="text-sm text-muted-foreground">Creative Strategy & UX Design</p>
                </div>
              </div>
            </Card>

            <Card className="dark-slate-purple-card p-4 bg-gradient-to-br from-card to-surface-secondary border-primary/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Google Gemini</h3>
                  <p className="text-sm text-muted-foreground">Technical Architecture & Code</p>
                </div>
              </div>
            </Card>
          </div>

          <Button className="h-11 px-8 py-4 text-lg gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90">
            Start Building Your App <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
