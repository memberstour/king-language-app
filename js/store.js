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
      prefs: { sound: true, slow: false, installDismissed: false },
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
    streakInfo: streakInfo,
    last7: last7,
    setPref: setPref,
    resetAll: resetAll
  };
})(typeof window !== "undefined" ? window : this);
