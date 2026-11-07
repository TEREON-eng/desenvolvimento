# TEREON X — Mapa de módulos e contratos
Atualizado em 07/11/2026. Estado observado na branch `desenvolvimento`.

| Componente | Responsabilidade | Entrada/saída | Independência atual |
|---|---|---|---|
| Shell/listas `x/index.html` | navegação, listas, etapas, gravação | localStorage `tereon-x-lab-v1` | **Baixa**: mistura tela, estado, dados e protótipo fixo de condutor |
| Catálogo `x/catalogo/motor.js` | carregar/normalizar fichas e avaliar regras | `load/list/get/visibleDetails/missing/technicalName` | **Boa**, porém usa URL JSON fixa e contrato global |
| Seletor `x/catalogo/seletor.js` | modal de especificação | `TereonXCatalogUI.open({item,onSave})` | **Parcial**: depende de DOM próprio + motor global |
| Biblioteca `x/biblioteca/index.html` | consultar fichas | `TereonXCatalog.load()` | **Parcial**: lógica de apresentação inline |
| Fichário `x/fichario-x/leitor.js` | interpretar snapshot de fichas | `load/normalize/splitValues` | **Boa**, mas tem normalização paralela à do catálogo |
| Simulador `x/fichario-x/simulador.js` | demonstração independente | JSON próprio | **Boa**, mas usa uma regra de condição simplificada diferente |
| Compartilhar `x/motor-compartilhar.js` | modelar/exportar lista | `TereonXShare.open(list),model,text` | **Boa**, mas contrato de entrada não versionado e canais incompletos |
| Contribuições `x/contribuir.html` | rascunho/envio | armazenamento próprio + Apps Script | **Parcial**: lógica e UI no mesmo HTML |
| PWA `x/sw.js` | atualização/cache | `/x/` | **Parcial**: pré-cache, navegação e fallback exigem teste offline |

## Fluxo-alvo
`Fichário (fonte) → Catálogo (modelo técnico) → Seletor (UI) → Lista (persistência)`. A Biblioteca consome o mesmo modelo de leitura. Compartilhar recebe um snapshot independente da lista. Contribuições nunca alteram fichas publicadas diretamente.

## Contratos obrigatórios
- **Catálogo:** nunca escreve em listas, não acessa DOM e retorna campos com identificação estável, opções, condição, obrigatoriedade, status e pendências.
- **Seletor:** só confirma valores clicados pelo profissional; entrega `{catalogId,name,values,qty,unit,stage,fichaStatus,simulacao}` ao callback; não grava.
- **Lista:** é a única dona dos lançamentos e etapas; duplicar/editar/apagar devem preservar IDs e evitar alterações indiretas.
- **Biblioteca:** somente leitura; nenhuma ficha é homologada pela exibição.
- **Compartilhar:** apenas leitura; deve receber cópia imutável/versionada no contrato futuro; não modifica o catálogo.
- **Contribuições:** propostas são rascunhos, não publicação oficial.
- **PWA:** não apagar dados de usuários nem caches de aplicações alheias.

## Decisões
1. **Catálogo Oficial** é o nome da coleção; não indica homologação.
2. As 24 fichas podem aparecer com pendências para **simular** listas.
3. O fichário hipotético nunca fornece dados técnicos homologados.
4. A aprovação/publicação será processo explícito, não inferido apenas do campo `status`.
5. Não criar wrappers de funções globais para interligar módulos.
