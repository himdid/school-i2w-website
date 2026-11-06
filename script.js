/* ==========================================================================
   North Star Bakery - Client-Side Interactivity, Storage & Form Validation
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initMenuFiltering();
  initFormValidation();
});

/* Interactive Menu Filter with LocalStorage Persistence */

// Array of objects defining the bakery menu data structure
const bakeryCatalog = [
  {
    id: 1,
    name: "Signature Sourdough",
    category: "breads",
    price: "$8.50",
    description: "A classic round loaf with a crisp crust and a soft, tangy center."
  },
  {
    id: 2,
    name: "Seeded Rye Loaf",
    category: "breads",
    price: "$9.00",
    description: "Hearty rye bread mixed with sunflower and flax seeds."
  },
  {
    id: 3,
    name: "French Baguette",
    category: "breads",
    price: "$4.25",
    description: "Traditional long loaf with a golden crust, baked throughout the morning."
  },
  {
    id: 4,
    name: "Butter Croissant",
    category: "pastries",
    price: "$4.50",
    description: "Flaky pastry made with layered real butter."
  },
  {
    id: 5,
    name: "Chocolate Croissant",
    category: "pastries",
    price: "$5.25",
    description: "Our traditional flaky croissant filled with rich dark chocolate."
  },
  {
    id: 6,
    name: "Fruit Galette",
    category: "pastries",
    price: "$6.00",
    description: "Open pastry crust filled with seasonal baked fruit."
  },
  {
    id: 7,
    name: "Olive Oil Lemon Cake",
    category: "cakes",
    price: "$18.00 whole loaf / $4.00 slice",
    description: "A moist loaf cake flavored with fresh lemon juice and olive oil."
  },
  {
    id: 8,
    name: "Custom Event Cakes",
    category: "cakes",
    price: "$45.00 to $85.00 depending on size",
    description: "Layered cakes for birthdays and events. Contact us ahead of time to discuss flavors."
  }
];

function initMenuFiltering() {
  const productContainer = document.getElementById("product-list");
  const filterButtons = document.querySelectorAll(".filter-btn");

  if (!productContainer || filterButtons.length === 0) return;

  // Retrieve stored category preference from localStorage or fall back to 'all'
  const savedCategory = localStorage.getItem("northstar_menu_category") || "all";

  // Initial render based on retrieved client storage
  renderProducts(savedCategory, productContainer);
  updateActiveFilterButton(savedCategory, filterButtons);

  // Bind click event listeners to category filter buttons
  filterButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const selectedCategory = event.target.getAttribute("data-category");

      // Save user choice to browser storage
      localStorage.setItem("northstar_menu_category", selectedCategory);

      // Dynamically update view
      renderProducts(selectedCategory, productContainer);
      updateActiveFilterButton(selectedCategory, filterButtons);
    });
  });
}

function renderProducts(category, container) {
  container.innerHTML = "";

  const filteredItems = category === "all"
    ? bakeryCatalog
    : bakeryCatalog.filter((item) => item.category === category);

  filteredItems.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card product-card";
    card.innerHTML = `
      <h3>${item.name}</h3>
      <p class="product-price">${item.price}</p>
      <p>${item.description}</p>
      <span class="badge badge-${item.category}">${item.category.toUpperCase()}</span>
    `;
    container.appendChild(card);
  });
}

function updateActiveFilterButton(activeCategory, buttons) {
  buttons.forEach((btn) => {
    if (btn.getAttribute("data-category") === activeCategory) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

/* Form Validation with Specific Error Feedback */

function initFormValidation() {
  const form = document.getElementById("order-form");
  if (!form) return;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const feedbackBox = document.getElementById("form-feedback");
  const resetBtn = document.getElementById("reset-btn");

  form.addEventListener("submit", (event) => {
    // Prevent default page reload on form submit
    event.preventDefault();

    // Reset previous errors
    clearValidationErrors();

    let formIsValid = true;

    // Rule 1: Required Name Check & Length Threshold
    const nameVal = nameInput.value.trim();
    if (nameVal === "") {
      displayFieldError("name-error", "Full name is required.");
      formIsValid = false;
    } else if (nameVal.length < 2) {
      displayFieldError("name-error", "Name must be at least 2 characters long.");
      formIsValid = false;
    }

    // Rule 2: Email Format Pattern Check
    const emailVal = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailVal === "") {
      displayFieldError("email-error", "Email address is required.");
      formIsValid = false;
    } else if (!emailRegex.test(emailVal)) {
      displayFieldError("email-error", "Please enter a valid email address (e.g., name@example.com).");
      formIsValid = false;
    }

    // Process Submission Outcome
    if (formIsValid) {
      feedbackBox.className = "status-message status-success";
      feedbackBox.textContent = `Thank you, ${nameVal}! Your request has been recorded. We will contact you at ${emailVal}.`;
      form.reset();
    } else {
      feedbackBox.className = "status-message status-error";
      feedbackBox.textContent = "Please correct the highlighted errors before submitting.";
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      clearValidationErrors();
      feedbackBox.className = "status-message";
      feedbackBox.textContent = "";
    });
  }
}

function displayFieldError(targetId, message) {
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    targetElement.textContent = message;
    targetElement.style.display = "block";
  }
}

function clearValidationErrors() {
  const errors = document.querySelectorAll(".error-msg");
  errors.forEach((err) => {
    err.textContent = "";
    err.style.display = "none";
  });
}