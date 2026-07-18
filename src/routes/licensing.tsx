import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/licensing")({
  head: () => ({
    meta: [
      { title: "Licensing — Osman Visuals" },
      { name: "description", content: "How you can use the prompts, packs, and outputs you buy from Osman Visuals." },
      { property: "og:title", content: "Licensing — Osman Visuals" },
      { property: "og:description", content: "How you can use the prompts, packs, and outputs you buy from Osman Visuals." },
      { property: "og:url", content: "/licensing" },
    ],
    links: [{ rel: "canonical", href: "/licensing" }],
  }),
  component: Licensing,
});

function Licensing() {
  return (
    <article className="mx-auto max-w-2xl px-6 lg:px-10 pt-20 pb-24 text-bone/80">
      <p className="eyebrow">Terms</p>
      <h1 className="mt-4 font-display text-5xl text-bone leading-tight">Prompt licensing</h1>
      <div className="mt-10 border-t hairline pt-10 space-y-5 leading-relaxed">
        <p>Prompts and packs are licensed to a single working creator. You may use them across as many client projects as you like.</p>
        <p><span className="text-bone font-medium">Commercial outputs.</span> Images you generate using our prompts are yours. You can sell them, publish them, and use them in paid commercial work.</p>
        <p><span className="text-bone font-medium">Redistribution.</span> You may not resell, repost, or re-package the prompt text itself. The output is yours; the recipe stays with us.</p>
        <p><span className="text-bone font-medium">Teams.</span> For studios or teams above three people, buy one seat per active creator.</p>
        <p>Questions about a specific use — get in touch.</p>
      </div>
    </article>
  );
}