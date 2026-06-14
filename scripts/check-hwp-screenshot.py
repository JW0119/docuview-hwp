#!/usr/bin/env python3
"""Fail CI when the HWP screenshot is effectively blank.

Dependency-free PNG reader for Android screencap PNGs. This guards against false
positive runtime QA runs where WebView launches but the HWP rendering surface
stays empty.
"""
from __future__ import annotations

import struct
import sys
import zlib
from pathlib import Path

PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"


def paeth(a: int, b: int, c: int) -> int:
    p = a + b - c
    pa = abs(p - a)
    pb = abs(p - b)
    pc = abs(p - c)
    if pa <= pb and pa <= pc:
        return a
    if pb <= pc:
        return b
    return c


def read_png_rgb(path: Path) -> tuple[int, int, list[tuple[int, int, int]]]:
    data = path.read_bytes()
    if not data.startswith(PNG_SIGNATURE):
        raise ValueError("not a PNG file")
    offset = len(PNG_SIGNATURE)
    width = height = bit_depth = color_type = None
    compressed = bytearray()
    while offset < len(data):
        length = struct.unpack(">I", data[offset:offset + 4])[0]
        chunk_type = data[offset + 4:offset + 8]
        chunk = data[offset + 8:offset + 8 + length]
        offset += 12 + length
        if chunk_type == b"IHDR":
            width, height, bit_depth, color_type, compression, filter_method, interlace = struct.unpack(">IIBBBBB", chunk)
            if bit_depth != 8 or compression != 0 or filter_method != 0 or interlace != 0:
                raise ValueError("unsupported PNG format")
            if color_type not in (2, 6):
                raise ValueError(f"unsupported PNG color type {color_type}")
        elif chunk_type == b"IDAT":
            compressed.extend(chunk)
        elif chunk_type == b"IEND":
            break
    if width is None or height is None:
        raise ValueError("missing IHDR")

    channels = 3 if color_type == 2 else 4
    bpp = channels
    stride = width * channels
    raw = zlib.decompress(bytes(compressed))
    rows: list[bytes] = []
    pos = 0
    prev = bytearray(stride)
    pixels: list[tuple[int, int, int]] = []
    for _ in range(height):
        filter_type = raw[pos]
        pos += 1
        scan = bytearray(raw[pos:pos + stride])
        pos += stride
        recon = bytearray(stride)
        for i, value in enumerate(scan):
            left = recon[i - bpp] if i >= bpp else 0
            up = prev[i]
            up_left = prev[i - bpp] if i >= bpp else 0
            if filter_type == 0:
                recon[i] = value
            elif filter_type == 1:
                recon[i] = (value + left) & 0xFF
            elif filter_type == 2:
                recon[i] = (value + up) & 0xFF
            elif filter_type == 3:
                recon[i] = (value + ((left + up) // 2)) & 0xFF
            elif filter_type == 4:
                recon[i] = (value + paeth(left, up, up_left)) & 0xFF
            else:
                raise ValueError(f"unsupported PNG filter {filter_type}")
        prev = recon
        for i in range(0, stride, channels):
            pixels.append((recon[i], recon[i + 1], recon[i + 2]))
    return width, height, pixels


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: check-hwp-screenshot.py <10-hwp.png>", file=sys.stderr)
        return 2

    path = Path(sys.argv[1])
    width, height, pixels_all = read_png_rgb(path)
    content_height = int(height * 0.92)
    pixels = pixels_all[:width * content_height]
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

    if non_white_ratio < 0.002 or dark_ratio < 0.0005 or variety < 4:
        print("FAIL: HWP screenshot appears blank; runtime QA must not pass.", file=sys.stderr)
        return 1

    print("PASS: HWP screenshot has visible content.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
