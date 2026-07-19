import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpRight } from "lucide-react";

type Guide = {
  id: string;
  slug: string;
  title: string;
  cover_image_url: string | null;
  body: string;
  category: "prompting_tutorial" | "identity_preservation" | "tools_guide";
  read_time: number;
  featured: boolean;
};

const CATEGORY_LABEL: Record<Guide["category"], string> = {
  prompting_tutorial: "AI prompting",
  identity_preservation: "Identity preservation",
  tools_guide: "Tools",
};

export const Route = createFileRoute("/guides")({
  head: () => ({
    meta: [
      { title: "Guides — Osman Visuals" },
      {
        name: "description",
        content: "Guides on prompting, identity preservation, and the AI tools we actually use.",
      },
      { property: "og:title", content: "Guides — Osman Visuals" },
      {
        property: "og:description",
        content: "Guides on prompting, identity preservation, and the AI tools we actually use.",
      },
      { property: "og:url", content: "/guides" },
    ],
    links: [{ rel: "canonical", href: "/guides" }],
  }),
  component: Guides,
});

function Guides() {
  const { data } = useQuery({
    queryKey: ["guides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guides")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Guide[];
    },
  });

  const featured = data?.find((g) => g.featured);
  const rest = data?.filter((g) => !g.featured) ?? [];

  return (
    <>
      <section className="border-b hairline">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-20 pb-12">
          <p className="eyebrow">Cat. VI — Guides</p>
          <h1 className="mt-4 font-display text-5xl md:text-6xl text-bone leading-tight">
            The manual.
          </h1>
          <p className="mt-4 text-bone/70 max-w-xl">
            Prompting tutorials, identity preservation, and the tools we return to.
          </p>
        </div>
      </section>

      {featured && (
        <section className="mx-auto max-w-7xl px-6 lg:px-10 pt-12">
          <p className="eyebrow mb-4">Featured — Core method</p>
          <Link
            to="/guides/$slug"
            params={{ slug: featured.slug }}
            className="block border hairline bg-surface p-10 md:p-14 hover:border-gold/60 transition-colors group"
          >
            <p className="eyebrow">
              {CATEGORY_LABEL[featured.category]} · {featured.read_time} min read
            </p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl text-bone leading-tight max-w-3xl">
              {featured.title}
            </h2>
            <p className="mt-6 text-bone/70 max-w-2xl">
              {featured.body
                .split("\n")
                .find((l) => l.trim() && !l.startsWith("#"))
                ?.slice(0, 200)}
              …
            </p>
            <span className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold group-hover:gap-3 transition-all">
              Read the guide <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
        <p className="eyebrow mb-6">All guides</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((g) => (
            <Link
              key={g.id}
              to="/guides/$slug"
              params={{ slug: g.slug }}
              className="border hairline bg-surface p-6 flex flex-col hover:border-gold/60 transition-colors group"
            >
              <p className="eyebrow">{CATEGORY_LABEL[g.category]}</p>
              <h3 className="mt-3 font-display text-2xl text-bone leading-snug">{g.title}</h3>
              <p className="mt-auto pt-6 text-xs uppercase tracking-widest text-bone/50 flex items-center gap-2">
                {g.read_time} min read
                <span className="ml-auto text-gold group-hover:translate-x-0.5 transition-transform">
                  →
                </span>
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
