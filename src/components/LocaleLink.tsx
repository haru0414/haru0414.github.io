import { forwardRef } from "react";
import { Link, useLocation, type LinkProps } from "react-router-dom";
import { langFromPath, localizePath } from "../i18n";

/**
 * 會留在目前語言的站內連結。
 *
 * 語言是網址前綴（英文在 /en 底下），所以從 /en/work 點「BLOG」時，
 * 目標必須是 /en/blog/ 而不是 /blog/——否則使用者會在點一個連結之後
 * 莫名其妙跳回中文版。各處照常寫語言中立的路徑（/blog/），
 * 前綴在這裡補。
 *
 * 外部連結、mailto、錨點與明確寫了 /en 的路徑一律原樣放行。
 */
const LocaleLink = forwardRef<HTMLAnchorElement, LinkProps>(function LocaleLink(
  { to, ...rest },
  ref,
) {
  const { pathname } = useLocation();

  let target = to;
  if (typeof to === "string" && to.startsWith("/")) {
    const [path, suffix = ""] = splitSuffix(to);
    target = localizePath(path, langFromPath(pathname)) + suffix;
  }

  return <Link ref={ref} to={target} {...rest} />;
});

/** 把 /blog/#top 這種路徑拆成 ["/blog/", "#top"]，前綴只加在路徑上 */
function splitSuffix(to: string): [string, string] {
  const i = to.search(/[#?]/);
  return i === -1 ? [to, ""] : [to.slice(0, i), to.slice(i)];
}

export default LocaleLink;
