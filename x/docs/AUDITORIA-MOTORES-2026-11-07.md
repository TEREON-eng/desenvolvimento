# Auditoria de arquitetura e código — TEREON X
**Data:** 07/11/2026  
**Escopo:** repositório `TEREON-eng/desenvolvimento`, branch `desenvolvimento`; código do X, documentação, dados de teste, dependências estáticas e configuração Cloudflare.  
**Método:** inspeção dos arquivos GitHub, análise de dependências e teste isolado do motor de catálogo com snapshot de 24 fichas. **Não equivale** a teste E2E em navegador real nem a revisão de segurança formal.

## Conclusão
A arquitetura está **em transição**, não plenamente modular. Há separações reais e úteis: motor de catálogo, seletor, compartilhamento e leitor de fichas. Contudo `x/index.html` ainda acumula navegação, estado, localStorage, UI de listas e um formulário legado de condutor. A Biblioteca e Contribuições ainda têm lógica interna de tela. Recomendado: separar por etapas, sem reescrita geral.

## Achados por severidade
### Alta
1. **Shell/listas monolítico.** Um erro no script inline pode bloquear todo o app. Extrair módulos `listas/store.js` e `listas/servico.js` com contrato explícito antes de novas funcionalidades grandes.
2. **Duas especificações de condutor.** O formulário antigo com sete campos fixos continua acessível ao editar itens históricos; os novos itens usam as fichas do catálogo. Risco de resultados divergentes e quebra de editabilidade se o modelo mudar.
3. **Catálogo de simulação não é homologação.** A fonte das 24 entradas é um JSON demonstrativo (22 hipotéticas). Não reutilizar estes valores como normas ou cadastro homologado.
4. **Ausência de testes automatizados integrados.** Falhas recentes impediram leitura de toda a biblioteca por sintaxe JS e códigos duplicados. Criar testes de carregamento/contrato antes de toda publicação.

### Média
5. **Identificadores duplicados na fonte.** Entradas FT_INFRA repetidas ganham IDs `-SIM-XX`, dependentes da ordem, provisórios; corrigir a origem e instituir IDs estáveis.
6. **Normalizações paralelas.** `fichario-x/leitor.js` e `catalogo/motor.js` interpretam estruturas diferentes; unificar pipeline versionado quando o formato de ficha for estabilizado.
7. **Condições não verificadas.** Regras livres não reconhecidas permanecem visíveis com `verified:false`; o seletor não comunica claramente a limitação. Não considerar tal combinação tecnicamente validada.
8. **Campos incompletos.** Alguns detalhes não têm opções, classificação ou condição. Agora permanecem no modelo, e obrigatórios sem opções impedem concluir; sinalizar na UI e criar política de simulação com pendências.
9. **PWA/cache.** É preciso validar atualização de versões, offline e carregamento de scripts/JSON. O service worker não valida semântica de ficha nem substitui controle de deploy.
10. **Compartilhar.** WhatsApp/texto inclui detalhes e etapas, divergindo do contrato documentado (somente nome, quantidade e unidade). E-mail possui um único formato, sem os três perfis previstos. O PDF precisa de teste de recursos.
11. **Contribuições.** O código do Apps Script ainda contém origem específica anterior (`tereon.pages.dev`); conferir autenticação/retorno no novo hostname. Integração externa não foi executada nesta auditoria.
12. **Persistência.** `persist()` captura exceção e não retorna falha; a UI pode indicar sucesso após erro de armazenamento. Necessário salvamento verificável e migrações com backup.

### Baixa/estrutural
13. CSS e JS ainda inline em HTML (listas, biblioteca, contribuições).
14. APIs globais `window.TereonXCatalog`, `TereonXCatalogUI`, `TereonXShare` são contratos implícitos não versionados uniformemente.
15. A documentação de arquitetura descrevia um alvo ideal sem distinguir o que já está implementado.
16. Nome do Worker `desenvolvimento` não é prova de ambiente: observar branch e URL real no Cloudflare.

## Correções realizadas nesta auditoria
- O motor passou a exigir **homologação explícita** para reconhecer uma ficha como publicada; status textual isolado não basta.
- Detalhes sem opções deixam de ser eliminados silenciosamente do modelo, para que pendências sejam visíveis.
- Um detalhe obrigatório sem valores não é tratado como completado na validação.
- Mantida a simulação de 24 entradas sem publicação da `main`.

## Evidências e limites
- O teste isolado do motor carregou **24/24 fichas**, com **24 identificadores internos únicos**, **24 não homologadas**; Eletrodutos reteve **13 detalhes**, incluindo **2 sem opções**.
- Fluxos de UI, PDF, compartilhamento real, Apps Script, atualização do PWA e status de Cloudflare **não foram testados em navegador**.
- Não foi executado merge para `main` nem alterado o aplicativo antigo.
- Teste de contrato e workflow CI foram adicionados após a auditoria; sem execução registrada no Actions até o encerramento da checagem.

## Ordem sugerida das próximas entregas
1. Implementar teste automático de contrato/sintaxe e integridade de fichas para o X.
2. Corrigir UX de pendências no seletor, preservando simulação com aviso inequívoco.
3. Extrair persistência e operações de listas do HTML para módulos pequenos.
4. Resolver IDs provisórios e normalização única das fichas.
5. Ajustar Compartilhar aos perfis acordados, com testes de regressão.
6. Consolidar navegação de Biblioteca, Catálogo e Listas e testar no celular.
