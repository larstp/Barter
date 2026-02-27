import { getListings } from '../api/listings.js';
import { initializePage } from '../utils/main.js';
import { createListingCard } from '../components/listingCard.js';
import { createLoader } from '../components/loader.js';
import { createBackButton } from '../components/backButton.js';
import { PAGINATION_LIMITS } from '../utils/constants.js';

initializePage();

let currentPage = 1;
let currentSort = 'created';
let currentSortOrder = 'desc'; // Default: Newest First (so far, might change)
let currentTag = ''; // Filter by tag
let searchQuery = '';

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

    // ---------------------------------------------------Get search query from URL if there
    const urlParams = new URLSearchParams(window.location.search);
    searchQuery = urlParams.get('search') || '';

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

    if (searchQuery) {
      heading.textContent = `Search: "${searchQuery}"`;
    } else {
      heading.textContent = 'All Auctions';
    }

    headerContainer.appendChild(heading);

    // Add clear search button or spacer or whatever
    if (searchQuery) {
      const clearButton = document.createElement('button');
      clearButton.className =
        'px-3 py-1 text-sm font-semibold transition-all border rounded-lg text-blue-slate-700 border-blue-slate-300 hover:bg-blue-slate-50';
      clearButton.textContent = 'Clear';
      clearButton.addEventListener('click', () => {
        window.location.href = '/src/pages/listings.html';
      });
      headerContainer.appendChild(clearButton);
    } else {
      const spacer = document.createElement('div');
      spacer.className = 'w-10';
      headerContainer.appendChild(spacer);
    }

    feedContainer.appendChild(headerContainer);

    // --------------------------------------------------------------------Tag and Sorting dropdowns
    const sortContainer = document.createElement('div');
    sortContainer.className =
      'flex flex-wrap items-center justify-between gap-4 mb-6';
    const tagFilterContainer = document.createElement('div');
    tagFilterContainer.className = 'flex items-center gap-3';

    const tagLabel = document.createElement('label');
    tagLabel.htmlFor = 'tag-select';
    tagLabel.className = 'font-sans text-sm font-semibold text-blue-slate-900';
    tagLabel.textContent = 'Filter by tags:';
    tagFilterContainer.appendChild(tagLabel);

    const tagSelect = document.createElement('select');
    tagSelect.id = 'tag-select';
    tagSelect.className =
      'p-2 pr-8 font-sans bg-white border rounded-lg cursor-pointer border-cool-steel-300 text-blue-slate-900 focus:outline-none focus:border-blue-slate-500 focus:ring-2 focus:ring-blue-slate-200';

    const allTagsOption = document.createElement('option');
    allTagsOption.value = '';
    allTagsOption.textContent = 'All Tags';
    tagSelect.appendChild(allTagsOption);

    tagSelect.addEventListener('change', (e) => {
      currentTag = e.target.value;
      currentPage = 1;
      displayListingsFeed(1);
    });

    tagFilterContainer.appendChild(tagSelect);
    sortContainer.appendChild(tagFilterContainer);

    const sortFilterContainer = document.createElement('div');
    sortFilterContainer.className = 'flex items-center gap-3';

    const sortLabel = document.createElement('label');
    sortLabel.htmlFor = 'sort-select';
    sortLabel.className = 'font-sans text-sm font-semibold text-blue-slate-900';
    sortLabel.textContent = 'Sort by:';
    sortFilterContainer.appendChild(sortLabel);

    const sortSelect = document.createElement('select');
    sortSelect.id = 'sort-select';
    sortSelect.className =
      'p-2 pr-8 font-sans bg-white border rounded-lg cursor-pointer border-cool-steel-300 text-blue-slate-900 focus:outline-none focus:border-blue-slate-500 focus:ring-2 focus:ring-blue-slate-200';

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

    sortFilterContainer.appendChild(sortSelect);
    sortContainer.appendChild(sortFilterContainer);
    feedContainer.appendChild(sortContainer);

    const loader = createLoader('Loading auctions...');
    feedContainer.appendChild(loader);
    main.appendChild(feedContainer);

    // -------------------------------For price sorting, we don't pass it to API (we'll sort client-side because i dont know how else to make it work)
    const apiSort = currentSort === 'price' ? 'created' : currentSort;
    const apiSortOrder = currentSort === 'price' ? 'desc' : currentSortOrder;

    // When searching, fetch more listings to search through
    const limit = searchQuery
      ? PAGINATION_LIMITS.SEARCH
      : PAGINATION_LIMITS.DEFAULT; // --- MUCH easier

    const response = await getListings(
      limit,
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

    const tagCounts = {};
    listings.forEach((listing) => {
      if (listing.tags && listing.tags.length > 0) {
        listing.tags.forEach((tag) => {
          if (tag) {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          }
        });
      }
    });

    const sortedTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);

    if (tagSelect.options.length === 1) {
      // ugh this thing is killing me
      sortedTags.forEach((tag) => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        if (tag === currentTag) {
          option.selected = true;
        }
        tagSelect.appendChild(option);
      });
    }

    if (currentTag) {
      listings = listings.filter(
        (listing) => listing.tags && listing.tags.includes(currentTag)
      );

      if (listings.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className =
          'flex flex-col items-center gap-4 max-w-[400px] mx-auto text-center py-12 px-4 text-cool-steel-600';

        const message = document.createElement('p');
        message.textContent = `No auctions found with tag "${currentTag}"`;
        emptyMessage.appendChild(message);

        const clearButton = document.createElement('button');
        clearButton.className =
          'px-4 py-2 font-semibold text-white transition-all rounded-lg bg-blue-slate-600 hover:bg-blue-slate-700';
        clearButton.textContent = 'Clear Filter';
        clearButton.addEventListener('click', () => {
          currentTag = '';
          displayListingsFeed(1);
        });
        emptyMessage.appendChild(clearButton);

        feedContainer.appendChild(emptyMessage);
        return;
      }
    }

    // -------------------------------------------------------------- title and tag filtering
    if (searchQuery) {
      listings = listings.filter((listing) => {
        const title = listing.title || '';
        const tags = listing.tags || [];
        const searchLower = searchQuery.toLowerCase();

        const titleMatch = title.toLowerCase().includes(searchLower);
        const tagMatch = tags.some((tag) =>
          tag.toLowerCase().includes(searchLower)
        );

        return titleMatch || tagMatch;
      });

      if (listings.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className =
          'flex flex-col items-center gap-4 max-w-[400px] mx-auto text-center py-12 px-4 text-cool-steel-600';

        const message = document.createElement('p');
        message.textContent = `No auctions found matching "${searchQuery}"`;
        emptyMessage.appendChild(message);

        const clearButton = document.createElement('button');
        clearButton.className =
          'px-4 py-2 font-semibold text-white transition-all rounded-lg bg-blue-slate-600 hover:bg-blue-slate-700';
        clearButton.textContent = 'Clear Search';
        clearButton.addEventListener('click', () => {
          window.location.href = '/src/pages/listings.html';
        });
        emptyMessage.appendChild(clearButton);

        feedContainer.appendChild(emptyMessage);
        return;
      }
    }

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

    // Only show pagination when not searching
    const meta = response.meta;
    if (
      !searchQuery &&
      meta &&
      (meta.isFirstPage === false || meta.isLastPage === false)
    ) {
      const paginationContainer = document.createElement('div');
      paginationContainer.className =
        'flex items-center justify-center gap-4 px-0 py-8 mt-12';

      const hasPrevPage = meta.isFirstPage === false;
      const hasNextPage = meta.isLastPage === false;

      if (hasPrevPage) {
        // making this work with the icon is proving to be a pain. im using hours on this..
        const prevBtn = document.createElement('button');
        prevBtn.className =
          'relative flex items-center justify-center w-8 h-8 transition-transform duration-200 ease-in-out cursor-pointer hover:scale-110 group';
        prevBtn.setAttribute('aria-label', 'Previous page');

        const prevOutlineArrow = document.createElement('img');
        prevOutlineArrow.src =
          '../../public/icons/flowbite_arrow-right-alt-outline.svg';
        prevOutlineArrow.alt = 'Previous';
        prevOutlineArrow.className = 'w-8 h-8 group-hover:hidden';

        const prevSolidArrow = document.createElement('img');
        prevSolidArrow.src =
          '../../public/icons/flowbite_arrow-right-alt-solid.svg';
        prevSolidArrow.alt = 'Previous';
        prevSolidArrow.className =
          'absolute inset-0 hidden w-8 h-8 group-hover:block';

        prevBtn.appendChild(prevOutlineArrow);
        prevBtn.appendChild(prevSolidArrow);

        prevBtn.addEventListener('click', () => {
          currentPage--;
          displayListingsFeed(currentPage);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        paginationContainer.appendChild(prevBtn);
      } else {
        const spacer = document.createElement('div');
        spacer.className = 'w-8';
        paginationContainer.appendChild(spacer);
      }

      const pageInfo = document.createElement('span');
      pageInfo.className = 'text-base font-medium text-blue-slate-900';
      pageInfo.textContent = `Page ${meta.currentPage} of ${meta.pageCount}`;
      paginationContainer.appendChild(pageInfo);

      if (hasNextPage) {
        const nextBtn = document.createElement('button');
        nextBtn.className =
          'relative flex items-center justify-center w-8 h-8 transition-transform duration-200 ease-in-out cursor-pointer hover:scale-110 group';
        nextBtn.setAttribute('aria-label', 'Next page');

        const nextOutlineArrow = document.createElement('img');
        nextOutlineArrow.src =
          '../../public/icons/flowbite_arrow-right-alt-outline-1.svg';
        nextOutlineArrow.alt = 'Next';
        nextOutlineArrow.className = 'w-8 h-8 group-hover:hidden';

        const nextSolidArrow = document.createElement('img');
        nextSolidArrow.src =
          '../../public/icons/flowbite_arrow-right-alt-solid-1.svg';
        nextSolidArrow.alt = 'Next';
        nextSolidArrow.className =
          'absolute inset-0 hidden w-8 h-8 group-hover:block';

        nextBtn.appendChild(nextOutlineArrow);
        nextBtn.appendChild(nextSolidArrow);

        nextBtn.addEventListener('click', () => {
          currentPage++;
          displayListingsFeed(currentPage);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        paginationContainer.appendChild(nextBtn);
      } else {
        const spacer = document.createElement('div');
        spacer.className = 'w-8';
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
