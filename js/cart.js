// ============================================
// Shopping Cart
// ============================================

const Cart = (() => {
  // Cart items: { type: 'product'|'kit', id, name, quantity, unitPrice, items? (for kits) }
  let items = [];

  function addProduct(productId, qty = 1) {
    qty = parseInt(qty) || 1;
    const product = Products.getById(productId);
    if (!product) return;

    const existing = items.find(i => i.type === 'product' && i.id === productId);
    if (existing) {
      existing.quantity += qty;
    } else {
      items.push({
        type: 'product',
        id: productId,
        name: product.name,
        quantity: qty,
        unitPrice: product.price || 0,
        vendor: product.vendor,
        url: product.url,
        category: product.category,
      });
    }

    render();
    showToast(`Added ${product.name} to order`, 'success');
  }

  function addKit(kitId, qty = 1) {
    qty = parseInt(qty) || 1;
    const kit = Kits.getById(kitId);
    if (!kit) return;

    const kitTotal = Kits.getKitTotal(kit);
    const kitItems = (kit.kit_items || []).map(item => ({
      productId: item.product_id,
      name: item.products?.name || 'Unknown',
      quantity: item.quantity,
      price: item.products?.price || 0,
    }));

    const existing = items.find(i => i.type === 'kit' && i.id === kitId);
    if (existing) {
      existing.quantity += qty;
    } else {
      items.push({
        type: 'kit',
        id: kitId,
        name: kit.name,
        quantity: qty,
        unitPrice: kitTotal,
        items: kitItems,
      });
    }

    render();
    showToast(`Added kit "${kit.name}" to order`, 'success');
  }

  function updateQuantity(index, qty) {
    qty = parseInt(qty) || 0;
    if (qty <= 0) {
      remove(index);
    } else {
      items[index].quantity = qty;
      render();
    }
  }

  function remove(index) {
    const removed = items.splice(index, 1)[0];
    render();
    showToast(`Removed ${removed.name}`, 'info');
  }

  function clear() {
    items = [];
    render();
  }

  function getTotal() {
    return items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  }

  function getItems() {
    return items;
  }

  function isEmpty() {
    return items.length === 0;
  }

  function render() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const countEl = document.getElementById('cart-count');
    const emptyMsg = document.getElementById('cart-empty');
    const submitBtn = document.getElementById('submit-order-btn');

    if (!container) return;

    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    if (countEl) countEl.textContent = count;

    if (items.length === 0) {
      container.innerHTML = '';
      if (emptyMsg) emptyMsg.classList.remove('hidden');
      if (submitBtn) submitBtn.disabled = true;
      if (totalEl) totalEl.textContent = '$0.00';
      return;
    }

    if (emptyMsg) emptyMsg.classList.add('hidden');
    if (submitBtn) submitBtn.disabled = false;

    container.innerHTML = items.map((item, index) => `
      <div class="flex items-start justify-between py-3 ${index > 0 ? 'border-t border-slate-100' : ''}">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1">
            <span class="text-xs px-1.5 py-0.5 rounded ${item.type === 'kit' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}">${item.type === 'kit' ? 'Kit' : 'Item'}</span>
            <span class="text-sm font-medium text-slate-800 truncate">${item.name}</span>
          </div>
          ${item.type === 'kit' && item.items ? `
            <ul class="mt-1 ml-4 text-xs text-slate-400">
              ${item.items.map(ki => `<li>${ki.quantity}x ${ki.name}</li>`).join('')}
            </ul>` : ''}
          <span class="text-xs text-slate-400">${item.unitPrice > 0 ? '$' + item.unitPrice.toFixed(2) + ' each' : 'Price TBD'}</span>
        </div>
        <div class="flex items-center gap-2 ml-3">
          <input type="number" min="1" value="${item.quantity}"
            onchange="Cart.updateQuantity(${index}, this.value)"
            class="qty-input border border-slate-300 rounded px-2 py-1 text-sm w-14">
          <span class="text-sm font-semibold text-slate-700 w-16 text-right">${item.unitPrice > 0 ? '$' + (item.unitPrice * item.quantity).toFixed(2) : 'TBD'}</span>
          <button onclick="Cart.remove(${index})" class="text-red-400 hover:text-red-600 text-lg leading-none" title="Remove">&times;</button>
        </div>
      </div>
    `).join('');

    const total = getTotal();
    if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
  }

  return { addProduct, addKit, updateQuantity, remove, clear, getTotal, getItems, isEmpty, render };
})();
