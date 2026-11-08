/* TEREON X · laboratório de Listas na Nuvem, separado das listas locais. */
import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.80.0?bundle';
const client=createClient('https://kjikzdpqejhsgutakigw.supabase.co','sb_publishable_sDnGg8LHSitHRRBEgtny4A_zmFvpcx1');
const cloud=globalThis.TereonXCloudLists.create(client);
const $=id=>document.getElementById(id),clone=x=>JSON.parse(JSON.stringify(x));
let rows=[],opened=null,draft=null,dirty=false,editingItem=null,busy=false,editingName=false;
function say(message,error=false){$('notice').textContent=message;$('notice').classList.toggle('error',error)}
function el(tag,content,className){const n=document.createElement(tag);if(content!==undefined)n.textContent=content;if(className)n.className=className;return n}
function btn(text,action,cls='btn'){const n=el('button',text,cls);n.type='button';n.onclick=action;return n}
function openDialog(id){$(id).showModal()}
function closeDialog(id){if($(id).open)$(id).close()}
function busyMode(flag){busy=flag;document.querySelectorAll('button').forEach(x=>x.disabled=flag)}
async function run(fn,success){if(busy)return;busyMode(true);say('');try{await fn();if(success)say(success)}catch(e){say(e.message||'Não foi possível concluir.',true)}finally{busyMode(false)}}
function confirmDiscard(){return !dirty||window.confirm('Existem alterações não salvas. Descartá-las?')}
function renderRows(){
 $('list-rows').replaceChildren();
 if(!rows.length){$('list-rows').append(el('p','Nenhuma lista online. Crie uma lista para começar.','empty'));return}
 for(const record of rows){
  const row=el('article',undefined,'list-row'),details=el('div');
  details.append(el('strong',record.name),el('small',record.items.length+' material(is) · '+new Date(record.updated_at).toLocaleString('pt-BR')));
  row.append(details,btn('Abrir',()=>run(async()=>{if(!confirmDiscard())return;const found=await cloud.get(record.id);opened=found;draft=clone(found);dirty=false;renderDetail()},'Lista carregada da nuvem.')));
  $('list-rows').append(row);
 }
}
function renderDetail(){
 $('detail').classList.toggle('hidden',!draft);
 if(!draft)return;
 $('detail-title').textContent=draft.name;
 $('items').replaceChildren();
 if(!draft.items.length)$('items').append(el('p','Nenhum material lançado.','empty'));
 for(const [index,item] of draft.items.entries()){
  const row=el('div',undefined,'item-row'),content=el('div');
  content.append(el('strong',item.name),el('small',item.qty+' '+item.unit+' · '+item.stage));
  const actions=el('div',undefined,'actions');
  actions.append(btn('Editar',()=>openItem(index)),btn('Remover',()=>{draft.items.splice(index,1);dirty=true;renderDetail()},'btn'));
  row.append(content,actions);$('items').append(row);
 }
 $('save-list').textContent=dirty?'Salvar alterações *':'Salvar alterações';
}
function openItem(index=null){
 if(!draft)return;
 editingItem=index;
 const item=index==null?null:draft.items[index];
 $('item-dialog-title').textContent=item?'Editar material':'Adicionar material';
 $('item-name').value=item?.name||'';
 $('item-qty').value=item?.qty||'';
 $('item-unit').value=item?.unit||'un';
 $('item-stage').value=item?.stage||'Geral';
 if(item&&!['un','m','rl','br'].includes(item.unit)){
  const option=el('option',item.unit);option.value=item.unit;$('item-unit').append(option);$('item-unit').value=item.unit;
 }
 openDialog('item-dialog');$('item-name').focus();
}
async function refresh(){
 rows=await cloud.list();renderRows();
 if(opened&&rows.some(x=>x.id===opened.id)){
  // Nunca atualizar o rascunho aberto automaticamente: evitar perda de edição local.
 }
}
document.querySelectorAll('[data-close]').forEach(button=>button.onclick=()=>closeDialog(button.dataset.close));
$('new-list').onclick=()=>{editingName=false;$('list-dialog-title').textContent='Criar lista';$('list-name').value='';openDialog('list-dialog')};
$('rename-list').onclick=()=>{if(!draft)return;editingName=true;$('list-dialog-title').textContent='Editar nome';$('list-name').value=draft.name;openDialog('list-dialog')};
$('close-detail').onclick=()=>{if(!confirmDiscard())return;opened=null;draft=null;dirty=false;renderDetail()};
$('add-item').onclick=()=>openItem();
$('list-form').onsubmit=e=>{
 e.preventDefault();const name=$('list-name').value.trim();if(!name)return;
 if(editingName){draft.name=name;dirty=true;closeDialog('list-dialog');renderDetail();return}
 run(async()=>{const row=await cloud.createList({name,items:[],stages:[]});closeDialog('list-dialog');opened=row;draft=clone(row);dirty=false;await refresh();renderDetail()},'Lista criada e salva na sua conta.');
};
$('item-form').onsubmit=e=>{
 e.preventDefault();if(!draft)return;
 const item={id:editingItem===null?globalThis.crypto.randomUUID():draft.items[editingItem].id,
  name:$('item-name').value.trim(),qty:Number($('item-qty').value),unit:$('item-unit').value,stage:$('item-stage').value.trim(),values:editingItem===null?{}:draft.items[editingItem].values||{}};
 if(!item.name||!item.stage||!(item.qty>0)){say('Preencha os dados do material.',true);return}
 if(editingItem===null)draft.items.push(item);else draft.items[editingItem]=item;
 draft.stages=[...new Set(draft.items.map(x=>x.stage))];
 dirty=true;closeDialog('item-dialog');renderDetail();
};
$('save-list').onclick=()=>run(async()=>{
 if(!draft||!opened)return;
 if(!dirty){say('Nenhuma alteração pendente.');return}
 const updated=await cloud.updateList(opened.id,opened.version,draft);
 opened=updated;draft=clone(updated);dirty=false;await refresh();renderDetail();
},'Lista salva na nuvem.');
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue=''}});
async function start(){
 try{
  const result=await client.auth.getUser();
  if(result.error)throw result.error;
  if(!result.data?.user){
   $('logged-out').classList.remove('hidden');$('app').classList.add('hidden');
   say('Entre na sua conta TEREON para testar listas na nuvem.');return;
  }
  $('logged-out').classList.add('hidden');$('app').classList.remove('hidden');
  await refresh();say('Listas da sua conta carregadas.');
 }catch(error){say(error.message||'Erro ao iniciar o laboratório.',true)}
}
start();
