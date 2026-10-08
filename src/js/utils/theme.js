const THEME_STORAGE_KEY = 'barter-theme';

/**
 * Returns the saved application theme.
 * @returns {'light'|'dark'} The saved theme, defaulting to light.
 */
export function getTheme() {
  return localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light';
}

/**
 * Applies a theme to the document root.
 * @param {'light'|'dark'} theme - The theme to apply.
 * @returns {'light'|'dark'} The applied theme.
 */
export function applyTheme(theme = getTheme()) {
  const nextTheme = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  return nextTheme;
}

/**
 * Switches between the light and dark themes.
 * @returns {'light'|'dark'} The newly applied theme.
 */
export function toggleTheme() {
  return applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
}
