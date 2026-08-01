import { useEffect, useState, type FormEvent } from "react";
import { Github, Loader2, Mail, ShieldCheck } from "lucide-react";
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

export function AuthModalButton({ className = "" }: { className?: string }) {
  const { t } = useTranslation();
  const { isSignedIn, user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
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

  const next =
    typeof window !== "undefined" ? window.location.pathname + window.location.search : "/";

  async function handleGoogle() {
    setBusy(true);
    setError(null);
    try {
      await signInWithGoogle(next || "/");
    } catch {
      setError(t("auth.error"));
      setBusy(false);
    }
  }

  async function handleGithub() {
    setBusy(true);
    setError(null);
    try {
      await signInWithGithub(next || "/");
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
        setOpen(false);
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
      await resetPasswordForEmail(email || "", next || "/");
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
            // YAHAN CHANGE KAREIN: 
            // Agar mukammal gol karna hai toh "rounded-md" ko hata kar "rounded-full" likh dein
            "inline-flex h-8 items-center justify-center rounded-full border border-gold/55 bg-gold px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-void transition-all duration-200 hover:bg-gold/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
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

      {/* ... baqi ka code waise hi rahega ... */}

      <DialogContent className="max-w-md rounded-2xl border border-gold/30 bg-surface text-bone shadow-2xl">
        <DialogHeader className="text-left">
          <DialogTitle className="font-display text-2xl text-bone">
            {isSignedIn ? "Welcome back" : t("auth.signIn")}
          </DialogTitle>
          <DialogDescription className="text-sm text-bone/60">
            {t("auth.agreement")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <Button
            type="button"
            variant="outline"
            className="justify-start gap-3 border border-gold/25 bg-transparent text-bone hover:bg-gold/5"
            onClick={handleGoogle}
            disabled={busy}
          >
            <GoogleMark className="h-4 w-4" />
            <span>{t("auth.continueGoogle")}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            className="justify-start gap-3 border border-gold/25 bg-transparent text-bone hover:bg-gold/5"
            onClick={handleGithub}
            disabled={busy}
          >
            <Github className="h-4 w-4" />
            <span>{t("auth.continueGithub")}</span>
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-gold/25" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-bone/45">OR</span>
          <span className="h-px flex-1 bg-gold/25" />
        </div>

        <form className="grid gap-3" onSubmit={handleSubmit}>
          <label className="grid gap-1.5 text-sm text-bone/70">
            <span>{t("auth.email")}</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="min-h-[42px] rounded-md border border-gold-hairline bg-background px-3 text-sm text-bone outline-none transition-colors focus:border-gold focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="you@osmanvisuals.com"
            />
          </label>

          <label className="grid gap-1.5 text-sm text-bone/70">
            <span>{t("auth.password")}</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="min-h-[42px] rounded-md border border-gold-hairline bg-background px-3 text-sm text-bone outline-none transition-colors focus:border-gold focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="••••••••"
            />
          </label>

          {error && <p className="text-sm text-rose-300">{error}</p>}
          {success && <p className="text-sm text-emerald-300">{success}</p>}

          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              type="submit"
              disabled={busy}
              className="min-h-[42px] bg-gold text-void hover:bg-gold/90"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : mode === "signin" ? (
                t("auth.signIn")
              ) : (
                t("auth.create")
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="min-h-[42px] border border-gold/25 bg-transparent text-bone hover:bg-gold/5"
              onClick={() => {
                setMode((currentMode) => (currentMode === "signin" ? "signup" : "signin"));
                setError(null);
                setSuccess(null);
              }}
            >
              {mode === "signin" ? t("auth.createAccount") : t("auth.signIn")}
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <button
              type="button"
              className="text-gold transition-colors hover:text-bone"
              onClick={handleForgotPassword}
            >
              {t("auth.forgotPassword")}
            </button>

            {isSignedIn && (
              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm text-bone/75 transition-colors hover:text-gold"
                onClick={async () => {
                  await signOut();
                  setOpen(false);
                }}
              >
                <ShieldCheck className="h-4 w-4" />
                Sign out
              </button>
            )}
          </div>
        </form>
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
