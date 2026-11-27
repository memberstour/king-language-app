#!/usr/bin/env python3
"""킹링고 자체 점검 실행기 — 파일을 quickjs에 올려 화면·수업 흐름을 검사합니다."""
import json
import os
import sys

import quickjs

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILES = [
    "tools/domshim.js",
    "js/data.js",
    "js/core.js",
    "js/store.js",
    "js/bank.js",
    "js/readers.js",
    "js/app.js",
    "tools/selftest.js",
]


def main():
    ctx = quickjs.Context()
    for rel in FILES:
        path = os.path.join(HERE, rel)
        with open(path, encoding="utf-8") as f:
            try:
                ctx.eval(f.read())
            except Exception as e:  # noqa: BLE001
                print("EVAL FAIL:", rel, e)
                return 1
    out = json.loads(ctx.eval("__run()"))
    for r in out["results"]:
        mark = "PASS" if r["ok"] else "FAIL"
        print(f"[{mark}] {r['name']}" + (f"  ({r['extra']})" if r["extra"] else ""))
    print(f"\n{out['total'] - out['failed']}/{out['total']} passed")
    return 0 if out["failed"] == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
