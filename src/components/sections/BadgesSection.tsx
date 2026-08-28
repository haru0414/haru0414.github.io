import { useTranslation } from "react-i18next";
import Link from "../LocaleLink";
import CrayonDoodle from "../crayon/CrayonDoodle";
import ClaudeAcademyBadge from "../ui/ClaudeAcademyBadge";
import { badges, featuredBadges } from "../../data/badges";

/**
 * 首頁的徽章區塊。
 *
 * 這裡只放跟工程定位最相關的六張，其餘二十張全在 /certs——首頁一次攤開
 * 二十張會把捲動長度拉掉一大截，資訊密度反而降低。
 */
export default function BadgesSection() {
  const { t } = useTranslation();

  return (
    <section id="badges" className="py-20">
      <div className="container mx-auto flex flex-col items-center px-4">
        <div className="relative mb-6">
          <CrayonDoodle
            type="sparkle"
            color="var(--color-teal)"
            className="pointer-events-none absolute -left-9 -top-6 h-8 w-8"
            delay={300}
          />
          <h2
            className="border-2 px-6 py-3 text-3xl md:text-4xl"
            style={{
              fontFamily: "var(--font-heading)",
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-ink)",
              boxShadow: "var(--shadow-manga)",
            }}
          >
            BADGES
          </h2>
        </div>

        <p
          className="mb-12 max-w-xl text-center text-sm leading-relaxed"
          style={{ color: "var(--color-muted)" }}
        >
          {t("badges.intro", { n: badges.length })}
        </p>

        <div className="grid w-full max-w-4xl grid-cols-2 gap-6 sm:grid-cols-3">
          {featuredBadges.map((badge) => (
            <ClaudeAcademyBadge key={badge.slug} badge={badge} />
          ))}
        </div>

        <Link
          to="/certs"
          className="mt-12 border-2 px-6 py-3 text-sm tracking-[0.15em] transition-transform duration-300 hover:-translate-y-1"
          style={{
            fontFamily: "var(--font-heading)",
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-ink)",
            boxShadow: "var(--shadow-manga)",
          }}
        >
          {t("badges.viewAll", { n: badges.length })}
        </Link>
      </div>
    </section>
  );
}
