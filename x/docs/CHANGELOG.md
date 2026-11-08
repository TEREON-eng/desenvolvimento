# TEREON X — Histórico técnico consolidado

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
