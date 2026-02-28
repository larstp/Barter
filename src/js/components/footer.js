import { clearStorage } from '../utils/storage.js';
import { resolvePath } from '../utils/helpers.js';

/**
 * Creates a clickable footer link (non-functional, for display only)
 * @param {string} text - The link text to display
 * @returns {HTMLSpanElement} The footer link element
 */
function createFooterLink(text) {
  const link = document.createElement('span');
  link.className =
    'text-sm transition-colors cursor-pointer text-cool-steel-700 hover:text-blue-slate-700 hover:underline';
  link.textContent = text;
  link.setAttribute('aria-label', text);
  link.setAttribute('role', 'button');
  link.setAttribute('tabindex', '0');

  return link;
}

/**
 * Renders the footer component
 * @returns {HTMLElement} The footer element
 */
export function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'relative z-10 mt-auto bg-dust-grey-100';
  footer.setAttribute('role', 'contentinfo');

  const container = document.createElement('div');
  container.className = 'px-8 py-8 pb-24 lg:pb-8';

  const linksContainer = document.createElement('div');
  linksContainer.className =
    'flex flex-col gap-6 mb-12 lg:grid lg:grid-cols-3 lg:gap-8 lg:mb-0';
  linksContainer.setAttribute('aria-label', 'Footer links');

  const leftLinks = document.createElement('div');
  leftLinks.className = 'flex flex-col gap-3';

  const leftFooterLinks = [
    'Terms of Use',
    'Data Protection & Privacy Notice',
    'Cookie Policy',
  ];

  leftFooterLinks.forEach((linkText) => {
    leftLinks.appendChild(createFooterLink(linkText));
  });

  const rightLinks = document.createElement('div');
  rightLinks.className = 'flex flex-col gap-3 lg:text-right';

  const rightFooterLinks = ['About Barter', 'Help Center'];

  rightFooterLinks.forEach((linkText) => {
    rightLinks.appendChild(createFooterLink(linkText));
  });

  //    ------------------------------------------------------- Added  logout button for testing remove later!
  const logoutLink = document.createElement('span');
  logoutLink.className =
    'text-sm transition-colors cursor-pointer text-cool-steel-700 hover:text-blue-slate-700 hover:underline';
  logoutLink.textContent = 'Log Out';
  logoutLink.setAttribute('aria-label', 'Log Out');
  logoutLink.setAttribute('role', 'button');
  logoutLink.setAttribute('tabindex', '0');
  logoutLink.addEventListener('click', () => {
    clearStorage();
    window.location.href = resolvePath('index.html');
  });
  rightLinks.appendChild(logoutLink);

  const logoContainer = document.createElement('div');
  logoContainer.className = 'items-center justify-center hidden lg:flex';

  const logo = document.createElement('img');
  logo.src = resolvePath('public/img/logos/logo-text-black.svg');
  logo.alt = 'Barter';
  logo.className = 'h-16';

  logoContainer.appendChild(logo);

  linksContainer.appendChild(leftLinks);
  linksContainer.appendChild(logoContainer);
  linksContainer.appendChild(rightLinks);

  const copyright = document.createElement('p');
  copyright.className = 'text-sm text-center text-cool-steel-600';
  copyright.textContent = '© Barter 2026';

  container.appendChild(linksContainer);
  container.appendChild(copyright);
  footer.appendChild(container);

  const body = document.querySelector('body');
  if (body) {
    body.appendChild(footer);
  }

  return footer;
}
