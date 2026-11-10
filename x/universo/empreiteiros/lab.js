/* TEREON X — laboratório local de Empreiteiros e Equipes */
(function(){'use strict';
const engine=globalThis.TereonXContractors,$=id=>document.getElementById(id),KEY='tereon-x-contractors-simulation-v1';
let state={contractors:[],teams:[]};
function say(v,error=false){$('message').textContent=v;$('message').classList.toggle('error',error)}
function uid(){return globalThis.crypto?.randomUUID?.()||'sim-'+Date.now()+'-'+Math.random().toString(36).slice(2)}
function load(){try{const r=localStorage.getItem(KEY);if(!r)return;const v=JSON.parse(r);if(!Array.isArray(v.contractors)||!Array.isArray(v.teams))throw Error('Formato inválido.');state=v;}catch(e){say('Não foi possível recuperar dados locais: '+e.message,true)}}
function commit(next){localStorage.setItem(KEY,JSON.stringify(next));state=next;render()}
function elem(tag,text,className){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el}
function btn(text,fn,cls='secondary'){const b=elem('button',text,cls);b.type='button';b.addEventListener('click',fn);return b}
function close(id){const d=$(id);if(d.open)d.close()}
function hasDiaryReference(teamId){
 // Guarda de simulação. A futura regra ficará no motor de Relações/Alocações,
 // com histórico versionado e integridade no banco, não em chaves de navegador.
 try{
  const raw=localStorage.getItem('tereon-x-diary-simulation-v1');
  if(!raw)return false;
  const records=JSON.parse(raw);
  if(!Array.isArray(records))throw Error('Programações locais inválidas.');
  return records.some(p=>p?.teamId===teamId);
 }catch(error){throw Error('Não foi possível verificar referências no Diário. Exclusão bloqueada para preservar histórico.');}
}
function render(){
 const target=$('contractors');target.replaceChildren();
 if(!state.contractors.length)target.append(elem('p','Nenhum empreiteiro cadastrado neste navegador.','empty'));
 for(const contractor of state.contractors){
  const row=elem('article',undefined,'entry');
  row.append(elem('strong',contractor.name,'contractor-name'));
  if(contractor.note)row.append(elem('div',contractor.note,'row-subtitle'));
  const related=state.teams.filter(x=>x.contractorId===contractor.id);
  row.append(elem('div',related.length+' equipe(s)','row-subtitle'));
  const actions=elem('div',undefined,'entity-actions');
  actions.append(btn('Renomear',()=>{
   const name=prompt('Nome do prestador:',contractor.name);if(name===null)return;
   try{commit(engine.rename(state,'contractor',contractor.id,name));say('Empreiteiro atualizado.')}catch(e){say(e.message,true)}
  }));
  actions.append(btn('Excluir',()=>{
   if(!confirm('Excluir este empreiteiro da simulação?'))return;
   try{commit(engine.removeContractor(state,contractor.id));say('Empreiteiro excluído.')}catch(e){say(e.message,true)}
  },'danger'));
  row.append(actions);target.append(row);
 }
 const teams=$('teams');teams.replaceChildren();
 if(!state.teams.length)teams.append(elem('p','Nenhuma equipe cadastrada.','empty'));
 for(const team of state.teams){
  const row=elem('article',undefined,'entry');
  row.append(elem('strong',team.name,'contractor-name'));
  row.append(elem('span',state.contractors.find(x=>x.id===team.contractorId)?.name||'Prestador não localizado','row-subtitle'));
  const actions=elem('div',undefined,'entity-actions');
  actions.append(btn('Renomear',()=>{
   const name=prompt('Nome da equipe:',team.name);if(name===null)return;
   try{commit(engine.rename(state,'team',team.id,name));say('Equipe atualizada.')}catch(e){say(e.message,true)}
  }));
  actions.append(btn('Excluir',()=>{
   try{
    if(hasDiaryReference(team.id))throw Error('Equipe usada no Diário. Preserve o histórico antes de remover; prefira renomear.');
    if(!confirm('Excluir equipe nesta simulação?'))return;
    commit(engine.removeTeam(state,team.id));say('Equipe excluída.');
   }catch(e){say(e.message,true)}
  },'danger'));
  row.append(actions);teams.append(row);
 }
}
$('add-contractor').addEventListener('click',()=>{$('contractor-name').value='';$('contractor-note').value='';$('contractor-dialog').showModal()});
$('add-team').addEventListener('click',()=>{
 if(!state.contractors.length){say('Cadastre primeiro o empreiteiro.',true);return}
 const sel=$('team-contractor');
 sel.replaceChildren(...state.contractors.map(x=>{const o=document.createElement('option');o.value=x.id;o.textContent=x.name;return o}));
 $('team-name').value='';$('team-dialog').showModal();
});
document.querySelectorAll('[data-close]').forEach(btn=>btn.addEventListener('click',()=>close(btn.dataset.close)));
$('contractor-form').addEventListener('submit',e=>{
 e.preventDefault();
 try{commit(engine.addContractor(state,{id:uid(),name:$('contractor-name').value,note:$('contractor-note').value}));close('contractor-dialog');say('Empreiteiro cadastrado somente neste navegador.')}catch(err){say(err.message,true)}
});
$('team-form').addEventListener('submit',e=>{
 e.preventDefault();
 try{commit(engine.addTeam(state,{id:uid(),name:$('team-name').value,contractorId:$('team-contractor').value}));close('team-dialog');say('Equipe cadastrada somente neste navegador.')}catch(err){say(err.message,true)}
});
load();render();
})();