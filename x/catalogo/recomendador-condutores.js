/* TEREON X — Recomendador conservador de Condutores, laboratório v1.
 * Não gera atributos faltantes, não altera Listas, não publica fichas.
 * Fontes em ordem: lista atual, histórico confirmado, catálogo.
 */
(function(root){'use strict';
const FAMILY='FT_COND-001';
const ORDER=['lista','historico','catalogo'];
const noCommercial=new Set(['DET-011']);
const requiredForRecommendation=['DET-001','DET-002','DET-004','DET-005','DET-006','DET-008'];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
function equal(id,a,b){
 if(id==='DET-004'){
  const x=Number(String(a).replace(',','.')),y=Number(String(b).replace(',','.'));
  if(Number.isFinite(x)&&Number.isFinite(y))return x===y;
 }
 return norm(a)===norm(b);
}
function signature(values){
 return Object.keys(values||{}).filter(k=>!noCommercial.has(k)&&values[k]!=null&&String(values[k]).trim())
  .sort().map(k=>k+':'+norm(values[k])).join('|');
}
function technicalCheck(ficha,values,catalog){
 const problems=[];
 if(!ficha||typeof catalog?.missing!=='function'||typeof catalog?.conflicts!=='function')
  return {complete:false,problems:['Ficha técnica ou validador indisponível'],missing:[]};
 const missing=catalog.missing(ficha,values).filter(id=>id!=='__CONFLITO__');
 for(const id of requiredForRecommendation)if(!values[id]&&!missing.includes(id))missing.push(id);
 for(const id of missing)problems.push('Detalhe ausente: '+id);
 for(const message of catalog.conflicts(ficha,values))problems.push(String(message));
 if(norm(values['DET-005']).includes(' ou '))problems.push('Isolação genérica: definir HEPR ou XLPE com fonte técnica');
 return {complete:problems.length===0,problems,missing};
}
function assess(intent,record,origin,ficha,catalog){
 if(!record||record.catalogId!==FAMILY||!record.values||typeof record.values!=='object')return null;
 const values={...record.values},assessment=technicalCheck(ficha,values,catalog);
 let score=0;
 const requestWarnings=[];
 for(const proposal of intent.proposals||[]){
  const present=values[proposal.id];
  if(!present){if(proposal.quality==='literal')requestWarnings.push('Não confirmado no candidato: '+proposal.id);continue;}
  if(equal(proposal.id,present,proposal.value)){
   score+=proposal.quality==='literal'?8:4;
  }else if(proposal.quality==='literal'||proposal.id==='DET-004'){
   return null; // Pedido explícito e candidato incompatível: não recomendar.
  }else{
   requestWarnings.push('Verificar ambiguidade: '+proposal.id);
  }
 }
 // "Flexível" sem classe confirmada não é ficha pronta para este pedido.
 const flexAsked=(intent.proposals||[]).some(p=>p.id==='DET-009');
 if(flexAsked&&!values['DET-009'])requestWarnings.push('Classe de encordoamento não confirmada');
 const complete=assessment.complete&&requestWarnings.length===0;
 return {id:String(record.id??record.reference??record.name??'sem-id'),name:String(record.name||ficha?.name||'Condutor'),
  origin,values,unit:record.unit==null?null:String(record.unit),
  complete,homologated:complete&&ficha?.homologada===true,
  issues:[...assessment.problems,...requestWarnings],missing:assessment.missing.slice(),
  score,confirmedCount:Math.max(0,Number(record.confirmedCount)||0),
  occurrences:[{origin,id:String(record.id??record.reference??record.name??'sem-id'),unit:record.unit==null?null:String(record.unit)}]
 };
}
function recommend(input){
 const opts=input||{},intent=opts.intent||{},ficha=opts.ficha,catalog=opts.catalog;
 const empty={top:[],more:[],review:[],question:null,all:[]};
 if(intent.family!==FAMILY)return empty;
 const sources=opts.sources||{};
 const collections=[
  {key:'lista',rows:sources.currentList||[]},
  {key:'historico',rows:sources.history||[]},
  {key:'catalogo',rows:sources.catalog||[]}
 ];
 const eligible=[],reviews=[],seen=new Map();
 for(const {key,rows} of collections){
  if(!Array.isArray(rows))continue;
  for(const record of rows){
   const item=assess(intent,record,key,ficha,catalog);
   if(!item)continue;
   // Deduplicar somente especificações completas; nunca somar quantidade.
   const keyId=item.complete?signature(item.values):null;
   if(keyId&&seen.has(keyId)){
    seen.get(keyId).occurrences.push(...item.occurrences);
    continue;
   }
   if(keyId)seen.set(keyId,item);
   (item.complete?eligible:reviews).push(item);
  }
 }
 const compare=(a,b)=>ORDER.indexOf(a.origin)-ORDER.indexOf(b.origin)||b.score-a.score||b.confirmedCount-a.confirmedCount||a.name.localeCompare(b.name,'pt-BR');
 eligible.sort(compare);reviews.sort(compare);
 const count=Math.min(3,Math.max(1,Number(opts.limit)||3));
 // Apenas pergunta por uma lacuna real; não escolhe a resposta.
 let question=null;
 if(!eligible.length&&reviews.length){
  const first=reviews[0];
  const priority=['DET-006','DET-005','DET-004','DET-001','DET-002','DET-008','DET-009'];
  const id=priority.find(i=>first.missing.includes(i));
  if(id){
   const detail=ficha?.details?.find(d=>d.id===id);
   question={id,name:detail?.name||id,candidateId:first.id};
  }
 }
 return {top:eligible.slice(0,count),more:eligible.slice(count),review:reviews,question,all:[...eligible,...reviews]};
}
root.TereonXRecommend=Object.freeze({version:1,recommend});
})(typeof window!=='undefined'?window:globalThis);
