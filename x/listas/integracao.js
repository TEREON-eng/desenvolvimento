/* TEREON X · Integração de armazenamento do Motor Único de Listas.
 * Um repositório síncrono (UI existente) + envio assíncrono à nuvem.
 * A cache é segregada por usuário. Não envia listas avulsas sem consentimento.
 */
(function(root,factory){
 const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;root.TereonXListIntegration=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const clone=x=>JSON.parse(JSON.stringify(x));
 const comparable=x=>JSON.stringify([x.name,x.items,x.stages]);
 const fromRemote=(r,existing)=>({
  id:existing?.id||r.id,recordUid:r.id,name:r.name,items:clone(r.items),stages:clone(r.stages),
  cloudVersion:r.version,cloudPending:false,cloudConflict:false
 });
 function create({store,cloud,onStatus=()=>{}}){
  if(!store?.snapshot||!store?.save||!cloud?.list||!cloud?.createList||!cloud?.updateList)throw Error('Integração de listas inválida.');
  let started=false,working=null,disposed=false,failed='';
  const report=()=>{
   if(disposed)return;
   const data=store.snapshot(),pending=data.lists.filter(x=>x.cloudPending).length;
   onStatus({pending,conflicts:data.lists.filter(x=>x.cloudConflict).length,working:!!working,error:failed,ready:started});
  };
  const repository={
   snapshot:()=>store.snapshot(),
   save(next){
    if(disposed)throw Error('Conta alterada. Reabra suas listas.');
    if(!started)throw Error('Aguarde o carregamento das listas da conta.');
    const previous=store.snapshot(),old=new Map(previous.lists.map(x=>[x.id,x]));
    const candidate=clone(next);
    for(const item of candidate.lists){
     const before=old.get(item.id);
     if(!before||comparable(item)!==comparable(before)){
      item.cloudPending=true;item.cloudConflict=!!before?.cloudConflict;
      if(!item.recordUid)throw Error('Esta lista precisa de uma identidade técnica.');
     }
    }
    store.save(candidate);
    report();
    queueMicrotask(()=>{flush().catch(e=>{failed=e.message;report()})});
   }
  };
  async function refresh(){
   if(disposed)return;
   const remote=await cloud.list();
   if(disposed)return;
   const state=store.snapshot(),byUid=new Map(state.lists.map(x=>[x.recordUid,x]));
   for(const r of remote){
    const before=byUid.get(r.id);
    if(before?.cloudPending){
     if(before.cloudVersion&&before.cloudVersion!==r.version)before.cloudConflict=true;
     continue;
    }
    const fresh=fromRemote(r,before);
    if(before)Object.assign(before,fresh);
    else state.lists.push(fresh);
   }
   // Se um registro da conta não veio do servidor, não apagar seu cache.
   store.save(state);started=true;failed='';report();
   await flush();
  }
  async function flush(){
   if(disposed||!started)return;
   if(working)return working;
   working=(async()=>{
    while(!disposed){
     const entries=store.snapshot().lists.filter(x=>x.cloudPending&&!x.cloudConflict);
     if(!entries.length)break;
     for(const entry of entries){
     if(disposed)return;
     const uid=entry.recordUid;
     const payload={id:uid,name:entry.name,items:clone(entry.items),stages:clone(entry.stages)};
     let saved;
     try{
      if(entry.cloudVersion){
       saved=await cloud.updateList(uid,entry.cloudVersion,payload);
      }else{
       try{saved=await cloud.createList(payload)}
       catch(e){
        if(e.code!=='23505')throw e;
        // Resposta perdida após INSERT: só confirmar se o conteúdo remoto for idêntico.
        const existing=await cloud.get(uid);
        if(comparable(existing)!==comparable(payload))throw Error('Já existe uma lista online com essa identidade e conteúdo diferente.');
        saved=existing;
       }
      }
     }catch(e){
      const state=store.snapshot(),current=state.lists.find(x=>x.recordUid===uid);
      if(current&&/modificada em outro aparelho|conteúdo diferente/i.test(e.message))current.cloudConflict=true;
      if(current)store.save(state);
      failed=e.message||String(e);report();return;
     }
     if(disposed)return;
     const state=store.snapshot(),current=state.lists.find(x=>x.recordUid===uid);
     if(!current)continue;
     const unchanged=comparable(current)===comparable(payload);
     current.cloudVersion=saved.version;
     current.cloudPending=!unchanged;
     current.cloudConflict=false;
     store.save(state);
    }
    failed='';
   })();
   report();
   try{await working}finally{working=null;report()}
  }
  function status(){
   const all=store.snapshot().lists;return {pending:all.filter(x=>x.cloudPending).length,conflicts:all.filter(x=>x.cloudConflict).length,working:!!working,error:failed,ready:started};
  }
  function stop(){disposed=true}
  return Object.freeze({repository,refresh,flush,status,stop});
 }
 return Object.freeze({create,version:1});
});
