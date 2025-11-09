/* ========================================
   İKON SİSTEMİ
   ======================================== */

// Lucide icon kütüphanesini başlat
lucide.createIcons();

/* ========================================
   SEKME BAŞLIĞI YÖNETİMİ
   ======================================== */

// Sekme arkaplanda iken gösterilecek başlıklar
let originalTitle = document.title;
const hiddenTitles = {
    personal: {
        tr: 'Geri Gel! 🧐',
        en: 'Come Back! 🧐'
    },
    gamer: {
        tr: 'Oyuna Geri Dön! 🎮',
        en: 'Return to Game! 🎮'
    }
};

// Mevcut mod ve dile göre başlık döndür
function getCurrentHiddenTitle() {
    const currentLang = document.body.classList.contains('lang-en') ? 'en' : 'tr';
    const currentMode = document.body.classList.contains('gamer-mode-active') ? 'gamer' : 'personal';
    return hiddenTitles[currentMode][currentLang];
}

/* ========================================
   GÜVENLİK ÖZELLİKLERİ
   ======================================== */

// Sağ tıklama engelle
document.addEventListener('contextmenu', (e) => e.preventDefault());

// Developer tools kısayollarını engelle
document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
    }
});

// Metin seçimini engelle
document.addEventListener('selectstart', (e) => e.preventDefault());

// Drag & drop engelle
document.addEventListener('dragstart', (e) => e.preventDefault());

/* ========================================
   TEMA DEĞİŞTİRİCİ
   ======================================== */

const themeBtn = document.getElementById('themeBtn');
const body = document.body;

// Kayıtlı tema tercihini yükle (varsayılan: dark - ilk ziyarette localStorage'a kaydetme)
const savedTheme = localStorage.getItem('theme');
const theme = savedTheme || 'dark'; // Varsayılan dark

// Tema uygula
if (theme === 'dark') {
    body.classList.add('dark');
    themeBtn.textContent = '☀️';
} else {
    body.classList.remove('dark');
    themeBtn.textContent = '🌙';
}

// Tema butonuna tıklama
themeBtn.addEventListener('click', () => {
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');
    themeBtn.textContent = isDark ? '☀️' : '🌙';
    // Kullanıcı tercihini localStorage'a kaydet
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

/* ========================================
   DİL DEĞİŞTİRİCİ
   ======================================== */

const trBtn = document.getElementById('trBtn');
const enBtn = document.getElementById('enBtn');
const htmlElement = document.documentElement;

// Kayıtlı dil tercihini yükle (varsayılan: Türkçe)
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

// Dil ayarını uygula
setLanguage(savedLanguage);

// Dil değiştirme fonksiyonu
function setLanguage(lang) {
    // HTML lang attribute güncelle
    htmlElement.setAttribute('lang', lang);
    
    // Body class güncelle
    document.body.classList.remove('lang-tr', 'lang-en');
    document.body.classList.add(`lang-${lang}`);
    
    // Buton durumları
    trBtn.classList.toggle('active', lang === 'tr');
    enBtn.classList.toggle('active', lang === 'en');
    
    // Çevrilecek elementler
    document.querySelectorAll('.bio, .description').forEach(el => {
        if (el.hasAttribute('data-tr') && el.hasAttribute('data-en')) {
            el.textContent = el.getAttribute(`data-${lang}`);
        }
    });
    
    // Email butonu metni
    const emailSpan = document.querySelector('a[href^="mailto:"] span[data-tr]');
    if (emailSpan) {
        emailSpan.textContent = emailSpan.getAttribute(`data-${lang}`);
    }
    
    // Footer metni
    document.querySelectorAll('.footer span[data-tr]').forEach(el => {
        if (el.hasAttribute('data-tr') && el.hasAttribute('data-en')) {
            el.textContent = el.getAttribute(`data-${lang}`);
        }
    });
    
    // Başlık ve meta etiketlerini güncelle
    updateTitleForMode();
    updateMetaTags(lang);
    
    // Tercihi kaydet
    localStorage.setItem('language', lang);
}

// Meta etiketlerini güncelle
function updateMetaTags(lang) {
    const currentMode = document.body.classList.contains('gamer-mode-active') ? 'gamer' : 'personal';
    const attr = `data-${lang}-${currentMode}`;
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    
    if (ogTitle && ogTitle.hasAttribute(attr)) {
        ogTitle.setAttribute('content', ogTitle.getAttribute(attr));
    }
    
    if (ogDesc && ogDesc.hasAttribute(attr)) {
        ogDesc.setAttribute('content', ogDesc.getAttribute(attr));
    }
    
    // Twitter meta
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    
    if (twitterTitle && ogTitle) {
        twitterTitle.setAttribute('content', ogTitle.getAttribute('content'));
    }
    
    if (twitterDesc && ogDesc) {
        twitterDesc.setAttribute('content', ogDesc.getAttribute('content'));
    }
}

// Dil buton event listener'ları
trBtn.addEventListener('click', () => setLanguage('tr'));
enBtn.addEventListener('click', () => setLanguage('en'));

/* ========================================
   PARTİKÜL SİSTEMİ
   ======================================== */

// Arkaplan partikül animasyonu
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.time = 0;
        this.isVisible = true;
        this.animationFrameId = null;
        this.lastMouseUpdate = 0;
        this.mouseThrottle = 16; // ~60fps için throttle
        
        this.init();
        this.bindEvents();
        this.animate();
    }
    
    init() {
        this.resize();
        this.createParticles();
    }
    
    // Canvas boyutunu ekrana göre ayarla
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    // Rastgele partiküller oluştur
    createParticles() {
        this.particles = [];
        const isGamerMode = document.body.classList.contains('gamer-mode-active');
        // Performans optimizasyonu: Partikül sayısını azalt
        const particleCount = isGamerMode ? 50 : 35; // Daha az partikül = daha iyi performans
        
        for (let i = 0; i < particleCount; i++) {
            const rand = Math.random();
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * (isGamerMode ? 1.5 : 0.3), // Kişisel modda daha yavaş
                vy: (Math.random() - 0.5) * (isGamerMode ? 1.5 : 0.3),
                size: Math.random() * (isGamerMode ? 4 : 1.5) + (isGamerMode ? 2 : 0.8), // Kişisel modda daha küçük
                opacity: Math.random() * (isGamerMode ? 1.0 : 0.4) + (isGamerMode ? 0.5 : 0.3),
                originalOpacity: Math.random() * (isGamerMode ? 1.0 : 0.4) + (isGamerMode ? 0.5 : 0.3),
                // Renk tipleri: Oyuncu modu (indigo/purple/live), Kişisel mod (cyber/network/secure)
                colorType: isGamerMode 
                    ? (rand < 0.4 ? 'primary' : rand < 0.8 ? 'alt' : 'live')
                    : (rand < 0.4 ? 'cyber' : rand < 0.7 ? 'network' : 'secure'),
                pulseSpeed: isGamerMode ? Math.random() * 0.03 + 0.015 : Math.random() * 0.02 + 0.005, // Kişisel modda yavaş pulse
                // Trail kaldırıldı - performans optimizasyonu
                dataFlow: !isGamerMode ? Math.random() * Math.PI * 2 : 0 // Kişisel modda veri akışı açısı
            });
        }
    }
    
    // Tema renklerini al
    getThemeColors() {
        const isDark = document.body.classList.contains('dark');
        const isGamerMode = document.body.classList.contains('gamer-mode-active');
        
        if (isGamerMode) {
            return {
                particle: 'rgba(99, 102, 241, ',      // Indigo
                particleAlt: 'rgba(139, 92, 246, ',    // Purple
                particleLive: 'rgba(239, 68, 68, ',    // Kırmızı (LIVE teması)
                connection: 'rgba(99, 102, 241, ',
                connectionAlt: 'rgba(139, 92, 246, ',
                connectionLive: 'rgba(239, 68, 68, '
            };
        }
        
        // Kişisel Mod: Siber Güvenlik Teması
        return {
            particle: 'rgba(16, 185, 129, ',         // Cyber Green
            particleAlt: 'rgba(6, 182, 212, ',        // Network Cyan
            particleSecure: 'rgba(34, 197, 94, ',     // Secure Green
            connection: 'rgba(16, 185, 129, ',        // Cyber Green
            connectionAlt: 'rgba(6, 182, 212, ',      // Network Cyan
            connectionSecure: 'rgba(34, 197, 94, '     // Secure Green
        };
    }
    
    // Partikül pozisyonlarını güncelle
    updateParticles() {
        const isGamerMode = document.body.classList.contains('gamer-mode-active');
        this.time += 0.016;
        
        this.particles.forEach((particle, index) => {
            // Pulse efekti
            if (particle.pulseSpeed) {
                if (isGamerMode) {
                    // Oyuncu modu: çift pulse
                    const pulse1 = Math.sin(this.time * particle.pulseSpeed + index) * 0.4 + 1;
                    const pulse2 = Math.cos(this.time * particle.pulseSpeed * 1.5 + index * 0.5) * 0.2 + 1;
                    particle.currentOpacity = particle.originalOpacity * pulse1 * pulse2;
                } else {
                    // Kişisel mod: network tarzı yavaş pulse
                    const pulse = Math.sin(this.time * particle.pulseSpeed + index * 0.5) * 0.2 + 1;
                    particle.currentOpacity = particle.originalOpacity * pulse;
                }
            } else {
                particle.currentOpacity = particle.originalOpacity;
            }
            
            // Trail efekti kaldırıldı - performans optimizasyonu
            
            // Kişisel mod: Veri akışı efekti (network benzeri)
            if (!isGamerMode && particle.dataFlow !== undefined) {
                particle.dataFlow += 0.02;
                // Yavaş dairesel hareket
                const radius = 0.5;
                particle.vx += Math.cos(particle.dataFlow) * 0.01;
                particle.vy += Math.sin(particle.dataFlow) * 0.01;
            }
            
            // Pozisyon güncelle
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Kenarlarda sektir
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= isGamerMode ? -0.95 : -0.98; // Kişisel modda daha yumuşak
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= isGamerMode ? -0.95 : -0.98;
            }
            
            // Sınırlar içinde tut
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            
            // Fare etkileşimi
            const mouseRange = isGamerMode ? 200 : 120;
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouseRange && isGamerMode) {
                const force = Math.pow((mouseRange - distance) / mouseRange, 2);
                const forceMultiplier = 0.03;
                const angle = Math.atan2(dy, dx);
                
                particle.vx -= Math.cos(angle) * force * forceMultiplier;
                particle.vy -= Math.sin(angle) * force * forceMultiplier;
                particle.currentOpacity = Math.min(1, particle.originalOpacity + force * 0.8);
            } else if (distance < mouseRange) {
                // Kişisel mod: Daha hafif etkileşim
                const force = (mouseRange - distance) / mouseRange;
                particle.vx -= (dx / distance) * force * 0.008;
                particle.vy -= (dy / distance) * force * 0.008;
                particle.currentOpacity = Math.min(1, particle.originalOpacity + force * 0.4);
            }
            
            // Hız sınırla
            const maxSpeed = isGamerMode ? 3 : 0.8;
            particle.vx = Math.max(-maxSpeed, Math.min(maxSpeed, particle.vx));
            particle.vy = Math.max(-maxSpeed, Math.min(maxSpeed, particle.vy));
        });
    }
    
    // Partikülleri çiz
    drawParticles() {
        const colors = this.getThemeColors();
        const isGamerMode = document.body.classList.contains('gamer-mode-active');
        const connectionRange = isGamerMode ? 150 : 100; // Performans için biraz azaltıldı
        const connectionRangeSq = connectionRange * connectionRange; // sqrt'den kaçınmak için
        
        // Partiküller arası bağlantılar - Optimize edilmiş
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distanceSq = dx * dx + dy * dy; // sqrt yerine squared distance kullan
                
                if (distanceSq < connectionRangeSq) {
                    const distance = Math.sqrt(distanceSq); // Sadece gerektiğinde sqrt hesapla
                    const opacityFactor = isGamerMode ? 0.25 : 0.1;
                    const opacity = Math.pow((connectionRange - distance) / connectionRange, 2) * opacityFactor;
                    
                    // Performans optimizasyonu: Basit renk kullan (gradient yerine)
                    let connectionColor;
                    if (isGamerMode) {
                        if (this.particles[i].colorType === 'live' || this.particles[j].colorType === 'live') {
                            connectionColor = colors.connectionLive;
                        } else if (this.particles[i].colorType === 'alt' || this.particles[j].colorType === 'alt') {
                            connectionColor = colors.connectionAlt;
                        } else {
                            connectionColor = colors.connection;
                        }
                    } else {
                        if (this.particles[i].colorType === 'secure' || this.particles[j].colorType === 'secure') {
                            connectionColor = colors.connectionSecure;
                        } else if (this.particles[i].colorType === 'network' || this.particles[j].colorType === 'network') {
                            connectionColor = colors.connectionAlt;
                        } else {
                            connectionColor = colors.connection;
                        }
                    }
                    
                    this.ctx.strokeStyle = connectionColor + opacity + ')';
                    this.ctx.lineWidth = isGamerMode ? 1.2 : 0.7;
                    // Shadow blur kaldırıldı - performans optimizasyonu
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
        
        // Partikülleri çiz - Optimize edilmiş (glow efektleri basitleştirildi)
        this.particles.forEach(particle => {
            const opacity = particle.currentOpacity || particle.originalOpacity;
            
            // Basit glow efekti (performans için gradient yerine basit renk)
            const particleColor = isGamerMode 
                ? (particle.colorType === 'live' 
                    ? colors.particleLive 
                    : particle.colorType === 'alt' 
                    ? colors.particleAlt 
                    : colors.particle)
                : (particle.colorType === 'secure' 
                    ? colors.particleSecure 
                    : particle.colorType === 'network' 
                    ? colors.particleAlt 
                    : colors.particle);
            
            // Glow için basit dairesel alan (gradient yerine)
            if (isGamerMode) {
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
                this.ctx.fillStyle = particleColor + (opacity * 0.15) + ')';
                this.ctx.fill();
            } else {
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
                this.ctx.fillStyle = particleColor + (opacity * 0.1) + ')';
                this.ctx.fill();
            }
            
            // Ana partikül - Basitleştirilmiş
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particleColor + opacity + ')';
            this.ctx.fill();
        });
    }
    
    // Animasyon döngüsü - Visibility API ile optimize edilmiş
    animate() {
        // Sekme görünür değilse animasyonu durdur
        if (!this.isVisible) {
            this.animationFrameId = requestAnimationFrame(() => this.animate());
            return;
        }
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateParticles();
        this.drawParticles();
        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }
    
    // Event listener'ları bağla
    bindEvents() {
        // Resize event'i throttle edildi
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resize();
                this.createParticles();
            }, 150);
        });
        
        // Mouse move throttle edildi - performans optimizasyonu
        window.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - this.lastMouseUpdate >= this.mouseThrottle) {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
                this.lastMouseUpdate = now;
            }
        });
        
        window.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });
        
        // Visibility API - Sekme arka planda iken animasyonu durdur
        document.addEventListener('visibilitychange', () => {
            this.isVisible = !document.hidden;
            if (!this.isVisible && this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
            } else if (this.isVisible) {
                this.animate();
            }
        });
    }
}

/* ========================================
   MOD DEĞİŞTİRME SİSTEMİ
   ======================================== */

const modeToggleBtn = document.getElementById('modeToggleBtn');
const personalMode = document.getElementById('personalMode');
const gamerMode = document.getElementById('gamerMode');
const defaultMode = 'personal';

// Mod değiştirme fonksiyonu
function setMode(mode) {
    if (!personalMode || !gamerMode || !modeToggleBtn) return;
    
    if (mode === 'gamer') {
        body.classList.add('gamer-mode-active');
        personalMode.classList.remove('active');
        gamerMode.classList.add('active');
        modeToggleBtn.textContent = '👤';
    } else {
        body.classList.remove('gamer-mode-active');
        personalMode.classList.add('active');
        gamerMode.classList.remove('active');
        modeToggleBtn.textContent = '🎮';
    }
    
    // İkonları yenile
    lucide.createIcons();
    
    // Dil ayarlarını güncelle
    const currentLang = document.body.classList.contains('lang-en') ? 'en' : 'tr';
    setLanguage(currentLang);
    
    // Başlık ve partikülleri güncelle
    updateTitleForMode();
    if (particleSystem) {
        particleSystem.createParticles();
    }
}

// Başlığı mod ve dile göre güncelle
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
    
    // Meta etiketlerini güncelle
    updateMetaTags(currentLang);
}

// Mod sistemini başlat
function initModeSystem() {
    if (!modeToggleBtn || !personalMode || !gamerMode) return;
    
    setMode(defaultMode);
    
    modeToggleBtn.addEventListener('click', () => {
        const currentMode = body.classList.contains('gamer-mode-active') ? 'gamer' : 'personal';
        setMode(currentMode === 'gamer' ? 'personal' : 'gamer');
    });
}

/* ========================================
   BAŞLATMA
   ======================================== */

let particleSystem = null;

// DOM yüklendiğinde mod sistemini başlat
document.addEventListener('DOMContentLoaded', () => {
    initModeSystem();
});

// Sayfa tamamen yüklendiğinde partikül sistemini başlat
window.addEventListener('load', () => {
    particleSystem = new ParticleSystem();
    if (typeof updateTitleForMode === 'function') {
        updateTitleForMode();
        originalTitle = document.title;
    }
});

// Sekme görünürlük değişikliği
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.title = getCurrentHiddenTitle();
    } else {
        document.title = originalTitle;
    }
});

