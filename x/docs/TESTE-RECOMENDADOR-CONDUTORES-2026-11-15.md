# TEREON — Como testar a camada de recomendações

**15/11/2026 · laboratório portátil de UX, sem deploy automático comprovado e sem alteração do modal principal.**

A decisão é manter **as recomendações como uma camada anterior**, preservando a ficha detalhada para *Personalizar* e a criação livre de materiais. **Refinamento de 15/11:** mostrar um único candidato com tags removíveis; ao remover uma característica obrigatória, marcar como pendente e exigir edição antes da confirmação. A recomendação é uma base editável, não uma escolha inflexível. Este teste é isolado e não modifica suas listas.

## Acesso
- Arquivo autossuficiente: `x/laboratorios/recomendador-condutores.html`. Contém os mesmos interpretador/recomendador/fichário experimental e a versão de voz usada nesta revisão, embutidos para rodar sem rede.
- É possível baixar o HTML e abri-lo localmente no navegador. Alternativamente, na hospedagem que estiver servindo **o commit desta página**, abrir `/x/laboratorios/recomendador-condutores.html`. O GitHub sozinho **não** comprova que a página foi publicada no Cloudflare.
- Digitar ou clicar nos exemplos. **🎙 Falar** só funciona em navegador com reconhecimento e permissão de microfone; em `file://` pode não funcionar por restrições do navegador. Texto é a alternativa.

## Roteiro de avaliação
1. `fio flex 2,5 preto`: observar item já existente no cenário **Lista** em primeiro lugar, com histórico e catálogo agrupados por equivalência de especificação.
2. `fio flex 2,5 preto 450`: diferenciar tensão explicitamente informada de menção incompleta; alternativa 1 kV deve ficar como **Revisar**, não ser marcada como confirmada.
3. `fio 4 preto`: encontrar outra seção na base simulada.
4. **Sugestão principal com tags:** apenas UM candidato aparece de imediato; suas características estão em chips com **×**. Clique no × da tensão para removê-la do **rascunho**, e confirme que ela aparece **pendente** e bloqueia o botão de confirmar.
5. **Editar esta sugestão:** abre formulário pré-preenchido com as características mantidas; escolha uma nova tensão para completar, sem reconstruir o material do zero.
6. **Ver outras sugestões:** só sob solicitação, expande candidatos completos e incompletos alternativos com suas origens; esses itens também podem ser editados.
7. **Personalizar:** sem candidato, abre ficha experimental em branco, com validações; confirmar fica restrito à simulação.
8. **Abrir ficha original no TEREON:** abre o aplicativo de Listas no fluxo existente; **não** transfere o candidato do laboratório para o modal atual.
9. Conferir no celular se pesquisa, seleção, descrição e botões parecem mais rápidos que construir tags característica por característica.

## Limites
- **Toda Lista/Histórico/Catálogo aqui são simulações**, não suas informações pessoais ou fornecedores verificados.
- Nenhuma escolha salva, consolida, compra ou treina IA. Todo “resultado” é local à sessão.
- A ficha FT_COND-001 segue **Em revisão**; “material completo” indica preenchimento estrutural para teste, **não** validação de aplicação ou produto.
- O laboratório usa interpretador de Condutores apenas. Expandir para Infraestrutura/Proteções/Quadros exige saneamento técnico e exemplos reais.
- A tela portátil **não altera a interface atual**, o `addDialog` ou o `main`.

## Próximo gate
Após receber feedback sobre número de opções, perguntas, relevância e duplicidades, ligar essa camada ao modal aprovado sem remover o caminho manual, com testes reais de usuário e sem editar dados antigos silenciosamente.
