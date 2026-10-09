import { getUser } from '../utils/storage.js';
import { initializeSearch, openSearch } from './searchModal.js';
import { resolvePath } from '../utils/helpers.js';
import { getTheme, toggleTheme } from '../utils/theme.js';

/**
 * Creates the light/dark theme switch.
 * @returns {HTMLButtonElement} The theme switch button.
 */
function createThemeToggle() {
  const button = document.createElement('button');
  button.type = 'button';
  button.className =
    'theme-toggle flex items-center gap-2 p-0 pr-2 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-celadon-400 lg:pr-0';
  button.setAttribute('role', 'switch');
  button.setAttribute('aria-label', 'Toggle dark mode');

  const track = document.createElement('span');
  track.className = 'relative flex items-center justify-center w-9 h-9';

  const icon = document.createElement('img');
  icon.className = 'w-5 h-5 dark:invert';
  icon.alt = '';
  track.appendChild(icon);

  const label = document.createElement('span');
  label.className = 'sr-only';
  button.append(track, label);

  const updateState = () => {
    const isDark = getTheme() === 'dark';
    button.setAttribute('aria-checked', String(isDark));
    const nextThemeLabel = isDark ? 'light' : 'dark';
    icon.src = resolvePath(
      `public/icons/lucide_${isDark ? 'sun' : 'moon'}.svg`
    );
    icon.style.filter = isDark ? 'brightness(0) invert(1)' : 'none';
    label.textContent = `Switch to ${nextThemeLabel} mode`;
    button.title = `Switch to ${nextThemeLabel} mode`;
  };

  button.addEventListener('click', () => {
    toggleTheme();
    updateState();
  });
  updateState();

  return button;
}

/**
 * Creates the credits display for mobile (icon + number)
 * @param {Object|null} user - The user object from storage
 * @returns {HTMLDivElement} The credits display element
 */
function createMobileCreditsDisplay(user) {
  const container = document.createElement('div');
  container.className = 'flex items-center gap-2';

  const icon = document.createElement('img');
  icon.src = resolvePath('public/icons/ph_currency-eth-bold.svg');
  icon.alt = 'Credits';
  icon.className = 'w-6 h-6';

  const creditsText = document.createElement('span');
  creditsText.className = 'text-sm font-semibold text-blue-slate-700';
  creditsText.textContent = user?.credits?.toLocaleString() || '0';

  container.appendChild(icon);
  container.appendChild(creditsText);

  return container;
}

/**
 * Creates the credits display for desktop (icon + "Credits:" + number)
 * @param {Object|null} user - The user object from storage
 * @returns {HTMLDivElement} The credits display element
 */
function createDesktopCreditsDisplay(user) {
  const container = document.createElement('div');
  container.className = 'items-center hidden gap-2 lg:flex';

  const icon = document.createElement('img');
  icon.src = resolvePath('public/icons/ph_currency-eth-bold.svg');
  icon.alt = 'Credits';
  icon.className = 'w-5 h-5';

  const creditsText = document.createElement('span');
  creditsText.className = 'text-sm font-semibold text-blue-slate-700';
  creditsText.textContent = `Credits: ${user?.credits?.toLocaleString() || '0'}`;

  container.appendChild(icon);
  container.appendChild(creditsText);

  return container;
}

/**
 * Creates the logo link
 * @returns {HTMLAnchorElement} The logo link element
 */
function createLogoLink() {
  const link = document.createElement('a');
  link.href = resolvePath('index.html');
  link.className = 'flex items-center justify-center lg:justify-start';

  const img = document.createElement('img');
  img.src = resolvePath('public/img/logos/logo_full_circle.webp');
  img.alt = 'Barter Auction House';
  img.className = 'h-8';

  link.appendChild(img);

  return link;
}

/**
 * Creates the user profile link with avatar image
 * @param {Object} user - The user object from storage
 * @returns {HTMLAnchorElement} The profile link element
 */
function createProfileLink(user) {
  const link = document.createElement('a');
  link.href = resolvePath('src/pages/user.html');
  link.className =
    'flex items-center justify-end transition-transform hover:scale-105';

  const img = document.createElement('img');
  img.src = user.avatar.url;
  img.alt = user?.name || 'User profile';
  img.className =
    'object-cover w-10 h-10 transition-colors border-2 rounded-full bg-blue-slate-100 dark:bg-blue-slate-700 border-blue-slate-300 hover:border-blue-slate-500';

  link.appendChild(img);

  return link;
}

/**
 * Creates a login button for non-authenticated users
 * @returns {HTMLAnchorElement} Login button link element
 */
function createLoginButton() {
  const link = document.createElement('a');
  link.href = resolvePath('src/pages/login.html');
  link.className =
    'login-icon-link flex items-center justify-end transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-celadon-400';
  link.setAttribute('aria-label', 'Log in');

  const button = document.createElement('span');
  button.className =
    'flex items-center gap-2 p-0 md:px-4 md:py-2 md:text-sm md:font-semibold md:text-white md:rounded-lg md:bg-blue-slate-700 md:hover:bg-blue-slate-800';

  const icon = document.createElement('span');
  icon.className = 'login-icon h-5 w-5';
  icon.setAttribute('aria-hidden', 'true');

  const text = document.createElement('span');
  text.className = 'hidden md:inline';
  text.textContent = 'Log In';

  button.append(icon, text);

  link.appendChild(button);

  return link;
}

/**
 * Creates a placeholder for non-authenticated users on login page specifically, to avoid confusion with login button and profile link
 * @returns {HTMLDivElement} Placeholder with user icon
 */
function createPlaceholder() {
  const div = document.createElement('div');
  div.className = 'flex items-center justify-end';

  const img = document.createElement('img');
  img.src = resolvePath('public/icons/flowbite_user-circle-solid-black.svg');
  img.alt = 'User';
  img.className = 'w-10 h-10';

  div.appendChild(img);

  return div;
}

/**
 * Creates the "All Auctions" link for desktop navigation
 * @returns {HTMLAnchorElement} All auctions link
 */
function createAllAuctionsLink() {
  const link = document.createElement('a');
  link.href = resolvePath('src/pages/listings.html');
  link.className =
    'px-4 py-2 text-sm font-medium transition-all text-blue-slate-700 hover:text-blue-slate-900 hover:scale-105';
  link.textContent = 'All Auctions';

  return link;
}

/**
 * Creates the search button for desktop navigation
 * @returns {HTMLButtonElement} Search button
 */
function createSearchButton() {
  const button = document.createElement('button');
  button.className =
    'px-4 py-2 text-sm font-medium transition-all text-blue-slate-700 hover:text-blue-slate-900 hover:scale-105';
  button.setAttribute('aria-label', 'Search');
  button.textContent = 'Search';

  button.addEventListener('click', () => {
    openSearch();
  });

  return button;
}

/**
 * Creates the "Create new auction" button for desktop navigation
 * @param {Object|null} user - The user object from storage
 * @returns {HTMLAnchorElement} Create auction button link
 */
function createNewAuctionButton(user) {
  const link = document.createElement('a');
  if (user) {
    link.href = resolvePath('src/pages/create-listing.html');
  } else {
    link.href =
      resolvePath('src/pages/login.html') +
      `?redirect=${encodeURIComponent(resolvePath('src/pages/create-listing.html'))}`;
  }
  link.className =
    'px-4 py-2 text-sm font-semibold text-white transition-all rounded-lg bg-blue-slate-700 hover:bg-blue-slate-800 hover:scale-105';
  link.textContent = 'Create new auction';

  return link;
}

/**
 * Creates the desktop navigation menu
 * @param {Object|null} user - The user object from storage
 * @param {boolean} isLoginPage - Whether current page is login page
 * @returns {HTMLElement} Desktop navigation container
 */
function createDesktopNav(user, isLoginPage) {
  const nav = document.createElement('nav');
  nav.className = 'items-center hidden gap-2 lg:flex';

  nav.appendChild(createThemeToggle());
  nav.appendChild(createAllAuctionsLink());
  nav.appendChild(createSearchButton());
  nav.appendChild(createNewAuctionButton(user));

  if (user) {
    nav.appendChild(createProfileLink(user));
  } else if (isLoginPage) {
    nav.appendChild(createPlaceholder());
  } else {
    nav.appendChild(createLoginButton());
  }

  return nav;
}

/**
 * Renders the responsive header component
 * @returns {HTMLElement} The header element
 */
export function renderHeader() {
  initializeSearch((query) => {
    window.location.href =
      resolvePath('src/pages/listings.html') +
      `?search=${encodeURIComponent(query)}`;
  });

  const user = getUser();
  const isLoginPage = window.location.pathname.includes('login.html');

  const header = document.createElement('header');
  header.className =
    'sticky top-0 z-50 px-8 py-4 bg-white shadow-md min-h-[72px]';

  const container = document.createElement('div');
  container.className =
    'grid items-center grid-cols-3 gap-2 lg:flex lg:justify-between lg:gap-4 min-h-[56px]';

  const logo = createLogoLink();

  const desktopLeft = document.createElement('div');
  desktopLeft.className = 'items-center hidden gap-4 lg:flex';
  desktopLeft.appendChild(logo);
  if (user) {
    desktopLeft.appendChild(createDesktopCreditsDisplay(user));
  }

  const mobileLeft = document.createElement('div');
  mobileLeft.className = 'flex items-center justify-start lg:hidden';
  if (user) {
    mobileLeft.appendChild(createMobileCreditsDisplay(user));
  }

  const mobileRight = document.createElement('div');
  mobileRight.className = 'flex items-center justify-end lg:hidden';
  mobileRight.appendChild(createThemeToggle());

  if (user) {
    mobileRight.appendChild(createProfileLink(user));
  } else if (isLoginPage) {
    mobileRight.appendChild(createPlaceholder());
  } else {
    mobileRight.appendChild(createLoginButton());
  }

  const desktopNav = createDesktopNav(user, isLoginPage);

  container.appendChild(mobileLeft);
  const mobileLogo = document.createElement('div');
  mobileLogo.className = 'flex items-center justify-center lg:hidden';
  mobileLogo.appendChild(createLogoLink());
  container.appendChild(mobileLogo);
  container.appendChild(mobileRight);

  container.appendChild(desktopLeft);
  container.appendChild(desktopNav);

  header.appendChild(container);

  return header;
}
