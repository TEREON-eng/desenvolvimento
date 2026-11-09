/* Cabeçalho compartilhado: navegação e indicadores; sem acesso a listas ou fichas. */
(function(root){
'use strict';
const holder=root.document?.querySelector('[data-tx-header]');
if(!holder)return;
const main=holder.dataset.txHeader==='main';
const back=holder.dataset.backHref||'/x/';
const backLabel=holder.dataset.backLabel||'← Início';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
holder.classList.add('tx-global-header');
holder.innerHTML='<div class="tx-header-row"><a class="tx-brand" href="/x/"'+(main?' data-action="home"':'')+' aria-label="TEREON X — ir às Ferramentas"><span class="tx-brand-name">TEREON X</span><span class="tx-brand-sub">Tecnologia que faz a engenharia fluir.</span></a>'+
 '<div class="tx-header-right"><a class="tx-account-link" href="/x/identidade/lab.html" aria-label="Minha conta">◉ <span id="txProfileName">Visitante</span></a>'+
 '<span id="xStatus" class="tx-badges" role="status" aria-live="polite" aria-label="Conexão e situação da conta"><span id="xConnection" class="tx-status-part">Verificando rede</span><span id="xAccount" class="tx-status-part">Verificando conta</span></span></div></div>'+
 (main?'<div class="tx-nav"><button id="installButton" type="button" hidden>↓ Instalar</button></div>':'');
/* Trilha de navegação fora do cabeçalho, logo abaixo da linha divisória. */
const routes={
 '/x/escola/':[['Ferramentas','/x/'],['Escola']],
 '/x/biblioteca/':[['Ferramentas','/x/'],['Escola','/x/escola/'],['Biblioteca']],
 '/x/biblioteca/fichario/':[['Ferramentas','/x/'],['Escola','/x/escola/'],['Biblioteca','/x/biblioteca/'],['Fichário']],
 '/x/universo/obras/lab.html':[['Ferramentas','/x/'],['Universo'],['Obras']],
 '/x/identidade/lab.html':[['Ferramentas','/x/'],['Minha conta']],
 '/x/compartilhar-usuarios/lab.html':[['Ferramentas','/x/'],['Listas compartilhadas']],
 '/x/contribuir.html':[['Ferramentas','/x/'],['Contribuir']]
};
let breadcrumb=null;
function setPath(parts){
 if(!breadcrumb)return;
 breadcrumb.innerHTML=parts.map((part,i)=>{
  const name=escape(part[0]),url=part[1];
  return (i?'<span class="tx-path-separator" aria-hidden="true">›</span>':'')+
   (url?'<a href="'+escape(url)+'"'+(main&&i===0?' data-action="home"':'')+'>'+name+'</a>':'<span class="tx-path-current" aria-current="page">'+name+'</span>');
 }).join('');
}
if(holder.insertAdjacentHTML){
 holder.insertAdjacentHTML('afterend','<nav class="tx-breadcrumb" aria-label="Você está em"></nav>');
 breadcrumb=holder.nextElementSibling;
 if(main)setPath([['Ferramentas']]);
 else {
  const route=root.location?.pathname||'';
  setPath(routes[route]||[['Ferramentas','/x/'],[holder.dataset.pageLabel||'Módulo']]);
 }
}
const label=holder.querySelector('#txProfileName');
let sequence=0,currentUser=null;
const cacheKey=id=>'tereon-x-profile-label-'+id;
function validName(value){return typeof value==='string'?value.trim().replace(/\s+/g,' ').slice(0,120):'';}
function setDisplayName(userId,value){
 if(!userId||userId!==currentUser)return;
 const name=validName(value);
 if(label)label.textContent=name||'Registrado';
 if(name)try{root.localStorage?.setItem(cacheKey(userId),name)}catch(error){}
}
function setIdentity(user,client){
 const token=++sequence;
 currentUser=user?.id||null;
 if(!currentUser){if(label)label.textContent='Visitante';return;}
 let cached='';
 try{cached=validName(root.localStorage?.getItem(cacheKey(currentUser)))}catch(error){}
 if(label)label.textContent=cached||'Registrado';
 if(!client)return;
 Promise.resolve().then(async()=>{
  const response=await client.from('x_profiles').select('display_name').eq('user_id',user.id).maybeSingle();
  if(response.error||token!==sequence)return;
  setDisplayName(user.id,response.data?.display_name||'');
 }).catch(()=>{/* Perfil inacessível: manter nome salvo ou Registrado. */});
}
root.TereonXHeader=Object.freeze({setIdentity,setDisplayName,setPath});

})(typeof window!=='undefined'?window:globalThis);
