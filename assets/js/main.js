// Initialize Lucide icons
lucide.createIcons();

// Security: Disable right-click, F12, and developer tools
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

document.addEventListener('keydown', function(e) {
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+Shift+C
    if (e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
        (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
        (e.ctrlKey && e.keyCode === 85) || // Ctrl+U
        (e.ctrlKey && e.shiftKey && e.keyCode === 67)) { // Ctrl+Shift+C
        e.preventDefault();
        return false;
    }
});

// Disable text selection
document.addEventListener('selectstart', function(e) {
    e.preventDefault();
    return false;
});

// Disable drag
document.addEventListener('dragstart', function(e) {
    e.preventDefault();
    return false;
});

const themeBtn = document.getElementById('themeBtn');
const body = document.body;

const theme = localStorage.getItem('theme') || 'light';
if (theme === 'dark') {
    body.classList.add('dark');
    themeBtn.textContent = '☀️';
}

themeBtn.addEventListener('click', () => {
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');
    themeBtn.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Language switching functionality
const trBtn = document.getElementById('trBtn');
const enBtn = document.getElementById('enBtn');
const htmlElement = document.documentElement;

// Get saved language or default to Turkish
const savedLanguage = localStorage.getItem('language') || 'tr';
document.body.classList.add(`lang-${savedLanguage}`);
if (savedLanguage === 'tr') {
    trBtn.classList.add('active');
} else {
    enBtn.classList.add('active');
}

// Set initial title
const title = document.querySelector('title');
if (title) {
    title.textContent = title.getAttribute(`data-${savedLanguage}`);
}

setLanguage(savedLanguage);

function setLanguage(lang) {
    // Update HTML lang attribute
    htmlElement.setAttribute('lang', lang);
    
    // Update button states
    trBtn.classList.toggle('active', lang === 'tr');
    enBtn.classList.toggle('active', lang === 'en');
    
    // ONLY update elements that actually need translation
    // Bio
    const bio = document.querySelector('.bio');
    if (bio && bio.hasAttribute('data-tr') && bio.hasAttribute('data-en')) {
        bio.textContent = bio.getAttribute(`data-${lang}`);
    }
    
    // Description
    const description = document.querySelector('.description');
    if (description && description.hasAttribute('data-tr') && description.hasAttribute('data-en')) {
        description.textContent = description.getAttribute(`data-${lang}`);
    }
    
    // Email span - use more specific selector
    const emailLink = document.querySelector('a[href^="mailto:"]');
    if (emailLink) {
        const emailSpan = emailLink.querySelector('span[data-tr]');
        if (emailSpan) {
            emailSpan.textContent = emailSpan.getAttribute(`data-${lang}`);
        }
    }
    
    // Footer
    const footerSpan = document.querySelector('.footer span');
    if (footerSpan && footerSpan.hasAttribute('data-tr') && footerSpan.hasAttribute('data-en')) {
        footerSpan.textContent = footerSpan.getAttribute(`data-${lang}`);
    }
    
    // Title
    const title = document.querySelector('title');
    if (title && title.hasAttribute('data-tr') && title.hasAttribute('data-en')) {
        title.textContent = title.getAttribute(`data-${lang}`);
    }
    
    // Meta tags
    const metaTags = document.querySelectorAll('meta[data-tr][data-en]');
    metaTags.forEach(meta => {
        const text = meta.getAttribute(`data-${lang}`);
        if (text) {
            meta.setAttribute('content', text);
        }
    });
    
    // Save language preference
    localStorage.setItem('language', lang);
}

// Add event listeners for language buttons
trBtn.addEventListener('click', () => {
    document.body.classList.remove('lang-en');
    document.body.classList.add('lang-tr');
    trBtn.classList.add('active');
    enBtn.classList.remove('active');
    
    // Update title
    const title = document.querySelector('title');
    if (title) {
        title.textContent = title.getAttribute('data-tr');
    }
    
    localStorage.setItem('language', 'tr');
});

enBtn.addEventListener('click', () => {
    document.body.classList.remove('lang-tr');
    document.body.classList.add('lang-en');
    enBtn.classList.add('active');
    trBtn.classList.remove('active');
    
    // Update title
    const title = document.querySelector('title');
    if (title) {
        title.textContent = title.getAttribute('data-en');
    }
    
    localStorage.setItem('language', 'en');
});

// Particle Effect System
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;
        this.mouse = { x: 0, y: 0 };
        
        this.init();
        this.bindEvents();
        this.animate();
    }
    
    init() {
        this.resize();
        this.createParticles();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                originalOpacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    getThemeColors() {
        const isDark = document.body.classList.contains('dark');
        return {
            particle: isDark ? 'rgba(250, 250, 250, ' : 'rgba(10, 10, 10, ',
            connection: isDark ? 'rgba(250, 250, 250, ' : 'rgba(10, 10, 10, '
        };
    }
    
    updateParticles() {
        const colors = this.getThemeColors();
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }
            
            // Keep particles within bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            
            // Subtle mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx -= (dx / distance) * force * 0.01;
                particle.vy -= (dy / distance) * force * 0.01;
                particle.opacity = particle.originalOpacity + force * 0.3;
            } else {
                particle.opacity = particle.originalOpacity;
            }
            
            // Limit velocity
            particle.vx = Math.max(-1, Math.min(1, particle.vx));
            particle.vy = Math.max(-1, Math.min(1, particle.vy));
        });
    }
    
    drawParticles() {
        const colors = this.getThemeColors();
        
        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = colors.particle + particle.opacity + ')';
            this.ctx.fill();
        });
        
        // Draw connections between nearby particles
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const opacity = (120 - distance) / 120 * 0.1;
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
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateParticles();
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        // Reset mouse position when leaving the window
        window.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });
    }
}

// Initialize particle system when page loads
window.addEventListener('load', () => {
    new ParticleSystem();
});

// Tab change title handler
let originalTitle = document.title;
let hiddenTitle = 'Geri Gel! 😢';

document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Tab switched away - change title
        document.title = hiddenTitle;
    } else {
        // Tab is back - restore original title
        document.title = originalTitle;
    }
});