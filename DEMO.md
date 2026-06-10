<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>KAIZEN // Story Portfolio</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Noto+Sans+JP:wght@400;500;700&display=swap"
      rel="stylesheet"
    />

    <!-- Libraries -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://unpkg.com/framer-motion@10.16.4/dist/framer-motion.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>

    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              paper: "#F2EAD3",
              ink: "#182333",
              nekoma: "#D1382C",
              poster: "#FDBF27",
              teal: "#2C505E",
            },
            fontFamily: {
              heading: ['"Dela Gothic One"', "sans-serif"],
              body: ['"Noto Sans JP"', "sans-serif"],
            },
            boxShadow: {
              manga: "6px 6px 0px 0px #182333",
              "manga-sm": "3px 3px 0px 0px #182333",
              "manga-hover": "9px 9px 0px 0px #182333",
            },
            backgroundImage: {
              halftone: "radial-gradient(#182333 1px, transparent 1px)",
            },
          },
        },
      };
    </script>

    <style>
      body {
        background-color: #f2ead3;
        color: #182333;
        cursor: none; /* Custom cursor */
      }

      /* Paper Grain Noise */
      .noise-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9998;
        opacity: 0.08;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      }

      /* Custom Scrollbar */
      ::-webkit-scrollbar {
        width: 12px;
        background: #f2ead3;
        border-left: 2px solid #182333;
      }
      ::-webkit-scrollbar-thumb {
        background: #d1382c;
        border: 2px solid #182333;
      }

      /* Utilities */
      .text-vertical {
        writing-mode: vertical-rl;
        text-orientation: mixed;
      }

      .text-outline {
        -webkit-text-stroke: 2px #182333;
        color: #fdbf27;
      }

      .text-outline-white {
        -webkit-text-stroke: 2px #182333;
        color: #ffffff;
      }

      .clip-diagonal {
        clip-path: polygon(0 0, 100% 0, 100% 85%, 0% 100%);
      }

      /* Custom Cursor */
      .cursor-dot {
        width: 20px;
        height: 20px;
        background-color: #d1382c;
        border: 2px solid #182333;
        border-radius: 50%;
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: width 0.2s, height 0.2s, background-color 0.2s;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>

    <script type="text/babel">
      const { useState, useEffect, useRef } = React;
      const { motion, useScroll, useTransform, useSpring } = window.Motion;

      // --- Components ---

      const CustomCursor = () => {
        const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
        const [isHovering, setIsHovering] = useState(false);

        useEffect(() => {
          const moveCursor = (e) => setMousePos({ x: e.clientX, y: e.clientY });
          const handleMouseOver = (e) => {
            if (
              e.target.tagName === "BUTTON" ||
              e.target.tagName === "A" ||
              e.target.closest(".interactive")
            ) {
              setIsHovering(true);
            }
          };
          const handleMouseOut = () => setIsHovering(false);

          window.addEventListener("mousemove", moveCursor);
          document.addEventListener("mouseover", handleMouseOver);
          document.addEventListener("mouseout", handleMouseOut);

          return () => {
            window.removeEventListener("mousemove", moveCursor);
            document.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseout", handleMouseOut);
          };
        }, []);

        return (
          <div
            className="cursor-dot"
            style={{
              left: mousePos.x,
              top: mousePos.y,
              width: isHovering ? "40px" : "20px",
              height: isHovering ? "40px" : "20px",
              backgroundColor: isHovering ? "#FDBF27" : "#D1382C",
              mixBlendMode: "difference",
            }}
          />
        );
      };

      const Navbar = () => {
        const sections = ["Start", "Character", "Episodes", "Next"];

        return (
          <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <div className="bg-white border-2 border-ink shadow-manga-sm px-6 py-2 flex items-center gap-4 pointer-events-auto rounded-full">
              <span className="font-heading text-sm text-nekoma">
                BUS STOP:
              </span>
              <div className="h-0.5 w-12 bg-ink"></div>
              {sections.map((sec, i) => (
                <React.Fragment key={sec}>
                  <a
                    href={`#${sec.toLowerCase()}`}
                    className="group relative flex items-center justify-center"
                  >
                    <div className="w-3 h-3 bg-white border-2 border-ink rounded-full group-hover:bg-nekoma transition-colors"></div>
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-ink text-white text-[10px] px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-heading">
                      {sec}
                    </span>
                  </a>
                  {i < sections.length - 1 && (
                    <div className="h-0.5 w-8 bg-ink/30"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </nav>
        );
      };

      const Hero = () => {
        return (
          <section
            id="start"
            className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-20"
          >
            {/* Background Elements */}
            <div
              className="absolute inset-0 z-0 opacity-10"
              style={{
                backgroundSize: "20px 20px",
                backgroundImage:
                  "radial-gradient(#182333 2px, transparent 2px)",
              }}
            ></div>

            <div className="relative z-10 container mx-auto px-4 flex flex-col items-center">
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center"
              >
                <h2 className="font-heading text-xl md:text-3xl text-ink tracking-widest mb-2 bg-poster inline-block px-2 border-2 border-ink transform -rotate-2 shadow-manga-sm">
                  VOL. 1: THE BEGINNING
                </h2>
                <h1 className="font-heading text-7xl md:text-9xl tracking-tighter leading-none mb-4">
                  <span className="text-outline block">CREATIVE</span>
                  <span className="text-ink block transform translate-x-4">
                    DEV!!
                  </span>
                </h1>
              </motion.div>

              {/* Hero Image / Manga Cover */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="relative mt-8 w-full max-w-4xl aspect-video bg-white border-4 border-ink shadow-manga overflow-hidden group"
              >
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-1">
                  <span className="bg-nekoma text-white font-heading px-2 py-1 text-sm border border-ink">
                    WEEKLY JUMP
                  </span>
                  <span className="bg-teal text-white font-heading px-2 py-1 text-xs border border-ink">
                    ¥ 290
                  </span>
                </div>

                <img
                  src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                  className="w-full h-full object-cover filter sepia-[.3] contrast-125 group-hover:scale-105 transition-transform duration-700"
                  alt="Hero Scene"
                />

                {/* Dialogue Bubble */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                  className="absolute bottom-8 right-8 bg-white border-2 border-ink p-4 rounded-[50%_50%_0_50%] shadow-manga max-w-xs"
                >
                  <p className="font-body text-sm font-bold leading-tight">
                    "I don't just write code.
                    <br />I weave narratives into pixels!"
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </section>
        );
      };

      const RadarChart = () => {
        // Static visual representation of stats
        return (
          <div className="relative w-48 h-48 mx-auto mt-4">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full overflow-visible"
            >
              {/* Background Grid */}
              <polygon
                points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <polygon
                points="50,25 75,37.5 75,62.5 50,75 25,62.5 25,37.5"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="1"
              />

              {/* Data Polygon: Coding, Design, Story, Speed, Stamina, Logic */}
              <motion.polygon
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                points="50,10 90,30 80,70 50,85 20,70 15,35"
                fill="rgba(209, 56, 44, 0.5)"
                stroke="#D1382C"
                strokeWidth="2"
              />

              {/* Labels */}
              <text
                x="50"
                y="0"
                textAnchor="middle"
                className="text-[8px] font-heading fill-ink"
              >
                CODE
              </text>
              <text
                x="100"
                y="25"
                textAnchor="start"
                className="text-[8px] font-heading fill-ink"
              >
                DESIGN
              </text>
              <text
                x="100"
                y="80"
                textAnchor="start"
                className="text-[8px] font-heading fill-ink"
              >
                STORY
              </text>
              <text
                x="50"
                y="105"
                textAnchor="middle"
                className="text-[8px] font-heading fill-ink"
              >
                SPEED
              </text>
              <text
                x="0"
                y="80"
                textAnchor="end"
                className="text-[8px] font-heading fill-ink"
              >
                LOGIC
              </text>
              <text
                x="0"
                y="25"
                textAnchor="end"
                className="text-[8px] font-heading fill-ink"
              >
                VIBE
              </text>
            </svg>
          </div>
        );
      };

      const About = () => {
        return (
          <section id="character" className="py-20 container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left: Title Vertical */}
              <div className="hidden md:flex flex-col justify-center items-center">
                <h2 className="text-vertical font-heading text-6xl text-transparent text-outline opacity-20">
                  CHARACTER
                </h2>
              </div>

              {/* Main Bento Grid */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Profile Photo */}
                <div className="md:col-span-1 bg-white border-3 border-ink shadow-manga p-2 interactive">
                  <div className="relative w-full h-64 bg-teal overflow-hidden border border-ink">
                    <img
                      src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                      className="w-full h-full object-cover filter grayscale contrast-125"
                      alt="Profile"
                    />
                    <div className="absolute bottom-0 left-0 bg-poster px-2 py-1 border-t-2 border-r-2 border-ink font-heading text-xs">
                      NO. 10 PLAYER
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <h3 className="font-heading text-xl">KAITO TANAKA</h3>
                    <p className="font-body text-xs text-gray-500">
                      Frontend Ace
                    </p>
                  </div>
                </div>

                {/* Card 2: Stats */}
                <div className="md:col-span-1 bg-white border-3 border-ink shadow-manga p-6 flex flex-col items-center justify-center interactive">
                  <h3 className="font-heading text-lg border-b-2 border-ink w-full text-center pb-2 mb-2">
                    ABILITY PARAMETERS
                  </h3>
                  <RadarChart />
                </div>

                {/* Card 3: Bio Dialogue */}
                <div className="md:col-span-1 bg-paper border-3 border-ink shadow-manga p-6 relative flex flex-col justify-center interactive">
                  <div className="absolute -top-3 -left-3 bg-nekoma text-white font-heading px-3 py-1 border-2 border-ink shadow-[2px_2px_0_0_#000]">
                    BIO
                  </div>
                  <p className="font-body font-medium leading-relaxed mt-4">
                    "Born in the era of dial-up, trained in the dojo of strict
                    TypeScript. I build interfaces that feel like turning the
                    page of your favorite manga.
                    <br />
                    <br />
                    <span className="bg-yellow-200">Special Move:</span>{" "}
                    Pixel-Perfect Render!"
                  </p>
                </div>

                {/* Card 4: Tech Stack (Wide) */}
                <div className="md:col-span-3 bg-ink text-white border-3 border-black shadow-manga p-6 interactive">
                  <div className="flex flex-wrap gap-4 items-center justify-center">
                    <span className="font-heading text-poster text-2xl mr-4">
                      WEAPONS //
                    </span>
                    {[
                      "React.js",
                      "Next.js",
                      "Tailwind",
                      "Three.js",
                      "Figma",
                      "WebGL",
                    ].map((tech) => (
                      <span
                        key={tech}
                        className="px-4 py-2 border-2 border-white font-heading text-sm hover:bg-white hover:text-ink transition-colors cursor-crosshair"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      };

      const Projects = () => {
        const scrollRef = useRef(null);
        const { scrollYProgress } = useScroll({ target: scrollRef });
        const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

        const episodes = [
          {
            id: "01",
            title: "E-COMMERCE ARC",
            desc: "A Brutalist Shopping Exp.",
            color: "bg-nekoma",
          },
          {
            id: "02",
            title: "DASHBOARD SAGA",
            desc: "Fintech Data Viz",
            color: "bg-teal",
          },
          {
            id: "03",
            title: "THE SOCIAL NET",
            desc: "Community Platform",
            color: "bg-poster",
          },
          {
            id: "04",
            title: "AI CHRONICLES",
            desc: "LLM Interface",
            color: "bg-indigo-600",
          },
        ];

        return (
          <section
            id="episodes"
            className="bg-white border-y-4 border-ink py-20 overflow-hidden relative"
          >
            {/* Background Stripes */}
            <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(45deg,#000_0,#000_1px,transparent_0,transparent_50%)] bg-[length:10px_10px]"></div>

            <div className="container mx-auto px-4 mb-10 flex justify-between items-end">
              <h2 className="font-heading text-5xl md:text-7xl text-ink leading-none">
                EPISODE
                <br />
                <span className="text-nekoma">LIST</span>
              </h2>
              <div className="hidden md:block font-heading text-xl animate-pulse">
                SCROLL ➔
              </div>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex overflow-x-auto gap-8 px-4 pb-12 snap-x snap-mandatory hide-scrollbar">
              {episodes.map((ep, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -10, rotateY: 15 }}
                  className="flex-shrink-0 snap-center w-80 md:w-96 aspect-[2/3] relative perspective-1000 interactive"
                >
                  <div className="w-full h-full border-4 border-ink bg-paper shadow-manga flex flex-col relative overflow-hidden">
                    {/* Spine Design (Left Strip) */}
                    <div className="absolute left-0 top-0 bottom-0 w-12 border-r-4 border-ink bg-white flex flex-col items-center justify-center py-4 z-10">
                      <span className="font-heading text-2xl transform -rotate-90 whitespace-nowrap">
                        VOL. {ep.id}
                      </span>
                      <div className="mt-auto w-8 h-8 rounded-full bg-ink"></div>
                    </div>

                    {/* Cover Content */}
                    <div
                      className={`ml-12 h-2/3 ${ep.color} border-b-4 border-ink relative overflow-hidden`}
                    >
                      {/* Mock Image */}
                      <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                      <h3 className="absolute bottom-2 right-2 font-heading text-4xl text-white text-outline-white leading-none text-right">
                        {ep.title}
                      </h3>
                    </div>

                    <div className="ml-12 p-4 flex-1 flex flex-col justify-between">
                      <p className="font-body font-bold text-lg">{ep.desc}</p>
                      <div className="flex justify-end">
                        <button className="bg-ink text-white font-heading px-4 py-2 hover:bg-nekoma transition-colors border-2 border-transparent hover:border-ink">
                          READ >
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        );
      };

      const Timeline = () => {
        const jobs = [
          {
            year: "2024",
            role: "Senior Frontend",
            company: "Tech Giant",
            text: "Leading the UI overhaul arc.",
          },
          {
            year: "2022",
            role: "UI Engineer",
            company: "Startup Inc",
            text: "Battling legacy code monsters.",
          },
          {
            year: "2020",
            role: "Junior Dev",
            company: "Web Agency",
            text: "The training begins.",
          },
        ];

        return (
          <section className="py-20 container mx-auto px-4 flex flex-col items-center">
            <h2 className="font-heading text-4xl mb-12 bg-white px-4 py-2 border-2 border-ink shadow-manga">
              CAREER PATH
            </h2>

            <div className="relative max-w-2xl w-full">
              {/* Vertical Line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-2 bg-ink transform -translate-x-1/2"></div>

              {jobs.map((job, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center mb-12 ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Content Box */}
                  <div className="ml-20 md:ml-0 md:w-1/2 px-4">
                    <div
                      className={`bg-white border-2 border-ink p-4 shadow-manga relative ${
                        index % 2 === 0 ? "md:text-left" : "md:text-right"
                      }`}
                    >
                      <span className="absolute -top-3 bg-poster px-2 border border-ink font-heading text-xs font-bold shadow-sm left-4">
                        {job.year}
                      </span>
                      <h3 className="font-heading text-xl text-nekoma">
                        {job.company}
                      </h3>
                      <h4 className="font-bold mb-2">{job.role}</h4>
                      <p className="text-sm text-gray-600">{job.text}</p>
                    </div>
                  </div>

                  {/* Bus Stop Node */}
                  <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white border-4 border-ink rounded-full flex items-center justify-center z-10 shadow-md">
                    <div className="w-4 h-4 bg-nekoma rounded-full"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        );
      };

      const Footer = () => {
        return (
          <footer
            id="next"
            className="bg-teal text-paper border-t-4 border-ink py-20 relative overflow-hidden"
          >
            <div className="container mx-auto px-4 text-center relative z-10">
              <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
                <h2 className="font-heading text-6xl md:text-8xl mb-4 text-outline-white cursor-pointer interactive">
                  TO BE
                  <br />
                  CONTINUED
                </h2>
              </motion.div>
              <p className="font-body text-xl mb-8 max-w-md mx-auto">
                Ready for the next chapter? Let's co-author a masterpiece
                together.
              </p>
              <a
                href="mailto:hello@example.com"
                className="inline-block bg-nekoma text-white font-heading text-2xl px-8 py-4 border-4 border-ink shadow-[8px_8px_0_0_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all interactive"
              >
                CONTACT ME
              </a>

              <div className="mt-16 text-sm opacity-60 font-mono">
                © 2024 PORTFOLIO // DESIGN INSPIRED BY HAIKYU!!
              </div>
            </div>
          </footer>
        );
      };

      const App = () => {
        return (
          <div className="min-h-screen font-body text-ink selection:bg-poster selection:text-ink">
            <div className="noise-overlay"></div>
            <CustomCursor />
            <Navbar />
            <Hero />
            <About />
            <Projects />
            <Timeline />
            <Footer />
          </div>
        );
      };

      const root = ReactDOM.createRoot(document.getElementById("root"));
      root.render(<App />);
    </script>
  </body>
</html>
