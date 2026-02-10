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

export function saveToken(token, remember = true) {
  const storage = getStorage(remember);
  storage.setItem(STORAGE_KEYS.token, token);
}

export function getToken() {
  return getFromBothStorages(STORAGE_KEYS.token);
}

export function removeToken() {
  localStorage.removeItem(STORAGE_KEYS.token);
  sessionStorage.removeItem(STORAGE_KEYS.token);
}

export function saveUser(user, remember = true) {
  const storage = getStorage(remember);
  storage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

export function getUser() {
  const user = getFromBothStorages(STORAGE_KEYS.user);
  return user ? JSON.parse(user) : null;
}

export function removeUser() {
  localStorage.removeItem(STORAGE_KEYS.user);
  sessionStorage.removeItem(STORAGE_KEYS.user);
}

export function saveApiKey(apiKey, remember = true) {
  const storage = getStorage(remember);
  storage.setItem(STORAGE_KEYS.apiKey, apiKey);
}

export function getApiKey() {
  return getFromBothStorages(STORAGE_KEYS.apiKey);
}

export function removeApiKey() {
  localStorage.removeItem(STORAGE_KEYS.apiKey);
  sessionStorage.removeItem(STORAGE_KEYS.apiKey);
}

export function clearStorage() {
  removeToken();
  removeUser();
  removeApiKey();
}
