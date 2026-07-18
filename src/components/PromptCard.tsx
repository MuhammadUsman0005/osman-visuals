import { useState } from "react";
import { Copy, Check, Lock, Download } from "lucide-react";

export type Prompt = {
  id: string;
  title: string;
  slug: string;
  category: string;
  prompt_text: string;
  preview_image_url: string | null;
  is_premium: boolean;
  pdf_url: string | null;
  tags: string[];
  catalog_number: string;
};

export function PromptCard({
  prompt,
  onUnlock,
}: {
  prompt: Prompt;
  onUnlock: (prompt: Prompt) => void;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (prompt.is_premium) {
      onUnlock(prompt);
      return;
    }
    try {
      await navigator.clipboard.writeText(prompt.prompt_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — no-op, user can select text */
    }
  }

  return (
    <article className="group border hairline bg-surface flex flex-col transition-colors hover:border-gold/60">
      <header className="flex items-center justify-between px-4 pt-4 pb-3 border-b hairline">
        <span className="eyebrow">{prompt.catalog_number}</span>
        <span className="eyebrow text-bone/50">{prompt.category}</span>
      </header>
      <div className="px-4 py-5 flex-1 flex flex-col gap-3">
        <h3 className="font-display text-xl leading-snug text-bone">
          {prompt.title}
        </h3>
        <p className="text-sm text-bone/60 line-clamp-4 leading-relaxed">
          {prompt.prompt_text}
        </p>
        {prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {prompt.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-[10px] uppercase tracking-widest text-bone/50 border hairline px-1.5 py-0.5"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
      <footer className="flex items-stretch border-t hairline">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs uppercase tracking-widest text-bone/80 hover:text-gold hover:bg-gold/5 transition-colors"
        >
          {prompt.is_premium ? (
            <>
              <Lock className="w-3.5 h-3.5" />
              Unlock pack
            </>
          ) : copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy prompt
            </>
          )}
        </button>
        {prompt.pdf_url && !prompt.is_premium && (
          <a
            href={prompt.pdf_url}
            className="flex items-center justify-center gap-2 px-4 py-3 text-xs uppercase tracking-widest text-bone/80 hover:text-gold border-l hairline"
          >
            <Download className="w-3.5 h-3.5" />
            PDF
          </a>
        )}
      </footer>
    </article>
  );
}
