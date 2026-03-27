// ============================================
// Order Submission + EmailJS
// ============================================

const Order = (() => {
  async function submit() {
    const form = document.getElementById('order-form');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (Cart.isEmpty()) {
      showToast('Please add at least one item to your order', 'error');
      return;
    }

    const requestedBySelect = document.getElementById('requested-by').value;
    let requestedBy = requestedBySelect;
    let requesterEmail = '';
    if (requestedBySelect === 'Other') {
      requesterEmail = document.getElementById('requested-by-email').value.trim();
      requestedBy = requesterEmail;
    } else {
      requesterEmail = CONFIG.REQUESTER_EMAILS[requestedBySelect] || '';
    }
    const businessUnit = document.getElementById('business-unit').value;
    const projectName = document.getElementById('project-name').value;
    const dateRequested = document.getElementById('date-requested').value;
    const deadline = document.getElementById('deadline').value;
    const notes = document.getElementById('notes').value;

    if (!requestedBy || requestedBy === 'Select...') {
      showToast('Please select who is requesting this order', 'error');
      return;
    }

    const cartItems = Cart.getItems();
    const totalPrice = Cart.getTotal();

    const orderData = cartItems.map(item => ({
      type: item.type,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.unitPrice * item.quantity,
      vendor: item.vendor || null,
      url: item.url || null,
      kitItems: item.items || null,
    }));

    const submitBtn = document.getElementById('submit-order-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="spinner inline-block mr-2" style="width:1rem;height:1rem;border-width:2px;vertical-align:middle;"></div> Submitting...';

    try {
      // Save to Supabase if configured
      if (db) {
        const { error: dbError } = await db
          .from('orders')
          .insert({
            requested_by: requestedBy,
            business_unit: businessUnit,
            project_name: projectName,
            date_requested: dateRequested,
            deadline: deadline || null,
            notes: notes || null,
            total_price: totalPrice,
            order_data: orderData,
          });

        if (dbError) {
          console.error('DB error:', dbError);
          showToast('Failed to save order. Please try again.', 'error');
          return;
        }
      } else {
        console.log('Order data (Supabase not configured):', {
          requestedBy, businessUnit, projectName, dateRequested, deadline, notes, totalPrice, orderData,
        });
      }

      // Send email via EmailJS if configured
      try {
        await sendOrderEmail({ requestedBy, requesterEmail, businessUnit, projectName, dateRequested, deadline, notes, totalPrice, orderData });
      } catch (emailError) {
        console.warn('Email failed (order still saved):', emailError);
      }

      // Success
      showConfirmation(requestedBy, projectName, totalPrice, orderData.length);
      Cart.clear();
      form.reset();
      document.getElementById('date-requested').valueAsDate = new Date();

    } catch (err) {
      console.error('Order submission error:', err);
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  async function sendOrderEmail({ requestedBy, requesterEmail, businessUnit, projectName, dateRequested, deadline, notes, totalPrice, orderData }) {
    const itemLines = orderData.map(item => {
      const price = item.unitPrice > 0 ? `$${item.lineTotal.toFixed(2)}` : 'TBD';
      let line = `${item.quantity}x ${item.name} — ${price}`;
      if (item.type === 'kit' && item.kitItems) {
        line += '\n    Includes: ' + item.kitItems.map(ki => `${ki.quantity}x ${ki.name}`).join(', ');
      }
      return line;
    }).join('\n');

    const templateParams = {
      to_email: CONFIG.PROCUREMENT_EMAIL,
      requester_email: requesterEmail,
      requested_by: requestedBy,
      business_unit: businessUnit,
      project_name: projectName,
      date_requested: dateRequested,
      deadline: deadline || 'N/A',
      notes: notes || 'None',
      total_price: '$' + totalPrice.toFixed(2),
      item_count: orderData.length,
      items_list: itemLines,
    };

    if (CONFIG.EMAILJS_PUBLIC_KEY === 'YOUR_EMAILJS_PUBLIC_KEY') {
      console.log('EmailJS not configured. Email would contain:', templateParams);
      return;
    }

    await emailjs.send(CONFIG.EMAILJS_SERVICE_ID, CONFIG.EMAILJS_TEMPLATE_ID, templateParams);
    showToast('Order email sent!', 'success');
  }

  function showConfirmation(requestedBy, projectName, totalPrice, itemCount) {
    const modal = document.getElementById('confirmation-modal');
    if (!modal) return;
    document.getElementById('conf-requester').textContent = requestedBy;
    document.getElementById('conf-project').textContent = projectName;
    document.getElementById('conf-total').textContent = '$' + totalPrice.toFixed(2);
    document.getElementById('conf-items').textContent = itemCount + ' line item' + (itemCount !== 1 ? 's' : '');
    modal.classList.add('active');
  }

  function closeConfirmation() {
    const modal = document.getElementById('confirmation-modal');
    if (modal) modal.classList.remove('active');
  }

  return { submit, closeConfirmation };
})();
