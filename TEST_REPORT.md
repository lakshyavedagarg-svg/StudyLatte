# StudyLatte — Final Submission Audit Report

Audit date: 7 November 2026. Audited source: `StudyLatte_Final_SAP_Updated.zip` (latest complete project supplied in this conversation).

## Tests Passed — performed in this audit

- All six HTML pages exist: Home, Explore Spaces, Book a Room, Study Tools, Menu, About & Contact.
- HTML references to local pages, CSS, scripts and images resolve; internal anchor targets resolve; HTML images have alt attributes.
- CSS `url(...)` references resolve. All 11 JavaScript files pass `node --check`.
- Space Finder source contains all four approved rule mappings, with result text and action updates.
- Booking source retains `studylatte_demo_bookings_v1`, the two room capacity rules, validation and conflict/cancellation code.
- Timer source retains Focus = 25 minutes and Break = 5 minutes.
- E-Library data contains 27 HTTPS resource links, distributed 7 Fiction / Classics, 7 Academic, 7 Programming and 6 Personal Development / Learning. These are **record and URL-format checks**, not proof that remote links currently load.
- Menu data contains 18 items: 5 Coffee & Tea, 4 Cold Drinks, 5 Snacks and 4 Light Meals. All 18 local item image files exist, can be decoded as images and have descriptive alt text.
- Homepage preview refers to local Classic Latte, Iced Latte and Veg Grilled Sandwich photographs.
- About page contains exactly six team cards, with correct names, batches and SAP IDs (including Niharika Shaily: 590039661), locally present photographs and meaningful alt text. Circular CSS crops and initials fallback rules are present.
- The three local MP3s exist and were decoded by `ffprobe`: Coffee & Focus ~152 s, Rainy Reading ~169 s, Late Night Study ~165 s. Player code uses one shared `Audio` object and has no autoplay instruction.
- Project includes README and this test report. Final ZIP was checked for integrity and file inventory.

## Issues Found and Fixed

No new functional or broken-reference defect was identified by the completed static/source/asset checks. No working code was changed merely to create a change log. The previous test report had become historical and described prior development as if it were the current audit; it was replaced with this dated report, which distinguishes source verification from browser testing. README was refreshed for final submission.

## Requires Human Browser Verification

An attempt to run Chromium/Playwright against both a local HTTP server and a local file URL failed with `net::ERR_BLOCKED_BY_ADMINISTRATOR`. Consequently, the following were **not independently browser-tested in this audit**:

- Desktop and responsive layout at 375 px, 430 px, 768 px and desktop, including image crops, team portraits, navigation and keyboard focus.
- Space Finder interactions and live recommendation updates.
- Booking validation, conflict prevention, persistence after refresh, cancellation and released slots.
- Pomodoro Start/Pause/Resume/Reset, completion and repeated Start behaviour.
- Library search, filters, Clear Filters, no-results state and actual opening of all external URLs.
- Menu filtering and images after changing categories.
- Lo-Fi Play/Pause, volume, single-track switching, status text, no autoplay and keyboard controls.
- Browser console errors and formal colour-contrast measurements.

The student group previously reported successful browser testing of the developed features. That earlier user testing is separate from the checks performed for this report.

## Known Prototype Limitations

- No backend, accounts or shared reservation database; bookings are only in the current browser's `localStorage` and may disappear when storage is cleared.
- General zone availability is SAMPLE / DEMO DATA, not live occupancy.
- StudyLatte is a fictional university café concept with no operational address, phone number, email or confirmed commercial hours.
- Menu items and INR prices are illustrative.
- E-Library links point to external websites; their availability and copyright terms depend on providers and jurisdiction. All 27 links were **not** live-verified during this audit.
- Three locally stored original AI-assisted Lo-Fi tracks are included; they are not commercial recordings.
- Menu imagery is group-supplied AI-generated concept imagery. Known visual substitutions remain: Chocolate Cookie shows a muffin, Fruit Cup shows an iced-tea image, and Classic Latte reuses a cappuccino photograph. These were retained to respect the instruction not to generate or substitute images.
- No formal WCAG certification is claimed.

## Android `content://` Styling Investigation — 7 November 2026

**Reported issue:** A student opened `index.html` in Android Chrome through a `content://com.google...` address and observed default browser fonts, blue underlined links, unstyled cards and missing responsive navigation. This is a genuine human-device observation, not a simulated screenshot.

**Likely cause:** Android's content-provider URL exposed the HTML document without reliably exposing adjacent relative CSS, JavaScript and image assets. This is an environment/file-opening problem, not a demonstrated CSS breakpoint defect. A `content://` URI is not equivalent to serving the project directory over HTTP/HTTPS.

**Checks completed:** All six HTML files reference `css/style.css` and `css/responsive.css`, and the linked CSS/JS files exist. No root-relative `/css/`, `/js/` or `/assets/` references were found in HTML. Internal HTML/image references resolved. A local Python HTTP server returned HTTP 200 for all six HTML pages, both CSS files (Content-Type `text/css`), shared `js/main.js`, and a sampled local menu image (Content-Type `image/png`). Responsive CSS contains mobile navigation, grid and container rules. These checks establish correct static serving and references; they do not establish rendered browser layout.

**Action:** No HTML, CSS, JS or asset code was changed because no genuine project path defect was found. This report was updated to document the observed issue and its likely environmental cause.

**Required human verification:** Open the extracted project via a proper HTTP/HTTPS server (e.g. VS Code Live Server on the same Wi-Fi network or a static HTTPS deployment), not by tapping `index.html` in Android's file manager. Confirm CSS and images load, then inspect 375 px and 430 px mobile layouts, mobile navigation, hero, zone cards, booking form, Pomodoro, Lo-Fi controls, E-Library filters, menu images, team cards, keyboard access, and horizontal overflow. If the problem persists over HTTP/HTTPS, capture the actual URL, browser console/network failures if available, and a new screenshot; that would warrant a separate responsive/code fix.
