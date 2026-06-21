-- 20260621_add_unique_slug_blog_posts.sql
--
-- Répare la synchronisation WordPress → Supabase (scripts/sync-wp-to-supabase.mjs),
-- gelée silencieusement depuis le 8 juin 2026.
--
-- Cause : le script fait `upsert(..., { onConflict: 'slug' })`, mais la contrainte
-- UNIQUE sur `slug` avait disparu de blog_posts (seule blog_posts_wp_id_key
-- subsistait). PostgREST renvoyait alors à chaque run :
--   42P10: there is no unique or exclusion constraint matching the ON CONFLICT
--          specification
-- → le script faisait process.exit(1), mais l'étape "Sync WordPress → Supabase"
--   du workflow nightly-build-deploy est en `continue-on-error: true`, donc
--   l'échec passait inaperçu. Résultat : les nouveaux articles WP n'entraient
--   plus dans blog_posts → jamais notifiés aux abonnés.
--
-- slug est l'identifiant public des articles (/blog/{slug}) et la clé utilisée
-- par le notifieur (.eq('slug')) : il DOIT être unique. Aucun doublon en base
-- (vérifié avant migration).
ALTER TABLE public.blog_posts
  ADD CONSTRAINT blog_posts_slug_key UNIQUE (slug);
