/* TEREON X — teste do modal aprovado ligado às fichas reais.
 * DOM simulado: exercita cliques e callbacks reais da apresentação.
 */
'use strict';
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const data=JSON.parse(read('x/fichario-x/fichas-drive-2026-11-08.json'));
const elements=new Map(),documentEvents={};
function element(id){
 if(!elements.has(id))elements.set(id,{
  id,innerHTML:'',textContent:'',value:'',disabled:false,open:false,listeners:{},
  nextElementSibling:{textContent:''},
  classList:{toggle(name,enabled){this[name]=enabled}},
  insertAdjacentHTML(position,html){this.innerHTML+=html},
  addEventListener(event,handler){this.listeners[event]=handler},
  querySelectorAll(){return []},
  showModal(){this.open=true},close(){this.open=false;this.listeners.close?.()},focus(){}
 });
 return elements.get(id);
}
const doc={
 getElementById:element,querySelectorAll:()=>[],
 addEventListener(event,handler){documentEvents[event]=handler}
};
let stored={lists:[{id:'lista-1',name:'Lista de ensaio',items:[],stages:[]}]},nextId=1;
const clone=x=>JSON.parse(JSON.stringify(x));
const repository={snapshot:()=>clone(stored),save:value=>{stored=clone(value)}};
const listService={
 snapshot:repository.snapshot,get:id=>clone(stored.lists.find(x=>x.id===id)||null),
 createList(name){const id='list-'+(++nextId);stored.lists.push({id,name,items:[],stages:[]});return id},
 upsertItem(id,entry,itemId){
  const l=stored.lists.find(x=>x.id===id);
  assert.ok(l);
  const item={id:itemId||'item-'+(++nextId),...clone(entry)};
  const old=l.items.findIndex(x=>x.id===itemId);
  if(old<0)l.items.push(item);else l.items[old]=item;
  if(!l.stages.includes(item.stage))l.stages.push(item.stage);
  return item.id;
 },
 exportList(){return {}},duplicateItem(){},removeItem(){}
};
const window={
 location:{search:'?view=lists'},TereonXListStore:{create:()=>repository},
 TereonXLists:{create:()=>listService},TereonXCatalog:null,
 TereonXListIntegration:{create:()=>{throw Error('não deveria acessar conta neste teste')}}
};
const context={window,document:doc,URLSearchParams,console,alert:message=>{throw Error(message)},confirm:()=>true};
vm.createContext(context);
new vm.Script(read('x/catalogo/motor.js')).runInContext(context);
context.fetch=async url=>{
 assert.ok(url.includes('fichas-drive-2026-11-08.json'),'fonte deve ser a planilha, não o catálogo hipotético');
 return {ok:true,json:async()=>clone(data)};
};
new vm.Script(read('x/listas/app.js')).runInContext(context);
function click(selector,attrs={}){
 const target={dataset:attrs,closest:s=>s===selector?target:null};
 if(['[data-ficha]','[data-pick]','[data-ficha-back]'].includes(selector))element('choices').listeners.click({target});
 else documentEvents.click({target});
}
function choice(v){
 click('[data-pick]',{pick:v});
}
(async()=>{
 await window.TereonXAppActivateAccount(null,null);
 click('[data-open]',{open:'lista-1'});
 assert.ok(element('listDialog').open,'lista abriu no modal aprovado');
 click('[data-action]',{action:'add'});
 assert.ok(element('addDialog').open,'adicionar abriu o addDialog aprovado');
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(element('liveName').textContent,'Selecione um material');
 assert.ok(element('choices').innerHTML.includes('FT_INFRA-001'),'fichário mostra eletroduto');
 assert.ok(element('choices').innerHTML.includes('FT_INFRA-004'),'fichário mostra abraçadeiras');
 assert.equal(element('saveItem').disabled,true,'sem escolher ficha não pode salvar');
 click('[data-ficha]',{ficha:'FT_INFRA-001'});
 assert.equal(element('fieldLabel').textContent,'Tipo');
 assert.ok(element('fieldLabel').innerHTML.includes('data-ficha-back="1"'),'Trocar material é tag junto ao detalhe Tipo');
 assert.ok(!element('choices').innerHTML.includes('data-ficha-back'),'Trocar material não ocupa espaço nas opções');
 choice('Rígido');
 assert.equal(element('fieldLabel').textContent,'Material');
 choice('PVC');
 assert.equal(element('fieldLabel').textContent,'Diâmetro PVC','condicional verdadeiro da planilha');
 assert.ok(!element('choices').innerHTML.includes('data-pick="Aço"'),'não oferece material de aço ao selecionar detalhe PVC');
 assert.equal(element('saveItem').disabled,false,'obrigatórios da ficha estão confirmados');
 element('tags').listeners.click({target:{dataset:{remove:'DET-002'},closest:s=>s==='[data-remove]'?{dataset:{remove:'DET-002'}}:null}});
 assert.equal(element('fieldLabel').textContent,'Material','remover obrigatória retorna à seleção correta');
 assert.equal(element('saveItem').disabled,true,'remover obrigatória bloqueia adicionar');
 choice('PVC');
 assert.equal(element('saveItem').disabled,false);
 element('saveItem').listeners.click();
 assert.equal(stored.lists[0].items.length,1);
 const saved=stored.lists[0].items[0];
 assert.equal(saved.catalogId,'FT_INFRA-001','identidade da ficha persistida');
 assert.equal(saved.simulacao,false,'ficha real em revisão não é ficha hipotética');
 assert.equal(saved.fichaStatus,'Em revisão','ficha não foi homologada');
 assert.equal(saved.values['DET-001'],'Rígido');
 assert.equal(saved.values['DET-002'],'PVC');
 assert.ok(saved.name.startsWith('Eletroduto'),'nome formado pela ficha');
 assert.equal(element('addDialog').open,false);
 assert.equal(element('listDialog').open,true,'modal de lista continua aberto após salvar');
 click('[data-edit]',{edit:saved.id});
 await new Promise(resolve=>setImmediate(resolve));
 assert.ok(element('addDialog').open,'edição usa o mesmo modal aprovado');
 assert.equal(element('liveName').textContent,saved.name);
 assert.equal(element('saveItem').disabled,false);
 // Um item anterior sem catalogId permanece editável no modal aprovado.
 element('addDialog').close();
 stored.lists[0].items.push({id:'legado-1',name:'Condutor elétrico',values:{material:'Cobre'},qty:'10',unit:'m',stage:'Geral'});
 click('[data-edit]',{edit:'legado-1'});
 assert.ok(element('addDialog').open,'registro anterior continua abrindo');
 assert.equal(element('fieldLabel').textContent,'Formação','registro sem ficha conserva seus campos existentes');
 element('addDialog').close();
 click('[data-action]',{action:'add'});
 await new Promise(resolve=>setImmediate(resolve));
 click('[data-ficha]',{ficha:'FT_INFRA-001'});
 assert.ok(element('fieldLabel').innerHTML.includes('data-ficha-back="1"'));
 click('[data-ficha-back]',{fichaBack:'1'});
 assert.equal(element('fieldLabel').textContent,'Escolher material','remover tag retorna à escolha de ficha');
 assert.equal(element('addDialog').classList['is-choosing'],true,'modo de seleção usa área ampliada');
 assert.equal(element('saveItem').disabled,true,'trocar ficha impede salvamento sem nova confirmação');
 console.log('TEREON X: 6 fichas reais → modal aprovado → condição → tags → salvar → editar e legado OK');
})().catch(error=>{console.error(error);process.exitCode=1});
