/**
 * STACKLY Pizza Shop - User Dashboard (userdashboard.js)
 * Implements sidebar tab switching, mobile navigation, live order telemetry,
 * profile sync, and reorder integrations.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Force top scroll on initial load
  window.scrollTo(0, 0);

  // 2. Tab Navigation
  const sidebarItems = document.querySelectorAll('.dash-sidebar .sidebar-item[data-tab]');
  const tabPanels = document.querySelectorAll('.tab-panel');

  function switchTab(tabId) {
    if (!tabId) return;

    // Update active tab buttons
    sidebarItems.forEach(item => {
      if (item.getAttribute('data-tab') === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update active panels
    tabPanels.forEach(panel => {
      if (panel.id === tabId) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // Close mobile sidebar if open
    closeMobileSidebar();

    // Update URL hash without jump
    if (history.pushState) {
      history.pushState(null, null, '#' + tabId);
    } else {
      location.hash = '#' + tabId;
    }
  }

  sidebarItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = item.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  // Handle direct hash navigation
  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    if (document.getElementById(hash)) {
      switchTab(hash);
    }
  }

  // 3. Mobile Sidebar Drawer
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
  const dashSidebar = document.getElementById('dashSidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');

  function openMobileSidebar() {
    if (dashSidebar) dashSidebar.classList.add('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
  }

  function closeMobileSidebar() {
    if (dashSidebar) dashSidebar.classList.remove('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openMobileSidebar);
  if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeMobileSidebar);
  if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeMobileSidebar);

  // 4. Notifications Dropdown
  const notifBellBtn = document.getElementById('notifBellBtn');
  const notifDropdown = document.getElementById('notifDropdown');

  if (notifBellBtn && notifDropdown) {
    notifBellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown.classList.toggle('active');
      if (profileDropdown) profileDropdown.classList.remove('active');
    });
  }

  // 5. User Profile Dropdown
  const userProfileBtn = document.getElementById('userProfileBtn');
  const profileDropdown = document.getElementById('profileDropdown');

  if (userProfileBtn && profileDropdown) {
    userProfileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('active');
      if (notifDropdown) notifDropdown.classList.remove('active');
    });
  }

  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    if (notifDropdown) notifDropdown.classList.remove('active');
    if (profileDropdown) profileDropdown.classList.remove('active');
  });

  // 6. User Profile Sync with localStorage
  function formatNameFromEmail(str) {
    if (!str || typeof str !== 'string') return 'User';
    const prefix = str.split('@')[0].trim();
    if (!prefix) return 'User';
    const parts = prefix.split(/[._\-+]+/).filter(Boolean);
    if (parts.length === 0) return 'User';
    return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ');
  }

  function getInitialsFromName(name, strEmail) {
    if (!name && strEmail) name = formatNameFromEmail(strEmail);
    if (!name) return 'US';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    } else if (parts.length === 1) {
      const letters = parts[0].replace(/[^a-zA-Z]/g, '');
      if (letters.length >= 2) {
        return letters.substring(0, 2).toUpperCase();
      } else if (letters.length === 1) {
        return (letters.charAt(0) + 'U').toUpperCase();
      }
    }
    return 'US';
  }

  function syncUserProfile() {
    try {
      const storedUser = localStorage.getItem('stackly_client_user') || 
                         localStorage.getItem('stackly_auth_user') || 
                         localStorage.getItem('stackly_user') || 
                         localStorage.getItem('stackly_session_user') || 
                         sessionStorage.getItem('stackly_session_user');
      let userName = 'Arun Kumar';
      let userEmail = 'arun.kumar@gmail.com';

      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.email) {
          userEmail = parsed.email;
          userName = parsed.name || formatNameFromEmail(userEmail);
        } else if (parsed.name) {
          userName = parsed.name;
        }
      }

      // Compute initials
      const initials = getInitialsFromName(userName, userEmail);

      const nameEls = document.querySelectorAll('.sync-user-name');
      nameEls.forEach(el => el.textContent = userName);

      const emailEls = document.querySelectorAll('.sync-user-email');
      emailEls.forEach(el => el.textContent = userEmail);

      const avatarEls = document.querySelectorAll('.sync-user-avatar');
      avatarEls.forEach(el => el.textContent = initials);

      const inputName = document.getElementById('profileFullNameInput');
      if (inputName) inputName.value = userName;
      const inputEmail = document.getElementById('profileEmailInput');
      if (inputEmail) inputEmail.value = userEmail;
    } catch (e) {
      console.warn('Profile sync fallback:', e);
    }
  }
  syncUserProfile();

  // 7. Profile Save Handler
  const profileForm = document.getElementById('userProfileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const updatedName = document.getElementById('profileFullNameInput').value.trim();
      const updatedPhone = document.getElementById('profilePhoneInput').value.trim();
      
      const stored = localStorage.getItem('stackly_client_user')
        ? JSON.parse(localStorage.getItem('stackly_client_user'))
        : (localStorage.getItem('stackly_auth_user') ? JSON.parse(localStorage.getItem('stackly_auth_user')) : {});
      
      stored.name = updatedName;
      stored.phone = updatedPhone;
      localStorage.setItem('stackly_auth_user', JSON.stringify(stored));
      localStorage.setItem('stackly_user', JSON.stringify(stored));
      localStorage.setItem('stackly_client_user', JSON.stringify(stored));
      
      syncUserProfile();
      alert('Profile details updated successfully!');
    });
  }

  // 8. Reorder Handler
  document.querySelectorAll('.btn-reorder-pizza').forEach(btn => {
    btn.addEventListener('click', () => {
      const pizzaName = btn.getAttribute('data-pizza') || 'Signature Pizza';
      const pizzaPrice = parseInt(btn.getAttribute('data-price') || '399', 10);

      // Add to cart in localStorage
      let cart = [];
      try {
        cart = JSON.parse(localStorage.getItem('stackly_cart') || '[]');
      } catch (e) {
        cart = [];
      }

      const existing = cart.find(item => item.name === pizzaName);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          id: 'reorder-' + Date.now(),
          name: pizzaName,
          price: pizzaPrice,
          quantity: 1,
          size: 'Regular',
          crust: 'Hand-Tossed Sourdough'
        });
      }

      localStorage.setItem('stackly_cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));

      // Confirmation notification
      const toast = document.createElement('div');
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #181818;
        border: 1px solid #E50914;
        color: #FFFFFF;
        padding: 14px 22px;
        border-radius: 9999px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.8);
        z-index: 9999;
        font-size: 0.9rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: fadeIn 0.3s ease;
      `;
      toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#E50914;"></i> ${pizzaName} added to your bag! <a href="menuoff.html" style="color:#E50914; text-decoration:underline; margin-left:8px;">View Bag</a>`;
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.4s ease';
        setTimeout(() => toast.remove(), 400);
      }, 3500);
    });
  });

  // 9. Coupon Copy to Clipboard
  document.querySelectorAll('.btn-copy-code').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-code');
      if (code) {
        navigator.clipboard.writeText(code).then(() => {
          const originalText = btn.innerHTML;
          btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
          btn.style.background = '#10b981';
          btn.style.color = '#FFFFFF';
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.color = '';
          }, 2000);
        }).catch(() => {
          alert('Coupon code: ' + code);
        });
      }
    });
  });

  // 10. Filter Bar Interactive Buttons
  document.querySelectorAll('.dash-filter-bar').forEach(bar => {
    const buttons = bar.querySelectorAll('.dash-filter-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterText = btn.textContent.split('(')[0].trim().toLowerCase();
        const section = bar.closest('.tab-panel') || bar.closest('.dash-card') || bar.parentElement;
        if (!section) return;
        const rows = section.querySelectorAll('tbody tr');
        rows.forEach(row => {
          if (filterText === 'all' || filterText === 'all orders') {
            row.style.display = '';
          } else {
            const rowText = row.textContent.toLowerCase();
            row.style.display = rowText.includes(filterText) ? '' : 'none';
          }
        });
      });
    });
  });

  // 11. Global 404 Router for Dashboard Content Buttons & Links
  // All buttons and links lead to 404.html EXCEPT:
  // - Dashboard sidebar items (all tabs, return to shop, close)
  // - Logout button (Sign Out -> Login.html)
  // - Mobile sidebar hamburger and backdrop
  document.addEventListener('click', (e) => {
    const el = e.target.closest('a, button, input[type="submit"], input[type="button"], [role="button"]');
    if (!el) return;

    // A. Dashboard sidebar is EXEMPT
    if (el.closest('#dashSidebar, .dash-sidebar')) {
      return;
    }

    // B. Mobile sidebar controls & backdrop are EXEMPT
    const id = (el.id || '').toLowerCase();
    if (id === 'hamburgerbtn' || id === 'sidebarclosebtn' || id === 'sidebarbackdrop') {
      return;
    }

    // C. Logout button is EXEMPT
    const href = (el.getAttribute('href') || '').toLowerCase();
    const text = (el.textContent || '').trim().toLowerCase();
    const cls = (el.className || '').toString().toLowerCase();

    if (
      href.includes('login.html') ||
      text === 'sign out' ||
      text === 'logout' ||
      text === 'log out' ||
      text.includes('sign out') ||
      cls.includes('logout') ||
      id.includes('logout')
    ) {
      return;
    }

    // D. Dropdown toggles for topbar profile & notifications
    if (id === 'notifbellbtn' || id === 'userprofilebtn' || el.closest('#notifDropdown, #profileDropdown')) {
      // If clicking signout or storefront inside dropdown, let it through
      if (text.includes('sign out') || href.includes('login.html')) return;
      if (text.includes('stackly storefront') || href.includes('index.html')) {
        window.location.href = 'index.html';
        return;
      }
    }

    // E. Tab internal filter buttons can allow tab viewing
    if (cls.includes('dash-filter-btn')) {
      return;
    }

    // F. All STACKLY logos lead to home page
    const hasBrandImg = Boolean(
      el.querySelector('.sidebar-brand-img, .dash-mobile-logo-img, img[src*="Brand-logo"]')
    );
    const ariaLabel = (el.getAttribute('aria-label') || '').toLowerCase();
    const isStacklyLogo = (
      cls.includes('sidebar-brand') ||
      cls.includes('dash-mobile-logo') ||
      ariaLabel.includes('stackly home') ||
      ariaLabel.includes('stackly storefront') ||
      text.includes('stackly storefront') ||
      text.includes('return to pizza shop') ||
      hasBrandImg ||
      href === 'index.html' ||
      href.endsWith('/index.html')
    );
    if (isStacklyLogo) {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = 'index.html';
      return;
    }

    // If an <a> already points to 404.html, let it navigate naturally
    if (href === '404.html' || href.endsWith('/404.html')) {
      return;
    }

    // All content buttons and links lead to 404.html
    e.preventDefault();
    e.stopPropagation();
    window.location.href = '404.html';
  }, true);
});
