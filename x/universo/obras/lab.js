/* Laboratório Universo: interface independente, motor sem DOM. */
import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.80.0?bundle';
const client=createClient('https://kjikzdpqejhsgutakigw.supabase.co','sb_publishable_sDnGg8LHSitHRRBEgtny4A_zmFvpcx1');
const works=globalThis.TereonXWorks.create(client),$=id=>document.getElementById(id);
const labels={planning:'Planejamento',active:'Em andamento',paused:'Pausada',completed:'Concluída',archived:'Arquivada'};
let spaces=[],current=[],editingWork=null,editingSpace=null,busy=false,showTrash=false;
function say(msg,error=false){$('notice').textContent=msg;$('notice').classList.toggle('error',error);}
function el(tag,content,cls){const e=document.createElement(tag);if(content!==undefined)e.textContent=String(content);if(cls)e.className=cls;return e;}
function makeButton(label,click,cls='btn small'){const b=el('button',label,cls);b.type='button';b.onclick=click;return b;}
function toggleBusy(value){busy=value;document.querySelectorAll('button').forEach(b=>b.disabled=value);if(!value){const disabled=!spaces.length;$('new-work').disabled=disabled;for(const id of ['edit-space','remove-space'])$(id).disabled=disabled||$('space').value==='all';}}
function activeSpace(){return spaces.find(s=>s.id===$('space').value);}
function spaceName(id){return spaces.find(s=>s.id===id)?.name||'Espaço não identificado';}
function fmt(date){if(!date)return '';const [y,m,d]=date.split('-');return d+'/'+m+'/'+y;}
function close(id){const d=$(id);if(d.open)d.close();}
function open(id){$(id).showModal();}
function openSpace(space=null){
 editingSpace=space?.id||null;
 $('space-dialog-title').textContent=space?'Editar espaço':'Novo espaço';
 $('space-name').value=space?.name||'';
 $('space-kind').value=space?.kind||'personal';
 $('space-kind').disabled=!!space;
 open('space-dialog');$('space-name').focus();
}
function openWork(work=null){
 editingWork=work?.id||null;
 $('work-dialog-title').textContent=work?'Editar obra':'Nova obra';
 $('work-name').value=work?.name||'';$('work-description').value=work?.description||'';
 const picker=$('work-workspace');picker.replaceChildren();
 for(const s of spaces){const opt=el('option',s.name);opt.value=s.id;picker.append(opt);}
 picker.value=work?.workspace_id||($('space').value==='all'?spaces[0]?.id:$('space').value);
 picker.disabled=!!work;
 $('work-start').value=work?.planned_start||'';
 $('work-end').value=work?.planned_end||'';
 $('work-status').value=work?.status||'planning';
 open('work-dialog');$('work-name').focus();
}
async function transaction(fn,success){
 if(busy)return;
 toggleBusy(true);say('');
 try{await fn();say(success);}
 catch(e){say(e.message||'Não foi possível concluir.',true);}
 finally{toggleBusy(false);}
}
function askDelete(label,description,action){
 $('confirm-message').textContent=description;
 const accept=$('confirm-accept');
 accept.textContent='Excluir '+label;
 accept.onclick=()=>{close('confirm-dialog');transaction(action,label==='espaço'?'Espaço movido para a lixeira.':'Obra movida para a lixeira.');};
 open('confirm-dialog');
}
function render(){
 $('works').replaceChildren();
 $('stat-active').textContent=String(current.filter(w=>w.status==='active').length);
 $('stat-total').textContent=String(current.length);
 if(!current.length){$('works').append(el('p','Nenhuma obra neste espaço.','empty'));return;}
 for(const work of current){
  const card=el('article',undefined,'work');
  card.append(el('h3',work.name),el('small',spaceName(work.workspace_id)+' · '+(labels[work.status]||work.status)));
  if(work.planned_start||work.planned_end)card.append(el('p','Previsto: '+(work.planned_start?fmt(work.planned_start):'—')+' a '+(work.planned_end?fmt(work.planned_end):'—')));
  if(work.description)card.append(el('p',work.description));
  const bar=el('div',undefined,'actions');
  bar.append(makeButton('Editar',()=>openWork(work)));
  bar.append(makeButton('Excluir',()=>askDelete('obra','A obra "'+work.name+'" sairá da lista. Ela poderá ser restaurada pela Lixeira.',async()=>{await works.removeWork(work.id);await refreshWorks();if(showTrash)await loadTrash();}),'btn small danger'));
  card.append(bar);$('works').append(card);
 }
}
async function refreshWorks(){const id=$('space').value;current=!spaces.length?[]:id==='all'?await works.listAll():await works.list(id);render();}
async function refreshSpaces(preferId){
 spaces=await works.spaces();
 const previous=preferId||$('space').value;
 $('space').replaceChildren();
 if(spaces.length){const all=el('option','Todos os espaços');all.value='all';$('space').append(all);}
 for(const s of spaces){
  const opt=el('option',s.name+(s.kind==='personal'?' · Pessoal':' · Organização'));opt.value=s.id;$('space').append(opt);
 }
 if(previous&&(previous==='all'||spaces.some(s=>s.id===previous)))$('space').value=previous;
 else if(spaces.length)$('space').value='all';
 const enabled=!!spaces.length;
 $('new-work').disabled=!enabled;
 $('edit-space').disabled=!enabled||$('space').value==='all';
 $('remove-space').disabled=!enabled||$('space').value==='all';
 if(!enabled){current=[];render();say('Crie um espaço de trabalho para começar.');}
 else await refreshWorks();
}
async function loadTrash(){
 const [deletedSpaces,deletedWorks]=await Promise.all([
  works.trash('spaces'),$('space').value==='all'?Promise.all(spaces.map(s=>works.trash('works',s.id))).then(x=>x.flat()):$('space').value?works.trash('works',$('space').value):Promise.resolve([])
 ]);
 function paint(target,items,type){
  $(target).replaceChildren();
  if(!items.length){$(target).append(el('p','Nenhum registro excluído.','empty'));return;}
  for(const item of items){
   const row=el('div',undefined,'trash-row');row.append(el('span',item.name+(type==='works'?' · '+spaceName(item.workspace_id):'')));
   row.append(makeButton('Restaurar',()=>transaction(async()=>{
    await works.restore(type,item.id);
    await refreshSpaces(type==='spaces'?item.id:undefined);
    await loadTrash();
   },'Registro restaurado.')));
   $(target).append(row);
  }
 }
 paint('trashed-spaces',deletedSpaces,'spaces');paint('trashed-works',deletedWorks,'works');
}
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>close(b.dataset.close));
$('confirm-cancel').onclick=()=>close('confirm-dialog');
$('add-space').onclick=()=>openSpace();
$('edit-space').onclick=()=>{const s=activeSpace();if(s)openSpace(s);};
$('remove-space').onclick=()=>{
 const s=activeSpace();if(!s)return;
 askDelete('espaço','O espaço "'+s.name+'" deixará de aparecer. Suas obras serão preservadas e voltarão a aparecer quando o espaço for restaurado.',async()=>{
  await works.removeSpace(s.id);await refreshSpaces();
  if(showTrash)await loadTrash();
 });
};
$('space').onchange=()=>transaction(async()=>{await refreshWorks();if(showTrash)await loadTrash();},'Filtro de espaços aplicado.');
$('new-work').onclick=()=>openWork();
$('space-form').onsubmit=e=>{
 e.preventDefault();const editing=editingSpace;
 transaction(async()=>{
  const sp=editing?await works.updateSpace(editing,$('space-name').value):
    await works.createSpace($('space-name').value,$('space-kind').value);
  close('space-dialog');await refreshSpaces(sp.id);
  if(showTrash)await loadTrash();
 },editing?'Espaço atualizado.':'Espaço criado.');
};
$('work-form').onsubmit=e=>{
 e.preventDefault();const editing=editingWork;
 const record={name:$('work-name').value,description:$('work-description').value,status:$('work-status').value,planned_start:$('work-start').value||null,planned_end:$('work-end').value||null};
 transaction(async()=>{
  if(editing)await works.updateWork(editing,record);
  else await works.createWork($('work-workspace').value,record);
  close('work-dialog');await refreshWorks();
 },editing?'Obra atualizada.':'Obra cadastrada.');
};
$('toggle-trash').onclick=()=>transaction(async()=>{
 showTrash=!showTrash;
 $('trash-content').classList.toggle('hidden',!showTrash);
 $('toggle-trash').textContent=showTrash?'Ocultar lixeira':'Ver excluídos';
 if(showTrash)await loadTrash();
},'');
async function start(){
 try{
  const session=await client.auth.getSession();
  if(session.error)throw session.error;
  if(!session.data?.session){
   $('logged-out').classList.remove('hidden');$('app').classList.add('hidden');
   say('Entre na sua conta para cadastrar obras.');return;
  }
  $('logged-out').classList.add('hidden');$('app').classList.remove('hidden');
  await refreshSpaces();if(spaces.length)say('Obras carregadas.');
 }catch(e){$('logged-out').classList.remove('hidden');$('app').classList.add('hidden');say('Erro ao consultar o cadastro: '+e.message,true);}
}
start();
