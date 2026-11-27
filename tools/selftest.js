/* 킹링고 자체 점검 — 화면과 수업 흐름을 실제로 눌러 봅니다.
 * 실행: python3 tools/run_selftest.py
 */
(function (g) {
  "use strict";

  var ids = g.__ids;
  var results = [];

  function check(name, ok, extra) {
    results.push({ name: name, ok: !!ok, extra: extra === undefined ? "" : String(extra) });
  }
  function note(name, extra) {
    results.push({ name: name, ok: true, extra: extra === undefined ? "" : String(extra) });
  }

  function collect(node, out) {
    out = out || [];
    (node.children || []).forEach(function (c) {
      if (typeof c._text !== "undefined") return;
      out.push(c);
      collect(c, out);
    });
    return out;
  }
  function byClass(cls, root) {
    return collect(root || ids.main).filter(function (n) {
      return n.className && (" " + n.className + " ").indexOf(" " + cls + " ") >= 0;
    });
  }
  function first(cls, root) { return byClass(cls, root)[0] || null; }
  function txt(node) { return node ? node.textContent : ""; }
  function clickNode(node, label) {
    if (!node) { check("요소 찾기: " + label, false); return false; }
    node.click();
    return true;
  }
  function goTab(i) {
    var tabs = byClass("tab", ids.tabbar);
    if (!tabs[i]) { check("탭 찾기 " + i, false); return; }
    tabs[i].click();
  }
  function goTabId(label) {
    var tabs = byClass("tab", ids.tabbar);
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].getAttribute("aria-label") === label) { tabs[i].click(); return; }
    }
    check("탭 찾기: " + label, false);
  }
  function tapText(word, root) {
    var btn = collect(root || ids.main).filter(function (n) {
      return n.tagName === "BUTTON" && txt(n).indexOf(word) >= 0;
    })[0];
    if (!btn) { check("버튼 찾기: " + word, false); return null; }
    btn.click();
    return btn;
  }
  function openCards() {
    goTabId("오늘");
    tapText("문장 카드로 복습");
  }
  function openSpeak() {
    goTabId("오늘");
    tapText("따라 말하기 연습");
  }
  function runFootBtn() {
    var f = first("run-foot");
    if (!f) return null;
    var kids = f.children.filter(function (c) {
      return typeof c._text === "undefined" && c.className && c.className.indexOf("btn") >= 0;
    });
    return kids[0] || null;
  }
  function footBtn() {
    var f = first("lesson-foot");
    if (!f) return null;
    var kids = f.children.filter(function (c) {
      return typeof c._text === "undefined" && c.className && c.className.indexOf("btn") >= 0;
    });
    return kids[0] || null;
  }

  /* ---------- 1. 첫 화면 ---------- */
  function bootChecks() {
    check("상단 브랜드", txt(ids.topbar).indexOf("킹링고") >= 0);
    check("오늘 히어로", txt(ids.main).indexOf("오늘도 5분") >= 0);
    check("14일 코스", byClass("day-pill").length === 14, byClass("day-pill").length);
    check("수업 4개", byClass("lesson-row").length === 4, byClass("lesson-row").length);
    check("오늘의 한 문장", txt(ids.main).indexOf("오늘의 한 문장") >= 0);
    check("하단 탭 5개", byClass("tab", ids.tabbar).length === 5, byClass("tab", ids.tabbar).length);
    check("설치 안내", byClass("install-strip").length === 1);
  }

  /* ---------- 2. 문장 암기 ---------- */
  function cardChecks() {
    openCards();
    check("카드 화면", byClass("flash").length === 1);
    check("카드 앞면 뜻", txt(first("flash")).length > 0);
    var before = Object.keys(g.KingStore.get().mastered).length;
    var flash = first("flash");
    if (flash) flash.click();
    check("카드 뒤집힘", !!(first("flash") && first("flash").classList.contains("is-flipped")));
    var acts = first("flash-actions");
    clickNode(acts ? acts.children[1] : null, "외웠어요");
    check("외운 문장 저장", Object.keys(g.KingStore.get().mastered).length === before + 1);
    check("카드 진행 표시", txt(first("card-progress-text")).indexOf("2 / 5") === 0, txt(first("card-progress-text")));
    var nav = first("flash-nav");
    if (nav) nav.children[0].click();
    check("이전 카드 이동", txt(first("card-progress-text")).indexOf("1 / 5") === 0, txt(first("card-progress-text")));
  }

  function cardsFinishChecks() {
    openCards();
    var chips = byClass("unit-chip");
    clickNode(chips[0], "Day 1 카드");
    for (var i = 0; i < 5; i++) {
      var card = first("flash");
      if (card) card.click();
      var acts = first("flash-actions");
      if (acts) acts.children[1].click();
    }
    check("카드 완주 시트", ids.modal.classList.contains("is-open"));
    check("카드 완주 문구", txt(ids.modal).indexOf("모두 봤어요") >= 0);
    var close = byClass("btn-ghost", ids.modal)[0];
    clickNode(close, "카드 시트 닫기");
    check("카드 시트 닫힘", !ids.modal.classList.contains("is-open"));
  }

  function installSheetChecks() {
    goTab(0);
    var btn = byClass("btn-blue").filter(function (b) { return txt(b).indexOf("방법 보기") >= 0; })[0];
    clickNode(btn, "설치 안내 열기");
    check("설치 안내 시트", ids.modal.classList.contains("is-open") && txt(ids.modal).indexOf("홈 화면에 추가") >= 0);
    clickNode(byClass("btn-ghost", ids.modal)[0], "설치 안내 닫기");
    check("설치 안내 닫힘", !ids.modal.classList.contains("is-open"));
  }

  /* ---------- 3. 말하기 ---------- */
  function speakChecks() {
    openSpeak();
    check("말하기 화면", byClass("voice-card").length === 1);
    check("속도 버튼", byClass("speed-btn").length >= 2);
    clickNode(first("fallback-btn"), "직접 말해봤어요");
    check("말하기 피드백", byClass("fb").length === 1);
    var nav = first("speak-nav");
    if (nav) nav.children[2].click();
    check("다음 문장 이동", txt(first("speak-count")).indexOf("2 / 5") === 0, txt(first("speak-count")));
  }

  /* ---------- 4. 진도 ---------- */
  function progressChecks() {
    goTabId("진도");
    check("통계 카드 4개", byClass("stat").length === 4, byClass("stat").length);
    check("이번 주 7일", byClass("week-day").length === 7);
    check("코스 목록 14개", byClass("course-row").length === 14, byClass("course-row").length);
    check("함께 쓰는 앱 3개", byClass("app-link").length === 3, byClass("app-link").length);
    var before = g.KingStore.get().prefs.sound;
    clickNode(first("switch"), "소리 토글");
    check("소리 설정 저장", g.KingStore.get().prefs.sound === !before);
    clickNode(first("btn-danger-ghost"), "초기화 열기");
    check("초기화 시트 열림", ids.modal.classList.contains("is-open"));
    var cancel = byClass("btn-ghost", ids.modal).filter(function (b) { return txt(b).indexOf("그대로") >= 0; })[0];
    clickNode(cancel, "그대로 두기");
    check("시트 닫힘", !ids.modal.classList.contains("is-open"));
  }

  /* ---------- 5. 언어 전환 ---------- */
  function langChecks() {
    var segs = byClass("seg-btn", ids.topbar);
    check("언어 스위치 3개", segs.length === 3, segs.length);
    clickNode(segs[1], "중국어");
    check("중국어 전환", g.KingStore.get().lang === "zh");
    goTab(0);
    check("중국어 오늘 화면", txt(ids.main).indexOf("중국어") >= 0);
    check("중국어 병음", byClass("pinyin").length >= 1);
    var segs2 = byClass("seg-btn", ids.topbar);
    clickNode(segs2[2], "일본어");
    check("일본어 전환", g.KingStore.get().lang === "ja");
    goTab(0);
    check("일본어 오늘 화면", txt(ids.main).indexOf("일본어") >= 0);
    check("일본어 읽기 데이터", g.KING_DATA.courses.ja.units.every(function (u) {
      return u.sentences.every(function (s) { return !!s.read; });
    }));
    check("일본어 첫 단원", txt(ids.main).indexOf("こんにちは") >= 0);
    check("일본어 중복 읽기 숨김", byClass("pinyin").filter(function (p) { return txt(p) === "こんにちは！はじめまして。"; }).length === 0);
    var segs3 = byClass("seg-btn", ids.topbar);
    clickNode(segs3[0], "영어 복귀");
    check("영어 복귀", g.KingStore.get().lang === "en");
  }

  /* ---------- 6. 수업 진행 ---------- */
  function driveLesson(unitNo, lessonNo) {
    var ui = g.KingApp.__ui;
    var store = g.KingStore;
    g.KingApp.startLesson(unitNo, lessonNo);
    check("수업 시작 (" + unitNo + "-" + lessonNo + ")", byClass("view-lesson").length === 1);

    var guard = 0;
    while (ui.view === "lesson" && ui.lesson && !ui.lesson.finished) {
      guard += 1;
      if (guard > 60) { check("수업 무한 반복 방지", false, "step " + ui.lesson.idx); break; }
      var step = ui.lesson.steps[ui.lesson.idx];

      if (step.type === "learn") {
        clickNode(footBtn(), "익히기 다음");
      } else if (step.type === "build") {
        step.tokens.forEach(function (tok) {
          var bank = first("bank");
          var tile = bank && bank.children.filter(function (c) {
            return c.className && c.className.indexOf("tile") >= 0 && c.textContent === tok;
          })[0];
          if (tile) tile.click();
          else check("블록 찾기: " + tok, false);
        });
        var checkBtn = footBtn();
        if (checkBtn && checkBtn.disabled) check("확인 버튼 활성화", false);
        clickNode(checkBtn, "만들기 확인");
        check("만들기 정답 처리", byClass("banner-good").length === 1, byClass("banner-bad").length ? "bad" : "");
        clickNode(footBtn(), "만들기 계속");
      } else if (step.type === "quiz") {
        var correct = step.q.options.filter(function (o) { return o.correct; })[0];
        var opts = byClass("option-btn");
        check("퀴즈 보기 4개", opts.length === 4, opts.length);
        var target2 = opts.filter(function (o) { return o.textContent.indexOf(correct.text) >= 0; })[0];
        clickNode(target2, "퀴즈 정답");
        check("퀴즈 정답 표시", byClass("option-btn").some(function (o) {
          return o.className.indexOf("is-correct") >= 0;
        }));
        clickNode(footBtn(), "퀴즈 다음");
      } else {
        clickNode(first("fallback-btn"), "말하기 대체");
        clickNode(footBtn(), "말하기 다음");
      }
    }

    var unit = store.unitOf(store.get().lang, unitNo);
    check("수업 완료 기록 (" + unit.id + " #" + lessonNo + ")", store.isLessonDone(unit.id, lessonNo));
    check("결과 화면", byClass("view-result").length === 1);
    var actions = first("result-actions");
    var back = actions && actions.children[1];
    clickNode(back, "오늘 화면으로");
    check("오늘 화면 복귀", g.KingApp.__ui.view === "today");
  }

  function lessonChecks() {
    var store = g.KingStore;
    var startXp = store.totalXp();
    driveLesson(1, 1);
    driveLesson(1, 2);
    driveLesson(1, 3);
    driveLesson(1, 4);
    var unit = store.unitOf("en", 1);
    check("Day 1 완료", store.isUnitDone(unit.id));
    check("XP 증가", store.totalXp() > startXp, store.totalXp() - startXp);
    check("오늘 XP 목표", store.todayXp() >= 30, store.todayXp());
    check("스트릭 시작", store.streakInfo().count === 1, store.streakInfo().count);
    check("다음 날 안내", store.currentDayNo("en") === 2, store.currentDayNo("en"));

    goTabId("진도");
    var daysStat = byClass("stat")[3];
    check("완료한 날 1", txt(daysStat).indexOf("1 / 14") >= 0, txt(daysStat));
  }

  /* ---------- 7. 중국어 수업 ---------- */
  function zhLessonChecks() {
    var segs = byClass("seg-btn", ids.topbar);
    clickNode(segs[1], "중국어 전환");
    driveLesson(1, 1);
    driveLesson(1, 2);
    driveLesson(1, 3);
    var unit = g.KingStore.unitOf("zh", 1);
    check("중국어 Day 1 진행", g.KingStore.doneLessons(unit.id) >= 3, g.KingStore.doneLessons(unit.id));
    check("중국어 외운 문장", g.KingStore.masteredCount("zh") >= 0);
    var segs2 = byClass("seg-btn", ids.topbar);
    clickNode(segs2[0], "영어 복귀");
  }

  /* ---------- 8. 오답 · 복습 · 스트릭 ---------- */
  function playButtonChecks() {
    var store = g.KingStore;
    var ui = g.KingApp.__ui;

    // 복습은 XP를 또 주지 않습니다.
    var before = store.totalXp();
    g.KingApp.startLesson(1, 1);
    var guard = 0;
    while (ui.view === "lesson" && ui.lesson && !ui.lesson.finished && guard < 12) {
      guard += 1;
      clickNode(footBtn(), "복습 다음");
    }
    check("복습 XP 중복 없음", store.totalXp() === before, store.totalXp() - before);
    var actions = first("result-actions");
    if (actions) actions.children[1].click();

    // 퀴즈 오답 표시
    g.KingApp.startLesson(2, 3);
    var step = ui.lesson.steps[0];
    var wrong = step.q.options.filter(function (o) { return !o.correct; })[0];
    var wrongBtn = byClass("option-btn").filter(function (o) { return o.textContent.indexOf(wrong.text) >= 0; })[0];
    clickNode(wrongBtn, "퀴즈 오답");
    check("오답 표시", byClass("option-btn").some(function (o) { return o.className.indexOf("is-wrong") >= 0; }));
    var wrongXp = store.todayXp();
    clickNode(footBtn(), "오답 후 다음");
    check("오답 후 다음 단계", ui.lesson.idx === 1, ui.lesson.idx);
    clickNode(first("close-btn", ids.topbar), "수업 닫기");
    check("수업 닫기", ui.view === "today");

    // 문장 만들기 틀린 순서
    g.KingApp.startLesson(2, 2);
    var buildStep = ui.lesson.steps[0];
    var reversed = buildStep.tokens.slice().reverse();
    reversed.forEach(function (tok) {
      var bank = first("bank");
      var tile = bank && bank.children.filter(function (c) {
        return c.className && c.className.indexOf("tile") >= 0 && c.textContent === tok;
      })[0];
      if (tile) tile.click();
    });
    clickNode(footBtn(), "틀린 순서 확인");
    check("틀린 순서 안내", byClass("banner-bad").length === 1);
    clickNode(footBtn(), "다시 하기");
    check("다시 하기 후 초기화", byClass("slots-empty").length === 1);
    clickNode(first("close-btn", ids.topbar), "수업 닫기2");
  }

  function edgeChecks() {
    var store = g.KingStore;
    var core = g.KingCore;

    store.get().streak = { count: 5, best: 7, last: core.addDays(core.dateKey(), -1) };
    store.save();
    store.addXp(1);
    check("어제 이어서 스트릭 +1", store.streakInfo().count === 6, store.streakInfo().count);

    store.get().streak = { count: 4, best: 7, last: core.addDays(core.dateKey(), -3) };
    store.save();
    store.addXp(1);
    check("3일 쉬면 스트릭 1", store.streakInfo().count === 1, store.streakInfo().count);
    check("최고 기록 유지", store.streakInfo().best === 7, store.streakInfo().best);
  }

  function resetChecks() {
    var store = g.KingStore;
    goTabId("진도");
    clickNode(first("btn-danger-ghost"), "초기화 열기");
    var wipe = byClass("btn-danger", ids.modal).filter(function (b) { return txt(b).indexOf("모두 지우기") >= 0; })[0];
    clickNode(wipe, "모두 지우기");
    check("초기화 시트 닫힘", !ids.modal.classList.contains("is-open"));
    check("초기화 후 XP 0", store.totalXp() === 0);
    check("초기화 후 스트릭 0", store.streakInfo().count === 0);
    check("초기화 후 외운 문장 0", store.masteredCount("en") === 0 && store.masteredCount("zh") === 0);
    check("초기화 후 언어 영어", store.get().lang === "en");
    check("초기화 후 평가 기록 0", Object.keys(store.get().exams).length === 0);
    check("초기화 후 오답노트 0", Object.keys(store.get().wrong).length === 0);
    check("초기화 후 도서관 비움", Object.keys(store.get().library).length === 0);
  }

  function corruptedStateChecks() {
    var store = g.KingStore;
    g.localStorage.setItem("kinglingo.state.v1", "{not json");
    store.load();
    check("깨진 저장 복구", store.totalXp() === 0 && store.get().lang === "en");
    g.localStorage.setItem("kinglingo.state.v1", JSON.stringify({
      lang: "zz", xp: -5, streak: { count: "x", best: null, last: 3 },
      progress: null, mastered: [], daily: { "nope": 4 }, prefs: { sound: "no" }
    }));
    store.load();
    var st = store.get();
    check("잘못된 값 정리", st.lang === "en" && st.xp === 0 && st.streak.count === 0 && !!st.progress,
      st.lang + "/" + st.xp + "/" + st.streak.count);
  }

  /* ---------- 9. 저장 ---------- */
  function storageChecks() {
    var raw = g.localStorage.getItem("kinglingo.state.v1");
    check("localStorage 저장", !!raw && raw.length > 50);
    var parsed = raw ? JSON.parse(raw) : {};
    check("저장된 XP", parsed.xp > 0, parsed.xp);
    check("저장된 스트릭", parsed.streak && parsed.streak.count === 1, parsed.streak && parsed.streak.count);
    g.KingStore.load();
    check("다시 불러오기", g.KingStore.totalXp() > 0 && g.KingStore.get().lang === "en");
  }

  /* ---------- 0. 데이터 무결성 ---------- */
  function dataChecks() {
    var D = g.KING_DATA;
    var codes = Object.keys(D.courses);
    check("코스 3개", codes.length === 3, codes.join(","));
    var ids = {};
    var dup = 0;
    var total = 0;
    var badJoin = [];
    codes.forEach(function (code) {
      var c = D.courses[code];
      check("단원 14개 (" + code + ")", c.units.length === 14, c.units.length);
      c.units.forEach(function (u, i) {
        if (u.no !== i + 1) check("단원 번호 (" + u.id + ")", false);
        if (u.id.indexOf(code + "-") !== 0) check("단원 접두어 (" + u.id + ")", false);
        if (u.sentences.length !== 5) check("문장 5개 (" + u.id + ")", false, u.sentences.length);
        u.sentences.forEach(function (s) {
          total += 1;
          if (ids[s.id]) dup += 1;
          ids[s.id] = true;
          if (!s.text || !s.ko || !s.tip) check("필수 필드 (" + s.id + ")", false);
          if (code !== "en" && !s.read && !s.pinyin) check("읽기 안내 (" + s.id + ")", false);
          var toks = s.w && s.w.length ? s.w : s.text.split(/\s+/);
          var joined = toks.join(c.space ? " " : "");
          if (joined !== s.text) badJoin.push(s.id);
        });
      });
    });
    check("중복 ID 없음", dup === 0, dup);
    check("문장 합계 210", total === 210, total);
    check("블록 연결 = 문장", badJoin.length === 0, badJoin.join(","));
  }

  /* ---------- 10. 단원평가 · 문제은행 · 도서관 ---------- */
  function answerRun(correctly) {
    var ui = g.KingApp.__ui;
    var guard = 0;
    while (ui.view === "run" && guard < 50) {
      guard += 1;
      var run = ui.run;
      if (!run) break;
      var q = run.questions[run.idx];
      if (q.tokens) {
        var seq = correctly ? q.tokens.slice() : q.tokens.slice().reverse();
        seq.forEach(function (tok) {
          var bank = first("bank");
          var tile = bank && bank.children.filter(function (c) {
            return c.className && c.className.indexOf("tile") >= 0 && c.textContent === tok;
          })[0];
          if (tile) tile.click();
        });
      } else {
        var want = -1;
        q.options.forEach(function (o, i) { if (o.correct === correctly && want < 0) want = i; });
        var opts = byClass("option-btn");
        if (opts[want]) opts[want].click();
        else check("보기 클릭: " + q.key, false);
      }
      if (ui.view !== "run") break;
      var btn = runFootBtn();
      if (!btn) { check("문제 풀기 버튼", false, q.type); break; }
      if (btn.disabled) { check("문제 풀기 버튼 활성화", false, q.type + "/" + q.key); break; }
      btn.click();
    }
    if (guard >= 50) check("문제 풀기 무한 반복 방지", false);
  }

  function examDataChecks() {
    var D = g.KING_DATA;
    var B = g.KingBank;
    var bad = [];
    Object.keys(D.courses).forEach(function (code) {
      var c = D.courses[code];
      c.units.forEach(function (u) {
        var qs = B.buildUnitExam(c, u);
        if (qs.length !== 10) bad.push(u.id + ":count=" + qs.length);
        var keys = {};
        qs.forEach(function (q) {
          if (!q.tokens) {
            if (!q.options || q.options.length !== 4) bad.push(q.key + ":opt");
            var correct = q.options.filter(function (o) { return o.correct; }).length;
            if (correct !== 1) bad.push(q.key + ":correct=" + correct);
            var texts = q.options.map(function (o) { return o.text; });
            if (texts.filter(function (t, i) { return texts.indexOf(t) !== i; }).length) bad.push(q.key + ":dupopt");
          }
          if (q.type === "blank") {
            var blanks = (q.parts || []).filter(function (p) { return p.blank; }).length;
            if (blanks !== 1) bad.push(q.key + ":blank");
          }
          if (q.tokens) {
            var joined = q.tokens.join(c.space ? " " : "");
            if (joined !== q.text) bad.push(q.key + ":tokens");
          }
          if (keys[q.key]) bad.push(q.key + ":dupkey");
          keys[q.key] = true;
        });
      });
      var bank10 = B.buildBank(c, { count: 10 });
      if (bank10.length !== 10) bad.push(code + ":bank=" + bank10.length);
      var mock = B.mockExam(c, 10);
      if (mock.length !== 10) bad.push(code + ":mock=" + mock.length);
    });
    check("단원평가 10문항·보기 점검", bad.length === 0, bad.slice(0, 6).join(","));
  }

  function readerDataChecks() {
    var R = g.KING_READERS;
    check("원서 6권 이상", R.books.length >= 6, R.books.length);
    var ids = {};
    var bad = [];
    var total = 0;
    R.books.forEach(function (b) {
      if (ids[b.id]) bad.push(b.id + ":dup");
      ids[b.id] = true;
      if (!b.title || !b.ko || !b.emoji || !b.level) bad.push(b.id + ":field");
      if (!(b.pages || []).length || b.pages.length < 6) bad.push(b.id + ":pages");
      total += (b.pages || []).length;
      b.pages.forEach(function (p) {
        if (!p.lines || !p.lines.length || !p.ko) bad.push(b.id + ":page");
        p.lines.forEach(function (l) {
          if (!l || /[\uac00-\ud7a3]/.test(l)) bad.push(b.id + ":en");
        });
      });
      if ((b.quiz || []).length < 3) bad.push(b.id + ":quiz");
      b.quiz.forEach(function (q) {
        if (!q.q || !q.ko || !q.why) bad.push(b.id + ":quizfield");
        if (!q.options || q.options.length !== 4) bad.push(b.id + ":opt");
        if (!(q.answer >= 0 && q.answer < 4)) bad.push(b.id + ":answer");
      });
    });
    check("원서 데이터 점검", bad.length === 0, bad.slice(0, 6).join(","));
    check("원서 총 페이지 60 이상", total >= 60, total);
  }

  function examChecks() {
    var store = g.KingStore;
    var ui = g.KingApp.__ui;
    goTabId("단원평가");
    check("단원평가 화면", byClass("view-exam").length === 1);
    check("평가 단원 14개", byClass("exam-row").length === 14, byClass("exam-row").length);
    var xpBefore = store.totalXp();

    byClass("exam-row")[1].click();
    check("평가 시작", ui.view === "run");
    var run = ui.run;
    check("평가 10문항", run && run.questions.length === 10, run && run.questions.length);
    var types = {};
    (run ? run.questions : []).forEach(function (q) { types[q.type] = true; });
    check("평가 유형 4가지 이상", Object.keys(types).length >= 4, Object.keys(types).join(","));
    check("평가 도중 채점 숨김", !!run && run.reveal === false);

    answerRun(true);
    check("평가 결과 화면", ui.view === "report");
    var rep = ui.report;
    check("평가 만점", !!rep && rep.result.score === 100, rep && rep.result.score);
    check("평가 통과 판정", !!rep && rep.result.passed === true);
    var unit = store.unitOf("en", 2);
    var rec = store.examRecord(unit.id);
    check("평가 최고 점수 저장", rec.best === 100 && rec.passed === true, rec.best);
    check("평가 XP 지급", store.totalXp() > xpBefore, store.totalXp() - xpBefore);
    check("만점이면 해설 없음", byClass("explain-card").length === 0, byClass("explain-card").length);

    tapText("단원평가 목록");
    check("평가 목록 복귀", ui.view === "exam");
    check("통과 단원 표시", byClass("exam-row")[1].className.indexOf("is-passed") >= 0);
    check("통과 수 표시", txt(first("exam-summary")).indexOf("1 / 14") >= 0, txt(first("exam-summary")));

    byClass("exam-row")[2].click();
    answerRun(false);
    check("오답 응시 결과 화면", ui.view === "report");
    var rep2 = ui.report;
    check("오답 점수", !!rep2 && rep2.result.score < 80, rep2 && rep2.result.score);
    check("오답 해설 개수", byClass("explain-card").length === rep2.result.wrong.length, byClass("explain-card").length);
    check("오답노트 저장", store.wrongCount("en") === rep2.result.wrong.length, store.wrongCount("en"));
    tapText("단원평가 목록");
    goTabId("문제은행");
    tapText("오답노트");
    check("오답노트 화면", ui.view === "bank" && ui.bank.tab === "wrong");
  }

  function bankChecks() {
    var ui = g.KingApp.__ui;
    goTabId("문제은행");
    tapText("문제은행");
    check("문제은행 화면", byClass("view-bank").length === 1);
    check("모의고사 카드", byClass("mock-card").length === 1);
    tapText("듣기");
    tapText("5문항");
    var go = collect(ids.main).filter(function (n) {
      return n.tagName === "BUTTON" && txt(n).indexOf("5문항 풀기") >= 0;
    })[0];
    check("문항 풀기 버튼", !!go);
    if (go) go.click();
    check("문제은행 시작", ui.view === "run");
    check("고른 문항 수", !!ui.run && ui.run.questions.length === 5, ui.run && ui.run.questions.length);
    check("듣기만 출제", !!ui.run && ui.run.questions.every(function (q) { return q.type === "listen"; }));
    answerRun(true);
    check("문제은행 결과", ui.view === "report");
    tapText("문제은행으로");
    check("문제은행 복귀", ui.view === "bank");

    tapText("시작");
    check("모의고사 시작", ui.view === "run");
    check("모의고사 10문항", !!ui.run && ui.run.questions.length === 10, ui.run && ui.run.questions.length);
    answerRun(true);
    check("모의고사 결과", ui.view === "report");
    tapText("문제은행으로");
  }

  function wrongNoteChecks() {
    var store = g.KingStore;
    var ui = g.KingApp.__ui;
    goTabId("문제은행");
    tapText("오답노트");
    check("오답노트 탭", ui.bank.tab === "wrong");
    var before = store.wrongCount("en");
    check("오답노트 목록", byClass("wrong-row").length === before, byClass("wrong-row").length + "/" + before);
    if (!before) { check("오답 재풀이 준비", false, "오답 없음"); return; }
    tapText("모두 다시 풀기");
    check("오답 재풀이 시작", ui.view === "run");
    answerRun(true);
    check("오답 정리", store.wrongCount("en") < before, before + " -> " + store.wrongCount("en"));
    tapText("오답노트 보기");
    check("오답노트 복귀", ui.view === "bank" && ui.bank.tab === "wrong");
  }

  function libraryChecks() {
    var store = g.KingStore;
    var ui = g.KingApp.__ui;
    goTabId("도서관");
    check("도서관 화면", byClass("view-library").length === 1);
    var cards = byClass("book-card");
    check("원서 카드", cards.length === g.KING_READERS.books.length, cards.length);
    cards[0].click();
    check("원서 열기", ui.view === "reader");
    var b = g.KING_READERS.books[0];
    check("첫 쪽 문장", byClass("reader-line").length === b.pages[0].lines.length, byClass("reader-line").length);
    tapText("해석 보기");
    check("해석 보기 토글", byClass("reader-ko").length === 1);
    tapText("해석 숨기기");
    check("해석 숨기기 토글", byClass("reader-ko").length === 0);

    var guard = 0;
    while (ui.view === "reader" && ui.reader.page < b.pages.length - 1 && guard < 30) {
      guard += 1;
      var nextPage = collect(ids.main).filter(function (n) {
        return n.tagName === "BUTTON" && txt(n).indexOf("다음 쪽") >= 0;
      })[0];
      if (!nextPage) { check("다음 쪽 버튼", false, "page " + ui.reader.page); break; }
      nextPage.click();
    }
    check("마지막 쪽 도달", ui.reader.page === b.pages.length - 1, ui.reader.page);
    check("쪽 기록 저장", store.libraryOf(b.id).page === b.pages.length - 1, store.libraryOf(b.id).page);

    tapText("독후 퀴즈");
    check("독후 퀴즈 열림", ui.view === "readerQuiz");
    var qz = ui.readerQuiz;
    var guard2 = 0;
    while (ui.view === "readerQuiz" && qz && !qz.done && guard2 < 20) {
      guard2 += 1;
      var item = b.quiz[qz.idx];
      var opts = byClass("option-btn");
      if (opts[item.answer]) opts[item.answer].click();
      else check("퀴즈 보기 클릭", false);
      var next = collect(ids.main).filter(function (n) {
        return n.tagName === "BUTTON" && (txt(n).indexOf("다음 문제") >= 0 || txt(n).indexOf("결과 보기") >= 0);
      })[0];
      if (next) next.click();
    }
    check("퀴즈 결과 화면", byClass("report-score").length === 1, byClass("report-score").length);
    var lib = store.libraryOf(b.id);
    check("완독 기록 저장", lib.done === true && lib.quizBest === 100, lib.quizBest);
    tapText("도서관으로");
    check("도서관 복귀", ui.view === "library");
  }

  g.__run = function () {
    try {
      dataChecks();
      bootChecks();
      cardChecks();
      cardsFinishChecks();
      installSheetChecks();
      speakChecks();
      progressChecks();
      langChecks();
      lessonChecks();
      zhLessonChecks();
      playButtonChecks();
      examDataChecks();
      readerDataChecks();
      examChecks();
      bankChecks();
      wrongNoteChecks();
      libraryChecks();
      edgeChecks();
      storageChecks();
      resetChecks();
      corruptedStateChecks();
    } catch (e) {
      results.push({ name: "예외", ok: false, extra: (e && e.message) + " @ " + (e && e.stack ? String(e.stack).split("\n")[1] : "") });
    }
    var failed = results.filter(function (r) { return !r.ok; });
    return JSON.stringify({ total: results.length, failed: failed.length, results: results });
  };
})(typeof window !== "undefined" ? window : globalThis);
