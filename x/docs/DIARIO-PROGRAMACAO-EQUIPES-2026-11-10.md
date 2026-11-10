# TEREON X — Diário de Obras: programação de mão de obra
**10/11/2026 · Laboratório mobile de simulação · branch `desenvolvimento` · SEM BANCO OU AUTORIZAÇÃO REAIS**

## Decisão do fundador
**Gerenciar alocação de mão de obra pela experiência do Diário de Obras**, não como formulário isolado de cadastro. Exemplo: terça-feira **17/11/2026**, Equipe A do Empreiteiro JS, obra **Wilson Rachid**, alocada ao Escopo **Revisão elétrica** por vários dias; alternativamente a uma Etapa **Quadros** ou Subetapa **QD1** em um lançamento específico de **um dia**. Motivo: o Diário deve organizar previsão e acompanhamento de equipes no calendário, sem exigir ao usuário conhecimento dos contratos internos.

## Contratos com precedência
1. **Programação ≠ presença confirmada ≠ execução**: programar equipe no Diário cria compromisso previsto, não registra a presença, não fecha etapa, não comprova material aplicado, não concede permissão ao sistema.
2. **Escopo/Obra**: programação pode conter data de início e término diferentes; aparece na visão diária de cada data do intervalo, sem gerar registros de execução automáticos.
3. **Etapa/Subetapa**: um lançamento de programação cobre **somente um dia**; para outro dia cria-se outro lançamento, ainda que para a mesma equipe e etapa.
4. **Diário verdadeiro:** a visão `obra + dia` consolidará programas e registros de execução distintos, com múltiplos registros por profissional e por dia. Registro de execução preserva autoria, hora, fotos opcionais, ocorrências e serviço; não é produzido a partir de programação.
5. **Cadastros, alocações e acessos continuam independentes:** Diário é a UX orquestradora; motor de programação armazena programação, Cadastro Profissional fornece equipes/prestadores, Escopo fornece árvore, Acessos autoriza operações. Um vínculo de equipe não fornece direito digital por si só.
6. O profissional pode atuar sem conta ou empresa cadastrada no uso gratuito de Listas/Escola; não usar programação como obrigação para utilizar Listas.
7. Priorizar três níveis definidos no X: `Obra → Escopo → Etapa → Subetapa`. Não copiar UI do TEREON legado; consultas antigas são apenas referências históricas.

## Implementado para ensaio
- `x/universo/diario/programacao-motor.js`: motor puro de validação, inclusão, alteração, cancelamento lógico e consulta por dia, sem DOM, sem banco, sem `supabase`, sem dependência de Listas ou fichas.
- `x/universo/diario/lab.html`, `lab.css`, `lab.js`: interface responsiva para celular, simulação com obras fictícias Wilson Rachid/Escola X; empreiteiros JS/Solange; equipes A/B/C e escopos exemplos. Filtros por obra e data, lançamentos em um dia ou período conforme o nó, cancelamento que preserva histórico da simulação.
- Dados salvos **somente no navegador e nesta origem** em `tereon-x-diary-simulation-v1`. Não se deve usar nomes da simulação como se fossem registros da construtora. Não consulta nem modifica tabelas reais e não vincula usuários.
- Entrada pelo laboratório de Obras: `/x/universo/obras/lab.html` → **Testar Diário de Obras (simulação)**. Caminho direto: `/x/universo/diario/lab.html`.
- `x/tests/diario-programacao.test.cjs` incluso no GitHub Actions. Smoke-test isolado com JS executado; **CI completo, publicação Preview e teste no aparelho real NÃO comprovados**. O app principal continua X.0.3.30.

## Roteiro de teste no celular
1. Abrir a **Preview da branch desenvolvimento** (confirmar deploy/host antes; Worker cujo nome é `desenvolvimento` pode apontar para `main`).
2. Acessar `/x/universo/diario/lab.html` ou Obras → Testar Diário.
3. Selecionar Wilson Rachid → Empreiteiro JS → Equipe A → Escopo Revisão elétrica → início 17/11, fim 20/11. Salvar.
4. Selecionar 17, 18, 19 e 20/11 no filtro; a equipe deve aparecer. Em 21/11 não aparece.
5. Selecionar **Etapa Quadros**; campo fim deve ficar igual ao início e desabilitado. Salvar no dia 17/11.
6. Conferir duas programações no mesmo dia, filtro por outra obra, persistência após recarregar e cancelamento sem apagar outros registros.
7. Reabrir Listas e conferir que modal `#addDialog`, fichas, seleção, caches e material antigo não foram alterados.
8. Não interpretar esse laboratório como prova de autorização real, presença de equipe, execução/Diário definitivo ou armazenamento compartilhado.

## Próximos passos e decisões abertas
- Confirmar se *um único dia* para etapa/subetapa é regra absoluta da programação ou preferência da UI; atual laboratório aplica regra absoluta conforme solicitação de 10/11.
- Como registrar **efetivo executado** após a programação, inclusive faltas, equipes parciais, deslocamento e imprevistos, sem preencher automaticamente.
- Composição histórica da Equipe A e vínculo de pessoa com conta TEREON, respeitando privacidade.
- Sincronização e RLS da futura programação real, com dono da Obra e permissões por escopo. Não criar SQL real sem esse contrato.
- Fotos e observações de execução em eventos autônomos que o Diário consolidará, não no evento de programação.
- Regras para conflito de horário/equipes em duas obras; inicialmente informar e permitir decisão do gestor, sem bloqueio automático ainda.

**Sem alteração na `main`, contas, Supabase, dados de Obras, Listas, PWA ou interface do modal.**


## Evolução da experiência — consulta e apontamento do dia (10/11/2026)
**Decisões do fundador:** a página principal do Diário deve ser **consulta/listagem das programações**; o botão **+ Adicionar atividade** abre o modal de programação, sem exibir formulário permanente. Em cada programação do dia, botão **Registrar o dia** abre um **segundo modal independente**, para confirmar:
- **Equipe trabalhou nesta atividade:** registrar execução daquele dia, podendo marcar separadamente **tarefa concluída**; executar ≠ concluir;
- **Atividade não realizada:** exige justificativa categorizada (chuva, equipe não compareceu, deslocamento para outro atendimento, falta de material, falta de acesso/liberação ou outro), com observação livre opcional.
- Ao revisar informação do dia, **acrescentar novo evento e preservar o histórico anterior**. Dia 17/11 não confirma 18/11 automaticamente, nem uma tarefa concluída reescreve os outros dias da programação.
- Cancelar uma programação não apaga os registros históricos de execução que já existirem.

**IMPLEMENTADO NO LABORATÓRIO:** `lab.html` consulta primeiro; `#entry-dialog` para planejar, `#report-dialog` para apontar; `x/universo/diario/execucao-motor.js` puro e separado do `programacao-motor.js`; registro de execução em chave local independente `tereon-x-diary-execution-simulation-v1`, sem Supabase; controles nos cartões de programação diária. Testes `x/tests/diario-execucao.test.cjs` adicionados ao workflow. **Verificação isolada de JavaScript executada e aprovada**, CI completo e interação no celular ainda sem aceite.

**Próximas lapidações (não implementadas):** divergência entre presença de equipe e execução de uma atividade, execução parcial/quantidades, motivo detalhado editável e registro fotográfico; assinatura/validação do responsável; tratamento explícito de atividade concluída que ainda aparece em datas futuras da mesma programação; critérios para programar outro dia sem conflitar com relatório anterior. O rótulo “tarefa concluída” significa declaração de conclusão da programação/tarefa daquele dia, ainda não aprovação técnica da obra.
