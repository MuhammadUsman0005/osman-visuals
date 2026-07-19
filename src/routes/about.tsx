import { createFileRoute } from "@tanstack/react-router";
import { Instagram } from "lucide-react";

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
      </div>

      {/* Social proof / follow CTA */}
      <div className="mt-8 border-t hairline pt-6">
        <p className="eyebrow text-center">Follow the process</p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <a
            href="https://instagram.com/osmanvisuals"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold hover:text-bone transition-colors"
            aria-label="Osman Visuals on Instagram"
          >
            <Instagram size={16} />
            <span>@osmanvisuals</span>
          </a>

          <a
            href="https://pin.it/5tCtnMSGL"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold hover:text-bone transition-colors"
            aria-label="Osman Visuals on Pinterest"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
              className="w-4 h-4"
            >
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.171-2.911 1.023 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.995-.283 1.194.6 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.365 18.592 0 11.985 0h.032z" />
            </svg>
            <span>@osmanvisuals</span>
          </a>
        </div>
      </div>
    </article>
  );
}
