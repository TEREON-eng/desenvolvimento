# Auditoria de independência — TEREON X
**Data:** 08/11/2026 | **Branch auditada:** `desenvolvimento` | **Versão:** x.0.3.15

## Objetivo e critério de conclusão
Independência não é isolamento absoluto. Um módulo é independente quando: (1) possui responsabilidade e dados próprios; (2) abre e funciona sem exigir cadastro em outro módulo; (3) acessa módulos externos exclusivamente por contratos, sem manipular seus dados diretamente; (4) mantém seu funcionamento quando outro módulo falha; (5) preserva decisões aprovadas em alterações futuras.

**Não declarar independência completa** enquanto persistirem itens bloqueadores abaixo. Não abrir novos módulos antes de fechar o conjunto de invariantes técnicos essenciais e de realizar um teste de duas contas.

## Evidências verificadas diretamente
- `x/listas/servico.js`: não contém dependência de Catálogo, DOM, Supabase ou Obras; recebe repositório por composição.
- `x/listas/store.js`: armazenamento local sem DOM e sem acesso a fichas ou obras.
- `x/catalogo/motor.js`: regras de fichas sem acesso ao DOM, localStorage ou Obras; expõe carregamento e consultas de dados. **Mas** carrega um arquivo JSON por endereço fixo, ainda sem fonte injetável.
- `x/relacoes/origem-listas.js`: adaptador que não cria relações remotas na consulta; passagem para o motor de Relações está parcialmente estruturada.
- `x/index.html`: Início e região de Listas distintos. **Mas** a página raiz ainda carrega scripts de Listas, Catálogo e autenticação; falhas de inicialização podem afetar as interações da página, mesmo que os cards estáticos apareçam.
- `x/listas/integracao.js`: cache da conta segregado por UUID, estado de conflitos e controle de versão. **Mas** conflitos não têm ação de resolução, a continuidade offline não está homologada em dispositivos, e a fila de sincronização é básica.
- `x/listas/auth.js`: busca conta autenticada; quando dependência de rede/script falha, hoje usa fallback para modo local. **Risco:** não há aviso inequívoco de modo degradado para usuário autenticado e nenhuma recuperação robusta garantida após importação CDN falha.
- `x/manifest.webmanifest`: PWA inicia em `/x/`; a Central antiga é redirecionamento. Escola, Biblioteca e Fichário têm rotas próprias.
- Modal aprovado: HTML `addDialog` protegido por snapshot de X.0.3.4 e teste de comportamento. Modal de Criar lista agora tem regra CSS móvel restrita a `#createDialog[open]` para ficar próximo do topo e afastado do teclado.

## Banco de dados e dois usuários
Inspeção administrativa: nove tabelas públicas `x_%` identificadas, **todas com RLS ligada**. `x_cloud_lists` tem políticas SELECT, INSERT e UPDATE por `owner_id = auth.uid()`, sem DELETE; nenhuma das nove tabelas mostra grants diretos ao papel `anon` na consulta de privilégios. Funções `x_cloud_lists_track_update`, `x_list_shares_touch_status`, `x_relations_lock_history` não usam SECURITY DEFINER. Dois proprietários distintos estavam presentes nos dados de Listas em auditoria anterior.

**Limite da evidência:** consultas sob credenciais administrativas não são testes negativos sob sessões A e B. Realizar casos: A não lê/edita B; B não lê/edita A; troca de sessão no mesmo navegador; logoff; cache persistido; tentativa explícita de alteração do campo owner_id; compartilhamento aceito/revogado. Não manipular listas reais nem criar dados de teste sem registro.

## Matriz de bloqueadores antes da expansão
| Prioridade | Item | Observação / aceite |
|---|---|---|
| P0 | Não regressão aprovada | Snapshot do modal e testes de fluxo, versão, inicialização; CI deve ficar verde |
| P0 | Duas contas reais | Leitura/gravação isoladas + troca de sessão + teste de acesso negado, sem expor lista de outra conta |
| P0 | Fallback autenticação | Não tratar erro de CDN/rede como logoff invisível; estado de erro e retomada explícitos |
| P0 | Proteção de escrita | Conflito entre aparelhos preserva ambas alterações; prover mecanismo de resolução, exportação ou escolha explícita |
| P1 | Continuidade offline | Uso e sincronização após reconexão; teste de PWA instalada, cache e perda de rede |
| P1 | Contratos claros | Contrato versionado Listas ↔ Relações e Catálogo ↔ UI; testes impedem dependências reversas |
| P1 | Fonte única do Fichário | Processo reproduzível de atualização de snapshots do Drive, revisão e homologação; não assumir sincronização automática |
| P1 | Design system | Tokens e componentes compartilhados por versão com telas piloto; avaliar visual de Perfil, Universo, Escola e Listas |
| P2 | Vincular Lista à Obra | Relação opcional sem alteração destrutiva de registros |
| P2 | Compartilhar entre contas | Diferenciar cópia de lista, colaboração, permissões de equipe e sincronização |
| Futuro | Dimensionamento/Canivete | Só após consolidar critérios mínimos acima |

## Política de alteração
1. Antes de editar: identificar invariantes afetados e os testes de referência.
2. Alterar somente o módulo dono da responsabilidade; incluir adaptador para comunicação.
3. Rodar testes unitários, contrato e teste funcional simulado; se alterar UI, conferir visual real no PC/celular.
4. Se o CI falhar, a implementação não está pronta. Não alterar branch `main` sem decisão explícita.
5. Registrar exatamente o que foi comprovado e o que permanece pendente — nunca declarar homologação por inspeção estática.

## Correção pontual de interface desta auditoria
No celular, `#createDialog[open]` é ancorado ao topo com espaço para área segura e `max-height` limitado ao viewport dinâmico, com rolagem interna se necessário. Mantidos intocados os estilos e a estrutura dos modais de detalhe de lista e especificação técnica. Ainda precisa do teste manual com teclado Android/iOS.
