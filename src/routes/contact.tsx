import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Check } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(1, "Add your name.").max(100),
  email: z.string().trim().email("Enter a valid email.").max(255),
  message: z.string().trim().min(1, "Add a message.").max(2000),
});

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Osman Visuals" },
      {
        name: "description",
        content:
          "Reach the Osman Visuals studio. Studio, licensing, and commission enquiries welcome.",
      },
      { property: "og:title", content: "Contact — Osman Visuals" },
      {
        property: "og:description",
        content:
          "Reach the Osman Visuals studio. Studio, licensing, and commission enquiries welcome.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [state, setState] = useState<"idle" | "saving" | "done">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setState("saving");
    const { error } = await supabase.from("contact_messages").insert(parsed.data);
    if (error) {
      setState("idle");
      setErrors({ form: "Couldn't send that just now. Try again in a moment." });
      return;
    }
    setState("done");
  }

  if (state === "done") {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <div className="inline-flex items-center gap-2 text-gold">
          <Check className="w-4 h-4" />
          <span className="eyebrow">Received</span>
        </div>
        <h1 className="mt-4 font-display text-4xl text-bone leading-tight">
          Message sent — we'll reply within 2 business days.
        </h1>
        <p className="mt-4 text-bone/60">
          If it's urgent, note it in the subject line of your reply.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 lg:px-10 pt-20 pb-24">
      <p className="eyebrow">Contact</p>
      <h1 className="mt-4 font-display text-5xl text-bone leading-tight">
        Let's build something remarkable.
      </h1>
      <p className="mt-4 text-bone/70">
        Whether you're looking for custom AI visuals, licensing, creative collaboration, or brand campaigns, we'd love to hear from you.
      </p>

      <form onSubmit={submit} className="mt-12 space-y-6 border-t hairline pt-12">
        <Field label="Name" error={errors.name}>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            maxLength={100}
            required
            className="w-full bg-surface border hairline px-4 py-3 text-bone focus:outline-none focus:border-gold"
          />
        </Field>
        <Field label="Email" error={errors.email}>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            maxLength={255}
            required
            className="w-full bg-surface border hairline px-4 py-3 text-bone focus:outline-none focus:border-gold"
          />
        </Field>
        <Field label="Message" error={errors.message}>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={6}
            maxLength={2000}
            required
            className="w-full bg-surface border hairline px-4 py-3 text-bone focus:outline-none focus:border-gold resize-y"
          />
        </Field>
        {errors.form && <p className="text-sm text-red-300">{errors.form}</p>}
        <button
          type="submit"
          disabled={state === "saving"}
          className="bg-gold text-void px-6 py-3.5 text-xs uppercase tracking-widest font-medium hover:bg-gold/90 disabled:opacity-50 transition-colors"
        >
          {state === "saving" ? "Sending…" : "Send message"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow block mb-2">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-300">{error}</span>}
    </label>
  );
}
