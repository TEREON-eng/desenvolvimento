/* TEREON X — busca em linguagem natural: tags ? e Avançar. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=path.resolve(__dirname,'../..'),src=p=>fs.readFileSync(path.join(base,p),'utf8');
(async()=>{
 const win={};
 const fichas=JSON.parse(src('x/fichario-x/fichas-lab-2026-11-12.json'));
 new Function('window','fetch',src('x/catalogo/motor.js'))(
  win,async()=>({ok:true,json:async()=>fichas}));
 await win.TereonXCatalog.load();
 new Function('window',src('x/catalogo/interpretador-condutores.js'))(win);
 new Function('window',src('x/catalogo/confirmacao-rascunho.js'))(win);
 const result=win.TereonXInterpreter.interpret('fio flex 2,5 preto 450');
 const f=win.TereonXCatalog.get('FT_COND-001');
 assert.equal(result.family,'FT_COND-001');
 assert.equal(result.proposals.length,5);
 const accepted={'DET-001':'Condutor isolado','DET-004':'2,5',
  'DET-008':'Preto','DET-006':'450/750 V'};
 const copy=JSON.stringify(accepted);
 const prepared=win.TereonXIntentDraft.apply(f,result.proposals,accepted,win.TereonXCatalog);
 assert.equal(prepared.ok,true);
 assert.equal(Object.keys(prepared.values).length,4);
 assert.equal(prepared.values['DET-006'],'450/750 V');
 assert.equal(prepared.values['DET-009'],undefined,'classe V não confirmada não é inserida');
 assert.equal(JSON.stringify(accepted),copy,'não alterar rascunho original');
 const notAllowed=win.TereonXIntentDraft.apply(f,[{id:'DET-004',value:'999'}],
  {'DET-004':'999'},win.TereonXCatalog);
 assert.equal(notAllowed.ok,false,'opção inexistente não transporta');
 assert.equal(notAllowed.values['DET-004'],undefined);
 const input=win.TereonXInterpreter.interpret('fio preto dois e meio');
 assert.equal(input.proposals.find(x=>x.id==='DET-004')?.value,'2,5');
 const app=src('x/listas/app.js'),html=src('x/index.html'),css=src('x/styles.css');
 assert.ok(app.includes('data-intent-toggle='),'tags sugeridas clicáveis');
 assert.ok(app.includes('data-intent-advance='),'Avançar no nível da pesquisa');
 assert.ok(app.includes('intentSelected[p.id]===p.value'),'estado de confirmação explícita');
 assert.ok(app.includes('intentSelected={};intentNotice='),'nova pesquisa invalida confirmações antigas');
 assert.ok(app.includes('window.TereonXIntentDraft?.apply('),'transição valida as opções da ficha');
 assert.ok(!app.includes('function draftSuggestionsHTML('),'painel duplicado retirado do card');
 assert.ok(!app.includes('function confirmDraftSuggestion('),'fluxo anterior retirado');
 assert.ok(html.includes('/x/catalogo/confirmacao-rascunho.js?v=1'),'carregamento do rascunho');
 assert.ok(css.includes('X.0.3.61 — composição'),'apresentação compacta existe');
 console.log('Busca inline: cinco propostas, quatro confirmadas, uma não transportada, sem painel duplicado');
})().catch(error=>{console.error(error);process.exitCode=1});
