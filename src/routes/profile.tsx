import { createFileRoute } from "@tanstack/react-router";
import { User } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [{ title: "Profile | Osman Visuals" }],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-20 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold border border-gold/30 mb-4">
        <User className="w-5 h-5" />
      </div>
      <p className="eyebrow">Your Studio</p>
      <h1 className="mt-3 font-display text-3xl md:text-4xl text-bone">Profile</h1>
      <p className="mt-4 text-sm text-bone/60 max-w-md mx-auto">
        Your profile page is being built — saved prompts, favorites, and activity will live here
        soon.
      </p>
    </section>
  );
}