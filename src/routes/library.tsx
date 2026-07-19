import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useDeferredValue } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PromptCard, type Prompt } from "@/components/PromptCard";
import { PromptPreviewModal } from "@/components/PromptPreviewModal";
import { Search } from "lucide-react";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Prompt Library — Osman Visuals" },
      { name: "description", content: "The full archive of AI prompts. Copy free prompts instantly, or unlock premium packs." },
      { property: "og:title", content: "Prompt Library — Osman Visuals" },
      { property: "og:description", content: "The full archive of AI prompts. Copy free prompts instantly, or unlock premium packs." },
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

  const { data: prompts, isLoading } = useQuery({
    queryKey: ["prompts", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .order("catalog_number");
      if (error) throw error;
      return data as Prompt[];
    },
  });

  const categories = useMemo(() => {
    const s = new Set<string>();
    prompts?.forEach((p) => s.add(p.category));
    return ["All", ...Array.from(s)];
  }, [prompts]);

  const filtered = useMemo(() => {
    if (!prompts) return [];
    const term = deferredQ.trim().toLowerCase();
    return prompts.filter((p) => {
      if (cat !== "All" && p.category !== cat) return false;
      if (!term) return true;
      return (
        p.title.toLowerCase().includes(term) ||
        p.prompt_text.toLowerCase().includes(term) ||
        p.tags.some((t) => t.toLowerCase().includes(term))
      );
    });
  }, [prompts, deferredQ, cat]);

  return (
    <>
      <section className="border-b hairline">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-20 pb-12">
          <p className="eyebrow">Cat. IV — The Library</p>
          <h1 className="mt-4 font-display text-5xl md:text-6xl text-bone leading-tight">
            The archive, in full.
          </h1>
          <p className="mt-4 text-bone/70 max-w-xl">
            Every plate we've filed. Free prompts copy on click. Premium packs unlock with an email or purchase.
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
            {categories.map((c) => (
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
          ) : filtered.length === 0 ? (
            <div className="border hairline bg-surface py-24 text-center">
              <p className="eyebrow">Empty plate</p>
              <p className="mt-3 font-display text-2xl text-bone">
                Nothing matches that search yet.
              </p>
              <p className="mt-2 text-sm text-bone/60">Try a broader category or a shorter term.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <PromptCard key={p.id} prompt={p} onOpen={setPreview} />
              ))}
            </div>
          )}
        </div>
      </section>

      <PromptPreviewModal prompt={preview} onClose={() => setPreview(null)} />
    </>
  );
}
