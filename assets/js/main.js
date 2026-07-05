document.addEventListener("DOMContentLoaded", function () {
    const menu = document.getElementById("menu")
    const menuToggle = document.getElementById("menuToggle")
    const themeSwitch = document.getElementById("themeSwitch")

    const hasSubmenuItems = document.querySelectorAll(".has-submenu > a")
    const menuLinks = document.querySelectorAll(".menu-item a:not(.has-submenu > a)")

    const desktopMedia = window.matchMedia("(min-width: 768px)")

    // =========================
    // Active link handling
    // =========================

    function setActiveLinkBasedOnUrl() {
        const currentPath = window.location.pathname

        // Remove all active states first
        document.querySelectorAll(".menu-item a").forEach((link) => {
            link.classList.remove("active")
        })

        const pathSegments = currentPath.split("/").filter((seg) => seg !== "")

        menuLinks.forEach((link) => {
            const href = link.getAttribute("href")
            if (!href || href === "#") return

            const cleanHref = href.replace(/\/$/, "")
            const hrefSegments = cleanHref.split("/").filter((seg) => seg !== "")

            // Special handling for home page
            if (href === "/") {
                // Only activate home if we're at the root
                if (pathSegments.length === 0) {
                    link.classList.add("active")
                }
                return // Important: skip home from other checks
            }

            // Check if this is an exact match or parent path
            const currentWithoutSlash = currentPath.replace(/\/$/, "")

            if (currentWithoutSlash === cleanHref) {
                // Exact match
                link.classList.add("active")
            } else if (currentPath.startsWith(cleanHref + "/")) {
                // Parent path match (nested routes)
                link.classList.add("active")
            }
        })
    }

    // Call on page load
    setActiveLinkBasedOnUrl()

    // Update on history changes
    window.addEventListener("popstate", setActiveLinkBasedOnUrl)

    // =========================
    // Menu controls
    // =========================

    function openMenu() {
        menu.classList.add("active")
        menuToggle.classList.add("active")
    }

    function closeMenu() {
        menu.classList.remove("active")
        menuToggle.classList.remove("active")
    }

    function toggleMenu() {
        menu.classList.toggle("active")
        menuToggle.classList.toggle("active")
    }

    menuToggle.addEventListener("click", function (e) {
        e.preventDefault()
        toggleMenu()
    })

    // =========================
    // Responsive menu handling
    // =========================

    function resetMobileState() {
        // Remove mobile menu state when switching layouts
        closeMenu()

        // Close all submenus
        document.querySelectorAll(".has-submenu.open").forEach((item) => {
            item.classList.remove("open")

            const link = item.querySelector("a")
            const submenu = item.querySelector(".submenu")

            if (link) {
                link.setAttribute("aria-expanded", "false")
            }

            if (submenu) {
                submenu.setAttribute("aria-hidden", "true")
            }
        })
    }

    function handleBreakpointChange(e) {
        if (e.matches) {
            // Desktop mode
            resetMobileState()
        }
    }

    desktopMedia.addEventListener("change", handleBreakpointChange)

    // Initial state check
    handleBreakpointChange(desktopMedia)

    // =========================
    // Submenu handling
    // =========================

    hasSubmenuItems.forEach((item) => {
        item.addEventListener("click", function (e) {
            e.preventDefault()

            const parent = this.parentElement
            const submenu = parent.querySelector(".submenu")

            // Close other submenus
            document.querySelectorAll(".has-submenu").forEach((submenuItem) => {
                if (submenuItem !== parent && submenuItem.classList.contains("open")) {
                    submenuItem.classList.remove("open")

                    submenuItem.querySelector("a").setAttribute("aria-expanded", "false")

                    submenuItem.querySelector(".submenu").setAttribute("aria-hidden", "true")
                }
            })

            // Toggle current submenu
            const isOpen = parent.classList.toggle("open")

            this.setAttribute("aria-expanded", isOpen.toString())

            submenu.setAttribute("aria-hidden", (!isOpen).toString())
        })
    })

    // =========================
    // Menu link handling
    // =========================

    menuLinks.forEach((link) => {
        link.addEventListener("click", function () {
            // Close menu only on mobile
            if (!desktopMedia.matches) {
                closeMenu()
            }

            // Update active link
            menuLinks.forEach((item) => item.classList.remove("active"))

            this.classList.add("active")
        })
    })

    // =========================
    // Theme switch
    // =========================

    if (themeSwitch) {
        themeSwitch.addEventListener("change", function () {
            document.body.classList.toggle("dark-mode", this.checked)

            localStorage.setItem("darkMode", this.checked)
        })

        const savedDarkMode = localStorage.getItem("darkMode")

        if (savedDarkMode === "true") {
            themeSwitch.checked = true

            document.body.classList.add("dark-mode")
        }
    }

    // =========================
    // Escape key support
    // =========================

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && menu.classList.contains("active")) {
            closeMenu()
        }
    })
})
