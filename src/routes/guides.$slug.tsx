import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";

type Guide = {
  id: string;
  slug: string;
  title: string;
  body: string;
  category: "prompting_tutorial" | "identity_preservation" | "tools_guide";
  read_time: number;
};

const CATEGORY_LABEL: Record<Guide["category"], string> = {
  prompting_tutorial: "AI prompting",
  identity_preservation: "Identity preservation",
  tools_guide: "Tools",
};

export const Route = createFileRoute("/guides/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Guide — Osman Visuals` },
      { property: "og:url", content: `/guides/${params.slug}` },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: `/guides/${params.slug}` }],
  }),
  component: GuidePage,
});

function renderMarkdown(md: string) {
  // Minimal renderer: ## headings, paragraphs.
  const blocks = md.split(/\n\n+/);
  return blocks.map((b, i) => {
    if (b.startsWith("## ")) {
      return (
        <h2 key={i} className="font-display text-3xl text-bone mt-12 mb-4">
          {b.replace(/^##\s+/, "")}
        </h2>
      );
    }
    return (
      <p key={i} className="text-bone/75 leading-relaxed mb-5 text-[17px]">
        {b}
      </p>
    );
  });
}

function GuidePage() {
  const { slug } = Route.useParams();

  const { data: guide, isLoading, isError } = useQuery({
    queryKey: ["guide", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guides")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data as Guide;
    },
  });

  const { data: related } = useQuery({
    queryKey: ["guides-related", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guides")
        .select("id, slug, title, category, read_time")
        .neq("slug", slug)
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24">
        <div className="h-6 w-40 bg-surface animate-pulse" />
        <div className="mt-6 h-16 bg-surface animate-pulse" />
      </div>
    );
  }

  if (isError || !guide) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="eyebrow">Not found</p>
        <h1 className="mt-3 font-display text-4xl text-bone">This guide isn't filed here.</h1>
        <Link to="/guides" className="mt-6 inline-block border-b border-gold text-bone hover:text-gold">Back to guides</Link>
      </div>
    );
  }

  return (
    <>
      <article className="mx-auto max-w-3xl px-6 lg:px-10 pt-16 pb-20">
        <Link to="/guides" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-bone/60 hover:text-gold mb-10">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to guides
        </Link>
        <p className="eyebrow">{CATEGORY_LABEL[guide.category]} · {guide.read_time} min read</p>
        <h1 className="mt-4 font-display text-4xl md:text-5xl text-bone leading-tight">
          {guide.title}
        </h1>
        <div className="mt-10 border-t hairline pt-10">{renderMarkdown(guide.body)}</div>
      </article>

      {related && related.length > 0 && (
        <section className="border-t hairline">
          <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
            <p className="eyebrow mb-6">Also filed</p>
            <div className="grid gap-4 md:grid-cols-3">
              {related.map((g) => (
                <Link
                  key={g.id}
                  to="/guides/$slug"
                  params={{ slug: g.slug }}
                  className="border hairline bg-surface p-6 hover:border-gold/60 transition-colors"
                >
                  <p className="eyebrow">{CATEGORY_LABEL[g.category as Guide["category"]]}</p>
                  <h3 className="mt-3 font-display text-xl text-bone leading-snug">{g.title}</h3>
                  <p className="mt-4 text-xs uppercase tracking-widest text-bone/50">{g.read_time} min read →</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
