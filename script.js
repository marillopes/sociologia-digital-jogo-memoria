/* ============================================================
   MULHERES NA CIÊNCIA · Jogo da Memória · Sociologia Digital
   Lógica do jogo. Os dados (fotos, nomes, feitos) ficam em dados.js.
   ============================================================ */
(function () {
  'use strict';

  var MULHERES = window.MULHERES || [];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var TESTE = /[?&]teste\b/.test(location.search);

  /* ---------- armazenamento (não quebra se o navegador bloquear) ---------- */
  var store = {
    ler: function (k, padrao) {
      try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : padrao; } catch (e) { return padrao; }
    },
    gravar: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignora */ } }
  };

  var FASES = {
    1: { rotulo: 'Fase 1', titulo: 'Quem é ela?', dica: 'Ache a foto e o nome de cada cientista.' },
    2: { rotulo: 'Fase 2', titulo: 'O que ela fez?', dica: 'Ache cada cientista e o que ela fez.' }
  };
  var ERROS = ['Quase! Tente outra vez.', 'Ainda não. Memorize a posição!', 'Não foi dessa vez.', 'Quase lá! Olhe com atenção.'];

  var est = {
    fase: 1,
    pares: store.ler('sd_mem_pares', 6),
    cartas: [], abertas: [], rodada: [],
    travado: false, emJogo: false,
    jogadas: 0, acertos: 0,
    inicio: 0, timer: null,
    cols: 4,
    som: store.ler('sd_mem_som', true),
    erro: 0
  };
  if ([4, 6, 8, 10].indexOf(est.pares) < 0) est.pares = 6;

  /* ---------- utilitários ---------- */
  function embaralhar(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fmt(ms) {
    var s = Math.floor(ms / 1000), m = Math.floor(s / 60);
    s = s % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  // Timers da jogada atual (conferir o par, desvirar, fim da rodada).
  // Se a rodada recomeçar ou a pessoa voltar ao menu, eles são cancelados,
  // para não mexer nas cartas da rodada nova.
  var timersJogo = [];
  function agendar(fn, ms) { timersJogo.push(setTimeout(fn, ms)); }
  function cancelarTimers() { timersJogo.forEach(clearTimeout); timersJogo = []; }

  /* ============================================================
     SORTEIO — é aqui que a rodada nunca fica igual
     ============================================================ */
  // Prefere quem apareceu menos vezes nesse aparelho, com uma boa dose de acaso.
  function sortearMulheres(n) {
    var hist = store.ler('sd_mem_hist', {});
    var ord = MULHERES.map(function (m) { return { m: m, p: (hist[m.id] || 0) + Math.random() * 1.8 }; })
      .sort(function (a, b) { return a.p - b.p; })
      .slice(0, n)
      .map(function (x) { return x.m; });
    ord.forEach(function (m) { hist[m.id] = (hist[m.id] || 0) + 1; });
    store.gravar('sd_mem_hist', hist);
    return embaralhar(ord);
  }

  // Sorteia um feito por mulher, dando preferência aos que ela ainda não mostrou.
  function sortearFeito(m, gruposUsados) {
    var vistos = store.ler('sd_mem_feitos', {});
    // só vale o que ainda existe em dados.js (ids antigos ficavam sobrando no histórico)
    var lista = (vistos[m.id] || []).filter(function (id) {
      return m.feitos.some(function (f) { return f.id === id; });
    });
    var pool = m.feitos.filter(function (f) { return !f.grupo || !gruposUsados[f.grupo]; });
    if (!pool.length) pool = m.feitos;
    var novos = pool.filter(function (f) { return lista.indexOf(f.id) < 0; });
    if (!novos.length) {
      // já viu todos os possíveis: recomeça o ciclo só deles, sem apagar o histórico dos outros
      lista = lista.filter(function (id) { return !pool.some(function (f) { return f.id === id; }); });
      novos = pool;
    }
    var f = novos[Math.floor(Math.random() * novos.length)];
    lista.push(f.id);
    vistos[m.id] = lista;
    store.gravar('sd_mem_feitos', vistos);
    return f;
  }

  function montarCartas() {
    var n = Math.min(est.pares, MULHERES.length);
    est.pares = n;
    var mulheres = sortearMulheres(n);
    var grupos = {};
    var cartas = [];
    est.rodada = [];
    mulheres.forEach(function (m) {
      var feito = null;
      if (est.fase === 2) {
        feito = sortearFeito(m, grupos);
        if (feito.grupo) grupos[feito.grupo] = true;
      }
      est.rodada.push({ m: m, feito: feito });
      if (est.fase === 1) {
        cartas.push({ id: m.id, tipo: 'foto', m: m });
        cartas.push({ id: m.id, tipo: 'nome', m: m });
      } else {
        cartas.push({ id: m.id, tipo: 'mulher', m: m });
        cartas.push({ id: m.id, tipo: 'feito', m: m, feito: feito });
      }
    });
    est.cartas = embaralhar(cartas).map(function (c, i) { c.i = i; c.virada = false; c.par = false; return c; });
  }

  /* ============================================================
     TELAS
     ============================================================ */
  function mostrar(id) {
    $$('.tela').forEach(function (t) { t.classList.toggle('ativa', t.id === id); });
  }

  function iniciar(fase) {
    pararRelogio();
    cancelarTimers();
    est.fase = fase;
    est.abertas = []; est.travado = false; est.emJogo = true;
    est.jogadas = 0; est.acertos = 0; est.inicio = 0; est.erro = 0;
    fecharModal('modal-fim');
    montarCartas();

    $('#hud-fase').textContent = FASES[fase].rotulo;
    $('#hud-sub').textContent = FASES[fase].titulo;
    mensagem(FASES[fase].dica);
    atualizarHUD();
    $('#st-tempo').textContent = '0:00';

    mostrar('tela-jogo');
    renderTabuleiro();
    // espera o navegador medir a tela para calcular o tamanho das cartas
    requestAnimationFrame(function () { layout(); ajustarTextos(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustarTextos);
  }

  function voltarMenu() {
    pararRelogio();
    cancelarTimers();
    est.emJogo = false;
    fecharModal('modal-fim');
    mostrar('tela-menu');
  }

  function atualizarHUD() {
    $('#st-jogadas').textContent = est.jogadas;
    $('#st-pares').textContent = est.acertos + '/' + est.pares;
  }

  function mensagem(txt, tipo) {
    var f = $('#faixa');
    f.textContent = txt;
    f.className = 'faixa' + (tipo ? ' ' + tipo : '');
  }

  /* ============================================================
     TABULEIRO
     ============================================================ */
  function frenteHTML(c) {
    var nome = esc(c.m.nome);
    switch (c.tipo) {
      case 'foto':
        return '<img src="' + c.m.foto + '" alt="Foto de ' + nome + '" draggable="false">';
      case 'nome':
        return '<span class="txt"><span class="cx" data-k=".17"><span class="t">' + nome + '</span></span></span>';
      case 'mulher':
        return '<img src="' + c.m.foto + '" alt="Foto de ' + nome + '" draggable="false">' +
               '<span class="rib"><span class="cx" data-k=".105"><span class="t">' + nome + '</span></span></span>';
      default: // feito
        return '<span class="aspas" aria-hidden="true">“</span>' +
               '<span class="txt"><span class="cx" data-k=".115"><span class="t">' + esc(c.feito.texto) + '</span></span></span>';
    }
  }

  function rotuloAberta(c) {
    if (c.tipo === 'foto' || c.tipo === 'mulher') return 'Foto de ' + c.m.nome;
    if (c.tipo === 'nome') return 'Nome: ' + c.m.nome;
    return 'Descrição: ' + c.feito.texto;
  }

  function renderTabuleiro() {
    var grade = $('#grade');
    grade.innerHTML = '';
    var total = est.cartas.length;
    est.cartas.forEach(function (c, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'carta';
      b.style.setProperty('--n', i);
      b.dataset.i = i;
      if (TESTE) b.dataset.par = c.id;
      b.setAttribute('aria-label', 'Carta ' + (i + 1) + ' de ' + total + ', virada para baixo');
      b.innerHTML =
        '<span class="carta-in">' +
          '<span class="face costas"><img src="img/sd.png" alt="" draggable="false"></span>' +
          '<span class="face frente f-' + c.tipo + '">' + frenteHTML(c) + '</span>' +
        '</span>';
      b.addEventListener('click', function () { virar(i); });
      grade.appendChild(b);
    });
  }

  function elCarta(i) { return $('.carta[data-i="' + i + '"]'); }

  // Escolhe colunas e tamanho para as cartas ocuparem o máximo da tela.
  function layout() {
    var tb = $('#tabuleiro');
    var n = est.cartas.length;
    if (!n || !tb.clientWidth) return;
    var cs = getComputedStyle(tb);
    var W = tb.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var H = tb.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    var gap = Math.max(6, Math.min(14, W / 38));
    var minW = est.fase === 2 ? 64 : 52;       // menor carta que ainda dá para ler
    var maxW = est.fase === 2 ? 210 : 190;
    var melhor = null;
    for (var c = 2; c <= Math.min(n, 8); c++) {
      var r = Math.ceil(n / c);
      var cw = Math.min((W - gap * (c - 1)) / c, ((H - gap * (r - 1)) / r) * 0.75, maxW);
      // cartas maiores são melhores, mas fileira incompleta (sobrando buraco) perde pontos
      var nota = cw * Math.sqrt(n / (c * r));
      if (!melhor || nota > melhor.nota) melhor = { c: c, cw: cw, nota: nota };
    }
    if (melhor.cw < minW) {
      // não cabe tudo de uma vez: usa cartas legíveis e deixa o tabuleiro rolar
      var cc = Math.max(2, Math.floor((W + gap) / (minW + gap)));
      melhor = { c: cc, cw: Math.min((W - gap * (cc - 1)) / cc, maxW) };
    }
    est.cols = melhor.c;
    tb.style.setProperty('--cols', melhor.c);
    tb.style.setProperty('--cw', Math.floor(melhor.cw) + 'px');
    tb.style.setProperty('--gap', Math.round(gap) + 'px');
  }

  // Reduz a fonte de cada texto até ele caber na carta (nomes e descrições têm tamanhos bem diferentes).
  function ajustarTextos() {
    var cw = parseFloat(getComputedStyle($('#tabuleiro')).getPropertyValue('--cw')) || 100;
    $$('#grade .cx').forEach(function (cx) {
      var t = cx.firstElementChild;
      var fs = cw * parseFloat(cx.dataset.k);
      t.style.fontSize = fs + 'px';
      var guarda = 0;
      while ((t.offsetHeight > cx.clientHeight + 0.5 || t.scrollWidth > t.clientWidth + 0.5) && fs > 6.5 && guarda++ < 60) {
        fs -= 0.5;
        t.style.fontSize = fs + 'px';
      }
    });
  }

  /* ============================================================
     JOGADA
     ============================================================ */
  function setVirada(i, v) {
    var c = est.cartas[i], el = elCarta(i);
    c.virada = v;
    el.classList.toggle('virada', v);
    el.setAttribute('aria-label', v
      ? rotuloAberta(c)
      : 'Carta ' + (i + 1) + ' de ' + est.cartas.length + ', virada para baixo');
  }

  function virar(i) {
    if (est.travado || !est.emJogo) return;
    var c = est.cartas[i];
    if (c.virada || c.par) return;
    if (!est.inicio) iniciarRelogio();
    setVirada(i, true);
    tocar('flip');
    est.abertas.push(i);
    if (est.abertas.length === 2) {
      est.travado = true;
      est.jogadas++;
      atualizarHUD();
      agendar(verificar, 650);
    }
  }

  function verificar() {
    if (est.abertas.length < 2) return;
    var a = est.abertas[0], b = est.abertas[1];
    var ca = est.cartas[a], cb = est.cartas[b];
    if (ca.id === cb.id) {
      [ca, cb].forEach(function (c) { c.par = true; elCarta(c.i).classList.add('par'); });
      est.acertos++;
      tocar('ok');
      vibrar(30);
      var m = ca.m, f = ca.feito || cb.feito;
      mensagem('✓ ' + m.nome + (f ? ': ' + f.texto : ' — ' + m.area), 'ok');
      est.abertas = [];
      est.travado = false;
      atualizarHUD();
      if (est.acertos === est.pares) agendar(fim, 1000);
    } else {
      [a, b].forEach(function (i) { elCarta(i).classList.add('errada'); });
      tocar('erro');
      mensagem(ERROS[est.erro++ % ERROS.length]);
      agendar(function () {
        [a, b].forEach(function (i) { setVirada(i, false); elCarta(i).classList.remove('errada'); });
        est.abertas = [];
        est.travado = false;
      }, 850);
    }
  }

  /* ---------- relógio ---------- */
  function iniciarRelogio() {
    est.inicio = Date.now();
    est.timer = setInterval(function () { $('#st-tempo').textContent = fmt(Date.now() - est.inicio); }, 250);
  }
  function pararRelogio() { if (est.timer) { clearInterval(est.timer); est.timer = null; } }

  /* ============================================================
     FIM DA RODADA
     ============================================================ */
  function fim() {
    pararRelogio();
    est.emJogo = false;
    var ms = Date.now() - est.inicio;
    var razao = est.jogadas / est.pares;
    var estrelas = razao <= 1.6 ? 3 : (razao <= 2.6 ? 2 : 1);

    // recorde por fase + dificuldade (menos jogadas; empate decide pelo tempo)
    var chave = est.fase + '-' + est.pares;
    var recs = store.ler('sd_mem_recordes', {});
    var r = recs[chave];
    var novo = !r || est.jogadas < r.j || (est.jogadas === r.j && ms < r.t);
    if (novo) { recs[chave] = { j: est.jogadas, t: ms }; store.gravar('sd_mem_recordes', recs); }

    $('#fim-fase').textContent = FASES[est.fase].rotulo + ' concluída · ' + FASES[est.fase].titulo;
    $('#fim-titulo').textContent = estrelas === 3 ? 'Incrível!' : 'Parabéns!';
    var es = $('#fim-estrelas');
    es.innerHTML = '★★★'.split('').map(function (s, k) {
      return k < estrelas ? s : '<span class="apagada">' + s + '</span>';
    }).join('');
    es.setAttribute('aria-label', estrelas + ' de 3 estrelas');
    $('#fim-jogadas').textContent = est.jogadas;
    $('#fim-tempo').textContent = fmt(ms);
    $('#fim-recorde').hidden = !(novo && r);   // só comemora recorde se havia um anterior

    $('#fim-lista').innerHTML = est.rodada.map(function (x) {
      return '<li><img src="' + x.m.foto + '" alt=""><div><strong>' + esc(x.m.nome) + '</strong><small>' + esc(x.m.area) + '</small>' +
             (x.feito ? '<p>' + esc(x.feito.texto) + '</p>' : '') + '</div></li>';
    }).join('');

    var prox = $('#fim-prox'), outro = $('#fim-de-novo');
    if (est.fase === 1) {
      prox.textContent = 'Fase 2: O que ela fez? →';
      prox.onclick = function () { iniciar(2); };
      outro.textContent = 'Jogar a Fase 1 de novo';
      outro.onclick = function () { iniciar(1); };
    } else {
      prox.textContent = 'Jogar de novo (novo sorteio)';
      prox.onclick = function () { iniciar(2); };
      outro.textContent = 'Voltar para a Fase 1';
      outro.onclick = function () { iniciar(1); };
    }
    abrirModal('modal-fim', prox);
    tocar('vitoria');
    vibrar([40, 60, 40]);
    confete();
  }

  function confete() {
    var box = $('#confete');
    box.innerHTML = '';
    var cores = ['#ffd800', '#ffffff', '#6ea0ff', '#ffd800'];
    for (var i = 0; i < 44; i++) {
      var p = document.createElement('i');
      p.style.left = Math.random() * 100 + '%';
      p.style.background = cores[i % cores.length];
      p.style.animationDuration = (2 + Math.random() * 2) + 's';
      p.style.animationDelay = (Math.random() * 0.8) + 's';
      p.style.transform = 'rotate(' + Math.floor(Math.random() * 90) + 'deg)';
      box.appendChild(p);
    }
  }

  /* ---------- modais ---------- */
  var ultimoFoco = null;
  function abrirModal(id, foco) {
    ultimoFoco = document.activeElement;
    $('#' + id).hidden = false;
    if (foco) foco.focus();
  }
  function fecharModal(id) {
    var m = $('#' + id);
    if (m.hidden) return;
    m.hidden = true;
    if (ultimoFoco && ultimoFoco.focus && document.contains(ultimoFoco)) ultimoFoco.focus();
  }

  /* ============================================================
     SOM E VIBRAÇÃO
     ============================================================ */
  var ctx = null;
  function audio() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; }
    }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function nota(freq, ini, dur, tipo, vol) {
    var a = audio();
    if (!a) return;
    var t = a.currentTime + ini;
    var o = a.createOscillator(), g = a.createGain();
    o.type = tipo || 'sine';
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.1, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(a.destination);
    o.start(t); o.stop(t + dur + 0.03);
  }
  function tocar(tipo) {
    if (!est.som) return;
    if (tipo === 'flip') nota(520, 0, 0.06, 'triangle', 0.07);
    else if (tipo === 'ok') { nota(660, 0, 0.12, 'sine', 0.13); nota(880, 0.1, 0.2, 'sine', 0.13); }
    else if (tipo === 'erro') { nota(220, 0, 0.18, 'sawtooth', 0.05); nota(170, 0.11, 0.22, 'sawtooth', 0.045); }
    else if (tipo === 'vitoria') [523, 659, 784, 1047].forEach(function (f, k) { nota(f, k * 0.12, 0.28, 'triangle', 0.13); });
  }
  function vibrar(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) { /* ignora */ } }

  function aplicarSom() {
    var b = $('#btn-som');
    b.setAttribute('aria-pressed', est.som ? 'true' : 'false');
    b.setAttribute('aria-label', est.som ? 'Som ligado' : 'Som desligado');
  }

  /* ============================================================
     EVENTOS
     ============================================================ */
  function ligar() {
    $$('.fase-btn').forEach(function (b) {
      b.addEventListener('click', function () { audio(); iniciar(Number(b.dataset.fase)); });
    });

    $$('#seg-dif button').forEach(function (b) {
      b.setAttribute('aria-pressed', Number(b.dataset.pares) === est.pares ? 'true' : 'false');
      b.addEventListener('click', function () {
        est.pares = Number(b.dataset.pares);
        store.gravar('sd_mem_pares', est.pares);
        $$('#seg-dif button').forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
      });
    });

    $('#btn-menu').addEventListener('click', voltarMenu);
    $('#fim-menu').addEventListener('click', voltarMenu);
    $('#btn-som').addEventListener('click', function () {
      est.som = !est.som; store.gravar('sd_mem_som', est.som); aplicarSom();
      if (est.som) tocar('flip');
    });
    $('#btn-como').addEventListener('click', function () { abrirModal('modal-como', $('#como-fechar')); });
    $('#como-fechar').addEventListener('click', function () { fecharModal('modal-como'); });
    $('#modal-como').addEventListener('click', function (e) { if (e.target.id === 'modal-como') fecharModal('modal-como'); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') fecharModal('modal-como');
    });

    // setas do teclado andam pelas cartas
    $('#grade').addEventListener('keydown', function (e) {
      var passo = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: est.cols, ArrowUp: -est.cols }[e.key];
      if (!passo) return;
      var cartas = $$('#grade .carta');
      var atual = cartas.indexOf(document.activeElement);
      if (atual < 0) return;
      var prox = cartas[atual + passo];
      if (prox) { prox.focus(); e.preventDefault(); }
    });

    var espera;
    function recalcular() {
      clearTimeout(espera);
      espera = setTimeout(function () {
        if ($('#tela-jogo').classList.contains('ativa') && est.cartas.length) { layout(); ajustarTextos(); }
      }, 120);
    }
    window.addEventListener('resize', recalcular);
    window.addEventListener('orientationchange', recalcular);

    // carrega as fotos antes, para a carta não "piscar" ao virar
    MULHERES.forEach(function (m) { var im = new Image(); im.src = m.foto; });
    aplicarSom();
  }

  ligar();

  /* ---------- ganchos só para testes automáticos (?teste=1) ---------- */
  if (TESTE) {
    window.__sd = {
      est: est,
      revelarTodas: function () { est.cartas.forEach(function (c) { setVirada(c.i, true); }); },
      iniciar: iniciar
    };
  }
})();
