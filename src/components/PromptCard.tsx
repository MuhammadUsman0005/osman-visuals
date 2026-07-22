import { useEffect, useState } from "react";
import { Copy, Check, Lock, LockOpen, Download, Maximize2 } from "lucide-react";
import { onFollowedChange, readFollowed } from "@/lib/instagram-unlock";

export type Prompt = {
  id: string;
  title: string;
  slug: string;
  // array of categories (new column)
  categories: string[];
  // difficulty level (Beginner | Intermediate | Advanced)
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  prompt_text: string;
  preview_image_url: string | null;
  is_premium: boolean;
  pdf_url: string | null;
  // existing tags (may be used for search/legacy)
  tags: string[];
  // new tools array (e.g., ChatGPT, NanoBanana)
  tools: string[];
  // optional multiple preview images (new)
  preview_image_urls?: string[] | null;
  catalog_number: string;
};

export function PromptCard({
  prompt,
  onOpen,
}: {
  prompt: Prompt;
  onOpen: (prompt: Prompt) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    setFollowed(readFollowed());
    return onFollowedChange(() => setFollowed(readFollowed()));
  }, []);

  const unlocked = !prompt.is_premium || followed;

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    const unlocked = !prompt.is_premium || followed;
    if (!unlocked) {
      onOpen(prompt);
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
    <article
      onClick={() => onOpen(prompt)}
      className="group border hairline bg-surface flex flex-col transition-colors hover:border-gold/60 cursor-pointer text-left"
    >
      <header className="flex items-center justify-between px-4 pt-4 pb-3 border-b hairline">
        <span className="eyebrow">
          {prompt.catalog_number} — {prompt.difficulty}
        </span>
        <span className={`eyebrow ${prompt.is_premium ? "text-gold" : "text-bone/50"}`}>
          {prompt.is_premium ? "Exclusive" : "Free"}
        </span>
      </header>
      <div className="px-4 py-5 flex-1 flex flex-col gap-3">
        <h3 className="font-display text-xl leading-snug text-bone">
          {prompt.title}
          {prompt.tools && prompt.tools.length > 0 && (
            <span className="text-sm text-bone/60 font-normal font-body not-italic ml-2">
              ({prompt.tools.join(" · ")})
            </span>
          )}
        </h3>
        <p className="text-sm text-bone/60 line-clamp-4 leading-relaxed">{prompt.prompt_text}</p>
        {prompt.categories && prompt.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {prompt.categories.slice(0, 3).map((c) => (
              <span
                key={c}
                className="text-[10px] uppercase tracking-widest text-bone/50 border hairline px-1.5 py-0.5"
              >
                {c}
              </span>
            ))}
            {prompt.categories.length > 3 && (
              <span className="text-[10px] uppercase tracking-widest text-bone/50 border hairline px-1.5 py-0.5">
                +{prompt.categories.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
      <footer className="flex items-stretch border-t hairline">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs uppercase tracking-widest text-bone/80 hover:text-gold hover:bg-gold/5 transition-colors"
        >
          {unlocked ? (
            copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied
              </>
            ) : (
              <>
                <LockOpen className="w-3.5 h-3.5" />
                Unlocked — copy
              </>
            )
          ) : (
            <>
              <Lock className="w-3.5 h-3.5" />
              Unlock pack
            </>
          )}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen(prompt);
          }}
          className="flex items-center justify-center gap-2 px-4 py-3 text-xs uppercase tracking-widest text-bone/80 hover:text-gold border-l hairline"
          aria-label="Preview prompt"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          Preview
        </button>
        {prompt.pdf_url && !prompt.is_premium && (
          <a
            href={prompt.pdf_url}
            onClick={(e) => e.stopPropagation()}
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
