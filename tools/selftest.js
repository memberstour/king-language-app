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
    check("하단 탭 4개", byClass("tab", ids.tabbar).length === 4, byClass("tab", ids.tabbar).length);
    check("설치 안내", byClass("install-strip").length === 1);
  }

  /* ---------- 2. 문장 암기 ---------- */
  function cardChecks() {
    goTab(1);
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

  /* ---------- 3. 말하기 ---------- */
  function speakChecks() {
    goTab(2);
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
    goTab(3);
    check("통계 카드 4개", byClass("stat").length === 4, byClass("stat").length);
    check("이번 주 7일", byClass("week-day").length === 7);
    check("코스 목록 14개", byClass("course-row").length === 14, byClass("course-row").length);
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
    check("언어 스위치 2개", segs.length === 2, segs.length);
    clickNode(segs[1], "중국어");
    check("중국어 전환", g.KingStore.get().lang === "zh");
    goTab(0);
    check("중국어 오늘 화면", txt(ids.main).indexOf("중국어") >= 0);
    check("중국어 병음", byClass("pinyin").length >= 1);
    var segs2 = byClass("seg-btn", ids.topbar);
    clickNode(segs2[0], "영어");
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

    goTab(3);
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
    store.resetAll();
    check("초기화 후 XP 0", store.totalXp() === 0);
    check("초기화 후 스트릭 0", store.streakInfo().count === 0);
    check("초기화 후 외운 문장 0", store.masteredCount("en") === 0 && store.masteredCount("zh") === 0);
    check("초기화 후 언어 영어", store.get().lang === "en");
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

  g.__run = function () {
    try {
      bootChecks();
      cardChecks();
      speakChecks();
      progressChecks();
      langChecks();
      lessonChecks();
      zhLessonChecks();
      playButtonChecks();
      edgeChecks();
      storageChecks();
      resetChecks();
    } catch (e) {
      results.push({ name: "예외", ok: false, extra: (e && e.message) + " @ " + (e && e.stack ? String(e.stack).split("\n")[1] : "") });
    }
    var failed = results.filter(function (r) { return !r.ok; });
    return JSON.stringify({ total: results.length, failed: failed.length, results: results });
  };
})(typeof window !== "undefined" ? window : globalThis);
