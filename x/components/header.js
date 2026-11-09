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
holder.innerHTML='<div class="tx-header-row"><div class="tx-brand"><span class="tx-brand-name">TEREON X</span><span class="tx-brand-sub">Tecnologia que faz a engenharia fluir.</span></div>'+
 '<div class="tx-header-right"><a class="tx-account-link" href="/x/identidade/lab.html" aria-label="Minha conta">◉ Minha conta</a>'+
 '<span id="xStatus" class="tx-badges" role="status" aria-live="polite" aria-label="Conexão e situação da conta"><span id="xConnection" class="tx-status-part">Verificando rede</span><span id="xAccount" class="tx-status-part">Verificando conta</span></span></div></div>'+
 '<nav class="tx-nav" aria-label="Navegação">'+(main?'<button id="homeNavButton" class="tx-back-link" data-action="home" type="button" hidden>← Início</button>':'<a class="tx-back-link" href="'+escape(back)+'">'+escape(backLabel)+'</a>')+
 (main?'<button id="installButton" type="button" hidden>↓ Instalar</button>':'')+'</nav>';
})(typeof window!=='undefined'?window:globalThis);
