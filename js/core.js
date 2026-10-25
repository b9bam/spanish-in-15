/* Spanish in 15: core helpers, storage and spaced repetition. */
(function () {
  "use strict";
  var S = (window.S15 = window.S15 || {});

  /* ---------- small helpers ---------- */
  S.esc = function (s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };
  S.shuffle = function (arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };
  S.pad = function (n) { return (n < 10 ? "0" : "") + n; };
  S.dateStr = function (d) { return d.getFullYear() + "-" + S.pad(d.getMonth() + 1) + "-" + S.pad(d.getDate()); };
  S.today = function () { return S.dateStr(new Date()); };
  S.addDays = function (ds, n) {
    var p = ds.split("-");
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    d.setDate(d.getDate() + n);
    return S.dateStr(d);
  };
  S.daysBetween = function (a, b) {
    var pa = a.split("-"), pb = b.split("-");
    var da = Date.UTC(+pa[0], +pa[1] - 1, +pa[2]);
    var db = Date.UTC(+pb[0], +pb[1] - 1, +pb[2]);
    return Math.round((db - da) / 86400000);
  };
  S.niceDate = function (ds) {
    if (!ds) return "";
    var p = ds.split("-");
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  /* Text normalizing for answer checks. */
  S.clean = function (s) {
    return String(s || "").toLowerCase()
      .replace(/[¿?¡!.,;:"“”()]/g, " ")
      .replace(/_+/g, " ")
      .replace(/\s+/g, " ").trim();
  };
  S.noAccents = function (s) {
    return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };
  S.levenshtein = function (a, b) {
    var m = a.length, n = b.length, i, j;
    if (!m) return n; if (!n) return m;
    var prev = [], cur = [];
    for (j = 0; j <= n; j++) prev[j] = j;
    for (i = 1; i <= m; i++) {
      cur = [i];
      for (j = 1; j <= n; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[n];
  };
  S.similarity = function (a, b) {
    a = S.noAccents(S.clean(a)); b = S.noAccents(S.clean(b));
    if (!a && !b) return 1;
    return 1 - S.levenshtein(a, b) / Math.max(a.length, b.length);
  };

  /*
    Check a typed answer.
    Returns { ok, exact, accentHint }.
    ok is true when the answer matches ignoring accents and punctuation.
    accentHint is set when the accents differ from the correct spelling.
  */
  S.checkTyped = function (input, answers) {
    var given = S.clean(input);
    for (var i = 0; i < answers.length; i++) {
      var target = S.clean(answers[i]);
      if (given === target) return { ok: true, exact: true, match: answers[i] };
      if (S.noAccents(given) === S.noAccents(target)) {
        return { ok: true, exact: false, match: answers[i], accentHint: true };
      }
    }
    return { ok: false };
  };

  /* ---------- course outline (52-week year, or the 4-week fallback) ---------- */
  S.outline = function () {
    if (S._outline) return S._outline;
    var Y = window.YEAR_OUTLINE, o;
    if (Y && Y.days && Y.days.length && Y.weeks && Y.weeks.length) {
      o = {
        title: Y.title || "Spanish in 15",
        levels: (Y.levels && Y.levels.length) ? Y.levels : [{ id: "A1", title: "Beginner" }],
        units: (Y.units && Y.units.length) ? Y.units : [{ id: 1, level: "A1", title: "Your year", weeks: Y.weeks.map(function (w) { return w.week; }) }],
        weeks: Y.weeks.slice(),
        days: Y.days.slice()
      };
    } else {
      var C = window.COURSE;
      o = {
        title: C.title,
        levels: [{ id: "A1", title: "Beginner" }],
        units: [{ id: 1, level: "A1", title: "First month", weeks: C.weeks.map(function (w) { return w.week; }) }],
        weeks: C.weeks.map(function (w) { return { week: w.week, unit: 1, title: w.title }; }),
        days: C.days.slice()
      };
    }
    o.weeks.forEach(function (w) {
      if (!w.unit) {
        o.units.forEach(function (u) { if ((u.weeks || []).indexOf(w.week) >= 0) w.unit = u.id; });
      }
      if (!w.status) w.status = (window.YEAR_OUTLINE || (window.LESSONS || []).some(function (l) { return l.week === w.week; })) ? "ready" : "planned";
    });
    o.units.forEach(function (u) {
      if (!u.weeks || !u.weeks.length) u.weeks = o.weeks.filter(function (w) { return w.unit === u.id; }).map(function (w) { return w.week; });
    });
    S._outline = o;
    return o;
  };
  S.weekOfDay = function (id) { return Math.ceil(id / 7); };
  S.weekInfo = function (n) {
    var W = S.outline().weeks;
    for (var i = 0; i < W.length; i++) if (W[i].week === n) return W[i];
    return null;
  };
  S.unitOfWeek = function (n) {
    var U = S.outline().units;
    for (var i = 0; i < U.length; i++) if (U[i].weeks.indexOf(n) >= 0) return U[i];
    return null;
  };
  /* Is a week's content published? Weeks 1 and 2 live in lessons.js. */
  S.weekReady = function (n) {
    if (S.inlineWeek(n)) return true;
    var w = S.weekInfo(n);
    return !!(w && w.status === "ready");
  };
  S.inlineWeek = function (n) {
    return (window.LESSONS || []).some(function (l) { return l.week === n; });
  };

  /* ---------- lazy week files: data/weeks/weekNN.js ---------- */
  var weekPromises = {};
  S.weekFile = function (n) { return "data/weeks/week" + (n < 10 ? "0" : "") + n + ".js"; };
  S.isWeekLoaded = function (n) { return S.inlineWeek(n) || !!(window.S15_WEEKS && window.S15_WEEKS[n]); };
  S.loadWeek = function (n) {
    if (S.isWeekLoaded(n)) return Promise.resolve(true);
    if (!S.weekReady(n)) return Promise.resolve(false);
    if (weekPromises[n]) return weekPromises[n];
    weekPromises[n] = new Promise(function (resolve) {
      var sc = document.createElement("script");
      sc.src = S.weekFile(n);
      sc.async = true;
      sc.onload = function () {
        var wk = window.S15_WEEKS && window.S15_WEEKS[n];
        if (wk && wk.videos) {
          window.VIDEOS = window.VIDEOS || {};
          Object.keys(wk.videos).forEach(function (k) { if (!window.VIDEOS[k]) window.VIDEOS[k] = wk.videos[k]; });
        }
        S._wordIndex = null;
        resolve(!!wk);
      };
      sc.onerror = function () { delete weekPromises[n]; resolve(false); };
      document.head.appendChild(sc);
    });
    return weekPromises[n];
  };
  S.loadWeeks = function (list) {
    var seen = {};
    return Promise.all(list.filter(function (n) {
      if (!n || seen[n]) return false; seen[n] = 1; return true;
    }).map(S.loadWeek));
  };
  /* Load every week the learner has cards or scores in, plus the current week. */
  S.loadNeededWeeks = function () {
    var weeks = [];
    Object.keys(S.state.cards).forEach(function (k) { var m = /^l(\d+)-/.exec(k); if (m) weeks.push(S.weekOfDay(+m[1])); });
    Object.keys(S.state.completed).forEach(function (k) { weeks.push(S.weekOfDay(+k)); });
    var t = S.todayLessonId(); if (t) weeks.push(S.weekOfDay(t));
    return S.loadWeeks(weeks);
  };

  /* ---------- lessons and words ---------- */
  S.loadedLessons = function () {
    var out = (window.LESSONS || []).slice();
    var W = window.S15_WEEKS || {};
    Object.keys(W).sort(function (a, b) { return a - b; }).forEach(function (k) {
      if (+k > 2 && W[k] && W[k].lessons) out = out.concat(W[k].lessons);
    });
    return out;
  };
  S.lessonById = function (id) {
    var L = S.loadedLessons();
    for (var i = 0; i < L.length; i++) if (L[i].id === id) return L[i];
    return null;
  };
  S.dayById = function (id) {
    var D = S.outline().days;
    for (var i = 0; i < D.length; i++) if (D[i].id === id) return D[i];
    return null;
  };
  S.wordId = function (lesson, w) {
    return w.id || ("l" + lesson.id + "-" + S.noAccents(S.clean(w.es)).replace(/\s+/g, "-"));
  };
  S.allWords = function () {
    var out = [];
    S.loadedLessons().forEach(function (l) {
      (l.words || []).forEach(function (w) {
        out.push(Object.assign({ key: S.wordId(l, w), lesson: l.id, week: l.week }, w));
      });
    });
    return out;
  };
  S.wordByKey = function (key) {
    if (!S._wordIndex) {
      S._wordIndex = {};
      S.allWords().forEach(function (w) { S._wordIndex[w.key] = w; });
    }
    return S._wordIndex[key] || null;
  };

  /* ---------- storage ---------- */
  var KEY = "spanish15.progress.v1";
  S.STEPS = [1, 3, 7, 14, 30];

  function defaults() {
    return {
      app: "spanish-in-15",
      version: 1,
      started: S.today(),
      completed: {},
      cards: {},
      streak: { count: 0, last: null },
      activity: {},
      settings: { theme: "auto", rate: 0.85, voice: "", direction: "es-en", speaking: true }
    };
  }
  S.defaults = defaults;

  S.load = function () {
    var st = null;
    try { st = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { st = null; }
    S.state = S.sanitize(st) || S.defaults();
    return S.state;
  };
  S.save = function () {
    try { localStorage.setItem(KEY, JSON.stringify(S.state)); }
    catch (e) { S.toast && S.toast("Could not save progress in this browser."); }
  };
  S.reset = function () {
    try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    S.state = S.defaults();
    S.save();
  };

  function isDate(s) { return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s); }
  function num(n, d) { n = Number(n); return isFinite(n) ? n : d; }

  /* Validate imported or stored data and keep only known fields. */
  S.sanitize = function (raw) {
    if (!raw || typeof raw !== "object" || raw.app !== "spanish-in-15") return null;
    var st = defaults();
    if (isDate(raw.started)) st.started = raw.started;
    if (raw.completed && typeof raw.completed === "object") {
      Object.keys(raw.completed).forEach(function (k) {
        var c = raw.completed[k];
        if (!/^\d+$/.test(k) || !c || typeof c !== "object") return;
        st.completed[k] = {
          date: isDate(c.date) ? c.date : S.today(),
          score: Math.max(0, num(c.score, 0)),
          total: Math.max(0, num(c.total, 0)),
          best: Math.max(0, num(c.best, num(c.score, 0))),
          attempts: Math.max(1, num(c.attempts, 1))
        };
      });
    }
    if (raw.cards && typeof raw.cards === "object") {
      Object.keys(raw.cards).forEach(function (k) {
        var c = raw.cards[k];
        if (!/^[a-z0-9-]+$/i.test(k) || !c || typeof c !== "object") return;
        st.cards[k] = {
          step: Math.min(4, Math.max(0, Math.round(num(c.step, 0)))),
          due: isDate(c.due) ? c.due : S.today(),
          added: isDate(c.added) ? c.added : S.today(),
          last: isDate(c.last) ? c.last : null,
          result: ["new", "correct", "missed"].indexOf(c.result) >= 0 ? c.result : "new",
          missStreak: Math.max(0, Math.round(num(c.missStreak, 0))),
          misses: Math.max(0, Math.round(num(c.misses, 0))),
          reviews: Math.max(0, Math.round(num(c.reviews, 0)))
        };
      });
    }
    if (raw.streak && typeof raw.streak === "object") {
      st.streak.count = Math.max(0, Math.round(num(raw.streak.count, 0)));
      st.streak.last = isDate(raw.streak.last) ? raw.streak.last : null;
    }
    if (raw.activity && typeof raw.activity === "object") {
      Object.keys(raw.activity).forEach(function (k) {
        if (isDate(k)) st.activity[k] = Math.max(0, Math.round(num(raw.activity[k], 0)));
      });
    }
    var s = raw.settings || {};
    if (["auto", "light", "dark"].indexOf(s.theme) >= 0) st.settings.theme = s.theme;
    st.settings.rate = Math.min(1.2, Math.max(0.5, num(s.rate, 0.85)));
    if (typeof s.voice === "string") st.settings.voice = s.voice.slice(0, 200);
    if (["es-en", "en-es", "mixed"].indexOf(s.direction) >= 0) st.settings.direction = s.direction;
    st.settings.speaking = s.speaking !== false;
    return st;
  };

  /* ---------- streak and activity ---------- */
  S.markActivity = function () {
    var st = S.state, t = S.today();
    st.activity[t] = (st.activity[t] || 0) + 1;
    if (st.streak.last !== t) {
      st.streak.count = st.streak.last === S.addDays(t, -1) ? st.streak.count + 1 : 1;
      st.streak.last = t;
    }
    S.save();
  };
  S.currentStreak = function () {
    var st = S.state, t = S.today();
    if (st.streak.last === t || st.streak.last === S.addDays(t, -1)) return st.streak.count;
    return 0;
  };

  /* ---------- spaced repetition (plan intervals: 1, 3, 7, 14, 30 days) ---------- */
  S.addCard = function (key) {
    if (S.state.cards[key]) return false;
    var t = S.today();
    S.state.cards[key] = { step: 0, due: S.addDays(t, 1), added: t, last: null, result: "new", missStreak: 0, misses: 0, reviews: 0 };
    return true;
  };
  /* What step a grade would move a card to. grade: again | good | easy */
  S.nextStep = function (card, grade) {
    var step = card ? card.step : 0;
    if (grade === "again") return 0;
    if (grade === "easy") return Math.min(4, step + 2);
    return Math.min(4, step + 1);
  };
  S.intervalLabel = function (card, grade) {
    var d = S.STEPS[S.nextStep(card, grade)];
    return d === 1 ? "1 day" : d + " days";
  };
  S.grade = function (key, grade) {
    var c = S.state.cards[key];
    if (!c) return;
    var t = S.today();
    var step = S.nextStep(c, grade);
    c.step = step;
    c.due = S.addDays(t, S.STEPS[step]);
    c.last = t;
    c.reviews += 1;
    if (grade === "again") { c.result = "missed"; c.missStreak += 1; c.misses += 1; }
    else { c.result = "correct"; c.missStreak = 0; }
    S.save();
  };
  S.isKnown = function (c) { return c.step === 4 && c.result === "correct"; };
  /* Due cards: missed first, then oldest due. */
  S.dueKeys = function () {
    var t = S.today(), cards = S.state.cards;
    return Object.keys(cards).filter(function (k) {
      return cards[k].due <= t && S.wordByKey(k);
    }).sort(function (a, b) {
      var ca = cards[a], cb = cards[b];
      var ma = ca.result === "missed" ? 0 : 1, mb = cb.result === "missed" ? 0 : 1;
      if (ma !== mb) return ma - mb;
      return ca.due < cb.due ? -1 : ca.due > cb.due ? 1 : 0;
    });
  };
  S.nextDueDate = function () {
    var cards = S.state.cards, best = null;
    Object.keys(cards).forEach(function (k) { if (!best || cards[k].due < best) best = cards[k].due; });
    return best;
  };
  S.stats = function () {
    var cards = S.state.cards, keys = Object.keys(cards);
    return {
      learned: keys.length,
      known: keys.filter(function (k) { return S.isKnown(cards[k]); }).length,
      due: S.dueKeys().length,
      streak: S.currentStreak(),
      lessonsDone: Object.keys(S.state.completed).length
    };
  };
  /* Today's lesson: the first day on the path not yet completed. */
  S.todayLessonId = function () {
    var D = S.outline().days;
    for (var i = 0; i < D.length; i++) if (!S.state.completed[D[i].id]) return D[i].id;
    return null;
  };
  S.completeLesson = function (id, score, total) {
    var prev = S.state.completed[id];
    S.state.completed[id] = {
      date: S.today(), score: score, total: total,
      best: prev ? Math.max(prev.best || 0, score) : score,
      attempts: prev ? (prev.attempts || 1) + 1 : 1
    };
    var lesson = S.lessonById(id), added = 0;
    if (lesson && lesson.words) lesson.words.forEach(function (w) { if (S.addCard(S.wordId(lesson, w))) added++; });
    S.save();
    S.markActivity();
    return added;
  };
  S.weekAverage = function (week) {
    var sum = 0, n = 0;
    S.outline().days.forEach(function (d) {
      var c = S.state.completed[d.id];
      if (d.week === week && c && c.total) { sum += c.score / c.total; n++; }
    });
    return n ? Math.round((sum / n) * 100) : null;
  };
  S.hardestWords = function (limit, week) {
    var cards = S.state.cards;
    return Object.keys(cards).filter(function (k) {
      var w = S.wordByKey(k);
      return w && cards[k].misses > 0 && (!week || w.week === week);
    }).sort(function (a, b) { return cards[b].misses - cards[a].misses; })
      .slice(0, limit || 3).map(function (k) { return S.wordByKey(k); });
  };
})();
