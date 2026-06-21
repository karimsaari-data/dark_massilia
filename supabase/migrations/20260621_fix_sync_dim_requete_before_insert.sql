-- 20260621_fix_sync_dim_requete_before_insert.sql
--
-- Contexte : la collecte GSC (scripts/gsc-collect.js) s'est mise à échouer le
-- 2026-06-19 avec :
--   insert or update on table "gsc_daily_queries" violates foreign key
--   constraint "fk_gsc_queries_dim_requete"
--
-- Cause racine : dim_requete est une dimension enrichie (modèle étoile Power BI)
-- référencée par 3 tables de faits (gsc_daily_queries, gsc_daily_page_queries,
-- gsc_weekly_queries) via une FK sur `query`. Un trigger sync_dim_requete était
-- censé y insérer automatiquement les nouvelles requêtes, MAIS il était en
-- AFTER INSERT. Or le trigger système de la FK (RI_ConstraintTrigger_…) se
-- déclenche avant les triggers AFTER utilisateur (ordre alphabétique des noms :
-- « RI_… » < « trg_… »). La FK était donc validée AVANT que la dimension soit
-- alimentée → toute requête non encore classée faisait échouer l'INSERT, et le
-- collecteur s'arrêtait (process.exit(1)), gelant toute la collecte en aval.
--
-- Correctif : passer la synchro en BEFORE INSERT (s'exécute avant la vérif FK)
-- sur les 3 tables de faits, et enrichir mécaniquement la dimension. Les champs
-- sémantiques categorie/intention sont mis à 'non_classe' (sentinelle) pour être
-- reclassés manuellement dans le modèle étoile.

CREATE OR REPLACE FUNCTION public.sync_dim_requete()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.dim_requete
    (query, nb_mots, contient_marque, contient_localisation, categorie, intention)
  VALUES (
    NEW.query,
    array_length(regexp_split_to_array(btrim(NEW.query), '\s+'), 1),
    (NEW.query ILIKE '%massilia%' OR NEW.query ILIKE '%karim saari%'),
    (NEW.query ILIKE '%marseille%' OR NEW.query ILIKE '%calanque%'
      OR NEW.query ILIKE '%cassis%' OR NEW.query ILIKE '%méditerran%'),
    'non_classe',
    'non_classe'
  )
  ON CONFLICT (query) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_dim_requete ON public.gsc_daily_queries;
CREATE TRIGGER trg_sync_dim_requete
  BEFORE INSERT ON public.gsc_daily_queries
  FOR EACH ROW EXECUTE FUNCTION public.sync_dim_requete();

DROP TRIGGER IF EXISTS trg_sync_dim_requete ON public.gsc_daily_page_queries;
CREATE TRIGGER trg_sync_dim_requete
  BEFORE INSERT ON public.gsc_daily_page_queries
  FOR EACH ROW EXECUTE FUNCTION public.sync_dim_requete();

DROP TRIGGER IF EXISTS trg_sync_dim_requete ON public.gsc_weekly_queries;
CREATE TRIGGER trg_sync_dim_requete
  BEFORE INSERT ON public.gsc_weekly_queries
  FOR EACH ROW EXECUTE FUNCTION public.sync_dim_requete();
