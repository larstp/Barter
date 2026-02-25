import { calculateTimeRemaining } from '../utils/helpers.js';

/**
 * Creates a listing card element for display in grids/feeds
 * @param {Object} listing - The listing data from the API
 * @param {string} listing.id - Listing ID
 * @param {string} listing.title - Listing title
 * @param {string} [listing.description] - Listing description
 * @param {Object} [listing.media] - Listing media object
 * @param {Object} [listing.seller] - Seller/author object
 * @param {Array} [listing.bids] - Array of bids
 * @param {string} listing.endsAt - Auction end date/time
 * @param {string} listing.created - Listing creation date
 * @returns {HTMLElement} The listing card element
 *
 * @description
 * Creates a clickable listing card with:
 * - Featured image (if available)
 * - Listing title
 * - Seller info with avatar
 * - Time remaining countdown
 * - Current bid and bid count
 * - "See Details" link
 *
 * @example
 * const listingElement = createListingCard(listingData);
 * container.appendChild(listingElement);
 */
export function createListingCard(listing) {
  try {
    const isRootPage = !window.location.pathname.includes('/src/pages/');
    const prefix = isRootPage ? '.' : '../..';

    const article = document.createElement('article');
    article.className =
      'flex flex-col overflow-hidden transition-all duration-300 ease-in-out bg-white rounded-lg shadow-lg hover:bg-cool-steel-100 hover:shadow-xl hover:scale-[1.02]';
    article.setAttribute('data-listing-id', listing.id);

    const header = document.createElement('div');
    header.className = 'flex items-center justify-between p-4 pb-2';

    if (listing.seller) {
      const sellerContainer = document.createElement('div');
      sellerContainer.className = 'flex items-center gap-3';

      if (listing.seller.avatar?.url) {
        const avatarLink = document.createElement('a');
        avatarLink.href = `${prefix}/src/pages/user.html?name=${listing.seller.name}`;
        avatarLink.setAttribute(
          'aria-label',
          `View ${listing.seller.name}'s profile`
        );

        const avatar = document.createElement('img');
        avatar.src = listing.seller.avatar.url;
        avatar.alt =
          listing.seller.avatar.alt || `${listing.seller.name}'s avatar`;
        avatar.className = 'object-cover w-10 h-10 rounded-full';
        avatarLink.appendChild(avatar);

        sellerContainer.appendChild(avatarLink);
      }

      const sellerName = document.createElement('a');
      sellerName.href = `${prefix}/src/pages/user.html?name=${listing.seller.name}`;
      sellerName.className =
        'font-semibold no-underline transition-colors duration-300 text-blue-slate-900 hover:text-blue-slate-700';
      sellerName.textContent = listing.seller.name;
      sellerName.setAttribute(
        'aria-label',
        `View ${listing.seller.name}'s profile`
      );
      sellerContainer.appendChild(sellerName);

      header.appendChild(sellerContainer);
    }

    const date = document.createElement('time');
    date.className = 'text-sm text-cool-steel-600';
    date.setAttribute('datetime', listing.created);
    const listingDate = new Date(listing.created);
    date.textContent = listingDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    header.appendChild(date);

    article.appendChild(header);

    const listingLink = document.createElement('a');
    listingLink.href = `${prefix}/src/pages/listing-detail.html?id=${listing.id}`;
    listingLink.className = 'flex-1 block no-underline';
    listingLink.setAttribute('aria-label', `View listing: ${listing.title}`);

    if (listing.media && listing.media.length > 0 && listing.media[0]?.url) {
      const mediaContainer = document.createElement('div');
      mediaContainer.className =
        'w-full h-48 overflow-hidden bg-cool-steel-100';

      const img = document.createElement('img');
      img.src = listing.media[0].url;
      img.alt = listing.media[0].alt || listing.title;
      img.className = 'object-cover w-full h-full';
      img.loading = 'lazy';

      mediaContainer.appendChild(img);
      listingLink.appendChild(mediaContainer);
    } else {
      const placeholder = document.createElement('div');
      placeholder.className =
        'flex items-center justify-center w-full h-48 bg-cool-steel-100';

      const placeholderText = document.createElement('span');
      placeholderText.className = 'text-sm text-cool-steel-400';
      placeholderText.textContent = 'No image available';
      placeholder.appendChild(placeholderText);

      listingLink.appendChild(placeholder);
    }

    const content = document.createElement('div');
    content.className = 'p-4';

    const title = document.createElement('h2');
    title.className =
      'm-0 mb-3 text-xl font-bold text-blue-slate-900 font-display line-clamp-2';
    title.textContent = listing.title;
    content.appendChild(title);

    if (listing.description) {
      const description = document.createElement('p');
      description.className =
        'm-0 mb-4 text-sm leading-relaxed text-cool-steel-700 line-clamp-2';
      const truncatedDesc =
        listing.description.length > 100
          ? listing.description.substring(0, 100) + '...'
          : listing.description;
      description.textContent = truncatedDesc;
      content.appendChild(description);
    }

    listingLink.appendChild(content);
    article.appendChild(listingLink);

    const footer = document.createElement('div');
    footer.className = 'px-4 pb-4 mt-auto';

    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'flex justify-between gap-4 mb-3 items-top';

    const timeContainer = document.createElement('div');
    timeContainer.className = 'flex flex-col';

    const timeLabel = document.createElement('span');
    timeLabel.className = 'mb-1 text-xs text-cool-steel-600';
    timeLabel.textContent = 'Ends in';
    timeContainer.appendChild(timeLabel);

    const timeRemaining = document.createElement('span');
    timeRemaining.className = 'text-sm font-bold text-petal-frost-600';
    timeRemaining.textContent = calculateTimeRemaining(listing.endsAt);
    timeContainer.appendChild(timeRemaining);

    detailsContainer.appendChild(timeContainer);

    const bidContainer = document.createElement('div');
    bidContainer.className = 'flex flex-col text-right';

    const bidCount = listing.bids?.length || 0;
    const currentBid =
      bidCount > 0 ? Math.max(...listing.bids.map((bid) => bid.amount)) : 0;

    const bidLabel = document.createElement('span');
    bidLabel.className = 'mb-1 text-xs text-cool-steel-600';
    bidLabel.textContent = 'Current Bid';
    bidContainer.appendChild(bidLabel);

    const bidInfo = document.createElement('span');
    bidInfo.className = 'text-sm font-bold text-celadon-600';
    bidInfo.textContent = `${currentBid.toLocaleString()} credits`;
    bidContainer.appendChild(bidInfo);

    const bidCountText = document.createElement('span');
    bidCountText.className = 'mt-1 text-xs text-cool-steel-600';
    bidCountText.textContent = `${bidCount} ${bidCount === 1 ? 'bid' : 'bids'}`;
    bidContainer.appendChild(bidCountText);

    detailsContainer.appendChild(bidContainer);
    footer.appendChild(detailsContainer);

    const detailsButton = document.createElement('a');
    detailsButton.href = `${prefix}/src/pages/listing-detail.html?id=${listing.id}`;
    detailsButton.className =
      'block w-full text-center px-4 py-2 bg-blue-slate-600 text-white rounded-lg text-sm font-semibold no-underline transition-all duration-300 hover:bg-blue-slate-700 hover:-translate-y-0.5 active:translate-y-0';
    detailsButton.setAttribute(
      'aria-label',
      `View details for ${listing.title}`
    );
    detailsButton.textContent = 'See Auction Details';
    footer.appendChild(detailsButton);

    article.appendChild(footer);

    return article;
  } catch (error) {
    console.error('Error creating listing card:', error);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'px-4 py-12 text-center text-petal-frost-600';
    errorDiv.textContent = 'Unable to load listing';
    return errorDiv;
  }
}
