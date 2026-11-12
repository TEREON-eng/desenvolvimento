/* TEREON X — apresentação de Listas. Persistência delegada a servico.js */
(function(){
'use strict';
const guestRepository=window.TereonXListStore.create();
let lists=window.TereonXLists.create(guestRepository);
let accountId=null, syncController=null, ready=false, accountSession=0;
const selectedLists=new Set();
let listView='insumo';
const storageKey=id=>'tereon-x-cloud-cache-'+id;
const uuid=()=>{
 const api=globalThis.crypto;
 if(api?.randomUUID)return api.randomUUID();
 if(!api?.getRandomValues)throw Error('Identificação segura indisponível.');
 const bytes=api.getRandomValues(new Uint8Array(16));bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
 const h=Array.from(bytes,n=>n.toString(16).padStart(2,'0')).join('');
 return h.slice(0,8)+'-'+h.slice(8,12)+'-'+h.slice(12,16)+'-'+h.slice(16,20)+'-'+h.slice(20);
};
function listStorageStatus(entry){
 if(!accountId)return {label:'Local',state:'local',hint:'Lista armazenada somente neste aparelho'};
 const sync=syncController?.status();
 if(entry.cloudConflict)return {label:'Conflito',state:'conflict',hint:'Versões diferentes: alteração local preservada'};
 if(entry.cloudPending){
  if(sync?.error)return {label:'Falha no envio',state:'error',hint:sync.error};
  return {label:sync?.working?'Sincronizando':'Aguardando nuvem',state:'pending',hint:'Alterações locais ainda não confirmadas pelo servidor'};
 }
 if(entry.cloudVersion)return {label:'Sincronizada',state:'synced',hint:'Última versão desta lista confirmada anteriormente na nuvem; não significa conexão ativa agora'};
 return {label:'Local',state:'local',hint:'Esta lista ainda não possui confirmação da nuvem'};
}
function listStorageBadge(entry){
 const status=listStorageStatus(entry);
 return '<span class="list-storage list-storage--'+status.state+'" title="'+esc(status.hint)+'">'+esc(status.label)+'</span>';
}
function refreshView(){if(ready)draw()}
async function activateAccount(userId,cloud){
 const session=++accountSession;
 if(syncController)syncController.stop();
 syncController=null;selectedLists.clear();ready=false;if($('listDialog')?.open)$('listDialog').close();page=initialView==='lists'?'lists':'home';listBackdrop=page;activeId=null;
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
 // Link antigo ?view=create abre o modal uma vez; o Início permanece a URL canônica.
 window.history?.replaceState?.(null,'','/x/');
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
const skippedOptional=new Set();
let optionNotice='';
let editingLegacyQuantity=false;
// Comportamento ao fogo é DET-LSZH: opcional derivado, exibido por último.
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
 activeId=null;page=target;listBackdrop=target;
 if(target==='home'){initialView='';window.history?.replaceState?.(null,'','/x/')}
 draw();
}
function exitList(){
 if($('listDialog').open)$('listDialog').close();
 activeId=null;page=listBackdrop;draw();
}
$('listDialog').addEventListener('close',function(){
 if(page==='list'){activeId=null;page=listBackdrop;draw();}
});
function draw(){
 const background=page==='list'?listBackdrop:page;
 window.TereonXHeader?.setPath(background==='home'?[['Ferramentas']]:[['Ferramentas','/x/'],['Listas de materiais']]);
 $('homeScreen').hidden=background!=='home';
 $('listsScreen').hidden=background==='home';
 if(!ready){
  if(background==='lists')$('listsScreen').innerHTML='<p class="muted">Carregando suas listas...</p>';
  return;
 }
 var data=lists.snapshot();
 var html='';
 if(page==='home'){
  $('homeListCount').textContent=data.lists.length+' lista(s)';
  return;
 }else if(page==='lists'){
  html='<div class="row list-page-heading"><h1>Minhas listas</h1><span class="list-head-actions"><button class="btn small primary list-action-primary" data-action="create">＋ Nova</button>'+(accountId?'<button class="btn small list-action-secondary" data-action="sync" type="button">↻ Conferir nuvem</button>':'')+'</span></div>';
  const countSelected=data.lists.filter(x=>selectedLists.has(String(x.id))).length;
  html+=(countSelected?'<div class="list-select-bar"><span class="list-select-count" role="status">'+countSelected+' selecionada(s)</span><button type="button" class="btn small" data-action="clear-selection">Limpar seleção</button><button type="button" class="btn small" data-action="share-selected"'+(countSelected!==1?' disabled title="Selecione uma lista para compartilhar"':'')+'>Compartilhar selecionada</button></div>':'')+'<div class="stack list-cards">';
  if(!data.lists.length)html+='<div class="empty">Nenhuma lista criada ainda.</div>';
  data.lists.forEach(function(x){
   const id=esc(x.id),name=esc(x.name);
   html+='<div class="list-entry"><div class="list-card"><button type="button" class="listrow" data-open="'+id+'"><span><strong>'+name+'</strong><br><small class="muted">'+x.items.length+' lançamento(s)</small><span class="list-status-wrap">'+listStorageBadge(x)+'</span></span></button>'+
    '<div class="list-card-actions"><label class="list-select-one" title="Selecionar '+name+'"><input type="checkbox" data-select-list="'+id+'" aria-label="Selecionar lista '+name+'"'+(selectedLists.has(String(x.id))?' checked':'')+'></label><div class="list-action-row">'+
    '<button type="button" class="list-icon" data-rename-list="'+id+'" aria-label="Editar nome da lista '+name+'" title="Editar nome"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L9 17l-4 1 1-4z"/></svg></button>'+
    '<button type="button" class="list-icon" data-duplicate-list="'+id+'" aria-label="Duplicar lista '+name+'" title="Duplicar"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2h2"/></svg></button>'+
    '<button type="button" class="list-icon" data-share-list="'+id+'" aria-label="Compartilhar lista '+name+'" title="Compartilhar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V3m0 0L7 8m5-5 5 5M5 14v6h14v-6"/></svg></button>'+
    
    '<button type="button" class="list-icon danger" data-delete-list="'+id+'" aria-label="Excluir lista '+name+'" title="Excluir"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 7V4h4v3m-8 0 1 13h10l1-13M10 11v6m4-6v6"/></svg></button></div></div></div></div>';
  });
  html+='</div>';
 }else if(page==='list'){
  var l=list();if(!l){exitList();return;}
  html='<div class="row list-detail-header"><div><button class="btn ghost small list-return" data-action="lists" aria-label="Voltar para a tela anterior">'+(listBackdrop==='home'?'← Início':'← Minhas listas')+'</button><h1>'+esc(l.name)+'</h1><span class="tiny muted">'+l.items.length+' lançamento(s)</span> '+listStorageBadge(l)+'</div><button class="btn ghost small" data-action="lists" aria-label="Fechar lista">✕</button></div>'+
   '<div style="margin-top:20px"><button class="btn primary full" data-action="add">＋ Adicionar item</button></div>'+ 

   '<div class="row" style="margin-top:18px"><strong style="font-size:14px">Lançamentos da lista</strong><span class="tiny muted">'+l.items.length+' item(ns)</span></div>'+
   '<div style="display:flex;gap:8px;margin:10px 0" role="group" aria-label="Agrupar lançamentos"><button type="button" class="btn small" data-list-view="insumo" aria-pressed="'+(listView==='insumo')+'">Por insumo</button><button type="button" class="btn small" data-list-view="etapa" aria-pressed="'+(listView==='etapa')+'">Por etapa</button></div>';
  const fmt=n=>Number(n).toLocaleString('pt-BR',{maximumFractionDigits:6});
  // Uma ficha técnica é exibida uma vez no cabeçalho; sua identificação
  // integral continua acessível ao abrir o título, sem alterar o item.
  function launchActions(it){
   const id=esc(it.id);
   return '<div class="compact-launch-actions">'+
    '<button class="item-icon" type="button" data-edit="'+id+'" aria-label="Editar lançamento" title="Editar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L9 17l-4 1 1-4z"/></svg></button>'+
    '<button class="item-icon" type="button" data-duplicate="'+id+'" aria-label="Duplicar lançamento" title="Duplicar"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg></button>'+
    '<button class="item-icon remove" type="button" data-delete="'+id+'" aria-label="Excluir lançamento" title="Excluir"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>'+
   '</div>';
  }
  function buyLabel(g){
   if(g.kind==='lance')return fmt(g.units)+' lance'+(g.units===1?'':'s');
   if(g.kind==='package'){
    const roll=String(g.unit).toLowerCase().startsWith('rl');
    return fmt(g.units)+' '+(roll?(g.units===1?'rolo':'rolos'):(g.units===1?'barra':'barras'))+' de '+fmt(g.factor)+' m';
   }
   return fmt(g.units)+(g.kind==='meter'?' m':' '+g.unit);
  }
  function materialParts(name,sourceItem){
   const technical=String(name||'Material').trim();
   const values=sourceItem?.values||{};
   const ficha=sourceItem?.catalogId?window.TereonXCatalog?.get?.(sourceItem.catalogId):null;
   const picked=id=>typeof values[id]==='string'?values[id].trim():'';
   const unique=parts=>[...new Set(parts.map(v=>String(v||'').trim()).filter(Boolean))];
   const fromName=technical.split(' · ')[0].trim()||technical;
   // Rótulo de localização, não substitui o nome técnico completo nem
   // altera a chave de consolidação. Somente atributos explicitamente salvos.
   if(sourceItem?.catalogId==='FT_COND-001'){
    const selectedType=picked('DET-001');
    const base=/^(condutor|cabo)\b/i.test(selectedType)?selectedType:
     (/^(condutor isolado|cabo unipolar|cabo multipolar)\b/i.exec(technical)?.[0]||fromName);
    const section=picked('DET-004'),insulation=picked('DET-005'),coverage=picked('DET-007');
    const shortMaterial=value=>{
     if(/^PVC(?:\s|$)/i.test(value))return 'PVC';
     if(/^HEPR ou XLPE(?:\s|$)/i.test(value))return 'HEPR ou XLPE';
     if(/^Termoplástico não halogenado(?:\s|$)/i.test(value))return 'Não halogenado';
     return value.replace(/\s+(?:70|90)\s*°C$/i,'').trim();
    };
    const isol=insulation?shortMaterial(insulation):'';
    const cover=coverage?shortMaterial(coverage):'';
    const description=unique([
     picked('DET-002'),
     section?(section.includes('mm²')?section:section+' mm²'):'',
     picked('DET-008'), // Cor deve permanecer identificável na lista.
     isol,
     cover&&cover!==isol?'Cob. '+cover:''
    ]).join(' · ');
    if(description)return {base,description,technical};
   }
   // Nas demais famílias, o fichário também determina quais detalhes são
   // pertinentes. Ignorar unidade e priorizar tipo/material/dimensão/cor.
   const first=fromName;
   const base=String(ficha?.name||first||technical).trim();
   const selected=Object.entries(values).filter(([id,value])=>
    id!=='DET-011'&&id!=='DET-012'&&id!=='DET-013'&&value!=null&&String(value).trim());
   const labels=new Map((ficha?.details||[]).map(d=>[d.id,d.name||'']));
   const priority=label=>{
    const t=String(label).toLocaleLowerCase('pt-BR');
    if(/tipo|material|seção|secao|diâmetro|diametro|cor|isolação|isolacao/.test(t))return 0;
    if(/tensão|tensao|formação|formacao|resist|acabamento|revestimento/.test(t))return 1;
    return 2;
   };
   const options=selected.filter(([id])=>!ficha||labels.has(id))
    .sort((a,b)=>priority(labels.get(a[0]))-priority(labels.get(b[0])))
    .map(([,value])=>String(value).trim());
   const remaining=technical.toLocaleLowerCase('pt-BR').startsWith(base.toLocaleLowerCase('pt-BR'))?
    technical.slice(base.length).replace(/^[ ·:,–—-]+/,'').trim():technical;
   return {base,description:unique(options).slice(0,4).join(' · ')||remaining,technical};
  }
  function groupTags(entries){
   // Consolidado é propriedade da APRESENTAÇÃO (2+ lançamentos reunidos),
   // não equivale a uma ficha homologada nem altera status persistido.
   const merged=(entries||[]).length>1;
   const review=(entries||[]).some(it=>{
    const ficha=it.catalogId?window.TereonXCatalog?.get?.(it.catalogId):null;
    const status=String(it.fichaStatus||ficha?.status||'')
     .normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    return it.simulacao===true||ficha?.kind==='revisao'||/revis|simulacao/.test(status);
   });
   const chips=[];
   if(merged)chips.push('<span class="compact-status-chip consolidated" title="Dois ou mais lançamentos agrupados nesta visualização">Consolidado</span>');
   if(review)chips.push('<span class="compact-status-chip review" title="Ficha técnica em revisão: especificação ainda não homologada">Em revisão</span>');
   return chips.length?'<span class="compact-status-tags" aria-label="Identificação do material">'+chips.join('')+'</span>':'';
  }
  function fullMaterial(name,composition,sourceItem,entries){
   const info=materialParts(name,sourceItem),technical=esc(info.technical);
   // Cabeçalho mostra a família, com tipo selecionado na descrição.
   // A ficha, o nome técnico e a chave de consolidação não são renomeados.
   const conductor=sourceItem?.catalogId==='FT_COND-001';
   const heading=conductor?'Condutores elétricos':info.base;
   const subtitle=conductor?[info.base,info.description].filter(Boolean).join(' · '):info.description;
   return '<details class="compact-technical"><summary title="'+technical+'" aria-label="Ver especificação completa: '+technical+'">'+
    '<span class="compact-material-label"><strong>'+esc(heading)+'</strong>'+
    (subtitle?'<small>'+esc(subtitle)+'</small>':'')+groupTags(entries)+'</span></summary>'+
    '<div class="compact-technical-full">'+technical+(composition?'<div>'+esc(composition)+'</div>':'')+'</div></details>';
  }
  function stageDetails(entries,kind){
   const byStage=new Map();
   entries.forEach(it=>{
    const stage=it.stage||'Geral';
    if(!byStage.has(stage))byStage.set(stage,[]);
    byStage.get(stage).push(it);
   });
   let output='';
   for(const [stage,stageItems] of byStage){
    const measured=stageItems.reduce((sum,it)=>sum+Number(it.qty),0);
    const measureUnit=kind==='legacy'?stageItems[0].unit:'m';
    output+='<details class="compact-stage"><summary aria-label="Etapa '+esc(stage)+', '+esc(fmt(measured)+' '+measureUnit)+'. Toque para ver os lançamentos e as ações.">'+
     '<span class="compact-stage-name">'+esc(stage)+'</span><span class="compact-stage-qty">'+esc(fmt(measured)+' '+measureUnit)+'</span></summary>'+
     '<div class="compact-stage-sources">';
    stageItems.forEach((it,index)=>{
     const amount=fmt(Number(it.qty))+' '+(kind==='legacy'?it.unit:'m');
     output+='<div class="compact-source"><span class="tiny muted">'+
      (stageItems.length>1?'Lançamento '+(index+1)+' · ':'')+esc(amount)+'</span>'+launchActions(it)+'</div>';
    });
    output+='</div></details>';
   }
   return output;
  }
  function groupCard(g,entries){
   const composition=g.kind==='lance'?'Composição: '+g.breakdown.map(part=>fmt(part.count)+' × '+fmt(part.length)+' m').join(' + '):'';
   const measured=g.kind==='package'||g.kind==='lance'?
    '<small class="compact-meter-total">'+esc(fmt(g.meters)+' m medidos')+'</small>':'';
   return '<section class="compact-material-card"><div class="compact-material-head">'+
    fullMaterial(g.name,composition,entries[0],entries)+
    '<div class="compact-purchase"><strong>'+esc(buyLabel(g))+'</strong>'+measured+'</div></div>'+
    '<div class="compact-stage-list">'+stageDetails(entries,g.kind)+'</div></section>';
  }
  function stageMaterialRow(g,entries){
   const info=materialParts(g.name,entries[0]);
   const amount=g.kind==='legacy'?fmt(g.units)+' '+g.unit:fmt(g.meters)+' m';
   const composition=g.kind==='lance'?'Composição dos lances: '+g.breakdown.map(part=>fmt(part.count)+' × '+fmt(part.length)+' m').join(' + '):'';
   let output='<details class="compact-stage-material"><summary title="'+esc(info.technical)+'" aria-label="'+esc(info.base+', '+amount+'. Abrir lançamentos')+'">'+
    '<span class="compact-stage-material-text"><strong>'+esc(info.base)+'</strong>'+
    (info.description?'<small>'+esc(info.description)+'</small>':'')+groupTags(entries)+'</span>'+
    '<strong class="compact-stage-qty">'+esc(amount)+'</strong></summary><div class="compact-stage-sources">';
   if(composition)output+='<div class="compact-stage-extra">'+esc(composition)+'</div>';
   output+='<div class="compact-stage-extra">'+esc(info.technical)+'</div>';
   entries.forEach((it,index)=>{
    const measured=it.qtyBasis==='m'?fmt(Number(it.qty))+' m':fmt(Number(it.qty))+' '+it.unit;
    output+='<div class="compact-source"><span class="tiny muted">'+
     (entries.length>1?'Lançamento '+(index+1)+' · ':'')+esc(measured)+'</span>'+launchActions(it)+'</div>';
   });
   return output+'</div></details>';
  }
  if(!l.items.length)html+='<div class="empty">Nenhum material adicionado.</div>';
  else if(listView==='etapa'){
   const stages=[...new Set(l.items.map(it=>it.stage||'Geral'))];
   stages.forEach(stage=>{
    const entries=l.items.filter(it=>(it.stage||'Geral')===stage);
    const grouped=window.TereonXQuant?.consolidate(entries)||[];
    const shown=new Set(),rows=[];
    grouped.forEach(g=>{
     const ids=new Set(g.sourceIds||[]);
     const origin=entries.filter(it=>ids.has(String(it.id)));
     if(!origin.length)return;
     origin.forEach(it=>shown.add(String(it.id)));
     rows.push(stageMaterialRow(g,origin));
    });
    const legacyGroups=new Map();
    entries.filter(it=>!shown.has(String(it.id))).forEach(it=>{
     const specs=Object.entries(it.values||{}).sort((x,y)=>x[0].localeCompare(y[0]));
     const key=JSON.stringify([it.catalogId||'',it.name,it.unit,it.qtyBasis||'',specs]);
     if(!legacyGroups.has(key))legacyGroups.set(key,{name:it.name,kind:'legacy',unit:it.unit,units:0,items:[]});
     const group=legacyGroups.get(key);group.units+=Number(it.qty);group.items.push(it);
    });
    legacyGroups.forEach(g=>rows.push(stageMaterialRow(g,g.items)));
    html+='<details class="compact-stage-section" open><summary class="compact-stage-heading"><strong>'+esc(stage)+'</strong>'+
     '<span>'+rows.length+' insumo(s) · '+entries.length+' lançamento(s)</span></summary>'+
     '<div class="compact-stage-items">'+rows.join('')+'</div></details>';
   });
  }else{
   const groups=window.TereonXQuant?.consolidate(l.items)||[];
   const shown=new Set();
   html+='<div class="compact-material-list">';
   groups.forEach(g=>{
    const ids=new Set(g.sourceIds||[]);
    const entries=l.items.filter(it=>ids.has(String(it.id)));
    if(!entries.length)return;
    entries.forEach(it=>shown.add(String(it.id)));
    html+=groupCard(g,entries);
   });
   // Legado: agrupar apenas material/especificação/unidade idênticos,
   // mantendo quantidades originais e SEM conversão comercial.
   const legacyGroups=new Map();
   l.items.filter(it=>!shown.has(String(it.id))).forEach(it=>{
    const specs=Object.entries(it.values||{}).sort((a,b)=>a[0].localeCompare(b[0]));
    const key=JSON.stringify([it.catalogId||'',it.name,it.unit,it.qtyBasis||'',specs]);
    if(!legacyGroups.has(key))legacyGroups.set(key,{name:it.name,kind:'legacy',unit:it.unit,units:0,items:[]});
    const g=legacyGroups.get(key);g.units+=Number(it.qty);g.items.push(it);
   });
   legacyGroups.forEach(g=>{html+=groupCard(g,g.items);});
   html+='</div>';
  }
  html+='<div style="margin-top:16px"><button class="btn full" data-action="share">↗ Compartilhar / Gerar relatório</button></div>'+
   '<div style="margin-top:10px;text-align:right"><a href="/x/contribuir.html" style="color:#4f6f59;font-size:12px">Não encontrou o material? Envie seu item para nós ›</a></div>';
 }
 if(page==='home'||page==='lists'||page==='list'){
  // Estado de armazenamento agora é individual em cada lista, não um aviso geral.
  if(page==='lists'&&accountId&&guestRepository.snapshot().lists.length){
   const already=syncController?.guestImported();
   if(!already)html+='<button class="btn small" style="margin-top:14px" type="button" data-action="import">Trazer listas deste aparelho para minha conta</button>';
  }
 }
 if(page==='list'){
  $('listContent').innerHTML=html;
  if(!$('listDialog').open)$('listDialog').showModal();
 }else{
  $('listsScreen').innerHTML=html;
 }
}
function name(){
 if(selectedFicha)return window.TereonXCatalog.technicalName(selectedFicha,values);
 return 'Condutor elétrico'+(values.formacao?' '+values.formacao.toLowerCase():'')+
 (values.material?' de '+values.material.toLowerCase():'')+(values.secao?' · # '+values.secao:'')+
 (values.isolacao?' · '+values.isolacao:'')+(values.tensao?' · '+values.tensao:'')+
 (values.cor?' · '+values.cor.toLowerCase():'')+(values.classe?' · '+values.classe:'');
}
/* Um opcional perde sua escolha se uma nova tag o tornar incompatível.
   Não remove valores de detalhes obrigatórios nem corrige especificações silenciosamente. */
function reconcileInvalidOptional(target=values){
 if(!selectedFicha)return target;
 let changed=true;
 while(changed){
  changed=false;
  for(const d of selectedFicha.details){
   if(d.required||!target[d.id])continue;
   const chosen=target[d.id];
   const alternatives=window.TereonXCatalog.optionsFor(selectedFicha,{...target,[d.id]:undefined},d.id);
   if(!alternatives.includes(chosen)){
    delete target[d.id];skippedOptional.delete(d.id);changed=true;
   }
  }
 }
 return target;
}
function getFields(){
 if(!selectedFicha)return legacyFields;
 return window.TereonXCatalog.visibleDetails(selectedFicha,values)
  // Eletroduto: a unidade vem do mesmo fichário, mas é escolhida no
  // seletor visível de unidade, não duplicada como pergunta opcional.
  .filter(d=>d.name!=='[Detalhe sem nome]'&&!(selectedFicha.id==='FT_INFRA-001'&&['DET-012','DET-013'].includes(d.id)))
  .map(d=>({id:d.id,label:d.name,required:d.required,options:window.TereonXCatalog.optionsFor(selectedFicha,values,d.id)}));
}
function count(){return fields.filter(f=>f.required&&values[f.id]).length}
function pickFirstMissing(){
 if(selectedFicha){
  const ignored=[...skippedOptional,...(selectedFicha.id==='FT_INFRA-001'?['DET-012','DET-013']:[])];
  const id=window.TereonXCatalog.nextDetail(selectedFicha,values,ignored);
  if(id){
   const i=fields.findIndex(f=>f.id===id);
   if(i>=0)return i;
  }
  // Não repetir opcionais pulados. Sem pendências, só manter a área atual.
  return Math.max(0,Math.min(focus,fields.length-1));
 }
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
 const current=$('unit').value;
 if(selectedFicha?.id==='FT_INFRA-001'){
  // Unidade condicional da ficha, com seleção única no formulário.
  const applicable=selectedFicha.details.filter(d=>
   ['DET-012','DET-013'].includes(d.id)&&
   window.TereonXCatalog.applyRule(d.condition,values,selectedFicha.details).visible);
  const known=[...new Set(applicable.flatMap(d=>d.options))];
  // Antes da escolha do tipo, só um valor visual provisório: não é dado confirmado.
  if(!known.length)known.push('m');
  // Preservar unidade de item antigo durante sua edição, sem converter quantidade.
  const original=editId!=null?list()?.items.find(it=>String(it.id)===String(editId)):null;
  if(original?.unit&&!known.includes(original.unit))known.push(String(original.unit));
  $('unit').innerHTML=known.map(u=>'<option value="'+esc(u)+'">'+esc(u)+'</option>').join('');
  $('unit').value=known.includes(current)?current:known[0];
  return;
 }
 const detail=selectedFicha?.details.find(d=>d.name==='Unidade'||d.name==='Unidade de compra');
 const known=detail?.options.length?detail.options:['m','un','rl','br3m','rl25','rl50','rl100','rl50m','rl100m','rl200m'];
 $('unit').innerHTML=known.map(u=>'<option value="'+esc(u)+'">'+esc(u)+'</option>').join('');
 $('unit').value=known.includes(current)?current:known[0];
}
function paintFichaChoices(){
 const all=window.TereonXCatalog?.list()||[];
 const q=fichaSearch.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 const candidates=all.filter(f=>(f.name+' '+f.id+' '+f.reference+' '+(f.aliases||[]).join(' ')).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(q));
 $('choices').innerHTML='<input id="fichaSearch" class="ficha-search" type="search" autocomplete="off" placeholder="Buscar material ou família..." aria-label="Pesquisar fichas técnicas" value="'+esc(fichaSearch)+'">'+
  (loadingFichas?'<p class="tiny muted">Carregando fichas...</p>':fichaError?'<p class="notice">'+esc(fichaError)+'</p>':candidates.length?candidates.map(f=>
   '<button type="button" class="ficha-option" data-ficha="'+esc(f.id)+'"><strong>'+esc(f.name)+'</strong><small>'+esc(f.id)+' · '+esc(f.status||'Em revisão')+'</small></button>').join(''):
   '<p class="tiny muted">Nenhuma ficha encontrada.</p>');
}
function redrawAdd(){
 if(selectedFicha?.id==='FT_INFRA-001'&&!choosingFicha)populateUnitOptions();
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
  const activeField=fields[focus];
  const linked=new Set(selectedFicha&&activeField?window.TereonXCatalog.relatedTags(selectedFicha,values,activeField.id):[]);
  $('tags').innerHTML=fields.filter(x=>values[x.id]).map(x=>'<button type="button" class="tag'+(x.required?' required':'')+(linked.has(x.id)?' linked':'')+'" data-remove="'+esc(x.id)+'" title="'+esc((linked.has(x.id)?'Relacionada ao detalhe atual · ':'')+'Remover '+x.label)+'">'+esc(values[x.id])+' ×</button>').join('')||'<span class="tiny muted">As tags confirmadas aparecem aqui.</span>';
  const field=fields[focus];
  $('fieldLabel').textContent=field?.label||'Características';
  if(selectedFicha){
   $('fieldLabel').insertAdjacentHTML('beforeend',' <button type="button" class="tag ficha-trocar" data-ficha-back="1" aria-label="Trocar material '+esc(selectedFicha.name)+'" title="Trocar material">'+esc(selectedFicha.name)+' ×</button>');
  }
  $('fieldType').textContent=field?(field.required?'Obrigatório':'Opcional'):'Sem opções definidas';
  const states=selectedFicha&&field?window.TereonXCatalog.optionStates(selectedFicha,values,field.id):
   (field?field.options.map(option=>({option,available:true,reason:'',blockedBy:[]})):[]);
  $('choices').innerHTML=field?states.map(x=>'<button type="button" class="tag option'+(values[field.id]===x.option?' on':'')+(x.available?'':' is-blocked')+'" '+(x.available?'data-pick':'data-blocked-option')+'="'+esc(x.option)+'"'+(!x.available?' aria-disabled="true" title="'+esc(x.reason)+'"':'')+'>'+esc(x.option)+(x.available?'':' <span class="option-lock" aria-hidden="true">⊘</span>')+'</button>').join('')+
   (!field.required&&!values[field.id]&&!skippedOptional.has(field.id)?'<button type="button" class="tag" data-skip-optional="'+esc(field.id)+'">Pular · deixar em branco</button>':''):'';
  const incomplete=selectedFicha?.pendencias?.length||0;
  $('fieldHelp').textContent=optionNotice|| (selectedFicha?
   (incomplete?'Ficha em revisão: há '+incomplete+' pendência(s) cadastrais. ':'')+
   (window.TereonXCatalog.missing(selectedFicha,values).length?'Confirme as características obrigatórias para adicionar.':'Obrigatórios confirmados; você pode continuar escolhendo detalhes opcionais.'):
   'Escolha uma opção; a próxima característica aparecerá automaticamente.');
  if(!optionNotice&&field?.label==='Comportamento ao fogo')
   $('fieldHelp').textContent='Opcional · a classificação escolhida é uma exigência para o produto completo, não uma certificação automática.';
  $('fieldHelp').classList.toggle('choice-warning',!!optionNotice);

 }
 const current=list();
 const q=Number($('qty').value),info=window.TereonXQuant?.unitInfo($('unit').value);
 let hint='';
 if(selectedFicha?.id==='FT_COND-001'&&q>0&&info){
   if(info.kind==='lance')hint=q+' m medidos → '+info.count+' lances de '+(q/info.count).toLocaleString('pt-BR',{maximumFractionDigits:6})+' m cada';
   else if(info.kind==='package')hint=q+' m medidos · '+info.unit+' · arredondar na consolidação';
   else hint=q+' m medidos';
 }
 $('stageTags').innerHTML=(hint?'<span class="tiny muted" style="display:block;width:100%;margin-bottom:5px">'+esc(hint)+'</span>':'')+
  (current?.stages||[]).map(s=>'<button type="button" class="tag" data-stage="'+esc(s)+'">'+esc(s)+'</button>').join('');
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
 editingLegacyQuantity=!!(item?.catalogId==='FT_COND-001'&&item.qtyBasis!=='m'&&item.unit!=='m');
 skippedOptional.clear();optionNotice='';
 values=item&&item.values?Object.assign({},item.values):{};
 // Migração de itens anteriores: IDs DET-006..010 foram renumerados na planilha.
 if(item?.catalogId==='FT_COND-001'&&
    (Object.hasOwn(values,'DET-LSZH')||Object.hasOwn(item,'lszhDecision')||
     Object.hasOwn(item,'lszhRequired')||Object.hasOwn(values,'DET-006')&&
      ['PVC 70 °C','HEPR ou XLPE 90 °C','Termoplástico não halogenado 70 °C'].includes(values['DET-006']))){
  const old=Object.assign({},values),migrated={};
  for(const [id,val] of Object.entries(old)){
   if(id==='DET-LSZH')continue;
   const number=/^DET-(\\d+)$/.exec(id);
   if(number&&Number(number[1])>=6&&Number(number[1])<=10)
    migrated['DET-'+String(Number(number[1])-1).padStart(3,'0')]=val;
   else migrated[id]=val;
  }
  const classified=old['DET-LSZH']==='LSZH'||item.lszhDecision==='yes'||item.lszhRequired===true?
    'Não halogenado com baixa emissão de fumaça (LSZH)':
    old['DET-LSZH']==='Comum'||item.lszhDecision==='no'?'Comum':null;
  if(classified)migrated['DET-010']=classified;
  values=migrated;
 }
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
   else{
    choosingFicha=false;
    populateUnitOptions();
    if(item?.unit && selectedFicha.details.some(d=>d.name==='Unidade'||d.name==='Unidade de compra')){
      const allowed=selectedFicha.details.find(d=>d.name==='Unidade'||d.name==='Unidade de compra')?.options||[];
      if(allowed.includes(item.unit))$('unit').value=item.unit;
    }
    if(selectedFicha.id==='FT_COND-001'&&selectedFicha.details.some(d=>d.id==='DET-011')){
      if(item.qtyBasis==='m')values['DET-011']=item.unit;
      else delete values['DET-011']; // Legado: não converter quantidade antiga de rolos em metros.
    }
    fields=getFields();focus=pickFirstMissing();
   }
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
 // Os botões de agrupamento não possuem data-action; tratar ANTES do
 // roteador geral para que ambos funcionem dentro do modal de lista.
 const viewButton=e.target.closest('[data-list-view]');
 if(viewButton&&page==='list'){
  e.preventDefault();
  listView=viewButton.dataset.listView==='etapa'?'etapa':'insumo';
  draw();
  return;
 }
 var a=e.target.closest('[data-action]');if(a){
  if(a.dataset.action==='sync'&&syncController){
   e.preventDefault();
   const controller=syncController;
   controller.refresh().then(()=>{if(controller===syncController)draw()}).catch(error=>{
    if(controller!==syncController)return;
    controller.useCachedData(error);
    draw();
   });
   return;
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

if(a.dataset.action==='home'){e.preventDefault();navigate('home');return;}
  if(a.dataset.action==='create'){e.preventDefault();$('newName').value='';$('createDialog').showModal();$('newName').focus();}
  if(a.dataset.action==='lists'){
   e.preventDefault();
   if(page==='list')exitList();
   else navigate('lists');
   return;
  }
  if(a.dataset.action==='share'&&list())window.TereonXShare?.open(lists.exportList(activeId));
  if(a.dataset.action==='clear-selection'){e.preventDefault();selectedLists.clear();draw();return;}
  if(a.dataset.action==='share-selected'){
   e.preventDefault();
   if(selectedLists.size!==1)return;
   const target=lists.get([...selectedLists][0]);
   if(target)window.TereonXShare?.open(lists.exportList(target.id));
   return;
  }
  if(a.dataset.action==='add')openAdd();
 }
 if(e.target.closest('[data-ficha-back]')){
  selectedFicha=null;choosingFicha=true;values={};skippedOptional.clear();fields=legacyFields;focus=0;fichaSearch='';redrawAdd();return;
 }
 const selectOne=e.target.closest('[data-select-list]');
 if(selectOne){
  const id=String(selectOne.dataset.selectList);
  if(selectOne.checked)selectedLists.add(id);else selectedLists.delete(id);
  draw();return;
 }
 const shareOne=e.target.closest('[data-share-list]');
 if(shareOne){
  e.preventDefault();
  const target=lists.get(shareOne.dataset.shareList);
  if(target)window.TereonXShare?.open(lists.exportList(target.id));
  return;
 }
 const rename=e.target.closest('[data-rename-list]');
 if(rename){
  e.preventDefault();
  const target=lists.get(rename.dataset.renameList);
  if(!target)return;
  const title=prompt('Novo nome da lista:',target.name);
  if(title===null||title.trim()===target.name)return;
  safe(()=>{lists.renameList(target.id,title);draw()});
  return;
 }
 const duplicateList=e.target.closest('[data-duplicate-list]');
 if(duplicateList){
  e.preventDefault();
  safe(()=>{lists.duplicateList(duplicateList.dataset.duplicateList);draw()});
  return;
 }
 var removeList=e.target.closest('[data-delete-list]');
 if(removeList){
  e.preventDefault();
  const target=lists.get(removeList.dataset.deleteList);
  if(!target)return;
  const ownerLabel=accountId?'da conta e da nuvem':'deste aparelho';
  if(!confirm('Excluir a lista "'+target.name+'" e seus '+target.items.length+' lançamento(s) '+ownerLabel+'? Esta ação não poderá ser desfeita.'))return;
  removeList.disabled=true;
  (async()=>{
   try{
    if(accountId){
     if(!syncController)throw Error('Sincronização indisponível. Nenhum dado foi excluído.');
     await syncController.deleteList(target.id);
    }else lists.removeList(target.id);
    selectedLists.delete(String(target.id));
    if(page==='list'&&activeId===target.id)exitList();
    draw();
   }catch(error){
    alert('Não foi possível excluir: '+(error.message||String(error))+'. A lista foi preservada quando a exclusão não pôde ser confirmada.');
    draw();
   }
  })();
  return;
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
 delete values[b.dataset.remove];optionNotice='';
 reconcileInvalidOptional();
 fields=getFields();
 // Sempre retoma a primeira característica obrigatória ainda pendente,
 // mesmo quando várias tags são removidas em sequência.
 focus=pickFirstMissing();redrawAdd();
});
$('choices').addEventListener('input',function(e){
 if(e.target.id!=='fichaSearch')return;
 fichaSearch=e.target.value;
 const q=fichaSearch.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 $('choices').querySelectorAll('[data-ficha]').forEach(button=>{
  const ficha=window.TereonXCatalog.get(button.dataset.ficha);
  const searchable=ficha?(ficha.name+' '+ficha.id+' '+ficha.reference+' '+(ficha.aliases||[]).join(' ')):button.textContent;
  button.hidden=!searchable.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(q);
 });
});
$('choices').addEventListener('click',function(e){
 const select=e.target.closest('[data-ficha]');
 if(select){
  selectedFicha=window.TereonXCatalog.get(select.dataset.ficha);
  if(!selectedFicha)return;
  choosingFicha=false;values={};skippedOptional.clear();
  populateUnitOptions();
  if(selectedFicha.id==='FT_COND-001')$('unit').value='m'; // padrão visual; DET-011 permanece sem confirmação
  fields=getFields();focus=pickFirstMissing();
  redrawAdd();return;
 }
 const skip=e.target.closest('[data-skip-optional]');
 if(skip){
  const field=fields[focus];
  if(!field||field.required||field.id!==skip.dataset.skipOptional)return;
  skippedOptional.add(field.id);optionNotice='';
  fields=getFields();focus=pickFirstMissing();redrawAdd();return;
 }
 const blocked=e.target.closest('[data-blocked-option]');
 if(blocked&&selectedFicha&&fields[focus]){
  const current=fields[focus];
  const state=window.TereonXCatalog.optionStates(selectedFicha,values,current.id).find(x=>x.option===blocked.dataset.blockedOption);
  optionNotice=(state?.reason||'Opção indisponível')+'. Para alterar, remova a tag relacionada destacada acima.';
  redrawAdd();return;
 }
 const b=e.target.closest('[data-pick]');if(!b||!fields[focus])return;
 const field=fields[focus];
 const next=Object.assign({},values,{[field.id]:b.dataset.pick});
 // Somente o detalhe DERIVADO perde a confirmação automaticamente se uma camada mudar.
 reconcileInvalidOptional(next);
 if(selectedFicha){
  const problems=window.TereonXCatalog.conflicts(selectedFicha,next);
  if(problems.length){alert('Combinação não permitida pela ficha: '+problems.join('; ')+'. Remova a tag incompatível antes de continuar.');return;}
 }
 values=next;optionNotice='';
 if(selectedFicha?.id==='FT_COND-001'&&field.id==='DET-011')$('unit').value=values['DET-011'];
 skippedOptional.delete(field.id);
 fields=getFields();focus=pickFirstMissing();redrawAdd();
});
$('stageTags').addEventListener('click',function(e){var b=e.target.closest('[data-stage]');if(b){$('stage').value=b.dataset.stage;validate();}});
['qty','stage'].forEach(function(x){$(x).addEventListener('input',function(){if(x==='qty'){editingLegacyQuantity=false;redrawAdd();}else validate();});});
$('unit').addEventListener('change',function(){
 editingLegacyQuantity=false;
 if(selectedFicha?.id==='FT_COND-001'){
  values['DET-011']=$('unit').value;
  skippedOptional.delete('DET-011');
  fields=getFields();focus=pickFirstMissing();
 }
 redrawAdd();
});
$('saveItem').addEventListener('click',function(){
 var l=list();if(!l||choosingFicha||!(Number($('qty').value)>0)||!$('stage').value.trim())return;
 if(selectedFicha&&window.TereonXCatalog.missing(selectedFicha,values).length)return;
 if(!selectedFicha&&count()!==6)return;
 if(selectedFicha&&window.TereonXCatalog.conflicts(selectedFicha,values).length){
   alert('A ficha contém escolhas incompatíveis. Revise as tags antes de salvar.');return;
 }
 if(selectedFicha?.id==='FT_COND-001'){
  const known=selectedFicha.details.find(d=>d.id==='DET-011')?.options||[];
  if(!known.includes($('unit').value)){alert('Unidade não prevista na ficha atual.');return;}
  if(values['DET-011']&&values['DET-011']!==$('unit').value)values['DET-011']=$('unit').value;
 }
 var itemData={name:name(),catalogId:selectedFicha?.id||null,values:Object.assign({},values),qty:$('qty').value,unit:$('unit').value,stage:$('stage').value.trim(),fichaStatus:selectedFicha?.status||'Ficha anterior',simulacao:selectedFicha?.kind==='simulacao'};
 if(selectedFicha?.id==='FT_COND-001'&&!editingLegacyQuantity)itemData.qtyBasis='m';
 // Sem regras paralelas: Comportamento ao fogo é o DET-010 da própria ficha.
 if(!safe(function(){return lists.upsertItem(activeId,itemData,editId);}))return;
 close('addDialog');editId=null;draw();
});
$('addDialog').addEventListener('cancel',function(){values={};});
draw();
})();
