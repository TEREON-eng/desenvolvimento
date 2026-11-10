# TEREON X — Revisão geral de regras, contratos e riscos

> **REVISÃO HISTÓRICA — 09/11:** manter as conclusões na data original, sem considerá-las prova de CI/deploy no dia 10. Para o trabalho imediato vale a [prioridade de campo 17/11](FOCO-TESTE-CAMPO-17-11-2026.md), com Obras/Diário como laboratório paralelo. [Estado vigente](ESTADO-VIGENTE-10-11-2026.md).

**Fechamento de 09/11/2026 · referência de código x.0.3.29 · branch `desenvolvimento`**

> Documento de auditoria do estado **atual**. Não reescreve documentos históricos. **Inspeção de código e banco não equivale a homologação em navegador nem à aprovação do fundador de funções que não foram testadas.**

## 1. Evidência e método
- Repositório `TEREON-eng/desenvolvimento`, ref `desenvolvimento`, código do shell, Listas, armazenamento, Catálogo, Compartilhar, aparência, cabeçalho, PWA e arquivos de testes.
- Comparação GitHub `main...desenvolvimento`: **ahead 651 / behind 0**, 96 arquivos no comparativo. Isso comprova separação de branches, não que um deploy apontou para a versão correta. `main` não foi modificada nesta revisão.
- A referência visual atual é **X.0.3.29**, observada e considerada **boa** pelo fundador na tela de Minhas listas (seleção alinhada ao título; quatro ações em linha abaixo). O aceite é **da disposição visual**, não da totalidade do produto.
- Comparação estática do HTML de `#addDialog` contra `x/tests/fixtures/modal-adicionar-aprovado-x034.html`: **igual** na revisão. A sequência real de fichas/teclado em dispositivo ainda requer teste.
- `x/version.json`, `x/pwa.js` e nome de cache `x/sw.js` estão em **x.0.3.29**. Não foi comprovada publicação no Cloudflare nem atualização efetiva do PWA em todos os aparelhos.
- Workflow `.github/workflows/testes-tereon-x.yml` contém 16 verificações Node.js e dispara por push na branch `desenvolvimento`; consulta ao status combinado do commit mais recente da sessão retornou **nenhum status publicado**. Isso NÃO equivale a sucesso; execução do CI da X.0.3.29 permanece **não verificada**.
- Consultas **somente de leitura** no projeto Supabase TEREON X em 09/11: políticas `x_cloud_lists_{select,insert,update,delete}_owner` presentes e com predicado `owner_id = auth.uid()`. A migração `x_cloud_lists_owner_delete` foi aplicada anteriormente e verificada. Não executei gravação/exclusão de dados reais nesta auditoria.

## 2. Regras obrigatórias (DECIDIDAS)
1. **Não regressão é obrigatória:** funcionalidades e estruturas aprovadas não podem desaparecer como efeito colateral. Alteração visual não autoriza alterar comportamento; antes/depois e regressão específicos.
2. **Proteção do modal técnico:** manter `#addDialog`, busca de fichas, tags confirmadas, opcionais/obrigatórios, remoção de tags e retomada na primeira obrigatória pendente, nome técnico em formação, unidade/quantidade/etapa e gravação no mesmo Motor de Listas. Fixture congelada é barreira mínima, não prova suficiente.
3. **Confirmação explícita:** nenhum atributo técnico extraído do texto passa a confirmado sem ação do profissional. Combinações ambíguas preservam alternativas, sem supor a resposta; ficha técnica governa condições e nomes.
4. **Catálogo não é homologação:** seis fichas reais de planilha em revisão no snapshot de 08/11; o catálogo histórico hipotético (24 entradas, 22 hipotéticas) NÃO é fonte normativa. Aprovação e publicação somente pelo fundador; Juliano pode propor.
5. **Separação de responsabilidades:** Catálogo/especificação; Listas (dados e itens); Compartilhar (snapshot, WhatsApp/e-mail/PDF); Identidade; Obras/Universo; Solicitações (aprovação, compra e recebimento); Armazenamento (infraestrutura).
6. **Lista não é Solicitação:** envio de cópia, exportação e compartilhamento não iniciam compra, aprovação, recebimento ou acesso a outra obra.
7. **Persistência segura:** guardar listas avulsas em `tereon-x-lab-v1`; conta usa cache `tereon-x-cloud-cache-<id>` e versão remota. Não migrar nem misturar contas silenciosamente. Conflitos e alterações locais pendentes não podem ser apagados por `Atualizar`.
8. **Estados independentes:** Local/Sincronizada/Aguardando/Falha/Conflito refletem armazenamento; Pendente/Aprovada/Em compras/Comprado/Recebido são proposta de ciclo de Solicitações e NÃO estão implementados.
9. **Governança de branches:** `desenvolvimento` para testes, `main` apenas após testes, análise e aprovação explícita. Nome do Worker `desenvolvimento` não é prova de ambiente de teste.
10. **Versão gratuita permanente e tecnicamente correta** é decisão. Precificação, direitos pagos, cobrança e cronograma comercial não estão homologados.

## 3. Implementações identificadas (não necessariamente homologadas)
- Shell único `/x/`, breadcrumb abaixo do cabeçalho, marca como retorno, perfil no cabeçalho, ON/OFF de **rede**, temas Claro/Escuro/TEREON configuráveis em Minha conta, aplicados às páginas e modais por CSS.
- `Minhas listas`: cartão único translúcido, nome/quantidade de lançamentos, status individual de sincronização, checkbox no canto superior direito **alinhado ao título**, quatro ícones **Editar nome/Duplicar/Compartilhar/Excluir** em linha inferior; `＋ Nova` como primário, `Conferir nuvem` secundário.
- Checkbox de seleção **não é operação em lote**. Selecionar uma lista permite `Compartilhar selecionada`; selecionar várias mantém contador e `Limpar seleção`, sem envio múltiplo nem aprovação em lote.
- Operações de Listas no serviço `TereonXLists.create(repository)`: `snapshot/get/createList/renameList/duplicateList/ensureRecordUid/upsertItem/duplicateItem/removeItem/removeList/exportList`. `duplicateList` preserva itens/etapas mas cria identidades local e remota novas.
- Convidado: listas só no dispositivo. Registrado: integração via `x_cloud_lists`, cache por usuário, marcação `cloudPending`, `cloudVersion`, `cloudConflict`; botão conferir nuvem. ON/OFF do cabeçalho NÃO confirma sincronização.
- Exclusão de lista autenticada: consulta nuvem, verifica identidade, versão/conflito, confirma DELETE remoto com RLS e só então remove a cópia local. Falha deve preservar cópia local; exclusão de visitante é local e confirmada pelo usuário.
- Obra/Universo e compartilhamento entre contas existem em laboratórios independentes; não são fluxos de compra/recebimento homologados.
- Fichário X usa snapshot de seis abas reais do Drive (`fichas-drive-2026-11-08.json`) em revisão; não há publicação automática quando a planilha muda.

## 4. Achados e riscos para correção/validação
| Prioridade | Achado | Consequência e próximo passo |
| --- | --- | --- |
| **P0** | CI da X.0.3.29, origem exata publicada e ciclo PWA não confirmados | Verificar workflow, deployment real, versão no celular e navegador desktop **antes** de ampliar escopo |
| **P0** | Fluxo real autenticado/offline/conflito/exclusão não homologado entre 2 aparelhos e 2 contas | Testar com **listas descartáveis**, conferir banco e isolamento; nunca usar lista importante em exclusão experimental |
| **P0** | Catálogo contém fichas `Em revisão`, pendências e normalizações não unificadas | Auditar fichas no Drive, resolver detalhes/condições/IDs, testar técnica de campo antes de divulgação |
| **P1** | Seleção múltipla é só marcação, sem contrato de operação por lote | Não sugerir exclusão/aprovação/envio múltiplo como pronto; desenhar operações atômicas e permissões quando necessário |
| **P1** | Estados do processo de compra ainda não têm motor/histórico/permissões | Projetar `Solicitações` e estados por pedido/item; não acrescentar um campo `status` genérico em Listas |
| **P1** | Compartilhar documento diverge do contrato de arquitetura: texto exporta etapas/detalhes e e-mail ainda não tem perfis Vendedor/Equipe/Engenharia | Registrar divergência, validar produto e só depois alterar formatos em seu motor independente |
| **P1** | `Listas.app.js` mantém navegação, modal histórico de condutor e lógica de apresentação; APIs globais ainda existem | Refatoração incremental, SEM reescrita ou substituição do modal aprovado |
| **P1** | Exclusão remota confirmada seguida por falha ao salvar cache local, ou concorrência entre dispositivos, exige teste de recuperação | Proteger cópias/diagnosticar erro; não declarar exclusão transacional local+nuvem sem evidência |
| **P2** | Documentação 07–08/11 menciona laboratório Central, botão Início e versões antigas como se fossem o estado atual | Atualizar capa/índice/guia e conservar capítulos históricos com datas |
| **P2** | Ícones compactos e checkbox precisam verificação real de toque/acessibilidade no celular | Validar alvo de toque, foco, contraste, rolagem, teclado e confirmação de exclusão |

## 5. Contratos e evidência — classificação
- **Verificado estaticamente:** arquivo de fixture do modal; hierarquia DOM atual; scripts versionados; diferença de branches; presença de testes; RLS por proprietário; separação `store/servico/integracao/catalogo` por importações verificadas.
- **Relatado/testado pelo fundador:** o formato da lista **X.0.3.29** ficou bom; há experiência prévia de login e perfis, e testes de campo anteriores do produto.
- **Não comprovado nesta revisão:** CI atual verde; instalação do PWA e atualização Cloudflare; comportamento dos três temas em todos os modais/dispositivos; troca de contas/offline em múltiplos aparelhos; clique de edição/duplicação/compartilhamento/exclusão em fluxo real; políticas RLS sob sessão A/B/C; exportação PDF real.
- **Não implementado:** ciclo de compras/solicitações, aprovações, recebimento parcial, ação em lote, vínculo operacional lista–obra, regras comerciais e dimensionamento.
- **Atenção:** `x_cloud_lists` usa RLS, mas política/grant no banco não prova teste do Data API sob token autenticado; repetir teste real de autorização.

## 6. Porta de aceite antes de abrir novos motores
1. Identificar **URL Preview de fato** e versão renderizada (não adivinhar pelo hostname).
2. Rodar e comprovar todos os testes do workflow com logs/status do commit; não inferir sucesso de `statuses: []`.
3. Repetir no celular: Início → Minhas listas → Criar → Adicionar item → especificar em ficha → salvar → editar/duplicar/remover material → fechar/abrir → compartilhar texto/PDF; verificar caixa de seleção, quatro ações de lista e três temas.
4. Login e logout; alternância usuário A/B; listas avulsas preservadas; editar offline, marcar pendente, reconectar, verificar na nuvem; conflito em duas sessões; exclusão **apenas de lista de ensaio**.
5. Testar no campo pelo menos uma sequência real de especificação com empreiteiro/encarregado; registrar dificuldade, nome do item pesquisado, tags e passo em que travou. **Não** abrir novos recursos sem fechar riscos P0.

## 7. Próxima prioridade recomendada
**Estabilização para teste de campo** é a melhor próxima entrega: executar a matriz curta de aceitação, sanar defeitos de sincronização/modal sem redesenhar o que foi aprovado e iniciar saneamento das **seis fichas reais** para as famílias prioritárias. A meta anterior de teste com empreiteiros em **17/11/2026** é referência de planejamento, não evidência de que tudo estará pronto. Em paralelo, desenhar o motor de Solicitações/etapas de compra no papel, sem introduzir suas regras em Listas.

A próxima conversa deve começar por [RETOMADA-2026-11-09.md](RETOMADA-2026-11-09.md), seguida desta revisão, do Mestre e dos testes.
