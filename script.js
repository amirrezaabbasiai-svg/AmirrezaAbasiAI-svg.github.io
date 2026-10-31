// ===================================
// PORTFOLIO JAVASCRIPT
// ===================================


// Get elements
const navbar = document.getElementById("navbar");
const themeToggle = document.getElementById("themeToggle");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const backToTop = document.getElementById("backToTop");
const year = document.getElementById("year");


// ===================================
// CURRENT YEAR
// ===================================

if (year) {
    year.textContent = new Date().getFullYear();
}


// ===================================
// NAVBAR ON SCROLL
// ===================================

function handleScroll() {

    if (window.scrollY > 30) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

}


window.addEventListener("scroll", handleScroll);

handleScroll();


// ===================================
// DARK / LIGHT MODE
// ===================================

function updateThemeIcon() {

    const icon = themeToggle.querySelector("i");

    const currentTheme =
        document.documentElement.getAttribute("data-theme");

    if (currentTheme === "dark") {

        icon.className =
            "fa-solid fa-sun";

    } else {

        icon.className =
            "fa-regular fa-moon";

    }

}


function loadTheme() {

    const savedTheme =
        localStorage.getItem("portfolio-theme");

    if (savedTheme === "dark") {

        document.documentElement.setAttribute(
            "data-theme",
            "dark"
        );

    }

    updateThemeIcon();

}


themeToggle.addEventListener("click", () => {

    const currentTheme =
        document.documentElement.getAttribute("data-theme");

    if (currentTheme === "dark") {

        document.documentElement.removeAttribute(
            "data-theme"
        );

        localStorage.setItem(
            "portfolio-theme",
            "light"
        );

    } else {

        document.documentElement.setAttribute(
            "data-theme",
            "dark"
        );

        localStorage.setItem(
            "portfolio-theme",
            "dark"
        );

    }

    updateThemeIcon();

});


loadTheme();


// ===================================
// MOBILE MENU
// ===================================

menuBtn.addEventListener("click", () => {

    navLinks.classList.toggle("mobile-open");

    const icon =
        menuBtn.querySelector("i");

    if (
        navLinks.classList.contains("mobile-open")
    ) {

        icon.className =
            "fa-solid fa-xmark";

    } else {

        icon.className =
            "fa-solid fa-bars";

    }

});


// Close mobile menu when clicking a link

document
    .querySelectorAll(".nav-links a")
    .forEach(link => {

        link.addEventListener("click", () => {

            navLinks.classList.remove(
                "mobile-open"
            );

            menuBtn
                .querySelector("i")
                .className =
                    "fa-solid fa-bars";

        });

    });


// ===================================
// BACK TO TOP
// ===================================

backToTop.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


// ===================================
// SIMPLE REVEAL ANIMATION
// ===================================

const animatedElements =
    document.querySelectorAll(
        ".project-card, .info-card, .skill-column, .roadmap-item"
    );


const observer =
    new IntersectionObserver(
        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";

                    entry.target.style.transform =
                        "translateY(0)";

                    observer.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.1
        }
    );


animatedElements.forEach(element => {

    element.style.opacity = "0";

    element.style.transform =
        "translateY(20px)";

    element.style.transition =
        "opacity 0.6s ease, transform 0.6s ease";

    observer.observe(element);

});