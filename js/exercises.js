/* Spanish in 15: builds bite-sized exercise sessions from lesson data.
   Works for any lesson that follows data/WEEK_FILE_FORMAT.md and degrades when fields are missing:
   words (es, en) are enough; example, emoji, practice and quiz add more exercise types. */
(function () {
  "use strict";
  var S = window.S15;
  var Ex = (S.Ex = {});

  /* ---------- picture lookup: optional word.emoji, else a small keyword list, else digits ---------- */
  var EMOJI = {
    "hello": "👋", "goodbye": "👋", "good morning": "🌅", "good afternoon": "🌤️", "good evening": "🌙", "good night": "🌙",
    "thank you": "🙏", "thanks": "🙏", "please": "🙏", "sorry": "😔", "yes": "✅", "no": "❌",
    "water": "💧", "soda": "🥤", "taco": "🌮", "tacos": "🌮", "sandwich": "🥪", "torta": "🥪", "check": "🧾", "bill": "🧾", "receipt": "🧾",
    "onion": "🧅", "lime": "🍋", "lemon": "🍋", "salsa": "🌶️", "sauce": "🌶️", "tortillas": "🫓", "cilantro": "🌿", "coffee": "☕", "beer": "🍺",
    "food": "🍽️", "breakfast": "🍳", "lunch": "🥗", "dinner": "🍲", "bread": "🍞", "egg": "🥚", "eggs": "🥚", "chicken": "🍗", "beef": "🥩", "meat": "🥩", "fish": "🐟",
    "fruit": "🍎", "apple": "🍎", "banana": "🍌", "mango": "🥭", "avocado": "🥑", "avocados": "🥑", "milk": "🥛", "juice": "🧃", "rice": "🍚", "beans": "🫘", "cheese": "🧀",
    "bathroom": "🚻", "restroom": "🚻", "hotel": "🏨", "street": "🛣️", "corner": "📐", "block": "🏙️", "right": "➡️", "left": "⬅️", "straight ahead": "⬆️",
    "bank": "🏦", "pharmacy": "💊", "supermarket": "🛒", "market": "🧺", "gas station": "⛽", "atm": "🏧", "store": "🏪", "shop": "🏪", "restaurant": "🍴",
    "near": "📍", "here": "📍", "far": "🗺️", "there": "👉",
    "monday": "📅", "tuesday": "📅", "wednesday": "📅", "thursday": "📅", "friday": "🎉", "saturday": "📅", "sunday": "☀️", "today": "📆", "tomorrow": "🌄",
    "what time is it": "🕐", "time": "🕐", "hour": "🕐", "morning": "🌅", "afternoon": "🌤️", "night": "🌙",
    "family": "👪", "father": "👨", "dad": "👨", "mother": "👩", "mom": "👩", "brother": "👦", "sister": "👧", "son": "👦", "daughter": "👧", "wife": "👩", "husband": "👨", "baby": "👶", "friend": "🤝",
    "tired": "😴", "busy": "📋", "happy": "😊", "sad": "😢", "sick": "🤒", "hungry": "🍽️", "fine": "👍", "bad": "👎", "good": "👍",
    "baseball": "⚾", "soccer": "⚽", "music": "🎵", "movie": "🎬", "book": "📖", "dog": "🐶", "cat": "🐱",
    "tall": "🦒", "short": "🐭", "big": "🐘", "small": "🐭", "young": "🧒", "old": "👴", "nice": "😊",
    "hot": "🥵", "cold": "🥶", "sunny": "☀️", "sun": "☀️", "rain": "🌧️", "it rains": "🌧️", "it's raining": "🌧️", "wind": "💨", "snow": "❄️", "nice weather": "🌤️",
    "expensive": "💰", "cheap": "🏷️", "red": "🔴", "blue": "🔵", "black": "⚫", "white": "⚪", "green": "🟢", "yellow": "🟡", "orange": "🟠", "brown": "🟤",
    "shirt": "👕", "pants": "👖", "shoes": "👟", "dress": "👗", "hat": "🧢", "size": "📏",
    "cash": "💵", "card": "💳", "credit card": "💳", "change": "🪙", "money": "💵", "pesos": "💵", "dollars": "💵",
    "airport": "✈️", "plane": "✈️", "ticket": "🎫", "bus": "🚌", "taxi": "🚕", "car": "🚗", "train": "🚆", "passport": "🛂", "exit": "🚪", "departure": "🛫", "arrival": "🛬", "suitcase": "🧳",
    "room": "🛏️", "key": "🔑", "reservation": "📋", "night stay": "🌙",
    "help": "🆘", "doctor": "🩺", "police": "🚓", "hospital": "🏥", "lost": "🧭", "phone": "📱", "house": "🏠", "home": "🏠", "work": "💼", "school": "🏫", "beach": "🏖️", "city": "🏙️"
  };
  var NUMBERS = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90, "one hundred": 100, "a hundred": 100 };

  function baseEn(en) {
    return String(en || "").toLowerCase().replace(/\([^)]*\)/g, "").split("/")[0]
      .replace(/[?!.,¿¡]/g, "").replace(/^(the|a|an|to) /, "").replace(/\s+/g, " ").trim();
  }
  Ex.picture = function (w) {
    if (w.emoji) return { emoji: w.emoji };
    var e = baseEn(w.en);
    if (NUMBERS.hasOwnProperty(e)) return { text: String(NUMBERS[e]) };
    if (EMOJI[e]) return { emoji: EMOJI[e] };
    var parts = e.split(" ");
    for (var i = parts.length - 1; i >= 0; i--) if (EMOJI[parts[i]] && parts[i].length > 2) return { emoji: EMOJI[parts[i]] };
    return null;
  };

  /* ---------- text helpers ---------- */
  Ex.tokens = function (s) {
    return String(s || "").replace(/\([^)]*\)/g, " ").replace(/[¿?¡!.,;:"“”…]/g, " ").split(/\s+/).filter(Boolean);
  };
  Ex.norm = function (s) { return Ex.tokens(s).join(" ").toLowerCase(); };
  function hasBlank(s) { return /_{2,}|\.\.\./.test(s || ""); }
  function spoken(w) { return w.speak || w.es; }
  function cleanEs(w) { return String(w.es || "").replace(/_+/g, "").replace(/\.\.\./g, "").replace(/\s+([?,])/g, "$1").trim(); }
  function uid() { return Math.random().toString(36).slice(2, 10); }

  function others(pool, w, field, n, prefer) {
    var seen = {}; seen[Ex.norm(w[field])] = 1;
    var same = S.shuffle(pool.filter(function (x) { return x.lesson === w.lesson; }));
    var near = same.concat(prefer ? S.shuffle(pool.filter(function (x) { return x.lesson !== w.lesson && x.week === w.week; })) : []);
    var far = S.shuffle(pool.filter(function (x) { return x.lesson !== w.lesson && !(prefer && x.week === w.week); }));
    var out = [];
    near.concat(far).forEach(function (x) {
      var k = Ex.norm(x[field]);
      if (out.length < n && k && !seen[k] && !hasBlank(x[field])) { seen[k] = 1; out.push(x); }
    });
    return out;
  }

  /* ---------- single exercise builders (return null when data is missing) ---------- */
  var B = {};
  B.teach = function (w) { return { kind: "teach", w: w, key: w.key, graded: false }; };

  B.picture = function (w, pool) {
    var pic = Ex.picture(w); if (!pic) return null;
    var key = function (p) { return p.emoji || p.text; }, mine = key(pic), seenPic = {};
    seenPic[mine] = 1;
    var opts = others(pool.filter(function (x) {
      var p = Ex.picture(x); if (!p || seenPic[key(p)]) return false;
      seenPic[key(p)] = 1; return true;
    }), w, "es", 2, true);
    if (opts.length < 2) return null;
    var options = S.shuffle([w].concat(opts)).map(function (x) { return { es: cleanEs(x), say: spoken(x), pic: Ex.picture(x) }; });
    return { kind: "picture", key: w.key, prompt: "Which one is “" + w.en + "”?", options: options, answer: cleanEs(w) };
  };

  B.chooseEsEn = function (w, pool) {
    var opts = others(pool, w, "en", 3, true); if (opts.length < 2) return null;
    return { kind: "choose", key: w.key, prompt: "What does this mean?", show: cleanEs(w), showLang: "es", say: spoken(w),
      options: S.shuffle([w.en].concat(opts.map(function (x) { return x.en; }))), optLang: "en", answer: w.en };
  };
  B.chooseEnEs = function (w, pool) {
    var opts = others(pool, w, "es", 3, true); if (opts.length < 2) return null;
    return { kind: "choose", key: w.key, prompt: "Select the correct translation", show: w.en, showLang: "en",
      options: S.shuffle([cleanEs(w)].concat(opts.map(cleanEs))), optLang: "es", answer: cleanEs(w), sayAnswer: true };
  };

  function bankFor(answerTokens, lang, pool, n) {
    var have = {}; answerTokens.forEach(function (t) { have[t.toLowerCase()] = 1; });
    var extra = [];
    S.shuffle(pool).forEach(function (x) {
      var src = x.example ? x.example[lang] : (lang === "es" ? x.es : x.en);
      Ex.tokens(src).forEach(function (t) {
        if (extra.length < n && !have[t.toLowerCase()] && t.length > 1) { have[t.toLowerCase()] = 1; extra.push(t); }
      });
    });
    return S.shuffle(answerTokens.concat(extra));
  }
  function okSentence(s) { var n = Ex.tokens(s).length; return s && !hasBlank(s) && n >= 2 && n <= 9; }

  B.tilesEsEn = function (w, pool) {
    var ex = w.example; if (!ex || !okSentence(ex.es) || !okSentence(ex.en)) return null;
    var ans = Ex.tokens(ex.en);
    return { kind: "tiles", key: w.key, dir: "es-en", prompt: "Translate this sentence", show: ex.es, showLang: "es", say: ex.es,
      answer: ex.en, bank: bankFor(ans, "en", pool, 3), bankLang: "en" };
  };
  B.tilesEnEs = function (w, pool) {
    var ex = w.example; if (!ex || !okSentence(ex.es) || !okSentence(ex.en)) return null;
    var ans = Ex.tokens(ex.es);
    return { kind: "tiles", key: w.key, dir: "en-es", prompt: "Write this in Spanish", show: ex.en, showLang: "en",
      answer: ex.es, bank: bankFor(ans, "es", pool, 3), bankLang: "es", sayAnswer: ex.es };
  };
  B.listenTap = function (w, pool) {
    if (!S.speech.supported) return null;
    var text = w.example && okSentence(w.example.es) ? w.example.es : (Ex.tokens(cleanEs(w)).length >= 2 ? cleanEs(w) : null);
    if (!text) return null;
    return { kind: "tiles", key: w.key, dir: "listen", listen: true, prompt: "Tap what you hear", say: text,
      answer: text, bank: bankFor(Ex.tokens(text), "es", pool, 3), bankLang: "es", en: w.example && text === w.example.es ? w.example.en : w.en };
  };
  B.typeHear = function (w) {
    if (!S.speech.supported || hasBlank(w.es)) return null;
    return { kind: "type", key: w.key, listen: true, prompt: "Type what you hear", say: spoken(w), answers: [cleanEs(w)].concat(w.accept || []), en: w.en };
  };
  B.typeTranslate = function (w) {
    if (hasBlank(w.es)) return null;
    return { kind: "type", key: w.key, prompt: "Type this in Spanish", show: w.en, showLang: "en", answers: [cleanEs(w)].concat(w.accept || []), sayAnswer: spoken(w) };
  };
  B.fill = function (w, pool) {
    var ex = w.example; if (!ex || !ex.es || hasBlank(w.es)) return null;
    var target = cleanEs(w).replace(/^[¿¡]/, "").replace(/[?!]$/, "");
    var i = ex.es.toLowerCase().indexOf(target.toLowerCase());
    if (i < 0 || target.length < 2) return null;
    var opts = others(pool.filter(function (x) { return !hasBlank(x.es); }), w, "es", 3, true).map(function (x) { return cleanEs(x).replace(/^[¿¡]/, "").replace(/[?!]$/, ""); });
    if (opts.length < 2) return null;
    var real = ex.es.substr(i, target.length);
    return { kind: "fill", key: w.key, prompt: "Fill in the blank", before: ex.es.slice(0, i), after: ex.es.slice(i + target.length),
      options: S.shuffle([real].concat(opts.map(function (o) { return /^[A-ZÁÉÍÓÚÑ]/.test(real) ? o.charAt(0).toUpperCase() + o.slice(1) : o; }))),
      answer: real, en: ex.en, full: ex.es };
  };
  B.speak = function (w) {
    if (!S.speech.canListen || !S.state.settings.speaking) return null;
    var text = w.example && okSentence(w.example.es) && Ex.tokens(w.example.es).length <= 6 ? w.example.es : spoken(w);
    if (hasBlank(text)) return null;
    return { kind: "speak", key: w.key, prompt: "Speak this sentence", text: text, en: text === spoken(w) ? w.en : (w.example && w.example.en) };
  };
  B.match = function (words) {
    var seenEs = {}, seenEn = {}, pairs = [];
    words.forEach(function (w) {
      var a = Ex.norm(w.es), b = Ex.norm(w.en);
      if (pairs.length < 5 && !seenEs[a] && !seenEn[b] && !hasBlank(w.es)) { seenEs[a] = seenEn[b] = 1; pairs.push([cleanEs(w), w.en, spoken(w)]); }
    });
    return pairs.length >= 3 ? { kind: "match", prompt: "Tap the matching pairs", pairs: pairs } : null;
  };

  /* Curated items from the lesson's optional practice and quiz arrays. */
  function curated(lesson, pool) {
    var out = [];
    (lesson.practice || []).forEach(function (p) {
      try {
        if (p.type === "tiles" && p.answer) {
          var ans = Ex.tokens(p.answer), bank = (p.tiles || []).slice();
          var low = bank.map(function (t) { return t.toLowerCase(); });
          var ok = ans.every(function (t) { return low.indexOf(t.toLowerCase()) >= 0; });
          if (!ok) bank = bankFor(ans, "es", pool, 3);
          out.push({ kind: "tiles", dir: "en-es", prompt: "Write this in Spanish", show: p.en || p.prompt, showLang: "en", answer: p.answer, bank: S.shuffle(bank), bankLang: "es", sayAnswer: p.answer });
        } else if (p.type === "hear" && p.answer && S.speech.supported) {
          out.push({ kind: "type", listen: true, prompt: "Type what you hear", say: p.say || p.answer, answers: [p.answer], en: p.en });
        } else if (p.type === "fill" && p.sentence && p.answer && p.choices && p.choices.length >= 2) {
          var i = p.sentence.toLowerCase().indexOf(String(p.answer).toLowerCase());
          if (i >= 0) {
            var real = p.sentence.substr(i, p.answer.length);
            var cap = /^[A-ZÁÉÍÓÚÑ]/.test(real);
            var opts = p.choices.map(function (c) { return c.toLowerCase() === real.toLowerCase() ? real : (cap ? c.charAt(0).toUpperCase() + c.slice(1) : c); });
            var en = (/\(([^)]+)\)\s*$/.exec(p.prompt || "") || [])[1];
            out.push({ kind: "fill", prompt: "Fill in the blank", before: p.sentence.slice(0, i), after: p.sentence.slice(i + p.answer.length), options: S.shuffle(opts), answer: real, en: en || "", full: p.sentence });
          }
        } else if (p.type === "speak" && p.es && S.speech.canListen && S.state.settings.speaking) {
          out.push({ kind: "speak", prompt: "Speak this sentence", text: p.es, en: p.en });
        }
      } catch (e) { /* skip malformed items */ }
    });
    (lesson.quiz || []).forEach(function (q) {
      if (q.type === "mc" && q.choices && q.choices.indexOf(q.answer) >= 0) {
        out.push({ kind: "choose", prompt: q.prompt, say: q.say, options: S.shuffle(q.choices), optLang: /[áéíóúñ¿¡]/i.test(q.choices.join(" ")) ? "es" : "en", answer: q.answer, explain: q.explain });
      } else if (q.type === "type" && q.answer) {
        out.push({ kind: "type", prompt: q.prompt, answers: [q.answer].concat(q.accept || []), explain: q.explain, sayAnswer: q.answer });
      } else if (q.type === "listen" && q.say && q.choices && S.speech.supported) {
        out.push({ kind: "choose", listen: true, prompt: "Listen and choose what you hear", say: q.say, options: S.shuffle(q.choices), optLang: "es", answer: q.answer });
      }
    });
    return out;
  }

  function pick(list, fns, w, pool) {
    for (var i = 0; i < fns.length; i++) { var it = B[fns[i]](w, pool); if (it) { list.push(it); return true; } }
    return false;
  }
  function stamp(items) { return items.filter(Boolean).map(function (it) { it.uid = uid(); if (it.graded !== false) it.graded = true; return it; }); }

  /* Words a lesson is about. Review days (or lessons without words) use the week's words, weakest first. */
  Ex.wordsFor = function (lesson) {
    if (lesson.words && lesson.words.length) {
      return lesson.words.filter(function (w) { return w && w.es && w.en; }).map(function (w) {
        return Object.assign({ key: S.wordId(lesson, w), lesson: lesson.id, week: lesson.week }, w);
      });
    }
    var cards = S.state.cards;
    var week = S.allWords().filter(function (w) { return w.week === lesson.week; });
    if (week.length < 4) week = S.allWords().filter(function (w) { return w.lesson < lesson.id; });
    return week.sort(function (a, b) {
      var ma = cards[a.key] ? cards[a.key].misses : 0, mb = cards[b.key] ? cards[b.key].misses : 0;
      return mb - ma || Math.random() - 0.5;
    }).slice(0, 12);
  };

  /* Full lesson session. */
  Ex.lessonSession = function (lesson) {
    var words = Ex.wordsFor(lesson).slice(0, 10);
    var pool = S.allWords().filter(function (w) { return w.es && w.en; });
    if (pool.length < 6) pool = pool.concat(words);
    var isReview = lesson.type === "review" || !(lesson.words && lesson.words.length);
    var items = [];
    var rotate = [["picture", "chooseEsEn"], ["chooseEnEs", "chooseEsEn"], ["typeHear", "chooseEsEn"], ["chooseEsEn", "chooseEnEs"]];
    for (var c = 0; c < words.length; c += 3) {
      var chunk = words.slice(c, c + 3);
      if (!isReview) chunk.forEach(function (w) { if (!S.state.cards[w.key]) items.push(B.teach(w)); });
      chunk.forEach(function (w, j) { pick(items, rotate[(c + j) % rotate.length], w, pool); });
    }
    var mixed = [];
    var sw = S.shuffle(words);
    mixed.push(B.match(sw));
    var plan = ["tilesEsEn", "tilesEnEs", "listenTap", "fill", "typeTranslate", "speak", "fill", "tilesEnEs"];
    var used = {};
    plan.forEach(function (fn, i) {
      for (var k = 0; k < sw.length; k++) {
        var w = sw[(i + k) % sw.length];
        if (used[fn + w.key]) continue;
        var it = B[fn](w, pool);
        if (it) { used[fn + w.key] = 1; mixed.push(it); break; }
      }
    });
    if (isReview && words.length >= 8) mixed.push(B.match(sw.slice(5)));
    var cur = S.shuffle(curated(lesson, pool)).slice(0, isReview ? 4 : 2);
    items = items.concat(S.shuffle(mixed.filter(Boolean).concat(cur)));
    return stamp(items);
  };

  /* Practice session from any word list (weak words, mixed review). */
  Ex.practiceSession = function (words) {
    var pool = S.allWords();
    var items = [], rotate = ["chooseEsEn", "typeTranslate", "listenTap", "fill", "chooseEnEs", "tilesEnEs", "picture", "typeHear"];
    words.slice(0, 8).forEach(function (w, i) {
      var order = rotate.slice(i % rotate.length).concat(rotate.slice(0, i % rotate.length));
      pick(items, order.concat(["chooseEsEn"]), w, pool);
    });
    items.push(B.match(S.shuffle(words)));
    return stamp(S.shuffle(items));
  };
  Ex.builders = B;
})();
