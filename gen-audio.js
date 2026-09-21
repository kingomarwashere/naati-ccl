// ElevenLabs audio generator for CCLingo (NAATI CCL practice).
//
// Renders one MP3 per dialogue segment into public/audio/<lang>/<topic>/<id>.mp3.
// Design goals:
//   • Native-sounding, non-robotic delivery (multilingual_v2 + tuned settings).
//   • Voice GENDER matches the intended speaker gender (see GENDER map).
//   • The two parties in a dialogue always sound like distinct people.
//   • Idempotent + resumable: existing files are skipped unless FORCE=1, so it
//     can run in slices that fit the ElevenLabs monthly character quota.
//
// Usage:
//   ELEVENLABS_API_KEY=... node gen-audio.js [--langs zh,hi] [--dialogues health-gp] [--force] [--dry]
//
// The key is read from the environment. Load it first, e.g.:
//   set -a; . ~/.config/secrets.env; set +a
const fs = require('fs');
const path = require('path');
const { LANGUAGES, AVAILABLE, MASTER, buildDialogue } = require('./data.js');

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) { console.error('Missing ELEVENLABS_API_KEY in env.'); process.exit(1); }

const argv = process.argv.slice(2);
const getArg = (name) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : null; };
const FORCE = argv.includes('--force') || process.env.FORCE === '1';
const DRY = argv.includes('--dry');
const onlyLangs = (getArg('--langs') || '').split(',').filter(Boolean);
const onlyDialogues = (getArg('--dialogues') || '').split(',').filter(Boolean);

const MODEL = 'eleven_multilingual_v2';
// Natural-delivery settings: a touch of variability (lower stability) reads less
// robotic; high similarity keeps the chosen voice's identity; speaker boost adds
// presence. style kept low so it stays conversational, not performed.
const SETTINGS = { stability: 0.42, similarity_boost: 0.85, style: 0.15, use_speaker_boost: true };

// ── voices ──────────────────────────────────────────────────
// English (Australian) professional side — shared across every language.
const EN_VOICE = {
  m: 'IKne3meq5aSn9XLyUdCD',    // Charlie — Australian male (default)
  f: 'M7ya1YbaeFaPXljg9BpK',    // Hannah — Natural Australian female (added)
};
// Target-language (client) side. Native voices where added; otherwise the
// multilingual model falls back to a versatile default that speaks the language.
// Add more native voices to the account and map them here to lift quality.
const DEFAULT_LOTE = { m: 'IKne3meq5aSn9XLyUdCD', f: 'EXAVITQu4vr4xnSDxMaL' }; // Charlie / Sarah
const LOTE_VOICE = {
  zh: { m: '76X7rrvQajZEHM3u9zcd', f: 'SyNyPD84lTuHqi1HONfV' }, // Mr David / Willow (native)
  // yue, pa, hi, ne, vi, ar, ko, ta, fa, th → DEFAULT_LOTE until native voices added
};
const loteVoice = (lang, g) => (LOTE_VOICE[lang] || DEFAULT_LOTE)[g] || DEFAULT_LOTE[g];

// ── gender map ──────────────────────────────────────────────
// Per dialogue, gender for each speaker. Honors explicit cues in the script
// (insurance client "Mr" → m; consumer client "Ms" → f; school parent "Mrs" → f);
// the rest are assigned for a balanced mix. Same speaker = same gender throughout.
const GENDER = {
  'health-gp':            { Receptionist: 'f', Doctor: 'm', Patient: 'f' },
  'employment-interview': { 'HR Manager': 'f', 'Job Seeker': 'm' },
  'community-centrelink': { 'Centrelink Officer': 'm', Client: 'f' },
  'housing-tenancy':      { 'Tenancy Advisor': 'f', Tenant: 'm' },
  'education-school':     { Teacher: 'f', Parent: 'f' },        // Ms/Mrs + "she"
  'banking-loan':         { 'Lending Officer': 'm', Client: 'f' },
  'legal-police':         { Solicitor: 'f', Client: 'm' },
  'immigration-visa':     { 'Migration Agent': 'm', Client: 'f' },
  'insurance-claim':      { 'Insurance Officer': 'f', Client: 'm' },  // "Mr" → client m
  'consumer-complaint':   { 'Store Manager': 'm', Client: 'f' },      // "Ms" → client f
};
const genderFor = (dialogueId, speaker) => (GENDER[dialogueId] || {})[speaker] || 'f';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function tts(text, voiceId) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, model_id: MODEL, voice_settings: SETTINGS }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ElevenLabs ${res.status}: ${body.slice(0, 200)}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const langs = (onlyLangs.length ? onlyLangs : AVAILABLE).filter(l => AVAILABLE.includes(l));
  let planned = 0, rendered = 0, skipped = 0, chars = 0;

  for (const dia of MASTER) {
    if (onlyDialogues.length && !onlyDialogues.includes(dia.id)) continue;

    // English (odd) segments are shared — render once into /en.
    for (const lang of ['en', ...langs]) {
      const isEn = lang === 'en';
      const built = buildDialogue(dia, isEn ? AVAILABLE[0] : lang);
      for (const seg of built.segments) {
        const segIsEn = seg.lang === 'en-AU';
        if (isEn ? !segIsEn : segIsEn) continue;           // en pass → en segs; lote pass → lote segs
        const text = (seg.text || '').trim();
        if (!text) continue;

        const dir = path.join(__dirname, 'public', 'audio', lang, dia.id);
        const file = path.join(dir, `${seg.id}.mp3`);
        planned++;
        if (!FORCE && fs.existsSync(file)) { skipped++; continue; }

        const g = genderFor(dia.id, seg.speaker);
        const voiceId = isEn ? EN_VOICE[g] : loteVoice(lang, g);
        chars += text.length;

        if (DRY) { console.log(`[dry] ${lang}/${dia.id}/${seg.id} ${seg.speaker}(${g}) ${text.length}c`); continue; }

        fs.mkdirSync(dir, { recursive: true });
        try {
          const buf = await tts(text, voiceId);
          fs.writeFileSync(file, buf);
          rendered++;
          console.log(`✓ ${lang}/${dia.id}/${seg.id} ${seg.speaker}(${g}) ${text.length}c`);
          await sleep(250); // gentle pacing
        } catch (e) {
          console.error(`✗ ${lang}/${dia.id}/${seg.id}: ${e.message}`);
          if (String(e.message).includes('quota') || String(e.message).includes('401') || String(e.message).includes('429')) {
            console.error('Stopping (quota/auth). Re-run later to resume — existing files are skipped.');
            return report();
          }
        }
      }
    }
  }
  report();
  function report() {
    console.log(`\n${DRY ? 'DRY RUN — ' : ''}planned=${planned} rendered=${rendered} skipped(existing)=${skipped} chars${DRY ? '(would use)' : '(used)'}=${chars}`);
  }
}
main();
