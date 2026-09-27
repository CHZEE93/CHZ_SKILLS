# Web Design Skill v1.0

## 1. Purpose

이 Skill은 웹 개발 시 일관된 디자인 품질을 유지하기 위한 기본 디자인 시스템이다.

대상:

- 개인 프로젝트 웹사이트
- SaaS / Web Application
- 서비스 소개 페이지
- Landing Page
- Dashboard
- Admin UI

목표는 화려한 디자인이 아니라 다음과 같은 인상을 만드는 것이다.

> **깔끔하고 밝으며, 실제 제품과 콘텐츠가 중심이 되는 현대적인 웹 디자인**

사용자가 페이지를 처음 보았을 때 가장 먼저 느껴야 할 인상은:

> **“깔끔하다.”**

디자인 의사결정 우선순위:

**Clarity > Consistency > Usability > Visual Polish > Decoration**

디자인 선택이 애매할 경우 장식을 추가하는 것보다 제거하는 쪽을 선택한다.

> **When in doubt, remove decoration rather than add it.**

---

# 2. Core Design Philosophy

## 2.1 Product First

웹사이트의 주인공은 디자인 자체가 아니라 콘텐츠와 제품이다.

다음을 우선한다.

1. 핵심 메시지
2. 제품 기능
3. 실제 Product UI
4. 사용자 행동
5. 시각적 장식

제품 UI가 존재한다면 추상적인 그래픽보다 실제 제품 화면을 우선적으로 보여준다.

---

## 2.2 Clean & Soft

전체적인 분위기는 다음을 지향한다.

- Clean
- Soft
- Bright
- Modern
- Product-first
- Professional
- Minimal

단, 지나치게 감성적이거나 장식적인 미니멀리즘은 피한다.

페이지를 보기 좋게 만들기 위해 콘텐츠 밀도를 과도하게 낮추지 않는다.

---

# 3. Information Density

기본 정보 밀도:

**Medium-Low**

하지만 콘텐츠 노출을 여백보다 우선한다.

즉:

```text
Good

Headline
Description
CTA

Product Screenshot

Feature
Feature
Feature
```

와 같은 구조를 선호한다.

다음과 같은 지나친 여백은 피한다.

```text
Headline



Description




CTA




Product
```

여백은 정보 계층을 만드는 데 사용하며, 디자인 자체를 과시하기 위해 사용하지 않는다.

---

# 4. Layout System

## Container

기본 Desktop 콘텐츠 최대 너비:

```css
max-width: 1200px;
```

권장:

```css
width: 100%;
max-width: 1200px;
margin-inline: auto;
padding-inline: 24px;
```

Large Desktop에서도 콘텐츠를 무조건 넓히지 않는다.

---

## Section Spacing

권장 기준:

```css
--section-sm: 64px;
--section-md: 80px;
--section-lg: 96px;
```

120px 이상의 과도한 section spacing을 반복적으로 사용하지 않는다.

Landing Page의 Hero 정도에서만 더 큰 spacing을 허용한다.

---

## Grid

기본적으로 명확한 Grid를 사용한다.

추천:

```text
Desktop: 12-column
Tablet: 8-column
Mobile: 4-column
```

기능 소개에서는 다음 구조를 우선한다.

```text
50 / 50
40 / 60
60 / 40
```

불필요하게 복잡한 비대칭 Grid는 사용하지 않는다.

---

# 5. Background

기본 배경:

```css
#FFFFFF
```

Section 구분이 필요한 경우:

```css
#FAFAFA
```

를 사용한다.

권장 패턴:

```text
White
White
Light Gray
White
White
Light Gray
```

모든 Section마다 서로 다른 배경색을 적용하지 않는다.

Primary Color를 Section 전체 Background로 남용하지 않는다.

---

# 6. Typography

## Font Family

기본:

```css
font-family:
  Pretendard,
  Inter,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

한글:

**Pretendard 우선**

영문 / 숫자:

**Inter 계열 표현 허용**

---

## Typography Style

Headline은 명확하고 강하게 표현한다.

얇고 감성적인 제목보다 굵고 명확한 제목을 선호한다.

### Desktop Scale

```text
Hero        56px / 700~800
H1          48px / 700
H2          36px / 700
H3          24px / 600~700

Body Large  18px / 400~500
Body        16px / 400
Small       14px / 400~500
Caption     12px / 400~500
```

Hero는 상황에 따라:

```text
48px ~ 64px
```

범위에서 조절할 수 있다.

---

## Line Height

```text
Headline: 1.15 ~ 1.3
Body:     1.5 ~ 1.7
```

---

## Typography Rules

금지:

- 지나치게 작은 Font
- 얇은 Font를 남용한 Premium 연출
- Hero 전체를 uppercase로 작성
- 의미 없이 자간을 크게 벌린 제목
- Gradient Text

---

# 7. Color System

프로젝트마다 Primary Color를 설정한다.

특정 Blue / Purple을 기본 브랜드 컬러로 강제하지 않는다.

```text
Project
   ↓
Brand Color 결정
   ↓
Primary Token 생성
```

---

## Neutral

권장 Neutral Palette:

```text
0     #FFFFFF
50    #FAFAFA
100   #F5F5F5
200   #E5E5E5
300   #D4D4D4
500   #737373
700   #404040
900   #171717
950   #0A0A0A
```

---

## Primary

Primary Color는 다음 용도로 사용한다.

- Primary Button
- Active State
- Link
- Selection
- 핵심 강조
- Brand Identity

사용하지 않는 용도:

- 페이지 전체 Background
- 모든 Icon
- 모든 Heading
- 모든 Border
- 모든 Card

> Primary Color는 브랜드를 표현하기 위해 사용하며 화면을 채우기 위해 사용하지 않는다.

---

## Semantic Colors

별도의 Semantic Token을 사용한다.

```text
Success
Warning
Error
Info
```

Brand Primary를 Error / Warning 등에 재사용하지 않는다.

---

# 8. Dark Mode

모든 프로젝트에서 Light / Dark Mode를 고려한다.

단, 모든 페이지에 Dark Mode Toggle을 반드시 노출해야 한다는 의미는 아니다.

디자인 시스템 자체는 반드시 Dark Mode 대응이 가능해야 한다.

색상은 직접 Hex 값을 반복 사용하지 않고 Semantic Token을 사용한다.

예:

```css
--background
--foreground

--surface
--surface-muted

--border

--primary
--primary-foreground

--muted
--muted-foreground
```

Dark Mode에서도 강한 검정/흰색 대비만 사용하는 것을 피한다.

---

# 9. Border Radius

기본 Radius:

```css
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-full: 9999px;
```

사용 기준:

```text
Button       8px
Input        8px
Select       8px
Card         8px
Dropdown     8px
Dialog       12px
Badge        Full
Avatar       Full
```

기본 Radius는 **8px**이다.

---

## Radius Rules

금지:

```text
rounded-xl
rounded-2xl
rounded-3xl
```

을 특별한 이유 없이 남발하는 것.

페이지 내에서 컴포넌트마다 서로 다른 Radius 체계를 사용하지 않는다.

---

# 10. Border & Shadow

Card와 UI 영역 구분에는 Shadow보다 Border를 우선한다.

기본:

```css
border: 1px solid var(--border);
```

Card:

```css
background: var(--surface);
border: 1px solid var(--border);
border-radius: 8px;
box-shadow: none;
```

---

## Shadow

기본적으로 Shadow를 사용하지 않는다.

필요한 경우:

- Dropdown
- Popover
- Dialog
- Floating element

같이 실제 elevation이 필요한 컴포넌트에서만 사용한다.

Shadow는 항상 약하게 표현한다.

---

# 11. Card Policy

매우 중요한 규칙:

> **Card is not a layout system.**

콘텐츠를 구분하기 위해 무조건 Card를 사용하지 않는다.

잘못된 패턴:

```text
CARD
CARD
CARD

CARD
CARD
CARD
```

Card는 다음 조건에서 사용한다.

- 개별 Object
- 반복되는 Entity
- 독립적인 정보 단위
- 클릭 가능한 Resource
- 명확한 Container가 필요한 UI

단순한 텍스트 Section은 Whitespace로 구분한다.

---

# 12. Navbar

기본 Navbar는 Sticky 방식이다.

권장 높이:

```text
64px ~ 72px
```

예:

```css
position: sticky;
top: 0;
z-index: 50;
```

필요한 경우 약한 Border를 사용한다.

```css
border-bottom: 1px solid var(--border);
```

강한 Shadow를 사용하지 않는다.

---

## Navigation Structure

Desktop:

```text
Logo

Navigation

Secondary Action
Primary CTA
```

Navigation Item 수를 과도하게 늘리지 않는다.

---

# 13. Hero

기본 Landing Hero Pattern:

```text
          Optional Badge

        Strong Headline

       Short Description

   Primary CTA   Secondary CTA


        Product Screenshot
```

중앙 정렬을 기본 Hero Pattern으로 사용한다.

---

## Hero Rules

Headline:

```text
1~3 lines
```

Description:

```text
1~3 lines
```

CTA:

```text
Primary 1개
Secondary 최대 1개
```

---

## Badge

Badge는 선택 사항이다.

다음과 같은 의미가 있을 때만 사용한다.

```text
New Feature
Beta
Release
Important Status
```

다음은 금지한다.

```text
✨ Introducing our amazing platform
```

같은 장식 목적 Badge.

---

# 14. Buttons

Button은 역할에 따라 크기를 나눈다.

```text
Small    40px
Default  44px
Large    48px
```

---

## Usage

Toolbar / Compact UI:

```text
40px
```

일반 UI:

```text
44px
```

Hero / Major CTA:

```text
48px
```

---

## Button Hierarchy

```text
Primary
Secondary
Ghost
Destructive
```

화면 하나에 Primary CTA가 지나치게 많아지지 않도록 한다.

---

# 15. Product Screenshot

Product UI가 존재하는 프로젝트라면 Hero와 Feature Section에서 적극적으로 활용한다.

우선순위:

```text
Actual Product UI
↓
Simplified Product Mockup
↓
Flat Illustration
↓
Abstract Graphic
```

Product Screenshot은 지나치게 기울이거나 3D Perspective 효과를 주지 않는다.

Screenshot 자체가 잘 보이는 것을 우선한다.

---

# 16. Illustration

Illustration이 필요한 경우:

**Flat Illustration**

을 우선한다.

사용 목적:

- 추상적인 기능 설명
- Empty State
- Onboarding
- Concept Visualization

금지:

- 의미 없는 AI Generated Illustration
- Generic 3D Character
- 과도한 3D Object
- 랜덤 Abstract Blob
- Stock Photo 남용

---

# 17. Icon

기본 Icon Library:

**Lucide Icons**

규칙:

```text
Default: 16~20px
Feature: 20~24px
```

Stroke width와 Icon 스타일을 통일한다.

Emoji를 UI Icon으로 사용하지 않는다.

잘못된 예:

```text
🚀 Launch
⚙️ Settings
💡 Tips
```

올바른 예:

```text
Rocket Icon
Settings Icon
Lightbulb Icon
```

---

# 18. Motion & Interaction

디자인 목적의 Animation은 기본적으로 사용하지 않는다.

금지:

- Scroll Reveal
- Parallax
- Floating
- Infinite Motion
- Background Animation
- Gradient Animation
- Decorative Motion

---

UI Feedback을 위한 최소 Transition만 허용한다.

```css
transition:
  color 150ms ease,
  background-color 150ms ease,
  border-color 150ms ease,
  opacity 150ms ease;
```

Animation은 장식이 아니라 상태 변화 전달을 위해 사용한다.

---

# 19. Responsive Design

Desktop을 중심으로 설계하되 Mobile UX도 동일하게 중요하게 취급한다.

단순 Scale Down 금지.

Desktop:

```text
[Text] [Product]
```

Mobile:

```text
[Text]

[Product]
```

처럼 정보 구조를 재배치한다.

---

## Recommended Breakpoints

Tailwind 기준:

```text
sm    640px
md    768px
lg    1024px
xl    1280px
2xl   1536px
```

1200px Container는 `xl` 이상에서도 유지한다.

---

# 20. Recommended Technology

기본 Stack:

```text
Next.js
React
TypeScript

Tailwind CSS

shadcn/ui

Lucide Icons

Pretendard
Inter
```

---

# 21. shadcn/ui Policy

shadcn/ui는 Component Primitive로 사용한다.

shadcn/ui 기본 디자인을 완성된 디자인 시스템으로 간주하지 않는다.

반드시 이 Skill의:

- Radius
- Typography
- Color
- Border
- Density
- Spacing

규칙에 맞게 수정한다.

목표는:

> **“shadcn으로 만든 사이트”처럼 보이지 않는 것**

이다.

---

# 22. Page Pattern — Landing Page

권장 구조:

```text
Navbar

Hero
Product Screenshot

Social Proof / Key Metric

Core Value Proposition

Feature Section

Feature Section

Use Case / Workflow

Final CTA

Footer
```

모든 Section을 반드시 사용할 필요는 없다.

콘텐츠가 없는 Section을 디자인 채우기 목적으로 추가하지 않는다.

---

# 23. Page Pattern — Web Application

기본:

```text
App Shell

Navigation
Main Content
Contextual Actions
```

Application에서는 Landing Page보다 정보 밀도를 높일 수 있다.

기능 접근성이 Visual Decoration보다 우선한다.

---

# 24. Page Pattern — Dashboard / Admin

Dashboard에서는 Medium Density까지 허용한다.

다음 요소 사용 가능:

```text
Sidebar
Table
Tabs
Filter
Search
Pagination
Toolbar
Status Badge
Chart
Metric
```

하지만 모든 데이터를 Card 안에 넣는 방식은 피한다.

---

# 25. Anti-Pattern Rules

다음 패턴을 기본적으로 사용하지 않는다.

## Gradient

금지:

- Purple → Blue Gradient
- Background Gradient
- Gradient Button
- Gradient Text

브랜드상 반드시 필요한 경우에만 제한적으로 사용한다.

---

## Excessive Color

한 화면에서 여러 Accent Color를 경쟁시키지 않는다.

---

## Excessive Card

페이지 전체를 Card Grid로 만들지 않는다.

---

## Excessive Radius

모든 요소를 둥글게 만들지 않는다.

---

## Excessive Shadow

Card마다 Shadow를 사용하지 않는다.

---

## AI Startup Style

다음과 같은 전형적인 AI 생성 Landing Page 스타일을 피한다.

```text
Purple Gradient

Sparkle Icon

"Supercharge your workflow"

Huge Rounded Cards

Gradient Text

Floating Glass Panels

Random Dashboard Mockup

Animated Background Glow
```

---

# 26. Forbidden Patterns

기본적으로 다음을 피한다.

- 과도한 Gradient
- 강한 Shadow
- 많은 Accent Color
- 일관되지 않은 Border Radius
- Card 남발
- Emoji Icon
- Purple AI Gradient
- 지나친 Animation
- Glassmorphism
- 의미 없는 Badge
- 의미 없는 Decorative Illustration
- 지나치게 작은 Font
- 필요 이상의 Section
- 불필요하게 큰 Whitespace

---

# 27. AI Agent Design Process

웹페이지를 구현하기 전에 다음 순서로 판단한다.

## STEP 1 — Product Type

먼저 페이지 유형을 판단한다.

```text
Landing
Marketing
SaaS
Web App
Dashboard
Admin
Portfolio
```

---

## STEP 2 — User Goal

사용자가 페이지에서 가장 먼저 해야 하는 행동을 정의한다.

예:

```text
서비스 이해
회원가입
로그인
기능 탐색
데이터 확인
작업 실행
```

---

## STEP 3 — Information Architecture

디자인 전에 콘텐츠 순서를 결정한다.

```text
Primary
Secondary
Supporting
Optional
```

---

## STEP 4 — Layout

1200px Container와 Grid를 기준으로 레이아웃을 구성한다.

Card를 먼저 만들지 않는다.

---

## STEP 5 — Typography

정보 중요도에 따라 Typography Hierarchy를 만든다.

---

## STEP 6 — Components

필요한 UI Component만 추가한다.

---

## STEP 7 — Decoration

마지막 단계에서만 장식을 검토한다.

장식이 없어도 충분하다면 추가하지 않는다.

---

# 28. AI Agent Decision Rules

디자인 선택지가 여러 개라면 다음 규칙을 따른다.

### Rule 1

Simple > Decorative

### Rule 2

Content > Empty Space

### Rule 3

Whitespace > Card

### Rule 4

Border > Shadow

### Rule 5

Actual Product UI > Illustration

### Rule 6

Flat Illustration > 3D Illustration

### Rule 7

Consistent Radius > Various Radius

### Rule 8

Semantic Color > Random Color

### Rule 9

Static > Decorative Animation

### Rule 10

Clear Typography > Stylish Typography

---

# 29. Final Quality Checklist

완성 후 반드시 확인한다.

## Layout

- 콘텐츠 최대 너비가 일관적인가?
- 정보가 너무 넓게 퍼지지 않았는가?
- 불필요한 여백이 없는가?
- Section 구분이 명확한가?

## Typography

- 제목 계층이 명확한가?
- Body Font가 너무 작지 않은가?
- 제목이 지나치게 얇지 않은가?

## Color

- Primary Color가 남용되지 않았는가?
- Accent Color가 경쟁하지 않는가?
- Dark Mode를 고려했는가?

## Components

- Radius가 일관적인가?
- Card가 과도하지 않은가?
- Shadow가 필요한 곳에서만 사용됐는가?

## Content

- 사용자가 첫 화면에서 서비스 목적을 이해할 수 있는가?
- 주요 CTA가 명확한가?
- 실제 Product UI를 활용할 수 있는데 Illustration으로 대체하지 않았는가?

## AI Design Smell

아래 중 하나라도 강하게 느껴지면 다시 수정한다.

- AI가 만든 SaaS Landing Page 같다.
- 모든 것이 Card다.
- 모든 것이 둥글다.
- Purple Gradient가 많다.
- Sparkle Icon이 많다.
- 의미 없는 Animation이 있다.
- 콘텐츠보다 장식이 먼저 보인다.

---

# 30. Final Principle

이 Skill의 디자인 목표는 사용자를 놀라게 하는 것이 아니다.

사용자가 디자인을 의식하기 전에 콘텐츠와 기능을 이해하게 만드는 것이 목표다.

최종적으로 페이지를 본 사용자가 느껴야 하는 인상은 하나다.

> **“깔끔하다.”**
