/* StudyLatte free e-library: local search and category filters, no backend. */
(() => {
  'use strict';
  const search = document.getElementById('library-search');
  const grid = document.getElementById('library-grid');
  if (!search || !grid) return;
  const filters = Array.from(document.querySelectorAll('.library-filter'));
  const count = document.getElementById('library-count');
  const empty = document.getElementById('library-empty');
  const clear = document.getElementById('library-clear');
  const resources = window.studyLatteResources || [];
  let category = 'All';

  function makeCard(resource) {
    const card = document.createElement('article');
    card.className = 'library-card card';
    const label = document.createElement('span');
    label.className = 'library-card-category';
    label.textContent = resource.category;
    const title = document.createElement('h3');
    title.textContent = resource.title;
    const author = document.createElement('p');
    author.className = 'library-card-author';
    author.textContent = resource.author;
    const description = document.createElement('p');
    description.className = 'library-card-description';
    description.textContent = resource.description;
    const bottom = document.createElement('div');
    bottom.className = 'library-card-bottom';
    const source = document.createElement('span');
    source.className = 'library-card-source';
    source.textContent = `Source: ${resource.source}`;
    const link = document.createElement('a');
    link.className = 'btn btn-secondary';
    link.href = resource.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Open Resource ↗';
    link.setAttribute('aria-label', `Open ${resource.title} on ${resource.source} (new tab)`);
    bottom.append(source, link);
    card.append(label, title, author, description, bottom);
    return card;
  }

  function render() {
    const term = search.value.trim().toLocaleLowerCase();
    const matches = resources.filter(resource => {
      const categoryMatches = category === 'All' || resource.category === category;
      const searchable = `${resource.title} ${resource.author} ${resource.source}`.toLocaleLowerCase();
      return categoryMatches && searchable.includes(term);
    });
    // Replace cards without inserting external text as HTML.
    grid.replaceChildren(...matches.map(makeCard));
    count.textContent = `${matches.length} resource${matches.length === 1 ? '' : 's'} found`;
    empty.hidden = matches.length !== 0;
  }

  function chooseCategory(next) {
    category = next;
    filters.forEach(button => {
      const selected = button.dataset.category === category;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    render();
  }

  filters.forEach(button => button.addEventListener('click', () => chooseCategory(button.dataset.category)));
  search.addEventListener('input', render);
  clear.addEventListener('click', () => { search.value = ''; chooseCategory('All'); search.focus(); });
  render();
})();
