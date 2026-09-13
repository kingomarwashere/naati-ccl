const DIALOGUES = [
  {
    id: 'health-1',
    topic: 'Health',
    title: 'GP Consultation',
    segments: [
      { id: 1, speaker: 'Patient', text: "Good morning. I'd like to see a doctor please. I've been having severe headaches for the past three days and I'm quite worried." },
      { id: 2, speaker: 'Doctor', text: "I see. Can you describe the pain? Where exactly is it, and does anything make it better or worse?" },
      { id: 3, speaker: 'Patient', text: "The pain is mostly on the left side of my head. It gets much worse when I'm in bright light or loud noise. I've been taking paracetamol but it doesn't help." },
      { id: 4, speaker: 'Doctor', text: "Those symptoms sound like they could be migraines. I'd like to refer you to a specialist for further tests. In the meantime, I'll prescribe something stronger for the pain." },
      { id: 5, speaker: 'Patient', text: "Thank you, doctor. Will I need to take time off work? My employer requires a medical certificate if I'm absent for more than two days." }
    ]
  },
  {
    id: 'legal-1',
    topic: 'Legal',
    title: 'Legal Aid Appointment',
    segments: [
      { id: 1, speaker: 'Solicitor', text: "Thank you for coming in. I understand you've received a notice to appear in court. Can you tell me what the matter is about?" },
      { id: 2, speaker: 'Client', text: "Yes. I received a fine for not having a valid train ticket, but I didn't understand the inspector's instructions at the time because of my limited English." },
      { id: 3, speaker: 'Solicitor', text: "I see. That's a relevant point. The court may consider language barriers as a mitigating factor. We can apply for an interpreter for your court appearance." },
      { id: 4, speaker: 'Client', text: "What will happen if I can't pay the fine? I'm on a temporary visa and I'm worried this might affect my visa status." },
      { id: 5, speaker: 'Solicitor', text: "A fine alone typically doesn't affect your visa. However, I strongly recommend appearing in court rather than ignoring the notice. Failing to appear is a more serious offence." }
    ]
  },
  {
    id: 'community-1',
    topic: 'Community Services',
    title: 'Centrelink Appointment',
    segments: [
      { id: 1, speaker: 'Officer', text: "Hello, come in and take a seat. I can see you've applied for the JobSeeker payment. Have you been looking for work since your last job ended?" },
      { id: 2, speaker: 'Applicant', text: "Yes, I've been applying for jobs every week. I'm required to do twelve job searches per fortnight according to my mutual obligation requirements." },
      { id: 3, speaker: 'Officer', text: "That's correct. I can see you've been meeting your requirements. Your payment should continue. Do you have any changes to your circumstances I should know about?" },
      { id: 4, speaker: 'Applicant', text: "Yes, I started some part-time work last week. I worked eight hours and earned two hundred and forty dollars. Do I need to report this?" },
      { id: 5, speaker: 'Officer', text: "Yes, you must report all income within fourteen days. Your payment will be adjusted based on what you earn, but you won't necessarily lose your payment entirely." }
    ]
  }
];

const SCORE_PROMPT = (segment, transcript, language) => `You are an expert NAATI CCL examiner evaluating a spoken interpretation.

English source segment:
"${segment.text}"
Speaker: ${segment.speaker}

The candidate's interpretation (in ${language}, transcribed):
"${transcript}"

Score this interpretation using NAATI CCL marking criteria:
- Accuracy of meaning transfer (key points conveyed)
- Terminology (domain-specific terms handled correctly)
- Completeness (no significant omissions)

Respond with ONLY valid JSON (no markdown):
{
  "score": <number 0-10>,
  "passed": <boolean, true if score >= 6>,
  "feedback": "<1-2 sentence feedback>",
  "keyTerms": [
    {"term": "<English term>", "conveyed": <boolean>, "note": "<brief note>"}
  ]
}`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    // CORS for API
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // API routes
    if (pathname === '/api/dialogues') {
      return Response.json(DIALOGUES.map(d => ({
        id: d.id, topic: d.topic, title: d.title, segmentCount: d.segments.length
      })), { headers: corsHeaders });
    }

    if (pathname.startsWith('/api/dialogue/')) {
      const id = pathname.split('/').pop();
      const dialogue = DIALOGUES.find(d => d.id === id);
      if (!dialogue) return new Response('Not found', { status: 404 });
      return Response.json(dialogue, { headers: corsHeaders });
    }

    if (pathname === '/api/score' && request.method === 'POST') {
      try {
        const { dialogueId, segmentId, transcript, language } = await request.json();

        if (!transcript?.trim()) {
          return Response.json({ error: 'No transcript provided' }, { status: 400, headers: corsHeaders });
        }

        const dialogue = DIALOGUES.find(d => d.id === dialogueId);
        const segment = dialogue?.segments.find(s => s.id === segmentId);
        if (!segment) return Response.json({ error: 'Segment not found' }, { status: 404, headers: corsHeaders });

        if (!env.ANTHROPIC_API_KEY) {
          return Response.json({
            score: 7, passed: true,
            feedback: 'Demo mode — add ANTHROPIC_API_KEY secret to enable real AI scoring.',
            keyTerms: []
          }, { headers: corsHeaders });
        }

        const resp = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-6',
            max_tokens: 400,
            messages: [{ role: 'user', content: SCORE_PROMPT(segment, transcript, language) }]
          })
        });

        const ai = await resp.json();
        const text = ai.content?.[0]?.text ?? '{}';
        const result = JSON.parse(text);
        return Response.json(result, { headers: corsHeaders });
      } catch (e) {
        return Response.json({ error: e.message }, { status: 500, headers: corsHeaders });
      }
    }

    // Fall through to static assets
    return env.ASSETS.fetch(request);
  }
};
