/* 卡片列表頁 */
renderHeader("list");
renderFooter();

const state = { city: "all", category: "all", query: "", status: "all" };
const grid = document.getElementById("grid");

function cardHtml(a) {
  const st = getStatus(a.id);
  const d = dayOf(a.id);
  return `
    <a class="card" href="attraction.html?id=${a.id}">
      ${photoPlaceholder(a)}
      ${st !== "none" ? `<span class="status-badge status-${st}">${STATUS[st].icon} ${STATUS[st].label}</span>` : ""}
      ${isTripMode() && d ? `<span class="day-badge">Day ${d.day}</span>` : ""}
      <div class="card-body">
        <h3>${a.name}</h3>
        <p class="en">${a.en}</p>
        <p class="summary">${a.summary}</p>
        <div class="meta">
          <span class="tag tag-${a.city}">📍 ${CITIES[a.city].name}</span>
          <span class="tag cat-${a.category}">${CATEGORY_ICONS[a.category]} ${CATEGORIES[a.category]}</span>
          <span class="tag">⏱ ${a.duration}</span>
        </div>
      </div>
    </a>`;
}

function matches(a) {
  if (state.city !== "all" && a.city !== state.city) return false;
  if (state.category !== "all" && a.category !== state.category) return false;
  if (state.status !== "all" && getStatus(a.id) !== state.status) return false;
  if (state.query) {
    const q = state.query.toLowerCase();
    const hay = `${a.name} ${a.en} ${a.summary} ${a.description}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

function render() {
  const list = ATTRACTIONS.filter(matches);
  let html = "";
  if (!list.length) {
    html = `<p class="empty">找不到符合條件的景點 🙈</p>`;
  } else if (isTripMode()) {
    for (const d of ITINERARY) {
      const items = d.stops.map(getAttraction).filter(a => a && list.includes(a));
      if (!items.length) continue;
      html += `<section class="day-group">
        <h2 class="day-title"><span class="day-num">Day ${d.day}</span>${d.title}</h2>
        <div class="grid">${items.map(cardHtml).join("")}</div></section>`;
    }
    const rest = list.filter(a => !dayOf(a.id));
    if (rest.length) html += `<section class="day-group"><h2 class="day-title">未排入行程</h2><div class="grid">${rest.map(cardHtml).join("")}</div></section>`;
  } else {
    for (const city of Object.keys(CITIES)) {
      const items = list.filter(a => a.city === city);
      if (!items.length) continue;
      html += `<section class="day-group">
        <h2 class="day-title"><span class="day-num city-${city}">${city === "sydney" ? "🌊" : "🏛️"} ${CITIES[city].name}</span><small>${CITIES[city].en}・${items.length} 個景點</small></h2>
        <div class="grid">${items.map(cardHtml).join("")}</div></section>`;
    }
  }
  grid.innerHTML = html;
  document.getElementById("count").textContent = `共 ${list.length} 個景點`;
  loadImages(grid);
}

/* 篩選按鈕 */
function chipGroup(containerId, key, options) {
  const el = document.getElementById(containerId);
  el.innerHTML = options.map(([v, label]) =>
    `<button class="chip ${state[key] === v ? "active" : ""}" data-v="${v}">${label}</button>`).join("");
  el.addEventListener("click", e => {
    const b = e.target.closest(".chip");
    if (!b) return;
    state[key] = b.dataset.v;
    el.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c === b));
    render();
  });
}
chipGroup("cityChips", "city", [["all", "全部"], ...Object.entries(CITIES).map(([k, c]) => [k, c.name])]);
chipGroup("catChips", "category", [["all", "全部分類"], ...Object.entries(CATEGORIES).map(([k, v]) => [k, `${CATEGORY_ICONS[k]} ${v}`])]);
chipGroup("statusChips", "status", [["all", "全部"], ["want", "⭐ 想去"], ["visited", "✅ 已去"]]);

document.getElementById("search").addEventListener("input", e => { state.query = e.target.value.trim(); render(); });
document.addEventListener("tripmodechange", render);

/* 雪梨 ↔ 坎培拉交通 */
document.getElementById("intercity").innerHTML = transportItems(INTERCITY);

render();
