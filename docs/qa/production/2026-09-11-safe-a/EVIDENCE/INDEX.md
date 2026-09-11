# 최종 판정에 사용한 증거

중간 결과 파일도 과정 보존을 위해 남겼다. 최신 앱/GUI 판정에는 **verified** 이름의 자료를 사용한다.

| 목적 | 최종 자료 |
|---|---|
| 시작 트리·기존 증거 | `prior-evidence-revalidation.json`, 배치 상위 `BASELINE.md` |
| 기존 파일 보존·최종 차이 | `preservation-final.json`, `code-sha256-final.csv`, `final-code.patch`, `git-final-*` |
| 현재 Android 앱 연결 | `bundle-verified-sha256.txt`, `bundle-verified-f04.txt`, `metro-verified.log`, `android-verified-app.log` |
| 수정 전 오류 | `054-before-f04-false-history.png`, `f04-regression-before.log` |
| 최종 화면 | `061-verified-continue-same-checkpoint.png` ~ `064-verified-f04-scene-end.png` |
| 전후 비교 | `f04-before-after.jpg`, `f04-state-comparison.json`, before/verified `f04-result.json` |
| 같은 선택 직전 저장 | `before-f04-choice.sqlite`, `verified-restored-f04-choice.sqlite` — SHA-256 동일 |
| 자동 검사 | `npm-test-final-scoped.log`, `npm-test-final-exit.txt`, `diff-check.log`, `diff-check-exit.txt` |
| GUI 입력/범위 | `computer-use-inputs.ndjson`, `GUI_PLAY_LOG.md` |
| 오류 로그 | `android-verified-crash.log` — 수집된 crash buffer 비어 있음. 전체 안정성 보증 아님 |
| 최종 재개 저장 | `resume-final.sqlite/json`, 상위 `NEXT_BATCH.md` |
| 미적용 시간 실험 | `timing-probe.ts`, `timing-probe.json`, `timing-probe.log` — 자동 시뮬레이션 |
| 작업용 프로세스 종료 | `runtime-cleanup.txt` — 의도적으로 Metro/격리 에뮬레이터 종료 |

원본 Android 번들은 ignored `.expo/safe-a-20260911/`에 있다. 테스트 프로세스 exit0과 정리를 위한 Metro 종료 exit1을 구분한다. Python 호출은 번들 런타임 `C:/Users/hjg/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe`를 썼다. PATH의 Windows Store `python` 별칭은 실행되지 않아 대체했다.

배치 상위 `artifact-manifest.csv`는 자체 파일을 제외한 이 배치 산출물의 해시 목록이다. 기존 PHASE 0 manifest는 별도이며 수정하지 않았다.
