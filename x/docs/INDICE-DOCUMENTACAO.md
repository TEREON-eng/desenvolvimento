> **Evolução de 12/11/2026 — X.0.3.43:** lista com visualização por insumo/etapa e consolidação de lances por composição, relatórios Compras/Completo/Execução implementados na branch `desenvolvimento`; publicação e homologação não confirmadas. [Contrato](CONTRATO-LISTAS-AGRUPAMENTO-E-RELATORIOS-2026-11-12.md) · [Histórico](CHANGELOG.md).\n\n# TEREON X — Índice oficial e situação documental

> **ATUALIZAÇÃO DE FOCO — 10/11/2026:** leia primeiro [Estado vigente](ESTADO-VIGENTE-10-11-2026.md), [Plano 17/11](FOCO-TESTE-CAMPO-17-11-2026.md) e [História Vol.03](HISTORIA-TEREON-X-VOLUME-03.md). Listas é o núcleo do teste. Obras/Diário/Empreiteiros permanecem laboratórios. Arquivos históricos são memória do percurso, não regras novas.

**Base: 07/11/2026 · Situação revisada: 09/11/2026**

## Leia primeiro para continuar em nova conversa
- **[Contratos vigentes e rastreabilidade](CONTRATOS-VIGENTES.md):** fonte normativa das decisões atuais, responsabilidades, evidências e precedência sobre trechos históricos.
- **[Retomada 09/11](RETOMADA-2026-11-09.md):** versão X.0.3.29, decisões aceitas, pendências e sequência de trabalho.
- **[Revisão geral de contratos 09/11](REVISAO-GERAL-CONTRATOS-2026-11-09.md):** evidências verificadas, divergências, riscos P0–P2 e checklist de aceite.
- **[Guia visual atualizado](GUIA-VISUAL-TEREON-X.md):** tema global, cabeçalho, seleção/ações de listas, componentes e modais.

- **[Validação técnica 09/11](VALIDACAO-TECNICA-2026-11-09.md):** inspeção de CI, Listas/nuvem, RLS, riscos e provas que ainda faltam.

## Documentação viva no repositório X (branch `desenvolvimento`)
1. [Mestre TEREON X](MESTRE-TEREON-X.md) — visão, decisões, estado implementado e pendências.
2. [Universo — desenho de produto](PRODUTO-UNIVERSO.md) — obra individual, múltiplas empresas, papéis e evolução.
3. [Modelo gratuito e pago](MODELO-GRATUITO-PAGO.md) — matriz de hipóteses para aprovação.
4. [História Vol.02](HISTORIA-TEREON-X.md) — continuidade do Diário de Desenvolvimento.
5. [Arquitetura modular](../ARQUITETURA-MODULAR.md) — responsabilidade e contratos.
6. [Mapa de módulos](MAPA-MODULOS.md) — inventário técnico.
7. [Auditoria dos motores](AUDITORIA-MOTORES-2026-11-07.md) — débitos e divergências verificados em 07/11.
8. [Testes de regressão](TESTES-REGRESSAO.md) — critérios de aceite.
9. [Histórico de mudanças](CHANGELOG.md) — o que mudou de fato.
10. [Laboratório de identidade](../identidade/README.md), [laboratório de compartilhamento](../compartilhar-usuarios/README.md).
11. [Fichário X](../fichario-x/) — snapshots de laboratório; governança real em planilhas no Google Drive.

## Arquivos históricos — preservar sem substituir automaticamente
- Séries `Documento-Mestre-TEREON-v3.*` (legado TEREON, evolução e decisões anteriores).
- `TEREON-Diario-de-Desenvolvimento-Volume-01.md/pdf` (origens até 23/10/2026).
- `Plano-de-Negocios-TEREON-v0.0.md/pdf` (hipóteses de 21/10/2026).
Esses registros existem na Biblioteca histórica do usuário. Não são páginas técnicas atuais do X e não foram sobrescritos; este índice serve de ponte para a evolução.

## O que é decisão, não implementação
- Universo/Obras: **motor e laboratório implementados, sem homologação completa**. Solicitações: **apenas concepção, não implementado**.
- Pacotes comerciais e preço: **hipóteses**.
- Controle de direitos de assinatura e cobrança: **não implementado**.
- Compartilhamento real com duas contas: **não homologado**.
- Homologação das fichas técnicas: **não realizada**.

## Regra para documentação futura
Uma mudança relevante deve: (i) entrar no changelog técnico com branch e evidência; (ii) atualizar mestre/arquitetura quando alterar contratos; (iii) entrar no diário com data, contexto e aprendizado; (iv) ajustar matriz de produto/negócio se impactar planos. Nenhum documento antigo é apagado para dar impressão de continuidade.

## Fechamento documental de 09/11/2026
Referência visual atual: **X.0.3.29**, considerada boa pelo fundador em Minhas listas. O aceite é parcial. CI atual, deploy, PWA, segurança real entre contas e fichas homologadas estão pendentes. Manter o histórico 07–08/11 sem apresentá-lo como situação vigente.


## Situação da auditoria incremental em 09/11/2026
A [validação técnica](VALIDACAO-TECNICA-2026-11-09.md) inclui leitura do código Listas/nuvem, conferência de quatro políticas RLS de `x_cloud_lists`, risco de cópia remota excluída permanecer em outro aparelho, testes não cobertos e alerta de segurança do Auth. **Sem execução confirmada de CI nem homologação E2E**. A execução prática e a reconciliação segura permanecem próximas prioridades. Nenhum documento histórico foi apagado.


## Evolução de 10/11/2026
- [Contrato de etapas entre Listas e Obras](CONTRATO-ETAPAS-LISTAS-OBRAS-2026-11-10.md) — diferencia rótulos derivados e etapas persistentes do escopo; integração futura sob confirmação.
- A versão **X.0.3.30** em `desenvolvimento` implementa limpeza de etapas vazias **em Listas** e validação antecipada de payload para contas; CI e aceite real pendentes. `main` não atualizada nesta etapa.


## Novas referências — 10/11/2026
- [Capacidade e armazenamento Supabase](CAPACIDADE-ARMAZENAMENTO-2026-11-10.md): plano Free verificado, uso atual, limites reais versus limites do nosso aplicativo, política de monitoramento.
- [Escopo hierárquico de Obras](ESCOPO-HIERARQUICO-OBRAS-2026-11-10.md): etapa mãe/subetapa, origem de rótulos, associação direta, sugestão progressiva e preservação de escopo.


## Correção de 10/11 — escopo de Obras em três níveis
A estrutura vigente de **Obras** é **Escopo → Etapa → Subetapa**; não utilizar como modelo atual a árvore de dois níveis presente nos capítulos históricos. O motor independente `x/universo/obras/escopo-motor.js` é laboratório sem integração com banco/Lista/modal. A política de nuvem paga e número de listas grátis permanece **hipótese comercial**, não regra implementada.


## Pessoas e equipes — proposta 10/11/2026
- [Pessoas, Prestadores, Equipes e Alocações](PESSOAS-EQUIPES-ALOCACOES-2026-11-10.md) — desenho de entidades, vínculos temporais, permissões independentes e casos de trabalho na Escola X.


## Diário — laboratório mobile (10/11/2026)
- [Programação de equipes pelo Diário de Obras](DIARIO-PROGRAMACAO-EQUIPES-2026-11-10.md): contratos, diferença entre planejamento/presença/execução e roteiro de ensaio móvel. Laboratório isolado `/x/universo/diario/lab.html`; presença em Preview e CI completo ainda não confirmada.


## Obras: navegação e PDF (10/11)
- A navegação `x/universo/obras/lab.html` conduz a Empreiteiros, Diário e Visitas (esta última somente preparação). O Diário possui impressão de **um dia** para salvar como PDF pelo navegador; não gera arquivo/sincronização automaticamente.
- Referências: [Diário](DIARIO-PROGRAMACAO-EQUIPES-2026-11-10.md), [Pessoas/Equipes](PESSOAS-EQUIPES-ALOCACOES-2026-11-10.md), [Contrato vigente](CONTRATOS-VIGENTES.md).


## Auditoria preventiva do visual (10/11/2026)
- [Auditoria do layout de Obras, Diário e Empreiteiros](AUDITORIA-LAYOUT-OBRAS-2026-11-10.md): incongruências de interface corrigidas, lista de riscos P0–P2, proteção de dados locais, roteiro de aceite e limites de homologação. Camada CSS compartilhada com temas Claro/Escuro/TEREON.


## Alteração no Cadastro Profissional — 10/11
No laboratório de Empreiteiros, o núcleo atual passa a ser **Empreiteiro + Funcionários ativos/desligados**, com inclusão e edição em modais e histórico de status. Equipes anteriores permanecem como legado consultável, sem associação automática a funcionários. Todos os módulos de Obras usam agora cabeçalho e breadcrumb compartilhados. Ver [Mestre](MESTRE-TEREON-X.md), [Cadastro Profissional](PESSOAS-EQUIPES-ALOCACOES-2026-11-10.md) e [Guia Visual](GUIA-VISUAL-TEREON-X.md).


## Superauditoria integral — 10/11/2026
- [Superauditoria do TEREON X](SUPERAUDITORIA-TEREON-X-2026-11-10.md) — revisão de repositório e contratos, 20 achados P0–P2, matriz de maturidade, controles de RLS, testes, PWA, Listas, Catálogo, Obras/Diário/Pessoas e plano de release. **Não é CI verde nem homologação visual.**


## Teste de campo de Listas — evidências de 10/11
- [Auditoria do núcleo Listas para 17/11](AUDITORIA-NUCLEO-LISTAS-17-11-2026.md): estados executado/inspecionado/pendente, regressões corrigidas, falha remota reproduzida e plano de aceite.
- [Matriz das seis fichas técnicas para 17/11](MATRIZ-FICHAS-17-11-2026.md): Condutor, Eletroduto e Curva com atributos fundamentais não obrigatórios; sem homologação do catálogo. **Este é o principal bloqueio de especificação técnica.**

## Retomada de Condutores BT — 10/11
- [FT_COND-001: inventário preliminar de detalhes e decisão pendente](RETOMADA-FT-COND-001-2026-11-10.md). Sem validação técnica final; planilha oficial ainda não alterada em conteúdo.

## Escola inaugural e arquitetura FT_COND-001 — 10/11
- [Escola aberta desde o início e curso Como usar o TEREON](ESCOLA-INAUGURAL-2026-11-10.md): decisão e currículo mínimo, separado do código ainda não implementado.
- FT_COND-001 com arquitetura **única** aprovada; atributos e compatibilidades continuam em revisão técnica.

## FT_COND-001 experimental — 10/11
- [Importação experimental da ficha de Condutores e estresse de 648 combinações](AUDITORIA-FT-COND-001-2026-11-10-LAB.md): código na branch desenvolvimento, sem edição da origem, sem homologação nem teste móvel comprovado.
