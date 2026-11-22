#!/usr/bin/env python3
"""킹링고 입문 · 킹한자 앱 아이콘 생성기.

사용: python3 tools/make_app_icons.py
결과: beginner/icon-{180,192,512}.png, hanja/icon-{180,192,512}.png
"""
import os

from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = 1024
LATIN = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
CJK_SERIF = "/usr/share/fonts/pickle-hwp/NotoSerifCJKkr-Regular.otf"
CJK_SANS = "/usr/share/fonts/pickle-hwp/NotoSansCJKkr-Regular.otf"


def gradient(top, bottom, size=S):
    img = Image.new("RGB", (size, size), bottom)
    d = ImageDraw.Draw(img)
    for y in range(size):
        t = y / (size - 1)
        d.line([(0, y), (size, y)], fill=tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3)))
    return img.convert("RGBA")


def beginner_icon():
    img = gradient((99, 102, 241), (67, 56, 202))
    d = ImageDraw.Draw(img)
    # 은은한 격자 (쓰기 연습장 느낌)
    for i in (0.25, 0.5, 0.75):
        d.line([(0, S * i), (S, S * i)], fill=(255, 255, 255, 26), width=6)
        d.line([(S * i, 0), (S * i, S)], fill=(255, 255, 255, 26), width=6)
    f_big = ImageFont.truetype(LATIN, int(0.50 * S))
    d.text((0.44 * S, 0.46 * S), "A", font=f_big, fill=(255, 255, 255, 255), anchor="mm")
    f_small = ImageFont.truetype(CJK_SANS, int(0.19 * S))
    d.text((0.74 * S, 0.74 * S), "ñ", font=f_small, fill=(255, 255, 255, 235), anchor="mm")
    return img


def hanja_icon():
    img = gradient((205, 71, 56), (142, 36, 24))
    d = ImageDraw.Draw(img)
    # 田자 격자
    for i in (0.5,):
        d.line([(0, S * i), (S, S * i)], fill=(255, 255, 255, 40), width=7)
        d.line([(S * i, 0), (S * i, S)], fill=(255, 255, 255, 40), width=7)
    d.rectangle([S * 0.06, S * 0.06, S * 0.94, S * 0.94], outline=(255, 255, 255, 40), width=7)
    f = ImageFont.truetype(CJK_SERIF, int(0.60 * S))
    d.text((0.5 * S, 0.52 * S), "山", font=f, fill=(255, 255, 255, 255), anchor="mm")
    return img


def save_all(img, folder):
    out = os.path.join(HERE, folder)
    os.makedirs(out, exist_ok=True)
    for size in (512, 192, 180):
        img.resize((size, size), Image.LANCZOS).save(os.path.join(out, "icon-%d.png" % size))
    print("wrote", out)


if __name__ == "__main__":
    save_all(beginner_icon(), "beginner")
    save_all(hanja_icon(), "hanja")
