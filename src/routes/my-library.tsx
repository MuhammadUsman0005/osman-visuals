import { createFileRoute } from "@tanstack/react-router";
import { Archive } from "lucide-react";

export const Route = createFileRoute("/my-library")({
  head: () => ({ meta: [{ title: "My Library | Osman Visuals" }] }),
  component: MyLibraryPage,
});

function MyLibraryPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-20 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold border border-gold/30 mb-4">
        <Archive className="w-5 h-5" />
      </div>
      <p className="eyebrow">Your Studio</p>
      <h1 className="mt-3 font-display text-3xl md:text-4xl text-bone">My Library</h1>
      <p className="mt-4 text-sm text-bone/60 max-w-md mx-auto">
        Your personal archive is being built — unlocked prompts, purchased packs, and download
        history will live here soon.
      </p>
    </section>
  );
}