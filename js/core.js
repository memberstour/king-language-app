/* 킹링고 — 순수 로직 (날짜, 섞기, 퀴즈 만들기, 발음 유사도)
 * DOM에 의존하지 않아 그대로 시험할 수 있습니다.
 */
(function (global) {
  "use strict";

  function pad2(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function dateKey(d) {
    var date = d || new Date();
    return date.getFullYear() + "-" + pad2(date.getMonth() + 1) + "-" + pad2(date.getDate());
  }

  function parseKey(key) {
    var p = String(key || "").split("-");
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]), 12, 0, 0, 0);
  }

  function addDays(key, n) {
    var d = parseKey(key);
    d.setDate(d.getDate() + n);
    return dateKey(d);
  }

  function diffDays(fromKey, toKey) {
    if (!fromKey || !toKey) return null;
    var a = parseKey(fromKey).getTime();
    var b = parseKey(toKey).getTime();
    return Math.round((b - a) / 86400000);
  }

  function shuffle(list) {
    var arr = list.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
    }
    return arr;
  }

  function tokenize(sentence) {
    if (!sentence) return [];
    if (sentence.w && sentence.w.length) return sentence.w.slice();
    return String(sentence.text || "").split(/\s+/).filter(function (t) { return t.length > 0; });
  }

  function normalize(str, lang) {
    var s = String(str || "").toLowerCase();
    s = s.replace(/[.,!?;:'"“”‘’、。！？；：…·\-—()（）\[\]{}]/g, " ");
    s = s.replace(/\s+/g, " ").trim();
    if (lang === "zh") s = s.replace(/\s+/g, "");
    return s;
  }

  function levenshtein(a, b) {
    if (a === b) return 0;
    var la = a.length, lb = b.length;
    if (!la) return lb;
    if (!lb) return la;
    var prev = new Array(lb + 1);
    var cur = new Array(lb + 1);
    var i, j;
    for (j = 0; j <= lb; j++) prev[j] = j;
    for (i = 1; i <= la; i++) {
      cur[0] = i;
      for (j = 1; j <= lb; j++) {
        var cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      }
      var tmp = prev; prev = cur; cur = tmp;
    }
    return prev[lb];
  }

  function similarity(a, b, lang) {
    var na = normalize(a, lang);
    var nb = normalize(b, lang);
    if (!na && !nb) return 1;
    if (!na || !nb) return 0;
    var dist = levenshtein(na, nb);
    var ratio = 1 - dist / Math.max(na.length, nb.length);
    return ratio < 0 ? 0 : ratio > 1 ? 1 : ratio;
  }

  function feedbackFor(ratio) {
    if (ratio >= 0.95) return { tone: "great", title: "완벽해요!", desc: "원어민처럼 자연스러웠어요." };
    if (ratio >= 0.8) return { tone: "good", title: "아주 좋아요!", desc: "거의 다 들렸어요. 한 번 더 말해볼까요?" };
    if (ratio >= 0.6) return { tone: "ok", title: "좋아요, 거의 다 왔어요", desc: "조금 더 또박또박 말해 보세요." };
    return { tone: "again", title: "다시 한 번!", desc: "천천히 듣고 따라 말해 보세요." };
  }

  function sample(list, count, excludeFn) {
    var pool = list.filter(function (x) { return !excludeFn || !excludeFn(x); });
    var picked = [];
    var bag = shuffle(pool);
    for (var i = 0; i < bag.length && picked.length < count; i++) picked.push(bag[i]);
    return picked;
  }

  /** 문장 목록으로 4지선다(뜻 고르기) 퀴즈를 만듭니다. */
  function buildMeaningQuiz(sentences, pool, count) {
    var picked = shuffle(sentences).slice(0, count || sentences.length);
    return picked.map(function (s) {
      var wrong = sample(pool, 3, function (x) { return x.id === s.id || x.ko === s.ko; });
      var options = shuffle(wrong.map(function (x) { return { text: x.ko, correct: false }; })
        .concat([{ text: s.ko, correct: true }]));
      return { sentence: s, options: options };
    });
  }

  var WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

  function fmtDateKo(key) {
    var d = parseKey(key);
    return (d.getMonth() + 1) + "월 " + d.getDate() + "일 (" + WEEKDAYS[d.getDay()] + ")";
  }

  function fmtShortKo(key) {
    var d = parseKey(key);
    return (d.getMonth() + 1) + "/" + d.getDate();
  }

  function greeting(hour) {
    var h = typeof hour === "number" ? hour : new Date().getHours();
    if (h < 5) return "늦은 밤이에요";
    if (h < 11) return "좋은 아침이에요";
    if (h < 17) return "좋은 오후예요";
    if (h < 22) return "좋은 저녁이에요";
    return "오늘도 수고 많았어요";
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function percent(done, total) {
    if (!total) return 0;
    return clamp(Math.round((done / total) * 100), 0, 100);
  }

  global.KingCore = {
    pad2: pad2,
    dateKey: dateKey,
    parseKey: parseKey,
    addDays: addDays,
    diffDays: diffDays,
    shuffle: shuffle,
    tokenize: tokenize,
    normalize: normalize,
    levenshtein: levenshtein,
    similarity: similarity,
    feedbackFor: feedbackFor,
    sample: sample,
    buildMeaningQuiz: buildMeaningQuiz,
    fmtDateKo: fmtDateKo,
    fmtShortKo: fmtShortKo,
    greeting: greeting,
    clamp: clamp,
    percent: percent,
    WEEKDAYS: WEEKDAYS
  };
})(typeof window !== "undefined" ? window : this);
