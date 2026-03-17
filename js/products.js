// ============================================
// Product Catalog - Load & Display
// ============================================

const LOCAL_PRODUCTS = [
  { id: 1,  name: 'Patrol Camera (RLC-823S1W)',        category: 'Security',           vendor: 'Reolink',          url: 'https://reolink.com/us/product/rlc-823s1w/?redirect=1', price: 300.00 },
  { id: 2,  name: 'Bullet Camera (Reolink Duo 3)',     category: 'Security',           vendor: 'Reolink',          url: 'https://reolink.com/product/reolink-duo-3-poe/', price: 161.00 },
  { id: 3,  name: 'Solar Wifi Camera (Atlas PT Ultra)', category: 'Security',          vendor: 'Reolink',          url: 'https://reolink.com/product/altas-pt-ultra/', price: 186.00 },
  { id: 4,  name: 'Juyace Wired (Wall Mount)',         category: 'Security',           vendor: 'Amazon',           url: 'https://www.amazon.com/dp/B086WSNVLJ/', price: 167.00 },
  { id: 5,  name: 'Juyace Wired (Pole Mount)',         category: 'Security',           vendor: 'Amazon',           url: 'https://www.amazon.com/dp/B0BBYR2SRC/', price: 142.00 },
  { id: 6,  name: 'Ofuray Solar (Pole Mount)',         category: 'Security',           vendor: 'Amazon',           url: 'https://www.amazon.ca/Ofuray-238000LM-Commercial-Parking-Security/dp/B0DQ5GH9VT/', price: 195.00 },
  { id: 7,  name: 'Warm Light for Tucson 3000k',       category: 'Security',           vendor: 'Amazon',           url: 'https://www.amazon.com/Selectable-Commercial-Floodlight-Security-Lighting/dp/B0FM6N287P/', price: 119.00 },
  { id: 8,  name: '12 Channels (RLN12W)',              category: 'MEP',                vendor: 'Reolink',          url: 'https://reolink.com/ca/product/rln12w/?attribute_pa_version=1-packwhite', price: 315.00 },
  { id: 9,  name: '16 Channels (RLN12W)',              category: 'MEP',                vendor: 'Reolink',          url: 'https://reolink.com/ca/product/rln16-410/', price: 422.00 },
  { id: 10, name: 'Core Switch (TL-SG3428X)',          category: 'MEP',                vendor: 'Amazon',           url: 'https://www.amazon.com/gp/product/B08TR9FLDX/', price: 548.00 },
  { id: 11, name: 'Sub Switch (TL-SG2210MP)',          category: 'MEP',                vendor: 'Amazon',           url: 'https://www.amazon.com/gp/product/B0D5Z3NMG9/', price: 258.00 },
  { id: 12, name: 'Fiber Optics Cable',                category: 'MEP',                vendor: 'Amazon',           url: 'https://www.amazon.com/Outdoor-Armored-Multimode-Industrial-Installed/dp/B0DSJ1VS3V/', price: 150.00 },
  { id: 13, name: 'Fiber Transceiver',                 category: 'MEP',                vendor: 'Amazon',           url: 'https://www.amazon.com/gp/product/B01N1H1Z2F/', price: 58.00 },
  { id: 14, name: 'NVR 12" Monitor',                   category: 'MEP',                vendor: 'Amazon',           url: 'https://www.amazon.com/dp/B01KJVERF8/', price: 80.00 },
  { id: 15, name: 'Junction Box',                      category: 'MEP',                vendor: 'Amazon',           url: 'https://www.amazon.ca/Joinfworld-Electrical-Waterproof-Weatherproof/dp/B0DMZH73ZF/', price: 93.00 },
  { id: 16, name: 'Camera Pole Bracket',               category: 'Security',           vendor: null,               url: null, price: null },
  { id: 17, name: 'Camera Wall Bracket',               category: 'Security',           vendor: null,               url: null, price: null },
  { id: 18, name: 'Power Plugs for Lights',            category: 'Security',           vendor: 'Amazon',           url: 'https://www.amazon.com/HUARLPLUG-Certified-Rewirable-Directions-Adjustable/dp/B0DM8WBX7Y/', price: 16.00 },
  { id: 19, name: 'Mounting Tape for Signs',           category: 'Signage',            vendor: 'Amazon',           url: 'https://www.amazon.com/gp/product/B09G63579Q/', price: 20.00 },
  { id: 20, name: 'Smart Plug',                        category: 'MEP',                vendor: 'Amazon',           url: 'https://www.amazon.com/Kasa-Smart-Required-Certified-EP10P4/dp/B091FXLMS8/', price: 26.00 },
  { id: 21, name: 'OPS Signs',                         category: 'Signage',            vendor: 'SignQuick',        url: 'https://www.signquick.com/', price: null },
  { id: 22, name: 'Gate Signs',                        category: 'Signage',            vendor: 'VistaPrint',       url: 'https://www.vistaprint.com/', price: null },
  { id: 23, name: 'Construction Signs',                category: 'Signage',            vendor: 'SignQuick',        url: 'https://www.signquick.com/', price: null },
  { id: 24, name: 'Padlock',                           category: 'Security',           vendor: 'NB Rato Hardware', url: 'https://www.alibaba.com/product-detail/Heavy-Duty-High-Security-Outdoor-Warehouse_1600954539056.html', price: 4.00 },
  { id: 25, name: 'Starlink',                          category: 'Security',           vendor: 'Business Local',   url: 'https://starlink.com/business', price: 65.00 },
  { id: 26, name: 'Portable Toilet',                   category: 'Temporary Facility', vendor: 'Zters',            url: 'https://www.zters.com/', price: null },
  { id: 27, name: 'Gravel Bag',                        category: 'Construction',       vendor: 'Rockland',         url: 'https://rocklandsupplies.com/product/bulk-bag-road-crush/', price: 185.00 },
];

// SVG icons by category (inline, no external files needed)
const CATEGORY_ICONS = {
  'Security': `<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>`,
  'MEP': `<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
  'Signage': `<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2z"/></svg>`,
  'Construction': `<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>`,
  'Temporary Facility': `<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/></svg>`,
};

const CATEGORY_COLORS = {
  'Security': 'bg-blue-50 border-blue-200',
  'MEP': 'bg-amber-50 border-amber-200',
  'Signage': 'bg-green-50 border-green-200',
  'Construction': 'bg-orange-50 border-orange-200',
  'Temporary Facility': 'bg-purple-50 border-purple-200',
};

const CATEGORY_BADGE_COLORS = {
  'Security': 'bg-blue-100 text-blue-700',
  'MEP': 'bg-amber-100 text-amber-700',
  'Signage': 'bg-green-100 text-green-700',
  'Construction': 'bg-orange-100 text-orange-700',
  'Temporary Facility': 'bg-purple-100 text-purple-700',
};

const Products = (() => {
  let allProducts = [];
  let currentCategory = 'All';

  async function load() {
    // Try Supabase first, fall back to local data
    if (db) {
      const { data, error } = await db
        .from('products')
        .select('*')
        .order('category')
        .order('name');

      if (!error && data && data.length > 0) {
        allProducts = data;
        return data;
      }
      console.warn('Supabase load failed, using local data:', error?.message);
    }

    allProducts = LOCAL_PRODUCTS;
    return allProducts;
  }

  function render(products, containerId = 'products-grid') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const filtered = currentCategory === 'All'
      ? products
      : products.filter(p => p.category === currentCategory);

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12 text-slate-400">
          No products found in this category.
        </div>`;
      return;
    }

    container.innerHTML = filtered.map(product => {
      const icon = CATEGORY_ICONS[product.category] || CATEGORY_ICONS['Security'];
      const badgeColor = CATEGORY_BADGE_COLORS[product.category] || 'bg-slate-100 text-slate-600';

      return `
      <div class="product-card bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col" data-product-id="${product.id}">
        <div class="product-image-placeholder flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100" style="height:140px;">
          ${icon}
        </div>
        <div class="p-4 flex flex-col flex-1">
          <div class="flex items-start justify-between gap-2 mb-1">
            <h3 class="font-semibold text-slate-800 text-sm leading-tight flex-1">${product.name}</h3>
          </div>
          <div class="flex items-center gap-2 mb-3">
            <span class="text-xs px-2 py-0.5 rounded-full ${badgeColor}">${product.category}</span>
            <span class="text-xs text-slate-400">${product.vendor || 'Vendor TBD'}</span>
          </div>
          <div class="mt-auto flex items-center justify-between">
            <span class="text-lg font-bold ${product.price ? 'text-slate-800' : 'text-slate-400'}">
              ${product.price ? '$' + product.price.toFixed(2) : 'Price TBD'}
            </span>
            <div class="flex items-center gap-1">
              <input type="number" min="1" value="1" class="qty-input border border-slate-300 rounded-lg px-2 py-1.5 text-sm" id="qty-product-${product.id}">
              <button onclick="Cart.addProduct(${product.id}, document.getElementById('qty-product-${product.id}').value)"
                class="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded-lg transition-colors font-medium">
                Add
              </button>
            </div>
          </div>
          ${product.url ? `<a href="${product.url}" target="_blank" rel="noopener" class="text-xs text-blue-500 hover:underline mt-2 inline-block">View product &rarr;</a>` : ''}
        </div>
      </div>`;
    }).join('');
  }

  function setCategory(category) {
    currentCategory = category;
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === category);
    });
    render(allProducts);
  }

  function getById(id) {
    return allProducts.find(p => p.id === parseInt(id));
  }

  function getAll() {
    return allProducts;
  }

  return { load, render, setCategory, getById, getAll };
})();
