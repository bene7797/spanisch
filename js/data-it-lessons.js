const CHUNKS_IT = [
  { id:"c1", lv:1, es:"per favore", de:"bitte", ex:"Un caffè, per favore.", exde:"Einen Kaffee, bitte." },
  { id:"c2", lv:1, es:"prego", de:"gern geschehen", ex:"—Grazie. —Prego.", exde:"—Danke. —Gern geschehen." },
  { id:"c3", lv:1, es:"piacere", de:"freut mich", ex:"Piacere, sono Ana.", exde:"Freut mich, ich bin Ana." },
  { id:"c4", lv:1, es:"come va?", de:"wie geht’s?", ex:"Ciao, come va?", exde:"Hallo, wie geht’s?" },
  { id:"c5", lv:1, es:"come stai?", de:"wie geht’s dir?", ex:"Come stai oggi?", exde:"Wie geht’s dir heute?" },
  { id:"c6", lv:1, es:"sto bene", de:"mir geht’s gut", ex:"Sto bene, grazie.", exde:"Mir geht’s gut, danke." },
  { id:"c7", lv:1, es:"non capisco", de:"ich verstehe nicht", ex:"Scusa, non capisco.", exde:"Entschuldigung, ich verstehe nicht." },
  { id:"c8", lv:1, es:"più piano", de:"langsamer", ex:"Parla più piano, per favore.", exde:"Sprich bitte langsamer." },
  { id:"c9", lv:1, es:"puoi ripetere?", de:"kannst du das wiederholen?", ex:"Puoi ripetere, per favore?", exde:"Kannst du das bitte wiederholen?" },
  { id:"c10", lv:1, es:"non so", de:"ich weiß nicht", ex:"Non so che dire.", exde:"Ich weiß nicht, was ich sagen soll." },
  { id:"c11", lv:1, es:"certo", de:"natürlich", ex:"Certo che sì.", exde:"Natürlich." },
  { id:"c12", lv:1, es:"subito", de:"sofort / genau jetzt", ex:"Vado subito.", exde:"Ich gehe sofort." },
  { id:"c13", lv:1, es:"un momento", de:"einen Moment", ex:"Un momento, per favore.", exde:"Einen Moment, bitte." },
  { id:"c14", lv:1, es:"quanto costa?", de:"wie viel kostet das?", ex:"Quanto costa questo?", exde:"Wie viel kostet das?" },
  { id:"c15", lv:1, es:"il conto, per favore", de:"die Rechnung, bitte", ex:"Il conto, per favore.", exde:"Die Rechnung, bitte." },
  { id:"c16", lv:1, es:"dov'è il bagno?", de:"wo ist die Toilette?", ex:"Dov'è il bagno?", exde:"Wo ist die Toilette?" },
  { id:"c17", lv:1, es:"sono della Germania", de:"ich komme aus Deutschland", ex:"Sono della Germania.", exde:"Ich komme aus Deutschland." },
  { id:"c18", lv:1, es:"mi chiamo…", de:"ich heiße…", ex:"Mi chiamo Benedikt.", exde:"Ich heiße Benedikt." },
  { id:"c19", lv:1, es:"molto / un po'", de:"viel / ein bisschen", ex:"Parlo un po' di italiano.", exde:"Ich spreche ein bisschen Italienisch." },
  { id:"c20", lv:1, es:"a dopo", de:"bis später", ex:"A dopo, ci vediamo.", exde:"Bis später, wir sehen uns." },
  { id:"c21", lv:1, es:"ci vediamo", de:"wir sehen uns", ex:"Ci vediamo domani.", exde:"Wir sehen uns morgen." },
  { id:"c22", lv:1, es:"mi dispiace", de:"es tut mir leid", ex:"Mi dispiace, arrivo tardi.", exde:"Tut mir leid, ich komme zu spät." },
  { id:"c23", lv:1, es:"non fa niente", de:"kein Problem", ex:"—Scusa. —Non fa niente.", exde:"—Entschuldigung. —Kein Problem." },
  { id:"c24", lv:1, es:"va bene", de:"ist in Ordnung", ex:"Sì, va bene.", exde:"Ja, ist in Ordnung." },
  { id:"c25", lv:1, es:"ho fame", de:"ich habe Hunger", ex:"Ho fame.", exde:"Ich habe Hunger." },
  { id:"c26", lv:1, es:"ho sete", de:"ich habe Durst", ex:"Ho sete.", exde:"Ich habe Durst." },
  { id:"c27", lv:1, es:"devo…", de:"ich muss…", ex:"Devo lavorare.", exde:"Ich muss arbeiten." },
  { id:"c28", lv:1, es:"voglio…", de:"ich möchte…", ex:"Voglio dell'acqua, per favore.", exde:"Ich möchte Wasser, bitte." },
  { id:"c29", lv:1, es:"mi piace…", de:"ich mag…", ex:"Mi piace il caffè.", exde:"Ich mag Kaffee." },
  { id:"c30", lv:1, es:"c'è…", de:"es gibt…", ex:"C'è un problema.", exde:"Es gibt ein Problem." },
  { id:"c31", lv:2, es:"puoi aiutarmi?", de:"kannst du mir helfen?", ex:"Puoi aiutarmi?", exde:"Kannst du mir helfen?" },
  { id:"c32", lv:2, es:"sto cercando…", de:"ich suche…", ex:"Sto cercando la stazione.", exde:"Ich suche den Bahnhof." },
  { id:"c33", lv:2, es:"come arrivo a…?", de:"wie komme ich zu…?", ex:"Come arrivo in centro?", exde:"Wie komme ich ins Zentrum?" },
  { id:"c34", lv:2, es:"è vicino / lontano", de:"es ist nah / weit", ex:"L'hotel è vicino.", exde:"Das Hotel ist in der Nähe." },
  { id:"c35", lv:2, es:"a destra", de:"rechts", ex:"Gira a destra.", exde:"Bieg rechts ab." },
  { id:"c36", lv:2, es:"a sinistra", de:"links", ex:"È a sinistra.", exde:"Es ist links." },
  { id:"c37", lv:2, es:"sempre dritto", de:"geradeaus", ex:"Vai sempre dritto.", exde:"Geh geradeaus weiter." },
  { id:"c38", lv:2, es:"c'è il wifi?", de:"gibt es WLAN?", ex:"C'è il wifi, per favore?", exde:"Gibt es WLAN, bitte?" },
  { id:"c39", lv:2, es:"posso pagare con la carta?", de:"kann ich mit Karte zahlen?", ex:"Posso pagare con la carta?", exde:"Kann ich mit Karte zahlen?" },
  { id:"c40", lv:2, es:"è aperto / chiuso", de:"es ist offen / geschlossen", ex:"Oggi è chiuso.", exde:"Heute ist geschlossen." },
  { id:"c41", lv:2, es:"ci troviamo alle…", de:"wir treffen uns um…", ex:"Ci troviamo alle cinque?", exde:"Treffen wir uns um fünf?" },
  { id:"c42", lv:2, es:"ti chiamo più tardi", de:"ich rufe dich später an", ex:"Ti chiamo più tardi.", exde:"Ich rufe dich später an." },
  { id:"c43", lv:2, es:"che ore sono?", de:"wie spät ist es?", ex:"Che ore sono?", exde:"Wie spät ist es?" },
  { id:"c44", lv:2, es:"ho una prenotazione", de:"ich habe eine Reservierung", ex:"Ho una prenotazione a nome di…", exde:"Ich habe eine Reservierung auf den Namen…" },
  { id:"c45", lv:2, es:"una camera per due", de:"ein Zimmer für zwei", ex:"Una camera per due, per favore.", exde:"Ein Zimmer für zwei, bitte." },
  { id:"c46", lv:2, es:"mi fa male…", de:"mir tut … weh", ex:"Mi fa male la testa.", exde:"Mir tut der Kopf weh." },
  { id:"c47", lv:2, es:"ho bisogno di aiuto", de:"ich brauche Hilfe", ex:"Ho bisogno di aiuto, per favore.", exde:"Ich brauche Hilfe, bitte." },
  { id:"c48", lv:2, es:"mi sono perso/a", de:"ich habe mich verlaufen", ex:"Mi sono perso, dov'è la piazza?", exde:"Ich habe mich verlaufen, wo ist der Platz?" },
  { id:"c49", lv:2, es:"vado a…", de:"ich werde / ich gehe…", ex:"Vado a studiare.", exde:"Ich werde lernen." },
  { id:"c50", lv:2, es:"adoro…", de:"ich liebe / mag sehr…", ex:"Adoro l'Italia.", exde:"Ich liebe Italien." },
  { id:"c51", lv:2, es:"mi è uguale", de:"ist egal", ex:"Mi è uguale.", exde:"Ist mir egal." },
  { id:"c52", lv:2, es:"d'accordo", de:"einverstanden", ex:"D'accordo, andiamo.", exde:"Einverstanden, los." },
  { id:"c53", lv:2, es:"certo che sì", de:"klar / natürlich", ex:"Certo che sì.", exde:"Klar doch." },
  { id:"c54", lv:2, es:"ancora una volta", de:"noch einmal", ex:"Ancora una volta, per favore.", exde:"Noch einmal, bitte." },
  { id:"c55", lv:3, es:"ho voglia di…", de:"ich habe Lust auf…", ex:"Ho voglia di viaggiare.", exde:"Ich habe Lust zu reisen." },
  { id:"c56", lv:3, es:"ho appena…", de:"ich habe gerade…", ex:"Sono appena arrivato.", exde:"Ich bin gerade angekommen." },
  { id:"c57", lv:3, es:"sto per…", de:"ich bin gerade dabei zu…", ex:"Sto per uscire.", exde:"Ich bin gerade dabei zu gehen." },
  { id:"c58", lv:3, es:"non ti preoccupare", de:"mach dir keine Sorgen", ex:"Non ti preoccupare, va bene.", exde:"Mach dir keine Sorgen, es ist okay." },
  { id:"c59", lv:3, es:"ti dispiace se…?", de:"stört es dich, wenn…?", ex:"Ti dispiace se apro la finestra?", exde:"Stört es dich, wenn ich das Fenster öffne?" },
  { id:"c60", lv:3, es:"mi sembra bene", de:"das finde ich gut", ex:"Mi sembra bene.", exde:"Das finde ich gut." },
  { id:"c61", lv:3, es:"ha senso", de:"ergibt Sinn", ex:"Sì, ha senso.", exde:"Ja, das ergibt Sinn." },
  { id:"c62", lv:3, es:"perciò", de:"deshalb", ex:"Sono stanco, perciò resto.", exde:"Ich bin müde, deshalb bleibe ich." },
  { id:"c63", lv:3, es:"tuttavia", de:"jedoch", ex:"È difficile, tuttavia ci provo.", exde:"Es ist schwer, trotzdem versuche ich es." },
  { id:"c64", lv:3, es:"secondo me", de:"meiner Meinung nach", ex:"Secondo me è meglio aspettare.", exde:"Meiner Meinung nach ist Warten besser." },
  { id:"c65", lv:3, es:"ogni tanto", de:"ab und zu", ex:"Viaggio ogni tanto.", exde:"Ich reise ab und zu." },
  { id:"c66", lv:3, es:"spesso", de:"oft", ex:"Mi esercito spesso.", exde:"Ich übe oft." },
  { id:"c67", lv:3, es:"il prima possibile", de:"so bald wie möglich", ex:"Chiamami il prima possibile.", exde:"Ruf mich so bald wie möglich an." },
  { id:"c68", lv:3, es:"sta piovendo", de:"es regnet", ex:"Sta piovendo molto.", exde:"Es regnet stark." },
  { id:"c69", lv:3, es:"fa caldo / freddo", de:"es ist heiß / kalt", ex:"Oggi fa caldo.", exde:"Heute ist es heiß." },
  { id:"c70", lv:3, es:"vorrei…", de:"ich würde gern…", ex:"Vorrei un tè.", exde:"Ich hätte gern einen Tee." },
  { id:"c71", lv:3, es:"potresti…?", de:"könntest du…?", ex:"Potresti aiutarmi?", exde:"Könntest du mir helfen?" },
  { id:"c72", lv:3, es:"fa lo stesso", de:"egal / dasselbe", ex:"Mi fa lo stesso.", exde:"Ist mir egal." },
  { id:"c73", lv:4, es:"magari…", de:"hoffentlich…", ex:"Magari farà bel tempo.", exde:"Hoffentlich ist das Wetter gut." },
  { id:"c74", lv:4, es:"anche se…", de:"obwohl / auch wenn…", ex:"Anche se sono stanco, esco.", exde:"Auch wenn ich müde bin, gehe ich raus." },
  { id:"c75", lv:4, es:"quando arrivo…", de:"wenn ich ankomme…", ex:"Quando arrivo, ti chiamo.", exde:"Wenn ich ankomme, rufe ich dich an." },
  { id:"c76", lv:4, es:"non credo che…", de:"ich glaube nicht, dass…", ex:"Non credo che piova.", exde:"Ich glaube nicht, dass es regnet." },
  { id:"c77", lv:4, es:"è importante che…", de:"es ist wichtig, dass…", ex:"È importante che tu studi.", exde:"Es ist wichtig, dass du lernst." },
  { id:"c78", lv:4, es:"per niente", de:"überhaupt nicht", ex:"Non mi piace per niente.", exde:"Das mag ich überhaupt nicht." },
  { id:"c79", lv:4, es:"forse", de:"vielleicht", ex:"Forse ci vado domani.", exde:"Vielleicht gehe ich morgen." },
  { id:"c80", lv:4, es:"si può…", de:"man kann…", ex:"Si può pagare qui?", exde:"Kann man hier zahlen?" }
];

const SENTENCES_IT = [
  { id:"s1", lv:1, text:"___ chiamo Ana.", answer:"Mi", options:["Mi","Ti","Si","Ci"], de:"Ich heiße Ana.", why:"chiamarsi: io → mi chiamo." },
  { id:"s2", lv:1, text:"___ va?", answer:"Come", options:["Come","Che","Quando","Dove"], de:"Wie geht’s?", why:"Come va? ist die lockere Begrüßung." },
  { id:"s3", lv:1, text:"___ sono della Germania.", answer:"Io", options:["Io","Tu","Mi","Mio"], de:"Ich komme aus Deutschland.", why:"io zur Betonung; sono reicht oft schon." },
  { id:"s4", lv:1, text:"___ stai?", answer:"Come", options:["Che","Come","Quanto","Chi"], de:"Wie geht’s dir?", why:"Come stai? mit stare." },
  { id:"s5", lv:1, text:"Non ___ italiano.", answer:"parlo", options:["parlo","parli","parla","parliamo"], de:"Ich spreche kein Italienisch.", why:"io parlo." },
  { id:"s6", lv:1, text:"___ vivi?", answer:"Dove", options:["Dove","Quando","Che","Chi"], de:"Wo wohnst du?", why:"dove = wo." },
  { id:"s7", lv:1, text:"Voglio ___ caffè.", answer:"un", options:["un","una","il","la"], de:"Ich möchte einen Kaffee.", why:"caffè ist maskulin → un." },
  { id:"s8", lv:1, text:"La casa ___ grande.", answer:"è", options:["è","sta","sono","c'è"], de:"Das Haus ist groß.", why:"feste Eigenschaft mit essere." },
  { id:"s9", lv:1, text:"Sono ___ casa.", answer:"a", options:["a","in","di","con"], de:"Ich bin zu Hause.", why:"Ort: essere a casa." },
  { id:"s10", lv:1, text:"___ un problema.", answer:"C'è", options:["C'è","È","Sta","Sono"], de:"Es gibt ein Problem.", why:"c'è = es gibt." },
  { id:"s11", lv:1, text:"___ costa?", answer:"Quanto", options:["Quanto","Che","Come","Quale"], de:"Wie viel kostet das?", why:"Quanto costa?" },
  { id:"s12", lv:1, text:"Ho ___ fratelli.", answer:"due", options:["due","molto","grande","molti"], de:"Ich habe zwei Geschwister.", why:"Zahl ohne Artikel." },
  { id:"s13", lv:1, text:"Vado ___ Italia.", answer:"in", options:["in","a","di","per"], de:"Ich fahre nach Italien.", why:"andare in + Land." },
  { id:"s14", lv:1, text:"Questo è ___ te.", answer:"per", options:["per","da","con","di"], de:"Das ist für dich.", why:"Empfänger: per." },
  { id:"s15", lv:1, text:"Caffè ___ latte.", answer:"con", options:["con","senza","per","di"], de:"Kaffee mit Milch.", why:"con = mit." },
  { id:"s16", lv:1, text:"No, ___.", answer:"grazie", options:["grazie","scusa","ciao","va bene"], de:"Nein, danke.", why:"No, grazie." },
  { id:"s17", lv:1, text:"___ le tre.", answer:"Sono", options:["Sono","È","Sta","C'è"], de:"Es ist drei Uhr.", why:"Uhrzeit ab 2: Sono le…" },
  { id:"s18", lv:1, text:"Lei ___ a Madrid.", answer:"vive", options:["vive","vivo","vivi","viviamo"], de:"Sie wohnt in Madrid.", why:"lei vive." },
  { id:"s19", lv:1, text:"___ è lei?", answer:"Chi", options:["Chi","Che","Dove","Come"], de:"Wer ist sie?", why:"chi = wer." },
  { id:"s20", lv:1, text:"Sto molto ___.", answer:"bene", options:["bene","buono","buon","buoni"], de:"Mir geht es sehr gut.", why:"stare + Adverb bene." },
  { id:"s21", lv:1, text:"___ dell'acqua, per favore.", answer:"Voglio", options:["Voglio","Vuoi","Vuole","Vogliamo"], de:"Ich möchte Wasser, bitte.", why:"io voglio." },
  { id:"s22", lv:1, text:"Non ___ la risposta.", answer:"so", options:["so","sa","sai","siamo"], de:"Ich weiß die Antwort nicht.", why:"sapere, io: so." },
  { id:"s23", lv:1, text:"___ aiutarmi?", answer:"Puoi", options:["Puoi","Posso","Può","Possiamo"], de:"Kannst du mir helfen?", why:"tu puoi." },
  { id:"s24", lv:1, text:"Siamo ___ Berlino.", answer:"di", options:["di","a","in","per"], de:"Wir kommen aus Berlin.", why:"essere di = stammen aus." },
  { id:"s25", lv:1, text:"Il libro ___ nuovo.", answer:"è", options:["è","sta","c'è","sono"], de:"Das Buch ist neu.", why:"Eigenschaft mit essere." },
  { id:"s26", lv:2, text:"Mi ___ il caffè.", answer:"piace", options:["piace","piacciono","piaccio","piaci"], de:"Ich mag Kaffee.", why:"Singular → piace." },
  { id:"s27", lv:2, text:"Mi ___ i gatti.", answer:"piacciono", options:["piace","piacciono","piaccio","adoro io"], de:"Ich mag Katzen.", why:"Plural → piacciono." },
  { id:"s28", lv:2, text:"Come ___ chiami?", answer:"ti", options:["ti","si","mi","ci"], de:"Wie heißt du?", why:"Come ti chiami?" },
  { id:"s29", lv:2, text:"Ho venti ___.", answer:"anni", options:["anni","anni fa","anno","età"], de:"Ich bin zwanzig.", why:"avere + Zahl + anni." },
  { id:"s30", lv:2, text:"Il negozio è ___.", answer:"aperto", options:["aperto","aperta","aprire","apre"], de:"Das Geschäft ist offen.", why:"negozio maskulin → aperto, Zustand mit essere." },
  { id:"s31", lv:2, text:"Posso pagare ___ carta?", answer:"con", options:["con","per","da","in"], de:"Kann ich mit Karte zahlen?", why:"pagare con." },
  { id:"s32", lv:2, text:"Il conto, per ___.", answer:"favore", options:["favore","niente","piacere","sì"], de:"Die Rechnung, bitte.", why:"per favore." },
  { id:"s33", lv:2, text:"Non ___ le chiavi.", answer:"trovo", options:["trovo","trovi","trovato","cerco no"], de:"Ich finde die Schlüssel nicht.", why:"io trovo." },
  { id:"s34", lv:2, text:"___ l'autobus.", answer:"Aspetto", options:["Aspetto","Aspetti","Aspetta","Aspettiamo"], de:"Ich warte auf den Bus.", why:"io aspetto." },
  { id:"s35", lv:2, text:"Ho bisogno ___ aiuto.", answer:"di", options:["di","a","per","da"], de:"Ich brauche Hilfe.", why:"avere bisogno di." },
  { id:"s36", lv:2, text:"Lavoro ___ un ufficio.", answer:"in", options:["in","a","di","per"], de:"Ich arbeite in einem Büro.", why:"in = in." },
  { id:"s37", lv:2, text:"Non ___.", answer:"capisco", options:["capisco","capisci","capito","capire"], de:"Ich verstehe nicht.", why:"capire, io: capisco (-isc-)." },
  { id:"s38", lv:2, text:"___ succede?", answer:"Che", options:["Che","Come","Chi","Dove"], de:"Was ist los?", why:"Che succede?" },
  { id:"s39", lv:2, text:"Mi fa male ___ testa.", answer:"la", options:["la","il","mia","una"], de:"Mir tut der Kopf weh.", why:"Körperteile oft mit Artikel." },
  { id:"s40", lv:2, text:"Lunedì ___.", answer:"lavoro", options:["lavoro","lavoravo","lavorerò","lavorato"], de:"Am Montag arbeite ich.", why:"Wochentag oft ohne Präposition." },
  { id:"s41", lv:2, text:"Abito ___ questa strada.", answer:"in", options:["in","a","di","per"], de:"Ich wohne in dieser Straße.", why:"abitare in." },
  { id:"s42", lv:2, text:"___ musica ogni giorno.", answer:"Ascolto", options:["Ascolto","Sento no","Guardo","Parlo"], de:"Ich höre jeden Tag Musik.", why:"ascoltare = bewusst zuhören." },
  { id:"s43", lv:2, text:"Ci troviamo ___ cinque?", answer:"alle", options:["alle","alle ore","in","di"], de:"Treffen wir uns um fünf?", why:"Uhrzeit: alle…" },
  { id:"s44", lv:2, text:"Oggi è ___.", answer:"chiuso", options:["chiuso","chiudere","chiude","chiusa il"], de:"Heute ist geschlossen.", why:"Schilder oft: chiuso." },
  { id:"s45", lv:2, text:"Compro il pane ___ mercato.", answer:"al", options:["al","a","di","per"], de:"Ich kaufe Brot auf dem Markt.", why:"al mercato." },
  { id:"s46", lv:2, text:"Il treno arriva in ___.", answer:"ritardo", options:["ritardo","presto no","ieri","molto"], de:"Der Zug kommt zu spät.", why:"in ritardo." },
  { id:"s47", lv:2, text:"___ una birra, per favore.", answer:"Vorrei", options:["Vorrei","Vuoi","C'è voglio","Sono"], de:"Ich hätte gern ein Bier, bitte." },
  { id:"s48", lv:2, text:"I miei amici ___ molto gentili.", answer:"sono", options:["sono","stanno","c'è","siamo"], de:"Meine Freunde sind sehr freundlich.", why:"Charakter mit essere." },
  { id:"s49", lv:2, text:"Vado ___ aprire la porta.", answer:"ad", options:["ad","a","di","per"], de:"Ich werde die Tür öffnen.", why:"andare a + Infinitiv, ad vor Vokal." },
  { id:"s50", lv:3, text:"Mi ___ alle sette.", answer:"alzo", options:["alzo","alzi","alza","si alzo"], de:"Ich stehe um sieben auf.", why:"alzarsi: mi alzo." },
  { id:"s51", lv:3, text:"Ieri ___ al cinema.", answer:"sono andato", options:["sono andato","andavo","vado","ero"], de:"Gestern war ich im Kino.", why:"einmalig gestern: passato prossimo." },
  { id:"s52", lv:3, text:"Quando ___ bambino, giocavo tanto.", answer:"ero", options:["ero","sono stato","stavo","sono"], de:"Als ich Kind war, spielte ich viel.", why:"Rahmen: imperfetto." },
  { id:"s53", lv:3, text:"___ freddo e pioveva.", answer:"Faceva", options:["Faceva","Ha fatto","Fa","Stava"], de:"Es war kalt und es regnete.", why:"Wetter-Hintergrund: imperfetto." },
  { id:"s54", lv:3, text:"Grazie ___ il tuo aiuto.", answer:"per", options:["per","di","a","da"], de:"Danke für deine Hilfe.", why:"grazie per." },
  { id:"s55", lv:3, text:"Studio ___ imparare l'italiano.", answer:"per", options:["per","di","che","a"], de:"Ich lerne, um Italienisch zu können.", why:"per + Infinitiv = um zu." },
  { id:"s56", lv:3, text:"Camminiamo ___ il parco.", answer:"per", options:["per","in","a","di"], de:"Wir spazieren durch den Park.", why:"Bewegung durch: per." },
  { id:"s57", lv:3, text:"A Maria ___ piace il tè.", answer:"le", options:["le","la","lo","si"], de:"Maria mag Tee.", why:"piacere: a Maria le piace." },
  { id:"s58", lv:3, text:"Mi ___ la musica.", answer:"piace", options:["piace","piacciono","piaccio","gusto"], de:"Ich mag Musik.", why:"piacere, Singular." },
  { id:"s59", lv:3, text:"L'anno scorso ___ in Italia.", answer:"siamo andati", options:["siamo andati","andavamo","andiamo","andiamo ora"], de:"Letztes Jahr sind wir nach Italien gereist.", why:"passato prossimo mit essere." },
  { id:"s60", lv:3, text:"Tutti i giorni ___ il caffè.", answer:"prendevo", options:["prendevo","ho preso","prendo","prenderò"], de:"Jeden Tag trank ich Kaffee.", why:"Gewohnheit: imperfetto." },
  { id:"s61", lv:3, text:"Non ti ___.", answer:"preoccupare", options:["preoccupare","preoccupi","preoccupa","preoccuparti no"], de:"Mach dir keine Sorgen.", why:"Non ti preoccupare." },
  { id:"s62", lv:3, text:"Adoro ___ Italia.", answer:"l'", options:["l'","la","il","un'"], de:"Ich liebe Italien.", why:"Italia nimmt l’." },
  { id:"s63", lv:3, text:"Lascio le chiavi ___.", answer:"qui", options:["qui","lì no","ieri","molto"], de:"Ich lasse die Schlüssel hier." },
  { id:"s64", lv:3, text:"___ ore sono?", answer:"Che", options:["Che","Quale","Quanto","Come"], de:"Wie spät ist es?", why:"Che ore sono?" },
  { id:"s65", lv:3, text:"Non lo so ___.", answer:"ancora", options:["ancora","già","sì","mai"], de:"Ich weiß es noch nicht.", why:"non … ancora." },
  { id:"s66", lv:3, text:"Il film ___ interessante.", answer:"è", options:["è","sta","c'è","era stare"], de:"Der Film ist interessant.", why:"Bewertung: essere." },
  { id:"s67", lv:3, text:"Sono ___ perché lavoro molto.", answer:"stanco", options:["stanco","stancare","ho stanco","stanchezza"], de:"Ich bin müde, weil ich viel arbeite.", why:"essere/stare + Adjektiv." },
  { id:"s68", lv:3, text:"Ieri sera ___ una pizza.", answer:"ho mangiato", options:["ho mangiato","mangiavo","mangio","mangerò"], de:"Gestern Abend habe ich eine Pizza gegessen.", why:"ieri sera → passato prossimo." },
  { id:"s69", lv:3, text:"Mentre ___, ascoltavo musica. (cucinare, io)", answer:"cucinavo", options:["cucinavo","ho cucinato","cucino","cucinerò"], de:"Während ich kochte, hörte ich Musik.", why:"während + Hintergrund: imperfetto." },
  { id:"s70", lv:3, text:"Ieri ___ caldo.", answer:"faceva", options:["faceva","fa","ha fatto caldo ieri","caldo era"], de:"Gestern war es heiß.", why:"fare + Wetter." },
  { id:"s71", lv:4, text:"Voglio che tu ___ con me. (venire)", answer:"venga", options:["venga","vieni","verrai","vieni tu"], de:"Ich will, dass du mitkommst.", why:"volere che + Congiuntivo." },
  { id:"s72", lv:4, text:"È importante che tu ___ ogni giorno.", answer:"studi", options:["studi","studi sempre","studierai","studiavi"], de:"Es ist wichtig, dass du jeden Tag lernst.", why:"è importante che + Congiuntivo (hier gleich Präsens)." },
  { id:"s73", lv:4, text:"Non credo che ___ domani.", answer:"piova", options:["piova","piove","pioverà","pioveva"], de:"Ich glaube nicht, dass es morgen regnet.", why:"non credere che + Congiuntivo." },
  { id:"s74", lv:4, text:"Domani ___ a studiare.", answer:"vado", options:["vado","andrò","sono andato","andavo"], de:"Morgen werde ich lernen.", why:"andare a + Infinitiv." },
  { id:"s75", lv:4, text:"L'anno prossimo ___ di più. (io, viaggiare)", answer:"viaggerò", options:["viaggerò","viaggio","viaggiavo","ho viaggiato"], de:"Nächstes Jahr werde ich mehr reisen.", why:"Futuro: Infinitiv-Stamm + ò." },
  { id:"s76", lv:4, text:"Non ___ fumare qui.", answer:"è permesso", options:["è permesso","permette","permetto","permesso sta"], de:"Rauchen ist hier nicht erlaubt." },
  { id:"s77", lv:4, text:"Mi è ___.", answer:"uguale", options:["uguale","ugualità","lo stesso no","niente uguale"], de:"Ist mir egal." },
  { id:"s78", lv:4, text:"Ho voglia ___ viaggiare.", answer:"di", options:["di","a","per","da"], de:"Ich habe Lust zu reisen.", why:"avere voglia di." },
  { id:"s79", lv:4, text:"___ tanto mangio carne.", answer:"Ogni", options:["Ogni","Di","In","Per"], de:"Ab und zu esse ich Fleisch.", why:"ogni tanto." },
  { id:"s80", lv:4, text:"Anche se ___ stanco, esco.", answer:"sono", options:["sono","sia","ero","starei"], de:"Auch wenn ich müde bin, gehe ich raus." },
  { id:"s81", lv:4, text:"Se ho tempo, ti ___.", answer:"chiamo", options:["chiamo","chiami","chiamerò sempre","chiamavo"], de:"Wenn ich Zeit habe, rufe ich dich an.", why:"reale Bedingung: se + Präsens." },
  { id:"s82", lv:4, text:"___ un tavolo libero?", answer:"C'è", options:["C'è","È","Sta un","Ha"], de:"Ist ein Tisch frei?", why:"c'è = gibt es." },
  { id:"s83", lv:4, text:"Il treno è in ___.", answer:"ritardo", options:["ritardo","tardi il","ritardo il","atraso"], de:"Der Zug hat Verspätung." },
  { id:"s84", lv:4, text:"Per me ___ bene.", answer:"va", options:["va","è","c'è","sono"], de:"Für mich ist das in Ordnung." },
  { id:"s85", lv:4, text:"Forse ___ tardi. (lui, arrivare)", answer:"arriva", options:["arriva","arrivi","è arrivato","arrivava"], de:"Vielleicht kommt er zu spät." },
  { id:"s86", lv:4, text:"Si ___ una casa nuova.", answer:"costruisce", options:["costruisce","costruiscono si","è costruito casa","ha costruito si"], de:"Es wird ein neues Haus gebaut.", why:"unpersönliches si." },
  { id:"s87", lv:4, text:"Magari ___ bel tempo.", answer:"facesse", options:["facesse","fa","farà","faceva"], de:"Hoffentlich wäre das Wetter gut.", why:"magari oft + Congiuntivo." },
  { id:"s88", lv:4, text:"Te lo ___. (versprechen, io)", answer:"prometto", options:["prometto","prometti","ho promesso ora","prometta"], de:"Ich verspreche es dir." },
  { id:"s89", lv:4, text:"Secondo ___, è meglio aspettare.", answer:"me", options:["me","mia","pensare","ragione"], de:"Meiner Meinung nach ist Warten besser." },
  { id:"s90", lv:4, text:"Non è ___ arrivare in orario.", answer:"necessario", options:["necessario","necessito","necessità","abbiamo bisogno"], de:"Es ist nicht nötig, pünktlich zu kommen." }
];

const GRAMMAR_IT = [
  {
    id: "it-ausnahmen",
    lv: 1,
    featured: true,
    title: "Ausnahmen",
    summary: "Artikel il/lo/l’, essere/stare, piacere – alles, was nicht der Regel folgt.",
    lessons: [
      {
        title: "Artikel: nicht immer il/la",
        body: "Maskulin Singular:\nil  – Standard (il libro)\nlo  – vor s+Konsonant, z, gn, ps, x, y (lo studente, lo zio)\nl’  – vor Vokal (l'amico, l'hotel)\n\nFeminin:\nla / l’ (l'acqua, l'idea)\n\nPlural:\ni  – Standard (i libri)\ngli – wie lo + Vokal (gli studenti, gli amici)\nle  – feminin (le case)"
      },
      {
        title: "essere oder stare?",
        body: "essere = Wesen, Herkunft, Zeit, Eigenschaft:\nSono tedesco.  Sono le tre.  La casa è grande.\n\nstare = Befinden, gerade tun:\nSto bene.  Sto studiando.\n\nOrt oft mit essere: Sono a casa. Sono a Roma."
      },
      {
        title: "piacere steht vom Ding her",
        body: "Nicht „ich mag“, sondern „es gefällt mir“:\nMi piace il caffè.\nMi piacciono i gatti.\n\nA Maria le piace il tè."
      },
      {
        title: "Passato prossimo: avere oder essere?",
        body: "Die meisten Verben: avere + Partizip\nHo mangiato.  Hai visto?\n\nBewegung/Veränderung + Reflexiv: essere, Partizip angleicht sich\nSono andato / andata.\nCi siamo alzati.\n\nHäufig mit essere: andare, venire, arrivare, partire, uscire, tornare, restare, nascere, morire, diventare."
      }
    ],
    cards: [
      { id:"git_ex_1", prompt:"___ studente", de:"___ Student", hint:"s+Konsonant", answer:"lo", options:["il","lo","la","un"], why:"lo vor s+Konsonant: lo studente." },
      { id:"git_ex_2", prompt:"___ amico", de:"___ Freund", hint:"Vokal", answer:"l'", options:["il","lo","l'","la"], why:"l’ vor Vokal: l'amico." },
      { id:"git_ex_3", prompt:"___ studenti", de:"___ Studenten", hint:"Plural von lo", answer:"gli", options:["i","gli","le","li"], why:"gli ist der Plural zu lo und zu l’." },
      { id:"git_ex_4", prompt:"___ acqua", de:"___ Wasser", hint:"feminin + Vokal", answer:"l'", options:["la","il","l'","le"], why:"l'acqua." },
      { id:"git_ex_5", prompt:"Io ___ tedesco.", de:"Ich ___ Deutscher.", hint:"Wesen", answer:"sono", options:["sono","sto","ho","vado"], why:"Identität mit essere." },
      { id:"git_ex_6", prompt:"___ bene, grazie.", de:"Mir geht’s gut.", hint:"Befinden", answer:"Sto", options:["Sono","Sto","Ho","Vado"], why:"stare bene." },
      { id:"git_ex_7", prompt:"Mi ___ il caffè.", de:"Ich mag Kaffee.", hint:"Singular", answer:"piace", options:["piace","piacciono","piaccio","piaci"], why:"ein Ding → piace." },
      { id:"git_ex_8", prompt:"Mi ___ i gatti.", de:"Ich mag Katzen.", hint:"Plural", answer:"piacciono", options:["piace","piacciono","piaccio","gustano"], why:"mehrere Dinge → piacciono." },
      { id:"git_ex_9", prompt:"Ieri ___ al mare. (io, m.)", de:"Gestern ___ ich ans Meer.", hint:"Bewegung", answer:"sono andato", options:["ho andato","sono andato","andavo","vado"], why:"andare bildet das passato mit essere." },
      { id:"git_ex_10", prompt:"Ieri ___ una pizza.", de:"Gestern ___ ich eine Pizza.", hint:"haben", answer:"ho mangiato", options:["sono mangiato","ho mangiato","mangiavo","mangio"], why:"mangiare nimmt avere." }
    ]
  },
  {
    id: "it-artikel",
    lv: 1,
    title: "Artikel: il, lo, la, i, gli, le",
    summary: "Bestimmte und unbestimmte Artikel und das Geschlecht.",
    lessons: [
      {
        title: "Die bestimmten Artikel",
        body: "il libro · lo studente · l'amico\nla casa · l'acqua\ni libri · gli studenti · gli amici\nle case · le idee"
      },
      {
        title: "Unbestimmte Artikel",
        body: "un  – maskulin (un caffè, un amico)\nuno – wie lo (uno studente, uno zio)\nuna – feminin (una casa)\nun' – feminin vor Vokal (un'amica, un'idea)"
      }
    ],
    cards: [
      { id:"git_art_1", prompt:"___ casa", de:"___ Haus", hint:"die (f.)", answer:"la", options:["il","la","i","le"], why:"casa ist feminin." },
      { id:"git_art_2", prompt:"___ libro", de:"___ Buch", hint:"das / der (m.)", answer:"il", options:["il","lo","la","i"], why:"libro ist maskulin, Standardartikel il." },
      { id:"git_art_3", prompt:"___ zio", de:"___ Onkel", hint:"z…", answer:"lo", options:["il","lo","la","un"], why:"lo vor z." },
      { id:"git_art_4", prompt:"___ idee", de:"___ Ideen", hint:"f. Plural + Vokal", answer:"le", options:["i","gli","le","la"], why:"feminin Plural: le." },
      { id:"git_art_5", prompt:"___ amica", de:"___ Freundin", hint:"unbestimmt, Vokal", answer:"un'", options:["una","un","un'","uno"], why:"un' vor feminin + Vokal." },
      { id:"git_art_6", prompt:"Ich möchte ___ caffè.", de:"Ich möchte ___ Kaffee.", hint:"unbestimmt, m.", answer:"un", options:["un","una","il","lo"], why:"un = ein (maskulin)." }
    ]
  },
  {
    id: "it-presente",
    lv: 1,
    title: "Präsens: regelmäßige Verben",
    summary: "-are, -ere, -ire im Presente.",
    lessons: [
      {
        title: "-are: parlare",
        body: "io parlo\ntu parli\nlui/lei parla\nnoi parliamo\nvoi parlate\nloro parlano"
      },
      {
        title: "-ere / -ire",
        body: "credere: credo, credi, crede, crediamo, credete, credono\ndormire: dormo, dormi, dorme, dormiamo, dormite, dormono\n\nViele -ire-Verben schieben -isc- ein:\ncapire → capisco, capisci, capisce, capiamo, capite, capiscono\nfinire → finisco…"
      }
    ],
    cards: [
      { id:"git_pr_1", prompt:"parlare · io", de:"sprechen · ich", answer:"parlo", options:["parlo","parli","parla","parliamo"], why:"io nimmt -o." },
      { id:"git_pr_2", prompt:"parlare · tu", de:"sprechen · du", answer:"parli", options:["parlo","parli","parla","parlate"], why:"tu nimmt -i." },
      { id:"git_pr_3", prompt:"parlare · noi", de:"sprechen · wir", answer:"parliamo", options:["parliamo","parlate","parlano","parlo"], why:"noi: -iamo." },
      { id:"git_pr_4", prompt:"capire · io", de:"verstehen · ich", hint:"-isc-", answer:"capisco", options:["capo","capisco","capo io","capire"], why:"capire ist ein -isc-Verb." },
      { id:"git_pr_5", prompt:"dormire · loro", de:"schlafen · sie", answer:"dormono", options:["dormono","dormano","dormiscono","dorme"], why:"regelm. -ire: -ono." }
    ]
  },
  {
    id: "it-essavi",
    lv: 1,
    title: "essere, avere, stare",
    summary: "Die drei Grundverben, ohne die nichts geht.",
    lessons: [
      {
        title: "essere",
        body: "sono, sei, è, siamo, siete, sono"
      },
      {
        title: "avere",
        body: "ho, hai, ha, abbiamo, avete, hanno\n\nAlter: Ho venti anni. (nicht sono)"
      },
      {
        title: "stare",
        body: "sto, stai, sta, stiamo, state, stanno\n\nSto bene.  Sto studiando."
      }
    ],
    cards: [
      { id:"git_ea_1", prompt:"essere · tu", de:"sein · du", answer:"sei", options:["sono","sei","è","siamo"], why:"tu sei." },
      { id:"git_ea_2", prompt:"avere · io", de:"haben · ich", answer:"ho", options:["ho","hai","ha","sono"], why:"io ho." },
      { id:"git_ea_3", prompt:"avere · loro", de:"haben · sie", answer:"hanno", options:["hanno","anno","hanno loro","avete"], why:"loro hanno." },
      { id:"git_ea_4", prompt:"stare · noi", de:"sich befinden · wir", answer:"stiamo", options:["stiamo","siamo","state","stanno"], why:"noi stiamo." },
      { id:"git_ea_5", prompt:"Ich bin zwanzig.", de:"Alter", hint:"avere", answer:"Ho venti anni", options:["Sono venti","Ho venti anni","Sto venti","Ho venti anni vecchio"], why:"Alter mit avere." }
    ]
  },
  {
    id: "it-prep",
    lv: 2,
    title: "Präpositionen a, in, da, di, per",
    summary: "Wohin, woher, wofür – die häufigsten Fallen.",
    lessons: [
      {
        title: "Ort und Richtung",
        body: "a + Stadt: a Roma, a Berlino\nin + Land/Region: in Italia, in Toscana\na casa, a scuola, in ufficio, in centro\n\nda + Person: vado da Maria (zu Maria)"
      },
      {
        title: "Verschmelzungen",
        body: "a + il = al    a + lo = allo    a + l’ = all'\na + la = alla   a + i = ai     a + gli = agli   a + le = alle\n\nGenauso: di→del, da→dal, in→nel, su→sul."
      }
    ],
    cards: [
      { id:"git_pp_1", prompt:"Vado ___ Roma.", de:"Ich fahre nach Rom.", answer:"a", options:["a","in","da","di"], why:"Stadt: a." },
      { id:"git_pp_2", prompt:"Vado ___ Italia.", de:"Ich fahre nach Italien.", answer:"in", options:["a","in","da","per"], why:"Land: in." },
      { id:"git_pp_3", prompt:"Vado ___ Marco.", de:"Ich gehe zu Marco.", answer:"da", options:["a","in","da","di"], why:"zu einer Person: da." },
      { id:"git_pp_4", prompt:"a + il = ?", de:"Verschmelzung", answer:"al", options:["al","all","allo","del"], why:"a + il → al." },
      { id:"git_pp_5", prompt:"Sono ___ casa.", de:"Ich bin zu Hause.", answer:"a", options:["a","in","da","di"], why:"a casa." }
    ]
  },
  {
    id: "it-passato",
    lv: 3,
    title: "Passato prossimo",
    summary: "Die Alltagserzählzeit: ho fatto, sono andato.",
    lessons: [
      {
        title: "So wird gebildet",
        body: "Präsens von avere/essere + Partizip\n\n-are → -ato (parlato)\n-ere → -uto (creduto) – viele unregelmäßig\n-ire → -ito (dormito)\n\nUnregelmäßig oft: fatto, detto, scritto, visto, preso, aperto, chiuso, venuto, andato."
      },
      {
        title: "Wann essere?",
        body: "Bewegung und Zustandswechsel, Reflexiv:\nSono uscito.  È arrivata.  Ci siamo vestiti.\n\nPartizip richtet sich dann nach der Person:\nLei è andata.  Loro sono andati."
      }
    ],
    cards: [
      { id:"git_ppx_1", prompt:"parlare · io (gestern)", de:"sprechen · ich", answer:"ho parlato", options:["ho parlato","sono parlato","parlavo","parlo"], why:"regelm. -are mit avere." },
      { id:"git_ppx_2", prompt:"andare · lei (gestern)", de:"gehen · sie", answer:"è andata", options:["ha andato","è andata","andava","è andato lei"], why:"essere + Angleichung." },
      { id:"git_ppx_3", prompt:"fare · tu (gestern)", de:"machen · du", hint:"unregelmäßig", answer:"hai fatto", options:["hai fato","hai fatto","sei fatto","facevi"], why:"fare → fatto." },
      { id:"git_ppx_4", prompt:"vedere · noi", de:"sehen · wir", answer:"abbiamo visto", options:["abbiamo visto","siamo visti","vedevamo","vediamo"], why:"vedere → visto, avere." }
    ]
  },
  {
    id: "it-cong",
    lv: 4,
    title: "Congiuntivo presente",
    summary: "Wünsche, Zweifel, Wichtigkeit: che tu venga.",
    lessons: [
      {
        title: "Wann?",
        body: "Nach Ausdrücken wie:\nvolere che, sperare che\nè importante che, è meglio che\nnon credere che, non pensare che\nprima che, sebbene\n\nVoglio che tu venga.  Non credo che piova."
      },
      {
        title: "Formen",
        body: "-are: parli, parli, parli, parliamo, parliate, parlino\n-ere/-ire: creda / dorma …\n\nessere → sia    avere → abbia    andare → vada    fare → faccia    stare → stia"
      }
    ],
    cards: [
      { id:"git_cg_1", prompt:"volere che · tu venire", de:"ich will, dass du kommst", answer:"venga", options:["vieni","venga","verrai","venivi"], why:"andare/venire: vada/venga." },
      { id:"git_cg_2", prompt:"essere · io (Cong.)", de:"sein · ich", answer:"sia", options:["sono","sia","fossi","stia"], why:"essere → sia." },
      { id:"git_cg_3", prompt:"Non credo che ___ (piovere).", de:"Ich glaube nicht, dass es regnet.", answer:"piova", options:["piove","piova","pioverà","pioveva"], why:"non credere che + Congiuntivo." }
    ]
  }
];

const DIALOGS_IT = [
  {
    id: "dlg_cafe",
    lv: 1,
    title: "Im Café",
    scene: "Du bestellst etwas an der Theke.",
    lines: [
      { who: "Tu", es: "Ciao, un caffè latte, per favore.", de: "Hallo, einen Milchkaffee, bitte." },
      { who: "Cameriere", es: "Altro?", de: "Noch etwas?" },
      { who: "Tu", es: "Sì, anche un cornetto.", de: "Ja, auch ein Hörnchen." },
      { who: "Cameriere", es: "Da asporto o qui?", de: "Zum Mitnehmen oder hier?" },
      { who: "Tu", es: "Qui. Quanto viene?", de: "Hier. Was kostet das?" },
      { who: "Cameriere", es: "Sono tre euro e venti.", de: "Drei Euro zwanzig." }
    ]
  },
  {
    id: "dlg_hola",
    lv: 1,
    title: "Vorstellen",
    scene: "Du triffst jemanden zum ersten Mal.",
    lines: [
      { who: "Ana", es: "Ciao, come va? Mi chiamo Ana.", de: "Hallo, wie geht’s? Ich heiße Ana." },
      { who: "Tu", es: "Piacere, mi chiamo Benedikt. Sono della Germania.", de: "Freut mich, ich heiße Benedikt. Ich komme aus Deutschland." },
      { who: "Ana", es: "Parli italiano?", de: "Sprichst du Italienisch?" },
      { who: "Tu", es: "Un po'. Sto imparando.", de: "Ein bisschen. Ich lerne gerade." },
      { who: "Ana", es: "Molto bene! Se non capisci, dimmelo.", de: "Sehr gut! Wenn du etwas nicht verstehst, sag Bescheid." }
    ]
  },
  {
    id: "dlg_camino",
    lv: 2,
    title: "Nach dem Weg",
    scene: "Du suchst den Bahnhof.",
    lines: [
      { who: "Tu", es: "Scusi, dov'è la stazione?", de: "Entschuldigung, wo ist der Bahnhof?" },
      { who: "Local", es: "Vai sempre dritto e poi a sinistra.", de: "Geh geradeaus und dann links." },
      { who: "Tu", es: "È lontano?", de: "Ist es weit?" },
      { who: "Local", es: "No, cinque minuti a piedi.", de: "Nein, fünf Minuten zu Fuß." },
      { who: "Tu", es: "Perfetto, grazie mille.", de: "Perfekt, vielen Dank." }
    ]
  },
  {
    id: "dlg_hotel",
    lv: 2,
    title: "Im Hotel",
    scene: "Du checkst ein.",
    lines: [
      { who: "Tu", es: "Buonasera, ho una prenotazione.", de: "Guten Tag, ich habe eine Reservierung." },
      { who: "Reception", es: "A che nome?", de: "Auf welchen Namen?" },
      { who: "Tu", es: "A nome Stoeck. Una camera per due.", de: "Auf den Namen Stoeck. Ein Zimmer für zwei." },
      { who: "Reception", es: "Ecco la chiave. La colazione è dalle otto alle dieci.", de: "Hier ist der Schlüssel. Das Frühstück ist von acht bis zehn." },
      { who: "Tu", es: "C'è il wifi?", de: "Gibt es WLAN?" },
      { who: "Reception", es: "Sì, la password è sul tesserino.", de: "Ja, das Passwort steht auf der Karte." }
    ]
  },
  {
    id: "dlg_medico",
    lv: 3,
    title: "Beim Arzt",
    scene: "Dir ist nicht gut.",
    lines: [
      { who: "Tu", es: "Buongiorno, mi fa molto male la testa.", de: "Guten Tag, mir tut der Kopf sehr weh." },
      { who: "Medico", es: "Da quando?", de: "Seit wann?" },
      { who: "Tu", es: "Da ieri. Ho anche un po' di febbre.", de: "Seit gestern. Ich habe auch ein bisschen Fieber." },
      { who: "Medico", es: "È allergico a qualche medicinale?", de: "Sind Sie gegen ein Medikament allergisch?" },
      { who: "Tu", es: "No, che io sappia.", de: "Nein, soweit ich weiß." },
      { who: "Medico", es: "Prenda questo e riposi. Se non migliora, torni.", de: "Nehmen Sie das und ruhen Sie sich aus. Wenn es nicht besser wird, kommen Sie wieder." }
    ]
  },
  {
    id: "dlg_tienda",
    lv: 2,
    title: "Im Laden",
    scene: "Du kaufst etwas.",
    lines: [
      { who: "Tu", es: "Ciao, sto cercando una camicia bianca.", de: "Hallo, ich suche ein weißes Hemd." },
      { who: "Commessa", es: "Che taglia?", de: "Welche Größe?" },
      { who: "Tu", es: "Media, credo. Posso provarla?", de: "Mittel, denke ich. Kann ich das anprobieren?" },
      { who: "Commessa", es: "Certo, il camerino è là.", de: "Klar, die Kabine ist dort." },
      { who: "Tu", es: "Mi sta bene. La prendo. Posso pagare con la carta?", de: "Es passt. Ich nehme es. Kann ich mit Karte zahlen?" }
    ]
  }
];
