/* TEREON X — Estresse da FT_COND-001 experimental / 17-11.
   NÃO prova homologação de combinações comerciais; valida lógica declarada. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=JSON.parse(read('x/fichario-x/fichas-drive-2026-11-08.json'));
const context={window:{},console,fetch:async()=>({ok:true,json:async()=>structuredClone(source)})};
vm.createContext(context);new vm.Script(read('x/catalogo/motor.js'),{filename:'motor.js'}).runInContext(context);
const cat=context.window.TereonXCatalog;
(async()=>{
 const all=await cat.load();
 const f=all.find(x=>x.id==='FT_COND-001');assert.ok(f);assert.equal(f.kind,'revisao');
 assert.equal(f.details.length,10);
 assert.equal(f.details.find(x=>x.id==='DET-001').options.length,3,'3 linhas do Tipo são uma única pergunta');
 assert.equal(f.details.find(x=>x.id==='DET-006').options.length,3,'3 linhas da Isolação são uma única pergunta');
 assert.equal(f.details.find(x=>x.id==='DET-008').options.length,2,'Cobertura possui PVC e composto não halogenado');
 const v=(t,fire,iso,tensao,cobertura,cor,vias)=>{
  const d={'DET-001':t,'DET-002':'Cobre','DET-004':'2,5'};
  if(fire)d['DET-005']=fire;if(iso)d['DET-006']=iso;if(tensao)d['DET-007']=tensao;
  if(cobertura)d['DET-008']=cobertura;if(cor)d['DET-009']=cor;if(vias)d['DET-003']=vias;
  return d;
 };
 const LSZH='Não halogenado com baixa emissão de fumaça (LSZH)', PVC='PVC 70 °C', HEPR='HEPR ou XLPE 90 °C';
 assert.ok(!cat.visibleDetails(f,v('Condutor isolado')).some(d=>d.name==='Cobertura'));
 assert.ok(!cat.visibleDetails(f,v('Cabo multipolar')).some(d=>d.name==='Cor'));
 assert.ok(cat.visibleDetails(f,v('Cabo multipolar')).some(d=>d.name==='Cobertura'));
 assert.ok(cat.missing(f,v('Cabo multipolar',null,HEPR,null,null,null)).includes('DET-003'));
 assert.ok(!cat.missing(f,v('Condutor isolado',null,PVC,null,null,'Preto')).includes('DET-003'),'vias condicionais não obrigatórias em isolado');
 const ok=v('Condutor isolado','Comum',PVC,'450/750 V',null,'Preto');
 assert.equal(cat.conflicts(f,ok).length,0);
 assert.equal(cat.missing(f,ok).length,0,'condutor isolado comum completo pode ser lançado');
 const green=v('Condutor isolado',LSZH,'Termoplástico não halogenado 70 °C','450/750 V',null,'Preto');
 assert.equal(cat.conflicts(f,green).length,0,'condutor isolado LSZH 750 V é possível');
 assert.equal(cat.missing(f,green).length,0,'condutor isolado LSZH 750 V pode ser especificado');
 const cable=v('Cabo multipolar','Comum',HEPR,'0,6/1,0 kV',null,null,'3');
 assert.equal(cat.conflicts(f,cable).length,0);
 assert.equal(cat.missing(f,cable).length,0,'multipolar normal pode ser lançado');
 const COMMON='Comum', NH='Termoplástico não halogenado 70 °C';
 assert.ok(!cat.optionsFor(f,{'DET-001':'Cabo multipolar','DET-005':COMMON},'DET-006').includes(NH),'Comum exclui isolação não halogenada');
 assert.ok(!cat.optionsFor(f,{'DET-001':'Cabo multipolar','DET-005':COMMON},'DET-008').includes(NH),'Comum exclui cobertura não halogenada');
 assert.ok(!cat.optionsFor(f,{'DET-001':'Cabo multipolar','DET-006':NH},'DET-005').includes(COMMON),'isolação não halogenada também impede Comum');
 assert.ok(!cat.optionsFor(f,{'DET-001':'Cabo multipolar','DET-008':NH},'DET-005').includes(COMMON),'cobertura não halogenada também impede Comum');
 assert.ok(!cat.optionsFor(f,{'DET-005':LSZH},'DET-006').includes(PVC),'LSZH impede isolação PVC');
 assert.ok(cat.optionsFor(f,{'DET-005':LSZH},'DET-006').includes('Termoplástico não halogenado 70 °C'),'LSZH oferece isolação não halogenada');
 assert.ok(!cat.optionsFor(f,{'DET-005':LSZH,'DET-001':'Cabo multipolar'},'DET-008').includes(PVC),'LSZH impede cobertura PVC');
 assert.ok(cat.optionsFor(f,{'DET-005':LSZH,'DET-001':'Cabo multipolar'},'DET-008').includes('Termoplástico não halogenado 70 °C'),'LSZH oferece cobertura não halogenada');
 assert.ok(!cat.optionsFor(f,{'DET-006':PVC},'DET-005').includes(LSZH),'PVC impede LSZH');
 assert.ok(!cat.optionsFor(f,{'DET-006':HEPR},'DET-007').includes('450/750 V'),'90 C exclui 750 V');
 assert.ok(!cat.optionsFor(f,{'DET-007':'450/750 V'},'DET-006').includes(HEPR),'750 V exclui 90 C');
 assert.ok(cat.conflicts(f,{...ok,'DET-005':LSZH}).length>0,'proibido LSZH + PVC');
 assert.ok(cat.missing(f,{...ok,'DET-005':LSZH}).length>0,'conflito impede adicionar');
 assert.ok(cat.conflicts(f,{...cable,'DET-005':LSZH,'DET-008':PVC}).length>0,'LSZH + cobertura PVC bloqueado');
 assert.equal(cat.conflicts(f,{...cable,'DET-005':LSZH,'DET-008':'Termoplástico não halogenado 70 °C'}).length,0,'LSZH + cobertura não halogenada passa nas regras lógicas');
 let total=0,invalid=0,pass=0;
 const types=['Condutor isolado','Cabo unipolar','Cabo multipolar'],
  fires=['','Comum',LSZH],isol=['',PVC,HEPR,'Termoplástico não halogenado 70 °C'],volt=['','450/750 V','0,6/1,0 kV'],
  covers=['',PVC,'Termoplástico não halogenado 70 °C'],colors=['','Preto'],vias=['','3'];
 for(const t of types)for(const fi of fires)for(const ins of isol)for(const te of volt)
  for(const co of covers)for(const col of colors)for(const vi of vias){
   total++;const sample=v(t,fi,ins,te,co,col,vi);
   const c=cat.conflicts(f,sample),missing=cat.missing(f,sample);
   if(c.length){invalid++;assert.ok(missing.length>0,'conflitos nunca podem ser salvos');}
   if(!missing.length){pass++;assert.equal(c.length,0);}
  }
 assert.equal(total,1296);assert.ok(invalid>0&&pass>0);
 assert.equal(all.length,6,'não alterar outras fichas');
 const html=read('x/index.html'),fixture=read('x/tests/fixtures/modal-adicionar-aprovado-x034.html');
 const a=html.indexOf('<dialog id="addDialog"');
 assert.ok(a>=0&&html.slice(a,html.indexOf('</dialog>',a)+9)===fixture,'modal aprovado preservado');
 console.log('TEREON X: 1296 combinações, '+invalid+' conflitos, '+pass+' completas; exclusões, condicionais e modal OK (LABORATÓRIO)');
})().catch(e=>{console.error(e);process.exitCode=1});
