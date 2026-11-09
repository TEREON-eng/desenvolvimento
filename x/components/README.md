# Cabeçalho compartilhado — TEREON X

**Versão inicial:** x.0.3.18 (09/11/2026)

- `header.js`: único lugar que define a estrutura do cabeçalho. Recebe apenas `data-tx-header="main|module"`, `data-back-href` e `data-back-label` no elemento `<header>`. Não altera dados, listas, fichas ou permissões.
- `header.css`: visual compartilhado, escopo `.tx-global-header`. As folhas de estilo de cada módulo cuidam somente do conteúdo interno.
- `header-session.js`: apenas páginas independentes. Identificação informativa de sessão; leitura do cache local **não é autenticação**. A biblioteca do Supabase é usada para validação remota quando disponível. Não autoriza operações.
- `/x/status.js`: exibe conectividade do navegador e estado de identidade; no Início o estado é alimentado por `listas/auth.js`.

## Contrato de navegação
O cabeçalho sempre mantém TEREON X à esquerda e Minha conta / status à direita. **Voltar** aparece em uma linha separada, somente quando existe destino; na página inicial o botão Início permanece oculto. Cada módulo define seu retorno por atributos; não deve incorporar outro cabeçalho próprio.

O botão Instalar só é montado pelo componente no Início, e a lógica permanece em `pwa.js`.

## Critérios de evolução
1. Mudança no cabeçalho deve ser feita nos componentes, nunca por cópias de HTML ou regras globais conflitantes.
2. Não tocar nos modais aprovados, IDs de formulários, dados ou motores técnicos ao mudar o cabeçalho.
3. `node x/tests/cabecalho.test.cjs`, `node x/tests/modulos.test.cjs`, `node x/tests/status.test.cjs` e teste visual em dispositivo antes de aprovar.
4. Não usar status de rede ou cache de sessão para conceder acesso; autorização continua exclusivamente no Supabase/RLS.
5. Indicadores em páginas secundárias podem aguardar a validação de conta. A importação assíncrona de autenticação não deve bloquear o conteúdo da página.

**Limite:** a navegação visual foi padronizada no código. Ainda falta homologação visual em telas pequenas e verificação de desempenho da validação de sessão sob internet lenta.
