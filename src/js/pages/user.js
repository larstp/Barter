import { getProfile, getProfileBids } from '../api/profile.js'; // not sure if this is the right way bit it seems to work. sorry it is VERY messy
import { getUser, clearStorage, saveUser } from '../utils/storage.js';
import { initializePage } from '../utils/main.js';
import { createLoader } from '../components/loader.js';
import { createListingCard } from '../components/listingCard.js';
import { createBackButton } from '../components/backButton.js';

// Check if user is logged in, if not - straight to jail (login screen)
const user = getUser();
if (!user) {
  window.location.href = '/src/pages/login.html';
} else {
  initializePage();
  displayUserProfile();
}

/**
 * Displays the user profile page
 * @returns {Promise<void>}
 *
 * @description
 * Fetches and displays a user's profile with their auction listings.
 * If no username is provided in URL params, displays the logged-in user's profile.
 */
async function displayUserProfile() {
  try {
    const main = document.querySelector('main');

    if (!main) {
      console.error('Main element not found');
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const currentUser = getUser();
    const profileName = urlParams.get('name') || currentUser?.name;

    if (!profileName) {
      showError(main, 'No user specified');
      return;
    }

    const loader = createLoader('Loading profile...');
    main.appendChild(loader);

    const profileData = await getProfile(profileName);
    const profile = profileData.data;

    loader.remove();

    if (!profile) {
      showError(main, 'Profile not found');
      return;
    }

    if (currentUser?.name === profileName) {
      const updatedUser = {
        ...currentUser,
        credits: profile.credits,
        avatar: profile.avatar,
        banner: profile.banner,
        bio: profile.bio,
      };
      const remember = localStorage.getItem('token') ? true : false;
      saveUser(updatedUser, remember);

      updateHeaderCredits(profile.credits);
    }

    const banner = document.createElement('section');
    banner.className =
      'relative w-full h-[150px] bg-gradient-to-br from-blue-slate-600 to-blue-slate-800 overflow-hidden md:h-[200px] lg:h-[250px]';
    banner.setAttribute('aria-label', 'Profile banner');

    if (profile.banner?.url) {
      const bannerImage = document.createElement('img');
      bannerImage.src = profile.banner.url;
      bannerImage.alt = profile.banner.alt || `${profile.name}'s banner`;
      bannerImage.className = 'object-cover w-full h-full';
      banner.appendChild(bannerImage);
    }

    const backButton = createBackButton();
    backButton.className =
      'absolute z-10 flex items-center justify-center w-10 h-10 p-0 transition-all duration-200 ease-in-out border rounded-full cursor-pointer top-4 left-4 bg-black/50 backdrop-blur-md border-white/10 hover:bg-black/70 hover:scale-105';

    // Override icon color to white for visibility on banner
    const backIcon = backButton.querySelector('img');
    if (backIcon) {
      backIcon.className = 'w-5 h-5 brightness-0 invert';
    }

    banner.appendChild(backButton);

    if (currentUser?.name === profileName) {
      const editButton = document.createElement('a');
      editButton.href = './editUser.html';
      editButton.className =
        'absolute z-10 flex items-center justify-center px-4 py-2 text-sm font-medium text-white no-underline transition-all duration-200 ease-in-out border rounded-lg cursor-pointer top-4 right-4 bg-black/50 backdrop-blur-md border-white/10 hover:bg-black/70 hover:scale-105';
      editButton.setAttribute('aria-label', 'Edit profile');
      editButton.textContent = 'Edit Profile';
      banner.appendChild(editButton);
    }

    main.appendChild(banner);

    const header = document.createElement('section');
    header.className =
      'max-w-[1200px] mx-auto px-4 flex gap-6 -mt-[60px] relative z-[5] flex-col items-center text-center md:flex-row md:text-left md:-mt-[75px]';
    header.setAttribute('aria-label', 'Profile information');

    const avatarContainer = document.createElement('div');
    avatarContainer.className = 'shrink-0';

    const avatar = document.createElement('img');
    avatar.src =
      profile.avatar?.url ||
      'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=150&h=150&fit=crop';
    avatar.alt = profile.avatar?.alt || `${profile.name}'s avatar`;
    avatar.className =
      'w-[120px] h-[120px] rounded-full border-4 border-white object-cover bg-cool-steel-100 md:w-[150px] md:h-[150px]';
    avatarContainer.appendChild(avatar);

    header.appendChild(avatarContainer);

    const info = document.createElement('div');
    info.className = 'flex-1 pt-4 md:pt-14';

    const nameContainer = document.createElement('div');
    nameContainer.className = 'inline-block mb-2';

    const name = document.createElement('h1');
    name.className =
      'inline-block px-3 py-1 m-0 text-2xl font-semibold rounded-md text-blue-slate-900 font-display bg-white/90 md:text-3xl';
    name.textContent = profile.name;
    nameContainer.appendChild(name);

    info.appendChild(nameContainer);

    if (profile.bio) {
      const bio = document.createElement('p');
      bio.className = 'm-0 mb-4 leading-6 text-cool-steel-700';
      bio.textContent = profile.bio;
      info.appendChild(bio);
    }

    const stats = document.createElement('div');
    stats.className =
      'flex justify-center gap-8 text-base text-cool-steel-700 md:justify-start';
    stats.setAttribute('aria-label', 'Profile statistics');

    const creditsCount = profile.credits || 0;
    const listingsCount = profile._count?.listings || 0;
    const winsCount = profile._count?.wins || 0;

    const credits = document.createElement('div');
    credits.className = 'flex gap-1';

    const creditsLabel = document.createElement('span');
    creditsLabel.textContent = 'Credits: ';
    credits.appendChild(creditsLabel);

    const creditsValue = document.createElement('span');
    creditsValue.className = 'font-semibold text-blue-slate-900';
    creditsValue.textContent = creditsCount.toLocaleString();
    credits.appendChild(creditsValue);

    stats.appendChild(credits);

    const listings = document.createElement('div');
    listings.className = 'flex gap-1';

    const listingsLabel = document.createElement('span');
    listingsLabel.textContent = 'Listings: ';
    listings.appendChild(listingsLabel);

    const listingsValue = document.createElement('span');
    listingsValue.className = 'font-semibold text-blue-slate-900';
    listingsValue.textContent = listingsCount;
    listings.appendChild(listingsValue);

    stats.appendChild(listings);

    const wins = document.createElement('div');
    wins.className = 'flex gap-1';

    const winsLabel = document.createElement('span');
    winsLabel.textContent = 'Wins: ';
    wins.appendChild(winsLabel);

    const winsValue = document.createElement('span');
    winsValue.className = 'font-semibold text-blue-slate-900';
    winsValue.textContent = winsCount;
    wins.appendChild(winsValue);

    stats.appendChild(wins);
    info.appendChild(stats);

    header.appendChild(info);
    main.appendChild(header);

    // --------------------------------------Fetch bids data if viewing own profile. For showing "current bids" on profile page. will see if this should be moved to a separate "bids" page if it gets too cluttered
    let userBids = [];
    if (currentUser?.name === profileName) {
      try {
        const bidsData = await getProfileBids(profileName, 100, 1);
        userBids = bidsData.data || [];
      } catch (error) {
        console.error('Error fetching bids:', error);
      }
    }

    const listingsSection = document.createElement('section');
    listingsSection.className =
      'max-w-[1200px] mt-8 mx-auto mb-0 px-4 pb-4 pt-0';
    listingsSection.setAttribute('aria-label', 'User listings');

    // Create tab navigation
    const tabNav = document.createElement('div');
    tabNav.className = 'flex gap-2 mb-6 border-b border-cool-steel-200';

    const tabs = [
      { id: 'listings', label: 'Listings', count: listingsCount },
      { id: 'wins', label: 'Won Auctions', count: winsCount },
    ];

    // -----------------------------------------------------Only show "Current Bids" tab if viewing own profile. TEST WITH OTHER PROFILES TO MAKE SURE IT DISAPPEARS WHY AM I SHOUTING?
    if (currentUser?.name === profileName) {
      tabs.push({
        id: 'bids',
        label: 'Current Bids',
        count: userBids.length,
      });
    }

    tabs.forEach((tab, index) => {
      const tabButton = document.createElement('button');
      tabButton.className = `px-4 py-2 font-semibold transition-all border-b-2 ${
        index === 0
          ? 'text-blue-slate-700 border-blue-slate-700'
          : 'text-cool-steel-600 border-transparent hover:text-blue-slate-600'
      }`;
      tabButton.textContent = `${tab.label} (${tab.count})`;
      tabButton.setAttribute('data-tab', tab.id);

      tabButton.addEventListener('click', () => {
        tabNav.querySelectorAll('button').forEach((btn) => {
          btn.className = `px-4 py-2 font-semibold transition-all border-b-2 text-cool-steel-600 border-transparent hover:text-blue-slate-600`;
        });
        tabButton.className = `px-4 py-2 font-semibold transition-all border-b-2 text-blue-slate-700 border-blue-slate-700`;

        showTabContent(tab.id, profile, userBids, currentUser, profileName);
      });

      tabNav.appendChild(tabButton);
    });

    listingsSection.appendChild(tabNav);

    //  container
    const contentContainer = document.createElement('div');
    contentContainer.id = 'tab-content';
    listingsSection.appendChild(contentContainer);

    main.appendChild(listingsSection);

    // -----------------------------Show initial tab content (listings) as start tab
    showTabContent('listings', profile, userBids, currentUser, profileName);

    if (currentUser?.name === profileName) {
      const logoutSection = document.createElement('section');
      logoutSection.className =
        'max-w-[1200px] mt-12 mx-auto mb-8 px-4 py-0 flex justify-center';

      const logoutButton = document.createElement('button');
      logoutButton.className =
        'p-4 bg-petal-frost-600 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 inline-block text-center hover:bg-petal-frost-700 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
      logoutButton.textContent = 'Log Out';
      logoutButton.setAttribute('aria-label', 'Log out of your account');

      logoutButton.addEventListener('click', () => {
        clearStorage();
        window.location.href = '../../index.html';
      });

      logoutSection.appendChild(logoutButton);
      main.appendChild(logoutSection);
    }
  } catch (error) {
    console.error('Error displaying user profile:', error);
    const main = document.querySelector('main');
    if (main) {
      showError(main, 'Failed to load profile. Please try again.');
    }
  }
}

/**
 * Shows the content for the selected tab
 * @param {string} tabId - The ID of the tab to show
 * @param {Object} profile - The profile data
 * @param {Array} userBids - Array of user's bids
 * @param {Object} currentUser - The currently logged-in user
 * @param {string} profileName - The name of the profile being viewed
 */
function showTabContent(tabId, profile, userBids, currentUser, profileName) {
  const contentContainer = document.getElementById('tab-content');
  if (!contentContainer) return;

  while (contentContainer.firstChild) {
    contentContainer.removeChild(contentContainer.firstChild);
  }

  if (tabId === 'listings') {
    if (profile.listings && profile.listings.length > 0) {
      // ----------------active listings first, then expired ones (newest to oldest in each group) (super messy, but too exhausted)
      const sortedListings = [...profile.listings].sort(
        (listing1, listing2) => {
          const now = new Date();
          const listing1Expired = new Date(listing1.endsAt) < now;
          const listing2Expired = new Date(listing2.endsAt) < now;

          // ------------------------------If one is expired and one is active, active comes first
          if (listing1Expired && !listing2Expired) return 1;
          if (!listing1Expired && listing2Expired) return -1;

          // -------------------------------------------If both same status, sort newest first
          return new Date(listing2.created) - new Date(listing1.created);
        }
      );

      const listingsGrid = document.createElement('div');
      listingsGrid.className =
        'grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-3';

      sortedListings.forEach((listing) => {
        const listingCard = createListingCard(listing);
        listingsGrid.appendChild(listingCard);
      });

      contentContainer.appendChild(listingsGrid);
    } else {
      showEmptyState(contentContainer, 'No active listings');
    }
  } else if (tabId === 'wins') {
    if (profile.wins && profile.wins.length > 0) {
      const winsGrid = document.createElement('div');
      winsGrid.className =
        'grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-3';

      profile.wins.forEach((listing) => {
        const listingCard = createListingCard(listing);
        winsGrid.appendChild(listingCard);
      });

      contentContainer.appendChild(winsGrid);
    } else {
      showEmptyState(contentContainer, 'No won auctions yet');
    }
  } else if (tabId === 'bids') {
    if (userBids && userBids.length > 0) {
      const bidsGrid = document.createElement('div');
      bidsGrid.className =
        'grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-3';

      userBids.forEach((bid) => {
        if (bid.listing) {
          const listingCard = createBidListingCard(bid, currentUser.name);
          bidsGrid.appendChild(listingCard);
        }
      });

      contentContainer.appendChild(bidsGrid);
    } else {
      showEmptyState(contentContainer, 'No active bids');
    }
  }
}

/**
 * Creates a listing card for a bid with winning/losing indicator
 * @param {Object} bid - The bid object with listing data
 * @param {string} userName - The current user's name
 * @returns {HTMLElement} The listing card element
 */
function createBidListingCard(bid, userName) {
  const listing = bid.listing;
  const card = createListingCard(listing);

  //------------------------------------------  is user winning? (had help with this from full stack friend)
  const allBids = listing.bids || [];
  const highestBid =
    allBids.length > 0 ? Math.max(...allBids.map((b) => b.amount)) : 0;
  const userBid = bid.amount;
  const isWinning = userBid >= highestBid;

  const indicator = document.createElement('div');
  indicator.className = `absolute top-0 left-0 right-0 px-4 py-2 text-sm font-semibold text-white ${
    isWinning ? 'bg-celadon-600' : 'bg-petal-frost-600'
  }`;
  indicator.textContent = isWinning ? '✓ Winning bid' : '⚠ Outbid';

  card.style.position = 'relative';
  card.insertBefore(indicator, card.firstChild);

  card.className += ` border-2 ${
    isWinning ? 'border-celadon-400' : 'border-petal-frost-400'
  }`;

  return card;
}

/**
 * Shows an empty state message
 * @param {HTMLElement} container - The container element
 * @param {string} message - The message to display
 */
function showEmptyState(container, message) {
  const empty = document.createElement('div');
  empty.className =
    'flex flex-col items-center gap-4 max-w-[300px] mx-auto text-center py-12 px-4 text-cool-steel-600';

  const emptyText = document.createElement('p');
  emptyText.textContent = message;
  empty.appendChild(emptyText);

  container.appendChild(empty);
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
 * Updates the credits display in the header
 * @param {number} credits - The new credits count
 */
function updateHeaderCredits(credits) {
  //------------------------------------------------- Find all credit text elements in the header (mobile and desktop)
  const header = document.querySelector('header');
  if (!header) return;

  const creditsElements = header.querySelectorAll(
    'span.text-sm.font-semibold.text-blue-slate-700'
  );

  creditsElements.forEach((element) => {
    const text = element.textContent;
    if (!text.includes('Credits:')) {
      element.textContent = credits.toLocaleString();
    } else {
      element.textContent = `Credits: ${credits.toLocaleString()}`;
    }
  });
}
