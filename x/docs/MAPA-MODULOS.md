> **INVENTÁRIO PARA RETOMADA — 14/11/2026:** [Marco X.0.3.61](RETOMADA-TEREON-X-2026-11-14.md). A entrada natural de Condutores usa `interpretador-condutores.js` para levantar hipóteses, `confirmacao-rascunho.js` para conferir somente **tags aceitas ?→✓** contra as regras do catálogo, `voz-entrada.js` para transcrever a fala quando disponível e `listas/app.js` para montar o nome no primeiro nível e **Avançar** sem uma segunda área grande de confirmação. Nenhum desses módulos substitui quantificação ou autoriza fusão comercial. **Versão segue X.0.3.61**; esta é atualização documental.

> **INVENTÁRIO VIGENTE — 13/11/2026 · X.0.3.61:** acrescentado `x/catalogo/confirmacao-rascunho.js`, módulo puro que recebe **ficha + propostas + tags aceitas** e retorna `values/unapplied/ok`, usando `visibleDetails`, `optionStates` e `conflicts` do catálogo. `x/listas/app.js` controla o rascunho `intentSelected`, renderiza tags com ? ou ✓ no **primeiro nível da pesquisa**, forma nome técnico antes de avançar e transporta os valores após validação. Retirado `draftSuggestionsHTML` de dentro da ficha; a pesquisa continua recebendo texto ou transcrição do `voz-entrada.js`. `x/index.html` carrega o novo módulo antes de app; `x/sw.js` cacheia-o para o escopo X; `x/tests/busca-tags-inline.test.cjs` integra a regressão. `quantificacao.js`, persistência e relatórios sem alteração. [Piloto](PILOTO-BUSCA-NATURAL-VOZ-FOTO-2026-11-13.md).

> **INVENTÁRIO DE MÓDULOS — 13/11/2026 · X.0.3.60:** novos `x/catalogo/interpretador-condutores.js` (função pura `interpret(texto)`: `family/proposals/warnings`) e `x/catalogo/voz-entrada.js` (adaptador opcional da Web Speech API, `pt-BR`, início apenas por gesto, botão parar, erros e fallback). `x/listas/app.js` integra **campo de descrição + botão de microfone na escolha inicial de ficha**, apresenta sugestões e só aplica atributos após toque explícito e validação via `x/catalogo/motor.js`. `x/index.html` carrega ambos os módulos antes do app; `x/sw.js` inclui seus arquivos no cache do escopo `/x/`. `x/tests/interpretador-voz-condutores.test.cjs` foi acrescentado ao workflow. **Não** se trata de IA generativa ou análise de foto; esta será um canal futuro do mesmo contrato. `x/listas/quantificacao.js`, sincronização e relatórios não foram alterados. CI integral, deploy e navegador móvel pendentes. [Registro técnico](PILOTO-BUSCA-NATURAL-VOZ-FOTO-2026-11-13.md).

> **INVENTÁRIO VIGENTE — 12/11/2026 · X.0.3.51:** `x/catalogo/motor.js` carrega `fichas-lab-2026-11-12.json` no laboratório, preservando o snapshot `fichas-drive-2026-11-08.json` como origem histórica; `x/listas/app.js` usa seletor de unidade por tipo em `FT_INFRA-001`, sem duplicar pergunta técnica; `x/motor-compartilhar.js` mantém `model/text/open` e expõe `sections/subject` para construir relatórios por finalidade e canal sem alterar a lista; `x/sw.js` pré-carrega o snapshot LAB. Os níveis de maturidade e débitos descritos abaixo são fotografias anteriores, não evidência de homologação. [Rodada atual](REVISAO-ELETRODUTO-E-RELATORIOS-2026-11-12.md).

# TEREON X — Mapa de módulos e contratos

> **MATURIDADE ATUAL — 10/11:** este inventário inclui estados de datas diferentes. Prioridade para 17/11: **Listas + Fichas/Catálogo + especificação + compartilhamento**. Obras, Diário, Empreiteiros, Escopo e PDF diário são laboratórios paralelos. [Estado vigente](ESTADO-VIGENTE-10-11-2026.md) · [Superauditoria](SUPERAUDITORIA-TEREON-X-2026-11-10.md).

Base histórica de 07/11/2026; **situação atual de 09/11/2026 no adendo final**. Branch `desenvolvimento`.

| Componente | Responsabilidade | Entrada/saída | Independência atual |
|---|---|---|---|
| Shell/listas `x/index.html` | estrutura de navegação e ordem de scripts | `x/listas/app.js` e módulos injetados | **Parcial**: extrações feitas; `app.js` ainda concentra UI/navegação e edição legada |
| Catálogo `x/catalogo/motor.js` | carregar/normalizar fichas e avaliar regras | `load/list/get/visibleDetails/missing/technicalName` | **Boa**, porém usa URL JSON fixa e contrato global |
| Seletor `x/catalogo/seletor.js` | modal de especificação | `TereonXCatalogUI.open({item,onSave})` | **Parcial**: depende de DOM próprio + motor global |
| Biblioteca `x/biblioteca/index.html` | consultar fichas | `TereonXCatalog.load()` | **Parcial**: lógica de apresentação inline |
| Fichário `x/fichario-x/leitor.js` | interpretar snapshot de fichas | `load/normalize/splitValues` | **Boa**, mas tem normalização paralela à do catálogo |
| Simulador `x/fichario-x/simulador.js` | demonstração independente | JSON próprio | **Boa**, mas usa uma regra de condição simplificada diferente |
| Compartilhar `x/motor-compartilhar.js` | modelar/exportar lista | `TereonXShare.open(list),model,text` | **Boa**, mas contrato de entrada não versionado e canais incompletos |
| Contribuições `x/contribuir.html` | rascunho/envio | armazenamento próprio + Apps Script | **Parcial**: lógica e UI no mesmo HTML |
| PWA `x/sw.js` | atualização/cache | `/x/` | **Parcial**: pré-cache, navegação e fallback exigem teste offline |

## Fluxo-alvo
`Fichário (fonte) → Catálogo (modelo técnico) → Seletor (UI) → Lista (persistência)`. A Biblioteca consome o mesmo modelo de leitura. Compartilhar recebe um snapshot independente da lista. Contribuições nunca alteram fichas publicadas diretamente.

## Contratos obrigatórios
- **Catálogo:** nunca escreve em listas, não acessa DOM e retorna campos com identificação estável, opções, condição, obrigatoriedade, status e pendências.
- **Seletor:** só confirma valores clicados pelo profissional; entrega `{catalogId,name,values,qty,unit,stage,fichaStatus,simulacao}` ao callback; não grava.
- **Lista:** é a única dona dos lançamentos e etapas; duplicar/editar/apagar devem preservar IDs e evitar alterações indiretas.
- **Biblioteca:** somente leitura; nenhuma ficha é homologada pela exibição.
- **Compartilhar:** apenas leitura; deve receber cópia imutável/versionada no contrato futuro; não modifica o catálogo.
- **Contribuições:** propostas são rascunhos, não publicação oficial.
- **PWA:** não apagar dados de usuários nem caches de aplicações alheias.

## Decisões
1. **Catálogo Oficial** é o nome da coleção; não indica homologação.
2. As 24 fichas podem aparecer com pendências para **simular** listas.
3. O fichário hipotético nunca fornece dados técnicos homologados.
4. A aprovação/publicação será processo explícito, não inferido apenas do campo `status`.
5. Não criar wrappers de funções globais para interligar módulos.


## Evolução implantada — x.0.3.7
| Módulo | Função | Dependência permitida |
|---|---|---|
| `x/index.html` | shell HTML e ordem de scripts | scripts e estilos declarados |
| `x/styles.css` | estilo do shell e modal histórico | nenhuma lógica JS |
| `x/listas/store.js` | leitura/gravação atômica em `tereon-x-lab-v1` | storage injetável |
| `x/listas/servico.js` | CRUD de listas, etapas e itens; validação; snapshots | repositório injetado |
| `x/listas/app.js` | navegação e UI das listas | API `TereonXLists.create`, seletor e compartilhador |
| `x/pwa.js` | instalação e ciclo de vida PWA | DOM de instalação, `sw.js`, `version.json` |
| `x/catalogo/motor.js` | regras técnicas e fonte de fichas | JSON de laboratório |
| `x/catalogo/seletor.js` | UI da seleção de características | motor catálogo + callback `onSave` |
| `x/biblioteca/index.html` | consulta às fichas | motor catálogo |
| `x/motor-compartilhar.js` | exportação e envio | snapshot independente de lista |
| `x/contribuir.html` | rascunhos e envio de sugestões | integração Apps Script |

**Fluxo de escrita:** UI `app.js` → `servico.js` → `store.js` → `localStorage`. A UI não escreve diretamente. O seletor só retorna `entry` via callback; o serviço grava. O Compartilhador recebe cópia criada por `exportList`.

**Contrato público do motor de listas (v1):** `TereonXLists.create(repository, options?)` retorna `snapshot/get/createList/upsertItem/duplicateItem/removeItem/exportList`. O repositório v1 oferece `snapshot/save`. O serviço aplica as mutações em cópia, valida e só atualiza estado após escrita bem-sucedida.

**Preservação de dados:** nome da chave no navegador é `tereon-x-lab-v1`. Sem migração destrutiva; leitura inválida bloqueia gravações e exibe erro em vez de sobrescrever listas.

**Limitação:** a apresentação e navegação ainda estão juntas em `app.js`; a ficha histórica de condutor continua nesse adaptador apenas para editar registros antigos. Não removê-la antes de migrar esses registros. Esta estrutura é evolução modular parcial, não independência absoluta de todas as telas.

## Complemento atual — laboratórios 07/11/2026
| Motor | API/dados | Estado |
|---|---|---|
| Identidade `x/identidade/auth.js` | cadastro, login, sessão, perfil, senha | testado nos fluxos básicos pelo fundador; reset e-mail pendente |
| Compartilhar usuário `x/compartilhar-usuarios/motor.js` | snapshot, envio, recebimento, aceite, recusa, revogação | implementado, ainda sem teste entre duas contas |
| Supabase `x_profiles`, `x_workspaces`, `x_workspace_members`, `x_works`, `x_work_access`, `x_list_shares` | RLS, dados separados | criado, obras/equipes sem fluxo funcional |
| Universo / Obras | gestão de obras e vínculos | conceito; não implementado |
| Solicitações | aprovação, compra, recebimento | conceito; não implementado |
| Plano comercial/cobrança | direitos de módulos pagos | conceito; não implementado |

Não confundir Compartilhar texto/PDF, Compartilhar entre contas, e Solicitar materiais. Redesenho visual não modifica motores nem contratos. Consulte o Mestre e Universo no índice.

## Novo motor independente — Obras (Universo v1)
`x/universo/obras/motor.js`: contrato `TereonXWorks.create(client)`, métodos `spaces/createSpace/list/createWork/updateWork/archive`, sem DOM, sem referências às Listas. `x/universo/obras/lab.html` é a apresentação de laboratório. `x_works` pertence a `x_workspaces`; só proprietário do espaço administra na primeira versão. RLS existente e grants por coluna aplicados ao Supabase; acesso como colaborador será outra etapa. `x/tests/obras.test.cjs` incorporado ao CI. Não implementa Solicitações, Diário nem acesso de equipes.

## Central de Laboratórios — acesso mobile (08/11/2026)
`x/laboratorios/index.html`: ponto de entrada simples, responsivo, somente links para Canivete X, Motor de Obras, Identidade e Compartilhamento entre Usuários. Não importa serviços entre si, não migra dados e não altera o app principal. Motor de Obras v3 ganhou `listAll()` (espacos próprios) e datas previstas por obra; segue sem dependência de outros motores.

## Identidade persistente de Listas (08/11/2026)
`x/listas/servico.js` v2 adiciona `recordUid` UUID seguro a novas listas e `ensureRecordUid` explícito para legadas. Chave do repositório `tereon-x-lab-v1` inalterada. `x/relacoes/origem-listas.js` liga o contrato local de Listas ao formato do Motor de Relações, sem conexão remota; `remoteLinkAllowed:false` até resolver sincronização, identidade do usuário e permissões por obra. Não existe vínculo funcional Lista–Obra ainda.

## x.0.3.8 — uma interface com dois adaptadores de persistência
`x/listas/app.js` continua única interface e recebe `TereonXLists.create(repository)`, usando `x/listas/store.js` local quando sem login ou `x/listas/integracao.js` (cache por conta + `x/listas/nuvem/motor.js`) quando autenticado. O Motor de Especificação e o Catálogo permanecem separados e não sabem se o dado foi salvo local ou remoto. O `recordUid` é o UUID de origem da lista na nuvem; `id` local é preservado e não precisa ser igual. A troca de conta interrompe integração anterior, não transfere dados sem autorização. A interface indica sincronização pendente/conflito.
Ainda não há regras de planos, sincronização de equipes, associação de obras, motor de permissões comerciais, resolução automática de conflitos ou teste real multiusuário. Laboratório online separado permanece apenas diagnóstico.

## x.0.3.11 · Fichário conecta o modal existente
`x/listas/app.js` mantém `addDialog` como única UI de entrada e edição. Dentro desse modal ele usa `TereonXCatalog.load/list/get/visibleDetails/missing/technicalName/applyRule` de `x/catalogo/motor.js`, agora alimentado por `x/fichario-x/fichas-drive-2026-11-08.json` (snapshot das seis abas reais do Fichario.xlsm). Ao salvar, `lists.upsertItem` recebe o mesmo lançamento com `catalogId` e características confirmadas. `x/listas/integracao.js` continua responsável pela persistência local/nuvem, sem acesso ao catálogo. O antigo `x/catalogo/seletor.js` ainda está no repositório como laboratório, mas não é o fluxo principal. Nenhuma sincronização automática com o Drive: atualizar o snapshot e executar testes sempre que a fonte for revista.

## Estado vigente x.0.3.29 — revisão 09/11/2026
| Componente | Responsabilidade real e contrato | Limites |
| --- | --- | --- |
| `x/index.html`, `x/components/header.js`, `x/appearance.js` | Shell, caminhos e temas globais; cabeçalho com nome e ON/OFF da rede | Não atestam sincronização; páginas auxiliares podem ter CSS próprio |
| `x/listas/store.js` | Repositório `snapshot/save`; chave guest `tereon-x-lab-v1`; cache da conta por chave injetada | Nenhum acesso a catálogo/DOM; nunca limpar dados sem migração |
| `x/listas/servico.js` | `createList/renameList/duplicateList/removeList/get/exportList/ensureRecordUid/upsertItem/duplicateItem/removeItem/snapshot` | Só opera repositório; duplicação gera `id`/`recordUid` novos, não replica versão na nuvem |
| `x/listas/integracao.js` + `nuvem/motor.js` | Repositório único para conta autenticada; `refresh/flush/status/deleteList`, versão/conflitos e checagem de proprietário/versão | Falha de comunicação mantém cache. Teste entre aparelhos e autorização A/B ainda pendente |
| `x/listas/app.js` | Apresentação de Listas, modais, seleção individual, ações editar/duplicar/compartilhar/excluir, status individual | Seleção em lote NÃO tem operação real; parte do legado de condutor ainda vive aqui |
| `x/catalogo/motor.js` + snapshot de seis fichas reais | Fonte técnica, condicionais, tags e composição de nomes | Todas em revisão; não homologadas. Snapshot exige atualização explícita ao mudar o Drive |
| `x/motor-compartilhar.js` | Snapshot para WhatsApp/texto/e-mail/PDF | Divergência conhecida do contrato-alvo de formatos/perfis; não altera a origem |
| `x/universo/obras/`, `x/compartilhar-usuarios/` | Laboratórios isolados de Obras e cópia entre contas | Não são ciclo de compra ou aprovação; testes multiusuário pendentes |
| `x/sw.js`, `x/pwa.js`, `x/version.json` | Cache e versão do PWA | X.0.3.29 alinhada no código; deploy e SW real não comprovados |

**Estados:** Local/Sincronizada/Pendente de envio/Conflito pertencem à persistência; aprovação, compra, recebimento e parciais serão do **Motor de Solicitações**, não do serviço de Listas. Não transformar seleção de múltiplas listas em aprovação silenciosa.

**Não regressão:** `#addDialog` congelado na fixture X.0.3.4. CI inclui `x/tests/contratos-fechamento-2026-11-09.test.cjs` para proteger estrutura, ações e versões; resultado de execução atual ainda precisa ser coletado. Ver [Revisão geral](REVISAO-GERAL-CONTRATOS-2026-11-09.md).
