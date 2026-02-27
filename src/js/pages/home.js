import { initializePage } from '../utils/main.js';
import { getListings } from '../api/listings.js';
import { createLoader } from '../components/loader.js';
import { createListingCard } from '../components/listingCard.js';

initializePage();
displayHomePage();

/**
 * Displays the home page with a hero section showing the listing ending soonest
 */
async function displayHomePage() {
  try {
    const main = document.querySelector('main');

    if (!main) {
      console.error('Main element not found');
      return;
    }

    const loader = createLoader('Loading...');
    main.appendChild(loader);

    // ------------------------------Fetch active listings sorted by endsAt (ascending) to get the one ending soonest. Might be messy if there is exactly the same time left on a listing but none of them have that now
    const response = await getListings(1, 1, '', true, 'endsAt', 'asc');
    const listing = response.data?.[0];

    loader.remove();

    if (!listing) {
      showError(main, 'No active auctions found');
      return;
    }

    const hero = document.createElement('section');
    hero.className = 'relative w-full h-[500px] max-h-[70vh] overflow-hidden';

    const bgImage = document.createElement('img');
    bgImage.src =
      listing.media?.[0]?.url ||
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=1200&h=600&fit=crop'; // added random fallback image :)
    bgImage.alt = listing.media?.[0]?.alt || listing.title;
    bgImage.className = 'object-cover w-full h-full';

    hero.appendChild(bgImage);

    const overlay = document.createElement('div');
    overlay.className = 'absolute inset-0 bg-black/60';
    hero.appendChild(overlay);

    const content = document.createElement('div');
    content.className =
      'absolute inset-0 flex items-center justify-center px-4 text-white';

    const textContainer = document.createElement('div');
    textContainer.className = 'flex flex-col max-w-2xl gap-4 text-left';

    const heading = document.createElement('h1');
    heading.className =
      'text-4xl font-bold font-display md:text-5xl lg:text-6xl';
    heading.textContent = 'Ending Soon!';
    textContainer.appendChild(heading);

    const title = document.createElement('h2');
    title.className = 'text-xl font-semibold md:text-1xl';
    title.textContent = listing.title;
    textContainer.appendChild(title);

    const seller = document.createElement('p');
    seller.className = 'text-base font-light md:text-lg';
    seller.textContent = `By ${listing.seller?.name || 'Unknown'}`;
    textContainer.appendChild(seller);

    const button = document.createElement('a');
    button.href = `./src/pages/listing-detail.html?id=${listing.id}`;
    button.className =
      'self-start px-8 py-4 mt-4 text-lg font-semibold text-white no-underline transition-all duration-200 rounded-lg bg-blue-slate-600 hover:bg-blue-slate-700 hover:scale-105';
    button.textContent = 'See Auction Details';
    textContainer.appendChild(button);

    content.appendChild(textContainer);
    hero.appendChild(content);
    main.appendChild(hero);

    // -------------------------------------------------------------- all section
    const ctaSection = document.createElement('section');
    ctaSection.className = 'max-w-[1200px] mx-auto px-4 py-4 md:py-16';

    const ctaContainer = document.createElement('div');
    ctaContainer.className =
      'flex flex-col items-center gap-8 md:flex-row md:gap-12';

    const ctaContent = document.createElement('div');
    ctaContent.className =
      'flex flex-col gap-4 text-center md:w-1/2 md:text-left';

    const ctaHeading = document.createElement('h2');
    ctaHeading.className =
      'text-3xl font-bold font-display text-blue-slate-900 md:text-4xl';
    ctaHeading.textContent = 'Click here to see all of our available auctions';
    ctaContent.appendChild(ctaHeading);

    const ctaSubheading = document.createElement('p');
    ctaSubheading.className = 'text-xl font-semibold text-blue-slate-700';
    ctaSubheading.textContent = 'Barter away!';
    ctaContent.appendChild(ctaSubheading);

    const ctaButton = document.createElement('a');
    ctaButton.href = './src/pages/listings.html';
    ctaButton.className =
      'self-center px-8 py-4 mt-2 text-lg font-semibold text-white no-underline transition-all duration-200 rounded-lg bg-blue-slate-600 hover:bg-blue-slate-700 hover:scale-105 md:self-start';
    ctaButton.textContent = 'Browse Auctions';
    ctaContent.appendChild(ctaButton);

    ctaContainer.appendChild(ctaContent);

    const ctaImage = document.createElement('img');
    ctaImage.src = './public/img/auction_graphic.webp';
    ctaImage.alt = 'Auction graphic';
    ctaImage.className = 'w-full max-w-md rounded-3xl md:w-1/2';
    ctaContainer.appendChild(ctaImage);
    ctaSection.appendChild(ctaContainer);
    main.appendChild(ctaSection);

    // ---------------------------------------------------------Popular section
    const popularResponse = await getListings(
      30,
      1,
      '',
      true,
      'created',
      'desc'
    );
    const allListings = popularResponse.data || [];

    //--------------- Get recent listings BEFORE sorting (since sort mutates the array and everything breeeeaks)
    const recentListings = allListings.slice(0, 3);

    const popularListings = allListings
      .sort((a, b) => (b._count?.bids || 0) - (a._count?.bids || 0)) // THIS i had help with omg
      .slice(0, 3);

    if (popularListings.length > 0) {
      const popularSection = document.createElement('section');
      popularSection.className = 'max-w-[1200px] mx-auto px-4 py-12';

      const popularHeading = document.createElement('h2');
      popularHeading.className =
        'mb-8 text-3xl font-bold text-center font-display text-blue-slate-900';
      popularHeading.textContent = 'Check out our most popular auctions';
      popularSection.appendChild(popularHeading);

      const popularGrid = document.createElement('div');
      popularGrid.className =
        'grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-3';

      popularListings.forEach((popularListing) => {
        const card = createListingCard(popularListing);
        popularGrid.appendChild(card);
      });

      popularSection.appendChild(popularGrid);
      main.appendChild(popularSection);
    }

    if (recentListings.length > 0) {
      const recentSection = document.createElement('section');
      recentSection.className = 'max-w-[1200px] mx-auto px-4 py-12';

      const recentHeading = document.createElement('h2');
      recentHeading.className =
        'mb-8 text-3xl font-bold text-center font-display text-blue-slate-900';
      recentHeading.textContent = 'Recently added';
      recentSection.appendChild(recentHeading);

      const recentGrid = document.createElement('div');
      recentGrid.className =
        'grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-3';

      recentListings.forEach((recentListing) => {
        const card = createListingCard(recentListing);
        recentGrid.appendChild(card);
      });

      recentSection.appendChild(recentGrid);
      main.appendChild(recentSection);
    }
  } catch (error) {
    console.error('Error displaying home page:', error);
    const main = document.querySelector('main');
    if (main) {
      showError(main, 'Failed to load page. Please try again.');
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
