import { useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { signInWithGoogle, signInWithEmail } from "@/lib/auth";

export function AccountGate({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleGoogle() {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle(next);
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
      await signInWithEmail(email, next);
      setSent(true);
    } catch {
      setError("Couldn't send the link. Check the address and try again.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center py-4">
        <Mail className="w-6 h-6 text-gold mx-auto" />
        <p className="mt-3 font-display text-lg text-bone">Check your email</p>
        <p className="mt-2 text-sm text-bone/60">
          We sent a sign-in link to <span className="text-bone">{email}</span>. Open it on this
          device to continue.
        </p>
      </div>
    );
  }

  return (
    <>
    {/* Parent container: 'max-w-xs mx-auto' lagane se teeno boxes ki width tora kam ho jayegi */}
<div className="w-full max-w-xs mx-auto space-y-4">
  
  {/* 1. Google Button */}
  <button
    type="button"
    onClick={handleGoogle}
    disabled={googleLoading}
    className="w-full inline-flex items-center justify-center gap-3 bg-gold text-void py-3 text-xs tracking-widest font-bold rounded-xl hover:bg-gold/90 transition-colors disabled:opacity-60"
  >
    {googleLoading ? (
      <Loader2 className="w-4 h-4 animate-spin" />
    ) : (
      <GoogleMark className="w-4 h-4" />
    )}
    CONTINUE WITH GOOGLE
  </button>

  {/* Divider (OR) */}
  <div className="relative flex items-center justify-center py-2">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-bone/10" />
    </div>
    <span className="relative bg-void px-3 text-[10px] uppercase tracking-widest text-bone/40 font-mono">
      OR
    </span>
  </div>

  {/* Email Form */}
  <form onSubmit={handleEmail} className="space-y-3">
    {/* 2. Email Input Box */}
    <input
      type="email"
      placeholder="Enter your email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full px-4 py-3 bg-transparent border border-bone/20 rounded-xl text-sm text-bone placeholder:text-bone/30 focus:outline-none focus:border-gold transition-colors"
    />

    {/* 3. Email Button */}
    <button
      type="submit"
      disabled={sending}
      className="w-full inline-flex items-center justify-center gap-3 border border-gold/40 text-gold py-3 text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-gold/10 transition-colors disabled:opacity-60"
    >
      {sending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Mail className="w-4 h-4" />
      )}
      CONTINUE WITH EMAIL
    </button>
  </form>

</div>
      {error && <p className="mt-3 text-xs text-rose-400 text-center">{error}</p>}
    </>
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