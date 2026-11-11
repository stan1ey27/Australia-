/*
 * 景點資料：新增／修改景點只要改這個檔案。
 *
 * 欄位說明
 *   id        網址用的代號（英文、不重複）
 *   city      "sydney" 或 "canberra"
 *   category  見下方 CATEGORIES
 *   lat, lng  座標
 *   wiki      英文維基百科條目名稱（用來自動抓景點照片）
 *   duration  建議停留時間
 *   hours     開放時間（約略，以官網為準）
 *   ticket    門票（約略，以官網為準）
 *   transport 交通方式陣列：{ mode, text }
 *             mode 可用：train 火車／ferry 渡輪／bus 公車／lightrail 輕軌／walk 步行／car 開車
 */

const CITIES = {
  sydney:   { name: "雪梨",   en: "Sydney",   center: [-33.8688, 151.2193], zoom: 13 },
  canberra: { name: "坎培拉", en: "Canberra", center: [-35.2950, 149.1300], zoom: 13 },
};

const CATEGORIES = {
  landmark: "地標",
  beach:    "海灘",
  museum:   "博物館",
  nature:   "自然",
  shopping: "購物",
};

const ATTRACTIONS = [
  /* ───────────── 雪梨 ───────────── */
  {
    id: "opera-house",
    city: "sydney",
    name: "雪梨歌劇院",
    en: "Sydney Opera House",
    category: "landmark",
    lat: -33.8568, lng: 151.2153,
    wiki: "Sydney_Opera_House",
    summary: "世界文化遺產，白色貝殼造型的雪梨象徵。",
    description:
      "由丹麥建築師約恩・烏松設計，1973 年啟用，2007 年列入聯合國世界文化遺產。除了欣賞歌劇、芭蕾或交響樂，也可以參加館內的建築導覽，了解它的設計故事。傍晚到對岸的麥考利夫人座椅，或搭渡輪從海上看，角度最美。",
    highlights: ["建築導覽（約 1 小時，有中文語音導覽）", "看一場現場演出", "Opera Bar 海港景觀小酌", "夜晚燈光與海港夜景"],
    duration: "1.5–3 小時",
    hours: "外觀全天開放；導覽約 09:00–17:00",
    ticket: "外觀免費；導覽約 AUD 45 起",
    website: "https://www.sydneyoperahouse.com",
    transport: [
      { mode: "train", text: "搭火車到 Circular Quay 站（T2／T3／T8 線），沿海港步行約 7 分鐘" },
      { mode: "ferry", text: "所有從 Circular Quay 碼頭出發的渡輪都可以抵達，下船步行約 7 分鐘" },
      { mode: "lightrail", text: "輕軌 L2／L3 線 Circular Quay 站" },
    ],
    tips: "想拍歌劇院和港灣大橋同框，可以到皇家植物園的麥考利夫人座椅，或搭渡輪往 Manly 時在船尾拍。",
  },
  {
    id: "harbour-bridge",
    city: "sydney",
    name: "雪梨港灣大橋",
    en: "Sydney Harbour Bridge",
    category: "landmark",
    lat: -33.8523, lng: 151.2108,
    wiki: "Sydney_Harbour_Bridge",
    summary: "暱稱「衣架」的鋼拱橋，可以免費走橋，也可以攀爬到橋頂。",
    description:
      "1932 年通車，是世界上最寬的長跨距鋼拱橋之一。東側有免費的人行道，能邊走邊看歌劇院和海港；想挑戰的話，可以報名 BridgeClimb 攀爬到距離海面 134 公尺的拱頂。南端橋墩內的 Pylon Lookout 也能用比較少的預算登高看景。",
    highlights: ["免費走橋（東側人行道）", "BridgeClimb 攀橋", "Pylon Lookout 橋墩觀景台", "跨年煙火主舞台"],
    duration: "1–3.5 小時（攀橋約 3.5 小時）",
    hours: "人行道全天開放；Pylon Lookout 約 10:00–18:00",
    ticket: "走橋免費；Pylon Lookout 約 AUD 25；BridgeClimb 約 AUD 300 起",
    website: "https://www.bridgeclimb.com",
    transport: [
      { mode: "walk", text: "從 The Rocks 區 Cumberland Street 的階梯上橋" },
      { mode: "train", text: "南端：Circular Quay 站；北端：Milsons Point 站（T1／T9 線）" },
    ],
    tips: "建議從北端 Milsons Point 往南走回市區，一路面向歌劇院，風景比較好。",
  },
  {
    id: "the-rocks",
    city: "sydney",
    name: "岩石區",
    en: "The Rocks",
    category: "landmark",
    lat: -33.8599, lng: 151.2090,
    wiki: "The_Rocks,_Sydney",
    summary: "雪梨最早的殖民聚落，石板巷弄、老酒吧與週末市集。",
    description:
      "1788 年第一艦隊登陸後最早發展的區域，保留大量砂岩老建築與窄巷。現在是餐廳、藝廊和酒吧聚集的地方，週末有 The Rocks Markets 手作市集，也可以順路逛當代藝術館（MCA）。",
    highlights: ["週末 The Rocks Markets", "澳洲最古老的酒吧之一 Fortune of War", "當代藝術館 MCA（免費）", "Susannah Place 老街屋"],
    duration: "1.5–2 小時",
    hours: "街區全天開放；市集週六、日約 10:00–17:00",
    ticket: "免費",
    website: "https://www.therocks.com",
    transport: [
      { mode: "train", text: "Circular Quay 站步行約 5 分鐘" },
      { mode: "lightrail", text: "輕軌 L2／L3 線 Circular Quay 站" },
    ],
    tips: "和港灣大橋、歌劇院排在同一天，步行就能串起來。",
  },
  {
    id: "botanic-garden",
    city: "sydney",
    name: "皇家植物園＆麥考利夫人座椅",
    en: "Royal Botanic Garden & Mrs Macquarie's Chair",
    category: "nature",
    lat: -33.8642, lng: 151.2166,
    wiki: "Royal_Botanic_Garden,_Sydney",
    summary: "緊鄰歌劇院的海濱植物園，尖端是拍歌劇院＋大橋同框的經典位置。",
    description:
      "澳洲最古老的植物園（1816 年），面積約 30 公頃，沿著海港延伸。散步到半島尖端的「麥考利夫人座椅」，可以同時把歌劇院和港灣大橋拍進一張照片，日出、黃昏都很美。",
    highlights: ["麥考利夫人座椅拍照點", "原住民文化導覽", "玫瑰園與熱帶溫室 The Calyx", "海濱步道"],
    duration: "1–2 小時",
    hours: "約 07:00 開放，依季節於 17:00–20:00 之間關閉",
    ticket: "免費",
    website: "https://www.botanicgardens.org.au",
    transport: [
      { mode: "train", text: "Martin Place 站（T4 線）或 St James 站，步行約 10 分鐘" },
      { mode: "walk", text: "從歌劇院沿海濱步道步行約 5 分鐘進入園區" },
    ],
    tips: "從歌劇院沿著海濱走到麥考利夫人座椅，大約 20–25 分鐘。",
  },
  {
    id: "qvb",
    city: "sydney",
    name: "維多利亞女王大廈",
    en: "Queen Victoria Building (QVB)",
    category: "shopping",
    lat: -33.8718, lng: 151.2067,
    wiki: "Queen_Victoria_Building",
    summary: "1898 年落成的羅馬式建築購物中心，彩繪玻璃與大鐘很好拍。",
    description:
      "曾被譽為「世界上最美的購物中心」，有彩繪玻璃、圓頂和兩座大型機械鐘（皇家鐘、澳洲大鐘），整點會有小表演。館內有服飾、珠寶、咖啡廳，以及有名的 Tea Room 下午茶。",
    highlights: ["皇家機械鐘整點表演", "QVB Tea Room 下午茶", "建築中庭與圓頂", "地下通道連接 Town Hall 站"],
    duration: "1 小時",
    hours: "約 09:00–18:00（週四延長至 21:00）",
    ticket: "免費",
    website: "https://www.qvb.com.au",
    transport: [
      { mode: "train", text: "Town Hall 站，地下通道直通" },
      { mode: "lightrail", text: "輕軌 L2／L3 線 QVB 站" },
    ],
    tips: "對面就是市政廳 Town Hall，往北走 5 分鐘到雪梨塔。",
  },
  {
    id: "sydney-tower",
    city: "sydney",
    name: "雪梨塔",
    en: "Sydney Tower Eye",
    category: "landmark",
    lat: -33.8705, lng: 151.2089,
    wiki: "Sydney_Tower",
    summary: "雪梨最高的建築，250 公尺高的觀景台可以 360° 俯瞰全市。",
    description:
      "塔高 309 公尺，觀景台在約 250 公尺處，天氣好時可以遠望藍山。膽子大的可以參加 Skywalk，穿戴安全裝備走到戶外的玻璃平台。塔內也有旋轉餐廳。",
    highlights: ["360° 室內觀景台", "Skywalk 戶外玻璃步道", "旋轉自助餐廳", "傍晚看夕陽與夜景"],
    duration: "1 小時",
    hours: "約 10:00–19:00（最後入場前 1 小時）",
    ticket: "約 AUD 30 起（網路預購較便宜）",
    website: "https://www.sydneytowereye.com.au",
    transport: [
      { mode: "train", text: "St James 站或 Town Hall 站，步行約 5 分鐘" },
      { mode: "walk", text: "入口在 Westfield Sydney 購物中心（Pitt Street Mall）5 樓" },
    ],
    tips: "很多雪梨景點套票（例如結合 SEA LIFE 水族館）有包含雪梨塔，可以比價看看。",
  },
  {
    id: "darling-harbour",
    city: "sydney",
    name: "達令港",
    en: "Darling Harbour",
    category: "landmark",
    lat: -33.8749, lng: 151.2005,
    wiki: "Darling_Harbour",
    summary: "市中心西側的濱水休閒區，水族館、動物園、餐廳都集中在這裡。",
    description:
      "沿著港灣有一整排餐廳與酒吧，周邊有 SEA LIFE 雪梨水族館、WILD LIFE 雪梨動物園、杜莎夫人蠟像館，以及澳洲國家海事博物館。旁邊的中國友誼花園（誼園）很安靜，適合散步。",
    highlights: ["SEA LIFE 雪梨水族館", "WILD LIFE 雪梨動物園（無尾熊、袋鼠）", "澳洲國家海事博物館", "中國友誼花園（誼園）"],
    duration: "2–4 小時",
    hours: "區域全天開放；各館約 09:30–17:00",
    ticket: "區域免費；各館另外收費",
    website: "https://www.darlingharbour.com",
    transport: [
      { mode: "walk", text: "從 Town Hall 站步行約 10 分鐘" },
      { mode: "lightrail", text: "輕軌 L1 線 Exhibition Centre／Convention 站" },
      { mode: "ferry", text: "F4 渡輪 Pyrmont Bay 碼頭" },
    ],
    tips: "傍晚來吃飯、看港灣夜景最舒服；想多去幾個館，可以買 Merlin 聯票。",
  },
  {
    id: "taronga-zoo",
    city: "sydney",
    name: "塔隆加動物園",
    en: "Taronga Zoo Sydney",
    category: "nature",
    lat: -33.8436, lng: 151.2412,
    wiki: "Taronga_Zoo_Sydney",
    summary: "位在海港北岸山坡上，邊看長頸鹿邊看歌劇院與市區天際線。",
    description:
      "飼養超過 4,000 隻動物，包括無尾熊、袋鼠、鴨嘴獸等澳洲特有種。園區依山而建，搭 Sky Safari 纜車從碼頭上山最輕鬆。長頸鹿區背後就是雪梨市景，是很經典的照片。",
    highlights: ["長頸鹿＋雪梨天際線", "澳洲原生動物區", "鳥類與海獅表演", "Sky Safari 纜車"],
    duration: "3–5 小時",
    hours: "約 09:30–17:00（冬季至 16:30）",
    ticket: "成人約 AUD 50 起（網路預購較便宜）",
    website: "https://taronga.org.au/sydney-zoo",
    transport: [
      { mode: "ferry", text: "從 Circular Quay 2 號碼頭搭 F2 渡輪，約 12 分鐘到 Taronga Zoo 碼頭" },
      { mode: "walk", text: "下船後搭 Sky Safari 纜車到動物園上方入口，再一路往下逛回碼頭" },
    ],
    tips: "建議早上去，動物比較活躍；下午可以接著搭渡輪去 Manly。",
  },
  {
    id: "bondi-beach",
    city: "sydney",
    name: "邦代海灘＆海岸步道",
    en: "Bondi Beach & Bondi to Coogee Walk",
    category: "beach",
    lat: -33.8915, lng: 151.2767,
    wiki: "Bondi_Beach",
    summary: "雪梨最有名的衝浪海灘，再接一段絕美的懸崖海岸步道。",
    description:
      "長約 1 公里的金黃沙灘，是衝浪與日光浴的熱門地點。南端的 Bondi Icebergs 海水泳池是熱門拍照點。從這裡出發的邦代至庫吉海岸步道全長約 6 公里，沿途經過 Tamarama、Bronte、Clovelly 等小海灣。",
    highlights: ["Bondi Icebergs 海水泳池", "邦代至庫吉海岸步道（約 6 km）", "衝浪課程", "週日 Bondi Markets"],
    duration: "半天",
    hours: "全天開放",
    ticket: "免費（Icebergs 泳池需付費）",
    website: "https://www.waverley.nsw.gov.au",
    transport: [
      { mode: "train", text: "T4 線到 Bondi Junction 站" },
      { mode: "bus", text: "在 Bondi Junction 轉 333 或 380 號公車，約 15 分鐘到海灘" },
      { mode: "bus", text: "從市中心直接搭 333 號公車，約 40 分鐘" },
    ],
    tips: "步道沿途日曬強，記得帶水、帽子和防曬；走到 Bronte（約 2.5 km）就折返也很划算。只在紅黃旗之間游泳。",
  },
  {
    id: "manly",
    city: "sydney",
    name: "曼利海灘",
    en: "Manly Beach",
    category: "beach",
    lat: -33.7967, lng: 151.2885,
    wiki: "Manly,_New_South_Wales",
    summary: "搭渡輪 30 分鐘就到的海濱小鎮，沿途就是最棒的海港遊船。",
    description:
      "從 Circular Quay 搭渡輪過去，一路可以看到歌劇院、港灣大橋和海港景色，被稱為「全世界最划算的遊船」。到了之後沿 The Corso 步行街走到衝浪海灘，再往南散步到浮潛勝地 Shelly Beach。",
    highlights: ["Manly 渡輪海港風光", "The Corso 步行街", "Shelly Beach 浮潛", "North Head 觀景台"],
    duration: "半天",
    hours: "全天開放",
    ticket: "免費（渡輪用 Opal 或信用卡感應付款）",
    website: "https://www.hellomanly.com.au",
    transport: [
      { mode: "ferry", text: "從 Circular Quay 3 號碼頭搭 F1 渡輪，約 30 分鐘" },
      { mode: "ferry", text: "也有 Manly Fast Ferry 快船，約 18 分鐘（另外計費）" },
    ],
    tips: "去程坐船的右側（往前看的右手邊）可以看到歌劇院；回程時間如果剛好是黃昏，海港景色最美。",
  },
  {
    id: "watsons-bay",
    city: "sydney",
    name: "屈臣氏灣",
    en: "Watsons Bay",
    category: "nature",
    lat: -33.8433, lng: 151.2826,
    wiki: "Watsons_Bay",
    summary: "海港入口的寧靜小漁村，懸崖步道與炸魚薯條。",
    description:
      "位在南岬（South Head）半島上，一邊是平靜的港灣，一邊是太平洋的懸崖峭壁。可以走 Gap Park 懸崖步道，或到 Hornby 紅白燈塔，再到 Doyles 吃一份有名的炸魚薯條。",
    highlights: ["The Gap 懸崖觀景", "Hornby 紅白條紋燈塔", "Doyles 海鮮餐廳", "Camp Cove 小海灘"],
    duration: "2–3 小時",
    hours: "全天開放",
    ticket: "免費",
    website: "https://www.woollahra.nsw.gov.au",
    transport: [
      { mode: "ferry", text: "從 Circular Quay 4 號碼頭搭 F9 渡輪，約 20 分鐘" },
      { mode: "bus", text: "從市中心搭 324 或 325 號公車，約 40 分鐘" },
    ],
    tips: "搭渡輪去、搭公車回來，可以看到不同的風景。",
  },
  {
    id: "blue-mountains",
    city: "sydney",
    name: "藍山國家公園・三姊妹岩",
    en: "Blue Mountains – Three Sisters",
    category: "nature",
    lat: -33.7320, lng: 150.3117,
    wiki: "Three_Sisters_(Australia)",
    summary: "世界自然遺產，因尤加利樹揮發的油氣讓山谷呈現淡淡的藍色。",
    description:
      "距離雪梨約 2 小時車程，是最受歡迎的一日遊行程。在 Echo Point 觀景台可以看到著名的三姊妹岩。旁邊的 Scenic World 有全世界最陡的觀光鐵道、空中纜車與雨林步道，也可以走健行步道下到山谷。",
    highlights: ["Echo Point 觀景台看三姊妹岩", "Scenic World 陡坡鐵道與空中纜車", "Wentworth Falls 瀑布", "Leura 小鎮咖啡廳"],
    duration: "一整天",
    hours: "觀景台全天開放；Scenic World 約 09:00–17:00",
    ticket: "觀景台免費；Scenic World 約 AUD 50 起",
    website: "https://www.nationalparks.nsw.gov.au/visit-a-park/parks/blue-mountains-national-park",
    transport: [
      { mode: "train", text: "從 Central 站搭 Blue Mountains Line 到 Katoomba 站，約 2 小時" },
      { mode: "bus", text: "Katoomba 站轉 686 號公車到 Echo Point，或步行約 25 分鐘" },
      { mode: "car", text: "從雪梨市區開車約 1.5–2 小時" },
    ],
    tips: "山上比市區冷 5–10 度，記得帶外套。Opal 有每日扣款上限，週末搭長途火車特別划算。",
  },

  /* ───────────── 坎培拉 ───────────── */
  {
    id: "parliament-house",
    city: "canberra",
    name: "國會大廈",
    en: "Parliament House",
    category: "landmark",
    lat: -35.3081, lng: 149.1245,
    wiki: "Parliament_House,_Canberra",
    summary: "澳洲聯邦國會所在地，免費參觀，還能旁聽國會開議。",
    description:
      "1988 年啟用，建築一部分埋在山丘裡，頂端有一根 81 公尺高的旗桿。館內可以參觀眾議院與參議院議場、大廳的大理石柱和巨幅掛毯；國會開議日還可以旁聽「質詢時間」。",
    highlights: ["免費導覽", "眾議院與參議院議場", "國會開議日旁聽質詢時間", "屋頂觀景台眺望首都"],
    duration: "1.5–2 小時",
    hours: "約 09:00–17:00",
    ticket: "免費（需過安檢）",
    website: "https://www.aph.gov.au/Visit_Parliament",
    transport: [
      { mode: "bus", text: "搭 Transport Canberra 公車到 Parliament House 站" },
      { mode: "car", text: "地下停車場（付費）" },
    ],
    tips: "出門前先查官網的開議日曆，開議日人比較多，但可以看到真實的議事過程。",
  },
  {
    id: "old-parliament-house",
    city: "canberra",
    name: "舊國會大廈（澳洲民主博物館）",
    en: "Museum of Australian Democracy at Old Parliament House",
    category: "museum",
    lat: -35.3022, lng: 149.1295,
    wiki: "Old_Parliament_House,_Canberra",
    summary: "1927–1988 年的國會舊址，現在是互動式的民主博物館。",
    description:
      "白色的舊國會大廈保留了當年的議場、總理辦公室與記者室，展示澳洲民主制度的發展。前方草坪上的原住民帳篷大使館，是重要的原住民權利運動地點。",
    highlights: ["舊議場與總理辦公室", "互動式民主展覽", "原住民帳篷大使館", "玫瑰花園"],
    duration: "1.5 小時",
    hours: "約 09:00–17:00",
    ticket: "低廉或免費（以官網為準）",
    website: "https://www.moadoph.gov.au",
    transport: [
      { mode: "walk", text: "從新國會大廈步行約 15 分鐘（直線往湖的方向）" },
      { mode: "bus", text: "公車到 King George Terrace 一帶的站牌" },
    ],
    tips: "新、舊國會大廈與國家美術館都在「國會三角區」，可以排在同一天步行參觀。",
  },
  {
    id: "national-gallery",
    city: "canberra",
    name: "澳洲國家美術館",
    en: "National Gallery of Australia",
    category: "museum",
    lat: -35.3000, lng: 149.1366,
    wiki: "National_Gallery_of_Australia",
    summary: "澳洲最大的美術館，原住民藝術收藏是世界級的。",
    description:
      "收藏超過 15 萬件作品，涵蓋原住民與托雷斯海峽島民藝術、澳洲藝術以及國際名作。戶外雕塑花園裡有詹姆斯・特瑞爾的光之裝置《Within without》，是很特別的空間體驗。",
    highlights: ["原住民藝術展廳", "雕塑花園", "James Turrell《Within without》", "國際現代藝術"],
    duration: "2–3 小時",
    hours: "約 10:00–17:00",
    ticket: "常設展免費；特展另外收費",
    website: "https://nga.gov.au",
    transport: [
      { mode: "walk", text: "位於國會三角區，從舊國會大廈步行約 10 分鐘" },
      { mode: "bus", text: "公車到 National Gallery 或 Parkes Place 一帶的站牌" },
    ],
    tips: "旁邊就是國家肖像館和 Questacon 國家科學中心，時間夠可以一起逛。",
  },
  {
    id: "lake-burley-griffin",
    city: "canberra",
    name: "格里芬湖",
    en: "Lake Burley Griffin",
    category: "nature",
    lat: -35.2925, lng: 149.1300,
    wiki: "Lake_Burley_Griffin",
    summary: "坎培拉市中心的人工湖，環湖騎單車、看庫克船長紀念噴泉。",
    description:
      "以坎培拉的設計師格里芬命名，是整座城市規劃的中心軸。湖上的庫克船長紀念噴泉可以噴到 147 公尺高；湖畔還有國家鐘樓（National Carillon）。很適合租單車環湖，或在湖邊野餐。",
    highlights: ["庫克船長紀念噴泉", "國家鐘樓", "環湖單車道", "Regatta Point 首都展覽館"],
    duration: "1–3 小時",
    hours: "全天開放；噴泉約 11:00–14:00、16:00–18:00 運作",
    ticket: "免費",
    website: "https://www.nca.gov.au/attractions/lake-burley-griffin",
    transport: [
      { mode: "walk", text: "從市中心 Civic 往南走約 15 分鐘到湖邊" },
      { mode: "bus", text: "多條公車經過 Commonwealth Avenue 湖岸" },
    ],
    tips: "Regatta Point 附近可以拍噴泉＋國會大廈的畫面。風大時噴泉會暫停。",
  },
  {
    id: "war-memorial",
    city: "canberra",
    name: "澳洲戰爭紀念館",
    en: "Australian War Memorial",
    category: "museum",
    lat: -35.2809, lng: 149.1489,
    wiki: "Australian_War_Memorial",
    summary: "結合紀念堂、博物館與檔案館，每天傍晚有感人的熄燈號儀式。",
    description:
      "被評為澳洲最受歡迎的博物館之一，展示澳洲參與過的歷次戰爭，展品包括戰機、坦克與大型立體場景。紀念廳的「榮譽榜」刻有超過十萬名陣亡者的名字。每天閉館前的「熄燈號儀式」（Last Post Ceremony）非常莊嚴。",
    highlights: ["每日 16:55 熄燈號儀式", "榮譽榜與無名戰士墓", "航空展廳", "從大門直望澳紐軍團大道與國會大廈"],
    duration: "2–3 小時",
    hours: "約 10:00–17:00",
    ticket: "免費",
    website: "https://www.awm.gov.au",
    transport: [
      { mode: "bus", text: "公車到 Treloar Crescent 一帶的站牌" },
      { mode: "walk", text: "從市中心 Civic 步行約 30 分鐘，或沿澳紐軍團大道走上來" },
    ],
    tips: "可以把參觀排在下午，看完熄燈號儀式後，開車上安斯利山看夕陽。",
  },
  {
    id: "mount-ainslie",
    city: "canberra",
    name: "安斯利山觀景台",
    en: "Mount Ainslie Lookout",
    category: "nature",
    lat: -35.2706, lng: 149.1592,
    wiki: "Mount_Ainslie",
    summary: "坎培拉最經典的觀景點，一眼看完整條首都中軸線。",
    description:
      "海拔 843 公尺，從觀景台往下看，戰爭紀念館、澳紐軍團大道、格里芬湖與國會大廈排成一直線，可以清楚看到坎培拉的城市規劃。日出和黃昏是最好的時間。",
    highlights: ["首都中軸線全景", "日落與夜景", "從戰爭紀念館後方健行上山", "常有袋鼠出沒"],
    duration: "1 小時（健行來回約 2 小時）",
    hours: "全天開放",
    ticket: "免費",
    website: "https://www.visitcanberra.com.au",
    transport: [
      { mode: "car", text: "開車到山頂停車場，從市中心約 10 分鐘" },
      { mode: "walk", text: "從戰爭紀念館後方的 Kokoda Track 紀念步道上山，單程約 45 分鐘" },
    ],
    tips: "傍晚開車上下山要注意路上的袋鼠。",
  },
  {
    id: "national-museum",
    city: "canberra",
    name: "澳洲國家博物館",
    en: "National Museum of Australia",
    category: "museum",
    lat: -35.2929, lng: 149.1213,
    wiki: "National_Museum_of_Australia",
    summary: "色彩大膽的後現代建築，講述澳洲的土地、原住民與移民故事。",
    description:
      "位在格里芬湖畔的 Acton 半島，建築本身就像一件藝術品。常設展介紹原住民文化、澳洲的自然環境，以及從殖民到現代的社會變遷，內容豐富、適合各年齡層。",
    highlights: ["First Australians 原住民展廳", "大型互動展品", "湖畔花園 Garden of Australian Dreams", "建築造型"],
    duration: "2 小時",
    hours: "約 09:00–17:00",
    ticket: "常設展免費；特展另外收費",
    website: "https://www.nma.gov.au",
    transport: [
      { mode: "bus", text: "公車到 National Museum 站" },
      { mode: "walk", text: "從市中心 Civic 步行約 25 分鐘" },
    ],
    tips: "館內有面湖的咖啡廳，適合中途休息。",
  },
  {
    id: "national-arboretum",
    city: "canberra",
    name: "國家植物樹木園",
    en: "National Arboretum Canberra",
    category: "nature",
    lat: -35.2881, lng: 149.0697,
    wiki: "National_Arboretum_Canberra",
    summary: "種有上百種稀有與瀕危樹木的山丘公園，可以俯瞰整座城市與湖景。",
    description:
      "在 2003 年森林大火後重建，種有來自世界各地的稀有與瀕危樹種。遊客中心有盆景收藏，戶外有以種子造型設計的 Pod Playground 遊樂場，山頂的 Dairy Farmers Hill 是看湖景與市區的好地方。",
    highlights: ["Dairy Farmers Hill 觀景點", "國家盆景與盆栽收藏", "Pod Playground", "雕塑《Wide Brown Land》"],
    duration: "1.5–2 小時",
    hours: "園區約 06:00–20:30（冬季至 17:30）；遊客中心約 09:00–16:00",
    ticket: "免費（停車需付費）",
    website: "https://www.nationalarboretum.act.gov.au",
    transport: [
      { mode: "car", text: "從市中心開車約 10 分鐘，建議開車或搭計程車" },
      { mode: "bus", text: "週末有部分公車路線經過，班次少，出發前先查詢" },
    ],
    tips: "遊客中心的咖啡廳有很好的湖景，可以排在早上或日落時段。",
  },
];

/*
 * 我們的行程（資料來源：Notion「UNSW TacEdge Workshop｜澳洲行程」）
 * 每一天：
 *   day 第幾天、date 日期、title 標題、city 所在城市、stay 住宿 id（見 PLACES）
 *   events 固定行程（時間＋事件），stops 建議順路去的景點 id（照順序，會畫在地圖上）
 * ⚠️ 網站是公開的：訂位代號、訂房連結、收據、完整地址不要放在這裡。
 */
const ITINERARY = [
  {
    day: 1, date: "2026-11-11", title: "出發！台北 → 雪梨", city: "taipei", stay: null,
    events: [
      { time: "20:30", icon: "🧳", text: "抵達桃園機場第二航廈，辦理報到（建議起飛前 3 小時）" },
      { time: "23:50", icon: "✈️", text: "華航 CI51 起飛（桃園 T2 → 雪梨），在飛機上過夜" },
    ],
    stops: [],
  },
  {
    day: 2, date: "2026-11-12", title: "抵達雪梨 → 搭巴士到坎培拉", city: "canberra", stay: "stay-canberra",
    events: [
      { time: "12:15", icon: "🛬", text: "抵達雪梨機場國際線 T1，入境、領行李（記得申報食物）" },
      { time: "15:25", icon: "🚌", text: "Murrays Coaches 巴士出發：國際線 T1 的 Bay 9（Bus & Coach Bays）", place: "syd-airport" },
      { time: "約 18:45", icon: "📍", text: "抵達坎培拉 Jolimont Centre（實際時間以車票為準）", place: "jolimont" },
      { time: "晚上", icon: "🏠", text: "入住坎培拉住宿（Canberra CBD，從 Jolimont 步行可到）" },
    ],
    stops: ["lake-burley-griffin"],
    note: "時間有限，傍晚有力氣的話走到湖邊散步就好，早點休息準備隔天工作坊。",
  },
  {
    day: 3, date: "2026-11-13", title: "TacEdge 工作坊", city: "canberra", stay: "stay-canberra",
    events: [
      { time: "上午", icon: "🎤", text: "專題演講", place: "unsw-canberra" },
      { time: "下午", icon: "🛰️", text: "實作課程：SDR、SAR／光學衛星影像、AI 物件偵測、機器人搶旗賽", place: "unsw-canberra" },
    ],
    stops: [],
    note: "地點：UNSW Canberra City Campus。記得帶筆電＋充電器、學生證。集合時間以行前說明為準。",
  },
  {
    day: 4, date: "2026-11-14", title: "工作坊／校園參訪 → 回雪梨", city: "canberra", stay: "stay-sydney",
    events: [
      { time: "上午", icon: "🏫", text: "工作坊／校園參訪（以行前說明為準）" },
      { time: "15:00", icon: "🚌", text: "Murrays Coaches 巴士出發：Jolimont Centre Bay 6／7（65 Northbourne Ave）", place: "jolimont" },
      { time: "約 18:30", icon: "📍", text: "抵達雪梨（下車地點與時間以車票為準）" },
      { time: "晚上", icon: "🏠", text: "入住雪梨住宿（Randwick）：從 Central 站搭輕軌 L2 到 Randwick 約 30 分鐘" },
    ],
    stops: ["parliament-house", "national-gallery", "war-memorial"],
    note: "如果上午有空檔，國會三角區的景點都免費，搭巴士前可以挑一個去。",
  },
  {
    day: 5, date: "2026-11-15", title: "雪梨自由行：海岸＋海港", city: "sydney", stay: "stay-sydney",
    events: [
      { time: "早上", icon: "🌊", text: "住宿在 Randwick，離 Coogee 很近：可以反向走 Coogee → Bondi 海岸步道（約 6 km）" },
      { time: "中午", icon: "🚌", text: "從 Bondi 搭 333 號公車進市區" },
      { time: "下午", icon: "🏛️", text: "環形碼頭：歌劇院、植物園、港灣大橋、岩石區" },
      { time: "晚上", icon: "🌃", text: "岩石區吃晚餐、看海港夜景" },
    ],
    stops: ["bondi-beach", "opera-house", "botanic-garden", "harbour-bridge", "the-rocks"],
  },
  {
    day: 6, date: "2026-11-16", title: "市區逛逛 → 回台灣", city: "sydney", stay: null,
    events: [
      { time: "上午", icon: "🧳", text: "退房（行李可以先問房東能否寄放）" },
      { time: "白天", icon: "🛍️", text: "市中心：QVB、雪梨塔、達令港" },
      { time: "19:00", icon: "🚕", text: "前往雪梨機場國際線 T1（從 Randwick 搭計程車約 20 分鐘）", place: "syd-airport" },
      { time: "22:10", icon: "✈️", text: "華航 CI52 起飛（雪梨 T1 → 桃園）" },
    ],
    stops: ["qvb", "sydney-tower", "darling-harbour"],
  },
];

/* 行程相關地點（住宿只標大概區域，不放完整地址） */
const PLACES = [
  { id: "stay-canberra", city: "canberra", icon: "🏠", name: "坎培拉住宿", detail: "Charming 1BR Oasis（Canberra CBD）・11/12–11/14", lat: -35.2795, lng: 149.1305, approx: true },
  { id: "stay-sydney",   city: "sydney",   icon: "🏠", name: "雪梨住宿",   detail: "Fantastic Garden Studio（Randwick）・11/14–11/16", lat: -33.9146, lng: 151.2413, approx: true },
  { id: "unsw-canberra", city: "canberra", icon: "🎓", name: "UNSW Canberra City Campus", detail: "TacEdge 工作坊會場", lat: -35.2837, lng: 149.1326 },
  { id: "jolimont",      city: "canberra", icon: "🚌", name: "Jolimont Centre", detail: "Murrays 巴士站・65 Northbourne Ave", lat: -35.2779, lng: 149.1291 },
  { id: "syd-airport",   city: "sydney",   icon: "✈️", name: "雪梨機場國際線 T1", detail: "華航航班／Murrays 巴士 Bay 9", lat: -33.9361, lng: 151.1664 },
];

/* 旅程基本資訊（不含訂位代號） */
const TRIP = {
  name: "UNSW TacEdge Workshop｜澳洲行",
  start: "2026-11-11",
  end: "2026-11-16",
  timezone: "澳洲東部 11 月是夏令時間（AEDT, UTC+11），比台灣快 3 小時",
  flights: [
    { label: "去程", text: "11/11（三）華航 CI51・23:50 桃園 T2 起飛 → 11/12 12:15 抵達雪梨 T1" },
    { label: "回程", text: "11/16（一）華航 CI52・22:10 雪梨 T1 起飛" },
  ],
  buses: [
    { label: "雪梨 → 坎培拉", text: "11/12（四）15:25・Murrays Coaches・雪梨機場 T1 Bay 9" },
    { label: "坎培拉 → 雪梨", text: "11/14（六）15:00・Murrays Coaches・Jolimont Centre Bay 6／7" },
  ],
  stays: [
    { label: "坎培拉", text: "11/12–11/14・Charming 1BR Oasis（Canberra CBD）" },
    { label: "雪梨", text: "11/14–11/16・Fantastic Garden Studio（Randwick）" },
  ],
  todo: [
    { text: "確認護照效期（6 個月以上）", done: true },
    { text: "申請澳洲 ETA 電子簽證（Australian ETA App）", done: false },
    { text: "訂來回機票", done: true },
    { text: "訂雪梨 ↔ 坎培拉巴士", done: true },
    { text: "訂坎培拉、雪梨住宿", done: true },
    { text: "繳工作坊報名費", done: true },
    { text: "保旅遊平安險＋不便險", done: false },
    { text: "參加行前說明，確認參訪學校和日期", done: false },
    { text: "換澳幣／準備可海外刷卡的信用卡", done: false },
    { text: "網卡或 eSIM", done: false },
    { text: "確認成果繳交的格式和期限", done: false },
    { text: "兵役出境申請", done: true },
    { text: "出發前兩天選機位", done: false },
  ],
  packing: [
    "護照＋ETA 確認", "機票／住宿確認信（存手機＋截圖）", "筆電＋充電器（工作坊實作會用到）",
    "澳洲轉接頭（I 型插座，230V）", "行動電源（放隨身行李）", "薄外套（坎培拉早晚偏涼）",
    "防曬乳、太陽眼鏡（紫外線很強）", "個人藥品", "學生證",
  ],
  emergency: [
    { label: "澳洲緊急電話（警察／消防／救護）", text: "000" },
  ],
};

/* 雪梨 ↔ 坎培拉 城際交通 */
const INTERCITY = [
  { mode: "bus",   text: "長途巴士（Murrays、Greyhound）：約 3–3.5 小時，班次最多、最常用" },
  { mode: "train", text: "NSW TrainLink 火車：從 Central 站出發，約 4–4.5 小時" },
  { mode: "car",   text: "自駕：走 M31 Hume 高速公路接 Federal Highway，約 3 小時" },
  { mode: "plane", text: "飛機：約 1 小時（加上去機場與安檢的時間，總時間跟巴士差不多）" },
];
