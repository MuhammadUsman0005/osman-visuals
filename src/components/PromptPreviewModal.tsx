import { useEffect, useState } from "react";
import { Mail, X, Copy, Check, Instagram, Lock } from "lucide-react";
import type { Prompt } from "@/components/PromptCard";
import { onFollowedChange, persistUnlock, readFollowed } from "@/lib/instagram-unlock";
import { supabase } from "@/integrations/supabase/client";

const INSTAGRAM_URL = "https://instagram.com/osmanvisuals";

export function PromptPreviewModal({
  prompt,
  onClose,
}: {
  prompt: Prompt | null;
  onClose: () => void;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [warning, setWarning] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);

  useEffect(() => {
    if (!prompt) return;
    setCopied(false);
    setWarning(false);
    setEmail("");
    setEmailError(null);
    setEmailSent(false);
    const currentFollowed = readFollowed();
    setFollowed(currentFollowed);
    setUnlocked(!prompt.is_premium || currentFollowed);
    return onFollowedChange(() => {
      const updatedFollowed = readFollowed();
      setFollowed(updatedFollowed);
      setUnlocked(!prompt.is_premium || updatedFollowed);
    });
  }, [prompt]);

  useEffect(() => {
    if (!prompt) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prompt, onClose]);

  if (!prompt) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt!.prompt_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  }

  function validateEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  async function unlockWithEmail() {
    const normalized = email.trim();
    setEmailError(null);
    setWarning(false);

    if (!validateEmail(normalized)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    setSavingEmail(true);
    try {
      const { error } = await supabase.from("leads").insert({
        email: normalized,
        source: "vault_unlock",
      });
      if (error) throw error;
      persistUnlock();
      setUnlocked(true);
      setEmailSent(true);
    } catch {
      setEmailError("Unable to submit your email. Please try again.");
    } finally {
      setSavingEmail(false);
    }
  }

  function confirmUnlock() {
    if (!followed) {
      setWarning(true);
      return;
    }
    persistUnlock();
    setUnlocked(true);
    setWarning(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-void/90 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl border hairline bg-surface my-10 mx-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={prompt.title}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute right-5 top-3 z-50 text-bone/60 hover:text-bone bg-void/60 border hairline p-1.5"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid w-full lg:grid-cols-[4fr_5fr]">
          <div className="aspect-[4/5] w-full bg-void border-b hairline overflow-hidden lg:border-b-0 lg:border-r hairline">
            {prompt.preview_image_url ? (
              <img
                src={prompt.preview_image_url}
                alt={prompt.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="eyebrow">{prompt.catalog_number}</p>
                  <p className="mt-2 font-display text-2xl text-bone/40">No plate filed</p>
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-6 pr-12 lg:max-h-[85vh] lg:overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="eyebrow">
                {prompt.catalog_number} — {prompt.difficulty}
              </span>
              <span className={`eyebrow ${prompt.is_premium ? "text-gold" : "text-bone/50"}`}>
                {prompt.is_premium ? "Exclusive" : "Free"}
              </span>
            </div>
            <h2 className="mt-3 font-display text-2xl md:text-3xl text-bone leading-tight">
              {prompt.title}
              {prompt.tools && prompt.tools.length > 0 && (
                <span className="text-sm text-bone/60 font-normal font-body not-italic ml-2">
                  ({prompt.tools.join(", ")})
                </span>
              )}
            </h2>

            {prompt.categories && prompt.categories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {prompt.categories.slice(0, 3).map((c) => (
                  <span
                    key={c}
                    className="text-[10px] uppercase tracking-widest text-bone/50 border hairline px-1.5 py-0.5"
                  >
                    {c}
                  </span>
                ))}
                {prompt.categories.length > 3 && (
                  <span className="text-[10px] uppercase tracking-widest text-bone/50 border hairline px-1.5 py-0.5">
                    +{prompt.categories.length - 3}
                  </span>
                )}
              </div>
            )}

            <div className="mt-6">
              {unlocked ? (
                <>
                  <p className="eyebrow mb-2">The prompt</p>
                  <pre className="whitespace-pre-wrap font-body text-sm text-bone/85 leading-relaxed bg-void border hairline p-4 max-h-80 overflow-y-auto">
                    {prompt.prompt_text}
                  </pre>
                  <button
                    onClick={copy}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-gold text-void py-3 text-xs uppercase tracking-widest font-medium hover:bg-gold/90 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy prompt
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] mt-6">
                    <div className="border hairline bg-void p-6">
                      <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-widest">
                        <Instagram className="w-3.5 h-3.5" /> Unlock with Instagram
                      </div>
                      <p className="mt-3 text-sm text-bone/70 leading-relaxed">
                        Follow <span className="text-bone">@osmanvisuals</span> on Instagram to
                        unlock this prompt.
                      </p>
                      <a
                        href={INSTAGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          setFollowed(true);
                          setWarning(false);
                        }}
                        className="mt-5 w-full flex flex-wrap items-center justify-center gap-2 border border-gold text-gold py-3 text-xs uppercase tracking-widest font-medium text-center hover:bg-gold/5 transition-colors whitespace-normal"
                      >
                        <Instagram className="w-3.5 h-3.5" />
                        Follow @osmanvisuals on Instagram
                      </a>
                      <button
                        onClick={confirmUnlock}
                        className={`mt-2 w-full py-3 text-xs uppercase tracking-widest font-medium transition-colors ${
                          followed
                            ? "bg-gold text-void hover:bg-gold/90"
                            : "bg-bone/10 text-bone/60 hover:bg-bone/15"
                        }`}
                      >
                        I've followed — unlock
                      </button>
                    </div>

                    <div className="flex items-center justify-center text-xs uppercase tracking-widest text-bone/50">
                      <span className="bg-surface px-3">or</span>
                    </div>

                    <div className="border hairline bg-void p-6">
                      <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-widest">
                        <Mail className="w-3.5 h-3.5" /> Unlock with email
                      </div>
                      <p className="mt-3 text-sm text-bone/70 leading-relaxed">
                        Submit your email and we’ll unlock all premium prompts for you.
                      </p>
                      <label className="sr-only" htmlFor="unlock-email">
                        Email address
                      </label>
                      <input
                        id="unlock-email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError(null);
                        }}
                        placeholder="you@example.com"
                        className="mt-5 w-full bg-void border hairline px-4 py-3 text-sm text-bone placeholder:text-bone/40 focus:outline-none focus:border-gold"
                      />
                      {emailError && <p className="mt-3 text-sm text-rose-300">{emailError}</p>}
                      {emailSent && (
                        <p className="mt-3 text-sm text-emerald-300">Thanks! You’re unlocked.</p>
                      )}
                      <button
                        onClick={unlockWithEmail}
                        disabled={savingEmail}
                        className="mt-4 w-full inline-flex items-center justify-center gap-2 border border-gold text-gold py-3 text-xs uppercase tracking-widest font-medium hover:bg-gold/5 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Unlock with email
                      </button>
                    </div>
                  </div>
                  {warning && (
                    <p className="mt-3 text-sm text-rose-300 text-center">
                      You didn't follow — tap 'Follow @osmanvisuals' above first.
                    </p>
                  )}
                  <p className="mt-3 text-[11px] text-bone/40 text-center">
                    Your unlock is remembered on this device.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
