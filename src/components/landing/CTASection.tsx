import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lightbulb, Send } from "lucide-react";

export default function CTASection() {
  return (
    <section id="contact" className="py-20 px-4">
      <div className="container mx-auto max-w-3xl text-center">
        <p className="text-primary font-medium mb-3">Ready to Get Started?</p>
        <h2 className="text-3xl md:text-4xl font-bold font-bricolage text-foreground mb-4">
          Let's Build Something Great Together
        </h2>
        <p className="text-muted-foreground mb-8">
          Start with a free AI blueprint of your idea — or submit your project directly
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/idea-to-blueprint">
            <Button className="h-14 px-10 text-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold hover:opacity-90 shadow-xl">
              <Lightbulb className="mr-2 h-5 w-5" /> Explore Your Idea
            </Button>
          </Link>
          <Link to="/submit-project">
            <Button variant="outline" className="h-14 px-10 text-lg border-primary/30 text-primary hover:bg-primary/10">
              <Send className="mr-2 h-5 w-5" /> Submit a Project
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
