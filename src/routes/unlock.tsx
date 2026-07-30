import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Loader2, Mail } from "lucide-react";
import { useAuth, signInWithGoogle, signInWithEmail } from "@/lib/auth";

const BENEFITS = [
  "Access the exclusive prompt library",
  "Unlock premium Gallery images",
  "Save favorite prompts (coming soon)",
  "Faster access across your devices",
  "First access to future premium features",
];

export const Route = createFileRoute("/unlock")({
  validateSearch: (search: Record<string, unknown>): { next?: string } => ({
    next: typeof search.next === "string" ? search.next : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Unlock Exclusive Prompts | Osman Visuals" },
      {
        name: "description",
        content: "Create a free account to unlock the exclusive prompt archive.",
      },
    ],
  }),
  component: Unlock,
});

function Unlock() {
  const { next } = Route.useSearch();
  const { isSignedIn, loading } = useAuth();
  const destination = next && next.startsWith("/") ? next : "/library";

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (!loading && isSignedIn) {
      window.location.replace(destination);
    }
  }, [loading, isSignedIn, destination]);

  async function handleGoogle() {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle(destination);
    } catch {
      setError("Couldn't start Google sign-in. Please try again.");
      setGoogleLoading(false);
    }
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      await signInWithEmail(email, destination);
      setSent(true);
    } catch {
      setError("Couldn't send the link. Check the address and try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="min-h-[85vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center">
          <p className="eyebrow">Osman Visuals — Members</p>
          <h1 className="mt-4 font-display text-4xl md:text-5xl text-bone leading-tight">
            Unlock Exclusive Prompts
          </h1>
          <p className="mt-4 text-sm text-bone/70 leading-relaxed">
            A free account is all it takes to preview premium prompts and access exclusive resources
            as they're added.
          </p>
        </div>

        <ul className="mt-8 space-y-2.5">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-sm text-bone/80">
              <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              {b}
            </li>
          ))}
        </ul>

        <div className="mt-8 border hairline bg-surface p-6">
          {sent ? (
            <div className="text-center py-4">
              <Mail className="w-6 h-6 text-gold mx-auto" />
              <p className="mt-3 font-display text-lg text-bone">Check your email</p>
              <p className="mt-2 text-sm text-bone/60">
                We sent a sign-in link to <span className="text-bone">{email}</span>. Open it on
                this device to continue.
              </p>
            </div>
          ) : (
            <>
              <button
                onClick={handleGoogle}
                disabled={googleLoading}
                className="w-full inline-flex items-center justify-center gap-2 bg-gold text-void py-3 text-xs uppercase tracking-widest font-medium hover:bg-gold/90 transition-colors disabled:opacity-60"
              >
                {googleLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <GoogleMark className="w-3.5 h-3.5" />
                )}
                Continue with Google
              </button>

              <div className="flex items-center gap-3 my-5">
                <div className="h-px flex-1 bg-gold-hairline" />
                <span className="text-[10px] uppercase tracking-widest text-bone/40">or</span>
                <div className="h-px flex-1 bg-gold-hairline" />
              </div>

              <form onSubmit={handleEmail} className="flex flex-col gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full bg-void border hairline px-4 py-3 text-sm text-bone placeholder:text-bone/30 focus:outline-none focus:border-gold"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full inline-flex items-center justify-center gap-2 border border-gold text-gold py-3 text-xs uppercase tracking-widest font-medium hover:bg-gold/5 transition-colors disabled:opacity-60"
                >
                  {sending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Mail className="w-3.5 h-3.5" />
                  )}
                  Continue with Email
                </button>
              </form>

              {error && <p className="mt-3 text-xs text-rose-400 text-center">{error}</p>}
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-bone/40">
          Already have an account?{" "}
          <button
            onClick={handleGoogle}
            className="text-gold hover:text-bone underline underline-offset-2"
          >
            Sign in
          </button>
        </p>

        <p className="mt-8 text-center">
          <Link to="/library" className="text-xs text-bone/40 hover:text-bone/70">
            ← Back to the Vault
          </Link>
        </p>
      </div>
    </section>
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