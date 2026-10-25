/* Spanish in 15: one-exercise-per-screen session player.
   Progress bar, Check button, feedback bottom sheet, hearts, XP with combo, missed items repeated at the end,
   and the lesson complete screen with confetti. */
(function () {
  "use strict";
  var S = window.S15, esc = S.esc, speech = S.speech, Ex = S.Ex;
  var Session = (S.Session = {});
  var ACCENTS = ["á", "é", "í", "ó", "ú", "ñ", "ü", "¿", "¡"];

  function icon(n) { return S.icon(n); }
  function heartSvg() { return '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 21s-7.5-4.6-10-9.3C.4 8.4 2.3 4 6.3 4c2.2 0 3.7 1.3 4.7 2.7C12 5.3 13.5 4 15.7 4c4 0 5.9 4.4 4.3 7.7C19.5 16.4 12 21 12 21z"/></svg>'; }
  S.heartSvg = heartSvg;
  function sayBtn(text, label, cls) {
    if (!speech.supported || !text) return "";
    return '<button type="button" class="btn-icon speak ' + (cls || "") + '" data-say="' + esc(text) + '" aria-label="' + esc(label || "Play audio") + '">' + icon("speaker") + "</button>";
  }
  function fmtTime(ms) { var s = Math.round(ms / 1000); return Math.floor(s / 60) + ":" + (s % 60 < 10 ? "0" : "") + (s % 60); }

  /*
    opts: { title, items, mode: "lesson" | "practice", lesson, onDone(result), onQuit() }
  */
  Session.start = function (opts) {
    var items = opts.items.slice();
    if (!items.length) { S.toast("Not enough words here yet for a session."); return; }
    var mode = opts.mode || "lesson", useHearts = mode === "lesson";
    var total = items.length, done = 0, xp = 0, combo = 0, bestCombo = 0;
    var firstTry = {}, attempts = {}, gradedIds = {}, startedAt = Date.now();
    items.forEach(function (it) { if (it.graded) gradedIds[it.uid] = 1; });
    var queue = items.slice(), cur = null, state = null, finished = false;

    var root = document.createElement("div");
    root.className = "sess";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-label", opts.title || "Lesson");
    root.innerHTML =
      '<div class="sess-top">' +
      '<button type="button" class="btn-icon ghosty" data-quit aria-label="Quit session"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg></button>' +
      '<div class="sess-bar" role="progressbar" aria-label="Session progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div>' +
      (useHearts ? '<span class="sess-hearts" aria-live="polite"></span>' : '<span class="sess-xp-pill" aria-live="polite"></span>') +
      '<button type="button" class="btn-icon ghosty" data-mute></button>' +
      "</div>" +
      '<div class="combo-pop" aria-live="polite"></div>' +
      '<main class="sess-body" tabindex="-1"></main>' +
      '<div class="sess-foot"><button type="button" class="btn ghost skip" data-skip hidden></button><button type="button" class="btn primary check" data-check disabled>Check</button></div>' +
      '<div class="sheet" hidden><div class="sheet-inner"><div class="sheet-head"><span class="sheet-mascot"></span><div><h2 class="sheet-title" tabindex="-1"></h2><div class="sheet-detail"></div></div></div><div class="sheet-actions"></div></div></div>';
    document.body.appendChild(root);
    document.body.classList.add("in-session");
    var body = root.querySelector(".sess-body"), checkBtn = root.querySelector("[data-check]"), skipBtn = root.querySelector("[data-skip]");
    var sheet = root.querySelector(".sheet");
    S.Session.active = { root: root, current: function () { return cur; } };

    function paintTop() {
      var pct = Math.round(done / total * 100);
      root.querySelector(".sess-bar span").style.width = pct + "%";
      root.querySelector(".sess-bar").setAttribute("aria-valuenow", pct);
      var h = root.querySelector(".sess-hearts");
      if (h) { var n = S.hearts(); h.innerHTML = heartSvg() + "<span>" + n + "</span>"; h.setAttribute("aria-label", n + " hearts left"); h.classList.toggle("empty", n === 0); }
      var x = root.querySelector(".sess-xp-pill"); if (x) x.textContent = "+" + xp + " XP";
      var m = root.querySelector("[data-mute]"), on = S.state.game.sound;
      m.innerHTML = on ? icon("speaker") : '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M22 9l-6 6M16 9l6 6"/></svg>';
      m.setAttribute("aria-label", on ? "Mute sound effects" : "Turn sound effects on");
      m.setAttribute("aria-pressed", on ? "false" : "true");
    }

    /* ---------- render one item ---------- */
    function next() {
      hideSheet();
      if (!queue.length) { finish(); return; }
      if (useHearts && S.hearts() === 0) { outOfHearts(); return; }
      cur = queue.shift();
      var sk = skipKind(cur);
      if (sk && skipKinds[sk]) { delete gradedIds[cur.uid]; total = Math.max(1, total - 1); next(); return; }
      state = { ready: false, answer: null };
      checkBtn.textContent = "Check"; checkBtn.disabled = true; checkBtn.className = "btn primary check";
      skipBtn.hidden = true;
      body.innerHTML = "";
      body.className = "sess-body kind-" + cur.kind;
      R[cur.kind](cur);
      paintTop();
      var f = body.querySelector("h2"); if (f) { f.setAttribute("tabindex", "-1"); f.focus({ preventScroll: true }); }
    }
    function setReady(v) { state.ready = v; checkBtn.disabled = !v; }
    function heading(t) { return '<h2 class="ex-prompt">' + esc(t) + "</h2>"; }
    function bubble(text, lang, say) {
      return '<div class="ex-bubble">' + S.mascot("think", 64) + '<div class="speech-bubble"><span' + (lang ? ' lang="' + lang + '"' : "") + ">" + esc(text) + "</span>" + (say ? sayBtn(say, "Play: " + text, "sm") : "") + "</div></div>";
    }
    function showSkip(label) { skipBtn.hidden = false; skipBtn.textContent = label; }

    var R = {};
    R.teach = function (it) {
      var w = it.w, pic = Ex.picture(w);
      body.innerHTML = '<p class="eyebrow">New word</p>' +
        '<div class="teach-card">' + (pic ? '<div class="pic big-pic" aria-hidden="true">' + esc(pic.emoji || pic.text) + "</div>" : "") +
        '<h2 class="teach-es" lang="es">' + esc(w.es) + "</h2>" +
        '<p class="teach-en">' + esc(w.en) + "</p>" + sayBtn(w.speak || w.es, "Play: " + w.es, "lg") +
        (w.say ? '<p class="muted small">Sounds like ' + esc(w.say) + "</p>" : "") +
        (w.note ? '<p class="note">' + esc(w.note) + "</p>" : "") +
        (w.example ? '<div class="teach-ex"><p lang="es">' + esc(w.example.es) + " " + sayBtn(w.example.es, "Play example", "sm") + '</p><p class="muted">' + esc(w.example.en) + "</p></div>" : "") +
        "</div>";
      checkBtn.textContent = "Continue"; checkBtn.disabled = false; state.ready = true; state.teach = true;
      setTimeout(function () { speech.speak(w.speak || w.es); }, 200);
    };
    function optionButtons(options, lang, picture) {
      return '<div class="opts' + (picture ? " pics" : "") + '" role="radiogroup">' + options.map(function (o, i) {
        var label = picture ? o.es : o;
        return '<button type="button" class="opt" role="radio" aria-checked="false" data-v="' + esc(label) + '"' + (picture ? ' data-say="' + esc(o.say) + '" data-saysilent="1"' : "") + ">" +
          '<span class="kbd" aria-hidden="true">' + (i + 1) + "</span>" +
          (picture ? '<span class="pic" aria-hidden="true">' + esc(o.pic.emoji || o.pic.text) + "</span>" : "") +
          '<span class="opt-t"' + (lang === "es" || picture ? ' lang="es"' : "") + ">" + esc(label) + "</span></button>";
      }).join("") + "</div>";
    }
    function wireOptions(cb) {
      body.querySelectorAll(".opt").forEach(function (b) {
        b.addEventListener("click", function () {
          if (state.locked) return;
          body.querySelectorAll(".opt").forEach(function (x) { x.setAttribute("aria-checked", "false"); });
          b.setAttribute("aria-checked", "true");
          state.answer = b.getAttribute("data-v");
          S.sfx("tap");
          setReady(true);
          if (cb) cb(b);
        });
      });
    }
    R.picture = function (it) {
      body.innerHTML = heading(it.prompt) + optionButtons(it.options, "es", true);
      wireOptions();
    };
    R.choose = function (it) {
      var top = heading(it.listen ? (it.prompt || "Listen and choose") : it.prompt);
      if (it.listen) top += '<div class="listen-row"><button type="button" class="btn big-play" data-say="' + esc(it.say) + '" aria-label="Play audio">' + icon("speaker") + '</button><button type="button" class="btn ghost slow" data-say="' + esc(it.say) + '" data-rate="0.6" aria-label="Play slowly">Slow</button></div>';
      else if (it.show) top += bubble(it.show, it.showLang, it.showLang === "es" ? it.say : null);
      else if (it.say) top += '<div class="row center">' + sayBtn(it.say, "Play audio") + "</div>";
      body.innerHTML = top + optionButtons(it.options, it.optLang);
      wireOptions();
      if (it.listen) { showSkip("Can't listen now"); setTimeout(function () { speech.speak(it.say); }, 250); }
      else if (it.showLang === "es" && it.say) setTimeout(function () { speech.speak(it.say); }, 250);
    };
    R.fill = function (it) {
      body.innerHTML = heading(it.prompt) +
        '<p class="fill-sentence" lang="es">' + esc(it.before) + '<span class="blank" aria-label="blank">' + "&nbsp;".repeat(6) + "</span>" + esc(it.after) + "</p>" +
        (it.en ? '<p class="muted fill-en">' + esc(it.en) + "</p>" : "") + optionButtons(it.options, "es");
      wireOptions(function (b) { body.querySelector(".blank").textContent = b.getAttribute("data-v"); body.querySelector(".blank").classList.add("filled"); });
    };
    R.tiles = function (it) {
      var top = heading(it.prompt);
      if (it.listen) top += '<div class="listen-row"><button type="button" class="btn big-play" data-say="' + esc(it.say) + '" aria-label="Play audio">' + icon("speaker") + '</button><button type="button" class="btn ghost slow" data-say="' + esc(it.say) + '" data-rate="0.6" aria-label="Play slowly">Slow</button></div>';
      else top += bubble(it.show, it.showLang, it.showLang === "es" ? it.say : null);
      body.innerHTML = top +
        '<div class="tile-answer" aria-label="Your answer" role="list"></div>' +
        '<div class="tile-bank" aria-label="Word bank" role="list">' + it.bank.map(function (t, i) {
          return '<button type="button" class="tile" data-i="' + i + '"' + (it.bankLang === "es" ? ' lang="es"' : "") + ">" + esc(t) + "</button>";
        }).join("") + "</div>";
      state.picked = [];
      var ansEl = body.querySelector(".tile-answer");
      function redraw() {
        ansEl.innerHTML = state.picked.map(function (i, pos) {
          return '<button type="button" class="tile in" data-pos="' + pos + '"' + (it.bankLang === "es" ? ' lang="es"' : "") + ' aria-label="Remove ' + esc(it.bank[i]) + '">' + esc(it.bank[i]) + "</button>";
        }).join("");
        body.querySelectorAll(".tile-bank .tile").forEach(function (b) {
          var used = state.picked.indexOf(+b.getAttribute("data-i")) >= 0;
          b.classList.toggle("used", used); b.disabled = used || !!state.locked;
        });
        ansEl.querySelectorAll(".tile.in").forEach(function (b) {
          b.addEventListener("click", function () { if (state.locked) return; state.picked.splice(+b.getAttribute("data-pos"), 1); S.sfx("tap"); redraw(); });
        });
        state.answer = state.picked.map(function (i) { return it.bank[i]; }).join(" ");
        setReady(state.picked.length > 0);
      }
      body.querySelectorAll(".tile-bank .tile").forEach(function (b) {
        b.addEventListener("click", function () {
          if (state.locked) return;
          state.picked.push(+b.getAttribute("data-i")); S.sfx("tap");
          if (it.bankLang === "es") speech.speak(b.textContent);
          redraw();
        });
      });
      redraw();
      if (it.listen) { showSkip("Can't listen now"); setTimeout(function () { speech.speak(it.say); }, 250); }
    };
    R.type = function (it) {
      var id = "t" + it.uid;
      var top = heading(it.prompt);
      if (it.listen) top += '<div class="listen-row"><button type="button" class="btn big-play" data-say="' + esc(it.say) + '" aria-label="Play audio">' + icon("speaker") + '</button><button type="button" class="btn ghost slow" data-say="' + esc(it.say) + '" data-rate="0.6" aria-label="Play slowly">Slow</button></div>';
      else if (it.show) top += bubble(it.show, it.showLang);
      body.innerHTML = top +
        '<label for="' + id + '" class="sr-only">Your answer in Spanish</label>' +
        '<textarea id="' + id + '" class="type-box" rows="2" lang="es" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Type in Spanish"></textarea>' +
        '<div class="accent-keys" role="group" aria-label="Insert special characters">' + ACCENTS.map(function (a) { return '<button type="button" class="key" data-key="' + a + '" aria-label="Insert ' + a + '">' + a + "</button>"; }).join("") + "</div>";
      var ta = body.querySelector("textarea");
      ta.addEventListener("input", function () { state.answer = ta.value; setReady(!!ta.value.trim()); });
      ta.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); if (state.ready) checkBtn.click(); } });
      body.querySelectorAll(".key").forEach(function (k) {
        k.addEventListener("click", function () {
          var ch = k.getAttribute("data-key"), s = ta.selectionStart, e = ta.selectionEnd;
          ta.value = ta.value.slice(0, s) + ch + ta.value.slice(e); ta.focus(); ta.setSelectionRange(s + 1, s + 1);
          state.answer = ta.value; setReady(!!ta.value.trim());
        });
      });
      if (it.listen) { showSkip("Can't listen now"); setTimeout(function () { speech.speak(it.say); }, 250); }
    };
    R.speak = function (it) {
      body.innerHTML = heading(it.prompt) + bubble(it.text, "es", it.text) +
        '<button type="button" class="btn mic-big" data-listen aria-label="Tap and speak">' + icon("mic") + '<span>Tap to speak</span></button>' +
        '<p class="heard muted" role="status"></p>';
      showSkip("Can't speak now");
      var mb = body.querySelector("[data-listen]"), heard = body.querySelector(".heard");
      mb.addEventListener("click", function () {
        speech.stop(); mb.classList.add("listening"); heard.textContent = "Listening...";
        speech.listen().then(function (alts) {
          state.judge = speech.judge(alts, it.text);
          heard.textContent = "I heard: " + state.judge.heard;
          state.answer = state.judge.heard; setReady(true);
        }).catch(function () { heard.textContent = "I did not catch that. Tap and try again."; })
          .then(function () { mb.classList.remove("listening"); });
      });
    };
    R.match = function (it) {
      var left = S.shuffle(it.pairs.map(function (p, i) { return { t: p[0], s: p[2], i: i }; }));
      var right = S.shuffle(it.pairs.map(function (p, i) { return { t: p[1], i: i }; }));
      body.innerHTML = heading(it.prompt) + '<div class="match-grid">' +
        '<div class="match-col">' + left.map(function (x) { return '<button type="button" class="match-item" lang="es" data-side="l" data-i="' + x.i + '" data-s="' + esc(x.s) + '" aria-pressed="false">' + esc(x.t) + "</button>"; }).join("") + "</div>" +
        '<div class="match-col">' + right.map(function (x) { return '<button type="button" class="match-item" data-side="r" data-i="' + x.i + '" aria-pressed="false">' + esc(x.t) + "</button>"; }).join("") + "</div></div>";
      var sel = null, matched = 0; state.mistakes = 0;
      body.querySelectorAll(".match-item").forEach(function (b) {
        b.addEventListener("click", function () {
          if (b.classList.contains("ok")) return;
          if (b.getAttribute("data-side") === "l") speech.speak(b.getAttribute("data-s") || b.textContent);
          if (!sel || sel.getAttribute("data-side") === b.getAttribute("data-side")) {
            if (sel) sel.setAttribute("aria-pressed", "false");
            sel = b; b.setAttribute("aria-pressed", "true"); S.sfx("tap"); return;
          }
          var a = sel; sel = null; a.setAttribute("aria-pressed", "false");
          if (a.getAttribute("data-i") === b.getAttribute("data-i")) {
            a.classList.add("ok"); b.classList.add("ok"); a.disabled = b.disabled = true; matched++; S.sfx("correct");
            if (matched === it.pairs.length) { state.answer = "done"; setReady(true); checkBtn.click(); }
          } else {
            state.mistakes++; S.sfx("wrong"); S.buzz(60); combo = 0; paintCombo();
            a.classList.add("shake"); b.classList.add("shake");
            setTimeout(function () { a.classList.remove("shake"); b.classList.remove("shake"); }, 450);
          }
        });
      });
    };

    /* ---------- checking ---------- */
    function evaluate(it) {
      var a = state.answer || "";
      switch (it.kind) {
        case "picture": case "choose": case "fill":
          return { ok: a === it.answer, correct: it.answer };
        case "tiles":
          return { ok: Ex.norm(a) === Ex.norm(it.answer), correct: it.answer, accent: S.noAccents(Ex.norm(a)) === S.noAccents(Ex.norm(it.answer)) && Ex.norm(a) !== Ex.norm(it.answer) };
        case "type":
          var r = S.checkTyped(a, it.answers);
          return { ok: r.ok, correct: it.answers[0], accent: r.ok && !r.exact };
        case "speak":
          return { ok: !!(state.judge && state.judge.ok), correct: it.text, heard: state.judge && state.judge.heard };
        case "match":
          return { ok: true, correct: "", mistakes: state.mistakes };
      }
      return { ok: false, correct: "" };
    }

    function check() {
      if (state.locked && sheet.hidden === false) return;
      if (state.teach) { done++; finishItem(); return; }
      if (!state.ready) return;
      state.locked = true;
      body.querySelectorAll(".opt, .tile, textarea, .key, [data-listen]").forEach(function (b) { b.disabled = true; });
      var res = evaluate(cur), it = cur;
      attempts[it.uid] = (attempts[it.uid] || 0) + 1;
      if (res.ok) {
        if (attempts[it.uid] === 1 && !(it.kind === "match" && res.mistakes)) firstTry[it.uid] = 1;
        combo++; bestCombo = Math.max(bestCombo, combo);
        var gain = combo >= 5 ? 2 : 1; xp += gain;
        done++;
        weak(it.key, true);
        S.sfx("correct"); S.buzz(15);
        if (combo === 5 || combo === 10 || combo === 15 || combo === 20) { S.sfx("combo"); paintCombo(true); } else paintCombo();
        var praise = ["Nice!", "Great job!", "Excellent!", "You got it!", "Correct!", "¡Muy bien!", "¡Perfecto!"];
        var detail = "";
        if (res.accent) detail += "<p>Watch the accents: <strong lang=\"es\">" + esc(res.correct) + "</strong></p>";
        if (it.kind === "match" && res.mistakes) detail += "<p>All matched with " + res.mistakes + " wrong " + (res.mistakes === 1 ? "try" : "tries") + ".</p>";
        if (it.en && it.kind !== "fill") detail += '<p class="muted">Meaning: ' + esc(it.en) + "</p>";
        if (it.kind === "fill" && it.en) detail += '<p class="muted">' + esc(it.en) + "</p>";
        if (combo >= 5) detail += '<p class="combo-line">Combo x' + combo + ": double XP</p>";
        showSheet(true, praise[Math.floor(Math.random() * praise.length)], detail);
        var sa = it.sayAnswer && typeof it.sayAnswer === "string" ? it.sayAnswer : (it.sayAnswer ? it.answer : null);
        if (sa) speech.speak(sa);
      } else {
        combo = 0; paintCombo();
        S.sfx("wrong"); S.buzz([80, 40, 80]);
        weak(it.key, false);
        if (useHearts) S.loseHeart();
        var again = Object.assign({}, it); again.repeat = (it.repeat || 0) + 1;
        if (again.repeat <= 2) queue.push(again); else done++;
        var d = '<p>Correct answer:</p><p class="correct-answer" lang="es">' + esc(res.correct) + "</p>";
        if (res.heard) d += '<p class="muted">I heard: ' + esc(res.heard) + "</p>";
        if (it.en) d += '<p class="muted">Meaning: ' + esc(it.en) + "</p>";
        if (it.explain) d += '<p class="muted">' + esc(it.explain) + "</p>";
        if (again.repeat <= 2) d += '<p class="muted small">You will see this one again at the end.</p>';
        showSheet(false, "Not quite", d);
        var heartsEl = root.querySelector(".sess-hearts"); if (heartsEl) { heartsEl.classList.remove("lose"); void heartsEl.offsetWidth; heartsEl.classList.add("lose"); }
      }
      paintTop();
    }
    function weak(key, ok) {
      var c = key && S.state.cards[key]; if (!c) return;
      if (ok) { if (mode === "practice") c.misses = Math.max(0, c.misses - 1); }
      else c.misses += 1;
      S.save();
    }
    function paintCombo(pop) {
      var el = root.querySelector(".combo-pop");
      if (combo >= 3) { el.textContent = "Combo x" + combo; el.className = "combo-pop show" + (pop ? " pop" : ""); }
      else { el.className = "combo-pop"; el.textContent = ""; }
    }

    function showSheet(ok, title, detail, actions) {
      sheet.hidden = false;
      sheet.className = "sheet " + (ok === true ? "good" : ok === false ? "bad" : "neutral");
      sheet.querySelector(".sheet-mascot").innerHTML = S.mascot(ok === false ? "sad" : ok === true ? "cheer" : "think", 56);
      sheet.querySelector(".sheet-title").textContent = title;
      sheet.querySelector(".sheet-detail").innerHTML = detail || "";
      var act = sheet.querySelector(".sheet-actions");
      act.innerHTML = actions || '<button type="button" class="btn ' + (ok === false ? "danger-solid" : "primary") + ' wide" data-continue>Continue</button>';
      var c = act.querySelector("[data-continue]");
      if (c) c.addEventListener("click", function () { finishItem(); });
      checkBtn.hidden = true; skipBtn.hidden = true;
      requestAnimationFrame(function () { sheet.classList.add("open"); });
      var f = act.querySelector("button"); if (f) f.focus({ preventScroll: true });
    }
    function hideSheet() { sheet.hidden = true; sheet.classList.remove("open"); checkBtn.hidden = false; }
    function finishItem() { state.locked = false; next(); }

    /* Skip listen or speak items without losing a heart. */
    var skipKinds = {};
    function skipKind(it) { return it.kind === "speak" ? "speak" : (it.listen ? "listen" : null); }
    skipBtn.addEventListener("click", function () {
      if (state.locked) return;
      var k = skipKind(cur); if (k) skipKinds[k] = true;
      delete gradedIds[cur.uid]; total = Math.max(1, total - 1);
      next();
    });
    checkBtn.addEventListener("click", check);

    root.querySelector("[data-mute]").addEventListener("click", function () { S.state.game.sound = !S.state.game.sound; S.save(); paintTop(); });
    root.querySelector("[data-quit]").addEventListener("click", askQuit);
    function askQuit() {
      if (finished) { close(); return; }
      showSheet(null, "Leave this lesson?", "<p>Your progress in this session will be lost. XP you already earned stays.</p>",
        '<button type="button" class="btn primary wide" data-stay>Keep learning</button><button type="button" class="btn ghost wide" data-leave>Quit</button>');
      sheet.querySelector("[data-stay]").addEventListener("click", function () {
        hideSheet();
        if (state && state.locked) { /* answer already checked: move on */ finishItem(); }
      });
      sheet.querySelector("[data-leave]").addEventListener("click", function () { commitXp(); close(); if (opts.onQuit) opts.onQuit(); });
    }
    function onKey(e) {
      if (!document.body.contains(root)) return;
      if (e.key === "Escape") { e.preventDefault(); askQuit(); return; }
      if (e.target && /textarea|input/i.test(e.target.tagName)) return;
      if (e.key === "Enter") {
        if (e.target && e.target.tagName === "BUTTON" && !e.target.hasAttribute("data-check")) return;
        e.preventDefault();
        if (!sheet.hidden) { var c = sheet.querySelector("[data-continue]"); if (c) c.click(); }
        else checkBtn.click();
        return;
      }
      if (/^[1-9]$/.test(e.key) && sheet.hidden) {
        var o = body.querySelectorAll(".opt")[+e.key - 1];
        if (o && !o.disabled) o.click();
      }
    }
    document.addEventListener("keydown", onKey);

    function outOfHearts() {
      var g = S.state.game, mins = Math.ceil(S.nextHeartIn() / 60000);
      var canBuy = g.gems >= S.GAME.COST.refill;
      showSheet(false, "You ran out of hearts",
        "<p>Hearts come back over time (next one in about " + (mins > 60 ? Math.round(mins / 60) + " hours" : mins + " minutes") + "). Practice also earns a heart.</p><p>You have " + g.gems + " gems.</p>",
        (canBuy ? '<button type="button" class="btn primary wide" data-refill>Refill hearts for ' + S.GAME.COST.refill + " gems</button>" : "") +
        '<button type="button" class="btn ghost wide" data-practice>Practice to earn a heart</button><button type="button" class="btn ghost wide" data-leave>Quit</button>');
      var r = sheet.querySelector("[data-refill]");
      if (r) r.addEventListener("click", function () { S.buyRefill(); paintTop(); S.sfx("unlock"); hideSheet(); next(); });
      sheet.querySelector("[data-practice]").addEventListener("click", function () { commitXp(); close(); location.hash = "#/practice"; });
      sheet.querySelector("[data-leave]").addEventListener("click", function () { commitXp(); close(); if (opts.onQuit) opts.onQuit(); });
    }

    var xpCommitted = 0;
    function commitXp() {
      if (xp > xpCommitted) { S.addXp(xp - xpCommitted); xpCommitted = xp; }
      var g = S.state.game; g.bestCombo = Math.max(g.bestCombo, bestCombo); S.save();
    }

    function close() {
      speech.stop();
      document.removeEventListener("keydown", onKey);
      root.remove();
      document.body.classList.remove("in-session");
      S.Session.active = null;
      if (S.refreshHeader) S.refreshHeader();
    }

    /* ---------- complete screen ---------- */
    function finish() {
      finished = true;
      var graded = Object.keys(gradedIds).length, good = Object.keys(firstTry).filter(function (k) { return gradedIds[k]; }).length;
      var perfect = graded > 0 && good === graded;
      var g = S.state.game, bonus = 0, gems = 0, streak = null, wasDone = false;
      if (mode === "lesson" && opts.lesson) {
        wasDone = !!S.state.completed[opts.lesson.id];
        bonus = wasDone ? 5 : 10; gems = 5;
        if (perfect) { bonus += 5; gems += 5; g.perfect++; }
        g.sessions++;
        var gemsBefore = g.gems;
        S.completeLesson(opts.lesson.id, good, graded || 1);
        streak = { now: S.currentStreak() };
        g.gems = gemsBefore + gems;
      } else {
        bonus = 5; g.practiceSessions++;
        S.gainHeart(1);
        S.markActivity();
        streak = { now: S.currentStreak() };
      }
      xp += bonus;
      var t = S.today(), goalBefore = !!g.goalDays[t];
      commitXp();
      var goalHit = !goalBefore && !!g.goalDays[t];
      var extended = S.state.activity[t] === 1;
      var fresh = S.checkAchievements();
      S.save();
      body.className = "sess-body complete";
      root.querySelector(".sess-top").classList.add("faded");
      hideSheet();
      checkBtn.textContent = "Continue"; checkBtn.disabled = false; checkBtn.className = "btn primary check";
      skipBtn.hidden = true;
      var acc = graded ? Math.round(good / graded * 100) : 100;
      body.innerHTML =
        '<div class="done-v2">' + S.mascot("cheer", 140, S.MASCOT_NAME + " is cheering") +
        '<h2 tabindex="-1">' + (mode === "lesson" ? (perfect ? "Perfect lesson!" : "Lesson complete!") : "Practice complete!") + "</h2>" +
        (opts.title ? '<p class="muted">' + esc(opts.title) + "</p>" : "") +
        '<div class="done-stats">' +
        '<div class="ds xp"><span class="ds-l">Total XP</span><span class="ds-n">+' + xp + "</span></div>" +
        '<div class="ds acc"><span class="ds-l">' + (perfect ? "Amazing" : "Accuracy") + '</span><span class="ds-n">' + acc + "%</span></div>" +
        '<div class="ds time"><span class="ds-l">Time</span><span class="ds-n">' + fmtTime(Date.now() - startedAt) + "</span></div>" +
        "</div>" +
        '<ul class="done-notes">' +
        (bestCombo >= 5 ? "<li>⚡ Best combo: " + bestCombo + " in a row</li>" : "") +
        (gems ? "<li>💎 +" + gems + " gems</li>" : "") +
        (mode === "practice" ? "<li>❤️ +1 heart for practicing</li>" : "") +
        (extended ? "<li>🔥 " + streak.now + " day streak!</li>" : "") +
        (goalHit ? "<li>🎯 Daily goal reached! +10 gems</li>" : "<li>🎯 Today: " + S.xpToday() + " of " + g.goal + " XP</li>") +
        fresh.map(function (a) { return "<li>" + esc(a.icon) + " New achievement: " + esc(a.name) + " (+10 gems)</li>"; }).join("") +
        "</ul></div>";
      S.sfx("complete"); S.buzz([30, 50, 30]);
      S.confetti();
      body.querySelector("h2").focus({ preventScroll: true });
      checkBtn.onclick = null;
      checkBtn.removeEventListener("click", check);
      checkBtn.addEventListener("click", function () {
        close();
        if (opts.onDone) opts.onDone({ perfect: perfect, good: good, graded: graded, xp: xp, unlocked: mode === "lesson" && !wasDone });
      });
      checkBtn.focus({ preventScroll: true });
    }

    paintTop();
    next();
  };
})();
