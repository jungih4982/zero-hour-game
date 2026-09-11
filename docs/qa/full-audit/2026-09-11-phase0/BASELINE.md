# PHASE 0 — 기준점 및 검증 기록
실행일: 2026-09-11 (Asia/Seoul). 대상: ZERO HOUR / 프로젝트 제로.
이 문서는 이번 실행의 직접 검사 기록이다. 과거 보고서의 PASS를 재사용하지 않았다.

## 소스와 보호 범위
- 루트: `C:\Dev\zero-hour-game`
- HEAD: `2f6e21a8eac8829bf216fdc177abb5b8b512304d`
- branch: `master`
- 시작 시 staged diff 0, unstaged diff 0, untracked 0.
- 시작 증거: [git-baseline.txt](EVIDENCE/git-baseline.txt), [tracked-sha256-before.csv](EVIDENCE/tracked-sha256-before.csv), before patch 두 파일.
- 새 감사 파일은 모두 이 감사 디렉터리에 저장했다. 원본 코드·시나리오·이미지·음원·설정·의존성·기존 세이브를 편집하지 않았다. 커밋, stash, branch 전환, 의존성 설치, 다른 프로젝트 조작을 하지 않았다.
- 테스트/실행 부산물: 기존 ignored `android/**/build`, Gradle 캐시, Metro/Expo 캐시, `.expo/phase0-audit-20260911`. 보고서 파일과 구별한다.
- 마지막 비교 결과는 [preservation-result.json](EVIDENCE/preservation-result.json), [git-after.txt](EVIDENCE/git-after.txt), [artifact-manifest.csv](EVIDENCE/artifact-manifest.csv)를 기준으로 한다.

## 지침 및 승인 근거
요청에 따라 Downloads의 `ZERO_HOUR_CODEX_MASTER_GUIDE.md`를 읽고 PHASE 0 규칙만 적용했다. 문서 뒤의 후속 제작 프롬프트를 이번 실행의 수정 권한으로 해석하지 않았다.
저장소 AGENTS.md와 docs/codex/CODEX_WORKFLOW.md도 읽었다. 현재 사용자 지시가 기존 문서의 일반 개발 절차보다 우선한다.

CANON은 `docs/story/production/v02/00_CANON_LOCK.md` 및 같은 패키지의 source priority/branch contracts를 대조했다. 제작 확정 표기는 문서에 적힌 승인 주장으로 취급한다. 별도의 최신 사용자 승인 이력까지 확인한 것은 아니다.
아트는 `docs/art/VISUAL_BIBLE.md`, `docs/art/ASSET_AUDIT_2026-08-29.md`, `assets/ASSET_MANIFEST.json`(updatedAt 2026-09-02)을 실제 파일과 대조했다. 독립적인 최신 ART_LOCK 문서는 찾지 못했다. `integrated`는 런타임 연결 상태이며 새 승인 증거가 아니다.

## 현재 구현과 의존성
`App.tsx → src/ui/NarrativePlayer.tsx → src/content/story.ts`가 활성 경로다.
`App.legacy.tsx`, `data/scenarioNodes.ts`, `store/useGameStore.ts`는 별도 구형 구조이며 활성 게임의 완성 콘텐츠로 합산하지 않았다. 레거시 첫 부분, 타입/초기 상태와 참조 경로를 읽었고 레거시 전체 플레이는 하지 않았다. TypewriterText는 현재 게임에서도 재사용된다.
실제 npm ls: Expo 54.0.37, React Native 0.81.5, React 19.1.0, TypeScript 5.9.3, Zustand 4.4.7.
package.json 요구 범위와 설치 버전을 구별했다. 취약점 전수 검사/온라인 dependency audit는 하지 않았다.

## Computer Use / Android 실행 증거
Computer Use 스킬을 읽고 실제 `@oai/sky` 호출로 창 목록, Android Studio Device Manager 화면 확인과 행 선택을 수행했다. 첫 캡처의 창 포커스가 맞지 않아 activate 후 다시 확인했다. 실제 앱 플레이는 Android Emulator 창의 스크린샷을 보고 마우스 클릭으로 했다.
에뮬레이터 툴바의 Android Back 버튼도 실제 클릭하여 현장 키트를 닫았다. 키보드 Escape는 효과가 없어 Back 성공으로 계산하지 않았다.

- AVD: MAIN_ANDROID_API35, Pixel 8, Android 15/API 35, x86_64, 16KB 페이지 이미지.
- 디바이스: `emulator-5580`; 1080×2400, density 420, font scale 1.0, 세로 화면.
- 새 감사 인스턴스는 `-read-only -no-snapshot -no-cache`와 별도 `-data .expo/phase0-audit-20260911/userdata.img`를 사용했다. 기존 AVD의 bare userdata 이미지를 초기 입력으로 사용했고 기존 qcow2 사용자 세이브를 복사하거나 게임 저장소에 주입하지 않았다.
- 설치 전 대상 패키지가 없음을 확인했다. 새 게임 UI로 시작했으며 QA checkpoint 환경변수를 켜지 않았다.
- package: `com.jungih4982.zerohourgame`, versionName 1.0.0, versionCode 1.
- APK: 현재 체크아웃에서 만든 `android/app/build/outputs/apk/debug/app-debug.apk`, 131204304 bytes.
- APK SHA256: `72BED25B0643EA56A1CEC54FF93F0FCE9CE0E5D1FA935577F748AA8A15405F6C`.
- Metro는 이 프로젝트 루트에서 CI=true, localhost:8081로 시작했다. adb reverse로 연결했으며 expo/AppEntry.js 2630 modules 번들 완료를 확인했다.
- debug APK의 JS는 로컬 Metro가 공급했다. 과거 설치 앱, Expo Go, 웹 플레이를 Android 검증으로 대체하지 않았다.

## 빌드와 자동 검증
| 실행 | 이번 결과 | 한계 / 증거 |
|---|---|---|
| npm test | PASS / exit 0 | EVIDENCE/npm-test.log |
| 감사 helper 추가 후 npm run typecheck | PASS / exit 0 | EVIDENCE/typecheck-after-audit-scripts.log |
| assembleDebug --offline, JBR 25.0.3 | FAIL | Gradle 설정 플러그인 평가에서 25.0.3 오류 |
| 같은 빌드, 설치된 JDK 17 | 첫 실행 FAIL | packageDebug IncrementalSplitterRunnable 오류 |
| JDK 17, --offline --stacktrace 재실행 | PASS | 소스 수정 없이 성공; android-build-stacktrace.log |
| 새 debug APK 설치/실행 | PASS | 첫 설치 시 adb offline, 재시도 성공 |
| 감사용 정상 상태 순수 시뮬레이션 | 끝점 도달 | normal-state-simulation.json; GUI 아님 |

npm test는 typecheck, dialogue, beats, characters, narrative, duration, layout, input, investigation, deductions, death-memory, choice-presentation, onboarding, chapter3를 실행했다.
70개 scene의 body→beat 보존 검사, CH3 원문 93개 대사 검사와 198개 조합 경로 검사는 이번 실행에서 통과했다.
이는 CH2 원문 전체 동등성이나 실제 터치/화면/몰입도를 보장하지 않는다. 44분은 7837자/분당210자 및 장면·선택 가산으로 계산된 **추정치**다. 실제 초견 독자의 30–45분 플레이 측정이 아니다.
간헐적 adb offline/재연결과 0-byte 캡처 실패가 있었다. 이것을 앱 크래시로 판정하지 않았다. 정상 GUI는 계속 조작할 수 있었다. 실패한 빈 캡처는 증거에서 제외했다.

## 실제 플레이 분모
[GUI_PLAY_LOG.md](EVIDENCE/GUI_PLAY_LOG.md)와 [COVERAGE.csv](COVERAGE.csv)에 장면별로 기록했다.
첫 밤 → 302호 조사 2개 → 첫 사망 → 기억 재구성 오답/정답 → 첫 리셋 → 첫 Foreknowledge → 문자 예측 → 유진에게 정확한 정보 공개 → 추론 잠금 해제 → 첫 사망 회피 → B1 진입을 플레이했다.
빠른 연속 탭 구간은 통과한 모든 순간의 대사를 관찰했다는 뜻이 아니다. 초반 몇 개 선택은 같은 위치의 후속 탭으로 진행되었다. 이를 자발적인 초견 판단이나 선택 의도 측정으로 쓰지 않는다.
B1에서 일시정지→메인 화면→이어하기로 22:03, 조사 0/3 상태 복구를 확인했다. 프로세스 강제 종료/재부팅/구버전 세이브 마이그레이션은 검증하지 않았다.
실제 감사용 저장소를 read-only로 읽은 파일이 isolated-gui-save.json/sqlite다. 기존 사용자의 세이브가 아니다.

## 미확인
CH2 B1 이후, CH3의 분기/두 번째 사망/Loop 3는 코드·이번 자동 시뮬레이션 범위이며 GUI 미플레이.
가로/태블릿/다른 Android API/실기기/iOS/접근성 큰 글자/스크린리더/오디오 청취/릴리스 빌드/장시간 성능/손상 세이브는 미검증.
아트 썸네일 전체 열람은 모든 원본의 픽셀 정밀 QA나 모든 이미지의 앱 내 표시 검증과 다르다.

