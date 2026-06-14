# Doc Viewer 제품/기술 브리프

## 제품 방향

Doc Viewer는 HWP 전용 앱이 아니라 **HWP/HWPX까지 열 수 있는 Android 통합 문서 뷰어**다. 한국 사용자가 카카오톡, 메일, 브라우저, 공공기관 사이트에서 받은 문서를 한 앱으로 빠르게 확인하는 것을 목표로 한다.

## MVP 포지셔닝

> HWP/HWPX부터 PDF, TXT, Office 문서까지 빠르게 여는 가볍고 깔끔한 통합 문서 뷰어

## 경쟁/참고 앱에서 확인한 핵심 기능

- All Document Reader 계열: PDF, Word, Excel, PPT, TXT를 한 앱에서 열고 파일 브라우저/검색/최근 문서를 제공한다.
- File Viewer for Android: 150개 이상 파일 형식을 여는 범용 파일 뷰어 포지션을 쓴다.
- Hancom Office Viewer: HWP/HWPX 호환성과 공식 신뢰가 강점이다.
- Clean HWP Viewer: HWP/HWPX 전용 경량·빠른 열기를 강조한다.
- Librera/Collabora: 문서 내 검색, 북마크, 주석, 다크 모드, 클라우드/오피스 호환성이 강점이다.

## Doc Viewer 우선순위

### 1차 APK

- 앱명/화면 브랜딩: Doc Viewer
- Android 파일 열기 인텐트
- 최근 문서 목록
- PDF 첫 페이지 미리보기
- TXT/MD/CSV 표시
- HWPX ZIP/XML 기반 텍스트 추출 표시
- HWP 바이너리 인식 및 변환 엔진 슬롯
- DOC/DOCX/XLS/XLSX/PPT/PPTX/ODF 인식 및 변환 엔진 슬롯

### 다음 단계

- HWP 바이너리: rhwp/WASM POC 또는 서버 변환 API 연결
- Office 문서: LibreOffice/Collabora headless 변환 후 PDF/WebView 렌더링
- 문서 내 검색, 페이지 이동, 확대/축소 UX 개선
- 썸네일/파일 브라우저/정렬/포맷 배지
- PDF 변환/공유/인쇄

## HWP/HWPX 구현 전략

- HWPX: ZIP + XML 구조라 앱 내 Kotlin 경량 파서로 본문 텍스트와 표 텍스트부터 처리한다.
- HWP: 바이너리 HWP는 OLE2/압축/레코드/조판 파싱이 필요하므로 MVP에서는 파일 인식과 변환 슬롯을 제공한다.
- 후보 엔진:
  - rhwp/claw-hwp: HWP/HWPX 파싱 후보. Android 직접 내장은 WASM/WebView 또는 native bridge 실험 필요.
  - Hancom SDK: 상용화 단계에서 검토할 고품질 후보.
  - LibreOffice/Collabora: Office 문서 및 일부 변환 파이프라인 후보.
  - pyhwp: AGPL 및 Android 내장 부담으로 제품 앱 포함은 비추천.

## 전문 에이전트 팀 구성

- 제품 리서처: 경쟁 앱/기능 패턴 조사, MVP 우선순위 도출
- UX 디자이너: 파일 열기, 최근 문서, 문서 보기 화면 구조 설계
- Android 엔지니어: Kotlin 앱 구현, SAF/Intent/빌드/서명
- 문서 포맷 엔지니어: HWPX 파서, HWP/Office 변환 엔진 후보 검증
- 릴리즈 QA 엔지니어: release APK 빌드, 서명, badging/signature 검증

## 현재 릴리즈 한계

이 APK는 1차 실행 가능한 release 빌드다. HWPX는 텍스트 추출을 제공하지만, HWP 바이너리와 Office 문서의 고품질 조판 렌더링은 다음 엔진 연결 단계가 필요하다.
