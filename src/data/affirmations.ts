export const affirmations: string[] = [
  "My past is part of my story, not the end of it.",
  "I am allowed to start again — as many times as it takes.",
  "Small steps every day still move me forward.",
  "I am learning, and learning takes courage.",
  "I deserve support, and I am brave enough to ask for it.",
  "I bring real skills and real value to the people around me.",
  "Today I choose progress over perfection.",
  "I can do hard things. I have already done hard things.",
  "Every lesson I finish is proof that I'm growing.",
  "My future is being built right now, one choice at a time.",
  "I am more than my worst day.",
  "I can be patient with myself while I figure things out.",
  "Asking for help is a strength, not a weakness.",
  "I am building a life I am proud of.",
  "My voice matters, and my story can help someone else.",
  "I am ready to learn something new today.",
  "Setbacks are part of the path, not the end of it.",
  "I have people and places that want to see me succeed.",
  "Hope is something I practice, and I'm getting better at it.",
  "I am worthy of a second take.",
];

export function randomAffirmation(exclude?: string): string {
  const pool = exclude ? affirmations.filter((a) => a !== exclude) : affirmations;
  return pool[Math.floor(Math.random() * pool.length)];
}
