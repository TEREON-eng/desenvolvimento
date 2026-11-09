/* TEREON X — barreiras de estabilidade da revisão de 09/11/2026.
 * Verificação estática de invariantes (NÃO substitui uso no celular/servidor).
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.resolve(__dirname,'../..',p),'utf8');
const html=read('x/index.html'),ui=read('x/listas/app.js'),
 service=read('x/listas/servico.js'),integration=read('x/listas/integracao.js'),
 cloud=read('x/listas/nuvem/motor.js'),appearance=read('x/appearance.css'),
 header=read('x/components/header.js'),sw=read('x/sw.js'),pwa=read('x/pwa.js');
const fixture=read('x/tests/fixtures/modal-adicionar-aprovado-x034.html');
const start=html.indexOf('<dialog id="addDialog"');
assert.ok(start>=0,'modal aprovado existe');
assert.equal(html.slice(start,html.indexOf('</dialog>',start)+9),fixture,'estrutura do modal congelada');
assert.ok(ui.includes("if(a.dataset.action==='add')openAdd()"),'botão Adicionar usa modal aprovado');
assert.ok(ui.includes('pickFirstMissing()')&&ui.includes('cleanHiddenValues()'),'tags retornam à pendência e respeitam condicionais');
assert.ok(!/document\.|localStorage|TereonXCatalog|supabase/.test(service),'motor de listas sem dependências externas');
assert.ok(/duplicateList/.test(service)&&/renameList/.test(service),'duplicação e edição de nome preservadas');
assert.ok(service.includes('copy.recordUid=recordUid')&&service.includes('delete copy.cloudVersion'),'duplicação cria ID remoto próprio sem herdar versão');
assert.ok(ui.includes('data-select-list')&&ui.includes('data-rename-list')&&ui.includes('data-duplicate-list')&&ui.includes('data-share-list')&&ui.includes('data-delete-list'),'ações e seleção em cada cartão');
assert.ok(ui.includes('class="list-card-actions"')&&ui.includes('class="list-action-row"'),'seleção acima da linha de botões');
assert.ok(read('x/styles.css').includes('.list-entry .list-card-actions>.list-select-one{position:static'),'checkbox alinhado ao título');
assert.ok(ui.includes("countSelected!==1?")&&ui.includes('data-action="share-selected"'),'compartilhar seleção só com uma lista');
assert.ok(!ui.includes('data-action="approve-selected"'),'não inventar aprovação em lote');
assert.ok(ui.includes('listStorageBadge')&&!ui.includes('html=syncBanner()+html'),'sincronização por lista, não banner global');
assert.ok(integration.includes('cloudPending')&&integration.includes('cloudConflict')&&integration.includes('cloudVersion'),'pendências e conflitos preservados');
assert.ok(cloud.includes(".eq('owner_id',uid).eq('version',version)"),'exclusão remota restrita a proprietário e versão');
assert.ok(read('x/listas/store.js').includes("const KEY='tereon-x-lab-v1'"),'armazenamento histórico preservado');
assert.ok(header.includes('tx-breadcrumb')&&header.includes('txProfileName')&&header.includes('txNetwork'),'navegação e identidade compartilhadas');
for(const t of ['light','dark','tereon'])assert.ok(appearance.includes('data-tx-appearance="'+t+'"'),'tema '+t+' configurado');
assert.ok(read('x/identidade/lab.html').includes('data-appearance-choice="tereon"'),'temas em Minha conta');
const version=JSON.parse(read('x/version.json')).version;
assert.equal(pwa.match(/const VERSION='([^']+)'/)?.[1],version,'PWA e version.json alinhados');
assert.ok(sw.includes("tereon-x-lab-"+version.replace(/^x\./,'')),'nome do cache segue versão');
assert.ok(html.includes('id="homeScreen"')&&html.includes('id="listsScreen"'),'navegação principal presente');
console.log('TEREON X: invariantes da revisão 09/11 verificados estaticamente — '+version);
