/* TEREON X — teste do modal aprovado ligado às fichas reais.
 * DOM simulado: exercita cliques e callbacks reais da apresentação.
 */
'use strict';
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const data=JSON.parse(read('x/fichario-x/fichas-lab-2026-11-12.json'));
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
new vm.Script(read('x/listas/quantificacao.js')).runInContext(context);
context.fetch=async url=>{
 assert.ok(url.includes('fichas-lab-2026-11-12.json'),'catálogo do laboratório deve ler snapshot experimental sem sobrescrever fonte');
 return {ok:true,json:async()=>clone(data)};
};
new vm.Script(read('x/listas/app.js')).runInContext(context);
function click(selector,attrs={}){
 const target={dataset:attrs,closest:s=>s===selector?target:null};
 if(['[data-ficha]','[data-pick]','[data-skip-optional]'].includes(selector))element('choices').listeners.click({target});
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
 assert.equal(element('fieldLabel').textContent,'Diâmetro nominal · PVC','condicional de diâmetro no laboratório');
 // A barra representa TODOS os detalhes aplicáveis, inclusive o opcional.
 const progress=element('progress').innerHTML;
 assert.equal((progress.match(/class="segment/g)||[]).length,4,'4 posições: Tipo, Material, Diâmetro e Tipo ponta opcional');
 assert.equal((progress.match(/ optional/g)||[]).length,1,'detalhe opcional também entra no progresso');
 assert.equal((progress.match(/ done/g)||[]).length,2,'apenas valores confirmados são preenchidos');
 assert.ok(!progress.includes('data-detail-index'),'progresso é informativo, não navegável');
 // Todos os detalhes visíveis têm tags, preenchidas ou atenuadas.
 const mapped=element('tags').innerHTML;
 assert.equal((mapped.match(/class="tag selected-detail-tag/g)||[]).length,4,'uma tag para cada detalhe aplicável');
 assert.equal((mapped.match(/ is-selected/g)||[]).length,2,'duas tags confirmadas');
 assert.equal((mapped.match(/ is-pending/g)||[]).length,2,'diâmetro e tipo ponta aparecem atenuados');
 assert.ok(mapped.includes('class="tag-caption">Ø</span>'),'Diâmetro pendente usa símbolo técnico compacto');
 assert.ok(mapped.includes('class="tag-caption">Ponta</span>'),'Tipo ponta opcional usa nome curto');
 assert.ok(mapped.includes('aria-label="Selecionar Diâmetro nominal · PVC (não selecionado)"'),'nome completo fica acessível');
 assert.ok(mapped.includes('class="tag-caption">Rígido</span>'),'tag selecionada continua mostrando valor');
 assert.ok(mapped.includes('data-edit-tag="DET-011"'),'Tipo ponta opcional também pode ser aberto');
 assert.ok(!mapped.includes('data-remove="DET-011"'),'pendente não pode ser removido');
 assert.ok(mapped.includes('data-remove="DET-002"'),'apenas preenchido possui ×');
 // As próprias tags são atalhos; apenas o × remove.
 assert.ok(!element('progress').innerHTML.includes('data-detail-index'),'progresso voltou a ser somente informativo');
 assert.ok(element('tags').innerHTML.includes('data-edit-tag="DET-001"'),'Tipo oferece navegação');
 assert.ok(element('tags').innerHTML.includes('data-edit-tag="DET-002"'),'Material oferece navegação');
 assert.ok(element('tags').innerHTML.includes('data-remove="DET-002"'),'× independente continua acessível');
 const nameBefore=element('liveName').textContent;
 function actOnTag(action,id){
  const button={dataset:{[action==='edit'?'editTag':'remove']:id},
   closest:selector=>selector===(action==='edit'?'[data-edit-tag]':'[data-remove]')?button:null};
  element('tags').listeners.click({target:button});
 }
 actOnTag('edit','DET-011');
 assert.equal(element('fieldLabel').textContent,'Tipo ponta','tocar na tag apagada abre o opcional ainda não preenchido');
 assert.ok(element('progress').innerHTML.includes(' optional'),'progresso continua mostrando o opcional');

 assert.ok(element('tags').innerHTML.includes('data-edit-tag="DET-004"'),'tag de diâmetro pendente ainda visível');
 assert.ok(!element('tags').innerHTML.includes('data-remove="DET-011"'),'navegar para pendente não confirma valor');
 assert.equal(element('saveItem').disabled,true,'navegação não preenche diâmetro');
 actOnTag('edit','DET-004');
 assert.equal(element('fieldLabel').textContent,'Diâmetro nominal · PVC','tag pendente de diâmetro abre seu detalhe');
 actOnTag('edit','DET-001');
 assert.equal(element('fieldLabel').textContent,'Tipo','tocar na tag Rígido retorna ao detalhe Tipo');
 assert.equal(element('liveName').textContent,nameBefore,'navegar não altera nome nem confirma nova opção');
 assert.ok(element('tags').innerHTML.includes('data-edit-tag="DET-002"'),'navegar não apaga Material');
 actOnTag('edit','DET-002');
 assert.equal(element('fieldLabel').textContent,'Material','tocar na tag PVC retorna ao detalhe Material');
 assert.ok(element('choices').innerHTML.includes('data-pick="PVC"'),'detalhe confirmado pode ser revisto');
 choice('PVC');
 assert.equal(element('fieldLabel').textContent,'Diâmetro nominal · PVC','a seleção normal continua avançando');
 assert.ok(!element('choices').innerHTML.includes('data-pick="Aço"'),'não oferece material de aço ao selecionar detalhe PVC');
 assert.equal(element('saveItem').disabled,true,'sem diâmetro o eletroduto permanece incompleto');
 choice('3/4"');
 assert.equal(element('saveItem').disabled,false,'diâmetro confirmado libera apenas a simulação');
 element('tags').listeners.click({target:{dataset:{remove:'DET-002'},closest:s=>s==='[data-remove]'?{dataset:{remove:'DET-002'}}:null}});
 assert.equal(element('fieldLabel').textContent,'Material','remover obrigatória retorna à seleção correta');
 assert.equal(element('saveItem').disabled,true,'remover obrigatória bloqueia adicionar');
 choice('PVC');
 assert.equal(element('saveItem').disabled,true,'remoção de material também invalidou diâmetro associado');
 choice('3/4"');
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
 // Condutores: pergunta real DET-010, vinda da planilha, por último.
 click('[data-ficha]',{ficha:'FT_COND-001'});
 assert.equal(element('fieldLabel').textContent,'Tipo');
 choice('Condutor isolado');
 assert.equal(element('fieldLabel').textContent,'Material');
 choice('Cobre');
 assert.equal(element('fieldLabel').textContent,'Seção');
 choice('2,5');
 assert.equal(element('fieldLabel').textContent,'Isolação');
 choice('Termoplástico não halogenado 70 °C');
 assert.equal(element('fieldLabel').textContent,'Cor');
 choice('Preto');
 assert.equal(element('saveItem').disabled,false);
 assert.ok(!element('fieldHelp').innerHTML.includes('lszh-review'),'sem painel sobreposto');
 assert.equal(element('fieldLabel').textContent,'Classe de tensão');
 click('[data-skip-optional]',{skipOptional:'DET-006'});
 assert.equal(element('fieldLabel').textContent,'Classe de encordoamento');
 click('[data-skip-optional]',{skipOptional:'DET-009'});
 assert.equal(element('fieldLabel').textContent,'Comportamento ao fogo');
 assert.ok(element('choices').innerHTML.includes('data-pick="Comum"'));
 assert.ok(element('choices').innerHTML.includes('data-pick="Não halogenado com baixa emissão de fumaça (LSZH)"'));
 assert.ok(!element('liveName').textContent.includes('LSZH'),'não presume classificação');
 choice('Não halogenado com baixa emissão de fumaça (LSZH)');
 assert.ok(element('liveName').textContent.includes('LSZH'));
 assert.ok(element('unit').innerHTML.includes('3 lances'),'DET-011 alimenta seletor existente');
 assert.equal(element('fieldLabel').textContent,'Unidade','DET-011 aparece como etapa opcional após comportamento ao fogo');
 assert.ok(element('choices').innerHTML.includes('data-pick="3 lances"'));
 choice('3 lances');
 assert.equal(element('unit').value,'3 lances','escolher detalhe sincroniza campo Unidade');
 element('qty').value='150';element('qty').listeners.input();
 assert.ok(element('stageTags').innerHTML.includes('3 lances de 50 m'),'prévia de comprimento por lance');
 element('saveItem').listeners.click();
 const namedItem=stored.lists[0].items.at(-1);
 assert.equal(namedItem.catalogId,'FT_COND-001');
 assert.equal(namedItem.values['DET-010'],'Não halogenado com baixa emissão de fumaça (LSZH)');
 assert.ok(!Object.hasOwn(namedItem.values,'DET-LSZH'));
 assert.ok(namedItem.name.includes('LSZH'));
 assert.equal(namedItem.unit,'3 lances');
 assert.equal(namedItem.qtyBasis,'m');
 assert.equal(namedItem.qty,'150');
 assert.equal(namedItem.values['DET-011'],'3 lances');
 console.log('TEREON X: 6 fichas reais → modal aprovado → condição → tags → salvar → editar e legado OK');
})().catch(error=>{console.error(error);process.exitCode=1});
