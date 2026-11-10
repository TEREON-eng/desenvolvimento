/* TEREON X · instalação e atualização PWA independentes da UI de listas. */
(function(){
 'use strict';
 const VERSION='x.0.3.30';
 let installPrompt=null;
 let refreshPending=false;
 const button=document.getElementById('installButton');
 const instructionDialog=document.getElementById('installDialog');
 const instructions=document.getElementById('installInstructions');
 const standalone=()=>window.matchMedia('(display-mode: standalone)').matches||window.matchMedia('(display-mode: fullscreen)').matches||navigator.standalone===true;
 const iosSafari=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)&&/Safari/.test(navigator.userAgent)&&!/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);
 function updateInstallVisibility(){button.hidden=standalone()||(!installPrompt&&!iosSafari());}
 const hasActiveDialog=()=>Array.from(document.querySelectorAll('dialog')).some(d=>d.open);
 function maybeRefresh(){
  if(!refreshPending)return;
  if(hasActiveDialog())return;
  refreshPending=false;
  location.reload();
 }
 async function checkUpdates(){
  if(!navigator.onLine)return;
  try{
   const response=await fetch('/x/version.json?_='+Date.now(),{cache:'no-store'});
   if(!response.ok)return;
   const v=await response.json();
   if(typeof v.version==='string'&&v.version!==VERSION){
    refreshPending=true;
    maybeRefresh();
   }
  }catch(e){/* Sem rede: mantém o último protótipo funcional. */}
 }
 async function register(){
  if(!('serviceWorker' in navigator)||!window.isSecureContext)return;
  try{
   const registration=await navigator.serviceWorker.register('/x/sw.js',{scope:'/x/',updateViaCache:'none'});
   await registration.update();
  }catch(e){console.warn('TEREON X: instalação offline não disponível',e);}
 }
 window.addEventListener('beforeinstallprompt',event=>{
  event.preventDefault();installPrompt=event;
  updateInstallVisibility();
 });
 window.addEventListener('appinstalled',()=>{installPrompt=null;updateInstallVisibility();});
 window.matchMedia('(display-mode: standalone)').addEventListener?.('change',updateInstallVisibility);
 updateInstallVisibility();
 button.addEventListener('click',async()=>{
  if(standalone()){updateInstallVisibility();return;}
  if(installPrompt){
   const event=installPrompt;installPrompt=null;
   await event.prompt();
   try{await event.userChoice;}catch(e){}
  }else{
   const ios=/iPad|iPhone|iPod/.test(navigator.userAgent);
   instructions.textContent=ios?
    'No Safari, toque em Compartilhar e escolha “Adicionar à Tela de Início”. Abra depois pelo novo ícone.':
    'No Chrome ou Edge, abra o menu ⋮ e escolha “Instalar app” ou “Adicionar à tela inicial”. Se a opção não estiver disponível, atualize a página e verifique se o site está em HTTPS.';
   instructionDialog.showModal();
  }
 });
 document.querySelectorAll('dialog').forEach(d=>d.addEventListener('close',maybeRefresh));
 window.addEventListener('pageshow',()=>{updateInstallVisibility();register();checkUpdates();});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){checkUpdates();maybeRefresh();}});
 window.addEventListener('online',checkUpdates);
})();
