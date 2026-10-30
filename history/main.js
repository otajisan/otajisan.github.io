// 「自分と技術の歩み」 — テーマの切り替え・スクロールでのフェードイン・ヒートマップのツールチップ
(() => {
  const root = document.documentElement;

  // テーマ: 明示的に選んだものを優先し、なければ OS の設定に従う
  const toggle = document.querySelector(".theme-toggle");
  const current = () => root.dataset.theme || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  const label = () => toggle.setAttribute("aria-label", current() === "dark" ? "ライトモードに切り替える" : "ダークモードに切り替える");
  toggle.addEventListener("click", () => {
    const next = current() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("history-theme", next);
    label();
  });
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

  // ヒートマップのツールチップ（マウスとキーボードの両方）
  const figure = document.querySelector(".heat-figure");
  const tip = figure && figure.querySelector(".tooltip");
  if (!tip) return;
  const show = (cell) => {
    const box = cell.getBoundingClientRect();
    const base = figure.getBoundingClientRect();
    tip.textContent = cell.dataset.tip;
    tip.style.left = `${box.left - base.left + box.width / 2}px`;
    tip.style.top = `${box.top - base.top}px`;
    tip.hidden = false;
  };
  const hide = () => { tip.hidden = true; };
  figure.querySelectorAll(".heat__cell").forEach((cell) => {
    cell.addEventListener("mouseenter", () => show(cell));
    cell.addEventListener("focus", () => show(cell));
    cell.addEventListener("mouseleave", hide);
    cell.addEventListener("blur", hide);
  });
})();
