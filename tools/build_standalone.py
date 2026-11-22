#!/usr/bin/env python3
"""배포용 묶음 만들기.

1) dist/kinglingo-standalone.html — CSS/JS/아이콘을 모두 인라인한 단일 파일
   (Safari에서 파일로 열어도 실행됩니다. 서비스 워커·마이크는 https에서만 동작)
2) downloads/kinglingo-app.zip — 정적 호스팅에 그대로 올릴 수 있는 앱 폴더
"""
import base64
import os
import re
import zipfile

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT = os.path.dirname(HERE)
DIST = os.path.join(HERE, "dist")
DOWNLOADS = os.path.join(ROOT, "downloads")


def read(rel):
    with open(os.path.join(HERE, rel), encoding="utf-8") as f:
        return f.read()


def data_uri(path, mime="image/png"):
    with open(os.path.join(HERE, path), "rb") as f:
        return "data:%s;base64,%s" % (mime, base64.b64encode(f.read()).decode("ascii"))


def build_standalone():
    html = read("index.html")
    css = read("css/styles.css")
    js_files = ["js/data.js", "js/core.js", "js/store.js", "js/app.js"]
    js = "\n;\n".join(read(p) for p in js_files)

    html = html.replace('<link rel="stylesheet" href="./css/styles.css">',
                        "<style>\n" + css + "\n</style>")
    for path in js_files:
        html = html.replace('<script src="./%s"></script>' % path, "")
    html = html.replace("</body>", "<script>\n" + js + "\n</script>\n</body>")

    # 단일 파일에서는 매니페스트/외부 아이콘 대신 인라인 아이콘을 씁니다.
    html = re.sub(r'\s*<link rel="manifest"[^>]*>', "", html)
    html = html.replace('href="./icon-180.png"', 'href="%s"' % data_uri("icon-180.png"))
    html = html.replace('<link rel="icon" type="image/png" sizes="192x192" href="./icon-192.png">',
                        '<link rel="icon" type="image/png" href="%s">' % data_uri("icon-192.png"))
    html = html.replace('<link rel="apple-touch-icon" sizes="192x192" href="./icon-192.png">', "")
    html = html.replace("<title>킹링고 — 영어·중국어·일본어</title>",
                        "<title>킹링고 — 영어·중국어·일본어 (단일 파일)</title>")

    os.makedirs(DIST, exist_ok=True)
    out = os.path.join(DIST, "kinglingo-standalone.html")
    with open(out, "w", encoding="utf-8") as f:
        f.write(html)
    return out


def build_zip():
    os.makedirs(DOWNLOADS, exist_ok=True)
    out = os.path.join(DOWNLOADS, "kinglingo-app.zip")
    include = ["index.html", "manifest.json", "sw.js", "README.md",
               "css/styles.css", "js/data.js", "js/core.js", "js/store.js", "js/app.js",
               "icon-192.png", "icon-512.png", "icon-180.png", "icon-maskable-512.png",
               "beginner/index.html", "beginner/manifest.json", "beginner/sw.js",
               "beginner/css/styles.css", "beginner/js/data.js", "beginner/js/app.js",
               "beginner/icon-192.png", "beginner/icon-512.png", "beginner/icon-180.png",
               "hanja/index.html", "hanja/manifest.json", "hanja/sw.js",
               "hanja/css/styles.css", "hanja/js/data.js", "hanja/js/app.js",
               "hanja/icon-192.png", "hanja/icon-512.png", "hanja/icon-180.png",
               "tools/make_icons.py", "tools/make_app_icons.py", "tools/deploy.sh"]
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        for rel in include:
            z.write(os.path.join(HERE, rel), "king-language-app/" + rel)
    return out


def main():
    single = build_standalone()
    print("wrote", single, os.path.getsize(single), "bytes")
    z = build_zip()
    print("wrote", z, os.path.getsize(z), "bytes")


if __name__ == "__main__":
    main()
