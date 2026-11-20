(function (E) {
  'use strict';

  const CART_KEY = 'lumen_oak_cart';
  const ORDER_KEY = 'lumen_oak_order';
  let memoryCart = null;
  let memoryOrder = null;
  const listeners = [];

  function validLine(line) {
    return line && typeof line.id === 'string' && Number.isInteger(line.qty) && line.qty > 0;
  }

  function load() {
    if (memoryCart) return memoryCart.map(function (line) { return { id: line.id, qty: line.qty }; });
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (!raw) return [];
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) throw new Error('cart');
      return data.filter(validLine).map(function (line) { return { id: line.id, qty: line.qty }; });
    } catch (err) {
      memoryCart = [];
      try { localStorage.removeItem(CART_KEY); } catch (ignore) { /* storage blocked */ }
      return [];
    }
  }

  function save(lines) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(lines));
      memoryCart = null;
    } catch (err) {
      memoryCart = lines.map(function (line) { return { id: line.id, qty: line.qty }; });
    }
    listeners.forEach(function (fn) { fn(); });
  }

  function maxFor(product) {
    return Math.min(10, product.stock);
  }

  function detailed(lines) {
    return lines.map(function (line) {
      const product = E.byId(line.id);
      if (!product) return null;
      return { product: product, qty: line.qty, lineTotal: product.price * line.qty };
    }).filter(Boolean);
  }

  function totalsFrom(items) {
    const subtotal = items.reduce(function (sum, item) { return sum + item.lineTotal; }, 0);
    const shipping = E.shippingFor(subtotal);
    return {
      subtotal: subtotal,
      shipping: shipping,
      total: subtotal + shipping,
      count: items.reduce(function (sum, item) { return sum + item.qty; }, 0)
    };
  }

  E.store = {
    subscribe: function (fn) { listeners.push(fn); },
    lines: load,
    detailed: function () { return detailed(load()); },
    totals: function () { return totalsFrom(detailed(load())); },
    count: function () {
      return load().reduce(function (sum, line) { return sum + line.qty; }, 0);
    },
    add: function (id, qty) {
      const product = E.byId(id);
      const amount = Math.max(1, Math.floor(Number(qty) || 1));
      if (!product) return { ok: false, reason: 'missing' };
      if (product.stock < 1) return { ok: false, reason: 'stock', product: product };
      const lines = load();
      const line = lines.find(function (item) { return item.id === id; });
      const current = line ? line.qty : 0;
      const next = Math.min(maxFor(product), current + amount);
      const added = next - current;
      if (added <= 0) return { ok: false, reason: 'max', product: product };
      if (line) line.qty = next;
      else lines.push({ id: id, qty: next });
      save(lines);
      return { ok: true, product: product, qty: added };
    },
    setQty: function (id, qty) {
      const product = E.byId(id);
      const lines = load();
      const line = lines.find(function (item) { return item.id === id; });
      if (!product || !line) return null;
      const requested = Math.floor(Number(qty) || line.qty);
      const next = Math.max(1, Math.min(maxFor(product), requested));
      const prev = line.qty;
      if (next !== prev) {
        line.qty = next;
        save(lines);
      }
      return { product: product, prev: prev, next: next, clamped: requested !== next };
    },
    remove: function (id) {
      const product = E.byId(id);
      const lines = load();
      const line = lines.find(function (item) { return item.id === id; });
      save(lines.filter(function (item) { return item.id !== id; }));
      return { product: product, qty: line ? line.qty : 0 };
    },
    clear: function () { save([]); },
    saveOrder: function (order) {
      memoryOrder = order;
      try { sessionStorage.setItem(ORDER_KEY, JSON.stringify(order)); } catch (err) { /* keep memory copy */ }
    },
    getOrder: function (id) {
      let order = memoryOrder;
      if (!order) {
        try { order = JSON.parse(sessionStorage.getItem(ORDER_KEY) || 'null'); } catch (err) { order = null; }
      }
      if (!order || order.id !== id) return null;
      return order;
    }
  };
})(window.Ecom = window.Ecom || {});
