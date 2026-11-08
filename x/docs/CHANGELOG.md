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
