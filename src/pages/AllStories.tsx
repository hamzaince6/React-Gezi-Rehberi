import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ThumbsUp, MessageCircle } from 'lucide-react';

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

export default function AllStories() {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const savedStories = localStorage.getItem('travelStories');
    if (savedStories) {
      setStories(JSON.parse(savedStories));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900">Gezgin Hikayeleri</h1>
          <p className="mt-4 text-lg text-gray-600">
            Gezginlerimizin deneyimleri ve önerileri
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg transform hover:scale-[1.02] transition-transform duration-300"
            >
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
                <p className="text-gray-600 mb-4">{story.excerpt}</p>
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
          ))}
        </div>
      </div>
    </div>
  );
}
