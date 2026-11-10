'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const diary=require('../universo/diario/programacao-motor.js');
const ctx={
 works:[{id:'wilson',name:'Wilson Rachid'},{id:'other',name:'Escola X'}],
 contractors:[{id:'js',name:'Empreiteiro JS'}],
 teams:[{id:'team-a',name:'Equipe A',contractorId:'js'}],
 nodes:[
  {id:'rev',name:'Revisão elétrica',kind:'scope',workId:'wilson'},
  {id:'quadros',name:'Quadros',kind:'stage',workId:'wilson',parentId:'rev'},
  {id:'qd1',name:'QD1',kind:'substage',workId:'wilson',parentId:'quadros'},
  {id:'other-scope',name:'Revisão elétrica',kind:'scope',workId:'other'}
 ]
};
const base={workId:'wilson',teamId:'team-a',nodeId:'rev',startDate:'2026-11-17',endDate:'2026-11-20'};
let entries=diary.add([],base,ctx,'e1');
assert.equal(entries.length,1);
assert.equal(diary.forDay(entries,'wilson','2026-11-17').length,1,'programação começa no dia escolhido');
assert.equal(diary.forDay(entries,'wilson','2026-11-19').length,1,'escopo dura múltiplos dias');
assert.equal(diary.forDay(entries,'wilson','2026-11-21').length,0,'fora do período');
assert.equal(diary.forDay(entries,'other','2026-11-19').length,0,'não mistura obras');
assert.equal(diary.consolidate(entries,'wilson','2026-11-17',ctx)[0].contractorName,'Empreiteiro JS');
assert.equal(diary.consolidate(entries,'wilson','2026-11-17',ctx)[0].teamName,'Equipe A');
assert.throws(()=>diary.add(entries,{...base,nodeId:'quadros'},ctx,'e2'),/um dia/);
assert.throws(()=>diary.add(entries,{...base,nodeId:'qd1'},ctx,'e2'),/um dia/);
entries=diary.add(entries,{...base,nodeId:'quadros',endDate:'2026-11-17'},ctx,'e2');
assert.equal(diary.forDay(entries,'wilson','2026-11-17').length,2,'várias programações no mesmo dia');
assert.throws(()=>diary.add(entries,{...base,nodeId:'other-scope'},ctx,'e3'),/não pertence/);
assert.throws(()=>diary.add(entries,{...base,startDate:'2026-11-20',endDate:'2026-11-17'},ctx,'e3'),/anterior/);
assert.throws(()=>diary.add(entries,{...base,startDate:'2026-11-31'},ctx,'e3'),/Data inválida/);
assert.throws(()=>diary.add(entries,{...base,teamId:'desconhecido'},ctx,'e3'),/obra e equipe/);
assert.throws(()=>diary.add(entries,base,ctx,'e1'),/já cadastrada/);
const cancelled=diary.update(entries,'e2',{status:'cancelled'},ctx);
assert.equal(diary.forDay(cancelled,'wilson','2026-11-17').length,1,'cancelamento não remove registro');
assert.equal(entries.find(e=>e.id==='e2').status,'planned','histórico de entrada preservado');
const html=fs.readFileSync(path.resolve(__dirname,'../universo/diario/lab.html'),'utf8');
const js=fs.readFileSync(path.resolve(__dirname,'../universo/diario/lab.js'),'utf8');
assert.ok(html.includes('name="viewport"')&&html.includes('id="entry-form"'),'tela mobile existente');
assert.ok(js.includes('tereon-x-diary-simulation-v1'),'cache separado dos dados reais');
assert.ok(!js.includes('createClient(')&&!js.includes('x_works')&&!js.includes('x_cloud_lists'),'sem dependência do banco');
console.log('TEREON X: Diário — programação de escopo/período e etapa/dia OK (simulado)');
