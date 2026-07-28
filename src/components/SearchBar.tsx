import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";

// Category thumbnails live in the public "category-thumbs" Supabase bucket.
// File names must match exactly (lowercase, hyphenated).
const THUMB_BASE =
  "https://dixabllfqgytqhvujhdq.supabase.co/storage/v1/object/public/category-thumbs/";

const CATEGORY_THUMBS = [
  { label: "Cinematic Portraits", file: "cinematic-portraits.webp" },
  { label: "Character Consistency", file: "character-consistency.webp" },
  { label: "Luxury Fashion", file: "luxury-fashion.webp" },
  { label: "Concept Art", file: "concept-art.webp" },
  { label: "Cyberpunk", file: "cyberpunk.webp" },
  { label: "Fantasy Worlds", file: "fantasy-worlds.webp" },
  { label: "Product Visualization", file: "product-visualization.webp" },
  { label: "Branding & Marketing", file: "branding-marketing.webp" },
  { label: "Technology", file: "technology.webp" },
  { label: "Architecture & Interior", file: "architecture-interior.webp" },
  { label: "Public Figures", file: "public-figures.webp" },
];

export function SearchBar({
  placeholder = "Search titles, prompts, tags…",
  suggestionSource,
  onSubmit,
  onCategorySelect,
}: {
  placeholder?: string;
  // Flat list of searchable strings (titles, tags, categories) to derive
  // live suggestions from as the visitor types.
  suggestionSource: string[];
  onSubmit: (term: string) => void;
  onCategorySelect: (category: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [lastSubmitted, setLastSubmitted] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const suggestions = useMemo(() => {
    const t = term.trim().toLowerCase();
    if (!t) return [];
    const unique = Array.from(new Set(suggestionSource.filter(Boolean)));
    return unique.filter((s) => s.toLowerCase().includes(t)).slice(0, 6);
  }, [term, suggestionSource]);

  function submit(value: string) {
    setLastSubmitted(value);
    setTerm(value);
    setOpen(false);
    onSubmit(value);
  }

  function selectCategory(label: string) {
    setLastSubmitted("");
    setTerm("");
    setOpen(false);
    onCategorySelect(label);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative w-full max-w-md flex items-center bg-surface border hairline pl-10 pr-10 py-3 text-left"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bone/40" />
        <span className={`text-sm truncate ${lastSubmitted ? "text-bone" : "text-bone/30"}`}>
          {lastSubmitted || placeholder}
        </span>
        {lastSubmitted && (
          <span
            role="button"
            tabIndex={0}
            aria-label="Clear search"
            onClick={(e) => {
              e.stopPropagation();
              submit("");
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-bone/40 hover:text-bone/70"
          >
            <X className="w-4 h-4" />
          </span>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-void/90 backdrop-blur-sm flex items-start justify-center p-4 py-10 overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-surface border hairline p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(term);
              }}
              className="relative"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bone/40" />
              <input
                ref={inputRef}
                type="search"
                enterKeyHint="search"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder={placeholder}
                maxLength={100}
                className="w-full bg-void border hairline pl-10 pr-10 py-3 text-sm text-bone placeholder:text-bone/30 focus:outline-none focus:border-gold"
              />
              {term && (
                <button
                  type="button"
                  onClick={() => setTerm("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-bone/40 hover:text-bone/70"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {term ? (
              <div className="mt-4">
                {suggestions.length > 0 ? (
                  <ul className="divide-y divide-gold-hairline">
                    {suggestions.map((s) => (
                      <li key={s}>
                        <button
                          onClick={() => submit(s)}
                          className="w-full text-left py-2.5 text-sm text-bone/80 hover:text-gold transition-colors flex items-center gap-2"
                        >
                          <Search className="w-3.5 h-3.5 text-bone/30 shrink-0" />
                          <span className="truncate">{s}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-bone/40 py-3">Press Enter to search "{term}"</p>
                )}
              </div>
            ) : (
              <div className="mt-5">
                <p className="eyebrow mb-3">Categories</p>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {CATEGORY_THUMBS.map((c) => (
                    <button
                      key={c.label}
                      onClick={() => selectCategory(c.label)}
                      className="flex flex-col items-center gap-1.5 group"
                    >
                      <span className="w-12 h-12 sm:w-14 sm:h-14 border hairline overflow-hidden group-hover:border-gold/60 transition-colors">
                        <img
                          src={THUMB_BASE + c.file}
                          alt={c.label}
                          className="w-full h-full object-cover"
                        />
                      </span>
                      <span className="text-[9px] text-bone/60 text-center leading-tight group-hover:text-gold transition-colors line-clamp-2">
                        {c.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
