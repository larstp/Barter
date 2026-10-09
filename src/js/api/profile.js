import { API_ENDPOINTS, PAGINATION_LIMITS } from '../utils/constants.js';
import { getToken, getApiKey } from '../utils/storage.js';
import { parseJson } from './response.js';

/**
 * Fetches a profile with its listings and wins.
 * @param {string} name - The profile username.
 * @returns {Promise<Object>} The profile response.
 * @throws {Error} If the profile cannot be fetched.
 */
export async function getProfile(name) {
  const token = getToken();
  const apiKey = getApiKey();

  const response = await fetch(
    `${API_ENDPOINTS.auction.profiles}/${name}?_listings=true&_wins=true`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Noroff-API-Key': apiKey,
      },
    }
  );

  if (!response.ok) {
    const errorData = await parseJson(response);
    console.error('Profile fetch failed:', response.status, errorData);
    throw new Error('Failed to fetch profile');
  }

  return parseJson(response);
}

/**
 * Updates a user's profile.
 * @param {string} name - The profile username.
 * @param {Object} profileData - The updated profile fields.
 * @returns {Promise<Object>} The updated profile response.
 * @throws {Error} If the profile cannot be updated.
 */
export async function updateProfile(name, profileData) {
  const token = getToken();
  const apiKey = getApiKey();

  const response = await fetch(`${API_ENDPOINTS.auction.profiles}/${name}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'X-Noroff-API-Key': apiKey,
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const error = await parseJson(response);
    throw new Error(error.errors?.[0]?.message || 'Failed to update profile');
  }

  return parseJson(response);
}

/**
 * Fetches listings created by a user.
 * @param {string} name - The profile username.
 * @param {number} [limit=21] - Number of listings per page.
 * @param {number} [page=1] - Page number.
 * @returns {Promise<Object>} The profile listings response.
 * @throws {Error} If the listings cannot be fetched.
 */
export async function getProfileListings(
  name,
  limit = PAGINATION_LIMITS.DEFAULT,
  page = 1
) {
  const token = getToken();
  const apiKey = getApiKey();

  const params = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
    _bids: 'true',
  });

  const response = await fetch(
    `${API_ENDPOINTS.auction.profiles}/${name}/listings?${params}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Noroff-API-Key': apiKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch profile listings');
  }

  return parseJson(response);
}

/**
 * Fetches bids placed by a user.
 * @param {string} name - The profile username.
 * @param {number} [limit=21] - Number of bids per page.
 * @param {number} [page=1] - Page number.
 * @returns {Promise<Object>} The profile bids response.
 * @throws {Error} If the bids cannot be fetched.
 */
export async function getProfileBids(
  name,
  limit = PAGINATION_LIMITS.DEFAULT,
  page = 1
) {
  const token = getToken();
  const apiKey = getApiKey();

  const params = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
    _listings: 'true',
    _bids: 'true',
  });

  const response = await fetch(
    `${API_ENDPOINTS.auction.profiles}/${name}/bids?${params}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Noroff-API-Key': apiKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch profile bids');
  }

  return parseJson(response);
}
