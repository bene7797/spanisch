const VOCAB_CATS = [
  { id: "basics", name: "Begrüßung & Basics", emoji: "👋", hint: "Hallo, bitte, ja, nein" },
  { id: "food", name: "Essen & Trinken", emoji: "🍽", hint: "Küche, Café, Markt" },
  { id: "things", name: "Alltagsgegenstände", emoji: "🔑", hint: "Zuhause, Dinge, Technik" },
  { id: "people", name: "Menschen & Familie", emoji: "👨‍👩‍👧", hint: "Beziehungen, Berufe" },
  { id: "travel", name: "Reisen & Orte", emoji: "✈", hint: "Stadt, Weg, Hotel" },
  { id: "time", name: "Zeit & Zahlen", emoji: "🕒", hint: "Tage, Monate, Uhr" },
  { id: "body", name: "Körper & Gesundheit", emoji: "💪", hint: "Arzt, Körperteile" },
  { id: "nature", name: "Natur & Wetter", emoji: "🌤", hint: "Jahreszeiten, Landschaft" },
  { id: "work", name: "Arbeit & Lernen", emoji: "📚", hint: "Büro, Schule, Denken" },
  { id: "clothes", name: "Kleidung & Farben", emoji: "👕", hint: "Anziehen, Farben" },
  { id: "feelings", name: "Gefühle & Eigenschaften", emoji: "💛", hint: "Adjektive, Stimmung" },
  { id: "verbs", name: "Wichtige Verben", emoji: "⚡", hint: "Tun, gehen, können" },
  { id: "custom", name: "Eigene Wörter", emoji: "✦", hint: "Von dir eingetragen" }
];

const CAT_GROUPS = {
  basics: [
    "v1","v2","v3","v4","v5","v6","v7","v8","v9","v10","v11","v12","v13","v14","v15","v16","v17","v18","v19","v20",
    "v21","v22","v23","v24","v25","v26","v27","v28","v29","v30","v31","v32","v33","v34","v35","v36","v37","v38","v39",
    "v90","v91","v92","v93","v94","v95","v96","v97","v98","v99","v100","v257","v258","v259","v260","v261",
    "v347","v348","v349","v350","v351","v352","v353","v354","v355"
  ],
  food: [
    "v52","v53","v58","v59","v60","v123","v124","v125","v126","v127","v128","v129","v130","v131","v132","v133","v134",
    "v135","v136","v146","v315","v316","v317","v318","v319","v320","v321","v322","v323","v404"
  ],
  things: [
    "v61","v74","v154","v155","v156","v157","v158","v159","v160","v161","v162","v225","v291","v296","v297","v298","v299",
    "v300","v313","v314"
  ],
  people: [
    "v65","v66","v67","v68","v69","v70","v217","v218","v219","v220","v221","v222","v223","v224","v232","v238"
  ],
  travel: [
    "v71","v72","v137","v138","v139","v140","v141","v142","v143","v144","v145","v147","v148","v149","v150","v151",
    "v152","v153","v174","v175","v176","v177","v178","v179","v180","v187","v188","v189","v198","v199","v200",
    "v207","v208","v209","v210","v288","v289","v290","v292","v293","v294","v295","v330","v331","v461","v481",
    "v482","v483","v484","v485","v486","v487","v488","v489","v490"
  ],
  time: [
    "v62","v63","v64","v73","v86","v87","v88","v89","v101","v102","v103","v104","v105","v106","v107","v108","v109",
    "v110","v111","v112","v113","v114","v115","v116","v117","v118","v119","v120","v121","v122","v201","v202","v203",
    "v204","v205","v206","v211","v212","v213","v230","v231","v338","v339","v347","v358","v359","v362","v369","v370",
    "v371","v468","v469","v470","v471","v491","v492","v493"
  ],
  body: [
    "v165","v166","v167","v232","v233","v280","v305","v306","v307","v308","v309","v310","v311","v312"
  ],
  nature: [
    "v168","v169","v170","v171","v172","v173","v251","v252","v281","v282","v283","v284","v285","v286","v287",
    "v462","v463","v464","v465","v466","v467"
  ],
  work: [
    "v40","v41","v42","v50","v51","v54","v76","v163","v164","v181","v182","v183","v184","v185","v186","v191",
    "v234","v235","v236","v237","v239","v262","v263","v266","v267","v268","v299","v300","v364","v365","v366",
    "v384","v385","v386","v387","v388","v389","v427","v436","v437","v438","v478","v479","v480"
  ],
  clothes: [
    "v168","v169","v170","v171","v172","v173","v198","v301","v302","v303","v304"
  ],
  feelings: [
    "v77","v78","v79","v80","v81","v82","v83","v84","v85","v194","v240","v241","v242","v243","v244","v245","v246",
    "v247","v248","v249","v250","v324","v325","v326","v327","v374","v375","v393","v394","v395","v396","v397","v398",
    "v399","v400","v401","v402","v403","v405","v406","v407","v408","v409","v410","v411","v412","v413","v414","v415",
    "v445","v446","v447","v448"
  ],
  verbs: [
    "v40","v41","v42","v43","v44","v45","v46","v47","v48","v49","v50","v51","v52","v53","v54","v55","v56","v57",
    "v174","v175","v176","v177","v178","v179","v180","v181","v182","v183","v184","v185","v186","v187","v188","v189",
    "v190","v191","v192","v193","v194","v195","v196","v197","v198","v199","v200","v262","v263","v264","v265","v266",
    "v267","v268","v269","v270","v271","v272","v273","v274","v275","v276","v277","v278","v279","v321","v328","v329",
    "v330","v332","v333","v334","v335","v336","v337","v416","v417","v418","v419","v420"
  ]
};

const VOCAB_CAT_MAP = (() => {
  const map = {};
  Object.entries(CAT_GROUPS).forEach(([cat, ids]) => {
    ids.forEach((id) => {
      if (!map[id]) map[id] = [];
      if (!map[id].includes(cat)) map[id].push(cat);
    });
  });
  return map;
})();

function catsForVocab(item) {
  if (item?.custom || item?.cat === "custom") return ["custom"];
  if (item?.cat) return Array.isArray(item.cat) ? item.cat : [item.cat];
  return VOCAB_CAT_MAP[item?.id] || [];
}
