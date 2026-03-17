// ============================================
// Kits - Load & Display
// ============================================

// Sample kit for local/demo mode
const LOCAL_KITS = [
  {
    id: 'demo-kit-1',
    name: 'Basic Camera Setup',
    description: '1 patrol camera + 12-ch NVR + sub switch + junction box — everything to get a single camera online.',
    category: 'Security',
    kit_items: [
      { id: 1, quantity: 1, product_id: 1,  products: { id: 1,  name: 'Patrol Camera (RLC-823S1W)', price: 300, category: 'Security', vendor: 'Reolink' } },
      { id: 2, quantity: 1, product_id: 8,  products: { id: 8,  name: '12 Channels (RLN12W)',       price: 315, category: 'MEP',      vendor: 'Reolink' } },
      { id: 3, quantity: 1, product_id: 11, products: { id: 11, name: 'Sub Switch (TL-SG2210MP)',   price: 258, category: 'MEP',      vendor: 'Amazon' } },
      { id: 4, quantity: 1, product_id: 15, products: { id: 15, name: 'Junction Box',               price: 93,  category: 'MEP',      vendor: 'Amazon' } },
    ],
  },
  {
    id: 'demo-kit-2',
    name: 'Solar Security Station',
    description: 'Solar camera + solar light + Starlink — fully off-grid security post.',
    category: 'Security',
    kit_items: [
      { id: 5, quantity: 1, product_id: 3,  products: { id: 3,  name: 'Solar Wifi Camera (Atlas PT Ultra)', price: 186, category: 'Security', vendor: 'Reolink' } },
      { id: 6, quantity: 2, product_id: 6,  products: { id: 6,  name: 'Ofuray Solar (Pole Mount)',         price: 195, category: 'Security', vendor: 'Amazon' } },
      { id: 7, quantity: 1, product_id: 25, products: { id: 25, name: 'Starlink',                          price: 65,  category: 'Security', vendor: 'Business Local' } },
      { id: 8, quantity: 2, product_id: 24, products: { id: 24, name: 'Padlock',                           price: 4,   category: 'Security', vendor: 'NB Rato Hardware' } },
    ],
  },
  {
    id: 'demo-kit-3',
    name: 'Network Infrastructure',
    description: 'Core switch + sub switch + fiber cable + transceivers — full network backbone.',
    category: 'MEP',
    kit_items: [
      { id: 9,  quantity: 1, product_id: 10, products: { id: 10, name: 'Core Switch (TL-SG3428X)', price: 548, category: 'MEP', vendor: 'Amazon' } },
      { id: 10, quantity: 2, product_id: 11, products: { id: 11, name: 'Sub Switch (TL-SG2210MP)', price: 258, category: 'MEP', vendor: 'Amazon' } },
      { id: 11, quantity: 1, product_id: 12, products: { id: 12, name: 'Fiber Optics Cable',       price: 150, category: 'MEP', vendor: 'Amazon' } },
      { id: 12, quantity: 2, product_id: 13, products: { id: 13, name: 'Fiber Transceiver',        price: 58,  category: 'MEP', vendor: 'Amazon' } },
    ],
  },
];

const Kits = (() => {
  let allKits = [];

  async function load() {
    if (db) {
      const { data, error } = await db
        .from('kits')
        .select(`
          *,
          kit_items (
            id,
            quantity,
            product_id,
            products (id, name, price, category, vendor)
          )
        `)
        .order('name');

      if (!error && data && data.length > 0) {
        allKits = data;
        return data;
      }
      console.warn('Supabase kits load failed, using local data:', error?.message);
    }

    // Check localStorage for kits saved via admin page
    try {
      const stored = localStorage.getItem('shq_kits');
      if (stored) {
        allKits = JSON.parse(stored);
        return allKits;
      }
    } catch {}

    allKits = LOCAL_KITS;
    return allKits;
  }

  function getKitTotal(kit) {
    if (!kit.kit_items) return 0;
    return kit.kit_items.reduce((sum, item) => {
      const price = item.products?.price || 0;
      return sum + (price * item.quantity);
    }, 0);
  }

  function render(kits, containerId = 'kits-grid') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!kits || kits.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-8 text-slate-400">
          No kits created yet. <a href="admin.html" class="text-blue-500 hover:underline">Create one</a>
        </div>`;
      return;
    }

    container.innerHTML = kits.map(kit => {
      const total = getKitTotal(kit);
      const itemsList = (kit.kit_items || []).map(item =>
        `<li class="flex justify-between text-sm py-1">
          <span class="text-slate-600"><span class="font-medium text-slate-700">${item.quantity}x</span> ${item.products?.name || 'Unknown'}</span>
          <span class="${item.products?.price ? 'text-slate-500 font-medium' : 'text-slate-400'}">${item.products?.price ? '$' + (item.products.price * item.quantity).toFixed(2) : 'TBD'}</span>
        </li>`
      ).join('');

      return `
        <div class="kit-card bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-sm border border-slate-200 p-5">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-bold text-slate-800 text-base">${kit.name}</h3>
            ${kit.category ? `<span class="text-xs ${CATEGORY_BADGE_COLORS[kit.category] || 'bg-slate-100 text-slate-600'} px-2 py-0.5 rounded-full font-medium">${kit.category}</span>` : ''}
          </div>
          ${kit.description ? `<p class="text-sm text-slate-500 mb-3">${kit.description}</p>` : ''}
          <ul class="space-y-0.5 mb-4 border-t border-slate-200 pt-3">
            ${itemsList}
          </ul>
          <div class="flex items-center justify-between border-t border-slate-200 pt-3">
            <span class="text-xl font-bold text-blue-700">${total > 0 ? '$' + total.toFixed(2) : 'Price TBD'}</span>
            <div class="flex items-center gap-1">
              <input type="number" min="1" value="1" class="qty-input border border-slate-300 rounded-lg px-2 py-1.5 text-sm" id="qty-kit-${kit.id}">
              <button onclick="Cart.addKit('${kit.id}', document.getElementById('qty-kit-${kit.id}').value)"
                class="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-1.5 rounded-lg transition-colors font-medium">
                Add Kit
              </button>
            </div>
          </div>
        </div>`;
    }).join('');
  }

  function getById(id) {
    return allKits.find(k => k.id === id);
  }

  function getAll() {
    return allKits;
  }

  return { load, render, getKitTotal, getById, getAll };
})();
