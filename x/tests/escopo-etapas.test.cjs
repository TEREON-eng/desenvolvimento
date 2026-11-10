'use strict';
const assert=require('node:assert/strict');
const api=require('../universo/obras/sugestoes-etapas.js');
const stages=[
 {id:'quadros',name:'Quadros elétricos'},
 {id:'qd1',name:'QD1',parentId:'quadros'},
 {id:'ilum',name:'Iluminação'},
 {id:'outro-qd1',name:'QD1',parentId:'ilum'}
];
const result=api.suggest(stages,['QD1','Quadros elétricos','qd1','Tomadas']);
assert.equal(result.suggestions.length,3,'sem duplicar por caixa');
assert.equal(result.suggestions[0].matches.length,2,'nome igual sob pais distintos exige desambiguação');
assert.ok(result.suggestions[0].matches.some(x=>x.label==='Quadros elétricos › QD1'));
assert.ok(result.suggestions[0].matches.some(x=>x.label==='Iluminação › QD1'));
assert.equal(result.suggestions[1].matches[0].id,'quadros','materiais podem se associar diretamente à etapa mãe');
assert.equal(result.suggestions[2].matches.length,0,'rótulo novo permanece candidato');
assert.ok(result.suggestions.every(x=>x.autoCreate===false&&x.autoLink===false&&x.action==='confirmation_required'));
assert.throws(()=>api.paths([{id:'a',name:'A',parentId:'b'},{id:'b',name:'B',parentId:'a'}]),/cíclica/);
assert.throws(()=>api.paths([{id:'a',name:'A',parentId:'não-existe'}]),/ausente/);
console.log('TEREON X: sugestões hierárquicas não vinculam automaticamente — OK');
