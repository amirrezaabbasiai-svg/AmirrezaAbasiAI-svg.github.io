
// =========================================
// AMIRREZA ABBASI — PORTFOLIO JAVASCRIPT
// =========================================

// MOBILE NAVIGATION

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );

    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");

      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");

      menuToggle.textContent = "☰";
    });
  });
}

// AUTOMATIC FOOTER YEAR

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// SCROLL PROGRESS BAR

const progress = document.getElementById("progress");

function updateProgress() {
  if (!progress) return;

  const scrollable =
    document.documentElement.scrollHeight - window.innerHeight;

  const percentage =
    scrollable > 0
      ? (window.scrollY / scrollable) * 100
      : 0;

  progress.style.width = `${percentage}%`;
}

window.addEventListener("scroll", updateProgress, {
  passive: true
});

updateProgress();
