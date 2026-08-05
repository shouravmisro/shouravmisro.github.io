import { z } from "zod";

export const SkillLevel = z.enum([
  "Novice",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
]);
export const SkillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Skill name is required"),
  level: SkillLevel.optional(),
});

export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Project title is required"),
  year: z.number().int().min(2000).max(2100),
  summary: z.string().min(1, "Summary is required"),
  role: z.string().min(1, "Role is required"),
  featured: z.boolean().default(false),
  stack: z.array(z.string()).default([]),
  github: z.string().url().optional().or(z.literal("")),
  demo: z.string().url().optional().or(z.literal("")),
});

export const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1),
  title: z.string().min(1),
  start: z.string().min(1), // e.g. "Jan 2024"
  end: z.string().min(1),   // e.g. "Present"
  highlights: z.array(z.string().min(1)).default([]),
});

export const EducationSchema = z.object({
  id: z.string(),
  school: z.string().min(1),
  degree: z.string().min(1),
  year: z.string().min(1),
});

export const AchievementSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  date: z.string().min(1),
  org: z.string().optional(),
  link: z.string().url().optional().or(z.literal("")),
});

export const SiteJsonSchema = z.object({
  basics: z.object({
    name: z.string().min(1, "Name is required"),
    headline: z.string().min(1),
    roles: z.array(z.string()).default([]),
    location: z.string().optional(),
    email: z.string().email("Valid email required"),
    phone: z.string().optional(),
    github: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
    facebook: z.string().url().optional().or(z.literal("")),
    resumeSqaUrl: z.string().optional(),
    resumeIotUrl: z.string().optional(),
    headshotUrl: z.string().optional(),
  }),
  about: z.object({
    short: z.string().min(1),
    long: z.string().optional(),
  }),
  skills: z.array(SkillSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
  experience: z.array(ExperienceSchema).default([]),
  education: z.array(EducationSchema).default([]),
  achievements: z.array(AchievementSchema).default([]),
  research: z.array(z.object({
    id: z.string(),
    title: z.string(),
    publisher: z.string().optional(),
    year: z.string().optional(),
    details: z.string().optional(),
  })).optional(),
  extraCurricular: z.array(z.object({
    id: z.string(),
    title: z.string(),
    org: z.string().optional(),
    description: z.string().optional(),
  })).optional(),

  settings: z.object({
    themeStyle: z.enum(["CleanGradient"]).default("CleanGradient"),

    // privacy + export
    showPhone: z.boolean().default(true),

    // CV export style
    cvLayout: z.enum(["ATS", "Modern"]).default("Modern"),
    compactSpacing: z.boolean().default(false),
    onePageMode: z.boolean().default(false),
  }).default({
    themeStyle: "CleanGradient",
    showPhone: true,
    cvLayout: "Modern",
    compactSpacing: false,
    onePageMode: false,
  }),
});

export type SiteJson = z.infer<typeof SiteJsonSchema>;