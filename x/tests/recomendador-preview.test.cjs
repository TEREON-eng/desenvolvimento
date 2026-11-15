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
assert.ok(source.includes('class="utility-strip"')&&source.includes('<summary>Sobre este teste</summary>'),'painéis inferiores compactados e informações secundárias recolhidas');
assert.ok(!source.includes('Não encontrou exatamente o que precisa?'),'remover painel inferior redundante');
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
// Regressão: espaços, múltiplas palavras e espaços finais devem permanecer no input.
element('search').value='fio ';
element('search').listeners.input();
assert.equal(element('search').value,'fio ','espaço após a palavra não pode desaparecer');
element('search').value+='flex ';
element('search').listeners.input();
assert.equal(element('search').value,'fio flex ','espaço entre e depois das palavras permanece digitável');
element('search').value+='2,5 preto';
element('search').listeners.input();
assert.ok(element('top').innerHTML.includes('data-pick='),'busca de expressão completa continua funcionando');
assert.ok(element('top').innerHTML.includes('data-remove-tag='),'candidato exibe tags removíveis');
assert.ok(element('other').innerHTML==='','alternativas começam recolhidas');
element('search').value='fio flex 2,5 preto 450';
element('search').listeners.input();
element('expand').listeners.click();
assert.ok(element('other').innerHTML.includes('0,6/1,0 kV'),'tensão ambígua permanece para revisão nas alternativas');
element('search').value='fio preto';
element('search').listeners.input();
assert.equal(element('expand').hidden,false,'pedido vago permite mostrar mais candidatos');
element('expand').listeners.click();
assert.ok(element('other').innerHTML.includes('data-detail='),'Ver outras sugestões revela materiais editáveis');
// Ao tocar no texto da tag, trocar apenas aquele detalhe, sem passar pelo × ou formulário.
element('search').value='fio flex 2,5 preto';
element('search').listeners.input();
const changeKey=element('top').innerHTML.match(/data-open-tag="DET-008" data-candidate="([^"]+)"/);
assert.ok(changeKey,'valor da cor é tocável');
const changeCandidate=changeKey[1];
element('top').listeners.click({target:{closest:()=>({dataset:{openTag:'DET-008',candidate:changeCandidate}})}});
assert.ok(element('top').innerHTML.includes('data-set-tag="DET-008" data-value="Azul"'),'toque abre escolhas da ficha para aquele detalhe');
assert.ok(element('top').innerHTML.includes('data-set-tag="DET-008" data-value="Preto"'),'valor anterior segue disponível');
element('top').listeners.click({target:{closest:()=>({dataset:{setTag:'DET-008',value:'Azul',candidate:changeCandidate}})}});
assert.ok(element('top').innerHTML.includes('data-open-tag="DET-008"'),'a tag permanece editável após troca');
assert.ok(element('top').innerHTML.includes('>Azul</button>'),'cor trocada diretamente na sugestão');
assert.ok(element('top').innerHTML.includes('PVC 70 °C'),'demais detalhes foram mantidos');
assert.ok(element('top').innerHTML.includes('data-pick="'+changeCandidate+'"'),'troca válida ainda permite conferir o conjunto');
assert.equal(element('detailDialog').open,undefined,'troca de tag não abre ficha completa');
// O × atua SOMENTE sobre a sugestão, conserva as outras tags e exige editar pendências.
element('search').value='fio flex 2,5 preto';
element('search').listeners.input();
const cardBefore=element('top').innerHTML;
const token=cardBefore.match(/data-remove-tag="DET-006" data-candidate="([^"]+)"/);
assert.ok(token,'tensão é uma tag removível');
const key=token[1];
element('top').listeners.click({target:{closest:()=>({dataset:{removeTag:'DET-006',candidate:key}})}});
assert.ok(element('top').innerHTML.includes('Classe de tensão · ?'),'remover a tensão torna a informação pendente');
assert.ok(element('top').innerHTML.includes('data-pick="'+key+'" disabled'),'sem tensão não pode confirmar diretamente');
assert.ok(element('top').innerHTML.includes('PVC 70 °C'),'demais detalhes são preservados');
element('top').listeners.click({target:{closest:()=>({dataset:{detail:key}})}});
assert.equal(element('detailDialog').open,true,'Editar esta sugestão abre ficha preenchida');
assert.ok(element('detailFields').innerHTML.includes('data-field="DET-006"'),'a tensão pode ser redefinida');
assert.ok(element('detailFields').innerHTML.includes('<option value="PVC 70 °C" selected'),'outros detalhes pré-selecionados persistem');
assert.equal(element('detailDone').disabled,true,'sem obrigatória não deixa confirmar pela ficha');
element('detailDialog').close();
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
console.log('Interface do laboratório: sugestão única, tags removíveis, alternativas recolhidas e edição preservada OK');
