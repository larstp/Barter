import { renderHeader } from '../components/header.js';
import { renderFooter } from '../components/footer.js';
import { renderNavbar } from '../components/navbar.js';
import { createLogoBackground } from '../components/logoBackground.js';
import { applyTheme } from './theme.js';

/**
 * Initializes the page with common components
 * @param {Object} options - Configuration options
 * @param {boolean} options.includeLogoBackground - Whether to include the logo background (default: false)--- test and change default if it looks better
 * @returns {void}
 *
 * @description
 * Centralized page initialization that handles:
 * - Header rendering
 * - Footer rendering
 * - Mobile navbar rendering
 * - Optional logo background for auth pages
 *
 * @example
 * // For regular pages
 * initializePage();
 *
 * @example
 * // For login/register pages
 * initializePage({ includeLogoBackground: true });
 */
export function initializePage(options = {}) {
  applyTheme();
  const { includeLogoBackground = false } = options;

  const body = document.querySelector('body');

  if (!body) {
    console.error('Body element not found');
    return;
  }

  if (includeLogoBackground) {
    body.insertBefore(createLogoBackground(), body.firstChild);
  }

  body.insertBefore(renderHeader(), body.firstChild);

  renderFooter();
  renderNavbar();
}
