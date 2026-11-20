// Agenten-Graph: ein Agent durchläuft den Forschungszyklus (Sechsring) und
// greift an drei Stellen auf Ressourcen zu (Seitenketten).
(function () {
  const c = document.getElementById('graph'), x = c.getContext('2d');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const INK = '#111111', ACC = '#0F766E', PAPER = '#F6F5F1', MUTED = '#5d5c57';
  const h = Math.sqrt(3) / 2;
  // Beschriftungen in der Sprache der Seite: sechs Ringschritte, dann drei Ressourcen.
  const T = c.dataset.labels.split('|');
  if (T.length !== 9) throw new Error('graph: data-labels needs 9 entries, got ' + T.length);
  // Ring im Uhrzeigersinn, oben beginnend. l: Beschriftung [dx, dy, Ausrichtung].
  const RING = [
    { p: [0, -1],   t: T[0],  l: [-13, -9, 'right'], res: 0 },
    { p: [h, -.5],  t: T[1],    l: [14, 4, 'left'] },
    { p: [h, .5],   t: T[2], l: [14, -7, 'left'],   res: 1 },
    { p: [0, 1],    t: T[3],    l: [0, 24, 'center'] },
    { p: [-h, .5],  t: T[4],    l: [-14, -7, 'right'], res: 2 },
    { p: [-h, -.5], t: T[5],  l: [-14, 4, 'right'] },
  ];
  const RES = [
    { p: [0, -1.85],        t: T[6],  l: [0, -13, 'center'] },
    { p: [1.9 * h, 1.1],    t: T[7], l: [0, 23, 'center'] },
    { p: [-1.9 * h, 1.1],   t: T[8],    l: [0, 23, 'center'] },
  ];
  const DWELL = 1.3, MOVE = 1.5, STEP = DWELL + MOVE;
  let W, H, S;
  function size() {
    const r = c.getBoundingClientRect(), d = devicePixelRatio || 1;
    W = r.width; H = r.height; c.width = W * d; c.height = H * d; x.setTransform(d, 0, 0, d, 0, 0);
    S = Math.min(W / 4.4, H / 3.7);
  }
  const at = p => [W / 2 + p[0] * S, H / 2 + (p[1] + .375) * S];
  const mix = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  const ease = k => k * k * (3 - 2 * k);
  function line(a, b, alpha) { x.globalAlpha = alpha; x.strokeStyle = INK; x.lineWidth = 1; x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke(); }
  function dot(p, r, fill, stroke) { x.globalAlpha = 1; x.fillStyle = fill; x.strokeStyle = stroke; x.lineWidth = 1.2; x.beginPath(); x.arc(p[0], p[1], r, 0, 7); x.fill(); x.stroke(); }
  function text(n, p, on) {
    x.globalAlpha = 1; x.fillStyle = on ? INK : MUTED; x.textAlign = n.l[2];
    x.font = '500 ' + (W < 380 ? 10 : 11) + 'px "JetBrains Mono", monospace';
    x.fillText(n.t.toUpperCase(), p[0] + n.l[0], p[1] + n.l[1]);
  }
  function draw(ms) {
    const t = still ? 0 : ms / 1000;
    x.clearRect(0, 0, W, H);
    const phase = t / STEP, i = Math.floor(phase) % 6, f = (phase % 1) * STEP;
    const moving = f >= DWELL, j = (i + 1) % 6;
    const R = RING.map(n => at(n.p)), Q = RES.map(n => at(n.p)), mid = at([0, 0]);
    // Bindungen
    R.forEach((a, k) => {
      const b = R[(k + 1) % 6];
      line(a, b, .6);
      if (k % 2 === 0) line(mix(mix(a, b, .14), mid, .13), mix(mix(a, b, .86), mid, .13), .35); // Doppelbindung
    });
    RING.forEach((n, k) => { if (n.res !== undefined) line(R[k], Q[n.res], .6); });
    // Ressourcen
    RES.forEach((n, k) => {
      const on = !moving && RING[i].res === k;
      dot(Q[k], 4, PAPER, on ? ACC : INK); text(n, Q[k], on);
    });
    // Schritte des Zyklus
    RING.forEach((n, k) => {
      const on = !moving && k === i;
      dot(R[k], on ? 7 : 4, on ? ACC : PAPER, on ? ACC : INK); text(n, R[k], on);
    });
    // Der Agent: wandert von Schritt zu Schritt; an einem Schritt mit Ressource
    // läuft ein Abruf hinaus und zurück.
    if (moving) {
      dot(mix(R[i], R[j], ease((f - DWELL) / MOVE)), 5, ACC, ACC);
    } else if (RING[i].res !== undefined && !still) {
      const u = f / DWELL;
      dot(mix(R[i], Q[RING[i].res], ease(1 - Math.abs(2 * u - 1))), 3, ACC, ACC);
    }
    if (!still) requestAnimationFrame(draw);
  }
  size(); addEventListener('resize', () => { size(); if (still) draw(0); });
  document.fonts.ready.then(() => requestAnimationFrame(draw));
})();

// Dezentes Einblenden beim Scrollen.
(function () {
  const els = document.querySelectorAll('.rise');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  els.forEach(e => io.observe(e));
})();

// Sprachwahl merken, damit die Startseite beim nächsten Besuch dorthin führt.
document.querySelectorAll('.lang a').forEach(a => a.addEventListener('click', () => {
  try { localStorage.setItem('agentica-lang', a.lang); } catch (e) { /* Speicher gesperrt: Wahl gilt nur für diesen Klick */ }
}));
