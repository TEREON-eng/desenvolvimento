# TEREON X — Laboratório independente de Login

## Acesso e isolamento

- Página de teste: `/x/identidade/lab.html` na URL **Preview da branch desenvolvimento**.
- Não há vínculo com `x/index.html`, Listas, Catálogo, Solicitações ou o shell.
- `auth.js` define API injetável para cadastro, login, sessão, logout, recuperação, alteração de senha e leitura/gravação de perfil.
- `lab.js` é **somente uma interface de teste** e configura o cliente Supabase usando chave **publishable**, nunca chave secret/service_role.
- `lab.css` define aparência isolada.
- `x/tests/identidade.test.cjs` contém testes unitários com cliente simulado.

## Configuração obrigatória no Supabase

Projeto: **TEREON X**, organização **TEREON-app**, ID `kjikzdpqejhsgutakigw`.

1. Em **Authentication → URL Configuration**, adicionar a URL **exata** do Preview terminada em `/x/identidade/lab.html` a **Redirect URLs**.
2. Configurar uma **Site URL** confiável para o ambiente de autenticação, sem usar o domínio que atende a produção do aplicativo como ambiente de teste.
3. Em **Authentication → Providers → Email**, verificar se cadastro por e-mail e confirmação estão habilitados; manter confirmação de e-mail durante os testes.
4. Testar cadastro por e-mail, confirmação, login, atualização do perfil, saída, recuperação de senha por e-mail e mudança de senha.
5. Não testar com senha real reutilizada. E-mail de confirmação e recuperação dependerá da entrega/limites do serviço de e-mails do projeto.

## Limites conhecidos

- Não foi integrado ao aplicativo, não há tela de login no menu principal.
- Não há ainda convites, papéis de equipe editáveis, seleção de espaço, cadastro de obras nem fluxo de solicitações.
- Não há testes reais de confirmação de e-mail e recuperação por navegador; dependem da configuração dos Redirect URLs e do provedor de e-mail.
- O teste automatizado é um contrato do motor com cliente simulado; não é um teste de ponta a ponta.
- A tabela `x_profiles` tem política RLS para que o próprio usuário leia/escreva seu perfil.
- Não colocar URL de production de Cloudflare como redirect para o laboratório sem revisão de escopo.
- Não usar `auth.user_metadata` para autorização; funções administrativas devem ler permissões e vínculos controlados no banco.
- Antes de apresentar o laboratório a usuários externos, revisar quotas de e-mail, segurança contra abuso e políticas de confirmação; cadastro aberto pode consumir quotas.

## Próxima etapa

Validar o login e a persistência de perfil **no Preview**, depois testar dois usuários reais com isolamento de acesso e só então discutir integração com shell do X. Qualquer integração deve consumir a API do motor, sem duplicar autenticação nas Listas.
