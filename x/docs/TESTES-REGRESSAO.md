# TEREON X — Matriz de testes e aceite
Atualizado em 07/11/2026. Não marcar como aprovado sem evidência observada.

## Automáticos (a implantar em CI)
- Sintaxe de todos os scripts `.js` do X e dos scripts inline.
- `catalogo.load()`: carrega 24 entradas de teste, preserva pendências, não homologa automaticamente, IDs internos únicos.
- Condições: `Sempre`, `Rígido+Aço`, `Rígido+PVC`, casos incompletos e regras desconhecidas.
- Validação: obrigatórios pendentes, opcionais, campos sem opções, quantidade inválida e etapa vazia.
- Contrato do seletor: chama `onSave` uma vez; não toca diretamente em localStorage.
- Regressão das listas: criar, adicionar, editar, duplicar, apagar, reabrir, compartilhar; manter dados históricos.
- Resiliência: falha de fetch JSON, falha de localStorage, arquivos em cache antigo.
- Segurança de publicação: nenhuma ficha é aprovada automaticamente pela consulta ou seleção.

## Manuais de navegador
1. Abrir a Preview da branch `desenvolvimento`; confirmar endereço **Preview** e não URL da `main`.
2. Biblioteca → Fichas Técnicas: 24 fichas, status e pendências visíveis.
3. Listas → Adicionar item: materiais da coleção, tags selecionadas, nome formado, quantidade/unidade/etapa.
4. Eletroduto: testar condição Rígido + Aço, Rígido + PVC, Flexível + PEAD e estados incompletos.
5. Condutor: testar seleção, remoção repetida de tags e edição após salvar.
6. Testar uma ficha hipotética e confirmar aviso de dados fictícios.
7. Lista: duplicar, editar, excluir; verificar persistência após recarga.
8. Compartilhar: texto, e-mail e PDF, verificando conteúdo e arquivo resultante.
9. PWA: instalar, atualizar, navegar offline e recuperar após retorno da rede.
10. Contribuições: validar confirmação do Apps Script na nova origem Cloudflare.
11. Móvel: fluxo em teclado real, modal, rolagem e tags em duas ou mais linhas.
12. Falha de rede e erro de armazenamento: mostrar erro sem declarar sucesso.

## Regra para promover à main
Revisão técnica + testes isolados + testes de contrato + regressão crítica + aceite no celular + aprovação expressa. Um deploy “Ready” confirma publicação, **não** a correção funcional.


## Situação dos testes automatizados em 07/11/2026
Foi adicionado `x/tests/catalogo.test.cjs` (Node.js 22, sem dependências) e workflow `.github/workflows/testes-tereon-x.yml` para push em `desenvolvimento` e PR para `main`. Na checagem imediatamente posterior, a API de Actions ainda retornava **0 execuções**. O teste permanece **não comprovado no CI**. A checagem isolada anterior do motor em ambiente de avaliação JavaScript carregou 24 fichas e verificou obrigatoriedade/condições básicas. Executar o script pelo GitHub Actions antes de homologar.


## Confirmação posterior do GitHub Actions
Em 07/11/2026, o workflow **TEREON X - testes do catálogo** executou com sucesso para o commit `78628c4` (run 42427001982). O escopo validado é o contrato do motor de catálogo; UI, PWA, integração externa e testes reais permanecem pendentes.


## Testes adicionados em x.0.3.7
O workflow `.github/workflows/testes-tereon-x.yml` agora executa:
1. `node x/tests/catalogo.test.cjs` — integridade e contratos de fichas.
2. `node x/tests/modulos.test.cjs` — armazenamento, CRUD de listas, dados históricos, módulos separados, sintaxe JS, ordem de carregamento.

Esses testes **não** reproduzem interações reais no modal, edição móvel, atualização do service worker ou exportação PDF. O teste manual antes de `main` deve criar lista, adicionar dois materiais distintos, editar, duplicar, remover, voltar, recarregar e confirmar persistência, Biblioteca e PWA. Testar erro de armazenamento e comportamento offline.

## Adendo: identidade e compartilhamento (07/11/2026)
- Workflow contém testes catalogo, modulos, identidade e compartilhar-usuarios; execução mais recente não verificada nesta consolidação.
- Testados pelo fundador: cadastro, confirmação, sessão após recarga, logout/reentrada, perfil e troca de senha autenticada. Reset via link ainda não homologado.
- Compartilhamento não testado com segunda conta; validar envio A→B, aceite/recusa, revogação, bloqueio por RLS para A/B/C, inexistência de alteração na lista original e erros de rede.
- Usuário sem sessão deve ver ligação para login (não Auth session missing).
- Antes de redesenhar CSS/HTML, repetir toda sequência funcional de Listas e modal de especificação; layout não pode modificar contrato do motor.
- Universo: validar isolamento de espaços e obras, convites revogáveis e níveis de permissão antes da integração com aplicativo principal.

## Motor de Obras — laboratório v1
1. Sem sessão: link para Identidade e nenhuma leitura/gravação indevida.
2. Criar espaço pessoal; criar espaço organização; alternar e verificar que obras são distintas.
3. Criar obra; editar nome, descrição e status; arquivar e reativar; atualizar navegador e confirmar persistência.
4. Testar títulos inválidos, descrições longas, mensagens de erro e escrita negada.
5. Com segunda conta (quando SMTP liberar), garantir que obra de outro espaço não é lida nem alterada, inclusive por acesso direto com UUID.
6. Testar mobile/desktop e confirmar que Canivete, Listas e sua chave local não foram alterados.
7. `node x/tests/obras.test.cjs` no workflow GitHub Actions — execução ainda precisa ser verificada.

## Revisão v2 do laboratório de Obras
- Conferir tema claro no celular e desktop, alinhamento de modais e funcionamento de abertura, cancelamento e salvamento.
- Criar espaço pessoal e espaço de organização; editar o **nome**; tentar alternar de espaço e confirmar dados isolados.
- Criar/editar obra; usar **Excluir**; conferir desaparecimento da lista normal, presença na Lixeira e restauração; arquivamento continua diferente de exclusão.
- Excluir espaço e restaurar; obras anteriormente vinculadas devem reaparecer; nenhuma gravação de Listas deve sofrer alteração.
- Validar que conta estranha não consegue alterar `deleted_at` nem nome/descrição da obra fora de seu espaço; teste cruzado ainda pendente.
- Validar o fluxo em Preview e o GitHub Actions antes de promover à main. Não declarar homologado por apenas passar teste simulado.

## Central mobile e filtro Todos — 08/11/2026
- Abrir `/x/laboratorios/` no Preview verdadeiro de desenvolvimento no celular; verificar links para Canivete X, Obras, Minha Conta e Compartilhar Listas.
- No Universo, escolher `Todos os espaços`: conferir contagens e obras somadas; cada cartão indica seu espaço; tentar editar/excluir espaço com `Todos` e verificar ações desabilitadas.
- Criar obra no filtro Todos escolhendo destino no modal; verificar que somente o espaço escolhido recebe a obra.
- Incluir datas previstas de início/término, salvar, reabrir edição e confirmar persistência; testar término anterior ao início (deve falhar).
- Filtrar individualmente cada espaço, depois voltar a Todos; arquivar/excluir/restaurar uma obra sem interferir nas outras.
- Validar responsividade e fluxo com conta autenticada; CI e navegador ainda requerem confirmação.
