// Paste into the DevTools Console (F12) of the logged-in skgaming21 tab.
// Records API call shapes + response samples. Masks password/2FA/token.
// Then use LIVE CHAT, and run:  downloadCap()
(function () {
  window.__cap = window.__cap || [];
  const MASK = ['password', 'passcode2fa', 'accessToken', 'token'];
  const O = XMLHttpRequest.prototype.open, S = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (m, u) { this.__u = u; this.__m = m; return O.apply(this, arguments); };
  XMLHttpRequest.prototype.send = function (body) {
    if (this.__u && this.__u.indexOf('/api/v1/index.php') >= 0) {
      let p = {};
      try {
        if (typeof body === 'string') p = Object.fromEntries(new URLSearchParams(body));
        else if (body && body.forEach) body.forEach((v, k) => { p[k] = (v && v.name) ? '[file ' + v.name + ']' : v; });
      } catch (e) {}
      MASK.forEach(k => { if (k in p) p[k] = '***'; });
      this.addEventListener('load', () => {
        window.__cap.push({ t: new Date().toISOString(), module: p.module, params: p,
          len: (this.responseText || '').length, body: (this.responseText || '').slice(0, 4000) });
      });
    }
    return S.apply(this, arguments);
  };
  window.downloadCap = function () {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(window.__cap, null, 1)], { type: 'application/json' }));
    a.download = 'capture_skgaming21.json'; a.click();
    console.log('saved', window.__cap.length, 'calls');
  };
  console.log('Capture ON. Use LIVE CHAT now, then run downloadCap()');
})();
