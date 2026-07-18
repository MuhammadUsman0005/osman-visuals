import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths = [
          { path: "/", changefreq: "weekly" as const, priority: "1.0" },
          { path: "/library", changefreq: "weekly" as const, priority: "0.9" },
          { path: "/resources", changefreq: "weekly" as const, priority: "0.8" },
          { path: "/guides", changefreq: "weekly" as const, priority: "0.8" },
          { path: "/about", changefreq: "monthly" as const, priority: "0.5" },
          { path: "/contact", changefreq: "monthly" as const, priority: "0.5" },
          { path: "/licensing", changefreq: "yearly" as const, priority: "0.3" },
          { path: "/refunds", changefreq: "yearly" as const, priority: "0.3" },
        ];

        const { data: guides } = await supabase.from("guides").select("slug");

        const guidePaths =
          guides?.map((g) => ({
            path: `/guides/${g.slug}`,
            changefreq: "monthly" as const,
            priority: "0.6",
          })) ?? [];

        const urls = [...staticPaths, ...guidePaths]
          .map(
            (e) =>
              `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
          )
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});