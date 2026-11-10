# TEREON X — Contratos vigentes e rastreabilidade

> **PRECEDÊNCIA ATUAL — 10/11/2026:** o contrato prioritário do teste em 17/11 é **Listas + Fichas/Catálogo + Especificação + Compartilhamento**. Os contratos de gestão registram regras de laboratório e visão futura, não uma entrega de gestão completa para essa data. [Estado vigente](ESTADO-VIGENTE-10-11-2026.md) · [Foco 17/11](FOCO-TESTE-CAMPO-17-11-2026.md).

**Consolidação documental: 09/11/2026 | Referência funcional X.0.3.29 | Branch `desenvolvimento`**

> **Escopo:** referência normativa para mudanças futuras; não é declaração de homologação. Este documento consolida decisões previamente registradas, sem criar uma funcionalidade, preço ou regra técnica nova. Quando houver conflito com capítulos históricos, prevalece a decisão mais recente **expressamente aprovada**, documentada aqui, até revisão do fundador.

## 1. Estados de evidência
- **DECIDIDO:** princípio aprovado; não implica código nem teste.
- **IMPLEMENTADO:** código/schema existe; não significa que funciona em dispositivo real.
- **TESTADO AUTOMATICAMENTE:** registrar commit, comando, execução e resultado observado; configuração do workflow não equivale a execução.
- **TESTADO EM DISPOSITIVO:** registrar URL, versão, dispositivo, conta de ensaio, fluxo e resultado.
- **HOMOLOGADO:** aceite expresso do fundador para escopo descrito.
- **PROPOSTA / PENDENTE:** nenhuma implementação inferida ou anúncio como pronta.

## 2. Contratos obrigatórios atuais

| ID | Dono | Regra vigente | Evidência atual | Próxima prova necessária |
| --- | --- | --- | --- | --- |
| CT-01 | Governança | Alterar só `desenvolvimento`; `main` requer regressão e autorização expressa | Decidido/documentado | Conferir SHA, workflow e Preview de cada entrega |
| CT-02 | Navegação e UX | Listas na Home; detalhe de lista em modal; `#addDialog` X.0.3.4 preservado, incluindo fluxo `openAdd()` e `pickFirstMissing()` | Fixture e revisão estática; aceite visual parcial de Minhas listas X.0.3.29 | Fluxo integral em navegador real, teclado, três temas e edição |
| CT-03 | Catálogo | Ficha governa detalhes, condições, obrigatoriedade, nome, versão e status; nenhuma ficha vira homologada pela exibição | Snapshot de seis fichas em revisão; fonte Drive | Conferência ficha a ficha, IDs, condições e processo explícito de publicação |
| CT-04 | Especificação | Texto interpretado gera **sugestões**; cada atributo precisa de confirmação humana; entradas ambíguas preservam alternativas | Decidido, testes parciais | Casos reais de busca, tags, remoção e retomada da primeira obrigatória |
| CT-05 | Listas | Único dono de itens, etapas, quantidades, criação/edição/duplicação/exclusão; interfaces chamam serviço, não escrevem no armazenamento | `servico.js` / `store.js` em uso | CRUD real em conta e visitante com persistência/reabertura |
| CT-06 | Armazenamento | Visitante usa `tereon-x-lab-v1`; autenticado usa cache segregado por conta e `x_cloud_lists`, versão e conflitos; sem migração silenciosa | Implementado/documentado | Dois dispositivos, duas contas, offline, conflito e exclusão descartável |
| CT-07 | Compartilhar | Texto/PDF/e-mail e cópia entre usuários não alteram lista original nem criam Solicitação; canal e perfil devem ser distinguidos | Implementado parcialmente; contrato-alvo de formatos diverge do resultado atual | Validar conteúdo de PDF/e-mail/WhatsApp e teste A→B, revogação |
| CT-08 | Solicitações | Aprovação, compra, recebimento, parciais e histórico terão motor próprio; estados de negócio **não** pertencem a Listas | Decidido conceitualmente; não implementado | Definir papéis, transições e snapshots antes do código |
| CT-09 | Identidade/Acessos | Uma conta pessoal, múltiplos espaços/obras autorizados; acesso por obra e RLS; colaboração não revela dados de outra conta | Parte de identidade e RLS implementada | Testes cruzados reais A/B/C e revogação |
| CT-10 | Universo | Organiza obras e contexto; não modifica materiais de Listas nem confunde execução com compra; Diário agrega eventos por obra/data preservando autoria | Laboratório Obras parcial; demais motores conceituais | Recorte de MVP e provas de uso separadas |
| CT-11 | Aparência | Temas Claro/Escuro/TEREON são apenas apresentação; preferência local; ON/OFF indica **rede**, nunca nuvem | Aceite visual parcial X.0.3.29 | Validar modais/contraste no celular e persistência sem efeito em dados |
| CT-12 | Publicação e regressão | Passagem à `main` só após testes automáticos efetivamente confirmados, fluxo real e aceite explícito; funcionalidade aprovada não pode desaparecer | Regra decidida; testes configurados | Evidência do CI da revisão vigente e roteiro manual assinado |

## 3. Contratos de interface e dados — recorte atual
- **Catálogo → Modal técnico:** os detalhes vêm do modelo da ficha; o modal apresenta sugestões e tags, e só encaminha atributos confirmados.
- **Modal → Listas:** lançamento contém `catalogId`, `values`, `name`, `qty`, `unit`, `stage` e status de revisão pertinente. A UI não publica ficha nem executa gravação diretamente.
- **Listas → Compartilhar:** usar snapshot de leitura (`exportList`); não ler dados privados diretamente nem modificar origem.
- **Listas → Nuvem:** versão de registro e conflitos; não apagar cache ou pendências apenas por `navigator.onLine` ou pelo botão Conferir nuvem.
- **Listas → Universo/Solicitações:** vínculos e processos formais ainda não homologados; IDs locais não autorizam vínculos remotos; a Solicitação futura deve congelar snapshot e histórico próprios.
- **Selecionar listas:** seleção múltipla atual é apenas interface; compartilhar seleção só funciona com **uma** lista. Aprovação, exclusão e envio em lote não implementados.

## 4. Contradições documentais resolvidas pela precedência
1. Instruções antigas que mandam abrir `txCatalogDialog` são históricas: o **fluxo principal vigente** usa `#addDialog` com `openAdd()`. O seletor antigo pode existir para laboratório, não substitui modal homologado.
2. Chamadas históricas a Listas dentro do Canivete não redefinem a Home vigente: **Listas é a função principal**; Canivete é conjunto futuro de ferramentas técnicas.
3. Registros antigos de Universo como conceito inteiramente não implementado referem-se ao passado: **Obras tem laboratório parcial**, mas Solicitações, Diário e execução não estão completos.
4. A direção ampla do Universo inclui Diário/Visitas/Aplicação; o **primeiro recorte conceitual documentado** privilegia `pedi → autorizei → chegou`, sem consumo detalhado. A ordem posterior continua decisão de produto em aberto.
5. Estados Local/Sincronizada/Falha/Conflito são de persistência; Pendente/Aprovada/Em compras/Comprado/Recebido são de fluxo futuro. Nunca combiná-los num `status` genérico de Lista.

## 5. Rastreabilidade de mudanças
Para cada alteração registrar:
1. **Decisão:** qual problema, quem aprovou e o que não deve mudar.
2. **Contrato:** IDs CT afetados e entradas/saídas dos módulos.
3. **Implementação:** branch, caminhos, commit, migração reversível se houver.
4. **Teste automático:** comando, link de execução, SHA e conclusão observada.
5. **Teste funcional:** URL real de Preview, dispositivo, cenário e resultado.
6. **Aceite:** comportamento aprovado e data; se faltar, estado é PENDENTE.

**Bloqueio de progresso:** falha P0 (perda de dados, isolamento de contas, especificação técnica incorreta ou regressão do modal) impede promover para `main` e suspende funcionalidades dependentes; não exige parar a elaboração independente de documentação.

## 6. Próxima sequência de validação
1. Confirmar qual commit/Preview corresponde à X.0.3.29 e o resultado do GitHub Actions; ausência de status é **inconclusiva**.
2. Executar roteiro de `TESTES-REGRESSAO.md` em **listas descartáveis**, preservando dados reais.
3. Conferir seis fichas em revisão com fonte `Fichario.xlsm`, sem converter hipóteses em regras.
4. Testar campo com eletricista/encarregado e registrar tarefas concluídas sem ajuda e obstáculos.
5. Somente então decidir o próximo recorte de Solicitações/Universo.

**Referências:** `RETOMADA-2026-11-09.md`, `REVISAO-GERAL-CONTRATOS-2026-11-09.md`, `MESTRE-TEREON-X.md`, `MAPA-MODULOS.md`, `TESTES-REGRESSAO.md`, `../ARQUITETURA-MODULAR.md`.


## Adendo CT-05 / CT-06 / CT-10 — 10/11/2026
- **CT-05 Listas:** etapas da lista são sugestões de agrupamento derivadas de lançamentos, limpas após alterações que deixam a etapa vazia. A limpeza não é uma migração automática de todas as listas antigas e não toca Obras.
- **CT-06 Persistência:** no contexto autenticado, novas listas e mudanças passam pelo validador do adaptador remoto **antes** da gravação no cache; no visitante, limites específicos do laboratório remoto não são aplicados. Registros legados sem alteração permanecem legíveis. A homologação depende de CI e navegador.
- **CT-10 Obras:** etapas do escopo são entidades independentes, persistentes e associadas à obra, podendo existir sem materiais. Etapas de Listas vinculadas geram sugestões que precisam de associação/criação explícita. **Contrato proposto, motor ainda não implementado**. [Desenho das etapas](CONTRATO-ETAPAS-LISTAS-OBRAS-2026-11-10.md).
- **Navegação:** nome **Obras** proposto para substituir “Universo” na interface, sem alterar caminhos técnicos nesta etapa.


## Adendo de 10/11 — limites reais e hierarquia de etapas
**CT-05/CT-10:** a limpeza implementada em X.0.3.30 é só de rótulos temporários de etapa **da Lista**. Etapas **cadastradas no escopo da Obra**, inclusive etapa-mãe, têm identidade própria, `parent_id` e sobrevivem a mudanças das Listas. É permitido associar materiais diretamente a uma etapa-mãe (sem inventar subetapa). Promover QD1 observado em Lista a subetapa de Quadros exige aceite explícito e permissão, não correlação textual automática. **Motor de escopo hierárquico ainda não implementado.** Ver [hierarquia](ESCOPO-HIERARQUICO-OBRAS-2026-11-10.md).
**CT-06:** plano Supabase **Free** confirmado, 500 MB de banco incluídos e 50.000 MAU de franquia, sem limite fixo de número de listas. O limite de 300 materiais por lista é uma restrição do laboratório, não do plano nem uma regra de cobrança. Ver [capacidade](CAPACIDADE-ARMAZENAMENTO-2026-11-10.md).


## Adendo CT-10 — estrutura vigente de Obras (10/11/2026)
A estrutura de dados correta é **Obra → Escopo → Etapa → Subetapa**; subníveis são opcionais. Escopo é entidade de primeira classe, não sinônimo de etapa. Uma revisão elétrica pode conter Quadros → QD1/QD2 e Iluminação salas de aula → Sala 01/Sala 02; SPDA pode ser apenas escopo; Entrada de energia pode conter etapas Abrigo/Escavação. Todas as entidades **cadastradas** persistem mesmo sem materiais. Somente rótulos temporários derivados de lançamentos na Lista somem ao ficar sem materiais. O novo `x/universo/obras/escopo-motor.js` é independente e isolado; **integração com banco/Lista/UX ainda pendente**. O desenho de dois níveis dos capítulos anteriores é histórico e não deve orientar implementação nova.


## Proposta de novos contratos — pessoas, equipe e alocação (10/11/2026)
**Ainda PROPOSTA:** motor de Cadastro Profissional é dono de pessoas (inclusive sem conta), prestadores, equipes e composição temporal; motor de Alocações registra referências entre equipes/pessoas e obras/nós do escopo com períodos e autoria; motor de Acessos concede permissões digitais separadas, verificadas no banco. Não gravar funcionários dentro da entidade Escopo, nem inferir que alocação autoriza ver ou editar dados. Escopo permanece `Obra → Escopo → Etapa → Subetapa`. Ver [contrato de desenho](PESSOAS-EQUIPES-ALOCACOES-2026-11-10.md). Não considerar funcionalidade implementada ou homologada.


## CT-10 / Novo contrato de Diário programado — 10/11
A **experiência do Diário de Obras** é a porta para programar a equipe: `Obra → Escopo (período)` ou `Obra → Escopo → Etapa/Subetapa (um dia)`. O calendário apresenta programação **prevista**, sem declarar presença, execução, aplicação de materiais ou acesso digital. O Diário verdadeiro consolida execuções independentes por **obra/data**, mantendo múltiplos registros por pessoa/dia com autoria. Programação é motor próprio; Cadastro e Acessos são separados. Implementado somente laboratório local de simulação, sem Supabase, UI principal ou vínculo com Obras reais. [Contrato do Diário](DIARIO-PROGRAMACAO-EQUIPES-2026-11-10.md). **Contrato de um dia em etapa está sob teste de campo, não deve ser extrapolado para duração de atividade de execução.**


## Diário — programação, execução do dia e conclusão (10/11)
**Contrato vigente da experiência em laboratório:** consulta das programações na tela principal; inclusão por modal independente `#entry-dialog`; confirmação diária por `#report-dialog`. A programação é previsão; um apontamento por `programId + date` é estado observado, com histórico de revisões, sem alterar fonte original; “executada” não significa “concluída”. Não realização exige justificativa; conclusão só é admitida após declaração de execução. Anotação diária não concede acesso ou aprovação técnica, nem altera outras datas. Motor de execução `x/universo/diario/execucao-motor.js` permanece sem dependência de Lists/Obras/Supabase e é simulação, não funcionalidade homologada.


## Contrato adicional — Painel Obras, Empreiteiros, Diário e PDF (10/11/2026)
**Navegação X proposta e implementada em laboratório:** a entrada **Obras** concentra o painel das obras próprias e os módulos **Empreiteiros**, **Diário de Obras** e **Relatórios de Visita**. O cadastro de Obras existente continua usando o banco e os controles próprios; os outros dois módulos recém-acrescentados são laboratórios e Visitas tem apenas rota de preparação.
**Cadastro Profissional em laboratório:** motor independente `x/universo/empreiteiros/motor.js` gerencia prestadores e equipes sem conta TEREON obrigatória; a UI local em `x/universo/empreiteiros/lab.html` usa chave própria. O Diário pode consultar esses cadastros locais como sugestões de equipe, mantendo programação/apontamentos independentes. Sem RLS, sincronização, perfil ou permissões reais; não apresentar como cadastro corporativo homologado.
**Diário para PDF:** ação `Gerar PDF do dia` compõe **somente a obra e data selecionadas**, programação e apontamento mais recente de cada equipe, motivo/observação; usa impressão A4 do navegador e a opção externa **Salvar como PDF**, sem criar ou enviar PDF automaticamente, e sem assinatura digital, fotos ou validação do responsável. Nunca retratar programação como execução confirmada.
**Regra de tempo em teste:** subetapa como tarefa pontual de um dia, conforme aprovação conceitual recente; o laboratório também restringe etapas a um dia por lançamento, passível de revisão posterior sem confundir duração de atividade real.


## Preservação visual e governança de Obras — refinamento de 10/11
As páginas de laboratório de Obras, Empreiteiros, Diário e Visitas compartilham camada de apresentação `x/universo/ui-refino.css`, alinhada ao Guia Visual e preferência local `tereon-x-appearance-v1`, sem mudar estrutura de dados. **Contrato:** o tema não muda regras, permissões ou registros. O modal técnico de Listas `#addDialog` permanece protegido.
**Guarda temporária de histórico em laboratório:** não excluir equipe usada por programação local, nem sobrescrever JSON prévio quando falha a leitura. Essas proteções **não** substituem integridade de vínculos versionados, snapshots e RLS na integração profissional. Conclusões e riscos em [Auditoria preventiva de Obras](AUDITORIA-LAYOUT-OBRAS-2026-11-10.md).


## Atualização de prioridade — Empreiteiros e Funcionários (10/11/2026)
**VIGENTE PARA NOVO DESENVOLVIMENTO:** Cadastro Profissional inicia por `Empreiteiro → Funcionários`, cada profissional com identidade própria, função opcional, status **Ativo/Desligado** e histórico temporal; desligamento nunca equivale a apagar histórico. Equipes, sua composição e alocações serão relações futuras, explícitas. **Não converter** equipes antigas de laboratório em pessoas automaticamente. O Diário atual continua referenciando equipes demonstrativas, não funcionários; não ligar por nome.
**UX:** todas as páginas Obras usam cabeçalho compartilhado, nome/estado da conta/rede e caminho `Ferramentas › Obras › …` sob a linha divisória. Inclusão/edição deve ocorrer em modais para não substituir a consulta, compatível com o padrão da tela de Listas, sem tocar seu modal técnico.
**STATUS:** motor de funcionários e modais implementados apenas em ensaio local; contas e permissões corporativas reais ainda não disponíveis. [Auditoria de layout](AUDITORIA-LAYOUT-OBRAS-2026-11-10.md).
