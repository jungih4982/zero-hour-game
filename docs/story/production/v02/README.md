# ZERO HOUR — STORY PRODUCTION PACKAGE v02

이 디렉터리는 ZERO HOUR 본편 시나리오의 단일 구현 진입점이다.

Codex는 이 문서부터 읽고, 아래 순서대로 구현한다. 기존 대사를 요약하거나 새 문장으로 대체하지 않는다.

## 1. 패키지 구성

1. `00_CANON_LOCK.md`
   - 시간, 사건, 인물의 비밀, 세계 규칙, 결말을 고정한다.
2. `01_FULL_SCENARIO_MASTER.md`
   - 처음부터 엔딩까지 전체 장·루프·플레이 흐름을 정의한다.
3. `02_BRANCH_AND_STATE_CONTRACTS.md`
   - 선택 결과, 재합류 조건, 영속 상태, 엔딩 조건을 정의한다.
4. `scripts/CH03_THREE_TESTIMONIES.md`
5. `scripts/CH04_BELOW_THE_WARD.md`
6. `scripts/CH05_THE_SIXTH_ROOM.md`
7. `scripts/CH06_NIGHTS_LEFT_BEHIND.md`
8. `scripts/CH07_ZERO_HOUR.md`
   - 현재 구현 이후의 상세 대본이다.
9. `03_LANGUAGE_AND_CONTINUITY_QA.md`
   - 한국어 문체, 인물 말투, 분기 재합류, 정보 공개 순서 검수표다.
10. `04_CODEX_IMPLEMENTATION_HANDOFF.md`
    - 코드 제작 시 지켜야 할 순서와 금지 사항이다.
11. `05_AUTONOMOUS_PRODUCTION_OPERATIONS.md`
    - Chrome/Midjourney, Android, iOS Simulator, 실물 iPad를 포함한 자율 제작·QA 운영 규칙이다.

## 2. 전체 대본의 범위

본편 전체 대본은 다음 두 묶음을 합친 것이다.

### 동결 원문: 프롤로그부터 CHAPTER 2까지

아래 파일은 이 패키지의 일부이며, 중복 복사하지 않는다. 같은 저장소 안의 원문을 직접 읽는다.

- `docs/story/DIALOGUE_SOURCE_PRIORITY.md`
- `docs/story/CH00_WHITE_NIGHT.md`
- `docs/story/CH01_FIRST_SEARCH.md`
- `docs/story/LOOP2_FIRST_INTERVENTION.md`
- `docs/story/LOOP2_SEOYUN_DID_NOT_KNOW.md`
- `src/content/prologue.ts`

대사가 충돌하면 `DIALOGUE_SOURCE_PRIORITY.md`의 우선순위를 따른다. 특히 `LOOP2_SEOYUN_DID_NOT_KNOW.md`의 장면 4-111~4-152는 현재 구현보다 상세 원문을 우선한다.

### 신규 제작본: CHAPTER 3부터 엔딩까지

`scripts/` 아래의 다섯 장이 상세 대본의 기준본이다. 선택지 문구, 대사, 재합류 장면, 실패 결과까지 포함한다.

## 3. 상태 표기

- `[동결]`: 기존 상세 원문. 문장 단위 변경 금지.
- `[제작 확정]`: v02에서 본편 구현 기준으로 확정한 내용.
- `[연출 가변]`: 사건과 대사는 고정하되 화면 전환, 카메라, 효과음은 구현 과정에서 조정 가능.

이 패키지에는 `[후보]` 상태를 남기지 않는다. 구현을 막는 선택지는 `00_CANON_LOCK.md`에서 모두 결정했다.

## 4. 작품 기준

- 장르: 현대 한국 배경의 미스터리·추리·심리 공포.
- 핵심 재미: 죽음이나 실패로 얻은 지식이 다음 밤의 시간, 위험, 동선, 관계, 정보 공개를 바꾼다.
- 참고 감각: 레이튼 시리즈의 관찰·추론, 호텔 더스크의 인물 심문과 공간 미스터리. 퍼즐의 외형을 모방하지 않고, 단서가 이야기의 행동을 여는 구조만 참고한다.
- 중심 질문: `서윤은 어디에 있는가?`에서 시작해 `내가 떠난 밤은 정말 사라졌는가?`로 확장한다.
- 감정적 결론: 어느 인스턴스가 원본인지 증명하는 대신, 지금 눈앞의 사람을 선택하고 자신이 기억한 죽음을 없던 일로 만들지 않는다.

## 5. 구현 전달 방식

이 패키지를 채팅에 통째로 붙여 넣지 않는다. Codex Local에서 `/Users/jungi/zero-hour-game`을 열고 다음과 같이 지시한다.

> `docs/story/production/v02/README.md`부터 지정된 순서대로 읽어라. 동결 원문과 v02 제작 확정본을 시나리오 소스로 삼고, `04_CODEX_IMPLEMENTATION_HANDOFF.md`와 `05_AUTONOMOUS_PRODUCTION_OPERATIONS.md`의 단계·권한 경계·금지 사항을 지켜 구현하라. 한 장씩 구현·플레이·검증하며, 아직 구현하지 않은 장의 대사를 임의 요약하거나 선공개하지 마라.

이 방식은 한 번의 대화 길이 제한으로 원문 일부가 잘리거나, Codex가 요약문을 새 대본으로 오인하는 문제를 피한다.
