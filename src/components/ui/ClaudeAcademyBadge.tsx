import { type Badge, ISSUED_AT, verifyUrl } from "../../data/badges";

/**
 * Claude Academy 完成徽章，比照官方版面重畫。
 *
 * 這支只畫 Claude Academy 的美術樣式（封蠟外框＋三色）。之後接別家發證單位，
 * 各自的徽章長相不同，是另外寫一支元件、依 badge.issuer 選用，而不是在這裡加分支。
 *
 * 封蠟外框那條 path 二十張徽章完全相同，所以只寫一次；差異只有配色、
 * 中央的課程圖示與課名。圖示走 <img> 讀 public/badges/*.svg——不進 JS bundle，
 * 捲到才載入，一張徽章的 path 資料動輒 10–70KB，全部內嵌會拖垮首屏。
 *
 * 內部尺寸用 cqw（容器寬度百分比）而不是 px：整張徽章縮放時，圖示、
 * 課名與日期會一起等比縮放，不必為每個斷點各寫一組字級。
 */

// 官方封蠟外框。viewBox 0 0 947.805 952.224，原圖是旋轉 180 度後的形狀。
const SEAL_PATH =
  "M368.744 0.056734C409.51 0.675675 447.963 4.05603 488.53 7.42688C531.94 11.0358 575.407 13.0831 618.827 17.2443C636.409 18.9297 653.973 21.5007 671.612 22.8243C705.288 52.6286 743.39 79.843 775.872 110.79C786.564 120.979 796.146 132.71 807.084 142.708C813.406 148.488 828.6 158.648 832.922 164.162C836.666 168.951 842.931 186.948 846.409 193.947C854.817 210.849 864.873 226.932 873.451 243.624C896.739 288.902 918.453 335.151 939.703 381.467C941.125 384.562 947.153 397.102 947.485 399.331C948.348 405.044 947.229 422.984 946.926 429.725C944.926 473.965 944.604 518.062 942.168 562.35C941.817 568.749 943.125 578.757 942.054 584.318C941.03 589.64 929.732 608.466 926.671 615.226C916.539 637.565 906.065 659.619 895.857 681.91C882.417 711.248 871.403 741.747 855.053 769.676C843.859 778.674 830.723 784.854 819.027 792.996C767.493 828.856 721.135 873.134 669.422 908.871C653.641 919.783 634.153 929.372 617.737 940.113C614.723 942.084 603.16 951.987 600.866 952.206C598.847 952.397 594.667 951.006 592.43 951.025C548.774 951.359 511.799 941.903 469.317 936.971C431.603 932.591 393.453 930.077 355.919 923.992C333.949 920.44 311.855 914.041 289.705 911.27C272.663 909.137 255.194 910.128 238.276 906.148C189.245 862.669 144.109 814.944 101.552 764.839C99.0687 761.915 97.2678 757.792 94.6328 754.726C84.2731 742.681 70.0841 732.387 59.7813 720.389C52.6821 712.124 46.4644 668.436 43.7157 655.191C28.5031 581.908 16.9492 507.264 4.18198 433.591C1.36694 417.365 -3.19219 413.499 3.36675 397.017C19.0059 357.728 33.1189 317.507 48.3694 277.951C59.2694 249.69 70.1032 221.39 81.4107 193.3C138.081 142.451 201.604 99.63 266.246 60.0368L352.536 0.0281397C357.929 0.0852726 363.36 -0.0575598 368.753 0.0281397L368.744 0.056734Z";

// 官方三色：封蠟底色。墨色 #141413 是三種配色共用的字色。
const SEAL_FILL = {
  orange: "#ebc9b7",
  purple: "#cbcadb",
  green: "#bcd1ca",
} as const;

const INK = "#141413";

// 只印年份。完整日期（20 張都是同一天）留在官方驗證頁上，點進去就看得到；
// 徽章面上寫到「日」會把注意力引到「同一天拿了 20 張」，資訊價值卻沒有增加。
const ISSUED_YEAR = ISSUED_AT.slice(0, 4);

export default function ClaudeAcademyBadge({ badge }: { badge: Badge }) {
  const seal = SEAL_FILL[badge.tone];

  return (
    <a
      href={verifyUrl(badge)}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full rounded-2xl outline-none transition-transform duration-300 ease-out hover:scale-[1.03] focus-visible:ring-2 motion-reduce:transition-none"
      // 徽章本身沒有可讀文字節點以外的資訊，連結文字就把用途講完整
      aria-label={`${badge.title} — Claude Academy 完成徽章，開新分頁前往官方驗證頁`}
    >
      <div
        className="relative w-full text-center"
        style={{
          aspectRatio: "947.805 / 952.224",
          containerType: "inline-size",
          color: INK,
          ["--badge-fit" as string]: badge.fit,
        }}
        data-badge={badge.slug}
      >
        {/* 封蠟外框 */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 size-full"
          viewBox="0 0 947.805 952.224"
        >
          <path
            d={SEAL_PATH}
            fill={seal}
            transform="rotate(180 473.9025 476.112)"
          />
        </svg>

        {/* 課程圖示 */}
        <img
          src={`/badges/${badge.slug}.svg`}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          width={96}
          height={96}
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: "18.4%", width: "21.6%", aspectRatio: "1 / 1" }}
        />

        {/* 課名 */}
        <span
          className="absolute flex items-center justify-center"
          style={{ left: "8.3%", right: "8.3%", top: "40%", height: "29%" }}
        >
          <span
            className="w-full text-balance font-medium"
            data-badge-title=""
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "calc(11.6cqw * var(--badge-fit))",
              lineHeight: 1.04,
              letterSpacing: "0.02em",
            }}
          >
            {badge.title}
          </span>
        </span>

        {/* 核發日 */}
        <span
          className="absolute inset-x-0 whitespace-nowrap font-semibold uppercase"
          style={{
            top: "73%",
            fontSize: "max(4.2cqw, 10px)",
            letterSpacing: "0.08em",
            color: `color-mix(in srgb, ${INK} 62%, ${seal})`,
          }}
        >
          Issued {ISSUED_YEAR}
        </span>
      </div>
    </a>
  );
}
