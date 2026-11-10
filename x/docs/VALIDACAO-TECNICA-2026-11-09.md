# TEREON X — Validação técnica incremental (somente leitura)
**09/11/2026 | Branch `desenvolvimento` | Referência do aplicativo `x.0.3.29` | Status: PARCIAL, NÃO HOMOLOGADO**

## Método e limites
Inspeção direta via GitHub de workflow, `x/listas/servico.js`, `store.js`, `integracao.js`, `nuvem/motor.js`, `auth.js`, `sw.js`, `version.json` e testes `listas-integracao`, `listas-nuvem`, `independencia`, `contratos-fechamento`. Consulta **somente leitura** de catálogo PostgreSQL e avisos de segurança do Supabase, projeto TEREON X. Não foi executado um teste E2E nem uma alteração de banco. Inspeção de código **não prova** funcionamento de browser, deploy, token real ou isolamento efetivo.

## Evidências confirmadas
1. Workflow `.github/workflows/testes-tereon-x.yml` declara **17 comandos de teste** (Node 22) no push em `desenvolvimento` e PR para `main`. O CI vigente **não foi confirmado como verde**: consultas de status combinado e workflow vinculado à PR para o último commit documental não retornaram execuções/status, insuficiente para concluir resultado de push.
2. `servico.js` administra criação, edição, duplicação, exclusão, IDs e exportação via repositório injetado; não toca DOM, catálogo ou Supabase diretamente. `store.js` grava cópia validada antes de atualizar estado em memória; falha de armazenamento gera erro.
3. `integracao.js` separa cache por usuário no chamador, marca `cloudPending/cloudConflict/cloudVersion`, usa versão no update, bloqueia exclusão durante trabalho e preserva cache após erro remoto; `nuvem/motor.js` filtra por dono autenticado e versão em update/delete.
4. Testes simulados `listas-integracao.test.cjs` e `listas-nuvem.test.cjs` contêm cenários de criação, atualização, pendência offline, conflito e exclusão; **sua presença não é resultado de execução**.
5. `version.json` indica `x.0.3.29` e `sw.js` nomeia cache `tereon-x-lab-0.3.29`; publicação e atualização real do SW não verificadas.
6. Supabase (consulta de metadados): `x_cloud_lists`, `x_list_shares`, `x_profiles`, `x_works`, `x_workspaces` estão com RLS habilitada; `x_cloud_lists` registra quatro políticas, privilégio SELECT/DELETE para authenticated, sem SELECT para anon. O trigger `x_cloud_lists_track_update` existe. Falta teste com JWT real A/B.
7. Advisor de segurança do Supabase devolveu **WARN `auth_leaked_password_protection`**: detecção de senhas vazadas desabilitada. Ver [guia Supabase](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

## Riscos e hipóteses técnicas que exigem ensaio
| Prioridade | Observação fundamentada | Teste/decisão |
| --- | --- | --- |
| P0 | CI atual e origem de Preview não comprovados | Conferir execução de push na página Actions, SHA e URL/version efetiva |
| P0 | RLS configurada mas sem teste com tokens A/B/C | Ler, atualizar e tentar excluir recursos de outras contas em ambiente controlado; não usar dados reais |
| P0 | Offline/conflito cobertos por mocks, não por duas sessões de verdade | Ensaiar dois dispositivos, edição concorrente e reconexão |
| P1 | `refresh()` **não remove** da cache registros que sumiram do resultado remoto; pode manter lista excluída em outro aparelho aparente no segundo, até reconciliação explícita | Teste: criar em A, abrir B, excluir A, conferir B; definir estado `removida remotamente` sem apagar cópia local automaticamente |
| P1 | Resultado remoto de UPDATE e escrita de cache local são passos distintos; falha entre ambos exige reconciliação | Simular falha de persistência local após servidor aceitar, reabrir e recuperar sem perder informações |
| P1 | `auth.js` depende de import dinâmico externo da biblioteca; SW não transforma o fluxo em autenticação offline comprovada | Testar abertura offline com sessão/cache anteriormente carregados e troca de conta |
| P1 | Advisor mostra proteção de senha vazada desabilitada | Avaliar ativação nas configurações do Auth antes de abrir cadastro ao público |
| P1 | Testes de regressão de modal são em parte asserts de trechos/fixture | Teste de toque, teclado, tags e gravação em navegador e celular |
| P2 | `sw.js` pré-cacheia recursos, mas fallback de navegação pode entregar página genérica para rota não cacheada | Visitar páginas profundas offline e verificar feedback correto |

## Decisão operacional
**Nenhuma correção de aplicativo foi implementada nesta revisão.** Não remover listas da cache como correção automática até existir estratégia de reconciliação. Não promover para `main` enquanto critérios P0 forem pendentes. O trabalho documental não muda versão `x.0.3.29`.

## Próxima execução recomendada
(1) obter evidência verificável de execução GitHub Actions do commit aplicativo; (2) abrir Preview com versão X.0.3.29; (3) roteiro manual de Listas/Modal/PDF; (4) duas contas e dois aparelhos com listas de teste; (5) priorizar correções apenas após reproduzir defeitos.


## Continuação da auditoria — políticas efetivas e fronteira de exclusão (09/11, sessão seguinte)
**Consulta ao banco (somente leitura):** políticas `x_cloud_lists_select_owner` (SELECT), `insert_owner` (INSERT), `update_owner` (UPDATE) e `delete_owner` (DELETE) usam `owner_id = (SELECT auth.uid())`; UPDATE tem `USING` **e** `WITH CHECK`. Os comandos são para role `authenticated`. Há trigger `x_cloud_lists_track_update`. **Interpretação:** política de propriedade consistente em nível de definição, não teste A/B com JWT real.

**Fluxo de exclusão visto no código:** `x/listas/app.js` chama `syncController.deleteList(target.id)` para conta autenticada, e `lists.removeList` somente no modo visitante. `deleteList` consulta o remoto, compara versão, tenta DELETE e só depois remove cache. Isso mitiga exclusão local isolada **na interface atual**. A API de serviço ainda expõe `removeList`, portanto novos consumidores autenticados devem usar o contrato de exclusão coordenada; não chamá-la diretamente.

**Cenários não cobertos integralmente pelos testes existentes:**
- Excluída em aparelho A, a lista previamente sincronizada continua no cache de B ao executar `refresh()`, porque ausências remotas não são reconciliadas. Necessária política explícita e teste de “removida na origem”, sem apagar trabalhos offline.
- `refresh()` não estabelece operação atômica entre receber estado da nuvem e salvar cache; erro de storage, troca de conta ou resposta atrasada merecem testes instrumentados.
- `integration.repository.save` trata adições/edições por lista restante; um consumidor futuro que use diretamente `TereonXLists.removeList` em modo autenticado poderá remover só do cache sem exclusão remota. O `app.js` atual **não segue esse caminho**, mas a fronteira deve ser documentada e testada.
- A biblioteca de autenticação é importada de CDN (`esm.sh`); abertura offline fria da PWA com sessão autenticada não foi comprovada, embora o cache de scripts esteja presente.

**CI:** workflow de 17 comandos presente no GitHub. O conector disponível consulta runs de PR por commit; `workflow_runs: []` não permite concluir que não houve execução em `push`. Não declarar CI falho nem verde sem inspeção da página Actions e do job da branch.

**Não foi alterado:** código aplicativo, banco, políticas, comportamento de exclusão, `main` ou versão X.0.3.29. Decisões de reconciliação, fluxos de conta, modo offline e eventual alteração de motor permanecem pendentes de teste/aceite.
