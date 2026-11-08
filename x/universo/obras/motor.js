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
 const checkId=(id,label)=>{if(!UUID.test(clean(id)))throw Error(label+' inválido.');return clean(id);};
 const unpack=response=>{if(response.error)throw response.error;return response.data;};
 function validateWork(record){
  const name=clean(record?.name),description=clean(record?.description),status=record?.status||'planning';
  if(!name||name.length>160)throw Error('Informe um nome de obra de até 160 caracteres.');
  if(description.length>2000)throw Error('Descrição com mais de 2.000 caracteres.');
  if(!STATUS.includes(status))throw Error('Situação de obra inválida.');
  return {name,description,status};
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
    .select('id,owner_id,name,kind,created_at').eq('owner_id',uid).order('created_at',{ascending:true}));
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
    .select('id,owner_id,name,kind,created_at').single());
  }
  async function list(workspaceId){
   await userId();checkId(workspaceId,'Espaço');
   return unpack(await client.from('x_works').select('id,workspace_id,name,description,status,created_at')
    .eq('workspace_id',workspaceId).order('created_at',{ascending:false}));
  }
  async function createWork(workspaceId,record){
   await userId();checkId(workspaceId,'Espaço');
   const payload=validateWork(record);
   return unpack(await client.from('x_works')
    .insert({workspace_id:workspaceId,...payload})
    .select('id,workspace_id,name,description,status,created_at').single());
  }
  async function updateWork(workId,record){
   await userId();checkId(workId,'Obra');
   const payload=validateWork(record);
   const updated=unpack(await client.from('x_works')
    .update(payload).eq('id',workId)
    .select('id,workspace_id,name,description,status,created_at').maybeSingle());
   if(!updated)throw Error('Obra não encontrada ou você não possui permissão para editá-la.');
   return updated;
  }
  async function archive(workId,current){
   const value=validateWork({...current,status:'archived'});
   return updateWork(workId,value);
  }
  return Object.freeze({version:1,STATUS,spaces,createSpace,list,createWork,updateWork,archive});
 }
 return Object.freeze({version:1,STATUS,create,validateWork});
});
