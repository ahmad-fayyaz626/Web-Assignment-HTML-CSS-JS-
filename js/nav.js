// Sets the current year in the footer automatically
document.getElementById("year").textContent = new Date().getFullYear();

// Reads the cart from localStorage and updates the badge next to "Cart"
// This runs on every page since nav.js is loaded everywhere
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = totalItems;
}

updateCartCount();

// ===== Mobile hamburger menu =====
const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  hamburger.classList.toggle("open");
});

// Closes the mobile menu automatically when a link is tapped
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    hamburger.classList.remove("open");
  });
});
