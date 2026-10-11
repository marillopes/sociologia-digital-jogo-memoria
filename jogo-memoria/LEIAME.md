# Mulheres na Ciência · Jogo da Memória
Projeto Sociologia Digital · CEFET/RJ

## Como abrir
- **No computador ou celular:** abra o `index.html` no navegador. Não precisa de internet nem de servidor (as fontes estão na pasta `fonts`).
- **Para publicar (GitHub Pages):** suba a pasta inteira (`index.html`, `style.css`, `script.js`, `dados.js`, `img/` e `fonts/`) para um repositório e ative o Pages.
- **Versão em um arquivo só:** `jogo-memoria-standalone.html` tem tudo dentro, é só mandar o arquivo.

## O que cada arquivo faz
| Arquivo | Função |
|---|---|
| `index.html` | Estrutura das telas (menu, jogo, fim de rodada) |
| `style.css` | Visual: cores do SD, cartas, animações, celular e computador |
| `script.js` | Regras do jogo, sorteio, tempo, recordes, som |
| `dados.js` | **As cientistas: nomes, fotos e descrições. É aqui que se edita.** |
| `img/` | Fotos (4:5), logo SD e selo CEFET/RJ |

## Como editar o conteúdo (`dados.js`)
- **Trocar uma foto:** substitua o arquivo em `img/` (mantendo o nome) ou mude o caminho em `foto`. Ideal: retrato em pé, 4:5 (ex.: 480×600 px), rosto na parte de cima.
- **Acrescentar uma descrição (Fase 2):** adicione uma linha em `feitos` com um `id` novo e o `texto` (até ~85 caracteres fica bem no celular).
- **Evitar cartas parecidas na mesma rodada:** dê o mesmo `grupo` aos feitos parecidos (ex.: `grupo: "genoma"`).
- **Acrescentar outra cientista:** copie um bloco inteiro de `dados.js` e troque os dados. O jogo se adapta (a opção "Todas" passa a usar o novo total).

## Como funciona o sorteio
- A cada rodada, o jogo escolhe quais cientistas participam, dando preferência às que apareceram menos naquele aparelho.
- Na Fase 2, cada cientista recebe uma descrição sorteada, dando preferência às que o aparelho ainda não mostrou.
- Todas as cartas são embaralhadas de novo.

## Níveis
Fácil (4 pares), Médio (6), Difícil (8) e Todas (10).
