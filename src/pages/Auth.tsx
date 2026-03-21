import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else navigate("/");
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) setError(error.message);
      else setMessage("Check your email for a confirmation link.");
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen luxury-gradient flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-deep-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-electric-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-deep-gold-500/5 rounded-full blur-2xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/" className="group inline-flex items-center gap-2 text-4xl font-bold font-bricolage mb-4">
            <Sparkles className="h-8 w-8 text-deep-gold-500 group-hover:animate-pulse" />
            <span className="gradient-text">AIThentic</span>
            <span className="text-slate-100">Labs</span>
          </Link>
          <p className="text-slate-400 text-lg font-medium">The Future of Web Development</p>
          <div className="mt-2 h-1 w-20 bg-gradient-to-r from-deep-purple-500 to-electric-blue-500 rounded-full mx-auto" />
        </div>

        <div className="dark-slate-purple-card glass-effect rounded-lg shadow-2xl shadow-deep-purple-500/10 animate-scale-in">
          <div className="p-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-deep-purple-500/20 to-electric-blue-500/20 border border-deep-gold-500/30">
                <Zap className="h-6 w-6 text-deep-gold-500" />
              </div>
            </div>
            <h3 className="text-3xl font-bold font-bricolage text-slate-100">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h3>
            <p className="text-slate-400 text-lg">
              {isLogin ? "Sign in to continue your innovative journey" : "Start your innovative journey today"}
            </p>
          </div>

          <div className="p-6 pt-0 space-y-6">
            {error && (
              <div className="p-3 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bricolage">
                {error}
              </div>
            )}
            {message && (
              <div className="p-3 rounded-md bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-bricolage">
                {message}
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full h-12 flex items-center justify-center gap-3 rounded-md border border-slate-700/50 bg-surface-secondary hover:bg-slate-800/50 transition-all duration-300 font-bricolage text-slate-200 disabled:opacity-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/50" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="glass-effect px-4 text-slate-400 font-bricolage">or</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-slate-300 font-medium text-sm font-bricolage">Email Address</label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-surface-secondary border-input font-bricolage text-white"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-slate-300 font-medium text-sm font-bricolage">Password</label>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-surface-secondary border-input font-bricolage text-white"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-deep-gold-500 via-deep-gold-400 to-electric-blue-500 hover:from-deep-gold-600 hover:via-deep-gold-500 hover:to-electric-blue-600 text-charcoal-900 font-bold text-lg font-bricolage shadow-lg hover:shadow-xl hover:shadow-deep-gold-500/25 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {isLogin ? "Sign In" : "Create Account"} <Zap className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/50" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="glass-effect px-4 text-slate-400 font-bricolage">
                  {isLogin ? "New to AIThenticLabs?" : "Already have an account?"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="w-full text-electric-blue-400 hover:text-electric-blue-400 hover:bg-slate-800/30 transition-all duration-300 font-bricolage h-12 text-lg rounded-md"
              >
                {isLogin ? "Create your account" : "Sign in instead"}
              </button>
              {isLogin && (
                <button className="w-full text-slate-400 hover:text-slate-300 hover:bg-slate-800/20 transition-all duration-300 font-bricolage text-sm h-10 rounded-md">
                  Forgot your password?
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-slate-500 font-bricolage">
          © 2024 AIThenticLabs. Crafting the future, one innovation at a time.
        </div>
      </div>
    </div>
  );
}