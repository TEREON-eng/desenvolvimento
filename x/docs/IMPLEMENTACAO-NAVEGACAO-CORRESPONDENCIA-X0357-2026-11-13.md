> **NOTA HISTÓRICA — 13/11/2026, X.0.3.60:** o documento registra fielmente a solução **X.0.3.57**, inclusive uma barra de progresso clicável e setas. **Essa navegação foi posteriormente rejeitada e substituída**: nas X.0.3.58–59, tocar na **tag de detalhe** abre o campo; o × vermelho remove, todas as tags aplicáveis (inclusive pendentes) aparecem compactas e o progresso é apenas informativo. O **aviso conservador de possíveis correspondências entre lançamentos** continuou válido e não realiza fusão. A X.0.3.60 acrescentou **entrada por descrição e voz de um novo material**, fluxo independente. Para testar o modal vigente, consulte [Guia Visual](GUIA-VISUAL-TEREON-X.md) e [Piloto texto/voz](PILOTO-BUSCA-NATURAL-VOZ-FOTO-2026-11-13.md), em vez das instruções de setas abaixo.

# TEREON X.0.3.57 — Navegação por detalhes e revisão segura de equivalência
**13/11/2026 · desenvolvimento · Implementado para laboratório; publicação/deploy e teste móvel não confirmados**

## Origem do feedback
No ensaio de Listas, o fundador enviou captura do tema escuro em **Por insumo**, com “Condutores elétricos — 4 variações · 6 lançamentos”. Várias variações tinham um resumo visual semelhante, mas não eram automaticamente consolidadas porque os detalhes técnicos confirmados ou a apresentação comercial ainda podem diferir. O fundador perguntou por que não aparecia uma sugestão de equivalência e pediu navegação livre entre todos os detalhes do modal (inclusive opcionais), por setas ou toque na barra de progresso.

A captura é evidência de **aspecto visual e problema observado**, não prova de equivalência entre os itens. A proposta anterior de correspondência (13/11) estava apenas documentada, sem código funcional.

## Mudança A — Barra navegável em Adicionar item
- `x/index.html`: a barra `#progress` fica entre setas acessíveis `#detailPrev` / `#detailNext`, sem abrir nova tela. As setas são desativadas nas extremidades.
- `x/listas/app.js`: `redrawAdd` apresenta **todos os detalhes aplicáveis** da ficha, tanto **obrigatórios quanto opcionais**, como segmentos `<button type=button>` com `data-detail-index`, título descritivo, `aria-label` e `aria-current=step` no detalhe selecionado.
- `navigateDetail(index)` altera **somente o foco**: não inventa escolhas, não exclui tags e não libera salvamento. O contador mostra `Detalhe atual/Total · Obrigatórios confirmados/Total`.
- A barra recalcula quando uma condição da ficha altera a lista de detalhes visíveis. Detalhes ocultos por incompatibilidade ou por condição ainda não satisfeita **não aparecem como acessíveis** até serem aplicáveis. O `FT_INFRA-001` continua omitindo as perguntas duplicadas de unidade que são tratadas no seletor próprio.
- `x/styles.css`: segmentos clicáveis, opcionais com borda tracejada, selecionado com foco, concluído em outra cor, deslocamento horizontal no celular e versões claro, escuro e TEREON. O formato e a dinâmica de tags confirmadas não foram alterados.

## Mudança B — Primeiro detector de possíveis correspondências (condutores)
- Novo módulo puro e isolado `x/listas/correspondencia.js`, disponibilizado em `x/index.html` e no cache offline do PWA.
- `compare(a,b)` usa `catalogId`, pares de atributos efetivamente confirmados em `values` e normalização restrita de seção. **Não utiliza o nome textual como prova de identidade** e ignora `DET-011` (unidade comercial) nessa comparação.
- A sugestão inicial só funciona para **`FT_COND-001`** com âncoras comuns suficientes (tipo, material, seção e pelo menos cor ou isolação confirmada em ambos). Não comparar automaticamente legados sem ficha ou outras famílias.
- Valores conhecidos contraditórios (tensão, cor, material, seção, isolação, classe etc.) => `incompativel`, não sugerir fusão. Diferença onde só um lado informou valor => `potencial`, explicar atributo ausente. Opção agregada **“HEPR ou XLPE”** confrontada com HEPR específico => `indeterminado`. Ambos sem tensão => não declarar identidade confirmada.
- `findReviewPairs(items)` retorna possíveis pares para revisão e também casos de atributos confirmados iguais cujos **nomes foram redigidos de modo diferente**, desde que a apresentação comercial seja a mesma.
- Na tela **Por insumo**, surge aviso compacto `Possíveis correspondências · Revisar` **somente quando há candidatos**. O diálogo `#matchDialog` explica a diferença, informa múltiplos candidatos (sem escolher um) e oferece `Revisar especificação`: esse botão abre o **mesmo modal de edição aprovado**, com foco preferencial no detalhe faltante.
- Não existem botões `Confirmar equivalência automaticamente` ou `Somar agora`. A revisão só permite edição voluntária; a pessoa precisa confirmar o detalhe na ficha e salvar como já fazia antes.
- `x/listas/quantificacao.js` permanece **inalterado**: mantém rolos, lances, quantidades, estágios e as assinaturas conservadoras. WhatsApp, e-mail e PDF também não mudaram nesta rodada.

## Limitações deliberadas
- O comparador **não resolve completamente** a matriz de identidade técnica nem funciona para Eletrodutos nesta versão; valida primeiro a família Condutores.
- Não reconhece equivalência de palavras livres sem confirmação das tags; por exemplo, o texto “450” não deve ser transformado automaticamente em `450/750 V`.
- Se ambos os itens omitiram tensão, não declarar identidade técnica confirmada, mesmo quando outros detalhes iguais.
- A proposta geral `CONTRATO-CORRESPONDENCIA-PROGRESSIVA-2026-11-13.md` continua **em evolução**: a nova implementação cobre a **sugestão de revisão**, não autoriza a fusão ou homologação.
- Nenhuma ficha técnica foi publicada como Oficial; Condutores está Consolidado quanto à maturidade de estrutura, mas com publicação técnica pendente.

## Roteiro rápido de teste em celular
1. Abrir Adicionar item → Eletroduto rígido PVC. Após selecionar tipo/material, conferir **4 detalhes aplicáveis** (Tipo, Material, Diâmetro, Tipo ponta opcional). Tocar no segmento opcional; voltar pela seta; garantir que tags e escolhas anteriores permanecem.
2. Testar Condutor com detalhes obrigatórios e opcionais: tensão e encordoamento devem ser navegáveis conforme aplicabilidade, mesmo que não tenham sido selecionados automaticamente.
3. Na mesma lista, lançar **Condutor isolado, cobre, seção 2,5, PVC, preto** em duas etapas, com um lançamento sem tensão confirmada e outro com **450/750 V**. Em Por insumo deve aparecer o aviso de **possível correspondência**.
4. Abrir Revisar: verificar que a tensão aparece como **faltante**, sem ser preenchida; usar `Revisar especificação` e navegar à tensão. Só depois de escolher explicitamente e salvar uma nova identidade poderá ser reavaliada.
5. Criar um terceiro condutor com **0,6/1,0 kV**. O painel deve apresentar **múltiplos candidatos**, não escolher a tensão.
6. Alterar uma cor para Azul e manter o outro Preto: **não** sugerir que esses dois produtos são equivalentes; suas quantidades continuam separadas.
7. Conferir relatorios de Compras/Completo/Execução: a atualização desta rodada não pode alterar quantitativos, apresentações ou origens.
8. Usar tema Escuro e TEREON e conferir contraste, toque e rolagem horizontal da barra em dispositivos estreitos.

## Testes e rastreabilidade
- `x/tests/modal-fichas.test.cjs` estendido para navegação por progresso/definição opcional e setas sem mutação de tags.
- `x/tests/correspondencia-progressiva.test.cjs` criado e integrado ao workflow; reaproveita os **15 cenários** da fixture `x/tests/fixtures/correspondencia-progressiva-condutores-v1.json` e testa múltiplas alternativas, nomes diferentes, separação comercial e ausência de inferência.
- Verificações isoladas de sintaxe e algoritmo realizadas; **ainda não foi confirmado CI final, teste manual móvel ou Cloudflare publicado**.
- Estado da versão: `x.0.3.57` no branch `desenvolvimento`.
