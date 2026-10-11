
CREATE TABLE public.works (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  caption TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.works TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.works TO authenticated;
GRANT ALL ON public.works TO service_role;
ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;
CREATE POLICY "works public read" ON public.works FOR SELECT USING (true);
CREATE POLICY "works auth write" ON public.works FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.shop_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  caption TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.shop_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shop_items TO authenticated;
GRANT ALL ON public.shop_items TO service_role;
ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shop public read" ON public.shop_items FOR SELECT USING (true);
CREATE POLICY "shop auth write" ON public.shop_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER works_set_updated_at BEFORE UPDATE ON public.works
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER shop_set_updated_at BEFORE UPDATE ON public.shop_items
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
