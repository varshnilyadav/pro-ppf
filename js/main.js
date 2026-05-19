/* ============================================
   PRO PPF TEAM — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('done');
            document.body.style.overflow = '';
            initRevealAnimations();
            animateCounters();
        }, 2000);
    });

    // --- Custom Cursor ---
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover effect on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .advantage-card, .showcase-slide');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
        });
    }

    // --- Navigation ---
    const nav = document.getElementById('mainNav');
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 80);
    });

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- Scroll Reveal ---
    function initRevealAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

        document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
    }

    // --- Counter Animation ---
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-count'));
                    const duration = 2000;
                    const start = performance.now();

                    function update(now) {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        el.textContent = Math.round(target * eased);
                        if (progress < 1) requestAnimationFrame(update);
                    }
                    requestAnimationFrame(update);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => observer.observe(c));
    }

    // --- Magnetic Button Effect ---
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    if (window.innerWidth > 768) {
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // --- Showcase Slider ---
    const track = document.getElementById('showcaseTrack');
    const prevBtn = document.getElementById('showcasePrev');
    const nextBtn = document.getElementById('showcaseNext');
    const currentSlideEl = document.getElementById('currentSlide');
    const progressBar = document.getElementById('progressBar');
    const slides = document.querySelectorAll('.showcase-slide');
    const totalSlides = slides.length;
    let currentIndex = 0;

    function getSlideWidth() {
        if (window.innerWidth <= 480) return 0.90;
        if (window.innerWidth <= 768) return 0.85;
        if (window.innerWidth <= 1024) return 0.70;
        return 0.50;
    }

    function updateSlider() {
        const slideWidthFraction = getSlideWidth();
        const containerWidth = track.parentElement.clientWidth;
        const slideWidth = containerWidth * slideWidthFraction;
        const gap = 24;
        const offset = currentIndex * (slideWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;
        currentSlideEl.textContent = String(currentIndex + 1).padStart(2, '0');
        progressBar.style.width = ((currentIndex + 1) / totalSlides * 100) + '%';
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = currentIndex > 0 ? currentIndex - 1 : totalSlides - 1;
        updateSlider();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = currentIndex < totalSlides - 1 ? currentIndex + 1 : 0;
        updateSlider();
    });

    // Touch/swipe support
    let touchStartX = 0, touchEndX = 0;
    track.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 60) {
            if (diff > 0) { currentIndex = Math.min(currentIndex + 1, totalSlides - 1); }
            else { currentIndex = Math.max(currentIndex - 1, 0); }
            updateSlider();
        }
    }, { passive: true });

    window.addEventListener('resize', updateSlider);
    updateSlider();

    // Auto-advance slider
    let autoSlide = setInterval(() => {
        currentIndex = currentIndex < totalSlides - 1 ? currentIndex + 1 : 0;
        updateSlider();
    }, 5000);

    // Pause auto-advance on hover
    const sliderEl = document.getElementById('showcaseSlider');
    sliderEl.addEventListener('mouseenter', () => clearInterval(autoSlide));
    sliderEl.addEventListener('mouseleave', () => {
        autoSlide = setInterval(() => {
            currentIndex = currentIndex < totalSlides - 1 ? currentIndex + 1 : 0;
            updateSlider();
        }, 5000);
    });

    // --- Parallax on Hero Orbs ---
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const orb1 = document.querySelector('.hero-orb-1');
            const orb2 = document.querySelector('.hero-orb-2');
            if (orb1) orb1.style.transform = `translateY(${scrollY * 0.15}px)`;
            if (orb2) orb2.style.transform = `translateY(${scrollY * 0.08}px)`;
        });
    }

    // --- Keyboard navigation for slider ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { prevBtn.click(); }
        if (e.key === 'ArrowRight') { nextBtn.click(); }
    });
});
