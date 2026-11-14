# TEREON X — Regressão e aceites ativos

**Estado observado em 14/11/2026, antes deste saneamento.** Original com adendos históricos: [TESTES-REGRESSAO-PRE-SANEAMENTO-2026-11-14.md](TESTES-REGRESSAO-PRE-SANEAMENTO-2026-11-14.md).

## GitHub Actions — resultado real
[Execução 43587644688](https://github.com/TEREON-eng/desenvolvimento/actions/runs/43587644688), commit **41c9088d824343c0e074a90f903e2b1ba5350749**: **FALHA**. Dez etapas iniciais passaram (Listas, Eletroduto LAB, formatos de relatório, quantificação, agrupamentos, correspondência, interpretação/voz simulada, tags ?→✓, etapas compactas); **resumo-localizacao.test.cjs** falhou na linha 33, assertion “por insumo usa mesmo resumo”. Etapas posteriores **não executadas**. Há possível teste estático desatualizado em relação ao parâmetro de aninhamento do agrupador; verificar sem presumir correção funcional.

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
| Lances, RL e BR | Total/composição e origem preservados em Compras/Completo/Execução |
| WhatsApp/e-mail/PDF reais | Conferir legibilidade, medidas, etapas e nenhuma mutação |
| Criar/editar/duplicar/excluir | Persistência e etapa vazia corretas |
| Recarregar e operar offline | Não perder dados silenciosamente |
| Dois dispositivos/contas | Conflito e exclusão cruzada sem estado “sincronizado” falso nem apagamento automático |
| Claro/Escuro/TEREON | Contraste, foco, cabeçalhos e mesma funcionalidade |

## Antes de promover para main
Exigir (1) workflow **inteiro verde no SHA**; (2) versão/URL publicadas realmente verificadas; (3) testes manuais de ponta a ponta no Android e nos canais de saída; (4) ficha técnica revisada na origem, sem publicação automática; (5) aceite explícito. Configuração do workflow, fixture e testes isolados **não** equivalem à aprovação completa.

Atualizar a evidência no [Estado atual](ESTADO-ATUAL.md) quando houver nova execução, e registrar a evolução no [Changelog](CHANGELOG.md), sem empilhar cabeçalhos de versões antigas aqui.
