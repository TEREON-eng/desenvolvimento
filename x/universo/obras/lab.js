/* TEREON X · UI do laboratório de Obras. Não contém regras de negócio. */
import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.80.0?bundle';
const client=createClient('https://kjikzdpqejhsgutakigw.supabase.co','sb_publishable_sDnGg8LHSitHRRBEgtny4A_zmFvpcx1');
const works=globalThis.TereonXWorks.create(client);
const $=id=>document.getElementById(id);
const statuses={planning:'Planejamento',active:'Em andamento',paused:'Pausada',completed:'Concluída',archived:'Arquivada'};
let spaces=[],current=[],editing=null,busy=false;
function say(msg,error=false){$('notice').textContent=msg;$('notice').classList.toggle('error',error)}
function element(tag,text,className){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(className)e.className=className;return e}
function busyState(v){busy=v;document.querySelectorAll('button').forEach(b=>b.disabled=v)}
function openEditor(work=null){
 editing=work?.id||null;$('editor').classList.remove('hidden');
 $('editor-title').textContent=work?'Editar obra':'Nova obra';
 $('work-name').value=work?.name||'';
 $('work-description').value=work?.description||'';
 $('work-status').value=work?.status||'planning';
 $('work-name').focus();
}
function closeEditor(){editing=null;$('editor').classList.add('hidden');$('work-form').reset()}
function render(){
 $('works').replaceChildren();
 $('stat-active').textContent=String(current.filter(x=>x.status==='active').length);
 $('stat-total').textContent=String(current.length);
 if(!current.length){$('works').append(element('p','Nenhuma obra cadastrada neste espaço.','hint'));return}
 for(const work of current){
  const card=element('article',undefined,'work');
  card.append(element('h3',work.name),element('small',statuses[work.status]||work.status));
  if(work.description)card.append(element('p',work.description));
  const edit=element('button','Editar','quiet');edit.type='button';edit.onclick=()=>openEditor(work);card.append(edit);
  if(work.status!=='archived'){
   const archive=element('button','Arquivar','quiet');archive.type='button';
   archive.onclick=async()=>{
    if(!confirm('Arquivar esta obra? Ela será preservada e poderá ser reativada depois.'))return;
    await operation(async()=>{await works.archive(work.id,work);await refreshWorks()},'Obra arquivada.');
   };
   card.append(archive);
  }
  $('works').append(card);
 }
}
async function refreshWorks(){
 const id=$('space').value;
 current=id?await works.list(id):[];
 render();
}
async function refreshSpaces(selectId){
 spaces=await works.spaces();
 const selector=$('space');selector.replaceChildren();
 for(const sp of spaces){
  const opt=element('option',sp.name+' · '+(sp.kind==='personal'?'Pessoal':'Empresa'));opt.value=sp.id;selector.append(opt);
 }
 if(selectId&&spaces.some(x=>x.id===selectId))selector.value=selectId;
 if(!spaces.length){
  $('space-form').classList.remove('hidden');
  $('space-tip').textContent='Crie seu primeiro espaço pessoal para começar a cadastrar obras.';
  current=[];render();$('new-work').disabled=true;
 }else{
  $('new-work').disabled=false;
  await refreshWorks();
 }
}
async function operation(action,success){
 if(busy)return;busyState(true);say('');
 try{await action();say(success)}
 catch(error){say(error.message||'Não foi possível concluir a operação.',true)}
 finally{busyState(false)}
}
$('space').onchange=()=>operation(async()=>{closeEditor();await refreshWorks()},'Espaço carregado.');
$('show-space-form').onclick=()=>$('space-form').classList.toggle('hidden');
$('space-form').onsubmit=e=>{
 e.preventDefault();
 operation(async()=>{
  const created=await works.createSpace($('space-name').value,$('space-kind').value);
  $('space-form').reset();$('space-form').classList.add('hidden');
  await refreshSpaces(created.id);
 },'Espaço criado.');
};
$('new-work').onclick=()=>openEditor();
$('cancel-work').onclick=closeEditor;
$('work-form').onsubmit=e=>{
 e.preventDefault();
 const payload={name:$('work-name').value,description:$('work-description').value,status:$('work-status').value};
 const spaceId=$('space').value;
 operation(async()=>{
  if(editing)await works.updateWork(editing,payload);
  else await works.createWork(spaceId,payload);
  closeEditor();await refreshWorks();
 },editing?'Obra atualizada.':'Obra cadastrada.');
};
async function start(){
 try{
  const result=await client.auth.getSession();
  if(result.error)throw result.error;
  if(!result.data?.session){
   $('logged-out').classList.remove('hidden');$('app').classList.add('hidden');
   say('Entre na sua conta TEREON para cadastrar obras.');return;
  }
  $('logged-out').classList.add('hidden');$('app').classList.remove('hidden');
  await refreshSpaces();say('Motor de Obras carregado. Nenhum outro módulo foi alterado.');
 }catch(error){$('logged-out').classList.remove('hidden');$('app').classList.add('hidden');say('Falha ao consultar sua conta: '+(error.message||'erro desconhecido'),true)}
}
start();
