# 민서 구도 확인 · 다음 수동 표정 작업

## 이번 실제 수행

Clinical v03과 단독175% 구도를 유지했다. 신규 이미지 생성0, 채택0, RGB/알파 수정0, manifest 변경0. 이번에 Midjourney 자동화 허가를 확인하지 않았고 서비스 생성/API/자동 클릭을 실행하지 않았다. 아래는 **사용자 수동 실행 대기** 작업이며 생성 결과가 아니다.

원본 기준은 `assets/characters/minseo/IDENTITY_LOCK_2026-09-12.md`. 현재 v03은 **기존 Midjourney 후보 A의 RGB + ComfyUI BiRefNet 알파**, 896×1344, 머리부터 허벅지까지다. Qwen 연구안이 최종 채택되었다거나 신발까지 있는 전신이라고 기록하지 않는다. 이전 v02/v03 원본/출처/manifest와 실패 후보를 보존했다.

## 실제 화면 구도

| 같은 논리 상태 | 실제 확인 | 판정 |
|---|---|---|
| MINSEO_QUESTION, Loop2 offset188, beat12, 단독 | A 및 [짧은 B](EVIDENCE/353-art-minseo-solo-B.jpg), [큰 글꼴 C](EVIDENCE/356-art-minseo-solo-C.jpg) | 얼굴/머리선이 잘리지 않음. C의 아래 선택 비용은 [정상 스크롤](EVIDENCE/357-art-minseo-solo-C-scroll-choice-cost.jpg)로 확인. 스크롤 후 상태 동일 |
| LOOP2_06_CARD, offset172, beat10, 민서/유진 다인 | A 및 [C](EVIDENCE/360-art-minseo-duo-C.jpg), [선택지 스크롤](EVIDENCE/361-art-minseo-duo-C-choices-scrolled.jpg) | 두 얼굴과 대사 분리. 비화자 dim은 런타임 연출. B 다인은 미검증 |

표정의 강한 변경이 이번 상태/입력 작업을 개선한다는 근거가 부족해 현재 원본을 유지했다. 신규 파생본이 없으므로 새로운 합성 경계/알파 수정 검증을 수행했다고 주장하지 않는다. 원본 파일 해시는 작업 전과 비교해 보존을 확인한다. 생성→비교→채택→통합 단계를 완료로 표시하지 않는다.

## ComfyUI 현재 읽기 확인

기존 8188 서버의 `/object_info`만 읽고 [노드/모델 목록](EVIDENCE/comfy-readonly-node-inventory.json), [Edit 관련 노드](EVIDENCE/comfy-readonly-edit-alpha-nodes.json)를 저장했다. 워크플로/큐/모델/탭은 변경하지 않았다.

- 기본 생성: `qwen_image_2512_fp8_e4m3fn.safetensors`, `qwen_2.5_vl_7b_fp8_scaled.safetensors`, `qwen_image_vae.safetensors`, UNETLoader/CLIPLoader/VAELoader/ModelSamplingAuraFlow/CFGNorm 확인.
- 별도 Edit 가중치: `qwen_image_edit_fp8_e4m3fn.safetensors`, TextEncodeQwenImageEdit / EditPlus 확인. 단순 VAEEncode img2img와 전용 Edit를 같은 작업이라고 부르지 않는다.
- LoRA 목록: Qwen-Image-Lightning-4steps-V1.0, qwen_image_union_diffsynth_lora. 이번에는 적용하지 않았다.
- 알파 작업은 RGB 생성/Edit와 별도다. 이번 서버 응답에서 BiRefNet 이름의 노드를 다시 확인하지는 못했다. 기존 v03의 기록된 BiRefNet 출처는 보존하며, 그것을 이번 새 알파 실행으로 계산하지 않는다.
- SDXL로 생성하지 않았다. Qwen 실패 후보 반복 생성도 하지 않았다.

## 수동 MJ 작업 1 — 임상적 집중의 미세 표정

장면 목적: CH3 민서의 머리 손상 질문. 기본 얼굴 재선정 금지. 눈매/입술/얼굴 비율/성인 나이/체형/가운/스크럽/손 자세 유지. 기존 눈썹보다 아주 작은 안쪽 긴장만 허용한다.

참조 파일:

- 인물/구도: `C:/Dev/zero-hour-game/assets/characters/minseo/sprites/CHAR_Minseo_Clinical_ThreeQuarter_v03.png`.
- RGB/화풍 비교 원본: `C:/Dev/zero-hour-game/docs/qa/production/2026-09-11-safe-a/ART_REVIEW/minseo-mj-reference-A.png`.
- 기존 출처: Midjourney job `1d2b6ec1-cc47-4457-b286-3a6ea265f2d4`, index0. 이번 생성 job이 아니다.

아래는 이전 준비 작업의 V7/Omni Reference 설정을 유지한 완성 프롬프트다. 수동 UI에서 해당 설정의 지원 여부를 확인해 실행할 작업이며, 이번 세션에서 서비스 실행 가능성을 검증한 것은 아니다.

```text
Clinical noir Korean webtoon visual novel character sprite of the exact same adult Korean woman doctor in the Omni Reference. Head to mid thighs, same three-quarter pose, one hand in the coat pocket and the other relaxed. Same long face, narrow black almond eyes, exact lip shape, apparent age, long side-parted black hair and exposed ear. Matte skin, restrained black linework, muted flat colors and subtle two-tone shadows. Opaque white doctor coat over charcoal V-neck scrubs with a waist drawstring. She is asking a careful clinical question about a possible head injury: calm restrained concentration with only a very slight inward tension of the eyebrows. Preserve the eye and mouth shapes. No smile, no anger, no panic. Flat neutral gray backdrop. No badge, stethoscope, wristwatch, jewelry, extra accessories, text or watermark. --v 7 --ar 2:3 --raw --s 50 --chaos 0 --ow 100
```

필요 결과: 원본과 나란히 얼굴 100% 및 전체 구도로 비교할 원화 1개와 job/설정 기록. 예정 저장 위치: `C:/Dev/zero-hour-game/docs/qa/production/2026-09-12-loop3-ch4-state-ui/ART_REVIEW/mj-focused-user-run-01.png` (**현재 없음, 수동 실행 대기**).

Qwen 연구를 재개한다면 같은 참조와 장면 목적을 사용하되 기존 실패와 같은 눈/입술 변화가 보이면 채택하지 않는다. 생성과 알파를 구분하고 알파만 수정했을 때 RGB 완전 동일, 가운 내부 불투명, 머리카락/소품 경계를 실제 비교해야 한다. 채택 후에만 별도 파생 파일/manifest를 추가하고 같은 save/beat/해상도/글꼴의 전후 GUI를 남긴다. 원본이 더 좋으면 계속 원본을 유지한다.
