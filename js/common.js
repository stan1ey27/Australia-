/* 共用工具：導覽列、本機儲存、景點狀態、行程模式、照片、距離計算 */

const MODE_ICONS = { train: "🚆", ferry: "⛴️", bus: "🚌", lightrail: "🚊", walk: "🚶", car: "🚗", plane: "✈️" };
const CATEGORY_ICONS = { landmark: "🏛️", beach: "🏖️", museum: "🖼️", nature: "🌿", shopping: "🛍️" };

/* ---------- 安全的 localStorage ---------- */
const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v === null ? fallback : JSON.parse(v);
    } catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* 無痕模式等情況忽略 */ }
  },
};

/* ---------- 景點狀態：已去 / 想去 ---------- */
const STATUS = {
  none:    { label: "未標記", icon: "○" },
  want:    { label: "想去",   icon: "⭐" },
  visited: { label: "已去",   icon: "✅" },
};
function getStatus(id) { return store.get("status", {})[id] || "none"; }
function setStatus(id, status) {
  const all = store.get("status", {});
  if (status === "none") delete all[id]; else all[id] = status;
  store.set("status", all);
}

/* ---------- 行程模式 ---------- */
function isTripMode() { return store.get("tripMode", false); }
function setTripMode(on) { store.set("tripMode", !!on); }
function shortDate(d) { const [, m, dd] = d.date.split("-"); return `${+m}/${+dd}`; }
function dayOf(id) {
  for (const d of ITINERARY) if (d.stops.includes(id)) return d;
  return null;
}

/* ---------- 資料查詢 ---------- */
function getAttraction(id) { return ATTRACTIONS.find(a => a.id === id); }

/* 兩點距離（公里） */
function distanceKm(a, b) {
  const R = 6371, toRad = x => x * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
function nearbyOf(a, n = 4) {
  return ATTRACTIONS
    .filter(o => o.id !== a.id && o.city === a.city)
    .map(o => ({ ...o, km: distanceKm(a, o) }))
    .sort((x, y) => x.km - y.km)
    .slice(0, n);
}
function distanceLabel(km) {
  const dist = km < 1 ? `${Math.round(km * 1000)} 公尺` : `${km.toFixed(1)} 公里`;
  if (km <= 2.5) return `🚶 ${dist}・步行約 ${Math.max(1, Math.round(km / 4.5 * 60 * 1.25))} 分鐘`;
  return `🚗 ${dist}・建議搭車`;
}

/* ---------- 照片：放在 images/<景點id>.jpg，沒有照片時顯示粉色底＋圖示 ---------- */
function photoUrl(a) { return `images/${a.id}.jpg`; }
/* 對頁面上所有 [data-photo] 元素套用背景照片 */
function loadImages(root = document) {
  root.querySelectorAll("[data-photo]:not(.has-photo)").forEach(el => {
    const url = el.dataset.photo;
    const img = new Image();
    img.onload = () => { el.style.backgroundImage = `url("${url}")`; el.classList.add("has-photo"); };
    img.src = url;
  });
}
function photoPlaceholder(a, extraClass = "") {
  return `<div class="photo ${extraClass} city-${a.city}" data-photo="${photoUrl(a)}" role="img" aria-label="${a.name}">
    <span class="photo-icon">${CATEGORY_ICONS[a.category] || "📍"}</span>
  </div>`;
}
function photoCredit(a) {
  const c = typeof PHOTO_CREDITS !== "undefined" && PHOTO_CREDITS[a.id];
  if (!c) return "";
  return `📷 <a href="${c.url}" target="_blank" rel="noopener">${escapeHtml(c.author)}</a>・${escapeHtml(c.license)}・Wikimedia Commons`;
}
function transportItems(list) {
  return list.map(t => `<li><span>${MODE_ICONS[t.mode] || "•"}</span><div>${t.text}</div></li>`).join("");
}

/* ---------- 導覽列 ---------- */
function renderHeader(active) {
  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <div class="container header-inner">
      <a class="brand" href="index.html"><span class="brand-icon">🦘</span><span class="brand-text">雪梨・坎培拉</span><span class="brand-sub">景點地圖</span></a>
      <nav class="nav">
        <a href="index.html" class="${active === "list" ? "active" : ""}">景點</a>
        <a href="map.html" class="${active === "map" ? "active" : ""}">地圖</a>
        <a href="trip.html" class="${active === "trip" ? "active" : ""}">行程</a>
        <label class="trip-toggle" title="依照行程天數顯示景點與路線">
          <input type="checkbox" id="tripToggle" ${isTripMode() ? "checked" : ""}>
          <span class="switch"></span><span class="trip-label"><span class="long">行程模式</span><span class="short">行程</span></span>
        </label>
      </nav>
    </div>`;
  document.body.prepend(header);
  header.querySelector("#tripToggle").addEventListener("change", e => {
    setTripMode(e.target.checked);
    document.dispatchEvent(new CustomEvent("tripmodechange", { detail: e.target.checked }));
  });
}

function renderFooter() {
  const f = document.createElement("footer");
  f.className = "site-footer";
  f.innerHTML = `<div class="container"><div class="bye">🦘 G'day mate！祝旅途愉快 🐨</div>
    開放時間、票價、交通資訊僅供參考，請以各景點官網為準。<br>
    地圖 © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> 貢獻者・照片來自 Wikimedia Commons（作者與授權見各景點頁）・字型 jf open 粉圓</div>`;
  document.body.append(f);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
