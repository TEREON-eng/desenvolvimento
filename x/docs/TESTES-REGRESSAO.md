# TEREON X — Matriz de testes e aceite

> **ORDEM DOS TESTES — 10/11:** primeiro eliminar riscos ao **uso do núcleo de Listas no campo em 17/11** (modal, fichas, persistência, compartilhamento, celular, CI/deploy). Registros de teste de gestão são laboratório, não pré-requisito do teste de Listas. [Plano operacional](FOCO-TESTE-CAMPO-17-11-2026.md).

Base de 07/11/2026 · complementada em 09/11/2026. Não marcar como aprovado sem evidência observada.

## Automáticos (lista histórica de cobertura; workflow atual indicado no fechamento)
- Sintaxe de todos os scripts `.js` do X e dos scripts inline.
- `catalogo.load()`: carrega 24 entradas de teste, preserva pendências, não homologa automaticamente, IDs internos únicos.
- Condições: `Sempre`, `Rígido+Aço`, `Rígido+PVC`, casos incompletos e regras desconhecidas.
- Validação: obrigatórios pendentes, opcionais, campos sem opções, quantidade inválida e etapa vazia.
- Contrato do seletor: chama `onSave` uma vez; não toca diretamente em localStorage.
- Regressão das listas: criar, adicionar, editar, duplicar, apagar, reabrir, compartilhar; manter dados históricos.
- Resiliência: falha de fetch JSON, falha de localStorage, arquivos em cache antigo.
- Segurança de publicação: nenhuma ficha é aprovada automaticamente pela consulta ou seleção.

## Manuais de navegador
1. Abrir a Preview da branch `desenvolvimento`; confirmar endereço **Preview** e não URL da `main`.
2. Biblioteca → Fichas Técnicas: 24 fichas, status e pendências visíveis.
3. Listas → Adicionar item: materiais da coleção, tags selecionadas, nome formado, quantidade/unidade/etapa.
4. Eletroduto: testar condição Rígido + Aço, Rígido + PVC, Flexível + PEAD e estados incompletos.
5. Condutor: testar seleção, remoção repetida de tags e edição após salvar.
6. Testar uma ficha hipotética e confirmar aviso de dados fictícios.
7. Lista: duplicar, editar, excluir; verificar persistência após recarga.
8. Compartilhar: texto, e-mail e PDF, verificando conteúdo e arquivo resultante.
9. PWA: instalar, atualizar, navegar offline e recuperar após retorno da rede.
10. Contribuições: validar confirmação do Apps Script na nova origem Cloudflare.
11. Móvel: fluxo em teclado real, modal, rolagem e tags em duas ou mais linhas.
12. Falha de rede e erro de armazenamento: mostrar erro sem declarar sucesso.

## Regra para promover à main
Revisão técnica + testes isolados + testes de contrato + regressão crítica + aceite no celular + aprovação expressa. Um deploy “Ready” confirma publicação, **não** a correção funcional.


## Situação dos testes automatizados em 07/11/2026
Foi adicionado `x/tests/catalogo.test.cjs` (Node.js 22, sem dependências) e workflow `.github/workflows/testes-tereon-x.yml` para push em `desenvolvimento` e PR para `main`. Na checagem imediatamente posterior, a API de Actions ainda retornava **0 execuções**. O teste permanece **não comprovado no CI**. A checagem isolada anterior do motor em ambiente de avaliação JavaScript carregou 24 fichas e verificou obrigatoriedade/condições básicas. Executar o script pelo GitHub Actions antes de homologar.


## Confirmação posterior do GitHub Actions
Em 07/11/2026, o workflow **TEREON X - testes do catálogo** executou com sucesso para o commit `78628c4` (run 42427001982). O escopo validado é o contrato do motor de catálogo; UI, PWA, integração externa e testes reais permanecem pendentes.


## Testes adicionados em x.0.3.7
O workflow `.github/workflows/testes-tereon-x.yml` agora executa:
1. `node x/tests/catalogo.test.cjs` — integridade e contratos de fichas.
2. `node x/tests/modulos.test.cjs` — armazenamento, CRUD de listas, dados históricos, módulos separados, sintaxe JS, ordem de carregamento.

Esses testes **não** reproduzem interações reais no modal, edição móvel, atualização do service worker ou exportação PDF. O teste manual antes de `main` deve criar lista, adicionar dois materiais distintos, editar, duplicar, remover, voltar, recarregar e confirmar persistência, Biblioteca e PWA. Testar erro de armazenamento e comportamento offline.

## Adendo: identidade e compartilhamento (07/11/2026)
- Workflow contém testes catalogo, modulos, identidade e compartilhar-usuarios; execução mais recente não verificada nesta consolidação.
- Testados pelo fundador: cadastro, confirmação, sessão após recarga, logout/reentrada, perfil e troca de senha autenticada. Reset via link ainda não homologado.
- Compartilhamento não testado com segunda conta; validar envio A→B, aceite/recusa, revogação, bloqueio por RLS para A/B/C, inexistência de alteração na lista original e erros de rede.
- Usuário sem sessão deve ver ligação para login (não Auth session missing).
- Antes de redesenhar CSS/HTML, repetir toda sequência funcional de Listas e modal de especificação; layout não pode modificar contrato do motor.
- Universo: validar isolamento de espaços e obras, convites revogáveis e níveis de permissão antes da integração com aplicativo principal.

## Motor de Obras — laboratório v1
1. Sem sessão: link para Identidade e nenhuma leitura/gravação indevida.
2. Criar espaço pessoal; criar espaço organização; alternar e verificar que obras são distintas.
3. Criar obra; editar nome, descrição e status; arquivar e reativar; atualizar navegador e confirmar persistência.
4. Testar títulos inválidos, descrições longas, mensagens de erro e escrita negada.
5. Com segunda conta (quando SMTP liberar), garantir que obra de outro espaço não é lida nem alterada, inclusive por acesso direto com UUID.
6. Testar mobile/desktop e confirmar que Canivete, Listas e sua chave local não foram alterados.
7. `node x/tests/obras.test.cjs` no workflow GitHub Actions — execução ainda precisa ser verificada.

## Revisão v2 do laboratório de Obras
- Conferir tema claro no celular e desktop, alinhamento de modais e funcionamento de abertura, cancelamento e salvamento.
- Criar espaço pessoal e espaço de organização; editar o **nome**; tentar alternar de espaço e confirmar dados isolados.
- Criar/editar obra; usar **Excluir**; conferir desaparecimento da lista normal, presença na Lixeira e restauração; arquivamento continua diferente de exclusão.
- Excluir espaço e restaurar; obras anteriormente vinculadas devem reaparecer; nenhuma gravação de Listas deve sofrer alteração.
- Validar que conta estranha não consegue alterar `deleted_at` nem nome/descrição da obra fora de seu espaço; teste cruzado ainda pendente.
- Validar o fluxo em Preview e o GitHub Actions antes de promover à main. Não declarar homologado por apenas passar teste simulado.

## Central mobile e filtro Todos — 08/11/2026
- Abrir `/x/laboratorios/` no Preview verdadeiro de desenvolvimento no celular; verificar links para Canivete X, Obras, Minha Conta e Compartilhar Listas.
- No Universo, escolher `Todos os espaços`: conferir contagens e obras somadas; cada cartão indica seu espaço; tentar editar/excluir espaço com `Todos` e verificar ações desabilitadas.
- Criar obra no filtro Todos escolhendo destino no modal; verificar que somente o espaço escolhido recebe a obra.
- Incluir datas previstas de início/término, salvar, reabrir edição e confirmar persistência; testar término anterior ao início (deve falhar).
- Filtrar individualmente cada espaço, depois voltar a Todos; arquivar/excluir/restaurar uma obra sem interferir nas outras.
- Validar responsividade e fluxo com conta autenticada; CI e navegador ainda requerem confirmação.

## Pente-fino da Central — 08/11/2026
- Na Central, há três cards (Canivete, Universo, Compartilhar) e Perfil como ícone no canto.
- Em Canivete, Universo, Compartilhar e Conta há retorno visível à Central; o botão Início interno do Canivete mantém seu comportamento original.
- Conta e Compartilhar usam fundo claro e controles consistentes; identidade, compartilhamento, formulários, IDs e callbacks permanecem intactos.
- Conferir no celular a legibilidade dos cabeçalhos e a capacidade de navegar de ida e volta sem perder sessão ou listas locais.
- O arquivo de testes de Obras agora faz validações estáticas desses links/temas; foi simulado com sucesso, execução do CI e navegador pendentes.

## Entrada principal de Listas e navegação PWA
- Abrir `/x/laboratorios/` no celular: **Minhas listas** e **Criar lista** são as duas primeiras ações; Perfil no canto.
- Minhas listas deve ir direto à relação de listas locais existentes no mesmo navegador, sem apagar ou migrar dados.
- Criar lista deve abrir diretamente o modal de nome no laboratório atual, salvar e aparecer na lista anterior.
- Canivete exibe calculadoras *em preparação* (não botão funcional enganoso). Escola oferece Biblioteca real. Universo e Compartilhar mantêm links.
- Abrir ícone da PWA após atualização do manifesto: deve chegar à Central; instalação antiga pode necessitar atualizar/reinstalar conforme navegador.
- A existência de obra no Supabase **não** vincula automaticamente lista local; nenhum registro adicional deve ser criado. Teste navegador ainda necessário.

## Identidade e Relações — fundação v1
- Rodar `node x/tests/relacoes.test.cjs` no GitHub Actions e localmente.
- Verificar no Supabase que ambas as tabelas estão com RLS e grants mínimos.
- Logado em conta A, registrar identidade de obra de espaço A; repetir e conferir mesmo identificador.
- Conta B deve ser incapaz de ler/registrar identidade de obra de A; sem ligação cruzada de identidades.
- Encerrar uma relação e confirmar que ela permanece no histórico, mas não é retornada no filtro ativo; tentar reabrir/regravar deve ser negado.
- Tentar registrar tipo `list` antes da sincronização e garantir rejeição; não pode existir referência fantasma.
- Conferir que o cadastro de obras e as listas locais funcionam sem depender do novo motor.
**Testes de sessão/RLS multiusuário e navegador ainda pendentes.**

## Identidade local de Listas — 08/11/2026
- Lista nova recebe UUID em `recordUid` mantendo o ID de navegação pré-existente.
- Lista antiga abre sem qualquer escrita automática; ao preparar explicitamente identidade, conserva ID original, etapas, itens, quantidades e ficha técnica.
- Preparação repetida retorna mesmo identificador; recarregar navegador mantém o UUID.
- Falha de armazenamento não altera lista em memória nem grava parcialmente.
- Adaptador de origem `x/relacoes/origem-listas.js` retorna `synchronized:false` e `remoteLinkAllowed:false` até existir sincronização.
- Compartilhamento de snapshot não deve transmitir a mesma identidade técnica como se a cópia fosse o mesmo objeto.
- Testes simulados executados; testar em navegador com listas reais e entre dispositivos antes de vincular a Obra.

## Listas na Nuvem — laboratório v1 (08/11/2026)
- Abrir Central e link `Testar listas na nuvem`; entrar com conta TEREON.
- Criar lista com nome, adicionar material e salvar; recarregar e confirmar conteúdo.
- Abrir a mesma conta em outro aparelho/aba no domínio de desenvolvimento e recuperar os mesmos dados.
- Testar edição conflitante: salvar alterações concorrentes no aparelho A, depois tentar salvar edição com versão antiga no B — deve bloquear com mensagem clara, sem sobrescrever.
- Testar sem conta: não pode listar ou salvar dados.
- Testar conta B: não pode visualizar ou editar listas da conta A. O mesmo vale para identidade do tipo `list` no Motor de Relações.
- Confirmar que Canivete continua com listas locais intactas e que a versão de UI online não usa os dados locais automaticamente.
- Auditoria SQL confirma RLS habilitada e `record_type` permitido `work/list`; teste real de isolamento e navegador ainda necessário.

## Aceite — interface única de Listas x.0.3.8
- Sem login, abrir **Minhas listas / Criar lista**, selecionar materiais e confirmar: o fluxo deve funcionar localmente e avisar **Salvo neste aparelho**.
- Entrar na conta pela mesma Central e voltar às listas: a mesma tela deve mostrar listas online, inclusive listas anteriores criadas no laboratório `/x/listas/nuvem/lab.html`; o modal técnico existente deve continuar funcional.
- Criar lista autenticado, adicionar dois materiais com opções/tags, editar, duplicar e remover; verificar atualização online após sincronização.
- Em outro aparelho com a **mesma conta**, abrir **Minhas listas** e verificar os mesmos itens. Se houve atualização em um aparelho, usar **↻ Atualizar** no outro.
- Em duas contas diferentes, jamais misturar caches, listas nem remeter dados avulsos automaticamente.
- Usuário com listas avulsas pode clicar **Trazer listas deste aparelho para minha conta**; copiar só mediante confirmação e preservar origem.
- Cortar rede depois do carregamento da sessão: novas alterações devem permanecer em cache com indicador pendente. Reconectar e verificar envio.
- Conflito: editar simultaneamente nos dois aparelhos. Salvar no primeiro e depois no segundo; preservar edição local e bloquear sobrescrita na nuvem, com aviso. Resolução/mesclagem automática **não implementada**.
- Atualização PWA: x.0.3.8, novos JS no SW; não limpar dados de outros apps.
- Testes de contrato simulados passaram, incluindo `x/tests/listas-integracao.test.cjs`; **teste manual com aparelhos reais e consulta posterior da tabela ainda obrigatório**.

## Falha reportada — modal de adicionar item (08/11/2026)
> **HISTÓRICO / SUPERADO:** os passos abaixo que citam `txCatalogDialog` descrevem a tentativa anterior e **não devem ser executados como roteiro vigente**. Em X.0.3.29, o contrato é `#addDialog` → `openAdd()` → `pickFirstMissing()`, conforme seção “Bloqueio obrigatório — modal de adicionar materiais X.0.3.4” e [Contratos vigentes](CONTRATOS-VIGENTES.md).
- A Central deve conduzir a `/x/?view=lists` ou `/x/?view=create`, e não ao laboratório básico da nuvem.
- A URL antiga `/x/listas/nuvem/lab.html` sem parâmetros deve encaminhar para `/x/?view=lists`; `?diagnostico=1` preserva somente acesso técnico.
- Em lista nova e existente, selecionar **Adicionar item** deve abrir o modal do Catálogo (`txCatalogDialog`), nunca abrir formulário avulso nem trocar de página.
- Dentro do modal, verificar busca, opções condicionais, formação do nome técnico, tags escolhidas e bloqueio de Adicionar antes de obrigatórios.
- Salvar, editar item e recarregar a mesma lista, tanto com conta quanto em modo avulso. A gravação da nuvem não pode substituir o modal.
- Validar no celular e no PC no mesmo domínio Preview (e recarregar/atualizar PWA). Verificação visual não executada aqui.

## Aceite do modal de Lista — x.0.3.9
1. Na central, entrar em **Minhas listas**, tocar numa lista; ela deve abrir sobre a tela anterior e mostrar **← Minhas listas** e **✕**.
2. Fechar por ambos os controles e, no desktop, por Escape: deve retornar à mesma relação de listas, sem recarregar a página.
3. Abrir a lista novamente, tocar **Adicionar item**; deve abrir **o modal técnico do catálogo**, com escolhas condicionais e validação de obrigatórios. Salvar e confirmar que o material aparece no modal da lista.
4. Editar/duplicar/remover material e conferir atualização na lista sem fechar o modal.
5. Criar uma lista a partir de **Criar lista** na Central; após criar, o detalhe deve abrir como modal sobre **Minhas listas**.
6. Com login, repetir no PC e no celular e conferir sincronização sem substituição da interface.
7. Confirmar que modal de lista e modal de catálogo não bloqueiam os botões um do outro nem causam rolagem inesperada.
**Executado:** regressão estática de Listas, persistência e rotas passou. **Pendente:** validação visual/tátil em navegador real.

## Bloqueio obrigatório — modal de adicionar materiais X.0.3.4 (08/11/2026)
- Referência congelada: histórico `jhcolba-del/tereon` commit `9e762fa`, `x/index.html`; snapshot `x/tests/fixtures/modal-adicionar-aprovado-x034.html`.
- **Contrato CI:** o `addDialog` atual deve corresponder integralmente ao HTML aprovado; o botão **Adicionar item** deve invocar `openAdd()`, abrir `addDialog.showModal()`, utilizar o Motor Único `lists.upsertItem` e manter sequência `pickFirstMissing()`.
- No PC e no celular, abrir **Minhas listas → lista (modal) → Adicionar item (modal)**; verificar nome técnico, tags e botões com as mesmas dimensões/posições previstas. Selecionar características na sequência, remover duas tags e conferir retomada da primeira obrigatória pendente.
- Preencher quantidade/unidade/etapa; confirmar que botão Adicionar fica desabilitado até todas obrigatórias. Salvar, verificar na lista e na nuvem, fechar e reabrir.
- **Status:** comparação de código e testes de contrato aprovados. Teste visual e ponta a ponta em dois aparelhos pendentes. Teste de estrutura não substitui teste de comportamento no navegador.

## Aceite — fichas do Drive no modal de adicionar (x.0.3.11)
1. Na Preview de desenvolvimento, abrir **Minhas listas → uma lista → Adicionar item**. O mesmo modal aprovado deve listar as seis fichas reais e oferecer busca, sem abrir outra tela ou seletor antigo.
2. Escolher **Eletroduto → Rígido → PVC**: selecionar detalhes do PVC de acordo com a condição da ficha; não mostrar opções condicionais de Aço. Remover a tag PVC; o fluxo deve voltar à característica obrigatória pendente, e Adicionar deve bloquear até revalidar.
3. Escolher Condutor elétrico; confirmar Tipo e Material, observar os detalhes opcionais da ficha atual. Não assumir como homologada ficha `Em revisão`.
4. Escolher Curva para eletroduto, Conectores, Abraçadeiras e Caixa de passagem; conferir nomes/códigos e opções contra planilha. A ficha Abraçadeiras tem nome B5 divergente, pendência expressa.
5. Salvar item: lista deve guardar `catalogId`, tags `values`, quantidade, unidade, etapa e nome técnico. Fechar e reabrir; editar o mesmo item. Materiais antigos sem catalogId ainda devem abrir seu fluxo de edição pré-existente.
6. Testar com conta e sem conta, no celular e no PC; verificar sincronia somente após estado **Salvo na nuvem**. Conferir abertura de dois modais sobrepostos, rolagem e teclado.
7. **Execução automatizada:** `x/tests/modal-fichas.test.cjs` cobre escolha, condição, tags, bloqueio, gravar, editar e legado; `x/tests/catalogo.test.cjs` verifica seis fichas, condições e aviso de revisão. **Teste real de navegador pendente.**

## Aceite — refinamento do modal x.0.3.12
- Abrir lista → **Adicionar item**: a barra **Buscar material ou família** deve rolar junto com os cartões de fichas; não é fixa, não deve encobrir o conteúdo.
- Durante a pesquisa de materiais, o rodapé de quantidade/unidade/etapa e tags fica recolhido, permitindo aproveitar a altura do modal. Após selecionar uma ficha, o rodapé volta.
- Selecionar **Eletroduto**. Ao lado de **Tipo**, verificar tag discreta **Eletroduto ×**; a tag não deve aparecer como uma opção de detalhe nem consumir a primeira linha de escolhas.
- Tocar na tag: deve voltar à busca de fichas, limpar apenas a especificação em andamento, desabilitar Adicionar, sem modificar o material salvo. Escolher outra ficha e confirmar detalhes obrigatórios.
- Remover uma tag técnica obrigatória: deve voltar ao primeiro detalhe pendente, mantendo o conjunto restante de escolhas válidas.
- Salvar/editar material e verificar valores e etapas no Motor Único, sem alterar sincronização. **Teste de DOM simulado aprovado; inspeção visual em celular e desktop ainda pendente.**

## Aceite — Início, criação direta e Escola (x.0.3.14)
1. Instalar/abrir PWA sem parâmetros: deve abrir **Início**, nunca Minhas listas. A URL `/x/laboratorios/` também deve encaminhar a `/x/`.
2. Abrir **Criar lista** no Início: a tela inicial deve permanecer ao fundo, com `createDialog` aberto. Salvar e confirmar abertura do modal da lista sobre Início. Fechar: retorna ao Início com contagem atualizada.
3. Abrir **Minhas listas**, depois criar/abrir lista: fechar o modal volta à relação de listas, não ao Início. O botão do cabeçalho Início retorna à página inicial sem recarregar.
4. Em lista, **Adicionar item** mantém `addDialog` aprovado com as seis fichas atuais, tags, nome técnico, condicionais e gravação. Testar com conta e modo avulso.
5. Início → Escola → Biblioteca → **Fichário de Fichas Técnicas** → ficha → fechar → Biblioteca → Escola → Início. Nenhuma rota deve pular a Escola.
6. No mesmo navegador alternar conta A e B: listas da A não podem aparecer na B; sessão B não pode escrever registros A. Repetir em dois aparelhos, com conteúdo distinto e sincronização.
7. Dimensionamento e Canivete mostram **Em preparação**; Universo mantém acesso à tela de obras e não exige lista.
**Automatizado:** `home-navigation.test.cjs` (DOM simulado) e `modal-fichas.test.cjs` passaram. **Pendente:** inspeção visual real e teste com duas sessões autenticadas.

## Aceite — auditoria + teclado (x.0.3.15)
- No celular com teclado virtual aberto, tocar Criar lista: cabeçalho, campo Nome e botão Criar devem permanecer acessíveis; dialog ancorado próximo do topo, rolagem interna se necessário. Testar pelo menos Chrome Android e Safari iOS quando disponíveis.
- Fechar e reabrir Criar lista; confirmar que retorna ao Início, não muda quantidade nem duplica salvamento.
- Abrir lista e modal de Adicionar: conferir que nome técnico, tags, seleção progressiva e botões continuam nas posições aprovadas.
- Executar `node x/tests/independencia.test.cjs` no CI com demais testes e validar ao menos dois dispositivos/contas.
- Casos de acesso negado A↔B e cache após troca de conta são **pendentes**, apesar de RLS habilitada.

## Fechamento de regressão X.0.3.29 — roteiro de execução (09/11/2026)
**Regra de precedência:** executar este roteiro de fechamento e [Contratos vigentes](CONTRATOS-VIGENTES.md); seções antigas permanecem para rastreabilidade e não autorizam reintroduzir modal ou navegação rejeitados.
**Automação configurada:** workflow `.github/workflows/testes-tereon-x.yml` (push em `desenvolvimento`, PR para `main`) contém testes de catálogo, módulos, identidade, compartilhamento, obras, relações, nuvem/conflitos, modal/fichas, navegação, estados, aparência, perfil/cabeçalho, breadcrumb e independência. Adicionado teste `x/tests/contratos-fechamento-2026-11-09.test.cjs` para invariantes do cartão, modal, persistência e versão do PWA. **Status real da execução mais recente NÃO CONFIRMADO**; consulta ao status combinado retornou lista vazia; verificar a página Actions e logs antes de afirmar CI verde.

**Sequência manual mínima, em uma lista de TESTE**:
1. Confirmar URL de **Preview `desenvolvimento`** e versão mostrada, sem confundir Worker de nome desenvolvimento com origem real.
2. Visitante: criar lista, abrir em modal, Adicionar item em `#addDialog`, selecionar ficha, confirmar obrigatórias, mudar e remover tags, salvar, editar/duplicar/remover item, fechar e reabrir. Confirmar preservação em armazenamento local.
3. Validar `Minhas listas` X.0.3.29: cartão cinza translúcido, separação do título, Nova em verde, status técnico por cartão, checkbox alinhado ao nome no canto direito, botões Editar/Duplicar/Compartilhar/Excluir **em linha abaixo**, nenhum botão solto. Marcar 1 lista (Compartilhar selecionada); marcar 2 (não executar ação múltipla), Limpar seleção.
4. Renomear lista sem alterar itens; duplicar com mesmo conteúdo, novo identificador e status correto. Compartilhar por botão individual: texto/e-mail/PDF; conferir dados gerados. Excluir **apenas lista descartável**, confirmar que não reaparece.
5. Conta autenticada: alternar login/logout, verificar nome/Visitante e ON/OFF como **rede**, não sincronização. Criar/editar lista, verificar sincronização REAL no servidor e o novo acesso em outro aparelho com mesma conta.
6. Cortar rede: editar cópia local, conferir pendência individual sem perder dados; voltar online, conferir envio. Simular conflito de dois aparelhos: segunda edição não pode sobrescrever silenciosamente a primeira. Conta B não vê listas de A; exclusão de A não apaga B.
7. Nos modos Claro/Escuro/TEREON, navegar Ferramentas → Listas → modal técnico → Minha conta → Escola → Biblioteca; conferir cores e contraste do texto, foco, teclado, toque, scroll, modais sobrepostos e opção de voltar por breadcrumb.
8. Verificar atualização SW sem desinstalar ou limpar dados; não considerar `statuses=[]` ou atualização do arquivo `version.json` evidência de deploy bem sucedido.
9. Revalidar especificação com **fichas reais ainda Em revisão**; nenhuma regra/atributo não confirmado deve ser marcado como definitivo.

**Classificação:** o fundador aprovou **visualmente** Minhas listas X.0.3.29. A inspeção de código confirmou equivalência do modal com fixture e alinhamento de versões. **Nenhum** teste E2E em duas contas, aprovação normativa de fichas, PDF real ou execução atual do CI foi comprovado nesta revisão. Ver [auditoria de 09/11](REVISAO-GERAL-CONTRATOS-2026-11-09.md).


## Casos adicionais necessários — reconciliação e exclusão (auditoria documental 09/11)
**Estado: roteiros propostos, NÃO executados.** Utilizar somente contas e listas descartáveis; não suprimir preservação local atual para forçar resultado.

1. **Exclusão remota cruzada:** criar L em A, sincronizar e abrir em B, excluir L em A, atualizar B; registrar apresentação atual da lista ausente no servidor e decidir como indicar remoção remota sem apagar edições offline.
2. **Fronteira de exclusão:** conferir que a interface autenticada invoca `TereonXListIntegration.deleteList` e que nenhum outro botão chama diretamente `TereonXLists.removeList`. Testar erro do DELETE remoto, conflito de versão e falha de gravação em cache após DELETE.
3. **Falha de escrita:** forçar quota/erro no cache durante retorno do servidor e na atualização; recarregar sem limpar armazenamento; avaliar recuperação e versão.
4. **Troca de sessão durante sincronização:** A inicia refresh, encerra sessão, B entra; resposta tardia de A não pode desenhar/gravar cache de B.
5. **PWA offline:** instalar e carregar autenticação enquanto online; fechar navegador; abrir PWA offline e verificar acesso aos dados autorizados em cache sem tratar ausência da CDN como troca de conta; ao reconectar, conferir identidade e dados.
6. **Autorização real:** com tokens válidos de A e B, testar SELECT, UPDATE e DELETE de um registro descartável de A usando B; todas operações devem negar ou retornar zero linhas, sem afetar A. Não inferir isso apenas por RLS configurada.

Ver [Validação técnica](VALIDACAO-TECNICA-2026-11-09.md) e [Contratos vigentes](CONTRATOS-VIGENTES.md).


## Contrato de limites local/nuvem — casos pendentes (09/11/2026)
**NÃO EXECUTADOS**; constatação por comparação de `servico.js`, `nuvem/motor.js`, HTML e SQL. Em lista descartável: (a) tentar criar 301º item no serviço; (b) tentar quantidade não finita via API, fora de campo HTML; (c) nome longo vindo de dado legado; (d) payload maior que 110.000 caracteres/limite em bytes. Em todos os cenários, verificar se o aplicativo **preserva a cópia local, explica falha da nuvem, não marca Sincronizada e não modifica outras listas**. Não aplicar truncamento ou deleção silenciosa como 'solução'. Referência: [Validação técnica](VALIDACAO-TECNICA-2026-11-09.md).


## Teste de ciclo de vida das etapas (pendente; não executado)
Criar lista descartável com dois itens na etapa `QD1`. Remover um: a etapa permanece. Remover o último: verificar se a etapa vazia desaparece das sugestões, conforme intenção da UX, sem apagar outras etapas ou itens. Repetir alterando a etapa do único item para `QD2`. **Código atual:** `removeItem` remove o item, mas não saneia `list.stages`; registrar como caso conhecido até definir regra de conservação de etapas cadastradas manualmente. Não aplicar limpeza destrutiva sem migração e aceite.


## Aceite futuro — Diário de Obras programando equipes (10/11/2026)
**Simulação local, não E2E real com Supabase.** Na Preview real da branch `desenvolvimento`, abrir `/x/universo/diario/lab.html` no celular. Selecionar Wilson Rachid, JS, Equipe A, Escopo Revisão elétrica e período de 17–20/11; conferir aparição nos quatro dias e ausência no dia 21. Selecionar Etapa Quadros ou Subetapa QD1: somente um dia, término bloqueado e igual ao início. Testar 2 equipes no mesmo dia, mudança de obra, cancelamento com histórico preservado no armazenamento local, recarga, teclado e rolagem em tela pequena; garantir que o laboratório não escreveu em `x_works` ou Listas reais. Concluir regressão de `#addDialog` em Listas e verificar CI `x/tests/diario-programacao.test.cjs` antes de considerar validado. **Ainda não executado no aparelho.**


## Diário — regressão de modais e execução por dia (10/11/2026)
Na Preview e celular verificar: formulário de programação **não ocupa página principal**; consulta de programação por obra/data é entrada; **+ Adicionar atividade** abre `#entry-dialog`, herda obra/data e fecha ao salvar; nenhum dado do navegador é perdido ao fechar. Para programação de 17–20/11, **Registrar o dia** em 17/11: trabalhou, mas não concluiu; em 18/11: trabalhou e concluiu; em 19/11: não realizada por chuva/falta de material/outro. Motivo obrigatório se não realizada, conclusão impossível nessa condição. Conferir status específico em cada data, revisão preservando eventos anteriores, cancelamento sem apagar apontamentos, recarga, toque/scroll/ESC dos dois modais. Testar `node x/tests/diario-programacao.test.cjs` e `node x/tests/diario-execucao.test.cjs`. **Somente smoke-test JS isolado aprovado; CI, visual e E2E ainda pendentes.**


## Novos testes pendentes — navegação Obras, Empreiteiros e PDF do Diário (10/11/2026)
1. Abrir Obras no celular: painel de obras próprias existente + links para Empreiteiros, Diário e Relatórios de Visita. Confirmar que Visitas indica módulo não implementado e que login/obras reais continuam idênticos.
2. No laboratório de Empreiteiros, cadastrar JS, Equipe A; renomear, recarregar; não excluir prestador com equipe ativa. Conferir dados apenas no mesmo navegador. Reabrir Diário: JS e Equipe A aparecem em seletores, sem alterar listas ou dados de obra.
3. Diário de obra fictícia Wilson Rachid, data 17/11: criar programação, confirmar execução ou não realização por chuva. **Gerar PDF do dia**, selecionar “Salvar como PDF” no navegador; conferir que o documento mostra o status e justificativa corretos e não declara presença onde não há confirmação. Testar obra/data sem programação.
4. Conferir impressão A4 no Android/desktop, leitura, cortes, acentos, texto longo, mais de uma página, e comportamento depois de fechar visualização de impressão.
5. Confirmar que `#addDialog` das Listas e demais modais X não foram modificados. Rodar `node x/tests/obras-navegacao-pdf.test.cjs` e CI completo. **Apenas smoke-test JS isolado e inspeção estática feitos até aqui; PDF visual e toque não homologados.**


## Roteiro preventivo de interface — Obras (10/11/2026)
**Não executado em dispositivo:** comparar Obras, Diário, Empreiteiros e Visitas sob Claro/Escuro/TEREON; confirmar hierarquia de títulos e espaços, cartão da obra, botões de 44px, contraste/foco no modal, sem rolagem horizontal em 360/390px. Diário: agenda primeiro, ajuda recolhida, formulários apenas em modais; PDF A4 mantendo conteúdo. Verificar cadastro e gravação intactos ao mudar tema. Em laboratório descartável: tentar excluir equipe com programação no Diário — a UI deve bloquear; invalidar JSON local — nova gravação deve bloquear sem sobrescrever chave. Verificar Listas `#addDialog` sem regressões. Executar `node x/tests/obras-refino-visual.test.cjs`, verificar CI real e registrar evidência de aparelho/Preview. Pendências técnicas P0–P2 em [Auditoria](AUDITORIA-LAYOUT-OBRAS-2026-11-10.md).


## Regressão de cabeçalho e funcionários — 10/11 (a executar no aparelho)
- Em Obras, Empreiteiros, Diário e Relatórios de Visita, confirmar **mesma marca, perfil, rede e breadcrumb** sob a divisória: Ferramentas › Obras › módulo. Links de navegação sem voltar à nomenclatura visual Universo.
- Empreiteiros: criar prestador via modal; adicionar funcionários via modal, ver `Ativo`; editar via modal e marcar `Desligado`; editar para `Ativo` e confirmar preservação do histórico no motor. Recarregar a página e verificar persistência local.
- Cadastro preexistente com `contractors + teams` deve continuar íntegro, com equipes antigas na seção recolhida; não converter em funcionários nem apagar programações do Diário.
- Bloquear exclusão de empreiteiro que possua funcionários; conferir que ausência de cadastro corporativo real e identidade compartilhada é informada na interface.
- Diário deve continuar consultando equipes de demonstração sem atribuir automaticamente funcionários cadastrados. Os dois modais Diário e os modais de Listas devem continuar intactos.
- Verificar tema claro/escuro/TEREON, alvos de toque e comportamento de teclado e rolagem de modais. `node x/tests/empreiteiros-funcionarios.test.cjs` incluído no CI; execução de Actions e teste visual reais não confirmados.


## Linha de base para execução — superauditoria 10/11
**Bloqueio conhecido antes do CI:** `x/tests/cabecalho.test.cjs` referencia `header.js?v=8` para Obras; a página real referencia v9. Ajustar expectativa do teste e comprovar execução dos **24 comandos** do workflow para o SHA de revisão, sem modificar layout aprovado apenas para satisfazer fixture. Ver [superauditoria](SUPERAUDITORIA-TEREON-X-2026-11-10.md).
**Cenários P0/P1 indispensáveis:** duas contas e dois dispositivos com exclusão remota/edição conflitante; falha entre DELETE remoto e cache local; histórico de apontamentos em Diário após cancelar programa; funcionário desligado e equipe renomeada com histórico; logout/login no mesmo aparelho com dados de laboratório separados de identidade; PDF com registros cancelados e 2+ páginas; temas Claro/Escuro/TEREON com breadcrumb em Android; Listas #addDialog e fichas sob fluxo de uso real. Nenhuma prova E2E nova registrada.
