-- 20260621_fix_sync_dim_page_pays_appareil_before_insert.sql
--
-- Suite directe de 20260621_fix_sync_dim_requete_before_insert.sql.
-- Même cause racine (FK validée AVANT alimentation de la dimension), mais cette
-- fois sur dim_page / dim_pays / dim_appareil, qui n'avaient AUCUN trigger de
-- synchro. Le symptôme n'apparaissait que lorsqu'une valeur neuve surgissait :
-- le backfill a planté sur gsc_daily_pages (2026-06-17, page inédite) avec
--   insert or update on table "gsc_daily_pages" violates foreign key
--   constraint "fk_gsc_pages_dim_page"
--
-- Correctif : triggers BEFORE INSERT qui peuplent la dimension à la volée.
--  - dim_page    : page_id + slug dérivé du chemin ; type_page garde son défaut
--                  'autre' (sentinelle à reclasser dans le modèle étoile).
--  - dim_pays    : code ISO ; nom_fr laissé NULL (sentinelle).
--  - dim_appareil: valeur GSC brute (DESKTOP/MOBILE/TABLET).
-- Couvre les 4 tables de faits GSC concernées (gsc_daily_pages,
-- gsc_daily_page_queries, gsc_daily_countries, gsc_daily_devices).

CREATE OR REPLACE FUNCTION public.sync_dim_page()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.dim_page (page_id, slug)
  VALUES (
    NEW.page,
    NULLIF(regexp_replace(regexp_replace(NEW.page, '^https?://[^/]+', ''), '^/', ''), '')
  )
  ON CONFLICT (page_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_dim_pays()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.dim_pays (code) VALUES (NEW.country)
  ON CONFLICT (code) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_dim_appareil()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.dim_appareil (appareil) VALUES (NEW.device)
  ON CONFLICT (appareil) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_dim_page ON public.gsc_daily_pages;
CREATE TRIGGER trg_sync_dim_page
  BEFORE INSERT ON public.gsc_daily_pages
  FOR EACH ROW EXECUTE FUNCTION public.sync_dim_page();

DROP TRIGGER IF EXISTS trg_sync_dim_page ON public.gsc_daily_page_queries;
CREATE TRIGGER trg_sync_dim_page
  BEFORE INSERT ON public.gsc_daily_page_queries
  FOR EACH ROW EXECUTE FUNCTION public.sync_dim_page();

DROP TRIGGER IF EXISTS trg_sync_dim_pays ON public.gsc_daily_countries;
CREATE TRIGGER trg_sync_dim_pays
  BEFORE INSERT ON public.gsc_daily_countries
  FOR EACH ROW EXECUTE FUNCTION public.sync_dim_pays();

DROP TRIGGER IF EXISTS trg_sync_dim_appareil ON public.gsc_daily_devices;
CREATE TRIGGER trg_sync_dim_appareil
  BEFORE INSERT ON public.gsc_daily_devices
  FOR EACH ROW EXECUTE FUNCTION public.sync_dim_appareil();
