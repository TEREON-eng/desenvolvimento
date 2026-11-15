# TEREON X — Regressão e aceites ativos

**Estado observado em 15/11/2026, desenvolvimento X.0.3.62 (versão declarada).** Original com adendos históricos: [TESTES-REGRESSAO-PRE-SANEAMENTO-2026-11-14.md](TESTES-REGRESSAO-PRE-SANEAMENTO-2026-11-14.md).

## GitHub Actions — resultado real
[Execução 43747213711](https://github.com/TEREON-eng/desenvolvimento/actions/runs/43747213711), commit **ed27d947424ef8f2a07e2b3ceb566092b13ff3f1**: **SUCESSO** (44 etapas aprovadas, zero falhas e zero skipped, incluindo setup). Inclui `recomendador-condutores.test.cjs`, teste de invalidação de diâmetro associado à escolha do material, todas as famílias/serviços e regressões do modal. Versão de metadados X.0.3.62 foi consolidada depois; é preciso verificar CI do commit correspondente e servir efetivo do PWA/Cloudflare antes de promover.

## Casos obrigatórios do núcleo
| Cenário | Resultado exigido |
| --- | --- |
| Abrir Lista → Adicionar item | Modal aprovado, retorno e teclado, sem regressão |
| “fio flex 2,5 preto 450” | Propostas; tensão incompleta ? e não escolhida automaticamente |
| Confirmar 4 de 5 sugestões | Apenas as 4 aceitas e tecnicamente permitidas avançam |
| Desmarcar e editar a busca | Rascunho antigo descartado; sem atributo fantasma |
| Avançar vazio | Ficha manual continua disponível |
| Tags na ficha | Texto navega, × remove, condicionais respeitadas, sem setas/painel duplicado |
| Voz no Android | Permissão, transcrição pt-BR, parada, falha de rede e texto de fallback |
| Materiais incompletos | Não declarar item/ficha homologado sem requisitos técnicos |
| Por insumo/Por etapa | Sem fusão de cor, tensão, bitola ou unidade incompatível |
| Recomendador LAB de Condutores | Lista atual → histórico confirmado → catálogo; candidatos completos vs revisar; não infere tensão e não soma quantidades |
| Lances, RL e BR | Total/composição e origem preservados em Compras/Completo/Execução |
| WhatsApp/e-mail/PDF reais | Conferir legibilidade, medidas, etapas e nenhuma mutação |
| Criar/editar/duplicar/excluir | Persistência e etapa vazia corretas |
| Recarregar e operar offline | Não perder dados silenciosamente |
| Dois dispositivos/contas | Conflito e exclusão cruzada sem estado “sincronizado” falso nem apagamento automático |
| Claro/Escuro/TEREON | Contraste, foco, cabeçalhos e mesma funcionalidade |

## Antes de promover para main
Exigir (1) workflow **inteiro verde no SHA**; (2) versão/URL publicadas realmente verificadas; (3) testes manuais de ponta a ponta no Android e nos canais de saída; (4) ficha técnica revisada na origem, sem publicação automática; (5) aceite explícito. Configuração do workflow, fixture e testes isolados **não** equivalem à aprovação completa.

Atualizar a evidência no [Estado atual](ESTADO-ATUAL.md) quando houver nova execução, e registrar a evolução no [Changelog](CHANGELOG.md), sem empilhar cabeçalhos de versões antigas aqui.
