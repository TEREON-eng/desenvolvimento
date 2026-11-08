# TEREON X — Listas na Nuvem · Laboratório v1

**Estado:** tabela e políticas Supabase aplicadas; código na branch `desenvolvimento`; testes de contrato simulados aprovados. Navegador e isolamento entre duas contas ainda não homologados.

## Para que serve
Laboratório separado para validar o caminho **criar lista → acrescentar material → salvar → abrir em outro aparelho com a mesma conta**. Não substitui, importa nem sincroniza automaticamente as listas locais do Canivete. Nenhum registro local é alterado pela execução deste laboratório.

## Arquivos e contratos
- `sql/001_listas_nuvem_laboratorio.sql`: tabela `public.x_cloud_lists`, colunas `id` (UUID), `owner_id`, `name`, `items` (JSONB), `stages` (JSONB), `version`, `created_at`, `updated_at`; limites 300 itens e 128KiB para os JSONs; RLS proprietário e grants limitados.
- `motor.js`: serviço `TereonXCloudLists.create(client)` com `list/get/createList/updateList`. Sem DOM ou armazenamento local.
- `lab.html/lab.css/lab.js`: tela de teste em tema claro, com conta TEREON, listas online, edição de nome e materiais. Não altera app principal.
- `x/tests/listas-nuvem.test.cjs`: contratos e conflito entre versões; incluído no CI.
- `x/relacoes/sql/003_identidade_listas_nuvem.sql`: registra identidade do tipo `list` somente se a lista existir online e pertencer ao usuário autenticado. Sem vínculo efetivo com obra.

## Consistência
Toda gravação de lista já existente exige `version` atual; o banco incrementa versão por trigger. Se outro dispositivo tiver alterado a lista, a operação falha em vez de sobrescrever alterações silenciosamente. **Ainda não existe mesclagem automática de edições conflitantes**: o usuário deve recarregar e resolver conscientemente.

Não inventar sincronização offline, backup local ou migração de Listas nesta versão. A criação de listas online requer conta conectada e internet. O Canivete atual continua a funcionar separadamente.

## Teste manual
1. No Preview verdadeiro da branch `desenvolvimento`, abrir `/x/listas/nuvem/lab.html`, entrando na conta de Identidade quando solicitado.
2. Criar uma lista, adicionar ao menos um material, tocar `Salvar alterações`; atualizar a página.
3. Em outro navegador/aparelho no **mesmo domínio Preview**, entrar na **mesma conta** e confirmar que a lista e seus materiais aparecem.
4. Tentar editar a mesma lista em dois aparelhos; salvar no primeiro e depois tentar salvar a versão antiga no segundo: a gravação do segundo deve ser bloqueada, sem perda da versão salva primeiro.
5. Verificar que as listas do Canivete, guardadas localmente, continuam intocadas.
6. Conta diferente não deve ler ou alterar listas de outra pessoa. **Teste real ainda pendente.**

## Próximas etapas
Integração direta com o Motor de Listas e sua especificação técnica, transferência opcional da lista local para a nuvem, sinalização de estado de sincronização, integração do tipo `list` com o Motor de Relações e vínculo explícito com Obras. A simples existência de lista online não vincula nenhuma obra.
