/* TEREON X · Listas / armazenamento v1. Sem DOM e sem dependências do catálogo. */
(function(root){'use strict';
const KEY='tereon-x-lab-v1';
const copy=value=>JSON.parse(JSON.stringify(value));
function validate(data){
 if(!data||!Array.isArray(data.lists))throw Error('Formato dos dados de listas incompatível.');
 for(const list of data.lists){
  if(!list||typeof list.id!=='string'||typeof list.name!=='string'||!Array.isArray(list.items)||!Array.isArray(list.stages))
   throw Error('Lista salva com estrutura inválida. Os dados originais foram preservados.');
 }
 return data;
}
function create(options){
 options=options||{};
 const storage=options.storage||root.localStorage;
 const key=options.key||KEY;
 if(!storage||typeof storage.getItem!=='function'||typeof storage.setItem!=='function')throw Error('Armazenamento local indisponível.');
 let state;
 try{
  const raw=storage.getItem(key);
  state=raw==null?{lists:[]}:validate(JSON.parse(raw));
 }catch(e){throw Error('Não foi possível ler as listas existentes. Nenhum dado foi alterado: '+e.message);}
 function snapshot(){return copy(state);}
 function save(next){
  const candidate=validate(copy(next));
  try{storage.setItem(key,JSON.stringify(candidate));}
  catch(e){throw Error('Não foi possível salvar as listas. Alteração cancelada: '+e.message);}
  state=candidate;
  return snapshot();
 }
 return Object.freeze({version:1,key,snapshot,save});
}
root.TereonXListStore=Object.freeze({version:1,KEY,create});
})(typeof window!=='undefined'?window:globalThis);
