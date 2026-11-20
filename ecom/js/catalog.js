(function (E) {
  'use strict';

  E.SHIPPING_THRESHOLD = 25000;
  E.SHIPPING_FEE = 499;

  E.categories = [
    { id: 'seating', label: 'Seating' },
    { id: 'tables', label: 'Tables' },
    { id: 'lighting', label: 'Lighting' },
    { id: 'storage', label: 'Storage' },
    { id: 'decor', label: 'Decor' }
  ];

  E.products = [
    {
      id: 'calcutta-cane-chair',
      sku: 'LO-SET-014',
      name: 'Calcutta Cane Lounge Chair',
      category: 'seating',
      origin: 'Kolkata',
      price: 18600,
      stock: 4,
      scene: 'chair',
      tone: '#e7d3bc',
      accent: '#6e3b2a',
      materials: 'Teak frame, hand-caned seat and back',
      dimensions: 'W 68 × D 74 × H 86 cm',
      care: 'Dust the cane with a soft brush. Wipe teak with a dry cloth and keep it out of standing water.',
      blurb: 'A low lounge chair from a Park Street workshop, restrung in natural cane.',
      featured: true
    },
    {
      id: 'bombay-rosewood-armchair',
      sku: 'LO-SET-028',
      name: 'Bombay Rosewood Armchair',
      category: 'seating',
      origin: 'Mumbai',
      price: 32400,
      stock: 2,
      scene: 'chair',
      tone: '#e4cbb8',
      accent: '#4e2a22',
      materials: 'Solid rosewood, cotton-tape seat',
      dimensions: 'W 62 × D 66 × H 92 cm',
      care: 'Polish once a season with a drop of linseed. Avoid direct afternoon sun on the arms.',
      blurb: 'A club armchair with a scooped back, saved from a Colaba reading room.'
    },
    {
      id: 'malabar-teak-sofa',
      sku: 'LO-SET-041',
      name: 'Malabar Teak Sofa',
      category: 'seating',
      origin: 'Kochi',
      price: 78000,
      stock: 1,
      scene: 'sofa',
      tone: '#d9c7ae',
      accent: '#243f36',
      materials: 'Malabar teak, linen cushions, brass feet',
      dimensions: 'W 196 × D 86 × H 84 cm',
      care: 'Plump the cushions and vacuum the frame. Blot spills; do not soak the linen.',
      blurb: 'A three-seat sofa with a low arm, built for a veranda and just as calm indoors.',
      featured: true
    },
    {
      id: 'jaipur-jali-bench',
      sku: 'LO-SET-033',
      name: 'Jaipur Jali Bench',
      category: 'seating',
      origin: 'Jaipur',
      price: 24500,
      stock: 3,
      scene: 'bench',
      tone: '#ead8c4',
      accent: '#8a4b32',
      materials: 'Sheesham, hand-cut jali back',
      dimensions: 'W 140 × D 48 × H 96 cm',
      care: 'Dust the jali with a dry paintbrush so the cut-outs stay clear.',
      blurb: 'A hall bench whose back is a small sandstone screen, translated into timber.'
    },
    {
      id: 'chettinad-dining-table',
      sku: 'LO-TBL-019',
      name: 'Chettinad Dining Table',
      category: 'tables',
      origin: 'Karaikudi',
      price: 64000,
      stock: 2,
      scene: 'table',
      tone: '#e6d2b8',
      accent: '#5c3317',
      materials: 'Burma teak top, turned pedestal',
      dimensions: 'W 180 × D 96 × H 76 cm',
      care: 'Use coasters. Refresh the oil finish when the top looks thirsty.',
      blurb: 'An oval dining table that seats six, with a pedestal that leaves room for feet.',
      featured: true
    },
    {
      id: 'writers-campaign-desk',
      sku: 'LO-TBL-022',
      name: "Writer's Campaign Desk",
      category: 'tables',
      origin: 'Puducherry',
      price: 41200,
      stock: 2,
      scene: 'desk',
      tone: '#e3d2c0',
      accent: '#3f342c',
      materials: 'Teak, brass bail handles, leather writing inset',
      dimensions: 'W 122 × D 62 × H 76 cm',
      care: 'Condition the leather inset twice a year. Do not drag the desk; lift it.',
      blurb: 'A campaign desk with one stack of drawers and a leather panel worn smooth.'
    },
    {
      id: 'marble-nesting-tables',
      sku: 'LO-TBL-030',
      name: 'Marble Nesting Tables',
      category: 'tables',
      origin: 'Makrana',
      price: 19800,
      stock: 5,
      scene: 'nesting',
      tone: '#efe6da',
      accent: '#6d645c',
      materials: 'Makrana marble tops, blackened steel frames',
      dimensions: 'Large W 56 × D 40 × H 48 cm',
      care: 'Wipe marble with a damp cloth and dry it. Skip vinegar and lemon.',
      blurb: 'A pair of nesting tables. The smaller one tucks under until someone needs a perch for tea.'
    },
    {
      id: 'brass-library-lamp',
      sku: 'LO-LGT-008',
      name: 'Brass Library Lamp',
      category: 'lighting',
      origin: 'Moradabad',
      price: 8600,
      stock: 6,
      scene: 'lamp',
      tone: '#f0e2c8',
      accent: '#8a6230',
      materials: 'Cast brass, linen shade',
      dimensions: 'H 48 cm, shade diameter 28 cm',
      care: 'Unplug before dusting. Let the brass mellow, or polish the base if you prefer it bright.',
      blurb: 'A reading lamp with a weighted base and a shade the colour of old paper.',
      featured: true
    },
    {
      id: 'mosque-lantern',
      sku: 'LO-LGT-015',
      name: 'Pierced Mosque Lantern',
      category: 'lighting',
      origin: 'Lucknow',
      price: 12400,
      stock: 4,
      scene: 'lantern',
      tone: '#efe0c4',
      accent: '#7a5428',
      materials: 'Pierced brass, frosted glass liner',
      dimensions: 'H 42 cm, diameter 22 cm',
      care: 'Dust inside the piercings with a soft brush. Hang it from a hook rated for 3 kg.',
      blurb: 'A hanging lantern that throws a fine pattern once the bulb is on.'
    },
    {
      id: 'opal-glass-lamp',
      sku: 'LO-LGT-021',
      name: 'Opal Glass Table Lamp',
      category: 'lighting',
      origin: 'Firozabad',
      price: 7200,
      stock: 0,
      scene: 'lamp',
      tone: '#e7eef0',
      accent: '#3d4a55',
      materials: 'Opal glass, bronzed stem',
      dimensions: 'H 46 cm',
      care: 'Glass only, with a dry microfibre cloth. This piece is waiting on a new glass run.',
      blurb: 'A milky glass shade on a short stem. The current batch is sold through.'
    },
    {
      id: 'spice-cabinet',
      sku: 'LO-STR-011',
      name: 'Spice Merchant Cabinet',
      category: 'storage',
      origin: 'Kozhikode',
      price: 28600,
      stock: 2,
      scene: 'cabinet',
      tone: '#e5d0b4',
      accent: '#6a3a28',
      materials: 'Jackwood, cane door panels',
      dimensions: 'W 90 × D 42 × H 146 cm',
      care: 'Keep it a few centimetres off a damp wall. Oil the hinges if they start to speak.',
      blurb: 'A two-door cabinet with cane panels, deep enough for linen or a quiet bar.'
    },
    {
      id: 'travelling-trunk',
      sku: 'LO-STR-018',
      name: 'Travelling Trunk',
      category: 'storage',
      origin: 'Surat',
      price: 15400,
      stock: 3,
      scene: 'trunk',
      tone: '#e8d2b6',
      accent: '#5a3b28',
      materials: 'Camphor wood, brass straps',
      dimensions: 'W 96 × D 48 × H 52 cm',
      care: 'Leave the lid ajar for a day if the camphor scent is strong. Wax the straps, not the wood.',
      blurb: 'A lidded trunk that works as a bench at the foot of a bed and smells faintly of camphor.'
    },
    {
      id: 'teak-wall-shelf',
      sku: 'LO-STR-024',
      name: 'Teak Wall Shelf',
      category: 'storage',
      origin: 'Kannur',
      price: 9800,
      stock: 7,
      scene: 'shelf',
      tone: '#eadcc8',
      accent: '#4d3424',
      materials: 'Reclaimed teak, brass brackets',
      dimensions: 'W 110 × D 22 × H 78 cm',
      care: 'Fix the brackets into studs or plugs. Dust along the grain.',
      blurb: 'Three open shelves in reclaimed teak, with brackets you can see.'
    },
    {
      id: 'bidri-tray',
      sku: 'LO-DEC-006',
      name: 'Bidri Inlay Tray',
      category: 'decor',
      origin: 'Bidar',
      price: 4200,
      stock: 8,
      scene: 'tray',
      tone: '#e4e0da',
      accent: '#2c2a28',
      materials: 'Bidri zinc alloy, silver inlay',
      dimensions: 'W 36 × D 24 cm',
      care: 'Wipe with a dry cloth. Keep perfume and lemon off the inlay.',
      blurb: 'A small tray with a silver poppy, dark enough to make glassware look deliberate.'
    },
    {
      id: 'sandalwood-mirror',
      sku: 'LO-DEC-012',
      name: 'Sandalwood Arch Mirror',
      category: 'decor',
      origin: 'Mysuru',
      price: 11200,
      stock: 2,
      scene: 'mirror',
      tone: '#f0e4d4',
      accent: '#7a5a32',
      materials: 'Sandalwood frame, 4 mm mirror glass',
      dimensions: 'W 54 × H 110 cm',
      care: 'Hang it on two points. Clean the glass with a little water, never on the wood.',
      blurb: 'An arched mirror in pale sandalwood, meant for a dressing corner or a narrow hall.'
    },
    {
      id: 'blockprint-cushion',
      sku: 'LO-DEC-019',
      name: 'Block-Print Floor Cushion',
      category: 'decor',
      origin: 'Bagru',
      price: 3800,
      stock: 10,
      scene: 'cushion',
      tone: '#f3d9c4',
      accent: '#8c3a2f',
      materials: 'Cotton, natural dyes, kapok fill',
      dimensions: 'Diameter 70 cm',
      care: 'Cold wash the cover and dry it in shade. The print will soften, which is the point.',
      blurb: 'A round floor cushion printed with a madder medallion. Extra covers are in the studio.'
    }
  ];

  E.esc = function (value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  };

  E.formatINR = function (amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  E.categoryLabel = function (id) {
    const found = E.categories.find(function (category) { return category.id === id; });
    return found ? found.label : 'Shop';
  };

  E.byId = function (id) {
    return E.products.find(function (product) { return product.id === id; }) || null;
  };

  E.featured = function () {
    return E.products.filter(function (product) { return product.featured; });
  };

  E.related = function (product) {
    return E.products.filter(function (item) {
      return item.category === product.category && item.id !== product.id;
    }).slice(0, 3);
  };

  E.listName = function (params) {
    const query = (params.get('q') || '').trim();
    const category = params.get('category') || '';
    if (query) return 'Search';
    if (category) return E.categoryLabel(category);
    return 'Shop';
  };

  E.filterProducts = function (params) {
    const category = params.get('category') || '';
    const query = (params.get('q') || '').trim().toLowerCase();
    const sort = params.get('sort') || 'featured';
    const list = E.products.filter(function (product) {
      if (category && product.category !== category) return false;
      if (!query) return true;
      const haystack = [product.name, product.materials, product.origin, product.blurb, product.sku, E.categoryLabel(product.category)].join(' ').toLowerCase();
      return haystack.indexOf(query) !== -1;
    });
    if (sort === 'price-asc') list.sort(function (a, b) { return a.price - b.price; });
    else if (sort === 'price-desc') list.sort(function (a, b) { return b.price - a.price; });
    else if (sort === 'name') list.sort(function (a, b) { return a.name.localeCompare(b.name); });
    return list;
  };

  E.shippingFor = function (subtotal) {
    if (subtotal <= 0 || subtotal >= E.SHIPPING_THRESHOLD) return 0;
    return E.SHIPPING_FEE;
  };
})(window.Ecom = window.Ecom || {});
