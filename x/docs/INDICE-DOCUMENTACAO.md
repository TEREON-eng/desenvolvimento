> **13/11/2026 · X.0.3.60:** piloto de **Condutores elétricos**: o profissional pode escrever ou ditar uma descrição livre, e o TEREON mostra **propostas a confirmar** no mesmo modal. Reconhecimento de voz depende do navegador, pode exigir rede e permissão; digitação permanece disponível. [Guia de implementação](PILOTO-BUSCA-NATURAL-VOZ-FOTO-2026-11-13.md) · [Changelog](CHANGELOG.md). **Foto futura, não implementada; Cloudflare/CI/Android ainda sem verificação.**

> **13/11/2026 · X.0.3.59:** barra de progresso e área de tags mapeiam **todos os detalhes aplicáveis**, obrigatórios e opcionais. Pendentes ficam apagados e com rótulos curtos (`Ø`, `V`, `#`, `Mat.` etc.), tocáveis para escolher; confirmados exibem valor e **× vermelho** para remover, sem divisória. Tags menores; modal e lógica anterior preservados. [Changelog](CHANGELOG.md). CI e teste móvel ainda pendentes.

> **13/11/2026 · X.0.3.58:** correção de UX no modal Adicionar item: **o texto de cada tag confirmada abre seu detalhe, o × remove**; progresso retorna a indicador compacto, sem setas nem barra navegável. O modal conserva o HTML da versão originalmente aprovada. A comparação de correspondências X.0.3.57 permanece, sem fusão automática. [Changelog](CHANGELOG.md).

> **13/11/2026 · X.0.3.57 — mudança implementada no laboratório:** [Navegação do modal e revisão de correspondências](IMPLEMENTACAO-NAVEGACAO-CORRESPONDENCIA-X0357-2026-11-13.md). Barra clicável mostra obrigatórios **e opcionais**, com setas; aviso `Possíveis correspondências` oferece revisão sem inferir tensão nem somar materiais. Primeiro detector restrito a **Condutores**. `quantificacao.js` sem alterações. **Não homologado em campo nem confirmado no Cloudflare.** [Changelog](CHANGELOG.md).

> **13/11/2026 — Próxima evolução em estudo (sem release):** [Contrato de Correspondência Técnica Progressiva](CONTRATO-CORRESPONDENCIA-PROGRESSIVA-2026-11-13.md) e [15 casos de teste propostos](../tests/fixtures/correspondencia-progressiva-condutores-v1.json) documentam como identificar pedidos incompletos compatíveis sem inferir tensão, misturar cores/bitolas ou somar compras incertas. **Contrato pendente de aprovação, algoritmo não implementado, consolidação comercial X.0.3.56 preservada.**

> **12/11/2026 · X.0.3.56:** Por insumo agrupa visualmente variações da mesma família em cartão recolhível, sem misturar quantidades ou apresentações comerciais; Por etapa permanece igual. A estrutura da ficha de **Condutores elétricos** foi reconhecida como **Consolidada pelo fundador**, mas publicação **Oficial** continua pendente de revisão das opções técnicas registradas. Fichario.xlsm e snapshot original não foram alterados. [Changelog](CHANGELOG.md) · [Matriz de fichas](MATRIZ-FICHAS-17-11-2026.md). Não há deploy/CI móvel comprovado.

> **12/11/2026 · X.0.3.55:** **Consolidado/Em revisão** são etiquetas da **ficha no seletor inicial de Adicionar item**, não dos materiais já lançados. “Consolidado” requer status explícito da ficha; todas as seis do snapshot LAB seguem Em revisão. Contraste de fundo e texto dos botões de detalhes corrigido nos temas Escuro e TEREON, sem alterar a lógica de escolha. [Changelog](CHANGELOG.md). Publicação Cloudflare e teste físico pendentes.

> **12/11/2026 · X.0.3.54:** etiquetas **Consolidado / Em revisão** agora ficam **junto ao título do card principal Por insumo**, por exemplo Condutores elétricos ou Eletroduto. Foram removidas das linhas internas da visão Por etapa. Regras de status e dados não mudaram. [Changelog](CHANGELOG.md). Deploy/validação móvel pendentes.

> **12/11/2026 · X.0.3.53:** listas identificam materiais por etiquetas **Consolidado** (2+ lançamentos no grupo) e **Em revisão** (ficha/registro em revisão ou simulação). Em **Por insumo**, `FT_COND-001` usa **Condutores elétricos** como título da família, mantendo “Condutor isolado”/tipo específico no resumo; **Por etapa** conserva o subtipo. Sem modificar catálogo, cálculos ou dados. [Changelog](CHANGELOG.md). Publicação e aceite em celular ainda não confirmados.

> **ATUALIZAÇÃO FINAL DA RODADA — 12/11/2026 · X.0.3.52:** além da revisão de Eletrodutos LAB e dos canais de compartilhamento X.0.3.51, o relatório Compras agora **soma quantidades legadas idênticas na mesma unidade**, com etapas preservadas e sem conversões automáticas. Visual X.0.3.50 permanece a referência aceita. [Detalhamento](REVISAO-ELETRODUTO-E-RELATORIOS-2026-11-12.md) · [Histórico](CHANGELOG.md). CI/deploy/PDF no aparelho ainda pendentes de confirmação.

> **VIGENTE — 12/11/2026 · X.0.3.51:** referência visual de Listas X.0.3.50 aceita para observação de campo; ficha Eletroduto aprimorada em **snapshot experimental separado**, sem editar Fichario.xlsm; relatórios WhatsApp, e-mail e PDF revisados para Compras/Completo/Execução; workflow ampliado com seis testes. **Nenhuma homologação técnica, CI concluído, PDF em celular ou Cloudflare confirmado.** Leia primeiro [Revisão da rodada](REVISAO-ELETRODUTO-E-RELATORIOS-2026-11-12.md), [Estado vigente](ESTADO-VIGENTE-10-11-2026.md), [Contratos](CONTRATOS-VIGENTES.md), [Foco de 17/11](FOCO-TESTE-CAMPO-17-11-2026.md) e [Histórico](CHANGELOG.md).

> **12/11/2026 · X.0.3.50:** padronizados também os **fundos do último nível** em Por insumo e Por etapa com superfície opaca idêntica. Paleta lousa/neon atenuada, sem alterações funcionais. [Histórico](CHANGELOG.md). Teste visual no celular e publicação Cloudflare pendentes.

> **12/11/2026 · X.0.3.49:** cards de **Por insumo** e **Por etapa** padronizados com fundo verde-lousa translúcido e cabeçalho verde neon translúcido. Revisão restrita a CSS e atualização de cache/versão, sem mudança funcional. [Histórico](CHANGELOG.md). Publicação Cloudflare e teste visual pendentes de confirmação.

> **12/11/2026 · X.0.3.48:** nas visões **Por etapa** e **Por insumo**, o resumo do material prioriza atributos de localização (material, seção, cor, isolação), incluindo PVC somente quando confirmado. Especificação integral preservada ao expandir. [Histórico](CHANGELOG.md). Publicação Cloudflare e teste no celular pendentes.

> **12/11/2026 · X.0.3.47:** sugestões de hierarquia visual aplicadas na Lista: neon TEREON translúcido nas etapas, superfície secundária nos insumos e guia sutil nos lançamentos. Apenas CSS e versão/cache alterados; teste visual no celular pendente. [Changelog](CHANGELOG.md).

> **12/11/2026 · X.0.3.46:** Por etapa passou a exibir **grupos recolhíveis e insumos em linhas compactas**, com nome do material em destaque e especificação secundária. Lançamentos e ações preservados. [Changelog](CHANGELOG.md). Publicação Cloudflare e teste em celular não confirmados.

> **12/11/2026 · X.0.3.45:** corrigida a alternância entre **Por insumo** e **Por etapa**, que estava inacessível por erro de delegação de cliques. Teste de regressão acrescentado; deploy e teste no celular ainda sem confirmação. [Histórico](CHANGELOG.md).

> **Revisão de 12/11/2026 — X.0.3.44:** lançamentos consolidados agora aparecem compactos por insumo, com título expansível e apenas etapas/quantidades abaixo; ações preservadas ao expandir etapa. Visualização Por etapa também compactada. [Histórico](CHANGELOG.md). Publicação Cloudflare e teste no celular ainda pendentes de confirmação.

> **Evolução de 12/11/2026 — X.0.3.43:** lista com visualização por insumo/etapa e consolidação de lances por composição, relatórios Compras/Completo/Execução implementados na branch `desenvolvimento`; publicação e homologação não confirmadas. [Contrato](CONTRATO-LISTAS-AGRUPAMENTO-E-RELATORIOS-2026-11-12.md) · [Histórico](CHANGELOG.md).

# TEREON X — Índice oficial e situação documental

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
