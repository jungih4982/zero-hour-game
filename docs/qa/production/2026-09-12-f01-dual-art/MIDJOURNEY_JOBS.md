# Midjourney 제작 대기 — 사용자 실행 필요

2026-09-12 공식 [Community Guidelines](https://docs.midjourney.com/hc/en-us/articles/32013696484109-Community-Guidelines)에서 별도 예외가 허가되지 않은 자동화를 금지함을 확인했다. 이 계정에 대한 예외 승인이나 공식 자동화 경로는 확인되지 않았다. 따라서 이번 신규 MJ 생성은 **실행하지 않았고 사용자 실행 대기**다. 기존 MJ 원본 A는 계속 사용했다. 브라우저 클릭·비공식 API로 생성하지 않았다.

공통 기준: `assets/characters/minseo/IDENTITY_LOCK_2026-09-12.md`. 얼굴을 다시 고르는 작업이 아니다. 동일한 Clinical v03의 성인 인상, 좁은 검은 눈, 입술 폭, 턱·머리선, 흰 가운/짙은 V넥 스크럽/허리 끈/자세를 보존한다. Qwen 후보와 같은 목적·화풍이며, 원본보다 정체성이 약하면 채택하지 않는다.

## 작업 1 — CH3 임상 질문 / 미세한 집중

- 참조 파일: `C:/Dev/zero-hour-game/assets/characters/minseo/sprites/CHAR_Minseo_Clinical_ThreeQuarter_v03.png`
- 원화/스타일 참조: `C:/Dev/zero-hour-game/docs/qa/production/2026-09-11-safe-a/ART_REVIEW/minseo-mj-reference-A.png`
- 장면: `SCENE_CH3_MINSEO_QUESTION`, 머리를 부딪쳤는지 차분하게 확인하는 민서. 죽음 공개 장면에서는 “바로 표정을 바꾸지 않았다”는 원문을 지킨다.
- V7 사용 시 [Omni Reference](https://docs.midjourney.com/hc/en-us/articles/36285124473997-Omni-Reference)에 v03을 직접 올리고 가중치 100부터 비교. 스타일 참조에는 원화 A를 올린다. 원격 URL을 임의로 만들어 넣지 않는다. 현 서비스 기본 버전과 혼동하지 않도록 V7을 명시한다.
- 설정: `--v 7 --ar 2:3 --raw --s 50 --chaos 0 --ow 100`, 동일 참조/설정으로 한 작업만 실행. 얼굴 다양화 목적의 반복은 하지 않는다.

완성 프롬프트:

```text
Clinical noir Korean webtoon visual novel character sprite of the exact same adult Korean woman doctor in the Omni Reference. Head to mid thighs, same three-quarter pose, one hand in the coat pocket and the other relaxed. Same long face, narrow black almond eyes, exact lip shape, apparent age, long side-parted black hair and exposed ear. Matte skin, restrained black linework, muted flat colors and subtle two-tone shadows. Opaque white doctor coat over charcoal V-neck scrubs with a waist drawstring. She is asking a careful clinical question about a possible head injury: calm restrained concentration with only a very slight inward tension of the eyebrows. Preserve the eye and mouth shapes. No smile, no anger, no panic. Flat neutral gray backdrop. No badge, stethoscope, wristwatch, jewelry, extra accessories, text or watermark. --v 7 --ar 2:3 --raw --s 50 --chaos 0 --ow 100
```

필요 결과: 원본 다운로드 PNG, job ID, index, 실제 설정/프롬프트. 저장 위치: `C:/Dev/zero-hour-game/docs/qa/production/2026-09-12-f01-dual-art/ART_REVIEW/mj-focused-user-run-01.png`. 원본과 얼굴 확대 비교 후 채택 판단. 생성만으로 통합 완료 처리하지 않는다.

## 이번 실제 결과

기존 MJ A RGB와 BiRefNet 알파인 v03을 유지했다. ComfyUI Qwen 2512 일반 img2img와 눈썹 영역 합성은 실제 실행했으나 눈매 변화·합성 경계 때문에 미채택했다. 현재 통합 변경은 v03의 CH3 화면 확대율 교정이다. 신규 표정 채택과 혼동하지 않는다.
