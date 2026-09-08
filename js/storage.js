const STORE_KEY = "palabra-v1";

function defaultStore() {
  return {
    progress: {},
    streak: 0,
    lastStudyDate: null,
    unlockedLevel: 1,
    sessionSize: 12,
    direction: "es-de",
    reminders: false,
    speechOn: false,
    quotaDoneOn: null,
    lastNotifyDate: null,
    reviewed: 0,
    correctTotal: 0,
    byDay: {},
    installHintDismissed: false,
    name: ""
  };
}

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultStore();
    return { ...defaultStore(), ...JSON.parse(raw) };
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

function touchStreak(store) {
  const today = todayStr();
  if (store.lastStudyDate === today) return store;
  if (store.lastStudyDate === yesterdayStr()) store.streak += 1;
  else store.streak = 1;
  store.lastStudyDate = today;
  return store;
}

function recordReview(store, correct) {
  store.reviewed += 1;
  if (correct) store.correctTotal += 1;
  const day = todayStr();
  store.byDay[day] = (store.byDay[day] || 0) + 1;
  return maybeCompleteQuota(store);
}

function vocabForLevelCap(level) {
  const cap = LEVELS.find((l) => l.id === level)?.words || 100;
  return VOCAB.filter((_, i) => i < cap);
}

function learnedCount(store, level) {
  const words = vocabForLevelCap(level);
  return words.filter((w) => firmlyLearned(getProgress(store, w.id))).length;
}

function completeQuota(store) {
  const today = todayStr();
  if (store.quotaDoneOn === today) return store;
  if (store.quotaDoneOn === yesterdayStr()) store.streak += 1;
  else store.streak = 1;
  store.quotaDoneOn = today;
  store.lastStudyDate = today;
  return store;
}

function maybeCompleteQuota(store) {
  if (store.quotaDoneOn === todayStr()) return store;
  if ((store.byDay[todayStr()] || 0) >= 20) return completeQuota(store);
  return store;
}

function updateUnlock(store) {
  let unlocked = store.unlockedLevel;
  while (unlocked < LEVELS.length) {
    const need = vocabForLevelCap(unlocked);
    const got = learnedCount(store, unlocked);
    if (got / need.length >= 0.7) unlocked += 1;
    else break;
  }
  store.unlockedLevel = unlocked;
  return store;
}
