# 실제 GUI 검증 — 민서 교체 전후

2026-09-12 KST. Windows Computer Use의 `@oai/sky`로 Android 에뮬레이터 화면을 관찰하고 정상 UI 터치·스크롤을 보냈다. 브라우저는 Chrome Computer Use로 ComfyUI를 조작했다. adb는 설치·현재 패키지/로그 확인·격리 기기의 저장 복원/내보내기에만 사용했으며 게임 입력이나 장면 플래그 주입에 쓰지 않았다.

## 환경과 현재 코드 확인

`MAIN_ANDROID_API35` 기반 새 격리 userdata, serial `emulator-5580`, read-only/no-snapshot, API35,1080×2400,density420,font_scale1. 원래 AVD 저장은 건드리지 않았다. 앱 `com.jungih4982.zerohourgame`의 기존 debug APK를 새 기기에 설치하고 앱 서랍에서 터치로 실행했다. 현재 프로젝트 Metro와 실제 민서 표시 및 아래 번들 참조를 대조했다.

- 변경 전 번들 SHA-256: `a3917e8ddd4f055d7013a8f02a4a4528ff9f65b817d838f3e48a5bedf64faa0c`.
- 변경 후 번들 SHA-256: `b344aa64f99c2dde789eb57e4bea8bfd9e0b27e9ea5ed39b7c8139b40acebaea`.
- [변경 후 두 v03 참조와 번들 등록](bundle-after-minseo.txt). 새 native/release APK 빌드가 아니라 현재 JS/asset 개발 실행 검증이다.

## 수정 전 정상 입력 진행

이전 배치의 최종 정상 UI 저장 `acd8c3301e408462dd1ce3379877e35284d1957a6ef6f3fb5a4676cb07f1a033`를 복원하고 해시를 재확인했다. 새 게임의 첫 밤부터 다시 플레이한 것은 아니다.

1. F04 공개 종료 Loop2 21:45 → 현장 기록 → B1지도+자정 기억 → `DEDUCTION_BLACKOUT_ROUTE` 형성.
2. 직원용 문21:53 → 정전21:58 → B1 22:00. 기존 F01 시계 불일치를 재관찰했다.
3. 문패22:02, 카트 터치 시도, 리넨22:04. 카트 단서 획득은 확인하지 못했으며 2/3 조사에서 진행했다.
4. 세아22:08 → 태준22:11 → 위층22:16 → 서윤 재확인 → 302호22:22 → 두 전화22:26 → 두 번째 전화 소지22:28 → CCTV22:31.
5. CCTV 대사 마지막 beat13에서 `before-minseo-entry.sqlite` 저장. SHA-256 `e11b1f128ad2225158f77a16831054a04e3a4f5660da9b906d851037946cbbe6`.

이 배치에서 새 도달12장면, 시작 장면 포함13장면이다. 목록은 [범위 JSON](gui-scene-scope.json)에 있다. 빠른 대사 넘김이 포함된 기능 검증이며 자연스러운 독서 시간이나 몰입 측정으로 계산하지 않는다.

## 같은 저장·장면·입력 경로의 수정 후 비교

수정 후 앱을 종료한 상태에서 같은 `before-minseo-entry.sqlite`를 격리 기기에 복원했다. 내보낸 `after-restored-minseo-entry.sqlite` 해시가 입력과 일치함을 확인한 뒤 앱 서랍→이어 하기로 시작했다.

| 순서 | 두 실행에서 동일한 입력 | 전후 증거 |
|---|---|---|
| 1 | CCTV 마지막 대사에서 `SHOW_SECOND_PHONE_TO_TAEJUN` 터치(220,704) | `033` / `047` |
| 2 | 본문14회 빠른 터치로06카드 beat8,2회 더 터치로beat9 | `034`,`035` / `048`,`049` |
| 3 | 현장 기록(56,98) → 인물(150,891) → 아래로586px 스크롤 | `before-people-list-minseo.png` / `after-people-list-minseo.png` |
| 4 | 민서 카드(118,657) 터치 시 별도 상세 열리지 않음 → 닫기(388,108) | `038`,`039` / `052`,`053`. `038` 파일명의 profile은 시도명을 뜻하며 상세 화면 검증 아님 |
| 5 | 본문2회 → `COMPARE_06_WITH_WRISTBAND`(220,704) | `040`,`041` / `054`,`055` |
| 6 | 본문44회 →6회 →2회로 서윤 불확실 beat27 ‘연락 안 돼요?’ | `042`~`044` / `056`~`058` |

원시 좌표·횟수·UTC시각·캡처명은 [입력 로그](computer-use-inputs.ndjson)에 있다. 좌표는 해당452×957 캡처의 에뮬레이터 창 기준이다. 같은 논리 저장과 환경설정이 유지됐는지는 [전후 상태 검사](before-after-state-comparison.json)로 별도 확인했다.

최종적으로 추가 본문 터치로beat32의 두 선택지까지 도달했다. [최종 화면](059-after-minseo-scene-end.png), [정상 플레이 최종 저장](resume-final.sqlite), [읽기 가능한 저장](resume-final.json). 다음 선택은 아직 누르지 않았다.

## 실제 확인과 한계

06카드에서 유진과 민서가 함께 보이는 구도, 민서 단독 대사, 인물 기록 목록에서 새 이미지가 표시됐다. 대사·시계·선택 결과·복귀 위치는 같은 상태였다. 가운 하부 알파 개선은 원본 합성 비교로 확인했으며 상체 구도인 실제 장면에서 전신 노출을 검증했다고 하지 않는다.

수정 후 다른 분기·CH3·첫 밤 전체, 다른 장치·폰트, 실제 모바일 GPU·오디오·릴리스 성능은 미검증이다. 시스템 crash buffer에 OS/GMS 오류가 남아 있어 환경 전체 무충돌로 판정하지 않는다. 대상 앱 로그의 관측 범위만 [요약](android-log-summary.json)에 기록했다.
