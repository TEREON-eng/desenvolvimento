/* TEREON X — três aparências, uma única navegação e sem alterações funcionais. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const read=p=>fs.readFileSync(path.resolve(__dirname,'../..',p),'utf8');
const html=read('x/index.html');
const home=html.slice(html.indexOf('<section id="homeScreen"'),html.indexOf('<section id="listsScreen"'));
const variants=['light','dark','tereon'];
for(const mode of variants)assert.ok(home.includes('data-appearance-choice="'+mode+'"'),'seletor contém '+mode);
for(const href of ['/x/?view=lists','/x/universo/obras/lab.html','/x/escola/'])assert.ok(home.includes('href="'+href+'"'),'acesso preservado '+href);
const css=read('x/appearance.css');
for(const theme of ['dark','tereon'])assert.ok(css.includes('[data-appearance="'+theme+'"]'));
assert.ok(css.includes('#homeScreen')&&css.includes('prefers-reduced-motion'));
assert.ok(!css.includes('#addDialog')&&!css.includes('#listDialog'),'tema inicial não pode alterar modais aprovados');
const listeners={},memory=new Map(),choices=variants.map(theme=>({dataset:{appearanceChoice:theme},attributes:{},setAttribute(key,value){this.attributes[key]=value}}));
const homeNode={dataset:{}};
const document={
 getElementById:id=>id==='homeScreen'?homeNode:null,
 querySelectorAll:q=>q==='[data-appearance-choice]'?choices:[],
 addEventListener:(type,callback)=>listeners[type]=callback,
};
const localStorage={getItem:key=>memory.get(key)||null,setItem:(key,val)=>memory.set(key,val)};
const root={document,localStorage};vm.createContext({window:root,globalThis:root});
new vm.Script(read('x/appearance.js')).runInContext({window:root,globalThis:root,document,localStorage});
assert.equal(homeNode.dataset.appearance,'light');
root.TereonXAppearance.set('dark');assert.equal(homeNode.dataset.appearance,'dark');
root.TereonXAppearance.set('tereon');assert.equal(memory.get('tereon-x-appearance-v1'),'tereon');
assert.equal(choices[2].attributes['aria-pressed'],'true');
root.TereonXAppearance.set('invalid');assert.equal(homeNode.dataset.appearance,'tereon','entrada desconhecida ignorada');
const frozen=read('x/tests/fixtures/modal-adicionar-aprovado-x034.html');
const i=html.indexOf('<dialog id="addDialog"');
assert.equal(html.slice(i,html.indexOf('</dialog>',i)+9),frozen,'modal técnico permanece byte a byte aprovado');
console.log('TEREON X: aparências independentes, navegação e modal preservados');
