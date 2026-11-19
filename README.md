# Minigames

Minigames em HTML servidos por um web app do Google Apps Script. As pontuações ficam salvas numa planilha do Google Sheets.

## Jogos

- **Deslize**: arraste blocos para os lados e complete linhas. A cada jogada sobe uma linha nova por baixo. Blocos da mesma cor lado a lado valem mais pontos: um grupo de N casas vale N² × 10, e uma linha de uma cor só vale o dobro. A pontuação é multiplicada pela fase e pelo combo. A partida acaba quando um bloco passa do topo.
- **Coroas**: puzzle de lógica 8×8. Coloque uma coroa em cada linha, coluna e região de cor, sem que duas coroas se encostem (nem na diagonal). Os tabuleiros são gerados na hora, sempre com solução única, e a dificuldade sobe com a fase: o gerador resolve cada puzzle como uma pessoa faria e escolhe os que exigem técnicas mais elaboradas. Pontos pela dificuldade, com bônus por tempo e desconto por dica.

## Estrutura

```
apps-script/
  Code.gs        backend: doGet, salvarScore, getRecorde, getTop
  Index.html     menu + ranking
  Deslize.html   jogo 1 (também roda sozinho no navegador, salvando só no localStorage)
  Coroas.html    jogo 2 (idem)
```

A planilha recebe uma aba `Scores` com as colunas: Data, Jogo, Jogador, Pontos, Fase, Linhas, Tempo (s). O ranking mostra o melhor resultado de cada jogador.

## Como publicar

1. No editor do Apps Script, crie ou atualize os arquivos `Code.gs`, `Index`, `Deslize` e `Coroas` (HTML) com o conteúdo desta pasta.
2. Ajuste `SHEET_ID` em `Code.gs` se for usar outra planilha.
3. Para testar, use o link `/dev`. Para outras pessoas jogarem: **Implantar → Nova implantação → App da Web**, com "Executar como: eu" e "Quem pode acessar: qualquer pessoa".

## Testar localmente

```bash
python3 -m http.server 8765 -d apps-script
```

Depois abra http://localhost:8765/Deslize.html ou http://localhost:8765/Coroas.html.
