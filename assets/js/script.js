/**
 * ==========================================================================
 * PORTFOLIO CONFIGURATION & TRANSLATIONS
 * ==========================================================================
 */
const translations = {
    tr: {
        nav_home: "Ana Sayfa",
        nav_about: "Hakkımda",
        nav_skills: "Yetenekler",
        nav_contact: "İletişim",
        role: "Junior Siber Güvenlik",
        about_title: "Hakkımda",
        about_desc: "Bilgisayar Teknolojileri mezunu, Cisco onaylı Siber Güvenlik sertifikasına sahip. Sürekli öğrenme motivasyonu yüksek, sektördeki gelişmeleri yakından takip eden ve yenilikçi çözümler üretmeye odaklanan bir teknoloji profesyoneli.",
        skills_title: "Yetenekler",
        skills_cat_security: "Siber Güvenlik & Sistem",
        skills_cat_web: "Web Teknolojileri",
        contact_title: "İletişim",
        contact_desc: "İletişim kurmak için lütfen eposta gönderin",
        contact_btn: "Bana Ulaşın",
        modal_text: "onatdibo@proton.me adresine mail gönderilecek",
        modal_send: "Gönder",
        footer_text: "2025 Onat Dibo. Tüm hakları saklıdır.",
        slugs: { home: "ana-sayfa", about: "hakkimda", skills: "yetenekler", contact: "iletisim" }
    },
    en: {
        nav_home: "Home",
        nav_about: "About",
        nav_skills: "Skills",
        nav_contact: "Contact",
        role: "Junior Cyber Security",
        about_title: "About Me",
        about_desc: "Computer Technologies graduate with a Cisco-approved Cyber Security certificate. A technology professional with high motivation for continuous learning, closely following industry developments, and focused on creating innovative solutions.",
        skills_title: "Skills",
        skills_cat_security: "Cyber Security & System",
        skills_cat_web: "Web Technologies",
        contact_title: "Contact",
        contact_desc: "Please send an email to contact me",
        contact_btn: "Contact Me",
        modal_text: "An email will be sent to onatdibo@proton.me",
        modal_send: "Send",
        footer_text: "2025 Onat Dibo. All rights reserved.",
        slugs: { home: "home", about: "about", skills: "skills", contact: "contact" }
    }
};

/**
 * ==========================================================================
 * STATE & DOM REFERENCES
 * ==========================================================================
 */
const state = {
    lang: localStorage.getItem('lang') || 'tr',
    theme: localStorage.getItem('theme') || 'light'
};

const elements = {
    themeBtn: document.getElementById('theme-toggle'),
    langBtn: document.getElementById('lang-toggle'),
    themeIcon: document.querySelector('#theme-toggle i'),
    mobileMenuBtn: document.querySelector('.mobile-menu-btn'),
    mobileMenuIcon: document.querySelector('.mobile-menu-btn i'),
    navLinks: document.querySelector('.nav-links'),
    contactModal: document.getElementById('contact-modal'),
    contactBtn: document.getElementById('contact-btn'),
    modalCloseBtn: document.querySelector('.modal-close'),
    modalSendBtn: document.getElementById('modal-send-btn')
};

/**
 * ==========================================================================
 * CORE FUNCTIONS
 * ==========================================================================
 */

/**
 * Initializes the application state and UI
 */
function init() {
    applyTheme(state.theme);
    updateLanguage(state.lang);
}

/**
 * Controls body scroll behavior (used by Modal/Mobile Menu)
 * @param {boolean} isLocked 
 */
const toggleScroll = (isLocked) => {
    document.body.style.overflow = isLocked ? 'hidden' : 'auto';
};

/**
 * Handles Dark/Light mode switching
 * @param {string} theme - 'dark' | 'light'
 */
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    state.theme = theme;

    elements.themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

/**
 * Updates UI translations and URL slugs
 * @param {string} lang - 'tr' | 'en'
 */
function updateLanguage(lang) {
    const dict = translations[lang];
    state.lang = lang;
    localStorage.setItem('lang', lang);

    // Update translated elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (!dict[key]) return;

        // Use innerHTML for keys that might contain icons/special formatting
        if (key === 'footer_text') {
            el.innerHTML = dict[key];
        } else {
            el.textContent = dict[key];
        }
    });

    // Update URL slugs and navigation IDs
    const otherLang = lang === 'tr' ? 'en' : 'tr';
    const oldSlugs = translations[otherLang].slugs;
    const newSlugs = dict.slugs;

    Object.keys(newSlugs).forEach(key => {
        const section = document.getElementById(oldSlugs[key]);
        if (section) section.id = newSlugs[key];

        document.querySelectorAll(`a[href="#${oldSlugs[key]}"]`).forEach(link => {
            link.href = `#${newSlugs[key]}`;
        });
    });

    // Update active URL hash
    const currentHash = window.location.hash.substring(1);
    const activeSlugKey = Object.keys(oldSlugs).find(k => oldSlugs[k] === currentHash);
    if (activeSlugKey) {
        history.replaceState(null, null, `#${newSlugs[activeSlugKey]}`);
    }

    // Update interface elements
    elements.langBtn.textContent = lang === 'tr' ? 'EN' : 'TR';
    document.documentElement.lang = lang;
}

/**
 * ==========================================================================
 * EVENT LISTENERS
 * ==========================================================================
 */

// Theme Toggle
elements.themeBtn.addEventListener('click', () => {
    applyTheme(state.theme === 'light' ? 'dark' : 'light');
});

// Language Toggle
elements.langBtn.addEventListener('click', () => {
    updateLanguage(state.lang === 'tr' ? 'en' : 'tr');
});

// Mobile Menu Logic
elements.mobileMenuBtn.addEventListener('click', () => {
    const isActive = elements.navLinks.classList.toggle('active');
    elements.mobileMenuIcon.className = isActive ? 'fas fa-xmark' : 'fas fa-bars';
    toggleScroll(isActive);
});

// Close Mobile Menu on Click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        elements.navLinks.classList.remove('active');
        elements.mobileMenuIcon.className = 'fas fa-bars';
        toggleScroll(false);
    });
});

// Modal Logic
const toggleModal = (show) => {
    elements.contactModal.classList.toggle('active', show);
    toggleScroll(show);
};

elements.contactBtn.addEventListener('click', () => toggleModal(true));
elements.modalCloseBtn.addEventListener('click', () => toggleModal(false));
elements.modalSendBtn.addEventListener('click', () => {
    window.location.href = 'mailto:onatdibo@proton.me';
    toggleModal(false);
});

// Close modal on outside click
window.addEventListener('click', (e) => {
    if (e.target === elements.contactModal) toggleModal(false);
});

// Bootstrap logic
document.addEventListener('DOMContentLoaded', init);
