# F01 시간 계약 · 조사 입력 · 민서 구도 제작 결과

2026-09-12. 실제 시작/종료 기준 HEAD `f67c6324fdc569857a8bc4e08f07ec3476446ce3`, branch `master`. F04와 Clinical v03은 현재 HEAD에 이미 포함되어 있었다. 이전 보고의 미커밋 가정은 현 트리와 달랐다. 기존 작업, 원본 저장, v02/v03, 출처 기록을 보존했고 커밋·스테이징·브랜치 변경은 하지 않았다. 전체 감사를 반복하지 않고 최신 QA 색인과 해당 배치 증거, F01 관련 원문/구현을 직접 대조했다.

## 실제 완료

- 출발·이동·정전·CH3 전환·사망을 하나의 경과 시간 계약으로 연결했다. 미래까지의 대기 비용을 표시하고, 늦은 저장의 시계를 되돌리는 `setTime`을 이야기 경로에서 제거했다. 경로별 장부와 수정 전 반례는 [TIME_CONTRACT.md](TIME_CONTRACT.md).
- 새 저장은 버전5/시간 계약1. 기존 저장은 시각·기억·소지품·경로를 보존하고 ‘이전 저장 시각’으로 구분한다. 실제 원본72를 새 정상 시각으로 고쳐 쓰지 않았다.
- 가려져 눌리지 않던 옛 지도 날짜와 B1 카트를 기존 조사 지점 배치 기능으로 수정했다. 조사 비용·선택 조사1회 제한·필수 조사·선택지는 유지했다.
- 민서 v03의 단독 화면을 허벅지 구도에 맞게175%로 조정했다. 같은 CH3 beat/상태의 전후 비교와 새 게임 CH2 다인/CH3 화면 확인을 수행했다.
- Qwen Image2512로 표정 연구1작업을 실제 생성·부분 합성·비교했다. 얼굴 정체성/합성 경계가 기준 미달이라 후보를 채택하지 않았다. 기존 MJ A RGB+BiRefNet 알파인 v03 PNG는 그대로다. [아트 결과](ART_REVIEW/REVIEW.md).

## 정상 Android 플레이 범위

Computer Use `@oai/sky`로 격리 Android 화면을 보고 정상 터치·스크롤로 진행했다. `adb input`, 상태 주입, 디버그 직행으로 이야기를 진행하지 않았다. ADB는 기기/앱 확인, 저장의 읽기·바이트 복사, 프로세스 수명 관리에만 사용했다.

주 경로는 UI의 처음부터 시작 → 첫 밤 → 00:00 첫 사망 → 기억 재구성 → 첫 리셋 → Loop2 문자 확인/정확한 예지 공개 → 자정 개입 → B1 문+린넨실 → 태준 대면 → 높은 비용의 CCTV/06/벽 정보 선택 → 옛 지도 전부 조사 → CH3 유진 보관/동행 → 이송실 전부 조사 → 무전 단서 → 01:06 사망 → **Loop3 21:23, 첫 기억 선택**이다. 주 경로 도중 저장을 주입하지 않았다.

| 실제 체크포인트 | 시각 / 증거 |
|---|---|
| 첫 밤 출발/도착 |21:23→22:15, 문자 보존 정차 포함52분. `fresh-origin`, `fresh-arrival`|
| 첫 정전/리셋 |00:00→정상 리셋21:23. `fresh-first-blackout`, `fresh-first-reset`|
| Loop2 문자 경로 도착 |22:08. `fresh-loop2-message-arrival`|
| 정전 전 기억·추론 사용 |22:16 세 공개 선택,22:28 대기 시작→00:00 개입. `fresh-three-disclosures`, `fresh-before-second-blackout`, `fresh-second-blackout`|
| 최대 CH2 조사 종료/CH3 진입 |00:27→00:27, 역행 없음. `fresh-ch2-max-end`, `fresh-ch3-band-request`|
| 본문의 휴대전화00:36 |실제00:36. `fresh-ch3-0036-line`|
| 이송실 조사5개 |00:49→00:59,각2분. 남은 대조7분→01:06. `fresh-transfer-max`, `fresh-0106-evidence-choice`|
| 두 번째 사망/리셋 |01:06→Loop3 21:23. `fresh-second-death`, `fresh-loop3-memory-choice`|

표의 이름은 모두 `EVIDENCE/<이름>.sqlite`와 `.json`으로 남겼다. [실제 입력·복원 범위와 한계](EVIDENCE/GUI_PLAY_LOG.md), [정확한 재개점](NEXT_BATCH.md).

별도 복제 저장에서 B1 카트의 수정 전 실패와 수정 후 획득/추가 조사 차단/린넨실/우회00:07을 검증했다. 직접 도착 분기는21:25→22:05와 기억 payoff 후 대사 진행을 확인했다. 구버전 저장의 원래 경로 진행과 같은 날짜 조사 전후, 같은 CH3 민서 상태 전후는 새 게임과 별도 계산했다.

주 경로 전체 GUI는 F01+아트 수정 번들에서 수행했다. 마지막 B1 배치 속성1줄 추가 후에는 해당 B1 복제 경로와 직접 도착/최종 재개를 다시 플레이하고 전체 테스트를 재실행했다. 마지막1줄 이후 첫 밤부터 전체를 재주행한 것은 아니다.

## 검증 결과와 한계

- 최종 `npm test` PASS: [npm-test-after-b1.log](EVIDENCE/npm-test-after-b1.log). typecheck, 원문 보존 검사, 엔진/저장/조사/입력/반응형/기억/CH3 검사 포함. CH3 자동198경로와 시간 계약 자동10,592상태/1,920동등 CH2종료/12분기 집단 통과.
- `git diff --check` PASS. 최종 변경 목록·코드 해시·이전 파일 보존 비교는 `EVIDENCE/final-integrity.json`, `changed-files.txt`, `code-sha256-final.csv`. [증거 목록](artifact-manifest.csv).
- Android 최종 로그에는 의도적으로 Metro를 재시작한 구간의 연결 경고가 있다. 다시 연결한 뒤 정상 실행했고, 수집된 로그에서 JS 오류/Android 치명 오류는 발견되지 않았다. 로그 버퍼에 남은 범위의 검사이며 전체 실행의 모든 시스템 로그를 보존한 것은 아니다.
- APK SHA256 `72bed25b0643ea56a1cec54ff93f0fce9ce0e5d1fa935577f748aa8a15405f6c`, package `com.jungih4982.zerohourgame`. 기존 debug APK와 이번 코드의 Metro 번들을 사용했다. 새로운 release APK를 빌드한 것은 아니다. 최종 번들 해시/코드 표식/앱 로그를 저장했다.
- 격리 기기는 `emulator-5580 / ZERO_HOUR_F01_API35`. 기존 `emulator-5554 / MAIN_ANDROID_API35`는 초기화하지 않았다. `adb reverse` 사용0. 사용자의 ComfyUI 서버와 Chrome 탭은 보존했다. 종료 내역은 `EVIDENCE/process-cleanup.json`.
- 빠른 입력 기능 QA와 핵심 문장의 집중 독해를 수행했다. 30~45분 신규 플레이어 몰입, 실제 모든 문장을 읽는 완주, 전체 엔딩, 모든 캐릭터 CG/태블릿/실기기는 미검증이다. 자동 플레이 시간44분 추정은 체험 인증이 아니다.

## 문제별 판단과 남은 일

| 우선순위/상태 | 파일·장면 / 재현과 증거 | 최소 수정 또는 비교안 / 영향·승인 |
|---|---|---|
|P0 구현 해결|`prologue.ts`, `chapter3.ts`: 자정만 고친 반례00:49→00:27. 실제 구버전 GUI22:46→00:27 덮어쓰기. `time-ledger-before.json`|경과 대기/경로 비용/전환 통합, 새 최대 경로00:27 GUI 확인. 확정 원문 변경 없음, 추가 승인 불필요|
|P1 서사 미해결|`SCENE_LOOP2_RETURN_302`: 첫 전화22:12→재방문00:10=118분인데 “몇 분 사이”. `fresh-return302-time-wording.json`와 해당 캡처|[비교안](CREATIVE_DECISIONS.md) 문장 해석/리라이트 또는 늦은 관찰 장면. 확정 본문/동선 영향, 적용 전 판단 필요|
|P1 페이싱 미해결|두 정전 대기: 실제55분/92분을 한 선택이 소비. 시간은 보이지만 기다리는 경험이 부족|정전 전 사건/대기의 연출 설계. 세계 시각·기억의 선행 사용 유지. 본문 추가/변경은 비교 후 판단|
|P1 소지품 서사 미해결|`SCENE_CH3_BAND_REQUEST`/보관분기: 첫 밤 밴드를 놓고 리셋, Loop2 재획득 없이 CH3가 소지 전제. `fresh-ch3-band-request.json`|재획득 원문 근거/실제 조사 지점부터 확정. 몰래 지급하지 않음. 보관 플래그가 persistent인 점도 다음 배치에서 함께 대조|
|P1 입력 해결|`investigation.ts`: 옛 지도 날짜 및 B1 카트 중심 터치 실패. B1 전후 SQLite SHA가 동일한 상태로 재검|기존 `fitHotspotsToStage` 적용. 실제 날짜+1분/카트+2분·우회 확인. 다른 크기의 실기기 GUI는 남음|
|P2 아트 개선/표정 미채택|`NarrativePlayer.tsx`, CH3 beat14: 기존245% 확대와 허벅지 자산의 불일치. Qwen 후보는 눈매/경계 실패|175% 단독 프레이밍 채택, v03 원화 유지. 다인 구도 유지·실제 확인. 새 표정은 기준 충족 때만 채택|
|P2 후속 시간 메타데이터|`chapter3.ts:seal0106Memory.payoff.usableFrom=210`인데 Loop3 offset0에 기억 사용 선택이 보임(현재 조건은 hasMemory)|예고 가능한 시각과 실제 사건223을 분리하는 후속 안전 수정. 이번에는 Loop3 선택 노출까지만 GUI, 선택 뒤 CH4 미진행|
|P2 후속 검수|ORIGIN TRACE 선택 효과, 용어 공개, CH2 원문 누락/축약|이번 범위에서 전면 재감사하지 않음. 기존 F04 보존. 해당 원문·상태를 직접 대조한 뒤 안전 작업부터 진행|

시간 경계·최대 경로 도달성의 구현은 해결했지만 모든 서사 시간 표현과 대기 몰입까지 해결했다고 판단하지 않는다. 보존할 기준은 확정 본문, 첫 리셋의 기억 재구성, 선행 지식에 따른 도착/공개 선택의 차이, 조사 기회 제약, CH3 세 증언의 서로 다른 시점, 민서 Clinical v03의 얼굴과 복장이다.

## 변경 범위

기존 파일12개: `package.json`, `src/content/{chapter3,prologue,story}.ts`, `src/engine/{effects,loop,types}.ts`, `src/gameplay/{choicePresentation,gameClock,investigation}.ts`, `src/store/useNarrativeStore.ts`, `src/ui/NarrativePlayer.tsx`. 신규 소스4개: `src/engine/time.ts`, `src/content/timeContract.ts`, `src/store/narrativeSave.ts`, `scripts/test-time-contract.ts`; 신규 검사 helper `scripts/lib/timeContractPaths.ts`. QA 색인과 본 배치 보고서/장부/로그/캡처/복제 저장을 추가했다. 최종 정확한 목록은 `EVIDENCE/changed-files.txt`다.

ComfyUI에는 이 작업의 고유 입력 이미지, 출력, 새 `ZERO_HOUR_F01_MINSEO_FOCUSED_QWEN2512_20260912.json` 워크플로만 추가했다. 기존 서버·모델·워크플로를 교체하지 않았다. 신규 Midjourney 생성은 허용 자동화가 확인되지 않아 [수동 실행 작업](MIDJOURNEY_JOBS.md)으로 남겼다.
