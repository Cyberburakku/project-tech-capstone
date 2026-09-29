/** Shared domain types for Second Take. */

export type CategoryKey = "technology" | "support" | "employment" | "hope" | "resources";

export type ScoreSet = Record<CategoryKey, number>;

/** Focus tags describe needs surfaced by the assessment. Used for missions and resource matching. */
export type NeedTag =
  | "housing"
  | "employment"
  | "technology"
  | "legal"
  | "recovery"
  | "support"
  | "basic-needs"
  | "health-coverage"
  | "id-documents"
  | "transportation"
  | "education"
  | "women";

export interface AssessmentOption {
  id: string;
  label: string;
  /** 0–100 contribution to the question's category score */
  score: number;
  /** Needs this answer reveals (drives resource matching) */
  tags?: NeedTag[];
}

export interface AssessmentQuestion {
  id: string; // "q1" … "q10"
  number: number;
  category: CategoryKey;
  prompt: string;
  helper?: string;
  options: AssessmentOption[];
}

export type AssessmentAnswers = Record<string, string>; // questionId -> optionId

export interface AssessmentResult {
  id: string;
  takenAt: string; // ISO
  answers: AssessmentAnswers;
  scores: ScoreSet;
  overall: number;
  topStrength: CategoryKey;
  topOpportunity: CategoryKey;
  needTags: NeedTag[];
}

export type ModuleId = "technology" | "support-network" | "talking-about-your-record";

/* ---------- Lesson content ---------- */

export type LessonBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "steps"; items: string[] }
  | { type: "tip"; title: string; text: string }
  | { type: "example"; title: string; text: string };

export interface QuizQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type LessonActivity =
  | {
      type: "quiz";
      title: string;
      instructions: string;
      questions: QuizQuestion[];
    }
  | {
      type: "checklist";
      title: string;
      instructions: string;
      items: string[];
    }
  | {
      type: "builder";
      title: string;
      instructions: string;
      /** Fields the learner fills in; answers stay on the device only. */
      fields: { id: string; label: string; placeholder: string }[];
      /** Template using {fieldId} tokens, shown as a live preview. */
      template: string;
    };

export interface Lesson {
  id: string; // e.g. "tech-1"
  moduleId: ModuleId;
  order: number; // 1-based within module
  title: string;
  subtitle: string;
  minutes: number;
  /** Short mission title shown on the results screen, e.g. "Learn Smartphone Basics" */
  missionTitle: string;
  blocks: LessonBlock[];
  keyTakeaways: string[];
  activity: LessonActivity;
  reflection: {
    prompt: string;
    helper: string;
  };
  mentorStoryId: string;
  /** Skills listed on the module certificate */
  skills: string[];
}

export interface LearningModule {
  id: ModuleId;
  title: string;
  shortTitle: string;
  description: string;
  icon: "smartphone" | "users" | "message-circle";
  color: string; // tailwind color token name, e.g. "primary"
  /** Categories this module strengthens (used to prioritise the path) */
  strengthens: CategoryKey[];
  lessons: Lesson[];
}

/* ---------- Hope system ---------- */

export type MentorTheme = "technology" | "employment" | "support" | "community";

export interface MentorStory {
  id: string; // "mentor-01" … "mentor-20"
  name: string; // fictional, e.g. "Marcus T."
  age: number;
  hometown: string; // Maine town (fictional person)
  theme: MentorTheme;
  headline: string;
  story: string[]; // 3–4 short paragraphs
  quote: string;
  whatHelped: string[]; // 3 practical tips
  today: string; // where they are now, one sentence
}

/* ---------- Resources ---------- */

export interface Resource {
  id: string;
  name: string;
  shortDescription: string;
  whatTheyHelpWith: string[];
  tags: NeedTag[];
  /** "statewide" or list of Maine county names served */
  counties: "statewide" | string[];
  phone?: string; // display format
  phoneHref?: string; // tel: link
  website: string;
  /** One concrete next step the user can take today */
  firstStep: string;
  audience?: string; // e.g. "Women" — shown as a badge
  /** Base importance 1–5 */
  basePriority: number;
}

export interface MatchedResource {
  resource: Resource;
  score: number;
  reason: string;
}
