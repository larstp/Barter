import { API_ENDPOINTS } from '../utils/constants.js';
import { saveToken, saveUser, saveApiKey } from '../utils/storage.js';
import { getProfile } from './profile.js';

export async function register(name, email, password) {
  const response = await fetch(API_ENDPOINTS.auth.register, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.message || 'Registration failed');
  }

  return await response.json();
}

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
    const error = await response.json();
    throw new Error(error.errors?.[0]?.message || 'Failed to create API key');
  }

  const data = await response.json();
  return data.data.key;
}

export async function login(email, password, remember = true) {
  // this was confusing
  const response = await fetch(API_ENDPOINTS.auth.login, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.message || 'Login failed');
  }

  const data = await response.json();

  if (data.data.accessToken) {
    saveToken(data.data.accessToken, remember);

    try {
      const apiKey = await createApiKey(data.data.accessToken);
      saveApiKey(apiKey, remember);

      const profileData = await getProfile(data.data.name);
      const profile = profileData.data;

      // AAAAH
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
    // Fallback if no access token (shouldn't happen)
    saveUser(data.data, remember);
  }

  return data;
}
