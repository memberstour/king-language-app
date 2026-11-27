/* 킹링고 — 학습 상태 저장고 (localStorage)
 * 스트릭, XP, 수업 완료, 외운 문장, 설정을 보관합니다.
 */
(function (global) {
  "use strict";

  var KEY = "kinglingo.state.v1";
  var D = global.KING_DATA;
  var C = global.KingCore;
  var state = null;

  function defaults() {
    return {
      version: 1,
      lang: "en",
      xp: 0,
      streak: { count: 0, best: 0, last: null },
      progress: {},
      mastered: {},
      daily: {},
      exams: {},
      wrong: {},
      library: {},
      prefs: { sound: true, slow: false, installDismissed: false, readerRate: 0.9, readerKo: false },
      createdAt: C.dateKey()
    };
  }

  function isObj(v) {
    return v && typeof v === "object" && !Array.isArray(v);
  }

  function normalize(st) {
    var d = defaults();
    if (!isObj(st)) st = d;
    if (!D.courses[st.lang]) st.lang = d.lang;
    if (typeof st.xp !== "number" || !isFinite(st.xp) || st.xp < 0) st.xp = 0;
    st.xp = Math.floor(st.xp);
    if (!isObj(st.streak)) st.streak = d.streak;
    st.streak.count = Math.max(0, Math.floor(Number(st.streak.count) || 0));
    st.streak.best = Math.max(0, Math.floor(Number(st.streak.best) || 0));
    if (typeof st.streak.last !== "string") st.streak.last = null;
    if (!isObj(st.progress)) st.progress = {};
    if (!isObj(st.mastered)) st.mastered = {};
    if (!isObj(st.daily)) st.daily = {};
    if (!isObj(st.prefs)) st.prefs = d.prefs;
    if (typeof st.prefs.sound !== "boolean") st.prefs.sound = true;
    if (typeof st.prefs.slow !== "boolean") st.prefs.slow = false;
    if (typeof st.prefs.installDismissed !== "boolean") st.prefs.installDismissed = false;
    var rate = Number(st.prefs.readerRate);
    st.prefs.readerRate = isFinite(rate) && rate >= 0.5 && rate <= 1.5 ? rate : 0.9;
    if (typeof st.prefs.readerKo !== "boolean") st.prefs.readerKo = false;
    st.exams = normalizeExams(st.exams);
    st.wrong = normalizeWrong(st.wrong);
    st.library = normalizeLibrary(st.library);
    Object.keys(st.daily).forEach(function (k) {
      var v = Number(st.daily[k]);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(k) || !isFinite(v) || v <= 0) delete st.daily[k];
      else st.daily[k] = Math.floor(v);
    });
    // 90일이 지난 기록은 정리합니다.
    var cutoff = C.addDays(C.dateKey(), -90);
    Object.keys(st.daily).forEach(function (k) {
      if (k < cutoff) delete st.daily[k];
    });
    return st;
  }

  function normalizeExams(raw) {
    var out = {};
    if (!isObj(raw)) return out;
    Object.keys(raw).forEach(function (k) {
      var r = raw[k];
      if (!isObj(r)) return;
      var best = Math.floor(Number(r.best) || 0);
      var last = Math.floor(Number(r.last) || 0);
      out[k] = {
        best: C.clamp(best, 0, 100),
        last: C.clamp(last, 0, 100),
        passed: !!r.passed,
        tries: Math.max(0, Math.floor(Number(r.tries) || 0)),
        at: typeof r.at === "string" ? r.at : null
      };
    });
    return out;
  }

  function normalizeWrong(raw) {
    var out = {};
    if (!isObj(raw)) return out;
    Object.keys(raw).forEach(function (k) {
      var w = raw[k];
      if (!isObj(w) || typeof w.sentenceId !== "string" || typeof w.unitId !== "string") return;
      out[k] = {
        key: k,
        lang: typeof w.lang === "string" ? w.lang : "en",
        unitId: w.unitId,
        unitNo: Math.max(0, Math.floor(Number(w.unitNo) || 0)),
        sentenceId: w.sentenceId,
        type: typeof w.type === "string" ? w.type : "",
        count: Math.max(1, Math.floor(Number(w.count) || 1)),
        at: typeof w.at === "string" ? w.at : null
      };
    });
    return out;
  }

  function normalizeLibrary(raw) {
    var out = {};
    if (!isObj(raw)) return out;
    Object.keys(raw).forEach(function (k) {
      var r = raw[k];
      if (!isObj(r)) return;
      out[k] = {
        page: Math.max(0, Math.floor(Number(r.page) || 0)),
        done: !!r.done,
        quizBest: C.clamp(Math.floor(Number(r.quizBest) || 0), 0, 100),
        at: typeof r.at === "string" ? r.at : null
      };
    });
    return out;
  }

  function load() {
    var st = null;
    try {
      var raw = global.localStorage ? global.localStorage.getItem(KEY) : null;
      if (raw) st = JSON.parse(raw);
    } catch (e) {
      st = null;
    }
    state = normalize(st || defaults());
    return state;
  }

  function get() {
    if (!state) load();
    return state;
  }

  function save() {
    try {
      if (global.localStorage) global.localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      /* 저장 공간이 없는 경우에도 앱은 동작합니다. */
    }
  }

  function courseOf(lang) {
    return D.courses[lang || get().lang];
  }

  function unitOf(lang, no) {
    var units = courseOf(lang).units;
    return units[Math.max(0, Math.min(units.length - 1, no - 1))];
  }

  function findUnit(unitId) {
    var langs = Object.keys(D.courses);
    for (var i = 0; i < langs.length; i++) {
      var units = D.courses[langs[i]].units;
      for (var j = 0; j < units.length; j++) {
        if (units[j].id === unitId) return units[j];
      }
    }
    return null;
  }

  function setLang(code) {
    get().lang = D.courses[code] ? code : Object.keys(D.courses)[0];
    save();
  }

  function progressOf(unitId) {
    var p = get().progress[unitId];
    return isObj(p) ? p : {};
  }

  function isLessonDone(unitId, lessonNo) {
    var p = progressOf(unitId);
    return !!(p[String(lessonNo)] && p[String(lessonNo)].done);
  }

  function doneLessons(unitId) {
    var p = progressOf(unitId);
    var n = 0;
    D.lessons.forEach(function (l) {
      if (p[String(l.no)] && p[String(l.no)].done) n += 1;
    });
    return n;
  }

  function isUnitDone(unitId) {
    return doneLessons(unitId) >= D.lessons.length;
  }

  function currentDayNo(lang) {
    var units = courseOf(lang).units;
    for (var i = 0; i < units.length; i++) {
      if (!isUnitDone(units[i].id)) return units[i].no;
    }
    return units[units.length - 1].no;
  }

  function doneDays(lang) {
    return courseOf(lang).units.filter(function (u) { return isUnitDone(u.id); }).length;
  }

  function courseXp(lang) {
    var total = 0;
    var units = courseOf(lang).units;
    units.forEach(function (u) {
      var p = progressOf(u.id);
      D.lessons.forEach(function (l) {
        var rec = p[String(l.no)];
        if (rec && rec.done) total += Number(rec.xp) || 0;
      });
    });
    return total;
  }

  function touchStreak() {
    var st = get();
    var today = C.dateKey();
    var s = st.streak;
    if (s.last === today) return;
    var gap = s.last ? C.diffDays(s.last, today) : null;
    if (gap === 1) s.count += 1;
    else s.count = 1;
    s.last = today;
    if (s.count > s.best) s.best = s.count;
  }

  function addXp(n) {
    var amount = Math.max(0, Math.floor(Number(n) || 0));
    if (!amount) return;
    var st = get();
    var today = C.dateKey();
    st.xp += amount;
    st.daily[today] = (st.daily[today] || 0) + amount;
    touchStreak();
    save();
  }

  /** 수업을 처음 끝냈을 때만 XP를 줍니다. 복습은 기록만 갱신합니다. */
  function completeLesson(unit, lesson, extra) {
    var st = get();
    var id = unit.id;
    if (!isObj(st.progress[id])) st.progress[id] = {};
    var key = String(lesson.no);
    var rec = st.progress[id][key];
    var first = !(rec && rec.done);
    var xp = 0;
    if (first) {
      xp = Number(lesson.xp) || 10;
      st.progress[id][key] = {
        done: true,
        at: new Date().toISOString(),
        xp: xp,
        accuracy: extra && typeof extra.accuracy === "number" ? extra.accuracy : null,
        tries: (rec && rec.tries) || 0
      };
      if (lesson.key === "speak") {
        unit.sentences.forEach(function (s) {
          st.mastered[s.id] = true;
        });
      }
    } else {
      if (rec) rec.lastAt = new Date().toISOString();
      touchStreak();
    }
    save();
    if (xp) addXp(xp);
    return { first: first, xp: xp };
  }

  function markMastered(sentenceId, value) {
    var st = get();
    if (value === false) delete st.mastered[sentenceId];
    else st.mastered[sentenceId] = true;
    save();
  }

  function isMastered(sentenceId) {
    return !!get().mastered[sentenceId];
  }

  function masteredCount(lang) {
    var prefix = (lang || get().lang) + "-";
    return Object.keys(get().mastered).filter(function (k) {
      return k.indexOf(prefix) === 0 && get().mastered[k];
    }).length;
  }

  function unitMastered(unitId) {
    var unit = findUnit(unitId);
    if (!unit) return 0;
    return unit.sentences.filter(function (s) { return get().mastered[s.id]; }).length;
  }

  function todayXp() {
    return get().daily[C.dateKey()] || 0;
  }

  function streakInfo() {
    var st = get();
    var today = C.dateKey();
    var last = st.streak.last;
    var gap = last ? C.diffDays(last, today) : null;
    var live = gap === 0 || gap === 1 ? st.streak.count : 0;
    return {
      count: live,
      best: st.streak.best,
      last: last,
      activeToday: gap === 0,
      activeYesterday: gap === 1
    };
  }

  function last7() {
    var st = get();
    var out = [];
    for (var i = 6; i >= 0; i--) {
      var key = C.addDays(C.dateKey(), -i);
      out.push({ key: key, xp: st.daily[key] || 0 });
    }
    return out;
  }

  function setPref(key, value) {
    var prefs = get().prefs;
    prefs[key] = value;
    save();
  }

  /* ---------- 단원평가 기록 ---------- */
  function examRecord(unitId) {
    var r = get().exams[unitId];
    return isObj(r) ? r : { best: 0, last: 0, passed: false, tries: 0, at: null };
  }

  function passedExamCount(lang) {
    var code = lang || get().lang;
    return Object.keys(get().exams).filter(function (k) {
      return k.indexOf(code + "-") === 0 && get().exams[k].passed;
    }).length;
  }

  /** 평가 결과를 저장하고 최고 점수·첫 통과 여부를 돌려줍니다. */
  function recordExam(unitId, result) {
    var st = get();
    var rec = isObj(st.exams[unitId]) ? st.exams[unitId] : { best: 0, last: 0, passed: false, tries: 0, at: null };
    var wasPassed = !!rec.passed;
    var score = C.clamp(Math.round(Number(result && result.score) || 0), 0, 100);
    rec.last = score;
    rec.tries = (rec.tries || 0) + 1;
    rec.at = new Date().toISOString();
    if (score > rec.best) rec.best = score;
    if (result && result.passed) rec.passed = true;
    st.exams[unitId] = rec;
    save();
    return { record: rec, best: rec.best, firstPass: !!(result && result.passed) && !wasPassed };
  }

  /* ---------- 오답노트 ---------- */
  function addWrong(q) {
    if (!q || !q.key) return;
    var st = get();
    var cur = isObj(st.wrong[q.key]) ? st.wrong[q.key] : null;
    st.wrong[q.key] = {
      key: q.key,
      lang: q.lang || get().lang,
      unitId: q.unitId,
      unitNo: q.unitNo || 0,
      sentenceId: q.sentenceId,
      type: q.type || "",
      count: (cur ? cur.count : 0) + 1,
      at: new Date().toISOString()
    };
    save();
  }

  function removeWrong(key) {
    var st = get();
    if (st.wrong[key]) {
      delete st.wrong[key];
      save();
    }
  }

  function wrongEntries(lang) {
    var code = lang || get().lang;
    return Object.keys(get().wrong).map(function (k) { return get().wrong[k]; }).filter(function (w) {
      return w.lang === code;
    }).sort(function (a, b) {
      return String(b.at || "").localeCompare(String(a.at || ""));
    });
  }

  function wrongCount(lang) {
    return wrongEntries(lang).length;
  }

  /* ---------- 영어원서 도서관 ---------- */
  function libraryOf(bookId) {
    var r = get().library[bookId];
    return isObj(r) ? r : { page: 0, done: false, quizBest: 0, at: null };
  }

  function saveLibrary(bookId, patch) {
    var st = get();
    var cur = isObj(st.library[bookId]) ? st.library[bookId] : { page: 0, done: false, quizBest: 0, at: null };
    Object.keys(patch || {}).forEach(function (k) { cur[k] = patch[k]; });
    cur.at = new Date().toISOString();
    st.library[bookId] = cur;
    save();
    return cur;
  }

  function libraryDoneCount() {
    var lib = get().library;
    return Object.keys(lib).filter(function (k) { return lib[k].done; }).length;
  }

  function resetAll() {
    state = defaults();
    save();
    return state;
  }

  function totalXp() {
    return get().xp;
  }

  global.KingStore = {
    KEY: KEY,
    load: load,
    save: save,
    get: get,
    courseOf: courseOf,
    unitOf: unitOf,
    findUnit: findUnit,
    setLang: setLang,
    progressOf: progressOf,
    isLessonDone: isLessonDone,
    doneLessons: doneLessons,
    isUnitDone: isUnitDone,
    currentDayNo: currentDayNo,
    doneDays: doneDays,
    courseXp: courseXp,
    addXp: addXp,
    completeLesson: completeLesson,
    markMastered: markMastered,
    isMastered: isMastered,
    masteredCount: masteredCount,
    unitMastered: unitMastered,
    todayXp: todayXp,
    totalXp: totalXp,
    examRecord: examRecord,
    passedExamCount: passedExamCount,
    recordExam: recordExam,
    addWrong: addWrong,
    removeWrong: removeWrong,
    wrongEntries: wrongEntries,
    wrongCount: wrongCount,
    libraryOf: libraryOf,
    saveLibrary: saveLibrary,
    libraryDoneCount: libraryDoneCount,
    streakInfo: streakInfo,
    last7: last7,
    setPref: setPref,
    resetAll: resetAll
  };
})(typeof window !== "undefined" ? window : this);
