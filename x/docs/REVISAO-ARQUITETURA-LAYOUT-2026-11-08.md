# TEREON X — revisão de coerência, independência e navegação
**Data:** 08/11/2026 · **Versão:** x.0.3.14 · **Ambiente:** branch `desenvolvimento`
**Condição:** arquitetura e UX em validação de laboratório, não homologação comercial.

## 1. Ideia orientadora
**A lista inicia o trabalho, mas não aprisiona o usuário nem os módulos.**
O profissional pode criar uma lista avulsa sem selecionar obra, estágio administrativo ou plano. Obras, dimensionamento, ferramentas e conteúdos são módulos próprios, que podem enriquecer o registro por relação explícita quando necessário.

## 2. Mapa de navegação aprovado nesta revisão
```
Início /x/
├── Minhas listas → relação de listas → modal de lista → modal técnico de adicionar
├── Criar lista → modal de criação SOBRE Início → modal da lista SOBRE Início
├── Dimensionamento [em preparação, sem tela falsa]
├── Canivete [em preparação, sem tela falsa]
├── Universo → Obras [módulo independente]
└── Escola → Biblioteca → Fichário de Fichas Técnicas [livro #1]
```
- Endereço antigo `/x/laboratorios/` redireciona para `/x/`.
- PWA inicia em `/x/`, não em Minhas listas.
- Links antigos `/x/?view=lists` e `/x/?view=create` permanecem compatíveis; este último abre o modal direto sobre Início.
- A relação de listas e o detalhe são estados da mesma página; a lista preserva a tela anterior quando aberta e retorna a ela ao fechar.
- A Biblioteca não é mais um acesso de primeiro nível. O Fichário continua usando `TereonXCatalog`, mesma fonte técnica usada por Listas.

## 3. Limites entre módulos (não misturar responsabilidades)
| Componente | Responsabilidade | Não deve |
|---|---|---|
| Início/shell | Descoberta, navegação, acesso ao perfil e modais de entrada | Depender de uma lista ou obra carregada para exibir os demais módulos |
| Listas | Criar, editar, especificar, lançar, compartilhar/exportar | Obrigar vínculo a obra; determinar permissões comerciais; modificar fichas oficiais |
| Catálogo/Fichário | Definir identidade, valores, condicionais, ordem e requisitos técnicos | Decidir atributo sem confirmação humana; declarar revisão como homologada |
| Persistência | Modo avulso local ou conta com sincronização, por identidade | Duplicar interface; cruzar dados de contas; sobrescrever alterações concorrentes |
| Universo | Gerenciar espaços e obras | Ser condição prévia para criar lista |
| Dimensionamento | Futura análise/dimensionamento | Substituir catálogo sem trilha de validação; fingir módulo completo |
| Canivete | Futuras ferramentas pontuais | Redefinir Listas |
| Escola | Conteúdos, salas, livros | Escrever em listas ou obras sem ação explícita |

O HTML do Início agora permanece em `x/index.html`, fora do renderizador `x/listas/app.js`; os destinos Escola e Universo continuam acessíveis mesmo se o script de Listas falhar. `#homeScreen` e `#listsScreen` são regiões separadas dentro da mesma aplicação. Isso é isolamento básico de navegação, **não** prova de total independência de código, pois a raiz ainda carrega módulos de Listas para oferecer criação em modal.

## 4. Coerência visual — padrão progressivo
**Padrão atual, sem alterar funcionalidades aprovadas:**
- Cabeçalho TEREON X + caminho de retorno contextual
- Fundo claro #f6f8f6, cartões brancos com borda sutil, verde profundo #213d2d para ação principal, verde neon #c7ff46 como acento
- Listas em destaque acima das outras áreas, com duas ações no topo
- Cards dos módulos em grade de duas colunas no celular, rótulos e função claros
- Conteúdo em páginas/salas; lançamentos e seleção em modais
- Estados claros (Em preparação, Em revisão, Salvo neste aparelho, Salvo na nuvem, Conflito)
- Mesma escala de espaçamentos, títulos e controles; evitar botões dentro de outro card clicável

**Pendência de engenharia de interface:** extrair tokens e componentes compartilhados para um stylesheet/kit único (cabeçalho, cards, botões, modal, cores, espaçamento). Central, Escola, Biblioteca e Fichário foram alinhados visualmente, mas ainda possuem CSS duplicado. Não realizar migração em massa sem testes de telas. Os módulos Universo/Obras e Perfil ainda precisam de vistoria visual conjunta no celular.

## 5. Duas contas — estado verificado e limites
Em consulta administrativa ao Supabase, havia 2 listas persistidas com 2 proprietários distintos; a tabela `x_cloud_lists` usa RLS ativada com políticas SELECT/INSERT/UPDATE por `owner_id = auth.uid()`. O cache local das listas sincronizadas também é segregado pelo ID da conta. Uma mesma lista não deve ser editável por usuários diferentes só por ambos terem login — isso exigirá compartilhamento/permissões explícitos.
**Não realizado:** teste ponta a ponta com duas sessões autenticadas reais em dois dispositivos e teste manual de compartilhamento. Não afirmar homologação multiusuário com base apenas no SQL.

## 6. Riscos reais e próxima ordem
1. **Alta:** realizar teste real A/B (isolamento, duas contas no mesmo aparelho, troca de sessão, sincronização, conflito); preservar dados de teste.
2. **Alta:** corrigir diferenças visuais que só aparecem no navegador (sobreposição de modais, teclado, barra de rolagem, retorno de Escola e Biblioteca).
3. **Média:** consolidar CSS em design system compartilhado e impor regressão visual / screenshots de referência.
4. **Média:** ligar Listas ao Universo por relações opcionais, nunca por exigência na criação.
5. **Média:** criar permissão explícita de compartilhamento para equipe, sem confundir enviar snapshot com sincronização colaborativa.
6. **Quando pertinente:** implementar Dimensionamento e Canivete como serviços independentes conectáveis às listas.

## 7. Regra de não regressão
Nenhuma alteração de layout, rota ou persistência pode substituir ou remover o modal técnico e suas escolhas/condições/tags aprovadas. O snapshot HTML X.0.3.4 e `modal-fichas.test.cjs` continuam obrigatórios. A nova regressão `home-navigation.test.cjs` protege a abertura de Criar lista sobre Início e o retorno ao contexto anterior.
