/* TEREON X — contrato de catálogo. Node.js nativo, sem dependências. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'../..');
const fixture=JSON.parse(fs.readFileSync(path.join(root,'x/fichario-x/fichas-drive-2026-11-08.json'),'utf8'));
const context={
  window:{},
  fetch:async()=>({ok:true,json:async()=>structuredClone(fixture)}),
  console
};
vm.createContext(context);
const src=fs.readFileSync(path.join(root,'x/catalogo/motor.js'),'utf8');
new vm.Script(src,{filename:'motor.js'}).runInContext(context);
const catalog=context.window.TereonXCatalog;
(async()=>{
 assert.equal(fixture.schema,1);
 const all=await catalog.load();
 assert.equal(all.length,6,'seis fichas com abas reais da planilha atualizada');
 assert.equal(new Set(all.map(x=>x.id)).size,6,'IDs internos devem ser únicos');
 assert.equal(all.filter(x=>x.kind==='revisao').length,6);
 assert.equal(all.filter(x=>x.kind==='simulacao').length,0);
 assert.ok(all.every(x=>x.homologada===false),'nenhuma ficha demonstrativa é homologada');
 const ele=all.find(x=>x.id==='FT_INFRA-001');
 assert.ok(ele);
 assert.equal(ele.details.length,13,'detalhes sem opções também devem permanecer visíveis');
 assert.equal(ele.details.filter(x=>!x.options.length).length,2);
 assert.deepEqual(Array.from(catalog.missing(ele,{})),['DET-001','DET-002']);
 const vals={'DET-001':'Rígido','DET-002':'Aço'};
 assert.equal(catalog.applyRule('Rígido+Aço',vals,ele.details).visible,true);
 assert.equal(catalog.applyRule('Rígido+PVC',vals,ele.details).visible,false);
 const unknown=catalog.applyRule('Condicao nao mapeada',{},ele.details);
 assert.equal(unknown.verified,false,'regra desconhecida não pode ser validada');
 const abr=all.find(x=>x.id==='FT_INFRA-004');
 assert.equal(abr.name,'Abraçadeiras','identificação pelo código/aba, não pelo B5 inconsistente');
 assert.ok(abr.pendencias.some(x=>x.includes('B5')),'divergência de nome não pode desaparecer');
 const curva=all.find(x=>x.id==='FT_INFRA-002');
 assert.equal(curva.details[0].name,'Tipo');
 assert.deepEqual(Array.from(curva.details[0].options),['45°','90°']);
 const cabo=all.find(x=>x.id==='FT_COND-001');
 assert.equal(cabo.details.length,10,'dez detalhes importados da planilha');
 assert.equal(cabo.details.at(-1).id,'DET-010','comportamento real da planilha no fim');
 assert.equal(cabo.details.at(-1).name,'Comportamento ao fogo');
 assert.equal(cabo.details.find(d=>d.id==='DET-005').name,'Isolação');
 assert.ok(!cabo.details.some(d=>d.id==='DET-LSZH'),'nenhum detalhe artificial');
 assert.equal(catalog.missing(cabo,{}).length,5,'Tipo, Material, Seção, Isolação e Cor requeridos antes de escolher o Tipo');
 const fake={codigo:'TESTE',nome:'Teste',tipo:'real',status:'aprovada',detalhes:[]};
 assert.equal(catalog.normalize(fake).homologada,false,'status sozinho não autoriza homologação');
 assert.equal(catalog.technicalName(ele,vals).includes('Rígido'),true);
 console.log('TEREON X: 6 fichas reais do Drive, regras, pendências e sem homologação automática OK');
})().catch(e=>{console.error(e);process.exitCode=1});
