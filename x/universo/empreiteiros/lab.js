/* TEREON X — Empreiteiros e funcionários: laboratório local, independente de Auth/Obras. */
(function(){'use strict';
const engine=globalThis.TereonXContractors,$=id=>document.getElementById(id);
const KEY='tereon-x-contractors-simulation-v1';
let state={contractors:[],teams:[],employees:[]},readError=false,editingContractor=null,editingEmployee=null;
function say(v,error=false){$('message').textContent=v;$('message').classList.toggle('error',error)}
function localDate(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
function uid(){return globalThis.crypto?.randomUUID?.()||'sim-'+Date.now()+'-'+Math.random().toString(36).slice(2)}
function load(){
 try{
  const r=localStorage.getItem(KEY);if(!r)return;
  const v=JSON.parse(r);
  if(!v||!Array.isArray(v.contractors)||!Array.isArray(v.teams)||v.employees!==undefined&&!Array.isArray(v.employees))throw Error('Formato inválido.');
  state={...v,employees:v.employees||[]};
 }catch(e){readError=true;say('Cadastro local incompatível. Gravações bloqueadas para preservar os dados: '+e.message,true)}
}
function commit(next){
 if(readError)throw Error('Cadastro local incompatível: não é seguro sobrescrever os dados.');
 localStorage.setItem(KEY,JSON.stringify(next));state=next;render();
}
function elem(tag,text,className){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(className)e.className=className;return e;}
function btn(text,fn,cls='secondary'){const b=elem('button',text,cls);b.type='button';b.addEventListener('click',fn);return b;}
function close(id){if($(id).open)$(id).close()}
function openContractor(record=null){
 editingContractor=record?.id||null;
 $('contractor-title').textContent=record?'Editar empreiteiro':'Novo empreiteiro';
 $('contractor-name').value=record?.name||'';
 $('contractor-note').value=record?.note||'';
 $('contractor-dialog').showModal();
}
function openEmployee(record=null){
 if(!state.contractors.length){say('Cadastre primeiro o empreiteiro.',true);return;}
 editingEmployee=record?.id||null;
 $('employee-title').textContent=record?'Editar funcionário':'Novo funcionário';
 const sel=$('employee-contractor');sel.replaceChildren();
 for(const c of state.contractors){const option=elem('option',c.name);option.value=c.id;sel.append(option);}
 sel.value=record?.contractorId||($('employee-filter').value!=='all'?$('employee-filter').value:state.contractors[0].id);
 sel.disabled=!!record;
 $('employee-name').value=record?.name||'';
 $('employee-role').value=record?.role||'';
 $('employee-status-row').hidden=!record;
 $('employee-status').value=record?.status||'active';
 $('employee-dialog').showModal();
}
function render(){
 const out=$('contractors');out.replaceChildren();
 if(!state.contractors.length)out.append(elem('p','Nenhum empreiteiro cadastrado.','empty'));
 for(const c of state.contractors){
  const row=elem('article',undefined,'entry');
  row.append(elem('strong',c.name,'contractor-name'));
  const count=state.employees.filter(x=>x.contractorId===c.id);
  row.append(elem('span',count.length+' funcionário(s) · '+count.filter(x=>x.status!=='terminated').length+' ativo(s)','row-subtitle'));
  if(c.note)row.append(elem('p',c.note,'row-subtitle'));
  const actions=elem('div',undefined,'entity-actions');
  actions.append(btn('Editar',()=>openContractor(c)));
  actions.append(btn('Excluir',()=>{
   if(!confirm('Excluir este empreiteiro da simulação?'))return;
   try{commit(engine.removeContractor(state,c.id));say('Empreiteiro excluído.');}catch(e){say(e.message,true);}
  },'danger'));
  row.append(actions);out.append(row);
 }
 const filter=$('employee-filter'),before=filter.value;
 filter.replaceChildren();
 const all=elem('option','Todos os empreiteiros');all.value='all';filter.append(all);
 for(const c of state.contractors){const option=elem('option',c.name);option.value=c.id;filter.append(option);}
 filter.value=before&&[...filter.options].some(x=>x.value===before)?before:'all';
 const list=$('employees');list.replaceChildren();
 if(!state.employees.length)list.append(elem('p','Nenhum funcionário cadastrado.','empty'));
 const ordered=state.employees.filter(x=>filter.value==='all'||x.contractorId===filter.value).sort((a,b)=>(a.status==='terminated')-(b.status==='terminated')||a.name.localeCompare(b.name,'pt-BR'));
 if(!ordered.length&&state.employees.length)list.append(elem('p','Nenhum funcionário deste empreiteiro.','empty'));
 for(const e of ordered){
  const row=elem('article',undefined,'entry');
  const head=elem('div',undefined,'employee-head');
  head.append(elem('strong',e.name,'contractor-name'));
  head.append(elem('span',e.status==='terminated'?'Desligado':'Ativo','employee-status '+(e.status==='terminated'?'inactive':'active')));
  row.append(head);
  row.append(elem('span',(e.role?e.role+' · ':'')+(state.contractors.find(x=>x.id===e.contractorId)?.name||'Empreiteiro indisponível'),'row-subtitle'));
  const actions=elem('div',undefined,'entity-actions');
  actions.append(btn('Editar',()=>openEmployee(e)));
  row.append(actions);list.append(row);
 }
 const legacy=$('legacy-teams');legacy.replaceChildren();
 if(!state.teams.length)legacy.append(elem('p','Nenhuma equipe antiga cadastrada.','empty'));
 for(const e of state.teams){const row=elem('article',undefined,'entry');
  row.append(elem('strong',e.name));row.append(elem('span',state.contractors.find(x=>x.id===e.contractorId)?.name||'Empreiteiro antigo indisponível','row-subtitle'));
  legacy.append(row);
 }
}
document.querySelectorAll('[data-close]').forEach(x=>x.addEventListener('click',()=>close(x.dataset.close)));
$('add-contractor').addEventListener('click',()=>openContractor());
$('add-employee').addEventListener('click',()=>openEmployee());
$('employee-filter').addEventListener('change',render);
$('contractor-form').addEventListener('submit',event=>{
 event.preventDefault();
 try{
  let next=state;
  if(editingContractor){
   next=engine.rename(state,'contractor',editingContractor,$('contractor-name').value);
   next.contractors.find(x=>x.id===editingContractor).note=$('contractor-note').value.trim().slice(0,500);
  }else next=engine.addContractor(state,{id:uid(),name:$('contractor-name').value,note:$('contractor-note').value});
  commit(next);close('contractor-dialog');say('Empreiteiro salvo neste navegador.');
 }catch(e){say(e.message,true);}
});
$('employee-form').addEventListener('submit',event=>{
 event.preventDefault();
 try{
  let next;
  if(editingEmployee){
   next=engine.updateEmployee(state,editingEmployee,{
    name:$('employee-name').value,role:$('employee-role').value,status:$('employee-status').value
   },localDate());
  }else next=engine.addEmployee(state,{
   id:uid(),contractorId:$('employee-contractor').value,name:$('employee-name').value,role:$('employee-role').value
  });
  commit(next);close('employee-dialog');say('Funcionário salvo. O histórico de situação foi preservado.');
 }catch(e){say(e.message,true);}
});
load();render();
})();