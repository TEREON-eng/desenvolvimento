/* Contratos do Motor de Identidade e Relações. Node 22 */
'use strict';
const assert=require('node:assert/strict');
const motor=require('../relacoes/motor.js');
const owner='eaf3d241-419b-4c2e-a188-f793eec2a001';
const work='eaf3d241-419b-4c2e-a188-f793eec2a002';
const work2='eaf3d241-419b-4c2e-a188-f793eec2a003';
const identity='eaf3d241-419b-4c2e-a188-f793eec2a004';
const identity2='eaf3d241-419b-4c2e-a188-f793eec2a005';
const relation='eaf3d241-419b-4c2e-a188-f793eec2a006';
const calls=[];
const client={auth:{getUser:async()=>({data:{user:{id:owner}},error:null})},from(table){
 const call={table,filters:[]};calls.push(call);
 const query={
  select(fields){call.select=fields;return query},
  eq(k,v){call.filters.push([k,v]);return query},
  is(k,v){call.filters.push([k,v]);return query},
  or(v){call.or=v;return query},
  order(){return Promise.resolve({data:[],error:null})},
  insert(payload){call.insert=payload;return query},
  update(payload){call.update=payload;return query},
  maybeSingle(){return Promise.resolve({data:call.update?{id:relation,...call.update}:null,error:null})},
  single(){return Promise.resolve({data:{id:call.table==='x_record_relations'?relation:identity,...(call.insert||{})},error:null})}
 };return query;
}};
(async()=>{
 const service=motor.create(client);
 assert.equal(await service.identityFor('work',work),null);
 assert.deepEqual((await service.register('work',work)).origin_id,work);
 assert.equal(calls[2].insert.owner_id,owner);
 assert.equal(calls[2].insert.record_type,'work');
 assert.equal(calls[2].insert.origin_id,work);
 const cloudIdentity=await service.register('list',work2);
 assert.equal(cloudIdentity.record_type,'list');
 assert.equal(cloudIdentity.origin_id,work2);
 await assert.rejects(service.register('diary',work),/Tipo sem integração/);
 await assert.rejects(service.register('work','bad'),/inválido/);
 await assert.rejects(service.relate(identity,identity),/consigo mesmo/);
 await assert.rejects(service.relate(identity,identity2,'unknown'),/Tipo de relação inválido/);
 const link=await service.relate(identity,identity2);
 assert.equal(link.to_record_id,identity2);
 assert.equal(link.owner_id,owner);
 await service.relations(identity);
 assert.ok(calls.some(x=>x.or?.includes(identity)));
 await service.end(relation);
 assert.equal(calls.at(-1).update.ended_at.length,24);
 assert.equal(calls.some(x=>x.delete),false);
 console.log('TEREON X: Motor de Identidade e Relações — contratos OK');
})().catch(e=>{console.error(e);process.exitCode=1});
