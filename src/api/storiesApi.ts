import axios from 'axios';

export interface TravelStory {
  id: number;
  title: string;
  content: string;
  author: string;
  location: string;
  imageUrl?: string;
  createdAt: string;
}

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://enchanting-duckanoo-aae29f.netlify.app/.netlify/functions'
  : '/.netlify/functions';

export const fetchStories = async (): Promise<TravelStory[]> => {
  try {
    console.log('Hikayeler çağrısı başlatılıyor...', API_BASE_URL);
    
    const response = await axios.get(`${API_BASE_URL}/stories`, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.data) {
      console.warn('API yanıtı boş');
      return [];
    }

    console.log('API Yanıtı:', response.data);

    if (!Array.isArray(response.data)) {
      console.error('API yanıtı bir dizi değil:', response.data);
      return [];
    }

    if (response.data.length === 0) {
      console.warn('Hikaye bulunamadı');
      return [];
    }

    console.log(`Toplam ${response.data.length} hikaye getirildi`);
    return response.data;
  } catch (error) {
    console.error('Hikayeler Getirilirken Hata:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Sunucu Hatası:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        throw new Error(`Sunucu hatası: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error('İstek Hatası:', error.request);
        throw new Error('Sunucudan yanıt alınamadı');
      } else {
        console.error('Axios Hatası:', error.message);
        throw new Error('İstek oluşturulurken hata oluştu');
      }
    }
    
    throw error;
  }
};
