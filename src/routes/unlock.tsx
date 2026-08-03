import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { AccountGate } from "@/components/AccountGate";

const SLIDE_TEXTS = [
  {
    eyebrow: "WELCOME TO OSMAN VISUALS",
    heading: "Where premium prompts become extraordinary images.",
    paragraph:
      "A carefully curated archive of cinematic prompts, professional workflows, and creative resources built for artists who demand exceptional quality.",
  },
  {
    eyebrow: "CHARACTER CONSISTENCY",
    heading: "The same identity. Every scene.",
    paragraph:
      "Create portraits, fashion campaigns, action sequences, and cinematic worlds while preserving the exact same character from image to image.",
  },
  {
    eyebrow: "CREATIVE SYSTEM",
    heading: "Built for professionals.",
    paragraph:
      "Go beyond prompting with expert guides, lighting techniques, camera language, reference workflows, and production ready creative resources.",
  },
  {
    eyebrow: "YOUR CREATIVE VAULT",
    heading: "Unlock your complete toolkit.",
    paragraph:
      "Preview premium prompt packs, save your favorites, sync your library across devices, and get early access to every new release.",
  },
];

const BENEFITS = [
  "Access the exclusive prompt library",
  "Unlock premium Gallery images",
  "Save your favorite prompts",
  "Sync your library across all your devices",
  "Get early access to new releases",
];

// Yahan apni 12 images ke paths set kar diye gaye hain
const SHOWCASE_IMAGES = [
  "/public/images/plate-01.jpg",
  "/public/images/plate-02.jpg",
  "/public/images/plate-04.webp",
  "/public/images/plate-07.jpg",
  "/public/images/plate-10.jpg",
  "/public/images/plate-06.webp",
  "/public/images/plate-08.jpg",
  "/public/images/plate-05.webp",
  "/public/images/plate-09.jpg",
  "/public/images/plate-12.jpg",
  "/public/images/plate-03.webp",
  "/public/images/plate-13.jpg",
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

  // Slideshow ke liye state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auth redirect effect
  useEffect(() => {
    if (!loading && isSignedIn) {
      window.location.replace(destination);
    }
  }, [loading, isSignedIn, destination]);

  // Slideshow timer effect (Har 5 second baad image change hogi)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === SHOWCASE_IMAGES.length - 1 ? 0 : prevIndex + 1,
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // ERROR FIXED 1: Yahan 'return' keyword lagaya gaya hay aur Grid wrapper add kiya hay
  return (
    <div className="grid lg:grid-cols-2 min-h-screen bg-void w-full">
      {/* --- LEFT SIDE: SLIDESHOW IMAGES & ANIMATED TEXT --- */}
      {/* --- LEFT SIDE: SLIDESHOW IMAGES & ANIMATED TEXT --- */}
      {/* Change 1: 'h-screen sticky top-0' add kiya hay taake ye apni jagah fixed rahay aur scroll na ho */}
      <div className="relative hidden lg:block h-screen sticky top-0 overflow-hidden bg-surface">
        {/* Images Loop */}
        {SHOWCASE_IMAGES.map((img, index) => (
          <img
            key={img}
            src={img}
            alt={`Showcase ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Change 2: Gradient wali line yahan se completely DELETE kar di hay taake purana look wapas aa jaye */}
        {/* Dark Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent pointer-events-none" />

        {/* Animated Poster Content / Text */}
        <div className="absolute bottom-16 left-12 right-12 z-10 pointer-events-none">
          <div className="relative min-h-[160px] flex flex-col justify-end">
            {SLIDE_TEXTS.map((slide, index) => {
              const currentTextIndex = Math.floor(currentImageIndex / 3);
              const isActive = index === currentTextIndex;

              return (
                <div
                  key={index}
                  className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-in-out ${
                    isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                >
                  <p className="inline-block bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-gold/30 text-[10px] uppercase tracking-widest text-gold mb-4 font-bold shadow-lg">
                    {slide.eyebrow}
                  </p>
                  <h2 className="text-4xl font-display text-bone leading-tight text-balance">
                    {slide.heading}
                  </h2>
                  <p className="mt-4 text-bone/70 text-sm max-w-md leading-relaxed">
                    {slide.paragraph}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Slideshow Indicators (12 Dots) */}
          <div className="mt-10 flex items-center gap-4">
            {SHOWCASE_IMAGES.map((_, index) => (
              <div
                key={index}
                className={`h-0.5 rounded-full transition-all duration-500 ${
                  index === currentImageIndex ? "w-12 bg-bone" : "w-6 bg-bone/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: NORMAL SCROLLABLE CONTENT --- */}
      <div className="flex min-h-screen items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md py-12 text-center">
          {/* Centered Logo */}
          <Link to="/" className="flex justify-center w-full mb-8 group no-underline">
            <div className="border-l-2 border-gold/30 pl-4 py-1 text-left group-hover:border-gold transition-colors duration-300">
              <span className="font-display text-2xl tracking-tighter text-bone group-hover:text-gold transition-colors duration-300">
                <span className="font-bold">Osman </span>
                <span className="font-light opacity-80">Visuals</span>
              </span>
              <p className="text-xs text-bone/50 tracking-wider -mt-1 font-light">Studio access</p>
            </div>
          </Link>

          {/* Heading */}
          <h1 className="font-display text-3xl md:text-4xl text-bone leading-tight text-center">
            Create Your Account
          </h1>

          {/* Centered Subtitle Paragraph */}
          <p className="mt-4 text-sm text-bone/70 leading-relaxed text-center max-w-sm mx-auto">
            Create your free account to unlock premium prompts, exclusive visuals, downloadable
            resources, and future releases.
          </p>

          {/* Perfectly Centered Checklist Container */}
          <div className="mt-8 flex justify-center">
            <ul className="space-y-3 text-left w-fit">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-center gap-3 text-sm text-bone/80">
                  <Check className="w-4 h-4 text-gold shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Google / Auth Button Container */}
          <div className="mt-10">
            <AccountGate next={destination} />
          </div>

          {/* Footer Terms */}
          <p className="mt-6 text-center text-xs text-bone/40">
            By continuing, you agree to Osman Visuals's{" "}
            <Link to="/terms" className="underline hover:text-gold">
              Terms of Use
            </Link>{" "}
            and {/* ERROR FIXED 4: /refunds ki jagah /privacy kar diya hay */}
            <Link to="/refunds" className="underline hover:text-gold">
              Privacy Policy
            </Link>
            .
          </p>

          <p className="mt-8 text-center">
            <Link
              to="/library"
              className="text-xs text-bone/40 hover:text-bone/70 transition-colors"
            >
              ← Back to the Vault
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
