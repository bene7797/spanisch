const GRAMMAR = [
  {
    id: "ausnahmen",
    lv: 1,
    featured: true,
    title: "Ausnahmen",
    summary: "Geschlecht, Stammwechsel, unregelmäßige Formen – alles, was nicht der Regel folgt.",
    lessons: [
      {
        title: "Nomen: das Geschlecht trügt",
        body: "Oft maskulin: -o   Oft feminin: -a\n\nTrotzdem maskulin:\nel día, el mapa, el planeta\nel problema, el tema, el sistema, el idioma\n\nTrotzdem feminin:\nla mano, la radio, la foto, la moto\n\nel agua ist feminin, nimmt aber el, damit nicht zwei a-Laute zusammenstoßen: el agua fría."
      },
      {
        title: "yo-Formen mit -go und Stammwechsel",
        body: "Diese yo-Formen merken:\ntener → tengo\nhacer → hago\nvenir → vengo\nponer → pongo\nsalir → salgo\ndecir → digo\ntraer → traigo\nir → voy\nser → soy\n\ne→ie / o→ue in allen Formen außer nosotros/vosotros:\nquerer → quiero, aber queremos\npoder → puedo, aber podemos"
      },
      {
        title: "Adjektive, die aus der Reihe tanzen",
        body: "z → c vor e:\nfeliz → felices\nluz → luces\n\nKurzformen vor maskulinem Singular:\nbueno → buen amigo\nmalo → mal día\ngrande → gran problema / gran idea\n\nAdjektive auf -e oder Konsonant ändern nur den Numerus:\ninteresante → interesantes\nfácil → fáciles"
      },
      {
        title: "Pronomen-Fallen",
        body: "le/les + lo/la/los/las wird zu se:\nSe lo doy.  (nicht: le lo doy)\n\ngustar steht vom Ding her:\nMe gusta el café.\nMe gustan los gatos.\n\nusted nimmt die 3. Person:\n¿Cómo se llama usted?\n¿Cómo está usted?"
      },
      {
        title: "Zeiten: die unregelmäßigen Kerle",
        body: "Pretérito: ser und ir sind identisch\nfui, fuiste, fue, fuimos, fuisteis, fueron\n\nhacer → hice, hiciste, hizo (c→z)\ntener → tuve   estar → estuve\n\nImperfecto hat nur drei Unregelmäßige:\nir → iba    ser → era    ver → veía\n\nviajamos gilt für Präsens und Indefinido.\n\nFutur-Stämme: tendré, podré, haré, diré, saldré, habré\nSubjuntivo: ir → vaya, ser → sea, estar → esté, tener → tenga"
      }
    ],
    cards: [
      { id:"g_ex_1", prompt:"___ día", de:"___ Tag", hint:"Achtung: -a, aber…", answer:"el", options:["el","la","los","una"], why:"día ist maskulin, obwohl es auf -a endet." },
      { id:"g_ex_2", prompt:"___ problema", de:"___ Problem", hint:"griechisch -ma", answer:"el", options:["el","la","una","las"], why:"Wörter auf -ma (problema, tema, sistema) sind maskulin." },
      { id:"g_ex_3", prompt:"___ mano", de:"___ Hand", hint:"Achtung: -o, aber…", answer:"la", options:["el","la","los","un"], why:"mano ist feminin: la mano, las manos." },
      { id:"g_ex_4", prompt:"___ agua está fría.", de:"___ Wasser ist kalt.", hint:"feminin, aber el", answer:"El", options:["El","La","Los","Una"], why:"agua ist feminin, steht aber mit el." },
      { id:"g_ex_5", prompt:"___ foto", de:"___ Foto", hint:"Kurzform von fotografía", answer:"la", options:["el","la","los","un"], why:"la foto, la radio, la moto – feminin trotz -o." },
      { id:"g_ex_6", prompt:"tener · yo", de:"haben · ich", hint:"nicht tieno", answer:"tengo", options:["tengo","tieno","teneo","tene"], why:"yo tengo – g-Einschub, nicht tieno." },
      { id:"g_ex_7", prompt:"hacer · yo", de:"machen · ich", hint:"nicht haco", answer:"hago", options:["hago","haco","haceo","hizo"], why:"yo hago." },
      { id:"g_ex_8", prompt:"ir · yo", de:"gehen · ich", hint:"komplett irregulär", answer:"voy", options:["voy","yo","iro","fui"], why:"ir: voy, vas, va, vamos, vais, van." },
      { id:"g_ex_9", prompt:"poder · nosotros", de:"können · wir", hint:"kein Stammwechsel", answer:"podemos", options:["puedemos","podemos","pudimos","podamos"], why:"nosotros/vosotros ohne o→ue." },
      { id:"g_ex_10", prompt:"querer · yo", de:"wollen · ich", hint:"e→ie", answer:"quiero", options:["quero","quiero","quería","quereré"], why:"e→ie: quiero." },
      { id:"g_ex_11", prompt:"venir · yo", de:"kommen · ich", hint:"wie tener", answer:"vengo", options:["veno","vengo","viene","vengó"], why:"yo vengo, analog zu tengo." },
      { id:"g_ex_12", prompt:"chicas ___ (feliz)", de:"Mädchen ___ (glücklich)", hint:"z→c", answer:"felices", options:["felizs","felices","felizas","felizes"], why:"z wird vor e zu c: felices." },
      { id:"g_ex_13", prompt:"___ amigo (gut, direkt davor)", de:"___ Freund (gut)", hint:"Kurzform", answer:"buen", options:["bueno","buen","buena","buenos"], why:"bueno → buen vor maskulinem Singular." },
      { id:"g_ex_14", prompt:"una ___ idea (grande)", de:"eine ___ Idee (groß)", hint:"Kurzform auch feminin", answer:"gran", options:["grande","gran","granda","grandes"], why:"grande → gran vor Singular, auch feminin." },
      { id:"g_ex_15", prompt:"Le doy el libro. → ___ lo doy.", de:"Ich gebe ihm/ihr das Buch. → Ich gebe ___ es.", hint:"le + lo", answer:"Se", options:["Se","Le","Lo","La"], why:"le/les + lo/la/los/las → se lo / se la." },
      { id:"g_ex_16", prompt:"Me ___ los gatos.", de:"Mir ___ die Katzen.", hint:"Plural", answer:"gustan", options:["gusta","gustan","gusto","gustas"], why:"Mehrere Dinge → gustan." },
      { id:"g_ex_17", prompt:"¿Cómo ___ llama usted?", de:"Wie ___ Sie?", hint:"höflich = 3. Person", answer:"se", options:["te","me","se","os"], why:"usted steht mit se llama, nicht te." },
      { id:"g_ex_18", prompt:"ir · yo (Indefinido)", de:"gehen · ich (gestern, abgeschlossen)", hint:"gleich wie ser", answer:"fui", options:["fui","iba","voy","fue"], why:"ser und ir teilen sich fui, fuiste, fue…" },
      { id:"g_ex_19", prompt:"hacer · él (Indefinido)", de:"machen · er (abgeschlossen)", hint:"c→z", answer:"hizo", options:["hice","hizo","hacía","hació"], why:"3. Person: hizo, nicht hació." },
      { id:"g_ex_20", prompt:"ser · yo (Imperfecto)", de:"sein · ich (früher / Gewohnheit)", hint:"eines von nur dreien", answer:"era", options:["fui","era","soy","iba"], why:"Imperfecto unregelmäßig nur: era, iba, veía." },
      { id:"g_ex_21", prompt:"ver · nosotros (Imperfecto)", de:"sehen · wir (früher)", hint:"behält das e", answer:"veíamos", options:["víamos","veíamos","vimos","veemos"], why:"ver → veía, veíamos – das e bleibt." },
      { id:"g_ex_22", prompt:"tener · yo (Futur)", de:"haben · ich (Zukunft)", hint:"nicht teneré", answer:"tendré", options:["teneré","tendré","tendría","tengo"], why:"tener → tendr- + é." },
      { id:"g_ex_23", prompt:"hacer · yo (Futur)", de:"machen · ich (Zukunft)", hint:"nicht haceré", answer:"haré", options:["haceré","haré","hago","hice"], why:"hacer → haré." },
      { id:"g_ex_24", prompt:"ir · tú (Subjuntivo)", de:"gehen · du (Wunsch/Zweifel)", hint:"nicht vas", answer:"vayas", options:["vas","vayas","irás","fueras"], why:"ir → vaya, vayas, vaya…" },
      { id:"g_ex_25", prompt:"estar · yo (Subjuntivo)", de:"sein (Ort/Zustand) · ich", hint:"Akzent", answer:"esté", options:["estoy","esté","estuve","estaba"], why:"estar → esté, estés, esté." },
      { id:"g_ex_26", prompt:"El año pasado ___ a España. (viajar, nosotros)", de:"Letztes Jahr ___ wir nach Spanien.", hint:"gleiche Form wie Präsens", answer:"viajamos", options:["viajábamos","viajamos","viajemos","viajaríamos"], why:"viajamos ist Präsens und Indefinido – die Zeitangabe entscheidet." }
    ]
  },
  {
    id: "artikel",
    lv: 1,
    title: "Artikel: el, la, los, las",
    summary: "Bestimmte und unbestimmte Artikel und das Geschlecht der Nomen.",
    lessons: [
      {
        title: "Die bestimmten Artikel",
        body: "Spanische Nomen sind maskulin oder feminin.\n\nel  → der (maskulin, Singular)\nla  → die (feminin, Singular)\nlos → die (maskulin, Plural)\nlas → die (feminin, Plural)\n\nBeispiele:\nel libro, la casa, los libros, las casas."
      },
      {
        title: "Unbestimmte Artikel",
        body: "un  → ein (maskulin)\nuna → eine (feminin)\nunos / unas → einige, ein paar\n\nUn café, una cerveza, unos amigos, unas ideas."
      },
      {
        title: "Merkregeln",
        body: "Oft maskulin: -o  (el niño, el libro)\nOft feminin:  -a  (la niña, la mesa)\n\nAusnahmen merken:\nel día, el mapa, el problema, el tema\nla mano, la foto, la radio, el agua (feminin, aber el wegen a-)"
      }
    ],
    cards: [
      { id:"g_art_1", prompt:"___ casa", de:"___ Haus", hint:"die (f.)", answer:"la", options:["el","la","los","las"], why:"casa endet auf -a und ist feminin." },
      { id:"g_art_2", prompt:"___ libro", de:"___ Buch", hint:"das / der (m.)", answer:"el", options:["el","la","los","las"], why:"libro ist maskulin." },
      { id:"g_art_3", prompt:"___ amigos", de:"___ Freunde", hint:"die (m. Plural)", answer:"los", options:["el","la","los","las"], why:"Plural maskulin → los." },
      { id:"g_art_4", prompt:"___ mesas", de:"___ Tische", hint:"die (f. Plural)", answer:"las", options:["el","la","los","las"], why:"Plural feminin → las." },
      { id:"g_art_5", prompt:"___ problema", de:"___ Problem", hint:"Achtung: Ausnahme!", answer:"el", options:["el","la","un","una"], why:"Wörter auf -ma griechischen Ursprungs sind oft maskulin: el problema, el tema." },
      { id:"g_art_6", prompt:"___ mano", de:"___ Hand", hint:"Achtung: Ausnahme!", answer:"la", options:["el","la","los","un"], why:"mano ist feminin: la mano, las manos." },
      { id:"g_art_7", prompt:"___ día", de:"___ Tag", hint:"Achtung: Ausnahme!", answer:"el", options:["el","la","los","una"], why:"día ist maskulin, obwohl es auf -a endet." },
      { id:"g_art_8", prompt:"Ich möchte ___ café.", de:"Ich möchte ___ Kaffee.", hint:"unbestimmt, m.", answer:"un", options:["un","una","el","la"], why:"un = ein (maskulin)." },
      { id:"g_art_9", prompt:"___ agua está fría.", de:"___ Wasser ist kalt.", hint:"feminin, aber…", answer:"El", options:["El","La","Los","Una"], why:"agua ist feminin, nimmt aber el, damit nicht zwei a-Laute zusammenstoßen." },
      { id:"g_art_10", prompt:"Plural von el niño", de:"Plural von der Junge / das Kind", hint:"die Jungen", answer:"los niños", options:["las niños","los niños","los niño","las niñas"], why:"maskulin Plural: los + -os." }
    ]
  },
  {
    id: "pronomen",
    lv: 1,
    title: "Personalpronomen",
    summary: "yo, tú, él, ella, nosotros… und wann man sie weglässt.",
    lessons: [
      {
        title: "Die Formen",
        body: "yo        ich\ntú        du\nél / ella / usted     er / sie / Sie\nnosotros / nosotras   wir\nvosotros / vosotras   ihr (Spanien)\nellos / ellas / ustedes  sie / Sie (Plural)"
      },
      {
        title: "Oft weglassen",
        body: "Die Verbform zeigt die Person. Deshalb lässt man das Pronomen oft weg:\n\nHablo español.  = Ich spreche Spanisch.\n¿Hablas inglés? = Sprichst du Englisch?\n\nMan setzt es, um zu betonen oder Gegensätze zu zeigen:\nYo hablo español, ella habla francés."
      }
    ],
    cards: [
      { id:"g_pr_1", prompt:"yo = ?", de:"yo = ?", hint:"Pronomen", answer:"ich", options:["ich","du","er","wir"], why:"yo ist die 1. Person Singular." },
      { id:"g_pr_2", prompt:"tú = ?", de:"tú = ?", hint:"Pronomen", answer:"du", options:["Sie","du","ihr","wir"], why:"tú ist die informelle Anrede." },
      { id:"g_pr_3", prompt:"usted = ?", de:"usted = ?", hint:"höflich", answer:"Sie", options:["du","ihr","Sie","wir"], why:"usted ist höflich und steht mit der 3. Person (wie él/ella)." },
      { id:"g_pr_4", prompt:"nosotros = ?", de:"nosotros = ?", hint:"Pronomen", answer:"wir", options:["ihr","wir","sie","ich"], why:"nosotros / nosotras = wir." },
      { id:"g_pr_5", prompt:"vosotros wird vor allem verwendet in…", de:"vosotros wird vor allem verwendet in…", hint:"Land", answer:"Spanien", options:["Mexiko","Argentinien","Spanien","überall gleich"], why:"In Lateinamerika sagt man meist ustedes statt vosotros." },
      { id:"g_pr_6", prompt:"Welche Form passt zu usted?", de:"Welche Form passt zu Sie (höflich)?", hint:"Verbform", answer:"habla (3. Person)", options:["hablo","hablas","habla (3. Person)","habláis"], why:"usted nimmt immer die 3. Person Singular." },
      { id:"g_pr_7", prompt:"ellos / ellas = ?", de:"ellos / ellas = ?", hint:"Pronomen", answer:"sie (Plural)", options:["wir","ihr","sie (Plural)","sie (Singular)"], why:"ellos (m./gemischt), ellas (nur Frauen)." },
      { id:"g_pr_8", prompt:"„Hablo español.“ Wer spricht?", de:"„Ich spreche Spanisch.“ Wer spricht?", hint:"Pronomen oft weggelassen", answer:"yo", options:["tú","yo","él","nosotros"], why:"hablo ist eindeutig 1. Person Singular." }
    ]
  },
  {
    id: "presente-ar",
    lv: 1,
    title: "Präsens: regelmäßige -ar-Verben",
    summary: "hablar, trabajar, estudiar… Endungen im Presente.",
    lessons: [
      {
        title: "So wird konjugiert",
        body: "Stamm + Endung. Beispiel hablar (sprechen):\n\nyo hablo\ntú hablas\nél / ella / usted habla\nnosotros / as hablamos\nvosotros / as habláis\nellos / ellas / ustedes hablan"
      },
      {
        title: "Die Endungen merken",
        body: "-o\n-as\n-a\n-amos\n-áis\n-an\n\nGleiche Endungen bei trabajar, estudiar, cantar, comprar, viajar, cocinar…"
      },
      {
        title: "Tipp",
        body: "Die Endung verrät die Person. Deshalb reicht oft:\nTrabajo en Berlín.\n¿Hablas español?"
      }
    ],
    cards: [
      { id:"g_ar_1", prompt:"hablar · yo", de:"sprechen · ich", hint:"Präsens", answer:"hablo", options:["hablo","hablas","habla","hablamos"], why:"yo nimmt -o." },
      { id:"g_ar_2", prompt:"hablar · tú", de:"sprechen · du", hint:"Präsens", answer:"hablas", options:["hablo","hablas","habla","habláis"], why:"tú nimmt -as." },
      { id:"g_ar_3", prompt:"hablar · ella", de:"sprechen · sie", hint:"Präsens", answer:"habla", options:["hablas","habla","hablan","hablo"], why:"él/ella/usted → -a." },
      { id:"g_ar_4", prompt:"hablar · nosotros", de:"sprechen · wir", hint:"Präsens", answer:"hablamos", options:["hablamos","habláis","hablan","habla"], why:"nosotros → -amos." },
      { id:"g_ar_5", prompt:"hablar · vosotros", de:"sprechen · ihr", hint:"Präsens", answer:"habláis", options:["hablamos","habláis","hablan","hablas"], why:"vosotros → -áis." },
      { id:"g_ar_6", prompt:"hablar · ellos", de:"sprechen · sie (Plural)", hint:"Präsens", answer:"hablan", options:["habla","habláis","hablan","hablamos"], why:"ellos/ustedes → -an." },
      { id:"g_ar_7", prompt:"trabajar · yo", de:"arbeiten · ich", hint:"Präsens", answer:"trabajo", options:["trabajo","trabajas","trabaja","trabajamos"], why:"Stamm trabaj- + -o." },
      { id:"g_ar_8", prompt:"estudiar · nosotros", de:"lernen / studieren · wir", hint:"Präsens", answer:"estudiamos", options:["estudio","estudias","estudiamos","estudian"], why:"nosotros: estudiamos." },
      { id:"g_ar_9", prompt:"comprar · tú", de:"kaufen · du", hint:"Präsens", answer:"compras", options:["compro","compras","compra","compran"], why:"tú: compras." },
      { id:"g_ar_10", prompt:"viajar · ustedes", de:"reisen · Sie (Plural)", hint:"Präsens", answer:"viajan", options:["viaja","viajamos","viajáis","viajan"], why:"ustedes wie ellos: -an." }
    ]
  },
  {
    id: "presente-erir",
    lv: 1,
    title: "Präsens: regelmäßige -er / -ir",
    summary: "comer, beber, vivir, escribir.",
    lessons: [
      {
        title: "-er: comer",
        body: "yo como\ntú comes\nél / ella come\nnosotros comemos\nvosotros coméis\nellos comen"
      },
      {
        title: "-ir: vivir",
        body: "yo vivo\ntú vives\nél / ella vive\nnosotros vivimos\nvosotros vivís\nellos viven\n\nUnterschied zu -er nur bei nosotros und vosotros: -imos / -ís statt -emos / -éis."
      }
    ],
    cards: [
      { id:"g_er_1", prompt:"comer · yo", de:"essen · ich", hint:"Präsens", answer:"como", options:["como","comes","come","comemos"], why:"yo: -o, der Stamm verliert -er." },
      { id:"g_er_2", prompt:"comer · tú", de:"essen · du", hint:"Präsens", answer:"comes", options:["como","comes","come","coméis"], why:"tú: -es." },
      { id:"g_er_3", prompt:"comer · nosotros", de:"essen · wir", hint:"Präsens", answer:"comemos", options:["comemos","comimos","coméis","comen"], why:"-er → nosotros -emos." },
      { id:"g_er_4", prompt:"beber · ella", de:"trinken · sie", hint:"Präsens", answer:"bebe", options:["bebo","bebes","bebe","beben"], why:"él/ella: -e." },
      { id:"g_er_5", prompt:"vivir · yo", de:"leben / wohnen · ich", hint:"Präsens", answer:"vivo", options:["vivo","vives","vive","vivimos"], why:"yo: vivo." },
      { id:"g_er_6", prompt:"vivir · nosotros", de:"leben / wohnen · wir", hint:"Präsens", answer:"vivimos", options:["vivemos","vivimos","vivís","viven"], why:"-ir → nosotros -imos (nicht -emos)." },
      { id:"g_er_7", prompt:"vivir · vosotros", de:"leben / wohnen · ihr", hint:"Präsens", answer:"vivís", options:["vivéis","vivís","viven","vives"], why:"-ir → vosotros -ís." },
      { id:"g_er_8", prompt:"escribir · ellos", de:"schreiben · sie (Plural)", hint:"Präsens", answer:"escriben", options:["escribe","escribís","escriben","escribimos"], why:"ellos: -en." }
    ]
  },
  {
    id: "ser-estar",
    lv: 1,
    title: "ser vs. estar",
    summary: "Zwei Verben für „sein“ – Wesen gegen Zustand und Ort.",
    lessons: [
      {
        title: "ser – wer / was etwas ist",
        body: "Identität, Beruf, Herkunft, Eigenschaften, Zeit, Datum, Material:\n\nSoy Ana.\nEres médico.\nSomos de Berlín.\nEl libro es interesante.\nHoy es lunes.\nSon las tres."
      },
      {
        title: "estar – wie / wo etwas ist",
        body: "Ort, Befinden, vorübergehender Zustand, Verlaufsform:\n\nEstoy en casa.\n¿Cómo estás?\nEl café está caliente.\nEstamos cansados.\nEstá lloviendo."
      },
      {
        title: "Merksatz",
        body: "DOCTOR für ser:\nDescription, Occupation, Characteristic, Time, Origin, Relation\n\nPLACE für estar:\nPosition, Location, Action, Condition, Emotion"
      },
      {
        title: "Konjugation",
        body: "ser: soy, eres, es, somos, sois, son\nestar: estoy, estás, está, estamos, estáis, están"
      }
    ],
    cards: [
      { id:"g_se_1", prompt:"Yo ___ estudiante.", de:"Ich ___ Student/in.", hint:"Beruf / Identität", answer:"soy", options:["soy","estoy","es","estás"], why:"Beruf und Identität mit ser." },
      { id:"g_se_2", prompt:"Ella ___ en Madrid.", de:"Sie ___ in Madrid.", hint:"Ort", answer:"está", options:["es","está","son","somos"], why:"Ort immer mit estar." },
      { id:"g_se_3", prompt:"Hoy ___ lunes.", de:"Heute ___ Montag.", hint:"Wochentag", answer:"es", options:["es","está","soy","estoy"], why:"Datum und Wochentag mit ser." },
      { id:"g_se_4", prompt:"Nosotros ___ cansados.", de:"Wir ___ müde.", hint:"Zustand", answer:"estamos", options:["somos","estamos","son","están"], why:"vorübergehender Zustand mit estar." },
      { id:"g_se_5", prompt:"El café ___ caliente.", de:"Der Kaffee ___ heiß.", hint:"gerade jetzt", answer:"está", options:["es","está","son","soy"], why:"Temperatur als Zustand: estar." },
      { id:"g_se_6", prompt:"Ellos ___ de España.", de:"Sie ___ aus Spanien.", hint:"Herkunft", answer:"son", options:["están","son","sois","estamos"], why:"Herkunft mit ser (de + Ort)." },
      { id:"g_se_7", prompt:"¿Cómo ___ tú?", de:"Wie ___ du?", hint:"Befinden", answer:"estás", options:["eres","estás","es","soy"], why:"¿Cómo estás? = Wie geht’s dir?" },
      { id:"g_se_8", prompt:"La casa ___ grande.", de:"Das Haus ___ groß.", hint:"feste Eigenschaft", answer:"es", options:["es","está","son","estáis"], why:"charakteristische Eigenschaft mit ser." },
      { id:"g_se_9", prompt:"ser · yo", de:"sein (Wesen) · ich", hint:"Konjugation", answer:"soy", options:["soy","estoy","eres","es"], why:"yo soy." },
      { id:"g_se_10", prompt:"estar · nosotros", de:"sein (Ort/Zustand) · wir", hint:"Konjugation", answer:"estamos", options:["somos","estamos","están","sois"], why:"nosotros estamos." }
    ]
  },
  {
    id: "zahlen",
    lv: 1,
    title: "Zahlen 1–20 und Uhrzeit",
    summary: "Zählen, Preise und „¿Qué hora es?“",
    lessons: [
      {
        title: "1 bis 20",
        body: "1 uno   2 dos   3 tres   4 cuatro   5 cinco\n6 seis  7 siete  8 ocho   9 nueve   10 diez\n11 once 12 doce 13 trece 14 catorce 15 quince\n16 dieciséis 17 diecisiete 18 dieciocho\n19 diecinueve 20 veinte"
      },
      {
        title: "Uhrzeit",
        body: "¿Qué hora es?\nEs la una.          → 1 Uhr\nSon las dos.        → 2 Uhr\nSon las tres y diez.\nSon las cinco menos cuarto.  → 16:45 / 4:45\nMediodía = 12 Uhr mittags, medianoche = Mitternacht."
      }
    ],
    cards: [
      { id:"g_nu_1", prompt:"7 = ?", de:"7 = ?", hint:"Zahl", answer:"siete", options:["seis","siete","ocho","nueve"], why:"siete = sieben." },
      { id:"g_nu_2", prompt:"11 = ?", de:"11 = ?", hint:"Zahl", answer:"once", options:["diez","once","doce","trece"], why:"once = elf." },
      { id:"g_nu_3", prompt:"16 = ?", de:"16 = ?", hint:"Zahl", answer:"dieciséis", options:["dieciséis","diecisiete","quince","veinte"], why:"dieciséis = 10 + 6." },
      { id:"g_nu_4", prompt:"Es ___ una.", de:"Es ist ___ eins. (1 Uhr)", hint:"1 Uhr", answer:"la", options:["la","las","el","los"], why:"Nur 1 Uhr: Es la una. Sonst: Son las…" },
      { id:"g_nu_5", prompt:"___ las tres.", de:"___ drei Uhr.", hint:"3 Uhr", answer:"Son", options:["Es","Son","Está","Hay"], why:"Ab 2 Uhr: Son las…" },
      { id:"g_nu_6", prompt:"20 = ?", de:"20 = ?", hint:"Zahl", answer:"veinte", options:["doce","quince","veinte","treinta"], why:"veinte = zwanzig." }
    ]
  },
  {
    id: "irregular-presente",
    lv: 2,
    title: "Unregelmäßige Verben im Präsens",
    summary: "ser, estar, ir, tener, hacer, poder, querer, venir.",
    lessons: [
      {
        title: "Die Must-know-Verben",
        body: "ir: voy, vas, va, vamos, vais, van\ntener: tengo, tienes, tiene, tenemos, tenéis, tienen\nhacer: hago, haces, hace, hacemos, hacéis, hacen\npoder: puedo, puedes, puede, podemos, podéis, pueden\nquerer: quiero, quieres, quiere, queremos, queréis, quieren\nvenir: vengo, vienes, viene, venimos, venís, vienen"
      },
      {
        title: "e→ie und o→ue",
        body: "Viele Verben wechseln den Stammvokal in allen Formen außer nosotros/vosotros:\n\nquerer → quiero, quieres, quiere, queremos\npoder → puedo, puedes, puede, podemos\ntener → tienes, tiene (plus yo: tengo)"
      }
    ],
    cards: [
      { id:"g_irr_1", prompt:"ir · yo", de:"gehen · ich", hint:"Präsens", answer:"voy", options:["voy","voyo","fui","iba"], why:"ir ist komplett unregelmäßig: yo voy." },
      { id:"g_irr_2", prompt:"ir · nosotros", de:"gehen · wir", hint:"Präsens", answer:"vamos", options:["imos","vamos","vamosos","fuimos"], why:"nosotros vamos – auch: ¡vamos! = los!" },
      { id:"g_irr_3", prompt:"tener · yo", de:"haben · ich", hint:"Präsens", answer:"tengo", options:["tengo","tieno","teneo","teno"], why:"yo tengo (g-Einschub)." },
      { id:"g_irr_4", prompt:"tener · tú", de:"haben · du", hint:"Präsens", answer:"tienes", options:["tenes","tienes","tengas","tieneses"], why:"e→ie: tienes." },
      { id:"g_irr_5", prompt:"hacer · yo", de:"machen · ich", hint:"Präsens", answer:"hago", options:["haco","hago","haceo","hizo"], why:"yo hago." },
      { id:"g_irr_6", prompt:"poder · ella", de:"können · sie", hint:"Präsens", answer:"puede", options:["pode","puede","puda","pueda"], why:"o→ue: puede." },
      { id:"g_irr_7", prompt:"querer · yo", de:"wollen · ich", hint:"Präsens", answer:"quiero", options:["quero","quiero","queroo","quería"], why:"e→ie: quiero." },
      { id:"g_irr_8", prompt:"venir · yo", de:"kommen · ich", hint:"Präsens", answer:"vengo", options:["veno","vengo","viene","vengo"], why:"yo vengo, analog zu tengo." },
      { id:"g_irr_9", prompt:"poder · nosotros", de:"können · wir", hint:"kein Stammwechsel", answer:"podemos", options:["puedemos","podemos","pudimos","podamos"], why:"nosotros/vosotros ohne o→ue." },
      { id:"g_irr_10", prompt:"ir · ellos", de:"gehen · sie (Plural)", hint:"Präsens", answer:"van", options:["van","fueron","iban","vayen"], why:"ellos van." }
    ]
  },
  {
    id: "adjektive",
    lv: 2,
    title: "Adjektive: Angleichung",
    summary: "Adjektive richten sich nach Geschlecht und Zahl des Nomens.",
    lessons: [
      {
        title: "Die vier Formen",
        body: "bueno → buena → buenos → buenas\n\nel libro bueno\nla casa buena\nlos libros buenos\nlas casas buenas"
      },
      {
        title: "Auf -e oder Konsonant",
        body: "Nur Zahl ändert sich:\ninteresante → interesantes\nfácil → fáciles\nfeliz → felices\n\ngrand / grande: vor Singular-Nomen oft gran (un gran problema, una gran idea)."
      },
      {
        title: "Stellung",
        body: "Die meisten Adjektive stehen hinter dem Nomen:\nuna casa blanca, un coche rojo\n\nManche davor mit Bedeutungsnuance:\nun buen amigo, el primer día."
      }
    ],
    cards: [
      { id:"g_adj_1", prompt:"la casa ___ (blanco)", de:"das Haus ___ (weiß)", hint:"Angleichung", answer:"blanca", options:["blanco","blanca","blancos","blancas"], why:"feminin Singular: blanca." },
      { id:"g_adj_2", prompt:"los coches ___ (rojo)", de:"die Autos ___ (rot)", hint:"Angleichung", answer:"rojos", options:["rojo","roja","rojos","rojas"], why:"maskulin Plural: rojos." },
      { id:"g_adj_3", prompt:"las mesas ___ (pequeño)", de:"die Tische ___ (klein)", hint:"Angleichung", answer:"pequeñas", options:["pequeño","pequeña","pequeños","pequeñas"], why:"feminin Plural: pequeñas." },
      { id:"g_adj_4", prompt:"un libro ___ (interesante)", de:"ein Buch ___ (interessant)", hint:"-e Adjektiv", answer:"interesante", options:["interesanto","interesanta","interesante","interesantes"], why:"-e bleibt im Singular unverändert." },
      { id:"g_adj_5", prompt:"unas ideas ___ (bueno)", de:"ein paar Ideen ___ (gut)", hint:"Angleichung", answer:"buenas", options:["buenos","buenas","bueno","buena"], why:"feminin Plural: buenas." },
      { id:"g_adj_6", prompt:"chicas ___ (feliz)", de:"Mädchen ___ (glücklich)", hint:"Plural", answer:"felices", options:["felizs","felices","felizas","felizes"], why:"z→c vor e: felices." },
      { id:"g_adj_7", prompt:"___ amigo (gut, vor dem Nomen)", de:"___ Freund (gut, vor dem Nomen)", hint:"Kurzform", answer:"buen", options:["bueno","buen","buena","buenos"], why:"bueno/malo verkürzen sich vor maskulinem Singular: buen amigo." },
      { id:"g_adj_8", prompt:"unas preguntas ___ (fácil)", de:"ein paar Fragen ___ (einfach)", hint:"Plural", answer:"fáciles", options:["fácil","fáciles","fácilas","faciles"], why:"Konsonant + -es, Akzent bleibt sinnvoll: fáciles." }
    ]
  },
  {
    id: "gustar",
    lv: 2,
    title: "gustar und ähnliche Verben",
    summary: "Me gusta… – grammatisch gefällt es mir.",
    lessons: [
      {
        title: "Die Logik",
        body: "Nicht „ich mag“, sondern „es gefällt mir“:\n\nMe gusta el café.     Der Kaffee gefällt mir.\nMe gustan los gatos.  Die Katzen gefallen mir.\n\ngusta  → eine Sache / ein Infinitiv\ngustan → mehrere Sachen"
      },
      {
        title: "Die Personen",
        body: "me gusta     mir\nte gusta     dir\nle gusta     ihm / ihr / Ihnen\nnos gusta    uns\nos gusta     euch\nles gusta    ihnen / Ihnen\n\nZur Klarheit: A Juan le gusta el fútbol."
      },
      {
        title: "Verwandte Verben",
        body: "encantar (sehr gefallen), doler (schmerzen), interesar, importar, faltar\n\nMe encanta España.\nMe duele la cabeza.\nMe importan los amigos."
      }
    ],
    cards: [
      { id:"g_gu_1", prompt:"Me ___ el café.", de:"Mir ___ der Kaffee.", hint:"Singular", answer:"gusta", options:["gusta","gustan","gusto","gustas"], why:"el café ist Singular → gusta." },
      { id:"g_gu_2", prompt:"Me ___ los perros.", de:"Mir ___ die Hunde.", hint:"Plural", answer:"gustan", options:["gusta","gustan","gusto","gustamos"], why:"los perros ist Plural → gustan." },
      { id:"g_gu_3", prompt:"___ gusta viajar. (ich)", de:"___ gefällt Reisen. (ich)", hint:"Pronomen", answer:"Me", options:["Me","Te","Le","Nos"], why:"me = mir." },
      { id:"g_gu_4", prompt:"¿___ gusta el vino? (du)", de:"___ gefällt der Wein? (du)", hint:"Pronomen", answer:"Te", options:["Me","Te","Se","Os"], why:"te gusta = gefällt dir." },
      { id:"g_gu_5", prompt:"Nos ___ las playas.", de:"Uns ___ die Strände.", hint:"Plural", answer:"gustan", options:["gusta","gustan","gustamos","gustáis"], why:"las playas Plural + nos." },
      { id:"g_gu_6", prompt:"A ella ___ gusta el té.", de:"Ihr ___ der Tee.", hint:"Klarstellung", answer:"le", options:["me","te","le","se"], why:"le gusta, oft mit a ella / a Juan." },
      { id:"g_gu_7", prompt:"Me ___ España. (sehr gefallen)", de:"Mir ___ Spanien sehr.", hint:"encantar", answer:"encanta", options:["encanta","encantan","encanto","encantas"], why:"wie gustar: encanta bei Singular." },
      { id:"g_gu_8", prompt:"Me ___ la cabeza.", de:"Mir ___ der Kopf.", hint:"schmerzen", answer:"duele", options:["duele","duelen","dolor","duele la"], why:"doler funktioniert wie gustar: me duele." }
    ]
  },
  {
    id: "reflexiv",
    lv: 2,
    title: "Reflexive Verben",
    summary: "llamarse, levantarse, ducharse – tägliche Routine.",
    lessons: [
      {
        title: "Die Pronomen",
        body: "me, te, se, nos, os, se\n\nllamarse:\nme llamo, te llamas, se llama,\nnos llamamos, os llamáis, se llaman"
      },
      {
        title: "Alltag",
        body: "Me despierto a las siete.\nMe levanto.\nMe ducho.\nMe visto.\nMe acuesto a las once.\n\nDas Pronomen steht vor dem konjugierten Verb (oder angehängt an Infinitiv: voy a levantarme)."
      }
    ],
    cards: [
      { id:"g_rx_1", prompt:"llamarse · yo", de:"heißen · ich", hint:"Präsens", answer:"me llamo", options:["me llamo","te llamo","se llamo","llamo me"], why:"yo + me + Verb in der 1. Person." },
      { id:"g_rx_2", prompt:"llamarse · ella", de:"heißen · sie", hint:"Präsens", answer:"se llama", options:["se llama","te llama","me llama","os llama"], why:"él/ella/usted: se llama." },
      { id:"g_rx_3", prompt:"levantarse · tú", de:"aufstehen · du", hint:"Präsens", answer:"te levantas", options:["te levantas","se levantas","me levantas","os levantas"], why:"tú: te levantas." },
      { id:"g_rx_4", prompt:"ducharse · nosotros", de:"duschen · wir", hint:"Präsens", answer:"nos duchamos", options:["nos duchamos","se duchamos","os duchamos","me duchamos"], why:"nosotros: nos + -amos." },
      { id:"g_rx_5", prompt:"acostarse · yo (o→ue)", de:"sich hinlegen · ich (Stammwechsel)", hint:"Stammwechsel", answer:"me acuesto", options:["me acosto","me acuesto","me acuesto yo","me acuesta"], why:"acostarse hat o→ue: me acuesto." },
      { id:"g_rx_6", prompt:"despertarse · ellos", de:"aufwachen · sie (Plural)", hint:"e→ie", answer:"se despiertan", options:["se despertan","se despiertan","os despiertan","se despiertan se"], why:"e→ie und se + -an." },
      { id:"g_rx_7", prompt:"Voy a ___ (levantarse).", de:"Ich werde mich ___ . (aufstehen)", hint:"Infinitiv", answer:"levantarme", options:["me levantar","levantarme","levantarse yo","yo levantar"], why:"Pronomen darf an den Infinitiv: levantarme." },
      { id:"g_rx_8", prompt:"¿Cómo ___ llama usted?", de:"Wie ___ Sie?", hint:"höflich", answer:"se", options:["te","me","se","os"], why:"usted → se llama." }
    ]
  },
  {
    id: "possessiv",
    lv: 2,
    title: "Possessivbegleiter",
    summary: "mi, tu, su, nuestro – mein, dein, sein.",
    lessons: [
      {
        title: "Unbetonte Formen (vor dem Nomen)",
        body: "mi / mis        mein\ntu / tus        dein\nsu / sus        sein, ihr, Ihr\nnuestro / a / os / as   unser\nvuestro / a / os / as   euer\n\nmi casa, mis amigos\nsu libro kann sein/ihr/Ihr heißen – Kontext oder de él / de ella klärt."
      }
    ],
    cards: [
      { id:"g_po_1", prompt:"___ casa (mein Haus)", de:"___ Haus (mein Haus)", hint:"Singular", answer:"mi", options:["mi","mis","tu","su"], why:"mi vor Singular-Nomen, keine Angleichung an Geschlecht." },
      { id:"g_po_2", prompt:"___ amigos (meine Freunde)", de:"___ Freunde (meine)", hint:"Plural", answer:"mis", options:["mi","mis","nuestros","tus"], why:"Plural des Nomens → mis." },
      { id:"g_po_3", prompt:"___ libro (dein Buch)", de:"___ Buch (dein)", hint:"unbetont", answer:"tu", options:["tu","tú","tus","su"], why:"tu ohne Akzent = dein; tú = du." },
      { id:"g_po_4", prompt:"___ hermana (unsere, f.)", de:"___ Schwester (unsere)", hint:"Angleichung", answer:"nuestra", options:["nuestro","nuestra","nuestros","mía"], why:"nuestro gleicht sich an: nuestra hermana." },
      { id:"g_po_5", prompt:"___ padres (unsere)", de:"___ Eltern (unsere)", hint:"Plural m.", answer:"nuestros", options:["nuestro","nuestra","nuestros","nuestras"], why:"padres maskulin Plural." },
      { id:"g_po_6", prompt:"su puede significar…", de:"su kann bedeuten…", hint:"mehrere Deutungen", answer:"sein / ihr / Ihr", options:["nur sein","nur dein","sein / ihr / Ihr","nur unser"], why:"su ist mehrdeutig." }
    ]
  },
  {
    id: "por-para",
    lv: 3,
    title: "por vs. para",
    summary: "Zwei Wörter für „für“ – Ursache gegen Ziel.",
    lessons: [
      {
        title: "para – Ziel und Empfänger",
        body: "Empfänger: Esto es para ti.\nZweck / um zu: Estudio para aprender.\nFrist: Lo necesito para el lunes.\nRichtung: Salgo para Madrid.\nMeinung: Para mí, está bien."
      },
      {
        title: "por – Grund, Weg, Tausch",
        body: "Grund: Gracias por tu ayuda.\nDauer: Estudio por la mañana. / por dos horas.\nWeg: Caminamos por el parque.\nTausch / Preis: Lo compré por diez euros.\n„pro“: Voto por Ana.\nPassiv-Täter: escrito por Cervantes."
      }
    ],
    cards: [
      { id:"g_pp_1", prompt:"Esto es ___ ti.", de:"Das ist ___ dir.", hint:"Empfänger", answer:"para", options:["por","para","de","a"], why:"Empfänger: para." },
      { id:"g_pp_2", prompt:"Gracias ___ todo.", de:"Danke ___ alles.", hint:"Grund", answer:"por", options:["por","para","de","con"], why:"gracias por…" },
      { id:"g_pp_3", prompt:"Estudio ___ aprender.", de:"Ich lerne ___ Spanisch zu können.", hint:"Zweck", answer:"para", options:["por","para","que","a"], why:"para + Infinitiv = um zu." },
      { id:"g_pp_4", prompt:"Caminamos ___ la ciudad.", de:"Wir laufen ___ die Stadt.", hint:"durch / entlang", answer:"por", options:["por","para","en","hasta"], why:"Bewegung durch einen Ort: por." },
      { id:"g_pp_5", prompt:"Lo necesito ___ mañana.", de:"Ich brauche es ___ morgen.", hint:"Frist", answer:"para", options:["por","para","hasta","en"], why:"Deadline: para." },
      { id:"g_pp_6", prompt:"Estudio ___ la mañana.", de:"Ich lerne ___ Morgen / vormittags.", hint:"Tageszeit", answer:"por", options:["por","para","en","a"], why:"por la mañana / tarde / noche." },
      { id:"g_pp_7", prompt:"Lo compré ___ diez euros.", de:"Ich habe es ___ zehn Euro gekauft.", hint:"Preis", answer:"por", options:["por","para","de","con"], why:"Preis und Tausch mit por." },
      { id:"g_pp_8", prompt:"Salgo ___ Barcelona.", de:"Ich fahre ___ Barcelona.", hint:"Reiseziel", answer:"para", options:["por","para","a","hacia"], why:"Aufbruch in Richtung: para (oft a + Ort für Ankunft)." }
    ]
  },
  {
    id: "indefinido",
    lv: 3,
    title: "Pretérito indefinido",
    summary: "Abgeschlossene Handlungen in der Vergangenheit.",
    lessons: [
      {
        title: "Wann?",
        body: "Einmalige, abgeschlossene Ereignisse mit klarem Ende:\nAyer fui al cine.\nEl año pasado viajé a España.\n¿Qué hiciste el domingo?"
      },
      {
        title: "Regelmäßig",
        body: "-ar (hablar):\nhablé, hablaste, habló, hablamos, hablasteis, hablaron\n\n-er / -ir (comer / vivir):\ncomí, comiste, comió, comimos, comisteis, comieron"
      },
      {
        title: "Unregelmäßig (Auszug)",
        body: "ser/ir: fui, fuiste, fue, fuimos, fuisteis, fueron\nhacer: hice, hiciste, hizo, hicimos, hicisteis, hicieron\ntener: tuve, tuviste, tuvo…\nestar: estuve, estuviste, estuvo…\npoder: pude…  querer: quise…  decir: dije…  ver: vi…"
      }
    ],
    cards: [
      { id:"g_in_1", prompt:"hablar · yo (Indefinido)", de:"sprechen · ich (gestern, abgeschlossen)", hint:"gestern", answer:"hablé", options:["hablé","hablaba","hablo","habló"], why:"-ar, yo: -é." },
      { id:"g_in_2", prompt:"hablar · ella", de:"sprechen · sie (abgeschlossen)", hint:"Indefinido", answer:"habló", options:["hablé","habló","hablaba","habla"], why:"él/ella: -ó." },
      { id:"g_in_3", prompt:"comer · tú", de:"essen · du (abgeschlossen)", hint:"Indefinido", answer:"comiste", options:["comes","comiste","comías","comió"], why:"-er/-ir, tú: -iste." },
      { id:"g_in_4", prompt:"ir · yo", de:"gehen · ich (abgeschlossen)", hint:"unregelmäßig", answer:"fui", options:["fui","iba","voy","fue"], why:"ser und ir teilen sich fui, fuiste, fue…" },
      { id:"g_in_5", prompt:"ser · ella", de:"sein · sie (abgeschlossen)", hint:"unregelmäßig", answer:"fue", options:["era","fue","es","estuvo"], why:"fue = war / ging (je nach Verb)." },
      { id:"g_in_6", prompt:"hacer · yo", de:"machen · ich (abgeschlossen)", hint:"unregelmäßig", answer:"hice", options:["hice","hiceo","hago","hacía"], why:"yo hice, él hizo." },
      { id:"g_in_7", prompt:"hacer · él", de:"machen · er (abgeschlossen)", hint:"z-Form", answer:"hizo", options:["hice","hizo","hacía","hace"], why:"3. Person: hizo (c→z)." },
      { id:"g_in_8", prompt:"tener · nosotros", de:"haben · wir (abgeschlossen)", hint:"unregelmäßig", answer:"tuvimos", options:["teníamos","tuvimos","tenemos","tuve"], why:"Stamm tuv- + -imos." },
      { id:"g_in_9", prompt:"estar · yo", de:"sein (Ort/Zustand) · ich (abgeschlossen)", hint:"unregelmäßig", answer:"estuve", options:["estuve","estaba","estoy","estuvo"], why:"yo estuve." },
      { id:"g_in_10", prompt:"Signalwort für Indefinido?", de:"Signalwort für die abgeschlossene Vergangenheit?", hint:"Zeit", answer:"ayer", options:["siempre","ayer","cada día","mientras"], why:"ayer, anoche, el año pasado, en 2019…" }
    ]
  },
  {
    id: "imperfecto",
    lv: 3,
    title: "Pretérito imperfecto",
    summary: "Gewohnheiten, Beschreibungen, Hintergrund in der Vergangenheit.",
    lessons: [
      {
        title: "Wann?",
        body: "Gewohnheiten: Cuando era niño, jugaba al fútbol.\nBeschreibung: Hacía frío y llovía.\nGleichzeitiger Hintergrund: Leía cuando llamaste."
      },
      {
        title: "Endungen",
        body: "-ar: hablaba, hablabas, hablaba, hablábamos, hablabais, hablaban\n-er/-ir: comía, comías, comía, comíamos, comíais, comían\n\nNur drei unregelmäßige: ir → iba, ser → era, ver → veía."
      }
    ],
    cards: [
      { id:"g_im_1", prompt:"hablar · yo (Imperfecto)", de:"sprechen · ich (früher / Gewohnheit)", hint:"Gewohnheit", answer:"hablaba", options:["hablé","hablaba","hablo","habló"], why:"-ar: -aba." },
      { id:"g_im_2", prompt:"comer · tú", de:"essen · du (früher / Gewohnheit)", hint:"Imperfecto", answer:"comías", options:["comiste","comes","comías","comías tú"], why:"-er: -ías." },
      { id:"g_im_3", prompt:"vivir · nosotros", de:"leben · wir (früher / Gewohnheit)", hint:"Imperfecto", answer:"vivíamos", options:["vivimos","vivíamos","vivimos ayer","vivíamosos"], why:"Akzent: vivíamos." },
      { id:"g_im_4", prompt:"ser · ella", de:"sein · sie (früher / Beschreibung)", hint:"unregelmäßig", answer:"era", options:["fue","era","es","estaba"], why:"ser → era, eras, era…" },
      { id:"g_im_5", prompt:"ir · yo", de:"gehen · ich (früher / Gewohnheit)", hint:"unregelmäßig", answer:"iba", options:["fui","iba","voy","fue"], why:"ir → iba." },
      { id:"g_im_6", prompt:"ver · nosotros", de:"sehen · wir (früher)", hint:"unregelmäßig", answer:"veíamos", options:["vimos","veíamos","vemos","veíamosos"], why:"ver behält e: veíamos." },
      { id:"g_im_7", prompt:"Cuando ___ niño, jugaba mucho. (yo, ser)", de:"Als ich ___ Kind, spielte ich viel.", hint:"Beschreibung", answer:"era", options:["fui","era","soy","estuve"], why:"Hintergrund / Kindheit: Imperfecto." },
      { id:"g_im_8", prompt:"Signalwort für Imperfecto?", de:"Signalwort für Gewohnheit in der Vergangenheit?", hint:"Gewohnheit", answer:"siempre", options:["ayer","anoche","siempre","el lunes pasado"], why:"siempre, todos los días, mientras, antes…" }
    ]
  },
  {
    id: "objekte",
    lv: 3,
    title: "Objektpronomen",
    summary: "lo, la, los, las und me, te, le, nos…",
    lessons: [
      {
        title: "Direktes Objekt (wen / was?)",
        body: "me, te, lo/la, nos, os, los/las\n\nVeo a Juan. → Lo veo.\nVeo la casa. → La veo.\n¿Tienes las llaves? → ¿Las tienes?"
      },
      {
        title: "Indirektes Objekt (wem?)",
        body: "me, te, le, nos, os, les\n\nDoy el libro a Ana. → Le doy el libro.\nOft zur Klarheit: Le doy el libro a Ana.\n\nle/les vor lo/la/los/las wird zu se:\nSe lo doy.  (Ich gebe es ihm/ihr.)"
      }
    ],
    cards: [
      { id:"g_ob_1", prompt:"Veo a Juan. → ___ veo.", de:"Ich sehe Juan. → Ich sehe ___.", hint:"direkt, m.", answer:"Lo", options:["Lo","Le","La","Se"], why:"Personen als direktes Objekt: lo (m.)." },
      { id:"g_ob_2", prompt:"Compro la mesa. → ___ compro.", de:"Ich kaufe den Tisch. → Ich kaufe ___.", hint:"direkt, f.", answer:"La", options:["Lo","La","Le","Las"], why:"la mesa → la." },
      { id:"g_ob_3", prompt:"¿Tienes las llaves? → ¿___ tienes?", de:"Hast du die Schlüssel? → Hast du ___?", hint:"Plural f.", answer:"Las", options:["Los","Las","Les","La"], why:"las llaves → las." },
      { id:"g_ob_4", prompt:"Doy un café a María. → ___ doy un café.", de:"Ich gebe María einen Kaffee. → Ich gebe ___ einen Kaffee.", hint:"wem?", answer:"Le", options:["Lo","La","Le","Se"], why:"indirekt: le." },
      { id:"g_ob_5", prompt:"Le doy el libro. → ___ lo doy.", de:"Ich gebe ihr das Buch. → Ich gebe ___ es.", hint:"le+lo", answer:"Se", options:["Se","Le","Lo","La"], why:"le/les + lo/la/los/las → se lo / se la…" },
      { id:"g_ob_6", prompt:"Te ___ (ich rufe dich an)", de:"Ich ___ dich (anrufen)", hint:"llamar", answer:"llamo", options:["llamo","llamas","llama","llamamos"], why:"te llamo = ich rufe dich an." },
      { id:"g_ob_7", prompt:"Nos ___ (sie sehen uns)", de:"Sie ___ uns (sehen)", hint:"ver", answer:"ven", options:["vemos","ven","veo","veis"], why:"ellos nos ven." },
      { id:"g_ob_8", prompt:"¿Me ___ ayudar? (können)", de:"Kannst du mir ___ helfen?", hint:"poder", answer:"puedes", options:["puedo","puedes","puede","podemos"], why:"¿Me puedes ayudar?" }
    ]
  },
  {
    id: "indef-vs-imp",
    lv: 4,
    title: "Indefinido vs. Imperfecto",
    summary: "Handlungskette gegen Hintergrund – die klassische Erzählung.",
    lessons: [
      {
        title: "Das Bild",
        body: "Imperfecto = Bühne (Wetter, Uhrzeit, Gewohnheit, Gefühl).\nIndefinido = Handlung, die die Geschichte voranbringt.\n\nHacía frío. Eran las ocho. Yo leía cuando de repente sonó el teléfono."
      },
      {
        title: "Mini-Regeln",
        body: "einmalig + Datum → Indefinido\nGewohnheit / „früher immer“ → Imperfecto\nunterbrochene Handlung: Imperfecto + Indefinido\nser zur Beschreibung oft Imperfecto (era alto), einmalige Identifikation eher Indefinido (fue un éxito)."
      }
    ],
    cards: [
      { id:"g_ii_1", prompt:"Ayer ___ al cine. (ir, yo)", de:"Gestern ___ ich ins Kino. (gehen)", hint:"einmalig", answer:"fui", options:["iba","fui","voy","iba ayer"], why:"ayer + einmaliges Ereignis: Indefinido." },
      { id:"g_ii_2", prompt:"Cuando ___ niño, jugaba mucho. (ser, yo)", de:"Als ich ___ Kind, spielte ich viel. (sein)", hint:"Hintergrund", answer:"era", options:["fui","era","estuve","soy"], why:"Kindheit als Rahmen: Imperfecto." },
      { id:"g_ii_3", prompt:"Leía cuando ___ el teléfono. (sonar, él)", de:"Ich las, als ___ das Telefon. (klingeln)", hint:"Unterbrechung", answer:"sonó", options:["sonaba","sonó","suena","sonaría"], why:"die unterbrechende Handlung: Indefinido." },
      { id:"g_ii_4", prompt:"Todos los días ___ café. (tomar, ella)", de:"Jeden Tag ___ sie Kaffee. (nehmen)", hint:"Gewohnheit", answer:"tomaba", options:["tomó","tomaba","toma","ha tomado"], why:"todos los días → Imperfecto." },
      { id:"g_ii_5", prompt:"El año pasado ___ a España. (viajar, nosotros)", de:"Letztes Jahr ___ wir nach Spanien. (reisen)", hint:"abgeschlossen", answer:"viajamos", options:["viajábamos","viajamos","viajamos ahora","viajemos"], why:"el año pasado → Indefinido (Form gleich wie Präsens!)." },
      { id:"g_ii_6", prompt:"___ frío y llovía. (hacer)", de:"___ kalt und es regnete. (Wetter)", hint:"Wetter-Bühne", answer:"Hacía", options:["Hizo","Hacía","Hace","Haría"], why:"Wetterbeschreibung: Imperfecto." }
    ]
  },
  {
    id: "futuro",
    lv: 4,
    title: "Futur und ir a",
    summary: "Voy a hablar vs. hablaré.",
    lessons: [
      {
        title: "Nahe Zukunft: ir + a + Infinitiv",
        body: "Voy a estudiar.\nVas a viajar.\nVamos a comer.\n\nSehr häufig in der Alltagssprache."
      },
      {
        title: "Futuro simple",
        body: "Infinitiv + Endung:\n-é, -ás, -á, -emos, -éis, -án\n\nhablaré, comerás, vivirá\n\nUnregelmäßig: teneré? → tendré; poder → podré; hacer → haré; decir → diré; haber → habré; salir → saldré."
      }
    ],
    cards: [
      { id:"g_fu_1", prompt:"yo ___ a estudiar", de:"ich ___ lernen (nahe Zukunft)", hint:"ir + a", answer:"voy", options:["voy","voy a","iré","fui"], why:"voy a + Infinitiv." },
      { id:"g_fu_2", prompt:"hablar · yo (Futur)", de:"sprechen · ich (Zukunft)", hint:"Endung", answer:"hablaré", options:["hablaré","hablaría","hablo","hablaba"], why:"Infinitiv + -é." },
      { id:"g_fu_3", prompt:"tener · ella (Futur)", de:"haben · sie (Zukunft)", hint:"unregelmäßig", answer:"tendrá", options:["tenerá","tendrá","tiene","tendría"], why:"tener → tendr-." },
      { id:"g_fu_4", prompt:"hacer · yo (Futur)", de:"machen · ich (Zukunft)", hint:"unregelmäßig", answer:"haré", options:["haceré","haré","hago","hice"], why:"hacer → haré." },
      { id:"g_fu_5", prompt:"decir · nosotros (Futur)", de:"sagen · wir (Zukunft)", hint:"unregelmäßig", answer:"diremos", options:["deciremos","diremos","decimos","dijimos"], why:"decir → dir-." },
      { id:"g_fu_6", prompt:"Mañana ___ a Madrid. (ir, nosotros, nah)", de:"Morgen ___ wir nach Madrid. (gehen, Plan)", hint:"Plan", answer:"vamos", options:["vamos","iremos","fuimos","íbamos"], why:"vamos a Madrid / vamos a ir – naher Plan oft mit ir." }
    ]
  },
  {
    id: "subjuntivo",
    lv: 4,
    title: "Presente de subjuntivo (Einstieg)",
    summary: "Wünsche, Zweifel, Bewertungen: quiero que…",
    lessons: [
      {
        title: "Die Idee",
        body: "Indikativ = Tatsache.\nSubjuntivo = Wunsch, Emotion, Zweifel, Bewertung, Ungewissheit.\n\nQuiero que vengas.\nEs importante que estudies.\nNo creo que llueva."
      },
      {
        title: "Bildung (regelmäßig)",
        body: "Vom yo-Präsens, -o weg, „umgekehrte“ Endung:\n\nhablar (a→e): hable, hables, hable, hablemos, habléis, hablen\ncomer/vivir (e→a): coma, comas… / viva, vivas…\n\ntener → tenga; hacer → haga; ir → vaya; ser → sea; estar → esté."
      }
    ],
    cards: [
      { id:"g_su_1", prompt:"Quiero que tú ___ (venir).", de:"Ich will, dass du ___ . (kommen)", hint:"Subjuntivo", answer:"vengas", options:["vienes","vengas","vendrás","venías"], why:"wollen + que → Subjuntivo." },
      { id:"g_su_2", prompt:"hablar · yo (Subj.)", de:"sprechen · ich (Subjuntivo)", hint:"a→e", answer:"hable", options:["hablo","hable","hablé","hablaría"], why:"-ar: Stamm + -e." },
      { id:"g_su_3", prompt:"comer · ella (Subj.)", de:"essen · sie (Subjuntivo)", hint:"e→a", answer:"coma", options:["come","coma","comió","comerá"], why:"-er: -a." },
      { id:"g_su_4", prompt:"Es importante que nosotros ___ (estudiar).", de:"Es ist wichtig, dass wir ___ . (lernen)", hint:"Bewertung", answer:"estudiemos", options:["estudiamos","estudiemos","estudiaremos","estudiábamos"], why:"es importante que + Subjuntivo." },
      { id:"g_su_5", prompt:"ir · tú (Subj.)", de:"gehen · du (Subjuntivo)", hint:"unregelmäßig", answer:"vayas", options:["vas","vayas","irás","fueras"], why:"ir → vaya, vayas, vaya…" },
      { id:"g_su_6", prompt:"ser · ella (Subj.)", de:"sein · sie (Subjuntivo)", hint:"unregelmäßig", answer:"sea", options:["es","sea","fue","esté"], why:"ser → sea." },
      { id:"g_su_7", prompt:"No creo que ___ (llover).", de:"Ich glaube nicht, dass ___ . (regnen)", hint:"Zweifel", answer:"llueva", options:["llueve","llueva","lloverá","llovía"], why:"no creer que → Subjuntivo." },
      { id:"g_su_8", prompt:"estar · yo (Subj.)", de:"sein (Ort/Zustand) · ich (Subjuntivo)", hint:"Akzent", answer:"esté", options:["estoy","esté","estuve","estaría"], why:"estar → esté, estés, esté…" }
    ]
  }
];
