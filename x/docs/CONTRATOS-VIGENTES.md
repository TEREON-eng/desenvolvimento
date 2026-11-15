# TEREON X — Contratos operacionais vigentes

**Consolidado em 14/11/2026.** Esta é a referência atual de regras. O acervo de adendos anterior foi preservado em [CONTRATOS-VIGENTES-PRE-SANEAMENTO-2026-11-14.md](CONTRATOS-VIGENTES-PRE-SANEAMENTO-2026-11-14.md). Consulte [ESTADO-ATUAL.md](ESTADO-ATUAL.md) para evidência concreta e pendências.

| Contrato | Regra inviolável |
| --- | --- |
| CT-01 Governança | Alterar na branch desenvolvimento; proteger main. Exigir regressão, rastreabilidade e aceite explícito. Não perder recursos aprovados. |
| CT-02 Modal | Preservar addDialog aprovado, seleção manual, fluxo de voltar/editar e sem múltiplas telas paralelas ou painéis grandes duplicados. |
| CT-03 Fichário | Regras de detalhe, obrigatório, condicional, conflito, nome e unidade vêm da ficha. Snapshot LAB ≠ catálogo Oficial. |
| CT-04 Interpretação | Descrição/voz gera **propostas**, nunca confirma nem grava. Tags ?→✓ exigem gesto explícito; modificar texto descarta confirmações antigas. |
| CT-05 Validação | Avançar transporta somente hipóteses confirmadas, visíveis, disponíveis e sem conflitos; permite prosseguir vazio para especificação manual. |
| CT-06 Listas | Serviço de Listas é dono de ID, quantidade, unidade, etapa e operações CRUD; interfaces não escrevem no storage diretamente. |
| CT-07 Nuvem | Visitante e conta segregados; estado de rede não prova nuvem; preservar dados e conflitos, nunca excluir automaticamente registro em divergência. |
| CT-08 Compras | Quantificação não soma itens técnicos diferentes nem apresentações comerciais incompatíveis. Família visual recolhível não altera chave comercial. |
| CT-09 Compartilhar | WhatsApp/e-mail/PDF, perfis Compras/Completo/Execução, usam snapshot sem modificar dados, preservar rolos, lances, barras, etapas e origem. |
| CT-10 Identidade | Conta pessoal e acesso por obra/espaço são conceitos separados. Testar RLS, várias contas e revogação antes de homologar. |
| CT-11 Universo | Obras, Escopo → Etapa → Subetapa, Diário e Equipes são motores independentes de Listas. |
| CT-12 Solicitações | Pendente/Aprovada/Em compras/Comprado/Recebido são estados de processo futuro, não de sincronização de Lista. |
| CT-13 Interface | Temas Claro/Escuro/TEREON preservam comportamento, contraste e acessibilidade; tags de ficha e barra informativa seguem fluxo aprovado. |
| CT-14 Release | Decisão, implementação, CI, aparelho, deploy e homologação são etapas distintas, cada uma exigindo evidência própria. |
| CT-15 Recomendação (LAB) | Prioridade de busca Lista atual → histórico confirmado do usuário → catálogo técnico auditado. Mostrar candidatos completos com origem, alternativas expandíveis e Personalizar; lacunas requerem pergunta/revisão. Não escolher por popularidade, não usar ausência de clique como rejeição, não somar itens sem aceite. |

## Entrada progressiva vigente
1. No primeiro nível do modal, o pedido é digitado ou transcrito pelo navegador no **mesmo campo**.
2. Interpretador de Condutores retorna família/propostas/avisos; cada tag com **?** depende de confirmação humana **✓** e pode ser desmarcada.
3. O nome técnico parcial usa apenas escolhas aceitas. **Avançar** valida com catálogo (visibleDetails/optionStates/conflicts) e entrega à ficha somente valores válidos. Sem confirmação, continua manualmente.
4. Na ficha, mostrar detalhes aplicáveis, inclusive opcionais; texto de tag navega sem mutar, **× vermelho** remove. Barra não clicável, sem setas da X.0.3.57. Painel de confirmação duplicado da X.0.3.60 é revogado.
5. Voz depende de suporte, permissão, rede e possivelmente serviço externo; texto sempre disponível. Não armazenar áudio no TEREON. Fotos não implementadas.

## Próxima experiência principal (decidida; implementação no PWA pendente)
A entrada por tags permanece operacional e **a ficha manual/detalhada continuará disponível mesmo depois da adoção do recomendador**. A camada de recomendações vem **antes** da ficha, nunca a substitui. A **experiência-alvo** é: pedido texto/voz → sugestões completas e tecnicamente coerentes, incluindo origens e diferenças → escolha do conjunto ou Personalizar na ficha → revisão de correspondências da Lista sem fusão automática. Ordenação: **Lista atual → escolhas anteriores confirmadas → catálogo auditado**. Sugerir de modo conservador, com perguntas somente quando necessárias. O laboratório de ranqueamento de Condutores está em [RECOMENDADOR-TECNICO-CONDUTORES-2026-11-15.md](RECOMENDADOR-TECNICO-CONDUTORES-2026-11-15.md); não foi conectado ao PWA e não usa IA treinada. 

## Identidade técnica e comercial
**Família** (catalogId) ≠ **identidade técnica confirmada** ≠ **completude** ≠ **unidade/apresentação de compra**. Ausência de dado não indica equivalência, conflito de cor/tensão/bitola impede fusão, e unidade m/rl100m/br3m/lance exige tratamento comercial distinto. Detector de correspondências pode **sugerir revisão**, não copiar atributos nem consolidar automaticamente.

## Limites técnicos
FT_COND-001: estrutura **Consolidada**, status **Em revisão**; tensão DET-006 opcional e opção agregada HEPR/XLPE precisam revisão técnica na fonte. Eletrodutos e Curvas têm lacunas ou ensaios LAB ainda não publicados como Oficial. Status de ficha fica no **seletor inicial**, não inferido do número de lançamentos. Não usar relatório de laboratório como pedido de compra homologado.

## Protocolo de alteração
Antes de mudar: **problema → decisão → contratos afetados → caminhos/branch/SHA → testes automáticos → ensaio no aparelho → deploy comprovado → aceite**. Atualizar este documento substituindo trechos superados; preservar tentativa e histórico no CHANGELOG/Diário.

### Laboratório UX — sugestão principal e tags removíveis (15/11)
A apresentação inicial deve conter **um único candidato principal**, com as características sugeridas em tags com ×, as demais opções somente em menu expansível e **Editar esta sugestão** como caminho de primeira classe. Remover tag altera unicamente o rascunho; material originalmente recomendado não é mutado. Se remover atributo necessário, mostrar pendência e bloquear confirmar como está, mas manter a ficha editável com as demais características. **Escolher especificação** e **Editar** continuam opções distintas. A ficha completa permanece acessível para criar do zero. No momento, o recurso existe **somente em laboratório HTML**, não no PWA real.
