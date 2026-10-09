/**
 * Safely parses an API response body.
 * @param {Response} response - The fetch response.
 * @returns {Promise<Object>} The parsed body, or an empty object when unavailable.
 */
export async function parseJson(response) {
  return response.json().catch(() => ({}));
}
