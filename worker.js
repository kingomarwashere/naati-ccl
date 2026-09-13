// NAATI CCL format:
// - 13 segments per dialogue (alternating English/Chinese speakers)
// - 9 segments are SCORED (marked: true), 4 are connector turns (marked: false)
// - Scored segments: 0–5 marks each → total 45 marks
// - Pass: 29/45

const DIALOGUES = [
  {
    id: 'health-gp',
    topic: 'Health',
    title: 'GP Consultation',
    scenario: 'You have been having severe headaches for three days and have gone to a GP.',
    scenarioZh: '你头痛剧烈已有三天，去看了全科医生。',
    segments: [
      {
        id: 1,
        speaker: 'Receptionist',
        marked: false,
        prompt: "Good morning. Welcome to Eastwood Medical Centre. How can I help you today?",
        goal: "Tell the receptionist you need to see a doctor about headaches.",
        goalZh: "告诉前台你需要看医生，原因是头痛。",
        modelAnswer: "Good morning. I'd like to see a doctor please. I've been having really bad headaches.",
        keyPoints: ["see a doctor", "headaches"],
      },
      {
        id: 2,
        speaker: 'Receptionist',
        marked: false,
        prompt: "Of course. Do you have a Medicare card or private health insurance with you today?",
        goal: "Say you have a Medicare card. Ask how long the wait will be.",
        goalZh: "说你有医疗保险卡。询问需要等多久。",
        modelAnswer: "Yes, I have my Medicare card here. How long will the wait be approximately?",
        keyPoints: ["Medicare card", "ask about wait time"],
      },
      {
        id: 3,
        speaker: 'Doctor',
        marked: true,
        prompt: "Good morning, come in and take a seat. Now, what brings you in today?",
        goal: "Describe your headaches: how long you've had them, how severe they are, and that you're worried.",
        goalZh: "描述你的头痛：持续时间、严重程度，以及你感到担忧。",
        modelAnswer: "I've been having really bad headaches for about three days now. They're quite severe — I'd say about an eight out of ten — and I'm a bit worried it might be something serious.",
        keyPoints: ["three days", "severe / how bad", "worried"],
      },
      {
        id: 4,
        speaker: 'Doctor',
        marked: true,
        prompt: "I see. Can you describe the pain? Where exactly is it, and does anything make it better or worse?",
        goal: "Say the pain is on the left side of your head. Bright light and loud noise make it much worse. Lying down in a dark room helps a little.",
        goalZh: "说疼痛在头部左侧。强光和噪音会加重头痛。躺在黑暗的房间里稍微有些帮助。",
        modelAnswer: "The pain is mainly on the left side of my head. It gets a lot worse when I'm around bright light or loud noise. Lying down in a dark, quiet room helps a little bit.",
        keyPoints: ["left side", "bright light / noise worse", "dark room helps"],
      },
      {
        id: 5,
        speaker: 'Doctor',
        marked: true,
        prompt: "Have you had any other symptoms — nausea, vomiting, blurred vision, or sensitivity to smell?",
        goal: "You've had nausea but no vomiting. Your vision has been slightly blurry at times. No sensitivity to smell.",
        goalZh: "你有恶心但没有呕吐。视力有时会稍微模糊。没有对气味敏感。",
        modelAnswer: "Yes, I've felt quite nauseous but I haven't actually vomited. My vision has been a little blurry sometimes, but I haven't noticed any sensitivity to smell.",
        keyPoints: ["nausea", "no vomiting", "blurry vision", "no smell sensitivity"],
      },
      {
        id: 6,
        speaker: 'Doctor',
        marked: false,
        prompt: "Alright. And have you taken anything for the pain?",
        goal: "You've been taking paracetamol — two tablets every four hours — but it's barely helping.",
        goalZh: "你一直在服用扑热息痛——每四小时两片——但几乎没什么效果。",
        modelAnswer: "I've been taking paracetamol — two tablets every four hours — but it's barely making a difference.",
        keyPoints: ["paracetamol", "dosage", "not helping"],
      },
      {
        id: 7,
        speaker: 'Doctor',
        marked: true,
        prompt: "Based on what you've described, your symptoms are quite consistent with migraines. Do you have a family history of migraines, and have you ever had anything like this before?",
        goal: "Your mother gets migraines. You had one episode about two years ago but it went away on its own and you didn't see a doctor.",
        goalZh: "你母亲有偏头痛。大约两年前你有过一次类似情况，但自行好转了，没有看医生。",
        modelAnswer: "Yes, my mother gets migraines. I did have a similar episode about two years ago, but it went away by itself so I didn't end up seeing a doctor about it.",
        keyPoints: ["family history (mother)", "previous episode two years ago", "resolved on its own"],
      },
      {
        id: 8,
        speaker: 'Doctor',
        marked: true,
        prompt: "I'd like to refer you to a neurologist for a full assessment. I'm also going to prescribe a stronger pain relief medication called sumatriptan, which is specifically designed for migraines. Do you have any allergies to medications?",
        goal: "You have no known drug allergies. Ask what the neurologist appointment will involve and how long you'll need to wait.",
        goalZh: "你没有已知的药物过敏。询问神经科预约包含什么内容，以及需要等多久。",
        modelAnswer: "No, I don't have any known allergies to medication. What will the neurologist appointment involve? And roughly how long will I need to wait to get in?",
        keyPoints: ["no allergies", "ask what appointment involves", "ask about wait time"],
      },
      {
        id: 9,
        speaker: 'Doctor',
        marked: false,
        prompt: "The waiting list for a neurologist can be anywhere from two to six weeks in the public system, though it may be faster if you go privately. The appointment will likely include a neurological examination and possibly an MRI scan.",
        goal: "Ask whether you'll need to take time off work and whether you can get a medical certificate.",
        goalZh: "询问你是否需要请假，以及能否获得病假证明。",
        modelAnswer: "I see. Will I need to take time off work for these appointments? And would you be able to give me a medical certificate?",
        keyPoints: ["time off work", "medical certificate"],
      },
      {
        id: 10,
        speaker: 'Doctor',
        marked: true,
        prompt: "Yes, I can give you a medical certificate for today's visit. In the meantime, I want you to try to keep a headache diary — note down when the headaches start, how long they last, what you were doing beforehand, and what you ate or drank.",
        goal: "Confirm you understand. Ask whether there's anything you should avoid eating or drinking that might trigger migraines.",
        goalZh: "确认你明白了。询问是否有任何你应该避免的食物或饮料，因为它们可能会引发偏头痛。",
        modelAnswer: "Yes, I understand. Should I be avoiding certain foods or drinks in the meantime? I've heard things like red wine and chocolate can sometimes trigger migraines.",
        keyPoints: ["understand diary", "ask about food/drink triggers"],
      },
      {
        id: 11,
        speaker: 'Doctor',
        marked: true,
        prompt: "Yes, that's a good point. Common triggers include red wine, aged cheeses, processed meats, caffeine, and skipping meals. Everyone is different though, which is why the diary will be helpful. Also make sure you're drinking enough water and getting regular sleep.",
        goal: "Ask whether stress can also be a trigger, as you have been under a lot of stress at work recently.",
        goalZh: "询问压力是否也可能是诱因，因为你最近工作压力很大。",
        modelAnswer: "Can stress also be a trigger? I've been under a lot of pressure at work lately and I'm wondering if that could be contributing to this.",
        keyPoints: ["ask about stress as trigger", "mention work stress"],
      },
      {
        id: 12,
        speaker: 'Doctor',
        marked: true,
        prompt: "Absolutely — stress is one of the most common migraine triggers. I'd strongly encourage you to look at ways to manage your stress levels. That might include exercise, mindfulness, or speaking to someone like a counsellor if the pressure at work is significant.",
        goal: "Thank the doctor. Ask if you should come back if the headaches get worse or if the sumatriptan doesn't work.",
        goalZh: "感谢医生。询问如果头痛加剧或舒马曲坦没有效果，是否应该回来复诊。",
        modelAnswer: "Thank you, that's really helpful. Should I come back to see you if the headaches get worse, or if the sumatriptan doesn't seem to be working?",
        keyPoints: ["thank doctor", "ask when to come back / if medication doesn't work"],
      },
      {
        id: 13,
        speaker: 'Doctor',
        marked: false,
        prompt: "Yes, definitely come back within a week if things haven't improved, or sooner if the pain becomes unbearable or you develop any new symptoms like sudden severe headache, confusion, or difficulty speaking. Those would need urgent attention.",
        goal: "Confirm you understand and say goodbye.",
        goalZh: "确认你明白了，然后道别。",
        modelAnswer: "Understood. I'll make sure to come back or go straight to emergency if I get any of those symptoms. Thanks very much for your help.",
        keyPoints: ["acknowledge warning symptoms", "thank and goodbye"],
      },
    ],
  },

  {
    id: 'employment-interview',
    topic: 'Employment',
    title: 'Job Interview',
    scenario: 'You are interviewing for a customer service role at a large supermarket. Answer in English.',
    scenarioZh: '你正在面试一家大型超市的客服职位。用英语回答。',
    segments: [
      {
        id: 1,
        speaker: 'HR Manager',
        marked: false,
        prompt: "Hi, come in and take a seat. Thanks for coming in today. Can I get you a glass of water before we start?",
        goal: "Accept or decline politely, then say you're happy to get started.",
        goalZh: "礼貌地接受或拒绝，然后表示你很乐意开始面试。",
        modelAnswer: "Thank you, I'm fine. I'm happy to get started whenever you're ready.",
        keyPoints: ["polite response", "ready to begin"],
      },
      {
        id: 2,
        speaker: 'HR Manager',
        marked: true,
        prompt: "Great. So, to start — can you tell me a bit about yourself and your background?",
        goal: "Introduce yourself: where you're from, how long you've been in Australia, your work experience, and one personal strength relevant to customer service.",
        goalZh: "介绍自己：你来自哪里，在澳大利亚待了多久，你的工作经历，以及一个与客服相关的个人优势。",
        modelAnswer: "Of course. I moved to Australia from China about two years ago. Back in China I worked in retail for three years, mostly in customer-facing roles at a large department store. I'm a very patient person and I genuinely enjoy helping people, which is why I'm drawn to customer service work.",
        keyPoints: ["background / where from", "time in Australia", "relevant work experience", "personal strength"],
      },
      {
        id: 3,
        speaker: 'HR Manager',
        marked: true,
        prompt: "That's great experience. Why are you interested in working here with us specifically?",
        goal: "Give a genuine reason — mention something specific about the company, or how it fits your goals.",
        goalZh: "给出真实的理由——提到公司的某些具体方面，或者说明它如何契合你的目标。",
        modelAnswer: "I've shopped here a number of times and I've always been impressed by how well-organised the store is and how friendly the staff are. I'd love to be part of a team that clearly takes customer experience seriously. I'm also hoping to improve my English further, and a customer-facing role would really help with that.",
        keyPoints: ["specific reason / knowledge of company", "motivated", "genuine interest"],
      },
      {
        id: 4,
        speaker: 'HR Manager',
        marked: true,
        prompt: "Can you tell me about a time you had to deal with a difficult or unhappy customer?",
        goal: "Give a specific example — explain the situation, what you did, and what the outcome was. Show patience and problem-solving.",
        goalZh: "举一个具体例子——说明情况、你做了什么，以及结果如何。展示耐心和解决问题的能力。",
        modelAnswer: "Sure. Once a customer came in very upset because an item they'd ordered for a gift hadn't arrived in time. I listened calmly, apologised sincerely, and then arranged for an express replacement and offered a small discount on their next purchase. They left satisfied and even thanked me for handling it so well.",
        keyPoints: ["specific situation described", "stayed calm / listened", "resolution", "positive outcome"],
      },
      {
        id: 5,
        speaker: 'HR Manager',
        marked: false,
        prompt: "Good. And what would you say are your main strengths when it comes to teamwork?",
        goal: "Mention two strengths: you communicate clearly, and you're reliable and always on time.",
        goalZh: "提到两个优势：你沟通清晰，并且可靠、守时。",
        modelAnswer: "I think my main strengths are communication and reliability. I always make sure I understand what's expected of me, and I'm very punctual — I've never missed a shift without giving proper notice.",
        keyPoints: ["communication", "reliability / punctual"],
      },
      {
        id: 6,
        speaker: 'HR Manager',
        marked: true,
        prompt: "What about weaknesses? Is there anything you're actively working to improve?",
        goal: "Give an honest but constructive weakness. Say you're still working on your confidence when speaking English in fast-paced situations, and explain what you're doing about it.",
        goalZh: "给出一个诚实但积极的弱点。说你仍在努力提高在快节奏情况下用英语表达的自信，并说明你在怎么做。",
        modelAnswer: "Honestly, I sometimes find it challenging to speak English very quickly in a busy, fast-paced environment. But I'm actively working on it — I've been taking English classes, and I try to put myself in situations where I need to speak English every day. I feel like I've improved a lot in the past year.",
        keyPoints: ["honest weakness", "related to English / communication", "taking action to improve", "progress noted"],
      },
      {
        id: 7,
        speaker: 'HR Manager',
        marked: true,
        prompt: "That's a great answer — we appreciate honesty. Now, this role will involve shift work, including some early morning starts and weekend shifts. Is that something you're comfortable with?",
        goal: "Confirm you're comfortable with shift work. Mention any genuine availability constraints if you have them, or say you're fully flexible.",
        goalZh: "确认你可以接受轮班工作。如果有可用时间的限制，请说明；或者说你时间完全灵活。",
        modelAnswer: "Yes, I'm absolutely fine with shift work, including early starts and weekends. I'm quite flexible with my schedule at the moment, so I'm happy to work around whatever shifts are needed.",
        keyPoints: ["comfortable with shifts", "mentions flexibility / availability"],
      },
      {
        id: 8,
        speaker: 'HR Manager',
        marked: false,
        prompt: "Perfect. We do also run mandatory training for all new staff in the first two weeks. It's paid, but it does require full attendance. Does that work for you?",
        goal: "Confirm that works for you and say you're happy to commit to the training.",
        goalZh: "确认这对你可行，并说你很乐意承诺参加培训。",
        modelAnswer: "Yes, that's completely fine. I understand that training is important and I'm happy to commit to attending all of it.",
        keyPoints: ["agrees to training", "positive attitude"],
      },
      {
        id: 9,
        speaker: 'HR Manager',
        marked: true,
        prompt: "Great. Now I'd like to give you a scenario. A customer comes to you and complains that a product they bought last week is faulty, but they no longer have the receipt. What would you do?",
        goal: "Explain your approach: listen to the customer, apologise, check if there's any record of the purchase (loyalty card, bank statement), and escalate to a supervisor if needed.",
        goalZh: "说明你的处理方式：聆听顾客，道歉，查看是否有购买记录（忠诚卡、银行对账单），如有必要上报主管。",
        modelAnswer: "I'd start by listening to the customer and apologising for the inconvenience. Then I'd ask if they paid by card or have a loyalty card — often we can look up the purchase that way. If we can verify the purchase, I'd process a replacement or refund according to store policy. If I wasn't sure what to do, I'd check with a supervisor rather than make a decision that could cause problems.",
        keyPoints: ["listen and apologise", "check for purchase record", "follow store policy", "escalate to supervisor"],
      },
      {
        id: 10,
        speaker: 'HR Manager',
        marked: true,
        prompt: "Excellent. And where do you see yourself in two to three years' time, career-wise?",
        goal: "Show ambition but be realistic. Say you'd like to grow within the company, perhaps move into a team leader or supervisory role over time.",
        goalZh: "展示抱负但要现实。说你希望在公司内发展，也许随着时间的推移进入团队领导或主管职位。",
        modelAnswer: "In two to three years, I'd love to have developed my skills and built up a strong understanding of how the business works. Ideally I'd be working toward a team leader or supervisory role. I'm genuinely keen to grow within the company rather than just job-hop.",
        keyPoints: ["growth ambition", "specific role mentioned", "committed to the company"],
      },
      {
        id: 11,
        speaker: 'HR Manager',
        marked: false,
        prompt: "That's great to hear. Before I wrap up, I just want to let you know that we'll be conducting a police check and a reference check as part of our standard process. Is that okay?",
        goal: "Confirm that's absolutely fine and that you're happy to provide references.",
        goalZh: "确认完全没问题，并说你很乐意提供推荐人。",
        modelAnswer: "Of course, that's no problem at all. I'm happy to provide references — I have a couple of former supervisors I can put you in touch with.",
        keyPoints: ["agrees to checks", "offers references"],
      },
      {
        id: 12,
        speaker: 'HR Manager',
        marked: true,
        prompt: "Perfect. That's very helpful. Do you have any questions for us before we finish?",
        goal: "Ask two thoughtful questions: one about training or career development, and one about the team culture.",
        goalZh: "问两个有深度的问题：一个关于培训或职业发展，一个关于团队文化。",
        modelAnswer: "Yes, I do. Firstly, are there opportunities for further training or development beyond the initial two weeks? And secondly, how would you describe the culture of the team here — is it quite collaborative?",
        keyPoints: ["asks about development / training", "asks about team culture", "shows genuine interest"],
      },
      {
        id: 13,
        speaker: 'HR Manager',
        marked: false,
        prompt: "Great questions. We do offer ongoing training and we have a very supportive team here. We'll be in touch within the next few days to let you know. Thanks so much for coming in.",
        goal: "Thank the interviewer warmly and say you look forward to hearing from them.",
        goalZh: "热情地感谢面试官，并说你期待收到他们的消息。",
        modelAnswer: "Thank you so much for your time today. I really enjoyed learning more about the role and the company. I look forward to hearing from you.",
        keyPoints: ["thanks interviewer", "positive closing"],
      },
    ],
  },

  {
    id: 'community-centrelink',
    topic: 'Community Services',
    title: 'Centrelink — JobSeeker',
    scenario: 'You were made redundant three weeks ago and have gone to Centrelink to apply for financial support.',
    scenarioZh: '三周前你被裁员，现在去Centrelink申请财务支持。',
    segments: [
      {
        id: 1,
        speaker: 'Centrelink Officer',
        marked: false,
        prompt: "Good morning. Take a seat. I can see you've registered online — is this your first time applying for a payment with us?",
        goal: "Confirm this is your first time applying. Briefly say why — you recently lost your job.",
        goalZh: "确认这是你第一次申请。简要说明原因——你最近失业了。",
        modelAnswer: "Yes, this is my first time. I was made redundant about three weeks ago, so this is all quite new to me.",
        keyPoints: ["first time", "made redundant", "three weeks ago"],
      },
      {
        id: 2,
        speaker: 'Centrelink Officer',
        marked: true,
        prompt: "I'm sorry to hear that. I can help you apply for the JobSeeker Payment today. To get started, can you tell me a little about your employment situation — how long you worked there and what your role was?",
        goal: "Say you worked as a warehouse packer at a logistics company for four years. The company downsized and your whole department was let go. You received four weeks redundancy pay.",
        goalZh: "说你在一家物流公司担任仓库包装工四年。公司缩减规模，整个部门被裁撤。你收到了四周的遣散费。",
        modelAnswer: "I worked as a warehouse packer at a logistics company for about four years. The company decided to downsize and my entire department was made redundant. I received four weeks of redundancy pay when I left.",
        keyPoints: ["role: warehouse packer", "four years", "company downsized / department redundant", "four weeks redundancy pay"],
      },
      {
        id: 3,
        speaker: 'Centrelink Officer',
        marked: true,
        prompt: "Thank you. Because you received redundancy pay, there will be a waiting period before your JobSeeker payments begin — this is called a Liquid Assets Waiting Period. Do you understand what that means?",
        goal: "Say you don't fully understand — ask what a Liquid Assets Waiting Period is and how long it will last in your case.",
        goalZh: "说你不完全明白——询问什么是流动资产等待期，以及在你的情况下需要等多久。",
        modelAnswer: "Not entirely, no. Could you explain what a Liquid Assets Waiting Period is? And in my situation, roughly how long would I need to wait before the payments start?",
        keyPoints: ["says doesn't understand", "asks what it is", "asks how long"],
      },
      {
        id: 4,
        speaker: 'Centrelink Officer',
        marked: false,
        prompt: "Certainly. A Liquid Assets Waiting Period means that if you have savings or assets above a certain threshold, you need to use those first before you can access government support. The threshold for a single person is around two thousand dollars. Do you have savings or other liquid assets?",
        goal: "You have about nine thousand dollars in a savings account and you own a second-hand car worth around six thousand dollars.",
        goalZh: "你在储蓄账户中有大约九千澳元，还拥有一辆价值约六千澳元的二手车。",
        modelAnswer: "Yes. I have about nine thousand dollars in my savings account. I also own a car, though it's a second-hand one worth around six thousand dollars.",
        keyPoints: ["$9,000 savings", "second-hand car ~$6,000"],
      },
      {
        id: 5,
        speaker: 'Centrelink Officer',
        marked: true,
        prompt: "Thank you for being upfront about that. The car is generally not counted as a liquid asset, but the savings will be. We'll need to verify those savings with a bank statement. Now, can you tell me about your current living situation? Do you rent or own, and do you have any dependants?",
        goal: "You rent a two-bedroom apartment with a housemate. You pay $900 per month in rent. You're single with no dependants.",
        goalZh: "你和一位室友合租一套两居室公寓。你每月支付900澳元的租金。你单身，没有被抚养人。",
        modelAnswer: "I rent a two-bedroom apartment with a housemate. My share of the rent is nine hundred dollars a month. I'm single and I don't have any dependants.",
        keyPoints: ["renting", "$900/month", "housemate", "single / no dependants"],
      },
      {
        id: 6,
        speaker: 'Centrelink Officer',
        marked: true,
        prompt: "Got it. Now I need to explain your obligations while you're receiving JobSeeker. You'll need to actively look for work and report your job search activities to us. You're required to apply for a minimum number of jobs each fortnight — currently that's five jobs per fortnight. Does that seem manageable?",
        goal: "Confirm you understand. Ask if part-time or casual jobs also count toward the five, and whether you need to apply for jobs outside your field.",
        goalZh: "确认你明白了。询问兼职或临时工作是否也算在这五个名额内，以及是否需要申请你专业领域以外的工作。",
        modelAnswer: "Yes, I understand. Do part-time or casual jobs also count toward the five applications? And am I expected to apply for jobs outside of my previous field, or can I focus on warehouse and logistics work?",
        keyPoints: ["understands requirement", "asks about part-time/casual", "asks about job type / field"],
      },
      {
        id: 7,
        speaker: 'Centrelink Officer',
        marked: false,
        prompt: "Good questions. Part-time and casual jobs do count. In the early stages, you can focus on jobs within your field, but if you haven't found work after a few months, you may be asked to broaden your search. You'll also need to sign a Job Plan with us today.",
        goal: "Ask what a Job Plan is and what it involves.",
        goalZh: "询问什么是就业计划以及它包含什么内容。",
        modelAnswer: "What exactly is a Job Plan? What does it involve?",
        keyPoints: ["asks what a Job Plan is"],
      },
      {
        id: 8,
        speaker: 'Centrelink Officer',
        marked: true,
        prompt: "A Job Plan is a personalised agreement between you and Centrelink outlining your obligations — things like how many jobs you'll apply for, whether you'll attend training, and any other activities we agree on. If you don't meet your obligations without a good reason, your payments can be suspended. Do you have any concerns about meeting these requirements?",
        goal: "Say you don't have concerns about the job search. But you're currently doing an online English course in the evenings — ask if that counts as an approved activity.",
        goalZh: "说你对找工作没有顾虑。但你目前晚上在上网上英语课——询问这是否算作批准的活动。",
        modelAnswer: "No, I don't have any concerns about the job applications. But I am currently doing an online English course in the evenings to improve my skills. Would that count as an approved activity under the Job Plan?",
        keyPoints: ["no concerns about job search", "mentions English course", "asks if it counts as approved activity"],
      },
      {
        id: 9,
        speaker: 'Centrelink Officer',
        marked: true,
        prompt: "That's a great initiative. English language courses are often approved activities under the Job Plan, especially if they're formal and structured. I'll note that down. Now, I need to remind you that you must report any income you earn — even one shift of casual work — within fourteen days of earning it. Do you understand?",
        goal: "Confirm you understand. Ask what happens to your payment if you pick up a casual shift — will you lose the whole payment or just have it reduced?",
        goalZh: "确认你明白了。询问如果你做了临时工作，会发生什么——你会失去全部付款还是仅减少部分？",
        modelAnswer: "Yes, I understand I need to report any income. If I do pick up a casual shift, will my payment be completely cut off or will it just be reduced based on what I earned?",
        keyPoints: ["understands reporting requirement", "asks if payment reduced or cut off"],
      },
      {
        id: 10,
        speaker: 'Centrelink Officer',
        marked: false,
        prompt: "Your payment won't be cut off entirely — it will be reduced based on how much you earn. There's a certain amount you can earn before your payment is affected, called the income free area. Above that, your payment reduces by fifty cents for every dollar you earn.",
        goal: "Ask what the income free area is — how much can you earn before the payment starts being reduced?",
        goalZh: "询问免收入区是多少——你可以赚多少钱，然后才开始减少付款？",
        modelAnswer: "What is the income free area exactly? How much can I earn in a fortnight before my payment starts being reduced?",
        keyPoints: ["asks about income free area amount"],
      },
      {
        id: 11,
        speaker: 'Centrelink Officer',
        marked: true,
        prompt: "It changes from time to time but at the moment it's around three hundred and fifty dollars per fortnight. Anything you earn above that will reduce your payment. Now, I want to make sure you have all the documents we need today — we need proof of identity, your bank details, your termination letter, and three months of payslips. Do you have all of those with you?",
        goal: "You have your passport, bank details, and termination letter. You only have two months of payslips, not three. Ask if that's okay or what you should do.",
        goalZh: "你带了护照、银行信息和解雇信。但你只有两个月的工资单，而不是三个月。询问这样可以吗，或者你应该怎么做。",
        modelAnswer: "I have my passport, bank details, and my termination letter. But I only have two months of payslips with me, not three. Is that going to be okay, or do I need to get another one?",
        keyPoints: ["has passport, bank details, termination letter", "only two months payslips", "asks if that's okay"],
      },
      {
        id: 12,
        speaker: 'Centrelink Officer',
        marked: true,
        prompt: "Two months is fine to get started. We can follow up on the third payslip later. Everything is looking good. Your payments should begin after your Liquid Assets Waiting Period has been calculated — we'll send you a letter in the next five to seven business days confirming everything. Is there anything else you'd like to ask or clarify before we finish?",
        goal: "Ask two things: whether you'll be contacted if there's a problem with your application, and whether there are any job search resources or employment services Centrelink recommends.",
        goalZh: "询问两件事：如果申请有问题，是否会联系你；以及Centrelink是否推荐任何求职资源或就业服务。",
        modelAnswer: "Thank you. Two questions — if there's any problem with my application, will someone contact me? And does Centrelink recommend any job search services or employment agencies that might help me find work faster?",
        keyPoints: ["asks about contact if problems", "asks about job search resources / employment services"],
      },
      {
        id: 13,
        speaker: 'Centrelink Officer',
        marked: false,
        prompt: "Yes, we'll contact you by letter or phone if there's anything we need. And yes — we can refer you to a Jobactive provider, which is a free employment service that helps people find work. I'll include some information about that in your letter. Is there anything else?",
        goal: "Thank the officer and say you feel a lot clearer now about the process.",
        goalZh: "感谢工作人员，并说你现在对整个流程清楚多了。",
        modelAnswer: "No, that's everything. Thank you so much — I feel a lot clearer about the process now. I really appreciate your help.",
        keyPoints: ["thanks officer", "positive closing"],
      },
    ],
  },
];

// Scoring: NAATI CCL 0–5 per segment
const SCORE_PROMPT = (seg, transcript, scenario) => `You are a NAATI CCL examiner assessing a language learner's spoken English response.

SCENARIO: ${scenario}

WHAT THE OTHER PERSON SAID:
"${seg.prompt}"

WHAT THE LEARNER NEEDED TO COMMUNICATE:
${seg.goal}

KEY POINTS TO COVER: ${seg.keyPoints.join(' | ')}

EXAMPLE OF A GOOD RESPONSE:
"${seg.modelAnswer}"

THE LEARNER'S ACTUAL RESPONSE (speech-to-text):
"${transcript}"

Score this response using the NAATI CCL 0–5 marking scale:
5 — All key information conveyed accurately and naturally. Minor slips only.
4 — Most key information conveyed. One minor omission or slight inaccuracy but meaning is clear.
3 — Key information partially conveyed. Some omissions or inaccuracies but core message understood.
2 — Limited information conveyed. Significant omissions or errors affecting meaning.
1 — Very little relevant information. Largely unclear or off-topic.
0 — Nothing meaningful conveyed, or no response.

Be realistic and strict — a 5 requires genuinely fluent, complete English. A learner who covers most points but with grammar errors should get 3–4.

Respond with ONLY a raw JSON object (no markdown, no code fences):
{
  "score": <integer 0-5>,
  "passed": <boolean, true if score >= 3>,
  "feedback": "<2 sentences: specific, encouraging, actionable>",
  "corrections": [
    { "said": "<exact phrase>", "better": "<natural English>", "why": "<brief>" }
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

    const matchOne = pathname.match(/^\/api\/dialogue\/(.+)$/);
    if (matchOne) {
      const d = DIALOGUES.find(x => x.id === matchOne[1]);
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
            model: 'deepseek-chat',
            max_tokens: 600,
            messages: [{ role: 'user', content: SCORE_PROMPT(segment, transcript, dialogue.scenario) }],
          }),
        });

        const ai = await resp.json();
        if (ai.error) return Response.json({ error: ai.error.message }, { status: 502, headers: cors });

        let raw = ai.choices?.[0]?.message?.content ?? '{}';
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON in response');
        const result = JSON.parse(jsonMatch[0]);
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
