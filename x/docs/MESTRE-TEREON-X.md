# TEREON X — Documento Mestre vivo
**Base 07/11/2026 · Atualização de situação em 09/11/2026 · Fonte canônica do laboratório X**

## Situação vigente — 09/11/2026
A versão de referência na branch `desenvolvimento` é **X.0.3.29**. O fundador considerou **bom o layout atual de Minhas listas**: seleção discreta alinhada ao título no canto direito; Editar, Duplicar, Compartilhar e Excluir em linha inferior; cartão translúcido com status técnico individual. Isso é **aceite visual parcial**, não homologação integral. A navegação atual parte de `/x/`; marca e breadcrumb retornam às Ferramentas. Aparência Claro/Escuro/TEREON se escolhe em Minha conta e se aplica também aos modais. O HTML do modal técnico aprovado X.0.3.4 continua preservado.
**Norma de contratos atuais:** [CONTRATOS-VIGENTES.md](CONTRATOS-VIGENTES.md). **Ponto de retomada:** [RETOMADA-2026-11-09.md](RETOMADA-2026-11-09.md). **Revisão de contratos e riscos:** [REVISAO-GERAL-CONTRATOS-2026-11-09.md](REVISAO-GERAL-CONTRATOS-2026-11-09.md). Seções abaixo escritas em 07–08/11 são **históricas** e podem descrever versões anteriores como se fossem atuais.

## 0. Como ler
- **DECIDIDO**: princípio ou separação aprovada pelo fundador.
- **IMPLEMENTADO**: existe código e/ou banco, mas pode carecer de teste real.
- **TESTADO**: teste observado e descrito.
- **PROPOSTA**: hipótese para debate; não executar como requisito irrevogável.
- **PENDENTE**: necessidade conhecida ainda não concluída.
Os Documentos Mestres antigos, Diário Volume 01 e Plano de Negócios v0.0 **continuam arquivos históricos**, sem reescrever retrospectivamente decisões ou misturar código legado com X.

## 1. Identidade e propósito
**TEREON X — Tecnologia que faz a engenharia fluir.**
O problema fundador são levantamentos elétricos com informações incompletas, perda de contexto entre campo, engenharia, compra e recebimento; catálogo técnico e especificação confiável são fundamento. Público: eletricistas, encarregados, engenheiros, estudantes, prestadores autônomos e equipes. O produto é mobile-first, funcional com poucos passos; o usuário não precisa organizar tudo previamente.
Princípios DECIDIDOS: o grátis deve ser útil de verdade e nunca tecnicamente incorreto; atributos técnicos interpretados pelo texto são **sugestões**, só confirmadas mediante clique; nenhuma ficha hipotética se transforma em homologada por estar visível no catálogo. A governança de fichas reside nas planilhas do Drive, com publicação e aprovação exclusiva do fundador por enquanto; Juliano pode propor alterações.

## 2. Mapa do produto
- **Canivete** — ponto de entrada da especificação e das listas de materiais; captura rápida, tags técnicas progressivas, unidades/etapas, edição, busca, exportação.
- **Biblioteca** — consulta às fichas e fontes, somente leitura; regras e normas mantidas no Catálogo.
- **Universo** — **módulo de gestão de obras e espaços de trabalho**, da obra pessoal ao portfólio empresarial. Detalhado em [PRODUTO-UNIVERSO.md](PRODUTO-UNIVERSO.md).
- **Escola** — conteúdo e aprendizagem contextual, visão futura; não confundir com validação normativa.
- **Conta e Acessos** — identidade individual, associação a diversos espaços/obras e permissões granulares.
- **Compartilhar** — saídas texto/WhatsApp/PDF/e-mail (comunicação), e envio de **cópia de lista para outro usuário TEREON** (colaboração), sem iniciar compra.
- **Solicitações** — motor futuro e distinto: lista gera solicitação com identificador e fotografia do momento; aprovação, aquisição, envio, recebimento, pendências, histórico e parciais por item.

## 3. Limites entre motores — DECIDIDOS
| Responsável | Faz | Não faz |
|---|---|---|
| Catálogo | fonte técnica, fichas, opções, obrigatoriedades, condições e nomes | guarda lista ou regras de interface |
| Especificação | guia escolhas e confirma tags, estado temporário | inventa regra técnica ou grava permanentemente |
| Listas | CRUD, etapas, quantidades, persistência via repositório | aprova/compra/recebe |
| Compartilhar documento | transforma snapshot em formatos | altera dados da lista |
| Compartilhar entre contas | transmite snapshot a usuário autorizado | inicia solicitação/edita original |
| Solicitações | fluxo e histórico de materiais solicitados | muda silenciosamente lista-base |
| Identidade | autenticação e sessão | organiza materiais |
| Acessos/Espaços | participantes e permissões por obra | regras técnicas |
| Obras / Universo | organiza obras, contexto, status, vínculos e visão gerencial | reescreve regras de listas ou solicitações |
| Armazenamento | grava e recupera dados sob contratos | decide regras de negócio |
**Separar CSS/HTML de serviços/contratos:** qualquer futura renovação visual não deve reimplementar nem quebrar funcionalidades já aprovadas; testes de regressão são porta obrigatória.

## 4. Estado técnico confirmado nesta consolidação
Repositório `TEREON-eng/desenvolvimento`. Trabalhar somente em `desenvolvimento`; `main` depende de aprovação explícita. Cloudflare Worker de nome `desenvolvimento` aponta para produção/main; Preview tem URL distinta. **Registro histórico de 07/11:** X era versão **x.0.3.7**. Situação vigente em 09/11 é **x.0.3.29**, descrita na abertura e no fechamento desta página.
- **IMPLEMENTADO:** `x/listas/store.js` chave `tereon-x-lab-v1`, `servico.js`, `app.js`; Catálogo e seletor; Biblioteca; motor de exportação; PWA; CI; 24 fichas de demonstração (2 reais em revisão, 22 hipóteses; nenhuma homologada).
- **IMPLEMENTADO e TESTADO pelo usuário:** laboratório de identidade `x/identidade/`: cadastro, confirmação, login, persistência, logout/reentrada, troca de senha autenticada e edição de perfil. Recuperação via link de e-mail **não homologada** (retorno inicialmente ao localhost/limites SMTP); layout exibido pelo usuário; tremulação inicial corrigida.
- **IMPLEMENTADO em banco:** Supabase organização `TEREON-app`, projeto `TEREON X` (`kjikzdpqejhsgutakigw`, us-east-1), tabelas `x_profiles`, `x_workspaces`, `x_workspace_members`, `x_works`, `x_work_access`, `x_list_shares`; RLS. Quase todas vazias; uma conta criada/confirmada e um perfil no último diagnóstico; ausência de testes de políticas com duas contas.
- **IMPLEMENTADO, ainda sem aceite de ponta a ponta:** `x/compartilhar-usuarios/` com cópia de lista, inbox/outbox, aceitar/recusar/revogar. Falta testar com duas contas reais; em 07/11 cadastro de segunda conta bloqueado por limite SMTP. Tratamento de ausência de sessão corrigido; preview ainda requer verificação do usuário.
- **PENDENTE:** módulo Universo funcional, vínculos reais multiempresa, convites, autenticação definitiva no aplicativo principal, sincronização offline, Solicitações, planos comerciais e cobrança, SMTP próprio, permissão de senha vazada no Supabase. Não afirmar que fluxo completo existe.

## 5. Dados e colaboração — DECIDIDOS
Uma conta TEREON por pessoa; pode manter obras particulares e simultaneamente participar de uma obra específica de outra empresa. Obra pertence a um **espaço de trabalho** pessoal ou empresarial; acesso à obra não abre todas as obras da empresa. Listas são privadas por padrão. Uma lista compartilhada por cópia não se transforma automaticamente em solicitação; lista original preservada; novos registros têm identidade/histórico próprios. Para uso online futuro, cada motor mantém seu contrato e usa serviço de armazenamento; sincronização local/nuvem exige plano específico.

## 6. Produto, venda e evolução
Acesso gratuito **permanente** à utilidade essencial de Listas e especificação técnica responsável é diretriz; monetizar profundidade, gestão e colaboração, nunca correção técnica. **Proposta** de matriz e limites em [MODELO-GRATUITO-PAGO.md](MODELO-GRATUITO-PAGO.md). Não há preços, pacotes ou limites aprovados. Horizonte estratégico anterior: testes de campo em novembro/2026, operação a partir de 01/01/2027 como objetivo (não compromisso comprovado), revisão abril/2027, alvo de 30 assinantes como meta, não resultado.

## 7. Documentação e evidência
- [Arquitetura e contratos](../ARQUITETURA-MODULAR.md)
- [Mapa de módulos](MAPA-MODULOS.md)
- [Plano de regressão](TESTES-REGRESSAO.md)
- [Changelog técnico](CHANGELOG.md)
- [Universo — desenho](PRODUTO-UNIVERSO.md)
- [Gratuito e pago — proposta](MODELO-GRATUITO-PAGO.md)
- [Histórico narrativo](HISTORIA-TEREON-X.md)
- [Índice e pendências](INDICE-DOCUMENTACAO.md)
- Fichário governado no Drive; não substituir a planilha por hipótese inserida em documentação.

## 8. Retomada da concepção original de Universo — 07/11/2026 (decisão contextual)
O fundador esclareceu que sua visão anterior do Universo inclui **cadastro de obras, vínculo de listas, acompanhamento da aplicação de materiais, Diário de Obras, Relatórios de Visitas e Alertas**; havia congelado esse ambiente para dedicar-se a Especificação/Listas e preparar o teste de 17/11. O Canivete é a semente funcional; o Universo deverá ser o **produto de acompanhamento da execução** da obra, inclusive para eletricista autônomo.
Foram recuperadas definições anteriores de Resumo da Obra, Atividades com duração de vários dias, Diário por data com registros/fotos, Visitas com providências/fotos e Alertas internos por pendências. O produto deverá distinguir o avanço físico de materiais **aplicados** dos registros de solicitação, compra e recebimento (modelo detalhado ainda a desenhar).
O apoio de Juliano para **abastecimento/proposição de fichas** não transfere a ele aprovação/publicação; só o fundador homologa por enquanto.
**Prioridades separadas:** estabilização de listas/catálogo para teste de campo em 17/11 e, paralelamente, desenho dos motores independentes do Universo como próximo passo rumo a lançamento comercial real. Não vender ou marcar como concluído o Universo por existir tabela `x_works`.
Consultar `PRODUTO-UNIVERSO.md` seção 9 e `MODELO-GRATUITO-PAGO.md` para consequências comerciais.

## 9. Gestão multinível e Diário pela ponta — 07/11/2026
O fundador reafirmou que o **Universo deve servir simultaneamente à construtora, ao empreiteiro com equipes e ao eletricista executor**. O registro de serviços e fotos pelo profissional individual deve alimentar o Diário da obra e, por agregação, o acompanhamento de prestadores/equipes e o Centro de Controle. Cadastro de prestador, gestão de equipes, alocação em obras, Registros de Execução, Diário e Indicadores são responsabilidades diferentes; a interface do Universo as reúne sem reescrever seus motores. Estar alocado não garante acesso digital à obra, e o registro de serviço não é automaticamente aceitação/verificação.
**Implementação:** visão aprovada conceitualmente, ainda não desenvolvida. [Universo](PRODUTO-UNIVERSO.md) seção 11.

## 10. Diário com registros múltiplos (confirmado em 07/11/2026)
Cada profissional pode criar vários registros no mesmo dia e obra, incluindo serviço, ocorrência e fotografias. Cada evento mantém identidade, autoria e horário. O Diário é uma visão consolidada, não um formulário único por executor/dia. Registros não significam aprovação, conclusão nem consumo automático de materiais. Motor de Execução e motor/visão de Diário permanecem independentes. Ainda não implementado.

## 11. Escopo correto do Diário: obra, não equipe (decisão confirmada)
O Diário de Obras é uma consolidação **por obra e data**, contendo múltiplos registros de diferentes trabalhadores, equipes e até vários empreiteiros simultâneos. Cada registro mantém identidade, autor, horário e vínculo à equipe/prestador quando aplicável. O conjunto que cada pessoa vê depende de autorização por obra e escopo de acesso: a construtora pode ter visão de obra, o empreiteiro visão de suas equipes e o executor de seus registros. A apresentação consolidada não altera registros, não elimina autoria nem concede automaticamente acesso entre prestadores. **Não implementado; decisão conceitual registrada.**

## 12. Implementação inicial do Motor de Obras — 07/11/2026
**IMPLEMENTADO em `desenvolvimento`, ainda não homologado em navegador:** `x/universo/obras/motor.js` e laboratório `lab.html/lab.js/lab.css`. Reusa `x_workspaces` e `x_works` com RLS, registra cinco situações de obra (planejamento, em andamento, pausada, concluída, arquivada), cria e edita obras vinculadas a espaço próprio. Arquivar não exclui. Primeiro painel apresenta total e obras em andamento, calculados da lista autorizada.
**PENDENTE:** teste de uso no Preview, CI confirmado, múltiplas contas, espaços compartilhados, lista vinculada, equipes, Solicitações, Diário, alertas e indicadores. O Centro de Controle real ainda está em construção; essa tela é laboratório, não o módulo completo. Não houve alteração no Canivete nem na main.

## 13. Terminologia e padrão visual do Universo (decisão 07/11/2026)
- **Espaço de Trabalho**: agrupamento de obras controlado por uma conta; modalidade Pessoal (trabalho do próprio profissional) ou Organização (empresa/negócio gerenciado). Não corresponde à profissão, e "empreiteiro" não é um tipo obrigatório de espaço.
- **Obra**: registro vinculado a um espaço; pode ser editada e excluída com recuperação, mantendo dados relacionais.
- **Exclusão recuperável**: `deleted_at` e Lixeira, sem apagar definitivamente; arquivamento continua status independente.
- **Padrão de interface**: tema claro da linha TEREON X, formulários de cadastro/edição em modais, não voltar à aparência do TEREON legado. Alterações visuais não alteram o motor. Trabalho aplicado apenas no laboratório `x/universo/obras/`, aguardando teste do fundador.

## 14. Datas, filtro global e Central de Laboratórios — 08/11/2026
**Implementado em desenvolvimento, aguardando homologação visual:** cadastro de obra agora permite **data prevista de início e término** (ambas opcionais e validadas; término não antecede início). Visão `Todos os espaços` mostra obras de todos os espaços próprios da conta, respeitando RLS; quando uma obra é criada nessa visão, o usuário escolhe seu espaço no modal. Para editar/excluir um espaço deve selecionar aquele espaço especificamente. A `Central de Laboratórios` em `x/laboratorios/index.html` une os caminhos de testes para Canivete X, Obras, Identidade e Compartilhamento em uma página mobile-first; ela é **navegação**, não um motor novo que copie ou unifique dados dos módulos. Separação dos motores e tema claro preservados. Não alterar o shell principal nem a main.

## 15. Padrão de navegação de laboratório — 08/11/2026
Diretriz do fundador: usar uma interface leve que sirva de referência ao futuro produto. Central mobile exibe **Canivete, Universo, Compartilhar**; **Conta** fica como ícone no cabeçalho, não como card principal. Todos os laboratórios precisam do retorno visível à Central. Adotar o tema claro já presente no Canivete X e as mesmas proporções/linguagem de formulários. Conservar lógica e armazenamento específicos de cada motor; refinamentos visuais não justificam reimplementação. Essa revisão foi aplicada apenas à apresentação dos laboratórios, pendente teste em dispositivo.

## 16. Reposicionamento de Listas e próximo motor (08/11/2026)
**DECIDIDO pelo fundador:** Listas é a função principal do TEREON X e transcende o Canivete. Entrada do app mostra **Minhas listas** e **Criar lista** de imediato. **Canivete** passa a ser um card de calculadoras/ferramentas técnicas, inicialmente em preparação. **Universo** gerencia obras e informações; **Escola** é módulo externo ao Canivete com a **Biblioteca** dentro. Perfil continua no ícone do canto.
**IMPLEMENTADO em desenvolvimento (UI):** Central de Laboratórios reestruturada para esse mapa, acessos diretos `/x/?view=lists` e `/x/?view=create` sem mexer em serviço/armazenamento das listas. A PWA usa `/x/laboratorios/` como `start_url`; em instalações existentes a atualização depende do navegador. Biblioteca continua tecnicamente em `/x/biblioteca/`, agora posicionada no bloco Escola. Canivete não recebeu calculadoras fictícias.
**PRÓXIMO MOTOR — Vínculos de Listas com Obras:** deve associar lista avulsa a obra escolhida mediante confirmação, preservando IDs, itens e autoria da lista. Associação não é solicitação de compra, não comprova aplicação e não concede acesso à obra por si só. Hoje listas são locais e obras ficam no Supabase: vínculo definitivo entre dispositivos exige estratégia explícita de identidade/sincronização e RLS; não criar relação remota apontando para lista exclusivamente local como se existisse na nuvem. Ainda não implementado.

## 17. Motor de Identidade e Relações — fundação (08/11/2026)
**DECIDIDO:** mecanismo transversal atribui identidade estável, mantém relações e permite transporte de referências/contexto entre motores, preservando fontes e histórico. Tudo pode começar avulso, sem obra/espaço previamente cadastrado. A organização deve surgir progressivamente conforme o trabalho.
**IMPLEMENTADO em `desenvolvimento`:** `x/relacoes/motor.js`, `x_record_identities` e `x_record_relations` no Supabase, RLS, migrações, encerramento de relações com histórico protegido e testes simulados no CI. Só é possível registrar identidade `work` do dono neste primeiro recorte; nenhum vínculo entre Listas e Obras está operacional. IDs de listas permanecem locais e sincronização remota não foi implementada. Relações entre empreiteiros exigem desenho explícito de permissões, sem inventar acesso por tabela genérica. Ver `x/relacoes/README.md`.

## 18. Listas com identidade técnica persistente — 08/11/2026
Motor de Listas v2: registros novos recebem `recordUid` UUID seguro, distinto do ID interno já utilizado. Listas antigas continuam intactas até a chamada explícita `ensureRecordUid`; esta preserva ID, itens e etapas, sem alteração silenciosa ao abrir. `x/relacoes/origem-listas.js` produz referências locais marcadas `synchronized:false` e `remoteLinkAllowed:false`. Isso **não é sincronização nem vínculo obra–lista**, apenas preparação da identidade e contrato transversal. O armazenamento continua no dispositivo, chave `tereon-x-lab-v1`. Testes simulados de persistência, idempotência e falha de escrita aprovados; falta homologação no celular.

## 19. Laboratório separado de Listas na Nuvem — 08/11/2026
**IMPLEMENTADO na branch desenvolvimento:** motor `x/listas/nuvem/motor.js`, SQL `x/listas/sql/001_listas_nuvem_laboratorio.sql`, interface simples em `x/listas/nuvem/lab.html` e teste contratual. Supabase: tabela `x_cloud_lists` com dados de listas ligados ao proprietário autenticado, RLS, itens e etapas em JSON, contador de versão e proteção contra perda por sobrescrita em concorrência. Entrada de teste acessível por link discreto na Central. O Motor de Relações agora permite `list` **apenas para origem online que pertença à conta**, conforme migração `x/relacoes/sql/003_identidade_listas_nuvem.sql`. Ainda não há vínculo automático com obras.
**ESSENCIAL:** laboratório de listas online é **separado** das Listas locais de produção do laboratório Canivete; não há migração nem sincronização automática. Não afirmar que abrir Canivete num segundo aparelho já recupera listas. Validação real com dois aparelhos e duas contas pendente.

## 20. Uma única experiência de Listas — integração inicial (08/11/2026)
**DECIDIDO:** não há dois Motores de Listas para o usuário. A mesma tela **Minhas listas / Criar lista** usa o seletor técnico do Catálogo e um único serviço de Listas, recebendo repositório conforme contexto da conta. Armazenamento e privilégios não são o mesmo conceito: não foi instituída cobrança nem bloqueio comercial de funcionalidades nesta etapa.
**IMPLEMENTADO em `desenvolvimento` — x.0.3.8:** `x/listas/integracao.js` controla cópia local separada por ID de usuário e sincronização assíncrona com `x_cloud_lists`. `x/listas/auth.js` usa a sessão Supabase; sem conta o fluxo existente continua avulso no aparelho. Com conta autenticada, Listas consulta a nuvem, grava localmente e sincroniza usando ID UUID e versão para evitar sobrescrita silenciosa. A mesma tela e o mesmo modal técnico foram preservados. Status discreto indica local, sincronizando, salvo, pendente ou conflito. Há ação **explícita** para copiar listas avulsas do aparelho para a conta, sem apagar a origem e sem importar listas de outro usuário automaticamente. Dados de contas distintas usam chaves separadas.
O laboratório de nuvem continua disponível pelo caminho direto somente para diagnóstico, sem concorrência na Central. O vínculo Lista–Obra, permissões comerciais, fusão automática de conflitos, testes reais com dois celulares/contas e sincronização offline plena **continuam pendentes**.
**Verificação:** testes simulados de contratos e de regressão de Listas passaram; verificar execução do GitHub Actions e testar em browser antes de considerar homologado. `main` inalterada.

## 21. Preservação do modal técnico e remoção da navegação concorrente (08/11/2026)
**Correção:** o laboratório de Listas na Nuvem original tinha formulário básico de lançamento e estava acessível em URL própria, contrariando a decisão de uma experiência única. A URL padrão do laboratório agora redireciona para o Motor de Listas principal e seu `TereonXCatalogUI.open` (modal com catálogo, escolhas técnicas, formação de nome e obrigatórias). Diagnóstico continua disponível via `?diagnostico=1` sem exposição na Central. Teste estático de regressão adicionado. O laboratório de Compartilhar entre Usuários foi removido da navegação principal por ser atualmente mecanismo isolado de **enviar cópia/snapshot**, não colaboração integrada; código mantido. Nenhuma modificação na especificação técnica ou na `main`. Aceite em navegador pendente.

## 22. Lista aberta como modal — 08/11/2026, x.0.3.9
**DECIDIDO/IMPLEMENTADO em `desenvolvimento`:** a lista individual deixou de substituir a tela de **Minhas listas** e passou a abrir no modal `#listDialog`, com retorno claro **← Minhas listas** e fechamento `✕`. Abrir/fechar preserva a relação de listas de fundo. O modal do catálogo, aprovado para especificação técnica, abre acima dele e continua responsável por salvar lançamentos. Ajuste apenas de interface/navegação; não foi alterado o motor de Listas, catálogo, regras de fichas ou persistência. Testes estáticos passaram, experiência real no celular/desktop ainda aguarda aceite.

## 23. Regra de não regressão aplicada ao modal aprovado (08/11/2026)
O modal de **Adicionar item**, aprovado em TEREON X.0.3.4, é funcionalidade protegida. A integração posterior havia redirecionado o botão para `openCatalogAdd()`, violando a regra expressa de não perder decisões validadas. O código aprovado foi localizado em `jhcolba-del/tereon`, commit `9e762fa`, arquivo `x/index.html`, e o HTML do `addDialog` atual se mostrou idêntico. A versão x.0.3.10 restaura o acionamento `openAdd()` e adiciona fixture canônica `x/tests/fixtures/modal-adicionar-aprovado-x034.html` e contratos automatizados para impedir a substituição silenciosa.
**Critério de aceite:** não basta existir qualquer modal; a abertura, estrutura, fluxo, condições, nome técnico, tags e comportamento precisam corresponder ao aprovado. A restauração está validada em código, **não** homologada visualmente. Sem alteração da main.

## 24. Fichas reais no modal aprovado — 08/11/2026, x.0.3.11
**Fonte verificada:** arquivo `Fichario.xlsm` do Drive conectado (modificação em 08/11/2026 02:26:33 UTC), SHA-256 `a6c9cf1de9f06bbb07f575a7632f3ced8f85b0457eeca9af46983c45c4baa903`. A fonte contém seis abas de fichas efetivas e outras famílias somente indicadas no Índice; não inventar fichas para as entradas sem aba.
**Implementação:** JSON snapshot `x/fichario-x/fichas-drive-2026-11-08.json`, catálogo normalizado e escolha da ficha **dentro do mesmo modal `addDialog` aprovado em X.0.3.4**. Fluxo: buscar ficha → selecionar item → confirmar detalhes obrigatórios por tags → continuar opcionais → quantidade/unidade/etapa → adicionar, preservando `catalogId`, `values`, `name` e status de revisão. Regras condicionais, remoção das tags e seleção da próxima pendência continuam governadas pelo catálogo. A UI de Listas e seu repositório não mudaram.
**Qualidade de dados:** todas as seis fichas estão `Em revisão`; condições vazias, detalhes sem nome ou valores e classificações incompletas continuam pendências. A aba `FT_INFRA-004` tem nome B5 divergente, registrado sem alterar planilha. O aplicativo não é certificador de conformidade e não completa campos que o autor não definiu.
**Não regressão:** snapshot HTML do modal X.0.3.4 mantido; teste de DOM simulado verifica busca, escolha, condição, tags, salvamento, reedição e legado. Não confundir atualização de snapshot com sincronização direta Drive ↔ aplicativo: futuras mudanças exigem nova extração.

## 25. UI: pesquisa fluida e tag removível de ficha — x.0.3.12
Refinamento solicitado em 08/11/2026: busca do seletor de fichas rola com os resultados, sem comportamento sticky; na seleção de material, rodapé da especificação é recolhido para ampliar espaço útil. Quando a ficha está aberta, **Trocar material** é representado por tag removível com nome da ficha e × ao lado do título do detalhe atual (ex.: Tipo). Esta ação retorna à escolha de ficha sem eliminar dados salvos. Modal HTML aprovado continua imutável (fixture X.0.3.4), preservando quantidade/unidade/etapa, tags técnicas e regras condicionais. Teste de UI simulada validou comportamento e evento da tag; aceite visual ainda pendente.

## 26. Início único e módulos independentes — 08/11/2026, x.0.3.14
**DECISÃO:** Listas é o eixo da experiência de trabalho, sem virar dependência obrigatória dos módulos. A página raiz `/x/` é o Início oficial; PWA não abre mais automaticamente Minhas listas. A Central antiga redireciona ao Início. A página inicial tem **Minhas listas / Criar lista** em destaque, seguida de Dimensionamento, Canivete, Universo e Escola. **Criar lista** abre o modal aprovado diretamente sobre Início; o detalhe da lista também abre como modal e retorna à tela de origem ao fechar.
**Escola → Biblioteca → Fichário:** Escola é card com rota própria, Biblioteca é uma sala, Fichário de Fichas Técnicas é o primeiro livro. Continua o mesmo catálogo, sem fichas duplicadas.
**Independência:** o conteúdo estático da página inicial não depende da execução de Listas para aparecer, embora o módulo de Listas ainda seja carregado na raiz para os seus modais. Obras e Escola possuem suas próprias rotas e dados. Listas não exige obra. Políticas RLS de Listas foram verificadas por proprietário; duas contas já possuem registros isolados no banco, mas teste multiusuário em navegador não foi homologado.
**PADRÃO:** preservar modal técnico e regras aprovadas, usar mesma estrutura de cabeçalho/cards/estados, evoluir gradualmente para componentes CSS compartilhados em vez de refazer telas. Documento de auditoria `x/docs/REVISAO-ARQUITETURA-LAYOUT-2026-11-08.md` contém limites e pendências.

## 27. Auditoria de independência e teclado — x.0.3.15 (08/11/2026)
Antes de ampliar Dimensionamento e Canivete, decisão: auditar e fechar invariantes de autonomia. Ver `x/docs/AUDITORIA-INDEPENDENCIA-2026-11-08.md`, com evidências, riscos P0/P1/P2 e critérios de aceite. Banco: nove tabelas x_% com RLS ativa, sem privilégios diretos anon na consulta; 2 proprietários de listas identificados. Separação de módulos parcialmente confirmada, mas falhas de autenticação offline, conflitos e testes negativos multiusuário permanecem pendentes. Criado teste `x/tests/independencia.test.cjs`, incluído no CI. CSS `#createDialog[open]` ajustado para posicionar modal mais alto no celular, sem modificar `addDialog` aprovado. `main` inalterada.

## 28. Fechamento X.0.3.29: regras vigentes, pendências e próxima prioridade — 09/11/2026
**DECIDIDO:** manter a funcionalidade aprovada sem regressões. Catálogo e fichas são fonte de condições, opções, obrigatoriedade e nome técnico; extrações da busca são sugestões até confirmação humana. Juliano propõe; aprovação e publicação somente pelo fundador. Não promover fichas `Em revisão` a oficiais. Uma lista não inicia uma Solicitação; compartilhar exporta snapshot sem alterar original.

**IMPLEMENTADO:** interface única de Listas em modo visitante (armazenamento local) ou autenticado (cache por conta + `x_cloud_lists`), estado individual de sincronização, criação, renomeação, duplicação com UID novo, exclusão confirmada, exportação de texto/e-mail/PDF, seleção individual sem ações em lote, compartilhamento individual. Perfil e ON/OFF da rede no cabeçalho, breadcrumb, três temas em Minha conta e estrutura intacta do modal `#addDialog`. A política RLS de exclusão restrita ao proprietário foi conferida em Supabase.

**NÃO IMPLEMENTADO:** `Pendente → Aprovada → Em compras → Comprado → Recebido` como fluxo de Solicitações; aprovações/envios de múltiplas listas; compras/recebimentos parciais; motor de permissões de aprovação; vínculo funcional lista–obra. Não introduzir esses estados no serviço de Listas: são outra responsabilidade.

**NÃO COMPROVADO:** resultado atual do GitHub Actions, publicação exata da Preview, operação de PWA em mais de um dispositivo, clique real de edição/duplicação/compartilhamento/exclusão, fluxos offline/conflito e autorização multiusuário, qualidade final das seis fichas reais em revisão. Aceite do visual de Minhas listas não é aceite geral do produto.

**PRÓXIMO PASSO RECOMENDADO:** validar CI/Preview, ensaio em celular com listas descartáveis, autenticação/offline/sincronização/erro, e sanear as fichas da planilha antes dos testes com empreiteiros (meta anterior de 17/11/2026). O desenho do processo de Solicitações pode avançar separadamente no papel. Ver [auditoria](REVISAO-GERAL-CONTRATOS-2026-11-09.md).


## 29. Auditoria continuada de sincronização e documentação — 09/11/2026, 22h
**VIGENTE:** [Contratos vigentes](CONTRATOS-VIGENTES.md) e [Validação técnica incremental](VALIDACAO-TECNICA-2026-11-09.md) são as referências para retomada. A X.0.3.29 continua como versão de código e como aceite visual **parcial**, não homologação integral. Esta auditoria não introduz uma versão do app.

**INSPECIONADO NO CÓDIGO:** interface autenticada de Listas aciona exclusão coordenada em `TereonXListIntegration.deleteList`; o serviço genérico ainda disponibiliza `removeList` local e precisa manter sua fronteira explícita para futuros consumidores. `refresh()` preserva cópia de lista que desapareceu na nuvem, podendo mantê-la exibida como sincronizada em outro aparelho. Isso protege dados contra exclusão silenciosa, mas **não é reconciliação concluída**. Testar e definir estados distintos de removida remotamente, alterações locais pendentes e conflito antes de corrigir.

**BANCO (LEITURA DE METADADOS):** confirmadas quatro políticas RLS por proprietário para `x_cloud_lists` (SELECT/INSERT/UPDATE/DELETE), UPDATE com `USING` e `WITH CHECK` vinculados a `auth.uid()`; aviso de proteção de senhas vazadas desativada. Presença de políticas **não substitui ensaio A/B autenticado**.

**CI:** 17 comandos de teste declarados no workflow, mas status consultado para commit recente não comprova execução do workflow de push; não declarar sucesso. **PENDENTE:** Preview real, testes de celular, duas contas/dois aparelhos, exclusão cruzada, offline, troca de sessão e PDFs.

**PRIORIDADE:** P0 = comprovar CI/deploy, isolamento A/B e preservação de dados nos fluxos reais; P1 = desenhar reconciliação de exclusões entre aparelhos sem limpeza automática de cache; P1 = tratar alerta de proteção contra senhas vazadas antes da abertura pública. Consulte matriz de regressão atualizada. Nenhum JS/CSS, schema, ficha ou `main` alterado pela auditoria.


## 30. Descompasso de validações entre repositório local e nuvem — 09/11/2026
A auditoria do código encontrou limites não equivalentes: `Listas.servico` admite quantidade positiva sem verificação explícita de finitude e não limita na criação nome/total de itens/payload; o motor de nuvem exige até 160 caracteres no nome, até 300 materiais, quantidade finita e limite de JSON. A interface de criação limita digitação a 100 caracteres, mas não constitui o contrato do motor. **Possível efeito:** lista válida no dispositivo fica pendente/falha na sincronização por validação remota. Tratar como divergência P1 e testar dados legados e persistência antes de uniformizar. Permissões do banco verificadas por coluna: INSERT autenticado do ID próprio permitido; versão/data controladas pelo banco. Registro completo em [Validação técnica](VALIDACAO-TECNICA-2026-11-09.md). Sem alteração do aplicativo.


## 31. Etapas derivadas em Listas e escopo de Obras — 10/11/2026 · X.0.3.30
**IMPLEMENTADO em `desenvolvimento`, não homologado em aparelho:** listas passam a manter sugestões de etapas apenas quando referenciadas por materiais; ao mover/remover o último lançamento, a etapa vazia sai da Lista. A leitura de listas antigas não dispara limpeza; alterações explícitas reconciliam etapas da lista alterada. O serviço passou a rejeitar quantidade não finita e nome novo com mais de 160 caracteres. Na conta autenticada, antes de confirmar no cache uma lista criada/editada, a integração invoca a mesma validação de payload do adaptador da nuvem (até 300 itens e orçamento de payload), sem truncar dados nem impor limites da nuvem às listas avulsas. **Testes adicionados ao código; execução do CI e navegador ainda precisam ser comprovadas.**
**DIRETRIZ DE PRODUTO EM DESENHO:** chamar interface de gestão de `Obras` em vez de `Universo`. A etapa da **Obra** pertence ao escopo, pode existir sem lista e não é removida porque materiais de uma lista acabaram. A etapa de uma **Lista** é um rótulo de agrupamento provisório, podendo sugerir criação/associação à etapa de obra quando a lista for vinculada. Não criar etapa de escopo aprovada automaticamente por nome textual; exigir confirmação e preservar história/permissões. Ver [Contrato Etapas: Listas e Obras](CONTRATO-ETAPAS-LISTAS-OBRAS-2026-11-10.md). Motor de etapas de Obras, banco e vínculo ainda não implementados.


## 32. Hierarquia de escopo e capacidade — 10/11/2026
**NOVO DESENHO:** Obras possui etapas cadastradas persistentes e hierárquicas. Ex.: Quadros elétricos → QD1. O profissional pode associar materiais diretamente à etapa Quadros ou criar rótulo provisório QD1 na Lista; ao vincular a Lista, QD1 gera sugestão de associação/criação sob Quadros, sempre com confirmação. Quando a Lista já está vinculada e o usuário é autorizado, sugerir as etapas do escopo cadastrado; não conceder acesso por possuir uma lista. Etapas cadastradas não desaparecem ao remover materiais; só as etapas provisórias derivadas de lançamentos na Lista podem desaparecer quando vazias. Implementação da hierarquia/vínculo não iniciada. [Desenho de hierarquia](ESCOPO-HIERARQUICO-OBRAS-2026-11-10.md).

**CAPACIDADE REAL:** Supabase organização TEREON-app confirmado no plano Free; projeto ativo. Em consulta somente leitura de 10/11: base PostgreSQL 12.072.627 bytes (~12 MB exibidos), 2 usuários cadastrados, 6 listas na nuvem e 5 obras. Plano inclui 500 MB de banco por projeto, 50.000 MAU, 1 GB de Storage e 5 GB de transferência sem cache (mais franquia cached). Sem limite fixo anunciado de listas; 300 itens por lista é regra técnica local do laboratório, não uma limitação do Free. [Relatório de capacidade](CAPACIDADE-ARMAZENAMENTO-2026-11-10.md). Não alterar plano nem executar limpezas automáticas.


## 33. Laboratório de sugestões hierárquicas e monitoramento — 10/11
Criado `x/universo/obras/sugestoes-etapas.js` como módulo puro que lê etapas em árvore e propõe candidatos com escolha explícita, **sem gravar, vincular ou promover**. Distingue etapas de nome igual em pais diferentes e permite associação direta a etapa-mãe. Teste `x/tests/escopo-etapas.test.cjs` adicionado ao workflow; smoke-test isolado aprovado, CI completo e uso real não verificados. Limites Free e banco medidos em [Capacidade](CAPACIDADE-ARMAZENAMENTO-2026-11-10.md). A implementação real do escopo de Obras e vínculos com Listas continua pendente.


## 34. Contrato corrigido: Escopo → Etapa → Subetapa e modelo de monetização — 10/11/2026
**DECISÃO do fundador:** a Obra contém Escopos, que contêm Etapas, que podem conter Subetapas. Ex.: Revisão elétrica → Quadros → QD1/QD2; Revisão elétrica → Iluminação salas de aula → Sala 01/Sala 02; SPDA como escopo independente; Entrada de energia → Abrigo/Escavação. Subdivisão nunca é obrigatória. Etapas/subetapas cadastradas persistem mesmo vazias; rótulos temporários gerados de uma Lista somem ao ficar sem material. O motor de escopo foi separado em `x/universo/obras/escopo-motor.js`, ainda sem escrita em banco nem ligação à interface ou Listas. **A estrutura anterior de dois níveis está superada.**
**MONETIZAÇÃO em avaliação:** recomendação de manter criação técnica correta, armazenamento local e sincronização pessoal básica no gratuito; cobrar valor de colaboração, gestão de Obras, histórico avançado, armazenamento de arquivos e funções corporativas, não por mera presença de uma lista na nuvem. Não foi definido teto de listas, preço ou regra de cobrança. Basear limites futuros em uso real e custos, separando franquia Supabase da política de produto. **Nenhuma limitação comercial implementada.**


## 35. Pessoas, prestadores, equipes e alocações — 10/11/2026
**Direção do fundador:** TEREON deve manter valor real gratuito e papel social/colaborativo para iniciantes, especialmente Listas e Escola. Monetização preferencial no uso profissional/corporativo e em ofertas futuras da Escola; abertura para testar hipóteses, sem definir paywalls agora.
**CENÁRIO-ALVO:** Equipe A do Empreiteiro JS alocada à Escola X em Escopo Revisão elétrica / Etapa Quadros / Subetapa QD1. A camada de Pessoas/Prestadores/Equipes e a de Alocações devem ser **motores independentes** dos de Obras/Escopo, Identidade/Acessos e Listas. Pessoa cadastrada não precisa ter conta; uma conta TEREON pode atuar em vários espaços. Alocação operacional não concede permissão digital automaticamente. Integridade, autoria, prazos, histórico e privacidade são requisitos. **Não há cadastro, banco ou UI novos nesta etapa.** Ver [Proposta de Pessoas, Equipes e Alocações](PESSOAS-EQUIPES-ALOCACOES-2026-11-10.md).


## 36. Diário de Obras como entrada da programação de equipes — 10/11/2026
**Nova decisão do fundador:** a alocação de mão de obra deve acontecer pela experiência do Diário de Obras; não reduzir a equipe a um cadastro de relacionamentos. Ex.: terça-feira **17/11/2026**, Equipe A do Empreiteiro JS na obra **Wilson Rachid**. Permitir programar em **Escopo** por vários dias; alocação em **Etapa/Subetapa** pontual começa e termina no mesmo dia. A visão do Diário continua consolidada por **obra+data**, compatível com múltiplos registros de execução por profissional/dia já aprovados no X. **Programação não comprova presença, serviço executado nem concede autorização digital.** Ver [Contrato e roteiro do Diário](DIARIO-PROGRAMACAO-EQUIPES-2026-11-10.md).
**IMPLEMENTADO em laboratório isolado:** `x/universo/diario/programacao-motor.js` (puro), `lab.html`/`lab.css`/`lab.js` (mobile, demo em armazenamento isolado `tereon-x-diary-simulation-v1`), teste automatizado adicionado ao CI e link na página do laboratório Obras. **Não grava dados no Supabase nem acessa obras/equipes reais; não houve edição em Listas ou no modal aprovado.** Smoke-test isolado passou; CI completo, deployment Preview e teste em celular continuam não confirmados. Versão base do app X.0.3.30 sem alteração.


## 37. Consulta e apontamento diário — 10/11/2026
**DECIDIDO:** a tela Diário é a consulta por obra/data, com cartões de programação; **+ Adicionar atividade** abre o modal de programação. Cada cartão oferece **Registrar o dia** para confirmar execução daquela data, distinguir **trabalhou** de **tarefa concluída** ou registrar **não realizada** com justificativa obrigatória (chuva, ausência, equipe deslocada, falta de material, falta de acesso, outro). Um período de programação não confirma os dias automaticamente. Eventos de correção e execução preservam histórico; cancelamento do planejamento não apaga apontamentos anteriores.
**IMPLEMENTADO só em laboratório:** `x/universo/diario/execucao-motor.js` puro, segundo modal `#report-dialog`, relatórios em cache separado no navegador. `x/tests/diario-execucao.test.cjs` adicionado ao CI; teste JS isolado passou. **Não grava no Supabase nem valida presença real**, CI completo e teste de toque no celular pendentes. [Contrato do Diário](DIARIO-PROGRAMACAO-EQUIPES-2026-11-10.md).


## 38. Painel de Obras e relatórios do Diário — 10/11/2026
**Direção do fundador:** começar a organizar as páginas como produto, com **Obras** contendo painel das próprias obras e acessos separados a **Empreiteiros**, **Diário** e **Relatórios de Visita**. Implantada navegação no laboratório `x/universo/obras/lab.html`, sem alterar cadastros reais. Cadastro experimental de Empreiteiros/Equipes em `x/universo/empreiteiros/`, motor puro e UI móvel com chave local isolada, lido pelo Diário como sugestão após recarga. Visitas recebeu somente página honesta “Em preparação”, sem motor.
**PDF do Diário:** botão na consulta da obra/dia monta relatório A4 de programação e apontamento, usa `window.print()` para que usuário escolha “Salvar como PDF”. Não é arquivo PDF emitido diretamente nem relatório autenticado. Uma subetapa é conceitualmente atividade pontual de um dia; programação de etapa também permanece restrita a um dia **neste laboratório**. Fluxos do Diário, Listas e motor do Escopo permanecem separados. **Código e testes estáticos adicionados; UI em celular/CI/deploy não homologados.**
