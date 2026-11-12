> **ATUALIZAÇÃO VIGENTE — 12/11/2026, X.0.3.51, branch `desenvolvimento`:** o visual das listas X.0.3.50 foi considerado adequado pelo fundador para uso e ajustes de campo. A prioridade agora é **ficha experimental de Eletrodutos (FT_INFRA-001)** e relatórios de **Compras, Completo e Execução** em WhatsApp/texto, e-mail e PDF. A ficha original do Fichário não foi alterada; o código usa cópia **não homologada**. O plano restrito de 17/11 permanece, sem declaração de produção publicada. [Revisão técnica e roteiro](REVISAO-ELETRODUTO-E-RELATORIOS-2026-11-12.md) · [Changelog](CHANGELOG.md). A tabela X.0.3.30 adiante é **histórica de 10/11**, não estado atual.

# TEREON X — Estado vigente e precedência documental
**10/11/2026 · Página de orientação obrigatória; não substitui documentação histórica**

## A. O alvo imediato — teste de campo em 17/11
É um **teste experimental restrito**, não lançamento comercial. Produto de referência: **Listas de materiais**, apoiado por Catálogo/Fichas, especificação progressiva, modal técnico aprovado, salvamento e exportação/compartilhamento. [Plano operacional do dia 17](FOCO-TESTE-CAMPO-17-11-2026.md).

## B. As quatro classificações
- **VIGENTE / foco 17:** regra consolidada do núcleo de Listas e condição para teste.
- **LABORATÓRIO:** código para experimentação, incluindo Obras/Escopo, Empreiteiros/Funcionários e Diário; não é compromisso para o dia 17.
- **FUTURO / hipótese:** Escola como plataforma de cursos, gestão colaborativa de obras, equipes, solicitações/ERP, receitas e planos; exige validação.
- **HISTÓRICO:** registro fiel de como chegamos aqui. A época pode ter nomes, prioridades e estruturas que foram superados.

## C. Hierarquia da verdade
1. **Contratos vigentes e decisões mais recentes**, interpretados à luz desta página de foco.
2. **Evidência verificada** (código/SQL/teste/visual/uso real) com estado explicitado.
3. **Mestre e mapa de módulos** atualizados; documentos por domínio.
4. **História, changelog, retomadas antigas** registram acontecimentos, não redefinem o estado vigente por terem sido escritos primeiro.
5. Se houver contradição, não apagar o passado: adicionar marcação **SUPERADO EM / SUBSTITUÍDO POR**, com referência e motivo.

## D. O que foi superado ou reposicionado
| Referência antiga | Situação agora |
| --- | --- |
| DataFluxx | Nome histórico anterior a TEREON |
| TEREON legado | Consulta e fonte histórica; **TEREON X é desenvolvimento ativo** |
| “Universo” como nome da navegação | Nome técnico/histórico; **Obras** é o rótulo proposto/atual no módulo de gestão |
| Árvore de dois níveis | **SUPERADA** por **Obra → Escopo → Etapa → Subetapa** |
| Gestão de Obras como prioridade imediata | **LABORATÓRIO paralelo**, não parte do teste 17 |
| Equipe como entidade inicial do cadastro | **SUPERADA** por **Empreiteiro → Funcionários** com situação Ativo/Desligado; Equipes voltarão como relação |
| Programação = execução | **INCORRETO**: programar, executar, concluir e justificar ausência são registros distintos |
| Pendente/Aprovada/Em compras como status de Lista | **FUTURO Motor de Solicitações**, não status de sincronização |
| X.0.3.29 de 09/11 como versão atual | **HISTÓRICO**; código da branch reporta X.0.3.30, sem homologação integral do que foi acrescentado depois |
| “CI configurado” = “CI passou” | **INCORRETO**; conferir o run real |
| Armazenamento Supabase Free determina nº de listas grátis | **INCORRETO**; infraestrutura e regras comerciais são coisas diferentes |

## E. Cinco contratos invioláveis
1. Nenhuma alteração pode retirar funcionalidade aprovada; o modal `#addDialog` e a dinâmica de tags são protegidos.
2. Fichas governam nome técnico, opções, condições e obrigatoriedade; o motor **sugere** e o profissional **confirma**.
3. Dados nunca são apagados ou migrados em silêncio; sync local/nuvem deve sinalizar estado real.
4. Listas e Escola mantêm **utilidade gratuita verdadeira**; cobrar por gestão profissional é hipótese, não restrição implementada.
5. Novas frentes não atrasam o teste de Listas em 17/11 nem entram no mesmo motor por conveniência.

## F. Limites da evidência
Em 10/11 a superauditoria encontrou descompasso `header.js?v=8` no teste contra `v=9` em Obras; CI completo e deploy recente ainda não confirmados, bem como teste entre duas contas/dispositivos e revisão visual no aparelho. Nada disso deve ser classificado como resolvido por este documento.

**Fontes:** [Mestre](MESTRE-TEREON-X.md), [Contratos](CONTRATOS-VIGENTES.md), [Superauditoria](SUPERAUDITORIA-TEREON-X-2026-11-10.md), [Diário narrativo Vol.03](HISTORIA-TEREON-X-VOLUME-03.md).
