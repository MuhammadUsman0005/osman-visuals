import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Download, Lock, Maximize2, Star } from "lucide-react";

type Resource = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  file_url: string | null;
  preview_image_url: string | null;
  is_premium: boolean;
  short_description: string | null;
  description: string | null;
  rating: number | null;
};

const CATEGORIES = [
  "All",
  "Prompt Packs",
  "PDF Guides",
  "Assets",
  "References",
  "Templates",
  "Workflows",
  "Cheat Sheets",
  "Color Packs",
  "AI Tool Presets",
  "Bonus Resources",
];

function StarRating({ value }: { value: number | null }) {
  const v = value ?? 0;
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rated ${v} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < Math.round(v) ? "fill-gold text-gold" : "text-bone/25"}`}
        />
      ))}
      {v > 0 && <span className="ml-1.5 text-[11px] text-bone/60">{v.toFixed(1)}</span>}
    </div>
  );
}

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — Osman Visuals" },
      {
        name: "description",
        content:
          "Downloadable PDFs, prompt packs, assets, and reference sheets from the Osman Visuals studio.",
      },
      { property: "og:title", content: "Resources — Osman Visuals" },
      {
        property: "og:description",
        content:
          "Downloadable PDFs, prompt packs, assets, and reference sheets from the Osman Visuals studio.",
      },
      { property: "og:url", content: "/resources" },
    ],
    links: [{ rel: "canonical", href: "/resources" }],
  }),
  component: Resources,
});

function Resources() {
  const [cat, setCat] = useState<string>("All");

  const { data, isLoading } = useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Resource[];
    },
  });

  const filtered = useMemo(
    () => (data ?? []).filter((r) => cat === "All" || r.category === cat),
    [data, cat],
  );

  return (
    <>
      <section className="border-b hairline">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-20 pb-12">
          <p className="eyebrow">Cat. V — Resources</p>
          <h1 className="mt-4 font-display text-5xl md:text-6xl text-bone leading-tight">
            The tools behind the work.
          </h1>
          <p className="mt-4 text-bone/70 max-w-xl">
            Everything that supports the creative process, from downloadable assets and production guides to references, templates, and creator utilities.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-12">
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((t) => (
            <button
              key={t}
              onClick={() => setCat(t)}
              className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${
                cat === t
                  ? "border-gold text-gold bg-gold/5"
                  : "border-gold-hairline text-bone/60 hover:text-bone hover:border-bone/30"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border hairline bg-surface h-56 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => (
              <Link
                key={r.id}
                to="/resources/$slug"
                params={{ slug: r.slug }}
                className="group border hairline bg-surface flex flex-col transition-colors hover:border-gold/60"
              >
                <header className="flex items-center justify-between px-4 pt-4 pb-3 border-b hairline">
                  <span className="eyebrow">{r.category ?? "Resource"}</span>
                  <span className={`eyebrow ${r.is_premium ? "text-gold" : "text-bone/50"}`}>
                    {r.is_premium ? "Exclusive" : "Free"}
                  </span>
                </header>
                <div className="px-4 py-5 flex-1 flex flex-col gap-3">
                  <h3 className="font-display text-xl leading-snug text-bone">{r.title}</h3>
                  {(r.short_description || r.description) && (
                    <p className="text-sm text-bone/60 line-clamp-3 leading-relaxed">
                      {r.short_description || r.description}
                    </p>
                  )}
                  <StarRating value={r.rating} />
                </div>
                <footer className="flex items-stretch border-t hairline">
                  <span className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs uppercase tracking-widest text-bone/80 group-hover:text-gold">
                    <Maximize2 className="w-3.5 h-3.5" /> Preview
                  </span>
                  <span className="flex items-center justify-center gap-2 px-4 py-3 text-xs uppercase tracking-widest text-bone/80 group-hover:text-gold border-l hairline">
                    {r.is_premium ? (
                      <><Lock className="w-3.5 h-3.5" /> Unlock</>
                    ) : (
                      <><Download className="w-3.5 h-3.5" /> Download</>
                    )}
                  </span>
                </footer>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
