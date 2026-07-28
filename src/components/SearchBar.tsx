import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";

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
  suggestionSource: string[];
  onSubmit: (term: string) => void;
  onCategorySelect: (category: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [lastSubmitted, setLastSubmitted] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

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
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto my-6">
      {/* Search Input Bar (Centered, Rounded, Premium Look) */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(term);
        }}
        className="relative flex items-center bg-surface border hairline rounded-full shadow-lg p-1.5 focus-within:border-gold transition-all duration-300"
      >
        <Search className="w-5 h-5 ml-3.5 text-bone/40 shrink-0" />
        
        <input
          ref={inputRef}
          type="search"
          value={term}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setTerm(e.target.value);
            if (!open) setOpen(true);
          }}
          placeholder={placeholder}
          maxLength={100}
          className="w-full bg-transparent px-3 py-2 text-sm text-bone placeholder:text-bone/40 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />

        {/* Clear Button */}
        {term && (
          <button
            type="button"
            onClick={() => setTerm("")}
            aria-label="Clear search"
            className="p-1 text-bone/40 hover:text-bone mr-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Premium Search Button at the End */}
        <button
          type="submit"
          className="bg-gold hover:bg-gold/90 text-void font-semibold text-xs tracking-wider uppercase px-5 py-2.5 rounded-full transition-all duration-300 shrink-0 flex items-center gap-1.5 shadow-md"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search</span>
        </button>
      </form>

      {/* Dropdown Window (Positioned directly under the search bar) */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-3 z-50 bg-surface border hairline rounded-2xl shadow-2xl p-5 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
          {term ? (
            <div>
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
                <p className="text-sm text-bone/40 py-2">
                  Press Enter or click Search for "{term}"
                </p>
              )}
            </div>
          ) : (
            <div>
              <p className="eyebrow mb-3">Categories</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                {CATEGORY_THUMBS.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => selectCategory(c.label)}
                    className="flex flex-col items-center gap-1.5 group text-center"
                  >
                    <span className="w-12 h-12 border hairline rounded-xl overflow-hidden group-hover:border-gold transition-colors">
                      <img
                        src={THUMB_BASE + c.file}
                        alt={c.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </span>
                    <span className="text-[10px] text-bone/70 leading-tight group-hover:text-gold transition-colors line-clamp-2">
                      {c.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}