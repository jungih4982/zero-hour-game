# 증거 인덱스
모든 현재 실행 증거의 기준 HEAD/빌드/기기는 [BASELINE.md](../BASELINE.md)에 기록했다. 현재 코드를 읽은 분석, 순수 상태 시뮬레이션, GUI 플레이를 혼합하지 않는다.

## 기준·실행·보존
| 파일 | 내용 |
|---|---|
| git-baseline.txt, staged-before.patch, unstaged-before.patch | 시작 root/HEAD/branch 및 empty diff |
| tracked-sha256-before.csv | 모든 tracked 파일 초기 hash |
| git-after.txt, preservation-result.json | 최종 소스/dirty/보존 비교 |
| artifact-manifest.csv | 새 감사 파일별 경로/크기/hash; 자기 자신 제외 |
| current-apk-sha256.txt, android-install.txt | 이번 debug APK 및 설치 증거 |
| metro.log | 현재 프로젝트 경로와 Android 번들 완료 |
| android-build.log / android-build-jdk17.log / android-build-stacktrace.log | 실패2회와 최종 성공을 모두 보존 |
| npm-test.log / typecheck-after-audit-scripts.log | 이번 자동검사 결과 |
| emulator-stdout.log / emulator-2-stdout.log | 첫 실패 및 실제 격리 실행 로그 |
| android-crash-buffer.log | 수집 시 crash 버퍼 출력. 빈 결과만으로 모든 기간의 무크래시를 보장하지 않음 |
| runtime-cleanup.txt | 이번 실행의 Metro/에뮬레이터 종료 확인 |

## GUI
[GUI_PLAY_LOG.md](GUI_PLAY_LOG.md)는 경로, 입력, 장면, 결과, 미확인 범위의 연결표다.
[gui-scene-sequence.json](gui-scene-sequence.json)은 통과28개 장면 목록. [coverage-summary.json](coverage-summary.json)은 분모를 담는다.
- 초기 화면/초기 선택: android-title.png, android-opening.png, android-first-choice.png
- F05: android-early-fieldkit.png
- F01: gui-blackout-2245.jpg, gui-blackout-clock-contradiction.jpg, gui-loop2-arrival-2136.jpg
- F03의 첫 밤: android-band.png, gui-band-left.jpg
- F04: gui-backfire-false-history.jpg
- F06 일부: gui-before-asking-contradiction.jpg
- 캐릭터/UI: android-yujin-reception.png, gui-taejun-first.jpg, gui-yujin-disclosure-choice.jpg
- 첫 사망/재구성: gui-death-reconstruct.jpg, gui-death-wrong-order.jpg, gui-death-memory-complete.jpg
- 리셋/기억: gui-reset-2123.jpg, gui-first-foreknowledge.jpg, gui-message-foreknowledge-choice.jpg
- 진행 잠금/추론/해제: gui-backfire-deduction-gate.jpg, gui-deduction-complete.jpg, gui-deduction-unlocked-choice.jpg
- 첫 죽음 회피/B1: gui-first-death-avoided.jpg, gui-b1-investigation.jpg
- 메뉴 복귀/이어하기: gui-title-continue.jpg, gui-resumed-b1.jpg

gui-*.jpg는 Computer Use가 반환한 실제 창 스크린샷 데이터를 변형 없이 감사 파일로 보존한 것이다. android-*.png는 adb screencap의 원래 기기 해상도다.
실패한 0-byte PNG 두 개는 제외했다. 별도의 폴더/다른 사용자 화면을 캡처 증거로 포함하지 않았다.
선택 상태 캡처는 장면의 모든 텍스트를 읽었다는 증거가 아니므로 COVERAGE의 PARTIAL_DIALOGUE와 함께 해석한다.

## 저장 상태와 시뮬레이션
- isolated-gui-save.sqlite/json: 이 감사용 새 설치의 AsyncStorage를 run-as cat로 읽어 복사한 데이터. 실제 게임 입력으로 생성됐다. 원본 앱 DB를 수정/주입하지 않았다.
- normal-state-simulation.json: 현재 순수 엔진으로 일반 초기 상태부터 조건/조사/추론을 사용해 종료점까지 진행한 로그. GUI가 아니며 여기의 모든 시각을 GUI 시각으로 보고하지 않았다.
- ../SCENE_GRAPH.json: 실제 런타임70개 장면/90개 연결. 조건을 무시한 구조 도달성과 조건을 만족한 플레이를 구별한다.
- ../DIALOGUE_COMPARISON.csv: 승인 CH2 인용 구절의 정확 문자열 검색 보조표. 완전한 의미 비교/삭제 대사 수 통계가 아니다.

## 이미지와 영상
[ART_CONTACT_SHEETS/README.md](../ART_CONTACT_SHEETS/README.md), ART_ASSETS.csv, ART_LOCK_COMPARISON.csv 참조.
감사 영상은 대용량 저장소 추가를 피하려고 ignored 로컬 경로 `C:\Dev\zero-hour-game\.expo\phase0-audit-20260911\gui-lobby-to-band.mp4`에 보존했다(약13.8MB). 로비~손목밴드180초 수집이며 첫 사망 전체 영상이 아니다. 전 영상을 다시 재생 검수하지 않았으므로 판정의 주 증거는 직접 본 GUI와 캡처다.
감사 helper .py/.ts는 이번에 새로 만든 데이터/시트/보고서 보조 코드다. 초기 생성 helper 재실행은 사람이 열람한 상태 표기를 초기화할 수 있으므로 원본 검증 로그와 현재 결과를 구별한다.

