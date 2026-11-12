> **ADENDO DE FECHAMENTO — X.0.3.52 (12/11/2026):** no relatório Compras, lançamentos anteriores com **mesmo material técnico, mesmos detalhes e mesma unidade comercial** também passam a ser agregados como uma linha. Exemplo: Sala 2 com 8 `br3m` + Sala 1 com 2 `br3m` => **10 barras de 3 m**, com etapas identificadas, sem converter a quantidade em metros. Completo e Execução preservam lançamentos individuais. O e-mail não inventa assinatura do remetente. O teste de formatos foi ampliado e o teste histórico do catálogo alinhado ao DET-011 Unidade já existente desde 11/11. CI, publicação e PDF físico seguem pendentes.

# TEREON X — Eletrodutos e compartilhamento para simulação de campo
**12/11/2026 · X.0.3.51 · Branch `desenvolvimento` · Situação: EXPERIMENTAL, NÃO HOMOLOGADA**

## 1. Por que esta rodada existe
Depois de consolidar a interface das listas, o fundador decidiu usar a versão visual X.0.3.50 como referência aceita para ensaio e concentrar o trabalho antes de 17/11 em **fichas que impedem especificações ambíguas** e **documentos úteis para quem recebe o pedido**. A aparência aprovada é mantida. O teste de 17/11 segue restrito a empreiteiros, sem lançamento comercial.

## 2. Fichário — fontes, precedência e rastreabilidade
- **Fonte histórica preservada, sem edição:** `x/fichario-x/fichas-drive-2026-11-08.json` (derivado do Fichario.xlsm).
- **Novo snapshot para simulação:** `x/fichario-x/fichas-lab-2026-11-12.json`, criado a partir do arquivo anterior. Ele altera somente `FT_INFRA-001`. O motor de catálogo do ambiente `desenvolvimento` passa a ler esse snapshot experimental.
- A planilha `Fichario.xlsm` do Google Drive **não foi editada** nesta rodada. O arquivo de laboratório não é uma substituição aprovada da fonte; qualquer regra deve ser reconciliada com o fichário depois da observação real.
- `FT_INFRA-001` mantém **Em revisão**. Não ganhou selo de oficial. Outras cinco fichas do snapshot têm seu conteúdo preservado.
- O JSON registra explicitamente as pendências; não alegar conformidade com uma norma técnica a partir de rótulos comerciais.

## 3. FT_INFRA-001: opções e condições de teste
| Seleção confirmada | Detalhe seguinte | Obrigatoriedade experimental |
| --- | --- | --- |
| Tipo | Rígido; Flexível | Obrigatório |
| Rígido | Material: PVC; Aço | Obrigatório; **não** oferecer PEAD |
| Flexível | Material: PVC; Aço; PEAD | Obrigatório |
| Aço (rígido ou flexível) | Diâmetro nominal em polegadas | Obrigatório |
| PVC (rígido ou flexível) | Diâmetro nominal em polegadas | Obrigatório |
| Flexível + PEAD | Diâmetro nominal | Obrigatório |
| Flexível + Aço | Capa: COM capa; SEM capa | Obrigatório |
| Flexível + PVC ou PEAD | Perfil: Liso; Corrugado | Obrigatório |
| Flexível + PVC | Classe de resistência: Leve; Média; Pesada | Obrigatório **somente para a simulação** |
| Rígido + Aço | Galvanização eletrolítica; imersão a quente (a fogo) | Obrigatório |
| Rígido + PVC | Tipo ponta: Rosqueável; Soldável | Opcional; revisão de compatibilidade pendente |
| Flexível | Unidades do snapshot anterior: m, rl25, rl50, rl100 | Escolha no seletor `Unidade`; não como pergunta duplicada |
| Rígido | Unidade br3m | Escolha no mesmo seletor; quantidade permanece na unidade declarada |

**Pendências técnicas explícitas:** valores de resistência do PVC rígido continuam em branco; revisão de diâmetros comerciais, correlação com normas/fabricantes, classificação de resistência, tipologia PEAD e alternativas de aço flexível ainda são obrigatórias antes de uso como catálogo homologado. Não aplicar coeficientes de resistência ou conversões comerciais fictícias.

### Comportamentos auditados
- `Rígido + PVC` sem diâmetro => `missing()` contém `DET-004`; após confirmação de `3/4"`, as obrigatoriedades dessa combinação ficam resolvidas, mas a ficha **ainda está em revisão**.
- `Flexível + PVC` sem diâmetro/perfil/resistência => `missing()` contém `DET-004`, `DET-007`, `DET-008`.
- `Rígido + Aço` pede diâmetro e galvanização; `Flexível + Aço` pede diâmetro e capa.
- `Flexível + PEAD` pede diâmetro e perfil; `Rígido + PEAD` não é combinação disponível.
- O modal técnico, a navegação, as tags e os dados persistidos não foram redesenhados. Seletor de unidade de eletroduto segue condição da ficha; registros antigos mantêm unidade original.

## 4. Compartilhar: uma fonte para três finalidades e três canais
**Fonte imutável:** `TereonXShare.model(snapshot)` em `x/motor-compartilhar.js`; a função `sections(model, finalidade)` define a estrutura das saídas. As quantidades e as modalidades são herdadas dos lançamentos; o relatório **não pergunta nem redecide** apresentação comercial.

| Finalidade | Organização | Conteúdo essencial |
| --- | --- | --- |
| **Compras** | Agrupado por identidade técnica + apresentação comercial | Quantidade de compra, metragem medida e etapas; composição de lances; unidades legadas sem conversão |
| **Completo** | Todos os lançamentos de origem | Nome técnico, quantidade/unidade, etapa e atributos técnicos confirmados |
| **Execução** | Organizado por etapa | Materiais da etapa, quantidade original e composição de trechos quando aplicável |

| Canal | Característica nova |
| --- | --- |
| **WhatsApp / texto** | Títulos curtos e destaques em `*negrito*` compatíveis com WhatsApp, lista/itens numerados e observações essenciais |
| **E-mail** | Assunto específico por finalidade; abertura formal curta e corpo integral; se o `mailto` ficar longo, copia assunto e corpo |
| **PDF** | Mesmo conteúdo estruturado, cabeçalho, seção e divisão por páginas, numeração e aviso de verificação técnica |

### Exemplo de compras que não pode ser perdido
- **Condutor cobre 10,0 mm²:** `7 lances · 500 m`; composição `3 × 100 m + 2 × 70 m + 2 × 30 m`.
- **Mesmo condutor em RL100m:** **outra linha comercial**, `4 rolos de 100 m` para 400 m medidos.
- **Eletroduto legado em br3m:** mantém `8 br3m`; o relatório não transforma automaticamente em `24 m`.
- As listas com ficha em revisão ou item simulado apresentam aviso de conferência e não são apresentadas como pedido homologado.

## 5. Evidências e fronteiras da validação
**Código gravado na branch `desenvolvimento`**; nova versão X.0.3.51, revisão de scripts/PWA e cache. Novos testes dedicados:
- `x/tests/eletroduto-lab-2026-11-12.test.cjs`
- `x/tests/compartilhar-formatos-2026-11-12.test.cjs`
- `x/tests/fluxo-campo-17-11.test.cjs` alterado para testar diâmetro obrigatório na ficha ativa.
- `x/tests/catalogo.test.cjs` continua comparando o **snapshot histórico original**, como controle de não alteração da fonte.

**Executado isoladamente durante edição:** combinações, `missing()`, `visibleDetails()`, texto de compras com 500 m/7 lances/4 rolos, texto de e-mail e de execução, verificação sintática. **Não comprovado:** execução integral dos scripts Node no runner, renderização efetiva de PDF, abertura nos aplicativos WhatsApp/e-mail, versão em Cloudflare, sincronização em dois aparelhos e teste móvel com participantes.

## 6. Roteiro de 17/11
1. Registrar link e versão realmente publicados, estado de conta/dispositivo e cópia segura dos dados de teste.
2. Pedir a um empreiteiro que lance três eletrodutos: rígido PVC com diâmetro, flexível PVC com perfil/resistência e rígido aço com galvanização; observar dificuldade, não orientar escolhas.
3. Editar um item, mudar sua etapa e conferir agrupamentos por insumo/etapa, unidade e persistência após recarga.
4. Gerar Compras por WhatsApp, Completo por e-mail e Execução por PDF; comparar os quantitativos e a legibilidade.
5. Registrar dúvidas técnicas e corrigir **a ficha de origem** depois da validação; não ampliar famílias enquanto houver lacunas P0.
6. A aprovação de publicação requer revisão humana do conteúdo técnico, testes de regressão e aceite explícito.
