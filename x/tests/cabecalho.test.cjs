/* Regressão do cabeçalho compartilhado em todas as páginas TEREON X.
 * Não exige rede, não toca banco ou dados de usuário. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const read=p=>fs.readFileSync(path.resolve(__dirname,'../..',p),'utf8');
const pages={
 'x/index.html':'main',
 'x/escola/index.html':'module',
 'x/biblioteca/index.html':'module',
 'x/biblioteca/fichario/index.html':'module',
 'x/universo/obras/lab.html':'module',
 'x/identidade/lab.html':'module',
 'x/compartilhar-usuarios/lab.html':'module',
 'x/contribuir.html':'module'
};
const head=read('x/components/header.js'),style=read('x/components/header.css');
new vm.Script(head,{filename:'header.js'});
new vm.Script(read('x/status.js'),{filename:'status.js'});
assert.ok(head.includes('tx-header-row')&&head.includes('tx-nav'),'navegação separada da área de conta');
assert.ok(head.includes('id="homeNavButton"')&&head.includes('id="installButton"'));
assert.ok(style.includes('.tx-global-header .tx-header-row')&&style.includes('.tx-global-header .tx-nav'));
for(const [page,kind] of Object.entries(pages)){
 const html=read(page);
 assert.ok(html.includes('data-tx-header="'+kind+'"'),'incluir componente de cabeçalho em '+page);
 assert.ok(html.includes('/x/components/header.js?v=3')&&html.includes('/x/components/header.css?v=3'),'mesma versão de cabeçalho em '+page);
 assert.ok(html.includes('/x/appearance.css?v=2'),'tema compartilhado em '+page);
 assert.equal((html.match(/data-tx-header=/g)||[]).length,1,'um único cabeçalho em '+page);
 if(kind==='module'){
  assert.ok(html.includes('data-back-href='),'retorno próprio do módulo em '+page);
  assert.ok(html.includes('/x/status.js')&&html.includes('/x/components/header-session.js?v=4'),'indicadores comuns em '+page);
  assert.ok(html.includes('/x/appearance.js?v=2'),'preferência de aparência aplicada também no módulo '+page);
 }
}
const shell=read('x/index.html');
assert.ok(shell.includes('id="homeScreen"')&&shell.includes('id="listsScreen"'));
assert.ok(!shell.includes('class="account-corner"'),'header antigo foi removido da home');
assert.ok(read('x/listas/app.js').includes("homeNav.hidden=background==='home'"),'botão Início permanece contextual');
const fixture=read('x/tests/fixtures/modal-adicionar-aprovado-x034.html');
const start=shell.indexOf('<dialog id="addDialog"');
assert.equal(shell.slice(start,shell.indexOf('</dialog>',start)+9),fixture,'modal de adicionar foi preservado integralmente');
console.log('TEREON X: cabeçalho compartilhado, navegação independente e modal preservado');
