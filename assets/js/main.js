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
    personal: {
        tr: 'Geri Gel! 🧐',  // Türkçe: Sekme arkaplanda iken gösterilen başlık (Kişisel mod)
        en: 'Come Back! 🧐'  // İngilizce: Sekme arkaplanda iken gösterilen başlık (Kişisel mod)
    },
    gamer: {
        tr: 'Oyuna Geri Dön! 🎮',  // Türkçe: Sekme arkaplanda iken gösterilen başlık (Oyuncu mod)
        en: 'Return to Game! 🎮'  // İngilizce: Sekme arkaplanda iken gösterilen başlık (Oyuncu mod)
    }
};

// Mevcut dile ve moda göre gizlenmiş başlığı döndürür
function getCurrentHiddenTitle() {
    const currentLang = document.body.classList.contains('lang-en') ? 'en' : 'tr';
    const currentMode = document.body.classList.contains('gamer-mode-active') ? 'gamer' : 'personal';
    return hiddenTitles[currentMode][currentLang];
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

// Kaydedilmiş tema tercihini yükle (varsayılan: dark)
const theme = localStorage.getItem('theme') || 'dark';
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
    // Bio bölümünü çevir (her iki mod için)
    const bios = document.querySelectorAll('.bio');
    bios.forEach(bio => {
        if (bio && bio.hasAttribute('data-tr') && bio.hasAttribute('data-en')) {
            bio.textContent = bio.getAttribute(`data-${lang}`);
        }
    });
    
    // Açıklama bölümünü çevir (her iki mod için)
    const descriptions = document.querySelectorAll('.description');
    descriptions.forEach(description => {
        if (description && description.hasAttribute('data-tr') && description.hasAttribute('data-en')) {
            description.textContent = description.getAttribute(`data-${lang}`);
        }
    });
    
    // Email butonundaki metni çevir
    const emailLink = document.querySelector('a[href^="mailto:"]');
    if (emailLink) {
        const emailSpan = emailLink.querySelector('span[data-tr]');
        if (emailSpan) {
            emailSpan.textContent = emailSpan.getAttribute(`data-${lang}`);
        }
    }
    
    // Footer metnini çevir (her iki mod için)
    const footerSpans = document.querySelectorAll('.footer span[data-tr]');
    footerSpans.forEach(footerSpan => {
        if (footerSpan && footerSpan.hasAttribute('data-tr') && footerSpan.hasAttribute('data-en')) {
            footerSpan.textContent = footerSpan.getAttribute(`data-${lang}`);
        }
    });
    
    // Sayfa başlığını çevir (moda göre)
    updateTitleForMode();
    
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
        this.mouse = { x: 0, y: 0 };
        this.time = 0; // Animasyon zamanı (oyuncu modu efektleri için)
        
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
        const isGamerMode = document.body.classList.contains('gamer-mode-active');
        const particleCount = this.getParticleCount();
        
        for (let i = 0; i < particleCount; i++) {
            const isGamer = isGamerMode;
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * (isGamer ? 1.2 : 0.5), // Oyuncu modunda daha hızlı
                vy: (Math.random() - 0.5) * (isGamer ? 1.2 : 0.5),
                size: Math.random() * (isGamer ? 3 : 2) + (isGamer ? 1.5 : 1),
                opacity: Math.random() * (isGamer ? 0.8 : 0.5) + (isGamer ? 0.4 : 0.2),
                originalOpacity: Math.random() * (isGamer ? 0.8 : 0.5) + (isGamer ? 0.4 : 0.2),
                colorType: isGamer ? (Math.random() > 0.5 ? 'primary' : 'alt') : 'normal', // Renk tipi
                pulseSpeed: isGamer ? Math.random() * 0.02 + 0.01 : 0 // Pulse hızı
            });
        }
    }
    
    // Mevcut tema rengine göre partikül renklerini döndür
    getThemeColors() {
        const isDark = document.body.classList.contains('dark');
        const isGamerMode = document.body.classList.contains('gamer-mode-active');
        
        // Oyuncu modunda özel renkler
        if (isGamerMode) {
            return {
                particle: 'rgba(99, 102, 241, ', // Indigo
                particleAlt: 'rgba(139, 92, 246, ', // Purple
                connection: 'rgba(99, 102, 241, ',
                connectionAlt: 'rgba(139, 92, 246, '
            };
        }
        
        // Normal mod
        return {
            particle: isDark ? 'rgba(250, 250, 250, ' : 'rgba(10, 10, 10, ',
            connection: isDark ? 'rgba(250, 250, 250, ' : 'rgba(10, 10, 10, '
        };
    }
    
    // Oyuncu modunda partikül sayısını artır
    getParticleCount() {
        const isGamerMode = document.body.classList.contains('gamer-mode-active');
        return isGamerMode ? 80 : 50; // Oyuncu modunda daha fazla partikül
    }
    
    // Partiküllerin pozisyonlarını ve hızlarını güncelle
    updateParticles() {
        const colors = this.getThemeColors();
        const isGamerMode = document.body.classList.contains('gamer-mode-active');
        this.time += 0.016; // ~60fps için zaman artışı
        
        this.particles.forEach((particle, index) => {
            // Oyuncu modunda pulse efekti
            if (isGamerMode && particle.pulseSpeed) {
                const pulse = Math.sin(this.time * particle.pulseSpeed + index) * 0.3 + 1;
                particle.currentOpacity = particle.originalOpacity * pulse;
            } else {
                particle.currentOpacity = particle.originalOpacity;
            }
            
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
            
            // Fare etkileşimi (oyuncu modunda daha geniş menzil)
            const mouseRange = isGamerMode ? 150 : 100;
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouseRange) {
                // Fare yakınlığına göre partikülü etkile
                const force = (mouseRange - distance) / mouseRange;
                const forceMultiplier = isGamerMode ? 0.02 : 0.01;
                particle.vx -= (dx / distance) * force * forceMultiplier;
                particle.vy -= (dy / distance) * force * forceMultiplier;
                particle.currentOpacity = particle.originalOpacity + force * (isGamerMode ? 0.5 : 0.3);
            } else {
                particle.currentOpacity = particle.originalOpacity;
            }
            
            // Hızı sınırla (oyuncu modunda daha yüksek hız limiti)
            const maxSpeed = isGamerMode ? 2 : 1;
            particle.vx = Math.max(-maxSpeed, Math.min(maxSpeed, particle.vx));
            particle.vy = Math.max(-maxSpeed, Math.min(maxSpeed, particle.vy));
        });
    }
    
    // Partikülleri ve bağlantıları çiz
    drawParticles() {
        const colors = this.getThemeColors();
        const isGamerMode = document.body.classList.contains('gamer-mode-active');
        
        // Birbirine yakın partiküller arasında çizgiler çiz (network efekti)
        // Oyuncu modunda önce çizgileri çiz, böylece partiküller üstte kalır
        const connectionRange = isGamerMode ? 150 : 120;
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionRange) {
                    const opacityFactor = isGamerMode ? 0.2 : 0.1;
                    const opacity = (connectionRange - distance) / connectionRange * opacityFactor;
                    
                    // Oyuncu modunda gradient çizgiler
                    if (isGamerMode) {
                        const gradient = this.ctx.createLinearGradient(
                            this.particles[i].x, this.particles[i].y,
                            this.particles[j].x, this.particles[j].y
                        );
                        const color1 = colors.connection + opacity + ')';
                        const color2 = colors.connectionAlt ? colors.connectionAlt + opacity + ')' : color1;
                        gradient.addColorStop(0, color1);
                        gradient.addColorStop(1, color2);
                        this.ctx.strokeStyle = gradient;
                    } else {
                        this.ctx.strokeStyle = colors.connection + opacity + ')';
                    }
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.lineWidth = isGamerMode ? 1 : 0.5;
                    this.ctx.stroke();
                }
            }
        }
        
        // Partikülleri çiz (oyuncu modunda glow efekti ile)
        this.particles.forEach(particle => {
            const opacity = particle.currentOpacity || particle.opacity || particle.originalOpacity;
            
            if (isGamerMode) {
                // Glow efekti için dış halka
                const glowGradient = this.ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.size * 3
                );
                const color = particle.colorType === 'alt' && colors.particleAlt 
                    ? colors.particleAlt 
                    : colors.particle;
                glowGradient.addColorStop(0, color + opacity + ')');
                glowGradient.addColorStop(0.5, color + opacity * 0.5 + ')');
                glowGradient.addColorStop(1, color + '0)');
                
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
                this.ctx.fillStyle = glowGradient;
                this.ctx.fill();
            }
            
            // Ana partikül
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            const particleColor = isGamerMode 
                ? (particle.colorType === 'alt' && colors.particleAlt 
                    ? colors.particleAlt 
                    : colors.particle)
                : colors.particle;
            this.ctx.fillStyle = particleColor + opacity + ')';
            this.ctx.fill();
            
            // Oyuncu modunda iç parlaklık
            if (isGamerMode) {
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
                this.ctx.fillStyle = 'rgba(255, 255, 255, ' + (opacity * 0.6) + ')';
                this.ctx.fill();
            }
        });
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
   MODE TOGGLE SYSTEM
   ======================================== */
// Mod değiştirme sistemi (Kişisel/Oyuncu)
const modeToggleBtn = document.getElementById('modeToggleBtn');
const personalMode = document.getElementById('personalMode');
const gamerMode = document.getElementById('gamerMode');

// Varsayılan mod: her zaman kişisel mod (localStorage yok sayılıyor)
const defaultMode = 'personal';

// Sayfa yüklendiğinde modu ayarla
function setMode(mode) {
    if (!personalMode || !gamerMode || !modeToggleBtn) {
        console.error('Mode elements not found');
        return;
    }
    
    if (mode === 'gamer') {
        body.classList.add('gamer-mode-active');
        personalMode.classList.remove('active');
        gamerMode.classList.add('active');
        modeToggleBtn.textContent = '👤'; // Kişisel moda geç butonu
    } else {
        body.classList.remove('gamer-mode-active');
        personalMode.classList.add('active');
        gamerMode.classList.remove('active');
        modeToggleBtn.textContent = '🎮'; // Oyuncu moduna geç butonu
    }
    // Mod tercihini localStorage'a kaydetme (her zaman kişisel modda başlasın)
    // localStorage.setItem('siteMode', mode); // Devre dışı
    
    // İkonları yeniden yükle (Lucide)
    lucide.createIcons();
    
    // Dil ayarlarını güncelle (her iki mod için de)
    const currentLang = document.body.classList.contains('lang-en') ? 'en' : 'tr';
    setLanguage(currentLang);
    
    // Title'ı moda göre güncelle
    updateTitleForMode();
    
    // Partikülleri moda göre yeniden oluştur
    if (particleSystem) {
        particleSystem.createParticles();
    }
}

// Title'ı mevcut mod ve dile göre güncelle
function updateTitleForMode() {
    const currentLang = document.body.classList.contains('lang-en') ? 'en' : 'tr';
    const currentMode = document.body.classList.contains('gamer-mode-active') ? 'gamer' : 'personal';
    const title = document.querySelector('title');
    
    if (title) {
        const titleAttr = `data-${currentLang}-${currentMode}`;
        const newTitle = title.getAttribute(titleAttr);
        if (newTitle) {
            title.textContent = newTitle;
            originalTitle = newTitle;
        }
    }
    
    // Meta etiketlerini de güncelle
    updateMetaTagsForMode();
}

// Meta etiketlerini mevcut mod ve dile göre güncelle
function updateMetaTagsForMode() {
    const currentLang = document.body.classList.contains('lang-en') ? 'en' : 'tr';
    const currentMode = document.body.classList.contains('gamer-mode-active') ? 'gamer' : 'personal';
    
    // OG Title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
        const titleAttr = `data-${currentLang}-${currentMode}`;
        const newTitle = ogTitle.getAttribute(titleAttr);
        if (newTitle) {
            ogTitle.setAttribute('content', newTitle);
        }
    }
    
    // OG Description
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
        const descAttr = `data-${currentLang}-${currentMode}`;
        const newDesc = ogDesc.getAttribute(descAttr);
        if (newDesc) {
            ogDesc.setAttribute('content', newDesc);
        }
    }
    
    // Twitter Title
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle && ogTitle) {
        twitterTitle.setAttribute('content', ogTitle.getAttribute('content'));
    }
    
    // Twitter Description
    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc && ogDesc) {
        twitterDesc.setAttribute('content', ogDesc.getAttribute('content'));
    }
}

// DOM yüklendiğinde mod sistemini başlat
function initModeSystem() {
    if (!modeToggleBtn || !personalMode || !gamerMode) {
        console.error('Mode toggle elements not found');
        return;
    }
    
    // İlk yüklemede her zaman kişisel modda başla
    setMode(defaultMode);
    
    // Mod toggle butonuna tıklama eventi
    modeToggleBtn.addEventListener('click', () => {
        const currentMode = body.classList.contains('gamer-mode-active') ? 'gamer' : 'personal';
        const newMode = currentMode === 'gamer' ? 'personal' : 'gamer';
        setMode(newMode);
    });
}

/* ========================================
   INITIALIZATION
   ======================================== */
// Particle system instance'ını global tut (mod değişikliklerinde erişmek için)
let particleSystem = null;

// DOM hazır olduğunda mod sistemini başlat
document.addEventListener('DOMContentLoaded', () => {
    // Mod sistemini başlat
    initModeSystem();
});

// Sayfa tamamen yüklendiğinde partikül sistemini başlat
window.addEventListener('load', () => {
    particleSystem = new ParticleSystem();
    
    // Title'ı başlangıç moduna göre güncelle
    if (typeof updateTitleForMode === 'function') {
        updateTitleForMode();
        originalTitle = document.title;
    }
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
