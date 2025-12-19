/*
    ==========================================================================
    ÇEVİRİ KONFİGÜRASYONU
    ==========================================================================
    Bu nesne (object), web sitesindeki tüm metin içeriklerini birden fazla dilde saklar.
    Yeni bir dil eklemek için:
    1. Yeni bir anahtar ekleyin (örneğin 'de' Almanca için).
    2. Yapıyı kopyalayın ve değerleri çevirin.
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
        contact_btn: "Bana Ulaşın"
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
        contact_btn: "Contact Me"
    }
};

/*
    ==========================================================================
    DOM ELEMENT REFANSLARI
    ==========================================================================
    Performansı artırmak için HTML elementlerini bir kez seçip değişkenlere atıyoruz.
*/
const themeToggleBtn = document.getElementById('theme-toggle');
const langToggleBtn = document.getElementById('lang-toggle');
const themeIcon = themeToggleBtn.querySelector('i'); // Tema butonu içindeki ikon
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const mobileMenuIcon = mobileMenuBtn.querySelector('i');

/*
    ==========================================================================
    DURUM (STATE) YÖNETİMİ
    ==========================================================================
    Mevcut ayarları saklar. Kullanıcının daha önce siteye girip girmediğini localStorage'dan kontrol eder.
*/
let currentLang = 'tr'; // Varsayılan dil
let currentTheme = localStorage.getItem('theme') || 'light'; // Kayıtlı temayı yükle veya varsayılan olarak açık (light) tema kullan

/*
    ==========================================================================
    BAŞLATMA (INIT)
    ==========================================================================
    Sayfa yüklendiğinde kayıtlı ayarları uygulamak için bu fonksiyon çalışır.
*/
function init() {
    setTheme(currentTheme);
    updateLanguage(currentLang);
}

/*
    ==========================================================================
    TEMA MANTIĞI
    ==========================================================================
    Koyu (Dark) ve Açık (Light) mod arasındaki geçişi yönetir.
*/
function setTheme(theme) {
    // 1. <html> etiketine data-theme özniteliği ekle. CSS bunu kullanarak renkleri ayarlar.
    document.documentElement.setAttribute('data-theme', theme);

    // 2. Tercihi tarayıcı hafızasına kaydet, böylece sonraki ziyarette hatırlar.
    localStorage.setItem('theme', theme);
    currentTheme = theme;

    // 3. İkonu güncelle (Açık mod için Ay, Koyu mod için Güneş)
    if (theme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

// Olay Dinleyicisi: Tema butonuna tıklandığında temayı değiştir.
themeToggleBtn.addEventListener('click', () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
});

/*
    ==========================================================================
    DİL MANTIĞI
    ==========================================================================
    Metin içeriklerinin çevirisini yönetir.
*/
function updateLanguage(lang) {
    // 1. Seçilen dilin sözlüğünü al
    const texts = translations[lang];

    // 2. data-i18n özniteliğine sahip HTML elementlerini bul ve içeriklerini güncelle

    // -- Navigasyon --
    document.querySelector('[data-i18n="nav_home"]').textContent = texts.nav_home;
    document.querySelector('[data-i18n="nav_about"]').textContent = texts.nav_about;
    document.querySelector('[data-i18n="nav_skills"]').textContent = texts.nav_skills;
    document.querySelector('[data-i18n="nav_contact"]').textContent = texts.nav_contact;

    // -- İçerik Bölümleri --
    document.querySelector('[data-i18n="role"]').textContent = texts.role;
    document.querySelector('[data-i18n="about_title"]').textContent = texts.about_title;
    document.querySelector('[data-i18n="about_desc"]').textContent = texts.about_desc;
    document.querySelector('[data-i18n="skills_title"]').textContent = texts.skills_title;
    document.querySelector('[data-i18n="skills_cat_security"]').textContent = texts.skills_cat_security;
    document.querySelector('[data-i18n="skills_cat_web"]').textContent = texts.skills_cat_web;
    document.querySelector('[data-i18n="contact_title"]').textContent = texts.contact_title;
    document.querySelector('[data-i18n="contact_desc"]').textContent = texts.contact_desc;
    document.querySelector('[data-i18n="contact_btn"]').textContent = texts.contact_btn;

    // 3. Dil değiştirme butonunun metnini *diğer* seçenek olarak güncelle
    langToggleBtn.textContent = lang === 'tr' ? 'EN' : 'TR';

    // 4. Belgenin lang özniteliğini güncelle (SEO ve Erişilebilirlik için)
    document.documentElement.lang = lang;
}

// Olay Dinleyicisi: TR ve EN arasında geçiş yap
langToggleBtn.addEventListener('click', () => {
    currentLang = currentLang === 'tr' ? 'en' : 'tr';
    updateLanguage(currentLang);
});

/*
    ==========================================================================
    MOBİL MENÜ MANTIĞI
    ==========================================================================
*/
// Menü aç/kapat
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // İkonu değiştir (Hamburger / Çarpı)
    if (navLinks.classList.contains('active')) {
        mobileMenuIcon.classList.remove('fa-bars');
        mobileMenuIcon.classList.add('fa-xmark');
        // Sayfa kaydırmayı engelle (Opsiyonel)
        document.body.style.overflow = 'hidden';
    } else {
        mobileMenuIcon.classList.remove('fa-xmark');
        mobileMenuIcon.classList.add('fa-bars');
        document.body.style.overflow = 'auto';
    }
});

// Linke tıklandığında menüyü kapat
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuIcon.classList.remove('fa-xmark');
        mobileMenuIcon.classList.add('fa-bars');
        document.body.style.overflow = 'auto';
    });
});

// Uygulamayı başlat
init();
