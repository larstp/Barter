import { API_ENDPOINTS } from '../utils/constants.js';
import { getToken, getApiKey } from '../utils/storage.js';
import { parseJson } from './response.js';

/**
 * Places a bid on a listing.
 * @param {string} listingId - The listing identifier.
 * @param {number} amount - The bid amount in credits.
 * @returns {Promise<Object>} The bid response.
 * @throws {Error} If the bid cannot be placed.
 */
export async function placeBid(listingId, amount) {
  const token = getToken();
  const apiKey = getApiKey();

  const response = await fetch(
    `${API_ENDPOINTS.auction.listings}/${listingId}/bids`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Noroff-API-Key': apiKey,
      },
      body: JSON.stringify({ amount }),
    }
  );

  if (!response.ok) {
    const error = await parseJson(response);
    throw new Error(error.errors?.[0]?.message || 'Failed to place bid');
  }

  return parseJson(response);
}
