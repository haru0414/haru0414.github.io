// 手繪風寵物飼料碗：海報塗鴉風。扁身、厚碗緣、底座圈、碗身印一枚肉球，
// 一眼看出是寵物碗。線稿色用 var(--color-ink) 隨主題切換，碗緣用陶瓷奶白，
// 碗身用 poster 黃，碗內裝飼料。當作 FloatingCat 觸發鈕外觀，
// 並讓 ScrollCat 捲到底時走過來「吃飼料」。
interface PetBowlProps {
  className?: string;
}

export default function PetBowl({ className }: PetBowlProps) {
  return (
    <svg
      viewBox="0 0 140 90"
      className={className}
      fill="none"
      stroke="var(--color-ink)"
      strokeWidth={3.5}
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {/* 底座圈 */}
      <ellipse cx="70" cy="78" rx="27" ry="6" fill="var(--color-poster)" />
      {/* 碗身 */}
      <path
        d="M16,38 C18,58 30,72 50,75 C63,76 77,76 90,75 C110,72 122,58 124,38 Z"
        fill="var(--color-poster)"
      />
      {/* 碗身肉球腳印 */}
      <g fill="#8A5A2B" stroke="none">
        <ellipse cx="70" cy="61" rx="8" ry="6" />
        <circle cx="60" cy="54" r="3" />
        <circle cx="70" cy="51" r="3.2" />
        <circle cx="80" cy="54" r="3" />
      </g>
      {/* 厚碗緣 */}
      <ellipse cx="70" cy="38" rx="54" ry="12" fill="#FCEFD2" />
      {/* 碗內側 */}
      <ellipse cx="70" cy="37" rx="43" ry="8" fill="#5A3A20" />
      {/* 飼料堆 */}
      <path
        d="M30,38 C36,26 50,27 60,32 C66,24 80,25 85,33 C96,27 105,31 108,38 C88,46 50,46 30,38 Z"
        fill="#A9651F"
      />
      {/* 飼料顆粒 */}
      <g fill="#7C461A" stroke="none">
        <circle cx="48" cy="35" r="3" />
        <circle cx="66" cy="32" r="3.2" />
        <circle cx="84" cy="35" r="3" />
      </g>
    </svg>
  );
}
