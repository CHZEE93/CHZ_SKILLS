'use strict';
const get = id => document.getElementById(id);
const records = [
  ['R-1042','회의실 모니터','화면이 간헐적으로 꺼집니다.','대기'],
  ['R-1041','라벨 프린터','급지 시 용지가 걸립니다.','점검 중'],
  ['R-1040','무선 스캐너','충전 단자 교체를 마쳤습니다.','완료']
].map(([id,name,issue,state])=>({id,name,issue,state,note:'',draft:'',pending:state,history:['접수 등록 · '+state]}));
let selected = records[0];
const visible = r => (get('filter').value==='전체'||get('filter').value===r.state) &&
  (r.id+' '+r.name).toLowerCase().includes(get('search').value.trim().toLowerCase());
function list(){
  const rows=get('rows'); rows.replaceChildren();
  for(const r of records.filter(visible)){
    const b=document.createElement('button'); b.className='row'; b.type='button'; b.dataset.id=r.id;
    b.setAttribute('aria-pressed',String(r===selected));
    const title=document.createElement('strong'),meta=document.createElement('span');
    title.textContent=r.name; meta.textContent=r.id+' · '+r.state;
    b.append(title,meta); b.onclick=()=>{selected=r;document.body.classList.add('detail');render();get('feedback').textContent='';get('name').focus()};rows.append(b);
  }
  if(!rows.children.length) rows.textContent='일치하는 접수가 없습니다. 검색어나 상태를 변경하세요.';
}
function render(){
  list();for(const key of ['work','audit'])get(key).hidden=!selected;
  if(!selected)return;
  get('ref').textContent='REPAIR / '+selected.id;get('name').textContent=selected.name;
  get('symptom').textContent=selected.issue;get('state').value=selected.pending;get('note').value=selected.draft;get('note').setCustomValidity('');
  get('history').replaceChildren(...selected.history.map(s=>{const li=document.createElement('li');li.textContent=s;return li}));
}
function refilter(){if(!selected||!visible(selected))selected=records.find(visible);if(!selected)document.body.classList.remove('detail');render()}
get('filter').onchange=refilter;get('search').oninput=refilter;
get('note').oninput=e=>{selected.draft=e.target.value;e.target.setCustomValidity('')};
get('state').onchange=e=>selected.pending=e.target.value;
get('template').onclick=()=>{const n=get('note');n.setRangeText('증상: '+selected.issue+'\n점검 결과: \n다음 조치: ',n.selectionStart,n.selectionEnd,'end');selected.draft=n.value;n.setCustomValidity('');n.focus()};
document.querySelector('form').onsubmit=e=>{e.preventDefault();if(!selected.draft.trim()){get('note').setCustomValidity('점검 기록을 입력하세요.');get('note').reportValidity();return}
  selected.note=selected.draft.trim();selected.state=selected.pending;
  selected.history.unshift(selected.state+' · '+selected.note);
  get('feedback').textContent=selected.id+' 점검 기록을 저장했습니다. 처리 상태: '+selected.state;
  if(!visible(selected)){document.body.classList.remove('detail');refilter()}else render();
};
get('back').onclick=()=>{document.body.classList.remove('detail');(document.querySelector('.row[aria-pressed=true]')||get('search')).focus()};
render();
