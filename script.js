/* =========================================
1. MOBILE MENU
========================================= */
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

if (menuToggle && mobileMenu) {
menuToggle.addEventListener("click", () => {
const expanded = menuToggle.getAttribute("aria-expanded") === "true";
menuToggle.setAttribute("aria-expanded", String(!expanded));
mobileMenu.classList.toggle("is-open");
});

document.addEventListener("click", (event) => {
const isOpen = mobileMenu.classList.contains("is-open");
if (!isOpen) return;
const target = event.target;
if (!(target instanceof Element)) return;
if (mobileMenu.contains(target) || menuToggle.contains(target)) return;
mobileMenu.classList.remove("is-open");
menuToggle.setAttribute("aria-expanded", "false");
});
}

document.querySelectorAll(".mobile-nav a, .mobile-contact-btn").forEach((item) => {
item.addEventListener("click", () => {
if (mobileMenu) mobileMenu.classList.remove("is-open");
if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
});
});




/* =========================================
1b. HEADER SHOW/HIDE ON SCROLL
========================================= */
const siteHeader = document.querySelector('.site-header');
let lastScrollY = window.scrollY;

function updateHeaderVisibility() {
  if (!siteHeader) return;
  const currentY = window.scrollY;
  const isMenuOpen = mobileMenu?.classList.contains('is-open');

  if (currentY <= 8 || isMenuOpen) {
    siteHeader.classList.remove('is-hidden');
    lastScrollY = currentY;
    return;
  }

  if (currentY > lastScrollY + 6) {
    siteHeader.classList.add('is-hidden');
  } else if (currentY < lastScrollY - 6) {
    siteHeader.classList.remove('is-hidden');
  }

  lastScrollY = currentY;
}

window.addEventListener('scroll', updateHeaderVisibility, { passive: true });
window.addEventListener('resize', updateHeaderVisibility);

/* =========================================
2. KONTAKT-MODAL & FLYER POPUP
========================================= */
const contactModal = document.getElementById("contact-modal");
const openButtons = document.querySelectorAll("[data-open-contact]");
const closeButtons = document.querySelectorAll("[data-close-contact]");
const flyerPopup = document.getElementById("flyer-popup");
const flyerPopupClose = document.getElementById("flyer-popup-close");
const flyerPopupX = document.getElementById("flyer-popup-x");
const flyerPopupMail = document.getElementById("flyer-popup-mail");
const flyerOpenContactFirst = document.querySelectorAll("[data-close-flyer-first]");

const urlParams = new URLSearchParams(window.location.search);
const isFlyerVisit = urlParams.get("flyer") === "1";

function openModal() {
if (!contactModal) return;
contactModal.classList.add("is-open");
contactModal.setAttribute("aria-hidden", "false");
document.body.classList.add("modal-open");
}

function closeModal() {
if (!contactModal) return;
contactModal.classList.remove("is-open");
contactModal.setAttribute("aria-hidden", "true");
document.body.classList.remove("modal-open");
}

function openFlyerPopup() {
if (!flyerPopup) return;
flyerPopup.classList.add("is-open");
flyerPopup.setAttribute("aria-hidden", "false");
document.body.classList.add("modal-open");
}

function closeFlyerPopup() {
if (!flyerPopup) return;
flyerPopup.classList.remove("is-open");
flyerPopup.setAttribute("aria-hidden", "true");
document.body.classList.remove("modal-open");
if (isFlyerVisit) startIntroAnimations();
}

openButtons.forEach(button => button.addEventListener("click", openModal));
closeButtons.forEach(button => button.addEventListener("click", closeModal));

if (flyerPopupClose) flyerPopupClose.addEventListener("click", closeFlyerPopup);
if (flyerPopupX) flyerPopupX.addEventListener("click", closeFlyerPopup);
if (flyerPopupMail) flyerPopupMail.addEventListener("click", closeFlyerPopup);

flyerOpenContactFirst.forEach((button) => {
button.addEventListener("click", () => {
closeFlyerPopup();
setTimeout(() => openModal(), 120);
});
});

document.addEventListener("keydown", (event) => {
if (event.key === "Escape") {
closeModal();
closeFlyerPopup();
}
});

const heroGraphicWrapper = document.querySelector(".hero-graphic-wrapper");
const heroCloudsWrapper = document.querySelector(".hero-clouds-wrapper");
const heroCloudsSvg = document.querySelector(".hero-clouds-svg");

const clouds = [
heroCloudsSvg?.querySelector("#cloud-group-first"),
heroCloudsSvg?.querySelector("#cloud-group-sec"),
heroCloudsSvg?.querySelector("#cloud-group-third")
].filter(Boolean);


/* =========================================
HERO CLOUD ENTRANCE ANIMATION
========================================= */

window.addEventListener("load", () => {
if (typeof gsap === "undefined") {
console.warn("GSAP ist nicht geladen. Cloud-Animation übersprungen.");
return;
}

const prefersReducedMotion = window.matchMedia(
"(prefers-reduced-motion: reduce)"
).matches;

if (prefersReducedMotion) return;

const heroGraphicWrapper = document.querySelector(".hero-graphic-wrapper");
const heroCloudsWrapper = document.querySelector(".hero-clouds-wrapper");
const heroCloudsSvg = document.querySelector(".hero-clouds-svg");

if (!heroGraphicWrapper || !heroCloudsWrapper || !heroCloudsSvg) {
console.warn("Cloud-Animation: Wrapper oder SVG nicht gefunden.");
return;
}

const clouds = [
heroCloudsSvg.querySelector("#cloud-group-first"),
heroCloudsSvg.querySelector("#cloud-group-sec"),
heroCloudsSvg.querySelector("#cloud-group-third"),
].filter(Boolean);

if (clouds.length === 0) {
console.warn("Cloud-Animation: Keine Clouds gefunden.");
return;
}


/* =========================================
4. FORMULAR-SENDEN (API)
========================================= */
async function handleFormSubmit(formElement, statusElement) {
if (!formElement || !statusElement) return;

formElement.addEventListener("submit", async (e) => {
e.preventDefault();
statusElement.textContent = "Nachricht wird gesendet …";

const formData = {
name: formElement.name.value.trim(),
email: formElement.email.value.trim(),
message: formElement.message.value.trim()
};

try {
const response = await fetch("/api/contact", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(formData)
});
const data = await response.json();
if (!response.ok) throw new Error(data.message || "E-Mail Fehler.");

statusElement.textContent = "Danke – deine Nachricht wurde gesendet.";
formElement.reset();
if (formElement.id === "contactForm") {
setTimeout(() => { closeModal(); statusElement.textContent = ""; }, 1400);
}
} catch (error) {
statusElement.textContent = error.message || "Senden fehlgeschlagen.";
}
});
}

const modalForm = document.getElementById("contactForm");
const modalStatus = document.getElementById("form-status");
if (modalForm) handleFormSubmit(modalForm, modalStatus);

const embeddedForm = document.getElementById("embeddedContactForm");
const embeddedStatus = document.getElementById("embedded-form-status");
if (embeddedForm) handleFormSubmit(embeddedForm, embeddedStatus);


/* =========================================
5. SMARTE FLOATING-BUTTON LOGIK
========================================= */
const floatingBtn = document.querySelector(".floating-project-btn");
const siteFooter = document.querySelector(".site-footer");
const heroGraphic = document.querySelector(".hero-graphic");

function updateBtnVisibility(shouldShow) {
if (!floatingBtn) return;
gsap.to(floatingBtn, {
opacity: shouldShow ? 1 : 0,
y: shouldShow ? 0 : 20,
autoAlpha: shouldShow ? 1 : 0,
duration: 0.4,
pointerEvents: shouldShow ? 'all' : 'none',
overwrite: 'auto'
});
}

const scrollObserver = new IntersectionObserver((entries) => {
entries.forEach(entry => {
// Wenn Hero oder Footer sichtbar -> Button weg
if (entry.isIntersecting) {
updateBtnVisibility(false);
} else if (entry.target === heroGraphic) {
// Wenn man den Hero verlässt -> Button herzeigen
updateBtnVisibility(true);
}
});
}, { threshold: 0.1 });

if (floatingBtn) {
if (heroGraphic) scrollObserver.observe(heroGraphic);
if (siteFooter) scrollObserver.observe(siteFooter);
}




document.addEventListener("DOMContentLoaded", () => {
// GSAP MatchMedia für Breakpoints und Accessibility
let mm = gsap.matchMedia();

// greift nur bis 767px UND wenn Nutzer reduzierte Bewegung nicht bevorzugen
mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {

// Elemente auswählen
const cloudWrapper = document.querySelector('.hero-clouds-wrapper');
const clouds = [
document.querySelector('#cloud-group-first'),
document.querySelector('#cloud-group-sec'),
document.querySelector('#cloud-group-third')
];

// Bestehende Elemente, die weich eingeblendet werden sollen
// Passe diese Klassennamen an dein echtes HTML an
const heroGraphic = document.querySelector('.hero-graphic');
const heroTextElements = document.querySelector('.hero-text-content');

// Sicherheits-Check: Abbrechen, falls das SVG oder die Gruppen fehlen
if (!cloudWrapper || !clouds[0] || !clouds[1] || !clouds[2]) {
console.warn("GSAP Hero Animation: SVG-Gruppen nicht gefunden.");
return;
}

// --- 1. ENTRANCE TIMELINE ---
const tl = gsap.timeline({
// Sobald der Entrance fertig ist, startet das atmosphärische Atmen
onComplete: initBreathingClouds
});

// Initiale Startzustände setzen (verhindert Flackern)
// Wolken starten leicht versetzt nach links (x: -15%), leicht kleiner und unsichtbar
gsap.set(clouds, { xPercent: -15, scale: 0.95, opacity: 0 });

// Text und Grafik starten unsichtbar (und Text leicht nach unten versetzt)
if (heroGraphic) gsap.set(heroGraphic, { opacity: 0 });
if (heroTextElements) gsap.set(heroTextElements, { opacity: 0, y: 15 });

// Wolken ziehen weich ein (Dauer 2.5s, sehr sanft)
tl.to(clouds, {
xPercent: 0,
scale: 1,
opacity: 1,
duration: 2.5,
stagger: 0.15, // Wolken kommen minimal zeitversetzt für mehr Tiefe
ease: "power2.out"
})
// Text und Grafik blenden sich weich ein, *während* die Wolken fast ankommen
// ("-=1.0" bedeutet, die Animation startet 1 Sekunde bevor die Wolken fertig sind)
.to([heroGraphic, heroTextElements], {
opacity: 1,
y: 0,
duration: 1.5,
stagger: 0.2, // Erst baut sich die Grafik auf, dann der Text (oder umgekehrt)
ease: "power2.out"
}, "-=1.0");

// --- 2. CONTINUOUS FLOATING (Atmen) ---
function initBreathingClouds() {
// Jede Wolke bekommt leicht andere Werte für einen asymmetrischen, natürlichen Look
clouds.forEach((cloud, index) => {
if (!cloud) return;

// Sehr langsame Dauer: 4 bis 6 Sekunden pro Zyklus
const duration = 4 + index;
// Minimaler Delay, damit sie nicht synchron atmen
const delay = index * 0.4;

gsap.to(cloud, {
xPercent: "random(-1.5, 1.5)", // minimale seitliche Drift
yPercent: "random(-1.5, 1.5)", // minimale vertikale Drift
scale: "random(0.99, 1.01)", // fast unmerkliches Skalieren
rotation: "random(-0.5, 0.5)", // winzige Neigung
duration: duration,
ease: "sine.inOut", // extrem weiche Kurve für Loop-Umkehrpunkte
repeat: -1, // endlos
yoyo: true, // vor und zurück
delay: delay,
transformOrigin: "center center" // Wichtig für sauberes Skalieren/Rotieren
});
});
}
});

// --- FALLBACK-SICHERHEIT ---
// Für Desktop oder wenn "prefers-reduced-motion" aktiv ist.
// Hier passiert nichts weiter, GSAP setzt die Elemente nicht auf opacity: 0,
// sie werden also ganz normal durch CSS geladen und angezeigt.
});





/* =========================================
7. USP CAROUSEL CONTROLS
========================================= */
const uspGrid = document.getElementById("usp-grid");
const uspPrev = document.querySelector(".usp-nav--prev");
const uspNext = document.querySelector(".usp-nav--next");

function scrollUsp(direction) {
if (!uspGrid) return;
const amount = Math.max(uspGrid.clientWidth * 0.8, 320);
uspGrid.scrollBy({ left: direction * amount, behavior: "smooth" });
}

if (uspPrev && uspNext && uspGrid) {
uspPrev.addEventListener("click", () => scrollUsp(-1));
uspNext.addEventListener("click", () => scrollUsp(1));
}

const uspScrollbar = document.getElementById("usp-scrollbar");

function syncUspScrollbarFromScroll() {
  if (!uspGrid || !uspScrollbar) return;
  const maxScroll = uspGrid.scrollWidth - uspGrid.clientWidth;
  const progress = maxScroll > 0 ? (uspGrid.scrollLeft / maxScroll) * 100 : 0;
  uspScrollbar.value = String(progress);
  uspScrollbar.style.setProperty("--scroll-progress", `${progress}%`);
}

if (uspGrid && uspScrollbar) {
  syncUspScrollbarFromScroll();

  uspGrid.addEventListener("scroll", syncUspScrollbarFromScroll, { passive: true });
  window.addEventListener("resize", syncUspScrollbarFromScroll);

  const updateUspGridFromPercentage = (value) => {
    const maxScroll = Math.max(uspGrid.scrollWidth - uspGrid.clientWidth, 0);
    const percentage = Math.min(Math.max(Number(value), 0), 100) / 100;
    const nextLeft = maxScroll * percentage;
    uspGrid.scrollTo({ left: nextLeft, behavior: "auto" });
    uspScrollbar.value = String(percentage * 100);
    uspScrollbar.style.setProperty("--scroll-progress", `${percentage * 100}%`);
  };

  uspScrollbar.addEventListener("input", (event) => {
    updateUspGridFromPercentage(event.target.value);
  });

  const setSliderFromPointer = (clientX) => {
    const rect = uspScrollbar.getBoundingClientRect();
    if (!rect.width) return;
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    updateUspGridFromPercentage(ratio * 100);
  };

  uspScrollbar.addEventListener("pointerdown", (event) => {
    setSliderFromPointer(event.clientX);
    const onMove = (moveEvent) => setSliderFromPointer(moveEvent.clientX);
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
  });
}
