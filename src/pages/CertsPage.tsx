import { useTranslation } from "react-i18next";
import CrayonDoodle from "../components/crayon/CrayonDoodle";
import ClaudeAcademyBadge from "../components/ui/ClaudeAcademyBadge";
import { badges, badgesIn, countBy, issuerGroups } from "../data/badges";

/**
 * 徽章總覽。首頁只放精選六張，這裡是全部。
 *
 * 外層依發證單位分區、內層是該單位自己的主題分類。目前只有 Claude Academy
 * 一家，但版面已經按這個層級長好——之後加第二家不必重排。
 */
export default function CertsPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="container mx-auto max-w-6xl px-4 py-16 md:py-20">
        <header className="mb-14 flex flex-col items-start gap-4">
          <div className="relative">
            <CrayonDoodle
              type="sparkle"
              color="var(--color-teal)"
              className="pointer-events-none absolute -left-9 -top-6 h-8 w-8"
              delay={300}
            />
            <h1
              className="border-2 px-6 py-3 text-3xl md:text-5xl"
              style={{
                fontFamily: "var(--font-heading)",
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-ink)",
                boxShadow: "var(--shadow-manga)",
              }}
            >
              BADGES
            </h1>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
            {t("certs.intro", { n: badges.length })}
          </p>
        </header>

        {issuerGroups.map(({ issuer, groups }) => (
          <section key={issuer} className="mb-20">
            <div
              className="mb-10 flex items-baseline gap-3 border-b-2 pb-3"
              style={{ borderColor: "var(--color-ink)" }}
            >
              <h2 className="text-xl md:text-2xl" style={{ fontFamily: "var(--font-heading)" }}>
                {t(`certs.issuer.${issuer}`)}
              </h2>
              <span className="text-xs" style={{ color: "var(--color-muted)" }}>
                {t("certs.count", { n: countBy(issuer) })}
              </span>
            </div>

            {groups.map((group) => (
              <div key={group} className="mb-14">
                <h3
                  className="mb-8 text-sm tracking-[0.2em]"
                  style={{ fontFamily: "var(--font-heading)", color: "var(--color-muted)" }}
                >
                  {t(`certs.group.${group}`)}
                </h3>
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                  {badgesIn(issuer, group).map((badge) => (
                    <ClaudeAcademyBadge key={badge.slug} badge={badge} />
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}
