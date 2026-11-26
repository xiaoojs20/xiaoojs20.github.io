/*
 * Erhai reflections: in-article diagram interactions.
 * Reads data-lang from each widget to pick a language. No global state.
 */
(() => {
  "use strict";

  const INFRA = {
    zh: {
      knowledge: ["认知与知识", "建立自己的知识系统，保持独立研究和判断的能力。它决定了我如何理解新问题，以及是否能够及时修正过去的观念。"],
      career: ["职业与技术", "积累能够跨组织、跨行业迁移的技能、经验和声誉。职业资本的价值不仅是眼前的薪水，也在于未来还能创造什么。"],
      finance: ["金融与资本", "理解风险、建立现金储备和长期投资体系，使劳动收入逐渐转化为能够支持未来生活的资本。"],
      health: ["身体与健康", "持续运动、合理饮食与休息。健康不只是一项生产条件，它本身也是生活质量的重要组成部分。"],
      network: ["关系与信任", "与不同背景的人建立真实、长期的关系。社会网络的价值既包括获得信息与机会，也包括互相支持和分享经验。"],
      mobility: ["语言与流动", "语言能力、跨地域工作和生活的经验，以及必要的证件和行政安排，都可能扩大未来的生活半径。"]
    },
    en: {
      knowledge: ["Knowledge", "Build your own system of knowledge and the ability to research and judge independently. It shapes how you understand new problems and whether you can revise old beliefs in time."],
      career: ["Career and skills", "Accumulate skills, experience, and a reputation that transfer across organizations and industries. The value of career capital lies not only in today's salary, but in what it can still create in the future."],
      finance: ["Finance and capital", "Understand risk, build a cash reserve and a long-term investment system, so that labour income gradually turns into capital capable of supporting future life."],
      health: ["Body and health", "Keep exercising, eat and rest well. Health is not only a condition for productivity; it is an important part of quality of life in itself."],
      network: ["Relationships and trust", "Build genuine, lasting relationships with people from different backgrounds. A social network offers not just information and opportunities, but mutual support and shared experience."],
      mobility: ["Language and mobility", "Language ability, experience of working and living across regions, and the necessary documents and administrative arrangements can all expand your future radius of life."]
    }
  };

  const BUFFER_UNITS = {
    zh: { locale: "zh-CN", currency: "元", months: "个月" },
    en: { locale: "en-US", currency: "CNY", months: "months" }
  };

  function initInfra(root) {
    root.querySelectorAll(".infra-grid").forEach((grid) => {
      if (grid.dataset.ready) return;
      grid.dataset.ready = "1";
      const lang = grid.closest("[data-lang]")?.dataset.lang === "en" ? "en" : "zh";
      const dict = INFRA[lang];
      const panel = grid.parentElement.querySelector(".infra-panel");
      grid.querySelectorAll(".infra").forEach((btn) => {
        btn.addEventListener("click", () => {
          grid.querySelectorAll(".infra").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
          const entry = dict[btn.dataset.key];
          if (!entry || !panel) return;
          const b = document.createElement("b");
          const p = document.createElement("p");
          b.textContent = entry[0];
          p.textContent = entry[1];
          panel.replaceChildren(b, p);
        });
      });
    });
  }

  function initBuffer(root) {
    root.querySelectorAll(".buffer-tool").forEach((tool) => {
      if (tool.dataset.ready) return;
      tool.dataset.ready = "1";
      const lang = tool.closest("[data-lang]")?.dataset.lang === "en" ? "en" : "zh";
      const units = BUFFER_UNITS[lang];
      const fmt = new Intl.NumberFormat(units.locale);
      const savings = tool.querySelector("[data-savings]");
      const cost = tool.querySelector("[data-cost]");
      if (!savings || !cost) return;
      function update() {
        const a = Number(savings.value);
        const b = Number(cost.value);
        const m = a / b;
        tool.querySelector("[data-savings-label]").textContent = fmt.format(a) + " " + units.currency;
        tool.querySelector("[data-cost-label]").textContent = fmt.format(b) + " " + units.currency;
        tool.querySelector(".buffer-months").textContent = m.toFixed(1) + " " + units.months;
        tool.querySelector(".bar-fill").style.width = Math.min(100, (m / 24) * 100) + "%";
      }
      savings.addEventListener("input", update);
      cost.addEventListener("input", update);
      update();
    });
  }

  function init() {
    document.querySelectorAll(".erhai-viz").forEach((root) => {
      initInfra(root);
      initBuffer(root);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
