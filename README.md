# TEREON X — Repositório independente

**Ambiente ativo:** TEREON X, sob `/x/`. A branch `desenvolvimento` recebe experimentos e testes; `main` recebe somente versões aprovadas. O endereço do Worker chamado `desenvolvimento` pode ser a **produção** do Cloudflare; não inferir ambiente pelo nome do hostname.

## Estrutura do código
- `x/index.html`: shell, telas de listas, persistência local e código de condutor legado de protótipo (a extrair gradualmente).
- `x/catalogo/motor.js`: leitura e normalização de fichas, condições, obrigatoriedade e nome técnico; sem DOM/armazenamento de listas.
- `x/catalogo/seletor.js`: interface do modal; salva exclusivamente por callback da Lista.
- `x/biblioteca/index.html`: apresentação de fichas; apenas consulta.
- `x/fichario-x/`: snapshots de testes, leitor e simulador isolado.
- `x/motor-compartilhar.js`: recebe snapshot da lista e gera formatos.
- `x/contribuir.html`: propostas e rascunhos, sem aprovação.
- `x/integracao-sugestoes/`: backend Apps Script documentado, separado do app.
- `x/sw.js`: cache PWA limitado ao escopo `/x/`.
- `assets/`, `vendor/`, `fonts/`: dependências estáticas necessárias ao X.

## Catálogo e homologação
O rótulo **Catálogo Oficial** indica a coleção/candidatos em estudo, **não uma certificação**. O catálogo de testes possui 24 entradas: 2 fichas reais em revisão e 22 hipotéticas. Nenhuma está homologada. Pendências permanecem visíveis; aprovação/publicação exige decisão explícita do responsável e mecanismo próprio (ainda não implementado). Não usar opções fictícias como especificações técnicas válidas.

## Documentação de referência
- [Arquitetura e contratos](x/ARQUITETURA-MODULAR.md)
- [Auditoria de independência dos motores](x/docs/AUDITORIA-MOTORES-2026-11-07.md)
- [Matriz de módulos e contratos](x/docs/MAPA-MODULOS.md)
- [Plano de testes e critérios de aceite](x/docs/TESTES-REGRESSAO.md)
- [Histórico técnico](x/docs/CHANGELOG.md)

## Segurança de evolução
1. Trabalhar apenas em `desenvolvimento`; não fazer merge na `main` sem revisão/testes.
2. Não editar arquivos de produção ou código do aplicativo antigo.
3. Salvar/capturar backup dos dados locais antes de alterações de armazenamento.
4. Registrar fatos verificados, limitações e riscos de cada revisão.


## Refatoração incremental x.0.3.7
O shell `x/index.html` agora contém apenas estrutura HTML e scripts ordenados. Estilos em `x/styles.css`, PWA em `x/pwa.js`, apresentação de listas em `x/listas/app.js`, operações em `x/listas/servico.js` e persistência em `x/listas/store.js`. A chave `tereon-x-lab-v1` foi preservada para manter listas históricas. Testes de contrato em `x/tests/modulos.test.cjs` e `x/tests/catalogo.test.cjs`, executados pelo GitHub Actions. Consulte a auditoria para limites conhecidos.

## Documentação TEREON X consolidada — 07/11/2026
- [Documento Mestre](x/docs/MESTRE-TEREON-X.md) e [Índice](x/docs/INDICE-DOCUMENTACAO.md)
- [Universo: gestão de obras](x/docs/PRODUTO-UNIVERSO.md)
- [Gratuito e pago: hipóteses](x/docs/MODELO-GRATUITO-PAGO.md)
- [História: Diário Volume 02](x/docs/HISTORIA-TEREON-X.md)
- [Identidade](x/identidade/README.md) e [Compartilhar entre contas](x/compartilhar-usuarios/README.md)
Os laboratórios novos não alteram o aplicativo principal nem a branch main. Universo, Solicitações e cobrança são propostas, ainda não funcionalidades implementadas.
