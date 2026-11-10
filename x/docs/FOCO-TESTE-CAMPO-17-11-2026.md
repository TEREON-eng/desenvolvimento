# TEREON X — Foco do teste de campo em 17/11/2026
**Decisão operacional de 10/11/2026 · Teste restrito com empreiteiros · Não é lançamento comercial**

## 1. Qual é a entrega
**Testar o núcleo `Listas → Catálogo/Fichas → Especificação progressiva → Compartilhamento` numa situação real de obra.** O teste deve demonstrar que um profissional que não ajudou a projetar a ferramenta consegue criar uma lista tecnicamente útil, especificar materiais, corrigir o que for necessário e compartilhá-la sem depender de explicações do fundador.

**Não precisamos de gestão de obras completa para isso.** A gestão é um laboratório paralelo com valor estratégico, mas não é critério de sucesso nem dependência do dia 17.

## 2. O que entra / não entra

| Classificação | Itens |
| --- | --- |
| **NÚCLEO DO TESTE** | Entrar no app pelo celular; criar/abrir lista; adicionar material pelo modal **já aprovado**; selecionar ficha e confirmar atributos sugeridos um a um; quantidade/unidade/etapa; nome técnico formado; editar/remover/duplicar; salvar e reencontrar; exportar/compartilhar texto ou PDF da lista; lidar com aviso de pendência sem dado técnico inventado |
| **CONDIÇÃO DE CONFIANÇA** | Garantir que fichas iniciais realmente necessárias estejam presentes e coerentes; preservar dados em falha de rede; status de nuvem compreensível; teste automatizado sem regressão; confirmar qual versão/URL foi publicada |
| **LABORATÓRIO PARALELO** | Gestão de Obras, Escopo → Etapa → Subetapa, Empreiteiros/Funcionários, Diário, programação de mão de obra, PDF diário, Relatórios de Visita, vínculos entre motores |
| **VISÃO FUTURA** | Solicitações/aprovações/compras/recebimentos, ERP, formação avançada na Escola, cursos, marketplace e modelo comercial |

## 3. Fichas e catálogo: prioridade por suficiência, não por volume
Antes do campo, usar pedidos reais e conferir a presença e coerência dos itens mais prováveis: condutores BT, eletrodutos/conexões/curvas/conduletes, caixas, dispositivos de proteção, pontos de utilização, barramentos e itens auxiliares. **Não afirmar catálogo homologado por conter muitas opções.** Identificar ausências e conflitos que bloqueiam o pedido, sem crescer indefinidamente o catálogo. A ficha define obrigações/condições e forma o nome; atributos interpretados só entram após confirmação.

## 4. Critérios de aceite mínimos
1. **Independência:** participante entende como criar lista e adicionar material sem instrução passo a passo.
2. **Precisão:** consegue distinguir opções técnicas e confirmar explicitamente; nenhum atributo não confirmado entra como definitivo.
3. **Continuidade:** consegue editar, remover e voltar à lista; nenhuma função aprovada desapareceu.
4. **Utilidade:** lista resultante serve para conferência/compra e é compartilhável no canal de trabalho.
5. **Resiliência:** após recarga/interrupção de conexão, os lançamentos não desaparecem silenciosamente.
6. **Registro:** cada dificuldade produz evidência objetiva (entrada, ficha, aparelho, passos, resultado, severidade), sem mascarar problemas como “usuário não entendeu”.

## 5. Roteiro enxuto de observação no campo
- **Antes:** guardar versão/URL, backup seguro/exportação de listas relevantes, estado do CI, conta/ambiente (visitante ou autenticada) e aparelho.
- **Tarefa 1:** pedir que o participante crie uma lista real com alguns materiais que já conhece, sem roteiro de cliques.
- **Tarefa 2:** oferecer um pedido abreviado/ambíguo (ex.: material condutor) e observar se o motor sugere e solicita confirmação.
- **Tarefa 3:** alterar quantidade/etapa, remover item, compartilhar a lista com outra pessoa.
- **Tarefa 4:** recarregar/retornar à lista e conferir integridade.
- **Depois:** registrar tempo aproximado, pedidos não encontrados, cliques confusos, erro técnico, exportação e manifestação espontânea de utilidade. **Não registrar aprovação do usuário sem ter presenciado.**

## 6. Classificação de ajustes até 17/11
**P0:** perda/risco de dados, falha de abrir modal, especificação incorreta, acesso quebrado, impossibilidade de salvar/compartilhar.
**P1:** fluxo que confunde usuário, ficha relevante ausente, retorno/navegação, status de nuvem ambíguo, erros em celular.
**P2:** acabamento cosmético e recursos de gestão sem impacto direto no teste de Listas.

**Regra de governança:** nenhuma alteração em Obras/Diário pode redesenhar Listas, mexer no modal `#addDialog`, modificar fichas homologadas, alterar dados ou consumir a janela de validação do teste do dia 17.

## 7. Bloqueios ainda existentes (não chamar “pronto”)
A superauditoria encontrou teste de cabeçalho desatualizado, ausência de confirmação da suíte completa do CI, publicação da Preview/Worker não conferida, falta de testes completos com contas/aparelhos diferentes e divergências de reconciliação na nuvem. Resolver primeiro o que bloquearia **o uso seguro de Listas**; riscos específicos de módulos corporativos continuam no backlog paralelo.

## 8. Cronograma de trabalho
- **10–13/11:** linha de base do GitHub, CI, deploy, regressão do modal e saneamento das fichas mais utilizadas.
- **14–16/11:** ensaio móvel com listas reais e correções P0/P1; congelar mudanças não essenciais.
- **17/11:** uso supervisionado por profissionais em obra; registrar o que funcionou e o que falhou, sem promessa comercial.
- **Após 17/11:** avaliar evidências, priorizar correções e retomar laboratórios de gestão com escopo separado.

**Datas são proposta de organização, não atividades concluídas ou eventos agendados automaticamente.**


## Auditoria efetiva do núcleo — 10/11/2026
Criados [relatório de testes e bloqueios](AUDITORIA-NUCLEO-LISTAS-17-11-2026.md) e [matriz de fichas](MATRIZ-FICHAS-17-11-2026.md). **P0 técnico comprovado:** Condutor pode ser considerado completo só com Tipo+Material; Eletroduto e Curva podem ficar sem diâmetro obrigatório. Não entregar como pedido de compra homologado até sanear as fichas na origem. Cabeçalho e teste de exportação corrigidos **nos testes**, sem alteração de UI; nova regressão `fluxo-campo-17-11.test.cjs` incluída no CI. A exclusão remota cruzada entre dispositivos mostrou estado enganoso no segundo aparelho, sem solução destrutiva aplicada. CI completo, PDF, celular e deploy **seguem pendentes**.
