# TEREON X — Marco de retomada para nova conversa
**14/11/2026 · referência atual: X.0.3.61 · branch `desenvolvimento`**
**Propósito:** conservar decisões, contratos técnicos e história de produto para continuar sem retrabalho.
**Atenção:** atualização de documentação **não** representa homologação, CI completo aprovado ou deploy no Cloudflare.

## 1. Estado confirmado no GitHub
- Repositório: [TEREON-eng/desenvolvimento](https://github.com/TEREON-eng/desenvolvimento), branch `desenvolvimento`.
- Versão declarada em `x/version.json`: **x.0.3.61**, build `2026-11-13`. `x/pwa.js` e `x/sw.js` também indicam `0.3.61`.
- `x/index.html` carrega, nesta ordem: catálogo, interpretador de Condutores, módulo de confirmação de rascunho, entrada por voz e os demais módulos necessários às Listas. Não foi solicitado nem comprovado merge em `main`.
- O modal `#addDialog` preserva a estrutura de referência `x/tests/fixtures/modal-adicionar-aprovado-x034.html`. O comportamento interno de apresentação é evolutivo; **não redesenhar o modal sem autorização**.
- Ficha `FT_COND-001` no snapshot `x/fichario-x/fichas-lab-2026-11-12.json`: `maturidade: Consolidado` **somente para estrutura**, `status: Em revisão`; sua homologação e publicação Oficial não foram confirmadas. A `DET-006 Classe de tensão` ainda consta como **Opcional**. A opção agregada “HEPR ou XLPE 90 °C” também requer validação. A planilha de origem e o snapshot histórico não foram alterados nessa sequência.

## 2. Decisão mais recente — entrada natural sem formulário duplicado (X.0.3.61)
O fundador aprovou a direção da pesquisa por linguagem da obra, mas rejeitou a **área grande de confirmação dentro da ficha** criada na X.0.3.60, pois ocupava muito espaço. Fluxo vigente para piloto **Condutores**:
1. Na **primeira tela** do modal **Adicionar item**, usuário escreve uma descrição livre (por exemplo, `fio flex 2,5 preto 450`) **ou** dita usando `🎙 Falar` quando o navegador oferece Web Speech API.
2. O interpretador reconhece possíveis ficha e características, sempre como **propostas**. **Logo abaixo da pesquisa**, em tags pequenas, cada característica aparece com um **?**.
3. O usuário toca numa tag para **confirmar ✓** (ou toca novamente para desfazer). Só as confirmadas participam do **Nome técnico em formação**. Mudar o texto descarta confirmações antigas, evitando reutilização indevida.
4. Um único botão **Avançar para especificação** abre a ficha existente no **mesmo modal**. O novo módulo puro `x/catalogo/confirmacao-rascunho.js` transporta **somente escolhas confirmadas e permitidas**, validando `visibleDetails`, `optionStates` e `conflicts` do catálogo. É possível avançar sem tags confirmadas e selecionar manualmente.
5. **Dentro da ficha**, a área grande duplicada de sugestões NÃO deve existir. O profissional complementa obrigatórios e opcionais usando a navegação por tags já aprovada e somente depois pode **Adicionar à lista**.

**Exemplo técnico:** `450` sozinho pode sugerir `450/750 V?`, mas não confirmar essa classe; “flexível” pode sugerir Classe V, mas não comprova a classe; “PVC” não comprova temperatura; HEPR específico não pode ser automaticamente substituído por `HEPR ou XLPE`.

### Controle visual aprovado nas X.0.3.58–59
- **Tags da ficha:** todos os detalhes **aplicáveis** aparecem em mini-tags; os pendentes ficam atenuados com símbolos curtos `Ø`, `#`, `V`, `Mat.`, `Isol.`; os confirmados exibem valor.
- **Tocar na tag** navega ao detalhe para revisar/confirmar. **Tocar em × vermelho** remove confirmação, preservando condicionais/dependências; sem linha divisória antes do ×. O avanço automático da ficha continua.
- **Barra de progresso da ficha:** uma posição para cada detalhe aplicável, incluindo opcional; apenas informativa.
- **Não ressuscitar** a navegação por setas e barra clicável da X.0.3.57, explicitamente rejeitada pelo fundador; a solução veio de sugestão do irmão e foi bem recebida.
- Cores e contraste nos temas Claro/Escuro/TEREON devem permanecer legíveis. Aprovada anteriormente posição de selos de maturidade **na escolha inicial da ficha**, não nos itens da lista.

## 3. Limites técnicos permanentes
- **Intenção não é confirmação.** O usuário não precisa preparar a nomenclatura; o interpretador sugere e o motor de fichas valida. Nada deve ser atribuído como característica confirmada sem toque explícito.
- **Descrição e voz usam o mesmo núcleo:** `x/catalogo/interpretador-condutores.js` expõe `interpret(texto)`, retornando `family`, `proposals`, `warnings`. É um **interpretador determinístico inicial**, não um modelo multimodal generativo já completo.
- **Voz:** `x/catalogo/voz-entrada.js`, `SpeechRecognition`/`webkitSpeechRecognition` para `pt-BR`, só por gesto do usuário, com permissão/erros/fallback para texto. O navegador pode enviar áudio a serviço externo e exigir internet; **não prometer voz offline**, nem que o TEREON guarda áudio.
- **Foto:** desejo/etapa futura. Uma imagem deverá eventualmente gerar propostas pelo mesmo contrato, mas **NÃO há captura nem reconhecimento de foto implementados**.
- **Listas — Por insumo:** família visual recolhível para variantes técnicas; não confundir visualização com produto idêntico.
- **Comparação entre itens existentes:** `x/listas/correspondencia.js` sugere possíveis correspondências para revisar, de modo conservador, sem preencher ausências e sem somar quantidades incompatíveis.
- **Compra e apresentação:** `x/listas/quantificacao.js` é o mecanismo independente de quantidade/rolos/lances/metragem; não alterado por X.0.3.60–61. WhatsApp/e-mail/PDF exigem preservação de unidades e origem.
- **Rastreabilidade:** conservar dados legados, etapas e quantidades; nunca sobrescrever fichário oficial ou registros históricos silenciosamente.

## 4. Arquivos-chave e testes
| Área | Referência |
| --- | --- |
| Integração visual e fluxo | `x/listas/app.js`, `x/index.html`, `x/styles.css` |
| Entendimento inicial de Condutores | `x/catalogo/interpretador-condutores.js` |
| Validação do rascunho antes de avançar | `x/catalogo/confirmacao-rascunho.js` |
| Transcrição opcional de voz | `x/catalogo/voz-entrada.js` |
| Fonte das regras técnicas | `x/catalogo/motor.js` e `x/fichario-x/fichas-lab-2026-11-12.json` |
| Comparação de itens já incluídos | `x/listas/correspondencia.js` |
| Quantificação comercial | `x/listas/quantificacao.js` |
| Teste de busca/confirmar/avançar | `x/tests/busca-tags-inline.test.cjs` |
| Teste de interpretação e voz simulada | `x/tests/interpretador-voz-condutores.test.cjs` |
| Shell e referência histórica | `x/tests/modulos.test.cjs`, `x/tests/fixtures/modal-adicionar-aprovado-x034.html` |
| Workflow | `.github/workflows/testes-tereon-x.yml` |

A execução isolada anterior do fluxo “fio flex 2,5 preto 450” confirmou **cinco sugestões**, **quatro seleções voluntárias** e transferência **somente dessas quatro** ao avançar; a quinta (classe de encordoamento) ficou não confirmada. Foram verificadas a sintaxe JS, a ordem declarada de scripts, a presença dos testes no workflow e o versionamento X.0.3.61. **Não houve evidência nesta rodada de CI integral verde nem teste com usuário no Android.**

## 5. Prioridades objetivas para a próxima conversa
1. **Validação visual e tátil** no celular/PWA: abrir o modal, digitar descrição, observar tamanho/altura das tags sob a pesquisa e se o nome técnico aparece de forma natural; confirmar e desconfirmar tags e avançar sem duplicação de painéis.
2. **Teste de voz real em Android:** permissão, transcrição `pt-BR`, erro de rede/serviço, botão parar e fallback. Testar transcrição corrigida manualmente.
3. **Regressão técnica:** não inferir tensão, isolação, encordoamento, cor ou seção sem confirmação; impedir opções condicionais/excluídas; permitir continuação manual; preservar o histórico de edição.
4. **Verificar CI no SHA atualizado e deployment Cloudflare** antes de declarar a versão disponível para ensaio externo. Não assumir que commit é deploy.
5. **Fechar fichas prioritárias** para testes restritos de **17/11/2026**: especialmente Condutores e Eletrodutos/Curvas com documentação técnica revisada. Não liberar pedidos reais como homologados enquanto restarem pendências.
6. Evoluir dicionário de pedidos somente após observar linguagem real de empreiteiros; **não** priorizar foto ou novos módulos antes de estabilizar o piloto.

## 6. Documento histórico e preservação
- [Mestre do TEREON X](MESTRE-TEREON-X.md)
- [Contratos vigentes](CONTRATOS-VIGENTES.md)
- [Guia visual](GUIA-VISUAL-TEREON-X.md)
- [Piloto texto, voz e foto futura](PILOTO-BUSCA-NATURAL-VOZ-FOTO-2026-11-13.md)
- [Plano de campo 17/11](FOCO-TESTE-CAMPO-17-11-2026.md)
- [Matriz de fichas](MATRIZ-FICHAS-17-11-2026.md)
- [Diário do desenvolvimento — Volume 03](HISTORIA-TEREON-X-VOLUME-03.md)
- [Changelog completo](CHANGELOG.md)
- [Retomada anterior (13/11)](RETOMADA-TEREON-X-2026-11-13.md)

**Mensagem de retomada para outra conversa:** “Continuar TEREON X a partir de `x/docs/RETOMADA-TEREON-X-2026-11-14.md` no repo `TEREON-eng/desenvolvimento`, branch `desenvolvimento`, versão X.0.3.61. Respeitar todo o modal/tags aprovados, revisar código e documentos antes de alterar. Priorizar validar busca natural com tags ?→✓, botão Avançar e voz no Android, sem presumir atributos nem modificar compras.”
