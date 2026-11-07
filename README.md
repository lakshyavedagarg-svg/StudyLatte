# StudyLatte

StudyLatte is a fictional student-focused reading and productivity café website prototype created by six students for the **UPES AI Literacy Programme 2026–27**. It brings together quiet study, reading, group collaboration, meetings and optional productivity tools.

## Run locally

Extract `StudyLatte_Final.zip`, open the `StudyLatte` folder in VS Code, then use **Live Server** on `index.html` (or open `index.html` in a modern browser). The site is static HTML, CSS and JavaScript; no backend, framework or installation is needed. Internet is required for Google Fonts and external E-Library links, not for local photographs or MP3s.

## Six pages

1. **Home** (`index.html`) — café introduction, four-zone preview, clearly labelled sample availability, tools and three-item menu preview.
2. **Explore Spaces** (`spaces.html`) — Focus, Reading, Collaboration and Meeting zones plus the four-choice rule-based Space Finder.
3. **Book a Room** (`booking.html`) — one-hour demo slots from 9 AM to 9 PM, Small Room (2–4), Large Room (5–8), validation, local conflict checks and cancellation.
4. **Study Tools** (`tools.html`) — 25/5 Pomodoro, 27 curated E-Library resources with search/filters, and three local StudyLatte Lo-Fi tracks.
5. **Menu** (`menu.html`) — 18 illustrative items with category filtering and locally stored group-selected AI-generated concept photographs.
6. **About & Contact** (`about.html`) — concept, facilities, prototype/contact disclosures and Meet the Team with six original student-supplied portraits and confirmed batches/SAP IDs.

## Prototype limitations

- Booking data uses browser `localStorage` under `studylatte_demo_bookings_v1`; it is not shared between devices, may be cleared, and does not create real reservations.
- Zone availability is **SAMPLE / DEMO DATA**, not live occupancy.
- StudyLatte is not an operating café; no real address, contact channel or commercial opening hours are claimed.
- Menu items and INR prices are illustrative for the university project.
- E-Library links lead to external sources. Availability and copyright permissions can vary by source and jurisdiction; the website does not host their books.
- Three locally stored original AI-assisted instrumental tracks are included under `assets/audio/`; playback requires an explicit Play action.
- Menu concept photographs were provided/selected by the group. Three known photo substitutions are described in `assets/images/menu/IMAGE_NOTES.md`.

## Team

Lakshya Garg (Batch 43), Animesh Kumar (Batch 44), Mayra Bisht (Batch 44), Sanskar Singh (Batch 43), Akshay Jain (Batch 44), Niharika Shaily (Batch 44). The About page contains the confirmed SAP IDs and original team photographs.

See `TEST_REPORT.md` for checks completed, actual issues, tests still requiring browser verification and known limitations.
