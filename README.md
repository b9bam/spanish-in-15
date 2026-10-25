# Spanish in 15

Free, private, 15-minute daily lessons in Latin American Spanish for total beginners.

It is a plain static website: HTML, CSS and vanilla JavaScript. No build step, no backend, no accounts, no trackers. Progress is saved only in the browser (localStorage). It works on GitHub Pages and when `index.html` is opened straight from disk (file://).

## What is inside

- **Learn**: a winding path of round lesson nodes across the whole year (52 weeks, 364 days), grouped by level (A1, A2, B1) and unit. Done nodes show a check, the next one says START, later ones are locked, and weeks not written yet show as Coming soon. Tap a node for a card with Start, Practice again and Study notes. A daily goal card with the mascot sits at the top.
- **Lesson sessions**: bite-sized, one exercise per screen, with a progress bar, a Check button and a feedback sheet that slides up (correct, or the right answer). Missed items come back at the end. Exercise types:
  - new word cards (teach), pick the picture (emoji cards), choose the translation (both directions)
  - word tiles: build the English or the Spanish sentence from a bank of tiles
  - listen and tap the words you hear, type what you hear, type the translation (accent keys, accent tolerant)
  - fill the blank, match pairs, and speak (only when the browser supports speech recognition)
  - "Can't listen now" and "Can't speak now" skip those types for the rest of a session.
- **Game layer**: 5 hearts (lose one per mistake in a lesson, one comes back every 4 hours, refill for gems), XP with a combo bonus, a daily XP goal (10, 20, 30 or 50), a streak with a flame and a calendar, streak freezes, gems, a lesson complete screen with confetti, and 18 achievements.
- **Practice hub**: weak words session (never costs hearts and earns one back), 60 second timed match, flashcards with spaced repetition, and the quiz builder.
- **Study notes**: the original 15-minute lesson player (warm-up, words, grammar, listen and repeat, quiz) is still there for every day.
- **Profile**: XP, streaks, daily goal, streak calendar, the gem shop, sound and vibration toggles, voice settings, history, export, import and reset.
- **Sound**: short original tones made with WebAudio (no audio files). Mute from any session or the profile. Vibration on supported phones.
- **Install**: a web app manifest and icons, so it can be added to the home screen. The offline cache runs on http or https.

The mascot is Coli, an original burgundy hummingbird drawn in inline SVG.

## How exercises are made

Sessions are generated at runtime from lesson fields, so every week file works without extra work:

- `words[].es` and `words[].en` are required. Everything else is optional and only adds exercise types.
- `words[].example` adds sentence tiles, listen and tap, and fill the blank.
- `words[].emoji` sets the picture card. Without it a built-in keyword list is tried, and the word is skipped for pictures if nothing fits.
- `lesson.practice` (tiles, hear, fill, speak items) and `lesson.quiz` items are mixed in as curated exercises.
- Review days use the week's words, weakest first.
- Anything missing is skipped quietly.

## Files

```
index.html            App shell (header, tab bar, script tags)
manifest.webmanifest  Web app manifest (added to the page only on http or https)
icons/                App icons (SVG and PNG)
sw.js                 Offline cache (only on http or https, for example GitHub Pages)
.nojekyll             Tells GitHub Pages to serve files as they are
css/style.css         All styles (light and dark themes, burgundy #8E2443 accent)
data/year_outline.js  The year: levels, units, 52 weeks and 364 days (window.YEAR_OUTLINE)
data/course.js        Fallback 4-week outline, used only if year_outline.js is missing
data/lessons.js       Full content for Weeks 1 and 2 (Days 1 to 14) and the shared video list
data/weeks/weekNN.js  Full content for Weeks 3 to 52, one file per week, loaded on demand
data/WEEK_FILE_FORMAT.md  The exact format for week files and the year outline
js/core.js            Helpers, storage, streaks and spaced repetition
js/game.js            Hearts, XP, goal, gems, freezes, achievements, unlocking, sound effects
js/fx.js              Mascot SVG and confetti
js/exercises.js       Builds exercise sessions from lesson data
js/session.js         The one exercise per screen session player and complete screen
js/v2.js              Learn path, practice hub, timed match, awards, profile
js/speech.js          Text to speech and optional speech recognition
js/quiz.js            Quiz engine (study notes and quiz builder)
js/app.js             Study notes views and the hash router
```

Routes: `#/` Learn, `#/path` year map, `#/week/N`, `#/lesson/N` study notes, `#/practice`, `#/cards`, `#/timed`, `#/quiz`, `#/awards`, `#/profile`.

### Saved progress

Progress is stored in localStorage under `spanish15.progress.v1` (the key name stays the same). The data is now `version: 2` with a `game` block (xp, xpByDay, goal, hearts, gems, freezes, achievements, sound, vibrate). Version 1 data is upgraded on load: each completed day is credited 10 XP on the date it was done, and streaks and cards are kept. Imported files go through the same upgrade.

Data lives in `.js` files (not JSON fetched at runtime) so the site also works from file://.

## How the year is loaded

- `index.html` loads `data/course.js`, `data/year_outline.js` and `data/lessons.js` up front.
- A week file is loaded only when it is needed: when you open a day in that week, or at startup for weeks you already have flashcards or scores in, plus the current week. The app adds a `<script src="data/weeks/weekNN.js">` tag, which works from file:// and through the service worker cache.
- A week is playable when the outline marks it `status: "ready"` and its file loads. If the file is missing, its days show as Coming soon.

## Spaced repetition rules

Intervals: 1, 3, 7, 14, 30 days.

- When you finish a lesson, its words become cards. Each new card is first due the next day (the 1-day step).
- **Good**: move up one step (1 to 3, 3 to 7, and so on).
- **Easy**: move up two steps.
- **Again**: back to the 1-day step, marked missed. The card also comes back once more at the end of the session.
- After the 30-day step, a correct card stays at 30 days and counts as **known**.
- The lesson warm-up shows at most 8 due cards: missed cards first, then the oldest due.
- A card missed 3 times in a row shows its memory hook on the back.
- Review days show the week's quiz average. Under 70 percent suggests slowing down and repeating the weakest lesson.

## How to add lessons (Week 3 and up)

Full details: `data/WEEK_FILE_FORMAT.md`. Short version:

1. Create `data/weeks/weekNN.js` (two-digit week number, for example `week05.js`) holding exactly 7 lesson objects. Week N covers days `(N-1)*7+1` to `N*7`; the 7th day is a review day.
2. The file only registers data:

   ```js
   (window.S15_WEEKS = window.S15_WEEKS || {})[5] = {
     week: 5,
     title: "Week title",
     videos: { "w05-key": { id: "YouTubeId", title: "...", channel: "...", duration: "8:12", why: "..." } },
     lessons: [ /* 7 lesson objects, days 29 to 35, schema below */ ]
   };
   ```
3. In `data/year_outline.js`, set that week's `status` to `"ready"`. Its nodes unlock on the path.
4. Open `index.html` and click through every day of the week.

Weeks 1 and 2 (Days 1 to 14) are in `data/lessons.js` instead of week files. To fix one of those, edit the matching entry there.

### Lesson schema

```js
{
  id: 29,                      // global day number, 1 to 364
  week: 5,                     // 1 to 52
  type: "lesson",              // "lesson" or "review"
  title: "Understanding and being understood",
  goal: "One sentence: what you can do after this lesson.",
  warmup: "Text shown in the warm-up when no cards are due.",

  // lesson days: about 8 to 10 words
  words: [
    {
      id: "l29-no-entiendo",    // REQUIRED and permanent: saved progress uses it. Format: l<day>-<slug>
      es: "no entiendo",        // Spanish with correct accents and ¿ ¡ marks
      en: "I don't understand",
      say: "noh ehn-tee-EHN-doh", // simple sound-it-out hint, stressed syllable in CAPITALS
      note: "Optional short tip.",
      speak: "Optional text to speak instead of es (use when es has a blank like ___)",
      accept: ["optional", "extra typed answers"],
      example: { es: "Perdón, no entiendo.", en: "Sorry, I don't understand." },
      hook: "Memory hook shown after 3 misses in a row."
    }
  ],

  grammar: {
    title: "Put no before the verb",
    body: ["Two or three short sentences.", "Second paragraph optional."],
    examples: [{ es: "No entiendo.", en: "I don't understand." }]
  },

  dialogue: {
    title: "Short scene title",
    lines: [
      { who: "Mesero", es: "¿Qué va a querer?", en: "What will you have?" },
      { who: "Tú", es: "Más despacio, por favor.", en: "Slower, please." }  // who "Tú" = the learner's lines
    ]
  },

  // 5 or 6 questions; mix the four types
  quiz: [
    { type: "mc", prompt: "Real-life situation?", choices: ["A", "B", "C", "D"], answer: "A", explain: "Why." },
    { type: "type", prompt: "Type the Spanish for ...", answer: "no entiendo", accept: [], explain: "Why." },
    { type: "listen", prompt: "Listen and choose what you hear.", say: "otra vez", choices: ["otra vez", "más despacio", "sí", "no"], answer: "otra vez" },
    { type: "match", prompt: "Match each phrase.", pairs: [["sí", "yes"], ["no", "no"], ["otra vez", "again"], ["más despacio", "slower"]] }
  ],

  video: "phrases"             // optional: a key from window.VIDEOS in lessons.js or from the week file's videos
}
```

Review days (`type: "review"`) have no `words` or `grammar`. They use `goal`, `warmup`, `canDo` (a list of "You can now" lines), `dialogue` (the role play), `quiz` and optional `video`.

### Content rules

- Latin American Spanish: usted for strangers and elders, ustedes for you all (no vosotros), Mexican word choices where they differ.
- Beginner level, real-life situations, about 8 to 10 new words per lesson day.
- Double check every accent, ñ, and the opening ¿ and ¡ marks.
- Quiz `answer` must exactly match one of the `choices`.
- Visible text style: no em dashes, no en dashes, and no ampersands.
- Keep it public-safe: no personal names of real people, no emails, no personal details. Fictional names in dialogues are fine.

## Privacy

Everything stays in the browser. The only outside connection is optional: a lesson's bonus video loads the YouTube player (youtube-nocookie.com) only after you press "Load video here".

## Publish on GitHub Pages

The service worker caches pages for offline use. After changing files, bump `CACHE` in `sw.js` so visitors get the update right away.

Put the contents of this folder at the root of a repository, then in Settings, Pages, choose "Deploy from a branch" with the main branch and the root folder.
