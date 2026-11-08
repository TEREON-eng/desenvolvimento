/* TEREON X — motor de identidade isolado; sem browser e sem rede. */
'use strict';
const assert=require('node:assert/strict');
const identity=require('../identidade/auth.js');
const fs=require('node:fs');
const html=fs.readFileSync(require('node:path').join(__dirname,'../identidade/lab.html'),'utf8');
const script=fs.readFileSync(require('node:path').join(__dirname,'../identidade/lab.js'),'utf8');
for(const id of ['account','confirmed','created','last-access','profile-title','avatar','change-password','recovery-panel','recovery-form','recovery-title'])assert.ok(html.includes('id="'+id+'"'),'controle ausente: '+id);
assert.ok(script.includes("event==='PASSWORD_RECOVERY'"),'evento de recuperação deve ser observado');
assert.ok(html.includes('class="panel hidden" aria-labelledby="auth-title"'),'não mostrar login antes de consultar sessão');
const calls=[];
let current={id:'user-1',email:'profissional@example.com'};
const client={
  auth:{
    signUp:async opts=>{calls.push(['signUp',opts]);return {data:{user:current,session:null},error:null}},
    signInWithPassword:async opts=>{calls.push(['login',opts]);return {data:{user:current},error:null}},
    signOut:async()=>{calls.push(['logout']);return {data:{},error:null}},
    getSession:async()=>({data:{session:{user:current}},error:null}),
    getUser:async()=>({data:{user:current},error:null}),
    resetPasswordForEmail:async(email,opts)=>{calls.push(['reset',email,opts]);return {data:{},error:null}},
    updateUser:async info=>{calls.push(['update',info]);return {data:{user:current},error:null}},
    onAuthStateChange:cb=>({data:{subscription:{unsubscribe(){calls.push(['unsubscribe'])}}}})
  },
  from(table){
    assert.equal(table,'x_profiles');
    const ctx={select(value){calls.push(['select',value]);return ctx},
      eq(column,value){assert.equal(column,'user_id');assert.equal(value,current.id);return ctx},
      maybeSingle:async()=>({data:null,error:null}),
      upsert(value,opts){calls.push(['upsert',value,opts]);return ctx},
      single:async()=>({data:{user_id:current.id,display_name:'Eletricista'},error:null})};
    return ctx;
  }
};
(async()=>{
 const service=identity.create(client);
 assert.equal('document' in service,false);
 await assert.rejects(service.login('não é email','senha'),/e-mail válido/);
 await assert.rejects(service.register('a@b.com','123','https://example.org'),/8 caracteres/);
 await assert.rejects(service.changePassword('curta'),/8 caracteres/);
 await assert.rejects(service.saveProfile('', 'x'),/Sessão necessária/);
 await service.register(' USER@example.com ','12345678','https://tereon.exemplo/lab.html');
 assert.equal(calls.find(c=>c[0]==='signUp')[1].email,'user@example.com');
 await service.login('USER@example.com','12345678');
 assert.equal(calls.find(c=>c[0]==='login')[1].email,'user@example.com');
 assert.equal((await service.session()).user.id,current.id);
 assert.equal((await service.currentUser()).id,current.id);
 const noSession=identity.create({auth:{getSession:async()=>({data:{session:null},error:null}),getUser:async()=>{throw Error('getUser não pode ser chamado sem sessão')}}});
 assert.equal(await noSession.currentUser(),null,'sem sessão deve mostrar login normalmente');
 assert.equal(await service.getProfile(current.id),null);
 const profile=await service.saveProfile(current.id,' Eletricista ');
 assert.equal(profile.display_name,'Eletricista');
 assert.equal(calls.find(c=>c[0]==='upsert')[1].display_name,'Eletricista');
 await service.sendReset('USER@example.com','https://tereon.exemplo/lab.html');
 await service.changePassword('nova-senha-123');
 const stop=service.onChange(()=>{});
 stop();assert.ok(calls.some(c=>c[0]==='unsubscribe'));
 await service.logout();
 const broken=identity.create({auth:{signInWithPassword:async()=>({error:new Error('Credenciais inválidas')})}});
 await assert.rejects(broken.login('a@b.com','12345678'),/Credenciais inválidas/);
 console.log('TEREON X: autenticação isolada e contratos básicos OK');
})().catch(err=>{console.error(err);process.exitCode=1});
