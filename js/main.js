/* StudyLatte Stage 1: shared header, navigation and footer only. */
(function () {
  "use strict";

  const pages = [
    { label: "Home", file: "index.html" },
    { label: "Explore Spaces", file: "spaces.html" },
    { label: "Study Tools", file: "tools.html" },
    { label: "Menu", file: "menu.html" },
    { label: "About", file: "about.html" },
    { label: "Book a Room", file: "booking.html", prominent: true }
  ];

  // Detect the current HTML page, including when the root URL is used.
  const currentFile = window.location.pathname.split("/").pop() || "index.html";
  const headerMount = document.getElementById("site-header");
  const footerMount = document.getElementById("site-footer");

  if (headerMount) {
    const links = pages.map(page => {
      const current = page.file === currentFile ? ' aria-current="page"' : "";
      const prominent = page.prominent ? " nav-book" : "";
      return `<a class="nav-link${prominent}" href="${page.file}"${current}>${page.label}</a>`;
    }).join("");

    headerMount.innerHTML = `
      <header class="site-header">
        <div class="container header-inner">
          <a class="brand" href="index.html" aria-label="StudyLatte home">StudyLatte<span class="brand-dot">.</span></a>
          <button class="menu-toggle" type="button" aria-controls="primary-navigation" aria-expanded="false" aria-label="Open navigation menu">
            <span aria-hidden="true">☰</span><span>Menu</span>
          </button>
          <nav id="primary-navigation" class="site-nav" aria-label="Main navigation">${links}</nav>
        </div>
      </header>`;

    const toggle = headerMount.querySelector(".menu-toggle");
    const nav = headerMount.querySelector(".site-nav");
    const setMenu = open => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
      toggle.querySelector('span[aria-hidden="true"]').textContent = open ? "✕" : "☰";
    };
    toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        toggle.focus();
      }
    });
    // Reset the mobile menu if the viewport becomes desktop-sized.
    window.matchMedia("(min-width: 901px)").addEventListener("change", event => {
      if (event.matches) setMenu(false);
    });
  }

  if (footerMount) {
    const year = new Date().getFullYear();
    footerMount.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-top">
            <div>
              <a class="brand footer-brand" href="index.html">StudyLatte.</a>
              <p class="footer-copy">The warmth of a café. The calm of a library. A space for student productivity.</p>
            </div>
            <div>
              <h2 class="footer-title">Explore</h2>
              <ul class="footer-links">
                <li><a href="spaces.html">Explore Spaces</a></li>
                <li><a href="booking.html">Book a Room</a></li>
                <li><a href="tools.html">Study Tools</a></li>
                <li><a href="menu.html">Menu</a></li>
              </ul>
            </div>
            <div>
              <h2 class="footer-title">Information</h2>
              <ul class="footer-links">
                <li><a href="about.html">About &amp; Contact</a></li>
                <li>Location and contact: to be finalised</li>
                <li>Student café concept prototype</li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">© ${year} StudyLatte. University project prototype; no real bookings or live availability.<br><span class="team-footer-credit">Designed and developed by the StudyLatte student team as part of the UPES AI Literacy Programme 2026–27.</span></div>
        </div>
      </footer>`;
  }
})();
