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
- **WhatsApp/texto:** somente nomes, quantidades e unidades dos materiais.
- **E-mail:** oferecer perfis *Vendedor* (lista para compra), *Equipe de obra* (por etapas), *Chefia/Engenharia* (completo).
- **PDF:** manter, por enquanto, a versão completa e simples atualmente aprovada no X.
- Melhorias futuras são realizadas dentro do motor e dos modelos, sem reescrever a tela de listas.

## 7. Condição de substituição do legado
O X substituirá o legado por capacidades homologadas, nunca por importar indiscriminadamente seus scripts. As funcionalidades antigas servem como **referência de regras e critérios**, não como código obrigatório. Migração de dados, quando houver, será tratada separadamente, com cópia de segurança, compatibilidade validada e autorização explícita.

**Regra de revisão:** qualquer proposta que exija mudar dois ou mais módulos para uma alteração de interface isolada deve primeiro ser reavaliada arquiteturalmente. 
