const STORE_KEY = "palabra-v1";

function defaultStore() {
  return {
    progress: {},
    streak: 0,
    streaks: { es: 0, it: 0 },
    lastStudyDate: null,
    lastStudy: { es: null, it: null },
    unlockedLevel: 1,
    unlocked: { es: 1, it: 1 },
    sessionSize: 12,
    direction: "es-de",
    typeAnswers: false,
    lang: "es",
    customVocab: [],
    customSeq: 1,
    reminders: false,
    quotaDoneOn: null,
    quotaByLang: { es: null, it: null },
    lastNotifyDate: null,
    reviewed: 0,
    correctTotal: 0,
    byDay: {},
    installHintDismissed: false,
    geminiKey: "",
    name: ""
  };
}

function migrateStore(store) {
  const next = { ...defaultStore(), ...store };
  if (!next.unlocked || typeof next.unlocked !== "object") {
    next.unlocked = { es: store.unlockedLevel || 1, it: 1 };
  }
  if (next.unlocked.es == null) next.unlocked.es = store.unlockedLevel || 1;
  if (next.unlocked.it == null) next.unlocked.it = 1;
  if (!next.streaks || typeof next.streaks !== "object") {
    next.streaks = { es: store.streak || 0, it: 0 };
  }
  if (next.streaks.es == null) next.streaks.es = store.streak || 0;
  if (next.streaks.it == null) next.streaks.it = 0;
  if (!next.lastStudy || typeof next.lastStudy !== "object") {
    next.lastStudy = { es: store.lastStudyDate || null, it: null };
  }
  if (!next.quotaByLang || typeof next.quotaByLang !== "object") {
    next.quotaByLang = { es: store.quotaDoneOn || null, it: null };
  }
  if (!Array.isArray(next.customVocab)) next.customVocab = [];
  if (!next.customSeq) next.customSeq = next.customVocab.length + 1;
  if (next.typeAnswers == null) next.typeAnswers = false;
    if (next.geminiKey == null) next.geminiKey = "";
    if (next.lang !== "it") next.lang = "es";

  const migrated = {};
  let changed = false;
  Object.entries(next.progress || {}).forEach(([k, v]) => {
    if (k.includes(":")) migrated[k] = v;
    else {
      migrated["es:" + k] = v;
      changed = true;
    }
  });
  if (changed) next.progress = migrated;
  next.unlockedLevel = next.unlocked[next.lang] || 1;
  next.streak = next.streaks[next.lang] || 0;
  next.quotaDoneOn = next.quotaByLang[next.lang] || null;
  return next;
}

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultStore();
    return migrateStore({ ...defaultStore(), ...JSON.parse(raw) });
  } catch {
    return defaultStore();
  }
}

function saveStore(store) {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

function todayStr(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function yesterdayStr() {
  return todayStr(new Date(Date.now() - DAY));
}

function langUnlocked(store) {
  return store.unlocked?.[store.lang] || 1;
}

function setLangUnlocked(store, n) {
  store.unlocked = store.unlocked || { es: 1, it: 1 };
  store.unlocked[store.lang] = n;
  store.unlockedLevel = n;
  return store;
}

function touchStreak(store) {
  const today = todayStr();
  const lang = store.lang || "es";
  store.lastStudy = store.lastStudy || { es: null, it: null };
  store.streaks = store.streaks || { es: 0, it: 0 };
  if (store.lastStudy[lang] === today) {
    store.lastStudyDate = today;
    store.streak = store.streaks[lang] || 0;
    return store;
  }
  if (store.lastStudy[lang] === yesterdayStr()) store.streaks[lang] = (store.streaks[lang] || 0) + 1;
  else store.streaks[lang] = 1;
  store.lastStudy[lang] = today;
  store.lastStudyDate = today;
  store.streak = store.streaks[lang];
  return store;
}

function recordReview(store, correct) {
  store.reviewed += 1;
  if (correct) store.correctTotal += 1;
  const day = todayStr();
  store.byDay[day] = (store.byDay[day] || 0) + 1;
  return maybeCompleteQuota(store);
}

function vocabForLevelCap(level, store) {
  const cap = LEVELS.find((l) => l.id === level)?.words || 100;
  return frequencyVocab(store).filter((_, i) => i < cap);
}

function learnedCount(store, level) {
  const words = vocabForLevelCap(level, store);
  return words.filter((w) => firmlyLearned(getProgress(store, itemKey(store, w)))).length;
}

function completeQuota(store) {
  const today = todayStr();
  const lang = store.lang || "es";
  store.quotaByLang = store.quotaByLang || { es: null, it: null };
  store.streaks = store.streaks || { es: 0, it: 0 };
  store.lastStudy = store.lastStudy || { es: null, it: null };
  if (store.quotaByLang[lang] === today) {
    store.quotaDoneOn = today;
    return store;
  }
  if (store.quotaByLang[lang] === yesterdayStr()) store.streaks[lang] = (store.streaks[lang] || 0) + 1;
  else store.streaks[lang] = 1;
  store.quotaByLang[lang] = today;
  store.lastStudy[lang] = today;
  store.quotaDoneOn = today;
  store.lastStudyDate = today;
  store.streak = store.streaks[lang];
  return store;
}

function maybeCompleteQuota(store) {
  if (store.quotaByLang?.[store.lang] === todayStr()) return store;
  if ((store.byDay[todayStr()] || 0) >= 20) return completeQuota(store);
  return store;
}

function updateUnlock(store) {
  let unlocked = langUnlocked(store);
  while (unlocked < LEVELS.length) {
    const need = vocabForLevelCap(unlocked, store);
    const got = learnedCount(store, unlocked);
    if (need.length && got / need.length >= 0.7) unlocked += 1;
    else break;
  }
  return setLangUnlocked(store, unlocked);
}

function addCustomWord(store, word) {
  store.customVocab = store.customVocab || [];
  store.customSeq = store.customSeq || 1;
  const item = {
    id: "u" + store.customSeq,
    lv: 1,
    custom: true,
    extra: true,
    cat: "custom",
    pos: word.pos || "n",
    de: word.de.trim(),
    es: (word.es || word.word || "").trim(),
    it: (word.it || word.word || "").trim(),
    ex: word.ex || "",
    exit: word.exit || word.ex || "",
    exde: word.exde || ""
  };
  if (store.lang === "it" && !item.it) item.it = item.es;
  if (store.lang === "es" && !item.es) item.es = item.it;
  store.customVocab.push(item);
  store.customSeq += 1;
  return item;
}
