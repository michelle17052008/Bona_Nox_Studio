-- Remove stale unconfirmed user with typo email
DELETE FROM auth.users WHERE email = 'bonanox.studio.@outlook.com';

-- Contact / custom-order messages table
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'contact',
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  handled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can submit a message"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(name) BETWEEN 1 AND 100
    AND length(email) BETWEEN 3 AND 255
    AND length(message) BETWEEN 1 AND 2000
    AND type IN ('contact','custom_order')
  );

CREATE POLICY "authenticated can read messages"
  ON public.contact_messages FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "authenticated can update messages"
  ON public.contact_messages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated can delete messages"
  ON public.contact_messages FOR DELETE
  TO authenticated USING (true);