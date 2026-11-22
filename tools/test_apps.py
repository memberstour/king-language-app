#!/usr/bin/env python3
"""킹링고 입문 · 킹한자 자체 점검 — quickjs에서 화면과 흐름을 실제로 눌러 봅니다."""
import json
import os
import sys

import quickjs

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHIM = os.path.join(HERE, "tools", "domshim.js")

STUB = r"""
(function (g) {
  g.navigator = { serviceWorker: { register: function (url, opts) {
    g.__sw = g.__sw || [];
    g.__sw.push({ u: url, s: opts && opts.scope });
    return { catch: function () { return this; } };
  } } };
  g.location = { protocol: "https:", href: "https://example.test/app/" };
})(typeof window !== "undefined" ? window : globalThis);
"""

TESTS = r"""
(function (g) {
  "use strict";
  var out = [];
  function check(name, ok, extra) {
    out.push({ name: name, ok: !!ok, extra: extra === undefined ? "" : String(extra) });
  }
  var ids = g.__ids;
  function collect(node, acc) {
    acc = acc || [];
    (node.children || []).forEach(function (c) {
      if (typeof c._text !== "undefined") return;
      acc.push(c);
      collect(c, acc);
    });
    return acc;
  }
  function byClass(cls, root) {
    return collect(root || ids.main).filter(function (n) {
      return n.className && (" " + n.className + " ").indexOf(" " + cls + " ") >= 0;
    });
  }
  function first(cls, root) { return byClass(cls, root)[0] || null; }
  function txt(n) { return n ? n.textContent : ""; }
  function findBtn(word, root) {
    return collect(root || ids.main).filter(function (n) {
      return n.tagName === "BUTTON" && txt(n).indexOf(word) >= 0;
    })[0] || null;
  }
  function tap(node, label) {
    if (!node) { check("요소 찾기: " + label, false); return false; }
    node.click();
    return true;
  }

  var D = g.APP_DATA;
  var app = g.KingApp;
  var store = app.get();

  /* --- 1. 데이터 --- */
  var units = 0, items = 0;
  var idsSeen = {}, dup = 0, bad = [];
  D.courses.forEach(function (c) {
    check("단원 14개 (" + c.code + ")", c.units.length === 14, c.units.length);
    c.units.forEach(function (u, i) {
      units += 1;
      if (u.no !== i + 1) bad.push(u.id + ":no");
      if (u.id.indexOf(c.code + "-") !== 0) bad.push(u.id + ":prefix");
      if (u.items.length !== 5) bad.push(u.id + ":count");
      u.items.forEach(function (it) {
        items += 1;
        if (idsSeen[it.id]) dup += 1;
        idsSeen[it.id] = true;
        if (!it.text || !it.read || !it.ko || !it.tip) bad.push(it.id + ":field");
        if (D.mode === "hanja") {
          if (!it.hun || !it.eum || !it.radical || !it.strokes || !(it.ex || []).length) bad.push(it.id + ":hanja");
        } else {
          if (!(it.w === undefined || (it.w || []).join("") === it.text)) bad.push(it.id + ":w");
        }
      });
    });
  });
  check("항목 합계", items === D.courses.length * 70, items);
  check("중복 ID 없음", dup === 0, dup);
  check("필수 필드", bad.length === 0, bad.slice(0, 5).join(","));

  if (D.mode === "beginner") {
    var total = 0;
    Object.keys(D.writing).forEach(function (code) {
      var n = 0;
      D.writing[code].groups.forEach(function (gr) { n += gr.letters.length; });
      total += n;
      var want = code === "ru" ? 33 : code === "es" ? 27 : 29;
      check("문자 수 (" + code + ")", n === want, n);
      check("발음 규칙 (" + code + ")", (D.writing[code].rules || []).length >= 4, (D.writing[code].rules || []).length);
    });
    check("문자 합계 89", total === 89, total);
    check("베트남어 성조 규칙", D.writing.vi.rules[0].body.indexOf("sắc") >= 0);
  } else {
    var exOk = true;
    D.courses[0].units.forEach(function (u) {
      u.items.forEach(function (it) { if ((it.ex || []).length < 2) exOk = false; });
    });
    check("예시 낱말 2개 이상", exOk);
  }

  /* --- 2. 첫 화면 --- */
  check("브랜드", txt(ids.topbar).indexOf(D.name) >= 0, txt(ids.topbar).slice(0, 40));
  check("탭 4개", byClass("tab", ids.tabbar).length === 4, byClass("tab", ids.tabbar).length);
  var icons = byClass("ico");
  check("아이콘 렌더", icons.length > 0 && icons.some(function (n) { return (n.innerHTML || "").indexOf("<svg") >= 0; }), icons.length);
  check("단원 pill", byClass("pill").length === 14, byClass("pill").length);
  var cards = byClass("item-card");
  check("오늘 항목 5개", cards.length === 5, cards.length);
  check("첫 항목 내용", txt(cards[0]).indexOf(D.courses[0].units[0].items[0].text) >= 0);

  /* --- 3. 단원 완료 --- */
  var xpBefore = store.xp;
  tap(findBtn("다 봤어요"), "단원 완료");
  check("완료 XP +10", store.xp === xpBefore + 10, store.xp - xpBefore);
  check("완료 표시", byClass("pill").filter(function (p) { return p.className.indexOf("is-done") >= 0; }).length === 1);

  /* --- 4. 언어 전환 (입문) --- */
  if (D.courses.length > 1) {
    var segs = byClass("seg-btn", ids.topbar);
    check("언어 스위치 3개", segs.length === 3, segs.length);
    tap(segs[2], "세 번째 언어");
    check("언어 전환", store.lang === D.courses[2].code, store.lang);
    check("전환 후 단원 1", store.unit === 1, store.unit);
    check("전환 후 화면", txt(ids.main).indexOf(D.courses[2].units[0].items[0].text) >= 0);
  }

  /* --- 5. 읽기·쓰기 --- */
  var tabs = byClass("tab", ids.tabbar);
  tap(tabs[1], "쓰기 탭");
  if (D.mode === "beginner") {
    var letters = byClass("letter");
    check("문자 버튼", letters.length >= 25, letters.length);
    var before = txt(first("focus-ch"));
    tap(letters[letters.length - 1], "마지막 문자");
    check("문자 선택 반영", txt(first("focus-ch")) !== before, txt(first("focus-ch")));
    var toneBtns = byClass("tone");
    if (D.writing[D.courses[2].code] && D.writing[D.courses[2].code].tones) {
      check("성조 버튼 6개", toneBtns.length === 6, toneBtns.length);
      tap(toneBtns[1], "성조 선택");
      check("성조 선택 반영", txt(first("focus-ch")) === "á", txt(first("focus-ch")));
      tap(byClass("tone")[1], "성조 해제");
    }
  } else {
    check("한자 칩 5개", byClass("char-chip").length === 5, byClass("char-chip").length);
    var chips = byClass("char-chip");
    tap(chips[2], "세 번째 한자");
    check("한자 선택 반영", txt(first("focus-ch")) === D.courses[0].units[0].items[2].text);
  }
  check("연습장 있음", byClass("pad-canvas").length === 1);
  check("연습장 도구", byClass("pad-tools").length === 1);
  tap(findBtn("모두 지우기"), "모두 지우기");

  /* --- 6. 카드 --- */
  var tabs2 = byClass("tab", ids.tabbar);
  tap(tabs2[2], "카드 탭");
  check("카드 있음", byClass("flash").length === 1);
  var flash = first("flash");
  tap(flash, "카드 뒤집기");
  check("카드 뒤집힘", first("flash").classList.contains("is-flipped"));
  var masteredBefore = Object.keys(store.mastered).length;
  tap(findBtn("외웠어요"), "외웠어요");
  check("외운 항목 저장", Object.keys(store.mastered).length === masteredBefore + 1);
  check("카드 다음으로", txt(first("day-goal")).indexOf("2 / 5") === 0, txt(first("day-goal")));

  /* --- 7. 퀴즈 --- */
  var tabs3 = byClass("tab", ids.tabbar);
  tap(tabs3[3], "퀴즈 탭");
  check("퀴즈 옵션 4개", byClass("option").length === 4, byClass("option").length);
  var guard = 0;
  while (app.__ui.quiz && !app.__ui.quiz.done && guard < 20) {
    guard += 1;
    var q = app.__ui.quiz;
    var cur = q.qs[q.idx];
    if (!cur.answered) {
      var want = cur.options.filter(function (o) { return o.correct; })[0].text;
      var btn = byClass("option").filter(function (o) { return o.textContent.indexOf(want) >= 0; })[0];
      tap(btn, "정답 고르기");
      check("퀴즈 정답 표시", byClass("option").some(function (o) { return o.className.indexOf("is-correct") >= 0; }));
      tap(findBtn("다음 문제") || findBtn("결과 보기"), "다음 문제");
    } else {
      tap(findBtn("다음 문제") || findBtn("결과 보기"), "다음 문제");
    }
  }
  check("퀴즈 종료", app.__ui.quiz && app.__ui.quiz.done);
  check("퀴즈 만점", app.__ui.quiz && app.__ui.quiz.correct === 5, app.__ui.quiz && app.__ui.quiz.correct);
  check("결과 화면", txt(ids.main).indexOf("100%") >= 0, txt(ids.main).slice(0, 40));

  /* --- 8. 저장 --- */
  check("서비스 워커 등록", !!(g.__sw && g.__sw.length === 1 && g.__sw[0].u === "./sw.js"), JSON.stringify(g.__sw || []));
  var raw = g.localStorage.getItem(D.storageKey);
  check("저장 키 분리", !!raw, D.storageKey);
  var parsed = raw ? JSON.parse(raw) : {};
  check("저장된 XP", parsed.xp > 0, parsed.xp);
  check("깨진 저장 복구", (function () {
    g.localStorage.setItem(D.storageKey, "{broken");
    var ok = true;
    try { g.KingApp.get(); } catch (e) { ok = false; }
    return ok;
  })());

  var failed = out.filter(function (r) { return !r.ok; });
  return JSON.stringify({ total: out.length, failed: failed.length, results: out });
})(typeof window !== "undefined" ? window : globalThis)
"""


def run(folder):
    files = [SHIM,
             os.path.join(HERE, folder, "js", "data.js")]
    ctx = quickjs.Context()
    for path in files:
        with open(path, encoding="utf-8") as f:
            try:
                ctx.eval(f.read())
            except Exception as e:  # noqa: BLE001
                print("EVAL FAIL:", folder, os.path.basename(path), e)
                return 1
    ctx.eval(STUB)
    with open(os.path.join(HERE, folder, "js", "app.js"), encoding="utf-8") as f:
        try:
            ctx.eval(f.read())
        except Exception as e:  # noqa: BLE001
            print("EVAL FAIL:", folder, "app.js", e)
            return 1
    try:
        result = json.loads(ctx.eval(TESTS))
    except Exception as e:  # noqa: BLE001
        print("TEST FAIL:", folder, e)
        return 1
    for r in result["results"]:
        mark = "PASS" if r["ok"] else "FAIL"
        print(f"[{folder}] [{mark}] {r['name']}" + (f"  ({r['extra']})" if r["extra"] else ""))
    print(f"[{folder}] {result['total'] - result['failed']}/{result['total']} passed\n")
    return 0 if result["failed"] == 0 else 1


def main():
    code = 0
    for folder in ("beginner", "hanja"):
        code |= run(folder)
    return code


if __name__ == "__main__":
    sys.exit(main())
