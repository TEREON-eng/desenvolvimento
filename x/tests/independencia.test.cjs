/* TEREON X — barreiras mínimas de independência e não regressão.
 * Não substitui browser/E2E, prova isolamento de responsabilidades no código.
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const shell=read('x/index.html');
const service=read('x/listas/servico.js');
const storage=read('x/listas/store.js');
const catalog=read('x/catalogo/motor.js');
const relations=read('x/relacoes/origem-listas.js');
const integration=read('x/listas/integracao.js');
const ui=read('x/listas/app.js');
const css=read('x/styles.css');
const auth=read('x/listas/auth.js');
const sw=read('x/sw.js');
const addFixture=read('x/tests/fixtures/modal-adicionar-aprovado-x034.html');
const start=shell.indexOf('<dialog id="addDialog"');
assert.ok(start>=0,'modal técnico deve existir');
assert.equal(shell.slice(start,shell.indexOf('</dialog>',start)+9),addFixture,
 'navegação ou teclado não podem modificar o modal técnico aprovado');
assert.ok(!/document\.|localStorage|TereonXCatalog|supabase|x_works|x_workspaces/.test(service),
 'Motor de Listas não depende de UI, Catálogo ou Obras');
assert.ok(!/document\.|TereonXCatalog|supabase|x_works|x_workspaces/.test(storage),
 'Store de Listas não depende de módulos vizinhos');
assert.ok(!/document\.|localStorage|x_cloud_lists|x_works|x_workspaces/.test(catalog),
 'Catálogo não possui DOM, armazenamento de Listas ou Obras');
assert.ok(!/document\.|localStorage|supabase/.test(relations),
 'adaptador de relações não pode acoplar DOM ou nuvem');
assert.ok(!/document\.|TereonXCatalog|x_works|x_workspaces/.test(integration),
 'sincronização de Listas não deve depender de telas, Catálogo nem Obras');
assert.ok(ui.includes('window.TereonXLists.create(')&&ui.includes('window.TereonXCatalog.load()'),
 'UI compõe motores, não redefine suas responsabilidades');
assert.ok(shell.includes('id="homeScreen"')&&shell.includes('id="listsScreen"'),
 'Início independente de tela de Listas');
assert.ok(shell.includes('data-action="create"')&&ui.includes("$('createDialog').showModal()"),
 'criação de lista abre modal sem outra página');
assert.ok(css.includes('#createDialog[open]')&&css.includes('inset:max(12px, env(safe-area-inset-top))'),
 'Criar lista fica alto no celular, distante do teclado virtual');
assert.ok(css.includes('#addDialog.is-choosing')&&css.includes('.tag-tray{'),
 'refino visual de fichas e tags aprovado permanece');
assert.ok(auth.includes('getUser()')&&auth.includes('TereonXAppActivateAccount'),
 'conta é resolvida por módulo de sessão');
assert.ok(integration.includes('cloudConflict')&&integration.includes('cloudVersion'),
 'sincronização preserva estado de versão e conflito');
assert.ok(sw.includes("const START='/x/'"),'PWA inicia em /x/');
assert.ok(read('x/escola/index.html').includes('href="/x/biblioteca/"'));
assert.ok(read('x/biblioteca/index.html').includes('href="/x/biblioteca/fichario/"'));
assert.ok(read('x/biblioteca/fichario/index.html').includes('TereonXCatalog.load()'));
console.log('TEREON X: fronteiras de módulos, modal aprovado e teclado protegidos');
