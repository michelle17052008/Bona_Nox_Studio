CREATE OR REPLACE FUNCTION public.is_site_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() = '3880a55a-8269-4a0a-abc2-760853b740ad'::uuid;
$$;

REVOKE ALL ON FUNCTION public.is_site_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_site_admin() TO authenticated;

UPDATE public.works
SET category = 'insignias'
WHERE category = 'branding';

UPDATE public.shop_items
SET category = 'insignias'
WHERE category = 'branding';

UPDATE public.works
SET caption = replace(replace(caption, 'Branding', 'Insignia'), 'branding', 'insignia')
WHERE caption ILIKE '%branding%';

UPDATE public.shop_items
SET caption = replace(replace(caption, 'Branding', 'Insignia'), 'branding', 'insignia')
WHERE caption ILIKE '%branding%';

DROP POLICY IF EXISTS "works auth write" ON public.works;
DROP POLICY IF EXISTS "works admin write" ON public.works;
CREATE POLICY "works admin write"
  ON public.works FOR ALL
  TO authenticated
  USING (public.is_site_admin())
  WITH CHECK (public.is_site_admin());

DROP POLICY IF EXISTS "shop auth write" ON public.shop_items;
DROP POLICY IF EXISTS "shop admin write" ON public.shop_items;
CREATE POLICY "shop admin write"
  ON public.shop_items FOR ALL
  TO authenticated
  USING (public.is_site_admin())
  WITH CHECK (public.is_site_admin());

DROP POLICY IF EXISTS "authenticated can read messages" ON public.contact_messages;
DROP POLICY IF EXISTS "authenticated can update messages" ON public.contact_messages;
DROP POLICY IF EXISTS "authenticated can delete messages" ON public.contact_messages;
DROP POLICY IF EXISTS "admin can read messages" ON public.contact_messages;
DROP POLICY IF EXISTS "admin can update messages" ON public.contact_messages;
DROP POLICY IF EXISTS "admin can delete messages" ON public.contact_messages;

CREATE POLICY "admin can read messages"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (public.is_site_admin());

CREATE POLICY "admin can update messages"
  ON public.contact_messages FOR UPDATE
  TO authenticated
  USING (public.is_site_admin())
  WITH CHECK (public.is_site_admin());

CREATE POLICY "admin can delete messages"
  ON public.contact_messages FOR DELETE
  TO authenticated
  USING (public.is_site_admin());

DROP POLICY IF EXISTS "media authenticated full" ON storage.objects;
DROP POLICY IF EXISTS "media admin insert" ON storage.objects;
DROP POLICY IF EXISTS "media admin update" ON storage.objects;
DROP POLICY IF EXISTS "media admin delete" ON storage.objects;

CREATE POLICY "media admin insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.is_site_admin());

CREATE POLICY "media admin update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'media' AND public.is_site_admin())
  WITH CHECK (bucket_id = 'media' AND public.is_site_admin());

CREATE POLICY "media admin delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'media' AND public.is_site_admin());