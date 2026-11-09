# TEREON X — Guia visual v1 (proposta implementada no Início)
Data: 09/11/2026 | Branch: desenvolvimento | Status: experimental, sem homologação visual.

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
- No experimento inicial, as diferenças visuais estão restritas ao **Início**; outros módulos permanecem inalterados até aprovação.
- O modo TEREON inicial usa composição gráfica CSS leve, **sem imagens definitivas ainda**. As artes e interações imersivas deverão ser desenvolvidas separadamente.

## Governança
1. Comparar as três interfaces na mesma Home.
2. Manter mesmo HTML funcional para links de módulos; variações apenas via classes/atributos e CSS.
3. Testar navegação, estado da conta, modal técnico, teclado, offline e responsividade.
4. Não alterar `main` sem aprovação.
