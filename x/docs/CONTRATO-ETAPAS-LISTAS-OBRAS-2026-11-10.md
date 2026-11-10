# TEREON X — Contrato de etapas: Listas e Obras
**10/11/2026 · Proposta de integração de produto · Implementação restrita à limpeza de etapas em Listas X.0.3.30**

## 1. Duas entidades com finalidades diferentes
- **Etapa da Lista:** rótulo usado pelo profissional para organizar materiais de *uma lista*. Ex.: `QD1`, `Sala 03`, `Infraestrutura`. Nas listas atuais, é derivada dos lançamentos: se nenhum material usa o rótulo, este sai automaticamente das sugestões da lista. Isso não apaga materiais, tampouco altera outra lista.
- **Etapa da Obra:** parte do **escopo** planejado ou reconhecido durante a execução, com identidade estável, obra de origem, nome, tipo/ordem e possível histórico. Não depende da quantidade de materiais em nenhuma lista; não deve desaparecer ao editar ou excluir lançamentos. **Motor e banco ainda NÃO implementados.**
- **Atividade/serviço:** execução real, possivelmente por dias, responsável e registros/fotos. Não é sinônimo obrigatório de etapa, e Diário não altera listas automaticamente.

## 2. Como a etapa da obra aparece
Duas portas complementares:
1. **Cadastro no escopo da Obra:** profissional autorizado cria uma etapa de planejamento (`Pavimento térreo > Sala 03`, `QD1`, etc.), podendo existir sem lista ou materiais.
2. **Sugestão a partir de uma Lista vinculada:** ao vincular uma lista à obra, o sistema lê rótulos de etapa presentes em seus materiais e propõe *etapas observadas*. O gestor escolhe **associar a uma etapa existente**, **criar uma nova etapa na obra** ou **deixar somente na lista**. Nunca deduz por igualdade textual que duas etapas são a mesma entidade.

**Regra fundamental:** a origem não é promovida automaticamente a escopo aprovado. Uma sugestão oriunda de lista não significa etapa concluída, iniciada, solicitada, comprada ou executada.

## 3. Modelo conceitual (sem migração ou SQL executado)
`obra.id` → `etapa_obra.id` (UUID, escopo) ← `vinculo_etapa_lista` (`list.recordUid`, chave de etapa/lista, autoria da associação). A etapa local atual é texto, não UUID. Antes do vínculo definitivo, definir identidade estável para a etapa da lista ou uma referência versionada/snapshot; não usar somente nome como chave persistente.

Campos mínimos propostos para etapa da obra: `id`, `work_id`, `title`, `description?`, `sort_order?`, `created_by`, `created_at`, `archived_at?`. Relacionamentos e permissões ficam em motor independente; RLS por obra e espaço. Etapa pode existir sem material; arquivar em vez de destruir histórico. Não confundir etapa com local/ambiente, disciplina ou atividade: associação e hierarquia são hipóteses a validar.

## 4. Alterações de Lista não destroem o escopo
- Último item da etapa apagado na Lista → rótulo some **daquela Lista**, sem tocar na etapa da Obra.
- Material muda de etapa na Lista → vínculo de escopo existente não é movido silenciosamente; marcar referência como pendente de revisão, se houver vínculo operacional.
- Lista vinculada é excluída ou duplicada → obra não perde etapas; a referência é encerrada/atualizada por ação explícita. Cópia é outra lista.
- Duas listas usam `QD1` → sugerir correspondência com etapa `QD1` da obra, mas pedir confirmação; nomes iguais podem denotar contextos diferentes.
- Obra não vinculada / lista avulsa → criar e especificar materiais normalmente, sem exigir cadastro prévio.

## 5. Nomenclatura de produto
**Proposta do fundador (10/11):** chamar o acesso principal de **Obras** em vez de **Universo**. Recomenda-se adotar “Obras” como nome de navegação e manter `x/universo/` como caminho técnico histórico até eventual migração separada, para não quebrar links/contratos. Ainda não houve alteração visual nem de rotas.

## 6. Recorte recomendado
**Já implementado na X.0.3.30:** limpeza automática de etapas não utilizadas **apenas em Listas** após inclusão, edição, duplicação e remoção; sem varredura destrutiva em listas legadas na leitura.

**Próxima fase, não implementada:** desenhar o Escopo da Obra e a entidade Etapa da Obra em laboratório próprio; vínculo e sugestão após resolução de identidade, autoria e permissões. Testes devem assegurar que excluir último material numa lista NÃO exclui uma etapa da obra.

**Perguntas ainda abertas:** fases versus ambientes versus serviços; etapa manual sem materiais; quem pode promover sugestão a etapa oficial; como lidar com renomeação e histórico; uma etapa pode ser compartilhada entre várias listas? Não antecipar essas escolhas na estrutura definitiva.


## 7. Refinamento aprovado em 10/11 — hierarquia e persistência
O fundador detalhou: **Quadros elétricos** pertence ao escopo da Obra; **QD1** pode nascer provisoriamente na Lista e ser associado como subetapa sob Quadros elétricos, após confirmação. Materiais sem subdivisão podem ser associados diretamente a Quadros elétricos. Uma etapa **cadastrada na Obra nunca desaparece automaticamente**; um rótulo **temporário da Lista desaparece quando fica sem materiais**, conforme X.0.3.30. Para Lista já vinculada à Obra, mostrar etapas da árvore do escopo como sugestões antes de sugerir novas; a implementação do vínculo ainda aguarda identidade estável/RLS. Ver [Escopo hierárquico](ESCOPO-HIERARQUICO-OBRAS-2026-11-10.md).
