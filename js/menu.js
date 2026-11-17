/**
 * STACKLY PIZZA SHOP - MENU PAGE CONTROLLER
 * Filter, search, sort, quick-view modal & live cart additions
 */

document.addEventListener('DOMContentLoaded', () => {
  const catalogGrid = document.getElementById('menu-catalog-grid');
  if (!catalogGrid) return;

  const searchInput = document.getElementById('menu-search-input');
  const sortSelect = document.getElementById('menu-sort-select');
  const catPills = document.querySelectorAll('.cat-pill-btn');
  const dietBtns = document.querySelectorAll('.diet-toggle-btn');
  const activeCountEl = document.getElementById('menu-items-count');

  // Filter State
  let state = {
    category: 'all',
    diet: 'all', // 'all', 'veg', 'non-veg'
    searchQuery: '',
    sortBy: 'default'
  };

  // Check URL query parameters for initial search or category filter
  const urlParams = new URLSearchParams(window.location.search);
  const initialSearch = urlParams.get('search');
  const initialCat = urlParams.get('cat');

  if (initialSearch) {
    state.searchQuery = initialSearch.toLowerCase();
    if (searchInput) searchInput.value = initialSearch;
  }

  if (initialCat) {
    state.category = initialCat.toLowerCase();
    catPills.forEach(pill => {
      if (pill.getAttribute('data-cat').toLowerCase().includes(state.category)) {
        catPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      }
    });
  }

  // Render Catalog
  const renderMenu = () => {
    const allItems = StacklyStorage.getMenu();

    let filtered = allItems.filter(item => {
      // Category filter
      if (state.category !== 'all') {
        const itemCat = item.category.toLowerCase();
        if (!itemCat.includes(state.category)) return false;
      }

      // Diet filter
      if (state.diet === 'veg' && !item.veg) return false;
      if (state.diet === 'non-veg' && item.veg) return false;

      // Search filter
      if (state.searchQuery) {
        const nameMatch = item.name.toLowerCase().includes(state.searchQuery);
        const descMatch = (item.description || '').toLowerCase().includes(state.searchQuery);
        const catMatch = item.category.toLowerCase().includes(state.searchQuery);
        if (!nameMatch && !descMatch && !catMatch) return false;
      }

      return true;
    });

    // Sorting
    if (state.sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (state.sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (state.sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Update count indicator
    if (activeCountEl) {
      activeCountEl.textContent = `Showing ${filtered.length} delicious item${filtered.length === 1 ? '' : 's'}`;
    }

    if (filtered.length === 0) {
      catalogGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
          <i class="fa-solid fa-magnifying-glass" style="font-size: 3rem; color: var(--white-25); margin-bottom: 1rem;"></i>
          <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem;">No Pizzas Found</h3>
          <p style="color: var(--white-60); margin-bottom: 1.5rem;">We couldn't find any items matching your criteria.</p>
          <button class="btn btn-primary" onclick="resetFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    let html = '';
    filtered.forEach(item => {
      const dietClass = item.veg ? 'menu-diet-veg' : 'menu-diet-nonveg';
      const dietLabel = item.veg ? 'Veg' : 'Non-Veg';

      html += `
        <article class="menu-item-card" data-id="${item.id}">
          <div class="menu-item-thumb-wrap">
            <img src="${item.image || 'assets/images/margherita.webp'}" alt="${item.name}" class="menu-item-thumb" loading="lazy">
            <span class="menu-item-diet ${dietClass}">${dietLabel}</span>
            ${item.badge ? `<span class="menu-item-badge">${item.badge}</span>` : ''}
          </div>

          <div class="menu-item-body">
            <h3 class="menu-item-title" onclick="openProductModal('${item.id}')">${item.name}</h3>
            <p class="menu-item-desc">${item.description}</p>
            <div class="menu-item-footer">
              <span class="menu-item-price">₹${item.price}</span>
              <div class="menu-action-btns">
                <button class="btn-quick-view" onclick="openProductModal('${item.id}')" title="Quick view details" aria-label="Quick view ${item.name}">
                  <i class="fa-solid fa-eye"></i>
                </button>
                <button class="btn-add-menu-cart" onclick="addMenuItemToCart('${item.id}')">
                  <i class="fa-solid fa-plus"></i> Add
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    });

    catalogGrid.innerHTML = html;
  };

  // Reset Filters
  window.resetFilters = () => {
    state.category = 'all';
    state.diet = 'all';
    state.searchQuery = '';
    state.sortBy = 'default';

    if (searchInput) searchInput.value = '';
    if (sortSelect) sortSelect.value = 'default';

    catPills.forEach(p => p.classList.remove('active'));
    document.querySelector('.cat-pill-btn[data-cat="all"]')?.classList.add('active');

    dietBtns.forEach(d => d.classList.remove('active'));
    document.querySelector('.diet-toggle-btn[data-diet="all"]')?.classList.add('active');

    renderMenu();
  };

  // Event Listeners
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim().toLowerCase();
      renderMenu();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderMenu();
    });
  }

  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.category = pill.getAttribute('data-cat').toLowerCase();
      renderMenu();
    });
  });

  dietBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dietBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.diet = btn.getAttribute('data-diet');
      renderMenu();
    });
  });

  // Global Add to Cart Wrapper
  window.addMenuItemToCart = (itemId) => {
    const allItems = StacklyStorage.getMenu();
    const item = allItems.find(i => i.id === itemId);
    if (item) {
      StacklyStorage.addToCart(item);
      StacklyUI.showToast(`Added ${item.name} to cart!`, 'fa-cart-plus');
    }
  };

  // Product Detail Quick View Modal
  const modalOverlay = document.getElementById('product-detail-modal');
  const modalCloseBtn = document.getElementById('product-modal-close');

  window.openProductModal = (itemId) => {
    const allItems = StacklyStorage.getMenu();
    const item = allItems.find(i => i.id === itemId);
    if (!item || !modalOverlay) return;

    const modalBody = document.getElementById('product-modal-content');
    if (modalBody) {
      modalBody.innerHTML = `
        <div class="product-modal-grid">
          <div>
            <img src="${item.image || 'assets/images/margherita.webp'}" alt="${item.name}" class="product-modal-img">
          </div>
          <div class="product-modal-details">
            <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.5rem;">
              <span class="badge-tag" style="margin-bottom:0;">${item.category}</span>
              <span style="font-size:0.8rem; font-weight:700; color:${item.veg ? 'var(--primary)' : '#ff5252'};">
                <i class="fa-solid fa-circle"></i> ${item.veg ? '100% Pure Veg' : 'Non-Vegetarian'}
              </span>
            </div>
            <h2 class="product-modal-title">${item.name}</h2>
            <div class="product-modal-price">₹${item.price}</div>
            <p class="product-modal-desc">${item.description}</p>

            <div class="product-modal-meta">
              <div class="meta-row"><span>Preparation:</span> <strong>Fresh Hand-Tossed</strong></div>
              <div class="meta-row"><span>Baking Time:</span> <strong>8–10 Mins at 450°C</strong></div>
              <div class="meta-row"><span>Allergens:</span> <strong>Gluten, Dairy</strong></div>
              <div class="meta-row"><span>Portion Size:</span> <strong>Serves 1–2 People</strong></div>
            </div>

            <div style="display:flex; gap:1rem; margin-top:auto;">
              <button class="btn btn-primary" style="flex:1;" onclick="addMenuItemToCart('${item.id}'); closeProductModal();">
                <i class="fa-solid fa-cart-shopping"></i> Add to Cart • ₹${item.price}
              </button>
              <button class="btn btn-secondary" onclick="StacklyStorage.toggleFavorite('${item.id}'); StacklyUI.showToast('Saved to your favorites!', 'fa-heart');" title="Save to favorites">
                <i class="fa-solid fa-heart"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeProductModal = () => {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProductModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeProductModal();
    });
  }

  // Initial Render
  renderMenu();
});
