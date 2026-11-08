/* TEREON X · Listas na Nuvem v1
 * Laboratório isolado. Somente a nuvem é acessada aqui; não importa ou
 * sobrescreve listas do dispositivo sem confirmação explícita.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 root.TereonXCloudLists=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
 const clone=data=>JSON.parse(JSON.stringify(data));
 const unpack=result=>{if(result.error)throw result.error;return result.data};
 const trim=v=>String(v??'').trim();
 function validate(data){
  const name=trim(data?.name);
  if(!name||name.length>160)throw Error('Informe o nome da lista (até 160 caracteres).');
  const items=clone(data?.items??[]),stages=clone(data?.stages??[]);
  if(!Array.isArray(items)||items.length>300||!Array.isArray(stages))throw Error('Formato de lista inválido ou limite de 300 materiais excedido.');
  for(const item of items){
   if(!item||typeof item!=='object'||!trim(item.name)||!Number.isFinite(Number(item.qty))||!(Number(item.qty)>0)||!trim(item.unit))throw Error('Lista contém material inválido.');
  }
  if(stages.some(s=>typeof s!=='string'))throw Error('Etapa inválida.');
  if(JSON.stringify(items).length+JSON.stringify(stages).length>110000)throw Error('Lista excede o limite de armazenamento deste laboratório.');
  return {name,items,stages};
 }
 function create(client){
  if(!client?.auth?.getUser||typeof client.from!=='function')throw Error('Conexão de listas inválida.');
  async function userId(){
   const response=await client.auth.getUser();
   if(response.error)throw response.error;
   if(!response.data?.user?.id)throw Error('Entre na sua conta TEREON para usar as listas na nuvem.');
   return response.data.user.id;
  }
  const fields='id,owner_id,name,items,stages,version,created_at,updated_at';
  async function list(){
   const uid=await userId();
   return unpack(await client.from('x_cloud_lists').select(fields).eq('owner_id',uid).order('updated_at',{ascending:false}));
  }
  async function get(id){
   const uid=await userId();
   if(!UUID.test(id))throw Error('Lista inválida.');
   const result=unpack(await client.from('x_cloud_lists').select(fields).eq('id',id).eq('owner_id',uid).maybeSingle());
   if(!result)throw Error('Lista não encontrada ou sem permissão.');
   return result;
  }
  async function createList(data){
   const uid=await userId(),payload=validate(data);
   if(data?.id!=null){
    if(!UUID.test(String(data.id)))throw Error('Identificador de lista inválido.');
    payload.id=String(data.id);
   }
   return unpack(await client.from('x_cloud_lists').insert({...payload,owner_id:uid}).select(fields).single());
  }
  async function updateList(id,version,data){
   const uid=await userId();
   if(!UUID.test(id)||!Number.isSafeInteger(version)||version<1)throw Error('Referência ou versão de lista inválida.');
   const payload=validate(data);
   const updated=unpack(await client.from('x_cloud_lists').update(payload).eq('id',id).eq('owner_id',uid).eq('version',version).select(fields).maybeSingle());
   if(!updated)throw Error('Esta lista foi modificada em outro aparelho. Atualize antes de salvar para não sobrescrever alterações.');
   return updated;
  }
  return Object.freeze({list,get,createList,updateList,version:1});
 }
 return Object.freeze({create,validate,version:1});
});
