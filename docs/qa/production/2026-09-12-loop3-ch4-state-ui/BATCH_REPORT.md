# Loop3 → CH4 · 기억/소지품 · 조사 UI 제작 결과

2026-09-12. 작업 루트 `C:/Dev/zero-hour-game`, branch `master`, HEAD `f67c6324fdc569857a8bc4e08f07ec3476446ce3`에서 이어 작업했다. F04/Clinical v03은 HEAD에 포함되어 있었고 F01은 기존 미커밋 작업이었다. 강제 복원·스테이징·커밋·푸시·브랜치 변경을 하지 않았다. 전체 감사를 다시 수행하지 않았다.

## 실제 완료와 경계

- **CH4 정상 진행:** 기존 정상 Loop3 저장의 복제본에서 `USE_MEMORY_0106_SEAL`을 직접 입력해 CH4 진입 전/후를 비교했다. 막혀 있던 목표 화면 다음에 승인 원문 기반 태준 T-01 → T-02 → T-03을 연결했다. 카메라 예측 확인, 이송 중지 선택, 신뢰/단서/열쇠 획득, 메뉴 복귀 및 앱 종료 후 이어하기를 확인했다. 별도 복제 분기로 세아 S-01의 11개 문단과 자정 도달을 확인했다.
- **최종 번들 연속 검증:** 새 게임에서 첫 밤 → 자정 사망 → 첫 리셋 → Loop2 최대 조사 경로 → CH3 전체 5개 조사와 01:06 사망 → 두 번째 리셋 → Loop3 기억 사용 → CH4 T-03까지 정상 UI로 진행했다. 이 연속 구간에는 저장 주입이 없었다. 마지막 앱 종료/재실행 전후의 전체 파싱 저장은 동일했다.
- **기억 계약:** 획득한 01:06 기억의 선행 활용을 유지하고 잘못된 `usableFrom=210`을 제거했다. 사건 시각은 `eventTime=223`으로 분리했다. 저장 v6 마이그레이션은 해당 기억의 payoff 메타데이터만 갱신한다. 시각·소지품·획득 출처·다른 기억·단서·신뢰를 보존한다.
- **손목밴드 상태:** 현재 물리 소지, 현 루프의 유진 보관, 이전 밤 보관 기억을 표시상 구분했다. CH3 동행 조건은 과거 persistent 보관 플래그 대신 현 루프 `CH3_BAND_OWNER`를 사용한다. 원문에 있는 재획득 누락 자체는 해결하지 않았다.
- **조사 UI:** B1의 번호를 실제 원화 물체에 연결하고 `문/카트/열린 문` 라벨을 붙였다. 옛 지도에는 `하단 표기/도면/벽`을 표시했다. 획득 전 정답/단서명을 노출하지 않는다. A/B/C 화면에서 카트·날짜 획득, C에서 연타·선택 조사 제한·필수 조사·스크롤·메뉴 복귀·린넨실/카트 우회 연결을 실제 검증했다.
- **아트:** Clinical v03 및 기존 단독 175% 구도를 유지했다. 단독 A/B/C, 다인 A/C에서 얼굴과 선택지 구도를 확인했다. 신규 생성·채택·RGB/알파 수정은 **0건**이다.

**CH4 전체 완료가 아니다.** 유진 주 경로는 미획득 라벨 목격 지식 때문에 화면에 보이되 진행을 보류한다. 세아는 리셋 후 사라진 지도 사진을 사용하는 S-02 직전에 멈춘다. 태준 T-03 다음 보조 조사·B2·04:10 구간은 승인 원문이 있지만 이번에 연결하지 않았다. T-03/S-01의 안내는 제작 경계이며 정식 엔딩이 아니다.

## 수정 전 문제와 처리

| 항목 / 관련 파일·장면 | 재현·증거 | 최소 수정 / 영향 | 판단 상태 |
|---|---|---|---|
| 01:06 기억 메타데이터와 실제 사용 불일치 — `chapter3.ts`, `narrativeSave.ts`, RESET_2123 | v5 Loop3 offset0, beat8에서 사용 가능하지만 payoff는 210. 원본/복제 저장과 [수정 전 입력](EVIDENCE/006-before-use-0106-memory.jpg), [수정 후 입력](EVIDENCE/097-after-03-original-memory-payoff.jpg) | 사건 223과 지식 사용을 분리; v6 한 기억만 이관. CH3/저장/현장 기록 영향 | 구현·자동·GUI 확인, 창작 변경 없음 |
| 과거 보관 기록의 현재 소비 — `chapter3.ts`, `fieldKnowledge.ts`, `FieldKit.tsx` | itemIds=[] / BAND_CUSTODY_YUJIN=true. [현재 소지와 과거 기억](EVIDENCE/131-after-04-items-history-versus-current.jpg) | 현 루프 소유자로 동행 판단; 역사 플래그/신뢰 보존 | 소비처 수정 완료. 재획득 사건은 별도 판단 |
| CH4 목표 뒤 진행 불가 — `story.ts`, 새 `chapter4.ts` | [수정 전 choices=[]](EVIDENCE/028-before-goal-read-06-terminal.jpg), [수정 후 세 경로](EVIDENCE/105-after-04-goal-costs.jpg) | 원문 7개 대화 절 수록, 태준 3절·세아 1절 정상 연결. 유진은 지식 검토 대기 | 부분 구현. 전체 CH4 완료 아님 |
| B1 번호와 물체 분리 — `investigation.ts`, `layout.ts`, `NarrativePlayer.tsx` | [A 전](EVIDENCE/036-before-b1-A-targets.jpg) / [같은 상태 A 후](EVIDENCE/088-after-02-b1-A-targets.jpg) | 배경 cover 크롭을 반영한 앵커·연결선·간결한 라벨; 짧은 화면 버튼 간격 보정 | A/B/C 실제 확인 |
| 옛 지도 표식 구분 — 동일 UI 파일 | [A 전](EVIDENCE/048-before-map-A-targets.jpg) / [A 후](EVIDENCE/092-after-02-map-A-targets.jpg), C 날짜 연타 저장 | 답을 밝히지 않는 대상 라벨. 날짜 1분/1회 유지 | A/B/C 실제 확인 |
| 지도/현장 기록의 조기 정보 공개 — `fieldKnowledge.ts`, `FieldKit.tsx` | 획득 전 B1 설명에 01:06, 초기 패널의 MNEMOSYNE 표시 | 기억 획득 전 일반 B1 설명, 패널명 `현장 기록`; 획득 후 전체 기억 설명 표시 | 자동 조건 검사 + 획득 후 GUI 확인. 미획득 패널의 새 GUI 캡처는 없음 |

세아 진입 비용은 이동 50분과 자정까지 대기를 합친 **157분**으로 선택 전에 표시한다. 실제 벽시계 157분 대기는 없고 게임 시각만 비용을 반영한다. F01 시계/조사 비용/정전 규칙은 재설계하지 않았다. 기존 직원용 문 정전 배경을 재사용했으며 새 대사나 음향은 만들지 않았다.

## 검증 결과

- 최종 코드와 동일한 Metro 04에서 `npm test` 전체 PASS. `typecheck` (`tsc --noEmit`)가 첫 단계에 포함된다. [전체 로그](EVIDENCE/tests-after-04.log).
- 이번 실행에서 CH3 원문 93줄/198 경로, 시간 그래프 10,592 상태/CH2 끝 1,920 상태/12 분기군, 선행 기억 이력 3경로를 자동 검사했다. 이는 **자동 검사 수**이며 실제 플레이 횟수가 아니다.
- 새 Loop3 상태 회귀: 미획득 사용 차단, 획득 후 offset0 사용, 사건 조기 실행 없음, v5/v6 반복 로드, 원본 불변, 과거 보관/현 루프 보관 분리, 조기 지도 정보 차단 PASS.
- CH4 회귀: 원문 7절과 화자, 표시 3경로/진입 가능한 2경로, 태준 획득 1회와 복원, 세아 자정 비용/미소지 사진 차단 PASS.
- [실제 GUI 저장 비교](EVIDENCE/final-gui-save-checks.log) PASS. 연속 정상 플레이/복제 분기/자동 검사/기능 빠른 입력은 [GUI 기록](GUI_VERIFICATION.md)에 분리했다.
- `git diff --check` 최종 결과와 입력 파일 보존은 [무결성 기록](EVIDENCE/final-integrity.json)에 남긴다. 원본 저장, 기존 이미지, 원문, 출처 기록, 기존 F01 증거는 보존한다.

## 미검증과 남은 판단

30–45분 신규 플레이어 몰입도는 완료 판정하지 않았다. 연속 경로의 상당 부분은 빠른 입력 QA다. CH4 T-01~T-03과 S-01, 302호 복귀 문단, 일부 CH3 연속 대사는 읽고 대조했지만 전체 게임의 모든 문장을 이번에 정독하지 않았다. 실제 기기 전체 기종, iOS, CH4 유진 정상 진입, 후반 B2/04:10, CH5 이후, 민서 다인 B 조건은 미검증이다.

남은 우선순위는 **손목밴드 재획득**, **유진의 중복 라벨 사전 지식**, **세아의 리셋 후 지도 사진**, **CH4 태준 이후 연결**, **118분과 ‘몇 분 사이’ 원문 충돌**이다. 원문/최소 권고안/영향/승인 범위는 [비교 문서](CREATIVE_DECISIONS.md)에 있다. ORIGIN TRACE는 후반 원문에만 있고 이번 런타임 구현 범위에는 없다.

## 변경 파일

이번 배치에서 기존 파일 15개를 수정했다: `package.json`, `scripts/test-responsive-layout.ts`, `scripts/test-time-contract.ts`, `src/content/chapter3.ts`, `src/content/story.ts`, `src/engine/choices.ts`, `src/engine/types.ts`, `src/gameplay/choicePresentation.ts`, `src/gameplay/investigation.ts`, `src/store/narrativeSave.ts`, `src/ui/FieldKit.tsx`, `src/ui/NarrativePlayer.tsx`, `src/ui/dialogueBeats.ts`, `src/ui/layout.ts`, `docs/qa/README.md`.

새 런타임/검사 파일은 `src/content/chapter4.ts`, `src/gameplay/fieldKnowledge.ts`, `scripts/test-loop3-state.ts`, `scripts/test-chapter4.ts`다. 새 보고서·캡처·저장·로그는 이 배치 폴더에 있다. `git diff`에 함께 보이는 prologue/time/effects/loop/store의 이전 F01 변경과 이번 변경을 혼동하지 말 것. [이번 배치만의 비교](EVIDENCE/batch-only.patch)와 기준 해시를 사용한다.

[정확한 최종 저장과 다음 첫 입력](NEXT_BATCH.md) · [상태 계약](STATE_CONTRACT.md) · [아트/수동 MJ 작업](MIDJOURNEY_JOBS.md)
