# 정확한 재개점과 다음 배치

Git은 `master`, HEAD `f67c6324fdc569857a8bc4e08f07ec3476446ce3`. 이번 변경은 로컬 미커밋이며 스테이징하지 않았다. 다음 실행은 HEAD/diff/staged/untracked와 `EVIDENCE/final-integrity.json`/코드 해시를 다시 대조한다. checkout/reset/restore/clean으로 맞추지 않는다.

## 주 재개 저장

- 원본 정상 플레이 체크포인트: `EVIDENCE/fresh-loop3-memory-choice.sqlite`
- SHA256: `752b1f562e5604ddf14e60170aa8b43b270ae39a871113de6ef62cd3bc53d17e`
- 최종 앱 복원 확인 사본: `EVIDENCE/resume-final.sqlite`와 `resume-final.json`.
- 최종 사본 SHA256: `5d354749035da102daaf9b010e2a827b49f5d237551dbc326f9cce231d4def25`. SQLite 내부 바이트는 앱 재저장으로 달라졌으나 내보낸 모든 JSON 값은 위 주 체크포인트와 동일한지 별도로 검사했다.
- 장면 `SCENE_CH3_RESET_2123`, Loop3, `CAR`, offset0=21:23, saveVersion5, clock.contractVersion1, `standard`, `lastBeatIndex8`.
- 화면에 첫 선택 **“01:06 밀폐와 맞은편 계단을 먼저 말한다.”**, ID `USE_MEMORY_0106_SEAL`가 보인다. 아직 선택하지 않았다. 다음 정상 입력은 이 선택이며 `SCENE_CH4_OPENING`으로 이어진다.
- 기억3개(첫 정전, 첫 리셋, 01:06 밀폐), 단서19개, 추론4개. 정확한 ID는 JSON 참조. `itemIds=[]`, 현재 루프 flags={}, 사건 기록={}, visited는 재개 장면1개다.
- persistent flags에는 `BAND_CUSTODY_YUJIN=true`, `TRUST_YUJIN_PROGRESS=1`, `MINSEO_SAW_WATCH=true`가 남아 있다. 밴드 원본은 소지하지 않는다. 이 보관 플래그의 루프 지속 의미는 다음 소지품 검수 대상이다.
- 주 경로는 B1 표시 없는 문+린넨실, 카트 단서 없음. 마지막 단서는 무전/맞은편 계단이며 카드 판독기/06-B2 라벨 선택은 하지 않았다. 다른 복제 분기의 단서를 합치지 않는다.

최종 재개는 새 게임에서 끊김 없이 얻은 저장을 바이트 그대로 격리 기기에 다시 복원한 것이다. 복원 후 화면 확인을 별도 기록했다. 구버전 시각을 임의로 교정한 저장이 아니다.

## 격리 실행

작업 전용 Metro와 `emulator-5580`은 종료한다. 기존 사용자 기기5554·ComfyUI8188·Chrome은 유지한다. 다음 실행 시 `EVIDENCE/process-cleanup.json`을 먼저 확인한다.

작업 AVD는 `.expo/f01-dual-art-20260912/avd/ZERO_HOUR_F01_API35.avd`에 보존했다. 별도 `ANDROID_AVD_HOME` 환경에서 이름 `ZERO_HOUR_F01_API35`, 포트5580으로 실행하고 기존 MAIN AVD는 초기화하지 않는다. 기존 debug APK와 최신 로컬 Metro 번들을 확인한 뒤, 위 SQLite를 **격리 기기에만** 복원한다. 저장 복사 전 force-stop하고 journal이 비어 있는지 확인한다. 정상 앱 아이콘→이어하기로 위 장면/beat를 검증한다. `adb reverse`는 필요하지 않다(10.0.2.2:8081 사용).

## 첫 안전 수정 배치

1. `seal0106Memory.payoff`의 예고 사용 가능 시각210과 실제 Loop3 offset0 사용을 대조한다. 사건223을 별도 표시하고, 습득 기억 조건·루프 규칙을 유지하는 최소 메타데이터 수정을 검토한다. 위 정상 재개 선택의 전후 payoff와 CH4 도입까지 같은 경로로 검증한다.
2. B1 카트의 다른 세로 크기/큰 글자 입력을 확인한다. 현재 개선은 숫자 지점을 안전 영역으로 이동시키므로 원화상의 물체와 위치가 멀어지는 시각적 한계가 있다. 명시적 지점 라벨/연결선 등 안전한 표시 개선을 검토한다.
3. 손목밴드 재획득과 persistent 보관 플래그를 실제 원문과 대조한다. 근거 없이 아이템을 주거나 확정 대사를 쓰지 않는다. [비교안](CREATIVE_DECISIONS.md)의 결정과 독립적인 조사/UI 검증은 계속한다.
4. 이어서 용어 공개, ORIGIN TRACE 효과, CH2 원문 누락/축약을 범위별로 대조한다. 전체 감사 재시작 금지.

시간 계약의 실제 긴 대기와 “몇 분 사이” 표현은 창작 비교 안건이다. 새 대기 콘텐츠/원문 리라이트는 적용하지 않았다. 30~45분 독해 플레이는 별도 세션으로 필요하다.

## 다른 경로용 보존 체크포인트

| 저장 | 상태 / 첫 입력 |
|---|---|
|`fresh-b1-investigation.sqlite`|Loop2,00:01,operations corridor beat4,미조사. 카트 또는 문 중 하나를 정상 조사|
|`clone-b1-confirmed-cart-linen.sqlite`|00:05,실제 카트+린넨실 획득. 세아 질문→카트 우회 가능|
|`fresh-loop2-decision.sqlite`|21:25,first call test beat23. 직접 도착/문자 예측 분기|
|`fresh-three-disclosures.sqlite`|22:16,phone paradox beat9,세 공개 선택. 주 경로는 정확한 예지 공개 사용|
|`fresh-seoyun-uncertain-choice.sqlite`|00:17,beat32. 주 경로는 벽 정보 전달, 비공개는 별도 복제로 검증|
|`fresh-ch3-band-request.sqlite`|00:27,beat9. 세 보관 선택. 주 경로는 유진|
|`fresh-0106-evidence-choice.sqlite`|01:06,Yujin beat20. 세 배타적 마지막 단서. 주 경로는 무전|

기존 사용자 원본은 `../2026-09-12-minseo-qwen/EVIDENCE/resume-final.sqlite`, SHA256 `4242a01388a4b557b5ea1bc361c40d4961c66e34872d91771db6149cf4c0501e`. Loop2 offset72=22:35는 구계약이며 보존만 한다.
