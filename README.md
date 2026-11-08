# 🦘 雪梨・坎培拉 景點地圖

雪梨與坎培拉的推薦景點網站，純靜態網頁（HTML／CSS／JS），可以直接部署到 GitHub Pages。

## 頁面
| 頁面 | 說明 |
|---|---|
| `index.html` | 景點卡片列表，可以依城市、分類、已去／想去篩選，也可以搜尋 |
| `map.html` | 景點地圖（Leaflet + OpenStreetMap），可以切換雪梨／坎培拉 |
| `attraction.html?id=…` | 景點詳細頁：介紹、開放時間、門票、交通、附近景點、小地圖 |

## 功能
- **行程模式**（右上角開關）：依 Day 1～Day 7 分組顯示，地圖上會畫出每天的路線，也可以只看某一天
- **已去／想去標記**：在景點詳細頁點選，記錄在瀏覽器裡（每台裝置各自記錄）
- **附近景點**：依座標自動計算距離和步行時間
- 景點照片會自動從維基百科抓取

## 修改景點或行程
所有資料都在 [`js/data.js`](js/data.js)：
- `ATTRACTIONS`：景點清單（新增景點時照著現有格式複製一筆）
- `ITINERARY`：每天的行程與景點順序
- `INTERCITY`：雪梨 ↔ 坎培拉的交通方式

## 本機預覽
```bash
python3 -m http.server 8000
# 打開 http://localhost:8000
```

## 部署到 GitHub Pages
1. 到 repo 的 **Settings → Pages**，**Source** 選擇 **GitHub Actions**
2. 合併到 `main` 之後，`.github/workflows/pages.yml` 會自動部署
3. 網址：`https://stan1ey27.github.io/Australia-/`

## 景點照片
照片放在 `images/<景點id>.jpg`，來自 Wikimedia Commons（自由授權），作者與授權顯示在各景點頁。
新增景點後執行 `python3 scripts/fetch_images.py` 就會自動下載缺少的照片；部署時 GitHub Actions 也會自動補抓。
