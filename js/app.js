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
    speechPhase: "idle"
  };

  let drag = null;
  let swipeLock = false;

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

  function greeting() {
    const h = new Date().getHours();
    if (h < 12) return "Buenos días";
    if (h < 18) return "Buenas tardes";
    return "Buenas noches";
  }

  function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const bar = document.querySelector(".speak-bar");
    if (bar) bar.classList.add("playing");
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-ES";
    const voices = window.speechSynthesis.getVoices();
    const es = voices.find((v) => v.lang.startsWith("es"));
    if (es) u.voice = es;
    u.onend = u.onerror = () => bar && bar.classList.remove("playing");
    window.speechSynthesis.speak(u);
  }

  function vocabItems(level) {
    return vocabForLevelCap(level).map((v, i) => ({ ...v, type: "vocab", rank: i + 1, es: withArticle(v) }));
  }

  function chunkItems(level) {
    return CHUNKS.filter((c) => c.lv <= level).map((c, i) => ({ ...c, type: "chunk", pos: "phr", rank: i + 1 }));
  }

  function grammarItems(level, topicId) {
    return GRAMMAR.filter((t) => t.lv <= level && (!topicId || t.id === topicId)).flatMap((t) =>
      t.cards.map((c) => ({ ...c, type: "grammar", lv: t.lv, topicId: t.id, topicTitle: t.title }))
    );
  }

  function sentenceItems(level) {
    return SENTENCES.filter((s) => s.lv <= level).map((s) => ({ ...s, type: "sentence" }));
  }

  function poolFor(mode, topicId) {
    const level = store.unlockedLevel;
    if (mode === "vocab") return vocabItems(level);
    if (mode === "chunk") return chunkItems(level);
    if (mode === "grammar") return grammarItems(level);
    if (mode === "sentence") return sentenceItems(level);
    if (mode === "dialog") return dialogCards(level);
    if (mode === "topic") return grammarItems(level, topicId);
    return [...vocabItems(level), ...chunkItems(level), ...grammarItems(level), ...sentenceItems(level)];
  }

  function isCardItem(item) {
    return item && (item.type === "vocab" || item.type === "chunk");
  }

  function shouldType(item) {
    if (!isCardItem(item)) return false;
    return store.direction === "de-es";
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
      : poolFor(mode === "daily" ? "mixed" : mode, opts.topicId));
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
    const prev = getProgress(store, item.id);
    store.progress[item.id] = schedule(prev, quality, now);
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
    if (!opts.silent) render();
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
    const cap = vocabForLevelCap(store.unlockedLevel);
    const learned = learnedCount(store, store.unlockedLevel);
    const pct = Math.round((learned / cap.length) * 100);
    const level = LEVELS[store.unlockedLevel - 1];
    const daily = dueCount("daily");
    const quotaDone = store.quotaDoneOn === todayStr();
    const today = store.byDay[todayStr()] || 0;
    return `
      <div class="screen">
        <div class="topbar">
          <div class="brand">Palabra</div>
          <div class="spacer"></div>
          <button class="icon-btn" data-go="settings" title="Einstellungen">⚙</button>
        </div>
        <div class="greeting">
          <div class="hello">${greeting()}.</div>
          <p>${quotaDone ? "Tagespensum sitzt. Streak läuft." : "Heute: 12 fällige plus bis zu 8 neue Karten."}</p>
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
          <div class="stat"><b>${store.unlockedLevel}/4</b><span>Level offen</span></div>
        </div>
        <div class="grid-2">
          <button class="tile" data-act="start" data-mode="vocab">
            <div class="emoji">Aa</div>
            <div><h3>Vokabeln</h3><p>${dueCount("vocab")} in der Queue</p></div>
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
          <button class="tile" data-act="start" data-mode="vocab"><h3>Vokabeln</h3><p>${dueCount("vocab")}</p></button>
          <button class="tile" data-act="start" data-mode="chunk"><h3>Brocken</h3><p>${dueCount("chunk")}</p></button>
          <button class="tile" data-act="start" data-mode="sentence"><h3>Sätze</h3><p>${dueCount("sentence")}</p></button>
          <button class="tile" data-go="dialogs"><h3>Dialoge</h3><p>Hören & nachsprechen</p></button>
          <button class="tile" data-act="start" data-mode="grammar"><h3>Grammatik</h3><p>${dueCount("grammar")}</p></button>
          <button class="tile" data-act="start" data-mode="mixed"><h3>Gemischt</h3><p>${dueCount("mixed")}</p></button>
        </div>
        ${nav("learn")}
      </div>`;
  }

  function topicButton(t, locked) {
    const due = t.cards.filter((c) => {
      const p = getProgress(store, c.id);
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
    const featured = GRAMMAR.filter((t) => t.featured);
    const groups = [1, 2, 3, 4];
    const blocks = groups.map((lv) => {
      const locked = lv > store.unlockedLevel;
      const topics = GRAMMAR.filter((t) => t.lv === lv && !t.featured);
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
    const topic = GRAMMAR.find((t) => t.id === ui.topicId);
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
    const deFront = store.direction === "de-es";
    if (typing) {
      return `
      <button class="speak-bar" data-act="speak" data-say="${esc(es)}">
        <span class="speak-icon">🔊</span>
        Anhören
      </button>
      <div class="prompt-card type-card">
        <span class="tag">${esc(POS_DE[item.pos] || item.pos)} · Nivel ${item.lv}</span>
        <div class="word" style="margin-top:10px">${esc(item.de)}</div>
        <p class="muted small">Schreib die spanische Form${item.pos === "n" ? " mit Artikel" : ""}.</p>
        ${
          ui.session.answered
            ? `<p class="card-de">${esc(es)}</p>
               <div class="feedback ${ui.session.chosen ? "ok" : "no"}">${esc(ui.session.typeResult || "")}</div>
               <button class="btn btn-primary" data-act="next">Weiter</button>`
            : `<input class="type-input" data-type-input="1" type="text" autocapitalize="off" autocomplete="off" spellcheck="false" placeholder="español…" value="${esc(ui.session.typed || "")}" />
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
              <span class="tag">${esc(POS_DE[item.pos] || item.pos)} · Nivel ${item.lv} · ${deFront ? "DE" : "ES"}</span>
              <div class="word">${esc(front)}</div>
              <p class="muted small">Tippen zum Umdrehen</p>
            </div>
            <div class="face back">
              <span class="tag">${deFront ? "ES" : "DE"}</span>
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

  function renderChoice(item) {
    const isSentence = item.type === "sentence";
    const prompt = isSentence
      ? item.text.replace("___", `<span class="blank">${ui.session.answered ? esc(item.answer) : ""}</span>`)
      : esc(item.prompt);
    const options = ui.session.options || item.options;
    const chosenWrong = ui.session.answered && ui.session.chosen === 0;
    const showDe = Boolean(item.de) && (ui.session.showTrans || ui.session.answered);
    return `
      <button class="prompt-card" data-act="toggle-trans" ${item.de ? "" : "disabled"}>
        ${item.topicTitle ? `<span class="tag">${esc(item.topicTitle)}</span>` : item.dialogTitle ? `<span class="tag">${esc(item.dialogTitle)}</span>` : `<span class="tag">Satz · Nivel ${item.lv}</span>`}
        <div class="sentence" style="margin-top:12px">${prompt}</div>
        ${item.hint ? `<p class="muted small" style="margin-top:10px">${esc(item.hint)}</p>` : ""}
        ${
          showDe
            ? `<p class="card-de">${esc(item.de)}</p>`
            : item.de
              ? `<p class="muted small trans-hint">Karte tippen: Übersetzung</p>`
              : ""
        }
      </button>
      <div class="options">
        ${options
          .map((opt) => {
            let cls = "option";
            if (ui.session.answered) {
              if (opt === item.answer) cls += " correct";
              else if (opt === ui.session.picked) cls += " wrong";
            }
            return `<button class="${cls}" data-act="choose" data-val="${esc(opt)}" ${ui.session.answered ? "disabled" : ""}>${esc(opt)}</button>`;
          })
          .join("")}
      </div>
      ${
        ui.session.answered
          ? `<div class="feedback ${chosenWrong ? "no" : "ok"}">${chosenWrong ? "Noch mal öfter." : "Sitzt."} ${esc(item.why || "")}</div>
             <button class="btn btn-primary" data-act="next">Weiter</button>`
          : ""
      }`;
  }

  function renderStudy() {
    const item = currentItem();
    if (!item) return renderHome();
    const s = ui.session;
    const pct = Math.round((s.index / s.queue.length) * 100);
    const labels = { vocab: "Vokabeln", grammar: "Grammatik", sentence: "Sätze", mixed: "Gemischt", topic: "Thema", chunk: "Brocken", daily: "Pensum", dialog: "Dialog" };
    const forms = isCardItem(item) ? getWordForms(item) : null;
    return `
      <div class="screen no-nav ${isCardItem(item) ? "study-vocab" : ""}">
        <div class="session-top">
          <button class="icon-btn" data-act="abort">×</button>
          <span class="chip">${labels[s.mode] || "Runde"}</span>
          ${forms ? `<button class="tool-btn forms-open" data-act="toggle-forms">Alle Formen</button>` : ""}
          ${store.speechOn && isCardItem(item) ? `<button class="tool-btn ${ui.speechPhase === "recording" ? "rec-on" : ""}" data-act="listen-say">${speechBtnLabel()}</button>` : ""}
          <span class="session-count">${s.index + 1} / ${s.queue.length}</span>
        </div>
        <div class="thin-progress"><span style="width:${pct}%"></span></div>
        ${s.listenNote ? `<p class="listen-note">${esc(s.listenNote)}</p>` : ""}
        ${isCardItem(item) ? renderVocabCard(item) : renderChoice(item)}
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
        <button class="btn btn-primary" data-act="start" data-mode="${s.mode === "daily" ? "mixed" : s.mode}" data-topic="${s.topicId || ""}">Noch eine Runde</button>
        <button class="btn btn-ghost" data-go="home" style="margin-top:10px">Zur Übersicht</button>
        ${nav("learn")}
      </div>`;
  }

  function renderStats() {
    const weak = Object.entries(store.progress)
      .map(([id, p]) => ({ id, p }))
      .filter(({ p }) => p.wrong > p.correct && !p.new)
      .sort((a, b) => b.p.wrong - a.p.wrong)
      .slice(0, 8);
    const lookup = [...VOCAB, ...CHUNKS, ...SENTENCES, ...GRAMMAR.flatMap((t) => t.cards), ...dialogCards(4)];
    const rows = weak.map(({ id }) => {
      const item = lookup.find((x) => x.id === id);
      if (!item) return "";
      const left = item.es || item.prompt || item.text;
      const right = item.de || item.answer;
      return `<div class="row"><span class="es">${esc(left)}</span><span class="de">${esc(right)}</span></div>`;
    });
    const nextLevel = LEVELS[store.unlockedLevel];
    const cap = vocabForLevelCap(store.unlockedLevel);
    const learned = learnedCount(store, store.unlockedLevel);
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
          <div class="hero-meta"><span>${learned} / ${cap.length} in Nivel ${store.unlockedLevel}</span><span>70% schalten frei</span></div>
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
          <label class="setting">Kartenrichtung
            <select class="select" data-act="direction">
              <option value="es-de" ${store.direction === "es-de" ? "selected" : ""}>ES → DE (Wischen)</option>
              <option value="de-es" ${store.direction === "de-es" ? "selected" : ""}>DE → ES (Tippen)</option>
            </select>
          </label>
          <label class="setting">Karten pro Runde
            <select class="select" data-act="size">
              ${[8, 12, 16, 24].map((n) => `<option ${store.sessionSize === n ? "selected" : ""}>${n}</option>`).join("")}
            </select>
          </label>
          <label class="setting">Nachsprechen
            <select class="select" data-act="speech">
              <option value="0" ${store.speechOn ? "" : "selected"}>Aus</option>
              <option value="1" ${store.speechOn ? "selected" : ""}>An (Whisper)</option>
            </select>
          </label>
        </div>
        <button class="btn ${store.reminders ? "btn-primary" : "btn-ghost"}" data-act="reminders" style="margin-bottom:12px">${store.reminders ? "Erinnerungen an" : "Erinnerungen einschalten"}</button>
        ${ui.toast ? `<p class="muted small" style="margin-bottom:12px">${esc(ui.toast)}</p>` : ""}
        <p class="muted small" style="margin-bottom:12px">Nachsprechen ist optional. Es läuft Whisper lokal im Browser – nicht die schwache System-Erkennung. Beim ersten Mal wird das Modell einmal geladen (~75 MB), danach auf dem Gerät. Erinnerungen: App-Badge, wenn Karten fällig sind.</p>
        <button class="btn btn-ghost danger" data-act="reset">Fortschritt löschen</button>
      </div>`;
  }

  function renderDialogs() {
    const list = DIALOGS.filter((d) => d.lv <= store.unlockedLevel);
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
    const d = DIALOGS.find((x) => x.id === ui.dialogId);
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
        <div class="prompt-card" data-act="toggle-trans">
          <span class="tag">${esc(line.who)}</span>
          <div class="sentence" style="margin-top:12px">${esc(line.es)}</div>
          ${ui.dialogShowDe ? `<p class="card-de">${esc(line.de)}</p>` : `<p class="muted small trans-hint">Tippen: Übersetzung</p>`}
        </div>
        <div class="dots">${d.lines.map((_, i) => `<i class="${i === ui.dialogLine ? "on" : ""}"></i>`).join("")}</div>
        <div class="grid-2">
          <button class="btn btn-ghost" data-act="dlg-prev" ${ui.dialogLine === 0 ? "disabled" : ""}>Zurück</button>
          ${last
            ? `<button class="btn btn-primary" data-act="start" data-mode="dialog" data-dialog="${d.id}">Jetzt üben</button>`
            : `<button class="btn btn-primary" data-act="dlg-next">Weiter</button>`}
        </div>
        ${store.speechOn ? `<button class="btn ${ui.speechPhase === "recording" ? "btn-primary" : "btn-ghost"}" data-act="listen-say" data-say="${esc(line.es)}" style="margin-top:10px">${speechBtnLabel()}</button>` : ""}
        ${ui.listenNote ? `<p class="listen-note">${esc(ui.listenNote)}</p>` : ""}
      </div>`;
  }

  function render() {
    if (ui.view !== "home" && ui.view !== "settings") ui.toast = "";
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
      "dialog-play": renderDialogPlay
    };
    app.innerHTML = (map[ui.view] || renderHome)();
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

  function speechBtnLabel() {
    if (ui.speechPhase === "loading") return "Lädt…";
    if (ui.speechPhase === "recording") return "Stopp";
    if (ui.speechPhase === "busy") return "Erkenne…";
    return "Nachsprechen";
  }

  function setListenNote(msg) {
    if (ui.view === "dialog-play") ui.listenNote = msg;
    else if (ui.session) ui.session.listenNote = msg;
  }

  async function startListen(expectedSay) {
    if (!store.speechOn) return;
    if (ui.speechPhase === "loading" || ui.speechPhase === "busy") return;
    const item = currentItem();
    const target = expectedSay || (item ? displayEs(item) : "");
    const probe = item && ui.view === "study" ? item : { es: target, pos: "phr" };
    try {
      await PalabraSpeech.toggle({
        onProgress: (p) => {
          if (ui.speechPhase !== "loading") return;
          setListenNote("Modell " + p + " % – einmaliger Download.");
          if (p === 100 || p % 25 === 0) render();
        },
        onStatus: (phase) => {
          ui.speechPhase = phase;
          if (phase === "loading") setListenNote("Whisper wird geladen. Danach lokal auf dem Gerät.");
          if (phase === "recording") setListenNote("Sprich jetzt. Nochmal tippen zum Stoppen.");
          if (phase === "busy") setListenNote("Erkenne mit Whisper…");
          render();
        },
        onResult: (text) => {
          ui.speechPhase = "idle";
          setListenNote(scoreSpoken(text, probe).note);
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
      setListenNote(err?.message || "Mikrofon nicht erkannt.");
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
    if (e.target.closest("[data-act='speak'], [data-act='abort'], [data-act='toggle-forms'], [data-act='listen-say'], [data-act='type-submit'], .icon-btn, .type-input, .card-tools, .forms-modal")) return;
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
      ui.view = t.dataset.go;
      if (t.dataset.go === "home") ui.toast = "";
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
      const topic = t.dataset.topic;
      const dialog = t.dataset.dialog;
      startSession(mode === "topic" || topic ? "topic" : mode, {
        topicId: topic || ui.topicId,
        dialogId: dialog || null,
        forceAll: mode === "topic" || Boolean(topic) || Boolean(dialog)
      });
    } else if (act === "practice-topic") {
      startSession("topic", { topicId: ui.topicId, forceAll: true });
    } else if (act === "lesson-next") {
      const topic = GRAMMAR.find((x) => x.id === ui.topicId);
      ui.lessonIndex = Math.min(topic.lessons.length - 1, ui.lessonIndex + 1);
      render();
    } else if (act === "lesson-prev") {
      ui.lessonIndex = Math.max(0, ui.lessonIndex - 1);
      render();
    } else if (act === "toggle-trans") {
      if (ui.view === "dialog-play") {
        ui.dialogShowDe = !ui.dialogShowDe;
        render();
        return;
      }
      if (!ui.session || ui.session.answered) return;
      ui.session.showTrans = !ui.session.showTrans;
      render();
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
      render();
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
      PalabraSpeech.cancel();
      ui.speechPhase = "idle";
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
    }
    if (t.dataset.act === "size") {
      store.sessionSize = Number(t.value);
      persist();
    }
    if (t.dataset.act === "speech") {
      store.speechOn = t.value === "1";
      persist();
      if (!store.speechOn) {
        PalabraSpeech.cancel();
        ui.speechPhase = "idle";
      }
    }
  });

  app.addEventListener("input", (e) => {
    if (e.target.classList.contains("type-input") && ui.session) ui.session.typed = e.target.value;
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
