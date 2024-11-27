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

export const fetchStories = async (): Promise<TravelStory[]> => {
  try {
    console.log('Hikayeler çağrısı başlatılıyor...');
    
    const response = await axios.get('/.netlify/functions/stories', {
      timeout: 15000, // 15 saniye timeout
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('API Yanıtı:', response.data);

    if (!response.data || response.data.length === 0) {
      console.warn('Hikaye bulunamadı');
      return [];
    }

    console.log(`Toplam ${response.data.length} hikaye getirildi`);
    return response.data;
  } catch (error) {
    console.error('Hikayeler Getirilirken Hata:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Sunucu Hatası:', error.response.data);
        throw new Error(`Sunucudan hata geldi: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        throw new Error('Sunucudan yanıt alınamadı');
      } else {
        throw new Error('İstek oluşturulurken hata oluştu');
      }
    }
    
    throw error;
  }
};
