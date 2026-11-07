/* StudyLatte Lo-Fi: one optional local audio track at a time. No autoplay. */
document.addEventListener('DOMContentLoaded', () => {
  const cards = [...document.querySelectorAll('.lofi-card')];
  if (!cards.length) return;
  const player = new Audio(); // Nothing loads or plays until a student presses Play.
  player.preload = 'none';
  let active = null;
  const update = () => cards.forEach(card => {
    const selected = card === active;
    const playing = selected && !player.paused;
    const button = card.querySelector('.lofi-play');
    button.textContent = playing ? 'Pause' : 'Play';
    button.setAttribute('aria-pressed', String(playing));
    button.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} ${card.querySelector('h3').textContent}`);
    card.classList.toggle('is-playing', playing);
    card.querySelector('.lofi-current').hidden = !playing;
    if (selected && playing) card.querySelector('.lofi-status').textContent = 'Playing';
    else if (selected && player.paused && player.currentTime > 0) card.querySelector('.lofi-status').textContent = 'Paused';
  });
  const unavailable = card => {
    player.pause();
    player.removeAttribute('src');
    player.load();
    active = null;
    card.querySelector('.lofi-status').textContent = 'Audio could not be played. Please check the local MP3 file.';
    update();
  };
  cards.forEach(card => {
    const button = card.querySelector('.lofi-play');
    const volume = card.querySelector('.lofi-volume');
    volume.addEventListener('input', () => { if (active === card) player.volume = Number(volume.value) / 100; });
    button.addEventListener('click', async () => {
      if (active === card && !player.paused) { player.pause(); update(); return; }
      if (active !== card) {
        player.pause();
        active = card;
        player.src = card.dataset.src;
        player.volume = Number(volume.value) / 100;
        cards.forEach(other => { if (other !== card) other.querySelector('.lofi-status').textContent = 'Not playing'; });
      }
      try { await player.play(); update(); }
      catch (error) { if (active === card) unavailable(card); }
    });
  });
  player.addEventListener('ended', () => { if (active) active.querySelector('.lofi-status').textContent = 'Track finished'; active = null; update(); });
  player.addEventListener('error', () => { if (active) unavailable(active); });
  player.addEventListener('pause', update);
  player.addEventListener('play', update);
});
