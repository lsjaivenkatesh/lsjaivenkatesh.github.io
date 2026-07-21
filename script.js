// ========================================
// PARTICLE SYSTEM
// ========================================
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.particleCount = window.innerWidth < 768 ? 40 : 80;
        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.4 + 0.1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around screen
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(230, 57, 70, ${p.opacity})`;
            this.ctx.fill();

            // Draw connections
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(230, 57, 70, ${0.06 * (1 - dist / 120)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// CURSOR GLOW
// ========================================
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow || window.innerWidth < 768) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    function updateGlow() {
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;
        glow.style.left = currentX + 'px';
        glow.style.top = currentY + 'px';
        requestAnimationFrame(updateGlow);
    }

    updateGlow();
}

// ========================================
// TYPING EFFECT
// ========================================
function initTypingEffect() {
    const element = document.getElementById('typedTitle');
    if (!element) return;

    const titles = [
        'Backend Software Engineer',
        'Python Developer',
        'API Architect',
        'Data Pipeline Engineer',
        'Gen AI Enthusiast'
    ];

    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout;

    function type() {
        const current = titles[titleIndex];

        if (isDeleting) {
            element.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 30 : 60;

        if (!isDeleting && charIndex === current.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            speed = 300;
        }

        timeout = setTimeout(type, speed);
    }

    // Start after a short delay
    setTimeout(type, 800);
}

// ========================================
// SCROLL ANIMATIONS (Intersection Observer)
// ========================================
function initScrollAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, parseInt(delay));
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
        observer.observe(el);
    });
}

// ========================================
// SKILL BAR ANIMATIONS
// ========================================
function initSkillBars() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const fills = entry.target.querySelectorAll('.skill-fill');
                    fills.forEach((fill, index) => {
                        setTimeout(() => {
                            const width = fill.dataset.width;
                            fill.style.width = width + '%';
                            fill.classList.add('animate');
                        }, index * 150);
                    });
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 }
    );

    document.querySelectorAll('.skill-category').forEach((el) => {
        observer.observe(el);
    });
}

// ========================================
// COUNTER ANIMATION
// ========================================
function initCounters() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const counters = entry.target.querySelectorAll('.stat-number');
                    counters.forEach((counter) => {
                        const target = parseInt(counter.dataset.count);
                        let current = 0;
                        const duration = 1500;
                        const increment = target / (duration / 16);

                        function updateCounter() {
                            current += increment;
                            if (current < target) {
                                counter.textContent = Math.floor(current);
                                requestAnimationFrame(updateCounter);
                            } else {
                                counter.textContent = target;
                            }
                        }

                        updateCounter();
                    });
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    const stats = document.querySelector('.hero-stats');
    if (stats) observer.observe(stats);
}

// ========================================
// NAVBAR SCROLL BEHAVIOR
// ========================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Scroll class
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link tracking
        let currentSection = '';
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scroll on click
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }

            // Close mobile menu
            document.getElementById('navLinks').classList.remove('active');
            document.getElementById('navToggle').classList.remove('active');
        });
    });
}

// ========================================
// MOBILE MENU TOGGLE
// ========================================
function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('active');
    });
}

// ========================================
// TIMELINE PROGRESS
// ========================================
function initTimelineProgress() {
    const timeline = document.querySelector('.timeline');
    const progress = document.getElementById('timelineProgress');
    if (!timeline || !progress) return;

    window.addEventListener('scroll', () => {
        const rect = timeline.getBoundingClientRect();
        const timelineTop = rect.top;
        const timelineHeight = rect.height;
        const windowHeight = window.innerHeight;

        if (timelineTop < windowHeight && rect.bottom > 0) {
            const scrolled = Math.min(
                Math.max((windowHeight - timelineTop) / (timelineHeight + windowHeight / 2), 0),
                1
            );
            progress.style.height = (scrolled * 100) + '%';
        }
    });
}

// ========================================
// SMOOTH LOGO CLICK
// ========================================
function initLogoClick() {
    const logo = document.querySelector('.nav-logo');
    if (logo) {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// ========================================
// INITIALIZE EVERYTHING
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Particle system
    const canvas = document.getElementById('particleCanvas');
    if (canvas) new ParticleSystem(canvas);

    // All other initializations
    initCursorGlow();
    initTypingEffect();
    initScrollAnimations();
    initSkillBars();
    initCounters();
    initNavbar();
    initMobileMenu();
    initTimelineProgress();
    initLogoClick();
});
