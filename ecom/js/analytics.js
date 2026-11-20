(function (E) {
  'use strict';

  function queue() {
    window.dataLayer = window.dataLayer || [];
    return window.dataLayer;
  }

  function item(product, qty, index) {
    const payload = {
      item_id: product.sku,
      item_name: product.name,
      item_category: E.categoryLabel(product.category),
      price: product.price,
      quantity: qty
    };
    if (typeof index === 'number') payload.index = index;
    return payload;
  }

  function itemsFromDetailed(detailed) {
    return detailed.map(function (line, index) {
      return item(line.product, line.qty, index);
    });
  }

  function ecommerce(eventName, payload) {
    const layer = queue();
    layer.push({ ecommerce: null });
    layer.push({ event: eventName, ecommerce: payload });
  }

  E.analytics = {
    item: item,
    pageView: function (title) {
      queue().push({
        event: 'page_view',
        page_path: location.pathname + location.search + location.hash,
        page_title: title
      });
    },
    viewItemList: function (listName, products) {
      if (!products.length) return;
      ecommerce('view_item_list', {
        item_list_name: listName,
        currency: 'INR',
        items: products.map(function (product, index) { return item(product, 1, index); })
      });
    },
    selectItem: function (product, listName) {
      ecommerce('select_item', {
        item_list_name: listName || 'Shop',
        currency: 'INR',
        items: [item(product, 1)]
      });
    },
    viewItem: function (product) {
      ecommerce('view_item', {
        currency: 'INR',
        value: product.price,
        items: [item(product, 1)]
      });
    },
    addToCart: function (product, qty) {
      ecommerce('add_to_cart', {
        currency: 'INR',
        value: product.price * qty,
        items: [item(product, qty)]
      });
    },
    removeFromCart: function (product, qty) {
      ecommerce('remove_from_cart', {
        currency: 'INR',
        value: product.price * qty,
        items: [item(product, qty)]
      });
    },
    viewCart: function (detailed, totals) {
      ecommerce('view_cart', {
        currency: 'INR',
        value: totals.total,
        items: itemsFromDetailed(detailed)
      });
    },
    beginCheckout: function (detailed, totals) {
      ecommerce('begin_checkout', {
        currency: 'INR',
        value: totals.total,
        items: itemsFromDetailed(detailed)
      });
    },
    addShippingInfo: function (order) {
      ecommerce('add_shipping_info', {
        currency: 'INR',
        value: order.total,
        shipping_tier: order.shipping === 0 ? 'Complimentary' : 'Standard',
        items: order.items.map(function (line, index) {
          return {
            item_id: line.sku,
            item_name: line.name,
            item_category: line.category,
            price: line.price,
            quantity: line.qty,
            index: index
          };
        })
      });
    },
    purchase: function (order) {
      ecommerce('purchase', {
        transaction_id: order.id,
        currency: 'INR',
        value: order.total,
        shipping: order.shipping,
        items: order.items.map(function (line, index) {
          return {
            item_id: line.sku,
            item_name: line.name,
            item_category: line.category,
            price: line.price,
            quantity: line.qty,
            index: index
          };
        })
      });
    }
  };
})(window.Ecom = window.Ecom || {});
