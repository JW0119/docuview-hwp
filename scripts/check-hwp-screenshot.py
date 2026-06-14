#!/usr/bin/env python3
"""Fail CI when the HWP screenshot is effectively blank.

This guards against false-positive runtime QA runs where WebView launches but the
HWP rendering surface stays empty.
"""
from __future__ import annotations

import sys
from pathlib import Path
from PIL import Image


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: check-hwp-screenshot.py <10-hwp.png>", file=sys.stderr)
        return 2

    path = Path(sys.argv[1])
    image = Image.open(path).convert("RGB")
    width, height = image.size

    # Ignore Android nav bar area at the bottom; inspect only app content.
    content_height = int(height * 0.92)
    pixels = list(image.crop((0, 0, width, content_height)).getdata())
    total = len(pixels)

    non_white = 0
    dark = 0
    varied = set()
    step = max(1, total // 20000)
    for index, (r, g, b) in enumerate(pixels):
        if index % step == 0:
            varied.add((r // 8, g // 8, b // 8))
        if not (r > 246 and g > 246 and b > 246):
            non_white += 1
        if r < 210 or g < 210 or b < 210:
            dark += 1

    non_white_ratio = non_white / total
    dark_ratio = dark / total
    variety = len(varied)

    print(f"HWP screenshot={path}")
    print(f"size={width}x{height} non_white_ratio={non_white_ratio:.6f} dark_ratio={dark_ratio:.6f} variety={variety}")

    # Real rendered pages or explicit fallback/error text should have a visible
    # amount of non-white/dark pixels. A blank white WebView is far below this.
    if non_white_ratio < 0.002 or dark_ratio < 0.0005 or variety < 4:
        print("FAIL: HWP screenshot appears blank; runtime QA must not pass.", file=sys.stderr)
        return 1

    print("PASS: HWP screenshot has visible content.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
