import { useEffect, useState } from "react";
import { X, Copy, Check, Instagram, Lock } from "lucide-react";
import type { Prompt } from "@/components/PromptCard";

const STORAGE_KEY = "ov_unlocked_prompts";
const INSTAGRAM_URL = "https://instagram.com/osmanvisuals";

function readUnlocked(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function persistUnlock(id: string) {
  if (typeof window === "undefined") return;
  const list = readUnlocked();
  if (list.includes(id)) return;
  list.push(id);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* storage full / disabled — ignore */
  }
}

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

  useEffect(() => {
    if (!prompt) return;
    setCopied(false);
    setFollowed(false);
    if (!prompt.is_premium) {
      setUnlocked(true);
      return;
    }
    setUnlocked(readUnlocked().includes(prompt.id));
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

  function confirmUnlock() {
    persistUnlock(prompt!.id);
    setUnlocked(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-void/90 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl border hairline bg-surface my-8"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={prompt.title}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 text-bone/60 hover:text-bone bg-void/60 border hairline p-1.5"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="aspect-[16/10] w-full bg-void border-b hairline overflow-hidden">
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

        <div className="px-6 py-6 md:px-8 md:py-8">
          <div className="flex items-center justify-between">
            <span className="eyebrow">{prompt.catalog_number}</span>
            <span className="eyebrow text-bone/50">{prompt.category}</span>
          </div>
          <h2 className="mt-3 font-display text-3xl md:text-4xl text-bone leading-tight">
            {prompt.title}
          </h2>

          {prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {prompt.tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] uppercase tracking-widest text-bone/50 border hairline px-1.5 py-0.5"
                >
                  {t}
                </span>
              ))}
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
              <div className="border hairline bg-void p-6">
                <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-widest">
                  <Lock className="w-3.5 h-3.5" /> Premium plate
                </div>
                <p className="mt-3 text-sm text-bone/70 leading-relaxed">
                  Follow <span className="text-bone">@osmanvisuals</span> on Instagram to unlock
                  this prompt. One tap, no email required.
                </p>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setFollowed(true)}
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 border border-gold text-gold py-3 text-xs uppercase tracking-widest font-medium hover:bg-gold/5 transition-colors"
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
                <p className="mt-3 text-[11px] text-bone/40 text-center">
                  Your unlock is remembered on this device.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
