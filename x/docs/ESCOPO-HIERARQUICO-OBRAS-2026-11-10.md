# TEREON X — Hierarquia de etapas e sugestão progressiva do escopo
**10/11/2026 · Decisão conceitual aprovada em conversa, implementação de vínculo/Obras PENDENTE**

## 1. Princípio
A **Obra** possui escopo hierárquico estável, com etapas e subetapas que podem existir sem materiais. Os rótulos que nasceram espontaneamente de uma **Lista** não precisam tornar-se escopo definitivo. A organização surge durante o uso, sem exigir planejamento completo antecipado.

Exemplo:
- Obra: Reforma elétrica da escola
  - Quadros elétricos (etapa cadastrada)
    - QD1 (subetapa candidata observada numa lista, só se promovida explicitamente)
    - QD2 (subetapa cadastrada)
  - Iluminação (etapa cadastrada)

## 2. Etapas com origens distintas e ciclos de vida
1. **Cadastrada no escopo:** persistente, ainda que sem itens, listas ou atividades. Renomear/mover/arquivar com histórico. Nunca excluir automaticamente pelo esvaziamento de lista.
2. **Observada numa lista:** rótulo temporário derivado dos materiais. Quando o último material daquela etapa é removido ou transferido, o rótulo desaparece **da lista**. Não extingue nenhuma etapa cadastrada da obra.
3. **Promovida da lista para obra:** passa a ter UUID, `parent_id`, autoria e histórico do escopo. Depois da promoção, continua existindo mesmo que a lista seja alterada ou excluída.
4. **Materiais associados diretamente à etapa-mãe:** são válidos. O eletricista pode agrupar tudo sob *Quadros elétricos* sem inventar `QD1`; subetapas são opcionais.

**Não confundir** origem da etapa com o estado de execução, compra, aprovação ou aplicação. Nenhum desses estados é inferido.

## 3. Escolha quando a Lista já está vinculada à Obra
No modal `Adicionar item`, **quando houver vínculo de obra autorizado**, sugerir primeiro a árvore do escopo dessa obra. O profissional escolhe `Quadros elétricos`, `Quadros elétricos › QD1` etc. Pode criar um rótulo provisório `QD3` naquela lista sem alterar o escopo. Se não houver vínculo, mantém seleção local por texto, como atualmente.

Ao lançar materiais diretamente em `Quadros elétricos`, a referência é à etapa-mãe; não é obrigatório ter uma folha `QD1`. O rótulo de etapa da lista deve preservar o caminho resolvido por ID quando a integração existir, para evitar ambiguidade de nomes entre pais distintos.

## 4. Lista criada antes do vínculo
Quando o profissional vincular uma lista à obra, mostrar cada rótulo observado e permitir:
- Associar a uma etapa cadastrada existente (inclusive etapa-mãe);
- Propor subetapa sob uma etapa existente e cadastrá-la com confirmação, respeitando permissão;
- Manter rótulo temporário somente na lista.

Exemplo: `QD1` na lista → sugestão de `Quadros elétricos › QD1`; **não** concluir por algoritmo que `QD1` pertence a `Quadros elétricos` sem confirmação. `Quadros elétricos` sem subdivisão também é escolha válida.

## 5. Modelo de dados conceitual
- `work_stage`: `id UUID`, `work_id`, `parent_id UUID?` (da mesma obra), `name`, `source` (manual/promoted), `created_by`, `created_at`, `archived_at?`, `sort_order?`. Profundidade arbitrária é possível, mas **recomendar interface simples de até dois níveis inicialmente**; não fixar limite estrutural sem testes.
- `list_stage_reference`: `list.recordUid`, identidade/chave da etapa na lista, `work_stage_id?`, tipo `temporary/linked`, autoria e revisão. **Ainda não há IDs próprios para etapas na lista**; definir migração não destrutiva antes de vincular.
- Integridade: `parent_id` não pode pertencer a outra obra, nem criar ciclo; exclusão/arquivamento não deve apagar dependentes ou históricos; RLS protege obra e permissões; associação e promoção exigem autorização.
- **Vínculo lista–obra não está implementado**: não criar tabela que simule integração atual nem usar `stage` textual como FK definitiva.

## 6. Critérios de aceite futuros
- Etapa cadastrada sem materiais permanece após excluir todos os lançamentos de listas vinculadas.
- Rótulo temporário sem materiais desaparece somente da lista de origem.
- `Quadros elétricos` aceita materiais associados diretamente, sem criar `QD1`.
- Etapas de mesmo nome sob pais distintos não se fundem por coincidência textual.
- Lista vinculada sugere escopo autorizado; lista avulsa continua independente.
- Subetapa candidata só se torna escopo mediante aceite do responsável.
- Histórico, autoria e acesso não mudam quando se reorganiza a árvore.

## 7. Escopo e produto
O nome visível **Obras** substitui o rótulo de navegação *Universo* em revisão futura, sem renomear pastas `x/universo/` agora. Primeiro desenvolver e testar **modelo de escopo** em laboratório separado; não alterar Listas/Modal aprovado para simular integração inexistente.

Ver também `CONTRATO-ETAPAS-LISTAS-OBRAS-2026-11-10.md`.
