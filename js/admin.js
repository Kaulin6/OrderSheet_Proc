// ============================================
// Kit Builder (Admin) - CRUD Logic
// Uses Supabase when configured, localStorage otherwise
// ============================================

const Admin = (() => {
  let allProducts = [];
  let allKits = [];
  let editingKitId = null;
  let kitItemRows = []; // { productId, quantity }

  const STORAGE_KEY = 'shq_kits';

  // --- localStorage helpers ---
  function getLocalKits() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  }

  function saveLocalKits(kits) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(kits));
  }

  function buildKitWithProducts(kit) {
    // Ensure kit_items have nested products data for rendering
    if (!kit.kit_items) kit.kit_items = [];
    kit.kit_items = kit.kit_items.map(item => {
      if (!item.products) {
        const product = allProducts.find(p => p.id === item.product_id);
        item.products = product || { id: item.product_id, name: 'Unknown', price: null, category: '' };
      }
      return item;
    });
    return kit;
  }

  // --- Init ---
  async function init() {
    // Load products
    if (db) {
      const { data: products, error: pErr } = await db
        .from('products')
        .select('*')
        .order('category')
        .order('name');

      if (!pErr && products) {
        allProducts = products;
      } else {
        allProducts = typeof LOCAL_PRODUCTS !== 'undefined' ? LOCAL_PRODUCTS : [];
      }
    } else {
      allProducts = typeof LOCAL_PRODUCTS !== 'undefined' ? LOCAL_PRODUCTS : [];
    }

    await loadKits();
    renderProductOptions();
  }

  // --- Load Kits ---
  async function loadKits() {
    if (db) {
      const { data, error } = await db
        .from('kits')
        .select(`
          *,
          kit_items (
            id,
            quantity,
            product_id,
            products (id, name, price, category)
          )
        `)
        .order('name');

      if (!error && data) {
        allKits = data;
        renderKitsList();
        return;
      }
    }

    // Fallback: localStorage, then LOCAL_KITS defaults
    const localKits = getLocalKits();
    if (localKits) {
      allKits = localKits.map(k => buildKitWithProducts(k));
    } else {
      allKits = (typeof LOCAL_KITS !== 'undefined' ? LOCAL_KITS : []).map(k => buildKitWithProducts({...k}));
      saveLocalKits(allKits);
    }
    renderKitsList();
  }

  // --- Render Kits List ---
  function renderKitsList() {
    const container = document.getElementById('kits-list');
    if (!container) return;

    if (allKits.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12 text-slate-400">
          No kits created yet. Use the form below to create your first kit.
        </div>`;
      return;
    }

    container.innerHTML = allKits.map(kit => {
      const items = kit.kit_items || [];
      const total = items.reduce((sum, item) => {
        return sum + ((item.products?.price || 0) * item.quantity);
      }, 0);

      return `
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-semibold text-slate-800">${kit.name}</h3>
              ${kit.description ? `<p class="text-sm text-slate-500 mt-1">${kit.description}</p>` : ''}
            </div>
            <div class="flex gap-2">
              <button onclick="Admin.editKit('${kit.id}')" class="text-sm text-blue-600 hover:text-blue-800 font-medium">Edit</button>
              <button onclick="Admin.confirmDeleteKit('${kit.id}', '${kit.name.replace(/'/g, "\\'")}')" class="text-sm text-red-500 hover:text-red-700 font-medium">Delete</button>
            </div>
          </div>
          <ul class="mt-3 space-y-1">
            ${items.map(item => `
              <li class="text-sm text-slate-600 flex justify-between">
                <span>${item.quantity}x ${item.products?.name || 'Unknown'}</span>
                <span class="text-slate-400">${item.products?.price ? '$' + (item.products.price * item.quantity).toFixed(2) : 'TBD'}</span>
              </li>
            `).join('')}
          </ul>
          <div class="mt-3 pt-3 border-t border-slate-100 text-right font-bold text-blue-700">
            ${total > 0 ? '$' + total.toFixed(2) : 'Price TBD'}
          </div>
        </div>`;
    }).join('');
  }

  // --- Render product dropdown ---
  function renderProductOptions() {
    const select = document.getElementById('product-select');
    if (!select) return;

    const categories = {};
    allProducts.forEach(p => {
      if (!categories[p.category]) categories[p.category] = [];
      categories[p.category].push(p);
    });

    let html = '<option value="">Select a product...</option>';
    Object.keys(categories).sort().forEach(cat => {
      html += `<optgroup label="${cat}">`;
      categories[cat].forEach(p => {
        const price = p.price ? ` — $${p.price.toFixed(2)}` : ' — TBD';
        html += `<option value="${p.id}">${p.name}${price}</option>`;
      });
      html += '</optgroup>';
    });

    select.innerHTML = html;
  }

  // --- Kit item row management ---
  function addItemRow() {
    const select = document.getElementById('product-select');
    const qtyInput = document.getElementById('item-quantity');
    const productId = parseInt(select.value);
    const quantity = parseInt(qtyInput.value) || 1;

    if (!productId) {
      showToast('Please select a product', 'error');
      return;
    }

    const existing = kitItemRows.find(r => r.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      kitItemRows.push({ productId, quantity });
    }

    select.value = '';
    qtyInput.value = '1';
    renderKitItems();
  }

  function removeItemRow(index) {
    kitItemRows.splice(index, 1);
    renderKitItems();
  }

  function renderKitItems() {
    const container = document.getElementById('kit-items-list');
    const totalEl = document.getElementById('kit-total');
    if (!container) return;

    if (kitItemRows.length === 0) {
      container.innerHTML = '<p class="text-sm text-slate-400 py-4 text-center">No items added yet</p>';
      if (totalEl) totalEl.textContent = '$0.00';
      return;
    }

    let total = 0;
    container.innerHTML = kitItemRows.map((row, index) => {
      const product = allProducts.find(p => p.id === row.productId);
      const lineTotal = (product?.price || 0) * row.quantity;
      total += lineTotal;

      return `
        <div class="flex items-center justify-between py-2 ${index > 0 ? 'border-t border-slate-100' : ''}">
          <div class="flex-1">
            <span class="text-sm font-medium text-slate-700">${product?.name || 'Unknown'}</span>
            <span class="text-xs text-slate-400 ml-2">${product?.category || ''}</span>
          </div>
          <div class="flex items-center gap-3">
            <input type="number" min="1" value="${row.quantity}"
              onchange="Admin.updateItemQty(${index}, this.value)"
              class="qty-input border border-slate-300 rounded px-2 py-1 text-sm w-16">
            <span class="text-sm text-slate-600 w-20 text-right">${product?.price ? '$' + lineTotal.toFixed(2) : 'TBD'}</span>
            <button onclick="Admin.removeItemRow(${index})" class="text-red-400 hover:text-red-600 text-lg">&times;</button>
          </div>
        </div>`;
    }).join('');

    if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
  }

  function updateItemQty(index, qty) {
    qty = parseInt(qty) || 1;
    kitItemRows[index].quantity = qty;
    renderKitItems();
  }

  // --- Edit Kit ---
  function editKit(kitId) {
    const kit = allKits.find(k => k.id === kitId);
    if (!kit) return;

    editingKitId = kitId;
    document.getElementById('kit-name').value = kit.name;
    document.getElementById('kit-description').value = kit.description || '';
    document.getElementById('kit-category').value = kit.category || '';

    kitItemRows = (kit.kit_items || []).map(item => ({
      productId: item.product_id,
      quantity: item.quantity,
    }));

    renderKitItems();

    document.getElementById('save-kit-btn').textContent = 'Update Kit';
    document.getElementById('cancel-edit-btn').classList.remove('hidden');
    document.getElementById('kit-form-section').scrollIntoView({ behavior: 'smooth' });
  }

  function cancelEdit() {
    editingKitId = null;
    document.getElementById('kit-name').value = '';
    document.getElementById('kit-description').value = '';
    document.getElementById('kit-category').value = '';
    kitItemRows = [];
    renderKitItems();

    document.getElementById('save-kit-btn').textContent = 'Create Kit';
    document.getElementById('cancel-edit-btn').classList.add('hidden');
  }

  // --- Save Kit (create or update) ---
  async function saveKit() {
    const name = document.getElementById('kit-name').value.trim();
    const description = document.getElementById('kit-description').value.trim();
    const category = document.getElementById('kit-category').value.trim();

    if (!name) {
      showToast('Please enter a kit name', 'error');
      return;
    }

    if (kitItemRows.length === 0) {
      showToast('Please add at least one item to the kit', 'error');
      return;
    }

    const saveBtn = document.getElementById('save-kit-btn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<div class="spinner inline-block mr-2" style="width:1rem;height:1rem;border-width:2px;vertical-align:middle;"></div> Saving...';

    try {
      if (db) {
        await saveKitToSupabase(name, description, category);
      } else {
        saveKitLocally(name, description, category);
      }

      showToast(editingKitId ? 'Kit updated!' : 'Kit created!', 'success');
      cancelEdit();
      await loadKits();

    } catch (err) {
      console.error('Error saving kit:', err);
      showToast('Failed to save kit. Please try again.', 'error');
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = editingKitId ? 'Update Kit' : 'Create Kit';
    }
  }

  async function saveKitToSupabase(name, description, category) {
    let kitId = editingKitId;

    if (editingKitId) {
      const { error } = await db
        .from('kits')
        .update({ name, description: description || null, category: category || null, updated_at: new Date().toISOString() })
        .eq('id', editingKitId);
      if (error) throw error;
      await db.from('kit_items').delete().eq('kit_id', editingKitId);
    } else {
      const { data, error } = await db
        .from('kits')
        .insert({ name, description: description || null, category: category || null })
        .select('id')
        .single();
      if (error) throw error;
      kitId = data.id;
    }

    const itemsToInsert = kitItemRows.map(row => ({
      kit_id: kitId,
      product_id: row.productId,
      quantity: row.quantity,
    }));

    const { error: itemsError } = await db.from('kit_items').insert(itemsToInsert);
    if (itemsError) throw itemsError;
  }

  function saveKitLocally(name, description, category) {
    const kitItems = kitItemRows.map((row, i) => {
      const product = allProducts.find(p => p.id === row.productId);
      return {
        id: Date.now() + i,
        product_id: row.productId,
        quantity: row.quantity,
        products: product ? { id: product.id, name: product.name, price: product.price, category: product.category } : null,
      };
    });

    if (editingKitId) {
      const idx = allKits.findIndex(k => k.id === editingKitId);
      if (idx !== -1) {
        allKits[idx].name = name;
        allKits[idx].description = description || null;
        allKits[idx].category = category || null;
        allKits[idx].kit_items = kitItems;
        allKits[idx].updated_at = new Date().toISOString();
      }
    } else {
      allKits.push({
        id: 'local-' + Date.now(),
        name,
        description: description || null,
        category: category || null,
        kit_items: kitItems,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    saveLocalKits(allKits);
  }

  // --- Delete Kit ---
  function confirmDeleteKit(kitId, kitName) {
    const modal = document.getElementById('delete-modal');
    document.getElementById('delete-kit-name').textContent = kitName;
    document.getElementById('confirm-delete-btn').onclick = () => deleteKit(kitId);
    modal.classList.add('active');
  }

  async function deleteKit(kitId) {
    try {
      if (db) {
        const { error } = await db.from('kits').delete().eq('id', kitId);
        if (error) throw error;
      } else {
        allKits = allKits.filter(k => k.id !== kitId);
        saveLocalKits(allKits);
      }

      showToast('Kit deleted', 'info');
      closeDeleteModal();
      await loadKits();

    } catch (err) {
      console.error('Error deleting kit:', err);
      showToast('Failed to delete kit', 'error');
    }
  }

  function closeDeleteModal() {
    document.getElementById('delete-modal').classList.remove('active');
  }

  return {
    init, addItemRow, removeItemRow, updateItemQty,
    editKit, cancelEdit, saveKit,
    confirmDeleteKit, closeDeleteModal,
  };
})();
