import ndayScreenshot from "../assets/images/website/www.nday.com.tw_.webp";
import jiahescreenshot from "../assets/images/website/www.jiahe.net.tw_.webp";
import asteriskScreenshot from "../assets/images/website/www.asterisk-tech.com_.webp";

export interface ProjectData {
  id: string;
  title: string;
  year: string;
  color: string;
  desc: string;
  fullDesc?: string;
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
    desc: "Vue 3 + Quasar + TypeScript 電商平台，完整 RWD、Pinia 狀態管理、Axios API 封裝、reCAPTCHA、SSR + SEO",
    fullDesc:
      "與另一名前端工程師協作開發電商平台，使用 Vue 3 Composition API + Quasar Framework + TypeScript。整合 Pinia 狀態管理與 Vue Router 路由規劃，完整 RWD 設計支援手機、平板、桌機。實作模組涵蓋商品瀏覽、購物車流程、會員中心（訂單 / 收藏 / 個人資料）、經銷商查詢、FAQ 與聯絡表單。以 SSR 架構確保 SEO 最佳化，支援主流瀏覽器並通過 W3C 驗證。",
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
    desc: "Next.js 14 App Router 架構遷移，多步驟驗屋預約、TapPay 金流、LINE LIFF 登入、GA4 電商事件追蹤",
    fullDesc:
      "主導前端架構遷移，將 Astro + React 混合架構重構為 Next.js 14 App Router，統一 SSR / SSG 渲染策略。與後端協作開發多步驟驗屋預約系統（Step 1–5），涵蓋報價試算、日期選擇、聯絡資訊填寫至確認下單完整流程。串接 TapPay 金流 SDK 實作信用卡線上付款，整合 LINE LIFF 實作 LINE 登入，配置 GA4 電商事件追蹤（add_to_cart、begin_checkout、purchase）。部署於 GCP + Docker，配置 Nginx 靜態資源快取最佳化效能。",
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
    desc: "React + MUI 後台系統，WebSocket 即時客服聊天室，LINE 貼圖渲染、排班、訂單、會員管理模組",
    fullDesc:
      "接手並維護既有後台管理系統（React / Next.js / TypeScript / MUI）。核心功能包含即時客服聊天室（WebSocket 實現即時訊息推播），支援 LINE 貼圖渲染、快速回覆範本、多媒體檔案上傳，並處理多種 webhook 事件分發。另維護排班系統、訂單管理、商家後台、會員管理、折扣活動等多個業務核心頁面，支撐千萬級年營業額新創公司的日常營運。",
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
    desc: "醫美診所管理系統，React Hook Form + Zod 多步驟表單、TanStack Query、帳號權限管理、罐頭訊息模組",
    fullDesc:
      "參與開發現代化醫美診所後台管理系統，負責三個核心功能模組前端設計與實作。預約 / 會診記錄流程：以 React Hook Form + Zod 實作多步驟表單驗證，搭配 TanStack Query 處理非同步資料流。帳號管理模組：建立帳號新增、編輯、權限設定等完整操作介面，實作 CRUD 功能並整合 API。罐頭訊息管理：開發可複用訊息範本的管理功能，支援診所人員快速回覆場景，提升作業效率。",
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
    desc: "React 19 + Vite 能源/環境監控 SPA，自適應縮放（1280px ～ 4K），即時節點流量追蹤、品牌設計系統",
    fullDesc:
      "根據設計稿建構能源/環境監控管理系統前端介面，涵蓋即時儀表板、歷史資料查詢、多設備對比分析等功能模組。使用 React 19 + Vite 建構高效能 SPA，實作自適應縮放系統（1280px ～ 4K），支援多種螢幕解析度無縫呈現。設計 RESTful API 服務層，統一管理認證 token 與錯誤攔截，採用 Tailwind CSS 建立品牌設計系統維持 UI 一致性。兩份專案採用不同呈現重點：能源系統針對不同地區細緻呈現，環境管理則針對即時資訊追蹤各節點流量。",
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
    desc: "平板最佳化餐飲 POS 系統，WebSocket 即時訂單更新、條碼掃描、多元支付辨識，高頻操作場景設計",
    fullDesc:
      "使用 React + Tailwind CSS 建構平板最佳化操作介面，透過 WebSocket 實作訂單與狀態的即時更新。整合條碼掃描，支援多元支付辨識與結帳流程。以高頻操作場景為前提，設計可擴充且易維護的前端架構，確保在快節奏的餐飲環境中操作流暢不卡頓。",
    techStack: ["React", "Tailwind CSS", "WebSocket", "TypeScript"],
  },
  {
    id: "07",
    title: "SANATORIUM SITE",
    year: "2025",
    color: "#84846a",
    desc: "療養院官方網站，從零規劃前端架構，Astro + React、Swiper 輪播、RWD、GA4 埋碼追蹤",
    fullDesc:
      "獨立負責療養院官方網站前端開發，從零規劃整體前端架構，包含頁面路由設計、元件系統建立與全域樣式規範制定。以 Astro + React 組合建構靜態網站，兼顧 SEO 與互動性需求。實作完整 RWD 響應式版型，確保桌機、平板、手機各裝置正常顯示。整合 Swiper 實作輪播互動元件，協作對接後端資料並完成 GA4 埋碼追蹤設定。",
    techStack: ["Astro", "React.js", "Git", "Swiper", "GA4 / GTM", "SEO"],
    liveUrl: "https://www.jiahe.net.tw/",
    screenshots: [jiahescreenshot],
  },
  {
    id: "08",
    title: "CORPORATE SITE DESIGN",
    year: "2025",
    color: "#e11d48",
    desc: "企業官方網站，著重整體網站設計與頁面 UI 實作，並完成基本 SEO 欄位檢查與優化",
    fullDesc:
      "負責企業官方網站的網站設計與前端頁面 UI 實作，無特定前端框架依賴，聚焦於版面視覺、互動細節與切版品質。依設計需求完成各頁面排版與響應式呈現，確保桌機、平板、手機各裝置正常顯示。同時進行基本 SEO 欄位檢查與優化，包含 title、meta description、Open Graph、語意化標籤與圖片 alt 等，提升搜尋引擎收錄與社群分享呈現品質。",
    techStack: ["HTML", "CSS", "JavaScript", "RWD", "UI Design", "SEO"],
    liveUrl: "https://www.asterisk-tech.com/",
    screenshots: [asteriskScreenshot],
  },
];
