(function (E) {
  'use strict';

  const STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh',
    'Lakshadweep', 'Puducherry'
  ];

  const PAYMENTS = [
    { id: 'upi', label: 'UPI' },
    { id: 'card', label: 'Card' },
    { id: 'cod', label: 'Cash on delivery' }
  ];

  function artBlock(product, label) {
    const named = label
      ? ' role="img" aria-label="' + E.esc(label) + '"'
      : ' aria-hidden="true"';
    return '<div class="art" style="background:' + product.tone + ';color:' + product.accent + '"' + named + '>' + E.art(product.scene) + '</div>';
  }

  function link(path, updates) {
    return E.esc(E.router.href(path, updates));
  }

  function productCard(product, listName) {
    const href = link('/product/' + encodeURIComponent(product.id));
    const select = ' data-select-item="' + E.esc(product.id) + '" data-list-name="' + E.esc(listName) + '"';
    const action = product.stock < 1
      ? '<p class="sold">Sold out</p>'
      : '<button type="button" class="text-btn" data-add="' + E.esc(product.id) + '">Add to cart</button>';
    return '<article class="card">' +
      '<a class="card-media" href="' + href + '" aria-label="' + E.esc(product.name) + '"' + select + '>' + artBlock(product) + '</a>' +
      '<div class="card-body">' +
        '<p class="eyebrow">' + E.esc(product.origin) + '</p>' +
        '<h3><a href="' + href + '"' + select + '>' + E.esc(product.name) + '</a></h3>' +
        '<p class="price">' + E.formatINR(product.price) + '</p>' +
        action +
      '</div></article>';
  }

  function emptyState(title, copy, href, label) {
    return '<section class="empty"><p class="eyebrow">Lumen & Oak</p><h1>' + title + '</h1><p>' + copy + '</p><a class="btn" href="' + href + '">' + label + '</a></section>';
  }

  function home() {
    const categories = E.categories.map(function (category, index) {
      return '<a class="cat" href="' + link('/shop', { category: category.id }) + '"><span>0' + (index + 1) + '</span>' + E.esc(category.label) + '</a>';
    }).join('');
    const featured = E.featured().map(function (product) { return productCard(product, 'Featured'); }).join('');
    return '<section class="hero">' +
      '<div class="hero-copy">' +
        '<p class="eyebrow">Fort Kochi showroom</p>' +
        '<h1>Furniture with a past. Rooms with a future.</h1>' +
        '<p class="lede">Restored teak, cane, brass, and marble, priced in rupees and ready to ship across India. Every price includes GST.</p>' +
        '<div class="hero-actions"><a class="btn" href="' + link('/shop') + '">Shop the collection</a><a class="btn btn-ghost" href="' + link('/shop', { category: 'seating' }) + '">Seating</a></div>' +
      '</div>' +
      '<div class="hero-frame">' + artBlock(E.byId('malabar-teak-sofa'), 'Malabar Teak Sofa') + '<p>Malabar Teak Sofa · ' + E.formatINR(78000) + '</p></div>' +
    '</section>' +
    '<section class="cats" aria-label="Collections">' + categories + '</section>' +
    '<section class="band"><div class="section-head"><p class="eyebrow">In the room</p><h2>Pieces we would keep</h2></div><div class="grid">' + featured + '</div></section>' +
    '<section class="notes"><article><h2>Restored, not reproduced</h2><p>Frames are repaired in Kochi. Cane is restrung. Marble is recut only when the original top is gone.</p></article><article><h2>Solid timber</h2><p>Teak, rosewood, jackwood, and sheesham. If a piece is veneer, we do not list it.</p></article><article><h2>Ships across India</h2><p>Complimentary shipping from ' + E.formatINR(E.SHIPPING_THRESHOLD) + '. Below that, a flat ' + E.formatINR(E.SHIPPING_FEE) + '.</p></article></section>' +
    '<section class="letter"><div><p class="eyebrow">Studio notes</p><h2>New arrivals, twice a month.</h2><p>A short list when something worth keeping comes in. This demo does not store the address.</p></div>' +
      '<form data-newsletter><label class="sr-only" for="letter-email">Email</label><input id="letter-email" name="email" type="email" required placeholder="Email address" autocomplete="email"><button class="btn" type="submit">Join the list</button><p class="form-note" data-newsletter-note hidden>You are on the list for this visit. Nothing was sent.</p></form></section>';
  }

  function shop(route, track) {
    const params = route.params;
    const products = E.filterProducts(params);
    const listName = E.listName(params);
    const currentCategory = params.get('category') || '';
    const currentSort = params.get('sort') || 'featured';
    const query = params.get('q') || '';
    if (track) E.analytics.viewItemList(listName, products);

    function hrefFor(updates) {
      return link('/shop', updates);
    }

    const pills = '<a class="pill' + (currentCategory ? '' : ' is-on') + '" href="' + hrefFor({ category: '' }) + '">All</a>' +
      E.categories.map(function (category) {
        const on = currentCategory === category.id ? ' is-on' : '';
        return '<a class="pill' + on + '" href="' + hrefFor({ category: category.id }) + '">' + E.esc(category.label) + '</a>';
      }).join('');

    const sorts = [
      ['featured', 'Featured'],
      ['price-asc', 'Price, low to high'],
      ['price-desc', 'Price, high to low'],
      ['name', 'Name']
    ].map(function (option) {
      const selected = currentSort === option[0] ? ' selected' : '';
      return '<option value="' + option[0] + '"' + selected + '>' + option[1] + '</option>';
    }).join('');

    const grid = products.length
      ? '<div class="grid">' + products.map(function (product) { return productCard(product, listName); }).join('') + '</div>'
      : '<div class="empty compact"><h2>Nothing matches</h2><p>Try another room, or clear the search.</p><a class="btn" href="' + link('/shop') + '">Clear filters</a></div>';

    return '<section class="page-head"><p class="eyebrow">The collection</p><h1>' + E.esc(listName === 'Shop' ? 'Shop' : listName) + '</h1><p>' + products.length + (products.length === 1 ? ' piece' : ' pieces') + ' · prices include GST</p></section>' +
      '<div class="toolbar"><div class="pills" role="tablist" aria-label="Categories">' + pills + '</div>' +
      '<form class="search" data-search role="search"><label class="sr-only" for="shop-q">Search</label><input id="shop-q" type="search" name="q" value="' + E.esc(query) + '" placeholder="Search teak, cane, brass"><button class="btn" type="submit">Search</button></form>' +
      '<label class="sort">Sort <select data-sort aria-label="Sort the collection">' + sorts + '</select></label></div>' + grid;
  }

  function product(route, track) {
    const item = E.byId(route.id);
    if (!item) return missing('That piece is no longer in the showroom.');
    if (track) E.analytics.viewItem(item);
    const stockNote = item.stock < 1 ? 'Sold out' : (item.stock <= 2 ? 'Only ' + item.stock + ' left' : item.stock + ' available');
    const related = E.related(item).map(function (other) { return productCard(other, 'Related'); }).join('');
    const maxQty = Math.min(10, item.stock);
    const buy = item.stock < 1
      ? '<p class="sold">Sold out.</p>'
      : '<div class="buy"><div class="qty-field"><span id="qty-label">Quantity</span><div class="stepper" data-qty-control><button type="button" data-qty-step="-1" aria-label="Decrease quantity" disabled>−</button><input data-qty type="number" min="1" max="' + maxQty + '" value="1" inputmode="numeric" aria-labelledby="qty-label"><button type="button" data-qty-step="1" aria-label="Increase quantity"' + (maxQty <= 1 ? ' disabled' : '') + '>+</button></div></div><button class="btn" type="button" data-add="' + E.esc(item.id) + '">Add to cart</button></div>';
    return '<p class="crumbs"><a href="' + link('/') + '">Home</a> / <a href="' + link('/shop', { category: item.category }) + '">' + E.esc(E.categoryLabel(item.category)) + '</a> / <span>' + E.esc(item.name) + '</span></p>' +
      '<article class="pdp">' +
        artBlock(item) +
        '<div><p class="eyebrow">' + E.esc(item.origin) + ' · ' + E.esc(item.sku) + '</p><h1>' + E.esc(item.name) + '</h1><p class="price price-lg">' + E.formatINR(item.price) + '</p><p class="gst">Inclusive of GST. ' + E.esc(stockNote) + '.</p><p class="lede">' + E.esc(item.blurb) + '</p>' + buy +
        '<dl class="facts"><div><dt>Materials</dt><dd>' + E.esc(item.materials) + '</dd></div><div><dt>Dimensions</dt><dd>' + E.esc(item.dimensions) + '</dd></div><div><dt>Care</dt><dd>' + E.esc(item.care) + '</dd></div></dl></div></article>' +
      (related ? '<section class="band"><div class="section-head"><p class="eyebrow">Alongside it</p><h2>From the same room</h2></div><div class="grid">' + related + '</div></section>' : '');
  }

  function cart(track) {
    const lines = E.store.detailed();
    const totals = E.store.totals();
    if (!lines.length) return emptyState('Your cart is empty', 'The showroom is still open.', link('/shop'), 'Browse the shop');
    if (track) E.analytics.viewCart(lines, totals);
    const rows = lines.map(function (line) {
      const product = line.product;
      const max = Math.min(10, product.stock);
      return '<article class="line">' +
        '<a class="line-art" href="' + link('/product/' + encodeURIComponent(product.id)) + '" aria-label="' + E.esc(product.name) + '">' + artBlock(product) + '</a>' +
        '<div><p class="eyebrow">' + E.esc(product.origin) + '</p><h2><a href="' + link('/product/' + encodeURIComponent(product.id)) + '">' + E.esc(product.name) + '</a></h2><p class="muted">' + E.esc(product.sku) + '</p><button type="button" class="text-btn" data-remove="' + E.esc(product.id) + '">Remove</button></div>' +
        '<div class="stepper"><button type="button" data-qty-delta="-1" data-id="' + E.esc(product.id) + '" aria-label="Decrease quantity of ' + E.esc(product.name) + '"' + (line.qty <= 1 ? ' disabled' : '') + '>−</button><span>' + line.qty + '</span><button type="button" data-qty-delta="1" data-id="' + E.esc(product.id) + '" aria-label="Increase quantity of ' + E.esc(product.name) + '"' + (line.qty >= max ? ' disabled' : '') + '>+</button></div>' +
        '<p class="price">' + E.formatINR(line.lineTotal) + '</p></article>';
    }).join('');
    const remain = E.SHIPPING_THRESHOLD - totals.subtotal;
    const shipNote = totals.shipping === 0
      ? 'Complimentary shipping is applied.'
      : 'Add ' + E.formatINR(remain) + ' more for complimentary shipping.';
    return '<section class="page-head"><p class="eyebrow">Cart</p><h1>Your selection</h1></section><div class="split"><div class="lines">' + rows + '</div>' +
      '<aside class="summary"><h2>Summary</h2><p><span>Subtotal</span><span>' + E.formatINR(totals.subtotal) + '</span></p><p><span>Shipping</span><span>' + (totals.shipping === 0 ? 'Complimentary' : E.formatINR(totals.shipping)) + '</span></p><p class="total"><span>Total</span><span>' + E.formatINR(totals.total) + '</span></p><p class="muted">' + shipNote + ' GST is included.</p><a class="btn" href="' + link('/checkout') + '">Checkout</a></aside></div>';
  }

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function randomDigits(count) {
    let out = '';
    while (out.length < count) out += Math.floor(Math.random() * 10);
    return out;
  }

  function sampleCustomer() {
    const first = pick(['Meera', 'Arjun', 'Kabir', 'Ananya', 'Rahul', 'Diya', 'Vikram', 'Sana']);
    const last = pick(['Nair', 'Shah', 'Iyer', 'Kapoor', 'Das', 'Menon', 'Reddy', 'Gill']);
    const streets = ['Chapel Road', 'Fort Lane', 'Marine Drive', 'Park Street', 'Residency Road'];
    const cities = ['Kochi', 'Jaipur', 'Mumbai', 'Pune', 'Bengaluru', 'Kolkata'];
    return {
      name: first + ' ' + last,
      email: (first + '.' + last).toLowerCase() + randomDigits(3) + '@example.com',
      phone: String(6 + Math.floor(Math.random() * 4)) + randomDigits(9),
      address: (1 + Math.floor(Math.random() * 180)) + ' ' + pick(streets),
      city: pick(cities),
      pin: String(1 + Math.floor(Math.random() * 8)) + randomDigits(5),
      state: pick(STATES),
      payment: pick(PAYMENTS).id
    };
  }

  function checkout(track) {
    const lines = E.store.detailed();
    const totals = E.store.totals();
    if (!lines.length) return emptyState('Nothing to check out', 'Add a piece and the form will be here.', link('/shop'), 'Browse the shop');
    if (track) E.analytics.beginCheckout(lines, totals);
    const sample = sampleCustomer();
    const options = STATES.map(function (state) {
      const selected = state === sample.state ? ' selected' : '';
      return '<option value="' + E.esc(state) + '"' + selected + '>' + E.esc(state) + '</option>';
    }).join('');
    const payments = PAYMENTS.map(function (method) {
      const checked = method.id === sample.payment ? ' checked' : '';
      return '<label class="pay"><input type="radio" name="payment" value="' + method.id + '"' + checked + '> ' + method.label + '</label>';
    }).join('');
    const preview = lines.map(function (line) {
      return '<p><span>' + E.esc(line.product.name) + ' × ' + line.qty + '</span><span>' + E.formatINR(line.lineTotal) + '</span></p>';
    }).join('');
    return '<section class="page-head"><p class="eyebrow">Checkout</p><h1>Delivery</h1><p>Demo checkout. Nothing is charged or sent to a server.</p></section>' +
      '<div class="split"><form id="checkout-form" class="stack" novalidate>' +
        field('name', 'Full name', '<input name="name" autocomplete="name" required value="' + E.esc(sample.name) + '">') +
        field('email', 'Email', '<input name="email" type="email" autocomplete="email" required value="' + E.esc(sample.email) + '">') +
        field('phone', 'Mobile', '<input name="phone" inputmode="numeric" autocomplete="tel" maxlength="10" required value="' + E.esc(sample.phone) + '">') +
        field('address', 'Address', '<input name="address" autocomplete="street-address" required value="' + E.esc(sample.address) + '">') +
        '<div class="field-row">' +
          field('city', 'City', '<input name="city" autocomplete="address-level2" required value="' + E.esc(sample.city) + '">') +
          field('pin', 'PIN code', '<input name="pin" inputmode="numeric" autocomplete="postal-code" maxlength="6" required value="' + E.esc(sample.pin) + '">') +
        '</div>' +
        field('state', 'State', '<select name="state" required>' + options + '</select>') +
        '<fieldset class="pays"><legend>Payment</legend>' + payments + '<small class="err" data-for="payment"></small></fieldset>' +
        '<p class="form-error" data-form-error hidden>Check the highlighted fields.</p>' +
        '<button class="btn" type="submit">Place order</button></form>' +
        '<aside class="summary"><h2>Order</h2>' + preview + '<p><span>Shipping</span><span>' + (totals.shipping === 0 ? 'Complimentary' : E.formatINR(totals.shipping)) + '</span></p><p class="total"><span>To pay</span><span>' + E.formatINR(totals.total) + '</span></p><a href="' + link('/cart') + '">Back to cart</a></aside></div>';
  }

  function field(name, label, control) {
    return '<label class="field" data-field="' + name + '"><span>' + label + '</span>' + control + '<small class="err"></small></label>';
  }

  function order(route) {
    const placed = E.store.getOrder(route.id);
    if (!placed) return missing('That order is not in this browser session.');
    const when = new Date(placed.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    const payment = PAYMENTS.find(function (method) { return method.id === placed.payment; });
    const rows = placed.items.map(function (line) {
      return '<p><span>' + E.esc(line.name) + ' × ' + line.qty + '</span><span>' + E.formatINR(line.price * line.qty) + '</span></p>';
    }).join('');
    const customer = placed.customer;
    return '<section class="confirm"><p class="eyebrow">Order placed</p><h1>' + E.esc(placed.id) + '</h1><p class="lede">Thank you, ' + E.esc(customer.name) + '. This is a demo confirmation from ' + E.esc(when) + '. Nothing was charged.</p>' +
      '<div class="summary"><h2>Deliver to</h2><p>' + E.esc(customer.address) + ', ' + E.esc(customer.city) + ', ' + E.esc(customer.state) + ' ' + E.esc(customer.pin) + '</p><p>' + E.esc(customer.email) + ' · ' + E.esc(customer.phone) + '</p><p>Payment: ' + E.esc(payment ? payment.label : placed.payment) + ' (not charged)</p>' + rows +
      '<p><span>Shipping</span><span>' + (placed.shipping === 0 ? 'Complimentary' : E.formatINR(placed.shipping)) + '</span></p><p class="total"><span>Total</span><span>' + E.formatINR(placed.total) + '</span></p></div>' +
      '<a class="btn" href="' + link('/shop') + '">Continue shopping</a></section>';
  }

  function missing(copy) {
    return emptyState('Not in the showroom', copy, link('/shop'), 'Back to the shop');
  }

  function renderRoute(route, track) {
    if (route.name === 'home') return home();
    if (route.name === 'shop') return shop(route, track);
    if (route.name === 'product') return product(route, track);
    if (route.name === 'cart') return cart(track);
    if (route.name === 'checkout') return checkout(track);
    if (route.name === 'order') return order(route);
    return missing('That page does not exist.');
  }

  E.views = {
    titleFor: function (route) {
      const brand = 'Lumen & Oak';
      if (route.name === 'home') return brand;
      if (route.name === 'shop') return 'Shop — ' + brand;
      if (route.name === 'product') {
        const item = E.byId(route.id);
        return (item ? item.name : 'Not found') + ' — ' + brand;
      }
      if (route.name === 'cart') return 'Cart — ' + brand;
      if (route.name === 'checkout') return 'Checkout — ' + brand;
      if (route.name === 'order' && route.id) return 'Order ' + route.id + ' — ' + brand;
      return 'Not found — ' + brand;
    },
    render: function (route, options) {
      const track = !options || options.track !== false;
      const main = document.getElementById('main');
      main.innerHTML = renderRoute(route, track);
      if (options && options.focus) main.focus({ preventScroll: true });
    },
    paymentLabel: function (id) {
      const found = PAYMENTS.find(function (method) { return method.id === id; });
      return found ? found.label : id;
    }
  };
})(window.Ecom = window.Ecom || {});
