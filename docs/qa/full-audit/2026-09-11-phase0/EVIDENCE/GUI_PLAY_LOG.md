# 실제 GUI 플레이 로그
기준 HEAD/APK/기기/격리 방식은 ../BASELINE.md 참조. 날짜 2026-09-11.
Computer Use의 sky 스크린샷 기반 클릭으로 플레이했다. adb는 설치/실행/스크린샷/로그/read-only 저장 상태 수집에 사용했다. adb input, deep link 장면 점프, QA checkpoint, 세이브 주입으로 플레이 경로를 건너뛰지 않았다.

## 경로
첫 밤 17개 장면:
SCENE_ACT0_DRIVE → SCENE_ACT0_WATCH_CALL → SCENE_ACT0_MESSAGES → SCENE_ACT0_LAST_CALL → SCENE_ACT0_ARRIVAL → SCENE_ACT1_YUJIN_FIRST → SCENE_ACT1_YUJIN_SEARCH → SCENE_ACT1_YUJIN_DENIAL → SCENE_ACT1_YUJIN_WARNING → SCENE_ACT2_THIRD_FLOOR → SCENE_ACT2_NURSE_AT_302 → SCENE_ACT2_ROOM_CONTRADICTION → SCENE_ACT2_WRISTBAND → SCENE_ACT2_REMOTE_KNOWLEDGE → SCENE_ACT3_MAP_AND_TAEJUN → SCENE_ACT3_BLACKOUT → SCENE_FIRST_DEATH.

Loop 2의 11개 장면:
SCENE_LOOP2_RESET_AWAKENING → SCENE_VERTICAL_SLICE_TITLE → SCENE_LOOP2_FIRST_CALL_TEST → SCENE_LOOP2_MESSAGE_TEST → SCENE_LOOP2_EARLY_ARRIVAL → SCENE_LOOP2_FIRST_PHONE → SCENE_LOOP2_PHONE_PARADOX → SCENE_LOOP2_YUJIN_FOREKNOWLEDGE → SCENE_LOOP2_STAFF_DOOR → SCENE_LOOP2_BLACKOUT_INTERVENTION → SCENE_LOOP2_OPERATIONS_CORRIDOR.

28/70 장면 통과. ACT0_ARRIVAL은 연속 탭 중 지나가 개별 화면을 확인하지 못했다(앞뒤 연결과 다음 장면 시각으로 추적). 나머지27개는 적어도 한 화면/선택을 개별 확인했다. 전 장면의 모든 비트나 모든 선택을 읽었다는 뜻이 아니다.
처음에는 10~42회 연속 탭에서 후속 단일 선택까지 같은 위치로 진행된 구간이 있다. 이후 선택 아래쪽(y850~881)으로 대사 탭 위치를 옮겨 별도 선택 클릭을 했다. 28개 모두를 초견 감상/의도적 의사결정 경로로 해석하지 않는다.
원본 GUI 도구 호출과 이미지는 이번 작업 대화에도 남는다. 이 로그는 그 호출을 요약한 수기 검수 기록이며 자동 수집된 모든 클릭 타임스탬프 로그는 아니다.

## 검사 순서와 결과
| 번호 | 장면/조건 | 정상 UI 입력 | 결과 | 증거 |
|---|---|---|---|---|
| G01 | 새 설치 타이틀 | 새 게임 시작, 안내1/3 닫기 | 첫 통화 진입 | android-title.png, android-opening.png |
| G02 | ACT0_DRIVE | 대사 탭, 시간 안내2/3 닫기, 첫 선택 | 시각21:23→21:27 | android-first-choice.png |
| G03 | ACT0_WATCH_CALL | 현장 키트 열기 | 죽음 전 MNEMOSYNE/INSTANCE01 노출 | android-early-fieldkit.png; F05 |
| G04 | 현장 키트 | Escape 시도, X로 닫기 | Escape 변화 없음; X 닫힘 | 도구 호출; Escape를 Android Back 성공으로 합산하지 않음 |
| G05 | ACT0_WATCH_CALL | y610 글자 근처 반복 탭, y682 아래 탭 | 위쪽 무반응/아래쪽 진행 | 도구 호출, F11 코드 상단88 hitbox |
| G06 | ACT0~ACT2 | 문자 보존 경로, 접수 확인, 302호 진입 | 정상 장면 연결 | android-yujin-reception.png |
| G07 | ROOM_CONTRADICTION 0/3 | 일반 하단 탭 | 조사 전에 진행 선택 없음 | 화면 관찰, 0/3 |
| G08 | 같은 방 | 사용 흔적 hotspot1 클릭→같은 지점3회 | 22:17→22:19; 반복 후22:19/1회 확인 유지 | 도구 화면 관찰; adb 별도 캡처 실패하여 빈 파일 제외 |
| G09 | 같은 방 | 손목밴드 hotspot3 클릭 | 22:21,2/3; 손목밴드 확인 선택 열림 | 도구 화면 관찰 |
| G10 | WRISTBAND | 정보 확인→제자리에 두고 나옴 | 22:24→22:28 | android-band.png, gui-band-left.jpg |
| G11 | REMOTE_KNOWLEDGE | 대사 진행 | 마지막에 지하를 묻기 전이었다 | gui-before-asking-contradiction.jpg; F06 |
| G12 | MAP_AND_TAEJUN | 직원 문 확인→대기 | 22:36→22:45 정전 | gui-taejun-first.jpg, gui-blackout-2245.jpg |
| G13 | BLACKOUT | 대사 끝까지 진행 | 시간 표시 없음 대사와22:45 HUD 병존 | gui-blackout-clock-contradiction.jpg; F01 |
| G14 | FIRST_DEATH | 소리를 따라감→대사 진행 | 기억 순서 UI 진입 | gui-death-reconstruct.jpg |
| G15 | 재구성 오답 | 문 잠금 해제를 첫 번째로 고름 | 0/3, 순서가 꼬였다 안내, 재시도 가능 | gui-death-wrong-order.jpg |
| G16 | 재구성 정답 | 불 꺼짐→초침 멈춤→전자 잠금 해제 | 기억 재구성 완료 | gui-death-memory-complete.jpg |
| G17 | 첫 리셋 | 이 기억을 가지고 돌아간다 | 차/21:23으로 복귀 | gui-reset-2123.jpg |
| G18 | RESET_AWAKENING | 깨진 시계 확인 기억 선택 | Foreknowledge 결과/21:24 | gui-first-foreknowledge.jpg |
| G19 | FIRST_CALL_TEST | 아직 오지 않은 문자 예측 | 두 문자 분기 선택→21:36 | gui-message-foreknowledge-choice.jpg |
| G20 | MESSAGE_TEST→EARLY_ARRIVAL | 모순 기록 후 병원으로 | 도착21:36; 시각 문제 | gui-loop2-arrival-2136.jpg |
| G21 | FIRST_PHONE→PHONE_PARADOX | 봉투 전화 확인, 연결 기다림 | 21:44; 공개/최소 공개2선택 표시 | gui-yujin-disclosure-choice.jpg |
| G22 | 공개 역효과 | 유진의 부정/정전을 정확히 말함 | 유진 경계 상승; 허위 과거 결과 설명 | gui-backfire-false-history.jpg; F04 |
| G23 | YUJIN_FOREKNOWLEDGE 끝 | 대사 끝까지 진행 | 추론 미완성으로 다음 선택 잠김 | gui-backfire-deduction-gate.jpg |
| G24 | FieldKit 추론 | 피난 안내도+자정에 열린 문→연결 검증 | DEDUCTION_BLACKOUT_ROUTE 완성 | gui-deduction-complete.jpg |
| G25 | FieldKit | 에뮬레이터 툴바의 Android Back 클릭 | 모달 닫힘, 진행 선택 열림 | gui-deduction-unlocked-choice.jpg |
| G26 | STAFF_DOOR | 설득 포기→잠금 해제 기다림 | 첫 사망 회피 결과,22:01 | gui-first-death-avoided.jpg |
| G27 | BLACKOUT_INTERVENTION→B1 | 대사→지하1층 내려감 | 22:03 B1 조사0/3 | gui-b1-investigation.jpg |
| G28 | B1 | 일시정지→메인 화면→이어하기 | 같은 B1/22:03/0/3 복구 | gui-title-continue.jpg, gui-resumed-b1.jpg |

## 종료 상태와 한계
- 실제 저장: loopCount2, time40(22:03), B1_OPERATIONS_CORRIDOR, FLAG_YUJIN_WARY=true, FLAG_FIRST_DEATH_AVOIDED=true, itemIds=[], 기억2개, 단서7개, 추론1개.
- 첫 사망 deathRecords.time82는22:45다. 루프2 visitedSceneIds11개는 실제 저장 파일에서 확인했다.
- B1의 hotspot은 아직 선택하지 않았다. 이후 내용은 GUI 미플레이.
- 배경 전환 직후 일부 캡처는 전환 중 어두운 프레임이다. 이후 정상 배경 표시를 확인했다. 즉시 어두운 프레임만으로 이미지 로딩 실패라고 판정하지 않았다.
- 게임 오디오를 실제로 듣지 않았다. 텍스트/화면 반응과 코드 연결만 검사했다.
- 180초 Android screenrecord를 시도했으며 영상은 첫 사망까지가 아니라 로비~손목밴드 구간이다. 파일명은 실제 범위에 맞춰 ignored .expo/phase0-audit-20260911/gui-lobby-to-band.mp4에 두었다. 전 구간 영상을 재생 검수하지 않았으므로 핵심 판정은 직접 본 GUI와 정지 캡처를 기준으로 한다.

