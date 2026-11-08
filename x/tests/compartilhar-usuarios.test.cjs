/* TEREON X — contratos do compartilhamento entre usuários, sem browser/rede. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const share=require('../compartilhar-usuarios/motor.js');
const userId='eaf3d241-419b-4c2e-a188-f793eec2a001';
const recipientId='aef3d241-419b-4c2e-a188-f793eec2a002';
let requests=[];
const sample={
 id:'lista-local-1',name:'Lista elétrica A',stages:['Geral'],
 items:[{id:'i1',name:'Condutor cobre 2,5 mm²',qty:100,unit:'m',stage:'Geral',values:{isolacao:'PVC'}}]
};
const before=JSON.stringify(sample);
const snapshot=share.prepareSnapshot(sample);
assert.equal(snapshot.schema_version,1);
assert.equal(snapshot.items[0].values.isolacao,'PVC');
snapshot.items[0].values.isolacao='ALTERADO';
assert.equal(JSON.stringify(sample),before,'cópia não modifica origem');
assert.throws(()=>share.prepareSnapshot({...sample,items:[]}),/1 a 300/);
assert.throws(()=>share.prepareSnapshot({...sample,items:[{name:'Cabo',qty:0,unit:'m'}]}),/inválido/);

function query(table){
 assert.equal(table,'x_list_shares');
 const log={};
 requests.push(log);
 const q={
  insert(data){log.kind='insert';log.data=data;return q;},
  select(cols){log.columns=cols;return q;},
  update(data){log.kind='update';log.data=data;return q;},
  eq(field,value){(log.filters??=[]).push([field,value]);return q;},
  in(field,value){(log.filters??=[]).push([field,value]);return q;},
  order(field,opts){log.order=[field,opts];return Promise.resolve({data:[],error:null});},
  single(){return Promise.resolve({data:{id:'share',status:'pending'},error:null});},
  maybeSingle(){return Promise.resolve({data:{id:'share',status:log.data.status},error:null});}
 };
 return q;
}
const client={auth:{getUser:async()=>({data:{user:{id:userId}},error:null})},from:query};
(async()=>{
 const api=share.create(client);
 await assert.rejects(api.send('bad-id',sample),/identificador válido/);
 await assert.rejects(api.send(userId,sample),/para si mesmo/);
 assert.equal(requests.length,0,'não fazer gravações com dados inválidos');
 await api.send(recipientId,sample);
 assert.deepEqual(requests[0].data.sender_user_id,userId);
 assert.deepEqual(requests[0].data.recipient_user_id,recipientId);
 assert.equal(requests[0].data.list_snapshot.name,sample.name);
 assert.equal(requests[0].data.list_snapshot.items[0].qty,100);
 assert.equal(JSON.stringify(sample),before);
 await api.inbox();await api.outbox();
 assert.deepEqual(requests[1].filters[0],['recipient_user_id',userId]);
 assert.deepEqual(requests[2].filters[0],['sender_user_id',userId]);
 await api.respond(recipientId,'accepted');
 assert.equal(requests[3].data.status,'accepted');
 assert.ok(requests[3].filters.some(([k,v])=>k==='recipient_user_id'&&v===userId));
 await assert.rejects(api.respond(recipientId,'revoked'),/Resposta inválida/);
 await api.revoke(recipientId);
 assert.equal(requests[4].data.status,'revoked');
 assert.ok(requests[4].filters.some(([k,v])=>k==='sender_user_id'&&v===userId));
 assert.equal(requests.length,5);
 const html=fs.readFileSync(path.join(__dirname,'../compartilhar-usuarios/lab.html'),'utf8');
 for(const pathName of ['../listas/store.js','../listas/servico.js','./motor.js','./lab.js'])
  assert.ok(html.includes(pathName),'lab sem dependência: '+pathName);
 assert.ok(!html.includes('/x/listas/app.js'),'lab não deve abrir tela interna de Listas');
 const js=fs.readFileSync(path.join(__dirname,'../compartilhar-usuarios/lab.js'),'utf8');
 assert.ok(js.includes('exportList(l.id)'),'laboratório usa contrato público de exportação');
 assert.ok(js.includes('db.auth.getSession()'),'laboratório confere sessão antes de getUser');
 assert.ok(js.includes('showLoggedOut()'),'visitante recebe caminho para login');
 console.log('TEREON X: contratos de compartilhamento entre usuários OK');
})().catch(err=>{console.error(err);process.exitCode=1});
