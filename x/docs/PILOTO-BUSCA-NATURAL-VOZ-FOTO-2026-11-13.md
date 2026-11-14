> **REFERÊNCIA MAIS RECENTE — 14/11/2026:** [Marco de retomada X.0.3.61](RETOMADA-TEREON-X-2026-11-14.md) contém sequência aprovada, responsáveis técnicos, exemplos, risco de inferência, status do código e pendências para a próxima conversa. A documentação abaixo conserva o histórico do piloto X.0.3.60 e os adendos X.0.3.61. O comportamento **vigente** é confirmar em tags ?→✓ **junto da pesquisa**, formar nome técnico, **Avançar** com apenas o confirmado; o painel interno duplicado foi descartado. Voz depende do navegador; foto ainda não existe. **CI integral, Cloudflare e teste Android permanecem sem confirmação.**

> **EVOLUÇÃO DO PILOTO — 13/11/2026 · X.0.3.61:** o primeiro fluxo da X.0.3.60 colocava uma segunda área de botões para confirmar sugestões **depois de escolher Condutores**, ocupando espaço demais. Aprovada nova interação: na **tela inicial de pesquisa por texto/voz**, as hipóteses aparecem em tags pequenas com **?**; tocar alterna para **✓ confirmado** e forma gradualmente o nome técnico. **Avançar para especificação** entra na ficha existente com apenas esses valores; a ficha abre somente os detalhes ainda faltantes. **O bloco grande de confirmação dentro da ficha foi removido**. O novo `x/catalogo/confirmacao-rascunho.js` aplica verificações do catálogo antes de transportar características; o motor de compra não foi alterado. A seção abaixo descreve a arquitetura original e deve ser lida com esta evolução de UX. Continuidade para voz e foto futura mantida. A experiência no celular e Cloudflare ainda exigem validação.

# TEREON X — Piloto de busca natural por texto e voz
**13/11/2026 · X.0.3.60 · branch `desenvolvimento` · laboratório, sem publicação confirmada**

## Visão definida pelo fundador
O profissional descreve o material como sabe — com termos populares, abreviações e números — e o TEREON **interpreta e sugere** possíveis fichas e atributos, **sem preencher automaticamente** os detalhes. A confirmação técnica é ato explícito da pessoa, respeitando regras e condições da ficha. Primeiro piloto: **Condutores elétricos**. Foto de material é uma **evolução futura**, não implementada nesta versão.

## Arquitetura de canais
- **Texto:** campo `fichaSearch` no primeiro nível do mesmo modal `Adicionar item`, com exemplo `fio flex 2,5 preto 450`.
- **Voz:** botão `🎙 Falar` ao lado do mesmo campo se o navegador expuser `SpeechRecognition` ou `webkitSpeechRecognition`. Ao tocar, o navegador solicita acesso ao microfone; a fala é transcrita em `pt-BR`, com no máximo uma transcrição final por ativação. A transcrição preenche o campo de texto e passa pelo **mesmo** interpretador, podendo ser revisada antes de escolher a ficha.
- **Interpretador:** `x/catalogo/interpretador-condutores.js`, função pura `interpret(texto)`; retorna `family`, `proposals` e `warnings`. Não escreve em listas, não altera ficha, não chama rede, não usa generativo remoto. Nesta versão o núcleo é **um reconhecedor determinístico de expressões**, não uma IA que entende livremente todo o português.
- **Fichário:** `x/catalogo/motor.js` e o snapshot LAB continuam sendo a única fonte das opções permitidas, dependências e conflitos. O cartão `Condutores elétricos` pode ser escolhido a partir das sugestões. O usuário vê botões de **Confirmar** para cada proposta e pode usar a sequência manual de seleção. Cada confirmação é validada via `optionStates` e `conflicts`.
- **Imagem (futuro):** arquivo ou captura de foto → extração de informações observáveis → propostas com incerteza e necessidade de validação → **o mesmo** contrato de saída `family / proposals / warnings`. Não implementar interface de foto, captura invisível, OCR automático ou envio de imagem nesta fase.

## Exemplos do piloto
| Entrada em linguagem de obra | Propostas ainda NÃO confirmadas |
| --- | --- |
| `fio flex 2,5 preto 450` | Condutor isolado?; seção 2,5 mm²?; Preto; Classe V?; **450/750 V?** com aviso de tensão incompleta |
| `condutor cobre 2,5 preto pvc 450/750 V` | Tipo, Cobre, 2,5 mm², Preto, **PVC 70 °C?** (temperatura a conferir), tensão nominal citada explicitamente |
| `fio preto dois e meio` | Condutor isolado?; 2,5 mm²?; Preto |
| `cabo 2,5 preto 1kv` | Seção 2,5 mm²?; Preto; **0,6/1 kV?** com aviso de classe incompleta |
| `cabo multipolar 3 vias cobre 4,0` | Multipolar?; 3 vias?; Cobre; 4,0 mm²? |
| `cabo HEPR cobre 10` | Cobre, 10,0 mm²?; aviso: não confundir HEPR com a opção agregada "HEPR ou XLPE 90 °C" |
| `eletroduto pvc rígido` | Fora do piloto: não inventar ficha por interpretação; manter seleção manual |

A interrogação **indica interpretação a confirmar**, não erro nem escolha previamente feita. Reconhecimento de cor ou material expresso literalmente continua sujeito à confirmação. `450` **não** significa automaticamente `450/750 V`. `flexível` não comprova classe IEC de encordoamento; `PVC` não comprova sozinho temperatura 70 °C.

## Privacidade, disponibilidade e falhas
- O TEREON **não armazena áudio**; o navegador controla o serviço de fala e o usuário inicia explicitamente por toque.
- A Web Speech API apresenta **suporte limitado**; em alguns navegadores (inclusive Chrome em certas configurações), o reconhecimento pode enviar áudio para um serviço externo e depender da internet. Avisar no próprio modal; **não prometer voz offline**.
- Sem suporte, sem permissão, com erro de rede ou sem fala reconhecida, **a entrada por texto e a seleção manual continuam disponíveis**. Não solicitar acesso ao microfone ao abrir o modal.
- Apenas a **transcrição textual**, quando o usuário decide preencher e salvar um item, pode ser convertida em atributos confirmados. Não salvar transcrição bruta na lista como se fosse especificação validada.
- A funcionalidade de voz precisa ser testada em Android, instalação PWA, navegadores e permissões reais; não foi possível confirmar isso apenas com análise de código.

## Contratos preservados
- **Mesmo modal** de adição/especificação; nenhuma tela separada para áudio, nenhum atalho que pule validação.
- As tags aprovadas permanecem compactas, clicáveis para navegar e com × vermelho apenas para remoção.
- O motor de quantificação e o detector de possíveis equivalências **não são alterados**. Comparação de itens existentes e interpretação do pedido são problemas relacionados, mas independentes.
- A publicação técnica de Condutores não foi alterada: a estrutura está **Consolidada**, mas o registro de ficha segue **Em revisão** e não deve ganhar selo Oficial sem auditoria técnica.

## Mudanças e testes
Criados `x/catalogo/interpretador-condutores.js`, `x/catalogo/voz-entrada.js`, `x/tests/interpretador-voz-condutores.test.cjs`; atualizado `x/listas/app.js` para compartilhar campo e confirmar propostas uma por uma; `x/styles.css` para tela inicial e área de sugestões; `x/index.html`, `x/sw.js`, `x/pwa.js`, `x/version.json` para carregar e versionar a entrada. O workflow inclui o teste, e `x/tests/modulos.test.cjs` reconhece os novos scripts.

Testes isolados já executados em ambiente JavaScript: exemplos de interpretação, distinção entre tensão citada e sugestão, catálogo técnico de Condutores, clique individual de confirmação, preservação de atributos ainda não informados e digitação como fallback. **Não foi verificado o CI integral, nem a transcrição real no navegador, nem o Cloudflare em produção**.

## Próximo roteiro de campo
1. No celular, abrir uma lista e `Adicionar item`. Digitar `fio flex 2,5 preto 450`. Conferir `Condutores elétricos` e as propostas.
2. Tocar no botão 🎙 Falar, conceder permissão caso deseje e falar a mesma frase. Conferir que o texto veio corretamente e pode ser editado.
3. Escolher Condutores e confirmar uma proposta por vez. A tensão incompleta deve continuar uma hipótese até ser escolhida pelo usuário.
4. Testar interrupção de voz, erro de rede, permissão negada e navegador sem suporte. O teclado e o fichário manual devem continuar utilizáveis.
5. Completar obrigatórios, salvar, editar e compartilhar; validar que a compra permanece estrita e que nenhuma interpretação foi persistida silenciosamente.
6. Testar nomes informais e ruídos reais de obra, registrar falsos positivos/negativos e ampliar o dicionário do piloto somente após evidências.

**Referência de compatibilidade:** https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
