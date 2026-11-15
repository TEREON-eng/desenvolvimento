# TEREON — Recomendador técnico de materiais, piloto de Condutores

**Decisão de produto 15/11/2026; código de laboratório não integrado ao PWA.**

## Dor que estamos resolvendo
O fluxo atual usa o fichário como questionário e exige muitos toques. Pedidos incompletos criam lançamentos parecidos com especificações inconsistentes, gerando duplicidade e insegurança nas compras. A experiência alvo passa a oferecer **materiais completos para escolha**, usando fichas como validação e personalização — sem inventar atributos.

## Experiência alvo
1. Profissional escreve ou fala o pedido espontâneo.
2. Recomendador pesquisa **lista atual**, **histórico de especificações efetivamente confirmadas** daquele solicitante, **catálogo técnico auditado** — nessa precedência.
3. Mostra 2 ou 3 alternativas completas e comparáveis, com origem e diferenças (por exemplo, 450/750 V versus 0,6/1 kV); **Ver todas** abre menu expansível. Material incompleto já lançado fica em área **Revisar**, não recebe selo completo.
4. **Personalizar** abre a ficha aprovada preenchida com o candidato, com edição e validação de dependências. No caso de lacuna decisiva, mostrar pergunta objetiva sobre aquela característica, sem preencher por frequência.
5. Usuário confirma o **conjunto técnico visível** de uma vez. Antes de lançar, sistema verifica possíveis equivalentes; itens confirmadamente idênticos podem propor adicionar quantidade ao já existente **com aceite explícito**, preservando etapas e lances. Ambiguidade não autoriza fusão.
6. Aprender preferências do usuário a partir de seleção/confirmação explícita. Não ter escolhido opção em uma busca NÃO prova preferência negativa. Rejeição explícita pode influenciar ordem naquele contexto, nunca o fichário.

## Arquitetura
- **Interpretação:** `interpretador-condutores.js` extrai hipóteses e alertas; voz transcreve o mesmo campo. Não substituir por IA probabilística sem trilha.
- **Candidatos:** `recomendador-condutores.js` é módulo **puro de laboratório** que classifica registros de Lista, Histórico e Catálogo. Não gera combinações por produto cartesiano nem altera o storage.
- **Ficha:** `catalogo/motor.js` verifica visibilidade, opções, conflitos e obrigatórios. Para recomendação de Condutores, **tensão precisa estar definida** mesmo que o snapshot histórico ainda a classifique como opcional. “HEPR ou XLPE” não identifica isolamento único.
- **Preferências:** histórico contém somente escolhas confirmadas e devidamente autorizadas; evitar usar áudio bruto, transcrição ou escolhas de terceiros como treinamento geral.
- **Catálogos:** fabricantes → referência/linha/atributos/fonte/revisão → ficha TEREON → aprovação. Ofertas de distribuidores acrescentam código e sinônimos, não homologação. Ver [piloto Cemar/Brum](PILOTO-CATALOGOS-CEMAR-BRUM-2026-11-15.md).

## O que o protótipo já faz e não faz
**Faz:** apresenta candidatos previamente especificados; prioriza fontes por ordem fixa; deduplica apresentação apenas de especificações **completas idênticas** preservando múltiplas ocorrências; nunca soma quantidades. Diferencia candidato completo de ficha homologada. Rejeita conflito de cor explícita e seção; trata menção isolada “450” como ambígua e não a confirma.

**Não faz:** montar candidatos completos a partir de cadastro parcial, gerar variantes nem selecionar automaticamente uma delas; não integra tela, nuvem, compras ou IA generativa. Isso requer fichas saneadas e base de SKUs auditada.

## Próximos gates
1. **Condutores:** revisar na fonte FT_COND-001 tensão, tipo, isolação HEPR versus XLPE, classe de encordoamento e consistência dos nomes; publicar status somente após aceite técnico.
2. Alimentar fixtures com pedidos reais anonimizados e registros completos auditados. Cobrir ambiguidades, conflitos e perguntas de desambiguação.
3. Verificar regressão CI completa e estado da versão em Cloudflare.
4. Experimentar lista de cards recomendados no modal, em laboratório visual, sem substituir o fluxo manual nem mudar o modal aprovado; medir passos.
5. Expandir fichas e dados: Infraestrutura → Proteção → Quadros, mantendo o mesmo motor de perguntas e o índice de catálogos.

## Histórico da decisão
Esta linha substitui **a montagem característica por característica como experiência principal pretendida**, mas não remove a implementação anterior até prova e aprovação da nova dinâmica. O fichário passa a ser base do motor e ferramenta de correção. Nenhuma ficha passou a Oficial por este documento.
