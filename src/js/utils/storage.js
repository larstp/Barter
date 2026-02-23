import { STORAGE_KEYS } from './constants.js';

/**
 * Gets the appropriate storage based on what it remembers
 * @param {boolean} remember - Whether to use localStorage (true) or sessionStorage (false)
 * @returns {Storage} The storage object to use
 */
function getStorage(remember = true) {
  return remember ? localStorage : sessionStorage;
}

/**
 * Checks both storages for a value
 * @param {string} key - The storage key
 * @returns {string|null} The value from either storage
 */
function getFromBothStorages(key) {
  return localStorage.getItem(key) || sessionStorage.getItem(key);
}

/**
 * Saves the authentication token to storage
 * @param {string} token - The authentication token to save
 * @param {boolean} remember - If true, uses localStorage; if false, uses sessionStorage (default: true)
 * @returns {void}
 */
export function saveToken(token, remember = true) {
  const storage = getStorage(remember);
  storage.setItem(STORAGE_KEYS.token, token);
}

/**
 * Retrieves the authentication token from storage
 * @returns {string|null} The authentication token or null if not there
 */
export function getToken() {
  return getFromBothStorages(STORAGE_KEYS.token);
}

/**
 * Removes the authentication token from both localStorage and sessionStorage
 * @returns {void}
 */
export function removeToken() {
  localStorage.removeItem(STORAGE_KEYS.token);
  sessionStorage.removeItem(STORAGE_KEYS.token);
}

/**
 * Saves the user object to storage
 * @param {Object} user - The user object to save
 * @param {boolean} remember - If true, uses localStorage; if false, uses sessionStorage (default: true)
 * @returns {void}
 */
export function saveUser(user, remember = true) {
  const storage = getStorage(remember);
  storage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

/**
 * Retrieves the user object from storage
 * @returns {Object|null} The user object or null if not found
 */
export function getUser() {
  const user = getFromBothStorages(STORAGE_KEYS.user);
  return user ? JSON.parse(user) : null;
}

/**
 * Removes the user object from both localStorage and sessionStorage
 * @returns {void}
 */
export function removeUser() {
  localStorage.removeItem(STORAGE_KEYS.user);
  sessionStorage.removeItem(STORAGE_KEYS.user);
}

/**
 * Saves the API key to storage
 * @param {string} apiKey - The API key to save
 * @param {boolean} remember - If true, uses localStorage; if false, uses sessionStorage (default: true)
 * @returns {void}
 */
export function saveApiKey(apiKey, remember = true) {
  const storage = getStorage(remember);
  storage.setItem(STORAGE_KEYS.apiKey, apiKey);
}

/**
 * Retrieves the API key from storage
 * @returns {string|null} The API key or null if not there
 */
export function getApiKey() {
  return getFromBothStorages(STORAGE_KEYS.apiKey);
}

/**
 * Removes the API key from both localStorage and sessionStorage
 * @returns {void}
 */
export function removeApiKey() {
  localStorage.removeItem(STORAGE_KEYS.apiKey);
  sessionStorage.removeItem(STORAGE_KEYS.apiKey);
}

/**
 * Clears all application data from storage (token, user, and API key)
 * @returns {void}
 */
export function clearStorage() {
  removeToken();
  removeUser();
  removeApiKey();
}
