#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

VERSION_NAME="${1:-$(grep -o 'versionName = "[^"]*"' app/build.gradle.kts | sed 's/versionName = "//; s/"//' | head -1)}"
UNSIGNED_APK="app/build/outputs/apk/release/app-release-unsigned.apk"
KEYSTORE="release/docuview-test-release.jks"
KEY_ALIAS="docuview-interaction-polish"
STORE_PASS="changeit"
KEY_PASS="changeit"
ALIGNED_APK="release/docuview-hwp-${VERSION_NAME}-release-aligned.apk"
SIGNED_APK="release/docuview-hwp-${VERSION_NAME}-release-signed.apk"

mkdir -p release

if [[ ! -f "$UNSIGNED_APK" ]]; then
  echo "Missing unsigned APK: $UNSIGNED_APK" >&2
  echo "Run: ./gradlew :app:assembleRelease" >&2
  exit 1
fi

if [[ ! -f "$KEYSTORE" ]]; then
  cat >&2 <<'MSG'
Missing stable test keystore: release/docuview-test-release.jks

Do not generate a fresh key for an update release: Android will reject updates
when the signing certificate changes. Restore/copy the previous DocuView test
keystore first, then rerun this script.
MSG
  exit 2
fi

zipalign -p -f 4 "$UNSIGNED_APK" "$ALIGNED_APK"
apksigner sign \
  --ks "$KEYSTORE" \
  --ks-pass "pass:$STORE_PASS" \
  --key-pass "pass:$KEY_PASS" \
  --ks-key-alias "$KEY_ALIAS" \
  --out "$SIGNED_APK" \
  "$ALIGNED_APK"

apksigner verify --verbose --print-certs "$SIGNED_APK" | sed -n '1,80p'
sha256sum "$SIGNED_APK"
printf '\nSIGNED_APK=%s\n' "$ROOT_DIR/$SIGNED_APK"
