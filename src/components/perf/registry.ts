import type { ComponentType } from "react";
import MemoDemo from "./MemoDemo";
import LazyDemo from "./LazyDemo";
import SuspenseDemo from "./SuspenseDemo";
import VirtualDemo from "./VirtualDemo";
import WorkerDemo from "./WorkerDemo";
import LookupDemo from "./LookupDemo";
import MemoChildDemo from "./MemoChildDemo";
import RateLimitDemo from "./RateLimitDemo";
import LayoutCostDemo from "./LayoutCostDemo";
import ImageFormatDemo from "./ImageFormatDemo";

/**
 * 展示頁的 demo 清單。新增一個 demo 只要在這裡加一筆，
 * /lab 的版面、錨點導覽與編號都會自動跟上。
 *
 * - slug：錨點與網址片段，要穩定（別人可能存了連結）
 * - tag：畫面上顯示的技法名稱
 * - i18n：文案取 `perf.<i18n>.title` / `.desc` / `.hint`
 */
export type Demo = {
  slug: string;
  tag: string;
  i18n: string;
  Component: ComponentType;
};

export const DEMOS: Demo[] = [
  { slug: "use-memo", tag: "useMemo", i18n: "memo", Component: MemoDemo },
  { slug: "lazy-load", tag: "React.lazy", i18n: "lazy", Component: LazyDemo },
  { slug: "suspense", tag: "Suspense", i18n: "suspense", Component: SuspenseDemo },
  { slug: "virtual-scroll", tag: "虛擬捲動", i18n: "virtual", Component: VirtualDemo },
  { slug: "web-worker", tag: "Web Worker", i18n: "worker", Component: WorkerDemo },
  { slug: "lookup", tag: "Map vs find", i18n: "lookup", Component: LookupDemo },
  { slug: "react-memo", tag: "React.memo", i18n: "memoChild", Component: MemoChildDemo },
  { slug: "rate-limit", tag: "debounce / throttle", i18n: "rate", Component: RateLimitDemo },
  { slug: "layout-cost", tag: "強制同步版面", i18n: "layout", Component: LayoutCostDemo },
  { slug: "image-format", tag: "AVIF / srcset", i18n: "image", Component: ImageFormatDemo },
];
