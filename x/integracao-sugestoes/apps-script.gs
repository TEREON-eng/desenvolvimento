// TEREON X · Recebimento em pacotes de linhas · v2
const ABA = 'Pacotes';
// Coluna R: token técnico para confirmar o recebimento no próprio formulário.
function doPost(e) {
  try {
    if (!e || !e.parameter || !e.parameter.payload || e.parameter.website) throw Error('Envio inválido');
    if (e.parameter.payload.length > 15000) throw Error('Proposta muito longa');
    const p = JSON.parse(e.parameter.payload);
    const familia = limpar(p.familia,100), item = limpar(p.item,120);
    const obs = limpar(p.observacoes,1500);
    if (!familia || !item || !Array.isArray(p.detalhes) || !p.detalhes.length || p.detalhes.length > 40) throw Error('Dados incompletos');
    const detalhes = p.detalhes.map(d => {
      const nome = limpar(d.nome,100), valores = limpar(d.valores,1600);
      if (!nome || !valores) throw Error('Detalhe incompleto');
      return {nome,valores};
    });
    const aba = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ABA);
    if (!aba) throw Error('Aba Pacotes não encontrada');
    const lock = LockService.getScriptLock();
    lock.waitLock(15000);
    let id;
    try {
      id = 'SG-' + Utilities.getUuid().slice(0,8).toUpperCase();
      const token = typeof p.clientToken === 'string' && /^[a-zA-Z0-9-]{12,100}$/.test(p.clientToken) ? p.clientToken : '';
      const linhas = [[id,'ITEM',new Date(),familia,item,'','','','','','','Recebido','TEREON X',obs,'','','',token]];
      detalhes.forEach((d,i) => linhas.push([id,'DETALHE','','','','DET-'+String(i+1).padStart(3,'0'),d.nome,d.valores,'','','Pendente','','','','','','','']));
      aba.getRange(aba.getLastRow()+1,1,linhas.length,18).setValues(linhas);
    } finally { lock.releaseLock(); }
    return resposta('Proposta recebida!', 'Identificador: '+id+'. '+detalhes.length+' detalhe(s) para avaliação.', true, id, p);
  } catch(err) { let p={};try{p=JSON.parse((e&&e.parameter&&e.parameter.payload)||'{}')}catch(_){};return resposta('Não foi possível registrar',String(err.message||err),false,'',p); }
}
function limpar(v,n) {
  const t = typeof v === 'string' ? v.trim().slice(0,n) : '';
  return /^[=+\\-@]/.test(t) ? "'"+t : t;
}
function resposta(t,m,ok,id,p) {
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const origin = p && p.clientOrigin === 'https://tereon.pages.dev' ? p.clientOrigin : '';
  const token = p && typeof p.clientToken === 'string' ? p.clientToken.slice(0,100) : '';
  const payload = JSON.stringify({
    type:'tereon-proposta-resposta',token:token,ok:ok===true,id:id||'',message:m
  }).replace(/</g,'\\u003c');
  const bridge = origin && token ? '<script>window.top.postMessage('+payload+','+JSON.stringify(origin)+');'+'</scr'+'ipt>' : '';
  return HtmlService.createHtmlOutput(
    '<!doctype html><html lang="pt-BR"><meta name="viewport" content="width=device-width,initial-scale=1">'+
    '<body style="font:16px system-ui;padding:24px"><h2>'+esc(t)+'</h2><p>'+esc(m)+'</p>'+bridge+'</body></html>'
  );
}

// Consulta de confirmação por JSONP (sem expor os dados da proposta).
// Scripts externos são aceitos no navegador mesmo quando a API do Google bloqueia CORS.
function doGet(e) {
  const token = String((e && e.parameter && e.parameter.token) || '');
  const callback = String((e && e.parameter && e.parameter.callback) || '');
  if (!/^tereonConfirm_[A-Za-z0-9_]+$/.test(callback) || !/^[A-Za-z0-9-]{12,100}$/.test(token)) {
    return ContentService.createTextOutput('/* Solicitação inválida */')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  let result = { token:token, ok:false, id:'' };
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ABA);
    if (sheet && sheet.getLastRow() > 1) {
      const matches = sheet.getRange(2,18,sheet.getLastRow()-1,1)
        .createTextFinder(token).matchEntireCell(true).findAll();
      if (matches.length) {
        const row = matches[0].getRow();
        const id = String(sheet.getRange(row,1).getDisplayValue());
        if (/^SG-[A-F0-9]{8}$/.test(id)) result = {token:token,ok:true,id:id};
      }
    }
  } catch (ignored) { /* Indisponibilidade temporária: responder não confirmado */ }
  return ContentService.createTextOutput(callback + '(' + JSON.stringify(result).replace(/</g,'\\u003c') + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
