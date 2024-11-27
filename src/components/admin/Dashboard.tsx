import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  TrendingUp,
  ThumbsUp,
  MessageCircle,
  Eye,
  Clock,
  Calendar
} from 'lucide-react';

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
  createdAt: string;
}

export default function Dashboard() {
  const [stories, setStories] = useState<Story[]>([]);
  const [stats, setStats] = useState({
    totalStories: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
  });

  useEffect(() => {
    // Fetch stories from localStorage
    const savedStories = localStorage.getItem('travelStories');
    if (savedStories) {
      const parsedStories = JSON.parse(savedStories);
      setStories(parsedStories);
      
      // Calculate stats
      setStats({
        totalStories: parsedStories.length,
        totalViews: parsedStories.reduce((acc: number, story: Story) => acc + (story.views || 0), 0),
        totalLikes: parsedStories.reduce((acc: number, story: Story) => acc + story.likes, 0),
        totalComments: parsedStories.reduce((acc: number, story: Story) => acc + story.comments, 0),
      });
    }
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const RecentStory = ({ story }: { story: Story }) => (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
      <img
        src={story.image}
        alt={story.title}
        className="w-16 h-16 rounded-lg object-cover"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{story.title}</p>
        <div className="flex items-center space-x-3 text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{story.readTime}</span>
          </div>
          <div className="flex items-center">
            <ThumbsUp className="w-4 h-4 mr-1" />
            <span>{story.likes}</span>
          </div>
          <div className="flex items-center">
            <MessageCircle className="w-4 h-4 mr-1" />
            <span>{story.comments}</span>
          </div>
        </div>
      </div>
      <Link
        to={`/admin/stories`}
        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
      >
        Düzenle
      </Link>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hoş Geldiniz, Admin!</h1>
        <p className="mt-1 text-gray-500">
          İşte gezi rehberi uygulamanızın genel durumu
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Toplam Hikaye"
          value={stats.totalStories}
          icon={BookOpen}
          color="bg-indigo-600"
        />
        <StatCard
          title="Toplam Görüntülenme"
          value={stats.totalViews}
          icon={Eye}
          color="bg-emerald-600"
        />
        <StatCard
          title="Toplam Beğeni"
          value={stats.totalLikes}
          icon={ThumbsUp}
          color="bg-blue-600"
        />
        <StatCard
          title="Toplam Yorum"
          value={stats.totalComments}
          icon={MessageCircle}
          color="bg-purple-600"
        />
      </div>

      {/* Recent Stories Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Son Eklenen Hikayeler</h2>
          <Link
            to="/admin/stories"
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Tümünü Gör
          </Link>
        </div>
        <div className="space-y-4">
          {stories.slice(0, 5).map((story) => (
            <RecentStory key={story.id} story={story} />
          ))}
          {stories.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Henüz hikaye yok</h3>
              <p className="mt-1 text-sm text-gray-500">
                Yeni bir hikaye eklemek için başlayın.
              </p>
              <div className="mt-6">
                <Link
                  to="/admin/stories"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <BookOpen className="-ml-1 mr-2 h-5 w-5" />
                  Yeni Hikaye Ekle
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/admin/stories"
            className="flex items-center justify-center space-x-2 p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50"
          >
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span className="font-medium text-gray-900">Yeni Hikaye Ekle</span>
          </Link>
          <button
            onClick={() => window.open('/', '_blank')}
            className="flex items-center justify-center space-x-2 p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50"
          >
            <Eye className="w-5 h-5 text-emerald-600" />
            <span className="font-medium text-gray-900">Siteyi Görüntüle</span>
          </button>
          <Link
            to="/stories"
            className="flex items-center justify-center space-x-2 p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50"
          >
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900">Hikayeleri İncele</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
