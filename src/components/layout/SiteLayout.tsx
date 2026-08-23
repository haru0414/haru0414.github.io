import { Outlet } from "react-router-dom";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import CustomCursor from "../CustomCursor";
import FloatingCat from "../FloatingCat";

/**
 * 站台外框：頁首、頁尾與漫畫風掛件。
 *
 * 用 layout route 而不是在元件裡判斷「現在是不是某一頁」——/surf 是全螢幕
 * 的沉浸式頁面，它排在這個 route 之外就自然不會拿到這些東西。先前那版是
 * 比對 pathname 來決定要不要渲染，而 GitHub Pages 會替子路由加上尾斜線，
 * 比對漏掉就讓掛件跑到 /surf 上。
 */
export default function SiteLayout() {
  return (
    <>
      <CustomCursor />
      <FloatingCat />
      <SiteHeader />
      <Outlet />
      <SiteFooter />
    </>
  );
}
