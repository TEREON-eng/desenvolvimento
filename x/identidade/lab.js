/* Isolado: somente login/perfil. Não importa listas, shell ou catálogo. */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.80.0?bundle';
const client = createClient('https://kjikzdpqejhsgutakigw.supabase.co', 'sb_publishable_sDnGg8LHSitHRRBEgtny4A_zmFvpcx1');
const auth = globalThis.TereonXIdentity.create(client);
const $ = id => document.getElementById(id);
const authPanel = document.querySelector('.panel[aria-labelledby="auth-title"]');
const signedPanel = $('signed');
const tabs = [...document.querySelectorAll('[data-mode]')];
let mode = 'login', user = null, recovering = false, busy = false;
const initialQuery = new URLSearchParams(location.search);
const initialHash = new URLSearchParams(location.hash.replace(/^#/, ''));
const returningFromReset = initialQuery.get('type') === 'recovery' || initialHash.get('type') === 'recovery';
const linkError = initialQuery.get('error_description') || initialHash.get('error_description');
if (returningFromReset) recovering = true;
const shortDate = value => value ? new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(value)) : 'Não informado';

const redirectTo = new URL('./lab.html', location.href).href;
const RESET_COOLDOWN_MS = 60 * 1000;
const RESET_KEY = 'tereon-x-password-reset-last-request';
function remainingResetSeconds() {
  try {
    const last = Number(localStorage.getItem(RESET_KEY) || 0);
    return Math.max(0, Math.ceil((last + RESET_COOLDOWN_MS - Date.now()) / 1000));
  } catch (_) { return 0; }
}
function markResetRequest() {
  try { localStorage.setItem(RESET_KEY, String(Date.now())); } catch (_) {}
}

function notice(message, error=false){$('message').textContent=message;$('message').classList.toggle('error',error)}
function renderRecovery(){
  $('recovery-panel').classList.toggle('hidden', !(user && recovering));
  $('recovery-title').textContent = 'Definir nova senha';
  $('recovery-hint').textContent = 'Escolha uma senha com pelo menos 8 caracteres.';
}
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
  if (/rate limit|too many requests|over_email_send_rate_limit|email rate limit/i.test(text)) return 'Limite de envio de e-mails atingido. O Supabase gratuito permite poucos e-mails por hora; aguarde a liberação antes de tentar novamente.';
  return text;
}
async function refresh(){
  user=await auth.currentUser();
  authPanel.classList.toggle('hidden',!!user);
  signedPanel.classList.toggle('hidden',!user);
  if(!user) { $('recovery-panel').classList.add('hidden');return; }
  $('account').textContent=user.email||'Conta autenticada';
  $('confirmed').textContent=user.email_confirmed_at?'Confirmado':'Pendente';
  $('created').textContent=shortDate(user.created_at);
  $('last-access').textContent=shortDate(user.last_sign_in_at);
  const profile=await auth.getProfile(user.id);
  const name=profile?.display_name||'Profissional TEREON';
  $('profile-title').textContent=name;
  window.TereonXHeader?.setDisplayName(user.id,profile?.display_name||'');
  $('avatar').textContent=(name==='Profissional TEREON'?'TX':name.split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase());
  $('display-name').value=profile?.display_name||'';
  renderRecovery();
}
tabs.forEach(b=>b.addEventListener('click',()=>{if(!busy)displayMode(b.dataset.mode)}));
$('auth-form').addEventListener('submit',async event=>{
  event.preventDefault();if(busy)return;toggleBusy(true);notice('');
  try{
    const email=$('email').value,password=$('password').value;
    if(mode==='login'){await auth.login(email,password);await refresh();notice('Acesso autorizado.');}
    else if(mode==='register'){const data=await auth.register(email,password,redirectTo);notice(data.session?'Conta criada e autenticada.':'Se permitido, você receberá um e-mail para confirmar a conta.');await refresh();}
    else {
      const seconds = remainingResetSeconds();
      if (seconds) { notice('Você já solicitou um e-mail recentemente. Aguarde '+seconds+' segundos antes de tentar novamente.',true); return; }
      await auth.sendReset(email,redirectTo);
      markResetRequest();
      notice('Se o endereço estiver cadastrado e houver disponibilidade de envio, você receberá instruções. Evite solicitar vários e-mails em sequência.');
    }
  }catch(err){notice(errorMessage(err),true)}finally{toggleBusy(false)}
});
$('profile-form').addEventListener('submit',async event=>{
 event.preventDefault();if(!user||busy)return;toggleBusy(true);
 try{await auth.saveProfile(user.id,$('display-name').value);await refresh();notice('Perfil salvo.');}
 catch(err){notice(errorMessage(err),true)}finally{toggleBusy(false)}
});
$('change-password').addEventListener('click',()=>{
 if(!user)return;
 recovering=true;
 renderRecovery();
 $('new-password').focus();
 notice('Digite sua nova senha no campo abaixo.');
});
$('logout').addEventListener('click',async()=>{
 if(busy)return;toggleBusy(true);
 try{await auth.logout();recovering=false;await refresh();notice('Sessão encerrada.')}
 catch(err){notice(errorMessage(err),true)}finally{toggleBusy(false)}
});
$('recovery-form').addEventListener('submit',async event=>{
 event.preventDefault();toggleBusy(true);
 try{await auth.changePassword($('new-password').value);recovering=false;renderRecovery();$('new-password').value='';notice('Senha atualizada. Você já pode utilizar a nova senha ao entrar novamente.')}
 catch(err){notice(errorMessage(err),true)}finally{toggleBusy(false)}
});
auth.onChange(event=>{
 if(event==='PASSWORD_RECOVERY')recovering=true;
 if(event==='SIGNED_OUT'){user=null;recovering=false}
 // Defer chamadas ao cliente para fora do callback de Auth.
 queueMicrotask(()=>{refresh().then(()=>{
   if(event==='PASSWORD_RECOVERY') notice('Link confirmado. Defina sua nova senha.');
 }).catch(err=>notice(errorMessage(err),true))});
});
displayMode('login');
notice('Verificando sessão...');
refresh().then(()=>{
 if(linkError) notice('Não foi possível validar o link de recuperação. Ele pode ter expirado ou já ter sido usado. Solicite outro e-mail.',true);
 else if(returningFromReset && user) notice('Link recebido. Defina sua nova senha abaixo.');
 else if(returningFromReset && !user) notice('Não foi possível ativar a recuperação. Solicite um novo link de redefinição de senha.',true);
 else notice('');
}).catch(err=>{
  authPanel.classList.remove('hidden');
  signedPanel.classList.add('hidden');
  notice(errorMessage(err),true);
});
