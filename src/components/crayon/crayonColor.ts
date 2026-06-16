// 蠟筆筆跡的共用顏色狀態：紀錄「下一筆會用的顏色」，
// 讓筆跡與蠟筆游標保持一致並一筆一色循環（紅 → 藍 → 黃）。

export const CRAYON_COLORS = ["#C83E34", "#2F5C68", "#FFC845"];

let index = 0; // 下一筆使用 CRAYON_COLORS[index]

// 下一筆會用到的顏色
export function getNextCrayonColor() {
  return CRAYON_COLORS[index % CRAYON_COLORS.length];
}

// 下完一筆後推進到下一個顏色
export function advanceCrayonColor() {
  index = (index + 1) % CRAYON_COLORS.length;
}
