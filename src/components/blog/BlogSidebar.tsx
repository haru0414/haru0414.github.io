import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import Link from "../LocaleLink";
import catCover from "../../assets/images/onigiri/cover.webp";
import { X } from "lucide-react";
import { posts, type Post } from "../../data/posts";

const panel = {
  backgroundColor: "var(--color-surface)",
  borderColor: "var(--color-ink)",
  boxShadow: "var(--shadow-manga-sm)",
} as const;

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-2 p-4" style={panel}>
      <h2
        className="mb-3 text-xs tracking-[0.16em]"
        style={{ fontFamily: "var(--font-heading)", color: "var(--color-nekoma)" }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

/** 作者卡：沿用首頁的飯糰視覺，讓部落格看起來屬於同一個站 */
export function AuthorCard() {
  const { t } = useTranslation();
  return (
    <section className="border-2 p-4" style={panel}>
      <div className="flex items-center gap-3">
        <img
          src={catCover}
          alt={t("a11y.cat")}
          width={56}
          height={56}
          loading="lazy"
          decoding="async"
          className="h-14 w-14 shrink-0 border-2 object-cover"
          style={{ borderColor: "var(--color-ink)" }}
        />
        <div className="min-w-0">
          <p className="m-0 text-sm" style={{ fontFamily: "var(--font-heading)" }}>
            Haru Li
          </p>
          <p className="m-0 text-[11px]" style={{ color: "var(--color-muted)" }}>
            {t("about.role")}
          </p>
        </div>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed" style={{ color: "var(--color-muted)" }}>
        {t("blog.authorBio")}
      </p>
      <Link
        to="/"
        className="mt-3 inline-block text-[11px] tracking-[0.12em] underline underline-offset-4"
        style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
      >
        {t("blog.viewPortfolio")} →
      </Link>
    </section>
  );
}

export function TagCloud({
  active,
  onPick,
}: {
  active: string | null;
  onPick: (tag: string | null) => void;
}) {
  const { t } = useTranslation();
  // 依出現次數排序，常用標籤在前
  const counts = new Map<string, number>();
  posts.forEach((p) => p.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1)));
  const tags = [...counts.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <Block title={t("blog.tags")}>
      <div className="flex flex-wrap gap-1.5">
        {active && (
          <button
            type="button"
            onClick={() => onPick(null)}
            className="interactive px-2 py-1 text-[11px]"
            style={{ backgroundColor: "var(--color-ink)", color: "var(--color-bg)" }}
          >
            {t("blog.clearFilter")}
            <X size={11} className="ml-1 inline-block align-[-1px]" aria-hidden="true" />
          </button>
        )}
        {tags.map(([tag, n]) => (
          <button
            key={tag}
            type="button"
            onClick={() => onPick(active === tag ? null : tag)}
            aria-pressed={active === tag}
            className="interactive px-2 py-1 text-[11px] transition-colors"
            style={{
              backgroundColor:
                active === tag ? "var(--color-teal)" : "color-mix(in srgb, var(--color-teal) 14%, transparent)",
              color: active === tag ? "#fff" : "var(--color-teal)",
            }}
          >
            {tag}
            <span className="ml-1 tabular-nums opacity-60">{n}</span>
          </button>
        ))}
      </div>
    </Block>
  );
}

export function RecentPosts({ exclude }: { exclude?: string }) {
  const { t } = useTranslation();
  const list = posts.filter((p) => p.slug !== exclude).slice(0, 5);
  if (!list.length) return null;

  return (
    <Block title={t("blog.recent")}>
      <ol className="m-0 flex list-none flex-col gap-2.5 p-0">
        {list.map((p) => (
          <li key={p.slug}>
            <Link
              to={`/blog/${p.slug}/`}
              className="block text-[12px] leading-snug no-underline hover:underline"
              style={{ color: "var(--color-ink)" }}
            >
              {p.title}
            </Link>
            <time dateTime={p.date} className="text-[10px] tabular-nums" style={{ color: "var(--color-muted)" }}>
              {p.date}
            </time>
          </li>
        ))}
      </ol>
    </Block>
  );
}

/** 文章目錄。捲動時標示目前所在段落 */
export function TableOfContents({ post, active }: { post: Post; active: string | null }) {
  const { t } = useTranslation();
  if (!post.headings.length) return null;

  return (
    <Block title={t("blog.toc")}>
      <ol className="m-0 flex list-none flex-col gap-1 p-0">
        {post.headings.map((h, i) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className="flex gap-2 py-1 text-[11px] leading-snug no-underline transition-colors"
              style={{ color: active === h.id ? "var(--color-nekoma)" : "var(--color-muted)" }}
              aria-current={active === h.id ? "true" : undefined}
            >
              <span className="tabular-nums opacity-60">{String(i + 1).padStart(2, "0")}</span>
              <span>{h.text}</span>
            </a>
          </li>
        ))}
      </ol>
    </Block>
  );
}
