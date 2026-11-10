/* TEREON X — laboratório puro de sugestões de etapas hierárquicas.
 * NÃO vincula Listas/Obras, não escreve no banco nem infere aprovação.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 root.TereonXWorkStageSuggestions=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const clean=value=>String(value??'').trim();
 const key=value=>clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
 function indexStages(stages){
  if(!Array.isArray(stages))throw Error('Etapas da obra inválidas.');
  const byId=new Map();
  for(const stage of stages){
   if(!stage||!clean(stage.id)||!clean(stage.name)||byId.has(stage.id))throw Error('Etapas com identidade inválida.');
   byId.set(stage.id,stage);
  }
  for(const stage of stages){
   const seen=new Set([stage.id]);let parent=stage.parentId||null;
   while(parent){
    if(!byId.has(parent))throw Error('Etapa com pai ausente.');
    if(seen.has(parent))throw Error('Hierarquia cíclica.');
    seen.add(parent);parent=byId.get(parent).parentId||null;
   }
  }
  return byId;
 }
 function paths(stages){
  const byId=indexStages(stages);
  return stages.map(stage=>{
   let current=stage,labels=[];
   while(current){labels.unshift(clean(current.name));current=current.parentId?byId.get(current.parentId):null;}
   return {id:stage.id,parentId:stage.parentId||null,label:labels.join(' › '),name:clean(stage.name)};
  });
 }
 function suggest(stages,listStageNames){
  if(!Array.isArray(listStageNames))throw Error('Etapas de lista inválidas.');
  const available=paths(stages);
  const seen=new Set(),suggestions=[];
  for(const value of listStageNames){
   const name=clean(value),k=key(name);
   if(!k||seen.has(k))continue;seen.add(k);
   const exact=available.filter(s=>key(s.name)===k);
   suggestions.push({
    name,
    matches:exact.map(s=>({id:s.id,label:s.label})),
    action:'confirmation_required',
    autoCreate:false,autoLink:false
   });
  }
  return {available,suggestions};
 }
 return Object.freeze({version:1,paths,suggest});
});
