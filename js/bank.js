/* 킹링고 — 단원평가 · 문제은행 문제 만들기 (순수 로직)
 * DOM에 의존하지 않습니다. 같은 문장에서 듣기·뜻·읽기·빈칸·배열·문장 고르기 문제를 만듭니다.
 * 문제 하나는 다음 모양입니다.
 *   { key, type, lang, unitId, unitNo, sentenceId, text, read, ko, tip,
 *     speak, options: [{text, correct}], parts: [{t, blank}], tokens: [...] }
 * 정답은  4지선다 → 보기 번호(0~3),  문장 배열 → 문자열 배열  입니다.
 */
(function (global) {
  "use strict";

  var C = global.KingCore;

  var PASS_SCORE = 80;

  var TYPES = [
    { id: "listen", name: "듣기", ico: "🎧", desc: "듣고 뜻 고르기" },
    { id: "meaning", name: "뜻 고르기", ico: "📖", desc: "문장의 뜻 고르기" },
    { id: "read", name: "읽기", ico: "🔤", desc: "병음·발음 고르기" },
    { id: "blank", name: "빈칸", ico: "✳️", desc: "빈칸에 들어갈 말" },
    { id: "order", name: "문장 배열", ico: "🧩", desc: "단어 순서 맞추기" },
    { id: "pick", name: "문장 고르기", ico: "🎯", desc: "뜻에 맞는 문장 찾기" }
  ];

  function typeName(id) {
    for (var i = 0; i < TYPES.length; i++) if (TYPES[i].id === id) return TYPES[i].name;
    return id;
  }

  function reading(s) {
    return (s && (s.read || s.pinyin)) || "";
  }

  function sep(course) {
    return course && course.space ? " " : "";
  }

  function tokensOf(sentence) {
    if (sentence.w && sentence.w.length) return sentence.w.slice();
    return String(sentence.text || "").split(/\s+/).filter(function (t) { return t.length > 0; });
  }

  function uniquePush(list, value, seen) {
    if (value === null || typeof value === "undefined" || value === "") return;
    var key = String(value);
    if (seen[key]) return;
    seen[key] = true;
    list.push(value);
  }

  /** 같은 코스의 다른 문장에서 보기를 골라 4지선다 보기를 만듭니다. */
  function choiceOptions(correctText, pool, mapper) {
    var seen = {};
    var wrong = [];
    seen[String(correctText)] = true;
    var bag = C.shuffle(pool);
    for (var i = 0; i < bag.length && wrong.length < 3; i++) {
      var value = mapper(bag[i]);
      if (!value) continue;
      uniquePush(wrong, value, seen);
    }
    var options = wrong.map(function (t) { return { text: t, correct: false }; });
    options.push({ text: correctText, correct: true });
    return C.shuffle(options);
  }

  function baseQuestion(course, unit, s, type) {
    return {
      key: s.id + "|" + type,
      type: type,
      lang: course.code,
      unitId: unit.id,
      unitNo: unit.no,
      unitTitle: unit.title,
      sentenceId: s.id,
      text: s.text,
      read: reading(s),
      ko: s.ko,
      tip: s.tip || "",
      speak: s.text,
      options: [],
      parts: null,
      tokens: null
    };
  }

  /** 문장 하나에서 유형 하나의 문제를 만듭니다. 만들 수 없으면 null. */
  function makeQuestion(course, unit, s, type, pool) {
    pool = pool || [];
    var q = baseQuestion(course, unit, s, type);

    if (type === "listen" || type === "meaning") {
      q.options = choiceOptions(s.ko, pool, function (x) { return x.ko; });
      return q;
    }

    if (type === "pick") {
      q.options = choiceOptions(s.text, pool, function (x) { return x.text; });
      return q;
    }

    if (type === "read") {
      if (!reading(s)) return null;
      q.options = choiceOptions(reading(s), pool, function (x) {
        return reading(x);
      });
      return q;
    }

    if (type === "blank") {
      var tokens = tokensOf(s);
      if (tokens.length < 2) return null;
      // 너무 짧은 토큰(조사 한 글자 등)은 빈칸으로 쓰지 않습니다.
      var candidates = [];
      tokens.forEach(function (t, i) {
        if (String(t).replace(/[^\w\u00c0-\u024f\u4e00-\u9fff\u3040-\u30ff]/g, "").length >= 1) candidates.push(i);
      });
      if (!candidates.length) candidates = [0];
      // 긴 토큰을 우선 빈칸으로 냅니다.
      candidates.sort(function (a, b) { return String(tokens[b]).length - String(tokens[a]).length; });
      var bi = candidates[Math.min(1, candidates.length - 1)];
      var answer = tokens[bi];
      var wordPool = [];
      pool.forEach(function (x) {
        tokensOf(x).forEach(function (t) { wordPool.push(t); });
      });
      q.options = choiceOptions(answer, wordPool, function (t) { return t; });
      q.parts = tokens.map(function (t, i) { return { t: t, blank: i === bi }; });
      q.answerWord = answer;
      return q;
    }

    if (type === "order") {
      var toks = tokensOf(s);
      if (toks.length < 2) return null;
      // 화면에서 누르기 좋게 최대 7조각까지만 냅니다.
      if (toks.length > 7) return null;
      q.tokens = toks;
      return q;
    }

    return null;
  }

  function allTypes(course, unit) {
    var list = ["listen", "meaning", "blank", "order", "pick"];
    var hasRead = unit.sentences.every(function (s) { return !!reading(s); });
    if (hasRead) list.push("read");
    return list;
  }

  /** 한 단원의 모든 문제(문제은행 재료). */
  function unitQuestions(course, unit) {
    var pool = [];
    course.units.forEach(function (u) {
      u.sentences.forEach(function (s) { pool.push(s); });
    });
    var types = allTypes(course, unit);
    var out = [];
    unit.sentences.forEach(function (s) {
      types.forEach(function (t) {
        var q = makeQuestion(course, unit, s, t, pool);
        if (q) out.push(q);
      });
    });
    return out;
  }

  /** 단원평가 10문항 — 듣기·뜻·빈칸·배열·문장 고르기를 섞고, 다섯 문장을 두 번씩 다룹니다. */
  function buildUnitExam(course, unit) {
    var pool = [];
    course.units.forEach(function (u) {
      u.sentences.forEach(function (s) { pool.push(s); });
    });
    var sents = unit.sentences;
    var hasRead = sents.every(function (s) { return !!reading(s); });
    var plan = [
      [0, "listen"], [0, "order"],
      [1, "meaning"], [1, "blank"],
      [2, "listen"], [2, "order"],
      [3, "meaning"], [3, "blank"],
      [4, "pick"], [4, hasRead ? "read" : "listen"]
    ];
    var out = [];
    var used = {};
    plan.forEach(function (pair) {
      var s = sents[Math.min(pair[0], sents.length - 1)];
      var q = makeQuestion(course, unit, s, pair[1], pool);
      if (!q || used[q.key]) return;
      used[q.key] = true;
      out.push(q);
    });
    // 문장이 5개보다 적은 경우를 대비해 남은 문제로 채웁니다.
    var spare = C.shuffle(unitQuestions(course, unit));
    for (var i = 0; i < spare.length && out.length < 10; i++) {
      if (!used[spare[i].key]) { used[spare[i].key] = true; out.push(spare[i]); }
    }
    return C.shuffle(out);
  }

  /** 문제은행 — 언어·단원·유형으로 골라 뽑습니다. */
  function buildBank(course, opts) {
    opts = opts || {};
    var unitNo = Number(opts.unitNo) || 0;
    var type = opts.type && opts.type !== "all" ? opts.type : null;
    var count = Math.max(1, Number(opts.count) || 10);
    var pool = [];
    course.units.forEach(function (u) {
      if (unitNo && u.no !== unitNo) return;
      var qs = unitQuestions(course, u);
      qs.forEach(function (q) { if (!type || q.type === type) pool.push(q); });
    });
    return C.shuffle(pool).slice(0, count);
  }

  function bankCount(course, opts) {
    opts = opts || {};
    var unitNo = Number(opts.unitNo) || 0;
    var type = opts.type && opts.type !== "all" ? opts.type : null;
    var n = 0;
    course.units.forEach(function (u) {
      if (unitNo && u.no !== unitNo) return;
      unitQuestions(course, u).forEach(function (q) { if (!type || q.type === type) n += 1; });
    });
    return n;
  }

  /** 랜덤 모의고사 — 여러 단원에서 고르게 뽑습니다(한 단원 최대 2문항). */
  function mockExam(course, count) {
    count = Math.max(1, Number(count) || 10);
    var all = [];
    course.units.forEach(function (u) {
      unitQuestions(course, u).forEach(function (q) { all.push(q); });
    });
    var bag = C.shuffle(all);
    var perUnit = {};
    var out = [];
    bag.forEach(function (q) {
      if (out.length >= count) return;
      var n = perUnit[q.unitId] || 0;
      if (n >= 2) return;
      perUnit[q.unitId] = n + 1;
      out.push(q);
    });
    // 단원 수가 적어 2문항 제한에 걸리면 남은 문제로 채웁니다.
    for (var i = 0; i < bag.length && out.length < count; i++) {
      if (out.indexOf(bag[i]) < 0) out.push(bag[i]);
    }
    return C.shuffle(out);
  }

  /** 오답노트에 모아 둔 문제 키로 다시 풀 문제를 만듭니다. */
  function byKeys(course, keys) {
    var want = {};
    (keys || []).forEach(function (k) { want[k] = true; });
    var out = [];
    course.units.forEach(function (u) {
      unitQuestions(course, u).forEach(function (q) {
        if (want[q.key]) out.push(q);
      });
    });
    return out;
  }

  function isCorrect(q, answer) {
    if (!q) return false;
    if (q.tokens) {
      if (!answer || answer.length !== q.tokens.length) return false;
      return answer.join("\u0001") === q.tokens.join("\u0001");
    }
    return !!(q.options && q.options[answer] && q.options[answer].correct);
  }

  function correctText(q) {
    if (!q) return "";
    if (q.tokens) return q.tokens.join(" ");
    for (var i = 0; i < q.options.length; i++) if (q.options[i].correct) return q.options[i].text;
    return "";
  }

  function answerText(q, answer) {
    if (!q) return "";
    if (q.tokens) {
      if (!answer || !answer.length) return "고르지 않음";
      return answer.join(" ");
    }
    if (typeof answer !== "number" || !q.options[answer]) return "고르지 않음";
    return q.options[answer].text;
  }

  function grade(questions, answers) {
    var total = questions.length;
    var correct = 0;
    var wrong = [];
    questions.forEach(function (q, i) {
      if (isCorrect(q, answers[i])) correct += 1;
      else wrong.push({ q: q, answer: answers[i] });
    });
    var score = total ? Math.round((correct / total) * 100) : 0;
    return {
      total: total,
      correct: correct,
      score: score,
      passed: score >= PASS_SCORE,
      wrong: wrong
    };
  }

  global.KingBank = {
    PASS_SCORE: PASS_SCORE,
    TYPES: TYPES,
    typeName: typeName,
    tokensOf: tokensOf,
    unitQuestions: unitQuestions,
    buildUnitExam: buildUnitExam,
    buildBank: buildBank,
    bankCount: bankCount,
    mockExam: mockExam,
    byKeys: byKeys,
    isCorrect: isCorrect,
    correctText: correctText,
    answerText: answerText,
    grade: grade
  };
})(typeof window !== "undefined" ? window : this);
