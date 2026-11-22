#!/usr/bin/env python3
"""킹링고 앱 아이콘 생성기 — 외부 자산 없이 PNG를 만듭니다.

사용: python3 tools/make_icons.py
결과: icon-512.png, icon-192.png, icon-180.png, icon-maskable-512.png
"""
import math
import os

from PIL import Image, ImageDraw, ImageFilter, ImageFont

S = 1024
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"


def gradient_background(size=S):
    top = (122, 227, 32)
    bottom = (70, 163, 2)
    img = Image.new("RGB", (size, size), bottom)
    draw = ImageDraw.Draw(img)
    for y in range(size):
        t = y / (size - 1)
        color = tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3))
        draw.line([(0, y), (size, y)], fill=color)
    return img.convert("RGBA")


def content_layer(size=S):
    """말풍선 + K + 반짝이를 투명 배경 위에 그립니다."""
    layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)

    x0, y0 = 0.195 * size, 0.205 * size
    x1, y1 = 0.805 * size, 0.700 * size
    radius = 0.152 * size

    # 말풍선 그림자 느낌
    shadow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle([x0, y0 + 0.028 * size, x1, y1 + 0.028 * size],
                         radius=radius, fill=(28, 90, 0, 90))
    sd.polygon([(x0 + 0.10 * size, y1 - 0.02 * size),
                (x0 + 0.10 * size, y1 + 0.135 * size),
                (x0 + 0.335 * size, y1 - 0.02 * size)], fill=(28, 90, 0, 90))
    shadow = shadow.filter(ImageFilter.GaussianBlur(0.012 * size))
    layer.alpha_composite(shadow)

    # 흰 말풍선
    d.rounded_rectangle([x0, y0, x1, y1], radius=radius, fill=(255, 255, 255, 255))
    d.polygon([(x0 + 0.10 * size, y1 - 0.015 * size),
               (x0 + 0.10 * size, y1 + 0.135 * size),
               (x0 + 0.335 * size, y1 - 0.015 * size)], fill=(255, 255, 255, 255))

    # K
    font = ImageFont.truetype(FONT_BOLD, int(0.315 * size))
    d.text((0.5 * size, 0.452 * size), "K", font=font, fill=(70, 163, 2, 255), anchor="mm")

    # 반짝이(별)
    cx, cy, r = 0.795 * size, 0.215 * size, 0.085 * size
    pts = []
    for i in range(10):
        ang = -math.pi / 2 + i * math.pi / 5
        rr = r if i % 2 == 0 else r * 0.45
        pts.append((cx + rr * math.cos(ang), cy + rr * math.sin(ang)))
    d.polygon(pts, fill=(255, 200, 0, 255), outline=(255, 255, 255, 255), width=int(0.012 * size))

    return layer


def compose(size=S, scale=1.0):
    bg = gradient_background(size)
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([-0.25 * size, -0.35 * size, 0.75 * size, 0.55 * size], fill=(255, 255, 255, 42))
    glow = glow.filter(ImageFilter.GaussianBlur(0.05 * size))
    bg.alpha_composite(glow)

    content = content_layer(size)
    if scale != 1.0:
        small = content.resize((int(size * scale), int(size * scale)), Image.LANCZOS)
        canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        offset = (size - small.width) // 2
        canvas.paste(small, (offset, offset), small)
        content = canvas
    bg.alpha_composite(content)
    return bg


def save(img, name, size):
    out = img.resize((size, size), Image.LANCZOS).convert("RGB")
    path = os.path.join(HERE, name)
    out.save(path, "PNG", optimize=True)
    print("wrote", path, out.size)


def main():
    base = compose(S, 1.0)
    maskable = compose(S, 0.82)
    save(base, "icon-512.png", 512)
    save(base, "icon-192.png", 192)
    save(base, "icon-180.png", 180)
    save(maskable, "icon-maskable-512.png", 512)


if __name__ == "__main__":
    main()
