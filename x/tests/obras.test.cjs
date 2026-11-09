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
  is(column,value){(c.nullFilters??=[]).push([column,value]);return q},
  not(column,operator,value){(c.notFilters??=[]).push([column,operator,value]);return q},
  order(){return Promise.resolve({data:c.table==='x_workspaces'&&c.filters.some(([k])=>k==='owner_id')?[{id:space,name:'Meu espaço',kind:'personal'}]:[],error:null})},
  in(column,values){(c.inFilters??=[]).push([column,values]);return q},
  single(){return Promise.resolve({data:{id:work,...(c.insert||{})},error:null})},
  maybeSingle(){return Promise.resolve({data:{id:work,...(c.update||{})},error:null})}
 };return q;
};
const client={auth:{getUser:async()=>({data:{user:{id:uid}},error:null})},from};
(async()=>{
 assert.deepEqual(works.validateWork({name:' Escola A ',description:' Texto ',status:'active'}),{name:'Escola A',description:'Texto',status:'active',planned_start:null,planned_end:null});
 assert.throws(()=>works.validateWork({name:' ',status:'active'}),/nome de obra/);
 assert.throws(()=>works.validateWork({name:'A',status:'invalid'}),/Situação/);
 assert.throws(()=>works.validateWork({name:'A',planned_start:'2026-11-12',planned_end:'2026-11-10'}),/anterior/);
 assert.throws(()=>works.validateWork({name:'A',planned_start:'2026-02-30'}),/Data inválida/);
 assert.deepEqual([works.validateWork({name:'A',planned_start:'2026-11-08',planned_end:''}).planned_start,works.validateWork({name:'A'}).planned_end],['2026-11-08',null]);
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
 assert.equal(calls[3].insert.planned_start,null);
 await service.updateWork(work,{name:'Obra A',description:'Teste',status:'active'});
 assert.deepEqual(calls[4].update,{name:'Obra A',description:'Teste',status:'active',planned_start:null,planned_end:null});
 assert.deepEqual(calls[4].filters,[['id',work]]);
 await service.archive(work,{name:'Obra A',description:'Teste',status:'active'});
 assert.equal(calls[5].update.status,'archived');
 await service.updateSpace(space,' Escritório ');
 assert.deepEqual(calls[6].update,{name:'Escritório'});
 assert.ok(calls[6].filters.some(([k,v])=>k==='owner_id'&&v===uid));
 await service.removeWork(work);
 assert.ok(calls[7].update.deleted_at,'exclusão preserva dados com data');
 await service.removeSpace(space);
 assert.ok(calls[8].update.deleted_at);
 await service.trash('spaces');
 await service.trash('works',space);
 await service.restore('works',work);
 assert.equal(calls[11].update.deleted_at,null);
 await service.restore('spaces',space);
 assert.equal(calls[12].update.deleted_at,null);
 await service.listAll();
 assert.equal(calls[13].table,'x_workspaces');
 assert.equal(calls[14].table,'x_works');
 assert.deepEqual(calls[14].inFilters,[['workspace_id',[space]]]);
 assert.deepEqual(calls[14].nullFilters,[['deleted_at',null]]);
 assert.equal(calls.length,15);
 assert.ok(calls.every(x=>!x.delete),'nenhuma exclusão permanente');
 const lab=fs.readFileSync(path.join(__dirname,'../universo/obras/lab.js'),'utf8');
 const page=fs.readFileSync(path.join(__dirname,'../universo/obras/lab.html'),'utf8');
 assert.ok(lab.includes('client.auth.getSession()'),'sem sessão deve oferecer login');
 assert.ok(!page.includes('../listas/'),'obras não deve carregar Listas');
 assert.ok(!page.includes('localStorage'),'obras não grava dados locais de Listas');
 assert.ok(page.includes('motor.js'));
 assert.ok(page.includes('id="work-dialog"')&&page.includes('id="space-dialog"'),'cadastros usam modais');
 assert.ok(page.includes('id="trash-content"'),'lixeira visível por demanda');
 const css=fs.readFileSync(path.join(__dirname,'../universo/obras/lab.css'),'utf8');
 assert.ok(css.includes('color-scheme:light'),'tema claro alinhado ao X');
 assert.ok(lab.includes('works.updateSpace')&&lab.includes('works.removeSpace'));
 assert.ok(lab.includes('works.listAll()')&&lab.includes('works.createWork'));
 assert.ok(page.includes('id="work-start"')&&page.includes('id="work-end"')&&page.includes('id="work-workspace"'));
 const hub=fs.readFileSync(path.join(__dirname,'../laboratorios/index.html'),'utf8');
 assert.ok(hub.includes("location.replace('/x/'"),'antiga Central encaminha para o Início único');
 assert.ok(lab.includes('works.removeWork')&&lab.includes('works.restore'));
 const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
 const central=read('laboratorios/index.html');
 assert.ok(read('components/header.js').includes('href="/x/identidade/lab.html"'),'perfil no cabeçalho compartilhado');
 assert.ok(!central.includes('class="tile" href="../identidade/'),'perfil não é card');
 for(const p of ['identidade/lab.html','compartilhar-usuarios/lab.html','universo/obras/lab.html']){
   assert.ok(read(p).includes('data-tx-header="module"')&&read(p).includes('data-back-href="/x/"'),'retorno padronizado ao Início em '+p);
 }
 for(const p of ['identidade/lab.css','compartilhar-usuarios/lab.css','universo/obras/lab.css']){
   assert.ok(read(p).includes('color-scheme:light'),'tema claro em '+p);
   assert.ok(!read(p).includes('color-scheme:dark'),'não regressar a tema escuro em '+p);
 }
 console.log('TEREON X: motor isolado de Obras e contratos básicos OK');
})().catch(e=>{console.error(e);process.exitCode=1});
