import type { AssessmentQuestion, CategoryKey } from "@/types";

export const CATEGORY_META: Record<
  CategoryKey,
  { label: string; longLabel: string; description: string; color: string; hex: string }
> = {
  technology: {
    label: "Technology",
    longLabel: "Technology Readiness",
    description: "Using phones, computers, and the internet with confidence.",
    color: "text-primary-dark",
    hex: "#2EC4B6",
  },
  support: {
    label: "Support",
    longLabel: "Support Network Strength",
    description: "People you can count on and stay in touch with.",
    color: "text-action-dark",
    hex: "#FF6B35",
  },
  employment: {
    label: "Employment",
    longLabel: "Employment Readiness",
    description: "Confidence finding work and talking about your past.",
    color: "text-achievement-dark",
    hex: "#FFBF69",
  },
  hope: {
    label: "Hope",
    longLabel: "Community & Hope",
    description: "Feeling prepared, connected, and hopeful about what is next.",
    color: "text-[#6d4bb3]",
    hex: "#9B7EDE",
  },
  resources: {
    label: "Resources",
    longLabel: "Resource Navigation",
    description: "Knowing where to go for help when you need it.",
    color: "text-[#2f6690]",
    hex: "#3A86C8",
  },
};

export const CATEGORY_ORDER: CategoryKey[] = [
  "technology",
  "support",
  "employment",
  "hope",
  "resources",
];

/**
 * The 10-question Readiness Assessment. Every option has a 0–100 score for its category.
 * "Which / what" questions also carry need tags that personalise missions and resources.
 */
export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: "q1",
    number: 1,
    category: "technology",
    prompt: "How comfortable are you using a smartphone?",
    helper: "Phones have changed a lot. There is no wrong answer.",
    options: [
      { id: "very", label: "Very comfortable — I could teach someone", score: 100 },
      { id: "somewhat", label: "Somewhat comfortable — I know the basics", score: 70 },
      { id: "little", label: "A little — it has been a while", score: 40, tags: ["technology"] },
      { id: "not", label: "Not yet — I've never really used one", score: 10, tags: ["technology"] },
    ],
  },
  {
    id: "q2",
    number: 2,
    category: "technology",
    prompt: "Which technology skill would help you most after release?",
    helper: "Pick the one that feels most useful right now.",
    options: [
      { id: "phone", label: "Setting up and using a smartphone", score: 35, tags: ["technology"] },
      { id: "email", label: "Creating and using an email account", score: 50, tags: ["technology"] },
      { id: "jobs", label: "Searching and applying for jobs online", score: 70, tags: ["employment"] },
      { id: "safety", label: "Staying safe from scams online", score: 80 },
      { id: "confident", label: "I'm already confident with technology", score: 100 },
    ],
  },
  {
    id: "q3",
    number: 3,
    category: "support",
    prompt: "Who do you expect to support you after release?",
    helper: "Think about who will actually be there for you.",
    options: [
      { id: "family", label: "Family members", score: 90 },
      { id: "friends", label: "Friends or a partner", score: 80 },
      { id: "mentor", label: "A mentor, sponsor, or faith community", score: 80 },
      { id: "program", label: "A reentry program or case manager", score: 65, tags: ["support"] },
      { id: "unsure", label: "I'm not sure yet", score: 25, tags: ["support"] },
      { id: "none", label: "No one right now", score: 5, tags: ["support"] },
    ],
  },
  {
    id: "q4",
    number: 4,
    category: "support",
    prompt: "How often do you communicate with them?",
    options: [
      { id: "weekly", label: "Every week", score: 100 },
      { id: "monthly", label: "About once a month", score: 70 },
      { id: "rarely", label: "Every few months", score: 40, tags: ["support"] },
      { id: "never", label: "We don't talk right now", score: 10, tags: ["support"] },
    ],
  },
  {
    id: "q5",
    number: 5,
    category: "employment",
    prompt: "How confident do you feel finding employment after release?",
    options: [
      { id: "very", label: "Very confident — I have a plan or a job lined up", score: 100 },
      { id: "somewhat", label: "Somewhat confident", score: 65 },
      { id: "unsure", label: "Unsure where to start", score: 35, tags: ["employment"] },
      { id: "not", label: "Not confident at all", score: 10, tags: ["employment"] },
    ],
  },
  {
    id: "q6",
    number: 6,
    category: "employment",
    prompt: "How comfortable are you discussing your record with an employer?",
    helper: "Lots of people feel nervous about this. It is a skill you can practice.",
    options: [
      { id: "very", label: "Comfortable — I know what I'd say", score: 100 },
      { id: "somewhat", label: "Somewhat — I'd need to practice", score: 60 },
      { id: "nervous", label: "Nervous — I'm not sure what to say", score: 30 },
      { id: "avoid", label: "I'd rather avoid the topic completely", score: 10, tags: ["legal"] },
    ],
  },
  {
    id: "q7",
    number: 7,
    category: "hope",
    prompt: "What worries you most about reentry?",
    options: [
      { id: "housing", label: "Finding a safe place to live", score: 45, tags: ["housing"] },
      { id: "work", label: "Getting a job", score: 50, tags: ["employment"] },
      { id: "judged", label: "Being judged by others", score: 40, tags: ["support"] },
      { id: "old-patterns", label: "Falling back into old patterns", score: 40, tags: ["recovery"] },
      { id: "alone", label: "Feeling alone", score: 30, tags: ["support"] },
      { id: "ready", label: "Honestly, I feel ready", score: 95 },
    ],
  },
  {
    id: "q8",
    number: 8,
    category: "hope",
    prompt: "What would help you feel more prepared right now?",
    options: [
      { id: "plan", label: "A clear step-by-step plan", score: 60 },
      { id: "skills", label: "Learning new skills", score: 70, tags: ["education"] },
      { id: "stories", label: "Hearing from people who made it", score: 55 },
      { id: "people", label: "Connecting with people who understand", score: 50, tags: ["support"] },
      { id: "resources", label: "Knowing what help is out there", score: 55, tags: ["basic-needs"] },
    ],
  },
  {
    id: "q9",
    number: 9,
    category: "resources",
    prompt: "If you needed help after release, would you know where to start?",
    options: [
      { id: "yes", label: "Yes — I know exactly who to contact", score: 100 },
      { id: "some", label: "I have a few ideas", score: 65 },
      { id: "not-sure", label: "Not really", score: 30, tags: ["basic-needs"] },
      { id: "no", label: "No idea where to start", score: 5, tags: ["basic-needs"] },
    ],
  },
  {
    id: "q10",
    number: 10,
    category: "resources",
    prompt: "Which area will you likely need help with first?",
    helper: "We'll use this to pick your top resources.",
    options: [
      { id: "housing", label: "Housing", score: 50, tags: ["housing"] },
      { id: "employment", label: "Finding a job", score: 55, tags: ["employment"] },
      { id: "benefits", label: "Food, health coverage, or benefits", score: 50, tags: ["basic-needs", "health-coverage"] },
      { id: "legal", label: "Legal questions or paperwork", score: 50, tags: ["legal", "id-documents"] },
      { id: "recovery", label: "Recovery support", score: 50, tags: ["recovery"] },
      { id: "technology", label: "Getting a phone or learning tech", score: 55, tags: ["technology"] },
      { id: "women", label: "Support for women in reentry", score: 50, tags: ["women", "support"] },
    ],
  },
];
