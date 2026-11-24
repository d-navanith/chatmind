"""Phase 0: you log in manually in the opened Chrome window; we only record
API call shapes (module names / params / sample responses) and save the session.
Passwords, 2FA codes and tokens are masked in the capture log.

Usage:  .venv\\Scripts\\python collector\\login_capture.py skgaming21 https://skgaming21.as6868.com/
Then log in, open LIVE CHAT, open a few chats, scroll, try any history/search/date
features. Close the browser window when done.
"""
import json, sys, time, urllib.parse
from pathlib import Path
from playwright.sync_api import sync_playwright

name, url = sys.argv[1], sys.argv[2]
DATA = Path(__file__).resolve().parent.parent / "data"
DATA.mkdir(exist_ok=True)
cap_file = DATA / f"capture_{name}.jsonl"
state_file = DATA / f"session_{name}.json"
MASK = {"password", "passcode2fa", "accessToken", "token"}


def on_response(resp):
    try:
        if "/api/v1/index.php" not in resp.url or resp.request.method != "POST":
            return
        params = dict(urllib.parse.parse_qsl(resp.request.post_data or ""))
        for k in MASK & params.keys():
            params[k] = "***"
        body = resp.text()
        rec = {"t": time.strftime("%H:%M:%S"), "module": params.get("module"),
               "params": params, "status": resp.status, "len": len(body),
               "body": body[:4000]}
        with cap_file.open("a", encoding="utf-8") as f:
            f.write(json.dumps(rec, ensure_ascii=False) + "\n")
        print(rec["t"], rec["module"], rec["len"], flush=True)
    except Exception as e:
        print("capture err", e, flush=True)


with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome", headless=False)
    ctx = browser.new_context()
    page = ctx.new_page()
    page.on("response", on_response)
    page.goto(url)
    print("Browser open. Log in, use LIVE CHAT, then close the window.", flush=True)
    last_save = 0
    try:
        while True:
            page.wait_for_timeout(2000)
            if time.time() - last_save > 10:
                ctx.storage_state(path=str(state_file))
                last_save = time.time()
    except Exception:
        pass
    print("Closed. Session saved to", state_file)
