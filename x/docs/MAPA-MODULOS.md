# TEREON X — Mapa de módulos e contratos
Atualizado em 07/11/2026. Estado observado na branch `desenvolvimento`.

| Componente | Responsabilidade | Entrada/saída | Independência atual |
|---|---|---|---|
| Shell/listas `x/index.html` | navegação, listas, etapas, gravação | localStorage `tereon-x-lab-v1` | **Baixa**: mistura tela, estado, dados e protótipo fixo de condutor |
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
