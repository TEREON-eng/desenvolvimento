> **ADENDO DE ARQUITETURA — 13/11/2026 · X.0.3.60:** entradas **texto digitado** e **voz transcrita** desembocam na **mesma função pura de interpretação** de Condutores (`catalogo/interpretador-condutores.js`) e retornam uma lista de **propostas não confirmadas** (`family`, `proposals`, `warnings`). O adaptador de voz (`catalogo/voz-entrada.js`) é opcional, depende de suporte do navegador, permissão explícita e potencial serviço externo/rede; não guarda áudio no TEREON. Somente o usuário confirma cada proposta, após a validação existente de regras, conflitos e opções pelo `catalogo/motor.js`; entrada natural **não contorna o fichário, não altera a quantificação nem a persistência**. Um futuro canal de **foto** deverá produzir o mesmo tipo de propostas, com incerteza e autorização para captura; **não foi implementado**. O modal visual previamente aprovado e as tags compactas mantêm seu contrato. Testes de voz em Android e CI completo não homologados. [Especificação do piloto](docs/PILOTO-BUSCA-NATURAL-VOZ-FOTO-2026-11-13.md).

> **ADENDO DE ARQUITETURA — 12/11/2026 · X.0.3.51:** o catálogo continua dono das condições/obrigatoriedades e consome um **snapshot experimental versionado**, sem sobrescrever a planilha; o modal continua responsável apenas por confirmar opções e enviar dados à Lista. A unidade do eletroduto continua no seletor de unidade, derivada das condições da ficha; não gerar regra paralela de conversão comercial. O compartilhamento usa `model(snapshot)` e `sections(snapshot,finalidade)` como projeções de leitura que alimentam WhatsApp/e-mail/PDF e nunca gravam. O motor `quantificacao.js` conserva rolos, lances e legado separados. [Revisão técnica](docs/REVISAO-ELETRODUTO-E-RELATORIOS-2026-11-12.md) · [Foco de 17/11](docs/FOCO-TESTE-CAMPO-17-11-2026.md). **O original Fichario.xlsm não foi alterado; homologação pendente.**

# TEREON X — Regra de Arquitetura Modular
**Decisão do fundador · 07/11/2026 · Norma de desenvolvimento do laboratório X**

## 1. Diretriz obrigatória
O TEREON X é o novo produto que deverá substituir integralmente o aplicativo legado. Não é uma camada acoplada à versão antiga. Durante a transição, arquivos do aplicativo legado e infraestrutura Netlify ficam **congelados para alterações** e servem apenas como referência técnica. O laboratório ativo é **/x/**, hospedado em Cloudflare Workers. Novos recursos são criados no escopo do X e **não podem importar scripts, estados globais, telas, CSS ou efeitos colaterais do legado**.

**Princípio:** cada módulo é autônomo, simples e substituível. Remover uma tela não pode impedir que outros módulos funcionem.

## 2. Separação das responsabilidades
- **Núcleo de navegação (shell X):** exclusivamente abre/fecha telas ou modais e entrega contexto. Não gera documentos, não monta fichas técnicas nem modifica registros por conta própria.
- **Catálogo e fichas:** detém famílias, detalhes, opções, obrigatoriedades, condicionais e validade técnica. Não conhece HTML das telas de listas.
- **Motor de especificação:** interpreta/organiza seleção progressiva segundo fichas; exige confirmação explícita antes de aplicar qualquer detalhe. Não grava listas diretamente.
- **Listas:** gerencia dados de listas, etapas, quantidades, edição e exclusão. Não implementa PDF, e-mail, WhatsApp nem lógica técnica de fichas.
- **Motor Compartilhar:** recebe uma cópia estruturada dos dados, compõe formatos e distribui por canais. Não altera lista ou catálogo, e não possui página própria.
- **Contribuições:** recebe propostas e mantém o fluxo de análise. Nenhum item se torna oficial sem aprovação do fundador.

Um módulo **não** deve abrir a tela interna de outro, conhecer IDs de elementos HTML de outro, assumir nomes de variáveis globais dele, ou alterar funções existentes com wrappers/overrides para se conectar.

## 3. Contratos entre módulos
1. A integração acontece por **API pública pequena e versionada** e dados explícitos: por exemplo, `compartilhar.abrir({tipo:'lista-materiais',versao:1,dados:imagemDaLista})`.
2. O fornecedor dos dados entrega um **snapshot de leitura** com versão de esquema; a rotina compartilhadora valida campos necessários, nunca lê diretamente o armazenamento privado do módulo Listas.
3. Toda ação que grava ou altera dados fica no módulo dono dos dados. Outros módulos pedem a ação pela API definida.
4. Sem caminhos de fallback silenciosos para scripts legados. Se o contrato não for atendido, mostrar erro controlado e preservar o estado.
5. Interfaces internas não são contratos; mudar CSS, DOM ou nome de função privada não deve afetar outros módulos.

## 4. Regras de implementação
- Criar cada novo motor em arquivo próprio, com API exportada clara e efeitos de inicialização mínimos.
- Não amontoar regras de negócio em `index.html`; a estrutura atual do X ainda contém código concentrado e deverá ser separada **gradualmente**, sem reescrita geral precipitada.
- O botão Compartilhar vive na tela da lista, mas chama a API do motor, em vez de reproduzir sua implementação.
- Não usar `window.algo = wrapper(window.algo)`, `setTimeout` para esperar telas alheias, remendos de seletor global ou duplicação de formatadores entre módulos.
- Um mesmo fluxo não deve ter diversos geradores concorrentes ativos; protótipos só entram por uma chave explícita de teste e podem ser removidos sem efeitos externos.
- Não modificar o aplicativo legado para testar módulos novos. Qualquer migração será uma tarefa separada e aprovada.
- Dependências comuns devem ser pequenas, explícitas e sem acoplamento circular; permitir testes isolados com dados simulados.
- Simplificar primeiro: não criar uma infraestrutura genérica antes de existir uma segunda necessidade real.

## 5. Aceite mínimo antes de integrar um módulo
- **Teste unitário isolado** com dados simulados, incluindo entradas inválidas.
- **Teste de contrato** entre origem e destino; nenhuma dependência de IDs/telas internas.
- **Teste de regressão** das funções existentes, especialmente adicionar, editar, remover e preservar os dados locais.
- **Teste mobile real** do fluxo e do posicionamento dos controles.
- **Teste de remoção:** desativar o módulo não quebra a navegação e nem outros módulos.
- Se houver falha, reverter somente o módulo novo, sem alterar catálogo, listas ou shell.

## 6. Recorte atual do motor Compartilhar
- É invocado pelo botão **Compartilhar** dentro da lista, por modal, sem menu ou tela independentes.
- **WhatsApp/texto (CONTRATO-ALVO histórico):** somente nomes, quantidades e unidades. **Implementação atual em 09/11:** inclui também detalhes e etapas; há divergência conhecida e ainda não homologada. Não eliminar dados sem decisão do fundador.
- **E-mail (CONTRATO-ALVO):** perfis *Vendedor* (lista para compra), *Equipe de obra* (por etapas), *Chefia/Engenharia* (completo). **Implementação atual:** um formato único, a revisar com o fundador.
- **PDF:** manter, por enquanto, a versão completa e simples atualmente aprovada no X.
- Melhorias futuras são realizadas dentro do motor e dos modelos, sem reescrever a tela de listas.

## 7. Condição de substituição do legado
O X substituirá o legado por capacidades homologadas, nunca por importar indiscriminadamente seus scripts. As funcionalidades antigas servem como **referência de regras e critérios**, não como código obrigatório. Migração de dados, quando houver, será tratada separadamente, com cópia de segurança, compatibilidade validada e autorização explícita.

**Regra de revisão:** qualquer proposta que exija mudar dois ou mais módulos para uma alteração de interface isolada deve primeiro ser reavaliada arquiteturalmente.


## 8. Situação real da implementação (auditoria de 07/11/2026)

Este documento define **o padrão obrigatório**, não declara que todo código já cumpre o padrão. O mapa de implementação e as exceções estão em [docs/MAPA-MODULOS.md](docs/MAPA-MODULOS.md); o diagnóstico detalhado em [docs/AUDITORIA-MOTORES-2026-11-07.md](docs/AUDITORIA-MOTORES-2026-11-07.md).

### Desvios conhecidos
- `x/index.html` ainda combina shell, persistência, operações de listas e uma ficha fixa histórica de condutor. A separação deve ser incremental, com regressão, não por reescrita completa.
- O seletor do catálogo usa API global explícita e callback, mas depende do motor `TereonXCatalog`; a Biblioteca também o consome.
- Os leitores de fichas do simulador e do catálogo têm normalizações distintas; devem convergir para uma única fonte de regras.
- Os perfis de Compartilhar acordados ainda não estão integralmente implementados; não declarar conformidade por existir arquivo separado.
- Os dados atuais são demonstrativos: 24 entradas, sendo 2 reais em revisão e 22 hipotéticas. Catálogo Oficial é nome da coleção, não garantia de aprovação.
- Condições livres não verificadas não representam autorização técnica para especificação.

### Portas obrigatórias para novos módulos
1. Declarar entrada, saída, dependências e dono dos dados.
2. Demonstrar teste isolado e ausência de acesso a estado interno alheio.
3. Não promover fichas pelo simples status, consulta na Biblioteca ou participação em lista.
4. Preservar lançamentos antigos e dados locais em cada migração.
5. Não realizar merge para `main` por êxito de deploy; exigir testes funcionais e aprovação.

### Próxima refatoração permitida
Priorizar `listas/store.js` e `listas/servico.js`, com extração gradual e testes antes de substituir código inline. Essa prioridade não autoriza alterar fluxos da interface já aprovados sem validação do usuário.

## 9. Identidade, espaços e permissões — fundação de 07/11/2026

- **Identidade e Acessos** é um motor independente do Catálogo, Especificação, Listas, Obras e Solicitações.
- Conta TEREON única; um usuário pode ser dono de espaço pessoal e atuar em espaços de outras empresas.
- Cada obra pertence a um espaço; concessões de acesso por obra são explícitas. Participar de um espaço não concede automaticamente acesso a todas as obras.
- **Compartilhar** comunica uma lista; **Solicitar** inicia um processo e gera registro próprio, preservando a lista original.
- O armazenamento é infraestrutura, não a fonte de regras de autorização da interface. Regras de segurança devem existir no banco.
- Governança de fichas técnicas continua nas planilhas do Drive; não confundir com gestão de acessos.

### Implementado (somente desenvolvimento)

Supabase, projeto **TEREON X** da organização **TEREON-app**: tabelas `x_profiles`, `x_workspaces`, `x_workspace_members`, `x_works` e `x_work_access`, com RLS e permissões restritivas. Fonte SQL versionada em `x/identidade/sql/001_fundacao.sql`. Não conecta o aplicativo nem modifica a persistência local de Listas.

**Ainda não implementado:** tela de login, cadastro automático de perfil, emissão/aceitação/revogação de convites, gestão de participantes, papéis detalhados por ação, banco de Listas/Solicitações, sincronização offline, testes reais entre dois usuários. Não conceder inserção de membros/atribuições diretamente ao frontend: criar fluxo controlado, validado e auditável.

**Segurança:** não expor chave privilegiada no navegador; políticas RLS devem ser testadas com usuários autenticados diferentes antes da integração. O verificador de segurança Supabase não apontou alertas após a criação, mas isso não substitui testes de autorização.

## 10. Compartilhamento entre usuários — laboratório independente

Motor `x/compartilhar-usuarios/motor.js`, banco `public.x_list_shares` e interface de laboratório `x/compartilhar-usuarios/lab.html`. Não alterar nem integrar a tela principal de Listas antes de testar com dois usuários.

- **Lista original:** dados locais gerenciados exclusivamente por Listas; saída pública de leitura `exportList(id)`.
- **Compartilhamento entre usuários:** recebe cópia estruturada, grava snapshot com remetente e destinatário, aceita/recusa/revoga; nenhuma edição na lista de origem, nenhum fluxo de compra.
- **Solicitações:** processo futuro distinto (aprovação → compra → recebimento). Não confundir com Compartilhar por texto/PDF/WhatsApp ou com o envio de cópia a outra conta TEREON.
- **Acessos e autorização:** banco Supabase RLS com permissões por coluna; identificadores UUID somente como endereço de usuário no primeiro laboratório, sem expor um diretório de e-mails.
- **Visual:** a interface pode ser redesenhada por CSS/HTML mantendo os contratos públicos do motor, os eventos documentados e testes. **É proibido alterar mecânicas de Listas ou registros no banco para corrigir aparência.** Antes de mudar visual, registrar comportamento de referência e executar regressão.
- **Status:** esquema e código criados em desenvolvimento; não testado com dois usuários reais, não integrado ao aplicativo principal e não homologado.

## 11. Revisão de contratos — 09/11/2026 / X.0.3.29
**Vigente:** `x/index.html` é shell com arquivos separados; `x/listas/app.js` concentra a UI e parte da navegação, enquanto `servico.js`, `store.js` e `integracao.js` implementam a escrita e sincronização. Registro de 07/11 indicando listas ainda inline no HTML é histórico, não recomendação para refazer o shell.
- `TereonXLists.create(repository)`: `createList/renameList/duplicateList/removeList/upsertItem/duplicateItem/removeItem/get/exportList/snapshot/ensureRecordUid`; UI não grava diretamente.
- `TereonXListIntegration`: `repository/refresh/flush/status/deleteList/stop`; cache segregado por conta e nuvem restrita ao proprietário.
- **Compartilhar:** `TereonXShare.open(lists.exportList(id))` recebe snapshot e não altera a lista. Envio a outro usuário TEREON continua motor independente e não é ação de compras.
- **Seleção de listas:** controle visual individual com uma opção de compartilhar selecionada, habilitada somente quando exatamente **uma** lista marcada. O contrato de lote ainda não foi definido; não improvisar aprovação ou exclusão de várias listas.
- **Estados:** sincronização é infraestrutura; andamento Pendente/Aprovada/Em compras/Comprado/Recebido deverá residir em Solicitações, com histórico, papéis, transições e tratamento de parciais.
- **Regra irrevogável de não-regressão:** preservar o comportamento do `#addDialog` (fixture X.0.3.4), fichas e tags aprovadas; mudar CSS não autoriza trocar motor ou recriar modal. Matriz de regressão e aceite móvel obrigatório.
- Branch `main` não deve receber mudanças sem aprovação, CI e teste real; não inferir Preview pelo nome do Worker.
Consulta adicional: [revisão geral](docs/REVISAO-GERAL-CONTRATOS-2026-11-09.md).
