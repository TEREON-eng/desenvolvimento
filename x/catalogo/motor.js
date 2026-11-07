/* TEREON X — motor de catálogo / biblioteca v1.
   Catálogo para listas e acervo de fichas compartilham a mesma fonte.
   Visibilidade no catálogo não significa aprovação ou homologação. */
(function(root){
'use strict';
let cache=null,loading=null;
const clean=x=>String(x??'').trim();
const norm=x=>clean(x).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function isOfficial(f){return ['aprovada','publicada','oficial'].includes(norm(f.status)) && f.tipo!=='hipotetica';}
function normalize(f){
 if(!f||!clean(f.codigo)||!clean(f.nome))throw Error('Ficha sem identificação');
 const details=(f.detalhes||[]).map((d,i)=>({
   id:clean(d.id)||'DET-'+(i+1),name:clean(d.nome)||'[Detalhe sem nome]',
   options:Array.isArray(d.valores)?d.valores.map(clean).filter(Boolean):clean(d.valores).split(';').map(clean).filter(Boolean),
   condition:clean(d.condicao),required:norm(d.classificacao).includes('obrigat'),
   classification:clean(d.classificacao)
 })).filter(d=>d.options.length);
 const sourceType=f.tipo==='hipotetica'?'simulacao':isOfficial(f)?'oficial':'revisao';
 return {id:clean(f.codigo),name:clean(f.nome),reference:clean(f.referencia)||clean(f.codigo),
   status:clean(f.status),kind:sourceType,collection:'catalogo-oficial',homologada:isOfficial(f),
   pendencias:[...(sourceType==='simulacao'?['Ficha ainda não criada: opções fictícias']:[]),...details.filter(d=>!d.condition||!d.classification||d.name==='[Detalhe sem nome]').map(d=>'Revisar: '+d.name)],\n   details,source:'fichario-x/simulacao-24.json'};
}
function applyRule(rule,values,details){
 const r=clean(rule);if(!r||norm(r)==='sempre')return {visible:true,verified:!!r};
 const parts=r.split('+').map(norm).filter(Boolean);
 const all=Object.values(values||{}).map(norm);
 const known=parts.every(x=>details.some(d=>d.options.some(o=>norm(o)===x)));
 if(!known)return {visible:true,verified:false};
 return {visible:parts.every(x=>all.includes(x)),verified:true};
}
function visibleDetails(f,values){
 return f.details.filter(d=>applyRule(d.condition,values||{},f.details).visible);
}
function missing(f,values){
 return visibleDetails(f,values).filter(d=>d.required&&!values[d.id] && d.options.length).map(d=>d.id);
}
function technicalName(f,values){
 let picks=visibleDetails(f,values).filter(d=>values[d.id]).map(d=>values[d.id]);
 return f.name+(picks.length?' · '+picks.join(' · '):'');
}
async function load(){
 if(cache)return cache;
 if(!loading)loading=fetch('/x/fichario-x/simulacao-24.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Catálogo indisponível ('+r.status+')');return r.json()}).then(d=>{
  if(d.schema!==1||!Array.isArray(d.fichas))throw Error('Esquema de catálogo incompatível');
  const all=d.fichas.map(normalize);const ids=new Set();
  all.forEach(f=>{if(ids.has(f.id))throw Error('Código duplicado: '+f.id);ids.add(f.id)});
  cache=Object.freeze(all);return cache;
 }).catch(e=>{loading=null;throw e});
 return loading;
}
function list(){return cache||[]}
function get(id){return list().find(f=>f.id===id)||null}
root.TereonXCatalog=Object.freeze({version:1,load,list,get,isOfficial,normalize,visibleDetails,missing,technicalName,applyRule});
})(window);
