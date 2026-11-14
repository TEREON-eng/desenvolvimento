# TEREON X — Documento Mestre consolidado

**Consolidado em 14/11/2026.** Contém somente visão, princípios e decisões atuais. Evidências variáveis ficam em [ESTADO-ATUAL.md](ESTADO-ATUAL.md), e normas de implementação em [CONTRATOS-VIGENTES.md](CONTRATOS-VIGENTES.md). [Original integral pré-saneamento](MESTRE-TEREON-X-PRE-SANEAMENTO-2026-11-14.md) foi preservado.

## 1. Identidade e origem
**TEREON — Tecnologia que faz a engenharia fluir.** O produto sucedeu o nome DataFluxx. Nasceu do retrabalho e das informações desencontradas de levantamentos de materiais e reformas escolares: eletricista, encarregado, engenheiro, comprador e ERP podem descrever de maneiras diferentes o mesmo pedido.

**Princípio central:** a pessoa não precisa se organizar antes de usar o sistema. Ela pede o material na linguagem que conhece; o TEREON interpreta, organiza e orienta a especificação. **A correção técnica prevalece sobre conveniência; o sistema não inventa nem confirma atributos técnicos sozinho.**

## 2. Público e proposta de valor
Estudantes/iniciantes, eletricistas, encarregados e engenheiros. Versão **gratuita permanente**, útil e tecnicamente correta; módulos pagos podem aprofundar recursos, não reduzir rigor técnico do grátis. Plano/preço/cobrança são hipóteses, documentadas separadamente em [MODELO-GRATUITO-PAGO.md](MODELO-GRATUITO-PAGO.md).

## 3. Produto em camadas
- **Semente atual:** Listas → Catálogo/Fichas → Especificação progressiva → Quantidades/Etapas → Compartilhar.
- **Ferramentas técnicas seguintes:** consultas e dimensionamento; a planilha ELT_DIM, propriedade intelectual declarada do fundador, é referência técnica a auditar e integrar em etapa futura, **não um motor já integrado**.
- **Universo/Obras:** contexto de obra com Escopo → Etapa → Subetapa, alocações, Diário, visitas e colaboração; partes existem como **laboratórios** independentes.
- **Processo futuro:** Solicitações, aprovação, compras, recebimentos, rastreabilidade e integração com ERP.
- **Horizonte:** Escola TEREON, catálogo ampliado, entrada por foto e marketplace/integrador, sem bloquear o núcleo.

## 4. Regras estruturais
A **ficha** define detalhes, valores, ordem, obrigatoriedade, condições, conflitos e nome. O **interpretador** propõe hipóteses a partir de texto ou voz; só as confirmadas entram na ficha validada. A **Lista** é dona dos lançamentos, quantidades, unidades e etapas. A **quantificação** trabalha por identidade técnica confirmada e unidade comercial compatível. **Relatórios** são projeções de leitura, não compra automática nem mutação do histórico.

Família visual, identidade técnica, completude e apresentação comercial são quatro coisas distintas. Não agregar cores, seções, tensões nem unidades de compra diferentes só por pertencerem à mesma família.

## 5. Experiência preservada
Mobile-first/PWA. **Adicionar item** abre o modal aprovado. No primeiro nível, o usuário escreve ou dita; sugestões de Condutores aparecem em tags pequenas **?**, toque para **✓**, nome técnico em formação e um único **Avançar para especificação**. Só escolhas confirmadas e tecnicamente válidas avançam. Dentro da ficha, tags de detalhes aplicáveis, pendentes em símbolos abreviados, texto da tag para revisitar e × vermelho para remover; barra de progresso apenas informativa. **Sem segundo painel grande de confirmação nem setas descartadas.** Seleção manual continua acessível.

## 6. Governança e evolução
- Fichário **Oficial** só com revisão e aprovação explícita. **Consolidado** pode significar maturidade da estrutura, sem tornar a ficha **Em revisão** homologada.
- Juliano pode elaborar/propor fichas; aprovação/publicação permanece com o fundador segundo decisão registrada.
- Desenvolvimento na branch **desenvolvimento**; passagem à main exige evidência, regressão e aprovação. Funções já aceitas não devem desaparecer.
- Contas, visitantes, colaboração e estados de sincronização são diferentes de fases futuras de Solicitações/Compras.
- O ensaio de **17/11/2026** é supervisionado/restrito. Início oficial em **01/01/2027** é objetivo pretendido, sujeito a testes; abril/2027 permanece marco de revisão planejado.

## 7. Como ler o restante do projeto
[Contratos vigentes](CONTRATOS-VIGENTES.md) · [Estado e bloqueios](ESTADO-ATUAL.md) · [Guia visual](GUIA-VISUAL-TEREON-X.md) · [Mapa dos módulos](MAPA-MODULOS.md) · [Índice geral](INDICE-DOCUMENTACAO.md) · [História e proveniência](HISTORIA-INDICE-E-VERIFICACAO-2026-11-14.md). O CHANGELOG e os documentos datados preservam decisões passadas **sem precedência normativa**.
