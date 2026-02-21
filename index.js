/* ==========================
   CONFIG WHATSAPP
   ========================== */
// ✅ Poné tu número real con código de país, sin + ni espacios.
// Ej Argentina: 549381XXXXXXX
const WHATSAPP_NUMBER = "5493810000000";

/* ==========================
   HELPERS
   ========================== */
function buildWhatsAppLink(message) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

function setLink(id, message) {
  const el = document.getElementById(id);
  if (!el) return;
  el.href = buildWhatsAppLink(message);
}

/* ==========================
   LINKS FIJOS
   ========================== */
document.getElementById("year").textContent = new Date().getFullYear();

setLink("waTopLink", "Hola! Estoy viendo la web. ¿Me pasás precios y stock?");
setLink("waHeaderLink", "Hola! Quiero consultar por productos de la ferretería.");
setLink("waHeroLink", "Hola! Quisiera consultar por precios, stock y envíos.");
setLink("waPromoLink", "Hola! Quiero aprovechar las promos. ¿Qué ofertas hay hoy?");
setLink("waServicesLink", "Hola! Quiero consultar por servicios (corte a medida / envíos).");
setLink("waContactLink", "Hola! Quiero hacer un pedido. ¿Me ayudás?");
setLink("waFooterLink", "Hola! Necesito stock y precio de algunos productos.");
setLink("waModalLink", "Hola! Quiero consultar horarios, envíos y medios de pago.");
setLink("waFloatBtn", "Hola! Estoy viendo la web y quiero consultar.");

/* ==========================
   BOTONES WHATSAPP POR PRODUCTO
   ========================== */
document.querySelectorAll(".wa-product").forEach((btn) => {
  btn.addEventListener("click", () => {
    const product = btn.dataset.product || "Producto";
    const price = btn.dataset.price || "";
    const msg = `Hola! Quiero consultar por: ${product} ${price ? `(${price})` : ""}. ¿Hay stock y envío?`;
    window.open(buildWhatsAppLink(msg), "_blank", "noopener");
  });
});

/* ==========================
   FILTROS: BUSCAR + CATEGORÍA
   ========================== */
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const btnClearFilters = document.getElementById("btnClearFilters");
const items = Array.from(document.querySelectorAll(".product-item"));

function applyFilters() {
  const q = (searchInput.value || "").trim().toLowerCase();
  const cat = categorySelect.value;

  items.forEach((item) => {
    const name = (item.dataset.name || "").toLowerCase();
    const itemCat = item.dataset.cat || "all";

    const matchText = !q || name.includes(q);
    const matchCat = cat === "all" || itemCat === cat;

    item.style.display = (matchText && matchCat) ? "" : "none";
  });
}

searchInput.addEventListener("input", applyFilters);
categorySelect.addEventListener("change", applyFilters);

btnClearFilters.addEventListener("click", () => {
  searchInput.value = "";
  categorySelect.value = "all";
  applyFilters();
});

/* ==========================
   MODAL DE PRODUCTO (DINÁMICO)
   ========================== */
const productModalEl = document.getElementById("productModal");
const productModal = productModalEl ? new bootstrap.Modal(productModalEl) : null;

const pmTitle = document.getElementById("pmTitle");
const pmImg = document.getElementById("pmImg");
const pmDesc = document.getElementById("pmDesc");
const pmPrice = document.getElementById("pmPrice");
const pmBadges = document.getElementById("pmBadges");
const pmWhatsApp = document.getElementById("pmWhatsApp");

function openProductModal(item) {
  if (!productModal) return;

  const name = item.dataset.name || "Producto";
  const desc = item.dataset.desc || "";
  const img = item.dataset.img || "";
  const price = item.dataset.price || "";
  const tags = (item.dataset.tags || "").split(",").map(t => t.trim()).filter(Boolean);

  pmTitle.textContent = name;
  pmDesc.textContent = desc;
  pmImg.src = img; // ✅ respeta "img/xxxxx.png"
  pmImg.alt = name;
  pmPrice.textContent = price;

  pmBadges.innerHTML = "";
  tags.forEach((t) => {
    const span = document.createElement("span");
    span.className = "badge text-bg-light border";
    span.innerHTML = `<i class="bi bi-tag"></i> ${t}`;
    pmBadges.appendChild(span);
  });

  const msg = `Hola! Quiero consultar por: ${name} ${price ? `(${price})` : ""}. ¿Hay stock y envío?`;
  pmWhatsApp.href = buildWhatsAppLink(msg);

  productModal.show();
}

document.querySelectorAll(".btn-details").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const item = e.currentTarget.closest(".product-item");
    if (!item) return;
    openProductModal(item);
  });
});