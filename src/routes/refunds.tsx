import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/refunds")({
  head: () => ({
    meta: [
      { title: "Refund policy — Osman Visuals" },
      { name: "description", content: "The Osman Visuals refund policy for paid prompt packs and downloadable resources." },
      { property: "og:title", content: "Refund policy — Osman Visuals" },
      { property: "og:description", content: "The Osman Visuals refund policy for paid prompt packs and downloadable resources." },
      { property: "og:url", content: "/refunds" },
    ],
    links: [{ rel: "canonical", href: "/refunds" }],
  }),
  component: Refunds,
});

function Refunds() {
  return (
    <article className="mx-auto max-w-2xl px-6 lg:px-10 pt-20 pb-24 text-bone/80">
      <p className="eyebrow">Terms</p>
      <h1 className="mt-4 font-display text-5xl text-bone leading-tight">Refund policy</h1>
      <div className="mt-10 border-t hairline pt-10 space-y-5 leading-relaxed">
        <p>If a paid pack doesn't work as described, email us within 14 days of purchase and we'll refund it in full, no questions.</p>
        <p>Because packs are digital and delivered instantly, we can't process refunds after 14 days.</p>
        <p>Duplicate or accidental purchases: refunded on request, any time.</p>
      </div>
    </article>
  );
}