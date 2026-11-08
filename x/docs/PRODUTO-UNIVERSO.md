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
