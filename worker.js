import { LANGUAGES, AVAILABLE, MASTER, buildSegment, buildDialogue } from './data.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
const json = (obj, status = 200) => new Response(JSON.stringify(obj), {
  status, headers: { 'Content-Type': 'application/json', ...CORS },
});
const now = () => Date.now();
const uuid = () => crypto.randomUUID();
const FREE_DAILY_LIMIT = 3;

// ── password hashing (PBKDF2) ──────────────────────────────
async function hashPassword(password, saltHex) {
  const salt = saltHex ? hexToBytes(saltHex) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256);
  return `${bytesToHex(salt)}$${bytesToHex(new Uint8Array(bits))}`;
}
async function verifyPassword(password, stored) {
  const [saltHex] = stored.split('$');
  const check = await hashPassword(password, saltHex);
  return check === stored;
}
const bytesToHex = b => [...b].map(x => x.toString(16).padStart(2, '0')).join('');
const hexToBytes = h => new Uint8Array(h.match(/.{2}/g).map(x => parseInt(x, 16)));

// ── session ────────────────────────────────────────────────
async function getUser(request, env) {
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  const row = await env.DB.prepare(
    `SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ? AND s.expires_at > ?`
  ).bind(token, now()).first();
  return row || null;
}
function publicUser(u) {
  const isPro = u.plan === 'pro' && (!u.plan_expires || u.plan_expires > now());
  return { id: u.id, email: u.email, plan: isPro ? 'pro' : 'free', planExpires: u.plan_expires };
}
async function createSession(env, userId) {
  const token = uuid() + uuid().replace(/-/g, '');
  const ttl = 90 * 24 * 3600 * 1000;
  await env.DB.prepare(`INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?,?,?,?)`)
    .bind(token, userId, now(), now() + ttl).run();
  return token;
}
const today = () => new Date().toISOString().slice(0, 10);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const p = url.pathname;
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });

    try {
      // ── content ─────────────────────────────────────────
      if (p === '/api/languages') {
        return json(AVAILABLE.map(k => ({ key: k, ...LANGUAGES[k] })));
      }
      if (p === '/api/dialogues') {
        return json(MASTER.map(d => ({
          id: d.id, topic: d.topic, title: d.title, scenario: d.scenario,
          segmentCount: d.segments.length, scoredCount: d.segments.filter(s => s.marked).length,
        })));
      }
      const dm = p.match(/^\/api\/dialogue\/(.+)$/);
      if (dm) {
        const lang = url.searchParams.get('lang') || 'zh';
        const d = MASTER.find(x => x.id === dm[1]);
        if (!d) return json({ error: 'Not found' }, 404);
        if (!AVAILABLE.includes(lang)) return json({ error: 'Language not available' }, 404);
        return json(buildDialogue(d, lang));
      }

      // ── auth ────────────────────────────────────────────
      if (p === '/api/auth/signup' && request.method === 'POST') {
        const { email, password } = await request.json();
        if (!email || !password || password.length < 6)
          return json({ error: 'Email and a password of at least 6 characters are required.' }, 400);
        const existing = await env.DB.prepare(`SELECT id FROM users WHERE email = ?`).bind(email.toLowerCase()).first();
        if (existing) return json({ error: 'An account with that email already exists. Try logging in.' }, 409);
        const id = uuid();
        const hash = await hashPassword(password);
        await env.DB.prepare(`INSERT INTO users (id, email, password_hash, created_at, plan) VALUES (?,?,?,?, 'free')`)
          .bind(id, email.toLowerCase(), hash, now()).run();
        const token = await createSession(env, id);
        return json({ token, user: publicUser({ id, email: email.toLowerCase(), plan: 'free' }) });
      }
      if (p === '/api/auth/login' && request.method === 'POST') {
        const { email, password } = await request.json();
        const u = await env.DB.prepare(`SELECT * FROM users WHERE email = ?`).bind((email || '').toLowerCase()).first();
        if (!u || !(await verifyPassword(password || '', u.password_hash)))
          return json({ error: 'Incorrect email or password.' }, 401);
        const token = await createSession(env, u.id);
        return json({ token, user: publicUser(u) });
      }
      if (p === '/api/auth/logout' && request.method === 'POST') {
        const auth = request.headers.get('Authorization');
        if (auth?.startsWith('Bearer ')) await env.DB.prepare(`DELETE FROM sessions WHERE token = ?`).bind(auth.slice(7)).run();
        return json({ ok: true });
      }
      if (p === '/api/me') {
        const u = await getUser(request, env);
        return json({ user: u ? publicUser(u) : null });
      }

      // ── entitlement check ───────────────────────────────
      if (p === '/api/practice/check' && request.method === 'POST') {
        const u = await getUser(request, env);
        if (!u) return json({ allowed: true, anon: true });
        const pu = publicUser(u);
        if (pu.plan === 'pro') return json({ allowed: true, plan: 'pro', remaining: -1 });
        const row = await env.DB.prepare(`SELECT count FROM usage WHERE user_id = ? AND day = ?`).bind(u.id, today()).first();
        const used = row?.count || 0;
        const remaining = Math.max(0, FREE_DAILY_LIMIT - used);
        return json({ allowed: remaining > 0, plan: 'free', remaining, limit: FREE_DAILY_LIMIT });
      }

      // ── scoring ─────────────────────────────────────────
      if (p === '/api/score' && request.method === 'POST') {
        const { dialogueId, segmentId, transcript, lang } = await request.json();
        if (!transcript || !transcript.trim()) return json({ error: 'No transcript' }, 400);
        const langKey = AVAILABLE.includes(lang) ? lang : 'zh';
        const d = MASTER.find(x => x.id === dialogueId);
        const segMaster = d && d.segments.find(s => s.id === segmentId);
        if (!segMaster) return json({ error: 'Not found' }, 404);
        const seg = buildSegment(dialogueId, segMaster, langKey);
        if (!env.DEEPSEEK_API_KEY)
          return json({ score: 4, passed: true, feedback: 'Demo mode.', corrections: [], keyPointsCovered: [] });
        const resp = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: 'deepseek-chat', max_tokens: 600,
            messages: [{ role: 'user', content: scorePrompt(seg, transcript, LANGUAGES[langKey].label) }] }),
        });
        const ai = await resp.json();
        if (ai.error) return json({ error: ai.error.message }, 502);
        let raw = ai.choices?.[0]?.message?.content ?? '{}';
        const jm = raw.match(/\{[\s\S]*\}/);
        if (!jm) return json({ error: 'Bad AI response' }, 502);
        const result = JSON.parse(jm[0]);
        result.score = Math.max(0, Math.min(5, result.score ?? 0));
        result.passed = result.score >= 3;
        return json(result);
      }

      // ── save a completed attempt ────────────────────────
      if (p === '/api/attempt' && request.method === 'POST') {
        const u = await getUser(request, env);
        if (!u) return json({ error: 'Sign in to save your progress.' }, 401);
        const { dialogueId, topic, lang, mode, segments, totalScore, maxScore, passed, missedVocab } = await request.json();
        const attemptId = uuid();
        await env.DB.prepare(
          `INSERT INTO attempts (id,user_id,dialogue_id,topic,lang,mode,total_score,max_score,passed,created_at)
           VALUES (?,?,?,?,?,?,?,?,?,?)`
        ).bind(attemptId, u.id, dialogueId, topic || '', lang || 'zh', mode || 'practice',
          totalScore | 0, maxScore | 0, passed ? 1 : 0, now()).run();

        const stmts = [];
        for (const s of (segments || [])) {
          stmts.push(env.DB.prepare(
            `INSERT INTO segment_scores (attempt_id,user_id,dialogue_id,topic,segment_id,score,created_at) VALUES (?,?,?,?,?,?,?)`
          ).bind(attemptId, u.id, dialogueId, topic || '', s.segmentId | 0, s.score | 0, now()));
        }
        for (const v of (missedVocab || [])) {
          stmts.push(env.DB.prepare(
            `INSERT INTO vocab (id,user_id,term_en,term_target,lang,topic,box,due_at,created_at) VALUES (?,?,?,?,?,?,0,?,?)`
          ).bind(uuid(), u.id, v.en || '', v.target || '', lang || 'zh', topic || '', now(), now()));
        }
        stmts.push(env.DB.prepare(
          `INSERT INTO usage (user_id, day, count) VALUES (?,?,1)
           ON CONFLICT(user_id, day) DO UPDATE SET count = count + 1`
        ).bind(u.id, today()));
        if (stmts.length) await env.DB.batch(stmts);
        return json({ ok: true, attemptId });
      }

      // ── progress dashboard ──────────────────────────────
      if (p === '/api/progress') {
        const u = await getUser(request, env);
        if (!u) return json({ error: 'Not signed in' }, 401);
        const attempts = await env.DB.prepare(
          `SELECT dialogue_id,topic,lang,mode,total_score,max_score,passed,created_at
           FROM attempts WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`
        ).bind(u.id).all();
        const byTopic = await env.DB.prepare(
          `SELECT topic, AVG(CAST(score AS FLOAT)) avg_score, COUNT(*) n
           FROM segment_scores WHERE user_id = ? GROUP BY topic`
        ).bind(u.id).all();
        const agg = await env.DB.prepare(
          `SELECT COUNT(*) total, SUM(passed) passes, AVG(CAST(total_score AS FLOAT)) avg_total
           FROM attempts WHERE user_id = ?`
        ).bind(u.id).first();
        const topics = (byTopic.results || []).map(t => ({ topic: t.topic, avg: Math.round(t.avg_score * 10) / 10, n: t.n }));
        const weakest = topics.length ? topics.slice().sort((a, b) => a.avg - b.avg)[0] : null;
        return json({
          totalAttempts: agg?.total || 0,
          passes: agg?.passes || 0,
          avgTotal: agg?.avg_total ? Math.round(agg.avg_total * 10) / 10 : 0,
          topics, weakest, recent: attempts.results || [],
        });
      }

      // ── vocabulary ──────────────────────────────────────
      if (p === '/api/vocab' && request.method === 'GET') {
        const u = await getUser(request, env);
        if (!u) return json({ error: 'Not signed in' }, 401);
        const due = await env.DB.prepare(
          `SELECT id,term_en,term_target,lang,topic,box FROM vocab WHERE user_id = ? AND due_at <= ? ORDER BY due_at LIMIT 40`
        ).bind(u.id, now()).all();
        const totalRow = await env.DB.prepare(`SELECT COUNT(*) n FROM vocab WHERE user_id = ?`).bind(u.id).first();
        return json({ due: due.results || [], total: totalRow?.n || 0 });
      }
      if (p === '/api/vocab/review' && request.method === 'POST') {
        const u = await getUser(request, env);
        if (!u) return json({ error: 'Not signed in' }, 401);
        const { id, correct } = await request.json();
        const card = await env.DB.prepare(`SELECT box FROM vocab WHERE id = ? AND user_id = ?`).bind(id, u.id).first();
        if (!card) return json({ error: 'Not found' }, 404);
        const box = correct ? Math.min(5, (card.box || 0) + 1) : 0;
        const intervals = [0, 1, 2, 4, 7, 15];
        const due = now() + intervals[box] * 24 * 3600 * 1000;
        await env.DB.prepare(`UPDATE vocab SET box = ?, due_at = ? WHERE id = ? AND user_id = ?`).bind(box, due, id, u.id).run();
        return json({ ok: true });
      }

      // ── Stripe ──────────────────────────────────────────
      if (p === '/api/checkout' && request.method === 'POST') {
        const u = await getUser(request, env);
        if (!u) return json({ error: 'Sign in first' }, 401);
        if (!env.STRIPE_SECRET_KEY) return json({ error: 'Payments not configured yet.' }, 503);
        const { priceId } = await request.json();
        const form = new URLSearchParams();
        form.set('mode', 'payment');
        form.set('success_url', 'https://naati.theradicalparty.com/app/?upgraded=1');
        form.set('cancel_url', 'https://naati.theradicalparty.com/pricing');
        form.set('client_reference_id', u.id);
        form.set('customer_email', u.email);
        form.set('line_items[0][price]', priceId || env.STRIPE_PRICE_PRO);
        form.set('line_items[0][quantity]', '1');
        form.set('metadata[user_id]', u.id);
        const r = await fetch('https://api.stripe.com/v1/checkout/sessions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded' },
          body: form,
        });
        const sess = await r.json();
        if (sess.error) return json({ error: sess.error.message }, 502);
        return json({ url: sess.url });
      }
      if (p === '/api/stripe/webhook' && request.method === 'POST') {
        const body = await request.text();
        // verify Stripe signature
        if (env.STRIPE_WEBHOOK_SECRET) {
          const sig = request.headers.get('stripe-signature') || '';
          const ok = await verifyStripeSig(body, sig, env.STRIPE_WEBHOOK_SECRET);
          if (!ok) return json({ error: 'Invalid signature' }, 400);
        }
        let event;
        try { event = JSON.parse(body); } catch { return json({ error: 'bad' }, 400); }
        if (event.type === 'checkout.session.completed') {
          const s = event.data.object;
          const userId = s.client_reference_id || s.metadata?.user_id;
          if (userId) {
            await env.DB.prepare(`UPDATE users SET plan = 'pro', stripe_customer = ? WHERE id = ?`)
              .bind(s.customer || null, userId).run();
          }
        }
        return json({ received: true });
      }

      return env.ASSETS.fetch(request);
    } catch (e) {
      return json({ error: e.message }, 500);
    }
  },
};

// Verify Stripe webhook signature (HMAC-SHA256 over "timestamp.payload")
async function verifyStripeSig(payload, header, secret) {
  try {
    const parts = Object.fromEntries(header.split(',').map(kv => kv.split('=')));
    const t = parts.t, v1 = parts.v1;
    if (!t || !v1) return false;
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${t}.${payload}`));
    const expected = [...new Uint8Array(mac)].map(b => b.toString(16).padStart(2, '0')).join('');
    // constant-time-ish compare
    if (expected.length !== v1.length) return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ v1.charCodeAt(i);
    return diff === 0;
  } catch { return false; }
}

function scorePrompt(seg, transcript, langLabel) {
  const enToTarget = seg.lang === 'en-AU';
  const direction = enToTarget ? `English → ${langLabel}` : `${langLabel} → English`;
  const targetLang = enToTarget ? langLabel : 'English';
  return `You are a NAATI CCL examiner assessing an interpretation attempt.

Direction: ${direction}
Source (what was spoken):
"${seg.text}"

Candidate's interpretation (into ${targetLang}):
"${transcript}"

Model interpretation for reference:
"${seg.modelAnswer}"

Key information to transfer: ${seg.keyPoints.join(' | ')}

NAATI CCL 0–5 marking scale:
5 — All key information conveyed accurately and naturally
4 — Most conveyed; one minor omission or inaccuracy
3 — Partially conveyed; some omissions but core meaning understood
2 — Limited; significant omissions or errors affecting meaning
1 — Very little correct; largely unclear
0 — Nothing meaningful

Respond with ONLY raw JSON (no markdown, no code fences):
{
  "score": <integer 0-5>,
  "passed": <boolean, true if score >= 3>,
  "feedback": "<2 sentences, specific and actionable>",
  "corrections": [ { "said": "<candidate>", "better": "<improved>", "why": "<brief>" } ],
  "keyPointsCovered": [ { "point": "<key point>", "covered": <boolean> } ]
}`;
}
