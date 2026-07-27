import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Osman Visuals" },
      {
        name: "description",
        content:
          "Terms & Conditions governing your access to and use of the Osman Visuals website, digital products, and resources.",
      },
      { property: "og:title", content: "Terms & Conditions — Osman Visuals" },
      {
        property: "og:description",
        content:
          "Terms & Conditions governing your access to and use of the Osman Visuals website, digital products, and resources.",
      },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsAndConditions,
});

function TermsAndConditions() {
  return (
    <article className="mx-auto max-w-3xl px-6 lg:px-10 pt-20 pb-24 text-bone/80">
      <p className="eyebrow">Terms & Policies</p>
      <h1 className="mt-4 font-display text-4xl md:text-5xl text-bone leading-tight">
        Terms & Conditions
      </h1>
      <p className="mt-4 text-sm text-bone/50">Last Updated: July 2026</p>

      <div className="mt-10 border-t hairline pt-10 space-y-10 text-[15px] md:text-base leading-relaxed">
        
        {/* Intro */}
        <div className="space-y-4">
          <p>Welcome to Osman Visuals.</p>
          <p>
            These Terms & Conditions govern your access to and use of the Osman Visuals website, 
            including The Vault, digital products, educational resources, prompt libraries, downloads, 
            and all related services. By accessing or using this website, you agree to these Terms & Conditions. 
            If you do not agree, please do not use this website.
          </p>
        </div>

        {/* 1. Acceptance of Terms */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">1. Acceptance of Terms</h2>
          <p>
            By using Osman Visuals, creating an account, downloading resources, or purchasing digital 
            products, you confirm that you have read, understood, and agreed to these Terms & Conditions.
          </p>
        </section>

        {/* 2. About Osman Visuals */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">2. About Osman Visuals</h2>
          <p className="mb-2">Osman Visuals is a digital platform focused on AI creativity and visual design. Our services may include:</p>
          <ul className="list-disc pl-5 mb-4 space-y-1.5 marker:text-gold/50">
            <li>AI Prompt Packs</li>
            <li>Premium Prompt Libraries</li>
            <li>Educational Guides</li>
            <li>PDF Resources</li>
            <li>Creative Assets</li>
            <li>Reference Images</li>
            <li>Templates</li>
            <li>Articles and Tutorials</li>
            <li>Free and Premium Downloads</li>
          </ul>
          <p className="font-medium text-bone">All content is provided in digital form only.</p>
        </section>

        {/* 3. User Accounts */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">3. User Accounts</h2>
          <p className="mb-2">Some features may require an account. You are responsible for:</p>
          <ul className="list-disc pl-5 mb-4 space-y-1.5 marker:text-gold/50">
            <li>Maintaining the confidentiality of your login credentials.</li>
            <li>Keeping your account information accurate.</li>
            <li>All activities performed under your account.</li>
          </ul>
          <p>We reserve the right to suspend or terminate accounts involved in fraud, abuse, or violations of these Terms.</p>
        </section>

        {/* 4. Digital Products */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">4. Digital Products</h2>
          <p>
            All products sold on Osman Visuals are digital. No physical items will be shipped. 
            After successful payment, eligible products become available for download or access 
            according to the product description.
          </p>
        </section>

        {/* 5. License */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">5. License</h2>
          <p className="mb-4">
            Unless otherwise stated, every purchase grants you a personal, non-exclusive, non-transferable license.
          </p>
          
          <h3 className="text-bone font-medium mb-2">You may:</h3>
          <ul className="list-disc pl-5 mb-6 space-y-1.5 marker:text-gold/50">
            <li>Use prompts for personal projects.</li>
            <li>Use prompts in commercial creative work that results in original outputs, where permitted by the product license.</li>
            <li>Modify prompts for your own workflow.</li>
          </ul>

          <h3 className="text-bone font-medium mb-2">You may not:</h3>
          <ul className="list-disc pl-5 mb-6 space-y-1.5 marker:text-gold/50">
            <li>Resell prompts.</li>
            <li>Redistribute prompt packs.</li>
            <li>Upload purchased files to other websites.</li>
            <li>Share download links.</li>
            <li>Include our prompts inside another prompt marketplace.</li>
            <li>Claim our prompts as your own work.</li>
            <li>Remove copyright or ownership notices.</li>
          </ul>
          <p className="italic text-bone/60">Purchasing a product does not transfer ownership of the intellectual property.</p>
        </section>

        {/* 6. Intellectual Property */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">6. Intellectual Property</h2>
          <p className="mb-2">All content on Osman Visuals, including but not limited to:</p>
          <ul className="list-disc pl-5 mb-4 space-y-1.5 marker:text-gold/50 grid grid-cols-2 sm:grid-cols-3">
            <li>Prompt Packs</li>
            <li>PDFs</li>
            <li>Images</li>
            <li>Graphics</li>
            <li>Website Design</li>
            <li>Branding</li>
            <li>Logos</li>
            <li>Icons</li>
            <li>Articles</li>
            <li>Educational Content</li>
            <li>Templates</li>
            <li>Creative Assets</li>
          </ul>
          <p>
            is owned by Osman Visuals or used under appropriate rights and is protected by copyright 
            and intellectual property laws. Unauthorized copying or redistribution is strictly prohibited.
          </p>
        </section>

        {/* 7. AI Generated Content */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">7. AI Generated Content</h2>
          <p>
            Many images displayed on Osman Visuals are created using AI image generation technologies 
            combined with original prompt engineering, editing, creative direction, and post processing. 
            Gallery images are provided for inspiration, education, and portfolio purposes. Because AI 
            models may evolve over time, identical results cannot be guaranteed.
          </p>
        </section>

        {/* 8. Educational Content */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">8. Educational Content</h2>
          <p>
            Guides, tutorials, workflows, and educational materials are intended to help users improve 
            their creative skills. They should not be considered professional legal, financial, or technical advice.
          </p>
        </section>

        {/* 9. Pricing */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">9. Pricing</h2>
          <p>
            Prices may change without prior notice. Changes do not affect completed purchases. 
            Promotions, discounts, and limited time offers may end at any time.
          </p>
        </section>

        {/* 10. Refund Policy */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">10. Refund Policy</h2>
          <p className="mb-2">
            Due to the nature of digital products, all sales are generally final once the product has 
            been delivered or downloaded. However, we may review refund requests in exceptional situations, including:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-1.5 marker:text-gold/50">
            <li>Duplicate purchases.</li>
            <li>Technical issues preventing access.</li>
            <li>Incorrect product delivery.</li>
            <li>Other cases evaluated at our discretion.</li>
          </ul>
          <p className="font-medium text-bone">Refund abuse may result in account restrictions.</p>
        </section>

        {/* 11. Availability */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">11. Availability</h2>
          <p>
            We strive to keep Osman Visuals available at all times. However, we do not guarantee 
            uninterrupted access. Maintenance, updates, technical issues, or circumstances beyond our 
            control may temporarily affect availability.
          </p>
        </section>

        {/* 12. User Conduct */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">12. User Conduct</h2>
          <p className="mb-2">You agree not to:</p>
          <ul className="list-disc pl-5 mb-4 space-y-1.5 marker:text-gold/50">
            <li>Attempt unauthorized access to our systems.</li>
            <li>Interfere with website security.</li>
            <li>Upload malicious software.</li>
            <li>Reverse engineer protected systems.</li>
            <li>Copy or scrape website content without permission.</li>
            <li>Use automated tools to harvest prompts or resources.</li>
            <li>Violate applicable laws while using our services.</li>
          </ul>
        </section>

        {/* 13. Third Party Services */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">13. Third Party Services</h2>
          <p>
            Our website may integrate with trusted third party providers such as payment processors, 
            hosting services, authentication providers, analytics platforms, and cloud services. Your use 
            of those services may also be subject to their respective terms and privacy policies.
          </p>
        </section>

        {/* 14. Limitation of Liability */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">14. Limitation of Liability</h2>
          <p className="mb-2">
            Osman Visuals is provided on an "as available" and "as is" basis. While we strive for 
            accuracy and quality, we do not guarantee that:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-1.5 marker:text-gold/50">
            <li>Every prompt will produce identical results.</li>
            <li>AI platforms will always behave consistently.</li>
            <li>Generated content will meet every user's expectations.</li>
            <li>The website will always operate without interruption.</li>
          </ul>
          <p>
            To the maximum extent permitted by law, Osman Visuals shall not be liable for indirect, 
            incidental, or consequential damages arising from the use of our website or products.
          </p>
        </section>

        {/* 15. Termination */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">15. Termination</h2>
          <p className="mb-2">We reserve the right to suspend or permanently terminate access to users who:</p>
          <ul className="list-disc pl-5 mb-4 space-y-1.5 marker:text-gold/50">
            <li>Violate these Terms.</li>
            <li>Abuse our services.</li>
            <li>Engage in fraud.</li>
            <li>Redistribute our products without authorization.</li>
            <li>Attempt to compromise website security.</li>
          </ul>
          <p className="font-medium text-bone">Termination does not remove existing intellectual property protections.</p>
        </section>

        {/* 16. Changes to These Terms */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">16. Changes to These Terms</h2>
          <p>
            We may update these Terms & Conditions at any time. Continued use of the website after 
            updates constitutes acceptance of the revised Terms. The "Last Updated" date will indicate 
            the latest revision.
          </p>
        </section>

        {/* 17. Contact */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">17. Contact</h2>
          <p className="mb-6">
            If you have any questions about these Terms, your personal data, or how your information 
            is handled, feel free to{" "}
            <Link 
              to="/contact" 
              className="text-gold font-medium hover:underline hover:text-gold/80 transition-colors"
            >
              contact
            </Link>{" "}
            us. We're happy to assist and will respond as soon as possible.
          </p>
          
          {/* Contact Card */}
          <div className="bg-surface border hairline p-6 inline-block w-full sm:w-auto">
            <p className="font-display text-xl text-bone mb-3">Osman Visuals</p>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-bone/50 w-20 inline-block uppercase tracking-widest text-[11px]">Email</span>
                <a 
                  href="mailto:usman.artificial552@gmail.com" 
                  className="hover:text-gold transition-colors"
                >
                  usman.artificial552@gmail.com
                </a>
              </p>
              <p>
                <span className="text-bone/50 w-20 inline-block uppercase tracking-widest text-[11px]">Website</span>
                <a 
                  href="https://osman-visuals.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  https://osman-visuals.vercel.app
                </a>
              </p>
            </div>
          </div>
        </section>

      </div>
    </article>
  );
}