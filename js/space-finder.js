/* Stage 3: Simple, rule-based StudyLatte Space Finder. No AI or API calls. */
(function () {
  "use strict";

  // Each activity points to one matching zone and its explanation.
  const recommendations = {
    study: { name: "Focus Zone", reason: "Silent individual desks help you concentrate on studying, coding and assignments without group distractions.", noise: "Silent", facilities: "Wi-Fi, charging points, individual desks", capacity: "20 seats (illustrative)", href: "#focus-zone", action: "View Focus Zone" },
    read: { name: "Reading Zone", reason: "Comfortable seating and reading lights create a calm setting for books, articles and relaxed reading.", noise: "Low", facilities: "Comfortable seating, Wi-Fi, reading lights", capacity: "15 seats (illustrative)", href: "#reading-zone", action: "View Reading Zone" },
    group: { name: "Collaboration Zone", reason: "Group tables and a discussion-friendly atmosphere make teamwork, brainstorming and projects easier.", noise: "Discussion allowed", facilities: "Group tables, Wi-Fi, charging points", capacity: "16 seats (illustrative)", href: "#collaboration-zone", action: "View Collaboration Zone" },
    meeting: { name: "Meeting Rooms", reason: "Enclosed rooms provide privacy for organised meetings and discussions, with whiteboards for shared ideas.", noise: "Private / enclosed discussion", facilities: "Whiteboard, Wi-Fi, charging points", capacity: "Small room: 2–4; Large room: 5–8", href: "booking.html", action: "Book a Room" }
  };

  const buttons = document.querySelectorAll(".finder-option");
  const result = document.getElementById("finder-result");
  const empty = document.getElementById("finder-empty");
  if (!buttons.length || !result || !empty) return; // Other pages do not have a finder.

  const title = document.getElementById("recommendation-title");
  const reason = document.getElementById("recommendation-reason");
  const noise = document.getElementById("recommendation-noise");
  const facilities = document.getElementById("recommendation-facilities");
  const capacity = document.getElementById("recommendation-capacity");
  const action = document.getElementById("recommendation-action");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const zone = recommendations[button.dataset.activity];
      if (!zone) return;

      // Only the chosen button is visually selected and announced as pressed.
      buttons.forEach(item => {
        const selected = item === button;
        item.classList.toggle("is-selected", selected);
        item.setAttribute("aria-pressed", String(selected));
      });

      // textContent safely displays plain text and does not parse HTML.
      title.textContent = zone.name;
      reason.textContent = zone.reason;
      noise.textContent = zone.noise;
      facilities.textContent = zone.facilities;
      capacity.textContent = zone.capacity;
      action.textContent = zone.action + " ↗";
      action.href = zone.href;

      empty.hidden = true;
      result.hidden = false;
      // Move keyboard focus to the new result heading so it is announced.
      title.focus({ preventScroll: true });
      result.scrollIntoView({ behavior: "auto", block: "nearest" });
    });
  });
})();
