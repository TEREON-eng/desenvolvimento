/* TEREON X — piloto do interpretador de pedidos de Condutores.
   Texto digitado ou transcrição de voz entram pela MESMA função pura.
   Saída são propostas NÃO CONFIRMADAS; nenhum dado técnico é salvo aqui. */
(function(root){
'use strict';
const fold=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
const has=(input,re)=>re.test(input);
function interpret(raw){
 const source=String(raw||'').slice(0,300),text=fold(source);
 const proposals=[],warnings=[];
 let family=null;
 if(has(text,/\b(fio|cabinho|condutor|cabo|cabos|fios)\b/))family='FT_COND-001';
 if(!family)return {source,family:null,proposals,warnings};
 const add=(id,value,quality,explanation='')=>{
  if(!proposals.some(p=>p.id===id))proposals.push({id,value,quality,explanation});
 };
 // Termos populares são sugestões de TIPO; fio/cabo sem construção é ambíguo.
 if(has(text,/\b(multipolar|multi\s*polar)\b/))add('DET-001','Cabo multipolar','interpretado','Confirme o tipo e a quantidade de vias.');
 else if(has(text,/\b(unipolar|uni\s*polar)\b/))add('DET-001','Cabo unipolar','interpretado','Confirme a construção.');
 else if(has(text,/\b(fio|cabinho|condutor)\b/))add('DET-001','Condutor isolado','interpretado','Nome popular; confirme o tipo.');
 if(has(text,/\b(cobre|cu)\b/))add('DET-002','Cobre','literal');
 if(has(text,/\b(aluminio|alum)\b/))add('DET-002','Alumínio','literal');
 // Seção: formato decimal, com ênfase em valores existentes na ficha.
 const sizes=['1,5','2,5','4,0','6,0','10,0','16,0','25,0','35,0','50,0','70,0','95,0','120,0','150,0','185,0','240,0'];
 let size=null;
 if(has(text,/\bdois e meio\b/))size='2,5';
 else{
  for(const val of sizes){
   const n=Number(val.replace(',','.'));
   const forms=[val,val.replace(',','.')];
   if(Number.isInteger(n))forms.push(String(n));
   if(forms.some(f=>new RegExp('(^|[^\\d])'+f.replace('.','\\.').replace(',','[,]')+'(?=$|[^\\d])').test(text))){size=val;break;}
  }
 }
 if(size)add('DET-004',size,'interpretado','Seção sugerida; confira em mm².');
 const colors={preto:'Preto',preta:'Preto',azul:'Azul',verde:'Verde',vermelho:'Vermelho',vermelha:'Vermelho',amarelo:'Amarelo',amarela:'Amarelo',cinza:'Cinza',marrom:'Marrom'};
 for(const [word,color] of Object.entries(colors)){
  if(new RegExp('\\b'+word+'\\b').test(text)){add('DET-008',color,'literal');break;}
 }
 if(has(text,/\bpvc\b/))add('DET-005','PVC 70 °C','interpretado','Confira a temperatura; PVC não implica automaticamente 70 °C.');
 if(has(text,/\b(hepr|xlpe|lszh|nao halogenado)\b/)){
  warnings.push('Isolação '+(has(text,/\bhepr\b/)?'HEPR':has(text,/\bxlpe\b/)?'XLPE':'não halogenada')+
   ': verificar na ficha; não substituir por uma opção conjunta automaticamente.');
 }
 const exact750=has(text,/\b450\s*[/\\-]\s*750\s*v?\b/);
 const exact1kv=has(text,/\b0[,.]6\s*[/\\-]\s*1[,.]?0?\s*k?v\b/);
 if(exact750)add('DET-006','450/750 V','literal');
 else if(exact1kv)add('DET-006','0,6/1,0 kV','literal');
 else if(has(text,/\b450\b|\b750\s*v\b/)){
  add('DET-006','450/750 V','interpretado','450 ou 750 V isolados não confirmam a classe 450/750 V.');
  warnings.push('A tensão informada está incompleta; confirme 450/750 V ou outra opção.');
 }else if(has(text,/\b1\s*k\s*v\b/)){
  add('DET-006','0,6/1,0 kV','interpretado','1 kV sozinho não define a classe completa.');
  warnings.push('A menção a 1 kV precisa de confirmação na ficha.');
 }
 if(has(text,/\b(extraflexivel|extra flexivel)\b/))
  add('DET-009','Classe VI (Extraflexível)','interpretado','Flexibilidade é indício, não ensaio de encordoamento.');
 else if(has(text,/\b(flexivel|flex|flexionado)\b/))
  add('DET-009','Classe V (Flexivel)','interpretado','Flexível não comprova sozinho a classe de encordoamento.');
 if(has(text,/\b(2|3|4|5|6)\s*(vias|condutores)\b/) &&
    proposals.some(p=>p.id==='DET-001'&&p.value==='Cabo multipolar')){
  const n=text.match(/\b([23456])\s*(vias|condutores)\b/);
  if(n)add('DET-003',n[1],'interpretado','Confirme o número de vias.');
 }
 proposals.sort((a,b)=>Number(a.id.slice(-3))-Number(b.id.slice(-3)));
 return {source,family,proposals,warnings};
}
root.TereonXInterpreter=Object.freeze({interpret,version:'condutores-1'});
})(typeof window!=='undefined'?window:globalThis);
