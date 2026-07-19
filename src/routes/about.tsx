import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Osman Visuals" },
      {
        name: "description",
        content:
          "Why identity preservation. Who's behind Osman Visuals, and what problem this archive solves.",
      },
      { property: "og:title", content: "About — Osman Visuals" },
      {
        property: "og:description",
        content:
          "Why identity preservation. Who's behind Osman Visuals, and what problem this archive solves.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <article className="mx-auto max-w-3xl px-6 lg:px-10 pt-20 pb-24">
      <p className="eyebrow">About the studio</p>
      <h1 className="mt-4 font-display text-5xl md:text-6xl text-bone leading-tight">
        I built Osman Visuals because the same face kept slipping.
      </h1>
      <div className="mt-12 border-t hairline pt-12 space-y-6 text-[17px] text-bone/75 leading-relaxed">
        <p>
          I'm Osman. I've been a working photographer for a decade — mostly editorial, some fashion,
          a lot of portraiture. When generative models became usable, the promise was obvious: I
          could sketch entire campaigns before a single shoot. What I couldn't do was keep the
          subject consistent.
        </p>
        <p>
          Frame one looked like her. Frame two looked like her cousin. Frame three looked like
          nobody in particular. That's fine for concept art. It's useless for a series.
        </p>
        <p>
          So I built a working method: reference plates, locked seeds, identity fragments that
          travel with every prompt in a shoot. Over eighteen months it became a small archive. Osman
          Visuals is that archive, made public.
        </p>
        <p>
          Free prompts are the day-to-day tools I still use. Premium packs are the workflows I'd
          charge a studio for. The guides show the reasoning behind both.
        </p>
        <p className="text-bone">
          If your work depends on a specific face — a model, a client, a character — this is for
          you.
        </p>
      </div>
    </article>
  );
}
