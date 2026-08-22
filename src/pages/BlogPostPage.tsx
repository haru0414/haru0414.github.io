import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import BlogChrome from "../components/blog/BlogChrome";
import CrayonDoodle from "../components/crayon/CrayonDoodle";
import { AuthorCard, RecentPosts, TableOfContents } from "../components/blog/BlogSidebar";
import catCover from "../assets/images/onigiri/cover.webp";
import { boardSlug, getPost, posts } from "../data/posts";
import NotFoundPage from "./NotFoundPage";
import "./blog.css";

export default function BlogPostPage() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const post = slug ? getPost(slug) : undefined;
  const [activeHeading, setActiveHeading] = useState<string | null>(null);

  // 標示目錄中「目前讀到哪一段」。
  //
  // 先前用 IntersectionObserver 搭一條很窄的偵測帶，捲快一點的標題會直接
  // 穿過去不觸發事件，狀態就卡在最後一次觸發的值。改成每次捲動主動算
  // 「最後一個越過門檻的標題」，跳著捲也不會漏。
  useEffect(() => {
    if (!post || !post.headings.length) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const line = 140; // 視窗頂端往下這個距離當作「正在讀」的基準線
      let current = post.headings[0].id;
      for (const { id } of post.headings) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      // 捲到底時直接選最後一節：最後一個標題後面通常沒有足夠內容
      // 把它推過基準線，否則讀到結尾了目錄還停在倒數第二節
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80;
      if (atBottom) current = post.headings[post.headings.length - 1].id;
      setActiveHeading((prev) => (prev === current ? prev : current));
    };

    // rAF 節流：捲動事件的頻率遠高於畫面更新，直接處理是浪費
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [post]);

  // 找不到就交給 404 頁，不要顯示半空白的文章骨架
  if (!post) return <NotFoundPage />;

  const idx = posts.findIndex((p) => p.slug === post.slug);
  const prev = posts[idx + 1];
  const next = posts[idx - 1];

  return (
    <BlogChrome>
      <div className="container mx-auto max-w-5xl px-4 py-12 md:py-16">
        {/* 麵包屑：論壇的層級指示 */}
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
          <Link to="/blog" className="no-underline hover:underline" style={{ color: "var(--color-muted)" }}>
            {t("blog.allBoards")}
          </Link>
          {post.tags[0] && (
            <>
              <CrayonDoodle
            type="slash"
            color="var(--color-nekoma)"
            strokeWidth={9}
            className="h-3 w-2 shrink-0 opacity-70"
          />
              <Link
                to={`/blog/board/${boardSlug(post.tags[0])}`}
                className="no-underline hover:underline"
                style={{ color: "var(--color-muted)" }}
              >
                {post.tags[0]}
              </Link>
            </>
          )}
        </nav>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-10">
          <article
            className="min-w-0 flex-1 border-2"
            style={{ borderColor: "var(--color-ink)", backgroundColor: "var(--color-surface)", boxShadow: "var(--shadow-manga)" }}
          >
          {/* 主樓標頭：論壇的樓層標示與發表資訊 */}
          <div
            className="flex flex-wrap items-center justify-between gap-2 border-b-2 px-4 py-2 text-[11px]"
            style={{ borderColor: "var(--color-ink)", backgroundColor: "var(--color-panel)", color: "var(--color-on-panel)", fontFamily: "var(--font-heading)" }}
          >
            <span>{t("blog.floor")}</span>
            <span className="tabular-nums opacity-80">{post.date}</span>
          </div>

          <div className="flex flex-col sm:flex-row">
            {/* 作者欄：論壇最有辨識度的版面元素 */}
            <div
              className="flex shrink-0 items-center gap-3 border-b-2 p-4 sm:w-36 sm:flex-col sm:items-start sm:border-b-0 sm:border-r-2"
              style={{ borderColor: "color-mix(in srgb, var(--color-ink) 20%, transparent)" }}
            >
              <img
                src={catCover}
                alt={t("a11y.cat")}
                width={48}
                height={48}
                loading="lazy"
                decoding="async"
                className="h-12 w-12 shrink-0 border-2 object-cover"
                style={{ borderColor: "var(--color-ink)" }}
              />
              <div className="min-w-0">
                <p className="m-0 text-xs" style={{ fontFamily: "var(--font-heading)" }}>Haru Li</p>
                <p className="m-0 text-[10px]" style={{ color: "var(--color-muted)" }}>{t("about.role")}</p>
                <p className="m-0 mt-1 text-[10px] tabular-nums" style={{ color: "var(--color-muted)" }}>
                  {t("blog.postCount", { n: posts.length })}
                </p>
              </div>
            </div>

            <div className="min-w-0 flex-1 p-4 md:p-6">
          <header className="relative mb-6 border-b-2 pb-5" style={{ borderColor: "color-mix(in srgb, var(--color-ink) 25%, transparent)" }}>
            <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]" style={{ color: "var(--color-muted)" }}>
              <time dateTime={post.date} className="tabular-nums">
                {post.date}
              </time>
              <span>·</span>
              <span>{t("blog.minutes", { n: post.minutes })}</span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--color-teal) 18%, transparent)",
                    color: "var(--color-teal)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="m-0 text-2xl leading-snug md:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
              {post.title}
            </h1>
            <CrayonDoodle
              type="zigzag"
              color="var(--color-poster)"
              className="pointer-events-none absolute -right-2 -top-4 h-7 w-7"
              delay={400}
            />
          </header>

          {/* 內容來自自家 repo 的 markdown 檔，非使用者輸入 */}
          {post.cover && (
            <img
              src={post.cover}
              alt={post.coverAlt}
              width={1200}
              height={630}
              loading="eager"
              decoding="async"
              className="mb-6 w-full border-2 object-cover"
              style={{ borderColor: "var(--color-ink)", aspectRatio: "1200 / 630" }}
            />
          )}

          <div className="blog-prose" dangerouslySetInnerHTML={{ __html: post.html }} />
            </div>
          </div>
          </article>

          {/* 側邊欄：目錄、作者、其他文章 */}
          <aside className="flex w-full flex-col gap-5 lg:sticky lg:top-8 lg:w-64 lg:shrink-0">
            <TableOfContents post={post} active={activeHeading} />
            <AuthorCard />
            <RecentPosts exclude={post.slug} />
          </aside>
        </div>

        {(prev || next) && (
          <nav
            className="mt-14 grid gap-3 border-t-2 pt-6 sm:grid-cols-2"
            style={{ borderColor: "var(--color-ink)" }}
            aria-label={t("blog.pager")}
          >
            {[
              { post: prev, label: t("blog.prev") },
              { post: next, label: t("blog.next") },
            ].map(({ post: p, label }, i) =>
              p ? (
                <Link
                  key={p.slug}
                  to={`/blog/${p.slug}`}
                  className="flex flex-col gap-1 border-2 p-3 no-underline transition-transform hover:-translate-y-0.5"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    borderColor: "var(--color-ink)",
                    color: "var(--color-ink)",
                    boxShadow: "var(--shadow-manga-sm)",
                    textAlign: i === 1 ? "right" : "left",
                  }}
                >
                  <span className="text-[10px] tracking-[0.14em]" style={{ fontFamily: "var(--font-heading)", color: "var(--color-muted)" }}>
                    {label}
                  </span>
                  <span className="text-sm leading-snug">{p.title}</span>
                </Link>
              ) : (
                <span key={i} />
              ),
            )}
          </nav>
        )}
      </div>
    </BlogChrome>
  );
}
