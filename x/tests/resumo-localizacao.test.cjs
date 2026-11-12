/* TEREON X — campos relevantes para localização do insumo na lista.
   Não confundir resumo com identidade técnica ou ficha completa. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../listas/app.js'),'utf8');
const a=src.indexOf('  function materialParts(name,sourceItem){');
const b=src.indexOf('  function fullMaterial(',a);
assert.ok(a>=0&&b>a,'função de resumo deve existir');
const catalog={get(id){
 if(id==='FT_COND-001')return {name:'Condutores isolados',details:[]};
 if(id==='FT_INFRA-001')return {name:'Eletroduto',details:[{id:'DET-001',name:'Tipo'},{id:'DET-002',name:'Material'},{id:'DET-004',name:'Diâmetro PVC'}]};
 return null;
}};
const materialParts=new Function('window',src.slice(a,b)+'return materialParts;')({TereonXCatalog:catalog});
const item=(values,unit='rl100m')=>({id:'A',catalogId:'FT_COND-001',name:'Condutor isolado Cobre #2,5 mm² Isolação PVC 70 °C Azul 450/750 V',values,unit,qty:270,qtyBasis:'m',stage:'Sala 2'});
const values={'DET-001':'Condutor isolado','DET-002':'Cobre','DET-004':'2,5','DET-005':'PVC 70 °C','DET-006':'450/750 V','DET-008':'Azul','DET-011':'rl100m'};
const original=JSON.stringify(values);
const s=materialParts(item(values).name,item(values));
assert.equal(s.base,'Condutor isolado');
assert.equal(s.description,'Cobre · 2,5 mm² · Azul · PVC');
assert.equal(s.technical,item(values).name);
assert.equal(JSON.stringify(values),original,'não alterar os dados originais');
const noPVC=materialParts('Condutor isolado',item({...values,'DET-005':undefined}));
assert.equal(noPVC.description,'Cobre · 2,5 mm² · Azul','sem isolação confirmada, não inventar PVC');
const hepr=materialParts('Condutor isolado',item({...values,'DET-005':'HEPR ou XLPE 90 °C','DET-007':'PVC 70 °C'}));
assert.equal(hepr.description,'Cobre · 2,5 mm² · Azul · HEPR ou XLPE · Cob. PVC');
const blueNotChosen=materialParts('Condutor isolado',item({...values,'DET-008':undefined}));
assert.equal(blueNotChosen.description,'Cobre · 2,5 mm² · PVC');
const infra=materialParts('Eletroduto rígido de PVC 3/4"',{catalogId:'FT_INFRA-001',values:{'DET-001':'Rígido','DET-002':'PVC','DET-004':'3/4"'}});
assert.equal(infra.base,'Eletroduto');
assert.equal(infra.description,'Rígido · PVC · 3/4"');
const p=src.indexOf('  function groupCard('),q=src.indexOf('  function stageMaterialRow(',p);
assert.ok(src.slice(p,q).includes('fullMaterial(g.name,composition,entries[0])'),'por insumo usa mesmo resumo');
assert.ok(src.slice(q,q+500).includes('materialParts(g.name,entries[0])'),'por etapa usa mesmo resumo');
console.log('Resumo de localização: condutor, PVC, cor, isolamento, cobertura e duas visões OK');
