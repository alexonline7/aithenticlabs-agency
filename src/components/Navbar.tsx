import { Link } from "react-router-dom";
import { Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Projects", href: "/projects" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
  { label: "FlashApps", href: "/flash-apps" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    setOpen(false);
    setSigningOut(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="group inline-flex items-center gap-2 text-2xl font-bold font-bricolage">
          <Sparkles className="h-7 w-7 text-deep-gold-500 group-hover:animate-pulse" />
          <span className="gradient-text">AIThentic</span>
          <span className="text-slate-100">Labs</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) =>
            l.href.startsWith("/") ? (
              <Link key={l.label} to={l.href} className="text-slate-300 hover:text-deep-gold-500 transition-colors font-medium text-sm">
                {l.label}
              </Link>
            ) : (
              <a key={l.label} href={l.href} className="text-slate-300 hover:text-deep-gold-500 transition-colors font-medium text-sm">
                {l.label}
              </a>
            )
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" className="text-slate-300 hover:text-white">Dashboard</Button>
              </Link>
              <Button
                type="button"
                variant="outline"
                disabled={signingOut}
                onClick={handleSignOut}
                className="border-slate-700/50 bg-slate-800/40 text-slate-200 hover:bg-slate-700/50"
              >
                {signingOut ? "Signing out..." : "Sign Out"}
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" className="text-slate-300 hover:text-white">Sign In</Button>
              </Link>
              <Link to="/ai-recommendation">
                <Button className="bg-gradient-to-r from-deep-gold-500 to-electric-blue-500 text-charcoal-900 font-bold hover:opacity-90">
                  Get AI Recommendation
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-slate-300" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass-effect border-t border-white/10 px-4 py-4 space-y-3">
          {navLinks.map((l) =>
            l.href.startsWith("/") ? (
              <Link key={l.label} to={l.href} className="block text-slate-300 hover:text-deep-gold-500 font-medium" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ) : (
              <a key={l.label} href={l.href} className="block text-slate-300 hover:text-deep-gold-500 font-medium" onClick={() => setOpen(false)}>
                {l.label}
              </a>
            )
          )}
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)}>
                <Button variant="ghost" className="w-full text-slate-300 hover:text-white">Dashboard</Button>
              </Link>
              <Button
                type="button"
                variant="outline"
                disabled={signingOut}
                onClick={handleSignOut}
                className="w-full border-slate-700/50 bg-slate-800/40 text-slate-200 hover:bg-slate-700/50"
              >
                {signingOut ? "Signing out..." : "Sign Out"}
              </Button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-deep-gold-500 to-electric-blue-500 text-charcoal-900 font-bold mt-2">
                Get AI Recommendation
              </Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
