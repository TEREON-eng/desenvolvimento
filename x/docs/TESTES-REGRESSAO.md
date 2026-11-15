# TEREON X — Regressão e aceites ativos

**Estado observado em 15/11/2026, desenvolvimento X.0.3.63 (versão declarada).** Original com adendos históricos: [TESTES-REGRESSAO-PRE-SANEAMENTO-2026-11-14.md](TESTES-REGRESSAO-PRE-SANEAMENTO-2026-11-14.md).

## GitHub Actions — resultado real
[Execução 43759876132](https://github.com/TEREON-eng/desenvolvimento/actions/runs/43759876132), commit **5a8027ed6933864ea7a831c2c4c1e91fc460273f**: **SUCESSO** (46 etapas, sem falhas nem etapas ignoradas, incluindo setup). Coberto: interpretador e recomendador de Condutores, laboratório HTML, atalho mobile com cache/versão coerentes, preservação integral do modal e testes de Listas, fichas, Obras e compartilhamento. **Deploy Cloudflare, uso real em Android e homologação não comprovados.**

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
| Acesso mobile LAB | Home mostra link dedicado; toque na tag/× em controles separados, campo sem perder espaços, tela pequena e botão Voltar; conferir física/visualmente no Android após deploy |
| Lances, RL e BR | Total/composição e origem preservados em Compras/Completo/Execução |
| WhatsApp/e-mail/PDF reais | Conferir legibilidade, medidas, etapas e nenhuma mutação |
| Criar/editar/duplicar/excluir | Persistência e etapa vazia corretas |
| Recarregar e operar offline | Não perder dados silenciosamente |
| Dois dispositivos/contas | Conflito e exclusão cruzada sem estado “sincronizado” falso nem apagamento automático |
| Claro/Escuro/TEREON | Contraste, foco, cabeçalhos e mesma funcionalidade |

## Antes de promover para main
Exigir (1) workflow **inteiro verde no SHA**; (2) versão/URL publicadas realmente verificadas; (3) testes manuais de ponta a ponta no Android e nos canais de saída; (4) ficha técnica revisada na origem, sem publicação automática; (5) aceite explícito. Configuração do workflow, fixture e testes isolados **não** equivalem à aprovação completa.

Atualizar a evidência no [Estado atual](ESTADO-ATUAL.md) quando houver nova execução, e registrar a evolução no [Changelog](CHANGELOG.md), sem empilhar cabeçalhos de versões antigas aqui.
