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

QA_STAGING_DIR=/data/local/tmp/docuview-runtime-qa
QA_DEVICE_DIR=/data/data/com.docuview.hwp.nativeviewer/files/qa-input
adb shell rm -rf "$QA_STAGING_DIR"
adb shell mkdir -p "$QA_STAGING_DIR"
adb push qa-input/docuview-runtime-test.txt "$QA_STAGING_DIR/docuview-runtime-test.txt"
adb push qa-input/docuview-runtime-test.pdf "$QA_STAGING_DIR/docuview-runtime-test.pdf"
adb push qa-input/docuview-runtime-test.hwpx "$QA_STAGING_DIR/docuview-runtime-test.hwpx"
adb push qa-input/docuview-runtime-test.docx "$QA_STAGING_DIR/docuview-runtime-test.docx"
adb push qa-input/docuview-runtime-test.xlsx "$QA_STAGING_DIR/docuview-runtime-test.xlsx"
adb push qa-input/docuview-runtime-test.pptx "$QA_STAGING_DIR/docuview-runtime-test.pptx"
adb push qa-input/docuview-runtime-test.hwp "$QA_STAGING_DIR/docuview-runtime-test.hwp"
adb shell run-as com.docuview.hwp.nativeviewer mkdir -p files/qa-input
for name in txt pdf hwpx docx xlsx pptx hwp; do
    adb shell run-as com.docuview.hwp.nativeviewer cp "$QA_STAGING_DIR/docuview-runtime-test.$name" "files/qa-input/docuview-runtime-test.$name"
done
adb shell run-as com.docuview.hwp.nativeviewer ls -l files/qa-input/docuview-runtime-test.hwp > qa-artifacts/hwp-fixture-readable.txt

adb shell monkey -p com.docuview.hwp.nativeviewer -c android.intent.category.LAUNCHER 1
sleep 4
adb exec-out screencap -p > qa-artifacts/01-launch.png

adb shell am start -a android.intent.action.VIEW -d "file://$QA_DEVICE_DIR/docuview-runtime-test.txt" -t text/plain -p com.docuview.hwp.nativeviewer
sleep 5
adb exec-out screencap -p > qa-artifacts/02-txt-page-1.png

adb shell input swipe 950 1200 130 1200 350
sleep 2
adb exec-out screencap -p > qa-artifacts/03-txt-page-2-after-left-swipe.png

adb shell input swipe 130 1200 950 1200 350
sleep 2
adb exec-out screencap -p > qa-artifacts/04-txt-page-1-after-right-swipe.png

adb shell am start -a android.intent.action.VIEW -d "file://$QA_DEVICE_DIR/docuview-runtime-test.pdf" -t application/pdf -p com.docuview.hwp.nativeviewer
sleep 5
adb exec-out screencap -p > qa-artifacts/05-pdf.png

adb shell am start -a android.intent.action.VIEW -d "file://$QA_DEVICE_DIR/docuview-runtime-test.hwpx" -t application/vnd.hancom.hwpx -p com.docuview.hwp.nativeviewer
sleep 4
adb exec-out screencap -p > qa-artifacts/06-hwpx.png

adb shell am start -a android.intent.action.VIEW -d "file://$QA_DEVICE_DIR/docuview-runtime-test.docx" -t application/vnd.openxmlformats-officedocument.wordprocessingml.document -p com.docuview.hwp.nativeviewer
sleep 4
adb exec-out screencap -p > qa-artifacts/07-docx.png

adb shell am start -a android.intent.action.VIEW -d "file://$QA_DEVICE_DIR/docuview-runtime-test.xlsx" -t application/vnd.openxmlformats-officedocument.spreadsheetml.sheet -p com.docuview.hwp.nativeviewer
sleep 4
adb exec-out screencap -p > qa-artifacts/08-xlsx.png

adb shell am start -a android.intent.action.VIEW -d "file://$QA_DEVICE_DIR/docuview-runtime-test.pptx" -t application/vnd.openxmlformats-officedocument.presentationml.presentation -p com.docuview.hwp.nativeviewer
sleep 4
adb exec-out screencap -p > qa-artifacts/09-pptx.png

adb logcat -c || true
adb shell am start -a android.intent.action.VIEW -d "file://$QA_DEVICE_DIR/docuview-runtime-test.hwp" -t application/vnd.hancom.hwp -p com.docuview.hwp.nativeviewer
for attempt in $(seq 1 12); do
  sleep 5
  adb exec-out screencap -p > qa-artifacts/10-hwp.png
  adb logcat -d -t 1200 > qa-artifacts/logcat-tail.txt || true
  python3 scripts/check-hwp-screenshot.py qa-artifacts/10-hwp.png > qa-artifacts/hwp-screenshot-check.txt 2>&1 || true

  if grep -q 'HWP_RENDER_FAILED' qa-artifacts/logcat-tail.txt; then
    echo "FAIL: HWP engine reported render failure." | tee -a qa-artifacts/hwp-screenshot-check.txt
    grep 'HWP_RENDER_FAILED' qa-artifacts/logcat-tail.txt | tail -20 | tee -a qa-artifacts/hwp-screenshot-check.txt
    adb shell dumpsys window | grep -E 'mCurrentFocus|mFocusedApp' > qa-artifacts/window-focus.txt || true
    cat qa-artifacts/hwp-screenshot-check.txt
    exit 1
  fi

  if grep -q 'HWP_RENDER_SUCCESS' qa-artifacts/logcat-tail.txt && python3 scripts/check-hwp-screenshot.py qa-artifacts/10-hwp.png >> qa-artifacts/hwp-screenshot-check.txt 2>&1; then
    echo "HWP screenshot rendered by engine after ${attempt} attempt(s)" | tee -a qa-artifacts/hwp-screenshot-check.txt
    # Zoom in, then drag the enlarged page without turning pages. This proves pan/drag
    # is available separately from horizontal page-turn swipes at fit-page scale.
    adb shell input tap 520 2220
    sleep 1
    adb exec-out screencap -p > qa-artifacts/11-hwp-zoomed.png
    adb shell input swipe 760 1350 420 1350 450
    sleep 1
    adb exec-out screencap -p > qa-artifacts/12-hwp-zoomed-after-pan.png
    echo "PASS: HWP zoom tap and pan drag screenshot captured." | tee -a qa-artifacts/hwp-screenshot-check.txt
    adb shell input tap 350 2220
    sleep 1
    adb exec-out screencap -p > qa-artifacts/13-hwp-after-fit-page.png
    adb shell input swipe 950 1200 130 1200 350
    sleep 3
    adb exec-out screencap -p > qa-artifacts/14-hwp-after-left-swipe.png
    adb logcat -d -t 1200 > qa-artifacts/logcat-tail.txt
    python3 scripts/check-hwp-runtime-contract.py qa-artifacts > qa-artifacts/hwp-runtime-contract.txt 2>&1
    adb shell input swipe 130 1200 950 1200 350
    sleep 3
    adb exec-out screencap -p > qa-artifacts/15-hwp-after-right-swipe.png
    break
  fi

  if [ "$attempt" = "12" ]; then
    echo "FAIL: HWP engine did not report HWP_RENDER_SUCCESS." | tee -a qa-artifacts/hwp-screenshot-check.txt
    adb shell dumpsys window | grep -E 'mCurrentFocus|mFocusedApp' > qa-artifacts/window-focus.txt || true
    cat qa-artifacts/hwp-screenshot-check.txt
    exit 1
  fi
done

adb shell pidof com.docuview.hwp.nativeviewer > qa-artifacts/app.pid
adb shell dumpsys window | grep -E 'mCurrentFocus|mFocusedApp' > qa-artifacts/window-focus.txt || true
adb logcat -d -t 1200 > qa-artifacts/logcat-tail.txt
python3 scripts/check-hwp-runtime-contract.py qa-artifacts > qa-artifacts/hwp-runtime-contract.txt 2>&1
