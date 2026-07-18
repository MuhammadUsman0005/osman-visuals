
-- prompts
CREATE TABLE public.prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL,
  prompt_text text NOT NULL,
  preview_image_url text,
  is_premium boolean NOT NULL DEFAULT false,
  pdf_url text,
  tags text[] NOT NULL DEFAULT '{}',
  catalog_number text NOT NULL,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.prompts TO anon, authenticated;
GRANT ALL ON public.prompts TO service_role;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Prompts are viewable by everyone" ON public.prompts FOR SELECT USING (true);

-- resources
CREATE TABLE public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('pdf','prompt_pack','asset','reference_image')),
  file_url text,
  preview_image_url text,
  is_premium boolean NOT NULL DEFAULT false,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.resources TO anon, authenticated;
GRANT ALL ON public.resources TO service_role;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Resources are viewable by everyone" ON public.resources FOR SELECT USING (true);

-- guides
CREATE TABLE public.guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  cover_image_url text,
  body text NOT NULL,
  category text NOT NULL CHECK (category IN ('prompting_tutorial','identity_preservation','tools_guide')),
  read_time int NOT NULL DEFAULT 5,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.guides TO anon, authenticated;
GRANT ALL ON public.guides TO service_role;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guides are viewable by everyone" ON public.guides FOR SELECT USING (true);

-- leads
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  source text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.leads TO anon, authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a lead" ON public.leads FOR INSERT WITH CHECK (true);

-- contact_messages
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a contact message" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Seed prompts
INSERT INTO public.prompts (title, slug, category, prompt_text, is_premium, tags, catalog_number, featured) VALUES
('Editorial Rain Portrait','editorial-rain-portrait','Portrait','Cinematic editorial portrait of [SUBJECT], soft rain, wet pavement reflections, moody neutral palette, 85mm lens, shallow depth of field, Kodak Portra 400 grain, natural window light from camera left, unretouched skin texture, calm expression, shot in the style of a Zara editorial.', false, ARRAY['editorial','portrait','film'], 'No. 001', true),
('Golden Hour Character Study','golden-hour-character-study','Portrait','Warm golden hour portrait of [SUBJECT], backlit rim light through tall grass, medium format film aesthetic, faded highlights, natural freckles retained, honest expression, composition slightly off-center left, 6x7 aspect ratio.', false, ARRAY['portrait','golden-hour','film'], 'No. 002', true),
('Identity Lock — Base Reference','identity-lock-base-reference','Identity Preservation','Reference portrait of [SUBJECT] for identity preservation seed. Neutral gray backdrop, even flat lighting, direct gaze, closed mouth, no accessories, no makeup, hair pulled back, 50mm lens, sharp focus on both eyes. Use as anchor image for all downstream generations.', true, ARRAY['identity','reference','workflow'], 'No. 003', true),
('Multi-Angle Identity Sheet','multi-angle-identity-sheet','Identity Preservation','Character sheet of [SUBJECT]: five head angles — front, three-quarter left, profile left, three-quarter right, profile right. Consistent lighting, consistent skin tone, consistent hair length. Neutral background. Used to lock facial geometry across a series.', true, ARRAY['identity','character-sheet'], 'No. 004', true),
('Concrete Brutalist Fashion','concrete-brutalist-fashion','Fashion','Full-body fashion image of [SUBJECT] against raw concrete architecture, harsh midday sun, hard shadows, oversized tailored wool coat, matte finish, muted stone palette, 35mm lens, subject centered, brutalist geometry framing the shoulders.', false, ARRAY['fashion','architecture','editorial'], 'No. 005', false),
('Analog Studio Beauty','analog-studio-beauty','Beauty','Close-up beauty shot of [SUBJECT], single softbox key light from above, black seamless backdrop, oiled skin highlights, no makeup, medium format detail, natural pores visible, styled like a 1990s Vogue Italia editorial.', false, ARRAY['beauty','studio'], 'No. 006', false),
('Nocturne Street','nocturne-street','Street','Nighttime street portrait of [SUBJECT] under a single sodium streetlight, wet asphalt, distant neon bokeh, 35mm lens, film grain, subject looking back toward camera, quiet composition, no crowd.', false, ARRAY['street','night','film'], 'No. 007', false),
('Wardrobe Continuity Pack','wardrobe-continuity-pack','Identity Preservation','Series prompt for [SUBJECT] wearing the same outfit across five environments: studio, cafe, rooftop, gallery, transit. Preserve exact garment cut, fabric texture, color, and accessories. Vary only environment and light. Keep hair and face identical.', true, ARRAY['identity','wardrobe','series'], 'No. 008', false),
('Documentary Available Light','documentary-available-light','Documentary','Candid documentary portrait of [SUBJECT] in their working environment, only available light, no fill, honest color, 50mm, wide aperture, subject unaware of camera, composed with negative space to the right.', false, ARRAY['documentary','available-light'], 'No. 009', false),
('Editorial Cover Composite','editorial-cover-composite','Editorial','Magazine cover composition of [SUBJECT], vertical 4:5, generous headroom for masthead, soft studio light, direct gaze, restrained styling, muted background so cover type reads cleanly.', true, ARRAY['cover','editorial','composition'], 'No. 010', false),
('Cinematic Wide Environmental','cinematic-wide-environmental','Cinematic','Wide environmental portrait of [SUBJECT] within a large architectural space, anamorphic 2.39:1, subject small in frame, cool teal-and-bone palette, single practical light source, meditative pacing.', false, ARRAY['cinematic','wide','environment'], 'No. 011', false),
('Series Continuity Guide','series-continuity-guide','Identity Preservation','Prompt template for producing a 12-image series of [SUBJECT] with locked facial identity, consistent hair, consistent skin quality, and consistent color grade. Variables: pose, wardrobe, environment. Constants: face, grade, grain.', true, ARRAY['identity','series','template'], 'No. 012', false);

-- Seed resources
INSERT INTO public.resources (title, type, is_premium, description) VALUES
('Identity Preservation Master Pack','prompt_pack', true, '24 prompts and a full workflow PDF for locking a subject''s identity across an entire shoot.'),
('Editorial Portrait Vol. I','prompt_pack', true, '18 editorial portrait prompts with lighting notes and lens recommendations.'),
('Free Starter Pack','prompt_pack', false, 'Six of our most-used portrait prompts, no email required.'),
('Cinematic Color Grading Guide','pdf', true, 'A 32-page PDF on grading AI outputs to match filmic references.'),
('Reference Sheet — Studio Lighting','reference_image', false, 'Diagrams of the ten lighting setups we return to most often.'),
('Wardrobe Continuity Templates','asset', true, 'Editable prompt templates for wardrobe continuity across a series.');

-- Seed guides
INSERT INTO public.guides (slug, title, body, category, read_time, featured) VALUES
('identity-preservation-fundamentals','Identity preservation, from first principles',
E'Identity preservation is the hardest problem in generative portraiture. This guide walks through the workflow we use at Osman Visuals.\n\n## Start with a reference plate\n\nBefore you generate anything for a series, produce a single, deliberately boring reference image of your subject: flat light, gray backdrop, neutral expression, no accessories. This is your anchor.\n\n## Lock the seed\n\nEvery downstream generation references the same seed image and the same identity prompt fragment. Only environment, wardrobe, and pose change.\n\n## Audit at the eyes\n\nWhen a series drifts, the eyes drift first. Compare eye spacing, iris color, and lid shape between frames. If those match, the rest usually holds.\n\n## Regenerate, do not retouch\n\nIf a frame breaks identity, regenerate it against the anchor. Do not fix it in post — the fix will not survive the next round.', 'identity_preservation', 8, true),
('a-prompt-is-a-brief','A prompt is a brief, not a spell',
E'Treat every prompt like a one-paragraph creative brief written for a photographer who has never met your subject.\n\nName the subject. Name the light. Name the lens. Name the film stock or the reference. Name what you do not want.\n\nThe best prompts read like production notes, not incantations.', 'prompting_tutorial', 4, false),
('the-tools-we-actually-use','The tools we actually use',
E'A short, honest list of the generation tools, upscalers, and grading apps we run every week — and the ones we tried and stopped using.\n\nWe update this guide roughly once a quarter.', 'tools_guide', 6, false),
('lighting-language-for-prompts','A working vocabulary for describing light',
E'"Cinematic lighting" tells the model nothing. This guide gives you thirty specific lighting descriptions — key direction, quality, source, and color — that produce predictable results.', 'prompting_tutorial', 7, false);
