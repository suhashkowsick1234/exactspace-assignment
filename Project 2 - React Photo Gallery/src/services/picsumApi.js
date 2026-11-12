/**
 * Picsum API Service
 * Fetches paginated photos from https://picsum.photos/v2/list?page={page}
 */

const BASE_URL = 'https://picsum.photos/v2/list';
const DEFAULT_LIMIT = 20;

/**
 * Fetch a page of photos from the Picsum API
 * @param {number} page - Page number to fetch (1-indexed)
 * @param {number} limit - Number of photos per page (default: 20)
 * @param {AbortSignal} [signal] - Optional abort signal for cancellation
 * @returns {Promise<Array>} List of photo objects
 */
export async function fetchPhotosPage(page = 1, limit = DEFAULT_LIMIT, signal = null) {
  const url = `${BASE_URL}?page=${page}&limit=${limit}`;

  try {
    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new Error(`Failed to load photos (HTTP ${response.status}: ${response.statusText})`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid response format received from Picsum API.');
    }

    // Map and sanitize records ensuring required fields exist
    return data.map((item) => ({
      id: String(item.id),
      author: item.author || 'Unknown Photographer',
      width: item.width,
      height: item.height,
      url: item.url,
      download_url: item.download_url
    }));
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }
    console.error(`Picsum API Fetch Error (Page ${page}):`, error);
    throw error;
  }
}
