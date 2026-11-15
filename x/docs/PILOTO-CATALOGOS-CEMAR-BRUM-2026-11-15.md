# TEREON — Piloto de catalogação de fabricantes: quadros Cemar/Legrand e Brum

**15/11/2026 · proposta técnica com amostra de dados reais · SEM INTEGRAÇÃO AO APP OU HOMOLOGAÇÃO.**

## Por que fazer
O objetivo não é copiar catálogos inteiros ou treinar um modelo a decorar descrições comerciais. É formar um **índice técnico verificável por referência de fabricante** que alimente o recomendador de materiais completos do TEREON. Usuário informa pedido por texto/voz; o motor busca itens da lista atual → histórico confirmado do solicitante → índice do catálogo; **filtra tecnicamente** e mostra poucos candidatos, com demais opções expansíveis e botão Personalizar (ficha manual). Se necessário, pergunta apenas o detalhe com maior poder de discriminar (p.ex. capacidade de módulos e corrente nominal anunciada, em conjunto).

## Resultado da conferência de fabricantes
- **Cemar / Legrand:** na linha metálica QDSTN-TG II / QDSTN-TG U II, o catálogo web lista sobrepor 16 DIN 100 A branco **904331N**, 16 DIN 150 A branco **904461BRN** e 24 DIN 150 A branco **904462BRN**. A mesma capacidade em módulos pode aparecer com correntes distintas. Valores de corrente são os anunciados nos títulos; a corrente certificada de cada montagem e a inclusão de barramentos precisam de ficha detalhada.
- **Brum:** a página oficial da linha **VOLT** descreve versão VOLT 100 como até **120 A**, versão VOLT 250 como até **250 A** e 72 polos DIN, e informa aço-carbono, IP40/IK08 para a linha. Essas são declarações de *linha*, **não SKU homologado**, e não autorizam concluir que algum barramento vem incluso.
- **Brum BR:** linha em ABS, sobrepor/embutir, até 72 polos, IP40/IK06 no resumo oficial. A corrente do modelo individual **não consta na página consultada** e deve ficar desconhecida até outra fonte.
- A Brum publica linhas e indica catálogo/ficha técnica; alguns downloads dependem de formulário ou não estavam acessíveis para verificação nesta consulta. Não inferir dado faltante.
- O fabricante pode vender quadro sem barramento, com barramento ou kit separado. Registrar **explicitamente** conteúdo fornecido, classificação de corrente e referência do barramento e distinguir corrente do conjunto, barramento e disjuntor geral.

## Fontes primárias
1. [Legrand / Cemar — linha QDSTN-TG II](https://www.legrand.com.br/pt-pt/catalogo/quadros-e-paineis/quadros-distribuicao-metalicos/qdstn-tg-ii-qdstn-tg-u-ii)
2. [Brum — linha VOLT](https://www.brum.com.br/linha-volt)
3. [Brum — linha BR](https://www.brum.com.br/linha-br)
4. [Brum — linhas e barramentos](https://www.brum.com.br/produtos)

## Modelo mínimo da base de importação
`x/catalogo/fontes/catalogos-piloto-2026-11-15.json` contém registro de fontes + exemplos normalizados; não integra o motor. Para cada SKU: **fabricante, série, referência, categoria TEREON candidata, atributos explicitamente informados, unidade, opcionais incluídos, acessórios compatíveis, URL/página de origem, data de captura e estado de revisão**. Informações por linha ficam marcadas como `linha`, nunca copiadas automaticamente para produtos individuais.

**Regras:** 
1. Importar CSV/XML, API, página oficial ou PDF autorizado → identificar SKU e colunas → normalizar valores/unidades → marcar contradições e campos ausentes → comparar com ficha técnica TEREON → revisão humana → publicar índice para recomendador. O histórico da origem e versões das fichas deve continuar consultável.
2. **Catálogo do fabricante** é fonte técnica; **catálogo do distribuidor/fornecedor** é fonte de oferta, sinônimo e código comercial, e não deve prevalecer silenciosamente sobre ficha do fabricante.
3. Sem SKU, fazer registro de **linha**, nunca simular produto concreto. Sem informação sobre barramento, registrar “não verificado”, não “incluso”. Corrente divulgada no título não é autorização para dimensionamento.
4. Produtos sem ficha TEREON auditada ficam como **candidatos em revisão**, com URL; não entram no catálogo Oficial nem são definidos como equivalentes por semelhança textual.
5. Respeitar termos de uso, direitos autorais e autorizações dos arquivos de fabricantes; não republicar PDFs integralmente como acervo do app sem permissão. Guardar dados factuais normalizados, procedência e links.
6. Processar novas edições com comparação: itens adicionados, obsoletos, referências alteradas, atributos conflitantes. Nunca sobrescrever a evidência anterior.

## Motor de recomendações
- Filtrar **primeiro** por incompatibilidades técnicas e contexto explícito. Não usar popularidade para ignorar norma, corrente, classe de tensão, IP, quantidade de módulos ou informações relevantes.
- Ordenar os elegíveis: (1) **itens já existentes na Lista**, marcados como incompletos se estiverem assim; (2) **especificações previamente confirmadas pelo solicitante**; (3) **SKU e construções auditadas do catálogo**; dentro da faixa, usar similaridade do pedido e frequência/recência.
- Apresentar 2–3 opções principais e **Ver mais** expansível; permitir **Personalizar** para entrar na ficha. Quando uma decisão separa materiais diferentes (corrente/capacidade/tipo), perguntar **uma característica decisiva**, em vez de exigir todas as tags.
- Detectar **idêntico** (conjunto técnico confirmado, unidade compatível), **parecido com lacunas** (pedir revisão antes de somar) e **diferente** (não mesclar).
- Aprendizado: registrar seleções **confirmadas** como preferências, com controle do usuário; não escolhido não significa “rejeitado”. Uma opção explicitamente marcada como “não é isso” pode reduzir sua prioridade **naquele contexto**, sem contaminar a ficha ou usuários alheios.
- Não armazenar transcrição/áudio para treinamento global sem finalidade, transparência e controles adequados; manter perfil de recomendações separável e com opção de reinicialização.

## Status e próximos passos
**Feito nesta rodada:** primeiras fontes oficiais verificadas e seis registros iniciais (três SKU Cemar e três famílias Brum) em JSON, **sem liberação de compra**. 
**Pendente:** obter fichas individuais Brum e Cemar, confirmar significados de corrente, inclusões/acessórios, completar modelo de Quadro na ficha TEREON e construir importador/validador separado.
**Escopo:** branch desenvolvimento apenas; não substituir Fichário.xlsm, não mexer em Listas nem em produção.
