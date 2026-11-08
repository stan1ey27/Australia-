/* 地圖頁 */
renderHeader("map");

const params = new URLSearchParams(location.search);
const focusId = params.get("focus");
const focusA = focusId && getAttraction(focusId);
let currentCity = (focusA && focusA.city) || (CITIES[params.get("city")] ? params.get("city") : "sydney");
let currentDay = "all";

const DAY_COLORS = ["#4FA9E0", "#FF8C6B", "#3FBF8C", "#9B7BEA", "#F2A93B", "#2BB3C0", "#F06FA0", "#8C7A6B"];
const dayColor = d => DAY_COLORS[(d - 1) % DAY_COLORS.length];

const map = L.map("map", { zoomControl: true }).setView(CITIES[currentCity].center, CITIES[currentCity].zoom);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const markers = {};
let routeLayer = L.layerGroup().addTo(map);

function iconFor(a) {
  const d = dayOf(a.id);
  const st = getStatus(a.id);
  const cityList = ATTRACTIONS.filter(x => x.city === a.city);
  let cls = `pin pin-${a.city}`, label = cityList.indexOf(a) + 1, style = "";
  if (isTripMode() && d) {
    const idx = d.stops.indexOf(a.id) + 1;
    cls = "pin pin-day";
    label = `${d.day}-${idx}`;
    style = `background:${dayColor(d.day)}`;
  }
  if (st === "visited") cls += " pin-visited";
  return L.divIcon({
    className: "",
    html: `<div class="${cls}" style="${style}"><span>${label}</span></div>`,
    iconSize: [34, 34], iconAnchor: [17, 43], popupAnchor: [0, -40],
  });
}

function popupHtml(a) {
  const d = dayOf(a.id), st = getStatus(a.id);
  return `<div class="popup">
    ${photoPlaceholder(a, "popup-photo")}
    <strong>${a.name}</strong><div class="en">${a.en}</div>
    <p>${a.summary}</p>
    <div class="popup-meta">⏱ ${a.duration}${isTripMode() && d ? `・Day ${d.day}` : ""}${st !== "none" ? `・${STATUS[st].icon} ${STATUS[st].label}` : ""}</div>
    <a class="btn btn-small" href="attraction.html?id=${a.id}">查看詳情 →</a>
  </div>`;
}

function visible(a) {
  if (a.city !== currentCity) return false;
  if (isTripMode() && currentDay !== "all") {
    const d = dayOf(a.id);
    return d && String(d.day) === currentDay;
  }
  return true;
}

function drawMarkers() {
  Object.values(markers).forEach(m => m.remove());
  for (const a of ATTRACTIONS) {
    if (!visible(a)) continue;
    const m = L.marker([a.lat, a.lng], { icon: iconFor(a), title: a.name }).addTo(map);
    m.bindPopup(popupHtml(a), { maxWidth: 260, minWidth: 220 });
    m.on("popupopen", e => loadImages(e.popup.getElement()));
    markers[a.id] = m;
  }
}

function drawRoutes() {
  routeLayer.clearLayers();
  if (!isTripMode()) return;
  for (const d of ITINERARY) {
    if (currentDay !== "all" && String(d.day) !== currentDay) continue;
    const pts = d.stops.map(getAttraction).filter(a => a && a.city === currentCity).map(a => [a.lat, a.lng]);
    if (pts.length > 1) {
      L.polyline(pts, { color: dayColor(d.day), weight: 4, opacity: .8, dashArray: "8 8" }).addTo(routeLayer);
    }
  }
}

function drawSidebar() {
  const sb = document.getElementById("sidebar");
  let html = "";
  const item = (a, prefix) => {
    const st = getStatus(a.id);
    return `<li><button class="side-item" data-id="${a.id}">
      <span class="side-num city-${a.city}" ${prefix.color ? `style="background:${prefix.color}"` : ""}>${prefix.label}</span>
      <span class="side-text"><strong>${a.name}</strong><small>${CATEGORIES[a.category]}・${a.duration}</small></span>
      ${st !== "none" ? `<span class="side-status">${STATUS[st].icon}</span>` : ""}
    </button></li>`;
  };
  if (isTripMode()) {
    for (const d of ITINERARY) {
      if (currentDay !== "all" && String(d.day) !== currentDay) continue;
      const stops = d.stops.map(getAttraction).filter(a => a && a.city === currentCity);
      if (!stops.length) continue;
      html += `<h3 class="side-title"><span class="day-dot" style="background:${dayColor(d.day)}"></span>Day ${d.day}・${d.title}</h3><ol class="side-list">`;
      html += stops.map((a, i) => item(a, { label: `${d.day}-${i + 1}`, color: dayColor(d.day) })).join("");
      html += `</ol>`;
    }
    const rest = ATTRACTIONS.filter(a => a.city === currentCity && !dayOf(a.id));
    const cityList = ATTRACTIONS.filter(a => a.city === currentCity);
    if (rest.length && currentDay === "all") html += `<h3 class="side-title">未排入行程</h3><ol class="side-list">${rest.map(a => item(a, { label: cityList.indexOf(a) + 1 })).join("")}</ol>`;
  } else {
    const list = ATTRACTIONS.filter(a => a.city === currentCity);
    html += `<h3 class="side-title">${CITIES[currentCity].name}・${list.length} 個景點</h3><ol class="side-list">`;
    html += list.map((a, i) => item(a, { label: i + 1 })).join("");
    html += `</ol>`;
  }
  html += `<p class="side-hint">點選景點會移動到地圖上的位置</p>`;
  sb.innerHTML = html || `<p class="side-hint">這一天在${CITIES[currentCity].name}沒有景點，切換城市看看</p>`;
}

function flyTo(id) {
  const a = getAttraction(id), m = markers[id];
  if (!a || !m) return;
  map.flyTo([a.lat, a.lng], Math.max(map.getZoom(), 15), { duration: .8 });
  setTimeout(() => m.openPopup(), 850);
  document.querySelectorAll(".side-item").forEach(b => b.classList.toggle("active", b.dataset.id === id));
  if (window.innerWidth < 800) document.getElementById("map").scrollIntoView({ behavior: "smooth" });
}

function fitVisible() {
  const pts = ATTRACTIONS.filter(visible).map(a => [a.lat, a.lng]);
  if (isTripMode() && currentDay !== "all" && pts.length) {
    map.fitBounds(pts, { padding: [50, 50], maxZoom: 15 });
  } else {
    map.setView(CITIES[currentCity].center, CITIES[currentCity].zoom);
  }
}

function renderDayChips() {
  const el = document.getElementById("dayChips");
  el.hidden = !isTripMode();
  if (!isTripMode()) return;
  const days = ITINERARY.filter(d => d.stops.some(id => (getAttraction(id) || {}).city === currentCity));
  if (currentDay !== "all" && !days.some(d => String(d.day) === currentDay)) currentDay = "all";
  el.innerHTML = [`<button class="chip ${currentDay === "all" ? "active" : ""}" data-v="all">全部天數</button>`]
    .concat(days.map(d => `<button class="chip ${String(d.day) === currentDay ? "active" : ""}" data-v="${d.day}">
      <span class="day-dot" style="background:${dayColor(d.day)}"></span>Day ${d.day}</button>`)).join("");
}

function renderCityTabs() {
  document.getElementById("cityTabs").innerHTML = Object.entries(CITIES).map(([k, c]) =>
    `<button class="chip ${k === currentCity ? "active" : ""}" data-v="${k}">📍 ${c.name}</button>`).join("");
}

function refresh(refit = true) {
  renderCityTabs();
  renderDayChips();
  drawMarkers();
  drawRoutes();
  drawSidebar();
  if (refit) fitVisible();
}

document.getElementById("cityTabs").addEventListener("click", e => {
  const b = e.target.closest(".chip"); if (!b) return;
  currentCity = b.dataset.v; currentDay = "all";
  history.replaceState(null, "", `?city=${currentCity}`);
  refresh();
});
document.getElementById("dayChips").addEventListener("click", e => {
  const b = e.target.closest(".chip"); if (!b) return;
  currentDay = b.dataset.v;
  refresh();
});
document.getElementById("sidebar").addEventListener("click", e => {
  const b = e.target.closest(".side-item"); if (b) flyTo(b.dataset.id);
});
document.addEventListener("tripmodechange", () => { currentDay = "all"; refresh(); });

refresh(!focusA);
if (focusA) { map.setView([focusA.lat, focusA.lng], 15); markers[focusA.id] && markers[focusA.id].openPopup(); }
