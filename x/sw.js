/* TEREON X · SW exclusivo do escopo /x/; nunca tocar nos caches do legado. */
'use strict';
const CACHE='tereon-x-lab-0.3.47';
const START='/x/';
const OFFLINE=[START,'/x/laboratorios/','/x/index.html','/x/styles.css','/x/appearance.css','/x/appearance.js','/x/listas/store.js','/x/listas/servico.js','/x/listas/app.js','/x/listas/quantificacao.js','/x/listas/integracao.js','/x/listas/nuvem/motor.js','/x/listas/auth.js','/x/status.js','/x/components/header.css','/x/components/header.js','/x/components/header-session.js','/x/pwa.js','/x/motor-compartilhar.js','/x/manifest.webmanifest','/x/catalogo/motor.js','/x/catalogo/seletor.js','/x/fichario-x/fichas-drive-2026-11-08.json','/x/fichario-x/simulacao-24.json','/x/biblioteca/','/x/biblioteca/fichario/','/x/escola/'];
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  await cache.addAll(OFFLINE.map(u=>new Request(u,{cache:'reload'})));
  await self.skipWaiting();
 })());
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const names=await caches.keys();
  await Promise.all(names.filter(x=>x.startsWith('tereon-x-lab-')&&x!==CACHE).map(x=>caches.delete(x)));
  await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET')return;
 const url=new URL(request.url);
 if(url.origin!==self.location.origin || !url.pathname.startsWith('/x/'))return;
 if(url.pathname.endsWith('/version.json'))return;
 if(request.mode==='navigate'){
  event.respondWith((async()=>{
   try {
    const response=await fetch(new Request(request,{cache:'no-store'}));
    if(response.ok){
     const cache=await caches.open(CACHE);
     if(url.pathname===START||url.pathname==='/x/index.html')await cache.put(START,response.clone());
    }
    return response;
   }catch(e){
    return await caches.match(request,{ignoreSearch:true}) || await caches.match('/x/laboratorios/') || await caches.match(START) || await caches.match('/x/index.html') ||
      new Response('TEREON X temporariamente indisponível.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
   }
  })());
 }else if(/\.(?:js|css|json|webmanifest)$/.test(url.pathname)){
  event.respondWith((async()=>{
   try{return await fetch(request)}
   catch(e){return await caches.match(request,{ignoreSearch:true}) || new Response('Recurso indisponível offline.',{status:503});}
  })());
 }
});
