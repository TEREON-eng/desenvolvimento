# TEREON X · Universo / Motor de Obras — Laboratório v1

**Estado: código implantado na branch `desenvolvimento`; RLS e esquema confirmados no Supabase; fluxo de navegador ainda não homologado.**

## Escopo funcional
- `motor.js`: `TereonXWorks.create(client)` retorna `spaces/createSpace/list/createWork/updateWork/archive`; motor sem DOM, sem Listas, sem CSS, sem storage local.
- `lab.html/lab.js/lab.css`: ambiente isolado para cadastrar espaços e obras, visualizar, editar, alterar situação ou arquivar.
- `sql/001_obras_laboratorio.sql`: evolução de `public.x_works` existente; status com cinco valores; limites de texto; privilégios de `INSERT` e `UPDATE` por coluna nas tabelas `x_works` e `x_workspaces`. Mantém políticas RLS anteriores.
- `x/tests/obras.test.cjs`: validação dos contratos sem rede, incluída no workflow GitHub Actions.

## Fonte única e relações
Cada pessoa possui conta de identidade. Espaços de trabalho `x_workspaces` podem ser `personal` ou `organization`; a obra `x_works` pertence a exatamente um espaço. O espaço pertence ao criador. Permissões de participantes são modeladas por tabelas existentes, mas **ainda não se fazem convites pelo laboratório**. Nenhum vínculo com Listas ou Solicitações foi implementado nesta etapa.

## Estados
`planning` (planejamento), `active` (em andamento), `paused` (pausada), `completed` (concluída), `archived` (arquivada). Arquivar é **alterar status**, não apagar. Na versão v1, pode reativar pelo botão Editar.

## Segurança e limites
Usa Supabase publishable key; políticas RLS existentes permitem criar/editar obra apenas em espaço próprio. As permissões de dados agora restringem `UPDATE` a `name/description/status` em obras e `name` em espaços, impedindo atualização genérica de `owner_id/workspace_id`. Nenhuma exclusão disponível. Ainda **não houve teste de acesso com duas contas distintas**; não homologar isolamento multiempresa antes disso.

O laboratório exibe espaços **cujo owner_id é o usuário atual**. A visualização de obras como membro convidado está planejada para fase futura. Não automatizar criação de espaço pessoal silenciosamente; o usuário escolhe o nome e confirma.
A primeira versão de Centro de Controle possui apenas contagem de obras totais e em andamento, calculada localmente a partir das obras que o usuário pode listar. Não são indicadores financeiros, produtivos ou operacionais.

## Testes manuais necessários
1. Abrir Preview real de `desenvolvimento` em `/x/universo/obras/lab.html`; **não** usar o domínio Worker chamado desenvolvimento que aponta à main.
2. Sem login: mostrar link para o laboratório de Identidade e não erro de sessão.
3. Entrar na conta TEREON X e voltar; criar espaço pessoal com nome escolhido.
4. Criar duas obras, editar nome/descrição, marcar uma em andamento e arquivar outra.
5. Atualizar/reabrir a página e confirmar persistência no Supabase, inclusive obra arquivada.
6. Criar segundo espaço organizacional e confirmar a separação.
7. Criar segunda conta quando limite SMTP permitir; verificar acesso negado à obra do primeiro usuário e impossibilidade de alterar proprietário ou espaço.
8. Verificar telas mobile/desktop e CI antes de conectar ao shell.

## Próximos motores
Centro de Controle será o agregador de dados da Obra e das consultas. Prestadores e Equipes, Alocação, Solicitações, Diário, Visitas, Alertas e Relatórios alimentam informação própria ligada à obra, sem mudar o Motor de Obras. **Nenhum destes está implementado por este laboratório.**
