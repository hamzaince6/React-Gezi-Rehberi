import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyB54FnBVple_fdIJ54G1EUe0nccsrVMLTY');
const UNSPLASH_API_KEY = 'QPxPERHGLldaJCnmNsuNzhiJo3PhWHv4Y40ybVGAhcc';
const UNSPLASH_API_URL = 'https://api.unsplash.com/photos/random';

const DEFAULT_IMAGES = [
    'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
    'https://images.unsplash.com/photo-1519893231300-c52cbd5c9f90',
    'https://images.unsplash.com/photo-1517430816045-df4b7de1c0c4',
    'https://images.unsplash.com/photo-1464052676965-4fadb2a98b67',
    'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6',
    'https://images.unsplash.com/photo-1552641154-e28c1d43c2a1',
    'https://images.unsplash.com/photo-1516707305345-a62366be8b7b',
    'https://images.unsplash.com/photo-1542281286-9e0a16bb7366',
    'https://images.unsplash.com/photo-1499002238440-d264edd596ec',
    'https://images.unsplash.com/photo-1497493292307-31c376b6e479',
];


const PROMPTS = {
 description: (location: string) =>
   `${location} şehri hakkında 400-450 kelimelik detaylı bir tanıtım yazısı yaz. Yıldız işareti, tire ya da özel karakterler kullanma.`,
 
 attractions: (
   location: string
 ) => `${location}'daki popüler 12 turistik mekanı listele. Her mekan için şu formatta yaz:

Mekan Adı
Mekan hakkında 2-3 cümlelik açıklama

Not: Yıldız işareti, tire ya da özel karakterler kullanma. Sadece düz metin olarak yaz.`,
 
 restaurants: (
   location: string
 ) => `${location}'daki en iyi 12 yemek restoranı listele cafelerde olabilir. Her restoran için aşağıdaki formatta yaz ve her restoran arasında boş bir satır bırak:

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
   gibi devam edecek en az 5-6 tane öneri sunalım kullanıcımıza.
  
   `,
};

// Temizleme fonksiyonu
function cleanupText(text: string): string {
 return text
   .replace(/\*\*/g, '') // Yıldız işaretlerini kaldır
   .replace(/^\s*[-*•]\s*/gm, '') // Satır başındaki tire ve bullet işaretlerini kaldır
   .replace(/\[|\]/g, '') // Köşeli parantezleri kaldır
   .replace(/```[^`]*```/g, '') // Code bloklarını kaldır
   .replace(/\n{3,}/g, '\n\n') // Fazla boş satırları temizle
   .replace(/^[0-9]+\.\s*/gm, '') // Numaralandırılmış listeleri kaldır
   .replace(/"/g, '') // Çift tırnakları kaldır
   .replace(/'/g, '') // Tek tırnakları kaldır
   .trim();
}

async function fetchUnsplashImage(query: string): Promise<string> {
 try {
   const response = await fetch(
     `${UNSPLASH_API_URL}?query=${encodeURIComponent(
       query
     )}&orientation=landscape&client_id=${UNSPLASH_API_KEY}`
   );
   if (!response.ok) throw new Error(`Unsplash API error: ${response.status}`);
   const data = await response.json();
   return data.urls?.regular || getRandomDefaultImage();
 } catch (error) {
   console.warn('Unsplash API error:', error);
   return getRandomDefaultImage();
 }
}

function getRandomDefaultImage(): string {
 return DEFAULT_IMAGES[Math.floor(Math.random() * DEFAULT_IMAGES.length)];
}

export async function getTravelRecommendations(
 location: string,
 dates: string
) {
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

         return {
           name,
           description,
           imageUrl: await fetchUnsplashImage(`${name} landmark`),
           link: `https://www.google.com/maps/search/${encodeURIComponent(
             name
           )}`,
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

         return {
           name,
           cuisine,
           description,
           imageUrl: await fetchUnsplashImage(`${cuisine} food restaurant`),
           link: `https://www.google.com/maps/search/${encodeURIComponent(name)}`,
         };
       })
   );

   return {
     description: cleanupText(description.response.text()),
     attractions: processedAttractions.filter(Boolean),
     restaurants: processedRestaurants.filter(Boolean),
     weather: cleanupText(weather.response.text()),
     culturalInfo: cleanupText(culture.response.text()),
     transportationTips: cleanupText(transport.response.text()),
   };
 } catch (error) {
   console.error('Error fetching travel data:', error);
   throw error;
 }
}