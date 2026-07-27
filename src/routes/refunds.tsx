import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/refunds")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Osman Visuals" },
      {
        name: "description",
        content:
          "The Osman Visuals privacy policy. How we collect, use, store, and protect your information.",
      },
      { property: "og:title", content: "Privacy Policy — Osman Visuals" },
      {
        property: "og:description",
        content:
          "The Osman Visuals privacy policy. How we collect, use, store, and protect your information.",
      },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <article className="mx-auto max-w-3xl px-6 lg:px-10 pt-20 pb-24 text-bone/80">
      <p className="eyebrow">Terms & Policies</p>
      <h1 className="mt-4 font-display text-4xl md:text-5xl text-bone leading-tight">
        Privacy Policy
      </h1>
      <p className="mt-4 text-sm text-bone/50">Last Updated: July 2026</p>

      <div className="mt-10 border-t hairline pt-10 space-y-10 text-[15px] md:text-base leading-relaxed">
        {/* Intro */}
        <div className="space-y-4">
          <p>Welcome to Osman Visuals.</p>
          <p>
            Your privacy matters to us. This Privacy Policy explains how we collect, use, store, and
            protect your information when you visit our website, browse our gallery, access The
            Vault, purchase digital products, or use any services provided by Osman Visuals.
          </p>
          <p>By using this website, you agree to the practices described in this Privacy Policy.</p>
        </div>

        {/* 1. Information We Collect */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">1. Information We Collect</h2>
          <p className="mb-4">We may collect the following types of information:</p>

          <h3 className="text-bone font-medium mb-2">Personal Information</h3>
          <p className="mb-2">When you voluntarily interact with our website, you may provide:</p>
          <ul className="list-disc pl-5 mb-6 space-y-1.5 marker:text-gold/50">
            <li>Full name</li>
            <li>Email address</li>
            <li>Billing information</li>
            <li>Payment details (processed securely by third party payment providers)</li>
            <li>Account information</li>
            <li>Messages sent through contact forms</li>
          </ul>
          <p className="mb-6 italic text-bone/60">
            We never ask for unnecessary personal information.
          </p>

          <h3 className="text-bone font-medium mb-2">Automatically Collected Information</h3>
          <p className="mb-2">
            When you visit our website, certain information may be collected automatically,
            including:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-1.5 marker:text-gold/50">
            <li>IP address</li>
            <li>Browser type</li>
            <li>Device information</li>
            <li>Operating system</li>
            <li>Language preferences</li>
            <li>Pages visited</li>
            <li>Time spent on pages</li>
            <li>Referral source</li>
            <li>Click interactions</li>
            <li>Cookies and similar technologies</li>
          </ul>
          <p>This information helps us improve website performance and user experience.</p>
        </section>

        {/* 2. How We Use Your Information */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">2. How We Use Your Information</h2>
          <p className="mb-2">We use collected information to:</p>
          <ul className="list-disc pl-5 mb-4 space-y-1.5 marker:text-gold/50">
            <li>Deliver digital products and downloads</li>
            <li>Process purchases</li>
            <li>Manage user accounts</li>
            <li>Improve website performance</li>
            <li>Respond to customer inquiries</li>
            <li>Provide technical support</li>
            <li>Prevent fraud and unauthorized access</li>
            <li>Analyze website traffic</li>
            <li>Improve future products and services</li>
            <li>Send important account notifications</li>
            <li>Deliver updates when you have opted in</li>
          </ul>
          <p className="font-medium text-bone">We do not sell your personal information.</p>
        </section>

        {/* 3. Digital Products */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">3. Digital Products</h2>
          <p className="mb-2">Osman Visuals offers digital products including:</p>
          <ul className="list-disc pl-5 mb-4 space-y-1.5 marker:text-gold/50">
            <li>AI Prompt Packs</li>
            <li>Prompt Libraries</li>
            <li>Creative Assets</li>
            <li>PDF Guides</li>
            <li>Templates</li>
            <li>Reference Resources</li>
            <li>Educational Materials</li>
          </ul>
          <p>
            Purchases provide access only to the licensed digital files. No physical products are
            shipped.
          </p>
        </section>

        {/* 4. Payment Information */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">4. Payment Information</h2>
          <p>
            Payments are processed through trusted third party payment providers. We do not store
            your complete credit card or debit card information on our servers. Please refer to the
            privacy policies of the payment provider used during checkout.
          </p>
        </section>

        {/* 5. Cookies */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">5. Cookies</h2>
          <p className="mb-2">We use cookies to:</p>
          <ul className="list-disc pl-5 mb-4 space-y-1.5 marker:text-gold/50">
            <li>Remember user preferences</li>
            <li>Improve website performance</li>
            <li>Analyze visitor behavior</li>
            <li>Secure user sessions</li>
            <li>Enhance browsing experience</li>
          </ul>
          <p>
            You may disable cookies through your browser settings, although some website features
            may not function properly.
          </p>
        </section>

        {/* 6. Analytics */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">6. Analytics</h2>
          <p className="mb-2">
            We may use analytics services to understand how visitors use our website. Collected data
            may include:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-1.5 marker:text-gold/50">
            <li>Popular pages</li>
            <li>User interactions</li>
            <li>Device types</li>
            <li>Geographic regions</li>
            <li>Traffic sources</li>
            <li>Session duration</li>
          </ul>
          <p>Analytics information is used only to improve our website and services.</p>
        </section>

        {/* 7. Account Security */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">7. Account Security</h2>
          <p>
            If you create an account, you are responsible for keeping your login credentials secure.
            Please notify us immediately if you believe your account has been accessed without
            permission.
          </p>
        </section>

        {/* 8. Intellectual Property */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">8. Intellectual Property</h2>
          <p className="mb-4">
            All prompts, prompt packs, PDFs, tutorials, images, graphics, branding, website design,
            educational materials, and other content available on Osman Visuals are protected by
            copyright and intellectual property laws.
          </p>
          <p className="mb-2 font-medium text-bone">
            Purchasing a product grants a personal license to use the purchased material.
          </p>
          <p className="mb-2">You may not:</p>
          <ul className="list-disc pl-5 mb-4 space-y-1.5 marker:text-gold/50">
            <li>Redistribute</li>
            <li>Resell</li>
            <li>Upload to other websites</li>
            <li>Share download links</li>
            <li>Claim our work as your own</li>
            <li>
              Include our products inside another commercial prompt library without written
              permission
            </li>
          </ul>
        </section>

        {/* 9. AI Generated Images */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">9. AI Generated Images</h2>
          <p>
            Many images displayed throughout Osman Visuals are created using advanced AI image
            generation models together with original prompt engineering, creative direction,
            editing, and artistic workflows. These images are presented for educational, portfolio,
            and demonstration purposes.
          </p>
        </section>

        {/* 10. Third Party Services */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">10. Third Party Services</h2>
          <p className="mb-2">
            Our website may include services provided by trusted third parties such as:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-1.5 marker:text-gold/50">
            <li>Payment processors</li>
            <li>Website hosting</li>
            <li>Analytics providers</li>
            <li>Authentication services</li>
            <li>Email delivery platforms</li>
            <li>Cloud storage providers</li>
          </ul>
          <p>Each provider maintains its own privacy practices.</p>
        </section>

        {/* 11. External Links */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">11. External Links</h2>
          <p>
            Our website may contain links to external websites. We are not responsible for the
            privacy practices or content of websites operated by third parties.
          </p>
        </section>

        {/* 12. Data Security */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">12. Data Security</h2>
          <p>
            We implement reasonable technical and organizational measures to help protect your
            information from unauthorized access, alteration, disclosure, or destruction. While we
            strive to protect your data, no method of internet transmission or electronic storage is
            completely secure.
          </p>
        </section>

        {/* 13. Children's Privacy */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">13. Children's Privacy</h2>
          <p>
            Osman Visuals is not intended for children under the age of 13. We do not knowingly
            collect personal information from children. If we become aware that information from a
            child has been collected, we will remove it as soon as reasonably possible.
          </p>
        </section>

        {/* 14. Your Rights */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">14. Your Rights</h2>
          <p className="mb-2">Depending on your location, you may have the right to:</p>
          <ul className="list-disc pl-5 mb-4 space-y-1.5 marker:text-gold/50">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent where applicable</li>
            <li>Request a copy of your information</li>
            <li>Object to certain types of data processing</li>
          </ul>
          <p>To exercise these rights, please contact us using the information below.</p>
        </section>

        {/* 15. Policy Updates */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">15. Policy Updates</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes become effective
            immediately after being published on this page. The "Last Updated" date will always
            reflect the latest revision.
          </p>
        </section>

        {/* 16. Contact */}
        <section>
          <h2 className="font-display text-2xl text-bone mb-4">16. Contact</h2>
          <p className="mb-6">
            If you have any questions about this Privacy Policy, your personal data, or how your
            information is handled, feel free to{" "}
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
