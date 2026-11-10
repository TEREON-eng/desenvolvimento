/* TEREON X · Diário / programação de equipes — motor puro v1.
 * Não autoriza acesso, não afirma presença/execução e não escreve em outros motores.
 */
(function(root,factory){
 const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;
 root.TereonXDiaryPlanning=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const clean=x=>String(x??'').trim();
 const copy=x=>JSON.parse(JSON.stringify(x));
 const day=s=>{
  if(!/^\d{4}-\d{2}-\d{2}$/.test(clean(s)))throw Error('Informe uma data válida.');
  const d=new Date(clean(s)+'T12:00:00Z');
  if(Number.isNaN(d.getTime())||d.toISOString().slice(0,10)!==s)throw Error('Data inválida.');
  return s;
 };
 function validate(entry,ctx){
  if(!entry||!ctx||!Array.isArray(ctx.works)||!Array.isArray(ctx.teams)||!Array.isArray(ctx.nodes))throw Error('Contexto de programação inválido.');
  const work=ctx.works.find(w=>w.id===entry.workId);
  const team=ctx.teams.find(t=>t.id===entry.teamId);
  if(!work||!team)throw Error('Escolha obra e equipe cadastradas nesta simulação.');
  const scopeNode=entry.nodeId?ctx.nodes.find(n=>n.id===entry.nodeId):null;
  if(entry.nodeId&&(!scopeNode||scopeNode.workId!==work.id||scopeNode.archived))throw Error('Escopo não pertence à obra ou está arquivado.');
  const type=scopeNode?.kind||'work';
  const start=day(entry.startDate),end=day(entry.endDate||entry.startDate);
  if(end<start)throw Error('Término anterior ao início.');
  if((type==='stage'||type==='substage')&&end!==start)
   throw Error('Etapa ou subetapa admite somente um dia por lançamento; use Escopo para vários dias.');
  const note=clean(entry.note);
  if(note.length>500)throw Error('Observação acima de 500 caracteres.');
  const status=entry.status||'planned';
  if(!['planned','cancelled'].includes(status))throw Error('Situação de programação inválida.');
  return {id:clean(entry.id),workId:work.id,teamId:team.id,nodeId:scopeNode?.id||null,
   startDate:start,endDate:end,note,status};
 }
 function create(entry,ctx,id){
  const record=validate({...entry,id:id||entry.id},ctx);
  if(!record.id)throw Error('Identificador da programação obrigatório.');
  return record;
 }
 function add(entries,entry,ctx,id){
  if(!Array.isArray(entries))throw Error('Programações inválidas.');
  const record=create(entry,ctx,id);
  if(entries.some(e=>e.id===record.id))throw Error('Programação já cadastrada.');
  return [...copy(entries),record];
 }
 function update(entries,id,changes,ctx){
  if(!Array.isArray(entries))throw Error('Programações inválidas.');
  const current=entries.find(e=>e.id===id);
  if(!current)throw Error('Programação não encontrada.');
  const next=create({...current,...changes,id},ctx,id);
  return entries.map(e=>e.id===id?next:copy(e));
 }
 function forDay(entries,workId,date){
  const when=day(date);
  return copy(entries.filter(e=>e.workId===workId&&e.startDate<=when&&e.endDate>=when&&e.status!=='cancelled'));
 }
 function entriesForDate(entries,workId,date){return forDay(entries,workId,date);}
 function consolidate(entries,workId,date,ctx){
  const planned=forDay(entries,workId,date);
  return planned.map(e=>{
   const team=ctx.teams.find(t=>t.id===e.teamId);
   const contractor=ctx.contractors.find(p=>p.id===team?.contractorId);
   const node=ctx.nodes.find(n=>n.id===e.nodeId);
   return {...e,teamName:team?.name||'Equipe',contractorName:contractor?.name||'Prestador',
    targetName:node?.name||'Obra inteira',kind:node?.kind||'work'};
  });
 }
 return Object.freeze({version:1,validate,create,add,update,forDay,entriesForDate,consolidate});
});
