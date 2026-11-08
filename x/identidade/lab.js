/* Isolado: somente login/perfil. Não importa listas, shell ou catálogo. */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.80.0?bundle';
const client = createClient('https://kjikzdpqejhsgutakigw.supabase.co', 'sb_publishable_sDnGg8LHSitHRRBEgtny4A_zmFvpcx1');
const auth = globalThis.TereonXIdentity.create(client);
const $ = id => document.getElementById(id);
const authPanel = document.querySelector('.panel[aria-labelledby="auth-title"]');
const signedPanel = $('signed');
const tabs = [...document.querySelectorAll('[data-mode]')];
let mode = 'login', user = null, recovering = false, busy = false;
const redirectTo = new URL('./lab.html', location.href).href;
function notice(message, error=false){$('message').textContent=message;$('message').classList.toggle('error',error)}
function displayMode(next){
  mode=next;
  tabs.forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));
  const titles={login:'Entrar no TEREON X',register:'Criar conta',reset:'Recuperar senha'};
  $('auth-title').textContent=titles[mode];
  $('password-row').classList.toggle('hidden',mode==='reset');
  $('password').required=mode!=='reset';
  $('password').autocomplete=mode==='register'?'new-password':'current-password';
  $('submit').textContent=mode==='login'?'Entrar':mode==='register'?'Cadastrar':'Enviar e-mail de recuperação';
  notice('');
}
function toggleBusy(value){busy=value;document.querySelectorAll('button').forEach(b=>b.disabled=value)}
function errorMessage(err){
  const text=String(err?.message||'Não foi possível concluir a operação.');
  if (/invalid login credentials/i.test(text)) return 'E-mail ou senha incorretos.';
  if (/email not confirmed/i.test(text)) return 'Confirme seu e-mail antes de entrar.';
  if (/already registered/i.test(text)) return 'Não foi possível criar a conta com estes dados.';
  if (/rate limit|too many requests/i.test(text)) return 'Muitas tentativas. Tente novamente mais tarde.';
  return text;
}
async function refresh(){
  user=await auth.currentUser();
  authPanel.classList.toggle('hidden',!!user);
  signedPanel.classList.toggle('hidden',!user);
  if(!user) { $('recovery-panel').classList.add('hidden');return; }
  $('account').textContent=user.email||'Conta autenticada';
  const profile=await auth.getProfile(user.id);
  $('display-name').value=profile?.display_name||'';
  $('recovery-panel').classList.toggle('hidden',!recovering);
}
tabs.forEach(b=>b.addEventListener('click',()=>{if(!busy)displayMode(b.dataset.mode)}));
$('auth-form').addEventListener('submit',async event=>{
  event.preventDefault();if(busy)return;toggleBusy(true);notice('');
  try{
    const email=$('email').value,password=$('password').value;
    if(mode==='login'){await auth.login(email,password);await refresh();notice('Acesso autorizado.');}
    else if(mode==='register'){const data=await auth.register(email,password,redirectTo);notice(data.session?'Conta criada e autenticada.':'Se permitido, você receberá um e-mail para confirmar a conta.');await refresh();}
    else {await auth.sendReset(email,redirectTo);notice('Se o endereço estiver cadastrado, enviaremos instruções de recuperação.');}
  }catch(err){notice(errorMessage(err),true)}finally{toggleBusy(false)}
});
$('profile-form').addEventListener('submit',async event=>{
 event.preventDefault();if(!user||busy)return;toggleBusy(true);
 try{await auth.saveProfile(user.id,$('display-name').value);notice('Perfil salvo.');}
 catch(err){notice(errorMessage(err),true)}finally{toggleBusy(false)}
});
$('logout').addEventListener('click',async()=>{
 if(busy)return;toggleBusy(true);
 try{await auth.logout();recovering=false;await refresh();notice('Sessão encerrada.')}
 catch(err){notice(errorMessage(err),true)}finally{toggleBusy(false)}
});
$('recovery-form').addEventListener('submit',async event=>{
 event.preventDefault();toggleBusy(true);
 try{await auth.changePassword($('new-password').value);recovering=false;$('recovery-panel').classList.add('hidden');$('new-password').value='';notice('Senha atualizada.')}
 catch(err){notice(errorMessage(err),true)}finally{toggleBusy(false)}
});
auth.onChange(event=>{
 if(event==='PASSWORD_RECOVERY')recovering=true;
 if(event==='SIGNED_OUT'){user=null;recovering=false}
 // Defer chamadas ao cliente para fora do callback de Auth.
 queueMicrotask(()=>{refresh().catch(err=>notice(errorMessage(err),true))});
});
displayMode('login');
notice('Verificando sessão...');
refresh().then(()=>notice('')).catch(err=>{
  authPanel.classList.remove('hidden');
  signedPanel.classList.add('hidden');
  notice(errorMessage(err),true);
});
