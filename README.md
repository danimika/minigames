# Minigames

Minigames em HTML servidos por um web app do Google Apps Script. As pontuações ficam salvas numa planilha do Google Sheets.

## Jogos

- **Deslize**: arraste blocos para os lados e complete linhas. A cada jogada sobe uma linha nova por baixo. Blocos da mesma cor lado a lado valem mais pontos: um grupo de N casas vale N² × 10, e uma linha de uma cor só vale o dobro. A pontuação é multiplicada pela fase e pelo combo. A partida acaba quando um bloco passa do topo.
- **Coroas**: puzzle de lógica 8×8. Coloque uma coroa em cada linha, coluna e região de cor, sem que duas coroas se encostem (nem na diagonal). Os tabuleiros são gerados na hora, sempre com solução única, e a dificuldade sobe com a fase: o gerador resolve cada puzzle como uma pessoa faria e escolhe os que exigem técnicas mais elaboradas. A **Dica** não revela a resposta: ela mostra o próximo raciocínio que dá para fazer (destaca o motivo, marca as casas que viram X e explica). Pontos pela dificuldade, com bônus por tempo e desconto por dica.

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
3. Para testar no computador, use o link `/dev` (sempre mostra o código salvo; no celular costuma não abrir).
4. O link para jogar (inclusive no celular) é o da implantação **Minigames** (App da Web, "Executar como: eu", "Quem pode acessar: qualquer pessoa"):
   https://script.google.com/macros/s/AKfycbxap0AhLvUKMbhlchR5ls_9rhNUyUHjKoX1Tddq4_ba80ciGt0RLKYEmZ9N2GRXSWWp/exec
5. O `/exec` mostra uma versão fixa. Depois de mudar o código: **Implantar → Gerenciar implantações → lápis → Versão: Nova versão → Implantar**. O link continua o mesmo.

## Testar localmente

```bash
python3 -m http.server 8765 -d apps-script
```

Depois abra http://localhost:8765/Deslize.html ou http://localhost:8765/Coroas.html.
