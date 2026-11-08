/* TEREON X — laboratório de compartilhamento; sem dependência do shell. */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.80.0?bundle';
const db=createClient('https://kjikzdpqejhsgutakigw.supabase.co','sb_publishable_sDnGg8LHSitHRRBEgtny4A_zmFvpcx1');
const shares=globalThis.TereonXUserShares.create(db);
const $=id=>document.getElementById(id);
const message=(text,isError=false)=>{$('message').textContent=text;$('message').classList.toggle('error',isError);};
const demo={id:'exemplo-lab',name:'Exemplo de laboratório — não é uma lista real',stages:['Geral'],items:[{id:'demo-1',name:'Eletroduto rígido PVC 3/4"',qty:3,unit:'barra',stage:'Geral',values:{}},{id:'demo-2',name:'Caixa de passagem',qty:2,unit:'un',stage:'Geral',values:{}}]};
const labels={pending:'Aguardando aceite',accepted:'Aceita',declined:'Recusada',revoked:'Acesso revogado'};
let localLists=new Map([[demo.id,demo]]);
let busy=false;
function node(tag,text,cls){
 const element=document.createElement(tag);
 if(text!==undefined)element.textContent=String(text);
 if(cls)element.className=cls;
 return element;
}
function button(text,callback){
 const b=node('button',text);b.type='button';
 b.addEventListener('click',callback);return b;
}
function setBusy(value){busy=value;for(const b of document.querySelectorAll('button'))b.disabled=value;}
function fmt(value){const d=new Date(value);return Number.isNaN(+d)?'—':d.toLocaleDateString('pt-BR');}
function loadLocalLists(){
 try {
  const store=globalThis.TereonXListStore.create({storage:localStorage});
  const service=globalThis.TereonXLists.create(store);
  for(const l of service.snapshot().lists){
   if(l&&l.items&&l.items.length)localLists.set(String(l.id),service.exportList(l.id));
  }
 }catch(error){message('Não foi possível ler as listas locais. Os dados não foram alterados. '+error.message,true)}
 const sel=$('source-list');sel.replaceChildren();
 for(const [id,l] of localLists){const o=node('option',l.name+' ('+l.items.length+' itens)');o.value=id;sel.append(o);}
}
function entry(row,outgoing){
 const card=node('article',undefined,'entry');
 const list=row.list_snapshot||{};
 card.append(node('h3',list.name||'Lista sem nome'));
 const line=outgoing?'Para: '+row.recipient_user_id:'De: '+row.sender_user_id;
 card.append(node('p',line),node('p',(labels[row.status]||row.status)+' · '+fmt(row.created_at)));
 const actions=node('div',undefined,'actions');
 const show=button('Ver materiais',()=>{
  const old=card.querySelector('.items');
  if(old){old.remove();return;}
  const ul=node('ul',undefined,'items');
  for(const item of (list.items||[])){
   ul.append(node('li',item.name+' — '+Number(item.qty).toLocaleString('pt-BR')+' '+item.unit+(item.stage?' · '+item.stage:'')));
  }
  card.append(ul);
 });actions.append(show);
 if(!outgoing&&row.status==='pending'){
  actions.append(button('Aceitar',()=>transition(()=>shares.respond(row.id,'accepted'),'Lista recebida e aceita.')));
  actions.append(button('Recusar',()=>transition(()=>shares.respond(row.id,'declined'),'Compartilhamento recusado.')));
 }
 if(outgoing&&['pending','accepted'].includes(row.status)){
  actions.append(button('Revogar acesso',()=>transition(()=>shares.revoke(row.id),'Acesso revogado.')));
 }
 card.append(actions);
 return card;
}
async function transition(operation,success){
 if(busy)return;setBusy(true);
 try{await operation();await loadAll();message(success);}
 catch(error){message(error.message||'Falha ao atualizar compartilhamento.',true)}
 finally{setBusy(false)}
}
async function loadAll(){
 const [incoming,outgoing]=await Promise.all([shares.inbox(),shares.outbox()]);
 $('inbox').replaceChildren(...(incoming.length?incoming.map(row=>entry(row,false)):[node('p','Nenhuma lista recebida.','muted')]));
 $('outbox').replaceChildren(...(outgoing.length?outgoing.map(row=>entry(row,true)):[node('p','Nenhuma lista enviada.','muted')]));
}
function showLoggedOut(){
 $('logged-out').classList.remove('hidden');
 $('workspace').classList.add('hidden');
 message('Você ainda não está conectado neste endereço. Entre na sua conta TEREON e volte a esta página.');
}
async function start(){
 try{
  // getUser() sozinho devolve AuthSessionMissingError quando não há login.
  // A ausência de sessão é situação normal, não uma falha do compartilhamento.
  const sessionResult=await db.auth.getSession();
  if(sessionResult.error)throw sessionResult.error;
  if(!sessionResult.data?.session){showLoggedOut();return;}
  const result=await db.auth.getUser();
  if(result.error){
   if(result.error.name==='AuthSessionMissingError'||/auth session missing/i.test(result.error.message||'')){
    showLoggedOut();return;
   }
   throw result.error;
  }
  if(!result.data?.user){showLoggedOut();return;}
  $('user-email').textContent=result.data.user.email||'Conta TEREON';
  $('my-code').value=result.data.user.id;
  $('logged-out').classList.add('hidden');$('workspace').classList.remove('hidden');
  loadLocalLists();
  await loadAll();
  message('Compartilhamento entre contas disponível para teste.');
 }catch(error){
  $('logged-out').classList.remove('hidden');
  $('workspace').classList.add('hidden');
  message('Não foi possível consultar a conta: '+(error.message||'erro desconhecido'),true);
 }
}
$('copy-code').addEventListener('click',async()=>{
 try{await navigator.clipboard.writeText($('my-code').value);message('Identificador copiado.');}
 catch(error){$('my-code').select();message('Não foi possível copiar automaticamente. Selecione e copie o identificador.',true)}
});
$('share-form').addEventListener('submit',event=>{
 event.preventDefault();
 const list=localLists.get($('source-list').value);
 transition(()=>shares.send($('recipient').value,list),'Cópia enviada. O destinatário pode consultar e aceitar no laboratório.');
});
$('refresh-inbox').addEventListener('click',()=>transition(async()=>{await loadAll()},'Recebidas atualizadas.'));
$('refresh-outbox').addEventListener('click',()=>transition(async()=>{await loadAll()},'Enviadas atualizadas.'));
start();
