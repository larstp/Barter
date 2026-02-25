/**
 * Base URL for the Noroff API v2
 * @constant {string}
 */
export const API_BASE_URL = 'https://v2.api.noroff.dev';

/**
 * Base URL for auction-related API endpoints
 * @constant {string}
 */
export const API_AUCTION_BASE = `${API_BASE_URL}/auction`;

/**
 * Base URL for authentication-related API endpoints
 * @constant {string}
 */
export const API_AUTH_BASE = `${API_BASE_URL}/auth`;

// To any lecturers; i hope its ok to store these here for ease of use. I can move them if needed.

/**
 * Collection of all API endpoints used in the application
 * @constant {Object}
 * @property {Object} auth - Authentication endpoints
 * @property {string} auth.register - User registration endpoint
 * @property {string} auth.login - User login endpoint
 * @property {string} auth.createApiKey - API key creation endpoint
 * @property {Object} auction - Auction-related endpoints
 * @property {string} auction.listings - Listings endpoint
 * @property {string} auction.profiles - User profiles endpoint
 */
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

/**
 * Keys used for storing data in browser storage (localStorage/sessionStorage)
 * @constant {Object}
 * @property {string} token - Key for storing the authentication token
 * @property {string} user - Key for storing the user object
 * @property {string} apiKey - Key for storing the API key
 */
export const STORAGE_KEYS = {
  token: 'accessToken',
  user: 'user',
  apiKey: 'apiKey',
};

/**
 * Pagination limits for API requests
 * @constant {Object}
 * @property {number} DEFAULT - Default number of items per page (12)
 * @property {number} SEARCH - Number of items to fetch when searching (100)
 */
export const PAGINATION_LIMITS = {
  DEFAULT: 21,
  SEARCH: 100,
};
