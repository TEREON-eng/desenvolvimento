/* TEREON X — Cadastro Profissional experimental, sem acesso a Obras/Diário.
 * Registros locais; equipe referencia prestador por id, sem criar identidade Auth.
 */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;root.TereonXContractors=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const clean=x=>String(x??'').trim();
 const clone=x=>JSON.parse(JSON.stringify(x));
 function valid(record,kind){
  if(!record||!clean(record.id)||!clean(record.name)||clean(record.name).length>120)throw Error('Informe um nome de até 120 caracteres.');
  return {id:clean(record.id),name:clean(record.name),...kind==='contractor'?{note:clean(record.note).slice(0,500)}:{contractorId:clean(record.contractorId)}};
 }
 function addContractor(data,record){
  const next=clone(data),c=valid(record,'contractor');
  if(next.contractors.some(x=>x.id===c.id))throw Error('Identificador repetido.');
  next.contractors.push(c);return next;
 }
 function addTeam(data,record){
  const next=clone(data),t=valid(record,'team');
  if(!next.contractors.some(x=>x.id===t.contractorId))throw Error('Prestador não encontrado.');
  if(next.teams.some(x=>x.id===t.id))throw Error('Identificador repetido.');
  next.teams.push(t);return next;
 }
 function rename(data,type,id,name){
  const next=clone(data),items=type==='contractor'?next.contractors:type==='team'?next.teams:null;
  if(!items)throw Error('Tipo inválido.');
  const entity=items.find(x=>x.id===id);
  if(!entity)throw Error('Registro não encontrado.');
  if(!clean(name)||clean(name).length>120)throw Error('Nome inválido.');
  entity.name=clean(name);return next;
 }
 function removeContractor(data,id){
  const next=clone(data);
  if(next.teams.some(x=>x.contractorId===id))throw Error('Prestador possui equipes. Remova ou transfira as equipes primeiro.');
  const before=next.contractors.length;next.contractors=next.contractors.filter(x=>x.id!==id);
  if(before===next.contractors.length)throw Error('Prestador não encontrado.');
  return next;
 }
 function removeTeam(data,id){
  const next=clone(data),before=next.teams.length;next.teams=next.teams.filter(x=>x.id!==id);
  if(before===next.teams.length)throw Error('Equipe não encontrada.');
  return next;
 }
 return Object.freeze({version:1,addContractor,addTeam,rename,removeContractor,removeTeam});
});
