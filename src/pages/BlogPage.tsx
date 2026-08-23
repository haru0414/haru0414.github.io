import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import BlogChrome from "../components/blog/BlogChrome";
import CrayonDoodle from "../components/crayon/CrayonDoodle";
import { Search } from "lucide-react";
import { AuthorCard } from "../components/blog/BlogSidebar";
import { allBoards, boardFromSlug, boardSlug, posts } from "../data/posts";
import ResponsiveImg from "../components/ResponsiveImg";

const PER_PAGE = 10;

export default function BlogPage() {
  const { t } = useTranslation();
  // 看板來自網址而非 state：這樣每個看板都有可分享、可被索引的網址
  const { board: slug } = useParams();
  const board = slug ? boardFromSlug(slug) : null;
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const byBoard = board ? posts.filter((p) => p.tags.includes(board)) : posts;
    const needle = q.trim().toLowerCase();
    if (!needle) return byBoard;
    // 標題、摘要、標籤都納入搜尋範圍；內文不搜——會把整份 HTML 拉進比對
    return byBoard.filter((p) =>
      [p.title, p.summary, p.tags.join(" ")].join(" ").toLowerCase().includes(needle),
    );
  }, [board, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const shown = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  return (
    <BlogChrome>
      <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
        {/* 麵包屑：論壇一定有的層級指示 */}
        <nav
          aria-label={t("blog.navBreadcrumb")}
          className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]"
          style={{ color: "var(--color-muted)" }}
        >
          <Link to="/" className="no-underline hover:underline" style={{ color: "var(--color-muted)" }}>
            {t("blog.home")}
          </Link>
          <CrayonDoodle
            type="slash"
            color="var(--color-nekoma)"
            strokeWidth={9}
            className="h-3 w-2 shrink-0 opacity-70"
          />
          {board ? (
            <>
              <Link to="/blog" className="no-underline hover:underline" style={{ color: "var(--color-muted)" }}>
                {t("blog.allBoards")}
              </Link>
              <CrayonDoodle
            type="slash"
            color="var(--color-nekoma)"
            strokeWidth={9}
            className="h-3 w-2 shrink-0 opacity-70"
          />
              <span aria-current="page" style={{ color: "var(--color-ink)" }}>
                {board}
              </span>
            </>
          ) : (
            <span aria-current="page" style={{ color: "var(--color-ink)" }}>
              {t("blog.allBoards")}
            </span>
          )}
        </nav>

        {/* 頁面主標。改成論壇版面時漏了，一個頁面沒有 h1 對 SEO 與
            螢幕閱讀器都是缺陷 */}
        <header className="mb-6">
          <h1 className="m-0 text-2xl md:text-3xl" style={{ fontFamily: "var(--font-heading)" }}>
            {board ?? t("blog.boardTitle")}
          </h1>
          <p className="mt-2 max-w-xl text-xs leading-relaxed" style={{ color: "var(--color-muted)" }}>
            {board ? t("blog.boardDesc", { tag: board }) : t("blog.intro")}
          </p>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-8">
          <div className="min-w-0 flex-1">
            <label className="mb-4 flex items-center gap-2 border-2 px-3 py-2" style={{ borderColor: "var(--color-ink)", backgroundColor: "var(--color-surface)" }}>
              <Search size={15} className="shrink-0" aria-hidden="true" />
              <input
                type="search"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                placeholder={t("blog.searchPlaceholder")}
                className="interactive w-full bg-transparent text-sm outline-none"
                style={{ color: "var(--color-ink)" }}
                aria-label={t("blog.searchPlaceholder")}
              />
            </label>

            {/* 討論串列表：表頭 + 密集列，不用卡片 */}
            <div className="border-2" style={{ borderColor: "var(--color-ink)", backgroundColor: "var(--color-surface)" }}>
              <div
                className="flex items-center gap-3 border-b-2 px-3 py-2 text-[11px]"
                style={{ borderColor: "var(--color-ink)", backgroundColor: "var(--color-panel)", color: "var(--color-on-panel)", fontFamily: "var(--font-heading)" }}
              >
                <span className="flex-1">{board ?? t("blog.allBoards")}</span>
                <span className="hidden w-24 text-right sm:block">{t("blog.colDate")}</span>
              </div>

              <ol className="m-0 list-none p-0">
                {shown.map((post, i) => (
                  <li key={post.slug} style={{ borderTop: i ? "1px solid color-mix(in srgb, var(--color-ink) 14%, transparent)" : undefined }}>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="flex items-start gap-3 px-3 py-3 no-underline sm:gap-4 transition-colors hover:bg-[color-mix(in_srgb,var(--color-poster)_16%,transparent)]"
                      style={{ color: "var(--color-ink)" }}
                    >
                      {/* 縮圖固定 1:1。用 aspect-ratio 而非寫死高度，
                          任何裝置上都不會被壓扁；沒有封面的文章用飯糰預設圖 */}
                      <span
                        className="w-[52px] shrink-0 overflow-hidden border sm:w-[60px]"
                        style={{
                          aspectRatio: "1 / 1",
                          borderColor: "color-mix(in srgb, var(--color-ink) 22%, transparent)",
                        }}
                      >
                        <ResponsiveImg
                          image={post.thumbImage}
                          alt=""
                          sizes="(min-width: 640px) 60px, 52px"
                          className="h-full w-full object-cover"
                        />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm leading-snug md:text-base" style={{ fontFamily: "var(--font-heading)" }}>
                          {i === 0 && !board && !q && current === 1 && (
                            <span
                              className="mr-2 inline-block px-1.5 py-0.5 align-[2px] text-[10px] tracking-[0.1em] text-white"
                              style={{ backgroundColor: "var(--color-nekoma)" }}
                            >
                              {t("blog.featured")}
                            </span>
                          )}
                          {post.title}
                        </span>
                        <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px]" style={{ color: "var(--color-muted)" }}>
                          <span>Haru Li</span>
                          <span>·</span>
                          <span>{t("blog.minutes", { n: post.minutes })}</span>
                          {/* 窄螢幕沒有空間放右側欄位，日期併進這一行 */}
                          <span className="sm:hidden">·</span>
                          <time dateTime={post.date} className="tabular-nums sm:hidden">
                            {post.date}
                          </time>
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-1.5 py-px"
                              style={{ backgroundColor: "color-mix(in srgb, var(--color-teal) 16%, transparent)", color: "var(--color-teal)" }}
                            >
                              {tag}
                            </span>
                          ))}
                        </span>
                      </span>

                      <time
                        dateTime={post.date}
                        className="mt-0.5 hidden w-24 shrink-0 text-right text-[11px] tabular-nums sm:block"
                        style={{ color: "var(--color-muted)" }}
                      >
                        {post.date}
                      </time>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>

            {filtered.length === 0 && (
              <p className="mt-4 text-xs" style={{ color: "var(--color-muted)" }}>
                {t("blog.empty", { q })}
              </p>
            )}

            {/* 分頁：只有真的超過一頁才顯示，否則是多餘的介面 */}
            {totalPages > 1 && (
              <nav aria-label={t("blog.pagination")} className="mt-4 flex flex-wrap items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    aria-current={n === current ? "page" : undefined}
                    className="interactive border-2 px-3 py-1 text-[11px] tabular-nums transition-colors"
                    style={{
                      fontFamily: "var(--font-heading)",
                      borderColor: "var(--color-ink)",
                      backgroundColor: n === current ? "var(--color-ink)" : "var(--color-surface)",
                      color: n === current ? "var(--color-bg)" : "var(--color-ink)",
                    }}
                  >
                    {n}
                  </button>
                ))}
              </nav>
            )}

            <p className="mt-3 text-[11px]" style={{ color: "var(--color-muted)" }}>
              {t("blog.listNote", { n: filtered.length })}
            </p>
          </div>

          {/* 側欄：看板列表 + 作者 */}
          <aside className="flex w-full flex-col gap-5 lg:sticky lg:top-20 lg:w-56 lg:shrink-0">
            <section className="border-2" style={{ borderColor: "var(--color-ink)", backgroundColor: "var(--color-surface)", boxShadow: "var(--shadow-manga-sm)" }}>
              <h2
                className="border-b-2 px-3 py-2 text-[11px] tracking-[0.14em]"
                style={{ borderColor: "var(--color-ink)", backgroundColor: "var(--color-panel)", color: "var(--color-on-panel)", fontFamily: "var(--font-heading)" }}
              >
                {t("blog.boards")}
              </h2>
              <nav aria-label={t("blog.boards")}>
              <ol className="m-0 list-none p-0">
                <li>
                  <Link
                    to="/blog"
                    aria-current={board === null ? "page" : undefined}
                    className="flex w-full items-center justify-between px-3 py-2 text-[12px] no-underline transition-colors"
                    style={{
                      color: "var(--color-ink)",
                      backgroundColor: board === null ? "color-mix(in srgb, var(--color-poster) 30%, transparent)" : "transparent",
                    }}
                  >
                    <span>{t("blog.allBoards")}</span>
                    <span className="tabular-nums" style={{ color: "var(--color-muted)" }}>{posts.length}</span>
                  </Link>
                </li>
                {allBoards().map(([name, n]) => (
                  <li key={name} style={{ borderTop: "1px solid color-mix(in srgb, var(--color-ink) 12%, transparent)" }}>
                    <Link
                      to={`/blog/board/${boardSlug(name)}`}
                      aria-current={board === name ? "page" : undefined}
                      className="flex w-full items-center justify-between px-3 py-2 text-[12px] no-underline transition-colors"
                      style={{
                        color: "var(--color-ink)",
                        backgroundColor: board === name ? "color-mix(in srgb, var(--color-poster) 30%, transparent)" : "transparent",
                      }}
                    >
                      <span>{name}</span>
                      <span className="tabular-nums" style={{ color: "var(--color-muted)" }}>{n}</span>
                    </Link>
                  </li>
                ))}
              </ol>
              </nav>
            </section>

            <AuthorCard />
          </aside>
        </div>
      </div>
    </BlogChrome>
  );
}
