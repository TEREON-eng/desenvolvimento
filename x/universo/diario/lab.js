/* TEREON X · Diário de Obras: interface de laboratório mobile.
 * Dados de demonstração exclusivos deste navegador, nunca na nuvem.
 */
(function(){'use strict';
const engine=globalThis.TereonXDiaryPlanning;
const execution=globalThis.TereonXDiaryExecution;
const REPORT_KEY='tereon-x-diary-execution-simulation-v1';
const KEY='tereon-x-diary-simulation-v1';
const ctx={
 works:[{id:'wilson',name:'Wilson Rachid'},{id:'escola-x',name:'Escola X'}],
 contractors:[{id:'js',name:'Empreiteiro JS'},{id:'sol',name:'Empreiteira Solange'}],
 teams:[{id:'a-js',name:'Equipe A',contractorId:'js'},{id:'b-js',name:'Equipe B',contractorId:'js'},{id:'sol-a',name:'Equipe de campo',contractorId:'sol'}],
 nodes:[
  {id:'wr-rev',name:'Revisão elétrica',kind:'scope',workId:'wilson'},
  {id:'wr-quadros',name:'Quadros elétricos',kind:'stage',parentId:'wr-rev',workId:'wilson'},
  {id:'wr-qd1',name:'QD1',kind:'substage',parentId:'wr-quadros',workId:'wilson'},
  {id:'wr-qd2',name:'QD2',kind:'substage',parentId:'wr-quadros',workId:'wilson'},
  {id:'wr-ilum',name:'Iluminação — salas de aula',kind:'stage',parentId:'wr-rev',workId:'wilson'},
  {id:'wr-sala',name:'Sala 01',kind:'substage',parentId:'wr-ilum',workId:'wilson'},
  {id:'wr-spda',name:'SPDA',kind:'scope',workId:'wilson'},
  {id:'wr-entrada',name:'Entrada de energia',kind:'scope',workId:'wilson'},
  {id:'wr-abrigo',name:'Abrigo',kind:'stage',parentId:'wr-entrada',workId:'wilson'},
  {id:'wr-escav',name:'Escavação',kind:'stage',parentId:'wr-entrada',workId:'wilson'},
  {id:'ex-rev',name:'Revisão elétrica',kind:'scope',workId:'escola-x'},
  {id:'ex-quadros',name:'Quadros elétricos',kind:'stage',parentId:'ex-rev',workId:'escola-x'}
 ]
};
const $=id=>document.getElementById(id);
const labels={scope:'Escopo',stage:'Etapa',substage:'Subetapa'};
let entries=[],reports=[],reportingId=null;
function openEntry(){
 $('work').value=$('filter-work').value;
 targets();
 $('start').value=$('filter-date').value;
 $('end').value=$('filter-date').value;
 updateDates();
 $('entry-dialog').showModal();
}
function closeEntry(){if($('entry-dialog').open)$('entry-dialog').close();}
function say(message,error=false){$('message').textContent=message;$('message').classList.toggle('error',error);}
function fmt(date){const [y,m,d]=date.split('-');return d+'/'+m+'/'+y;}
function opt(value,label){const o=document.createElement('option');o.value=value;o.textContent=label;return o;}
function fill(select,items){select.replaceChildren(...items.map(x=>opt(x.value,x.label)));}
function load(){
 try{
  const raw=localStorage.getItem(KEY);
  if(!raw)return [];
  const parsed=JSON.parse(raw);
  if(!Array.isArray(parsed))throw Error('Dados incompatíveis');
  // Nunca enviar nada a outro motor; recuperar itens somente se válidos.
  return parsed.map(e=>engine.validate(e,ctx)).filter(e=>e.id);
 }catch(e){say('Não foi possível ler a simulação anterior: '+e.message,true);return [];}
}
function persist(next){
 const value=JSON.stringify(next);
 try{localStorage.setItem(KEY,value);}
 catch(e){throw Error('Não foi possível salvar no aparelho: '+e.message);}
 entries=next;
}

function loadReports(){
 try{
  const raw=localStorage.getItem(REPORT_KEY);
  if(!raw)return [];
  const saved=JSON.parse(raw);
  if(!Array.isArray(saved))throw Error('Histórico incompatível.');
  return saved.map(report=>execution.validate(report,entries));
 }catch(error){say('Histórico de execução não pôde ser carregado: '+error.message,true);return [];}
}
function reportReasonLabel(id){return execution.REASONS.find(x=>x.id===id)?.label||id;}
function reportControls(){
 const missing=$('report-status').value==='not_executed';
 $('completed-row').hidden=missing;
 $('reason-row').hidden=!missing;
 $('report-reason').required=missing;
 if(missing)$('report-completed').checked=false;
}
function showReport(programId){
 const program=entries.find(e=>e.id===programId);
 const date=$('filter-date').value;
 if(!program||program.status==='cancelled'||program.startDate>date||program.endDate<date){say('Programação não corresponde ao dia selecionado.',true);return;}
 reportingId=programId;
 const team=ctx.teams.find(t=>t.id===program.teamId);
 $('report-context').textContent=(team?.name||'Equipe')+' · '+fmt(date)+' · '+ctx.works.find(w=>w.id===program.workId)?.name;
 const prior=execution.latest(reports,programId,date);
 $('report-status').value=prior?.status||'executed';
 $('report-completed').checked=!!prior?.completed;
 $('report-reason').value=prior?.reason||'';
 $('report-note').value=prior?.note||'';
 reportControls();
 $('report-dialog').showModal();
}
function closeReport(){if($('report-dialog').open)$('report-dialog').close();reportingId=null;}
function onReport(e){
 e.preventDefault();
 const record={
  id:newId(),programId:reportingId,date:$('filter-date').value,
  status:$('report-status').value,completed:$('report-completed').checked,
  reason:$('report-reason').value,note:$('report-note').value,
  recordedAt:new Date().toISOString()
 };
 try{
  const next=execution.record(reports,record,entries);
  localStorage.setItem(REPORT_KEY,JSON.stringify(next));
  reports=next;closeReport();dayList();
  say('Apontamento registrado nesta simulação. A programação original foi preservada.');
 }catch(error){say('Não foi possível salvar o apontamento: '+error.message,true);}
}

function contractors(){fill($('contractor'),ctx.contractors.map(c=>({value:c.id,label:c.name})));}
function teams(){
 const c=$('contractor').value,all=ctx.teams.filter(x=>x.contractorId===c);
 const before=$('team').value;
 fill($('team'),all.map(t=>({value:t.id,label:t.name})));
 if(all.some(t=>t.id===before))$('team').value=before;
}
function targetLabel(n){
 const parent=ctx.nodes.find(x=>x.id===n.parentId);
 const grand=ctx.nodes.find(x=>x.id===parent?.parentId);
 return [grand?.name,parent?.name,n.name].filter(Boolean).join(' › ');
}
function targets(){
 const work=$('work').value;
 const nodes=ctx.nodes.filter(n=>n.workId===work);
 fill($('target'),[{value:'',label:'Obra inteira (sem escopo)'},...nodes.map(n=>({value:n.id,label:(labels[n.kind]||'Escopo')+' · '+targetLabel(n)}))]);
 $('target').value=nodes.find(n=>n.kind==='scope')?.id||'';
 updateDates();
}
function updateDates(){
 const node=ctx.nodes.find(n=>n.id===$('target').value);
 const single=node&&node.kind!=='scope';
 $('end').disabled=!!single;
 if(single)$('end').value=$('start').value;
 $('target-hint').textContent=single?
  'Etapa e subetapa: programação de um único dia. Para vários dias, selecione um Escopo ou a Obra.':
  'Obra ou Escopo: pode programar vários dias. Isto não confirma presença nem execução.';
}
function dayList(){
 const work=$('filter-work').value,date=$('filter-date').value;
 $('day-label').textContent='Programações previstas para '+fmt(date)+' · '+ctx.works.find(w=>w.id===work)?.name;
 const results=engine.consolidate(entries,work,date,ctx);
 $('entries').replaceChildren();
 if(!results.length){const p=document.createElement('p');p.className='empty';p.textContent='Nenhuma equipe programada para essa data.';$('entries').append(p);return;}
 for(const e of results){
  const card=document.createElement('article');card.className='entry';
  const title=document.createElement('strong');title.textContent=e.teamName+' · '+e.contractorName;
  const meta=document.createElement('div');meta.className='meta';meta.textContent=(labels[e.kind]||'Obra')+' · '+targetLabel(ctx.nodes.find(n=>n.id===e.nodeId)||{name:'Obra inteira'});
  const range=document.createElement('div');range.className='range';range.textContent=e.startDate===e.endDate?'Dia '+fmt(e.startDate):'Período '+fmt(e.startDate)+' até '+fmt(e.endDate);
  card.append(title,meta,range);
  if(e.note){const note=document.createElement('div');note.className='meta';note.textContent=e.note;card.append(note);}
  const actions=document.createElement('div');actions.className='entry-actions';
  const cancel=document.createElement('button');cancel.type='button';cancel.className='danger';cancel.textContent='Cancelar programação';
  cancel.addEventListener('click',()=>{
   if(!confirm('Cancelar esta programação? O registro será preservado na simulação.'))return;
   try{persist(engine.update(entries,e.id,{status:'cancelled'},ctx));dayList();say('Programação cancelada, sem apagar seu histórico.');}
   catch(error){say(error.message,true);}
  });
  const report=execution.latest(reports,e.id,date);
  const state=document.createElement('div');
  state.className='day-state '+(report?'day-state--'+report.status:'');
  state.textContent=!report?'Dia ainda não confirmado':
   report.status==='not_executed'?'Não realizada · '+reportReasonLabel(report.reason):
   report.completed?'Executada · Tarefa concluída':'Executada · Tarefa em andamento';
  card.append(state);
  if(report?.note){const reportNote=document.createElement('div');reportNote.className='meta';reportNote.textContent=report.note;card.append(reportNote);}
  const confirmDay=document.createElement('button');confirmDay.type='button';confirmDay.className='confirm-day';
  confirmDay.textContent=report?'Revisar registro do dia':'Registrar o dia';
  confirmDay.addEventListener('click',()=>showReport(e.id));
  actions.prepend(confirmDay);
  actions.append(cancel);card.append(actions);$('entries').append(card);
 }
}
function newId(){return globalThis.crypto?.randomUUID?.()||'sim-'+Date.now()+'-'+Math.random().toString(36).slice(2);}
function onSubmit(e){
 e.preventDefault();
 const record={workId:$('work').value,teamId:$('team').value,nodeId:$('target').value||null,
  startDate:$('start').value,endDate:$('end').disabled?$('start').value:$('end').value,note:$('note').value,status:'planned'};
 try{
  persist(engine.add(entries,record,ctx,newId()));
  $('filter-work').value=record.workId;$('filter-date').value=record.startDate;
  $('note').value='';closeEntry();dayList();say('Programação salva somente neste aparelho. Não confirma presença ou serviço executado.');
 }catch(error){say(error.message,true);}
}
function init(){
 entries=load();
 reports=loadReports();
 fill($('report-reason'),[{value:'',label:'Selecione o motivo'},...execution.REASONS.map(r=>({value:r.id,label:r.label}))]);
 fill($('work'),ctx.works.map(w=>({value:w.id,label:w.name})));
 fill($('filter-work'),ctx.works.map(w=>({value:w.id,label:w.name})));
 contractors();
 $('work').value='wilson';$('contractor').value='js';teams();$('team').value='a-js';
 $('start').value='2026-11-17';$('end').value='2026-11-20';
 $('filter-work').value='wilson';$('filter-date').value='2026-11-17';
 targets();
 $('contractor').addEventListener('change',teams);
 $('work').addEventListener('change',targets);
 $('target').addEventListener('change',updateDates);
 $('start').addEventListener('change',updateDates);
 $('filter-work').addEventListener('change',dayList);
 $('filter-date').addEventListener('change',dayList);
 $('entry-form').addEventListener('submit',onSubmit);
 $('report-status').addEventListener('change',reportControls);
 $('report-form').addEventListener('submit',onReport);
 $('close-report').addEventListener('click',closeReport);
 $('cancel-report').addEventListener('click',closeReport);
 $('report-dialog').addEventListener('click',e=>{if(e.target===$('report-dialog'))closeReport();});
 $('open-entry').addEventListener('click',openEntry);
 $('close-entry').addEventListener('click',closeEntry);
 $('entry-dialog').addEventListener('click',e=>{if(e.target===$('entry-dialog'))closeEntry();});
 $('clear').addEventListener('click',()=>{$('note').value='';$('start').value='2026-11-17';$('end').value='2026-11-20';updateDates();say('Campos redefinidos. Programações existentes preservadas.');});
 $('reset').addEventListener('click',()=>{
  if(!confirm('Limpar apenas os registros fictícios deste laboratório neste navegador?'))return;
  try{localStorage.removeItem(REPORT_KEY);persist([]);reports=[];dayList();say('Programações e apontamentos de demonstração apagados deste navegador.');}catch(error){say(error.message,true);}
 });
 dayList();
}
init();
})();