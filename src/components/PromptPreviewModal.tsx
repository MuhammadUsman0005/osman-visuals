import { useEffect, useState } from "react";
import { X, Copy, Check, Instagram, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import type { Prompt } from "@/components/PromptCard";
import { onFollowedChange, persistUnlock, readFollowed } from "@/lib/instagram-unlock";

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
  const [followClickCount, setFollowClickCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [warning, setWarning] = useState<string | false>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!prompt) return;
    setCopied(false);
    setWarning(false);
    setFollowClickCount(0);
    setCurrentImageIndex(0);
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

  function confirmUnlock() {
    const canUnlock = followed || followClickCount >= 2;
    if (!canUnlock) {
      setWarning("Please follow @osmanvisuals to unlock this prompt.");
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
        className="relative w-full max-w-6xl my-10 mx-4 overflow-visible"
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
          className="absolute -right-2 -top-2 z-[60] text-bone/70 hover:text-bone bg-void/80 border hairline p-1.5"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="border hairline bg-surface">
          <div className="grid w-full lg:grid-cols-[4fr_5fr]">
            <div className="aspect-[4/5] w-full bg-void border-b hairline overflow-hidden lg:border-b-0 lg:border-r hairline relative">
              {/* Image carousel (up to 3 images) */}
              {(() => {
                const images =
                  prompt.preview_image_urls && prompt.preview_image_urls.length
                    ? prompt.preview_image_urls.slice(0, 3)
                    : prompt.preview_image_url
                      ? [prompt.preview_image_url]
                      : [];
                if (images.length === 0) {
                  return (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <p className="eyebrow">{prompt.catalog_number}</p>
                        <p className="mt-2 font-display text-2xl text-bone/40">No plate filed</p>
                      </div>
                    </div>
                  );
                }

                const imgSrc = images[currentImageIndex % images.length];

                return (
                  <>
                    <img src={imgSrc} alt={prompt.title} className="w-full h-full object-cover" />

                    {images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex((i) => (i - 1 + images.length) % images.length);
                          }}
                          aria-label="Previous image"
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-void/70 border hairline p-2 rounded-full flex items-center justify-center touch-manipulation"
                          style={{ width: 36, height: 36 }}
                        >
                          <ChevronLeft className="w-4 h-4 text-bone" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex((i) => (i + 1) % images.length);
                          }}
                          aria-label="Next image"
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-void/70 border hairline p-2 rounded-full flex items-center justify-center touch-manipulation"
                          style={{ width: 36, height: 36 }}
                        >
                          <ChevronRight className="w-4 h-4 text-bone" />
                        </button>

                        <div className="absolute left-0 right-0 bottom-3 flex items-center justify-center gap-2">
                          {images.map((_, idx) => (
                            <span
                              key={idx}
                              className={`w-2 h-2 rounded-full ${
                                idx === currentImageIndex ? "bg-gold" : "bg-bone/30"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                );
              })()}
            </div>

            <div className="px-6 py-6 lg:max-h-[85vh] lg:overflow-y-auto flex flex-col">
              <div className="flex items-center justify-between gap-4">
                <span className="eyebrow">
                  {prompt.catalog_number} — {prompt.difficulty}
                </span>
                <span
                  className={`eyebrow shrink-0 ${prompt.is_premium ? "text-gold" : "text-bone/50"}`}
                >
                  {prompt.is_premium ? "Exclusive" : "Free"}
                </span>
              </div>
              <h2 className="mt-3 font-display text-2xl md:text-3xl text-bone leading-tight">
                {prompt.title}
                {prompt.tools && prompt.tools.length > 0 && (
                  <span className="text-sm text-bone/60 font-normal font-body not-italic ml-2">
                    ({prompt.tools.join(" · ")})
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
                    <pre
                      className="whitespace-pre-wrap font-body text-sm text-bone/85 leading-relaxed bg-void border hairline p-4 max-h-80 overflow-y-auto select-none"
                      onCopy={(e) => e.preventDefault()}
                    >
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
                    <div className="border hairline bg-void p-6 mt-6 w-full">
                      <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-widest">
                        <Lock className="w-3.5 h-3.5" /> PRIVATE ARCHIVE ACCESS
                      </div>
                      <p className="mt-3 text-sm text-bone/70 leading-relaxed">
                        Follow on Instagram to unlock this archive instantly. No account required.
                      </p>
                      <a
                        href={INSTAGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          setFollowClickCount((c) => {
                            const next = c + 1;
                            setFollowed(next >= 2 ? true : readFollowed());
                            setWarning(false);
                            return next;
                          });
                        }}
                        className="mt-5 w-full flex items-center justify-center gap-2 border border-gold text-gold py-3 px-4 text-xs uppercase tracking-widest font-medium text-center hover:bg-gold/5 transition-colors whitespace-normal"
                      >
                        <Instagram className="w-3.5 h-3.5 shrink-0" />
                        {followClickCount === 0
                          ? "FOLLOW OSMANVISUALS"
                          : followClickCount === 1
                            ? "FOLLOW OSMANVISUALS"
                            : "FOLLOWED!"}
                      </a>
                      <button
                        onClick={confirmUnlock}
                        className={`mt-2 w-full py-3 text-xs uppercase tracking-widest font-medium transition-colors ${
                          followed || followClickCount >= 2
                            ? "bg-gold text-void hover:bg-gold/90"
                            : "bg-bone/10 text-bone/60 hover:bg-bone/15"
                        }`}
                      >
                        VERIFY & UNLOCK PROMPT
                      </button>
                    </div>
                    {warning && <p className="mt-3 text-sm text-rose-300 text-left">{warning}</p>}
                    <p className="mt-3 text-[11px] text-bone/40 text-left">
                      Access is securely saved on this device.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
