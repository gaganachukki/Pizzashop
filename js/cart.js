/**
 * STACKLY PIZZA SHOP - CART MODULE
 * Manages cart transactions, items counter, and sync across tabs
 */

const StacklyCart = (() => {
  const getItemsCount = () => {
    const cart = StacklyStorage.getCart();
    return cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  };

  const getSubtotal = () => {
    const cart = StacklyStorage.getCart();
    return cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
  };

  const updateBadges = () => {
    const count = getItemsCount();
    document.querySelectorAll('.cart-counter-badge').forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  };

  // Sync across tabs via window storage event
  window.addEventListener('storage', (e) => {
    if (e.key === 'stackly_cart') {
      updateBadges();
      window.dispatchEvent(new CustomEvent('stackly:cart-updated', { detail: { cart: StacklyStorage.getCart() } }));
    }
  });

  return {
    getItemsCount,
    getSubtotal,
    updateBadges
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  StacklyCart.updateBadges();
});
