import type { LearningModule, Lesson, ModuleId } from "@/types";

const PRIVACY_HELPER =
  "Keep it simple. Please don't include dates, case numbers, names of other people, or details about your case. Your answer stays on this device.";

/* ================================================================== */
/* Module 1: Technology Skills                                         */
/* ================================================================== */

const technologyLessons: Lesson[] = [
  {
    id: "tech-1",
    moduleId: "technology",
    order: 1,
    title: "Setting Up Your Phone",
    subtitle: "Get comfortable with the device that will help you most.",
    minutes: 5,
    missionTitle: "Learn Smartphone Basics",
    blocks: [
      {
        type: "paragraph",
        text: "Your phone is one of your most useful tools after release. It holds your appointments, your contacts, your job search, and your support people. If phones have changed a lot since you last used one, that is normal. You can learn this.",
      },
      { type: "heading", text: "The first things to set up" },
      {
        type: "steps",
        items: [
          "Turn the phone on. Hold the side button until the screen lights up.",
          "Connect to Wi-Fi. Open Settings, tap Wi-Fi, pick a network, and type the password.",
          "Set a screen lock. Choose a 6-digit code you will remember but others won't guess.",
          "Create or sign in to your account. iPhones use an Apple ID. Android phones use a Google account.",
          "Write your account email and password on paper. Keep it somewhere safe.",
        ],
      },
      {
        type: "tip",
        title: "Free and low-cost phones",
        text: "You may qualify for a free or low-cost phone plan through the federal Lifeline program. Ask your case manager or a reentry program how to apply.",
      },
      { type: "heading", text: "Save your key contacts" },
      {
        type: "bullets",
        items: [
          "Your probation or parole officer, if you have one",
          "Your case manager or reentry worker",
          "Two or three people you trust",
          "Your doctor, clinic, or counselor",
          "211 Maine for help finding local services",
        ],
      },
      {
        type: "example",
        title: "How Marcus did it",
        text: "Marcus learned one skill a night. Monday was unlocking. Tuesday was texting. Wednesday was saving contacts. By Sunday, he was setting his own reminders. Small steps add up fast.",
      },
      {
        type: "tip",
        title: "Use reminders",
        text: "When someone gives you an appointment time, add it to your Calendar app right away. Set an alert for one day before and one hour before.",
      },
    ],
    keyTakeaways: [
      "A screen lock keeps your personal information safe.",
      "Save important contacts so you can reach help fast.",
      "Calendar reminders help you never miss an appointment.",
    ],
    activity: {
      type: "checklist",
      title: "Phone setup checklist",
      instructions: "Check off each step as you finish it. It's okay to come back later for the rest.",
      items: [
        "Turn on the phone and connect to Wi-Fi",
        "Set a screen lock code",
        "Create or sign in to an Apple ID or Google account",
        "Write down your account email and password and keep it safe",
        "Save at least 5 important contacts",
        "Add one appointment to your calendar with a reminder",
        "Send a test text to someone you trust",
      ],
    },
    reflection: {
      prompt: "What is one thing you want your phone to help you do in your first month home?",
      helper: PRIVACY_HELPER,
    },
    mentorStoryId: "mentor-01",
    skills: ["Set up and secure a smartphone", "Save contacts and set reminders"],
  },
  {
    id: "tech-2",
    moduleId: "technology",
    order: 2,
    title: "Computer Basics",
    subtitle: "Mouse, keyboard, files, and the internet, one step at a time.",
    minutes: 6,
    missionTitle: "Learn Computer Basics",
    blocks: [
      {
        type: "paragraph",
        text: "Many job applications, forms, and classes happen on a computer. Public libraries, CareerCenters, and adult education programs have free computers you can use. Here are the basics to get you started.",
      },
      { type: "heading", text: "The main parts" },
      {
        type: "bullets",
        items: [
          "Mouse or trackpad: moves the arrow on the screen. Click once to select. Click twice to open.",
          "Keyboard: types letters. Shift makes capital letters. Backspace deletes.",
          "Browser: the program you use to visit websites, like Chrome, Edge, or Safari.",
          "Address bar: the long box at the top of the browser where you type a website address.",
        ],
      },
      { type: "heading", text: "Saving and finding a file" },
      {
        type: "steps",
        items: [
          "When you finish a document, click File, then Save As.",
          "Give it a clear name, like Resume-2026 or Cover-Letter-Warehouse.",
          "Pick one folder to keep everything, like Documents.",
          "Click Save.",
          "To find it later, open the Documents folder and look for the name.",
        ],
      },
      {
        type: "tip",
        title: "Using a shared computer",
        text: "At a library, always sign out of your email and other accounts when you are done. Close the browser window. This keeps others from getting into your accounts.",
      },
      {
        type: "example",
        title: "Rosa's first week",
        text: "On day one, Rosa only learned to use the mouse. She almost quit. By week four she could type and save a letter. Everyone starts somewhere, and slow progress is still progress.",
      },
      {
        type: "tip",
        title: "Keep your files with you",
        text: "Save important files to a free cloud account, like Google Drive, so you can open them from any computer.",
      },
    ],
    keyTakeaways: [
      "Free computers are available at libraries and CareerCenters.",
      "Give files clear names and keep them in one folder.",
      "Always sign out when you use a shared computer.",
    ],
    activity: {
      type: "quiz",
      title: "Computer basics check",
      instructions: "Pick the best answer for each question.",
      questions: [
        {
          prompt: "Where do you type a website address?",
          options: ["In the address bar at the top of the browser", "In a Word document", "In the Recycle Bin", "On the desktop background"],
          correctIndex: 0,
          explanation: "The address bar at the top of your browser is where website addresses go.",
        },
        {
          prompt: "Which file name will be easiest to find later?",
          options: ["Document1", "asdfgh", "Resume-Warehouse-Job", "New file (3)"],
          correctIndex: 2,
          explanation: "A clear name tells you exactly what is inside, so you can find it fast.",
        },
        {
          prompt: "You finish using a library computer. What should you do?",
          options: ["Just walk away", "Sign out of your accounts and close the browser", "Turn off the monitor only", "Leave your email open for the next person"],
          correctIndex: 1,
          explanation: "Signing out keeps your accounts and personal information private.",
        },
      ],
    },
    reflection: {
      prompt: "Where could you get free time on a computer near where you will live?",
      helper: PRIVACY_HELPER,
    },
    mentorStoryId: "mentor-04",
    skills: ["Use a mouse, keyboard, and web browser", "Save and organize files"],
  },
  {
    id: "tech-3",
    moduleId: "technology",
    order: 3,
    title: "Using Email",
    subtitle: "Make an account and send messages that make a good first impression.",
    minutes: 6,
    missionTitle: "Send Your First Email",
    blocks: [
      {
        type: "paragraph",
        text: "Employers, landlords, and programs often reach out by email. Having your own email address is a big step. It is free, and it takes about ten minutes to set up.",
      },
      { type: "heading", text: "Pick a professional address" },
      {
        type: "bullets",
        items: [
          "Use your name: firstname.lastname@gmail.com",
          "If it is taken, add a number: firstname.lastname88@gmail.com",
          "Skip nicknames, jokes, or anything you would not want a boss to see",
        ],
      },
      { type: "heading", text: "Parts of an email" },
      {
        type: "steps",
        items: [
          "To: the person's email address. Double-check the spelling.",
          "Subject: a short title, like Application for Kitchen Helper.",
          "Greeting: Hello Ms. Smith, or Hello Hiring Team,",
          "Message: two to four short sentences.",
          "Closing: Thank you, then your full name and phone number.",
        ],
      },
      {
        type: "example",
        title: "A simple job email",
        text: "Subject: Application for Kitchen Helper. Hello Hiring Team, I am writing to apply for the Kitchen Helper job. I have two years of kitchen experience and a food safety certificate. My resume is attached. Thank you for your time. Denise Roberts, 207-555-0147.",
      },
      {
        type: "tip",
        title: "Attaching a file",
        text: "Look for the paperclip icon. Click it, find your file, and click Open. Wait until you see the file name in your message before you hit Send.",
      },
      {
        type: "tip",
        title: "Check your inbox often",
        text: "Try to check your email once a day. Look in the Spam folder too. Sometimes good news ends up there by mistake.",
      },
    ],
    keyTakeaways: [
      "Use a simple email address with your name.",
      "Always write a clear subject line.",
      "Check your inbox and spam folder every day.",
    ],
    activity: {
      type: "quiz",
      title: "Email check",
      instructions: "Pick the best answer for each question.",
      questions: [
        {
          prompt: "Which email address is best for job hunting?",
          options: ["partyking207@email.com", "jordan.miller@gmail.com", "xXx_darkwolf_xXx@email.com", "hey_its_me@email.com"],
          correctIndex: 1,
          explanation: "An address with your name looks professional and is easy to remember.",
        },
        {
          prompt: "What is a good subject line when applying for a job?",
          options: ["hi", "(no subject)", "Application for Warehouse Associate", "PLEASE READ!!!"],
          correctIndex: 2,
          explanation: "A clear subject tells the reader what your email is about before they open it.",
        },
        {
          prompt: "You are waiting to hear back from an employer, but your inbox is empty. What should you check?",
          options: ["The Spam folder", "The Trash only", "Nothing, just wait", "Your phone's camera roll"],
          correctIndex: 0,
          explanation: "Real emails sometimes land in Spam. Check it every day or two.",
        },
      ],
    },
    reflection: {
      prompt: "Who is the first person you would like to email once your account is set up?",
      helper: PRIVACY_HELPER,
    },
    mentorStoryId: "mentor-02",
    skills: ["Create a professional email account", "Write and send an email with an attachment"],
  },
  {
    id: "tech-4",
    moduleId: "technology",
    order: 4,
    title: "Staying Safe Online",
    subtitle: "Spot scams and protect your accounts.",
    minutes: 6,
    missionTitle: "Protect Yourself Online",
    blocks: [
      {
        type: "paragraph",
        text: "The internet is full of good things. It also has people trying to trick you. Scammers often target people who are new to phones or just opened a bank account. A few simple habits keep you safe.",
      },
      { type: "heading", text: "Signs of a scam" },
      {
        type: "bullets",
        items: [
          "It rushes you: Act now or your account will close!",
          "It asks for a password, PIN, or a code sent to your phone",
          "It asks you to pay with gift cards or a money app",
          "It offers a job or prize that sounds too good to be true",
          "It has a strange link or spelling mistakes",
        ],
      },
      {
        type: "example",
        title: "The fake bank text",
        text: "Tyler got a text saying his bank account was locked, with a link to fix it. Instead of clicking, he called the number on the back of his bank card. The bank never sent it. It was a scam.",
      },
      { type: "heading", text: "Protect your accounts" },
      {
        type: "steps",
        items: [
          "Use a different password for your email and your bank.",
          "Make passwords long. A short phrase works well, like BlueTruckMorningCoffee.",
          "Turn on two-step login in your account settings.",
          "Never share a code that is texted to you. Real companies will not ask for it.",
        ],
      },
      {
        type: "tip",
        title: "Think before you post",
        text: "Employers may look at your social media. Keep posts respectful. Don't share your address, your schedule, or private details.",
      },
      {
        type: "tip",
        title: "When in doubt, check it out",
        text: "If something feels off, stop. Call the company using a number you find yourself, or ask someone you trust to look at it with you.",
      },
    ],
    keyTakeaways: [
      "Scams rush you and ask for passwords, codes, or gift cards.",
      "Use strong, different passwords and turn on two-step login.",
      "When unsure, contact the company directly using a number you trust.",
    ],
    activity: {
      type: "quiz",
      title: "Scam or safe?",
      instructions: "Pick the safest choice for each situation.",
      questions: [
        {
          prompt: "A text says your bank account is locked and gives a link to fix it. What do you do?",
          options: ["Click the link fast", "Reply with your PIN", "Call the number on the back of your bank card", "Forward it to friends"],
          correctIndex: 2,
          explanation: "Always contact your bank using a number you already trust, not a link in a surprise text.",
        },
        {
          prompt: "Someone offers you a job but wants you to pay $100 in gift cards first. This is:",
          options: ["A normal hiring step", "Almost certainly a scam", "A good deal", "Required by law"],
          correctIndex: 1,
          explanation: "Real employers do not ask you to pay to get a job, and never with gift cards.",
        },
        {
          prompt: "Which password is strongest?",
          options: ["123456", "password", "YourFirstName", "GreenCanoeSundayMorning"],
          correctIndex: 3,
          explanation: "A long phrase of random words is hard to guess and easy to remember.",
        },
      ],
    },
    reflection: {
      prompt: "What is one habit you will use to stay safe online?",
      helper: PRIVACY_HELPER,
    },
    mentorStoryId: "mentor-03",
    skills: ["Recognize common online scams", "Create strong passwords and use two-step login"],
  },
  {
    id: "tech-5",
    moduleId: "technology",
    order: 5,
    title: "Searching and Applying for Jobs Online",
    subtitle: "Find openings, apply with confidence, and follow up.",
    minutes: 7,
    missionTitle: "Apply for a Job Online",
    blocks: [
      {
        type: "paragraph",
        text: "Most jobs today ask you to apply online. It can feel like sending applications into a black hole. But with a plan, you can apply smarter and keep your hope up.",
      },
      { type: "heading", text: "Where to look" },
      {
        type: "bullets",
        items: [
          "Maine JobLink, the state's free job board",
          "Big job sites like Indeed",
          "Company websites. Look for a Careers or Jobs link at the bottom of the page",
          "Your local CareerCenter, where staff can help you in person for free",
        ],
      },
      { type: "heading", text: "How to apply" },
      {
        type: "steps",
        items: [
          "Read the whole job post. Note the skills they want.",
          "Make an account on the site. Save your login on paper.",
          "Upload your resume, or type your work history into the form.",
          "Answer every question honestly. Take your time.",
          "Before you click Submit, read it all once more for typos.",
          "Write down the job, the company, and the date you applied.",
        ],
      },
      {
        type: "tip",
        title: "Set up job alerts",
        text: "Most job sites let you save a search, like warehouse jobs near Waterville. They will email you when new jobs are posted.",
      },
      {
        type: "example",
        title: "James's follow-up",
        text: "About a week after applying, James sent a short email: Hello, I applied for the Delivery Driver job last week and wanted to say I am still very interested. Thank you for your time. The manager said that email is why she called him.",
      },
      {
        type: "tip",
        title: "Keep going",
        text: "It is normal to apply to many jobs before getting a call. Every application is practice. Each no brings you closer to yes.",
      },
    ],
    keyTakeaways: [
      "Use job boards, company sites, and your local CareerCenter.",
      "Track every job you apply for.",
      "A short, polite follow-up can help you stand out.",
    ],
    activity: {
      type: "quiz",
      title: "Job search check",
      instructions: "Pick the best answer for each question.",
      questions: [
        {
          prompt: "Where can you get free, in-person help with online job applications in Maine?",
          options: ["A CareerCenter", "A car dealership", "A bank", "Nowhere"],
          correctIndex: 0,
          explanation: "Maine CareerCenters offer free help with job searches, resumes, and applications.",
        },
        {
          prompt: "What should you do right before clicking Submit?",
          options: ["Close your eyes and hope", "Read everything once more for mistakes", "Leave half the questions blank", "Log out without saving"],
          correctIndex: 1,
          explanation: "A quick review catches typos and missing answers.",
        },
        {
          prompt: "When is a good time to send a follow-up email?",
          options: ["Ten minutes after applying", "About a week after applying", "Every single day", "Never"],
          correctIndex: 1,
          explanation: "About a week shows interest without being pushy.",
        },
      ],
    },
    reflection: {
      prompt: "What kind of job would you like to apply for first, and why?",
      helper: PRIVACY_HELPER,
    },
    mentorStoryId: "mentor-05",
    skills: ["Search for jobs on job boards and company sites", "Complete and track online applications"],
  },
];

/* ================================================================== */
/* Module 2: Support Network                                           */
/* ================================================================== */

const supportLessons: Lesson[] = [
  {
    id: "support-1",
    moduleId: "support-network",
    order: 1,
    title: "Take Stock of Who's There",
    subtitle: "Notice the people already in your corner.",
    minutes: 5,
    missionTitle: "Map Your Support",
    blocks: [
      {
        type: "paragraph",
        text: "People with strong support tend to do better after release. The good news is you probably have more support than you think. This lesson helps you see it.",
      },
      { type: "heading", text: "Kinds of support" },
      {
        type: "bullets",
        items: [
          "Practical support: rides, a place to stay, help with forms",
          "Emotional support: someone who listens without judging",
          "Guidance: someone who has been there, like a mentor or sponsor",
          "Professional support: case managers, counselors, doctors",
        ],
      },
      {
        type: "paragraph",
        text: "One person does not have to do it all. Your cousin might be great for rides. A counselor might be great for hard feelings. A friend from group might be great for a laugh.",
      },
      {
        type: "example",
        title: "Linda's list",
        text: "Linda first wrote down two names. Then she remembered the chaplain, a woman from her GED class, a cousin who wrote letters, and her sponsor. She ended up with eleven people.",
      },
      { type: "heading", text: "Healthy or not?" },
      {
        type: "bullets",
        items: [
          "Healthy support respects your goals and your boundaries.",
          "It makes you feel steadier, not more stressed.",
          "It is okay to step back from people who pull you toward old patterns.",
        ],
      },
      {
        type: "tip",
        title: "Put it on paper",
        text: "Write your support list on paper and keep a copy in your wallet. Phones get lost or run out of battery.",
      },
    ],
    keyTakeaways: [
      "Support comes in different kinds, and no one person has to do it all.",
      "You likely have more people in your corner than you think.",
      "Healthy support helps you move toward your goals.",
    ],
    activity: {
      type: "checklist",
      title: "My support snapshot",
      instructions: "Check each one you have, or can think of someone for. Blanks are just ideas for later, not failures.",
      items: [
        "Someone I can call when I feel low",
        "Someone who could give me a ride",
        "Someone who could help with paperwork or forms",
        "A professional, like a case manager or counselor",
        "Someone who has been through reentry or recovery",
        "A place where I feel welcome, like a group or faith community",
        "A written copy of my support list",
      ],
    },
    reflection: {
      prompt: "Who is one person you are grateful for right now, and what do they bring to your life?",
      helper: "You can use a first name or just a role, like my aunt or my counselor. Please don't include dates or details about your case.",
    },
    mentorStoryId: "mentor-11",
    skills: ["Identify types of support", "Map a personal support network"],
  },
  {
    id: "support-2",
    moduleId: "support-network",
    order: 2,
    title: "Finding New Support",
    subtitle: "Where to meet people who want to see you succeed.",
    minutes: 6,
    missionTitle: "Find a New Connection",
    blocks: [
      {
        type: "paragraph",
        text: "Coming home can mean leaving old friends behind. That can feel lonely. But Maine has many places where people welcome you and want to help you grow.",
      },
      { type: "heading", text: "Places to connect" },
      {
        type: "bullets",
        items: [
          "Reentry programs and peer mentor programs",
          "Recovery community centers and meetings",
          "Faith communities, many with reentry ministries",
          "Volunteer groups, like food pantries or community gardens",
          "Free classes at the library or adult education",
          "Sports leagues and clubs at community centers",
        ],
      },
      {
        type: "example",
        title: "Hector at the garden",
        text: "Hector saw a library flyer for a community garden. He showed up with work gloves. Nobody asked about his past. By the end of summer, he had new friends, a job lead, and a place he belonged.",
      },
      { type: "heading", text: "Making the first visit easier" },
      {
        type: "steps",
        items: [
          "Pick one place to try this week.",
          "Look up the time and address, or call 211 Maine to ask what is near you.",
          "Bring a friend if you can.",
          "It is okay to just listen the first time.",
          "Try it at least twice before you decide.",
        ],
      },
      {
        type: "tip",
        title: "Use your skills",
        text: "Pick a place where you can use something you are already good at, like cooking, fixing things, or organizing. It makes it easier to jump in.",
      },
    ],
    keyTakeaways: [
      "New, healthy connections are out there waiting.",
      "Volunteering and groups are great ways to meet people.",
      "Give a new place at least two tries.",
    ],
    activity: {
      type: "quiz",
      title: "Finding support",
      instructions: "Pick the best answer for each question.",
      questions: [
        {
          prompt: "You feel nervous about going to a new support group. What is a good plan?",
          options: ["Skip it forever", "Go, and it is okay to just listen at first", "Only go if you know everyone", "Wait until you feel perfect"],
          correctIndex: 1,
          explanation: "Listening is a great way to start. Most people felt nervous their first time too.",
        },
        {
          prompt: "What free phone number in Maine can help you find local services and groups?",
          options: ["411", "211", "611", "311"],
          correctIndex: 1,
          explanation: "211 Maine connects you with local programs and services.",
        },
        {
          prompt: "Which is a healthy way to meet new people?",
          options: ["Going back to old hangouts", "Volunteering at a food pantry", "Staying home every night", "Waiting for people to find you"],
          correctIndex: 1,
          explanation: "Volunteering puts you around people who care about helping others.",
        },
      ],
    },
    reflection: {
      prompt: "What is one place you would like to try, and what would help you take the first step?",
      helper: PRIVACY_HELPER,
    },
    mentorStoryId: "mentor-16",
    skills: ["Find community groups and programs", "Build new healthy connections"],
  },
  {
    id: "support-3",
    moduleId: "support-network",
    order: 3,
    title: "Reaching Out",
    subtitle: "Write a message to reconnect or ask for help.",
    minutes: 6,
    missionTitle: "Draft a Reach-Out Message",
    blocks: [
      {
        type: "paragraph",
        text: "Reaching out can be one of the hardest steps. Maybe you worry about what they will say. Maybe it has been a long time. That is okay. A short, kind message is a great place to start.",
      },
      { type: "heading", text: "What makes a good first message" },
      {
        type: "bullets",
        items: [
          "Keep it short. Two to four sentences.",
          "Be honest and warm.",
          "Skip the long apology. You can talk more later.",
          "Make one small, clear ask, or no ask at all.",
          "Give them space to answer when they are ready.",
        ],
      },
      {
        type: "example",
        title: "Derek's text to his brother",
        text: "I have been thinking about you. I am doing well and working hard on myself. I would like to talk when you are ready. Four days later, his brother wrote back: I'd like that.",
      },
      { type: "heading", text: "Asking for help" },
      {
        type: "paragraph",
        text: "When you ask for help, be specific. Instead of Can you help me sometime?, try Could you give me a ride to my appointment Tuesday at 10? Clear asks are easier to say yes to.",
      },
      {
        type: "tip",
        title: "If they don't reply",
        text: "Silence is not always a no. People may need time. If you don't hear back, that is not a reflection of your worth. Lean on the other people on your list.",
      },
      {
        type: "tip",
        title: "Check your conditions",
        text: "If you are on probation or parole, check whether there are any rules about who you can contact before you reach out.",
      },
    ],
    keyTakeaways: [
      "Short, warm messages work best.",
      "Specific asks are easier for people to say yes to.",
      "Give people time, and keep leaning on your wider support.",
    ],
    activity: {
      type: "builder",
      title: "Write your reach-out message",
      instructions: "Fill in each part. Watch your message take shape below. You can copy it later or just keep it as practice.",
      fields: [
        { id: "name", label: "Who is it for?", placeholder: "e.g. Aunt Carol" },
        { id: "opening", label: "A warm opening", placeholder: "e.g. I have been thinking about you" },
        { id: "update", label: "A short update about you", placeholder: "e.g. I am doing well and taking a computer class" },
        { id: "ask", label: "Your ask or wish", placeholder: "e.g. I would love to catch up over coffee sometime" },
      ],
      template: "Hi {name}, {opening}. {update}. {ask}. No pressure, whenever you are ready.",
    },
    reflection: {
      prompt: "How do you think you will feel after you send your message?",
      helper: PRIVACY_HELPER,
    },
    mentorStoryId: "mentor-12",
    skills: ["Write a clear, kind reach-out message", "Ask for specific help"],
  },
  {
    id: "support-4",
    moduleId: "support-network",
    order: 4,
    title: "Building a Backup Plan",
    subtitle: "Know what to do when things get hard.",
    minutes: 6,
    missionTitle: "Make Your Backup Plan",
    blocks: [
      {
        type: "paragraph",
        text: "Even the best plans hit bumps. A ride falls through. Housing gets shaky. A hard day turns into a hard week. A backup plan helps you stay steady when that happens.",
      },
      {
        type: "paragraph",
        text: "Having a plan B does not mean you expect to fail. It means you plan to keep going no matter what.",
      },
      { type: "heading", text: "What to include" },
      {
        type: "bullets",
        items: [
          "Two people you can call any time, day or night",
          "Where you could stay for a night if housing falls through",
          "How you would get to work or appointments without your usual ride",
          "What you will do if you feel like using or slipping into old habits",
          "Crisis numbers: 988 for mental health or suicide crisis, 211 for local help",
        ],
      },
      {
        type: "example",
        title: "Crystal's card",
        text: "On her twentieth day home, Crystal lost her ride and her housing got shaky. She pulled out the backup card from her wallet and called the second name. Her sponsor talked with her for an hour. The next day they solved both problems together.",
      },
      { type: "heading", text: "Make it easy to use" },
      {
        type: "steps",
        items: [
          "Write your plan on a small card.",
          "Keep one copy in your wallet and one at home.",
          "Share it with one trusted person.",
          "Look it over once a month and update it.",
        ],
      },
      {
        type: "tip",
        title: "Know your warning signs",
        text: "Skipping meals, not sleeping, avoiding calls, or seeing old friends can be early signs. When you notice them, that is the time to pull out your plan.",
      },
    ],
    keyTakeaways: [
      "A backup plan is a sign of strength, not doubt.",
      "Keep your plan on paper where you can reach it fast.",
      "988 and 211 are there for you any time.",
    ],
    activity: {
      type: "checklist",
      title: "Backup plan checklist",
      instructions: "Check off each part as you add it to your plan.",
      items: [
        "Two people I can call at any hour",
        "A place I could stay for a night if needed",
        "A backup way to get to work or appointments",
        "What I will do if I feel like slipping back",
        "988 and 211 written down",
        "A paper copy in my wallet",
        "Shared my plan with one trusted person",
      ],
    },
    reflection: {
      prompt: "What is one warning sign that tells you it is time to use your backup plan?",
      helper: PRIVACY_HELPER,
    },
    mentorStoryId: "mentor-13",
    skills: ["Create a personal backup plan", "Know crisis and help lines"],
  },
];

/* ================================================================== */
/* Module 3: Talking About Your Record                                 */
/* ================================================================== */

const recordLessons: Lesson[] = [
  {
    id: "record-1",
    moduleId: "talking-about-your-record",
    order: 1,
    title: "What Employers Want To Hear",
    subtitle: "Understand what is behind the question.",
    minutes: 6,
    missionTitle: "Understand the Employer View",
    blocks: [
      {
        type: "paragraph",
        text: "When an employer asks about your record, it can feel like a trap. But most employers are really asking one thing: Can I count on you now?",
      },
      { type: "heading", text: "What they care about" },
      {
        type: "bullets",
        items: [
          "Will you show up on time and do the work?",
          "Are you honest?",
          "Have you taken responsibility and moved forward?",
          "Will you get along with the team?",
        ],
      },
      {
        type: "paragraph",
        text: "Notice what is not on that list: every detail of your past. Employers usually do not need or want the full story. They want to see growth and readiness.",
      },
      { type: "heading", text: "A strong answer has three parts" },
      {
        type: "steps",
        items: [
          "Own it briefly. One or two sentences. No excuses, no big details.",
          "Show growth. What did you learn or change?",
          "Turn to the job. What skills and effort will you bring?",
        ],
      },
      {
        type: "example",
        title: "Keisha's turnaround",
        text: "Keisha used to freeze and look down. Then she practiced a 30-second answer: I made mistakes in the past, and I took responsibility. While I was away, I earned my food safety certificate and worked in the kitchen every day. I am ready to bring that work ethic here. She got the job.",
      },
      {
        type: "tip",
        title: "More future, less past",
        text: "Try to spend about a quarter of your answer on the past and the rest on what you have done since and what you offer now.",
      },
      {
        type: "tip",
        title: "Good news for you",
        text: "Many Maine employers are open to hiring people with records. They know it often leads to loyal, hardworking employees.",
      },
    ],
    keyTakeaways: [
      "Employers mostly want to know if they can count on you now.",
      "Own it briefly, show growth, and turn to the job.",
      "Spend most of your answer on the present and future.",
    ],
    activity: {
      type: "quiz",
      title: "What matters most?",
      instructions: "Pick the best answer for each question.",
      questions: [
        {
          prompt: "When an employer asks about your record, what are they usually trying to learn?",
          options: ["Every detail of your case", "Whether they can count on you now", "Who your lawyer was", "How long you were gone, to the day"],
          correctIndex: 1,
          explanation: "Most employers want to know you are honest, reliable, and ready to work.",
        },
        {
          prompt: "Which is the best first part of your answer?",
          options: ["A long explanation of what happened", "Blaming someone else", "A brief, honest statement that you own it", "Changing the subject"],
          correctIndex: 2,
          explanation: "Owning it briefly shows honesty and maturity.",
        },
        {
          prompt: "Most of your answer should focus on:",
          options: ["The past", "What you have done since and what you offer now", "How unfair things were", "Other people's mistakes"],
          correctIndex: 1,
          explanation: "Focusing on growth and the job shows you are ready to move forward.",
        },
      ],
    },
    reflection: {
      prompt: "What is one strength you want every employer to know about you?",
      helper: PRIVACY_HELPER,
    },
    mentorStoryId: "mentor-06",
    skills: ["Understand what employers look for", "Structure an honest answer about a record"],
  },
  {
    id: "record-2",
    moduleId: "talking-about-your-record",
    order: 2,
    title: "Build Your Story",
    subtitle: "Put your growth into four short sentences.",
    minutes: 7,
    missionTitle: "Write Your Story",
    blocks: [
      {
        type: "paragraph",
        text: "Your story is more than your record. It includes what you learned, the work you have put in, and who you are today. Writing it down helps you say it with confidence.",
      },
      { type: "heading", text: "The four parts" },
      {
        type: "steps",
        items: [
          "What happened, in a few words. No details needed. For example: I made some poor choices.",
          "What you learned. For example: I learned the value of honesty and hard work.",
          "What you have done since. Classes, jobs, programs, certificates, recovery, volunteering.",
          "What you offer now. Your skills, work ethic, and attitude.",
        ],
      },
      { type: "heading", text: "Things you can count" },
      {
        type: "bullets",
        items: [
          "GED or HiSET, college classes, or trade programs",
          "Work assignments, like kitchen, laundry, maintenance, or farm work",
          "Certificates, like food safety, forklift, or OSHA",
          "Recovery programs, peer groups, or mentoring others",
          "Volunteering or helping family",
        ],
      },
      {
        type: "example",
        title: "Paul's story",
        text: "In the past, I made choices that hurt people and myself. What I learned was that I need to think before I act and stay accountable. Since then, I have earned an OSHA safety card and mentored younger men in my unit. Today, I bring 20 years of hands-on work experience and a commitment to showing up every day.",
      },
      {
        type: "tip",
        title: "Say it out loud",
        text: "Read your story out loud until it sounds like you. Change any word that feels stiff. It should sound like how you talk.",
      },
      {
        type: "tip",
        title: "Keep it about 30 seconds",
        text: "Short is strong. If your story takes longer than 30 seconds to say, trim it down.",
      },
    ],
    keyTakeaways: [
      "Your story has four parts: past, lesson, progress, and offer.",
      "Everything you did to grow counts, including work and classes inside.",
      "Keep it short and in your own words.",
    ],
    activity: {
      type: "builder",
      title: "Build your story",
      instructions: "Fill in each part in your own words. Watch your story take shape below. What you write stays on this device only.",
      fields: [
        { id: "past", label: "What happened, briefly (no details needed)", placeholder: "e.g. made some poor choices" },
        { id: "learned", label: "What you learned", placeholder: "e.g. how much honesty and patience matter" },
        { id: "since", label: "What you have done since", placeholder: "e.g. earned my GED and worked in the kitchen for two years" },
        { id: "offer", label: "What you offer now", placeholder: "e.g. a strong work ethic and a positive attitude" },
      ],
      template: "In the past, I {past}. What I learned was {learned}. Since then, I have {since}. Today, I bring {offer}.",
    },
    reflection: {
      prompt: "How did it feel to see your story written out?",
      helper: PRIVACY_HELPER,
    },
    mentorStoryId: "mentor-07",
    skills: ["Write a personal growth story", "Highlight skills and progress"],
  },
  {
    id: "record-3",
    moduleId: "talking-about-your-record",
    order: 3,
    title: "Practice Responses",
    subtitle: "Pick the strongest answers to real interview questions.",
    minutes: 6,
    missionTitle: "Practice Your Answers",
    blocks: [
      {
        type: "paragraph",
        text: "Knowing your story is step one. Saying it when you are nervous is step two. Practice makes it feel natural, so the real interview feels like one more try.",
      },
      { type: "heading", text: "Questions you might hear" },
      {
        type: "bullets",
        items: [
          "Tell me about yourself.",
          "Do you have a criminal record? Can you tell me about it?",
          "I see a gap in your work history. What happened?",
          "Why should we hire you?",
        ],
      },
      { type: "heading", text: "Tips for strong answers" },
      {
        type: "bullets",
        items: [
          "Pause and breathe before you answer.",
          "Look the person in the eye and keep your voice calm.",
          "Be honest, but don't over-explain.",
          "Don't apologize over and over. Once is enough.",
          "End by connecting back to the job.",
        ],
      },
      {
        type: "example",
        title: "The gap question",
        text: "Interviewer: I see a gap from a few years back. Ana: I was incarcerated during that time. I used it to finish a caregiving course and help care for older women in my unit. That is part of why I am excited about this home care job.",
      },
      {
        type: "tip",
        title: "Practice with a partner",
        text: "Ask a mentor, friend, or case manager to play the interviewer once a week. Try hard questions. Laugh when you get tongue-tied. Then try again.",
      },
      {
        type: "tip",
        title: "Record yourself",
        text: "Use your phone's voice recorder to practice. Listen back and notice what sounds strong and what you want to change.",
      },
    ],
    keyTakeaways: [
      "Practice helps you stay calm when it counts.",
      "Be honest and brief, then turn to the job.",
      "One apology is enough. Focus on the future.",
    ],
    activity: {
      type: "quiz",
      title: "Pick the strongest answer",
      instructions: "Read each interview question and choose the strongest response.",
      questions: [
        {
          prompt: "Interviewer: Can you tell me about your record?",
          options: [
            "I'd rather not talk about it.",
            "I made mistakes and took responsibility. While I was away, I finished my GED and worked in maintenance. I'm ready to bring that reliability here.",
            "It wasn't really my fault. The system is unfair.",
            "Well, it all started years ago when... (five minutes of details)",
          ],
          correctIndex: 1,
          explanation: "It owns the past briefly, shows growth, and connects to the job.",
        },
        {
          prompt: "Interviewer: Why should we hire you?",
          options: [
            "I really need any job.",
            "I don't know, I guess I'm okay.",
            "I'm dependable, I learn fast, and I have two years of kitchen experience. I'd work hard to earn your trust.",
            "Because nobody else will hire me.",
          ],
          correctIndex: 2,
          explanation: "It names real strengths and shows eagerness to contribute.",
        },
        {
          prompt: "Interviewer: I see a gap in your work history.",
          options: [
            "I was incarcerated. I used that time to earn a forklift certificate and stay focused on my goals, which is why I applied here.",
            "Sorry, sorry, I know it looks bad. I'm so sorry.",
            "That's personal.",
            "I just didn't feel like working.",
          ],
          correctIndex: 0,
          explanation: "It is honest, short, and turns the gap into a story of progress.",
        },
      ],
    },
    reflection: {
      prompt: "Which interview question feels hardest for you, and what is one thing that could help you practice it?",
      helper: PRIVACY_HELPER,
    },
    mentorStoryId: "mentor-08",
    skills: ["Answer tough interview questions with confidence", "Turn past gaps into growth stories"],
  },
  {
    id: "record-4",
    moduleId: "talking-about-your-record",
    order: 4,
    title: "Know Your Rights",
    subtitle: "Background checks, fair chance laws, and hiring incentives.",
    minutes: 7,
    missionTitle: "Learn Your Rights",
    blocks: [
      {
        type: "paragraph",
        text: "You have rights when you look for work. Knowing them can help you feel more confident. This is general information, not legal advice. For help with your situation, contact Pine Tree Legal Assistance.",
      },
      { type: "heading", text: "The first application in Maine" },
      {
        type: "paragraph",
        text: "In Maine, most employers can't ask about criminal history on the first job application form. There are exceptions, like jobs where the law requires a background check. Employers may still ask later in the hiring process, like during an interview.",
      },
      { type: "heading", text: "Background checks" },
      {
        type: "bullets",
        items: [
          "If an employer uses a background check company, they must get your written permission first. This comes from a federal law called the Fair Credit Reporting Act.",
          "If they might not hire you because of the report, they must first give you a copy of it and a summary of your rights. This is called a pre-adverse action notice.",
          "You get a chance to respond and fix mistakes before they make a final decision.",
          "Always check your report for errors, like wrong records or old charges that should not be there.",
        ],
      },
      {
        type: "tip",
        title: "Fairness in hiring",
        text: "The federal EEOC has said that refusing to hire anyone with any record, no matter what, may be unfair and could be discrimination. Employers are encouraged to look at the kind of offense, how long ago it was, and whether it relates to the job.",
      },
      { type: "heading", text: "Reasons employers may want to hire you" },
      {
        type: "bullets",
        items: [
          "Work Opportunity Tax Credit (WOTC): employers can get a federal tax credit for hiring someone with a felony conviction within a year of their conviction or release.",
          "Federal Bonding Program: provides free fidelity bonds that protect the employer, at no cost to you or them.",
        ],
      },
      {
        type: "example",
        title: "Greg shares the good news",
        text: "In his interview, Greg mentioned that hiring him could qualify the company for a tax credit and a free bond. The manager had never heard of these programs and was glad to learn about them.",
      },
      {
        type: "tip",
        title: "Where to get help",
        text: "Pine Tree Legal Assistance offers free civil legal help to eligible people in Maine. Your local CareerCenter can also tell you more about WOTC and bonding.",
      },
    ],
    keyTakeaways: [
      "In Maine, most employers can't ask about your record on the first application form.",
      "You have the right to see a background check and respond before a final decision.",
      "Tax credits and free bonding can make you a stronger candidate.",
    ],
    activity: {
      type: "quiz",
      title: "Know your rights check",
      instructions: "Pick the best answer. Remember, this is general information, not legal advice.",
      questions: [
        {
          prompt: "Before an employer runs a background check through a screening company, what do they need?",
          options: ["Nothing", "Your written permission", "Your old cellmate's permission", "A court order"],
          correctIndex: 1,
          explanation: "Under the Fair Credit Reporting Act, employers must get your written permission first.",
        },
        {
          prompt: "An employer might not hire you because of your background report. What must they do first?",
          options: [
            "Nothing, they can just decide",
            "Give you a copy of the report and a chance to respond",
            "Call your family",
            "Post it online",
          ],
          correctIndex: 1,
          explanation: "This is the pre-adverse action notice. It gives you a chance to explain or fix errors.",
        },
        {
          prompt: "What is the Work Opportunity Tax Credit?",
          options: [
            "A fee you pay to get a job",
            "A tax credit employers can get for hiring people from certain groups, including people recently released with a felony conviction",
            "A loan for new workers",
            "A type of background check",
          ],
          correctIndex: 1,
          explanation: "WOTC gives employers a federal tax credit, which can be a great thing to mention in an interview.",
        },
      ],
    },
    reflection: {
      prompt: "Which of these rights or programs surprised you the most, and how might you use it?",
      helper: PRIVACY_HELPER,
    },
    mentorStoryId: "mentor-09",
    skills: ["Understand background check rights", "Explain hiring incentives like WOTC and bonding"],
  },
];

/* ================================================================== */
/* Modules                                                             */
/* ================================================================== */

export const modules: LearningModule[] = [
  {
    id: "technology",
    title: "Technology Skills",
    shortTitle: "Technology",
    description: "Get comfortable with phones, computers, email, online safety, and applying for jobs online.",
    icon: "smartphone",
    color: "primary",
    strengthens: ["technology", "resources"],
    lessons: technologyLessons,
  },
  {
    id: "support-network",
    title: "Support Network",
    shortTitle: "Support",
    description: "See who is in your corner, find new connections, reach out, and make a plan for hard days.",
    icon: "users",
    color: "action",
    strengthens: ["support", "hope", "resources"],
    lessons: supportLessons,
  },
  {
    id: "talking-about-your-record",
    title: "Talking About Your Record",
    shortTitle: "Your Story",
    description: "Learn what employers want to hear, build your story, practice answers, and know your rights.",
    icon: "message-circle",
    color: "achievement",
    strengthens: ["employment", "hope"],
    lessons: recordLessons,
  },
];

export const allLessons: Lesson[] = modules.flatMap((m) => m.lessons);

export function getLesson(id: string): Lesson | undefined {
  return allLessons.find((l) => l.id === id);
}

export function getModule(id: ModuleId): LearningModule | undefined {
  return modules.find((m) => m.id === id);
}
