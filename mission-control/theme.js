let root = document.documentElement;
var lastTheme = window.localStorage.getItem("theme") || "light";

if (lastTheme == "dark") {
    window.localStorage.setItem("theme", "dark")

    root.style.setProperty("--appInner", "#18191a")
    root.style.setProperty("--title", "white")
    root.style.setProperty("--navLink", "white")
    root.style.setProperty("--sidebar", "rgb(49, 49, 49)")
    root.style.setProperty("--cmds", "white")
    root.style.setProperty("--widBorder", "#2a2a2a")
    root.style.setProperty("--tabsclr", "white")
    root.style.setProperty("--thm-wid", "#242526")
    root.style.setProperty("--someTexts", "white")
    root.style.setProperty("--shadow", "0 12px 28px 0 #00000033, 0 2px 4px 0 #0000001a, inset 0 0 0 1px #ffffff0d")

    root.style.setProperty("--card-btn", "rgb(49, 49, 49)")
    root.style.setProperty("--backDrop", "#0b0b0bcc")

    root.style.setProperty("--active", "#4e4e4e")
} else {
    window.localStorage.setItem("theme", "light")

    root.style.setProperty("--appInner", "#f0f2f5")
    root.style.setProperty("--title", "black")
    root.style.setProperty("--navLink", "rgb(103, 111, 128)")
    root.style.setProperty("--sidebar", "white")
    root.style.setProperty("--cmds", "black")
    root.style.setProperty("--widBorder", "#d2d2d2")
    root.style.setProperty("--tabsclr", "black")
    root.style.setProperty("--thm-wid", "white")
    root.style.setProperty("--someTexts", "rgb(39, 44, 55)")
    root.style.setProperty("--backDrop", "#f4f4f4cc")

    root.style.setProperty("--shadow", "0 12px 28px 0 #00000033, 0 2px 4px 0 #0000001a, inset 0 0 0 1px #ffffff80")
    root.style.setProperty("--active", "#d2d2d2")

    root.style.setProperty("--card-btn", "#f3f3f3")
}