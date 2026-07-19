import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UnlockModal } from "@/components/UnlockModal";
import { Download, Lock } from "lucide-react";

type Resource = {
  id: string;
  title: string;
  type: "pdf" | "prompt_pack" | "asset" | "reference_image";
  file_url: string | null;
  preview_image_url: string | null;
  is_premium: boolean;
  description: string | null;
};

const TYPE_LABEL: Record<Resource["type"], string> = {
  pdf: "PDF",
  prompt_pack: "Prompt pack",
  asset: "Asset",
  reference_image: "Reference",
};

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
  const [type, setType] = useState<"All" | Resource["type"]>("All");
  const [unlock, setUnlock] = useState<Resource | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Resource[];
    },
  });

  const filtered = useMemo(
    () => (data ?? []).filter((r) => type === "All" || r.type === type),
    [data, type],
  );

  const filters: Array<"All" | Resource["type"]> = [
    "All",
    "prompt_pack",
    "pdf",
    "asset",
    "reference_image",
  ];

  return (
    <>
      <section className="border-b hairline">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-20 pb-12">
          <p className="eyebrow">Cat. V — Resources</p>
          <h1 className="mt-4 font-display text-5xl md:text-6xl text-bone leading-tight">
            The working materials.
          </h1>
          <p className="mt-4 text-bone/70 max-w-xl">
            Prompt packs, PDFs, and reference plates we use in the studio.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-12">
        <div className="flex flex-wrap gap-2 mb-10">
          {filters.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${
                type === t
                  ? "border-gold text-gold bg-gold/5"
                  : "border-gold-hairline text-bone/60 hover:text-bone hover:border-bone/30"
              }`}
            >
              {t === "All" ? "All" : TYPE_LABEL[t]}
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
              <article key={r.id} className="border hairline bg-surface flex flex-col">
                <header className="flex items-center justify-between px-4 pt-4 pb-3 border-b hairline">
                  <span className="eyebrow">{TYPE_LABEL[r.type]}</span>
                  {r.is_premium ? (
                    <span className="text-[10px] uppercase tracking-widest text-gold border border-gold/40 px-2 py-0.5">
                      Premium
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-widest text-bone/50 border hairline px-2 py-0.5">
                      Free
                    </span>
                  )}
                </header>
                <div className="px-4 py-6 flex-1">
                  <h3 className="font-display text-xl text-bone">{r.title}</h3>
                  {r.description && (
                    <p className="mt-3 text-sm text-bone/60 leading-relaxed">{r.description}</p>
                  )}
                </div>
                <footer className="border-t hairline">
                  <button
                    onClick={() => {
                      if (r.is_premium || !r.file_url) {
                        setUnlock(r);
                      } else {
                        window.open(r.file_url, "_blank", "noopener");
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs uppercase tracking-widest text-bone/80 hover:text-gold hover:bg-gold/5 transition-colors"
                  >
                    {r.is_premium ? (
                      <>
                        <Lock className="w-3.5 h-3.5" /> Unlock pack
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" /> Download
                      </>
                    )}
                  </button>
                </footer>
              </article>
            ))}
          </div>
        )}
      </section>

      <UnlockModal
        open={!!unlock}
        onClose={() => setUnlock(null)}
        title={unlock?.title ?? ""}
        source={`resource:${unlock?.id ?? ""}`}
      />
    </>
  );
}
