/* Spanish in 15: game layer. XP, combo, hearts, gems, streak freeze, daily goal, achievements,
   sound effects (WebAudio, original tones) and vibration. Progress v1 is migrated to v2 here. */
(function () {
  "use strict";
  var S = window.S15;

  var MAX_HEARTS = 5;
  var HEART_MS = 4 * 60 * 60 * 1000;   /* one heart back every 4 hours */
  var COST = { refill: 50, freeze: 100 };
  var MAX_FREEZES = 2;
  S.GAME = { MAX_HEARTS: MAX_HEARTS, HEART_MS: HEART_MS, COST: COST, MAX_FREEZES: MAX_FREEZES };

  function gameDefaults() {
    return {
      xp: 0, xpByDay: {}, goal: 20, goalDays: {},
      hearts: MAX_HEARTS, heartsAt: Date.now(),
      gems: 50, freezes: 0, frozen: {},
      bestCombo: 0, perfect: 0, sessions: 0, practiceSessions: 0, timedBest: 0, bestStreak: 0,
      achievements: {},
      sound: true, vibrate: true
    };
  }
  function num(n, d) { n = Number(n); return isFinite(n) ? n : d; }
  function isDate(s) { return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s); }
  function dateMap(m, numeric) {
    var out = {};
    if (m && typeof m === "object") Object.keys(m).forEach(function (k) { if (isDate(k)) out[k] = numeric ? Math.max(0, Math.round(num(m[k], 0))) : 1; });
    return out;
  }

  /* Wrap core defaults and sanitize so every state has a game block. */
  var baseDefaults = S.defaults;
  S.defaults = function () { var st = baseDefaults(); st.version = 2; st.game = gameDefaults(); return st; };
  var baseSanitize = S.sanitize;
  S.sanitize = function (raw) {
    var st = baseSanitize(raw);
    if (!st) return null;
    st.version = 2;
    var g = gameDefaults(), r = raw.game;
    if (r && typeof r === "object") {
      g.xp = Math.max(0, Math.round(num(r.xp, 0)));
      g.xpByDay = dateMap(r.xpByDay, true);
      g.goal = [10, 20, 30, 50].indexOf(num(r.goal, 20)) >= 0 ? num(r.goal, 20) : 20;
      g.goalDays = dateMap(r.goalDays);
      g.hearts = Math.min(MAX_HEARTS, Math.max(0, Math.round(num(r.hearts, MAX_HEARTS))));
      g.heartsAt = Math.min(Date.now(), Math.max(0, num(r.heartsAt, Date.now())));
      g.gems = Math.max(0, Math.round(num(r.gems, 50)));
      g.freezes = Math.min(MAX_FREEZES, Math.max(0, Math.round(num(r.freezes, 0))));
      g.frozen = dateMap(r.frozen);
      ["bestCombo", "perfect", "sessions", "practiceSessions", "timedBest", "bestStreak"].forEach(function (k) { g[k] = Math.max(0, Math.round(num(r[k], 0))); });
      if (r.achievements && typeof r.achievements === "object") {
        Object.keys(r.achievements).forEach(function (k) { if (/^[a-z0-9-]+$/.test(k) && isDate(r.achievements[k])) g.achievements[k] = r.achievements[k]; });
      }
      g.sound = r.sound !== false;
      g.vibrate = r.vibrate !== false;
    } else {
      /* Migration from v1: 10 XP for every finished day, credited on the day it was finished. */
      Object.keys(st.completed).forEach(function (id) {
        var c = st.completed[id];
        g.xp += 10;
        g.xpByDay[c.date] = (g.xpByDay[c.date] || 0) + 10;
        if (c.total && c.score === c.total) g.perfect++;
        g.sessions++;
      });
      g.bestStreak = st.streak.count;
      st.migratedFrom = 1;
    }
    st.game = g;
    return st;
  };

  /* ---------- hearts ---------- */
  S.hearts = function () {
    var g = S.state.game, now = Date.now();
    if (g.hearts >= MAX_HEARTS) { g.heartsAt = now; return MAX_HEARTS; }
    var n = Math.floor((now - g.heartsAt) / HEART_MS);
    if (n > 0) {
      g.hearts = Math.min(MAX_HEARTS, g.hearts + n);
      g.heartsAt = g.hearts >= MAX_HEARTS ? now : g.heartsAt + n * HEART_MS;
      S.save();
    }
    return g.hearts;
  };
  S.nextHeartIn = function () {
    var g = S.state.game;
    if (S.hearts() >= MAX_HEARTS) return 0;
    return Math.max(0, HEART_MS - (Date.now() - g.heartsAt));
  };
  S.loseHeart = function () {
    var g = S.state.game;
    S.hearts();
    if (g.hearts >= MAX_HEARTS) g.heartsAt = Date.now();
    g.hearts = Math.max(0, g.hearts - 1);
    S.save();
    return g.hearts;
  };
  S.gainHeart = function (n) {
    var g = S.state.game;
    S.hearts();
    g.hearts = Math.min(MAX_HEARTS, g.hearts + (n || 1));
    if (g.hearts >= MAX_HEARTS) g.heartsAt = Date.now();
    S.save();
  };
  S.buyRefill = function () {
    var g = S.state.game;
    if (S.hearts() >= MAX_HEARTS) return "full";
    if (g.gems < COST.refill) return "gems";
    g.gems -= COST.refill; g.hearts = MAX_HEARTS; g.heartsAt = Date.now(); S.save();
    return "ok";
  };
  S.buyFreeze = function () {
    var g = S.state.game;
    if (g.freezes >= MAX_FREEZES) return "max";
    if (g.gems < COST.freeze) return "gems";
    g.gems -= COST.freeze; g.freezes++; S.save();
    return "ok";
  };

  /* ---------- XP and daily goal ---------- */
  S.xpToday = function () { return S.state.game.xpByDay[S.today()] || 0; };
  /* Adds XP. Returns true when this call completed today's goal. */
  S.addXp = function (n) {
    var g = S.state.game, t = S.today(), before = g.xpByDay[t] || 0;
    g.xp += n; g.xpByDay[t] = before + n;
    var hit = before < g.goal && g.xpByDay[t] >= g.goal && !g.goalDays[t];
    if (hit) { g.goalDays[t] = 1; g.gems += 10; }
    S.save();
    return hit;
  };

  /* ---------- streak with freeze ---------- */
  /* Called at startup: spend freezes to cover missed days, or break the streak. */
  S.checkStreak = function () {
    var st = S.state, g = st.game, t = S.today(), last = st.streak.last;
    if (!last || st.streak.count === 0) return null;
    var yest = S.addDays(t, -1);
    if (last >= yest) return null;
    var gap = S.daysBetween(last, t) - 1;
    if (gap <= g.freezes) {
      for (var i = 1; i <= gap; i++) g.frozen[S.addDays(last, i)] = 1;
      g.freezes -= gap;
      st.streak.last = yest;
      S.save();
      return { frozen: gap };
    }
    st.streak.count = 0;
    S.save();
    return { broken: true };
  };
  var baseMark = S.markActivity;
  S.markActivity = function () {
    var before = S.currentStreak(), firstToday = S.state.streak.last !== S.today();
    baseMark();
    var g = S.state.game;
    g.bestStreak = Math.max(g.bestStreak, S.state.streak.count);
    S.save();
    return { extended: firstToday, before: before, now: S.currentStreak() };
  };

  /* ---------- achievements ---------- */
  function wordsLearned() { return Object.keys(S.state.cards).length; }
  function unitDone(n) {
    var u = (S.outline().units || []).filter(function (x) { return x.id === n; })[0];
    if (!u) return false;
    return u.weeks.every(function (w) {
      for (var d = (w - 1) * 7 + 1; d <= w * 7; d++) if (!S.state.completed[d]) return false;
      return true;
    });
  }
  S.ACHIEVEMENTS = [
    { id: "first-steps", icon: "🌱", name: "First steps", desc: "Finish your first lesson.", test: function (g) { return g.sessions >= 1; } },
    { id: "streak-3", icon: "🔥", name: "Warming up", desc: "Reach a 3 day streak.", test: function (g) { return g.bestStreak >= 3; } },
    { id: "streak-7", icon: "📅", name: "Full week", desc: "Reach a 7 day streak.", test: function (g) { return g.bestStreak >= 7; } },
    { id: "streak-30", icon: "🏅", name: "Habit formed", desc: "Reach a 30 day streak.", test: function (g) { return g.bestStreak >= 30; } },
    { id: "perfect", icon: "💯", name: "Flawless", desc: "Finish a lesson with no mistakes.", test: function (g) { return g.perfect >= 1; } },
    { id: "perfect-10", icon: "🎯", name: "Sharp shooter", desc: "Finish 10 lessons with no mistakes.", test: function (g) { return g.perfect >= 10; } },
    { id: "combo-10", icon: "⚡", name: "On a roll", desc: "Get 10 answers right in a row.", test: function (g) { return g.bestCombo >= 10; } },
    { id: "words-25", icon: "📗", name: "Word collector", desc: "Learn 25 words.", test: function () { return wordsLearned() >= 25; } },
    { id: "words-100", icon: "📚", name: "Bookworm", desc: "Learn 100 words.", test: function () { return wordsLearned() >= 100; } },
    { id: "words-500", icon: "🏛️", name: "Living dictionary", desc: "Learn 500 words.", test: function () { return wordsLearned() >= 500; } },
    { id: "xp-100", icon: "⭐", name: "100 XP", desc: "Earn 100 XP.", test: function (g) { return g.xp >= 100; } },
    { id: "xp-1000", icon: "🌟", name: "1000 XP", desc: "Earn 1000 XP.", test: function (g) { return g.xp >= 1000; } },
    { id: "goal-7", icon: "🎉", name: "Goal getter", desc: "Hit your daily goal on 7 days.", test: function (g) { return Object.keys(g.goalDays).length >= 7; } },
    { id: "review-1", icon: "🏆", name: "Week one done", desc: "Finish a weekly review day.", test: function () { return Object.keys(S.state.completed).some(function (k) { return +k % 7 === 0; }); } },
    { id: "unit-1", icon: "🗺️", name: "Survivor", desc: "Finish Unit 1.", test: function () { return unitDone(1); } },
    { id: "practice-5", icon: "💪", name: "Extra mile", desc: "Finish 5 practice sessions.", test: function (g) { return g.practiceSessions >= 5; } },
    { id: "timed-15", icon: "⏱️", name: "Speed matcher", desc: "Match 15 pairs in one timed round.", test: function (g) { return g.timedBest >= 15; } },
    { id: "freeze", icon: "❄️", name: "Safety net", desc: "Own a streak freeze.", test: function (g) { return g.freezes >= 1 || Object.keys(g.frozen).length > 0; } }
  ];
  /* Check all achievements. Returns the newly earned ones (each gives 10 gems). */
  S.checkAchievements = function () {
    var g = S.state.game, out = [];
    S.ACHIEVEMENTS.forEach(function (a) {
      if (!g.achievements[a.id] && a.test(g)) { g.achievements[a.id] = S.today(); g.gems += 10; out.push(a); }
    });
    if (out.length) S.save();
    return out;
  };

  /* ---------- unlocking: lessons open one after another ---------- */
  S.isUnlocked = function (id) {
    if (S.state.completed[id]) return true;
    if (!S.weekReady(S.weekOfDay(id))) return false;
    return id === 1 || !!S.state.completed[id - 1];
  };

  /* ---------- sound effects (original, synthesized) ---------- */
  var ctx = null;
  function ac() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try { ctx = new AC(); } catch (e) { return null; }
    }
    if (ctx.state === "suspended" && ctx.resume) ctx.resume();
    return ctx;
  }
  function tone(freq, start, dur, type, vol, slideTo) {
    var c = ac(); if (!c) return;
    var t0 = c.currentTime + start;
    var o = c.createOscillator(), gn = c.createGain();
    o.type = type || "sine";
    o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    gn.gain.setValueAtTime(0.0001, t0);
    gn.gain.exponentialRampToValueAtTime(vol || 0.18, t0 + 0.015);
    gn.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(gn); gn.connect(c.destination);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }
  var SOUNDS = {
    tap: function () { tone(660, 0, 0.06, "triangle", 0.08); },
    correct: function () { tone(587.33, 0, 0.12, "sine", 0.16); tone(880, 0.09, 0.22, "sine", 0.16); },
    wrong: function () { tone(220, 0, 0.18, "triangle", 0.16, 160); tone(185, 0.12, 0.22, "triangle", 0.12, 140); },
    combo: function () { tone(784, 0, 0.08, "square", 0.06); tone(988, 0.07, 0.08, "square", 0.06); tone(1175, 0.14, 0.14, "square", 0.06); },
    complete: function () { [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { tone(f, i * 0.11, 0.3, "triangle", 0.14); }); tone(1318.5, 0.5, 0.5, "sine", 0.1); },
    unlock: function () { tone(440, 0, 0.1, "sine", 0.12, 660); tone(880, 0.1, 0.2, "sine", 0.1); }
  };
  S.sfx = function (name) {
    if (!S.state || !S.state.game.sound) return;
    try { if (SOUNDS[name]) SOUNDS[name](); } catch (e) { /* audio is optional */ }
  };
  S.buzz = function (pattern) {
    if (!S.state || !S.state.game.vibrate || !navigator.vibrate) return;
    try { navigator.vibrate(pattern); } catch (e) { /* optional */ }
  };
})();
