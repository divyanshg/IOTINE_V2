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
    $(".darkCheck").prop("checked", true)
} else {
    window.localStorage.setItem("theme", "light")

    root.style.setProperty("--appInner", "white")
    root.style.setProperty("--title", "black")
    root.style.setProperty("--navLink", "rgb(103, 111, 128)")
    root.style.setProperty("--sidebar", "rgb(243, 245, 249)")
    root.style.setProperty("--cmds", "black")
    root.style.setProperty("--widBorder", "#d2d2d2")
    root.style.setProperty("--tabsclr", "black")
    root.style.setProperty("--thm-wid", "white")
    root.style.setProperty("--someTexts", "rgb(39, 44, 55)")
    $(".darkCheck").prop("checked", false)
}