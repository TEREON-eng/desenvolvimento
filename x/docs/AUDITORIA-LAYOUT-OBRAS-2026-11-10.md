# TEREON X — Auditoria preventiva de layout e contratos de Obras
**10/11/2026 | branch `desenvolvimento` | Escopo: Obras, Empreiteiros, Diário e rota de Visitas | Sem homologação visual**

## 1. Conclusão da inspeção
A navegação estava funcional no código, mas visualmente **incoerente**: Obras era clara e usava componentes do shell; Diário e Empreiteiros tinham paletas e cartões escuros próprios, com excesso de avisos, bordas, botões e textos auxiliares competindo com o conteúdo. Páginas também ignoravam a preferência de aparência do X. O redesenho do motor ou do formulário aprovado de Listas **não** é solução para essa divergência.

### Mudanças de interface aplicadas
- `x/universo/ui-refino.css` é camada compartilhada de apresentação, para as quatro páginas, sem lógica de negócios.
- Tokens harmonizados com `GUIA-VISUAL-TEREON-X.md`: Claro, Escuro e TEREON, usando chave `tereon-x-appearance-v1` existente; scripts de aparência incluídos nos laboratórios novos.
- Cabeçalhos e títulos compactos, cards menos profundos, menor densidade de avisos, bordas discretas, estados com rótulos textuais, controles com alvo mínimo de 44 px nas ações mais importantes, foco por teclado e media queries de celular.
- Obras: título claro e **Minhas obras** no painel, ferramentas com identificação discreta; Diário: lista principal como **Agenda do dia**, orientação de teste recolhida; Empreiteiros: título e modais uniformizados. Rota de Visitas mantém aviso honesto de recurso ainda não implementado.
- Preservados IDs e JavaScript dos modais, cadastro de obras Supabase, listas, dados de origem, notas e ações de registro; **não alterar `#addDialog`** do Motor de Listas.
- Estilos de impressão A4 do Diário mantidos e isolados em `@media print`.

### Verificações realizadas
- Inspeção dos arquivos atuais e dos contratos visuais existentes, confrontando HTML/CSS/JS.
- Conferência de sintaxe JS dos laboratórios via compilação isolada e presença de links, modais, PDF e temas na branch: **PASSOU**.
- Novo teste estático `x/tests/obras-refino-visual.test.cjs` no CI, mas **não afirmar que o workflow inteiro passou** sem consulta aos logs.
- **Não foi executado teste visual de renderização em navegador ou celular**, nem foram conferidas cores/legibilidade em capturas reais. O fundador ainda precisa aprovar o refinamento no dispositivo.

## 2. Auditoria funcional e preventiva: achados, prioridade e decisão

| ID | Prioridade | Achado | Estado / proteção |
|---|---|---|---|
| A01 | P0 para liberar | Preview Cloudflare, SHA no ar e CI `desenvolvimento` ainda sem confirmação E2E | Só após confirmar publicação e execução efetiva; nenhuma mudança na `main` |
| A02 | P0 para integrar à nuvem | Diário e Empreiteiros estão em `localStorage`, sem autenticação, autor e autorização por obra: contas diferentes no mesmo navegador podem ver a mesma simulação | Manter carimbo **SIMULAÇÃO LOCAL**; não usar dados pessoais reais nem migrar chaves para produção sem contrato/RLS |
| A03 | P1, protegido localmente | Excluir equipe referenciada por programação rompe nome/histórico no Diário | UI agora bloqueia exclusão se qualquer programação local a referencia; **futura integridade precisa ser do banco/motor, não de busca em `localStorage`** |
| A04 | P1, mitigado | Falha ao ler um JSON de laboratório antes retornava coleção vazia e permitia sobrescrever o dado original no próximo salvamento | Agora bloqueia novas gravações quando leitura de programação, apontamento ou cadastro falha; não apaga a chave |
| A05 | P1 antes de equipe real | Diário mistura amostras fixas e cadastros locais. Renomeação de prestador/equipe muda o nome visto no histórico, pois não existe snapshot imutável de nomes na programação/apontamento | Necessário contrato de identidade estável + snapshot histórico de equipe/prestador + autoria ao migrar ao banco |
| A06 | P1 | Alocação por equipe, programação de escopo e execução do dia usam motores separados, mas não há vínculo versionado nem RLS do Escopo real; `Wilson Rachid` da demo não equivale a obra real | Proibir integração automática por nome; implementar resolvedores de IDs e autorização explícita |
| A07 | P1 | Impressão depende de `window.print()`, do suporte de PDF no navegador e de fontes/paginação; não é arquivo certificado, assinatura nem exportação no servidor | Teste no Android e desktop com múltiplas páginas, resultados ausentes, caracteres, justificativas e impressão cancelada |
| A08 | P1 | Cancelar uma programação remove-a da consulta por dia, mas apontamentos anteriores continuam no histórico local; relatório do dia pode deixar de mostrá-los | Definir se Diário oficial inclui registros cancelados/corrigidos; conservar histórico para auditoria, exibir distintamente |
| A09 | P1 | Uma tarefa marcada concluída pode continuar prevista em dias futuros de uma programação de Escopo; dia concluído não encerra automaticamente cronograma | Definir transições de execução, atividade e programação; **não cancelar futuro automaticamente** |
| A10 | P1 | Preferência de aparência aplicada por estilos/JS, mas contrastes, `dialog`, teclado mobile, leitor de tela, toque, zoom e impressão não foram inspecionados visualmente | Checklist por dispositivo e três temas antes de aceite |
| A11 | P2 | Operações de renomear/excluir Empreiteiros usam diálogos nativos `prompt/confirm` e não o padrão modal: quebram a consistência visual | Substituir posteriormente por modal de edição e confirmação sem alterar motor |
| A12 | P2 | Visitas tem entrada de navegação, porém nenhuma função; texto de preparação evita falso anúncio | Preservar rótulo “Em preparação”; não registrar visita como concluída |
| A13 | P1 para dados reais | Equipes e pessoas ainda sem convite, alteração temporal de composição, privacidade ou contrato LGPD da operação; demo registra somente nome de equipe e prestador | Definir Cadastro Profissional independente do Diário e Acessos separado; não coletar CPF/dados sensíveis no laboratório |
| A14 | P2 | Múltiplas folhas CSS por página (legado + `ui-refino.css`) podem criar especificidade acumulada; ainda falta consolidar CSS após aceite visual | Camada comum é transição controlada; não apagar classes/estilos antigos sem conferir todos os modos e impressão |

## 3. Cenários mínimos de aceite em celular (antes de alterar o produto)
1. Entrar em **Obras**: cabeçalho, três acessos, filtro de espaço, Minhas obras, cartões, modais de cadastro e lixeira; no celular de 360–390px não haver rolagem horizontal.
2. Selecionar Claro/Escuro/TEREON na preferência existente. Todas as páginas novas devem respeitar tema, inclusive sobreposição de modal, selects, texto auxiliar, foco e botões; nenhuma alteração em cadastro/itens ao mudar tema.
3. Empreiteiros: cadastro e renomeação, equipe, voltar, persistência após recarga; tentar excluir equipe usada no Diário deve informar bloqueio sem perder registros.
4. Diário: consulta/agenda visível, modal Adicionar atividade, programação de Escopo por período e Etapa/Subetapa por um dia. Registro Executada/Concluída/Não realizada + justificativa por data; páginas com muitos cartões, teclado e scroll de modais.
5. Diário → Gerar PDF: relatório da obra/data atual, só declara execução com apontamento, não perde caracteres, cabe em A4; conferir salvar e voltar.
6. Simular chave JSON inválida em ambiente descartável isolado: interface alerta e **não sobrescreve** o armazenamento.
7. Em Lists, verificar o modal protegido `#addDialog` e suas tags, sem tocar código/estilos do módulo. Conferir `main` não afetada.

## 4. Critérios para integração posterior
**Bloqueios:** CI e deploy comprovados; RLS de cadastro/equipe/programação/execução; entidade de equipe estável com histórico; política de exclusão/arquivo e eventos; snapshots do Diário e visibilidade de cancelamentos; validação E2E A/B e mobile.
**Preservação:** programação não é presença; execução não é conclusão; subetapa pontual de um dia; hierarquia `Obra → Escopo → Etapa → Subetapa`; o Diário agrega por obra/data; Listas e Escola funcionam independentemente.
**Publicação:** nenhum dos novos laboratórios foi promovido à `main` ou considerado homologado.


## Correções posteriores da mesma rodada — cabeçalho e estrutura de funcionários
- Corrigido **achado visual real não resolvido pela mera camada CSS**: Diário, Empreiteiros e Visitas ainda exibiam cabeçalhos próprios e não geravam breadcrumb. Todos agora usam `data-tx-header=module`, `header.js?v=9`, `header-session.js`, `status.js` e o breadcrumb do X; rota Obras exibe `Ferramentas › Obras` sem nome histórico Universo.
- Cadastro remodelado em **Empreiteiro → Funcionários** (nome, função opcional, Ativo/Desligado com histórico de alteração). Cadastro e edição por modal; filtro de funcionários por empreiteiro. Antigas equipes de simulação ficam visíveis como legado somente leitura, **não convertidas em pessoas**.
- Bloqueio de exclusão de empreiteiro com funcionários; funcionários permanecem cadastrados ao desligar, sem deleção destrutiva. A conexão do Diário **ainda é por equipe**, não há vinculação funcionário→Diário nem associação funcionário→equipe.
- Proteções e testes estáticos adicionados ao workflow. **Pendente:** browser real, visual, tema, teclado/touch, validação da data local e CI. Foco em evitar a regressão de cabeçalho e a migração indevida dos cadastros históricos.

## Repriorização documental — 10/11
Os riscos de layout, histórico de equipes e integração de gestão continuam válidos como bloqueios à operação corporativa real. **Não fazem parte obrigatória do teste de Listas em 17/11**. Priorizar primeiro regressões que afetem modal, catálogo, listas, gravação, exportação, conexão e uso em celular. [Plano do dia 17](FOCO-TESTE-CAMPO-17-11-2026.md) · [Estado vigente](ESTADO-VIGENTE-10-11-2026.md).
