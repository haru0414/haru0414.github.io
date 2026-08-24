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
    // Site header. Visible labels are latin codes; these strings are the aria-labels.
    work: {
      intro:
        "The full index of commercial work and personal side projects. The homepage shows a selection; this is all of them — filter by stack, or open one for the implementation details.",
      filterLabel: "Stack",
      all: "All",
      count: "{{n}} projects",
      view: "Details",
      live: "Live site",
      side: "Side project",
    },
    siteNav: {
      label: "Site navigation",
      work: "Work",
      lab: "Performance lab",
      blog: "Blog",
      contact: "Say hi",
      current: "Current page",
      open: "Open menu",
      close: "Close menu",
    },
    footer: {
      explore: "Explore",
      latest: "Latest posts",
      contact: "Contact",
      surf: "Seven Scenes",
      resume: "Resume PDF",
      email: "Email me",
      built: "Built with React 19 + Vite",
      rights: "© {{year}} Haru Li",
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
      mainNav: "Main navigation",
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
      readPost: "Read the write-up",
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
      lookup: {
        title: "The cost of looking up inside a loop",
        desc: "Mapping every order to a user name. One calls find inside the map; the other builds a Map index once and looks up from it. Results are identical and verified against each other.",
        hint: "Calling find inside map is the most common performance trap in list rendering — one innocent line that costs n x m comparisons. Double the data and the find side gets four times slower while the Map side only doubles.",
        scanTitle: "illustration: this order needs user-{{id}}",
        scanFind: "scanning from the start, {{n}} comparisons so far",
        scanMap: "index hits directly, 1 lookup",
        findWhy: "users is an array, so it scans from the start until it hits a match — once per order.",
        mapWhy: "Build an id-to-user table once, then fetch by id directly. Like a phone book sorted by surname: you turn straight to the page.",
        find: "map + find",
        map: "Map index first",
        size: "dataset",
        dataset: "{{n}} orders x {{n}} users",
        ops: "{{n}} comparisons",
        run: "run comparison",
        idle: "press the button to start",
        ratio: "find is {{n}}x slower",
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
    blog: {
      intro:
        "Notes from building things: the traps I fell into, what the measurements actually said, and the cases where the textbook is right but reality is messier.",
      read: "READ",
      minutes: "{{n}} min read",
      backToList: "back to all posts",
      pager: "post navigation: previous / next",
      authorBio: "Frontend engineer. I write here mainly to organise the traps I have fallen into — mostly implementation detail and measurements.",
      viewPortfolio: "view portfolio",
      count: "{{n}} posts",
      featured: "latest",
      footerNote: "Every post here lives as a markdown file in this repo — publishing is adding a file.",
      searchPlaceholder: "search titles, summaries or tags",
      empty: "No topics match \u201c{{q}}\u201d.",
      pagination: "pagination",
      boardTitle: "Blog",
      boardDesc: "Topics tagged {{tag}}.",
      navSite: "site navigation",
      navBreadcrumb: "breadcrumb",
      home: "home",
      boards: "boards",
      allBoards: "all topics",
      colLength: "length",
      colDate: "posted",
      chars: "chars",
      listNote: "{{n}} topics. Replies are not enabled — reach me through the contact section instead.",
      floor: "original post",
      postCount: "{{n}} posts",
      tags: "tags",
      recent: "recent posts",
      toc: "contents",
      clearFilter: "clear",
      filtered: "{{n}} posts tagged {{tag}}",
      prev: "previous",
      next: "next",
    },
    lab: {
      intro: "Work outside the commercial projects: a scroll-driven story page, plus two screens you normally only see when something goes wrong.",
      enter: "ENTER →",
      back: "back to portfolio",
      blog: { title: "Blog", desc: "Traps I fell into and what the measurements said, written down for future me." },
      perf: { title: "Performance lab", desc: "{{n}} frontend performance techniques you can drive yourself, measured live." },
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
    // Per-page SEO copy. Shared by prerender (entry-server) and client-side
    // navigation (SeoMeta) so the strings live in one place.
    pageSeo: {
      home: {
        title: "Haru Li｜Frontend Engineer Portfolio",
        description:
          "CheWei Li (Haru) — frontend engineer working in React, Next.js and TypeScript. Commercial experience across e-commerce platforms, site architecture migrations, admin systems, payment integration and real-time messaging.",
      },
      work: {
        title: "WORK｜Selected Projects by Haru Li",
        description:
          "E-commerce platforms, a Next.js architecture migration, admin systems, payment integration, real-time messaging and a React Native travel app — the full index of commercial and side projects, filterable by tech stack.",
      },
      lab: {
        title: "PERF LAB｜Hands-on Frontend Performance Demos",
        description:
          "useMemo caching, lazy loading on scroll, Suspense data fetching — hands-on frontend performance demos where the numbers are measured live in your browser.",
      },
      surf: {
        title: "SURF｜A GSAP Scroll Narrative Experiment",
        description:
          "A single-page scroll narrative choreographed with GSAP ScrollTrigger: seven scenes through one session at sea, with Lenis smooth scrolling on desktop. Photography licensed free via Unsplash.",
      },
      blog: {
        title: "BLOG｜Notes on Frontend Engineering",
        description:
          "Notes from building frontends: the traps, the measurements, and the things textbooks get right but reality complicates. Written in Traditional Chinese.",
      },
      e500: {
        title: "500 Server Asleep｜Haru Li",
        description:
          "The visual design of the 500 error screen, from the same family as the lost-cat 404 page. Kept browsable so the design can be reviewed.",
      },
      board: {
        title: "{{tag}}｜Blog Haru Li",
        description: "Posts tagged “{{tag}}”.",
      },
      suffix: "｜Haru Li",
    },
    projects: {
      labels: {
        problem: "The problem",
        approach: "Approach",
        result: "Outcome",
      },
      "01": {
        desc: "Vue 3 + Quasar + TypeScript e-commerce platform with responsive design, Pinia state management, an Axios API layer, reCAPTCHA, SSR, and SEO.",
        problem: "Working with one other frontend engineer, a single codebase had to carry product browsing, the cart flow, a member center (orders / favorites / profile), dealer lookup, FAQ and contact forms — while product content still needed to be indexable by search engines.",
        approach: "Built with Vue 3 Composition API + Quasar Framework + TypeScript, with Pinia for state and Vue Router for routing. Full responsive design across mobile, tablet and desktop, an Axios-wrapped API layer, and reCAPTCHA on forms. Rendering runs on SSR so product pages arrive with content in the first response.",
        result: "Supports all major browsers and passes W3C validation.",
      },
      "02": {
        desc: "Next.js 14 App Router migration with multi-step home-inspection booking, TapPay payments, LINE LIFF login, and GA4 e-commerce tracking.",
        problem: "The site ran on a hybrid Astro + React setup where two rendering models coexisted, leaving the SSR / SSG boundary hard to maintain. A multi-step home-inspection booking flow and online payment had to be added on top.",
        approach: "Led the architecture migration, refactoring into Next.js 14 App Router with a single unified SSR / SSG strategy. Built a multi-step home-inspection booking system (Steps 1–5) with a backend collaborator, covering quote estimation, date selection, contact details and order confirmation. Integrated the TapPay SDK for card payments, LINE LIFF for LINE login, and configured GA4 e-commerce tracking (add_to_cart, begin_checkout, purchase).",
        result: "Migration completed with the rendering strategy consolidated into one. Deployed on GCP + Docker with Nginx configured for static asset caching.",
      },
      "03": {
        desc: "React + MUI admin system with WebSocket live customer support chat, LINE sticker rendering, scheduling, orders, and member management.",
        problem: "Taking over an existing admin system meant maintaining several business-critical modules without interrupting daily operations. The customer-service chat in particular had to deliver messages in real time and handle every event type LINE sends.",
        approach: "Took over and maintained the system in React / Next.js / TypeScript / MUI. The live chat uses WebSocket for real-time message push, with LINE sticker rendering, quick-reply templates and multimedia upload, plus dispatch for multiple webhook event types. Also maintained scheduling, order management, the merchant backend, member management and discount campaigns.",
        result: "Supports the daily operations of a startup with annual revenue in the tens of millions (TWD).",
      },
      "04": {
        desc: "Aesthetic clinic admin system with multi-step forms using React Hook Form + Zod, TanStack Query, role-based access, and canned messages.",
        problem: "Booking and consultation records at an aesthetic clinic involve long forms with many fields, where invalid input has to be caught before submission. Staff also needed reusable message templates for fast replies.",
        approach: "Owned the frontend design and implementation of three core modules. The booking / consultation flow uses React Hook Form + Zod for multi-step validation, with TanStack Query handling async data. The account module provides full create, edit and permission-setting interfaces with CRUD wired to the API. The canned-message module manages reusable templates for the clinic staff's quick-reply scenario.",
      },
      "05": {
        desc: "React 19 + Vite energy / environment monitoring SPA with adaptive scaling (1280px to 4K), real-time node traffic tracking, and a brand design system.",
        problem: "The energy / environmental monitoring interface had to work on a 1280px laptop and a 4K wall display alike. The two systems also emphasize different data: one reads regional distribution, the other tracks live throughput per node.",
        approach: "Built the frontend from design specs, covering live dashboards, historical queries and multi-device comparison. Implemented as a React 19 + Vite SPA with an adaptive scaling system (1280px to 4K) for multiple screen resolutions. Designed a RESTful API service layer centralizing auth token handling and error interception, with Tailwind CSS establishing a brand design system for UI consistency.",
      },
      "06": {
        desc: "Tablet-optimized restaurant POS with real-time order updates over WebSocket, barcode scanning, and multi-method payment recognition.",
        problem: "A restaurant POS is operated constantly and forgives little: order state has to stay in sync across devices in real time, or the wrong dish goes out.",
        approach: "Built a tablet-optimized interface with React + Tailwind CSS, using WebSocket for real-time order and status updates. Integrated barcode scanning with support for multiple payment methods through checkout. Designed an extensible, maintainable frontend architecture around a high-frequency operation scenario.",
      },
      "07": {
        desc: "Care home website with frontend architecture from scratch, Astro + React, Swiper carousel, responsive design, and GA4 tracking.",
        problem: "The sanatorium site started from nothing — no existing frontend architecture, component system or style conventions to build on — while still needing both SEO and interactivity.",
        approach: "Sole owner of the frontend, planning the whole architecture from scratch: route design, component system and global style conventions. Built as a static site with Astro + React to serve SEO and interactivity together. Implemented full responsive layouts, integrated Swiper for carousels, wired up backend data with the team, and completed GA4 tracking setup.",
      },
      "08": {
        desc: "Corporate website focused on overall site design, page UI implementation, and basic SEO field checks and optimization.",
        problem: "The corporate site needed both the visual design and the frontend build handled together, without relying on any frontend framework.",
        approach: "Owned the site design and the frontend UI, focusing on layout, interaction detail and markup quality, delivering each page's layout and responsive behavior from the design. Also ran a baseline SEO pass covering title, meta description, Open Graph, semantic markup and image alt text.",
      },
      "09": {
        desc: "Personal side project: a React Native + Expo travel journal app with an offline-first architecture, a Supabase backend, and a full EAS Build to TestFlight release.",
        problem: "The moment you most want to log on a trip is usually the moment you have no signal. A personal side project, built to walk the full iOS release process end to end and then actually use it while traveling.",
        approach: "AI-assisted development, owning everything from design through frontend to database, including the UI/UX design (Neo-Brutalism ✕ Showa retro). Built on React Native 0.83.2 + Expo SDK 55 + TypeScript with Zustand for state, Supabase (PostgreSQL + Auth + Storage) as the backend and Expo SQLite locally. Designed an offline-first architecture pairing local SQLite with a sync queue and automatic retry so logging keeps working without a connection. Integrated Google OAuth / Apple Sign In, Expo Push Notifications, Sentry error tracking and the Google Directions API, plus invite-code trip co-editing, multi-photo collage share cards, an interactive world map and haptic feedback.",
        result: "Walked the full iOS release path — EAS Build, provisioning profiles and TestFlight beta distribution — and used it on real trips.",
        shots: {
          "0": {
            label: "Login",
            desc: "Google and Apple Sign In, both handled through Supabase Auth.",
          },
          "1": {
            label: "World map",
            desc: "The home map pins every city and country visited and tracks collection progress; while a trip is in progress the whole screen switches to that day's live itinerary.",
          },
          "2": {
            label: "Travel log",
            desc: "Photos are compressed before uploading to Supabase Storage, with the Google Places API filling in location details. Offline, entries land in local SQLite and queue up for sync.",
          },
          "3": {
            label: "Trip planning",
            desc: "Cards reflect planning / active / completed state with a countdown to departure, and an invite code lets travel companions co-edit the itinerary.",
          },
          "4": {
            label: "Profile",
            desc: "Account details, continent collection progress, sync status, sign-out, and the app intro.",
          },
        },
      },
    },
  },
};

export default en;
