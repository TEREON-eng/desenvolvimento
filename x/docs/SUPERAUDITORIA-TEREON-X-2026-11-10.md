# TEREON X — Superauditoria de arquitetura, contratos e produto
**Data da revisão: 10/11/2026 | Repositório: `TEREON-eng/desenvolvimento` | Branch: `desenvolvimento` | Escopo: somente TEREON X**

> **Natureza do documento:** auditoria por inspeção do código e documentos, leitura de metadados RLS do banco e confrontação dos testes declarados. **Não é homologação visual, execução completa do GitHub Actions, prova de Preview publicada ou ensaio A/B no celular.** Não houve alteração do código operacional nesta rodada. Os registros TEREON antigos não foram adotados como normas.

## 1. Resumo executivo
**Arquitetura promissora, mas sistema ainda NÃO pronto para considerar as funções colaborativas de Obras como operacionais.** A separação de motores, as fichas como fonte de regras técnicas, os modais aprovados de Listas, o conceito de escopo em três níveis e o RLS atual fornecem uma boa base. O principal problema não é falta de novas funções, mas o descompasso entre **código, testes, dados persistidos, autorização, experiência e publicação**.

### Fotografia verificada
- `desenvolvimento` está **838 commits ahead / 0 behind** em relação a `main` (comparação feita em 10/11); isso não é defeito isolado, mas exige lançamento controlado por versão e regressão.
- `x/version.json` continua `x.0.3.30`, build 10/11/2026. `x/sw.js` usa cache `tereon-x-lab-0.3.30` e **não faz pré-cache das páginas novas do Diário, Empreiteiros e Visitas**.
- Workflow `.github/workflows/testes-tereon-x.yml` declara **24 comandos Node**, executando em push para `desenvolvimento` e PR para `main`. Não se obteve prova de execução/resultado no GitHub Actions: **não registrar “CI verde”**.
- Banco Supabase: foram consultadas nove tabelas públicas `x_*` (`x_cloud_lists`, `x_list_shares`, `x_profiles`, `x_record_identities`, `x_record_relations`, `x_work_access`, `x_works`, `x_workspace_members`, `x_workspaces`). Todas tinham `relrowsecurity=true` e leitura para `anon` negada na metainformação; políticas consultadas impõem titularidade ou participação em Obras/Compartilhamentos/Relações. **Não é teste com tokens distintos, grants operacionais end-to-end ou prova de segurança total.**
- Os novos laboratórios de **Empreiteiros, Funcionários, Diário, Escopo e sugestões** não constituem um cadastro colaborativo remoto: gravações locais sem vínculo autorizado de conta/obra. `Relatórios de Visita` ainda é apenas página “Em preparação”.
- UI de Obras, Empreiteiros, Diário e Visitas tem cabeçalho comum e breadcrumb no código, mas não houve verificação visual/teclado/PDF real em dispositivo. As regras e modais aprovados de **Listas** não foram alterados nesta rodada.

## 2. Achados classificados por prioridade

| ID | Pri. | Achado e evidência | Risco/ação necessária |
|---|---|---|---|
| **A-01** | **P0 — comprovado** | `x/tests/cabecalho.test.cjs` ainda exige literalmente `/x/components/header.js?v=8`; `x/universo/obras/lab.html` agora carrega **v=9**. | Teste do cabeçalho reprovará para Obras enquanto fixture estiver obsoleta. Atualizar a expectativa **após confrontar a versão canônica nas outras páginas**; não alterar comportamento aprovado para satisfazer teste legado. |
| **A-02** | **P0 — evidência ausente** | 24 testes declarados, mas nenhuma execução completa dos últimos commits ou saída do workflow foi comprovada. | Validar Actions com SHA exato e corrigir regressões antes de considerar release. Workflow configurado não significa teste executado. |
| **A-03** | **P0 — governança** | `desenvolvimento` ahead de `main` por 838 commits, `version.json` sem atualização posterior à X.0.3.30 apesar de novos laboratórios. | Definir snapshot de release, revisão de diffs, tag e plano de promoção/rollback. Não publicar uma leva cumulativa sem evidência. |
| **A-04** | **P0 — antes da colaboração real** | Empreiteiros/Funcionários e Diário gravam `localStorage` compartilhado pelo navegador/origem, sem isolamento por conta ou autorização por obra. | Não registrar pessoas/funcionários reais nem apresentar esse laboratório como sistema corporativo. Criar contratos de titularidade, autorização, LGPD, RLS e migração explícita. |
| **A-05** | **P1 — sincronização** | `x/listas/integracao.js.refresh()` atualiza listas presentes na nuvem, mas não reconcilia listas que desapareceram remotamente. | Cópia excluída em outro aparelho pode permanecer como sincronizada; projetar tombstones/reconciliação preservando pendências antes de limpar cache automaticamente. |
| **A-06** | **P1 — perdas/conflito** | `deleteList()` exclui primeiro na nuvem, depois grava exclusão local. Falha de escrita local após delete remoto exige recuperação; UI pode conservar registro antigo. | Teste de falha entre as duas operações, idempotência de retomada e status explícito. Não simplesmente apagar cache para 'corrigir'. |
| **A-07** | **P1 — etapas** | Em Listas, etapas são rótulos derivados dos itens (`reconcileStages`); em Obras, entidades cadastradas de `Escopo → Etapa → Subetapa` devem persistir vazias. Motor hierárquico existe isoladamente. | Não tratar rótulos temporários de lista como FK ou escopo definitivo; identidade estável, promoção explícita, controle de autoria e histórico antes de vincular. |
| **A-08** | **P1 — pessoas/histórico** | Empreiteiros agora cadastra funcionários Ativo/Desligado, mas o Diário ainda programa **equipes** demonstrativas. `teams` legado preservado; não há associação temporal pessoa↔equipe. | Não inferir que funcionário pertence à Equipe A. Definir entidades, versões de composição e nomes congelados nos eventos do Diário. |
| **A-09** | **P1 — histórico** | Cancelar programação a retira da visão `forDay`; apontamentos já existentes continuam armazenados, mas podem desaparecer do relatório de data. | Diário oficial precisa mostrar “cancelado/corrigido” sem esconder trabalho anteriormente confirmado. Definir visão de auditoria e status imutáveis. |
| **A-10** | **P1 — ciclo de tarefa** | `execucao-motor.js` separa executada de concluída; conclusão em um dia não resolve, por si, futuras datas de uma programação de escopo. | Definir regra de conclusão da atividade versus presença diária e avisar sobre programações futuras, sem cancelamento silencioso. |
| **A-11** | **P1 — publicação/offline** | SW faz pré-cache do shell/Lists e páginas antigas, **não** das novas páginas Obras/Diário/Empreiteiros/Visitas. Versão/cache seguem 0.3.30. | Offline dos laboratórios é incerto, com fallback a página genérica. Atualizar plano de cache/versionamento após decidir suporte offline dessas rotas; testar instalação/atualização. |
| **A-12** | **P1 — autorização** | RLS habilitada nas nove tabelas `x_*` consultadas; as políticas de usuário/owner parecem restritivas. Não foram executadas operações autenticadas A/B/C. | Fazer ensaio legítimo de isolamento, revogação, grants por coluna e acesso ao próprio vs terceiro. Sem alegar privacidade validada só por metadados. |
| **A-13** | **P1 — PDF oficial** | “Gerar PDF do dia” usa `window.print()` sobre dados locais fictícios, não gerador de arquivo assinado. | Testar paginação, acentos, texto longo, fotos futuras, identificação do responsável e cancelamentos. Diferenciar relatório demonstrativo de documento oficial. |
| **A-14** | **P1 — UX real** | Cabeçalho e breadcrumb comuns agora estão referenciados, mas houve CSS acumulado (`lab.css` + `ui-refino.css` + `header.css` + `appearance.css`). | Inspecionar dispositivo e três temas: contraste, foco, viewport estreito, modais empilhados, scroll, impressão. Consolidar CSS após aceite, não durante mudanças funcionais. |
| **A-15** | **P1 — especificação** | Contratos asseguram que ficha governa obrigatoriedade e nome técnico e interpretação não confirma atributo automaticamente; testes do modal usam fixture estática. | Rodar regressão real com fichas, condicionais, remoção de tags e seleção em mobile; fixture não prova interface funcional ou catálogo homologado. |
| **A-16** | **P1 — listas compartilhadas** | Compartilhamento entre contas guarda snapshot, sem editar lista original; status enviado/aceito/revogado tem RLS. Limites de conteúdo diferem dos de persistência da nuvem (100k vs 110k). | Confirmar canal, convite, revogação, cópia, comportamento do destinatário e limites claros, inclusive sem lista de 1+ itens. |
| **A-17** | **P2 — documentação** | Existem diversos capítulos com árvores antigas de dois níveis, “Universo” como nome de menu e versões anteriores; adendos corrigem, mas textos históricos permanecem. | Produzir um único “estado vigente” por módulo com referência a registros históricos, sem apagar história. A hierarquia válida é **Obra → Escopo → Etapa → Subetapa**. |
| **A-18** | **P2 — dados/limites** | Motor local e remoto foram aproximados (160 caracteres, quantidade finita, 300 itens na nuvem), mas restrições de payload/bytes e dados legados ainda exigem ensaio. | Não converter restrição de laboratório em cota comercial. Testar 300/301 itens, payload grande, dados herdados, duplicação e erro antes do salvamento. |
| **A-19** | **P2 — comercial/social** | Grátis deve oferecer valor real em Listas e Escola; cobrança em uso profissional e formação avançada é hipótese. | Não implementar paywall, limite fixo de listas ou cobrança por funcionário sem experimento de campo; Escola como futura plataforma de cursos, conteúdo essencial acessível. |
| **A-20** | **P2 — escopo de MVP** | Diário, cadastro, escopo, Relatórios de Visita, Solicitações, Escola e integração entre módulos estão em estágios muito diferentes. | Priorizar prova de uso real de Listas/Diário e contrato de Pessoas antes de expandir telas. Não confundir “link criado” com módulo pronto. |

### Interpretação das prioridades
- **P0:** bloqueia declaração de “pronto para produção”, integração com dados reais ou promoção à `main`.
- **P1:** deve ter contrato e teste antes de acoplamento entre módulos ou ensaio com risco a histórico.
- **P2:** melhoria importante, mas pode seguir como experimento/documentação sem risco imediato.

## 3. Matriz de maturidade — situação constatada
| Domínio | Fonte de verdade atual | Estado de implementação | Teste/aceite faltante |
|---|---|---|---|
| Home e Listas | Motor `x/listas/servico.js`; `store.js` e `integracao.js` | UI real + sincronização de laboratório; modal técnico preservado | CI real, 2 dispositivos, conflito, exclusão cruzada, fluxo com ficha e offline |
| Catálogo/Fichas | Motor de fichas e snapshots do Fichário | Parcial, fichas em revisão | Auditoria técnica por família, aprovação formal e equivalência com nome técnico |
| Biblioteca e Escola | Páginas/catálogo | Estrutura de navegação; plataforma de cursos **futura** | Oferta educacional, progresso, conteúdo e acesso gratuito |
| Obras | `x_works`, `x_workspaces`, RLS proprietário | Cadastro real de obra/espaço e lixeira; sem escopo persistente | E2E de owner, colaboração e restauração |
| Escopo hierárquico | `x/universo/obras/escopo-motor.js` | Motor puro local; **sem tabela ou UI oficial** | Entidade persistente, IDs, permissões, vinculação lista |
| Empreiteiros / Funcionários | `x/universo/empreiteiros/motor.js` | CRUD local: funcionário ativo/desligado, modal, equipe legada em leitura | RLS, dados mínimos, histórico, acesso, responsável e equipes |
| Diário de Obras | Programação + apontamento separados | Consulta e modais simulados; programação escopo/período e etapa/dia | Históricos, permissões, A/B, revisão, turno/presença, conflito de datas |
| Relatório Diário PDF | `window.print()` | Impressão simulada de obra/dia | Teste PDF real, template e aprovação |
| Relatório de Visita | Nenhum motor real | Apenas rota reservada | Modelo de visita e integração autorizada |
| Compartilhar usuários | Snapshot `x_list_shares` + RLS | Motor e laboratório | Aceite/revogação entre contas, privacidade e retenção |
| Solicitações/Compras | Contratos conceituais | Não implementado como motor isolado | Transições, roles, snapshots e vínculo com ERP |
| Identidade/Acessos | Supabase Auth, `x_profiles`, `x_workspaces`, RLS | Parcialmente operacional; colaboração restrita | A/B/C, acesso por obra e revogação, UX convite |

## 4. Limites técnicos e regras que NÃO podem se perder
1. O TEREON X é a única base ativa; legado só como consulta, não modelo para copiar.
2. **Listas e Escola** devem continuar úteis gratuitamente, com rigor técnico; nenhuma monetização aprovada impede especificação ou exportação básica.
3. **Uma conta pessoal e múltiplos espaços/obras autorizados**; estar alocado como equipe não equivale a permissão digital.
4. **Fichas governam especificações**; qualquer atributo interpretado exige confirmação humana por chip; ambiguidade mantém alternativas.
5. **Modal de materiais** `#addDialog` é protegido; a inclusão e edição nas outras áreas devem ocorrer por modais, mantendo consulta no contexto.
6. **Escopo → Etapa → Subetapa**, com nós cadastrados persistentes e rótulos espontâneos de Lista transitórios. Não criar escopo aprovado automaticamente a partir de texto.
7. **Diário** é consulta de programação por obra/data e apontamento do dia; programado ≠ presença ≠ executado ≠ concluído. Não realização requer justificativa. Subetapa pontual de um dia; Escopo pode abranger vários.
8. **Empreiteiro → Funcionários** é prioritário; estado Ativo/Desligado não é exclusão; associação a equipes vem depois.
9. **PDF** deve distinguir programação, confirmação e justificativa; simulação não substitui Diário formal assinado.
10. Nenhuma mudança visual pode alterar persistência, autorização, listas ou regras de catálogo.

## 5. Ordem recomendada de trabalho (não executar como migração tácita)
**Fase 0 — congelamento e baseline (bloqueios P0):**
- Fixar SHA, versão, evidência do deploy da branch `desenvolvimento` e execução real dos 24 comandos CI.
- Atualizar `cabecalho.test.cjs` para a referência canônica vigente sem adulterar o padrão de cabeçalho; rodar suíte completa.
- Executar regressão prioritária de Listas com ficha/modal, visita e conta, comparar três temas no celular.

**Fase 1 — integridade do laboratório:**
- Formalizar histórico de cancelamentos e conclusão/versões no Diário.
- Definir identidade estável e snapshots de Empreiteiro/Funcionário/Equipe em apontamentos; histórico não muda com renomeações.
- Fechar contratos de escopo persistente, autorização e promoção de etapas observadas; não misturar listas avulsas.

**Fase 2 — integração segura:**
- Modelo de banco/migrações e RLS por espaço, obra e responsável para Empreiteiros/Funcionários/Diário/Escopo.
- Ensaio duas contas A/B com convites/autorização e revogação; regressão de não vazamento.
- Migração **opt-in** dos dados locais de simulação, com preview, validação e rollback; nunca importar por nome ou automaticamente.

**Fase 3 — usabilidade e lançamento:**
- Ensaiar Diário em celular durante dia de obra e em dispositivos de empreiteiros; tempo de lançamento, status, PDF e conexão intermitente.
- Priorizar módulo de Visita somente após modelo de dados e caso de uso de campo.
- Criar ciclo de release `dev → validação → tag → main`, com diffs pequenos, logs e backup.

## 6. Provas que a auditoria NÃO realizou
- Não foi executada a suíte Node num checkout completo (a consulta do repositório ocorre por conector; os testes já existentes têm múltiplas dependências de arquivos e fixtures).
- Não foram obtidos logs de GitHub Actions nem confirmação do Worker/Preview associado ao último SHA.
- Não foi feita inspeção visual da interface renderizada, nem leitura de PDF gerado em celular/desktop.
- Não foram efetuadas escritas, migrações ou manipulação de usuários, listas ou obras reais no Supabase.
- A leitura de metadados RLS não substitui operações com JWT de contas autorizadas distintas.
- Não foi homologada técnica/comercialmente qualquer ficha, fluxo corporativo ou módulo novo.

**Conclusão:** manter o ritmo de desenvolvimento, mas interromper expansões funcionais que dependam dos motores de Cadastro, Diário e Escopo até fechar baseline de teste e histórico. A arquitetura é aproveitável; a prioridade agora é torná-la verificável, rastreável e segura.
