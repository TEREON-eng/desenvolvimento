# TEREON X — Sugestões recebidas

Planilha oficial de recebimento:
https://docs.google.com/spreadsheets/d/1REYIoeYHOI7gbnggm8xQR77sd6V8VQtvFNFzUhTwUoE/edit

## Ativação da integração

1. Abra a planilha acima com a conta proprietária.
2. Extensões > Apps Script > substitua o código de Code.gs pelo conteúdo de `apps-script.gs` deste diretório.
3. Implantar > Nova implantação > tipo "Aplicativo da Web".
4. Selecione **Executar como: Eu** e **Quem tem acesso: Qualquer pessoa**. Autorize o aplicativo com a conta proprietária.
5. Copie o URL da implantação terminando com `/exec`.
6. Atualize `x/sugestoes-config.js` definindo `window.TEREON_SUGESTOES_ENDPOINT` como esse URL.
7. Acesse `/x/contribuir.html`, envie um item fictício e confirme que a nova aba mostra “Proposta recebida” e que uma nova linha aparece na aba Sugestões.
8. Marque a proposta fictícia como "Recusado" ou apague **apenas a linha de teste** depois de verificar a integração.

## Cuidados

- A planilha é privada; não compartilhe permissão de edição com visitantes.
- O endpoint público aceita propostas anônimas. Possível spam. Acrescentar proteção antiautomação e limite de envios antes de abrir amplamente.
- O Apps Script só escreve na aba Sugestões, nunca no Fichário Oficial.
- A aprovação/publicação é manual e feita pelo fundador.
- Em modo não configurado, o formulário registra propostas locais para exportação CSV; não as transmite.
- Em modo configurado, o navegador envia via POST e abre a confirmação numa nova aba. A tela de origem não declara envio bem-sucedido porque a confirmação acontece no Apps Script.
