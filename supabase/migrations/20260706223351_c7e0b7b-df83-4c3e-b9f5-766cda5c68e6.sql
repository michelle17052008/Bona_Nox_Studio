
-- 1. Storage: allow authenticated (admin) to also read media so createSignedUrl works
DROP POLICY IF EXISTS "media public read" ON storage.objects;
CREATE POLICY "media read"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'media');

-- 2. Portfolio category migration: covers/insignias/projects -> new taxonomy
UPDATE public.works SET category = 'posters' WHERE category = 'covers';
UPDATE public.works SET category = 'logotipos' WHERE category = 'insignias';
UPDATE public.works SET category = 'editorial' WHERE category = 'projects';
-- Any unknown category folds into 'posters' as safe default
UPDATE public.works SET category = 'posters'
  WHERE category NOT IN ('posters','carteles','editorial','photomanipulation','logotipos');

-- 3. Shop category migration: resources -> packs
UPDATE public.shop_items SET category = 'packs' WHERE category = 'resources';
UPDATE public.shop_items SET category = 'packs'
  WHERE category NOT IN ('wallpapers','printables','packs');

-- 4. Enable realtime on contact_messages so admin panel gets instant notifications
ALTER TABLE public.contact_messages REPLICA IDENTITY FULL;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'contact_messages'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_messages';
  END IF;
END $$;
