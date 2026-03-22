import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [canReset, setCanReset] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setCanReset(true);
      }
    });

    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    if (hashParams.get("type") === "recovery" || hashParams.get("access_token")) {
      setCanReset(true);
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setCanReset(true);
      }
      setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setMessage("Your password has been updated. Redirecting to sign in...");
      setTimeout(() => navigate("/auth"), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen luxury-gradient flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10 dark-slate-purple-card glass-effect rounded-lg shadow-2xl shadow-deep-purple-500/10 p-6 space-y-6">
        <div className="text-center space-y-3">
          <Link to="/" className="group inline-flex items-center gap-2 text-3xl font-bold font-bricolage">
            <Sparkles className="h-7 w-7 text-deep-gold-500 group-hover:animate-pulse" />
            <span className="gradient-text">AIThentic</span>
            <span className="text-slate-100">Labs</span>
          </Link>
          <h1 className="text-3xl font-bold font-bricolage text-slate-100">Reset Password</h1>
          <p className="text-slate-400">Create a new password to access your account.</p>
        </div>

        {!ready ? (
          <p className="text-slate-400 text-sm text-center">Preparing secure reset session...</p>
        ) : !canReset ? (
          <div className="space-y-4 text-center">
            <p className="text-red-400 text-sm">This reset link is invalid or has expired. Please request a new one.</p>
            <Link to="/auth">
              <Button variant="outline" className="w-full">Back to sign in</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
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

            <div className="space-y-2">
              <label htmlFor="new-password" className="text-slate-300 font-medium text-sm font-bricolage">New Password</label>
              <Input
                id="new-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-surface-secondary border-input font-bricolage text-white"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-slate-300 font-medium text-sm font-bricolage">Confirm Password</label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 bg-surface-secondary border-input font-bricolage text-white"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-deep-gold-500 via-deep-gold-400 to-electric-blue-500 hover:from-deep-gold-600 hover:via-deep-gold-500 hover:to-electric-blue-600 text-charcoal-900 font-bold text-lg font-bricolage shadow-lg hover:shadow-xl hover:shadow-deep-gold-500/25 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"} <Zap className="ml-2 h-4 w-4" />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
