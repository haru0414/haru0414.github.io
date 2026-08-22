import type { CSSProperties } from "react";
import type { ResponsiveImage } from "../data/posts";

type Props = {
  image: ResponsiveImage;
  alt: string;
  /** 這張圖在版面上實際佔多寬，瀏覽器靠它從 srcset 挑檔 */
  sizes: string;
  className?: string;
  style?: CSSProperties;
  /** 首屏可見的圖（例如文章封面）不該延後載入 */
  eager?: boolean;
};

/**
 * 有最佳化變體時輸出 <picture> + srcset，沒有就退回普通 <img>。
 *
 * 兩種情況都帶 width / height，載入前就佔好版位，避免圖片到位那一刻
 * 把下面的內容往下推。
 */
export default function ResponsiveImg({ image, alt, sizes, className, style, eager }: Props) {
  const img = (
    <img
      src={image.src}
      alt={alt}
      width={image.width ?? undefined}
      height={image.height ?? undefined}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={className}
      style={style}
    />
  );

  if (!image.avif && !image.webp) return img;

  return (
    // display:contents 讓 <picture> 不參與版面，img 的 class 才能照樣
    // 對外層的 flex / grid 生效
    <picture style={{ display: "contents" }}>
      {image.avif && <source type="image/avif" srcSet={image.avif} sizes={sizes} />}
      {image.webp && <source type="image/webp" srcSet={image.webp} sizes={sizes} />}
      {img}
    </picture>
  );
}
