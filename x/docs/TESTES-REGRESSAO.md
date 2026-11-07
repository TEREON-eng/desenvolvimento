# TEREON X — Matriz de testes e aceite
Atualizado em 07/11/2026. Não marcar como aprovado sem evidência observada.

## Automáticos (a implantar em CI)
- Sintaxe de todos os scripts `.js` do X e dos scripts inline.
- `catalogo.load()`: carrega 24 entradas de teste, preserva pendências, não homologa automaticamente, IDs internos únicos.
- Condições: `Sempre`, `Rígido+Aço`, `Rígido+PVC`, casos incompletos e regras desconhecidas.
- Validação: obrigatórios pendentes, opcionais, campos sem opções, quantidade inválida e etapa vazia.
- Contrato do seletor: chama `onSave` uma vez; não toca diretamente em localStorage.
- Regressão das listas: criar, adicionar, editar, duplicar, apagar, reabrir, compartilhar; manter dados históricos.
- Resiliência: falha de fetch JSON, falha de localStorage, arquivos em cache antigo.
- Segurança de publicação: nenhuma ficha é aprovada automaticamente pela consulta ou seleção.

## Manuais de navegador
1. Abrir a Preview da branch `desenvolvimento`; confirmar endereço **Preview** e não URL da `main`.
2. Biblioteca → Fichas Técnicas: 24 fichas, status e pendências visíveis.
3. Listas → Adicionar item: materiais da coleção, tags selecionadas, nome formado, quantidade/unidade/etapa.
4. Eletroduto: testar condição Rígido + Aço, Rígido + PVC, Flexível + PEAD e estados incompletos.
5. Condutor: testar seleção, remoção repetida de tags e edição após salvar.
6. Testar uma ficha hipotética e confirmar aviso de dados fictícios.
7. Lista: duplicar, editar, excluir; verificar persistência após recarga.
8. Compartilhar: texto, e-mail e PDF, verificando conteúdo e arquivo resultante.
9. PWA: instalar, atualizar, navegar offline e recuperar após retorno da rede.
10. Contribuições: validar confirmação do Apps Script na nova origem Cloudflare.
11. Móvel: fluxo em teclado real, modal, rolagem e tags em duas ou mais linhas.
12. Falha de rede e erro de armazenamento: mostrar erro sem declarar sucesso.

## Regra para promover à main
Revisão técnica + testes isolados + testes de contrato + regressão crítica + aceite no celular + aprovação expressa. Um deploy “Ready” confirma publicação, **não** a correção funcional.


## Situação dos testes automatizados em 07/11/2026
Foi adicionado `x/tests/catalogo.test.cjs` (Node.js 22, sem dependências) e workflow `.github/workflows/testes-tereon-x.yml` para push em `desenvolvimento` e PR para `main`. Na checagem imediatamente posterior, a API de Actions ainda retornava **0 execuções**. O teste permanece **não comprovado no CI**. A checagem isolada anterior do motor em ambiente de avaliação JavaScript carregou 24 fichas e verificou obrigatoriedade/condições básicas. Executar o script pelo GitHub Actions antes de homologar.
