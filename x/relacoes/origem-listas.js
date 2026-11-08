/* TEREON X · Adaptador de origem de Listas
 * Traduz o contrato do Motor de Listas para uma referência local identificada.
 * Não cria vínculo remoto e não altera Listas quando usado para consulta.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 root.TereonXListRelationsAdapter=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function create(listService){
  if(typeof listService?.get!=='function'||typeof listService?.ensureRecordUid!=='function')throw Error('Motor de Listas incompatível.');
  function reference(listId){
   const list=listService.get(listId);
   if(!list)throw Error('Lista não encontrada.');
   return Object.freeze({
    type:'list', source:'device', originId:list.id,
    recordUid:list.recordUid||null, synchronized:false, remoteLinkAllowed:false
   });
  }
  function prepare(listId){
   // Ação explícita; a persistência/rollback pertence ao Motor de Listas.
   listService.ensureRecordUid(listId);
   return reference(listId);
  }
  return Object.freeze({reference,prepare});
 }
 return Object.freeze({version:1,create});
});
