/* TEREON X — FT_COND-001 (sem Comportamento ao fogo).
   LSZH é exigência explícita, nunca inferida ou homologação comercial. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=JSON.parse(read('x/fichario-x/fichas-drive-2026-11-08.json'));
const context={window:{},console,fetch:async()=>({ok:true,json:async()=>structuredClone(source)})};
vm.createContext(context);new vm.Script(read('x/catalogo/motor.js'),{filename:'motor.js'}).runInContext(context);
const cat=context.window.TereonXCatalog;
(async()=>{
 const all=await cat.load(),f=all.find(x=>x.id==='FT_COND-001');
 assert.ok(f);assert.equal(f.kind,'revisao');assert.equal(f.details.length,10);
 assert.equal(f.details.at(-1).id,'DET-LSZH');
 assert.equal(f.details.at(-1).required,false);
 assert.ok(!f.details.some(d=>d.id==='DET-005'||d.name==='Comport. ao fogo'));
 assert.equal(f.details.find(x=>x.id==='DET-006').options.length,3);
 assert.equal(f.details.find(x=>x.id==='DET-008').options.length,2);
 assert.ok(f.aliases.includes('Cabinho'));
 const PVC='PVC 70 °C',NH='Termoplástico não halogenado 70 °C',HEPR='HEPR ou XLPE 90 °C';
 const v=(t,iso,tensao,cobertura,cor,vias)=>{const o={'DET-001':t,'DET-002':'Cobre','DET-004':'2,5'};
  if(iso)o['DET-006']=iso;if(tensao)o['DET-007']=tensao;
  if(cobertura)o['DET-008']=cobertura;if(cor)o['DET-009']=cor;if(vias)o['DET-003']=vias;return o;};
 const normal=v('Condutor isolado',PVC,'450/750 V',null,'Preto');
 assert.equal(cat.conflicts(f,normal).length,0);
 assert.equal(cat.missing(f,normal).length,0);
 assert.equal(cat.lszhCandidate(f,normal),false,'PVC isolação não admite sugestão LSZH');
 assert.equal(cat.lszhCandidate(f,v('Condutor isolado',NH,'450/750 V',null,'Preto')),true,'isolação não halogenada permite perguntar');
 assert.equal(cat.lszhCandidate(f,v('Condutor isolado',HEPR,'0,6/1,0 kV',null,'Preto')),true,'HEPR permite perguntar, não comprova LSZH');
 assert.equal(cat.lszhCandidate(f,v('Cabo unipolar',HEPR,'0,6/1,0 kV',null,'Preto')),false,'sem cobertura definida não presume ausência de PVC');
 assert.equal(cat.lszhCandidate(f,v('Cabo multipolar',HEPR,'0,6/1,0 kV',PVC,null,'3')),false,'cobertura PVC impede sugestão');
 assert.equal(cat.lszhCandidate(f,v('Cabo multipolar',PVC,'0,6/1,0 kV',NH,null,'3')),false,'isolação PVC impede sugestão mesmo com cobertura NH');
 assert.equal(cat.lszhCandidate(f,v('Cabo multipolar',HEPR,'0,6/1,0 kV',NH,null,'3')),true,'construção sem PVC permite perguntar');
 assert.equal(cat.lszhCandidate(f,v('Cabo multipolar',NH,'0,6/1,0 kV',NH,null,'3')),true,'duas camadas NH permitem perguntar');
 assert.equal(cat.optionsFor(f,normal,'DET-LSZH').length,0,'PVC não oferece classificação');
 const green=v('Condutor isolado',NH,'450/750 V',null,'Preto');
 assert.equal(cat.nextDetail(f,green,['DET-007','DET-010']),'DET-LSZH','classificação é última opção');
 assert.deepEqual(Array.from(cat.optionsFor(f,green,'DET-LSZH')),['Comum','LSZH']);
 assert.ok(cat.technicalName(f,{...green,'DET-LSZH':'LSZH'}).includes('LSZH'));
 assert.ok(!cat.technicalName(f,{...green,'DET-LSZH':'Comum'}).includes('LSZH'));
 assert.ok(cat.conflicts(f,{...normal,'DET-LSZH':'LSZH'}).length>0,'LSZH anterior fica inválido ao mudar para PVC');
 assert.ok(!cat.optionsFor(f,v('Condutor isolado'),'DET-008').length,'condutor isolado não tem cobertura');
 assert.ok(!cat.visibleDetails(f,v('Cabo multipolar')).some(x=>x.name==='Cor'));
 assert.ok(cat.missing(f,v('Cabo multipolar',HEPR,null,null,null)).includes('DET-003'));
 assert.ok(!cat.optionsFor(f,{'DET-006':HEPR},'DET-007').includes('450/750 V'));
 assert.ok(!cat.optionsFor(f,{'DET-007':'450/750 V'},'DET-006').includes(HEPR));
 assert.ok(cat.technicalName(f,normal).includes('#2,5 mm²'));
 assert.ok(cat.technicalName(f,normal).includes('Isolação PVC 70 °C'));
 assert.ok(!cat.technicalName(f,normal).includes('LSZH'),'nome nunca presume LSZH');
 assert.ok(!cat.technicalName(f,normal).includes('{valor}'));
 let total=0,invalid=0,pass=0;
 const types=['Condutor isolado','Cabo unipolar','Cabo multipolar'],isos=['',PVC,HEPR,NH],
 volts=['','450/750 V','0,6/1,0 kV'],covers=['',PVC,NH],colors=['','Preto'],vias=['','3'];
 for(const t of types)for(const iso of isos)for(const volt of volts)
  for(const cover of covers)for(const cor of colors)for(const via of vias){
   const values=v(t,iso,volt,cover,cor,via);total++;
   const conflicts=cat.conflicts(f,values),missing=cat.missing(f,values);
   if(conflicts.length){invalid++;assert.ok(missing.length>0,'conflitos impedem salvar');}
   if(!missing.length){pass++;assert.equal(conflicts.length,0);}
   if(cat.lszhCandidate(f,values)){
    assert.ok(![values['DET-006'],values['DET-008']].some(x=>x&&x.includes('PVC')));
    if(t!=='Condutor isolado')assert.ok(values['DET-008']);
   }
  }
 assert.equal(total,432);assert.ok(invalid>0&&pass>0);
 assert.equal(all.length,6,'demais fichas preservadas');
 const html=read('x/index.html'),fixture=read('x/tests/fixtures/modal-adicionar-aprovado-x034.html');
 const a=html.indexOf('<dialog id="addDialog"');
 assert.ok(a>=0&&html.slice(a,html.indexOf('</dialog>',a)+9)===fixture,'HTML do modal aprovado preservado');
 console.log('TEREON X: 432 combinações, '+invalid+' conflitos, '+pass+' completas. LSZH somente com confirmação explícita (LAB).');
})().catch(e=>{console.error(e);process.exitCode=1});
