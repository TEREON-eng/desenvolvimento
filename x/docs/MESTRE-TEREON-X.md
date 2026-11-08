# TEREON X — Documento Mestre vivo
**Consolidação: 07/11/2026 (noite) · Fonte canônica de produto do laboratório X · Situação: desenho em evolução**

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
Repositório `TEREON-eng/desenvolvimento`. Trabalhar somente em `desenvolvimento`; `main` depende de aprovação explícita. Cloudflare Worker de nome `desenvolvimento` aponta para produção/main; Preview tem URL distinta. App principal no X versão **x.0.3.7** (não alterar número por apenas acrescentar laboratórios isolados).
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
