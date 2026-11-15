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
