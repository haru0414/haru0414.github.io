// 在 Worker 執行緒跑的重運算。與主執行緒版本用的是同一段程式碼，
// 差別只在「跑在哪條執行緒上」。
function countPrimes(n: number) {
  let count = 0;
  for (let i = 2; i <= n; i++) {
    let prime = true;
    for (let d = 2; d * d <= i; d++) {
      if (i % d === 0) {
        prime = false;
        break;
      }
    }
    if (prime) count++;
  }
  return count;
}

self.onmessage = (e: MessageEvent<number>) => {
  const t0 = performance.now();
  const result = countPrimes(e.data);
  self.postMessage({ result, ms: performance.now() - t0 });
};
