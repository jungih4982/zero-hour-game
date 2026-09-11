# 아트 비교 시트 사용 범위
모든 시트는 이번 실행에서 원본 파일을 읽어 만든 감사용 파생 이미지다. 원본 리터치/교체/재생성을 하지 않았다.

- 인물별 face/body 10장: 기준/현재 사용 이미지26개. 파일명, 역할, manifest 상태를 표시했다.
- backgrounds-1/2: assets/backgrounds의17개 배경/CG.
- remaining-1~7: 나머지52개 이미지(후보, 생성 중간본, 레거시, 유니폼, 아이콘, 필드보드).
- minseo-alpha-mattes: 현재 민서 PNG의 원래 알파를 밝은 회색/청회색에 그대로 합성. 가운 소실 확인용.

상태의 근거는 [ART_LOCK_COMPARISON.csv](../ART_LOCK_COMPARISON.csv)다.
시트의 integrated/approvedNotIntegrated/reviewCandidates는 assets/ASSET_MANIFEST.json의 분류다. **사용 여부는 최종 승인과 같지 않다.**
reference-approval-unverified는 해당 파일이 manifest 목록에서 확인되지 않았다는 뜻으로 사용했다. 옛 아트 문서에 확정 표기가 있어도 manifest와 별도로 CSV에 기록했다. 이번에 새로운 ART LOCK을 발행한 것이 아니다.
옛 아트 문서에 없는 신규 표정 버전은 파일명이 더 최신이라는 이유만으로 승인본으로 단정하지 않는다.

body 시트는 원본 프레임을 공통 셀 안에 맞췄다. 알파 여백과 원본의 인물 크기가 다르므로 화면상 키를 실제 키 비교로 해석하지 않는다.
face 시트는 관찰 후 정한 직사각형 crop이다. 눈 좌표 정렬이나 얼굴 변형/보정은 하지 않았다. 특히 얼굴 master와 흉상/전신의 head scale은 정밀 측정 기준이 아니다.
따라서 체형/키의 미세한 차이를 정량 판정하지 않고 복장, 얼굴 형태, 명암/선화, 표현 일관성을 정성 대조했다.
remaining 시트는 전수 썸네일 열람이며 픽셀 정밀 QA가 아니다. 사용 안 하는 후보를 현행 캐릭터 불일치로 합산하지 않는다.

