let searchInstance = null;

/**
 * Creates and manages the search modal
 * @param {Function} onSearch - Callback function that receives the search query
 * @returns {Object} Controls the search modal
 *
 * @description
 * Creates a search modal overlay that can be triggered by clicking the search icon.
 * When a search is performed, it calls the onSearch callback with the query.
 * Clicking outside or pressing ESC closes the modal.
 */
export function initializeSearch(onSearch) {
  // Remove any existing modal
  const existingModal = document.querySelector('[data-modal="search"]');
  if (existingModal) {
    existingModal.remove();
  }

  const overlay = document.createElement('div');
  overlay.setAttribute('data-modal', 'search');
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', 'Search auctions');
  overlay.className =
    'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm';
  overlay.style.display = 'none';

  const modal = document.createElement('div');
  modal.className =
    'flex flex-col w-full max-w-md gap-4 p-6 mx-4 bg-white rounded-lg shadow-xl';

  const title = document.createElement('h2');
  title.className = 'text-xl font-semibold text-blue-slate-900 font-display';
  title.textContent = 'Search Auctions';
  modal.appendChild(title);

  const form = document.createElement('form');
  form.className = 'flex flex-col gap-4';

  const inputGroup = document.createElement('div');
  inputGroup.className = 'flex flex-col gap-2';

  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'search-input';
  input.placeholder = 'Search...';
  input.setAttribute('aria-label', 'Search query');
  input.className =
    'p-3 border rounded-lg border-cool-steel-300 text-blue-slate-900 focus:outline-none focus:border-blue-slate-500 focus:ring-2 focus:ring-blue-slate-200';
  input.required = true;
  inputGroup.appendChild(input);

  form.appendChild(inputGroup);

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'flex gap-3 mt-2';

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.className =
    'flex-1 px-4 py-2 font-semibold transition-all border rounded-lg text-blue-slate-700 border-cool-steel-300 hover:bg-cool-steel-50';
  cancelButton.textContent = 'Cancel';
  cancelButton.setAttribute('aria-label', 'Cancel search');
  buttonContainer.appendChild(cancelButton);

  const searchButton = document.createElement('button');
  searchButton.type = 'submit';
  searchButton.className =
    'flex-1 px-4 py-2 font-semibold text-white transition-all rounded-lg bg-blue-slate-600 hover:bg-blue-slate-700 disabled:opacity-50 disabled:cursor-not-allowed';
  searchButton.textContent = 'Search';
  searchButton.setAttribute('aria-label', 'Search');
  buttonContainer.appendChild(searchButton);

  form.appendChild(buttonContainer);
  modal.appendChild(form);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  function openSearch() {
    overlay.style.display = 'flex';
    input.focus();
    searchButton.disabled = false;
    searchButton.textContent = 'Search';
  }

  function closeSearch() {
    overlay.style.display = 'none';
    input.value = '';
    searchButton.disabled = false;
    searchButton.textContent = 'Search';
  }

  function performSearch() {
    const query = input.value.trim();

    if (query && onSearch) {
      searchButton.disabled = true;
      searchButton.textContent = 'Searching...';

      onSearch(query);
    }
  }

  cancelButton.addEventListener('click', closeSearch);

  searchButton.addEventListener('click', performSearch);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    performSearch();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeSearch();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.style.display === 'flex') {
      closeSearch();
    }
  });

  searchInstance = {
    open: openSearch,
    close: closeSearch,
  };

  return searchInstance;
}

/**
 * Opens the search overlay
 * Must call initializeSearch first
 */
export function openSearch() {
  if (searchInstance) {
    searchInstance.open();
  }
}
