import { initializePage } from '../utils/main.js';
import { getListings } from '../api/listings.js';
import { getUser } from '../utils/storage.js';
import { createLoader } from '../components/loader.js';
import { createListingCard } from '../components/listingCard.js';
import { showError } from '../components/errorDisplay.js';

initializePage();
document.body.classList.add('home-page');
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
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=1200&h=600&fit=crop';
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

    const highestBid = listing.bids?.length
      ? Math.max(...listing.bids.map((bid) => bid.amount))
      : 0;
    const bid = document.createElement('p');
    bid.className = '-mt-2 text-base font-bold md:text-lg';
    bid.textContent = `Current highest bid: ${highestBid.toLocaleString()} credits`;
    textContainer.appendChild(bid);

    const button = document.createElement('a');
    button.href = `./src/pages/listing-detail.html?id=${listing.id}`;
    button.className =
      'self-start px-8 py-4 mt-4 text-lg font-semibold text-white no-underline transition-all duration-200 rounded-lg bg-blue-slate-600 hover:bg-blue-slate-700 hover:scale-105';
    button.textContent = 'See Auction Details';
    textContainer.appendChild(button);

    content.appendChild(textContainer);
    hero.appendChild(content);
    main.appendChild(hero);

    if (!getUser()) {
      main.appendChild(createSignupMarquee());
    }

    const ctaSection = document.createElement('section');
    ctaSection.className =
      'max-w-[1200px] mx-auto px-6 py-4 sm:px-8 md:py-16 lg:px-4';

    const ctaContainer = document.createElement('div');
    ctaContainer.className =
      'flex flex-col items-center gap-8 md:flex-row md:gap-12 md:pl-8';

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
    ctaSubheading.textContent =
      'Discover curated auctions from around the world and find something worth bidding on.';
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

    const popularResponse = await getListings(
      30,
      1,
      '',
      true,
      'created',
      'desc'
    );
    const allListings = popularResponse.data || [];

    const recentListings = allListings.slice(0, 3);

    const popularListings = allListings
      .sort((a, b) => (b._count?.bids || 0) - (a._count?.bids || 0))
      .slice(0, 3);

    if (popularListings.length > 0) {
      const popularSection = document.createElement('section');
      popularSection.className = 'max-w-[1200px] mx-auto px-4 py-12';

      const popularHeading = document.createElement('h2');
      popularHeading.className =
        'mb-2 text-3xl font-bold text-center font-display text-blue-slate-900';
      popularHeading.textContent = 'Check out our most popular auctions';
      popularSection.appendChild(popularHeading);

      const popularSubheading = document.createElement('p');
      popularSubheading.className = 'mb-8 text-center text-cool-steel-700';
      popularSubheading.textContent =
        'Explore the listings attracting the most attention from our community.';
      popularSection.appendChild(popularSubheading);

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
        'mb-2 text-3xl font-bold text-center font-display text-blue-slate-900';
      recentHeading.textContent = 'Recently added';
      recentSection.appendChild(recentHeading);

      const recentSubheading = document.createElement('p');
      recentSubheading.className = 'mb-8 text-center text-cool-steel-700';
      recentSubheading.textContent =
        'Discover the latest items added to the marketplace.';
      recentSection.appendChild(recentSubheading);

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
 * Creates the logged-out signup announcement marquee.
 * @returns {HTMLElement} The signup marquee section.
 */
function createSignupMarquee() {
  const message =
    'Sign up today and receive 1000 free credits to explore curated auctions, place your first bids, and discover something worth bringing home. Only at Barter';
  const marquee = document.createElement('section');
  marquee.className =
    'signup-marquee overflow-hidden bg-blue-slate-700 text-white';
  marquee.setAttribute('aria-label', message);

  const track = document.createElement('div');
  track.className = 'signup-marquee-track flex w-max whitespace-nowrap';

  [false, true].forEach((isDuplicate) => {
    const group = document.createElement('div');
    group.className = 'signup-marquee-group flex shrink-0';

    const link = document.createElement('a');
    link.href = './src/pages/register.html';
    link.className =
      'shrink-0 px-8 py-3 text-sm font-semibold no-underline transition-colors hover:bg-blue-slate-800 md:text-base';
    link.textContent = message;
    if (isDuplicate) link.setAttribute('aria-hidden', 'true');
    group.appendChild(link);
    track.appendChild(group);
  });

  marquee.appendChild(track);
  return marquee;
}
