/**
 * Minigames — backend Apps Script
 *
 * Arquivos no projeto Apps Script:
 *   Code.gs      (este)
 *   Index.html   (menu + ranking)
 *   Deslize.html (jogo 1)
 *   Coroas.html  (jogo 2)
 */

const SHEET_ID = '17PPWbAMvQQLiF37K8FONsOvNZdJxy5OZdhHYrG39rFQ';
const ABA_SCORES = 'Scores';
const CABECALHO = ['Data', 'Jogo', 'Jogador', 'Pontos', 'Fase', 'Linhas', 'Tempo (s)'];

// Páginas de jogo: ?jogo=<id>  ->  arquivo HTML
const JOGOS = {
  deslize: 'Deslize',
  coroas: 'Coroas',
};

function doGet(e) {
  const jogo = e && e.parameter && e.parameter.jogo;
  let out;
  if (jogo && JOGOS[jogo]) {
    out = HtmlService.createHtmlOutputFromFile(JOGOS[jogo]);
  } else {
    const t = HtmlService.createTemplateFromFile('Index');
    t.baseUrl = ScriptApp.getService().getUrl();
    out = t.evaluate();
  }
  return out
    .setTitle('Minigames')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** URL do web app (usada pelos jogos para o botão "Menu"). */
function getUrl() {
  return ScriptApp.getService().getUrl();
}

function aba_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sh = ss.getSheetByName(ABA_SCORES);
  if (!sh) {
    sh = ss.insertSheet(ABA_SCORES);
    sh.appendRow(CABECALHO);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, CABECALHO.length).setFontWeight('bold');
  } else if (sh.getRange(1, CABECALHO.length).getValue() === '') {
    // aba criada por uma versão anterior: completa o cabeçalho
    sh.getRange(1, 1, 1, CABECALHO.length).setValues([CABECALHO]).setFontWeight('bold');
  }
  return sh;
}

/**
 * Salva uma partida.
 * @param {{jogo:string, nome:string, pontos:number, fase:number, linhas?:number, tempo?:number}} d
 */
function salvarScore(d) {
  d = d || {};
  const jogo = String(d.jogo || '').slice(0, 30);
  if (!JOGOS[jogo]) throw new Error('Jogo desconhecido: ' + jogo);
  const nome = String(d.nome || 'Anônimo').trim().slice(0, 40) || 'Anônimo';
  const num = (v) => Math.max(0, Math.floor(Number(v) || 0));
  const opt = (v) => (v === undefined || v === null ? '' : num(v));

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    aba_().appendRow([new Date(), jogo, nome, num(d.pontos), num(d.fase), opt(d.linhas), opt(d.tempo)]);
  } finally {
    lock.releaseLock();
  }
  return { ok: true, recorde: getRecorde(jogo) };
}

function linhasDoJogo_(jogo) {
  const sh = aba_();
  const last = sh.getLastRow();
  if (last < 2) return [];
  return sh.getRange(2, 1, last - 1, CABECALHO.length).getValues().filter((r) => r[1] === jogo);
}

/** Maior pontuação registrada para o jogo. */
function getRecorde(jogo) {
  return linhasDoJogo_(jogo).reduce((m, r) => Math.max(m, Number(r[3]) || 0), 0);
}

/** Top N do jogo, melhor resultado de cada jogador (datas viram texto: google.script.run não aceita Date). */
function getTop(jogo, n) {
  const tz = Session.getScriptTimeZone();
  const melhor = {};
  for (const r of linhasDoJogo_(jogo)) {
    const k = String(r[2]).trim().toLowerCase();
    if (!melhor[k] || Number(r[3]) > Number(melhor[k][3])) melhor[k] = r;
  }
  return Object.values(melhor)
    .sort((a, b) => b[3] - a[3])
    .slice(0, n || 10)
    .map((r) => ({
      nome: String(r[2]),
      pontos: Number(r[3]) || 0,
      fase: Number(r[4]) || 0,
      data: r[0] instanceof Date ? Utilities.formatDate(r[0], tz, 'dd/MM/yy') : '',
    }));
}
