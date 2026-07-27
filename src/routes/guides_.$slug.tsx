import { useEffect, useState } from "react"; // useState add karein
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Copy, Check } from "lucide-react"; // Copy aur Check icons add karein
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Yeh function file mein upar kahin bhi rakh dein
function CodeBlock({ children, ...props }: any) {
  const [copied, setCopied] = useState(false);

  // <code> tag ke andar se text nikalne ke liye
  const rawText = children?.props?.children;
  const textToCopy = Array.isArray(rawText) ? rawText.join("") : String(rawText || "");

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // 2 second baad wapas Copy icon show hoga
  };

  return (
    <div className="relative group my-6">
      {/* Code Container */}
      <pre
        {...props}
        className="bg-surface p-4 border hairline rounded overflow-x-auto text-sm pr-14"
      >
        {children}
      </pre>

      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-1.5 rounded bg-[#111111] border hairline text-bone/50 hover:text-gold transition-colors"
        title="Copy prompt"
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}
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

export const Route = createFileRoute("/guides_/$slug")({
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

function GuidePage() {
  const { slug } = Route.useParams();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const {
    data: guide,
    isLoading,
    isError,
  } = useQuery({
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
        .order("display_order", { ascending: true }) // <-- Yeh line add karein
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
        <Link
          to="/guides"
          className="mt-6 inline-block border-b border-gold text-bone hover:text-gold"
        >
          Back to guides
        </Link>
      </div>
    );
  }

  return (
    <>
      <article className="mx-auto max-w-3xl px-6 lg:px-10 pt-16 pb-20">
        <Link
          to="/guides"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-bone/60 hover:text-gold mb-10"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to guides
        </Link>
        <p className="eyebrow">
          {CATEGORY_LABEL[guide.category]} · {guide.read_time} min read
        </p>
        <h1 className="mt-4 font-display text-4xl md:text-5xl text-bone leading-tight">
          {guide.title}
        </h1>

        {/* Yahan ReactMarkdown laga diya hai */}
        <div
          className="mt-10 border-t hairline pt-10 text-bone/80 space-y-4 leading-relaxed 
  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 
  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 
  [&_h2]:font-display [&_h2]:text-3xl [&_h2]:text-bone [&_h2]:mt-10 [&_h2]:mb-4 
  [&_blockquote]:border-l-2 [&_blockquote]:border-gold [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-bone/90 [&_blockquote]:my-6
  [&_code]:font-mono [&_code]:text-gold [&_code]:text-sm
  [&_a]:text-gold [&_a]:underline hover:[&_a]:text-bone
  [&_img]:w-full [&_img]:border [&_img]:hairline [&_img]:my-8
  [&_table]:w-full [&_table]:my-8 [&_table]:border-collapse [&_table]:text-sm
  [&_th]:border-b [&_th]:border-gold/30 [&_th]:p-3 [&_th]:text-left [&_th]:text-bone [&_th]:font-display [&_th]:text-lg
  [&_td]:border-b [&_td]:border-bone/10 [&_td]:p-3"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ pre: CodeBlock }}>
            {guide.body}
          </ReactMarkdown>
        </div>
        <div className="mt-16 pt-8 border-t hairline flex items-center">
          <Link
            to="/guides"
            className="group flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-bone/50 hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Guides
          </Link>
        </div>
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
                  <p className="mt-4 text-xs uppercase tracking-widest text-bone/50">
                    {g.read_time} min read →
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
