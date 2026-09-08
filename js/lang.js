const LANGS = {
  es: {
    id: "es",
    name: "Spanisch",
    short: "ES",
    native: "Español",
    whisper: "spanish",
    tts: "es-ES",
    voicePrefix: "es",
    code: "ES",
    greet(h) {
      if (h < 12) return "Buenos días";
      if (h < 18) return "Buenas tardes";
      return "Buenas noches";
    }
  },
  it: {
    id: "it",
    name: "Italienisch",
    short: "IT",
    native: "Italiano",
    whisper: "italian",
    tts: "it-IT",
    voicePrefix: "it",
    code: "IT",
    greet(h) {
      if (h < 12) return "Buongiorno";
      if (h < 18) return "Buon pomeriggio";
      return "Buonasera";
    }
  }
};

function langOf(store) {
  return LANGS[store?.lang] || LANGS.es;
}

function itemKey(store, itemOrId) {
  const id = typeof itemOrId === "string" ? itemOrId : itemOrId?.id;
  if (!id) return "";
  if (String(id).includes(":")) return id;
  const lang = typeof itemOrId === "object" && itemOrId?.lang ? itemOrId.lang : store?.lang || "es";
  return lang + ":" + id;
}

function localizeItem(item, langId) {
  if (!item) return item;
  const lang = langId || "es";
  const word = lang === "it" ? item.it || item.es : item.es;
  const ex = lang === "it" ? item.exit || item.ex : item.ex;
  return { ...item, es: word, ex, lang };
}
