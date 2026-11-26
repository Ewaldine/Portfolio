// Run everything once the HTML has been read (scripts use "defer")
document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  setupNavShadow();
  setupScrollReveal();
  setupTyping();
  setupFilter(".filter-btn", ".project", "data-filter", "data-category");
  setupFilter(".tab", ".tool", "data-tab", "data-group");
  setupContactForm();
  setupYear();
  setupCvDownload();
});

// Forces the CV to save to disk instead of opening in a new tab
function setupCvDownload() {
  const btn = document.querySelector('a[href="assets/CV2.pdf"]');
  if (!btn) return;

  btn.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(btn.href);
      if (!response.ok) throw new Error(response.status);
      const url = URL.createObjectURL(await response.blob());
      triggerDownload(url, btn.getAttribute("download"));
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      // Fallback (e.g. opened from file://): use the plain link
      triggerDownload(btn.href, btn.getAttribute("download"));
    }
  });
}

function triggerDownload(url, filename) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

// Open and close the hamburger menu on small screens
function setupMobileMenu() {
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.querySelector(".nav__links");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.textContent = isOpen ? "✕" : "☰";
    toggle.setAttribute("aria-expanded", isOpen);
  });
}

// Add a border under the navbar once the page is scrolled
function setupNavShadow() {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 10);
  });
}

// Fade elements in when they enter the screen
function setupScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((item) => observer.observe(item));
}

// Type out the role text on the home page
function setupTyping() {
  const target = document.querySelector("#typed-text");
  if (!target) return;

  const words = ["Front-End Developer", "UI Enthusiast", "Problem Solver"];
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const word = words[wordIndex];
    target.textContent = word.slice(0, charIndex);

    if (!deleting && charIndex === word.length) {
      deleting = true;
      return setTimeout(tick, 1500);
    }
    if (deleting && charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }

    charIndex += deleting ? -1 : 1;
    setTimeout(tick, deleting ? 50 : 90);
  }

  tick();
}

// Show only items whose category matches the clicked button
function setupFilter(buttonSelector, itemSelector, buttonAttr, itemAttr) {
  const buttons = document.querySelectorAll(buttonSelector);
  const items = document.querySelectorAll(itemSelector);
  if (!buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const choice = button.getAttribute(buttonAttr);

      buttons.forEach((b) => b.classList.toggle("active", b === button));

      items.forEach((item) => {
        const match = choice === "all" || item.getAttribute(itemAttr) === choice;
        item.classList.toggle("is-hidden", !match);
      });
    });
  });

  // Apply the default active button on load so the matching items show
  const defaultButton = document.querySelector(`${buttonSelector}.active`);
  if (defaultButton) defaultButton.click();
}

// Validate the contact form before "sending"
function setupContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const success = document.querySelector("#form-success");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let valid = true;

    const rules = {
      name: (v) => (v.trim() ? "" : "Please enter your name."),
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? "" : "Please enter a valid email."),
      message: (v) => (v.trim().length >= 10 ? "" : "Message must be at least 10 characters."),
    };

    Object.keys(rules).forEach((field) => {
      const input = form.elements[field];
      const message = rules[field](input.value);
      const errorEl = form.querySelector(`[data-error-for="${field}"]`);

      input.classList.toggle("is-invalid", Boolean(message));
      errorEl.textContent = message;
      if (message) valid = false;
    });

    success.classList.toggle("show", valid);
    if (valid) form.reset();
  });
}

// Keep the copyright year up to date
function setupYear() {
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
}
