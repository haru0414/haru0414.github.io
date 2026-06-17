import catArt from "../../assets/images/onigiri/cat.svg";

// Onigiri 本體：用 onigiri/cat.svg 線稿（走路姿、面向左）。
// 位移／翻面／擺動由父層（ScrollCat）寫外層 transform；這裡只負責呼吸起伏。
interface CrayonCatProps {
  className?: string;
}

export default function CrayonCat({ className }: CrayonCatProps) {
  return (
    <div className={className}>
      <img
        src={catArt}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="cat-breathe block h-full w-full select-none"
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}
