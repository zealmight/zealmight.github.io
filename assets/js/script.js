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
        contact_btn: "Bana Ulaşın",
        modal_text: "onatdibo@proton.me adresine mail gönderilecek",
        modal_send: "Gönder",
        footer_text: "&copy; 2025 Onat Dibo. Tüm hakları saklıdır.",
        slugs: {
            home: "ana-sayfa",
            about: "hakkimda",
            skills: "yetenekler",
            contact: "iletisim"
        }
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
        footer_text: "&copy; 2025 Onat Dibo. All rights reserved.",
        slugs: {
            home: "home",
            about: "about",
            skills: "skills",
            contact: "contact"
        }
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

// -- Modal Elementleri --
const contactModal = document.getElementById('contact-modal');
const contactBtn = document.getElementById('contact-btn');
const modalCloseBtn = document.querySelector('.modal-close');
const modalSendBtn = document.getElementById('modal-send-btn');

/*
    ==========================================================================
    DURUM (STATE) YÖNETİMİ
    ==========================================================================
    Mevcut ayarları saklar. Kullanıcının daha önce siteye girip girmediğini localStorage'dan kontrol eder.
*/
/*
    ==========================================================================
    DURUM (STATE) YÖNETİMİ
    ==========================================================================
    Programlama dillerinde 'State' (durum), uygulamanın o anki verilerini saklar.
    Burada 'localStorage' kullanarak kullanıcının tercihlerini tarayıcıda tutuyoruz.
    Böylece sayfa yenilense bile ayarlar (tema, dil) kaybolmaz.
*/
// localStorage.getItem: Tarayıcı hafızasından veri çeker.
// || (OR) operatörü: Eğer sol taraf boşsa (null), sağ taraftaki varsayılan değeri kullanır.
let currentLang = localStorage.getItem('lang') || 'tr';
let currentTheme = localStorage.getItem('theme') || 'light';

/*
    ==========================================================================
    BAŞLATMA (INIT) FONKSİYONU
    ==========================================================================
    'init' kısaltması 'initialization' (başlatma) kelimesinden gelir. 
    Sayfa yüklenir yüklenmez çalıştırılacak olan temel ayarları içerir.
*/
function init() {
    setTheme(currentTheme); // Başlangıçta temayı ayarla
    updateLanguage(currentLang); // Başlangıçta dili ayarla
}

/* 
    YARDIMCI FONKSİYON: toggleScroll 
    'isLocked' parametresi boolean (true/false) bir değer alır.
    CSS 'overflow' özelliği 'hidden' yapıldığında sayfa kaydırılamaz hale gelir.
    Bu, menü veya modal açıkken arka planın kaymasını engellemek için kullanılır.
*/
function toggleScroll(isLocked) {
    document.body.style.overflow = isLocked ? 'hidden' : 'auto';
}

/*
    ==========================================================================
    TEMA YÖNETİMİ (DARK/LIGHT MODE)
    ==========================================================================
*/
function setTheme(theme) {
    // setAttribute: HTML elementine ('html' etiketi gibi) yeni bir özellik ekler.
    // CSS dosyasında [data-theme="dark"] seçicisi bu değere göre renkleri değiştirir.
    document.documentElement.setAttribute('data-theme', theme);

    // Değişikliği tarayıcı hafızasına kaydet.
    localStorage.setItem('theme', theme);
    currentTheme = theme;

    // classList.toggle: Eğer sınıfa sahipse kaldırır, değilse ekler.
    // 'fa-sun' (Güneş) ve 'fa-moon' (Ay) ikonları arasında geçiş yapıyoruz.
    themeIcon.classList.toggle('fa-sun', theme === 'dark');
    themeIcon.classList.toggle('fa-moon', theme !== 'dark');
}

// Olay Dinleyicisi (Event Listener): Kullanıcı bir elemente tıkladığında çalışır.
themeToggleBtn.addEventListener('click', () => {
    // Üçlü Operatör (Ternary): 'currentTheme' light ise dark yap, değilse light yap.
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
});

/*
    ==========================================================================
    DİL YÖNETİMİ (ÇEVİRİ)
    ==========================================================================
*/
function updateLanguage(lang) {
    const texts = translations[lang]; // translations nesnesinden ilgili dilin verilerini çek.
    currentLang = lang;
    localStorage.setItem('lang', lang);

    // querySelectorAll: Sayfadaki belirli bir özelliği taşıyan TÜM elementleri bulur.
    // .forEach: Bulunan her bir element için sırayla bir işlem yapar (döngü).
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n'); // Elementin data-i18n değerini al (anahtar).
        if (texts[key]) {
            // Eğer anahtar 'footer_text' ise, içinde HTML kodu (simge vb.) olduğu için innerHTML kullanıyoruz.
            if (key === 'footer_text') {
                el.innerHTML = texts[key];
            } else {
                // Sadece düz metin ise .textContent daha güvenli ve hızlıdır.
                el.textContent = texts[key];
            }
        }
    });

    // Buton metnini değiştir (Eğer mevcut dil tr ise butonda EN yazmalı).
    langToggleBtn.textContent = lang === 'tr' ? 'EN' : 'TR';

    // HTML 'lang' özniteliğini güncelle (Arama motorları ve ekran okuyucular için önemli).
    document.documentElement.lang = lang;

    // Diğer dinamik güncellemeleri yap (Linkler ve ID'ler gibi).
    updateSectionsAndLinks(lang);
}

/*
    updateSectionsAndLinks:
    ID'leri ve href linklerini dile göre günceller (SEO uyumlu URL hash'leri için).
*/
function updateSectionsAndLinks(lang) {
    const slugs = translations[lang].slugs;
    const otherLang = lang === 'tr' ? 'en' : 'tr';
    const oldSlugs = translations[otherLang].slugs;

    // Object.keys: Bir nesnenin içindeki tüm anahtar isimlerini bir dizi (array) olarak döndürür.
    Object.keys(slugs).forEach(key => {
        // Eski ID'li elementi bul ve yeni slug (kısaltma) ile ID'sini değiştir.
        const section = document.getElementById(oldSlugs[key]);
        if (section) section.id = slugs[key];

        // Bu bölüme giden tüm linklerin (href="#...") adreslerini güncelle.
        document.querySelectorAll(`a[href="#${oldSlugs[key]}"]`).forEach(link => {
            link.setAttribute('href', '#' + slugs[key]);
        });
    });

    // history.replaceState: Sayfayı yenilemeden URL'deki hash (#) kısmını günceller.
    const currentHash = window.location.hash.substring(1);
    Object.keys(oldSlugs).forEach(key => {
        if (oldSlugs[key] === currentHash) {
            history.replaceState(null, null, '#' + slugs[key]);
        }
    });
}

langToggleBtn.addEventListener('click', () => {
    updateLanguage(currentLang === 'tr' ? 'en' : 'tr');
});

/*
    ==========================================================================
    MOBİL MENÜ MANTIĞI
    ==========================================================================
*/
mobileMenuBtn.addEventListener('click', () => {
    // .active sınıfını ekle/çıkar yaparak CSS'deki animasyonu tetikle.
    const isActive = navLinks.classList.toggle('active');

    // Menü açıldığında X butonu olsun, kapandığında Hamburger (bars) butonu.
    mobileMenuIcon.classList.toggle('fa-xmark', isActive);
    mobileMenuIcon.classList.toggle('fa-bars', !isActive);

    // Menü açıkken sayfanın arkada kaymasını engelle.
    toggleScroll(isActive);
});

// Mobil menüdeki linklerden birine tıklandığında menüyü otomatik kapat.
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuIcon.classList.replace('fa-xmark', 'fa-bars');
        toggleScroll(false);
    });
});

/*
    ==========================================================================
    MODAL MANTIĞI (İLETİŞİM PENCERESİ)
    ==========================================================================
*/
contactBtn.addEventListener('click', () => {
    contactModal.classList.add('active'); // Modalı görünür yap.
    toggleScroll(true); // Sayfa kaydırmayı durdur.
});

// Modalı kapatmak için kullanılan ortak fonksiyon (DRY - Don't Repeat Yourself prensibi).
const closeModal = () => {
    contactModal.classList.remove('active');
    toggleScroll(false);
};

modalCloseBtn.addEventListener('click', closeModal);

// Kullanıcı modalın dışında (karartılmış alana) tıkladığında kapat.
window.addEventListener('click', (e) => {
    if (e.target === contactModal) closeModal();
});

modalSendBtn.addEventListener('click', () => {
    // mailto: linki ile varsayılan e-posta uygulamasını aç.
    window.location.href = 'mailto:onatdibo@proton.me';
    closeModal();
});

// Uygulamayı başlat
init();
