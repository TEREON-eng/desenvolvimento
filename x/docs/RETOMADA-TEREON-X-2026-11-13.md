> **CONTINUAÇÃO / RETOMADA MAIS RECENTE — 14/11/2026:** este documento representa o estado até 13/11 e permanece como referência histórica. O **marco vigente para abrir nova conversa** é [`RETOMADA-TEREON-X-2026-11-14.md`](RETOMADA-TEREON-X-2026-11-14.md), mantendo a X.0.3.61, tags de sugestões ?→✓ junto da pesquisa, nome técnico se formando e botão Avançar. Nesta atualização foram sincronizados arquivos, **sem mudar a versão do código ou declarar deploy/CI aprovados**.

> **ÚLTIMA ATUALIZAÇÃO DA RETOMADA — 13/11/2026 · X.0.3.61:** a X.0.3.60 foi **refinada** após teste do fundador. A experiência vigente não tem mais um segundo painel grande de confirmações dentro da ficha: **texto/voz → tags sugeridas com ? sob a pesquisa → toque para ✓ confirmar → nome técnico em formação → Avançar → ficha preenchida parcialmente com escolhas confirmadas**. Novo módulo `x/catalogo/confirmacao-rascunho.js` faz a transição com validações da ficha. `x/tests/busca-tags-inline.test.cjs` acrescentado às regressões. Os relatos abaixo sobre a X.0.3.60 ficam preservados como histórico, não como especificação vigente. Não há confirmação nesta rodada de CI integral, deploy Cloudflare, teste real de microfone ou homologação da ficha.

# TEREON X — Marco de retomada de 13/11/2026
**Estado registrado em 13/11/2026 · branch `desenvolvimento` · versão `x.0.3.60` · laboratório**
**Este arquivo orienta uma próxima conversa; não é comprovação de deploy ou homologação.**

## 1. Onde está o projeto
- Repositório e branch trabalhados nesta rodada: **`TEREON-eng/desenvolvimento` / `desenvolvimento`**.
- Versão registrada em `x/version.json`: **X.0.3.60**. `x/index.html` carrega os módulos novos, `x/pwa.js` contém versão correspondente e o Service Worker cacheia os arquivos para acesso à mesma origem após instalação; **não comprova que o Cloudflare esteja servindo esta versão**.
- A meta próxima é **teste restrito supervisionado com empreiteiros em 17/11/2026**, não divulgação comercial.
- Fonte de dados do fichário: **cópia experimental versionada** `x/fichario-x/fichas-lab-2026-11-12.json`. A fonte histórica `x/fichario-x/fichas-drive-2026-11-08.json` e a planilha de origem **não foram sobrescritas** por estas melhorias.

## 2. Resumo cronológico das decisões recentes
- **X.0.3.53–54:** tentativa de usar selos Consolidados/Em revisão nos cartões de materiais lançados. O fundador corrigiu a interpretação: os selos pertencem à **primeira escolha da ficha**, não às linhas da lista.
- **X.0.3.55:** corrigido contraste dos botões de escolha no Escuro/TEREON; os selos de maturidade migram para seleção inicial de ficha.
- **X.0.3.56:** excesso de linhas em `Por insumo` resolvido com **família visual recolhível**. Variações de cor, bitola e isolação podem aparecer juntas sob `Condutores elétricos`, mas **não são somadas como materiais idênticos**. FT_COND-001 ganha maturidade **Consolidado como estrutura**, sem publicação Oficial.
- **X.0.3.57:** primeiro aviso de **possíveis correspondências técnicas** entre lançamentos incompletos, para revisão consciente. Foi experimentada navegação por setas/barra clicável no modal, mas **essa UI foi rejeitada posteriormente**; o detector conservador continua em laboratório.
- **X.0.3.58:** ideia do irmão do fundador aprovada: **tocar no texto da tag abre o respectivo detalhe; × remove**. Progresso volta a ser informativo; modal HTML preserva referência aprovada.
- **X.0.3.59:** barra informativa mostra **todos os detalhes aplicáveis**, inclusive opcionais. Tags pendentes ficam **atenuadas**, com símbolos abreviados (`Ø`, `#`, `V`, `Mat.`, etc.); preenchidas mostram valor e × vermelho. Nada é escolhido automaticamente.
- **X.0.3.60:** nova direção para **simplificar a composição do item**: o profissional descreve em linguagem cotidiana, o TEREON **traduz em sugestões técnicas a confirmar**. Primeiro piloto **Condutores**. A mesma entrada recebe **texto ou voz** (`SpeechRecognition` quando disponível). A ideia de **reconhecer o material por foto** foi registrada como visão futura, ainda sem código nem interface de foto.

## 3. Fluxo atual da entrada natural
1. Em **Adicionar item**, a primeira tela oferece campo de descrição como `fio flex 2,5 preto 450`; mostra `🎙 Falar` somente com suporte de voz no navegador.
2. Texto digitado ou transcrição pt-BR chega a **`x/catalogo/interpretador-condutores.js`**. É um **interpretador determinístico inicial**, não um serviço de IA generativa nem reconhecimento de qualquer material.
3. A saída `family / proposals / warnings` sugere Condutores, cor, seção, tipo, tensão etc. Qualquer atribuição **é proposta**, nunca confirmação silenciosa.
4. O usuário escolhe a ficha e confirma **cada** proposta tocando no botão. `x/catalogo/motor.js` valida opções e conflitos; as tags aprovadas permanecem como seleção/revisão manual de características.
5. O serviço de voz depende de navegador, permissão e potencial serviço externo/rede; o TEREON não salva áudio. Sem voz, a **digitação e o fichário manual continuam operando**.
6. Nada dessa interpretação altera `x/listas/quantificacao.js`, quantidades, unidades, etapas, relatórios ou o estado Oficial das fichas.

## 4. Regras técnicas e riscos abertos
- **“450” ≠ confirmação automática de “450/750 V”.** Apresentar como possibilidade com ressalva.
- **“Flexível” não prova sozinho Classe V** de encordoamento; **“PVC” não prova a temperatura 70 °C**; “HEPR” não pode ser convertida automaticamente na opção conjunta **“HEPR ou XLPE”**.
- **FT_COND-001 não está homologada:** `maturidade: Consolidado` para estrutura, `status: Em revisão` para validação de produto; revisar tensão `DET-006` opcional, isolação agregada e regras condicionais/encordoamento.
- Comparação de equivalências entre itens **não é consolidação automática**. Família visual serve para navegar; identidade técnica e fornecimento comercial servem para comprar.
- Testes isolados de intérprete/voz simulada e confirmação individual foram executados; **CI integral, instalação e teste de voz Android, deployment Cloudflare, PDF final e uso com profissionais ainda não foram confirmados nesta rodada**.
- **Foto por IA** é uma intenção de evolução. Não foi implementada nem habilitada.

## 5. Arquivos principais para o próximo trabalho
| Objetivo | Referência |
| --- | --- |
| Visão da arquitetura e roteiro de campo | [Piloto busca natural texto/voz/foto](PILOTO-BUSCA-NATURAL-VOZ-FOTO-2026-11-13.md) |
| História das decisões e ideias | [Diário Volume 03](HISTORIA-TEREON-X-VOLUME-03.md) |
| Regras atuais de confirmação | [Contratos vigentes](CONTRATOS-VIGENTES.md) |
| Estado geral do projeto | [Mestre](MESTRE-TEREON-X.md) |
| Testes a rodar antes do campo | [Testes de regressão](TESTES-REGRESSAO.md) e [Foco 17/11](FOCO-TESTE-CAMPO-17-11-2026.md) |
| Matrizes técnicas não homologadas | [Matriz de fichas](MATRIZ-FICHAS-17-11-2026.md) |
| Relação de mudanças | [Changelog](CHANGELOG.md) |
| Motor de interpretação | `x/catalogo/interpretador-condutores.js` |
| Adaptador de voz | `x/catalogo/voz-entrada.js` |
| Integração com o modal | `x/listas/app.js`, `x/index.html`, `x/styles.css` |
| Teste de voz simulada | `x/tests/interpretador-voz-condutores.test.cjs` |

## 6. Próximo caminho recomendado (não executar sem verificar)
**Prioridade:** testar a entrada por voz e descrição no celular/PWA real. Usar frases reais de empreiteiros; conferir transcrição, ambiguidades, seleções confirmadas e o modo sem microfone. Depois melhorar o dicionário e reconhecer novas famílias conforme ficha revisada. **Não** avançar para foto, integração com compras ou módulos paralelos antes de validar a precisão e o comportamento do piloto em campo.

**Princípio preservado:** a pessoa **não precisa se organizar antes de pedir**; o fluxo traduz a intenção e a ficha organiza/valida, sem inventar características.
