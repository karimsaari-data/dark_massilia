/**
 * Utility functions for the Dark Massilia application
 */

/**
 * Format a date to French locale
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type: 'short', 'long', 'month-year'
 */
export const formatDate = (date, format = 'long') => {
  if (!date) return '';

  const d = new Date(date);
  const options = {
    short: { day: 'numeric', month: 'short', year: 'numeric' },
    long: { day: 'numeric', month: 'long', year: 'numeric' },
    'month-year': { month: 'long', year: 'numeric' },
  };

  return d.toLocaleDateString('fr-FR', options[format] || options.long);
};

/**
 * Extract YouTube video ID from URL
 * @param {string} url - YouTube URL
 */
export const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

/**
 * Extract Vimeo video ID from URL
 * @param {string} url - Vimeo URL
 */
export const getVimeoId = (url) => {
  if (!url) return null;
  const regExp = /vimeo\.com\/(\d+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

/**
 * Generate a thumbnail URL for video platforms
 * @param {string} type - Platform type
 * @param {string} id - Video ID
 */
export const getVideoThumbnail = (type, id) => {
  if (!id) return null;

  switch (type) {
    case 'youtube':
      return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
    case 'vimeo':
      return null;
    default:
      return null;
  }
};

/**
 * Truncate text to a specific length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 */
export const truncate = (text, maxLength = 150) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};
