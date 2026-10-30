/* ==========================================================================
   Judyth A. Carro Narváez — Portfolio script
   Plain JavaScript, no libraries.

   This file is loaded in <head> without "defer" on purpose: the theme is
   applied before the page appears, so visitors never see a flash of the
   wrong colors. Anything that needs the page content waits for
   DOMContentLoaded (see step 4).

   What it does
   1. Tells the CSS that JavaScript is on (shows the theme toggle)
   2. Picks the starting theme: saved choice → device setting → light
   3. Follows the device setting live, until the visitor picks a theme
   4. Wires up the toggle button and the footer year
   ========================================================================== */

(function () {
  "use strict";

  const STORAGE_KEY = "theme";
  const THEME_COLORS = { light: "#FFFCEE", dark: "#24101F" }; // match --color-bg in styles.css
  const root = document.documentElement;
  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");


  /* ---------- 1. JavaScript is on ---------- */

  root.classList.remove("no-js");
  root.classList.add("js");


  /* ---------- Helpers ---------- */

  // Saved choice ("light" or "dark"), or null if none.
  // Wrapped in try/catch: some private-browsing modes block storage.
  function getSavedTheme() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return value === "light" || value === "dark" ? value : null;
    } catch (error) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      // Storage unavailable: the theme still changes, it just won't be remembered.
    }
  }

  function getDeviceTheme() {
    return darkQuery.matches ? "dark" : "light";
  }

  function getCurrentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  // Applies a theme everywhere it matters.
  function applyTheme(theme) {
    // CSS reads this attribute to switch the color tokens.
    root.setAttribute("data-theme", theme);

    // The toggle reports "pressed" while dark is on (for screen readers and CSS).
    const button = document.getElementById("theme-toggle");
    if (button) {
      button.setAttribute("aria-pressed", String(theme === "dark"));
    }

    // Phone browser bars match the page background.
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (meta) {
      meta.setAttribute("content", THEME_COLORS[theme]);
    });
  }


  /* ---------- 2. Starting theme ---------- */

  applyTheme(getSavedTheme() || getDeviceTheme());


  /* ---------- 3. Follow the device until the visitor chooses ---------- */

  darkQuery.addEventListener("change", function (event) {
    if (!getSavedTheme()) {
      applyTheme(event.matches ? "dark" : "light");
    }
  });


  /* ---------- 4. Once the page content exists ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("theme-toggle");

    if (button) {
      // Sync the button with the theme chosen in step 2.
      button.setAttribute("aria-pressed", String(getCurrentTheme() === "dark"));

      // A <button> already works with mouse, touch, Enter, and Space.
      button.addEventListener("click", function () {
        const nextTheme = getCurrentTheme() === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
        saveTheme(nextTheme);
      });
    }

    // Keep the footer year current.
    const year = document.getElementById("year");
    if (year) {
      year.textContent = String(new Date().getFullYear());
    }
  });
})();
