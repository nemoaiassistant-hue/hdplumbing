// ============================================
// HD Plumbing and Heating — JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    const mobileCta = document.getElementById('mobileCta');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Show mobile CTA after scrolling past hero
        if (mobileCta) {
            if (window.scrollY > 400) {
                mobileCta.style.transform = 'translateY(0)';
            } else {
                mobileCta.style.transform = 'translateY(100%)';
            }
        }
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    // Scroll animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Animate service cards
    document.querySelectorAll('.service-card').forEach((card, i) => {
        card.classList.add('fade-in');
        card.style.transitionDelay = `${i * 80}ms`;
        observer.observe(card);
    });

    // Animate review cards
    document.querySelectorAll('.review-card').forEach((card, i) => {
        card.classList.add('fade-in');
        card.style.transitionDelay = `${i * 100}ms`;
        observer.observe(card);
    });

    // Animate section headers
    document.querySelectorAll('.section-header').forEach(header => {
        header.classList.add('fade-in');
        observer.observe(header);
    });

    // Animate features
    document.querySelectorAll('.feature').forEach((feat, i) => {
        feat.classList.add('fade-in');
        feat.style.transitionDelay = `${i * 80}ms`;
        observer.observe(feat);
    });

    // Animate area tags
    document.querySelectorAll('.area-tag').forEach((tag, i) => {
        tag.classList.add('fade-in');
        tag.style.transitionDelay = `${i * 40}ms`;
        observer.observe(tag);
    });

    // Animate why-us section
    document.querySelectorAll('.why-content, .why-visual, .visual-card, .cta-card, .contact-info, .contact-map').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const position = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: position, behavior: 'smooth' });
            }
        });
    });

    // Counter animation for stats
    const animateCounters = () => {
        document.querySelectorAll('.stat-number, .mini-num').forEach(el => {
            const text = el.textContent;
            const num = parseInt(text);
            if (isNaN(num) || text.includes('/')) return;
            
            const suffix = text.replace(/\d+/, '');
            let current = 0;
            const step = num / 40;
            const timer = setInterval(() => {
                current += step;
                if (current >= num) {
                    el.textContent = text; // restore original
                    clearInterval(timer);
                } else {
                    el.textContent = Math.floor(current) + suffix;
                }
            }, 30);
        });
    };

    // Trigger counter animation when hero stats are visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        heroObserver.observe(heroStats);
    }

});
