# ZERO HOUR 안전 제작 배치 A — 결과

**완료:** F04의 허위 과거 피드백을 수정하고, 현재 Android 앱에서 같은 저장 상태·같은 선택으로 전후를 재검증했다. 민서 화풍 후보도 Midjourney와 ComfyUI에서 실제 제작해 비교안을 남겼다. 캐릭터 원본 교체와 시간표 변경은 적용하지 않았다.

## 선택한 제작 범위와 근거

이전 감사의 우선순위와 현재 소스를 재확인했다. F01의 자정만 고치는 방식은 안전하지 않았다. 현재 엔진의 정상 조건을 사용한 새로운 시뮬레이션에서 자정 두 곳만 157로 고정하면 `SCENE_CHAPTER02_END` 00:49 → `SCENE_CH3_BAND_REQUEST` 00:27로 22분 역행했다. CH3 원문도 시작을 00:27 무렵으로 지정한다. [읽기 전용 비교 실험](EVIDENCE/timing-probe.json).

F02/F03/F05/F06은 확정 원문·소지품 획득·정보 공개의 편집 판단이 얽힌다. 이번에는 원문과 사건 결과를 건드리지 않고 고칠 수 있는 P1 F04를 완성했다. F01을 해결했다고 표시하지 않는다.

## F04 — 수정과 확인

| 항목 | 내용 |
|---|---|
| 관련 장면/선택 | `SCENE_LOOP2_PHONE_PARADOX` → `REVEAL_EXACT_FOREKNOWLEDGE` → `SCENE_LOOP2_YUJIN_FOREKNOWLEDGE` |
| 재현 조건 | 첫 사망으로 정전 기억 획득, Loop2 첫 전화 확인, 최소 공개 장면을 경험하지 않은 상태에서 정확한 지식 공개 |
| 수정 전 OBS-GUI | ‘유진에게 휴대전화의 모순만 제한적으로 알렸다’를 ‘이전에 확인한 결말’로 표시 |
| 원인 OBS-CODE | 선택 프레젠테이션에 대체 분기의 결과를 정적 과거로 기입. 모달도 모든 known 값을 취소선 결말로 처리 |
| 적용한 최소 수정 | 이미 획득하는 `blackoutMemory.description`을 사용. 사실/결말 표시 종류를 구분해 F04를 ‘이전에 확인한 사실’로 표시하고 취소선을 제거. 사실 문구만 Android balanced 줄바꿈 적용 |
| 영향 | 이 기억 피드백의 내용·라벨·표시. 다른 결말의 기존 취소선 및 기본 줄바꿈 유지. 엔진 시간/조건/effects/저장 version4/확정 본문/선택 대사는 변경하지 않음 |
| 자동 증거 | 새 검사에서 수정 전 명시적 FAIL. 수정 후 유효한 새 게임 경로 3개 PASS 및 기록하지 않은 문자 예측 1개 잠금 확인. 기억 없는 공개 차단과 유진 경계 결과 유지 |
| GUI 증거 | 21:41의 byte-identical 저장을 복원해 같은 좌표로 선택. 최종 21:45 피드백 확인, 버튼/대사 복귀 확인. [전후 캡처](EVIDENCE/f04-before-after.jpg) |
| 상태 증거 | 수정 전/후 선택 결과 엔진 state가 완전히 같음. [비교](EVIDENCE/f04-state-comparison.json) |
| 승인 | 기존 기준을 보존하는 오류 수정이므로 이번 사용자 제작 요청 범위 안에서 적용. 추가 창작 승인 불필요 |
| 판정 한계 | 이 재현 사례는 FIXED. 모든 Foreknowledge 문구, 기기, 저장 버전의 전체 GUI 완료 판정은 아님 |

![F04 전후](C:/Dev/zero-hour-game/docs/qa/production/2026-09-11-safe-a/EVIDENCE/f04-before-after.jpg)

## 실제 검증과 미검증

- 수정 전 새 격리 게임에서 24/70 장면에 도달했다. 첫 사망, 오답→기억 재구성 재시도, 첫 리셋, 기록하지 않은 문자 예측의 비노출, 유진 공개를 직접 조작했다. [정확한 경로와 입력](EVIDENCE/GUI_PLAY_LOG.md).
- 수정 후에는 정상 플레이로 만든 동일 체크포인트를 복원해 해당 공개 선택과 피드백, 대사 복귀 및 다음 추론 게이트를 재검증했다. Android 1080×2400, density420, font1.0 한 환경이다.
- `npm test` 수정 전 PASS, 최종 소스 PASS(exit0). 기존 typecheck/대사/비트/캐릭터/시뮬레이션/분량/레이아웃/입력/조사/추론/사망 기억/선택/온보딩/CH3 검사 포함. CH3 198 경로 검사는 현재 소스로 다시 실행한 **자동 검사**다. [최종 로그](EVIDENCE/npm-test-final-scoped.log).
- `scripts/test-foreknowledge-history.ts`는 기존 `test:choice-presentation`에 연결되어 앞으로 `npm test`에서 실행된다. [수정 전 실패](EVIDENCE/f04-regression-before.log).
- `git diff --check` PASS. 최종 앱 PID의 로그와 crash buffer를 수집했으며 이번 수집 범위에 FATAL/JS 예외 패턴이 없었다. 장시간 무오류/메모리 안정성 증명은 아니다.
- Android release 빌드, 실제 물리 기기, 다른 화면/큰 글자/태블릿, iOS, CH2 후반~엔딩 GUI, 민서 새 에셋의 런타임 표시, 음향 청감은 **미검증**이다.
- 빠른 대사 입력을 자연스러운 독자의 플레이 시간으로 계산하지 않았다. 테스트 PASS와 플레이 경험 전체 완료는 구분한다.

## 민서: 실제 제작했으나 런타임 적용 보류

Midjourney의 기존 얼굴 참조를 사용해 후보 A–D를 생성·상세 열람·다운로드했다. ComfyUI에서는 기존 작업의 사본에서 두 번 생성하고 프롬프트/seed/워크플로를 남겼다. [얼굴·몸·다른 캐릭터 비교 및 승인 안건](ART_REVIEW/REVIEW.md).

현재 원본은 얼굴/머리의 광택·채색 차이와 큰 가운 알파 소실이 있다. 새 후보는 선화와 가운 채움이 개선됐지만 얼굴 비율·체형·복장 구조가 완전히 같지는 않다. 후보 B에는 손목 소품도 추가됐다. ComfyUI 결과는 정체성 차이로 미채택했다. 모두 검토 산출물이며 새 ART LOCK이나 게임 에셋으로 등록하지 않았다.

## 변경 파일

게임/검사 파일은 4개다.

1. `src/gameplay/choicePresentation.ts` — 확인한 정전 기억 참조, fact/outcome 표시 종류.
2. `src/ui/NarrativePlayer.tsx` — 사실 라벨/취소선 구분, 사실 문구의 Android 줄바꿈.
3. `scripts/test-choice-presentation.ts` — 새 회귀 검사 연결.
4. `scripts/test-foreknowledge-history.ts` — 새 경로/기억 게이트/선택 결과 회귀 검사.

새 검토/로그/캡처/비교 파일은 이 배치 폴더에 있고 `docs/qa/README.md`에 최신 재개 링크를 추가했다. 캐시/번들/새 Android 테스트 디스크는 ignored `.expo/safe-a-20260911`에 있다. 생성한 ComfyUI 출력과 새 ZERO HOUR 이름의 워크플로, 사용자 Downloads의 새 생성물도 존재한다. 기존 워크플로/이미지를 덮어쓰지 않았다.

HEAD와 master는 그대로다. 커밋하지 않았고 staged 변경도 없다. 최종 보존 검사에서 이전 감사의 228개 tracked 기준 중 의도한 3개만 변경됐고 나머지 225개의 해시는 같았다. 기존 감사 manifest의 101개 자료도 모두 같았다. 새 검사 파일 1개를 더해 코드/검사 변경은 총 4개다. [보존 결과](EVIDENCE/preservation-final.json), [전체 코드 diff](EVIDENCE/final-code.patch).

최종 저장과 로그를 내보낸 뒤 이 배치의 격리 에뮬레이터와 Metro만 종료했다. Chrome 검토 탭과 생성 후보는 남겼다. [최종 증거 색인](EVIDENCE/INDEX.md).

## 남은 우선 문제

| 순서 | ID | 현재 상태 / 필요한 다음 작업 |
|---|---|---|
| 1 | F01 | OPEN. 50분 이동, 00:00 정전, CH3 00:27, 01:06 사망을 함께 만족하는 시간 비용 재설계/검증 |
| 2 | F02 | OPEN / 편집 판단. CH2 확정 원문의 축약·누락 대조와 복원 범위 |
| 3 | F03 | OPEN / 편집 판단. 놓고 온 손목밴드의 Loop2 재획득과 CH3 소유 상태 |
| 4 | F05 | OPEN / 승인 판단. MNEMOSYNE/INSTANCE 등의 공개 시점 |
| 5 | F06 | OPEN / 원문 비교. 질문·CCTV·방 상태 지식 선후 관계 |
| 6 | F07 | CANDIDATES_READY. 민서 얼굴 기준 선택 → 의상/알파 → 실제 장면 QA |
| 7 | F08 | OPEN. 유진 표정 간 얼굴/화풍 일관성 |
| 8 | F09 | NOT_IMPLEMENTED. CH4 도입 이후와 엔딩 연결 |
| 9 | F10 | APPROVAL_REQUIRED. ORIGIN TRACE 원본 판정 포기와 선택 허용 충돌 |
| 10 | F11/F13 | OPEN / 이번 미검증. 일부 입력·전환 마감, 활성 음향 부재 |

보존할 부분은 첫 사망의 불확실성, 기억 재구성 후 행동 변경, 조사/추론 조건, 정확한 지식 공개가 경계를 부르는 기존 결과다. 이번 수정은 이 구조의 사실성을 보완한다.

핵심 사용자 판단은 민서 최종 얼굴/화풍 방향과 CH2 소지품·대사 복원 범위다. 비교가 없는 창작안을 임의 적용하지 않았다. 다음 안전 제작 범위와 정확한 저장 재개점은 [NEXT_BATCH.md](NEXT_BATCH.md)에 있다.
