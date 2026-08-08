import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Heart, X, ChevronDown } from "lucide-react"; 
import { supabase } from "@/integrations/supabase/client";
import type { Prompt } from "@/components/PromptCard";
import { SearchBar } from "@/components/SearchBar";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Favorites | Osman Visuals" },
      { name: "description", content: "Your personal collection of saved visual prompts." },
    ],
  }),
  component: Favorites,
});

function galleryImage(p: Prompt): string | null {
  if (p.preview_image_urls && p.preview_image_urls.length > 0) {
    return p.preview_image_urls[0];
  }
  return p.preview_image_url;
}

function Favorites() {
  const navigate = useNavigate();
const { isSignedIn } = useAuth();
const [isReady, setIsReady] = useState(false);

// 1 second ka safety delay taake auth check ho jaye
useEffect(() => {
  const timer = setTimeout(() => setIsReady(true), 500); 
  return () => clearTimeout(timer);
}, []);

useEffect(() => {
  if (!isReady) return; // Jab tak timer khatam na ho, redirect mat karo

  if (isSignedIn === false) {
    const returnUrl = encodeURIComponent(window.location.pathname);
    window.location.href = `/unlock?next=${returnUrl}`;
  }
}, [isSignedIn, isReady]);
  
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [favoritedIds, setFavoritedIds] = useState<string[]>([]);
  const [active, setActive] = useState<Prompt | null>(null);

  // Search & Filter States
  const [activeSearch, setActiveSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("favorites");
      if (saved) {
        setFavoritedIds(JSON.parse(saved));
      }
    }
  }, []);

  const { data: prompts, isLoading } = useQuery({
    queryKey: ["prompts", "favorites"],
    queryFn: async () => {
      const { data, error } = await supabase.from("prompts").select("*");
      if (error) throw error;
      return (data ?? []) as unknown as Prompt[];
    },
  });

  const removeFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoritedIds((prev) => {
      const updated = prev.filter((favId) => favId !== id);
      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  };

  function viewPrompt(p: Prompt) {
    setActive(null);
    navigate({ to: "/library", search: { open: p.slug } });
  }

  // 1. Sirf favorited images filter karein
  const favoriteImages = (prompts ?? []).filter(
    (p) => favoritedIds.includes(p.id) && Boolean(galleryImage(p))
  );

  // 2. Un favorites par search aur category filters apply karein
  const filteredImages = favoriteImages.filter((p) => {
    if (catFilter !== "All") {
      if (!p.categories || !p.categories.includes(catFilter)) return false;
    }
    const term = activeSearch.trim().toLowerCase();
    if (!term) return true;
    const inTitle = p.title.toLowerCase().includes(term);
    const inTags = Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(term));
    const inCats = Array.isArray(p.categories) && p.categories.some((c) => c.toLowerCase().includes(term));
    return inTitle || inTags || inCats;
  });

  // Is block ko filteredImages ke neechay add karein
  const sortedImages = [...filteredImages].sort((a, b) => {
    if (sortOrder === "a-z") return a.title.localeCompare(b.title);
    if (sortOrder === "z-a") return b.title.localeCompare(a.title);
    
    // Agar dates hain toh:
    const dateA = new Date(a.created_at || 0).getTime();
    const dateB = new Date(b.created_at || 0).getTime();
    
    if (sortOrder === "oldest") return dateA - dateB;
    return dateB - dateA; // Default "newest"
  });

  const suggestionSource = favoriteImages.flatMap((p) => [
    p.title,
    ...(p.tags ?? []),
    ...(p.categories ?? []),
  ]);
  
  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "a-z", label: "A to Z" },
    { value: "z-a", label: "Z to A" },
  ];
  
  return (
    <>
      <section className="border-b hairline">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-20 pb-12">
          <p className="eyebrow">Your Collection</p>
          <h1 className="mt-4 font-display text-5xl md:text-6xl text-bone leading-tight">
            Saved Favorites.
          </h1>
          <p className="mt-4 text-bone/70 max-w-xl">
            Here is your curated collection of inspiring visuals. When you are ready to create, 
            unlock the prompts and bring these ideas to life.
          </p>

          {/* SearchBar UI - Only show if user has at least one favorite */}
          {favoriteImages.length > 0 && (
            <div className="mt-8 flex justify-start lg:justify-center">
              <SearchBar
                suggestionSource={suggestionSource}
                onSubmit={(term) => setActiveSearch(term)}
                onCategorySelect={(c) => setCatFilter(c)}
              />
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-12">
        {/* Gallery-style Header with Filter Tags & Result Count */}
        {/* PREMIUM HEADER SECTION WITH CUSTOM DROPDOWN */}
        {favoriteImages.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b hairline pb-4">
            <div>
              <p className="eyebrow">Favorites View</p>
              <h2 className="font-display text-2xl md:text-3xl text-bone mt-1 flex items-center gap-3">
                <span>{catFilter}</span>
                {activeSearch && (
                  <span className="text-gold text-base font-sans font-normal opacity-90">
                    — Search: "{activeSearch}"
                  </span>
                )}
              </h2>
              <p className="text-sm text-bone/60 mt-2 font-medium tracking-wide">
                Showing {sortedImages.length} {sortedImages.length === 1 ? "image" : "images"}
              </p>
            </div>

            <div className="flex items-center gap-4">
              
              {/* Premium Custom Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-2 bg-surface/50 backdrop-blur-sm border border-bone/20 text-bone text-xs uppercase tracking-widest px-4 py-2 rounded-full outline-none hover:border-gold/60 transition-colors"
                >
                  <span>{sortOptions.find(o => o.value === sortOrder)?.label}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isSortOpen ? "rotate-180 text-gold" : "text-bone/60"}`} />
                </button>

                {/* Dropdown Menu */}
                {isSortOpen && (
                  <>
                    {/* Invisible Backdrop to close dropdown when clicking outside */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsSortOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-44 bg-void border hairline rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortOrder(option.value);
                            setIsSortOpen(false); // Select karne ke baad band kardo
                          }}
                          className={`w-full text-left px-4 py-3 text-[10px] sm:text-xs uppercase tracking-widest transition-colors ${
                            sortOrder === option.value
                              ? "bg-gold/10 text-gold font-bold"
                              : "text-bone/70 hover:bg-surface hover:text-bone"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Clear Filter Button - Sirf Search/Category ke liye */}
              {(catFilter !== "All" || activeSearch) && (
                <button
                  onClick={() => {
                    setCatFilter("All");
                    setActiveSearch("");
                  }}
                  className="text-xs uppercase tracking-widest text-gold hover:text-bone border border-gold/30 hover:border-gold px-3.5 py-1.5 rounded-full transition-all bg-gold/5 hover:bg-gold/10"
                >
                  Clear ×
                </button>
              )}
            </div>
          </div>
        )}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-surface border hairline aspect-[4/5] animate-pulse rounded-md" />
            ))}
          </div>
        ) : favoriteImages.length === 0 ? (
          
          /* 
            UPDATED EMPTY STATE
            Background removed, borders removed, premium button added.
          */
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-3">
              Empty Collection
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-bone mb-3">
              You haven't liked any images yet!
            </h2>
            <p className="text-base text-bone/60 max-w-xl mx-auto mb-8 leading-relaxed">
              A private collection of the work you choose to keep. Tap the heart on any image in Gallery to add it to your favorites.
            </p>
            <Link
              to="/gallery"
              className="inline-flex items-center justify-center gap-2 bg-gold text-void px-8 py-3 text-sm uppercase tracking-widest font-medium hover:bg-gold/90 transition-all rounded-full hover:scale-105 shadow-lg shadow-gold/10"
            >
              Explore Gallery
            </Link>
          </div>

        ) : sortedImages.length === 0 ? (
          
          /* State when search/filter returns 0 results but user HAS favorites */
          <div className="border hairline bg-surface py-24 text-center rounded-md">
            <p className="eyebrow">No matches found</p>
            <p className="mt-3 font-display text-2xl text-bone">
              Nothing matches your search.
            </p>
            <p className="mt-2 text-sm text-bone/60">
              Try changing the category or clearing the search term.
            </p>
          </div>

        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedImages.map((p) => (
              <button
                key={p.id}
                onClick={() => setActive(p)}
                className="relative block w-full aspect-[4/5] border hairline overflow-hidden group cursor-pointer"
                aria-label={`View ${p.title}`}
              >
                <img
                  src={galleryImage(p)!}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                />

                <span
                  className={`absolute top-2 right-2 text-[9px] sm:text-[10px] uppercase tracking-widest px-1.5 py-0.5 sm:px-2 sm:py-1 bg-on-photo-chip backdrop-blur-sm border hairline z-20 ${
                    p.is_premium ? "text-on-photo-gold" : "text-on-photo-text/80"
                  }`}
                >
                  {p.is_premium ? "Exclusive" : "Free"}
                </span>

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

                <div className="absolute bottom-0 left-0 right-14 p-3 sm:p-4 transform translate-y-0 lg:translate-y-2 lg:group-hover:translate-y-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500 ease-out flex flex-col gap-1 z-20 items-start">
                  <span className="text-left text-sx sm:text-base text-on-photo-text font-medium leading-tight line-clamp-2 drop-shadow-md">
                    {p.title}
                  </span>

                  <a
                    href="https://instagram.com/osmanvisuals"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[10px] tracking-wider font-body text-on-photo-gold hover:text-on-photo-text hover:underline pointer-events-auto"
                  >
                    @osmanvisuals
                  </a>
                </div>

                <div
                  onClick={(e) => removeFavorite(p.id, e)}
                  className="absolute bottom-3 right-3 z-30 p-2 rounded-full bg-transparent hover:bg-white/20 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 ease-out cursor-pointer flex items-center justify-center"
                  aria-label="Remove from favorites"
                >
                  <Heart className="w-5 h-5 transition-all duration-300 fill-red-500 text-red-500 stroke-red-500 scale-110 hover:scale-125" />
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* FLOATING MODAL WITH PREVIEW BACKDROP */}
      {active && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-300"
          onClick={() => setActive(null)}
        >
          <div className="flex min-h-full items-center justify-center p-3 sm:p-6 my-auto">
            <div
              className="relative w-full max-w-4xl my-auto rounded-2xl overflow-hidden bg-void border hairline shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <button
                onClick={() => setActive(null)}
                className="absolute top-3 right-3 z-[60] w-8 h-8 flex items-center justify-center rounded-md border hairline bg-void/80 backdrop-blur-md hover:bg-surface text-bone transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid w-full lg:grid-cols-2 bg-void overflow-hidden">
                <div className="aspect-[4/5] w-full bg-black relative flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r hairline">
                  <img
                    src={galleryImage(active)!}
                    alt={active.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="h-full w-full px-6 py-8 max-h-[60vh] lg:max-h-none overflow-y-auto flex flex-col bg-surface">
                  <h2 className="font-display text-2xl md:text-3xl text-bone leading-tight">
                    {active.title}
                  </h2>

                  {active.categories && active.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {active.categories.map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            setActive(null);
                            navigate({ to: "/library", search: { category: c } });
                          }}
                          className="text-[10px] uppercase tracking-widest text-stone-700 dark:text-bone/60 border border-stone-300 hover:bg-gold/10 hover:text-gold hover:border-gold/30 transition-colors cursor-pointer dark:border-bone/20 px-1.5 py-0.5 font-medium"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="mt-6">
                    <p className="eyebrow mb-2">About this piece</p>
                    {active.description ? (
                      <p className="text-sm text-bone/70 leading-relaxed">{active.description}</p>
                    ) : (
                      <p className="text-sm text-bone/40 italic">
                        No description available for this piece.
                      </p>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => {
                        if (active.is_premium && !isSignedIn) {
                          const returnUrl = encodeURIComponent(`/library?open=${active.slug}`);
                          window.location.href = `/unlock?next=${returnUrl}`;
                          return;
                        }
                        viewPrompt(active);
                      }}
                      className="inline-flex items-center justify-center gap-2 bg-gold text-void px-6 py-3 text-xs uppercase tracking-widest font-medium hover:bg-gold/90 transition-colors rounded-full"
                    >
                      View Full Prompt
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}