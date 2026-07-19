import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X, Check } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().trim().email().max(255);

export function UnlockModal({
  open,
  onClose,
  title,
  source,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  source: string;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setState("idle");
      setErr(null);
    }
  }, [open]);

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setErr("Enter a valid email so we can send the pack.");
      return;
    }
    setState("saving");
    setErr(null);
    const { error } = await supabase.from("leads").insert({ email: parsed.data, source });
    if (error) {
      setState("error");
      setErr("Couldn't save that just now. Try again in a moment.");
      return;
    }
    setState("done");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-void/85 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md border hairline bg-surface p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-bone/50 hover:text-bone"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
        <p className="eyebrow">Premium</p>
        <h2 className="mt-3 font-display text-2xl text-bone leading-snug">{title}</h2>

        {state === "done" ? (
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2 text-gold text-sm">
              <Check className="w-4 h-4" /> You're on the list.
            </div>
            <p className="text-sm text-bone/70">
              We'll send the free premium pack to your inbox within the hour.
            </p>
            <button
              onClick={onClose}
              className="mt-2 text-xs uppercase tracking-widest text-bone/60 hover:text-gold"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="mt-3 text-sm text-bone/70">
              Leave your email to receive the free premium pack. Stripe checkout for individual paid
              packs is coming soon.
            </p>
            <form onSubmit={submit} className="mt-6 space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                maxLength={255}
                className="w-full bg-void border hairline px-3 py-3 text-bone placeholder:text-bone/30 focus:outline-none focus:border-gold text-sm"
              />
              {err && <p className="text-xs text-red-300">{err}</p>}
              <button
                type="submit"
                disabled={state === "saving"}
                className="w-full bg-gold text-void py-3 text-xs uppercase tracking-widest font-medium hover:bg-gold/90 transition-colors disabled:opacity-50"
              >
                {state === "saving" ? "Saving…" : "Send me the pack"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full text-xs uppercase tracking-widest text-bone/40 hover:text-bone/70 py-2"
              >
                Not now
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
