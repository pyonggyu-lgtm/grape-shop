/**
 * grape-shop mockup scripts
 * Pure vanilla JS — simulates app behavior using JSON data files.
 * Each section corresponds to a Next.js component to be built in Phase 4-6.
 */

// ============================================================
// State  (→ Next.js: Zustand cart-store.ts)
// ============================================================
const state = {
  cart: [],          // { productId, productName, option, quantity }
  cartOpen: false,
};

// ============================================================
// Utils  (→ Next.js: src/lib/utils.ts)
// ============================================================
function formatPrice(amount) {
  return amount.toLocaleString('ko-KR') + '원';
}

function formatOrderNumber(index) {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  return `ORD-${y}${m}${d}-${String(index + 1).padStart(4, '0')}`;
}

// ============================================================
// Data Loader  (→ Next.js: src/hooks/useProducts.ts via TanStack Query)
// ============================================================
async function loadProducts() {
  try {
    const res = await fetch('../data/products.json');
    const json = await res.json();
    return json.data;
  } catch {
    console.warn('Could not load products.json, using inline fallback');
    return [];
  }
}

async function loadOrders() {
  try {
    const res = await fetch('../data/orders.json');
    const json = await res.json();
    return json.data;
  } catch {
    return [];
  }
}

// ============================================================
// Cart  (→ Next.js: src/stores/cart-store.ts Zustand)
// ============================================================
function addToCart(product, option) {
  const key = `${product._id}_${option.weight}`;
  const existing = state.cart.find(i => i.key === key);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      key,
      productId: product._id,
      productName: product.name,
      option,
      quantity: 1,
    });
  }
  updateCartUI();
  openCart();
}

function removeFromCart(key) {
  state.cart = state.cart.filter(i => i.key !== key);
  updateCartUI();
}

function changeQty(key, delta) {
  const item = state.cart.find(i => i.key === key);
  if (item) {
    item.quantity = Math.max(1, item.quantity + delta);
    updateCartUI();
  }
}

function getCartTotal() {
  return state.cart.reduce((sum, i) => sum + i.option.price * i.quantity, 0);
}

function getCartCount() {
  return state.cart.reduce((sum, i) => sum + i.quantity, 0);
}

function openCart() {
  state.cartOpen = true;
  document.getElementById('cart-overlay')?.classList.add('is-open');
  document.getElementById('cart-drawer')?.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  state.cartOpen = false;
  document.getElementById('cart-overlay')?.classList.remove('is-open');
  document.getElementById('cart-drawer')?.classList.remove('is-open');
  document.body.style.overflow = '';
}

function updateCartUI() {
  // Badge
  const badge = document.getElementById('cart-badge');
  const count = getCartCount();
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }

  // Cart body
  const body = document.getElementById('cart-body');
  if (!body) return;

  if (state.cart.length === 0) {
    body.innerHTML = `
      <div style="text-align:center;padding:48px 24px;color:var(--color-text-muted)">
        <div style="font-size:48px;margin-bottom:16px">🛒</div>
        <p>장바구니가 비어있습니다</p>
      </div>`;
  } else {
    body.innerHTML = state.cart.map(item => `
      <div class="cart-item" data-key="${item.key}">
        <div class="cart-item__info">
          <div class="cart-item__name">${item.productName}</div>
          <div class="cart-item__option">${item.option.label} · ${formatPrice(item.option.price)}</div>
          <div class="cart-item__controls">
            <button class="qty-btn" onclick="changeQty('${item.key}', -1)">−</button>
            <span class="qty-display">${item.quantity}</span>
            <button class="qty-btn" onclick="changeQty('${item.key}', 1)">+</button>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
          <div class="cart-item__price">${formatPrice(item.option.price * item.quantity)}</div>
          <button class="cart-item__remove" onclick="removeFromCart('${item.key}')" title="삭제">✕</button>
        </div>
      </div>
    `).join('');
  }

  // Total
  const totalEl = document.getElementById('cart-total-amount');
  if (totalEl) totalEl.textContent = formatPrice(getCartTotal());

  // Checkout btn
  const checkoutBtn = document.getElementById('cart-checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.disabled = state.cart.length === 0;
    checkoutBtn.onclick = () => {
      if (state.cart.length > 0) {
        sessionStorage.setItem('cart', JSON.stringify(state.cart));
        window.location.href = 'order.html';
      }
    };
  }
}

// ============================================================
// Product Page Renderer  (→ Next.js: app/(shop)/page.tsx)
// ============================================================
async function renderProductPage() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--color-text-muted)">상품을 불러오는 중...</div>';

  const products = await loadProducts();

  if (products.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--color-text-muted)">상품이 없습니다.</div>';
    return;
  }

  grid.innerHTML = products.map(p => {
    const firstOption = p.options[0];
    const optionsHTML = p.options.map(opt => `
      <button class="option-btn ${opt === firstOption ? 'is-selected' : ''}"
        data-product-id="${p._id}"
        data-weight="${opt.weight}"
        data-price="${opt.price}"
        data-label="${opt.label}"
        onclick="selectOption(this, '${p._id}')">
        ${opt.label}
        <span class="option-price">${formatPrice(opt.price)}</span>
      </button>
    `).join('');

    return `
      <article class="product-card" data-component="ProductCard" data-id="${p._id}">
        <div class="product-card__image">
          <img src="${p.imageUrl}" alt="${p.name}" loading="lazy" />
          ${p.isAvailable ? '<span class="product-card__badge">판매중</span>' : '<span class="product-card__badge" style="background:var(--color-text-muted)">품절</span>'}
        </div>
        <div class="product-card__body">
          <h2 class="product-card__name">${p.name}</h2>
          <p class="product-card__desc">${p.description}</p>
          <div class="option-selector" data-component="ProductOptionSelector">
            <div class="option-selector__label">중량 선택</div>
            <div class="option-selector__options" id="options-${p._id}">
              ${optionsHTML}
            </div>
          </div>
          <div class="product-card__footer">
            <span class="product-price" id="price-${p._id}">${formatPrice(firstOption.price)}</span>
            <button class="btn btn--primary btn--sm"
              id="add-cart-${p._id}"
              onclick="handleAddToCart('${p._id}', ${JSON.stringify(p).replace(/"/g, '&quot;')})"
              ${!p.isAvailable ? 'disabled' : ''}>
              장바구니 담기
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Store products globally for cart use
  window.__products = products;
}

function selectOption(btn, productId) {
  const container = document.getElementById(`options-${productId}`);
  container.querySelectorAll('.option-btn').forEach(b => b.classList.remove('is-selected'));
  btn.classList.add('is-selected');
  document.getElementById(`price-${productId}`).textContent = formatPrice(parseInt(btn.dataset.price));
}

function handleAddToCart(productId, productData) {
  const container = document.getElementById(`options-${productId}`);
  const selected = container.querySelector('.option-btn.is-selected');
  if (!selected) return;
  const option = {
    weight: parseInt(selected.dataset.weight),
    price: parseInt(selected.dataset.price),
    label: selected.dataset.label,
  };
  addToCart(productData, option);
}

// ============================================================
// Order Page  (→ Next.js: app/(shop)/order/page.tsx)
// ============================================================
function renderOrderPage() {
  const cartData = sessionStorage.getItem('cart');
  const cart = cartData ? JSON.parse(cartData) : state.cart;

  const summaryItems = document.getElementById('order-summary-items');
  const totalEl = document.getElementById('order-summary-total');

  if (summaryItems && cart.length > 0) {
    const total = cart.reduce((s, i) => s + i.option.price * i.quantity, 0);

    summaryItems.innerHTML = cart.map(item => `
      <div class="order-summary__item">
        <div>
          <div class="order-summary__item-name">${item.productName}</div>
          <div class="order-summary__item-meta">${item.option.label} × ${item.quantity}</div>
        </div>
        <div class="order-summary__item-price">${formatPrice(item.option.price * item.quantity)}</div>
      </div>
    `).join('');

    if (totalEl) totalEl.textContent = formatPrice(total);
  }

  // Form submission simulation
  const form = document.getElementById('order-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const orderNum = formatOrderNumber(0);
      sessionStorage.setItem('lastOrderNumber', orderNum);
      window.location.href = 'order-complete.html';
    });
  }
}

// ============================================================
// Admin Order Table  (→ Next.js: src/components/features/admin/AdminOrderTable.tsx)
// ============================================================
const STATUS_LABELS = {
  pending: '결제 대기',
  paid: '결제 완료',
  preparing: '포장 중',
  shipped: '발송 완료',
  delivered: '배송 완료',
  cancelled: '취소됨',
};

async function renderAdminOrders() {
  const tbody = document.getElementById('admin-order-tbody');
  if (!tbody) return;

  const orders = await loadOrders();

  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--color-text-muted)">주문이 없습니다</td></tr>';
    return;
  }

  tbody.innerHTML = orders.map(order => {
    const statusOptions = Object.entries(STATUS_LABELS).map(([val, label]) =>
      `<option value="${val}" ${order.status === val ? 'selected' : ''}>${label}</option>`
    ).join('');

    return `
      <tr>
        <td><span style="font-family:monospace;font-size:12px">${order.orderNumber}</span></td>
        <td>
          <div style="font-weight:600">${order.customerName}</div>
          <div style="font-size:12px;color:var(--color-text-muted)">${order.customerPhone}</div>
        </td>
        <td>
          ${order.items.map(i => `<div style="font-size:12px">${i.productName} ${i.option.label} × ${i.quantity}</div>`).join('')}
        </td>
        <td style="font-weight:700">${formatPrice(order.totalAmount)}</td>
        <td>
          <select class="status-select badge badge--${order.status}" onchange="updateOrderStatus('${order._id}', this.value)">
            ${statusOptions}
          </select>
        </td>
        <td>
          <button class="btn btn--ghost btn--sm" onclick="alert('주문 상세 모달 (Phase 4 구현 예정)')">상세</button>
        </td>
      </tr>
    `;
  }).join('');
}

function updateOrderStatus(orderId, newStatus) {
  console.log(`[Mock] updateOrderStatus: ${orderId} → ${newStatus}`);
  // Phase 4에서 bkend.ai PATCH /orders/:id API 호출로 대체
  alert(`상태 변경: ${STATUS_LABELS[newStatus]}\n(Phase 4에서 실제 API 연결 예정)`);
}

// ============================================================
// Order Complete Page
// ============================================================
function renderOrderComplete() {
  const numEl = document.getElementById('complete-order-number');
  if (numEl) {
    const num = sessionStorage.getItem('lastOrderNumber') || formatOrderNumber(0);
    numEl.textContent = num;
  }
}

// ============================================================
// Init on DOMContentLoaded
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Detect which page we're on
  const page = document.body.dataset.page;

  // Cart overlay / close
  document.getElementById('cart-overlay')?.addEventListener('click', closeCart);
  document.getElementById('cart-close-btn')?.addEventListener('click', closeCart);
  document.getElementById('cart-btn')?.addEventListener('click', openCart);

  // Initialize cart UI
  updateCartUI();

  switch (page) {
    case 'home':      renderProductPage(); break;
    case 'order':     renderOrderPage();   break;
    case 'complete':  renderOrderComplete(); break;
    case 'admin-orders': renderAdminOrders(); break;
  }
});
