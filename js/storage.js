/**
 * STACKLY PIZZA SHOP - STORAGE & DATA LAYER
 * Handles LocalStorage & SessionStorage for frontend demonstration
 */

const StacklyStorage = (() => {
  // Storage Keys
  const KEYS = {
    MENU: 'stackly_menu_items',
    CATEGORIES: 'stackly_categories',
    ORDERS: 'stackly_orders',
    CUSTOMERS: 'stackly_customers',
    OFFERS: 'stackly_offers',
    INVENTORY: 'stackly_inventory',
    CART: 'stackly_cart',
    FAVORITES: 'stackly_favorites',
    USERS: 'stackly_users',
    CURRENT_USER: 'stackly_session_user',
    CURRENT_ROLE: 'stackly_session_role'
  };

  // Initial Seed Data
  const defaultMenu = [
    {
      id: 'p-1',
      name: 'Margherita',
      category: 'Classic Pizzas',
      price: 199,
      veg: true,
      description: 'Fresh mozzarella, rich tomato sauce, fresh basil leaves, and virgin olive oil.',
      image: 'assets/images/margherita.webp',
      badge: 'Bestseller',
      popular: true,
      signature: true
    },
    {
      id: 'p-2',
      name: 'Veg Supreme',
      category: 'Veg Pizzas',
      price: 249,
      veg: true,
      description: 'Loaded with crisp bell peppers, sweet corn, red onion, black olives & mozzarella.',
      image: 'assets/images/veg-supreme.webp',
      badge: 'Popular',
      popular: true,
      signature: true
    },
    {
      id: 'p-3',
      name: 'Pepperoni Feast',
      category: 'Non-Veg Pizzas',
      price: 299,
      veg: false,
      description: 'Classic American pepperoni loaded with mozzarella and signature Italian sauce.',
      image: 'assets/images/pepperoni.webp',
      badge: 'Chef Choice',
      popular: true,
      signature: true
    },
    {
      id: 'p-4',
      name: 'Farmhouse Delight',
      category: 'Veg Pizzas',
      price: 269,
      veg: true,
      description: 'Fresh garden vegetables, grilled mushrooms, capsicum and golden corn with herb blend.',
      image: 'assets/images/farmhouse.webp',
      badge: 'Classic',
      popular: false,
      signature: true
    },
    {
      id: 'p-5',
      name: 'BBQ Chicken Pizza',
      category: 'Non-Veg Pizzas',
      price: 329,
      veg: false,
      description: 'Tender smoked BBQ chicken, red onions, mozzarella and rich hickory barbecue sauce.',
      image: 'assets/images/bbq-chicken.webp',
      badge: 'Trending',
      popular: true,
      signature: true
    },
    {
      id: 'p-6',
      name: 'Cheese Burst Special',
      category: 'Cheese Burst Pizzas',
      price: 349,
      veg: true,
      description: 'A decadent crust overflowing with molten liquid cheese and oregano seasoning.',
      image: 'assets/images/cheese-burst.webp',
      badge: 'Signature',
      popular: true,
      signature: true
    },
    {
      id: 'p-7',
      name: 'Truffle Mushroom',
      category: 'Premium Pizzas',
      price: 379,
      veg: true,
      description: 'Sautéed wild button mushrooms with creamy truffle sauce, thyme, and aged parmesan.',
      image: 'assets/images/truffle-mushroom.webp',
      badge: 'Gourmet',
      popular: false,
      signature: false
    },
    {
      id: 'p-8',
      name: 'Four Cheese Special',
      category: 'Premium Pizzas',
      price: 399,
      veg: true,
      description: 'Artisan blend of Italian Mozzarella, sharp Cheddar, mild Gouda, and Parmesan.',
      image: 'assets/images/four-cheese.webp',
      badge: 'Chef Special',
      popular: false,
      signature: false
    },
    {
      id: 'p-9',
      name: 'Cheese Garlic Bread',
      category: 'Sides',
      price: 149,
      veg: true,
      description: 'Warm, oven-baked French baguette slices smothered in garlic herb butter and cheese.',
      image: 'assets/images/garlic-bread.webp',
      badge: 'Side',
      popular: true,
      signature: false
    },
    {
      id: 'p-10',
      name: 'Crispy French Fries',
      category: 'Sides',
      price: 129,
      veg: true,
      description: 'Golden salted French fries sprinkled with peri-peri herbs and served with dip.',
      image: 'assets/images/french-fries.webp',
      badge: 'Side',
      popular: false,
      signature: false
    },
    {
      id: 'p-11',
      name: 'Solo Pizza Combo',
      category: 'Combos',
      price: 299,
      veg: true,
      description: '1 Regular pizza of your choice, cheesy garlic breadsticks, and a chilled drink.',
      image: 'assets/images/pizza-combo.webp',
      badge: 'Combo Deal',
      popular: true,
      signature: false
    },
    {
      id: 'p-12',
      name: 'Family Feast Combo',
      category: 'Combos',
      price: 799,
      veg: true,
      description: '2 Medium pizzas, stuffed garlic bread, loaded potato wedges, and 4 beverages.',
      image: 'assets/images/family-dining.webp',
      badge: 'Best Value',
      popular: true,
      signature: false
    },
    {
      id: 'p-13',
      name: 'Chocolate Brownie',
      category: 'Beverages & Desserts',
      price: 139,
      veg: true,
      description: 'Warm gooey chocolate fudge brownie baked with Belgian dark cocoa.',
      image: 'assets/images/chocolate-brownie.webp',
      badge: 'Dessert',
      popular: false,
      signature: false
    },
    {
      id: 'p-14',
      name: 'Fresh Citrus Juice',
      category: 'Beverages & Desserts',
      price: 99,
      veg: true,
      description: 'Freshly pressed Valencia orange and mint blend served chilled.',
      image: 'assets/images/fresh-juice.webp',
      badge: 'Beverage',
      popular: false,
      signature: false
    }
  ];

  const defaultCategories = [
    'Classic Pizzas',
    'Veg Pizzas',
    'Non-Veg Pizzas',
    'Premium Pizzas',
    'Cheese Burst Pizzas',
    'Combos',
    'Sides',
    'Beverages & Desserts'
  ];

  const defaultOrders = [
    {
      orderId: 'ORD-1001',
      customer: 'Rahul Sharma',
      email: 'rahul@gmail.com',
      pizza: 'Margherita',
      items: [{ name: 'Margherita', qty: 2, price: 199 }],
      quantity: 2,
      total: 398,
      orderTime: '10 mins ago',
      orderDate: '2026-11-13',
      status: 'Preparing',
      address: '221B Baker Street, Flat 4B'
    },
    {
      orderId: 'ORD-1002',
      customer: 'Priya Patel',
      email: 'priya@gmail.com',
      pizza: 'Pepperoni Feast',
      items: [{ name: 'Pepperoni Feast', qty: 1, price: 299 }],
      quantity: 1,
      total: 299,
      orderTime: '25 mins ago',
      orderDate: '2026-11-13',
      status: 'Pending',
      address: '74 Park View Avenue'
    },
    {
      orderId: 'ORD-1003',
      customer: 'Arun Kumar',
      email: 'arun@gmail.com',
      pizza: 'Veg Supreme',
      items: [{ name: 'Veg Supreme', qty: 3, price: 249 }],
      quantity: 3,
      total: 747,
      orderTime: '1 hour ago',
      orderDate: '2026-11-13',
      status: 'Delivered',
      address: '12 Green Glen Layout'
    },
    {
      orderId: 'ORD-1004',
      customer: 'Meena Nair',
      email: 'meena@gmail.com',
      pizza: 'BBQ Chicken',
      items: [{ name: 'BBQ Chicken', qty: 2, price: 329 }],
      quantity: 2,
      total: 698,
      orderTime: '2 hours ago',
      orderDate: '2026-11-13',
      status: 'Cancelled',
      address: '88 Cyber City Heights'
    }
  ];

  const defaultCustomers = [
    { name: 'Rahul Sharma', email: 'rahul@gmail.com', phone: '+91 98765 43210', orderCount: 8, totalSpending: 3120, recentOrder: 'Margherita x2', status: 'Active' },
    { name: 'Priya Patel', email: 'priya@gmail.com', phone: '+91 98765 43211', orderCount: 5, totalSpending: 1850, recentOrder: 'Pepperoni Feast', status: 'Active' },
    { name: 'Arun Kumar', email: 'arun@gmail.com', phone: '+91 98765 43212', orderCount: 12, totalSpending: 4950, recentOrder: 'Veg Supreme x3', status: 'VIP' },
    { name: 'Meena Nair', email: 'meena@gmail.com', phone: '+91 98765 43213', orderCount: 3, totalSpending: 1240, recentOrder: 'BBQ Chicken', status: 'Inactive' }
  ];

  const defaultOffers = [
    { code: 'STACKLY30', title: 'First Order Special', discount: '30% OFF', description: 'Enjoy 30% off on your first pizza order with us.', expiry: '31 Dec 2026', minOrder: 199, status: 'Active' },
    { code: 'FAMILY40', title: 'Family Feast Deal', discount: '₹200 OFF', description: 'Get flat ₹200 off on any Family Feast or Party Combo.', expiry: '31 Dec 2026', minOrder: 699, status: 'Active' },
    { code: 'WEEKEND50', title: 'Weekend Pizza Treat', discount: '20% OFF', description: 'Special weekend prices on all signature and premium pizzas.', expiry: 'Every Weekend', minOrder: 299, status: 'Active' },
    { code: 'BOGO2026', title: 'Buy 1 Get 1 Free', discount: 'BOGO', description: 'Buy any medium gourmet pizza and get a classic pizza free.', expiry: 'Limited Time', minOrder: 399, status: 'Active' }
  ];

  const defaultInventory = [
    { item: 'Mozzarella Cheese', category: 'Dairy', stock: '48 kg', status: 'In Stock', alert: false },
    { item: 'Tomato Pizza Sauce', category: 'Sauces', stock: '65 L', status: 'In Stock', alert: false },
    { item: 'Organic Pizza Dough', category: 'Bakery', stock: '120 pcs', status: 'In Stock', alert: false },
    { item: 'Fresh Mushrooms', category: 'Produce', stock: '6 kg', status: 'Low Stock', alert: true },
    { item: 'Spanish Black Olives', category: 'Pantry', stock: '18 cans', status: 'In Stock', alert: false },
    { item: 'Green Capsicum', category: 'Produce', stock: '14 kg', status: 'In Stock', alert: false },
    { item: 'Artisan Pepperoni', category: 'Meat', stock: '4 kg', status: 'Low Stock', alert: true },
    { item: 'Fresh Basil Leaves', category: 'Herbs', stock: '2.5 kg', status: 'In Stock', alert: false }
  ];

  // Helper getters & setters
  const getJson = (key, fallback) => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch (e) {
      console.warn('Storage read error for key:', key, e);
      return fallback;
    }
  };

  const setJson = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Storage write error for key:', key, e);
      return false;
    }
  };

  // Initialization
  const init = () => {
    if (!localStorage.getItem(KEYS.MENU)) setJson(KEYS.MENU, defaultMenu);
    if (!localStorage.getItem(KEYS.CATEGORIES)) setJson(KEYS.CATEGORIES, defaultCategories);
    if (!localStorage.getItem(KEYS.ORDERS)) setJson(KEYS.ORDERS, defaultOrders);
    if (!localStorage.getItem(KEYS.CUSTOMERS)) setJson(KEYS.CUSTOMERS, defaultCustomers);
    if (!localStorage.getItem(KEYS.OFFERS)) setJson(KEYS.OFFERS, defaultOffers);
    if (!localStorage.getItem(KEYS.INVENTORY)) setJson(KEYS.INVENTORY, defaultInventory);
    if (!localStorage.getItem(KEYS.CART)) setJson(KEYS.CART, []);
    if (!localStorage.getItem(KEYS.FAVORITES)) setJson(KEYS.FAVORITES, ['p-1', 'p-3', 'p-6']);
    if (!localStorage.getItem(KEYS.USERS)) {
      setJson(KEYS.USERS, [
        { name: 'Admin', email: 'admin@stackly.com', role: 'Admin', password: 'admin' },
        { name: 'Rahul Sharma', email: 'client@stackly.com', role: 'Client', password: 'user' }
      ]);
    }
  };

  init();

  return {
    // Menu
    getMenu: () => getJson(KEYS.MENU, defaultMenu),
    saveMenu: (items) => setJson(KEYS.MENU, items),
    addMenuItem: (item) => {
      const menu = getJson(KEYS.MENU, defaultMenu);
      menu.unshift(item);
      setJson(KEYS.MENU, menu);
      return menu;
    },
    updateMenuItem: (id, updatedFields) => {
      let menu = getJson(KEYS.MENU, defaultMenu);
      menu = menu.map(item => item.id === id ? { ...item, ...updatedFields } : item);
      setJson(KEYS.MENU, menu);
      return menu;
    },
    deleteMenuItem: (id) => {
      let menu = getJson(KEYS.MENU, defaultMenu);
      menu = menu.filter(item => item.id !== id);
      setJson(KEYS.MENU, menu);
      return menu;
    },

    // Categories
    getCategories: () => getJson(KEYS.CATEGORIES, defaultCategories),
    addCategory: (catName) => {
      const cats = getJson(KEYS.CATEGORIES, defaultCategories);
      if (!cats.includes(catName)) {
        cats.push(catName);
        setJson(KEYS.CATEGORIES, cats);
      }
      return cats;
    },
    deleteCategory: (catName) => {
      let cats = getJson(KEYS.CATEGORIES, defaultCategories);
      cats = cats.filter(c => c !== catName);
      setJson(KEYS.CATEGORIES, cats);
      return cats;
    },

    // Orders
    getOrders: () => getJson(KEYS.ORDERS, defaultOrders),
    addOrder: (order) => {
      const orders = getJson(KEYS.ORDERS, defaultOrders);
      orders.unshift(order);
      setJson(KEYS.ORDERS, orders);
      return orders;
    },
    updateOrderStatus: (orderId, newStatus) => {
      let orders = getJson(KEYS.ORDERS, defaultOrders);
      orders = orders.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o);
      setJson(KEYS.ORDERS, orders);
      return orders;
    },

    // Customers
    getCustomers: () => getJson(KEYS.CUSTOMERS, defaultCustomers),
    
    // Offers
    getOffers: () => getJson(KEYS.OFFERS, defaultOffers),
    addOffer: (offer) => {
      const offers = getJson(KEYS.OFFERS, defaultOffers);
      offers.unshift(offer);
      setJson(KEYS.OFFERS, offers);
      return offers;
    },
    deleteOffer: (code) => {
      let offers = getJson(KEYS.OFFERS, defaultOffers);
      offers = offers.filter(o => o.code !== code);
      setJson(KEYS.OFFERS, offers);
      return offers;
    },

    // Inventory
    getInventory: () => getJson(KEYS.INVENTORY, defaultInventory),
    updateInventoryItem: (index, item) => {
      const inv = getJson(KEYS.INVENTORY, defaultInventory);
      if (inv[index]) {
        inv[index] = item;
        setJson(KEYS.INVENTORY, inv);
      }
      return inv;
    },

    // Cart
    getCart: () => getJson(KEYS.CART, []),
    saveCart: (cart) => setJson(KEYS.CART, cart),
    addToCart: (item) => {
      const cart = getJson(KEYS.CART, []);
      const existing = cart.find(c => c.id === item.id);
      if (existing) {
        existing.qty = (existing.qty || 1) + 1;
      } else {
        cart.push({ ...item, qty: 1 });
      }
      setJson(KEYS.CART, cart);
      window.dispatchEvent(new CustomEvent('stackly:cart-updated', { detail: { cart } }));
      return cart;
    },
    updateCartQty: (id, delta) => {
      let cart = getJson(KEYS.CART, []);
      const item = cart.find(c => c.id === id);
      if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
          cart = cart.filter(c => c.id !== id);
        }
      }
      setJson(KEYS.CART, cart);
      window.dispatchEvent(new CustomEvent('stackly:cart-updated', { detail: { cart } }));
      return cart;
    },
    removeFromCart: (id) => {
      let cart = getJson(KEYS.CART, []);
      cart = cart.filter(c => c.id !== id);
      setJson(KEYS.CART, cart);
      window.dispatchEvent(new CustomEvent('stackly:cart-updated', { detail: { cart } }));
      return cart;
    },
    clearCart: () => {
      setJson(KEYS.CART, []);
      window.dispatchEvent(new CustomEvent('stackly:cart-updated', { detail: { cart: [] } }));
    },

    // Favorites
    getFavorites: () => getJson(KEYS.FAVORITES, []),
    toggleFavorite: (pizzaId) => {
      let favs = getJson(KEYS.FAVORITES, []);
      if (favs.includes(pizzaId)) {
        favs = favs.filter(id => id !== pizzaId);
      } else {
        favs.push(pizzaId);
      }
      setJson(KEYS.FAVORITES, favs);
      window.dispatchEvent(new CustomEvent('stackly:favorites-updated', { detail: { favs } }));
      return favs;
    },

    // Auth & Session
    getUsers: () => getJson(KEYS.USERS, []),
    registerUser: (user) => {
      const users = getJson(KEYS.USERS, []);
      users.push(user);
      setJson(KEYS.USERS, users);
      return user;
    },
    getSession: () => {
      const userStr = sessionStorage.getItem(KEYS.CURRENT_USER) || 
                      localStorage.getItem(KEYS.CURRENT_USER) || 
                      localStorage.getItem('stackly_auth_user') || 
                      localStorage.getItem('stackly_user');
      const role = sessionStorage.getItem(KEYS.CURRENT_ROLE) || 
                   localStorage.getItem(KEYS.CURRENT_ROLE);
      return {
        user: userStr ? JSON.parse(userStr) : null,
        role: role || null,
        isLoggedIn: Boolean(userStr)
      };
    },
    setSession: (user, role) => {
      sessionStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      sessionStorage.setItem(KEYS.CURRENT_ROLE, role);
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      localStorage.setItem(KEYS.CURRENT_ROLE, role);
      localStorage.setItem('stackly_auth_user', JSON.stringify(user));
      localStorage.setItem('stackly_user', JSON.stringify(user));
      if (role === 'Admin') {
        localStorage.setItem('stackly_admin_user', JSON.stringify(user));
      } else {
        localStorage.setItem('stackly_client_user', JSON.stringify(user));
      }
    },
    clearSession: () => {
      sessionStorage.removeItem(KEYS.CURRENT_USER);
      sessionStorage.removeItem(KEYS.CURRENT_ROLE);
      localStorage.removeItem(KEYS.CURRENT_USER);
      localStorage.removeItem(KEYS.CURRENT_ROLE);
      localStorage.removeItem('stackly_auth_user');
      localStorage.removeItem('stackly_user');
    }
  };
})();
