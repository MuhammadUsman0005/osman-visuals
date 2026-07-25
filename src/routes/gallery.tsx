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
            The work, not the words
          </h1>
          <p className="mt-4 text-bone/70 max-w-xl">
            A pure visual showcase — no prompts, no descriptions. See the level of image this
            archive produces, then unlock the exact prompt behind anything you like.
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
                className="relative mb-4 block w-full break-inside-avoid border hairline overflow-hidden group"
                aria-label={`View ${p.title}`}
              >
                <img
                  src={galleryImage(p)!}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-auto object-cover group-hover:opacity-80 transition-opacity"
                />

                <span
                  className={`absolute top-2 right-2 text-[9px] sm:text-[10px] uppercase tracking-widest px-1.5 py-0.5 sm:px-2 sm:py-1 bg-void/80 backdrop-blur-sm border hairline ${
                    p.is_premium ? "text-gold" : "text-bone/80"
                  }`}
                >
                  {p.is_premium ? "Exclusive" : "Free"}
                </span>

                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-void/90 via-void/40 to-transparent pointer-events-none" />
                <span className="absolute bottom-1.5 left-2 right-2 sm:bottom-2 sm:left-3 sm:right-3 text-left text-[11px] sm:text-xs text-bone font-medium leading-tight line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {p.title}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      {active && (
        <div
          className="fixed inset-0 z-50 bg-void/90 backdrop-blur-sm overflow-y-auto"
          onClick={() => setActive(null)}
        >
          <div className="min-h-full flex items-start justify-center p-4 py-10">
            <div
              className="relative w-full max-w-2xl border hairline bg-surface"
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
                          <span
                            key={c}
                            className="text-[10px] uppercase tracking-widest text-bone/50 border hairline px-1.5 py-0.5"
                          >
                            {c}
                          </span>
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
                  <p className="mt-4 text-sm text-bone/70 leading-relaxed">
                    {active.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}