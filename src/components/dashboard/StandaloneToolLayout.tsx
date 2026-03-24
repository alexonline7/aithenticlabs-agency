import { Outlet, Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StandaloneToolLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="h-14 flex items-center border-b border-border px-4 glass-effect sticky top-0 z-30">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Button>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Link to="/" className="flex items-center gap-1.5 font-bold font-bricolage text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="gradient-text">AIThentic</span>
            <span className="text-foreground">Labs</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
