## 13/11/2026 — Proposta de Correspondência Técnica Progressiva (documentação, sem versão do app)
- Discussão disparada por pedidos incompletos que podem corresponder ao mesmo produto: “Condutor flexível cobre 2,5 preto” versus “... 450”, o último ainda exigindo confirmação da classe de tensão.
- Diagnóstico: a função `signature()` do motor `x/listas/quantificacao.js` inclui `item.name` e todos os valores registrados (salvo unidade técnica), o que permite identidades diferentes para pedidos com detalhes ausentes ou nomes formatados de forma distinta. Isso protege o pedido atual, mas não resolve compatibilidade progressiva.
- Criado o [contrato proposto de correspondência](CONTRATO-CORRESPONDENCIA-PROGRESSIVA-2026-11-13.md) e a [fixture com 15 cenários](../tests/fixtures/correspondencia-progressiva-condutores-v1.json), incluindo identidade técnica, completude, apresentação comercial, conflito explícito, múltiplas alternativas e confirmação humana.
- **Nenhum código funcional, ficha, catálogo, UI, dados ou cálculo de compras foi modificado.** A versão permanece X.0.3.56 e a proposta não foi homologada.
- Próxima etapa: validar a matriz com o fundador, implementar um comparador puro e não destrutivo em laboratório, adicionar regressões e só então discutir integração com o modal e o motor comercial.

## 12/11/2026 — X.0.3.56 · Agrupamento por família visual e maturidade de Condutores
- Feedback do fundador: a consolidação exigia correspondência técnica integral e apresentação de compra, de modo que cores/bitolas distintas geravam muitos cards. **Decisão:** separar **agrupamento para localizar** de **consolidação quantitativa para comprar**.
- **Por insumo:** materiais com o mesmo `catalogId` são apresentados na mesma família visual (ex.: **Condutores elétricos** ou **Eletroduto**); quando há duas ou mais variações, a família fica **recolhida inicialmente**, com contador de variações e lançamentos. Abrir revela os cartões de cada especificação comercial. Uma única variação conserva cartão direto, sem camada extra. Itens sem `catalogId` só são agrupados quando compartilham um nome-base seguro.
- A composição de compra continua no motor `x/listas/quantificacao.js`, **inalterado**: condutores azul e preto são reunidos visualmente, mas não têm quantidades somadas; rolos/lances/unidades e rastreamento por etapa permanecem distintos. **Por etapa** não teve alteração.
- **Ficha FT_COND-001:** o fundador considera sua **estrutura consolidada**; essa maturidade foi registrada somente no snapshot experimental `x/fichario-x/fichas-lab-2026-11-12.json`. `x/catalogo/motor.js` passa a expor `maturity`, separado de `status` e `homologada`.
- **Não promovida ainda a Oficial:** a própria ficha registra pendências técnicas objetivas (classe de tensão `DET-006` ainda opcional, opção única “HEPR ou XLPE 90 °C”, requisitos de encordoamento e compatibilidade comercial). Antes de homologar/publicar, elas precisam ser conferidas na fonte Fichario.xlsm e auditadas. O snapshot original e a planilha não foram alterados. No seletor inicial, o condutor recebe selo **Consolidado** acompanhado da indicação **Publicação pendente**; outros itens em revisão mantêm aviso correspondente.
- Teste novo `x/tests/agrupamento-familias.test.cjs` integrado ao CI; regressão `x/tests/listas-tags-e-familia.test.cjs` atualizada. Código, cache e versão X.0.3.56 alterados na branch `desenvolvimento`; sem aprovação para `main`.
- Testes sintáticos e ensaios isolados realizados; execução integral do CI, deploy Cloudflare e teste móvel ainda não confirmados.

## 12/11/2026 — X.0.3.55 · Contraste dos detalhes e status no seletor inicial
- Correção de interpretação do feedback: **Consolidado** e **Em revisão** identificam a **maturidade da ficha**, na primeira tela de **Adicionar item → escolher material**. **Não** são etiquetas dos materiais já lançados, nem do agrupamento Por insumo/Por etapa. Todas as etiquetas dessa natureza foram removidas das listas e de seus níveis internos.
- O card inicial do fichário apresenta “**Condutores elétricos**” para `FT_COND-001` e “Eletroduto” para `FT_INFRA-001`, com código da ficha em letra auxiliar. Nenhum ID, nome técnico salvo, agrupamento ou resultado de compra foi renomeado.
- `Em revisão` é exibido para fichas com estado técnico de revisão/simulação. `Consolidado` aparece **somente quando o campo de status da própria ficha afirma explicitamente Consolidado/Consolidada**; não é inferido por quantidade de lançamentos e **não significa automaticamente homologação ou publicação**. O snapshot LAB atual mantém todas as seis fichas em revisão, portanto não inventa consolidados.
- Corrigido problema de legibilidade no tema **Escuro** e no tema **TEREON**: opções técnicas do seletor agora têm fundo escuro apropriado, **texto claro com alto contraste**, bordas perceptíveis, estado selecionado em destaque e opções bloqueadas ainda legíveis. Também revistos botão de pular, selo Obrigatório/Opcional, aviso contextual e tag de dependência técnica. Tema Claro e estrutura do modal preservados.
- Mudanças em `x/listas/app.js` e `x/styles.css`; regressão `x/tests/listas-tags-e-familia.test.cjs` alinhada à nova regra, URLs de CSS/JS e cache/versão do PWA avançados para **X.0.3.55**.
- Preservados `FT_INFRA-001` experimental, planilha, fichário, motor de quantificação, Listas e fluxos de salvar/editar/compartilhar. Sintaxe e ensaios isolados verificados; **publicação Cloudflare e teste visual em celular ainda não comprovados**.

## 12/11/2026 — X.0.3.54 · Etiquetas só no cabeçalho do agrupamento
- Ajuste solicitado após X.0.3.53: **não repetir as etiquetas nos itens da lista**. **Consolidado** e **Em revisão** aparecem apenas ao lado do título do **card principal em Por insumo** — exemplos: “Condutores elétricos · Consolidado” e “Eletroduto · Em revisão”.
- Na visão **Por etapa**, nenhum selo é repetido nas linhas internas de material ou lançamentos; a lista continua organizada por etapa, com tipo técnico, cor, bitola, isolação e quantidades visíveis.
- A posição foi ajustada para **a mesma linha do título da família**, com quebra responsiva apenas quando faltar espaço, e sem criar uma linha exclusiva para tags.
- Sem alterar a semântica: Consolidado = dois ou mais lançamentos reunidos; Em revisão = ficha/registro pendente. Um agrupamento pode receber **os dois** quando ambas as condições forem verdadeiras; a situação técnica nunca é ocultada para simular aprovação.
- Apenas apresentação em `x/listas/app.js` e `x/styles.css`; motor de consolidação, dados, catálogo, nomes técnicos, WhatsApp/e-mail/PDF e modal de adição não mudaram.
- Atualizados o teste `x/tests/listas-tags-e-familia.test.cjs`, versionamento/cache do PWA X.0.3.54 e documentação. Verificação sintática e ensaio isolado realizados; publicação Cloudflare e inspeção em celular não confirmadas.

## 12/11/2026 — X.0.3.53 · Identificação de materiais na lista
- A pedido do fundador, a visão **Por insumo** apresenta o card da ficha `FT_COND-001` com título de **família “Condutores elétricos”**, preservando o **subtipo técnico confirmado** (“Condutor isolado”, “Cabo unipolar”, etc.) no resumo logo abaixo; também mantém material, seção, cor, isolação e o nome técnico completo no detalhe expandido.
- A visão **Por etapa** conserva o nome específico do item, valorizado pela leitura de campo.
- Etiquetas em ambas as visões: **“Consolidado”** apenas quando **dois ou mais lançamentos** foram reunidos no mesmo grupo visual; **“Em revisão”** quando qualquer origem está em revisão/simulação segundo o lançamento ou a ficha de catálogo. Uma tag não equivale a aprovação técnica, e nenhuma delas altera o cadastro.
- Paleta da X.0.3.50 preservada; chips pequenos, discretos, com contraste para temas Claro/Escuro/TEREON e explicação ao manter o toque/foco.
- `x/listas/app.js` e `x/styles.css` ajustados; versão/cache X.0.3.53. O catálogo experimental, fichas originais, motor de quantificação, relatórios, dados persistidos e modal técnico aprovado **não foram alterados**.
- Regressão dedicada `x/tests/listas-tags-e-familia.test.cjs` incorporada ao workflow; execução local/CI integral, publicação Cloudflare e teste visual móvel ainda não confirmados.

## 12/11/2026 — X.0.3.52 · Compras consolida unidades antigas iguais sem converter
- Ajuste final do motor Compartilhar depois da X.0.3.51: linhas legadas com **mesma especificação, mesmo nome e mesma unidade de compra** agora são consolidadas no relatório **Compras**, mantendo uma linha por material e discriminação de etapas.
- Exemplo: 8 `br3m` na Sala 2 + 2 `br3m` na Sala 1 => **10 barras de 3 m**, com ambas as etapas identificadas. **Não converter automaticamente em 30 m** nem misturar com outra apresentação.
- Nomes comerciais conhecidos (`br3m`, `rl25`, `rl100`) passam a ser escritos de modo legível, com a unidade original explicitada. Relatório Completo e Execução mantêm os lançamentos individuais.
- Corpo de e-mail deixa de atribuir assinatura fictícia a uma “equipe responsável”; usuário revisa e assina pelo cliente de e-mail.
- Teste `compartilhar-formatos-2026-11-12.test.cjs` ampliado para validar soma e rastreio de etapas. `x/index.html`, `x/pwa.js`, `x/sw.js` e `x/version.json` sincronizados em X.0.3.52.
- Continua **não comprovada** a execução integral do CI, o PDF real em celular e o deploy Cloudflare. [Revisão central](REVISAO-ELETRODUTO-E-RELATORIOS-2026-11-12.md).

## 12/11/2026 — X.0.3.51 · Ficha Eletroduto em laboratório e compartilhamento para obra
- A aparência X.0.3.50 das listas foi **aceita pelo fundador como referência para uso e observação**, sem declarar versão geral homologada.
- Criado `x/fichario-x/fichas-lab-2026-11-12.json` a partir do snapshot original `fichas-drive-2026-11-08.json`, **preservado intacto**; apenas `FT_INFRA-001` foi refinada. A planilha Fichario.xlsm **não foi modificada**.
- Regras experimentais: diâmetro obrigatório por material; PEAD restrito a flexível; capa em aço flexível; perfil e classe de resistência no PVC flexível; galvanização para aço rígido. Resistência PVC rígido e compatibilidades comerciais seguem pendentes. Ficha mantém o status **Em revisão**.
- `x/catalogo/motor.js` usa o snapshot LAB; `x/listas/app.js` apresenta a unidade comercial condicional para Eletroduto no seletor `Unidade`, sem pergunta redundante e sem reconverter itens antigos.
- `x/motor-compartilhar.js`: relatórios estruturados Compras, Completo, Execução; texto de WhatsApp com títulos legíveis, assunto/corpo próprio para e-mail, PDF com cabeçalho, seções, quebra de linha, páginas e rodapé. Mesma fonte de verdade, alertas para fichas em revisão, preservação de rolos, lances e unidades legadas.
- Criados testes `eletroduto-lab-2026-11-12.test.cjs` e `compartilhar-formatos-2026-11-12.test.cjs`; atualizado `fluxo-campo-17-11.test.cjs`; fixture `etapas-compactas.test.cjs` alinhada a IDs de condutor atuais. Workflow GitHub Actions recebeu **seis testes** adicionais, incluindo quantificação e visões recentes.
- `x/index.html` atualiza URLs de scripts; `x/sw.js` pré-carrega o snapshot LAB; `x/pwa.js` e `x/version.json` identificam X.0.3.51.
- **Evidências:** verificação sintática e execução isolada de regras/modelos; **ainda não confirmados** execução integral do CI, renderização real do PDF, envio em aplicativos, deploy Cloudflare e testes móveis.
- [Roteiro, matriz técnica, formatos e pendências](REVISAO-ELETRODUTO-E-RELATORIOS-2026-11-12.md).

## 12/11/2026 — X.0.3.50 · Fundos internos iguais, paleta mais suave
- Feedback de campo: apesar da padronização dos agrupadores, o último nível tinha uma diferença perceptível entre **branco** e **cinza**. A composição lousa + neon também estava carregada.
- Causa revisada no CSS: na versão anterior `.compact-stage-material` usava branco a 82% de opacidade, enquanto `.compact-material-card .compact-stage-list` usava branco a 48% (além de camadas lousa/neon nos pais). A mesma informação terminava com fundos diferentes.
- **Solução:** superfícies internas (itens e lançamentos) usam a **mesma cor opaca**, `var(--tx-app-surface)`, nos modos Por etapa e Por insumo, evitando variação causada pela mistura de transparências. Recuo, bordas e pequena guia lateral preservam relações de pertencimento.
- Reduzidas as intensidades da paleta: card lousa 9% no claro (12–13% escuro/TEREON), título neon ~8% e filete de destaque. Cabeçalhos continuam padronizados entre os modos.
- Não alterados dados, estrutura do modal, motor, ficha, cálculo comercial, relatórios, estados da lista ou JS da interface. Apenas `x/styles.css` e versão/cache em `x/index.html`, `x/pwa.js`, `x/sw.js` e `x/version.json` (X.0.3.50).
- Verificação estática de seletores e alinhamento das cores feita. **Revisão visual em celular, CI e publicação Cloudflare ainda não confirmados.**

## 12/11/2026 — X.0.3.49 · Padronização de cores nos dois agrupamentos
- Revisão visual solicitada: **Por insumo** e **Por etapa** devem ter a **mesma linguagem de cores**, sem diferença entre seus cards principais.
- Card do agrupador (ambas as visões): **verde-lousa translúcido** `rgba(102,139,119,.16)` no tema claro, `.20` nos temas escuro/TEREON.
- Faixa do cabeçalho (ambas as visões): **verde neon TEREON #C7FF46 translúcido**, `rgba(199,255,70,.16)` no claro, `.13` no escuro e `.14` no TEREON.
- Bordas discretas do mesmo sistema; itens e lançamentos internos mantidos em fundos neutros para reforçar a hierarquia. Tons do texto do tema preservados.
- Mudanças limitadas ao `x/styles.css`; `x/index.html`, `x/pwa.js`, `x/sw.js`, `x/version.json` atualizados para X.0.3.49 e invalidação do cache.
- **Não alterados**: modal de adicionar item, fichas, quantificação, agrupamento de dados, textos técnicos, ações de editar/duplicar/excluir, relatórios e `main`.
- Conferência estática dos seletores/versões efetuada; testes visuais em celular, CI e publicação Cloudflare não confirmados.

## 12/11/2026 — X.0.3.48 · Resumo essencial para localizar materiais
- Feedback do fundador: a visão **Por etapa** estava próxima do esperado; **Por insumo** ainda exibia atributos menos úteis. A cor precisa ser legível e a isolação PVC precisa aparecer quando confirmada.
- As **duas visualizações** agora usam a mesma seleção de atributos curtos, independente da composição do nome técnico completo. Exemplo de condutor: **Condutor isolado** / **Cobre · 2,5 mm² · Azul · PVC**.
- Ordem de localização para `FT_COND-001`: tipo selecionado, material, seção, **cor**, isolação e, quando for diferente, cobertura. PVC e cor são exibidos apenas se tiverem sido explicitamente confirmados nos valores do lançamento; o resumo não os infere do nome ou de catálogo genérico.
- Em outras fichas, exibir até quatro detalhes confirmados, priorizando tipo, material, dimensão e cor. Sempre preservar especificação técnica integral na expansão.
- CSS libera até **duas linhas** da legenda técnica nas visualizações por insumo/etapa para evitar ocultar cor e PVC em telas estreitas.
- Não modificar cadastro, motor de especificação, chaves de consolidação, cálculo comercial, quantidade, unidades, relatórios, registros, dados em nuvem ou `main`.
- Adicionado `x/tests/resumo-localizacao.test.cjs` com verificações de cor, PVC, ausência não inferida, cobertura distinta e insumos de infraestrutura.
- Código e versão `x.0.3.48` gravados em `desenvolvimento`; verificação sintática e ensaio isolado dos cenários acima concluídos. **Deploy Cloudflare, CI e teste em celular não confirmados**.

## 12/11/2026 — X.0.3.47 · Hierarquia visual com verde neon translúcido
- Sugestão aplicada a partir do feedback de campo: utilizar o verde **#C7FF46** como acento translúcido, sem tornar a lista carregada.
- **Etapa**: fundo neon suave, contorno discreto e filete lateral neon no cabeçalho.
- **Insumo**: superfície secundária dentro da etapa, com borda fina; mantém título, especificação, quantidade e expansão.
- **Lançamentos**: área recolhida com fundo quase neutro e guia lateral, indicando visualmente que pertencem ao insumo.
- **Por insumo**: cartão de material recebe detalhe leve de contorno e as etapas internas, fundo suave.
- Intensidades específicas para temas `light`, `dark` e `tereon`, respeitando contrastes já existentes e sem alterar HTML/JS de listas, catálogo, registros ou regras de quantificação.
- CSS em `x/styles.css`; `x/index.html` atualiza query de estilos e `x/pwa.js`, `x/sw.js`, `x/version.json` avançam para X.0.3.47.
- Escopo **somente visual**. Validação visual no celular, CI e publicação no Cloudflare não confirmadas nesta atualização.

## 12/11/2026 — X.0.3.46 · Etapas compactas e identidade visual do material
- Feedback do fundador: visão Por insumo aprovada, mas cartões Por etapa grandes demais; difícil diferenciar nome do item e especificação.
- A etapa agora é um grupo recolhível, com lista interna de **linhas compactas por insumo e apresentação**. Lançamentos idênticos na mesma etapa se agregam visualmente, sem alterar os registros originais nem seus vínculos.
- Separação visual: **nome do insumo em destaque**, derivado do nome da ficha quando disponível; detalhes técnicos confirmados em legenda secundária. O nome técnico completo permanece no detalhe expandido.
- Quantidade Por etapa é a **metragem medida** quando `qtyBasis='m'`, sem fazer arredondamentos comerciais individuais. Em apresentação legada, mantém quantidade/unidade original.
- Tocar na linha exibe cada lançamento original e seus botões **Editar, Duplicar, Excluir**. O modo Por insumo continua agrupando por apresentação de compra e vinculando as etapas.
- Sem alteração em motor de quantificação, catálogo, ficha, dados de usuário ou `main`. Acrescentado teste `x/tests/etapas-compactas.test.cjs` para agrupamento visual, separação título/descrição e preservação das ações.
- Nova versão e recursos PWA: **X.0.3.46**. Sintaxe e montagem isolada de linhas verificadas; CI, publicação Cloudflare e teste físico ainda não confirmados.

## 12/11/2026 — X.0.3.45 · Correção dos botões Por insumo / Por etapa
- Feedback de campo: o alternador aparecia, mas não mudava a organização após criar lançamento na etapa Sala 2.
- Causa confirmada em `x/listas/app.js`: a rotina `[data-list-view]` estava dentro do bloco `if(a)` dedicado a `[data-action]`. Os botões de agrupamento não possuem `data-action`, por isso o clique não alcançava essa rotina.
- Corrigido tratamento do alternador antes do roteamento geral, sem alterar os lançamentos, o motor de quantificação, os cartões compactos e o modal aprovado.
- Nova verificação isolada simulou cliques `insumo → etapa` e `etapa → insumo` e confirmou chamada de renderização para ambos. Criado `x/tests/agrupamento-ui.test.cjs` para regressão.
- Incrementados `x/index.html` (cache bust), `x/pwa.js`, `x/sw.js` e `x/version.json` para X.0.3.45.
- **Limites:** sintaxe e cliques simulados validados; publicação Cloudflare e execução no celular não confirmadas.

## 12/11/2026 — X.0.3.44 · Visão compacta de listas (revisão de campo)
- Feedback do fundador em trânsito: cabeçalhos de material ocupavam espaço excessivo e a especificação era repetida em cada lançamento da mesma lista.
- A visualização **Por insumo** agora apresenta **um cartão por identidade técnica + apresentação comercial**, com título técnico limitado a duas linhas na visualização compacta e especificação completa disponível ao expandir o próprio título.
- No cabeçalho, quantidade de compra e apresentação comercial; abaixo, **apenas etapas e respectivas quantidades medidas**, consolidadas por etapa. Tocar na etapa revela os lançamentos de origem e mantém **Editar, Duplicar, Excluir** acessíveis.
- Visualização **Por etapa** também utiliza cartões compactos, com especificação expansível e ações mantidas. O motor de quantificação, o catálogo, o modal aprovado e os dados originais **não foram modificados** nesta revisão.
- Exemplo validado no motor: Sala 1 (100 m) + Sala 2 (170 m) = 270 m medidos; RL200 m => **2 rolos**; RL100 m => **3 rolos**. A conversão depende da apresentação previamente escolhida e não é refeita no relatório.
- Sintaxe de `x/listas/app.js`, `quantificacao.js`, PWA e SW avaliada; teste isolado de formação dos cartões, estágios, ações e regra de rolos executado. Teste visual no celular, CI e publicação Cloudflare **não comprovados**.

## 12/11/2026 — X.0.3.43 · Lista por insumo/etapa e relatórios
- Implementada interface de lançamentos diretamente abaixo de Adicionar item, com modos Por insumo e Por etapa. Excluído bloco redundante de resumo experimental na tela.
- Motor `x/listas/quantificacao.js`: lances de comprimentos diferentes do mesmo insumo passaram a compor **uma linha**, preservando metragem, contagem, `breakdown`, etapas e IDs de origem. Rolos de apresentações diferentes permanecem separados; registros legados continuam sem reinterpretação.
- Motor Compartilhar: finalidades Compras, Completo e Execução e saídas texto/e-mail/PDF, com composição dos lances no resumo de compras.
- Caso de contrato: 3×100 m + 2×70 m + 2×30 m = 500 m em 7 lances, separado de RL100 m. Teste de quantificação atualizado.
- Arquivos de entrada, versão PWA e cache incrementados para X.0.3.43.
- **Validação disponível:** análise sintática dos cinco scripts alterados e execução isolada de consolidação e texto de compras, com saída confirmada. **Ainda não comprovados** testes automatizados no GitHub Actions, renderização/teste físico, publicação Cloudflare e PDF no navegador.
- [Contrato de decisão](CONTRATO-LISTAS-AGRUPAMENTO-E-RELATORIOS-2026-11-12.md).

# TEREON X — Histórico técnico consolidado

## 09/11/2026 — Encerramento da conversa e conceito de CI
- Explicado ao fundador: CI = Integração Contínua; GitHub Actions roda testes automáticos de contratos, regressão e código. Sucesso de testes não substitui testes reais no celular.
- Proposto como critério de liberação: **CI comprovadamente verde + fluxo real validado no aparelho + aprovação expressa do fundador**.
- Fundador solicitou registrar e abrir nova conversa. Continuidade concentrada em [Retomada 09/11](RETOMADA-2026-11-09.md) e [Revisão geral](REVISAO-GERAL-CONTRATOS-2026-11-09.md).
- Não houve alteração funcional da aplicação. Versão permanece **X.0.3.29**; a execução efetiva do CI ainda não deve ser presumida.


## 09/11/2026 — Fechamento documental e revisão de contratos da X.0.3.29
- Confirmado código de referência X.0.3.29 na branch desenvolvimento; o fundador considerou o **layout** de Minhas listas bom. O HTML `#addDialog` permanece igual à fixture aprovada X.0.3.4.
- Criados [auditoria de 09/11](REVISAO-GERAL-CONTRATOS-2026-11-09.md), [roteiro de retomada](RETOMADA-2026-11-09.md) e teste de invariantes `x/tests/contratos-fechamento-2026-11-09.test.cjs`; teste incluído no workflow do GitHub Actions.
- Documento Mestre, índice, arquitetura, mapa, guia visual, matriz de regressão, README e história revisados para distinguir estado vigente de narrativas antigas.
- Conferida por consulta read-only a existência de políticas RLS por proprietário em `x_cloud_lists` (SELECT/INSERT/UPDATE/DELETE). **Nenhuma lista real foi excluída ou regravada** nesta revisão.
- Registradas lacunas: CI atual/Preview não verificados, validação móvel e multiusuário, diferença entre contrato-alvo e formatos atuais do Compartilhar, fichas em revisão e futura modelagem de Solicitações/etapas.
- Sem mudança do HTML do modal aprovado, motores de dados, catálogo, registros de usuário ou `main`. Esta revisão documental/testes **não cria outra versão funcional**: permanece X.0.3.29.


## 09/11/2026 — x.0.3.29 · Seleção na altura do título
- O checkbox de cada lista foi deslocado para o topo direito, **alinhado verticalmente ao título**, e as quatro ações Editar, Duplicar, Compartilhar e Excluir ficam **na mesma linha abaixo** dele.
- Mantida seleção individual, ações e persistência anteriores. Sem alterar dados, motores, sincronização, fichas, exclusão segura ou modais técnicos. Tema claro/escuro/TEREON segue os mesmos critérios visuais.
- Teste de estrutura atualizado. PWA/cache `x.0.3.29`; CI e inspeção visual no celular ainda não confirmados.


## 09/11/2026 — x.0.3.28 · Seleção compacta e proposta de andamento de listas
- Checkbox de seleção **acima do botão Excluir**, na mesma coluna direita dos ícones. Estilo discreto semelhante aos checkboxes de e-mail; não acrescenta linha acima do título. Cartão retorna à altura compacta de aproximadamente 72px (altura mínima, expansão por conteúdo).
- Permanecem os quatro ícones: Editar, Duplicar, Compartilhar e Excluir. O checkbox continua sem ação em lote destrutiva; marcação permite limpezas e compartilhar uma única selecionada como antes.
- **Proposta pendente de aprovação funcional (não implementada):** distinguir dois tipos de estado no cartão: (a) técnico Local/Sincronizada/Aguardando/Falha/Conflito, já existente; (b) andamento da solicitação Pendente → Aprovada → Em compras → Comprado → Recebido. Definir permissões de aprovação, transições, histórico, revisão após aprovação e recebimento parcial antes de persistir. Não inferir andamento por sincronização.
- Não alterados dados, Supabase, exclusão segura, fichas, modais aprovados, `main`. Versão/cache PWA x.0.3.28; CI e avaliação móvel ainda sem confirmação.


## 09/11/2026 — x.0.3.27 · Seleção discreta e Compartilhar no cartão
- O seletor de listas tinha função limitada: acionar compartilhamento de **uma lista** pela barra de seleção, redundante ao compartilhamento individual; não havia edição/exclusão em lote. Isso foi explicitado ao usuário.
- Eliminada a barra `Selecionar todas`; o checkbox de cada lista está agora no **canto superior esquerdo dentro do cartão**. Quando há seleção, surgem apenas contador, Limpar seleção e Compartilhar selecionada (habilitado com exatamente uma lista).
- Compartilhar passou para dentro do mesmo grupo de ações à direita: **Editar nome, Duplicar, Compartilhar, Excluir**. Nenhuma dessas operações foi removida. O botão externo de compartilhamento foi retirado.
- Preservados motor, regras de segurança e confirmação da exclusão, estado de sincronização por lista, fichas e HTML do modal aprovado.
- CSS refinado em telas estreitas. PWA/cache x.0.3.27; CI e visual real do celular ainda não comprovados.


## 09/11/2026 — x.0.3.26 · Cartão de lista unificado, ações e seleção
- Corrigido o layout rejeitado com botão Excluir separado: cada lista possui **um cartão único**. A área principal abre a lista; à direita, **três botões compactos** com ícones e rótulos acessíveis: Editar nome, Duplicar, Excluir. Exclusão mantém confirmação e proteção local/nuvem já implementadas.
- **Compartilhar** fica do lado de fora, à direita de cada cartão, usando o motor existente de texto/e-mail/PDF, sem precisar abrir o modal da lista.
- Incluídas caixas de seleção à esquerda, `Selecionar todas`, contagem e `Compartilhar seleção` habilitado somente quando **uma** lista está selecionada. Seleção de múltiplas listas é visual nesta primeira etapa; não executa exclusões em lote nem inventa compartilhamento múltiplo.
- Novo espaçamento vertical entre título/ações e primeiro cartão, mantendo cartões translúcidos, três temas e sem mudar a estrutura do modal técnico.
- Motor de Listas ganhou `renameList` com validação e `duplicateList` com novos `id` e `recordUid`, cópia profunda dos lançamentos/etapas e sem herdar o estado `cloudVersion` do original. Assim a lista duplicada poderá ser sincronizada como registro novo, sem sobrescrever o original.
- Testes estáticos e contratos ampliados; cache e versão PWA atualizados. Não há confirmação de execução do CI nem visualização no celular nesta etapa. Somente branch `desenvolvimento`.


## 09/11/2026 — x.0.3.25 · Refino visual de Minhas listas
- Aprovação parcial do formato atual das listas; mantida a estrutura dos cartões e seus indicadores individuais de armazenamento.
- Botão **＋ Nova** promovido a ação primária com verde-escuro no Claro e neon no Escuro/TEREON, preservando `data-action="create"`.
- **Conferir nuvem** padronizado como secundário; **Excluir** permanece uma ação separada, discreta e com confirmação.
- Superfícies de listas e painéis passam de branco puro para tons de cinza/verde-lousa com leve transparência definida por tema, preservando contraste e foco de teclado.
- Alteração estritamente de classes e CSS, sem editar motores de listas, sincronização, fichas, banco ou HTML do modal aprovado.
- Teste de contrato visual adicionado; cache e script do PWA atualizados para x.0.3.25. Validação real em celular e resultado do CI ainda pendentes.


## 09/11/2026 — x.0.3.24 · Estado e exclusão por lista
- `Minhas listas` mostra o estado de cada lista no próprio cartão: **Local**, **Aguardando nuvem**, **Sincronizando**, **Sincronizada**, **Falha no envio** ou **Conflito**. A mesma indicação é exibida nos detalhes da lista. O antigo aviso geral de sincronização foi removido; o comando discreto `Conferir nuvem` permanece para contas.
- Cada cartão recebeu um botão separado `Excluir`, com confirmação explícita do nome e do número de lançamentos. O botão que abre a lista permanece independente.
- Para visitantes: `TereonXLists.removeList(id)` exclui apenas do repositório local. Para usuários autenticados: `TereonXListIntegration.deleteList(id)` consulta o estado remoto, verifica conflitos e sincronizações em andamento e só remove a cópia local **depois** de obter confirmação da exclusão no backend; se houver falha, preserva a cópia local.
- `TereonXCloudLists.deleteList(id,version)` restringe a exclusão a `owner_id`, ID e versão da lista; alterações concorrentes não são apagadas.
- Bloqueio de corrida entre consultas, envios e exclusões. Ação de exclusão não apaga outras listas nem altera as fichas ou o HTML do modal técnico aprovado.
- Testes de exclusão local, falha remota, conflito e não reaparecimento após atualização acrescentados aos contratos; sem alteração na `main`.
- **Segurança verificada em Supabase (09/11/2026):** aplicada a migração `x_cloud_lists_owner_delete`. A role `authenticated` recebeu privilégio DELETE na tabela `public.x_cloud_lists` com RLS `x_cloud_lists_delete_owner` exigindo `owner_id = auth.uid()`. Conferido: `authenticated_can_delete=true`, `anon_can_delete=false`, `rls_enabled=true` e uma política DELETE restrita ao proprietário. A migração não removeu nenhuma lista existente.
- **Pendências de validação:** execução comprovada de CI, exclusão de teste com sessão autenticada e avaliação visual no celular. Se o backend negar uma exclusão, os dados locais devem permanecer preservados e um erro ser informado.


## 09/11/2026 — x.0.3.23 · Estado de rede simplificado e diagnóstico de sincronização
- Cabeçalho: nome do perfil acompanhado de ON/OFF antes do nome. Os chips separados Online/Offline e Registrado/Visitante ficam ocultos visualmente, mantendo os dados de estado para integração. ON/OFF reflete **apenas conectividade do dispositivo** (navigator.onLine), jamais confirmação da nuvem.
- Sem sessão, o nome exibido é Visitante; com conta autenticada e nome de exibição, aparece o nome. Conta autenticada sem nome usa Minha conta (e não Visitante, porque isso seria incorreto).
- Motor de Listas **não alterado**; nenhuma flag `cloudPending` foi apagada. Mensagem de sincronização dá prioridade a falhas com motivo, quantidade de listas pendentes, conflitos e trabalho em andamento. Após retorno da nuvem, somente confirmação remota pode liberar pendência.
- O comando Atualizar foi renomeado conforme o estado para Conferir nuvem / Tentar sincronizar e exibe falhas sem apagar cópias locais. No momento de erro de consulta à nuvem, mantém cache e registra motivo informativo.
- Teste expandido: pendência é mantida em falha e limpa apenas após resposta do backend de demonstração. PWA e cache x.0.3.23; mudanças na branch desenvolvimento.
- Diagnóstico real do usuário ainda depende do erro retornado pelo backend e de teste no dispositivo. **Não** presumir que ter rede e sessão implica sincronização concluída.


## 09/11/2026 — x.0.3.22 · Caminho da tela e temas nos modais
- Substituído o retorno de cabeçalho por uma trilha de navegação posicionada **abaixo da linha divisória**, com links de antecessores e último nível identificado como página atual. Ex.: Ferramentas › Listas de materiais; Ferramentas › Escola › Biblioteca. A primeira palavra é clicável nas telas internas.
- O estado de Listas atualiza a trilha com `TereonXHeader.setPath`; a ação de retorno existente (`data-action="home"`) é preservada. A marca TEREON X continua retornando à Home.
- Removida a regra que forçava o tema claro nos modais. Adicionadas **somente regras CSS de apresentação** para fundo, bordas, campos, textos, chips, opções de fichas, botões e cartões internos nos três temas. Nenhuma alteração de HTML dos diálogos ou de serviços técnicos.
- Ref do cabeçalho v6, CSS do cabeçalho v5, CSS de aparência v5 e Listas UI v12; versão/cache PWA x.0.3.22.
- Teste de trilha acrescentado ao CI; asserts dos testes existentes ajustados. Critérios pendentes: execução de CI comprovada e avaliação visual dos modais no celular, especialmente contraste das tags e sobreposição de modais.
- Trabalho limitado à branch `desenvolvimento`; arquivos de armazenamento, banco, catálogo, modais aprovados e `main` preservados.


## 09/11/2026 — x.0.3.21 · Temas em Minha conta e navegação mais limpa
- O seletor Claro, Escuro e TEREON foi retirado da Home e colocado na página **Minha conta**, em painel acessível a visitantes ou usuários registrados. A chave de preferência e os comportamentos continuam idênticos.
- A marca **TEREON X** do cabeçalho tornou-se link para as Ferramentas. Nas páginas com destino direto a `/x/`, foi removido o botão Início redundante.
- Dentro de Listas, `homeNavButton` permanece com ID e ação original, mas passa a ser um link textual discreto **← Ferramentas**; o motor de navegação não foi alterado. Nas páginas aninhadas (Biblioteca/Fichário) permanecem retornos contextuais.
- Atualizado contraste/estilo da seleção de temas dentro do painel de perfil, mantendo 44px de altura para toque.
- Testes de aparência e cabeçalho adaptados; versão e cache PWA x.0.3.21. Modal aprovado, fichas, listas, armazenamento e `main` preservados.
- Teste visual em dispositivo e resultado verde do CI ainda pendentes.


## 09/11/2026 — x.0.3.20 · Nome no perfil e temas visíveis no celular
- Cabeçalho compartilhado mostra **Visitante** sem sessão, **Registrado** se há conta sem nome, ou `x_profiles.display_name` quando preenchido. Nome de exibição é consultado de maneira assíncrona, sem bloquear páginas, armazenado localmente por ID para uso offline. Logout não exibe nome de conta anterior.
- Atualização de nome pela tela Minha conta reflete imediatamente no cabeçalho. Nome longo é abreviado visualmente no celular, preservando o texto no perfil.
- `appearance.js` agora aplica a preferência local no documento inteiro (`data-tx-appearance`), mantendo `data-appearance` da Home e a mesma estrutura e ações nos três modos.
- `appearance.css` introduz paleta de superfícies comum para páginas independentes e Listas e adapta a cor da barra de navegação móvel. Sem alteração nos motores ou estrutura dos modais.
- **Proteção:** modais de trabalho seguem com paleta clara e contraste original nessa etapa; migração completa de seu visual ocorrerá separadamente após homologação.
- Texto discreto **Prévia visual X.0.3.20** aparece no Início para diagnosticar PWA desatualizado no celular. Cache de serviço e versão do PWA atualizados.
- Teste de nome do perfil adicionado ao workflow. Os testes existentes de aparência/cabeçalho ajustados. Sem alteração em `main`, dados das listas ou tabelas Supabase.
- **Pendente:** CI comprovado e teste visual real em Android/iPhone. A presença da versão no código não comprova que o Worker Cloudflare tenha implantado o commit.


## 09/11/2026 — x.0.3.19 · Guia visual e protótipo das três aparências
- Criado o guia `x/docs/GUIA-VISUAL-TEREON-X.md`: cores semânticas, papéis do verde-lousa, contraste, navegação e regra fundamental de que temas **não alteram comportamentos**.
- Criados `x/appearance.js` e `x/appearance.css`. O seletor Claro, Escuro e TEREON aparece **somente no Início**, com preferência salva localmente na chave `tereon-x-appearance-v1`. Não usa Supabase ou motores de Listas.
- Claro: cinza claro + verde escuro; Escuro: grafite + verde neon; TEREON: fundo verde-escuro, neon e geometria visual leve em CSS. **Imagens próprias e experiências mais imersivas ainda não foram desenvolvidas**.
- Cards, URLs, atributos funcionais, componentes de conta, listas e modal aprovado permanecem com o mesmo comportamento. As demais telas não recebem o novo tema até validação.
- Teste `x/tests/aparencia.test.cjs` adicionado ao CI. Cache PWA e `version.json` atualizados para x.0.3.19.
- Sem alterações em banco, Supabase, `main` ou motores técnicos. Aceite visual em celular e execução comprovada do CI ainda pendentes.


## 09/11/2026 — x.0.3.18 · Cabeçalho único em todos os módulos
- Inventário de oito páginas principais: Início/Listas, Escola, Biblioteca, Fichário, Universo/Obras, Minha conta, Compartilhamento e Contribuição.
- Criados `x/components/header.js` e `header.css`, utilizados pelas oito páginas para estruturar a marca, o perfil e os indicadores de modo uniforme. Os retornos (Início/Escola/Biblioteca/Listas) ficam em uma linha separada do perfil. O Início não apresenta botão de retorno redundante.
- `header-session.js` consulta sessão em páginas independentes, sem interferir com as operações dos respectivos módulos. Em falha de rede, a sessão apenas armazenada é identificada como não validada; essa leitura não concede nenhuma permissão.
- Registrado contrato de evolução em `x/components/README.md` para evitar que futuras telas criem novos cabeçalhos individuais.
- Teste `x/tests/cabecalho.test.cjs` adicionado ao CI e contratos históricos atualizados. PWA, service worker e versão unificados como x.0.3.18, com pré-cache dos componentes.
- Preservado o HTML do modal `addDialog`, a lógica de fichas, as listas e as tabelas Supabase. Somente branch `desenvolvimento`; sem alteração em `main`.
- **Pendente:** execução CI comprovadamente verde, conferência visual em celular e teste de navegação com rede lenta.


## 09/11/2026 — x.0.3.17 · Cabeçalho compacto e estados de conta
- Removido botão Início redundante da página inicial; o botão só aparece ao acessar a ferramenta Listas, preservando retorno sem recarregar.
- Minha conta e os indicadores de rede/identidade agrupados no canto superior direito, conforme padrão de navegação solicitado.
- `INITIAL_SESSION` atualiza o indicador a partir da sessão já presente no navegador antes da verificação remota, identificando sessão registrada ainda não validada; a verificação `getUser()` continua a definir o estado confirmado.
- Botão Instalar fica oculto por padrão e aparece apenas com evento de instalação disponível ou no Safari iOS fora do modo standalone; em janela do PWA instalado permanece oculto. Não é possível garantir detecção universal de aplicativo instalado em outra janela/perfil.
- Corrigido `x/pwa.js` para versão x.0.3.17, consistente com `version.json` e service worker; anteriormente estava x.0.3.15 apesar da versão do sistema x.0.3.16.
- Atualizados testes de status, navegação e regressão. Modais de lista e de adição técnica, dados e serviços de armazenamento preservados; alterações somente em `desenvolvimento`. Teste visual e CI ainda a verificar.


## 09/11/2026 — x.0.3.16 · Início como acesso às ferramentas e status da conta/rede
- Início passa a exibir apenas os acessos a Listas de materiais, Dimensionamento, Canivete, Universo e Escola. Criar lista permanece dentro de Minhas listas; o atalho antigo `?view=create` continua compatível.
- O cabeçalho passa a exibir dois estados independentes: Online/Offline (conectividade detectada pelo navegador, não garantia de serviço) e Visitante/Registrado, com estados Verificando conta e Conta indisponível quando não foi possível validar a sessão.
- Se há sessão salva mas falta conexão, o indicador mantém Registrado e informa sessão offline; não confunde ausência de rede com logout. Se a biblioteca de autenticação falhar, avisa Conta indisponível mesmo que o modo local continue disponível.
- Novo `x/status.js` independente dos motores técnicos e do Supabase. Adicionado ao precache PWA; versão de cache x.0.3.16.
- Regressões de Home e ordem de scripts atualizadas; novo teste `x/tests/status.test.cjs` integrado ao workflow.
- Preservados byte a byte o modal `addDialog` e a lógica de especificação, as listas existentes, os serviços, o banco e a branch `main`. Homologação visual em celular e CI ainda devem ser confirmados.


## 07/11/2026 — Auditoria modular (branch desenvolvimento)
- Inventário de arquivos e contratos.
- Mapeados acoplamentos entre shell, listas e formulário legado de condutor.
- Catálogo passou a exigir publicação/homologação explícita, não inferida por status isolado.
- Detalhes sem opções preservados no motor; pendências devem ser tratadas antes de homologação.
- Documentação de arquitetura, mapa, auditoria e testes revisada.
- Criado teste automatizado Node de contrato e workflow GitHub Actions; execução no CI ainda não confirmada.
- Revisada documentação da integração de sugestões (origem Cloudflare ainda requer validação).
- Nenhuma alteração aprovada para a `main`.

## 07/11/2026 — X.0.3.6
- Biblioteca e Catálogo de 24 fichas simuladas/restauradas após erro de sintaxe e códigos repetidos na origem.
- 2 fichas de revisão e 22 hipotéticas. Uso exclusivamente de laboratório.
- Teste isolado do motor com 24 registros realizado.
- Nenhuma homologação.

## 07/11/2026 — X.0.3.5
- Início da conexão `Ficha → Catálogo → Lista` e Biblioteca → Fichas Técnicas.
- Primeira integração apresentou regressões no carregamento (posteriormente corrigidas).

## 07/11/2026 — Migração de hospedagem e repositório
- Copiados arquivos exclusivos do X para `TEREON-eng/desenvolvimento`.
- Branches `main` e `desenvolvimento` separadas; Cloudflare Workers e Previews configurados.
- Produção e Preview devem ser distinguidas pelo deployment/branch, não pelo nome do Worker.

## Verificação automatizada adicional — 07/11/2026
- GitHub Actions do catálogo passou (run 42427001982, commit `78628c4`); apenas o contrato do motor, não a UI ou PWA.


## 07/11/2026 — X.0.3.7, separação efetiva de módulos
- Extraídos do `index.html`: estilos `styles.css`, instalação PWA `pwa.js`, apresentação `listas/app.js`.
- Criados `listas/store.js` (armazenamento) e `listas/servico.js` (CRUD e validação) com API injetável e sem DOM.
- A UI das listas deixa de modificar `localStorage` e estruturas persistidas diretamente; usa serviço exclusivo e snapshots.
- Preservada chave `tereon-x-lab-v1` e interface histórica de condutor apenas para edição de lançamentos antigos.
- Adicionado `tests/modulos.test.cjs` e CI com testes de contrato, persistência, dados históricos, isolamento e sintaxe.
- Atualizado service worker para pré-cache dos arquivos independentes.
- Somente `desenvolvimento`; promoção à `main` depende de teste funcional e aprovação.

## 07/11/2026 (noite) — Novos laboratórios e consolidação
- Supabase TEREON-app: identidade, espaços, obras, acessos e cópias de listas com RLS. Login real, cadastro, perfil e troca de senha autenticada testados pelo fundador; recuperação por e-mail não homologada (localhost/limites SMTP).
- Laboratório de compartilhamento entre contas implementado, sem teste real de duas contas. Tratamento de usuário não autenticado corrigido; integração na tela principal de Listas não realizada.
- Criados Mestre do X, Universo, matriz gratuito/pago, Diário Vol.02 e índice. Documentos históricos preservados; preço e pacotes ainda não aprovados. 
- Testes de identidade e compartilhamento adicionados ao CI; execução desta versão ainda não conferida. Sem merge na main.

## 07/11/2026 — Fundação do Universo / Motor de Obras
- Reaproveitadas `x_workspaces` e `x_works` no Supabase, adicionando status de obra, limites de texto e privilégios por coluna para não alterar identificadores/donos em edições de rotina.
- Criado `x/universo/obras/` com motor de cadastro/edição/arquivamento, laboratório isolado de UI, migração versionada e documentação.
- Adicionado `x/tests/obras.test.cjs` ao workflow. SQL e permissões confirmados por leitura no banco. Testes de navegador/multiusuário não realizados.
- Não alterados o shell, o Canivete, outros motores ou a `main`.

## 07/11/2026, noite — Revisão do Motor de Obras v2
O usuário testou o cadastro e reportou confusão com "Meu trabalho" e "empresa/empreiteiro", falta de edição/exclusão e regressão ao visual escuro antigo. O laboratório passou a apresentar o conceito de Espaço de Trabalho (pessoal ou organização), modais de cadastro/edição e tema claro coerente com o Canivete X. Os espaços agora têm edição de nome; obras e espaços podem ser movidos para a Lixeira e restaurados. O banco ganhou `deleted_at` em `x_workspaces`/`x_works`; não há exclusão definitiva de registros.
**Não houve alteração no Canivete, Identidade, Catálogo nem main.** Testes de sintaxe e de contratos do motor simulados; regressão de navegação e CI ainda não homologados.

## 08/11/2026 — Central de testes e evolução do cadastro de Obras
- Duas datas opcionais por obra: início e término previstos (`planned_start` / `planned_end`), constraint de ordem no Supabase e migração versionada em `x/universo/obras/sql/003_datas_previstas.sql`.
- Filtro `Todos os espaços` no laboratório de Obras, com lista e indicadores agregados sobre espaços **próprios** da conta; sem vazamento de outros espaços, RLS permanece.
- Criação de obra permite selecionar espaço no modal, inclusive na visão global; cartões exibem o espaço e as datas previstas.
- Nova central de links mobile-first: `x/laboratorios/index.html` — Canivete X, Obras, Conta e Compartilhamento. Não reescreve a lógica nem integra dados; apenas organiza acesso a laboratórios.
- Testes de contrato atualizados, arquivos relidos no GitHub e sintaxe JS verificada; fluxo em navegador publicado ainda precisa ser testado.

## 08/11/2026 — Pente-fino mínimo de navegação e identidade visual
Após teste no celular, fundador pediu reduzir a Central de Laboratórios, retirar o card de Conta, usar perfil no canto e garantir retorno à Central em todos os módulos, com tema claro consistente. Ajustes exclusivamente visuais/de navegação em `x/laboratorios/index.html`, `x/index.html` + CSS, `x/identidade/lab.html` + CSS, `x/compartilhar-usuarios/lab.html` + CSS e cabeçalho de `x/universo/obras/lab.html` + CSS. Central agora apresenta apenas Canivete, Universo e Compartilhar; Conta é ícone no canto. Todos oferecem retorno para `/x/laboratorios/`. CSS de Conta e Compartilhar migrado ao tema claro do X, mantendo formulários e IDs existentes. Cache do CSS do Canivete incrementado sem alterar scripts/motores.
Teste automatizado de estrutura atualizado e execução simulada aprovada; ainda falta validação visual humana no celular. **Não alterados motores, schemas, Listas persistidas nem a main.**

## 08/11/2026 — Listas passam ao primeiro plano
A Central do TEREON X passa a exibir **Minhas listas** e **Criar lista** como ações dominantes com links diretos para o fluxo existente, sem alterar o motor de listas. Canivete passa a representar calculadoras (sem ferramenta implementada ainda); Universo segue gestão de obras; Escola fica separada com link para Biblioteca. O perfil permanece no canto, e Compartilhar é acesso auxiliar. `x/manifest.webmanifest` inicia a PWA pela Central no próximo lançamento compatível. Nenhum vínculo lista–obra implementado; decisão de próximo motor registrada, inclusive o limite entre listas locais e obras no Supabase.

## 08/11/2026 — Motor de Identidade e Relações v1
- Criado `x/relacoes/motor.js` e documentação independente.
- Supabase: `x_record_identities` (UUID técnico de referência, origem, tipo, responsável) e `x_record_relations` (extremos, tipo, autoria, criação e encerramento), com RLS, constraints, políticas de leitura/gravação e proteção contra reescrita de relação encerrada.
- Primeiro tipo autorizado: `work` de usuário dono de obra ativa; tipos futuros **não** foram habilitados sem validação de propriedade e persistência. Listas continuam locais e avulsas.
- `x/tests/relacoes.test.cjs` passou em simulação e foi incluído no CI. Validação com duas contas reais ainda pendente.
- Preservados os serviços existentes, UI, Canivete, Universo e `main`.

## 08/11/2026 — Identificação técnica não destrutiva de Listas
- Motor de Listas v2 ganhou `recordUid` (UUID) nas listas novas e método explícito `ensureRecordUid(listId)` para listas antigas.
- Identidade adicionada sem renomear IDs existentes, alterar itens, migrar chave do localStorage nem criar obrigações de cadastro de obra/conta.
- Novo `x/relacoes/origem-listas.js` transforma lista em referência local; `remoteLinkAllowed:false` evita fingir sincronização.
- Testes de regressão ampliados para lista antiga, reabertura, idempotência, rollback de gravação e adaptador.
- Nenhuma nova tabela nem upload de Listas ao Supabase nesta etapa; vínculo obra–lista continua pendente. Sem alteração na `main`.

## 08/11/2026 — Laboratório independente de Listas na Nuvem
- Criada `public.x_cloud_lists` no Supabase, protegida por RLS proprietário e permissões de coluna, sem exclusão física habilitada no cliente.
- Serviço `x/listas/nuvem/motor.js`: listar, abrir, criar e salvar lista com materiais/etapas. Controle de versão transacional impede sobrescrita acidental por outro aparelho.
- Laboratório de uso simples `x/listas/nuvem/lab.html` com criação, lançamento/edição de material, salvamento e recuperação, sem tocar no Canivete local.
- Identidade de relações ampliada para `list` apenas de lista já salva na nuvem pelo usuário autenticado; ainda sem relação real com obra.
- Link discreto de teste na Central, testes de contrato incluídos no CI e documentação atualizada.
- **PENDENTE:** teste de navegador, duas contas, dois aparelhos e integração funcional com Motor de Listas existente. `main` não alterada.

## 08/11/2026 — x.0.3.8 · Motor Único de Listas com armazenamento por contexto
- Frontend principal de Listas agora usa o mesmo `x/listas/servico.js` e modal técnico tanto para dados avulsos no dispositivo quanto para conta com `x_cloud_lists`; eliminada entrada pública concorrente para laboratório de nuvem.
- Criados `x/listas/integracao.js` (cache por conta, sincronização, versão otimista, preservação de conflitos) e `x/listas/auth.js` (sessão e fallback local).
- Novas listas da conta usam UUID de origem estável, autorizado no Supabase em `x/listas/sql/002_client_uuid.sql`. Sincronização de gravações em background com informação visível no topo da lista, sem afirmar sucesso quando rede falha.
- Listas avulsas não são importadas automaticamente; usuário pode escolher copiá-las para sua conta em **Minhas listas**. Originais são mantidas no aparelho.
- PWA x.0.3.8: cache atualizado com módulos da integração, fallback de recursos locais e versão do app.
- Testes simulados `x/tests/listas-integracao.test.cjs` e `x/tests/modulos.test.cjs` passaram. Browser e CI a conferir; `main` não alterada.

## 08/11/2026 — Correção de navegação: modal técnico em todas as entradas
- Problema reportado: ao usar a tela antiga `x/listas/nuvem/lab.html`, o formulário básico de materiais substituía na prática o modal de especificação. O modal técnico `TereonXCatalogUI.open` continuava no Motor de Listas principal, mas o laboratório legado seguia acessível e causava experiências divergentes.
- A página do laboratório legado agora **encaminha por padrão** a `/x/?view=lists`, com o Motor de Listas e o modal técnico. O modo de diagnóstico continua disponível via `?diagnostico=1`.
- Teste de regressão acrescentado para exigir que o botão **Adicionar item** abra `TereonXCatalogUI.open`, com opções condicionais, obrigatoriedades e nome técnico.
- O link de compartilhamento entre contas foi retirado da Central: ferramenta de envio de snapshot ainda experimental, não sincronização colaborativa. Arquivos e dados existentes preservados, acesso técnico permanece por caminho direto.
- Correção restrita à branch `desenvolvimento`; nenhuma alteração de itens, regras técnicas, dados ou branch `main`. Testes de código/contrato executados; confirmação visual real pendente.

## 08/11/2026 — x.0.3.9 · Abrir lista em modal
- **Minhas listas** permanece ao fundo. Ao tocar em uma lista, abre o modal `#listDialog` com cabeçalho, botão **← Minhas listas**, fechamento `✕`, lançamentos, compartilhar e adicionar item.
- O fechamento do modal (inclusive tecla Escape) devolve a relação de listas, sem navegar para outra página.
- O seletor técnico `TereonXCatalogUI.open` continua como modal independente sobre o detalhe da lista. Não foram modificadas as fichas, regras, armazenamento local/nuvem nem motores de especificação.
- Versão x.0.3.9 e testes de contrato atualizados; homologação visual em celular/desktop ainda necessária. Branch `main` não alterada.

## 08/11/2026 — x.0.3.10 · Restauração do modal aprovado (regressão grave)
- **Causa identificada:** o botão **Adicionar item** foi alterado para invocar `openCatalogAdd()`, um seletor experimental diferente do modal aprovado. O próprio modal aprovado X.0.3.4 nunca havia sido removido do shell; sua rota de abertura foi substituída indevidamente.
- **Fonte recuperada:** `jhcolba-del/tereon`, commit `9e762fa`, `x/index.html`, versão X.0.3.4. O trecho HTML do modal foi comparado byte a byte com o `addDialog` atual e corresponde integralmente.
- **Corrigido:** o botão agora invoca `openAdd()`; mantém seleção progressiva, nome técnico em formação, tags removíveis, obrigatórias em contorno duplo, quantidade/unidade/etapa, sugestão de etapas e retorno à primeira obrigatória pendente após remover tags. A gravação usa o Motor Único de Listas existente.
- **Proteção:** snapshot do HTML aprovado em `x/tests/fixtures/modal-adicionar-aprovado-x034.html`, e teste em `x/tests/modulos.test.cjs` que exige igualdade estrutural e caminho de abertura original. Versão PWA x.0.3.10.
- **LIMITE:** a ficha desse modal X.0.3.4 é demonstração de condutor, não o catálogo final generalizado; itens de catálogo `catalogId` ainda podem usar seletor experimental em edição. Confirmar resultado visual no navegador e detalhar política única de edição antes de considerar concluída a restauração de todas as fichas. A branch `main` não foi alterada.

## 08/11/2026 — x.0.3.11 · Modal aprovado conectado ao fichário atualizado
- Fonte lida: `Fichario.xlsm` em Google Drive, modificado em 2026-11-08T02:26:33Z, SHA-256 `a6c9cf1de9f06bbb07f575a7632f3ced8f85b0457eeca9af46983c45c4baa903`. A planilha **não foi modificada**.
- Snapshot estruturado e versionado: `x/fichario-x/fichas-drive-2026-11-08.json`. Apenas **seis fichas com abas existentes**: Eletroduto, Condutor elétrico, Curva para eletroduto, Conectores para eletroduto, Abraçadeiras, Caixa de passagem. Entradas do Índice sem ficha não foram inventadas.
- `TereonXCatalog.load()` passa a ler esse snapshot em lugar de `simulacao-24.json`, mantendo a distinção **Em revisão** vs **Homologado**.
- Dentro do `addDialog` aprovado (HTML idêntico ao registro X.0.3.4), o usuário pesquisa e escolhe a ficha, depois especifica progressivamente detalhes condicionais, confirma tags, vê nome técnico formado e salva com `catalogId`. O modal de lista, a persistência por conta, o carregamento local e a sincronização não foram modificados.
- Preservada edição de material legado sem `catalogId`. Em edição de item que já possui `catalogId`, o mesmo modal carrega a ficha de origem; na ausência da ficha, não permite salvar silenciosamente outra identidade.
- Pendências da origem: aba `FT_INFRA-004 - Abraçadeiras` contém `B5='Conectores para eletroduto'`, divergente do código e da aba; outros detalhes possuem campos, obrigatoriedades ou valores incompletos. Exibido como revisão, sem preenchimento por inferência.
- Testes `x/tests/catalogo.test.cjs`, `x/tests/modal-fichas.test.cjs` e regressão de Listas adaptados; CI inclui teste de fluxo do modal. PWA x.0.3.11 carrega o snapshot para offline após instalação/cache.
- **Limites:** snapshot não sincroniza automaticamente edições futuras do Drive; revisões requerem nova importação/verificação. Testes de código e DOM simulado executados; falta homologação visual em dois aparelhos. `main` inalterada.

## 08/11/2026 — x.0.3.12 · Ajustes aprovados no modal de adicionar
- Busca de fichas deixa de ser sticky: a barra acompanha a rolagem do conteúdo, sem fichas passando visualmente por trás.
- Na etapa **Escolher material**, rodapé de lançamento (tags, quantidade, unidade e etapa) é recolhido temporariamente, liberando altura útil para a pesquisa e resultados. Ele reaparece assim que uma ficha é selecionada.
- A ação **Trocar material** sai do grupo de opções de características e vira uma tag discreta com nome da ficha e ×, ao lado do título da característica em edição (por exemplo, **Tipo**). Ao remover, volta para a busca das fichas; não grava nem presume novas seleções.
- O modal HTML aprovado, fichário de seis fichas, Motor Único de Listas, gravação e regras de obrigatoriedade foram preservados.
- Teste de DOM simulado ampliado para verificar a tag e retorno à escolha; passou. Validação visual em celular ainda pendente. Branch `main` inalterada.

## 08/11/2026 — x.0.3.14 · Início único, independência e Escola em salas
- **Corrigido:** URL inicial da PWA e da aplicação agora é `/x/` (Início); removedor de sessão não força a tela Minhas listas quando a conta autentica.
- A Central histórica `/x/laboratorios/` encaminha ao Início, evitando dois espaços semelhantes. Links `?view=lists` e `?view=create` continuam compatíveis.
- Início renderizado em HTML próprio `#homeScreen`, não pelo Motor de Listas. `#listsScreen` é região separada. Mesmo se Listas falhar, links de Universo/Escola permanecem visíveis.
- **Criar lista** abre `createDialog` diretamente sobre Início. Após salvar, o modal individual da lista abre sobre a tela anterior, que reaparece ao fechar.
- Escola vira card próprio → sala Biblioteca → primeiro livro, Fichário de Fichas Técnicas. O leitor técnico original foi movido sem reimplementar o motor de catálogo; headers de Escola/Biblioteca/Fichário seguem padrão visual atual.
- Dimensionamento e Canivete continuam visivelmente `Em preparação` — sem links falsos. Alterações na branch `desenvolvimento`, `main` inalterada.
- Avaliação de independência, RLS, duas contas e plano de homogeneização em `x/docs/REVISAO-ARQUITETURA-LAYOUT-2026-11-08.md`.
- Teste de navegação com DOM simulado `x/tests/home-navigation.test.cjs` passou. Teste de modal técnico `x/tests/modal-fichas.test.cjs` passou. **Validação real de duas contas/dispositivos ainda pendente.**

- Auditoria adicional: corrigida expressão de detecção de arquivos JS/CSS/JSON do service worker, que antes impedia o fallback offline desses recursos por um escape incorreto. Sintaxe e correspondência da extensão verificadas; teste offline real ainda pendente.

## 08/11/2026 — x.0.3.15 · Auditoria de independência
- Auditoria da separação entre shell, Motor de Listas, catálogo, armazenamento, Obras, Escola, autenticação e Relações em `x/docs/AUDITORIA-INDEPENDENCIA-2026-11-08.md`.
- Confirmadas nove tabelas x_% com RLS ativada, sem grants diretos para anon na consulta; teste negativo de A/B em sessão real ainda pendente.
- Criado e executado teste estático de fronteiras `x/tests/independencia.test.cjs`, incluído no CI, preservando o snapshot do modal técnico aprovado.
- No celular, modal **Criar lista** alinhado perto do topo para não ficar coberto pelo teclado e com altura máxima dinâmica/rolagem. O modal de Adicionar material não foi alterado.
- Backlog de bloqueadores técnicos priorizado antes de novos módulos. Não declarar independência completa ou homologação sem browser e testes reais.


## 09/11/2026 — saneamento documental de contratos (sem nova versão do aplicativo)
- Criado `docs/CONTRATOS-VIGENTES.md` com 12 contratos vigentes, estados de evidência e matriz decisão → implementação → teste → aceite.
- Introduzida precedência explícita: `#addDialog` X.0.3.4 é o fluxo principal; referência antiga a `txCatalogDialog` permanece apenas histórica.
- Ligados índice, mestre, retomada e matriz de testes à fonte normativa. Nenhum JS, CSS, banco, PWA, fichário ou `main` foi alterado nesta etapa.
- **Não homologado por esta documentação:** execução atual do CI, Preview, testes reais multiusuário/offline, PDF e conteúdo técnico das fichas.


## 09/11/2026 — ampliação da auditoria documental, sem mudança de versão
- Revisão de fronteiras de Listas e exclusão coordenada, integridade do cache e comportamento de registros ausentes do servidor.
- Confirmação de quatro políticas RLS por proprietário em `x_cloud_lists`; permanência de teste de segurança A/B como pendência.
- Adicionados cenários à matriz de regressão: exclusão cruzada A→B, falha de escrita após DELETE, troca de conta durante sync, abertura offline e autorização real.
- Atualizados [Mestre](MESTRE-TEREON-X.md), [Retomada](RETOMADA-2026-11-09.md), [Índice](INDICE-DOCUMENTACAO.md) e [Validação técnica](VALIDACAO-TECNICA-2026-11-09.md). **Nenhum motor, PWA, schema ou `main` alterado**; versão do aplicativo permanece X.0.3.29.


## 09/11/2026 — auditoria adicional da fronteira local/nuvem (documentação)
- Identificada divergência de validação de nome, quantidade finita, teto de 300 itens e tamanho de dados entre serviço local e motor de nuvem, com risco de lista salva localmente mas sem aceitação remota.
- Conferido o grant efetivo por coluna em `x_cloud_lists`: INSERT autenticado em `id` permitido, UPDATE de `version` bloqueado. Hipótese de falta de INSERT no ID descartada.
- Complementados Validação Técnica, Mestre e Plano de Regressão com cenários reproduzíveis. **Nenhum código ou dado modificado; versão X.0.3.29 preservada.**


## 10/11/2026 — X.0.3.30 · Etapas de Listas e validação compatível com a nuvem
- `x/listas/servico.js`: recalcular etapas sugeridas pelos materiais após inclusão, alteração, duplicação e exclusão; etapa vazia removida só na lista modificada, sem varredura na leitura ou alteração de Obras. Nome de lista nova até 160 caracteres e quantidade finita positiva.
- `x/listas/nuvem/motor.js`: expõe `validate` ao consumidor do adaptador remoto.
- `x/listas/integracao.js`: valida listas novas/alteradas com regras de payload remoto **antes** de confirmar cache autenticado; não trunca itens nem mexe nas listas de visitante.
- `x/tests/modulos.test.cjs` e `x/tests/listas-integracao.test.cjs`: casos de remoção da última etapa, movimentação de item, 301 materiais, quantidade inválida e conservação do cache. Testes adicionados; execução do CI não afirmada sem logs.
- Versão, PWA e cache alinhados em X.0.3.30; fluxo `#addDialog`, fichário, SQL e `main` não modificados.
- Documentado o conceito de **Obras**, escopo e etapas persistentes independentes das Listas, com proposta de sugestão a partir de lista vinculada. Não houve criação de tabela/motor de etapas de obra.

**Verificação adicional:** smoke-test JavaScript isolado foi executado sobre os motores extraídos da branch: etapa QD1 persiste com material, desaparece após mover o último a QD2, e QD2 desaparece após remover o último item; validações de quantidade infinita, título de 161 caracteres e payload de 301 itens rejeitaram as entradas. **Não é execução do GitHub Actions nem aceite de navegador.** Referências de scripts em `x/index.html` atualizadas para evitar reutilização de URLs em cache; estrutura `#addDialog` não editada.


## 10/11/2026 — Hierarquia de Obras e gestão da capacidade (somente documentação)
- Plano da organização TEREON-app verificado como Supabase Free; uso real da base ~12 MB, 2 usuários, 6 listas e 5 obras. Limites oficiais separados de tetos de laboratório. Orientações de monitoramento, backup, egress e Storage registradas.
- Definido conceitualmente escopo hierárquico: Quadros elétricos → QD1; etapa cadastrada da Obra persiste, rótulo temporário da Lista só vive enquanto tiver materiais. Lista vinculada sugere etapas existentes, sempre sob permissão. Nada foi implementado no banco/motor de Obras.
- Documentos de [capacidade](CAPACIDADE-ARMAZENAMENTO-2026-11-10.md) e [escopo hierárquico](ESCOPO-HIERARQUICO-OBRAS-2026-11-10.md) adicionados ao Hub. Não houve alteração de plano, pagamento, dados, `main` ou versão do aplicativo.


## 10/11/2026 — Prova isolada de sugestões de etapas em árvore
- Novo laboratório puro `x/universo/obras/sugestoes-etapas.js`; testes `x/tests/escopo-etapas.test.cjs` e etapa correspondente no GitHub Actions. Caso QD1 ambíguo sob Quadros/Iluminação, escolha de etapa-mãe e rejeição de ciclos/parent inexistente incluídos.
- Smoke-test JavaScript isolado sobre o código obtido do GitHub passou, mas a execução completa do Actions e o aceite no navegador seguem pendentes.
- **Sem alterações de SQL, rotas, interface, modal aprovado, `main` ou versão X.0.3.30.**


## 10/11/2026 — Motor independente de Escopo → Etapa → Subetapa
- Criado `x/universo/obras/escopo-motor.js`, separado de UI, Listas, SQL e armazenamento. Tipos explícitos `scope/stage/substage`; validação de nível e obra, caminhos hierárquicos, renomeação e arquivamento com operações imutáveis.
- Adicionado `x/tests/escopo-motor.test.cjs` e passo ao CI. Smoke-test isolado passou; **GitHub Actions completo e navegação real não comprovados**.
- Regra atual substitui árvore simplificada de dois níveis: `Revisão elétrica → Quadros → QD1`, `SPDA` e `Entrada de energia → Abrigo`. Nenhuma subdivisão é obrigatória.
- Debate sobre cobrança pelo armazenamento: sincronização pessoal básica gratuita recomendada, teto de listas e precificação **não aprovados nem implementados**.
- Não tocou a UI aprovada, fichas, banco, `main` ou versão X.0.3.30.


## 10/11/2026 — desenho de Pessoas, Equipes e Alocações (documentação)
- Registrada a diretriz social do produto: Listas e Escola com valor concreto no gratuito; receitas profissionais/colaborativas e Escola avançada como hipóteses a validar.
- Criado [contrato de desenho](PESSOAS-EQUIPES-ALOCACOES-2026-11-10.md) para pessoa sem conta, prestador, equipe, integrante temporal, alocação a Obra/Escopo/Etapa/Subetapa e autorização digital separada.
- Mestre, Universo, Contratos, Modelo Comercial e Índice atualizados. **Sem mudança no app, banco, login, convite, equipes ou `main`; versão X.0.3.30 permanece.**


## 10/11/2026 — Laboratório mobile: programação de equipes via Diário
- Criado motor puro `x/universo/diario/programacao-motor.js`, sem DOM/Supabase, que diferencia programação de Escopo/Obra em intervalo de dias versus Etapa/Subetapa em um dia; consulta por obra/dia, validações, cancelamento lógico e preservação de dados na simulação.
- Nova interface responsiva em `x/universo/diario/lab.html` + CSS/JS, com caso demonstrativo Wilson Rachid, Empreiteiro JS e Equipe A; armazenamento apenas local em chave segregada, sem autenticação ou gravação nos dados de Obras.
- Acesso do laboratório de Obras para Diário. Teste `x/tests/diario-programacao.test.cjs` adicionado ao workflow. **Smoke-test JS isolado passou**; GitHub Actions, publicação real e teste no celular ainda não confirmados.
- Não alterado o modal técnico, Listas, SQL, `main` ou versão X.0.3.30. Programação de equipe é previsão, **não** confirmação de presença ou execução.


## 10/11/2026 — Diário: consulta, modais e apontamento diário (laboratório)
- Diário reorganizado como página de consulta das programações; `+ Adicionar atividade` abre modal `#entry-dialog`, que herda a obra e a data do filtro.
- Motor separado `x/universo/diario/execucao-motor.js` e modal `#report-dialog` com execução do dia, conclusão opcional, não realização com justificativa obrigatória e histórico por programação/data.
- Motivos de impedimento: chuva, ausência de equipe, deslocamento, falta de material, ausência de liberação e outro. Apontamentos persistem somente no navegador, segregados da programação e sem banco real.
- Acrescentado teste `x/tests/diario-execucao.test.cjs` ao workflow; smoke-test JS isolado passou, **CI e validação no celular ainda não comprovados**. Modais de Listas, `main`, SQL e versão do app X.0.3.30 preservados.


## 10/11/2026 — Navegação de Obras, cadastro experimental de empreiteiros e PDF do Diário
- Entrada de Obras reestruturada como painel das próprias obras + links para **Empreiteiros**, **Diário de Obras** e **Relatórios de Visita**; a última é uma rota de preparação, sem cadastro.
- Motor independente de Empreiteiros/Equipes e tela mobile de CRUD fictício em `x/universo/empreiteiros/`, armazenamento local separado. Diário incorpora sugestões de prestadores e equipes locais após recarregar.
- Botão **Gerar PDF do dia** no Diário monta relatório de programação e apontamento por obra/data e aciona **impressão A4** com opção “Salvar como PDF” no navegador. Sem assinatura, fotos, arquivo gerado por backend, ou nuvem.
- `x/tests/obras-navegacao-pdf.test.cjs` adicionado ao workflow; smoke-test JS isolado de integridade das equipes e ligação dos módulos passou. **CI completo, impressão visual e ensaio no celular pendentes**. `main`, Listas, modal e banco preservados.


## 10/11/2026 — Refinamento visual e auditoria preventiva de Obras (sem mudança de versão)
- Criada camada compartilhada `x/universo/ui-refino.css` e aplicada a Obras, Diário, Empreiteiros e Visitas. Cores, superfícies, cartões, modais, tipografia e botões alinhados aos temas Claro/Escuro/TEREON do Guia Visual. Diário prioriza a Agenda do dia e recolhe o texto de ajuda.
- Cadastro local de Equipes bloqueia exclusão quando equipe é referenciada em programação local do Diário; dados JSON locais incompatíveis bloqueiam novas escritas até tratamento seguro, em vez de permitir sobrescrita silenciosa.
- Criado [relatório de auditoria preventiva](AUDITORIA-LAYOUT-OBRAS-2026-11-10.md) com riscos de isolamento entre contas, histórico de cancelamentos, snapshots, nomes de equipes, impressão, contraste e eventual CSS redundante. Teste estático `x/tests/obras-refino-visual.test.cjs` no workflow.
- JS isolado compilou e referências verificadas. **Não houve renderização visual de celular, confirmação de CI completo, deploy, teste PDF real ou homologação.** Listas, SQL, fichas, `main`, fluxos de cadastro de obras Supabase e versão X.0.3.30 preservados.


## 10/11/2026 — Cabeçalho unificado e funcionários por empreiteiro (laboratório)
- Quatro páginas de Obras passaram a usar componente global de cabeçalho, indicador de rede/perfil e caminho `Ferramentas › Obras › …`; removido **Universo** da trilha visual de Obras no `header.js`.
- Empreiteiros prioriza cadastro de **funcionários** (nome, função, vínculo a prestador), com situação `Ativo` / `Desligado`, mudanças datadas em `statusHistory` e formulário/modal de inclusão e edição. Cadastro e edição de empreiteiros também em modais.
- Equipes legadas são mantidas na chave local original e exibidas apenas para consulta, sem migração ou exclusão silenciosa; Diário ainda não atribui funcionários a equipes, portanto não afirmar integração operacional.
- Teste isolado do motor passou; novo `x/tests/empreiteiros-funcionarios.test.cjs` no workflow. **Sem teste visual/CI verde/deploy comprovado**. Listas `#addDialog`, Supabase, `main` e versão de referência X.0.3.30 não alterados.


### Ajuste complementar do cadastro (10/11)
O painel de Funcionários ganhou **filtro por empreiteiro**, e o modal de novo funcionário usa o empreiteiro filtrado como contexto inicial. Nenhuma associação a equipes, obra ou Diário ocorre automaticamente.


## 10/11/2026 — Superauditoria do TEREON X (documentação, sem alteração operacional)
- Criado relatório [SUPERAUDITORIA-TEREON-X-2026-11-10.md](SUPERAUDITORIA-TEREON-X-2026-11-10.md) com 20 achados priorizados, matriz de maturidade e roteiro de saneamento/release.
- **Constatado descompasso de teste:** cabeçalho exige `v=8`, Obras usa `v=9`; a suíte completa não pode ser declarada aprovada.
- Verificados 24 comandos configurados no workflow, 838 commits à frente da `main`, versão/cache ainda X.0.3.30 e ausência de pré-cache dos novos laboratórios.
- Conferidos por leitura de metadata Supabase os estados RLS das nove tabelas públicas `x_*` (RLS ativo, `anon SELECT` negado); sem ensaios JWT A/B.
- Nenhuma mudança em código, schemas, usuários, dados, `main` ou release; investigação continua aberta para CI real, mobile, PDF e autorização.

## 10/11/2026 — Prioridade de campo e história narrativa (apenas documentação)
- Criado [Plano do teste restrito de 17/11](FOCO-TESTE-CAMPO-17-11-2026.md): prioridade **Listas, fichas/catálogo, especificação progressiva e compartilhamento**; programa de gestão de Obras separado como laboratório paralelo.
- Criado [Estado vigente](ESTADO-VIGENTE-10-11-2026.md), distinguindo **VIGENTE / LABORATÓRIO / FUTURO / HISTÓRICO**. Arquivos de 07–09/11 foram sinalizados com orientação de precedência, sem apagar sua história.
- Criado [Diário de Desenvolvimento Volume 03](HISTORIA-TEREON-X-VOLUME-03.md), com história humana do TEREON, episódios verificáveis, aprendizados e pautas editoriais para redes sociais. Volumes 01 e 02 preservados.
- Atualizados Mestre, Contratos, Índice, Retomada histórica, Guia Visual, Mapa, Modelo de negócio e Superauditoria para apontar a prioridade real. **Não houve mudança em código operacional, fichas, Supabase, `main` ou deploy.**


## 10/11/2026 — Auditoria direcionada do núcleo do teste de 17/11
- Corrigidos **somente testes**: `x/tests/cabecalho.test.cjs` com versão v9 específica de Obras; `x/tests/modulos.test.cjs` com amostra válida para teste de exportação após esvaziamento.
- Criado `x/tests/fluxo-campo-17-11.test.cjs`, adicionado ao workflow. **25 comandos configurados**, não há resultado de Actions completo confirmado.
- Execução isolada de motores comprovou criação/edição/etapas/compartilhamento, além de **falha de prontidão do catálogo** (Condutor não exige seção/tensão; Eletroduto/Curva não exigem diâmetro) e **lista removida remotamente ainda parecendo sincronizada no dispositivo B**.
- Criados [Auditoria de Listas](AUDITORIA-NUCLEO-LISTAS-17-11-2026.md) e [Matriz de fichas](MATRIZ-FICHAS-17-11-2026.md). Nenhuma ficha foi homologada por inferência, nenhum dado, interface, SQL, `main` ou deploy modificado.

## 10/11/2026 — Revisão iniciada de Condutores BT (documentação)
- Inventário inicial de características e relações técnicas para condutores isolados e cabos unipolares/multipolares registrado em [Retomada FT_COND-001](RETOMADA-FT-COND-001-2026-11-10.md).
- **Em aberto:** ficha única com condicionais versus fichas separadas. Nenhuma regra foi homologada, nenhuma célula técnica, código, SQL ou dado real alterado.

## 10/11/2026 — Decisão didática: ficha única e Escola inaugural (documental)
- Fundador aprovou **uma ficha única de Condutor elétrico** para isolado/unipolar/multipolar com condicionais, visando simplicidade e reutilização didática.
- Definiu Escola TEREON aberta desde o começo com curso inaugural **“Como usar o TEREON”**, gratuito e curto. Registrado plano [Escola Inaugural](ESCOLA-INAUGURAL-2026-11-10.md), **sem afirmar curso implementado**.
- Inspecionada FT_COND-001 atual no Drive (8 detalhes). Não foram alteradas células, normas, código de Listas ou publicação.

## 10/11/2026 — x.0.3.31, laboratório experimental FT_COND-001
- Importadas as linhas ativas de Condutores do Fichário do Drive no snapshot do app, sem alterar a planilha ou as outras cinco fichas; nome técnico neutro Condutor elétrico.
- Motor de fichas passou a agrupar opções pelo mesmo ID, interpretar `//` e `+`, excluir detalhes ou opções, checar incompatibilidades reversíveis e não exigir detalhes ocultos.
- App usa `optionsFor` e impede confirmar uma escolha contraditória com tags existentes; **DOM do modal aprovado preservado**.
- Versão x.0.3.31 e cache do SW atualizado; adicionado estresse de 648 combinações ao workflow de CI, sem prova de execução completa do GitHub Actions ou deploy no Cloudflare.
- Pendências técnicas e testes: [Auditoria](AUDITORIA-FT-COND-001-2026-11-10-LAB.md). Ficha permanece **Em revisão**, não homologada.

## 10/11/2026 — correção urgente do loop de atualização PWA
- Causa diagnosticada: `x/version.json` e `x/pwa.js` divergiam (`x.0.3.32` x `x.0.3.30`); verificação no `pageshow` chamava `location.reload()` repetidamente, dando efeito de tela inicial piscando e impedindo navegar para Listas.
- `x/pwa.js` alinhado com x.0.3.32 e protegido contra mais de uma recarga por versão na mesma sessão; `x/index.html` carrega `pwa.js?v=6` para escapar de cache obsoleto.
- Teste de `x/tests/status.test.cjs` passou a comparar com `version.json` em vez de exigir versão antiga fixa e verifica proteção de reload.
- Arquivos alterados apenas em `desenvolvimento`. Publicação no Cloudflare e confirmação em aparelho físico **ainda pendentes**; nenhuma alteração de lista ou dados do usuário.
