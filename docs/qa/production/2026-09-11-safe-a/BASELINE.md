# ZERO HOUR 안전 제작 배치 A — 2026-09-11

- 루트: `C:/Dev/zero-hour-game`
- HEAD: `2f6e21a8eac8829bf216fdc177abb5b8b512304d`, branch `master`.
- 시작 상태: staged/unstaged 게임 diff 없음. 기존 미추적 `docs/qa/`는 PHASE 0 감사 산출물이며 보존했다. 새 배치 파일 생성 전의 짧은 상태는 도구 실행 기록에 있고, 저장한 untracked 목록에는 새 배치 baseline 파일 일부도 포함된다.
- 22:45 KST에 이전 감사의 소스 228개와 증거 101개의 SHA-256을 현재 파일과 다시 대조했다. 불일치 0. [재검증 JSON](EVIDENCE/prior-evidence-revalidation.json).
- 과거 테스트 PASS를 가져오지 않았다. 현재 수정 전 `npm test`를 다시 실행해 exit 0을 확인했다. [로그](EVIDENCE/npm-test-before.log).
- 기존 감사 폴더, CANON/시나리오, 캐릭터 원본, 설정, 의존성, 기존 사용자 저장 상태를 변경하지 않았다. stash/commit/branch 전환/push 없음. PROJECT SALVAGE 및 다른 프로젝트를 작업 대상으로 사용하지 않았다.

## 기준과 범위 판단

첨부 마스터 가이드는 운영 지침으로 읽었다. 그 문서의 첫 PHASE 0 전용 ‘수정 금지’는 이번 사용자의 후속 제작 요청을 덮어쓰지 않는다. `AGENTS.md`, `CODEX_WORKFLOW.md`, 최신 `00_CANON_LOCK.md` 관련 시간/죽음 규칙, CH3 원문의 00:27 시작, `LOOP2_FIRST_INTERVENTION.md`, `VISUAL_BIBLE.md`, 민서 승인 상태 문서를 직접 확인했다.

Computer Use 스킬의 Windows `@oai/sky`와 Chrome CUA를 실제 호출했다. 초기 `sky.listWindows` 오호출은 API 문서의 `list_windows`로 바로잡았다. 앱/창 선택, 화면 캡처, 정상 포인터 입력이 실제 작동했다. Chrome 파일 업로드는 확장 권한으로 실패했다. 보안 설정을 바꾸지 않고 기존 Midjourney 업로드 목록의 민서 얼굴 이미지를 참조했다.

## Android 환경과 소스 식별

- AVD `MAIN_ANDROID_API35`, Android API35, x86_64, Pixel 8 계열. 에뮬레이터 `emulator-5580`.
- 1080×2400 physical pixels, density 420, font_scale 1.0. Computer Use 창 캡처 452×957은 OS 창 크기이며 앱의 논리 dp와 동일하지 않다.
- 기존 AVD를 `-read-only -no-snapshot`으로 시작하고 새 `.expo/safe-a-20260911/userdata.img`를 사용했다. 기존 사용자 세이브 및 지난 감사의 격리 SQLite는 보존했다.
- 설치한 debug APK: `com.jungih4982.zerohourgame`, 1.0.0 / code 1. SHA-256 `72BED25B0643EA56A1CEC54FF93F0FCE9CE0E5D1FA935577F748AA8A15405F6C`.
- JS 전용 변경이므로 기존 개발 APK에 현재 트리의 Metro 번들을 로드했다. 네이티브/release 빌드를 새로 만들지 않았다. Metro 로그에 실제 프로젝트 루트가 기록되어 있다.
- 명령: `CI=1 node node_modules/expo/bin/cli start --localhost --port 8081`. `adb reverse tcp:8081 tcp:8081`. CI 모드는 파일 감시가 꺼져 있으므로 각 코드 수정 후 소유 프로세스를 확인하고 Metro를 재시작했다.
- 수정 전/중간/최종 번들의 원본은 ignored `.expo/safe-a-20260911/`에, 해시와 F04 모듈 발췌는 `EVIDENCE/bundle-*-sha256.txt`, `bundle-*-f04.txt`에 보관했다. 최종 판정은 `bundle-verified-*`와 `metro-verified.log`를 사용한다.
- 초기 실행 후 홈 화면으로 돌아온 관찰이 있어 재실행했다. crash buffer는 비어 있었으므로 크래시라고 단정하지 않는다. 이후 이번 대표 경로를 진행했다.

## 검증 구분

`OBS-GUI`: 실제 화면과 정상 입력. `OBS-CODE`: 현재 파일 직접 확인. `SIM`: 순수 엔진 시뮬레이션. `PROPOSAL`: 미적용 변경안. 대표 경로의 연속 대사 탭은 기능 확인용이며, 독자의 자연 독서 시간이나 몰입도 테스트로 계산하지 않는다.
