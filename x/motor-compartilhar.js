/* TEREON X — compartilhamento por finalidade e canal.
   Relatórios são somente projeções dos lançamentos. Jamais reespecificar
   itens, converter dados antigos ou alegar aprovação técnica. */
(function(root){
'use strict';
let current=null,mode='text',purpose='compras';
const $=id=>document.getElementById(id);
const esc=x=>String(x??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=n=>Number(n).toLocaleString('pt-BR',{maximumFractionDigits:6});
const labels={compras:'Pedido de materiais',completo:'Relatório completo',execucao:'Materiais por etapa'};
const css=`
.ter-share-dialog{border:0;border-radius:18px;padding:0;width:min(94vw,570px);max-height:90dvh;color:#18231e;box-shadow:0 14px 55px #0004}
.ter-share-dialog::backdrop{background:#0008}
.ter-share-inner{padding:18px;display:grid;gap:13px;background:#fff}
.ter-share-top{display:flex;justify-content:space-between;align-items:center;gap:12px}
.ter-share-purpose,.ter-share-format{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
.ter-share-purpose button,.ter-share-format button{padding:10px 5px;border:1px solid #bdcfc2;background:#fff;border-radius:9px;color:#19372b;font-size:12px;min-height:43px}
.ter-share-purpose button[aria-pressed=true],.ter-share-format button[aria-pressed=true]{color:#fff;background:#173e2b}
.ter-share-preview{border:1px solid #dde6de;border-radius:10px;background:#f5f8f6;padding:11px;white-space:pre-wrap;overflow:auto;max-height:29dvh;font:12px/1.55 system-ui}
.ter-share-action{background:#173e2b;color:#fff;border:0;border-radius:10px;padding:12px;font:600 14px system-ui}
.ter-share-note{font:12px/1.4 system-ui;color:#42614d}
`;
function model(list){
 const items=list.items||[];
 const rows=items.map(it=>{
  const ficha=it.catalogId?root.TereonXCatalog?.get?.(it.catalogId):null;
  const knownNames=new Map((ficha?.details||[]).map(d=>[d.id,d.name]));
  return {
   id:String(it.id||''),name:String(it.name||'Material'),qty:Number(it.qty),
   unit:String(it.unit||'un'),stage:String(it.stage||'Geral'),
   details:Object.entries(it.values||{}).filter(([,v])=>v!=null&&String(v).trim())
    .map(([k,v])=>(knownNames.get(k)||k)+': '+String(v)),
   item:it
  };
 });
 if(rows.some(r=>!Number.isFinite(r.qty)||r.qty<=0))throw Error('Há uma quantidade inválida na lista.');
 const groups=root.TereonXQuant?.consolidate(items)||[];
 const groupedIds=new Set(groups.flatMap(g=>g.sourceIds||[]));
 const legacy=rows.filter(r=>!groupedIds.has(r.id));
 const review=rows.some(r=>r.item.simulacao||r.item.fichaStatus&&
  !['aprovada','publicada','oficial'].includes(String(r.item.fichaStatus).toLowerCase()));
 return {name:String(list.name||'Lista de materiais'),rows,groups,legacy,review};
}
function quantityOf(r){
 return fmt(r.qty)+(r.item.qtyBasis==='m'?' m medidos · '+r.unit:' '+r.unit);
}
function purchaseQuantity(g){
 if(g.kind==='lance')return fmt(g.units)+' lances · '+fmt(g.meters)+' m medidos';
 if(g.kind==='package'){
  const roll=String(g.unit).toLowerCase().startsWith('rl');
  return fmt(g.units)+' '+(roll?(g.units===1?'rolo':'rolos'):(g.units===1?'barra':'barras'))+
   ' de '+fmt(g.factor)+' m · '+fmt(g.meters)+' m medidos';
 }
 return fmt(g.meters)+' m';
}
function stageBreakdown(g,rows){
 const ids=new Set(g.sourceIds||[]),byStage=new Map();
 rows.filter(r=>ids.has(r.id)).forEach(r=>{
  byStage.set(r.stage,(byStage.get(r.stage)||0)+r.qty);
 });
 return [...byStage].map(([stage,n])=>stage+': '+fmt(n)+' m');
}
function sections(m,kind='compras'){
 if(!labels[kind])throw Error('Finalidade de relatório inválida.');
 if(kind==='compras'){
  const lines=[];
  m.groups.forEach(g=>{
   const detail=['Compra: '+purchaseQuantity(g)];
   if(g.kind==='lance')detail.push('Composição: '+g.breakdown.map(x=>fmt(x.count)+' × '+fmt(x.length)+' m').join(' + '));
   const stages=stageBreakdown(g,m.rows);
   if(stages.length)detail.push('Etapas: '+stages.join(' · '));
   lines.push({name:g.name,detail});
  });
  m.legacy.forEach(r=>lines.push({name:r.name,detail:[
   'Compra: '+fmt(r.qty)+' '+r.unit+' (unidade original, sem conversão)',
   'Etapa: '+r.stage
  ]}));
  return [{title:'Itens para compra',entries:lines}];
 }
 if(kind==='completo')return [{title:'Lançamentos e especificações',entries:m.rows.map(r=>({
  name:r.name,detail:['Quantidade: '+quantityOf(r),'Etapa: '+r.stage,...r.details]
 }))}];
 const stages=[...new Set(m.rows.map(r=>r.stage))];
 return stages.map(stage=>({title:'Etapa · '+stage,entries:m.rows.filter(r=>r.stage===stage).map(r=>{
  const d=root.TereonXQuant?.describe(r.item);
  return {name:r.name,detail:[
   'Quantidade: '+quantityOf(r),
   ...(d?.kind==='lance'?['Trechos: '+fmt(d.units)+' × '+fmt(d.each)+' m']:[])
  ]};
 })}));
}
function disclaimer(m){
 return m.review?'ATENÇÃO: há fichas em revisão ou itens de simulação. Conferir os materiais antes de comprar.':
  'Conferir especificações, apresentação e quantidades antes de comprar.';
}
function subject(m,kind='compras'){return 'TEREON | '+labels[kind]+' — '+m.name;}
function text(m,kind='compras',channel='text'){
 const layout=sections(m,kind),whats=channel==='text';
 const strong=value=>whats?'*'+value+'*':value;
 const out=channel==='email'?
  ['Olá,','','Segue '+labels[kind].toLowerCase()+' da lista "'+m.name+'", gerado pelo TEREON.','']:
  [strong('TEREON | '+labels[kind].toUpperCase()),strong('Lista: '+m.name),''];
 let counter=0;
 for(const section of layout){
  out.push(strong(section.title.toUpperCase()));
  section.entries.forEach(entry=>{
   out.push((++counter)+'. '+strong(entry.name));
   entry.detail.forEach(part=>out.push('   '+part));
  });
  out.push('');
 }
 out.push(disclaimer(m));
 if(channel==='email')out.push('','Atenciosamente,','Equipe responsável pela lista');
 else out.push('Gerado pelo TEREON.');
 return out.join('\n');
}
function ensure(){
 if($('terShareDialog'))return;
 const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
 const dialog=document.createElement('dialog');dialog.id='terShareDialog';dialog.className='ter-share-dialog';
 dialog.innerHTML='<div class="ter-share-inner"><div class="ter-share-top"><strong>Compartilhar lista</strong><button type="button" id="terShareClose" aria-label="Fechar">✕</button></div><div class="ter-share-purpose"><button data-purpose="compras">Compras</button><button data-purpose="completo">Completo</button><button data-purpose="execucao">Execução</button></div><div class="ter-share-format"><button data-mode="text">WhatsApp / texto</button><button data-mode="email">E-mail</button><button data-mode="pdf">PDF</button></div><div class="ter-share-preview" id="terSharePreview"></div><button class="ter-share-action" id="terShareSend">Compartilhar texto</button><div id="terShareNote" class="ter-share-note" role="status"></div></div>';
 document.body.appendChild(dialog);
 $('terShareClose').onclick=()=>dialog.close();
 dialog.querySelector('.ter-share-purpose').onclick=e=>{const b=e.target.closest('[data-purpose]');if(!b)return;purpose=b.dataset.purpose;paint();};
 dialog.querySelector('.ter-share-format').onclick=e=>{const b=e.target.closest('[data-mode]');if(!b)return;mode=b.dataset.mode;paint();};
 $('terShareSend').onclick=send;
}
function paint(){
 if(!current)return;
 const preview=text(current,purpose,mode==='pdf'?'pdf':mode==='email'?'email':'text');
 $('terSharePreview').textContent=preview.length>2400?preview.slice(0,2400)+'\n[… prévia limitada; saída integral preservada]':preview;
 $('terShareSend').textContent=mode==='pdf'?'Gerar PDF':mode==='email'?'Preparar e-mail':'Compartilhar texto';
 document.querySelectorAll('#terShareDialog [data-purpose]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.purpose===purpose)));
 document.querySelectorAll('#terShareDialog [data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));
 $('terShareNote').textContent='';
}
async function script(url,name){
 if(root[name])return;
 await new Promise((ok,no)=>{const el=document.createElement('script');el.src=url;el.onload=()=>root[name]?ok():no(Error('Biblioteca indisponível'));el.onerror=()=>no(Error('Não foi possível carregar a biblioteca'));document.head.appendChild(el);});
}
async function makePdf(m,kind='compras'){
 await script('/vendor/pdf-lib-1.17.1.min.js','PDFLib');
 await script('/vendor/fontkit-1.1.1.min.js','fontkit');
 const fontResponse=await fetch('/fonts/DejaVuSans.ttf');
 if(!fontResponse.ok)throw Error('Fonte do documento indisponível');
 const pdf=await root.PDFLib.PDFDocument.create();
 pdf.registerFontkit(root.fontkit);
 const font=await pdf.embedFont(new Uint8Array(await fontResponse.arrayBuffer()),{subset:true});
 const ink=root.PDFLib.rgb(.09,.19,.14),muted=root.PDFLib.rgb(.32,.40,.35),green=root.PDFLib.rgb(.14,.29,.21);
 const W=595,H=842,M=39;let page,y;const pages=[];
 function pageStart(){
  page=pdf.addPage([W,H]);pages.push(page);y=H-43;
  page.drawRectangle({x:M,y:y-3,width:W-2*M,height:4,color:root.PDFLib.rgb(.78,1,.275)});
  y-=28;
 }
 function wrap(value,size,available){
  const words=String(value??'').split(/\s+/),out=[];let row='';
  for(const word of words){
   if(!word)continue;
   const trial=row?row+' '+word:word;
   if(font.widthOfTextAtSize(trial,size)<=available){row=trial;continue;}
   if(row){out.push(row);row='';}
   let rest=word;
   while(rest&&font.widthOfTextAtSize(rest,size)>available){
    let n=1;
    while(n<rest.length&&font.widthOfTextAtSize(rest.slice(0,n+1),size)<=available)n++;
    out.push(rest.slice(0,n));rest=rest.slice(n);
   }
   row=rest;
  }
  if(row)out.push(row);
  return out.length?out:[''];
 }
 function reserve(height){if(y-height<55)pageStart();}
 function write(value,size=9,indent=0,color=ink,space=5){
  const parts=wrap(value,size,W-2*M-indent);
  reserve(parts.length*(size+space));
  for(const part of parts){page.drawText(part,{x:M+indent,y,font,size,color});y-=size+space;}
 }
 function heading(value){
  reserve(31);y-=7;
  page.drawRectangle({x:M,y:y-5,width:W-2*M,height:23,color:root.PDFLib.rgb(.91,.95,.92)});
  page.drawText(value,{x:M+8,y:y+2,font,size:10,color:green});
  y-=32;
 }
 pageStart();
 write('TEREON  |  '+labels[kind].toUpperCase(),15,0,ink,8);
 write(m.name,12,0,green,8);
 write('Emitido em '+new Intl.DateTimeFormat('pt-BR').format(new Date())+'  ·  '+m.rows.length+' lançamento(s)',8,0,muted,11);
 let n=0;
 for(const section of sections(m,kind)){
  heading(section.title);
  for(const entry of section.entries){
   reserve(45);write((++n)+'. '+entry.name,10,0,ink,5);
   for(const detail of entry.detail)write(detail,8.6,14,muted,5);
   y-=7;
  }
 }
 reserve(40);y-=8;write(disclaimer(m),8,0,muted,5);
 for(let i=0;i<pages.length;i++){
  const footer='TEREON · '+labels[kind]+'  |  Página '+(i+1)+' de '+pages.length;
  pages[i].drawText(footer,{x:M,y:29,font,size:8,color:muted});
 }
 const pdfBytes=await pdf.save();
 const fileName=m.name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z0-9_-]+/g,'-').slice(0,60)||'lista';
 return new File([pdfBytes],'TEREON-'+kind+'-'+fileName+'.pdf',{type:'application/pdf'});
}
async function send(){
 const note=$('terShareNote'),button=$('terShareSend');button.disabled=true;note.textContent='Preparando...';
 try{
  if(mode==='email'){
   const body=text(current,purpose,'email'),title=subject(current,purpose);
   // Evita URLs mailto truncadas por clientes que impõem limite de tamanho.
   if(encodeURIComponent(body).length<1700){
    root.location.href='mailto:?subject='+encodeURIComponent(title)+'&body='+encodeURIComponent(body);
    note.textContent='Confirme o destinatário e o envio no aplicativo de e-mail.';
   }else{
    await navigator.clipboard.writeText('Assunto: '+title+'\n\n'+body);
    note.textContent='Relatório longo: assunto e conteúdo copiados para o e-mail.';
   }
  }else if(mode==='text'){
   const message=text(current,purpose,'text');
   if(navigator.share){
    try{await navigator.share({title:subject(current,purpose),text:message});note.textContent='Compartilhamento iniciado.';}
    catch(e){if(e.name!=='AbortError')throw e;note.textContent='Compartilhamento cancelado.';}
   }else{
    await navigator.clipboard.writeText(message);note.textContent='Texto copiado para colar no WhatsApp.';
   }
  }else{
   const file=await makePdf(current,purpose);
   if(navigator.share&&navigator.canShare?.({files:[file]})){
    try{await navigator.share({files:[file],title:file.name});note.textContent='PDF pronto para compartilhar.';return;}
    catch(e){if(e.name==='AbortError'){note.textContent='Compartilhamento cancelado.';return;}}
   }
   const url=URL.createObjectURL(file),anchor=document.createElement('a');
   anchor.href=url;anchor.download=file.name;document.body.appendChild(anchor);anchor.click();anchor.remove();
   setTimeout(()=>URL.revokeObjectURL(url),60000);
   note.textContent='PDF gerado para download.';
  }
 }catch(error){note.textContent='Não foi possível concluir: '+(error.message||'erro desconhecido');}
 finally{button.disabled=false;}
}
root.TereonXShare={open(list){
 try{current=model(list);if(!current.rows.length){alert('Adicione um material antes de compartilhar.');return;}
 ensure();mode='text';purpose='compras';paint();$('terShareDialog').showModal();}
 catch(error){alert(error.message);}
},model,text,sections,subject};
})(window);
