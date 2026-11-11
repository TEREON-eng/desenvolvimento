/* Testes da ficha real FT_COND-001 importada do Fichário, sem detalhe virtual. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=JSON.parse(read('x/fichario-x/fichas-drive-2026-11-08.json'));
const context={window:{},console,fetch:async()=>({ok:true,json:async()=>structuredClone(source)})};
vm.createContext(context);new vm.Script(read('x/catalogo/motor.js')).runInContext(context);
const cat=context.window.TereonXCatalog;
(async()=>{
 const all=await cat.load(),f=all.find(x=>x.id==='FT_COND-001');
 assert.equal(all.length,6);assert.equal(f.details.length,10);
 assert.equal(f.details.at(-1).id,'DET-010');
 assert.equal(f.details.at(-1).name,'Comportamento ao fogo');
 assert.equal(f.details.at(-1).required,false);
 assert.ok(!f.details.some(x=>x.id==='DET-LSZH'));
 const PVC='PVC 70 °C',NH='Termoplástico não halogenado 70 °C',HEPR='HEPR ou XLPE 90 °C';
 const LSZH='Não halogenado com baixa emissão de fumaça (LSZH)';
 const val=(type,iso,cover)=>({'DET-001':type,'DET-002':'Cobre','DET-004':'2,5','DET-005':iso,...(cover?{'DET-007':cover}:{})});
 const pvci=val('Condutor isolado',PVC);
 assert.ok(!cat.optionsFor(f,pvci,'DET-010').includes(LSZH));
 assert.ok(cat.optionsFor(f,pvci,'DET-010').includes('Comum'));
 assert.ok(cat.conflicts(f,{...pvci,'DET-010':LSZH}).length,'LSZH + PVC isolação é inválido');
 const pvcc=val('Cabo multipolar',HEPR,PVC);
 assert.ok(!cat.optionsFor(f,pvcc,'DET-010').includes(LSZH));
 assert.ok(cat.conflicts(f,{...pvcc,'DET-010':LSZH}).length,'LSZH + PVC cobertura é inválido');
 const clean=val('Cabo multipolar',HEPR,NH);
 assert.ok(!cat.optionsFor(f,clean,'DET-010').includes('Comum'),'sem PVC, Comum não pode ser selecionado');
 assert.ok(!cat.optionsFor(f,val('Cabo unipolar',HEPR),'DET-010').includes('Comum'),'cobertura em branco não ativa Comum');
 assert.ok(cat.optionsFor(f,val('Cabo unipolar',HEPR),'DET-010').includes(LSZH),'sem PVC confirmado oferece LSZH como exigência');
 assert.ok(!cat.optionStates(f,clean,'DET-010').find(x=>x.option==='Comum').available,'Comum permanece visível e bloqueado');
 assert.ok(cat.conflicts(f,{...clean,'DET-010':'Comum'}).length,'Comum + construção sem PVC deve ser inválido');
 assert.ok(cat.optionsFor(f,clean,'DET-010').includes(LSZH),'Cobertura não halogenada não bloqueia LSZH');
 assert.equal(cat.conflicts(f,{...clean,'DET-010':LSZH}).length,0);
 assert.ok(cat.nextDetail(f,{...clean,'DET-003':'3','DET-008':undefined},['DET-006','DET-009'])==='DET-010');
 const grey=cat.optionStates(f,pvcc,'DET-010').find(x=>x.option===LSZH);
 assert.ok(grey&&!grey.available);
 assert.ok(cat.technicalName(f,{...clean,'DET-010':LSZH}).includes('LSZH'));
 assert.ok(!cat.technicalName(f,clean).includes('LSZH'),'sem escolha não há LSZH');
 let total=0,invalid=0;
 for(const type of ['Condutor isolado','Cabo unipolar','Cabo multipolar'])
 for(const iso of [PVC,HEPR,NH])
 for(const cover of ['',PVC,NH])
 for(const fire of ['','Comum',LSZH]){
  total++;const v={...val(type,iso,cover),...(fire?{'DET-010':fire}:{})};
  if(cat.conflicts(f,v).length){invalid++;assert.ok(cat.missing(f,v).length,'conflito impede salvar');}
 }
 assert.equal(total,81);assert.ok(invalid>0);
 const html=read('x/index.html'),fixture=read('x/tests/fixtures/modal-adicionar-aprovado-x034.html');
 const a=html.indexOf('<dialog id="addDialog"');
 assert.ok(a>=0&&html.slice(a,html.indexOf('</dialog>',a)+9)===fixture);
 console.log('TEREON X: 81 cenários reais, bloqueio por PVC, sem detalhe artificial, modal preservado OK');
})().catch(e=>{console.error(e);process.exitCode=1});
