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
  let searchQuery = '';

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

  function getFiltered(products) {
    let filtered = currentCategory === 'All'
      ? products
      : products.filter(p => p.category === currentCategory);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.vendor && p.vendor.toLowerCase().includes(q))
      );
    }

    return filtered;
  }

  function render(products, containerId = 'products-grid') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const filtered = getFiltered(products);

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12 text-slate-400">
          No products found.
        </div>`;
      return;
    }

    const rows = filtered.map(product => {
      const badgeColor = CATEGORY_BADGE_COLORS[product.category] || 'bg-slate-100 text-slate-600';
      const nameHtml = product.url
        ? `<a href="${product.url}" target="_blank" rel="noopener" class="text-slate-800 underline hover:text-blue-600">${product.name}</a>`
        : product.name;

      const vendorHtml = product.vendor
        ? (product.url
          ? `<a href="${product.url}" target="_blank" rel="noopener" class="text-slate-400 hover:text-blue-600 hover:underline">${product.vendor}</a>`
          : product.vendor)
        : '—';

      return `<tr class="border-b border-slate-300 hover:bg-slate-50" data-product-id="${product.id}">
        <td class="py-1.5 pr-2 pl-3 text-sm font-medium">${nameHtml}</td>
        <td class="py-1.5 px-2"><span class="text-[11px] px-1.5 py-0.5 rounded-full whitespace-nowrap ${badgeColor}">${product.category}</span></td>
        <td class="py-1.5 px-2 text-xs whitespace-nowrap">${vendorHtml}</td>
        <td class="py-1.5 px-2 text-sm font-semibold text-right whitespace-nowrap ${product.price ? 'text-slate-800' : 'text-slate-400'}">${product.price ? '$' + product.price.toFixed(2) : 'TBD'}</td>
        <td class="py-1.5 pl-2 pr-3 text-right whitespace-nowrap">
          <input type="number" min="1" value="1" class="qty-input border border-slate-200 rounded px-1 py-0.5 text-xs w-10 text-center" id="qty-product-${product.id}">
          <button onclick="Cart.addProduct(${product.id}, document.getElementById('qty-product-${product.id}').value)"
            class="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-0.5 rounded font-medium ml-1">+</button>
        </td>
      </tr>`;
    }).join('');

    container.innerHTML = `
      <table class="w-full bg-white rounded-lg border border-slate-400 overflow-hidden">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-400 text-[11px] uppercase tracking-wider text-slate-400 font-medium">
            <th class="py-1.5 pr-2 text-left pl-3">Name</th>
            <th class="py-1.5 px-2 text-left">Category</th>
            <th class="py-1.5 px-2 text-left">Vendor</th>
            <th class="py-1.5 px-2 text-right">Price</th>
            <th class="py-1.5 pl-2 text-center pr-3">Qty</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-300">${rows}</tbody>
      </table>`;
  }

  function setCategory(category) {
    currentCategory = category;
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === category);
    });
    render(allProducts);
  }

  function setSearch(query) {
    searchQuery = query.trim();
    render(allProducts);
  }

  function getById(id) {
    return allProducts.find(p => p.id === parseInt(id));
  }

  function getAll() {
    return allProducts;
  }

  return { load, render, setCategory, setSearch, getById, getAll };
})();
