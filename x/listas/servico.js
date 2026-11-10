/* TEREON X · Motor de Listas v1. Dono exclusivo dos lançamentos e etapas.
 * Contrato: recebe um repositório; não usa DOM, catálogo, PDF nem estado global de outras telas.
 */
(function(root){'use strict';
const clone=x=>JSON.parse(JSON.stringify(x));
const clean=x=>String(x??'').trim();
const newId=()=>String(Date.now())+'-'+Math.random().toString(36).slice(2,8);
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const generateUuid=()=>{
 const cryptoApi=globalThis.crypto;
 if(cryptoApi?.randomUUID)return cryptoApi.randomUUID();
 if(cryptoApi?.getRandomValues){
  const bytes=cryptoApi.getRandomValues(new Uint8Array(16));
  bytes[6]=(bytes[6]&15)|64;
  bytes[8]=(bytes[8]&63)|128;
  const hex=Array.from(bytes,x=>x.toString(16).padStart(2,'0')).join('');
  return hex.slice(0,8)+'-'+hex.slice(8,12)+'-'+hex.slice(12,16)+'-'+hex.slice(16,20)+'-'+hex.slice(20);
 }
 throw Error('Este navegador não oferece geração segura de identificadores. Os dados não foram alterados.');
};
function reconcileStages(list){
  // Etapas da Lista são sugestões derivadas dos lançamentos, não escopo de Obra.
  // Preserva nomes e ordem já usados, descartando apenas as etapas sem materiais.
  const used=new Map();
  for(const item of list.items){
   const stage=clean(item.stage);
   const key=stage.toLocaleLowerCase('pt-BR');
   if(stage&&!used.has(key))used.set(key,stage);
  }
  const next=[],seen=new Set();
  for(const previous of list.stages){
   const stage=clean(previous),key=stage.toLocaleLowerCase('pt-BR');
   if(used.has(key)&&!seen.has(key)){next.push(stage);seen.add(key);}
  }
  for(const [key,stage] of used)if(!seen.has(key)){next.push(stage);seen.add(key);}
  list.stages=next;
}
function create(repository,options){
 if(!repository||typeof repository.snapshot!=='function'||typeof repository.save!=='function')throw Error('Repositório de listas inválido.');
 const ids=options&&options.newId||newId;
 const newRecordUid=options&&options.newRecordUid||generateUuid;
 const snapshot=()=>repository.snapshot();
 const get=id=>snapshot().lists.find(x=>String(x.id)===String(id))||null;
 function change(fn){const data=snapshot();const result=fn(data);repository.save(data);return result;}
 function find(data,id){const l=data.lists.find(x=>String(x.id)===String(id));if(!l)throw Error('Lista não encontrada.');return l;}
 function allocateRecordUid(data){
  const uid=String(newRecordUid());
  if(!UUID.test(uid))throw Error('Identificador técnico inválido.');
  if(data.lists.some(l=>l.recordUid===uid))throw Error('Identificador técnico duplicado.');
  return uid;
 }
 function ensureRecordUid(listId){
  const existing=get(listId);
  if(!existing)throw Error('Lista não encontrada.');
  if(existing.recordUid){
   if(!UUID.test(existing.recordUid))throw Error('A lista possui identificação técnica incompatível. Nenhum dado foi alterado.');
   return existing.recordUid;
  }
  return change(data=>{
   const target=find(data,listId);
   const uid=allocateRecordUid(data);
   target.recordUid=uid;
   return uid;
  });
 }
 function createList(name){
  const title=clean(name);if(!title||title.length>160)throw Error('Informe um nome para a lista de até 160 caracteres.');
  return change(data=>{const id=String(ids());if(data.lists.some(l=>l.id===id))throw Error('ID de lista repetido.');const recordUid=allocateRecordUid(data);data.lists.push({id,recordUid,name:title,items:[],stages:[]});return id;});
 }
 function renameList(listId,name){
  const title=clean(name);
  if(!title)throw Error('Informe um nome para a lista.');
  if(title.length>160)throw Error('O nome da lista deve ter até 160 caracteres.');
  const current=get(listId);
  if(!current)throw Error('Lista não encontrada.');
  if(current.name===title)return true;
  return change(data=>{find(data,listId).name=title;return true;});
 }
 function duplicateList(listId){
  const original=get(listId);
  if(!original)throw Error('Lista não encontrada.');
  return change(data=>{
   const source=find(data,listId);
   const id=String(ids());
   if(data.lists.some(l=>String(l.id)===id))throw Error('ID de lista repetido.');
   const recordUid=allocateRecordUid(data);
   const copy=clone(source);
   copy.id=id;copy.recordUid=recordUid;copy.name=(source.name+' (cópia)').slice(0,160);
   delete copy.cloudVersion;delete copy.cloudPending;delete copy.cloudConflict;
   data.lists.push(copy);
   return id;
  });
 }
 function upsertItem(listId,entry,itemId){
  if(!entry||!clean(entry.name)||!Number.isFinite(Number(entry.qty))||!(Number(entry.qty)>0)||!clean(entry.unit)||!clean(entry.stage))throw Error('Preencha material, quantidade, unidade e etapa.');
  return change(data=>{
   const list=find(data,listId);
   const stage=clean(entry.stage);
   const canonical=list.stages.find(s=>s.toLocaleLowerCase('pt-BR')===stage.toLocaleLowerCase('pt-BR'));
   const validated=Object.assign({},clone(entry),{stage:canonical||stage});
   if(!canonical)list.stages.push(stage);
   if(itemId!=null){
    const old=list.items.find(x=>String(x.id)===String(itemId));
    if(!old)throw Error('Item original não encontrado.');
    Object.assign(old,validated);
    reconcileStages(list);
    return String(old.id);
   }
   const id=String(ids());if(list.items.some(x=>String(x.id)===id))throw Error('ID de item repetido.');
   list.items.push(Object.assign({id},validated));reconcileStages(list);return id;
  });
 }
 function duplicateItem(listId,itemId){
  return change(data=>{
   const list=find(data,listId),source=list.items.find(x=>String(x.id)===String(itemId));
   if(!source)throw Error('Item não encontrado.');
   const id=String(ids());if(list.items.some(x=>String(x.id)===id))throw Error('ID de item repetido.');
   list.items.push(Object.assign({},clone(source),{id}));reconcileStages(list);return id;
  });
 }
 function removeItem(listId,itemId){
  return change(data=>{
   const list=find(data,listId),before=list.items.length;
   list.items=list.items.filter(x=>String(x.id)!==String(itemId));
   if(before===list.items.length)throw Error('Item não encontrado.');
   reconcileStages(list);
   return true;
  });
 }
 function removeList(listId){
  return change(data=>{
   const before=data.lists.length;
   data.lists=data.lists.filter(x=>String(x.id)!==String(listId));
   if(data.lists.length===before)throw Error('Lista não encontrada.');
   return true;
  });
 }
 function exportList(listId){const l=get(listId);if(!l)throw Error('Lista não encontrada.');return clone(l);}
 return Object.freeze({version:2,snapshot,get,createList,renameList,duplicateList,ensureRecordUid,upsertItem,duplicateItem,removeItem,removeList,exportList});
}
root.TereonXLists=Object.freeze({version:2,create});
})(typeof window!=='undefined'?window:globalThis);
