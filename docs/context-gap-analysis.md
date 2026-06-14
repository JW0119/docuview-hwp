# DocView Context Gap Analysis

## 문제
`#프로젝트실 / DocView` 토픽은 생성됐지만 토픽 자체에 프로젝트 목적, GitHub/NEMO/Cloud, 리서치 문서, APK 상태, 다음 액션이 충분히 반영되지 않았다.

## 원인
1. 토픽 생성과 맥락 주입이 분리되었다.
2. 첫 토픽 메시지가 간단한 상태 알림에 그쳤다.
3. route registry의 `routing_criteria`가 한 문장이라 프로젝트 운영 맥락으로 부족했다.
4. NEMO index가 한 줄 설명 수준이라 프로젝트 홈 역할을 하지 못했다.
5. topic prompt는 있었지만 현 산출물·차단·다음 액션까지 담지 않았고, gateway 런타임 반영 지연 가능성을 고려한 visible 토픽 메시지가 부족했다.
6. 검증 기준이 “토픽/경로 존재”에 치우쳤고 “토픽에서 맥락을 이해할 수 있는가”를 검증하지 않았다.

## 개선 계획
- 프로젝트 생성 완료 조건에 토픽 첫 메시지 맥락 게시를 포함한다.
- NEMO index를 프로젝트 홈으로 사용해 목적/범위/산출물/상태/차단/다음 액션을 기록한다.
- route registry에 mission/scope/artifacts/current_status/next_actions를 추가한다.
- topic prompt를 보강한다.
- 토픽에 context packet을 재게시한다.
- 검증 기준을 존재 확인 + 맥락 확인 + 빌드 상태 확인으로 확장한다.
