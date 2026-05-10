// ============================================
// HD Plumbing and Heating — Scripts
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ---- Navbar Scroll Effect ----
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
            if (window.scrollY > 600) {
                mobileCta.style.transform = 'translateY(0)';
            } else {
                mobileCta.style.transform = 'translateY(100%)';
            }
        }
    });

    // ---- Mobile Menu Toggle ----
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
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

    // ---- Scroll Animations ----
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .review-card, .feature, .area-tag, .gallery-item').forEach((el, i) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${i * 0.05}s`;
        observer.observe(el);
    });

    // ---- Hero Particles ----
    const particleContainer = document.getElementById('heroParticles');
    if (particleContainer) {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'hero-particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.width = `${2 + Math.random() * 4}px`;
            particle.style.height = particle.style.width;
            particle.style.animationDuration = `${4 + Math.random() * 8}s`;
            particle.style.animationDelay = `${Math.random() * 8}s`;
            particle.style.opacity = `${0.2 + Math.random() * 0.4}`;
            particleContainer.appendChild(particle);
        }
    }

    // ---- Gallery Lightbox ----
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    let currentGalleryIndex = 0;

    const galleryData = [];
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-caption');
        galleryData.push({
            src: img.src.replace('w=600', 'w=1200').replace('w=800', 'w=1200'),
            alt: img.alt,
            caption: caption ? caption.innerHTML : ''
        });

        item.addEventListener('click', () => {
            currentGalleryIndex = index;
            openLightbox(index);
        });
    });

    function openLightbox(index) {
        if (!lightbox || !galleryData.length) return;
        lightboxImg.src = galleryData[index].src;
        lightboxImg.alt = galleryData[index].alt;
        lightboxCaption.innerHTML = galleryData[index].caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
        openLightbox(currentGalleryIndex);
    });

    if (lightboxNext) lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
        openLightbox(currentGalleryIndex);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') {
            currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
            openLightbox(currentGalleryIndex);
        }
        if (e.key === 'ArrowRight') {
            currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
            openLightbox(currentGalleryIndex);
        }
    });

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
