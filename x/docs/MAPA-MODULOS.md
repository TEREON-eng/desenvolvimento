# TEREON X — Mapa de módulos e responsabilidades

**Revisão 14/11/2026.** [Estado e limitações](ESTADO-ATUAL.md) · [Mapa anterior integral](MAPA-MODULOS-PRE-SANEAMENTO-2026-11-14.md).

| Motor / camada | Implementação | Limite |
| --- | --- | --- |
| Shell/PWA/versão | x/index.html, x/pwa.js, x/sw.js, x/version.json | X.0.3.62 declarado, deploy efetivo por conferir |
| Interface Lista e modal | x/listas/app.js, x/styles.css | fluxo integrado; Android não verificado |
| Ficha e regras | x/catalogo/motor.js; x/fichario-x/fichas-lab-2026-11-12.json | 6 fichas LAB; nenhuma homologada |
| Interpretação do novo pedido | x/catalogo/interpretador-condutores.js | hipóteses determinísticas de Condutores |
| Recomendação de candidatos completos (LAB) | x/catalogo/recomendador-condutores.js | consulta fontes em memória, não integrado ao modal nem gera novas combinações |
| Confirmação do rascunho | x/catalogo/confirmacao-rascunho.js | valida só escolhas voluntárias com regras da ficha |
| Voz | x/catalogo/voz-entrada.js | serviço do navegador, suporte variável |
| Serviço e armazenamento de Lista | x/listas/servico.js, x/listas/store.js | única autoridade dos lançamentos e etapas |
| Correspondência entre lançamentos | x/listas/correspondencia.js | aviso conservador; sem fusão automática |
| Quantificação | x/listas/quantificacao.js | identidade técnica e apresentação comercial |
| Compartilhamento | módulos em x/listas/ | WhatsApp/e-mail/PDF; projeção sem mutar origem |
| Persistência na nuvem | x/listas/nuvem/ e adaptadores | divergências/exclusão multiaparelho pendentes |
| Identidade e relações | x/identidade/, x/relacoes/ | controle de acesso e testes cruzados pendentes |
| Obras e Diário | x/universo/obras/, x/universo/diario/, x/universo/empreiteiros/ | laboratórios parciais, independentes |
| CI | .github/workflows/testes-tereon-x.yml, x/tests/ | [Execução verde 15/11, X.0.3.62](https://github.com/TEREON-eng/desenvolvimento/actions/runs/43747413219); dispositivo ainda pendente |

## Pipeline e propriedade dos dados
**Texto/voz → hipóteses → confirmação humana → validação de ficha → lançamento no serviço de Listas → quantificação/relatório.** Interpretação não escreve em Lista; ficha não compra; grupo visual não determina equivalência; saída comercial não altera quantidade ou item de origem. Obras e Solicitações não substituem o motor de Listas.

Não confundir interfaces implementadas com operações homologadas em dispositivo, contas ou sistemas externos. A arquitetura integral foi consolidada em [../ARQUITETURA-MODULAR.md](../ARQUITETURA-MODULAR.md).
