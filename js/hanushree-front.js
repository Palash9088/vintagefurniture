var PIECES = [
         { id: 'HJ-NCK-030', name: 'Temple necklace', category: 'Necklaces' },
         { id: 'HJ-NCK-027', name: 'Peacock necklace', category: 'Necklaces' },
         { id: 'HJ-PND-TMP', name: 'Temple pendant', category: 'Pendants' },
         { id: 'HJ-PND-COIN', name: 'Coin pendant', category: 'Pendants' },
         { id: 'HJ-BNG-ENG', name: 'Engraved bangles', category: 'Bangles' },
         { id: 'HJ-BNG-STN', name: 'Stone bangles', category: 'Bangles' },
         { id: 'HJ-ERG-CHN', name: 'Chandbali earrings', category: 'Earrings' },
         { id: 'HJ-ERG-PSY', name: 'Paisley earrings', category: 'Earrings' },
         { id: 'HJ-ERG-FLR', name: 'Floral earrings', category: 'Earrings' },
         { id: 'HJ-GLD-050', name: 'Fine gold bar', category: 'Gold' }
      ];

      document.querySelectorAll('.hj-card').forEach(function (card, index) {
         var button = card.querySelector('button[data-track="item"]');
         if (button && PIECES[index]) button.setAttribute('data-id', PIECES[index].id);
      });

      function pieceItem(piece, index) {
         var item = {
            item_id: piece.id,
            item_name: piece.name,
            item_category: piece.category,
            quantity: 1
         };
         if (typeof index === 'number') item.index = index;
         return item;
      }

      function pushEcommerce(eventName, ecommerce) {
         window.dataLayer.push({ ecommerce: null });
         window.dataLayer.push({ event: eventName, ecommerce: ecommerce });
      }

      function piecesIn(category) {
         return PIECES.filter(function (piece) { return piece.category === category; });
      }

      document.querySelector('.hj').addEventListener('click', function (event) {
         if (event.target.closest('#contact-panel')) return;
         var button = event.target.closest('button[data-track]');
         if (!button || !event.currentTarget.contains(button)) return;
         var track = button.getAttribute('data-track');

         if (track === 'contact') {
            var panel = document.getElementById('contact-panel');
            var willOpen = panel.classList.contains('is-closed');
            panel.classList.toggle('is-closed', !willOpen);
            panel.classList.toggle('is-open', willOpen);
            button.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
            var formId = 'd913a33a-71c4-4f8d-9e53-baff8487a900';
            var embed = panel.querySelector('script:not([src])');
            var formMatch = embed && embed.textContent.match(/formId:\s*["']([^"']+)/);
            if (formMatch) formId = formMatch[1];
            window.dataLayer.push({
               event: 'contact_us',
               form_id: formId,
               form_name: 'Contact us',
               form_open: willOpen
            });
            return;
         }

         if (track === 'home') {
            window.dataLayer.push({
               event: 'page_view',
               page_title: 'Home',
               page_path: location.pathname + location.search
            });
            return;
         }

         if (track === 'shop') {
            pushEcommerce('view_item_list', {
               item_list_name: 'Shop',
               currency: 'INR',
               items: PIECES.map(pieceItem)
            });
            return;
         }

         if (track.indexOf('list:') === 0) {
            var listName = track.slice(5);
            pushEcommerce('view_item_list', {
               item_list_name: listName,
               currency: 'INR',
               items: piecesIn(listName).map(pieceItem)
            });
            return;
         }

         if (track === 'cart') {
            pushEcommerce('view_cart', {
               currency: 'INR',
               value: 0,
               items: []
            });
            return;
         }

         if (track === 'checkout') {
            pushEcommerce('begin_checkout', {
               currency: 'INR',
               value: 0,
               items: []
            });
            return;
         }

         if (track === 'item') {
            var piece = PIECES.filter(function (entry) {
               return entry.id === button.getAttribute('data-id');
            })[0];
            if (!piece) return;
            pushEcommerce('select_item', {
               item_list_name: piece.category,
               currency: 'INR',
               items: [pieceItem(piece)]
            });
            pushEcommerce('view_item', {
               currency: 'INR',
               items: [pieceItem(piece)]
            });
         }
      });
