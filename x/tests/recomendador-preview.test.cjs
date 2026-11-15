/* Laboratório portátil: parser, motor e UI na mesma página, sem alterar Listas. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../laboratorios/recomendador-condutores.html'),'utf8');
const scripts=[...source.matchAll(/<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>({tag:m[0].slice(0,m[0].indexOf('>')+1),content:m[1]}));
assert.equal(scripts.length,6,'ficheiro portátil contém ficha e 5 scripts de motor/UI');
const json=scripts.find(x=>x.tag.includes('type="application/json"'));
const snapshot=JSON.parse(json.content);
assert.equal(snapshot.fichas.length,6);
assert.ok(snapshot.fichas.some(f=>f.codigo==='FT_COND-001'&&f.status==='Em revisão'));
for(const x of scripts.filter(x=>!x.tag.includes('application/json')))new vm.Script(x.content,{filename:'inline-lab.js'});
assert.ok(source.includes('id="search"')&&source.includes('id="expand"')&&source.includes('id="personalize"'));
assert.ok(source.includes('id="detailDialog"')&&source.includes('id="choiceDialog"'));
assert.ok(source.includes("const samples={"),'dados fictícios claramente isolados das listas');
assert.ok(source.includes('Nenhuma lista foi alterada.'),'feedback não promete persistência');
assert.ok(!source.includes('TereonXLists.create('),'laboratório não instancia motor de dados reais');
assert.ok(!source.includes('localStorage.'),'laboratório não acessa dados do usuário');
assert.ok(!source.includes('upsertItem('),'laboratório não altera lançamentos');
console.log('Laboratório portátil de recomendações: scripts válidos, dados fictícios e sem mutação de Listas');

const fields={};
function element(id){
 if(!fields[id])fields[id]={
  id,textContent:'',innerHTML:'',value:'',hidden:false,disabled:false,
  listeners:{},addEventListener(name,cb){this.listeners[name]=cb},
  showModal(){this.open=true},close(){this.open=false},scrollIntoView(){}
 };
 return fields[id];
}
const examples=['fio flex 2,5 preto','fio flex 2,5 preto 450','fio 4 preto','quadro de sobrepor']
 .map(value=>({dataset:{example:value},addEventListener(name,cb){this.click=cb}}));
const closes=[{dataset:{closeDialog:'choiceDialog'},addEventListener(){}},{dataset:{closeDialog:'detailDialog'},addEventListener(){}}];
element('snapshot').textContent=json.content;
const document={
 getElementById:element,
 querySelectorAll(selector){if(selector==='[data-example]')return examples;if(selector==='[data-close-dialog]')return closes;return []}
};
const window={};
const context=vm.createContext({document,window,console});
for(const x of scripts.filter(x=>!x.tag.includes('application/json')))
 new vm.Script(x.content,{filename:'lab-runtime.js'}).runInContext(context);
assert.ok(element('top').innerHTML.includes('data-pick='),'pesquisa inicial exibe sugestão completa');
assert.ok(element('top').innerHTML.includes('Já está nesta lista'),'precedência da lista atual aparece no card');
assert.ok(element('review').innerHTML.includes('Completar na ficha'),'item com lacunas não é sugerido como pronto');
element('search').value='fio flex 2,5 preto 450';
element('search').listeners.input();
assert.ok(element('review').innerHTML.includes('0,6/1,0 kV'),'tensão ambígua preserva alternativa em revisão');
element('search').value='fio preto';
element('search').listeners.input();
assert.equal(element('expand').hidden,false,'pedido vago permite mostrar mais candidatos');
element('expand').listeners.click();
assert.ok(element('other').innerHTML.includes('data-pick='),'Ver mais revela alternativas');
element('personalize').listeners.click();
assert.equal(element('detailDialog').open,true,'personalizar abre detalhe sem alterar modal real');
assert.ok(element('detailFields').innerHTML.includes('data-field="DET-006"'),'ficha detalhada contém classe de tensão');
element('detailDialog').close();
element('search').value='fio flex 2,5 preto';
element('search').listeners.input();
const match=element('top').innerHTML.match(/data-pick="([^"]+)"/);
assert.ok(match);
element('top').listeners.click({target:{closest:()=>({dataset:{pick:match[1]}})}});
assert.equal(element('choiceDialog').open,true,'Escolher abre a conferência da especificação completa');
element('choiceDone').listeners.click();
assert.equal(element('choiceDialog').open,false);
assert.ok(element('feedback').textContent.includes('Nenhuma lista foi alterada'),'confirmação permanece simulação');
console.log('Interface de laboratório: entrada, recomendações, ver mais, revisão, personalizar e confirmar OK');
