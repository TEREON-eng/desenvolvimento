/* TEREON X: indicador independente de rede e identidade.
 * navigator.onLine informa conectividade do dispositivo, nao confirma servidor.
 */
(function(root){
'use strict';
const doc=root.document;
const connection=doc?.getElementById('xConnection');
const account=doc?.getElementById('xAccount');
let identity='checking',sessionUnverified=false;
const names={checking:'Verificando conta',visitor:'Visitante',registered:'Registrado',unavailable:'Conta indisponível'};
function render(){
 const online=root.navigator?.onLine!==false;
 if(connection){connection.textContent=online?'Online':'Offline';connection.dataset.state=online?'online':'offline';connection.title=online?'Dispositivo conectado à rede (servidor não verificado)':'Sem conexão de rede';}
 if(account){
  account.textContent=(names[identity]||names.checking)+(identity==='registered'&&sessionUnverified?' · sessão offline':'');
  account.dataset.state=identity;
  account.title=identity==='registered'&&sessionUnverified?'Sessão armazenada neste aparelho; validação remota pendente':identity==='unavailable'?'Não foi possível validar a conta. O aplicativo pode oferecer modo local, sem sincronização.':'Situação da conta';
 }
}
function setAccount(state,options){
 identity=Object.prototype.hasOwnProperty.call(names,state)?state:'unavailable';
 sessionUnverified=!!options?.unverified;
 render();
}
root.addEventListener?.('online',render);
root.addEventListener?.('offline',render);
root.addEventListener?.('pageshow',render);
root.TereonXStatus=Object.freeze({setAccount,refresh:render});
render();
})(typeof window!=='undefined'?window:globalThis);
