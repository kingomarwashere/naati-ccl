// Shared auth + API helper for CCLingo app pages.
window.CCL = (function () {
  const TOKEN_KEY = 'ccl-token';
  let token = localStorage.getItem(TOKEN_KEY) || null;
  let user = null;

  const setToken = t => { token = t; if (t) localStorage.setItem(TOKEN_KEY, t); else localStorage.removeItem(TOKEN_KEY); };

  async function api(path, opts = {}) {
    const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
    if (token) headers['Authorization'] = 'Bearer ' + token;
    const res = await fetch(path, { ...opts, headers });
    let data = null;
    try { data = await res.json(); } catch {}
    if (!res.ok) throw Object.assign(new Error((data && data.error) || res.statusText), { status: res.status, data });
    return data;
  }

  async function loadUser() {
    if (!token) { user = null; return null; }
    try { const r = await api('/api/me'); user = r.user; return user; }
    catch { user = null; return null; }
  }

  async function signup(email, password) {
    const r = await api('/api/auth/signup', { method: 'POST', body: JSON.stringify({ email, password }) });
    setToken(r.token); user = r.user; return user;
  }
  async function login(email, password) {
    const r = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    setToken(r.token); user = r.user; return user;
  }
  async function logout() {
    try { await api('/api/auth/logout', { method: 'POST' }); } catch {}
    setToken(null); user = null;
  }

  // Auth modal — returns a promise that resolves with the user, or null if dismissed
  function openAuthModal(message) {
    return new Promise(resolve => {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:100;padding:16px;';
      wrap.innerHTML = `
        <div style="background:#fff;border-radius:20px;max-width:400px;width:100%;padding:28px;font-family:Inter,system-ui,sans-serif;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
            <h2 id="am-title" style="font-size:22px;font-weight:800;margin:0">Log in</h2>
            <button id="am-close" style="background:none;border:none;font-size:24px;color:#9ca3af;cursor:pointer;line-height:1">×</button>
          </div>
          <p id="am-msg" style="color:#6b7280;font-size:13px;margin:0 0 18px">${message || 'Save your progress and track your scores.'}</p>
          <input id="am-email" type="email" placeholder="Email" autocomplete="email"
            style="width:100%;box-sizing:border-box;border:1.5px solid #e5e7eb;border-radius:12px;padding:11px 14px;font-size:14px;margin-bottom:10px;outline:none">
          <input id="am-pass" type="password" placeholder="Password (min 6 chars)" autocomplete="current-password"
            style="width:100%;box-sizing:border-box;border:1.5px solid #e5e7eb;border-radius:12px;padding:11px 14px;font-size:14px;margin-bottom:6px;outline:none">
          <p id="am-err" style="color:#dc2626;font-size:12px;min-height:16px;margin:0 0 10px"></p>
          <button id="am-submit" style="width:100%;background:#059669;color:#fff;border:none;border-radius:12px;padding:13px;font-size:15px;font-weight:700;cursor:pointer">Log in</button>
          <p style="text-align:center;font-size:13px;color:#6b7280;margin:14px 0 0">
            <span id="am-toggle-text">New here?</span>
            <button id="am-toggle" style="background:none;border:none;color:#059669;font-weight:600;cursor:pointer;font-size:13px">Create an account</button>
          </p>
        </div>`;
      document.body.appendChild(wrap);
      let mode = 'login';
      const $ = id => wrap.querySelector('#' + id);
      const close = (result) => { wrap.remove(); resolve(result); };
      $('am-close').onclick = () => close(null);
      wrap.onclick = e => { if (e.target === wrap) close(null); };
      $('am-toggle').onclick = () => {
        mode = mode === 'login' ? 'signup' : 'login';
        $('am-title').textContent = mode === 'login' ? 'Log in' : 'Create account';
        $('am-submit').textContent = mode === 'login' ? 'Log in' : 'Create account';
        $('am-toggle-text').textContent = mode === 'login' ? 'New here?' : 'Already have an account?';
        $('am-toggle').textContent = mode === 'login' ? 'Create an account' : 'Log in';
        $('am-err').textContent = '';
      };
      $('am-submit').onclick = async () => {
        const email = $('am-email').value.trim(), pass = $('am-pass').value;
        $('am-err').textContent = '';
        $('am-submit').disabled = true;
        try {
          const u = mode === 'login' ? await login(email, pass) : await signup(email, pass);
          close(u);
        } catch (e) { $('am-err').textContent = e.message; $('am-submit').disabled = false; }
      };
      $('am-pass').addEventListener('keydown', e => { if (e.key === 'Enter') $('am-submit').click(); });
      setTimeout(() => $('am-email').focus(), 50);
    });
  }

  async function requireAuth(message) {
    if (user) return user;
    await loadUser();
    if (user) return user;
    return openAuthModal(message);
  }

  return {
    get token() { return token; },
    get user() { return user; },
    api, loadUser, signup, login, logout, openAuthModal, requireAuth,
  };
})();

// PWA: inject manifest + theme colour + register service worker
(function () {
  if (!document.querySelector('link[rel="manifest"]')) {
    const m = document.createElement('link'); m.rel = 'manifest'; m.href = '/manifest.webmanifest'; document.head.appendChild(m);
    const t = document.createElement('meta'); t.name = 'theme-color'; t.content = '#059669'; document.head.appendChild(t);
    const a = document.createElement('meta'); a.name = 'apple-mobile-web-app-capable'; a.content = 'yes'; document.head.appendChild(a);
  }
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
  }
})();
