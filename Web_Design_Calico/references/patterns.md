# Calico 패턴

시그니처 컴포넌트의 마크업과 화면 레시피. 클래스는 [../assets/calico.css](../assets/calico.css)를 전제로 한다.

---

## 1. 코트 마크 + 코트 스트립 (내비게이션)

```html
<div class="c-coat-strip" aria-hidden="true"></div>
<header class="topbar">
  <a class="brand" href="/">
    <span class="c-coat-mark" aria-hidden="true"><i></i><i></i><i></i></span>
    calico
  </a>
  <nav class="c-tabs" aria-label="주요 메뉴">…<span class="c-tail" aria-hidden="true"></span></nav>
  <a class="c-btn c-btn--primary" href="/start">시작하기</a>
</header>
```

- 코트 스트립은 페이지 맨 위 한 번. 섹션마다 반복하면 무늬가 아니라 장식선이 된다.
- 코트 마크 색 순서(주황→차콜→크림)는 바꾸지 않는다. 로고가 없는 프로젝트라도 이 마크가 정체성을 대신한다.

## 2. 대표 패치 + 패치 태그 (맞닿음)

```html
<section class="c-patch" aria-labelledby="patch-title">
  <span class="c-patch-tag">NEW · 2.0</span>
  <h2 id="patch-title">팀의 이번 주 작업이 <span class="c-accent">한 화면에</span></h2>
  <p>진행 중 8 · 마감 임박 2 · 완료 16</p>
  <img src="product.png" alt="프로젝트 보드 화면">
  <a class="c-btn c-btn--primary" href="#">보드 열기</a>
  <a class="c-btn c-btn--secondary" href="#">둘러보기</a>
</section>
```

- 패치 태그는 `top:0; transform:translateY(-50%)`로 패치 윗변에 걸친다. 패치에 `overflow:hidden`을 주지 않는다.
- 패치 안 강조 단어는 `.c-accent`(차콜 위 주황 6.3:1) 1개.
- 같은 화면에 두 번째 패치가 필요하면 `.c-patch--alt`(반대쪽 모서리)나 `.c-patch--cream`을 써서 대칭을 피한다.

## 3. 주황 지표 패치 (대시보드)

```html
<div class="metrics">
  <article class="c-patch c-patch--ginger">
    <small>이번 주 마감</small><strong>2건</strong><p>오늘 1건 · 금요일 1건</p>
  </article>
  <article class="c-card"><small>진행 중</small><strong>8</strong></article>
  <article class="c-card"><small>완료</small><strong>16</strong></article>
</div>
```

- 주황 면은 **행동이 필요한 지표 하나**에만. 다른 지표는 흰 털.
- 주황 면 위 글자는 먹색(`#1E1B19`/`#2B2724`).

## 4. 꼬리 탭

```html
<div class="c-tabs" role="tablist" aria-label="상태">
  <button role="tab" aria-selected="true">전체</button>
  <button role="tab" aria-selected="false">진행 중</button>
  <button role="tab" aria-selected="false">완료</button>
  <span class="c-tail" aria-hidden="true"></span>
</div>
```

```js
function moveTail(tabs) {
  const active = tabs.querySelector('[aria-selected="true"]');
  const tail = tabs.querySelector('.c-tail');
  tail.style.width = active.offsetWidth + 'px';
  tail.style.transform = `translateX(${active.offsetLeft}px)`;
}
```

- 꼬리는 사라졌다 나타나지 않고 **새 자리로 걸어간다**(`--c-stalk`).
- 세로 내비는 `.c-nav a[aria-current]`가 왼쪽 2px 꼬리를 그린다.

## 5. 귀 쫑긋 카드

```html
<article class="c-card c-card--ears">
  <span class="c-badge">디자인</span>
  <h3><a href="/post/1">좋은 인터페이스는 설명을 줄여줍니다</a></h3>
  <p>…</p>
  <footer>Calico 에디토리얼 · <span class="c-bean" aria-hidden="true"></span> 24</footer>
</article>
```

- hover/focus 때 윗선 2px만 주황(`inset box-shadow`). `translateY`·그림자 상승 금지.
- 젤리 점은 '좋아요/저장 수' 옆에만.

## 6. 골골 토스트

```html
<div class="c-toast" role="status" aria-live="polite">
  프로젝트를 보관함으로 옮겼어요. <button type="button">되돌리기</button>
</div>
```

- `is-visible` 클래스로 3초 표시. 되돌리기 버튼이 있으면 5초.
- 한 문장, 과거형, 대상 이름 포함. 이모지 없음.

## 7. 조용한 빈 상태

```html
<div class="c-empty">
  <span class="c-coat-mark" aria-hidden="true"><i></i><i></i><i></i></span>
  <h3>아직 프로젝트가 없어요</h3>
  <p>첫 프로젝트를 만들면 이곳에 진행 상황이 모입니다.</p>
  <button class="c-btn c-btn--primary">프로젝트 만들기</button>
</div>
```

- 일러스트를 넣지 않는다. 코트 마크 하나가 브랜드 신호를 대신한다(레벨 0이면 마크도 뺀다).
- 문장은 상황 한 줄 + 다음 행동 버튼 1개.

## 8. 하악 오류 (폼)

```html
<label for="email">담당자 이메일 <span aria-hidden="true">*</span></label>
<input id="email" class="c-input" type="email" aria-invalid="true" aria-describedby="email-err">
<small id="email-err" style="color:var(--c-danger)">이메일 형식이 아니에요. name@company.com처럼 입력해 주세요.</small>
```

- 원인 + 고칠 방법, 한 문장. 빨강만 쓰고 주황은 쓰지 않는다.
- 제출 시 첫 오류 필드로 포커스 이동.

---

## 화면 레시피

### A. 랜딩 (레벨 1–2)

```text
[코트 스트립]
[내비: 코트 마크 · 꼬리 탭 · 주 CTA]
[히어로: Eyebrow · 제목(강조 단어 1개 주황) · 설명 · CTA 2개]  ← 흰 털
[대표 차콜 패치 + 패치 태그: 실제 제품 화면]                  ← 맞닿음 1회
[기능 50/50 × 2–3: 텍스트 ↔ 화면 교차, 카드 없이 수염선]       ← 흰 털
[사례/지표: 크림 패치 1개]
[차콜 푸터: 마지막 CTA + 링크]                                 ← 두 번째 차콜 면
```

### B. SaaS 앱 셸 (레벨 1)

```text
[차콜 사이드바 240: 코트 마크 · .c-nav(왼쪽 꼬리) · 하단 계정]
[본문 흰 털: 페이지 제목 · 꼬리 탭 · 툴바 · 표(수염선)]
```

사이드바가 차콜 면이므로 본문에는 차콜 패치를 더하지 않는다(상한 2 중 토스트 몫 남김).

### C. 대시보드 (레벨 0–1)

```text
[제목 · 기간 필터]
[지표 행: 주황 지표 패치 1 + 흰 지표 2–3]
[표: 상태 배지(크림/주황 soft) · 진행 바(트랙 cream-strong, 값 ginger)]
[빈 결과: 코트 마크 + 문장(레벨 1) / 문장만(레벨 0)]
```

### D. 아티클 (레벨 1)

```text
[카테고리(주황 글자) · 제목 · 요약 · 바이라인(크림 아바타, 저장 + 젤리 점)]
[본문 760px, 17px/1.85]
[인용문: 왼쪽 3px 주황 꼬리 + belly 바탕]
[코드 블록: 차콜 패치(--c-patch-ink) + 크림 글자]
[이어서 읽기: 수염선 목록]
```

### E. 404 (레벨 2)

```text
[코트 마크]
[길을 잃었어요. 이 페이지는 낮잠 중이에요.]   ← 레벨 2에서만 허용되는 말장난 1회
[홈으로] 
```
