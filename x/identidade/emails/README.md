# E-mails de autenticação — TEREON X

Projeto Supabase criado em novembro de 2026 no plano gratuito.

**Restrição vigente:** projetos Free criados após 03/06/2026 com SMTP padrão do Supabase não podem editar os modelos de e-mail. Para ativar modelos em português, habilitar um SMTP próprio (que pode ter plano gratuito, conforme o fornecedor) no painel Supabase Authentication → SMTP Settings; então editar Authentication → Email Templates → Reset Password.

Assunto sugerido: **TEREON X — Redefina sua senha**

HTML em `reset-password.pt-BR.html`. Manter literalmente `{{ .ConfirmationURL }}`, pois contém o link seguro emitido pelo Supabase. Não mandar links de recuperação reais ao suporte ou aos desenvolvedores.

Quando configurado, testar recebimento e retorno ao endereço do Preview autorizado em Authentication → URL Configuration. Evitar repetir envios: Supabase SMTP padrão atualmente limitado a 2 e-mails por hora por projeto; recuperação por usuário tem janela mínima de 60 segundos.

A interface do laboratório já comunica limites e bloqueia repetição local dentro de 60 segundos após sucesso. Esse bloqueio é apenas UX e não substitui os limites do servidor.
