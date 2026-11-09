/* Regressão: navegação abaixo do cabeçalho, link para Home e caminho dinâmico. */
'use strict';
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../components/header.js'),'utf8');
const render=pathname=>{
 const breadcrumb={innerHTML:''};
 const profile={textContent:''};
 const header={
  dataset:{txHeader:pathname==='/x/'?'main':'module',backHref:'/x/'},
  classList:{add(){}},
  innerHTML:'',
  nextElementSibling:breadcrumb,
  insertAdjacentHTML(position,html){assert.equal(position,'afterend');assert.ok(html.includes('tx-breadcrumb'))},
  querySelector(selector){return selector==='#txProfileName'?profile:null}
 };
 const root={
  location:{pathname},
  localStorage:{getItem(){return null},setItem(){}},
  document:{querySelector(selector){return selector==='[data-tx-header]'?header:null}}
 };
 new vm.Script(source,{filename:'header.js'}).runInNewContext({window:root,globalThis:root});
 return {root,header,breadcrumb};
};
let page=render('/x/');
assert.ok(page.header.innerHTML.includes('data-action="home"'),'marca continua levando ao Início');
assert.ok(page.breadcrumb.innerHTML.includes('aria-current="page">Ferramentas'));
page.root.TereonXHeader.setPath([['Ferramentas','/x/'],['Listas de materiais']]);
assert.ok(page.breadcrumb.innerHTML.includes('data-action="home"'),'Ferramentas é clicável dentro das Listas');
assert.ok(page.breadcrumb.innerHTML.includes('Listas de materiais'));
page=render('/x/biblioteca/fichario/');
assert.ok(page.breadcrumb.innerHTML.includes('href="/x/"'),'módulos têm retorno ao Início');
assert.ok(page.breadcrumb.innerHTML.includes('href="/x/escola/"'),'caminho inclui Escola');
assert.ok(page.breadcrumb.innerHTML.includes('href="/x/biblioteca/"'),'caminho inclui Biblioteca');
assert.ok(page.breadcrumb.innerHTML.includes('Fichário'));
console.log('TEREON X: caminho de navegação abaixo do cabeçalho e retorno à Home OK');
