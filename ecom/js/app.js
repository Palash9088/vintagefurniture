(function (E) {
  'use strict';

  const RULES = [
    ['name', function (value) { return value.trim().length >= 2; }, 'Enter the name for the delivery.'],
    ['email', function (value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }, 'Enter a valid email.'],
    ['phone', function (value) { return /^[6-9]\d{9}$/.test(value); }, 'Enter a 10-digit mobile number.'],
    ['address', function (value) { return value.trim().length >= 5; }, 'Enter the street address.'],
    ['city', function (value) { return value.trim().length >= 2; }, 'Enter the city.'],
    ['pin', function (value) { return /^[1-9]\d{5}$/.test(value); }, 'Enter a 6-digit PIN code.'],
    ['state', function (value) { return value.trim().length > 0; }, 'Choose a state.'],
    ['payment', function (value) { return value === 'upi' || value === 'card' || value === 'cod'; }, 'Choose a payment method.']
  ];

  function randomOrderId() {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const bytes = new Uint8Array(8);
    if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(bytes);
    else {
      for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
    }
    let id = 'LO';
    for (let i = 0; i < bytes.length; i += 1) id += alphabet[bytes[i] % alphabet.length];
    return id;
  }

  function updateCartCount() {
    const count = E.store.count();
    const badge = document.querySelector('[data-cart-count]');
    if (badge) badge.textContent = String(count);
    const link = document.querySelector('.cart-link');
    if (link) link.setAttribute('aria-label', 'Cart, ' + count + (count === 1 ? ' item' : ' items'));
  }

  function markNav(route) {
    document.querySelectorAll('[data-nav]').forEach(function (link) {
      const key = link.getAttribute('data-nav');
      const on = (key === 'shop' && (route.name === 'shop' || route.name === 'product')) ||
        (key === 'home' && route.name === 'home') ||
        key === route.name;
      if (on) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  let toastTimer = 0;
  function toast(message) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { el.classList.remove('show'); }, 2800);
  }

  function show(route, options) {
    document.title = E.views.titleFor(route);
    if (!options || options.track !== false) E.analytics.pageView(document.title);
    E.views.render(route, options || { track: true });
    markNav(route);
    updateCartCount();
  }

  function syncQtyButtons(input) {
    const control = input.closest('[data-qty-control]');
    if (!control) return;
    const min = Number(input.min) || 1;
    const max = Number(input.max) || 10;
    const current = Math.floor(Number(input.value));
    const down = control.querySelector('[data-qty-step="-1"]');
    const up = control.querySelector('[data-qty-step="1"]');
    if (down) down.disabled = !Number.isFinite(current) || current <= min;
    if (up) up.disabled = Number.isFinite(current) && current >= max;
  }

  function clampQty(input) {
    const min = Number(input.min) || 1;
    const max = Number(input.max) || 10;
    let next = Math.floor(Number(input.value));
    if (!Number.isFinite(next)) next = min;
    next = Math.min(max, Math.max(min, next));
    input.value = String(next);
    syncQtyButtons(input);
  }

  function onClick(event) {
    const skip = event.target.closest('a.skip');
    if (skip) {
      event.preventDefault();
      const main = document.getElementById('main');
      if (main) main.focus();
      return;
    }

    const localStep = event.target.closest('[data-qty-step]');
    if (localStep) {
      const control = localStep.closest('[data-qty-control]');
      const input = control && control.querySelector('[data-qty]');
      if (!input) return;
      const min = Number(input.min) || 1;
      const max = Number(input.max) || 10;
      const current = Math.floor(Number(input.value));
      const start = Number.isFinite(current) ? current : min;
      const next = Math.min(max, Math.max(min, start + Number(localStep.getAttribute('data-qty-step'))));
      input.value = String(next);
      syncQtyButtons(input);
      return;
    }

    const select = event.target.closest('[data-select-item]');
    if (select) {
      const product = E.byId(select.getAttribute('data-select-item'));
      if (product) E.analytics.selectItem(product, select.getAttribute('data-list-name') || 'Shop');
    }

    const add = event.target.closest('[data-add]');
    if (add) {
      const scope = add.closest('.pdp, .card') || document;
      const input = scope.querySelector('[data-qty]');
      const qty = input ? Number(input.value) : 1;
      const result = E.store.add(add.getAttribute('data-add'), qty);
      if (!result.ok) {
        toast(result.reason === 'max' ? 'That is as many as we can add.' : 'That piece is sold out.');
        return;
      }
      E.analytics.addToCart(result.product, result.qty);
      updateCartCount();
      toast(result.product.name + ' added to cart');
      if (E.router.parse().name === 'cart') E.router.refresh();
      return;
    }

    const remove = event.target.closest('[data-remove]');
    if (remove) {
      const result = E.store.remove(remove.getAttribute('data-remove'));
      if (result.product && result.qty) E.analytics.removeFromCart(result.product, result.qty);
      toast('Removed from cart');
      E.router.refresh();
      return;
    }

    const step = event.target.closest('[data-qty-delta]');
    if (step) {
      const id = step.getAttribute('data-id');
      const line = E.store.lines().find(function (item) { return item.id === id; });
      if (!line) return;
      const result = E.store.setQty(id, line.qty + Number(step.getAttribute('data-qty-delta')));
      if (!result) return;
      if (result.next > result.prev) E.analytics.addToCart(result.product, result.next - result.prev);
      if (result.next < result.prev) E.analytics.removeFromCart(result.product, result.prev - result.next);
      if (result.clamped && result.next === result.prev) toast('That is as many as we have.');
      E.router.refresh();
    }
  }

  function onChange(event) {
    if (event.target.matches('[data-qty]')) clampQty(event.target);
    if (!event.target.matches('[data-sort]')) return;
    const value = event.target.value === 'featured' ? '' : event.target.value;
    E.router.go('/shop', { sort: value });
  }

  function clearErrors(form) {
    form.querySelectorAll('.field, .pays').forEach(function (field) { field.classList.remove('is-bad'); });
    form.querySelectorAll('.err').forEach(function (err) { err.textContent = ''; });
    const banner = form.querySelector('[data-form-error]');
    if (banner) banner.hidden = true;
  }

  function showError(form, name, message) {
    const field = form.querySelector('[data-field="' + name + '"]') || form.querySelector('.pays');
    if (field) field.classList.add('is-bad');
    const err = field ? field.querySelector('.err') : null;
    if (err) err.textContent = message;
  }

  function onSubmit(event) {
    const newsletter = event.target.closest('[data-newsletter]');
    if (newsletter) {
      event.preventDefault();
      const note = newsletter.querySelector('[data-newsletter-note]');
      if (note) note.hidden = false;
      return;
    }

    const search = event.target.closest('[data-search]');
    if (search) {
      event.preventDefault();
      const input = search.querySelector('input[name="q"]');
      E.router.go('/shop', { q: input ? input.value.trim() : '' });
      return;
    }

    if (event.target.id !== 'checkout-form') return;
    event.preventDefault();
    const form = event.target;
    clearErrors(form);
    const data = new FormData(form);
    let first = null;
    RULES.forEach(function (rule) {
      const name = rule[0];
      const value = String(data.get(name) || '');
      if (rule[1](value)) return;
      showError(form, name, rule[2]);
      if (!first) first = form.elements[name] || form.querySelector('[name="' + name + '"]');
    });
    const banner = form.querySelector('[data-form-error]');
    if (first) {
      if (banner) banner.hidden = false;
      if (typeof first.focus === 'function') first.focus();
      else if (first[0] && typeof first[0].focus === 'function') first[0].focus();
      return;
    }

    const lines = E.store.detailed();
    if (!lines.length) {
      E.router.go('/cart');
      return;
    }
    const totals = E.store.totals();
    const order = {
      id: randomOrderId(),
      createdAt: new Date().toISOString(),
      items: lines.map(function (line) {
        return {
          id: line.product.id,
          sku: line.product.sku,
          name: line.product.name,
          category: E.categoryLabel(line.product.category),
          price: line.product.price,
          qty: line.qty
        };
      }),
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      total: totals.total,
      payment: String(data.get('payment')),
      customer: {
        name: String(data.get('name')).trim(),
        email: String(data.get('email')).trim(),
        phone: String(data.get('phone')).trim(),
        address: String(data.get('address')).trim(),
        city: String(data.get('city')).trim(),
        state: String(data.get('state')),
        pin: String(data.get('pin')).trim()
      }
    };
    const button = form.querySelector('[type="submit"]');
    if (button) button.disabled = true;
    E.analytics.addShippingInfo(order);
    E.analytics.purchase(order);
    E.store.saveOrder(order);
    E.store.clear();
    E.router.go('/order/' + encodeURIComponent(order.id));
  }

  function boot() {
    E.store.subscribe(updateCartCount);
    document.addEventListener('click', onClick);
    document.addEventListener('submit', onSubmit);
    document.addEventListener('change', onChange);
    document.addEventListener('input', function (event) {
      if (event.target.matches('[data-qty]')) syncQtyButtons(event.target);
    });
    E.router.start(show);
    updateCartCount();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window.Ecom = window.Ecom || {});
