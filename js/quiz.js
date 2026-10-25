/* Spanish in 15: quiz engine (multiple choice, type the answer, listen and choose, match pairs). */
(function () {
  "use strict";
  var S = window.S15, esc = S.esc;
  var Quiz = (S.Quiz = {});
  var ACCENTS = ["á", "é", "í", "ó", "ú", "ñ", "ü", "¿", "¡"];

  function speakBtn(text, label, extra) {
    if (!S.speech.supported) return "";
    return '<button type="button" class="btn-icon speak ' + (extra || "") + '" data-say="' + esc(text) + '" aria-label="' + esc(label || ("Play: " + text)) + '"><span aria-hidden="true">' + S.icon("speaker") + "</span></button>";
  }
  Quiz.speakBtn = speakBtn;

  /*
    Run a list of questions inside el.
    opts.onDone(score, total, results) is called after the last question.
  */
  Quiz.run = function (el, questions, opts) {
    opts = opts || {};
    var i = 0, score = 0, results = [];
    var qs = questions.map(function (q) { return prepare(q); });

    function next() {
      if (i >= qs.length) { if (opts.onDone) opts.onDone(score, qs.length, results); return; }
      var q = qs[i];
      el.innerHTML =
        '<div class="quiz-head"><span class="pill">Question ' + (i + 1) + " of " + qs.length + "</span>" +
        '<span class="muted small">' + esc(typeLabel(q.type)) + "</span></div>" +
        '<div class="progress-bar" aria-hidden="true"><span style="width:' + Math.round((i / qs.length) * 100) + '%"></span></div>' +
        '<div class="quiz-body"></div>' +
        '<div class="feedback" role="status" aria-live="polite"></div>' +
        '<div class="quiz-actions"></div>';
      var body = el.querySelector(".quiz-body");
      var fb = el.querySelector(".feedback");
      var actions = el.querySelector(".quiz-actions");
      function answered(ok, html) {
        if (ok) score++;
        results.push({ q: q, ok: ok });
        fb.className = "feedback " + (ok ? "good" : "bad");
        fb.innerHTML = html;
        actions.innerHTML = '<button type="button" class="btn primary wide" data-next>' + (i + 1 < qs.length ? "Next question" : "See results") + "</button>";
        var nb = actions.querySelector("[data-next]");
        nb.addEventListener("click", function () { i++; next(); });
        nb.focus();
      }
      renderers[q.type](body, q, answered, actions);
      var first = body.querySelector("input, button.choice, button.match-item");
      if (first && q.type === "type") first.focus();
    }
    next();
  };

  function typeLabel(t) {
    return { mc: "Multiple choice", type: "Type the answer", listen: "Listen and choose", match: "Match pairs" }[t] || "";
  }

  function prepare(q) {
    q = Object.assign({}, q);
    if (q.type === "listen" && !S.speech.supported) {
      q.type = "mc";
      q.prompt = "Audio is not available in this browser, so read it instead: " + q.say + ". Choose the same phrase.";
    }
    if (q.choices && !q.keepOrder) q.choices = S.shuffle(q.choices);
    return q;
  }

  var renderers = {
    mc: function (body, q, answered) {
      body.innerHTML =
        '<p class="prompt">' + esc(q.prompt) + (q.say ? " " + speakBtn(q.say) : "") + "</p>" +
        '<div class="choices" role="group" aria-label="Answer choices">' +
        q.choices.map(function (c) { return '<button type="button" class="choice" data-choice="' + esc(c) + '">' + esc(c) + "</button>"; }).join("") +
        "</div>";
      body.querySelectorAll(".choice").forEach(function (b) {
        b.addEventListener("click", function () {
          var pick = b.getAttribute("data-choice"), ok = pick === q.answer;
          body.querySelectorAll(".choice").forEach(function (x) {
            x.disabled = true;
            if (x.getAttribute("data-choice") === q.answer) x.classList.add("ok");
          });
          if (!ok) b.classList.add("bad");
          answered(ok, (ok ? "<strong>Correct!</strong> " : "<strong>Not quite.</strong> The answer is <strong>" + esc(q.answer) + "</strong>. ") + esc(q.explain || ""));
        });
      });
    },

    listen: function (body, q, answered) {
      body.innerHTML =
        '<p class="prompt">' + esc(q.prompt || "Listen and choose what you hear.") + "</p>" +
        '<div class="listen-row">' +
        '<button type="button" class="btn big-play" data-say="' + esc(q.say) + '" aria-label="Play the audio">' + S.icon("speaker") + " Play</button>" +
        '<button type="button" class="btn ghost" data-say="' + esc(q.say) + '" data-rate="0.6" aria-label="Play the audio slowly">Slow</button>' +
        "</div>" +
        '<div class="choices" role="group" aria-label="Answer choices">' +
        q.choices.map(function (c) { return '<button type="button" class="choice" lang="es" data-choice="' + esc(c) + '">' + esc(c) + "</button>"; }).join("") +
        "</div>";
      setTimeout(function () { S.speech.speak(q.say); }, 250);
      body.querySelectorAll(".choice").forEach(function (b) {
        b.addEventListener("click", function () {
          var pick = b.getAttribute("data-choice"), ok = pick === q.answer;
          body.querySelectorAll(".choice").forEach(function (x) {
            x.disabled = true;
            if (x.getAttribute("data-choice") === q.answer) x.classList.add("ok");
          });
          if (!ok) b.classList.add("bad");
          answered(ok, (ok ? "<strong>Correct!</strong> " : "<strong>Not quite.</strong> You heard <strong>" + esc(q.answer) + "</strong>. ") + (q.meaning ? esc(q.answer) + " means " + esc(q.meaning) + "." : ""));
        });
      });
    },

    type: function (body, q, answered, actions) {
      var answers = [q.answer].concat(q.accept || []);
      var id = "ans-" + Math.random().toString(36).slice(2, 8);
      body.innerHTML =
        '<p class="prompt">' + esc(q.prompt) + "</p>" +
        '<form class="type-form" autocomplete="off">' +
        '<label for="' + id + '" class="label">Your answer in Spanish</label>' +
        '<input id="' + id + '" class="text-input" type="text" lang="es" autocapitalize="off" autocorrect="off" spellcheck="false" inputmode="text">' +
        '<div class="accent-keys" role="group" aria-label="Insert special characters">' +
        ACCENTS.map(function (a) { return '<button type="button" class="key" data-key="' + a + '" aria-label="Insert ' + a + '">' + a + "</button>"; }).join("") +
        "</div>" +
        '<div class="row gap"><button type="submit" class="btn primary">Check</button>' +
        '<button type="button" class="btn ghost" data-giveup>Show answer</button></div>' +
        "</form>";
      var input = body.querySelector("input"), form = body.querySelector("form");
      body.querySelectorAll(".key").forEach(function (k) {
        k.addEventListener("click", function () {
          var ch = k.getAttribute("data-key"), s = input.selectionStart || input.value.length, e = input.selectionEnd || input.value.length;
          input.value = input.value.slice(0, s) + ch + input.value.slice(e);
          input.focus();
          input.setSelectionRange(s + 1, s + 1);
        });
      });
      function lock() { input.disabled = true; body.querySelectorAll("form button").forEach(function (b) { b.disabled = true; }); }
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        if (!input.value.trim()) { input.focus(); return; }
        var r = S.checkTyped(input.value, answers);
        lock();
        var say = speakBtn(q.answer);
        if (r.ok && r.exact) answered(true, "<strong>Correct!</strong> <span lang=\"es\">" + esc(q.answer) + "</span> " + say + " " + esc(q.explain || ""));
        else if (r.ok) answered(true, "<strong>Correct!</strong> Watch the accent: <strong lang=\"es\">" + esc(r.match) + "</strong> " + say + " " + esc(q.explain || ""));
        else answered(false, "<strong>Not quite.</strong> The answer is <strong lang=\"es\">" + esc(q.answer) + "</strong> " + say + " " + esc(q.explain || ""));
      });
      body.querySelector("[data-giveup]").addEventListener("click", function () {
        lock();
        answered(false, "The answer is <strong lang=\"es\">" + esc(q.answer) + "</strong> " + speakBtn(q.answer) + " " + esc(q.explain || ""));
      });
    },

    match: function (body, q, answered) {
      var left = S.shuffle(q.pairs.map(function (p, i) { return { t: p[0], i: i }; }));
      var right = S.shuffle(q.pairs.map(function (p, i) { return { t: p[1], i: i }; }));
      var mistakes = 0, matched = 0, sel = null;
      body.innerHTML =
        '<p class="prompt">' + esc(q.prompt || "Match each Spanish word to its meaning.") + ' <span class="muted small">Tap one on each side.</span></p>' +
        '<div class="match-grid">' +
        '<div class="match-col" role="group" aria-label="Spanish">' + left.map(function (x) { return '<button type="button" class="match-item" lang="es" data-side="l" data-i="' + x.i + '" aria-pressed="false">' + esc(x.t) + "</button>"; }).join("") + "</div>" +
        '<div class="match-col" role="group" aria-label="English">' + right.map(function (x) { return '<button type="button" class="match-item" data-side="r" data-i="' + x.i + '" aria-pressed="false">' + esc(x.t) + "</button>"; }).join("") + "</div>" +
        "</div>";
      var items = body.querySelectorAll(".match-item");
      items.forEach(function (b) {
        b.addEventListener("click", function () {
          if (b.classList.contains("ok")) return;
          if (b.getAttribute("data-side") === "l") S.speech.speak(b.textContent);
          if (!sel || sel.getAttribute("data-side") === b.getAttribute("data-side")) {
            if (sel) sel.setAttribute("aria-pressed", "false");
            sel = b; b.setAttribute("aria-pressed", "true");
            return;
          }
          var a = sel; sel = null;
          a.setAttribute("aria-pressed", "false");
          if (a.getAttribute("data-i") === b.getAttribute("data-i")) {
            a.classList.add("ok"); b.classList.add("ok"); a.disabled = true; b.disabled = true;
            matched++;
            if (matched === q.pairs.length) {
              var ok = mistakes === 0;
              answered(ok, ok ? "<strong>Perfect match!</strong>" : "<strong>All matched</strong> with " + mistakes + " wrong " + (mistakes === 1 ? "try" : "tries") + ". Full points need zero wrong tries.");
            }
          } else {
            mistakes++;
            a.classList.add("shake"); b.classList.add("shake");
            setTimeout(function () { a.classList.remove("shake"); b.classList.remove("shake"); }, 450);
          }
        });
      });
    }
  };

  /* ---------- question generators for practice mode ---------- */
  function pickOthers(pool, word, field, n) {
    var seen = {}; seen[word[field]] = 1;
    var same = S.shuffle(pool.filter(function (w) { return w.lesson === word.lesson; }));
    var rest = S.shuffle(pool.filter(function (w) { return w.lesson !== word.lesson; }));
    var out = [];
    same.concat(rest).forEach(function (w) {
      if (out.length < n && !seen[w[field]]) { seen[w[field]] = 1; out.push(w[field]); }
    });
    return out;
  }
  function typable(w) { return w.es.indexOf("_") < 0; }

  Quiz.make = {
    mc: function (w, pool) {
      if (Math.random() < 0.5) {
        return { type: "mc", prompt: "What does “" + w.es + "” mean?", say: w.speak || w.es, choices: [w.en].concat(pickOthers(pool, w, "en", 3)), answer: w.en, explain: w.es + " means " + w.en + "." };
      }
      return { type: "mc", prompt: "How do you say “" + w.en + "” in Spanish?", choices: [w.es].concat(pickOthers(pool, w, "es", 3)), answer: w.es, explain: "Sounds like: " + w.say + "." };
    },
    type: function (w) {
      return { type: "type", prompt: "Type the Spanish for “" + w.en + "”.", answer: w.es, accept: w.accept || [], explain: "Sounds like: " + w.say + "." };
    },
    listen: function (w, pool) {
      return { type: "listen", prompt: "Listen and choose what you hear.", say: w.es, choices: [w.es].concat(pickOthers(pool.filter(typable), w, "es", 3)), answer: w.es, meaning: w.en };
    }
  };

  /* Build a practice set from a word list. kind: mixed | mc | type | listen | match */
  Quiz.generate = function (words, kind, count) {
    count = count || 8;
    var pool = words.slice();
    if (pool.length < 4) return [];
    var qs = [];
    if (kind === "match") {
      var rounds = Math.min(4, Math.floor(pool.length / 4));
      var sh = S.shuffle(pool);
      for (var r = 0; r < rounds; r++) {
        qs.push({ type: "match", prompt: "Match each Spanish word to its meaning.", pairs: sh.slice(r * 4, r * 4 + 4).map(function (w) { return [w.es, w.en]; }) });
      }
      return qs;
    }
    var picks = S.shuffle(pool).slice(0, count);
    var kinds = kind === "mixed" ? ["mc", "type", "listen", "mc", "listen", "type"] : [kind];
    picks.forEach(function (w, idx) {
      var k = kinds[idx % kinds.length];
      if (k === "type" && !typable(w)) k = "mc";
      if (k === "listen" && (!S.speech.supported || !typable(w))) k = "mc";
      qs.push(Quiz.make[k](w, pool));
    });
    if (kind === "mixed" && pool.length >= 4) {
      qs.push({ type: "match", prompt: "Match each Spanish word to its meaning.", pairs: S.shuffle(pool).slice(0, 4).map(function (w) { return [w.es, w.en]; }) });
    }
    return qs;
  };
})();
