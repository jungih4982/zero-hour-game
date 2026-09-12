# 실제 Android 검증 범위

Computer Use의 네이티브 화면 읽기와 정상 클릭/스크롤/드래그를 실제 호출했다. GUI 담당자는 한 명이며 adb input/디버그 장면 직행은 사용하지 않았다. adb는 격리 기기 설정, 기존 APK 확인/설치, SQLite byte-copy 복원, 로그/저장 읽기에만 사용했다. 저장 복원 분기를 새 게임 연속 플레이로 계산하지 않는다.

## 앱과 환경

- 기존 debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`, SHA256 `72bed25b0643ea56a1cec54ff93f0fce9ce0e5d1fa935577f748aa8a15405f6c`.
- 최종 Metro 04: `.expo/loop3-ch4-state-ui-20260912/after-04.bundle`, SHA256 `12e02ac733b022eceffb44b73e2deb0d09f0890343d5b61adbeb3628645ccf20`. Android 앱은 `10.0.2.2:8081`의 이번 프로젝트 번들을 사용했다. 저장 v6, 새 CH4/UI 표시 및 장면별 개발 로그를 함께 확인했다.
- 격리 기기: `ZERO_HOUR_F01_API35`, serial `emulator-5580`, 이번 작업 전용 `.expo/loop3-ch4-state-ui-20260912/userdata.img`. 기존 사용자 `emulator-5554`를 초기화/복원하지 않았다. adb reverse는 사용하지 않았다.
- A: 1080×2400 / density420 / fontScale1.0. B: 1080×1920 / density420 / fontScale1.0. C: 1080×1920 / density420 / fontScale1.5.
- 캡처는 Computer Use가 제공한 **452×957 에뮬레이터 창 미리보기**다. raw1080 해상도 원본 스크린샷이라고 주장하지 않는다. 장치 설정과 UI 측정 로그로 별도 화면 조건을 확인했다.
- [입력 기록](EVIDENCE/computer-use-inputs.ndjson), [최종 JS 로그](EVIDENCE/android-js-final04.log), [최종 번들 해시](EVIDENCE/after-04-bundle-sha256.json).

## 수행 구분

| 분류 | 실제 시작 → 끝 | 결과와 제한 |
|---|---|---|
| 수정 전 기존 저장 복원 후 정상 진행 | v5 RESET_2123 beat8 → USE_MEMORY → CH4 GOAL beat6 | CH4 다음 선택 없음 재현. 코드만 보고 플레이했다고 하지 않음 |
| 수정 후 같은 v5 복제 저장 | RESET_2123 beat8 → 같은 기억 입력 → GOAL → T-01/T-02/T-03 → 메뉴/이어하기 | 태준 예측·이송 중지·획득·복귀 확인. 기억 소비에 사건223 없음 |
| 별도 CH4 세아 복제 분기 | 같은 GOAL → S-01 | 총157분 표시/정전 사건1회, 11문단 읽음. 지도 사진 없음; S-02 전 제작 경계 |
| **최종04 새 게임 연속 UI** | 첫 밤 시작 → 첫 사망/리셋 → Loop2 최대 조사 → CH3/사망/리셋 → Loop3 → CH4 T-03 | 중간 저장 주입 없음. 종료 후 같은 앱 아이콘→이어하기로 전체 파싱 저장 동일 |
| 최종04 카트 분기 복제 | 이번 새 경로 B1 ready158 → 카트/린넨실 → 세아 → 실제 우회 선택 → 302호166 beat1 | C 화면. 카트 2분1회/필수조사2분/우회1분/302복귀2분 유지 |
| 아트 조건 비교용 복제 | 같은 민서 단독188 beat12, 다인172 beat10 | 단독 A/B/C, 다인 A/C. B 다인은 미검증. 사진/기억 주입 없음 |
| 자동 경로 탐색/저장 검증 | npm test 및 추출 SQLite 파싱 비교 | 실제 GUI 횟수/몰입 검수와 별도 |
| 디버그 장면 직행 | 없음 | 정상 경로로 얻은 저장만 복제 |

새 게임 주 경로: 첫 밤 밴드 **놓고 옴** → Loop2 정확한 미래 정보 공개 → 정전 대기 → B1 **표식 없는 문+필수 린넨실(카트 없음)** → 태준 대면 → 302호 재방문 → 두 번째 전화 비공개 → CCTV/06 → 민서에게 벽 정보 → 옛 지도 날짜/도면/벽 모두 조사와 추론 → CH3 유진 보관/시계만 공개 → 이송실5개 조사 → 라디오 → 유진 사망 기억 → Loop3 선행 사용 → 태준.

두 리셋에서 연타를 가했으나 Loop2/Loop3로 각각 한 번만 전환했다. 마지막에는 저장을 주입하지 않고 앱만 강제 종료/재실행했다. `fresh-final-taejun-complete.json`, `fresh-final-cold-resumed.json`, `final-resume.json`의 **전체 JSON이 같다**. SQLite 파일 해시는 페이지 배치 때문에 서로 다르므로 동일 byte hash라고 쓰지 않는다.

## 조사 UI 전후와 경계 입력

| 조건 | 같은 상태 전후/최종 증거 | 실제 획득 결과 |
|---|---|---|
| B1 A | [전158](EVIDENCE/036-before-b1-A-targets.jpg) / [후158](EVIDENCE/088-after-02-b1-A-targets.jpg) | 카트 연타 후160, 단서1개 |
| B1 B | [후 연타](EVIDENCE/079-after-02-b1-B-cart-repeat.jpg) | 같은158 복제로160, 단서1개 |
| B1 C | [후 대상](EVIDENCE/066-after-02-b1-C-targets.jpg) / [최종04 재확인](EVIDENCE/364-final-bypass-C-b1-ready.jpg) | 카트160/린넨실162. 선택 조사 소진 후 문 클릭 무효 |
| 지도 A | [전176](EVIDENCE/048-before-map-A-targets.jpg) / [후176](EVIDENCE/092-after-02-map-A-targets.jpg) | 날짜 연타 후177, 1분1회 |
| 지도 B | [후 연타](EVIDENCE/084-after-02-map-B-date-repeat.jpg) | 같은176 복제로177 |
| 지도 C | [후 대상](EVIDENCE/057-after-01-map-C-targets.jpg) / [날짜 연타](EVIDENCE/058-after-01-map-C-date-repeat.jpg) | 같은176 복제로177, 하단 표기 라벨 두 줄로 식별 가능 |
| C 스크롤·메뉴 복귀 | after02-b1-C-linen/scrolled/menu-resumed 저장 | time162와 단서/조사상태 동일 |
| 최종04 카트 우회 | [우회 선택](EVIDENCE/368-final-bypass-C-sea-choices.jpg) / [실제 결과](EVIDENCE/369-final-bypass-C-route-selected.jpg) / [302호 연결](EVIDENCE/372-final-bypass-C-return302-selected.jpg) | 방해 없는 린넨실 진입 및 우회 payoff. 자동 경로 추정 아님 |

지도 UI는 01 이후, B1 배치는 02 이후 변하지 않았다. 후속 03/04는 저장 메타데이터·CH4 표시/비용 보정이다. 04에서 전체 대표 경로, 지도 A와 카트 C를 다시 진행했다. 04에서 지도 B/C를 별도 재주행하지는 않았다. 수정 전 B/C 카트 캡처는 획득 후 상태이므로 같은 상태의 완전한 전후 비교라고 쓰지 않는다.

01에서 짧은 화면의 문/카트 버튼이 겹치는 문제가 실제 보였고 02에서 좌우 간격을 보정했다. 폰트 설정 직후 이전 액티비티에서 보인 일시적 클리핑은 정상 종료/재실행 후 다시 검사했다. 이를 새 게임 UI의 지속적 결함이나 수정 성과로 혼동하지 않는다.

## 읽기 검수와 빠른 기능 QA

CH4 T-01(9문단), T-02(8), T-03(7), S-01(11)을 원문과 화면으로 읽고 대조했다. 새 경로 302호 복귀 9문단도 개별 화면으로 확인해 ‘몇 분 사이’ 충돌을 기록했다. CH3 보관 대화와 민서 질문 등 연속 일부도 읽었으나 민서 질문의 짧은 1번 beat ‘뭡니까’는 빠른 2탭 중 건너뛰었다. 코드 원문 검증을 해당 문장의 실제 정독으로 계산하지 않는다.

대부분의 전체 연속 경로는 대사 영역 바깥 선택지에 닿지 않는 위치에서 빠른 탭을 사용한 **기능 QA**다. 신규 플레이어의 긴장감/30–45분 체험/모든 대사 정독 완료는 미검증이다. 한 번 외부 입력 감지로 자동 조작이 멈췄고 최신 화면을 다시 읽은 뒤 보이는 상태부터 계속했다. 상태 주입이나 권한 우회는 하지 않았다.

최종 JS 로그에서 Error/Exception/FATAL/Invariant/TypeError/ReferenceError/Warning 문자열은 검출되지 않았다. 이는 수집한 ReactNativeJS 로그 범위의 결과이며 모든 Android 시스템 로그/기기 안정성을 보증하지 않는다.

## 마감

최종 저장은 [NEXT_BATCH.md](NEXT_BATCH.md). 이번 작업의 Metro 8081과 emulator-5580만 종료했다. 사용자 emulator-5554, ComfyUI 8188, Chrome은 유지했다. 저장/캡처/전용 userdata는 보존했다. 프로세스 결과는 `EVIDENCE/process-cleanup*.json`에 있다.
