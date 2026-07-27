import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/licensing")({
  head: () => ({
    meta: [
      { title: "Licensing Agreement — Osman Visuals" },
      {
        name: "description",
        content:
          "Detailed licensing terms for prompts, packs, and creative outputs from Osman Visuals.",
      },
      { property: "og:title", content: "Licensing Agreement — Osman Visuals" },
      {
        property: "og:description",
        content:
          "Detailed licensing terms for prompts, packs, and creative outputs from Osman Visuals.",
      },
      { property: "og:url", content: "/licensing" },
    ],
    links: [{ rel: "canonical", href: "/licensing" }],
  }),
  component: Licensing,
});

function Licensing() {
  return (
    <article className="mx-auto max-w-3xl px-6 lg:px-10 pt-20 pb-24 text-bone/80">
      <p className="eyebrow">Terms & Policies</p>
      <h1 className="mt-4 font-display text-4xl md:text-5xl text-bone leading-tight">
        Licensing Agreement
      </h1>
      <p className="mt-4 text-sm text-bone/50">Last Updated: July 2026</p>

      <div className="mt-10 border-t hairline pt-10 space-y-10 text-[15px] md:text-base leading-relaxed">
        {/* Intro */}
        <div className="space-y-4">
          <p>Thank you for choosing Osman Visuals.</p>
          <p>
            This Licensing Agreement explains how our digital products may be used after purchase.
            By downloading or purchasing any resource from Osman Visuals, you agree to the terms
            below.
          </p>
        </div>

        {/* Our Philosophy */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">Our Philosophy</h2>
          <p className="mb-4">
            Osman Visuals exists to help creators build extraordinary AI generated artwork through
            carefully crafted prompts, educational resources, and creative workflows. When you
            purchase a product, you are purchasing a license to use the content, not ownership of
            the content itself.
          </p>
          <p className="font-medium text-bone">
            All prompts, prompt packs, PDFs, templates, graphics, educational materials, and digital
            assets remain the intellectual property of Osman Visuals.
          </p>
        </section>

        {/* Personal License */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">Personal License</h2>
          <p className="mb-2">
            Every purchase includes a Personal License, unless another license is explicitly stated.
            With a Personal License, you may:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-1.5 marker:text-gold/50">
            <li>Use prompts for unlimited personal projects.</li>
            <li>Generate AI images for yourself.</li>
            <li>Modify prompts to fit your own workflow.</li>
            <li>Learn from our educational resources.</li>
            <li>Store downloaded files on your personal devices.</li>
          </ul>
        </section>

        {/* Commercial Use */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">Commercial Use</h2>
          <p className="mb-2">Unless a product specifically states otherwise, you may also:</p>
          <ul className="list-disc pl-5 mb-4 space-y-1.5 marker:text-gold/50">
            <li>Use generated AI images in commercial projects.</li>
            <li>Create client work using our prompts.</li>
            <li>Use generated images on social media.</li>
            <li>Include generated images in marketing campaigns.</li>
            <li>Use generated images in YouTube videos.</li>
            <li>Use generated images on websites.</li>
            <li>Use generated images in presentations.</li>
            <li>
              Sell products that contain your original AI generated artwork, provided the final work
              is your own creative output.
            </li>
          </ul>
        </section>

        {/* What You May NOT Do */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">What You May NOT Do</h2>
          <p className="mb-2 text-bone/60">To protect our work and customers, you may not:</p>
          <ul className="list-disc pl-5 mb-4 space-y-1.5 marker:text-gold/50">
            <li>Resell our prompts.</li>
            <li>Redistribute prompt packs.</li>
            <li>Share download links.</li>
            <li>Upload purchased products to public websites.</li>
            <li>Upload products to prompt marketplaces.</li>
            <li>Include our prompts inside another prompt collection.</li>
            <li>Claim our prompts as your own.</li>
            <li>
              Give purchased files to friends, clients, or team members without additional licenses.
            </li>
            <li>Copy large portions of our educational content.</li>
            <li>Remove copyright notices.</li>
            <li>Repackage our products under another brand.</li>
          </ul>
        </section>

        {/* Team & Business Use */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">Team & Business Use</h2>
          <p>
            If multiple people inside a company need access to the same product, each user should
            have their own license unless a Team or Enterprise License is offered. One purchase is
            intended for one user only.
          </p>
        </section>

        {/* AI Generated Results */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">AI Generated Results</h2>
          <p>
            Our prompts are designed to produce professional quality AI images. However, AI
            platforms continuously evolve. Because of differences between AI models, updates,
            settings, and reference images, identical results cannot be guaranteed. Your creative
            decisions remain an important part of the final output.
          </p>
        </section>

        {/* Ownership */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">Ownership</h2>
          <p className="mb-2">
            Purchasing a product does not transfer ownership. Osman Visuals retains full ownership
            of:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-1.5 marker:text-gold/50 grid grid-cols-2 sm:grid-cols-3">
            <li>Prompt Packs</li>
            <li>Prompt Templates</li>
            <li>Educational PDFs</li>
            <li>Workflow Guides</li>
            <li>Reference Materials</li>
            <li>Website Content</li>
            <li>Graphics</li>
            <li>Branding</li>
            <li>Articles</li>
            <li>Tutorials</li>
          </ul>
          <p className="font-medium text-bone mt-2">
            Only the usage rights described in this agreement are granted.
          </p>
        </section>

        {/* Free Resources */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">Free Resources</h2>
          <p className="mb-2">
            Free downloads remain protected by copyright. You may use them according to their stated
            license, but you may not:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-1.5 marker:text-gold/50">
            <li>Reupload them elsewhere.</li>
            <li>Sell them.</li>
            <li>Redistribute them.</li>
            <li>Remove branding or copyright notices.</li>
          </ul>
        </section>

        {/* Premium Resources */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">Premium Resources</h2>
          <p>
            Premium products include additional educational value, advanced prompt engineering, and
            exclusive content. Access is granted only to the purchaser. Sharing premium downloads or
            providing unauthorized access violates this agreement.
          </p>
        </section>

        {/* License Violations */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">License Violations</h2>
          <p className="mb-2">
            If we determine that our products have been redistributed, copied, resold, or used in
            violation of this license, we reserve the right to:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-1.5 marker:text-gold/50">
            <li>Suspend user accounts.</li>
            <li>Revoke download access.</li>
            <li>Remove future access to purchased products.</li>
            <li>Take appropriate legal action where necessary.</li>
          </ul>
        </section>

        {/* Contact */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">Contact</h2>
          <p className="mb-6">
            We're happy to answer any licensing or commercial usage questions. Feel free to{" "}
            <Link
              to="/contact"
              className="text-gold font-medium hover:underline hover:text-gold/80 transition-colors"
            >
              contact
            </Link>{" "}
            us anytime.
          </p>

          {/* Contact Card */}
          <div className="bg-surface border hairline p-6 inline-block w-full sm:w-auto">
            <p className="font-display text-xl text-bone mb-4">Osman Visuals</p>
            <div className="space-y-4 text-sm">
              {/* Email */}
              <div className="flex flex-col space-y-1">
                <span className="text-bone/50 uppercase tracking-widest text-[11px]">Email</span>
                <a
                  href="mailto:usman.artificial552@gmail.com"
                  className="text-bone hover:text-gold transition-colors break-all"
                >
                  usman.artificial552@gmail.com
                </a>
              </div>

              {/* Website */}
              <div className="flex flex-col space-y-1">
                <span className="text-bone/50 uppercase tracking-widest text-[11px]">Website</span>
                <a
                  href="https://osman-visuals.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bone hover:text-gold transition-colors break-all"
                >
                  https://osman-visuals.vercel.app
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
