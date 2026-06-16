import { useState } from "react";
import catCover from "../assets/images/onigiri/cover.webp";
import sticker1 from "../assets/images/onigiri/stickers/1.webp";

export default function FloatingCat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-2">
      {/* Cat panel */}
      <div
        className={`transition-all duration-300 origin-bottom-right ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-90 opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div
          className="border-2 overflow-hidden w-44"
          style={{
            backgroundColor: "var(--color-paper)",
            borderColor: "var(--color-ink)",
            boxShadow: "4px 4px 0 0 var(--color-ink)",
          }}
        >
          <img
            src={catCover}
            alt="飯糰"
            width={1658}
            height={1414}
            className="w-full object-cover block"
          />
          <div
            className="px-3 py-2 border-t-2 text-center"
            style={{ borderColor: "var(--color-ink)" }}
          >
            <p
              className="text-xs"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              ONIGIRI
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5">常駐監工 🐾</p>
          </div>
        </div>
      </div>

      {/* Sticker button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-16 transition-all duration-200 hover:-translate-y-1 ${isOpen ? "opacity-60" : "opacity-100"}`}
        aria-label="飯糰"
        style={{ filter: "drop-shadow(2px 4px 0px rgba(0,0,0,0.4))" }}
      >
        <img
          src={sticker1}
          alt="飯糰貼紙"
          width={960}
          height={870}
          className="w-full h-auto"
        />
      </button>
    </div>
  );
}
