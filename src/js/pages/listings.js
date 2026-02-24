import { getListings } from '../api/listings.js';
import { initializePage } from '../utils/main.js';
import { createListingCard } from '../components/listingCard.js';
import { createLoader } from '../components/loader.js';
import { createBackButton } from '../components/backButton.js';

initializePage();

let currentPage = 1;
let currentSort = 'created';
let currentSortOrder = 'desc'; // Default: Newest First (so far, might change)

/**
 * Displays the listings feed on the listings page
 * @param {number} page - Page number to load
 * @returns {Promise<void>}
 */
async function displayListingsFeed(page = 1) {
  try {
    const main = document.querySelector('main');

    if (!main) {
      console.error('Main element not found');
      return;
    }

    const existingFeed = main.querySelector('.listings-feed');
    if (existingFeed) {
      existingFeed.remove();
    }

    const existingBackButton = main.querySelector(
      'button[aria-label="Go back to previous page"]'
    );
    if (existingBackButton) {
      existingBackButton.remove();
    }

    const feedContainer = document.createElement('div');
    feedContainer.className =
      'listings-feed max-w-[1200px] mx-auto px-[10%] py-8 md:px-4';

    const headerContainer = document.createElement('div');
    headerContainer.className = 'flex items-center justify-between mb-6';

    const backButton = createBackButton();
    headerContainer.appendChild(backButton);

    const heading = document.createElement('h1');
    heading.className =
      'flex-1 text-3xl font-semibold text-center text-blue-slate-700 font-display';
    heading.textContent = 'All Auctions';
    headerContainer.appendChild(heading);

    const spacer = document.createElement('div');
    spacer.className = 'w-10';
    headerContainer.appendChild(spacer);

    feedContainer.appendChild(headerContainer);

    // --------------------------------------------------------------------Sorting dropdown
    const sortContainer = document.createElement('div');
    sortContainer.className = 'flex items-center justify-end gap-3 mb-6';

    const sortLabel = document.createElement('label');
    sortLabel.htmlFor = 'sort-select';
    sortLabel.className = 'text-sm font-semibold text-blue-slate-900';
    sortLabel.textContent = 'Sort by:';
    sortContainer.appendChild(sortLabel);

    const sortSelect = document.createElement('select');
    sortSelect.id = 'sort-select';
    sortSelect.className =
      'p-2 pr-8 border rounded-lg border-cool-steel-300 text-blue-slate-900 bg-white cursor-pointer focus:outline-none focus:border-blue-slate-500 focus:ring-2 focus:ring-blue-slate-200';

    const sortOptions = [
      { value: 'created-desc', label: 'Newest First' },
      { value: 'created-asc', label: 'Oldest First' },
      { value: 'endsAt-asc', label: 'Ending Soon' },
      { value: 'endsAt-desc', label: 'Ending Later' },
      { value: 'price-asc', label: 'Price: Low to High' },
      { value: 'price-desc', label: 'Price: High to Low' },
    ];

    sortOptions.forEach((option) => {
      const optionEl = document.createElement('option');
      optionEl.value = option.value;
      optionEl.textContent = option.label;
      if (option.value === `${currentSort}-${currentSortOrder}`) {
        optionEl.selected = true;
      }
      sortSelect.appendChild(optionEl);
    });

    sortSelect.addEventListener('change', (e) => {
      const [sort, sortOrder] = e.target.value.split('-');
      currentSort = sort;
      currentSortOrder = sortOrder;
      currentPage = 1; // Reset to first page
      displayListingsFeed(1);
    });

    sortContainer.appendChild(sortSelect);
    feedContainer.appendChild(sortContainer);

    const loader = createLoader('Loading auctions...');
    feedContainer.appendChild(loader);
    main.appendChild(feedContainer);

    // -------------------------------For price sorting, we don't pass it to API (we'll sort client-side because i dont know how else to make it work)
    const apiSort = currentSort === 'price' ? 'created' : currentSort;
    const apiSortOrder = currentSort === 'price' ? 'desc' : currentSortOrder;

    const response = await getListings(
      12,
      page,
      '',
      true,
      apiSort,
      apiSortOrder
    );

    loader.remove();

    if (!response.data || response.data.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className =
        'flex flex-col items-center gap-8 max-w-[300px] mx-auto text-center py-12 px-4 text-cool-steel-600';
      emptyMessage.textContent = 'No auctions found';
      feedContainer.appendChild(emptyMessage);
      return;
    }

    let listings = response.data;

    // Client-side sorting for price (Got help from fullstack friend here also. These math functions dont work in my head)
    if (currentSort === 'price') {
      listings = listings.sort((a, b) => {
        const aBids = a.bids || [];
        const bBids = b.bids || [];
        const aHighestBid =
          aBids.length > 0 ? Math.max(...aBids.map((bid) => bid.amount)) : 0;
        const bHighestBid =
          bBids.length > 0 ? Math.max(...bBids.map((bid) => bid.amount)) : 0;

        if (currentSortOrder === 'asc') {
          return aHighestBid - bHighestBid;
        } else {
          return bHighestBid - aHighestBid;
        }
      });
    }

    const grid = document.createElement('div');
    grid.className =
      'grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-3';

    listings.forEach((listing) => {
      const listingCard = createListingCard(listing);
      grid.appendChild(listingCard);
    });

    feedContainer.appendChild(grid);

    const meta = response.meta;
    if (meta && (meta.isFirstPage === false || meta.isLastPage === false)) {
      const paginationContainer = document.createElement('div');
      paginationContainer.className =
        'flex items-center justify-center gap-4 px-0 py-8 mt-12';

      const hasPrevPage = meta.isFirstPage === false;
      const hasNextPage = meta.isLastPage === false;

      if (hasPrevPage) {
        const prevBtn = document.createElement('button');
        prevBtn.className =
          'bg-blue-slate-600 text-white border-none py-3 px-6 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 ease-in-out hover:bg-blue-slate-700 hover:-translate-y-0.5 active:translate-y-0 w-28';
        prevBtn.textContent = 'Previous';
        prevBtn.addEventListener('click', () => {
          currentPage--;
          displayListingsFeed(currentPage);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        paginationContainer.appendChild(prevBtn);
      } else {
        const spacer = document.createElement('div');
        spacer.className = 'w-28';
        paginationContainer.appendChild(spacer);
      }

      const pageInfo = document.createElement('span');
      pageInfo.className = 'text-base font-medium text-blue-slate-900';
      pageInfo.textContent = `Page ${meta.currentPage} of ${meta.pageCount}`;
      paginationContainer.appendChild(pageInfo);

      if (hasNextPage) {
        const nextBtn = document.createElement('button');
        nextBtn.className =
          'bg-blue-slate-600 text-white border-none py-3 px-6 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 ease-in-out hover:bg-blue-slate-700 hover:-translate-y-0.5 active:translate-y-0 w-28';
        nextBtn.textContent = 'Next';
        nextBtn.addEventListener('click', () => {
          currentPage++;
          displayListingsFeed(currentPage);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        paginationContainer.appendChild(nextBtn);
      } else {
        const spacer = document.createElement('div');
        spacer.className = 'w-28';
        paginationContainer.appendChild(spacer);
      }

      feedContainer.appendChild(paginationContainer);
    }
  } catch (error) {
    console.error('Error displaying listings feed:', error);

    const main = document.querySelector('main');
    if (main) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'px-4 py-12 text-center text-petal-frost-600';
      errorDiv.textContent = 'Failed to load auctions. Please try again later.';
      main.appendChild(errorDiv);
    }
  }
}

displayListingsFeed();
