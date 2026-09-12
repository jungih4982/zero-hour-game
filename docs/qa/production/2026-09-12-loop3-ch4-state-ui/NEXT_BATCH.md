# 다음 배치와 정확한 재개 지점

## 주 재개 저장

- 파일: `C:/Dev/zero-hour-game/docs/qa/production/2026-09-12-loop3-ch4-state-ui/EVIDENCE/final-resume.sqlite`
- SHA256: **`6cfe635ec4cb537cc9224fc82b7725815ab1712530b97a70f7d6a000c9326944`**
- 파싱본: [final-resume.json](EVIDENCE/final-resume.json). 자동 생성 요약: [RESUME_MANIFEST.json](EVIDENCE/RESUME_MANIFEST.json).
- 장면: **SCENE_CH4_T_03**, 장소 `1F_LOBBY`, Loop3.
- 시각: **offset53 = 22:16**. `saveVersion6`, `clock.contractVersion1`, 사건 `events={}`. 현재 밤의 정전/01:06 밀폐는 아직 발생하지 않았다.
- UI: `standard`, `lastBeatIndex6`, 마지막 대사 “영상 58초는 맞았습니다. 나머지는 한 시 육 분에 확인하면 되고요.” 제작 경계 안내 표시.
- 현재 소지: **B2_SECURITY_KEY 1개**. 손목밴드/지도 사진/첫 전화 없음.
- 기억3 / 단서20 / 추론4. 첫 사망 offset157, 두 번째 사망 offset223.
- 현 루프 flags: `FLAG_0106_AVOIDANCE_PLANNED=true`, `CH4_MAIN_ROUTE=taejun`, `CH4_TAEJUN_COOPERATING=true`, `CH4_WORKER_TRANSFER_CANCELED=true`.
- persistent flags: `BAND_CUSTODY_YUJIN=true`, `TRUST_YUJIN_PROGRESS=1`, `MINSEO_SAW_WATCH=true`, `TRUST_TAEJUN=true`. 보관 이력은 현 소지 증거가 아니다.
- **다음 첫 정상 입력: “확보한 기록을 확인한다.”** 현재 구현에는 T-03 다음 플레이 선택이 아직 없다. 첫 통화로 돌아가는 버튼을 다음 진행으로 오인하지 말 것.
- [최종 실제 화면](EVIDENCE/376-final-primary-resumed-T03.jpg).

## 분기 출처

이번 최종 Metro 04에서 **새 게임 정상 UI**로 만든 저장이다. 첫 밤 밴드 놓고 옴 → 첫 리셋 → 정확한 미래 정보 공개 → 정전 대기 → B1 표식 없는 문+린넨실(카트 미획득) → 302호 두 번째 전화 비공개 → CCTV/06 → 민서 벽 전달 → 옛 지도 세 조사와 추론 → CH3 유진 보관/시계만 공개 → 이송실 전체5조사/라디오 → 유진 사망 기억 → 두 번째 리셋 → 선행 기억 사용 → 태준 T-01/T-02/T-03.

`fresh-final-taejun-complete.sqlite` → 저장 주입 없이 앱 종료/재실행한 `fresh-final-cold-resumed.sqlite` → 아트/우회 분기 검증을 마친 뒤 그 파일을 격리 기기에 byte-copy 복원 → 정상 앱 아이콘/이어하기 → `final-resume.sqlite`. 세 파싱 JSON 전체가 동일하다. 마지막 복제 복원을 새 연속 플레이로 추가 계산하지 않는다.

카트 단서는 이 주 저장에 없다. 별도 `final-bypass-C-return302.sqlite`는 카트 분기 검사용이며 SHA256 `57907bf893be4f5e0352b6aa731be95d60d7702a8b1887689ef51e084e5e8be4`, Loop2 RETURN_302 offset166, beat1이다. 주 재개 저장과 섞지 말 것.

## 같은 기억 입력을 재검증할 저장

**이번 새 정상 경로:** `EVIDENCE/fresh-final-loop3-memory-choice.sqlite`, SHA256 `2f983c584b9709c4172ab583f2899f59dcaa6a9eabc2ed7411303bb97c747c35`. RESET_2123, Loop3/CAR/offset0/21:23, v6/clock1/standard/beat8. 첫 입력 **USE_MEMORY_0106_SEAL — “01:06 밀폐와 맞은편 계단을 먼저 말한다.”**

**이전 v5 원본 호환성용:** `../2026-09-12-f01-dual-art/EVIDENCE/fresh-loop3-memory-choice.sqlite`, SHA256 `752b1f562e5604ddf14e60170aa8b43b270ae39a871113de6ef62cd3bc53d17e`. 원본 보존. 같은 논리 위치지만 구버전 payoff가 들어 있으므로 새 v6 정상 플레이 증거로 대체하지 않는다.

## 다음 안전 제작 배치

1. 현재 HEAD/diff/staged/untracked와 이 저장/번들/무결성 기록을 다시 확인한다. 현재 master HEAD는 `f67c6324fdc569857a8bc4e08f07ec3476446ce3`이며 기존 F01 + 이번 배치가 미커밋이다. 강제 checkout/스테이징/커밋은 하지 않는다.
2. 승인 CH04 원문의 **T-03 → 보조 조사1개 → 01:05 이송실 밖 → 01:06 밀폐 관찰 → B2 입구**를 우선 연결한다. 단서만 얻는 보조 조사와 완전 신뢰를 분리하고, 이미 지급된 B2 열쇠/태준 신뢰를 중복 지급하지 않는다. 새 사건·대사는 쓰지 않는다.
3. 위 연결에서 남은 시간 장부, 01:06 사건1회, 과거 기억과 현재 소지, 메뉴/앱 종료 후 복원을 검증한다. 공통 시간/저장/리셋을 바꾸면 최종 번들 연속 경로도 다시 확인한다.
4. [창작 비교](CREATIVE_DECISIONS.md)의 손목밴드 재획득, Y-01 두 대사, S-02 지도 사진, ‘몇 분 사이’는 판단 전 적용하지 않는다. 이 결정과 독립적인 태준 후속은 계속할 수 있다.
5. B2 2개 조사 제한/06 문/04:10까지는 이후 안전 연결 범위다. 원문은 존재하며 ‘자료 없음’으로 처리하지 않는다.

## 실행 환경과 종료 상태

이번 작업의 Metro와 emulator-5580은 종료했다. 별도 userdata/원본/캡처는 남겼다. 사용자 emulator-5554, ComfyUI 8188(PID27680), Chrome은 유지했다. 다음 GUI 작업은 전용 기기를 확인한 뒤 위 SQLite를 복제 복원하고 정상 입력으로 시작한다. 원본을 수정하거나 다른 기기 DB를 덮어쓰지 않는다.

확인한 APK SHA256 `72bed25b0643ea56a1cec54ff93f0fce9ce0e5d1fa935577f748aa8a15405f6c`. 최종 번들 SHA256 `12e02ac733b022eceffb44b73e2deb0d09f0890343d5b61adbeb3628645ccf20`. 개발 계측은 `EXPO_PUBLIC_LAYOUT_QA=1`이며 __DEV__에서만 출력한다. 기존 adb reverse는 필요하지 않았다.

이 저장은 기능 검증의 재개점이다. 신규 플레이어 몰입 검수나 CH4 전체 완성 증거가 아니다.
