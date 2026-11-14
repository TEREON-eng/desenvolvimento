# TEREON X — Estado atual verificável

**Data da revisão:** 14/11/2026 · **branch:** desenvolvimento · **versão declarada:** X.0.3.61 (build 13/11/2026) · **SHA examinado:** 41c9088d824343c0e074a90f903e2b1ba5350749.

Esta é uma fotografia da evidência disponível, **não** homologação de catálogo, CI, Cloudflare, Android ou compra real.

## Produto no centro
Listas de materiais é a semente. O profissional descreve como sabe; a ferramenta interpreta e sugere; somente a confirmação humana transforma hipóteses em atributos técnicos da ficha. Depois se lança quantidade, unidade e etapa e se compartilha sem alterar a origem. O dia **17/11** é ensaio **restrito e supervisionado**, não lançamento comercial.

## O que está implementado e o que falta
| Área | Código/laboratório | Limitação |
| --- | --- | --- |
| Listas, agrupamentos Por insumo/Por etapa, edição e relatórios | Implementações e testes isolados | Fluxo completo em Android e nuvem entre dispositivos pendente |
| Busca de Condutores | Interpretador determinístico de texto com hipóteses | Não é IA generativa geral; outras famílias sem esse interpretador |
| Tags ?→✓, nome progressivo e Avançar | Código e teste do CI passaram | UX real em celular não verificada |
| Voz pt-BR | Adaptador SpeechRecognition/webkitSpeechRecognition; teste simulado passou | Suporte, microfone real, serviço externo/rede e fallback em Android por validar |
| Fotos | Somente visão futura | Não implementado |
| FT_COND-001 | Estrutura Consolidada | Ficha **Em revisão**; tensão DET-006 opcional e isolação HEPR ou XLPE agregada |
| FT_INFRA-001 | Regras de diâmetro no snapshot LAB | Fonte do Fichário não alterada; sem homologação |
| Curvas e outras fichas | Snapshot com seis fichas, nenhuma Oficial | Lacunas de obrigatoriedade/cobertura técnica |
| Compra/Compartilhamento | Quantificação separa identidade técnica, família e unidade comercial; Compras/Completo/Execução | PDF/e-mail/WhatsApp reais não verificados em dispositivo |
| Nuvem e contas | Persistência experimental local/nuvem | Exclusão em aparelho A pode deixar B falsamente “sincronizado”; nunca apagar automaticamente |
| Obras/Diário/Equipes | Laboratórios parciais | Não equivalem a gestão integral homologada |
| Cloudflare | Configuração no repo | URL/SHA/versionamento efetivamente servidos não conferidos nesta revisão |

## CI — fato verificado
[Execução 43587644688, de 14/11/2026](https://github.com/TEREON-eng/desenvolvimento/actions/runs/43587644688), SHA 41c9088d824343c0e074a90f903e2b1ba5350749: **FALHA** em **x/tests/resumo-localizacao.test.cjs**, linha 33, assertion “por insumo usa mesmo resumo”. Os dez testes anteriores passaram, incluindo voz simulada e confirmação de tags na pesquisa. Todos os testes posteriores foram ignorados. A inspeção sugere que a asserção procura uma assinatura anterior da função de apresentação, mas **é preciso verificar e executar novamente**, não declarar bug do app ou CI verde automaticamente.

## Riscos que bloqueiam aprovação de pedidos reais
1. Saneamento técnico da **fonte das fichas**: Condutores (seção, tensão, formação, isolação, encordoamento, cor, temperatura conforme construção), Eletrodutos/Curvas e itens faltantes.
2. CI completo verde para SHA explícito, preservação do modal e ausência de regressões.
3. Verificação de deploy/versão real e teste de ponta a ponta Android/PWA: texto, voz, tags, Avançar, manual, edição, recarga.
4. PDF/WhatsApp/e-mail e quantificação comercial sem misturar rolos, lances, barras e itens de cor/tensão diferentes.
5. Sincronização entre dois aparelhos e duas contas sem perda ou status enganoso.

## Critério de veracidade
**Decidido ≠ implementado ≠ teste simulado ≠ CI verde ≠ publicado ≠ validado no aparelho ≠ homologado.** A atualização de documentação deste dia não alterou código, fichas originais, main ou deploy. Substitua este relatório apenas com nova evidência datada e SHA; não empilhe notas de versões antigas.
