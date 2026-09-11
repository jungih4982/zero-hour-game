# 민서 화풍 교정 비교 — 승인 전 후보

**현재 런타임 이미지는 교체하지 않았다.** 원본의 얼굴·복장과 후보의 정체성 차이를 사용자가 판단할 수 있도록 비교안을 제작했다. 민서 실제 등장 장면의 Android 전후 검증은 이번 배치에서 수행하지 않았다.

![몸 비교](C:/Dev/zero-hour-game/docs/qa/production/2026-09-11-safe-a/ART_REVIEW/minseo-body-comparison.jpg)
![얼굴 비교](C:/Dev/zero-hour-game/docs/qa/production/2026-09-11-safe-a/ART_REVIEW/minseo-face-comparison.jpg)
![다른 캐릭터와 선화 비교](C:/Dev/zero-hour-game/docs/qa/production/2026-09-11-safe-a/ART_REVIEW/cast-style-comparison.jpg)

## 기존안과 기준

- 현재 사용 파일: `assets/characters/minseo/sprites/CHAR_Minseo_Clinical_Full_v02.png`.
- 최신 로컬 얼굴 후보: `assets/characters/minseo/master/CHAR_Minseo_FaceMaster_v02.png.png`. `docs/art/ASSET_AUDIT_2026-08-29.md:60`은 이를 ‘후보’로 기록한다. 런타임 편입을 최종 얼굴 승인으로 간주하지 않는다.
- OBS-CODE/이미지 관찰: 현재 민서는 유진 Alarmed v03·태준 Watchful v01보다 머리카락과 얼굴의 그라데이션/광택이 강하다. 가운 아래쪽의 큰 알파 구멍은 실제 원본에 있다. 몸 비교의 왼쪽 패널은 그 알파를 회색 바탕에서 보여 준다. 원본을 보정한 그림이 아니다.
- 보호할 특징: 긴 검은 옆가르마 머리, 노출된 귀, 성인 여성의 길쭉한 얼굴과 좁은 눈, 절제된 표정, 흰 의사 가운과 짙은 회색 스크럽. 캐릭터의 직무·동기·관계·세계 규칙은 변경하지 않는다.
- 화풍 방향은 `VISUAL_BIBLE.md`의 Clinical Noir / 절제된 한국 웹툰 선화·무광 피부를 따른다. 비교 시트는 시각 검토용 크롭이며 생체 동일성 측정이나 자동 승인 판정이 아니다.

## 실제 제작 출처

| 도구/작업 | 실제 실행 | 결과와 판정 |
|---|---|---|
| Chrome Midjourney 화풍 연구 | [job 86347d5b](https://www.midjourney.com/jobs/86347d5b-2238-49d0-8d78-e3961cfe73ef?index=0), `--ar 2:3 --s 50`, 새 참조 업로드 없이 생성 | 생성 완료 표시 확인. 4개 개별 원본의 상세 검토/다운로드는 하지 않았으며 채택 후보가 아니다. |
| Chrome Midjourney 얼굴 참조 편집 | [job 1d2b6ec1](https://www.midjourney.com/jobs/1d2b6ec1-cc47-4457-b286-3a6ea265f2d4?index=0), `--edit` 기존 얼굴 참조, `--ar 2:3 --s 25` | A–D 4개 모두 상세 화면으로 보고 다운로드. 896×1344 RGB. 실제 스프라이트용 투명 배경은 아직 없다. |
| Chrome ComfyUI 1차 | 기존 SDXL BASIC 작업을 복제한 새 워크플로에서 생성 | `comfy-style-study-01.png`, 1024×1024, 12.24초 UI 표기. 흑백·배경·청진기·얼굴 변화로 미채택. |
| Chrome ComfyUI 2차 | 색과 소품 제외 조건을 수정해 재생성 | `comfy-style-study-02.png`, 1024×1024, 5.95초 UI 표기. 색은 개선됐으나 머리 모양/얼굴/소매/포즈가 달라 미채택. |

ComfyUI는 기존 설치된 `sd_xl_base_1.0.safetensors`, Euler / normal / 25 steps / CFG 6 / denoise 1을 사용했다. 원본 미저장 탭은 보존하고 `ZERO_HOUR_MINSEO_STYLE_REVIEW_20260911`을 새 이름으로 저장했다. 각 생성 PNG에 담긴 실제 seed·모델·프롬프트·워크플로를 `comfy-style-study-0*-prompt.json` 및 `*-workflow.json`으로 추출했다. 모델 설치/교체 없음.

새 파일을 Midjourney에 올리려던 호출은 `fileChooser.setFiles: Not allowed`로 실패했다. 기존 업로드 목록의 얼굴 이미지는 로컬 FaceMaster v02와 육안으로 대응했지만, 서버 파일과 로컬 파일의 바이트 동일성은 검증하지 않았다. 따라서 참조 출처가 있다는 사실과 최종 얼굴 승인은 구분한다.

## 원본 → 후보 → 영향 비교

| 후보 | 개선 관찰 | 차이/잔여 문제 | 제안 |
|---|---|---|---|
| A (`minseo-mj-reference-A.png`) | 무광 선화, 가운 아래쪽 채움, 추가 청진기 없음 | 원본보다 몸이 정면으로 돌아가고 목·어깨가 가늘어짐. 눈·입·턱 비율의 동일성은 판단 필요 | 화풍 방향 검토의 우선 후보. 얼굴 확정으로 자동 채택하지 않음 |
| B | 기존 얼굴 후보의 눈·입 인상이 상대적으로 가까움 | 화면 오른쪽 손목에 검은 액세서리가 추가됨. 상의와 허리 구조도 다름 | 얼굴 방향 대안. 선택해도 소품/의상 재교정 필요 |
| C | 가운 채움과 선화 일관성 | 얼굴이 더 정면이고 어깨·몸이 좁아짐. 눈 인상이 달라짐 | 우선순위 낮음 |
| D | 긴 머리와 차분한 표정 유지 | 턱/눈 비율·머리 실루엣 변화, 소매/가운 그림자 구조 차이 | A/B와 비교하는 보조 후보 |
| ComfyUI 1·2 | 색/선화 방향을 실제 생성으로 시험 | 정체성·의상·헤어 일치 실패 | 런타임 미채택. 얼굴/몸 참조를 연결한 워크플로가 다음 제작의 전제 |

**사용자 판단 안건:** 현재 얼굴과 FaceMaster v02 중 최종 기준을 정하고, A의 선화 방향 또는 B의 얼굴 인상을 어느 범위까지 허용할지 판단한다. 이 선택은 얼굴 정체성 및 체형에 영향을 주므로 승인 전 런타임 적용을 보류한다. 이번 생성물을 `ART LOCK`으로 등록하지 않았다.

승인 뒤 최소 제작 순서: 선택된 얼굴·BodyRef 결합 → 승인되지 않은 액세서리 제거/복장 구조 보존 → 가운 색과 알파 복구 → 기존 에셋과 나란히 동일 인물 검토 → 민서 실제 장면에서 같은 Android 화면/표정/대사 상태로 재검증. 현재 후보의 단색 배경을 곧바로 자동 제거해 출시 에셋으로 쓰지 않는다.
