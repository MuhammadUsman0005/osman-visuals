import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";

export const Route = createFileRoute("/account/settings")({
  head: () => ({
    meta: [{ title: "Account Settings | Osman Visuals" }],
  }),
  component: AccountSettingsPage,
});

function AccountSettingsPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-20 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold border border-gold/30 mb-4">
        <Settings className="w-5 h-5" />
      </div>
      <p className="eyebrow">Your Studio</p>
      <h1 className="mt-3 font-display text-3xl md:text-4xl text-bone">Account Settings</h1>
      <p className="mt-4 text-sm text-bone/60 max-w-md mx-auto">
        Email, password, and connected sign-in methods will be manageable here soon.
      </p>
    </section>
  );
}