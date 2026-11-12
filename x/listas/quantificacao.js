/* TEREON X — quantificação comercial (laboratório).
   Entrada: medida original em metros. Lances não são rolos comerciais.
   Dados legados sem qtyBasis='m' permanecem intactos. */
(function(root){'use strict';
const clean=v=>String(v??'').trim();
const value=v=>Number(clean(v).replace(',','.'));
function unitInfo(unit){
 const s=clean(unit).toLowerCase();
 if(s==='m')return {kind:'meter',factor:1,unit:'m'};
 const pack=/^(rl|br)(\d+)m$/.exec(s);
 if(pack){const factor=Number(pack[2]);if(factor>0)return {kind:'package',factor,unit:s};}
 const lance=/^([23])\s+lances$/.exec(s);
 if(lance)return {kind:'lance',count:Number(lance[1]),unit:s};
 return {kind:'legacy',unit:s};
}
function describe(item){
 const info=unitInfo(item.unit),length=value(item.qty);
 if(item.qtyBasis!=='m'||!(length>0)||!Number.isFinite(length)||info.kind==='legacy')
  return {kind:'legacy',qty:item.qty,unit:item.unit};
 if(info.kind==='meter')return {kind:'meter',meters:length,units:length,unit:'m'};
 if(info.kind==='package')return {kind:'package',meters:length,units:Math.ceil(length/info.factor-1e-10),unit:info.unit,factor:info.factor};
 const each=length/info.count;
 return {kind:'lance',meters:length,units:info.count,unit:'lances',each,count:info.count};
}
function signature(item){
 const pairs=Object.entries(item.values||{}).filter(([id])=>id!=='DET-011').sort((a,b)=>a[0].localeCompare(b[0]));
 return JSON.stringify([item.catalogId||'',pairs,clean(item.name)]);
}
function consolidate(items){
 const groups=new Map();
 for(const item of items||[]){
  const result=describe(item);
  if(result.kind==='legacy')continue; // Não reinterpretar dados antigos.
  const key=JSON.stringify([signature(item),clean(item.unit).toLowerCase(),result.kind==='lance'?Number(result.each.toFixed(9)):null]);
  if(!groups.has(key))groups.set(key,{name:item.name,unit:item.unit,kind:result.kind,meters:0,units:0,each:result.each||null,count:0,factor:result.factor||1});
  const group=groups.get(key);group.meters+=result.meters;group.count++;
  if(result.kind==='lance')group.units+=result.units;
 }
 return [...groups.values()].map(x=>({...x,units:x.kind==='package'?Math.ceil(x.meters/x.factor-1e-10):x.kind==='meter'?x.meters:x.units}));
}
root.TereonXQuant=Object.freeze({version:1,unitInfo,describe,consolidate});
})(typeof window!=='undefined'?window:globalThis);
