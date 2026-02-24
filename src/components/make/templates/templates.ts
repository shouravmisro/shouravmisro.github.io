import type { SiteJson } from "../utils/schema";
import { uid } from "../utils/helpers";

export const templates: Record<string, SiteJson> = {
  "QA Engineer": {
    basics: {
      name: "Your Name",
      headline: "Quality-focused engineer who helps teams ship with confidence.",
      roles: ["SQA", "QA Engineer", "Test Automation"],
      location: "",
      email: "you@example.com",
      phone: "",
      github: "",
      linkedin: "",
      facebook: "",
    },
    about: {
      short: "I design test cases, validate user journeys, report clear bugs, and help improve product stability and usability.",
      long: "",
    },
    skills: [
      { id: uid("skill"), name: "Test Case Design", level: "Intermediate" },
      { id: uid("skill"), name: "Postman", level: "Intermediate" },
      { id: uid("skill"), name: "Jira", level: "Beginner" },
    ],
    projects: [],
    experience: [],
    education: [],
    achievements: [],
    settings: { themeStyle: "CleanGradient", showPhone: true, cvLayout: "ATS", compactSpacing: false, onePageMode: false },
  },

  "IoT / Embedded": {
    basics: {
      name: "Your Name",
      headline: "I build practical IoT systems—sensors, automation, and dashboards—with reliability in mind.",
      roles: ["IoT", "Embedded", "Automation"],
      location: "",
      email: "you@example.com",
      phone: "",
      github: "",
      linkedin: "",
      facebook: "",
    },
    about: {
      short: "I enjoy connecting hardware and software: sensors, microcontrollers, data pipelines, and useful interfaces.",
      long: "",
    },
    skills: [
      { id: uid("skill"), name: "ESP32/Arduino", level: "Intermediate" },
      { id: uid("skill"), name: "Sensors", level: "Intermediate" },
      { id: uid("skill"), name: "MQTT", level: "Beginner" },
    ],
    projects: [],
    experience: [],
    education: [],
    achievements: [],
    settings: { themeStyle: "CleanGradient", showPhone: true, cvLayout: "Modern", compactSpacing: false, onePageMode: false },
  },

  "Software Engineer": {
    basics: {
      name: "Your Name",
      headline: "I build fast, reliable web applications with clean UI and strong fundamentals.",
      roles: ["Software Engineer", "Frontend", "Backend"],
      location: "",
      email: "you@example.com",
      phone: "",
      github: "",
      linkedin: "",
      facebook: "",
    },
    about: {
      short: "I enjoy building practical products end-to-end, focusing on clarity, performance, and maintainability.",
      long: "",
    },
    skills: [
      { id: uid("skill"), name: "JavaScript", level: "Intermediate" },
      { id: uid("skill"), name: "React", level: "Intermediate" },
    ],
    projects: [],
    experience: [],
    education: [],
    achievements: [],
    settings: { themeStyle: "CleanGradient", showPhone: true, cvLayout: "Modern", compactSpacing: false, onePageMode: false },
  },

  "Student / Fresh Grad": {
    basics: {
      name: "Your Name",
      headline: "Fresh graduate building real projects and looking for opportunities to grow.",
      roles: ["Student", "Intern", "Junior"],
      location: "",
      email: "you@example.com",
      phone: "",
      github: "",
      linkedin: "",
      facebook: "",
    },
    about: {
      short: "I’m motivated to learn, contribute, and build useful software with good fundamentals and teamwork.",
      long: "",
    },
    skills: [
      { id: uid("skill"), name: "Problem Solving", level: "Intermediate" },
      { id: uid("skill"), name: "Git", level: "Intermediate" },
    ],
    projects: [],
    experience: [],
    education: [],
    achievements: [],
    settings: { themeStyle: "CleanGradient", showPhone: true, cvLayout: "ATS", compactSpacing: false, onePageMode: false },
  },

  "Data Science": {
    basics: {
      name: "Your Name",
      headline: "I turn data into decisions through analysis, modeling, and clear communication.",
      roles: ["Data Science", "Analytics", "ML"],
      location: "",
      email: "you@example.com",
      phone: "",
      github: "",
      linkedin: "",
      facebook: "",
    },
    about: {
      short: "I enjoy exploring datasets, building models, and presenting insights in a way people can use.",
      long: "",
    },
    skills: [
      { id: uid("skill"), name: "Python", level: "Intermediate" },
      { id: uid("skill"), name: "Pandas", level: "Intermediate" },
    ],
    projects: [],
    experience: [],
    education: [],
    achievements: [],
    settings: { themeStyle: "CleanGradient", showPhone: true, cvLayout: "Modern", compactSpacing: false, onePageMode: false },
  },
};