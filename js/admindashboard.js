/**
 * STACKLY Pizza Shop - Executive Admin Dashboard (admindashboard.js)
 * Implements admin tab switching, live kitchen dispatch controls,
 * menu catalog management, coupon generation, and modal handlers.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Force top scroll on initial load
  window.scrollTo(0, 0);

  // 2. Tab Navigation
  const adminNavItems = document.querySelectorAll('.admin-sidebar .admin-nav-item[data-tab]');
  const adminTabPanels = document.querySelectorAll('.admin-tab-panel');

  function switchAdminTab(tabId) {
    if (!tabId) return;

    adminNavItems.forEach(item => {
      if (item.getAttribute('data-tab') === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    adminTabPanels.forEach(panel => {
      if (panel.id === tabId) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    closeAdminMobileSidebar();

    if (history.pushState) {
      history.pushState(null, null, '#' + tabId);
    } else {
      location.hash = '#' + tabId;
    }
  }

  adminNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = item.getAttribute('data-tab');
      switchAdminTab(targetTab);
    });
  });

  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    if (document.getElementById(hash)) {
      switchAdminTab(hash);
    }
  }

  // 3. Mobile Sidebar Drawer
  const adminHamburgerBtn = document.getElementById('adminHamburgerBtn');
  const adminCloseBtn = document.getElementById('adminCloseBtn');
  const adminSidebar = document.getElementById('adminSidebar');
  const adminSidebarBackdrop = document.getElementById('adminSidebarBackdrop');

  function openAdminMobileSidebar() {
    if (adminSidebar) adminSidebar.classList.add('open');
    if (adminSidebarBackdrop) adminSidebarBackdrop.classList.add('active');
  }

  function closeAdminMobileSidebar() {
    if (adminSidebar) adminSidebar.classList.remove('open');
    if (adminSidebarBackdrop) adminSidebarBackdrop.classList.remove('active');
  }

  if (adminHamburgerBtn) adminHamburgerBtn.addEventListener('click', openAdminMobileSidebar);
  if (adminCloseBtn) adminCloseBtn.addEventListener('click', closeAdminMobileSidebar);
  if (adminSidebarBackdrop) adminSidebarBackdrop.addEventListener('click', closeAdminMobileSidebar);

  // 4. Live Kitchen Order Queue Advance Handler
  document.querySelectorAll('.btn-advance-order').forEach(btn => {
    btn.addEventListener('click', () => {
      const ticket = btn.closest('.kitchen-order-ticket');
      const statusPill = ticket.querySelector('.status-pill');
      const currentStatus = statusPill.textContent.trim();

      if (currentStatus.includes('Baking')) {
        statusPill.className = 'status-pill info';
        statusPill.innerHTML = '<i class="fa-solid fa-motorcycle"></i> In Transit';
        btn.innerHTML = '<i class="fa-solid fa-check-double"></i> Mark Delivered';
      } else if (currentStatus.includes('In Transit')) {
        statusPill.className = 'status-pill success';
        statusPill.innerHTML = '<i class="fa-solid fa-circle-check"></i> Delivered';
        btn.className = 'btn-ticket-step';
        btn.innerHTML = 'Completed';
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'default';
      }
    });
  });

  // 5. Stock Toggle Switches
  document.querySelectorAll('.stock-toggle-input').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const row = checkbox.closest('tr');
      const title = row ? row.querySelector('.table-pizza-title').textContent : 'Item';
      const statusLabel = row.querySelector('.stock-status-label');
      if (checkbox.checked) {
        if (statusLabel) {
          statusLabel.textContent = 'In Stock';
          statusLabel.className = 'stock-status-label status-pill success';
        }
      } else {
        if (statusLabel) {
          statusLabel.textContent = 'Sold Out';
          statusLabel.className = 'stock-status-label status-pill danger';
        }
      }
    });
  });

  // 6. Delete Pizza Handler
  document.querySelectorAll('.btn-delete-pizza').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('tr');
      const name = row.querySelector('.table-pizza-title').textContent;
      if (confirm(`Are you sure you want to remove "${name}" from the live menu?`)) {
        row.remove();
      }
    });
  });

  // 7. Add New Pizza Modal
  const openAddPizzaBtn = document.getElementById('openAddPizzaBtn');
  const addPizzaModal = document.getElementById('addPizzaModal');
  const closeAddPizzaBtn = document.getElementById('closeAddPizzaBtn');
  const addPizzaForm = document.getElementById('addPizzaForm');

  if (openAddPizzaBtn && addPizzaModal) {
    openAddPizzaBtn.addEventListener('click', () => {
      addPizzaModal.classList.add('active');
    });
  }

  if (closeAddPizzaBtn && addPizzaModal) {
    closeAddPizzaBtn.addEventListener('click', () => {
      addPizzaModal.classList.remove('active');
    });
  }

  if (addPizzaModal) {
    addPizzaModal.addEventListener('click', (e) => {
      if (e.target === addPizzaModal) {
        addPizzaModal.classList.remove('active');
      }
    });
  }

  if (addPizzaForm) {
    addPizzaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('newPizzaTitle').value.trim();
      const category = document.getElementById('newPizzaCategory').value;
      const price = document.getElementById('newPizzaPrice').value;

      const tbody = document.getElementById('adminMenuTableBody');
      if (tbody) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>
            <div class="table-pizza-meta">
              <img src="assets/images/hero-pizza.webp" alt="${title}" class="table-pizza-thumb">
              <div>
                <span class="table-pizza-title" style="font-weight:700; color:var(--white);">${title}</span>
                <span style="font-size:0.75rem; color:var(--text-light); display:block;">Wood-fired recipe</span>
              </div>
            </div>
          </td>
          <td><span class="status-pill info">${category}</span></td>
          <td><strong style="color:var(--admin-primary);">₹${price}</strong></td>
          <td>
            <span class="stock-status-label status-pill success">In Stock</span>
          </td>
          <td>
            <label class="switch-label">
              <input type="checkbox" class="stock-toggle-input" checked>
              <span class="switch-slider"></span>
            </label>
          </td>
          <td>
            <button class="btn-table-action btn-delete-pizza" style="color:var(--admin-primary);"><i class="fa-solid fa-trash"></i></button>
          </td>
        `;
        tbody.prepend(tr);
      }

      addPizzaModal.classList.remove('active');
      addPizzaForm.reset();
      alert(`"${title}" successfully added to the active pizza catalog!`);
    });
  }

  // 8. Filter Bar Interactive Buttons
  document.querySelectorAll('.dash-filter-bar').forEach(bar => {
    const buttons = bar.querySelectorAll('.dash-filter-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterText = btn.textContent.split('(')[0].trim().toLowerCase();
        const section = bar.closest('.admin-tab-panel') || bar.closest('.dash-card') || bar.parentElement;
        if (!section) return;
        const rows = section.querySelectorAll('tbody tr');
        rows.forEach(row => {
          if (filterText === 'all' || filterText === 'all items' || filterText === 'all orders' || filterText === 'all customers') {
            row.style.display = '';
          } else {
            const rowText = row.textContent.toLowerCase();
            row.style.display = rowText.includes(filterText) ? '' : 'none';
          }
        });
      });
    });
  });

  // 9. Global 404 Router for Admin Content Buttons & Links
  // All buttons and links lead to 404.html EXCEPT:
  // - Admin sidebar items (all tabs, public storefront, close)
  // - Logout button (Admin Sign Out -> Login.html)
  // - Mobile sidebar hamburger and backdrop
  document.addEventListener('click', (e) => {
    const el = e.target.closest('a, button, input[type="submit"], input[type="button"], [role="button"]');
    if (!el) return;

    // A. Admin sidebar is EXEMPT
    if (el.closest('#adminSidebar, .admin-sidebar')) {
      return;
    }

    // B. Mobile sidebar controls & backdrop are EXEMPT
    const id = (el.id || '').toLowerCase();
    if (id === 'adminhamburgerbtn' || id === 'adminclosebtn' || id === 'adminsidebarbackdrop') {
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
      text === 'admin sign out' ||
      text.includes('admin sign out') ||
      cls.includes('logout') ||
      id.includes('logout')
    ) {
      return;
    }

    // D. Modal close buttons (add pizza modal close)
    if (id === 'closeaddpizzabtn') {
      return;
    }

    // E. Tab internal filter buttons can allow tab viewing
    if (cls.includes('dash-filter-btn')) {
      return;
    }

    // F. All STACKLY logos & Public Storefront links lead to index.html
    const hasBrandImg = Boolean(
      el.querySelector('.admin-brand-img, .admin-mobile-logo-img, img[src*="Brand-logo"]')
    );
    const ariaLabel = (el.getAttribute('aria-label') || '').toLowerCase();
    const isStacklyLogo = (
      cls.includes('admin-brand') ||
      cls.includes('admin-mobile-logo') ||
      cls.includes('admin-link-btn') ||
      ariaLabel.includes('stackly home') ||
      ariaLabel.includes('stackly storefront') ||
      text.includes('public pizza storefront') ||
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

  // 10. Admin Profile Sync with localStorage
  function formatNameFromEmail(str) {
    if (!str || typeof str !== 'string') return 'Admin';
    const prefix = str.split('@')[0].trim();
    if (!prefix) return 'Admin';
    const parts = prefix.split(/[._\-+]+/).filter(Boolean);
    if (parts.length === 0) return 'Admin';
    return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ');
  }

  function getInitialsFromName(name, strEmail) {
    if (!name && strEmail) name = formatNameFromEmail(strEmail);
    if (!name) return 'AD';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    } else if (parts.length === 1) {
      const letters = parts[0].replace(/[^a-zA-Z]/g, '');
      if (letters.length >= 2) {
        return letters.substring(0, 2).toUpperCase();
      } else if (letters.length === 1) {
        return (letters.charAt(0) + 'A').toUpperCase();
      }
    }
    return 'AD';
  }

  function syncAdminProfile() {
    try {
      const storedUser = localStorage.getItem('stackly_admin_user') || 
                         localStorage.getItem('stackly_auth_user') || 
                         localStorage.getItem('stackly_user') || 
                         localStorage.getItem('stackly_session_user') || 
                         sessionStorage.getItem('stackly_session_user');
      
      let adminName = 'Chef Marco Rossi';
      let adminEmail = 'chef.marco@stackly.com';

      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.email) {
          adminEmail = parsed.email;
          adminName = parsed.name || formatNameFromEmail(adminEmail);
        } else if (parsed.name) {
          adminName = parsed.name;
        }
      }

      const initials = getInitialsFromName(adminName, adminEmail);

      const nameEls = document.querySelectorAll('.sync-admin-name');
      nameEls.forEach(el => el.textContent = adminName);

      const emailEls = document.querySelectorAll('.sync-admin-email');
      emailEls.forEach(el => el.textContent = adminEmail);

      const avatarEls = document.querySelectorAll('.sync-admin-avatar');
      avatarEls.forEach(el => el.textContent = initials);
    } catch (e) {
      console.warn('Admin profile sync fallback:', e);
    }
  }

  syncAdminProfile();
});
