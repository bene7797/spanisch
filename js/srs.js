const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

function defaultProgress() {
  return {
    ease: 2.3,
    interval: 0,
    due: 0,
    reps: 0,
    lapses: 0,
    streak: 0,
    last: 0,
    correct: 0,
    wrong: 0,
    new: true
  };
}

function progressId(itemOrId) {
  if (itemOrId && typeof itemOrId === "object") return itemOrId.sid || itemOrId.id;
  return itemOrId;
}

function getProgress(store, itemOrId) {
  return store.progress[progressId(itemOrId)] || defaultProgress();
}

function isDue(p, now) {
  if (p.new) return false;
  return p.due <= now;
}

function schedule(p, quality, now) {
  const next = { ...p, last: now, new: false };
  if (quality === 0) {
    next.wrong += 1;
    next.lapses += 1;
    next.streak = 0;
    next.reps = 0;
    next.ease = Math.max(1.3, next.ease - 0.2);
    next.interval = 10 * MINUTE;
    next.due = now + 10 * MINUTE;
    return next;
  }

  next.correct += 1;
  next.streak += 1;
  if (quality === 2) next.ease = Math.min(2.8, next.ease + 0.08);
  else next.ease = Math.min(2.6, next.ease + 0.02);

  if (next.reps === 0) next.interval = quality === 2 ? DAY : 12 * 60 * MINUTE;
  else if (next.reps === 1) next.interval = quality === 2 ? 4 * DAY : 2 * DAY;
  else {
    const factor = quality === 2 ? next.ease + 0.15 : next.ease;
    next.interval = Math.round(next.interval * factor);
  }
  next.reps += 1;
  next.due = now + next.interval;
  return next;
}

function dueScore(p, now) {
  if (p.new) return -1;
  const overdue = now - p.due;
  const weak = p.wrong * 2 + (5 - Math.min(5, p.streak));
  return overdue / DAY + weak;
}

function pickNew(items, store, limit) {
  const fresh = items.filter((item) => getProgress(store, item).new);
  fresh.sort((a, b) => (a.rank || 0) - (b.rank || 0));
  return fresh.slice(0, limit);
}

function pickDue(items, store, now) {
  return items
    .map((item) => ({ item, p: getProgress(store, item) }))
    .filter(({ p }) => isDue(p, now))
    .sort((a, b) => dueScore(b.p, now) - dueScore(a.p, now))
    .map(({ item }) => item);
}

function buildQueue(items, store, size) {
  const now = Date.now();
  const due = pickDue(items, store, now);
  const remaining = Math.max(0, size - due.length);
  const news = pickNew(items, store, Math.min(8, remaining || size));
  const queue = [...due, ...news];
  if (queue.length < size) {
    const seen = new Set(queue.map((i) => i.id));
    const extras = items
      .filter((i) => !seen.has(i.id))
      .map((item) => ({ item, p: getProgress(store, item) }))
      .sort((a, b) => a.p.due - b.p.due)
      .map(({ item }) => item)
      .slice(0, size - queue.length);
    queue.push(...extras);
  }
  return queue.slice(0, size);
}

function buildDailyQueue(items, store) {
  const now = Date.now();
  const due = pickDue(items, store, now).slice(0, 12);
  const seen = new Set(due.map((i) => i.id));
  const news = pickNew(items, store, 8).filter((i) => !seen.has(i.id));
  return [...due, ...news];
}

function mastered(p) {
  return !p.new && p.reps >= 2 && p.interval >= 2 * DAY;
}

function firmlyLearned(p) {
  return !p.new && p.reps >= 2 && p.correct >= 2;
}
