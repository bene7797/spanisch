(() => {
  const app = document.getElementById("app");
  let store = loadStore();
  let deferredPrompt = null;
  let standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;

  const ui = {
    view: "home",
    session: null,
    topicId: null,
    lessonIndex: 0,
    dialogId: null,
    dialogLine: 0,
    dialogShowDe: false,
    toast: "",
    formsLockUntil: 0,
    listenNote: "",
    speechPhase: "idle",
    speakLoadGen: 0,
    speechStatus: { phase: "idle", pct: 0, label: "" },
    modelProgress: { pct: 0, label: "" },
    catId: null,
    addForm: { de: "", word: "", pos: "n" }
  };

  let drag = null;
  let swipeLock = false;
  let lastPaint = { view: "", card: "" };
  let listenGuardUntil = 0;

  function el(html) {
    return html;
  }

  function esc(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function persist() {
    store = updateUnlock(store);
    saveStore(store);
  }

  function switchLang(next) {
    if (next !== "es" && next !== "it") return;
    PalabraSpeech.cancel();
    ui.speechPhase = "idle";
    ui.session = null;
    store.lang = next;
    store.unlockedLevel = langUnlocked(store);
    store.streak = store.streaks?.[next] || 0;
    store.quotaDoneOn = store.quotaByLang?.[next] || null;
    persist();
    render();
  }

  function saveCustomWord() {
    const f = ui.addForm || {};
    const de = String(f.de || "").trim();
    const word = String(f.word || "").trim();
    if (!de || !word) {
      ui.toast = "Deutsch und die Übersetzung brauchen beide einen Eintrag.";
      ui.view = "add-word";
      render();
      return;
    }
    const existing = findExistingVocab(store, de, word);
    if (existing) {
      ui.toast = "Gibt’s schon – Fortschritt bleibt am vorhandenen Wort hängen.";
      ui.catId = (existing.cat && existing.cat[0]) || null;
      ui.view = "vocab-cats";
      render();
      return;
    }
    const item = addCustomWord(store, {
      de,
      word,
      es: store.lang === "es" ? word : "",
      it: store.lang === "it" ? word : word,
      pos: f.pos || "n"
    });
    persist();
    ui.addForm = { de: "", word: "", pos: "n" };
    ui.toast = "Gespeichert: " + item.de + " → " + (store.lang === "it" ? item.it : item.es);
    ui.view = "vocab-cats";
    render();
  }

  function greeting() {
    return langOf(store).greet(new Date().getHours());
  }

  function langCode() {
    return langOf(store).code;
  }

  function tagItem(item) {
    const loc = localizeItem(item, store.lang);
    return { ...loc, sid: itemKey(store, loc) };
  }

  function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const bar = document.querySelector(".speak-bar");
    if (bar) bar.classList.add("playing");
    const u = new SpeechSynthesisUtterance(text);
    const L = langOf(store);
    u.lang = L.tts;
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find((v) => v.lang.toLowerCase().startsWith(L.voicePrefix));
    if (match) u.voice = match;
    u.onend = u.onerror = () => bar && bar.classList.remove("playing");
    window.speechSynthesis.speak(u);
  }

  function vocabItems(level, catId, packLevel) {
    const src = catId ? vocabByCategory(store, catId).filter((v) => v.custom || v.lv <= level) : vocabForLevelCap(packLevel || level, store);
    return src.map((v, i) => {
      const loc = tagItem(v);
      return { ...loc, type: "vocab", rank: i + 1, es: withArticle(loc) };
    });
  }

  function chunkItems(level) {
    return activeChunks(store)
      .filter((c) => c.lv <= level)
      .map((c, i) => ({ ...tagItem(c), type: "chunk", pos: "phr", rank: i + 1 }));
  }

  function grammarItems(level, topicId) {
    return activeGrammar(store)
      .filter((t) => t.lv <= level && (!topicId || t.id === topicId))
      .flatMap((t) => t.cards.map((c) => tagItem({ ...c, type: "grammar", lv: t.lv, topicId: t.id, topicTitle: t.title })));
  }

  function sentenceItems(level) {
    return activeSentences(store)
      .filter((s) => s.lv <= level)
      .map((s) => tagItem({ ...s, type: "sentence" }));
  }

  function poolFor(mode, topicId, catId, packLevel) {
    const level = langUnlocked(store);
    if (mode === "vocab") return vocabItems(level, catId, packLevel);
    if (mode === "chunk") return chunkItems(level);
    if (mode === "grammar") return grammarItems(level);
    if (mode === "sentence") return sentenceItems(level);
    if (mode === "dialog") return dialogCardsFor(store, level);
    if (mode === "topic") return grammarItems(level, topicId);
    if (mode === "speak") return [...vocabItems(level), ...chunkItems(level)];
    return [...vocabItems(level), ...chunkItems(level), ...grammarItems(level), ...sentenceItems(level)];
  }

  function isCardItem(item) {
    return item && (item.type === "vocab" || item.type === "chunk");
  }

  function shouldType(item) {
    if (!isCardItem(item)) return false;
    if (ui.session?.mode === "speak") return false;
    return Boolean(store.typeAnswers) && store.direction === "de-es";
  }

  function isSpeakMode() {
    return ui.session?.mode === "speak";
  }

  function displayEs(item) {
    if (item.pos === "n") return withArticle(item);
    return item.es;
  }

  function dueCount(mode) {
    if (mode === "daily") return buildDailyQueue(poolFor("mixed"), store).length;
    return buildQueue(poolFor(mode), store, store.sessionSize).length;
  }

  function startSession(mode, opts = {}) {
    const items = (mode === "dialog" && opts.dialogId
      ? poolFor("dialog").filter((i) => i.dialogId === opts.dialogId)
      : poolFor(mode === "daily" ? "mixed" : mode, opts.topicId, opts.catId, opts.packLevel));
    const queue = opts.forceAll
      ? shuffle(items).slice(0, Math.max(items.length, 1))
      : mode === "daily"
        ? buildDailyQueue(items, store)
        : buildQueue(items, store, store.sessionSize);
    if (!queue.length) {
      ui.toast = "Gerade nichts Fälliges – neue Karten kommen mit dem nächsten Level.";
      ui.view = "home";
      render();
      return;
    }
    ui.session = {
      mode,
      topicId: opts.topicId || null,
      catId: opts.catId || null,
      packLevel: opts.packLevel || null,
      queue,
      index: 0,
      correct: 0,
      wrong: 0,
      flipped: false,
      answered: false,
      chosen: null,
      showTrans: false,
      showForms: false,
      typed: "",
      typeResult: null,
      listenNote: "",
      options: shuffleOptions(queue[0])
    };
    ui.view = "study";
    render();
  }

  function shuffleOptions(item) {
    if (!item.options) return null;
    return shuffle(item.options);
  }

  function currentItem() {
    return ui.session?.queue[ui.session.index] || null;
  }

  function applyAnswer(quality, opts = {}) {
    const item = currentItem();
    if (!item || !ui.session || ui.session.answered) return;
    const now = Date.now();
    const prev = getProgress(store, item);
    store.progress[item.sid || itemKey(store, item)] = schedule(prev, quality, now);
    store = recordReview(store, quality > 0);
    persist();
    ui.session.answered = true;
    ui.session.chosen = quality;
    if (quality > 0) ui.session.correct += 1;
    else {
      ui.session.wrong += 1;
      const q = ui.session.queue;
      const insertAt = Math.min(q.length, ui.session.index + 3);
      q.splice(insertAt, 0, item);
    }
    if (!opts.silent && !patchStudyAnswer()) render();
  }

  function nextCard() {
    if (!ui.session) return;
    ui.session.index += 1;
    if (ui.session.index >= ui.session.queue.length) {
      PalabraSpeech.cancel();
      ui.speechPhase = "idle";
      if (ui.session.mode === "daily") {
        store = completeQuota(store);
        persist();
      }
      ui.view = "result";
      render();
      return;
    }
    ui.session.flipped = false;
    ui.session.answered = false;
    ui.session.chosen = null;
    ui.session.showTrans = false;
    ui.session.showForms = false;
    ui.session.typed = "";
    ui.session.typeResult = null;
    ui.session.listenNote = "";
    ui.speechPhase = "idle";
    PalabraSpeech.cancel();
    ui.session.options = shuffleOptions(currentItem());
    render();
  }

  function setStamps(wrap, dx, dy) {
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    let pNo = 0;
    let pYes = 0;
    let pEasy = 0;
    if (absY > absX && dy < 0) pEasy = Math.min(1, -dy / 88);
    else if (dx > 12) pYes = Math.min(1, dx / 88);
    else if (dx < -12) pNo = Math.min(1, -dx / 88);
    const no = wrap.querySelector(".stamp-no");
    const yes = wrap.querySelector(".stamp-yes");
    const easy = wrap.querySelector(".stamp-easy");
    if (no) no.style.opacity = pNo;
    if (yes) yes.style.opacity = pYes;
    if (easy) easy.style.opacity = pEasy;
  }

  function snapBack(wrap) {
    wrap.style.transition = "transform 0.28s ease";
    wrap.style.transform = "";
    setStamps(wrap, 0, 0);
  }

  function commitSwipe(quality, wrap, fly) {
    if (swipeLock || !ui.session || ui.session.answered) return;
    swipeLock = true;
    wrap.style.transition = "transform 0.32s ease, opacity 0.32s ease";
    wrap.style.transform =
      fly === "left"
        ? "translate(-140%, 32px) rotate(-24deg)"
        : fly === "right"
          ? "translate(140%, 32px) rotate(24deg)"
          : "translate(0, -145%) rotate(-8deg)";
    wrap.style.opacity = "0";
    if (navigator.vibrate) navigator.vibrate(10);
    window.setTimeout(() => {
      applyAnswer(quality, { silent: true });
      swipeLock = false;
      nextCard();
    }, 260);
  }

  function onSwipeMove(e) {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (Math.hypot(dx, dy) > 10) drag.moved = true;
    drag.wrap.style.transition = "none";
    drag.wrap.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx * 0.07}deg)`;
    setStamps(drag.wrap, dx, dy);
  }

  function endSwipe(e) {
    if (!drag) return;
    const { wrap, x, y, moved } = drag;
    const dx = (e.clientX ?? x) - x;
    const dy = (e.clientY ?? y) - y;
    drag = null;
    window.removeEventListener("pointermove", onSwipeMove);
    window.removeEventListener("pointerup", endSwipe);
    window.removeEventListener("pointercancel", endSwipe);
    if (swipeLock) return;

    if (isSpeakMode()) {
      snapBack(wrap);
      if (!moved && ui.session) {
        ui.session.flipped = !ui.session.flipped;
        wrap.querySelector(".flip-card")?.classList.toggle("flipped", ui.session.flipped);
      }
      return;
    }

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const tX = Math.max(72, wrap.clientWidth * 0.2);
    const tY = 78;

    if (dy < -tY && absY > absX) {
      commitSwipe(2, wrap, "up");
      return;
    }
    if (dx > tX && absX >= absY * 0.85) {
      commitSwipe(1, wrap, "right");
      return;
    }
    if (dx < -tX && absX >= absY * 0.85) {
      commitSwipe(0, wrap, "left");
      return;
    }

    snapBack(wrap);
    if (!moved && ui.session && !ui.session.answered) {
      ui.session.flipped = !ui.session.flipped;
      wrap.querySelector(".flip-card")?.classList.toggle("flipped", ui.session.flipped);
    }
  }

  function nav(active) {
    return `
      <nav class="nav">
        <button data-go="home" class="${active === "home" ? "active" : ""}"><span class="glyph">⌂</span>Home</button>
        <button data-go="learn" class="${active === "learn" ? "active" : ""}"><span class="glyph">✦</span>Lernen</button>
        <button data-go="grammar" class="${active === "grammar" ? "active" : ""}"><span class="glyph">☰</span>Grammatik</button>
        <button data-go="stats" class="${active === "stats" ? "active" : ""}"><span class="glyph">◉</span>Fortschritt</button>
      </nav>`;
  }

  function installBanner() {
    if (standalone || store.installHintDismissed) return "";
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (deferredPrompt) {
      return `<div class="install-banner">
        <b>Zum Home-Bildschirm</b>
        Palabra lässt sich wie eine App installieren – offline, ohne Account.
        <button class="btn btn-primary" data-act="install" style="margin-top:10px">App installieren</button>
      </div>`;
    }
    if (ios) {
      return `<div class="install-banner">
        <b>Zum Home-Bildschirm</b>
        Tippe auf Teilen (□↑) und dann auf <b>Zum Home-Bildschirm</b>.
        <button class="btn btn-ghost" data-act="dismiss-install" style="margin-top:10px">Verstanden</button>
      </div>`;
    }
    return `<div class="install-banner">
      <b>Zum Home-Bildschirm</b>
      Im Browser-Menü „App installieren“ oder „Zum Startbildschirm hinzufügen“ wählen.
      <button class="btn btn-ghost" data-act="dismiss-install" style="margin-top:10px">Verstanden</button>
    </div>`;
  }

  function renderHome() {
    const cap = vocabForLevelCap(langUnlocked(store), store);
    const learned = learnedCount(store, langUnlocked(store));
    const pct = Math.round((learned / Math.max(1, cap.length)) * 100);
    const level = LEVELS[langUnlocked(store) - 1];
    const daily = dueCount("daily");
    const quotaDone = store.quotaDoneOn === todayStr();
    const today = store.byDay[todayStr()] || 0;
    return `
      <div class="screen">
        <div class="topbar">
          <div class="brand">Palabra</div>
          <div class="spacer"></div>
          <div class="lang-switch" role="group" aria-label="Sprache">
            <button data-act="set-lang" data-lang="es" class="${store.lang === "es" ? "on" : ""}">ES</button>
            <button data-act="set-lang" data-lang="it" class="${store.lang === "it" ? "on" : ""}">IT</button>
          </div>
          <button class="icon-btn" data-go="settings" title="Einstellungen">⚙</button>
        </div>
        <div class="greeting">
          <div class="hello">${greeting()}.</div>
          <p>${quotaDone ? "Tagespensum sitzt. Streak läuft." : "Heute: 12 fällige plus bis zu 8 neue Karten · " + langOf(store).name + "."}</p>
        </div>
        <div class="dir-switch" role="group" aria-label="Kartenrichtung">
          <button class="dir-btn ${store.direction === "es-de" ? "on" : ""}" data-act="set-dir" data-dir="es-de">
            <b>${langCode()} → DE</b>
            <span>sehen und wischen</span>
          </button>
          <button class="dir-btn ${store.direction === "de-es" ? "on" : ""}" data-act="set-dir" data-dir="de-es">
            <b>DE → ${langCode()}</b>
            <span>übersetzen${store.typeAnswers ? " · tippen an" : ""}</span>
          </button>
        </div>
        <div class="hero">
          <div class="hero-kicker">${esc(level.name)} · ${esc(level.subtitle)}</div>
          <h2>${quotaDone ? "Pensum erledigt" : daily ? daily + " Karten im Pensum" : "Nichts Fälliges"}</h2>
          <div class="progress"><span style="width:${quotaDone ? 100 : pct}%"></span></div>
          <div class="hero-meta"><span>${learned} / ${cap.length} sitzen wirklich</span><span>${pct}%</span></div>
          <button class="btn" data-act="start" data-mode="${quotaDone ? "mixed" : "daily"}" style="margin-top:16px;background:#fffaf3;color:#9a3412" ${!daily && !quotaDone ? "disabled" : ""}>${quotaDone ? "Extra-Runde" : "Tagespensum"}</button>
        </div>
        <div class="stats-row">
          <div class="stat"><b>${store.streak}</b><span>Tage Pensum</span></div>
          <div class="stat"><b>${today}</b><span>Heute</span></div>
          <div class="stat"><b>${langUnlocked(store)}/4</b><span>Level offen</span></div>
        </div>
        <div class="grid-2">
          <button class="tile" data-go="vocab-cats">
            <div class="emoji">Aa</div>
            <div><h3>Vokabeln</h3><p>Listen, Kategorien, eigene Wörter</p></div>
          </button>
          <button class="tile" data-act="start" data-mode="chunk">
            <div class="emoji">❝</div>
            <div><h3>Brocken</h3><p>Fertige Wendungen</p></div>
          </button>
          <button class="tile" data-go="dialogs">
            <div class="emoji">☰</div>
            <div><h3>Dialoge</h3><p>Café, Weg, Hotel…</p></div>
          </button>
          <button class="tile" data-act="start" data-mode="sentence">
            <div class="emoji">…</div>
            <div><h3>Sätze</h3><p>1 von 4 Optionen</p></div>
          </button>
        </div>
        ${installBanner()}
        ${ui.toast ? `<p class="muted small" style="margin-top:12px">${esc(ui.toast)}</p>` : ""}
        <button class="tile tile-wide" data-act="start" data-mode="speak">
          <div class="emoji">🎙</div>
          <div><h3>Nachsprechen</h3><p>Deutsch sehen, ${langOf(store).name} sagen</p></div>
        </button>
        ${nav("home")}
      </div>`;
  }

  function renderLearn() {
    return `
      <div class="screen">
        <div class="topbar"><h1>Lernen</h1></div>
        <p class="muted" style="margin-bottom:16px">Eine Sektion, Brocken, Dialoge oder alles gemischt.</p>
        <button class="tile" style="width:100%;margin-bottom:12px" data-act="start" data-mode="daily">
          <div class="emoji">✦</div>
          <div><h3>Tagespensum</h3><p>${dueCount("daily")} Karten · Streak nur bei Pensum</p></div>
        </button>
        <div class="grid-2">
          <button class="tile" data-go="vocab-cats"><h3>Vokabeln</h3><p>Kategorien & Listen</p></button>
          <button class="tile" data-act="start" data-mode="chunk"><h3>Brocken</h3><p>${dueCount("chunk")}</p></button>
          <button class="tile" data-act="start" data-mode="sentence"><h3>Sätze</h3><p>${dueCount("sentence")}</p></button>
          <button class="tile" data-go="dialogs"><h3>Dialoge</h3><p>Zeilen durchgehen</p></button>
          <button class="tile" data-act="start" data-mode="grammar"><h3>Grammatik</h3><p>${dueCount("grammar")}</p></button>
          <button class="tile" data-act="start" data-mode="mixed"><h3>Gemischt</h3><p>${dueCount("mixed")}</p></button>
        </div>
        <button class="tile tile-wide" data-act="start" data-mode="speak">
          <div class="emoji">🎙</div>
          <div><h3>Nachsprechen</h3><p>Deutsch → ${langOf(store).name} sagen</p></div>
        </button>
        ${nav("learn")}
      </div>`;
  }

  function topicButton(t, locked) {
    const due = t.cards.filter((c) => {
      const p = getProgress(store, { id: c.id, sid: itemKey(store, { id: c.id, lang: store.lang }) });
      return p.new || isDue(p, Date.now());
    }).length;
    return `<button class="topic ${locked ? "locked" : ""} ${t.featured ? "featured" : ""}" data-topic="${t.id}" ${locked ? "disabled" : ""}>
      <h3>${esc(t.title)}</h3>
      <span class="lvl">${t.cards.length} Karten</span>
      <p>${esc(t.summary)}</p>
      <span class="muted small">${due} zu üben</span>
    </button>`;
  }

  function renderGrammar() {
    const featured = activeGrammar(store).filter((t) => t.featured);
    const groups = [1, 2, 3, 4];
    const blocks = groups.map((lv) => {
      const locked = lv > langUnlocked(store);
      const topics = activeGrammar(store).filter((t) => t.lv === lv && !t.featured);
      if (!topics.length) return "";
      return `
        <div class="section-title">Nivel ${lv}${locked ? " · noch gesperrt" : ""}</div>
        ${topics.map((t) => topicButton(t, locked)).join("")}`;
    });
    return `
      <div class="screen">
        <div class="topbar"><h1>Grammatik</h1></div>
        <p class="muted" style="margin-bottom:8px">Erst die Regel durchgehen, dann einzelne Formen abfragen. Auf der Karte tippen zeigt die Übersetzung.</p>
        <div class="section-title">Zum Einprägen</div>
        ${featured.map((t) => topicButton(t, false)).join("")}
        ${blocks.join("")}
        ${nav("grammar")}
      </div>`;
  }

  function renderTopic() {
    const topic = activeGrammar(store).find((t) => t.id === ui.topicId);
    if (!topic) return renderGrammar();
    const slide = topic.lessons[ui.lessonIndex];
    const last = ui.lessonIndex === topic.lessons.length - 1;
    return `
      <div class="screen no-nav">
        <div class="topbar">
          <button class="icon-btn" data-go="grammar">←</button>
          <div>
            <div class="small muted">${topic.featured ? "Zum Einprägen" : "Nivel " + topic.lv}</div>
            <strong>${esc(topic.title)}</strong>
          </div>
        </div>
        <div class="lesson">
          <div class="tag">Regel ${ui.lessonIndex + 1} / ${topic.lessons.length}</div>
          <h2>${esc(slide.title)}</h2>
          <div class="body">${esc(slide.body)}</div>
        </div>
        <div class="dots">${topic.lessons.map((_, i) => `<i class="${i === ui.lessonIndex ? "on" : ""}"></i>`).join("")}</div>
        <div class="grid-2">
          <button class="btn btn-ghost" data-act="lesson-prev" ${ui.lessonIndex === 0 ? "disabled" : ""}>Zurück</button>
          ${last
            ? `<button class="btn btn-primary" data-act="practice-topic">Jetzt üben</button>`
            : `<button class="btn btn-primary" data-act="lesson-next">Weiter</button>`}
        </div>
        ${last ? "" : `<button class="btn btn-ghost" data-act="practice-topic" style="margin-top:10px">Direkt üben</button>`}
      </div>`;
  }

  function renderVocabCard(item) {
    const typing = shouldType(item);
    const es = displayEs(item);
    const speakMode = isSpeakMode();
    const deFront = speakMode ? true : store.direction === "de-es";
    if (speakMode) {
      return `
      <div class="card-scene">
        <div class="swipe-wrap">
          <div class="flip-card ${ui.session.flipped ? "flipped" : ""}">
            <div class="face">
              <span class="tag">${esc(POS_DE[item.pos] || item.pos)} · DE</span>
              <div class="word">${esc(item.de)}</div>
              <p class="muted small">Sag das auf ${esc(langOf(store).name)}. Tippen zeigt die Lösung.</p>
            </div>
            <div class="face back">
              <span class="tag">${langCode()}</span>
              <div class="word">${esc(es)}</div>
              ${item.ex ? `<p class="example"><em>${esc(item.ex)}</em></p>` : ""}
              ${item.exde ? `<p class="example">${esc(item.exde)}</p>` : ""}
            </div>
          </div>
        </div>
      </div>
      ${
        ui.session.answered
          ? `<div class="feedback ${ui.session.chosen ? "ok" : "no"}">${esc(ui.session.listenNote || "")}</div>
             <button class="btn btn-primary" data-act="next">Weiter</button>`
          : `${speechStatusCard()}
             <p class="listen-note">${esc(ui.session.listenNote || "")}</p>
             <button class="mic-btn ${ui.speechPhase === "recording" ? "rec-on" : ""} ${ui.speechPhase === "busy" ? "busy-on" : ""}" data-act="listen-say">${speechBtnLabel()}</button>
             ${
               ui.speechPhase !== "idle"
                 ? `<button class="btn btn-ghost" data-act="cancel-listen" style="margin-top:10px">Erkennung abbrechen</button>`
                 : ""
             }
             <button class="btn btn-ghost danger" data-act="abort" style="margin-top:8px">Runde beenden</button>`
      }`;
    }
    if (typing) {
      return `
      <button class="speak-bar" data-act="speak" data-say="${esc(es)}">
        <span class="speak-icon">🔊</span>
        Anhören
      </button>
      <div class="prompt-card type-card">
        <span class="tag">${esc(POS_DE[item.pos] || item.pos)} · Nivel ${item.lv}</span>
        <div class="word" style="margin-top:10px">${esc(item.de)}</div>
        <p class="muted small">Schreib die ${esc(langOf(store).name.toLowerCase())}e Form${item.pos === "n" ? " mit Artikel" : ""}.</p>
        ${
          ui.session.answered
            ? `<p class="card-de">${esc(es)}</p>
               <div class="feedback ${ui.session.chosen ? "ok" : "no"}">${esc(ui.session.typeResult || "")}</div>
               <button class="btn btn-primary" data-act="next">Weiter</button>`
            : `<input class="type-input" data-type-input="1" type="text" autocapitalize="off" autocomplete="off" spellcheck="false" placeholder="${store.lang === "it" ? "italiano…" : "español…"}" value="${esc(ui.session.typed || "")}" />
               <button class="btn btn-primary" data-act="type-submit" style="margin-top:10px">Prüfen</button>`
        }
      </div>`;
    }
    const front = deFront ? item.de : es;
    const back = deFront ? es : item.de;
    return `
      <button class="speak-bar" data-act="speak" data-say="${esc(es)}">
        <span class="speak-icon">🔊</span>
        Anhören
      </button>
      <div class="card-scene">
        <div class="swipe-wrap">
          <div class="stamp stamp-yes">Richtig</div>
          <div class="stamp stamp-no">Falsch</div>
          <div class="stamp stamp-easy">Sitzt</div>
          <div class="flip-card ${ui.session.flipped ? "flipped" : ""}">
            <div class="face">
              <span class="tag">${esc(POS_DE[item.pos] || item.pos)} · Nivel ${item.lv} · ${deFront ? "DE" : langCode()}</span>
              <div class="word">${esc(front)}</div>
              <p class="muted small">Tippen zum Umdrehen</p>
            </div>
            <div class="face back">
              <span class="tag">${deFront ? langCode() : "DE"}</span>
              <div class="word">${esc(back)}</div>
              ${item.ex ? `<p class="example"><em>${esc(item.ex)}</em></p>` : ""}
              ${item.exde ? `<p class="example">${esc(item.exde)}</p>` : ""}
            </div>
          </div>
        </div>
      </div>
      <div class="swipe-hint">
        <span class="no">← falsch</span>
        <span class="easy">↑ sitzt</span>
        <span class="yes">richtig →</span>
      </div>`;
  }

  function renderFormsModal(forms) {
    return `<div class="forms-modal" data-act="close-forms">
      <div class="forms-sheet" data-act="forms-noop">
        <div class="forms-sheet-head">
          <div class="tag">${esc(forms.title)}</div>
          <button class="icon-btn" data-act="close-forms" aria-label="Schließen">×</button>
        </div>
        <table class="table">${forms.rows.map((r) => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join("")}</table>
      </div>
    </div>`;
  }

  function choiceTag(item) {
    if (item.topicTitle) return esc(item.topicTitle);
    if (item.dialogTitle) return esc(item.dialogTitle);
    return "Satz · Nivel " + item.lv;
  }

  function choicePromptHtml(item, filled) {
    if (item.type === "sentence") {
      return item.text.replace("___", `<span class="blank">${filled ? esc(item.answer) : ""}</span>`);
    }
    return esc(item.prompt);
  }

  function renderPromptFlip({ tag, body, de, flipped, extra = "" }) {
    const canFlip = Boolean(de);
    return `
      <div class="prompt-scene">
        <button class="prompt-flip ${flipped ? "flipped" : ""}" data-act="toggle-trans" ${canFlip ? "" : "disabled"}>
          <div class="prompt-face">
            <span class="tag">${tag}</span>
            <div class="sentence" style="margin-top:12px">${body}</div>
            ${extra}
            ${canFlip ? `<p class="muted small trans-hint">Karte tippen: Übersetzung</p>` : ""}
          </div>
          ${
            canFlip
              ? `<div class="prompt-face back">
            <span class="tag">${tag}</span>
            <div class="sentence" style="margin-top:12px">${body}</div>
            ${extra}
            <p class="card-de">${esc(de)}</p>
          </div>`
              : ""
          }
        </button>
      </div>`;
  }

  function renderChoice(item) {
    const filled = Boolean(ui.session.answered);
    const prompt = choicePromptHtml(item, filled);
    const options = ui.session.options || item.options;
    const chosenWrong = filled && ui.session.chosen === 0;
    const showDe = Boolean(item.de) && (ui.session.showTrans || filled);
    const hint = item.hint ? `<p class="muted small" style="margin-top:10px">${esc(item.hint)}</p>` : "";
    return `
      ${renderPromptFlip({ tag: choiceTag(item), body: prompt, de: item.de, flipped: showDe, extra: hint })}
      <div class="options">
        ${options
          .map((opt) => {
            let cls = "option";
            if (filled) {
              if (opt === item.answer) cls += " correct";
              else if (opt === ui.session.picked) cls += " wrong";
            }
            return `<button class="${cls}" data-act="choose" data-val="${esc(opt)}" ${filled ? "disabled" : ""}>${esc(opt)}</button>`;
          })
          .join("")}
      </div>
      <div class="answer-slot">
      ${
        filled
          ? `<div class="feedback ${chosenWrong ? "no" : "ok"}">${chosenWrong ? "Noch mal öfter." : "Sitzt."} ${esc(item.why || "")}</div>
             <button class="btn btn-primary" data-act="next">Weiter</button>`
          : ""
      }
      </div>`;
  }

  function patchChoiceAnswer(item) {
    const root = app.querySelector(".screen");
    if (!root?.querySelector(".options") || ui.view !== "study") return false;
    root.querySelectorAll(".blank").forEach((el) => {
      el.textContent = item.answer || "";
    });
    root.querySelectorAll(".option").forEach((btn) => {
      btn.disabled = true;
      btn.classList.toggle("correct", btn.dataset.val === item.answer);
      btn.classList.toggle("wrong", btn.dataset.val === ui.session.picked && btn.dataset.val !== item.answer);
    });
    if (item.de) {
      ui.session.showTrans = true;
      root.querySelector(".prompt-flip")?.classList.add("flipped");
    }
    const chosenWrong = ui.session.chosen === 0;
    const slot = root.querySelector(".answer-slot");
    if (slot) {
      slot.innerHTML = `<div class="feedback ${chosenWrong ? "no" : "ok"} pop-in">${chosenWrong ? "Noch mal öfter." : "Sitzt."} ${esc(item.why || "")}</div>
        <button class="btn btn-primary pop-in" data-act="next">Weiter</button>`;
    }
    return true;
  }

  function patchTypedAnswer(item) {
    const card = app.querySelector(".type-card");
    if (!card) return false;
    card.querySelector(".type-input")?.remove();
    card.querySelector("[data-act='type-submit']")?.remove();
    const box = document.createElement("div");
    box.innerHTML = `<p class="card-de pop-in">${esc(displayEs(item))}</p>
      <div class="feedback ${ui.session.chosen ? "ok" : "no"} pop-in">${esc(ui.session.typeResult || "")}</div>
      <button class="btn btn-primary pop-in" data-act="next">Weiter</button>`;
    while (box.firstChild) card.appendChild(box.firstChild);
    return true;
  }

  function patchSpeakAnswer() {
    const screen = app.querySelector(".screen.study-speak");
    if (!screen) return false;
    screen.querySelector(".speech-live")?.remove();
    screen.querySelector(".listen-note")?.remove();
    screen.querySelectorAll("[data-act='cancel-listen']").forEach((el) => el.remove());
    screen.querySelector(".mic-btn")?.remove();
    screen.querySelectorAll("button[data-act='abort']:not(.icon-btn)").forEach((el) => el.remove());
    let slot = screen.querySelector(".answer-slot");
    if (!slot) {
      slot = document.createElement("div");
      slot.className = "answer-slot";
      screen.querySelector(".card-scene")?.after(slot);
    }
    slot.innerHTML = `<div class="feedback ${ui.session.chosen ? "ok" : "no"} pop-in">${esc(ui.session.listenNote || "")}</div>
      <button class="btn btn-primary pop-in" data-act="next">Weiter</button>`;
    return true;
  }

  function patchStudyAnswer() {
    const item = currentItem();
    if (!item || ui.view !== "study") return false;
    if (isSpeakMode()) return patchSpeakAnswer();
    if (shouldType(item)) return patchTypedAnswer(item);
    if (isCardItem(item)) return false;
    return patchChoiceAnswer(item);
  }

  function flipPromptCard(on) {
    const flip = app.querySelector(".prompt-flip");
    if (!flip) return false;
    flip.classList.toggle("flipped", Boolean(on));
    return true;
  }

  function renderStudy() {
    const item = currentItem();
    if (!item) return renderHome();
    const s = ui.session;
    const pct = Math.round((s.index / s.queue.length) * 100);
    const labels = { vocab: "Vokabeln", grammar: "Grammatik", sentence: "Sätze", mixed: "Gemischt", topic: "Thema", chunk: "Brocken", daily: "Pensum", dialog: "Dialog", speak: "Nachsprechen" };
    const forms = isCardItem(item) && !isSpeakMode() ? getWordForms(item) : null;
    return `
      <div class="screen no-nav ${isCardItem(item) ? "study-vocab" : ""} ${isSpeakMode() ? "study-speak" : ""}">
        <div class="session-top">
          <button class="icon-btn" data-act="abort">×</button>
          <span class="chip">${labels[s.mode] || "Runde"}</span>
          ${forms ? `<button class="tool-btn forms-open" data-act="toggle-forms">Alle Formen</button>` : ""}
          <span class="session-count">${s.index + 1} / ${s.queue.length}</span>
        </div>
        <div class="thin-progress"><span style="width:${pct}%"></span></div>
        <div class="study-body">
        ${isCardItem(item) ? renderVocabCard(item) : renderChoice(item)}
        </div>
      </div>
      ${s.showForms && forms ? renderFormsModal(forms) : ""}`;
  }

  function renderResult() {
    const s = ui.session;
    const total = s.correct + s.wrong;
    const pct = total ? Math.round((s.correct / total) * 100) : 0;
    return `
      <div class="screen">
        <div class="result-hero">
          <div class="muted">Runde vorbei</div>
          <div class="score">${pct}%</div>
          <p>${s.correct} richtig · ${s.wrong} nochmal einplanen</p>
        </div>
        <p class="muted" style="text-align:center;margin:12px 0 18px">${s.mode === "daily" ? "Tagespensum zählt für den Streak." : "Falsche Karten kommen früher wieder."} Streak: ${store.streak} Tage.</p>
        <button class="btn btn-primary" data-act="start" data-mode="${s.mode === "daily" ? "mixed" : s.mode}" data-topic="${s.topicId || ""}" data-cat="${s.catId || ""}" data-pack="${s.packLevel || ""}">Noch eine Runde</button>
        <button class="btn btn-ghost" data-go="home" style="margin-top:10px">Zur Übersicht</button>
        ${nav("learn")}
      </div>`;
  }

  function renderStats() {
    const prefix = (store.lang || "es") + ":";
    const weak = Object.entries(store.progress)
      .filter(([id]) => id.startsWith(prefix))
      .map(([id, p]) => ({ id: id.slice(prefix.length), p }))
      .filter(({ p }) => p.wrong > p.correct && !p.new)
      .sort((a, b) => b.p.wrong - a.p.wrong)
      .slice(0, 8);
    const lookup = [...allVocab(store), ...activeChunks(store), ...activeSentences(store), ...activeGrammar(store).flatMap((t) => t.cards), ...dialogCardsFor(store, 4)];
    const rows = weak.map(({ id }) => {
      const item = lookup.find((x) => x.id === id);
      if (!item) return "";
      const left = (store.lang === "it" ? item.it : item.es) || item.es || item.prompt || item.text;
      const right = item.de || item.answer;
      return `<div class="row"><span class="es">${esc(left)}</span><span class="de">${esc(right)}</span></div>`;
    });
    const nextLevel = LEVELS[langUnlocked(store)];
    const cap = vocabForLevelCap(langUnlocked(store), store);
    const learned = learnedCount(store, langUnlocked(store));
    return `
      <div class="screen">
        <div class="topbar"><h1>Fortschritt</h1></div>
        <div class="stats-row">
          <div class="stat"><b>${store.reviewed}</b><span>Karten gesamt</span></div>
          <div class="stat"><b>${store.correctTotal}</b><span>Richtige</span></div>
          <div class="stat"><b>${store.streak}</b><span>Streak</span></div>
        </div>
        <div class="hero">
          <div class="hero-kicker">Nächstes Level</div>
          <h2>${nextLevel ? nextLevel.subtitle : "Alle 500 Wörter offen"}</h2>
          <div class="progress"><span style="width:${Math.round((learned / cap.length) * 100)}%"></span></div>
          <div class="hero-meta"><span>${learned} / ${cap.length} in Nivel ${langUnlocked(store)}</span><span>70% schalten frei</span></div>
        </div>
        <div class="section-title">Schwache Karten</div>
        <div class="list">${rows.filter(Boolean).join("") || `<div class="empty">Noch keine schwachen Karten – einfach drauflos.</div>`}</div>
        ${nav("stats")}
      </div>`;
  }

  function renderSettings() {
    return `
      <div class="screen">
        <div class="topbar">
          <button class="icon-btn" data-go="home">←</button>
          <h1>Einstellungen</h1>
        </div>
        <div class="settings-card">
          <label class="setting">Sprache
            <select class="select" data-act="lang">
              <option value="es" ${store.lang === "es" ? "selected" : ""}>Spanisch</option>
              <option value="it" ${store.lang === "it" ? "selected" : ""}>Italienisch</option>
            </select>
          </label>
          <label class="setting">Kartenrichtung
            <select class="select" data-act="direction">
              <option value="es-de" ${store.direction === "es-de" ? "selected" : ""}>${langCode()} → DE</option>
              <option value="de-es" ${store.direction === "de-es" ? "selected" : ""}>DE → ${langCode()}</option>
            </select>
          </label>
          <label class="setting">Antwort eintippen
            <select class="select" data-act="typing">
              <option value="off" ${!store.typeAnswers ? "selected" : ""}>Aus (wischen)</option>
              <option value="on" ${store.typeAnswers ? "selected" : ""}>An (nur DE → ${langCode()})</option>
            </select>
          </label>
          <label class="setting">Karten pro Runde
            <select class="select" data-act="size">
              ${[8, 12, 16, 24].map((n) => `<option ${store.sessionSize === n ? "selected" : ""}>${n}</option>`).join("")}
            </select>
          </label>
        </div>
        <button class="btn ${store.reminders ? "btn-primary" : "btn-ghost"}" data-act="reminders" style="margin-bottom:12px">${store.reminders ? "Erinnerungen an" : "Erinnerungen einschalten"}</button>
        ${ui.toast ? `<p class="muted small" style="margin-bottom:12px">${esc(ui.toast)}</p>` : ""}
        <p class="muted small" style="margin-bottom:12px">Richtung und Sprache liegen auch auf der Startseite. Tippen ist optional. Nachsprechen bleibt ein eigener Modus.</p>
        <button class="btn btn-ghost danger" data-act="reset">Fortschritt löschen</button>
      </div>`;
  }

  function renderDialogs() {
    const list = activeDialogs(store).filter((d) => d.lv <= langUnlocked(store));
    return `
      <div class="screen">
        <div class="topbar"><h1>Dialoge</h1></div>
        <p class="muted" style="margin-bottom:12px">Zeilen durchgehen, dann die Dialoge abfragen.</p>
        ${list
          .map(
            (d) => `<button class="topic" data-act="open-dialog" data-dialog="${d.id}">
              <h3>${esc(d.title)}</h3>
              <span class="lvl">Nivel ${d.lv}</span>
              <p>${esc(d.scene)}</p>
              <span class="muted small">${d.lines.length} Zeilen</span>
            </button>`
          )
          .join("")}
        <button class="btn btn-primary" data-act="start" data-mode="dialog" style="margin-top:8px">Alle Dialoge üben</button>
        ${nav("learn")}
      </div>`;
  }

  function renderDialogPlay() {
    const d = activeDialogs(store).find((x) => x.id === ui.dialogId);
    if (!d) return renderDialogs();
    const line = d.lines[ui.dialogLine];
    const last = ui.dialogLine === d.lines.length - 1;
    return `
      <div class="screen no-nav">
        <div class="topbar">
          <button class="icon-btn" data-go="dialogs">←</button>
          <div>
            <div class="small muted">${esc(d.scene)}</div>
            <strong>${esc(d.title)}</strong>
          </div>
        </div>
        <button class="speak-bar" data-act="speak" data-say="${esc(line.es)}">
          <span class="speak-icon">🔊</span>
          Anhören
        </button>
        ${renderPromptFlip({ tag: esc(line.who), body: esc(line.es), de: line.de, flipped: ui.dialogShowDe })}
        <div class="dots">${d.lines.map((_, i) => `<i class="${i === ui.dialogLine ? "on" : ""}"></i>`).join("")}</div>
        <div class="grid-2">
          <button class="btn btn-ghost" data-act="dlg-prev" ${ui.dialogLine === 0 ? "disabled" : ""}>Zurück</button>
          ${last
            ? `<button class="btn btn-primary" data-act="start" data-mode="dialog" data-dialog="${d.id}">Jetzt üben</button>`
            : `<button class="btn btn-primary" data-act="dlg-next">Weiter</button>`}
        </div>
      </div>`;
  }

  function renderVocabCats() {
    const level = langUnlocked(store);
    const freq = vocabForLevelCap(level, store);
    const learned = learnedCount(store, level);
    const packs = LEVELS.map((lv) => {
      const locked = lv.id > level;
      const words = vocabForLevelCap(lv.id, store);
      return `<button class="topic ${locked ? "locked" : ""}" data-act="start-freq" data-level="${lv.id}" ${locked ? "disabled" : ""}>
        <h3>${esc(lv.subtitle)}</h3>
        <span class="lvl">${words.length} Wörter</span>
        <p>${locked ? "Noch gesperrt" : "Dieselben IDs wie in den Kategorien – Fortschritt zählt überall."}</p>
      </button>`;
    }).join("");
    const cats = VOCAB_CATS.filter((c) => c.id !== "custom").map((c) => {
      const words = vocabByCategory(store, c.id).filter((v) => v.lv <= level || v.custom);
      const due = words.filter((w) => {
        const p = getProgress(store, tagItem(w));
        return p.new || isDue(p, Date.now());
      }).length;
      return `<button class="topic" data-act="start-cat" data-cat="${c.id}">
        <h3>${c.emoji} ${esc(c.name)}</h3>
        <span class="lvl">${words.length}</span>
        <p>${esc(c.hint)}</p>
        <span class="muted small">${due} zu üben</span>
      </button>`;
    }).join("");
    const own = vocabByCategory(store, "custom");
    return `
      <div class="screen">
        <div class="topbar">
          <button class="icon-btn" data-go="home">←</button>
          <h1>Vokabeln</h1>
        </div>
        <p class="muted" style="margin-bottom:12px">In einer Kategorie gelerntes sitzt automatisch auch in „${esc(LEVELS[level - 1].subtitle)}“, wenn das Wort dort vorkommt.</p>
        <div class="hero">
          <div class="hero-kicker">${esc(langOf(store).name)} · ${esc(LEVELS[level - 1].name)}</div>
          <h2>${learned} / ${freq.length} sitzen</h2>
          <div class="progress"><span style="width:${Math.round((learned / Math.max(1, freq.length)) * 100)}%"></span></div>
        </div>
        <button class="btn btn-primary" data-go="add-word" style="margin-bottom:16px">Eigenes Wort eintragen</button>
        <div class="section-title">Häufigste Wörter</div>
        ${packs}
        <div class="section-title">Kategorien</div>
        ${cats}
        <div class="section-title">Eigene Wörter</div>
        <button class="topic" data-act="start-cat" data-cat="custom">
          <h3>✦ Eigene Wörter</h3>
          <span class="lvl">${own.length}</span>
          <p>Was in der App fehlt, trägst du hier ein.</p>
        </button>
        ${nav("learn")}
      </div>`;
  }

  function renderAddWord() {
    const f = ui.addForm || { de: "", word: "", pos: "n" };
    const L = langOf(store);
    return `
      <div class="screen">
        <div class="topbar">
          <button class="icon-btn" data-go="vocab-cats">←</button>
          <h1>Wort eintragen</h1>
        </div>
        <p class="muted" style="margin-bottom:14px">Nur nötig, wenn der Eintrag in ${esc(L.name)} noch fehlt. Gibt es das Wort schon, nutzt die App den vorhandenen Fortschritt.</p>
        <div class="settings-card add-card">
          <label class="field">Deutsch
            <input class="type-input" data-add="de" type="text" value="${esc(f.de)}" placeholder="das Brot" />
          </label>
          <label class="field">${esc(L.name)}
            <input class="type-input" data-add="word" type="text" value="${esc(f.word)}" placeholder="${store.lang === "it" ? "il pane" : "el pan"}" />
          </label>
          <label class="setting">Wortart
            <select class="select" data-add="pos">
              ${[["n","Nomen"],["v","Verb"],["adj","Adjektiv"],["adv","Adverb"],["phr","Wendung"],["intj","Ausdruck"]].map(([k, lab]) => `<option value="${k}" ${f.pos === k ? "selected" : ""}>${lab}</option>`).join("")}
            </select>
          </label>
        </div>
        ${ui.toast ? `<p class="muted small" style="margin-bottom:12px">${esc(ui.toast)}</p>` : ""}
        <button class="btn btn-primary" data-act="save-word">Speichern</button>
        <button class="btn btn-ghost" data-go="vocab-cats" style="margin-top:10px">Abbrechen</button>
      </div>`;
  }

  function render() {
    if (ui.view !== "home" && ui.view !== "settings" && ui.view !== "add-word" && ui.view !== "vocab-cats") ui.toast = "";
    document.body.dataset.lang = store.lang || "es";
    const map = {
      home: renderHome,
      learn: renderLearn,
      grammar: renderGrammar,
      topic: renderTopic,
      study: renderStudy,
      result: renderResult,
      stats: renderStats,
      settings: renderSettings,
      dialogs: renderDialogs,
      "dialog-play": renderDialogPlay,
      "speech-load": renderSpeechLoad,
      "vocab-cats": renderVocabCats,
      "add-word": renderAddWord
    };
    app.innerHTML = (map[ui.view] || renderHome)();
    const screen = app.querySelector(".screen");
    const card = ui.view === "study" && ui.session ? ui.session.index + ":" + (currentItem()?.id || "") : ui.view === "dialog-play" ? ui.dialogId + ":" + ui.dialogLine : "";
    if (screen && lastPaint.view !== ui.view) screen.classList.add("enter");
    else if (screen && lastPaint.card && lastPaint.card !== card) {
      (screen.querySelector(".study-body") || screen.querySelector(".prompt-scene"))?.classList.add("swap");
    }
    lastPaint = { view: ui.view, card };
    afterRender();
  }

  function submitTyped() {
    const item = currentItem();
    if (!item || !ui.session || ui.session.answered) return;
    const input = app.querySelector(".type-input");
    const val = input ? input.value : ui.session.typed || "";
    const result = scoreTyped(val, item);
    ui.session.typed = val;
    ui.session.typeResult = result.note;
    applyAnswer(result.quality);
  }

  function renderSpeechLoad() {
    const p = ui.modelProgress || { pct: 0, label: "" };
    const err = Boolean(p.error);
    return `
      <div class="screen no-nav">
        <div class="topbar">
          <button class="icon-btn" data-go="home">←</button>
          <h1>Nachsprechen</h1>
        </div>
        <div class="hero">
          <div class="hero-kicker">Whisper Base · on-device</div>
          <h2 data-load-title>${err ? "Download fehlgeschlagen" : speechLoadTitle(p)}</h2>
          <div class="progress"><span data-load-bar style="width:${Math.max(2, p.pct || 0)}%"></span></div>
          <div class="hero-meta"><span data-load-label>${esc(p.label || "Bitte warten…")}</span><span data-load-pct>${p.pct || 0}%</span></div>
        </div>
        <div class="speech-steps">
          ${speechSteps(p)}
        </div>
        <p class="muted" style="margin-top:16px">Einmalig ~${PalabraSpeech.info?.().modelMB || 80} MB, danach im Geräte-Cache. Keine Cloud, keine Audio-Uploads. Vorne Deutsch, du sagst ${esc(langOf(store).name)}.</p>
        ${err ? `<button class="btn btn-primary" data-act="retry-speech-model" style="margin-top:16px">Nochmal laden</button>` : ""}
        <button class="btn btn-ghost" data-act="cancel-speak-load" style="margin-top:12px">Abbrechen</button>
      </div>`;
  }

  function speechLoadTitle(p) {
    const phase = p?.phase || "";
    if (phase === "library") return "Bibliothek wird geholt";
    if (phase === "download") return "Modell wird geladen";
    if (phase === "ready") return "Modell ist bereit";
    return "Modell wird geladen";
  }

  function speechSteps(p) {
    const phase = p?.phase || (p?.pct ? "download" : "library");
    const steps = [
      ["library", "Bibliothek anfragen"],
      ["download", "Dateien laden / Cache"],
      ["ready", "Modell bereit"]
    ];
    const order = steps.map((s) => s[0]);
    const idx = Math.max(0, order.indexOf(phase));
    return steps
      .map((s, i) => {
        const state = p?.error && i === idx ? "err" : i < idx ? "done" : i === idx ? "on" : "";
        return `<div class="speech-step ${state}"><i></i><span>${s[1]}</span></div>`;
      })
      .join("");
  }

  function speechStatusCard() {
    const p = ui.speechStatus || {};
    const phase = ui.speechPhase || "idle";
    const titles = {
      idle: "Bereit",
      loading: "Bereite Whisper vor",
      mic: "Frage Mikrofon an",
      recording: "Hört zu",
      busy: "Stabilisiert"
    };
    const label =
      p.label ||
      (phase === "loading" ? "Lädt oder öffnet das Modell…" : phase === "mic" ? "Browser fragt Mikrofon-Erlaubnis…" : phase === "recording" ? "Sprich jetzt – Ergebnis kommt live." : phase === "busy" ? "Mache den Text fertig…" : "Tippe auf das Mikrofon und sprich.");
    return `<div class="speech-live" data-phase="${esc(phase)}">
      <div class="speech-live-top">
        <b>${titles[phase] || "Status"}</b>
        <span>${phase === "loading" || p.phase === "download" ? (p.pct || 0) + "%" : ""}</span>
      </div>
      <p>${esc(label)}</p>
      ${phase === "loading" || p.phase === "download" ? `<div class="progress"><span style="width:${Math.max(2, p.pct || 0)}%"></span></div>` : ""}
    </div>`;
  }

  function speechBtnLabel() {
    if (ui.speechPhase === "loading") return "Lädt Modell…";
    if (ui.speechPhase === "mic") return "Frage Mikrofon an…";
    if (ui.speechPhase === "recording") return "Stopp · ich höre zu";
    if (ui.speechPhase === "busy") return "Wertet aus…";
    return "🎙 " + langOf(store).name + " sagen";
  }

  function patchSpeechUi(phase, note) {
    if (phase) ui.speechPhase = phase;
    if (note != null) setListenNote(note);
    const mic = app.querySelector(".mic-btn");
    const live = app.querySelector(".speech-live");
    const liveP = app.querySelector(".speech-live p");
    const liveTitle = app.querySelector(".speech-live-top b");
    const listenNote = app.querySelector(".listen-note");
    if (!mic) return false;
    mic.textContent = speechBtnLabel();
    mic.classList.toggle("rec-on", ui.speechPhase === "recording");
    mic.classList.toggle("busy-on", ui.speechPhase === "busy");
    if (live) live.dataset.phase = ui.speechPhase || "idle";
    const titles = {
      idle: "Bereit",
      loading: "Bereite Whisper vor",
      mic: "Frage Mikrofon an",
      recording: "Hört zu",
      busy: "Stabilisiert"
    };
    if (liveTitle) liveTitle.textContent = titles[ui.speechPhase] || liveTitle.textContent;
    if (liveP && note) liveP.textContent = note;
    if (listenNote && note) listenNote.textContent = note;
    return true;
  }

  function cancelListen(note) {
    PalabraSpeech.cancel();
    ui.speechPhase = "idle";
    ui.speechStatus = { phase: "idle", pct: 0, label: "" };
    setListenNote(note || "Abgebrochen.");
    render();
  }

  function setListenNote(msg) {
    if (ui.view === "dialog-play") ui.listenNote = msg;
    else if (ui.session) ui.session.listenNote = msg;
  }

  function patchSpeechLoad(p) {
    ui.modelProgress = p;
    const bar = app.querySelector("[data-load-bar]");
    if (!bar || ui.view !== "speech-load") return false;
    const pct = Math.max(0, Math.min(100, p.pct || 0));
    bar.style.width = Math.max(2, pct) + "%";
    const label = app.querySelector("[data-load-label]");
    const num = app.querySelector("[data-load-pct]");
    const title = app.querySelector("[data-load-title]");
    if (label) label.textContent = p.label || "Bitte warten…";
    if (num) num.textContent = pct + "%";
    if (title) title.textContent = p.error ? "Download fehlgeschlagen" : speechLoadTitle(p);
    const steps = app.querySelector(".speech-steps");
    if (steps) steps.innerHTML = speechSteps(p);
    return true;
  }

  async function startSpeakMode() {
    if (PalabraSpeech.isReady()) {
      startSession("speak");
      return;
    }
    const gen = ++ui.speakLoadGen;
    ui.view = "speech-load";
    ui.modelProgress = { phase: "library", pct: 0, label: "Verbinde…" };
    render();
    try {
      await PalabraSpeech.ensure((p) => {
        if (ui.speakLoadGen !== gen) return;
        if (!patchSpeechLoad(p)) {
          ui.view = "speech-load";
          render();
        }
      });
      if (ui.speakLoadGen !== gen || ui.view !== "speech-load") return;
      startSession("speak");
    } catch (err) {
      if (ui.speakLoadGen !== gen) return;
      ui.modelProgress = {
        pct: ui.modelProgress?.pct || 0,
        label: err?.message || "Modell konnte nicht geladen werden. WLAN prüfen und nochmal versuchen.",
        error: true
      };
      ui.view = "speech-load";
      render();
    }
  }

  async function startListen(expectedSay) {
    const now = Date.now();
    if (now < listenGuardUntil) return;
    if (ui.speechPhase === "loading" || ui.speechPhase === "mic") return;
    if (ui.speechPhase === "busy") {
      cancelListen("Erkennung abgebrochen.");
      return;
    }
    const item = currentItem();
    const target = expectedSay || (item ? displayEs(item) : "");
    const probe = item && ui.view === "study" ? item : { es: target, pos: "phr" };
    listenGuardUntil = now + 1000;
    try {
      await PalabraSpeech.toggle({
        language: langOf(store).whisper,
        onProgress: (p) => {
          ui.speechStatus = p;
          if (ui.view === "speech-load") {
            patchSpeechLoad(p);
            return;
          }
          const note = (p.label || "Lade Modell…") + (p.pct ? " · " + p.pct + "%" : "");
          if (!patchSpeechUi(ui.speechPhase, note)) setListenNote(note);
        },
        onStatus: (phase) => {
          const notes = {
            loading: "Whisper wird geladen oder aus dem Cache geholt…",
            mic: "Frage Mikrofon an…",
            recording: "Sprich jetzt auf " + langOf(store).name + ".",
            busy: "Stabilisiere den Text…"
          };
          const note = notes[phase] || "";
          if (!patchSpeechUi(phase, note)) {
            ui.speechPhase = phase;
            if (note) setListenNote(note);
            render();
          }
        },
        onPartial: (text) => {
          if (!text) return;
          const shown = "„" + text + "“";
          if (!patchSpeechUi(ui.speechPhase, shown)) {
            setListenNote(shown);
            const live = app.querySelector(".speech-live p");
            if (live) live.textContent = shown;
          }
        },
        onResult: (text) => {
          ui.speechPhase = "idle";
          const scored = scoreSpoken(text, probe);
          setListenNote(scored.note);
          if (isSpeakMode() && ui.session && !ui.session.answered) {
            ui.session.listenNote = scored.note;
            applyAnswer(scored.ok ? 1 : 0);
            return;
          }
          render();
        },
        onError: (err) => {
          ui.speechPhase = "idle";
          setListenNote(err?.message || "Erkennung fehlgeschlagen.");
          render();
        }
      });
    } catch (err) {
      ui.speechPhase = "idle";
      PalabraSpeech.cancel();
      const msg = err?.message || "Mikrofon nicht erkannt.";
      setListenNote(msg === "Abgebrochen." ? "Aufnahme gestoppt." : msg);
      render();
    }
  }

  function dueTotal() {
    return pickDue(poolFor("mixed"), store, Date.now()).length;
  }

  function updateBadge() {
    const n = dueTotal();
    if (navigator.setAppBadge) navigator.setAppBadge(n).catch(() => {});
    else if (n === 0 && navigator.clearAppBadge) navigator.clearAppBadge();
  }

  async function toggleReminders() {
    if (store.reminders) {
      store.reminders = false;
      persist();
      if (navigator.clearAppBadge) navigator.clearAppBadge();
      render();
      return;
    }
    if (!("Notification" in window)) {
      ui.toast = "Dieser Browser kann keine Hinweise.";
      ui.view = "settings";
      render();
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm !== "granted") {
      ui.toast = "Ohne Erlaubnis keine Erinnerung.";
      render();
      return;
    }
    store.reminders = true;
    persist();
    notifyDue(true);
    render();
  }

  function notifyDue(force) {
    if (!store.reminders || !("Notification" in window) || Notification.permission !== "granted") return;
    const n = dueTotal();
    if (!n) return;
    const today = todayStr();
    if (!force && store.lastNotifyDate === today) return;
    store.lastNotifyDate = today;
    persist();
    const body = n === 1 ? "1 Karte ist fällig." : n + " Karten sind fällig.";
    if (navigator.serviceWorker) {
      navigator.serviceWorker.ready.then((reg) =>
        reg.showNotification("Palabra", { body, icon: "./icons/icon-192.png", badge: "./icons/icon-192.png", tag: "palabra-due" })
      );
    } else new Notification("Palabra", { body });
  }

  function afterRender() {
    updateBadge();
    const input = app.querySelector(".type-input");
    if (input) {
      input.focus();
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          submitTyped();
        }
      });
    }
  }

  app.addEventListener("pointerdown", (e) => {
    if (e.button) return;
    if (ui.view !== "study" || swipeLock) return;
    if (ui.session?.showForms) return;
    if (e.target.closest("[data-act='speak'], [data-act='abort'], [data-act='cancel-listen'], [data-act='toggle-forms'], [data-act='toggle-trans'], [data-act='listen-say'], [data-act='type-submit'], .icon-btn, .type-input, .card-tools, .forms-modal, .mic-btn, .prompt-flip")) return;
    const wrap = e.target.closest(".swipe-wrap");
    if (!wrap || !isCardItem(currentItem()) || shouldType(currentItem())) return;
    e.preventDefault();
    drag = { x: e.clientX, y: e.clientY, wrap, moved: false };
    window.addEventListener("pointermove", onSwipeMove);
    window.addEventListener("pointerup", endSwipe);
    window.addEventListener("pointercancel", endSwipe);
  });

  app.addEventListener("click", async (e) => {
    const t = e.target.closest("[data-go],[data-act],[data-topic]");
    if (!t) return;

    if (t.dataset.go) {
      ui.speakLoadGen += 1;
      PalabraSpeech.cancel();
      ui.speechPhase = "idle";
      ui.speechStatus = { phase: "idle", pct: 0, label: "" };
      if (t.dataset.go === "home") ui.toast = "";
      ui.view = t.dataset.go;
      render();
      return;
    }
    if (t.dataset.topic) {
      ui.topicId = t.dataset.topic;
      ui.lessonIndex = 0;
      ui.view = "topic";
      render();
      return;
    }

    const act = t.dataset.act;
    if (act === "start") {
      const mode = t.dataset.mode || "mixed";
      if (mode === "speak") {
        startSpeakMode();
        return;
      }
      const topic = t.dataset.topic;
      const dialog = t.dataset.dialog;
      startSession(mode === "topic" || topic ? "topic" : mode, {
        topicId: topic || ui.topicId,
        dialogId: dialog || null,
        catId: t.dataset.cat || ui.catId,
        packLevel: t.dataset.pack ? Number(t.dataset.pack) : null,
        forceAll: mode === "topic" || Boolean(topic) || Boolean(dialog)
      });
    } else if (act === "set-lang") {
      switchLang(t.dataset.lang);
    } else if (act === "set-dir") {
      store.direction = t.dataset.dir;
      persist();
      render();
    } else if (act === "start-cat") {
      ui.catId = t.dataset.cat;
      const words = vocabItems(langUnlocked(store), ui.catId);
      if (!words.length) {
        ui.toast = ui.catId === "custom" ? "Noch keine eigenen Wörter – zuerst eines eintragen." : "In dieser Kategorie ist noch nichts freigeschaltet.";
        ui.view = "vocab-cats";
        render();
        return;
      }
      startSession("vocab", { catId: ui.catId });
    } else if (act === "start-freq") {
      ui.catId = null;
      startSession("vocab", { packLevel: Number(t.dataset.level) || langUnlocked(store) });
    } else if (act === "save-word") {
      saveCustomWord();
    } else if (act === "practice-topic") {
      startSession("topic", { topicId: ui.topicId, forceAll: true });
    } else if (act === "lesson-next") {
      const topic = activeGrammar(store).find((x) => x.id === ui.topicId);
      ui.lessonIndex = Math.min(topic.lessons.length - 1, ui.lessonIndex + 1);
      render();
    } else if (act === "lesson-prev") {
      ui.lessonIndex = Math.max(0, ui.lessonIndex - 1);
      render();
    } else if (act === "toggle-trans") {
      if (ui.view === "dialog-play") {
        ui.dialogShowDe = !ui.dialogShowDe;
        if (!flipPromptCard(ui.dialogShowDe)) render();
        return;
      }
      if (!ui.session) return;
      ui.session.showTrans = !ui.session.showTrans;
      if (!flipPromptCard(ui.session.showTrans)) render();
    } else if (act === "type-submit") {
      submitTyped();
    } else if (act === "toggle-forms") {
      e.preventDefault();
      e.stopPropagation();
      if (!ui.session) return;
      ui.session.showForms = !ui.session.showForms;
      if (ui.session.showForms) ui.formsLockUntil = Date.now() + 500;
      render();
    } else if (act === "close-forms") {
      if (!ui.session) return;
      if (Date.now() < ui.formsLockUntil) return;
      ui.session.showForms = false;
      render();
    } else if (act === "forms-noop") {
      return;
    } else if (act === "retry-speech-model") {
      startSpeakMode();
    } else if (act === "cancel-listen") {
      e.stopPropagation();
      if (Date.now() < listenGuardUntil) return;
      cancelListen("Erkennung abgebrochen.");
    } else if (act === "cancel-speak-load") {
      ui.speakLoadGen += 1;
      PalabraSpeech.cancel();
      ui.speechPhase = "idle";
      ui.view = "home";
      render();
    } else if (act === "listen-say") {
      e.stopPropagation();
      startListen(t.dataset.say);
    } else if (act === "open-dialog") {
      ui.dialogId = t.dataset.dialog;
      ui.dialogLine = 0;
      ui.dialogShowDe = false;
      ui.view = "dialog-play";
      render();
    } else if (act === "dlg-next") {
      PalabraSpeech.cancel();
      ui.speechPhase = "idle";
      ui.dialogLine += 1;
      ui.dialogShowDe = false;
      ui.listenNote = "";
      render();
    } else if (act === "dlg-prev") {
      PalabraSpeech.cancel();
      ui.speechPhase = "idle";
      ui.dialogLine = Math.max(0, ui.dialogLine - 1);
      ui.dialogShowDe = false;
      ui.listenNote = "";
      render();
    } else if (act === "reminders") {
      toggleReminders();
    } else if (act === "flip") {
      if (!ui.session) return;
      ui.session.flipped = !ui.session.flipped;
      const card = app.querySelector(".flip-card");
      if (card) card.classList.toggle("flipped", ui.session.flipped);
      else render();
    } else if (act === "rate") {
      applyAnswer(Number(t.dataset.q));
    } else if (act === "choose") {
      const item = currentItem();
      ui.session.picked = t.dataset.val;
      applyAnswer(t.dataset.val === item.answer ? 1 : 0);
    } else if (act === "next") {
      nextCard();
    } else if (act === "abort") {
      drag = null;
      swipeLock = false;
      ui.speakLoadGen += 1;
      PalabraSpeech.cancel();
      ui.speechPhase = "idle";
      ui.speechStatus = { phase: "idle", pct: 0, label: "" };
      ui.view = "home";
      ui.session = null;
      render();
    } else if (act === "speak") {
      e.stopPropagation();
      speak(t.dataset.say);
    } else if (act === "dismiss-install") {
      store.installHintDismissed = true;
      persist();
      render();
    } else if (act === "install") {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      render();
    } else if (act === "reset") {
      if (confirm("Wirklich allen Fortschritt löschen?")) {
        store = defaultStore();
        persist();
        ui.view = "home";
        render();
      }
    }
  });

  app.addEventListener("change", (e) => {
    const t = e.target;
    if (t.dataset.act === "direction") {
      store.direction = t.value;
      persist();
      render();
    }
    if (t.dataset.act === "size") {
      store.sessionSize = Number(t.value);
      persist();
    }
    if (t.dataset.act === "typing") {
      store.typeAnswers = t.value === "on";
      persist();
      render();
    }
    if (t.dataset.act === "lang") {
      switchLang(t.value);
    }
    if (t.dataset.add === "pos") {
      ui.addForm = ui.addForm || {};
      ui.addForm.pos = t.value;
    }
  });

  app.addEventListener("input", (e) => {
    if (e.target.classList.contains("type-input") && ui.session) ui.session.typed = e.target.value;
    if (e.target.dataset.add && e.target.dataset.add !== "pos") {
      ui.addForm = ui.addForm || { de: "", word: "", pos: "n" };
      ui.addForm[e.target.dataset.add] = e.target.value;
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      updateBadge();
      notifyDue(false);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || !ui.session?.showForms) return;
    ui.session.showForms = false;
    render();
  });

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    render();
  });

  window.addEventListener("appinstalled", () => {
    standalone = true;
    render();
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").then(() => {
      updateBadge();
      notifyDue(false);
    }).catch(() => {});
  } else {
    updateBadge();
    notifyDue(false);
  }

  if (window.speechSynthesis) {
    window.speechSynthesis.addEventListener("voiceschanged", () => {});
  }

  render();
})();
