/* TEREON X — primeiro detector conservador de correspondências entre Condutores.
   Comparação pura: não modifica dados, não homologa e NUNCA soma quantidades.
   Prioridade: pedir revisão de especificações parciais, inclusive múltiplos candidatos.
*/
(function(root){'use strict';
const normalize=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase().replace(/\s+/g,' ');
function canonical(id,v){
 const n=normalize(v);
 if(id==='DET-004'&&/^\d+(?:[.,]\d+)?$/.test(n))return String(Number(n.replace(',','.')));
 return n;
}
const ignored=new Set(['DET-011']); // Unidade / apresentação comercial
const anchors=['DET-001','DET-002','DET-004']; // Tipo, material, seção
const identifiers=['DET-005','DET-008']; // Exigir ao menos isolação ou cor confirmada em comum
function ambiguousInsulation(id,a,b){
 if(id!=='DET-005')return false;
 const compound=normalize(a).includes(' ou ')?normalize(a):normalize(b).includes(' ou ')?normalize(b):null;
 const single=compound===normalize(a)?normalize(b):normalize(a);
 if(!compound||!single)return false;
 return compound.split(' ou ').some(x=>single.includes(x.trim()));
}
function compare(a,b){
 if(!a||!b||!a.catalogId||a.catalogId!=='FT_COND-001'||a.catalogId!==b.catalogId)
  return {status:'indeterminado',common:[],missing:[],conflicts:[],ambiguous:[]};
 const A=a.values||{},B=b.values||{};
 const common=[],missing=[],conflicts=[],ambiguous=[];
 const ids=new Set([...Object.keys(A),...Object.keys(B)]);
 for(const id of ids){
  if(ignored.has(id))continue;
  const va=A[id]!=null?String(A[id]).trim():'',vb=B[id]!=null?String(B[id]).trim():'';
  if(!va&&!vb)continue;
  if(va&&vb){
   if(canonical(id,va)===canonical(id,vb))common.push(id);
   else if(ambiguousInsulation(id,va,vb))ambiguous.push({id,left:va,right:vb});
   else conflicts.push({id,left:va,right:vb});
  }else missing.push({id,on:va?'right':'left',confirmed:va||vb});
 }
 if(conflicts.length)return {status:'incompativel',common,missing,conflicts,ambiguous};
 if(ambiguous.length)return {status:'indeterminado',common,missing,conflicts,ambiguous};
 // Nunca sugerir correspondência só por família e uma palavra coincidente.
 if(!anchors.every(id=>A[id]&&B[id]&&canonical(id,A[id])===canonical(id,B[id]))||
     !identifiers.some(id=>A[id]&&B[id]&&canonical(id,A[id])===canonical(id,B[id])))
  return {status:'indeterminado',common,missing,conflicts,ambiguous};
 if(missing.length)return {status:'potencial',common,missing,conflicts,ambiguous};
 // Igualdade dos valores presentes NÃO significa identidade completa se
 // ambos omitiram tensão/cor/isolação. A ficha deve definir critérios finais.
 if(!['DET-005','DET-006','DET-008'].every(id=>A[id]&&B[id]))
  return {status:'indeterminado',common,missing,conflicts,ambiguous};
 return {status:'identidade_confirmada',common,missing,conflicts,ambiguous};
}
function findReviewPairs(items){
 const records=(items||[]).filter(x=>x&&x.catalogId==='FT_COND-001'&&x.id!=null);
 const pairs=[];
 for(let i=0;i<records.length;i++)for(let j=i+1;j<records.length;j++){
  const left=records[i],right=records[j],result=compare(left,right);
  const nameDiff=normalize(left.name)!==normalize(right.name);
  const commercialEqual=normalize(left.unit)===normalize(right.unit)&&
   String(left.qtyBasis||'')===String(right.qtyBasis||'');
  if(result.status==='potencial'||(result.status==='identidade_confirmada'&&nameDiff&&commercialEqual))
   pairs.push({leftId:String(left.id),rightId:String(right.id),
    status:result.status,missing:result.missing,common:result.common});
 }
 return pairs;
}
root.TereonXMatch=Object.freeze({version:1,compare,findReviewPairs});
})(typeof window!=='undefined'?window:globalThis);
