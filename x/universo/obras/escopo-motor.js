/* TEREON X · Motor independente de Escopo de Obras.
 * Três níveis: escopo > etapa > subetapa. Sem DOM, SQL, persistência ou Listas.
 * Operações imutáveis; vínculos externos somente com autorização futura.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 root.TereonXWorkScope=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const KINDS=Object.freeze(['scope','stage','substage']);
 const clean=x=>String(x??'').trim();
 const clone=x=>JSON.parse(JSON.stringify(x));
 function validate(nodes){
  if(!Array.isArray(nodes))throw Error('Estrutura de escopo inválida.');
  const byId=new Map();
  for(const n of nodes){
   if(!n||!clean(n.id)||!KINDS.includes(n.kind)||!clean(n.name)||clean(n.name).length>160)
    throw Error('Nó de escopo inválido.');
   if(byId.has(n.id))throw Error('Identidade de escopo duplicada.');
   byId.set(n.id,n);
  }
  for(const n of nodes){
   const parent=n.parentId==null?null:byId.get(n.parentId);
   const level=KINDS.indexOf(n.kind);
   if(level===0&&n.parentId!=null)throw Error('Escopo não admite pai.');
   if(level>0&&(!parent||KINDS.indexOf(parent.kind)!==level-1))throw Error('Hierarquia inválida: exige pai do nível anterior.');
   if(parent&&n.workId!=null&&parent.workId!=null&&n.workId!==parent.workId)throw Error('Níveis pertencem a obras diferentes.');
  }
  return clone(nodes);
 }
 function paths(nodes){
  const state=validate(nodes),byId=new Map(state.map(n=>[n.id,n]));
  return state.map(n=>{
   const parts=[n.name];
   let parent=n.parentId==null?null:byId.get(n.parentId);
   while(parent){parts.unshift(parent.name);parent=parent.parentId==null?null:byId.get(parent.parentId);}
   return {id:n.id,parentId:n.parentId??null,kind:n.kind,workId:n.workId??null,name:n.name,path:parts.join(' › '),source:n.source||'registered',archived:!!n.archived};
  });
 }
 function add(nodes,node){
  const copy=validate(nodes),item=clone(node);
  if(copy.some(n=>n.id===item.id))throw Error('Identidade de escopo duplicada.');
  return validate([...copy,item]);
 }
 function rename(nodes,id,name){
  const title=clean(name),next=validate(nodes);
  if(!title||title.length>160)throw Error('Nome de escopo inválido.');
  const target=next.find(n=>n.id===id);if(!target)throw Error('Nó não encontrado.');
  target.name=title;return validate(next);
 }
 function archive(nodes,id){
  const next=validate(nodes),target=next.find(n=>n.id===id);
  if(!target)throw Error('Nó não encontrado.');
  // Arquiva o nó e descendentes, preservando identificadores e histórico.
  const pending=[id],affected=new Set();
  while(pending.length){
   const current=pending.pop();if(affected.has(current))continue;
   affected.add(current);
   for(const n of next)if(n.parentId===current)pending.push(n.id);
  }
  for(const n of next)if(affected.has(n.id))n.archived=true;
  return next;
 }
 return Object.freeze({version:1,KINDS,validate,paths,add,rename,archive});
});
