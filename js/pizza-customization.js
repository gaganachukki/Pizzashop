/**
 * STACKLY PIZZA SHOP - BUILD YOUR OWN PIZZA ENGINE
 * Interactive customizer with dynamic pricing, multi-topping selector & preview
 */

document.addEventListener('DOMContentLoaded', () => {
  const customizerForm = document.getElementById('pizza-customizer-form');
  if (!customizerForm) return;

  // Pricing Matrix (Demonstration)
  const PRICING = {
    sizes: {
      'regular': { name: 'Regular (8")', price: 199 },
      'medium': { name: 'Medium (10")', price: 299 },
      'large': { name: 'Large (12")', price: 389 }
    },
    crusts: {
      'classic': { name: 'Classic Hand Tossed', price: 0 },
      'thin': { name: 'Crispy Thin Crust', price: 30 },
      'cheese-burst': { name: 'Cheese Burst Crust', price: 70 },
      'pan': { name: 'Golden Pan Crust', price: 40 }
    },
    sauces: {
      'tomato': { name: 'Classic Italian Tomato', price: 0 },
      'marinara': { name: 'Spicy Marinara', price: 20 },
      'creamy-white': { name: 'Creamy White Garlic', price: 30 }
    },
    cheeses: {
      'mozzarella': { name: 'Pure Mozzarella', price: 0 },
      'extra-cheese': { name: 'Double Mozzarella', price: 50 },
      'four-blend': { name: 'Four Cheese Blend', price: 65 }
    },
    toppings: {
      'onion': { name: 'Red Onions', price: 30 },
      'capsicum': { name: 'Crispy Bell Peppers', price: 30 },
      'mushroom': { name: 'Sliced Button Mushrooms', price: 40 },
      'olives': { name: 'Spanish Black Olives', price: 45 },
      'jalapenos': { name: 'Pickled Jalapeños', price: 35 },
      'corn': { name: 'Golden Sweet Corn', price: 30 },
      'pepperoni': { name: 'Crispy Pepperoni', price: 60 },
      'paneer': { name: 'Spiced Cottage Cheese', price: 45 }
    }
  };

  // State
  let currentConfig = {
    size: 'medium',
    crust: 'cheese-burst',
    sauce: 'tomato',
    cheese: 'mozzarella',
    toppings: ['capsicum', 'mushroom', 'olives']
  };

  let currentPrice = 0;

  // Elements
  const priceDisplay = document.getElementById('custom-pizza-price');
  const summarySpecs = document.getElementById('custom-pizza-specs');
  const toppingsCountBadge = document.getElementById('selected-toppings-count');
  const addToCartBtn = document.getElementById('btn-add-custom-pizza');
  const resetBtn = document.getElementById('btn-reset-custom-pizza');
  const visualToppingLayers = document.getElementById('visual-topping-layers');

  // Calculate & Animate Price
  const updateCustomizer = () => {
    // Collect choices
    const sizeRadio = document.querySelector('input[name="pizza-size"]:checked');
    const crustRadio = document.querySelector('input[name="pizza-crust"]:checked');
    const sauceRadio = document.querySelector('input[name="pizza-sauce"]:checked');
    const cheeseRadio = document.querySelector('input[name="pizza-cheese"]:checked');

    if (sizeRadio) currentConfig.size = sizeRadio.value;
    if (crustRadio) currentConfig.crust = crustRadio.value;
    if (sauceRadio) currentConfig.sauce = sauceRadio.value;
    if (cheeseRadio) currentConfig.cheese = cheeseRadio.value;

    const checkedToppings = Array.from(document.querySelectorAll('input[name="pizza-toppings"]:checked')).map(cb => cb.value);
    currentConfig.toppings = checkedToppings;

    // Calculate total price
    let total = PRICING.sizes[currentConfig.size]?.price || 199;
    total += PRICING.crusts[currentConfig.crust]?.price || 0;
    total += PRICING.sauces[currentConfig.sauce]?.price || 0;
    total += PRICING.cheeses[currentConfig.cheese]?.price || 0;

    currentConfig.toppings.forEach(topKey => {
      total += PRICING.toppings[topKey]?.price || 0;
    });

    // Animate Price Count
    if (priceDisplay) {
      animateValue(priceDisplay, currentPrice || total, total, 400);
    }
    currentPrice = total;

    // Update Toppings Count
    if (toppingsCountBadge) {
      toppingsCountBadge.textContent = `${currentConfig.toppings.length} selected`;
    }

    // Update Summary Specs Text
    if (summarySpecs) {
      const topNames = currentConfig.toppings.map(t => PRICING.toppings[t]?.name).filter(Boolean);
      summarySpecs.innerHTML = `
        <div style="margin-bottom:0.4rem;"><strong>Base:</strong> ${PRICING.sizes[currentConfig.size]?.name} with ${PRICING.crusts[currentConfig.crust]?.name}</div>
        <div style="margin-bottom:0.4rem;"><strong>Flavor:</strong> ${PRICING.sauces[currentConfig.sauce]?.name} &amp; ${PRICING.cheeses[currentConfig.cheese]?.name}</div>
        <div><strong>Toppings:</strong> ${topNames.length > 0 ? topNames.join(', ') : 'None selected (Classic Plain)'}</div>
      `;
    }

    // Update Visual Toppings Preview
    if (visualToppingLayers) {
      visualToppingLayers.innerHTML = '';
      currentConfig.toppings.forEach(topKey => {
        const layer = document.createElement('div');
        layer.className = `topping-overlay layer-${topKey}`;
        visualToppingLayers.appendChild(layer);
      });
    }
  };

  // Helper number counter animation
  function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = Math.floor(progress * (end - start) + start);
      obj.innerHTML = `₹${current}`;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        obj.innerHTML = `₹${end}`;
      }
    };
    window.requestAnimationFrame(step);
  }

  // Event Listeners for Customizer inputs
  customizerForm.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', updateCustomizer);
  });

  // Add Custom Pizza to Cart
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const customItem = {
        id: `custom-${Date.now()}`,
        name: `Custom ${PRICING.sizes[currentConfig.size]?.name.split(' ')[0]} Pizza`,
        category: 'Custom Creations',
        price: currentPrice,
        veg: !currentConfig.toppings.includes('pepperoni'),
        description: `${PRICING.crusts[currentConfig.crust]?.name}, ${PRICING.cheeses[currentConfig.cheese]?.name}, Toppings: ${currentConfig.toppings.join(', ')}`,
        image: 'assets/images/cheese-burst.webp',
        isCustom: true,
        specs: currentConfig
      };

      StacklyStorage.addToCart(customItem);
      StacklyUI.showToast(`Custom pizza added to cart! (₹${currentPrice})`, 'fa-pizza-slice');
    });
  }

  // Reset Customization
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      customizerForm.reset();
      updateCustomizer();
      StacklyUI.showToast('Customizer reset to defaults.', 'fa-rotate-left');
    });
  }

  // Initial Calculation
  updateCustomizer();
});
