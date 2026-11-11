/* 我們的行程頁 */
renderHeader("trip");
renderFooter();

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];
const CITY_LABEL = { taipei: "台北", sydney: "雪梨", canberra: "坎培拉" };

/* 以雪梨時間判斷「今天」 */
function todayInSydney() {
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone: "Australia/Sydney" }).format(new Date());
  } catch (e) {
    return new Date().toISOString().slice(0, 10);
  }
}
const today = todayInSydney();
const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);
const fmtDate = iso => {
  const d = new Date(iso + "T00:00:00");
  return `${d.getMonth() + 1}/${d.getDate()}（${WEEKDAYS[d.getDay()]}）`;
};
const placeOf = id => PLACES.find(p => p.id === id);

/* 倒數 */
(function countdown() {
  const el = document.getElementById("countdown");
  let html;
  if (today < TRIP.start) {
    const n = daysBetween(today, TRIP.start);
    html = `✈️ 還有 <b>${n}</b> 天出發！`;
  } else if (today <= TRIP.end) {
    const d = ITINERARY.find(x => x.date === today);
    html = `🎉 旅行中・今天是 <b>Day ${d ? d.day : "?"}</b>`;
    if (d) html += ` <a href="#day-${d.day}">看今天的行程 ↓</a>`;
  } else {
    html = `🏡 旅程結束，辛苦了！`;
  }
  el.innerHTML = html;
})();

/* 重點資訊 */
document.getElementById("quickInfo").innerHTML = [
  { icon: "✈️", title: "航班", items: TRIP.flights, bg: "var(--sky-soft)" },
  { icon: "🚌", title: "巴士（Murrays Coaches）", items: TRIP.buses, bg: "var(--sun-soft)" },
  { icon: "🏠", title: "住宿", items: TRIP.stays, bg: "var(--mint-soft)" },
].map(c => `
  <div class="info-card" style="background:${c.bg}">
    <h3>${c.icon} ${c.title}</h3>
    ${c.items.map(i => `<p><span class="info-label">${i.label}</span>${i.text}</p>`).join("")}
  </div>`).join("") +
  `<p class="muted tz">🕒 ${TRIP.timezone}</p>`;

/* 每日行程 */
document.getElementById("timeline").innerHTML = ITINERARY.map(d => {
  const isToday = d.date === today;
  const isPast = d.date < today;
  const stay = d.stay && placeOf(d.stay);
  const stops = d.stops.map(getAttraction).filter(Boolean);
  return `
  <article class="day-card ${isToday ? "is-today" : ""} ${isPast ? "is-past" : ""} city-${d.city}" id="day-${d.day}">
    <div class="day-head">
      <span class="day-num city-${d.city}">Day ${d.day}</span>
      <span class="day-date">${fmtDate(d.date)}</span>
      ${isToday ? `<span class="today-badge">今天</span>` : ""}
      <span class="tag tag-${d.city}">📍 ${CITY_LABEL[d.city] || ""}</span>
    </div>
    <h3>${d.title}</h3>
    <ol class="events">
      ${d.events.map(e => `<li><span class="ev-time">${e.time}</span><span class="ev-icon">${e.icon}</span><span class="ev-text">${e.text}</span></li>`).join("")}
    </ol>
    ${d.note ? `<div class="tip">${d.note}</div>` : ""}
    ${stops.length ? `
      <p class="stops-title">📍 順路景點${d.city === "canberra" ? "（有空的話）" : ""}</p>
      <div class="stops">
        ${stops.map(a => `
          <a class="stop" href="attraction.html?id=${a.id}">
            ${photoPlaceholder(a, "stop-photo")}
            <span>${a.name}</span>
          </a>`).join("")}
      </div>
      <a class="btn btn-small btn-outline map-link" href="map.html?city=${d.city}&day=${d.day}">🗺️ 在地圖上看 Day ${d.day} 路線</a>` : ""}
    ${stay ? `<p class="stay-line">🏠 住：${stay.detail}</p>` : ""}
  </article>`;
}).join("");

/* 清單：預設狀態來自 Notion，可以在網頁上自己打勾（存在這台裝置） */
function checklist(elId, key, items) {
  const saved = store.get(key, {});
  const el = document.getElementById(elId);
  el.innerHTML = items.map((it, i) => {
    const text = typeof it === "string" ? it : it.text;
    const done = i in saved ? saved[i] : !!it.done;
    return `<li><label><input type="checkbox" data-i="${i}" ${done ? "checked" : ""}><span>${text}</span></label></li>`;
  }).join("");
  el.addEventListener("change", e => {
    const cb = e.target.closest("input[type=checkbox]");
    if (!cb) return;
    const s = store.get(key, {});
    s[cb.dataset.i] = cb.checked;
    store.set(key, s);
  });
}
checklist("todo", "todo", TRIP.todo);
checklist("packing", "packing", TRIP.packing);

document.getElementById("emergency").innerHTML = [
  ...TRIP.emergency.map(e => `<li><span>🚨</span><div>${e.label}：<b>${e.text}</b></div></li>`),
  `<li><span>🕒</span><div>${TRIP.timezone}</div></li>`,
  `<li><span>💳</span><div>雪梨的火車、公車、渡輪、輕軌都可以直接用信用卡感應搭乘（跟 Opal 卡同價、有每日上限）</div></li>`,
  `<li><span>☀️</span><div>11 月紫外線很強，防曬一定要擦；坎培拉早晚溫差大，帶件薄外套</div></li>`,
].join("");

loadImages(document);

/* 今天的卡片自動捲到畫面中 */
if (location.hash === "" && document.querySelector(".day-card.is-today")) {
  setTimeout(() => document.querySelector(".day-card.is-today").scrollIntoView({ behavior: "smooth", block: "start" }), 400);
}
