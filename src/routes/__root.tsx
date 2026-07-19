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
    { to: "/library", label: "Library" },
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
          <span className="eyebrow hidden sm:inline">Archive</span>
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

          <a
            href="https://instagram.com/osmanvisuals"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold hover:text-bone transition-colors"
            aria-label="Osman Visuals on Instagram"
          >
            <Instagram size={16} />
            <span>@osmanvisuals</span>
          </a>
        </div>
        <div>
          <p className="eyebrow mb-3">Explore</p>
          <ul className="space-y-2 text-sm text-bone/70">
            <li>
              <Link to="/library" className="hover:text-gold">
                Prompt library
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
          <span>© {new Date().getFullYear()} Osman Visuals</span>
          <span className="eyebrow">Cat. MMXXVI</span>
        </div>
      </div>
    </footer>
  );
}
