/* TEREON X — leitor de fichas v1 (isolado, sem DOM, sem armazenamento, sem publicação).
 * Recebe dados normalizados do Fichário oficial. Não acessa a planilha diretamente.
 * O arquivo XLSM é a fonte; snapshots servem somente a testes.
 */
(function(root){
'use strict';
const clean=v=>String(v??'').trim();
const statuses=new Set(['aprovada','publicada']);
function splitValues(s){return clean(s).split(';').map(clean).filter(Boolean);}
function normalize(raw){
 if(!raw||!raw.codigo||!raw.nome)throw Error('Ficha sem código ou nome.');
 const details=(raw.detalhes||[]).filter(d=>clean(d.nome)||clean(d.valores)||clean(d.condicao)).map(d=>({
  id:clean(d.id),ordem:Number(d.ordem),nome:clean(d.nome),valores:splitValues(d.valores),
  condicao:clean(d.condicao),classificacao:clean(d.classificacao),status:clean(d.status),
  unidade:clean(d.unidade)
 })).sort((a,b)=>a.ordem-b.ordem);
 const errors=[],warnings=[];
 if(!statuses.has(clean(raw.status).toLowerCase()))warnings.push('Ficha em revisão: uso restrito ao laboratório.');
 const ids=new Set();
 for(const d of details){
  if(!d.id||ids.has(d.id))errors.push('ID de detalhe ausente ou repetido: '+(d.id||'(vazio)'));
  ids.add(d.id);
  if(!d.nome)errors.push('Detalhe '+d.id+' sem nome.');
  if(!d.valores.length)warnings.push('Detalhe '+d.id+' sem valores.');
  if(!d.classificacao)warnings.push('Obrigatoriedade não definida em '+d.id+'.');
  if(!d.condicao)warnings.push('Condição de exibição não definida em '+d.id+'.');
  else if(d.condicao!=='Sempre')warnings.push('Condição "'+d.condicao+'" de '+d.id+' requer validação antes de executar.');
 }
 return {codigo:clean(raw.codigo),nome:clean(raw.nome),categoria:clean(raw.categoria),
  status:clean(raw.status),detalhes:details,errors,warnings,
  liberadaParaPublicacao:errors.length===0&&warnings.length===0&&statuses.has(clean(raw.status).toLowerCase())};
}
function load(source){
 if(!source||source.tipo!=='TEREON_FICHARIO_OFICIAL_SNAPSHOT'||source.versao!==1)throw Error('Formato do Fichário não reconhecido.');
 const fichas=(source.fichas||[]).map(normalize);
 const seen=new Set();
 fichas.forEach(f=>{if(seen.has(f.codigo))f.errors.push('Código da ficha repetido.');seen.add(f.codigo);f.liberadaParaPublicacao=f.liberadaParaPublicacao&&f.errors.length===0;});
 return {fonte:source.fonte,exportadoEm:source.exportadoEm,fichas,publicaveis:fichas.filter(f=>f.liberadaParaPublicacao)};
}
root.TereonFicharioX={load,normalize,splitValues};
})(typeof window!=='undefined'?window:globalThis);
