const query = document.querySelector('#query');
const results = document.querySelector('#results');
const resultTitle = document.querySelector('#result-title');
const resultCount = document.querySelector('#result-count');
const correction = document.querySelector('#correction');
const clearButton = document.querySelector('#clear');
const searchForm = document.querySelector('#search-form');
let searchMode = false;
let latestRequest = 0;

async function load(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json();
}

function showMessage(title, message, detail) {
  resultCount.textContent = 'Unavailable';
  results.replaceChildren();
  const empty = document.createElement('div');
  empty.className = 'empty';
  const symbol = document.createElement('span');
  symbol.className = 'empty-symbol';
  symbol.setAttribute('aria-hidden', 'true');
  symbol.textContent = '!';
  const heading = document.createElement('p');
  heading.textContent = message;
  const hint = document.createElement('small');
  hint.textContent = detail;
  empty.append(symbol, heading, hint);
  results.append(empty);
  resultTitle.textContent = title;
}

function render(items) {
  const list = Array.isArray(items) ? items : [];
  resultCount.textContent = `${list.length} match${list.length === 1 ? '' : 'es'}`;
  results.replaceChildren();

  if (!list.length) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    const symbol = document.createElement('span');
    symbol.className = 'empty-symbol';
    symbol.setAttribute('aria-hidden', 'true');
    symbol.textContent = '⌕';
    const heading = document.createElement('p');
    heading.textContent = 'No matching resources yet';
    const hint = document.createElement('small');
    hint.textContent = 'Try another search or choose one of the popular terms.';
    empty.append(symbol, heading, hint);
    results.append(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  list.forEach((item, index) => {
    const article = document.createElement('article');
    article.className = 'result';
    article.style.animationDelay = `${Math.min(index * 35, 210)}ms`;
    const details = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'result-name';
    name.textContent = item.word ?? 'Untitled resource';
    const category = document.createElement('div');
    category.className = 'result-meta';
    category.textContent = item.category ?? 'Resource';
    details.append(name, category);
    const score = document.createElement('span');
    score.className = 'score';
    score.textContent = `${item.popularity ?? 0}% relevance`;
    article.append(details, score);
    fragment.append(article);
  });
  results.append(fragment);
}

async function update() {
  const requestId = ++latestRequest;
  const value = query.value.trim();
  clearButton.hidden = !value;
  correction.hidden = true;
  results.setAttribute('aria-busy', 'true');

  try {
    if (!value) {
      searchMode = false;
      resultTitle.textContent = 'Suggestions';
      const data = await load('api/suggestions?q=');
      if (requestId === latestRequest) render(data.suggestions);
      return;
    }

    const encoded = encodeURIComponent(value);
    const suggestions = await load(`api/suggestions?q=${encoded}`);
    if (requestId !== latestRequest) return;

    if (searchMode) {
      resultTitle.textContent = 'Search results';
      const data = await load(`api/search?q=${encoded}`);
      if (requestId === latestRequest) render(data.results);
    } else {
      resultTitle.textContent = 'Suggestions';
      render(suggestions.suggestions);
    }

    const fix = await load(`api/autocorrect?q=${encoded}`);
    if (requestId === latestRequest && fix.correction && fix.correction.toLowerCase() !== value.toLowerCase()) {
      correction.replaceChildren();
      correction.append(document.createTextNode('Did you mean '));
      const choice = document.createElement('strong');
      choice.textContent = `${fix.correction}?`;
      choice.setAttribute('role', 'button');
      choice.setAttribute('tabindex', '0');
      choice.setAttribute('aria-label', `Search for ${fix.correction}`);
      choice.addEventListener('click', () => useCorrection(fix.correction));
      choice.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          useCorrection(fix.correction);
        }
      });
      correction.append(choice);
      correction.hidden = false;
    }
  } catch {
    if (requestId === latestRequest) {
      showMessage('Search unavailable', 'Atlas could not reach the search service', 'Please try again in a moment.');
    }
  } finally {
    if (requestId === latestRequest) results.setAttribute('aria-busy', 'false');
  }
}

function useCorrection(value) {
  searchMode = false;
  query.value = value;
  update();
  query.focus();
}

query.addEventListener('input', () => {
  searchMode = false;
  update();
});
searchForm.addEventListener('submit', event => {
  event.preventDefault();
  searchMode = true;
  update();
});
clearButton.addEventListener('click', () => {
  searchMode = false;
  query.value = '';
  update();
  query.focus();
});
document.querySelectorAll('[data-query]').forEach(button => button.addEventListener('click', () => {
  searchMode = false;
  query.value = button.dataset.query;
  update();
  query.focus();
}));

const environmentStatus = document.querySelector('#environment-status');
const environmentDot = document.querySelector('.environment-dot');
load('api/stats')
  .then(data => {
    document.querySelector('#word-count').textContent = data.words ?? '—';
    environmentStatus.textContent = 'Index online';
  })
  .catch(() => {
    document.querySelector('#word-count').textContent = '—';
    environmentStatus.textContent = 'Index unavailable';
    environmentDot.classList.add('is-offline');
  });
