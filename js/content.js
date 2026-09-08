function mergeVocab(custom) {
  const base = VOCAB.map((v) => {
    const it = VOCAB_IT[v.id] || {};
    return {
      ...v,
      it: it.it || v.es,
      exit: it.exit || v.ex,
      cat: catsForVocab(v)
    };
  });
  const extra = (typeof VOCAB_EXTRA !== "undefined" ? VOCAB_EXTRA : []).map((v) => ({
    ...v,
    cat: catsForVocab(v)
  }));
  const own = (custom || []).map((v) => ({
    ...v,
    custom: true,
    cat: ["custom"],
    extra: true
  }));
  return [...base, ...extra, ...own];
}

function allVocab(store) {
  return mergeVocab(store?.customVocab);
}

function frequencyVocab(store) {
  return allVocab(store).filter((v) => !v.extra && !v.custom);
}

function vocabByCategory(store, catId) {
  return allVocab(store).filter((v) => (v.cat || []).includes(catId));
}

function activeChunks(store) {
  return (store?.lang === "it" ? CHUNKS_IT : CHUNKS).map((c) => ({ ...c, lang: store?.lang || "es" }));
}

function activeGrammar(store) {
  return store?.lang === "it" ? GRAMMAR_IT : GRAMMAR;
}

function activeSentences(store) {
  return (store?.lang === "it" ? SENTENCES_IT : SENTENCES).map((s) => ({ ...s, lang: store?.lang || "es" }));
}

function activeDialogs(store) {
  return store?.lang === "it" ? DIALOGS_IT : DIALOGS;
}

function findAnyItem(store, id) {
  const bare = String(id).includes(":") ? String(id).split(":").slice(1).join(":") : id;
  return (
    allVocab(store).find((x) => x.id === bare) ||
    activeChunks(store).find((x) => x.id === bare) ||
    activeSentences(store).find((x) => x.id === bare) ||
    activeGrammar(store).flatMap((t) => t.cards).find((x) => x.id === bare) ||
    dialogCardsFor(store, 4).find((x) => x.id === bare)
  );
}

function dialogCardsFor(store, level) {
  const list = activeDialogs(store).filter((d) => d.lv <= level);
  return list.flatMap((d) =>
    d.lines.map((line, i) => ({
      id: d.id + "_q" + i,
      type: "dialog",
      lv: d.lv,
      lang: store?.lang || "es",
      dialogId: d.id,
      dialogTitle: d.title,
      prompt: line.de,
      answer: line.es,
      who: line.who,
      options: dialogOptionsFrom(list, line.es),
      de: line.de,
      why: d.scene + " · " + line.who
    }))
  );
}

function dialogOptionsFrom(dialogs, answer) {
  const pool = dialogs.flatMap((d) => d.lines.map((l) => l.es)).filter((es) => es !== answer);
  const picks = [];
  const copy = pool.slice();
  while (picks.length < 3 && copy.length) {
    const j = Math.floor(Math.random() * copy.length);
    picks.push(copy.splice(j, 1)[0]);
  }
  const opts = [answer, ...picks];
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return opts;
}

function sameLemma(a, b) {
  return foldText(a) === foldText(b);
}

function findExistingVocab(store, de, word) {
  return allVocab(store).find((v) => {
    const l2 = (store.lang === "it" ? v.it : v.es) || v.es;
    return sameLemma(v.de, de) && sameLemma(l2, word);
  });
}
