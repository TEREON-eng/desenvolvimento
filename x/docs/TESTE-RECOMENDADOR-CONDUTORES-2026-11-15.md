# TEREON — Como testar a camada de recomendações

**15/11/2026 · laboratório portátil de UX, sem deploy automático comprovado e sem alteração do modal principal.**

A decisão é manter **as recomendações como uma camada anterior**, preservando a ficha detalhada para *Personalizar* e a criação livre de materiais. **Refinamento de 15/11:** mostrar um único candidato cujas tags são editáveis por toque. O valor abre as alternativas daquela característica; o × separado permite removê-la, caso esteja bloqueando outra escolha. Remover uma característica necessária gera uma tag pendente (?), que também abre opções por toque. O formulário completo fica como alternativa para ajustes aprofundados. A recomendação é uma base editável, não uma escolha inflexível. Este teste é isolado e não modifica suas listas.

## Acesso
- Arquivo autossuficiente: `x/laboratorios/recomendador-condutores.html`. Contém os mesmos interpretador/recomendador/fichário experimental e a versão de voz usada nesta revisão, embutidos para rodar sem rede.
- É possível baixar o HTML e abri-lo localmente no navegador. Alternativamente, na hospedagem que estiver servindo **o commit desta página**, abrir `/x/laboratorios/recomendador-condutores.html`. O GitHub sozinho **não** comprova que a página foi publicada no Cloudflare.
- Digitar ou clicar nos exemplos. **🎙 Falar** só funciona em navegador com reconhecimento e permissão de microfone; em `file://` pode não funcionar por restrições do navegador. Texto é a alternativa.

## Roteiro de avaliação
1. `fio flex 2,5 preto`: observar item já existente no cenário **Lista** em primeiro lugar, com histórico e catálogo agrupados por equivalência de especificação.
2. `fio flex 2,5 preto 450`: diferenciar tensão explicitamente informada de menção incompleta; alternativa 1 kV deve ficar como **Revisar**, não ser marcada como confirmada.
3. `fio 4 preto`: encontrar outra seção na base simulada.
4. **Trocar direto na tag:** clique no valor `Preto` da sugestão principal e escolha `Azul`. O resultado deve mudar sem abrir a ficha detalhada; as outras tags permanecem.
5. **Remover pelo ×:** clique no × da tensão. Ela deve ficar pendente (?) e o botão Confirmar desabilitado. Toque na tag pendente e escolha `450/750 V` para restabelecer a completude **sem formulário**.
6. **Opções incompatíveis:** as opções bloqueadas devem aparecer indisponíveis, com motivo ao passar o cursor. Se uma tag impedir a alteração desejada, remova a tag conflitante pelo ×; não substituir detalhes silenciosamente.
7. **Editar esta sugestão:** abre o formulário pré-preenchido com os atributos mantidos. É o caminho para ajustes maiores e cria a nova especificação a partir da base.
8. **Ver outras sugestões:** abre candidatos alternativos somente quando solicitado.
9. **Criar material do zero:** opção compacta no rodapé; ficha experimental começa vazia. Acesso à ficha original continua como link, sem transferir o rascunho do laboratório.
10. **Layout:** exemplos e explicações ficam recolhidos; abaixo das sugestões há uma área compacta de ações em vez de dois grandes painéis.
11. Conferir no celular se o toque na tag e a lista de opções evitam navegar por telas e campos demais.

## Limites
- **Toda Lista/Histórico/Catálogo aqui são simulações**, não suas informações pessoais ou fornecedores verificados.
- Nenhuma escolha salva, consolida, compra ou treina IA. Todo “resultado” é local à sessão.
- A ficha FT_COND-001 segue **Em revisão**; “material completo” indica preenchimento estrutural para teste, **não** validação de aplicação ou produto.
- O laboratório usa interpretador de Condutores apenas. Expandir para Infraestrutura/Proteções/Quadros exige saneamento técnico e exemplos reais.
- A tela portátil **não altera a interface atual**, o `addDialog` ou o `main`.

## Próximo gate
Após receber feedback sobre as opções exibidas por tag, incompatibilidades, relevância e fluxo no celular, ligar essa camada ao modal aprovado sem remover o caminho manual, com testes reais de usuário e sem editar dados antigos silenciosamente.
