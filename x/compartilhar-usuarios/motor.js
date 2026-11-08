/* TEREON X · Compartilhar entre usuários v1.
 * Recebe snapshot de Listas; sem DOM, catálogo, PDF ou alteração da origem.
 * Servidor mantém cópia com RLS. O destinatário lê, aceita ou recusa.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined' && module.exports) module.exports=api;
 root.TereonXUserShares=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const uuidPattern=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
 const clean=x=>String(x??'').trim();
 const copy=x=>JSON.parse(JSON.stringify(x));
 function prepareSnapshot(list){
  if(!list||typeof list!=='object'||!Array.isArray(list.items))throw Error('Lista incompatível.');
  const name=clean(list.name);
  if(!name||name.length>160)throw Error('Nome da lista inválido.');
  if(!list.items.length||list.items.length>300)throw Error('A lista deve ter de 1 a 300 itens.');
  const items=list.items.map((item,i)=>{
   if(!item||!clean(item.name)||!(Number(item.qty)>0)||!Number.isFinite(Number(item.qty))||!clean(item.unit))throw Error('Material inválido na linha '+(i+1)+'.');
   const values=item.values&&typeof item.values==='object'&&!Array.isArray(item.values)?copy(item.values):{};
   return {
    id:clean(item.id||String(i+1)),
    name:clean(item.name), qty:Number(item.qty),
    unit:clean(item.unit),stage:clean(item.stage||'Geral'),
    catalogId:clean(item.catalogId),values
   };
  });
  const snapshot={
   schema_version:1,source_list_id:clean(list.id),
   name,stages:Array.isArray(list.stages)?list.stages.map(clean):[],
   items
  };
  const serialized=JSON.stringify(snapshot);
  if(serialized.length>100000)throw Error('Lista muito grande para compartilhar nesta versão.');
  return copy(snapshot);
 }
 function create(client){
  if(!client||!client.auth||typeof client.from!=='function')throw Error('Conexão de compartilhamento indisponível.');
  async function currentUser(){
   const result=await client.auth.getUser();
   if(result.error)throw result.error;
   if(!result.data||!result.data.user)throw Error('Entre na sua conta TEREON para compartilhar.');
   return result.data.user.id;
  }
  function resultOrThrow(result){
   if(result.error)throw result.error;
   return result.data;
  }
  async function send(recipientId,sourceList){
   const sender=await currentUser();
   const recipient=clean(recipientId).toLowerCase();
   if(!uuidPattern.test(recipient))throw Error('Informe o identificador válido do destinatário.');
   if(recipient===sender.toLowerCase())throw Error('Você não pode enviar uma lista para si mesmo.');
   const snapshot=prepareSnapshot(sourceList);
   const q=await client.from('x_list_shares')
    .insert({sender_user_id:sender,recipient_user_id:recipient,list_snapshot:snapshot})
    .select('id,status,created_at').single();
   return resultOrThrow(q);
  }
  async function inbox(){
   const user=await currentUser();
   const q=await client.from('x_list_shares')
    .select('id,sender_user_id,list_snapshot,status,created_at,changed_at')
    .eq('recipient_user_id',user).order('created_at',{ascending:false});
   return resultOrThrow(q);
  }
  async function outbox(){
   const user=await currentUser();
   const q=await client.from('x_list_shares')
    .select('id,recipient_user_id,list_snapshot,status,created_at,changed_at')
    .eq('sender_user_id',user).order('created_at',{ascending:false});
   return resultOrThrow(q);
  }
  async function respond(shareId,choice){
   const user=await currentUser();
   if(!uuidPattern.test(clean(shareId)))throw Error('Compartilhamento inválido.');
   if(!['accepted','declined'].includes(choice))throw Error('Resposta inválida.');
   const q=await client.from('x_list_shares').update({status:choice})
    .eq('id',shareId).eq('recipient_user_id',user).eq('status','pending')
    .select('id,status').maybeSingle();
   const data=resultOrThrow(q);
   if(!data)throw Error('Convite indisponível ou já respondido.');
   return data;
  }
  async function revoke(shareId){
   const user=await currentUser();
   if(!uuidPattern.test(clean(shareId)))throw Error('Compartilhamento inválido.');
   const q=await client.from('x_list_shares').update({status:'revoked'})
    .eq('id',shareId).eq('sender_user_id',user).in('status',['pending','accepted'])
    .select('id,status').maybeSingle();
   const data=resultOrThrow(q);
   if(!data)throw Error('Compartilhamento indisponível ou já encerrado.');
   return data;
  }
  return Object.freeze({version:1,send,inbox,outbox,respond,revoke,prepareSnapshot,currentUser});
 }
 return Object.freeze({version:1,create,prepareSnapshot});
});
