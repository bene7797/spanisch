const VOCAB_IT_RAW = `
v1|ciao|Ciao! Come va?
v2|arrivederci|Arrivederci, a domani.
v3|grazie|Grazie mille.
v4|per favore|Un caffè, per favore.
v5|sì|Sì, certo.
v6|no|No, grazie.
v7|buongiorno|Buongiorno, Ana.
v8|buon pomeriggio|Buon pomeriggio a tutti.
v9|buonanotte|Buonanotte, a domani.
v10|scusa|Scusa, dov'è il bagno?
v11|prego|—Grazie. —Prego.
v12|va bene|Va bene, ci vediamo.
v13|c'è / ci sono|C'è un problema.
v14|io|Io sono della Germania.
v15|tu|Tu parli italiano?
v16|lui|Lui è mio fratello.
v17|lei|Lei vive a Madrid.
v18|noi|Noi stiamo bene.
v19|voi|Voi siete studenti?
v20|loro|Loro lavorano qui.
v21|Lei (formale)|Come si chiama Lei?
v22|mi|Mi chiamo Luis.
v23|ti|Ti voglio bene.
v24|il|Il libro è nuovo.
v25|la|La casa è grande.
v26|i|I bambini giocano.
v27|le|Le tavole sono piene.
v28|un|Un caffè, per favore.
v29|una|Una domanda.
v30|mio / mia|Il mio nome è Sara.
v31|tuo / tua|Dov'è casa tua?
v32|che|Che cos'è questo?
v33|chi|Chi è lei?
v34|dove|Dove vivi?
v35|quando|Quando arrivi?
v36|perché|Perché studi italiano?
v37|come|Come stai?
v38|quanto|Quanto costa?
v39|quale|Quale preferisci?
v40|essere|Sono insegnante.
v41|stare|Sto stanco.
v42|avere|Ho due fratelli.
v43|andare|Vado a casa.
v44|fare|Che fai?
v45|potere|Puoi aiutarmi?
v46|volere|Voglio dell'acqua.
v47|dire|Che dici?
v48|vedere|Vedo un film.
v49|dare|Dammi un minuto.
v50|sapere|Non so.
v51|parlare|Parlo un po' di italiano.
v52|mangiare|Mangio alle due.
v53|bere|Bevo acqua.
v54|vivere|Vivo a Berlino.
v55|arrivare|Arrivo domani.
v56|venire|Vieni con me?
v57|chiamarsi|Mi chiamo Marta.
v58|l'acqua|Vorrei dell'acqua, per favore.
v59|il pane|Il pane è buono.
v60|il caffè|Un caffè latte.
v61|la casa|Questa è casa mia.
v62|il giorno|Oggi è una bella giornata.
v63|la notte|Buonanotte.
v64|il tempo|Non ho tempo.
v65|la gente|C'è molta gente.
v66|l'amico|È il mio migliore amico.
v67|la famiglia|La mia famiglia è grande.
v68|l'uomo|L'uomo parla inglese.
v69|la donna|La donna è medica.
v70|il bambino|Il bambino ha cinque anni.
v71|la città|Mi piace la città.
v72|il paese|La Spagna è un bel paese.
v73|l'anno|Quest'anno vado in Spagna.
v74|la cosa|È una cosa importante.
v75|la vita|La vita è breve.
v76|il lavoro|Vado al lavoro.
v77|buono|È un buon libro.
v78|cattivo|Oggi è una brutta giornata.
v79|grande|Una casa grande.
v80|piccolo|Un paese piccolo.
v81|molto|Ho molto lavoro.
v82|poco|Parlo poco italiano.
v83|più|Voglio più acqua.
v84|molto|Sto molto bene.
v85|bene|Tutto va bene.
v86|adesso|Adesso non posso.
v87|oggi|Oggi studio italiano.
v88|domani|A domani.
v89|sempre|Arrivo sempre in ritardo.
v90|anche|Anch'io voglio un caffè.
v91|ma|Voglio andare, ma non posso.
v92|perché|Studio perché mi piace.
v93|con|Vado con i miei amici.
v94|senza|Caffè senza latte.
v95|per|Questo è per te.
v96|per / da|Grazie di tutto.
v97|in / a|Sono a casa.
v98|di|Sono della Germania.
v99|a|Vado in Spagna.
v100|e|Tu e io.
v101|uno|Ne voglio uno.
v102|due|Ho due gatti.
v103|tre|Sono le tre.
v104|quattro|Quattro persone.
v105|cinque|Cinque minuti.
v106|sei|Sono le sei.
v107|sette|Sette giorni.
v108|otto|Alle otto.
v109|nove|Nove euro.
v110|dieci|Dieci anni.
v111|venti|Venti euro.
v112|cento|Cento parole.
v113|lunedì|Lunedì lavoro.
v114|martedì|Ci vediamo martedì.
v115|mercoledì|Mercoledì studio.
v116|giovedì|Giovedì c'è il mercato.
v117|venerdì|Venerdì esco.
v118|sabato|Sabato riposo.
v119|domenica|Domenica vedo la mia famiglia.
v120|la settimana|Questa settimana sono occupato.
v121|il mese|Il mese prossimo viaggio.
v122|gennaio|A gennaio fa freddo.
v123|il cibo / il pranzo|Il pranzo è pronto.
v124|la colazione|La colazione è alle otto.
v125|la mela|Una mela al giorno.
v126|il pollo|Vorrei pollo con riso.
v127|il pesce|Il pesce è fresco.
v128|la carne|Non mangio carne.
v129|il riso|Riso con verdure.
v130|l'insalata|Un'insalata mista.
v131|il formaggio|Formaggio e pane.
v132|il latte|Caffè con latte.
v133|il vino|Un bicchiere di vino.
v134|la birra|Una birra, per favore.
v135|il ristorante|Andiamo al ristorante.
v136|il conto|Il conto, per favore.
v137|l'hotel|Dormiamo in un hotel.
v138|il treno|Il treno arriva in ritardo.
v139|l'autobus|Prendo l'autobus.
v140|l'aereo|L'aereo parte alle dieci.
v141|la macchina|Vado in macchina.
v142|la stazione|La stazione è vicina.
v143|l'aeroporto|Andiamo in aeroporto.
v144|la strada|Abito in questa strada.
v145|la piazza|Ci troviamo in piazza.
v146|il mercato|Compro la frutta al mercato.
v147|il negozio|Il negozio apre alle nove.
v148|i soldi|Non ho soldi.
v149|il prezzo|Il prezzo è buono.
v150|economico|È molto economico.
v151|caro|Questo hotel è caro.
v152|aperto|Il museo è aperto.
v153|chiuso|Oggi è chiuso.
v154|la porta|Chiudi la porta.
v155|la finestra|Apri la finestra.
v156|il tavolo|Il tavolo è occupato.
v157|la sedia|Siediti sulla sedia.
v158|il letto|Vado a letto.
v159|il bagno|Dov'è il bagno?
v160|la cucina|Sono in cucina.
v161|la stanza|Una camera doppia.
v162|il telefono|Hai un telefono?
v163|la domanda|Ho una domanda.
v164|la risposta|Non so la risposta.
v165|la mano|Dammi la mano.
v166|l'occhio|Hai gli occhi verdi.
v167|la testa|Mi fa male la testa.
v168|rosso|Una macchina rossa.
v169|blu|Il cielo è blu.
v170|verde|Mi piace il verde.
v171|nero|Un gatto nero.
v172|bianco|Una camicia bianca.
v173|giallo|Il sole è giallo.
v174|comprare|Compro il pane.
v175|vendere|Qui vendono frutta.
v176|pagare|Posso pagare con la carta?
v177|ordinare / chiedere|Chiedo il conto.
v178|cercare|Cerco un hotel.
v179|trovare|Non trovo le chiavi.
v180|aspettare|Aspetto l'autobus.
v181|avere bisogno|Ho bisogno di aiuto.
v182|lavorare|Lavoro in un ufficio.
v183|studiare|Studio italiano ogni giorno.
v184|imparare|Imparo il vocabolario.
v185|capire|Non capisco.
v186|pensare|Penso a te.
v187|uscire|Esco con gli amici.
v188|entrare|Entra, per favore.
v189|tornare|Torno alle sei.
v190|dormire|Dormo otto ore.
v191|aiutare|Puoi aiutarmi?
v192|guardare|Guardo la tv.
v193|ascoltare|Ascolto la musica.
v194|piacere|Mi piace il caffè.
v195|aprire|Apro la porta.
v196|chiudere|Chiudi la finestra.
v197|conoscere|Conosco Madrid.
v198|portare|Porto una giacca.
v199|succedere / passare|Che succede?
v200|restare / trovarsi|Ci troviamo alle cinque?
v201|la mattina|La mattina corro.
v202|il pomeriggio|Nel pomeriggio studio.
v203|ieri|Ieri sono andato al cinema.
v204|mai|Non mangio mai carne.
v205|già|È già pronto.
v206|ancora|Non lo so ancora.
v207|qui|Vieni qui.
v208|lì|La banca è lì.
v209|vicino|Abito vicino.
v210|lontano|È lontano dal centro.
v211|prima|Prima di mangiare, mi lavo le mani.
v212|dopo|Dopo andiamo a casa.
v213|allora|Allora, che facciamo?
v214|anche se|Esco anche se piove.
v215|se|Se hai tempo, chiama.
v216|quando|Quando arrivo, ti avviso.
v217|il fratello|Mio fratello è più grande.
v218|la sorella|Mia sorella vive a Siviglia.
v219|il padre|Mio padre cucina bene.
v220|la madre|Mia madre è insegnante.
v221|il figlio|Hanno un figlio.
v222|la figlia|Sua figlia ha dieci anni.
v223|il cane|Il cane è molto buono.
v224|il gatto|Il gatto dorme molto.
v225|il libro|Leggo un libro.
v226|il film|Vediamo un film.
v227|la musica|Adoro la musica.
v228|il problema|Nessun problema.
v229|l'idea|È una buona idea.
v230|l'ora|Che ore sono?
v231|il minuto|Un minuto, per favore.
v232|il medico|Vado dal medico.
v233|l'ospedale|Lavora in ospedale.
v234|la scuola|I bambini vanno a scuola.
v235|la scuola|La scuola inizia alle nove.
v236|l'università|Studio all'università.
v237|l'ufficio|Lavoro in un ufficio.
v238|il capo|Il mio capo è gentile.
v239|l'esame|L'esame è domani.
v240|felice|Sono molto felice.
v241|triste|Oggi è triste.
v242|stanco|Sono stanco.
v243|occupato|Adesso sono occupato.
v244|facile|Non è facile.
v245|difficile|L'esame è difficile.
v246|importante|È importante studiare.
v247|bello|Che città bella.
v248|nuovo|Ho un telefono nuovo.
v249|vecchio|È un quartiere vecchio.
v250|giovane|È molto giovane.
v251|caldo|Il caffè è caldo.
v252|freddo|Fa freddo.
v253|pieno|Il treno è pieno.
v254|vuoto|La strada è vuota.
v255|stesso|Lo stesso giorno.
v256|altro|Ancora una volta, per favore.
v257|tutto|Tutto va bene.
v258|niente|Non è successo niente.
v259|qualcosa|Voglio qualcosa da bere.
v260|qualcuno|C'è qualcuno in casa?
v261|nessuno|Non c'è nessuno.
v262|leggere|Leggo ogni sera.
v263|scrivere|Scrivo un messaggio.
v264|mettere|Metto la tavola.
v265|portare|Porti il pane?
v266|continuare|Continuo a studiare.
v267|cominciare|Iniziamo alle nove.
v268|finire|Finisco alle sei.
v269|lasciare|Lascio le chiavi qui.
v270|perdere|Non perdere il treno.
v271|guadagnare|Guadagno pochi soldi.
v272|cambiare|Voglio cambiare hotel.
v273|usare|Posso usare il bagno?
v274|chiamare|Ti chiamo più tardi.
v275|ricordare|Non ricordo il suo nome.
v276|dimenticare|Dimentico le parole.
v277|credere|Credo di sì.
v278|sembrare|Mi sembra bene.
v279|sentire|Mi dispiace.
v280|fare male|Mi fa male la testa.
v281|piovere|Piove molto.
v282|il sole|Il sole splende.
v283|la pioggia|Non mi piace la pioggia.
v284|il mare|Andiamo al mare.
v285|la montagna|Mi piacciono le montagne.
v286|l'albero|C'è un albero grande.
v287|la spiaggia|Passiamo la giornata in spiaggia.
v288|il paese|È un paese piccolo.
v289|il centro|Abito in centro.
v290|il quartiere|È un quartiere tranquillo.
v291|la chiave|Hai le chiavi?
v292|il biglietto|Un biglietto del treno.
v293|il passaporto|Dov'è il mio passaporto?
v294|la valigia|Faccio la valigia.
v295|il viaggio|Buon viaggio.
v296|la foto|Faccio una foto.
v297|la posta / l'email|Ti mando una mail.
v298|la pagina|Guarda questa pagina.
v299|il computer|Lavoro con il computer.
v300|internet|C'è internet?
v301|i vestiti|Compro vestiti.
v302|la camicia|Una camicia bianca.
v303|le scarpe|Queste scarpe sono comode.
v304|il cappotto|Porto un cappotto.
v305|il corpo|Mi fa male il corpo.
v306|il braccio|Mi fa male il braccio.
v307|la gamba|Ho le gambe stanche.
v308|la bocca|Apri la bocca.
v309|il cuore|Ti voglio bene con tutto il cuore.
v310|la salute|Salute!
v311|la medicina|Prendo una medicina.
v312|il dolore|Ho mal di stomaco.
v313|la banca|Vado in banca.
v314|il supermercato|Vado al supermercato.
v315|la frutta|Mangio frutta ogni giorno.
v316|la verdura|Mi piacciono le verdure.
v317|l'uovo|Uova con pane.
v318|lo zucchero|Senza zucchero, per favore.
v319|il sale|Poco sale, per favore.
v320|l'olio|Olio d'oliva.
v321|cucinare|Mi piace cucinare.
v322|provare|Prova questo.
v323|preferire|Preferisco il tè.
v324|adorare|Adoro l'Italia.
v325|odiare|Odio alzarmi presto.
v326|ridere|Ridiamo tanto.
v327|piangere|Il bambino piange.
v328|correre|Corro la mattina.
v329|camminare|Camminiamo per la città.
v330|viaggiare|Viaggio spesso.
v331|visitare|Visitiamo un museo.
v332|restare|Resto a casa.
v333|alzarsi|Mi alzo alle sette.
v334|andare a letto|Vado a letto tardi.
v335|farsi la doccia|Faccio la doccia la mattina.
v336|vestirsi|Mi vesto in fretta.
v337|svegliarsi|Mi sveglio presto.
v338|presto|Arrivo presto.
v339|tardi|È troppo tardi.
v340|piano|Parla più piano, per favore.
v341|veloce|Il treno è veloce.
v342|solo|Voglio solo dell'acqua.
v343|insieme|Andiamo insieme.
v344|quasi|Non mangio quasi mai carne.
v345|troppo|È troppo caro.
v346|abbastanza|È abbastanza facile.
v347|non ancora|Non capisco ancora.
v348|certo|Certo che sì.
v349|d'accordo|Sono d'accordo.
v350|mi dispiace|Mi dispiace, arrivo tardi.
v351|cioè|Non posso, cioè non ho tempo.
v352|mentre|Cucino mentre ascolti musica.
v353|tuttavia|È difficile, tuttavia ci provo.
v354|perciò|Sono stanco, perciò resto.
v355|inoltre|Inoltre è economico.
v356|su / sopra|Un libro sull'Italia.
v357|tra|Tra te e me.
v358|fino a|A dopo.
v359|da|Vivo qui dal 2020.
v360|contro|Non sono contro di te.
v361|secondo|Secondo la mappa, è vicino.
v362|durante|Durante il viaggio ha piovuto.
v363|verso|Camminiamo verso il mare.
v364|il governo|Il governo decide.
v365|la legge|È la legge.
v366|la notizia|Ho visto le notizie.
v367|il mondo|Viaggio per il mondo.
v368|la terra|Ci prendiamo cura della terra.
v369|il futuro|Il futuro è incerto.
v370|il passato|Questo è passato.
v371|il presente|Vivi il presente.
v372|la verità|Dico la verità.
v373|la bugia|Questa è una bugia.
v374|la paura|Ho paura.
v375|la fortuna|Buona fortuna!
v376|il successo|È un grande successo.
v377|l'errore|Ho fatto un errore.
v378|il dubbio|Ho un dubbio.
v379|la ragione|Hai ragione.
v380|il senso|Ha senso.
v381|il modo|Non c'è un altro modo.
v382|l'esempio|Per esempio.
v383|il caso|In questo caso, sì.
v384|l'obiettivo|Il mio obiettivo è parlare bene.
v385|il risultato|Il risultato è buono.
v386|la decisione|È una decisione difficile.
v387|l'opinione|Secondo me…
v388|il consiglio|Un consiglio: parla ogni giorno.
v389|l'esperienza|È stata una bella esperienza.
v390|il ricordo|È un bel ricordo.
v391|l'abitudine|È un'abitudine italiana.
v392|l'atmosfera|C'è una bella atmosfera.
v393|pericoloso|È pericoloso attraversare qui.
v394|sicuro|Sei al sicuro qui.
v395|possibile|È possibile.
v396|impossibile|Non è impossibile.
v397|necessario|È necessario esercitarsi.
v398|libero|Sei libero domani?
v399|nervoso|Sono nervoso.
v400|tranquillo|Un paese tranquillo.
v401|rumoroso|Il bar è rumoroso.
v402|pulito|La stanza è pulita.
v403|sporco|I piatti sono sporchi.
v404|buono / ricco|È molto buono.
v405|povero|È un quartiere povero.
v406|forte|Un caffè forte.
v407|debole|Mi sento debole.
v408|pronto|Sei pronto?
v409|sciocco|Non essere sciocco.
v410|gentile|La gente è gentile.
v411|educato|È molto educato.
v412|famoso|Un pittore famoso.
v413|speciale|È un giorno speciale.
v414|normale|È normale essere nervosi.
v415|strano|Che strano.
v416|riuscire|Prendo un biglietto.
v417|provare|Provo a parlare italiano.
v418|raggiungere|Ho raggiunto l'obiettivo.
v419|decidere|Decido di restare.
v420|scegliere|Scegli un'opzione.
v421|offrire|Ti offro un caffè.
v422|accettare|Accetto l'invito.
v423|rifiutare|Rifiuto l'offerta.
v424|evitare|Evito il traffico.
v425|permettere|Non è permesso fumare.
v426|vietare|Qui è vietato nuotare.
v427|migliorare|Voglio migliorare il mio italiano.
v428|peggiorare|Il tempo peggiora.
v429|aumentare|I prezzi aumentano.
v430|scendere|Scendo le scale.
v431|salire|Salgo sull'autobus.
v432|cadere|Cade il bicchiere.
v433|rompere|Rompo un bicchiere.
v434|aggiustare|Aggiusto la bici.
v435|costruire|Costruiscono una casa.
v436|spiegare|Me lo spieghi?
v437|chiedere|Posso chiedere qualcosa.
v438|rispondere|Non risponde al telefono.
v439|raccontare|Raccontami che è successo.
v440|mostrare|Mostrami la strada.
v441|scoprire|Scopro un caffè nuovo.
v442|inventare|Non inventare storie.
v443|immaginare|Immagina che viaggiamo.
v444|sognare|Sogno di viaggiare.
v445|preoccuparsi|Non ti preoccupare.
v446|rilassarsi|Ho bisogno di rilassarmi.
v447|divertirsi|Ci divertiamo molto.
v448|annoiarsi|Mi annoio a casa.
v449|sposarsi|Si sposano a giugno.
v450|nascere|Sono nato nel 1998.
v451|morire|I fiori muoiono senza acqua.
v452|crescere|I bambini crescono in fretta.
v453|compiere|Compio trent'anni.
v454|promettere|Lo prometto.
v455|fidarsi|Mi fido di te.
v456|dubitare|Dubito che piova.
v457|ringraziare|Ti ringrazio.
v458|congratularsi|Ti faccio i complimenti.
v459|invitare|Ti invito a cena.
v460|incontrarsi|Ci incontriamo venerdì.
v461|il ponte|Attraversiamo il ponte.
v462|il fiume|Il fiume è largo.
v463|il bosco|Passeggiamo nel bosco.
v464|il cielo|Il cielo è grigio.
v465|la nuvola|Ci sono tante nuvole.
v466|il vento|C'è vento.
v467|la neve|Nevica in inverno.
v468|l'estate|In estate fa caldo.
v469|l'inverno|In inverno nevica.
v470|la primavera|La primavera è bella.
v471|l'autunno|In autunno cadono le foglie.
v472|la festa|C'è una festa sabato.
v473|il regalo|Un regalo per te.
v474|il matrimonio|Vado a un matrimonio.
v475|il compleanno|Buon compleanno!
v476|il Natale|A Natale viaggio.
v477|il capodanno|Buon anno.
v478|la riunione|Ho una riunione.
v479|l'appuntamento|Ho un appuntamento alle cinque.
v480|il piano|Qual è il piano?
v481|la strada|Questa è la strada.
v482|l'ingresso|Dov'è l'ingresso?
v483|l'uscita|La partenza è alle otto.
v484|l'orario|Guarda l'orario.
v485|in ritardo|Il treno è in ritardo.
v486|puntuale|Il volo non è puntuale.
v487|gratis|L'ingresso è gratis.
v488|incluso|La colazione è inclusa.
v489|disponibile|C'è un tavolo libero?
v490|completo|L'hotel è al completo.
v491|spesso|Viaggio spesso.
v492|ogni tanto|Mangio carne ogni tanto.
v493|subito|Arrivo subito.
v494|appena|Capisco appena.
v495|forse|Forse domani piove.
v496|forse|Forse ci vado.
v497|per niente|Non mi piace per niente.
v498|certamente|Certamente sì.
v499|essere uguale|Mi è uguale.
v500|avere voglia di|Ho voglia di viaggiare.
`;

const VOCAB_IT = (() => {
  const map = {};
  VOCAB_IT_RAW.trim().split("\n").forEach((line) => {
    const [id, it, exit] = line.split("|");
    if (id) map[id.trim()] = { it: (it || "").trim(), exit: (exit || "").trim() };
  });
  return map;
})();
