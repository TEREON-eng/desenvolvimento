# TEREON X — Motor de Compartilhamento entre Usuários (laboratório v1)

## Escopo e contrato

Motor independente `/x/compartilhar-usuarios/`, não integrado ao shell nem ao menu principal.

- `motor.js`: API pública `TereonXUserShares.create(supabase)` com `send(recipientUserId,sourceList)`, `inbox()`, `outbox()`, `respond(shareId,'accepted'|'declined')`, `revoke(shareId)` e `prepareSnapshot(list)`. **Sem DOM e sem CSS**.
- `lab.html` / `lab.js` / `lab.css`: laboratório independente de interface. Usa o login Supabase existente, mas não importa a interface de Identidade.
- Lê listas locais pelo contrato público `TereonXLists.create(TereonXListStore.create(...)).exportList(id)`; **nunca modifica a lista original**. Inclui lista de demonstração claramente identificada caso não existam listas locais neste domínio.
- `sql/001_compartilhamento.sql`: tabela `public.x_list_shares`, políticas RLS, permissões por coluna e estados `pending/accepted/declined/revoked`.
- `sql/002_revogacao.sql`: esconde registros revogados do destinatário nas consultas futuras.
- `x/tests/compartilhar-usuarios.test.cjs`: testes automatizados dos contratos, cópia e operações, incluídos no CI.

## Processo

1. Um usuário autenticado copia seu **identificador TEREON** (UUID de conta).
2. O remetente escolhe uma lista e informa o identificador do destinatário.
3. O serviço salva uma **cópia imutável** do conteúdo em `x_list_shares`.
4. O destinatário autenticado recebe o registro na caixa de entrada, podendo aceitar ou recusar.
5. O remetente pode revogar o acesso. Revogação impede novas leituras pelo banco, **não apaga cópias externas** ou dados já exibidos em outros dispositivos.

O compartilhamento é **informativo**. Não cria solicitação, pedido de compra, recebimento nem vínculo de obra. A lista local de origem permanece intacta e não é sincronizada.

## Segurança

- Somente a chave pública (publishable) no navegador. Sem `service_role` e sem funções SQL privilegiadas expostas.
- INSERT limitado a `sender_user_id,recipient_user_id,list_snapshot`; UPDATE limitado a `status`.
- RLS: apenas remetente e destinatário leem as cópias autorizadas; destinatário aceita/recusa convite pendente; remetente revoga um convite pendente/aceito.
- A operação de envio pressupõe que destinatário já possui conta Supabase e que o remetente conhece seu identificador. Não há busca pública por e-mail e não depende de SMTP.
- O nome/quantidade dos materiais da lista enviada **são dados compartilhados deliberadamente**. Nunca enviar dados sensíveis de clientes no laboratório sem consentimento.
- O identificador UUID não é uma senha nem autorização, mas deve ser compartilhado apenas com colaboradores de confiança.
- Limite atual de cada snapshot: até 300 materiais e 128 KiB no banco. O cliente restringe previamente a aproximadamente 100 mil caracteres.

## Separação entre visual e comportamento

**Contrato de estabilidade:** substituir `lab.css` ou toda a tela de laboratório não deve exigir alterações em `motor.js`, nas tabelas ou nas Listas. Interações do laboratório usam IDs próprios. O motor recebe e devolve dados e não manipula a interface. Não reescrever ações de negócio ao renovar tema visual.

## Limites e testes ainda necessários

- O banco possui apenas um usuário registrado neste momento. Para homologar, criar uma **segunda conta real** e testar envio, leitura, aceitação, recusa, revogação e impossibilidade de acesso de uma terceira conta.
- Não há e-mails de convite; por enquanto o remetente informa o identificador UUID do destinatário. Busca/convites por e-mail exigirão outro componente de descoberta de contatos, sem mudar este contrato.
- O laboratório de compartilhamento roda **somente no Preview da branch desenvolvimento**, em `/x/compartilhar-usuarios/lab.html`. Não usar `desenvolvimento.tereon-app.workers.dev`, que aponta para `main`.
- Uma lista cadastrada na origem de produção não aparecerá automaticamente no Preview (origens diferentes têm armazenamentos locais separados).
- Revalidar testes de autorização entre 2–3 usuários antes de integrar ao aplicativo. Nenhuma operação foi homologada com múltiplas contas.
- Verificar aviso Supabase de proteção contra senhas vazadas desativada antes de testes externos e adoção comercial.

## Futuro

Quando o laboratório for homologado, incorporar **uma única ação** "Compartilhar com usuário TEREON" à interface de Listas, passando `exportList(id)` para o motor, sem reimplementar login nem armazenamento da lista. Manter a ação **Solicitar** independente; colaboração simultânea sobre uma mesma lista exigirá novo contrato e tratamento de conflitos.
