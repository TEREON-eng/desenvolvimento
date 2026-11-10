'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const planning=require('../universo/diario/programacao-motor.js');
const execution=require('../universo/diario/execucao-motor.js');
const ctx={
 works:[{id:'wilson'}],teams:[{id:'a',name:'Equipe A',contractorId:'js'}],contractors:[{id:'js',name:'JS'}],
 nodes:[{id:'rev',workId:'wilson',kind:'scope',name:'Revisão elétrica'},{id:'quadros',workId:'wilson',kind:'stage',name:'Quadros'}]
};
const programs=planning.add([],{workId:'wilson',teamId:'a',nodeId:'rev',startDate:'2026-11-17',endDate:'2026-11-20'},ctx,'p1');
const report=(changes={})=>({id:'r1',programId:'p1',date:'2026-11-17',status:'executed',completed:false,reason:'',note:'Passagem de cabos',recordedAt:'2026-11-17T20:00:00.000Z',...changes});
let history=execution.record([],report(),programs);
assert.equal(history[0].completed,false,'dia executado não conclui tarefa automaticamente');
assert.equal(execution.latest(history,'p1','2026-11-18'),null,'outro dia permanece sem confirmação');
history=execution.record(history,report({id:'r2',status:'not_executed',reason:'rain',completed:false,note:'Chuva intensa',recordedAt:'2026-11-17T21:00:00.000Z'}),programs);
assert.equal(execution.latest(history,'p1','2026-11-17').status,'not_executed');
assert.equal(history[0].status,'executed','correção preserva evento anterior');
assert.equal(history.length,2,'histórico de correções mantido');
assert.throws(()=>execution.record(history,report({id:'r3',status:'not_executed',reason:''}),programs),/justificativa/);
assert.throws(()=>execution.record(history,report({id:'r3',status:'not_executed',reason:'rain',completed:true}),programs),/concluída/);
assert.throws(()=>execution.record(history,report({id:'r3',date:'2026-11-21'}),programs),/pertencente/);
assert.throws(()=>execution.record(history,report({id:'r3',status:'not_executed',reason:'other',note:''}),programs),/Descreva/);
history=execution.record(history,report({id:'r3',date:'2026-11-18',completed:true}),programs);
assert.equal(execution.latest(history,'p1','2026-11-18').completed,true);
assert.equal(execution.latest(history,'p1','2026-11-17').completed,false,'conclusão em um dia não reescreve os outros dias');
assert.equal(execution.forDay(history,programs,'wilson','2026-11-17').length,1);
const cancelled=planning.update(programs,'p1',{status:'cancelled'},ctx);
assert.equal(execution.validate(history[0],cancelled).status,'executed','cancelar planejamento não apaga histórico do dia');
assert.throws(()=>execution.record(history,report({id:'r4',date:'2026-11-19'}),cancelled),/cancelada/);
const html=fs.readFileSync(path.resolve(__dirname,'../universo/diario/lab.html'),'utf8');
const js=fs.readFileSync(path.resolve(__dirname,'../universo/diario/lab.js'),'utf8');
assert.ok(html.includes('id="report-dialog"')&&html.includes('id="report-status"')&&html.includes('id="report-reason"'),'modal independente de apontamento');
assert.ok(html.includes('id="entry-dialog"'),'modal independente de programação preservado');
assert.ok(js.includes('showReport(e.id)')&&js.includes('function onReport('),'consulta aciona registro do dia');
assert.ok(js.includes('tereon-x-diary-execution-simulation-v1'),'histórico segregado no navegador');
assert.ok(!js.includes('createClient('),'sem banco real na simulação');
console.log('TEREON X: Diário — confirmação diária, conclusão e justificativa OK');
