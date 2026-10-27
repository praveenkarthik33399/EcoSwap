
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const IMAGES = {
  fashion: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=650&q=80",
  jacket: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=650&q=80",
  bag: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=650&q=80",
  camera: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=650&q=80",
  headphones: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=650&q=80",
  books: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=650&q=80",
  chair: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=650&q=80",
  lamp: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=650&q=80",
  plant: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=650&q=80",
  watch: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=650&q=80",
  sneakers: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=650&q=80",
  desk: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=650&q=80"
};

const starterProducts = [
  { id:"p1", name:"The Everyday Denim Jacket", category:"Fashion", condition:"Good", price:899, oldPrice:1799, location:"Bengaluru", seller:"Ananya", image:IMAGES.jacket, description:"A timeless denim layer with plenty of life left. Check measurements and condition with the seller before buying.", badge:"GOOD FIND", featured:true },
  { id:"p2", name:"Studio Wireless Headphones", category:"Electronics", condition:"Like New", price:1499, oldPrice:2999, location:"Hyderabad", seller:"Rohan", image:IMAGES.headphones, description:"A pre-loved audio companion for study sessions, commutes and everyday listening. Ask about battery life and included accessories.", badge:"LIKE NEW", featured:true },
  { id:"p3", name:"Little Library — Book Set", category:"Books", condition:"Good", price:399, oldPrice:750, location:"Chennai", seller:"Meera", image:IMAGES.books, description:"A small stack of stories waiting for their next reader. Message the seller to confirm which titles are included.", badge:"BOOK NOOK", featured:true },
  { id:"p4", name:"The Slow Living Chair", category:"Furniture", condition:"Good", price:2400, oldPrice:4200, location:"Pune", seller:"Ishaan", image:IMAGES.chair, description:"A simple accent chair for a reading corner or a quiet afternoon. Confirm dimensions and collection arrangements first.", badge:"CHARACTER PIECE", featured:true },
  { id:"p5", name:"Weekend Camera Companion", category:"Electronics", condition:"Good", price:3200, oldPrice:5500, location:"Mumbai", seller:"Kabir", image:IMAGES.camera, description:"A secondhand camera for creative adventures. Ask the seller to demonstrate that it works and explain what is included.", badge:"CREATIVE FIND", featured:false },
  { id:"p6", name:"The Little Everyday Tote", category:"Fashion", condition:"Like New", price:550, oldPrice:1100, location:"Delhi", seller:"Sana", image:IMAGES.bag, description:"An easy everyday bag with a simple, versatile look. Check the size, material and any signs of wear with the seller.", badge:"EASY CLASSIC", featured:false },
  { id:"p7", name:"Soft Glow Table Lamp", category:"Home", condition:"Good", price:750, oldPrice:1400, location:"Kochi", seller:"Diya", image:IMAGES.lamp, description:"A warm light for a desk, bedside table or reading nook. Confirm the plug, bulb type and working condition.", badge:"WARM & COSY", featured:false },
  { id:"p8", name:"A Tiny Indoor Jungle", category:"Home", condition:"Like New", price:299, oldPrice:499, location:"Jaipur", seller:"Aarav", image:IMAGES.plant, description:"A little green addition for a shelf or sunny corner. Ask about the plant variety, pot and care requirements.", badge:"GREEN CORNER", featured:false },
  { id:"p9", name:"Classic Everyday Watch", category:"Other", condition:"Good", price:1199, oldPrice:2200, location:"Ahmedabad", seller:"Nisha", image:IMAGES.watch, description:"A clean everyday accessory. Confirm that the watch works, and ask about its strap, battery and any included box.", badge:"TIMELESS FIND", featured:false },
  { id:"p10", name:"Colour Pop Sneakers", category:"Fashion", condition:"Fair", price:650, oldPrice:1600, location:"Lucknow", seller:"Dev", image:IMAGES.sneakers, description:"Bright sneakers with more miles to go. Check the exact size, sole condition and photos before deciding.", badge:"BOLD & BRIGHT", featured:false },
  { id:"p11", name:"A Desk for New Ideas", category:"Furniture", condition:"Good", price:1800, oldPrice:3500, location:"Mysuru", seller:"Tara", image:IMAGES.desk, description:"A practical piece for a study space or creative corner. Confirm dimensions, stability and transport arrangements.", badge:"WORKSPACE FIND", featured:false },
  { id:"p12", name:"The Rewear Edit", category:"Fashion", condition:"Like New", price:499, oldPrice:999, location:"Visakhapatnam", seller:"Priya", image:IMAGES.fashion, description:"A versatile wardrobe find ready for another chapter. Ask the seller for exact measurements and fabric details.", badge:"STYLE AGAIN", featured:false }
];

function readStore(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    toast("Browser storage is unavailable. Changes may not persist.");
    return false;
  }
}

let customProducts = readStore("ecoswap_custom_products", []);
let products = [...customProducts, ...starterProducts];
let wishlist = readStore("ecoswap_wishlist", []);
let currentUser = readStore("ecoswap_demo_user", null);
let activeCategory = "All";
let activeAuthMode = "login";
let toastTimer;
let selectedProductId = null;

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  })[char]);
}

function safeImage(url) {
  try {
    const parsed = new URL(url, window.location.href);
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : "";
  } catch {
    return "";
  }
}

function money(value) {
  return "₹" + Number(value || 0).toLocaleString("en-IN");
}

function toast(message) {
  const node = $("#toast");
  node.textContent = message;
  node.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove("show"), 2600);
}

function saveWishlist() {
  writeStore("ecoswap_wishlist", wishlist);
  $("#wishCount").textContent = wishlist.length;
}

function renderHeader() {
  $("#wishCount").textContent = wishlist.length;
  $("#loginOpen").textContent = currentUser
    ? `Hi, ${currentUser.name.split(" ")[0]}`
    : "Sign in ↗";
}

function renderProducts() {
  const query = $("#searchInput").value.trim().toLowerCase();
  const condition = $("#conditionSelect").value;
  const sort = $("#sortSelect").value;

  let filtered = products.filter(product => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesCondition = condition === "All" || product.condition === condition;
    const searchText = [
      product.name, product.category, product.condition,
      product.location, product.seller, product.description
    ].join(" ").toLowerCase();
    return matchesCategory && matchesCondition && searchText.includes(query);
  });

  if (sort === "low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high") filtered.sort((a, b) => b.price - a.price);
  if (sort === "newest") filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  if (sort === "featured") filtered.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

  $("#resultCount").textContent = `${filtered.length} lovely ${filtered.length === 1 ? "find" : "finds"} to explore`;
  $("#impactListings").textContent = products.length.toLocaleString("en-IN");
  $("#emptyState").classList.toggle("hidden", filtered.length > 0);
  $("#productGrid").classList.toggle("hidden", filtered.length === 0);

  $("#productGrid").innerHTML = filtered.map((product, index) => {
    const image = safeImage(product.image) || IMAGES.plant;
    const saved = wishlist.includes(product.id);
    return `
      <article class="product-card" data-open-product="${escapeHTML(product.id)}" style="animation-delay:${Math.min(index * 35, 280)}ms">
        <div class="product-photo">
          <img src="${escapeHTML(image)}" alt="${escapeHTML(product.name)}" loading="lazy" onerror="this.onerror=null;this.src='${IMAGES.plant}'">
          <span class="product-tag">${escapeHTML(product.badge || product.condition.toUpperCase())}</span>
          <button class="wish-button ${saved ? "saved" : ""}" data-wish="${escapeHTML(product.id)}" aria-label="${saved ? "Remove from" : "Add to"} wishlist" aria-pressed="${saved}">${saved ? "♥" : "♡"}</button>
        </div>
        <div class="product-info">
          <div class="product-meta"><span>${escapeHTML(product.category.toUpperCase())}</span><span>${escapeHTML(product.condition)}</span></div>
          <h3 class="product-title">${escapeHTML(product.name)}</h3>
          <p class="product-description">${escapeHTML(product.description || "A pre-loved find ready for its next chapter.")}</p>
          <div class="product-price-row"><span class="product-price">${money(product.price)}</span>${product.oldPrice ? `<span class="product-old-price">${money(product.oldPrice)}</span>` : ""}</div>
          <div class="seller-line"><span class="seller-avatar">${escapeHTML((product.seller || "E").slice(0, 1).toUpperCase())}</span><span>${escapeHTML(product.seller || "EcoSwap seller")}</span><span>· ${escapeHTML(product.location || "India")}</span></div>
        </div>
      </article>`;
  }).join("");
}

function setCategory(category) {
  activeCategory = category;
  $$("#categoryFilters .chip").forEach(chip => {
    chip.classList.toggle("active", chip.dataset.category === category);
  });
  renderProducts();
}

function openDialog(dialog) {
  if (typeof dialog.showModal === "function") {
    if (!dialog.open) dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function closeDialog(dialog) {
  if (typeof dialog.close === "function") dialog.close();
  else dialog.removeAttribute("open");
}

function openDetails(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;
  selectedProductId = id;

  $("#detailContent").innerHTML = `
    <div class="detail-layout">
      <img class="detail-image" src="${escapeHTML(safeImage(product.image) || IMAGES.plant)}" alt="${escapeHTML(product.name)}" onerror="this.onerror=null;this.src='${IMAGES.plant}'">
      <div class="detail-copy">
        <span class="eyebrow">${escapeHTML(product.category.toUpperCase())} / SECOND LIFE</span>
        <h2>${escapeHTML(product.name)}</h2>
        <span class="detail-condition">${escapeHTML(product.condition)}</span>
        <span class="product-price">${money(product.price)}</span>
        <p>${escapeHTML(product.description || "A pre-loved item looking for a new home.")}</p>
        <p><strong>Seller</strong><br>${escapeHTML(product.seller || "EcoSwap seller")}</p>
        <p><strong>Location</strong><br>${escapeHTML(product.location || "India")}</p>
        <p class="detail-seller">Demo marketplace only. Contact, payment and delivery are not connected.</p>
        <button class="button button-dark button-full" id="detailWish">${wishlist.includes(id) ? "♥ Saved to wishlist" : "♡ Save this find"}</button>
        ${product.custom ? `<button class="button button-full" id="deleteListing">Remove my demo listing</button>` : ""}
      </div>
    </div>`;

  openDialog($("#detailModal"));

  $("#detailWish").addEventListener("click", () => {
    toggleWishlist(id);
    $("#detailWish").textContent = wishlist.includes(id) ? "♥ Saved to wishlist" : "♡ Save this find";
  });

  const deleteButton = $("#deleteListing");
  if (deleteButton) {
    deleteButton.addEventListener("click", () => {
      const mine = customProducts.find(item => item.id === id);
      if (!mine || !currentUser || mine.ownerEmail !== currentUser.email) {
        toast("Only the demo listing owner can remove this item.");
        return;
      }
      customProducts = customProducts.filter(item => item.id !== id);
      products = products.filter(item => item.id !== id);
      wishlist = wishlist.filter(item => item !== id);
      writeStore("ecoswap_custom_products", customProducts);
      saveWishlist();
      closeDialog($("#detailModal"));
      renderProducts();
      toast("Demo listing removed.");
    });
  }
}

function toggleWishlist(id) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(item => item !== id);
    toast("Removed from your wishlist.");
  } else {
    wishlist.push(id);
    toast("A lovely find saved for later ♥");
  }
  saveWishlist();
  renderProducts();
}

function showWishlist() {
  const savedProducts = products.filter(item => wishlist.includes(item.id));
  activeCategory = "All";
  $("#conditionSelect").value = "All";
  $("#searchInput").value = "";
  $("#sortSelect").value = "featured";
  setCategory("All");

  if (savedProducts.length === 0) {
    toast("Your wishlist is waiting for its first find ♡");
    return;
  }

  $("#resultCount").textContent = `${savedProducts.length} saved ${savedProducts.length === 1 ? "find" : "finds"}`;
  $("#productGrid").innerHTML = savedProducts.map(product => `
    <article class="product-card" data-open-product="${escapeHTML(product.id)}">
      <div class="product-photo">
        <img src="${escapeHTML(safeImage(product.image) || IMAGES.plant)}" alt="${escapeHTML(product.name)}" loading="lazy">
        <button class="wish-button saved" data-wish="${escapeHTML(product.id)}" aria-label="Remove from wishlist">♥</button>
      </div>
      <div class="product-info">
        <div class="product-meta"><span>${escapeHTML(product.category)}</span><span>${escapeHTML(product.condition)}</span></div>
        <h3 class="product-title">${escapeHTML(product.name)}</h3>
        <div class="product-price">${money(product.price)}</div>
        <div class="seller-line">${escapeHTML(product.seller)} · ${escapeHTML(product.location)}</div>
      </div>
    </article>`).join("");

  $("#explore").scrollIntoView({ behavior: "smooth" });
}

function updateCommission() {
  const price = Math.max(0, Number($("#sellForm").elements.price.value) || 0);
  $("#commissionValue").textContent = money(price * 0.10);
  $("#sellerPayout").textContent = money(price * 0.90);
}

function setAuthMode(mode) {
  activeAuthMode = mode;
  const registering = mode === "register";
  $("#authTitle").innerHTML = registering ? "Start something <em>good.</em>" : "Welcome <em>back.</em>";
  $("#nameField").classList.toggle("hidden", !registering);
  $("#nameField").querySelector("input").required = registering;
  $("#authSubmit").textContent = registering ? "Create demo account ↗" : "Sign in ↗";
  $("#authError").textContent = "";
  $$(".auth-tabs button").forEach(button => button.classList.toggle("active", button.dataset.auth === mode));
}

function openAuth() {
  setAuthMode("login");
  if (currentUser) {
    const logout = confirm(`Signed in as ${currentUser.name} (demo). Sign out?`);
    if (logout) {
      currentUser = null;
      writeStore("ecoswap_demo_user", null);
      renderHeader();
      toast("Signed out of the demo account.");
    }
    return;
  }
  openDialog($("#authModal"));
}

function openSell() {
  $("#sellError").textContent = "";
  openDialog($("#sellModal"));
}

function setupEvents() {
  $("#searchInput").addEventListener("input", renderProducts);
  $("#sortSelect").addEventListener("change", renderProducts);
  $("#conditionSelect").addEventListener("change", renderProducts);

  $("#categoryFilters").addEventListener("click", event => {
    const chip = event.target.closest("[data-category]");
    if (chip) setCategory(chip.dataset.category);
  });

  $$(".category-tile").forEach(tile => {
    tile.addEventListener("click", () => {
      setCategory(tile.dataset.category);
      $("#explore").scrollIntoView({ behavior: "smooth" });
    });
  });

  $("#productGrid").addEventListener("click", event => {
    const wishButton = event.target.closest("[data-wish]");
    if (wishButton) {
      event.stopPropagation();
      toggleWishlist(wishButton.dataset.wish);
      return;
    }
    const card = event.target.closest("[data-open-product]");
    if (card) openDetails(card.dataset.openProduct);
  });

  $("#wishlistNav").addEventListener("click", showWishlist);
  $("#loginOpen").addEventListener("click", openAuth);
  $("#sellOpen").addEventListener("click", openSell);
  $("#sellBottom").addEventListener("click", openSell);
  $("#heroSell").addEventListener("click", openSell);

  $("#menuToggle").addEventListener("click", () => {
    const nav = $(".nav");
    nav.classList.toggle("open");
    $("#menuToggle").setAttribute("aria-expanded", String(nav.classList.contains("open")));
  });

  $$(".nav a").forEach(link => link.addEventListener("click", () => $(".nav").classList.remove("open")));

  $$("[data-close]").forEach(button => {
    button.addEventListener("click", () => closeDialog(button.closest("dialog")));
  });

  $$("dialog").forEach(dialog => {
    dialog.addEventListener("click", event => {
      if (event.target === dialog) closeDialog(dialog);
    });
    dialog.addEventListener("close", () => {
      if (dialog.id === "detailModal") selectedProductId = null;
    });
  });

  $$(".auth-tabs button").forEach(button => {
    button.addEventListener("click", () => setAuthMode(button.dataset.auth));
  });

  $("#authForm").addEventListener("submit", event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");

    if (!email || password.length < 6 || (activeAuthMode === "register" && !name)) {
      $("#authError").textContent = "Please fill in the required fields.";
      return;
    }

    // DEMO ONLY: this is not secure authentication.
    const accounts = readStore("ecoswap_demo_accounts", {});
    if (activeAuthMode === "register") {
      if (accounts[email]) {
        $("#authError").textContent = "A demo account already exists for this email.";
        return;
      }
      accounts[email] = { name, password };
      writeStore("ecoswap_demo_accounts", accounts);
      currentUser = { name, email };
    } else {
      if (!accounts[email] || accounts[email].password !== password) {
        $("#authError").textContent = "Demo account not found. Create a demo account first.";
        return;
      }
      currentUser = { name: accounts[email].name, email };
    }

    writeStore("ecoswap_demo_user", currentUser);
    renderHeader();
    closeDialog($("#authModal"));
    event.currentTarget.reset();
    toast(`Welcome ${currentUser.name.split(" ")[0]}! Demo mode is active.`);
  });

  $("#sellForm").elements.price.addEventListener("input", updateCommission);

  $("#sellForm").addEventListener("submit", event => {
    event.preventDefault();
    $("#sellError").textContent = "";

    if (!currentUser) {
      $("#sellError").textContent = "Please sign in with a demo account before listing an item.";
      closeDialog($("#sellModal"));
      openDialog($("#authModal"));
      return;
    }

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const category = String(form.get("category") || "Other");
    const condition = String(form.get("condition") || "Good");
    const price = Number(form.get("price"));
    const location = String(form.get("location") || "").trim();
    const description = String(form.get("description") || "").trim();
    const rawImage = String(form.get("image") || "").trim();

    if (!name || !location || !description || !Number.isFinite(price) || price < 50 || price > 1000000) {
      $("#sellError").textContent = "Please enter valid details and a price between ₹50 and ₹10,00,000.";
      return;
    }

    if (rawImage && !safeImage(rawImage)) {
      $("#sellError").textContent = "Please enter a valid HTTP or HTTPS image URL.";
      return;
    }

    const product = {
      id: "custom-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      name, category, condition, price, location, description,
      seller: currentUser.name,
      ownerEmail: currentUser.email,
      image: safeImage(rawImage) || ({
        Fashion: IMAGES.fashion,
        Electronics: IMAGES.camera,
        Books: IMAGES.books,
        Furniture: IMAGES.chair,
        Home: IMAGES.plant,
        Other: IMAGES.watch
      })[category],
      badge: "JUST LISTED",
      featured: false,
      custom: true,
      createdAt: Date.now()
    };

    customProducts.unshift(product);
    products.unshift(product);
    writeStore("ecoswap_custom_products", customProducts);

    event.currentTarget.reset();
    updateCommission();
    closeDialog($("#sellModal"));
    setCategory("All");
    $("#searchInput").value = "";
    $("#conditionSelect").value = "All";
    $("#sortSelect").value = "newest";
    renderProducts();
    $("#explore").scrollIntoView({ behavior: "smooth" });
    toast("Your demo listing is live! ✳");
  });

  $("#resetFilters").addEventListener("click", () => {
    $("#searchInput").value = "";
    $("#conditionSelect").value = "All";
    $("#sortSelect").value = "featured";
    setCategory("All");
  });

  // Enter in the search field remains a normal search interaction.
  $("#searchInput").addEventListener("keydown", event => {
    if (event.key === "Escape") {
      event.currentTarget.value = "";
      renderProducts();
    }
  });
}

function initialise() {
  products = [...customProducts, ...starterProducts];
  saveWishlist();
  renderHeader();
  setupEvents();
  renderProducts();
  updateCommission();
}

initialise();
