import axios from 'axios';

export interface Guide {
  id: number;
  fullName: string;
  description?: string;
  phone: string;
  email: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  isActive: boolean;
  createdAt: string;
}

export const fetchGuides = async (): Promise<Guide[]> => {
  try {
    // Netlify serverless function URL
    const response = await axios.get('/.netlify/functions/guides');
    return response.data;
  } catch (error) {
    console.error('Guides Fetch Error:', error);
    
    // Detaylı hata yakalama
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Sunucudan gelen hata
        console.error('Server Error:', error.response.data);
        throw new Error(`Sunucudan hata geldi: ${error.response.data.error}`);
      } else if (error.request) {
        // İstek yapıldı ama yanıt alınamadı
        throw new Error('Sunucudan yanıt alınamadı');
      } else {
        // İstek oluşturulurken hata
        throw new Error('İstek oluşturulurken hata oluştu');
      }
    }
    
    throw error;
  }
};
