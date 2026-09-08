const DIALOGS = [
  {
    id: "dlg_cafe",
    lv: 1,
    title: "Im Café",
    scene: "Du bestellst etwas an der Theke.",
    lines: [
      { who: "Tú", es: "Hola, un café con leche, por favor.", de: "Hallo, einen Milchkaffee, bitte." },
      { who: "Camarero", es: "¿Algo más?", de: "Noch etwas?" },
      { who: "Tú", es: "Sí, una tostada también.", de: "Ja, auch ein Toast." },
      { who: "Camarero", es: "¿Para tomar aquí o para llevar?", de: "Zum Hiertrinken oder zum Mitnehmen?" },
      { who: "Tú", es: "Para tomar aquí. ¿Cuánto es?", de: "Zum Hiertrinken. Was kostet das?" },
      { who: "Camarero", es: "Son tres euros veinte.", de: "Drei Euro zwanzig." }
    ]
  },
  {
    id: "dlg_hola",
    lv: 1,
    title: "Vorstellen",
    scene: "Du triffst jemanden zum ersten Mal.",
    lines: [
      { who: "Ana", es: "Hola, ¿qué tal? Me llamo Ana.", de: "Hallo, wie geht’s? Ich heiße Ana." },
      { who: "Tú", es: "Encantado, me llamo Benedikt. Soy de Alemania.", de: "Freut mich, ich heiße Benedikt. Ich komme aus Deutschland." },
      { who: "Ana", es: "¿Hablas español?", de: "Sprichst du Spanisch?" },
      { who: "Tú", es: "Un poco. Estoy aprendiendo.", de: "Ein bisschen. Ich lerne gerade." },
      { who: "Ana", es: "¡Muy bien! Si no entiendes, me dices.", de: "Sehr gut! Wenn du etwas nicht verstehst, sag Bescheid." }
    ]
  },
  {
    id: "dlg_camino",
    lv: 2,
    title: "Nach dem Weg",
    scene: "Du suchst den Bahnhof.",
    lines: [
      { who: "Tú", es: "Perdón, ¿dónde está la estación?", de: "Entschuldigung, wo ist der Bahnhof?" },
      { who: "Local", es: "Sigue todo recto y luego a la izquierda.", de: "Geh geradeaus und dann links." },
      { who: "Tú", es: "¿Está lejos?", de: "Ist es weit?" },
      { who: "Local", es: "No, cinco minutos a pie.", de: "Nein, fünf Minuten zu Fuß." },
      { who: "Tú", es: "Perfecto, muchas gracias.", de: "Perfekt, vielen Dank." }
    ]
  },
  {
    id: "dlg_hotel",
    lv: 2,
    title: "Im Hotel",
    scene: "Du checkst ein.",
    lines: [
      { who: "Tú", es: "Buenas tardes, tengo una reserva.", de: "Guten Tag, ich habe eine Reservierung." },
      { who: "Recepción", es: "¿A nombre de quién?", de: "Auf welchen Namen?" },
      { who: "Tú", es: "A nombre de Stoeck. Una habitación para dos.", de: "Auf den Namen Stoeck. Ein Zimmer für zwei." },
      { who: "Recepción", es: "Aquí tiene la llave. El desayuno es de ocho a diez.", de: "Hier ist der Schlüssel. Das Frühstück ist von acht bis zehn." },
      { who: "Tú", es: "¿Hay wifi?", de: "Gibt es WLAN?" },
      { who: "Recepción", es: "Sí, la contraseña está en la tarjeta.", de: "Ja, das Passwort steht auf der Karte." }
    ]
  },
  {
    id: "dlg_medico",
    lv: 3,
    title: "Beim Arzt",
    scene: "Dir ist nicht gut.",
    lines: [
      { who: "Tú", es: "Buenos días, me duele mucho la cabeza.", de: "Guten Tag, mir tut der Kopf sehr weh." },
      { who: "Médico", es: "¿Desde cuándo?", de: "Seit wann?" },
      { who: "Tú", es: "Desde ayer. También tengo un poco de fiebre.", de: "Seit gestern. Ich habe auch ein bisschen Fieber." },
      { who: "Médico", es: "¿Es alérgico a algún medicamento?", de: "Sind Sie gegen ein Medikament allergisch?" },
      { who: "Tú", es: "No, que yo sepa.", de: "Nein, soweit ich weiß." },
      { who: "Médico", es: "Tome esto y descanse. Si no mejora, vuelva.", de: "Nehmen Sie das und ruhen Sie sich aus. Wenn es nicht besser wird, kommen Sie wieder." }
    ]
  },
  {
    id: "dlg_tienda",
    lv: 2,
    title: "Im Laden",
    scene: "Du kaufst etwas.",
    lines: [
      { who: "Tú", es: "Hola, estoy buscando una camisa blanca.", de: "Hallo, ich suche ein weißes Hemd." },
      { who: "Tendera", es: "¿Qué talla?", de: "Welche Größe?" },
      { who: "Tú", es: "Mediana, creo. ¿Puedo probarme esta?", de: "Mittel, denke ich. Kann ich das anprobieren?" },
      { who: "Tendera", es: "Claro, el probador está allí.", de: "Klar, die Kabine ist dort." },
      { who: "Tú", es: "Me queda bien. Me la llevo. ¿Puedo pagar con tarjeta?", de: "Es passt. Ich nehme es. Kann ich mit Karte zahlen?" }
    ]
  }
];

function dialogCards(level) {
  return DIALOGS.filter((d) => d.lv <= level).flatMap((d) =>
    d.lines.map((line, i) => ({
      id: d.id + "_q" + i,
      type: "dialog",
      lv: d.lv,
      dialogId: d.id,
      dialogTitle: d.title,
      prompt: line.de,
      answer: line.es,
      who: line.who,
      options: dialogOptions(d, line.es),
      de: line.de,
      why: d.scene + " · " + line.who
    }))
  );
}

function dialogOptions(dialog, answer) {
  const pool = DIALOGS.flatMap((d) => d.lines.map((l) => l.es)).filter((es) => es !== answer);
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
