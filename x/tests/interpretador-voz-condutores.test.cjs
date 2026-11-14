/* Entrada natural: texto/voz convergem; sugestões não são dados confirmados. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const base=path.resolve(__dirname,'../..'),source=p=>fs.readFileSync(path.join(base,p),'utf8');
const ctx={window:{}};vm.createContext(ctx);
new vm.Script(source('x/catalogo/interpretador-condutores.js')).runInContext(ctx);
const parser=ctx.window.TereonXInterpreter;
function suggestion(r,id){return r.proposals.find(p=>p.id===id)}
const first=parser.interpret('fio flex 2,5 preto 450');
assert.equal(first.family,'FT_COND-001');
assert.equal(suggestion(first,'DET-001').value,'Condutor isolado');
assert.equal(suggestion(first,'DET-004').value,'2,5');
assert.equal(suggestion(first,'DET-008').value,'Preto');
assert.equal(suggestion(first,'DET-006').value,'450/750 V');
assert.equal(suggestion(first,'DET-006').quality,'interpretado','450 não confirma tensão');
assert.ok(first.warnings.some(x=>x.includes('incompleta')));
assert.equal(suggestion(first,'DET-009').quality,'interpretado','flexível não comprova encordoamento');
const full=parser.interpret('condutor cobre 2,5 preto pvc 450/750 V');
assert.equal(suggestion(full,'DET-002').value,'Cobre');
assert.equal(suggestion(full,'DET-005').quality,'interpretado','PVC exige confirmar temperatura');
assert.equal(suggestion(full,'DET-006').quality,'literal','450/750 explícito');
const colloquial=parser.interpret('fio preto dois e meio');
assert.equal(suggestion(colloquial,'DET-004').value,'2,5');
const partialKV=parser.interpret('cabo 2,5 preto 1kv');
assert.equal(suggestion(partialKV,'DET-006').quality,'interpretado');
const compound=parser.interpret('cabo multipolar 3 vias cobre 4,0');
assert.equal(suggestion(compound,'DET-001').value,'Cabo multipolar');
assert.equal(suggestion(compound,'DET-003').value,'3');
const vague=parser.interpret('tubo pvc rígido');
assert.equal(vague.family,null,'piloto não inventa família de eletroduto');
const hepr=parser.interpret('cabo hepr cobre 10');
assert.ok(hepr.warnings.some(x=>x.includes('HEPR')));
assert.equal(suggestion(hepr,'DET-005'),undefined,'HEPR não vira opção ambígua HEPR ou XLPE');
const before=JSON.stringify(first);parser.interpret(first.source);assert.equal(JSON.stringify(first),before);

new vm.Script(source('x/catalogo/voz-entrada.js')).runInContext(ctx);
const unsupported=[];
assert.equal(ctx.window.TereonXVoice.supported(),false);
ctx.window.TereonXVoice.start(t=>unsupported.push(t),(message)=>unsupported.push(message));
assert.ok(unsupported.some(x=>x.includes('indisponível')),'digitação continua disponível sem microfone');
class FakeSpeech{
 constructor(){FakeSpeech.last=this;}
 start(){this.onstart?.()}
 abort(){this.aborted=true;}
}
ctx.window.webkitSpeechRecognition=FakeSpeech;
assert.equal(ctx.window.TereonXVoice.supported(),true);
const heard=[],statuses=[];
assert.equal(ctx.window.TereonXVoice.start(t=>heard.push(t),(message,state)=>statuses.push([message,state])),true);
assert.equal(FakeSpeech.last.lang,'pt-BR');
FakeSpeech.last.onresult({resultIndex:0,results:[[{transcript:'fio flex 2,5 preto 450'}]]});
assert.equal(heard[0],first.source,'o texto de voz é o mesmo texto processado pelo intérprete');
FakeSpeech.last.onend();
assert.ok(statuses.some(([m,state])=>state===true&&m.includes('Ouvindo')));
assert.equal(ctx.window.TereonXVoice.start(()=>{},()=>{}),true);
ctx.window.TereonXVoice.stop();
assert.equal(FakeSpeech.last.aborted,true,'parar aborta a captura');
const app=source('x/listas/app.js');
assert.ok(app.includes("window.TereonXVoice?.start("),'microfone iniciado por clique');
assert.ok(app.includes("if(tag){toggleIntentTag("),'confirmação por clique na tag com ?');
assert.ok(app.includes("if(advance){enterFicha("),'avançar para a ficha com as tags confirmadas');
assert.ok(!app.includes('function draftSuggestionsHTML('),'segundo painel de sugestões removido da ficha');
assert.ok(app.includes("if(!state?.available)"),'condição da ficha protege confirmação');
assert.ok(app.includes("window.TereonXCatalog.conflicts(selectedFicha,next)"),'motor técnico valida regras');
assert.ok(app.includes("window.TereonXIntentDraft?.apply("),'rascunho validado antes de transferir tags');
assert.ok(app.includes("window.TereonXVoice?.stop()"),'microfone é interrompido ao sair');
const html=source('x/index.html');
assert.ok(html.includes('/x/catalogo/interpretador-condutores.js'));
assert.ok(html.includes('/x/catalogo/voz-entrada.js'));
console.log('Texto/voz: intenção, ambiguidade, tradução conservadora, gesto explícito e fallback OK');
