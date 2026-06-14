# DocuView HWP 제품 기획 요약

## 목표
모바일에서 HWP/HWPX를 반드시 열 수 있고, PDF/TXT/Office 계열까지 한 앱에서 보는 경량 종합 문서 뷰어.

## 경쟁/참고 리서치
- Hancom Office Viewer: HWP/HWPX/HWT, Office, PDF 지원을 전면에 둠. HWP 신뢰성이 핵심 차별점.
- All Document Reader 계열: PDF, DOC/DOCX, XLS/XLSX, PPT/PPTX, TXT 등 “모든 문서” 포지셔닝과 파일 관리자 UX가 강점.
- File Viewer for Android: 150+ 파일 타입 지원을 강조. 범용 파일 인식/미리보기 가치가 큼.

## 반영할 기능
1. HWP/HWPX 우선: 파일 연결, 안정적 렌더링, 글꼴/레이아웃 보존.
2. 범용 뷰어: PDF, TXT, DOCX, XLSX, PPTX, CSV 단계적 지원.
3. 모바일 UX: 최근 문서, 검색, 페이지 썸네일, 확대/축소, 공유/인쇄.
4. 신뢰성: 오프라인 우선, 개인정보 보호, 광고 없는 깔끔한 UI.
5. 디자인: 문서 카드, 포맷 배지, 다크모드, 고대비 접근성.

## 기술 방향
- Android Kotlin 네이티브.
- PDF: Android PdfRenderer.
- TXT/CSV: 네이티브 텍스트 렌더러.
- HWP/HWPX: 1차 파일 인식·메타데이터, 2차 파서/서버 변환/LibreOffice-Hancom 호환 경로 평가.
