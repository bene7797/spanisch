function mnemonicEntry(title, hook, body) {
  return { title, hook: hook || "", body };
}

const MNEMONICS_ES = {
  ser: mnemonicEntry(
    "ser – was etwas IST",
    "DOCTOR",
    "ser beschreibt das Wesen, nicht den Moment: Description, Occupation, Characteristic, Time, Origin, Relationship.\n\nSoy médico. Es martes. Somos amigos. Soy de Berlín."
  ),
  estar: mnemonicEntry(
    "estar – Zustand und Ort",
    "PLACE",
    "estar = Position, Location, Action, Condition, Emotion.\n\nMerkformel: Wie du dich fühlst und wo du bist – estar.\n\nEstoy cansado. Madrid está en España."
  ),
  hay: mnemonicEntry(
    "hay – es gibt",
    "",
    "hay (von haber) sagt, dass etwas existiert – oft unbestimmt: Hay un banco. ¿Hay pan?\n\nestar sagt, wo etwas Bestimmtes ist: El banco está allí.\n\nKurz: hay = Existenz, estar = genauer Ort."
  ),
  tener: mnemonicEntry(
    "tener statt „sein“",
    "",
    "Alter, Hunger, Durst, Kälte und Hitze laufen über tener, nicht über ser/estar:\n\ntengo 20 años, tengo hambre, tengo sed, tengo frío, tengo calor.\n\nDeutsch denkt „ich bin hungrig“ – Spanisch „ich habe Hunger“."
  ),
  ir: mnemonicEntry(
    "ir + a = nahe Zukunft",
    "",
    "voy a + Infinitiv = ich werde gleich / ich bin dabei: Voy a comer.\n\nImperativ tú ist unregelmäßig: ve (geh!). Zusammen mit den anderen Kurzbefehlen: Vin Diesel has ten weapons."
  ),
  hacer: mnemonicEntry(
    "hacer – Wetter und Taten",
    "",
    "Wetter geht mit hacer, nicht mit sein: hace calor, hace frío, hace sol, hace viento.\n\nTú-Imperativ: haz. Merkvers: Ven, Di, Sal, Haz, Ten, Ve, Pon, Sé."
  ),
  saber: mnemonicEntry(
    "saber ≠ conocer",
    "",
    "saber = Fakten, Infos, Fähigkeiten: Sé la respuesta. Sé nadar.\n\nconocer = Personen, Orte, Werke kennen: Conozco a Ana. Conozco Madrid."
  ),
  conocer: mnemonicEntry(
    "conocer ≠ saber",
    "",
    "conocer = kennen / kennenlernen (Menschen, Städte, Bücher).\n\nsaber = wissen oder etwas können (Fakt oder Fähigkeit)."
  ),
  gustar: mnemonicEntry(
    "gustar wie „gefallen“",
    "",
    "Nicht „ich mag Pizza“, sondern „die Pizza gefällt mir“: Me gusta la pizza.\n\nDas, was gefällt, ist das Subjekt: me gusta (eine Sache), me gustan (mehrere)."
  ),
  encantar: mnemonicEntry(
    "encantar wie gustar",
    "",
    "Wie gustar, nur stärker: me encanta = das gefällt mir sehr / ich liebe das.\n\nme encanta el café, me encantan los gatos."
  ),
  doler: mnemonicEntry(
    "doler wie gustar",
    "",
    "Schmerz ist wie gefallen gebaut: Me duele la cabeza = der Kopf schmerzt mir.\n\nme duele (eine Stelle), me duelen (mehrere, z. B. los pies)."
  ),
  por: mnemonicEntry(
    "por – Ursache, Weg, Tausch",
    "",
    "por = warum / wodurch / wie lange / Austausch: Gracias por todo. Paso por el parque. Por dos euros.\n\npara = wozu / für wen / Frist: Esto es para ti. Estudio para aprender."
  ),
  para: mnemonicEntry(
    "para – Ziel und Empfänger",
    "",
    "para zeigt Richtung, Zweck, Empfänger, Deadline: para ti, para mañana, para ser médico.\n\npor bleibt bei Grund, Weg, Dauer, Preis."
  ),
  "por favor": mnemonicEntry(
    "por favor",
    "",
    "Bitte läuft über por (Weg/Grund der Bitte), nicht über para.\n\nUn café, por favor."
  ),
  "por supuesto": mnemonicEntry(
    "por supuesto",
    "",
    "por supuesto = natürlich / selbstverständlich – wieder por, weil es „auf diesem Weg / aus diesem Grund klar“ ist."
  ),
  "por eso": mnemonicEntry(
    "por eso = deshalb",
    "",
    "eso ist die Ursache, deshalb por: Estoy cansado, por eso me quedo."
  ),
  "por qué": mnemonicEntry(
    "por qué / porque",
    "",
    "Frage: ¿por qué? (getrennt, Akzent).\n\nAntwort: porque (zusammengeschrieben, ohne Akzent) = weil."
  ),
  adiós: mnemonicEntry(
    "adiós ≈ a Dios",
    "",
    "wörtlich „zu Gott“ – wie älteres „behüt dich Gott“. Deshalb das Akzent-ó: a-DIÓS."
  ),
  agua: mnemonicEntry(
    "el agua, aber feminin",
    "",
    "agua ist weiblich, bekommt im Singular trotzdem el, weil betontes á am Wortanfang sonst mit la zusammenstößt: el agua fría.\n\nPlural wieder weiblich: las aguas."
  ),
  día: mnemonicEntry(
    "el día – männlich trotz -a",
    "",
    "Wörter auf -a sind oft feminin, aber el día, el mapa, el problema, el tema, el idioma sind männlich (viele davon aus dem Griechischen)."
  ),
  problema: mnemonicEntry(
    "el problema",
    "",
    "Griechische Wörter auf -ma sind meist männlich: el problema, el tema, el sistema, el idioma, el clima."
  ),
  mapa: mnemonicEntry(
    "el mapa",
    "",
    "Trotz -a männlich: el mapa. Merke mit el día und el problema."
  ),
  mano: mnemonicEntry(
    "la mano – feminin trotz -o",
    "",
    "Die berühmte Ausnahme: la mano, las manos. Dazu Kurzformen wie la foto, la moto, la radio (von fotografía, motocicleta, radiodifusión)."
  ),
  foto: mnemonicEntry(
    "la foto",
    "",
    "Kurz für la fotografía → bleibt feminin: la foto. Ebenso la moto, la radio."
  ),
  moto: mnemonicEntry(
    "la moto",
    "",
    "Kurz für la motocicleta → feminin, obwohl es auf -o endet."
  ),
  radio: mnemonicEntry(
    "la radio",
    "",
    "Kurz für la radiodifusión → feminin: la radio."
  ),
  bueno: mnemonicEntry(
    "bueno mit ser oder estar",
    "",
    "ser bueno = gut (Charakter). estar bueno = lecker / attraktiv.\n\nDasselbe Muster: ser listo = klug, estar listo = fertig."
  ),
  malo: mnemonicEntry(
    "malo mit ser oder estar",
    "",
    "ser malo = schlecht (als Mensch/Ding). estar malo = krank / verdorben."
  ),
  listo: mnemonicEntry(
    "listo: klug oder fertig",
    "",
    "ser listo = schlau. estar listo = bereit / fertig.\n\n¿Estás listo? = Bist du soweit?"
  ),
  lunes: mnemonicEntry(
    "Wochentage = Planeten",
    "Luna · Mars · Merkur · Jupiter · Venus · Sabbat · Dominus",
    "lunes Mond, martes Mars, miércoles Merkur, jueves Jupiter, viernes Venus, sábado Sabbat, domingo vom lateinischen dominicus (Tag des Herrn).\n\nImmer männlich: el lunes. „Am Montag“ = el lunes, „montags“ = los lunes."
  ),
  martes: mnemonicEntry("martes – Mars", "", "Dienstag vom Kriegsgott Mars. Alle Wochentage sind männlich: el martes."),
  miércoles: mnemonicEntry("miércoles – Merkur", "", "Mittwoch von Mercurius. el miércoles, kleingeschrieben."),
  jueves: mnemonicEntry("jueves – Jupiter", "", "Donnerstag von Iovis (Jupiter). el jueves."),
  viernes: mnemonicEntry("viernes – Venus", "", "Freitag von Venus. el viernes."),
  sábado: mnemonicEntry("sábado – Sabbat", "", "Samstag vom Sabbat. Plural: los sábados."),
  domingo: mnemonicEntry("domingo – Tag des Herrn", "", "Sonntag von dominicus. el domingo, los domingos."),
  venir: mnemonicEntry(
    "unregelmäßiger tú-Befehl",
    "Vin Diesel has ten weapons",
    "Die acht kurzen tú-Imperative: ven, di, sal, haz, ten, ve, pon, sé.\n\nvenir → ven."
  ),
  decir: mnemonicEntry(
    "unregelmäßiger tú-Befehl",
    "Vin Diesel has ten weapons",
    "ven, di, sal, haz, ten, ve, pon, sé.\n\ndecir → di."
  ),
  salir: mnemonicEntry(
    "unregelmäßiger tú-Befehl",
    "Vin Diesel has ten weapons",
    "ven, di, sal, haz, ten, ve, pon, sé.\n\nsalir → sal."
  ),
  poner: mnemonicEntry(
    "unregelmäßiger tú-Befehl",
    "Vin Diesel has ten weapons",
    "ven, di, sal, haz, ten, ve, pon, sé.\n\nponer → pon."
  ),
  llamarse: mnemonicEntry(
    "llamarse = sich rufen",
    "",
    "Me llamo Ana = ich rufe mich Ana. Deshalb Reflexiv: me, te, se llamo/llamas/llama."
  ),
  hambre: mnemonicEntry(
    "tener hambre",
    "",
    "Hunger, Durst, Kälte: tener, nicht sein. Tengo hambre – wörtlich „ich habe Hunger“."
  ),
  "estoy bien": mnemonicEntry(
    "estar für Befinden",
    "PLACE / Gefühl",
    "Wie geht’s? → estar. Estoy bien, estás cansado, estamos en casa."
  ),
  "cómo estás": mnemonicEntry(
    "¿Cómo estás?",
    "",
    "Befinden fragt mit estar, nicht ser. ¿Cómo estás? – Wie geht’s dir (gerade)?"
  ),
  "no sé": mnemonicEntry(
    "no sé",
    "",
    "sé von saber (ich weiß). Ohne Akzent wäre se ein Pronomen. Deshalb: No sé."
  )
};

const MNEMONICS_IT = {
  essere: mnemonicEntry(
    "essere – Wesen",
    "",
    "Wie spanisch ser: Identität, Beruf, Herkunft, Uhrzeit, Charakter.\n\nSono insegnante. È martedì. Siamo amici."
  ),
  stare: mnemonicEntry(
    "stare – Zustand und Ort",
    "",
    "Wie spanisch estar: Befinden und Ort. Come stai? Sto bene. Sto a Roma.\n\nMerkformel: Wie du dich fühlst und wo du bist – stare."
  ),
  "c'è": mnemonicEntry(
    "c'è / ci sono – es gibt",
    "",
    "c'è = es gibt (Singular), ci sono = es gibt (Plural). Existenz, nicht genauer Standort.\n\nC'è un problema. Ci sono due pizze."
  ),
  "c'è / ci sono": mnemonicEntry(
    "c'è / ci sono – es gibt",
    "",
    "c'è Singular, ci sono Plural. Wie spanisch hay, aber Italienisch unterscheidet die Zahl."
  ),
  avere: mnemonicEntry(
    "avere statt „sein“",
    "",
    "Alter, Hunger, Durst, Kälte mit avere: ho 20 anni, ho fame, ho sete, ho freddo.\n\nDeutsch „ich bin hungrig“ – Italienisch „ich habe Hunger“."
  ),
  piacere: mnemonicEntry(
    "piacere wie „gefallen“",
    "",
    "Mi piace il caffè = der Kaffee gefällt mir. Das, was gefällt, ist das Subjekt.\n\nmi piace (eine Sache), mi piacciono (mehrere)."
  ),
  per: mnemonicEntry(
    "per – für / um zu",
    "",
    "per deckt oft spanisch para ab: Questo è per te. Studio per imparare.\n\nWeg und Grund sind oft da: Grazie di tutto. Passo dal parco."
  ),
  "per / da": mnemonicEntry(
    "per und da",
    "",
    "per = Ziel, Zweck, Empfänger: Questo è per te.\n\nda = Herkunft oder Weg: vengo da Roma, passo dal parco. Danke oft mit di: Grazie di tutto."
  ),
  fare: mnemonicEntry(
    "fare – Wetter und Taten",
    "",
    "Wetter mit fare: fa caldo, fa freddo, fa bel tempo.\n\nChe fai? = Was machst du?"
  ),
  andare: mnemonicEntry(
    "andare – nahe Zukunft",
    "",
    "vado a + Infinitiv = ich werde gleich: Vado a mangiare.\n\nPräsens io ist unregelmäßig: vado (nicht *ando)."
  ),
  sapere: mnemonicEntry(
    "sapere ≠ conoscere",
    "",
    "sapere = Fakten und Fähigkeiten: Non so. So nuotare.\n\nconoscere = Menschen und Orte kennen."
  ),
  conoscere: mnemonicEntry(
    "conoscere ≠ sapere",
    "",
    "conoscere = kennen (Personen, Städte). sapere = wissen / können."
  ),
  acqua: mnemonicEntry(
    "l'acqua",
    "",
    "weiblich, Artikel wird elidiert: l'acqua. Plural: le acque."
  ),
  lunedì: mnemonicEntry(
    "Wochentage = Planeten",
    "Luna · Marte · Mercurio · Giove · Venere · Sabbat · Dominus",
    "lunedì Mond, martedì Mars, mercoledì Merkur, giovedì Jupiter (Giove), venerdì Venus, sabato Sabbat, domenica vom Herrn – und domenica ist feminin."
  ),
  martedì: mnemonicEntry("martedì – Marte", "", "Dienstag vom Mars. Wochentage außer domenica sind männlich."),
  mercoledì: mnemonicEntry("mercoledì – Mercurio", "", "Mittwoch von Merkur."),
  giovedì: mnemonicEntry("giovedì – Giove", "", "Donnerstag von Jupiter (Giove)."),
  venerdì: mnemonicEntry("venerdì – Venere", "", "Freitag von Venus."),
  sabato: mnemonicEntry("sabato – Sabbat", "", "Samstag vom Sabbat."),
  domenica: mnemonicEntry(
    "domenica ist feminin",
    "",
    "Sonntag von dominica (Tag des Herrn) – als einziges Femininum unter den Wochentagen: la domenica."
  ),
  fame: mnemonicEntry(
    "avere fame",
    "",
    "Hunger mit avere: Ho fame. Ebenso ho sete, ho freddo, ho sonno."
  ),
  chiamarsi: mnemonicEntry(
    "chiamarsi = sich rufen",
    "",
    "Mi chiamo Marta = ich rufe mich Marta. Deshalb Reflexivpronomen mi/ti/si."
  )
};

function mnemonicKeys(item) {
  if (!item) return [];
  const raw = String(item.es || "")
    .toLowerCase()
    .trim()
    .replace(/[¿?¡!.,;:()"]/g, "")
    .replace(/\s+/g, " ");
  const lemma = raw
    .replace(/^(el|la|los|las|il|lo|i|gli|le|un|una|uno)\s+/i, "")
    .replace(/^l'/, "")
    .split(" / ")[0]
    .trim();
  const first = lemma.split(/\s+/)[0] || "";
  const keys = [item.id, raw, lemma, first];
  return keys.filter((k, i) => k && keys.indexOf(k) === i);
}

function mnemonicFor(item) {
  if (!item) return null;
  const table = (item.lang || "es") === "it" ? MNEMONICS_IT : MNEMONICS_ES;
  const keys = mnemonicKeys(item);
  for (let i = 0; i < keys.length; i++) {
    if (table[keys[i]]) return table[keys[i]];
  }
  return null;
}
