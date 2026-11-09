/* Status informativo em módulos independentes; não concede acesso.
 * Importação assíncrona nunca impede navegação.
 */
const status=window.TereonXStatus;
if(status){
 let cachedUser=null;
 try{
  const cached=JSON.parse(localStorage.getItem('sb-kjikzdpqejhsgutakigw-auth-token')||'null');
  cachedUser=cached?.user?.id?cached.user:null;
 }catch(error){/* Cache não legível. */}
 if(cachedUser){status.setAccount('registered',{unverified:true});window.TereonXHeader?.setIdentity(cachedUser,null);}
 try{
  const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2.80.0?bundle');
  const client=createClient('https://kjikzdpqejhsgutakigw.supabase.co','sb_publishable_sDnGg8LHSitHRRBEgtny4A_zmFvpcx1');
  let sequence=0;
  async function refresh(){
   const current=++sequence;
   let localUser=null;
   try{
    const local=await client.auth.getSession();
    localUser=local.data?.session?.user||null;
    if(current!==sequence)return;
    status.setAccount(localUser?'registered':'visitor',{unverified:!!localUser});
    window.TereonXHeader?.setIdentity(localUser,localUser?client:null);
    const remote=await client.auth.getUser();
    if(current!==sequence)return;
    if(remote.error)throw remote.error;
    status.setAccount(remote.data?.user?'registered':'visitor');
    window.TereonXHeader?.setIdentity(remote.data?.user||null,client);
   }catch(error){
    if(current!==sequence)return;
    status.setAccount(localUser?'registered':'unavailable',{unverified:!!localUser});
    if(localUser)window.TereonXHeader?.setIdentity(localUser,null);
   }
  }
  client.auth.onAuthStateChange((event,session)=>{
   if(event==='INITIAL_SESSION')return;
   if(event==='SIGNED_OUT'){status.setAccount('visitor');window.TereonXHeader?.setIdentity(null,null)}
   else if(session?.user){status.setAccount('registered',{unverified:true});window.TereonXHeader?.setIdentity(session.user,null)}
   queueMicrotask(()=>{refresh().catch(()=>{})});
  });
  window.addEventListener('online',()=>{refresh().catch(()=>{})});
  window.addEventListener('pageshow',()=>{refresh().catch(()=>{})});
  await refresh();
 }catch(error){status.setAccount(cachedUser?'registered':'unavailable',{unverified:!!cachedUser})}
}
