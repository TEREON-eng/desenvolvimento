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
 syncController=null;ready=false;if($('listDialog')?.open)$('listDialog').close();page=initialView==='home'?'home':'lists';activeId=null;
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
 initialView='lists';
 $('newName').value='';$('createDialog').showModal();$('newName').focus();
}
window.TereonXAppActivateAccount=activateAccount;
window.TereonXAppRefreshCloud=()=>syncController?.refresh().then(refreshView);

var initialView=(new URLSearchParams(window.location.search).get('view')||'');
var page=(initialView==='lists'||initialView==='create')?'lists':'home',activeId=null,values={},focus=0,editId=null;
var fields=[
 {id:'material',label:'Material do condutor',required:true,options:['Cobre','Alumínio']},
 {id:'formacao',label:'Formação',required:true,options:['Unipolar','Multipolar']},
 {id:'secao',label:'Seção nominal',required:true,options:['1,5 mm²','2,5 mm²','4,0 mm²','6,0 mm²','10,0 mm²']},
 {id:'isolacao',label:'Isolação',required:true,options:['PVC','HEPR','XLPE']},
 {id:'tensao',label:'Tensão nominal',required:true,options:['450/750 V','0,6/1 kV']},
 {id:'cor',label:'Cor',required:true,options:['Preto','Azul','Vermelho','Branco']},
 {id:'classe',label:'Encordoamento',required:false,options:['Classe 2','Classe 5','Classe 6']}
];
var $=function(id){return document.getElementById(id);};
var esc=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(k){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[k];});};
function list(){return lists.get(activeId);}
function safe(op){try{return op();}catch(e){alert('TEREON X: '+e.message);return null;}}
function navigate(target){
 if(target==='list'){
  if(page!=='lists'){page='lists';draw();}
  page='list';draw();
  return;
 }
 if($('listDialog').open)$('listDialog').close();
 activeId=null;page=target;draw();
}
function exitList(){
 if($('listDialog').open)$('listDialog').close();
 activeId=null;page='lists';draw();
}
$('listDialog').addEventListener('close',function(){
 if(page==='list'){activeId=null;page='lists';draw();}
});
function draw(){
 if(!ready){$('screen').innerHTML='<p class="muted">Carregando suas listas...</p>';return;}
 var data=lists.snapshot();
 var html='';
 if(page==='home'){
  html='<h1>Listas de materiais</h1><p class="muted">Comece uma lista ou continue de onde parou.</p><div class="grid2">'+
   '<button class="tile" data-action="lists"><span class="symbol">☷</span><div><strong>Minhas listas</strong><br><span>'+data.lists.length+' lista(s)</span></div></button>'+
   '<button class="tile" data-action="create"><span class="symbol">＋</span><div><strong>Criar lista</strong><br><span>Nova lista de materiais</span></div></button></div>'+ 
   '<a class="listrow" href="/x/biblioteca/" style="margin-top:10px;text-decoration:none;color:inherit;align-items:center"><span><strong>Biblioteca · Fichas Técnicas</strong><br><small class="muted">Catálogo Oficial com fichas em revisão para testes</small></span><span>›</span></a>'+
   '<a class="listrow" href="/x/contribuir.html" style="margin-top:18px;text-decoration:none;color:inherit;align-items:center"><span><strong>Envie seu item para nós</strong><br><small class="muted">Sugira materiais para avaliação do Catálogo Oficial · estudo</small></span><span>›</span></a>';
 }else if(page==='lists'){
  html='<div class="row"><h1>Minhas listas</h1><button class="btn small" data-action="create">＋ Nova</button></div><div class="stack">';
  if(!data.lists.length)html+='<div class="empty">Nenhuma lista criada ainda.</div>';
  data.lists.forEach(function(x){html+='<button class="listrow" data-open="'+esc(x.id)+'"><span><strong>'+esc(x.name)+'</strong><br><small class="muted">'+x.items.length+' lançamento(s)</small></span><span>›</span></button>';});
  html+='</div>';
 }else if(page==='list'){
  var l=list();if(!l){exitList();return;}
  html='<div class="row list-detail-header"><div><button class="btn ghost small list-return" data-action="lists" aria-label="Voltar para Minhas listas">← Minhas listas</button><h1>'+esc(l.name)+'</h1><span class="tiny muted">'+l.items.length+' lançamento(s)</span></div><button class="btn ghost small" data-action="lists" aria-label="Fechar lista">✕</button></div>'+
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
 return 'Condutor elétrico'+(values.formacao?' '+values.formacao.toLowerCase():'')+
 (values.material?' de '+values.material.toLowerCase():'')+(values.secao?' · # '+values.secao:'')+
 (values.isolacao?' · '+values.isolacao:'')+(values.tensao?' · '+values.tensao:'')+
 (values.cor?' · '+values.cor.toLowerCase():'')+(values.classe?' · '+values.classe:'');
}
function count(){return fields.filter(function(x){return x.required&&values[x.id];}).length;}
function pickFirstMissing(){var i=fields.findIndex(function(x){return x.required&&!values[x.id];});return i===-1?fields.length-1:i;}
function redrawAdd(){
 $('liveName').textContent=name();
 $('progress').innerHTML=fields.filter(function(x){return x.required;}).map(function(x){return '<span class="segment'+(values[x.id]?' done':'')+'"></span>';}).join('');
 $('counter').textContent=count()+' / '+fields.filter(function(x){return x.required;}).length+' obrigatórios';
 $('tags').innerHTML=fields.filter(function(x){return values[x.id];}).map(function(x){return '<button class="tag'+(x.required?' required':'')+'" data-remove="'+x.id+'" title="Remover '+esc(x.label)+'">'+esc(values[x.id])+' ×</button>';}).join('')||'<span class="tiny muted">As tags confirmadas aparecem aqui.</span>';
 var f=fields[focus];
 $('fieldLabel').textContent=f.label;
 $('fieldType').textContent=f.required?'Obrigatório':'Opcional';
 $('choices').innerHTML=f.options.map(function(o){return '<button class="tag option'+(values[f.id]===o?' on':'')+'" data-pick="'+esc(o)+'">'+esc(o)+'</button>';}).join('');
 $('fieldHelp').textContent=count()===6?'Obrigatórios preenchidos. O último card é opcional.':'Escolha uma opção; a próxima característica aparecerá automaticamente.';
 var l=list();$('stageTags').innerHTML=(l?.stages||[]).map(function(s){return '<button class="tag" data-stage="'+esc(s)+'">'+esc(s)+'</button>';}).join('');
 validate();
}
function validate(){
 $('saveItem').disabled=!(count()===6&&Number($('qty').value)>0&&$('stage').value.trim());
}
function openAdd(item){
 if(!list())return;
 editId=item?String(item.id):null;
 values=item&&item.values?Object.assign({},item.values):{};
 focus=pickFirstMissing();
 $('qty').value=item?String(item.qty):'100';
 $('unit').value=item?String(item.unit):'m';
 $('stage').value=item?String(item.stage):'Geral';
 $('addTitle').textContent=item?'Editar item':'Adicionar item';
 $('saveItem').textContent=item?'✓ Salvar alterações':'＋ Adicionar à lista';
 redrawAdd();$('addDialog').showModal();
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

  if(a.dataset.action==='create'){$('newName').value='';$('createDialog').showModal();$('newName').focus();}
  if(a.dataset.action==='lists'){exitList();return;}
  if(a.dataset.action==='share'&&list())window.TereonXShare?.open(lists.exportList(activeId));
  if(a.dataset.action==='add')openCatalogAdd();
 }
 var open=e.target.closest('[data-open]');if(open){activeId=open.dataset.open;navigate('list');}
 var edit=e.target.closest('[data-edit]');if(edit&&list()){
  var existing=list().items.find(function(x){return String(x.id)===edit.dataset.edit;});
  if(existing){if(existing.catalogId)openCatalogAdd(existing);else openAdd(existing);}
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
 delete values[b.dataset.remove];
 // Sempre retoma a primeira característica obrigatória ainda pendente,
 // mesmo quando várias tags são removidas em sequência.
 focus=pickFirstMissing();redrawAdd();
});
$('choices').addEventListener('click',function(e){
 var b=e.target.closest('[data-pick]');if(!b)return;
 values[fields[focus].id]=b.dataset.pick;focus=pickFirstMissing();redrawAdd();
});
$('stageTags').addEventListener('click',function(e){var b=e.target.closest('[data-stage]');if(b){$('stage').value=b.dataset.stage;validate();}});
['qty','stage'].forEach(function(x){$(x).addEventListener('input',validate);});
$('saveItem').addEventListener('click',function(){
 var l=list();if(!l||count()!==6||!(Number($('qty').value)>0)||!$('stage').value.trim())return;
 var itemData={name:name(),values:Object.assign({},values),qty:$('qty').value,unit:$('unit').value,stage:$('stage').value.trim()};
 if(!safe(function(){return lists.upsertItem(activeId,itemData,editId);}))return;
 close('addDialog');editId=null;draw();
});
$('addDialog').addEventListener('cancel',function(){values={};});
draw();
})();
