# ZERO HOUR — VERTICAL SLICE ASSET BRIEF

이 문서는 현재 구현된 버티컬 슬라이스에 필요한 이미지와 생성 순서를 관리한다. `VISUAL_BIBLE.md`와 `AI_ASSET_PIPELINE.md`를 우선하며, Midjourney 결과는 후보로만 저장한 뒤 정체성·공간 연속성·UI 가독성을 검수한다.

## 현재 바로 사용 가능한 이미지

- 병원 외관 / 폭설 도착
- 1층 로비
- 일반 복도
- 정전 복도
- 302호 일반/정리 후 동일 구도 배경 2종
- 3층 오래된 화재 대피 안내도 단서 클로즈업
- 서윤 투명 통화 스프라이트 3종: 긴장 / 공포 / 회피·경계
- 한유진 전신 마스터와 투명 경계/당황 표정 스프라이트
- 강태준 얼굴·전신 마스터와 투명 감시/거절 표정 스프라이트
- 윤세아 전신 마스터와 투명 경계/혼란 표정 스프라이트
- 차민서 얼굴·전신 마스터 후보
- 첫 죽음/자정 정전 전용 히어로 CG
- ZERO HOUR 앱 아이콘·스플래시·파비콘 세트

## 버티컬 슬라이스 필수 공백

생성 우선순위는 화면 노출 횟수와 장면 중요도 기준이다.

1. ~~`BG_1F_WestElevator_Normal_v01.png`~~ — 완료, 23:47 사건과 Loop 2 예측 장면용 승인본
2. ~~`BG_1F_StaffDoor_Normal_v01.png`~~ — 완료, 자정 전 대기 장면에 연결
3. ~~`BG_B1_OperationsCorridor_Blackout_v01.png`~~ — 완료, 첫 신규 루트에 연결
4. ~~`BG_1F_StaffDoor_Blackout_v01.png`~~ — 완료, 정전과 첫 죽음의 동일 구도에 연결
5. ~~`BG_1F_Lobby_Blackout_v01.png`~~ — 완료, 후속 로비 정전 장면용 승인본
6. ~~첫 죽음/자정 정전 히어로 CG~~ — 완료, 가해자와 사망 방식은 미확정으로 유지
7. ~~302호 내부 일반/정리 후 배경~~ — 완료, 동일 카메라 구도의 상태 변형으로 연결
8. ~~오래된 화재 대피 안내도 배경/단서 클로즈업~~ — 완료, 가짜 문자를 제거하고 후속 3층 장면용으로 대기
9. ~~윤세아 추가 표정 스프라이트~~ — 완료, 상세 대화 원문의 혼란 전환 비트에 연결

## 공통 배경 프롬프트 베이스

```text
cinematic Korean webtoon visual novel background, grounded modern Korean private hospital at night, clinical noir, restrained blue gray palette, realistic architectural proportions, crisp readable shapes, clean negative space for dialogue UI in the lower third, subtle fluorescent lighting, quiet unease from one physically plausible anomaly, no people, no readable text, no logos, no watermark, 16:9 composition --ar 16:9 --style raw --stylize 80
```

### 1F 서쪽 엘리베이터

```text
west-wing elevator alcove on the first floor, brushed stainless steel double doors, small B1 floor indicator glowing red, emergency intercom panel, narrow hospital corridor continuing into darkness, polished vinyl floor with restrained reflection, camera at human eye level, centered doors with open space on the left for a character sprite
```

### 1F 복도 끝 직원용 문

```text
staff-only access door at the end of a hospital lobby corridor, heavy pale gray fire door with electronic lock indicator glowing red, emergency evacuation diagram beside it with no readable writing, suggestion of stairs beyond, fluorescent ceiling light, camera facing the door at a slight angle, clear foreground for interaction
```

### B1 병원 운영 구역 통로

```text
low-ceiling basement hospital operations corridor, exposed pipes, folded transport carts, wall-mounted access log terminal with an unreadable glow, emergency lights only after a blackout, believable maintenance architecture, deep corridor vanishing point, no gore
```

### B1 두 침대 방 콘셉트 — 비확정

`06`은 현재 확정 원문에서 카드와 손목밴드에 적힌 숫자다. 특정 병실명이나 관찰실 번호로 확장하지 않는다. 아래 프롬프트로 만든 결과는 공간이 별도로 확정될 때까지 `generated/concepts/`에만 둔다.

```text
small underground hospital two-bed room after a blackout, two empty medical beds, one chair beside a dark window, switched-off television reflecting faint emergency light, unsettling because the room is too orderly, composition leaves space near the window for a seated patient character, no people, no clock, no readable numbers
```

### 1F 로비 정전

```text
the same modern Korean hospital lobby layout as the established lobby reference, all fluorescent lights off, only emergency exit lights and cold snow glow through glass doors, reception desk readable in silhouette, physically plausible darkness, empty central floor, no people, no gore
```

## 캐릭터 생성 원칙

- 얼굴 마스터와 의상 레퍼런스를 함께 사용한다.
- 먼저 전신 중립 포즈 한 장을 확정하고 실제 알파 채널의 투명 스프라이트로 파생한다. 감정·액션 파생은 그다음이다.
- 얼굴 구조, 헤어라인, 흉터 위치, 체형, 의상 절개선을 검수한다.
- 배경과 소품을 최소화하고 투명화하기 쉬운 단색 배경을 사용한다.
- 강태준의 흉터는 얼굴 마스터를 기준으로 인물의 오른쪽 이마 헤어라인, 정면 화면의 왼쪽에만 둔다. 과장된 상처나 전투 장비는 금지한다.
- 일반 대화는 투명 스프라이트와 배경을 런타임에서 합성하고, 핵심 사건은 전용 히어로 CG로 제작한다. 카드형 캐릭터 프레임은 사용하지 않는다.
- 넓은 화면은 현재 화자를 왼쪽, 대사창을 오른쪽에 두고 세로 화면은 장면과 대사를 상하로 분리한다. 내레이션과 주인공 시점에는 인물 스프라이트를 표시하지 않는다.
- 세로 화면의 단일 화자는 중앙 정렬한다. 2인 장면은 기기 방향과 관계없이 좌·우에 함께 배치하고 화자만 점등하며, 넓은 화면에서는 대사창을 아래로 내려 두 인물을 보존한다.
- 한 장의 중립 이미지를 모든 대사에 반복하지 않는다. 화자별 기본·경계·당황/공포 상태를 마련하고, 장면뿐 아니라 대사 비트의 감정 전환 시점에도 교체한다.
- 스프라이트 원본 비율은 머리·발 보존을 위한 안전 규격이며, 화면에서는 장면별 위치·크기·명암·표정을 따로 지정한다.

## 결과 처리

1. Midjourney 원본을 `assets/generated/midjourney/inbox/`에 원본 그대로 저장한다.
2. 선택 후보에는 같은 이름의 JSON을 붙여 프롬프트, 생성일, 이미지 URL, 참고 이미지, 선택 사유를 기록한다.
3. 크롭·색보정·투명화한 실제 사용본만 정식 파일명으로 이동한다.
4. 앱에서 모바일 세로와 넓은 화면을 모두 확인한 뒤 `integrated`로 표시한다.
