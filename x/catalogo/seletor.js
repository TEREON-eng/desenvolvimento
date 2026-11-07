/* TEREON X · Seleção de itens do Catálogo Oficial para listas de teste.
   Motor e UI isolados; salva somente via callback fornecido pelo módulo Listas. */
(function(root){'use strict';
let ctx=null,chosen=null,values={},search='',editing=false;const $=id=>document.getElementById(id);
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&quot;'}[c]));
const css=`
#txCatalogDialog{width:min(95vw,590px);max-width:none;height:min(690px,95dvh);padding:0;border:0;border-radius:17px;box-shadow:0 16px 65px #0003}
#txCatalogDialog::backdrop{background:#182a1fa6}
.tx-layout{height:100%;display:flex;flex-direction:column;padding:16px;gap:10px;min-height:0}
.tx-top{display:flex;align-items:center;justify-content:space-between;gap:12px}
.tx-top button{background:#ecf2ed;border:0;border-radius:9px;padding:7px 11px}
.tx-search{width:100%;border:1px solid #cad9ce;border-radius:9px;padding:10px;font:inherit}
.tx-items{overflow-y:auto;flex:1;min-height:50px}
.tx-item{display:block;width:100%;padding:12px;text-align:left;border:1px solid #dfe8e1;border-radius:10px;background:#fff;margin-bottom:7px;cursor:pointer}
.tx-item small{display:block;color:#708275;margin-top:4px;font-size:11px}
.tx-fields{overflow-y:auto;flex:1;min-height:0}
.tx-field{padding:10px 0;border-bottom:1px solid #e6ebe6}
.tx-field strong{font-size:12px}
.tx-opts{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}
.tx-chip{border:1px solid #b9cbbc;background:white;border-radius:8px;padding:7px 10px;color:#2e4c38;font:12px system-ui}
.tx-chip[aria-pressed=true]{background:#e5f1e6;border-color:#558262}
.tx-name{font-weight:600;font-size:13px;line-height:1.4}
.tx-notice{font:11px/1.45 system-ui;color:#906535;background:#fff8e9;padding:7px;border-radius:8px}
.tx-bottom{border-top:1px solid #e5ebe5;padding-top:9px;display:grid;gap:8px}
.tx-three{display:grid;grid-template-columns:1fr .75fr 1.4fr;gap:6px}
.tx-three label{display:grid;gap:4px;font-size:11px;color:#637768}
.tx-three input,.tx-three select{width:100%;min-width:0;padding:7px;border:1px solid #d5dfd6;border-radius:8px}
.tx-save{width:100%;padding:11px;border:0;border-radius:9px;background:#224331;color:white;font-weight:600}
.tx-save:disabled{opacity:.4}
`;
function ensure(){if($('txCatalogDialog'))return;const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);const d=document.createElement('dialog');d.id='txCatalogDialog';d.innerHTML='<div class="tx-layout"><div class="tx-top"><strong>Catálogo Oficial · laboratório</strong><button type="button" id="txClose">✕</button></div><div id="txBody" class="tx-items"></div><div id="txFooter" class="tx-bottom" hidden></div></div>';document.body.appendChild(d);$('txClose').onclick=()=>d.close();
$('txBody').addEventListener('input',e=>{if(e.target.id==='txSearch'){search=e.target.value;paintPicker()}});
$('txBody').addEventListener('click',e=>{let item=e.target.closest('[data-catalog-item]');if(item){chosen=TereonXCatalog.get(item.dataset.catalogItem);values={};paintForm();return;}let b=e.target.closest('[data-field]');if(b){const k=b.dataset.field,v=b.dataset.value;values[k]===v?delete values[k]:values[k]=v;for(const d of chosen.details){const status=TereonXCatalog.applyRule(d.condition,values,chosen.details);if(status.verified&&!status.visible)delete values[d.id]}paintForm();}});
$('txFooter').addEventListener('input',validate);
$('txFooter').addEventListener('click',e=>{if(e.target.id==='txBack'){chosen=null;values={};paintPicker();return}if(e.target.id!=='txSave')return;validate();if(e.target.disabled)return;const payload={catalogId:chosen.id,name:TereonXCatalog.technicalName(chosen,values),values:Object.assign({},values),qty:$('txQty').value,unit:$('txUnit').value,stage:$('txStage').value.trim(),fichaStatus:chosen.status,simulacao:true};try{ctx.onSave(payload);d.close()}catch(error){alert('Não foi possível salvar: '+(error.message||error))}});
}
function paintPicker(){const all=TereonXCatalog.list();const q=search.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();let found=all.filter(f=>(f.name+' '+f.id).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(q));$('txFooter').hidden=true;$('txBody').className='tx-items';$('txBody').innerHTML='<div class="tx-notice">Itens em revisão e fichas hipotéticas liberados apenas para simulação. Nenhuma ficha é homologada automaticamente.</div><input id="txSearch" class="tx-search" placeholder="Pesquisar no catálogo..." aria-label="Buscar material" value="'+escape(search)+'" style="margin:10px 0">'+found.map(f=>'<button class="tx-item" data-catalog-item="'+escape(f.id)+'"><strong>'+escape(f.name)+'</strong><small>'+escape(f.id)+' · '+(f.kind==='simulacao'?'Ficha hipotética':'Em revisão')+'</small></button>').join('');}
function paintForm(){const ds=TereonXCatalog.visibleDetails(chosen,values);$('txFooter').hidden=false;$('txBody').className='tx-fields';$('txBody').innerHTML='<button type="button" class="tx-chip" id="txBack" style="margin-bottom:9px">← Materiais</button><div class="tx-name">'+escape(TereonXCatalog.technicalName(chosen,values))+'</div><div class="tx-notice">'+(chosen.kind==='simulacao'?'Ficha hipotética com opções fictícias.':'Ficha em revisão, pode conter pendências.')+' Disponível somente para testes.</div>'+ds.map(d=>'<div class="tx-field"><strong>'+escape(d.name)+'</strong><small style="margin-left:8px;color:#748377">'+(d.required?'Obrigatório':'Opcional / a definir')+'</small><div class="tx-opts">'+d.options.map(opt=>'<button type="button" class="tx-chip" data-field="'+escape(d.id)+'" data-value="'+escape(opt)+'" aria-pressed="'+(values[d.id]===opt)+'">'+escape(opt)+'</button>').join('')+'</div></div>').join('');
$('txFooter').innerHTML='<div class="tx-three"><label>Qtd.<input id="txQty" type="number" min=".001" step="any" value="'+escape(ctx.item?.qty??1)+'"></label><label>Unidade<select id="txUnit">'+['un','m','rl'].map(u=>'<option value="'+u+'" '+((ctx.item?.unit||'un')===u?'selected':'')+'>'+u+'</option>').join('')+'</select></label><label>Etapa<input id="txStage" value="'+escape(ctx.item?.stage||'Geral')+'"></label></div><button class="tx-save" id="txSave">'+(editing?'Salvar alterações':'Adicionar à lista')+'</button><div id="txWarn" style="font-size:11px;color:#9c6934"></div>';validate();}
function validate(){if(!$('txSave')||!chosen)return;const missing=TereonXCatalog.missing(chosen,values);const qty=Number($('txQty').value),stage=$('txStage').value.trim();$('txSave').disabled=!!missing.length||!(qty>0)||!stage;$('txWarn').textContent=missing.length?missing.length+' característica(s) obrigatória(s) pendente(s).':'Seleções não homologadas — simulação de lista.';}
async function open(options){if(!options||typeof options.onSave!=='function')throw Error('Contrato de Listas inválido');ensure();ctx=options;search='';editing=!!options.item;chosen=options.item?.catalogId?TereonXCatalog.get(options.item.catalogId):null;values=Object.assign({},options.item?.values||{});$('txBody').textContent='Carregando catálogo...';$('txFooter').hidden=true;$('txCatalogDialog').showModal();try{await TereonXCatalog.load();if(!$('txCatalogDialog').open)return;if(options.item?.catalogId)chosen=TereonXCatalog.get(options.item.catalogId);if(chosen)paintForm();else paintPicker()}catch(e){$('txBody').textContent='Erro ao carregar catálogo: '+e.message}}
root.TereonXCatalogUI=Object.freeze({open});
})(window);