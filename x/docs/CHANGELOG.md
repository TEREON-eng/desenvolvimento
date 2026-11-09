# TEREON X — Histórico técnico consolidado

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
