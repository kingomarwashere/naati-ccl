// Each segment: user hears `prompt` in English, speaks their English response
// `goal` tells them what to communicate (in English + Chinese)
// `modelAnswer` is what a fluent speaker would say — used for scoring
// `keyPoints` are the facts/phrases AI checks for

const DIALOGUES = [
  {
    id: 'health-gp',
    topic: 'Health',
    title: 'Visiting the GP',
    scenario: 'You have been having bad headaches for three days. You are at a medical centre to see a doctor.',
    scenarioZh: '你头痛了三天。你去医疗中心看医生。',
    segments: [
      {
        id: 1,
        speaker: 'Receptionist',
        prompt: "Good morning, welcome to City Medical Centre. How can I help you today?",
        goal: "Ask to see a doctor. Mention you've been having headaches.",
        goalZh: "告诉前台你想看医生，你一直有头痛。",
        modelAnswer: "Hi, I'd like to see a doctor please. I've been having really bad headaches for the past few days.",
        keyPoints: ["see a doctor", "headache", "duration (few days)"],
      },
      {
        id: 2,
        speaker: 'Doctor',
        prompt: "Hello, come in and take a seat. Can you tell me what's been going on?",
        goal: "Describe your symptoms: left-side headaches, worse in bright light, started 3 days ago.",
        goalZh: "描述症状：左侧头痛，在强光下更严重，三天前开始。",
        modelAnswer: "I've had really bad headaches for about three days now. The pain is mainly on the left side of my head, and it gets a lot worse when I'm in bright light or around loud noise.",
        keyPoints: ["three days", "left side", "bright light or noise makes it worse"],
      },
      {
        id: 3,
        speaker: 'Doctor',
        prompt: "Have you taken anything for the pain? And have you experienced any nausea or vomiting?",
        goal: "Say you've been taking paracetamol but it doesn't help much. You've had nausea but no vomiting.",
        goalZh: "说你一直在吃扑热息痛但效果不大，有恶心但没有呕吐。",
        modelAnswer: "I've been taking paracetamol but it doesn't really help. I have felt quite nauseous but I haven't actually vomited.",
        keyPoints: ["paracetamol", "doesn't help", "nausea", "no vomiting"],
      },
      {
        id: 4,
        speaker: 'Doctor',
        prompt: "Based on what you've described, this sounds like it could be migraines. I'd like to refer you to a neurologist. Do you have any questions?",
        goal: "Ask if you need a medical certificate for work, and whether you need to do anything before the specialist appointment.",
        goalZh: "询问是否需要病假证明，以及在看专科医生之前需要做什么。",
        modelAnswer: "Yes — will you be able to give me a medical certificate for work? And is there anything I should do or avoid before I see the specialist?",
        keyPoints: ["medical certificate", "specialist appointment", "what to do before"],
      },
    ],
  },

  {
    id: 'employment-interview',
    topic: 'Employment',
    title: 'Job Interview',
    scenario: 'You are interviewing for a customer service role at a retail store. Answer naturally and confidently in English.',
    scenarioZh: '你在面试一家零售店的客服职位。用英语自然、自信地回答。',
    segments: [
      {
        id: 1,
        speaker: 'Interviewer',
        prompt: "Hi, thanks for coming in today. Can you start by telling me a little bit about yourself?",
        goal: "Introduce yourself — mention where you're from, your work background, and one relevant strength.",
        goalZh: "介绍自己——说明你来自哪里、工作背景，以及一个相关优势。",
        modelAnswer: "Sure! I moved to Australia two years ago from China. Back home I worked in retail for three years, mostly in customer-facing roles. I'm quite patient and I genuinely enjoy helping people, which is why I'm keen on this kind of work.",
        keyPoints: ["background", "relevant experience", "a strength or reason for interest"],
      },
      {
        id: 2,
        speaker: 'Interviewer',
        prompt: "Why do you want to work here specifically?",
        goal: "Give a genuine reason — mention something specific about the company, the type of work, or your values.",
        goalZh: "给出真实的理由——提到公司的某些具体方面、工作类型或你的价值观。",
        modelAnswer: "I've shopped here a few times and I've always been impressed by how helpful and friendly the staff are. I'd love to be part of a team that really cares about the customer experience. Also, I want to keep improving my English, and a customer-facing role would really help with that.",
        keyPoints: ["specific reason", "positive about the company", "genuine motivation"],
      },
      {
        id: 3,
        speaker: 'Interviewer',
        prompt: "Can you describe a time when you had to deal with a difficult or unhappy customer?",
        goal: "Give a specific example. Explain the situation, what you did, and the outcome. Show patience and problem-solving.",
        goalZh: "举一个具体例子。说明情况、你做了什么以及结果。展示耐心和解决问题的能力。",
        modelAnswer: "Yes — once a customer was really upset because an item they'd ordered hadn't arrived on time and it was a gift. I apologised sincerely, explained the delay, and arranged an express replacement and a small discount on their next purchase. They left satisfied and actually thanked me for how I handled it.",
        keyPoints: ["specific situation", "what you did", "positive outcome", "stayed calm"],
      },
      {
        id: 4,
        speaker: 'Interviewer',
        prompt: "Great. Do you have any questions for us?",
        goal: "Ask one thoughtful question — about the team, training, hours, or career growth.",
        goalZh: "问一个有意义的问题——关于团队、培训、工作时间或职业发展。",
        modelAnswer: "Yes, I do — what does the onboarding process look like for new staff? And are there opportunities to take on more responsibility over time?",
        keyPoints: ["at least one question", "relevant to the role", "shows interest in growth"],
      },
    ],
  },

  {
    id: 'community-centrelink',
    topic: 'Community Services',
    title: 'Centrelink Appointment',
    scenario: 'You lost your job last month and are at Centrelink to apply for the JobSeeker Payment.',
    scenarioZh: '你上个月失业了，你去Centrelink申请求职者付款。',
    segments: [
      {
        id: 1,
        speaker: 'Centrelink Officer',
        prompt: "Good morning. Take a seat. What are you here about today?",
        goal: "Explain that you've recently lost your job and want to apply for financial support.",
        goalZh: "说明你最近失业了，想申请财务支持。",
        modelAnswer: "Hi, I recently lost my job — I was made redundant about three weeks ago — and I'd like to find out how to apply for the JobSeeker Payment.",
        keyPoints: ["lost job", "when (recently/three weeks ago)", "want to apply for support"],
      },
      {
        id: 2,
        speaker: 'Officer',
        prompt: "I see. To process your application I'll need some documents. Do you have your termination letter, recent payslips, and proof of identity with you?",
        goal: "Confirm what you have brought. Mention any documents you don't have and ask how to get them.",
        goalZh: "确认你带来了哪些文件。提到你没有的文件，并询问如何获得它们。",
        modelAnswer: "I have my termination letter and my last three payslips, and my passport for ID. I'm not sure I have the right bank statements — can you tell me exactly what format you need?",
        keyPoints: ["confirms documents on hand", "identifies gap", "asks for clarification"],
      },
      {
        id: 3,
        speaker: 'Officer',
        prompt: "No problem, we can sort that out. Now, do you have a partner or dependants? And can you tell me roughly what savings or assets you have?",
        goal: "Say you're single, no dependants. You have about $8,000 in savings and own a car worth around $5,000.",
        goalZh: "说明你单身，没有被抚养人。你大约有8000澳元的存款，拥有一辆价值约5000澳元的汽车。",
        modelAnswer: "I'm single and I don't have any dependants. I have about eight thousand dollars in savings and a car that's probably worth around five thousand, but that's about it.",
        keyPoints: ["single", "no dependants", "savings amount (~$8k)", "car (~$5k)"],
      },
      {
        id: 4,
        speaker: 'Officer',
        prompt: "That's fine — those assets are within the limit. You'll need to meet mutual obligation requirements, which includes actively looking for work. Does that make sense?",
        goal: "Say you understand. Ask how many jobs you need to apply for each fortnight, and whether you need to report any casual work you pick up.",
        goalZh: "说你明白了。询问每两周需要申请多少份工作，以及是否需要汇报你找到的临时工作。",
        modelAnswer: "Yes, that makes sense. Just to clarify — how many jobs do I need to apply for each fortnight? And if I pick up any casual shifts while I'm looking, do I need to report that income to you?",
        keyPoints: ["understands obligations", "asks about job search number", "asks about reporting income"],
      },
    ],
  },

  {
    id: 'legal-tenancy',
    topic: 'Legal',
    title: 'Rental Dispute',
    scenario: 'Your landlord has not fixed a broken heater for 6 weeks. You are calling a tenancy advice hotline for help.',
    scenarioZh: '你的房东六周内没有修好暖气。你打电话给租房建议热线寻求帮助。',
    segments: [
      {
        id: 1,
        speaker: 'Advisor',
        prompt: "Thank you for calling the Tenants' Union helpline. How can I help you today?",
        goal: "Explain the problem: the heater has been broken for 6 weeks and the landlord hasn't responded to your requests to fix it.",
        goalZh: "解释问题：暖气已坏了6周，房东对你的维修请求没有回应。",
        modelAnswer: "Hi, I'm renting a property and the heater has been broken for about six weeks now. I've contacted my landlord twice in writing asking them to fix it, but they haven't responded at all.",
        keyPoints: ["heater broken", "six weeks", "contacted landlord", "no response"],
      },
      {
        id: 2,
        speaker: 'Advisor',
        prompt: "That's a breach of your landlord's duty to maintain the property. Did you make these requests in writing, and do you have copies?",
        goal: "Confirm you sent messages via text and email and kept copies. Ask if that's enough evidence.",
        goalZh: "确认你通过短信和电子邮件发送了请求并保留了副本。询问这是否足够作为证据。",
        modelAnswer: "Yes, I sent two text messages and one email, and I've kept copies of all of them. Is that enough, or do I need something more formal like a letter?",
        keyPoints: ["written requests", "kept copies", "asks if evidence is sufficient"],
      },
      {
        id: 3,
        speaker: 'Advisor',
        prompt: "Text messages and emails are absolutely fine as evidence. Your next step is to lodge an application with the NSW Civil and Administrative Tribunal. Have you heard of NCAT?",
        goal: "Say you haven't heard of it and ask what it is and how to apply.",
        goalZh: "说你没听说过，并询问它是什么以及如何申请。",
        modelAnswer: "No, I haven't heard of it before. Could you explain what it is and how I would go about applying? Is it expensive or complicated?",
        keyPoints: ["hasn't heard of NCAT", "asks what it is", "asks how to apply"],
      },
    ],
  },
];

const SCORE_PROMPT = (segment, transcript) => `You are a friendly but honest English language coach helping a Chinese migrant improve their spoken English for Australian life.

SCENARIO: ${segment._scenarioContext}

THE PROMPT THEY HEARD (from the other person):
"${segment.prompt}"

WHAT THEY NEEDED TO COMMUNICATE:
${segment.goal}

KEY POINTS TO COVER: ${segment.keyPoints.join(', ')}

WHAT A FLUENT SPEAKER MIGHT SAY:
"${segment.modelAnswer}"

THE LEARNER'S RESPONSE (speech-to-text transcript):
"${transcript}"

Evaluate their English response. Focus on:
1. Grammar — errors, missing articles, wrong tense, subject-verb agreement
2. Vocabulary — appropriate word choice, any awkward phrasings
3. Naturalness — does it sound like natural spoken Australian English?
4. Completeness — did they cover the key points?

Score 1–10 where 8+ = near-native, 6–7 = communicative with noticeable issues, below 6 = significant errors that would cause confusion.

Respond ONLY with valid JSON, no markdown:
{
  "score": <integer 1-10>,
  "passed": <boolean, true if 6+>,
  "feedback": "<2-3 sentences of specific, encouraging, actionable feedback>",
  "corrections": [
    { "said": "<exact phrase from transcript>", "better": "<natural English version>", "why": "<brief reason>" }
  ],
  "keyPointsCovered": [
    { "point": "<key point>", "covered": <boolean> }
  ]
}`;

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

    // GET /api/dialogues — list all dialogues
    if (pathname === '/api/dialogues') {
      const list = DIALOGUES.map(({ id, topic, title, scenario, scenarioZh, segments }) => ({
        id, topic, title, scenario, scenarioZh, segmentCount: segments.length,
      }));
      return Response.json(list, { headers: cors });
    }

    // GET /api/dialogue/:id
    const matchOne = pathname.match(/^\/api\/dialogue\/(.+)$/);
    if (matchOne) {
      const d = DIALOGUES.find(x => x.id === matchOne[1]);
      if (!d) return new Response('Not found', { status: 404 });
      return Response.json(d, { headers: cors });
    }

    // POST /api/score
    if (pathname === '/api/score' && request.method === 'POST') {
      try {
        const { dialogueId, segmentId, transcript } = await request.json();

        if (!transcript?.trim()) {
          return Response.json({ error: 'No transcript' }, { status: 400, headers: cors });
        }

        const dialogue = DIALOGUES.find(d => d.id === dialogueId);
        const segment  = dialogue?.segments.find(s => s.id === segmentId);
        if (!segment) return Response.json({ error: 'Not found' }, { status: 404, headers: cors });

        // Attach scenario context so the prompt has it
        segment._scenarioContext = dialogue.scenario;

        if (!env.ANTHROPIC_API_KEY) {
          return Response.json({
            score: 7, passed: true,
            feedback: 'Demo mode — ANTHROPIC_API_KEY not set.',
            corrections: [], keyPointsCovered: [],
          }, { headers: cors });
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
            max_tokens: 600,
            messages: [{ role: 'user', content: SCORE_PROMPT(segment, transcript) }],
          }),
        });

        const ai     = await resp.json();
        const raw    = ai.content?.[0]?.text ?? '{}';
        const result = JSON.parse(raw);
        return Response.json(result, { headers: cors });
      } catch (e) {
        return Response.json({ error: e.message }, { status: 500, headers: cors });
      }
    }

    return env.ASSETS.fetch(request);
  },
};
