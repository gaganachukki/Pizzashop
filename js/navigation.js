/**
 * STACKLY PIZZA SHOP - NAVIGATION & GLOBAL UI
 * Sticky navbar, mobile drawer, search modal, cart drawer & toast system
 */

const StacklyUI = (() => {
  // Toast Notification
  const showToast = (message, icon = 'fa-check-circle', duration = 3000) => {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 350);
    }, duration);
  };

  return { showToast };
})();

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Active Link Highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // 3. Mobile Navigation Drawer
  const toggleBtn = document.querySelector('.nav-toggle-btn');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const backdrop = document.querySelector('.mobile-nav-backdrop');
  const closeBtn = document.querySelector('.mobile-drawer-close');

  const openMobileNav = () => {
    if (drawer && backdrop) {
      drawer.classList.add('open');
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeMobileNav = () => {
    if (drawer && backdrop) {
      drawer.classList.remove('open');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (toggleBtn) toggleBtn.addEventListener('click', openMobileNav);
  if (closeBtn) closeBtn.addEventListener('click', closeMobileNav);
  if (backdrop) backdrop.addEventListener('click', closeMobileNav);

  // 4. Search Modal Overlay
  const searchTriggerBtns = document.querySelectorAll('[data-action="open-search"]');
  const searchModal = document.querySelector('.search-modal');
  const searchCloseBtn = document.querySelector('.search-modal-close');
  const searchInput = document.querySelector('.search-input');
  const searchSubmitBtn = document.querySelector('.search-submit-btn');

  const openSearch = () => {
    if (searchModal) {
      searchModal.classList.add('active');
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 150);
      }
      document.body.style.overflow = 'hidden';
    }
  };

  const closeSearch = () => {
    if (searchModal) {
      searchModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  searchTriggerBtns.forEach(btn => btn.addEventListener('click', openSearch));
  if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearch);
  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) closeSearch();
    });
  }

  // Handle Search Submission -> Redirect to menuoff.html?search=...
  const handleSearchSubmit = () => {
    if (!searchInput) return;
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `menuoff.html?search=${encodeURIComponent(query)}`;
    }
  };

  if (searchSubmitBtn) searchSubmitBtn.addEventListener('click', handleSearchSubmit);
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSearchSubmit();
      if (e.key === 'Escape') closeSearch();
    });
  }

  document.querySelectorAll('.search-tag-chip').forEach(tag => {
    tag.addEventListener('click', () => {
      const query = tag.getAttribute('data-tag') || tag.textContent.trim();
      window.location.href = `menuoff.html?search=${encodeURIComponent(query)}`;
    });
  });

  // 5. Global Cart Drawer
  const cartTriggerBtns = document.querySelectorAll('[data-action="open-cart"]');
  const cartDrawer = document.querySelector('.cart-drawer');
  const cartBackdrop = document.querySelector('.cart-drawer-backdrop');
  const cartCloseBtn = document.querySelector('.cart-drawer-close');

  const openCart = () => {
    renderCartDrawer();
    if (cartDrawer && cartBackdrop) {
      cartDrawer.classList.add('open');
      cartBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeCart = () => {
    if (cartDrawer && cartBackdrop) {
      cartDrawer.classList.remove('open');
      cartBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  cartTriggerBtns.forEach(btn => btn.addEventListener('click', openCart));
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);

  // Render Cart Drawer Contents
  const renderCartDrawer = () => {
    const itemsContainer = document.querySelector('.cart-drawer-items');
    const badgeCounters = document.querySelectorAll('.cart-counter-badge');
    const subtotalEl = document.querySelector('.cart-summary-subtotal-val');
    const totalEl = document.querySelector('.cart-summary-total-val');

    if (!itemsContainer) return;

    const cart = StacklyStorage.getCart();
    const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);

    // Update badges
    badgeCounters.forEach(b => {
      b.textContent = totalItems;
      b.style.display = totalItems > 0 ? 'flex' : 'none';
    });

    if (cart.length === 0) {
      itemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <i class="fa-solid fa-pizza-slice cart-empty-icon"></i>
          <h4 style="margin-bottom:0.5rem; font-weight:700;">Your Cart is Empty</h4>
          <p style="font-size:0.9rem; color:var(--white-60); margin-bottom:1.5rem;">Delicious pizzas are waiting to be stacked!</p>
          <a href="menuoff.html" class="btn btn-primary" style="padding:0.65rem 1.4rem; font-size:0.85rem;">Browse Menu →</a>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = '₹0';
      if (totalEl) totalEl.textContent = '₹0';
      return;
    }

    let html = '';
    cart.forEach(item => {
      html += `
        <div class="cart-item-card" data-id="${item.id}">
          <img src="${item.image || 'assets/images/margherita.webp'}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-info">
            <h5 class="cart-item-name">${item.name}</h5>
            <div class="cart-item-price">₹${item.price}</div>
            <div class="cart-qty-ctrls">
              <button class="cart-qty-btn" onclick="StacklyStorage.updateCartQty('${item.id}', -1)">-</button>
              <span class="cart-qty-val">${item.qty || 1}</span>
              <button class="cart-qty-btn" onclick="StacklyStorage.updateCartQty('${item.id}', 1)">+</button>
            </div>
          </div>
          <button class="cart-item-remove" onclick="StacklyStorage.removeFromCart('${item.id}')" title="Remove item">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;
    });

    itemsContainer.innerHTML = html;
    if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
    if (totalEl) totalEl.textContent = `₹${subtotal}`;
  };

  // Re-render when cart updates
  window.addEventListener('stackly:cart-updated', () => {
    renderCartDrawer();
  });

  // Initial cart badge sync
  renderCartDrawer();

  // 6. Checkout Button Simulation
  const checkoutBtn = document.querySelector('.cart-checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const cart = StacklyStorage.getCart();
      if (cart.length === 0) {
        StacklyUI.showToast('Please add items to your cart before checking out.', 'fa-circle-exclamation');
        return;
      }

      // Check session or place simulated order
      const session = StacklyStorage.getSession();
      const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
      
      const newOrder = {
        orderId: newOrderId,
        customer: session.user ? session.user.name : 'Guest Foodie',
        email: session.user ? session.user.email : 'guest@stackly.com',
        pizza: cart[0].name + (cart.length > 1 ? ` + ${cart.length - 1} more` : ''),
        items: cart,
        quantity: cart.reduce((sum, i) => sum + i.qty, 0),
        total: subtotal,
        orderTime: 'Just now',
        orderDate: new Date().toISOString().split('T')[0],
        status: 'Preparing',
        address: 'Delivery Address (Demonstration)'
      };

      StacklyStorage.addOrder(newOrder);
      StacklyStorage.clearCart();
      closeCart();

      // Show friendly confirmation toast and redirect option
      StacklyUI.showToast(`Order #${newOrderId} placed successfully! Preparing your pizza! 🔥`, 'fa-circle-check', 4500);

      // If user is logged in as client, redirect to client dashboard order tracker after short delay
      if (session.role === 'Client') {
        setTimeout(() => {
          window.location.href = 'userdashboard.html';
        }, 1200);
      }
    });
  }

  // 7. Watch Our Story Video Modal
  const storyBtn = document.querySelector('[data-action="watch-story"]');
  const storyModal = document.getElementById('story-modal');
  const storyModalClose = document.getElementById('story-modal-close');

  if (storyBtn && storyModal) {
    storyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      storyModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (storyModalClose && storyModal) {
    storyModalClose.addEventListener('click', () => {
      storyModal.classList.remove('active');
      document.body.style.overflow = '';
    });
    storyModal.addEventListener('click', (e) => {
      if (e.target === storyModal) {
        storyModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // 8. Global 404 Router for All Non-Exempt Buttons & Links
  // "All buttons and links in this whole project should lead to 404 page.
  //  Except : (navlinks and navbuttons, login, logout button, both dashboard sidebar pages)."
  document.addEventListener('click', (e) => {
    const curPath = window.location.pathname.toLowerCase();
    if (curPath.endsWith('404.html') || curPath.endsWith('/404')) {
      return;
    }

    const el = e.target.closest('a, button, input[type="submit"], input[type="button"], [role="button"]');
    if (!el) return;

    // A. Navbar elements (navlinks, navbuttons, navbar login)
    if (el.closest('.site-header, .navbar-header, #navbar, .navbar-container, .nav-menu, .nav-actions, .mobile-nav-drawer, .nav-links-wrap, .nav-item, .nav-links, .brand-logo')) {
      return;
    }

    // B. Login / Signup authentication flow
    if (curPath.includes('login') || curPath.includes('signup')) {
      return;
    }

    // C. Explicit Login / Logout links and buttons
    const href = (el.getAttribute('href') || '').toLowerCase();
    const text = (el.textContent || '').trim().toLowerCase();
    const cls = (el.className || '').toString().toLowerCase();
    const id = (el.id || '').toLowerCase();

    if (
      href.includes('login.html') ||
      href.includes('signup.html') ||
      text === 'sign out' ||
      text === 'logout' ||
      text === 'log out' ||
      text === 'admin sign out' ||
      text.includes('sign out') ||
      text.includes('admin sign out') ||
      cls.includes('logout') ||
      id.includes('logout')
    ) {
      return;
    }

    // D. Dashboard Sidebar Pages
    if (el.closest('#dashSidebar, .dash-sidebar, #adminSidebar, .admin-sidebar')) {
      return;
    }

    // E. Dashboard mobile hamburger & backdrop toggles
    if (
      id === 'hamburgerbtn' ||
      id === 'sidebarclosebtn' ||
      id === 'sidebarbackdrop' ||
      id === 'adminhamburgerbtn' ||
      id === 'adminclosebtn' ||
      id === 'adminsidebarbackdrop'
    ) {
      return;
    }

    // F. Modal / Drawer close buttons
    if (
      cls.includes('mobile-drawer-close') ||
      cls.includes('cart-drawer-close') ||
      cls.includes('search-modal-close') ||
      id === 'story-modal-close' ||
      id === 'closeAddPizzaBtn'
    ) {
      return;
    }

    // G. All STACKLY Logos are EXEMPT and lead to home page
    const hasBrandImg = Boolean(
      el.querySelector('.footer-logo, .brand-logo-img, .sidebar-brand-img, .admin-brand-img, .dash-mobile-logo-img, .admin-mobile-logo-img, img[src*="Brand-logo"]')
    );
    const ariaLabel = (el.getAttribute('aria-label') || '').toLowerCase();
    const isStacklyLogo = (
      cls.includes('brand-logo-link') ||
      cls.includes('footer-logo-link') ||
      cls.includes('sidebar-brand') ||
      cls.includes('admin-brand') ||
      cls.includes('dash-mobile-logo') ||
      cls.includes('admin-mobile-logo') ||
      cls.includes('auth-logo') ||
      ariaLabel.includes('stackly home') ||
      ariaLabel.includes('stackly storefront') ||
      hasBrandImg ||
      (text === 'stackly' && href.includes('index.html'))
    );
    if (isStacklyLogo) {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = 'index.html';
      return;
    }

    // H. Common Footer Quick Links are EXEMPT and navigate to respective pages
    const footerCol = el.closest('div');
    const colHeader = footerCol ? (footerCol.querySelector('.footer-col-title, .footer-heading, h4, h5') || {}).textContent || '' : '';
    const isQuickLinksCol = colHeader.toLowerCase().includes('quick links');
    const isQuickLinkTarget = (
      href === 'index.html' || href.endsWith('/index.html') ||
      href === 'about.html' || href.endsWith('/about.html') ||
      href === 'menuoff.html' || href.endsWith('/menuoff.html') ||
      href === 'services.html' || href.endsWith('/services.html') ||
      href === 'blog.html' || href.endsWith('/blog.html') ||
      href === 'contact.html' || href.endsWith('/contact.html')
    );

    if (el.closest('.footer-links-list') && (isQuickLinksCol || isQuickLinkTarget)) {
      const targetHref = el.getAttribute('href');
      if (targetHref && targetHref !== '404.html') {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = targetHref;
        return;
      }
      return;
    }

    // If an <a> already points to 404.html, let it navigate naturally
    if (href === '404.html' || href.endsWith('/404.html')) {
      return;
    }

    // Route all non-exempt buttons and links to 404.html
    e.preventDefault();
    e.stopPropagation();
    window.location.href = '404.html';
  }, true);
});
