// NAATI CCL format:
// • 13 segments per dialogue, alternating English ↔ Chinese
// • Each segment: source audio plays, chime sounds, candidate interprets into the OTHER language
// • 9 segments are SCORED (marked: true), 4 are connector turns (marked: false)
// • Max 5 marks per scored segment → 45 total, 29 to pass

const DIALOGUES = [
  {
    id: 'health-gp',
    topic: 'Health',
    title: 'GP Consultation',
    scenario: 'A Chinese-speaking patient is visiting a GP clinic. You are the interpreter.',
    scenarioZh: '一位说普通话的病人去看全科医生。你是口译员。',
    segments: [
      // ── CONNECTORS (not scored) ───────────────────────────────
      {
        id: 1, marked: false,
        lang: 'en-AU', speaker: 'Receptionist',
        text: "Good morning, welcome to Eastwood Medical Centre. How can I help you today?",
        interpretLang: 'zh-CN', interpretLabel: '普通话',
        goal: "Interpret into Mandarin for the patient.",
        goalZh: "将前台的问候翻译成普通话。",
        modelAnswer: "早上好，欢迎来到伊士活医疗中心。今天有什么可以帮到您的？",
        keyPoints: ["good morning / 早上好", "welcome / 欢迎", "how can I help / 有什么可以帮"],
      },
      {
        id: 2, marked: false,
        lang: 'zh-CN', speaker: '患者',
        text: "你好，我头痛得很厉害，已经三天了，想预约看医生，今天有没有空缺？",
        interpretLang: 'en-AU', interpretLabel: 'English',
        goal: "Interpret into English for the receptionist.",
        goalZh: "将病人的话翻译成英文。",
        modelAnswer: "Hi, I've had a really bad headache for three days and I'd like to see a doctor — do you have any appointments available today?",
        keyPoints: ["bad headache", "three days", "see a doctor", "appointment today"],
      },

      // ── SCORED SEGMENTS ──────────────────────────────────────
      {
        id: 3, marked: true,
        lang: 'en-AU', speaker: 'Doctor',
        text: "Good morning, come in and take a seat. Now, what brings you in today? Can you describe what's been happening?",
        interpretLang: 'zh-CN', interpretLabel: '普通话',
        goal: "Interpret the doctor's question into Mandarin.",
        goalZh: "将医生的问题翻译成普通话。",
        modelAnswer: "早上好，进来坐吧。今天是什么情况来看诊的？能描述一下发生了什么吗？",
        keyPoints: ["come in / take a seat", "what brings you in", "describe what happened"],
      },
      {
        id: 4, marked: true,
        lang: 'zh-CN', speaker: '患者',
        text: "医生，我头痛了三天了，主要痛在头的左边，感觉像是有东西一跳一跳的。碰到强光或者大声音的时候会更严重。",
        interpretLang: 'en-AU', interpretLabel: 'English',
        goal: "Interpret the patient's symptoms into English.",
        goalZh: "将病人描述的症状翻译成英文。",
        modelAnswer: "Doctor, I've had a headache for three days. The pain is mainly on the left side of my head and it feels like a throbbing sensation. It gets a lot worse when I'm exposed to bright light or loud noise.",
        keyPoints: ["three days", "left side", "throbbing", "worse with bright light / loud noise"],
      },
      {
        id: 5, marked: true,
        lang: 'en-AU', speaker: 'Doctor',
        text: "I see. And are there any other symptoms — nausea, vomiting, blurred vision, or sensitivity to smell?",
        interpretLang: 'zh-CN', interpretLabel: '普通话',
        goal: "Interpret the doctor's question about other symptoms into Mandarin.",
        goalZh: "将医生关于其他症状的问题翻译成普通话。",
        modelAnswer: "好的。还有其他症状吗？比如恶心、呕吐、视力模糊，或者对气味敏感？",
        keyPoints: ["nausea / 恶心", "vomiting / 呕吐", "blurred vision / 视力模糊", "sensitivity to smell / 对气味敏感"],
      },
      {
        id: 6, marked: true,
        lang: 'zh-CN', speaker: '患者',
        text: "有，我感觉有点恶心，但没有吐。视线有时候会模糊一下。另外我最近睡眠不太好，工作压力也很大。",
        interpretLang: 'en-AU', interpretLabel: 'English',
        goal: "Interpret the patient's response into English.",
        goalZh: "将病人的回答翻译成英文。",
        modelAnswer: "Yes, I've been feeling a bit nauseous but I haven't vomited. My vision does go blurry sometimes. I've also been sleeping quite poorly lately and I'm under a lot of pressure at work.",
        keyPoints: ["nausea / nauseous", "no vomiting", "blurry vision", "poor sleep / work stress"],
      },
      {
        id: 7, marked: true,
        lang: 'en-AU', speaker: 'Doctor',
        text: "Have you taken any medication for the pain, and does anything provide relief?",
        interpretLang: 'zh-CN', interpretLabel: '普通话',
        goal: "Interpret the doctor's question into Mandarin.",
        goalZh: "将医生的问题翻译成普通话。",
        modelAnswer: "您有没有吃过什么药来止痛？有什么东西能让您感觉好一点吗？",
        keyPoints: ["taken medication / 吃过药", "provides relief / 感觉好一点"],
      },
      {
        id: 8, marked: true,
        lang: 'zh-CN', speaker: '患者',
        text: "我吃了扑热息痛，但作用不大。躺在暗的、安静的房间里休息会稍微好一点点。",
        interpretLang: 'en-AU', interpretLabel: 'English',
        goal: "Interpret the patient's response into English.",
        goalZh: "将病人的回答翻译成英文。",
        modelAnswer: "I've been taking paracetamol but it hasn't helped much. Lying down in a dark, quiet room provides a little bit of relief.",
        keyPoints: ["paracetamol", "hasn't helped much", "dark quiet room provides relief"],
      },
      {
        id: 9, marked: true,
        lang: 'en-AU', speaker: 'Doctor',
        text: "Based on everything you've told me, your symptoms are strongly consistent with migraines. I'd like to prescribe you a specific migraine medication called sumatriptan, and I'm also referring you to a neurologist for a full assessment.",
        interpretLang: 'zh-CN', interpretLabel: '普通话',
        goal: "Interpret the doctor's diagnosis and treatment plan into Mandarin.",
        goalZh: "将医生的诊断和治疗方案翻译成普通话。",
        modelAnswer: "根据您所描述的情况，您的症状跟偏头痛非常吻合。我想给您开一种专门治疗偏头痛的药，叫做舒马曲坦，同时我也会转介您去看神经科医生做全面检查。",
        keyPoints: ["migraines / 偏头痛", "sumatriptan / 舒马曲坦", "referring to neurologist / 转介神经科"],
      },
      {
        id: 10, marked: true,
        lang: 'zh-CN', speaker: '患者',
        text: "好的，谢谢医生。请问这个舒马曲坦有什么副作用？我平时有服用降血压的药，会不会有影响？",
        interpretLang: 'en-AU', interpretLabel: 'English',
        goal: "Interpret the patient's question about side effects and medication interactions into English.",
        goalZh: "将病人关于副作用和药物相互作用的问题翻译成英文。",
        modelAnswer: "Thank you, doctor. Could you tell me what the side effects of sumatriptan are? I'm also taking blood pressure medication — will there be any interaction?",
        keyPoints: ["side effects of sumatriptan", "taking blood pressure medication", "drug interaction"],
      },
      {
        id: 11, marked: true,
        lang: 'en-AU', speaker: 'Doctor',
        text: "Sumatriptan can cause mild side effects such as tingling, flushing, or dizziness. I'll need to check whether it interacts with your blood pressure medication before I prescribe. What medication are you currently taking?",
        interpretLang: 'zh-CN', interpretLabel: '普通话',
        goal: "Interpret the doctor's response into Mandarin.",
        goalZh: "将医生的回答翻译成普通话。",
        modelAnswer: "舒马曲坦可能有一些轻微的副作用，比如刺麻感、潮热或者头晕。开药之前我需要先确认它跟您的降血压药有没有相互作用。您现在在服用什么降血压药？",
        keyPoints: ["side effects: tingling/flushing/dizziness", "check interaction first", "ask what BP medication"],
      },

      // ── CONNECTORS (closing) ──────────────────────────────────
      {
        id: 12, marked: false,
        lang: 'zh-CN', speaker: '患者',
        text: "我在吃氨氯地平，每天早上一片五毫克的。另外，我这几天没办法上班，您能给我开一张病假证明吗？",
        interpretLang: 'en-AU', interpretLabel: 'English',
        goal: "Interpret into English: the patient takes amlodipine 5mg daily and needs a medical certificate.",
        goalZh: "将病人的话翻译成英文：服用氨氯地平5毫克，需要病假证明。",
        modelAnswer: "I'm taking amlodipine, five milligrams once a day in the morning. I also haven't been able to go to work the past few days — would it be possible to get a medical certificate?",
        keyPoints: ["amlodipine 5mg", "once daily morning", "medical certificate"],
      },
      {
        id: 13, marked: false,
        lang: 'en-AU', speaker: 'Doctor',
        text: "Amlodipine is generally compatible with sumatriptan — that should be fine. I'll write you a medical certificate for today and the next two days. Please come back if your symptoms worsen or don't improve within a week. Take care.",
        interpretLang: 'zh-CN', interpretLabel: '普通话',
        goal: "Interpret the doctor's closing instructions into Mandarin.",
        goalZh: "将医生的结束语和嘱咐翻译成普通话。",
        modelAnswer: "氨氯地平和舒马曲坦一般没有相互作用，应该没问题。我会给您开今天和接下来两天的病假证明。如果症状加重或者一周内没有改善，请回来看诊。保重！",
        keyPoints: ["amlodipine compatible", "medical certificate for 2 days", "come back if worsens / within a week"],
      },
    ],
  },

  {
    id: 'employment-interview',
    topic: 'Employment',
    title: 'Job Interview',
    scenario: 'A Chinese-speaking job seeker is attending an interview at a supermarket. You are the interpreter.',
    scenarioZh: '一位说普通话的求职者正在接受超市的面试。你是口译员。',
    segments: [
      {
        id: 1, marked: false,
        lang: 'en-AU', speaker: 'HR Manager',
        text: "Hi, come in and take a seat. Thank you for coming in today. Can I get you a glass of water?",
        interpretLang: 'zh-CN', interpretLabel: '普通话',
        goal: "Interpret the manager's greeting into Mandarin.",
        goalZh: "将经理的问候翻译成普通话。",
        modelAnswer: "你好，进来坐吧。感谢你今天来面试。需要喝点水吗？",
        keyPoints: ["come in / sit down", "thank you for coming", "glass of water"],
      },
      {
        id: 2, marked: false,
        lang: 'zh-CN', speaker: '求职者',
        text: "谢谢，我不用喝水了，我们可以开始了。",
        interpretLang: 'en-AU', interpretLabel: 'English',
        goal: "Interpret into English: the job seeker declines water and is ready to begin.",
        goalZh: "将求职者的话翻译成英文。",
        modelAnswer: "Thank you, I'm fine, we can get started.",
        keyPoints: ["no thank you / declines", "ready to start"],
      },
      {
        id: 3, marked: true,
        lang: 'en-AU', speaker: 'HR Manager',
        text: "Great. Let's start with you telling me a little bit about yourself — your background, your experience, and what brings you here today.",
        interpretLang: 'zh-CN', interpretLabel: '普通话',
        goal: "Interpret the interviewer's opening question into Mandarin.",
        goalZh: "将面试官的开场问题翻译成普通话。",
        modelAnswer: "好的，我们先从您的个人介绍开始吧——您的背景、工作经历，以及今天来这里面试的原因。",
        keyPoints: ["tell me about yourself", "background / experience", "why you're here"],
      },
      {
        id: 4, marked: true,
        lang: 'zh-CN', speaker: '求职者',
        text: "我两年前从中国来到澳大利亚。在中国我做过三年的零售工作，主要负责客户服务。我对这份工作很感兴趣，因为我希望继续发挥我的客服经验，同时也能提升我的英语水平。",
        interpretLang: 'en-AU', interpretLabel: 'English',
        goal: "Interpret the job seeker's introduction into English.",
        goalZh: "将求职者的自我介绍翻译成英文。",
        modelAnswer: "I came to Australia from China two years ago. In China I worked in retail for three years, mainly in customer service. I'm very interested in this role because I want to continue using my customer service skills while also improving my English.",
        keyPoints: ["from China / two years ago", "three years retail / customer service", "interested in role", "improve English"],
      },
      {
        id: 5, marked: true,
        lang: 'en-AU', speaker: 'HR Manager',
        text: "That's great experience. Can you tell me about a time you had to handle a difficult or unhappy customer? What did you do and what was the outcome?",
        interpretLang: 'zh-CN', interpretLabel: '普通话',
        goal: "Interpret the question about handling a difficult customer into Mandarin.",
        goalZh: "将关于处理困难客户的问题翻译成普通话。",
        modelAnswer: "这很有价值的经验。能不能说说您什么时候遇到过一位难处理或者不满意的客户？您当时怎么做的？结果怎么样？",
        keyPoints: ["difficult / unhappy customer", "what did you do", "what was the outcome"],
      },
      {
        id: 6, marked: true,
        lang: 'zh-CN', speaker: '求职者',
        text: "有一次，一位顾客买了一件礼物，但收到时已经损坏了，他非常生气。我先道歉，然后仔细听他描述问题，之后安排了免费换货，还给了他下次购物的折扣券。最后他很满意，还特地来感谢我。",
        interpretLang: 'en-AU', interpretLabel: 'English',
        goal: "Interpret the job seeker's answer into English.",
        goalZh: "将求职者的回答翻译成英文。",
        modelAnswer: "Once, a customer purchased a gift that arrived damaged and he was very upset. I started by apologising, then listened carefully to his concern, arranged a free replacement, and gave him a discount voucher for his next purchase. In the end he was very satisfied and actually came back to thank me personally.",
        keyPoints: ["damaged gift / angry customer", "apologised / listened", "free replacement", "discount voucher", "satisfied outcome"],
      },
      {
        id: 7, marked: true,
        lang: 'en-AU', speaker: 'HR Manager',
        text: "That's a great example. Now, this role involves shift work — early mornings, weekends, and public holidays. Are you comfortable with that kind of schedule?",
        interpretLang: 'zh-CN', interpretLabel: '普通话',
        goal: "Interpret the question about shift work into Mandarin.",
        goalZh: "将关于轮班工作的问题翻译成普通话。",
        modelAnswer: "这是个很好的例子。这份工作需要轮班，包括早班、周末以及公众假期。您能接受这样的工作安排吗？",
        keyPoints: ["shift work", "early mornings", "weekends / public holidays", "comfortable with schedule"],
      },
      {
        id: 8, marked: true,
        lang: 'zh-CN', speaker: '求职者',
        text: "没问题，我完全可以接受轮班。我目前的时间安排很灵活，随时可以配合公司的需要。",
        interpretLang: 'en-AU', interpretLabel: 'English',
        goal: "Interpret the job seeker's response into English.",
        goalZh: "将求职者的回答翻译成英文。",
        modelAnswer: "No problem, I'm completely comfortable with shift work. My schedule is very flexible at the moment and I can work whatever shifts the company needs.",
        keyPoints: ["fine with shifts", "flexible schedule", "can work as needed"],
      },
      {
        id: 9, marked: true,
        lang: 'en-AU', speaker: 'HR Manager',
        text: "Good. What would you say is your main weakness in a work context, and what are you doing to address it?",
        interpretLang: 'zh-CN', interpretLabel: '普通话',
        goal: "Interpret the weakness question into Mandarin.",
        goalZh: "将关于弱点的问题翻译成普通话。",
        modelAnswer: "好的。在工作方面，您认为自己最主要的弱点是什么？您目前在怎么克服它？",
        keyPoints: ["main weakness", "in a work context", "what are you doing to address it"],
      },
      {
        id: 10, marked: true,
        lang: 'zh-CN', speaker: '求职者',
        text: "我觉得我目前最大的挑战是在快节奏的环境下用英语流利沟通。但我一直在上英语课，也主动创造机会练习，比如主动找英语母语人士交流。我觉得这一年来进步很大。",
        interpretLang: 'en-AU', interpretLabel: 'English',
        goal: "Interpret the job seeker's answer into English.",
        goalZh: "将求职者的回答翻译成英文。",
        modelAnswer: "I think my biggest challenge at the moment is communicating fluently in English in a fast-paced environment. But I've been taking English classes and actively creating opportunities to practise — for example, seeking out conversations with native English speakers. I feel I've improved a lot over the past year.",
        keyPoints: ["English communication in fast-paced environment", "taking classes", "actively practising", "improved over past year"],
      },
      {
        id: 11, marked: true,
        lang: 'en-AU', speaker: 'HR Manager',
        text: "That's an honest and constructive answer — we appreciate that. We'll be in touch within the next few days regarding your application. Do you have any questions for us before we wrap up?",
        interpretLang: 'zh-CN', interpretLabel: '普通话',
        goal: "Interpret the manager's closing words and question into Mandarin.",
        goalZh: "将经理的结束语和提问翻译成普通话。",
        modelAnswer: "这是个很诚实、很有建设性的回答，我们很欣赏。我们会在接下来几天内通知您面试结果。在我们结束之前，您有什么想问我们的吗？",
        keyPoints: ["honest constructive answer / appreciated", "in touch in next few days", "any questions for us"],
      },
      {
        id: 12, marked: false,
        lang: 'zh-CN', speaker: '求职者',
        text: "有的，我想请问一下，新员工入职的时候会有培训吗？另外，这份工作有没有晋升的机会？",
        interpretLang: 'en-AU', interpretLabel: 'English',
        goal: "Interpret the job seeker's questions into English.",
        goalZh: "将求职者的问题翻译成英文。",
        modelAnswer: "Yes, I have a couple of questions. Is there a training programme for new employees? And are there opportunities for career progression in this role?",
        keyPoints: ["training for new employees", "career progression / promotion opportunities"],
      },
      {
        id: 13, marked: false,
        lang: 'en-AU', speaker: 'HR Manager',
        text: "Great questions — yes, we have a two-week paid induction training for all new staff, and we do have internal promotion pathways. Thank you so much for coming in today. We'll be in touch very soon.",
        interpretLang: 'zh-CN', interpretLabel: '普通话',
        goal: "Interpret the manager's final answer into Mandarin.",
        goalZh: "将经理的最终回答翻译成普通话。",
        modelAnswer: "问得很好——是的，我们为所有新员工提供为期两周的带薪入职培训，我们也有内部晋升通道。非常感谢您今天的到来，我们很快会联系您的。",
        keyPoints: ["two-week paid training", "internal promotion pathways", "thank you / in touch soon"],
      },
    ],
  },

  {
    id: 'community-centrelink',
    topic: 'Community Services',
    title: 'Centrelink — JobSeeker',
    scenario: 'A Chinese-speaking client visits Centrelink to apply for JobSeeker Payment. You are the interpreter.',
    scenarioZh: '一位说普通话的客户去Centrelink申请求职者付款。你是口译员。',
    segments: [
      {
        id: 1, marked: false,
        lang: 'en-AU', speaker: 'Centrelink Officer',
        text: "Good morning. Take a seat. I can see you've registered online — is this your first time applying for a Centrelink payment?",
        interpretLang: 'zh-CN', interpretLabel: '普通话',
        goal: "Interpret the officer's greeting and question into Mandarin.",
        goalZh: "将工作人员的问候和问题翻译成普通话。",
        modelAnswer: "早上好，请坐。我看到您已经在网上注册了——这是您第一次申请Centrelink的福利吗？",
        keyPoints: ["good morning / take a seat", "registered online", "first time applying"],
      },
      {
        id: 2, marked: false,
        lang: 'zh-CN', speaker: '客户',
        text: "是的，这是我第一次。我三周前失业了，现在需要一些经济上的支持。",
        interpretLang: 'en-AU', interpretLabel: 'English',
        goal: "Interpret into English: first time, lost job three weeks ago, needs financial support.",
        goalZh: "将客户的话翻译成英文。",
        modelAnswer: "Yes, this is my first time. I lost my job three weeks ago and I need some financial support.",
        keyPoints: ["first time", "lost job three weeks ago", "needs financial support"],
      },
      {
        id: 3, marked: true,
        lang: 'en-AU', speaker: 'Centrelink Officer',
        text: "I'm sorry to hear that. I can help you apply for JobSeeker Payment today. Can you tell me about your previous employment — your role, how long you worked there, and the reason for leaving?",
        interpretLang: 'zh-CN', interpretLabel: '普通话',
        goal: "Interpret the officer's question about previous employment into Mandarin.",
        goalZh: "将工作人员关于之前工作的问题翻译成普通话。",
        modelAnswer: "很抱歉听到这个消息。我今天可以帮您申请求职者付款。能告诉我您之前的工作情况吗——您的职位、做了多久，以及离职的原因？",
        keyPoints: ["sorry to hear", "apply for JobSeeker", "role / how long / reason for leaving"],
      },
      {
        id: 4, marked: true,
        lang: 'zh-CN', speaker: '客户',
        text: "我在一家物流公司做仓库包装工，做了四年。公司最近裁员，我整个部门都被裁掉了，我收到了四周的遣散费。",
        interpretLang: 'en-AU', interpretLabel: 'English',
        goal: "Interpret the client's employment history into English.",
        goalZh: "将客户的工作经历翻译成英文。",
        modelAnswer: "I worked as a warehouse packer at a logistics company for four years. The company recently had redundancies and my entire department was let go. I received four weeks of redundancy pay.",
        keyPoints: ["warehouse packer / logistics company", "four years", "whole department made redundant", "four weeks redundancy pay"],
      },
      {
        id: 5, marked: true,
        lang: 'en-AU', speaker: 'Centrelink Officer',
        text: "Because you received redundancy pay, there will be a waiting period before your payments begin — this is called a Liquid Assets Waiting Period. Do you understand what that means?",
        interpretLang: 'zh-CN', interpretLabel: '普通话',
        goal: "Interpret the explanation of the Liquid Assets Waiting Period into Mandarin.",
        goalZh: "将关于流动资产等待期的解释翻译成普通话。",
        modelAnswer: "由于您收到了遣散费，在开始发放福利金之前，您需要经历一段等待期——这叫做流动资产等待期。您明白这是什么意思吗？",
        keyPoints: ["redundancy pay causes waiting period", "Liquid Assets Waiting Period", "understand?"],
      },
      {
        id: 6, marked: true,
        lang: 'zh-CN', speaker: '客户',
        text: "不太明白。请问流动资产等待期是什么意思？我要等多久才能开始拿钱？",
        interpretLang: 'en-AU', interpretLabel: 'English',
        goal: "Interpret the client's question about the waiting period into English.",
        goalZh: "将客户关于等待期的问题翻译成英文。",
        modelAnswer: "I'm not quite sure I understand. Could you explain what the Liquid Assets Waiting Period means? And how long will I have to wait before I can start receiving payments?",
        keyPoints: ["doesn't understand", "asks for explanation", "asks how long the wait is"],
      },
      {
        id: 7, marked: true,
        lang: 'en-AU', speaker: 'Centrelink Officer',
        text: "Of course. A Liquid Assets Waiting Period means you need to use your own savings first before you can receive government support. The threshold for a single person is around two thousand dollars. Can you tell me how much you currently have in savings or investments?",
        interpretLang: 'zh-CN', interpretLabel: '普通话',
        goal: "Interpret the officer's explanation and question about savings into Mandarin.",
        goalZh: "将工作人员的解释和关于存款的问题翻译成普通话。",
        modelAnswer: "当然。流动资产等待期的意思是，在您能获得政府支持之前，需要先用完自己的积蓄。单身人士的门槛大约是两千澳元。您目前有多少存款或投资？",
        keyPoints: ["use own savings first", "threshold ~$2,000 for single person", "how much savings / investments"],
      },
      {
        id: 8, marked: true,
        lang: 'zh-CN', speaker: '客户',
        text: "我储蓄账户里大概有九千块钱。另外我有一辆二手车，大概值六千块左右。我现在和一个室友合租，每个月我这边付九百块的租金。",
        interpretLang: 'en-AU', interpretLabel: 'English',
        goal: "Interpret the client's financial situation into English.",
        goalZh: "将客户的财务情况翻译成英文。",
        modelAnswer: "I have about nine thousand dollars in my savings account. I also own a second-hand car worth around six thousand dollars. I'm renting with a housemate and my share of the rent is nine hundred dollars a month.",
        keyPoints: ["$9,000 savings", "second-hand car ~$6,000", "renting with housemate", "$900/month rent"],
      },
      {
        id: 9, marked: true,
        lang: 'en-AU', speaker: 'Centrelink Officer',
        text: "Thank you. The car generally won't count as a liquid asset, but your savings will be included. Now I need to explain your mutual obligation requirements — you'll need to actively look for work and apply for at least five jobs per fortnight. Does that make sense?",
        interpretLang: 'zh-CN', interpretLabel: '普通话',
        goal: "Interpret the officer's explanation of mutual obligation requirements into Mandarin.",
        goalZh: "将工作人员关于互惠义务要求的解释翻译成普通话。",
        modelAnswer: "谢谢。汽车通常不算流动资产，但您的存款会被计算在内。现在我需要跟您说明互惠义务要求——您需要积极找工作，每两周至少申请五份工作。您明白吗？",
        keyPoints: ["car not liquid asset", "savings included", "mutual obligation", "five jobs per fortnight"],
      },
      {
        id: 10, marked: true,
        lang: 'zh-CN', speaker: '客户',
        text: "明白。请问兼职或临时工的申请也算在这五份里面吗？还有，如果我找到了临时工作，我需要汇报给你们吗？",
        interpretLang: 'en-AU', interpretLabel: 'English',
        goal: "Interpret the client's questions about job types and income reporting into English.",
        goalZh: "将客户关于工作类型和收入汇报的问题翻译成英文。",
        modelAnswer: "Understood. Do part-time or casual job applications also count toward the five? And if I do pick up some casual work, do I need to report that to you?",
        keyPoints: ["part-time / casual count toward five", "need to report casual work income"],
      },
      {
        id: 11, marked: true,
        lang: 'en-AU', speaker: 'Centrelink Officer',
        text: "Yes, part-time and casual jobs count. And yes, you must report any income within fourteen days of earning it. If you don't, your payment could be suspended. Do you have any other questions before we move on to the paperwork?",
        interpretLang: 'zh-CN', interpretLabel: '普通话',
        goal: "Interpret the officer's answer and closing question into Mandarin.",
        goalZh: "将工作人员的回答和结束问题翻译成普通话。",
        modelAnswer: "是的，兼职和临时工都算在内。而且是的，您必须在收到收入后十四天内进行申报。如果没有申报，您的福利金可能会被暂停。在我们开始填表之前，您还有其他问题吗？",
        keyPoints: ["part-time / casual count", "report within 14 days", "payment suspended if not reported", "any other questions"],
      },
      {
        id: 12, marked: false,
        lang: 'zh-CN', speaker: '客户',
        text: "还有一个问题。我目前晚上在上英文课，这算不算是Centrelink批准的活动？",
        interpretLang: 'en-AU', interpretLabel: 'English',
        goal: "Interpret into English: the client asks if their evening English class counts as an approved Centrelink activity.",
        goalZh: "将客户的问题翻译成英文。",
        modelAnswer: "I have one more question. I'm currently attending an English class in the evenings — does that count as an approved activity with Centrelink?",
        keyPoints: ["evening English class", "counts as approved Centrelink activity"],
      },
      {
        id: 13, marked: false,
        lang: 'en-AU', speaker: 'Centrelink Officer',
        text: "Great initiative — English courses are often approved as a complementary activity, especially if they're structured and regular. I'll note that on your file. Alright, let's get started on the application. I'll need your passport, termination letter, and recent payslips.",
        interpretLang: 'zh-CN', interpretLabel: '普通话',
        goal: "Interpret the officer's positive response and document request into Mandarin.",
        goalZh: "将工作人员的积极回答和所需文件要求翻译成普通话。",
        modelAnswer: "很棒的主动性——英语课程通常可以被批准为辅助活动，特别是如果课程有系统性且定期上课的话。我会在您的档案里记录下来。好的，我们开始填写申请吧。我需要您的护照、解雇信和最近的工资单。",
        keyPoints: ["English course often approved", "will note on file", "passport / termination letter / payslips needed"],
      },
    ],
  },
];

const SCORE_PROMPT = (seg, transcript) => {
  const enToZh = seg.lang === 'en-AU';
  const direction = enToZh ? 'English → Mandarin Chinese' : 'Mandarin Chinese → English';
  const sourceLang = enToZh ? 'English' : 'Mandarin Chinese';
  const targetLang = enToZh ? 'Mandarin Chinese' : 'English';

  return `You are a NAATI CCL examiner assessing an interpretation attempt.

Direction: ${direction}
Source (what was spoken in ${sourceLang}):
"${seg.text}"

Candidate's interpretation (into ${targetLang}):
"${transcript}"

A model interpretation for reference:
"${seg.modelAnswer}"

Key information to transfer: ${seg.keyPoints.join(' | ')}

NAATI CCL 0–5 marking scale:
5 — All key information conveyed accurately and naturally
4 — Most key information conveyed; one minor omission or inaccuracy
3 — Key information partially conveyed; some omissions but core meaning understood
2 — Limited; significant omissions or errors affecting meaning
1 — Very little correct; largely unclear
0 — Nothing meaningful

${enToZh
  ? 'Evaluate the Chinese interpretation: is it accurate, natural, and complete?'
  : 'Evaluate the English interpretation: is it accurate, grammatically sound, and complete?'}

Respond with ONLY raw JSON (no markdown, no code fences):
{
  "score": <integer 0-5>,
  "passed": <boolean, true if score >= 3>,
  "feedback": "<2 sentences: specific and actionable>",
  "corrections": [
    { "said": "<what candidate said>", "better": "<improved version>", "why": "<brief>" }
  ],
  "keyPointsCovered": [
    { "point": "<key point>", "covered": <boolean> }
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

    if (pathname === '/api/dialogues') {
      return Response.json(
        DIALOGUES.map(({ id, topic, title, scenario, scenarioZh, segments }) => ({
          id, topic, title, scenario, scenarioZh,
          segmentCount: segments.length,
          scoredCount: segments.filter(s => s.marked).length,
        })),
        { headers: cors }
      );
    }

    const m = pathname.match(/^\/api\/dialogue\/(.+)$/);
    if (m) {
      const d = DIALOGUES.find(x => x.id === m[1]);
      if (!d) return new Response('Not found', { status: 404 });
      return Response.json(d, { headers: cors });
    }

    if (pathname === '/api/score' && request.method === 'POST') {
      try {
        const { dialogueId, segmentId, transcript } = await request.json();
        if (!transcript?.trim()) return Response.json({ error: 'No transcript' }, { status: 400, headers: cors });

        const dialogue = DIALOGUES.find(d => d.id === dialogueId);
        const segment  = dialogue?.segments.find(s => s.id === segmentId);
        if (!segment) return Response.json({ error: 'Not found' }, { status: 404, headers: cors });

        if (!env.DEEPSEEK_API_KEY) {
          return Response.json({ score: 4, passed: true, feedback: 'Demo mode.', corrections: [], keyPointsCovered: [] }, { headers: cors });
        }

        const resp = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'deepseek-chat', max_tokens: 600,
            messages: [{ role: 'user', content: SCORE_PROMPT(segment, transcript) }],
          }),
        });

        const ai = await resp.json();
        if (ai.error) return Response.json({ error: ai.error.message }, { status: 502, headers: cors });

        let raw = ai.choices?.[0]?.message?.content ?? '{}';
        const jm = raw.match(/\{[\s\S]*\}/);
        if (!jm) throw new Error('No JSON');
        const result = JSON.parse(jm[0]);
        result.score  = Math.max(0, Math.min(5, result.score ?? 0));
        result.passed = result.score >= 3;
        return Response.json(result, { headers: cors });
      } catch (e) {
        return Response.json({ error: e.message }, { status: 500, headers: cors });
      }
    }

    return env.ASSETS.fetch(request);
  },
};
