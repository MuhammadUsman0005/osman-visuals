import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useDeferredValue, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PromptCard, type Prompt } from "@/components/PromptCard";
import { PromptPreviewModal } from "@/components/PromptPreviewModal";
import { Search } from "lucide-react";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "The Vault | Osman Visuals" },
      {
        name: "description",
        content:
          "The full archive of AI prompts. Copy free prompts instantly, or unlock premium packs.",
      },
      { property: "og:title", content: "The Vault — Osman Visuals" },
      {
        property: "og:description",
        content:
          "The full archive of AI prompts. Copy free prompts instantly, or unlock premium packs.",
      },
      { property: "og:url", content: "/library" },
    ],
    links: [{ rel: "canonical", href: "/library" }],
  }),
  component: Library,
});

function Library() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [preview, setPreview] = useState<Prompt | null>(null);
  const deferredQ = useDeferredValue(q);

  const CATEGORIES = [
    "All",
    "Cinematic Portraits",
    "Character Consistency",
    "Luxury Fashion",
    "Concept Art",
    "Cyberpunk",
    "Fantasy Worlds",
    "Product Visualization",
    "Branding & Marketing",
    "Technology",
    "Architecture & Interior",
    "Icons",
  ];

  const { data: prompts, isLoading } = useQuery({
    queryKey: ["prompts", "all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("prompts").select("*").order("catalog_number");
      if (error) throw error;
      return (data ?? []) as unknown as Prompt[];
    },
  });

  // use the fixed category list (CATEGORIES above) rather than deriving from prompts
  const displayedPrompts = useMemo(() => {
    if (!prompts) return [];
    const term = deferredQ.trim().toLowerCase();
    return prompts.filter((p) => {
      // category filter: check if selected category exists in prompt.categories array
      if (cat !== "All") {
        if (!p.categories || !Array.isArray(p.categories)) return false;
        if (!p.categories.some((c) => c === cat)) return false;
      }
      if (!term) return true;

      const inTitle = p.title.toLowerCase().includes(term);
      const inPrompt = p.prompt_text.toLowerCase().includes(term);
      const inTags = Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(term));
      const inCats =
        Array.isArray(p.categories) && p.categories.some((c) => c.toLowerCase().includes(term));
      const inTools = Array.isArray(p.tools) && p.tools.some((t) => t.toLowerCase().includes(term));
      return inTitle || inPrompt || inTags || inCats || inTools;
    });
  }, [prompts, deferredQ, cat]);

  // Pagination state: page and pageSize responsive to window width
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(() => {
    if (typeof window === "undefined") return 42;
    const w = window.innerWidth;
    if (w >= 1024) return 42;
    if (w >= 768) return 21;
    return 9;
  });

  // update pageSize on resize
  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      const newSize = w >= 1024 ? 42 : w >= 768 ? 21 : 9;
      setPageSize(newSize);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // reset page whenever search or category changes
  useEffect(() => setPage(1), [deferredQ, cat]);

  const totalPages = Math.max(1, Math.ceil(displayedPrompts.length / pageSize));
  const pagedPrompts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return displayedPrompts.slice(start, start + pageSize);
  }, [displayedPrompts, page, pageSize]);

  return (
    <>
      <section className="border-b hairline">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-20 pb-12">
          <p className="eyebrow">Cat. IV — The Vault</p>
          <h1 className="mt-4 font-display text-5xl md:text-6xl text-bone leading-tight">
            The Creative Vault
          </h1>
          <p className="mt-4 text-bone/70 max-w-xl">
            Discover the complete OsmanVisuals archive, featuring premium AI prompts, creative
            frameworks, cinematic workflows, and professional visual resources. From AI portraits
            and commercial advertising to concept art, brand campaigns, and prompt engineering,
            every collection is carefully curated to help creators, brands, and storytellers produce
            extraordinary visuals with confidence.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-12">
        <div className="flex flex-col gap-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bone/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search titles, prompts, tags…"
              maxLength={100}
              className="w-full bg-surface border hairline pl-10 pr-4 py-3 text-sm text-bone placeholder:text-bone/30 focus:outline-none focus:border-gold"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${
                  cat === c
                    ? "border-gold text-gold bg-gold/5"
                    : "border-gold-hairline text-bone/60 hover:text-bone hover:border-bone/30"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border hairline bg-surface h-72 animate-pulse" />
              ))}
            </div>
          ) : displayedPrompts.length === 0 ? (
            <div className="border hairline bg-surface py-24 text-center">
              <p className="eyebrow">Empty plate</p>
              <p className="mt-3 font-display text-2xl text-bone">
                Nothing matches that search yet.
              </p>
              <p className="mt-2 text-sm text-bone/60">Try a broader category or a shorter term.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pagedPrompts.map((p) => (
                  <PromptCard key={p.id} prompt={p} onOpen={setPreview} />
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center gap-2 justify-center">
                  <button
                    onClick={() => setPage((s) => Math.max(1, s - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 text-xs uppercase tracking-widest border transition-colors border-gold-hairline text-bone/60 disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`px-3 py-1 text-xs uppercase tracking-widest border transition-colors ${
                        page === i + 1
                          ? "border-gold text-gold bg-gold/5"
                          : "border-gold-hairline text-bone/60"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage((s) => Math.min(totalPages, s + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 text-xs uppercase tracking-widest border transition-colors border-gold-hairline text-bone/60 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <PromptPreviewModal prompt={preview} onClose={() => setPreview(null)} />
    </>
  );
}
