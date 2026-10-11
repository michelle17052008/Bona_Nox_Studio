ALTER TABLE public.contact_messages
  ADD COLUMN status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'in_progress', 'done', 'sent')),
  ADD COLUMN email_status text NOT NULL DEFAULT 'pending'
    CHECK (email_status IN ('pending', 'sent', 'failed')),
  ADD COLUMN email_sent_at timestamptz,
  ADD COLUMN email_error text
    CHECK (email_error IS NULL OR length(email_error) <= 500);

UPDATE public.contact_messages
SET status = 'done'
WHERE handled = true AND status = 'new';

DROP POLICY IF EXISTS "anyone can submit a message" ON public.contact_messages;
CREATE POLICY "anyone can submit a message"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(name) BETWEEN 1 AND 100
    AND length(email) BETWEEN 3 AND 255
    AND length(message) BETWEEN 1 AND 2000
    AND type IN ('contact', 'custom_order')
    AND handled = false
    AND status = 'new'
    AND email_status = 'pending'
    AND email_sent_at IS NULL
    AND email_error IS NULL
  );