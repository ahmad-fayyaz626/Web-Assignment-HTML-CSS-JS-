const detailEl = document.getElementById("product-detail");

if (detailEl) {
  // Reads the "id" value out of the URL, e.g. product.html?id=3 -> "3"
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    detailEl.innerHTML = "<p>No product selected.</p>";
  } else {
    fetch(`${API_URL}/${productId}`)
      .then((res) => res.json())
      .then((product) => {
        // Builds a row of filled/empty stars out of the API's rating value
        const fullStars = Math.round(product.rating.rate);
        const stars = "★".repeat(fullStars) + "☆".repeat(5 - fullStars);

        detailEl.innerHTML = `
          <div class="detail-layout">
            <div class="detail-image">
              <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="detail-info">
              <p class="product-category">${product.category}</p>
              <h1>${product.title}</h1>
              <div class="detail-rating">
                <span class="stars">${stars}</span>
                <span class="rating-count">(${product.rating.count} reviews)</span>
              </div>
              <p class="detail-price">$${product.price.toFixed(2)}</p>
              <p class="detail-description">${product.description}</p>
              <button class="btn btn-primary" id="detail-add-cart" data-id="${product.id}">
                Add to cart
              </button>
            </div>
          </div>
        `;

        // Reuses the same addToCart() function from products.js — no duplicate logic
        document
          .getElementById("detail-add-cart")
          .addEventListener("click", (e) => {
            addToCart(product);
            e.target.textContent = "Added ✓";
            setTimeout(() => (e.target.textContent = "Add to cart"), 1200);
          });
      })
      .catch(() => {
        detailEl.innerHTML = "<p>Could not load this product right now.</p>";
      });
  }
}
