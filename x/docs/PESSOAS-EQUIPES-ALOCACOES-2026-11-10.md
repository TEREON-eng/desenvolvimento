# TEREON X — Pessoas, prestadores, equipes e alocações
**10/11/2026 · Proposta arquitetural fundamentada nas decisões do fundador · SEM IMPLEMENTAÇÃO DE BANCO OU UI**

## Propósito
Permitir vincular, por exemplo, a **Equipe A** do **Empreiteiro JS** ao **Escopo Revisão elétrica**, **Etapa Quadros**, ou **Subetapa QD1** da **Escola X**, sem misturar alocação real com permissões digitais ou exigir que todos tenham conta. O profissional individual pode usar listas e Escola sem cadastro corporativo.

## Entidades e contratos independentes
1. **Pessoa / contato profissional:** cadastro de pessoa com identidade local ao espaço e dados mínimos; não presume conta TEREON. Quando a pessoa optar por vincular uma conta, o processo exige comprovação/aceite e evita associação apenas por nomes coincidentes. Nunca copiar dados pessoais entre organizações implicitamente.
2. **Conta TEREON:** identidade de autenticação única (Auth + x_profiles); uma mesma pessoa pode atuar em espaços diferentes. Conta e pessoa cadastrada não são sinônimos automáticos.
3. **Prestador / organização:** empreendimento individual, empresa ou contratado; vínculo comercial/contratual com o espaço ou obra. Não confundir `x_workspaces` (espaço digital sob controle de uma conta) com toda empresa externa cadastrada.
4. **Equipe:** grupo sob prestador (opcional), com identificação e responsável, sem obrigar membros a terem conta; equipe pode estar ativa em várias obras e mudar composição ao longo do tempo.
5. **Participação da pessoa na equipe:** relação temporal `person_id → team_id`, início/fim, papel operacional, histórico; uma pessoa pode ter papéis/contextos distintos.
6. **Alocação operacional:** relação temporal `team_id/person_id → work_id + scope_node_id?` com escopo opcional e granularidade `scope/stage/substage`. Vínculo à obra não exige uma etapa; uma equipe pode receber mais de uma frente, e uma frente várias equipes. Registrar período, responsável pela designação e status, sem presumir conclusão.
7. **Permissão digital:** subsistema Identidade/Acessos aplica autorização real, inclusive RLS. Alocação não implica leitura, edição, aprovação ou acesso às informações de outras equipes. Convites e revogações são fluxo específico com auditoria.

## Exemplo
- Escola X: Escopo **Revisão elétrica** → Etapa **Quadros** → Subetapa **QD1**.
- Prestador **Empreiteiro JS** → Equipe **A** → profissionais cadastrados, com ou sem conta.
- Alocação: Equipe A → Escola X / Revisão elétrica / Quadros (ou especificamente QD1), período definido.
- Listas e registros de execução podem referenciar a alocação em etapa futura, mas **não herdam autorização por conta própria** e não transformam material pedido em executado.

## Motor e dados propostos
Motor **Cadastro Profissional**: pessoas, prestadores, equipes, composição temporal. Dono de seus registros; API pequena independente do DOM, Catálogo, Listas e Diário.
Motor **Alocações**: associa referências verificáveis de equipes/pessoas com obras e nós do Escopo; consulta identidades por APIs explícitas; não escreve nos motores de origem.
Motor **Acessos**: contas, convites, papéis e RLS, sem equivalência automática entre equipe e credencial digital.
Motor **Obras/Escopo**: estrutura `Obra → Escopo → Etapa → Subetapa`, com IDs estáveis. Não armazena membros da equipe dentro do JSON do escopo.
**Separar propriedade:** a organização contratante é dona do registro de alocação da própria obra; o prestador gerencia suas pessoas/equipes conforme direitos. Questões de edição cruzada devem ser definidas antes do SQL.

## Contratos mínimos de segurança
- Identificadores estáveis; escopos, equipe e obra devem ser verificáveis e autorizados antes de alocar.
- Proibir ciclos, associações a obra errada, acesso derivado por nome e alterações de propriedade sem autorização.
- Histórico de alocação preservado: encerrar vínculo, não apagar autoria de registros anteriores.
- Minimização de dados (nome ou apelido profissional, função e contato opcional); evitar CPF, documentos e dados sensíveis no MVP. Política de privacidade, finalidade, retenção e consentimento devem ser planejados conforme LGPD.
- Prestador e colaborador enxergam somente o que lhes foi autorizado; vínculo operacional não abre todo o escopo/obras do contratante.
- Cadastro/convite de menores ou alunos não fazer parte deste fluxo profissional; Escola educativa é módulo separado.

## Produto e monetização
**Missão social proposta pelo fundador:** preservar valor real gratuito em **Listas** e **Escola**, principalmente para iniciantes e profissionais individuais; participação comunitária e educação sem degradar segurança ou especificação correta.
**Hipóteses de receita a experimentar (não aprovadas):**
- Obras profissionais: múltiplos escopos, cronograma, equipes e alocações
- Fluxo de solicitações, aprovações, compras, recebimentos e trilhas
- Diário colaborativo, relatórios, histórico e indicadores
- Escola: cursos avançados, certificações, formação corporativa, patrocínios ou parcerias éticas, mantendo núcleo educacional acessível
- Possíveis planos por espaço/organização ou obra ativa; avaliar custo por equipe/usuário sem cobrar do trabalhador apenas por ser convidado
A nuvem pessoal básica pode permanecer gratuita; número de listas e preços dependem de medida de uso/experimentos. Nunca inferir que oportunidade comercial já virou paywall implementado.

## Sequência de validação recomendada
1. Definir uma matriz de casos concretos: eletricista sozinho; empreiteiro JS com Equipe A; Escola X com múltiplos prestadores; trabalhador sem conta; funcionário que troca de equipe.
2. Criar **motor puro de cadastro e alocações em laboratório separado**, com testes de consistência e histórico; nenhum SQL sem contrato revisado.
3. Ensaiar autorização por obra e escopo entre duas contas antes de integrar UI ou divulgar colaboração.
4. Integrar Obras/Escopo somente depois que o motor próprio estiver validado; Listas e seu modal aprovado permanecem independentes.
5. Testar ofertas comerciais com entrevistas e uso real; não impor quotas antes de verificar retenção e custos.

## Perguntas ainda abertas, não presumir
- Prestador é exclusivamente outro workspace TEREON ou também pode ser cadastro externo? **Proposta: ambos**, sem equivalência automática.
- Quem cadastra/atualiza pessoas e quem tem acesso ao telefone? Quais contatos são estritamente necessários?
- Uma equipe pode pertencer a dois prestadores simultaneamente? Como preservar movimentações no tempo?
- Alocação em pai cobre subetapas automaticamente para visualização operacional? **Não equiparar a permissão digital.**
- Quem pode confirmar/encerrar alocação? Como representar planejada versus ativa?
- Como o indivíduo mantém seus registros profissionais quando sai da empresa?
- Qual é o mínimo grátis de Escola e qual oferta paga é comprovadamente valiosa?

**Status:** proposta documental e desenho de contratos, sem implementação de tabelas, contas, convites, alocações nem telas nesta rodada.
