# TEREON X — Estado atual verificável

**Revisão:** 15/11/2026 · **branch:** desenvolvimento · **versão declarada nesta atualização:** X.0.3.62 (build 15/11/2026). **Última execução integral comprovada antes da revisão de versão:** [CI verde em ed27d947](https://github.com/TEREON-eng/desenvolvimento/actions/runs/43747213711). **A publicação/versão efetiva no Cloudflare não foi conferida.**

Esta é uma fotografia da evidência disponível, **não** homologação de catálogo, CI, Cloudflare, Android ou compra real.

## Produto no centro
Listas de materiais é a semente. O profissional descreve como sabe; a ferramenta interpreta e sugere; somente a confirmação humana transforma hipóteses em atributos técnicos da ficha. Depois se lança quantidade, unidade e etapa e se compartilha sem alterar a origem. O dia **17/11** é ensaio **restrito e supervisionado**, não lançamento comercial.

## O que está implementado e o que falta
| Área | Código/laboratório | Limitação |
| --- | --- | --- |
| Listas, agrupamentos Por insumo/Por etapa, edição e relatórios | Implementações e testes isolados | Fluxo completo em Android e nuvem entre dispositivos pendente |
| Busca de Condutores | Interpretador determinístico de texto com hipóteses | Não é IA generativa geral; outras famílias sem esse interpretador |
| Tags ?→✓, nome progressivo e Avançar | Código e regressão integral aprovados | UX real em celular não verificada |
| Recomendador de Condutores (LAB, não integrado à UI) | Ranqueia candidatos já especificados por lista atual → histórico → catálogo, sem completar dados | Ainda não gera variantes de produto e não substituiu a montagem manual; ficha em revisão |
| Voz pt-BR | Adaptador SpeechRecognition/webkitSpeechRecognition; teste simulado passou | Suporte, microfone real, serviço externo/rede e fallback em Android por validar |
| Fotos | Somente visão futura | Não implementado |
| FT_COND-001 | Estrutura Consolidada | Ficha **Em revisão**; tensão DET-006 opcional e isolação HEPR ou XLPE agregada |
| FT_INFRA-001 | Regras LAB e invalidação de diâmetro condicional corrigida no modal | Fonte do Fichário não alterada; teste Android e homologação pendentes |
| Curvas e outras fichas | Snapshot com seis fichas, nenhuma Oficial | Lacunas de obrigatoriedade/cobertura técnica |
| Compra/Compartilhamento | Quantificação separa identidade técnica, família e unidade comercial; Compras/Completo/Execução | PDF/e-mail/WhatsApp reais não verificados em dispositivo |
| Nuvem e contas | Persistência experimental local/nuvem | Exclusão em aparelho A pode deixar B falsamente “sincronizado”; nunca apagar automaticamente |
| Obras/Diário/Equipes | Laboratórios parciais | Não equivalem a gestão integral homologada |
| Cloudflare | Configuração no repo | URL/SHA/versionamento efetivamente servidos não conferidos nesta revisão |

## CI — fato verificado
[Execução 43747213711](https://github.com/TEREON-eng/desenvolvimento/actions/runs/43747213711), SHA **ed27d947424ef8f2a07e2b3ceb566092b13ff3f1**, 15/11/2026: **SUCCESS**. Foram aprovadas todas as etapas de teste do workflow (44 etapas, incluindo setup/checkout; **zero falhas/ignorados**). A suíte agora cobre `recomendador-condutores.test.cjs` e o teste real de remoção do detalhe condicional na UI. A falha anterior de 14/11 era parcialmente causada por verificações desatualizadas, mas o teste de Eletroduto revelou também **um defeito real corrigido no código de Listas**. O novo commit de metadados da versão X.0.3.62 deve ser conferido em Actions separadamente; CI de código não comprova deploy.

## Riscos que bloqueiam aprovação de pedidos reais
1. Saneamento técnico da **fonte das fichas**: Condutores (seção, tensão, formação, isolação, encordoamento, cor, temperatura conforme construção), Eletrodutos/Curvas e itens faltantes.
2. CI completo verde para SHA explícito, preservação do modal e ausência de regressões.
3. Verificação de deploy/versão real e teste de ponta a ponta Android/PWA: texto, voz, tags, Avançar, manual, edição, recarga.
4. PDF/WhatsApp/e-mail e quantificação comercial sem misturar rolos, lances, barras e itens de cor/tensão diferentes.
5. Sincronização entre dois aparelhos e duas contas sem perda ou status enganoso.

## Critério de veracidade
**Decidido ≠ implementado ≠ teste simulado ≠ CI verde ≠ publicado ≠ validado no aparelho ≠ homologado.** Nesta rodada houve um ajuste de invalidação de detalhe dependente no código do modal e adição de recomendador **somente de laboratório**; **não** se alteraram fichas originais, a branch main nem se confirmou deploy. Substitua este relatório apenas com nova evidência datada e SHA; não empilhe notas de versões antigas.
