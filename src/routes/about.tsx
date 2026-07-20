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
    <article className="mx-auto max-w-7xl px-6 lg:px-10 pt-20 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        {/* Founder photo */}
        <div className="md:col-span-5">
          <div className="border hairline overflow-hidden" style={{ aspectRatio: "4 / 5" }}>
            <img
              src="/founder.jpg"
              alt="Founder portrait — Osman"
              className="w-full h-full object-cover border-none"
            />
          </div>
        </div>

        {/* Headline + intro */}
        <div className="md:col-span-7">
          <p className="eyebrow">About the studio</p>
          <h1 className="mt-4 font-display text-5xl md:text-6xl text-bone leading-tight">
            Crafting Cinematic AI Visuals That Feel Real.
          </h1>
          <p className="mt-6 text-[17px] text-bone/75 leading-relaxed max-w-2xl">
            Osman Visuals is an independent creative studio founded by Muhammad Usman, focused on
            cinematic AI imagery, prompt engineering, and premium visual resources. Every prompt,
            guide, and creative asset is carefully designed to help creators, brands, and
            storytellers produce high quality visuals with consistency and precision.
          </p>

          {/* Credentials strip */}
          <div className="mt-6 flex flex-wrap items-center">
            <span className="eyebrow">BS ARTIFICIAL INTELLIGENCE STUDENT</span>
            <span className="eyebrow pl-4 border-l hairline">FOUNDED 2026</span>
            <span className="eyebrow pl-4 border-l hairline">PREMIUM PROMPTS & RESOURCES</span>
          </div>
        </div>
      </div>

      {/* Bio body */}
      <div className="mt-12 border-t hairline pt-12 space-y-6 text-[17px] text-bone/75 leading-relaxed max-w-3xl">
        <p className="font-display text-2xl text-bone">1. HOW IT STARTED</p>

        <p>
          Osman Visuals began with a simple question: why do AI portraits look impressive, yet
          rarely look consistent?
          <br />
          While studying Artificial Intelligence, I became obsessed with understanding how prompts,
          lighting, composition, camera language, and visual storytelling work together. Every
          experiment became a lesson, every failure became another refinement. Over time, those
          experiments grew into a structured creative system.
        </p>
        <p className="font-display text-2xl text-bone">2. THE APPROACH</p>
        <p>
          One challenge appeared again and again: keeping the same person recognizable across
          different AI generations. Instead of accepting random results, I focused on building
          prompts that preserve identity while allowing complete creative freedom. Every prompt is
          tested, refined, and documented until it produces reliable, cinematic results that
          creators can actually use with confidence.
        </p>
        {/* Pull quote between paragraphs 2 and 3 */}
        <blockquote className="font-display text-2xl text-bone border-l-2 border-gold pl-6">
          ANYONE CAN GENERATE AN IMAGE. FEW CAN BUILD A VISUAL IDENTITY.
        </blockquote>

        <p className="font-display text-2xl text-bone">3. WHY SOME RESOURCES ARE FREE</p>

        <p>
          Knowledge grows when it's shared.
          <br />
          That's why a large part of this library is available free for creators who want to learn
          and improve. Premium packs go several steps further, including complete prompt systems,
          detailed workflows, creator frameworks, commercial resources, and production ready assets
          that save hours of experimentation. Whether you're creating for yourself, your clients, or
          your brand, the goal is always the same: produce visuals that feel intentional, cinematic,
          and unmistakably professional.
        </p>

        <div
          className="mt-6"
          style={{
            width: "180px",
            height: "164px",
            aspectRatio: "1599 / 1454",
            backgroundColor: "var(--gold, #B8965A)",
            WebkitMaskImage: "url('/signature.png')",
            maskImage: "url('/signature.png')",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "left center",
            maskPosition: "left center",
            WebkitMaskComposite: "source-in",
            maskComposite: "source-in",
          }}
          aria-label="Muhammad Usman signature"
          role="img"
        />

        <div className="mt-6">
          <p className="font-display text-lg text-bone">Muhammad Usman</p>
          <p className="text-sm text-gold mt-1">Founder, Osman Visuals</p>
          <p className="text-sm text-bone/60 mt-1">BS Artificial Intelligence Student</p>
          <p className="text-sm text-bone/60 mt-3 max-w-sm">
            Building cinematic AI workflows for creators and brands.
          </p>
        </div>
      </div>
    </article>
  );
}
