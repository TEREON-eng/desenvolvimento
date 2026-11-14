# TEREON X — Guia visual vigente

**Saneamento 14/11/2026 · laboratório X.0.3.61.** Aceite parcial do desenho, **não** homologação no Android. Texto anterior integral: [GUIA-VISUAL-TEREON-X-PRE-SANEAMENTO-2026-11-14.md](GUIA-VISUAL-TEREON-X-PRE-SANEAMENTO-2026-11-14.md).

## Linguagem visual
Interface mobile-first, direta e com poucos gestos. Paleta TEREON: grafite **#1A1F1E**, verde-escuro **#0F2A21**, verde-limão **#C7FF46**. Temas Claro/Escuro/TEREON com imagens devem preservar funções e contraste. Cabeçalhos, minha conta, breadcrumb, retorno e modal precisam ser consistentes.

## Listas e cartões
Tela interna limpa: título, lançamentos e busca/filtro, com botão destacado **Adicionar item**. Visões **Por insumo** e **Por etapa** têm família/etapa recolhíveis, títulos compactos, fundo lousa e verde translúcido, resumo de atributos relevantes e detalhes completos expansíveis. É visualização, **não** autorização para juntar materiais tecnicamente diferentes. Em Minhas listas: seleção discreta, título e ações editar/duplicar/compartilhar/excluir compactas, sem sobrecarga de linhas.

## Modal — primeiro nível
Abrir o **mesmo addDialog aprovado** (fixture x/tests/fixtures/modal-adicionar-aprovado-x034.html). Campo único de texto natural e botão opcional de voz. Abaixo da busca, tags pequenas de sugestões **?**, que viram **✓** com toque, formando o nome técnico. **Um único Avançar para especificação** entrega apenas confirmações validadas. Usuário pode avançar sem tags e especificar manualmente. **Não recriar segunda área grande de confirmação dentro da ficha.**

## Modal — ficha técnica
Topo com nome em formação, quantidade, unidade e etapa. Tags compactas, com preferência por área de duas linhas e **segunda linha sem corte da borda**; sem ampliar o modal desnecessariamente. Todas as características aplicáveis são acessíveis, inclusive opcionais; pendentes atenuadas com abreviações (Ø, #, V, Mat., Isol.). Texto da tag abre detalhe sem alterar dados; **× vermelho** remove respeitando condicionais. Barra de progresso **informativa** e não clicável. **Não** ressuscitar setas da X.0.3.57. Obrigatórios governados pelo motor de ficha, não por suposição da tela.

## Semântica de status
Selo **Consolidado** da ficha é maturidade estrutural; **Em revisão** é status técnico. Mostrar no **seletor de fichas do primeiro nível**, não em linhas de lista, nem derivar de número de itens. Rede (ON/OFF), conta (visitante/registrado) e armazenamento (local/sincronizado/conflito) são estados diferentes. “Pendente/Aprovada/Em compras” pertence a Solicitações futuras.

## Aceite
Testar Android/PWA, teclado, foco, toque, botão Parar do microfone, fallback de voz, visual compacto, 3 temas, edição, recarga, compartilhamento e retorno. Código/fixture sozinhos não comprovam visual homologado. Fontes: [Contratos](CONTRATOS-VIGENTES.md), [Regressão](TESTES-REGRESSAO.md), [História Vol.03](HISTORIA-TEREON-X-VOLUME-03.md).
