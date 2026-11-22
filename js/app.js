/* 킹링고 — 화면과 학습 흐름
 * 순수 DOM + Web Speech API. 빌드 과정 없음.
 */
(function (global) {
  "use strict";

  var D = global.KING_DATA;
  var C = global.KingCore;
  var S = global.KingStore;

  /* ---------- 아이콘 ---------- */
  var SVG_OPEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  var ICONS = {
    home: SVG_OPEN + '<path d="M4 11 12 4l8 7"/><path d="M6.5 9.5V20h11V9.5"/><path d="M10 20v-5h4v5"/></svg>',
    cards: SVG_OPEN + '<rect x="3.5" y="6.5" width="12" height="14" rx="2.5"/><path d="M8 4.2h9.5A2.5 2.5 0 0 1 20 6.7V16"/></svg>',
    mic: SVG_OPEN + '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0"/><path d="M12 18v3"/></svg>',
    chart: SVG_OPEN + '<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/>',
    flame: SVG_OPEN + '<path d="M12 3s5 4.2 5 8.4A5 5 0 0 1 7 11.4C7 7.2 12 3 12 3Z"/><path d="M12 20a2.6 2.6 0 0 0 2.6-2.6c0-1.7-2.6-3.9-2.6-3.9s-2.6 2.2-2.6 3.9A2.6 2.6 0 0 0 12 20Z"/>',
    bolt: SVG_OPEN + '<path d="M13 3 5 14h5l-1 7 8-11h-5l1-7Z"/>',
    speaker: SVG_OPEN + '<path d="M4 10v4h3.5L13 18V6L7.5 10H4Z"/><path d="M16.5 9a4 4 0 0 1 0 6"/><path d="M19 6.5a8 8 0 0 1 0 11"/>',
    slow: SVG_OPEN + '<path d="M4 17h9a4 4 0 0 0 0-8H8"/><path d="M4 13h7"/><path d="M17 7l3-3"/>',
    check: SVG_OPEN + '<path d="M5 12.5 10 17l9-10"/>',
    close: SVG_OPEN + '<path d="M6 6l12 12"/><path d="M18 6 6 18"/>',
    chevron: SVG_OPEN + '<path d="M9 5l7 7-7 7"/>',
    back: SVG_OPEN + '<path d="M15 5l-7 7 7 7"/>',
    star: SVG_OPEN + '<path d="m12 4 2.5 5.2 5.5.8-4 3.9 1 5.6-5-2.7-5 2.7 1-5.6-4-3.9 5.5-.8L12 4Z"/>',
    share: SVG_OPEN + '<path d="M12 15V4"/><path d="M8.5 7.5 12 4l3.5 3.5"/><path d="M6 13v6h12v-6"/>',
    refresh: SVG_OPEN + '<path d="M4 12a8 8 0 1 1 3 6.2"/><path d="M4 20v-5h5"/>'
  };

  /* ---------- 작은 도우미 ---------- */
  function el(tag, props, children) {
    var node = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (k) {
        var v = props[k];
        if (v === null || typeof v === "undefined" || v === false) return;
        if (k === "class") node.className = v;
        else if (k === "text") node.textContent = String(v);
        else if (k === "html") node.innerHTML = v;
        else if (k === "on") {
          Object.keys(v).forEach(function (ev) { node.addEventListener(ev, v[ev]); });
        } else if (k === "style") node.setAttribute("style", v);
        else if (k === "dataset") {
          Object.keys(v).forEach(function (dk) { node.setAttribute("data-" + dk, String(v[dk])); });
        } else node.setAttribute(k, v === true ? "" : String(v));
      });
    }
    appendChildren(node, children);
    return node;
  }

  function appendChildren(node, children) {
    if (children === null || typeof children === "undefined" || children === false) return;
    if (Array.isArray(children)) {
      children.forEach(function (c) { appendChildren(node, c); });
      return;
    }
    if (typeof children === "string" || typeof children === "number") {
      node.appendChild(document.createTextNode(String(children)));
      return;
    }
    node.appendChild(children);
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function icon(name, extraClass) {
    return el("span", { class: "ico " + (extraClass || ""), html: ICONS[name] || "" });
  }

  function iconBtn(name, label, handler, cls) {
    return el("button", {
      class: "icon-btn " + (cls || ""),
      type: "button",
      "aria-label": label,
      on: { click: handler }
    }, [icon(name)]);
  }

  function L() { return S.get().lang; }
  function course() { return D.courses[L()]; }
  function locale() { return course().locale; }
  function allSentences(lang) {
    var out = [];
    D.courses[lang || L()].units.forEach(function (u) {
      u.sentences.forEach(function (s) { out.push(s); });
    });
    return out;
  }

  var UI = {
    view: "today",
    day: 1,
    card: { unit: 1, idx: 0, flipped: false },
    speak: { unit: 1, idx: 0, result: null },
    lesson: null,
    micOn: false,
    recog: null
  };
  var roots = { top: null, main: null, tab: null };

  /* ---------- 소리 ---------- */
  var audioCtx = null;
  function beep(kind) {
    if (!S.get().prefs.sound) return;
    try {
      var Ctor = global.AudioContext || global.webkitAudioContext;
      if (!Ctor) return;
      audioCtx = audioCtx || new Ctor();
      if (audioCtx.state === "suspended" && audioCtx.resume) audioCtx.resume();
      var now = audioCtx.currentTime;
      var tones = kind === "win" ? [[660, 0], [880, 0.12], [1320, 0.24]]
        : kind === "wrong" ? [[220, 0], [180, 0.12]]
          : [[880, 0]];
      tones.forEach(function (t) {
        var osc = audioCtx.createOscillator();
        var gain = audioCtx.createGain();
        osc.type = kind === "wrong" ? "square" : "sine";
        osc.frequency.value = t[0];
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        var start = now + t[1];
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(kind === "wrong" ? 0.06 : 0.14, start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);
        osc.start(start);
        osc.stop(start + 0.2);
      });
    } catch (e) { /* 소리는 없어도 됩니다 */ }
  }

  function confetti() {
    var host = document.getElementById("confetti");
    if (!host) return;
    var colors = ["#58cc02", "#1cb0f6", "#ffc800", "#ff4b4b", "#ce82ff", "#ff9600"];
    for (var i = 0; i < 22; i++) {
      var p = document.createElement("i");
      p.className = "confetti-piece";
      p.setAttribute("style", "left:" + (Math.random() * 100).toFixed(1) + "%;background:" + colors[i % colors.length] +
        ";animation-delay:" + (Math.random() * 0.3).toFixed(2) + "s;width:" + (6 + Math.round(Math.random() * 6)) + "px");
      host.appendChild(p);
      (function (node) {
        if (typeof setTimeout === "function") {
          setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, 2400);
        }
      })(p);
    }
  }

  /* ---------- 음성 ---------- */
  var Speech = (function () {
    var supported = typeof global.speechSynthesis !== "undefined" &&
      typeof global.SpeechSynthesisUtterance !== "undefined";
    var voices = [];
    function refresh() {
      if (!supported) return;
      try { voices = global.speechSynthesis.getVoices() || []; } catch (e) { voices = []; }
    }
    function pick(loc) {
      refresh();
      var base = loc.split("-")[0].toLowerCase();
      var matches = voices.filter(function (v) {
        return v && v.lang && String(v.lang).toLowerCase().indexOf(base) === 0;
      });
      var want = loc.toLowerCase();
      var exact = matches.filter(function (v) {
        return String(v.lang).toLowerCase().replace("_", "-") === want;
      });
      var pool = exact.length ? exact : matches;
      var local = pool.filter(function (v) { return v.localService; });
      return local[0] || pool[0] || null;
    }
    function speak(text, loc, rate) {
      if (!supported || !text) return false;
      try {
        global.speechSynthesis.cancel();
        var u = new global.SpeechSynthesisUtterance(text);
        u.lang = loc;
        u.rate = rate || 1;
        u.pitch = 1;
        var v = pick(loc);
        if (v) u.voice = v;
        global.speechSynthesis.speak(u);
        return true;
      } catch (e) { return false; }
    }
    function stop() {
      if (!supported) return;
      try { global.speechSynthesis.cancel(); } catch (e) { /* noop */ }
    }
    if (supported) {
      refresh();
      try {
        if (global.speechSynthesis.addEventListener) {
          global.speechSynthesis.addEventListener("voiceschanged", refresh);
        } else {
          global.speechSynthesis.onvoiceschanged = refresh;
        }
      } catch (e) { /* noop */ }
    }
    return { supported: supported, speak: speak, stop: stop, refresh: refresh };
  })();

  function rateFor(slow) {
    if (L() === "zh") return slow ? 0.55 : 0.9;
    return slow ? 0.6 : 0.95;
  }

  function playSentence(s, slow) {
    var ok = Speech.speak(s.text, locale(), rateFor(slow));
    if (!ok) toast("이 브라우저에서는 음성 재생을 지원하지 않아요.");
    return ok;
  }

  function stopRecognize() {
    if (UI.recog) {
      try { UI.recog.abort(); } catch (e) { /* noop */ }
      UI.recog = null;
    }
    UI.micOn = false;
  }

  function micErrorMessage(code) {
    if (code === "not-allowed" || code === "service-not-allowed") {
      return "마이크를 쓸 수 없어요. 아이폰 홈 화면 앱에서는 인식이 제한될 수 있어요. '직접 말해봤어요'를 눌러도 학습은 이어져요.";
    }
    if (code === "no-speech") return "잘 안 들렸어요. 조금 크게 다시 말해 볼까요?";
    if (code === "audio-capture") return "마이크를 찾지 못했어요. 기기 설정을 확인해 주세요.";
    if (code === "network") return "인터넷 연결이 필요해요. 연결을 확인한 뒤 다시 시도해 주세요.";
    if (code === "aborted") return "";
    return "음성 인식이 잠시 멈췄어요. 다시 시도하거나 '직접 말해봤어요'를 눌러 주세요.";
  }

  /* ---------- 알림/시트 ---------- */
  function toast(msg) {
    var host = document.getElementById("toast");
    if (!host) return;
    clear(host);
    host.appendChild(el("div", { class: "toast-inner", text: msg }));
    host.classList.add("is-on");
    if (typeof setTimeout === "function") {
      setTimeout(function () { host.classList.remove("is-on"); }, 2400);
    }
  }

  function openSheet(title, content) {
    var host = document.getElementById("modal");
    if (!host) return function () {};
    clear(host);
    var close = function () {
      clear(host);
      host.classList.remove("is-open");
    };
    sheetCloser = close;
    var body = el("div", { class: "sheet-body" }, content);
    var panel = el("div", { class: "sheet", role: "dialog", "aria-label": title }, [
      el("div", { class: "sheet-grip" }),
      el("h2", { class: "sheet-title", text: title }),
      body,
      el("button", { class: "btn btn-ghost", type: "button", on: { click: close } }, ["닫기"])
    ]);
    host.appendChild(el("div", { class: "sheet-back", on: { click: close } }));
    host.appendChild(panel);
    host.classList.add("is-open");
    return close;
  }

  function isStandalone() {
    try {
      if (global.navigator && global.navigator.standalone) return true;
      if (global.matchMedia && global.matchMedia("(display-mode: standalone)").matches) return true;
    } catch (e) { /* noop */ }
    return false;
  }

  function installSheet() {
    openSheet("홈 화면에 추가하기", [
      el("p", { class: "sheet-lead", text: "홈 화면 아이콘으로 열면 주소창 없이 앱처럼 전체 화면으로 쓸 수 있어요." }),
      el("ol", { class: "steps" }, [
        el("li", {}, [el("b", { text: "아이폰 Safari" }), el("span", { text: "에서 이 페이지를 열고 아래 공유 버튼(□↑)을 눌러요." })]),
        el("li", {}, [el("b", { text: "'홈 화면에 추가'" }), el("span", { text: "를 선택하고 오른쪽 위 '추가'를 눌러요." })]),
        el("li", {}, [el("b", { text: "홈 화면의 킹링고 아이콘" }), el("span", { text: "으로 열면 돼요. 오프라인에서도 실행돼요." })]),
        el("li", {}, [el("b", { text: "안드로이드 Chrome" }), el("span", { text: "은 오른쪽 위 메뉴 → '앱 설치'를 눌러요." })])
      ]),
      el("div", { class: "notice" }, [
        el("b", { text: "말하기 인식 안내" }),
        el("p", { text: "아이폰 홈 화면 앱에서는 마이크 인식이 막힐 수 있어요. 그때는 Safari 탭에서 쓰거나, 모든 문장에 있는 '직접 말해봤어요 ✓' 버튼으로 학습을 이어가면 돼요." })
      ])
    ]);
  }

  /* ---------- 공통 조각 ---------- */
  function chip(iconName, text, tone) {
    return el("span", { class: "chip chip-" + tone }, [icon(iconName, "chip-ico"), el("b", { text: text })]);
  }

  function bar(pct, tone) {
    return el("div", { class: "bar " + (tone || "") }, [el("span", { style: "width:" + C.clamp(pct, 0, 100) + "%" })]);
  }

  function ring(pct) {
    var r = 26;
    var circ = 2 * Math.PI * r;
    var len = (circ * C.clamp(pct, 0, 100)) / 100;
    var svg = '<svg viewBox="0 0 64 64" width="66" height="66" aria-hidden="true">' +
      '<circle cx="32" cy="32" r="' + r + '" fill="none" stroke="rgba(255,255,255,.32)" stroke-width="7"/>' +
      '<circle cx="32" cy="32" r="' + r + '" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" ' +
      'stroke-dasharray="' + len.toFixed(1) + " " + circ.toFixed(1) + '" transform="rotate(-90 32 32)"/></svg>';
    return el("div", { class: "ring", html: svg }, [
      el("span", { class: "ring-num", text: pct + "%" }),
      el("span", { class: "ring-cap", text: "오늘 목표" })
    ]);
  }

  function viewHead(title, sub) {
    return el("div", { class: "view-head" }, [
      el("h1", { class: "view-title", text: title }),
      sub ? el("p", { class: "view-sub", text: sub }) : null
    ]);
  }

  function unitChips(selected, onPick) {
    var wrap = el("div", { class: "chips" });
    course().units.forEach(function (u) {
      var done = S.isUnitDone(u.id);
      var active = u.no === selected;
      wrap.appendChild(el("button", {
        class: "unit-chip" + (active ? " is-active" : "") + (done ? " is-done" : ""),
        type: "button",
        "aria-pressed": active ? "true" : "false",
        on: { click: function () { onPick(u.no); } }
      }, [
        el("span", { class: "unit-chip-emoji", text: u.emoji }),
        el("span", { class: "unit-chip-label", text: "Day " + u.no })
      ]));
    });
    return wrap;
  }

  /* ---------- 헤더 ---------- */
  function renderTop() {
    var top = roots.top;
    if (!top) return;
    clear(top);
    if (UI.view === "lesson") {
      renderLessonTop(top);
      return;
    }
    top.className = "topbar";
    var st = S.streakInfo();
    var todayXp = S.todayXp();
    var seg = el("div", { class: "seg", role: "tablist", "aria-label": "학습 언어" }, ["en", "zh"].map(function (code) {
      var active = L() === code;
      return el("button", {
        class: "seg-btn" + (active ? " is-active" : ""),
        type: "button",
        role: "tab",
        "aria-selected": active ? "true" : "false",
        on: { click: function () { switchLang(code); } }
      }, [
        el("span", { class: "seg-flag", text: D.courses[code].flag }),
        el("span", { text: D.courses[code].name })
      ]);
    }));

    top.appendChild(el("div", { class: "top-row" }, [
      el("div", { class: "brand" }, [
        el("span", { class: "brand-mark", text: "K" }),
        el("span", { class: "brand-name", text: "킹링고" })
      ]),
      el("div", { class: "top-chips" }, [
        chip("flame", (st.count || 0) + "일", "flame"),
        chip("bolt", String(S.totalXp()), "xp")
      ])
    ]));
    top.appendChild(el("div", { class: "top-row top-row-2" }, [
      seg,
      el("span", { class: "top-goal" }, [
        el("span", { class: "top-goal-label", text: "오늘" }),
        el("b", { text: todayXp + " / " + D.dailyGoal }),
        el("span", { class: "top-goal-unit", text: "XP" })
      ])
    ]));
  }

  /* ---------- 오늘 ---------- */
  function viewToday() {
    var unit = S.unitOf(L(), UI.day);
    var st = S.streakInfo();
    var todayXp = S.todayXp();
    var pct = C.percent(todayXp, D.dailyGoal);
    var doneCount = S.doneLessons(unit.id);
    var wrap = el("div", { class: "view view-today" });

    wrap.appendChild(el("section", { class: "hero" }, [
      el("div", { class: "hero-top" }, [
        el("div", { class: "hero-copy" }, [
          el("p", { class: "hero-hello", text: C.greeting() + ", 킹님" }),
          el("h1", { class: "hero-title", text: pct >= 100 ? "오늘 목표 달성! 🎉" : "오늘도 5분, 가볍게!" }),
          el("p", { class: "hero-sub", text: L() === "en" ? "영어 문장이 하루에 다섯 개씩 늘어나요" : "중국어 문장이 하루에 다섯 개씩 늘어나요" })
        ]),
        ring(pct)
      ]),
      bar(pct, "on-hero"),
      el("div", { class: "hero-meta" }, [
        el("span", {}, [icon("bolt", "meta-ico"), el("span", { text: "오늘 " + todayXp + " / " + D.dailyGoal + " XP" })]),
        el("span", {}, [icon("flame", "meta-ico"), el("span", { text: st.count > 0 ? st.count + "일 연속" : "오늘부터 시작" })])
      ])
    ]));

    if (!isStandalone() && !S.get().prefs.installDismissed) {
      wrap.appendChild(el("div", { class: "install-strip" }, [
        el("div", { class: "install-copy" }, [
          el("b", { text: "홈 화면에 추가하면 앱처럼 써요" }),
          el("span", { text: "주소창 없이 전체 화면, 오프라인 실행" })
        ]),
        el("button", { class: "btn btn-small btn-blue", type: "button", on: { click: installSheet } }, ["방법 보기"]),
        iconBtn("close", "안내 닫기", function () {
          S.setPref("installDismissed", true);
          render();
        }, "install-close")
      ]));
    }

    wrap.appendChild(el("div", { class: "section-head" }, [
      el("h2", { text: "14일 코스" }),
      el("span", { class: "section-right", text: "Day " + unit.no + " / " + course().units.length })
    ]));
    var days = el("div", { class: "days", role: "group", "aria-label": "학습 날짜 선택" });
    var activeBtn = null;
    course().units.forEach(function (u) {
      var done = S.isUnitDone(u.id);
      var active = u.no === UI.day;
      var btn = el("button", {
        class: "day-pill" + (done ? " is-done" : "") + (active ? " is-active" : ""),
        type: "button",
        "aria-pressed": active ? "true" : "false",
        "aria-label": "Day " + u.no + " " + u.title + (done ? " 완료" : ""),
        on: { click: function () { UI.day = u.no; UI.card.unit = u.no; UI.speak.unit = u.no; render(); } }
      }, [
        el("span", { class: "day-num", text: done ? "✓" : String(u.no) }),
        el("span", { class: "day-emoji", text: u.emoji })
      ]);
      if (active) activeBtn = btn;
      days.appendChild(btn);
    });
    wrap.appendChild(days);
    if (activeBtn && activeBtn.scrollIntoView) {
      try { activeBtn.scrollIntoView({ inline: "center", block: "nearest" }); } catch (e) { /* noop */ }
    }

    var lessonRows = el("div", { class: "lessons" });
    var nextLesson = null;
    D.lessons.forEach(function (lesson) {
      var done = S.isLessonDone(unit.id, lesson.no);
      if (!done && !nextLesson) nextLesson = lesson;
      lessonRows.appendChild(el("button", {
        class: "lesson-row tone-" + lesson.tone + (done ? " is-done" : ""),
        type: "button",
        on: { click: function () { startLesson(unit.no, lesson.no); } }
      }, [
        el("span", { class: "lesson-icon", text: lesson.emoji }),
        el("span", { class: "lesson-text" }, [
          el("span", { class: "lesson-title", text: lesson.title }),
          el("span", { class: "lesson-desc", text: lesson.desc })
        ]),
        el("span", { class: "lesson-state" }, [
          done ? el("span", { class: "state-done" }, [icon("check", "state-ico"), "완료"]) : el("span", { class: "state-go", text: "시작" }),
          icon("chevron", "lesson-chev")
        ])
      ]));
    });

    wrap.appendChild(el("section", { class: "unit-card" }, [
      el("div", { class: "unit-head" }, [
        el("span", { class: "unit-emoji", text: unit.emoji }),
        el("div", { class: "unit-copy" }, [
          el("p", { class: "unit-day", text: "DAY " + unit.no + " · " + course().name }),
          el("h2", { class: "unit-title", text: unit.title }),
          el("p", { class: "unit-goal", text: unit.goal })
        ])
      ]),
      el("div", { class: "unit-progress" }, [
        el("span", { class: "unit-progress-text", text: doneCount + " / " + D.lessons.length + " 수업 완료" }),
        bar(C.percent(doneCount, D.lessons.length), "green")
      ]),
      lessonRows,
      el("button", {
        class: "btn btn-primary btn-wide",
        type: "button",
        on: {
          click: function () {
            startLesson(unit.no, nextLesson ? nextLesson.no : 1);
          }
        }
      }, [nextLesson ? "이어서 하기 · " + nextLesson.title : "복습하기 · 문장 익히기"])
    ]));

    var tipIndex = (unit.no - 1) % unit.sentences.length;
    var sample = unit.sentences[tipIndex];
    wrap.appendChild(el("section", { class: "card today-sentence" }, [
      el("div", { class: "section-head section-head-tight" }, [
        el("h2", { text: "오늘의 한 문장" }),
        el("span", { class: "section-right", text: unit.title })
      ]),
      el("p", { class: "target target-sm", lang: L(), text: sample.text }),
      sample.pinyin ? el("p", { class: "pinyin", text: sample.pinyin }) : null,
      el("p", { class: "ko-line", text: sample.ko }),
      el("div", { class: "audio-row" }, [
        el("button", { class: "btn btn-blue btn-small", type: "button", on: { click: function () { playSentence(sample, false); } } },
          [icon("speaker", "btn-ico"), "듣기"]),
        el("button", { class: "btn btn-ghost btn-small", type: "button", on: { click: function () { playSentence(sample, true); } } },
          [icon("slow", "btn-ico"), "천천히"]),
        el("button", {
          class: "btn btn-ghost btn-small",
          type: "button",
          on: { click: function () { UI.speak.unit = unit.no; UI.speak.idx = tipIndex; UI.speak.result = null; UI.view = "speak"; render(); } }
        }, ["말해보기"])
      ])
    ]));

    wrap.appendChild(el("section", { class: "card tip-card" }, [
      el("span", { class: "tip-emoji", text: "💡" }),
      el("p", { class: "tip-copy", text: L() === "en"
        ? "영어는 문장을 통째로 외우면 말할 때 바로 나와요. 오늘 문장 5개만 소리 내어 읽어도 충분해요."
        : "중국어는 성조가 절반이에요. 병음을 보며 손으로 성조를 그리면서 따라 말해 보세요." })
    ]));

    return wrap;
  }

  /* ---------- 문장 암기(플래시카드) ---------- */
  function viewCards() {
    var unit = S.unitOf(L(), UI.card.unit || UI.day);
    var idx = C.clamp(UI.card.idx, 0, unit.sentences.length - 1);
    var s = unit.sentences[idx];
    var mastered = S.unitMastered(unit.id);
    var wrap = el("div", { class: "view view-cards" });

    wrap.appendChild(viewHead("문장 암기", "카드를 뒤집으며 뜻과 문장을 연결해요"));
    wrap.appendChild(unitChips(unit.no, function (no) {
      UI.card.unit = no; UI.card.idx = 0; UI.card.flipped = false; render();
    }));

    wrap.appendChild(el("div", { class: "card-progress" }, [
      el("span", { class: "card-progress-text", text: (idx + 1) + " / " + unit.sentences.length }),
      el("span", { class: "card-progress-mastered", text: "외운 문장 " + mastered + "개" })
    ]));

    var card = el("div", { class: "flash" + (UI.card.flipped ? " is-flipped" : ""), role: "button", tabindex: "0", "aria-label": "카드 뒤집기" }, [
      el("div", { class: "flash-inner" }, [
        el("div", { class: "flash-face flash-front" }, [
          el("span", { class: "flash-tag", text: "한국어 뜻" }),
          el("p", { class: "flash-ko", text: s.ko }),
          el("span", { class: "flash-hint", text: "탭해서 문장 보기 ↻" }),
          S.isMastered(s.id) ? el("span", { class: "mastered-badge" }, [icon("check", "badge-ico"), "외운 문장"]) : null
        ]),
        el("div", { class: "flash-face flash-back" }, [
          el("span", { class: "flash-tag", text: course().native }),
          el("p", { class: "flash-text", lang: L(), text: s.text }),
          s.pinyin ? el("p", { class: "flash-pinyin", text: s.pinyin }) : null,
          el("button", {
            class: "round-btn round-btn-blue",
            type: "button",
            "aria-label": "문장 듣기",
            on: { click: function (ev) { ev.stopPropagation(); playSentence(s, false); } }
          }, [icon("speaker")]),
          el("span", { class: "flash-hint", text: "탭하면 뜻으로 돌아가요" })
        ])
      ])
    ]);
    card.addEventListener("click", function () {
      UI.card.flipped = !UI.card.flipped;
      if (card.classList && card.classList.toggle) card.classList.toggle("is-flipped");
    });
    card.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        UI.card.flipped = !UI.card.flipped;
        if (card.classList && card.classList.toggle) card.classList.toggle("is-flipped");
      }
    });
    wrap.appendChild(card);

    wrap.appendChild(el("div", { class: "flash-nav" }, [
      iconBtn("back", "이전 문장", function () {
        UI.card.idx = (idx - 1 + unit.sentences.length) % unit.sentences.length;
        UI.card.flipped = false; render();
      }, "nav-btn"),
      el("div", { class: "dots" }, unit.sentences.map(function (_, i) {
        return el("span", { class: "dot" + (i === idx ? " is-on" : "") });
      })),
      iconBtn("chevron", "다음 문장", function () {
        UI.card.idx = (idx + 1) % unit.sentences.length;
        UI.card.flipped = false; render();
      }, "nav-btn")
    ]));

    function advance(mark) {
      if (mark) {
        S.markMastered(s.id, true);
        beep("correct");
        toast("외웠어요! 문장 하나를 저장했어요");
      } else {
        toast("괜찮아요. 조금 뒤에 다시 만나요");
      }
      var next = idx + 1;
      if (next >= unit.sentences.length) {
        if (mark) { finishCards(unit); return; }
        next = 0;
      }
      UI.card.idx = next;
      UI.card.flipped = false;
      render();
    }

    wrap.appendChild(el("div", { class: "flash-actions" }, [
      el("button", { class: "btn btn-orange-ghost", type: "button", on: { click: function () { advance(false); } } }, ["아직 몰라요"]),
      el("button", { class: "btn btn-primary", type: "button", on: { click: function () { advance(true); } } }, ["외웠어요 ✓"])
    ]));

    wrap.appendChild(el("div", { class: "card-cta" }, [
      el("button", {
        class: "btn btn-ghost btn-wide", type: "button",
        on: { click: function () { startLesson(unit.no, 2); } }
      }, [icon("cards", "btn-ico"), "이 단원 문장 만들기"]),
      el("button", {
        class: "btn btn-ghost btn-wide", type: "button",
        on: { click: function () { UI.speak.unit = unit.no; UI.speak.idx = 0; UI.speak.result = null; UI.view = "speak"; render(); } }
      }, [icon("mic", "btn-ico"), "이 단원 말하기 연습"])
    ]));

    return wrap;
  }

  function finishCards(unit) {
    var mastered = S.unitMastered(unit.id);
    beep("win");
    confetti();
    openSheet("이 단원 카드를 모두 봤어요!", [
      el("p", { class: "sheet-lead", text: "Day " + unit.no + " · " + unit.title }),
      el("p", { class: "sheet-lead", text: "외운 문장 " + mastered + " / " + unit.sentences.length + "개. 이제 직접 말해 볼까요?" }),
      el("div", { class: "sheet-actions" }, [
        el("button", { class: "btn btn-primary btn-wide", type: "button", on: { click: function () { openSheetClose(); startLesson(unit.no, 4); } } }, ["말하기 수업 시작"]),
        el("button", { class: "btn btn-ghost btn-wide", type: "button", on: { click: function () { openSheetClose(); UI.card.idx = 0; render(); } } }, ["카드 처음부터"])
      ])
    ]);
    UI.card.idx = 0;
    render();
  }

  var sheetCloser = null;
  function openSheetClose() {
    if (sheetCloser) sheetCloser();
  }

  /* ---------- 말하기 ---------- */
  function viewSpeak() {
    var unit = S.unitOf(L(), UI.speak.unit || UI.day);
    var idx = C.clamp(UI.speak.idx || 0, 0, unit.sentences.length - 1);
    var s = unit.sentences[idx];
    var wrap = el("div", { class: "view view-speak" });

    wrap.appendChild(viewHead("말하기 연습", "듣고 따라 말하면 발음이 잡혀요"));
    wrap.appendChild(unitChips(unit.no, function (no) {
      UI.speak.unit = no; UI.speak.idx = 0; UI.speak.result = null; render();
    }));

    var voice = buildVoiceCard(s, {
      showKo: true,
      onAttempt: function (ratio) { UI.speak.result = ratio; }
    });
    wrap.appendChild(voice.node);
    if (!Speech.supported) {
      wrap.appendChild(el("p", { class: "speech-note", text: "이 브라우저는 음성 재생을 지원하지 않아요. 병음과 뜻으로도 충분히 연습할 수 있어요." }));
    }

    wrap.appendChild(el("div", { class: "speak-nav" }, [
      el("button", {
        class: "btn btn-ghost btn-small", type: "button",
        on: { click: function () { UI.speak.idx = (idx - 1 + unit.sentences.length) % unit.sentences.length; UI.speak.result = null; render(); } }
      }, [icon("back", "btn-ico"), "이전"]),
      el("span", { class: "speak-count", text: (idx + 1) + " / " + unit.sentences.length }),
      el("button", {
        class: "btn btn-ghost btn-small", type: "button",
        on: { click: function () { UI.speak.idx = (idx + 1) % unit.sentences.length; UI.speak.result = null; render(); } }
      }, ["다음", icon("chevron", "btn-ico")])
    ]));

    wrap.appendChild(el("div", { class: "card tip-card" }, [
      el("span", { class: "tip-emoji", text: "🎧" }),
      el("p", { class: "tip-copy", text: "먼저 '천천히'로 듣고, 그다음 보통 속도로 들으며 따라 말해 보세요. 마이크가 안 되면 '직접 말해봤어요 ✓'로도 충분해요." })
    ]));

    return wrap;
  }

  /** 문장 하나를 듣고 따라 말하는 카드. Speak 탭과 말하기 수업에서 함께 씁니다. */
  function buildVoiceCard(s, opts) {
    opts = opts || {};
    var slow = !!S.get().prefs.slow;
    var card = el("div", { class: "voice-card" });
    var status = el("p", { class: "mic-status", "aria-live": "polite" },
      ["마이크를 누르고 문장을 따라 말해 보세요"]);
    var micBtn = null;
    var fallback = null;

    card.appendChild(el("p", { class: "target", lang: L(), text: s.text }));
    if (s.pinyin) card.appendChild(el("p", { class: "pinyin", text: s.pinyin }));
    if (opts.showKo !== false) card.appendChild(el("p", { class: "ko-line", text: s.ko }));

    var speedBtns = [];
    function applySpeed() {
      speedBtns.forEach(function (b) {
        var on = b.getAttribute("data-slow") === "1" ? slow : !slow;
        if (on) b.classList.add("is-active"); else b.classList.remove("is-active");
      });
    }
    var speedWrap = el("div", { class: "speed" }, [
      el("button", {
        class: "speed-btn", type: "button", dataset: { slow: "0" },
        on: { click: function () { slow = false; S.setPref("slow", false); applySpeed(); playSentence(s, false); } }
      }, ["보통"]),
      el("button", {
        class: "speed-btn", type: "button", dataset: { slow: "1" },
        on: { click: function () { slow = true; S.setPref("slow", true); applySpeed(); playSentence(s, true); } }
      }, ["천천히"])
    ]);
    speedBtns = speedWrap.children ? Array.prototype.slice.call(speedWrap.children) : [];

    card.appendChild(el("div", { class: "voice-audio" }, [
      el("button", {
        class: "play-btn", type: "button", "aria-label": "문장 듣기",
        on: { click: function () { playSentence(s, slow); } }
      }, [icon("speaker")]),
      el("button", {
        class: "btn btn-ghost btn-small", type: "button",
        on: { click: function () { playSentence(s, true); } }
      }, [icon("slow", "btn-ico"), "천천히 듣기"]),
      speedWrap
    ]));

    if (s.tip) {
      card.appendChild(el("div", { class: "tip-inline" }, [
        el("span", { class: "tip-inline-label", text: "발음 팁" }),
        el("span", { class: "tip-inline-text", text: s.tip })
      ]));
    }

    var feedbackSlot = el("div", { class: "feedback-slot", "aria-live": "polite" });
    card.appendChild(feedbackSlot);

    function attempt(ratio, transcript) {
      UI.micOn = false;
      if (micBtn) micBtn.classList.remove("is-listening");
      if (ratio === null) {
        status.textContent = "직접 말해봤어요! 소리 내어 읽는 것만으로도 충분해요.";
        status.className = "mic-status is-good";
      } else {
        status.textContent = "잘 들었어요. 아래 점수를 확인해 보세요.";
        status.className = "mic-status";
      }
      renderFeedback(feedbackSlot, ratio, transcript, s);
      if (opts.onAttempt) opts.onAttempt(ratio);
    }

    function setListening(on) {
      UI.micOn = on;
      if (micBtn) {
        if (on) micBtn.classList.add("is-listening");
        else micBtn.classList.remove("is-listening");
      }
      if (on) {
        status.textContent = "듣고 있어요… 문장을 말해 보세요";
        status.className = "mic-status is-live";
      }
    }

    function listen() {
      var Ctor = global.SpeechRecognition || global.webkitSpeechRecognition;
      if (!Ctor) {
        status.textContent = "이 브라우저는 말하기 인식을 지원하지 않아요. '직접 말해봤어요 ✓'를 눌러 주세요.";
        status.className = "mic-status is-warn";
        if (fallback) fallback.classList.add("is-attention");
        return;
      }
      stopRecognize();
      var rec;
      try {
        rec = new Ctor();
        rec.lang = locale();
        rec.interimResults = false;
        rec.maxAlternatives = 1;
        rec.continuous = false;
        rec.onstart = function () { setListening(true); };
        rec.onresult = function (ev) {
          var transcript = "";
          try { transcript = ev.results[0][0].transcript || ""; } catch (e) { transcript = ""; }
          var ratio = C.similarity(s.text, transcript, L());
          setListening(false);
          attempt(ratio, transcript);
        };
        rec.onerror = function (ev) {
          setListening(false);
          var msg = micErrorMessage(ev && ev.error);
          if (msg) {
            status.textContent = msg;
            status.className = "mic-status is-warn";
          }
          if (fallback) fallback.classList.add("is-attention");
        };
        rec.onend = function () { setListening(false); };
        UI.recog = rec;
        rec.start();
        setListening(true);
      } catch (e) {
        setListening(false);
        status.textContent = "마이크를 시작하지 못했어요. '직접 말해봤어요 ✓'를 눌러 주세요.";
        status.className = "mic-status is-warn";
        if (fallback) fallback.classList.add("is-attention");
      }
    }

    card.appendChild(el("div", { class: "mic-wrap" }, [
      el("button", {
        class: "mic-btn", type: "button", "aria-label": "마이크로 따라 말하기",
        on: { click: listen }
      }, [icon("mic"), el("span", { class: "mic-btn-label", text: "눌러서 말하기" })]),
      status
    ]));

    fallback = el("button", {
      class: "btn btn-ghost btn-wide fallback-btn", type: "button",
      on: { click: function () { attempt(null, null); } }
    }, ["직접 말해봤어요 ✓"]);
    card.appendChild(fallback);

    applySpeed();
    return { node: card, status: status };
  }

  function renderFeedback(slot, ratio, transcript, s) {
    clear(slot);
    if (ratio === null) {
      slot.appendChild(el("div", { class: "fb fb-good" }, [
        el("span", { class: "fb-emoji", text: "👏" }),
        el("div", { class: "fb-copy" }, [
          el("p", { class: "fb-title", text: "직접 말해봤어요!" }),
          el("p", { class: "fb-desc", text: "다음 문장도 이어서 해볼까요?" })
        ])
      ]));
      return;
    }
    var fb = C.feedbackFor(ratio);
    var pct = Math.round(ratio * 100);
    var tone = fb.tone === "again" ? "bad" : fb.tone === "ok" ? "ok" : "good";
    slot.appendChild(el("div", { class: "fb fb-" + tone }, [
      el("span", { class: "fb-score", text: pct + "%" }),
      el("div", { class: "fb-copy" }, [
        el("p", { class: "fb-title", text: fb.title }),
        el("p", { class: "fb-desc", text: fb.desc }),
        transcript ? el("p", { class: "fb-heard", text: "들린 말: “" + transcript + "”" }) : null,
        el("p", { class: "fb-target", text: "문장: " + s.text })
      ])
    ]));
  }

  /* ---------- 진도 ---------- */
  function viewProgress() {
    var st = S.streakInfo();
    var wrap = el("div", { class: "view view-progress" });
    wrap.appendChild(viewHead("나의 진도", "쌓인 만큼 늘고 있어요"));

    wrap.appendChild(el("div", { class: "stats" }, [
      statCard("flame", "스트릭", st.count + "일", st.best ? "최고 " + st.best + "일" : "오늘 시작해요"),
      statCard("bolt", "총 XP", String(S.totalXp()), "오늘 +" + S.todayXp()),
      statCard("check", "외운 문장", S.masteredCount(L()) + "개", course().name + " 기준"),
      statCard("chart", "완료한 날", S.doneDays(L()) + " / " + course().units.length, "14일 코스")
    ]));

    wrap.appendChild(el("section", { class: "card week-card" }, [
      el("div", { class: "section-head section-head-tight" }, [
        el("h2", { text: "이번 주" }),
        el("span", { class: "section-right", text: st.activeToday ? "오늘 학습 완료" : "오늘도 화이팅" })
      ]),
      el("div", { class: "week" }, S.last7().map(function (d) {
        var day = C.parseKey(d.key).getDay();
        return el("div", { class: "week-day" }, [
          el("span", { class: "week-label", text: C.WEEKDAYS[day] }),
          el("span", {
            class: "week-dot" + (d.xp > 0 ? " is-on" : ""),
            text: d.xp > 0 ? "🔥" : C.parseKey(d.key).getDate()
          })
        ]);
      }))
    ]));

    wrap.appendChild(el("div", { class: "section-head" }, [
      el("h2", { text: course().name + " 14일 코스" }),
      el("span", { class: "section-right", text: S.doneDays(L()) + "일 완료" })
    ]));

    var list = el("div", { class: "course-list" });
    course().units.forEach(function (u) {
      var doneLessons = S.doneLessons(u.id);
      var pct = C.percent(doneLessons, D.lessons.length);
      list.appendChild(el("button", {
        class: "course-row" + (S.isUnitDone(u.id) ? " is-done" : ""),
        type: "button",
        on: { click: function () { UI.day = u.no; UI.view = "today"; render(); } }
      }, [
        el("span", { class: "course-emoji", text: u.emoji }),
        el("span", { class: "course-copy" }, [
          el("span", { class: "course-title", text: "Day " + u.no + " · " + u.title }),
          el("span", { class: "course-bar" }, [bar(pct, "green")])
        ]),
        el("span", { class: "course-state", text: S.isUnitDone(u.id) ? "완료" : doneLessons ? doneLessons + "/4" : "—" })
      ]));
    });
    wrap.appendChild(list);

    wrap.appendChild(el("div", { class: "section-head" }, [el("h2", { text: "다른 언어" })]));
    wrap.appendChild(el("div", { class: "lang-summary" }, ["en", "zh"].map(function (code) {
      var c = D.courses[code];
      return el("button", {
        class: "lang-card" + (L() === code ? " is-active" : ""),
        type: "button",
        on: { click: function () { switchLang(code); } }
      }, [
        el("span", { class: "lang-flag", text: c.flag }),
        el("span", { class: "lang-name", text: c.name }),
        el("span", { class: "lang-meta", text: S.doneDays(code) + "/14일 · " + S.masteredCount(code) + "문장" })
      ]);
    })));

    var prefs = S.get().prefs;
    wrap.appendChild(el("section", { class: "card settings" }, [
      el("h2", { class: "settings-title", text: "설정" }),
      settingRow("소리 효과", "정답·오답 알림음", switchBtn(!!prefs.sound, function (v) {
        S.setPref("sound", v); if (v) beep("correct"); render();
      })),
      settingRow("기본 재생 속도", "문장을 처음 재생할 때", segSmall(prefs.slow, function (v) {
        S.setPref("slow", v); render();
      })),
      settingRow("음성 안내", Speech.supported ? "이 기기에서 재생 가능" : "음성 재생 미지원",
        el("span", { class: "settings-note", text: Speech.supported ? "정상" : "브라우저 한계" })),
      settingRow("홈 화면에 추가", "앱처럼 전체 화면으로", el("button", {
        class: "btn btn-ghost btn-small", type: "button", on: { click: installSheet }
      }, ["방법 보기"])),
      settingRow("학습 데이터", "XP·스트릭·기록 지우기", el("button", {
        class: "btn btn-danger-ghost btn-small", type: "button",
        on: {
          click: function () {
            var close = openSheet("학습 데이터를 지울까요?", [
              el("p", { class: "sheet-lead", text: "XP, 스트릭, 완료한 수업, 외운 문장이 모두 사라져요. 되돌릴 수 없어요." }),
              el("div", { class: "sheet-actions" }, [
                el("button", {
                  class: "btn btn-danger btn-wide", type: "button",
                  on: {
                    click: function () {
                      S.resetAll();
                      UI.day = 1; UI.card = { unit: 1, idx: 0, flipped: false };
                      UI.speak = { unit: 1, idx: 0, result: null };
                      if (close) close();
                      UI.view = "today";
                      render();
                      toast("학습 데이터를 새로 시작했어요");
                    }
                  }
                }, ["모두 지우기"]),
                el("button", { class: "btn btn-ghost btn-wide", type: "button", on: { click: function () { if (close) close(); } } }, ["그대로 두기"])
              ])
            ]);
            sheetCloser = close;
          }
        }
      }, ["초기화"]))
    ]));

    wrap.appendChild(el("p", { class: "footnote", text: "킹링고 · 매일 영어·중국어 · 만든이 지니" }));
    return wrap;
  }

  function statCard(iconName, label, value, sub) {
    return el("div", { class: "stat" }, [
      el("span", { class: "stat-ico" }, [icon(iconName)]),
      el("span", { class: "stat-value", text: value }),
      el("span", { class: "stat-label", text: label }),
      el("span", { class: "stat-sub", text: sub })
    ]);
  }

  function settingRow(label, sub, control) {
    return el("div", { class: "setting-row" }, [
      el("div", { class: "setting-copy" }, [
        el("b", { class: "setting-label", text: label }),
        el("span", { class: "setting-sub", text: sub })
      ]),
      control
    ]);
  }

  function switchBtn(on, onChange) {
    return el("button", {
      class: "switch" + (on ? " is-on" : ""),
      type: "button",
      role: "switch",
      "aria-checked": on ? "true" : "false",
      on: {
        click: function () {
          onChange(!on);
        }
      }
    }, [el("span", { class: "switch-knob" })]);
  }

  function segSmall(slow, onChange) {
    return el("div", { class: "speed speed-sm" }, [
      el("button", {
        class: "speed-btn" + (!slow ? " is-active" : ""), type: "button",
        on: { click: function () { onChange(false); } }
      }, ["보통"]),
      el("button", {
        class: "speed-btn" + (slow ? " is-active" : ""), type: "button",
        on: { click: function () { onChange(true); } }
      }, ["천천히"])
    ]);
  }

  /* ---------- 수업 ---------- */
  function startLesson(unitNo, lessonNo) {
    var unit = S.unitOf(L(), unitNo || 1);
    var lesson = D.lessons[Math.max(0, Math.min(D.lessons.length - 1, (lessonNo || 1) - 1))];
    var steps = [];
    if (lesson.key === "quiz") {
      var qs = C.buildMeaningQuiz(unit.sentences, allSentences(L()), unit.sentences.length);
      qs.forEach(function (q) { steps.push({ type: "quiz", q: q, answered: false, correct: null, spoken: false }); });
    } else if (lesson.key === "build") {
      unit.sentences.forEach(function (s) {
        var tokens = C.tokenize(s);
        var bank = C.shuffle(tokens.map(function (t, i) { return { id: i, text: t }; }));
        steps.push({ type: "build", s: s, tokens: tokens, bank: bank, placed: [], status: "idle", attempts: 0, spoken: false });
      });
    } else if (lesson.key === "speak") {
      unit.sentences.forEach(function (s) { steps.push({ type: "speak", s: s, attempted: false }); });
    } else {
      unit.sentences.forEach(function (s) { steps.push({ type: "learn", s: s, spoken: false }); });
    }
    UI.lesson = {
      unit: unit,
      lesson: lesson,
      steps: steps,
      idx: 0,
      correct: 0,
      total: 0,
      result: null,
      finished: false
    };
    UI.view = "lesson";
    stopRecognize();
    try {
      if (global.history && global.history.pushState) global.history.pushState({ kingLesson: true }, "");
    } catch (e) { /* noop */ }
    render();
  }

  function currentStep() {
    return UI.lesson ? UI.lesson.steps[UI.lesson.idx] : null;
  }

  function renderLessonTop(top) {
    top.className = "topbar lesson-top";
    var lesson = UI.lesson;
    var pct = lesson ? C.percent(lesson.idx, lesson.steps.length) : 0;
    top.appendChild(el("div", { class: "lesson-top-row" }, [
      iconBtn("close", "수업 나가기", closeLesson, "close-btn"),
      el("div", { class: "lesson-progress" }, [bar(pct, "green")]),
      el("span", { class: "lesson-count", text: lesson ? (Math.min(lesson.idx + 1, lesson.steps.length)) + "/" + lesson.steps.length : "" })
    ]));
  }

  function closeLesson() {
    stopRecognize();
    var day = UI.lesson ? UI.lesson.unit.no : UI.day;
    var unitId = UI.lesson ? UI.lesson.unit.id : null;
    UI.lesson = null;
    UI.view = "today";
    // 방금 그날을 모두 끝냈으면 다음 날로 넘어가 있어요.
    UI.day = unitId && S.isUnitDone(unitId) ? S.currentDayNo(L()) : day;
    render();
  }

  function viewLesson() {
    var lesson = UI.lesson;
    if (!lesson) return el("div", { class: "view" });
    if (lesson.finished) return renderResult();

    var step = currentStep();
    var body = el("div", { class: "lesson-body" });
    var foot = el("div", { class: "lesson-foot" });
    var wrap = el("div", { class: "view view-lesson" });

    wrap.appendChild(el("div", { class: "lesson-meta" }, [
      el("span", { class: "lesson-emoji", text: lesson.lesson.emoji }),
      el("span", { class: "lesson-name", text: "Day " + lesson.unit.no + " · " + lesson.unit.title }),
      el("span", { class: "lesson-xp", text: "+" + lesson.lesson.xp + " XP" })
    ]));

    if (step.type === "learn") renderLearnStep(step, body, foot);
    else if (step.type === "build") renderBuildStep(step, body, foot);
    else if (step.type === "quiz") renderQuizStep(step, body, foot);
    else renderSpeakStep(step, body, foot);

    wrap.appendChild(body);
    wrap.appendChild(foot);
    return wrap;
  }

  function footButton(label, handler, opts) {
    opts = opts || {};
    return el("button", {
      class: "btn btn-wide " + (opts.tone === "ghost" ? "btn-ghost" : "btn-primary") + (opts.disabled ? " is-disabled" : ""),
      type: "button",
      disabled: opts.disabled ? "disabled" : false,
      on: {
        click: function () {
          if (opts.disabled) return;
          handler();
        }
      }
    }, [label]);
  }

  function nextStep() {
    var lesson = UI.lesson;
    if (!lesson) return;
    stopRecognize();
    if (lesson.idx >= lesson.steps.length - 1) {
      finishLesson();
      return;
    }
    lesson.idx += 1;
    render();
  }

  function finishLesson() {
    var lesson = UI.lesson;
    if (!lesson) return;
    var accuracy = lesson.total > 0 ? Math.round((lesson.correct / lesson.total) * 100) : null;
    var res = S.completeLesson(lesson.unit, lesson.lesson, { accuracy: accuracy });
    lesson.result = {
      xp: res.xp,
      first: res.first,
      accuracy: accuracy,
      correct: lesson.correct,
      total: lesson.total
    };
    lesson.finished = true;
    beep("win");
    confetti();
    render();
  }

  function renderResult() {
    var lesson = UI.lesson;
    var res = lesson.result || { xp: 0, first: false, accuracy: null };
    var perfect = res.accuracy !== null && res.accuracy === 100;
    var wrap = el("div", { class: "view view-result" });
    var goalDone = S.todayXp() >= D.dailyGoal;

    wrap.appendChild(el("div", { class: "result-hero" }, [
      el("span", { class: "result-emoji", text: perfect ? "🏆" : "🎉" }),
      el("h1", { class: "result-title", text: res.first ? "수업 완료!" : "복습 완료!" }),
      el("p", { class: "result-sub", text: "Day " + lesson.unit.no + " · " + lesson.lesson.title }),
      el("div", { class: "result-xp" }, [
        icon("bolt", "result-xp-ico"),
        el("span", { text: res.xp > 0 ? "+" + res.xp + " XP" : "XP는 이미 받았어요" })
      ])
    ]));

    var rows = el("div", { class: "result-rows" });
    rows.appendChild(resultRow("정확도", res.accuracy === null ? "끝까지 완료" : res.accuracy + "%"));
    rows.appendChild(resultRow("오늘 XP", S.todayXp() + " / " + D.dailyGoal));
    rows.appendChild(resultRow("스트릭", S.streakInfo().count + "일 연속 🔥"));
    rows.appendChild(resultRow("이 단원", S.doneLessons(lesson.unit.id) + " / 4 수업"));
    wrap.appendChild(rows);

    if (S.isUnitDone(lesson.unit.id)) {
      wrap.appendChild(el("div", { class: "goal-banner" }, ["Day " + lesson.unit.no + " 완료! 이 단원 문장 5개를 모두 익혔어요 🎉"]));
    }
    if (goalDone) {
      wrap.appendChild(el("div", { class: "goal-banner" }, ["오늘의 목표 달성! 🎉 내일도 이어서 만나요"]));
    }

    var nextLessonNo = lesson.lesson.no < D.lessons.length ? lesson.lesson.no + 1 : 0;
    var nextDayNo = lesson.unit.no + 1;
    wrap.appendChild(el("div", { class: "result-actions" }, [
      el("button", {
        class: "btn btn-primary btn-wide", type: "button",
        on: {
          click: function () {
            if (nextLessonNo) startLesson(lesson.unit.no, nextLessonNo);
            else if (nextDayNo <= course().units.length) startLesson(nextDayNo, 1);
            else finishDayAll();
          }
        }
      }, [nextLessonNo ? "다음 수업 · " + D.lessons[nextLessonNo - 1].title : "다음 날로"]),
      el("button", {
        class: "btn btn-ghost btn-wide", type: "button",
        on: { click: function () { closeLesson(); } }
      }, ["오늘 화면으로"])
    ]));

    return wrap;
  }

  function finishDayAll() {
    beep("win");
    openSheet("14일 코스를 모두 끝냈어요!", [
      el("p", { class: "sheet-lead", text: "영어와 중국어, 두 코스를 언제든 다시 복습할 수 있어요. 꾸준함이 제일 큰 실력이에요." }),
      el("div", { class: "sheet-actions" }, [
        el("button", { class: "btn btn-primary btn-wide", type: "button", on: { click: function () { openSheetClose(); closeLesson(); } } }, ["확인"])
      ])
    ]);
  }

  function resultRow(label, value) {
    return el("div", { class: "result-row" }, [
      el("span", { class: "result-row-label", text: label }),
      el("b", { class: "result-row-value", text: value })
    ]);
  }

  /* --- 1) 익히기 --- */
  function renderLearnStep(step, body, foot) {
    var s = step.s;
    var lesson = UI.lesson;
    body.appendChild(el("p", { class: "eyebrow", text: "새 문장 " + (lesson.idx + 1) + " / " + lesson.steps.length }));

    body.appendChild(el("div", { class: "card learn-card" }, [
      el("p", { class: "target", lang: L(), text: s.text }),
      s.pinyin ? el("p", { class: "pinyin", text: s.pinyin }) : null,
      el("div", { class: "audio-row" }, [
        el("button", { class: "btn btn-blue btn-small", type: "button", on: { click: function () { playSentence(s, false); } } },
          [icon("speaker", "btn-ico"), "듣기"]),
        el("button", { class: "btn btn-ghost btn-small", type: "button", on: { click: function () { playSentence(s, true); } } },
          [icon("slow", "btn-ico"), "천천히"])
      ]),
      el("div", { class: "learn-divider" }),
      el("p", { class: "ko-line", text: s.ko }),
      s.tip ? el("div", { class: "tip-inline" }, [
        el("span", { class: "tip-inline-label", text: course().tipLabel }),
        el("span", { class: "tip-inline-text", text: s.tip })
      ]) : null
    ]));

    if (!step.spoken) {
      step.spoken = true;
      playSentence(s, S.get().prefs.slow);
    }

    foot.appendChild(footButton(lesson.idx >= lesson.steps.length - 1 ? "완료하기" : "다음 문장", nextStep));
  }

  /* --- 2) 문장 만들기 --- */
  function renderBuildStep(step, body, foot) {
    var lesson = UI.lesson;
    var s = step.s;
    body.appendChild(el("p", { class: "eyebrow", text: "문장 만들기 " + (lesson.idx + 1) + " / " + lesson.steps.length }));
    body.appendChild(el("p", { class: "ko-prompt", text: s.ko }));
    body.appendChild(el("div", { class: "build-audio" }, [
      el("button", { class: "btn btn-blue btn-small", type: "button", on: { click: function () { playSentence(s, false); } } },
        [icon("speaker", "btn-ico"), "문장 듣기"]),
      el("button", { class: "btn btn-ghost btn-small", type: "button", on: { click: function () { playSentence(s, true); } } },
        [icon("slow", "btn-ico"), "천천히"])
    ]));

    var slots = el("div", { class: "slots" + (step.status === "bad" ? " is-shake" : "") });
    if (!step.placed.length) {
      slots.appendChild(el("span", { class: "slots-empty", text: "아래 블록을 눌러 순서대로 놓아 보세요" }));
    } else {
      step.placed.forEach(function (tile, i) {
        slots.appendChild(el("button", {
          class: "tile tile-placed", type: "button",
          on: {
            click: function () {
              if (step.status === "ok") return;
              step.placed.splice(i, 1);
              step.bank.push(tile);
              step.status = "idle";
              render();
            }
          }
        }, [tile.text]));
      });
    }
    if (step.placed.length && step.placed.length < step.tokens.length) {
      slots.appendChild(el("span", { class: "slot-empty" }));
    }
    body.appendChild(slots);

    var bank = el("div", { class: "bank" });
    step.bank.forEach(function (tile) {
      bank.appendChild(el("button", {
        class: "tile", type: "button",
        on: {
          click: function () {
            if (step.status === "ok" || step.status === "reveal") return;
            var i = step.bank.indexOf(tile);
            if (i >= 0) step.bank.splice(i, 1);
            step.placed.push(tile);
            step.status = "idle";
            render();
          }
        }
      }, [tile.text]));
    });
    body.appendChild(bank);

    if (step.status === "ok") {
      body.appendChild(el("div", { class: "banner banner-good" }, [icon("check", "banner-ico"), "정답이에요! +2 XP"]));
    } else if (step.status === "bad") {
      body.appendChild(el("div", { class: "banner banner-bad" }, ["순서가 조금 달라요. 다시 맞춰 볼까요?"]));
    } else if (step.status === "reveal") {
      body.appendChild(el("div", { class: "banner banner-info" }, ["정답: " + s.text]));
    }

    var allPlaced = step.placed.length === step.tokens.length;
    if (step.status === "ok") {
      foot.appendChild(footButton(lesson.idx >= lesson.steps.length - 1 ? "완료하기" : "계속", nextStep));
    } else if (step.status === "bad") {
      foot.appendChild(footButton("다시 하기", function () {
        step.placed = [];
        step.bank = C.shuffle(step.bank.concat([]));
        step.status = "idle";
        render();
      }, { tone: "ghost" }));
    } else if (step.status === "reveal") {
      foot.appendChild(footButton("다음 문장", nextStep));
    } else {
      foot.appendChild(footButton("확인", function () {
        var userText = step.placed.map(function (t) { return t.text; }).join(L() === "en" ? " " : "");
        var answerText = step.tokens.join(L() === "en" ? " " : "");
        var ok = C.normalize(userText, L()) === C.normalize(answerText, L());
        lesson.total += 1;
        if (ok) {
          if (step.attempts === 0) lesson.correct += 1;
          step.status = "ok";
          S.addXp(2);
          beep("correct");
        } else {
          step.attempts += 1;
          step.status = step.attempts >= 2 ? "reveal" : "bad";
          beep("wrong");
        }
        render();
      }, { disabled: !allPlaced }));
    }
  }

  /* --- 3) 듣기 퀴즈 --- */
  function renderQuizStep(step, body, foot) {
    var lesson = UI.lesson;
    var q = step.q;
    body.appendChild(el("p", { class: "eyebrow", text: "듣기 퀴즈 " + (lesson.idx + 1) + " / " + lesson.steps.length }));
    body.appendChild(el("div", { class: "quiz-audio" }, [
      el("button", {
        class: "play-btn play-btn-lg", type: "button", "aria-label": "문장 다시 듣기",
        on: { click: function () { playSentence(q.sentence, false); } }
      }, [icon("speaker")])
    ]));
    body.appendChild(el("p", { class: "quiz-q", text: "무슨 뜻일까요?" }));
    if (!step.spoken) {
      step.spoken = true;
      playSentence(q.sentence, false);
    }

    var options = el("div", { class: "options" });
    q.options.forEach(function (opt) {
      var cls = " option";
      if (step.answered) {
        if (opt.correct) cls += " is-correct";
        else if (step.correct === false && opt.text === step.picked) cls += " is-wrong";
        cls += " is-locked";
      }
      options.appendChild(el("button", {
        class: "option-btn" + cls,
        type: "button",
        on: {
          click: function () {
            if (step.answered) return;
            step.answered = true;
            step.picked = opt.text;
            step.correct = !!opt.correct;
            lesson.total += 1;
            if (opt.correct) {
              lesson.correct += 1;
              S.addXp(2);
              beep("correct");
            } else {
              beep("wrong");
            }
            render();
          }
        }
      }, [
        el("span", { class: "option-mark" }, [opt.correct && step.answered ? icon("check") : null]),
        el("span", { class: "option-text", text: opt.text })
      ]));
    });
    body.appendChild(options);

    if (step.answered) {
      body.appendChild(el("div", { class: "banner " + (step.correct ? "banner-good" : "banner-bad") }, [
        step.correct ? "정답이에요! +2 XP" : "아쉬워요. 정답을 확인해 보세요."
      ]));
      body.appendChild(el("p", { class: "quiz-reveal", lang: L(), text: q.sentence.text + (q.sentence.pinyin ? "  ·  " + q.sentence.pinyin : "") }));
    }

    if (step.answered) {
      foot.appendChild(footButton(lesson.idx >= lesson.steps.length - 1 ? "완료하기" : "다음", nextStep));
    } else {
      foot.appendChild(el("p", { class: "foot-hint", text: "뜻을 고르면 다음으로 넘어갈 수 있어요" }));
    }
  }

  /* --- 4) 말하기 --- */
  function renderSpeakStep(step, body, foot) {
    var lesson = UI.lesson;
    var s = step.s;
    body.appendChild(el("p", { class: "eyebrow", text: "따라 말하기 " + (lesson.idx + 1) + " / " + lesson.steps.length }));

    var footBtn = footButton(
      lesson.idx >= lesson.steps.length - 1 ? "완료하기" : "다음 문장",
      function () { if (!step.attempted) return; nextStep(); }
    );
    if (!step.attempted) {
      footBtn.disabled = true;
      footBtn.setAttribute("disabled", "disabled");
      footBtn.classList.add("is-disabled");
    }
    var hint = step.attempted ? null : el("p", { class: "foot-hint", text: "한 번 말해 보면 다음으로 넘어갈 수 있어요" });
    foot.appendChild(footBtn);
    if (hint) foot.appendChild(hint);

    var voice = buildVoiceCard(s, {
      showKo: true,
      onAttempt: function () {
        step.attempted = true;
        footBtn.disabled = false;
        footBtn.removeAttribute("disabled");
        if (footBtn.classList) footBtn.classList.remove("is-disabled");
        if (hint && hint.parentNode) hint.parentNode.removeChild(hint);
      }
    });
    body.appendChild(voice.node);
  }

  /* ---------- 탭바 ---------- */
  var TABS = [
    { id: "today", label: "오늘의 학습", icon: "home" },
    { id: "cards", label: "문장 암기", icon: "cards" },
    { id: "speak", label: "말하기 연습", icon: "mic" },
    { id: "progress", label: "진도", icon: "chart" }
  ];

  function renderTab() {
    var tab = roots.tab;
    if (!tab) return;
    clear(tab);
    tab.className = "tabbar" + (UI.view === "lesson" ? " is-hidden" : "");
    TABS.forEach(function (t) {
      var active = UI.view === t.id;
      tab.appendChild(el("button", {
        class: "tab" + (active ? " is-active" : ""),
        type: "button",
        "aria-label": t.label,
        "aria-current": active ? "page" : false,
        on: {
          click: function () {
            if (UI.view === "lesson") return;
            UI.view = t.id;
            if (t.id === "cards") { UI.card.flipped = false; }
            if (t.id === "speak") { UI.speak.result = null; }
            render();
          }
        }
      }, [
        el("span", { class: "tab-ico" }, [icon(t.icon)]),
        el("span", { class: "tab-label", text: t.label })
      ]));
    });
  }

  /* ---------- 언어 ---------- */
  function switchLang(code) {
    if (L() === code) return;
    S.setLang(code);
    UI.day = S.currentDayNo(code);
    UI.card = { unit: UI.day, idx: 0, flipped: false };
    UI.speak = { unit: UI.day, idx: 0, result: null };
    Speech.stop();
    stopRecognize();
    render();
    toast(D.courses[code].name + "로 바뀌었어요");
  }

  /* ---------- 렌더 ---------- */
  function render() {
    if (!roots.main) return;
    stopRecognize();
    var inLesson = UI.view === "lesson";
    if (document.body && document.body.classList) document.body.classList.toggle("in-lesson", inLesson);
    renderTop();
    clear(roots.main);
    var node = null;
    if (UI.view === "today") node = viewToday();
    else if (UI.view === "cards") node = viewCards();
    else if (UI.view === "speak") node = viewSpeak();
    else if (UI.view === "progress") node = viewProgress();
    else if (UI.view === "lesson") node = viewLesson();
    if (node) roots.main.appendChild(node);
    renderTab();
    roots.main.scrollTop = 0;
  }

  /* ---------- 시작 ---------- */
  function boot() {
    roots.top = document.getElementById("topbar");
    roots.main = document.getElementById("main");
    roots.tab = document.getElementById("tabbar");
    S.load();
    UI.day = S.currentDayNo(L());
    UI.card = { unit: UI.day, idx: 0, flipped: false };
    UI.speak = { unit: UI.day, idx: 0, result: null };

    // 매니페스트 바로가기(./#speak 등)로 들어온 경우 해당 탭을 엽니다.
    try {
      var hash = global.location && global.location.hash ? String(global.location.hash).replace("#", "") : "";
      if (hash === "today" || hash === "cards" || hash === "speak" || hash === "progress") UI.view = hash;
    } catch (e) { /* 해시가 없어도 괜찮아요 */ }
    if (global.addEventListener) {
      global.addEventListener("popstate", function () {
        if (UI.view === "lesson") {
          UI.lesson = null;
          UI.view = "today";
          render();
        }
      });
    }
    render();
    registerServiceWorker();
  }

  function registerServiceWorker() {
    if (!global.navigator || !global.navigator.serviceWorker) return;
    try {
      var proto = global.location ? global.location.protocol : "";
      if (proto !== "https:" && proto !== "http:") return;
      global.navigator.serviceWorker.register("./sw.js", { scope: "./" }).catch(function () { /* 오프라인 캐시는 없어도 동작 */ });
    } catch (e) { /* noop */ }
  }

  global.KingApp = {
    boot: boot,
    render: render,
    startLesson: startLesson,
    __ui: UI
  };

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", boot);
    } else {
      boot();
    }
  }
})(typeof window !== "undefined" ? window : this);
