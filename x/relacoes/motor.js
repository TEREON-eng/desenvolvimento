/* TEREON X · Identidade e Relações v1
 * Serviço sem interface, sem acoplamento a Obras ou Listas.
 * Identidade remota para work e list online; fontes locais ainda não
 * são elegíveis a registro remoto.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 root.TereonXRelations=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
 const check=(value,name)=>{if(!UUID.test(String(value||'')))throw Error(name+' inválido.');return value;};
 const unpack=res=>{if(res.error)throw res.error;return res.data;};
 const TYPES=Object.freeze(['work','list']);
 const RELATIONS=Object.freeze(['related_to','derived_from']);
 function create(client){
  if(typeof client?.from!=='function'||typeof client?.auth?.getUser!=='function')throw Error('Cliente de relações inválido.');
  async function owner(){
   const res=await client.auth.getUser();
   if(res.error)throw res.error;
   const id=res.data?.user?.id;
   if(!id)throw Error('É necessário entrar na conta TEREON.');
   return check(id,'Usuário');
  }
  async function identityFor(type,originId){
   const userId=await owner();check(originId,'Identificador de origem');
   if(!TYPES.includes(type))throw Error('Este tipo ainda não possui integração de identidade autorizada.');
   const existing=unpack(await client.from('x_record_identities').select('id,owner_id,record_type,origin_id,created_at')
    .eq('record_type',type).eq('origin_id',originId).eq('owner_id',userId).maybeSingle());
   return existing||null;
  }
  async function register(type,originId){
   const userId=await owner();check(originId,'Identificador de origem');
   if(!TYPES.includes(type))throw Error('Tipo sem integração autorizada: '+type);
   const prior=await identityFor(type,originId);
   if(prior)return prior;
   const result=await client.from('x_record_identities').insert({owner_id:userId,record_type:type,origin_id:originId})
    .select('id,owner_id,record_type,origin_id,created_at').single();
   if(result.error?.code==='23505'){
    const concurrent=await identityFor(type,originId);
    if(concurrent)return concurrent;
   }
   return unpack(result);
  }
  async function relate(fromId,toId,relationType='related_to'){
   const userId=await owner();check(fromId,'Origem');check(toId,'Destino');
   if(fromId===toId)throw Error('Um registro não pode se relacionar consigo mesmo.');
   if(!RELATIONS.includes(relationType))throw Error('Tipo de relação inválido.');
   return unpack(await client.from('x_record_relations')
    .insert({owner_id:userId,from_record_id:fromId,to_record_id:toId,relation_type:relationType})
    .select('id,owner_id,from_record_id,to_record_id,relation_type,created_at,ended_at').single());
  }
  async function relations(recordId){
   const userId=await owner();check(recordId,'Registro');
   return unpack(await client.from('x_record_relations')
    .select('id,from_record_id,to_record_id,relation_type,created_at,ended_at')
    .eq('owner_id',userId).or('from_record_id.eq.'+recordId+',to_record_id.eq.'+recordId)
    .is('ended_at',null).order('created_at',{ascending:false}));
  }
  async function end(relationId){
   const userId=await owner();check(relationId,'Relação');
   const record=unpack(await client.from('x_record_relations').update({ended_at:new Date().toISOString()})
    .eq('id',relationId).eq('owner_id',userId).is('ended_at',null)
    .select('id,ended_at').maybeSingle());
   if(!record)throw Error('Relação não encontrada ou encerrada.');
   return record;
  }
  return Object.freeze({register,identityFor,relate,relations,end,version:1});
 }
 return Object.freeze({create,TYPES,RELATIONS,version:1});
});
