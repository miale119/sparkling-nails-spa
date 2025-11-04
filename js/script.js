/* ---------- Utilities ---------- */
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

/* ---------- Year in footer ---------- */
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- Mobile menu ---------- */
const toggle = $(".menu-toggle");
const links = $(".nav-links");
if (toggle && links) {
  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    links.classList.toggle("active");
  });
}

/* ---------- Prefill booking from querystring ---------- */
(function prefillFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const selected = params.get("service");
  const sel = $("#service");
  if (selected && sel) {
    const opt = [...sel.options].find(o => o.value === selected);
    if (opt) { sel.value = opt.value; sel.dispatchEvent(new Event("change")); }
  }
})();

/* ---------- Booking form helpers ---------- */
const serviceSel = $("#service");
const estTime = $("#est-time");
const estPrice = $("#est-price");

if (serviceSel && estTime && estPrice) {
  serviceSel.addEventListener("change", e => {
    const opt = e.target.selectedOptions[0];
    if (!opt) { estTime.textContent = "—"; estPrice.textContent = "—"; return; }
    estTime.textContent = opt.dataset.time || "—";
    estPrice.textContent = opt.dataset.price ? `$${opt.dataset.price}` : "—";
  });
}

/* Block Sundays in date picker (front-end cue; server should also validate when you add one) */
const dateInput = $("#date");
if (dateInput) {
  dateInput.addEventListener("input", () => {
    const d = new Date(dateInput.value + "T12:00:00");
    if (!isNaN(d) && d.getDay() === 0) {
      alert("We’re closed on Sundays. Please choose another day.");
      dateInput.value = "";
      dateInput.focus();
    }
  });
}

/* Booking form validation (front-end only demo) */
const bookingForm = $("#booking-form");
if (bookingForm) {
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = $("#form-msg");
    if (!bookingForm.checkValidity()) {
      msg.textContent = "Please complete all required fields.";
      msg.style.color = "#8a2c2c";
      bookingForm.reportValidity();
      return;
    }
    // Simulate success
    const name = $("#name").value.trim();
    msg.textContent = `Thanks, ${name}! We’ve received your request and will confirm shortly.`;
    msg.style.color = "green";
    bookingForm.reset();
    estTime.textContent = "—";
    estPrice.textContent = "—";
  });
}

/* Contact form (demo) */
const contactForm = $("#contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!contactForm.checkValidity()) { contactForm.reportValidity(); return; }
    $("#contact-msg").textContent = "Thanks! We’ll get back to you soon.";
    contactForm.reset();
  });
}

/* ---------- Gallery lightbox ---------- */
const lightbox = $("#lightbox");
const lightImg = $("#lightbox-img");
const lightCap = $("#lightbox-caption");
const closeBtn = $(".lightbox-close");

if (lightbox && lightImg && closeBtn) {
  $$(".glink").forEach(a => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const img = a.querySelector("img");
      lightImg.src = a.getAttribute("href");
      lightImg.alt = img.alt || "Gallery image";
      lightCap.textContent = img.alt || "";
      lightbox.hidden = false;
      closeBtn.focus();
    });
  });

  const close = () => { lightbox.hidden = true; lightImg.src = ""; };
  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !lightbox.hidden) close(); });
}
