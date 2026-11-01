# 영상 근거

2026-11-01에 ego lite 브라우저로 [닥터팔레트 매뉴얼](https://dr.pltt.cloud/manual) 페이지를 열어 라이트박스 링크에서 YouTube 영상 11편을 수집했다. 각 영상을 1080p로 재생하고 0.5초부터 3초 간격으로 `<video>` 프레임을 캔버스로 복사해 총 530장을 얻었다. 2×2 컨택트 시트 136장으로 전 구간을 훑은 뒤, 화면마다 원본 해상도 프레임을 확대해 라벨·열 순서·색을 읽었다. 프레임 파일은 저장소에 포함하지 않았다. 아래 링크의 `t=`로 같은 장면을 열 수 있다.

| # | 영상 | 길이 | 앱 버전 | 보여 주는 것 | 대표 장면 |
|---|---|---|---|---|---|
| 0 | [새로워진 닥터팔레트를 소개합니다](https://www.youtube.com/watch?v=Jfi246Juez8) | 2:12 | 2023 | 웹 로그인, 홈, 모바일 사진 업로드, 역할별(진료실/원무과) 가운데 열 교체, 태블릿 접수, 환자 앱, 월간 리포트, 통계 위젯 | [0:52 진료기록 카드](https://www.youtube.com/watch?v=Jfi246Juez8&t=52s) · [0:58 원무과 구성](https://www.youtube.com/watch?v=Jfi246Juez8&t=58s) · [1:49 위젯 그리드](https://www.youtube.com/watch?v=Jfi246Juez8&t=109s) |
| 1 | [1.Manual 접수](https://www.youtube.com/watch?v=PrtRnLLTnOM) | 1:57 | v2.4.0 | 로그인 → 홈 → 빈 차트 대시보드 → 신규환자등록(자격조회·가족·약관) → `등록 후 접수` → 외래 접수 → 구환 검색·우클릭 접수 | [0:25 빈 작업면](https://www.youtube.com/watch?v=PrtRnLLTnOM&t=25s) · [0:40 자격조회](https://www.youtube.com/watch?v=PrtRnLLTnOM&t=40s) · [1:43 맥락 패널 접수](https://www.youtube.com/watch?v=PrtRnLLTnOM&t=103s) |
| 2 | [2.Manual 차트](https://www.youtube.com/watch?v=WKeU2Z4ebLU) | 3:01 | v2.4.0 | 장소 이동 메뉴·토스트, 우선대기, 헤더 요약 바(정보·접수·바이탈·가족), 차트구성, 환자기록 메신저·공지·북마크, 검사결과 | [0:16 보내기 메뉴](https://www.youtube.com/watch?v=WKeU2Z4ebLU&t=16s) · [1:31 차트구성](https://www.youtube.com/watch?v=WKeU2Z4ebLU&t=91s) · [2:04 @멘션](https://www.youtube.com/watch?v=WKeU2Z4ebLU&t=124s) |
| 3 | [3.Manual 진료](https://www.youtube.com/watch?v=7B7kH7m03RA) | 1:06 | v2.4.0 | 진료기록 작성, 이미지 드래그 업로드, 전체 이미지 | [0:16 차트 전체](https://www.youtube.com/watch?v=7B7kH7m03RA&t=16s) |
| 4 | [4.Manual 진단 및 처방](https://www.youtube.com/watch?v=bX437bPd6pk) | 1:09 | v2.4.0 | 통합 오더 검색, 섹션 고정 처방 리스트, 인라인 수량, 오더세트 모두복사, 보내기 + 되돌리기 토스트 | [0:10 그룹 검색](https://www.youtube.com/watch?v=bX437bPd6pk&t=10s) · [0:34 처방 리스트](https://www.youtube.com/watch?v=bX437bPd6pk&t=34s) |
| 5 | [5.Manual 문서발급](https://www.youtube.com/watch?v=Jn_sfEzZ7hg) | 1:16 | v2.4.0 | 수납실 도착 깜빡임, 차트구성, 수납 추가(조건부 필드), 문서 미리보기·발급, 브라우저 인쇄, `병원에서 내보내기` | [0:22 수납내역](https://www.youtube.com/watch?v=Jn_sfEzZ7hg&t=22s) · [0:31 현금 결제](https://www.youtube.com/watch?v=Jn_sfEzZ7hg&t=31s) · [1:01 드롭업](https://www.youtube.com/watch?v=Jn_sfEzZ7hg&t=61s) |
| 6 | [6.Manual 통계](https://www.youtube.com/watch?v=krSw2ooCF1c) | 2:32 | v2.4.x | 매출·수납 요약 카드, 기간 선택, 엑셀 내보내기, 미수 요약→테이블→미리보기→차트, 수가·약가·치료재료대 테이블 | [0:22 매출 통계](https://www.youtube.com/watch?v=krSw2ooCF1c&t=22s) · [1:13 미수 내역](https://www.youtube.com/watch?v=krSw2ooCF1c&t=73s) · [1:43 수가 테이블](https://www.youtube.com/watch?v=krSw2ooCF1c&t=103s) |
| 7 | [인사이트](https://www.youtube.com/watch?v=WNIjUaqvL-I) | 0:41 | BETA | 월간 경영 리포트(KPI·형광펜 서술), 3열 차트 대시보드 | [0:16 KPI](https://www.youtube.com/watch?v=WNIjUaqvL-I&t=16s) · [0:22 대시보드](https://www.youtube.com/watch?v=WNIjUaqvL-I&t=22s) |
| 8 | [7.Manual 예약 & CRM](https://www.youtube.com/watch?v=jHWTogR7JSc) | 5:34 | v2.4.1 | 스케줄 설정 모달, 월간 달력 예외, 예약 타임그리드, 환자 검색→신환 예약, 정원 경고, 예약취소, 알림 규칙, 발송내역 | [0:28 스케줄 설정](https://www.youtube.com/watch?v=jHWTogR7JSc&t=28s) · [2:37 타임그리드](https://www.youtube.com/watch?v=jHWTogR7JSc&t=157s) · [4:10 알림 규칙](https://www.youtube.com/watch?v=jHWTogR7JSc&t=250s) · [5:25 발송내역](https://www.youtube.com/watch?v=jHWTogR7JSc&t=325s) |
| 9 | [8.Manual 라이브러리](https://www.youtube.com/watch?v=0z9cgDYJXLE) | 4:48 | v2.4.x | 처방아이템 탭·생성(검색해서 채우기), 오더세트 트리·편집기·드래그 정렬, 단축어, 차트에서 3가지 삽입 경로 | [1:28 생성 모달](https://www.youtube.com/watch?v=0z9cgDYJXLE&t=88s) · [3:13 오더세트 편집기](https://www.youtube.com/watch?v=0z9cgDYJXLE&t=193s) · [4:34 검색 탭](https://www.youtube.com/watch?v=0z9cgDYJXLE&t=274s) |
| 10 | [9.Manual 청구](https://www.youtube.com/watch?v=335HY52YPGA) | 2:05 | v2.6.5 | 심사점검모드 인라인 칩·점검 모달, 원청구서 생성, 오류 배지·명세서 배너·차트열기, 제외, 발급→내려받기 | [0:34 인정상병점검](https://www.youtube.com/watch?v=335HY52YPGA&t=34s) · [1:07 원청구서](https://www.youtube.com/watch?v=335HY52YPGA&t=67s) · [1:22 명세서 오류](https://www.youtube.com/watch?v=335HY52YPGA&t=82s) |

## 해석 시 주의

- 영상은 편집 과정에서 패널을 확대·하이라이트하거나 카드가 튀어나오는 연출을 넣었다. 확대 오버레이(진료기록 카드, 처방 패널, 인사이트 카드 팝아웃)가 실제 UI 동작인지는 확정할 수 없어서 규칙에서는 제외했다.
- 녹화 배율이 영상마다 다르다(약 0.7–0.9배). px 값은 비율로 읽고, 권장 CSS 크기는 tokens.md를 따른다.
- 청구 영상(v2.6.5)은 다른 매뉴얼(v2.4.x)보다 새 빌드다. 사이드바에 `건강검진`·`전자서명`이 추가되었고, 차트 하단 바에 `진료 완료` 버튼과 페이지네이션이 있다.
- 다음 동작은 영상에서 확인되지 않았다: 예약 드래그 이동·크기 조절, CRM 수동 대량 발송, 라이브러리의 `차트 템플릿`·`자주 쓰는 문구` 화면, 인사이트 툴팁.
