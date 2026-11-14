> **DISTINÇÃO PARA RETOMADA — 14/11/2026:** não confundir **interpretação do novo pedido** (`interpretador-condutores.js`, tags ?→✓, rascunho e Avançar, X.0.3.61) com **comparação de dois lançamentos já existentes** (`listas/correspondencia.js`, aviso conservador para conferência). Nenhuma delas confirma automaticamente características ausentes nem autoriza somas comerciais. [Marco de retomada](RETOMADA-TEREON-X-2026-11-14.md).

> **ATUALIZAÇÃO DE ESTADO — 13/11/2026, X.0.3.60:** este contrato nasceu como **proposta documental**, daí as referências históricas a “não implementado” abaixo. A **etapa conservadora de avisar possíveis correspondências entre dois lançamentos de Condutores** entrou no laboratório na X.0.3.57 (`x/listas/correspondencia.js`), ainda sem fusão automática nem nova política de compra. **Outra funcionalidade, distinta**, entrou na X.0.3.60: interpretar a *descrição de um novo pedido*, digitada ou transcrita por voz, para produzir **sugestões não confirmadas** (`x/catalogo/interpretador-condutores.js`). Ambos os fluxos consultam as fichas, mas **não devem ser confundidos nem usados como homologação**. Não foi implementada equivalência automática entre lançamentos, interpretação de foto nem alteração do motor de quantificação. [Piloto de texto/voz](PILOTO-BUSCA-NATURAL-VOZ-FOTO-2026-11-13.md) · [Changelog](CHANGELOG.md).

# TEREON X — Contrato proposto de Correspondência Técnica Progressiva
**13/11/2026 · proposta para validação do fundador · laboratório documental · não implementado no aplicativo**

## 1. A falha observada
Dois pedidos podem referir-se ao mesmo produto, mas um contém menos características:
- A: `Condutor flexível · Cobre · 2,5 mm² · Preto`
- B: `Condutor flexível · Cobre · 2,5 mm² · Preto · 450/750 V`

O campo adicional **não prova** que B seja diferente de A. A ausência de tensão em A também **não prova** que A seja 450/750 V.

**Diagnóstico confirmado no código X.0.3.56:** `x/listas/quantificacao.js` cria uma chave de consolidação com `catalogId`, pares de `values` e **nome técnico textual** (`signature()`), além da apresentação comercial. Assim, atributos adicionais ou nome diferente podem gerar grupos distintos. O motor de quantificação comercial deve permanecer intacto até que uma regra independente de compatibilidade seja homologada. Na `FT_COND-001`, o detalhe `DET-006` Classe de tensão está hoje classificado como **Opcional**.

## 2. Quatro identidades diferentes
1. **Família**: ficha `catalogId` (ex.: `FT_COND-001`), usada para encontrar materiais no agrupador visual.
2. **Identidade técnica**: vetor de atributos confirmados, comparado por IDs de detalhe, com a relevância de cada detalhe definida pela ficha (tipo, material, seção, cor, isolamento, tensão, formação/encordoamento etc., conforme aplicável).
3. **Completude**: atributos necessários para identificar tecnicamente um produto naquele ramo, que podem estar ausentes mesmo se a ficha atualmente os considerar opcionais para lançamento.
4. **Apresentação comercial**: `m`, `rl100m`, lances, barras e outras condições de fornecimento. Não determina se dois produtos são tecnicamente equivalentes, mas impede somas comerciais incompatíveis.

**Etapa de aplicação** não faz parte da identidade técnica; é preservada nos lançamentos e na rastreabilidade.

## 3. Operação proposta: comparação atributo a atributo
A comparação é **simétrica**, conservadora e não destrutiva:
- Usar `catalogId` como primeira fronteira; sem ficha identificada, **não adivinhar a equivalência**.
- Para cada detalhe considerado técnico: comparar valores **confirmados**. Igualdade usa o valor canônico da ficha, não o texto livre do título.
- Dois valores conhecidos diferentes no mesmo atributo => **conflito explícito** (ex.: Azul vs Preto, PVC vs HEPR/XLPE, 450/750 V vs 0,6/1,0 kV, Cobre vs Alumínio).
- Valor conhecido de um lado e **ausente** do outro => **lacuna** para confirmação. Nunca copiar implicitamente.
- Valores ausentes dos dois lados => informação desconhecida, **não** evidência de igualdade completa.
- Detalhes técnicos opcionais para o cadastro podem ser necessários para declarar identidade suficientemente completa. Esse conjunto deve ser **definido por tipo de produto na ficha**, não hardcoded em um nome de material.
- `DET-011` (Unidade) é comercial e deve ser excluído da comparação de identidade técnica, mas incluído na chave de consolidação para compras.
- Normalização segura: acentos, espaço, caixa e representação conhecida de valores da ficha (ex.: `2,5` e `2,50` mm²) podem ser reconciliados; não normalizar tensões, isolantes, cor ou encordoamento por aproximação textual.
- A entrada `450` isolada é **sugestão não confirmada**; não autoriza preencher `450/750 V`.

## 4. Classificação de um par (não usar score como critério de segurança)
| Estado | Condição | Conduta do TEREON |
|---|---|---|
| **Identidade confirmada** | Família compatível, atributos técnicos discriminantes preenchidos e iguais, sem conflitos | Elegível à consolidação **somente se** também houver compatibilidade comercial, origem rastreável e demais condições atuais do motor |
| **Potencial correspondência** | Sem contradições, mas pelo menos um atributo relevante não foi confirmado em um ou ambos | Sugerir revisão. Nunca fundir ou copiar atributos automaticamente |
| **Incompatibilidade** | Pelo menos uma característica técnica conhecida conflita | Manter separado e informar qual característica diverge |
| **Indeterminado** | Falta família, âncoras mínimas, há valor ambíguo/não validado, ou existem várias alternativas plausíveis | Não propor equivalência exclusiva; mostrar dúvidas e pedir especificação |

**Atenção:** o estado pode mudar após confirmação explícita. Não persistir “igualdade” como atributo do produto; reavaliar a comparação em função dos valores atuais.

## 5. Regras de comportamento para o laboratório
- **Sem mutação implícita:** a comparação apenas aponta possibilidades. Confirmar uma tensão em A é ação explícita de edição do lançamento A. Exibir origem e detalhe modificado.
- **Revisão contextual:** evitar sobrecarregar a lista com novas tags. Uma ação discreta `Revisar possíveis correspondências` pode abrir o próprio modal de especificação já aprovado e apresentar a diferença por atributo.
- **Mais de uma alternativa:** se A sem tensão é compatível com B (450/750 V) e C (0,6/1,0 kV), listar ambos; **nunca** escolher automaticamente o item mais frequente ou o primeiro.
- **Origem preservada:** manter ID, etapa, quantidade e a informação originalmente digitada; registrar confirmação/edição sem sobrescrever silenciosamente outro lançamento.
- **Compra protegida:** nenhuma soma de quantidades incertas no relatório WhatsApp, e-mail ou PDF. Sugerir revisão antes da geração se houver possibilidades pendentes; se o usuário prosseguir, linhas permanecem separadas com alertas apropriados (decisão de UX ainda não aprovada).
- **Normalização do nome:** só depois de estabilizar o contrato, investigar remoção de `item.name` da chave de equivalência para fichas estruturadas; manter estratégia conservadora para itens legados, textos livres ou dados de versões anteriores.
- **Não substituir `quantificacao.js` agora:** separar o novo comparador em módulo puro, com testes, e integrá-lo gradualmente; não permitir que agrupamento visual altere cálculos.

## 6. Matriz mínima de casos para validação
| Caso | Diferença | Expectativa |
|---|---|---|
| C01 | A sem tensão; B com 450/750 V, demais atributos iguais | Potencial correspondência, falta confirmar tensão de A |
| C02 | A com 450/750 V; B com 0,6/1,0 kV | Incompatibilidade, informar tensão divergente |
| C03 | A preto; B azul, demais atributos iguais | Incompatibilidade, informar cor |
| C04 | A cobre; B alumínio | Incompatibilidade, informar material |
| C05 | A PVC; B HEPR/XLPE (valor agregado da ficha atual) | Incompatibilidade, informar isolação |
| C06 | A classe V; B classe II | Incompatibilidade, informar classe de encordoamento |
| C07 | A sem cor; B preto | Potencial correspondência, pedir cor de A (caso de importação/legado) |
| C08 | A sem tensão; dois candidatos B 450/750 V e C 0,6/1,0 kV | Indeterminado entre candidatos, jamais escolher |
| C09 | Mesmo vetor técnico completo; nomes formatados de forma diferente | Mesmo produto técnico; conferir apresentação antes de consolidar |
| C10 | Mesmo vetor técnico; `m` vs `rl100m` | Identidade técnica possível; **linhas de compra separadas** |
| C11 | `450` em texto de entrada, ainda não confirmado | Não tratar como 450/750 V; solicitar confirmação |
| C12 | Mesmo `catalogId`, diferentes bitolas 2,5 e 4,0 mm² | Incompatibilidade; família visual pode ser a mesma |
| C13 | Mesma seção escrita 2,5 e 2,50, mesma unidade mm² e valores confirmados | Equivalência normalizada de seção |
| C14 | Ausência de `catalogId` / valores de registro legado | Indeterminado; sem inferência técnica, preservar lançamento |
| C15 | Produto com valor de ficha agregado `HEPR ou XLPE` confrontado com HEPR específico | Indeterminado; ficha deve desmembrar alternativa para igualdade definitiva |

Esta matriz será guardada também em fixture JSON, que **ainda não executa** no produto; ela servirá de oráculo para implementar o comparador isolado.

## 7. Sequência de implementação e critérios de aceite
**Fase A — Aprovar a matriz:** testar casos com itens do uso real; decidir campos discriminantes obrigatórios para identidade da família Condutores (especialmente tensão, isolação e classe), sem promover publicação da ficha por inferência.

**Fase B — Motor puro de comparação (ambiente experimental):** `compareTechnical(a,b,ficha)` retorna `status`, `matchedFields`, `missingFields`, `conflicts` e `ambiguities`; sem DOM, banco, rede, efeitos colaterais ou atualizações de quantidades. Testar simetria, imutabilidade, casos múltiplos e preservação de legado.

**Fase C — UX de revisão:** a partir de uma família na lista ou após incluir um item, oferecer revisão opcional das correspondências no modal existente; só editar após aceite explícito.

**Fase D — Consolidação comercial (se e só se validada):** rever a chave `signature()` de forma controlada, com separação entre identidade técnica e apresentação, cobrindo rolos/lances, composição, unidades antigas, etapas, relatórios e dados já salvos.

### Bloqueadores de publicação “Oficial” da FT_COND-001
No snapshot atual ela está com `maturidade: Consolidado`, mas com `status: Em revisão` e `homologada: false`. Antes de publicação, avaliar: tensão `DET-006` opcional; isolação `HEPR ou XLPE` representada como uma única opção; compatibilidade tensão/isolação/cobertura; classe de encordoamento; e regras de exclusão/condicionais do fichário. Não utilizar este contrato de equivalência como atalho para homologar produtos.

**Estado da rodada:** contrato e casos documentados para revisão; nenhum comportamento do aplicativo alterado neste documento. O fundador decide a política final após leitura dos casos concretos.
