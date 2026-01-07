/**
 * ==========================================================================
 * PORTFÖY YAPILANDIRMASI & ÇEVİRİLER
 * ==========================================================================
 */
const translations = {
    tr: {
        page_title: "Hakkımda | Onat Dibo",
        nav_home: "Ana Sayfa",
        nav_about: "Hakkımda",
        nav_skills: "Yetenekler",
        nav_contact: "İletişim",
        role: "Junior Siber Güvenlik",
        about_title: "👤 Hakkımda",
        about_desc: "Bilgisayar Teknolojileri mezunu, Cisco onaylı Siber Güvenlik sertifikasına sahip. Sürekli öğrenme motivasyonu yüksek, sektördeki gelişmeleri yakından takip eden ve yenilikçi çözümler üretmeye odaklanan bir teknoloji profesyoneli.",
        skills_title: "🛠️ Yetenekler",
        skills_cat_security: "Siber Güvenlik & Sistem",
        skills_cat_web: "Web Teknolojileri",
        contact_title: "📬 İletişim",
        contact_desc: "İletişim kurmak için lütfen eposta gönderin",
        contact_btn: "Bana Ulaşın",
        modal_text: "onatdibo@proton.me adresine mail gönderilecek",
        modal_send: "Gönder",
        modal_success: "Kopyalandı!",
        footer_text: "2025 Onat Dibo. Tüm hakları saklıdır.",
        lang_prompt_text: "İçeriği Türkçe olarak görmek ister misiniz?",
        lang_prompt_yes: "Evet, Değiştir",
        lang_prompt_no: "Kapat",
        console_header: "■ SİBER ÇEKİRDEK BAŞLATILDI",
        console_message: "Sistem Aktif... Siber dünyaya hoş geldin! 🚀\nSızmaya çalışma, sadece portfolyomu inceliyorsun. 😉",
        slugs: { home: "ana-sayfa", about: "hakkimda", skills: "yetenekler", contact: "iletisim" }
    },
    en: {
        page_title: "About Me | Onat Dibo",
        nav_home: "Home",
        nav_about: "About",
        nav_skills: "Skills",
        nav_contact: "Contact",
        role: "Junior Cyber Security",
        about_title: "👤 About Me",
        about_desc: "Computer Technologies graduate with a Cisco-approved Cyber Security certificate. A technology professional with high motivation for continuous learning, closely following industry developments, and focused on creating innovative solutions.",
        skills_title: "🛠️ Skills",
        skills_cat_security: "Cyber Security & System",
        skills_cat_web: "Web Technologies",
        contact_title: "📬 Contact",
        contact_desc: "Please send an email to contact me",
        contact_btn: "Contact Me",
        modal_text: "An email will be sent to onatdibo@proton.me",
        modal_send: "Send",
        modal_success: "Copied!",
        footer_text: "2025 Onat Dibo. All rights reserved.",
        lang_prompt_text: "Would you like to view the content in English?",
        lang_prompt_yes: "Yes, Switch",
        lang_prompt_no: "Close",
        console_header: "■ CYBER CORE INITIALIZED",
        console_message: "System Active... Welcome to the cyber world! 🚀\nNo need to hack, you are just viewing my portfolio. 😉",
        slugs: { home: "home", about: "about", skills: "skills", contact: "contact" }
    }
};

/**
 * ==========================================================================
 * DURUM & DOM REFERANSLARI
 * ==========================================================================
 */
const state = {
    lang: localStorage.getItem('lang') || 'tr',
    theme: localStorage.getItem('theme') || 'light'
};

const elements = {
    themeBtn: document.getElementById('theme-toggle'),
    langBtn: document.getElementById('lang-btn'),
    langDropdown: document.querySelector('.lang-dropdown'),
    langMenu: document.querySelector('.lang-menu'),
    langText: document.querySelector('.current-lang-text'),
    langOptions: document.querySelectorAll('.lang-option'),
    themeIcon: document.querySelector('#theme-toggle i'),
    mobileMenuBtn: document.querySelector('.mobile-menu-btn'),
    mobileMenuIcon: document.querySelector('.mobile-menu-btn i'),
    navLinks: document.querySelector('.nav-links'),
    contactModal: document.getElementById('contact-modal'),
    contactBtn: document.getElementById('contact-btn'),
    modalCloseBtn: document.querySelector('.modal-close'),
    modalSendBtn: document.getElementById('modal-send-btn'),
    copyEmailBtn: document.getElementById('copy-email-btn'),
    langPrompt: document.getElementById('lang-prompt'),
    langPromptYes: document.getElementById('lang-prompt-yes'),
    langPromptNo: document.getElementById('lang-prompt-no'),
    langPromptText: document.getElementById('lang-prompt-text')
};

/**
 * ==========================================================================
 * TEMEL FONKSİYONLAR
 * ==========================================================================
 */

/**
 * Uygulamanın durumunu ve arayüzünü başlatır
 */
function init() {
    applyTheme(state.theme);
    updateLanguage(state.lang);

    // Tarayıcı dilini kontrol et (Gecikmeli çalıştır ki sayfa yüklensin)
    setTimeout(checkBrowserLanguage, 1500);
}

/**
 * Sayfa kaydırma davranışını kontrol eder (Modal/Mobil Menü tarafından kullanılır)
 * @param {boolean} isLocked - Kaydırma kilitli mi?
 */
const toggleScroll = (isLocked) => {
    document.body.style.overflow = isLocked ? 'hidden' : 'auto';
};

/**
 * Koyu/Açık mod geçişini yönetir
 * @param {string} theme - 'dark' | 'light'
 */
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    state.theme = theme;

    elements.themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

/**
 * Arayüz çevirilerini ve URL slug'larını günceller
 * @param {string} lang - 'tr' | 'en'
 */
function updateLanguage(lang) {
    const dict = translations[lang];
    state.lang = lang;
    localStorage.setItem('lang', lang);

    // Çevrilmiş elementleri güncelle
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (!dict[key]) return;

        // İkonlar/özel biçimlendirme içerebilecek anahtarlar için innerHTML kullan
        const useHTML = ['footer_text', 'about_title', 'skills_title', 'contact_title', 'nav_home', 'nav_about', 'nav_skills', 'nav_contact'];

        if (useHTML.includes(key)) {
            el.innerHTML = dict[key];
        } else {
            el.textContent = dict[key];
        }
    });

    // Sayfa başlığını güncelle (title tag)
    const titleElement = document.querySelector('title[data-i18n]');
    if (titleElement) {
        const titleKey = titleElement.getAttribute('data-i18n');
        if (dict[titleKey]) {
            titleElement.textContent = dict[titleKey];
        }
    }

    // URL slug'larını ve navigasyon ID'lerini güncelle
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

    // Arayüz elementlerini güncelle
    if (elements.langText) {
        elements.langText.textContent = lang.toUpperCase();
    }
    document.documentElement.lang = lang;
    logCyberMessage(lang);

    // Dil istemini güncelle
    if (elements.langPromptText) elements.langPromptText.textContent = dict.lang_prompt_text;
    if (elements.langPromptYes) elements.langPromptYes.textContent = dict.lang_prompt_yes;
    if (elements.langPromptNo) elements.langPromptNo.textContent = dict.lang_prompt_no;
}

/**
 * Tarayıcı dilini algılar ve uygunsa bir istem gösterir
 */
function checkBrowserLanguage() {
    // Eğer kullanıcı daha önce bir tercih yaptıysa sorma
    if (localStorage.getItem('lang_prompt_seen')) return;

    const browserLang = navigator.language.split('-')[0]; // 'tr-TR' -> 'tr'
    const currentLang = state.lang;

    // Eğer tarayıcı dili mevcut dilden farklıysa ve desteklediğimiz bir dilse (tr/en)
    if (browserLang !== currentLang && (browserLang === 'tr' || browserLang === 'en')) {
        showLangPrompt(browserLang);
    }
}

/**
 * Dil değiştirme önerisini gösterir
 * @param {string} suggestedLang - 'tr' | 'en'
 */
function showLangPrompt(suggestedLang) {
    const dict = translations[suggestedLang];

    if (elements.langPromptText) elements.langPromptText.textContent = dict.lang_prompt_text;
    if (elements.langPromptYes) elements.langPromptYes.textContent = dict.lang_prompt_yes;
    if (elements.langPromptNo) elements.langPromptNo.textContent = dict.lang_prompt_no;

    // Sadece henüz gösterilmemişse aktifleştir
    if (!elements.langPrompt.classList.contains('active')) {
        elements.langPrompt.classList.add('active');
        // Bir kez gösterildiğinde 'görüldü' olarak işaretle (Kullanıcı etkileşime girmese bile bir daha sormaz)
        localStorage.setItem('lang_prompt_seen', 'true');
    }

    // Evet Butonu: Dile geçiş yap
    const handleYes = () => {
        updateLanguage(suggestedLang);
        hideLangPrompt();
        elements.langPromptYes.removeEventListener('click', handleYes);
    };

    // Hayır Butonu: Sadece kapat
    const handleNo = () => {
        hideLangPrompt();
        elements.langPromptNo.removeEventListener('click', handleNo);
    };

    elements.langPromptYes.addEventListener('click', handleYes);
    elements.langPromptNo.addEventListener('click', handleNo);
}

/**
 * Dil istemini kapatır ve kullanıcı tercihini kaydeder
 */
function hideLangPrompt() {
    elements.langPrompt.classList.remove('active');
    localStorage.setItem('lang_prompt_seen', 'true');
}

/**
 * Konsola siber temalı, şekilli bir mesaj yazdırır
 * @param {string} lang - 'tr' | 'en'
 */
function logCyberMessage(lang) {
    const dict = translations[lang];
    const msg = dict.console_message;

    const banner = `
    > ONAT DIBO :: PORTFOLIO 2.0
    > STATUS: SYSTEM_READY
    > ENCRYPTION: ACTIVE
    `;

    const titleStyle = 'color: #10b981; font-family: monospace; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #10b981;';
    const bannerStyle = 'color: #334155; font-family: monospace; font-size: 14px; line-height: 1.5;';
    const msgStyle = 'background: #020617; color: #10b981; padding: 12px 20px; border-left: 4px solid #10b981; font-family: monospace; font-size: 14px; font-weight: bold; line-height: 1.6;';

    console.clear();
    console.log("%c" + dict.console_header, titleStyle);
    console.log("%c" + banner, bannerStyle);
    console.log("%c" + msg, msgStyle);
}

/**
 * ==========================================================================
 * OLAY DİNLEYİCİLERİ (EVENT LISTENERS)
 * ==========================================================================
 */

// Tema Değiştirme
elements.themeBtn.addEventListener('click', () => {
    applyTheme(state.theme === 'light' ? 'dark' : 'light');
});

// Dil Seçimi Dropdown Toggle
elements.langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = elements.langMenu.classList.toggle('active');
    elements.langDropdown.classList.toggle('active', isActive);
});

// Dil Seçimi (Seçenek Tıklama)
elements.langOptions.forEach(option => {
    option.addEventListener('click', () => {
        const selectedLang = option.getAttribute('data-lang');
        if (selectedLang !== state.lang) {
            updateLanguage(selectedLang);
        }
        // Seçim sonrası kapat
        elements.langMenu.classList.remove('active');
        elements.langDropdown.classList.remove('active');
    });
});

// Mobil Menü Mantığı
elements.mobileMenuBtn.addEventListener('click', () => {
    const isActive = elements.navLinks.classList.toggle('active');
    elements.mobileMenuIcon.className = isActive ? 'fas fa-xmark' : 'fas fa-bars';
    toggleScroll(isActive);
});

// Tıklamada Mobil Menüyü Kapat ve Hash Güncellemesini Engelle
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        // Hash'in URL'de görünmesini engelle
        e.preventDefault();

        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            // Yumuşak kaydırma
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });

            // Mobil menüyü kapat
            elements.navLinks.classList.remove('active');
            elements.mobileMenuIcon.className = 'fas fa-bars';
            toggleScroll(false);
        }
    });
});

// Modal Mantığı
const toggleModal = (show) => {
    elements.contactModal.classList.toggle('active', show);
    toggleScroll(show);
};

elements.contactBtn.addEventListener('click', () => toggleModal(true));
elements.modalCloseBtn.addEventListener('click', () => toggleModal(false));

// E-posta Kopyalama
elements.copyEmailBtn.addEventListener('click', async () => {
    const email = 'onatdibo@proton.me';
    const icon = elements.copyEmailBtn.querySelector('i');

    try {
        await navigator.clipboard.writeText(email);

        // Başarı ikonu göster
        icon.className = 'fas fa-check';

        // 2 saniye sonra geri döndür
        setTimeout(() => {
            icon.className = 'far fa-copy';
        }, 2000);
    } catch (err) {
        console.error('Kopyalama başarısız:', err);
    }
});

// E-postaya Yönlendirme
elements.modalSendBtn.addEventListener('click', () => {
    window.location.href = 'mailto:onatdibo@proton.me';
    toggleModal(false);
});

// Dışarı tıklamada modalı veya dropdown'ı kapat
window.addEventListener('click', (e) => {
    if (e.target === elements.contactModal) toggleModal(false);

    // Dropdown dışında bir yere tıklandığında dropdown'ı kapat
    if (!elements.langDropdown.contains(e.target)) {
        elements.langMenu.classList.remove('active');
        elements.langDropdown.classList.remove('active');
    }
});

// Başlatma mantığı
document.addEventListener('DOMContentLoaded', init);