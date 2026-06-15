#!/usr/bin/env python3
"""Validate HWP runtime QA artifacts against the real viewer contract.

This intentionally fails on the repeated false-success/fallback classes:
- app never reads the fixture,
- WebView/WASM reports failure,
- no engine success marker,
- no page-change marker after swipe,
- screenshot is blank/fallback-like,
- after-swipe screenshot is byte-identical to the first page.
"""
from __future__ import annotations

import hashlib
import importlib.util
import json
import re
import subprocess
import sys
from pathlib import Path


_SCREENSHOT_CHECK = Path(__file__).with_name("check-hwp-screenshot.py")
_SPEC = importlib.util.spec_from_file_location("check_hwp_screenshot", _SCREENSHOT_CHECK)
if _SPEC is None or _SPEC.loader is None:
    raise RuntimeError(f"unable to load {_SCREENSHOT_CHECK}")
_SCREENSHOT_MODULE = importlib.util.module_from_spec(_SPEC)
_SPEC.loader.exec_module(_SCREENSHOT_MODULE)
read_png_rgb = _SCREENSHOT_MODULE.read_png_rgb


def run(cmd: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def image_stats(path: Path) -> dict[str, float]:
    width, height, pixels = read_png_rgb(path)
    sample = pixels[::max(1, len(pixels) // 200000)]
    dark = sum(1 for r, g, b in sample if r < 48 and g < 56 and b < 72) / len(sample)
    bright = sum(1 for r, g, b in sample if r > 210 and g > 210 and b > 210) / len(sample)
    return {"dark_ratio": dark, "bright_ratio": bright, "variety": len(set(sample)), "width": width, "height": height}


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: check-hwp-runtime-contract.py <qa-artifacts-dir>", file=sys.stderr)
        return 2

    artifacts = Path(sys.argv[1])
    log_path = artifacts / "logcat-tail.txt"
    first = artifacts / "10-hwp.png"
    after_left = artifacts / "11-hwp-after-left-swipe.png"
    required = [log_path, first, after_left]
    missing = [str(p) for p in required if not p.exists()]
    if missing:
        print("FAIL: missing HWP QA artifacts: " + ", ".join(missing), file=sys.stderr)
        return 1

    log = log_path.read_text(errors="replace")
    failures: list[str] = []

    if "FileNotFoundException" in log or "EACCES" in log or "Permission denied" in log:
        failures.append("fixture was not readable by the app")
    if "HWP_RENDER_FAILED" in log:
        failures.append("HWP renderer reported failure")
    success = re.search(r"HWP_RENDER_SUCCESS: pages=(\d+)", log)
    if not success:
        failures.append("missing HWP_RENDER_SUCCESS marker")
    elif int(success.group(1)) < 1:
        failures.append("HWP_RENDER_SUCCESS reported invalid page count")

    pages = [int(m.group(1)) for m in re.finditer(r"HWP_PAGE_CHANGED: page=(\d+)", log)]
    if 1 not in pages:
        failures.append("missing first-page HWP_PAGE_CHANGED marker")
    if max(pages or [1]) < 2:
        failures.append("left swipe did not produce a page>=2 HWP_PAGE_CHANGED marker")

    pixel_check = run([sys.executable, str(Path(__file__).with_name("check-hwp-screenshot.py")), str(first)])
    print(pixel_check.stdout, end="")
    if pixel_check.returncode != 0:
        failures.append("first HWP screenshot failed pixel/fallback gate")

    for label, image in [("first", first), ("after-left-swipe", after_left)]:
        stats = image_stats(image)
        print(f"{label}_image_stats=" + json.dumps(stats, sort_keys=True))
        if stats["dark_ratio"] > 0.90 and stats["bright_ratio"] < 0.03:
            failures.append(f"{label} screenshot is still the dark loading/status surface, not a rendered document page")

    if sha256(first) == sha256(after_left):
        failures.append("after-left-swipe screenshot is identical to first page")

    if failures:
        for failure in failures:
            print(f"FAIL: {failure}", file=sys.stderr)
        return 1

    print("PASS: HWP runtime contract satisfied (readable fixture, renderer success, page change, screenshots).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
