> **ADENDO DE CONTINUIDADE — 14/11/2026:** priorizar antes do ensaio supervisionado de 17/11 validação CI/Cloudflare real, fluxo Android de busca por texto/voz, **tags ?→✓ na mesma tela, Avançar sem painel interno duplicado**, preservação de itens legados, quantidades e relatórios, além de revisão da `FT_COND-001`. A X.0.3.61 alterou **a forma de iniciar a composição**, não a confiabilidade comprovada dos dados comerciais ou a homologação. [Marco de retomada](RETOMADA-TEREON-X-2026-11-14.md).

> **ATUALIZAÇÃO DO ESCOPO DE AUDITORIA — 13/11/2026 · X.0.3.60:** desde a auditoria original, o modal manteve tags e regras e recebeu **interpretação de texto natural e entrada por voz opcional para Condutores**, com confirmação explícita de sugestões. Criado teste de interpretação/voz simulada `x/tests/interpretador-voz-condutores.test.cjs` e integrado ao workflow; **ainda não há evidência aqui de CI integral, microfone real, PWA Android ou Cloudflare publicado**. Para o teste restrito de 17/11, confirmar: permissão de microfone, falhas de rede, fallback manual, diferenças entre “450” e “450/750 V”, não inferir isolamento/encordoamento e não alterar quantificação. As não conformidades P0 da matriz técnica original não desaparecem com uma busca mais intuitiva. [Roteiro](PILOTO-BUSCA-NATURAL-VOZ-FOTO-2026-11-13.md).

> **ADENDO 12/11/2026 · X.0.3.51:** as falhas P0 de Eletroduto sem diâmetro, observadas em 10/11 abaixo, **continuam válidas no snapshot original**, mas foram corrigidas **para simulação no snapshot LAB ativo da branch**. Seleção condicional do fichário, persistência de lista e formato de compartilhamento preservam origem; Compras/Completo/Execução em texto/e-mail/PDF receberam revisão de hierarquia e avisos. Ainda restam P0 de outras fichas, sincronização entre dispositivos, CI completo, PDF efetivo e uso móvel. **Não interpretar o ensaio como homologação técnica ou publicação.** [Detalhes e provas](REVISAO-ELETRODUTO-E-RELATORIOS-2026-11-12.md).

# TEREON X — Auditoria do núcleo Listas para o campo em 17/11
**10/11/2026 · Evidência de código, testes isolados, fixtures e contratos · Branch `desenvolvimento`**

## Resumo
**Não homologado ainda para uma lista técnica de compra sem conferência.** A estrutura do motor de Listas e a dinâmica de tags/modal já possuem testes úteis e foram preservadas. A maior lacuna atual é a **qualidade e cobertura técnica das fichas**. Também há risco de sincronização entre aparelhos e falta de confirmação da publicação/CI real.

### Estados usados neste relatório
- **PASSOU / executado isoladamente:** uma função real do código da branch foi executada com dados simulados; não equivale a interface visual ou servidor.
- **CONFIRMADO POR INSPEÇÃO:** código/JSON/fixture comparados, mas fluxo não executado integralmente.
- **FALHA REPRODUZIDA:** resultado incorreto foi obtido numa simulação controlada.
- **PENDENTE DE E2E:** exige navegador, rede/conta, aparelho ou GitHub Actions com logs; não afirmar aprovação.

## Cobertura por etapa
| Etapa do profissional | Evidência / status | Observação |
| --- | --- | --- |
| Abrir o app, Home, entrar em Listas | Inspeção de rotas e botões; **E2E pendente** | Header e modais usam scripts próprios; confirmar deploy/URL e toque no celular |
| Criar lista | **Passou isoladamente** | Remove espaços do nome, ID/recordUid próprios, até 160 caracteres no serviço |
| Abrir lista em modal | **Fixture exata confirmada por inspeção** | `#addDialog` byte a byte igual à fixture aprovada; clique/navegação ainda dependem de navegador |
| Buscar ficha/escolher material | **Passou carga do catálogo; E2E pendente** | 6 fichas no snapshot, todas Em revisão, zero homologadas |
| Reconhecer e confirmar atributos | **Falha de prontidão técnica reproduzida** | Condutor só exige Tipo e Material; seção/tensão ainda não são obrigatórias; ver matriz específica |
| Exibir condições do catálogo | **Passou isoladamente** | Eletroduto Rígido/PVC exibe diâmetro PVC, esconde aço, mas não exige o diâmetro |
| Formar nome técnico e salvar | **Passou isoladamente para as regras atuais** | Nome formado é tecnicamente incompleto se a ficha não exige dados críticos |
| Editar e duplicar material | **Passou isoladamente** | Identidade de item preservada na edição; duplicação cria nova |
| Excluir item e limpar etapa vazia | **Passou isoladamente** | Se último item migra ou é removido, etapa sem materiais deixa sugestões |
| Exportar sem alterar origem | **Passou isoladamente** | Snapshot retorna cópia; corrigido teste que tentava editar primeiro item após esvaziar lista |
| Compartilhar texto | **Passou isoladamente** | Modelo preserva quantidade, etapas, atributos; rejeita qty zero |
| Gerar PDF de Lista | **Código e caminhos das dependências inspecionados** | PDF depende de pdf-lib, fontkit e fonte; NÃO gerado/inspecionado visualmente nesta rodada |
| Salvar visitante | **Inspeção e testes históricos; E2E pendente** | localStorage/erro de quota e chave histórica precisam ensaio no dispositivo |
| Salvar autenticado na nuvem | **Código e mocks inspecionados; E2E pendente** | Valida antes do cache e usa versão CAS; requer duas contas e dispositivos |
| Excluir no aparelho A, atualizar aparelho B | **Falha reproduzida** | B mantém a lista antiga e a apresenta como sincronizada após refresh; ver prioridade P1 |
| Publicação/Service Worker | **Pendente** | Código reporta X.0.3.30; URL/commit exibidos no celular e CI não confirmados |

## Falhas e prioridades
**P0 / antes de um pedido real:** `FT_COND-001` admite condutor sem seção/tensão; `FT_INFRA-001` admite eletroduto sem diâmetro; `FT_INFRA-002` admite curva sem diâmetro. Quatro outras famílias essenciais não estão no snapshot de seis fichas. Resolver **na fonte Fichário**, não injetando campos imaginados no modal. [Matriz de fichas](MATRIZ-FICHAS-17-11-2026.md).

**P0 / QA de release:** teste `x/tests/cabecalho.test.cjs` estava desatualizado (`v=8` esperado para Obras, `v=9` no HTML), corrigido para usar referência vigente **sem modificar interface**. O teste `x/tests/modulos.test.cjs` removia tudo e depois tentava modificar `snapshot.items[0]` vazio; cenário corrigido para efetivamente exportar uma lista não vazia. **Duas correções de teste no GitHub não provam que a suíte agora passou.**

**P1 / sincronização multiaparelho:** reprodução concreta com dois repositórios locais e nuvem simulada: A exclui remotamente, B atualiza e preserva localmente cópia sem `cloudPending`/`cloudConflict`. É inseguro tratar uma ausência remota como “sincronizado”. **Não apagar cópia B automaticamente**: pode haver dados não enviados. Corrigir por estado explícito de ausência/conflito e ação de usuário, com histórico/reconciliação e testes, após aprovar UX.

**P1 / compartilhamento:** texto é preparado por motor separado, não modifica origem; porém abertura do diálogo, fallback de WhatsApp/e-mail e PDF no aparelho precisam teste real. Estar online não é prova de exportação entregue.

**P1 / experiência:** a fixture do modal se mantém, mas ainda faltam testes do clique e da sequência de tags em celular — incluindo remover obrigatório, trocar ficha, voltar à lista e reabrir, erros de quantidade e busca ambígua.

**P2 / pós-campo:** seleção em lote não aprova listas; Solicitações/Compras são motor futuro. Não confundir status de sincronização com status de processamento.

## Testes implementados nesta rodada
- **Corrigido** `x/tests/cabecalho.test.cjs`: referência de cabeçalho válida em cada página.
- **Corrigido** `x/tests/modulos.test.cjs`: teste de exportação agora dispõe de material a modificar, sem afetar a verificação de limpeza da etapa.
- **Adicionado ao workflow** `x/tests/fluxo-campo-17-11.test.cjs`: integração Node sem dependência de rede para ficha, condição, nome, criação, edição, duplicação, etapa, exportação, texto e fixture do modal.
- **Executado isoladamente por avaliação do código da branch:** carregamento das 6 fichas; fluxo motor de listas (criação/itens/etapas/quantidade), dois resultados de especificação, modelo de compartilhamento e simulação de exclusão remota com dois aparelhos.
- **Não executados e não afirmados como verde:** 25 comandos do workflow no checkout completo, GitHub Actions remoto, navegação real em Android, PDF gerado, Auth A/B e publicação do Worker.

## Sequência recomendada até 17/11
1. **Imediato:** resolver fichas P0 com fonte do Fichário; marcar candidatas ao teste e requisitos de compra; atualização versionada do snapshot após revisão.
2. **Antes de testar no campo:** CI completo com SHA, Preview/Worker conferido, regressão do modal no aparelho, compartilhar WhatsApp/texto/PDF real.
3. **Sob risco de rede:** ensaiar lista criada offline, autenticação, reenvio e duas sessões/dispositivos; corrigir indicação enganosa da exclusão remota sem apagar dados.
4. **Teste supervisionado:** observação de fluxo do profissional e valor percebido; distinguir problemas de ficha, usabilidade, integração e conectividade.
5. **Não abrir frente nova de Obras/Diário** até fechar os bloqueios do núcleo.

## Decisão de segurança para o teste
A opção mais segura é realizar o dia 17 como **ensaio restrito acompanhado**, com materiais e fichas revisados e conferência humana antes de usar qualquer saída como pedido de compra. Se uma ficha ainda estiver em revisão, exibir esse status; não promovê-la a catálogo oficial apenas para chegar à data.

**Não executadas neste relatório:** alterações em fichas, dados de usuários, SQL, `main`, deploy ou homologação de pedidos reais. 
