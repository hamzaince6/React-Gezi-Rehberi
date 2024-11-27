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

// API URL'sini ortama göre ayarla
const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:5000/api'  // Geliştirme ortamı
  : '/.netlify/functions';       // Üretim ortamı

export const fetchStories = async (): Promise<TravelStory[]> => {
  try {
    console.log('Hikayeler çağrısı başlatılıyor...', { API_BASE_URL });
    
    const response = await axios.get(`${API_BASE_URL}/stories`, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('API Yanıtı:', response.data);

    if (!response.data) {
      console.warn('API yanıtı boş');
      return [];
    }

    if (Array.isArray(response.data)) {
      console.log(`Toplam ${response.data.length} hikaye getirildi`);
      return response.data;
    } else if (response.data.recordset && Array.isArray(response.data.recordset)) {
      console.log(`Toplam ${response.data.recordset.length} hikaye getirildi`);
      return response.data.recordset;
    } else {
      console.error('Beklenmeyen API yanıt formatı:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Hikayeler Getirilirken Hata:', {
      error,
      baseUrl: API_BASE_URL,
      env: import.meta.env.MODE
    });
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`Sunucu hatası: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        throw new Error(`Sunucuya ulaşılamadı: ${API_BASE_URL}/stories`);
      }
    }
    
    throw error;
  }
};
