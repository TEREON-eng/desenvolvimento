/* TEREON X · Motor independente de apontamento diário de execução.
 * O planejamento fica intacto; cada confirmação é um evento auditável.
 */
(function(root,factory){
 const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;
 root.TereonXDiaryExecution=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const clone=x=>JSON.parse(JSON.stringify(x));
 const clean=x=>String(x??'').trim();
 const REASONS=Object.freeze([
  {id:'rain',label:'Chuva / condições climáticas'},
  {id:'absence',label:'Equipe não compareceu'},
  {id:'relocation',label:'Equipe deslocada para outro atendimento'},
  {id:'materials',label:'Falta de material'},
  {id:'access',label:'Sem acesso ou liberação'},
  {id:'other',label:'Outro motivo'}
 ]);
 const VALID=new Set(REASONS.map(x=>x.id));
 function validate(report,programs){
  if(!Array.isArray(programs))throw Error('Programações inválidas.');
  const program=programs.find(p=>p.id===report?.programId);
  if(!program)throw Error('Programação não encontrada.');
  const date=clean(report.date);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||date<program.startDate||date>program.endDate)
   throw Error('Selecione um dia pertencente à programação.');
  const status=report.status;
  if(status!=='executed'&&status!=='not_executed')throw Error('Informe se a atividade foi executada.');
  const completed=status==='executed'&&report.completed===true;
  const reason=status==='not_executed'?clean(report.reason):'';
  const note=clean(report.note);
  if(status==='not_executed'&&!VALID.has(reason))throw Error('Informe a justificativa para a não realização.');
  if(note.length>500)throw Error('Observação acima de 500 caracteres.');
  if(status==='not_executed'&&report.completed)throw Error('Atividade não realizada não pode ser concluída.');
  const id=clean(report.id),recordedAt=clean(report.recordedAt);
  if(!id||!recordedAt||Number.isNaN(Date.parse(recordedAt)))throw Error('Identificação e data de registro obrigatórias.');
  return {id,programId:program.id,workId:program.workId,teamId:program.teamId,date,status,completed,reason,note,recordedAt};
 }
 function record(history,report,programs){
  if(!Array.isArray(history))throw Error('Histórico inválido.');
  const next=validate(report,programs);
  if(programs.find(p=>p.id===next.programId)?.status==='cancelled')throw Error('Programação cancelada não admite novos apontamentos.');
  if(history.some(x=>x.id===next.id))throw Error('Identificador de apontamento repetido.');
  return [...clone(history),next];
 }
 function latest(history,programId,date){
  const found=(history||[]).filter(x=>x.programId===programId&&x.date===date);
  return found.length?clone(found[found.length-1]):null;
 }
 function forDay(history,programs,workId,date){
  return programs.filter(p=>p.workId===workId&&p.status!=='cancelled'&&p.startDate<=date&&p.endDate>=date)
   .map(program=>({programId:program.id,report:latest(history,program.id,date)}));
 }
 return Object.freeze({version:1,REASONS,validate,record,latest,forDay});
});
