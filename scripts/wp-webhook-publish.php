<?php
/**
 * WordPress Webhook → GitHub Actions
 *
 * À chaque publication d'article, déclenche le workflow "nightly-build-deploy"
 * via l'API GitHub (repository_dispatch event "wp-article-published").
 *
 * INSTALLATION :
 *   Option A (recommandée) — copier ce fichier dans :
 *     wp-content/mu-plugins/dark-massilia-webhook.php
 *   (les mu-plugins sont chargés automatiquement, sans activation)
 *
 *   Option B — coller le contenu (sans la balise <?php) dans :
 *     wp-content/themes/votre-theme/functions.php
 *
 * CONFIGURATION :
 *   1. Créer un GitHub Personal Access Token (classic) avec la permission "repo"
 *      → https://github.com/settings/tokens/new
 *      → Cocher : repo > workflow (obligatoire pour repository_dispatch)
 *   2. Remplacer les constantes ci-dessous :
 *      - DM_GITHUB_OWNER  : votre pseudo GitHub (ex: "karimsaari")
 *      - DM_GITHUB_REPO   : nom du dépôt (ex: "dark-massilia-react")
 *      - DM_GITHUB_TOKEN  : le token généré à l'étape 1
 */

define( 'DM_GITHUB_OWNER', 'VOTRE_PSEUDO_GITHUB' );   // ← à remplir
define( 'DM_GITHUB_REPO',  'dark-massilia-react' );    // ← à vérifier
define( 'DM_GITHUB_TOKEN', 'ghp_VOTRE_TOKEN_ICI' );    // ← à remplir

/**
 * Déclenche un rebuild GitHub Actions quand un article passe en "publish".
 * Fonctionne à la publication initiale ET aux mises à jour d'articles déjà publiés.
 */
add_action( 'transition_post_status', 'dm_trigger_github_rebuild', 10, 3 );

function dm_trigger_github_rebuild( $new_status, $old_status, $post ) {
    // Seulement pour les articles (pas les pages, médias, etc.)
    if ( $post->post_type !== 'post' ) {
        return;
    }

    // Déclencher uniquement quand on passe en "publish"
    // (publication initiale ou re-publication après brouillon)
    if ( $new_status !== 'publish' ) {
        return;
    }

    $slug  = $post->post_name;
    $title = get_the_title( $post );

    $payload = wp_json_encode( [
        'event_type'     => 'wp-article-published',
        'client_payload' => [
            'slug'  => $slug,
            'title' => $title,
        ],
    ] );

    $response = wp_remote_post(
        sprintf(
            'https://api.github.com/repos/%s/%s/dispatches',
            DM_GITHUB_OWNER,
            DM_GITHUB_REPO
        ),
        [
            'method'  => 'POST',
            'timeout' => 15,
            'headers' => [
                'Authorization' => 'Bearer ' . DM_GITHUB_TOKEN,
                'Accept'        => 'application/vnd.github+json',
                'Content-Type'  => 'application/json',
                'X-GitHub-Api-Version' => '2022-11-28',
                'User-Agent'    => 'Dark-Massilia-WP-Webhook/1.0',
            ],
            'body'    => $payload,
        ]
    );

    // Log en cas d'erreur (visible dans les logs PHP / WP Debug)
    if ( is_wp_error( $response ) ) {
        error_log( '[DM Webhook] Erreur wp_remote_post : ' . $response->get_error_message() );
        return;
    }

    $code = wp_remote_retrieve_response_code( $response );
    if ( $code !== 204 ) {
        // 204 = succès GitHub repository_dispatch ; tout autre code = erreur
        $body = wp_remote_retrieve_body( $response );
        error_log( "[DM Webhook] GitHub API a répondu {$code} pour l'article « {$title} » : {$body}" );
    } else {
        error_log( "[DM Webhook] Rebuild déclenché avec succès pour « {$title} » (slug: {$slug})" );
    }
}
