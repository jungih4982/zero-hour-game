# 다음 배치와 정확한 재개점

이번 배치의 게임 수정은 종료했다. F04 수정은 로컬 미커밋 상태이며 다음 작업에서 되돌리거나 이전 HEAD만으로 테스트하지 않는다. 기존 PHASE 0 감사 폴더도 미커밋 상태 그대로 보존한다.

## 재개 기준

- 프로젝트 `C:/Dev/zero-hour-game`, branch `master`, HEAD `2f6e21a8eac8829bf216fdc177abb5b8b512304d`.
- 의도한 코드 차이: `choicePresentation.ts`, `NarrativePlayer.tsx`, `test-choice-presentation.ts`, 새 `test-foreknowledge-history.ts`. [최종 diff](EVIDENCE/final-code.patch), [보존 검사](EVIDENCE/preservation-final.json).
- 다음 시작 때 HEAD/branch/staged/unstaged/untracked를 다시 읽고 이 배치의 해시와 대조한다. 여기 적힌 통과 기록은 이후 코드의 검증을 대체하지 않는다.
- 이번 테스트용 emulator-5580과 Metro는 결과 수집 후 종료했다. Chrome에는 민서 Midjourney 후보 D와 새 ComfyUI 워크플로를 검토할 수 있게 남겼다. 사용자 원래 AVD에 저장 파일을 복원하지 않는다.

## 실제 플레이 저장 지점

최종 저장은 [resume-final.sqlite](EVIDENCE/resume-final.sqlite), 읽을 수 있는 내용은 [resume-final.json](EVIDENCE/resume-final.json)이다. SQLite SHA-256: `acd8c3301e408462dd1ce3379877e35284d1957a6ef6f3fb5a4676cb07f1a033`. 이 저장은 인공 플래그가 아니라 정상 UI 진행에서 나왔다.

| 항목 | 값 |
|---|---|
| 장면 | `SCENE_LOOP2_YUJIN_FOREKNOWLEDGE` |
| 루프/시각 | Loop2, offset22 = 21:45 |
| 대사 | standard, lastBeatIndex8, 공개 장면 대사 종료 |
| 상태 | `FLAG_YUJIN_WARY=true`, 정전/시계 기억 보유, `DEDUCTION_BLACKOUT_ROUTE` 미완성 |
| 현재 화면 | ‘아직 다음 수를 확신할 수 없다’, ‘현장 기록을 펼친다’ 안내. `064-verified-f04-scene-end.png` |
| 다음 정상 입력 | 현장 기록 → 추론에서 B1 지도와 정전 기억 연결 → `GO_TO_STAFF_DOOR_AFTER_BACKFIRE` → `WAIT_FOR_KNOWN_BLACKOUT` → B1 |

F04 전후를 다시 비교할 때는 [before-f04-choice.sqlite](EVIDENCE/before-f04-choice.sqlite)를 쓴다. SHA-256 `4e7386cfa9546f50f05f1249735e5b7f69c6d09bd30d75498a95ceefb808e8be`, `SCENE_LOOP2_PHONE_PARADOX`, Loop2, 21:41, 마지막 beat9. 현재 최종 저장과 용도가 다르다. 지난 감사의 B1 22:03 저장과도 구분한다.

재실행은 `MAIN_ANDROID_API35`를 새 격리 userdata로 `-read-only -no-snapshot -port 5580`에서 시작하고, 이번 debug APK 및 현재 Metro를 확인한 뒤 진행한다. 필요한 저장 복원은 이 격리 기기에만 앱을 force-stop한 상태에서 RKStorage를 바이트 그대로 복사한다. 기존 기기의 save clear/초기화는 필요 없다. 같은 화면이라고만 판단하지 말고 패키지·번들 해시·세이브 JSON을 다시 확인한다. 이번 번들의 최종 기준은 `bundle-verified-sha256.txt`이며, 파일명이 final인 중간 번들을 우선하지 않는다.

## 다음 안전 제작 배치: F01 전체 시간 계약

자정 한두 곳만 고치는 부분 패치는 적용하지 않는다. [현재 코드와 자정만 고친 가정의 비교](EVIDENCE/timing-probe.json)는 CH2 00:49 → CH3 00:27의 22분 역행을 보였다. 이 결과는 자동 시뮬레이션이며 해당 경로의 GUI 플레이 결과가 아니다.

| 현재 구현/확정 기준 | 다음 수정안 — 아직 미적용 | 영향/승인 |
|---|---|---|
| 첫 밤 GUI 정전 22:43, 기억은 ‘자정’. 확정 출발 21:23, 이동 약 50분, 정전 00:00 | 경로별 이동·조사·대기 비용을 함께 배분해 고정 사건 시각을 만족 | 엔진 시간, UI 시계, 루프 간 절약, 기억 사용 구간. 확정 시각과 본문을 보존하는 기계적 수정 범위 |
| 기억 payoff usableFrom70..120, 현재 정전 진행은 상대 시간 비용 | 00:00(offset157)과 실제 도달 분기를 함께 검사해 사용 구간을 정합화 | 기억/선택 도달 가능성 전수 검사가 필요 |
| CH3 원문 시작 00:27, 이후 사망 01:06 | CH2 후반이 00:27을 넘지 않도록 경로 비용과 대기를 함께 조정 | CH3 원문 시각을 바꾸는 대안은 별도 창작 승인 전 적용 불가 |

구현 시작점은 `src/content/prologue.ts`의 `STAY_UNTIL_BLACKOUT`, `WAIT_FOR_KNOWN_BLACKOUT`, `blackoutMemory.payoff` 및 CH2→CH3 전환이다. 먼저 모든 도달 가능한 경로의 시간 제약을 출력하고 리셋 외 시간 역행이 없는지 확인한다. 제약을 동시에 만족할 수 없다면 충돌하는 원문 줄/장면과 시간안 두 가지를 비교해 승인 안건으로 남기고 다른 안전 항목을 진행한다.

검증은 `npm test` 및 새 시간 계약 회귀 검사, 정상 UI의 첫 밤/루프2 직접 도착/문자 예측/최소 공개/정확한 공개/조사 최대 경로를 포함한다. 첫 정전 00:00, 첫 리셋 21:23, CH3 00:27 진입, 01:06 사망, 저장 복원과 문 잠금 경계를 실제로 확인한다. 자동 경로 수와 실제 GUI 경로 수를 별도 기록한다.

## 별도 승인 안건: 민서 얼굴/화풍

[기존안과 A–D 비교](ART_REVIEW/REVIEW.md)에 원본 대비 차이와 영향이 있다. A는 선화 방향의 우선 검토안, B는 얼굴 인상의 대안이며 어느 것도 현재 캐릭터와 완전히 일치한다고 판정하지 않았다. 얼굴 기준 또는 체형 변경을 승인 전에 적용하지 않는다.

승인 전에도 기존 에셋의 알파·참조 상태 조사와 동일 장면 캡처는 진행할 수 있다. 승인 뒤에는 정해진 얼굴/BodyRef로 소품·가운을 교정하고 알파를 제작한 후, 실제 민서 장면에서 같은 세로 화면·표정·대사 상태의 전후를 확인한다. 현재 후보 4장과 ComfyUI 연구안 2장을 게임용 완료 에셋으로 계산하지 않는다.

CH2 대사 축약, 손목밴드 재획득, 핵심 용어 공개 시점, ORIGIN TRACE 선택 의미도 이전 감사의 미해결 상태를 유지한다. 이번 배치에서는 해당 원문을 바꾸는 새 편집안을 적용하지 않았다.
