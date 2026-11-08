# TEREON — Diário de Desenvolvimento | Continuação
**Volume 02 — Da prática de campo à arquitetura TEREON X**
**Período: 24/10 a 07/11/2026 · reconstrução a partir de conversas e artefatos; não inventar marcos sem prova.**
Preserva-se o Diário Volume 01 (origens, DataFluxx e TEREON até 23/10), sem reescrevê-lo.

## 24–30/10 — Da lista ao processo real
A aplicação nasceu do retrabalho com listas de materiais elétricos entre eletricistas, encarregados, engenharia e compras. O fundador reforçou que a lista seria apenas a semente: a especificação técnica precisa formar-se progressivamente, sem o sistema presumir atributos definitivos. O ambiente de obras escolares e o caminho de solicitação para ERP impulsionaram a necessidade de melhorar a comunicação. O aplicativo também gerou a ideia de pequenas histórias sobre "telefone sem fio" na obra para divulgação.

## 31/10–02/11 — Regras de interpretação e infraestrutura
Confirmação explícita de tags extraídas da busca; nomes técnicos e ficha como fonte de normas, opções e relações. Busca ambígua deve mostrar alternativas. Discussões sobre PDF de listas, catálogo oficial versus pessoal e curadoria. Problemas de créditos/hospedagem e isolamento de projetos levaram a migração Netlify → Cloudflare; após erros e retrabalho ficou claro que misturar projetos e deixar interfaces acopladas ameaça a continuidade do produto.
**Aprendizado:** versionamento, isolamento por projeto e separar código do visual.

## 03–06/11 — Teste de campo e evolução de UX
A empreiteira Solange testou e achou o produto interessante, mas ficou perdida na tela de lista/adição. Isso sustentou a decisão de simplificar a lista e usar o botão Adicionar para abrir modal. Tags de confirmação e fluxo natural se tornaram centrais. Fichas técnicas do catálogo foram discutidas em planilhas com ordem, obrigatoriedade e condicionais. O fundador aprovou a dinâmica de modal/tags no protótipo testado, sem afirmar que todo o X já está homologado.
Juliano pode criar propostas de fichas; somente o fundador aprova e publica por enquanto.

## 07/11 — A mudança arquitetural
O fundador decidiu **TEREON X** como produto separado, não uma remenda do aplicativo antigo: repositório da organização `TEREON-eng`, branch `desenvolvimento` em Preview independente de `main`, base modular, testes automáticos e preservação do legado. Catálogo, Especificação, Listas, Biblioteca, Compartilhar e Identidade ganharam contratos separados. O novo Supabase na organização TEREON-app nasce com estruturas de perfis, espaços de trabalho, obras e acesso por obra. O fundador testou cadastro, e-mail confirmado, login, sessão persistente, perfil, saída, reentrada e mudança de senha em laboratório isolado. O retorno de link de recuperação de senha causou erro de localhost; houve limite de envio de e-mails e a tradução ficou aguardando SMTP externo.
Compartilhamento entre usuários ganhou tabela com RLS e laboratório de cópias de listas, ainda sem teste real entre duas contas devido a limite de autenticação. A primeira visita à nova tela exibiu `Auth session missing`; foi corrigida a apresentação de acesso sem sessão, faltando conferência de Preview.

## 07/11 — Uma virada no desenho do negócio
Consolidada a diferença: **Compartilhar** comunica ou envia uma cópia; **Solicitar** cria fluxo formal de aprovação/compra/recebimento. Uma conta pessoal pode participar de obras de diferentes empresas sem perder as próprias obras. O módulo **Universo** passa a representar gestão de obras, individuais ou de equipes. Versão grátis permanente continua útil, enquanto gestão e colaboração aprofundada são candidatos pagos; preços e pacotes não estão aprovados.

## Ganchos para futuras histórias e conteúdo
- "O problema não era o eletricista pedir errado: era a informação se perder a cada passagem."
- "Quando a primeira empreiteira ficou perdida na lista, o design virou questão de engenharia."
- "Por que separar um botão Compartilhar de um botão Solicitar?"
- "Uma conta pessoal, várias obras e várias empresas."
- "A tela de login piscava: o que corrigimos sem tocar em Listas."
- "O nome desenvolvimento era produção: a importância de não inferir ambientes pelo domínio."
- "A história do primeiro login do TEREON X."
Cada publicação deve separar relato, registro comprovado e hipótese. Não inventar depoimentos literais, métricas de uso, vendas ou horas.

## 07/11, noite — O Universo que estava congelado
O fundador recordou que a primeira versão do ambiente de Obras já buscava acompanhar a aplicação de materiais, manter Diário de Obras, registrar visitas com relatórios e emitir alertas. As listas poderiam ser vinculadas às obras. Esse ambiente foi congelado quando a necessidade de especificação técnica e listas confiáveis passou à frente, com objetivo de testar o núcleo até 17/11.
A retomada não será uma reescrita do Canivete: Juliano poderá colaborar no abastecimento de fichas e o fundador volta a desenhar os motores de gestão de obras. A ambição é que essa próxima fase produza um **produto comercial real**, mais completo, e não apenas mais telas de protótipo. Preço, pacote final e data de lançamento da nova fase não foram fixados.
**Aprendizado:** a gestão de obras precisa ir além de "cadastrar uma obra": precisa responder o que foi executado, o que falta aplicar, quais visitas ocorreram e o que exige atenção. Essa lembrança corrige e aprofunda a proposta inicial simplificada do Universo X.
