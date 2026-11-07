/* TEREON X — contrato de catálogo. Node.js nativo, sem dependências. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'../..');
const fixture=JSON.parse(fs.readFileSync(path.join(root,'x/fichario-x/simulacao-24.json'),'utf8'));
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
 assert.equal(all.length,24,'24 materiais de simulação precisam carregar');
 assert.equal(new Set(all.map(x=>x.id)).size,24,'IDs internos devem ser únicos');
 assert.equal(all.filter(x=>x.kind==='revisao').length,2);
 assert.equal(all.filter(x=>x.kind==='simulacao').length,22);
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
 const fake={codigo:'TESTE',nome:'Teste',tipo:'real',status:'aprovada',detalhes:[]};
 assert.equal(catalog.normalize(fake).homologada,false,'status sozinho não autoriza homologação');
 assert.equal(catalog.technicalName(ele,vals).includes('Rígido'),true);
 console.log('TEREON X: contrato de catálogo OK — 24 fichas, sem homologação automática');
})().catch(e=>{console.error(e);process.exitCode=1});
