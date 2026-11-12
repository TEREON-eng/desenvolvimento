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
  if(result.kind==='legacy')continue; // Preservar dados anteriores sem reinterpretação.
  // Um material comprado em lances constitui uma linha, qualquer que seja o
  // comprimento de cada trecho. Rolos e barras têm suas próprias apresentações.
  const presentation=result.kind==='lance'?'lances':clean(item.unit).toLowerCase();
  const key=JSON.stringify([signature(item),presentation]);
  if(!groups.has(key))groups.set(key,{
   name:item.name,unit:result.kind==='lance'?'lances':item.unit,kind:result.kind,
   meters:0,units:0,count:0,factor:result.factor||1,breakdown:[],sourceIds:[],stages:[]
  });
  const group=groups.get(key);
  group.meters+=result.meters;group.count++;
  if(item.id!=null)group.sourceIds.push(String(item.id));
  if(item.stage&&!group.stages.includes(item.stage))group.stages.push(item.stage);
  if(result.kind==='lance'){
   group.units+=result.units;
   const each=Number(result.each.toFixed(9));
   let part=group.breakdown.find(x=>x.length===each);
   if(!part){part={length:each,count:0,meters:0};group.breakdown.push(part);}
   part.count+=result.units;part.meters+=result.meters;
  }
 }
 return [...groups.values()].map(g=>{
  if(g.kind==='package')g.units=Math.ceil(g.meters/g.factor-1e-10);
  else if(g.kind==='meter')g.units=g.meters;
  if(g.kind==='lance'){
   g.breakdown.sort((a,b)=>b.length-a.length);
   g.each=g.breakdown.length===1?g.breakdown[0].length:null; // Compatibilidade.
   const check=g.breakdown.reduce((n,p)=>n+p.length*p.count,0);
   if(Math.abs(check-g.meters)>1e-6)throw Error('Composição dos lances não fecha com a metragem medida.');
  }
  return g;
 });
}

root.TereonXQuant=Object.freeze({version:2,unitInfo,describe,consolidate});
})(typeof window!=='undefined'?window:globalThis);
