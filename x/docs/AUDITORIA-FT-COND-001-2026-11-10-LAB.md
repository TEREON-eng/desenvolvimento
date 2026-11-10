# TEREON X — FT_COND-001 experimental: importação e estresse
**10/11/2026 · Ambiente desenvolvimento · Não homologado**

## Fonte e escopo
Fichario.xlsm oficial do Google Drive, ID `16GNI_s5xA_qj2Q5DuzAuJX33oUxgSMQk`, versão observada em 10/11/2026 às 20h15 BRT, aba `FT_COND-001 - Fios e cabos`, **somente linhas 11–24**. Linhas de rascunho inferiores não foram importadas. A origem não foi alterada.

## Alterações implementadas na branch `desenvolvimento`
- Snapshot `x/fichario-x/fichas-drive-2026-11-08.json` — só FT_COND-001 atualizada, outras 5 fichas preservadas. Status global continua **Em revisão**, coleção não homologada.
- Título original B5 “Condutores isolados” mantido como `nomeNaPlanilha`; nome neutro exibido no app “Condutor elétrico” evita contradição com a opção Cabo multipolar.
- `x/catalogo/motor.js`: mesmas IDs em várias linhas formam **um detalhe com opções**; condição local por linha, `+` E, `//` OU, exclusão de detalhe inteiro pelo nome ou opção por valor, barreira nos dois sentidos. Obrigatoriedade apenas para detalhes aplicáveis e com opções compatíveis.
- `x/listas/app.js`: apresenta opções filtradas; bloqueia novas escolhas que conflitam com tags confirmadas, sem apagar automaticamente outras escolhas. **DOM do modal aprovado não alterado.**
- `x/version.json` x.0.3.31 e `x/sw.js` cache novo; JS de Catálogo/Listas com query incrementada para atualização.
- Teste novo `x/tests/condutores-estresse.test.cjs`, incluído no workflow; teste antigo de Catálogo atualizado para 10 detalhes efetivos.

## Inspeção real da ficha ativa
Detalhes agrupados: Tipo (3 opções), Material (2), Quantidade de vias (5, apenas multipolar), Seção (15), Comportamento ao fogo (Comum/LSZH), Isolação (PVC 70 °C / HEPR ou XLPE 90 °C), Classe de tensão (450/750 V / 0,6/1,0 kV), Cobertura (só PVC 70 °C; opção não halogenada ainda AUSENTE), Cor (7 opções, excluída para multipolar), Encordoamento (4 classes, com descrição de Classe II ainda não saneada). Unidade comercial não está no bloco ativo da ficha, mas campo de quantidade/unidade da Lista permanece.

## Testes lógicos executados em motor JS original do GitHub
Malha de **648 combinações**: 3 Tipos × 3 Comportamentos × 3 Isolações/vazio × 3 Tensões/vazio × 2 Coberturas/vazio × 2 Cores/vazio × 2 Vias/vazio, com Cobre e 2,5 mm² fixos. **458 conflitos lógicos**, **56 estados completos pelas regras atuais**, **0 com conflito e sem obrigatoriedade pendente**. Verificações isoladas: Condutor isolado+PVC+cor aceita; multipolar+HEPR+3 vias aceito; Tipo isolado oculta Cobertura; multipolar exclui Cor; LSZH × PVC e HEPR 90 °C × 450/750 V nos dois sentidos. O estresse capturou e motivou correção de Quantidade de vias indevidamente obrigatória em condutor isolado.
**Interpretação importante:** “estado completo pela regra” não atesta que existe produto comercial. O teste foi programático do motor, não uma execução dos 26 passos do GitHub Actions nem um teste real no celular.

## Pendências técnicas antes de homologar
1. **Condutor isolado LSZH continua impossível de especificar adequadamente**: falta opção de isolação termoplástica não halogenada 70 °C.
2. **Cabo LSZH coberto continua sem opção de cobertura não halogenada**: ficha só lista PVC 70 °C (inclusive rótulo mistura cobertura com classe térmica de isolação).
3. Classe de tensão continua **Opcional**; definir se deve ser obrigatória para identificação de compra.
4. `Classe II (Encordoado flexível)` exige correção técnica; classe 2 da IEC 60228 é encordoado rígido/semirrígido, enquanto classe 5 é flexível.
5. Seleção HEPR ou XLPE agrupada não separa as duas construções; revisar decisão comercial.
6. Ainda não há alternativa `sem cobertura` para Cabo unipolar, nem diferenciação de unidade por apresentação; confirmar escopo.
7. Alguns detalhes opcionalmente ausentes podem produzir nome comercial ambíguo. Configurações com status Aprovado por linha não transformam ficha inteira em homologada.
8. O código de UI ainda não exibe aviso específico quando todas as opções de um detalhe obrigatório se tornam incompatíveis; a gravação é bloqueada, mas retorno pode melhorar.

## Estado de implantação
**Confirmado:** GitHub branch `desenvolvimento` atualizada, testes de estresse executados isoladamente e arquivo de CI adicionado. **Não confirmado:** CI verde em GitHub Actions, publicação efetiva no Cloudflare Workers, carregamento da versão x.0.3.31 em celular. Commit não é deploy. Worker relacionado à branch pode publicar produção: testar só com materiais demonstrativos até a revisão.
