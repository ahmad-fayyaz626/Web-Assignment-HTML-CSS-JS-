const cartItemsEl = document.getElementById("cart-items");
const subtotalEl = document.getElementById("cart-subtotal");
const totalEl = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");

// Reads the current cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Saves the cart back to localStorage and refreshes the page + navbar badge
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

// Builds the HTML for one row in the cart
function renderCartRow(item) {
  const lineTotal = (item.price * item.qty).toFixed(2);
  return `
    <div class="cart-row" data-id="${item.id}">
      <img src="${item.image}" alt="${item.title}">
      <div class="cart-row-info">
        <p class="cart-row-title">${item.title}</p>
        <p class="cart-row-price">$${item.price.toFixed(2)} each</p>
      </div>
      <div class="qty-control">
        <button class="qty-btn" data-action="decrease">-</button>
        <span>${item.qty}</span>
        <button class="qty-btn" data-action="increase">+</button>
      </div>
      <span class="cart-row-total">$${lineTotal}</span>
      <button class="remove-btn" data-action="remove">Remove</button>
    </div>
  `;
}

// Draws the whole cart page: rows + summary numbers
function renderCart() {
  const cart = getCart();

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<p class="empty-cart">Your cart is empty. <a href="shop.html">Go shopping →</a></p>`;
    subtotalEl.textContent = "$0.00";
    totalEl.textContent = "$0.00";
    return;
  }

  cartItemsEl.innerHTML = cart.map(renderCartRow).join("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  totalEl.textContent = `$${subtotal.toFixed(2)}`;
}

// One listener handles increase / decrease / remove for every row (event delegation)
cartItemsEl.addEventListener("click", (e) => {
  const action = e.target.dataset.action;
  if (!action) return;

  const row = e.target.closest(".cart-row");
  const id = Number(row.dataset.id);
  let cart = getCart();
  const item = cart.find((i) => i.id === id);

  if (action === "increase") {
    item.qty += 1;
  } else if (action === "decrease") {
    item.qty -= 1;
    if (item.qty <= 0) cart = cart.filter((i) => i.id !== id);
  } else if (action === "remove") {
    cart = cart.filter((i) => i.id !== id);
  }

  saveCart(cart);
});

checkoutBtn.addEventListener("click", () => {
  const cart = getCart();
  if (cart.length === 0) return;
  alert(
    "This is a static demo, so there's no real payment step — but this is where checkout would happen!",
  );
});

renderCart();
