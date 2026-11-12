/* Regressão: alternância entre agrupamento por insumo e por etapa. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../listas/app.js'),'utf8');
const marker="document.addEventListener('click',function(e){";
const start=src.indexOf(marker);
const router=src.indexOf("var a=e.target.closest('[data-action]');if(a){",start);
assert.ok(start>=0&&router>start,'delegação da lista presente');
const prefix=src.slice(start+marker.length,router);
assert.ok(prefix.includes("e.target.closest('[data-list-view]')"),'alternador tratado antes do roteador de ações');
const run=new Function('event','state',`
 let ready=true,page='list',listView=state.view;
 const draw=()=>{state.view=listView;state.renders++;};
 const e=event;
 ${prefix}
`);
function click(value,initial){
 const state={view:initial,renders:0,prevented:false};
 const event={target:{closest(selector){return selector==='[data-list-view]'?{dataset:{listView:value}}:null;}},preventDefault(){state.prevented=true;}};
 run(event,state);return state;
}
assert.deepEqual(click('etapa','insumo'),{view:'etapa',renders:1,prevented:true});
assert.deepEqual(click('insumo','etapa'),{view:'insumo',renders:1,prevented:true});
assert.match(src,/data-list-view="etapa"/);
assert.match(src,/data-list-view="insumo"/);
assert.match(src,/else if\(listView==='etapa'\)/);
console.log('Agrupamento visual: troca entre por insumo e por etapa OK');
