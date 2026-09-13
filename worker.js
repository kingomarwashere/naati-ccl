// Each segment: { id, speaker, sourceLang, interpretLang, sourceText }
// sourceLang = language of the audio played
// interpretLang = language the user must interpret INTO

const DIALOGUES = {
  zh: [
    {
      id: 'zh-health-1',
      language: 'Mandarin',
      langCode: 'zh-CN',
      topic: 'Health',
      title: 'GP Consultation',
      segments: [
        {
          id: 1,
          speaker: 'Patient',
          sourceLang: 'en-AU',
          interpretLang: 'zh-CN',
          sourceText: "Good morning. I've been having really bad headaches for the past three days and I'm quite worried it might be something serious.",
        },
        {
          id: 2,
          speaker: '医生',
          sourceLang: 'zh-CN',
          interpretLang: 'en-AU',
          sourceText: '请问您的头痛是持续性的，还是时好时坏？疼痛主要在哪个位置，程度有多严重？',
        },
        {
          id: 3,
          speaker: 'Patient',
          sourceLang: 'en-AU',
          interpretLang: 'zh-CN',
          sourceText: "It comes and goes, mostly in the morning. The pain is on the left side of my head and gets much worse in bright light or loud noise. I've been taking paracetamol but it barely helps.",
        },
        {
          id: 4,
          speaker: '医生',
          sourceLang: 'zh-CN',
          interpretLang: 'en-AU',
          sourceText: '您最近有没有出现恶心或呕吐的情况？这种头痛对您的日常生活和工作有多大影响？',
        },
        {
          id: 5,
          speaker: 'Patient',
          sourceLang: 'en-AU',
          interpretLang: 'zh-CN',
          sourceText: "Yes, I've had nausea but no vomiting. It's significantly affecting my work — I can't concentrate and have had to take two days off. My employer needs a medical certificate if I'm absent for more than two days.",
        },
        {
          id: 6,
          speaker: '医生',
          sourceLang: 'zh-CN',
          interpretLang: 'en-AU',
          sourceText: '根据您描述的症状，您很可能患有偏头痛。我会给您开一张转诊单，让神经科专科医生为您进行详细检查，同时我也会开一些更有效的处方药物来缓解疼痛。',
        },
      ],
    },
    {
      id: 'zh-legal-1',
      language: 'Mandarin',
      langCode: 'zh-CN',
      topic: 'Legal',
      title: 'Traffic Infringement',
      segments: [
        {
          id: 1,
          speaker: 'Solicitor',
          sourceLang: 'en-AU',
          interpretLang: 'zh-CN',
          sourceText: "Thank you for coming in. I understand you've received a traffic infringement notice and you're disputing it. Can you explain what happened?",
        },
        {
          id: 2,
          speaker: '当事人',
          sourceLang: 'zh-CN',
          interpretLang: 'en-AU',
          sourceText: '我上个月收到了一张闯红灯的罚单，但我确实没有看到红灯，因为路口的指示牌被一棵大树的树枝遮住了，完全看不见。',
        },
        {
          id: 3,
          speaker: 'Solicitor',
          sourceLang: 'en-AU',
          interpretLang: 'zh-CN',
          sourceText: "A partially obscured traffic signal is a strong mitigating factor. Do you have any evidence — photographs, dashcam footage, or witnesses who can confirm the obstruction?",
        },
        {
          id: 4,
          speaker: '当事人',
          sourceLang: 'zh-CN',
          interpretLang: 'en-AU',
          sourceText: '我当时立刻下车拍了照片，清楚地显示树枝遮挡了红灯信号。另外，我的同事也在车上，可以出庭作证。',
        },
        {
          id: 5,
          speaker: 'Solicitor',
          sourceLang: 'en-AU',
          interpretLang: 'zh-CN',
          sourceText: "Excellent. With this evidence we can contest the fine and potentially have it dismissed. I'll also advise you to lodge a formal complaint with the council about the dangerous obstruction.",
        },
      ],
    },
    {
      id: 'zh-community-1',
      language: 'Mandarin',
      langCode: 'zh-CN',
      topic: 'Community Services',
      title: 'Centrelink — JobSeeker',
      segments: [
        {
          id: 1,
          speaker: '申请人',
          sourceLang: 'zh-CN',
          interpretLang: 'en-AU',
          sourceText: '你好，我想申请失业救济金。我上个月刚失去工作，在那家公司一共做了五年，上周才收到正式的解雇通知。',
        },
        {
          id: 2,
          speaker: 'Officer',
          sourceLang: 'en-AU',
          interpretLang: 'zh-CN',
          sourceText: "I can help you with that. To apply for the JobSeeker Payment you'll need to provide proof of identity, your termination letter, your last three payslips, and details of any assets or savings you currently hold.",
        },
        {
          id: 3,
          speaker: '申请人',
          sourceLang: 'zh-CN',
          interpretLang: 'en-AU',
          sourceText: '我有解雇信和过去三个月的工资单。我目前没有其他收入，但我有一个储蓄账户，里面大约有一万两千元，另外我还有一辆价值六千元左右的二手车。',
        },
        {
          id: 4,
          speaker: 'Officer',
          sourceLang: 'en-AU',
          interpretLang: 'zh-CN',
          sourceText: "Those assets are within the allowable limit for a single person. You'll also need to sign a Job Plan and meet your mutual obligation requirements, which means applying for at least eight jobs every fortnight.",
        },
        {
          id: 5,
          speaker: '申请人',
          sourceLang: 'zh-CN',
          interpretLang: 'en-AU',
          sourceText: '我完全理解，我已经开始积极找工作了。请问审核大概需要多长时间？在审核期间我还能维持我的医疗卡吗？',
        },
      ],
    },
  ],
};

const SCORE_PROMPT = ({ sourceText, sourceLang, interpretLang, userTranscript }) => {
  const isEnToZh = sourceLang.startsWith('en') && interpretLang.startsWith('zh');
  const isZhToEn = sourceLang.startsWith('zh') && interpretLang.startsWith('en');

  const direction = isEnToZh
    ? 'English → Mandarin Chinese'
    : isZhToEn
    ? 'Mandarin Chinese → English'
    : `${sourceLang} → ${interpretLang}`;

  return `You are a NAATI CCL examiner evaluating a spoken interpretation attempt.

Direction: ${direction}
Source (what the candidate heard):
"${sourceText}"

Candidate's interpretation (transcribed speech):
"${userTranscript}"

Score this interpretation strictly using NAATI CCL marking criteria:
- Accuracy: Were all key facts and meaning transferred?
- Terminology: Were domain-specific terms correctly translated?
- Completeness: Were any significant information points omitted?
- Register: Was the appropriate formality level maintained?

A score of 6-7 is a borderline pass. 8-10 is strong. Below 6 is a fail.

Respond with ONLY valid JSON, no markdown, no explanation outside the JSON:
{
  "score": <integer 0-10>,
  "passed": <boolean>,
  "feedback": "<one or two sentences of actionable feedback>",
  "keyTerms": [
    { "en": "<English term>", "zh": "<Chinese equivalent>", "conveyed": <boolean> }
  ]
}`;
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });

    // GET /api/languages — list available language groups
    if (pathname === '/api/languages') {
      const langs = Object.keys(DIALOGUES).map(k => ({
        code: k,
        label: DIALOGUES[k][0].language,
        langCode: DIALOGUES[k][0].langCode,
        count: DIALOGUES[k].length,
      }));
      return Response.json(langs, { headers: cors });
    }

    // GET /api/dialogues/:lang — list dialogues for a language
    const matchList = pathname.match(/^\/api\/dialogues\/(\w+)$/);
    if (matchList) {
      const group = DIALOGUES[matchList[1]];
      if (!group) return new Response('Not found', { status: 404 });
      const list = group.map(({ id, topic, title, segments }) => ({
        id, topic, title, segmentCount: segments.length,
      }));
      return Response.json(list, { headers: cors });
    }

    // GET /api/dialogue/:id — full dialogue including segments
    const matchOne = pathname.match(/^\/api\/dialogue\/(.+)$/);
    if (matchOne) {
      const id = matchOne[1];
      const dialogue = Object.values(DIALOGUES).flat().find(d => d.id === id);
      if (!dialogue) return new Response('Not found', { status: 404 });
      return Response.json(dialogue, { headers: cors });
    }

    // POST /api/score
    if (pathname === '/api/score' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { dialogueId, segmentId, transcript, language } = body;

        if (!transcript?.trim()) {
          return Response.json({ error: 'No transcript' }, { status: 400, headers: cors });
        }

        const dialogue = Object.values(DIALOGUES).flat().find(d => d.id === dialogueId);
        const segment = dialogue?.segments.find(s => s.id === segmentId);
        if (!segment) return Response.json({ error: 'Segment not found' }, { status: 404, headers: cors });

        if (!env.ANTHROPIC_API_KEY) {
          return Response.json({
            score: 7, passed: true,
            feedback: 'Demo mode — set ANTHROPIC_API_KEY secret to enable real scoring.',
            keyTerms: [],
          }, { headers: cors });
        }

        const prompt = SCORE_PROMPT({
          sourceText: segment.sourceText,
          sourceLang: segment.sourceLang,
          interpretLang: segment.interpretLang,
          userTranscript: transcript,
        });

        const aiResp = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-6',
            max_tokens: 500,
            messages: [{ role: 'user', content: prompt }],
          }),
        });

        const aiData = await aiResp.json();
        const raw = aiData.content?.[0]?.text ?? '{}';
        const result = JSON.parse(raw);
        return Response.json(result, { headers: cors });
      } catch (e) {
        return Response.json({ error: e.message }, { status: 500, headers: cors });
      }
    }

    return env.ASSETS.fetch(request);
  },
};
