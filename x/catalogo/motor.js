/* TEREON X — motor de catálogo / biblioteca v1.
   Catálogo para listas e acervo de fichas compartilham a mesma fonte.
   Visibilidade no catálogo não significa aprovação ou homologação. */
(function(root){
'use strict';
let cache=null,loading=null;
const clean=x=>String(x??'').trim();
const norm=x=>clean(x).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function isOfficial(f){return f?.publicacao?.homologada===true && ['aprovada','publicada','oficial'].includes(norm(f.status)) && f.tipo!=='hipotetica';}
/* Um grupo (DET-xxx) representa UMA pergunta. Linhas com o mesmo ID representam
   opções com condições/exclusões locais; fichas antigas de várias opções por linha
   continuam suportadas. Sem qualquer inferência de produto ou homologação. */
function normalize(f){
 if(!f||!clean(f.codigo)||!clean(f.nome))throw Error('Ficha sem identificação');
 const groups=new Map();
 (f.detalhes||[]).forEach((d,i)=>{
  const name=clean(d.nome),options=Array.isArray(d.valores)?d.valores.map(clean).filter(Boolean):clean(d.valores).split(';').map(clean).filter(Boolean);
  if(!name&&!options.length)return;
  const id=clean(d.id)||'DET-'+(i+1),order=Number(d.ordem)||i+1;
  if(groups.has(id)&&groups.get(id).name!==name)throw Error('ID de detalhe duplicado com nomes diferentes: '+id);
  if(!groups.has(id))groups.set(id,{id,name:name||'[Detalhe sem nome]',order,options:[],rows:[],condition:'',required:false,classification:''});
  const g=groups.get(id);
  if(g.order!==order)throw Error('Ordens diferentes para o mesmo detalhe: '+id);
  g.required=g.required||norm(d.classificacao).includes('obrigat');
  g.classification=g.required?'Obrigatório':(clean(d.classificacao)||g.classification);
  options.forEach(o=>{if(!g.options.some(x=>norm(x)===norm(o)))g.options.push(o)});
  g.rows.push({options,condition:clean(d.condicao),exclusion:clean(d.exclusao),nameRule:clean(d.compoeNome),originLine:d.origemLinha||null});
 });
 const details=[...groups.values()].sort((a,b)=>a.order-b.order);
 for(const d of details)d.condition=d.rows.length===1?d.rows[0].condition:'';
 const sourceType=f.tipo==='hipotetica'?'simulacao':isOfficial(f)?'oficial':'revisao';
 const pendencias=[...(Array.isArray(f.pendencias)?f.pendencias:[]),...(sourceType==='simulacao'?['Ficha ainda não criada: opções fictícias']:[])];
 details.forEach(d=>{
  if(d.name==='[Detalhe sem nome]'||!d.options.length)pendencias.push('Revisar: '+d.name);
  d.rows.forEach(row=>{if(!row.condition)pendencias.push('Condição não informada: '+d.name)});
 });
 return {id:clean(f.codigo),name:clean(f.nome),reference:clean(f.referencia)||clean(f.codigo),
   status:clean(f.status),kind:sourceType,aliases:Array.isArray(f.apelidos)?f.apelidos.map(clean).filter(Boolean):[],collection:'catalogo-oficial',homologada:isOfficial(f),
   pendencias,details,source:'fichario-x/fichas-drive-2026-11-08.json',sourceName:clean(f.nomeNaPlanilha),sourcePendencias:Array.isArray(f.pendencias)?f.pendencias:[]};
}
const eq=(a,b)=>norm(a)===norm(b);
function applyRule(rule,values,details){
 const r=clean(rule);if(!r||norm(r)==='sempre')return {visible:true,verified:!!r};
 // '//' = OU, '+' = E, '!' = NÃO (nega SOMENTE a opção seguinte).
 // Uma opção negada precisa existir na ficha; ausência de seleção não prova característica técnica.
 const clauses=r.split('//').map(x=>x.trim());
 if(clauses.some(x=>!x))return {visible:false,verified:false};
 const groups=clauses.map(clause=>clause.split('+').map(token=>token.trim()));
 if(groups.some(tokens=>tokens.some(token=>!token||token==='!')))return {visible:false,verified:false};
 const parsed=groups.map(tokens=>tokens.map(token=>{
  const negative=token.startsWith('!');
  return {negative,value:negative?token.slice(1).trim():token};
 }));
 const known=parsed.every(tokens=>tokens.every(token=>token.value&&!token.value.startsWith('!')&&
  details.some(d=>d.options.some(option=>eq(option,token.value)))));
 if(!known)return {visible:false,verified:false};
 const chosen=Object.values(values||{});
 return {visible:parsed.some(tokens=>tokens.every(token=>{
  const present=chosen.some(v=>eq(v,token.value));
  return token.negative?!present:present;
 })),verified:true};
}
function excludedTargets(f,values){
 const tokens=[];
 for(const d of f.details){
  const chosen=values?.[d.id];
  if(!chosen)continue;
  const row=d.rows.find(r=>r.options.some(o=>eq(o,chosen)));
  if(row?.exclusion)tokens.push(...row.exclusion.split(';').map(x=>x.trim()).filter(Boolean));
 }
 return tokens;
}
function blocked(f,values,d,option){
 const targets=excludedTargets(f,values);
 const byOthers=targets.some(t=>(eq(t,d.name)||eq(t,option))&&!(eq(values?.[d.id],option)));
 if(byOthers)return true;
 // Exclusion must work both ways regardless of confirmation order.
 const targetRows=d.rows.filter(r=>r.options.some(x=>eq(x,option)));
 return targetRows.some(r=>r.exclusion.split(';').map(x=>x.trim()).filter(Boolean).some(t=>{
   return f.details.some(other=>other.id!==d.id&&values?.[other.id]&&(eq(t,other.name)||eq(t,values[other.id])));
 }));
}
function optionsFor(f,values,id){
 const d=f.details.find(x=>x.id===id);if(!d)return [];
 return d.rows.flatMap(row=>{
  const rule=applyRule(row.condition,values,f.details);
  if(!rule.visible)return [];
  return row.options.filter(o=>!blocked(f,values,d,o));
 }).filter((o,i,a)=>a.findIndex(x=>eq(x,o))===i);
}
/* Descreve opções disponíveis e bloqueadas sem apagá-las da interface.
   A restrição continua sendo a da ficha, sem inferência técnica. */
function optionStates(f,values,id){
 const d=f.details.find(x=>x.id===id);if(!d)return [];
 const chosen=values||{};
 return d.options.map(option=>{
  const rows=d.rows.filter(r=>r.options.some(o=>eq(o,option)));
  const applicable=rows.some(row=>applyRule(row.condition,chosen,f.details).visible);
  const blockers=new Map();
  for(const other of f.details){
   if(other.id===d.id||!chosen[other.id])continue;
   const selected=chosen[other.id];
   const origin=other.rows.find(r=>r.options.some(o=>eq(o,selected)));
   if(origin?.exclusion.split(';').some(t=>eq(t.trim(),d.name)||eq(t.trim(),option)))
    blockers.set(other.id,{id:other.id,name:other.name,value:selected});
   if(rows.some(row=>row.exclusion.split(';').some(t=>eq(t.trim(),other.name)||eq(t.trim(),selected))))
    blockers.set(other.id,{id:other.id,name:other.name,value:selected});
  }
  const conditional=rows.some(row=>row.condition&&!eq(row.condition,'Sempre'));
  const related=[...blockers.values()];
  return {option,available:applicable&&!related.length,blockedBy:related,
   reason:related.length?'Incompatível com '+related.map(x=>x.name+': '+x.value).join(', '):
    !applicable?(conditional?'Não disponível para as características confirmadas':'Condição da ficha não atendida'):'',
   conditional};
 });
}
function relatedTags(f,values,id){
 const d=f.details.find(x=>x.id===id);if(!d)return [];
 const selected=values||{},links=new Set();
 for(const other of f.details){
  if(other.id===id||!selected[other.id])continue;
  const choice=selected[other.id];
  if(d.rows.some(row=>row.condition.split('//').some(clause=>clause.split('+').some(token=>eq(token.trim(),choice)))))
   links.add(other.id);
  const row=other.rows.find(r=>r.options.some(o=>eq(o,choice)));
  if(row?.exclusion.split(';').some(t=>eq(t.trim(),d.name)||d.options.some(o=>eq(o,t.trim()))))
   links.add(other.id);
  if(d.rows.some(r=>r.exclusion.split(';').some(t=>eq(t.trim(),other.name)||eq(t.trim(),choice))))
   links.add(other.id);
 }
 return [...links];
}
function visibleDetails(f,values){
 return f.details.filter(d=>optionsFor(f,values||{},d.id).length>0);
}
function conflicts(f,values){
 const out=[];
 for(const d of f.details){
  const chosen=values?.[d.id];if(!chosen)continue;
  if(!d.options.some(x=>eq(x,chosen)))out.push('Opção inexistente em '+d.name+': '+chosen);
  else if(!optionsFor(f,{...values,[d.id]:undefined},d.id).some(o=>eq(o,chosen)))out.push('Combinação incompatível: '+d.name+' = '+chosen);
 }
 return out;
}
/* Sequência de seleção: obrigatórios primeiro, salvo opcional que afeta
   diretamente um obrigatório pendente por condição ou exclusão.
   Ignorar não é confirmar: skipped é apenas estado transitório do modal. */
function nextDetail(f,values,skipped=[]){
 const ignored=new Set(skipped||[]);
 const present=visibleDetails(f,values||{});
 const required=present.filter(d=>d.required&&!values?.[d.id]);
 const pendingOptional=present.filter(d=>!d.required&&!values?.[d.id]&&!ignored.has(d.id));
 for(const target of required){
  const prerequisite=pendingOptional.find(source=>source.rows.some(row=>{
   const terms=row.exclusion.split(';').map(x=>x.trim()).filter(Boolean);
   if(terms.some(t=>eq(t,target.name)||target.options.some(o=>eq(t,o))))return true;
   return target.rows.some(trow=>trow.condition.split('//').some(clause=>
    clause.split('+').some(token=>row.options.some(o=>eq(o,token)))));
  }));
  if(prerequisite)return prerequisite.id;
  return target.id;
 }
 return pendingOptional[0]?.id||null;
}
function missing(f,values){
 const out=[];
 for(const d of f.details){
  if(!d.required)continue;
  const opts=optionsFor(f,values||{},d.id);
  if(!opts.length){
   // Condição de exibição falsa => detalhe não se aplica e não é obrigatório.
   // Exclusão explícita do detalhe inteiro => não se aplica.
   // Há linhas aplicáveis, porém todas as opções excluídas => conflito real.
   const hidden=excludedTargets(f,values).some(t=>eq(t,d.name));
   const statuses=d.rows.map(r=>applyRule(r.condition,values||{},f.details));
   const applicable=statuses.some(s=>s.visible);
   const malformed=statuses.some(s=>!s.verified);
   if(!hidden&&(applicable||malformed))out.push(d.id);
   continue;
  }
  if(!values?.[d.id]||!opts.some(o=>eq(o,values[d.id])))out.push(d.id);
 }
 return [...new Set([...out,...(conflicts(f,values).length?['__CONFLITO__']:[])])];
}
function technicalName(f,values){
 const selected=f.details.filter(d=>values?.[d.id]);
 const hasRules=selected.some(d=>d.rows.some(r=>r.nameRule));
 if(!hasRules){
  const picks=visibleDetails(f,values).filter(d=>values?.[d.id]).map(d=>values[d.id]);
  return f.name+(picks.length?' · '+picks.join(' · '):'');
 }
 const parts=[];
 for(const d of selected){
  const chosen=values[d.id];
  const row=d.rows.find(r=>r.options.some(x=>eq(x,chosen)));
  const rule=clean(row?.nameRule);
  if(!rule||norm(rule)==='nao')continue;
  const matched=/^sim(?:\s*\(([\s\S]*)\))?$/i.exec(rule);
  if(!matched)continue; // Não interpretar sintaxe desconhecida como nome válido.
  parts.push(matched[1]===undefined?chosen:matched[1].replace(/\{valor\}/gi,chosen).trim());
 }
 return parts.join(' ').replace(/\s+/g,' ').trim()||f.name;
}
async function load(){
 if(cache)return cache;
 if(!loading)loading=fetch('/x/fichario-x/fichas-drive-2026-11-08.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Catálogo indisponível ('+r.status+')');return r.json()}).then(d=>{
  if(d.schema!==1||!Array.isArray(d.fichas))throw Error('Esquema de catálogo incompatível');
  const all=d.fichas.map(normalize);const ids=new Set();
  all.forEach((f,i)=>{if(ids.has(f.id)){f.pendencias.push('Código do fichário duplicado: '+f.id);f.id=f.id+'-SIM-'+String(i+1).padStart(2,'0');}ids.add(f.id)});
  cache=Object.freeze(all);return cache;
 }).catch(e=>{loading=null;throw e});
 return loading;
}
function list(){return cache||[]}
function get(id){return list().find(f=>f.id===id)||null}
root.TereonXCatalog=Object.freeze({version:2,load,list,get,isOfficial,normalize,visibleDetails,missing,technicalName,applyRule,optionsFor,conflicts,nextDetail,optionStates,relatedTags});
})(window);
