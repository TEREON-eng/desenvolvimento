/* TEREON X — apresentação de Listas. Persistência delegada a servico.js */
(function(){
'use strict';
const guestRepository=window.TereonXListStore.create();
let lists=window.TereonXLists.create(guestRepository);
let accountId=null, syncController=null, ready=false, accountSession=0;
const storageKey=id=>'tereon-x-cloud-cache-'+id;
const uuid=()=>{
 const api=globalThis.crypto;
 if(api?.randomUUID)return api.randomUUID();
 if(!api?.getRandomValues)throw Error('Identificação segura indisponível.');
 const bytes=api.getRandomValues(new Uint8Array(16));bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
 const h=Array.from(bytes,n=>n.toString(16).padStart(2,'0')).join('');
 return h.slice(0,8)+'-'+h.slice(8,12)+'-'+h.slice(12,16)+'-'+h.slice(16,20)+'-'+h.slice(20);
};
function syncBanner(){
 if(!accountId)return '<div class="sync-line">Salvo neste aparelho · <a href="/x/identidade/lab.html">Entrar para usar a nuvem</a></div>';
 const status=syncController?.status();
 if(!status)return '<div class="sync-line">Conectando à conta...</div>';
 const text=!status.ready?'Nuvem indisponível · dados deste aparelho preservados':
  status.conflicts?'Conflito de versões: alterações deste aparelho preservadas. '+esc(status.error||'Não foi possível mesclar automaticamente.'):
  status.pending?'Alterações salvas neste aparelho · aguardando nuvem'+(status.error?' · '+esc(status.error):''):
  status.error?'Nuvem indisponível · cópia da conta neste aparelho · '+esc(status.error):
  status.working?'Sincronizando...':'Salvo na nuvem';
 return '<div class="sync-line">'+text+' <button type="button" class="sync-refresh" data-action="sync" aria-label="Atualizar listas da nuvem">↻ Atualizar</button></div>';
}
function refreshView(){if(ready)draw()}
async function activateAccount(userId,cloud){
 const session=++accountSession;
 if(syncController)syncController.stop();
 syncController=null;ready=false;if($('listDialog')?.open)$('listDialog').close();page=initialView==='lists'?'lists':'home';listBackdrop=page;activeId=null;
 if(!userId||!cloud){
  accountId=null;lists=window.TereonXLists.create(guestRepository);ready=true;draw();openInitialCreate();return;
 }
 accountId=userId;
 const base=window.TereonXListStore.create({key:storageKey(userId)});
 const integration=window.TereonXListIntegration.create({store:base,cloud,accountId:userId,onStatus:refreshView});
 syncController=integration;
 lists=window.TereonXLists.create(integration.repository);
 draw();
 try{
  await integration.refresh();
 }catch(error){
  if(session!==accountSession)return;
  // Offline: cache fica legível, sem afirmar sincronização concluída.
  console.warn('TEREON X: nuvem indisponível; usando cache por conta',error);
  integration.useCachedData(error);
 }
 if(session!==accountSession)return;
 ready=true;draw();openInitialCreate();
}
function openInitialCreate(){
 if(initialView!=='create')return;
 initialView='';
 $('newName').value='';$('createDialog').showModal();$('newName').focus();
}
window.TereonXAppActivateAccount=activateAccount;
window.TereonXAppRefreshCloud=()=>syncController?.refresh().then(refreshView);

var initialView=(new URLSearchParams(window.location.search).get('view')||'');
var page=initialView==='lists'?'lists':'home',listBackdrop=page,activeId=null,values={},focus=0,editId=null;
var fields=[
 {id:'material',label:'Material do condutor',required:true,options:['Cobre','Alumínio']},
 {id:'formacao',label:'Formação',required:true,options:['Unipolar','Multipolar']},
 {id:'secao',label:'Seção nominal',required:true,options:['1,5 mm²','2,5 mm²','4,0 mm²','6,0 mm²','10,0 mm²']},
 {id:'isolacao',label:'Isolação',required:true,options:['PVC','HEPR','XLPE']},
 {id:'tensao',label:'Tensão nominal',required:true,options:['450/750 V','0,6/1 kV']},
 {id:'cor',label:'Cor',required:true,options:['Preto','Azul','Vermelho','Branco']},
 {id:'classe',label:'Encordoamento',required:false,options:['Classe 2','Classe 5','Classe 6']}
];
const legacyFields=fields;
let selectedFicha=null,choosingFicha=false,fichaSearch='',loadingFichas=false,fichaError='';
var $=function(id){return document.getElementById(id);};
var esc=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(k){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[k];});};
function list(){return lists.get(activeId);}
function safe(op){try{return op();}catch(e){alert('TEREON X: '+e.message);return null;}}
function navigate(target){
 if(target==='list'){
  // A tela anterior permanece intacta atrás do modal da lista.
  listBackdrop=page==='home'?'home':'lists';
  page='list';draw();return;
 }
 if($('listDialog').open)$('listDialog').close();
 activeId=null;page=target;listBackdrop=target;draw();
}
function exitList(){
 if($('listDialog').open)$('listDialog').close();
 activeId=null;page=listBackdrop;draw();
}
$('listDialog').addEventListener('close',function(){
 if(page==='list'){activeId=null;page=listBackdrop;draw();}
});
function draw(){
 if(!ready){$('screen').innerHTML='<p class="muted">Carregando suas listas...</p>';return;}
 var data=lists.snapshot();
 var html='';
 if(page==='home'){
  html='<section class="home-intro"><h1>Início</h1><p>Seu espaço de trabalho no TEREON X · ambiente de desenvolvimento</p></section>'+
   '<nav class="home-heroes" aria-label="Listas de materiais">'+
   '<button type="button" class="home-hero" data-action="lists"><span class="home-icon">☷</span><strong>Minhas listas</strong><small>Consultar e continuar · '+data.lists.length+' lista(s)</small></button>'+
   '<button type="button" class="home-hero primary" data-action="create"><span class="home-icon">＋</span><strong>Criar lista</strong><small>Começar uma nova lista</small></button></nav>'+
   '<p class="home-section-head">FERRAMENTAS E ÁREAS</p>'+
   '<nav class="home-grid" aria-label="Módulos do TEREON X">'+
   '<div class="home-tile disabled" aria-label="Dimensionamento em preparação"><span class="home-icon">▤</span><strong>Dimensionamento</strong><span>Cálculos e especificação orientada.</span><small>Em preparação</small></div>'+
   '<div class="home-tile disabled" aria-label="Canivete em preparação"><span class="home-icon">⚒</span><strong>Canivete</strong><span>Ferramentas técnicas rápidas.</span><small>Em preparação</small></div>'+
   '<a class="home-tile" href="/x/universo/obras/lab.html"><span class="home-icon">▥</span><strong>Universo</strong><span>Obras e acompanhamento.</span></a>'+
   '<a class="home-tile" href="/x/escola/"><span class="home-icon">▱</span><strong>Escola</strong><span>Aprendizagem e Biblioteca.</span></a></nav>';
 }else if(page==='lists'){
  html='<div class="row"><h1>Minhas listas</h1><button class="btn small" data-action="create">＋ Nova</button></div><div class="stack">';
  if(!data.lists.length)html+='<div class="empty">Nenhuma lista criada ainda.</div>';
  data.lists.forEach(function(x){html+='<button class="listrow" data-open="'+esc(x.id)+'"><span><strong>'+esc(x.name)+'</strong><br><small class="muted">'+x.items.length+' lançamento(s)</small></span><span>›</span></button>';});
  html+='</div>';
 }else if(page==='list'){
  var l=list();if(!l){exitList();return;}
  html='<div class="row list-detail-header"><div><button class="btn ghost small list-return" data-action="lists" aria-label="Voltar para a tela anterior">'+(listBackdrop==='home'?'← Início':'← Minhas listas')+'</button><h1>'+esc(l.name)+'</h1><span class="tiny muted">'+l.items.length+' lançamento(s)</span></div><button class="btn ghost small" data-action="lists" aria-label="Fechar lista">✕</button></div>'+
   '<div style="margin-top:20px"><button class="btn primary full" data-action="add">＋ Adicionar item</button></div>'+ 
   '<div style="margin-top:10px"><button class="btn full" data-action="share">↗ Compartilhar lista</button></div>'+ 
   '<div style="margin-top:10px;text-align:right"><a href="/x/contribuir.html" style="color:#4f6f59;font-size:12px">Não encontrou o material? Envie seu item para nós ›</a></div>'+
   '<div class="row" style="margin-top:26px"><strong style="font-size:14px">Materiais da lista</strong><span class="tiny muted">'+l.items.length+' item(ns)</span></div><div class="items">';
  if(!l.items.length)html+='<div class="empty">Nenhum material adicionado.</div>';
  l.items.slice().reverse().forEach(function(it){html+='<div class="item"><div><strong>'+esc(it.name)+'</strong><small>'+esc(it.stage)+'</small></div><aside><strong>'+esc(it.qty)+' '+esc(it.unit)+'</strong><div class="item-actions">'+
 '<button class="item-icon" type="button" data-edit="'+esc(it.id)+'" aria-label="Editar item" title="Editar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L9 17l-4 1 1-4z"/></svg></button>'+
 '<button class="item-icon" type="button" data-duplicate="'+esc(it.id)+'" aria-label="Duplicar item" title="Duplicar"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg></button>'+
 '<button class="item-icon remove" type="button" data-delete="'+esc(it.id)+'" aria-label="Remover item" title="Remover"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>'+
 '</div></aside></div>';});
  html+='</div>';
 }
 if(page==='home'||page==='lists'||page==='list'){
  html=syncBanner()+html;
  if(page==='lists'&&accountId&&guestRepository.snapshot().lists.length){
   const already=syncController?.guestImported();
   if(!already)html+='<button class="btn small" style="margin-top:14px" type="button" data-action="import">Trazer listas deste aparelho para minha conta</button>';
  }
 }
 if(page==='list'){
  $('listContent').innerHTML=html;
  if(!$('listDialog').open)$('listDialog').showModal();
 }else{
  $('screen').innerHTML=html;
 }
}
function name(){
 if(selectedFicha)return window.TereonXCatalog.technicalName(selectedFicha,values);
 return 'Condutor elétrico'+(values.formacao?' '+values.formacao.toLowerCase():'')+
 (values.material?' de '+values.material.toLowerCase():'')+(values.secao?' · # '+values.secao:'')+
 (values.isolacao?' · '+values.isolacao:'')+(values.tensao?' · '+values.tensao:'')+
 (values.cor?' · '+values.cor.toLowerCase():'')+(values.classe?' · '+values.classe:'');
}
function getFields(){
 if(!selectedFicha)return legacyFields;
 return window.TereonXCatalog.visibleDetails(selectedFicha,values)
  .filter(d=>d.options.length&&d.name!=='[Detalhe sem nome]')
  .map(d=>({id:d.id,label:d.name,required:d.required,options:d.options}));
}
function count(){return fields.filter(f=>f.required&&values[f.id]).length}
function pickFirstMissing(){
 let i=fields.findIndex(f=>f.required&&!values[f.id]);
 if(i<0)i=fields.findIndex(f=>!values[f.id]);
 return i<0?Math.max(0,fields.length-1):i;
}
function cleanHiddenValues(){
 if(!selectedFicha)return;
 for(const d of selectedFicha.details){
  const status=window.TereonXCatalog.applyRule(d.condition,values,selectedFicha.details);
  if(status.verified&&!status.visible)delete values[d.id];
 }
}
function populateUnitOptions(){
 const known=['m','un','rl','br3m','rl25','rl50','rl100','rl50m','rl100m','rl200m'];
 const current=$('unit').value;
 $('unit').innerHTML=known.map(u=>'<option value="'+u+'">'+u+'</option>').join('');
 if(known.includes(current))$('unit').value=current;
}
function paintFichaChoices(){
 const all=window.TereonXCatalog?.list()||[];
 const q=fichaSearch.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 const candidates=all.filter(f=>(f.name+' '+f.id+' '+f.reference).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(q));
 $('choices').innerHTML='<input id="fichaSearch" class="ficha-search" type="search" autocomplete="off" placeholder="Buscar material ou família..." aria-label="Pesquisar fichas técnicas" value="'+esc(fichaSearch)+'">'+
  (loadingFichas?'<p class="tiny muted">Carregando fichas...</p>':fichaError?'<p class="notice">'+esc(fichaError)+'</p>':candidates.length?candidates.map(f=>
   '<button type="button" class="ficha-option" data-ficha="'+esc(f.id)+'"><strong>'+esc(f.name)+'</strong><small>'+esc(f.id)+' · '+esc(f.status||'Em revisão')+'</small></button>').join(''):
   '<p class="tiny muted">Nenhuma ficha encontrada.</p>');
}
function redrawAdd(){
 $('addDialog').classList.toggle('is-choosing',choosingFicha);
 if(choosingFicha){
  $('liveName').textContent='Selecione um material';
  $('progress').innerHTML='';
  $('counter').textContent=(window.TereonXCatalog?.list()||[]).length+' fichas disponíveis';
  $('counter').nextElementSibling.textContent='Fichário em revisão';
  $('tags').innerHTML='<span class="tiny muted">Selecione uma ficha para iniciar a especificação.</span>';
  $('fieldLabel').textContent='Escolher material';
  $('fieldType').textContent='';
  paintFichaChoices();
  $('fieldHelp').textContent='As fichas determinam os detalhes, valores e condições. Nenhuma escolha técnica é presumida.';
 }else{
  fields=getFields();
  $('liveName').textContent=name();
  const required=fields.filter(x=>x.required);
  $('progress').innerHTML=required.map(x=>'<span class="segment'+(values[x.id]?' done':'')+'"></span>').join('');
  $('counter').textContent=count()+' / '+required.length+' obrigatórios';
  $('counter').nextElementSibling.textContent=selectedFicha?'Ficha em revisão':'Registro anterior';
  $('tags').innerHTML=fields.filter(x=>values[x.id]).map(x=>'<button type="button" class="tag'+(x.required?' required':'')+'" data-remove="'+esc(x.id)+'" title="Remover '+esc(x.label)+'">'+esc(values[x.id])+' ×</button>').join('')||'<span class="tiny muted">As tags confirmadas aparecem aqui.</span>';
  const field=fields[focus];
  $('fieldLabel').textContent=field?.label||'Características';
  if(selectedFicha){
   $('fieldLabel').insertAdjacentHTML('beforeend',' <button type="button" class="tag ficha-trocar" data-ficha-back="1" aria-label="Trocar material '+esc(selectedFicha.name)+'" title="Trocar material">'+esc(selectedFicha.name)+' ×</button>');
  }
  $('fieldType').textContent=field?(field.required?'Obrigatório':'Opcional'):'Sem opções definidas';
  $('choices').innerHTML=field?field.options.map(o=>'<button type="button" class="tag option'+(values[field.id]===o?' on':'')+'" data-pick="'+esc(o)+'">'+esc(o)+'</button>').join(''):'';
  const incomplete=selectedFicha?.pendencias?.length||0;
  $('fieldHelp').textContent=selectedFicha?
   (incomplete?'Ficha em revisão: há '+incomplete+' pendência(s) cadastrais. ':'')+
   (window.TereonXCatalog.missing(selectedFicha,values).length?'Confirme as características obrigatórias para adicionar.':'Obrigatórios confirmados; você pode continuar escolhendo detalhes opcionais.'):
   'Escolha uma opção; a próxima característica aparecerá automaticamente.';
 }
 const current=list();$('stageTags').innerHTML=(current?.stages||[]).map(s=>'<button type="button" class="tag" data-stage="'+esc(s)+'">'+esc(s)+'</button>').join('');
 validate();
}
function validate(){
 const complete=!choosingFicha && (selectedFicha?
  window.TereonXCatalog.missing(selectedFicha,values).length===0 : count()===6);
 $('saveItem').disabled=!(complete&&Number($('qty').value)>0&&$('stage').value.trim());
}
async function openAdd(item){
 if(!list())return;
 editId=item?String(item.id):null;
 values=item&&item.values?Object.assign({},item.values):{};
 fichaSearch='';fichaError='';loadingFichas=!item;
 selectedFicha=null;choosingFicha=!item;
 fields=legacyFields;focus=pickFirstMissing();
 populateUnitOptions();
 $('qty').value=item?String(item.qty):'100';
 $('unit').value=item?String(item.unit):(item?.catalogId==='FT_COND-001'?'m':'un');
 $('stage').value=item?String(item.stage):'Geral';
 $('addTitle').textContent=item?'Editar item':'Adicionar item';
 $('saveItem').textContent=item?'✓ Salvar alterações':'＋ Adicionar à lista';
 if(item?.catalogId)choosingFicha=true;
 redrawAdd();
 $('addDialog').showModal();
 // Edição de registros anteriores continua operando sem depender do fichário remoto.
 if(item&&!item.catalogId)return;
 try{
  await window.TereonXCatalog.load();
  if(!$('addDialog').open)return;
  if(item?.catalogId){
   selectedFicha=window.TereonXCatalog.get(item.catalogId);
   if(!selectedFicha){fichaError='A ficha deste material não existe mais nesta revisão. Não altere o item até verificar a origem.';choosingFicha=true;}
   else{choosingFicha=false;fields=getFields();focus=pickFirstMissing();}
  }
  loadingFichas=false;
  redrawAdd();
 }catch(error){
  fichaError='Não foi possível carregar o fichário: '+error.message;
  loadingFichas=false;choosingFicha=true;redrawAdd();
 }
}
function openCatalogAdd(item){
 if(!list())return;
 const listId=activeId,originalId=item?String(item.id):null;
 if(!window.TereonXCatalogUI){alert('Motor do catálogo indisponível. Atualize a página.');return;}
 window.TereonXCatalogUI.open({item:item||null,onSave:function(entry){
  if(!entry||!entry.catalogId||!entry.name)throw Error('Item inválido');
  lists.upsertItem(listId,entry,originalId);
  draw();
 }}).catch(e=>alert('Erro ao abrir catálogo: '+e.message));
}
function close(id){$(id).close();}
// Retorno global agora é o link HTML do cabeçalho; navegação de Listas preservada nos controles internos.
document.addEventListener('click',function(e){
 if(!ready)return;
 var a=e.target.closest('[data-action]');if(a){
  if(a.dataset.action==='sync'&&syncController){
   syncController.refresh().then(draw).catch(e=>alert('Não foi possível atualizar: '+e.message));return;
  }
  if(a.dataset.action==='import'&&accountId){
   const incoming=guestRepository.snapshot().lists;
   if(!incoming.length)return;
   if(!confirm('Copiar '+incoming.length+' lista(s) deste aparelho para sua conta? As originais serão mantidas no aparelho.'))return;
   const state=syncController.repository.snapshot();
   for(const old of incoming)state.lists.push({id:uuid(),recordUid:uuid(),name:old.name,items:JSON.parse(JSON.stringify(old.items)),stages:JSON.parse(JSON.stringify(old.stages))});
   try{syncController.repository.save(state);syncController.markGuestImported();draw();}
   catch(e){alert('Não foi possível copiar: '+e.message)}
   return;
  }

  if(a.dataset.action==='home'){navigate('home');return;}
  if(a.dataset.action==='create'){$('newName').value='';$('createDialog').showModal();$('newName').focus();}
  if(a.dataset.action==='lists'){exitList();return;}
  if(a.dataset.action==='share'&&list())window.TereonXShare?.open(lists.exportList(activeId));
  if(a.dataset.action==='add')openAdd();
 }
 if(e.target.closest('[data-ficha-back]')){
  selectedFicha=null;choosingFicha=true;values={};fields=legacyFields;focus=0;fichaSearch='';redrawAdd();return;
 }
 var open=e.target.closest('[data-open]');if(open){activeId=open.dataset.open;navigate('list');}
 var edit=e.target.closest('[data-edit]');if(edit&&list()){
  var existing=list().items.find(function(x){return String(x.id)===edit.dataset.edit;});
  if(existing)openAdd(existing);
 }
 var duplicate=e.target.closest('[data-duplicate]');if(duplicate&&list()){
  var source=list().items.find(function(x){return String(x.id)===duplicate.dataset.duplicate;});
  if(source){safe(function(){lists.duplicateItem(activeId,source.id);draw();});}
 }
 var del=e.target.closest('[data-delete]');if(del&&list()&&confirm('Remover este lançamento da lista?')){
  safe(function(){lists.removeItem(activeId,del.dataset.delete);draw();});
 }
});
document.querySelectorAll('[data-close]').forEach(function(el){el.addEventListener('click',function(){close(el.dataset.close);});});
$('createForm').addEventListener('submit',function(e){
 e.preventDefault();var name=$('newName').value.trim();if(!name)return;
 var id=safe(function(){return lists.createList(name);});
 if(!id)return;close('createDialog');activeId=id;navigate('list');
});
$('tags').addEventListener('click',function(e){
 var b=e.target.closest('[data-remove]');if(!b)return;
 delete values[b.dataset.remove];cleanHiddenValues();fields=getFields();
 // Sempre retoma a primeira característica obrigatória ainda pendente,
 // mesmo quando várias tags são removidas em sequência.
 focus=pickFirstMissing();redrawAdd();
});
$('choices').addEventListener('input',function(e){
 if(e.target.id!=='fichaSearch')return;
 fichaSearch=e.target.value;
 const q=fichaSearch.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 $('choices').querySelectorAll('[data-ficha]').forEach(button=>{
  button.hidden=!(button.textContent.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(q));
 });
});
$('choices').addEventListener('click',function(e){
 const select=e.target.closest('[data-ficha]');
 if(select){
  selectedFicha=window.TereonXCatalog.get(select.dataset.ficha);
  if(!selectedFicha)return;
  choosingFicha=false;values={};fields=getFields();focus=pickFirstMissing();
  $('unit').value=selectedFicha.id==='FT_COND-001'?'m':'un';
  redrawAdd();return;
 }
 const b=e.target.closest('[data-pick]');if(!b||!fields[focus])return;
 const field=fields[focus];values[field.id]=b.dataset.pick;
 cleanHiddenValues();fields=getFields();focus=pickFirstMissing();redrawAdd();
});
$('stageTags').addEventListener('click',function(e){var b=e.target.closest('[data-stage]');if(b){$('stage').value=b.dataset.stage;validate();}});
['qty','stage'].forEach(function(x){$(x).addEventListener('input',validate);});
$('saveItem').addEventListener('click',function(){
 var l=list();if(!l||choosingFicha||!(Number($('qty').value)>0)||!$('stage').value.trim())return;
 if(selectedFicha&&window.TereonXCatalog.missing(selectedFicha,values).length)return;
 if(!selectedFicha&&count()!==6)return;
 var itemData={name:name(),catalogId:selectedFicha?.id||null,values:Object.assign({},values),qty:$('qty').value,unit:$('unit').value,stage:$('stage').value.trim(),fichaStatus:selectedFicha?.status||'Ficha anterior',simulacao:selectedFicha?.kind==='simulacao'};
 if(!safe(function(){return lists.upsertItem(activeId,itemData,editId);}))return;
 close('addDialog');editId=null;draw();
});
$('addDialog').addEventListener('cancel',function(){values={};});
draw();
})();
