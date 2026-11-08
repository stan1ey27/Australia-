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

/* ---------- 照片：從維基百科自動抓取，失敗時顯示漸層底圖 ---------- */
const imageCache = store.get("imgCache", {});
async function fetchWikiImage(title) {
  if (title in imageCache) return imageCache[title];
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
    if (!res.ok) throw new Error(res.status);
    const json = await res.json();
    const src = (json.originalimage && json.originalimage.source) || (json.thumbnail && json.thumbnail.source) || null;
    // 用縮圖服務取得適當大小的圖
    const url = json.thumbnail ? json.thumbnail.source.replace(/\/\d+px-/, "/1200px-") : src;
    imageCache[title] = url;
    store.set("imgCache", imageCache);
    return url;
  } catch (e) {
    return null;
  }
}
/* 對頁面上所有 [data-wiki] 元素套用背景照片 */
function loadImages(root = document) {
  root.querySelectorAll("[data-wiki]").forEach(async el => {
    const url = await fetchWikiImage(el.dataset.wiki);
    if (!url) return;
    const img = new Image();
    img.onload = () => { el.style.backgroundImage = `url("${url}")`; el.classList.add("has-photo"); };
    img.src = url;
  });
}
function photoPlaceholder(a, extraClass = "") {
  return `<div class="photo ${extraClass} city-${a.city}" data-wiki="${a.wiki}" role="img" aria-label="${a.name}">
    <span class="photo-icon">${CATEGORY_ICONS[a.category] || "📍"}</span>
  </div>`;
}

/* ---------- 導覽列 ---------- */
function renderHeader(active) {
  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <div class="container header-inner">
      <a class="brand" href="index.html"><span class="brand-icon">🦘</span>雪梨・坎培拉<span class="brand-sub">景點地圖</span></a>
      <nav class="nav">
        <a href="index.html" class="${active === "list" ? "active" : ""}">景點</a>
        <a href="map.html" class="${active === "map" ? "active" : ""}">地圖</a>
        <label class="trip-toggle" title="依照行程天數顯示景點與路線">
          <input type="checkbox" id="tripToggle" ${isTripMode() ? "checked" : ""}>
          <span class="switch"></span><span class="trip-label">行程模式</span>
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
  f.innerHTML = `<div class="container">開放時間、票價、交通資訊僅供參考，請以各景點官網為準。<br>
    地圖 © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> 貢獻者・照片來自 Wikipedia／Wikimedia Commons</div>`;
  document.body.append(f);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
