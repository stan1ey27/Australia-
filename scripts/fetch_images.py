"""
下載景點照片（Wikimedia Commons，寬 960px）到 images/<景點id>.jpg，並產生 js/credits.js（作者與授權）。
已經有照片的景點會跳過，所以可以重複執行。

用法：python3 scripts/fetch_images.py
"""
import html, json, os, re, sys, time, urllib.parse, urllib.request

UA = "AustraliaTripSite/1.0 (https://github.com/stan1ey27/Australia-)"
ROOT = sys.argv[1] if len(sys.argv) > 1 else "."
# 維基條目首圖不適合、或不是 Commons 上的自由授權圖時，手動指定 Commons 檔名
OVERRIDES = {"qvb": "20230805 Queen Victoria Building.jpg"}

CREDITS_JSON = f"{ROOT}/js/credits.json"
CREDITS_JS = f"{ROOT}/js/credits.js"


def get(url):
    err = None
    for i in range(5):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            return urllib.request.urlopen(req, timeout=30).read()
        except Exception as e:  # 429 限速時等一下再試
            err = e
            print(f"  retry in {30 * (i + 1)}s: {e}", flush=True)
            time.sleep(30 * (i + 1))
    raise err


def write_credits(credits):
    json.dump(credits, open(CREDITS_JSON, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    open(CREDITS_JS, "w", encoding="utf-8").write(
        "/* 照片來源（Wikimedia Commons），由 scripts/fetch_images.py 產生 */\n"
        "const PHOTO_CREDITS = " + json.dumps(credits, ensure_ascii=False, indent=2) + ";\n")


def commons_file_for(wiki_title):
    s = json.loads(get("https://en.wikipedia.org/api/rest_v1/page/summary/" + urllib.parse.quote(wiki_title)))
    src = (s.get("originalimage") or s.get("thumbnail") or {}).get("source", "").split("?")[0]
    m = re.search(r"/wikipedia/(\w+)/(?:thumb/)?\w/\w\w/([^/]+)", src)
    if not m or m.group(1) != "commons":
        return None
    return urllib.parse.unquote(m.group(2))


def main():
    src = open(f"{ROOT}/js/data.js", encoding="utf-8").read()
    items = re.findall(r'id: "([^"]+)",.*?wiki: "([^"]+)"', src, re.S)
    credits = json.load(open(CREDITS_JSON, encoding="utf-8")) if os.path.exists(CREDITS_JSON) else {}
    os.makedirs(f"{ROOT}/images", exist_ok=True)
    failed = []
    for id_, wiki in items:
        if id_ in credits and os.path.exists(f"{ROOT}/images/{id_}.jpg"):
            continue
        try:
            fname = OVERRIDES.get(id_) or commons_file_for(wiki)
            if not fname:
                print(f"{id_:22} 沒有 Commons 照片，請在 OVERRIDES 指定", flush=True)
                failed.append(id_)
                continue
            q = json.loads(get(
                "https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2"
                "&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=960&titles="
                + urllib.parse.quote("File:" + fname)))
            ii = q["query"]["pages"][0]["imageinfo"][0]
            data = get(ii["thumburl"])
            open(f"{ROOT}/images/{id_}.jpg", "wb").write(data)
            em = ii.get("extmetadata", {})
            artist = html.unescape(em.get("Artist", {}).get("value", "Unknown"))
            artist = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", artist)).strip()
            credits[id_] = {
                "file": fname,
                "author": artist[:80],
                "license": em.get("LicenseShortName", {}).get("value", ""),
                "url": ii["descriptionurl"],
            }
            write_credits(credits)
            print(f"{id_:22} {len(data) // 1024:5}KB  {credits[id_]['license']}  {fname}", flush=True)
        except Exception as e:
            print(f"{id_:22} 失敗：{e}", flush=True)
            failed.append(id_)
        time.sleep(5)
    write_credits(credits)
    print(f"完成：{len(credits)} 張照片；失敗：{failed or '無'}")


if __name__ == "__main__":
    main()
