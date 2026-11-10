# TEREON X — Auditoria do catálogo para o teste em 17/11
**10/11/2026 · Inspeção do snapshot `x/fichario-x/fichas-drive-2026-11-08.json` e execução isolada do motor `x/catalogo/motor.js`**

## Evidência
Snapshot: **6 fichas, todas com status Em revisão, 0 homologadas**. Motor reconhece isso e não as promove a oficiais por conta própria. Teste de carga e regras de condição passou em execução isolada, porém isso **não é aprovação técnica das fichas**.

| Ficha | Obrigatoriedades atualmente verificadas no motor | Lacuna crítica para um pedido real | Prioridade |
| --- | --- | --- | --- |
| `FT_COND-001` Condutor elétrico | Tipo e Material | **Seção, tensão, temperatura, encordoamento/isolação, cor e formação conforme ficha técnica** não estão todos exigidos; vários nem aparecem como campos. Reproduzido: “Unipolar + Cobre” já satisfaz `missing()`. | **P0** |
| `FT_INFRA-001` Eletroduto | Tipo e Material | Diâmetros aparecem em condicionais, mas não estão marcados obrigatórios. Dois detalhes de resistência têm valores vazios; condição/classificação em branco; revestimento do aço e opções por tipo precisam revisão. | **P0** |
| `FT_INFRA-002` Curva para eletroduto | Tipo e Material | Diâmetro e revestimento/condições não são obrigatórios. Uma curva sem diâmetro ainda é considerada completa. | **P0** |
| `FT_INFRA-003` Conectores para eletroduto | Tipo e Diâmetro | Critério mínimo atual existe; revisar material, equivalência comercial e aplicações antes de liberar como especificação oficial. | P1 |
| `FT_INFRA-004` Abraçadeiras | Tipo e Diâmetro | Divergência conhecida na origem: célula B5 traz “Conectores para eletroduto”; o nome mostrado é inferido pelo código/aba, com pendência. | P1 |
| `FT_INFRA-005` Caixa de passagem | Tipo e Material | Dimensões/tamanho estão condicionados ou opcionais; confirmar obrigatoriedade e alternativas comerciais. | P0/P1 |

**Cobertura ausente neste snapshot de seis fichas:** disjuntores, DR/DPS, tomadas/interruptores, conduletes, barramentos e itens auxiliares relevantes para uma lista elétrica comum. A intenção de incluir essas famílias no lançamento consta dos registros de produto, mas **não estão disponíveis neste snapshot específico**. Não inventar alternativas, não duplicar fichas para aparentar cobertura e não chamar catálogo de homologado.

## Decisões técnicas antes de modificar o JSON
1. Conferir no Fichário de origem cada ficha, valores comerciais, requisitos conforme aplicação e condições/exclusões. O arquivo JSON é um **snapshot**, não a fonte técnica de edição.
2. Definir quais características são obrigatórias por formação/tipo e quais são opcionais, evitando casos em que condutor sem seção ou curva sem diâmetro vira item “completo”.
3. Estabelecer comportamento de **Ficha em revisão / pendente**: o usuário deve distinguir item técnico incompleto de especificação pronta para compra. Não converter automaticamente revisão em homologação.
4. Congelar seleção de um subconjunto **suficiente** para o cenário de 17/11, em vez de preencher o catálogo inteiro sob pressa.
5. Atualizar snapshot, testes e revisão humana de especificação com 5–10 pedidos típicos após o saneamento.

## Provas executadas em 10/11
- Carregamento do JSON por simulação de `fetch`, 6 fichas retornadas e 0 oficiais: **passou**.
- Condutor “Unipolar + Cobre” retorna `missing=[]`: **falha de prontidão reproduzida**; não é falha do JavaScript em interpretar sua ficha.
- Eletroduto rígido/PVC torna “Diâmetro PVC” visível e oculta “Diâmetro Aço”: **passou** (mas diâmetro não obrigatório).
- Motor de Listas não aceita quantidade infinita, limpa etapa vazia após mover o último material: **passou**.
- Modelo de compartilhamento de duas linhas preservou quantidade, etapa e textos; rejeitou quantidade zero: **passou em isolamento**.
- PDF real, clique no modal, execução completa de Node/CI e aparelho físico: **não comprovados nesta auditoria**.

## Critério de decisão do teste
**NÃO declarar catálogo apto para pedidos reais sem revisão P0 de Condutor e Eletroduto/Curva e sem mapear quais itens o participante tentará lançar.** Caso o objetivo seja teste de usabilidade antes de aprovação técnica, usar pedidos explicitamente demonstrativos e identificar todos os materiais “Em revisão”; não entregar o resultado como pedido homologado para compra sem conferência.

**Documento relacionado:** [Plano operacional](FOCO-TESTE-CAMPO-17-11-2026.md) · [Auditoria completa](AUDITORIA-NUCLEO-LISTAS-17-11-2026.md).
