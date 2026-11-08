/* TEREON X · sessão para armazenamento do Motor Único de Listas.
 * A camada de autenticação não manipula listas nem catálogo.
 */
import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.80.0?bundle';
const client=createClient('https://kjikzdpqejhsgutakigw.supabase.co','sb_publishable_sDnGg8LHSitHRRBEgtny4A_zmFvpcx1');
let active='initial',revision=0;
async function resolveSession(){
 const current=++revision;
 try{
  const result=await client.auth.getUser();
  if(current!==revision)return;
  if(result.error)throw result.error;
  const uid=result.data?.user?.id||null;
  if(uid===active)return;
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
client.auth.onAuthStateChange(event=>{
 if(event==='INITIAL_SESSION')return;
 queueMicrotask(()=>{resolveSession().catch(e=>console.warn('TEREON X: autenticação',e))});
});
window.addEventListener('online',()=>{resolveSession().catch(()=>{})});
window.addEventListener('pageshow',()=>{resolveSession().catch(()=>{})});
resolveSession().catch(e=>console.warn('TEREON X: sessão',e));
