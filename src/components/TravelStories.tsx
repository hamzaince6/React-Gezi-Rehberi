import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { Clock, ThumbsUp, MessageCircle, ArrowRight } from 'lucide-react';
import axios from 'axios'; // Make sure to import axios

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

export default function TravelStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        // Update this URL to match your backend API endpoint
        const response = await axios.get('http://localhost:3001/api/stories');
        setStories(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stories:', err);
        setError('Failed to load stories');
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  if (loading) {
    return (
      <div className="py-20 bg-gray-50 text-center">
        <p>Hikayeler yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 bg-gray-50 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="py-20 bg-gray-50 text-center">
        <p>Henüz hikaye bulunmamaktadır.</p>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Gezgin Hikayeleri</h2>
          <p className="mt-4 text-lg text-gray-600">
            Gezginlerimizin deneyimleri ve önerileri
          </p>
        </div>

        <Splide
          options={{
            type: 'loop',
            perPage: 3,
            perMove: 1,
            gap: '2rem',
            pagination: false,
            breakpoints: {
              1024: {
                perPage: 2,
              },
              768: {
                perPage: 1,
              },
            },
          }}
        >
          {stories.map((story) => (
            <SplideSlide key={story.id}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg h-full">
                <div className="relative h-48">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={story.author.avatar}
                      alt={story.author.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {story.author.name}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {story.readTime}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{story.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{story.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        <span>{story.likes}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span>{story.comments}</span>
                      </div>
                    </div>
                    <Link
                      to={`/stories/${story.id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Devamını Oku
                    </Link>
                  </div>
                </div>
              </div>
            </SplideSlide>
          ))}
        </Splide>

        <div className="mt-12 text-center">
          <Link
            to="/stories"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Tüm Hikayeleri Gör
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}