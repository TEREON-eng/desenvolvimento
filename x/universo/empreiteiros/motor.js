/* TEREON X — Cadastro Profissional experimental, sem acesso a Obras/Diário.
 * Registros locais; funcionários pertencem ao prestador e têm histórico de situação, sem identidade Auth. Equipes permanecem como dados legados.
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
 function addEmployee(data,record){
  const next=clone(data);
  if(!Array.isArray(next.employees))next.employees=[];
  if(!record||!clean(record.id)||!clean(record.name)||clean(record.name).length>120)
   throw Error('Informe nome válido do funcionário, com até 120 caracteres.');
  if(!next.contractors.some(x=>x.id===record.contractorId))throw Error('Empreiteiro não encontrado.');
  if(next.employees.some(x=>x.id===record.id))throw Error('Identificador de funcionário repetido.');
  next.employees.push({
   id:clean(record.id),name:clean(record.name),contractorId:record.contractorId,
   role:clean(record.role).slice(0,100),status:'active',statusHistory:[]
  });
  return next;
 }
 function updateEmployee(data,id,changes,changeAt){
  const next=clone(data),employee=(next.employees||[]).find(x=>x.id===id);
  if(!employee)throw Error('Funcionário não encontrado.');
  if(changes.name!==undefined){
   const title=clean(changes.name);
   if(!title||title.length>120)throw Error('Nome de funcionário inválido.');
   employee.name=title;
  }
  if(changes.role!==undefined){
   if(clean(changes.role).length>100)throw Error('Função excede 100 caracteres.');
   employee.role=clean(changes.role);
  }
  if(changes.status!==undefined){
   if(!['active','terminated'].includes(changes.status))throw Error('Situação inválida.');
   if(employee.status!==changes.status){
    if(!/^\\d{4}-\\d{2}-\\d{2}$/.test(changeAt||''))throw Error('Data da alteração obrigatória.');
    const d=new Date(changeAt+'T12:00:00Z');
    if(Number.isNaN(d.getTime())||d.toISOString().slice(0,10)!==changeAt)throw Error('Data da alteração inválida.');
    employee.statusHistory=Array.isArray(employee.statusHistory)?employee.statusHistory:[];
    employee.statusHistory.push({from:employee.status,to:changes.status,date:changeAt});
    employee.status=changes.status;
   }
  }
  return next;
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
  if(next.teams.some(x=>x.contractorId===id)||(next.employees||[]).some(x=>x.contractorId===id))throw Error('Empreiteiro possui equipes ou funcionários. Preserve os vínculos e o histórico.');
  const before=next.contractors.length;next.contractors=next.contractors.filter(x=>x.id!==id);
  if(before===next.contractors.length)throw Error('Prestador não encontrado.');
  return next;
 }
 function removeTeam(data,id){
  const next=clone(data),before=next.teams.length;next.teams=next.teams.filter(x=>x.id!==id);
  if(before===next.teams.length)throw Error('Equipe não encontrada.');
  return next;
 }
 return Object.freeze({version:1,addContractor,addTeam,addEmployee,updateEmployee,rename,removeContractor,removeTeam});
});
