// ============================================
// 1. NAVBAR SCROLL EFFECT
// Jab user scroll kare - Navbar white ho jaye
// ============================================

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", function () {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});


// ============================================
// 2. HAMBURGER MENU TOGGLE
// Mobile mein menu open/close
// ============================================

const hamburger = document.getElementById("hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", function () {
  navMenu.classList.toggle("active");
});

// Menu link click hone par menu close ho jaye
const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    navMenu.classList.remove("active");
  });
});


// ============================================
// 3. ACTIVE NAV LINK ON SCROLL
// Jis section pe ho - us link ka underline ho
// ============================================

const sections = document.querySelectorAll("section");

window.addEventListener("scroll", function () {
  let current = "";

  sections.forEach(function (section) {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.clientHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(function (link) {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});


// ============================================
// 4. SCROLL TO TOP BUTTON
// Neeche scroll par button show, click par top
// ============================================

const scrollTopBtn = document.getElementById("scrollTop");

// Show/Hide button on scroll
window.addEventListener("scroll", function () {
  if (window.scrollY > 500) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }
});

// Click par top par jao
scrollTopBtn.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});


// ============================================
// 5. CONTACT FORM SUBMIT
// Form submit karne par thank you message
// ============================================

const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Page reload rokna

  // Form fields ki values lelo
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const message = document.getElementById("message").value;

  // Console mein data show karo (developer ke liye)
  console.log("Form Submitted!");
  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Phone:", phone);
  console.log("Message:", message);

  // User ko thank you message dikhao
  alert(
    "🎉 Thank you " + name + "!\n\n" +
    "Your message has been received successfully.\n" +
    "We will contact you soon at " + email + "\n\n" +
    "- The Spice House Team 🍽️"
  );

  // Form clear karo
  contactForm.reset();
});


// ============================================
// 7. NEWSLETTER FORM SUBMIT
// Footer wala newsletter form
// ============================================

const newsletterForm = document.querySelector(".newsletter-form");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector("input");
    alert("✅ Thanks for subscribing!\nWe'll send updates to: " + emailInput.value);
    emailInput.value = "";
  });
}


// ============================================
// 8. SCROLL REVEAL ANIMATION
// Sections smoothly appear jab scroll ho
// ============================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

// Har section ko observe karo
document.querySelectorAll("section").forEach(function (section) {
  section.classList.add("fade-in");
  observer.observe(section);
});


// ============================================
// 9. WELCOME CONSOLE MESSAGE
// Developer ke liye greeting
// ============================================

console.log(
  "%c🍽️ Welcome to The Spice House! 🍽️",
  "color: #C0392B; font-size: 24px; font-weight: bold;"
);
console.log(
  "%cWebsite crafted with ❤️ by Fahad Cheema",
  "color: #F4D03F; font-size: 16px;"
);
// ============================================
// ============================================
// CART SYSTEM - COMPLETE LOGIC
// ============================================
// ============================================

// ============ CART VARIABLES ============
let cart = JSON.parse(localStorage.getItem("spiceCart")) || [];

// ============ DOM ELEMENTS ============
const cartIcon = document.getElementById("cartIcon");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const cartClose = document.getElementById("cartClose");
const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartFooter = document.getElementById("cartFooter");
const cartBadge = document.getElementById("cartBadge");
const totalPrice = document.getElementById("totalPrice");
const checkoutBtn = document.getElementById("checkoutBtn");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

// ============================================
// OPEN CART SIDEBAR
// ============================================
cartIcon.addEventListener("click", function () {
  cartSidebar.classList.add("active");
  cartOverlay.classList.add("active");
  document.body.style.overflow = "hidden"; // Scroll rokne ke liye
});

// ============================================
// CLOSE CART SIDEBAR
// ============================================
function closeCart() {
  cartSidebar.classList.remove("active");
  cartOverlay.classList.remove("active");
  document.body.style.overflow = "auto";
}

cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// ============================================
// ADD ITEM TO CART (Order Now Button)
// ============================================
// Cart System - Order Now Buttons (Clean Version)
document.querySelectorAll(".dish-btn").forEach(function (button) {
  button.addEventListener("click", function () {
    // Dish ka data nikalo
    const dishCard = button.closest(".dish-card");
    const dishName = dishCard.querySelector("h3").textContent;
    const dishPriceText = dishCard.querySelector(".dish-price").textContent;
    const dishPrice = parseFloat(dishPriceText.replace("$", ""));
    const dishImage = dishCard.querySelector("img").src;

    // Item object banao
    const item = {
      id: dishName.toLowerCase().replace(/\s+/g, "-"),
      name: dishName,
      price: dishPrice,
      image: dishImage,
      quantity: 1,
    };

    addToCart(item);
  });
});

// ============================================
// ADD TO CART FUNCTION
// ============================================
function addToCart(item) {
  // Check karo item pehle se cart mein hai kya
  const existingItem = cart.find(function (cartItem) {
    return cartItem.id === item.id;
  });

  if (existingItem) {
    // Agar hai to quantity badhao
    existingItem.quantity += 1;
    showToast(item.name + " quantity increased!");
  } else {
    // Nahi hai to naya add karo
    cart.push(item);
    showToast(item.name + " added to cart!");
  }

  // Sab kuch update karo
  saveCart();
  updateCartUI();
  animateBadge();
}

// ============================================
// REMOVE FROM CART
// ============================================
function removeFromCart(itemId) {
  cart = cart.filter(function (item) {
    return item.id !== itemId;
  });
  saveCart();
  updateCartUI();
  showToast("Item removed from cart", "error");
}

// ============================================
// UPDATE QUANTITY (+ or -)
// ============================================
function updateQuantity(itemId, change) {
  const item = cart.find(function (cartItem) {
    return cartItem.id === itemId;
  });

  if (item) {
    item.quantity += change;

    // Agar quantity 0 ho jaye to remove karo
    if (item.quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    saveCart();
    updateCartUI();
  }
}

// ============================================
// SAVE CART TO LOCAL STORAGE
// ============================================
function saveCart() {
  localStorage.setItem("spiceCart", JSON.stringify(cart));
}

// ============================================
// UPDATE CART UI (Cart Sidebar mein items dikhaye)
// ============================================
function updateCartUI() {
  // Cart badge update karo
  const totalItems = cart.reduce(function (sum, item) {
    return sum + item.quantity;
  }, 0);
  cartBadge.textContent = totalItems;

  // Empty state ya items dikhaye
  if (cart.length === 0) {
    cartEmpty.style.display = "block";
    cartFooter.classList.remove("active");
    // Purani items hata do
    const oldItems = cartItems.querySelectorAll(".cart-item");
    oldItems.forEach(function (item) {
      item.remove();
    });
  } else {
    cartEmpty.style.display = "none";
    cartFooter.classList.add("active");

    // Purani items hata do
    const oldItems = cartItems.querySelectorAll(".cart-item");
    oldItems.forEach(function (item) {
      item.remove();
    });

    // Nayi items dikhao
    cart.forEach(function (item) {
      const itemHTML = `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            <div class="cart-item-controls">
              <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">
                <i class="fas fa-minus"></i>
              </button>
              <span class="qty-value">${item.quantity}</span>
              <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      `;
      cartItems.insertAdjacentHTML("beforeend", itemHTML);
    });

    // Total price update karo
    const total = cart.reduce(function (sum, item) {
      return sum + item.price * item.quantity;
    }, 0);
    totalPrice.textContent = "$" + total.toFixed(2);
  }
}

// ============================================
// BADGE ANIMATION
// ============================================
function animateBadge() {
  cartBadge.classList.add("pulse");
  setTimeout(function () {
    cartBadge.classList.remove("pulse");
  }, 500);
}

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(message, type = "success") {
  toastMessage.textContent = message;

  // Success ya error styling
  if (type === "error") {
    toast.classList.add("error");
  } else {
    toast.classList.remove("error");
  }

  toast.classList.add("show");

  // 3 second baad hide karo
  setTimeout(function () {
    toast.classList.remove("show");
  }, 3000);
}

// ============================================
// CHECKOUT BUTTON
// ============================================
checkoutBtn.addEventListener("click", function () {
  if (cart.length === 0) {
    showToast("Cart is empty!", "error");
    return;
  }

  const total = cart.reduce(function (sum, item) {
    return sum + item.price * item.quantity;
  }, 0);

  let orderSummary = "🎉 Order Confirmation\n\n";
  orderSummary += "Items:\n";
  cart.forEach(function (item) {
    orderSummary += "• " + item.name + " x" + item.quantity + " = $" + (item.price * item.quantity).toFixed(2) + "\n";
  });
  orderSummary += "\nTotal: $" + total.toFixed(2);
  orderSummary += "\n\nThank you for your order!\n- The Spice House 🍽️";

  alert(orderSummary);

  // Cart clear karo
  cart = [];
  saveCart();
  updateCartUI();
  closeCart();
  showToast("Order placed successfully! 🎉");
});

// ============================================
// INITIAL LOAD - Cart data localStorage se load karo
// ============================================
updateCartUI();

// Global functions banao (HTML mein onclick use ho raha hai)
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
// ============================================
// ============================================
// MENU SEARCH & FILTER SYSTEM
// ============================================
// ============================================

// ============ DOM ELEMENTS ============
const searchInput = document.getElementById("searchInput");
const searchClear = document.getElementById("searchClear");
const filterButtons = document.querySelectorAll(".filter-btn");
const dishCards = document.querySelectorAll(".dish-card");
const noResults = document.getElementById("noResults");

// ============ CURRENT FILTER STATE ============
let currentFilter = "all";
let currentSearch = "";

// ============================================
// SEARCH FUNCTIONALITY
// ============================================
searchInput.addEventListener("input", function () {
  currentSearch = searchInput.value.toLowerCase().trim();

  // Clear button show/hide karo
  if (currentSearch.length > 0) {
    searchClear.classList.add("show");
  } else {
    searchClear.classList.remove("show");
  }

  filterDishes();
});

// ============================================
// CLEAR SEARCH
// ============================================
searchClear.addEventListener("click", function () {
  searchInput.value = "";
  currentSearch = "";
  searchClear.classList.remove("show");
  filterDishes();
});

// ============================================
// FILTER BUTTONS
// ============================================
filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    // Remove active from all
    filterButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });

    // Add active to clicked
    button.classList.add("active");

    // Update current filter
    currentFilter = button.getAttribute("data-filter");

    filterDishes();
  });
});

// ============================================
// MAIN FILTER FUNCTION
// ============================================
function filterDishes() {
  let visibleCount = 0;

  dishCards.forEach(function (card) {
    const dishName = card.querySelector("h3").textContent.toLowerCase();
    const dishDescription = card.querySelector("p").textContent.toLowerCase();
    const dishCategory = card.getAttribute("data-category");

    // Check search match
    const matchesSearch =
      currentSearch === "" ||
      dishName.includes(currentSearch) ||
      dishDescription.includes(currentSearch);

    // Check filter match
    const matchesFilter =
      currentFilter === "all" || dishCategory === currentFilter;

    // Agar dono match hote hain to show karo
    if (matchesSearch && matchesFilter) {
      card.classList.remove("hidden");
      // Animation dobara chalane ke liye
      card.style.animation = "none";
      setTimeout(function () {
        card.style.animation = "fadeInCard 0.4s ease";
      }, 10);
      visibleCount++;
    } else {
      card.classList.add("hidden");
    }
  });

  // No results message show/hide karo
  if (visibleCount === 0) {
    noResults.classList.add("show");
  } else {
    noResults.classList.remove("show");
  }
}

// ============================================
// INITIAL LOAD
// ============================================
filterDishes();
// ============================================
// ============================================
// RESERVATION MODAL SYSTEM
// ============================================
// ============================================

// ============ DOM ELEMENTS ============
const reserveBtn1 = document.getElementById("reserveBtn1");
const reserveBtn2 = document.getElementById("reserveBtn2");
const reservationOverlay = document.getElementById("reservationOverlay");
const reservationModal = document.getElementById("reservationModal");
const modalClose = document.getElementById("modalClose");
const reservationForm = document.getElementById("reservationForm");

const resDate = document.getElementById("resDate");
const resTime = document.getElementById("resTime");
const resGuests = document.getElementById("resGuests");
const resOccasion = document.getElementById("resOccasion");
const resName = document.getElementById("resName");
const resPhone = document.getElementById("resPhone");
const resEmail = document.getElementById("resEmail");
const resRequests = document.getElementById("resRequests");

// ============ MINIMUM DATE SET KARO ============
// User past date select na kar sake
const today = new Date().toISOString().split("T")[0];
resDate.setAttribute("min", today);

// ============ OPEN MODAL FUNCTION ============
function openReservationModal() {
  reservationOverlay.classList.add("active");
  reservationModal.classList.add("active");
  document.body.classList.add("modal-open");
}

// ============ CLOSE MODAL FUNCTION ============
function closeReservationModal() {
  reservationOverlay.classList.remove("active");
  reservationModal.classList.remove("active");
  document.body.classList.remove("modal-open");
}

// ============ BUTTON EVENTS ============
if (reserveBtn1) {
  reserveBtn1.addEventListener("click", openReservationModal);
}

if (reserveBtn2) {
  reserveBtn2.addEventListener("click", openReservationModal);
}

modalClose.addEventListener("click", closeReservationModal);
reservationOverlay.addEventListener("click", closeReservationModal);

// Escape key press par modal close
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeReservationModal();
  }
});

// ============ RESERVATION ID GENERATOR ============
function generateReservationId() {
  const randomNumber = Math.floor(10000 + Math.random() * 90000);
  return "TSH-" + randomNumber;
}

// ============ SAVE RESERVATION TO LOCAL STORAGE ============
function saveReservation(reservation) {
  const reservations =
    JSON.parse(localStorage.getItem("spiceReservations")) || [];

  reservations.push(reservation);

  localStorage.setItem("spiceReservations", JSON.stringify(reservations));
}

// ============ FORM SUBMIT ============
reservationForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const reservationId = generateReservationId();

  const reservationData = {
    id: reservationId,
    date: resDate.value,
    time: resTime.value,
    guests: resGuests.value,
    occasion: resOccasion.value,
    name: resName.value.trim(),
    phone: resPhone.value.trim(),
    email: resEmail.value.trim(),
    requests: resRequests.value.trim(),
    createdAt: new Date().toLocaleString(),
  };

  // Local Storage mein save karo
  saveReservation(reservationData);

  // Console mein developer ke liye show
  console.log("New Reservation:", reservationData);

  // Confirmation message
  alert(
    "🎉 Reservation Confirmed!\n\n" +
      "Reservation ID: " +
      reservationId +
      "\n" +
      "Name: " +
      reservationData.name +
      "\n" +
      "Date: " +
      reservationData.date +
      "\n" +
      "Time: " +
      reservationData.time +
      "\n" +
      "Guests: " +
      reservationData.guests +
      "\n\n" +
      "We have sent confirmation details to:\n" +
      reservationData.email +
      "\n\n" +
      "- The Spice House Team 🍽️"
  );

  // Toast notification bhi show karo agar function available hai
  if (typeof showToast === "function") {
    showToast("Reservation confirmed successfully! 🎉");
  }

  // Form clear karo
  reservationForm.reset();

  // Date ka min dobara set
  resDate.setAttribute("min", today);

  // Modal close karo
  closeReservationModal();
});
// ============================================
// ============================================
// DARK / LIGHT MODE TOGGLE
// ============================================
// ============================================

// ============ DOM ELEMENTS ============
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector("i");
const body = document.body;

// ============================================
// LOAD SAVED THEME (Page Load Par)
// ============================================
const savedTheme = localStorage.getItem("spiceTheme") || "light";

if (savedTheme === "dark") {
  body.classList.add("dark-mode");
  themeIcon.classList.remove("fa-moon");
  themeIcon.classList.add("fa-sun");
}

// ============================================
// THEME TOGGLE CLICK
// ============================================
themeToggle.addEventListener("click", function () {
  // Dark mode toggle karo
  body.classList.toggle("dark-mode");

  // Icon change karo
  if (body.classList.contains("dark-mode")) {
    // Dark mode ON - Sun icon dikhao
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");

    // Save karo
    localStorage.setItem("spiceTheme", "dark");

    // Toast notification
    if (typeof showToast === "function") {
      showToast("🌙 Dark Mode Activated!");
    }
  } else {
    // Light mode ON - Moon icon dikhao
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");

    // Save karo
    localStorage.setItem("spiceTheme", "light");

    // Toast notification
    if (typeof showToast === "function") {
      showToast("☀️ Light Mode Activated!");
    }
  }
});
// ============================================
// ============================================
// FINAL POLISH — LOADER, COUNTER, TYPEWRITER, PROGRESS
// ============================================
// ============================================

// ============================================
// 1. LOADING SCREEN
// ============================================
const loader = document.getElementById("loader");

window.addEventListener("load", function () {
  setTimeout(function () {
    loader.classList.add("hide");
  }, 1500); // 1.5 second baad hide
});

// ============================================
// 2. SCROLL PROGRESS BAR
// ============================================
const scrollProgress = document.getElementById("scrollProgress");

window.addEventListener("scroll", function () {
  const windowHeight =
    document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (window.scrollY / windowHeight) * 100;
  scrollProgress.style.width = scrolled + "%";
});

// ============================================
// 3. NUMBER COUNTER ANIMATION
// ============================================
const counters = document.querySelectorAll(".counter");

function animateCounter(counter) {
  const target = parseInt(counter.getAttribute("data-target"));
  const duration = 2000; // 2 second
  const step = target / (duration / 16); // 60fps
  let current = 0;

  const timer = setInterval(function () {
    current += step;

    if (current >= target) {
      counter.textContent = target + "+";
      clearInterval(timer);
    } else {
      counter.textContent = Math.floor(current) + "+";
    }
  }, 16);
}

// Intersection Observer - jab counter view mein aaye tab animate ho
const counterObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target); // Sirf ek baar animate ho
      }
    });
  },
  { threshold: 0.5 }
);

counters.forEach(function (counter) {
  counterObserver.observe(counter);
});

// ============================================
// 4. TYPEWRITER EFFECT
// ============================================
const typewriterElement = document.getElementById("typewriter");

if (typewriterElement) {
  const words = ["Authentic", "Delicious", "Premium", "Amazing"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeWriter() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      // Delete karo
      typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Type karo
      typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typingSpeed = isDeleting ? 80 : 150;

    // Word complete ho gaya
    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 2000; // 2 second wait
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500;
    }

    setTimeout(typeWriter, typingSpeed);
  }

  // Loader hide hone ke baad start karo
  setTimeout(function () {
    typeWriter();
  }, 2000);
}