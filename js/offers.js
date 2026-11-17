/**
 * STACKLY PIZZA SHOP - OFFERS PAGE CONTROLLER
 * Live countdown clocks, copy code to clipboard & claim offer modal
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Copy Coupon Codes
  document.querySelectorAll('.btn-copy-code').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const code = btn.getAttribute('data-code');
      if (!code) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => {
          StacklyUI.showToast(`Coupon "${code}" copied to clipboard!`, 'fa-copy');
        }).catch(() => {
          fallbackCopy(code);
        });
      } else {
        fallbackCopy(code);
      }
    });
  });

  function fallbackCopy(text) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    StacklyUI.showToast(`Coupon "${text}" copied!`, 'fa-copy');
  }

  // 2. Real-Time Countdown Timers
  const countdownElements = document.querySelectorAll('.countdown-clock-wrap');
  if (countdownElements.length > 0) {
    // Target 2 days, 14 hours, 32 mins from now
    const now = new Date().getTime();
    const targetEndTime = now + (2 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000);

    const updateClocks = () => {
      const current = new Date().getTime();
      const distance = targetEndTime - current;

      if (distance < 0) {
        countdownElements.forEach(el => {
          el.innerHTML = '<span style="color:var(--primary); font-weight:700;">Offer refreshed! Check back daily.</span>';
        });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      countdownElements.forEach(el => {
        const daysEl = el.querySelector('.cd-days');
        const hoursEl = el.querySelector('.cd-hours');
        const minsEl = el.querySelector('.cd-mins');
        const secsEl = el.querySelector('.cd-secs');

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
        if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
      });
    };

    updateClocks();
    setInterval(updateClocks, 1000);
  }

  // 3. Category Filter for Offers
  const offerPills = document.querySelectorAll('.offer-cat-pill');
  const offerBlocks = document.querySelectorAll('.offers-section-block');

  offerPills.forEach(pill => {
    pill.addEventListener('click', () => {
      offerPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');
      offerBlocks.forEach(block => {
        if (filter === 'all' || block.getAttribute('data-cat') === filter) {
          block.style.display = 'block';
        } else {
          block.style.display = 'none';
        }
      });
    });
  });

  // 4. Claim Offer / View Terms Modal
  const offerModal = document.getElementById('offer-terms-modal');
  const offerModalClose = document.getElementById('offer-terms-modal-close');
  const modalContent = document.getElementById('offer-terms-content');

  window.openOfferModal = (title, code, terms) => {
    if (!offerModal || !modalContent) return;
    modalContent.innerHTML = `
      <div style="padding:2.25rem;">
        <span class="badge-tag" style="margin-bottom:0.75rem;">Verified Offer</span>
        <h2 style="font-size:1.6rem; font-weight:800; margin-bottom:0.5rem;">${title}</h2>
        <div style="background:var(--white-05); border:1px dashed var(--primary); padding:0.75rem 1rem; border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
          <span style="font-family:monospace; font-weight:700; color:var(--primary); font-size:1.15rem;">${code}</span>
          <button class="btn btn-primary" style="padding:0.4rem 1rem; font-size:0.8rem;" onclick="navigator.clipboard?.writeText('${code}'); StacklyUI.showToast('Copied ${code}!', 'fa-copy');">Copy</button>
        </div>
        <h4 style="font-size:1rem; font-weight:700; margin-bottom:0.6rem; color:var(--white-90);">Terms &amp; Conditions:</h4>
        <ul style="color:var(--white-75); font-size:0.88rem; line-height:1.7; margin-bottom:1.75rem; list-style:disc; padding-left:1.25rem;">
          <li>Valid on all online demonstration orders placed through the STACKLY web interface.</li>
          <li>Cannot be clubbed with other concurrent promotional vouchers unless stated.</li>
          <li>Applicable across participating outlets nationwide for takeaway and delivery.</li>
          <li>Demonstration offer; no monetary cash surrender value.</li>
        </ul>
        <a href="menuoff.html#menu-section" class="btn btn-primary" style="width:100%;">Use Offer &amp; Order Now →</a>
      </div>
    `;
    offerModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  if (offerModalClose && offerModal) {
    offerModalClose.addEventListener('click', () => {
      offerModal.classList.remove('active');
      document.body.style.overflow = '';
    });
    offerModal.addEventListener('click', (e) => {
      if (e.target === offerModal) {
        offerModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
});
