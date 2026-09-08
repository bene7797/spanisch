function stripArticle(es) {
  return String(es || "").replace(/^(el|la|los|las)\s+/i, "").trim();
}

function nounLemma(item) {
  if (!item) return "";
  if (item.pos !== "n") return item.es;
  return item.es;
}

function guessGenderFromLemma(w) {
  const word = String(w || "").toLowerCase();
  if (["mano", "foto", "moto", "radio"].includes(word)) return "f";
  if (["día", "mapa", "problema", "tema", "sistema", "idioma", "planeta", "examen", "agua"].includes(word)) return "m";
  if (word.endsWith("a") || word.endsWith("ción") || word.endsWith("sión") || word.endsWith("dad") || word.endsWith("tad")) return "f";
  return "m";
}

function withArticle(item) {
  if (!item || item.pos !== "n") return item?.es || "";
  const es = item.es.trim();
  if (/^(el|la|los|las)\s+/i.test(es)) return es;
  const days = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
  const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  if (days.includes(es)) return "el " + es;
  if (months.includes(es)) return es;
  if (es === "internet") return "el internet";
  return (guessGenderFromLemma(es) === "f" ? "la " : "el ") + es;
}

function nounGender(item) {
  const es = withArticle(item);
  if (/^las\s/i.test(es)) return "f";
  if (/^los\s/i.test(es)) return "m";
  if (/^el\s/i.test(es)) return "m";
  if (/^la\s/i.test(es)) return "f";
  return guessGenderFromLemma(stripArticle(es));
}

function pluralNoun(item) {
  const es = withArticle(item);
  const m = es.match(/^(el|la|los|las)\s+(.+)/i);
  const art = m ? m[1].toLowerCase() : nounGender(item) === "f" ? "la" : "el";
  const word = m ? m[2] : es;
  if (art === "los" || art === "las") return es;
  let pl = word;
  if (/[aeiouáéíóú]$/i.test(word)) pl = word + "s";
  else if (/z$/i.test(word)) pl = word.slice(0, -1) + "ces";
  else pl = word + "es";
  const plArt = art === "la" || art === "las" ? "las" : "los";
  return plArt + " " + pl;
}

function adjForms(lemma) {
  const w = lemma.replace(/^(un|una|el|la)\s+/i, "");
  if (w.endsWith("o")) {
    const stem = w.slice(0, -1);
    return { m: stem + "o", f: stem + "a", mp: stem + "os", fp: stem + "as" };
  }
  if (w.endsWith("e") || /[lrzns]$/.test(w)) {
    let pl = w + "s";
    if (w.endsWith("z")) pl = w.slice(0, -1) + "ces";
    else if (/[^aeiouáéíóú]$/i.test(w)) pl = w + "es";
    if (w === "feliz") pl = "felices";
    if (w === "fácil") pl = "fáciles";
    return { m: w, f: w, mp: pl, fp: pl };
  }
  return { m: w, f: w, mp: w + "s", fp: w + "s" };
}

const IRREG_PRES = {
  ser: { yo: "soy", tu: "eres", el: "es", nos: "somos", vos: "sois", ellos: "son" },
  estar: { yo: "estoy", tu: "estás", el: "está", nos: "estamos", vos: "estáis", ellos: "están" },
  ir: { yo: "voy", tu: "vas", el: "va", nos: "vamos", vos: "vais", ellos: "van" },
  haber: { yo: "he", tu: "has", el: "ha", nos: "hemos", vos: "habéis", ellos: "han" },
  tener: { yo: "tengo", tu: "tienes", el: "tiene", nos: "tenemos", vos: "tenéis", ellos: "tienen" },
  hacer: { yo: "hago", tu: "haces", el: "hace", nos: "hacemos", vos: "hacéis", ellos: "hacen" },
  poder: { yo: "puedo", tu: "puedes", el: "puede", nos: "podemos", vos: "podéis", ellos: "pueden" },
  querer: { yo: "quiero", tu: "quieres", el: "quiere", nos: "queremos", vos: "queréis", ellos: "quieren" },
  decir: { yo: "digo", tu: "dices", el: "dice", nos: "decimos", vos: "decís", ellos: "dicen" },
  ver: { yo: "veo", tu: "ves", el: "ve", nos: "vemos", vos: "veis", ellos: "ven" },
  dar: { yo: "doy", tu: "das", el: "da", nos: "damos", vos: "dais", ellos: "dan" },
  saber: { yo: "sé", tu: "sabes", el: "sabe", nos: "sabemos", vos: "sabéis", ellos: "saben" },
  venir: { yo: "vengo", tu: "vienes", el: "viene", nos: "venimos", vos: "venís", ellos: "vienen" },
  poner: { yo: "pongo", tu: "pones", el: "pone", nos: "ponemos", vos: "ponéis", ellos: "ponen" },
  salir: { yo: "salgo", tu: "sales", el: "sale", nos: "salimos", vos: "salís", ellos: "salen" },
  traer: { yo: "traigo", tu: "traes", el: "trae", nos: "traemos", vos: "traéis", ellos: "traen" },
  oír: { yo: "oigo", tu: "oyes", el: "oye", nos: "oímos", vos: "oís", ellos: "oyen" },
  conocer: { yo: "conozco", tu: "conoces", el: "conoce", nos: "conocemos", vos: "conocéis", ellos: "conocen" },
  parecer: { yo: "parezco", tu: "pareces", el: "parece", nos: "parecemos", vos: "parecéis", ellos: "parecen" },
  traducir: { yo: "traduzco", tu: "traduces", el: "traduce", nos: "traducimos", vos: "traducís", ellos: "traducen" },
  caer: { yo: "caigo", tu: "caes", el: "cae", nos: "caemos", vos: "caéis", ellos: "caen" },
  elegir: { yo: "elijo", tu: "eliges", el: "elige", nos: "elegimos", vos: "elegís", ellos: "eligen" },
  seguir: { yo: "sigo", tu: "sigues", el: "sigue", nos: "seguimos", vos: "seguís", ellos: "siguen" },
  pedir: { yo: "pido", tu: "pides", el: "pide", nos: "pedimos", vos: "pedís", ellos: "piden" },
  dormir: { yo: "duermo", tu: "duermes", el: "duerme", nos: "dormimos", vos: "dormís", ellos: "duermen" },
  morir: { yo: "muero", tu: "mueres", el: "muere", nos: "morimos", vos: "morís", ellos: "mueren" },
  sentir: { yo: "siento", tu: "sientes", el: "siente", nos: "sentimos", vos: "sentís", ellos: "sienten" },
  preferir: { yo: "prefiero", tu: "prefieres", el: "prefiere", nos: "preferimos", vos: "preferís", ellos: "prefieren" },
  pensar: { yo: "pienso", tu: "piensas", el: "piensa", nos: "pensamos", vos: "pensáis", ellos: "piensan" },
  entender: { yo: "entiendo", tu: "entiendes", el: "entiende", nos: "entendemos", vos: "entendéis", ellos: "entienden" },
  cerrar: { yo: "cierro", tu: "cierras", el: "cierra", nos: "cerramos", vos: "cerráis", ellos: "cierran" },
  empezar: { yo: "empiezo", tu: "empiezas", el: "empieza", nos: "empezamos", vos: "empezáis", ellos: "empiezan" },
  despertar: { yo: "despierto", tu: "despiertas", el: "despierta", nos: "despertamos", vos: "despertáis", ellos: "despiertan" },
  encontrar: { yo: "encuentro", tu: "encuentras", el: "encuentra", nos: "encontramos", vos: "encontráis", ellos: "encuentran" },
  recordar: { yo: "recuerdo", tu: "recuerdas", el: "recuerda", nos: "recordamos", vos: "recordáis", ellos: "recuerdan" },
  volver: { yo: "vuelvo", tu: "vuelves", el: "vuelve", nos: "volvemos", vos: "volvéis", ellos: "vuelven" },
  contar: { yo: "cuento", tu: "cuentas", el: "cuenta", nos: "contamos", vos: "contáis", ellos: "cuentan" },
  mostrar: { yo: "muestro", tu: "muestras", el: "muestra", nos: "mostramos", vos: "mostráis", ellos: "muestran" },
  soñar: { yo: "sueño", tu: "sueñas", el: "sueña", nos: "soñamos", vos: "soñáis", ellos: "sueñan" },
  probar: { yo: "pruebo", tu: "pruebas", el: "prueba", nos: "probamos", vos: "probáis", ellos: "prueban" },
  doler: { yo: "duelo", tu: "dueles", el: "duele", nos: "dolemos", vos: "doléis", ellos: "duelen" },
  llover: { yo: "lluevo", tu: "llueves", el: "llueve", nos: "llovemos", vos: "llovéis", ellos: "llueven" },
  jugar: { yo: "juego", tu: "juegas", el: "juega", nos: "jugamos", vos: "jugáis", ellos: "juegan" },
  oír: { yo: "oigo", tu: "oyes", el: "oye", nos: "oímos", vos: "oís", ellos: "oyen" },
  reír: { yo: "río", tu: "ríes", el: "ríe", nos: "reímos", vos: "reís", ellos: "ríen" },
  construir: { yo: "construyo", tu: "construyes", el: "construye", nos: "construimos", vos: "construís", ellos: "construyen" },
  huir: { yo: "huyo", tu: "huyes", el: "huye", nos: "huimos", vos: "huís", ellos: "huyen" }
};

const REFLX = ["me", "te", "se", "nos", "os", "se"];
const PERS = ["yo", "tú", "él/ella/usted", "nosotros", "vosotros", "ellos/ustedes"];
const KEYS = ["yo", "tu", "el", "nos", "vos", "ellos"];

function splitReflexive(inf) {
  const raw = inf.replace(/se$/i, "");
  const isRefl = /se$/i.test(inf) || inf === "llamarse";
  let base = inf;
  if (inf.endsWith("se") && inf.length > 3) base = inf.slice(0, -2);
  if (inf === "llamarse") base = "llamar";
  return { base, isRefl };
}

function regularPresent(inf) {
  let stem;
  let set;
  if (inf.endsWith("ar")) {
    stem = inf.slice(0, -2);
    set = ["o", "as", "a", "amos", "áis", "an"];
  } else if (inf.endsWith("er")) {
    stem = inf.slice(0, -2);
    set = ["o", "es", "e", "emos", "éis", "en"];
  } else if (inf.endsWith("ir")) {
    stem = inf.slice(0, -2);
    set = ["o", "es", "e", "imos", "ís", "en"];
  } else return null;
  const out = {};
  KEYS.forEach((k, i) => {
    out[k] = stem + set[i];
  });
  return out;
}

function presentOf(infinitive) {
  const { base, isRefl } = splitReflexive(infinitive);
  const forms = IRREG_PRES[base] || regularPresent(base);
  if (!forms) return null;
  if (!isRefl) return forms;
  const tagged = {};
  KEYS.forEach((k, i) => {
    tagged[k] = REFLX[i] + " " + forms[k];
  });
  return tagged;
}

function verbInfinitive(item) {
  if (!item) return "";
  if (item.pos === "v") {
    if (item.es === "hay") return "haber";
    return item.es.split(" ")[0];
  }
  return "";
}

function getWordForms(item) {
  if (!item) return null;
  if (item.pos === "v") {
    const inf = verbInfinitive(item);
    const forms = presentOf(inf === "haber" && item.es === "hay" ? "haber" : inf);
    if (!forms) return null;
    const rows = PERS.map((label, i) => [label, inf === "haber" && item.es === "hay" && i === 2 ? "hay" : forms[KEYS[i]]]);
    if (item.es === "hay") {
      return { title: "hay / haber · Präsens", rows: [["es gibt", "hay"], ...rows] };
    }
    return { title: inf + " · Präsens", rows };
  }
  if (item.pos === "n") {
    const sg = withArticle(item);
    const pl = pluralNoun(item);
    const g = nounGender(item) === "f" ? "feminin" : "maskulin";
    return { title: "Artikel & Plural", rows: [["Singular (" + g + ")", sg], ["Plural", pl]] };
  }
  if (item.pos === "adj") {
    const f = adjForms(item.es);
    return {
      title: "Angleichung",
      rows: [
        ["m. Singular", f.m],
        ["f. Singular", f.f],
        ["m. Plural", f.mp],
        ["f. Plural", f.fp]
      ]
    };
  }
  return null;
}

function foldText(s) {
  return String(s || "")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¡!¿?.,;:()"]/g, "")
    .replace(/\s+/g, " ");
}

function expectedSpanish(item) {
  if (item.pos === "n") return withArticle(item);
  return item.es;
}

function scoreTyped(input, item) {
  const expected = expectedSpanish(item);
  const a = foldText(input);
  const b = foldText(expected);
  if (!a) return { quality: 0, note: "Nichts eingegeben." };
  if (a === b) {
    const exact = input.trim().toLowerCase() === expected.toLowerCase();
    return { quality: exact ? 2 : 1, note: exact ? "Genau." : "Sitzt – Akzente merken: " + expected };
  }
  const withoutArt = foldText(stripArticle(expected));
  if (item.pos === "n" && a === withoutArt) {
    return { quality: 0, note: "Artikel nicht vergessen: " + expected };
  }
  return { quality: 0, note: "Richtig: " + expected };
}
