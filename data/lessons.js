/*
  Spanish in 15: full lesson content.
  One entry per playable day. See README.md for the schema.
  Word ids are used to save flashcard progress: never change an id after publishing.
  Visible text rule: no em dashes, no en dashes, no ampersands.
*/
window.VIDEOS = {
  greetings: {
    id: "h5R2qyp9NYM",
    title: "Greetings and Goodbyes in Spanish",
    channel: "Spanish and Go",
    duration: "12:16",
    why: "Formal and casual greeting conversations (the tú vs usted idea), plus real greetings filmed on the street in Mexico."
  },
  phrases: {
    id: "VbAsMHy6WWA",
    title: "Basic Conversational Phrases in Spanish for Beginners (Easy Spanish 132)",
    channel: "Easy Spanish",
    duration: "6:45",
    why: "Short real street conversations with Spanish and English subtitles. Great listening practice for polite words."
  },
  allGreetings: {
    id: "AqfQQZVmTUw",
    title: "Every Spanish Greeting You Need (Formal, Casual and Slang)",
    channel: "The Language Tutor, Spanish",
    duration: "9:54",
    why: "A fast review of formal, casual and slang greetings. Treat it as general review; it does not focus on one country."
  }
};

window.LESSONS = [
  /* ---------------- Day 1 ---------------- */
  {
    id: 1, week: 1, type: "lesson",
    title: "Greetings and introductions",
    goal: "Greet anyone in Spanish at any time of day, say your name and ask how someone is.",
    warmup: "This is your first lesson, so there is nothing to review yet. Today you will learn to greet anyone in Spanish at any time of day.",
    words: [
      { id: "l1-hola", es: "hola", en: "hello", say: "OH-lah", note: "The h is silent.", example: { es: "¡Hola! ¿Cómo estás?", en: "Hello! How are you?" }, hook: "Silent h: just say OH-lah, like a happy OH." },
      { id: "l1-buenos-dias", es: "buenos días", en: "good morning", say: "BWEH-nohs DEE-ahs", note: "Use it until about noon.", example: { es: "Buenos días, señora.", en: "Good morning, ma'am." }, hook: "días sounds like DEE-ahs: good DAYS start in the morning." },
      { id: "l1-buenas-tardes", es: "buenas tardes", en: "good afternoon", say: "BWEH-nahs TAR-dehs", note: "From noon until dark.", example: { es: "Buenas tardes, ¿cómo está?", en: "Good afternoon, how are you? (polite)" }, hook: "tardes sounds like tardy: you are tardy for lunch in the afternoon." },
      { id: "l1-buenas-noches", es: "buenas noches", en: "good evening / good night", say: "BWEH-nahs NOH-chehs", note: "After dark, as hello or goodbye.", example: { es: "Buenas noches, hasta mañana.", en: "Good night, see you tomorrow." }, hook: "noches, like nocturnal: things that come out at night." },
      { id: "l1-me-llamo", es: "me llamo", en: "my name is", say: "meh YAH-moh", note: "In Mexico the ll sounds like the y in yes.", example: { es: "Hola, me llamo Ana.", en: "Hi, my name is Ana." }, hook: "Picture a llama (YAH-mah) introducing itself: me llamo." },
      { id: "l1-como-te-llamas", es: "¿cómo te llamas?", en: "what's your name? (casual, tú)", say: "KOH-moh teh YAH-mahs", note: "Casual tú form: for a peer or a kid.", example: { es: "Hola, ¿cómo te llamas?", en: "Hi, what's your name?" }, hook: "Same llama, now you ask it: how do you call yourself?" },
      { id: "l1-mucho-gusto", es: "mucho gusto", en: "nice to meet you", say: "MOO-choh GOOS-toh", note: "Say it after you hear a name.", example: { es: "Me llamo Ana. Mucho gusto.", en: "My name is Ana. Nice to meet you." }, hook: "Say it with gusto when you meet someone new." },
      { id: "l1-como-estas", es: "¿cómo estás?", en: "how are you? (casual, tú)", say: "KOH-moh ehs-TAHS", note: "Casual tú form. The polite form is ¿cómo está?", example: { es: "¡Hola! ¿Cómo estás?", en: "Hi! How are you?" }, hook: "estás sounds a bit like status: what is your status?" },
      { id: "l1-bien-gracias", es: "bien, gracias", en: "fine, thanks", say: "bee-EHN, GRAH-see-ahs", note: "The standard answer to ¿cómo estás?", example: { es: "Bien, gracias. ¿Y tú?", en: "Fine, thanks. And you?" }, hook: "gracias sounds like gracious: a gracious thank you." }
    ],
    grammar: {
      title: "tú vs usted: two ways to say you",
      body: [
        "Spanish has two ways to say you. Tú is casual: friends, family, kids and people your age in relaxed settings. Usted is polite: strangers, elders, a boss, a server you just met.",
        "Safe rule for a beginner: use usted with adults you do not know. If they use tú with you, you can switch."
      ],
      examples: [
        { es: "¿Cómo estás?", en: "How are you? (tú, casual)" },
        { es: "¿Cómo está?", en: "How are you? (usted, polite)" }
      ]
    },
    dialogue: {
      title: "Meeting someone in the afternoon",
      lines: [
        { who: "Ana", es: "Buenas tardes.", en: "Good afternoon." },
        { who: "Tú", es: "Buenas tardes.", en: "Good afternoon." },
        { who: "Ana", es: "Me llamo Ana. ¿Cómo te llamas?", en: "My name is Ana. What's your name?" },
        { who: "Tú", es: "Me llamo ___.", en: "My name is ___. (say your name)" },
        { who: "Ana", es: "Mucho gusto.", en: "Nice to meet you." },
        { who: "Tú", es: "Mucho gusto.", en: "Nice to meet you." },
        { who: "Ana", es: "¿Cómo estás?", en: "How are you?" },
        { who: "Tú", es: "Bien, gracias.", en: "Fine, thanks." },
        { who: "Ana", es: "¡Muy bien! Hasta mañana.", en: "Very good! See you tomorrow." }
      ]
    },
    quiz: [
      { type: "mc", prompt: "It is 3 PM and you walk into a taquería. How do you greet the person at the counter?", choices: ["Buenas tardes.", "Buenos días.", "Buenas noches.", "Mucho gusto."], answer: "Buenas tardes.", explain: "Buenas tardes is the afternoon greeting. Hola also works at any time." },
      { type: "type", prompt: "Someone asks you: ¿Cómo te llamas? Type the two words that start your answer (my name is).", answer: "me llamo", explain: "Me llamo, then your name." },
      { type: "mc", prompt: "A friend says: ¡Hola! ¿Cómo estás? What do you say back?", choices: ["Bien, gracias.", "Buenas noches.", "Me llamo.", "¿Cómo te llamas?"], answer: "Bien, gracias.", explain: "Bien, gracias means fine, thanks." },
      { type: "mc", prompt: "You meet a friend's grandmother for the first time. Which is better?", choices: ["¿Cómo está?", "¿Cómo estás?"], answer: "¿Cómo está?", explain: "¿Cómo está? is the usted form, the polite way to speak to an elder or someone you just met." },
      { type: "listen", prompt: "Listen and choose the phrase you hear.", say: "mucho gusto", choices: ["mucho gusto", "me llamo", "buenas noches", "buenos días"], answer: "mucho gusto" },
      { type: "match", prompt: "Match each greeting to its meaning.", pairs: [["hola", "hello"], ["buenos días", "good morning"], ["buenas tardes", "good afternoon"], ["buenas noches", "good evening / good night"]] }
    ],
    video: "greetings"
  },

  /* ---------------- Day 2 ---------------- */
  {
    id: 2, week: 1, type: "lesson",
    title: "Goodbyes and polite words",
    goal: "Say goodbye, say please and thank you, and excuse yourself politely.",
    warmup: "Quick recall of yesterday's greetings. If nothing is due yet, say these out loud: hola, buenos días, buenas tardes, buenas noches.",
    words: [
      { id: "l2-adios", es: "adiós", en: "goodbye", say: "ah-dee-OHS", note: "Fine any time. Often said when you will not see someone for a while.", example: { es: "¡Adiós! Gracias por todo.", en: "Goodbye! Thanks for everything." }, hook: "adiós comes from a Dios, to God: an old blessing on parting." },
      { id: "l2-hasta-luego", es: "hasta luego", en: "see you later", say: "AHS-tah LWEH-goh", note: "The h in hasta is silent. A very common everyday goodbye.", example: { es: "Bueno, hasta luego.", en: "Okay, see you later." }, hook: "luego sounds like LWEH-go: later, let's go." },
      { id: "l2-hasta-manana", es: "hasta mañana", en: "see you tomorrow", say: "AHS-tah mah-NYAH-nah", note: "ñ sounds like the ny in canyon.", example: { es: "Buenas noches, hasta mañana.", en: "Good night, see you tomorrow." }, hook: "mañana is the famous word for tomorrow." },
      { id: "l2-por-favor", es: "por favor", en: "please", say: "pohr fah-BOHR", note: "The v sounds close to a soft b.", example: { es: "Un café, por favor.", en: "A coffee, please." }, hook: "Do me a favor: por favor." },
      { id: "l2-gracias", es: "gracias", en: "thank you", say: "GRAH-see-ahs", note: "In Latin America the c sounds like s.", example: { es: "Gracias, señor.", en: "Thank you, sir." }, hook: "gracias sounds like gracious." },
      { id: "l2-muchas-gracias", es: "muchas gracias", en: "thank you very much", say: "MOO-chahs GRAH-see-ahs", note: "muchas means many.", example: { es: "¡Muchas gracias!", en: "Thank you very much!" }, hook: "mucho means much: much thanks." },
      { id: "l2-de-nada", es: "de nada", en: "you're welcome", say: "deh NAH-dah", note: "The answer to gracias.", example: { es: "Gracias. De nada.", en: "Thanks. You're welcome." }, hook: "nada means nothing: it was nothing." },
      { id: "l2-perdon", es: "perdón", en: "sorry / excuse me", say: "pehr-DOHN", note: "To apologize or to get someone's attention.", example: { es: "Perdón, ¿habla inglés?", en: "Excuse me, do you speak English?" }, hook: "perdón sounds like pardon." },
      { id: "l2-con-permiso", es: "con permiso", en: "excuse me (to pass by or leave)", say: "kohn pehr-MEE-soh", note: "Say it before you squeeze past someone or step away.", example: { es: "Con permiso.", en: "Excuse me (coming through)." }, hook: "con permiso means with your permission: you ask to pass." }
    ],
    grammar: {
      title: "Upside-down question and exclamation marks",
      body: [
        "Spanish questions open with ¿ and close with ?. Exclamations open with ¡ and close with !.",
        "The opening mark tells you early that a question or exclamation is coming, so your voice can rise or get excited from the start."
      ],
      examples: [
        { es: "¿Cómo estás?", en: "How are you?" },
        { es: "¡Muchas gracias!", en: "Thank you very much!" }
      ]
    },
    dialogue: {
      title: "Leaving a friend's house",
      lines: [
        { who: "Tú", es: "Con permiso.", en: "Excuse me. (as you get up to leave)" },
        { who: "Amiga", es: "¿Ya te vas?", en: "Are you leaving already?" },
        { who: "Tú", es: "Sí. ¡Muchas gracias!", en: "Yes. Thank you very much!" },
        { who: "Amiga", es: "De nada. ¡Hasta luego!", en: "You're welcome. See you later!" },
        { who: "Tú", es: "Hasta mañana. ¡Adiós!", en: "See you tomorrow. Goodbye!" }
      ]
    },
    quiz: [
      { type: "mc", prompt: "Someone holds the door open for you. What do you say?", choices: ["Gracias.", "De nada.", "Perdón.", "Hasta luego."], answer: "Gracias.", explain: "Gracias means thank you." },
      { type: "mc", prompt: "Someone says Gracias to you. What do you answer?", choices: ["De nada.", "Por favor.", "Adiós.", "Con permiso."], answer: "De nada.", explain: "De nada means you're welcome." },
      { type: "mc", prompt: "You need to squeeze past people in a crowded aisle. What do you say?", choices: ["Con permiso.", "De nada.", "Hasta mañana.", "Buenos días."], answer: "Con permiso.", explain: "Con permiso is the polite way to ask to pass. Perdón is for apologizing or getting attention." },
      { type: "type", prompt: "Type the Spanish for please.", answer: "por favor", explain: "Por favor goes at the end of a request: Un café, por favor." },
      { type: "listen", prompt: "Listen and choose the phrase you hear.", say: "hasta mañana", choices: ["hasta mañana", "hasta luego", "de nada", "muchas gracias"], answer: "hasta mañana" },
      { type: "match", prompt: "Match each phrase to its meaning.", pairs: [["adiós", "goodbye"], ["hasta luego", "see you later"], ["de nada", "you're welcome"], ["perdón", "sorry / excuse me"]] }
    ],
    video: "phrases"
  },

  /* ---------------- Day 3 ---------------- */
  {
    id: 3, week: 1, type: "lesson",
    title: "Numbers 0 to 7",
    goal: "Count from zero to seven and order one or more of something.",
    warmup: "Say goodbye three ways out loud: adiós, hasta luego, hasta mañana. Then review any cards that are due.",
    words: [
      { id: "l3-cero", es: "cero", en: "zero", say: "SEH-roh", note: "Single r: a quick tap of the tongue.", example: { es: "Mi número termina en cero.", en: "My number ends in zero." }, hook: "cero looks like zero." },
      { id: "l3-uno", es: "uno", en: "one", say: "OO-noh", note: "Becomes un before a masculine noun.", example: { es: "Solo uno, gracias.", en: "Just one, thanks." }, hook: "Like the card game UNO: one card left." },
      { id: "l3-dos", es: "dos", en: "two", say: "DOHS", example: { es: "Dos tacos, por favor.", en: "Two tacos, please." }, hook: "Two doses: dos." },
      { id: "l3-tres", es: "tres", en: "three", say: "TREHS", note: "Tap the r once.", example: { es: "Mesa para tres.", en: "A table for three." }, hook: "tres sounds like tri, as in tricycle." },
      { id: "l3-cuatro", es: "cuatro", en: "four", say: "KWAH-troh", example: { es: "Somos cuatro.", en: "There are four of us." }, hook: "cuatro sounds like quarter: four quarters in a dollar." },
      { id: "l3-cinco", es: "cinco", en: "five", say: "SEEN-koh", example: { es: "Cinco minutos.", en: "Five minutes." }, hook: "Cinco de Mayo: the fifth of May." },
      { id: "l3-seis", es: "seis", en: "six", say: "SAYS", example: { es: "Son las seis.", en: "It's six o'clock." }, hook: "Simon SAYS six: seis." },
      { id: "l3-siete", es: "siete", en: "seven", say: "see-EH-teh", example: { es: "Siete días a la semana.", en: "Seven days a week." }, hook: "see-EH-teh: see a tea set for seven." },
      { id: "l3-cuantos", es: "¿cuántos?", en: "how many?", say: "KWAHN-tohs", note: "For things like tacos: ¿cuántos tacos?", example: { es: "¿Cuántos tacos?", en: "How many tacos?" }, hook: "cuántos sounds like quantity." }
    ],
    grammar: {
      title: "uno becomes un before a noun",
      body: [
        "When you count, say uno. When one comes right before a masculine noun, it shortens to un.",
        "Feminine nouns use una. You will practice un and una more in Lesson 5."
      ],
      examples: [
        { es: "Uno, dos, tres.", en: "One, two, three." },
        { es: "Un taco, por favor.", en: "One taco, please." },
        { es: "Una torta, por favor.", en: "One torta, please." }
      ]
    },
    dialogue: {
      title: "At a taco stand",
      lines: [
        { who: "Taquero", es: "Buenas tardes. ¿Cuántos tacos?", en: "Good afternoon. How many tacos?" },
        { who: "Tú", es: "Tres, por favor.", en: "Three, please." },
        { who: "Taquero", es: "¿Tres?", en: "Three?" },
        { who: "Tú", es: "Perdón, cuatro. Somos cuatro.", en: "Sorry, four. There are four of us." },
        { who: "Taquero", es: "Cuatro tacos. ¡Muy bien!", en: "Four tacos. Very good!" },
        { who: "Tú", es: "Gracias.", en: "Thanks." }
      ]
    },
    quiz: [
      { type: "mc", prompt: "What number is cinco?", choices: ["5", "4", "6", "7"], answer: "5", explain: "Cinco is five, like Cinco de Mayo." },
      { type: "type", prompt: "There are three of you. Type the Spanish for three.", answer: "tres", explain: "Mesa para tres: a table for three." },
      { type: "mc", prompt: "Complete the order: ___ taco, por favor. (one taco)", choices: ["Un", "Uno", "Una", "Dos"], answer: "Un", explain: "uno becomes un before a masculine noun: un taco." },
      { type: "listen", prompt: "Listen and choose the number you hear.", say: "seis", choices: ["seis", "siete", "tres", "dos"], answer: "seis" },
      { type: "mc", prompt: "The server asks ¿Cuántos? What is the server asking?", choices: ["How many?", "How much does it cost?", "What's your name?", "How are you?"], answer: "How many?", explain: "¿Cuántos? means how many?" },
      { type: "match", prompt: "Match each number.", pairs: [["cero", "zero"], ["dos", "two"], ["cuatro", "four"], ["siete", "seven"]] }
    ]
  },

  /* ---------------- Day 4 ---------------- */
  {
    id: 4, week: 1, type: "lesson",
    title: "Numbers 8 to 20 and prices",
    goal: "Count to twenty, ask what something costs and understand the price.",
    warmup: "Count from cero to siete out loud. Then review any cards that are due.",
    words: [
      { id: "l4-ocho", es: "ocho", en: "eight", say: "OH-choh", example: { es: "Abre a las ocho.", en: "It opens at eight." }, hook: "An octopus has ocho legs." },
      { id: "l4-nueve", es: "nueve", en: "nine", say: "NWEH-beh", example: { es: "Cuesta nueve pesos.", en: "It costs nine pesos." }, hook: "nueve sounds a bit like November, the ninth month of the old Roman calendar." },
      { id: "l4-diez", es: "diez", en: "ten", say: "dee-EHS", note: "In Latin America the z sounds like s.", example: { es: "Cuesta diez pesos.", en: "It costs ten pesos." }, hook: "diez sounds like dimes: ten cents in a dime." },
      { id: "l4-once", es: "once", en: "eleven", say: "OHN-seh", note: "Not the English word once.", example: { es: "Son las once.", en: "It's eleven o'clock." }, hook: "Eleven players on a team, once, OHN-seh." },
      { id: "l4-doce", es: "doce", en: "twelve", say: "DOH-seh", example: { es: "Son las doce.", en: "It's twelve o'clock." }, hook: "doce sounds like dozen: twelve." },
      { id: "l4-trece", es: "trece", en: "thirteen", say: "TREH-seh", example: { es: "Tengo trece años.", en: "I am thirteen years old." }, hook: "tres plus a little ten: trece." },
      { id: "l4-catorce", es: "catorce", en: "fourteen", say: "kah-TOHR-seh", example: { es: "Son catorce dólares.", en: "That's fourteen dollars." }, hook: "cuatro plus a little ten: catorce." },
      { id: "l4-quince", es: "quince", en: "fifteen", say: "KEEN-seh", example: { es: "Quince minutos al día.", en: "Fifteen minutes a day." }, hook: "A quinceañera is the party for turning fifteen." },
      { id: "l4-veinte", es: "veinte", en: "twenty", say: "BAYN-teh", example: { es: "Cuesta veinte pesos.", en: "It costs twenty pesos." }, hook: "veinte: think of twenty vain tees in your closet." },
      { id: "l4-cuanto-cuesta", es: "¿cuánto cuesta?", en: "how much does it cost?", say: "KWAHN-toh KWEHS-tah", note: "Point at the item and ask.", example: { es: "Perdón, ¿cuánto cuesta?", en: "Excuse me, how much is it?" }, hook: "cuesta sounds like cost." }
    ],
    grammar: {
      title: "Pattern: Cuesta ___ pesos / dólares",
      body: [
        "Ask ¿Cuánto cuesta? and the answer is Cuesta plus a number plus the money: Cuesta quince pesos.",
        "Bonus numbers: 16 to 19 are ten and a number, written as one word: dieciséis (16), diecisiete (17), dieciocho (18), diecinueve (19)."
      ],
      examples: [
        { es: "¿Cuánto cuesta?", en: "How much does it cost?" },
        { es: "Cuesta quince pesos.", en: "It costs fifteen pesos." },
        { es: "Cuesta veinte dólares.", en: "It costs twenty dollars." },
        { es: "dieciséis, diecisiete, dieciocho, diecinueve", en: "16, 17, 18, 19" }
      ]
    },
    dialogue: {
      title: "At a market stand",
      lines: [
        { who: "Tú", es: "Buenos días. ¿Cuánto cuesta?", en: "Good morning. How much is it?" },
        { who: "Vendedora", es: "Cuesta ocho pesos.", en: "It costs eight pesos." },
        { who: "Tú", es: "¿Ocho? Dos, por favor.", en: "Eight? Two, please." },
        { who: "Vendedora", es: "Son dieciséis pesos.", en: "That's sixteen pesos." },
        { who: "Tú", es: "Aquí tiene. Gracias.", en: "Here you go. Thanks." },
        { who: "Vendedora", es: "Gracias a usted.", en: "Thank you." }
      ]
    },
    quiz: [
      { type: "mc", prompt: "What number is quince?", choices: ["15", "5", "50", "14"], answer: "15", explain: "Quince is fifteen, as in quinceañera." },
      { type: "type", prompt: "Type the Spanish for twenty.", answer: "veinte", explain: "Veinte: BAYN-teh." },
      { type: "mc", prompt: "You want to know the price of a mango. What do you ask?", choices: ["¿Cuánto cuesta?", "¿Cuántos?", "¿Cómo estás?", "¿Cómo te llamas?"], answer: "¿Cuánto cuesta?", explain: "¿Cuánto cuesta? means how much does it cost?" },
      { type: "listen", prompt: "Listen and choose the number you hear.", say: "doce", choices: ["doce", "dos", "diez", "once"], answer: "doce" },
      { type: "mc", prompt: "The seller says: Cuesta once pesos. How much is it?", choices: ["11 pesos", "1 peso", "12 pesos", "10 pesos"], answer: "11 pesos", explain: "Once (OHN-seh) is eleven in Spanish." },
      { type: "match", prompt: "Match each number.", pairs: [["ocho", "eight"], ["nueve", "nine"], ["diez", "ten"], ["catorce", "fourteen"]] }
    ]
  },

  /* ---------------- Day 5 ---------------- */
  {
    id: 5, week: 1, type: "lesson",
    title: "Ordering food 1",
    goal: "Order food and a drink, say for here or to go, and ask for the check.",
    warmup: "Ask the price out loud: ¿Cuánto cuesta? Then answer it: Cuesta veinte pesos. Review any cards that are due.",
    words: [
      { id: "l5-quiero", es: "quiero", en: "I want", say: "kee-EH-roh", note: "Direct but normal when you add por favor.", example: { es: "Quiero un taco, por favor.", en: "I want a taco, please." }, hook: "kee-EH-roh: the KEY to getting what you want." },
      { id: "l5-quisiera", es: "quisiera", en: "I would like", say: "kee-see-EH-rah", note: "A softer, more polite way to order.", example: { es: "Quisiera una torta, por favor.", en: "I would like a torta, please." }, hook: "quisiera is quiero with good manners." },
      { id: "l5-un-taco", es: "un taco", en: "a taco", say: "oon TAH-koh", example: { es: "Un taco, por favor.", en: "A taco, please." }, hook: "taco ends in o: un taco." },
      { id: "l5-una-torta", es: "una torta", en: "a torta (Mexican sandwich)", say: "OO-nah TOHR-tah", note: "In Mexico a torta is a sandwich on a crusty roll, not a cake.", example: { es: "Una torta para llevar.", en: "A torta to go." }, hook: "torta ends in a: una torta." },
      { id: "l5-agua", es: "agua", en: "water", say: "AH-gwah", example: { es: "Quiero agua, por favor.", en: "I want water, please." }, hook: "agua sounds like aqua." },
      { id: "l5-un-refresco", es: "un refresco", en: "a soda", say: "oon reh-FREHS-koh", example: { es: "Un refresco, por favor.", en: "A soda, please." }, hook: "A refresco is refreshing." },
      { id: "l5-la-cuenta", es: "la cuenta", en: "the check / the bill", say: "lah KWEHN-tah", example: { es: "La cuenta, por favor.", en: "The check, please." }, hook: "cuenta sounds like count: they count up your bill." },
      { id: "l5-para-llevar", es: "para llevar", en: "to go", say: "PAH-rah yeh-BAHR", note: "llevar means to carry or take.", example: { es: "Dos tacos para llevar.", en: "Two tacos to go." }, hook: "llevar: you carry it away." },
      { id: "l5-para-comer-aqui", es: "para comer aquí", en: "for here (to eat here)", say: "PAH-rah koh-MEHR ah-KEE", note: "comer means to eat, aquí means here.", example: { es: "¿Para llevar o para comer aquí?", en: "To go or for here?" }, hook: "aquí sounds like ah-KEE: the KEY is here." }
    ],
    grammar: {
      title: "un vs una: masculine and feminine a",
      body: [
        "Every Spanish noun is masculine or feminine. Use un before masculine nouns and una before feminine nouns. Both mean a or one.",
        "Most nouns ending in o are masculine and most ending in a are feminine. Learn each noun with its un or una."
      ],
      examples: [
        { es: "un taco, un refresco", en: "a taco, a soda" },
        { es: "una torta, una mesa", en: "a torta, a table" }
      ]
    },
    dialogue: {
      title: "At a taquería",
      lines: [
        { who: "Mesero", es: "Buenas tardes. ¿Qué va a querer?", en: "Good afternoon. What will you have?" },
        { who: "Tú", es: "Quiero dos tacos y un refresco, por favor.", en: "I want two tacos and a soda, please." },
        { who: "Mesero", es: "¿Para comer aquí o para llevar?", en: "For here or to go?" },
        { who: "Tú", es: "Para comer aquí.", en: "For here." },
        { who: "Tú", es: "Perdón, la cuenta, por favor.", en: "Excuse me, the check, please." },
        { who: "Mesero", es: "Sí, ahorita.", en: "Yes, right away." }
      ]
    },
    quiz: [
      { type: "mc", prompt: "You want your food to take with you. What do you say?", choices: ["Para llevar.", "Para comer aquí.", "La cuenta.", "Quiero agua."], answer: "Para llevar.", explain: "Para llevar means to go." },
      { type: "mc", prompt: "Complete: ___ torta, por favor.", choices: ["Una", "Un", "Uno"], answer: "Una", explain: "Torta is feminine, so it is una torta." },
      { type: "type", prompt: "You are done eating. Type the Spanish for the check.", answer: "la cuenta", accept: ["cuenta"], explain: "La cuenta, por favor." },
      { type: "listen", prompt: "Listen and choose the word you hear.", say: "un refresco", choices: ["un refresco", "una torta", "un taco", "agua"], answer: "un refresco" },
      { type: "mc", prompt: "What does quisiera mean?", choices: ["I would like", "I want", "to go", "the check"], answer: "I would like", explain: "Quisiera is a softer, more polite quiero." },
      { type: "match", prompt: "Match the food words.", pairs: [["agua", "water"], ["un refresco", "a soda"], ["un taco", "a taco"], ["para llevar", "to go"]] }
    ]
  },

  /* ---------------- Day 6 ---------------- */
  {
    id: 6, week: 1, type: "lesson",
    title: "Ordering food 2",
    goal: "Use the pattern Me da ___, por favor. and say with or without.",
    warmup: "Order out loud: Quiero dos tacos para llevar, por favor. Then review any cards that are due.",
    words: [
      { id: "l6-me-da", es: "me da ___, por favor", en: "can I have ___, please", say: "meh DAH ___, pohr fah-BOHR", note: "Literally: you give me. A very common, polite way to order in Mexico.", speak: "Me da un taco, por favor.", example: { es: "Me da tres tacos, por favor.", en: "Can I have three tacos, please." }, hook: "da sounds like donate: donate me a taco, please." },
      { id: "l6-tacos-de-pastor", es: "tacos de pastor", en: "marinated pork tacos", say: "TAH-kohs deh pahs-TOHR", note: "Also called tacos al pastor. Pork cooked on a vertical spit.", example: { es: "Me da cuatro tacos de pastor.", en: "Can I have four pastor tacos." }, hook: "pastor means shepherd; the style was inspired by shawarma brought to Mexico by Lebanese immigrants." },
      { id: "l6-tortillas-de-maiz", es: "tortillas de maíz", en: "corn tortillas", say: "tohr-TEE-yahs deh mah-EES", note: "maíz has an accent on the í: mah-EES.", example: { es: "¿Tiene tortillas de maíz?", en: "Do you have corn tortillas?" }, hook: "maíz sounds like maize, another word for corn." },
      { id: "l6-salsa", es: "salsa", en: "salsa / sauce", say: "SAHL-sah", example: { es: "¿La salsa pica?", en: "Is the salsa spicy?" }, hook: "Same word in English and Spanish." },
      { id: "l6-con", es: "con", en: "with", say: "KOHN", example: { es: "Con todo, por favor.", en: "With everything, please." }, hook: "Chili con carne: chili with meat." },
      { id: "l6-sin", es: "sin", en: "without", say: "SEEN", example: { es: "Sin cebolla, por favor.", en: "Without onion, please." }, hook: "sin sounds like seen: I have never seen onion on my taco." },
      { id: "l6-cebolla", es: "cebolla", en: "onion", say: "seh-BOH-yah", note: "ll sounds like y.", example: { es: "Con cebolla y cilantro.", en: "With onion and cilantro." }, hook: "seh-BOH-yah: onions make you say boy-yah, my eyes!" },
      { id: "l6-cilantro", es: "cilantro", en: "cilantro", say: "see-LAHN-troh", example: { es: "Sin cilantro, por favor.", en: "Without cilantro, please." }, hook: "Same word as in English, said see-LAHN-troh." },
      { id: "l6-limon", es: "limón", en: "lime", say: "lee-MOHN", note: "In Mexico, limón usually means the small green lime.", example: { es: "Me da unos limones, por favor.", en: "Can I have some limes, please." }, hook: "A limón on your taco is green, not yellow." }
    ],
    grammar: {
      title: "Plurals: add -s or -es",
      body: [
        "To make more than one, add -s to a word that ends in a vowel: taco, tacos. Add -es to a word that ends in a consonant: limón, limones.",
        "Watch the accent: limón loses its written accent in limones, because the stress stays in the same place on its own."
      ],
      examples: [
        { es: "un taco, dos tacos", en: "one taco, two tacos" },
        { es: "una tortilla, tres tortillas", en: "one tortilla, three tortillas" },
        { es: "un limón, dos limones", en: "one lime, two limes" }
      ]
    },
    dialogue: {
      title: "At a taco stand at night",
      lines: [
        { who: "Taquero", es: "¡Buenas noches! ¿Qué va a querer?", en: "Good evening! What will you have?" },
        { who: "Tú", es: "Me da cuatro tacos de pastor, por favor.", en: "Can I have four pastor tacos, please." },
        { who: "Taquero", es: "¿Con todo?", en: "With everything?" },
        { who: "Tú", es: "Con cebolla, sin cilantro.", en: "With onion, without cilantro." },
        { who: "Taquero", es: "¿Y de tomar?", en: "And to drink?" },
        { who: "Tú", es: "Un refresco, por favor.", en: "A soda, please." },
        { who: "Taquero", es: "Muy bien. ¿Para aquí o para llevar?", en: "Very good. For here or to go?" },
        { who: "Tú", es: "Para llevar. Gracias.", en: "To go. Thanks." }
      ]
    },
    quiz: [
      { type: "mc", prompt: "What does sin mean?", choices: ["without", "with", "please", "onion"], answer: "without", explain: "Sin cebolla: without onion." },
      { type: "type", prompt: "Type the Spanish for corn tortillas.", answer: "tortillas de maíz", explain: "maíz has an accent on the í." },
      { type: "mc", prompt: "One limón, two...?", choices: ["limones", "limóns", "limónes", "limons"], answer: "limones", explain: "Add -es after a consonant, and the accent drops: limones." },
      { type: "mc", prompt: "Which is a polite way to order four tacos?", choices: ["Me da cuatro tacos, por favor.", "Me llamo cuatro tacos.", "Cuatro tacos, de nada.", "¿Cuántos tacos?"], answer: "Me da cuatro tacos, por favor.", explain: "Me da ___, por favor is the pattern for ordering." },
      { type: "listen", prompt: "Listen and choose the word you hear.", say: "cebolla", choices: ["cebolla", "cilantro", "salsa", "limón"], answer: "cebolla" },
      { type: "match", prompt: "Match the taco words.", pairs: [["con", "with"], ["sin", "without"], ["cebolla", "onion"], ["limón", "lime"]] }
    ]
  },

  /* ---------------- Day 7: Week 1 review ---------------- */
  {
    id: 7, week: 1, type: "review",
    title: "Week 1 review",
    goal: "No new words today. Review the week, put it all together in a role play, and check your progress.",
    warmup: "Review the week's words. Words you missed come first.",
    canDo: [
      "Greet anyone at any time of day and say your name.",
      "Say please, thank you, excuse me and goodbye.",
      "Count to twenty and ask what something costs.",
      "Order tacos, a drink, for here or to go, and ask for the check."
    ],
    dialogue: {
      title: "Role play: dinner at a taquería",
      lines: [
        { who: "Mesera", es: "¡Buenas noches! ¿Cómo está?", en: "Good evening! How are you?" },
        { who: "Tú", es: "Bien, gracias. ¿Y usted?", en: "Fine, thanks. And you?" },
        { who: "Mesera", es: "Muy bien, gracias. ¿Qué va a querer?", en: "Very well, thanks. What will you have?" },
        { who: "Tú", es: "Me da tres tacos de pastor, por favor. Con todo.", en: "Can I have three pastor tacos, please. With everything." },
        { who: "Mesera", es: "¿Y de tomar?", en: "And to drink?" },
        { who: "Tú", es: "Un refresco, por favor.", en: "A soda, please." },
        { who: "Mesera", es: "¿Para comer aquí o para llevar?", en: "For here or to go?" },
        { who: "Tú", es: "Para comer aquí.", en: "For here." },
        { who: "Tú", es: "Perdón. La cuenta, por favor.", en: "Excuse me. The check, please." },
        { who: "Mesera", es: "Aquí tiene la cuenta.", en: "Here is the check." },
        { who: "Tú", es: "Muchas gracias. ¡Hasta luego!", en: "Thank you very much. See you later!" },
        { who: "Mesera", es: "De nada. ¡Adiós!", en: "You're welcome. Goodbye!" }
      ]
    },
    quiz: [
      { type: "mc", prompt: "It is 8 PM and you walk into a restaurant. How do you greet the server?", choices: ["Buenas noches.", "Buenos días.", "Buenas tardes.", "Hasta mañana."], answer: "Buenas noches.", explain: "After dark, buenas noches works as hello and goodbye." },
      { type: "type", prompt: "Type the Spanish for how much does it cost? (no need for the question marks)", answer: "¿cuánto cuesta?", explain: "¿Cuánto cuesta? Watch the accent on cuánto." },
      { type: "listen", prompt: "Listen and choose what you hear.", say: "para llevar", choices: ["para llevar", "para comer aquí", "por favor", "perdón"], answer: "para llevar" },
      { type: "mc", prompt: "The server says: Son catorce pesos. How much do you pay?", choices: ["14 pesos", "4 pesos", "40 pesos", "15 pesos"], answer: "14 pesos", explain: "Catorce is fourteen." },
      { type: "match", prompt: "Match across the week.", pairs: [["mucho gusto", "nice to meet you"], ["de nada", "you're welcome"], ["la cuenta", "the check / the bill"], ["sin", "without"]] }
    ],
    video: "allGreetings"
  },

  /* ================= WEEK 2: Getting around ================= */

  /* ---------------- Day 8 ---------------- */
  {
    id: 8, week: 2, type: "lesson",
    title: "Understanding and being understood",
    goal: "Say when you do not understand, ask someone to slow down or repeat, and ask how to say a word.",
    warmup: "Review any cards that are due. Then order out loud: Me da dos tacos, por favor.",
    words: [
      { id: "l8-si", es: "sí", en: "yes", say: "SEE", note: "With an accent it means yes. Without it, si means if.", example: { es: "Sí, gracias.", en: "Yes, thanks." }, hook: "sí: SEE, I see, yes." },
      { id: "l8-no", es: "no", en: "no / not", say: "NOH", example: { es: "No, gracias.", en: "No, thanks." }, hook: "Same as English, said short: NOH." },
      { id: "l8-no-entiendo", es: "no entiendo", en: "I don't understand", say: "noh ehn-tee-EHN-doh", example: { es: "Perdón, no entiendo.", en: "Sorry, I don't understand." }, hook: "entiendo sounds like intend: I don't get what you intend." },
      { id: "l8-mas-despacio", es: "más despacio", en: "slower", say: "MAHS dehs-PAH-see-oh", example: { es: "Más despacio, por favor.", en: "Slower, please." }, hook: "despacio: give me more space between words." },
      { id: "l8-otra-vez", es: "otra vez", en: "again / one more time", say: "OH-trah BEHS", example: { es: "Otra vez, por favor.", en: "One more time, please." }, hook: "otra is other: another time." },
      { id: "l8-puede-repetir", es: "¿puede repetir?", en: "can you repeat? (polite)", say: "PWEH-deh reh-peh-TEER", example: { es: "¿Puede repetir, por favor?", en: "Can you repeat, please?" }, hook: "repetir sounds like repeat." },
      { id: "l8-como-se-dice", es: "¿cómo se dice ___?", en: "how do you say ___?", say: "KOH-moh seh DEE-seh", speak: "¿Cómo se dice?", note: "Add the English word: ¿Cómo se dice fork?", example: { es: "¿Cómo se dice fork en español?", en: "How do you say fork in Spanish?" }, hook: "dice sounds like dictate: how is it dictated?" },
      { id: "l8-habla-ingles", es: "¿habla inglés?", en: "do you speak English? (polite)", say: "AH-blah een-GLEHS", note: "The h in habla is silent.", example: { es: "Perdón, ¿habla inglés?", en: "Excuse me, do you speak English?" }, hook: "habla sounds like blah blah: talking." },
      { id: "l8-no-se", es: "no sé", en: "I don't know", say: "noh SEH", note: "The accent on sé matters: sé means I know.", example: { es: "Lo siento, no sé.", en: "Sorry, I don't know." }, hook: "no sé: no say, I have nothing to say." }
    ],
    grammar: {
      title: "Make it negative: put no before the verb",
      body: [
        "To make a sentence negative, put no right before the verb. There is no extra word like don't.",
        "To answer a question with no, you often say no twice: No, no entiendo."
      ],
      examples: [
        { es: "Entiendo.", en: "I understand." },
        { es: "No entiendo.", en: "I don't understand." },
        { es: "No, no sé.", en: "No, I don't know." }
      ]
    },
    dialogue: {
      title: "Asking for help on the street",
      lines: [
        { who: "Señor", es: "Buenas tardes. ¿Busca algo?", en: "Good afternoon. Are you looking for something?" },
        { who: "Tú", es: "Perdón, no entiendo. Más despacio, por favor.", en: "Sorry, I don't understand. Slower, please." },
        { who: "Señor", es: "¿Busca... algo?", en: "Are you looking... for something?" },
        { who: "Tú", es: "Ah, sí. ¿Habla inglés?", en: "Oh, yes. Do you speak English?" },
        { who: "Señor", es: "No, lo siento.", en: "No, sorry." },
        { who: "Tú", es: "No hay problema. ¿Cómo se dice bathroom?", en: "No problem. How do you say bathroom?" },
        { who: "Señor", es: "Se dice el baño.", en: "You say el baño." },
        { who: "Tú", es: "¡Gracias!", en: "Thanks!" }
      ]
    },
    quiz: [
      { type: "mc", prompt: "A server speaks too fast for you. What do you say?", choices: ["Más despacio, por favor.", "Otra vez no.", "No sé.", "Sí, gracias."], answer: "Más despacio, por favor.", explain: "Más despacio means slower." },
      { type: "type", prompt: "Type the Spanish for I don't understand.", answer: "no entiendo", explain: "No goes before the verb: no entiendo." },
      { type: "mc", prompt: "You want to know the Spanish word for fork. What do you ask?", choices: ["¿Cómo se dice fork?", "¿Habla fork?", "¿Dónde está fork?", "¿Cuánto cuesta fork?"], answer: "¿Cómo se dice fork?", explain: "¿Cómo se dice ___? means how do you say ___?" },
      { type: "mc", prompt: "Make it negative: Entiendo.", choices: ["No entiendo.", "Entiendo no.", "Nada entiendo.", "Entiendo, no."], answer: "No entiendo.", explain: "Put no right before the verb." },
      { type: "listen", prompt: "Listen and choose what you hear.", say: "otra vez", choices: ["otra vez", "no sé", "más despacio", "¿habla inglés?"], answer: "otra vez" },
      { type: "match", prompt: "Match each phrase.", pairs: [["sí", "yes"], ["no sé", "I don't know"], ["otra vez", "again / one more time"], ["más despacio", "slower"]] }
    ]
  },

  /* ---------------- Day 9 ---------------- */
  {
    id: 9, week: 2, type: "lesson",
    title: "Directions 1",
    goal: "Ask where something is and understand left, right and straight ahead.",
    warmup: "Review any cards that are due. Then say out loud: No entiendo. Más despacio, por favor.",
    words: [
      { id: "l9-donde-esta", es: "¿dónde está ___?", en: "where is ___?", say: "DOHN-deh ehs-TAH", speak: "¿Dónde está el baño?", example: { es: "¿Dónde está el hotel?", en: "Where is the hotel?" }, hook: "dónde: DOHN-deh, where did it go? Where is it?" },
      { id: "l9-el-bano", es: "el baño", en: "the bathroom / restroom", say: "ehl BAH-nyoh", note: "ñ sounds like the ny in canyon.", example: { es: "Perdón, ¿dónde está el baño?", en: "Excuse me, where is the restroom?" }, hook: "baño sounds like bath: the bathroom." },
      { id: "l9-el-hotel", es: "el hotel", en: "the hotel", say: "ehl oh-TEHL", note: "The h is silent.", example: { es: "El hotel está a la derecha.", en: "The hotel is on the right." }, hook: "Same word, silent h: oh-TEHL." },
      { id: "l9-la-calle", es: "la calle", en: "the street", say: "lah KAH-yeh", note: "ll sounds like y.", example: { es: "Cruce la calle.", en: "Cross the street." }, hook: "KAH-yeh: you call a cab from la calle." },
      { id: "l9-a-la-derecha", es: "a la derecha", en: "to the right / on the right", say: "ah lah deh-REH-chah", example: { es: "El baño está a la derecha.", en: "The restroom is on the right." }, hook: "derecha sounds like direct: your right hand is direct." },
      { id: "l9-a-la-izquierda", es: "a la izquierda", en: "to the left / on the left", say: "ah lah ees-kee-EHR-dah", example: { es: "Está a la izquierda.", en: "It's on the left." }, hook: "izquierda is the longer, harder word, like writing with your left hand." },
      { id: "l9-todo-derecho", es: "todo derecho", en: "straight ahead", say: "TOH-doh deh-REH-choh", note: "derecho (straight) is not derecha (right).", example: { es: "Siga todo derecho.", en: "Keep going straight ahead." }, hook: "derecho ends in o: go straight on, like an O-ne way road." },
      { id: "l9-la-esquina", es: "la esquina", en: "the corner", say: "lah ehs-KEE-nah", example: { es: "Está en la esquina.", en: "It's on the corner." }, hook: "esquina: the corner where you escape the street." },
      { id: "l9-la-cuadra", es: "la cuadra", en: "the block (city block)", say: "lah KWAH-drah", note: "Used across Latin America to count blocks.", example: { es: "Está a dos cuadras.", en: "It's two blocks away." }, hook: "cuadra sounds like quadrant: a square block." }
    ],
    grammar: {
      title: "el vs la: the",
      body: [
        "Spanish has two words for the. Use el with masculine nouns and la with feminine nouns, just like un and una.",
        "For more than one, el becomes los and la becomes las."
      ],
      examples: [
        { es: "el baño, el hotel", en: "the bathroom, the hotel" },
        { es: "la calle, la esquina", en: "the street, the corner" },
        { es: "los baños, las calles", en: "the bathrooms, the streets" }
      ]
    },
    dialogue: {
      title: "In a restaurant, then outside",
      lines: [
        { who: "Tú", es: "Perdón, ¿dónde está el baño?", en: "Excuse me, where is the restroom?" },
        { who: "Mesera", es: "Todo derecho y a la izquierda.", en: "Straight ahead and on the left." },
        { who: "Tú", es: "¿A la izquierda?", en: "On the left?" },
        { who: "Mesera", es: "Sí, a la izquierda.", en: "Yes, on the left." },
        { who: "Tú", es: "Gracias. ¿Y dónde está el hotel Sol?", en: "Thanks. And where is the Hotel Sol?" },
        { who: "Mesera", es: "Está a dos cuadras, en la esquina.", en: "It's two blocks away, on the corner." },
        { who: "Tú", es: "¿A la derecha o a la izquierda?", en: "To the right or to the left?" },
        { who: "Mesera", es: "A la derecha.", en: "To the right." },
        { who: "Tú", es: "¡Muchas gracias!", en: "Thank you very much!" }
      ]
    },
    quiz: [
      { type: "mc", prompt: "You need the restroom in a restaurant. What do you ask?", choices: ["¿Dónde está el baño?", "¿Cuánto cuesta el baño?", "¿Cómo te llamas?", "La cuenta, por favor."], answer: "¿Dónde está el baño?", explain: "¿Dónde está ___? means where is ___?" },
      { type: "mc", prompt: "Someone tells you: a la izquierda. Which way do you go?", choices: ["Left", "Right", "Straight ahead", "Back"], answer: "Left", explain: "A la izquierda means to the left." },
      { type: "mc", prompt: "Choose the right word: ___ calle", choices: ["la", "el"], answer: "la", explain: "Calle is feminine: la calle." },
      { type: "type", prompt: "Type the Spanish for the street.", answer: "la calle", accept: ["calle"], explain: "La calle: lah KAH-yeh." },
      { type: "listen", prompt: "Listen and choose what you hear.", say: "todo derecho", choices: ["todo derecho", "a la derecha", "a la izquierda", "la esquina"], answer: "todo derecho" },
      { type: "match", prompt: "Match the directions.", pairs: [["a la derecha", "to the right / on the right"], ["a la izquierda", "to the left / on the left"], ["la esquina", "the corner"], ["todo derecho", "straight ahead"]] }
    ]
  },

  /* ---------------- Day 10 ---------------- */
  {
    id: 10, week: 2, type: "lesson",
    title: "Places in town",
    goal: "Name common places in town and say if they are near or far, here or there.",
    warmup: "Review any cards that are due. Then ask out loud: ¿Dónde está el baño?",
    words: [
      { id: "l10-el-banco", es: "el banco", en: "the bank", say: "ehl BAHN-koh", example: { es: "El banco está cerca.", en: "The bank is nearby." }, hook: "banco looks like bank." },
      { id: "l10-la-farmacia", es: "la farmacia", en: "the pharmacy", say: "lah fahr-MAH-see-ah", example: { es: "¿Hay una farmacia cerca?", en: "Is there a pharmacy nearby?" }, hook: "farmacia sounds like pharmacy." },
      { id: "l10-el-supermercado", es: "el supermercado", en: "the supermarket", say: "ehl soo-pehr-mehr-KAH-doh", example: { es: "El supermercado está lejos.", en: "The supermarket is far." }, hook: "super plus mercado (market): supermarket." },
      { id: "l10-la-gasolinera", es: "la gasolinera", en: "the gas station", say: "lah gah-soh-lee-NEH-rah", example: { es: "La gasolinera está en la esquina.", en: "The gas station is on the corner." }, hook: "gasolina (gasoline) plus era: where gasoline is." },
      { id: "l10-el-cajero", es: "el cajero", en: "the ATM", say: "ehl kah-HEH-roh", note: "Also means cashier. The ATM is el cajero automático.", example: { es: "¿Dónde hay un cajero?", en: "Where is there an ATM?" }, hook: "cajero sounds like cash-ero: the cash machine." },
      { id: "l10-cerca", es: "cerca", en: "near / nearby", say: "SEHR-kah", example: { es: "Está muy cerca.", en: "It's very close." }, hook: "cerca sounds like circle: it's in your circle, close by." },
      { id: "l10-lejos", es: "lejos", en: "far", say: "LEH-hohs", note: "The j sounds like a strong h.", example: { es: "¿Está lejos?", en: "Is it far?" }, hook: "lejos: your legs hurt, it's far." },
      { id: "l10-aqui", es: "aquí", en: "here", say: "ah-KEE", example: { es: "El baño está aquí.", en: "The restroom is here." }, hook: "ah-KEE: the KEY is here." },
      { id: "l10-alli", es: "allí", en: "there", say: "ah-YEE", note: "In Mexico allá (ah-YAH) is also very common for over there.", example: { es: "La farmacia está allí.", en: "The pharmacy is there." }, hook: "allí: ah-YEE, over there, yee-haw!" }
    ],
    grammar: {
      title: "Use está for where something is",
      body: [
        "To say where something is, use está: El banco está cerca. This is the same está as in ¿Dónde está?",
        "Bonus: hay (said like eye) means there is or there are: ¿Hay una farmacia cerca?"
      ],
      examples: [
        { es: "El banco está cerca.", en: "The bank is nearby." },
        { es: "La farmacia está allí.", en: "The pharmacy is there." },
        { es: "¿Hay un cajero aquí?", en: "Is there an ATM here?" }
      ]
    },
    dialogue: {
      title: "Finding a pharmacy",
      lines: [
        { who: "Tú", es: "Perdón, ¿hay una farmacia cerca?", en: "Excuse me, is there a pharmacy nearby?" },
        { who: "Señor", es: "Sí, está allí, en la esquina.", en: "Yes, it's there, on the corner." },
        { who: "Tú", es: "¿Y un cajero?", en: "And an ATM?" },
        { who: "Señor", es: "El banco está a tres cuadras.", en: "The bank is three blocks away." },
        { who: "Tú", es: "¿Está lejos?", en: "Is it far?" },
        { who: "Señor", es: "No, está cerca.", en: "No, it's close." },
        { who: "Tú", es: "Muchas gracias.", en: "Thank you very much." },
        { who: "Señor", es: "De nada.", en: "You're welcome." }
      ]
    },
    quiz: [
      { type: "mc", prompt: "What does lejos mean?", choices: ["far", "near", "here", "there"], answer: "far", explain: "Lejos means far. Cerca means near." },
      { type: "mc", prompt: "Which sentence says the pharmacy is nearby?", choices: ["La farmacia está cerca.", "La farmacia es cerca.", "La farmacia cerca está no.", "La farmacia lejos."], answer: "La farmacia está cerca.", explain: "Use está for where something is." },
      { type: "type", prompt: "Type the Spanish for the gas station.", answer: "la gasolinera", accept: ["gasolinera"], explain: "La gasolinera." },
      { type: "listen", prompt: "Listen and choose what you hear.", say: "el supermercado", choices: ["el supermercado", "el banco", "la farmacia", "el cajero"], answer: "el supermercado" },
      { type: "mc", prompt: "Someone points at the floor next to you and says aquí. What does it mean?", choices: ["here", "there", "far", "left"], answer: "here", explain: "Aquí means here." },
      { type: "match", prompt: "Match the places.", pairs: [["el banco", "the bank"], ["la farmacia", "the pharmacy"], ["cerca", "near / nearby"], ["allí", "there"]] }
    ]
  },

  /* ---------------- Day 11 ---------------- */
  {
    id: 11, week: 2, type: "lesson",
    title: "Days of the week",
    goal: "Say the days of the week, what day it is today and plan for a day.",
    warmup: "Review any cards that are due. Then ask out loud: ¿Hay una farmacia cerca?",
    words: [
      { id: "l11-lunes", es: "lunes", en: "Monday", say: "LOO-nehs", example: { es: "Hoy es lunes.", en: "Today is Monday." }, hook: "lunes comes from luna, the moon: Moon day, Monday." },
      { id: "l11-martes", es: "martes", en: "Tuesday", say: "MAHR-tehs", example: { es: "El martes voy al banco.", en: "On Tuesday I'm going to the bank." }, hook: "martes comes from Mars, the planet." },
      { id: "l11-miercoles", es: "miércoles", en: "Wednesday", say: "mee-EHR-koh-lehs", example: { es: "Es miércoles.", en: "It's Wednesday." }, hook: "miércoles comes from Mercury." },
      { id: "l11-jueves", es: "jueves", en: "Thursday", say: "HWEH-behs", example: { es: "El jueves no trabajo.", en: "On Thursday I don't work." }, hook: "jueves comes from Jove, another name for Jupiter." },
      { id: "l11-viernes", es: "viernes", en: "Friday", say: "bee-EHR-nehs", example: { es: "¡Por fin es viernes!", en: "Finally, it's Friday!" }, hook: "viernes comes from Venus." },
      { id: "l11-sabado", es: "sábado", en: "Saturday", say: "SAH-bah-doh", example: { es: "El sábado voy al mercado.", en: "On Saturday I'm going to the market." }, hook: "sábado sounds like Sabbath." },
      { id: "l11-domingo", es: "domingo", en: "Sunday", say: "doh-MEEN-goh", example: { es: "Los domingos como con mi familia.", en: "On Sundays I eat with my family." }, hook: "domingo comes from Dominus, Lord: the Lord's day." },
      { id: "l11-hoy", es: "hoy", en: "today", say: "OY", note: "The h is silent.", example: { es: "Hoy es sábado.", en: "Today is Saturday." }, hook: "hoy sounds like oy: oy, today already?" },
      { id: "l11-manana", es: "mañana", en: "tomorrow", say: "mah-NYAH-nah", note: "la mañana means the morning.", example: { es: "Mañana es domingo.", en: "Tomorrow is Sunday." }, hook: "You know it from hasta mañana." },
      { id: "l11-que-dia-es-hoy", es: "¿qué día es hoy?", en: "what day is it today?", say: "keh DEE-ah ehs OY", example: { es: "¿Qué día es hoy? Es jueves.", en: "What day is it today? It's Thursday." }, hook: "día like daily: what day?" }
    ],
    grammar: {
      title: "Days are lowercase; el lunes means on Monday",
      body: [
        "In Spanish the days of the week are not capitalized: lunes, martes.",
        "Use el before a day to say on that day: el lunes means on Monday. Use los for every week: los lunes means on Mondays. Do not add en."
      ],
      examples: [
        { es: "Hoy es lunes.", en: "Today is Monday." },
        { es: "El sábado voy al mercado.", en: "On Saturday I'm going to the market." },
        { es: "Los domingos como con mi familia.", en: "On Sundays I eat with my family." }
      ]
    },
    dialogue: {
      title: "Making a plan",
      lines: [
        { who: "Amigo", es: "¿Qué día es hoy?", en: "What day is it today?" },
        { who: "Tú", es: "Hoy es jueves.", en: "Today is Thursday." },
        { who: "Amigo", es: "¿Jueves? ¡Mañana es viernes!", en: "Thursday? Tomorrow is Friday!" },
        { who: "Tú", es: "Sí. ¿Vamos al mercado el sábado?", en: "Yes. Shall we go to the market on Saturday?" },
        { who: "Amigo", es: "El sábado no puedo. ¿El domingo?", en: "I can't on Saturday. Sunday?" },
        { who: "Tú", es: "Sí, el domingo. ¡Hasta el domingo!", en: "Yes, Sunday. See you Sunday!" }
      ]
    },
    quiz: [
      { type: "mc", prompt: "What day is viernes?", choices: ["Friday", "Thursday", "Wednesday", "Saturday"], answer: "Friday", explain: "Viernes is Friday." },
      { type: "type", prompt: "Type the Spanish for today.", answer: "hoy", explain: "Hoy: the h is silent." },
      { type: "mc", prompt: "How do you say on Monday?", choices: ["el lunes", "en lunes", "en el Lunes", "lunes en"], answer: "el lunes", explain: "Use el before the day, and no capital letter." },
      { type: "listen", prompt: "Listen and choose the day you hear.", say: "miércoles", choices: ["miércoles", "martes", "jueves", "domingo"], answer: "miércoles" },
      { type: "mc", prompt: "Hoy es martes. Mañana es...", choices: ["miércoles", "lunes", "jueves", "sábado"], answer: "miércoles", explain: "After Tuesday comes Wednesday: miércoles." },
      { type: "match", prompt: "Match the days.", pairs: [["lunes", "Monday"], ["jueves", "Thursday"], ["sábado", "Saturday"], ["domingo", "Sunday"]] }
    ]
  },

  /* ---------------- Day 12 ---------------- */
  {
    id: 12, week: 2, type: "lesson",
    title: "Telling time",
    goal: "Ask and tell the time, and ask what time something happens.",
    warmup: "Review any cards that are due. Then say what day it is today in Spanish.",
    words: [
      { id: "l12-que-hora-es", es: "¿qué hora es?", en: "what time is it?", say: "keh OH-rah ehs", note: "The h in hora is silent.", example: { es: "Perdón, ¿qué hora es?", en: "Excuse me, what time is it?" }, hook: "hora sounds like hour." },
      { id: "l12-es-la-una", es: "es la una", en: "it's one o'clock", say: "ehs lah OO-nah", example: { es: "Es la una y media.", en: "It's half past one." }, hook: "Only one hour is singular: es la una." },
      { id: "l12-son-las-dos", es: "son las dos", en: "it's two o'clock", say: "sohn lahs DOHS", note: "Use son las for every hour except one.", example: { es: "Son las dos de la tarde.", en: "It's two in the afternoon." }, hook: "son las: plural hours, plural verb." },
      { id: "l12-y-media", es: "y media", en: "half past (:30)", say: "ee MEH-dee-ah", example: { es: "Son las tres y media.", en: "It's three thirty." }, hook: "media sounds like median: the middle of the hour." },
      { id: "l12-y-cuarto", es: "y cuarto", en: "quarter past (:15)", say: "ee KWAHR-toh", example: { es: "Son las cuatro y cuarto.", en: "It's four fifteen." }, hook: "cuarto sounds like quarter." },
      { id: "l12-de-la-manana", es: "de la mañana", en: "in the morning (a.m.)", say: "deh lah mah-NYAH-nah", example: { es: "Son las ocho de la mañana.", en: "It's eight in the morning." }, hook: "la mañana is the morning; mañana alone is tomorrow." },
      { id: "l12-de-la-tarde", es: "de la tarde", en: "in the afternoon (p.m.)", say: "deh lah TAHR-deh", example: { es: "Son las cuatro de la tarde.", en: "It's four in the afternoon." }, hook: "Like buenas tardes: afternoon." },
      { id: "l12-de-la-noche", es: "de la noche", en: "at night (p.m.)", say: "deh lah NOH-cheh", example: { es: "Son las diez de la noche.", en: "It's ten at night." }, hook: "Like buenas noches: night." },
      { id: "l12-a-que-hora", es: "¿a qué hora?", en: "at what time?", say: "ah keh OH-rah", example: { es: "¿A qué hora abre?", en: "What time does it open?" }, hook: "a means at: at what hour?" }
    ],
    grammar: {
      title: "Es la una vs Son las...",
      body: [
        "For one o'clock, say Es la una, because one is singular. For every other hour, say Son las plus the number: Son las dos, Son las diez.",
        "To say at a time, use a la or a las: a la una, a las nueve."
      ],
      examples: [
        { es: "Es la una y media.", en: "It's half past one." },
        { es: "Son las siete y cuarto.", en: "It's seven fifteen." },
        { es: "La tienda abre a las nueve.", en: "The store opens at nine." }
      ]
    },
    dialogue: {
      title: "Before the bank closes",
      lines: [
        { who: "Tú", es: "Perdón, ¿qué hora es?", en: "Excuse me, what time is it?" },
        { who: "Señora", es: "Son las once y media.", en: "It's eleven thirty." },
        { who: "Tú", es: "Gracias. ¿A qué hora cierra el banco?", en: "Thanks. What time does the bank close?" },
        { who: "Señora", es: "Cierra a las cuatro de la tarde.", en: "It closes at four in the afternoon." },
        { who: "Tú", es: "¿A las cuatro?", en: "At four?" },
        { who: "Señora", es: "Sí, a las cuatro.", en: "Yes, at four." },
        { who: "Tú", es: "Muchas gracias.", en: "Thank you very much." }
      ]
    },
    quiz: [
      { type: "mc", prompt: "It is 1:00. What do you say?", choices: ["Es la una.", "Son las una.", "Es las uno.", "Son la una."], answer: "Es la una.", explain: "One o'clock is singular: Es la una." },
      { type: "mc", prompt: "Someone says: Son las tres y media. What time is it?", choices: ["3:30", "3:15", "2:30", "3:00"], answer: "3:30", explain: "Y media means half past." },
      { type: "type", prompt: "Type the Spanish for what time is it?", answer: "¿qué hora es?", explain: "¿Qué hora es? Watch the accent on qué." },
      { type: "listen", prompt: "Listen and choose what you hear.", say: "y cuarto", choices: ["y cuarto", "y media", "de la tarde", "es la una"], answer: "y cuarto" },
      { type: "mc", prompt: "How do you say it's 10 p.m.?", choices: ["Son las diez de la noche.", "Son las diez de la mañana.", "Es la diez de la noche.", "Son las dos de la noche."], answer: "Son las diez de la noche.", explain: "De la noche is for the night hours." },
      { type: "match", prompt: "Match the time words.", pairs: [["y media", "half past (:30)"], ["y cuarto", "quarter past (:15)"], ["de la mañana", "in the morning (a.m.)"], ["¿a qué hora?", "at what time?"]] }
    ]
  },

  /* ---------------- Day 13 ---------------- */
  {
    id: 13, week: 2, type: "lesson",
    title: "Numbers 30 to 100",
    goal: "Count by tens to one hundred and understand bigger prices.",
    warmup: "Review any cards that are due. Then ask out loud: ¿Qué hora es? and answer it.",
    words: [
      { id: "l13-treinta", es: "treinta", en: "thirty", say: "TRAYN-tah", example: { es: "Cuesta treinta pesos.", en: "It costs thirty pesos." }, hook: "treinta starts like tres: three tens." },
      { id: "l13-cuarenta", es: "cuarenta", en: "forty", say: "kwah-REHN-tah", example: { es: "Son cuarenta y cinco minutos.", en: "It's forty-five minutes." }, hook: "cuarenta starts like cuatro: four tens." },
      { id: "l13-cincuenta", es: "cincuenta", en: "fifty", say: "seen-KWEHN-tah", example: { es: "Un billete de cincuenta.", en: "A fifty bill." }, hook: "cincuenta starts like cinco: five tens." },
      { id: "l13-sesenta", es: "sesenta", en: "sixty", say: "seh-SEHN-tah", example: { es: "Sesenta minutos son una hora.", en: "Sixty minutes are one hour." }, hook: "sesenta has the s of seis: six tens." },
      { id: "l13-setenta", es: "setenta", en: "seventy", say: "seh-TEHN-tah", example: { es: "Son setenta pesos.", en: "That's seventy pesos." }, hook: "setenta has the t of siete: seven tens." },
      { id: "l13-ochenta", es: "ochenta", en: "eighty", say: "oh-CHEHN-tah", example: { es: "Ochenta y ocho.", en: "Eighty-eight." }, hook: "ochenta starts like ocho: eight tens." },
      { id: "l13-noventa", es: "noventa", en: "ninety", say: "noh-BEHN-tah", example: { es: "Noventa y nueve centavos.", en: "Ninety-nine cents." }, hook: "noventa starts like nueve and November: nine tens." },
      { id: "l13-cien", es: "cien", en: "one hundred", say: "see-EHN", example: { es: "Cien por ciento.", en: "One hundred percent." }, hook: "cien sounds like cent: a hundred cents in a dollar." },
      { id: "l13-cuanto-es", es: "¿cuánto es?", en: "how much is it? (the total)", say: "KWAHN-toh EHS", example: { es: "¿Cuánto es todo?", en: "How much is everything?" }, hook: "Like ¿cuánto cuesta?, but for the total." }
    ],
    grammar: {
      title: "Tens + y + ones",
      body: [
        "From 31 to 99, say the ten, then y, then the one: treinta y cinco (35), cuarenta y dos (42).",
        "21 to 29 are written as one word: veintiuno, veintidós, veinticinco. Cien is exactly 100; from 101 it becomes ciento: ciento uno."
      ],
      examples: [
        { es: "treinta y cinco", en: "35" },
        { es: "noventa y nueve", en: "99" },
        { es: "veinticinco", en: "25" }
      ]
    },
    dialogue: {
      title: "Paying at the market",
      lines: [
        { who: "Tú", es: "¿Cuánto cuesta el mango?", en: "How much is the mango?" },
        { who: "Vendedor", es: "Treinta pesos el kilo.", en: "Thirty pesos a kilo." },
        { who: "Tú", es: "Un kilo, por favor. Y dos aguacates.", en: "One kilo, please. And two avocados." },
        { who: "Vendedor", es: "Los dos aguacates, cuarenta.", en: "The two avocados, forty." },
        { who: "Tú", es: "¿Cuánto es todo?", en: "How much is everything?" },
        { who: "Vendedor", es: "Son setenta pesos.", en: "That's seventy pesos." },
        { who: "Tú", es: "Aquí tiene cien.", en: "Here's a hundred." },
        { who: "Vendedor", es: "Y su cambio: treinta pesos. Gracias.", en: "And your change: thirty pesos. Thanks." }
      ]
    },
    quiz: [
      { type: "mc", prompt: "What number is cincuenta?", choices: ["50", "15", "5", "500"], answer: "50", explain: "Cincuenta is fifty." },
      { type: "mc", prompt: "Which one is 70?", choices: ["setenta", "sesenta", "siete", "diecisiete"], answer: "setenta", explain: "Setenta (70) has the t of siete. Sesenta (60) has the s of seis." },
      { type: "type", prompt: "Type the Spanish for one hundred.", answer: "cien", explain: "Cien: see-EHN." },
      { type: "mc", prompt: "How do you say 45?", choices: ["cuarenta y cinco", "cuatro y cinco", "cuarentacinco", "cincuenta y cuatro"], answer: "cuarenta y cinco", explain: "Ten, then y, then the one." },
      { type: "listen", prompt: "Listen and choose the number you hear.", say: "noventa", choices: ["noventa", "nueve", "ochenta", "setenta"], answer: "noventa" },
      { type: "match", prompt: "Match the numbers.", pairs: [["treinta", "thirty"], ["cuarenta", "forty"], ["ochenta", "eighty"], ["cien", "one hundred"]] }
    ]
  },

  /* ---------------- Day 14: Week 2 review ---------------- */
  {
    id: 14, week: 2, type: "review",
    title: "Week 2 review",
    goal: "No new words today. Review the week, put it all together in a role play, and check your progress.",
    warmup: "Review the week's words. Words you missed come first.",
    canDo: [
      "Say you do not understand and ask someone to slow down or repeat.",
      "Ask where a place is and follow left, right and straight ahead.",
      "Name places in town and say if they are near or far.",
      "Say the days of the week, tell the time and count to one hundred."
    ],
    dialogue: {
      title: "Role play: finding the pharmacy before it closes",
      lines: [
        { who: "Tú", es: "Perdón, ¿habla inglés?", en: "Excuse me, do you speak English?" },
        { who: "Señora", es: "No, lo siento.", en: "No, sorry." },
        { who: "Tú", es: "No hay problema. ¿Dónde está la farmacia?", en: "No problem. Where is the pharmacy?" },
        { who: "Señora", es: "Está cerca. Todo derecho, dos cuadras, y a la derecha.", en: "It's close. Straight ahead, two blocks, and to the right." },
        { who: "Tú", es: "Más despacio, por favor.", en: "Slower, please." },
        { who: "Señora", es: "Todo derecho... dos cuadras... y a la derecha.", en: "Straight ahead... two blocks... and to the right." },
        { who: "Tú", es: "¡Gracias! ¿A qué hora cierra?", en: "Thanks! What time does it close?" },
        { who: "Señora", es: "Cierra a las nueve de la noche.", en: "It closes at nine at night." },
        { who: "Tú", es: "¿Y qué hora es?", en: "And what time is it?" },
        { who: "Señora", es: "Son las ocho y media.", en: "It's eight thirty." },
        { who: "Tú", es: "¡Muchas gracias! Hasta luego.", en: "Thank you very much! See you later." },
        { who: "Señora", es: "De nada. ¡Adiós!", en: "You're welcome. Goodbye!" }
      ]
    },
    quiz: [
      { type: "mc", prompt: "Someone gives you directions too fast. What do you say?", choices: ["Más despacio, por favor.", "Todo derecho.", "Es la una.", "Mucho gusto."], answer: "Más despacio, por favor.", explain: "Más despacio means slower." },
      { type: "type", prompt: "Type the Spanish for where is the bathroom?", answer: "¿dónde está el baño?", explain: "¿Dónde está el baño? Watch the accents on dónde and está, and the ñ." },
      { type: "listen", prompt: "Listen and choose what you hear.", say: "a la izquierda", choices: ["a la izquierda", "a la derecha", "todo derecho", "la esquina"], answer: "a la izquierda" },
      { type: "mc", prompt: "Son las siete y cuarto. What time is it?", choices: ["7:15", "7:30", "6:15", "7:45"], answer: "7:15", explain: "Y cuarto means quarter past." },
      { type: "match", prompt: "Match across the week.", pairs: [["lunes", "Monday"], ["cerca", "near / nearby"], ["lejos", "far"], ["cien", "one hundred"]] }
    ]
  }
];

