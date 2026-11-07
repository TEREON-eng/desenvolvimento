/* Motor TEREON Compartilhar X — adaptador do laboratório.
   Independente do cadastro/lista, nunca altera os registros de origem. */
(function(root){
'use strict';
let current=null,mode='text';
const $=id=>document.getElementById(id);
const esc=x=>String(x??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&quot;'}[c]));
const qty=n=>Number(n).toLocaleString('pt-BR',{maximumFractionDigits:4});
const css=`
.ter-share-dialog{border:0;border-radius:18px;padding:0;width:min(94vw,570px);max-height:90dvh;color:#18231e;box-shadow:0 14px 55px #0004}
.ter-share-dialog::backdrop{background:#0008}
.ter-share-inner{padding:18px;display:grid;gap:13px;background:#fff}
.ter-share-top{display:flex;justify-content:space-between;align-items:center;gap:12px}
.ter-share-format{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
.ter-share-format button{padding:10px 5px;border:1px solid #bdcfc2;background:#fff;border-radius:9px;color:#19372b;font-size:12px;min-height:43px}
.ter-share-format button[aria-pressed=true]{color:#fff;background:#173e2b}
.ter-share-preview{border:1px solid #dde6de;border-radius:10px;background:#f5f8f6;padding:11px;white-space:pre-wrap;overflow:auto;max-height:27dvh;font:12px/1.55 system-ui}
.ter-share-action{background:#173e2b;color:#fff;border:0;border-radius:10px;padding:12px;font:600 14px system-ui}
.ter-share-note{font:12px/1.4 system-ui;color:#42614d}
`;
function model(list){
 const rows=(list.items||[]).map(it=>({
  name:String(it.name||'Material'),qty:Number(it.qty),unit:String(it.unit||'un'),
  stage:String(it.stage||'Geral'),details:Object.entries(it.values||{}).filter(([k,v])=>v!=null&&String(v).trim()).map(([k,v])=>String(k)+': '+String(v))
 }));
 if(rows.some(r=>!Number.isFinite(r.qty)||r.qty<=0))throw Error('Há uma quantidade inválida na lista.');
 return {name:String(list.name||'Lista de materiais'),rows};
}
function text(m){
 const out=['TEREON | LISTA DE MATERIAIS',m.name,''];
 m.rows.forEach((r,i)=>{
  out.push((i+1)+'. '+r.name+' — '+qty(r.qty)+' '+r.unit);
  if(r.details.length)out.push('   '+r.details.join(' · '));
  out.push('   Etapa: '+r.stage);
 });
 out.push('','Cópia informativa gerada pelo TEREON.');
 return out.join('\n');
}
function ensure(){
 if($('terShareDialog'))return;
 const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
 const dialog=document.createElement('dialog');dialog.id='terShareDialog';dialog.className='ter-share-dialog';
 dialog.innerHTML='<div class="ter-share-inner"><div class="ter-share-top"><strong>Compartilhar lista</strong><button type="button" id="terShareClose" aria-label="Fechar">✕</button></div><div class="ter-share-format"><button data-mode="text" aria-pressed="true">WhatsApp / texto</button><button data-mode="email">E-mail</button><button data-mode="pdf">PDF</button></div><div class="ter-share-preview" id="terSharePreview"></div><button class="ter-share-action" id="terShareSend">Compartilhar texto</button><div id="terShareNote" class="ter-share-note" role="status"></div></div>';
 document.body.appendChild(dialog);
 $('terShareClose').onclick=()=>dialog.close();
 dialog.querySelector('.ter-share-format').onclick=e=>{
  const b=e.target.closest('[data-mode]');if(!b)return;mode=b.dataset.mode;paint();
 };
 $('terShareSend').onclick=send;
}
function paint(){
 if(!current)return;
 $('terSharePreview').textContent=text(current).slice(0,1600);
 $('terShareSend').textContent=mode==='pdf'?'Gerar PDF':mode==='email'?'Preparar e-mail':'Compartilhar texto';
 document.querySelectorAll('#terShareDialog [data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));
 $('terShareNote').textContent='';
}
async function script(url,name){
 if(root[name])return;
 await new Promise((ok,no)=>{const e=document.createElement('script');e.src=url;e.onload=()=>root[name]?ok():no(Error('Biblioteca indisponível'));e.onerror=()=>no(Error('Não foi possível carregar a biblioteca'));document.head.appendChild(e);});
}
async function makePdf(m){
 await script('/vendor/pdf-lib-1.17.1.min.js','PDFLib');
 await script('/vendor/fontkit-1.1.1.min.js','fontkit');
 const fontResponse=await fetch('/fonts/DejaVuSans.ttf');
 if(!fontResponse.ok)throw Error('Fonte do documento indisponível');
 const documentPdf=await root.PDFLib.PDFDocument.create();
 documentPdf.registerFontkit(root.fontkit);
 const font=await documentPdf.embedFont(new Uint8Array(await fontResponse.arrayBuffer()),{subset:true});
 let page,y;const W=595,H=842,M=40;
 function begin(){page=documentPdf.addPage([W,H]);y=H-50;}
 function line(value,size=9,space=14){
  const msg=String(value);
  let partial='';
  for(const word of msg.split(/\s+/)){
   const next=partial?partial+' '+word:word;
   if(font.widthOfTextAtSize(next,size)>W-2*M&&partial){write(partial,size,space);partial=word;}else partial=next;
  }
  if(partial)write(partial,size,space);
 }
 function write(value,size,space){if(y<60)begin();page.drawText(value,{x:M,y,font,size,color:root.PDFLib.rgb(.1,.19,.14)});y-=space;}
 begin();line('TEREON | LISTA DE MATERIAIS',12,24);line(m.name,13,26);
 m.rows.forEach((r,i)=>{
  line((i+1)+'. '+r.name,10,17);line('Quantidade: '+qty(r.qty)+' '+r.unit,9);
  r.details.forEach(x=>line(x,8,13));line('Etapa: '+r.stage,8,18);
 });
 const pdfBytes=await documentPdf.save();
 const name=m.name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z0-9_-]+/g,'-').slice(0,70)||'lista';
 return new File([pdfBytes],name+'.pdf',{type:'application/pdf'});
}
async function send(){
 const note=$('terShareNote'),button=$('terShareSend');button.disabled=true;note.textContent='Preparando...';
 try{
  const message=text(current);
  if(mode==='email'){
   if(message.length<1800){root.location.href='mailto:?subject='+encodeURIComponent('TEREON | '+current.name)+'&body='+encodeURIComponent(message);note.textContent='Confirme o envio no aplicativo de e-mail.';}
   else{await navigator.clipboard.writeText(message);note.textContent='Lista longa: texto copiado para colar no e-mail.';}
  }else if(mode==='text'){
   if(navigator.share){try{await navigator.share({title:current.name,text:message});note.textContent='Compartilhamento iniciado.';}catch(e){if(e.name!=='AbortError')throw e;note.textContent='Compartilhamento cancelado.';}}
   else{await navigator.clipboard.writeText(message);note.textContent='Texto copiado para o WhatsApp.';}
  }else{
   const file=await makePdf(current);
   if(navigator.share&&navigator.canShare?.({files:[file]})){
    try{await navigator.share({files:[file],title:file.name});note.textContent='PDF pronto para compartilhar.';return;}catch(e){if(e.name==='AbortError'){note.textContent='Compartilhamento cancelado.';return;}}
   }
   const url=URL.createObjectURL(file),a=document.createElement('a');a.href=url;a.download=file.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
   note.textContent='PDF gerado para download.';
  }
 }catch(e){note.textContent='Não foi possível concluir: '+(e.message||'erro desconhecido');}
 finally{button.disabled=false;}
}
root.TereonXShare={open(list){try{current=model(list);if(!current.rows.length){alert('Adicione um material antes de compartilhar.');return;}ensure();mode='text';paint();$('terShareDialog').showModal();}catch(e){alert(e.message);}},model,text};
})(window);
