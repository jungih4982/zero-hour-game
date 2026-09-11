# 차민서 — Clinical 스프라이트 기준 v03

## 결정 근거와 범위

2026-09-12 사용자는 바뀐 민서 에셋 방향이 마음에 든다고 밝혔고 별도 승인 없이 최선의 안을 자율적으로 선택·적용하도록 요청했다. 사용자가 A를 개별 지정한 것은 아니다. 작업자는 이전 비교안 A의 선화, 소품 추가 없음, 채워진 가운을 근거로 A를 선택했다.

이번 기준은 **Clinical 단일 표정의 대사·인물 기록용 이미지**다. 프로필/후면/다른 표정/신발까지 나오는 전신 마스터 패키지가 완성됐다는 뜻은 아니다. 등장인물의 이름·직무·관계·동기·확정 대사는 변경하지 않았다.

- 런타임: `sprites/CHAR_Minseo_Clinical_ThreeQuarter_v03.png`, 896×1344, RGBA, 머리부터 허벅지까지.
- 원화: `docs/qa/production/2026-09-11-safe-a/ART_REVIEW/minseo-mj-reference-A.png`.
- Midjourney job: `1d2b6ec1-cc47-4457-b286-3a6ea265f2d4`, index0.
- 후처리: 로컬 ComfyUI의 BiRefNet → 반전 마스크 → JoinImageWithAlpha → SaveImage. 이미지 RGB는 원화와 픽셀 단위로 동일하며 알파만 새로 만들었다.
- 이전 `Clinical_Full_v02`와 얼굴/몸 기준 후보는 보존한다. 이전 버전의 가운 알파 소실을 새 파생본에 재도입하지 않는다.

## 유지할 시각 특징

성인 여성, 길쭉한 얼굴, 좁고 검은 눈, 긴 검은 옆가르마 머리, 드러난 귀, 절제된 표정. 무광 피부와 제한된 음영, 일정한 검은 선화. 흰 의사 가운, 짙은 회색 V넥 스크럽과 허리 끈. 한 손은 가운 주머니에, 다른 손은 아래로 내린 자세.

임의 손목시계·배지·장신구·청진기를 추가하지 않는다. 파생 표정은 눈매·턱·입술·머리선과 의상 구조를 이 파일과 나란히 비교한다. Qwen 연구안처럼 눈이 처지거나 입술 폭이 달라지는 결과를 선화 개선만으로 채택하지 않는다.

## 로컬 제작 도구 기준

ComfyUI 생성의 주력은 `qwen_image_2512_fp8_e4m3fn.safetensors` + `qwen_2.5_vl_7b_fp8_scaled.safetensors` (`qwen_image`) + `qwen_image_vae.safetensors` + `ModelSamplingAuraFlow` + `CFGNorm`이다. 기본 SDXL은 이 작업 및 이후 ZERO HOUR 생성의 기본값으로 쓰지 않는다.

설치된 `Qwen-Image-Lightning-4steps-V1.0.safetensors`, `qwen_image_union_diffsynth_lora.safetensors`는 확인했지만 이번에는 적용하지 않았다. Qwen 2512 낮은 denoise 보정도 눈매/입술이 변해 미채택했다. 사용자가 선호한 원화를 유지한 결정이며 Qwen 연구안을 최종 에셋의 생성 출처로 잘못 표기하지 않는다.

제작·검증 기록: `docs/qa/production/2026-09-12-minseo-qwen/`.
