# TEREON X — Repositório de desenvolvimento

**TEREON — Tecnologia que faz a engenharia fluir.** Ramo de trabalho: **desenvolvimento**. Versão declarada em código: **X.0.3.63**; deploy e homologação não demonstrados por uma versão no arquivo.

## Leitura recomendada
- [Mestre consolidado](x/docs/MESTRE-TEREON-X.md): visão, decisões estáveis e escopo.
- [Contratos vigentes](x/docs/CONTRATOS-VIGENTES.md): regras obrigatórias e prevenção de regressão.
- [Estado atual verificável](x/docs/ESTADO-ATUAL.md): evidências, bloqueios e incertezas.
- [Índice documental](x/docs/INDICE-DOCUMENTACAO.md): onde encontrar estudos, arquivos e história.
- [Guia visual](x/docs/GUIA-VISUAL-TEREON-X.md) · [Mapa de módulos](x/docs/MAPA-MODULOS.md) · [Regressão](x/docs/TESTES-REGRESSAO.md) · [Plano de campo](x/docs/FOCO-TESTE-CAMPO-17-11-2026.md).
- [Índice histórico e proveniência](x/docs/HISTORIA-INDICE-E-VERIFICACAO-2026-11-14.md).

## Aplicativo
PWA em **x/**. Núcleo prioritário para ensaio supervisionado de 17/11/2026: **Listas → Fichas/Catálogo → Especificação → Compartilhamento**. Texto e voz opcionais alimentam um interpretador piloto de Condutores, que produz **propostas**, nunca confirma atributos automaticamente. Fotos são visão futura, não implementação. Universo/Obras/Diário são laboratórios, e Solicitações/Compras serão motores próprios.

## Laboratório mobile
[Abrir prévia interativa do recomendador no celular](https://raw.githack.com/TEREON-eng/desenvolvimento/desenvolvimento/x/laboratorios/recomendador-condutores.html) — visualização externa do HTML público, com dados simulados, sem deploy Cloudflare; disponibilidade e toque em aparelho real não verificados. 

Na Home do desenvolvimento há um atalho discreto **Testar recomendação por tags**. Essa rota usa apenas dados simulados e NÃO altera listas ou fichas oficiais. A página é publicada somente após implantação do Worker; o commit no GitHub não comprova deploy.

## Qualidade
O [CI de X.0.3.63](https://github.com/TEREON-eng/desenvolvimento/actions/runs/43759876132) foi **integralmente aprovado**, incluindo o recomendador LAB e a regressão de dependências do modal. Esse resultado não comprova deploy Cloudflare, teste Android ou homologação de fichas. Documentar não substitui essas verificações. Preserve a branch main e o modal aprovado. [README anterior integral](x/docs/README-RAIZ-PRE-SANEAMENTO-2026-11-14.md).
