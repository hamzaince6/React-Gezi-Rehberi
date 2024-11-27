import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, ThumbsUp, MessageCircle, User } from 'lucide-react';

interface Story {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  readTime: string;
  likes: number;
  comments: number;
}

export default function StoryDetail() {
  const { id } = useParams();
  const [story, setStory] = useState<Story | null>(null);

  useEffect(() => {
    const savedStories = localStorage.getItem('travelStories');
    if (savedStories) {
      const stories = JSON.parse(savedStories);
      const foundStory = stories.find((s: Story) => s.id === Number(id));
      if (foundStory) {
        setStory(foundStory);
      }
    }
  }, [id]);

  if (!story) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <p className="text-gray-600">Hikaye bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Image */}
      <div className="relative h-[50vh] w-full">
        <img
          src={story.image}
          alt={story.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{story.title}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Author Info */}
        <div className="flex items-center mb-8 p-4 bg-white rounded-xl shadow-sm">
          <img
            src={story.author.avatar}
            alt={story.author.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="ml-4">
            <p className="text-lg font-medium text-gray-900">{story.author.name}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{story.readTime} okuma süresi</span>
              </div>
              <div className="flex items-center">
                <ThumbsUp className="w-4 h-4 mr-1" />
                <span>{story.likes} beğeni</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-1" />
                <span>{story.comments} yorum</span>
              </div>
            </div>
          </div>
        </div>

        {/* Story Content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 leading-relaxed mb-8">{story.excerpt}</p>
          
          {/* Örnek içerik - gerçek içerik admin panelinden eklenebilir */}
          <p className="text-gray-600 leading-relaxed mb-6">
            İstanbul'un tarihi sokaklarında yürürken, her köşe başında yeni bir hikaye keşfediyorsunuz. 
            Osmanlı döneminden kalma yapılar, modern sanat galerileri ve yerel lezzetlerin buluştuğu bu 
            şehir, gezginler için adeta bir açık hava müzesi niteliğinde.
          </p>

          <p className="text-gray-600 leading-relaxed mb-6">
            Sabahın erken saatlerinde Kapalıçarşı'nın dar sokaklarında başlayan yolculuğumuz, 
            akşamüstü Galata Kulesi'nin tepesinde muhteşem bir gün batımı manzarasıyla son buldu. 
            Bu kadim şehrin her köşesinde, her anında farklı bir hikaye yaşamak mümkün.
          </p>

          <p className="text-gray-600 leading-relaxed">
            Yerel halkın misafirperverliği, sokak satıcılarının renkli tezgahları ve tarihi 
            yapıların ihtişamı, İstanbul'u benzersiz kılan detaylardan sadece birkaçı. Bu şehirde 
            geçirdiğiniz her an, unutulmaz bir anıya dönüşüyor.
          </p>
        </div>
      </div>
    </div>
  );
}
