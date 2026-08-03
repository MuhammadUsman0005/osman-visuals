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
  const { t } = useTranslation();
  const { isSignedIn } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setError(null);
      setSuccess(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !isSignedIn) return;
    onAuthenticated?.();
    onOpenChange(false);
  }, [open, isSignedIn, onAuthenticated, onOpenChange]);

  // Dynamic redirect URL helper (reads ?next= from URL if available)
  const getRedirectUrl = () => {
    if (typeof window === "undefined") return "/";

    if (redirectUrl) {
      return redirectUrl.startsWith("http") ? redirectUrl : window.location.origin + redirectUrl;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const nextParam = urlParams.get("next");
    if (nextParam) {
      return window.location.origin + decodeURIComponent(nextParam);
    }

    return window.location.origin + window.location.pathname + window.location.search;
  };

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

        // Handle redirect for email/password login
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
    <Dialog open={open} onOpenChange={onOpenChange}>
     <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto rounded-3xl border border-gold/20 bg-surface p-8 text-bone shadow-2xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold border border-gold/30 mb-2">
          <span className="font-display text-xl font-bold tracking-tighter">OV</span>
        </div>

        <DialogHeader className="text-center space-y-1 mb-4">
          <DialogTitle className="font-display text-2xl tracking-tight text-bone text-center">
            {isSignedIn
              ? "Welcome back"
              : mode === "signin"
                ? "Welcome to Osman Visuals"
                : "Create your account"}
          </DialogTitle>
          <DialogDescription className="text-xs text-bone/60 text-center">
            {mode === "signin"
              ? "Log in to access your studio dashboard"
              : "Sign up to get started with your studio journey"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2.5 mb-5">
          <Button
            type="button"
            variant="outline"
            className="h-11 justify-center gap-3 rounded-xl border border-gold/25 bg-transparent text-bone hover:bg-gold/5 font-normal"
            onClick={handleGoogle}
            disabled={busy}
          >
            <GoogleMark className="h-4 w-4" />
            <span className="text-sm">{t("auth.continueGoogle")}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-11 justify-center gap-3 rounded-xl border border-gold/25 bg-transparent text-bone hover:bg-gold/5 font-normal"
            onClick={handleGithub}
            disabled={busy}
          >
            <Github className="h-4 w-4" />
            <span className="text-sm">{t("auth.continueGithub")}</span>
          </Button>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <span className="h-px flex-1 bg-gold/20" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-bone/40">
            Or continue with email
          </span>
          <span className="h-px flex-1 bg-gold/20" />
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-1.5 text-xs text-bone/70">
            <span>{t("auth.email")}</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="h-11 rounded-xl border border-gold/20 bg-background/50 px-3.5 text-sm text-bone outline-none transition-colors focus:border-gold focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="you@osmanvisuals.com"
            />
          </div>

          <div className="grid gap-1.5 text-xs text-bone/70">
            <span>{t("auth.password")}</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="h-11 rounded-xl border border-gold/20 bg-background/50 px-3.5 text-sm text-bone outline-none transition-colors focus:border-gold focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-xs text-rose-300">{error}</p>}
          {success && <p className="text-xs text-emerald-300">{success}</p>}

          <Button
            type="submit"
            disabled={busy}
            className="h-11 w-full rounded-xl bg-gold text-void font-medium hover:bg-gold/90 mt-1"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : mode === "signin" ? (
              t("auth.signIn")
            ) : (
              t("auth.create")
            )}
          </Button>

          <div className="flex items-center justify-between text-xs mt-1">
            <button
              type="button"
              className="text-gold/80 transition-colors hover:text-gold hover:underline"
              onClick={handleForgotPassword}
            >
              {t("auth.forgotPassword")}
            </button>

            {isSignedIn && (
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-bone/70 transition-colors hover:text-gold"
                onClick={async () => {
                  await signOut();
                  onOpenChange(false);
                }}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Sign out
              </button>
            )}
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-bone/60">
          {mode === "signin" ? (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                className="text-gold font-medium hover:underline ml-1"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                  setSuccess(null);
                }}
              >
                Sign up
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
      </DialogContent>
    </Dialog>
  );
}

export function AuthModalButton({ className = "" }: { className?: string }) {
  const { t } = useTranslation();
  const { isSignedIn, user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setError(null);
      setSuccess(null);
    }
  }, [open]);

  // Dynamic redirect URL helper (reads ?next= from URL if available)
  const getRedirectUrl = () => {
    if (typeof window === "undefined") return "/";

    const urlParams = new URLSearchParams(window.location.search);
    const nextParam = urlParams.get("next");
    if (nextParam) {
      return window.location.origin + decodeURIComponent(nextParam);
    }

    return window.location.origin + window.location.pathname + window.location.search;
  };

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

        // Handle redirect for email/password login
        const urlParams = new URLSearchParams(window.location.search);
        const nextParam = urlParams.get("next");

        if (nextParam) {
          window.location.href = decodeURIComponent(nextParam);
        } else {
          setOpen(false);
        }
      } else {
        await signUpWithPassword(email, password);
        setSuccess("Check your inbox to verify your account.");
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

      <DialogContent
  className="
    w-[94vw]
    max-w-[520px]
    max-h-[90vh]
    overflow-y-auto
    rounded-[32px]
    border
    border-gold/15
    bg-gradient-to-b
    from-surface
    to-background
    p-10
    text-bone
    shadow-[0_30px_80px_rgba(0,0,0,.35)]
  "
>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold border border-gold/30 mb-2">
          <span className="font-display text-xl font-bold tracking-tighter">OV</span>
        </div>

        <DialogHeader className="text-center space-y-1 mb-4">
          <DialogTitle className="font-display text-2xl tracking-tight text-bone text-center">
            {isSignedIn
              ? "Welcome back"
              : mode === "signin"
                ? "Welcome to Osman Visuals"
                : "Create your account"}
          </DialogTitle>
          <DialogDescription className="text-xs text-bone/60 text-center">
            {mode === "signin"
              ? "Log in to access your studio dashboard"
              : "Sign up to get started with your studio journey"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2.5 mb-5">
          <Button
            type="button"
            variant="outline"
            className="h-11 justify-center gap-3 rounded-xl border border-gold/25 bg-transparent text-bone hover:bg-gold/5 font-normal"
            onClick={handleGoogle}
            disabled={busy}
          >
            <GoogleMark className="h-4 w-4" />
            <span className="text-sm">{t("auth.continueGoogle")}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-11 justify-center gap-3 rounded-xl border border-gold/25 bg-transparent text-bone hover:bg-gold/5 font-normal"
            onClick={handleGithub}
            disabled={busy}
          >
            <Github className="h-4 w-4" />
            <span className="text-sm">{t("auth.continueGithub")}</span>
          </Button>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <span className="h-px flex-1 bg-gold/20" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-bone/40">
            Or continue with email
          </span>
          <span className="h-px flex-1 bg-gold/20" />
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-1.5 text-xs text-bone/70">
            <span>{t("auth.email")}</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="h-11 rounded-xl border border-gold/20 bg-background/50 px-3.5 text-sm text-bone outline-none transition-colors focus:border-gold focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="you@osmanvisuals.com"
            />
          </div>

          <div className="grid gap-1.5 text-xs text-bone/70">
            <span>{t("auth.password")}</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="h-11 rounded-xl border border-gold/20 bg-background/50 px-3.5 text-sm text-bone outline-none transition-colors focus:border-gold focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-xs text-rose-300">{error}</p>}
          {success && <p className="text-xs text-emerald-300">{success}</p>}

          <Button
            type="submit"
            disabled={busy}
            className="h-11 w-full rounded-xl bg-gold text-void font-medium hover:bg-gold/90 mt-1"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : mode === "signin" ? (
              t("auth.signIn")
            ) : (
              t("auth.create")
            )}
          </Button>

          <div className="flex items-center justify-between text-xs mt-1">
            <button
              type="button"
              className="text-gold/80 transition-colors hover:text-gold hover:underline"
              onClick={handleForgotPassword}
            >
              {t("auth.forgotPassword")}
            </button>

            {isSignedIn && (
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-bone/70 transition-colors hover:text-gold"
                onClick={async () => {
                  await signOut();
                  setOpen(false);
                }}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Sign out
              </button>
            )}
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-bone/60">
          {mode === "signin" ? (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                className="text-gold font-medium hover:underline ml-1"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                  setSuccess(null);
                }}
              >
                Sign up
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
