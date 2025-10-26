/* ========================================
   ICON SYSTEM
   ======================================== */
// Lucide icon kütüphanesini başlatır ve SVG ikonları render eder
lucide.createIcons();

/* ========================================
   TAB TITLE MANAGEMENT
   ======================================== */
// Sekme değiştiğinde title'ı değiştirmek için kullanılan değişkenler
let originalTitle = document.title; // Orijinal başlık (dil değişikliklerinde güncellenir)
const hiddenTitles = {
    tr: 'Geri Gel! 🧐',  // Türkçe: Sekme arkaplanda iken gösterilen başlık
    en: 'Come Back! 🧐'  // İngilizce: Sekme arkaplanda iken gösterilen başlık
};

// Mevcut dile göre gizlenmiş başlığı döndürür
function getCurrentHiddenTitle() {
    const currentLang = document.body.classList.contains('lang-en') ? 'en' : 'tr';
    return hiddenTitles[currentLang];
}

/* ========================================
   SECURITY FEATURES
   ======================================== */
// Sağ tıklamayı devre dışı bırakır (sahte güvenlik önlemi)
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

// Developer tools ve bazı klavye kısayollarını devre dışı bırakır
// F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+Shift+C tuşlarını engeller
document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') || 
        (e.ctrlKey && e.shiftKey && e.key === 'J') || 
        (e.ctrlKey && e.key === 'u') || 
        (e.ctrlKey && e.shiftKey && e.key === 'C')) {
        e.preventDefault();
        return false;
    }
});

// Metin seçimini devre dışı bırakır
document.addEventListener('selectstart', function(e) {
    e.preventDefault();
    return false;
});

// Sürükle-bırak (drag) işlemini devre dışı bırakır
document.addEventListener('dragstart', function(e) {
    e.preventDefault();
    return false;
});

/* ========================================
   THEME SWITCHER
   ======================================== */
// Tema değiştirme butonu ve localStorage'dan tema tercihini yükler
const themeBtn = document.getElementById('themeBtn');
const body = document.body;

// Kaydedilmiş tema tercihini yükle (varsayılan: light)
const theme = localStorage.getItem('theme') || 'light';
if (theme === 'dark') {
    body.classList.add('dark');
    themeBtn.textContent = '☀️'; // Güneş ikonu (dark mod aktif)
}

// Tema butonuna tıklandığında light/dark mod arasında geçiş yapar
themeBtn.addEventListener('click', () => {
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');
    themeBtn.textContent = isDark ? '☀️' : '🌙'; // İkonu güncelle
    localStorage.setItem('theme', isDark ? 'dark' : 'light'); // Tercihi kaydet
});

/* ========================================
   LANGUAGE SWITCHER
   ======================================== */
// Dil değiştirme butonları ve localStorage'dan dil tercihini yükler
const trBtn = document.getElementById('trBtn');
const enBtn = document.getElementById('enBtn');
const htmlElement = document.documentElement;

// Kaydedilmiş dil tercihini yükle (varsayılan: Türkçe)
const savedLanguage = localStorage.getItem('language') || 'tr';
document.body.classList.add(`lang-${savedLanguage}`);
if (savedLanguage === 'tr') {
    trBtn.classList.add('active');
} else {
    enBtn.classList.add('active');
}

// Başlangıç başlığını ayarla
const title = document.querySelector('title');
if (title) {
    title.textContent = title.getAttribute(`data-${savedLanguage}`);
}

// Sayfa yüklendiğinde dil ayarını uygula
setLanguage(savedLanguage);

/* ========================================
   LANGUAGE MANAGEMENT FUNCTION
   ======================================== */
// Dil değişikliği işlemlerini yönetir
function setLanguage(lang) {
    // HTML lang attribute'unu güncelle (SEO ve accessibility için)
    htmlElement.setAttribute('lang', lang);
    
    // Body'ye lang class'ı ekle (CSS dil değişimi için)
    document.body.classList.remove('lang-tr', 'lang-en');
    document.body.classList.add(`lang-${lang}`);
    
    // Buton durumlarını güncelle (aktif buton vurgusu)
    trBtn.classList.toggle('active', lang === 'tr');
    enBtn.classList.toggle('active', lang === 'en');
    
    // ÇEVIRILMESI GEREKEN ELEMENLER
    // Bio bölümünü çevir
    const bio = document.querySelector('.bio');
    if (bio && bio.hasAttribute('data-tr') && bio.hasAttribute('data-en')) {
        bio.textContent = bio.getAttribute(`data-${lang}`);
    }
    
    // Açıklama bölümünü çevir
    const description = document.querySelector('.description');
    if (description && description.hasAttribute('data-tr') && description.hasAttribute('data-en')) {
        description.textContent = description.getAttribute(`data-${lang}`);
    }
    
    // Email butonundaki metni çevir
    const emailLink = document.querySelector('a[href^="mailto:"]');
    if (emailLink) {
        const emailSpan = emailLink.querySelector('span[data-tr]');
        if (emailSpan) {
            emailSpan.textContent = emailSpan.getAttribute(`data-${lang}`);
        }
    }
    
    // Footer metnini çevir
    const footerSpan = document.querySelector('.footer span');
    if (footerSpan && footerSpan.hasAttribute('data-tr') && footerSpan.hasAttribute('data-en')) {
        footerSpan.textContent = footerSpan.getAttribute(`data-${lang}`);
    }
    
    // Sayfa başlığını çevir
    const title = document.querySelector('title');
    if (title && title.hasAttribute('data-tr') && title.hasAttribute('data-en')) {
        title.textContent = title.getAttribute(`data-${lang}`);
        originalTitle = title.textContent; // Tab değişimi için güncelle
    }
    
    // Meta etiketlerini çevir (SEO)
    const metaTags = document.querySelectorAll('meta[data-tr][data-en]');
    metaTags.forEach(meta => {
        const text = meta.getAttribute(`data-${lang}`);
        if (text) {
            meta.setAttribute('content', text);
        }
    });
    
    // Dil tercihini kaydet
    localStorage.setItem('language', lang);
}

/* ========================================
   LANGUAGE BUTTON EVENT LISTENERS
   ======================================== */
// Türkçe butonuna tıklama eventi
trBtn.addEventListener('click', () => {
    setLanguage('tr');
});

// İngilizce butonuna tıklama eventi
enBtn.addEventListener('click', () => {
    setLanguage('en');
});

/* ========================================
   PARTICLE EFFECT SYSTEM
   ======================================== */
// Arkaplan partikül animasyonu sistemi
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50; // Ekrandaki partikül sayısı
        this.mouse = { x: 0, y: 0 };
        
        this.init();
        this.bindEvents();
        this.animate();
    }
    
    init() {
        this.resize();
        this.createParticles();
    }
    
    // Canvas boyutunu ekran boyutuna göre ayarla
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    // Rastgele partiküller oluştur
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5, // X hızı
                vy: (Math.random() - 0.5) * 0.5, // Y hızı
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                originalOpacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    // Mevcut tema rengine göre partikül renklerini döndür
    getThemeColors() {
        const isDark = document.body.classList.contains('dark');
        return {
            particle: isDark ? 'rgba(250, 250, 250, ' : 'rgba(10, 10, 10, ',
            connection: isDark ? 'rgba(250, 250, 250, ' : 'rgba(10, 10, 10, '
        };
    }
    
    // Partiküllerin pozisyonlarını ve hızlarını güncelle
    updateParticles() {
        const colors = this.getThemeColors();
        
        this.particles.forEach(particle => {
            // Pozisyonu hıza göre güncelle
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Kenarlarda sektir (ters yönde hareket et)
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }
            
            // Partikülleri sınırlar içinde tut
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            
            // Fare etkileşimi (100px menzil içinde)
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                // Fare yakınlığına göre partikülü etkile
                const force = (100 - distance) / 100;
                particle.vx -= (dx / distance) * force * 0.01;
                particle.vy -= (dy / distance) * force * 0.01;
                particle.opacity = particle.originalOpacity + force * 0.3; // Parlaklık artışı
            } else {
                particle.opacity = particle.originalOpacity;
            }
            
            // Hızı sınırla (çok hızlı hareket etmesini engelle)
            particle.vx = Math.max(-1, Math.min(1, particle.vx));
            particle.vy = Math.max(-1, Math.min(1, particle.vy));
        });
    }
    
    // Partikülleri ve bağlantıları çiz
    drawParticles() {
        const colors = this.getThemeColors();
        
        // Partikülleri çiz (küçük daireler)
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = colors.particle + particle.opacity + ')';
            this.ctx.fill();
        });
        
        // Birbirine yakın partiküller arasında çizgiler çiz (network efekti)
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // 120px menzil içindeki partiküller arasında çizgi çiz
                if (distance < 120) {
                    const opacity = (120 - distance) / 120 * 0.1; // Mesafeye göre şeffaflık
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = colors.connection + opacity + ')';
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
    }
    
    // Animasyon döngüsü
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateParticles();
        this.drawParticles();
        requestAnimationFrame(() => this.animate()); // Sonraki frame'i bekle
    }
    
    // Event listener'ları bağla
    bindEvents() {
        // Ekran boyutu değiştiğinde canvas'ı yeniden boyutlandır
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });
        
        // Fare hareketini takip et
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        // Fare sayfadan çıktığında pozisyonu resetle
        window.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });
    }
}

/* ========================================
   INITIALIZATION
   ======================================== */
// Sayfa yüklendiğinde partikül sistemini başlat
window.addEventListener('load', () => {
    new ParticleSystem();
    
    // Orijinal başlığı güncelle (tab değişimi için)
    originalTitle = document.title;
});

/* ========================================
   TAB VISIBILITY HANDLER
   ======================================== */
// Sekme değişikliğini dinle ve başlığı güncelle
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Sekme arkaplanda - "Geri Gel!" başlığını göster
        document.title = getCurrentHiddenTitle();
    } else {
        // Sekme görünür - orijinal başlığı geri yükle
        document.title = originalTitle;
    }
});
