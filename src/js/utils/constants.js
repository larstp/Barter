export const API_BASE_URL = 'https://v2.api.noroff.dev';
export const API_AUCTION_BASE = `${API_BASE_URL}/auction`;
export const API_AUTH_BASE = `${API_BASE_URL}/auth`;

export const API_ENDPOINTS = {
  auth: {
    register: `${API_AUTH_BASE}/register`,
    login: `${API_AUTH_BASE}/login`,
    createApiKey: `${API_AUTH_BASE}/create-api-key`,
  },
  auction: {
    listings: `${API_AUCTION_BASE}/listings`,
    profiles: `${API_AUCTION_BASE}/profiles`,
  },
};

export const STORAGE_KEYS = {
  token: 'accessToken',
  user: 'user',
  apiKey: 'apiKey',
};
