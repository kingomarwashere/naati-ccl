// SEO page generator for CCLingo.
// Regenerates the per-language landing pages, the /ccl-practice/ hub and
// sitemap.xml from a single source of truth. Run: node gen-seo.js
//
// Every page ships with canonical + hreflang, full Open Graph + Twitter cards,
// and JSON-LD (Course + BreadcrumbList + FAQPage) so it is eligible for rich
// results. Keeping this data-driven means adding a language is a one-line edit.
const fs = require('fs');
const path = require('path');

const ORIGIN = 'https://naati.theradicalparty.com';
const TODAY = new Date().toISOString().slice(0, 10);

// slug → display data. `code` = BCP-47 for the interpreted language, used only
// in copy; the pages themselves are English so hreflang stays en-AU.
const LANGS = [
  { slug: 'mandarin',   label: 'Mandarin',   native: '普通话',      appLang: 'zh',  flag: '🇨🇳', speakers: 'the largest CCL cohort in Australia' },
  { slug: 'cantonese',  label: 'Cantonese',  native: '廣東話',      appLang: 'yue', flag: '🇭🇰', speakers: 'Hong Kong and southern-Chinese communities' },
  { slug: 'punjabi',    label: 'Punjabi',    native: 'ਪੰਜਾਬੀ',     appLang: 'pa',  flag: '🇮🇳', speakers: 'one of Australia’s fastest-growing migrant languages' },
  { slug: 'hindi',      label: 'Hindi',      native: 'हिन्दी',      appLang: 'hi',  flag: '🇮🇳', speakers: 'a top-5 CCL language for skilled migration' },
  { slug: 'nepali',     label: 'Nepali',     native: 'नेपाली',      appLang: 'ne',  flag: '🇳🇵', speakers: 'a booming cohort of students and skilled migrants' },
  { slug: 'vietnamese', label: 'Vietnamese', native: 'Tiếng Việt',  appLang: 'vi',  flag: '🇻🇳', speakers: 'one of Australia’s most established communities' },
  { slug: 'arabic',     label: 'Arabic',     native: 'العربية',     appLang: 'ar',  flag: '🇸🇦', speakers: 'speakers across many countries of origin' },
  { slug: 'korean',     label: 'Korean',     native: '한국어',       appLang: 'ko',  flag: '🇰🇷', speakers: 'students and skilled workers seeking PR' },
  { slug: 'tamil',      label: 'Tamil',      native: 'தமிழ்',       appLang: 'ta',  flag: '🇮🇳', speakers: 'Indian and Sri Lankan communities' },
  { slug: 'persian',    label: 'Persian',    native: 'فارسی',       appLang: 'fa',  flag: '🇮🇷', speakers: 'Persian/Farsi and Dari speakers' },
  { slug: 'thai',       label: 'Thai',       native: 'ภาษาไทย',     appLang: 'th',  flag: '🇹🇭', speakers: 'a growing community across Australia' },
];

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Per-language FAQ — rendered visibly AND as FAQPage JSON-LD (must match).
function faqFor(L) {
  return [
    {
      q: `Is the NAATI CCL ${L.label} practice test free?`,
      a: `Yes. You can start practising ${L.label} CCL dialogues for free with no credit card. Free accounts get daily practice dialogues and AI scoring; a one-time Pro pass unlocks unlimited dialogues, full mock exams and progress tracking.`,
    },
    {
      q: `How is the NAATI CCL ${L.label} test scored?`,
      a: `The CCL test uses two dialogues of about 300 words each, split into segments you interpret between English and ${L.label}. Each segment is marked on a 0–5 scale. You need 29 out of 45 (about 63%) across both dialogues to pass. Our AI scores every segment against the official criteria so you always know where you stand.`,
    },
    {
      q: `How many points is the NAATI CCL ${L.label} test worth for Australian PR?`,
      a: `Passing the CCL test earns 5 bonus points toward the points-tested skilled migration visas — subclasses 189, 190 and 491 — under Australia's SkillSelect system.`,
    },
    {
      q: `How long does it take to prepare for the ${L.label} CCL test?`,
      a: `Most candidates practise for 4–6 weeks. We recommend at least 30 practice dialogues and 3–5 full mock exams before your exam date. The study plan adapts to how much time you have left.`,
    },
  ];
}

const otherLangLinks = current => LANGS.filter(L => L.slug !== current)
  .map(L => `<a href="/ccl-practice/${L.slug}/" class="inline-flex items-center gap-1.5 bg-gray-50 hover:bg-brand-50 border border-gray-200 hover:border-brand-300 rounded-lg px-3 py-1.5 text-sm transition-colors">${L.flag} ${L.label}</a>`)
  .join('');

function langPage(L) {
  const url = `${ORIGIN}/ccl-practice/${L.slug}/`;
  const faq = faqFor(L);
  const title = `NAATI CCL ${L.label} Practice Test 2026 | Free Online Preparation`;
  const desc = `Free NAATI CCL ${L.label} practice tests with real interpreting dialogues and instant AI scoring. Prepare for the ${L.label} (${L.native}) CCL exam and earn 5 points toward Australian PR — mock exams, vocabulary and progress tracking.`;

  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Course',
        name: `NAATI CCL ${L.label} Practice Test`,
        description: `Online NAATI CCL ${L.label} interpreting practice with realistic dialogues, full mock exams and instant AI scoring against the official 0–5 marking criteria.`,
        provider: { '@type': 'Organization', name: 'CCLingo', url: ORIGIN },
        inLanguage: 'en',
        teaches: `NAATI CCL ${L.label} interpreting`,
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', category: 'Free', price: '0', priceCurrency: 'AUD', availability: 'https://schema.org/InStock', url: `/app/practice/?lang=${L.appLang}` },
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          courseWorkload: 'PT4H',
          instructor: { '@type': 'Organization', name: 'CCLingo' },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name: 'CCL Practice Tests', item: `${ORIGIN}/ccl-practice/` },
          { '@type': 'ListItem', position: 3, name: `${L.label}`, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faq.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  const faqHtml = faq.map(f => `
<details class="group border border-gray-200 rounded-xl px-5 py-4">
<summary class="flex items-center justify-between cursor-pointer font-semibold list-none">${esc(f.q)}<span class="text-brand-500 group-open:rotate-45 transition-transform text-xl leading-none">+</span></summary>
<p class="text-sm text-gray-500 leading-relaxed mt-3">${esc(f.a)}</p>
</details>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="en-au" href="${url}">
<link rel="alternate" hreflang="x-default" href="${url}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#059669">
<meta property="og:type" content="website">
<meta property="og:site_name" content="CCLingo">
<meta property="og:locale" content="en_AU">
<meta property="og:title" content="${esc(`NAATI CCL ${L.label} Practice Test — Free Online`)}">
<meta property="og:description" content="${esc(`Practice ${L.label} CCL dialogues with instant AI scoring. Earn 5 points toward Australian PR — free to start.`)}">
<meta property="og:image" content="${ORIGIN}/og.png">
<meta property="og:image:alt" content="${esc(`NAATI CCL ${L.label} practice test`)}">
<meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(`NAATI CCL ${L.label} Practice Test — Free Online`)}">
<meta name="twitter:description" content="${esc(`Practice ${L.label} CCL dialogues with AI scoring. Earn 5 points toward Australian PR.`)}">
<meta name="twitter:image" content="${ORIGIN}/og.png">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<script src="https://cdn.tailwindcss.com"></script>
<script>tailwind.config={theme:{extend:{colors:{brand:{50:'#ecfdf5',100:'#d1fae5',300:'#6ee7b7',400:'#34d399',500:'#10b981',600:'#059669',700:'#047857',900:'#064e3b'}},fontFamily:{sans:['Inter','system-ui','sans-serif']}}}}</script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body class="font-sans bg-white text-gray-900 antialiased">
<nav class="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100"><div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between"><a href="/" class="font-bold text-xl text-brand-700 tracking-tight">CCLingo</a><a href="/app/practice/?lang=${L.appLang}" class="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">Practice ${L.label} free</a></div></nav>

<nav aria-label="Breadcrumb" class="max-w-3xl mx-auto px-4 pt-5 text-xs text-gray-400"><a href="/" class="hover:text-brand-600">Home</a> › <a href="/ccl-practice/" class="hover:text-brand-600">CCL Practice Tests</a> › <span class="text-gray-600">${L.label}</span></nav>

<header class="bg-gradient-to-b from-brand-50 to-white pt-10 pb-16 px-4 text-center"><div class="max-w-3xl mx-auto"><div class="text-5xl mb-4">${L.flag}</div>
<h1 class="text-4xl md:text-5xl font-extrabold mb-5">NAATI CCL ${L.label} Practice Test</h1>
<p class="text-lg text-gray-500 mb-8">Free online NAATI CCL ${L.label} (${L.native}) practice with realistic interpreting dialogues and instant AI scoring. Prepare to pass the CCL test and earn <strong>5 points</strong> toward your Australian permanent residency.</p>
<a href="/app/practice/?lang=${L.appLang}" class="inline-block bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-4 rounded-xl">Start practising ${L.label} →</a>
<p class="text-xs text-gray-400 mt-3">No credit card required · Free daily practice</p></div></header>

<main class="py-16 px-4 max-w-3xl mx-auto">
<h2 class="text-2xl font-bold mb-6">Why practise ${L.label} CCL here?</h2>
<div class="grid sm:grid-cols-2 gap-5 mb-14">
<div class="bg-gray-50 rounded-2xl p-5"><div class="text-2xl mb-2">🎧</div><h3 class="font-bold mb-1">Real exam format</h3><p class="text-sm text-gray-500">Segmented dialogues alternating English and ${L.label}, scored 0–5 with a 29/45 pass mark — exactly like the real NAATI CCL test.</p></div>
<div class="bg-gray-50 rounded-2xl p-5"><div class="text-2xl mb-2">🤖</div><h3 class="font-bold mb-1">Instant AI scoring</h3><p class="text-sm text-gray-500">Get segment-by-segment feedback on accuracy, terminology and completeness for your ${L.label} interpreting.</p></div>
<div class="bg-gray-50 rounded-2xl p-5"><div class="text-2xl mb-2">📝</div><h3 class="font-bold mb-1">Full mock exams</h3><p class="text-sm text-gray-500">Sit timed two-dialogue mock exams under real conditions to build exam-day confidence.</p></div>
<div class="bg-gray-50 rounded-2xl p-5"><div class="text-2xl mb-2">📈</div><h3 class="font-bold mb-1">Track your progress</h3><p class="text-sm text-gray-500">Watch your ${L.label} scores improve over time and pinpoint your weakest topic areas.</p></div></div>

<h2 class="text-2xl font-bold mb-4">About the NAATI CCL ${L.label} test</h2>
<p class="text-gray-600 text-sm leading-relaxed mb-4">The Credentialed Community Language (CCL) test assesses your ability to interpret spoken dialogue between English and ${L.label} — ${L.speakers}. It consists of two dialogues of around 300 words each, each split into segments of up to 35 words that you interpret one at a time. To pass you need at least 29 marks out of 45 across both dialogues.</p>
<p class="text-gray-600 text-sm leading-relaxed mb-4">Passing the ${L.label} CCL test earns 5 bonus points toward the points-tested skilled migration visas (subclasses 189, 190 and 491) — often the difference that gets an application over the line.</p>
<p class="text-gray-600 text-sm leading-relaxed mb-10">Our platform lets you practise ${L.label} CCL dialogues across the exact domains you will face on exam day: health and medical, legal, employment, housing, education, banking and finance, immigration, and community and social services.</p>

<h2 class="text-2xl font-bold mb-4">Topics you will practise</h2>
<div class="flex flex-wrap gap-2 mb-12 text-sm">
${['Health & medical','Legal','Employment','Housing & tenancy','Education','Banking & finance','Immigration','Social services','Consumer affairs','Insurance'].map(t => `<span class="bg-brand-50 text-brand-700 rounded-full px-3 py-1">${t}</span>`).join('')}
</div>

<h2 class="text-2xl font-bold mb-4">${L.label} CCL — frequently asked questions</h2>
<div class="space-y-3 mb-14">${faqHtml}</div>

<div class="text-center bg-brand-600 rounded-2xl p-8 text-white mb-12"><h3 class="text-2xl font-bold mb-2">Ready to pass your ${L.label} CCL?</h3><p class="text-brand-100 mb-6">Free to start — no credit card needed.</p><a href="/app/practice/?lang=${L.appLang}" class="inline-block bg-white text-brand-700 font-bold px-8 py-3 rounded-xl">Practise ${L.label} now</a></div>

<h2 class="text-lg font-bold mb-3">Practise another language</h2>
<div class="flex flex-wrap gap-2 mb-6">${otherLangLinks(L.slug)}</div>
<p class="text-sm"><a href="/ccl-practice/" class="text-brand-600 hover:underline">See all NAATI CCL practice tests →</a></p>
</main>

<footer class="border-t border-gray-100 py-8 px-4 text-center text-xs text-gray-400"><div class="max-w-3xl mx-auto space-y-2"><div class="flex flex-wrap justify-center gap-4"><a href="/how-it-works" class="hover:text-brand-600">How it works</a><a href="/pricing" class="hover:text-brand-600">Pricing</a><a href="/faq" class="hover:text-brand-600">FAQ</a><a href="/about" class="hover:text-brand-600">About</a></div><div>© 2026 CCLingo · Independent NAATI CCL preparation, not affiliated with NAATI.</div></div></footer>
</body></html>`;
}

function hubPage() {
  const url = `${ORIGIN}/ccl-practice/`;
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name: 'CCL Practice Tests', item: url },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'NAATI CCL practice tests by language',
        itemListElement: LANGS.map((L, i) => ({
          '@type': 'ListItem', position: i + 1, name: `NAATI CCL ${L.label} Practice Test`, url: `${ORIGIN}/ccl-practice/${L.slug}/`,
        })),
      },
    ],
  };
  const cards = LANGS.map(L => `<a href="/ccl-practice/${L.slug}/" class="flex items-center gap-3 bg-gray-50 hover:bg-brand-50 border-2 border-gray-100 hover:border-brand-300 rounded-2xl p-4 text-left transition-all"><span class="text-2xl">${L.flag}</span><div><div class="font-bold">NAATI CCL ${L.label}</div><div class="text-xs text-gray-400">${L.native} · practice test</div></div></a>`).join('');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NAATI CCL Practice Tests — All 11 Languages | Free Online 2026</title>
<meta name="description" content="Free NAATI CCL practice tests in 11 languages: Mandarin, Cantonese, Punjabi, Hindi, Nepali, Vietnamese, Arabic, Korean, Tamil, Persian and Thai. Real dialogues, instant AI scoring, mock exams — earn 5 points toward Australian PR.">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="en-au" href="${url}">
<link rel="alternate" hreflang="x-default" href="${url}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#059669">
<meta property="og:type" content="website">
<meta property="og:site_name" content="CCLingo">
<meta property="og:locale" content="en_AU">
<meta property="og:title" content="NAATI CCL Practice Tests — All 11 Languages">
<meta property="og:description" content="Free NAATI CCL practice in 11 languages with instant AI scoring. Earn 5 points toward Australian PR.">
<meta property="og:image" content="${ORIGIN}/og.png">
<meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="NAATI CCL Practice Tests — All 11 Languages">
<meta name="twitter:description" content="Free NAATI CCL practice in 11 languages with instant AI scoring.">
<meta name="twitter:image" content="${ORIGIN}/og.png">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<script src="https://cdn.tailwindcss.com"></script>
<script>tailwind.config={theme:{extend:{colors:{brand:{50:'#ecfdf5',100:'#d1fae5',300:'#6ee7b7',500:'#10b981',600:'#059669',700:'#047857'}},fontFamily:{sans:['Inter','system-ui','sans-serif']}}}}</script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body class="font-sans bg-white text-gray-900 antialiased">
<nav class="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100"><div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between"><a href="/" class="font-bold text-xl text-brand-700">CCLingo</a><a href="/app/practice/" class="bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg">Start free</a></div></nav>
<nav aria-label="Breadcrumb" class="max-w-4xl mx-auto px-4 pt-5 text-xs text-gray-400"><a href="/" class="hover:text-brand-600">Home</a> › <span class="text-gray-600">CCL Practice Tests</span></nav>
<header class="pt-10 pb-8 px-4 max-w-4xl mx-auto text-center"><h1 class="text-4xl font-extrabold mb-4">NAATI CCL Practice Tests</h1><p class="text-lg text-gray-500 max-w-2xl mx-auto">Choose your language and start practising for free. Realistic interpreting dialogues, instant AI scoring against the 29/45 pass mark, and full mock exams — everything you need to earn your 5 migration points.</p></header>
<main class="px-4 max-w-4xl mx-auto pb-16"><div class="grid sm:grid-cols-2 gap-3">${cards}</div>
<section class="mt-14 text-sm text-gray-600 leading-relaxed"><h2 class="text-2xl font-bold text-gray-900 mb-4">About the NAATI CCL test</h2><p class="mb-4">The Credentialed Community Language (CCL) test is a NAATI-administered exam that assesses your ability to interpret spoken dialogue between English and another community language. It is made up of two dialogues of around 300 words each. Passing awards <strong>5 bonus points</strong> toward the points-tested Australian skilled migration visas — subclasses 189, 190 and 491.</p><p>Pick your language above to practise realistic CCL dialogues, sit full mock exams, and get instant AI feedback scored against the official 0–5 marking criteria.</p></section></main>
<footer class="border-t border-gray-100 py-8 px-4 text-center text-xs text-gray-400">© 2026 CCLingo · Independent NAATI CCL preparation, not affiliated with NAATI.</footer>
</body></html>`;
}

function sitemap() {
  const staticUrls = [
    { loc: `${ORIGIN}/`, pri: '1.0', freq: 'weekly' },
    { loc: `${ORIGIN}/ccl-practice/`, pri: '0.9', freq: 'weekly' },
    { loc: `${ORIGIN}/how-it-works/`, pri: '0.7', freq: 'monthly' },
    { loc: `${ORIGIN}/pricing/`, pri: '0.7', freq: 'monthly' },
    { loc: `${ORIGIN}/faq/`, pri: '0.7', freq: 'monthly' },
    { loc: `${ORIGIN}/about/`, pri: '0.4', freq: 'yearly' },
    { loc: `${ORIGIN}/privacy/`, pri: '0.3', freq: 'yearly' },
    { loc: `${ORIGIN}/terms/`, pri: '0.3', freq: 'yearly' },
  ];
  const langUrls = LANGS.map(L => ({ loc: `${ORIGIN}/ccl-practice/${L.slug}/`, pri: '0.8', freq: 'weekly' }));
  const all = [...staticUrls, ...langUrls];
  const body = all.map(u => `  <url><loc>${u.loc}</loc><lastmod>${TODAY}</lastmod><changefreq>${u.freq}</changefreq><priority>${u.pri}</priority></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

// ── write ───────────────────────────────────────────────────
const PUB = path.join(__dirname, 'public');
for (const L of LANGS) {
  const dir = path.join(PUB, 'ccl-practice', L.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), langPage(L));
}
fs.writeFileSync(path.join(PUB, 'ccl-practice', 'index.html'), hubPage());
fs.writeFileSync(path.join(PUB, 'sitemap.xml'), sitemap());
console.log(`Generated ${LANGS.length} language pages + hub + sitemap (${TODAY}).`);
