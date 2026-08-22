import { useEffect } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import catCover from "../assets/images/onigiri/cover.webp";

// 飯糰角色介紹彈窗（原章節彩蛋，改由點擊捲動陪跑貓觸發）。
// 點遮罩、按 ✕ 或 Esc 皆可關閉。
interface OnigiriEggProps {
  onClose: () => void;
}

export default function OnigiriEgg({ onClose }: OnigiriEggProps) {
  const { t } = useTranslation();

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t("egg.unlocked")}
    >
      <div
        className="relative border-4 overflow-hidden max-w-xs w-full"
        style={{
          backgroundColor: "var(--color-paper)",
          borderColor: "var(--color-ink)",
          boxShadow: "8px 8px 0 0 var(--color-nekoma)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-4 py-2 border-b-4 flex items-center justify-between"
          style={{
            backgroundColor: "var(--color-panel)",
            borderColor: "var(--color-ink)",
          }}
        >
          <span
            className="text-sm text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {t("egg.unlocked")}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white text-xs"
            style={{ fontFamily: "var(--font-heading)" }}
            aria-label={t("egg.close")}
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>
        <img
          src={catCover}
          alt={t("a11y.cat")}
          width={1658}
          height={1414}
          className="w-full object-cover block"
        />
        <div className="px-5 py-4 text-center">
          <p className="text-xl mb-1" style={{ fontFamily: "var(--font-heading)" }}>
            ✦ ONIGIRI ✦
          </p>
          <p className="text-sm text-gray-500">{t("egg.desc")}</p>
        </div>
      </div>
    </div>
  );
}
