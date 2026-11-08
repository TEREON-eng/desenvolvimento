/* Contratos de Listas na Nuvem: cliente simulado, sem dados reais. */
'use strict';
const assert=require('node:assert/strict');
const cloud=require('../listas/nuvem/motor.js');
const fs=require('node:fs'),path=require('node:path');
const uid='eaf3d241-419b-4c2e-a188-f793eec2a001';
const id='eaf3d241-419b-4c2e-a188-f793eec2a002';
const logs=[],row={id,owner_id:uid,name:'Obra A',items:[],stages:[],version:1};
let stored={...row},failConflict=false;
const from=table=>{
 assert.equal(table,'x_cloud_lists');
 const action={filters:[],payload:null,kind:'select'};logs.push(action);
 const q={
  select(){return q},
  eq(field,value){action.filters.push([field,value]);return q},
  order(){return Promise.resolve({data:[stored],error:null})},
  insert(payload){action.kind='insert';action.payload=payload;return q},
  update(payload){action.kind='update';action.payload=payload;return q},
  single(){return Promise.resolve({data:{...stored,...action.payload,version:1},error:null})},
  maybeSingle(){
   if(action.kind==='update'&&failConflict)return Promise.resolve({data:null,error:null});
   if(action.kind==='update'){stored={...stored,...action.payload,version:stored.version+1};return Promise.resolve({data:stored,error:null})}
   return Promise.resolve({data:stored,error:null});
  }
 };return q;
};
const client={auth:{getUser:async()=>({data:{user:{id:uid}},error:null})},from};
(async()=>{
 assert.throws(()=>cloud.validate({name:''}),/nome/);
 assert.throws(()=>cloud.validate({name:'A',items:[{name:'Cabo',qty:0,unit:'m'}]}),/material inválido/);
 assert.throws(()=>cloud.validate({name:'A',items:{}}),/Formato/);
 const service=cloud.create(client);
 const list=await service.list();assert.equal(list.length,1);
 assert.ok(logs[0].filters.some(([key,value])=>key==='owner_id'&&value===uid),'lista por proprietário');
 await service.createList({name:'Nova lista',items:[],stages:[]});
 const insert=logs.find(x=>x.kind==='insert');
 assert.equal(insert.payload.owner_id,uid);
 assert.equal(insert.payload.name,'Nova lista');
 await service.createList({id, name:'UUID estável',items:[],stages:[]});
 const chosen=logs.filter(x=>x.kind==='insert').at(-1);
 assert.equal(chosen.payload.id,id,'criação integrada usa UUID gerado pelo Motor de Listas');
 const retrieved=await service.get(id);assert.equal(retrieved.id,id);
 const item={id:'material-1',name:'Condutor',qty:30,unit:'m',stage:'Geral',values:{}};
 const updated=await service.updateList(id,1,{name:'Obra A',items:[item],stages:['Geral']});
 assert.equal(updated.version,2);
 assert.deepEqual(updated.items,[item]);
 const update=logs.find(x=>x.kind==='update');
 assert.ok(update.filters.some(([key,value])=>key==='version'&&value===1),'gravação com proteção contra conflito');
 assert.equal(update.payload.owner_id,undefined,'sem alterar proprietário');
 assert.equal(update.payload.version,undefined,'versão gerada apenas no banco');
 failConflict=true;
 await assert.rejects(service.updateList(id,1,{name:'Obra A',items:[],stages:[]}),/modificada em outro aparelho/);
 const page=fs.readFileSync(path.join(__dirname,'../listas/nuvem/lab.html'),'utf8');
 const ui=fs.readFileSync(path.join(__dirname,'../listas/nuvem/lab.js'),'utf8');
 const central=fs.readFileSync(path.join(__dirname,'../laboratorios/index.html'),'utf8');
 assert.ok(page.includes('id="save-list"')&&page.includes('id="item-dialog"'));
 assert.ok(central.includes('../?view=lists')&&central.includes('../?view=create'),'usuário navega somente pelo motor unificado');
 assert.ok(!central.includes('class="cloud-test"'),'laboratório técnico não concorre com Minhas listas');
 assert.ok(ui.includes('cloud.updateList')&&ui.includes('client.auth.getUser()'));
 assert.ok(!ui.includes('localStorage'),'laboratório não importa lista local');
 console.log('TEREON X: Listas na Nuvem — contratos e conflitos OK');
})().catch(e=>{console.error(e);process.exitCode=1});
