> **INTEGRIDADE DE COMPRA — 14/11/2026:** a X.0.3.61 apenas antecipa a confirmação das sugestões para a tela de pesquisa; o botão **Avançar** preenche o rascunho de ficha **sem criar lançamento nem alterar quantidades**. Todo agrupamento visual, apresentações de fornecimento, rastreabilidade, relatórios e separação comercial seguem regidos pelo contrato existente. Não inferir igualdade técnica de itens incompletos. [Marco de retomada](RETOMADA-TEREON-X-2026-11-14.md).

> **COMPATIBILIDADE COM ENTRADA NATURAL — 13/11/2026, X.0.3.60:** este contrato de **agrupamento, composição de lances e relatórios de compra** não foi reescrito pelo novo interpretador. Texto e voz sugerem características **antes da gravação do lançamento**, com confirmação explícita e validação pelas fichas; não extraem nem convertem automaticamente comprimentos, rolos, etapas ou apresentações comerciais. A comparação de possíveis equivalências ainda não autoriza somar itens incompletos. A partir de uma futura foto valerá a mesma proteção; **foto não foi implementada**. [Entrada natural](PILOTO-BUSCA-NATURAL-VOZ-FOTO-2026-11-13.md).

> **IMPLEMENTAÇÃO — 12/11/2026 · X.0.3.51:** “Implementação ainda pendente” no texto de criação abaixo é um marco histórico, **não** o estado vigente. O alternador Por insumo/Por etapa, a composição de lances com metragem preservada e os relatórios Compras/Completo/Execução em WhatsApp, e-mail e PDF já têm código na branch `desenvolvimento`. A revisão X.0.3.51 acrescenta formatação por canal e estrutura paginada no PDF, além de ficha Eletroduto LAB, sem alterar a fonte original. Ainda falta validação real dos canais, CI, PDF e deploy. [Detalhes](REVISAO-ELETRODUTO-E-RELATORIOS-2026-11-12.md).

# TEREON X — Decisão de Listas, agrupamento e relatórios (12/11/2026)

**Status:** decisão de UX e regra de negócio aprovada pelo fundador em conversa; **implementação ainda pendente**. Repositório canônico: `TEREON-eng/desenvolvimento`, branch `desenvolvimento`. Não editar `main` nem considerar deploy realizado.

## Diagnóstico do código existente
- Em 11/11/2026 `x/version.json` identifica **X.0.3.42**; `x/listas/app.js` mantém dois blocos, **Resumo para compra · experimental** e **Materiais da lista**.
- O módulo `x/listas/quantificacao.js` consolida por especificação + unidade comercial + **comprimento unitário dos lances**; logo, **não** reúne lances de 100 m, 70 m e 30 m na mesma linha de insumo.
- A ficha `FT_COND-001` (DET-011 Unidade) continha `m; rl50m; rl100m; rl200m; 2 lances; 3 lances`. `1 lance` foi excluído pois equivalia a `m` nas decisões anteriores. A semântica dos seletores `2 lances` / `3 lances` atualmente é comprimentos iguais resultantes de `qty/count`.
- Preservar esse legado e identificar uma evolução compatível da composição antes de mudar campos de dados ou interpretação de fichas.

## Decisão 1 — Lista como ambiente único de trabalho
Depois do botão **Adicionar item**, apresentar a relação dos lançamentos com alternador **Por insumo / Por etapa**. O resumo de compra não deve competir como um bloco independente dentro da mesma tela. A organização é uma **visão** sobre a memória de lançamentos; não apaga, duplica nem altera itens. Preservar edição, duplicação, remoção, busca, status, modal e tags aprovados.

## Decisão 2 — Compartilhamento orientado à finalidade
O botão de compartilhar abre escolha de **Compras**, **Relatório completo (chefia)** ou **Execução por etapas**. O usuário **não reespecifica quantidades, trechos ou apresentação na geração do relatório**: tudo deve ter sido definido no lançamento/edição.
- Compras: consolidação por especificação técnica + modalidade/unidade comercial de aquisição, com composição de fornecimento.
- Completo: todos os lançamentos, especificações, etapas e quantidades com rastreabilidade.
- Execução: relação por etapa com quantitativos associados.
- PDF/texto, conforme meios disponíveis, precisam representar a mesma fonte de verdade.

## Decisão 3 — Lances agrupados por insumo com composição interna
**A identidade técnica e a modalidade de compra governam a linha principal; o comprimento individual do lance NÃO deve dividir a linha principal.** Em seu interior, apresentar os comprimentos agrupados por valor e sua contagem, preservando cada lance.

Exemplo de saída de compras:
- **Condutor cobre 10,0 mm² — 500 m, 7 lances**.
- Composição: **3 × 100 m (300 m) + 2 × 70 m (140 m) + 2 × 30 m (60 m)**.
- Todos são lances distintos, nunca um único lance de 500 m; o comprador recebe a composição exigida.
- **4 × RL100 m**, para o mesmo condutor, constituem **linha comercial separada**, sem misturar aos lances.

A matemática da composição deve fechar o total, e cada componente manter a rastreabilidade dos lançamentos e etapas de origem. Não converter automaticamente diferentes lances em rolos ou um lance maior. O usuário observou que cortar em obra seria fisicamente possível, mas **não é a intenção do pedido**.

## Efeito sobre o motor existente
A chave atual `[signature, unit, each]` precisa evoluir conceitualmente para agrupar por `[signature, modalidade de fornecimento]` e carregar `breakdownByLength` / `sourceIds`, **somente após revisão do contrato de dados**. Uma ocorrência em `m` representa, na decisão anterior, um lance único; discutir compatibilidade de visualização apenas na implementação. Não reinterpretar automaticamente itens legados sem `qtyBasis='m'`.
Não introduzir uma segunda pergunta de unidade no modal nem romper a ficha `DET-011`.

## Critérios de aceite para futura implementação
1. Por insumo e por etapa exibem os mesmos dados sem perda de origem.
2. 3×100 + 2×70 + 2×30 do mesmo cabo e modalidade => **500 m, 7 lances, uma linha**, contendo composição legível.
3. Mesmo cabo, 4×RL100 m => **segunda linha**, 4 rolos = 400 m.
4. Compras, completo e execução em texto e PDF consistentes com a memória.
5. Edição de um lançamento modifica somente os agregados afetados; exclusão/duplicação não corrompe os demais.
6. Condições inválidas ou total incompatível com a soma dos trechos não geram relatório sem aviso.
7. Testes de regressão sobre o fluxo já aprovado antes de qualquer publicação.

## Transparência histórica
Na conversa de 12/11/2026, a primeira tentativa de documentação foi gravada no repositório **legado** `jhcolba-del/tereon`, porque o assistente confundiu a origem de código; este arquivo corrige a **localização documental**. O código mais recente foi identificado em `TEREON-eng/desenvolvimento`. Nenhuma alteração funcional ou publicação foi realizada nesta etapa.
