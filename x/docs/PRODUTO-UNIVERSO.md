# TEREON X — Universo | Desenho funcional do produto
**07/11/2026 · v0.1 para discussão — arquitetura aprovada em princípios; telas e comerciais ainda são PROPOSTAS**

## 1. O que é
**Universo é a gestão das obras**, não um segundo Canivete. O mesmo profissional pode gerenciar obras sozinho e depois ampliar para funcionários; também pode trabalhar em uma obra específica de uma empresa contratante. A conta da pessoa permanece única; cada obra pertence a um espaço de trabalho. O plano contratado concede **capacidades**; uma permissão concede **acesso**; são conceitos diferentes.

## 2. Hierarquia proposta
`Conta TEREON (pessoa) → Espaços de trabalho (pessoal / empresa) → Obras → Etapas/ambientes → Listas vinculadas → Solicitações → Aquisições/recebimentos`.
A vinculação de listas não transfere automaticamente posse de listas particulares; o usuário deve escolher a ação. Uma pessoa pode participar de múltiplos espaços, com autorização limitada a uma obra e a operações específicas (consultar, lançar, solicitar, aprovar, registrar compra, confirmar recebimento). Proprietário/admin gerencia participantes. Um colaborador não ganha acesso a todas as obras por ter sido convidado para uma.

## 3. Casos de uso aprovados conceitualmente
**Autônomo:** cria obra particular; associa listas; acompanha o que precisa, o que solicitou e o que comprou; pode fazer tudo individualmente.
**Empreiteiro com equipe:** mantém obras, convida colaboradores, estabelece responsabilidade e acesso; alguém solicita, gestor decide.
**Empresa/engenharia:** obras simultâneas, diferentes equipes, solicitações com níveis de aprovação, compras e recebimentos; histórico auditável.
**Colaborador externo:** atua em obra autorizada da construtora sem misturar obras particulares nem visualizar as demais.

## 4. Proposta de telas mínimas do Universo (NÃO IMPLEMENTADAS)
1. **Entrada Universo:** seletor do espaço atual + cards de obras do usuário, busca, estado e botão "Nova obra" quando autorizado.
2. **Obra:** cabeçalho (nome, código opcional, responsável, situação), abas discretas "Visão geral", "Listas", "Solicitações", "Equipe"; sem repetir o modal de especificação.
3. **Listas da obra:** referências explícitas às listas da obra, separação entre minhas listas privadas e listas disponibilizadas à equipe; ação "Vincular" não altera o original sem confirmação.
4. **Solicitações da obra:** fila por status e responsáveis; quando motor Solicitações existir, mostrar saldos por item (solicitado, aprovado, comprado, recebido, pendente).
5. **Equipe da obra:** participantes e níveis de acesso por obra; convites e revogações com trilha.
6. **Visão geral futura:** resumo de pendências, prazos e alertas, sem inventar métricas nem duplicar a origem dos dados.

## 5. Fluxo conceitual de materiais
`Criar/editar Lista (Canivete)` → [`Compartilhar` informal, sem fluxo] OU [`Solicitar` formal]
`Solicitar` → snapshot independente imutável da versão enviada → análise/ajustes com histórico → aprovação → compras (total/parcial) → entrega → aceite da obra (total/parcial) → fechamento ou pendências.
Mesmo que uma lista tenha dez itens, cada um pode ter estágio quantitativo diferente. Datas, usuário responsável, justificativas e divergências são registros do processo; não basta um status único por lista. Não reprogramar listas para fazer isso.

## 6. Responsabilidades técnicas
- `Universo/Obras`: CRUD de obras e vínculo a espaço; não edita itens técnicos.
- `Espaços/Acessos`: resolve o usuário, suas funções e as obras acessíveis; banco impõe RLS.
- `Listas`: continua dona de seus registros; recebe referência de obra apenas por contrato versionado quando integração for autorizada.
- `Solicitações`: módulo próprio; snapshot de lista e histórico de estados por item.
- `Compartilhar usuários`: cópia informativa; não significa solicitação, vínculo ou edição colaborativa.
- Banco: persistência; não deve depender do visual.
Não confiar no frontend para autorizar ações; banco aplica papéis por obra. Eventos sensíveis precisam histórico e testes cruzados.

## 7. Roadmap recomendado — decisões pendentes
**U0 — desenho e contratos:** validar conceitos e papéis, mapear fluxos de obra individual e com equipe. Sem integrar ao shell.
**U1 — Obra individual em laboratório:** criar/editar/arquivar obra pessoal, status, vínculo opcional com lista demonstrativa; teste com conta atual.
**U2 — Espaço e equipe:** convites com identificação segura, permissão por obra, revogação e isolamento verificado com duas contas.
**U3 — Listas vinculadas:** vincular referências sem migrar dados locais automaticamente; backups e compatibilidade.
**U4 — Solicitações:** processo independente e aprovável, aquisições/recebimentos por item.
**U5 — Gestão ampliada:** custos, relatórios, portfólio, integrações ERP e monetização, apenas depois de prova de campo.

## 8. Perguntas em aberto (não presumir aprovações)
- Obra permite fases, ambientes e centro de custo já na primeira versão ou isso é evolução?
- Convite inicialmente por identificador, por e-mail, ou ambos? Como evitar cadastro de contatos duplicados?
- Qual papel padrão do funcionário? Quem pode aprovar ou comprar? Admin do espaço é sempre gestor de todas as obras?
- O colaborador externo pode copiar para seu espaço pessoal listas da empresa? Precisa de autorização explícita.
- Como tratar listas vinculadas em dispositivos diferentes e trabalho offline?
- O que acontece com dados ao sair da empresa, encerrar a obra ou deixar de pagar?
- Qual o recorte grátis/pago, limites e preço após testes de valor?
**Regra:** apresentar ao fundador como decisões de produto, não construir por suposições.

## 9. Recuperação da primeira concepção do Universo (registro de 07/11/2026 à noite)
**CORREÇÃO DE ESCOPO trazida pelo fundador:** o Universo original não era apenas cadastro de obras e filas de solicitações. Já tinha objetivos de **acompanhamento de aplicação de materiais, Diário de Obras, Relatórios de Visitas e Alertas**. Essa direção foi congelada para focar a especificação técnica e as listas, preparando testes até 17/11. O retorno ao Universo deverá considerar o Canivete como núcleo estabilizado e a alimentação técnica das fichas por Juliano (propostas sob aprovação exclusiva do fundador).

**Definições recuperadas de outubro, sem afirmar que estão implementadas no X:**
- O "Acompanhamento" anterior foi reconceituado como **Resumo da obra**: pendências, próximas atividades, últimas visitas, registros, prazos e atenção necessária.
- **Atividade** é serviço/intervenção que pode durar vários dias e ser citada por múltiplos Diários.
- **Diário de Obras**: registros por data com atividades, ocorrências, impedimentos e fotografias.
- **Visitas**: data, finalidade, observações, providências e fotografias. Vínculos com atividades são opcionais e devem ficar recolhidos; não impor na tela campos de identificação/verificação desnecessários.
- **Alertas internos**: materiais sem confirmação, próximas atividades, pedidos atrasados e pendências de providências de visitas. O alerta é derivado de eventos/datas registrados; não inventar compra, prazo ou consumo.
- **Listas**: criação avulsa e veloz no Canivete, com vínculo posterior e explícito à obra; preservar dados locais e experiência mobile-first.
- **Aplicação de Materiais:** dimensão central reafirmada pelo fundador em 07/11. O modelo deverá distinguir **previsto/solicitado/comprado/recebido/aplicado** e suas quantidades, com origem rastreável e sem confundir consumo com solicitação. O detalhamento exato e as regras de lançamento são **PROPOSTA a validar**, não função pronta.
- A arquitetura visual antiga usou "Centro de Controle" com área geral de obras e relatórios e área de obra ativa com visitas/atividade atual/listas em atenção. Aproveitar a lógica de apresentação sem copiar os acoplamentos do código legado.

### Primeiro valor comercial a validar
Não reduzir Universo Individual a uma lista de nomes de obras. Mínimo útil **proposto**: cadastro de obra, vínculo das listas, acompanhamento do material aplicado, atividade/diário, visita e pendências/alertas básicos. O conjunto e a profundidade serão discutidos antes de implementação. Os motores podem ser independentes e o Universo funciona como uma composição de experiências, não um monólito.

### Trabalho paralelo e critério de lançamento
**Frente 1:** estabilização e teste de campo do Canivete/Especificação para 17/11 (meta, não homologação garantida), com Juliano contribuindo com propostas de fichas sob governança no Drive.
**Frente 2:** desenho e contratos do Universo, diários, visitas, atividades, alertas e aplicação de materiais em laboratórios separados. Não desestabilizar o Canivete para adiantar o Universo.
**Marco comercial seguinte:** a visão do fundador é um lançamento de produto mais completo após essa etapa, mas **escopo, versão e data ainda precisam ser aprovados**.

### Revisão de ordem
O roteiro anterior U1–U5 continua como referência de fundação técnica, mas não representa sozinho a prioridade de valor percebido. Acrescentar prova de uso de diário, visitas, materiais aplicados e alertas **antes de declarar Universo Individual como produto comercialmente pronto**.

## 10. Recorte do primeiro Universo — ajuste aprovado em 07/11/2026
O fundador definiu que o primeiro esboço **não deve controlar aplicação detalhada de materiais**. A prioridade é acompanhar **pedi → autorizei → chegou**. A obra reúne as solicitações, enquanto o motor de Solicitações conserva estados, responsáveis, datas e histórico. A Lista original é preservada.

**MVP conceitual:** cadastrar obra, vincular lista, criar solicitação com snapshot, acompanhar autorização e recebimento, inclusive parciais quando necessário, e mostrar pendências/alertas simples. Aquisição pode ser um registro intermediário opcional, sem implementar compras completas no primeiro ciclo. Compartilhar uma lista não deve gerar solicitação.

**Depois:** vincular Diário de Obras a etapa prevista na lista ou atividade, sem concluir automaticamente que todos os materiais foram aplicados. Controle detalhado de consumo fica fora deste recorte.

**Separação técnica:** Listas gerencia materiais de origem; Solicitações é dona do fluxo de atendimento; Diário guarda execução; Universo organiza obra e painéis; Identidade/Acessos define autorização. Nada disso significa implementação concluída.

## 11. Prestadores, equipes e Diário colaborativo — direção do fundador (07/11/2026)
**DECIDIDO conceitualmente:** o Universo deve atender todos os modelos: construtora com vários empreiteiros em várias obras; empreiteiro pequeno que executa pessoalmente e coordena uma ou mais equipes; profissional/eletricista individual com conta TEREON. A identidade é individual, pode atuar em múltiplos espaços e obras autorizadas.

**Registro de campo como origem:** o eletricista deve poder registrar o serviço executado com fotos, data, local/etapa opcional, texto e responsável, de forma móvel e rápida. O Diário de Obras consolida registros dos profissionais, por dia e por obra; supervisor pode complementar/validar quando exigido. Registro de execução ≠ aprovação ou conclusão automática.

**Divisão de responsabilidades sugerida (a validar antes de codificar):**
- Prestadores e Equipes: cadastro de empreiteiros, equipes, integrantes, papéis, contatos; prestador não precisa ter conta nem cadastrar todos para ser registrado.
- Alocação: vínculos temporais equipe ↔ obra; registro de histórico sem confundir alocação com permissão digital.
- Registro de Execução: autoria, data, obra, etapa/local, serviço, anexos/fotografias, observações; lançamento pelo profissional em sua própria conta.
- Diário de Obras: visão consolidada dos registros daquele dia e obra, eventos/ocorrências e eventual validação; sem duplicar entrada de informações.
- Centro de Controle e Indicadores: consultas agregadas por empresa, prestador, obra, equipe e período, respeitando permissões.
- Identidade/Acessos: autorização de leitura/escrita por obra e função; cada prestador pode manter suas obras particulares sem expô-las à contratante.
**Hipótese de UX:** a ação "Registrar serviço" deve ser tão curta quanto criar uma lista no Canivete. Foto por serviço é objetivo de experiência; tratar ausência de câmera/sinal, consentimento, armazenamento e envio posterior sem bloquear registro.
**Futuro:** vincular registros a etapas previstas nas listas sem presumir aplicação quantitativa nem conclusão de materiais. Não há implementação deste fluxo no TEREON X.

## 12. Múltiplos registros por profissional ao longo do dia — confirmado
O fundador confirmou explicitamente que cada profissional pode fazer **vários registros de execução no mesmo dia e obra**. O modelo não impõe um diário único por eletricista/dia. Cada registro é uma ocorrência independente, com identidade, autoria, obra, data/hora, descrição, fotografias opcionais e referência opcional à etapa/atividade. O Diário de Obras apresenta a **consolidação por obra e data**, preservando a origem individual e a ordem cronológica. Prestador, encarregado ou gestor podem visualizar e complementar conforme autorização. Registros de impedimentos também entram no fluxo; lançamento não equivale a aprovação ou a material efetivamente aplicado. **Decisão de produto, ainda não implementada.**

## 13. Diário consolidado por obra, inclusive entre empreiteiros — correção do fundador
**DECIDIDO:** o Diário de Obras consolida os registros **de toda a obra e de todos os profissionais autorizados**, não apenas os de um funcionário, equipe ou empreiteiro. Uma mesma obra pode reunir simultaneamente atividades de equipes de prestadores diferentes. Cada registro de execução preserva autor, data/hora, prestador, equipe e vínculo à obra quando existentes; o diário é uma visão agregada por **obra + data**, não substitui as fontes.
- A gestão da construtora pode consultar o conjunto permitido de registros daquela obra.
- Cada empreiteiro acompanha apenas suas equipes/registros e demais informações expressamente autorizadas.
- Cada eletricista acompanha seus lançamentos e informações que tiver permissão de consultar.
- Permissões são impostas no banco; não basta filtrar elementos na interface.
- Um relatório diário consolidado pode acrescentar observações gerais e validação por responsável, sem apagar autoria ou transformar simples registro em aprovação.
- Consolidar não significa replicar dados nem dar acesso irrestrito a registros privados de outras organizações.
**Status:** regra de produto confirmada, motor de Execução/Diário ainda não implementado.

## 14. Fundação implementada — Motor de Obras / laboratório v1
Em 07/11/2026 foi implantada a primeira etapa técnica: o laboratório `x/universo/obras/lab.html` e o serviço sem DOM `motor.js`. Utiliza as tabelas Supabase `x_workspaces` e `x_works` já existentes, com RLS e permissões de alteração limitadas aos campos permitidos. Cria espaços pessoais ou de organização sob a conta do dono, cadastra/edita/arquiva obra e apresenta contagem de obras ativas/total. A edição do espaço, membros e vínculos entre módulos fica para ciclos posteriores.
**Não confundir com Universo completo:** ainda não há Centro de Controle com indicadores operacionais, equipe, Solicitações, Diário, Alertas nem Listas vinculadas. Precisa teste em browser e com segunda conta antes de homologar.

## 15. Revisão de usabilidade do laboratório de Obras
Após o primeiro teste do fundador, o cadastro foi ajustado: espaços com nomenclatura clara (Pessoal / Organização, não profissão "empreiteiro"), criação e edição por modal, obras com edição e exclusão recuperável, Lixeira com restauração de espaços e obras, tema claro alinhado ao TEREON X. **Tipo do espaço só pode ser escolhido na criação por enquanto**. A atualização restringe-se a `x/universo/obras` e às colunas de exclusão reversível; não implementa gestão de empreiteiros, equipes nem dados de execução. A interface exige teste em Preview.
