import ndayScreenshot from "../assets/images/website/www.nday.com.tw_.webp";
import jiahescreenshot from "../assets/images/website/www.jiahe.net.tw_.webp";
import asteriskScreenshot from "../assets/images/website/www.asterisk-tech.com_.webp";

// 只放結構性 / 非翻譯資料；標題為風格化英文保留。
// 描述（desc / full）依 id 放在 i18n：t(`projects.${id}.desc` | `.full`)。
export interface ProjectData {
  id: string;
  title: string;
  year: string;
  color: string;
  techStack: string[];
  screenshots?: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export const projects: ProjectData[] = [
  {
    id: "01",
    title: "E-COMMERCE ARC",
    year: "2026",
    color: "var(--color-nekoma)",
    techStack: [
      "Vue 3",
      "Quasar",
      "TypeScript",
      "Pinia",
      "Vue Router",
      "Axios",
      "SCSS",
      "reCAPTCHA",
      "SSR",
    ],
  },
  {
    id: "02",
    title: "OFFICIAL SITE SAGA",
    year: "2024",
    color: "var(--color-teal)",
    techStack: [
      "Next.js 14",
      "React",
      "TypeScript",
      "TapPay",
      "LINE LIFF",
      "GA4",
      "GTM",
      "Docker",
      "GCP",
      "Nginx",
    ],
    liveUrl: "https://www.nday.com.tw/",
    screenshots: [ndayScreenshot],
  },
  {
    id: "03",
    title: "ADMIN SYSTEM ARC",
    year: "2024",
    color: "var(--color-poster)",
    techStack: [
      "React",
      "Next.js",
      "TypeScript",
      "MUI",
      "WebSocket",
      "LINE Webhook",
    ],
  },
  {
    id: "04",
    title: "CLINIC SYSTEM",
    year: "2025",
    color: "#6366f1",
    techStack: [
      "React",
      "TypeScript",
      "React Hook Form",
      "Zod",
      "TanStack Query",
    ],
  },
  {
    id: "05",
    title: "EMS DASHBOARD",
    year: "2025",
    color: "#0891b2",
    techStack: [
      "React 19",
      "Vite",
      "TypeScript",
      "Tailwind CSS",
      "RESTful API",
    ],
  },
  {
    id: "06",
    title: "POS CHRONICLES",
    year: "2025",
    color: "#16a34a",
    techStack: ["React", "Tailwind CSS", "WebSocket", "TypeScript"],
  },
  {
    id: "07",
    title: "SANATORIUM SITE",
    year: "2025",
    color: "#84846a",
    techStack: ["Astro", "React.js", "Git", "Swiper", "GA4 / GTM", "SEO"],
    liveUrl: "https://www.jiahe.net.tw/",
    screenshots: [jiahescreenshot],
  },
  {
    id: "08",
    title: "CORPORATE SITE DESIGN",
    year: "2025",
    color: "#e11d48",
    techStack: ["HTML", "CSS", "JavaScript", "RWD", "UI Design", "SEO"],
    liveUrl: "https://www.asterisk-tech.com/",
    screenshots: [asteriskScreenshot],
  },
];
