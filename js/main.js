/**
 * STACKLY PIZZA SHOP - MAIN APPLICATION BOOTSTRAP
 * Frontend-only Pizza Ordering & Restaurant Platform
 */

document.addEventListener('DOMContentLoaded', () => {
  // Console Welcome & Architecture Watermark
  console.log(
    '%c STACKLY PIZZA SHOP %c Red + Black Scheme • Premium Frontend ',
    'background: #E50914; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    'background: #111111; color: #ffffff; border: 1px solid #2E2E2E; padding: 4px 8px; border-radius: 4px;'
  );

  // Smooth hash link scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Lazy load image fade-in helper
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.style.opacity = '1';
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '50px 0px' });

    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.style.transition = 'opacity 0.4s ease-in-out';
      imgObserver.observe(img);
    });
  }
});
