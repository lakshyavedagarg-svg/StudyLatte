/* StudyLatte Stage 4: browser-only demonstration booking system.
   No backend, payment, account or real café reservation is involved. */
(function () {
  "use strict";

  const STORAGE_KEY = "studylatte_demo_bookings_v1";
  const ROOMS = {
    "room-small": { name: "Small Discussion Room", min: 2, max: 4 },
    "room-large": { name: "Large Meeting Room", min: 5, max: 8 }
  };
  const form = document.getElementById("booking-form");
  if (!form) return; // Other StudyLatte pages do not contain this form.

  const dateInput = document.getElementById("booking-date");
  const timeInput = document.getElementById("booking-time");
  const attendeeInput = document.getElementById("attendees");
  const summary = document.getElementById("booking-summary");
  const confirmation = document.getElementById("booking-confirmation");
  const list = document.getElementById("my-bookings-list");
  const formError = document.getElementById("booking-form-error");
  let storageWarningShown = false;

  // Local dates, not UTC dates: important when a student books 'today'.
  function localDateString(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  function isValidDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [y, m, d] = value.split("-").map(Number);
    const parsed = new Date(y, m - 1, d);
    return parsed.getFullYear() === y && parsed.getMonth() === m - 1 && parsed.getDate() === d;
  }
  function selectedRoom() { return form.querySelector('input[name="room"]:checked')?.value || ""; }
  function minuteToTime(minutes) { return `${String(Math.floor(minutes / 60)).padStart(2,"0")}:${String(minutes % 60).padStart(2,"0")}`; }
  function toMinutes(value) {
    if (!/^\d{2}:\d{2}$/.test(value)) return NaN;
    const [h,m] = value.split(":").map(Number);
    return h * 60 + m;
  }
  function validSlot(time) {
    const n = toMinutes(time);
    return Number.isInteger(n) && n >= 9*60 && n < 21*60 && n % 60 === 0;
  }
  function isPastSlot(date, time) {
    if (date !== localDateString()) return false;
    const now = new Date();
    return toMinutes(time) <= now.getHours()*60 + now.getMinutes();
  }
  function showError(field, message) {
    const id = {room:"room-error",date:"date-error",time:"time-error",name:"name-error",email:"email-error",attendees:"attendees-error"}[field];
    const error = document.getElementById(id);
    if (error) error.textContent = message;
    const input = {date:dateInput,time:timeInput,name:document.getElementById("student-name"),email:document.getElementById("student-email"),attendees:attendeeInput}[field];
    if (input) input.setAttribute("aria-invalid", String(Boolean(message)));
    form.querySelectorAll('.room-option').forEach(el => { if (field === "room") el.classList.toggle("has-error", Boolean(message)); });
  }
  function clearErrors() {
    Object.keys({room:1,date:1,time:1,name:1,email:1,attendees:1}).forEach(field => showError(field,""));
    formError.textContent = "";
  }
  function readBookings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(b => b && typeof b === "object") : [];
    } catch (error) {
      formError.textContent = "Could not read local bookings. Check your browser storage settings.";
      return [];
    }
  }
  function saveBookings(bookings) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
      return true;
    } catch (error) {
      formError.textContent = "Unable to save this demo booking. Please enable browser storage or free some space.";
      return false;
    }
  }
  function isTaken(bookings, room, date, start) {
    const startMinute = toMinutes(start);
    const endMinute = startMinute + 60;
    return bookings.some(b => b.roomId === room && b.date === date &&
      startMinute < toMinutes(b.endTime) && toMinutes(b.startTime) < endMinute);
  }
  function updateTimeOptions() {
    const old = timeInput.value;
    const room = selectedRoom();
    const date = dateInput.value;
    const bookings = readBookings();
    timeInput.replaceChildren(new Option(room && isValidDate(date) ? "Select a time slot" : "Choose a room and date first", ""));
    if (!ROOMS[room] || !isValidDate(date) || date < localDateString()) {
      timeInput.disabled = true;
      updateSummary();
      return;
    }
    timeInput.disabled = false;
    for (let hour = 9; hour < 21; hour++) {
      const start = minuteToTime(hour*60);
      const end = minuteToTime((hour+1)*60);
      const booked = isTaken(bookings,room,date,start);
      const past = isPastSlot(date,start);
      const option = new Option(`${start}–${end}${booked ? " — Booked" : past ? " — Time passed" : ""}`,start);
      option.disabled = booked || past;
      timeInput.add(option);
    }
    if ([...timeInput.options].some(o => o.value === old && !o.disabled)) timeInput.value = old;
    updateSummary();
  }
  function updateSummary() {
    const room = ROOMS[selectedRoom()];
    const date = dateInput.value;
    const time = timeInput.value;
    const count = attendeeInput.value;
    // textContent is used for all student-entered values to avoid HTML injection.
    summary.textContent = room && isValidDate(date) && validSlot(time)
      ? `${room.name} · ${date} · ${time}–${minuteToTime(toMinutes(time)+60)}${count ? ` · ${count} attendees` : ""}`
      : "Choose a room and time to preview your booking.";
  }
  function validate() {
    clearErrors();
    let firstInvalid = null;
    function fail(field, message, element) {
      showError(field,message);
      if (!firstInvalid) firstInvalid = element || form.querySelector('input[name="room"]');
    }
    const roomId = selectedRoom();
    const room = ROOMS[roomId];
    const date = dateInput.value;
    const time = timeInput.value;
    const name = document.getElementById("student-name").value.trim();
    const email = document.getElementById("student-email").value.trim();
    const attendees = Number(attendeeInput.value);
    if (!room) fail("room","Please choose a discussion room.");
    if (!date) fail("date","Please choose a booking date.",dateInput);
    else if (!isValidDate(date) || date < localDateString()) fail("date","Choose today or a future date.",dateInput);
    if (!validSlot(time) || !date || !room) fail("time","Please choose a valid one-hour slot between 09:00 and 21:00.",timeInput);
    else if (isPastSlot(date,time)) fail("time","This time slot has already started. Choose a later slot.",timeInput);
    else if (isTaken(readBookings(),roomId,date,time)) fail("time","This room is already booked at that time. Choose another slot.",timeInput);
    if (!name) fail("name","Please enter your name.",document.getElementById("student-name"));
    if (!email) fail("email","Please enter your email address.",document.getElementById("student-email"));
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail("email","Enter a valid email address, such as name@example.com.",document.getElementById("student-email"));
    if (attendeeInput.value === "" || !Number.isInteger(attendees)) fail("attendees","Enter a whole number of attendees.",attendeeInput);
    else if (room && (attendees < room.min || attendees > room.max)) fail("attendees",`The ${room.name} allows ${room.min}–${room.max} students.`,attendeeInput);
    if (firstInvalid) { firstInvalid.focus(); return null; }
    return { roomId, roomName:room.name, date, startTime:time, endTime:minuteToTime(toMinutes(time)+60), name, email, attendees };
  }
  function renderBookings() {
    const bookings = readBookings().slice().sort((a,b) => (a.date+a.startTime).localeCompare(b.date+b.startTime));
    list.replaceChildren();
    if (!bookings.length) {
      const empty = document.createElement("p");
      empty.className = "booking-empty";
      empty.textContent = "No demo bookings saved in this browser yet.";
      list.append(empty);
      return;
    }
    bookings.forEach(b => {
      const article = document.createElement("article");
      article.className = "saved-booking card";
      const text = document.createElement("div");
      const heading = document.createElement("h3");
      heading.textContent = b.roomName || "Discussion Room";
      const info = document.createElement("p");
      info.textContent = `${b.date} · ${b.startTime}–${b.endTime} · ${b.attendees} students`;
      const ref = document.createElement("p");
      ref.className = "booking-reference";
      ref.textContent = `Reference: ${b.reference}`;
      text.append(heading,info,ref);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn btn-secondary";
      button.textContent = "Cancel Booking";
      button.setAttribute("aria-label",`Cancel booking ${b.reference} for ${b.roomName}`);
      button.addEventListener("click",() => {
        if (!window.confirm(`Cancel demo booking ${b.reference}? This will free the room and time slot.`)) return;
        const remaining = readBookings().filter(item => item.reference !== b.reference);
        if (!saveBookings(remaining)) return;
        renderBookings();
        updateTimeOptions();
      });
      article.append(text,button);
      list.append(article);
    });
  }
  function showConfirmation(booking) {
    const details = document.getElementById("confirmation-details");
    details.replaceChildren();
    const lines = [
      ["Booking reference",booking.reference],["Room",booking.roomName],["Date",booking.date],
      ["Time",`${booking.startTime}–${booking.endTime}`],["Attendees",String(booking.attendees)]
    ];
    lines.forEach(([label,value]) => {
      const row = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = `${label}: `;
      row.append(strong,document.createTextNode(value));
      details.append(row);
    });
    form.hidden = true;
    confirmation.hidden = false;
    confirmation.focus();
  }
  form.addEventListener("submit", event => {
    event.preventDefault();
    const booking = validate();
    if (!booking) return;
    // Read again immediately before saving to catch changes within this browser.
    const existing = readBookings();
    if (isTaken(existing,booking.roomId,booking.date,booking.startTime)) {
      showError("time","That slot was just booked. Please choose another.");
      updateTimeOptions();
      timeInput.focus();
      return;
    }
    booking.reference = `SL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;
    booking.createdAt = new Date().toISOString();
    if (!saveBookings([...existing,booking])) return;
    showConfirmation(booking);
    renderBookings();
  });
  document.getElementById("new-booking").addEventListener("click",() => {
    form.reset();
    clearErrors();
    confirmation.hidden = true;
    form.hidden = false;
    dateInput.min = localDateString();
    updateTimeOptions();
    form.querySelector('input[name="room"]').focus();
  });
  form.querySelectorAll('input[name="room"]').forEach(input => input.addEventListener("change",() => {
    const room = ROOMS[selectedRoom()];
    attendeeInput.min = room.min;
    attendeeInput.max = room.max;
    showError("room","");
    updateTimeOptions();
  }));
  dateInput.addEventListener("change",() => { showError("date",""); updateTimeOptions(); });
  timeInput.addEventListener("change",() => { showError("time",""); updateSummary(); });
  attendeeInput.addEventListener("input",updateSummary);
  dateInput.min = localDateString();
  updateTimeOptions();
  renderBookings();
})();
