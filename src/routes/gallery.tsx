import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Prompt } from "@/components/PromptCard";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery | Osman Visuals" },
      {
        name: "description",
        content: "A pure visual showcase of what this archive can produce — no prompts, no text.",
      },
      { property: "og:title", content: "Gallery — Osman Visuals" },
      {
        property: "og:description",
        content: "A pure visual showcase of what this archive can produce — no prompts, no text.",
      },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: Gallery,
});

function galleryImage(p: Prompt): string | null {
  if (p.preview_image_urls && p.preview_image_urls.length > 0) {
    return p.preview_image_urls[0];
  }
  return p.preview_image_url;
}

function Gallery() {
  const navigate = useNavigate();
  const [active, setActive] = useState<Prompt | null>(null);

  const { data: prompts, isLoading } = useQuery({
    queryKey: ["prompts", "gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("prompts").select("*").order("catalog_number");
      if (error) throw error;
      return (data ?? []) as unknown as Prompt[];
    },
  });

  const withImages = (prompts ?? []).filter((p) => Boolean(galleryImage(p)));

  function viewPrompt(p: Prompt) {
    setActive(null);
    navigate({ to: "/library", search: { open: p.slug } });
  }

  return (
    <>
      <section className="border-b hairline">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-20 pb-12">
          <p className="eyebrow">Cat. IV — The Gallery</p>
          <h1 className="mt-4 font-display text-5xl md:text-6xl text-bone leading-tight">
            See the Result. Unlock the Process.
          </h1>
          <p className="mt-4 text-bone/70 max-w-xl">
            The Gallery is more than a collection of finished images. It is a showcase of what
            becomes possible when creative direction, professional prompt engineering, and visual
            storytelling work together. Every piece demonstrates the quality, consistency, and
            realism that the Osman Visuals archive is built to deliver. When an image inspires you,
            unlock the exact prompt and transform it into something uniquely your own using your
            subject, your style, and your vision.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-12">
        {isLoading ? (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 [column-fill:_balance]">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="mb-4 break-inside-avoid bg-surface border hairline animate-pulse"
                style={{ height: `${180 + (i % 3) * 70}px` }}
              />
            ))}
          </div>
        ) : withImages.length === 0 ? (
          <div className="border hairline bg-surface py-24 text-center">
            <p className="eyebrow">Empty wall</p>
            <p className="mt-3 font-display text-2xl text-bone">No plates hung yet.</p>
            <p className="mt-2 text-sm text-bone/60">
              Add preview images to prompts in the Vault and they'll appear here automatically.
            </p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 [column-fill:_balance]">
            {withImages.map((p) => (
              <button
                key={p.id}
                onClick={() => setActive(p)}
                className="relative mb-4 block w-full break-inside-avoid border hairline overflow-hidden group cursor-pointer"
                aria-label={`View ${p.title}`}
              >
                {/* 1. Zoom-in animation */}
                <img
                  src={galleryImage(p)!}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                />

                <span
                  className={`absolute top-2 right-2 text-[9px] sm:text-[10px] uppercase tracking-widest px-1.5 py-0.5 sm:px-2 sm:py-1 bg-void/80 backdrop-blur-sm border hairline z-20 ${
                    p.is_premium ? "text-gold" : "text-bone/80"
                  }`}
                >
                  {p.is_premium ? "Exclusive" : "Free"}
                </span>

                {/* 2. Gradient Overlay: Mobile par visible, Desktop par sirf hover par */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

                {/* 3. Text & Username Container: Isme bhi lg:opacity-0 aur lg:group-hover:opacity-100 add kar diya hai */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 transform translate-y-0 lg:translate-y-2 lg:group-hover:translate-y-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500 ease-out flex flex-col gap-1 z-20 items-start">
                  <span className="text-left text-sx sm:text-base text-bone font-medium leading-tight line-clamp-2 drop-shadow-md">
                    {p.title}
                  </span>

                  <a
                    href="https://instagram.com/osmanvisuals"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[10px] tracking-wider font-body text-gold/90 hover:text-gold hover:underline pointer-events-auto"
                  >
                    @osmanvisuals
                  </a>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {active && (
        <div
          className="fixed inset-0 z-50 bg-void/90 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-300"
          onClick={() => setActive(null)}
        >
          <div className="min-h-full flex items-start justify-center p-4 py-10">
            <div
              className="relative w-full max-w-2xl border hairline bg-surface transform transition-all animate-in zoom-in-[0.95] slide-in-from-bottom-4 duration-300"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={active.title}
            >
              <button
                onClick={() => setActive(null)}
                className="absolute right-3 top-3 z-10 text-bone/60 hover:text-bone bg-void/60 border hairline p-1.5"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-full bg-void border-b hairline">
                <img
                  src={galleryImage(active)!}
                  alt={active.title}
                  className="w-full h-auto max-h-[70vh] object-contain mx-auto"
                />
              </div>

              <div className="px-5 py-5 sm:px-6 sm:py-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl text-bone">{active.title}</h2>
                    {active.categories && active.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {active.categories.map((c) => (
                          <button
                            key={c}
                            onClick={() => {
                              setActive(null);
                              // Yahan 'as any' add kar diya hai taake TypeScript ka error na aaye
                              navigate({ to: "/library", search: { category: c } } as any);
                            }}
                            className="text-[10px] uppercase tracking-widest text-bone/50 border hairline px-2 py-1 hover:bg-gold/10 hover:text-gold hover:border-gold/30 transition-colors cursor-pointer"
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => viewPrompt(active)}
                    className="shrink-0 inline-flex items-center gap-2 bg-gold text-void px-5 py-3 text-xs uppercase tracking-widest font-medium hover:bg-gold/90 transition-colors"
                  >
                    View Prompt
                  </button>
                </div>

                {active.description && (
                  <p className="mt-4 text-sm text-bone/70 leading-relaxed">{active.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
