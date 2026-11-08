/* 景點詳細頁 */
renderHeader("list");
renderFooter();
document.addEventListener("tripmodechange", () => location.reload());

const id = new URLSearchParams(location.search).get("id");
const a = getAttraction(id);
const root = document.getElementById("detail");

if (!a) {
  root.innerHTML = `<div class="container narrow"><p class="empty">找不到這個景點 🙈 <a href="index.html">回景點列表</a></p></div>`;
} else {
  document.title = `${a.name}・雪梨／坎培拉景點`;
  const d = dayOf(a.id);
  const nearby = nearbyOf(a);
  const gmaps = `https://www.google.com/maps/dir/?api=1&destination=${a.lat},${a.lng}`;

  root.innerHTML = `
    <div class="container narrow detail-top">
      <a class="back" href="index.html">← 所有景點</a>
      <div class="detail-photo city-${a.city}" data-photo="${photoUrl(a)}" role="img" aria-label="${a.name}">
        <span class="photo-icon">${CATEGORY_ICONS[a.category]}</span>
      </div>
      <p class="photo-credit">${photoCredit(a)}</p>
      <div class="detail-head">
        <div class="meta">
          <span class="tag tag-${a.city}">📍 ${CITIES[a.city].name}</span>
          <span class="tag cat-${a.category}">${CATEGORY_ICONS[a.category]} ${CATEGORIES[a.category]}</span>
          ${isTripMode() && d ? `<span class="tag tag-day">🗓 Day ${d.day}・${d.title}</span>` : ""}
        </div>
        <h1>${a.name}</h1>
        <p class="en">${a.en}</p>
      </div>
      <div class="status-picker" id="statusPicker" role="group" aria-label="標記狀態">
        <span class="label">我的標記：</span>
        ${Object.entries(STATUS).map(([k, s]) => `<button class="chip" data-v="${k}">${s.icon} ${s.label}</button>`).join("")}
      </div>
    </div>

    <div class="container narrow detail-body">
      <section class="facts">
        <div class="fact"><span class="fact-icon">⏱</span><div><span>建議停留</span><strong>${a.duration}</strong></div></div>
        <div class="fact"><span class="fact-icon">🕘</span><div><span>開放時間</span><strong>${a.hours}</strong></div></div>
        <div class="fact"><span class="fact-icon">🎟</span><div><span>門票</span><strong>${a.ticket}</strong></div></div>
      </section>

      <section class="block">
        <h2><span class="h-icon">📖</span>景點介紹</h2>
        <p class="lead">${a.summary}</p>
        <p>${a.description}</p>
        <h3>必看亮點</h3>
        <ul class="highlights">${a.highlights.map(h => `<li>${h}</li>`).join("")}</ul>
        ${a.tips ? `<div class="tip"><strong>小提醒：</strong>${a.tips}</div>` : ""}
        <p><a href="${a.website}" target="_blank" rel="noopener">🔗 官方網站</a></p>
      </section>

      <section class="block">
        <h2><span class="h-icon" style="background:var(--sky-soft)">🚆</span>交通資訊</h2>
        <ul class="transport-list">${transportItems(a.transport)}</ul>
        <div class="btn-row">
          <a class="btn btn-coral" href="${gmaps}" target="_blank" rel="noopener">🧭 Google Maps 導航</a>
          <a class="btn btn-outline" href="map.html?focus=${a.id}">🗺️ 在景點地圖上看</a>
        </div>
      </section>

      <section class="block">
        <h2><span class="h-icon" style="background:var(--mint-soft)">📍</span>附近景點</h2>
        <div id="miniMap" class="mini-map"></div>
        <div class="nearby">
          ${nearby.map(n => `
            <a class="nearby-card" href="attraction.html?id=${n.id}">
              ${photoPlaceholder(n)}
              <div><strong>${n.name}</strong><small>${distanceLabel(n.km)}</small></div>
            </a>`).join("")}
        </div>
      </section>
    </div>`;

  /* 已去 / 想去 */
  const picker = document.getElementById("statusPicker");
  const syncPicker = () => picker.querySelectorAll(".chip").forEach(b => b.classList.toggle("active", b.dataset.v === getStatus(a.id)));
  picker.addEventListener("click", e => {
    const b = e.target.closest(".chip"); if (!b) return;
    setStatus(a.id, b.dataset.v); syncPicker();
  });
  syncPicker();

  /* 小地圖：本景點＋附近景點 */
  const mini = L.map("miniMap", { scrollWheelZoom: false });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(mini);
  const pin = (x, main) => L.divIcon({
    className: "",
    html: `<div class="pin pin-${x.city} ${main ? "pin-main" : "pin-small"}"><span>${main ? "★" : CATEGORY_ICONS[x.category]}</span></div>`,
    iconSize: main ? [44, 44] : [30, 30], iconAnchor: main ? [22, 52] : [15, 38], popupAnchor: [0, -28],
  });
  L.marker([a.lat, a.lng], { icon: pin(a, true), zIndexOffset: 1000 }).addTo(mini).bindPopup(`<strong>${a.name}</strong>`);
  nearby.forEach(n => L.marker([n.lat, n.lng], { icon: pin(n, false) }).addTo(mini)
    .bindPopup(`<strong>${n.name}</strong><br><a href="attraction.html?id=${n.id}">查看詳情 →</a>`));
  // 只框住距離 10 公里內的附近景點，避免藍山這類遠的景點把地圖拉太遠
  const close = nearby.filter(n => n.km < 10);
  const pts = [[a.lat, a.lng], ...close.map(n => [n.lat, n.lng])];
  if (pts.length > 1) mini.fitBounds(pts, { padding: [30, 30], maxZoom: 16 }); else mini.setView([a.lat, a.lng], 13);

  loadImages(document);
}
