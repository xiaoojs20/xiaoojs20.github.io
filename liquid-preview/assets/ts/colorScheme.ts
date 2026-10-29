type ColorMode = "auto" | "light" | "dark";

class StackColorScheme {
    private readonly storageKey = "StackColorScheme";
    private readonly media = window.matchMedia("(prefers-color-scheme: dark)");
    private mode: ColorMode;

    constructor(private toggleEl: HTMLElement | null) {
        this.mode = this.getSavedMode();
        this.apply();
        this.media.addEventListener("change", () => { if (this.mode === "auto") this.apply(); });
        this.toggleEl?.addEventListener("click", () => this.cycle());
        this.toggleEl?.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") { event.preventDefault(); this.cycle(); }
        });
        if (document.body.style.transition === "") document.body.style.setProperty("transition", "background-color .3s ease");
    }

    private getSavedMode(): ColorMode {
        try {
            const value = localStorage.getItem(this.storageKey);
            return value === "light" || value === "dark" || value === "auto" ? value : "auto";
        } catch { return "auto"; }
    }

    private cycle() {
        this.mode = this.mode === "auto" ? "light" : this.mode === "light" ? "dark" : "auto";
        try { localStorage.setItem(this.storageKey, this.mode); } catch { /* keep current page functional */ }
        this.apply();
    }

    private apply() {
        const dark = this.mode === "dark" || (this.mode === "auto" && this.media.matches);
        document.documentElement.dataset.scheme = dark ? "dark" : "light";
        document.documentElement.dataset.themeMode = this.mode;
        const zh = document.documentElement.lang.toLowerCase().startsWith("zh");
        const labels = zh ? { auto: "跟随系统", light: "浅色模式", dark: "深色模式" } : { auto: "System", light: "Light", dark: "Dark" };
        const label = labels[this.mode];
        const action = zh ? `主题：${label}，点击切换` : `Theme: ${label}, activate to change`;
        document.querySelectorAll<HTMLElement>("[data-theme-mode-label]").forEach((element) => { element.textContent = label; });
        this.toggleEl?.setAttribute("aria-label", action);
        this.toggleEl?.setAttribute("title", action);
        const mobile = document.querySelector<HTMLElement>("[data-mobile-scheme-toggle]");
        mobile?.setAttribute("aria-label", action);
        mobile?.setAttribute("title", action);
        window.dispatchEvent(new CustomEvent("onColorSchemeChange", { detail: dark ? "dark" : "light" }));
    }
}

export default StackColorScheme;
