
CREATE POLICY "media authenticated full" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media');
CREATE POLICY "media public read" ON storage.objects FOR SELECT TO anon
USING (bucket_id = 'media');
