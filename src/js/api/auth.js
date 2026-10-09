import { API_ENDPOINTS } from '../utils/constants.js';
import { saveToken, saveUser, saveApiKey } from '../utils/storage.js';
import { getProfile } from './profile.js';
import { parseJson } from './response.js';

/**
 * Registers a new user.
 * @param {string} name - The username.
 * @param {string} email - The Noroff student email.
 * @param {string} password - The account password.
 * @returns {Promise<Object>} The registration response.
 * @throws {Error} If registration fails.
 */
export async function register(name, email, password) {
  const response = await fetch(API_ENDPOINTS.auth.register, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const error = await parseJson(response);
    throw new Error(error.errors?.[0]?.message || 'Registration failed');
  }

  return parseJson(response);
}

/**
 * Creates an API key for an authenticated user.
 * @param {string} token - The user's access token.
 * @returns {Promise<string>} The created API key.
 * @throws {Error} If the API key cannot be created.
 */
export async function createApiKey(token) {
  const response = await fetch(API_ENDPOINTS.auth.createApiKey, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: 'Barter API Key' }),
  });

  if (!response.ok) {
    const error = await parseJson(response);
    throw new Error(error.errors?.[0]?.message || 'Failed to create API key');
  }

  const data = await parseJson(response);
  return data.data.key;
}

/**
 * Authenticates a user and stores the session data.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @param {boolean} [remember=true] - Whether to use persistent storage.
 * @returns {Promise<Object>} The login response.
 * @throws {Error} If authentication or session setup fails.
 */
export async function login(email, password, remember = true) {
  const response = await fetch(API_ENDPOINTS.auth.login, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await parseJson(response);
    throw new Error(error.errors?.[0]?.message || 'Login failed');
  }

  const data = await parseJson(response);

  if (data.data.accessToken) {
    saveToken(data.data.accessToken, remember);

    try {
      const apiKey = await createApiKey(data.data.accessToken);
      saveApiKey(apiKey, remember);

      const profileData = await getProfile(data.data.name);
      const profile = profileData.data;

      const completeUserData = {
        ...data.data,
        credits: profile.credits,
        avatar: profile.avatar,
        banner: profile.banner,
        bio: profile.bio,
      };

      saveUser(completeUserData, remember);
    } catch (error) {
      console.error('Failed to create API key:', error);
      throw new Error(
        'Failed to create API key. Please try logging in again.',
        {
          cause: error,
        }
      );
    }
  } else if (data.data) {
    saveUser(data.data, remember);
  }

  return data;
}
