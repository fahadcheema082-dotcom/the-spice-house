// ============================================
// ============================================
// ADMIN PANEL - COMPLETE FUNCTIONALITY
// ============================================
// ============================================

// ============ CREDENTIALS ============
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

// ============ DOM ELEMENTS ============
const loginScreen = document.getElementById("loginScreen");
const adminContainer = document.getElementById("adminContainer");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const logoutBtn = document.getElementById("logoutBtn");

const menuItems = document.querySelectorAll(".menu-item[data-page]");
const pageContents = document.querySelectorAll(".page-content");
const pageTitle = document.getElementById("pageTitle");
const pageSubtitle = document.getElementById("pageSubtitle");

// Toast
const adminToast = document.getElementById("adminToast");
const adminToastMessage = document.getElementById("adminToastMessage");

// ============================================
// CHECK IF ALREADY LOGGED IN
// ============================================
window.addEventListener("DOMContentLoaded", function () {
  const isLoggedIn = localStorage.getItem("adminLoggedIn");

  if (isLoggedIn === "true") {
    showAdminPanel();
  }
});

// ============================================
// LOGIN FUNCTIONALITY
// ============================================
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    localStorage.setItem("adminLoggedIn", "true");
    loginError.classList.remove("show");
    showAdminPanel();
    showToast("Welcome back, Admin! 🎉");
  } else {
    loginError.classList.add("show");
    setTimeout(function () {
      loginError.classList.remove("show");
    }, 3000);
  }
});

// ============================================
// SHOW ADMIN PANEL
// ============================================
function showAdminPanel() {
  loginScreen.classList.add("hide");
  adminContainer.classList.add("show");
  loadDashboardData();
}

// ============================================
// LOGOUT
// ============================================
logoutBtn.addEventListener("click", function () {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("adminLoggedIn");
    location.reload();
  }
});

// ============================================
// PAGE NAVIGATION
// ============================================
const pageInfo = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Welcome back, Admin!",
  },
  reservations: {
    title: "Reservations",
    subtitle: "Manage all table bookings",
  },
  orders: {
    title: "Orders",
    subtitle: "Manage customer orders",
  },
  menu: {
    title: "Menu Management",
    subtitle: "Add, edit or delete menu items",
  },
};

menuItems.forEach(function (item) {
  item.addEventListener("click", function (e) {
    e.preventDefault();

    // Remove active from all
    menuItems.forEach(function (i) {
      i.classList.remove("active");
    });

    // Add active to clicked
    item.classList.add("active");

    // Get page name
    const pageName = item.getAttribute("data-page");

    // Hide all pages
    pageContents.forEach(function (page) {
      page.classList.remove("active");
    });

    // Show selected page
    const pageId = pageName + "Page";
    const activePage = document.getElementById(pageId);
    if (activePage) {
      activePage.classList.add("active");
    }

    // Update header
    if (pageInfo[pageName]) {
      pageTitle.textContent = pageInfo[pageName].title;
      pageSubtitle.textContent = pageInfo[pageName].subtitle;
    }

    // Load data for that page
    if (pageName === "dashboard") loadDashboardData();
    if (pageName === "reservations") loadReservations();
    if (pageName === "orders") loadOrders();
    if (pageName === "menu") loadMenuItems();
  });
});

// ============================================
// DASHBOARD DATA
// ============================================
function loadDashboardData() {
  const reservations = JSON.parse(localStorage.getItem("spiceReservations")) || [];
  const cart = JSON.parse(localStorage.getItem("spiceCart")) || [];
  const menuItems = JSON.parse(localStorage.getItem("spiceMenuItems")) || getDefaultMenu();

  // Update Stats
  document.getElementById("totalReservations").textContent = reservations.length;
  document.getElementById("totalOrders").textContent = cart.length;
  document.getElementById("totalMenuItems").textContent = menuItems.length;

  // Calculate Revenue
  const revenue = cart.reduce(function (sum, item) {
    return sum + item.price * item.quantity;
  }, 0);
  document.getElementById("totalRevenue").textContent = "$" + revenue.toFixed(2);

  // Update Badges
  document.getElementById("reservationBadge").textContent = reservations.length;
  document.getElementById("orderBadge").textContent = cart.length;

  // Recent Reservations
  const recentRes = document.getElementById("recentReservations");
  if (reservations.length === 0) {
    recentRes.innerHTML = '<p class="empty-message">No reservations yet</p>';
  } else {
    let html = "";
    const recent = reservations.slice(-5).reverse();
    recent.forEach(function (r) {
      html += `
        <div class="activity-item">
          <div class="activity-info">
            <h4>${r.name}</h4>
            <p>${r.date} at ${r.time} • ${r.guests} guests</p>
          </div>
          <span class="activity-badge">${r.id}</span>
        </div>
      `;
    });
    recentRes.innerHTML = html;
  }

  // Recent Orders
  const recentOrd = document.getElementById("recentOrders");
  if (cart.length === 0) {
    recentOrd.innerHTML = '<p class="empty-message">No orders yet</p>';
  } else {
    let html = "";
    cart.forEach(function (item) {
      html += `
        <div class="activity-item">
          <div class="activity-info">
            <h4>${item.name}</h4>
            <p>Quantity: ${item.quantity}</p>
          </div>
          <span class="activity-badge">$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      `;
    });
    recentOrd.innerHTML = html;
  }
}

// ============================================
// RESERVATIONS PAGE
// ============================================
function loadReservations() {
  const reservations = JSON.parse(localStorage.getItem("spiceReservations")) || [];
  const table = document.getElementById("reservationsTable");

  if (reservations.length === 0) {
    table.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:40px;color:#666;">No reservations found</td></tr>';
    return;
  }

  let html = "";
  reservations.forEach(function (r, index) {
    html += `
      <tr>
        <td><span class="id-badge">${r.id}</span></td>
        <td><strong>${r.name}</strong></td>
        <td>${r.date}</td>
        <td>${r.time}</td>
        <td>${r.guests}</td>
        <td>${r.phone}</td>
        <td>${r.email}</td>
        <td>${r.occasion}</td>
        <td>
          <button class="delete-btn" onclick="deleteReservation(${index})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });

  table.innerHTML = html;
}

// Delete Reservation
window.deleteReservation = function (index) {
  if (confirm("Delete this reservation?")) {
    const reservations = JSON.parse(localStorage.getItem("spiceReservations")) || [];
    reservations.splice(index, 1);
    localStorage.setItem("spiceReservations", JSON.stringify(reservations));
    loadReservations();
    loadDashboardData();
    showToast("Reservation deleted!");
  }
};

// Search Reservations
const reservationSearch = document.getElementById("reservationSearch");
if (reservationSearch) {
  reservationSearch.addEventListener("input", function () {
    const query = this.value.toLowerCase();
    const rows = document.querySelectorAll("#reservationsTable tr");
    rows.forEach(function (row) {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(query) ? "" : "none";
    });
  });
}

// Clear All Reservations
document.getElementById("clearAllReservations").addEventListener("click", function () {
  if (confirm("Delete ALL reservations? This cannot be undone!")) {
    localStorage.removeItem("spiceReservations");
    loadReservations();
    loadDashboardData();
    showToast("All reservations cleared!");
  }
});

// ============================================
// ORDERS PAGE
// ============================================
function loadOrders() {
  const cart = JSON.parse(localStorage.getItem("spiceCart")) || [];
  const list = document.getElementById("ordersList");

  if (cart.length === 0) {
    list.innerHTML = '<p class="empty-message">No active orders</p>';
    return;
  }

  let html = "";
  cart.forEach(function (item, index) {
    html += `
      <div class="order-card">
        <div class="order-header">
          <h3>${item.name}</h3>
          <button class="delete-btn" onclick="deleteOrder(${index})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <div class="order-items">
          <div class="order-item">
            <span>Quantity:</span>
            <strong>${item.quantity}</strong>
          </div>
          <div class="order-item">
            <span>Price per item:</span>
            <strong>$${item.price.toFixed(2)}</strong>
          </div>
        </div>
        <div class="order-total">
          <span>Total:</span>
          <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      </div>
    `;
  });

  list.innerHTML = html;
}

// Delete Order
window.deleteOrder = function (index) {
  if (confirm("Remove this order?")) {
    const cart = JSON.parse(localStorage.getItem("spiceCart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("spiceCart", JSON.stringify(cart));
    loadOrders();
    loadDashboardData();
    showToast("Order removed!");
  }
};

// Clear All Orders
document.getElementById("clearAllOrders").addEventListener("click", function () {
  if (confirm("Clear all orders?")) {
    localStorage.removeItem("spiceCart");
    loadOrders();
    loadDashboardData();
    showToast("All orders cleared!");
  }
});

// ============================================
// MENU MANAGEMENT
// ============================================

// Default menu items
function getDefaultMenu() {
  return [
    {
      id: 1,
      name: "Margherita Pizza",
      price: 12.99,
      category: "popular",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500",
      description: "Fresh mozzarella, tomatoes, basil on wood-fired crust",
    },
    {
      id: 2,
      name: "Gourmet Burger",
      price: 15.99,
      category: "new",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
      description: "Juicy beef patty with special sauce and fresh veggies",
    },
    {
      id: 3,
      name: "Grilled Chicken",
      price: 18.99,
      category: "hot",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500",
      description: "Tender grilled chicken with herbs and seasonal vegetables",
    },
  ];
}

function loadMenuItems() {
  let items = JSON.parse(localStorage.getItem("spiceMenuItems"));

  if (!items) {
    items = getDefaultMenu();
    localStorage.setItem("spiceMenuItems", JSON.stringify(items));
  }

  const grid = document.getElementById("menuItemsGrid");

  if (items.length === 0) {
    grid.innerHTML = '<p class="empty-message">No menu items. Add one!</p>';
    return;
  }

  let html = "";
  items.forEach(function (item, index) {
    html += `
      <div class="menu-item-card">
        <div class="menu-item-image">
          <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/300x180?text=No+Image'">
        </div>
        <div class="menu-item-info">
          <h3>${item.name}</h3>
          <div class="menu-item-price">$${item.price.toFixed(2)}</div>
          <p class="menu-item-desc">${item.description}</p>
          <div class="menu-item-actions">
            <button class="edit-btn" onclick="editMenuItem(${index})">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="delete-btn" onclick="deleteMenuItem(${index})" style="width:100%;">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

// ============================================
// MENU MODAL
// ============================================
const menuModal = document.getElementById("menuModal");
const menuModalOverlay = document.getElementById("menuModalOverlay");
const menuModalClose = document.getElementById("menuModalClose");
const addMenuBtn = document.getElementById("addMenuBtn");
const menuForm = document.getElementById("menuForm");
const modalTitle = document.getElementById("modalTitle");

let editingIndex = -1;

// Open modal for ADD
addMenuBtn.addEventListener("click", function () {
  editingIndex = -1;
  modalTitle.textContent = "Add New Dish";
  menuForm.reset();
  openMenuModal();
});

// Open modal for EDIT
window.editMenuItem = function (index) {
  const items = JSON.parse(localStorage.getItem("spiceMenuItems")) || [];
  const item = items[index];

  editingIndex = index;
  modalTitle.textContent = "Edit Dish";

  document.getElementById("dishName").value = item.name;
  document.getElementById("dishPrice").value = item.price;
  document.getElementById("dishCategory").value = item.category;
  document.getElementById("dishImage").value = item.image;
  document.getElementById("dishDescription").value = item.description;

  openMenuModal();
};

// Delete menu item
window.deleteMenuItem = function (index) {
  if (confirm("Delete this dish?")) {
    const items = JSON.parse(localStorage.getItem("spiceMenuItems")) || [];
    items.splice(index, 1);
    localStorage.setItem("spiceMenuItems", JSON.stringify(items));
    loadMenuItems();
    loadDashboardData();
    showToast("Dish deleted!");
  }
};

function openMenuModal() {
  menuModal.classList.add("active");
  menuModalOverlay.classList.add("active");
}

function closeMenuModal() {
  menuModal.classList.remove("active");
  menuModalOverlay.classList.remove("active");
}

menuModalClose.addEventListener("click", closeMenuModal);
menuModalOverlay.addEventListener("click", closeMenuModal);

// Save menu item
menuForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const items = JSON.parse(localStorage.getItem("spiceMenuItems")) || [];

  const newItem = {
    id: Date.now(),
    name: document.getElementById("dishName").value.trim(),
    price: parseFloat(document.getElementById("dishPrice").value),
    category: document.getElementById("dishCategory").value,
    image: document.getElementById("dishImage").value.trim(),
    description: document.getElementById("dishDescription").value.trim(),
  };

  if (editingIndex === -1) {
    items.push(newItem);
    showToast("Dish added successfully!");
  } else {
    items[editingIndex] = newItem;
    showToast("Dish updated successfully!");
  }

  localStorage.setItem("spiceMenuItems", JSON.stringify(items));
  loadMenuItems();
  loadDashboardData();
  closeMenuModal();
  menuForm.reset();
});

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(message) {
  adminToastMessage.textContent = message;
  adminToast.classList.add("show");

  setTimeout(function () {
    adminToast.classList.remove("show");
  }, 3000);
}

// ============================================
// INITIAL LOAD
// ============================================
console.log(
  "%c🔐 Admin Panel Loaded — The Spice House 🍽️",
  "color: #C0392B; font-size: 18px; font-weight: bold;"
);