import { useEffect, useState, type FormEvent } from "react";
import { Github, Loader2, ShieldCheck, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  resetPasswordForEmail,
  signInWithGithub,
  signInWithGoogle,
  signInWithPassword,
  signOut,
  signUpWithPassword,
  useAuth,
} from "@/lib/auth";

type AuthMode = "signin" | "signup";

// The one place that renders the modal's actual content. Both entry points
// below (AuthModalDialog — externally controlled, used for redirect flows;
// AuthModalButton — self-contained header trigger) render THIS, wrapped in
// their own <Dialog>. Change the design, a field, a copy line — once, here.
function AuthModalContent({
  onOpenChange,
  redirectUrl,
}: {
  onOpenChange: (open: boolean) => void;
  redirectUrl?: string;
}) {
  const { t } = useTranslation();
  const { isSignedIn } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function getRedirectUrl() {
    if (typeof window === "undefined") return "/";
    if (redirectUrl) {
      return redirectUrl.startsWith("http") ? redirectUrl : window.location.origin + redirectUrl;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const nextParam = urlParams.get("next");
    if (nextParam) return window.location.origin + decodeURIComponent(nextParam);
    return window.location.origin + window.location.pathname + window.location.search;
  }

  async function handleGoogle() {
    setBusy(true);
    setError(null);
    try {
      await signInWithGoogle(getRedirectUrl());
    } catch {
      setError(t("auth.error"));
      setBusy(false);
    }
  }

  async function handleGithub() {
    setBusy(true);
    setError(null);
    try {
      await signInWithGithub(getRedirectUrl());
    } catch {
      setError(t("auth.error"));
      setBusy(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === "signin") {
        await signInWithPassword(email, password);
        const urlParams = new URLSearchParams(window.location.search);
        const nextParam = urlParams.get("next");
        const target = redirectUrl || nextParam;
        if (target) {
          window.location.href = decodeURIComponent(target);
        } else {
          onOpenChange(false);
        }
      } else {
        await signUpWithPassword(email, password);
        setSuccess("Check your inbox to verify your account.");
        setMode("signin");
        setPassword("");
      }
    } catch {
      setError(t("auth.error"));
    } finally {
      setBusy(false);
    }
  }

  async function handleForgotPassword() {
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      await resetPasswordForEmail(email || "", getRedirectUrl());
      setSuccess(t("auth.recovering"));
    } catch {
      setError(t("auth.error"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="mx-auto flex justify-center -mt-6 -mb-14">
        <img
          src="/signInLogo.png"
          alt="Osman Visuals"
          className="h-42 w-42 object-contain invert dark:invert-0"
        />
      </div>

      <DialogHeader className="text-center space-y-3 mb-5">
        <DialogTitle className="font-display text-3xl sm:text-3.5xl font-bold tracking-tight text-foreground text-center">
          {isSignedIn
            ? "Welcome back"
            : mode === "signin"
              ? "Log in to Osman Visuals"
              : "Create your account"}
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground text-center">
          {mode === "signin"
            ? "Sign in to continue your creative archive."
            : "Sign up to get started with your studio journey."}
        </DialogDescription>
      </DialogHeader>

      <div className="w-full mx-auto grid gap-2.5 mb-5">
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full justify-center gap-3 rounded-2xl border border-gold/25 bg-background/40 hover:bg-gold/10 text-foreground hover:text-foreground font-medium transition-all"
          onClick={handleGoogle}
          disabled={busy}
        >
          <GoogleMark className="h-4 w-4" />
          <span className="text-sm font-bold">Continue With Google</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-11 w-full justify-center gap-3 rounded-2xl border border-gold/25 bg-background/40 hover:bg-gold/10 text-foreground hover:text-foreground font-medium transition-all"
          onClick={handleGithub}
          disabled={busy}
        >
          <Github className="h-4 w-4" />
          <span className="text-sm font-bold">Continue With GitHub</span>
        </Button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <span className="h-px flex-1 bg-gold/20" />
        <span className="text-[11px]  tracking-[0.25em] text-bone/40">Or continue with email</span>
        <span className="h-px flex-1 bg-gold/20" />
      </div>

      <form className="grid gap-5" onSubmit={handleSubmit}>
        <div className="grid gap-1.5 text-xs text-bone/70">
          <span>Email address</span>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-bone/30" />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="h-12 w-full rounded-2xl border border-gold/20 bg-background/50 pl-10 pr-3.5 text-sm text-bone outline-none transition-colors focus:border-gold focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Enter you email"
            />
          </div>
        </div>

        <div className="grid gap-1.5 text-xs text-bone/70">
          <span>Password</span>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-bone/30" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="h-12 w-full rounded-2xl border border-gold/20 bg-background/50 pl-10 pr-10 text-sm text-bone outline-none transition-colors focus:border-gold focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-bone/30 hover:text-bone/60"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && <p className="text-xs text-rose-300">{error}</p>}
        {success && <p className="text-xs text-emerald-300">{success}</p>}

        <Button
          type="submit"
          disabled={busy}
          className="h-[52px] w-full rounded-2xl bg-gold text-void font-medium tracking-wide hover:bg-gold/90"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : mode === "signin" ? (
            t("auth.signIn")
          ) : (
            t("auth.create")
          )}
        </Button>

        <div className="flex items-center justify-between text-xs -mt-1">
          <label className="flex items-center gap-2 text-bone/60 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-gold/30 accent-gold"
            />
            Remember me
          </label>

          <button
            type="button"
            className="text-gold/80 transition-colors hover:text-gold hover:underline"
            onClick={handleForgotPassword}
          >
            {t("auth.forgotPassword")}
          </button>
        </div>

        {isSignedIn && (
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 text-xs text-bone/70 transition-colors hover:text-gold"
            onClick={async () => {
              await signOut();
              onOpenChange(false);
            }}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Sign out
          </button>
        )}
      </form>

      <div className="mt-7 text-center text-xs text-bone/60">
        {mode === "signin" ? (
          <p>
            New here?{" "}
            <button
              type="button"
              className="text-gold font-medium hover:underline ml-1"
              onClick={() => {
                setMode("signup");
                setError(null);
                setSuccess(null);
              }}
            >
              Create your Studio Account →
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <button
              type="button"
              className="text-gold font-medium hover:underline ml-1"
              onClick={() => {
                setMode("signin");
                setError(null);
                setSuccess(null);
              }}
            >
              Sign in
            </button>
          </p>
        )}
      </div>

      {/* <p className="mt-6 text-center text-[10px] uppercase tracking-[0.2em] text-bone/35">
        Secure authentication · Google · GitHub · Email
      </p> */}
      <p className="mt-4 text-center text-xs text-muted-foreground">
        By continuing, you agree to Osman Visuals’{" "}
        <a href="/terms" className="underline hover:text-gold transition-colors">
          Terms of Use
        </a>{" "}
        and{" "}
        <a href="/refunds" className="underline hover:text-gold transition-colors">
          Privacy Policy
        </a>
        .
      </p>
    </>
  );
}

const dialogContentClass =
  "w-[94vw] max-w-lg max-h-[90vh] overflow-y-auto sm:rounded-3xl border border-gold/25 bg-background px-6 pb-8 pt-4 sm:px-8 sm:pb-9 sm:pt-5 text-foreground shadow-[0_30px_80px_rgba(0,0,0,.4)]";

export function AuthModalDialog({
  open,
  onOpenChange,
  onAuthenticated,
  redirectUrl,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthenticated?: () => void;
  redirectUrl?: string;
}) {
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (!open || !isSignedIn) return;
    onAuthenticated?.();
    onOpenChange(false);
  }, [open, isSignedIn, onAuthenticated, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogContentClass}>
        <AuthModalContent onOpenChange={onOpenChange} redirectUrl={redirectUrl} />
      </DialogContent>
    </Dialog>
  );
}

export function AuthModalButton({ className = "" }: { className?: string }) {
  const { t } = useTranslation();
  const { isSignedIn, user, loading } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-9 items-center justify-center rounded-full border border-gold/55 bg-gold px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-void transition-all duration-200 hover:bg-gold/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            className,
          )}
        >
          {loading
            ? t("auth.signIn")
            : isSignedIn
              ? (user?.email?.split("@")[0] ?? t("auth.signIn"))
              : t("auth.createAccount")}
        </button>
      </DialogTrigger>

      <DialogContent className={dialogContentClass}>
        <AuthModalContent onOpenChange={setOpen} />
      </DialogContent>
    </Dialog>
  );
}

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82z"
        fill="#4285F4"
      />
      <path
        d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A12 12 0 0 0 12 24z"
        fill="#34A853"
      />
      <path
        d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.39l4-3.11z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.61l4 3.11C6.22 6.86 8.87 4.75 12 4.75z"
        fill="#EA4335"
      />
    </svg>
  );
}
