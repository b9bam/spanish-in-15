/* Spanish in 15: text to speech (speechSynthesis) and optional speech recognition. */
(function () {
  "use strict";
  var S = window.S15;
  var synth = window.speechSynthesis;
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;

  var Speech = (S.speech = {
    supported: !!(synth && window.SpeechSynthesisUtterance),
    canListen: !!SR,
    voices: [],
    _token: 0
  });

  function rank(v) {
    var lang = (v.lang || "").replace("_", "-").toLowerCase();
    if (lang === "es-mx") return 0;
    if (lang === "es-us") return 1;
    if (lang === "es-419") return 2;
    if (lang.indexOf("es-") === 0 && lang !== "es-es") return 3;
    if (lang === "es-es") return 4;
    if (lang === "es") return 5;
    return 99;
  }

  Speech.loadVoices = function () {
    if (!Speech.supported) return [];
    var all = synth.getVoices() || [];
    Speech.voices = all.filter(function (v) { return rank(v) < 99; })
      .sort(function (a, b) { return rank(a) - rank(b) || (b.localService ? 1 : 0) - (a.localService ? 1 : 0); });
    return Speech.voices;
  };

  Speech.pickVoice = function () {
    var pref = S.state && S.state.settings.voice;
    if (pref) {
      for (var i = 0; i < Speech.voices.length; i++) if (Speech.voices[i].voiceURI === pref) return Speech.voices[i];
    }
    return Speech.voices[0] || null;
  };

  if (Speech.supported) {
    Speech.loadVoices();
    if (typeof synth.addEventListener === "function") {
      synth.addEventListener("voiceschanged", function () {
        Speech.loadVoices();
        if (S.onVoicesChanged) S.onVoicesChanged();
      });
    }
  }

  /* Clean text before speaking: blanks become a short pause. */
  function prep(text) {
    return String(text).replace(/_+/g, ", ").replace(/\s*\/\s*/g, ", ").replace(/\.\.\./g, "").trim();
  }

  /* Speak Spanish text. Resolves when done (or after a safety timeout). */
  Speech.speak = function (text, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      if (!Speech.supported) { resolve(false); return; }
      try { synth.cancel(); } catch (e) { /* ignore */ }
      var token = ++Speech._token;
      var u = new SpeechSynthesisUtterance(prep(text));
      var v = Speech.pickVoice();
      if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = "es-MX"; }
      u.rate = opts.rate || (S.state ? S.state.settings.rate : 0.85);
      u.pitch = 1;
      var done = false;
      function finish(ok) { if (done) return; done = true; clearTimeout(timer); resolve(ok && token === Speech._token); }
      u.onend = function () { finish(true); };
      u.onerror = function () { finish(false); };
      var timer = setTimeout(function () { finish(true); }, 1500 + String(text).length * 140);
      synth.speak(u);
    });
  };
  Speech.stop = function () {
    Speech._token++;
    if (Speech.supported) { try { synth.cancel(); } catch (e) { /* ignore */ } }
  };
  Speech.wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  /* Listen once in Spanish. Resolves with a list of heard alternatives. */
  Speech.listen = function () {
    return new Promise(function (resolve, reject) {
      if (!SR) { reject(new Error("unsupported")); return; }
      var rec;
      try { rec = new SR(); } catch (e) { reject(e); return; }
      rec.lang = "es-MX";
      rec.interimResults = false;
      rec.maxAlternatives = 5;
      rec.continuous = false;
      var got = false;
      rec.onresult = function (ev) {
        got = true;
        var alts = [];
        var res = ev.results[0];
        for (var i = 0; i < res.length; i++) alts.push(res[i].transcript);
        resolve(alts);
      };
      rec.onerror = function (ev) { if (!got) reject(new Error(ev.error || "error")); };
      rec.onend = function () { if (!got) reject(new Error("no-speech")); };
      try { rec.start(); } catch (e) { reject(e); }
    });
  };

  /* Loose check of a spoken attempt against the target phrase. */
  Speech.judge = function (alts, target) {
    var best = 0, heard = alts[0] || "";
    var t = S.noAccents(S.clean(target));
    alts.forEach(function (a) {
      var score = S.similarity(a, target);
      var c = S.noAccents(S.clean(a));
      if (t && c.indexOf(t) >= 0) score = Math.max(score, 0.95);
      if (score > best) { best = score; heard = a; }
    });
    return { score: best, heard: heard, ok: best >= 0.6 };
  };
})();
