import { createFileRoute } from "@tanstack/react-router";
import { LifeBuoy } from "lucide-react";

export const Route = createFileRoute("/help")({
  head: () => ({ meta: [{ title: "Help & Support | Osman Visuals" }] }),
  component: HelpPage,
});

function HelpPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-20 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold border border-gold/30 mb-4">
        <LifeBuoy className="w-5 h-5" />
      </div>
      <p className="eyebrow">Your Studio</p>
      <h1 className="mt-3 font-display text-3xl md:text-4xl text-bone">Help &amp; Support</h1>
      <p className="mt-4 text-sm text-bone/60 max-w-md mx-auto">
        FAQs, contact options, and bug reporting will be available here soon.
      </p>
    </section>
  );
}