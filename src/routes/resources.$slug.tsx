import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft,
  Check,
  Download,
  Star,
  Instagram,
  Circle,
} from "lucide-react";
import {
  readFollowed,
  persistFollowed,
  onFollowedChange,
  readEmailCaptured,
  persistEmailCaptured,
  onEmailCapturedChange,
} from "@/lib/instagram-unlock";

type Faq = { question: string; answer: string };

type Resource = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  short_description: string | null;
  description: string | null;
  whats_included: string[];
  file_format: string | null;
  file_size: string | null;
  rating: number | null;
  faqs: Faq[];
  file_url: string | null;
  preview_image_url: string | null;
  is_premium: boolean;
};

export const Route = createFileRoute("/resources/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Resource — Osman Visuals` },
      { property: "og:url", content: `/resources/${params.slug}` },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: `/resources/${params.slug}` }],
  }),
  component: ResourcePage,
});

function StarRow({ value }: { value: number | null }) {
  const v = value ?? 0;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < Math.round(v) ? "fill-gold text-gold" : "text-bone/25"}`}
        />
      ))}
      {v > 0 && <span className="ml-2 text-xs text-bone/60">{v.toFixed(1)}</span>}
    </div>
  );
}

function ResourcePage() {
  const { slug } = Route.useParams();

  const {
    data: resource,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["resource", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data as unknown as Resource;
    },
  });

  const { data: related } = useQuery({
    queryKey: ["resources-related", slug, resource?.category],
    enabled: !!resource?.category,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("id, slug, title, category, short_description, is_premium, rating")
        .eq("category", resource!.category!)
        .neq("slug", slug)
        .limit(3);
      if (error) throw error;
      return data as unknown as Resource[];
    },
  });

  const [followed, setFollowed] = useState(false);
  const [followClickCount, setFollowClickCount] = useState(0);
  const [emailCaptured, setEmailCaptured] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [warning, setWarning] = useState<string | false>(false);

  useEffect(() => {
    const initialFollowed = readFollowed();
    setFollowed(initialFollowed);
    setFollowClickCount(initialFollowed ? 2 : 0);
    setEmailCaptured(readEmailCaptured());
    const off1 = onFollowedChange(() => {
      const currentFollowed = readFollowed();
      setFollowed(currentFollowed);
      setFollowClickCount(currentFollowed ? 2 : 0);
    });
    const off2 = onEmailCapturedChange(() => setEmailCaptured(readEmailCaptured()));
    return () => {
      off1();
      off2();
    };
  }, []);

  async function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !resource) return;
    setSubmitting(true);
    try {
      await supabase.from("leads").insert({ email: email.trim(), source: resource.slug });
      persistEmailCaptured();
    } catch {
      /* ignore — still unlock UI on client */
      persistEmailCaptured();
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24">
        <div className="h-6 w-40 bg-surface animate-pulse" />
        <div className="mt-6 h-16 bg-surface animate-pulse" />
      </div>
    );
  }

  if (isError || !resource) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="eyebrow">Not found</p>
        <h1 className="mt-3 font-display text-4xl text-bone">This resource isn't filed here.</h1>
        <Link
          to="/resources"
          className="mt-6 inline-block border-b border-gold text-bone hover:text-gold"
        >
          Back to resources
        </Link>
      </div>
    );
  }

  const unlockedFree = !resource.is_premium && emailCaptured;
  const unlockedPremium = resource.is_premium && followed && emailCaptured;
  const unlocked = unlockedFree || unlockedPremium;

  return (
    <>
      <article className="mx-auto max-w-3xl px-6 lg:px-10 pt-16 pb-16">
        <Link
          to="/resources"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-bone/60 hover:text-gold mb-10"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to resources
        </Link>

        <p className="eyebrow">
          {resource.category ?? "Resource"}
          {resource.is_premium ? " · Exclusive" : " · Free"}
        </p>
        <h1 className="mt-4 font-display text-4xl md:text-5xl text-bone leading-tight">
          {resource.title}
        </h1>

        <div className="mt-4 flex items-center gap-4">
          <StarRow value={resource.rating} />
          {resource.file_format && (
            <span className="text-xs uppercase tracking-widest text-bone/50">
              {resource.file_format}
            </span>
          )}
          {resource.file_size && (
            <span className="text-xs uppercase tracking-widest text-bone/50">
              {resource.file_size}
            </span>
          )}
        </div>

        {(resource.short_description || resource.description) && (
          <p className="mt-8 text-bone/75 leading-relaxed text-[17px]">
            {resource.description || resource.short_description}
          </p>
        )}

        {resource.whats_included && resource.whats_included.length > 0 && (
          <section className="mt-12 border-t hairline pt-10">
            <p className="eyebrow mb-4">What's included</p>
            <ul className="space-y-2">
              {resource.whats_included.map((item, i) => (
                <li key={i} className="flex gap-3 text-bone/80">
                  <span className="text-gold mt-1.5">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Unlock / download panel */}
        <section className="mt-12 border hairline bg-surface p-6">
          {unlocked && resource.file_url ? (
            <div className="flex flex-col gap-4">
              <p className="eyebrow text-gold">Unlocked</p>
              <a
                href={resource.file_url}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center gap-2 border border-gold text-gold px-6 py-3 text-xs uppercase tracking-widest hover:bg-gold/5"
              >
                <Download className="w-3.5 h-3.5" /> Download resource
              </a>
            </div>
          ) : resource.is_premium ? (
            <div className="flex flex-col gap-6">
              <p className="eyebrow">Unlock this resource</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-bone/80">
                  {followed ? (
                    <Check className="w-4 h-4 text-gold" />
                  ) : (
                    <Circle className="w-4 h-4 text-bone/30" />
                  )}
                  <span>Follow @osmanvisuals on Instagram</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-bone/80">
                  {emailCaptured ? (
                    <Check className="w-4 h-4 text-gold" />
                  ) : (
                    <Circle className="w-4 h-4 text-bone/30" />
                  )}
                  <span>Enter your email</span>
                </li>
              </ul>

              {!followed && (
                <div className="flex flex-col gap-2">
                  <a
                    href="https://instagram.com/osmanvisuals"
                    target="_blank"
                    rel="noopener"
                    onClick={() => {
                      setFollowClickCount((count) => Math.min(2, count + 1));
                      setWarning(false);
                    }}
                    className="inline-flex items-center justify-center gap-2 border hairline px-4 py-3 text-xs uppercase tracking-widest text-bone hover:text-gold hover:border-gold/60"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    {followClickCount === 0
                      ? "Follow @osmanvisuals"
                      : followClickCount === 1
                      ? "Tap Follow once more →"
                      : "Followed — thanks!"}
                  </a>
                  <button
                    disabled={followClickCount < 2}
                    onClick={() => {
                      if (followClickCount < 2) {
                        setWarning("Tap 'Follow' once more before unlocking.");
                        return;
                      }
                      persistFollowed();
                    }}
                    className="inline-flex items-center justify-center gap-2 border border-gold text-gold px-4 py-3 text-xs uppercase tracking-widest hover:bg-gold/5 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    I've followed — confirm
                  </button>
                  {warning && <p className="text-xs text-rose-400">{warning}</p>}
                </div>
              )}
              {!emailCaptured && (
                <form onSubmit={submitEmail} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@studio.com"
                    maxLength={255}
                    className="flex-1 bg-void border hairline px-4 py-3 text-sm text-bone placeholder:text-bone/30 focus:outline-none focus:border-gold"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 border border-gold text-gold px-6 py-3 text-xs uppercase tracking-widest hover:bg-gold/5 disabled:opacity-50"
                  >
                    {submitting ? "Sending…" : "Submit email"}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <form onSubmit={submitEmail} className="flex flex-col gap-4">
              <p className="eyebrow">Get this resource</p>
              <p className="text-sm text-bone/60">
                Drop your email and the download reveals instantly below.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@studio.com"
                  maxLength={255}
                  className="flex-1 bg-void border hairline px-4 py-3 text-sm text-bone placeholder:text-bone/30 focus:outline-none focus:border-gold"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 border border-gold text-gold px-6 py-3 text-xs uppercase tracking-widest hover:bg-gold/5 disabled:opacity-50"
                >
                  {submitting ? "Sending…" : "Get resource"}
                </button>
              </div>
            </form>
          )}
        </section>

        {resource.faqs && resource.faqs.length > 0 && (
          <section className="mt-16 border-t hairline pt-10">
            <p className="eyebrow mb-6">Questions</p>
            <div className="divide-y hairline">
              {resource.faqs.map((f, i) => (
                <details key={i} className="group py-4">
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-4 text-bone hover:text-gold">
                    <span className="font-display text-lg">{f.question}</span>
                    <span className="text-gold/60 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-bone/70 leading-relaxed">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}
      </article>

      {related && related.length > 0 && (
        <section className="border-t hairline">
          <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
            <p className="eyebrow mb-6">Related resources</p>
            <div className="grid gap-4 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to="/resources/$slug"
                  params={{ slug: r.slug }}
                  className="border hairline bg-surface p-5 hover:border-gold/60 transition-colors flex flex-col gap-3"
                >
                  <span className="eyebrow">{r.category ?? "Resource"}</span>
                  <h3 className="font-display text-lg text-bone leading-snug">{r.title}</h3>
                  {r.short_description && (
                    <p className="text-sm text-bone/60 line-clamp-2">{r.short_description}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}