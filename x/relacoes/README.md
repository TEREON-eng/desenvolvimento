# TEREON X — Motor de Identidade e Relações (fundação v1)

**Implementado em `desenvolvimento`, sem interface própria nem integração automática aos motores.**

## Premissa
Qualquer pessoa pode começar com um registro avulso. A criação de obra, empresa ou equipe não é obrigatória para iniciar atividades. Quando útil, o registro recebe identidade remota estável e pode ganhar relacionamentos explícitos. Esse mecanismo transporta **referências e contexto**, não faz duplicação silenciosa de dados.

- Identidade registrada: `x_record_identities.id` UUID globalmente único, com `record_type`, `origin_id`, `owner_id` e `created_at`. O `origin_id` é o ID no módulo dono do registro; a identidade do motor é um identificador técnico estável, não um SKU comercial nem um código curto exibido ao usuário.
- Relação registrada: `x_record_relations.id`, referências de origem/destino, `relation_type`, `owner_id`, criação e encerramento. A relação é reversível no sentido de **encerrar**, mas mantém registro histórico. Encerramento não pode ser reaberto/reescrito.
- `motor.js` expõe `create(client)` e os métodos `register(type,originId)`, `identityFor(type,originId)`, `relate(from,to,type)`, `relations(recordId)` e `end(relationId)`. Contrato puro, recebe Supabase client, nenhuma interface ou dependência de Listas/Obras.

## Segurança e limitação deliberada da primeira versão
- **Somente `work` está habilitado** para registro remoto de identidade. O banco exige obra ativa pertencente a espaço ativo do usuário autenticado. Outros tipos estão bloqueados até sua própria fonte de verdade, autenticação/autorização e persistência estarem definidos.
- Relações só podem ligar identidades sob o mesmo `owner_id`. Banco com RLS e privilégios por coluna. Essa **não é a solução final** multiempresa ou para trabalhadores de outras equipes. Próxima etapa exigirá modelo de grants entre entidades.
- Uma lista ainda é guardada no `localStorage`. Seus IDs atuais não são uma referência remota verificável e não devem ser enviados ao registry como se houvesse sincronização. Evitar criar cadastros fantasma para avulsos.
- Não cria, modifica ou movimenta informação de origem. A circulação entre motores deverá ser feita por resolvers/adaptadores específicos que consultam a fonte original, com permissões e eventual snapshot quando processo exigir (por exemplo, solicitação).
- Não há migração das listas locais, associação automática de obra/lista, diário, visitas, UX ou criação de objetos durante leitura.

## Arquivos
- `sql/001_identidade_relacoes.sql`: duas tabelas, políticas de acesso, constraints e índices.
- `sql/002_historico_imutavel.sql`: proteção contra reescrita dos encerramentos.
- `motor.js`: contrato de serviço.
- `x/tests/relacoes.test.cjs`: teste simulado incluído no CI.

## Próximos passos
1. Definir identidade e sincronização de Listas com backup seguro e consentimento do usuário.
2. Resolver permissões e escopo entre membros de vários espaços e obras.
3. Criar resolvers de referência por motor; Listas → Obra será a primeira integração visível ao profissional.
4. Validar com **duas contas reais** e registros avulsos, vinculados, desvinculados e acessados por diferentes perfis.
5. Depois implementar identidade de Diário, Visitas, Solicitações e equipes conforme modelos dessas fontes.

**Estado de verificação:** migrações aplicadas no Supabase; políticas lidas; teste de contrato executado com cliente simulado. Sem teste real de RLS com duas contas e sem homologação de fluxo entre módulos.
