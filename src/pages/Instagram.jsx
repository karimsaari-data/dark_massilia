import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import InstagramFeed from '../components/ui/InstagramFeed';
import InstagramStats from '../components/ui/InstagramStats';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';

const Instagram = () => {
  return (
    <div className="min-h-screen py-24">
      <SEO {...SEO_PAGES['/communaute']} />
      <div className="container-custom">
        {/* Section éditoriale SEO — autorité communautaire & engagement citoyen */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mb-6"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Une communauté de plus de 130&nbsp;000 sentinelles
            </h2>
            <div className="space-y-4 text-text-secondary leading-relaxed text-lg">
              <p>
                La protection de la Méditerranée repose sur une mobilisation collective et
                continue. À travers mes réseaux sociaux, je fédère aujourd'hui une communauté de
                plus de <strong className="text-white">130&nbsp;000 personnes</strong> sensibilisées
                aux enjeux environnementaux du littoral marseillais.
              </p>
              <p>
                De mes reportages en immersion sur{' '}
                <strong className="text-white">YouTube</strong> à mes alertes environnementales sur{' '}
                <strong className="text-white">Instagram</strong> (24,2K),{' '}
                <strong className="text-white">TikTok</strong> (21,9K) et mes fiches thématiques
                sur <strong className="text-white">Pinterest</strong>, cette audience numérique
                prolonge le travail de terrain en donnant de la visibilité aux réalités observées
                sous la surface.
              </p>
              <p>
                À travers l'animation du groupe incontournable des{' '}
                <strong className="text-ocean-teal">Amoureux des Calanques</strong> (plus de
                64&nbsp;000 membres), ma présence sur{' '}
                <strong className="text-white">Facebook</strong> (près de 18&nbsp;000 abonnés
                cumulés), sur <strong className="text-white">X</strong> et en tant que{' '}
                <strong className="text-white">Local Guide Google Maps</strong> à Marseille,
                j'informe, documente et interpelle en temps réel.
              </p>
              <p>
                Cette audience n'est pas un indicateur abstrait&nbsp;: elle représente une capacité
                concrète de sensibilisation et de mobilisation au service de la préservation de la
                Méditerranée et du littoral marseillais.
              </p>
            </div>

            {/* Photo panoramique dans le bloc */}
            <div className="mt-8 w-full overflow-hidden rounded-2xl">
              <img
                src="/images/130000_sentinelles_Marseille.jpg"
                alt="La communauté Dark Massilia — 130 000 sentinelles de la Méditerranée à Marseille"
                className="w-full object-cover object-top"
                style={{ aspectRatio: '21/9' }}
                loading="lazy"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Statistiques réseaux sociaux */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          <motion.div variants={FADE_IN_UP}>
            <InstagramStats />
          </motion.div>
        </motion.div>

        {/* Full Width Photo Wall */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
        >
          <motion.div variants={FADE_IN_UP}>
            <InstagramFeed limit={9} />
          </motion.div>
        </motion.div>

        {/* Description — bas de page */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mt-12 mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Nos Réseaux Sociaux
            </h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                Sur <strong className="text-white">Instagram</strong> (<strong className="text-ocean-teal">@karimsaari</strong>) et <strong className="text-white">TikTok</strong> (<strong className="text-ocean-teal">@dark.massilia</strong>), je partage les coulisses de chaque mission : plongées en apnée, déchets remontés, faune des Calanques et paysages du littoral marseillais.
              </p>
              <p>
                Le groupe Facebook <strong className="text-white">Amoureux des Calanques de Marseille à Port-Cros</strong> rassemble plus de <strong className="text-ocean-teal">64 000 membres</strong> passionnés par la protection du littoral. Sur <strong className="text-white">YouTube</strong>, retrouvez nos documentaires, rétrospectives et reportages de missions. Sur <strong className="text-white">Pinterest</strong>, des fiches thématiques sur la photographie et la nature marseillaise génèrent un trafic SEO naturel tout au long de l'année.
              </p>
              <p>
                Au total, plus de <strong className="text-ocean-teal">130 000 citoyens engagés</strong> suivent et relaient notre combat pour la Méditerranée. Mon profil <strong className="text-white">Local Guide Google Maps</strong> complète cette présence en valorisant les lieux emblématiques du littoral.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href="https://www.instagram.com/karimsaari"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors font-medium"
              >
                Instagram
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://www.tiktok.com/@dark.massilia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors font-medium"
              >
                TikTok
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@dark.massilia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors font-medium"
              >
                YouTube
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://fr.pinterest.com/Photographie_Marseille/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors font-medium"
              >
                Pinterest
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://www.google.com/maps/contrib/114912564832630219145/photos/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors font-medium"
              >
                Local Guide Google Maps
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Instagram;
