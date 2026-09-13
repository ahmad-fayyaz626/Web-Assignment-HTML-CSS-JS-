const API_URL = "https://fakestoreapi.com/products";

// Builds the HTML for a single product card.
// Used on the homepage (best sellers / featured) and later on the shop page.
function renderProductCard(product) {
  return `
    <div class="product-card">
      <a href="product.html?id=${product.id}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.title}">
        </div>
      </a>
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3 class="product-title">${product.title}</h3>
        <div class="product-footer">
          <span class="product-price">$${product.price.toFixed(2)}</span>
          <button class="btn-add-cart" data-id="${product.id}">Add to cart</button>
        </div>
      </div>
    </div>
  `;
}

// Adds a product to the cart stored in localStorage
function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      qty: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Attaches click listeners to every "Add to cart" button inside a container
function attachAddToCartListeners(container, products) {
  container.querySelectorAll(".btn-add-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      const product = products.find((p) => p.id === id);
      addToCart(product);

      // Small feedback so the click feels responsive
      button.textContent = "Added ✓";
      setTimeout(() => (button.textContent = "Add to cart"), 1200);
    });
  });
}

// Only run the homepage rendering if we're actually on index.html
const bestSellersEl = document.getElementById("best-sellers");
const featuredEl = document.getElementById("featured-products");

if (bestSellersEl && featuredEl) {
  fetch(API_URL)
    .then((res) => res.json())
    .then((products) => {
      // Best sellers: the 4 highest-rated products
      const bestSellers = [...products]
        .sort((a, b) => b.rating.rate - a.rating.rate)
        .slice(0, 4);

      // Featured: next 4 products, just for variety
      const featured = products.slice(4, 8);

      bestSellersEl.innerHTML = bestSellers.map(renderProductCard).join("");
      featuredEl.innerHTML = featured.map(renderProductCard).join("");

      attachAddToCartListeners(bestSellersEl, bestSellers);
      attachAddToCartListeners(featuredEl, featured);
    })
    .catch(() => {
      bestSellersEl.innerHTML = "<p>Could not load products right now.</p>";
    });
}

// ===== Shop page: full catalog with category filtering =====
const shopGridEl = document.getElementById("shop-grid");
const filterBarEl = document.getElementById("filter-bar");

if (shopGridEl && filterBarEl) {
  let allProducts = [];

  // Draws the grid for a given list of products
  function renderShopGrid(products) {
    shopGridEl.innerHTML = products.map(renderProductCard).join("");
    attachAddToCartListeners(shopGridEl, products);
  }

  // Filters allProducts by category and re-renders
  function filterByCategory(category) {
    if (category === "all") {
      renderShopGrid(allProducts);
    } else {
      const filtered = allProducts.filter((p) => p.category === category);
      renderShopGrid(filtered);
    }
  }

  fetch(API_URL)
    .then((res) => res.json())
    .then((products) => {
      allProducts = products;
      renderShopGrid(allProducts);

      // Build one filter button per unique category found in the data
      const categories = [...new Set(products.map((p) => p.category))];

      categories.forEach((category) => {
        const btn = document.createElement("button");
        btn.className = "filter-btn";
        btn.dataset.category = category;
        btn.textContent = category;
        filterBarEl.appendChild(btn);
      });

      // One listener on the container handles clicks for every button (event delegation)
      filterBarEl.addEventListener("click", (e) => {
        if (!e.target.classList.contains("filter-btn")) return;

        filterBarEl
          .querySelectorAll(".filter-btn")
          .forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");

        filterByCategory(e.target.dataset.category);
      });
    })
    .catch(() => {
      shopGridEl.innerHTML = "<p>Could not load products right now.</p>";
    });
}
