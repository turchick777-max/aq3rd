/**
 * AQUINTAQA - Quality & Standards Section
 * JavaScript for interactivity and internationalization
 */

(function() {
  'use strict';

  // ===========================
  // Configuration
  // ===========================
  const CONFIG = {
    defaultLang: 'en',
    supportedLangs: ['en', 'ru'],
    i18nPath: './i18n/',
    storageKey: 'aquintaqa_lang',
    animationThreshold: 0.1
  };

  // ===========================
  // State
  // ===========================
  let currentLang = CONFIG.defaultLang;
  let translations = {};

  // ===========================
  // i18n Functions
  // ===========================

  /**
   * Load translation file for a specific language
   */
  async function loadTranslations(lang) {
    try {
      const response = await fetch(`${CONFIG.i18nPath}${lang}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load translations for ${lang}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error loading translations for ${lang}:`, error);
      return null;
    }
  }

  /**
   * Get nested value from object using dot notation
   */
  function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  /**
   * Apply translations to all elements with data-i18n attribute
   */
  function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = getNestedValue(translations[currentLang], key);
      if (translation) {
        element.textContent = translation;
      }
    });

    // Apply tooltip translations
    const badges = document.querySelectorAll('[data-tooltip-key]');
    badges.forEach(badge => {
      const key = badge.getAttribute('data-tooltip-key');
      const tooltipKey = `badge_tooltips.${key}`;
      const tooltip = getNestedValue(translations[currentLang], tooltipKey);
      if (tooltip) {
        badge.setAttribute('data-tooltip', tooltip);
      }
    });

    // Update html lang attribute
    document.documentElement.lang = currentLang;
  }

  /**
   * Switch language
   */
  async function switchLanguage(lang) {
    if (!CONFIG.supportedLangs.includes(lang)) {
      console.warn(`Unsupported language: ${lang}`);
      return;
    }

    // Load translations if not already loaded
    if (!translations[lang]) {
      const data = await loadTranslations(lang);
      if (data) {
        translations[lang] = data;
      } else {
        return;
      }
    }

    currentLang = lang;
    localStorage.setItem(CONFIG.storageKey, lang);
    applyTranslations();
    updateLangButtons();
  }

  /**
   * Update language switcher buttons
   */
  function updateLangButtons() {
    const buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(btn => {
      const btnLang = btn.getAttribute('data-lang');
      btn.classList.toggle('active', btnLang === currentLang);
    });
  }

  /**
   * Initialize language from storage or browser preference
   */
  function initLanguage() {
    // Check localStorage
    const storedLang = localStorage.getItem(CONFIG.storageKey);
    if (storedLang && CONFIG.supportedLangs.includes(storedLang)) {
      return storedLang;
    }

    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (CONFIG.supportedLangs.includes(browserLang)) {
      return browserLang;
    }

    return CONFIG.defaultLang;
  }

  // ===========================
  // View More Toggle
  // ===========================

  function initViewMoreToggle() {
    const viewMoreBtn = document.getElementById('viewMoreBtn');
    const extraParams = document.querySelector('.extra-parameters');

    if (!viewMoreBtn || !extraParams) return;

    viewMoreBtn.addEventListener('click', () => {
      const isExpanded = viewMoreBtn.classList.contains('expanded');

      if (isExpanded) {
        // Collapse
        extraParams.classList.remove('visible');
        extraParams.classList.add('hidden');
        viewMoreBtn.classList.remove('expanded');
      } else {
        // Expand
        extraParams.classList.remove('hidden');
        extraParams.classList.add('visible');
        viewMoreBtn.classList.add('expanded');
      }
    });
  }

  // ===========================
  // Scroll Animations
  // ===========================

  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: CONFIG.animationThreshold,
        rootMargin: '0px 0px -50px 0px'
      });

      animatedElements.forEach(el => observer.observe(el));
    } else {
      // Fallback for older browsers
      animatedElements.forEach(el => el.classList.add('visible'));
    }
  }

  // ===========================
  // Language Switcher Events
  // ===========================

  function initLangSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        switchLanguage(lang);
      });
    });
  }

  // ===========================
  // Badge Hover Effects
  // ===========================

  function initBadgeEffects() {
    const badges = document.querySelectorAll('.badge');
    badges.forEach(badge => {
      badge.addEventListener('mouseenter', () => {
        badge.style.transform = 'translateY(-2px)';
      });
      badge.addEventListener('mouseleave', () => {
        badge.style.transform = 'translateY(0)';
      });
    });
  }

  // ===========================
  // Table Row Hover Effects
  // ===========================

  function initTableEffects() {
    const tableRows = document.querySelectorAll('.status-table tbody tr');
    tableRows.forEach(row => {
      row.addEventListener('mouseenter', () => {
        row.style.backgroundColor = 'rgba(74, 144, 164, 0.1)';
      });
      row.addEventListener('mouseleave', () => {
        row.style.backgroundColor = 'transparent';
      });
    });
  }

  // ===========================
  // Logo Animation Enhancement
  // ===========================

  function initLogoAnimation() {
    const logoCircle = document.querySelector('.logo-circle');
    if (!logoCircle) return;

    logoCircle.addEventListener('mouseenter', () => {
      logoCircle.style.transform = 'scale(1.05)';
      logoCircle.style.transition = 'transform 0.3s ease';
    });

    logoCircle.addEventListener('mouseleave', () => {
      logoCircle.style.transform = 'scale(1)';
    });
  }

  // ===========================
  // Keyboard Navigation
  // ===========================

  function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
      // Toggle language with Alt + L
      if (e.altKey && e.key === 'l') {
        e.preventDefault();
        const nextLang = currentLang === 'en' ? 'ru' : 'en';
        switchLanguage(nextLang);
      }

      // Toggle extra parameters with Space when button is focused
      if (e.key === ' ' || e.key === 'Enter') {
        const viewMoreBtn = document.getElementById('viewMoreBtn');
        if (document.activeElement === viewMoreBtn) {
          e.preventDefault();
          viewMoreBtn.click();
        }
      }
    });
  }

  // ===========================
  // Smooth Scroll for Internal Links
  // ===========================

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // ===========================
  // Performance Optimization
  // ===========================

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ===========================
  // Initialize Application
  // ===========================

  async function init() {
    // Get initial language
    const initialLang = initLanguage();

    // Load initial translations
    const data = await loadTranslations(initialLang);
    if (data) {
      translations[initialLang] = data;
      currentLang = initialLang;
      applyTranslations();
      updateLangButtons();
    }

    // Initialize all components
    initLangSwitcher();
    initViewMoreToggle();
    initScrollAnimations();
    initBadgeEffects();
    initTableEffects();
    initLogoAnimation();
    initKeyboardNav();
    initSmoothScroll();

    // Mark as loaded
    document.body.classList.add('loaded');
  }

  // ===========================
  // DOM Ready
  // ===========================

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
