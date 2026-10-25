/* Spanish in 15 v2: Learn path (winding nodes), practice hub, timed match, profile with streak calendar and shop,
   achievements, and the header stat chips. Installed into the router by js/app.js. */
(function () {
  "use strict";
  var S = window.S15, esc = S.esc;

  var SVG = {
    star: '<svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path fill="currentColor" d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path fill="currentColor" d="M7 3h10v2h3v3a4 4 0 0 1-4 4h-.3A5 5 0 0 1 13 14.9V17h3v3H8v-3h3v-2.1A5 5 0 0 1 8.3 12H8a4 4 0 0 1-4-4V5h3zm-1 4v1a2 2 0 0 0 1.6 2L7 7zm12 0h-1l-.6 3A2 2 0 0 0 18 8z"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    lock: '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M7 10V7a5 5 0 0 1 10 0v3h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zm2 0h6V7a3 3 0 0 0-6 0z"/></svg>',
    flame: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 22c4.4 0 7.5-3 7.5-7.3 0-4.2-3-6.7-4.6-9.9-.5 2.3-1.9 3.6-3.4 4.2C11.3 6.6 10.7 4.2 11.2 2 7.3 4.6 4.5 9 4.5 14.7 4.5 19 7.6 22 12 22z"/></svg>',
    gem: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M6 3h12l4 6-10 12L2 9zm1.2 2L4.6 9h4.1l1.6-4zm5.5 0 1.6 4h4.1l-2.6-4zm-1.4.4L9.7 9h4.6zM4.9 11l5.5 6.6L8.6 11zm6 0 1.1 7.2 1.1-7.2zm4.5 0-1.8 6.6 5.5-6.6z"/></svg>'
  };
  S.SVG = SVG;

  /* ---------- header chips ---------- */
  S.refreshHeader = function () {
    var box = document.getElementById("hdr-stats");
    if (!box || !S.state || !S.state.game) return;
    var g = S.state.game, streak = S.currentStreak(), lit = S.state.streak.last === S.today(), hearts = S.hearts();
    box.innerHTML =
      '<a class="chip-stat streak' + (lit ? " lit" : "") + '" href="#/profile" aria-label="' + streak + ' day streak' + (lit ? ", done today" : "") + '">' + SVG.flame + "<span>" + streak + "</span></a>" +
      '<a class="chip-stat gems" href="#/profile" aria-label="' + g.gems + ' gems">' + SVG.gem + "<span>" + g.gems + "</span></a>" +
      '<a class="chip-stat hearts' + (hearts === 0 ? " empty" : "") + '" href="#/profile" aria-label="' + hearts + ' hearts">' + S.heartSvg() + "<span>" + hearts + "</span></a>";
  };

  S.installV2 = function (views, h) {
    var app = h.app;
    views.studyPractice = views.practice;   /* the original quiz builder */
    views.quiz = function () { views.studyPractice(); var t = app.querySelector(".page-title"); if (t) t.textContent = "Quiz builder"; };
    var oldProgress = views.progress;

    /* ---------- Learn: the winding path ---------- */
    var OFFS = [0, 1, 2, 1, 0, -1, -2, -1];
    function nodeState(d) {
      if (S.state.completed[d.id]) return "done";
      if (!S.weekReady(S.weekOfDay(d.id))) return "soon";
      if (!S.isUnlocked(d.id)) return "locked";
      return "current";
    }
    function nodeHtml(d, idx) {
      var st = nodeState(d), rev = d.type === "review";
      var icon = st === "done" ? SVG.check : (st === "locked" || st === "soon") ? SVG.lock : (rev ? SVG.trophy : SVG.star);
      var label = "Day " + d.id + ": " + d.title + ". " + { done: "Completed", current: "Start here", locked: "Locked", soon: "Coming soon" }[st];
      return '<li class="snode-wrap" style="--x:' + OFFS[idx % OFFS.length] + '">' +
        (st === "current" && !startShown && (startShown = true) ? '<span class="start-tag" aria-hidden="true">START</span>' : "") +
        '<button type="button" class="snode ' + st + (rev ? " review" : "") + '" data-node="' + d.id + '" aria-label="' + esc(label) + '" aria-expanded="false">' + icon + "</button></li>";
    }
    var startShown = false;
    function learnHtml() {
      startShown = false;
      var o = S.outline(), g = S.state.game, xpT = S.xpToday(), due = S.dueKeys().length;
      var tid = S.todayLessonId(), curUnit = tid ? S.unitOfWeek(S.weekOfDay(tid)) : null;
      var html = '<h1 class="sr-only page-title" tabindex="-1">Learn</h1>' +
        '<section class="goal-card" aria-label="Daily goal">' + S.mascot(xpT >= g.goal ? "cheer" : "happy", 64) +
        '<div class="goal-text"><div class="row between"><strong>Daily goal</strong><span class="muted small">' + Math.min(xpT, g.goal) + " / " + g.goal + " XP</span></div>" +
        '<div class="progress-bar gold" role="progressbar" aria-label="Daily goal progress" aria-valuemin="0" aria-valuemax="' + g.goal + '" aria-valuenow="' + Math.min(xpT, g.goal) + '"><span style="width:' + Math.min(100, Math.round(xpT / g.goal * 100)) + '%"></span></div>' +
        '<p class="small muted">' + (xpT >= g.goal ? "Goal reached today. ¡Excelente!" : (g.goal - xpT) + " XP to go today.") + "</p></div></section>" +
        (due ? '<a class="due-strip" href="#/cards"><span>🃏 ' + due + (due === 1 ? " card" : " cards") + ' ready for review</span><span aria-hidden="true">›</span></a>' : "") +
        '<div class="row between learn-links"><a href="#/path" class="small">Year map</a><a href="#/practice" class="small">Practice hub</a></div>';
      o.levels.forEach(function (lv) {
        var units = o.units.filter(function (u) { return u.level === lv.id; });
        if (!units.length) return;
        html += '<div class="level-divider"><span class="lv-badge">' + esc(lv.id) + "</span><span>" + esc(lv.title || "") + "</span></div>";
        units.forEach(function (u) {
          var first = u.weeks[0], anyReady = u.weeks.some(S.weekReady);
          html += '<section class="unit-v2' + (curUnit && u.id === curUnit.id ? " current" : "") + (anyReady ? "" : " soon") + '" aria-labelledby="u' + u.id + '">' +
            '<header class="unit-banner"><div><p class="unit-kicker">' + esc(lv.id) + " · Unit " + esc(u.id) + '</p><h2 id="u' + u.id + '">' + esc(u.title) + "</h2>" +
            (u.summary ? '<p class="unit-desc">' + esc(u.summary) + "</p>" : "") + "</div>" +
            '<a class="guide-btn" href="#/week/' + first + '" aria-label="Unit ' + esc(u.id) + ' guide">Guide</a></header>';
          var idx = 0;
          u.weeks.forEach(function (w) {
            var wi = S.weekInfo(w) || { title: "" };
            var days = o.days.filter(function (d) { return S.weekOfDay(d.id) === w; });
            html += '<p class="week-tag"><a href="#/week/' + w + '">Week ' + w + ": " + esc(wi.title) + "</a>" + (S.weekReady(w) ? "" : ' <span class="muted">· coming soon</span>') + "</p>";
            html += '<ol class="snake">' + days.map(function (d) { return nodeHtml(d, idx++); }).join("") + "</ol>";
          });
          html += "</section>";
        });
      });
      return html;
    }
    var popFor = null;
    function closePop() {
      var p = app.querySelector(".node-pop"); if (p) { p.parentNode.classList.remove("open"); p.remove(); }
      app.querySelectorAll(".snode[aria-expanded=true]").forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
      popFor = null;
    }
    function openPop(btn) {
      var id = +btn.getAttribute("data-node");
      if (popFor === id) { closePop(); return; }
      closePop(); popFor = id;
      var d = S.dayById(id), st = nodeState(d), c = S.state.completed[id];
      var body = '<p class="pop-kicker">Day ' + id + " · Week " + S.weekOfDay(id) + (d.type === "review" ? " · Review" : "") + "</p><h3>" + esc(d.title) + "</h3>";
      if (st === "current") body += '<p>' + (d.type === "review" ? "Review the week's words in a quick session." : esc(d.preview || "New words and practice.")) + '</p><button type="button" class="btn primary wide" data-start="' + id + '">Start +' + (10) + ' XP</button><a class="btn ghost-light wide" href="#/lesson/' + id + '">Study notes</a>';
      else if (st === "done") body += "<p>Completed. Best score " + (c.best || c.score) + " of " + c.total + '.</p><button type="button" class="btn primary wide" data-start="' + id + '">Practice again +5 XP</button><a class="btn ghost-light wide" href="#/lesson/' + id + '">Study notes</a>';
      else if (st === "locked") body += "<p>Finish the lessons above to unlock this one.</p>";
      else body += "<p>This lesson is still being written. Check back soon.</p>";
      var pop = document.createElement("div");
      pop.className = "node-pop " + st;
      pop.setAttribute("role", "dialog"); pop.setAttribute("aria-label", "Day " + id);
      pop.innerHTML = body;
      btn.parentNode.appendChild(pop); btn.parentNode.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
      var sb = pop.querySelector("[data-start]");
      if (sb) { sb.addEventListener("click", function () { startLesson(id); }); sb.focus({ preventScroll: true }); }
      S.sfx("tap");
      var r = pop.getBoundingClientRect();
      if (r.bottom > window.innerHeight - 80) window.scrollBy({ top: r.bottom - window.innerHeight + 100, behavior: "smooth" });
    }
    function startLesson(id) {
      closePop();
      S.loadWeek(S.weekOfDay(id)).then(function () {
        var lesson = S.lessonById(id);
        if (!lesson) { S.toast("This lesson is not available yet."); return; }
        var items = S.Ex.lessonSession(lesson);
        S.Session.start({
          title: "Day " + id + ": " + lesson.title, items: items, mode: "lesson", lesson: lesson,
          onDone: function (res) {
            S._justDone = res.unlocked ? id + 1 : null;
            if (location.hash === "" || location.hash === "#/") views.home(); else location.hash = "#/";
          },
          onQuit: function () { views.home(); }
        });
      });
    }
    S.startLesson = startLesson;
    views.home = function () {
      app.innerHTML = '<div class="learn">' + learnHtml() + "</div>";
      app.querySelectorAll(".snode").forEach(function (b) { b.addEventListener("click", function (e) { e.stopPropagation(); openPop(b); }); });
      var off = function (e) { if (!e.target.closest(".node-pop") && !e.target.closest(".snode")) closePop(); };
      var esc2 = function (e) { if (e.key === "Escape") closePop(); };
      document.addEventListener("click", off); document.addEventListener("keydown", esc2);
      h.setCleanup(function () { document.removeEventListener("click", off); document.removeEventListener("keydown", esc2); });
      var cur = app.querySelector(".snode.current") || app.querySelectorAll(".snode.done")[app.querySelectorAll(".snode.done").length - 1];
      if (cur) {
        setTimeout(function () { cur.scrollIntoView({ block: "center" }); }, 30);
        if (S._justDone && +cur.getAttribute("data-node") === S._justDone) { cur.classList.add("unlocked-now"); S.sfx("unlock"); }
      }
      S._justDone = null;
    };

    /* ---------- Practice hub ---------- */
    S.weakWords = function () {
      var cards = S.state.cards;
      return Object.keys(cards).map(function (k) { return S.wordByKey(k); }).filter(Boolean).filter(function (w) {
        var c = cards[w.key]; return c.misses > 0 || c.result === "missed";
      }).sort(function (a, b) { return cards[b.key].misses - cards[a.key].misses; });
    };
    function learnedWords() { return Object.keys(S.state.cards).map(S.wordByKey).filter(Boolean); }
    views.practice = function () {
      var weak = S.weakWords(), learned = learnedWords(), due = S.dueKeys().length, g = S.state.game;
      var canWeak = learned.length >= 4;
      app.innerHTML = '<h1 class="page-title" tabindex="-1">Practice</h1>' +
        '<p class="lead">Practice never costs hearts, and each finished session earns one back.</p>' +
        '<div class="hub">' +
        '<button type="button" class="hub-card" data-weak' + (canWeak ? "" : " disabled") + '><span class="hub-ico" aria-hidden="true">🎯</span><span class="hub-t">Weak words</span><span class="hub-s">' +
        (!canWeak ? "Finish a lesson to unlock" : weak.length ? weak.length + " words need work" : "No weak words. Mixed review instead") + "</span></button>" +
        '<a class="hub-card" href="#/timed"><span class="hub-ico" aria-hidden="true">⏱️</span><span class="hub-t">Timed match</span><span class="hub-s">60 seconds. Best: ' + g.timedBest + " pairs</span></a>" +
        '<a class="hub-card" href="#/cards"><span class="hub-ico" aria-hidden="true">🃏</span><span class="hub-t">Flashcards</span><span class="hub-s">' + (due ? due + " due now" : "Nothing due. Practice all") + "</span></a>" +
        '<a class="hub-card" href="#/quiz"><span class="hub-ico" aria-hidden="true">🧩</span><span class="hub-t">Quiz builder</span><span class="hub-s">Pick lessons and a quiz type</span></a>' +
        "</div>" +
        '<section class="card hearts-card"><div class="row between"><h2 class="h3">Hearts</h2><span class="hearts-row" aria-label="' + S.hearts() + ' of 5 hearts">' +
        [0, 1, 2, 3, 4].map(function (i) { return '<span class="' + (i < S.hearts() ? "on" : "off") + '">' + S.heartSvg() + "</span>"; }).join("") + "</span></div>" +
        "<p class=\"muted small\">You lose a heart for each mistake in a lesson. One comes back every 4 hours.</p>" +
        '<a class="btn ghost" href="#/profile#shop">Shop</a></section>';
      var wb = app.querySelector("[data-weak]");
      if (wb && canWeak) wb.addEventListener("click", function () {
        var list = weak.length >= 4 ? weak.slice(0, 8) : S.shuffle(weak.concat(S.shuffle(learned))).filter(function (w, i, a) { return a.indexOf(w) === i; }).slice(0, 8);
        S.Session.start({ title: weak.length ? "Weak words" : "Mixed review", items: S.Ex.practiceSession(list), mode: "practice",
          onDone: function () { views.practice(); }, onQuit: function () { views.practice(); } });
      });
    };

    /* ---------- Timed match ---------- */
    views.timed = function () {
      var words = learnedWords();
      if (words.length < 5) words = S.allWords().filter(function (w) { return w.lesson <= 2; });
      words = words.filter(function (w) { return !/_{2,}/.test(w.es); });
      var timer = null, left = 60, pairs = 0, running = false;
      app.innerHTML = '<a href="#/practice" class="back">‹ Practice</a><h1 class="page-title" tabindex="-1">Timed match</h1>' +
        '<p class="lead">Match as many pairs as you can in 60 seconds.</p>' +
        '<div class="timed-top"><div class="progress-bar timer" aria-hidden="true"><span style="width:100%"></span></div><span class="timed-left" role="timer" aria-live="off">60s</span><span class="timed-score" aria-live="polite">0 pairs</span></div>' +
        '<div id="tboard"><button type="button" class="btn primary wide" data-go>Start</button></div>';
      function board() {
        var set = S.shuffle(words).slice(0, 5).filter(function (w, i, a) { return a.findIndex(function (x) { return x.en === w.en; }) === i; });
        var L = S.shuffle(set), Rr = S.shuffle(set), sel = null, left2 = set.length;
        var el = document.getElementById("tboard");
        el.innerHTML = '<div class="match-grid">' +
          '<div class="match-col">' + L.map(function (w) { return '<button type="button" class="match-item" lang="es" data-k="' + esc(w.key) + '" data-side="l">' + esc(w.es) + "</button>"; }).join("") + "</div>" +
          '<div class="match-col">' + Rr.map(function (w) { return '<button type="button" class="match-item" data-k="' + esc(w.key) + '" data-side="r">' + esc(w.en) + "</button>"; }).join("") + "</div></div>";
        el.querySelectorAll(".match-item").forEach(function (b) {
          b.addEventListener("click", function () {
            if (!running || b.disabled) return;
            if (!sel || sel.getAttribute("data-side") === b.getAttribute("data-side")) { if (sel) sel.setAttribute("aria-pressed", "false"); sel = b; b.setAttribute("aria-pressed", "true"); return; }
            var a = sel; sel = null; a.setAttribute("aria-pressed", "false");
            if (a.getAttribute("data-k") === b.getAttribute("data-k")) {
              a.classList.add("ok"); b.classList.add("ok"); a.disabled = b.disabled = true; pairs++; left2--; S.sfx("correct");
              app.querySelector(".timed-score").textContent = pairs + " pairs";
              if (!left2) setTimeout(board, 250);
            } else { S.sfx("wrong"); S.buzz(50); a.classList.add("shake"); b.classList.add("shake"); setTimeout(function () { a.classList.remove("shake"); b.classList.remove("shake"); }, 400); }
          });
        });
      }
      function end() {
        running = false; clearInterval(timer);
        var g = S.state.game, best = pairs > g.timedBest;
        g.timedBest = Math.max(g.timedBest, pairs); g.practiceSessions++;
        var xp = Math.min(20, pairs);
        if (xp) S.addXp(xp);
        S.markActivity();
        var fresh = S.checkAchievements();
        S.sfx("complete"); if (best && pairs) S.confetti();
        document.getElementById("tboard").innerHTML = '<div class="center">' + S.mascot(best ? "cheer" : "happy", 110) + "<h2>" + pairs + " pairs</h2><p>" + (best ? "New best!" : "Best: " + g.timedBest + " pairs") + " · +" + xp + " XP</p>" +
          fresh.map(function (a) { return "<p>" + esc(a.icon) + " New achievement: " + esc(a.name) + "</p>"; }).join("") +
          '<div class="row gap center wrap"><button type="button" class="btn primary" data-go>Play again</button><a class="btn ghost" href="#/practice">Practice hub</a></div></div>';
        document.querySelector("[data-go]").addEventListener("click", go);
        S.refreshHeader();
      }
      function go() {
        left = 60; pairs = 0; running = true;
        app.querySelector(".timed-score").textContent = "0 pairs";
        board();
        var t0 = Date.now();
        timer = setInterval(function () {
          left = Math.max(0, 60 - Math.floor((Date.now() - t0) / 1000));
          app.querySelector(".timed-left").textContent = left + "s";
          app.querySelector(".timer span").style.width = (left / 60 * 100) + "%";
          if (left <= 0) end();
        }, 250);
      }
      app.querySelector("[data-go]").addEventListener("click", go);
      h.setCleanup(function () { clearInterval(timer); running = false; });
      S._timedEnd = function () { if (running) end(); };
    };

    /* ---------- Achievements ---------- */
    views.awards = function () {
      S.checkAchievements();
      var got = S.state.game.achievements;
      var n = Object.keys(got).length;
      app.innerHTML = '<h1 class="page-title" tabindex="-1">Achievements</h1><p class="lead">' + n + " of " + S.ACHIEVEMENTS.length + " earned. Each one gives 10 gems.</p>" +
        '<ul class="awards">' + S.ACHIEVEMENTS.map(function (a) {
          var on = !!got[a.id];
          return '<li class="award' + (on ? " on" : "") + '"><span class="award-ico" aria-hidden="true">' + esc(a.icon) + '</span><span class="award-t">' + esc(a.name) + '</span><span class="award-d">' + esc(a.desc) + "</span>" +
            '<span class="award-s">' + (on ? "Earned " + esc(S.niceDate(got[a.id])) : "Locked") + "</span></li>";
        }).join("") + "</ul>";
    };

    /* ---------- Profile: stats, goal, streak calendar, shop, settings, data ---------- */
    var calMonth = null;
    function calendarHtml() {
      var t = S.today(), p = (calMonth || t).split("-"), y = +p[0], m = +p[1] - 1;
      var first = new Date(y, m, 1), days = new Date(y, m + 1, 0).getDate(), lead = first.getDay();
      var act = S.state.activity, fr = S.state.game.frozen;
      var cells = [];
      for (var i = 0; i < lead; i++) cells.push('<span class="cal-cell empty" aria-hidden="true"></span>');
      for (var d = 1; d <= days; d++) {
        var ds = y + "-" + S.pad(m + 1) + "-" + S.pad(d), on = !!act[ds], f = !!fr[ds];
        cells.push('<span class="cal-cell' + (on ? " on" : "") + (f ? " frozen" : "") + (ds === t ? " today" : "") + '" aria-label="' + esc(S.niceDate(ds)) + (on ? ", practiced" : f ? ", streak freeze used" : "") + '">' + (on ? '<span class="cal-flame" aria-hidden="true">' + SVG.flame + "</span>" : f ? '<span aria-hidden="true">❄️</span>' : "") + "<span class=\"cal-n\">" + d + "</span></span>");
      }
      var title = first.toLocaleDateString(undefined, { month: "long", year: "numeric" });
      return '<div class="cal-head"><button type="button" class="btn-icon sm" data-cal="-1" aria-label="Previous month">‹</button><h3 class="h3" aria-live="polite">' + esc(title) + '</h3><button type="button" class="btn-icon sm" data-cal="1" aria-label="Next month">›</button></div>' +
        '<div class="cal-grid" role="group" aria-label="Streak calendar">' + ["S", "M", "T", "W", "T", "F", "S"].map(function (x) { return '<span class="cal-dow" aria-hidden="true">' + x + "</span>"; }).join("") + cells.join("") + "</div>" +
        '<p class="muted small">Flame: a day you practiced. Snowflake: a streak freeze saved the day.</p>';
    }
    views.profile = function () {
      oldProgress();
      var g = S.state.game, st = S.stats();
      var title = app.querySelector(".page-title"); title.textContent = "Profile";
      var oldStats = app.querySelector(".stats"); if (oldStats) oldStats.remove();
      var top = '<section class="profile-hero">' + S.mascot("happy", 88, S.MASCOT_NAME + ", your study buddy") +
        "<div><p class=\"muted small\">Study buddy: " + S.MASCOT_NAME + " the hummingbird</p><p><strong>" + g.xp + " total XP</strong> · " + st.learned + " words · " + st.lessonsDone + " days done</p></div></section>" +
        '<section class="stats" aria-label="Your stats">' +
        h.stat(SVG.flame, S.currentStreak(), "day streak") + h.stat("", g.bestStreak, "best streak") + h.stat("", g.gems, "gems") + h.stat("", Object.keys(g.achievements).length, "achievements") + "</section>" +
        '<section class="card"><h2 class="h3">Daily goal</h2><div class="seg wrap" role="radiogroup" aria-label="Daily XP goal">' +
        [[10, "Casual"], [20, "Regular"], [30, "Serious"], [50, "Intense"]].map(function (o) {
          return '<input type="radio" name="goal" id="goal-' + o[0] + '" value="' + o[0] + '"' + (g.goal === o[0] ? " checked" : "") + '><label for="goal-' + o[0] + '">' + o[1] + "<br><small>" + o[0] + " XP</small></label>";
        }).join("") + '</div><p class="muted small">Today: ' + S.xpToday() + " XP.</p></section>" +
        '<section class="card" id="streak-cal"><h2 class="h3">Streak</h2><div class="cal">' + calendarHtml() + "</div></section>" +
        '<section class="card" id="shop"><h2 class="h3">Shop</h2><p class="muted small">You have ' + g.gems + " gems. Earn them from lessons, perfect scores, daily goals and achievements.</p>" +
        '<div class="shop-item"><span class="shop-ico" aria-hidden="true">❤️</span><div><strong>Refill hearts</strong><p class="muted small">' + S.hearts() + " of 5 hearts now.</p></div><button type=\"button\" class=\"btn primary\" data-buy=\"refill\">" + S.GAME.COST.refill + " gems</button></div>" +
        '<div class="shop-item"><span class="shop-ico" aria-hidden="true">❄️</span><div><strong>Streak freeze</strong><p class="muted small">Keeps your streak for one missed day. You own ' + g.freezes + " of " + S.GAME.MAX_FREEZES + ".</p></div><button type=\"button\" class=\"btn primary\" data-buy=\"freeze\">" + S.GAME.COST.freeze + " gems</button></div></section>";
      title.insertAdjacentHTML("afterend", top);
      var settings = app.querySelector("#set-theme").closest(".card");
      settings.insertAdjacentHTML("beforeend",
        '<div class="field"><label class="switch"><input type="checkbox" id="set-sound"' + (g.sound ? " checked" : "") + "> Sound effects</label></div>" +
        (navigator.vibrate ? '<div class="field"><label class="switch"><input type="checkbox" id="set-vibe"' + (g.vibrate ? " checked" : "") + "> Vibration</label></div>" : ""));
      app.querySelector("#set-sound").addEventListener("change", function (e) { g.sound = e.target.checked; S.save(); if (g.sound) S.sfx("correct"); });
      var vb = app.querySelector("#set-vibe"); if (vb) vb.addEventListener("change", function (e) { g.vibrate = e.target.checked; S.save(); S.buzz(30); });
      app.querySelectorAll("input[name=goal]").forEach(function (r) { r.addEventListener("change", function () { g.goal = +r.value; S.save(); S.toast("Daily goal set to " + g.goal + " XP."); }); });
      function wireCal() {
        app.querySelectorAll("[data-cal]").forEach(function (b) {
          b.addEventListener("click", function () {
            var base = (calMonth || S.today()).split("-"); var d = new Date(+base[0], +base[1] - 1 + +b.getAttribute("data-cal"), 1);
            calMonth = S.dateStr(d); app.querySelector(".cal").innerHTML = calendarHtml(); wireCal();
          });
        });
      }
      wireCal();
      app.querySelectorAll("[data-buy]").forEach(function (b) {
        b.addEventListener("click", function () {
          var r = b.getAttribute("data-buy") === "refill" ? S.buyRefill() : S.buyFreeze();
          var msg = { ok: "Done!", gems: "Not enough gems yet.", full: "Your hearts are already full.", max: "You already own the maximum." }[r];
          S.toast(msg); if (r === "ok") { S.sfx("unlock"); S.checkAchievements(); views.profile(); S.refreshHeader(); }
        });
      });
      if (location.hash.indexOf("shop") >= 0) { var sh = document.getElementById("shop"); if (sh) setTimeout(function () { sh.scrollIntoView(); }, 30); }
    };
    views.progress = views.profile;
  };
})();
