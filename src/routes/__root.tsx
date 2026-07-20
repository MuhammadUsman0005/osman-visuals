import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { MobileNav } from "../components/MobileNav";
import { Instagram } from "lucide-react";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 bg-void">
      <div className="max-w-md text-center">
        <p className="eyebrow">No. 404</p>
        <h1 className="mt-4 text-5xl font-display text-bone">Nothing filed here</h1>
        <p className="mt-3 text-sm text-bone/60">
          This page isn't in the archive. Try the library instead.
        </p>
        <Link
          to="/library"
          className="mt-6 inline-flex items-center border-b border-gold pb-0.5 text-sm text-bone hover:text-gold transition-colors"
        >
          Browse the library
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-void px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">Error</p>
        <h1 className="mt-3 text-3xl font-display text-bone">This page didn't load</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center bg-gold px-5 py-2.5 text-sm font-medium text-void transition-colors hover:bg-gold/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center border border-gold-hairline bg-transparent px-5 py-2.5 text-sm font-medium text-bone transition-colors hover:border-gold"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Osman Visuals — Identity-consistent AI imagery" },
      {
        name: "description",
        content:
          "A curated archive of AI prompts, packs, and guides for photographers who need identity-consistent cinematic imagery.",
      },
      { name: "author", content: "Osman Visuals" },
      { property: "og:title", content: "Osman Visuals — Identity-consistent AI imagery" },
      {
        property: "og:description",
        content:
          "A curated archive of AI prompts, packs, and guides for photographers who need identity-consistent cinematic imagery.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Osman Visuals" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SiteChrome>
        <Outlet />
      </SiteChrome>
    </QueryClientProvider>
  );
}

function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-void text-bone">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  const links = [
    { to: "/library", label: "The Vault" },
    { to: "/resources", label: "Resources" },
    { to: "/guides", label: "Guides" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ] as const;
  return (
    <header className="border-b hairline bg-void/80 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-2 group">
          <span className="font-display text-xl tracking-tight text-bone group-hover:text-gold transition-colors">
            Osman Visuals
          </span>
          <span className="eyebrow hidden sm:inline">THE STUDIO</span>
        </Link>
        <MobileNav links={links} />
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-24 border-t hairline bg-void">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-2xl text-bone">Osman Visuals</p>
          <p className="mt-3 text-sm text-bone/60 max-w-sm">
            Crafting cinematic AI visuals, premium prompts, and creative resources. For creators,
            brands, and storytellers worldwide.
          </p>

          <div className="mt-4 flex items-center gap-4">
            <a
              href="https://instagram.com/osmanvisuals"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold hover:text-bone transition-colors"
              aria-label="Osman Visuals on Instagram"
            >
              <Instagram size={16} />
              <span>Instagram</span>
            </a>

            <a
              href="https://pin.it/5tCtnMSGL"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold hover:text-bone transition-colors"
              aria-label="Osman Visuals on Pinterest"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
                className="w-4 h-4"
              >
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.171-2.911 1.023 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.995-.283 1.194.6 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.365 18.592 0 11.985 0h.032z" />
              </svg>
              <span>Pinterest</span>
            </a>
          </div>
        </div>
        <div>
          <p className="eyebrow mb-3">Explore</p>
          <ul className="space-y-2 text-sm text-bone/70">
            <li>
              <Link to="/library" className="hover:text-gold">
                The Vault
              </Link>
            </li>
            <li>
              <Link to="/resources" className="hover:text-gold">
                Resources
              </Link>
            </li>
            <li>
              <Link to="/guides" className="hover:text-gold">
                Guides
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-3">Studio</p>
          <ul className="space-y-2 text-sm text-bone/70">
            <li>
              <Link to="/about" className="hover:text-gold">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-gold">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/licensing" className="hover:text-gold">
                Licensing
              </Link>
            </li>
            <li>
              <Link to="/refunds" className="hover:text-gold">
                Refund policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t hairline">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-5 flex items-center justify-between text-xs text-bone/50">
          <span>© {new Date().getFullYear()} Osman Visuals. All rights reserved.</span>
          <span className="eyebrow">Cat. MMXXVI</span>
        </div>
      </div>
    </footer>
  );
}
