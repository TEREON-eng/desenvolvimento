# TEREON X — Capacidade e gestão do armazenamento
**10/11/2026 · Dados reais consultados em modo somente leitura no Supabase + documentação oficial**

## Plano e utilização atual verificados
- Organização: `TEREON-app`; plano retornado pela API `free` / `tier_free`.
- Projeto: `TEREON X`, ativo, referência `kjikzdpqejhsgutakigw`.
- Consulta `pg_database_size(current_database())`: **12.072.627 bytes (~12 MB mostrados pelo PostgreSQL)**.
- `auth.users`: **2 contas cadastradas**; `public.x_cloud_lists`: **6 listas**; `public.x_works`: **5 obras**.
- `pg_total_relation_size('public.x_cloud_lists')`: **48 kB**; soma de JSON `items+stages` nas listas: **1.724 bytes**. Amostra muito pequena para extrapolar tamanho médio de lista em produção; o banco total inclui schemas, Auth, índices e outras estruturas.
- Esses números são fotografia pontual; o consumo mensal de egress, MAU real e Storage de arquivos **não foi recuperado** por esta consulta SQL.

## Cotas Free da plataforma (documentação oficial Supabase consultada)
| Item | Free |
| --- | --- |
| Banco de dados | 500 MB por projeto incluídos |
| Usuários cadastrados | Sem limite total fixo anunciado; importante é MAU |
| Usuários ativos mensais (MAU) | 50.000 incluídos |
| Armazenamento de arquivos (Storage) | 1 GB |
| Egress uncached / cached | 5 GB / 5 GB por ciclo |
| Projetos ativos Free | 2 |
| Pausa por inatividade | Possível após ~1 semana sem atividade |
| Backups diários gerenciados | Não incluídos no Free |

**Fontes:** https://supabase.com/pricing e https://supabase.com/docs/guides/platform/billing-on-supabase e https://supabase.com/docs/guides/platform/database-size.
**Distinção crítica:** 500 MB é cota de banco, não limite de seis listas, nem teto fixo de usuários. Existem também limites físicos de disco (documentação Supabase menciona disco fixo de 2 GB e proteção de somente leitura próximo a 95%). Não confundir tamanho lógico da base com disco efetivo/WAL.

## Limites que nós criamos, e não que o plano exige
- `x/listas/nuvem/motor.js`: **300 materiais por lista**, `items+stages` em JSON serializado até ~110.000 caracteres, nome até 160 caracteres e quantidade finita/positiva. O banco limita 300 materiais e tamanho total do JSON em bytes.
- `x/listas/servico.js`: limites de nome e quantidade alinhados na X.0.3.30; para conta autenticada o adaptador remoto valida novas/alteradas antes de confirmar cache. Visitante continua local sem teto remoto.
- Esses limites **são técnicos provisórios do laboratório**, não cotas contratuais, não se relacionam a cobrança e não determinam o número total de listas da conta.

## Como gerenciar
1. Consultar **Supabase Dashboard → Organization → Usage** para egress, Auth MAU e Storage; e **Project → Database** para ocupação de disco e diagnóstico. Não apresentar `pg_database_size` como medidor universal de todos os serviços.
2. Monitorar inicialmente tendências semanais e alertar antes de aproximar-se dos limites. Como **política proposta**, revisão aos 50%, atenção aos 70%, ação planejada aos 85% de banco/egress/storage; não tratar estes números como limites do plano.
3. Não apagar listas antigas, fotos ou registros para liberar espaço sem política de retenção, exportação e backup. Duplicação e snapshots consomem dados extras.
4. Antes do uso comercial com obras reais, estabelecer exportações/backup restaurável e testes de recuperação; o Free **não inclui backups diários gerenciados** e pode pausar por inatividade.
5. Fotos e anexos futuros tenderão a crescer mais rapidamente do que listas em JSON; manter arquivos no Storage, vinculados por referência, sem guardar fotos grandes diretamente em tabelas JSON.
6. Medir payload real de lista representativa e taxa de uso nos testes de campo antes de estimar capacidade (quantidade de listas por MB e usuários por projeto).
7. **Sem necessidade de upgrade agora**, pela ocupação atual observada; decisão de plano pago condicionada a uso real, backups, disponibilidade e exigência operacional.

## Observação de segurança e plano
Um aviso do advisor sobre proteção de senhas vazadas desativada foi observado na auditoria. A página atual de preços indica que essa proteção não está disponível no Free. **Não instruir ativação como se fosse uma opção habilitável no plano atual.** Planejar medidas alternativas e avaliar upgrade quando necessário.

**Estado:** documento de planejamento, sem alteração de conta, billing, quotas, usuários ou dados.
