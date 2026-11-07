/* StudyLatte Pomodoro: a simple two-mode timer. No accounts or analytics. */
(() => {
  'use strict';
  const durations = { focus: 25 * 60, break: 5 * 60 };
  const display = document.getElementById('timer-display');
  if (!display) return;

  const focusButton = document.getElementById('focus-mode');
  const breakButton = document.getElementById('break-mode');
  const startButton = document.getElementById('timer-start');
  const pauseButton = document.getElementById('timer-pause');
  const resetButton = document.getElementById('timer-reset');
  const nextButton = document.getElementById('timer-next');
  const modeLabel = document.getElementById('timer-mode-label');
  const stateLabel = document.getElementById('timer-state');
  const completion = document.getElementById('timer-completion');
  const clock = document.getElementById('timer-clock');

  let mode = 'focus';
  let remaining = durations.focus;
  let intervalId = null;
  let deadline = null;
  let finished = false;

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
  }

  function stopInterval() {
    if (intervalId !== null) clearInterval(intervalId);
    intervalId = null;
    deadline = null;
  }

  function render() {
    display.textContent = formatTime(remaining);
    modeLabel.textContent = mode === 'focus' ? 'FOCUS TIME' : 'BREAK TIME';
    focusButton.classList.toggle('is-selected', mode === 'focus');
    breakButton.classList.toggle('is-selected', mode === 'break');
    focusButton.setAttribute('aria-pressed', String(mode === 'focus'));
    breakButton.setAttribute('aria-pressed', String(mode === 'break'));
    clock.classList.toggle('is-break', mode === 'break');
    const fraction = remaining / durations[mode];
    clock.style.setProperty('--timer-progress', `${Math.max(0, fraction) * 100}%`);
    const running = intervalId !== null;
    startButton.disabled = running || finished;
    pauseButton.disabled = !running;
    startButton.textContent = remaining < durations[mode] && !finished ? 'Resume' : 'Start';
  }

  function complete() {
    stopInterval();
    remaining = 0;
    finished = true;
    stateLabel.textContent = mode === 'focus' ? 'Focus session complete!' : 'Break complete!';
    completion.textContent = mode === 'focus'
      ? 'Great work. Take a moment to recharge before your next session.'
      : 'You are ready for another focus session.';
    completion.hidden = false;
    nextButton.textContent = mode === 'focus' ? 'Start break' : 'Start focus';
    nextButton.hidden = false;
    render();
  }

  // Date.now() prevents drift when the browser throttles background tabs.
  function tick() {
    remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    if (remaining === 0) complete();
    else render();
  }

  function start() {
    if (intervalId !== null || finished) return; // Only one timer may run.
    deadline = Date.now() + remaining * 1000;
    intervalId = window.setInterval(tick, 200);
    stateLabel.textContent = mode === 'focus' ? 'Stay with your task.' : 'Enjoy your break.';
    render();
  }

  function pause() {
    if (intervalId === null) return;
    tick(); // Calculate elapsed time before pausing.
    if (intervalId === null) return; // It might have completed during tick().
    stopInterval();
    stateLabel.textContent = 'Paused. Resume whenever you are ready.';
    render();
  }

  function switchMode(nextMode) {
    stopInterval();
    mode = nextMode;
    remaining = durations[mode];
    finished = false;
    completion.hidden = true;
    nextButton.hidden = true;
    stateLabel.textContent = mode === 'focus' ? 'Ready when you are.' : 'Time to recharge.';
    render();
  }

  focusButton.addEventListener('click', () => switchMode('focus'));
  breakButton.addEventListener('click', () => switchMode('break'));
  startButton.addEventListener('click', start);
  pauseButton.addEventListener('click', pause);
  resetButton.addEventListener('click', () => switchMode(mode));
  nextButton.addEventListener('click', () => { switchMode(mode === 'focus' ? 'break' : 'focus'); start(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && intervalId !== null) tick(); });
  render();
})();
