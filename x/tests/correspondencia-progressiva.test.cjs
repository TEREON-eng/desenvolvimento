/* Correspondência técnica: sugestão não destrutiva, sem alterar o motor comercial. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../..');
const fixture=JSON.parse(fs.readFileSync(path.join(root,'x/tests/fixtures/correspondencia-progressiva-condutores-v1.json'),'utf8'));
const ctx={window:{}};vm.createContext(ctx);
new vm.Script(fs.readFileSync(path.join(root,'x/listas/correspondencia.js'),'utf8')).runInContext(ctx);
const match=ctx.window.TereonXMatch;
const copy=JSON.stringify(fixture);
for(const c of fixture.cases){
 if(c.id==='C08'){
  assert.equal(c.candidates.length,2);
  for(const candidate of c.candidates){
   assert.equal(match.compare(c.a,candidate).status,'potencial','par incompleto com cada tensão candidata');
  }
  assert.equal(match.findReviewPairs([c.a,...c.candidates]).length,2,'ambas alternativas devem ser apresentadas');
  continue;
 }
 const result=match.compare(c.a,c.b);
 assert.equal(result.status,c.expected.status,c.id+' — '+c.title);
 for(const id of c.expected.missing||[])assert.ok(result.missing.some(m=>m.id===id),c.id+' lacuna '+id);
 for(const id of c.expected.conflicts||[])assert.ok(result.conflicts.some(m=>m.id===id),c.id+' divergência '+id);
 if(c.id==='C09')assert.ok(match.findReviewPairs([c.a,c.b]).length,'nomes diferentes com mesmos valores sugerem revisão');
 if(c.id==='C10')assert.equal(match.findReviewPairs([c.a,c.b]).length,0,'unidades comerciais diferentes não geram fusão');
 if(c.id==='C11')assert.ok(result.missing.some(m=>m.id==='DET-006'),'texto 450 não vira tensão');
 if(c.id==='C15')assert.ok(result.ambiguous.length,'valor agregado HEPR ou XLPE não é conclusão');
}
assert.equal(JSON.stringify(fixture),copy,'comparação nunca altera valores da fixture');
assert.equal(Object.keys(match).sort().join(','),'compare,findReviewPairs,version','não incluir edição ou consolidação automática');
const app=fs.readFileSync(path.join(root,'x/listas/app.js'),'utf8');
assert.ok(app.includes('data-review-matches="1"'),'usuário consegue iniciar revisão');
assert.ok(app.includes('function openMatchReview(){'),'revisão explicada antes de editar');
assert.ok(app.includes('openAdd(entry,matchEdit.dataset.matchDetail'),'edição explícita usando o modal aprovado');
assert.ok(app.includes('data-match-edit'),'nenhuma edição é automática');
console.log('Correspondência: 15 casos, duas tensões possíveis, segurança e ligação ao modal OK');
