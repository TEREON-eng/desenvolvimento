/* TEREON X — preparar escolhas explícitas do rascunho de texto/voz.
   Nunca altera o fichário, os lançamentos nem o rascunho original. */
(function(root){'use strict';
 function apply(ficha,proposals,accepted,catalog){
  if(!ficha||!catalog)return {values:{},unapplied:[],ok:false};
  const chosen=(proposals||[]).filter(p=>accepted?.[p.id]===p.value);
  let pending=chosen.slice(),values={};
  for(let pass=0;pass<=chosen.length&&pending.length;pass++){
   const waiting=[];
   let advanced=false;
   for(const proposal of pending){
    const visible=catalog.visibleDetails(ficha,values).some(d=>d.id===proposal.id);
    const state=visible&&catalog.optionStates(ficha,values,proposal.id)
      .find(x=>x.option===proposal.value&&x.available);
    if(!state){waiting.push(proposal);continue;}
    const proposed={...values,[proposal.id]:proposal.value};
    if(catalog.conflicts(ficha,proposed).length){waiting.push(proposal);continue;}
    values=proposed;advanced=true;
   }
   pending=waiting;
   if(!advanced)break;
  }
  return {values,unapplied:pending,ok:pending.length===0};
 }
 root.TereonXIntentDraft=Object.freeze({apply});
})(typeof window!=='undefined'?window:globalThis);
