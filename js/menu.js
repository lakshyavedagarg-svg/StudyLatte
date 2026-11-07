/* Stage 6: menu filtering only. Data comes from data/menu-data.js. */
(function () {
  "use strict";
  const items = window.studyLatteMenu || [];
  const buttons = Array.from(document.querySelectorAll("[data-menu-category]"));
  const grid = document.getElementById("menu-grid");
  const count = document.getElementById("menu-count");
  if (!grid || !count || !buttons.length) return;
  function show(category) {
    const visible = category === "All" ? items : items.filter(item => item.category === category);
    // All menu content is project-controlled, not user-supplied.
    grid.innerHTML = visible.map(item => `
      <article class="card menu-item">
        <img class="menu-item-image" src="${item.image}" alt="${item.alt}" loading="lazy" width="600" height="400">
        <div class="menu-item-body">
          <p class="menu-item-category">${item.category}</p>
          <div class="menu-item-title"><h3>${item.name}</h3><strong>₹${item.price}</strong></div>
          <p>${item.description}</p>
        </div>
      </article>`).join("");
    count.textContent = `${visible.length} illustrative item${visible.length === 1 ? "" : "s"} shown`;
    buttons.forEach(button => {
      const selected = button.dataset.menuCategory === category;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }
  buttons.forEach(button => button.addEventListener("click", () => show(button.dataset.menuCategory)));
  show("All");
})();
