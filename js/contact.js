const form = document.getElementById("contact-form");
const successMsg = document.getElementById("form-success");

// Clears any previous error text/styling from one field
function clearError(fieldId) {
  document.getElementById(fieldId).classList.remove("input-error");
  document.getElementById(`${fieldId}-error`).textContent = "";
}

// Shows an error message under a field and highlights it
function showError(fieldId, message) {
  document.getElementById(fieldId).classList.add("input-error");
  document.getElementById(`${fieldId}-error`).textContent = message;
}

form.addEventListener("submit", (e) => {
  e.preventDefault(); // stop the page from reloading, since this is a static site

  successMsg.textContent = "";
  let isValid = true;

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  ["name", "email", "message"].forEach(clearError);

  if (name.length < 2) {
    showError("name", "Please enter your full name.");
    isValid = false;
  }

  // Simple pattern: something@something.something
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    showError("email", "Please enter a valid email address.");
    isValid = false;
  }

  if (message.length < 10) {
    showError("message", "Your message should be at least 10 characters.");
    isValid = false;
  }

  if (!isValid) return;

  // In a real backend this is where we'd send the data.
  // Since the site is fully static, we just confirm to the user and reset the form.
  successMsg.textContent = `Thanks, ${name} — we'll get back to you soon.`;
  form.reset();
});
