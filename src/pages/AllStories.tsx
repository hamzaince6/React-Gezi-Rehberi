import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ThumbsUp, MessageCircle } from 'lucide-react';
import { getAllStories, type Story } from '../api/storyApi';

export default function AllStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const data = await getAllStories();
        setStories(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching stories:', err);
        setError('Hikayeleri yüklerken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const truncateText = (text: string, maxLength: number = 250) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Hikayeler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Tüm Hikayeler</h1>
        {stories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Henüz hikaye bulunmamaktadır.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <div key={story.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {story.title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {truncateText(story.excerpt)}
                    {story.excerpt.length > 250 && (
                      <Link
                        to={`/stories/${story.id}`}
                        className="text-indigo-600 hover:text-indigo-800 ml-1 font-medium"
                      >
                        Devamını Oku
                      </Link>
                    )}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="text-sm text-gray-500">{story.readTime}</span>
                      </div>
                      <div className="flex items-center">
                        <ThumbsUp className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="text-sm text-gray-500">{story.likes}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="text-sm text-gray-500">{story.comments}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <img
                        src={story.author.avatar}
                        alt={story.author.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span className="text-sm text-gray-600">{story.author.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
