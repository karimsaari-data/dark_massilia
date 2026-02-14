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
 * Extract TikTok video ID from URL
 * @param {string} url - TikTok URL
 */
export const getTikTokId = (url) => {
  if (!url) return null;
  const regExp = /tiktok\.com\/@[\w.-]+\/video\/(\d+)/;
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
      // Vimeo requires API call for thumbnail, fallback to placeholder
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

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Check if an element is in viewport
 * @param {HTMLElement} element - Element to check
 */
export const isInViewport = (element) => {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate phone number (French format)
 * @param {string} phone - Phone number to validate
 */
export const isValidPhone = (phone) => {
  // Accept formats: 0612345678, +33612345678, 06 12 34 56 78
  const re = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  return re.test(phone);
};

/**
 * Generate a slug from text
 * @param {string} text - Text to convert to slug
 */
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove invalid chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-'); // Replace multiple - with single -
};

/**
 * Calculate reading time for text content
 * @param {string} text - Text content
 * @param {number} wordsPerMinute - Average reading speed
 */
export const calculateReadingTime = (text, wordsPerMinute = 200) => {
  if (!text) return 0;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
};

/**
 * Format file size in bytes to human readable format
 * @param {number} bytes - Size in bytes
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Scroll to element smoothly
 * @param {string} elementId - ID of element to scroll to
 * @param {number} offset - Offset in pixels
 */
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
};
