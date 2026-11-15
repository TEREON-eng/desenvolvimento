# TEREON — Estratégia v2 para produzir informação técnica com IA

**15/11/2026 · decisão de arquitetura / laboratório de dados · NÃO é alteração do app em produção.**

## Objetivo de negócio
Construir listas de materiais elétricos **bem especificadas e comercialmente plausíveis**, sem tentar enumerar todos os SKUs existentes. O profissional deve poder construir qualquer especificação relevante; uma referência de fabricante é evidência de viabilidade comercial, não uma restrição absoluta que impeça criar itens sem correspondência conhecida.

**O aplicativo, o modal aprovado, a experiência de tags, quantidade/unidade/etapa e o motor de Listas permanecem intactos.** O que mudará é **como produzimos, revisamos e atualizamos a informação técnica** que alimenta as fichas e o recomendador.

## Auditoria da situação atual antes do reset
No arquivo efetivamente consumido pelo PWA, `x/fichario-x/fichas-lab-2026-11-12.json`, existem **6 fichas**, todas `Em revisão` e **nenhuma homologada**:
- `FT_INFRA-001` Eletroduto
- `FT_COND-001` Condutores isolados
- `FT_INFRA-002` Curva para eletroduto
- `FT_INFRA-003` Conectores para eletroduto
- `FT_INFRA-004` Abraçadeiras
- `FT_INFRA-005` Caixa de passagem

O `x/catalogo/motor.js` importa esse snapshot e o `x/listas/app.js` guarda referências por `catalogId`. O laboratório do recomendador também usa essa fonte. **Apagar agora as seis fichas pode deixar o modal sem seleção e quebrar a edição/agrupamento de itens de listas antigas.** Isso é risco técnico, não resistência à mudança.

### Decisão segura sobre “zerar”
- A **v2 começa vazia**, em `x/catalogo-v2/registro-lab.json`, sem nenhuma ficha aprovada, produto ou regra técnica. **Não é carregada pelo app**.
- A v1 continua sendo **legado experimental de trabalho** até a v2 satisfazer os casos essenciais, ser aprovada e permitir compatibilidade por identificador.
- **Não apagar listas pessoais, dados na nuvem, quantidades, etapas, PDFs ou versões históricas de ficha.** Não atribuir silenciosamente novo `catalogId` a itens gravados.
- Após avaliação de cobertura, podemos substituir **o catálogo oferecido a novos lançamentos** por um conjunto v2 enxuto. Itens históricos continuam legíveis/editáveis, com versão e origem identificáveis; nunca remover ficha usada sem adaptador ou snapshot.
- A mudança de fonte é **separada** da publicação/homologação e do teste supervisionado de 17/11.

## Cadeia de criação de fichas assistida por IA

**Entrada do fundador:** categoria/família desejada + fabricantes e, opcionalmente, linhas, referências ou catálogos.

**1. Pesquisa e evidências:** buscar fontes originais de fabricantes, fichas técnicas, tabelas comerciais, PDFs e instruções de aplicação. Extrair modelos **com códigos quando identificados**. Para cada atributo, registrar origem/URL, documento/edição, página ou trecho, consulta, tipo de evidência e grau de confirmação. Catalogar o que aparece, sem completar lacunas por semelhança entre SKUs.

**2. Leitura transversal:** comparar modelos de mais de um fabricante, identificar campos comuns e variantes relevantes para comprar/especificar: construção, tensão, diâmetro, classe, corrente, instalação, dimensões, proteção, acessórios, cor e unidade, conforme a família. **Não elevar especificação da linha inteira para cada modelo** e não inferir características incompatíveis a partir de outros produtos.

**3. Proposta de ficha genérica:** IA sugere perguntas, opções, dependências, incompatibilidades, obrigatoriedades condicionais, sinônimos do pedido e regra de formação do nome. A ficha genérica NÃO é lista de SKUs nem catálogo de fabricante. Pode permitir uma especificação tecnicamente coerente ainda sem produto correspondente na base.

**4. Regras independentes:** distinguir (a) exigências técnicas/normativas e condições de aplicação que precisam de suporte próprio; (b) combinações comerciais demonstradas por referências; (c) heurísticas do motor de interpretação. Nunca promover (b) a obrigação universal nem (c) a verdade normativa. Ausência em catálogo não prova inexistência comercial.

**5. Revisão humana:** entregar um lote auditável: fichas propostas, exemplares comerciais, fontes por característica, campos não encontrados, conflitos e decisões pendentes. **Somente o fundador aprova/publica** no catálogo Oficial. Propostas de IA permanecem em laboratório e podem ser corrigidas, comparadas e descartadas.

**6. Teste de pedidos comuns:** exercitar poucas frases típicas por família e seus ajustes por tags, assegurar material com nome, quantidade/unidade de compra e etapa, testar erro/pendência, compartilhamento e edição de lista. O objetivo é utilidade, não volume de registros.

## Contrato de dados v2 (separação de responsabilidades)
- **Família:** código estável, nome, sinônimos e tipo; sem marca obrigatória.
- **Ficha técnica genérica:** atributos especificáveis, opcionais/obrigatórios condicionais, relações, nome técnico; status proposta/revisão/publicada.
- **Produto comercial:** fabricante, linha, SKU/referência, características efetivamente declaradas; sem suposições de compatibilidade. Documento por SKU quando possível.
- **Evidência:** fonte, data de consulta, escopo (linha x SKU), atributo, texto/parâmetro extraído e campo não informado.
- **Regra técnica:** norma/manual ou raciocínio técnico declarado, condições, exceções e validação humana; não derivar só de correlação entre produtos.
- **Experiência do profissional:** lista atual → escolha já confirmada → ficha/catálogo; tags editáveis e ficha manual sempre disponíveis.

Na saída para lista de compras, uma **especificação genérica suficiente** pode ser válida sem indicar SKU. Ao sugerir SKU real, distinguir claramente **exemplo comercial documentado** de **homologação de projeto**. Preço/estoque não são metas desta fase.

## Primeiro lote sugerido e critérios de aceite
Começar por **Condutores**, porque o interpretador e a dinâmica de tags já estão instrumentados. Trabalhar com pequena amostra de fabricantes/linhas de referência e pedidos reais, sem tentar cadastrar tudo. Em segundo lugar Infraestrutura. Na geração de regras, buscar amplitude entre fabricantes e não otimizar a ficha exclusivamente para uma única marca.

Para aceitar uma família v2: (1) descrição técnica mínima coerente; (2) dependências validadas; (3) pelo menos algumas variantes comerciais rastreáveis; (4) pedidos típicos compreendidos; (5) caminho manual funciona; (6) nenhuma informação inventada; (7) regressão do modal/Listas/compartilhamento; (8) aprovação explícita.

## Próximo passo operacional
O fundador escolhe fabricantes e linhas para o **primeiro lote**; as fontes e fichas propostas são registradas na base v2, com auditoria. **Não existem produtos reais importados neste commit.** O piloto comercial Cemar/Brum anterior segue como pesquisa separada, sem importação automática e sem publicar regras em Quadros.

**Estado desta mudança:** apenas arquitetura/registro isolado e testes de não interferência. **Sem reset destrutivo, sem deploy exigido, sem mutação da v1 nem das listas.**
