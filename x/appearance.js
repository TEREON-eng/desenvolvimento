/* TEREON X — preferência visual isolada. Nenhum vínculo com serviços ou dados. */
(function(root){
'use strict';
const KEY='tereon-x-appearance-v1';
const THEMES=['light','dark','tereon'];
let theme='light';
try{
 const saved=root.localStorage?.getItem(KEY);
 if(THEMES.includes(saved))theme=saved;
}catch(error){/* Preferência opcional; nunca bloquear aplicação. */}
function apply(value,save){
 if(!THEMES.includes(value))return;
 theme=value;
 const home=root.document?.getElementById('homeScreen');
 if(home)home.dataset.appearance=value;
 root.document?.querySelectorAll('[data-appearance-choice]').forEach(button=>{
  const active=button.dataset.appearanceChoice===value;
  button.setAttribute('aria-pressed',String(active));
 });
 if(save){try{root.localStorage?.setItem(KEY,value)}catch(error){/* Sem armazenamento: uso temporário. */}}
}
function choose(event){
 const selected=event.target?.closest?.('[data-appearance-choice]');
 if(!selected)return;
 apply(selected.dataset.appearanceChoice,true);
}
root.document?.addEventListener('click',choose);
apply(theme,false);
root.TereonXAppearance=Object.freeze({get:()=>theme,set:value=>apply(value,true)});
})(typeof window!=='undefined'?window:globalThis);
