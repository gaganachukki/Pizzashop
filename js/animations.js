/**
 * STACKLY PIZZA SHOP - FAIL-SAFE GSAP & MOTION ANIMATION SYSTEM
 * Handles entrance reveals, scroll triggers, parallax, 3D card tilt,
 * metric number counters, continuous floating decor & tab transitions.
 * Includes multi-tier fail-safes so elements never remain hidden or stuck.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Respect reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const hasGSAP = typeof gsap !== 'undefined';
  const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';

  if (hasGSAP && hasScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // ==========================================================================
  // 1. HEADER & TOPBAR ENTRANCE
  // ==========================================================================
  if (hasGSAP) {
    if (document.querySelector('.site-header')) {
      gsap.from('.site-header', {
        y: -60,
        opacity: 0,
        duration: 0.75,
        ease: 'power3.out',
        clearProps: 'all'
      });
    }

    if (document.querySelector('.dash-topbar, .admin-topbar')) {
      gsap.from('.dash-topbar, .admin-topbar', {
        y: -45,
        opacity: 0,
        duration: 0.65,
        ease: 'power3.out',
        clearProps: 'all'
      });
    }
  }

  // ==========================================================================
  // 2. HERO SECTION ENTRANCE (HOMEPAGE)
  // ==========================================================================
  const heroSection = document.querySelector('.hero-section');
  if (heroSection && hasGSAP) {
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', clearProps: 'all' } });

    heroTl
      .from('.hero-badge-wrap', { opacity: 0, y: -20, duration: 0.6 })
      .from('.hero-heading', { opacity: 0, y: 30, duration: 0.8 }, '-=0.3')
      .from('.hero-desc', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
      .from('.hero-ctas', { opacity: 0, y: 20, stagger: 0.12, duration: 0.6 }, '-=0.3')
      .from('.hero-main-pizza-wrap', { opacity: 0, scale: 0.85, rotation: -6, duration: 1.0, ease: 'back.out(1.2)' }, '-=0.8')
      .from('.hero-floating-decor', { opacity: 0, scale: 0.5, stagger: 0.08, duration: 0.7 }, '-=0.5')
      .from('.hero-service-strip', { opacity: 0, y: 35, duration: 0.8 }, '-=0.4');

    // Desktop Mouse Parallax on Hero Visual
    const heroVisual = document.querySelector('.hero-pizza-composition');
    if (heroVisual && window.innerWidth > 992) {
      window.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
        const mouseY = (e.clientY / window.innerHeight - 0.5) * 20;

        gsap.to('.hero-pizza-board', {
          x: mouseX * 0.7,
          y: mouseY * 0.7,
          duration: 1,
          ease: 'power1.out'
        });

        gsap.to('.hero-floating-decor', {
          x: -mouseX * 1.2,
          y: -mouseY * 1.2,
          duration: 1.2,
          ease: 'power1.out'
        });
      });
    }

    // Continuous Floating Decor
    gsap.to('.floating-basil-1', {
      y: -14,
      rotation: 8,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    gsap.to('.floating-tomato-1', {
      y: 16,
      rotation: -10,
      duration: 3.6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.4
    });

    gsap.to('.floating-mushroom-1', {
      y: -12,
      rotation: 6,
      duration: 3.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.8
    });
  }

  // ==========================================================================
  // 3. INNER PAGE HERO & AUTH SHOWCASE ENTRANCE
  // ==========================================================================
  const innerHero = document.querySelector('.inner-page-hero');
  if (innerHero && hasGSAP) {
    const heroInner = innerHero.querySelector('.hero-content-inner');
    if (heroInner) {
      gsap.from(heroInner, {
        y: 25,
        opacity: 0,
        duration: 0.75,
        ease: 'power3.out',
        clearProps: 'opacity,transform'
      });
    }
  }

  // Auth pages entrance (Login & Signup)
  const authCard = document.querySelector('.auth-card-body');
  const authShowcase = document.querySelector('.auth-showcase-content');
  if ((authCard || authShowcase) && hasGSAP) {
    if (authShowcase) {
      gsap.from(authShowcase, {
        x: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'all'
      });
    }
    if (authCard) {
      gsap.from(authCard, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.15,
        ease: 'power3.out',
        clearProps: 'all'
      });
    }
  }

  // 404 page entrance
  const errorBox = document.querySelector('.error-content-box');
  if (errorBox && hasGSAP) {
    gsap.fromTo(errorBox, 
      { opacity: 0, y: 35, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.85,
        ease: 'power3.out',
        clearProps: 'all'
      }
    );
  }

  // ==========================================================================
  // 4. COMPREHENSIVE SCROLL-APPEAR TARGETS ACROSS WHOLE PROJECT
  // ==========================================================================
  const animTargets = [
    // Section Headers
    { selector: '.section-header, .section-heading, .section-title, .section-subtitle', stagger: 0.08, y: 24 },
    { selector: '.dash-page-header', stagger: 0.1, y: 20 },

    // Storefront Cards & Blocks
    { selector: '.feature-block-card', stagger: 0.1, y: 30 },
    { selector: '.featured-pizza-card', stagger: 0.12, y: 35 },
    { selector: '.menu-promo-banner-card', stagger: 0, scale: 0.95 },
    { selector: '.sig-pizza-card', stagger: 0.12, y: 35 },
    { selector: '.menu-item-card, .pizza-card', stagger: 0.08, y: 25 },
    { selector: '.ingredients-center-pizza', stagger: 0, scale: 0.85 },
    { selector: '.ingredient-orbit-card', stagger: 0.1, scale: 0.8 },
    { selector: '.process-step-node, .process-step-card', stagger: 0.12, y: 35 },
    { selector: '.service-card-premium, .catering-card, .guarantee-card, .service-feature-card', stagger: 0.1, y: 30 },
    { selector: '.blog-card, .anatomy-card, .sourcing-card, .blog-sidebar-card', stagger: 0.1, y: 30 },
    { selector: '.testimonial-card', stagger: 0.1, y: 25 },
    { selector: '.faq-item', stagger: 0.08, y: 20 },
    { selector: '.contact-card, .contact-info-card, .contact-form-container', stagger: 0.1, y: 25 },
    { selector: '.about-story-card, .chef-card, .story-grid-card', stagger: 0.1, y: 30 },

    // Dashboard Cards & Widgets
    { selector: '.kpi-card', stagger: 0.08, y: 24 },
    { selector: '.dash-card', stagger: 0.1, y: 25 },
    { selector: '.telemetry-stat-card', stagger: 0.06, y: 20 },
    { selector: '.taste-pref-card', stagger: 0.06, y: 20 },
    { selector: '.quick-pizza-card', stagger: 0.08, y: 20 },
    { selector: '.live-tracker-banner', stagger: 0, y: 20 },
    { selector: '.kitchen-order-ticket', stagger: 0.08, y: 20 }
  ];

  // Helper function to animate elements into view
  const revealElements = (elements, config) => {
    if (!elements || elements.length === 0) return;

    if (hasGSAP) {
      const vars = {
        opacity: 1,
        duration: 0.65,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        overwrite: 'auto'
      };
      if (config.y) vars.y = 0;
      if (config.scale) vars.scale = 1;
      if (config.stagger && elements.length > 1) vars.stagger = config.stagger;

      gsap.to(elements, vars);
    } else {
      elements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }
  };

  // Safe ScrollTrigger / IntersectionObserver Setup
  if (hasGSAP && hasScrollTrigger) {
    animTargets.forEach(cfg => {
      const els = Array.from(document.querySelectorAll(cfg.selector));
      if (els.length === 0) return;

      const parentTrigger = els[0].closest('.container, .dash-content, .admin-content, section') || els[0].parentElement;

      // Check if already in viewport on init
      const firstRect = els[0].getBoundingClientRect();
      const inViewOnInit = firstRect.top < window.innerHeight && firstRect.bottom > 0;

      if (inViewOnInit) {
        revealElements(els, cfg);
      } else {
        gsap.set(els, {
          opacity: 0,
          y: cfg.y || 0,
          scale: cfg.scale || 1
        });

        ScrollTrigger.create({
          trigger: parentTrigger,
          start: 'top 90%',
          once: true,
          onEnter: () => revealElements(els, cfg)
        });
      }
    });
  } else if ('IntersectionObserver' in window) {
    // IntersectionObserver fallback
    animTargets.forEach(cfg => {
      const els = Array.from(document.querySelectorAll(cfg.selector));
      if (els.length === 0) return;

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            revealElements([entry.target], cfg);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });

      els.forEach(el => observer.observe(el));
    });
  }

  // ==========================================================================
  // 5. ANIMATED NUMBER COUNTERS ON SCROLL
  // ==========================================================================
  const counterSelectors = '.kpi-val, .telemetry-stat-num, .counter-number, .stat-counter, .hero-stat-number, .stat-val';
  const counterEls = Array.from(document.querySelectorAll(counterSelectors));

  function animateCounter(el) {
    if (el.dataset.counterDone) return;
    el.dataset.counterDone = 'true';

    const originalText = el.textContent.trim();
    // Parse prefix (e.g. ₹), number, suffix (e.g. °C, %, m, km, +)
    const match = originalText.match(/^([^\d]*)([\d,.]+)(.*)$/);
    if (!match) return;

    const prefix = match[1] || '';
    const rawNum = match[2].replace(/,/g, '');
    const suffix = match[3] || '';
    const targetVal = parseFloat(rawNum);
    if (isNaN(targetVal)) return;

    const isDecimal = rawNum.includes('.');
    const decimalPlaces = isDecimal ? rawNum.split('.')[1].length : 0;
    const duration = 1200;
    const startTime = performance.now();

    function updateNum(now) {
      const elapsed = Math.min(now - startTime, duration);
      const progress = 1 - Math.pow(1 - elapsed / duration, 3); // cubic out
      const currentVal = targetVal * progress;

      let displayNum;
      if (isDecimal) {
        displayNum = currentVal.toFixed(decimalPlaces);
      } else {
        const rounded = Math.floor(currentVal);
        displayNum = rawNum.length > 3 ? rounded.toLocaleString() : rounded;
      }

      el.textContent = `${prefix}${displayNum}${suffix}`;

      if (elapsed < duration) {
        requestAnimationFrame(updateNum);
      } else {
        el.textContent = originalText;
      }
    }

    requestAnimationFrame(updateNum);
  }

  if ('IntersectionObserver' in window && counterEls.length > 0) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    counterEls.forEach(el => counterObserver.observe(el));
  }

  // ==========================================================================
  // 6. 3D MAGNETIC HOVER TILT ON CARDS (DESKTOP)
  // ==========================================================================
  if (window.innerWidth > 992) {
    const tiltCards = document.querySelectorAll(
      '.featured-pizza-card, .sig-pizza-card, .kpi-card, .service-card-premium, .blog-card, .quick-pizza-card'
    );

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale3d(1.01, 1.01, 1.01)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ==========================================================================
  // 7. DASHBOARD TAB TRANSITION ANIMATOR
  // ==========================================================================
  const tabButtons = document.querySelectorAll('.sidebar-item[data-tab], .admin-nav-item[data-tab]');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(() => {
        const activePanel = document.querySelector('.tab-panel.active, .admin-tab-panel.active');
        if (activePanel && hasGSAP) {
          gsap.fromTo(
            activePanel,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', clearProps: 'all' }
          );

          // Stagger animate cards inside new tab
          const innerCards = activePanel.querySelectorAll('.kpi-card, .dash-card, .telemetry-stat-card, .quick-pizza-card');
          if (innerCards.length > 0) {
            gsap.fromTo(
              innerCards,
              { opacity: 0, y: 18 },
              { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out', clearProps: 'all' }
            );
          }
        }
      }, 30);
    });
  });

  // ==========================================================================
  // 8. TESTIMONIALS CAROUSEL
  // ==========================================================================
  const track = document.querySelector('.testimonial-carousel-track');
  const prevBtn = document.querySelector('.carousel-btn-prev');
  const nextBtn = document.querySelector('.carousel-btn-next');

  if (track && prevBtn && nextBtn) {
    let currentIndex = 0;
    const cards = track.querySelectorAll('.testimonial-card');
    const totalCards = cards.length;

    const updateCarousel = () => {
      const cardWidth = cards[0].offsetWidth + 24;
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    };

    nextBtn.addEventListener('click', () => {
      const visibleCount = window.innerWidth > 992 ? 3 : window.innerWidth > 640 ? 2 : 1;
      if (currentIndex < totalCards - visibleCount) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
      const visibleCount = window.innerWidth > 992 ? 3 : window.innerWidth > 640 ? 2 : 1;
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = Math.max(0, totalCards - visibleCount);
      }
      updateCarousel();
    });

    let startX = 0;
    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const diffX = startX - e.changedTouches[0].clientX;
      if (diffX > 45) {
        nextBtn.click();
      } else if (diffX < -45) {
        prevBtn.click();
      }
    }, { passive: true });
  }

  // ==========================================================================
  // 9. FAIL-SAFE VISIBILITY RECOVERY
  // Guarantees that even if image loading, resize, or rapid scrolling delayed a trigger,
  // NO animated content can ever stay hidden at opacity 0.
  // ==========================================================================
  const recoverHiddenContent = () => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
    const allAnimated = document.querySelectorAll(
      '.feature-block-card, .featured-pizza-card, .sig-pizza-card, ' +
      '.menu-promo-banner-card, .ingredients-center-pizza, .ingredient-orbit-card, ' +
      '.process-step-node, .process-step-card, .service-card-premium, .catering-card, .guarantee-card, ' +
      '.blog-card, .anatomy-card, .sourcing-card, .kpi-card, .dash-card, .telemetry-stat-card, ' +
      '.error-content-box, .auth-form-card, .auth-showcase-split'
    );
    allAnimated.forEach(el => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight + 120 && rect.bottom > -80;
      const computedOpacity = parseFloat(window.getComputedStyle(el).opacity);
      if (inView && (computedOpacity < 0.7 || el.style.opacity === '0')) {
        if (hasGSAP) {
          gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.4, clearProps: 'all', overwrite: 'auto' });
        } else {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      }
    });
  };

  // Run recovery checks on window load and after timeouts
  window.addEventListener('load', () => {
    setTimeout(recoverHiddenContent, 100);
    setTimeout(recoverHiddenContent, 500);
    setTimeout(recoverHiddenContent, 1000);
  });

  // Re-check on hashchange
  window.addEventListener('hashchange', () => {
    setTimeout(recoverHiddenContent, 150);
  });

  // Ultimate safety timeout: after 1.2s, if anything is still opacity < 0.7, gently reveal it
  setTimeout(() => {
    document.querySelectorAll(
      '.feature-block-card, .featured-pizza-card, .sig-pizza-card, ' +
      '.menu-promo-banner-card, .ingredients-center-pizza, .ingredient-orbit-card, ' +
      '.process-step-node, .process-step-card, .service-card-premium, .catering-card, .guarantee-card, ' +
      '.blog-card, .anatomy-card, .sourcing-card, .kpi-card, .dash-card, .telemetry-stat-card, ' +
      '.error-content-box, .auth-form-card, .auth-showcase-split'
    ).forEach(el => {
      if (parseFloat(window.getComputedStyle(el).opacity) < 0.7 || el.style.opacity === '0') {
        el.style.opacity = '1';
        el.style.transform = 'none';
      }
    });
  }, 1200);

  // ==========================================================================
  // 10. HERO BACKGROUND COVER SLIDESHOW
  // ==========================================================================
  const heroSlides = document.querySelectorAll('.hero-bg-slide');
  if (heroSlides && heroSlides.length > 1) {
    let currentSlide = 0;
    setInterval(() => {
      heroSlides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % heroSlides.length;
      heroSlides[currentSlide].classList.add('active');
    }, 2500);
  }
});
