# TEREON X — Arquitetura modular consolidada

**Revisão de documentação: 14/11/2026.** Preserva-se o relato arquitetural completo anterior em [docs/ARQUITETURA-MODULAR-PRE-SANEAMENTO-2026-11-14.md](docs/ARQUITETURA-MODULAR-PRE-SANEAMENTO-2026-11-14.md). Referências ativas: [Contratos](docs/CONTRATOS-VIGENTES.md) e [Estado](docs/ESTADO-ATUAL.md).

## Fronteiras
1. **Fichas/Catálogo:** oferecem detalhes, valores, ordem, obrigatoriedade, condicionais, conflitos, nome e unidade. Fonte técnica é o Fichário revisado; snapshot LAB não é publicação Oficial.
2. **Interpretador:** descrição digitada ou transcrita por voz gera **hipóteses de Condutores**; não as confirma, não grava item, não calcula compra.
3. **Confirmação do rascunho:** transporta somente propostas aceitas por toque e permitidas pelo motor de ficha; jamais completa silenciosamente.
4. **Listas/Serviço:** único dono de lançamentos, IDs, etapas, quantidades, unidades, edição, exclusão e persistência.
5. **Correspondências:** compara lançamentos já existentes conservadoramente; lacuna não significa igualdade e aviso não autoriza fusão.
6. **Quantificação:** calcula por item técnico e unidade comercial, sem misturar rolos, barras, lances ou tensões/cores diferentes.
7. **Compartilhamento:** projeção de leitura Compras/Completo/Execução; não modifica Lista, não cria Solicitação.
8. **Identidade/Nuvem:** autorização de contas/obras e sincronização são serviços separados; rede ON não é sincronizado.
9. **Obras/Universo/Diário:** motores independentes, sem mudar modal e regras de Listas.
10. **PWA e interface:** apenas organiza navegação, sem regras técnicas hardcoded; modal aprovado e tags ?→✓ antes da ficha.

## Governança
Cada mudança precisa de decisão, contrato afetado, caminhos/branch/SHA, testes automáticos, ensaio real, deploy conferido e aceite. Não remover função aprovada, não alterar main nem Fichário de origem por reflexo de laboratório. Histórico de propostas e debates na cópia integral e no [CHANGELOG](docs/CHANGELOG.md).
