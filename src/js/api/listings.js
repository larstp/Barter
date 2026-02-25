import { API_ENDPOINTS, PAGINATION_LIMITS } from '../utils/constants.js';
import { getToken, getApiKey } from '../utils/storage.js';

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

  // -------------------------------------------Add sort parameters if works
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

  return await response.json();
}

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

  return await response.json();
}

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
    const error = await response.json();
    throw new Error(error.errors?.[0]?.message || 'Failed to create listing');
  }

  return await response.json();
}

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
    const error = await response.json();
    throw new Error(error.errors?.[0]?.message || 'Failed to update listing');
  }

  return await response.json();
}

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

  return await response.json();
}
