import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Check } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { AccountGate } from "@/components/AccountGate";

const BENEFITS = [
  "Access the exclusive prompt library",
  "Unlock premium Gallery images",
  "Save favorite prompts (coming soon)",
  "Faster access across your devices",
  "First access to future premium features",
];

export const Route = createFileRoute("/unlock")({
  validateSearch: (search: Record<string, unknown>): { next?: string } => ({
    next: typeof search.next === "string" ? search.next : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Unlock Exclusive Prompts | Osman Visuals" },
      {
        name: "description",
        content: "Create a free account to unlock the exclusive prompt archive.",
      },
    ],
  }),
  component: Unlock,
});

function Unlock() {
  const { next } = Route.useSearch();
  const { isSignedIn, loading } = useAuth();
  const destination = next && next.startsWith("/") ? next : "/library";

  useEffect(() => {
    if (!loading && isSignedIn) {
      window.location.replace(destination);
    }
  }, [loading, isSignedIn, destination]);

  return (
    <section className="min-h-[85vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center">
          <p className="eyebrow">Osman Visuals — Members</p>
          <h1 className="mt-4 font-display text-4xl md:text-5xl text-bone leading-tight">
            Unlock Exclusive Prompts
          </h1>
          <p className="mt-4 text-sm text-bone/70 leading-relaxed">
            A free account is all it takes to preview premium prompts and access exclusive resources
            as they're added.
          </p>
        </div>

        <ul className="mt-8 space-y-2.5">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-sm text-bone/80">
              <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              {b}
            </li>
          ))}
        </ul>

        <div className="mt-8 border hairline bg-surface p-6">
          <AccountGate next={destination} />
        </div>

        <p className="mt-6 text-center text-xs text-bone/40">
          Already have an account? Use the same option above to sign in.
        </p>

        <p className="mt-8 text-center">
          <Link to="/library" className="text-xs text-bone/40 hover:text-bone/70">
            ← Back to the Vault
          </Link>
        </p>
      </div>
    </section>
  );
}