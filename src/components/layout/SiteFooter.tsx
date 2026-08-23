import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { posts } from "../../data/posts";

const SOCIAL = [
  { name: "GitHub", url: "https://github.com/haru0414" },
  { name: "LinkedIn", url: "https://linkedin.com/in/liiiharu/" },
];

// 在模組層算一次。render 期間呼叫 new Date() 會被 react-hooks/purity 擋下，
// 而年份在一次瀏覽中也不會變
const YEAR = new Date().getFullYear();

/**
 * 全站頁尾。首頁的 ContactSection 是「聯絡」這個內容區塊，
 * 這裡是站台的出口——每一頁都要有地方可去。
 */
export default function SiteFooter() {
  const { t } = useTranslation();
  const latest = posts.slice(0, 3);

  const heading = {
    fontFamily: "var(--font-heading)",
    color: "var(--color-poster)",
  };
  const linkClass =
    "no-underline underline-offset-4 transition-colors hover:text-(--color-nekoma) hover:underline";

  return (
    <footer
      className="border-t-4 py-12"
      style={{
        backgroundColor: "var(--color-panel)",
        borderColor: "var(--color-ink)",
        color: "var(--color-on-panel)",
      }}
    >
      <div className="container mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <span className="text-2xl tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
            HARU LI
          </span>
          <p className="m-0 max-w-[28ch] text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
            {t("about.role")}
          </p>
        </div>

        <nav aria-labelledby="footer-explore" className="flex flex-col gap-2 text-sm">
          <span id="footer-explore" className="mb-1 text-xs tracking-[0.14em]" style={heading}>
            {t("footer.explore")}
          </span>
          <Link to="/work" className={linkClass} style={{ color: "inherit" }}>
            {t("siteNav.work")}
          </Link>
          <Link to="/lab" className={linkClass} style={{ color: "inherit" }}>
            {t("siteNav.lab")}
          </Link>
          <Link to="/blog" className={linkClass} style={{ color: "inherit" }}>
            {t("siteNav.blog")}
          </Link>
          <Link to="/surf" className={linkClass} style={{ color: "inherit" }}>
            {t("footer.surf")}
          </Link>
        </nav>

        <nav aria-labelledby="footer-latest" className="flex flex-col gap-2 text-sm">
          <span id="footer-latest" className="mb-1 text-xs tracking-[0.14em]" style={heading}>
            {t("footer.latest")}
          </span>
          {latest.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className={linkClass}
              style={{ color: "inherit" }}
            >
              <span className="line-clamp-2">{post.title}</span>
              <span className="block text-xs tabular-nums" style={{ color: "var(--color-muted)" }}>
                {post.date}
              </span>
            </Link>
          ))}
        </nav>

        <nav aria-labelledby="footer-contact" className="flex flex-col gap-2 text-sm">
          <span id="footer-contact" className="mb-1 text-xs tracking-[0.14em]" style={heading}>
            {t("footer.contact")}
          </span>
          <a href="mailto:skb900414@gmail.com" className={linkClass} style={{ color: "inherit" }}>
            {t("footer.email")}
          </a>
          {SOCIAL.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className={linkClass}
              style={{ color: "inherit" }}
            >
              {s.name}
            </a>
          ))}
          <a href="/files/resume.pdf" className={linkClass} style={{ color: "inherit" }}>
            {t("footer.resume")}
          </a>
        </nav>
      </div>

      <div
        className="container mx-auto mt-10 flex max-w-6xl flex-col gap-2 border-t px-4 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between"
        style={{ borderColor: "color-mix(in srgb, var(--color-on-panel) 20%, transparent)" }}
      >
        <span style={{ color: "var(--color-muted)" }}>
          {t("footer.rights", { year: YEAR })}
        </span>
        <span style={{ color: "var(--color-muted)" }}>{t("footer.built")}</span>
      </div>
    </footer>
  );
}
