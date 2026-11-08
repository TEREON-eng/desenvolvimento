/* TEREON X · sessão para armazenamento do Motor Único de Listas.
 * A camada de autenticação não manipula listas nem catálogo.
 */
let client;
try{
 const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2.80.0?bundle');
 client=createClient('https://kjikzdpqejhsgutakigw.supabase.co','sb_publishable_sDnGg8LHSitHRRBEgtny4A_zmFvpcx1');
}catch(error){
 console.warn('TEREON X: autenticação indisponível; modo local ativo',error);
 window.TereonXAppActivateAccount(null,null);
}
let active='initial',revision=0;
async function resolveSession(){
 const current=++revision;
 try{
  const result=await client.auth.getUser();
  if(current!==revision)return;
  if(result.error)throw result.error;
  const uid=result.data?.user?.id||null;
  if(uid===active){if(uid)window.TereonXAppRefreshCloud?.()?.catch(e=>console.warn('TEREON X: atualização da nuvem',e));return;}
  active=uid;
  await window.TereonXAppActivateAccount(uid,uid?window.TereonXCloudLists.create(client):null);
 }catch(error){
  // Falha de internet: perfil conhecido no aparelho pode usar seu cache.
  const session=await client.auth.getSession().catch(()=>({data:{session:null}}));
  if(current!==revision)return;
  const user= session.data?.session?.user;
  const uid=user?.id||null;
  if(uid===active)return;
  active=uid;
  console.warn('TEREON X: sessão sem validação remota; sincronização aguardará rede',error);
  await window.TereonXAppActivateAccount(uid,uid?window.TereonXCloudLists.create(client):null);
 }
}
if(client)client.auth.onAuthStateChange(event=>{
 if(event==='INITIAL_SESSION')return;
 queueMicrotask(()=>{resolveSession().catch(e=>console.warn('TEREON X: autenticação',e))});
});
if(client)window.addEventListener('online',()=>{resolveSession().catch(()=>{})});
if(client)window.addEventListener('pageshow',()=>{resolveSession().catch(()=>{})});
if(client)resolveSession().catch(e=>{console.warn('TEREON X: sessão',e);window.TereonXAppActivateAccount(null,null)});
