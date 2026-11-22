/* 테스트용 아주 작은 DOM 구현.
 * 실제 브라우저 대신 quickjs에서 앱의 화면·수업 흐름을 실행해 보기 위한 것입니다.
 * 앱 배포에는 쓰이지 않습니다.
 */
(function (g) {
  "use strict";

  var ids = {};

  function makeNode(tag) {
    var node = {
      tagName: String(tag || "div").toUpperCase(),
      className: "",
      _attrs: {},
      _html: "",
      children: [],
      parentNode: null,
      listeners: {},
      disabled: false,
      scrollTop: 0,
      style: { setProperty: function () {} }
    };

    node.classList = {
      add: function (c) {
        var arr = node.className.split(/\s+/).filter(Boolean);
        if (arr.indexOf(c) < 0) arr.push(c);
        node.className = arr.join(" ");
      },
      remove: function (c) {
        node.className = node.className.split(/\s+/).filter(function (x) { return x && x !== c; }).join(" ");
      },
      contains: function (c) {
        return node.className.split(/\s+/).indexOf(c) >= 0;
      },
      toggle: function (c, force) {
        var has = node.classList.contains(c);
        var want = typeof force === "boolean" ? force : !has;
        if (want) node.classList.add(c); else node.classList.remove(c);
        return want;
      }
    };

    Object.defineProperty(node, "firstChild", {
      get: function () { return node.children.length ? node.children[0] : null; }
    });

    Object.defineProperty(node, "textContent", {
      get: function () {
        return node.children.map(function (c) {
          return typeof c._text !== "undefined" ? c._text : c.textContent;
        }).join("");
      },
      set: function (v) {
        node.children = [{ _text: String(v), parentNode: node }];
      }
    });

    Object.defineProperty(node, "innerHTML", {
      get: function () { return node._html; },
      set: function (v) {
        node._html = String(v);
        node.children = [];
      }
    });

    node.appendChild = function (child) {
      if (!child) return child;
      if (child.parentNode) child.parentNode.removeChild(child);
      child.parentNode = node;
      node.children.push(child);
      return child;
    };

    node.removeChild = function (child) {
      var i = node.children.indexOf(child);
      if (i >= 0) {
        node.children.splice(i, 1);
        child.parentNode = null;
      }
      return child;
    };

    node.setAttribute = function (k, v) {
      node._attrs[k] = String(v);
      if (k === "class") node.className = String(v);
      if (k === "disabled") node.disabled = true;
      if (k === "style") node._style = String(v);
    };

    node.getAttribute = function (k) {
      return typeof node._attrs[k] === "undefined" ? null : node._attrs[k];
    };

    node.removeAttribute = function (k) {
      delete node._attrs[k];
      if (k === "disabled") node.disabled = false;
    };

    node.addEventListener = function (ev, fn) {
      node.listeners[ev] = node.listeners[ev] || [];
      node.listeners[ev].push(fn);
    };

    node.dispatch = function (ev, extra) {
      var e = Object.assign({
        type: ev,
        target: node,
        preventDefault: function () {},
        stopPropagation: function () {}
      }, extra || {});
      (node.listeners[ev] || []).slice().forEach(function (fn) { fn(e); });
    };

    node.click = function () {
      if (node.disabled) return;
      node.dispatch("click");
    };

    node.scrollIntoView = function () {};
    node.scrollTo = function () {};
    node.focus = function () {};
    node.remove = function () { if (node.parentNode) node.parentNode.removeChild(node); };
    return node;
  }

  var doc = {
    readyState: "complete",
    createElement: function (t) { return makeNode(t); },
    createTextNode: function (t) { return { _text: String(t), parentNode: null }; },
    getElementById: function (id) { return ids[id] || null; },
    body: makeNode("body"),
    addEventListener: function () {}
  };

  ["topbar", "main", "tabbar", "modal", "toast", "confetti"].forEach(function (id) {
    ids[id] = makeNode("div");
  });

  var memory = {};
  g.localStorage = {
    getItem: function (k) {
      return Object.prototype.hasOwnProperty.call(memory, k) ? memory[k] : null;
    },
    setItem: function (k, v) { memory[k] = String(v); },
    removeItem: function (k) { delete memory[k]; }
  };

  g.document = doc;
  g.__ids = ids;
})(typeof window !== "undefined" ? window : globalThis);
