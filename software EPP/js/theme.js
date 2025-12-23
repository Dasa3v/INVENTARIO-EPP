function toggleTheme() {
    document.body.classList.toggle("theme-dark");

    const isDark = document.body.classList.contains("theme-dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
}

window.onload = () => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
        document.body.classList.add("theme-dark");
    }
};
