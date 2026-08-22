// English translations. Mirror of zh.ts; project copy is drafted for review.
const en = {
  translation: {
    seo: {
      title: "Haru Li | Frontend Engineer Portfolio",
      description:
        "Haru Li — Frontend Engineer focused on React, Next.js, and TypeScript. Commercial project experience across e-commerce platforms, website architecture migrations, admin systems, payment integrations, and real-time messaging. I value product thinking, system design, and engineering quality.",
      ogLocale: "en_US",
    },
    nav: {
      intro: "Intro",
      about: "About",
      projects: "Projects",
      career: "Career",
      contact: "Contact",
    },
    error: {
      tag: "ERROR 500",
      bubble: "zzz… the server dozed off",
      catAlt: "Onigiri asleep",
      title: "The server nodded off",
      desc: "The page hit a problem while loading — possibly a flaky connection or a fresh deploy. A reload usually fixes it; if not, head back home.",
      reload: "Reload",
      home: "Back home",
    },
    notFound: {
      tag: "ERROR 404",
      bubble: "meow…? dead end",
      title: "This page wandered off",
      desc: "Onigiri looked everywhere but couldn't find it. The paw prints stop here — shall we head home together?",
      home: "Take me home",
      back: "Go back",
    },
    menu: {
      dark: "Dark mode",
      light: "Light mode",
      top: "Back to top",
      role: "Code Supervisor",
      lang: "中文",
    },
    a11y: {
      cat: "Onigiri the cat",
      catSticker: "Onigiri sticker",
      meetCat: "Meet Onigiri",
      menuOpen: "Open supervisor menu",
      skip: "Skip to content",
      radar:
        "Skill radar chart across six axes: code, design, narrative, speed, logic, and taste",
    },
    hero: {
      volume: "VOL. 1: FRONTEND ENGINEER",
      openToWork: "OPEN TO WORK",
      quote:
        '"I value product understanding and engineering quality — not just building UIs, but caring about system design."',
      scroll: "SCROLL",
    },
    egg: {
      unlocked: "HIDDEN CHARACTER UNLOCKED",
      desc: "My ever-present supervisor, keeping an eye on code quality.",
      close: "Close",
    },
    contact: {
      subtitle:
        "Open to opportunities that value <hl>system depth</hl> and <hl>product thinking</hl> — let's talk about collaborations or roles.",
    },
    about: {
      role: "Frontend Developer",
      bio: {
        intro:
          "Frontend engineering is my core focus. I primarily work with React and am comfortable with TypeScript, SCSS, and Tailwind CSS, turning design requirements into maintainable frontend architecture.",
        strengthLabel: "Core strengths:",
        strengthValue:
          "Architecture refactoring ✕ AI-assisted development workflow",
      },
    },
    career: {
      "0": {
        role: "B.S. in Computer & Communication Engineering",
        company: "National Kaohsiung University of Science and Technology",
        desc: "Ranked 20 / 112 in the department (top 17.86%). Served as art and design lead for the student association, built a foundation in frontend development and system design, and participated in real project work before graduating.",
      },
      "1": {
        role: "Frontend Intern (senior-year internship)",
        company: "GLSoft",
        desc: "Worked mainly with Angular + SCSS, learning core layout and UI implementation, helping with simple bug fixes, and building practical frontend fundamentals.",
      },
      "2": {
        role: "Frontend Engineer",
        company: "A Nice Day Technology",
        desc: "Led the frontend migration from Astro + React to Next.js 14 App Router; built a multi-step booking system, TapPay payments, LINE LIFF login, GA4 e-commerce tracking, and a WebSocket-powered live customer support chat.",
      },
    },
    perf: {
      intro:
        "Frontend performance techniques you can drive yourself. The numbers are measured live, not screenshots — change the inputs and they change. More will be added over time.",
      navLabel: "demo navigation",
      memo: {
        title: "Caching expensive work",
        desc: "The same calculation (counting primes in a range), with a switch for whether it goes through the useMemo cache, timing the same re-render either way.",
        hint: "Press \u201cforce a re-render\u201d — that state has nothing to do with the calculation, yet the right panel recomputes anyway. That is the problem useMemo solves.",
                renderNo: "render count",
        lastRender: "this re-render",
        result: "primes found",
        range: "range",
        rerender: "re-render and time it",
      },
      lazy: {
        title: "Load as you scroll",
        desc: "The chart component is not in the main bundle — Vite splits it into its own chunk. It is fetched only when you press the button, so the homepage never carries its weight.",
        hint: "Open the Network tab and press it again: a new js file is requested at exactly that moment.",
        scrollPrompt: "scroll inside the box for more",
        loading: "loading…",
        end: "all {{n}} rows loaded",
        count: "{{n}} / {{total}} rows",
        reset: "reset and watch again",
                elapsed: "module arrived in {{ms}} ms",
                      },
      virtual: {
        title: "Render only what is visible",
        desc: "Both sides hold the same 10,000 rows in memory. The left renders every one into the DOM; the right renders only the ~20 in view and offsets them into place.",
        hint: "This is the inverse of demo 02: that one fetches less data, this one paints less DOM.",
        allTitle: "render everything",
        virtualTitle: "virtualised",
        nodes: "DOM nodes",
        firstPaint: "first paint",
        paintAll: "render {{n}} rows",
        allIdle: "not rendered yet (the button will stall the page briefly)",
        note: "A 500x difference in node count, which shows up directly in scroll smoothness and memory use.",
      },
      worker: {
        title: "Move heavy work off the main thread",
        desc: "The same prime calculation, once on the main thread and once in a Web Worker. Identical work, identical result — only the thread differs.",
        hint: "Watch the spinner. On the main thread it freezes solid; in the worker it never stops. That freeze is what users experience as a hang.",
        watch: "watch the spinner, then press a button",
        busy: { main: "computing on the main thread — spinner frozen", worker: "computing in the worker — spinner still turning" },
        run: { main: "run on main thread", worker: "run in worker" },
        where: { main: "main thread", worker: "web worker" },
        workload: "workload (prime search range)",
        lastRun: "last run on",
        elapsed: "elapsed",
        result: "primes found",
      },
      transition: {
        title: "Keep typing responsive",
        desc: "Live filtering over 20,000 items, rendering up to 1,200 of them. The switch decides whether the filter and list re-render are scheduled at low priority — the input always wins.",
        hint: "Turn it off and type fast: the field falls behind your fingers. Turn it on and the list dims before updating, but typing stays smooth.",
        placeholder: "try a keyword, e.g. render",
        lag: "frame blocked",
        hits: "showing {{n}} of {{total}}",
      },
      rate: {
        title: "Cut the number of events",
        desc: "Every keystroke counts as one request that would be sent. Three strategies handle the same typing — see how many each actually sends.",
        hint: "Type a burst quickly, then stop. Raw matches your keystrokes; debounce fires once after you pause; throttle fires at a steady rate while you type.",
        placeholder: "type a burst, then stop",
        raw: "raw",
        debounced: "debounce",
        throttled: "throttle",
        rawNote: "fires on every keystroke",
        debouncedNote: "fires once {{ms}}ms after you stop",
        throttledNote: "at most once every {{ms}}ms",
        reset: "reset",
      },
      layout: {
        title: "Read/write order decides the cost",
        desc: "Both modes do the same work: change every box\u2019s margin and read the layout. Only the order differs — read right after each write, or write everything then read once.",
        hint: "Run transform first, then switch to left/top and watch the FPS drop. transform only touches compositing; left forces layout and paint for every element, every frame.",
                boxes: "{{n}} boxes updated at once",
        mode: { batched: "batched", thrashing: "interleaved" },
        start: "start",
        stop: "stop",
        perFrame: "ms per frame (layout)",
        warning: "Switching to interleaved will visibly freeze the page — that is the point of this demo, not a bug. Stop still works, it just responds a beat late. Stop first if you want to switch modes smoothly."
              },
      image: {
        title: "How much one image can differ",
        desc: "These are the actual assets used on /surf, not a made-up example. The same photo as AVIF and WebP at two widths, with bytes measured live.",
        hint: "AVIF typically lands 30-40% under WebP, and a phone only needs the 768 variant — serving it 1920 wastes several times the bandwidth.",
        alt: "a surfer breaking the surface, used to compare image formats",
        note: "Click a label to preview. In practice you never pick manually — correct sizes and srcset let the browser choose.",
      },
      memoChild: {
        title: "Re-render only what actually changed",
        desc: "A task list where each press updates the duration of exactly one row. The number on the right is how many times that row has rendered, counted for real in an effect.",
        hint: "With both switches on, only the changed row flashes and its counter climbs — the other eleven stay at 1. Turn either switch off and every row re-renders, even though one field changed.",
        idle: "click any row to re-run that task",
        changed: "{{name}} just re-ran",
        onlyOne: "1 row re-rendered",
        allRows: "all {{n}} rows re-rendered",
        colTask: "task",
        colRenders: "renders",
        rerunHint: "click to re-run this task",
        reset: "reset",
      },
      suspense: {
        title: "Waiting for data",
        desc: "When the data is not ready the component throws a promise. React catches it, shows the skeleton, and retries the render once the promise settles. That is the Suspense contract.",
        hint: "Drag the latency and replay — the skeleton stays up for exactly that long. This page itself is prerendered too: its first-paint HTML is generated at build time.",
        idle: "no request started",
        latency: "simulated latency",
        waiting: "waiting, simulating {{ms}} ms",
        start: "start request",
        replay: "replay",
      },
    },
    lab: {
      intro: "Work outside the commercial projects: a scroll-driven story page, plus two screens you normally only see when something goes wrong.",
      enter: "ENTER →",
      back: "back to portfolio",
      perf: { title: "Performance lab", desc: "Ten frontend performance techniques you can drive yourself, measured live." },
      surf: { title: "Seven beats of a wave", desc: "A seven-beat GSAP ScrollTrigger narrative, with Lenis smooth scrolling on desktop." },
      notFound: { title: "Onigiri, lost", desc: "The 404 page, drawn as a single manga panel where the paw prints stop." },
      error: { title: "The napping server", desc: "The 500 page, same visual family as the 404 — Onigiri fell asleep." },
    },
    detail: {
      openNewTab: "Open in new tab",
      hintScreenshot:
        "These are actual screenshots of the site. Use the button to visit the full website.",
      hintEmbed:
        "The site's security policy blocks embedded previews. Use the button to visit the full website.",
      pager: "Project navigation: previous / next",
    },
    projects: {
      "01": {
        desc: "Vue 3 + Quasar + TypeScript e-commerce platform with responsive design, Pinia state management, an Axios API layer, reCAPTCHA, SSR, and SEO.",
        full: "Co-developed an e-commerce platform with another frontend engineer using Vue 3 Composition API + Quasar Framework + TypeScript. Integrated Pinia state management and Vue Router, with full responsive design across mobile, tablet and desktop. Modules covered product browsing, cart flow, member center (orders / favorites / profile), dealer lookup, FAQ and contact forms. Built on SSR for SEO, supporting major browsers and passing W3C validation.",
      },
      "02": {
        desc: "Next.js 14 App Router migration with multi-step home-inspection booking, TapPay payments, LINE LIFF login, and GA4 e-commerce tracking.",
        full: "Led the frontend architecture migration, refactoring a hybrid Astro + React codebase into Next.js 14 App Router with a unified SSR / SSG strategy. Built a multi-step home-inspection booking system (Steps 1–5) with a backend collaborator, covering quote estimation, date selection, contact details, and order confirmation. Integrated the TapPay SDK for online credit card payments and LINE LIFF for LINE login, and configured GA4 e-commerce events (add_to_cart, begin_checkout, purchase). Deployed on GCP + Docker with Nginx static-asset caching for performance.",
      },
      "03": {
        desc: "React + MUI admin system with WebSocket live customer support chat, LINE sticker rendering, scheduling, orders, and member management.",
        full: "Took over and maintained an existing admin system (React / Next.js / TypeScript / MUI). Core features included real-time customer support chat with live message delivery via WebSocket, LINE sticker rendering, quick-reply templates, media uploads, and dispatching for various webhook events. Also maintained scheduling, order management, merchant backend, member management, and promotion modules, supporting the daily operations of a startup with annual revenue in the tens of millions.",
      },
      "04": {
        desc: "Aesthetic clinic admin system with multi-step forms using React Hook Form + Zod, TanStack Query, role-based access, and canned messages.",
        full: "Contributed to a modern aesthetic-clinic admin system, owning the frontend design and implementation of three core modules. Booking / consultation records: multi-step form validation with React Hook Form + Zod, backed by TanStack Query for async data flow. Account management: full UI for creating, editing and setting permissions, with CRUD wired to APIs. Canned-message management: reusable message templates that let clinic staff reply quickly and work more efficiently.",
      },
      "05": {
        desc: "React 19 + Vite energy / environment monitoring SPA with adaptive scaling (1280px to 4K), real-time node traffic tracking, and a brand design system.",
        full: "Built the frontend for energy / environment monitoring systems from design specs, covering real-time dashboards, historical queries, and multi-device comparison. Used React 19 + Vite for a high-performance SPA with an adaptive scaling system (1280px to 4K) for seamless rendering across resolutions. Designed a RESTful API service layer with unified auth token handling and error interception, and built a brand design system with Tailwind CSS for UI consistency. The two variants emphasized different priorities: the energy system provided granular regional views, while the environment system tracked real-time per-node traffic.",
      },
      "06": {
        desc: "Tablet-optimized restaurant POS with real-time order updates over WebSocket, barcode scanning, and multi-method payment recognition.",
        full: "Built a tablet-optimized operating UI with React + Tailwind CSS, with real-time order and status updates over WebSocket. Integrated barcode scanning and supported multi-method payment recognition and checkout. Designed an extensible, maintainable frontend architecture for high-frequency operations, keeping interactions smooth in a fast-paced dining environment.",
      },
      "07": {
        desc: "Care home website with frontend architecture from scratch, Astro + React, Swiper carousel, responsive design, and GA4 tracking.",
        full: "Solely responsible for the frontend of a care home website, planning the full architecture from scratch: routing, component system, and global style conventions. Built a static site with Astro + React, balancing SEO and interactivity. Implemented responsive layouts across desktop, tablet, and mobile, integrated Swiper for carousel interactions, collaborated on backend data integration, and set up GA4 tracking.",
      },
      "08": {
        desc: "Corporate website focused on overall site design, page UI implementation, and basic SEO field checks and optimization.",
        full: "Responsible for the site design and frontend UI of a corporate website, with no specific framework dependency, focusing on visual layout, interaction details, and markup quality. Completed page layouts and responsive rendering across desktop, tablet, and mobile. Also performed basic SEO field checks and optimization for title, meta description, Open Graph, semantic tags, and image alt text to improve search indexing and social sharing quality.",
      },
    },
  },
};

export default en;
