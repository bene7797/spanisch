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
    toast: ""
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
    return vocabForLevelCap(level).map((v, i) => ({ ...v, type: "vocab", rank: i + 1 }));
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
    if (mode === "grammar") return grammarItems(level);
    if (mode === "sentence") return sentenceItems(level);
    if (mode === "topic") return grammarItems(level, topicId);
    return [...vocabItems(level), ...grammarItems(level), ...sentenceItems(level)];
  }

  function dueCount(mode) {
    return buildQueue(poolFor(mode), store, store.sessionSize).length;
  }

  function startSession(mode, opts = {}) {
    const items = poolFor(mode, opts.topicId);
    const queue = opts.forceAll
      ? shuffle(items).slice(0, Math.max(items.length, 1))
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
      ui.view = "result";
      render();
      return;
    }
    ui.session.flipped = false;
    ui.session.answered = false;
    ui.session.chosen = null;
    ui.session.showTrans = false;
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
    const due = dueCount("mixed");
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
          <p>Karteikarten, Grammatik und Sätze – alles bleibt auf diesem Gerät.</p>
        </div>
        <div class="hero">
          <div class="hero-kicker">${esc(level.name)} · ${esc(level.subtitle)}</div>
          <h2>${due ? due + " Karten warten" : "Bereit zum Lernen"}</h2>
          <div class="progress"><span style="width:${pct}%"></span></div>
          <div class="hero-meta"><span>${learned} / ${cap.length} Wörter gesehen</span><span>${pct}%</span></div>
          <button class="btn" data-act="start" data-mode="mixed" style="margin-top:16px;background:#fffaf3;color:#9a3412">Weiterlernen</button>
        </div>
        <div class="stats-row">
          <div class="stat"><b>${store.streak}</b><span>Tage Streak</span></div>
          <div class="stat"><b>${today}</b><span>Heute</span></div>
          <div class="stat"><b>${store.unlockedLevel}/4</b><span>Level offen</span></div>
        </div>
        <div class="grid-2">
          <button class="tile" data-act="start" data-mode="vocab">
            <div class="emoji">Aa</div>
            <div><h3>Vokabeln</h3><p>${dueCount("vocab")} fällig</p></div>
          </button>
          <button class="tile" data-go="grammar">
            <div class="emoji">☰</div>
            <div><h3>Grammatik</h3><p>Themen wählen & üben</p></div>
          </button>
          <button class="tile" data-act="start" data-mode="sentence">
            <div class="emoji">…</div>
            <div><h3>Sätze</h3><p>1 von 4 Optionen</p></div>
          </button>
          <button class="tile" data-act="start" data-mode="mixed">
            <div class="emoji">✦</div>
            <div><h3>Gemischt</h3><p>Alles durcheinander</p></div>
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
        <p class="muted" style="margin-bottom:16px">Nur eine Sektion oder alles gemischt. Schwache Karten kommen öfter.</p>
        <button class="tile" style="width:100%;margin-bottom:12px" data-act="start" data-mode="mixed">
          <div class="emoji">✦</div>
          <div><h3>Gemischte Runde</h3><p>${dueCount("mixed")} Karten in der Queue</p></div>
        </button>
        <div class="grid-2">
          <button class="tile" data-act="start" data-mode="vocab"><h3>Nur Vokabeln</h3><p>${dueCount("vocab")} fällig</p></button>
          <button class="tile" data-act="start" data-mode="grammar"><h3>Nur Grammatik</h3><p>${dueCount("grammar")} fällig</p></button>
          <button class="tile" data-act="start" data-mode="sentence"><h3>Nur Sätze</h3><p>${dueCount("sentence")} fällig</p></button>
          <button class="tile" data-go="grammar"><h3>Thema wählen</h3><p>Regeln zuerst ansehen</p></button>
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
    const esFirst = store.direction !== "de-es";
    const front = esFirst ? item.es : item.de;
    const back = esFirst ? item.de : item.es;
    return `
      <button class="speak-bar" data-act="speak" data-say="${esc(item.es)}">
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
              <span class="tag">${esc(POS_DE[item.pos] || item.pos)} · Nivel ${item.lv}</span>
              <div class="word">${esc(front)}</div>
              <p class="muted small">Tippen zum Umdrehen</p>
            </div>
            <div class="face back">
              <span class="tag">${esc(POS_DE[item.pos] || item.pos)}</span>
              <div class="word">${esc(back)}</div>
              <p class="example">${esc(esFirst ? item.exde : item.ex)}</p>
              <p class="example"><em>${esc(esFirst ? item.ex : item.exde)}</em></p>
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
        ${item.topicTitle ? `<span class="tag">${esc(item.topicTitle)}</span>` : `<span class="tag">Satz · Nivel ${item.lv}</span>`}
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
    const labels = { vocab: "Vokabeln", grammar: "Grammatik", sentence: "Sätze", mixed: "Gemischt", topic: "Thema" };
    return `
      <div class="screen no-nav ${item.type === "vocab" ? "study-vocab" : ""}">
        <div class="session-top">
          <button class="icon-btn" data-act="abort">×</button>
          <span class="chip">${labels[s.mode] || "Runde"}</span>
          <span class="session-count">${s.index + 1} / ${s.queue.length}</span>
        </div>
        <div class="thin-progress"><span style="width:${pct}%"></span></div>
        ${item.type === "vocab" ? renderVocabCard(item) : renderChoice(item)}
      </div>`;
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
        <p class="muted" style="text-align:center;margin:12px 0 18px">Falsche Karten kommen früher wieder. Streak: ${store.streak} Tage.</p>
        <button class="btn btn-primary" data-act="start" data-mode="${s.mode}" data-topic="${s.topicId || ""}">Noch eine Runde</button>
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
    const lookup = [...VOCAB, ...SENTENCES, ...GRAMMAR.flatMap((t) => t.cards)];
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
              <option value="es-de" ${store.direction === "es-de" ? "selected" : ""}>ES → DE</option>
              <option value="de-es" ${store.direction === "de-es" ? "selected" : ""}>DE → ES</option>
            </select>
          </label>
          <label class="setting">Karten pro Runde
            <select class="select" data-act="size">
              ${[8, 12, 16, 24].map((n) => `<option ${store.sessionSize === n ? "selected" : ""}>${n}</option>`).join("")}
            </select>
          </label>
        </div>
        <p class="muted small" style="margin-bottom:12px">Alles liegt nur in diesem Browser (localStorage). Kein Konto, keine Cloud.</p>
        <button class="btn btn-ghost danger" data-act="reset">Fortschritt löschen</button>
      </div>`;
  }

  function render() {
    ui.toast = ui.view === "home" ? ui.toast : "";
    const map = {
      home: renderHome,
      learn: renderLearn,
      grammar: renderGrammar,
      topic: renderTopic,
      study: renderStudy,
      result: renderResult,
      stats: renderStats,
      settings: renderSettings
    };
    app.innerHTML = (map[ui.view] || renderHome)();
  }

  app.addEventListener("pointerdown", (e) => {
    if (e.button) return;
    if (ui.view !== "study" || swipeLock) return;
    if (e.target.closest("[data-act='speak'], [data-act='abort'], .icon-btn")) return;
    const wrap = e.target.closest(".swipe-wrap");
    if (!wrap || currentItem()?.type !== "vocab") return;
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
      startSession(mode === "topic" || topic ? "topic" : mode, {
        topicId: topic || ui.topicId,
        forceAll: mode === "topic" || Boolean(topic)
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
      if (!ui.session || ui.session.answered) return;
      ui.session.showTrans = !ui.session.showTrans;
      render();
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
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }

  if (window.speechSynthesis) {
    window.speechSynthesis.addEventListener("voiceschanged", () => {});
  }

  render();
})();
