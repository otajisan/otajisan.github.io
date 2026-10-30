// 「自分と技術の歩み」 — テーマの切り替え・スクロールでのフェードイン・チャートのツールチップ
(() => {
  // index.html の <head> にある予備の処理に、このファイルが読み込めたことを伝える
  window.__historyReady = true;
  const root = document.documentElement;

  // テーマ: 明示的に選んだものを優先し、なければ OS の設定に従う
  const toggle = document.querySelector(".theme-toggle");
  const prefersLight = matchMedia("(prefers-color-scheme: light)");
  const current = () => root.dataset.theme || (prefersLight.matches ? "light" : "dark");
  const label = () => toggle.setAttribute("aria-label", current() === "dark" ? "ライトモードに切り替える" : "ダークモードに切り替える");
  toggle.addEventListener("click", () => {
    const next = current() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    label();
    try {
      localStorage.setItem("history-theme", next);
    } catch {
      // 保存できない環境（プライベートブラウズなど）では、このページを開いている間だけ切り替える
    }
  });
  prefersLight.addEventListener("change", label);
  label();

  // スクロールに合わせたフェードイン
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      }
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
    items.forEach((el) => io.observe(el));
  }

  // ヒートマップと言語チャートのツールチップ（マウス用。キーボードや読み上げでは「表で見る」を使う）
  const EDGE = 8;
  const tips = [];
  document.querySelectorAll(".heat-figure").forEach((figure) => {
    const tip = figure.querySelector(".tooltip");
    if (!tip) return;
    tips.push(tip);
    const show = (cell) => {
      tip.textContent = cell.dataset.tip;
      tip.hidden = false;
      const box = cell.getBoundingClientRect();
      const base = figure.getBoundingClientRect();
      // 枠の外にはみ出さないよう、ツールチップの中心を枠の内側に収める
      const half = tip.offsetWidth / 2;
      const center = box.left - base.left + box.width / 2;
      const left = Math.min(Math.max(center, half + EDGE), base.width - half - EDGE);
      tip.style.left = `${left}px`;
      tip.style.top = `${box.top - base.top}px`;
    };
    const hide = () => { tip.hidden = true; };
    figure.querySelectorAll("[data-tip]").forEach((cell) => {
      cell.addEventListener("mouseenter", () => show(cell));
      cell.addEventListener("mouseleave", hide);
    });
    // スクロールすると位置がずれるので、いったん隠す
    figure.querySelector(".heat-scroll").addEventListener("scroll", hide, { passive: true });
  });
  window.addEventListener("scroll", () => tips.forEach((tip) => { tip.hidden = true; }), { passive: true });
})();
