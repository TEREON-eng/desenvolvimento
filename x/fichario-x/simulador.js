/* TEREON X — laboratório independente de 24 fichas.
 * Não lê nem escreve localStorage, não salva listas e não publica fichas.
 */
(()=>{'use strict';
const $=id=>document.getElementById(id),escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&quot;'}[c]));
let fichas=[],current=null,selected={};
function matches(s,q){return s.toLocaleLowerCase('pt-BR').includes(q.toLocaleLowerCase('pt-BR'));}
function render(){
 const q=$('search').value.trim(),kind=$('filter').value;
 const rows=fichas.filter(f=>(kind==='todos'||f.tipo===kind)&&matches(f.referencia,q));
 $('list').innerHTML=rows.length?rows.map(f=>'<button class="item" type="button" data-index="'+f.indice+'"><span><strong>'+escape(f.nome)+'</strong><small>'+escape(f.referencia)+'</small></span><span class="chip '+(f.tipo==='real'?'real':'')+'">'+(f.tipo==='real'?'Em revisão':'Simulação')+'</span></button>').join(''):'<div class="bar">Nenhuma ficha encontrada.</div>';
}
function conditional(rule){
 if(!rule||rule.toLowerCase()==='sempre')return {show:true,warning:false};
 // A grafia livre da planilha ainda não é uma regra validada; exibir com aviso.
 return {show:true,warning:true};
}
function view(){
 $('modalTitle').textContent=current.nome;
 $('modalCode').textContent=current.referencia;
 $('modalNote').textContent=current.tipo==='real'
  ?'Detalhes transcritos da ficha em revisão. Condições ainda não são executadas automaticamente.'
  :'DEMONSTRAÇÃO: características e valores fictícios para testar a interação. Esta ficha ainda não existe no Fichário.';
 const details=current.detalhes.filter(d=>d.nome||d.valores.length);
 $('questions').innerHTML=details.map((d,i)=>{
  const info=conditional(d.condicao);
  const name=escape(d.nome||'[Sem nome na ficha]'),choices=d.valores.map(v=>'<button type="button" class="choice" data-detail="'+i+'" data-value="'+escape(v)+'" aria-pressed="'+String(selected[i]===v)+'">'+escape(v)+'</button>').join('');
  return '<div class="question"><div class="q-title">'+(i+1)+'. '+name+'</div><div class="opts">'+(choices||'<span class="muted">Nenhum valor cadastrado</span>')+'</div>'+(d.classificacao?'<div class="muted">Classificação: '+escape(d.classificacao)+'</div>':'')+(info.warning?'<div class="muted">Condição a revisar: '+escape(d.condicao)+'</div>':'')+'</div>';
 }).join('');
 const vals=details.map((d,i)=>selected[i]).filter(Boolean);
 $('preview').textContent=current.nome+(vals.length?' · '+vals.join(' · '):' · aguardando seleções');
 $('progress').textContent=vals.length+' de '+details.length+' detalhes com valor selecionado · simulação sem gravação';
}
function open(f){current=f;selected={};view();$('detail').showModal();}
$('list').addEventListener('click',e=>{const b=e.target.closest('[data-index]');if(b){const f=fichas.find(x=>x.indice===Number(b.dataset.index));if(f)open(f);}});
$('questions').addEventListener('click',e=>{
 const b=e.target.closest('[data-detail]');if(!b)return;
 const i=Number(b.dataset.detail),val=b.dataset.value;
 if(selected[i]===val)delete selected[i];else selected[i]=val;
 view();
});
$('close').onclick=()=>$('detail').close();
$('reset').onclick=()=>{selected={};view();};
$('search').oninput=render;$('filter').onchange=render;
fetch('/x/fichario-x/simulacao-24.json?v=1',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Não foi possível ler os dados');return r.json();}).then(data=>{
 fichas=data.fichas||[];
 $('total').textContent=fichas.length;
 $('reais').textContent=fichas.filter(x=>x.tipo==='real').length;
 $('vazias').textContent=fichas.filter(x=>x.tipo!=='real').length;
 render();
}).catch(e=>{$('list').textContent='Erro ao carregar as fichas: '+e.message;});
})();