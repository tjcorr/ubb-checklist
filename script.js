(function () {
  const STORAGE_KEY = "ubb-checklist-progress-v1";
  const THEME_KEY = "ubb-checklist-theme";
  const steps = document.querySelectorAll(".step");
  const progressFill = document.getElementById("progress-fill");
  const progressLabel = document.getElementById("progress-label");
  const resetBtn = document.getElementById("reset-progress");
  const yearEl = document.getElementById("year");

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Theme toggle ---
  const themeToggle = document.getElementById("theme-toggle");
  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      themeToggle.title = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    }
  }

  let savedTheme = null;
  try { savedTheme = localStorage.getItem(THEME_KEY); } catch { /* ignore */ }
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch { /* ignore */ }
    });
  }

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }

  function updateProgress() {
    const total = steps.length;
    let done = 0;
    steps.forEach((s) => {
      if (s.classList.contains("completed")) done++;
    });
    const pct = total ? Math.round((done / total) * 100) : 0;
    if (progressFill) progressFill.style.width = pct + "%";
    if (progressLabel) progressLabel.textContent = `${done} of ${total} complete`;
  }

  const state = loadState();

  steps.forEach((step) => {
    const id = step.dataset.step;
    const cb = step.querySelector(".step-check");
    if (!cb) return;
    if (state[id]) {
      cb.checked = true;
      step.classList.add("completed");
    }
    cb.addEventListener("change", () => {
      if (cb.checked) {
        step.classList.add("completed");
        state[id] = true;
      } else {
        step.classList.remove("completed");
        delete state[id];
      }
      saveState(state);
      updateProgress();
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (!confirm("Reset all checklist progress?")) return;
      steps.forEach((step) => {
        const cb = step.querySelector(".step-check");
        if (cb) cb.checked = false;
        step.classList.remove("completed");
      });
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
      updateProgress();
    });
  }

  updateProgress();

  // --- Image gallery lightbox ---
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbCaption = document.getElementById("lightbox-caption");
  const lbPrev = lightbox && lightbox.querySelector(".lightbox-prev");
  const lbNext = lightbox && lightbox.querySelector(".lightbox-next");
  const lbClose = lightbox && lightbox.querySelector(".lightbox-close");

  if (lightbox && lbImg) {
    const galleryImgs = Array.from(document.querySelectorAll(".gallery img"));
    let currentIndex = 0;

    function show(i) {
      if (!galleryImgs.length) return;
      currentIndex = (i + galleryImgs.length) % galleryImgs.length;
      const img = galleryImgs[currentIndex];
      lbImg.src = img.src;
      lbImg.alt = img.alt || "";
      const fig = img.closest("figure");
      const cap = fig && fig.querySelector("figcaption");
      lbCaption.textContent = cap ? cap.textContent : "";
      lbCaption.style.display = cap ? "" : "none";
    }

    function open(i) {
      show(i);
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function close() {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    galleryImgs.forEach((img, i) => {
      img.addEventListener("click", () => open(i));
    });

    lbPrev && lbPrev.addEventListener("click", (e) => { e.stopPropagation(); show(currentIndex - 1); });
    lbNext && lbNext.addEventListener("click", (e) => { e.stopPropagation(); show(currentIndex + 1); });
    lbClose && lbClose.addEventListener("click", (e) => { e.stopPropagation(); close(); });
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
    lbImg.addEventListener("click", (e) => e.stopPropagation());

    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(currentIndex - 1);
      else if (e.key === "ArrowRight") show(currentIndex + 1);
    });
  }
})();
