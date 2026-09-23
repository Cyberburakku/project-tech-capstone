import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AssessmentAnswers, AssessmentResult, MatchedResource, ModuleId } from "@/types";
import { scoreAssessment } from "@/lib/scoring";
import { flushQueue, type SyncOp, type SyncTable } from "@/lib/sync";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getLesson } from "@/data/modules";
import { uuid } from "@/lib/utils";

export interface Profile {
  id: string;
  firstName: string;
  county: string;
  createdAt: string;
}

export interface LessonCompletion {
  completedAt: string;
  activityScore?: number;
}

export interface Reflection {
  text: string;
  savedAt: string;
}

export interface CertificateRecord {
  code: string;
  issuedAt: string;
}

interface AppState {
  profile: Profile | null;
  /** In-progress answers so a learner can leave and come back. */
  draftAnswers: AssessmentAnswers;
  assessments: AssessmentResult[];
  completedLessons: Record<string, LessonCompletion>;
  reflections: Record<string, Reflection>;
  /** Builder activity answers — device only, never synced. */
  builderAnswers: Record<string, Record<string, string>>;
  checklistState: Record<string, boolean[]>;
  certificates: Partial<Record<ModuleId, CertificateRecord>>;
  syncQueue: SyncOp[];

  setProfile: (firstName: string, county: string) => void;
  setDraftAnswer: (questionId: string, optionId: string) => void;
  submitAssessment: () => AssessmentResult | null;
  saveRecommendations: (assessmentId: string, matches: MatchedResource[]) => void;
  completeLesson: (lessonId: string, activityScore?: number) => void;
  saveReflection: (lessonId: string, text: string) => void;
  saveBuilder: (lessonId: string, values: Record<string, string>) => void;
  saveChecklist: (lessonId: string, values: boolean[]) => void;
  issueCertificate: (moduleId: ModuleId) => CertificateRecord;
  flush: () => Promise<void>;
  resetAll: () => void;
}

const initialData = {
  profile: null,
  draftAnswers: {},
  assessments: [],
  completedLessons: {},
  reflections: {},
  builderAnswers: {},
  checklistState: {},
  certificates: {},
  syncQueue: [],
};

function certificateCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "TECH-";
  for (let i = 0; i < 8; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => {
      const enqueue = (table: SyncTable, row: Record<string, unknown>) => {
        // Local-only mode: without Supabase credentials everything stays in localStorage.
        if (!isSupabaseConfigured) return;
        set((s) => ({ syncQueue: [...s.syncQueue, { id: uuid(), table, row, attempts: 0 }] }));
        void get().flush();
      };

      let flushing = false;

      return {
        ...initialData,

        setProfile: (firstName, county) => {
          const existing = get().profile;
          const profile: Profile = {
            id: existing?.id ?? uuid(),
            firstName: firstName.trim().slice(0, 40),
            county,
            createdAt: existing?.createdAt ?? new Date().toISOString(),
          };
          set({ profile });
          if (!existing) {
            enqueue("users", {
              id: profile.id,
              first_name: profile.firstName,
              county: profile.county,
              created_at: profile.createdAt,
            });
          }
        },

        setDraftAnswer: (questionId, optionId) =>
          set((s) => ({ draftAnswers: { ...s.draftAnswers, [questionId]: optionId } })),

        submitAssessment: () => {
          const { draftAnswers, profile, assessments } = get();
          if (!profile) return null;
          const result = scoreAssessment(draftAnswers);
          set({ assessments: [...assessments, result], draftAnswers: {} });
          enqueue("assessments", {
            id: result.id,
            user_id: profile.id,
            taken_at: result.takenAt,
            ...result.scores,
            overall: result.overall,
            top_strength: result.topStrength,
            top_opportunity: result.topOpportunity,
            need_tags: result.needTags,
            answers: result.answers,
            attempt: assessments.length + 1,
          });
          return result;
        },

        saveRecommendations: (assessmentId, matches) => {
          const profile = get().profile;
          if (!profile) return;
          matches.forEach((m, i) =>
            enqueue("resource_recommendations", {
              user_id: profile.id,
              assessment_id: assessmentId,
              resource_id: m.resource.id,
              rank: i + 1,
              match_score: m.score,
            }),
          );
        },

        completeLesson: (lessonId, activityScore) => {
          const { completedLessons, profile } = get();
          if (completedLessons[lessonId]) return;
          const completedAt = new Date().toISOString();
          set({ completedLessons: { ...completedLessons, [lessonId]: { completedAt, activityScore } } });
          const lesson = getLesson(lessonId);
          if (profile && lesson) {
            enqueue("lesson_progress", {
              user_id: profile.id,
              lesson_id: lessonId,
              module_id: lesson.moduleId,
              activity_score: activityScore ?? null,
              completed_at: completedAt,
            });
          }
        },

        saveReflection: (lessonId, text) => {
          const { reflections, profile } = get();
          const isNew = !reflections[lessonId];
          set({ reflections: { ...reflections, [lessonId]: { text, savedAt: new Date().toISOString() } } });
          if (profile && isNew) {
            // Only the fact a reflection exists (and its length) leaves the device.
            enqueue("reflections", {
              user_id: profile.id,
              lesson_id: lessonId,
              word_count: text.trim() ? text.trim().split(/\s+/).length : 0,
            });
          }
        },

        saveBuilder: (lessonId, values) =>
          set((s) => ({ builderAnswers: { ...s.builderAnswers, [lessonId]: values } })),

        saveChecklist: (lessonId, values) =>
          set((s) => ({ checklistState: { ...s.checklistState, [lessonId]: values } })),

        issueCertificate: (moduleId) => {
          const { certificates, profile } = get();
          const existing = certificates[moduleId];
          if (existing) return existing;
          const record = { code: certificateCode(), issuedAt: new Date().toISOString() };
          set({ certificates: { ...certificates, [moduleId]: record } });
          if (profile) {
            enqueue("certificates", {
              user_id: profile.id,
              module_id: moduleId,
              certificate_code: record.code,
              issued_at: record.issuedAt,
            });
          }
          return record;
        },

        flush: async () => {
          if (flushing) return;
          flushing = true;
          try {
            const snapshot = get().syncQueue;
            const remaining = await flushQueue(snapshot);
            const sentIds = new Set(snapshot.map((o) => o.id));
            // Keep ops added while we were flushing.
            set((s) => ({
              syncQueue: [...remaining, ...s.syncQueue.filter((o) => !sentIds.has(o.id))],
            }));
          } finally {
            flushing = false;
          }
        },

        resetAll: () => set({ ...initialData }),
      };
    },
    {
      name: "project-tech:v1",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);

/** Latest assessment, if any. */
export const selectLatestAssessment = (s: AppState) =>
  s.assessments.length ? s.assessments[s.assessments.length - 1] : null;
