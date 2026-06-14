# Doc Viewer

Android 통합 문서 뷰어. HWP/HWPX부터 PDF, TXT, Office 문서까지 한 앱에서 빠르게 확인하는 것을 목표로 한다.

## 목표

- 한국 문서 환경의 핵심인 HWP/HWPX 지원
- PDF/TXT/MD/CSV 기본 표시
- DOC/DOCX/XLS/XLSX/PPT/PPTX/ODF 문서 인식 및 변환 엔진 연결 준비
- 최근 문서, 파일 열기, 공유/첨부 열기 UX 제공

## 현재 구현

- 앱명: Doc Viewer
- Android `ACTION_OPEN_DOCUMENT` 파일 선택
- Android `ACTION_VIEW` 문서 열기 인텐트
- 최근 문서 목록 저장/재열기
- PDF 첫 페이지 렌더링
- TXT/MD/CSV 텍스트 표시
- HWPX ZIP/XML 기반 텍스트 추출 표시
- HWP 바이너리 및 Office 문서 변환 엔진 슬롯

## 빌드

```bash
printf 'sdk.dir=/home/ubuntu/android-sdk\n' > local.properties
./gradlew :app:assembleRelease
```

서명 릴리즈 APK는 임시 테스트 keystore로 생성한다. Play Store 운영 배포 시에는 별도 production keystore가 필요하다.

## 문서

- `docs/product-brief.md`: 제품 방향, 경쟁 리서치, HWP/HWPX 구현 전략
- `docs/context-gap-analysis.md`: 초기 맥락 누락 원인 분석
