/* TEREON X · Obras: contratos independentes e testes de cliente simulado. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const works=require('../universo/obras/motor.js');
const uid='eaf3d241-419b-4c2e-a188-f793eec2a001';
const space='eaf3d241-419b-4c2e-a188-f793eec2a002';
const work='eaf3d241-419b-4c2e-a188-f793eec2a003';
let calls=[];
const from=table=>{
 const c={table,filters:[]};calls.push(c);
 const q={
  select(fields){c.select=fields;return q},
  insert(data){c.insert=data;return q},
  update(data){c.update=data;return q},
  eq(column,value){c.filters.push([column,value]);return q},
  order(){return Promise.resolve({data:[],error:null})},
  single(){return Promise.resolve({data:{id:work,...(c.insert||{})},error:null})},
  maybeSingle(){return Promise.resolve({data:{id:work,...(c.update||{})},error:null})}
 };return q;
};
const client={auth:{getUser:async()=>({data:{user:{id:uid}},error:null})},from};
(async()=>{
 assert.deepEqual(works.validateWork({name:' Escola A ',description:' Texto ',status:'active'}),{name:'Escola A',description:'Texto',status:'active'});
 assert.throws(()=>works.validateWork({name:' ',status:'active'}),/nome de obra/);
 assert.throws(()=>works.validateWork({name:'A',status:'invalid'}),/Situação/);
 const service=works.create(client);
 await service.spaces();
 assert.equal(calls[0].table,'x_workspaces');assert.deepEqual(calls[0].filters,[['owner_id',uid]]);
 await service.createSpace(' Meu espaço ');
 assert.equal(calls[1].insert.owner_id,uid);
 assert.equal(calls[1].insert.kind,'personal');
 await assert.rejects(service.createSpace('Empresa','outro'),/Tipo/);
 await service.list(space);
 assert.deepEqual(calls[2].filters,[['workspace_id',space]]);
 await assert.rejects(service.createWork('inválido',{name:'Obra'}),/Espaço inválido/);
 await service.createWork(space,{name:'Obra A',description:'Teste',status:'planning'});
 assert.equal(calls[3].insert.workspace_id,space);
 assert.equal(calls[3].insert.name,'Obra A');
 await service.updateWork(work,{name:'Obra A',description:'Teste',status:'active'});
 assert.deepEqual(calls[4].update,{name:'Obra A',description:'Teste',status:'active'});
 assert.deepEqual(calls[4].filters,[['id',work]]);
 await service.archive(work,{name:'Obra A',description:'Teste',status:'active'});
 assert.equal(calls[5].update.status,'archived');
 assert.equal(calls.length,6);
 const lab=fs.readFileSync(path.join(__dirname,'../universo/obras/lab.js'),'utf8');
 const page=fs.readFileSync(path.join(__dirname,'../universo/obras/lab.html'),'utf8');
 assert.ok(lab.includes('client.auth.getSession()'),'sem sessão deve oferecer login');
 assert.ok(!page.includes('../listas/'),'obras não deve carregar Listas');
 assert.ok(!page.includes('localStorage'),'obras não grava dados locais de Listas');
 assert.ok(page.includes('motor.js'));
 console.log('TEREON X: motor isolado de Obras e contratos básicos OK');
})().catch(e=>{console.error(e);process.exitCode=1});
