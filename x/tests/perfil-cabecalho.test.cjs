/* TEREON X — nome do perfil não exige reconstruir tela nem login. */
'use strict';
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'../..',p),'utf8');
const label={textContent:''},holder={dataset:{txHeader:'main'},classList:{add(){}},innerHTML:'',querySelector:selector=>selector==='#txProfileName'?label:null};
const stored=new Map(),root={
 document:{querySelector:selector=>selector==='[data-tx-header]'?holder:null},
 localStorage:{getItem:key=>stored.get(key)||null,setItem:(key,value)=>stored.set(key,value)}
};
const context=vm.createContext({window:root,globalThis:root,Promise,console});
new vm.Script(read('x/components/header.js')).runInContext(context);
assert.ok(holder.innerHTML.includes('id="txProfileName"')&&holder.innerHTML.includes('href="/x/identidade/lab.html"'));
root.TereonXHeader.setIdentity(null,null);assert.equal(label.textContent,'Visitante');
const user={id:'test-user'};
root.TereonXHeader.setIdentity(user,null);assert.equal(label.textContent,'Registrado');
root.TereonXHeader.setDisplayName('other-user','Outro');assert.equal(label.textContent,'Registrado','não usar nome de outra conta');
root.TereonXHeader.setDisplayName(user.id,' Ana Silva ');assert.equal(label.textContent,'Ana Silva');
root.TereonXHeader.setIdentity(user,null);assert.equal(label.textContent,'Ana Silva','nome salvo reaparece offline');
const client={from:table=>{
 assert.equal(table,'x_profiles');
 return {select:fields=>{assert.equal(fields,'display_name');return {eq:(key,id)=>({maybeSingle:async()=>({data:{display_name:'José do Teste'},error:null})})}}};
}};
(async()=>{
 root.TereonXHeader.setIdentity(user,client);
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(label.textContent,'José do Teste','nome vem do perfil do usuário');
 root.TereonXHeader.setIdentity(null,null);
 assert.equal(label.textContent,'Visitante','logout redefine nome');
 console.log('TEREON X: visitante, nome persistido e nome registrado no cabeçalho OK');
})().catch(error=>{console.error(error);process.exitCode=1});
