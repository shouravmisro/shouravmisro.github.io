import { z } from "zod";

export const SkillLevel = z.enum(["Beginner", "Intermediate", "Advanced"]);

export const SkillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  level: SkillLevel.optional(),
});

export const ProjectSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  year: z.number().int().min(2000).max(2100),
  summary: z.string().min(1, "Summary is required").max(180),
  role: z.string().min(1, "Role is required"),
  featured: z.boolean().default(false),
  stack: z.array(z.string()).default([]),
  github: z.string().url().optional().or(z.literal("")),
  demo: z.string().url().optional().or(z.literal("")),
});

export const ExperienceSchema = z.object({
  company: z.string().min(1),
  title: z.string().min(1),
  start: z.string().min(1), // e.g. "Jan 2024"
  end: z.string().min(1),   // e.g. "Present"
  highlights: z.array(z.string().min(1)).default([]),
});

export const EducationSchema = z.object({
  school: z.string().min(1),
  degree: z.string().min(1),
  year: z.string().min(1),
});

export const AchievementSchema = z.object({
  title: z.string().min(1),
  date: z.string().min(1),
  org: z.string().optional(),
  link: z.string().url().optional().or(z.literal("")),
});

export const SiteJsonSchema = z.object({
  basics: z.object({
    name: z.string().min(1, "Name is required"),
    headline: z.string().min(1).max(120),
    roles: z.array(z.string()).default([]),
    location: z.string().optional(),
    email: z.string().email("Valid email required"),
    phone: z.string().optional(),
    github: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
    facebook: z.string().url().optional().or(z.literal("")),
  }),
  about: z.object({
    short: z.string().min(1).max(260),
    long: z.string().optional(),
  }),
  skills: z.array(SkillSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
  experience: z.array(ExperienceSchema).default([]),
  education: z.array(EducationSchema).default([]),
  achievements: z.array(AchievementSchema).default([]),

  settings: z.object({
    themeStyle: z.enum(["CleanGradient"]).default("CleanGradient"),
    showPhone: z.boolean().default(true),
    cvLayout: z.enum(["ATS", "Modern"]).default("Modern"),
  }).default({ themeStyle: "CleanGradient", showPhone: true, cvLayout: "Modern" }),
});

export type SiteJson = z.infer<typeof SiteJsonSchema>;