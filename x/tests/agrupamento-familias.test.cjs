/* TEREON X — famílias recolhíveis sem somar materiais tecnicamente diferentes. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const app=fs.readFileSync(path.join(root,'x/listas/app.js'),'utf8');
const quant=fs.readFileSync(path.join(root,'x/listas/quantificacao.js'),'utf8');
const ctx={window:{}};vm.createContext(ctx);new vm.Script(quant).runInContext(ctx);
ctx.window.TereonXCatalog={get:id=>id==='FT_COND-001'?{name:'Condutores isolados'}:id==='FT_INFRA-001'?{name:'Eletroduto'}:null};
const start=app.indexOf("  const fmt=n=>Number(n).toLocaleString('pt-BR',{maximumFractionDigits:6});",app.indexOf("}else if(page==='list'){"));
const end=app.indexOf("  if(!l.items.length)",start);
assert.ok(start>=0&&end>start,'apresentação Por insumo localizada');
const esc=v=>String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const fns=new Function('window','esc',app.slice(start,end)+'return {familySections,groupCard,stageMaterialRow};')(ctx.window,esc);
function cond(id,cor,qty,stage){
 return {id,catalogId:'FT_COND-001',
  name:'Condutor isolado Cobre 2,5 PVC '+cor,stage,
  values:{'DET-001':'Condutor isolado','DET-002':'Cobre','DET-004':'2,5','DET-005':'PVC 70 °C','DET-008':cor},
  qty,qtyBasis:'m',unit:'rl100m',fichaStatus:'Em revisão'};
}
const a=cond('a','Azul',100,'Sala 1');
const b=cond('b','Preto',80,'Sala 1');
const c=cond('c','Azul',70,'Sala 2');
const other={id:'d',catalogId:'FT_INFRA-001',name:'Eletroduto rígido PVC 3/4"',
 values:{'DET-001':'Rígido','DET-002':'PVC','DET-004':'3/4"'},
 qty:8,stage:'Sala 2',unit:'br3m',fichaStatus:'Em revisão'};
const items=[a,b,c,other],before=JSON.stringify(items);
const groups=ctx.window.TereonXQuant.consolidate(items);
assert.equal(groups.length,2,'duas cores distintas geram duas linhas comerciais');
assert.ok(groups.some(g=>g.meters===170),'azul de etapas distintas é consolidado');
assert.ok(groups.some(g=>g.meters===80),'preto permanece outra variação');
const shown=new Set(),rows=[];
groups.forEach(g=>{const ids=new Set(g.sourceIds);const entries=items.filter(it=>ids.has(String(it.id)));
 rows.push({g,entries});entries.forEach(it=>shown.add(it.id));
});
const legacy=items.filter(it=>!shown.has(it.id));
assert.equal(legacy.length,1,'eletroduto legado não é convertido em metros');
rows.push({g:{name:other.name,kind:'legacy',unit:other.unit,units:8},entries:legacy});
const html=fns.familySections(rows);
assert.ok(html.includes('<details class="compact-family-section">'),'família fica recolhida inicialmente');
assert.ok(html.includes('<strong>Condutores elétricos</strong>'),'família visual de condutores');
assert.ok(html.includes('2 variações · 3 lançamento(s)'),'quantidades de variações e lançamentos');
assert.ok(html.includes('Azul')&&html.includes('Preto'),'duas cores continuam separadas');
assert.ok(html.includes('2 rolos de 100 m')&&html.includes('1 rolo de 100 m'),
 'compra calculada para cada cor, sem misturar');
assert.ok(html.includes('Eletroduto'),'outra família continua aparecendo');
assert.equal((html.match(/compact-family-section/g)||[]).length,1,'sem camada extra para uma única variação');
assert.equal((html.match(/compact-material-card/g)||[]).length,3,'duas variações de condutor mais eletroduto');
assert.ok(!html.includes('>Consolidado</span>')&&!html.includes('>Em revisão</span>'),'maturidade não aparece na lista');
assert.equal(JSON.stringify(items),before,'nenhum lançamento alterado');
assert.ok(app.includes("else if(listView==='etapa')"),'visão Por etapa preservada');
console.log('Famílias recolhíveis Por insumo: duas cores agrupadas visualmente mas quantificadas separadas; Por etapa preservada');
