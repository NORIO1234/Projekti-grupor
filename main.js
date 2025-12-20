/* ================================
   HOTEL SHAH - INDEX JS
   Version Profesional
================================ */

document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();
    initTestimonialSlider();
    initNavbarScroll();
    initSmoothScroll();
});

/* ================================
   MOBILE MENU
================================ */
function initMobileMenu() {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        hamburger.classList.toggle("open");
    });

    // Mbyll menu kur klikon link
    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            hamburger.classList.remove("open");
        });
    });
}

/* ================================
   TESTIMONIAL SLIDER
================================ */
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll(".testimonial");
    if (testimonials.length === 0) return;

    let index = 0;
    testimonials[index].classList.add("active");

    setInterval(() => {
        testimonials[index].classList.remove("active");
        index = (index + 1) % testimonials.length;
        testimonials[index].classList.add("active");
    }, 5000);
}

/* ================================
   NAVBAR SCROLL EFFECT
================================ */
function initNavbarScroll() {
    const nav = document.querySelector("nav");
    if (!nav) return;

    window.addEventListener("scroll", () => {
        nav.classList.toggle("scrolled", window.scrollY > 80);
    });
}

/* ================================
   SMOOTH SCROLL
================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute("href"));
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });
}
