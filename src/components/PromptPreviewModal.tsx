import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  X,
  Copy,
  Check,
  Instagram,
  Lock,
  ChevronLeft,
  ChevronRight,
  ScanFace,
  Aperture,
  Sun,
  Ban,
  Images,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import type { Prompt } from "@/components/PromptCard";
import { onFollowedChange, persistUnlock, readFollowed } from "@/lib/instagram-unlock";

const INSTAGRAM_URL = "https://instagram.com/osmanvisuals";

const WORKFLOW_GUIDES = [
  {
    slug: "identity-preservation",
    icon: ScanFace,
    title: "Identity Preservation",
    description:
      "Keep the exact same face, hairstyle, and character identity across every generation.",
  },
  {
    slug: "composition-camera",
    icon: Aperture,
    title: "Composition & Camera",
    description:
      "Framing, angles, focal length, and depth of field that make an image feel intentional.",
  },
  {
    slug: "lighting-color",
    icon: Sun,
    title: "Lighting & Color",
    description: "Cinematic and studio lighting, color harmony, shadow, and professional grading.",
  },
  {
    slug: "negative-prompting",
    icon: Ban,
    title: "Negative Prompting",
    description: "Remove unwanted artifacts, fix anatomy, and control generation quality.",
  },
  {
    slug: "reference-images",
    icon: Images,
    title: "Reference Images",
    description: "How reference photos shape identity, pose, clothing, and environment.",
  },
  {
    slug: "final-refinement",
    icon: Sparkles,
    title: "Final Refinement",
    description: "Upscaling, facial cleanup, texture detail, and finishing touches.",
  },
];

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
      className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Inner Flex Wrapper for Vertical Centering & Scroll Control */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-6 my-auto">
        {/* Modal Card Div */}
        <div
          className="relative w-full max-w-5xl my-auto rounded-2xl overflow-hidden bg-surface border border-black/10 dark:border-white/10 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-0 right-0 z-[60] w-8 h-8 flex items-center justify-center rounded-md border hairline bg-surface hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="border hairline bg-surface rounded-2xl overflow-hidden">
            <div className="grid w-full lg:grid-cols-[4fr_5fr]">
              <div className="aspect-[4/5] w-full bg-void border-b hairline overflow-hidden lg:border-b-0 lg:border-r hairline relative">
                {/* Image carousel */}
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
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-on-photo-chip border hairline p-2 rounded-full flex items-center justify-center touch-manipulation"
                            style={{ width: 36, height: 36 }}
                          >
                            <ChevronLeft className="w-4 h-4 text-on-photo-text" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex((i) => (i + 1) % images.length);
                            }}
                            aria-label="Next image"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-on-photo-chip border hairline p-2 rounded-full flex items-center justify-center touch-manipulation"
                            style={{ width: 36, height: 36 }}
                          >
                            <ChevronRight className="w-4 h-4 text-on-photo-text" />
                          </button>

                          <div className="absolute left-0 right-0 bottom-3 flex items-center justify-center gap-2">
                            {images.map((_, idx) => (
                              <span
                                key={idx}
                                className={`w-2 h-2 rounded-full ${
                                  idx === currentImageIndex ? "bg-on-photo-gold" : "bg-on-photo-dot"
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
                        className="text-[10px] uppercase tracking-widest text-stone-700 dark:text-bone/60 border border-stone-300 dark:border-bone/20 px-1.5 py-0.5 font-medium"
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

                      <div className="mt-8 pt-6 border-t hairline">
                        <p className="eyebrow">The Full Workflow</p>
                        <h3 className="mt-3 font-display text-xl text-bone leading-snug">
                          Prompt is only the blueprint.
                        </h3>
                        <p className="mt-3 text-sm text-bone/70 leading-relaxed">
                          A great AI image is never created by the prompt alone. Professional results
                          also depend on identity preservation, composition, camera direction,
                          lighting, color grading, negative prompting, reference management, and final
                          refinement.
                        </p>
                        <p className="mt-2 text-sm text-bone/70 leading-relaxed">
                          Every image inside Osman Visuals is built using a complete creative
                          workflow, not just a single prompt. Explore the guides below to master every
                          part of the process.
                        </p>

                        <div className="mt-5 grid sm:grid-cols-2 gap-3">
                          {WORKFLOW_GUIDES.map(({ slug, icon: Icon, title, description }) => (
                            <Link
                              key={slug}
                              to="/guides/$slug"
                              params={{ slug }}
                              className="group border hairline bg-void p-4 flex flex-col gap-2 hover:border-gold/60 transition-colors"
                            >
                              <Icon className="w-5 h-5 text-gold" />
                              <p className="font-display text-base text-bone leading-snug">{title}</p>
                              <p className="text-xs text-bone/60 leading-relaxed flex-1">
                                {description}
                              </p>
                              <span className="text-[10px] uppercase tracking-widest text-gold inline-flex items-center gap-1 group-hover:gap-1.5 transition-all">
                                Read Guide <ArrowRight className="w-3 h-3" />
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
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
                      {warning && (
                        <p className="mt-3 text-sm text-red-800 dark:text-rose-300 font-medium text-left">
                          {warning}
                        </p>
                      )}
                      <p className="mt-3 text-[12px] text-bone/60 text-left">
                        Access is securely saved on this device.
                      </p>
                    </>
                  )}
                </div>
                <div className="mt-auto pt-8">
                  <Link
                    to="/gallery"
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-bone/60 hover:text-gold transition-colors font-bold"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Back to Gallery
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}