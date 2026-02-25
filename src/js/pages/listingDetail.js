import { getListing, deleteListing } from '../api/listings.js';
import { placeBid } from '../api/bids.js';
import { getProfile, getProfileListings } from '../api/profile.js';
import { initializePage } from '../utils/main.js';
import { getUser, saveUser } from '../utils/storage.js';
import { createLoader } from '../components/loader.js';
import { calculateTimeRemaining } from '../utils/helpers.js';
import { createBackButton } from '../components/backButton.js';

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

    const backButton = createBackButton();
    backButton.className += ' mb-6';
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
      sellerStats.textContent = 'Loading...';
      sellerInfo.appendChild(sellerStats);

      sellerLink.appendChild(sellerInfo);
      infoSection.appendChild(sellerLink);

      try {
        const sellerListingsData = await getProfileListings(
          listing.seller.name,
          1,
          1
        ); // screw this thing i cant figure out why this wont work
        const listingsCount = sellerListingsData.meta?.totalCount || 0;
        sellerStats.textContent = `${listingsCount} ${listingsCount === 1 ? 'listing' : 'listings'}`;
      } catch (error) {
        console.error('Error fetching seller listings count:', error);
        sellerStats.textContent = 'Listings';
      }
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

    // ----------------------------------------------------------------Check if current user is the owner of the listing
    const isOwner =
      currentUser && listing.seller && currentUser.name === listing.seller.name;

    if (isOwner) {
      const editButton = document.createElement('button');
      editButton.className =
        'px-6 py-3 bg-blue-slate-600 text-white rounded-lg font-semibold transition-all hover:bg-blue-slate-700 hover:-translate-y-0.5 active:translate-y-0';
      editButton.textContent = 'Edit Listing';
      editButton.addEventListener('click', () => {
        window.location.href = `/src/pages/edit-listing.html?id=${listingId}`;
      });
      actionsSection.appendChild(editButton);

      const deleteButton = document.createElement('button');
      deleteButton.className =
        'px-6 py-3 bg-petal-frost-600 text-white rounded-lg font-semibold transition-all hover:bg-petal-frost-700 hover:-translate-y-0.5 active:translate-y-0';
      deleteButton.textContent = 'Delete Listing';
      deleteButton.addEventListener('click', () => {
        showDeleteConfirmationModal(listingId);
      });
      actionsSection.appendChild(deleteButton);
    } else {
      // Show bid form and wishlist button if user is not the listngs owner
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

            // Fetches and updates the profile with new credit count after bid
            const currentUser = getUser();
            const updatedProfile = await getProfile(currentUser.name);

            const updatedUser = {
              ...currentUser,
              credits: updatedProfile.data.credits,
            };

            const remember = localStorage.getItem('accessToken') !== null;
            saveUser(updatedUser, remember);

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
      wishlistButton.textContent = '♥ Add to Wishlist';
      wishlistButton.addEventListener('click', () => {
        //---------------------------------------------------- TODOIF I HAVE TIME: Implement wishlist functionality
      });
      actionsSection.appendChild(wishlistButton);
    }

    infoSection.appendChild(actionsSection);

    contentGrid.appendChild(infoSection);
    container.appendChild(contentGrid);

    // ---------------------------------------- Bidding History Section. will see if design should be different
    if (listing.bids && listing.bids.length > 0) {
      const historySection = document.createElement('div');
      historySection.className = 'mt-12';

      const historyTitle = document.createElement('h2');
      historyTitle.className =
        'mb-4 text-2xl font-semibold text-blue-slate-900 font-display';
      historyTitle.textContent = `Bidding History (${listing.bids.length})`;
      historySection.appendChild(historyTitle);

      const bidsList = document.createElement('div');
      bidsList.className = 'flex flex-col gap-3';

      const sortedBids = [...listing.bids].sort(
        (a, b) => new Date(b.created) - new Date(a.created)
      );

      const highestBid = Math.max(...listing.bids.map((bid) => bid.amount));

      sortedBids.forEach((bid) => {
        const bidItem = document.createElement('div');
        const isHighest = bid.amount === highestBid;
        bidItem.className = `flex items-center justify-between p-4 border rounded-lg ${
          isHighest
            ? 'border-celadon-400 bg-celadon-50'
            : 'border-cool-steel-200 bg-white'
        }`; // ------------------------------------------------------------------------------------FIX LATER. Tailwind npm run watch wont add

        const bidderInfo = document.createElement('div');
        bidderInfo.className = 'flex flex-col gap-1';

        const bidderName = document.createElement('span');
        bidderName.className = `font-semibold ${
          isHighest ? 'text-celadon-700' : 'text-blue-slate-900'
        }`;
        bidderName.textContent = bid.bidder?.name || 'Unknown bidder';
        bidderInfo.appendChild(bidderName);

        const bidDate = document.createElement('span');
        bidDate.className = 'text-xs text-cool-steel-600';
        const date = new Date(bid.created);
        bidDate.textContent = date.toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        });
        bidderInfo.appendChild(bidDate);

        bidItem.appendChild(bidderInfo);

        const bidAmount = document.createElement('div');
        bidAmount.className = 'flex items-center gap-2';

        const amountText = document.createElement('span');
        amountText.className = `text-lg font-bold ${
          isHighest ? 'text-celadon-600' : 'text-blue-slate-900'
        }`;
        amountText.textContent = `${bid.amount.toLocaleString()} credits`;
        bidAmount.appendChild(amountText);

        if (isHighest) {
          const badge = document.createElement('span');
          badge.className =
            'px-2 py-1 text-xs font-semibold text-white rounded-full bg-celadon-600';
          badge.textContent = 'Highest';
          bidAmount.appendChild(badge);
        }

        bidItem.appendChild(bidAmount);
        bidsList.appendChild(bidItem);
      });

      historySection.appendChild(bidsList);
      container.appendChild(historySection);
    }

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
//  --------------------------------------------------------------------TEST
/**
 * Shows a delete confirmation modal
 * @param {string} listingId - The ID of the listing to delete
 */
function showDeleteConfirmationModal(listingId) {
  const overlay = document.createElement('div');
  overlay.className =
    'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm';

  const modal = document.createElement('div');
  modal.className =
    'flex flex-col max-w-md gap-4 p-6 mx-4 bg-white rounded-lg shadow-xl';

  const title = document.createElement('h2');
  title.className = 'text-xl font-semibold text-blue-slate-900 font-display';
  title.textContent = 'Delete Listing';
  modal.appendChild(title);

  const message = document.createElement('p');
  message.className = 'text-cool-steel-700';
  message.textContent =
    'Are you sure you want to delete this listing? This action cannot be undone.';
  modal.appendChild(message);

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'flex gap-3 mt-2';

  const cancelButton = document.createElement('button');
  cancelButton.className =
    'flex-1 px-4 py-2 font-semibold transition-all border rounded-lg text-blue-slate-700 border-cool-steel-300 hover:bg-cool-steel-50';
  cancelButton.textContent = 'Cancel';
  cancelButton.addEventListener('click', () => {
    document.body.removeChild(overlay);
  });
  buttonContainer.appendChild(cancelButton);

  const deleteButton = document.createElement('button');
  deleteButton.className =
    'flex-1 px-4 py-2 font-semibold text-white transition-all rounded-lg bg-petal-frost-600 hover:bg-petal-frost-700';
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', async () => {
    try {
      deleteButton.disabled = true;
      cancelButton.disabled = true;
      deleteButton.textContent = 'Deleting...';

      await deleteListing(listingId);

      window.location.href = '/src/pages/listings.html';
    } catch (error) {
      console.error('Error deleting listing:', error);

      message.textContent = `Failed to delete listing: ${error.message || 'Unknown error'}`;
      message.className = 'text-petal-frost-600';

      deleteButton.disabled = false;
      cancelButton.disabled = false;
      deleteButton.textContent = 'Delete';
    }
  });
  buttonContainer.appendChild(deleteButton);

  modal.appendChild(buttonContainer);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
    }
  });
} // I am CONFUSED

displayListingDetail();
