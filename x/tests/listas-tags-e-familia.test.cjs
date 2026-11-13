/* TEREON X.0.3.55 — situação técnica da ficha só na entrada de Adicionar item.
   Teste de conteúdo e apresentação sem DOM real; não homologa fichas. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const app=fs.readFileSync(path.join(__dirname,'../listas/app.js'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'../styles.css'),'utf8');
const begin=app.indexOf('function fichaPresentation(f){'),end=app.indexOf('function redrawAdd(){',begin);
assert.ok(begin>=0&&end>begin,'seletor inicial da ficha deve existir');
const entries=[
 {id:'FT_COND-001',name:'Condutores isolados',reference:'FT_COND-001',status:'Em revisão',maturity:'Consolidado',kind:'revisao'},
 {id:'FT_INFRA-001',name:'Eletroduto',reference:'FT_INFRA-001',status:'Em revisão',kind:'revisao'},
 {id:'FT_TEST',name:'Ficha experimental',reference:'FT_TEST',status:'Consolidado',kind:'revisao'},
 {id:'FT_OK',name:'Ficha publicada',reference:'FT_OK',status:'Aprovada',kind:'oficial',homologada:true}
];
const window={TereonXCatalog:{list:()=>entries}};
const holder={innerHTML:''};
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const fn=new Function('window','fichaSearch','loadingFichas','fichaError','$','esc',
 app.slice(begin,end)+'return {fichaPresentation,paintFichaChoices};');
const picker=fn(window,'',false,'',()=>holder,esc);
picker.paintFichaChoices();
assert.ok(holder.innerHTML.includes('<strong>Condutores elétricos</strong>'),'nome principal da ficha de condutores');
assert.ok(holder.innerHTML.includes('<strong>Eletroduto</strong>'),'nome da ficha de infraestrutura');
assert.ok(holder.innerHTML.includes('class="ficha-maturity-tag revision"')&&holder.innerHTML.includes('>Em revisão</span>'),'situação em revisão no seletor');
assert.ok(holder.innerHTML.includes('class="ficha-maturity-tag consolidated"')&&holder.innerHTML.includes('>Consolidado</span>'),'consolidado somente quando status da ficha é explícito');
assert.equal((holder.innerHTML.match(/>Consolidado<\/span>/g)||[]).length,2,'consolidado exige indicação explícita de maturidade ou status da ficha');
assert.equal(picker.fichaPresentation(entries[0]).tag,'Consolidado','maturidade consolidada não remove revisão');
assert.ok(holder.innerHTML.includes('FT_COND-001 · Publicação pendente'),'sem homologação técnica automática');
assert.equal(picker.fichaPresentation(entries[3]).tag,'','ficha aprovada não vira consolidada por inferência');
assert.ok(!holder.innerHTML.includes('FT_OK · Aprovada'),'não repetir status em texto solto');
assert.ok(!app.includes('groupTags(')&&!app.includes('compact-status-chip'),'nenhum status na lista lançada');
assert.ok(!css.includes('#listDialog .compact-status-chip'),'sem estilização de status nas listas');
assert.ok(css.includes('#addDialog.is-choosing .ficha-maturity-tag.revision'),'tags somente na primeira tela do modal');
const renderBegin=app.indexOf('  const fmt=n=>Number(n).toLocaleString('+"'pt-BR'"+',{maximumFractionDigits:6});',app.indexOf("}else if(page==='list'){"));
const renderEnd=app.indexOf('  if(!l.items.length)',renderBegin);
assert.ok(renderBegin>=0&&renderEnd>renderBegin,'renderização da lista localizada');
const render=new Function('window','esc',app.slice(renderBegin,renderEnd)+'return {groupCard,stageMaterialRow};')(
 {TereonXCatalog:{get:()=>({name:'Condutores isolados',status:'Em revisão'})}},esc);
const origin={catalogId:'FT_COND-001',name:'Condutor isolado Cobre 2,5 PVC Azul',
 values:{'DET-001':'Condutor isolado','DET-002':'Cobre','DET-004':'2,5','DET-005':'PVC 70 °C','DET-008':'Azul'},id:'a',qty:100,qtyBasis:'m',unit:'rl100m',stage:'Sala 1'};
const group={name:origin.name,kind:'package',unit:'rl100m',units:1,meters:100,factor:100};
for(const output of [render.groupCard(group,[origin]),render.stageMaterialRow(group,[origin])]){
 assert.ok(!output.includes('Consolidado')&&!output.includes('Em revisão'),'lista lançada sem badges');
 assert.ok(output.includes('Condutor isolado'),'tipo técnico preservado');
}
assert.ok(render.groupCard(group,[origin]).includes('Condutores elétricos'),'título Por insumo preservado');
function luminance(hex){
 const c=hex.replace('#','').match(/../g).map(h=>parseInt(h,16)/255)
  .map(x=>x<=.04045?x/12.92:Math.pow((x+.055)/1.055,2.4));
 return .2126*c[0]+.7152*c[1]+.0722*c[2];
}
function contrast(a,b){const [x,y]=[luminance(a),luminance(b)].sort((a,b)=>b-a);return(x+.05)/(y+.05)}
assert.ok(contrast('#f5fbf6','#36493d')>7,'texto do botão no tema escuro com contraste forte');
assert.ok(contrast('#f5fff3','#284835')>7,'texto do botão no tema TEREON com contraste forte');
assert.ok(css.includes('html[data-tx-appearance="dark"] #addDialog:not(.is-choosing) #choices .tag.option'),'regras de opção específicas do tema escuro');
assert.ok(css.includes('html[data-tx-appearance="tereon"] #addDialog:not(.is-choosing) #choices .tag.option'),'regras de opção específicas do tema TEREON');
console.log('TEREON X: tags só no seletor inicial; listas limpas; contraste escuro/TEREON OK');
