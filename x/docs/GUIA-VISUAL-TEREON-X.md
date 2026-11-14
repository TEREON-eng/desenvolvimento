> **PADRÃO VISUAL — 13/11/2026 · X.0.3.59:** na especificação de itens, tags exibem todos os detalhes **aplicáveis**. Detalhes não preenchidos ficam apagados com nomes mínimos (`Ø`, `#`, `V`, `Mat.`, `Isol.`), mas continuam clicáveis para abrir sua seleção. Detalhes preenchidos mostram seus valores (abreviando visualmente os muito longos) e × vermelho, sem linha divisória. Chips pequenos, contorno duplo nas obrigatórias, contraste preservado no tema escuro. A barra de progresso inclui opcionais, mas não navega — a navegação é feita nas tags. Layout ainda precisa de avaliação em aparelho real. [Changelog](CHANGELOG.md).

> **13/11/2026 · X.0.3.58 — interações do modal:** o texto das tags confirmadas na parte inferior é clicável para navegar ao respectivo detalhe; o × tem alvo independente para excluir. **Não exibir setas ou segmentos clicáveis na barra de progresso**, que volta à altura compacta e indica apenas obrigatórios. Manter a dupla borda das tags obrigatórias e a sinalização de relacionamentos condicionais. Essa decisão substitui a tentativa X.0.3.57 e preserva a estrutura visual originalmente aprovada. [Changelog](CHANGELOG.md).

> **REFINAMENTO VISUAL — 12/11/2026 · X.0.3.55:** contraste dos botões de selecionar detalhe no tema Escuro/TEREON corrigido com cores apropriadas, incluindo texto claro e bordas mais visíveis; os botões bloqueados continuam distinguíveis e legíveis. Indicadores de maturidade da ficha **Consolidado / Em revisão** ficam **exclusivamente no seletor inicial de Adicionar item**, não dentro das listas; X.0.3.53–54 são iterações históricas substituídas por esta decisão. Fichas LAB continuam em revisão, sem promoção a consolidadas por inferência. [Histórico](CHANGELOG.md).

> **REFERÊNCIA VISUAL VIGENTE — 12/11/2026:** a X.0.3.50 foi considerada suficiente para testes pelo fundador. Preservar visual compacto de Listas, alternador Por insumo/Por etapa, cor e isolação na descrição, cabeçalhos neon suave, fundo lousa atenuado e superfície interna opaca uniforme, além de ações recolhíveis e modal/tags já aprovados. X.0.3.51 altera ficha experimental e relatórios, **não a aparência das listas**. [Revisão atual](REVISAO-ELETRODUTO-E-RELATORIOS-2026-11-12.md). A referência X.0.3.29 no título abaixo é histórica.

# TEREON X — Guia visual · revisão X.0.3.29 (09/11/2026)

> **FOCO DE HOMOLOGAÇÃO — 10/11:** para 17/11, validar a experiência de **Listas** e o modal técnico aprovado em aparelho real; refinamentos de Obras/Diário continuam laboratório sem aceite visual definitivo. [Plano 17/11](FOCO-TESTE-CAMPO-17-11-2026.md).

Data: 09/11/2026 | Branch: desenvolvimento | **Aceite visual parcial de Minhas listas**, sem homologação do restante.

## Princípio inviolável
**Claro, Escuro e TEREON são apenas apresentações.** Mesma estrutura de dados, mesmas regras técnicas, mesmos serviços e operações. Uma seleção de tema nunca pode modificar lista, ficha, obra, identidade, autorização ou sincronização. A configuração de aparência é local ao dispositivo e nunca é armazenada junto a uma lista.

## Paletas
| Token | Claro | Escuro | TEREON |
| --- | --- | --- | --- |
| fundo | #F3F5F4 | #171C1A | #10231C |
| superfície | #FCFDFC | #242C28 | #193629 |
| texto | #1F2623 | #EEF4F1 | #F1F9EF |
| texto secundário | #56675D | #B1C1B6 | #C3D7C8 |
| borda | #D6E1D9 | #405047 | #42694E |
| destaque | #18372D | #C7FF46 | #C7FF46 |
| verde-lousa | #4F6B62 | #78958A | #668B77 |
| texto do destaque | #FFFFFF | #142016 | #142016 |

## Princípios de componentes
- Tipografia padrão: system-ui, excelente legibilidade, mínimo 14px no conteúdo de trabalho; texto auxiliar pode ser menor desde que legível.
- Alvos de toque: preferir pelo menos 44x44px em ações operacionais.
- Botões: ação primária de alto contraste; secundário sóbrio; jamais distinguir resultado exclusivamente por cor.
- Cards: contorno suave, hierarquia de títulos, texto sem excesso, foco visível em teclado.
- Cabeçalho: componente único compartilhado. Ícones/estado de conta consistentes e retorno independente do perfil.
- Modais e tags: preservar integralmente lógica, obrigatoriedade, sequenciamento e demais contratos aprovados; migração visual só depois de regressão e aceite.
- Movimento: discreto, respeita prefers-reduced-motion; interação essencial deve funcionar sem animações.
- Imagens: exclusivamente decorativas ou com alternativa acessível, otimizadas e com fallback offline; carregamento visual nunca bloqueia tarefas.

## Comportamento do seletor
- Três escolhas: Claro, Escuro, TEREON; opção local independente de login, sem gravação no Supabase.
- Chave de preferência: `tereon-x-appearance-v1` (valores: `light`, `dark`, `tereon`).
- Seleção persistida entre recargas; em armazenamento indisponível usar Claro sem impedir navegação.
- **Hoje:** `html[data-tx-appearance]` aplica os temas globalmente (também em modais). A escolha fica em **Minha conta**, inclusive para visitantes. O Início usa ainda `#homeScreen[data-appearance]` para decoração, sem regras de dados.
- O modo TEREON inicial usa composição gráfica CSS leve, **sem imagens definitivas ainda**. As artes e interações imersivas deverão ser desenvolvidas separadamente.

## Padrão atual aceito em Minhas listas
- Cabeçalho único com nome de perfil, indicador ON/OFF **somente da rede**, marca TEREON X clicável e breadcrumb sob a linha divisória.
- Cartões únicos cinza suave translúcidos (e equivalentes nos modos Escuro/TEREON), status técnico de armazenamento individual. Espaço entre título/ações e o primeiro cartão.
- Botões `＋ Nova` verde (primário) e `Conferir nuvem` secundário. Ações Editar nome, Duplicar, Compartilhar, Excluir à direita **em linha inferior**; checkbox discreto no canto superior direito **alinhado verticalmente ao título**.
- Seleção múltipla hoje não executa lote; compartilhar pela seleção funciona com exatamente uma lista. Não confundir status de armazenamento com os futuros estados de Solicitações.
- Modal de lista acima da tela de listas; modal de adicionar material `#addDialog` preservado em HTML e lógica, com cores do tema. Não alterar estrutura/tags/condicionais para corrigir apenas o design.
- Botões compactos requerem teste de toque/acessibilidade em celular; aceite visual do fundador não homologa todos os comportamentos ou os três temas.

## Governança
1. Comparar as três interfaces na mesma Home.
2. Manter mesmo HTML funcional para links de módulos; variações apenas via classes/atributos e CSS.
3. Testar navegação, estado da conta, modal técnico, teclado, offline e responsividade.
4. Não alterar `main` sem aprovação.


## Aplicação em Obras (10/11/2026) — sem aceite visual
Foi criada a camada **transitória** `x/universo/ui-refino.css`, aplicada aos laboratórios Obras, Diário, Empreiteiros e Visitas. Todos devem respeitar os três temas e os tokens deste guia, inclusive modais. A camada mantém temporariamente CSS local por módulo para minimizar risco de regressões; depois do aceite, consolidar especificidades repetidas. **Não alegar aprovação visual** sem abrir em celular, comparar contraste/teclado/scroll e PDF impresso. [Auditoria](AUDITORIA-LAYOUT-OBRAS-2026-11-10.md).


## Cabeçalho padrão de Obras e cadastro por modal (10/11)
Todas as páginas Obras, Empreiteiros, Diário e Visitas usam o componente único `x/components/header.js` e breadcrumb sob sua linha divisória: `Ferramentas › Obras › [módulo]`. Não substituir por cabeçalhos locais com marca pequena ou links próprios. Formulários Adicionar/Editar Empreiteiro e Funcionário ficam em `dialog` modais, mantendo página como consulta; não modificar `#addDialog` das Listas. Temas Claro/Escuro/TEREON continuam compartilhados e leitura de dados não depende do cabeçalho. Aceite móvel ainda pendente.
