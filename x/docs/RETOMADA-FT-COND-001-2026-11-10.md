# Retomada — Ficha FT_COND-001 (Condutores BT)
**Registro: 10/11/2026 · TEREON X · em estudo, SEM aprovação ou alteração da ficha**

## Situação e objetivo
Após ajustar a legibilidade visual do Fichario.xlsm oficial no Google Drive, a próxima frente prioritária do teste de campo de **17/11** é revisar e concluir a especificação técnica dos **condutores isolados, cabos unipolares e cabos multipolares de baixa tensão**. O usuário pediu uma lista abrangente dos detalhes técnicos. Foi apresentada uma análise preliminar, **ainda não aprovada**, e a conversa foi interrompida antes de decidir a arquitetura da ficha.

O Fichário oficial identificado é `Fichario.xlsm` (arquivo Google Drive de ID `16GNI_s5xA_qj2Q5DuzAuJX33oUxgSMQk`), aba `FT_COND-001 - Fios e cabos`. **Não gravar alterações técnicas sem validação.** A estrutura aprovada do modal de Listas e o princípio “a IA sugere, o usuário confirma” são contratos intocáveis.

## 1. Inventário preliminar de detalhes a mapear
| Detalhe | Valor / regra a estudar | Situação |
|---|---|---|
| Construção/família | Condutor isolado sem cobertura, cabo unipolar com/sem cobertura, multipolar | Distinção técnica ainda deve ser fechada |
| Material do condutor | Cobre, alumínio | Obrigatório proposto |
| Formação / número de vias | Uma via para unipolar; número de vias para multipolar | Obrigatório condicional proposto |
| Seção nominal | Diâmetros comerciais em mm²; formato brasileiro e símbolo `#` no nome técnico quando aplicável | Obrigatório proposto; validar catálogo de valores |
| Tensão nominal | 450/750 V, 0,6/1 kV (e variantes somente se houver norma/família) | Obrigatório proposto |
| Material da isolação | PVC, HEPR, XLPE, compostos não halogenados aplicáveis | Obrigatório proposto; relações ainda pendentes |
| Temperatura de operação | 70 °C, 90 °C e outras conforme produto/norma | Obrigatório proposto, dependente da isolação |
| Classe de encordoamento | Classes 1, 2, 5, 6 conforme produto | Rever classificação e obrigatoriedade por família |
| Seção por via / formação especial | Iguais ou diferentes, seção do neutro, vias adicionais conforme produto | Condicional para multipolar, sujeito a disponibilidade comercial |
| Cor e identificação | Cor do isolamento de unipolar; cores/numeração das veias internas de multipolar | Obrigatório/condicional conforme aplicação |
| Cobertura externa | Com/sem e material (PVC, composto não halogenado etc.) | Relação com construção e norma, a revisar |
| Cor da cobertura | Preto, cinza e demais opções comerciais | Opcional/condicional |
| Comportamento ao fogo | Antichama, baixa fumaça, livre de halogênios conforme ensaios/norma | Condicional; evitar equivalências falsas |
| Blindagem | Sem, fita, malha e construções apropriadas | Característica avançada; regra de disponibilidade |
| Armadura | Sem/com, tipo | Característica avançada; regra de disponibilidade |
| Geometria especial | Circular, setorial, compactado, outros | Opcional/condicional |
| Norma de produto | ABNT NM 247-3/5, NBR 7285/7286/7287/7288/13248 — **não aplicar automaticamente** | Exige checagem técnica por construção |
| Aplicação especial | Uso fixo/móvel, resistência ambiental quando aplicável | Condicional |
| Unidade e apresentação comercial | metro, rolo, bobina, carreteI, comprimentos comerciais | Melhor tratar no lançamento da lista, não como identidade técnica |

**Importante:** a tabela acima é inventário preliminar, **não conjunto final de tags obrigatórias**. Pode haver distinções entre “condutor isolado”, “cabo unipolar” e “cabo multipolar” que exijam fichas separadas. Não assumir automaticamente que cabo 0,6/1 kV sempre possui cobertura, nem que HEPR/XLPE/PVC definem sozinhos todos os atributos.

## 2. Regras condicionais a lapidar
- Construção multipolar libera número de vias, identificação de cada via e, se apropriado, seções diferentes por via. Unipolar não deve perguntar quantidade de vias já implícita.
- A cor de um condutor isolado ou da via unipolar não é a mesma propriedade que a cor da cobertura do multipolar.
- Material de isolação e classe térmica devem ser combinações compatíveis e respaldadas por norma/catálogo; não transformar sugestão em escolha definitiva.
- Requisitos de fogo/baixa fumaça/ausência de halogênios dizem respeito à construção completa e aos ensaios aplicáveis, não a simples rótulo de material.
- Cobertura externa, armadura, blindagem e apresentação comercial não devem ser confundidas com isolação.
- Normas e combinações comerciais precisam ser validadas antes de serem mostradas como alternativas reais.

## 3. Estado da ficha atual
A FT_COND-001 do Fichário possui campos já preenchidos como Tipo, Material, Seção, Quantidade de vias, Temperatura, Tensão nominal, Blindagem e Unidade de compra. A auditoria do snapshot anterior mostrou incompletude nas **obrigatoriedades**, especialmente Seção e Tensão. Conferir diretamente a aba mais recente antes de alterar colunas e regras. **Não considerar o snapshot do GitHub ou uma planilha histórica de 07/11 como fonte mais atual que o arquivo oficial no Drive**.

## 4. Questão que ficou em aberto
**Manter uma única ficha “Condutor elétrico” com regras condicionais para condutor isolado, cabo unipolar e multipolar OU criar três fichas distintas?** Foi sugerida uma ficha única inicialmente, mas **não houve aprovação**. Esta é a primeira decisão a discutir quando retomarmos.

Depois de fechar a arquitetura, montar quadro definitivo de **campo, valores, obrigatoriedade, condição de exibição, ordem, texto do nome técnico e compatibilidades**; só então registrar na planilha e testar o motor com pedidos reais.

## 5. Limites para retomada
1. Prioridade do núcleo de Listas e fichas para o laboratório de 17/11; Obras/Diário ficam paralelos.
2. Não modificar a ficha técnica, aprovar/publicar ou alterar código por inferência.
3. Preservar o layout já aceito do Fichário e o modal técnico da Listas.
4. Diferenciar fatos verificados, hipóteses e escolhas ainda pendentes.
5. Ao voltar, discutir a organização da ficha e depois analisar os detalhes um a um, sem exigir resposta repetida para pontos já decididos.

**Links internos:** [Mestre](MESTRE-TEREON-X.md) · [Auditoria de fichas para 17/11](MATRIZ-FICHAS-17-11-2026.md) · [Plano do teste](FOCO-TESTE-CAMPO-17-11-2026.md).
