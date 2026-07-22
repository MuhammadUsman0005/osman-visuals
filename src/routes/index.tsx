import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PromptCard, type Prompt } from "@/components/PromptCard";
import { PromptPreviewModal } from "@/components/PromptPreviewModal";
import { z } from "zod";
import { ArrowRight, Check } from "lucide-react";
import heroImage from "@/assets/hero-portrait.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

const emailSchema = z.string().trim().email().max(255);

function Home() {
  const [preview, setPreview] = useState<Prompt | null>(null);

  const featured = useQuery({
    queryKey: ["prompts", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .eq("featured", true)
        .order("catalog_number")
        .limit(6);
      if (error) throw error;
      return (data ?? []) as unknown as Prompt[];
    },
  });

  const packs = useQuery({
    queryKey: ["resources", "packs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("type", "prompt_pack")
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b hairline">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Editorial portrait — identity-locked reference frame"
            width={1600}
            height={1920}
            className="w-full h-full object-cover object-right opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-void via-void/85 to-void/10" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-24 pb-32 md:pt-36 md:pb-48">
          <p className="eyebrow reveal">NO. 001 — OSMAN'S ARCHIVE</p>
          <h1 className="mt-6 font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-bone max-w-3xl reveal">
            The same face,
            <br />
            across every frame.
          </h1>
          <p
            className="mt-8 text-lg text-bone/70 max-w-xl leading-relaxed reveal"
            style={{ animationDelay: "120ms" }}
          >
            The official archive of Osman Visuals, featuring cinematic AI prompts and premium prompt
            packs.
          </p>
          <p
            className="mt-4 text-lg text-bone/70 max-w-xl leading-relaxed reveal"
            style={{ animationDelay: "120ms" }}
          >
            Creator guides, commercial visuals, and professional creative resources built for
            creators, brands, and digital storytellers.
          </p>
          <div className="mt-10 flex items-center gap-6 reveal" style={{ animationDelay: "220ms" }}>
            <Link
              to="/library"
              className="inline-flex items-center gap-3 bg-gold text-void px-6 py-3.5 text-xs uppercase tracking-widest font-medium hover:bg-gold/90 transition-colors"
            >
              EXPLORE PROMPTS <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/guides"
              className="text-sm text-bone/80 hover:text-gold border-b border-gold-hairline hover:border-gold pb-0.5"
            >
              The Identity Framework
            </Link>
          </div>
        </div>
      </section>

      {/* Featured plates */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-24">
        <div className="flex items-baseline justify-between mb-10">
          <div>
            <p className="eyebrow">CAT. I — SIGNATURE COLLECTION</p>
            <h2 className="mt-2 font-display text-4xl text-bone">Transformations Worth Saving</h2>
          </div>
          <Link to="/library" className="hidden sm:inline text-sm text-bone/60 hover:text-gold">
            View all →
          </Link>
        </div>

        {featured.isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border hairline bg-surface h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featured.data?.map((p) => (
              <PromptCard key={p.id} prompt={p} onOpen={setPreview} />
            ))}
          </div>
        )}

        {/* Mobile-only "View all" link beneath featured grid */}
        <div className="sm:hidden mt-6 px-6 lg:px-10">
          <Link
            to="/library"
            className="inline-flex items-center gap-3 bg-gold text-void px-6 py-3.5 text-xs uppercase tracking-widest font-medium hover:bg-gold/90 transition-colors w-full justify-center"
          >
            View all →
          </Link>
        </div>
      </section>

      {/* Prompt packs */}
      <section className="border-t hairline bg-surface/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24">
          <p className="eyebrow">Cat. II — Latest packs</p>
          <h2 className="mt-2 font-display text-4xl text-bone mb-10">Prompt packs</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {packs.data?.map((r) => (
              <div key={r.id} className="border hairline bg-void p-8 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <span className="eyebrow">Pack</span>
                  {r.is_premium ? (
                    <span className="text-[10px] uppercase tracking-widest text-gold border border-gold/40 px-2 py-0.5">
                      Premium
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-widest text-bone/50 border hairline px-2 py-0.5">
                      Free
                    </span>
                  )}
                </div>
                <h3 className="font-display text-2xl text-bone leading-snug">{r.title}</h3>
                <p className="mt-3 text-sm text-bone/60 flex-1">{r.description}</p>
                <Link
                  to="/resources"
                  className="mt-6 self-start text-xs uppercase tracking-widest text-bone hover:text-gold border-b border-gold-hairline hover:border-gold pb-0.5"
                >
                  View resource
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead capture CTA */}
      <LeadBand />
      <PromptPreviewModal prompt={preview} onClose={() => setPreview(null)} />
    </>
  );
}

function LeadBand() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done">("idle");
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setErr("Enter a valid email so we can send the pack.");
      return;
    }
    setState("saving");
    setErr(null);
    const { error } = await supabase
      .from("leads")
      .insert({ email: parsed.data, source: "home_cta" });
    if (error) {
      setState("idle");
      setErr("Couldn't save that just now. Try again in a moment.");
      return;
    }
    setState("done");
    setEmail("");
  }

  return (
    <section className="border-t hairline">
      <div className="mx-auto max-w-5xl px-6 lg:px-10 py-24 text-center">
        <p className="eyebrow">Cat. III — Free premium pack</p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl text-bone leading-tight">
          One premium prompt pack, on the house.
        </h2>
        <p className="mt-4 text-bone/70 max-w-lg mx-auto">
          Leave an email. We'll send our Identity Preservation Starter pack. No sequences, no course
          upsells.
        </p>
        <form onSubmit={submit} className="mt-8 flex flex-col sm:flex-row max-w-md mx-auto gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            maxLength={255}
            className="flex-1 bg-void border hairline px-4 py-3.5 text-bone placeholder:text-bone/30 focus:outline-none focus:border-gold text-sm"
          />
          <button
            type="submit"
            disabled={state === "saving"}
            className="bg-gold text-void px-6 py-3.5 text-xs uppercase tracking-widest font-medium hover:bg-gold/90 disabled:opacity-50 transition-colors"
          >
            {state === "saving" ? "Saving…" : state === "done" ? "Sent" : "Send it"}
          </button>
        </form>
        {err && <p className="mt-3 text-xs text-red-300">{err}</p>}
        {state === "done" && (
          <p className="mt-3 text-xs text-gold inline-flex items-center gap-1 justify-center">
            <Check className="w-3 h-3" /> Check your inbox within the hour.
          </p>
        )}
      </div>
    </section>
  );
}
