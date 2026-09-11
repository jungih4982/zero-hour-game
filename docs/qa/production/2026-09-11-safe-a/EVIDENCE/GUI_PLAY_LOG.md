# 이번 실행의 실제 GUI 플레이 기록

OBS-GUI. Android API35 / emulator-5580 / 1080×2400 / density420 / font1.0. Computer Use `@oai/sky`의 실제 클릭만으로 진행했다. adb input, 장면 deep link, 디버그 scene jump, 인공 엔진 state fixture를 사용하지 않았다.

## 도달한 범위

새 격리 세이브 → 첫 밤 17개 장면 → 첫 사망/기억 재구성/리셋 → Loop2의 7개 장면 → 유진 공개 역효과까지 **24/70 런타임 장면**에 도달하고 최소 한 화면을 확인했다. 장면의 모든 대사 비트를 읽었다는 뜻은 아니다. 중간 body는 기능/입력 검증을 위해 연속 탭했고, 처음 보는 독자의 독서/몰입 평가나 자연 플레이 시간은 측정하지 않았다.

첫 밤: ACT0_DRIVE → WATCH_CALL → MESSAGES → LAST_CALL → ARRIVAL → ACT1_YUJIN_FIRST → YUJIN_SEARCH → YUJIN_DENIAL → YUJIN_WARNING → ACT2_THIRD_FLOOR → NURSE_AT_302 → ROOM_CONTRADICTION → WRISTBAND → REMOTE_KNOWLEDGE → ACT3_MAP_AND_TAEJUN → ACT3_BLACKOUT → FIRST_DEATH.

Loop2: RESET_AWAKENING → VERTICAL_SLICE_TITLE → FIRST_CALL_TEST → EARLY_ARRIVAL → FIRST_PHONE → PHONE_PARADOX → YUJIN_FOREKNOWLEDGE.

첫 문자 분기에서 y852 연속 탭 중 `CONTINUE_TO_BAEKYA`가 선택됐다. 이후에는 대사 입력을 y902로 옮겨 선택 버튼과 분리했다. 따라서 이번 경로는 문자 순서 기록이 없고, Loop2 문자 예측 선택은 표시되지 않는다. 이 경로 차이를 지난 감사의 문자 기록/예측 경로로 오인하지 않는다. 이후 중요한 선택은 화면을 확인한 별도 클릭으로 수행했다.

## 주요 증거

| 검증 | 실제 관찰 | 증거 |
|---|---|---|
| 현재 앱 | 같은 APK + 현재 프로젝트 Metro. 수정 전/후 모듈 문자열과 번들 해시 대조 | bundle-before/verified-*, metro.log / metro-verified.log |
| 조사 게이트 | 0/3에서 일반 진행 없음. 최근 흔적+손목밴드 2/3 조사 뒤 정보 확인 가능 | 023-before-room-investigation.png ~ 025-before-wristband-hotspot.png |
| 물품 보존 범위 | 첫 밤 손목밴드를 제자리에 두고 나옴 | 027-before-band-body.png, 028-before-leave-band.png |
| F01 현재 재현 | 정전 전 22:34 → 정전/사망 22:43. 수정하지 않음 | 031-before-taejun-body.png ~ 034-before-move-to-death.png, first-death-record.json |
| 기억 오답/재시도 | 문 잠금 먼저 선택 시 0/3 오류 안내. 불 꺼짐→초침 멈춤→문 해제로 성공 | 036-before-memory-wrong-order.png ~ 039-before-memory-door.png |
| 첫 리셋 | 21:23 복귀, 시계/정전 기억 유지 | 040-before-reset.png 이후, before-f04-choice.json |
| 미기록 지식 게이트 | 문자 순서 미기록 경로이므로 두 문자 예측은 표시되지 않음 | 046-before-loop2-choice.png |
| F04 수정 전 | 유진 공개 첫 진입에서 실제 선택하지 않은 최소 공개를 ‘이전에 확인한 결말’로 표시 | 053-before-f04-disclosure-choice.png, 054-before-f04-false-history.png |
| F04 수정 후 | 동일한 21:41 선택에서 기존 정전 기억의 설명, ‘이전에 확인한 사실’, 취소선 없음 | 061-verified-continue-same-checkpoint.png, 062-verified-f04-fact-feedback.png |
| 표시/입력 | 세로 화면에서 문구/버튼 잘림 없음. 중간 동일 F04 표시 버전에서 모달 밖 연타로 장면 전환 안 됨. 최종 버전에서 모달 닫기와 대사 끝까지 진행 가능 | 059-final-modal-background-taps-blocked.png, 063-verified-close-feedback.png, 064-verified-f04-scene-end.png |
| 결과 상태 | 공개 전후 엔진 결과가 수정 전과 동일: Loop2, time22, 유진 경계 true, 보유 기억 동일 | f04-state-comparison.json, verified-f04-result.json |
| 재개 | 유진 공개 장면 대사 종료, 아직 정전 경로 추론 미완성. 현장 기록을 펼치는 안내 | 064-verified-f04-scene-end.png, resume-final.sqlite/json |

## 같은 상태의 전후 재검증 방법

수정 전에 정상 UI로 도달한 `SCENE_LOOP2_PHONE_PARADOX`, Loop2, time18(21:41), 마지막 대사 beat9, standard 속도의 실제 SQLite를 읽기 전용으로 내보냈다. `before-f04-choice.sqlite`의 SHA-256은 `4e7386cfa9546f50f05f1249735e5b7f69c6d09bd30d75498a95ceefb808e8be`다.

앱/Metro를 재시작할 때 **이 배치의 격리 기기에만 해당 파일을 바이트 그대로 복원**했다. `after-restored-f04-choice`, `final-restored-f04-choice`, `verified-restored-f04-choice`의 해시는 모두 같다. 이 과정은 정상 플레이 저장의 복원이며, 장면 ID/플래그/시간을 편집한 fixture가 아니다. 복원 후 타이틀의 ‘이어하기’ → 같은 선택 좌표(223,707)로 공개를 실행했다. 최종 UI 상태는 마지막 verified 번들로 다시 확인했다.

첫 밤/Loop2 전체를 수정 후 새 게임부터 다시 플레이한 것은 아니다. 정상 UI로 만든 같은 선택 직전 세이브에서 해당 구간을 다시 플레이했다. 전체 분기, 최소 공개 분기의 GUI, CH2 후반/CH3/엔딩, 다른 기기·태블릿·iOS·음향·장시간 성능은 이번 수정 후 GUI 검증에 포함되지 않는다.

정밀 입력 시각·좌표·클릭 수와 캡처명은 `computer-use-inputs.ndjson`에 있다. 초기 앱 실행/튜토리얼 일부는 대화의 도구 캡처에만 남는다. 캡처를 FPS나 응답 지연 측정 자료로 사용하지 않는다.
