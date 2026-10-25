/*
  Spanish in 15: course outline (28 days, 4 weeks).
  Every day of the path is listed here. A day becomes playable when
  data/lessons.js has a full entry with the same id.
  Visible text rule: no em dashes, no en dashes, no ampersands.
*/
window.COURSE = {
  title: "Spanish in 15",
  weeks: [
    { week: 1, title: "Survival basics" },
    { week: 2, title: "Getting around" },
    { week: 3, title: "People and daily life" },
    { week: 4, title: "Shopping and travel" }
  ],
  days: [
    { id: 1,  week: 1, type: "lesson", title: "Greetings and introductions", preview: "hola, buenos días, buenas tardes, buenas noches, me llamo, mucho gusto", grammar: "tú vs usted" },
    { id: 2,  week: 1, type: "lesson", title: "Goodbyes and polite words", preview: "adiós, hasta luego, por favor, gracias, de nada, perdón", grammar: "¿...? and ¡...!" },
    { id: 3,  week: 1, type: "lesson", title: "Numbers 0 to 7", preview: "cero, uno, dos, tres, cuatro, cinco, seis, siete", grammar: "uno becomes un before a noun" },
    { id: 4,  week: 1, type: "lesson", title: "Numbers 8 to 20 and prices", preview: "ocho, nueve, diez, quince, veinte, ¿cuánto cuesta?", grammar: "Cuesta ___ pesos" },
    { id: 5,  week: 1, type: "lesson", title: "Ordering food 1", preview: "quiero, un taco, una torta, agua, la cuenta, para llevar", grammar: "un vs una" },
    { id: 6,  week: 1, type: "lesson", title: "Ordering food 2", preview: "Me da ___, por favor. tacos de pastor, salsa, con, sin", grammar: "Plurals: -s and -es" },
    { id: 7,  week: 1, type: "review", title: "Week 1 review", preview: "Review the week, a role play at a taquería, and a check quiz", grammar: "No new grammar" },

    { id: 8,  week: 2, type: "lesson", title: "Understanding and being understood", preview: "sí, no, no entiendo, más despacio, otra vez, ¿cómo se dice...?, ¿habla inglés?", grammar: "Put no before the verb: No entiendo." },
    { id: 9,  week: 2, type: "lesson", title: "Directions 1", preview: "¿dónde está...?, el baño, el hotel, la calle, a la derecha, a la izquierda, todo derecho", grammar: "el vs la (the)" },
    { id: 10, week: 2, type: "lesson", title: "Places in town", preview: "el banco, la farmacia, el supermercado, la gasolinera, cerca, lejos, aquí, allí", grammar: "Use está for where something is" },
    { id: 11, week: 2, type: "lesson", title: "Days of the week", preview: "lunes, martes, miércoles, jueves, viernes, sábado, domingo, hoy", grammar: "Days are lowercase; el lunes means on Monday" },
    { id: 12, week: 2, type: "lesson", title: "Telling time", preview: "¿qué hora es?, es la una, son las dos, y media, y cuarto, de la mañana, de la tarde", grammar: "Es la una vs Son las..." },
    { id: 13, week: 2, type: "lesson", title: "Numbers 30 to 100", preview: "treinta, cuarenta, cincuenta, sesenta, setenta, ochenta, noventa, cien", grammar: "treinta y cinco (tens + y + ones)" },
    { id: 14, week: 2, type: "review", title: "Week 2 review", preview: "Review the week, a role play, and a check quiz", grammar: "No new grammar" },

    { id: 15, week: 3, type: "lesson", title: "Family", preview: "la familia, el papá, la mamá, el hermano, la hermana, el hijo, la hija", grammar: "mi vs mis" },
    { id: 16, week: 3, type: "lesson", title: "Where you are from and what you do", preview: "soy, eres, es, ¿de dónde eres?, Estados Unidos, México", grammar: "Ser for who you are and where you are from" },
    { id: 17, week: 3, type: "lesson", title: "How you feel", preview: "estoy, estás, está, bien, mal, cansado, ocupado, contento", grammar: "Estar for how you feel and where you are" },
    { id: 18, week: 3, type: "lesson", title: "Likes", preview: "me gusta, me gustan, no me gusta, el béisbol, la comida, la música, el café", grammar: "gusta for one thing, gustan for more" },
    { id: 19, week: 3, type: "lesson", title: "Describing people and things", preview: "alto, bajo, simpático, joven, grande, pequeño, bueno, malo", grammar: "Adjectives match: alto, alta" },
    { id: 20, week: 3, type: "lesson", title: "Weather and small talk", preview: "¿qué tal?, hace calor, hace frío, hace sol, llueve, hace buen tiempo", grammar: "Hace for most weather" },
    { id: 21, week: 3, type: "review", title: "Week 3 review", preview: "Review the week, a role play, and a check quiz", grammar: "No new grammar" },

    { id: 22, week: 4, type: "lesson", title: "Shopping", preview: "la tienda, ¿tiene...?, caro, barato, solo estoy mirando, me lo llevo", grammar: "¿Tiene...? is the polite usted form" },
    { id: 23, week: 4, type: "lesson", title: "Colors and sizes", preview: "rojo, azul, negro, blanco, verde, grande, mediano, chico", grammar: "The adjective comes after the noun" },
    { id: 24, week: 4, type: "lesson", title: "Paying", preview: "efectivo, tarjeta, el cambio, el recibo, pesos, dólares, ¿aceptan tarjeta?", grammar: "¿Puedo pagar con ___?" },
    { id: 25, week: 4, type: "lesson", title: "Travel and transport", preview: "el aeropuerto, el boleto, el autobús, el camión, el taxi, la salida, la llegada", grammar: "Voy a + place, and a + el = al" },
    { id: 26, week: 4, type: "lesson", title: "Hotel", preview: "una habitación, la reservación, la llave, una noche, el desayuno", grammar: "Tengo = I have" },
    { id: 27, week: 4, type: "lesson", title: "Getting help", preview: "ayuda, necesito, el médico, la policía, estoy perdido, ¿me puede ayudar?", grammar: "Necesito + noun or verb" },
    { id: 28, week: 4, type: "review", title: "Week 4 review and next steps", preview: "Review the month, a role play, and a 4-week check", grammar: "No new grammar" }
  ]
};
