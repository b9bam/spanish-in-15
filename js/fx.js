/* Spanish in 15: original mascot (Coli, a burgundy hummingbird) and confetti. */
(function () {
  "use strict";
  var S = window.S15;

  /* mood: happy | cheer | sad | think. Inline SVG, decorative unless a label is given. */
  S.mascot = function (mood, size, label) {
    mood = mood || "happy"; size = size || 96;
    var eye;
    if (mood === "cheer" || mood === "happy") eye = '<path d="M64 50 q7 -8 14 0" fill="none" stroke="#2a1d20" stroke-width="4" stroke-linecap="round"/>';
    else if (mood === "sad") eye = '<circle cx="71" cy="52" r="8" fill="#fff"/><circle cx="72" cy="54" r="4.5" fill="#2a1d20"/><path d="M62 42 l14 4" stroke="#2a1d20" stroke-width="3" stroke-linecap="round"/><path d="M66 63 q-2 6 1 8 q3 -2 1 -8z" fill="#7cc4e8"/>';
    else eye = '<circle cx="71" cy="51" r="9" fill="#fff"/><circle cx="73" cy="51" r="5" fill="#2a1d20"/><circle cx="75" cy="49" r="1.6" fill="#fff"/>';
    var wing = mood === "cheer"
      ? '<path d="M44 58 C30 30 18 22 10 20 C16 36 26 52 42 66 Z" fill="#6e1a33"/><path d="M40 60 C28 40 20 34 14 32" stroke="#b8466a" stroke-width="2" fill="none"/>'
      : '<path d="M40 62 C22 60 12 68 8 80 C24 80 36 76 46 70 Z" fill="#6e1a33"/><path d="M38 66 C26 66 18 72 14 77" stroke="#b8466a" stroke-width="2" fill="none"/>';
    var mouth = mood === "sad" ? "" : '<path d="M86 60 q-3 4 -8 4" fill="none" stroke="#6e1a33" stroke-width="2" stroke-linecap="round"/>';
    return '<svg class="mascot mascot-' + mood + '" width="' + size + '" height="' + size + '" viewBox="0 0 120 120" ' +
      (label ? 'role="img" aria-label="' + S.esc(label) + '"' : 'aria-hidden="true" focusable="false"') + ">" +
      '<ellipse cx="60" cy="112" rx="26" ry="4" fill="rgba(0,0,0,.12)"/>' +
      '<path d="M30 84 L12 104 L26 100 L22 112 L38 94 Z" fill="#6e1a33"/>' +
      '<ellipse cx="58" cy="70" rx="34" ry="32" fill="#8E2443"/>' +
      '<ellipse cx="64" cy="82" rx="20" ry="17" fill="#f6e3d3"/>' +
      '<path d="M54 38 C52 26 60 18 66 16 C64 24 66 30 70 36 Z" fill="#e0a33a"/>' +
      '<path d="M88 58 L118 52 L88 64 Z" fill="#e0a33a"/>' +
      eye + mouth +
      '<circle cx="80" cy="66" r="5" fill="#e88aa5" opacity=".7"/>' +
      wing +
      '<path d="M52 101 v8 M64 101 v8" stroke="#e0a33a" stroke-width="3" stroke-linecap="round"/>' +
      "</svg>";
  };
  S.MASCOT_NAME = "Coli";

  /* Confetti burst on a full-screen canvas. Skipped when the user prefers reduced motion. */
  S.confetti = function (ms) {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var c = document.createElement("canvas");
    c.className = "confetti"; c.setAttribute("aria-hidden", "true");
    document.body.appendChild(c);
    var dpr = window.devicePixelRatio || 1, W = window.innerWidth, H = window.innerHeight;
    c.width = W * dpr; c.height = H * dpr;
    var g = c.getContext("2d"); g.scale(dpr, dpr);
    var colors = ["#8E2443", "#e0a33a", "#f6e3d3", "#c24d6e", "#3e8e7e", "#ffffff"];
    var parts = [];
    for (var i = 0; i < 160; i++) {
      parts.push({
        x: W / 2 + (Math.random() - 0.5) * 80, y: H * 0.35,
        vx: (Math.random() - 0.5) * 12, vy: -Math.random() * 13 - 4,
        w: 6 + Math.random() * 6, h: 8 + Math.random() * 8,
        r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
        c: colors[i % colors.length]
      });
    }
    var start = performance.now(), dur = ms || 2600;
    (function frame(now) {
      var t = now - start;
      g.clearRect(0, 0, W, H);
      parts.forEach(function (p) {
        p.vy += 0.32; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        g.save(); g.translate(p.x, p.y); g.rotate(p.r);
        g.globalAlpha = Math.max(0, 1 - t / dur);
        g.fillStyle = p.c; g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r)));
        g.restore();
      });
      if (t < dur) requestAnimationFrame(frame); else c.remove();
    })(start);
  };
})();

/* Clear any leftover confetti when the view changes. */
(function (S) {
  var prev = S.afterRoute;
  S.afterRoute = function (name) {
    document.querySelectorAll("canvas.confetti").forEach(function (c) { c.remove(); });
    if (prev) prev(name);
  };
})(window.S15);
