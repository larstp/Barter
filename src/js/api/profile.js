import { API_ENDPOINTS, PAGINATION_LIMITS } from '../utils/constants.js';
import { getToken, getApiKey } from '../utils/storage.js';

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
    const errorData = await response.json().catch(() => ({}));
    console.error('Profile fetch failed:', response.status, errorData);
    throw new Error('Failed to fetch profile');
  }

  return await response.json();
}

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
    const error = await response.json();
    throw new Error(error.errors?.[0]?.message || 'Failed to update profile');
  }

  return await response.json();
}

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

  return await response.json();
}

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

  return await response.json();
}
