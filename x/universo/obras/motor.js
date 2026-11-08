/* TEREON X · Motor independente de Obras v1. Sem DOM nem Listas.
 * Cliente injetado. O banco aplica RLS e limites dos campos.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 root.TereonXWorks=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const STATUS=Object.freeze(['planning','active','paused','completed','archived']);
 const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
 const clean=value=>String(value??'').trim();
 const dateOrNull=value=>{
  const d=clean(value);if(!d)return null;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(d)||Number.isNaN(Date.parse(d+'T12:00:00Z'))||new Date(d+'T12:00:00Z').toISOString().slice(0,10)!==d)throw Error('Data inválida.');
  return d;
 };
 const checkId=(id,label)=>{if(!UUID.test(clean(id)))throw Error(label+' inválido.');return clean(id);};
 const unpack=response=>{if(response.error)throw response.error;return response.data;};
 function validateWork(record){
  const name=clean(record?.name),description=clean(record?.description),status=record?.status||'planning';
  if(!name||name.length>160)throw Error('Informe um nome de obra de até 160 caracteres.');
  if(description.length>2000)throw Error('Descrição com mais de 2.000 caracteres.');
  if(!STATUS.includes(status))throw Error('Situação de obra inválida.');
  const planned_start=dateOrNull(record?.planned_start),planned_end=dateOrNull(record?.planned_end);
  if(planned_start&&planned_end&&planned_end<planned_start)throw Error('A data prevista de término não pode ser anterior ao início.');
  return {name,description,status,planned_start,planned_end};
 }
 function create(client){
  if(!client?.auth?.getUser||typeof client.from!=='function')throw Error('Cliente de Obras inválido.');
  async function userId(){
   const response=await client.auth.getUser();
   if(response.error)throw response.error;
   if(!response.data?.user?.id)throw Error('Entre na sua conta TEREON para gerenciar obras.');
   return response.data.user.id;
  }
  async function spaces(){
   const uid=await userId();
   const owned=unpack(await client.from('x_workspaces')
    .select('id,owner_id,name,kind,created_at,deleted_at').eq('owner_id',uid).is('deleted_at',null).order('created_at',{ascending:true}));
   // A primeira versão só administra espaços do próprio dono.
   // Espaços em que o usuário é colaborador serão exibidos na etapa de convites.
   return owned;
  }
  async function createSpace(name,kind='personal'){
   const uid=await userId(),value=clean(name);
   if(!value||value.length>120)throw Error('Informe um nome de espaço de até 120 caracteres.');
   if(!['personal','organization'].includes(kind))throw Error('Tipo de espaço inválido.');
   return unpack(await client.from('x_workspaces')
    .insert({owner_id:uid,name:value,kind})
    .select('id,owner_id,name,kind,created_at,deleted_at').single());
  }
  const fields='id,workspace_id,name,description,status,planned_start,planned_end,created_at,deleted_at';
  async function listAll(){
   await userId();
   return unpack(await client.from('x_works').select(fields).is('deleted_at',null).order('created_at',{ascending:false}));
  }
  async function list(workspaceId){
   await userId();checkId(workspaceId,'Espaço');
   return unpack(await client.from('x_works').select(fields)
    .eq('workspace_id',workspaceId).is('deleted_at',null).order('created_at',{ascending:false}));
  }
  async function createWork(workspaceId,record){
   await userId();checkId(workspaceId,'Espaço');
   const payload=validateWork(record);
   return unpack(await client.from('x_works')
    .insert({workspace_id:workspaceId,...payload})
    .select(fields).single());
  }
  async function updateWork(workId,record){
   await userId();checkId(workId,'Obra');
   const payload=validateWork(record);
   const updated=unpack(await client.from('x_works')
    .update(payload).eq('id',workId).is('deleted_at',null)
    .select(fields).maybeSingle());
   if(!updated)throw Error('Obra não encontrada ou você não possui permissão para editá-la.');
   return updated;
  }
  async function archive(workId,current){
   const value=validateWork({...current,status:'archived'});
   return updateWork(workId,value);
  }
  async function updateSpace(spaceId,name){
   const uid=await userId(),id=checkId(spaceId,'Espaço'),value=clean(name);
   if(!value||value.length>120)throw Error('Informe um nome de espaço de até 120 caracteres.');
   const updated=unpack(await client.from('x_workspaces').update({name:value})
     .eq('id',id).eq('owner_id',uid).is('deleted_at',null)
     .select('id,owner_id,name,kind,created_at,deleted_at').maybeSingle());
   if(!updated)throw Error('Espaço não encontrado ou sem permissão de edição.');
   return updated;
  }
  async function removeWork(workId){
   const id=checkId(workId,'Obra');await userId();
   const result=unpack(await client.from('x_works').update({deleted_at:new Date().toISOString()})
     .eq('id',id).is('deleted_at',null).select('id').maybeSingle());
   if(!result)throw Error('Obra não encontrada ou já excluída.');
   return result;
  }
  async function removeSpace(spaceId){
   const uid=await userId(),id=checkId(spaceId,'Espaço');
   const result=unpack(await client.from('x_workspaces').update({deleted_at:new Date().toISOString()})
     .eq('id',id).eq('owner_id',uid).is('deleted_at',null).select('id').maybeSingle());
   if(!result)throw Error('Espaço não encontrado ou já excluído.');
   return result;
  }
  async function trash(type,workspaceId){
   const uid=await userId();
   if(type==='spaces')return unpack(await client.from('x_workspaces')
     .select('id,name,kind,deleted_at').eq('owner_id',uid).not('deleted_at','is',null).order('deleted_at',{ascending:false}));
   if(type==='works'){checkId(workspaceId,'Espaço');return unpack(await client.from('x_works')
     .select('id,workspace_id,name,deleted_at').eq('workspace_id',workspaceId).not('deleted_at','is',null).order('deleted_at',{ascending:false}));}
   throw Error('Tipo de lixeira inválido.');
  }
  async function restore(type,id){
   await userId();checkId(id,'Registro');
   if(type!=='spaces'&&type!=='works')throw Error('Tipo de registro inválido.');
   const table=type==='spaces'?'x_workspaces':'x_works';
   const result=unpack(await client.from(table).update({deleted_at:null})
      .eq('id',id).not('deleted_at','is',null).select('id').maybeSingle());
   if(!result)throw Error('Registro não encontrado ou sem permissão para restaurar.');
   return result;
  }
  return Object.freeze({version:3,STATUS,spaces,createSpace,updateSpace,list,listAll,createWork,updateWork,archive,removeWork,removeSpace,trash,restore});
 }
 return Object.freeze({version:3,STATUS,create,validateWork});
});
