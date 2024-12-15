import { GoogleGenerativeAI } from '@google/generative-ai';
import { getRandomImage } from '../services/imageService';
import type { ImageCategory } from '../services/imageService';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GENERATIVE_AI_KEY);

const PROMPTS = {
  description: (location: string) =>
    `${location} şehri hakkında 400-450 kelimelik detaylı bir tanıtım yazısı yaz. Yıldız işareti, tire ya da özel karakterler kullanma.`,
  
  attractions: (location: string) =>
    `${location}'daki popüler 12 turistik mekanı listele. Her mekan için şu formatta yaz:

Mekan Adı
Mekan hakkında 2-3 cümlelik açıklama

Not: Yıldız işareti, tire ya da özel karakterler kullanma. Sadece düz metin olarak yaz.`,
  
  restaurants: (location: string) =>
    `${location}'daki en iyi 12 yemek restoranı listele cafelerde olabilir. Her restoran için aşağıdaki formatta yaz ve her restoran arasında boş bir satır bırak:

Restoran Adı
Mutfak Türü
Mekan hakkında 2-3 cümlelik açıklama

Not: Yıldız işareti, tire ya da özel karakterler kullanma. Sadece düz metin olarak yaz.`,
  
  weather: (location: string) =>
    `${location} için mevsimsel hava durumu bilgilerini ve ziyaret için en uygun zamanları 150-200 kelime ile açıkla. Yıldız işareti, tire ya da özel karakterler kullanma.`,
  
  culture: (location: string) =>
    `${location}'ın kültürel özellikleri ve gelenekleri hakkında 250-300 kelimelik özet bir yazı yaz. Yıldız işareti, tire ya da özel karakterler kullanma.`,
  
  transport: (location: string) =>
    `${location} içinde ulaşım alternatifleri ve önerileri hakkında 250-300 kelimelik bilgilendirici bir yazı yaz. yazıları maddeler halinde ver ve başlarına ilgili iconları koy, Yıldız işareti, tire ya da özel karakterler kullanma.
    Her alternatif için şöyle yaz;
    Bunları alt alta yazmanı istiyorum liste halinde olabilir
    1- Otobüs iconu Otobüs açıklaması 
    2- Taksi iconu Taksi Açıklaması 
    gibi devam edecek en az 5-6 tane öneri sunalım kullanıcımıza.`
};

function cleanupText(text: string): string {
  return text
    .replace(/\*\*/g, '')
    .replace(/^\s*[-*•]\s*/gm, '')
    .replace(/\[|\]/g, '')
    .replace(/```[^`]*```/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^[0-9]+\.\s*/gm, '')
    .replace(/"/g, '')
    .replace(/'/g, '')
    .trim();
}

export async function getTravelRecommendations(location: string, dates: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const [description, attractions, restaurants, weather, culture, transport] =
      await Promise.all([
        model.generateContent(PROMPTS.description(location)),
        model.generateContent(PROMPTS.attractions(location)),
        model.generateContent(PROMPTS.restaurants(location)),
        model.generateContent(PROMPTS.weather(location)),
        model.generateContent(PROMPTS.culture(location)),
        model.generateContent(PROMPTS.transport(location)),
      ]);

    const processedAttractions = await Promise.all(
      cleanupText(attractions.response.text())
        .split('\n\n')
        .filter((entry) => entry.trim())
        .map(async (entry) => {
          const lines = entry.split('\n').filter((line) => line.trim());
          if (lines.length < 2) return null;

          const name = lines[0].trim();
          const description = lines.slice(1).join(' ').trim();
          const imageUrl = await getRandomImage(`${location} ${name}`, 'landmark');

          return {
            name,
            description,
            imageUrl,
            link: `https://www.google.com/maps/search/${encodeURIComponent(name)}`
          };
        })
    );

    const processedRestaurants = await Promise.all(
      cleanupText(restaurants.response.text())
        .split('\n\n')
        .filter((entry) => entry.trim())
        .map(async (entry) => {
          const lines = entry.split('\n').filter((line) => line.trim());
          if (lines.length < 3) return null;

          const name = lines[0].trim();
          const cuisineLine = lines.find((line) => line.toLowerCase().includes('mutfak'));
          const cuisine = cuisineLine || 'Yerel Mutfak';
          const description = lines
            .filter((line) => line !== name && line !== cuisineLine)
            .join(' ')
            .trim();

          const imageUrl = await getRandomImage(`${cuisine} food`, 'food');

          return {
            name,
            cuisine,
            description,
            imageUrl,
            link: `https://www.google.com/maps/search/${encodeURIComponent(name)}`
          };
        })
    );

    return {
      description: cleanupText(description.response.text()),
      attractions: processedAttractions.filter(Boolean),
      restaurants: processedRestaurants.filter(Boolean),
      weather: cleanupText(weather.response.text()),
      culturalInfo: cleanupText(culture.response.text()),
      transportationTips: cleanupText(transport.response.text())
    };
  } catch (error) {
    console.error('Error fetching travel data:', error);
    throw error;
  }
}