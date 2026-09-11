# 다음 배치와 정확한 재개점

현재 민서 Clinical v03 통합과 기존 F04 수정은 모두 로컬 미커밋 상태다. HEAD는 `2f6e21a8eac8829bf216fdc177abb5b8b512304d`, branch `master`, staged 비어 있음. 다음 시작 시 HEAD·diff·untracked와 [231개 코드 해시](EVIDENCE/code-sha256-final.csv), [증거 manifest](artifact-manifest.csv)를 다시 대조한다. 이전 통과를 새 코드 검증으로 대신하지 않는다.

사용자는 별도 승인 없이 최선의 안전한 제작 선택을 자율적으로 진행하도록 위임했다. 민서 방향 선택은 이 배치에서 실행했다. Qwen Image 2512를 ComfyUI 기본 생성 모델로 사용하고 기본 SDXL로 되돌아가지 않는다. 새 핵심 진실·세계 규칙·확정 대사 변경을 이번 결과에 섞지 않는다.

## 실제 플레이 저장

[resume-final.sqlite](EVIDENCE/resume-final.sqlite), SHA-256 `4242a01388a4b557b5ea1bc361c40d4961c66e34872d91771db6149cf4c0501e`. [JSON](EVIDENCE/resume-final.json), [현재 화면](EVIDENCE/059-after-minseo-scene-end.png).

| 항목 | 정확한 상태 |
|---|---|
| 장면 | `SCENE_LOOP2_SEOYUN_UNCERTAIN` |
| 루프·시간 | Loop2,offset72=22:35 — 현재 F01 오류가 남은 시계 기준 |
| 대사 | `standard`,lastBeatIndex32, 대사 종료 후 두 선택지 |
| 주요 정보 | 정전·시계 기억, `DEDUCTION_BLACKOUT_ROUTE`,06카드 단서,두 번째 전화 소지 |
| 주요 조건 | `FLAG_YUJIN_WARY=true`, 첫 사망 회피,태준에게 전화 공개. 첫 손목밴드는 현장에 두고 왔으며 소지 중이라고 취급하지 않음 |
| 선택1 | `KEEP_MINSEO_WARNING_PRIVATE`: 마지막 통화 내용은 숨기고 직접302호 벽 확인,+3분 |
| 선택2 | `TELL_MINSEO_ONLY_WALL_CLUE`: 민서에게302호 벽 확인만 전달,+5분 |
| 도착 | 두 선택 모두 `SCENE_LOOP2_OLD_MAP_SEARCH`. 아직 선택하지 않았음 |

계속 플레이할 경우 선택1→옛 지도 정상 조사→CCTV 공백과 지도 관련 추론을 확인한다. B1 카트는 이번 진행에서 획득을 확인하지 못했으므로 선택 조건 분석 시 존재한다고 가정하지 않는다.

민서 전후 재검용 저장은 별도로 [before-minseo-entry.sqlite](EVIDENCE/before-minseo-entry.sqlite)를 사용한다. Loop2 CCTV,lastBeat13,offset68=22:31, SHA-256 `e11b1f128ad2225158f77a16831054a04e3a4f5660da9b906d851037946cbbe6`. 민서 beat9나 최종 종료 저장과 혼동하지 않는다.

## 우선 제작 배치: F01 시간 계약

다음 구현 시작점은 `src/content/prologue.ts`의 `STAY_UNTIL_BLACKOUT`, `WAIT_FOR_KNOWN_BLACKOUT`, `blackoutMemory.payoff`, CH2→CH3 전환이다. 먼저 경로별 이동·조사·대기 비용과 고정 사건의 제약을 출력한다.

| 기존 구현·확정 기준 | 다음 작업안 — 이번에는 미적용 |
|---|---|
| 확정 출발21:23, 이동 약50분, 정전00:00. 이번 정상 Loop2 GUI의 정전21:58 | 경로 비용·대기와 정전 고정을 함께 조정하고 리셋 외 시간 역행 금지 |
| 기억 usableFrom70..120, 자정offset157과 어긋남 | 실제 정전 접근·대기·잠금 조건과 기억 사용 구간을 함께 정합화 |
| CH3 원문 시작00:27, 사망01:06 | CH2 최대 조사 경로까지00:27 이전에 수렴하도록 비용·대기 계약 검사 |

이전 배치의 자동 가정 검사에서는 자정만 고치면 CH2 00:49→CH3 00:27로22분 역행했다. **현재 수정 결과가 아닌 과거 반례**이므로 새 전체 경로 계산으로 재현하고 원인을 확정한다. 자정 한 줄만 고치는 패치는 피한다. 본문·핵심 진실을 바꾸지 않고 제약을 만족하는 기계적 수정부터 진행한다. 충돌 시 원문과 구현·수정 대안을 비교 문서로 남긴다.

자동 검사는 전체 `npm test`와 시간 계약의 의미 있는 회귀 검사를 포함한다. GUI는 새 게임 첫 밤→첫 리셋→루프2에서 직접 도착/문자 예측/최소 공개/정확한 공개 및 조사 최대 경로 중 시간 경계에 영향을 주는 경로를 실제로 확인한다. 00:00,21:23,CH3 00:27,01:06을 각각 관찰하고 자동 도달 수와 GUI 도달 수를 분리한다.

## 아트 후속과 환경

민서 Clinical 단일 이미지의 대사·기록 통합은 완료다. 다른 표정·후면·전신·CH3 다인 구도·CG 일관성은 다음 아트 범위로 남긴다. 기준은 `assets/characters/minseo/IDENTITY_LOCK_2026-09-12.md`. Qwen 생성 성공만으로 얼굴 파생을 채택하지 않는다.

ComfyUI의 새 Qwen/알파 워크플로와 입력은 [ART_REVIEW/REVIEW.md](ART_REVIEW/REVIEW.md)에 있다. Qwen 최종 UI 재실행까지 성공했다. 원래 ComfyUI 서버와 Chrome 탭은 유지한다. 테스트용 Metro와 emulator-5580의 종료 여부는 [정리 로그](EVIDENCE/session-cleanup.json)에서 확인한다.

Android 재실행은 현재 debug APK와 현재 프로젝트 Metro를 확인하고 새 격리 userdata에서 한다. 저장 복원은 이 격리 기기에만 앱 force-stop 상태로 RKStorage를 byte-exact 복사한다. 원래 사용자 AVD를 clear하거나 초기화할 필요는 없다. `adb reverse`는 필요하지 않았으며 이번에는 사용하지 않았다.
