import axios from 'axios';

const UNSPLASH_API_KEY = 'QPxPERHGLldaJCnmNsuNzhiJo3PhWHv4Y40ybVGAhcc';
const UNSPLASH_API_URL = 'https://api.unsplash.com/photos/random';

// Fallback images in case API fails
const DEFAULT_IMAGES = {
  landmark: [
    'https://images.unsplash.com/photo-1552642986-ccb41e7059e7',
    'https://images.unsplash.com/photo-1583422409516-2895a77efded',
    'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f',
    'https://images.unsplash.com/photo-1547448415-e9f5b28e570d'
  ],
  food: [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
  ],
  city: [
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df',
    'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000',
    'https://images.unsplash.com/photo-1444723121867-7a241cacace9'
  ]
};

export type ImageCategory = 'landmark' | 'food' | 'city';

export async function getRandomImage(query: string, category: ImageCategory): Promise<string> {
  try {
    const response = await axios.get(UNSPLASH_API_URL, {
      params: {
        query: `${query} ${category}`,
        client_id: UNSPLASH_API_KEY,
        orientation: 'landscape'
      }
    });

    return response.data.urls.regular;
  } catch (error) {
    console.warn('Failed to fetch image from Unsplash:', error);
    // Return a random fallback image from the appropriate category
    const fallbackImages = DEFAULT_IMAGES[category];
    return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  }
}