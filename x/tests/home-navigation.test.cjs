/* TEREON X — regressão do Início único e criação direta em modal.
 * Usa DOM simulado, sem alterar o banco e sem mexer no catálogo técnico.
 */
'use strict';
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'../..',p),'utf8');
const html=read('x/index.html');
assert.ok(html.includes('id="homeScreen"')&&html.includes('id="listsScreen"'));
assert.ok(html.includes('href="/x/escola/"')&&html.includes('href="/x/universo/obras/lab.html"'));
const home=html.slice(html.indexOf('<section id="homeScreen"'),html.indexOf('<section id="listsScreen"'));
assert.ok(home.includes('data-action="lists"')&&home.includes('Listas de materiais'),'Início oferece acesso à ferramenta Listas');
assert.ok(!home.includes('data-action="create"'),'Início não oferece ação operacional Criar lista');
assert.ok(home.includes('id="homeListCount"'),'contagem de listas preservada no card');
const copy=x=>JSON.parse(JSON.stringify(x));
function scenario(search){
 const elements=new Map(),handlers={};
 function el(id){
  if(!elements.has(id))elements.set(id,{
   id,hidden:false,open:false,value:'',textContent:'',innerHTML:'',listeners:{},dataset:{},
   addEventListener(type,cb){this.listeners[type]=cb},focus(){},
   showModal(){this.open=true},close(){this.open=false;this.listeners.close?.()},
  });return elements.get(id);
 }
 const doc={
  getElementById:el,querySelectorAll:()=>[],
  addEventListener(type,cb){handlers[type]=cb}
 };
 let state={lists:[]},counter=0;
 const repository={snapshot:()=>copy(state),save:v=>{state=copy(v)}};
 const service={
  snapshot:repository.snapshot,get:id=>copy(state.lists.find(x=>x.id===id)||null),
  createList(name){const id='new-'+(++counter);state.lists.push({id,name,items:[],stages:[]});return id},
  upsertItem(){},exportList(){},duplicateItem(){},removeItem(){}
 };
 const history=[];
 const win={location:{search},history:{replaceState(...a){history.push(a)}},
  TereonXListStore:{create:()=>repository},TereonXLists:{create:()=>service}};
 const context={window:win,document:doc,URLSearchParams,console,alert:m=>{throw Error(m)},confirm:()=>true};
 vm.createContext(context);new vm.Script(read('x/listas/app.js')).runInContext(context);
 function click(action){
  const target={dataset:{action},closest:selector=>selector==='[data-action]'?target:null};
  const event={target,preventDefault(){this.defaultPrevented=true}};
  handlers.click(event);return event;
 }
 return {win,el,click,history,service,activate:()=>win.TereonXAppActivateAccount(null,null),create(name){
  el('newName').value=name;
  el('createForm').listeners.submit({preventDefault(){}});
 },state:()=>copy(state)};
}
(async()=>{
 const ui=scenario('');
 await ui.activate();
 assert.equal(ui.el('homeScreen').hidden,false,'sem view abre Início');
 assert.equal(ui.el('listsScreen').hidden,true);
 assert.equal(ui.el('homeListCount').textContent,'0 lista(s)');
 ui.click('lists');
 assert.equal(ui.el('listsScreen').hidden,false,'acesso à ferramenta abre Minhas listas');
 const e=ui.click('create');
 assert.ok(e.defaultPrevented,'Criar não navega para outra página');
 assert.ok(ui.el('createDialog').open,'Criar abre modal dentro da ferramenta Listas');
 assert.equal(ui.el('listsScreen').hidden,false,'Listas permanece ao fundo');
 ui.create('Teste de duas contas');
 assert.ok(ui.el('listDialog').open,'lista nova abre em modal');
 assert.equal(ui.el('listsScreen').hidden,false,'lista nova continua sobre Minhas listas');
 assert.equal(ui.state().lists.length,1);
 ui.el('listDialog').close();
 assert.equal(ui.el('listsScreen').hidden,false,'fechar lista retorna a Minhas listas');
 assert.equal(ui.el('homeListCount').textContent,'1 lista(s)','contagem atualiza');
 ui.click('lists');
 assert.equal(ui.el('homeScreen').hidden,true,'Minhas listas é outro estado, sem outra página');
 assert.equal(ui.el('listsScreen').hidden,false);
 ui.click('create');ui.create('Segunda lista');
 assert.equal(ui.el('homeScreen').hidden,true);
 ui.el('listDialog').close();
 assert.equal(ui.el('listsScreen').hidden,false,'fechar lista retorna a Minhas listas');
 const direct=scenario('?view=create');
 await direct.activate();
 assert.equal(direct.el('homeScreen').hidden,false);
 assert.ok(direct.el('createDialog').open,'link antigo abre modal direto sobre Início');
 assert.ok(direct.history.some(x=>x[2]==='/x/'),'retorna URL canônica');
 const legacy=scenario('?view=lists');
 await legacy.activate();
 assert.equal(legacy.el('listsScreen').hidden,false,'link direto Minhas listas continua válido');
 console.log('TEREON X: Início único, Criar modal e retorno ao contexto OK');
})().catch(error=>{console.error(error);process.exitCode=1});
