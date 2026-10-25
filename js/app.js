/* Spanish in 15: views, router and app wiring. */
(function () {
  "use strict";
  var S = window.S15, esc = S.esc, Quiz = S.Quiz, speech = S.speech;
  var app = document.getElementById("app");
  var cleanup = null;

  /* ---------- icons (inline SVG, no external files) ---------- */
  var ICONS = {
    speaker: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
    mic: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></svg>',
    flame: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c4 0 7-2.7 7-7 0-4-3-6.5-4.5-9.5-.6 2.2-2 3.5-3.5 4C10 7 9.5 4.5 10 2 6.5 4.5 5 9 5 15c0 4.3 3 7 7 7z"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>',
    lock: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    play: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'
  };
  S.icon = function (n) { return ICONS[n] || ""; };

  /* ---------- toast ---------- */
  var toastEl = document.getElementById("toast"), toastTimer;
  S.toast = function (msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2600);
  };

  /* ---------- theme ---------- */
  S.applyTheme = function () {
    var t = S.state.settings.theme;
    var dark = t === "dark" || (t === "auto" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#1b1416" : "#fbf6f0");
    var btn = document.getElementById("theme-toggle");
    if (btn) btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  };
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    if (mq.addEventListener) mq.addEventListener("change", function () { S.applyTheme(); });
  }
  document.getElementById("theme-toggle").addEventListener("click", function () {
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    S.state.settings.theme = dark ? "light" : "dark";
    S.save(); S.applyTheme();
  });

  /* ---------- global click helpers: speak and say it ---------- */
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-say]");
    if (b) {
      ev.preventDefault();
      var rate = b.getAttribute("data-rate");
      b.classList.add("playing");
      speech.speak(b.getAttribute("data-say"), rate ? { rate: +rate } : null).then(function () { b.classList.remove("playing"); });
      return;
    }
    var m = ev.target.closest("[data-sayit]");
    if (m) { ev.preventDefault(); sayIt(m); }
  });

  function sayItOn() { return speech.canListen && S.state.settings.speaking; }
  function sayItBtn(target) {
    if (!sayItOn()) return "";
    return '<button type="button" class="btn-icon mic" data-sayit="' + esc(target) + '" aria-label="Say it: practice saying ' + esc(target) + '"><span aria-hidden="true">' + ICONS.mic + "</span></button>";
  }
  function sayIt(btn) {
    var target = btn.getAttribute("data-sayit");
    var holder = btn.closest(".word-card, .line, .ex") || btn.parentNode;
    var out = holder.querySelector(".sayit-result");
    if (!out) { out = document.createElement("p"); out.className = "sayit-result"; out.setAttribute("role", "status"); holder.appendChild(out); }
    speech.stop();
    btn.classList.add("listening");
    out.className = "sayit-result";
    out.textContent = "Listening... say it now.";
    speech.listen().then(function (alts) {
      var r = speech.judge(alts, target);
      out.className = "sayit-result " + (r.ok ? "good" : "bad");
      out.textContent = (r.ok ? "Nice! " : "Almost. Try again. ") + "I heard: " + r.heard;
    }).catch(function (e) {
      var msg = e && e.message === "not-allowed" ? "Microphone access was blocked. You can allow it in your browser settings." : "I did not catch that. Tap the mic and try again.";
      out.className = "sayit-result bad";
      out.textContent = msg;
    }).then(function () { btn.classList.remove("listening"); });
  }

  /* ---------- shared pieces ---------- */
  function wordCard(w) {
    var spoken = w.speak || w.es;
    return '<article class="word-card">' +
      '<div class="word-top"><div><h3 class="es" lang="es">' + esc(w.es) + '</h3><p class="en">' + esc(w.en) + "</p></div>" +
      '<div class="word-btns">' + Quiz.speakBtn(spoken, "Play: " + spoken) + sayItBtn(spoken) + "</div></div>" +
      '<p class="hint"><span class="label-inline">Sounds like</span> ' + esc(w.say) + "</p>" +
      (w.note ? '<p class="note">' + esc(w.note) + "</p>" : "") +
      (w.example ? '<div class="ex"><p><span lang="es">' + esc(w.example.es) + "</span> " + Quiz.speakBtn(w.example.es, "Play example: " + w.example.es, "sm") + '</p><p class="muted">' + esc(w.example.en) + "</p></div>" : "") +
      "</article>";
  }
  function exampleList(list) {
    return '<ul class="examples">' + list.map(function (e) {
      return '<li class="ex"><p><span lang="es">' + esc(e.es) + "</span> " + Quiz.speakBtn(e.es, "Play: " + e.es, "sm") + sayItBtn(e.es) + '</p><p class="muted">' + esc(e.en) + "</p></li>";
    }).join("") + "</ul>";
  }
  function videoBlock(key) {
    var v = key && typeof key === "object" ? key : (window.VIDEOS && window.VIDEOS[key]);
    if (!v) return "";
    var url = "https://www.youtube.com/watch?v=" + encodeURIComponent(v.id);
    return '<section class="card video" aria-label="Bonus video">' +
      '<p class="eyebrow">Bonus video, optional</p>' +
      "<h3>" + esc(v.title) + "</h3>" +
      '<p class="muted small">' + esc(v.channel) + " · " + esc(v.duration) + "</p>" +
      "<p>" + esc(v.why) + "</p>" +
      '<div class="video-frame" data-video="' + esc(v.id) + '">' +
      '<button type="button" class="btn primary" data-loadvideo="' + esc(v.id) + '" data-title="' + esc(v.title) + '">' + ICONS.play + " Load video here</button>" +
      '<p class="muted small">Loading the player connects to YouTube.</p></div>' +
      '<p><a href="' + url + '" target="_blank" rel="noopener noreferrer">Watch on YouTube</a></p>' +
      "</section>";
  }
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-loadvideo]");
    if (!b) return;
    var id = b.getAttribute("data-loadvideo");
    var frame = b.closest(".video-frame");
    frame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?rel=0" title="' + esc(b.getAttribute("data-title")) + '" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>';
  });

  function statusOf(day) {
    if (S.state.completed[day.id]) return "done";
    if (!S.weekReady(S.weekOfDay(day.id))) return "locked";
    if (S.isUnlocked && !S.isUnlocked(day.id)) return "locked";
    return day.id === S.todayLessonId() ? "today" : "ready";
  }
  var STATUS_TEXT = { done: "Done", today: "Today's lesson", ready: "Ready", locked: "Locked" };

  /* Full list of one week's days with titles. */
  function weekList(n, compact) {
    var days = S.outline().days.filter(function (d) { return S.weekOfDay(d.id) === n; });
    return '<ol class="path ' + (compact ? "compact" : "") + '">' + days.map(function (d) {
      var st = statusOf(d);
      var label = "Day " + d.id + ": " + d.title + ". " + STATUS_TEXT[st];
      var badge = st === "done" ? ICONS.check : st === "locked" ? ICONS.lock : d.id;
      var inner = '<span class="dot">' + badge + '</span><span class="path-text"><span class="path-title">' + esc(d.title) + "</span>" +
        (compact ? "" : '<span class="path-sub">' + (d.type === "review" ? "Review day" : esc(d.preview || "")) + "</span>") + "</span>";
      if (st === "locked") return '<li class="step locked' + (d.type === "review" ? " review" : "") + '"><div class="step-inner" role="img" aria-label="' + esc(label) + '">' + inner + "</div></li>";
      return '<li class="step ' + st + (d.type === "review" ? " review" : "") + '"><a class="step-inner" href="#/lesson/' + d.id + '" aria-label="' + esc(label) + '">' + inner + "</a></li>";
    }).join("") + "</ol>";
  }

  /* A row of 7 round day nodes for one week. */
  function weekNodes(n) {
    var days = S.outline().days.filter(function (d) { return S.weekOfDay(d.id) === n; });
    return '<ol class="nodes">' + days.map(function (d) {
      var st = statusOf(d);
      var label = "Day " + d.id + ": " + d.title + ". " + STATUS_TEXT[st];
      var badge = st === "done" ? ICONS.check : st === "locked" ? ICONS.lock : (d.type === "review" ? "R" : d.id);
      if (st === "locked") return '<li class="node locked' + (d.type === "review" ? " review" : "") + '"><span role="img" aria-label="' + esc(label) + '">' + badge + "</span></li>";
      return '<li class="node ' + st + (d.type === "review" ? " review" : "") + '"><a href="#/lesson/' + d.id + '" aria-label="' + esc(label) + '">' + badge + "</a></li>";
    }).join("") + "</ol>";
  }

  function weekDone(n) {
    return S.outline().days.filter(function (d) { return S.weekOfDay(d.id) === n && S.state.completed[d.id]; }).length;
  }

  /* The whole year: levels, then units, then weeks of 7 nodes. */
  function yearPath() {
    var o = S.outline(), tid = S.todayLessonId(), curWeek = tid ? S.weekOfDay(tid) : o.weeks.length;
    var curUnit = S.unitOfWeek(curWeek);
    return o.levels.map(function (lv) {
      var units = o.units.filter(function (u) { return u.level === lv.id; });
      if (!units.length) return "";
      var lvDays = 0, lvDone = 0;
      units.forEach(function (u) { u.weeks.forEach(function (w) { lvDays += 7; lvDone += weekDone(w); }); });
      return '<section class="level" aria-labelledby="lv-' + esc(lv.id) + '">' +
        '<div class="level-head"><h2 id="lv-' + esc(lv.id) + '"><span class="lv-badge">' + esc(lv.id) + "</span> " + esc(lv.title || "") + "</h2>" +
        '<span class="muted small">' + lvDone + " of " + lvDays + " days</span></div>" +
        (lv.summary ? '<p class="muted">' + esc(lv.summary) + "</p>" : "") +
        '<div class="progress-bar" aria-hidden="true"><span style="width:' + (lvDays ? Math.round(lvDone / lvDays * 100) : 0) + '%"></span></div>' +
        units.map(function (u) {
          var open = curUnit && u.id === curUnit.id;
          var uDone = 0; u.weeks.forEach(function (w) { uDone += weekDone(w); });
          var anyReady = u.weeks.some(function (w) { return S.weekReady(w); });
          return '<details class="unit"' + (open ? " open" : "") + "><summary>" +
            '<span class="unit-title">Unit ' + esc(u.id) + ": " + esc(u.title) + "</span>" +
            '<span class="unit-meta">Weeks ' + u.weeks[0] + " to " + u.weeks[u.weeks.length - 1] + " · " + (anyReady ? uDone + " of " + (u.weeks.length * 7) + " done" : "Coming soon") + "</span></summary>" +
            (u.summary ? '<p class="muted small unit-sum">' + esc(u.summary) + "</p>" : "") +
            u.weeks.map(function (w) {
              var wi = S.weekInfo(w) || { title: "" }, ready = S.weekReady(w);
              return '<div class="week-row' + (w === curWeek ? " current" : "") + (ready ? "" : " is-locked") + '">' +
                '<div class="week-row-head"><a href="#/week/' + w + '" class="week-link">Week ' + w + ": " + esc(wi.title) + "</a>" +
                '<span class="muted small">' + (ready ? weekDone(w) + "/7" : "Coming soon") + "</span></div>" +
                weekNodes(w) + "</div>";
            }).join("") + "</details>";
        }).join("") + "</section>";
    }).join("");
  }

  /* ---------- views ---------- */
  var views = {};

  views.home = function () {
    var st = S.stats(), tid = S.todayLessonId(), day = tid && S.dayById(tid), lesson = tid && S.lessonById(tid);
    var todayCard;
    var available = day && (lesson || S.weekReady(S.weekOfDay(day.id)));
    if (available) {
      todayCard = '<section class="card hero" aria-labelledby="today-h">' +
        '<p class="eyebrow">Today · Day ' + day.id + " · 15 minutes</p>" +
        '<h2 id="today-h">' + esc(day.title) + "</h2>" +
        "<p>" + esc(lesson ? lesson.goal : (day.type === "review" ? "Review the week, a role play and a check quiz." : day.preview)) + "</p>" +
        '<a class="btn primary wide" href="#/lesson/' + day.id + '">' + (day.type === "review" ? "Start review" : "Start lesson") + "</a></section>";
    } else if (day) {
      todayCard = '<section class="card hero"><p class="eyebrow">Next up · Day ' + day.id + "</p><h2>" + esc(day.title) + "</h2>" +
        "<p>You finished every lesson that is ready. New lessons are on the way. Keep your streak alive with a flashcard review or a practice quiz.</p>" +
        '<div class="row gap"><a class="btn primary" href="#/cards">Review cards</a><a class="btn ghost" href="#/practice">Practice</a></div></section>';
    } else {
      todayCard = '<section class="card hero"><p class="eyebrow">Every day done</p><h2>¡Felicidades!</h2><p>You finished the whole path. Keep reviewing your cards to make the words stick.</p><a class="btn primary" href="#/cards">Review cards</a></section>';
    }
    app.innerHTML =
      '<h1 class="page-title" tabindex="-1">¡Hola! <span class="muted">Ready for 15 minutes?</span></h1>' +
      todayCard +
      '<section class="stats" aria-label="Your progress">' +
      stat(ICONS.flame, st.streak, st.streak === 1 ? "day streak" : "day streak") +
      stat("", st.learned, "words learned") +
      stat("", st.due, "cards due", st.due ? "#/cards" : "") +
      stat("", st.known, "words known") +
      "</section>" +
      (st.due ? '<section class="card due-card"><div><h2 class="h3">Review time</h2><p>' + st.due + (st.due === 1 ? " card is" : " cards are") + ' due today. It takes about 2 minutes.</p></div><a class="btn primary" href="#/cards">Review now</a></section>' : "") +
      thisWeekHtml();
  };
  function thisWeekHtml() {
    var o = S.outline(), tid = S.todayLessonId(), n = tid ? S.weekOfDay(tid) : o.weeks[o.weeks.length - 1].week;
    var wi = S.weekInfo(n) || { title: "" }, u = S.unitOfWeek(n);
    var total = o.days.length, done = Object.keys(S.state.completed).length;
    return '<section aria-labelledby="path-h"><div class="row between"><h2 id="path-h">This week</h2><a href="#/path" class="small">Full year path</a></div>' +
      '<p class="muted small">' + (u ? esc(u.level) + " · Unit " + esc(u.id) + ": " + esc(u.title) + " · " : "") + "Week " + n + ": " + esc(wi.title) + "</p>" +
      weekList(n, true) +
      '<div class="card year-card"><div class="row between"><h3 class="h3">Your year</h3><span class="muted small">' + done + " of " + total + " days</span></div>" +
      '<div class="progress-bar" aria-hidden="true"><span style="width:' + Math.round(done / total * 100) + '%"></span></div>' +
      '<p class="muted small">' + o.weeks.length + " weeks in " + o.units.length + " units across levels " + o.levels.map(function (l) { return esc(l.id); }).join(", ") + '.</p><a class="btn ghost wide" href="#/path">See the whole path</a></div></section>';
  }
  function stat(icon, n, label, href) {
    var inner = '<span class="stat-n">' + (icon ? '<span class="stat-icon" aria-hidden="true">' + icon + "</span>" : "") + n + '</span><span class="stat-l">' + label + "</span>";
    return href ? '<a class="stat" href="' + href + '">' + inner + "</a>" : '<div class="stat">' + inner + "</div>";
  }

  views.path = function () {
    var o = S.outline();
    app.innerHTML = '<h1 class="page-title" tabindex="-1">Your path</h1>' +
      '<p class="lead">' + o.weeks.length + " weeks, " + o.days.length + " days of 15 minutes. Six lessons a week plus one review day. Lessons run in order; if you skip a day, just pick up the next one. Locked days are still being written.</p>" +
      yearPath();
    var cur = app.querySelector(".week-row.current");
    if (cur && S._routed) cur.scrollIntoView({ block: "center" });
  };

  views.week = function (n) {
    var wi = S.weekInfo(n);
    if (!wi) { views.notfound(); return; }
    var u = S.unitOfWeek(n);
    app.innerHTML = '<a href="#/path" class="back">‹ Path</a><p class="eyebrow">' + (u ? esc(u.level) + " · Unit " + esc(u.id) + ": " + esc(u.title) : "") + "</p>" +
      '<h1 class="page-title" tabindex="-1">Week ' + n + ": " + esc(wi.title) + "</h1>" +
      (S.weekReady(n) ? "" : '<p class="note">This week is still being written. You can see the plan below.</p>') +
      weekList(n, false) +
      '<div class="row between gap">' + (S.weekInfo(n - 1) ? '<a class="btn ghost" href="#/week/' + (n - 1) + '">‹ Week ' + (n - 1) + "</a>" : "<span></span>") +
      (S.weekInfo(n + 1) ? '<a class="btn ghost" href="#/week/' + (n + 1) + '">Week ' + (n + 1) + " ›</a>" : "") + "</div>";
  };

  /* ---------- lesson player ---------- */
  views.lesson = function (id) {
    var lesson = S.lessonById(id), day = S.dayById(id);
    if (!day) { views.notfound(); return; }
    var wk = S.weekOfDay(id);
    if (!lesson && S.weekReady(wk) && !S.isWeekLoaded(wk) && !views.lesson._tried) {
      app.innerHTML = '<h1 class="page-title" tabindex="-1">Day ' + id + ": " + esc(day.title) + '</h1><p class="muted" role="status">Loading the lesson...</p>';
      var token = ++views.lesson._token;
      S.loadWeek(wk).then(function () {
        if (token !== views.lesson._token) return;
        views.lesson._tried = true;
        views.lesson(id);
        views.lesson._tried = false;
      });
      return;
    }
    if (!lesson) {
      app.innerHTML = '<h1 class="page-title" tabindex="-1">Day ' + id + ": " + esc(day.title) + '</h1><section class="card"><p class="eyebrow">Coming soon</p><p>This day is still being written. It unlocks as soon as its week is ready.</p>' +
        (day.preview ? '<p><strong>Preview:</strong> <span lang="es">' + esc(day.preview) + "</span></p>" : "") +
        (day.grammar ? "<p><strong>Grammar:</strong> " + esc(day.grammar) + "</p>" : "") +
        '<div class="row gap wrap"><a class="btn primary" href="#/">Back home</a><a class="btn ghost" href="#/week/' + S.weekOfDay(id) + '">See the week</a></div></section>';
      return;
    }
    var isReview = lesson.type === "review";
    var sections = isReview ?
      [{ k: "review", t: "Review the week", m: 5 }, { k: "dialogue", t: "Role play", m: 5 }, { k: "quiz", t: "Check quiz", m: 5 }] :
      [{ k: "warmup", t: "Warm-up review", m: 2 }, { k: "words", t: "New words", m: 4 }, { k: "grammar", t: "Grammar", m: 2 }, { k: "dialogue", t: "Listen and repeat", m: 3 }, { k: "quiz", t: "Quiz", m: 4 }];
    var cur = 0, finished = null;

    function render() {
      speech.stop();
      var s = sections[cur];
      app.innerHTML =
        '<div class="lesson-head"><a href="#/" class="back" aria-label="Back to home">‹ Home</a>' +
        '<p class="eyebrow">Day ' + lesson.id + " · " + (isReview ? "Review day" : "Lesson") + "</p>" +
        '<h1 class="page-title" tabindex="-1">' + esc(lesson.title) + "</h1></div>" +
        '<nav class="stepper" aria-label="Lesson sections"><ol>' + sections.map(function (x, i) {
          return '<li class="' + (i === cur && !finished ? "active" : i < cur || finished ? "past" : "") + '"><button type="button" data-goto="' + i + '"' + (i === cur && !finished ? ' aria-current="step"' : "") + '><span class="n">' + (i + 1) + '</span><span class="t">' + esc(x.t) + "</span></button></li>";
        }).join("") + "</ol></nav>" +
        '<section class="card section" aria-labelledby="sec-h">' +
        (finished ? doneHtml() : '<div class="sec-head"><h2 id="sec-h">' + esc(s.t) + '</h2><span class="pill">' + s.m + " min</span></div>" + '<div class="sec-body"></div>') +
        "</section>" +
        (finished ? "" : '<div class="lesson-nav">' +
          (cur > 0 ? '<button type="button" class="btn ghost" data-prev>Back</button>' : "<span></span>") +
          (s.k !== "quiz" ? '<button type="button" class="btn primary" data-nextsec>' + (cur + 1 < sections.length ? "Next: " + esc(sections[cur + 1].t) : "Finish") + "</button>" : "") +
          "</div>");
      app.querySelectorAll("[data-goto]").forEach(function (b) {
        b.addEventListener("click", function () { finished = null; cur = +b.getAttribute("data-goto"); render(); focusTop(); });
      });
      var p = app.querySelector("[data-prev]"); if (p) p.addEventListener("click", function () { cur--; render(); focusTop(); });
      var n = app.querySelector("[data-nextsec]"); if (n) n.addEventListener("click", function () { cur++; render(); focusTop(); });
      if (!finished) sectionRenderers[s.k](app.querySelector(".sec-body"));
      else {
        var again = app.querySelector("[data-again]");
        if (again) again.addEventListener("click", function () { finished = null; cur = sections.length - 1; render(); focusTop(); });
      }
    }
    function focusTop() { var h = app.querySelector("#sec-h") || app.querySelector(".page-title"); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); } window.scrollTo(0, 0); }

    function doneHtml() {
      var f = finished, pct = Math.round((f.score / f.total) * 100);
      var next = S.dayById(lesson.id + 1), nextReady = next && S.lessonById(next.id);
      var html = '<div class="done"><p class="eyebrow">Day ' + lesson.id + ' complete</p><h2 id="sec-h">' + (pct >= 80 ? "¡Excelente!" : pct >= 50 ? "¡Muy bien!" : "¡Buen trabajo!") + "</h2>" +
        '<p class="big-score">' + f.score + " / " + f.total + "</p>" +
        "<p>" + (f.added ? f.added + " new words were added to your flashcards. Your first review is tomorrow." : "Your flashcards are up to date.") + "</p>";
      if (isReview) {
        var avg = S.weekAverage(lesson.week);
        var hard = S.hardestWords(3, lesson.week);
        html += '<div class="callout"><h3>You can now</h3><ul>' + (lesson.canDo || []).map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul>" +
          "<p><strong>Week " + lesson.week + " average:</strong> " + (avg == null ? "not enough quizzes yet" : avg + "%") + ".</p>" +
          (avg != null && avg < 70 ? "<p>Under 70%: next week, take it slower. Repeat your weakest lesson once before moving on.</p>" : avg != null && avg >= 90 ? "<p>90% or more: great pace. Keep going.</p>" : "") +
          (hard.length ? "<h3>Words to watch</h3><ul>" + hard.map(function (w) { return '<li><strong lang="es">' + esc(w.es) + "</strong>: " + esc(w.en) + (w.hook ? '<br><span class="muted">Memory hook: ' + esc(w.hook) + "</span>" : "") + "</li>"; }).join("") + "</ul>" : "") +
          "</div>";
      }
      html += '<div class="row gap wrap">' +
        (nextReady ? '<a class="btn primary" href="#/lesson/' + next.id + '">Next: Day ' + next.id + "</a>" : "") +
        '<a class="btn ' + (nextReady ? "ghost" : "primary") + '" href="#/">Home</a>' +
        '<button type="button" class="btn ghost" data-again>Retake quiz</button></div></div>' +
        videoBlock(lesson.video);
      return html;
    }

    var sectionRenderers = {
      warmup: function (el) {
        var due = S.dueKeys();
        if (!due.length) {
          el.innerHTML = "<p>" + esc(lesson.warmup) + "</p>" + (lesson.video && lesson.id === 1 ? "" : "") +
            '<p class="muted small">Warm-up uses cards that are due today (up to 8). Missed words come first.</p>';
          return;
        }
        miniReview(el, due.slice(0, 8), due.length > 8 ? due.length - 8 : 0);
      },
      review: function (el) {
        var weekWords = S.allWords().filter(function (w) { return w.week === lesson.week; });
        var cards = S.state.cards;
        weekWords.sort(function (a, b) {
          var ma = cards[a.key] && cards[a.key].result === "missed" ? 0 : 1;
          var mb = cards[b.key] && cards[b.key].result === "missed" ? 0 : 1;
          return ma - mb;
        });
        el.innerHTML = "<p>" + esc(lesson.warmup) + "</p><div class='mini'></div>";
        miniReview(el.querySelector(".mini"), weekWords.slice(0, 12).map(function (w) { return w.key; }), 0, true);
      },
      words: function (el) {
        el.innerHTML = '<p class="muted">Tap ' + (speech.supported ? "the speaker to hear each word" : "each word") + (sayItOn() ? ", and the mic to practice saying it" : "") + ".</p>" +
          (speech.supported ? '<button type="button" class="btn ghost" data-playall>' + ICONS.play + " Play all words</button>" : '<p class="note">Audio is not available in this browser.</p>') +
          '<div class="word-list">' + lesson.words.map(wordCard).join("") + "</div>";
        var pa = el.querySelector("[data-playall]");
        if (pa) pa.addEventListener("click", function () {
          var token = ++playAllToken;
          var list = lesson.words.slice();
          (function step(i) {
            if (i >= list.length || token !== playAllToken) return;
            speech.speak(list[i].speak || list[i].es).then(function () { return speech.wait(900); }).then(function () { step(i + 1); });
          })(0);
        });
      },
      grammar: function (el) {
        var g = lesson.grammar;
        el.innerHTML = "<h3>" + esc(g.title) + "</h3>" + g.body.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + exampleList(g.examples);
      },
      dialogue: function (el) {
        var d = lesson.dialogue;
        el.innerHTML = "<h3>" + esc(d.title) + "</h3>" +
          '<p class="muted">Listen, then repeat each line in the pause. Lines marked Tú are yours.</p>' +
          (speech.supported ? '<div class="row gap wrap"><button type="button" class="btn primary" data-repeat>' + ICONS.play + ' Listen and repeat</button><button type="button" class="btn ghost" data-stop>Stop</button></div>' : '<p class="note">Audio is not available in this browser. Read each line out loud.</p>') +
          '<label class="switch"><input type="checkbox" data-showen checked> Show English</label>' +
          '<ol class="dialogue">' + d.lines.map(function (l, i) {
            return '<li class="line ' + (l.who === "Tú" ? "you" : "") + '" data-line="' + i + '"><span class="who">' + esc(l.who) + '</span><div class="bubble"><p lang="es">' + esc(l.es) + " " + Quiz.speakBtn(l.es, "Play line: " + l.es, "sm") + (l.who === "Tú" ? sayItBtn(l.es.replace(/_+/g, "")) : "") + '</p><p class="muted en-line">' + esc(l.en) + "</p></div></li>";
          }).join("") + "</ol>";
        var showEn = el.querySelector("[data-showen]");
        showEn.addEventListener("change", function () { el.querySelector(".dialogue").classList.toggle("hide-en", !showEn.checked); });
        var rp = el.querySelector("[data-repeat]");
        if (rp) rp.addEventListener("click", function () {
          var token = ++playAllToken;
          var lines = el.querySelectorAll(".line");
          (function step(i) {
            lines.forEach(function (x) { x.classList.remove("current"); });
            if (i >= d.lines.length || token !== playAllToken) return;
            lines[i].classList.add("current");
            lines[i].scrollIntoView({ block: "nearest", behavior: "smooth" });
            speech.speak(d.lines[i].es).then(function () { return speech.wait(3000); }).then(function () { step(i + 1); });
          })(0);
        });
        var sp = el.querySelector("[data-stop]");
        if (sp) sp.addEventListener("click", function () { playAllToken++; speech.stop(); el.querySelectorAll(".line").forEach(function (x) { x.classList.remove("current"); }); });
      },
      quiz: function (el) {
        Quiz.run(el, lesson.quiz, {
          onDone: function (score, total) {
            var added = S.completeLesson(lesson.id, score, total);
            finished = { score: score, total: total, added: added };
            render(); focusTop();
          }
        });
      }
    };
    var playAllToken = 0;
    cleanup = function () { playAllToken++; speech.stop(); };
    render();
  };

  views.lesson._token = 0;

  /* Mini review used in warm-up and review days. Knew it / Missed it map to Good / Again. */
  function miniReview(el, keys, extra, includeUnadded) {
    var i = 0, knew = 0;
    function show() {
      if (i >= keys.length) {
        el.innerHTML = '<p class="good-text"><strong>Warm-up done:</strong> ' + knew + " of " + keys.length + " remembered.</p>" +
          (extra ? '<p class="muted">' + extra + ' more cards are due. Review them in <a href="#/cards">Flashcards</a>.</p>' : "");
        return;
      }
      var w = S.wordByKey(keys[i]), card = S.state.cards[keys[i]];
      el.innerHTML = '<p class="muted small">Word ' + (i + 1) + " of " + keys.length + ". Say the meaning out loud, then check.</p>" +
        '<div class="mini-card"><p class="es big" lang="es">' + esc(w.es) + "</p>" + Quiz.speakBtn(w.speak || w.es) +
        '<div class="mini-back" hidden><p class="en">' + esc(w.en) + '</p><p class="muted small">Sounds like ' + esc(w.say) + "</p>" +
        (card && card.missStreak >= 3 && w.hook ? '<p class="hook">Memory hook: ' + esc(w.hook) + "</p>" : "") + "</div></div>" +
        '<div class="row gap mini-actions"><button type="button" class="btn primary wide" data-show>Show meaning</button></div>';
      el.querySelector("[data-show]").addEventListener("click", function () {
        el.querySelector(".mini-back").hidden = false;
        var act = el.querySelector(".mini-actions");
        act.innerHTML = '<button type="button" class="btn again" data-r="again">Missed it</button><button type="button" class="btn good" data-r="good">I knew it</button>';
        act.querySelectorAll("[data-r]").forEach(function (b) {
          b.addEventListener("click", function () {
            var r = b.getAttribute("data-r");
            if (r === "good") knew++;
            if (S.state.cards[keys[i]]) { S.grade(keys[i], r); }
            i++; show();
          });
        });
        act.querySelector("[data-r='good']").focus();
      });
    }
    if (!keys.length) { el.innerHTML = "<p>Nothing to review yet.</p>"; return; }
    show();
  }

  /* ---------- flashcards ---------- */
  views.cards = function () {
    var dir = S.state.settings.direction;
    var mode = "due";
    var queue = [], idx = 0, flipped = false, seen = {}, tally = { again: 0, good: 0, easy: 0 };

    function shell() {
      var st = S.stats();
      app.innerHTML = '<h1 class="page-title" tabindex="-1">Flashcards</h1>' +
        '<div class="mini-stats"><span><strong>' + st.due + "</strong> due</span><span><strong>" + st.learned + "</strong> learned</span><span><strong>" + st.known + "</strong> known</span></div>" +
        '<fieldset class="seg" aria-label="Card direction"><legend class="sr-only">Card direction</legend>' +
        seg("dir", "es-en", "Spanish to English", dir) + seg("dir", "en-es", "English to Spanish", dir) + seg("dir", "mixed", "Mixed", dir) + "</fieldset>" +
        '<div id="deck"></div>';
      app.querySelectorAll("input[name=dir]").forEach(function (r) {
        r.addEventListener("change", function () { dir = r.value; S.state.settings.direction = dir; S.save(); if (queue.length) showCard(); });
      });
    }
    function seg(name, val, label, cur) {
      var id = name + "-" + val;
      return '<input type="radio" name="' + name + '" id="' + id + '" value="' + val + '"' + (val === cur ? " checked" : "") + '><label for="' + id + '">' + label + "</label>";
    }
    function start(m) {
      mode = m; idx = 0; flipped = false; seen = {}; tally = { again: 0, good: 0, easy: 0 };
      queue = m === "due" ? S.dueKeys() : S.shuffle(Object.keys(S.state.cards).filter(function (k) { return S.wordByKey(k); }));
      queue = queue.map(function (k) { return { key: k, side: pickSide() }; });
      if (!queue.length) empty(); else showCard();
    }
    function pickSide() { return dir === "mixed" ? (Math.random() < 0.5 ? "es-en" : "en-es") : dir; }
    function empty() {
      var deck = document.getElementById("deck"), n = Object.keys(S.state.cards).length;
      if (!n) {
        deck.innerHTML = '<section class="card center"><h2>No cards yet</h2><p>Finish Lesson 1 and its words become flashcards. Your first review is the next day.</p><a class="btn primary" href="#/lesson/' + (S.todayLessonId() || 1) + '">Go to today\'s lesson</a></section>';
        return;
      }
      var nd = S.nextDueDate();
      deck.innerHTML = '<section class="card center"><h2>All caught up</h2><p>Nothing is due right now.' + (nd ? " Next review: " + esc(S.niceDate(nd)) + "." : "") + "</p>" +
        '<p class="muted small">Practice mode lets you go through every card. It does not change your review schedule.</p>' +
        '<button type="button" class="btn primary" data-practiceall>Practice all ' + n + " cards</button></section>";
      deck.querySelector("[data-practiceall]").addEventListener("click", function () { start("all"); });
    }
    function showCard() {
      var deck = document.getElementById("deck");
      if (idx >= queue.length) { summary(); return; }
      var item = queue[idx], w = S.wordByKey(item.key), card = S.state.cards[item.key];
      if (dir !== "mixed") item.side = dir;
      var front = item.side === "es-en"
        ? '<p class="es big" lang="es">' + esc(w.es) + "</p>"
        : '<p class="en big">' + esc(w.en) + '</p><p class="muted small">Say it in Spanish</p>';
      var back = item.side === "es-en"
        ? '<p class="en big">' + esc(w.en) + "</p>"
        : '<p class="es big" lang="es">' + esc(w.es) + "</p>";
      back += '<p class="muted small">Sounds like ' + esc(w.say) + "</p>" +
        (w.example ? '<p class="small"><span lang="es">' + esc(w.example.es) + '</span><br><span class="muted">' + esc(w.example.en) + "</span></p>" : "") +
        (card && card.missStreak >= 3 ? '<p class="hook">Memory hook: ' + esc(w.hook || "Say it out loud three times and use it in a sentence today.") + "</p>" : "");
      deck.innerHTML =
        '<p class="muted small center">' + (mode === "due" ? "Review" : "Practice, schedule unchanged") + " · Card " + (idx + 1) + " of " + queue.length + "</p>" +
        '<div class="progress-bar" aria-hidden="true"><span style="width:' + Math.round((idx / queue.length) * 100) + '%"></span></div>' +
        '<div class="flip-wrap"><button type="button" class="flashcard' + (flipped ? " flipped" : "") + '" aria-label="' + (flipped ? "Card back. Press to flip to the front." : "Card front. Press to flip and see the answer.") + '" data-flip>' +
        '<div class="face front">' + front + "</div>" +
        '<div class="face back" aria-hidden="' + (!flipped) + '">' + back + "</div></button></div>" +
        '<div class="card-tools">' + Quiz.speakBtn(w.speak || w.es, "Play: " + (w.speak || w.es)) + (flipped ? sayItBtn(w.speak || w.es) : "") + "</div>" +
        '<div class="grade-row" role="group" aria-label="How well did you know it?">' +
        (flipped
          ? gradeBtn("again", "Again", card) + gradeBtn("good", "Good", card) + gradeBtn("easy", "Easy", card)
          : '<button type="button" class="btn primary wide" data-flip>Show answer</button>') +
        "</div>" +
        '<p class="muted small center kbd-hint">Keyboard: Space to flip, 1 Again, 2 Good, 3 Easy.</p>';
      if (item.side === "es-en" && !flipped && speech.supported) { /* auto say Spanish on front */ }
      deck.querySelectorAll("[data-flip]").forEach(function (b) { b.addEventListener("click", flip); });
      deck.querySelectorAll("[data-grade]").forEach(function (b) { b.addEventListener("click", function () { grade(b.getAttribute("data-grade")); }); });
      var focusEl = flipped ? deck.querySelector("[data-grade='good']") : deck.querySelector(".flashcard");
      if (focusEl && document.activeElement && document.activeElement !== document.body) focusEl.focus({ preventScroll: true });
    }
    function gradeBtn(g, label, card) {
      var sub = mode === "due" ? S.intervalLabel(card, g) : (g === "again" ? "see again" : "next");
      return '<button type="button" class="btn grade ' + g + '" data-grade="' + g + '"><span>' + label + '</span><span class="sub">' + sub + "</span></button>";
    }
    function flip() {
      flipped = !flipped;
      showCard();
      if (flipped && queue[idx] && queue[idx].side === "en-es") {
        var w = S.wordByKey(queue[idx].key); speech.speak(w.speak || w.es);
      }
    }
    function grade(g) {
      var item = queue[idx];
      tally[g]++;
      if (mode === "due" && !seen[item.key]) S.grade(item.key, g);
      seen[item.key] = true;
      if (g === "again") queue.push({ key: item.key, side: item.side });
      idx++; flipped = false;
      showCard();
    }
    function summary() {
      S.markActivity();
      var deck = document.getElementById("deck");
      deck.innerHTML = '<section class="card center"><h2>Session done</h2><p>Again: ' + tally.again + " · Good: " + tally.good + " · Easy: " + tally.easy + "</p>" +
        (mode === "due" ? "<p>Your schedule is updated. Missed words come back tomorrow.</p>" : "") +
        '<div class="row gap center wrap"><a class="btn primary" href="#/">Home</a><button type="button" class="btn ghost" data-more>Practice all cards</button></div></section>';
      deck.querySelector("[data-more]").addEventListener("click", function () { start("all"); });
    }
    function onKey(ev) {
      if (!queue.length || idx >= queue.length) return;
      if (ev.target && /input|textarea|select/i.test(ev.target.tagName)) return;
      if (ev.key === " " || ev.key === "Enter") { if (ev.target.closest && ev.target.closest("button:not(.flashcard)")) return; ev.preventDefault(); flip(); }
      else if (flipped && (ev.key === "1" || ev.key === "2" || ev.key === "3")) grade(["again", "good", "easy"][+ev.key - 1]);
    }
    document.addEventListener("keydown", onKey);
    cleanup = function () { document.removeEventListener("keydown", onKey); speech.stop(); };
    shell();
    start("due");
  };

  /* ---------- practice quizzes ---------- */
  views.practice = function () {
    var ready = S.loadedLessons().filter(function (l) { return l.words && l.words.length; });
    var done = ready.filter(function (l) { return S.state.completed[l.id]; });
    var chosen = {};
    (done.length ? done : ready.slice(0, 1)).forEach(function (l) { chosen[l.id] = true; });
    app.innerHTML = '<h1 class="page-title" tabindex="-1">Practice</h1>' +
      '<p class="lead">Extra quizzes on any lesson. Practice does not change your flashcard schedule.</p>' +
      '<section class="card" id="practice-setup"><form id="pform">' +
      '<fieldset><legend class="label">Quiz type</legend><div class="seg wrap">' +
      [["mixed", "Mixed"], ["mc", "Multiple choice"], ["type", "Type the answer"], ["listen", "Listen and choose"], ["match", "Match pairs"]].map(function (t, i) {
        if (t[0] === "listen" && !speech.supported) return "";
        return '<input type="radio" name="kind" id="k-' + t[0] + '" value="' + t[0] + '"' + (i === 0 ? " checked" : "") + '><label for="k-' + t[0] + '">' + t[1] + "</label>";
      }).join("") + "</div></fieldset>" +
      '<fieldset><legend class="label">Lessons</legend><div class="chips">' +
      ready.map(function (l) {
        return '<label class="chip"><input type="checkbox" name="ls" value="' + l.id + '"' + (chosen[l.id] ? " checked" : "") + "> Day " + l.id + ": " + esc(l.title) + "</label>";
      }).join("") + "</div></fieldset>" +
      '<p class="form-error" role="alert"></p>' +
      '<button type="submit" class="btn primary wide">Start practice</button></form></section>' +
      '<section class="card" id="practice-run" hidden></section>';
    var form = document.getElementById("pform"), run = document.getElementById("practice-run");
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var kind = form.querySelector("input[name=kind]:checked").value;
      var ids = Array.prototype.map.call(form.querySelectorAll("input[name=ls]:checked"), function (c) { return +c.value; });
      var words = S.allWords().filter(function (w) { return ids.indexOf(w.lesson) >= 0; });
      var err = form.querySelector(".form-error");
      if (words.length < 4) { err.textContent = "Pick at least one lesson."; return; }
      err.textContent = "";
      var qs = Quiz.generate(words, kind, 8);
      document.getElementById("practice-setup").hidden = true;
      run.hidden = false;
      Quiz.run(run, qs, {
        onDone: function (score, total) {
          S.markActivity();
          run.innerHTML = '<div class="center"><p class="eyebrow">Practice done</p><p class="big-score">' + score + " / " + total + '</p><div class="row gap center wrap"><button type="button" class="btn primary" data-again>Practice again</button><a class="btn ghost" href="#/">Home</a></div></div>';
          run.querySelector("[data-again]").addEventListener("click", function () { views.practice(); });
        }
      });
    });
  };

  /* ---------- progress and settings ---------- */
  views.progress = function () {
    var st = S.stats(), completed = S.state.completed;
    var rows = S.outline().days.filter(function (d) { return completed[d.id]; }).map(function (d) {
      var c = completed[d.id];
      return "<tr><td>Day " + d.id + "</td><td>" + esc(d.title) + "</td><td>" + esc(S.niceDate(c.date)) + "</td><td>" + c.score + "/" + c.total + "</td></tr>";
    }).join("");
    var weeks = S.outline().weeks.map(function (w) {
      var a = S.weekAverage(w.week);
      return a == null ? "" : "<li>Week " + w.week + ": " + a + "% average</li>";
    }).join("");
    var hard = S.hardestWords(5);
    var voiceOpts = speech.voices.map(function (v) {
      return '<option value="' + esc(v.voiceURI) + '"' + (v.voiceURI === S.state.settings.voice ? " selected" : "") + ">" + esc(v.name + " (" + v.lang + ")") + "</option>";
    }).join("");
    app.innerHTML = '<h1 class="page-title" tabindex="-1">Progress</h1>' +
      '<section class="stats" aria-label="Totals">' + stat(ICONS.flame, st.streak, "day streak") + stat("", st.lessonsDone, "days done") + stat("", st.learned, "words learned") + stat("", st.known, "words known") + "</section>" +
      '<section class="card"><h2 class="h3">Lesson history</h2>' + (rows ? '<div class="table-wrap"><table><thead><tr><th scope="col">Day</th><th scope="col">Topic</th><th scope="col">Date</th><th scope="col">Score</th></tr></thead><tbody>' + rows + "</tbody></table></div>" : "<p>No lessons finished yet.</p>") +
      (weeks ? '<ul class="plain">' + weeks + "</ul>" : "") + "</section>" +
      (hard.length ? '<section class="card"><h2 class="h3">Words to watch</h2><ul>' + hard.map(function (w) { return '<li><strong lang="es">' + esc(w.es) + "</strong>: " + esc(w.en) + "</li>"; }).join("") + "</ul></section>" : "") +
      '<section class="card"><h2 class="h3">Settings</h2>' +
      '<div class="field"><label for="set-theme" class="label">Theme</label><select id="set-theme"><option value="auto">Match my device</option><option value="light">Light</option><option value="dark">Dark</option></select></div>' +
      (speech.supported ?
        '<div class="field"><label for="set-rate" class="label">Speech speed: <span id="rate-val"></span></label><input type="range" id="set-rate" min="0.5" max="1.2" step="0.05"></div>' +
        '<div class="field"><label for="set-voice" class="label">Spanish voice</label><select id="set-voice"><option value="">Automatic (Mexico or US Spanish first)</option>' + voiceOpts + "</select>" +
        (speech.voices.length ? "" : '<p class="muted small">No Spanish voice found yet. Your device may need a Spanish voice installed in its settings.</p>') +
        '<button type="button" class="btn ghost" data-say="Hola, ¿cómo estás? Mucho gusto.">' + ICONS.speaker + " Test voice</button></div>"
        : '<p class="note">This browser cannot play speech.</p>') +
      (speech.canListen ? '<div class="field"><label class="switch"><input type="checkbox" id="set-speak"' + (S.state.settings.speaking ? " checked" : "") + "> Show Say it buttons (speaking practice)</label></div>" : '<p class="muted small">Speaking practice is not supported in this browser, so the Say it buttons are hidden.</p>') +
      "</section>" +
      '<section class="card"><h2 class="h3">Your data</h2><p>Progress is saved only in this browser on this device. Nothing is sent anywhere. Export a backup to move it to another device.</p>' +
      '<div class="row gap wrap"><button type="button" class="btn primary" id="btn-export">Export progress</button><button type="button" class="btn ghost" id="btn-import">Import progress</button>' +
      '<input type="file" id="import-file" accept="application/json,.json" class="sr-only" tabindex="-1" aria-hidden="true"></div>' +
      '<details class="paste"><summary>Or paste progress JSON</summary><label for="import-text" class="label">Progress JSON</label><textarea id="import-text" rows="4" spellcheck="false"></textarea><button type="button" class="btn ghost" id="btn-import-text">Import pasted text</button></details>' +
      '<hr><div id="reset-zone"><button type="button" class="btn danger" id="btn-reset">Reset all progress</button></div></section>' +
      '<section class="card"><h2 class="h3">About</h2><p>Spanish in 15 is a free, private practice site for beginners learning Latin American Spanish. No accounts, no ads, no tracking.</p></section>';

    var th = document.getElementById("set-theme");
    th.value = S.state.settings.theme;
    th.addEventListener("change", function () { S.state.settings.theme = th.value; S.save(); S.applyTheme(); });
    var rate = document.getElementById("set-rate");
    if (rate) {
      var rv = document.getElementById("rate-val");
      var label = function () { var r = +rate.value; rv.textContent = r < 0.75 ? "slow" : r < 0.95 ? "relaxed" : "normal"; };
      rate.value = S.state.settings.rate; label();
      rate.addEventListener("input", function () { S.state.settings.rate = +rate.value; S.save(); label(); });
    }
    var vs = document.getElementById("set-voice");
    if (vs) vs.addEventListener("change", function () { S.state.settings.voice = vs.value; S.save(); });
    var sp = document.getElementById("set-speak");
    if (sp) sp.addEventListener("change", function () { S.state.settings.speaking = sp.checked; S.save(); });

    document.getElementById("btn-export").addEventListener("click", exportProgress);
    var fileIn = document.getElementById("import-file");
    document.getElementById("btn-import").addEventListener("click", function () { fileIn.click(); });
    fileIn.addEventListener("change", function () {
      var f = fileIn.files && fileIn.files[0];
      if (!f) return;
      var rd = new FileReader();
      rd.onload = function () { importText(String(rd.result)); };
      rd.readAsText(f);
    });
    document.getElementById("btn-import-text").addEventListener("click", function () { importText(document.getElementById("import-text").value); });
    document.getElementById("btn-reset").addEventListener("click", showResetConfirm);
  };

  function exportProgress() {
    var data = JSON.stringify(Object.assign({ exported: new Date().toISOString() }, S.state), null, 2);
    var name = "spanish-in-15-progress-" + S.today() + ".json";
    try {
      var blob = new Blob([data], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      S.toast("Progress exported.");
    } catch (e) {
      var ta = document.getElementById("import-text");
      if (ta) { ta.value = data; ta.closest("details").open = true; }
      S.toast("Copy the text below to save your progress.");
    }
  }
  function importText(text) {
    var raw;
    try { raw = JSON.parse(text); } catch (e) { S.toast("That file is not valid progress JSON."); return; }
    var clean = S.sanitize(raw);
    if (!clean) { S.toast("That file is not a Spanish in 15 progress file."); return; }
    S.state = clean; S.save(); S.applyTheme();
    S.toast("Progress imported.");
    route();
  }
  function showResetConfirm() {
    var zone = document.getElementById("reset-zone");
    zone.innerHTML = '<div class="confirm" role="alertdialog" aria-labelledby="rc-h" aria-describedby="rc-d"><h3 id="rc-h">Erase all progress?</h3><p id="rc-d">This deletes your streak, scores and flashcard schedule from this browser. Export a backup first if you might want it back.</p>' +
      '<div class="row gap wrap"><button type="button" class="btn danger" id="rc-yes">Yes, erase everything</button><button type="button" class="btn ghost" id="rc-no">Cancel</button></div></div>';
    document.getElementById("rc-no").focus();
    document.getElementById("rc-no").addEventListener("click", function () { views.progress(); });
    document.getElementById("rc-yes").addEventListener("click", function () { S.reset(); S.applyTheme(); S.toast("Progress reset."); location.hash = "#/"; route(); });
  }

  views.notfound = function () {
    app.innerHTML = '<h1 class="page-title" tabindex="-1">Page not found</h1><p><a href="#/">Go home</a></p>';
  };

  /* ---------- router ---------- */
  function route() {
    if (cleanup) { try { cleanup(); } catch (e) { /* ignore */ } cleanup = null; }
    var h = (location.hash || "#/").replace(/^#/, "").split("#")[0];
    var parts = h.split("/").filter(Boolean);
    var name = parts[0] || "home";
    var TAB = { home: "home", path: "home", week: "home", lesson: "home", practice: "practice", cards: "practice", timed: "practice", quiz: "practice", awards: "awards", profile: "profile", progress: "profile" };
    document.querySelectorAll(".tabbar a").forEach(function (a) {
      var on = a.getAttribute("data-tab") === (TAB[name] || name);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    if (name === "lesson") views.lesson(parseInt(parts[1], 10));
    else if (name === "week") views.week(parseInt(parts[1], 10));
    else if (views[name] && name !== "notfound") views[name]();
    else views.notfound();
    var t = { home: "Learn", path: "Year map", week: "Week", lesson: "Study notes", cards: "Flashcards", practice: "Practice", timed: "Timed match", quiz: "Quiz builder", awards: "Achievements", profile: "Profile", progress: "Profile" }[name] || "Spanish in 15";
    document.title = (name === "home" ? "" : t + " · ") + "Spanish in 15";
    window.scrollTo(0, 0);
    var h1 = app.querySelector(".page-title");
    if (h1 && S._routed) h1.focus({ preventScroll: true });
    S._routed = true;
    if (S.refreshHeader) S.refreshHeader();
    if (S.afterRoute) S.afterRoute(name);
  }
  S.route = route;
  S.onVoicesChanged = function () {
    if ((location.hash || "").indexOf("#/progress") === 0) {
      var vs = document.getElementById("set-voice");
      if (vs && vs.options.length <= 1) views.progress();
    }
  };

  /* Spanish in 15 v2 game views (js/v2.js) plug in here. */
  if (S.installV2) S.installV2(views, {
    app: app, ICONS: ICONS, weekList: weekList, yearPath: yearPath, statusOf: statusOf,
    setCleanup: function (fn) { cleanup = fn; }, stat: stat
  });

  S.load();
  var streakNote = S.checkStreak ? S.checkStreak() : null;
  S.applyTheme();
  app.innerHTML = '<p class="muted" role="status">Loading...</p>';
  window.addEventListener("hashchange", route);
  /* Offline cache when served over http(s), for example on GitHub Pages. */
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () { /* optional */ }); });
  }
  /* Tapping the tab you are already on resets that view. */
  document.querySelector(".tabbar").addEventListener("click", function (ev) {
    var a = ev.target.closest("a");
    if (a && a.getAttribute("href") === (location.hash || "#/")) { ev.preventDefault(); route(); }
  });
  /* Load week files the learner already uses, then show the page. */
  if (streakNote && streakNote.frozen) setTimeout(function () { S.toast("A streak freeze saved your streak. ❄️"); }, 800);
  var bootTimer = setTimeout(route, 4000);
  S.loadNeededWeeks().then(function () { clearTimeout(bootTimer); route(); }, function () { clearTimeout(bootTimer); route(); });
})();
