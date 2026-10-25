# Week file format (Spanish in 15, full year)

Status: FINAL contract between the app and the content files. The app code is written against exactly this.

## 1. Numbering

- 52 weeks, 7 days each, 364 days. Day ids are global: Week N covers days `(N-1)*7+1` to `N*7`.
- Days 7, 14, 21, ... 364 (every `id % 7 === 0`) are review days (`type: "review"`). The other 6 are lesson days (`type: "lesson"`).
- Weeks 1 and 2 (Days 1 to 14) live in `data/lessons.js` (owned by the app author). Do NOT create `week01.js` or `week02.js`.
- Weeks 3 to 52 live in `data/weeks/week03.js` ... `data/weeks/week52.js` (two-digit week number, zero padded).

## 2. Week file: data/weeks/weekNN.js

Plain JavaScript (not JSON, not a module, no import/export, no fetch). It must only register data, exactly like this:

```js
/* Spanish in 15: Week 5 (Unit 2, A1). */
(window.S15_WEEKS = window.S15_WEEKS || {})[5] = {
  week: 5,                         // same number as the file name
  title: "Food and drink",         // same as the outline's week title
  videos: {                        // optional; keys must be unique across the year, prefix with wNN-
    "w05-market": { id: "YouTubeVideoId", title: "Video title", channel: "Channel name", duration: "8:12", why: "One sentence on why it fits." }
  },
  lessons: [ /* exactly 7 lesson objects, days 29 to 35, in order */ ]
};
```

The app injects `<script src="data/weeks/weekNN.js">` the first time a day in that week is opened (works on file:// and from the service worker cache). The file must not run any other code, must not touch the DOM, and must not reference any other file.

## 3. Lesson object (lesson day)

Same schema as `data/lessons.js` (see README.md). All fields:

```js
{
  id: 29,                          // global day number
  week: 5,
  type: "lesson",
  title: "At the market",
  goal: "One sentence: what you can do after this lesson.",
  warmup: "Text shown in the warm-up when no cards are due.",
  words: [                         // about 8 to 10
    {
      id: "l29-el-mercado",        // REQUIRED, unique for the whole year, permanent. Format: l<day>-<ascii-slug>
      es: "el mercado",            // correct accents, ñ, and opening ¿ ¡
      en: "the market",
      say: "ehl mehr-KAH-doh",     // sound-it-out hint, stressed syllable in CAPITALS
      note: "Optional short tip.",
      speak: "Optional text to speak instead of es (use when es contains ___)",
      accept: ["optional extra typed answers"],
      example: { es: "Voy al mercado.", en: "I'm going to the market." },
      hook: "Memory hook, shown after 3 misses in a row."
    }
  ],
  grammar: {
    title: "Short title",
    body: ["Two or three short sentences.", "Optional second paragraph."],
    examples: [{ es: "Spanish example.", en: "English meaning." }]   // 2 to 4
  },
  dialogue: {
    title: "Scene title",
    lines: [ { who: "Vendedora", es: "...", en: "..." }, { who: "Tú", es: "...", en: "..." } ]   // who "Tú" = the learner
  },
  quiz: [                          // 5 or 6, mixing all four types
    { type: "mc", prompt: "...", choices: ["A", "B", "C", "D"], answer: "A", explain: "..." },
    { type: "type", prompt: "Type the Spanish for ...", answer: "...", accept: [], explain: "..." },
    { type: "listen", prompt: "Listen and choose what you hear.", say: "X", choices: ["X", "Y", "Z", "W"], answer: "X" },
    { type: "match", prompt: "Match each word.", pairs: [["es1", "en1"], ["es2", "en2"], ["es3", "en3"], ["es4", "en4"]] }
  ],
  video: "w05-market"              // optional: a key from this file's videos, or from window.VIDEOS in lessons.js
}
```

## 4. Lesson object (review day, id % 7 === 0)

```js
{
  id: 35, week: 5, type: "review",
  title: "Week 5 review",
  goal: "No new words today. Review the week, a role play, and a check quiz.",
  warmup: "Review the week's words. Words you missed come first.",
  canDo: ["You can now ... (3 to 5 lines)"],
  dialogue: { title: "Role play: ...", lines: [ ... ] },   // 8 to 14 lines combining the week
  quiz: [ ... ],                                            // 5 questions across the week
  video: "optional key"
}
```
No `words` and no `grammar` on review days. The review screen pulls the week's words automatically.

## 5. Rules the app relies on

- `quiz[].answer` must exactly equal one entry in `choices` (mc and listen). For `listen`, `say` must equal `answer`.
- `match` has exactly 4 pairs.
- Word `id` format `l<day>-<slug>` is required: the app derives the week from the day number to reload a card's week file. Slug: lowercase ascii letters, digits and hyphens only (strip accents and ¿?¡!).
- Never rename or reuse a word id once published.
- Visible text: no em dashes, no en dashes, no ampersands. Public-safe: no real people's names, no emails, no personal details. Fictional dialogue names are fine.
- Latin American Spanish: usted for strangers and elders, ustedes for you all (no vosotros), Mexican word choices where they differ.

## 6. Year outline: data/year_outline.js

```js
window.YEAR_OUTLINE = {
  title: "Spanish in 15",
  levels: [
    { id: "A1", title: "Beginner", summary: "One sentence." },
    { id: "A2", title: "Elementary", summary: "One sentence." },
    { id: "B1", title: "Intermediate", summary: "One sentence." }
  ],
  units: [
    { id: 1, level: "A1", title: "Survival basics", summary: "One sentence.", weeks: [1, 2, 3, 4] }
    // ... every week belongs to exactly one unit, units in order
  ],
  weeks: [
    { week: 1, unit: 1, title: "Survival basics", status: "ready" }
    // ... 52 entries. status: "ready" = content exists (lessons.js for weeks 1 and 2, weekNN.js for 3+),
    //                         "planned" = shown locked as Coming soon
  ],
  days: [
    { id: 1, week: 1, type: "lesson", title: "Greetings and introductions", preview: "short word list", grammar: "short grammar point" }
    // ... 364 entries, ids 1 to 364 in order, review days have type "review"
  ]
};
```

Days 1 to 14 in the outline must keep these titles (they match lessons.js):
1 Greetings and introductions, 2 Goodbyes and polite words, 3 Numbers 0 to 7, 4 Numbers 8 to 20 and prices, 5 Ordering food 1, 6 Ordering food 2, 7 Week 1 review, 8 Understanding and being understood, 9 Directions 1, 10 Places in town, 11 Days of the week, 12 Telling time, 13 Numbers 30 to 100, 14 Week 2 review.
Weeks 1 and 2 should be `status: "ready"`. Mark a week "ready" only when its weekNN.js exists.

If `data/year_outline.js` is missing, the app falls back to the 4-week `data/course.js`.

## Optional fields used by lesson sessions

All of these are optional. The app reads them when present and skips them when not.

- `words[].emoji`: one emoji for the picture card, for example `"emoji": "🍎"`.
- `lesson.practice`: curated session items. Supported shapes:
  - `{ "type": "tiles", "en": "English sentence", "answer": "Spanish sentence", "tiles": [...], "distractors": [...] }`
  - `{ "type": "hear", "say": "Spanish to speak", "answer": "Spanish to type", "en": "English meaning" }`
  - `{ "type": "fill", "prompt": "Spanish with ___ (English hint)", "answer": "word", "choices": [...], "sentence": "full Spanish sentence" }`
  - `{ "type": "speak", "es": "Spanish to say", "en": "English meaning" }`
- `lesson.quiz` items (`mc`, `type`, `listen`) are also mixed into sessions.
