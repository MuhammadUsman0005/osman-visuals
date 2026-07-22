
ALTER TABLE public.resources
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS short_description text,
  ADD COLUMN IF NOT EXISTS whats_included text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS file_format text,
  ADD COLUMN IF NOT EXISTS file_size text,
  ADD COLUMN IF NOT EXISTS rating numeric(2,1),
  ADD COLUMN IF NOT EXISTS faqs jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Backfill slug from title where null
UPDATE public.resources
SET slug = lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g'))
WHERE slug IS NULL OR slug = '';

ALTER TABLE public.resources ALTER COLUMN slug SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS resources_slug_unique ON public.resources(slug);
