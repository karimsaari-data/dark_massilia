import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { useContactSubmit } from '../hooks/useSupabase';
import { FADE_IN_UP, STAGGER_CONTAINER, APP_CONFIG } from '../utils/constants';
import { isValidEmail, isValidPhone } from '../utils/helpers';

const Contact = () => {
  const { submitContact, submitting, success } = useContactSubmit();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const result = await submitContact(formData);

    if (result.success) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="text-center mb-12"
        >
          <motion.h1 variants={FADE_IN_UP} className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="gradient-text">Contact</span>
          </motion.h1>
          <motion.p variants={FADE_IN_UP} className="text-gray-400 text-lg max-w-2xl mx-auto">
            Une question, un projet de collaboration ou envie de participer à nos missions ? Contactez-nous !
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={STAGGER_CONTAINER}
            className="lg:col-span-1 space-y-6"
          >
            {[
              {
                icon: Mail,
                title: 'Email',
                value: APP_CONFIG.contactEmail,
                href: `mailto:${APP_CONFIG.contactEmail}`,
              },
              {
                icon: Phone,
                title: 'WhatsApp',
                value: APP_CONFIG.contactWhatsApp,
                href: `https://wa.me/${APP_CONFIG.contactWhatsApp.replace(/\s/g, '')}`,
              },
              {
                icon: MapPin,
                title: 'Localisation',
                value: 'Marseille, France',
                href: null,
              },
            ].map((item, index) => (
              <motion.div key={index} variants={FADE_IN_UP} className="card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-ocean-teal/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-ocean-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-sm text-gray-400 hover:text-ocean-teal transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-400">{item.value}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Team Oxygen */}
            <motion.div variants={FADE_IN_UP} className="card bg-ocean-teal/10 border-ocean-teal/20">
              <h3 className="font-semibold text-ocean-teal mb-2">Team Oxygen</h3>
              <p className="text-sm text-gray-300 mb-3">
                Vice-président et membre actif de l'association Team Oxygen
              </p>
              <a
                href="https://www.team-oxygen.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-ocean-teal hover:underline inline-flex items-center gap-1"
              >
                Découvrir Team Oxygen
                <span>→</span>
              </a>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={FADE_IN_UP}
            className="lg:col-span-2"
          >
            <div className="card">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle className="w-16 h-16 text-ocean-teal mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Message envoyé !</h3>
                  <p className="text-gray-400 mb-6">
                    Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="btn-secondary"
                  >
                    Envoyer un autre message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Nom complet <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`input ${errors.name ? 'border-red-500' : ''}`}
                      placeholder="Votre nom"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`input ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="votre@email.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`input ${errors.phone ? 'border-red-500' : ''}`}
                        placeholder="+33 6 12 34 56 78"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      Sujet
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="input"
                      placeholder="Objet de votre message"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className={`textarea ${errors.message ? 'border-red-500' : ''}`}
                      placeholder="Votre message..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="spinner w-5 h-5 border-2" />
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Envoyer le message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
