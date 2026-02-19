import { getListing } from '../api/listings.js';
import { placeBid } from '../api/bids.js';
import { initializePage } from '../utils/main.js';
import { getUser } from '../utils/storage.js';
import { createLoader } from '../components/loader.js';
import { calculateTimeRemaining } from '../utils/helpers.js';

initializePage();

/**
 * Displays the listing detail page
 * @returns {Promise<void>}
 */
async function displayListingDetail() {
  try {
    const main = document.querySelector('main');

    if (!main) {
      console.error('Main element not found');
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const listingId = urlParams.get('id');

    if (!listingId) {
      showError(main, 'No listing ID specified');
      return;
    }

    const loader = createLoader('Loading auction...');
    main.appendChild(loader);

    const response = await getListing(listingId);
    const listing = response.data;

    loader.remove();

    if (!listing) {
      showError(main, 'Listing not found');
      return;
    }

    const currentUser = getUser();

    const container = document.createElement('div');
    container.className = 'max-w-[1200px] mx-auto px-[10%] py-8 lg:px-4';

    const backButton = document.createElement('button');
    backButton.className =
      'flex items-center justify-center p-0 mb-6 transition-all duration-200 ease-in-out cursor-pointer hover:scale-110';
    backButton.setAttribute('aria-label', 'Go back to previous page');

    const backIcon = document.createElement('img');
    backIcon.src = '../../public/icons/flowbite_arrow-right-alt-outline.svg';
    backIcon.alt = '';
    backIcon.className = 'w-5 h-5';
    backIcon.style.filter = 'invert(18%) sepia(20%) saturate(2200%) hue-rotate(178deg) brightness(90%) contrast(95%)';
    backButton.appendChild(backIcon);

    backButton.addEventListener('click', () => {
      window.history.back();
    });

    container.appendChild(backButton);

    const contentGrid = document.createElement('div');
    contentGrid.className = 'grid grid-cols-1 gap-8 lg:grid-cols-2';

    const imageSection = document.createElement('div');
    imageSection.className = 'flex flex-col gap-4';

    if (listing.media && listing.media.length > 0 && listing.media[0]?.url) {
      const mainImage = document.createElement('img');
      mainImage.src = listing.media[0].url;
      mainImage.alt = listing.media[0].alt || listing.title;
      mainImage.className = 'object-cover w-full rounded-lg bg-cool-steel-100';
      imageSection.appendChild(mainImage);
    } else {
      const placeholder = document.createElement('div');
      placeholder.className =
        'flex items-center justify-center w-full rounded-lg h-96 bg-cool-steel-100';
      const placeholderText = document.createElement('span');
      placeholderText.className = 'text-cool-steel-400';
      placeholderText.textContent = 'No image available';
      placeholder.appendChild(placeholderText);
      imageSection.appendChild(placeholder);
    }

    contentGrid.appendChild(imageSection);

    const infoSection = document.createElement('div');
    infoSection.className = 'flex flex-col gap-6';

    const title = document.createElement('h1');
    title.className = 'text-3xl font-bold text-blue-slate-900 font-display';
    title.textContent = listing.title;
    infoSection.appendChild(title);

    const divider1 = document.createElement('hr');
    divider1.className = 'border-cool-steel-200';
    infoSection.appendChild(divider1);

    if (listing.seller) {
      const sellerLink = document.createElement('a');
      sellerLink.href = `/src/pages/user.html?name=${listing.seller.name}`;
      sellerLink.className =
        'flex items-center gap-3 p-3 transition-colors rounded-lg hover:bg-cool-steel-50';

      if (listing.seller.avatar?.url) {
        const avatar = document.createElement('img');
        avatar.src = listing.seller.avatar.url;
        avatar.alt =
          listing.seller.avatar.alt || `${listing.seller.name}'s avatar`;
        avatar.className = 'object-cover w-12 h-12 rounded-full';
        sellerLink.appendChild(avatar);
      }

      const sellerInfo = document.createElement('div');
      sellerInfo.className = 'flex flex-col';

      const sellerName = document.createElement('span');
      sellerName.className = 'font-semibold text-blue-slate-900';
      sellerName.textContent = listing.seller.name;
      sellerInfo.appendChild(sellerName);

      const sellerStats = document.createElement('span');
      sellerStats.className = 'text-sm text-cool-steel-600';
      const listingsCount = listing.seller._count?.listings || 0;
      sellerStats.textContent = `${listingsCount} ${listingsCount === 1 ? 'listing' : 'listings'}`;
      sellerInfo.appendChild(sellerStats);

      sellerLink.appendChild(sellerInfo);
      infoSection.appendChild(sellerLink);
    }

    const divider2 = document.createElement('hr');
    divider2.className = 'border-cool-steel-200';
    infoSection.appendChild(divider2);

    const priceSection = document.createElement('div');
    priceSection.className = 'flex flex-col gap-2';

    const bidCount = listing.bids?.length || 0;
    const currentBid =
      bidCount > 0 ? Math.max(...listing.bids.map((bid) => bid.amount)) : 0;

    const priceLabel = document.createElement('span');
    priceLabel.className = 'text-sm text-cool-steel-600';
    priceLabel.textContent = 'Current bid';
    priceSection.appendChild(priceLabel);

    const priceValue = document.createElement('span');
    priceValue.className = 'text-3xl font-bold text-celadon-600';
    priceValue.textContent = `${currentBid.toLocaleString()} credits`;
    priceSection.appendChild(priceValue);

    const bidInfo = document.createElement('span');
    bidInfo.className = 'text-sm text-cool-steel-600';
    bidInfo.textContent = `${bidCount} ${bidCount === 1 ? 'bid' : 'bids'}`;
    priceSection.appendChild(bidInfo);

    const timeRemaining = document.createElement('span');
    timeRemaining.className = 'text-sm font-semibold text-petal-frost-600';
    timeRemaining.textContent = `Ends in ${calculateTimeRemaining(listing.endsAt)}`;
    priceSection.appendChild(timeRemaining);

    infoSection.appendChild(priceSection);

    const divider3 = document.createElement('hr');
    divider3.className = 'border-cool-steel-200';
    infoSection.appendChild(divider3);

    if (listing.description) {
      const descriptionSection = document.createElement('div');
      descriptionSection.className = 'flex flex-col gap-2';

      const descriptionLabel = document.createElement('h2');
      descriptionLabel.className = 'text-lg font-semibold text-blue-slate-900';
      descriptionLabel.textContent = 'Description';
      descriptionSection.appendChild(descriptionLabel);

      const description = document.createElement('p');
      description.className = 'leading-relaxed text-cool-steel-700';
      description.textContent = listing.description;
      descriptionSection.appendChild(description);

      infoSection.appendChild(descriptionSection);

      const divider4 = document.createElement('hr');
      divider4.className = 'border-cool-steel-200';
      infoSection.appendChild(divider4);
    }

    const actionsSection = document.createElement('div');
    actionsSection.className = 'flex flex-col gap-4';

    if (currentUser) {
      const bidForm = document.createElement('form');
      bidForm.className = 'flex gap-3';

      const bidInput = document.createElement('input');
      bidInput.type = 'number';
      bidInput.placeholder = 'Enter bid amount';
      bidInput.min = (currentBid + 1).toString();
      bidInput.className =
        'flex-1 p-3 border rounded-lg border-cool-steel-300 text-blue-slate-900 focus:outline-none focus:border-blue-slate-500 focus:ring-2 focus:ring-blue-slate-200';
      bidInput.required = true;
      bidForm.appendChild(bidInput);

      const bidButton = document.createElement('button');
      bidButton.type = 'submit';
      bidButton.className =
        'px-6 py-3 bg-blue-slate-600 text-white rounded-lg font-semibold transition-all hover:bg-blue-slate-700 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
      bidButton.textContent = 'Place Bid';
      bidForm.appendChild(bidButton);

      bidForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const bidAmount = parseInt(bidInput.value);

        if (bidAmount <= currentBid) {
          showFormError(
            bidForm,
            `Bid must be higher than ${currentBid} credits`
          );
          return;
        }

        try {
          bidButton.disabled = true;
          bidButton.textContent = 'Placing bid...';

          await placeBid(listingId, bidAmount);

          window.location.reload();
        } catch (error) {
          console.error('Error placing bid:', error);
          bidButton.disabled = false;
          bidButton.textContent = 'Place Bid';
          showFormError(bidForm, error.message || 'Failed to place bid');
        }
      });

      actionsSection.appendChild(bidForm);
    } else {
      const loginMessage = document.createElement('p');
      loginMessage.className = 'mb-2 text-sm text-cool-steel-600';
      loginMessage.textContent = 'Log in to bid on this item';
      actionsSection.appendChild(loginMessage);

      const disabledBidButton = document.createElement('a');
      disabledBidButton.href = `/src/pages/login.html?redirect=${encodeURIComponent(
        window.location.pathname + window.location.search
      )}`;
      disabledBidButton.className =
        'block px-6 py-3 font-semibold text-center rounded-lg cursor-not-allowed bg-cool-steel-300 text-cool-steel-600';
      disabledBidButton.textContent = 'Place Bid';
      actionsSection.appendChild(disabledBidButton);
    }

    const wishlistButton = document.createElement('button');
    wishlistButton.className =
      'px-6 py-3 font-semibold transition-all bg-white border rounded-lg border-cool-steel-300 text-blue-slate-700 hover:bg-cool-steel-50';
    wishlistButton.textContent = '♥ Add to Wishlist'; // woohoo heart symbol
    wishlistButton.addEventListener('click', () => {
      console.log('Wishlist functionality - to be implemented');
    });
    actionsSection.appendChild(wishlistButton);

    infoSection.appendChild(actionsSection);

    contentGrid.appendChild(infoSection);
    container.appendChild(contentGrid);
    main.appendChild(container);
  } catch (error) {
    console.error('Error displaying listing detail:', error);
    const main = document.querySelector('main');
    if (main) {
      showError(main, 'Failed to load auction. Please try again later.');
    }
  }
}

/**
 * Shows an error message
 * @param {HTMLElement} container - The container element
 * @param {string} message - The error message
 */
function showError(container, message) {
  const error = document.createElement('div');
  error.className = 'px-4 py-12 text-center text-petal-frost-600';
  error.setAttribute('role', 'alert');
  error.textContent = message;
  container.appendChild(error);
}

/**
 * Shows an error message in the from
 * @param {HTMLElement} form - The form element
 * @param {string} message - The error message
 */
function showFormError(form, message) {
  const existingError = form.querySelector('[data-error="bid-error"]');
  if (existingError) {
    existingError.remove();
  }

  const error = document.createElement('div');
  error.className =
    'p-3 mt-2 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50';
  error.setAttribute('role', 'alert');
  error.setAttribute('data-error', 'bid-error');
  error.textContent = message;
  form.appendChild(error);
}

displayListingDetail();
