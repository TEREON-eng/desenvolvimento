/* Contrato de uma interface Listas com armazenamento local ou nuvem. */
'use strict';
const assert=require('node:assert/strict');
const integration=require('../listas/integracao.js');
const copy=x=>JSON.parse(JSON.stringify(x));
const uid='eaf3d241-419b-4c2e-a188-f793eec2a050';
function makeStore(initial){let state=copy(initial||{lists:[]});return {snapshot:()=>copy(state),save:next=>{state=copy(next);return copy(state)}}}
function makeCloud(initial=[]){
 const records=new Map(initial.map(x=>[x.id,copy(x)])),calls=[];
 return {
  calls,records,
  async list(){calls.push('list');return [...records.values()].map(copy)},
  async get(id){return copy(records.get(id))},
  async createList(p){
   calls.push('create');
   if(records.has(p.id))throw Object.assign(new Error('Duplicado'),{code:'23505'});
   const r={...copy(p),version:1,id:p.id};
   records.set(r.id,r);return copy(r);
  },
  async updateList(id,version,p){
   calls.push('update');
   const old=records.get(id);
   if(!old||old.version!==version)throw Error('Esta lista foi modificada em outro aparelho. Atualize antes de salvar para não sobrescrever alterações.');
   const row={...copy(p),id,version:old.version+1};
   records.set(id,row);return copy(row);
  }
 };
}
const wait=()=>new Promise(resolve=>setImmediate(resolve));
(async()=>{
 const initial={id:uid,name:'Lista no PC',items:[{id:'a',name:'Condutor',qty:20,unit:'m',stage:'Geral'}],stages:['Geral'],version:1};
 const cloud=makeCloud([initial]),cache=makeStore(),sync=integration.create({store:cache,cloud});
 await sync.refresh();
 assert.equal(sync.repository.snapshot().lists.length,1,'lista online aparece na mesma interface');
 assert.equal(sync.repository.snapshot().lists[0].recordUid,uid);
 const next=sync.repository.snapshot();next.lists[0].name='Lista editada';
 sync.repository.save(next);await wait();await sync.flush();await wait();
 assert.equal(cloud.records.get(uid).name,'Lista editada');
 assert.equal(cache.snapshot().lists[0].cloudPending,false);
 assert.equal(cache.snapshot().lists[0].cloudVersion,2);
 const id2='eaf3d241-419b-4c2e-a188-f793eec2a051';
 const add=sync.repository.snapshot();
 add.lists.push({id:'local-1',recordUid:id2,name:'Nova lista',items:[],stages:[]});
 sync.repository.save(add);await wait();await sync.flush();
 assert.equal(cloud.records.get(id2).name,'Nova lista');
 assert.equal(cache.snapshot().lists.find(x=>x.recordUid===id2).cloudPending,false);
 const stale=sync.repository.snapshot();
 stale.lists[0].name='Mudança no celular';
 cloud.records.get(uid).version=10;
 sync.repository.save(stale);await wait();await sync.flush();
 assert.equal(cloud.records.get(uid).name,'Lista editada','conflito não sobrescreve nuvem');
 assert.equal(cache.snapshot().lists[0].name,'Mudança no celular','edição local permanece intacta');
 assert.equal(cache.snapshot().lists[0].cloudConflict,true,'conflito fica visível');
 sync.stop();
 assert.throws(()=>sync.repository.save({lists:[]}),/Conta alterada/);
 const guest=makeStore({lists:[{id:'avulsa',name:'Só neste aparelho',items:[],stages:[]}]});
 assert.equal(guest.snapshot().lists[0].name,'Só neste aparelho');
 assert.equal(cache.snapshot().lists.some(l=>l.name==='Só neste aparelho'),false,'dados avulsos não entram na conta automaticamente');
 const offlineStore=makeStore(),offlineCloud=makeCloud();
 offlineCloud.createList=async()=>{throw Error('Sem internet')};
 const offline=integration.create({store:offlineStore,cloud:offlineCloud});
 await offline.refresh(); // nuvem vazia: serviço pronto
 const offlineList=offline.repository.snapshot();
 offlineList.lists.push({id:'offline-1',recordUid:'eaf3d241-419b-4c2e-a188-f793eec2a060',name:'Teste sem rede',items:[],stages:[]});
 offline.repository.save(offlineList);
 await wait();await offline.flush();
 assert.equal(offlineStore.snapshot().lists[0].cloudPending,true,'falha de rede preserva pendência local');
 assert.equal(offlineStore.snapshot().lists[0].name,'Teste sem rede');
 assert.equal(offline.status().error,'Sem internet');
 assert.equal(offline.status().pending,1,'pendência não some só porque a rede parece online');
 offlineCloud.createList=makeCloud().createList;
 await offline.refresh();
 assert.equal(offlineStore.snapshot().lists[0].cloudPending,false,'reenvio confirmado limpa a pendência');
 assert.equal(offline.status().pending,0,'aviso deve sumir somente após confirmação remota');
 assert.equal(offline.status().error,'','erro anterior desaparece após envio confirmado');
 offline.stop();
 console.log('TEREON X: interface única, gravação na nuvem e conflito de versões OK');
})().catch(e=>{console.error(e);process.exitCode=1});
