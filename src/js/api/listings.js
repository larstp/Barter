import { API_ENDPOINTS, PAGINATION_LIMITS } from '../utils/constants.js';
import { getToken, getApiKey } from '../utils/storage.js';
import { parseJson } from './response.js';

/**
 * Fetches a paginated list of listings.
 * @param {number} [limit=21] - Number of listings per page.
 * @param {number} [page=1] - Page number.
 * @param {string} [tag=''] - Optional tag filter.
 * @param {boolean} [active=true] - Whether to fetch active listings.
 * @param {string} [sort='created'] - Sort field.
 * @param {string} [sortOrder='desc'] - Sort direction.
 * @returns {Promise<Object>} The listings response.
 * @throws {Error} If listings cannot be fetched.
 */
export async function getListings(
  limit = PAGINATION_LIMITS.DEFAULT,
  page = 1,
  tag = '',
  active = true,
  sort = 'created',
  sortOrder = 'desc'
) {
  const apiKey = getApiKey();

  const params = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
    _seller: 'true',
    _bids: 'true',
  });

  if (tag) {
    params.append('_tag', tag);
  }

  if (active !== undefined) {
    params.append('_active', active.toString());
  }

  if (sort) {
    params.append('sort', sort);
  }

  if (sortOrder) {
    params.append('sortOrder', sortOrder);
  }

  const headers = {};
  if (apiKey) {
    headers['X-Noroff-API-Key'] = apiKey;
  }

  const response = await fetch(`${API_ENDPOINTS.auction.listings}?${params}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch listings');
  }

  return parseJson(response);
}

/**
 * Fetches one listing with seller and bid data.
 * @param {string} id - The listing identifier.
 * @returns {Promise<Object>} The listing response.
 * @throws {Error} If the listing cannot be fetched.
 */
export async function getListing(id) {
  const apiKey = getApiKey();

  const headers = {};
  if (apiKey) {
    headers['X-Noroff-API-Key'] = apiKey;
  }

  const response = await fetch(
    `${API_ENDPOINTS.auction.listings}/${id}?_seller=true&_bids=true`,
    { headers }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch listing');
  }

  return parseJson(response);
}

/**
 * Creates a listing for the authenticated user.
 * @param {Object} listingData - The listing payload.
 * @returns {Promise<Object>} The created listing response.
 * @throws {Error} If the listing cannot be created.
 */
export async function createListing(listingData) {
  const token = getToken();
  const apiKey = getApiKey();

  const response = await fetch(API_ENDPOINTS.auction.listings, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'X-Noroff-API-Key': apiKey,
    },
    body: JSON.stringify(listingData),
  });

  if (!response.ok) {
    const error = await parseJson(response);
    throw new Error(error.errors?.[0]?.message || 'Failed to create listing');
  }

  return parseJson(response);
}

/**
 * Updates an existing listing.
 * @param {string} id - The listing identifier.
 * @param {Object} listingData - The updated listing payload.
 * @returns {Promise<Object>} The updated listing response.
 * @throws {Error} If the listing cannot be updated.
 */
export async function updateListing(id, listingData) {
  const token = getToken();
  const apiKey = getApiKey();

  const response = await fetch(`${API_ENDPOINTS.auction.listings}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'X-Noroff-API-Key': apiKey,
    },
    body: JSON.stringify(listingData),
  });

  if (!response.ok) {
    const error = await parseJson(response);
    throw new Error(error.errors?.[0]?.message || 'Failed to update listing');
  }

  return parseJson(response);
}

/**
 * Deletes an existing listing.
 * @param {string} id - The listing identifier.
 * @returns {Promise<void>} A promise resolved after deletion.
 * @throws {Error} If the listing cannot be deleted.
 */
export async function deleteListing(id) {
  const token = getToken();
  const apiKey = getApiKey();

  const response = await fetch(`${API_ENDPOINTS.auction.listings}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Noroff-API-Key': apiKey,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete listing');
  }
}

/**
 * Searches listings by query text.
 * @param {string} query - The search query.
 * @returns {Promise<Object>} The search response.
 * @throws {Error} If the search request fails.
 */
export async function searchListings(query) {
  const apiKey = getApiKey();
  const headers = {};

  if (apiKey) {
    headers['X-Noroff-API-Key'] = apiKey;
  }

  const response = await fetch(
    `${API_ENDPOINTS.auction.listings}/search?q=${encodeURIComponent(query)}&_seller=true&_bids=true`,
    { headers }
  );

  if (!response.ok) {
    throw new Error('Failed to search listings');
  }

  return parseJson(response);
}
