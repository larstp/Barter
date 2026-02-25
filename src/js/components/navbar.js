import { getUser } from '../utils/storage.js';
import { initializeSearch, openSearch } from './searchModal.js';

/**
 * Creates a navigation item for the mobile navbar
 * @param {Object} item - The navigation item configuration
 * @param {string} item.icon - Path to the icon image
 * @param {string} item.href - Link destination
 * @param {string} item.ariaLabel - Accessible label for the link
 * @param {string} item.page - Page identifier for active state
 * @param {boolean} item.isCenter - Whether this is the center item
 * @param {Function} item.onClick - Optional click handler
 * @returns {HTMLDivElement} The navigation item element
 */
function createNavItem(item) {
  const navItem = document.createElement('div');
  navItem.className = 'flex justify-center flex-1';

  const isActive = window.location.pathname.includes(item.page);

  const link = document.createElement('a');
  link.href = item.href;
  link.className =
    'flex items-center justify-center p-2 no-underline transition-colors duration-300';

  if (isActive) {
    link.className += ' bg-white/10 rounded-full';
  }

  link.setAttribute('aria-label', item.ariaLabel);

  if (item.onClick) {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      item.onClick();
    });
  }

  if (isActive) {
    link.setAttribute('aria-current', 'page');
  }

  const icon = document.createElement('img');
  icon.src = item.icon;
  icon.alt = '';
  icon.className = 'w-7 h-7';

  if (isActive) {
    icon.className += ' opacity-100';
  } else {
    icon.className += ' opacity-60';
  }

  link.appendChild(icon);
  navItem.appendChild(link);

  return navItem;
}

/**
 * Opens the search modal
 * @returns {void}
 */
function openSearchHandler() {
  openSearch();
}

/**
 * Creates and renders the mobile navigation bar
 * @returns {HTMLElement|null} The navbar element or null if user not logged in
 *
 * @description
 * Creates a floating mobile navigation bar with:
 * - Five navigation icons (Home, All Auctions, Add, Search, Profile)
 * - Active page indicator
 * - Mobile-only (hidden on desktop)
 * - Only visible when user is logged in
 */
export function renderNavbar() {
  // Initialize search modal once with callback
  initializeSearch((query) => {
    window.location.href = `/src/pages/listings.html?search=${encodeURIComponent(query)}`;
  });

  const user = getUser();

  if (!user) {
    return null;
  }

  const isRootPage = !window.location.pathname.includes('/src/pages/');
  const prefix = isRootPage ? '.' : '../..';

  const navbar = document.createElement('nav');
  navbar.className =
    'fixed z-50 flex items-center justify-around gap-2 px-4 py-1 border rounded-lg shadow-2xl bottom-6 left-1 right-1 lg:hidden bg-blue-slate-700/90 backdrop-blur-md border-white/10';
  navbar.setAttribute('role', 'navigation');
  navbar.setAttribute('aria-label', 'Mobile navigation');

  const navItems = [
    {
      icon: `${prefix}/public/icons/flowbite_home-solid.svg`,
      href: `${prefix}/index.html`,
      ariaLabel: 'Go to home page',
      page: 'index.html',
    },
    {
      icon: `${prefix}/public/icons/streamline_justice-hammer-solid.svg`,
      href: `${prefix}/src/pages/listings.html`,
      ariaLabel: 'View all auctions',
      page: 'listings.html',
    },
    {
      icon: `${prefix}/public/icons/flowbite_circle-plus-solid.svg`,
      href: `${prefix}/src/pages/create-listing.html`,
      ariaLabel: 'Create new listing',
      page: 'create-listing.html',
      isCenter: true,
    },
    {
      icon: `${prefix}/public/icons/flowbite_search-solid.svg`,
      href: '#',
      ariaLabel: 'Search',
      page: 'search',
      onClick: openSearchHandler,
    },
    {
      icon: `${prefix}/public/icons/flowbite_user-circle-solid.svg`,
      href: `${prefix}/src/pages/user.html`,
      ariaLabel: 'Go to profile',
      page: 'user.html',
    },
  ];

  navItems.forEach((item) => {
    navbar.appendChild(createNavItem(item));
  });

  const body = document.querySelector('body');
  if (body) {
    body.appendChild(navbar);
  }

  return navbar;
}
