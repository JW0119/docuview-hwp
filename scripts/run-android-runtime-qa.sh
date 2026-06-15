#!/usr/bin/env bash
set -euxo pipefail

adb wait-for-device
adb devices
adb shell settings put global window_animation_scale 0
adb shell settings put global transition_animation_scale 0
adb shell settings put global animator_duration_scale 0
adb shell settings put secure immersive_mode_confirmations confirmed || true

test -f app/build/outputs/apk/debug/app-debug.apk
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb shell pm grant com.docuview.hwp.nativeviewer android.permission.READ_EXTERNAL_STORAGE || true

adb push qa-input/docuview-runtime-test.txt /sdcard/Download/docuview-runtime-test.txt
adb push qa-input/docuview-runtime-test.pdf /sdcard/Download/docuview-runtime-test.pdf
adb push qa-input/docuview-runtime-test.hwpx /sdcard/Download/docuview-runtime-test.hwpx
adb push qa-input/docuview-runtime-test.docx /sdcard/Download/docuview-runtime-test.docx
adb push qa-input/docuview-runtime-test.xlsx /sdcard/Download/docuview-runtime-test.xlsx
adb push qa-input/docuview-runtime-test.pptx /sdcard/Download/docuview-runtime-test.pptx
adb push qa-input/docuview-runtime-test.hwp /sdcard/Download/docuview-runtime-test.hwp

adb shell monkey -p com.docuview.hwp.nativeviewer -c android.intent.category.LAUNCHER 1
sleep 4
adb exec-out screencap -p > qa-artifacts/01-launch.png

adb shell am start -a android.intent.action.VIEW -d file:///sdcard/Download/docuview-runtime-test.txt -t text/plain -p com.docuview.hwp.nativeviewer
sleep 5
adb exec-out screencap -p > qa-artifacts/02-txt-page-1.png

adb shell input swipe 950 1200 130 1200 350
sleep 2
adb exec-out screencap -p > qa-artifacts/03-txt-page-2-after-left-swipe.png

adb shell input swipe 130 1200 950 1200 350
sleep 2
adb exec-out screencap -p > qa-artifacts/04-txt-page-1-after-right-swipe.png

adb shell am start -a android.intent.action.VIEW -d file:///sdcard/Download/docuview-runtime-test.pdf -t application/pdf -p com.docuview.hwp.nativeviewer
sleep 5
adb exec-out screencap -p > qa-artifacts/05-pdf.png

adb shell am start -a android.intent.action.VIEW -d file:///sdcard/Download/docuview-runtime-test.hwpx -t application/vnd.hancom.hwpx -p com.docuview.hwp.nativeviewer
sleep 4
adb exec-out screencap -p > qa-artifacts/06-hwpx.png

adb shell am start -a android.intent.action.VIEW -d file:///sdcard/Download/docuview-runtime-test.docx -t application/vnd.openxmlformats-officedocument.wordprocessingml.document -p com.docuview.hwp.nativeviewer
sleep 4
adb exec-out screencap -p > qa-artifacts/07-docx.png

adb shell am start -a android.intent.action.VIEW -d file:///sdcard/Download/docuview-runtime-test.xlsx -t application/vnd.openxmlformats-officedocument.spreadsheetml.sheet -p com.docuview.hwp.nativeviewer
sleep 4
adb exec-out screencap -p > qa-artifacts/08-xlsx.png

adb shell am start -a android.intent.action.VIEW -d file:///sdcard/Download/docuview-runtime-test.pptx -t application/vnd.openxmlformats-officedocument.presentationml.presentation -p com.docuview.hwp.nativeviewer
sleep 4
adb exec-out screencap -p > qa-artifacts/09-pptx.png

adb shell am start -a android.intent.action.VIEW -d file:///sdcard/Download/docuview-runtime-test.hwp -t application/vnd.hancom.hwp -p com.docuview.hwp.nativeviewer
for attempt in $(seq 1 12); do
  sleep 5
  adb exec-out screencap -p > qa-artifacts/10-hwp.png
  if python3 scripts/check-hwp-screenshot.py qa-artifacts/10-hwp.png > qa-artifacts/hwp-screenshot-check.txt 2>&1; then
    echo "HWP screenshot visible after ${attempt} attempt(s)" | tee -a qa-artifacts/hwp-screenshot-check.txt
    break
  fi
  if [ "$attempt" = "12" ]; then
    adb logcat -d -t 1200 > qa-artifacts/logcat-tail.txt || true
    adb shell dumpsys window | grep -E 'mCurrentFocus|mFocusedApp' > qa-artifacts/window-focus.txt || true
    cat qa-artifacts/hwp-screenshot-check.txt
    exit 1
  fi
done

adb shell pidof com.docuview.hwp.nativeviewer > qa-artifacts/app.pid
adb shell dumpsys window | grep -E 'mCurrentFocus|mFocusedApp' > qa-artifacts/window-focus.txt || true
adb logcat -d -t 1200 > qa-artifacts/logcat-tail.txt
