# DocuView HWP 완전 동작 개선 처리방안

## 목표

DocuView에서 `.hwp` 파일을 단순 문자열 추출 fallback이 아니라 실제 문서 뷰어처럼 표시한다.

완료 기준은 다음 4단계로 나눈다.

1. **엔진 렌더링 경로**: Android 앱이 HWP 파일 bytes를 `rhwp` WebAssembly 엔진에 전달한다.
2. **페이지 렌더링**: 엔진이 각 페이지를 SVG/Canvas로 렌더링하고 WebView에서 페이지 단위로 표시한다.
3. **뷰어 UX**: 앱 chrome 없이 문서 표면 중심으로 보이고, 페이지 전환/스크롤이 동작한다.
4. **실파일 QA**: 대표 HWP 샘플 3종 이상에서 에뮬레이터 캡처를 확인한다.

## 채택 엔진

1차 채택: `rhwp` Rust/WASM

- 이유: HWP/HWPX 파서와 renderer를 제공하는 오픈소스 경로이며 Android 앱 안에서는 WebView + WASM으로 내장 가능하다.
- 앱 내장 위치: `app/src/main/assets/rhwp/`
- Android 연결 방식: Kotlin `WebView` → `file:///android_asset/rhwp/viewer.html` → `renderHwpBase64(base64, name)` 호출

## 현재 상태

- 앱은 `.hwp`를 감지해 `renderBinaryHwp(uri)`로 진입한다.
- `rhwp.js`, `rhwp_bg.wasm`, `viewer.html` 자산이 들어와 있다.
- 미완성 오류였던 `MAX_HWP_RENDER_BYTES`, `ViewerMode.HWP_ENGINE` 정의를 추가해야 한다.
- 기존 text sniff fallback은 엔진 실패 시 복구 경로로만 유지한다.

## 구현 단계

### 1단계 — 빌드 가능한 엔진 내장 상태

- `ViewerMode.HWP_ENGINE` 추가
- `MAX_HWP_RENDER_BYTES` 추가
- WebView settings/WASM 로딩 허용
- JS bridge로 상태/성공/실패를 Kotlin에 전달
- 엔진 실패 시 사용자 화면에 실패 사유 또는 text fallback 표시

### 2단계 — 실제 HWP 샘플 QA

필수 샘플:

1. 기본 한글/영문/숫자 문단
2. 표/굵게/문단 정렬 포함 문서
3. 다중 페이지 문서
4. 이미지 포함 문서, 가능하면 별도

검증:

- 에뮬레이터 설치/실행
- 각 파일 open intent로 열기
- `adb exec-out screencap -p`로 캡처
- HWP 패널이 `HWP 렌더링 실패` 또는 text fallback이 아닌 SVG/페이지 화면인지 직접 확인

### 3단계 — 페이지 전환 UX

- rhwp 페이지 SVG를 한 페이지씩 표시하는 모드와 연속 스크롤 모드 중 제품 기준 확정
- 좌우 swipe 시 WebView JS에 `nextPage()/previousPage()` 전달
- QA fixture에서 page 1과 page 2가 명확히 다른 텍스트를 포함하도록 구성

### 4단계 — 완성 기준

완성으로 보고할 수 있는 조건:

- `.hwp` 대표 샘플들이 앱 내부에서 rhwp 렌더링 화면으로 표시됨
- 페이지 전환/스크롤 확인됨
- 앱 크래시/ANR/시스템 다이얼로그 없음
- release APK 서명 검증 완료
- contact sheet와 APK를 함께 전달

## 리스크와 대응

- **rhwp API 변경/불일치**: JS wrapper에서 API 존재 여부를 검사하고 오류를 화면/브릿지로 전달한다.
- **WASM file:// 로딩 제약**: Android WebView에서 실패하면 `WebViewAssetLoader` 또는 localhost asset server로 전환한다.
- **HWP 복잡 문서 미완전 렌더링**: 표/이미지/글꼴/문단 샘플별로 failure matrix를 만들고 upstream/API 우회 여부를 결정한다.
- **진짜 “완벽” 기준**: Hancom Office 수준 100% 호환은 독자 구현만으로 보장하기 어렵다. 제품 기준은 대표 문서군의 시각 렌더링/페이지 동작 검증으로 정의한다.

## 다음 액션

1. 현재 워킹트리 빌드 복구
2. JS bridge 실패 callback 구현
3. GitHub Actions QA에 HWP engine status log 수집 추가
4. 실제 공개/생성 HWP 샘플을 확보해 캡처 QA 실행
