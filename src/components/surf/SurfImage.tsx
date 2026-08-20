import manifest from "../../assets/images/surf/manifest.json";

// 用 glob 收 9 張圖 × 3 寬度 × 2 格式共 54 個 URL，避免逐一 import。
// eager + ?url：build 期就解析成最終資產路徑，SSR 與 client 拿到同一份，
// prerender 出來的 HTML 才不會與 hydration 對不上。
const avifUrls = import.meta.glob("../../assets/images/surf/*.avif", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const webpUrls = import.meta.glob("../../assets/images/surf/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const WIDTHS = [768, 1280, 1920] as const;

// "../../assets/images/surf/s0-hero-1280.avif" → key "s0-hero-1280"
const byKey = (urls: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(urls).map(([p, u]) => [p.split("/").pop()!.replace(/\.\w+$/, ""), u]),
  );
const AVIF = byKey(avifUrls);
const WEBP = byKey(webpUrls);

// 有些圖會多輸出一檔更大的尺寸（見 scripts/optimize-surf-images.mjs 的
// WIDE_EXTRA），這裡直接掃 map 裡實際存在的寬度，不寫死清單
const srcSet = (map: Record<string, string>, name: string) =>
  [...WIDTHS, 2400]
    .filter((w) => map[`${name}-${w}`])
    .map((w) => `${map[`${name}-${w}`]} ${w}w`)
    .join(", ");

type Props = {
  name: keyof typeof manifest;
  alt: string;
  /** 首屏圖：關掉 lazy 並提高解碼優先度，其餘維持 lazy */
  priority?: boolean;
  className?: string;
  /**
   * 圖片實際渲染寬度。預設 100vw 適用滿版底圖；橫向平移那種「比視口寬得多」
   * 的圖必須覆寫，否則瀏覽器會依 100vw 挑到過小的檔案再放大，畫質會糊。
   */
  sizes?: string;
};

export default function SurfImage({ name, alt, priority = false, className, sizes = "100vw" }: Props) {
  const dim = manifest[name];
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet(AVIF, name)} sizes={sizes} />
      <img
        src={WEBP[`${name}-1280`]}
        srcSet={srcSet(WEBP, name)}
        sizes={sizes}
        width={dim.w}
        height={dim.h}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        draggable={false}
      />
    </picture>
  );
}
