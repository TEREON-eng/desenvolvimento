/* Apenas apresenta identidade no cabeçalho das páginas independentes.
 * A leitura do cache é informativa, nunca autoriza acessos ou gravações.
 */
const status=window.TereonXStatus;
if(status){
 let cachedUser=null;
 try{
  const cached=JSON.parse(localStorage.getItem('sb-kjikzdpqejhsgutakigw-auth-token')||'null');
  cachedUser=cached?.user?.id?cached.user:null;
 }catch(error){/* Sem cache legível: identidade desconhecida, não presumir logout. */}
 if(cachedUser)status.setAccount('registered',{unverified:true});
 try{
  const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2.80.0?bundle');
  const client=createClient('https://kjikzdpqejhsgutakigw.supabase.co','sb_publishable_sDnGg8LHSitHRRBEgtny4A_zmFvpcx1');
  const local=await client.auth.getSession();
  const saved=local.data?.session?.user;
  status.setAccount(saved?'registered':'visitor',{unverified:!!saved});
  try{
   const remote=await client.auth.getUser();
   if(remote.error)throw remote.error;
   status.setAccount(remote.data?.user?'registered':'visitor');
  }catch(error){
   status.setAccount(saved?'registered':'unavailable',{unverified:!!saved});
  }
 }catch(error){status.setAccount(cachedUser?'registered':'unavailable',{unverified:!!cachedUser})}
}
