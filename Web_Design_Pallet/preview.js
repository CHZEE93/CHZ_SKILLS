// Pallet preview — fictional clinic data, in-memory only.
"use strict";

const $ = (s, r = document) => r.querySelector(s);
const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const won = (n) => `${Math.round(n).toLocaleString("ko-KR")}원`;

const groups = [
  { id: "r1", name: "진료실01", doc: "이", av: "blue" },
  { id: "r2", name: "진료실02", doc: "현", av: "pink" },
  { id: "xray", name: "방사선실" },
  { id: "pay", name: "수납실" },
  { id: "tab", name: "태블릿접수" },
];

const catalog = [
  { kind: "dx", code: "J00", name: "급성 비인두염(감기)" },
  { kind: "dx", code: "S9340", name: "발목의 염좌" },
  { kind: "dx", code: "M2556", name: "무릎의 관절통" },
  { kind: "dx", code: "L209", name: "상세불명의 아토피피부염" },
  { kind: "rx", code: "643308800", name: "가상정 500mg", price: 30 },
  { kind: "rx", code: "693900040", name: "가상캡슐 250mg", price: 120 },
  { kind: "rx", code: "641100150", name: "가상연고 1%", price: 2400, out: true },
  { kind: "exam", code: "G6605", name: "발목 X-ray 2매", price: 10920 },
  { kind: "exam", code: "B2570", name: "일반혈액검사", price: 3200 },
  { kind: "fee2", code: "MM015", name: "체외충격파치료", price: 50000, nonpay: true },
];
const kindLabel = { dx: "상병", rx: "처방아이템", exam: "검사아이템", fee2: "처치" };
const kindIcon = { dx: "✚", fee: "◇", rx: "💊", exam: "📷", fee2: "◇", doc: "📄" };

const sets = [
  { id: "s1", folder: "정형외과", name: "발목 염좌 기본", items: ["S9340", "G6605", "643308800"] },
  { id: "s2", folder: "정형외과", name: "무릎 통증", items: ["M2556", "MM015", "693900040"] },
  { id: "s3", folder: "피부과", name: "아토피 초진", items: ["L209", "641100150", "B2570"] },
];

let patients = [
  { id: 113912, name: "김하늘", sex: "여", age: 31, purpose: "일반진료", group: "r1", status: "doing", ins: "건강보험", orders: [], pays: [], note: "", msgs: [{ who: "은솔", at: "09:12", text: "보호자 동행 원함" }], visits: [["2026-10-18", "이도윤", "목 통증, 근이완제 5일"]] },
  { id: 116604, name: "박서준", sex: "남", age: 23, purpose: "일반진료", group: "r1", status: "priority", ins: "건강보험", orders: [], pays: [], note: "", msgs: [], visits: [] , isNew: true },
  { id: 108833, name: "이도담", sex: "여", age: 37, purpose: "검사", group: "xray", status: "wait", ins: "건강보험", orders: [{ code: "S9340", q: [1, 1, 1] }], pays: [], note: "우측 발목 내번 손상", msgs: [], visits: [["2026-09-02", "한지수", "발목 염좌, 고정 2주"]] },
  { id: 120145, name: "최유진", sex: "여", age: 16, purpose: "레이저치료", group: "r2", status: "wait", ins: "건강보험", orders: [], pays: [], note: "", msgs: [], visits: [] },
  { id: 104420, name: "정민호", sex: "남", age: 52, purpose: "일반진료", group: "pay", status: "wait", ins: "건강보험", orders: [{ code: "J00", q: [1, 1, 1] }, { code: "643308800", q: [1, 3, 3] }], pays: [], note: "인후통 3일", msgs: [], visits: [["2026-06-11", "이도윤", "고혈압 정기"]] },
];
let selected = null;
let listTab = "wait";
let chartCards = { note: true, orders: true, pay: true };
let activeSet = "s1";
let view = "chart";

/* ---------- shared layers ---------- */
let toastTimer;
function toast(text, undo) {
  const t = $("#toast");
  $("#toastText").textContent = text;
  t.querySelector("button")?.remove();
  if (undo) {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = "되돌리기";
    b.onclick = () => { undo(); t.hidden = true; };
    t.append(b);
  }
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.hidden = true), 3600);
}

const pop = $("#pop");
function openPop(anchor, html, onClick, keepFocus = false) {
  pop.innerHTML = html;
  pop.hidden = false;
  const r = anchor.getBoundingClientRect();
  pop.style.minWidth = `${Math.max(180, Math.min(r.width, 560))}px`;
  const w = pop.offsetWidth, h = pop.offsetHeight;
  pop.style.left = `${Math.min(r.left, innerWidth - w - 8)}px`;
  pop.style.top = `${r.bottom + h + 8 > innerHeight ? Math.max(8, r.top - h - 4) : r.bottom + 4}px`;
  pop.onclick = (e) => { const b = e.target.closest("[data-act]"); if (b) onClick(b.dataset); };
  if (!keepFocus) pop.querySelector("button")?.focus({ preventScroll: true });
}
function closePop() { pop.hidden = true; }
document.addEventListener("pointerdown", (e) => { if (!pop.hidden && !pop.contains(e.target) && !e.target.closest("[data-pop-anchor]")) closePop(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closePop(); closeModal(); } });

const overlay = $("#overlay"), modal = $("#modal");
let lastFocus;
function openModal(html, cls = "") {
  lastFocus = document.activeElement;
  modal.className = `p-modal ${cls}`;
  modal.innerHTML = html;
  overlay.hidden = false;
  (modal.querySelector("input, select, textarea") || modal.querySelector("button"))?.focus();
}
function closeModal() { if (overlay.hidden) return; overlay.hidden = true; lastFocus?.focus?.(); }
overlay.addEventListener("pointerdown", (e) => { if (e.target === overlay) closeModal(); });

const modalHead = (title) => `<div class="p-modal-h"><h2 id="modalTitle">${title}</h2><button class="p-btn ghost icon" type="button" data-close aria-label="닫기">✕</button></div>`;
modal.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeModal(); });

function confirmBox({ title, body, reason, ok = "확인" }, onOk) {
  openModal(`${modalHead("")}<div class="p-modal-b"><div style="color:var(--p-danger);font-size:20px">⚠</div><b>${esc(title)}</b><span class="p-hint">${esc(body)}</span>
    ${reason ? `<input class="p-input" id="cfReason" placeholder="${esc(reason)}">` : ""}</div>
    <div class="p-modal-f"><span class="p-spacer"></span><button class="p-btn ghost" data-close type="button">취소</button><button class="p-btn strong" id="cfOk" type="button">${esc(ok)}</button></div>`, "confirm");
  $("#cfOk").onclick = () => { const r = $("#cfReason")?.value || ""; closeModal(); onOk(r); };
}

/* ---------- money ---------- */
const item = (code) => catalog.find((c) => c.code === code);
function bill(p) {
  let pay = 0, non = 0;
  if (p.orders.length) pay += 12000; // 진찰료 자동 산정
  for (const o of p.orders) {
    const c = item(o.code); if (!c || c.kind === "dx") continue;
    const amt = (c.price || 0) * (c.kind === "rx" ? o.q[0] * o.q[1] * o.q[2] : o.q[0]);
    c.nonpay ? (non += amt) : (pay += amt);
  }
  const self = Math.round((pay * 0.3) / 100) * 100;
  const paid = p.pays.reduce((s, x) => s + x.amt, 0);
  return { total: pay + non, self, gov: pay - self, non, due: self + non, paid, left: self + non - paid };
}

/* ---------- views ---------- */
function setView(v) {
  view = v;
  document.querySelectorAll(".p-nav a").forEach((a) => (a.dataset.view === v ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));
  $("#title").textContent = { chart: "차트", res: "예약", stat: "통계", claim: "청구" }[v];
  closePop();
  render();
}
document.querySelectorAll(".p-nav a").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); setView(a.dataset.view); }));
function render() { ({ chart: renderChart, res: renderRes, stat: renderStat, claim: renderClaim })[view](); }

/* ===== 차트 ===== */
function stWord(s) { return { wait: '<span class="p-st wait">대기</span>', doing: '<span class="p-st doing">진행중</span>', priority: '<span class="p-st priority">우선대기</span>' }[s] || ""; }

function listHTML() {
  const waiting = patients.filter((p) => p.group);
  return `<aside class="p-list" aria-label="환자리스트">
    <div class="p-col-h">환자리스트</div>
    <div class="p-list-tabs" role="tablist"><button role="tab" aria-selected="true">대기 ${waiting.length}</button><button role="tab" aria-selected="false" disabled>예약 ${resBookings.filter((b) => !b.cancel).length}</button></div>
    <div class="p-list-scroll">${groups.map((g) => {
      const rows = waiting.filter((p) => p.group === g.id).sort((a, b) => (b.status === "priority") - (a.status === "priority"));
      return `<section class="p-group" data-group="${g.id}"><div class="p-group-h">${g.doc ? `<span class="p-avatar sm ${g.av}">${g.doc}</span>` : ""}<span>${g.name}</span><span class="p-spacer"></span><span class="n">${rows.length}</span></div>
        ${rows.length ? rows.map((p) => `<button class="p-row2" type="button" data-pid="${p.id}" aria-selected="${p.id === selected}" data-pop-anchor>
          <span class="l1"><span class="name ${p.isNew ? "p-new" : ""}">${esc(p.name)}</span>${stWord(p.status)}</span>
          <span class="l2">${p.sex} ${p.age}세 ✚ ${esc(p.purpose)}</span></button>`).join("") : `<div class="p-empty-row">대기 환자가 없습니다.</div>`}</section>`;
    }).join("")}</div></aside>`;
}

function dashHTML() {
  const next = patients.find((p) => p.group === "r1" && p.status !== "doing") || patients.find((p) => p.group);
  return `<div class="dash">
    ${next ? `<div class="p-card hero"><div style="display:flex;gap:10px;align-items:center"><span class="p-chip info">진료실01</span><span class="p-hint">다음 환자</span></div>
      <div style="display:flex;gap:8px;align-items:baseline"><b style="font-size:20px">${esc(next.name)}</b><span class="p-hint">${next.sex}, ${next.age}세</span></div>
      <div style="display:flex;gap:4px"><span class="p-chip info">${next.ins}</span><span class="p-chip line">${esc(next.purpose)}</span></div>
      <div style="display:flex;gap:8px;justify-content:flex-end"><button class="p-btn" type="button" data-open="${next.id}">차트열기</button><button class="p-btn primary" type="button" data-start="${next.id}">진행하기</button></div></div>` : ""}
    <div class="duo"><div class="p-card"><b>신규환자</b><span class="p-hint">신규환자를 등록하시겠습니까?</span><button class="p-btn tint" type="button" data-newpt style="justify-self:end">신규환자</button></div>
      <div class="p-card"><b>접수신청 (${patients.filter((p) => p.group === "tab").length})</b><span class="p-hint">${patients.some((p) => p.group === "tab") ? "태블릿 접수를 확인하세요." : "접수 신청 건이 없습니다."}</span></div></div></div>`;
}

function orderRow(o, i) {
  const c = item(o.code); if (!c) return "";
  const q = c.kind === "rx" ? o.q.map((v, k) => `<input class="p-qty" inputmode="numeric" value="${v}" data-q="${i}:${k}" aria-label="${["용량", "일투", "일수"][k]}">`).join("") : c.kind === "dx" ? "" : `<input class="p-qty" value="${o.q[0]}" data-q="${i}:0" aria-label="횟수">`;
  const tag = c.kind === "dx" && i === firstDx(selectedP()) ? '<span class="p-tag-main">주</span>' : c.nonpay ? '<span class="p-tag-red">비급여</span>' : c.kind === "rx" && !c.out ? '<span class="p-tag-violet">원내</span>' : "";
  return `<div class="p-order"><span class="ic">${kindIcon[c.kind]}</span><span class="nm"><span class="code">${c.code}</span>${esc(c.name)}</span>${tag}<span class="qty">${q}<button class="p-btn ghost icon" style="height:26px;width:26px" type="button" data-del="${i}" aria-label="${esc(c.name)} 삭제">✕</button></span></div>`;
}
const selectedP = () => patients.find((p) => p.id === selected);
const firstDx = (p) => p.orders.findIndex((o) => item(o.code)?.kind === "dx");

function chartHTML(p) {
  const b = bill(p);
  const order = ["dx", "fee2", "rx", "exam"];
  const idx = p.orders.map((o, i) => [o, i]).sort((x, y) => order.indexOf(item(x[0].code).kind) - order.indexOf(item(y[0].code).kind));
  const hasDx = firstDx(p) >= 0, hasRx = p.orders.some((o) => item(o.code)?.kind === "rx");
  const set = sets.find((s) => s.id === activeSet);
  const here = groups.find((g) => g.id === p.group);
  return `<section class="work" aria-label="${esc(p.name)} 차트">
    <div class="p-summary">
      <button class="p-sum-item" type="button" data-sum="info">👤 ${p.id} <b>${esc(p.name)}</b> <span class="p-hint">${p.sex}, ${p.age}세</span></button>
      <span style="display:flex;gap:4px"><span class="p-chip info">${p.ins}</span><span class="p-chip line">${esc(p.purpose)}</span></span>
      <button class="p-sum-item" type="button" data-sum="vital">🌡 체온 36.6 체중 61 <span class="p-hint">(오늘)</span></button>
      <span class="p-spacer"></span><button class="p-btn ghost" type="button" data-closechart>✕ 닫기</button>
    </div>
    <div class="work-cols">
      <div class="p-col"><div class="p-col-h">내원이력<span class="p-spacer"></span><span class="p-hint">${p.visits.length + 1}건</span></div>
        <div class="p-col-b"><div class="visit"><span class="d">오늘</span><div class="chips"><span class="p-chip line">${esc(p.purpose)}</span><span class="p-chip info">${p.ins}</span></div><p>${esc(p.note || "작성 중")}</p></div>
        ${p.visits.map((v) => `<div class="visit"><span class="d old">${v[0]} · ${esc(v[1])}</span><p>${esc(v[2])}</p></div>`).join("") || '<span class="p-hint">이전 내원이력이 없습니다.</span>'}</div></div>

      <div class="p-col main"><div class="p-col-h">✍ 오늘 · 🩺 ${here?.doc ? esc(here.name) : "담당의 미지정"}<span class="p-spacer"></span><button class="p-btn ghost icon" type="button" id="cfgBtn" data-pop-anchor aria-label="화면 구성">⣿</button></div>
        <div class="p-col-b">
          ${chartCards.note ? `<section class="p-card"><div class="p-card-h"><h3>진료기록</h3></div><div style="padding:0 14px 12px"><textarea class="note" id="note" placeholder="증상, 소견을 입력하세요." aria-label="진료기록">${esc(p.note)}</textarea></div></section>` : ""}
          ${chartCards.orders ? `<section class="p-card"><div class="p-card-h"><h3>진단 및 처방</h3><span class="p-spacer"></span><button class="p-link" type="button" data-toast="DUR 점검 결과 이상이 없습니다.">DUR 점검</button></div>
            <div style="padding:0 14px"><input class="p-input under" id="orderSearch" style="width:100%" placeholder="오더 검색 (상병·처방·검사, 코드 또는 이름)" autocomplete="off" data-pop-anchor aria-label="오더 검색"></div>
            <div class="p-orders" style="padding:8px 10px 12px">
              ${hasDx ? "" : '<div class="p-order"><span class="ic">✚</span><span class="nm p-placeholder-err">주상병을 입력해주세요.</span></div>'}
              ${idx.filter(([o]) => item(o.code).kind === "dx").map(([o, i]) => orderRow(o, i)).join("")}
              ${p.orders.length ? `<hr><div class="p-order"><span class="ic">◇</span><span class="nm">재진진찰료 <span class="p-chip info">스마트진찰료</span></span><span></span><span class="p-hint">자동 산정</span></div>` : ""}
              ${idx.filter(([o]) => item(o.code).kind !== "dx").map(([o, i]) => orderRow(o, i)).join("")}
              ${hasRx ? '<div class="p-order"><span class="ic">📄</span><span class="nm">처방전(약국보관용)</span></div>' : ""}
            </div></section>` : ""}
          ${chartCards.pay ? `<section class="p-card"><div class="p-card-h"><h3>수납내역</h3></div><div style="padding:0 14px 14px;display:grid;gap:8px">
            <div class="p-box p-dl"><div class="sum"><span>받을 금액</span><span class="amt">${won(b.due)}</span></div><div class="sub"><span>- 본인부담금</span><span>${won(b.self)}</span></div><div class="sub"><span>- 비급여</span><span>${won(b.non)}</span></div><div><span>공단부담금</span><span>${won(b.gov)}</span></div><div><span>진료비총액</span><span>${won(b.total)}</span></div></div>
            <div class="p-box p-dl"><div class="sum"><span>수납 금액</span><span class="amt">${won(b.paid)}</span></div>${p.pays.map((x) => `<div class="sub"><span>${x.how}</span><span>${won(x.amt)}</span></div>`).join("")}<div><span></span><button class="p-link" type="button" id="addPay" ${b.left <= 0 ? "disabled" : ""}>＋ 수납 추가</button></div></div>
            <div class="p-box p-dl"><div><span>남은 금액</span><span class="amt ${b.left > 0 ? "accent" : ""}">${won(b.left)}</span></div></div></div></section>` : ""}
        </div>
        <div class="p-actionbar"><span class="p-hint">▯ ${here ? esc(here.name) : "-"}</span><span class="p-spacer"></span>
          <select class="p-select" id="dest" aria-label="보낼 곳">${groups.filter((g) => g.id !== p.group).map((g) => `<option value="${g.id}" ${g.id === "pay" ? "selected" : ""}>${g.name}</option>`).join("")}<option value="out">병원에서 내보내기</option></select>
          <select class="p-select" id="destSt" aria-label="상태"><option value="wait">대기</option><option value="priority">우선대기</option></select>
          <button class="p-btn primary" type="button" id="sendBtn">▶ 보내기</button></div></div>

      <div class="p-col"><div class="p-col-h">오더세트</div><div class="p-col-b">
        ${sets.map((s) => `<button class="set-row" type="button" data-set="${s.id}" aria-selected="${s.id === activeSet}"><span><span class="p-hint">${s.folder} /</span> ${esc(s.name)}</span><span class="p-hint">${s.items.length}</span></button>`).join("")}
        <div class="p-box" style="display:grid;gap:4px"><div style="display:flex;justify-content:space-between"><b>${esc(set.name)}</b><button class="p-link" type="button" id="copyAll">${set.items.length} 모두복사</button></div>
        ${set.items.map((c) => `<button class="set-row" type="button" data-add="${c}" style="height:28px"><span>${kindIcon[item(c).kind]} ${esc(item(c).name)}</span></button>`).join("")}</div></div></div>

      <div class="p-col collab"><div class="p-col-h">환자기록</div><div class="p-col-b">
        <div class="notice">📢 ${esc(p.msgs[0]?.text || "등록된 공지가 없습니다.")}</div>
        ${p.msgs.map((m) => `<div class="msg"><span class="who"><span class="p-avatar sm">${esc(m.who)}</span><b>${esc(m.who)}</b><time>${m.at}</time></span><span>${esc(m.text).replace(/@(\S+)/g, "<b>@$1</b>")}</span></div>`).join("")}
        <form id="msgForm" style="display:flex;gap:6px"><input class="p-input" id="msgIn" placeholder="@이름으로 알림" style="flex:1" aria-label="환자기록 입력"><button class="p-btn primary icon" aria-label="기록 남기기">✏</button></form>
        <span class="p-hint">팀 메모는 진료기록을 대신하지 않습니다.</span></div></div>
    </div></section>`;
}

function renderChart() {
  const p = selectedP();
  $("#view").innerHTML = `<div class="v-chart">${listHTML()}${p && p.group ? chartHTML(p) : `<section class="work" style="background:var(--p-canvas);border-left-color:transparent">${dashHTML()}</section>`}</div>`;
  bindChart();
}

function sendPatient(p, dest, st = "wait") {
  const before = { group: p.group, status: p.status };
  if (dest === "out") { p.group = null; selected = null; }
  else { p.group = dest; p.status = st; }
  render();
  const name = dest === "out" ? null : groups.find((g) => g.id === dest).name;
  const g = document.querySelector(`[data-group="${dest}"]`);
  g?.classList.add("flash"); setTimeout(() => g?.classList.remove("flash"), 1400);
  document.querySelector(`[data-pid="${p.id}"]`)?.classList.add("flash");
  toast(name ? `${p.name}님을 '${name}'(으)로 보냈습니다.` : `${p.name}님 진료를 종료했습니다.`, () => { Object.assign(p, before); if (!selected) selected = p.id; render(); });
}

function addOrder(p, code, silent) {
  const c = item(code); if (!c) return;
  if (c.kind === "dx" && p.orders.some((o) => o.code === code)) { if (!silent) toast("이미 추가된 상병입니다."); return; }
  p.orders.push({ code, q: c.kind === "rx" ? [1, 3, 3] : [1, 1, 1] });
  if (!silent) toast(c.kind === "dx" ? "상병을 추가했습니다." : "처방을 추가했습니다.");
}

function searchHTML(q, tab) {
  const qq = q.trim().toLowerCase();
  const hits = catalog.filter((c) => (tab === "all" || c.kind === tab) && (!qq || c.name.toLowerCase().includes(qq) || c.code.toLowerCase().includes(qq)));
  const hl = (s) => { if (!qq) return esc(s); const i = s.toLowerCase().indexOf(qq); return i < 0 ? esc(s) : `${esc(s.slice(0, i))}<mark>${esc(s.slice(i, i + qq.length))}</mark>${esc(s.slice(i + qq.length))}`; };
  const tabs = [["all", "전체(요약)"], ["dx", "상병"], ["rx", "처방아이템"], ["exam", "검사아이템"]];
  const byKind = {};
  hits.forEach((h) => (byKind[h.kind] ||= []).push(h));
  return `<div class="p-pop-tabs" role="tablist">${tabs.map(([k, l]) => `<button type="button" role="tab" data-act="tab" data-tab="${k}" aria-selected="${k === tab}">${l}</button>`).join("")}</div>
    ${hits.length ? Object.entries(byKind).map(([k, list]) => `<div class="p-pop-group"><span>${kindLabel[k]}</span><span>${list.length}</span></div>${list.slice(0, tab === "all" ? 3 : 9).map((h) => `<button class="p-menu-item" type="button" data-act="add" data-code="${h.code}">${kindIcon[h.kind]} <span class="p-hint">${hl(h.code)}</span> ${hl(h.name)}</button>`).join("")}`).join("")
      : `<div class="p-empty"><b>ⓘ 해당하는 아이템이 없습니다.</b><span>청구코드나 국문명칭으로 검색해보세요.</span></div>`}`;
}

function bindChart() {
  const view = $("#view");
  view.querySelectorAll(".p-row2").forEach((row) => row.addEventListener("click", () => {
    const p = patients.find((x) => x.id === +row.dataset.pid);
    const items = [`<button class="p-menu-item" type="button" data-act="open">차트 열기</button>`, ...groups.filter((g) => g.id !== p.group).map((g) => `<button class="p-menu-item" type="button" data-act="send" data-g="${g.id}">'${g.name}'(으)로 보내기</button>`),
      p.status !== "priority" ? `<button class="p-menu-item" type="button" data-act="prio">우선대기 설정</button>` : ""];
    openPop(row, items.join(""), (d) => {
      closePop();
      if (d.act === "open") { selected = p.id; render(); }
      else if (d.act === "send") sendPatient(p, d.g);
      else if (d.act === "prio") { p.status = "priority"; render(); toast(`${p.name}님을 우선대기로 설정했습니다.`); }
    });
  }));
  view.querySelectorAll("[data-open]").forEach((b) => (b.onclick = () => { selected = +b.dataset.open; render(); }));
  view.querySelectorAll("[data-start]").forEach((b) => (b.onclick = () => { const p = patients.find((x) => x.id === +b.dataset.start); p.status = "doing"; p.group = "r1"; selected = p.id; render(); }));
  view.querySelectorAll("[data-newpt]").forEach((b) => (b.onclick = newPatient));
  view.querySelectorAll("[data-toast]").forEach((b) => (b.onclick = () => toast(b.dataset.toast)));
  const p = selectedP(); if (!p) return;

  $("[data-closechart]").onclick = () => { selected = null; render(); };
  $("[data-sum='vital']").onclick = (e) => openPop(e.currentTarget, `<table class="p-table" style="min-width:300px"><thead><tr><th>일시</th><th>체온</th><th>체중</th></tr></thead><tbody><tr><td>오늘</td><td>36.6</td><td>61</td></tr>${p.visits.map((v) => `<tr><td>${v[0]}</td><td>36.4</td><td>61</td></tr>`).join("")}</tbody></table>`, () => {});
  $("[data-sum='info']").onclick = () => toast("환자정보 수정 모달은 이 예제에서 생략했습니다.");
  $("#cfgBtn").onclick = (e) => openPop(e.currentTarget, `<div style="padding:6px 8px;font-weight:600">⣿ 화면 구성</div>${[["note", "진료기록"], ["orders", "진단 및 처방"], ["pay", "수납"]].map(([k, l]) => `<label class="p-menu-item" style="display:flex;align-items:center;gap:8px"><input type="checkbox" data-cfg="${k}" ${chartCards[k] ? "checked" : ""}>${l}</label>`).join("")}<button class="p-btn primary" type="button" style="width:100%;margin-top:4px" data-act="ok">확인</button>`, (d) => {
    if (d.act !== "ok") return;
    pop.querySelectorAll("[data-cfg]").forEach((c) => (chartCards[c.dataset.cfg] = c.checked));
    closePop(); render();
  });
  const note = $("#note"); if (note) note.oninput = () => (p.note = note.value);

  const s = $("#orderSearch");
  if (s) {
    let tab = "all";
    const show = () => openPop(s, searchHTML(s.value, tab), (d) => {
      if (d.act === "tab") { tab = d.tab; show(); s.focus(); return; }
      if (d.act === "add") { addOrder(p, d.code); closePop(); render(); }
    }, true);
    s.addEventListener("focus", show);
    s.addEventListener("input", show);
    s.addEventListener("keydown", (e) => { if (e.key === "ArrowDown") pop.querySelector("[data-act=add]")?.focus(); });
  }
  view.querySelectorAll("[data-q]").forEach((inp) => inp.addEventListener("change", () => {
    const [i, k] = inp.dataset.q.split(":").map(Number);
    const v = Math.max(1, parseInt(inp.value, 10) || 1);
    p.orders[i].q[k] = v; render();
  }));
  view.querySelectorAll("[data-del]").forEach((b) => (b.onclick = () => { const [o] = p.orders.splice(+b.dataset.del, 1); render(); toast(`${item(o.code).name}을(를) 삭제했습니다.`, () => { p.orders.push(o); render(); }); }));
  view.querySelectorAll("[data-set]").forEach((b) => (b.onclick = () => { activeSet = b.dataset.set; render(); }));
  view.querySelectorAll("[data-add]").forEach((b) => (b.onclick = () => { addOrder(p, b.dataset.add); render(); }));
  $("#copyAll").onclick = () => { const set = sets.find((x) => x.id === activeSet); set.items.forEach((c) => addOrder(p, c, true)); render(); toast(`'${set.name}' ${set.items.length}건을 복사했습니다.`); };
  $("#addPay")?.addEventListener("click", () => payModal(p));
  $("#msgForm").onsubmit = (e) => { e.preventDefault(); const v = $("#msgIn").value.trim(); if (!v) return; p.msgs.push({ who: "은솔", at: new Date().toTimeString().slice(0, 5), text: v }); render(); };
  $("#sendBtn").onclick = () => sendPatient(p, $("#dest").value, $("#destSt").value);
}

function payModal(p) {
  const b = bill(p);
  let how = "카드";
  openModal(`${modalHead("수납 추가")}<div class="p-modal-b">
    <div class="p-box p-dl"><div><span>남은 금액</span><span class="amt">${won(b.left)}</span></div></div>
    <div class="p-field"><span class="p-label p-req">결제수단</span><div class="p-seg" id="how">${["카드", "현금", "할인금", "선납금"].map((h, i) => `<button type="button" aria-pressed="${i === 0}">${h}</button>`).join("")}</div></div>
    <div class="p-field"><label class="p-req" for="amt">결제금액</label><div style="display:flex;gap:8px;align-items:center"><input class="p-input" id="amt" inputmode="numeric" placeholder="0" style="flex:1"> 원 <button class="p-link" type="button" id="full">전액 입력</button></div></div>
    <div id="cond"></div></div>
    <div class="p-modal-f"><span class="p-spacer"></span><button class="p-btn ghost" type="button" data-close>취소</button><button class="p-btn strong" type="button" id="payOk" disabled>추가</button></div>`);
  const amt = $("#amt"), ok = $("#payOk");
  const cond = () => ($("#cond").innerHTML = how === "카드" ? `<div class="p-field"><label for="inst">할부선택</label><select class="p-select" id="inst"><option>일시불</option><option>3개월</option></select></div>`
    : how === "현금" ? `<span class="p-hint">ⓘ 진료비총액이 10만원을 넘으면 현금영수증을 발급해야 합니다.</span><label><input type="checkbox"> 현금영수증 발급</label>` : "");
  const valid = () => { const v = +amt.value.replace(/\D/g, ""); ok.disabled = !(v > 0 && v <= b.left); };
  cond();
  $("#how").onclick = (e) => { const t = e.target.closest("button"); if (!t) return; how = t.textContent; $("#how").querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === t)); cond(); };
  $("#full").onclick = () => { amt.value = b.left; valid(); };
  amt.oninput = valid;
  ok.onclick = () => { p.pays.push({ how, amt: +amt.value.replace(/\D/g, "") }); closeModal(); render(); toast("수납을 추가했습니다."); };
}

function newPatient() {
  openModal(`${modalHead("👤 신규환자등록")}<div class="p-modal-b">
    <div class="p-field"><label class="p-req" for="npName">이름</label><input class="p-input" id="npName"></div>
    <div class="p-field"><span class="p-label p-req">성별 · 나이</span><div style="display:flex;gap:8px"><div class="p-seg" id="npSex"><button type="button" aria-pressed="true">여</button><button type="button" aria-pressed="false">남</button></div><input class="p-input" id="npAge" inputmode="numeric" placeholder="나이" style="width:90px"></div></div>
    <div class="p-field"><label for="npPur">방문목적</label><select class="p-select" id="npPur"><option>일반진료</option><option>검사</option><option>레이저치료</option></select></div>
    <div class="p-field"><label class="p-req" for="npQ">대기열</label><select class="p-select" id="npQ">${groups.slice(0, 2).map((g) => `<option value="${g.id}">${g.name}</option>`).join("")}</select></div></div>
    <div class="p-modal-f"><button class="p-btn" type="button" data-close>취소</button><span class="p-spacer"></span><button class="p-btn strong" type="button" id="npOk" disabled>등록 후 접수</button></div>`);
  const ok = $("#npOk");
  const valid = () => (ok.disabled = !($("#npName").value.trim() && +$("#npAge").value > 0));
  $("#npName").oninput = valid; $("#npAge").oninput = valid;
  $("#npSex").onclick = (e) => { const t = e.target.closest("button"); if (t) $("#npSex").querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === t)); };
  ok.onclick = () => {
    const p = { id: 130000 + patients.length, name: $("#npName").value.trim(), sex: $("#npSex [aria-pressed=true]").textContent, age: +$("#npAge").value, purpose: $("#npPur").value, group: $("#npQ").value, status: "wait", ins: "건강보험", orders: [], pays: [], note: "", msgs: [], visits: [], isNew: true };
    patients.push(p); closeModal(); setView("chart");
    const g = document.querySelector(`[data-group="${p.group}"]`); g?.classList.add("flash"); setTimeout(() => g?.classList.remove("flash"), 1400);
    toast(`no.${p.id} ${p.name} 신규환자를 등록하고 접수했습니다.`);
  };
}
$("#newPt").onclick = newPatient;

/* ===== 예약 ===== */
const resources = [
  { id: "a", name: "이도윤 원장", cls: "", step: 15, cap: 1 },
  { id: "b", name: "검사", cls: "red", step: 30, cap: 2 },
];
let resDay = 4;
let resTab = "book";
let resBookings = [
  { id: 1, day: 4, res: "a", time: "09:30", name: "한소율", phone: "010-0000-1234", purpose: "일반진료" },
  { id: 2, day: 4, res: "b", time: "10:00", name: "오지환", phone: "010-0000-5678", purpose: "검사" },
  { id: 3, day: 5, res: "a", time: "10:15", name: "윤가람", phone: "010-0000-9012", purpose: "일반진료" },
];
const slotsOf = (r) => { const out = []; for (let m = 540; m < 660; m += r.step) out.push(`${String(m / 60 | 0).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`); return out; };
const endOf = (t, step) => { const [h, m] = t.split(":").map(Number); const e = h * 60 + m + step; return `${String(e / 60 | 0).padStart(2, "0")}:${String(e % 60).padStart(2, "0")}`; };
const booked = (day, res, time) => resBookings.filter((b) => !b.cancel && b.day === day && b.res === res && b.time === time);
const capOf = (day) => resources.reduce((s, r) => s + slotsOf(r).length * r.cap, 0) * (new Date(2026, 10, day).getDay() % 6 ? 1 : 0);

function renderRes() {
  const first = new Date(2026, 10, 1).getDay();
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const list = resBookings.filter((b) => b.day === resDay && (resTab === "book" ? !b.cancel : b.cancel)).sort((a, b) => a.time.localeCompare(b.time));
  $("#view").innerHTML = `<div class="v-res">
    <div style="display:grid;gap:8px;align-content:start;min-height:0">
      <section class="p-card"><div class="p-card-h"><h3>2026. 11</h3><span class="p-spacer"></span><button class="p-btn" type="button" data-day="4">오늘</button></div>
        <div class="mini">${["일", "월", "화", "수", "목", "금", "토"].map((d) => `<span class="dow">${d}</span>`).join("")}${"<span></span>".repeat(first)}
        ${days.map((d) => { const cap = capOf(d); const n = resBookings.filter((b) => b.day === d && !b.cancel).length; return `<button type="button" data-day="${d}" aria-pressed="${d === resDay}" class="${new Date(2026, 10, d).getDay() === 0 ? "sun" : ""}">${d}<small>${cap ? `${n}/${cap}` : "휴진"}</small></button>`; }).join("")}</div></section>
      <section class="p-card"><div class="p-card-h"><h3>11-${String(resDay).padStart(2, "0")} 예약환자</h3><span class="p-count">${list.length}</span></div>
        <div class="tabs" style="margin-top:0" role="tablist"><button role="tab" type="button" data-rtab="book" aria-selected="${resTab === "book"}">예약 ${resBookings.filter((b) => b.day === resDay && !b.cancel).length}</button><button role="tab" type="button" data-rtab="cancel" aria-selected="${resTab === "cancel"}">예약취소 ${resBookings.filter((b) => b.day === resDay && b.cancel).length}</button></div>
        ${list.length ? `<table class="p-table"><thead><tr><th>시간</th><th>환자정보</th><th>스케줄</th><th>방문목적</th></tr></thead><tbody>${list.map((b) => `<tr tabindex="0" data-bk="${b.id}" style="cursor:pointer"><td>${b.time}</td><td>${esc(b.name)}</td><td>${resources.find((r) => r.id === b.res).name}</td><td>${esc(b.purpose)}${b.cancel ? ` <span class="p-hint">(${esc(b.cancel)})</span>` : ""}</td></tr>`).join("")}</tbody></table>`
          : `<div class="p-empty"><b>해당하는 환자가 없습니다.</b><span>시간 블록을 눌러 새 예약을 만드세요.</span></div>`}</section>
    </div>
    <section class="p-card" style="min-height:0;overflow:auto"><div class="p-card-h"><h3>2026년 11월 ${resDay}일</h3><span class="p-spacer"></span><div class="p-seg"><button type="button" aria-pressed="true">일별</button><button type="button" aria-pressed="false" data-toast="주별 보기는 이 예제에서 생략했습니다.">주별</button></div>
      <button class="p-btn icon" type="button" data-shift="-1" aria-label="이전 날">‹</button><button class="p-btn icon" type="button" data-shift="1" aria-label="다음 날">›</button></div>
      ${capOf(resDay) ? `<div class="grid" style="padding:0 14px 14px"><span class="hdr p-hint">시간</span>${resources.map((r) => `<span class="hdr" style="color:${r.cls ? "#D9695C" : "#5A7FCF"}">${r.name}</span>`).join("")}<span class="hdr"></span>
        ${["09:00", "09:30", "10:00", "10:30"].map((h) => `<span class="time">${h}</span>${resources.map((r) => `<div class="lane">${slotsOf(r).filter((t) => t >= h && t < endOf(h, 30)).map((t) => { const bs = booked(resDay, r.id, t); return `<button class="p-slot ${r.cls} ${bs.length >= r.cap ? "full" : ""}" type="button" data-slot="${r.id}|${t}" style="min-height:${r.step === 15 ? 48 : 100}px"><span class="t"><span>${t}-${endOf(t, r.step)}</span><span>${bs.length}/${r.cap}</span></span>${bs.map((b) => `<span class="bk">${esc(b.name)} · ${esc(b.purpose)}</span>`).join("")}<span class="add">＋ 새 예약</span></button>`; }).join("")}</div>`).join("")}<span></span>`).join("")}</div>`
        : `<div class="p-empty"><b>휴진일입니다.</b><span>관리 &gt; 스케줄에서 진료 요일을 설정하세요.</span></div>`}</section></div>`;
  const v = $("#view");
  v.querySelectorAll("[data-day]").forEach((b) => (b.onclick = () => { resDay = +b.dataset.day; renderRes(); }));
  v.querySelectorAll("[data-shift]").forEach((b) => (b.onclick = () => { resDay = Math.min(30, Math.max(1, resDay + +b.dataset.shift)); renderRes(); }));
  v.querySelectorAll("[data-rtab]").forEach((b) => (b.onclick = () => { resTab = b.dataset.rtab; renderRes(); }));
  v.querySelectorAll("[data-toast]").forEach((b) => (b.onclick = () => toast(b.dataset.toast)));
  v.querySelectorAll("[data-slot]").forEach((b) => (b.onclick = () => { const [r, t] = b.dataset.slot.split("|"); resModal({ res: r, time: t }); }));
  v.querySelectorAll("[data-bk]").forEach((tr) => { const open = () => resModal(resBookings.find((x) => x.id === +tr.dataset.bk)); tr.onclick = open; tr.onkeydown = (e) => e.key === "Enter" && open(); });
}

function resModal(bk) {
  const editing = !!bk.id;
  const r = () => resources.find((x) => x.id === $("#rRes").value);
  openModal(`${modalHead(editing ? "예약정보" : "새 예약")}<div class="p-modal-b">
    <div class="p-field"><label class="p-req" for="rName">환자명</label><input class="p-input" id="rName" value="${esc(bk.name || "")}" ${bk.cancel ? "disabled" : ""}></div>
    <div class="p-field"><label class="p-req" for="rPhone">연락처</label><input class="p-input" id="rPhone" value="${esc(bk.phone || "")}" placeholder="010-0000-0000" ${bk.cancel ? "disabled" : ""}></div>
    <div class="p-box" style="display:grid;gap:10px;grid-template-columns:1fr 1fr">
      <div class="p-field"><label class="p-req" for="rRes">스케줄</label><select class="p-select" id="rRes">${resources.map((x) => `<option value="${x.id}" ${x.id === bk.res ? "selected" : ""}>${x.name}</option>`).join("")}</select></div>
      <div class="p-field"><label class="p-req" for="rTime">진료시간</label><select class="p-select" id="rTime"></select></div>
      <div class="p-field" style="grid-column:1/-1"><label class="p-req" for="rPur">방문목적</label><select class="p-select" id="rPur"><option value="">선택</option>${["일반진료", "검사", "레이저치료"].map((x) => `<option ${x === bk.purpose ? "selected" : ""}>${x}</option>`).join("")}</select></div>
      <span class="p-hint err" id="rWarn" style="grid-column:1/-1" hidden>ⓘ 예약 슬롯이 가득 찬 시간입니다.</span></div></div>
    <div class="p-modal-f">${editing && !bk.cancel ? '<button class="p-btn danger" type="button" id="rCancel">예약취소</button>' : ""}<span class="p-spacer"></span><button class="p-btn ghost" type="button" data-close>취소</button>${bk.cancel ? "" : `<button class="p-btn strong" type="button" id="rOk" disabled>${editing ? "예약수정" : "예약등록"}</button>`}</div>`);
  const fillTimes = (keep) => { $("#rTime").innerHTML = slotsOf(r()).map((t) => `<option ${t === keep ? "selected" : ""}>${t}</option>`).join(""); };
  fillTimes(bk.time);
  const check = () => {
    const others = booked(resDay, r().id, $("#rTime").value).filter((x) => x.id !== bk.id);
    $("#rWarn").hidden = others.length < r().cap;
    if ($("#rOk")) $("#rOk").disabled = !($("#rName").value.trim() && $("#rPhone").value.trim() && $("#rPur").value);
  };
  $("#rRes").onchange = () => { fillTimes(); check(); };
  ["rName", "rPhone", "rTime", "rPur"].forEach((id) => ($("#" + id).oninput = $("#" + id).onchange = check));
  check();
  $("#rOk")?.addEventListener("click", () => {
    const data = { day: bk.day || resDay, res: $("#rRes").value, time: $("#rTime").value, name: $("#rName").value.trim(), phone: $("#rPhone").value.trim(), purpose: $("#rPur").value };
    if (editing) Object.assign(bk, data); else resBookings.push({ id: Date.now(), ...data });
    closeModal(); renderRes(); toast(editing ? "예약을 수정했습니다." : "예약을 등록했습니다.");
  });
  $("#rCancel")?.addEventListener("click", () => confirmBox({ title: "예약을 취소하시겠습니까?", body: "취소한 예약은 예약취소 탭에 남습니다.", reason: "취소 사유 (선택)" }, (why) => { bk.cancel = why || "사유 없음"; renderRes(); toast("예약이 취소되었습니다."); }));
}

/* ===== 청구 ===== */
let claim = { issued: false, no: "-", tab: "list" };
let claimRows = [
  { pid: 104420, name: "정민호", date: "2026-10-08", amt: 18400, fixed: [] },
  { pid: 113912, name: "김하늘", date: "2026-10-12", amt: 24100, fixed: [] },
  { pid: 0, name: "서다인", date: "2026-10-15", amt: 15600, fixed: ["보험자격 확인 필요"] },
  { pid: 0, name: "문태오", date: "2026-10-21", amt: 31200, fixed: [] },
  { pid: 108833, name: "이도담", date: "2026-10-28", amt: 27700, fixed: [] },
];
function rowErrors(r) {
  const errs = [...r.fixed];
  const p = patients.find((x) => x.id === r.pid);
  if (p && firstDx(p) < 0) errs.push("주상병 미기재");
  return errs;
}
let claimSnapshot = null;
function refreshClaim() { claimSnapshot = claimRows.map((r) => ({ ...r, errs: rowErrors(r) })); }
refreshClaim();

function renderClaim() {
  const rows = claimSnapshot.filter((r) => (claim.tab === "list" ? !r.out : r.out));
  const live = claimSnapshot.filter((r) => !r.out);
  const errN = live.reduce((s, r) => s + r.errs.length, 0);
  const total = live.reduce((s, r) => s + r.amt, 0);
  $("#view").innerHTML = `<div class="v-claim">
    <section><div class="p-card-h"><h2>원청구서 내역</h2></div>
      <button class="batch" type="button" aria-pressed="true"><span style="display:flex;justify-content:space-between"><b>2026년 10월</b>${claim.issued ? '<span class="p-chip done">발급완료</span>' : ""}</span><span class="p-hint">보험종류 <span style="color:var(--p-info-fg)">건강보험</span> · 청구번호 ${claim.no} · 청구건수 ${live.length}건</span></button></section>
    <section><div class="p-card-h"><h2>2026년 10월 건강보험 ›</h2><span class="p-spacer"></span>${claim.issued ? "" : `<span class="p-btn" aria-live="polite">오류 <b style="color:${errN ? "var(--p-danger)" : "inherit"}">${errN}건</b></span><button class="p-btn icon" type="button" id="cRefresh" aria-label="다시 계산">↻</button>`}</div>
      <div class="p-box kpi4"><div><span class="p-label">청구번호</span><b>${claim.no}</b></div><div><span class="p-label">청구건수</span><b>${live.length}건</b></div><div><span class="p-label">진료비총액</span><b>${won(total)}</b></div><div><span class="p-label">청구총액</span><b>${won(total * 0.7)}</b></div></div>
      <div class="tabs" role="tablist"><button role="tab" type="button" data-ctab="list" aria-selected="${claim.tab === "list"}">명세서내역</button>${claim.issued ? "" : `<button role="tab" type="button" data-ctab="out" aria-selected="${claim.tab === "out"}">제외내역 ${claimSnapshot.filter((r) => r.out).length}</button>`}</div>
      <div style="flex:1;overflow:auto">${rows.length ? `<table class="p-table"><thead><tr><th>환자명</th><th>내원일</th><th class="num">진료비</th><th>상태</th><th></th></tr></thead><tbody>
        ${rows.map((r) => { const i = claimSnapshot.indexOf(r); return `<tr><td>${esc(r.name)}</td><td>${r.date}</td><td class="num">${r.amt.toLocaleString("ko-KR")}</td>
          <td>${r.errs.length ? `<button class="p-link danger" type="button" data-err="${i}">⚠ 오류 ${r.errs.length}건</button>` : '<span class="p-hint">정상</span>'}</td>
          <td class="num">${claim.issued ? "" : `<button class="p-link row-act" type="button" data-out="${i}">${r.out ? "되살리기" : "제외하기"}</button>`}</td></tr>`; }).join("")}</tbody></table>`
        : `<div class="p-empty"><b>ⓘ 제외한 명세서가 없습니다.</b></div>`}</div>
      <div class="p-actionbar">${claim.issued ? "" : '<button class="p-btn danger" type="button" data-toast="예제에서는 원청구서를 삭제하지 않습니다.">원청구서 삭제</button>'}<span class="p-spacer"></span>
        ${claim.issued ? '<button class="p-btn strong" type="button" data-toast="예제에서는 파일을 만들지 않습니다.">내려받기</button>' : `<button class="p-btn primary" type="button" id="cIssue">발급하기</button>`}</div></section></div>`;
  const v = $("#view");
  v.querySelectorAll("[data-toast]").forEach((b) => (b.onclick = () => toast(b.dataset.toast)));
  v.querySelectorAll("[data-ctab]").forEach((b) => (b.onclick = () => { claim.tab = b.dataset.ctab; renderClaim(); }));
  $("#cRefresh")?.addEventListener("click", () => { const keep = new Set(claimSnapshot.filter((r) => r.out).map((r) => r.name)); refreshClaim(); claimSnapshot.forEach((r) => (r.out = keep.has(r.name))); renderClaim(); toast("명세서를 다시 점검했습니다."); });
  v.querySelectorAll("[data-out]").forEach((b) => (b.onclick = () => {
    const r = claimSnapshot[+b.dataset.out];
    if (r.out) { r.out = false; renderClaim(); return; }
    confirmBox({ title: "해당 명세서를 원청구서에서 제외하시겠습니까?", body: "제외한 명세서는 제외내역 탭에서 되살릴 수 있습니다." }, () => { r.out = true; renderClaim(); toast(`${r.name} 명세서를 제외했습니다.`); });
  }));
  v.querySelectorAll("[data-err]").forEach((b) => (b.onclick = () => {
    const r = claimSnapshot[+b.dataset.err];
    const p = patients.find((x) => x.id === r.pid);
    openModal(`${modalHead("명세서")}<div class="p-modal-b"><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px"><div><span class="p-label">환자명</span><div>${esc(r.name)}</div></div><div><span class="p-label">내원일</span><div>${r.date}</div></div><div><span class="p-label">진료비</span><div>${won(r.amt)}</div></div></div>
      <b>점검내용</b>${r.errs.map((e) => `<div class="p-banner-err"><span style="color:var(--p-danger)">❗</span><span>${esc(e)}</span><span class="p-spacer"></span>${p && p.group && e.includes("상병") ? `<button class="p-link" type="button" data-gochart>차트열기</button>` : p && e.includes("상병") ? '<span class="p-hint">대기열에 없는 환자</span>' : ""}</div>`).join("")}</div>
      <div class="p-modal-f"><span class="p-spacer"></span><button class="p-btn" type="button" data-close>닫기</button></div>`, "wide");
    modal.querySelector("[data-gochart]")?.addEventListener("click", () => { closeModal(); selected = p.id; chartCards.orders = true; setView("chart"); $("#orderSearch")?.focus(); toast("상병을 추가한 뒤 청구 화면에서 ↻로 다시 점검하세요."); });
  }));
  $("#cIssue")?.addEventListener("click", () => {
    const errN2 = claimSnapshot.filter((r) => !r.out).reduce((s, r) => s + r.errs.length, 0);
    const go = () => { claim.issued = true; claim.no = "2026109931"; claim.tab = "list"; claimSnapshot = claimSnapshot.filter((r) => !r.out); renderClaim(); toast("원청구서를 발급했습니다."); };
    errN2 ? confirmBox({ title: `오류 ${errN2}건이 남아 있습니다. 그대로 발급하시겠습니까?`, body: "발급 후에는 명세서를 수정하거나 제외할 수 없습니다.", ok: "발급" }, go) : go();
  });
}

/* ===== 통계 ===== */
let statUnit = "월별";
let statPick = "due";
function renderStat() {
  const rows = patients.map((p) => ({ p, b: bill(p) })).filter((x) => x.b.due > 0);
  const due = rows.filter((x) => x.b.left > 0);
  const sum = rows.reduce((a, x) => ({ total: a.total + x.b.total, gov: a.gov + x.b.gov, self: a.self + x.b.self, non: a.non + x.b.non }), { total: 0, gov: 0, self: 0, non: 0 });
  $("#view").innerHTML = `<div class="v-stat">
    <section class="p-card"><div class="p-card-h"><h2>매출 통계</h2><span class="p-spacer"></span><button class="p-btn" type="button" id="exp">↗ 내보내기</button><button class="p-btn icon" type="button" id="sReset" aria-label="필터 초기화">↻</button></div>
      <div class="filters"><div class="p-seg" id="unit">${["일별", "월별"].map((u) => `<button type="button" aria-pressed="${u === statUnit}">${u}</button>`).join("")}</div><input class="p-input" type="${statUnit === "일별" ? "date" : "month"}" value="${statUnit === "일별" ? "2026-11-04" : "2026-11"}" aria-label="기간"></div>
      <div style="padding:0 14px 14px;display:grid;gap:10px">
        <div class="p-box p-dl"><div class="sum"><span>총 환자</span><span class="amt">${rows.length}명</span></div></div>
        <div class="p-box p-dl"><div class="sum"><span>총 매출</span><span class="amt">${won(sum.total)}</span></div><div><span>급여 총액</span><span>${won(sum.gov + sum.self)}</span></div><div class="sub"><span>- 공단 부담금</span><span>${won(sum.gov)}</span></div><div class="sub"><span>- 본인 부담금</span><span>${won(sum.self)}</span></div><div><span>비급여 총액</span><span>${won(sum.non)}</span></div></div>
        <span class="p-hint">화면에는 집계만 표시합니다. 환자별 원장은 내보내기 파일로 확인하세요.</span></div></section>
    <section class="p-card"><div class="p-card-h"><h2>${statPick === "due" ? "미수 내역" : "환불 내역"}</h2><span class="p-count">${statPick === "due" ? due.length : 0}</span></div>
      <button class="sumcard" type="button" data-pick="due" aria-pressed="${statPick === "due"}"><span class="p-hint">미수 환자수</span><b>${due.length}명</b><span class="p-hint">미수 금액 ${won(due.reduce((s, x) => s + x.b.left, 0))}</span></button>
      <button class="sumcard" type="button" data-pick="refund" aria-pressed="${statPick === "refund"}"><span class="p-hint">환불 환자수</span><b>0명</b><span class="p-hint">환불 금액 0원</span></button>
      ${statPick === "due" && due.length ? `<table class="p-table"><thead><tr><th>환자번호</th><th>환자명</th><th class="num">미수금액</th></tr></thead><tbody>${due.map((x) => `<tr tabindex="0" data-prev="${x.p.id}" style="cursor:pointer"><td>${x.p.id}</td><td>${esc(x.p.name)}</td><td class="num">${x.b.left.toLocaleString("ko-KR")}</td></tr>`).join("")}</tbody></table>`
        : `<div class="p-empty"><b>ⓘ 데이터가 없습니다.</b><span>${statPick === "due" ? "처방이 입력된 환자의 남은 금액이 여기에 모입니다." : "선택한 기간에 환불이 없습니다."}</span></div>`}</section></div>`;
  const v = $("#view");
  $("#unit").onclick = (e) => { const t = e.target.closest("button"); if (t) { statUnit = t.textContent; renderStat(); } };
  $("#sReset").onclick = () => { statUnit = "월별"; renderStat(); };
  $("#exp").onclick = (e) => { const b = e.currentTarget; b.disabled = true; b.textContent = "준비 중…"; setTimeout(() => { renderStat(); toast("예제에서는 파일을 만들지 않습니다."); }, 700); };
  v.querySelectorAll("[data-pick]").forEach((b) => (b.onclick = () => { statPick = b.dataset.pick; renderStat(); }));
  v.querySelectorAll("[data-prev]").forEach((tr) => { const open = () => {
    const p = patients.find((x) => x.id === +tr.dataset.prev);
    openModal(`${modalHead(`${esc(p.name)} <span class="p-chip gray">${p.id}</span> <span class="p-chip info">${p.ins}</span>`)}<div class="p-modal-b"><section class="p-card"><div class="p-card-h"><h3>진료기록</h3></div><div style="padding:0 14px 12px">${esc(p.note || "기록 없음")}</div></section>
      <section class="p-card"><div class="p-card-h"><h3>진단 및 처방</h3></div><div style="padding:0 14px 12px;display:grid;gap:4px">${p.orders.map((o) => `<span>${kindIcon[item(o.code).kind]} ${esc(item(o.code).name)}</span>`).join("")}</div></section></div>
      <div class="p-modal-f"><button class="p-btn" type="button" data-close>닫기</button><span class="p-spacer"></span>${p.group ? '<button class="p-btn strong" type="button" id="goChart">차트열기</button>' : ""}</div>`, "wide");
    $("#goChart")?.addEventListener("click", () => { closeModal(); selected = p.id; chartCards.pay = true; setView("chart"); });
  }; tr.onclick = open; tr.onkeydown = (e) => e.key === "Enter" && open(); });
}

const start = location.hash.slice(1);
setView(["chart", "res", "stat", "claim"].includes(start) ? start : "chart");
